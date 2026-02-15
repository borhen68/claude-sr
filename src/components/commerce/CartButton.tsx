'use client';

import { useEffect, useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { cartManager } from '@/lib/commerce/cart';

export function CartButton() {
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    // Initial count
    setItemCount(cartManager.getItemCount());

    // Listen for cart updates
    const handleCartUpdate = () => {
      setItemCount(cartManager.getItemCount());
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  return (
    <button
      onClick={() => window.location.href = '/cart'}
      className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
      aria-label="Shopping cart"
    >
      <ShoppingCart className="w-6 h-6" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </button>
  );
}
