'use client';

import { useEffect, useState } from 'react';
import { X, Minus, Plus } from 'lucide-react';
import { cartManager } from '@/lib/commerce/cart';
import { CartItem } from '@/lib/commerce/types';

export function CartSummary() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    loadCart();

    const handleCartUpdate = () => {
      loadCart();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const loadCart = () => {
    setItems(cartManager.getCart());
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    cartManager.updateQuantity(itemId, newQuantity);
  };

  const removeItem = (itemId: string) => {
    cartManager.removeItem(itemId);
  };

  const subtotal = cartManager.getSubtotal();

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Your cart is empty</p>
        <a
          href="/pricing"
          className="inline-block mt-4 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800"
        >
          Browse Products
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex gap-4 p-4 border border-gray-200 rounded-lg"
          >
            <div className="flex-1">
              <h3 className="font-semibold">{item.productName}</h3>
              <p className="text-sm text-gray-600">{item.productType}</p>
              {item.options && (
                <div className="text-xs text-gray-500 mt-1">
                  {Object.entries(item.options).map(([key, value]) => (
                    <span key={key} className="mr-2">
                      {key}: {value}
                    </span>
                  ))}
                </div>
              )}
              <p className="text-sm font-medium mt-2">
                ${item.unitPrice.toFixed(2)} each
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="p-1 hover:bg-gray-100 rounded"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="p-1 hover:bg-gray-100 rounded"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <p className="font-semibold">
                ${(item.unitPrice * item.quantity).toFixed(2)}
              </p>
              <button
                onClick={() => removeItem(item.id)}
                className="p-1 hover:bg-red-100 text-red-600 rounded"
                aria-label="Remove item"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between text-lg font-semibold">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Shipping and taxes calculated at checkout
        </p>
      </div>

      <a
        href="/checkout"
        className="block w-full text-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800"
      >
        Proceed to Checkout
      </a>
    </div>
  );
}
