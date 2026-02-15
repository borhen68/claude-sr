# Frametale E-Commerce System

A complete, production-ready e-commerce system with Stripe integration, shopping cart, checkout flow, order management, and email notifications.

## Features

✅ **Stripe Integration**
- Support for both test and live modes
- Secure checkout sessions
- Webhook handling for payment events
- Real-time payment status updates

✅ **Shopping Cart**
- Local storage-based cart (works without login)
- Server-side cart sync for logged-in users
- Quantity management
- Real-time price calculations

✅ **Multi-Step Checkout**
- Shipping information collection
- Multiple shipping methods
- Billing address (same as shipping or separate)
- Promo code application
- Order review before payment

✅ **Order Management**
- Complete order history
- Order status tracking
- Shipping notifications
- Order cancellation

✅ **Promo Code System**
- Percentage discounts
- Fixed amount discounts
- Free shipping codes
- Usage limits (total and per-user)
- Date-based validity
- Minimum purchase requirements

✅ **Email Notifications**
- Order confirmation emails
- Shipping notification emails
- Support for SendGrid and Resend
- Fallback to console logging for development

## Setup

### 1. Install Dependencies

```bash
npm install stripe @stripe/stripe-js
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
# Stripe (get these from https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# For production, use live keys:
# STRIPE_SECRET_KEY=sk_live_...
# STRIPE_PUBLISHABLE_KEY=pk_live_...
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Stripe Webhook Secret (from Stripe CLI or Dashboard)
STRIPE_WEBHOOK_SECRET=whsec_...

# Email Provider (choose one)
SENDGRID_API_KEY=your_key
# OR
RESEND_API_KEY=your_key

EMAIL_FROM=noreply@frametale.com

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Update Database Schema

```bash
npx prisma migrate dev --name add_ecommerce
npx prisma generate
```

### 4. Set Up Stripe Webhooks

#### For Development (Stripe CLI):

```bash
stripe listen --forward-to localhost:3000/api/checkout/webhook
```

Copy the webhook secret and add to `.env.local` as `STRIPE_WEBHOOK_SECRET`.

#### For Production:

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/checkout/webhook`
3. Select events: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copy the signing secret to your production environment

## Usage

### Shopping Cart

```tsx
import { CartButton, AddToCartButton } from '@/components/commerce';

// Add cart button to navbar
<CartButton />

// Add to cart button for products
<AddToCartButton
  productType="photobook"
  productName="8x8 Photobook"
  unitPrice={29.99}
  options={{ size: 'small', pages: 20 }}
  projectId={projectId}
/>
```

### Cart Page

```tsx
import { CartSummary } from '@/components/commerce';

export default function CartPage() {
  return (
    <div>
      <h1>Shopping Cart</h1>
      <CartSummary />
    </div>
  );
}
```

### Checkout Flow

```tsx
import { CheckoutForm } from '@/components/commerce';

export default function CheckoutPage() {
  // Get user info from your auth system
  const user = getCurrentUser();

  return (
    <CheckoutForm
      userId={user.id}
      userEmail={user.email}
      userName={user.name}
    />
  );
}
```

### Order History

```tsx
import { OrderHistory } from '@/components/commerce';

export default function OrdersPage() {
  const user = getCurrentUser();

  return (
    <div>
      <h1>Order History</h1>
      <OrderHistory userId={user.id} />
    </div>
  );
}
```

### Order Tracking

```tsx
import { OrderTracking } from '@/components/commerce';

export default function TrackingPage({ params }: { params: { orderNumber: string } }) {
  return (
    <div>
      <h1>Track Your Order</h1>
      <OrderTracking orderNumber={params.orderNumber} />
    </div>
  );
}
```

## API Routes

### Cart Management

- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PATCH /api/cart/[id]` - Update cart item quantity
- `DELETE /api/cart/[id]` - Remove cart item
- `DELETE /api/cart` - Clear entire cart

### Checkout

- `POST /api/checkout/create-session` - Create Stripe checkout session
- `POST /api/checkout/webhook` - Stripe webhook handler

### Orders

- `GET /api/orders` - Get user's order history
- `GET /api/orders/[id]` - Get order details
- `GET /api/orders/track?orderNumber=XXX` - Track order (public)

### Promo Codes

- `POST /api/promo-codes/validate` - Validate promo code

## Creating Promo Codes

Use Prisma Studio or create via API:

```typescript
import { createPromoCode } from '@/lib/commerce';
import { PromoType } from '@prisma/client';

// 20% off
await createPromoCode({
  code: 'SAVE20',
  description: '20% off your order',
  type: PromoType.PERCENTAGE,
  value: 20,
  minPurchase: 50,
  maxDiscount: 100,
  usageLimit: 100,
  perUserLimit: 1,
  validUntil: new Date('2026-12-31'),
});

// $10 off
await createPromoCode({
  code: 'WELCOME10',
  type: PromoType.FIXED,
  value: 10,
  usageLimit: 500,
});

// Free shipping
await createPromoCode({
  code: 'FREESHIP',
  type: PromoType.FREE_SHIPPING,
  value: 0,
  minPurchase: 75,
});
```

## Order Status Management

```typescript
import { updateOrderStatus } from '@/lib/commerce';
import { OrderStatus } from '@prisma/client';

// Mark as shipped
await updateOrderStatus(orderId, OrderStatus.SHIPPED, {
  trackingNumber: 'TRACK123456',
  trackingUrl: 'https://tracking.carrier.com/TRACK123456',
});

// Mark as delivered
await updateOrderStatus(orderId, OrderStatus.DELIVERED);
```

## Email Customization

Edit email templates in `/src/lib/commerce/email.ts`. The system uses HTML emails with inline styles for maximum compatibility.

## Product Catalog

The product catalog is defined in `/src/lib/commerce/types.ts`:

```typescript
export const PRODUCT_CATALOG = {
  photobook: {
    small: { price: 29.99, name: '8x8 Photobook' },
    medium: { price: 49.99, name: '10x10 Photobook' },
    large: { price: 79.99, name: '12x12 Photobook' },
  },
  print: {
    '5x7': { price: 4.99, name: '5x7 Print' },
    '8x10': { price: 9.99, name: '8x10 Print' },
    '11x14': { price: 19.99, name: '11x14 Print' },
  },
};
```

Update this to match your actual products and pricing.

## Shipping Rates

Shipping rates are defined in `/src/lib/commerce/types.ts`:

```typescript
export const SHIPPING_RATES = {
  standard: 5.99,
  express: 14.99,
  overnight: 29.99,
};
```

## Tax Calculation

The current implementation uses a simple 8% tax rate. For production:

1. Integrate with a tax service (TaxJar, Avalara, Stripe Tax)
2. Calculate based on shipping address
3. Handle international orders

## Testing

### Test Cards

Use Stripe test cards:

- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Authentication: `4000 0025 0000 3155`

Any future expiry date and any 3-digit CVC.

### Test Webhooks

```bash
stripe trigger checkout.session.completed
```

## Production Checklist

- [ ] Update Stripe keys to live mode
- [ ] Configure production webhook endpoint
- [ ] Set up email service (SendGrid/Resend)
- [ ] Implement proper tax calculation
- [ ] Add rate limiting to API routes
- [ ] Set up monitoring and error tracking
- [ ] Configure CORS if needed
- [ ] Add CSP headers for Stripe
- [ ] Test payment flows thoroughly
- [ ] Set up order fulfillment process
- [ ] Configure shipping carrier integrations
- [ ] Add terms of service and privacy policy
- [ ] Implement refund handling
- [ ] Set up customer support system

## Security

- All payments processed through Stripe (PCI compliant)
- No credit card data stored on your server
- Webhook signature verification
- User authorization checks on all order endpoints
- Input validation on all API routes

## Support

For Stripe-specific issues, check:
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Stripe Testing Guide](https://stripe.com/docs/testing)

## License

Part of the Frametale project.
