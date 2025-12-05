import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { payments, evaluations } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';

const VALID_STATUSES = ['pending', 'completed', 'failed', 'refunded'] as const;

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const paymentId = parseInt(id);

    const body = await request.json();
    const { status, stripePaymentId } = body;

    if ('userId' in body || 'user_id' in body) {
      return NextResponse.json(
        {
          error: 'User ID cannot be provided in request body',
          code: 'USER_ID_NOT_ALLOWED',
        },
        { status: 400 }
      );
    }

    if ('evaluationId' in body || 'evaluation_id' in body) {
      return NextResponse.json(
        {
          error: 'Evaluation ID cannot be modified',
          code: 'EVALUATION_ID_NOT_ALLOWED',
        },
        { status: 400 }
      );
    }

    if ('amount' in body) {
      return NextResponse.json(
        {
          error: 'Amount cannot be modified',
          code: 'AMOUNT_NOT_ALLOWED',
        },
        { status: 400 }
      );
    }

    if ('currency' in body) {
      return NextResponse.json(
        {
          error: 'Currency cannot be modified',
          code: 'CURRENCY_NOT_ALLOWED',
        },
        { status: 400 }
      );
    }

    if ('createdAt' in body || 'created_at' in body) {
      return NextResponse.json(
        {
          error: 'Created date cannot be modified',
          code: 'CREATED_AT_NOT_ALLOWED',
        },
        { status: 400 }
      );
    }

    if (status && !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        {
          error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
          code: 'INVALID_STATUS',
        },
        { status: 400 }
      );
    }

    const existingPayment = await db
      .select()
      .from(payments)
      .where(and(eq(payments.id, paymentId), eq(payments.userId, user.id)))
      .limit(1);

    if (existingPayment.length === 0) {
      return NextResponse.json(
        { error: 'Payment not found', code: 'PAYMENT_NOT_FOUND' },
        { status: 404 }
      );
    }

    const updateData: {
      status?: string;
      stripePaymentId?: string;
    } = {};

    if (status !== undefined) {
      updateData.status = status;
    }

    if (stripePaymentId !== undefined) {
      updateData.stripePaymentId = stripePaymentId;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        {
          error: 'No valid fields to update',
          code: 'NO_UPDATES_PROVIDED',
        },
        { status: 400 }
      );
    }

    const updatedPayment = await db
      .update(payments)
      .set(updateData)
      .where(and(eq(payments.id, paymentId), eq(payments.userId, user.id)))
      .returning();

    if (updatedPayment.length === 0) {
      return NextResponse.json(
        { error: 'Payment not found', code: 'PAYMENT_NOT_FOUND' },
        { status: 404 }
      );
    }

    if (status === 'completed') {
      const evaluationId = updatedPayment[0].evaluationId;

      await db
        .update(evaluations)
        .set({ isPremiumUnlocked: true })
        .where(
          and(eq(evaluations.id, evaluationId), eq(evaluations.userId, user.id))
        );
    }

    return NextResponse.json(updatedPayment[0], { status: 200 });
  } catch (error) {
    console.error('PATCH error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error as Error).message,
      },
      { status: 500 }
    );
  }
}