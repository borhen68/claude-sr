"use client";
import { useState } from 'react';
import { Image, Type, Square, Shapes, Sticker, Upload, Sliders, Palette, Sparkles, Scissors, Grid3x3 } from 'lucide-react';
import PhotoUploadPanel from './PhotoUploadPanel';
import FilterPanel, { FilterSettings } from './FilterPanel';
import BackgroundLibrary from './BackgroundLibrary';
import StickersLibrary from './StickersLibrary';
import TextEffectsPanel, { TextEffects } from './TextEffectsPanel';
import MaskingPanel from './MaskingPanel';
import AlignmentPanel from './AlignmentPanel';

interface LeftSidebarEnhancedProps {
  onPhotoSelect: (url: string) => void;
  onAddText: () => void;
  onAddShape: (shape: 'rectangle' | 'circle') => void;
  onApplyFilter: (filters: FilterSettings) => void;
  onPresetFilter: (preset: string) => void;
  onBackgroundSelect: (background: string) => void;
  onStickerSelect: (sticker: { type: string; icon: string; color: string }) => void;
  onTextEffectsChange: (effects: TextEffects) => void;
  onApplyMask: (maskType: string) => void;
  onAlign: (type: string) => void;
  onDistribute: (direction: 'horizontal' | 'vertical') => void;
  onToggleGrid: () => void;
  gridEnabled: boolean;
}

export default function LeftSidebarEnhanced({
  onPhotoSelect,
  onAddText,
  onAddShape,
  onApplyFilter,
  onPresetFilter,
  onBackgroundSelect,
  onStickerSelect,
  onTextEffectsChange,
  onApplyMask,
  onAlign,
  onDistribute,
  onToggleGrid,
  gridEnabled,
}: LeftSidebarEnhancedProps) {
  const [activePanel, setActivePanel] = useState<string>('elements');

  const panels = [
    { id: 'elements', icon: Shapes, label: 'Elements' },
    { id: 'photos', icon: Image, label: 'Photos' },
    { id: 'filters', icon: Sliders, label: 'Filters' },
    { id: 'backgrounds', icon: Palette, label: 'Backgrounds' },
    { id: 'stickers', icon: Sticker, label: 'Stickers' },
    { id: 'text-effects', icon: Sparkles, label: 'Text Effects' },
    { id: 'masking', icon: Scissors, label: 'Masking' },
    { id: 'alignment', icon: Grid3x3, label: 'Alignment' },
  ];

  const elements = [
    { icon: Type, label: 'Text', desc: 'Add text boxes', action: onAddText },
    { icon: Square, label: 'Rectangle', desc: 'Add rectangle', action: () => onAddShape('rectangle') },
    { icon: Shapes, label: 'Circle', desc: 'Add circle', action: () => onAddShape('circle') },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 overflow-hidden flex flex-col">
      {/* Panel Tabs */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="flex overflow-x-auto">
          {panels.map((panel) => (
            <button
              key={panel.id}
              onClick={() => setActivePanel(panel.id)}
              className={`flex-1 min-w-[80px] px-3 py-3 text-xs font-medium transition-colors relative flex flex-col items-center gap-1 ${
                activePanel === panel.id
                  ? 'text-blue-600 bg-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title={panel.label}
            >
              <panel.icon className="w-4 h-4" />
              <span className="truncate w-full text-center">{panel.label}</span>
              {activePanel === panel.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Panel Content */}
      <div className="flex-1 overflow-y-auto">
        {activePanel === 'elements' && (
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Basic Elements</h3>
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
        )}

        {activePanel === 'photos' && (
          <PhotoUploadPanel onPhotoSelect={onPhotoSelect} />
        )}

        {activePanel === 'filters' && (
          <FilterPanel onApplyFilter={onApplyFilter} onPresetFilter={onPresetFilter} />
        )}

        {activePanel === 'backgrounds' && (
          <BackgroundLibrary onBackgroundSelect={onBackgroundSelect} />
        )}

        {activePanel === 'stickers' && (
          <StickersLibrary onStickerSelect={onStickerSelect} />
        )}

        {activePanel === 'text-effects' && (
          <TextEffectsPanel onEffectChange={onTextEffectsChange} />
        )}

        {activePanel === 'masking' && (
          <MaskingPanel onApplyMask={onApplyMask} />
        )}

        {activePanel === 'alignment' && (
          <AlignmentPanel
            onAlign={onAlign}
            onDistribute={onDistribute}
            onToggleGrid={onToggleGrid}
            gridEnabled={gridEnabled}
          />
        )}
      </div>

      {/* Quick Templates */}
      {activePanel === 'elements' && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
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
      )}
    </div>
  );
}
