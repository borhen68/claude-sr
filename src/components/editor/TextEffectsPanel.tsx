"use client";
import { useState } from 'react';
import { Type, Sparkles } from 'lucide-react';

export interface TextEffects {
  shadow: {
    enabled: boolean;
    blur: number;
    offsetX: number;
    offsetY: number;
    color: string;
  };
  outline: {
    enabled: boolean;
    width: number;
    color: string;
  };
  glow: {
    enabled: boolean;
    blur: number;
    color: string;
  };
  gradient: {
    enabled: boolean;
    type: 'linear' | 'radial';
    colors: string[];
    angle: number;
  };
}

interface TextEffectsPanelProps {
  onEffectChange: (effects: TextEffects) => void;
}

export default function TextEffectsPanel({ onEffectChange }: TextEffectsPanelProps) {
  const [effects, setEffects] = useState<TextEffects>({
    shadow: {
      enabled: false,
      blur: 4,
      offsetX: 2,
      offsetY: 2,
      color: '#000000',
    },
    outline: {
      enabled: false,
      width: 2,
      color: '#000000',
    },
    glow: {
      enabled: false,
      blur: 10,
      color: '#FFFFFF',
    },
    gradient: {
      enabled: false,
      type: 'linear',
      colors: ['#667eea', '#764ba2'],
      angle: 45,
    },
  });

  const updateEffect = (category: keyof TextEffects, updates: any) => {
    const newEffects = {
      ...effects,
      [category]: { ...effects[category], ...updates },
    };
    setEffects(newEffects);
    onEffectChange(newEffects);
  };

  const gradientPresets = [
    { name: 'Purple', colors: ['#667eea', '#764ba2'] },
    { name: 'Sunset', colors: ['#fa709a', '#fee140'] },
    { name: 'Ocean', colors: ['#4facfe', '#00f2fe'] },
    { name: 'Forest', colors: ['#43e97b', '#38f9d7'] },
    { name: 'Fire', colors: ['#f093fb', '#f5576c'] },
    { name: 'Gold', colors: ['#f7971e', '#ffd200'] },
  ];

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <Sparkles className="w-4 h-4" />
        Text Effects
      </h3>

      {/* Shadow */}
      <div className="border border-gray-200 rounded-lg p-3">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-semibold text-gray-700">Shadow</label>
          <input
            type="checkbox"
            checked={effects.shadow.enabled}
            onChange={(e) => updateEffect('shadow', { enabled: e.target.checked })}
            className="rounded accent-blue-600"
          />
        </div>
        {effects.shadow.enabled && (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-500">Offset X</label>
                <input
                  type="number"
                  value={effects.shadow.offsetX}
                  onChange={(e) => updateEffect('shadow', { offsetX: Number(e.target.value) })}
                  className="w-full px-2 py-1 border rounded text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Offset Y</label>
                <input
                  type="number"
                  value={effects.shadow.offsetY}
                  onChange={(e) => updateEffect('shadow', { offsetY: Number(e.target.value) })}
                  className="w-full px-2 py-1 border rounded text-sm"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500">Blur</label>
              <input
                type="range"
                min="0"
                max="20"
                value={effects.shadow.blur}
                onChange={(e) => updateEffect('shadow', { blur: Number(e.target.value) })}
                className="w-full accent-blue-600"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Color</label>
              <input
                type="color"
                value={effects.shadow.color}
                onChange={(e) => updateEffect('shadow', { color: e.target.value })}
                className="w-full h-8 rounded border"
              />
            </div>
          </div>
        )}
      </div>

      {/* Outline */}
      <div className="border border-gray-200 rounded-lg p-3">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-semibold text-gray-700">Outline</label>
          <input
            type="checkbox"
            checked={effects.outline.enabled}
            onChange={(e) => updateEffect('outline', { enabled: e.target.checked })}
            className="rounded accent-blue-600"
          />
        </div>
        {effects.outline.enabled && (
          <div className="space-y-2">
            <div>
              <label className="text-xs text-gray-500">Width</label>
              <input
                type="range"
                min="1"
                max="10"
                value={effects.outline.width}
                onChange={(e) => updateEffect('outline', { width: Number(e.target.value) })}
                className="w-full accent-blue-600"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Color</label>
              <input
                type="color"
                value={effects.outline.color}
                onChange={(e) => updateEffect('outline', { color: e.target.value })}
                className="w-full h-8 rounded border"
              />
            </div>
          </div>
        )}
      </div>

      {/* Glow */}
      <div className="border border-gray-200 rounded-lg p-3">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-semibold text-gray-700">Glow</label>
          <input
            type="checkbox"
            checked={effects.glow.enabled}
            onChange={(e) => updateEffect('glow', { enabled: e.target.checked })}
            className="rounded accent-blue-600"
          />
        </div>
        {effects.glow.enabled && (
          <div className="space-y-2">
            <div>
              <label className="text-xs text-gray-500">Blur</label>
              <input
                type="range"
                min="0"
                max="30"
                value={effects.glow.blur}
                onChange={(e) => updateEffect('glow', { blur: Number(e.target.value) })}
                className="w-full accent-blue-600"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Color</label>
              <input
                type="color"
                value={effects.glow.color}
                onChange={(e) => updateEffect('glow', { color: e.target.value })}
                className="w-full h-8 rounded border"
              />
            </div>
          </div>
        )}
      </div>

      {/* Gradient Fill */}
      <div className="border border-gray-200 rounded-lg p-3">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-semibold text-gray-700">Gradient Fill</label>
          <input
            type="checkbox"
            checked={effects.gradient.enabled}
            onChange={(e) => updateEffect('gradient', { enabled: e.target.checked })}
            className="rounded accent-blue-600"
          />
        </div>
        {effects.gradient.enabled && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              {gradientPresets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => updateEffect('gradient', { colors: preset.colors })}
                  className="aspect-square rounded-lg border-2 border-gray-200 hover:border-blue-500 transition-all"
                  style={{
                    background: `linear-gradient(135deg, ${preset.colors[0]}, ${preset.colors[1]})`,
                  }}
                  title={preset.name}
                />
              ))}
            </div>
            <div>
              <label className="text-xs text-gray-500">Type</label>
              <select
                value={effects.gradient.type}
                onChange={(e) => updateEffect('gradient', { type: e.target.value })}
                className="w-full px-2 py-1 border rounded text-sm"
              >
                <option value="linear">Linear</option>
                <option value="radial">Radial</option>
              </select>
            </div>
            {effects.gradient.type === 'linear' && (
              <div>
                <label className="text-xs text-gray-500">Angle: {effects.gradient.angle}°</label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={effects.gradient.angle}
                  onChange={(e) => updateEffect('gradient', { angle: Number(e.target.value) })}
                  className="w-full accent-blue-600"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
