"use client";
import { Circle, Square, Heart, Star, Hexagon, Octagon } from 'lucide-react';

interface MaskingPanelProps {
  onApplyMask: (maskType: string) => void;
}

export default function MaskingPanel({ onApplyMask }: MaskingPanelProps) {
  const masks = [
    { icon: Circle, name: 'Circle', type: 'circle' },
    { icon: Square, name: 'Square', type: 'square' },
    { icon: Heart, name: 'Heart', type: 'heart' },
    { icon: Star, name: 'Star', type: 'star' },
    { icon: Hexagon, name: 'Hexagon', type: 'hexagon' },
    { icon: Octagon, name: 'Octagon', type: 'octagon' },
  ];

  return (
    <div className="p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Photo Masking</h3>
      <p className="text-xs text-gray-500 mb-4">Crop photos into shapes</p>

      <div className="grid grid-cols-3 gap-3">
        {masks.map((mask) => (
          <button
            key={mask.type}
            onClick={() => onApplyMask(mask.type)}
            className="group aspect-square rounded-lg border-2 border-gray-200 hover:border-blue-500 transition-all hover:scale-105 flex flex-col items-center justify-center gap-2 p-2"
          >
            <mask.icon className="w-10 h-10 text-gray-400 group-hover:text-blue-500 transition-colors" />
            <span className="text-xs text-gray-600 group-hover:text-blue-600">{mask.name}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-700">
          <strong>Tip:</strong> Select a photo first, then choose a mask shape to apply.
        </p>
      </div>
    </div>
  );
}
