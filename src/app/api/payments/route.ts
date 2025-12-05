import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { payments, evaluations } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';

const VALID_STATUSES = ['pending', 'completed', 'failed', 'refunded'];
const VALID_CURRENCY_REGEX = /^[A-Z]{3}$/;

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'AUTHENTICATION_REQUIRED' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // SECURITY: Reject if userId provided in request body
    if ('userId' in body || 'user_id' in body) {
      return NextResponse.json(
        {
          error: 'User ID cannot be provided in request body',
          code: 'USER_ID_NOT_ALLOWED',
        },
        { status: 400 }
      );
    }

    const { evaluationId, amount, currency, status, stripePaymentId } = body;

    // Validate required fields
    if (!evaluationId) {
      return NextResponse.json(
        {
          error: 'evaluationId is required',
          code: 'MISSING_EVALUATION_ID',
        },
        { status: 400 }
      );
    }

    if (amount === undefined || amount === null) {
      return NextResponse.json(
        {
          error: 'amount is required',
          code: 'MISSING_AMOUNT',
        },
        { status: 400 }
      );
    }

    // Validate evaluationId is valid integer
    const parsedEvaluationId = parseInt(evaluationId);
    if (isNaN(parsedEvaluationId)) {
      return NextResponse.json(
        {
          error: 'evaluationId must be a valid integer',
          code: 'INVALID_EVALUATION_ID',
        },
        { status: 400 }
      );
    }

    // Validate amount is positive number
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json(
        {
          error: 'amount must be a positive number greater than 0',
          code: 'INVALID_AMOUNT',
        },
        { status: 400 }
      );
    }

    // Round amount to 2 decimal places
    const normalizedAmount = Math.round(parsedAmount * 100) / 100;

    // Validate and normalize currency
    let normalizedCurrency = currency ? String(currency).toUpperCase().trim() : 'USD';
    if (!VALID_CURRENCY_REGEX.test(normalizedCurrency)) {
      return NextResponse.json(
        {
          error: 'currency must be a valid 3-letter uppercase code (e.g., USD, EUR, GBP)',
          code: 'INVALID_CURRENCY',
        },
        { status: 400 }
      );
    }

    // Validate status if provided
    const normalizedStatus = status ? String(status).toLowerCase().trim() : 'pending';
    if (!VALID_STATUSES.includes(normalizedStatus)) {
      return NextResponse.json(
        {
          error: `status must be one of: ${VALID_STATUSES.join(', ')}`,
          code: 'INVALID_STATUS',
        },
        { status: 400 }
      );
    }

    // Verify evaluation exists and belongs to authenticated user
    const evaluation = await db
      .select()
      .from(evaluations)
      .where(eq(evaluations.id, parsedEvaluationId))
      .limit(1);

    if (evaluation.length === 0) {
      return NextResponse.json(
        {
          error: 'Evaluation not found',
          code: 'EVALUATION_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    // Verify evaluation belongs to authenticated user
    if (evaluation[0].userId !== user.id) {
      return NextResponse.json(
        {
          error: 'Evaluation not found',
          code: 'EVALUATION_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    // Sanitize stripePaymentId if provided
    const sanitizedStripePaymentId = stripePaymentId
      ? String(stripePaymentId).trim()
      : null;

    // Create payment record
    const newPayment = await db
      .insert(payments)
      .values({
        userId: user.id,
        evaluationId: parsedEvaluationId,
        amount: normalizedAmount,
        currency: normalizedCurrency,
        status: normalizedStatus,
        stripePaymentId: sanitizedStripePaymentId,
        createdAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json(newPayment[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error instanceof Error ? error.message : String(error)),
      },
      { status: 500 }
    );
  }
}