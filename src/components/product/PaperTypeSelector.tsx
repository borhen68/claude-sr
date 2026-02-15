import React from 'react';
import { PaperType, PaperOption } from './types';
import { FileText, Star, CheckCircle2 } from 'lucide-react';

const paperOptions: PaperOption[] = [
  {
    id: 'matte',
    name: 'Matte',
    description: 'Smooth, non-reflective finish for timeless elegance',
    priceModifier: 0,
    texture: 'Smooth, subtle texture with no glare',
    features: [
      'No glare or reflections',
      'Fingerprint resistant',
      'Elegant muted finish',
      'Perfect for portraits',
    ],
    popular: true,
  },
  {
    id: 'glossy',
    name: 'Glossy',
    description: 'High-shine finish with vibrant, saturated colors',
    priceModifier: 5,
    texture: 'Ultra-smooth with reflective coating',
    features: [
      'Vibrant color saturation',
      'Sharp image detail',
      'Rich contrast',
      'Magazine-quality finish',
    ],
  },
  {
    id: 'silk',
    name: 'Silk (Lustre)',
    description: 'Semi-gloss finish combining the best of both worlds',
    priceModifier: 8,
    texture: 'Subtle sheen with soft texture',
    features: [
      'Balanced color depth',
      'Minimal glare',
      'Luxurious feel',
      'Professional quality',
    ],
    popular: true,
  },
];

interface PaperTypeSelectorProps {
  selected: PaperType;
  onSelect: (paperType: PaperType) => void;
}

export const PaperTypeSelector: React.FC<PaperTypeSelectorProps> = ({ selected, onSelect }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-[#28BAAB] to-[#0376AD] rounded-lg">
          <FileText className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Choose Paper Type</h2>
          <p className="text-sm text-gray-600">Select the finish that brings your photos to life</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {paperOptions.map((option) => (
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

            {/* Paper Texture Preview */}
            <div className="mb-4 h-24 rounded-lg flex items-center justify-center relative overflow-hidden border-2 border-gray-300">
              {option.id === 'matte' && (
                <div className="w-full h-full bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100">
                  <div className="absolute inset-0 opacity-30" style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,.03) 2px, rgba(0,0,0,.03) 4px)'
                  }} />
                </div>
              )}
              {option.id === 'glossy' && (
                <div className="w-full h-full bg-gradient-to-br from-[#28BAAB]/20 via-white to-[#0376AD]/20 relative">
                  <div className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full opacity-60 blur-sm" />
                  <div className="absolute bottom-3 left-3 w-12 h-12 bg-white rounded-full opacity-40 blur-md" />
                </div>
              )}
              {option.id === 'silk' && (
                <div className="w-full h-full bg-gradient-to-br from-gray-50 via-white to-gray-100 relative">
                  <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8) 0%, transparent 50%)'
                  }} />
                  <div className="absolute top-3 right-4 w-6 h-6 bg-white rounded-full opacity-30 blur-sm" />
                </div>
              )}
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 mb-1">{option.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{option.description}</p>
            <p className="text-xs text-gray-500 italic mb-3">"{option.texture}"</p>
            
            <ul className="space-y-1.5 mb-4">
              {option.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-[#28BAAB] flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <div className="text-base font-bold">
              {option.priceModifier > 0 ? (
                <span className="text-[#0376AD]">+${option.priceModifier.toFixed(2)}</span>
              ) : (
                <span className="text-gray-600">Included</span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export { paperOptions };
