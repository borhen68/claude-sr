"use client";
import { useState } from 'react';
import { Sticker, Heart, Star, Circle, Square, Triangle, Smile, Zap, Crown, Award, Gift, Music, Camera, MapPin, Coffee, Sun, Moon, Cloud, Umbrella, Flower2 } from 'lucide-react';

interface StickersLibraryProps {
  onStickerSelect: (sticker: { type: string; icon: string; color: string }) => void;
}

export default function StickersLibrary({ onStickerSelect }: StickersLibraryProps) {
  const [activeTab, setActiveTab] = useState<'shapes' | 'icons' | 'decorative'>('shapes');

  const shapes = [
    { icon: Circle, name: 'Circle', color: '#667eea' },
    { icon: Square, name: 'Square', color: '#f093fb' },
    { icon: Triangle, name: 'Triangle', color: '#4facfe' },
    { icon: Heart, name: 'Heart', color: '#fa709a' },
    { icon: Star, name: 'Star', color: '#fee140' },
  ];

  const icons = [
    { icon: Smile, name: 'Smile', color: '#FCD34D' },
    { icon: Heart, name: 'Heart', color: '#F87171' },
    { icon: Star, name: 'Star', color: '#FBBF24' },
    { icon: Zap, name: 'Zap', color: '#60A5FA' },
    { icon: Crown, name: 'Crown', color: '#FBBF24' },
    { icon: Award, name: 'Award', color: '#34D399' },
    { icon: Gift, name: 'Gift', color: '#F87171' },
    { icon: Music, name: 'Music', color: '#A78BFA' },
    { icon: Camera, name: 'Camera', color: '#60A5FA' },
    { icon: MapPin, name: 'Map Pin', color: '#EF4444' },
    { icon: Coffee, name: 'Coffee', color: '#92400E' },
    { icon: Sun, name: 'Sun', color: '#FBBF24' },
    { icon: Moon, name: 'Moon', color: '#8B5CF6' },
    { icon: Cloud, name: 'Cloud', color: '#93C5FD' },
    { icon: Umbrella, name: 'Umbrella', color: '#3B82F6' },
    { icon: Flower2, name: 'Flower', color: '#EC4899' },
  ];

  const decorative = [
    { type: 'burst', name: 'Starburst', color: '#FCD34D' },
    { type: 'arrow', name: 'Arrow', color: '#60A5FA' },
    { type: 'ribbon', name: 'Ribbon', color: '#F87171' },
    { type: 'badge', name: 'Badge', color: '#34D399' },
    { type: 'banner', name: 'Banner', color: '#A78BFA' },
    { type: 'frame', name: 'Frame', color: '#FB923C' },
  ];

  return (
    <div className="p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <Sticker className="w-4 h-4" />
        Stickers & Elements
      </h3>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 border-b border-gray-200">
        {[
          { key: 'shapes', label: 'Shapes' },
          { key: 'icons', label: 'Icons' },
          { key: 'decorative', label: 'Decorative' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-3 py-2 text-xs font-medium transition-colors relative ${
              activeTab === tab.key
                ? 'text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
            {activeTab === tab.key && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="max-h-96 overflow-y-auto">
        {activeTab === 'shapes' && (
          <div className="grid grid-cols-3 gap-3">
            {shapes.map((shape) => (
              <button
                key={shape.name}
                onClick={() => onStickerSelect({ type: 'shape', icon: shape.name.toLowerCase(), color: shape.color })}
                className="group aspect-square rounded-lg border-2 border-gray-200 hover:border-blue-500 transition-all hover:scale-105 flex flex-col items-center justify-center gap-2 p-2"
              >
                <shape.icon className="w-10 h-10" style={{ color: shape.color }} />
                <span className="text-xs text-gray-600 group-hover:text-blue-600">{shape.name}</span>
              </button>
            ))}
          </div>
        )}

        {activeTab === 'icons' && (
          <div className="grid grid-cols-4 gap-2">
            {icons.map((icon) => (
              <button
                key={icon.name}
                onClick={() => onStickerSelect({ type: 'icon', icon: icon.name.toLowerCase(), color: icon.color })}
                className="group aspect-square rounded-lg border-2 border-gray-200 hover:border-blue-500 transition-all hover:scale-105 flex flex-col items-center justify-center gap-1 p-2"
              >
                <icon.icon className="w-8 h-8" style={{ color: icon.color }} />
                <span className="text-xs text-gray-600 group-hover:text-blue-600 text-center leading-tight">{icon.name}</span>
              </button>
            ))}
          </div>
        )}

        {activeTab === 'decorative' && (
          <div className="grid grid-cols-3 gap-3">
            {decorative.map((item) => (
              <button
                key={item.name}
                onClick={() => onStickerSelect({ type: 'decorative', icon: item.type, color: item.color })}
                className="group aspect-square rounded-lg border-2 border-gray-200 hover:border-blue-500 transition-all hover:scale-105 flex flex-col items-center justify-center gap-2 p-2"
                style={{ background: `linear-gradient(135deg, ${item.color}22, ${item.color}44)` }}
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: item.color }}>
                  <Star className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-gray-600 group-hover:text-blue-600">{item.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Color Palette for Selected Sticker */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <label className="text-xs font-medium text-gray-600 mb-2 block">Sticker Color</label>
        <div className="grid grid-cols-8 gap-1">
          {['#EF4444', '#F97316', '#FBBF24', '#34D399', '#3B82F6', '#8B5CF6', '#EC4899', '#1F2937'].map(color => (
            <button
              key={color}
              className="aspect-square rounded border-2 border-gray-200 hover:border-gray-400 transition-all"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
