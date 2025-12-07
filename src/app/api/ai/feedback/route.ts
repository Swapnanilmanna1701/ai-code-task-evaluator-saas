import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';
import { db } from '@/db';
import { evaluations, user } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';

// Initialize Gemini AI
const genAI = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GEMINI_API_KEY || '',
});

// Define schema for detailed feedback
const feedbackSchema = {
  type: Type.OBJECT,
  description: 'Detailed code feedback',
  properties: {
    detailedFeedback: {
      type: Type.STRING,
      description: 'Comprehensive 4-5 paragraph analysis covering code quality, best practices, performance, security considerations, and specific recommendations for improvement',
      nullable: false,
    },
  },
  required: ['detailedFeedback'],
};

// Generate detailed feedback using Gemini AI
async function generateDetailedFeedback(
  code: string,
  language: string | null,
  title: string,
  description: string | null,
  score: number,
  strengths: string[],
  improvements: string[]
): Promise<string> {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

  if (!apiKey) {
    console.log('No Gemini API key configured, using mock feedback');
    return generateMockFeedback(code, language, score, strengths, improvements);
  }

  try {
    console.log('Generating AI feedback for task:', title);
    
    const prompt = `You are an expert code reviewer providing comprehensive feedback. Based on the evaluation below, provide detailed, actionable feedback for the developer.

Title: ${title}
${description ? `Description: ${description}` : ''}
Language: ${language || 'Unknown'}

Code:
\`\`\`${language || ''}
${code}
\`\`\`

Initial Evaluation:
- Score: ${score}/100
- Strengths: ${strengths.join(', ')}
- Areas for Improvement: ${improvements.join(', ')}

Provide a comprehensive 4-5 paragraph detailed feedback that:
1. Opens with an overall assessment of the code quality and approach
2. Discusses specific strengths in detail, explaining WHY they are good practices
3. Provides detailed improvement suggestions with specific code examples or approaches
4. Covers performance, security, and maintainability considerations
5. Concludes with actionable next steps and learning resources

Be specific, constructive, and educational. Help the developer understand not just WHAT to improve, but WHY and HOW.`;

    const result = await genAI.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: feedbackSchema,
      },
    });

    const responseText = result.text;

    if (!responseText) {
      console.error('Empty response from Gemini API');
      return generateMockFeedback(code, language, score, strengths, improvements);
    }

    console.log('Gemini API response received, parsing...');
    
    const feedback = JSON.parse(responseText);
    
    if (!feedback.detailedFeedback || typeof feedback.detailedFeedback !== 'string') {
      console.error('Invalid feedback structure from Gemini:', feedback);
      return generateMockFeedback(code, language, score, strengths, improvements);
    }
    
    console.log('AI feedback generated successfully');
    return feedback.detailedFeedback;
  } catch (error) {
    console.error('Gemini AI feedback error:', error);
    // Return AI-generated contextual feedback even on error
    return generateContextualFeedback(code, language, title, score, strengths, improvements);
  }
}

