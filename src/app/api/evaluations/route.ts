import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { evaluations, tasks } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const taskId = searchParams.get('taskId');
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    if (id) {
      const idNum = parseInt(id);
      if (isNaN(idNum)) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const evaluation = await db
        .select()
        .from(evaluations)
        .where(and(eq(evaluations.id, idNum), eq(evaluations.userId, user.id)))
        .limit(1);

      if (evaluation.length === 0) {
        return NextResponse.json(
          { error: 'Evaluation not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      const result = { ...evaluation[0] };
      if (!result.isPremiumUnlocked) {
        result.detailedFeedback = null;
      }

      return NextResponse.json(result, { status: 200 });
    }

    let query = db
      .select()
      .from(evaluations)
      .where(eq(evaluations.userId, user.id));

    if (taskId) {
      const taskIdNum = parseInt(taskId);
      if (!isNaN(taskIdNum)) {
        query = db
          .select()
          .from(evaluations)
          .where(
            and(
              eq(evaluations.userId, user.id),
              eq(evaluations.taskId, taskIdNum)
            )
          );
      }
    }

    const results = await query.limit(limit).offset(offset);

    const filteredResults = results.map((evaluation) => {
      const result = { ...evaluation };
      if (!result.isPremiumUnlocked) {
        result.detailedFeedback = null;
      }
      return result;
    });

    return NextResponse.json(filteredResults, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const body = await request.json();

    if ('userId' in body && body.userId !== user.id) {
      return NextResponse.json(
        {
          error: 'User ID cannot be provided in request body',
          code: 'USER_ID_NOT_ALLOWED',
        },
        { status: 400 }
      );
    }

    const { taskId, score, strengths, improvements, detailedFeedback } = body;

    if (!taskId) {
      return NextResponse.json(
        { error: 'taskId is required', code: 'MISSING_TASK_ID' },
        { status: 400 }
      );
    }

    const taskIdNum = parseInt(taskId);
    if (isNaN(taskIdNum)) {
      return NextResponse.json(
        { error: 'taskId must be a valid integer', code: 'INVALID_TASK_ID' },
        { status: 400 }
      );
    }

    const task = await db
      .select()
      .from(tasks)
      .where(and(eq(tasks.id, taskIdNum), eq(tasks.userId, user.id)))
      .limit(1);

    if (task.length === 0) {
      return NextResponse.json(
        { error: 'Task not found or does not belong to user', code: 'TASK_NOT_FOUND' },
        { status: 400 }
      );
    }

    if (score !== undefined && score !== null) {
      const scoreNum = parseInt(score);
      if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 100) {
        return NextResponse.json(
          {
            error: 'score must be an integer between 0 and 100',
            code: 'INVALID_SCORE',
          },
          { status: 400 }
        );
      }
    }

    if (strengths !== undefined && strengths !== null) {
      if (!Array.isArray(strengths)) {
        return NextResponse.json(
          { error: 'strengths must be an array', code: 'INVALID_STRENGTHS' },
          { status: 400 }
        );
      }
    }

    if (improvements !== undefined && improvements !== null) {
      if (!Array.isArray(improvements)) {
        return NextResponse.json(
          {
            error: 'improvements must be an array',
            code: 'INVALID_IMPROVEMENTS',
          },
          { status: 400 }
        );
      }
    }

    const newEvaluation = await db
      .insert(evaluations)
      .values({
        taskId: taskIdNum,
        userId: user.id,
        score: score !== undefined && score !== null ? parseInt(score) : null,
        strengths:
          strengths !== undefined && strengths !== null ? strengths : null,
        improvements:
          improvements !== undefined && improvements !== null
            ? improvements
            : null,
        detailedFeedback: detailedFeedback || null,
        isPremiumUnlocked: false,
        createdAt: new Date().toISOString(),
      })
      .returning();

    const result = { ...newEvaluation[0] };
    if (!result.isPremiumUnlocked) {
      result.detailedFeedback = null;
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}