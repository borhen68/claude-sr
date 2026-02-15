import React from 'react';
import { CoverType, CoverOption } from './types';
import { BookOpen, Star, CheckCircle2 } from 'lucide-react';

const coverOptions: CoverOption[] = [
  {
    id: 'hardcover',
    name: 'Hardcover',
    description: 'Durable protective cover with premium feel',
    priceModifier: 0,
    features: [
      'Rigid protective cover',
      'Premium finish',
      'Long-lasting durability',
      'Elegant spine text',
    ],
    popular: true,
  },
  {
    id: 'softcover',
    name: 'Softcover',
    description: 'Flexible, lightweight, and affordable option',
    priceModifier: -10,
    features: [
      'Lightweight and flexible',
      'Budget-friendly',
      'Matte laminated cover',
      'Easy to mail',
    ],
  },
  {
    id: 'layflat',
    name: 'Layflat Hardcover',
    description: 'Premium binding that opens completely flat',
    priceModifier: 20,
    features: [
      'Seamless panoramic spreads',
      'Premium layflat binding',
      'No gutter loss',
      'Professional presentation',
    ],
    popular: true,
  },
];

interface CoverTypeSelectorProps {
  selected: CoverType;
  onSelect: (coverType: CoverType) => void;
}

export const CoverTypeSelector: React.FC<CoverTypeSelectorProps> = ({ selected, onSelect }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-[#28BAAB] to-[#0376AD] rounded-lg">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Select Cover Type</h2>
          <p className="text-sm text-gray-600">Choose the binding and cover style</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {coverOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => onSelect(option.id)}
            className={`relative p-5 rounded-lg border-2 transition-all duration-300 text-left ${
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

            {/* Cover Illustration */}
            <div className="mb-4 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center relative overflow-hidden">
              {option.id === 'hardcover' && (
                <div className="w-16 h-20 bg-gradient-to-br from-[#28BAAB] to-[#0376AD] rounded-sm shadow-lg border-2 border-gray-800" />
              )}
              {option.id === 'softcover' && (
                <div className="w-16 h-20 bg-gradient-to-br from-[#28BAAB] to-[#0376AD] rounded-sm shadow-md" />
              )}
              {option.id === 'layflat' && (
                <div className="flex gap-0">
                  <div className="w-8 h-20 bg-gradient-to-r from-[#28BAAB] to-[#0376AD] shadow-lg border-r border-gray-300" />
                  <div className="w-8 h-20 bg-gradient-to-l from-[#0376AD] to-[#28BAAB] shadow-lg" />
                </div>
              )}
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 mb-1">{option.name}</h3>
            <p className="text-sm text-gray-600 mb-3">{option.description}</p>
            
            <ul className="space-y-1.5 mb-4">
              {option.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-[#28BAAB] flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <div className="text-base font-bold">
              {option.priceModifier > 0 && (
                <span className="text-[#0376AD]">+${option.priceModifier.toFixed(2)}</span>
              )}
              {option.priceModifier < 0 && (
                <span className="text-green-600">${option.priceModifier.toFixed(2)}</span>
              )}
              {option.priceModifier === 0 && (
                <span className="text-gray-600">Included</span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export { coverOptions };
