import { OrderStatus, PromoType } from '@prisma/client';

export interface CartItem {
  id: string;
  productType: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  options?: ProductOptions;
  projectId?: string;
}

export interface ProductOptions {
  size?: string;
  finish?: string;
  pages?: number;
  coverType?: string;
  binding?: string;
  [key: string]: any;
}

export interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface CheckoutSession {
  cartItems: CartItem[];
  shippingAddress?: ShippingAddress;
  billingAddress?: ShippingAddress;
  promoCode?: string;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
}

export interface OrderSummary {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  amount: number;
  currency: string;
  customerEmail: string;
  createdAt: Date;
  items: Array<{
    productName: string;
    quantity: number;
    totalPrice: number;
  }>;
}

export interface PromoCodeValidation {
  valid: boolean;
  code?: string;
  type?: PromoType;
  value?: number;
  discountAmount?: number;
  error?: string;
}

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
  digital: {
    standard: { price: 9.99, name: 'Digital Copy' },
    premium: { price: 19.99, name: 'Premium Digital Package' },
  },
};

export const SHIPPING_RATES = {
  standard: 5.99,
  express: 14.99,
  overnight: 29.99,
};

export const TAX_RATE = 0.08; // 8% - should be calculated based on location in production
