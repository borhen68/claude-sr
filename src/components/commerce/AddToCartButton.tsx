'use client';

import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { cartManager } from '@/lib/commerce/cart';
import { ProductOptions } from '@/lib/commerce/types';

interface AddToCartButtonProps {
  productType: string;
  productName: string;
  unitPrice: number;
  options?: ProductOptions;
  projectId?: string;
  className?: string;
}

export function AddToCartButton({
  productType,
  productName,
  unitPrice,
  options,
  projectId,
  className = '',
}: AddToCartButtonProps) {
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = async () => {
    setAdding(true);
    
    try {
      cartManager.addItem({
        productType,
        productName,
        quantity: 1,
        unitPrice,
        options,
        projectId,
      });

      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={adding || added}
      className={`flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400 transition-colors ${className}`}
    >
      <ShoppingCart className="w-5 h-5" />
      {added ? 'Added!' : adding ? 'Adding...' : 'Add to Cart'}
    </button>
  );
}
