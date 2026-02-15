"use client";
import { useState } from 'react';
import { Palette, Grid, Sparkles } from 'lucide-react';

interface BackgroundLibraryProps {
  onBackgroundSelect: (background: string) => void;
}

export default function BackgroundLibrary({ onBackgroundSelect }: BackgroundLibraryProps) {
  const [activeTab, setActiveTab] = useState<'solid' | 'gradient' | 'pattern' | 'texture'>('gradient');

  const solidColors = [
    '#FFFFFF', '#F5F5F5', '#E5E5E5', '#D4D4D4', '#A3A3A3', '#737373', '#525252', '#404040', '#262626', '#171717',
    '#FEE2E2', '#FECACA', '#FCA5A5', '#F87171', '#EF4444', '#DC2626', '#B91C1C', '#991B1B',
    '#FED7AA', '#FDBA74', '#FB923C', '#F97316', '#EA580C', '#C2410C', '#9A3412', '#7C2D12',
    '#FEF3C7', '#FDE68A', '#FCD34D', '#FBBF24', '#F59E0B', '#D97706', '#B45309', '#92400E',
    '#D9F99D', '#BEF264', '#A3E635', '#84CC16', '#65A30D', '#4D7C0F', '#3F6212', '#365314',
    '#A7F3D0', '#6EE7B7', '#34D399', '#10B981', '#059669', '#047857', '#065F46', '#064E3B',
    '#A5F3FC', '#67E8F9', '#22D3EE', '#06B6D4', '#0891B2', '#0E7490', '#155E75', '#164E63',
    '#BFDBFE', '#93C5FD', '#60A5FA', '#3B82F6', '#2563EB', '#1D4ED8', '#1E40AF', '#1E3A8A',
    '#DDD6FE', '#C4B5FD', '#A78BFA', '#8B5CF6', '#7C3AED', '#6D28D9', '#5B21B6', '#4C1D95',
    '#F5D0FE', '#F0ABFC', '#E879F9', '#D946EF', '#C026D3', '#A21CAF', '#86198F', '#701A75',
  ];

  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)',
    'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)',
    'linear-gradient(135deg, #fddb92 0%, #d1fdff 100%)',
    'linear-gradient(135deg, #9890e3 0%, #b1f4cf 100%)',
    'linear-gradient(135deg, #ebc0fd 0%, #d9ded8 100%)',
    'linear-gradient(135deg, #96fbc4 0%, #f9f586 100%)',
    'linear-gradient(135deg, #2af598 0%, #009efd 100%)',
    'linear-gradient(135deg, #cd9cf2 0%, #f6f3ff 100%)',
    'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
    'linear-gradient(to right, #fa709a 0%, #fee140 100%)',
    'linear-gradient(to right, #30cfd0 0%, #330867 100%)',
    'linear-gradient(to right, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(to right, #ffecd2 0%, #fcb69f 100%)',
    'radial-gradient(circle, #667eea 0%, #764ba2 100%)',
    'radial-gradient(circle, #f093fb 0%, #f5576c 100%)',
    'radial-gradient(circle, #4facfe 0%, #00f2fe 100%)',
    'radial-gradient(circle, #43e97b 0%, #38f9d7 100%)',
  ];

  const patterns = [
    'repeating-linear-gradient(45deg, #f0f0f0 0, #f0f0f0 10px, #e0e0e0 10px, #e0e0e0 20px)',
    'repeating-linear-gradient(90deg, #f0f0f0 0, #f0f0f0 10px, #e0e0e0 10px, #e0e0e0 20px)',
    'repeating-linear-gradient(45deg, #667eea 0, #667eea 10px, #764ba2 10px, #764ba2 20px)',
    'repeating-linear-gradient(45deg, #4facfe 0, #4facfe 10px, #00f2fe 10px, #00f2fe 20px)',
    `radial-gradient(circle at 20px 20px, #e0e0e0 2px, transparent 2px)`,
    `radial-gradient(circle at 20px 20px, #667eea 2px, transparent 2px)`,
    'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)',
    'linear-gradient(45deg, #667eea 25%, transparent 25%), linear-gradient(-45deg, #667eea 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #667eea 75%), linear-gradient(-45deg, transparent 75%, #667eea 75%)',
  ];

  const textures = [
    'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNlMGUwZTAiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCAxLTVzLTQgMC02IDFjMCAwIDAgMyAwIDVzMiA0IDMgNWMxIDAgMi0yIDItNHpNMjUgMTFjMC0yIDItNCAxLTVzLTQgMC02IDFjMCAwIDAgMyAwIDVzMiA0IDMgNWMxIDAgMi0yIDItNHoiLz48L2c+PC9nPjwvc3ZnPg==)',
    'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNlMGUwZTAiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMCAwaDQwdjQwSDB6Ii8+PC9nPjwvZz48L3N2Zz4=)',
    'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNlMGUwZTAiIGZpbGwtb3BhY2l0eT0iMC40Ij48Y2lyY2xlIGN4PSIzIiBjeT0iMyIgcj0iMyIvPjwvZz48L2c+PC9zdmc+)',
  ];

  return (
    <div className="p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <Palette className="w-4 h-4" />
        Backgrounds
      </h3>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 border-b border-gray-200">
        {[
          { key: 'solid', label: 'Solid', icon: Palette },
          { key: 'gradient', label: 'Gradient', icon: Sparkles },
          { key: 'pattern', label: 'Pattern', icon: Grid },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-3 py-2 text-xs font-medium transition-colors relative flex items-center gap-1 ${
              activeTab === tab.key
                ? 'text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon className="w-3 h-3" />
            {tab.label}
            {activeTab === tab.key && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="max-h-96 overflow-y-auto">
        {activeTab === 'solid' && (
          <div className="grid grid-cols-5 gap-2">
            {solidColors.map((color) => (
              <button
                key={color}
                onClick={() => onBackgroundSelect(color)}
                className="aspect-square rounded-lg border-2 border-gray-200 hover:border-blue-500 transition-all hover:scale-110"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        )}

        {activeTab === 'gradient' && (
          <div className="grid grid-cols-2 gap-2">
            {gradients.map((gradient, i) => (
              <button
                key={i}
                onClick={() => onBackgroundSelect(gradient)}
                className="aspect-square rounded-lg border-2 border-gray-200 hover:border-blue-500 transition-all hover:scale-105"
                style={{ background: gradient }}
              />
            ))}
          </div>
        )}

        {activeTab === 'pattern' && (
          <div className="grid grid-cols-2 gap-2">
            {patterns.map((pattern, i) => (
              <button
                key={i}
                onClick={() => onBackgroundSelect(pattern)}
                className="aspect-square rounded-lg border-2 border-gray-200 hover:border-blue-500 transition-all hover:scale-105"
                style={{ background: pattern, backgroundSize: '20px 20px' }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
