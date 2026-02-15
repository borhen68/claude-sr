import React, { useState, useMemo } from 'react';
import { SizeSelector } from './SizeSelector';
import { CoverTypeSelector } from './CoverTypeSelector';
import { PaperTypeSelector } from './PaperTypeSelector';
import { PageCountSelector } from './PageCountSelector';
import { PricingCalculator } from './PricingCalculator';
import { ProductComparison } from './ProductComparison';
import { ProductConfig, Size, CoverType, PaperType } from './types';

export const ProductCatalog: React.FC = () => {
  const [config, setConfig] = useState<ProductConfig>({
    size: '8x8',
    coverType: 'hardcover',
    paperType: 'matte',
    pageCount: 20,
  });

  const [showComparison, setShowComparison] = useState(false);

  const updateConfig = (updates: Partial<ProductConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#28BAAB] to-[#0376AD] bg-clip-text text-transparent mb-4">
            Create Your Photo Book
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Design a premium photo book with professional quality printing and materials. 
            Customize every detail to create something truly special.
          </p>
        </div>

        {/* Main Configuration Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Left Column - Product Options */}
          <div className="lg:col-span-2 space-y-6">
            <SizeSelector
              selected={config.size}
              onSelect={(size) => updateConfig({ size })}
            />

            <CoverTypeSelector
              selected={config.coverType}
              onSelect={(coverType) => updateConfig({ coverType })}
            />

            <PaperTypeSelector
              selected={config.paperType}
              onSelect={(paperType) => updateConfig({ paperType })}
            />

            <PageCountSelector
              count={config.pageCount}
              onChange={(pageCount) => updateConfig({ pageCount })}
            />
          </div>

          {/* Right Column - Pricing Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <PricingCalculator config={config} />
            </div>
          </div>
        </div>

        {/* Comparison Toggle */}
        <div className="text-center mb-8">
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="inline-flex items-center px-6 py-3 bg-white border-2 border-[#28BAAB] text-[#0376AD] rounded-lg hover:bg-gradient-to-r hover:from-[#28BAAB] hover:to-[#0376AD] hover:text-white transition-all duration-300 font-semibold shadow-md"
          >
            {showComparison ? 'Hide' : 'Show'} Product Comparison
          </button>
        </div>

        {/* Comparison Table */}
        {showComparison && (
          <div className="mt-8">
            <ProductComparison />
          </div>
        )}
      </div>
    </div>
  );
};
