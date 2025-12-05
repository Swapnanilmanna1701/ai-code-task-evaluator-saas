import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { tasks, evaluations } from '@/db/schema';
import { eq, like, and, desc } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single task by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const task = await db.select()
        .from(tasks)
        .where(and(eq(tasks.id, parseInt(id)), eq(tasks.userId, user.id)))
        .limit(1);

      if (task.length === 0) {
        return NextResponse.json({ 
          error: 'Task not found',
          code: "TASK_NOT_FOUND" 
        }, { status: 404 });
      }

      return NextResponse.json(task[0], { status: 200 });
    }

    // List tasks with pagination, search, and filtering
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const status = searchParams.get('status');

    let conditions = [eq(tasks.userId, user.id)];

    if (search) {
      conditions.push(
        like(tasks.title, `%${search}%`)
      );
    }

    if (status) {
      const validStatuses = ['pending', 'evaluating', 'completed', 'failed'];
      if (validStatuses.includes(status)) {
        conditions.push(eq(tasks.status, status));
      }
    }

    const results = await db.select()
      .from(tasks)
      .where(and(...conditions))
      .orderBy(desc(tasks.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();

    // Security check: reject if userId provided in body
    if ('userId' in body || 'user_id' in body) {
      return NextResponse.json({ 
        error: "User ID cannot be provided in request body",
        code: "USER_ID_NOT_ALLOWED" 
      }, { status: 400 });
    }

    const { title, description, codeContent, language, status } = body;

    // Validate required fields
    if (!title || title.trim() === '') {
      return NextResponse.json({ 
        error: "Title is required and must not be empty",
        code: "TITLE_REQUIRED" 
      }, { status: 400 });
    }

    if (!codeContent || codeContent.trim() === '') {
      return NextResponse.json({ 
        error: "Code content is required and must not be empty",
        code: "CODE_CONTENT_REQUIRED" 
      }, { status: 400 });
    }

    // Validate status if provided
    if (status) {
      const validStatuses = ['pending', 'evaluating', 'completed', 'failed'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json({ 
          error: "Status must be one of: pending, evaluating, completed, failed",
          code: "INVALID_STATUS" 
        }, { status: 400 });
      }
    }

    // Sanitize inputs
    const sanitizedTitle = title.trim();
    const sanitizedDescription = description ? description.trim() : null;

    const now = new Date().toISOString();

    const newTask = await db.insert(tasks)
      .values({
        userId: user.id,
        title: sanitizedTitle,
        description: sanitizedDescription,
        codeContent: codeContent,
        language: language || null,
        status: status || 'pending',
        createdAt: now,
        updatedAt: now
      })
      .returning();

    return NextResponse.json(newTask[0], { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const body = await request.json();

    // Security check: reject if userId provided in body
    if ('userId' in body || 'user_id' in body) {
      return NextResponse.json({ 
        error: "User ID cannot be provided in request body",
        code: "USER_ID_NOT_ALLOWED" 
      }, { status: 400 });
    }

    // Check if task exists and belongs to user
    const existingTask = await db.select()
      .from(tasks)
      .where(and(eq(tasks.id, parseInt(id)), eq(tasks.userId, user.id)))
      .limit(1);

    if (existingTask.length === 0) {
      return NextResponse.json({ 
        error: 'Task not found',
        code: "TASK_NOT_FOUND" 
      }, { status: 404 });
    }

    const { title, description, codeContent, language, status } = body;

    // Validate fields if provided
    if (title !== undefined && title.trim() === '') {
      return NextResponse.json({ 
        error: "Title must not be empty if provided",
        code: "TITLE_EMPTY" 
      }, { status: 400 });
    }

    if (codeContent !== undefined && codeContent.trim() === '') {
      return NextResponse.json({ 
        error: "Code content must not be empty if provided",
        code: "CODE_CONTENT_EMPTY" 
      }, { status: 400 });
    }

    if (status !== undefined) {
      const validStatuses = ['pending', 'evaluating', 'completed', 'failed'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json({ 
          error: "Status must be one of: pending, evaluating, completed, failed",
          code: "INVALID_STATUS" 
        }, { status: 400 });
      }
    }

    // Build update object with only provided fields
    const updates: Record<string, any> = {
      updatedAt: new Date().toISOString()
    };

    if (title !== undefined) updates.title = title.trim();
    if (description !== undefined) updates.description = description ? description.trim() : null;
    if (codeContent !== undefined) updates.codeContent = codeContent;
    if (language !== undefined) updates.language = language || null;
    if (status !== undefined) updates.status = status;

    const updatedTask = await db.update(tasks)
      .set(updates)
      .where(and(eq(tasks.id, parseInt(id)), eq(tasks.userId, user.id)))
      .returning();

    if (updatedTask.length === 0) {
      return NextResponse.json({ 
        error: 'Task not found',
        code: "TASK_NOT_FOUND" 
      }, { status: 404 });
    }

    return NextResponse.json(updatedTask[0], { status: 200 });

  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if task exists and belongs to user
    const existingTask = await db.select()
      .from(tasks)
      .where(and(eq(tasks.id, parseInt(id)), eq(tasks.userId, user.id)))
      .limit(1);

    if (existingTask.length === 0) {
      return NextResponse.json({ 
        error: 'Task not found',
        code: "TASK_NOT_FOUND" 
      }, { status: 404 });
    }

    // Delete related evaluations first (manual cascade)
    await db.delete(evaluations)
      .where(eq(evaluations.taskId, parseInt(id)));

    // Delete the task
    const deletedTask = await db.delete(tasks)
      .where(and(eq(tasks.id, parseInt(id)), eq(tasks.userId, user.id)))
      .returning();

    if (deletedTask.length === 0) {
      return NextResponse.json({ 
        error: 'Task not found',
        code: "TASK_NOT_FOUND" 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      message: "Task deleted successfully",
      id: parseInt(id),
      task: deletedTask[0]
    }, { status: 200 });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}