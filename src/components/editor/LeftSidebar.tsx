"use client";
import { Image, Type, Square, Shapes, Sticker, Upload } from 'lucide-react';

export default function LeftSidebar() {
  const elements = [
    { icon: Upload, label: 'Upload', desc: 'Add your photos' },
    { icon: Type, label: 'Text', desc: 'Add text boxes' },
    { icon: Image, label: 'Photos', desc: 'Stock images' },
    { icon: Shapes, label: 'Shapes', desc: 'Rectangles, circles' },
    { icon: Sticker, label: 'Stickers', desc: 'Fun elements' },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Elements</h3>
        <div className="space-y-2">
          {elements.map((el, i) => (
            <button
              key={i}
              className="w-full p-3 rounded-lg hover:bg-gray-50 flex items-center gap-3 text-left transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <el.icon className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <div className="font-medium text-sm text-gray-900">{el.label}</div>
                <div className="text-xs text-gray-500">{el.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Templates</h3>
        <div className="grid grid-cols-2 gap-2">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <button
              key={i}
              className="aspect-square rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center text-xs text-gray-500"
            >
              Template {i}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
