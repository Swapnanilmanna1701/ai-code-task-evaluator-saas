import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { tasks, evaluations, user } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Validate ID parameter
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid task ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const taskId = parseInt(id);

    // Fetch task with user scope
    const taskResult = await db
      .select()
      .from(tasks)
      .where(and(eq(tasks.id, taskId), eq(tasks.userId, currentUser.id)))
      .limit(1);

    if (taskResult.length === 0) {
      return NextResponse.json(
        { error: 'Task not found', code: 'TASK_NOT_FOUND' },
        { status: 404 }
      );
    }

    const task = taskResult[0];

    // Check if user is premium
    const userData = await db
      .select()
      .from(user)
      .where(eq(user.id, currentUser.id))
      .limit(1);

    const isPremiumUser = userData.length > 0 && Boolean(userData[0].isPremium);

    // Fetch related evaluation with user scope
    const evaluationResult = await db
      .select()
      .from(evaluations)
      .where(and(eq(evaluations.taskId, taskId), eq(evaluations.userId, currentUser.id)))
      .limit(1);

    let evaluation = null;

    if (evaluationResult.length > 0) {
      const evaluationData = evaluationResult[0];
      
      // Premium users OR unlocked evaluations can see detailedFeedback
      const canSeeDetailedFeedback = isPremiumUser || evaluationData.isPremiumUnlocked;
      
      evaluation = {
        id: evaluationData.id,
        taskId: evaluationData.taskId,
        userId: evaluationData.userId,
        score: evaluationData.score,
        strengths: evaluationData.strengths,
        improvements: evaluationData.improvements,
        detailedFeedback: canSeeDetailedFeedback 
          ? evaluationData.detailedFeedback 
          : null,
        isPremiumUnlocked: evaluationData.isPremiumUnlocked,
        createdAt: evaluationData.createdAt,
      };
    }

    return NextResponse.json(
      {
        task,
        evaluation,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET task error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}