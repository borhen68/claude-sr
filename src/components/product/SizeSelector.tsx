import React from 'react';
import { Size, SizeOption } from './types';
import { Ruler, Star } from 'lucide-react';

const sizeOptions: SizeOption[] = [
  {
    id: '8x8',
    name: '8" × 8"',
    dimensions: '8 × 8 inches (20.3 × 20.3 cm)',
    basePrice: 29.99,
    description: 'Perfect for Instagram-style photos and compact displays',
  },
  {
    id: '8x10',
    name: '8" × 10"',
    dimensions: '8 × 10 inches (20.3 × 25.4 cm)',
    basePrice: 34.99,
    description: 'Classic portrait orientation, ideal for family albums',
    popular: true,
  },
  {
    id: '10x10',
    name: '10" × 10"',
    dimensions: '10 × 10 inches (25.4 × 25.4 cm)',
    basePrice: 44.99,
    description: 'Generous square format for showcasing your best moments',
  },
  {
    id: '11x8.5',
    name: '11" × 8.5"',
    dimensions: '11 × 8.5 inches (27.9 × 21.6 cm)',
    basePrice: 42.99,
    description: 'Landscape orientation perfect for panoramic photos',
  },
  {
    id: '12x12',
    name: '12" × 12"',
    dimensions: '12 × 12 inches (30.5 × 30.5 cm)',
    basePrice: 54.99,
    description: 'Premium large format for professional presentations',
    popular: true,
  },
];

interface SizeSelectorProps {
  selected: Size;
  onSelect: (size: Size) => void;
}

export const SizeSelector: React.FC<SizeSelectorProps> = ({ selected, onSelect }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-[#28BAAB] to-[#0376AD] rounded-lg">
          <Ruler className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Choose Your Size</h2>
          <p className="text-sm text-gray-600">Select the perfect dimensions for your photo book</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sizeOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => onSelect(option.id)}
            className={`relative p-4 rounded-lg border-2 transition-all duration-300 text-left ${
              selected === option.id
                ? 'border-[#28BAAB] bg-gradient-to-br from-[#28BAAB]/10 to-[#0376AD]/10 shadow-lg'
                : 'border-gray-200 hover:border-[#28BAAB]/50 hover:shadow-md'
            }`}
          >
            {option.popular && (
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-[#28BAAB] to-[#0376AD] text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
                <Star className="w-3 h-3 fill-current" />
                Popular
              </div>
            )}
            
            <div className="mb-2">
              <h3 className="text-lg font-bold text-gray-900">{option.name}</h3>
              <p className="text-sm text-gray-600">{option.dimensions}</p>
            </div>
            
            <p className="text-xs text-gray-500 mb-3">{option.description}</p>
            
            <div className="text-lg font-bold bg-gradient-to-r from-[#28BAAB] to-[#0376AD] bg-clip-text text-transparent">
              ${option.basePrice.toFixed(2)}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export { sizeOptions };
