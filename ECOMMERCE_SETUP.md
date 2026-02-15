# E-Commerce System Setup Guide

## 🎉 What's Been Built

A complete, production-ready e-commerce system for Frametale with:

### Core Features
- ✅ Stripe integration (test + live mode support)
- ✅ Shopping cart with local storage
- ✅ Multi-step checkout (Shipping → Payment → Review)
- ✅ Real Stripe checkout sessions
- ✅ Webhook handling for payment events
- ✅ Order confirmation emails
- ✅ Order tracking system
- ✅ User order history
- ✅ Promo code system (percentage, fixed, free shipping)
- ✅ Admin utilities for order management

### Database Schema
- Orders with full payment tracking
- Order items with product details
- Shopping cart persistence
- Shipping/billing addresses
- Promo codes with advanced rules
- Order status tracking (PENDING → PAID → SHIPPED → DELIVERED)

### API Routes
All routes are in `/src/app/api/`:
- `/api/checkout/create-session` - Create Stripe checkout
- `/api/checkout/webhook` - Handle Stripe webhooks
- `/api/cart` - Cart CRUD operations
- `/api/orders` - Order history and details
- `/api/orders/track` - Public order tracking
- `/api/promo-codes/validate` - Validate promo codes

### React Components
All in `/src/components/commerce/`:
- `CartButton` - Cart icon with item count
- `AddToCartButton` - Add product to cart
- `CartSummary` - Full cart view with quantity controls
- `CheckoutForm` - 3-step checkout flow
- `OrderHistory` - User's past orders
- `OrderTracking` - Track order status

## 🚀 Quick Start (5 minutes)

### 1. Install Dependencies

```bash
cd /root/.openclaw/workspace/claude-sr
npm install
```

### 2. Set Up Environment Variables

Create `.env.local`:

```bash
cp .env.example .env.local
```

Get your Stripe test keys from https://dashboard.stripe.com/test/apikeys:

```env
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET_HERE

EMAIL_FROM=noreply@frametale.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Update Database

```bash
npx prisma migrate dev --name add_ecommerce
npx prisma generate
```

### 4. Set Up Stripe Webhooks (Development)

In a new terminal:

```bash
stripe login
stripe listen --forward-to localhost:3000/api/checkout/webhook
```

Copy the webhook signing secret (`whsec_...`) to `.env.local` as `STRIPE_WEBHOOK_SECRET`.

### 5. Start Development Server

```bash
npm run dev
```

## 🧪 Testing the System

### Test the Cart

1. Add a product to cart (see example below)
2. Visit `/cart` to see cart summary
3. Update quantities, remove items
4. Proceed to checkout

### Test Checkout

1. Fill in shipping information
2. Select shipping method
3. Apply a promo code (create one first - see below)
4. Review order
5. Click "Complete Purchase"
6. Use Stripe test card: `4242 4242 4242 4242`
7. Any future expiry, any 3-digit CVC

### Create a Test Promo Code

Open Prisma Studio:

```bash
npx prisma studio
```

Or use the API:

```typescript
import { createPromoCode } from '@/lib/commerce';
import { PromoType } from '@prisma/client';

await createPromoCode({
  code: 'SAVE20',
  description: '20% off',
  type: PromoType.PERCENTAGE,
  value: 20,
  usageLimit: 100,
});
```

## 📦 Adding Cart to Your App

### 1. Add Cart Button to Navbar

Edit `/src/components/layout/Navbar.tsx`:

```tsx
import { CartButton } from '@/components/commerce';

export function Navbar() {
  return (
    <nav>
      {/* existing nav items */}
      <CartButton />
    </nav>
  );
}
```

### 2. Create Cart Page

Create `/src/app/cart/page.tsx`:

```tsx
import { CartSummary } from '@/components/commerce';

export default function CartPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      <CartSummary />
    </div>
  );
}
```

### 3. Create Checkout Page

Create `/src/app/checkout/page.tsx`:

```tsx
import { CheckoutForm } from '@/components/commerce';
// Import your auth/session logic
import { getCurrentUser } from '@/lib/auth';

export default function CheckoutPage() {
  const user = getCurrentUser(); // Replace with your auth

  if (!user) {
    redirect('/login?redirect=/checkout');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <CheckoutForm
        userId={user.id}
        userEmail={user.email}
        userName={user.name || ''}
      />
    </div>
  );
}
```

### 4. Add "Add to Cart" to Products

Example on pricing page:

```tsx
import { AddToCartButton } from '@/components/commerce';

