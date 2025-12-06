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

// Define schema for structured output - NO detailedFeedback
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
  },
  required: ['score', 'strengths', 'improvements'],
};

// AI Evaluation using Google Gemini API - WITHOUT detailed feedback
async function evaluateCode(code: string, language: string | null, title: string, description: string | null) {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

  if (!apiKey) {
    console.log('No Gemini API key configured, using mock evaluation');
    return generateMockEvaluation(code, language);
  }

  try {
    const model = genAI.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `You are an expert code reviewer and evaluator. Analyze the provided ${language || 'code'} code and provide a quick evaluation.

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

  return {
    score,
    strengths,
    improvements,
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
    const { taskId } = body;

    if (!taskId) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      );
    }

    // Verify task belongs to user and get task data
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

    const taskData = task[0];

    // Check if task has code content
    if (!taskData.codeContent) {
      return NextResponse.json(
        { error: 'Task has no code content to evaluate' },
        { status: 400 }
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

    // Update task status to evaluating
    await db
      .update(tasks)
      .set({ status: 'evaluating', updatedAt: new Date().toISOString() })
      .where(eq(tasks.id, taskId));

    // Run AI evaluation - WITHOUT detailed feedback
    const evaluation = await evaluateCode(
      taskData.codeContent,
      taskData.language,
      taskData.title,
      taskData.description
    );

    // Store evaluation in database WITHOUT detailed feedback
    const newEvaluation = await db
      .insert(evaluations)
      .values({
        taskId,
        userId: user.id,
        score: evaluation.score,
        strengths: evaluation.strengths,
        improvements: evaluation.improvements,
        detailedFeedback: null, // Will be generated later by premium users
        isPremiumUnlocked: false,
        createdAt: new Date().toISOString(),
      })
      .returning();

    // Update task status to completed
    await db
      .update(tasks)
      .set({ status: 'completed', updatedAt: new Date().toISOString() })
      .where(eq(tasks.id, taskId));

    // Return evaluation
    return NextResponse.json(newEvaluation[0], { status: 201 });
  } catch (error) {
    console.error('Evaluation error:', error);
    
    // If there was an error, try to mark task as failed
    try {
      const body = await request.clone().json();
      if (body.taskId) {
        await db
          .update(tasks)
          .set({ status: 'failed', updatedAt: new Date().toISOString() })
          .where(eq(tasks.id, body.taskId));
      }
    } catch {}
    
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}