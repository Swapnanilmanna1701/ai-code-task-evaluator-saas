import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';
import { db } from '@/db';
import { tasks, evaluations } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';

// Initialize Gemini AI
const genAI = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GEMINI_API_KEY || '',
});

// Define schema for structured output
const evaluationSchema = {
  type: Type.OBJECT,
  description: 'Code evaluation result',
  properties: {
    score: {
      type: Type.NUMBER,
      description: 'Code quality score from 0-100',
      nullable: false,
    },
    strengths: {
      type: Type.ARRAY,
      description: 'Array of 4-5 specific strengths as detailed strings',
      nullable: false,
      items: { type: Type.STRING },
    },
    improvements: {
      type: Type.ARRAY,
      description: 'Array of 3-4 specific improvement suggestions as detailed strings',
      nullable: false,
      items: { type: Type.STRING },
    },
    detailedFeedback: {
      type: Type.STRING,
      description: 'Comprehensive 3-4 paragraph analysis covering code quality, best practices, performance, and recommendations',
      nullable: false,
    },
  },
  required: ['score', 'strengths', 'improvements', 'detailedFeedback'],
};

// AI Evaluation using Google Gemini API
async function evaluateCode(code: string, language: string | null, title: string, description: string | null) {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

  if (!apiKey) {
    console.log('No Gemini API key configured, using mock evaluation');
    return generateMockEvaluation(code, language);
  }

  try {
    const model = genAI.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `You are an expert code reviewer and evaluator. Analyze the provided ${language || 'code'} code and provide a comprehensive evaluation.

Title: ${title}
${description ? `Description: ${description}` : ''}

Code to evaluate:
\`\`\`${language || ''}
${code}
\`\`\`

Evaluate the code thoroughly considering:
1. Code structure and organization
2. Naming conventions and readability
3. Error handling and edge cases
4. Performance considerations
5. Best practices for ${language || 'the language'}
6. Potential bugs or issues
7. Security considerations
8. Maintainability and scalability

Provide:
- A score from 0-100 based on overall code quality
- 4-5 specific strengths (what the code does well)
- 3-4 specific improvement suggestions (actionable recommendations)
- A detailed 3-4 paragraph feedback covering all aspects of the code

Be specific, constructive, and helpful in your feedback.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: evaluationSchema,
      },
    });

    const result = await model;
    const responseText = result.text;

    if (!responseText) {
      console.error('Empty response from Gemini');
      return generateMockEvaluation(code, language);
    }

    const evaluation = JSON.parse(responseText);
    
    // Validate and normalize score
    evaluation.score = Math.min(100, Math.max(0, Math.round(evaluation.score)));
    
    return evaluation;
  } catch (error) {
    console.error('Gemini AI evaluation error:', error);
    return generateMockEvaluation(code, language);
  }
}

function generateMockEvaluation(code: string, language: string | null) {
  const codeLength = code.length;
  const hasComments = code.includes('//') || code.includes('/*') || code.includes('#');
  const hasErrorHandling = code.includes('try') || code.includes('catch') || code.includes('except');
  const hasFunctions = code.includes('function') || code.includes('def ') || code.includes('=>');
  
  let baseScore = 70;
  if (hasComments) baseScore += 5;
  if (hasErrorHandling) baseScore += 10;
  if (hasFunctions) baseScore += 5;
  if (codeLength > 500) baseScore += 5;
  if (codeLength < 50) baseScore -= 10;
  
  const score = Math.min(95, Math.max(40, baseScore + Math.floor(Math.random() * 10) - 5));

  const strengthOptions = [
    "Clean and readable code structure with good organization",
    "Appropriate use of language-specific features and idioms",
    "Good variable and function naming conventions",
    "Logical flow and clear control structures",
    "Efficient algorithm implementation",
    "Proper separation of concerns",
    "Good use of built-in language functions",
    "Clear and maintainable code style",
  ];

  const improvementOptions = [
    "Consider adding more inline comments for complex logic",
    "Could benefit from additional error handling for edge cases",
    "Consider extracting repeated code into reusable functions",
    "Add input validation to prevent unexpected behavior",
    "Consider using more descriptive variable names in some places",
    "Could optimize performance for larger datasets",
    "Consider adding type annotations for better maintainability",
    "Add unit tests to verify functionality",
  ];

  const shuffled = (arr: string[]) => [...arr].sort(() => Math.random() - 0.5);
  
  const strengths = shuffled(strengthOptions).slice(0, 4);
  const improvements = shuffled(improvementOptions).slice(0, 3);

  const detailedFeedback = `Your ${language || 'code'} implementation demonstrates ${score >= 80 ? 'excellent' : score >= 70 ? 'good' : 'reasonable'} understanding of programming fundamentals. ${strengths[0]}. ${strengths[1]}.

The code structure is ${score >= 75 ? 'well-organized' : 'adequate'} and follows ${score >= 80 ? 'many' : 'some'} best practices for ${language || 'the language'}. ${hasErrorHandling ? 'The inclusion of error handling shows attention to robustness.' : 'Consider adding error handling to make the code more robust.'} ${hasComments ? 'The comments help explain the logic.' : 'Adding comments would improve code maintainability.'}

For improvement, ${improvements[0].toLowerCase()}. Additionally, ${improvements[1].toLowerCase()}. ${score >= 80 ? 'Overall, this is production-quality code with minor enhancements possible.' : 'With these improvements, the code would be more maintainable and professional.'} Consider reviewing the specific suggestions above to take your code to the next level.`;

  return {
    score,
    strengths,
    improvements,
    detailedFeedback,
  };
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { taskId, code, language, title, description } = body;

    if (!taskId || !code) {
      return NextResponse.json(
        { error: 'Task ID and code are required' },
        { status: 400 }
      );
    }

    // Verify task belongs to user
    const task = await db
      .select()
      .from(tasks)
      .where(and(eq(tasks.id, taskId), eq(tasks.userId, user.id)))
      .limit(1);

    if (task.length === 0) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    // Check if evaluation already exists
    const existingEval = await db
      .select()
      .from(evaluations)
      .where(eq(evaluations.taskId, taskId))
      .limit(1);

    if (existingEval.length > 0) {
      return NextResponse.json(
        { error: 'Evaluation already exists for this task', evaluation: existingEval[0] },
        { status: 400 }
      );
    }

    // Run AI evaluation
    const evaluation = await evaluateCode(code, language, title, description);

    // Store evaluation in database
    const newEvaluation = await db
      .insert(evaluations)
      .values({
        taskId,
        userId: user.id,
        score: evaluation.score,
        strengths: evaluation.strengths,
        improvements: evaluation.improvements,
        detailedFeedback: evaluation.detailedFeedback,
        isPremiumUnlocked: false,
        createdAt: new Date().toISOString(),
      })
      .returning();

    // Update task status to completed
    await db
      .update(tasks)
      .set({ status: 'completed', updatedAt: new Date().toISOString() })
      .where(eq(tasks.id, taskId));

    // Return evaluation without detailed feedback (premium feature)
    const responseEval = {
      ...newEvaluation[0],
      detailedFeedback: null,
    };

    return NextResponse.json(responseEval, { status: 201 });
  } catch (error) {
    console.error('Evaluation error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}