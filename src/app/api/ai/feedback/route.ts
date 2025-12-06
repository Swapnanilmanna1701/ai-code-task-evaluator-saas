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
) {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

  if (!apiKey) {
    console.log('No Gemini API key configured, using mock feedback');
    return generateMockFeedback(code, language, score, strengths, improvements);
  }

  try {
    const model = genAI.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `You are an expert code reviewer providing comprehensive feedback. Based on the evaluation below, provide detailed, actionable feedback for the developer.

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

Be specific, constructive, and educational. Help the developer understand not just WHAT to improve, but WHY and HOW.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: feedbackSchema,
      },
    });

    const result = await model;
    const responseText = result.text;

    if (!responseText) {
      console.error('Empty response from Gemini');
      return generateMockFeedback(code, language, score, strengths, improvements);
    }

    const feedback = JSON.parse(responseText);
    return feedback.detailedFeedback;
  } catch (error) {
    console.error('Gemini AI feedback error:', error);
    return generateMockFeedback(code, language, score, strengths, improvements);
  }
}

function generateMockFeedback(
  code: string,
  language: string | null,
  score: number,
  strengths: string[],
  improvements: string[]
): string {
  const hasComments = code.includes('//') || code.includes('/*') || code.includes('#');
  const hasErrorHandling = code.includes('try') || code.includes('catch') || code.includes('except');

  return `Your ${language || 'code'} implementation demonstrates ${score >= 80 ? 'strong' : score >= 70 ? 'good' : 'reasonable'} programming fundamentals with a score of ${score}/100. ${strengths[0] || 'The code shows understanding of core concepts'}. ${strengths[1] || 'The implementation follows logical patterns'}.

Looking at the code structure in detail, ${hasComments ? 'the inclusion of comments demonstrates good documentation practices, which significantly improves code maintainability for future developers' : 'adding comments would greatly improve code readability and help other developers (including your future self) understand the logic and decision-making process'}. ${hasErrorHandling ? 'The error handling shows attention to robustness and production-ready thinking, which is essential for reliable applications' : 'Implementing comprehensive error handling would make the code more robust and production-ready'}.

${improvements[0] || 'Consider refactoring complex logic into smaller functions'}. This would improve readability and make the code easier to test and maintain. ${improvements[1] || 'Adding input validation would prevent unexpected behavior'}. Specifically, validating data types, ranges, and edge cases before processing ensures your code handles real-world scenarios gracefully. ${improvements[2] || 'Consider performance optimizations for larger datasets'}.

From a broader perspective, ${score >= 80 ? 'this code is production-quality and shows professional-level understanding' : 'with the suggested improvements, this code would reach production-quality standards'}. Consider researching design patterns specific to ${language || 'your language'}, practicing test-driven development to catch edge cases early, and reviewing code from open-source projects to see how experienced developers structure similar functionality. These practices will accelerate your growth as a developer.

To take your code to the next level, focus on: implementing comprehensive unit tests to verify functionality and catch regressions, optimizing for both time and space complexity where it matters, and continuously refactoring to improve clarity without changing behavior. Remember that great code is not just functional—it's maintainable, testable, and understandable by others.`;
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

    // Generate detailed feedback
    const detailedFeedback = await generateDetailedFeedback(
      task.codeContent,
      task.language,
      task.title,
      task.description,
      evaluationData.score || 0,
      (evaluationData.strengths as string[]) || [],
      (evaluationData.improvements as string[]) || []
    );

    // Update evaluation with detailed feedback
    const updated = await db
      .update(evaluations)
      .set({ detailedFeedback })
      .where(eq(evaluations.id, evaluationId))
      .returning();

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
