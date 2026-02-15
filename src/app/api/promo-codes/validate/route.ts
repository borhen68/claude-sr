import { NextRequest, NextResponse } from 'next/server';
import { validatePromoCode } from '@/lib/commerce/promo-codes';

// POST - Validate a promo code
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, subtotal, userId } = body;

    if (!code || subtotal === undefined) {
      return NextResponse.json(
        { error: 'Code and subtotal are required' },
        { status: 400 }
      );
    }

    const validation = await validatePromoCode(code, subtotal, userId);
    
    return NextResponse.json(validation);
  } catch (error) {
    console.error('Error validating promo code:', error);
    return NextResponse.json(
      { error: 'Failed to validate promo code' },
      { status: 500 }
    );
  }
}
