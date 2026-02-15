import React from 'react';
import { Layers, Minus, Plus } from 'lucide-react';

interface PageCountSelectorProps {
  count: number;
  onChange: (count: number) => void;
  min?: number;
  max?: number;
}

export const PageCountSelector: React.FC<PageCountSelectorProps> = ({
  count,
  onChange,
  min = 20,
  max = 200,
}) => {
  const pricePerPage = 0.75;
  const basePages = 20;
  
  const additionalPages = Math.max(0, count - basePages);
  const additionalCost = additionalPages * pricePerPage;

  const handleDecrease = () => {
    if (count > min) {
      onChange(Math.max(min, count - 10));
    }
  };

  const handleIncrease = () => {
    if (count < max) {
      onChange(Math.min(max, count + 10));
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseInt(e.target.value, 10));
  };

  const percentage = ((count - min) / (max - min)) * 100;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-[#28BAAB] to-[#0376AD] rounded-lg">
          <Layers className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">Number of Pages</h2>
          <p className="text-sm text-gray-600">Minimum 20 pages, up to 200 pages</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold bg-gradient-to-r from-[#28BAAB] to-[#0376AD] bg-clip-text text-transparent">
            {count}
          </div>
          <div className="text-xs text-gray-500">pages</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={handleDecrease}
          disabled={count <= min}
          className="p-3 rounded-lg bg-gradient-to-br from-[#28BAAB] to-[#0376AD] text-white hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
        >
          <Minus className="w-5 h-5" />
        </button>

        <div className="flex-1 relative">
          <input
            type="range"
            min={min}
            max={max}
            step={10}
            value={count}
            onChange={handleSliderChange}
            className="w-full h-3 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #28BAAB 0%, #0376AD ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`,
            }}
          />
          <style>{`
            input[type="range"]::-webkit-slider-thumb {
              appearance: none;
              width: 24px;
              height: 24px;
              border-radius: 50%;
              background: linear-gradient(135deg, #28BAAB 0%, #0376AD 100%);
              cursor: pointer;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
              border: 3px solid white;
            }
            input[type="range"]::-moz-range-thumb {
              width: 24px;
              height: 24px;
              border-radius: 50%;
              background: linear-gradient(135deg, #28BAAB 0%, #0376AD 100%);
              cursor: pointer;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
              border: 3px solid white;
            }
          `}</style>
        </div>

        <button
          onClick={handleIncrease}
          disabled={count >= max}
          className="p-3 rounded-lg bg-gradient-to-br from-[#28BAAB] to-[#0376AD] text-white hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Page Markers */}
      <div className="flex justify-between text-xs text-gray-500 mb-6 px-1">
        <span>{min} pages</span>
        <span>50 pages</span>
        <span>100 pages</span>
        <span>150 pages</span>
        <span>{max} pages</span>
      </div>

      {/* Pricing Breakdown */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-700">Base (20 pages)</span>
          <span className="text-sm font-semibold text-gray-900">Included</span>
        </div>
        {additionalPages > 0 && (
          <div className="flex justify-between items-center pt-2 border-t border-gray-300">
            <span className="text-sm text-gray-700">
              +{additionalPages} additional pages
              <span className="text-xs text-gray-500 ml-1">(${pricePerPage}/page)</span>
            </span>
            <span className="text-sm font-bold text-[#0376AD]">
              +${additionalCost.toFixed(2)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
