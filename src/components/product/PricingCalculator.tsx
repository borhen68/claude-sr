import React, { useMemo } from 'react';
import { ProductConfig, PricingBreakdown } from './types';
import { sizeOptions } from './SizeSelector';
import { coverOptions } from './CoverTypeSelector';
import { paperOptions } from './PaperTypeSelector';
import { ShoppingCart, Tag, TrendingUp } from 'lucide-react';

interface PricingCalculatorProps {
  config: ProductConfig;
}

export const PricingCalculator: React.FC<PricingCalculatorProps> = ({ config }) => {
  const pricing = useMemo((): PricingBreakdown => {
    const sizeOption = sizeOptions.find(s => s.id === config.size);
    const coverOption = coverOptions.find(c => c.id === config.coverType);
    const paperOption = paperOptions.find(p => p.id === config.paperType);

    const basePrice = 0;
    const sizePrice = sizeOption?.basePrice || 0;
    const coverPrice = coverOption?.priceModifier || 0;
    const paperPrice = paperOption?.priceModifier || 0;
    
    // Page pricing: base 20 pages included, $0.75 per additional page
    const basePages = 20;
    const pricePerPage = 0.75;
    const additionalPages = Math.max(0, config.pageCount - basePages);
    const pagePrice = additionalPages * pricePerPage;

    const subtotal = basePrice + sizePrice + coverPrice + paperPrice + pagePrice;
    const taxRate = 0.08; // 8% tax
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    return {
      basePrice,
      sizePrice,
      coverPrice,
      paperPrice,
      pagePrice,
      subtotal,
      tax,
      total,
    };
  }, [config]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-[#28BAAB] to-[#0376AD] rounded-lg">
          <ShoppingCart className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Your Order</h2>
      </div>

      {/* Configuration Summary */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Size:</span>
          <span className="font-semibold text-gray-900">
            {sizeOptions.find(s => s.id === config.size)?.name}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Cover:</span>
          <span className="font-semibold text-gray-900">
            {coverOptions.find(c => c.id === config.coverType)?.name}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Paper:</span>
          <span className="font-semibold text-gray-900">
            {paperOptions.find(p => p.id === config.paperType)?.name}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Pages:</span>
          <span className="font-semibold text-gray-900">{config.pageCount}</span>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-700">Book ({sizeOptions.find(s => s.id === config.size)?.name})</span>
          <span className="font-semibold text-gray-900">${pricing.sizePrice.toFixed(2)}</span>
        </div>

        {pricing.coverPrice !== 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-700">
              {coverOptions.find(c => c.id === config.coverType)?.name}
            </span>
            <span className={`font-semibold ${pricing.coverPrice > 0 ? 'text-gray-900' : 'text-green-600'}`}>
              {pricing.coverPrice > 0 ? '+' : ''}${pricing.coverPrice.toFixed(2)}
            </span>
          </div>
        )}

        {pricing.paperPrice > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-700">
              {paperOptions.find(p => p.id === config.paperType)?.name} Paper
            </span>
            <span className="font-semibold text-gray-900">+${pricing.paperPrice.toFixed(2)}</span>
          </div>
        )}

        {pricing.pagePrice > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-700">
              Additional Pages ({config.pageCount - 20})
            </span>
            <span className="font-semibold text-gray-900">+${pricing.pagePrice.toFixed(2)}</span>
          </div>
        )}

        <div className="border-t border-gray-300 pt-3 flex justify-between text-sm">
          <span className="text-gray-700">Subtotal</span>
          <span className="font-semibold text-gray-900">${pricing.subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-700">Tax (8%)</span>
          <span className="font-semibold text-gray-900">${pricing.tax.toFixed(2)}</span>
        </div>
      </div>

      {/* Total */}
      <div className="border-t-2 border-gray-300 pt-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-gray-900">Total</span>
          <span className="text-3xl font-bold bg-gradient-to-r from-[#28BAAB] to-[#0376AD] bg-clip-text text-transparent">
            ${pricing.total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Savings Badge */}
      {config.pageCount >= 100 && (
        <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg flex items-start gap-2">
          <Tag className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-green-800">Volume Discount!</p>
            <p className="text-xs text-green-700">
              You're getting a great value with {config.pageCount} pages
            </p>
          </div>
        </div>
      )}

      {/* Premium Selection Badge */}
      {config.coverType === 'layflat' && (
        <div className="mb-4 p-3 bg-gradient-to-r from-[#28BAAB]/10 to-[#0376AD]/10 border border-[#28BAAB]/30 rounded-lg flex items-start gap-2">
          <TrendingUp className="w-5 h-5 text-[#0376AD] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-[#0376AD]">Premium Selection</p>
            <p className="text-xs text-gray-700">
              Layflat binding provides the ultimate professional finish
            </p>
          </div>
        </div>
      )}

      {/* CTA Button */}
      <button className="w-full py-4 bg-gradient-to-r from-[#28BAAB] to-[#0376AD] text-white font-bold rounded-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
        Add to Cart
      </button>

      <p className="text-xs text-gray-500 text-center mt-4">
        Free shipping on orders over $75
      </p>
    </div>
  );
};