export default function PricingPage() {
  return (
    <div>
      <div className="product-card">
        <h3>8x8 Photobook</h3>
        <p className="price">$29.99</p>
        <AddToCartButton
          productType="photobook"
          productName="8x8 Photobook"
          unitPrice={29.99}
          options={{ size: 'small', pages: 20 }}
        />
      </div>
    </div>
  );
}
```

### 5. Create Order History Page

Create `/src/app/orders/page.tsx`:

```tsx
import { OrderHistory } from '@/components/commerce';
import { getCurrentUser } from '@/lib/auth';

export default function OrdersPage() {
  const user = getCurrentUser();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Order History</h1>
      <OrderHistory userId={user.id} />
    </div>
  );
}
```

### 6. Create Order Tracking Page

Create `/src/app/orders/track/page.tsx`:

```tsx
import { OrderTracking } from '@/components/commerce';

export default function TrackingPage({
  searchParams,
}: {
  searchParams: { orderNumber: string };
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <OrderTracking orderNumber={searchParams.orderNumber} />
    </div>
  );
}
```

## 🔧 Customization

### Update Product Catalog

Edit `/src/lib/commerce/types.ts`:

```typescript
export const PRODUCT_CATALOG = {
  photobook: {
    small: { price: 29.99, name: '8x8 Photobook' },
    medium: { price: 49.99, name: '10x10 Photobook' },
    large: { price: 79.99, name: '12x12 Photobook' },
  },
  // Add your products here
};
```

### Update Shipping Rates

In the same file:

```typescript
export const SHIPPING_RATES = {
  standard: 5.99,
  express: 14.99,
  overnight: 29.99,
};
```

### Customize Email Templates

Edit `/src/lib/commerce/email.ts` to modify:
- Order confirmation email
- Shipping notification email
- Add new email types

## 🔐 Production Deployment

### 1. Switch to Live Stripe Keys

Update environment variables:

```env
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### 2. Set Up Production Webhook

1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://yourdomain.com/api/checkout/webhook`
3. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
4. Copy webhook secret to production env

### 3. Configure Email Service

Set up SendGrid or Resend:

```env
SENDGRID_API_KEY=SG.xxx
# OR
RESEND_API_KEY=re_xxx

EMAIL_FROM=orders@frametale.com
```

### 4. Update App URL

```env
NEXT_PUBLIC_APP_URL=https://frametale.com
```

### 5. Production Checklist

- [ ] Test all payment flows
- [ ] Verify webhooks are working
- [ ] Test email delivery
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Add rate limiting to API routes
- [ ] Configure proper tax calculation
- [ ] Set up backup system
- [ ] Add terms of service links
- [ ] Test refund process
- [ ] Train support team

## 📊 Admin Features

Use admin utilities in `/src/lib/commerce/admin.ts`:

```typescript
import {
  getAllOrders,
  shipOrder,
  getSalesStats,
  exportOrdersToCSV,
} from '@/lib/commerce/admin';

// View all orders
const orders = await getAllOrders({ status: 'PAID' });

// Ship an order
await shipOrder(orderId, 'TRACK123456', 'https://track.fedex.com/...');

// Get sales statistics
const stats = await getSalesStats();
console.log(`Total Revenue: $${stats.totalRevenue}`);

// Export to CSV
const csv = await exportOrdersToCSV(startDate, endDate);
```

## 🐛 Troubleshooting

### Webhook not receiving events

```bash
# Check webhook is running
stripe listen --forward-to localhost:3000/api/checkout/webhook

# Test webhook
stripe trigger checkout.session.completed
```

### Cart not updating

- Check browser console for errors
- Verify localStorage is enabled
- Check `cartUpdated` event is firing

### Email not sending

- Check email provider API key
- Verify `EMAIL_FROM` is set
- Check provider dashboard for errors
- Look for console output (dev mode)

### Order not completing

- Check Stripe Dashboard for payment status
- Verify webhook secret is correct
- Check server logs for errors
- Ensure database is accessible

## 📚 Documentation

Full documentation in `/src/lib/commerce/README.md`

## 🎯 Next Steps

1. **Test Everything**: Run through complete purchase flow
2. **Customize Products**: Update catalog for your offerings
3. **Style Components**: Match your brand design
4. **Add Analytics**: Track conversions, revenue
5. **Set Up Email**: Configure SendGrid/Resend
6. **Go Live**: Switch to live Stripe keys
7. **Monitor**: Set up alerts and dashboards

## 💡 Tips

- Use Stripe test mode for all development
- Keep webhook secret secure
- Test email templates across providers
- Monitor webhook delivery in Stripe Dashboard
- Set up proper error tracking before launch
- Keep customer data secure and GDPR compliant

## 🆘 Support

- Stripe Docs: https://stripe.com/docs
- Stripe Testing: https://stripe.com/docs/testing
- Component API: See `/src/lib/commerce/README.md`

---

Built for Frametale 🎨📸
