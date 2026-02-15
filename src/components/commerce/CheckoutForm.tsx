'use client';

import { useState, useEffect } from 'react';
import { cartManager } from '@/lib/commerce/cart';
import { ShippingAddress, SHIPPING_RATES, TAX_RATE } from '@/lib/commerce/types';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

type CheckoutStep = 'shipping' | 'payment' | 'review';

interface CheckoutFormProps {
  userId: string;
  userEmail: string;
  userName: string;
}

export function CheckoutForm({ userId, userEmail, userName }: CheckoutFormProps) {
  const [step, setStep] = useState<CheckoutStep>('shipping');
  const [loading, setLoading] = useState(false);
  
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: userName || '',
    addressLine1: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
    phone: '',
  });

  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [billingAddress, setBillingAddress] = useState<ShippingAddress | undefined>();
  const [shippingMethod, setShippingMethod] = useState<keyof typeof SHIPPING_RATES>('standard');
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');

  const cartItems = cartManager.getCart();
  const subtotal = cartManager.getSubtotal();
  const shipping = SHIPPING_RATES[shippingMethod];
  const tax = (subtotal - promoDiscount) * TAX_RATE;
  const total = subtotal - promoDiscount + shipping + tax;

  const validatePromoCode = async () => {
    if (!promoCode) return;

    setPromoError('');
    try {
      const response = await fetch('/api/promo-codes/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoCode, subtotal, userId }),
      });

      const result = await response.json();
      
      if (result.valid) {
        setPromoDiscount(result.discountAmount || 0);
      } else {
        setPromoError(result.error || 'Invalid code');
        setPromoDiscount(0);
      }
    } catch (error) {
      setPromoError('Failed to validate code');
      setPromoDiscount(0);
    }
  };

  const handleCheckout = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          userEmail,
          userName,
          cartItems,
          shippingAddress,
          billingAddress: sameAsBilling ? shippingAddress : billingAddress,
          promoCode: promoDiscount > 0 ? promoCode : undefined,
          shippingMethod,
        }),
      });

      const { sessionId, url } = await response.json();

      if (url) {
        // Redirect to Stripe Checkout
        window.location.href = url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to create checkout session');
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {(['shipping', 'payment', 'review'] as CheckoutStep[]).map((s, i) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step === s ? 'bg-black text-white' : 'bg-gray-200'
              }`}
            >
              {i + 1}
            </div>
            <span className="ml-2 capitalize">{s}</span>
            {i < 2 && <div className="w-16 h-0.5 bg-gray-200 mx-4" />}
          </div>
        ))}
      </div>

      {/* Shipping Step */}
      {step === 'shipping' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Shipping Information</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                value={shippingAddress.fullName}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, fullName: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Address Line 1</label>
              <input
                type="text"
                value={shippingAddress.addressLine1}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, addressLine1: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Address Line 2 (Optional)</label>
              <input
                type="text"
                value={shippingAddress.addressLine2 || ''}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, addressLine2: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <input
                type="text"
                value={shippingAddress.city}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, city: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">State</label>
              <input
                type="text"
                value={shippingAddress.state}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, state: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Postal Code</label>
              <input
                type="text"
                value={shippingAddress.postalCode}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, postalCode: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="tel"
                value={shippingAddress.phone || ''}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, phone: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Shipping Method</h3>
            <div className="space-y-2">
              {Object.entries(SHIPPING_RATES).map(([method, price]) => (
                <label key={method} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="shipping"
                    value={method}
                    checked={shippingMethod === method}
                    onChange={(e) => setShippingMethod(e.target.value as keyof typeof SHIPPING_RATES)}
                  />
                  <span className="flex-1 capitalize">{method}</span>
                  <span className="font-semibold">${price.toFixed(2)}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={() => setStep('payment')}
            className="w-full px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Continue to Payment
          </button>
        </div>
      )}

      {/* Payment Step */}
      {step === 'payment' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Payment Information</h2>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm">
              Payment will be processed securely through Stripe on the next step.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Promo Code</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                placeholder="Enter code"
                className="flex-1 px-4 py-2 border rounded-lg"
              />
              <button
                onClick={validatePromoCode}
                className="px-6 py-2 border border-black rounded-lg hover:bg-gray-100"
              >
                Apply
              </button>
            </div>
            {promoError && <p className="text-sm text-red-600 mt-1">{promoError}</p>}
            {promoDiscount > 0 && (
              <p className="text-sm text-green-600 mt-1">
                Code applied! -${promoDiscount.toFixed(2)}
              </p>
            )}
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setStep('shipping')}
              className="px-6 py-3 border border-black rounded-lg hover:bg-gray-100"
            >
              Back
            </button>
            <button
              onClick={() => setStep('review')}
              className="flex-1 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              Continue to Review
            </button>
          </div>
        </div>
      )}

      {/* Review Step */}
      {step === 'review' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Review Order</h2>

          <div className="border rounded-lg p-4 space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Order Items</h3>
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm py-2">
                  <span>{item.productName} × {item.quantity}</span>
                  <span>${(item.unitPrice * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {promoDiscount > 0 && (
                <div className="flex justify-between mb-2 text-green-600">
                  <span>Discount ({promoCode})</span>
                  <span>-${promoDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between mb-2">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Shipping Address</h3>
              <p className="text-sm">
                {shippingAddress.fullName}<br />
                {shippingAddress.addressLine1}<br />
                {shippingAddress.addressLine2 && <>{shippingAddress.addressLine2}<br /></>}
                {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setStep('payment')}
              className="px-6 py-3 border border-black rounded-lg hover:bg-gray-100"
              disabled={loading}
            >
              Back
            </button>
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400"
            >
              {loading ? 'Processing...' : 'Complete Purchase'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
