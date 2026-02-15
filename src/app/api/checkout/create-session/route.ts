import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/commerce/checkout';
import { CartItem, ShippingAddress } from '@/lib/commerce/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      userId,
      userEmail,
      userName,
      cartItems,
      shippingAddress,
      billingAddress,
      promoCode,
      shippingMethod,
    }: {
      userId: string;
      userEmail: string;
      userName: string;
      cartItems: CartItem[];
      shippingAddress: ShippingAddress;
      billingAddress?: ShippingAddress;
      promoCode?: string;
      shippingMethod?: 'standard' | 'express' | 'overnight';
    } = body;

    // Validation
    if (!userId || !userEmail || !userName) {
      return NextResponse.json(
        { error: 'User information is required' },
        { status: 400 }
      );
    }

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    if (!shippingAddress) {
      return NextResponse.json(
        { error: 'Shipping address is required' },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const session = await createCheckoutSession({
      userId,
      userEmail,
      userName,
      cartItems,
      shippingAddress,
      billingAddress,
      promoCode,
      shippingMethod,
      successUrl: `${appUrl}/checkout/success`,
      cancelUrl: `${appUrl}/checkout/cancel`,
    });

    return NextResponse.json(session);
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