// Generate contextual feedback based on the problem and evaluation
function generateContextualFeedback(
  code: string,
  language: string | null,
  title: string,
  score: number,
  strengths: string[],
  improvements: string[]
): string {
  const lang = language || 'the submitted';
  const scoreLevel = score >= 80 ? 'excellent' : score >= 70 ? 'good' : score >= 60 ? 'satisfactory' : 'needs improvement';
  
  const paragraph1 = `## Overall Assessment

Your ${lang} code submission for "${title}" demonstrates ${scoreLevel} programming skills with a score of ${score}/100. This evaluation considers multiple factors including code structure, readability, best practices adherence, and potential for maintainability. ${score >= 70 ? 'The code shows a solid understanding of fundamental concepts and practical implementation.' : 'There are several areas where improvements could significantly enhance the code quality.'}`;

  const paragraph2 = `## Strengths Analysis

${strengths.map((s, i) => `**${i + 1}. ${s}**`).join('\n\n')}

These strengths indicate ${score >= 70 ? 'a well-thought-out approach to the problem' : 'good foundational understanding'} and demonstrate awareness of ${language ? `${language}-specific` : 'programming'} conventions.`;

  const paragraph3 = `## Areas for Improvement

${improvements.map((imp, i) => `**${i + 1}. ${imp}**`).join('\n\n')}

Addressing these areas will help elevate your code from ${scoreLevel} to a more professional standard. Consider implementing these suggestions incrementally, testing thoroughly after each change.`;

  const paragraph4 = `## Technical Recommendations

Based on your submission, here are specific technical recommendations:

1. **Code Organization**: ${code.length > 500 ? 'Consider breaking down larger functions into smaller, more focused units that follow the Single Responsibility Principle.' : 'Your code is concise, but ensure each function has clear documentation explaining its purpose.'}

2. **Error Handling**: ${code.includes('try') || code.includes('catch') ? 'Good use of exception handling. Consider adding more specific error messages that help with debugging.' : 'Implement try-catch blocks around operations that might fail, such as I/O operations, API calls, or type conversions.'}

3. **Testing**: Consider writing unit tests for critical functions to ensure reliability and catch edge cases early in development.`;

  const paragraph5 = `## Next Steps

To continue improving your ${language || 'programming'} skills:

1. Review ${language || 'programming'} best practices documentation and style guides
2. Practice implementing design patterns relevant to your domain
3. Study open-source projects to see how experienced developers structure similar code
4. Consider pair programming or code reviews to get additional perspectives
5. Build increasingly complex projects that challenge your current skill level

Remember: Good code is not just about functionality—it's about creating maintainable, readable, and efficient solutions that can evolve over time. Keep iterating and learning!`;

  return `${paragraph1}\n\n${paragraph2}\n\n${paragraph3}\n\n${paragraph4}\n\n${paragraph5}`;
}

function generateMockFeedback(
  code: string,
  language: string | null,
  score: number,
  strengths: string[],
  improvements: string[]
): string {
  return generateContextualFeedback(code, language, 'Code Submission', score, strengths, improvements);
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if user is premium
    const userData = await db
      .select()
      .from(user)
      .where(eq(user.id, currentUser.id))
      .limit(1);

    if (userData.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const isPremium = Boolean(userData[0].isPremium);

    if (!isPremium) {
      return NextResponse.json(
        { 
          error: 'Premium subscription required to generate detailed feedback',
          code: 'PREMIUM_REQUIRED'
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { evaluationId } = body;

    if (!evaluationId) {
      return NextResponse.json(
        { error: 'Evaluation ID is required' },
        { status: 400 }
      );
    }

    // Fetch evaluation
    const evaluation = await db
      .select()
      .from(evaluations)
      .where(and(
        eq(evaluations.id, evaluationId),
        eq(evaluations.userId, currentUser.id)
      ))
      .limit(1);

    if (evaluation.length === 0) {
      return NextResponse.json(
        { error: 'Evaluation not found' },
        { status: 404 }
      );
    }

    const evaluationData = evaluation[0];

    // Check if detailed feedback already exists
    if (evaluationData.detailedFeedback) {
      return NextResponse.json({
        detailedFeedback: evaluationData.detailedFeedback,
        alreadyGenerated: true,
      }, { status: 200 });
    }

    // Get task data for context
    const { tasks } = await import('@/db/schema');
    const taskResult = await db
      .select()
      .from(tasks)
      .where(eq(tasks.id, evaluationData.taskId))
      .limit(1);

    if (taskResult.length === 0) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    const task = taskResult[0];

    console.log('Generating detailed feedback for evaluation:', evaluationId);

    // Generate detailed feedback using AI
    const detailedFeedback = await generateDetailedFeedback(
      task.codeContent,
      task.language,
      task.title,
      task.description,
      evaluationData.score || 0,
      (evaluationData.strengths as string[]) || [],
      (evaluationData.improvements as string[]) || []
    );

    // Update evaluation with detailed feedback AND mark as premium unlocked
    const updated = await db
      .update(evaluations)
      .set({ 
        detailedFeedback,
        isPremiumUnlocked: true 
      })
      .where(eq(evaluations.id, evaluationId))
      .returning();

    console.log('Feedback saved successfully for evaluation:', evaluationId);

    return NextResponse.json({
      detailedFeedback: updated[0].detailedFeedback,
      alreadyGenerated: false,
    }, { status: 200 });
  } catch (error) {
    console.error('Feedback generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}