// Cart
export { cartManager, CartManager } from './cart';

// Checkout
export { createCheckoutSession, handleCheckoutComplete } from './checkout';

// Orders
export {
  getOrderById,
  getOrderByNumber,
  getUserOrders,
  updateOrderStatus,
  cancelOrder,
  getOrderTracking,
} from './orders';

// Promo Codes
export {
  validatePromoCode,
  incrementPromoCodeUsage,
  createPromoCode,
} from './promo-codes';

// Email
export {
  sendOrderConfirmationEmail,
  sendShippingNotificationEmail,
} from './email';

// Stripe
export { stripe, isTestMode, stripePublishableKey } from './stripe';

// Types
export * from './types';
