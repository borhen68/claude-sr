"use client";
import { Image, Type, Square, Shapes, Sticker, Upload } from 'lucide-react';
import PhotoUploadPanel from './PhotoUploadPanel';

interface LeftSidebarProps {
  onPhotoSelect: (url: string) => void;
  onAddText: () => void;
  onAddShape: (shape: 'rectangle' | 'circle') => void;
}

export default function LeftSidebar({ onPhotoSelect, onAddText, onAddShape }: LeftSidebarProps) {
  const elements = [
    { icon: Type, label: 'Text', desc: 'Add text boxes', action: onAddText },
    { icon: Square, label: 'Rectangle', desc: 'Add rectangle', action: () => onAddShape('rectangle') },
    { icon: Shapes, label: 'Circle', desc: 'Add circle', action: () => onAddShape('circle') },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto flex flex-col">
      {/* Photo Upload */}
      <PhotoUploadPanel onPhotoSelect={onPhotoSelect} />

      {/* Elements */}
      <div className="p-4 flex-1">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Elements</h3>
        <div className="space-y-2">
          {elements.map((el, i) => (
            <button
              key={i}
              onClick={el.action}
              className="w-full p-3 rounded-lg hover:bg-gray-50 flex items-center gap-3 text-left transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#28BAAB] to-[#0376AD] flex items-center justify-center">
                <el.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-medium text-sm text-gray-900">{el.label}</div>
                <div className="text-xs text-gray-500">{el.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Templates */}
      <div className="p-4 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Templates</h3>
        <div className="grid grid-cols-2 gap-2">
          {['Hero', 'Grid 2x2', 'Collage', 'Split', 'Trio', 'Full'].map((name, i) => (
            <button
              key={i}
              className="aspect-square rounded-lg bg-gradient-to-br from-gray-100 to-gray-50 hover:from-blue-50 hover:to-blue-100 transition-all flex items-center justify-center text-xs text-gray-600 hover:text-blue-700 font-medium border border-gray-200 hover:border-blue-300"
            >
              {name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
