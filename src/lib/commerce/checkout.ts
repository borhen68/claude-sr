import Stripe from 'stripe';
import { stripe } from './stripe';
import { prisma } from '@/lib/prisma';
import { CartItem, ShippingAddress, TAX_RATE, SHIPPING_RATES } from './types';
import { validatePromoCode, incrementPromoCodeUsage } from './promo-codes';
import { PromoType } from '@prisma/client';

export interface CreateCheckoutSessionParams {
  userId: string;
  userEmail: string;
  userName: string;
  cartItems: CartItem[];
  shippingAddress: ShippingAddress;
  billingAddress?: ShippingAddress;
  promoCode?: string;
  shippingMethod?: keyof typeof SHIPPING_RATES;
  successUrl: string;
  cancelUrl: string;
}

export async function createCheckoutSession(
  params: CreateCheckoutSessionParams
): Promise<{ sessionId: string; url: string }> {
  const {
    userId,
    userEmail,
    userName,
    cartItems,
    shippingAddress,
    billingAddress,
    promoCode,
    shippingMethod = 'standard',
    successUrl,
    cancelUrl,
  } = params;

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  let shipping = SHIPPING_RATES[shippingMethod];
  let discount = 0;
  let promoCodeRecord = null;

  // Validate and apply promo code
  if (promoCode) {
    const validation = await validatePromoCode(promoCode, subtotal, userId);
    
    if (validation.valid) {
      if (validation.type === PromoType.FREE_SHIPPING) {
        shipping = 0;
      } else if (validation.discountAmount) {
        discount = validation.discountAmount;
      }
      
      // Get the full promo code record
      promoCodeRecord = await prisma.promoCode.findUnique({
        where: { code: promoCode.toUpperCase() },
      });
    }
  }

  const taxableAmount = subtotal - discount;
  const tax = taxableAmount * TAX_RATE;
  const total = taxableAmount + tax + shipping;

  // Generate unique order number
  const orderNumber = `FT-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

  // Create or get shipping address
  const dbShippingAddress = await prisma.address.create({
    data: {
      userId,
      ...shippingAddress,
    },
  });

  const dbBillingAddress = billingAddress
    ? await prisma.address.create({
        data: {
          userId,
          ...billingAddress,
        },
      })
    : dbShippingAddress;

  // Create order in database
  const order = await prisma.order.create({
    data: {
      orderNumber,
      userId,
      customerEmail: userEmail,
      customerName: userName,
      status: 'PENDING',
      subtotal,
      tax,
      shipping,
      discount,
      amount: total,
      currency: 'USD',
      shippingAddressId: dbShippingAddress.id,
      billingAddressId: dbBillingAddress.id,
      promoCodeId: promoCodeRecord?.id,
      items: {
        create: cartItems.map(item => ({
          productType: item.productType,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.unitPrice * item.quantity,
          options: item.options ? JSON.stringify(item.options) : null,
        })),
      },
    },
    include: {
      items: true,
    },
  });

  // Create Stripe line items
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = cartItems.map(item => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.productName,
        description: item.options 
          ? Object.entries(item.options)
              .map(([key, value]) => `${key}: ${value}`)
              .join(', ')
          : undefined,
      },
      unit_amount: Math.round(item.unitPrice * 100), // Convert to cents
    },
    quantity: item.quantity,
  }));

  // Add shipping line item
  if (shipping > 0) {
    lineItems.push({
      price_data: {
        currency: 'usd',
        product_data: {
          name: `Shipping (${shippingMethod})`,
        },
        unit_amount: Math.round(shipping * 100),
      },
      quantity: 1,
    });
  }

  // Add tax line item
  if (tax > 0) {
    lineItems.push({
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Tax',
        },
        unit_amount: Math.round(tax * 100),
      },
      quantity: 1,
    });
  }

  // Apply discount if applicable
  const discounts: Stripe.Checkout.SessionCreateParams.Discount[] = [];
  if (discount > 0 && promoCodeRecord) {
    // Create a coupon for this discount
    const coupon = await stripe.coupons.create({
      amount_off: Math.round(discount * 100),
      currency: 'usd',
      duration: 'once',
      name: promoCodeRecord.code,
    });
    
    discounts.push({
      coupon: coupon.id,
    });
  }

  // Create Stripe checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    discounts: discounts.length > 0 ? discounts : undefined,
    mode: 'payment',
    success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: cancelUrl,
    customer_email: userEmail,
    client_reference_id: order.id,
    metadata: {
      orderId: order.id,
      orderNumber: order.orderNumber,
      userId,
    },
  });

  // Update order with Stripe session ID
  await prisma.order.update({
    where: { id: order.id },
    data: { stripeSessionId: session.id },
  });

  // Increment promo code usage
  if (promoCode && promoCodeRecord) {
    await incrementPromoCodeUsage(promoCode);
  }

  return {
    sessionId: session.id,
    url: session.url!,
  };
}

export async function handleCheckoutComplete(sessionId: string): Promise<void> {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent'],
    });

    if (session.payment_status === 'paid') {
      const orderId = session.metadata?.orderId;
      
      if (orderId) {
        await prisma.order.update({
          where: { id: orderId },
          data: {
            status: 'PAID',
            stripePaymentId: typeof session.payment_intent === 'string' 
              ? session.payment_intent 
              : session.payment_intent?.id,
          },
        });

        // TODO: Send confirmation email
        // await sendOrderConfirmationEmail(orderId);
      }
    }
  } catch (error) {
    console.error('Error handling checkout complete:', error);
    throw error;
  }
}
