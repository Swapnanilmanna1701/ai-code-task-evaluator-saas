import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { evaluations } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate ID parameter
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        {
          error: 'Valid ID is required',
          code: 'INVALID_ID',
        },
        { status: 400 }
      );
    }

    // Fetch evaluation by ID
    const evaluation = await db
      .select()
      .from(evaluations)
      .where(eq(evaluations.id, parseInt(id)))
      .limit(1);

    // Check if evaluation exists
    if (evaluation.length === 0) {
      return NextResponse.json(
        {
          error: 'Evaluation not found',
          code: 'EVALUATION_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    const evaluationData = evaluation[0];

    // Handle premium content filtering
    const response = {
      ...evaluationData,
      detailedFeedback: evaluationData.isPremiumUnlocked
        ? evaluationData.detailedFeedback
        : null,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error as Error).message,
      },
      { status: 500 }
    );
  }
}