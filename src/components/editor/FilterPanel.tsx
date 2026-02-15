"use client";
import { useState } from 'react';
import { Sliders, Sparkles, Sun, Droplets, Contrast, Blur, Image as ImageIcon } from 'lucide-react';

export interface FilterSettings {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  sepia: number;
  grayscale: number;
  vintage: number;
  hue: number;
  sharpen: number;
}

interface FilterPanelProps {
  onApplyFilter: (filters: FilterSettings) => void;
  onPresetFilter: (preset: string) => void;
}

export default function FilterPanel({ onApplyFilter, onPresetFilter }: FilterPanelProps) {
  const [filters, setFilters] = useState<FilterSettings>({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    blur: 0,
    sepia: 0,
    grayscale: 0,
    vintage: 0,
    hue: 0,
    sharpen: 0,
  });

  const [activeTab, setActiveTab] = useState<'presets' | 'adjust'>('presets');

  const presets = [
    { name: 'Normal', icon: ImageIcon, filters: {} },
    { name: 'Vintage', icon: Sparkles, key: 'vintage' },
    { name: 'Grayscale', icon: Contrast, key: 'grayscale' },
    { name: 'Sepia', icon: Sun, key: 'sepia' },
    { name: 'Cold', icon: Droplets, key: 'cold' },
    { name: 'Warm', icon: Sun, key: 'warm' },
    { name: 'Dramatic', icon: Contrast, key: 'dramatic' },
    { name: 'Soft', icon: Blur, key: 'soft' },
  ];

  const handleFilterChange = (key: keyof FilterSettings, value: number) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onApplyFilter(newFilters);
  };

  const handleReset = () => {
    const resetFilters: FilterSettings = {
      brightness: 0,
      contrast: 0,
      saturation: 0,
      blur: 0,
      sepia: 0,
      grayscale: 0,
      vintage: 0,
      hue: 0,
      sharpen: 0,
    };
    setFilters(resetFilters);
    onApplyFilter(resetFilters);
  };

  return (
    <div className="p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <Sliders className="w-4 h-4" />
        Photo Filters
      </h3>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('presets')}
          className={`px-3 py-2 text-sm font-medium transition-colors relative ${
            activeTab === 'presets'
              ? 'text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Presets
          {activeTab === 'presets' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('adjust')}
          className={`px-3 py-2 text-sm font-medium transition-colors relative ${
            activeTab === 'adjust'
              ? 'text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Adjust
          {activeTab === 'adjust' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
          )}
        </button>
      </div>

      {/* Presets */}
      {activeTab === 'presets' && (
        <div className="grid grid-cols-2 gap-3">
          {presets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => onPresetFilter(preset.key || 'normal')}
              className="group relative overflow-hidden rounded-lg border-2 border-gray-200 hover:border-blue-500 transition-all"
            >
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <preset.icon className="w-8 h-8 text-gray-400 group-hover:text-blue-500 transition-colors" />
              </div>
              <div className="p-2 bg-white text-xs font-medium text-gray-700 group-hover:text-blue-600">
                {preset.name}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Adjust */}
      {activeTab === 'adjust' && (
        <div className="space-y-4">
          <FilterSlider
            label="Brightness"
            value={filters.brightness}
            onChange={(v) => handleFilterChange('brightness', v)}
            min={-100}
            max={100}
          />
          <FilterSlider
            label="Contrast"
            value={filters.contrast}
            onChange={(v) => handleFilterChange('contrast', v)}
            min={-100}
            max={100}
          />
          <FilterSlider
            label="Saturation"
            value={filters.saturation}
            onChange={(v) => handleFilterChange('saturation', v)}
            min={-100}
            max={100}
          />
          <FilterSlider
            label="Blur"
            value={filters.blur}
            onChange={(v) => handleFilterChange('blur', v)}
            min={0}
            max={100}
          />
          <FilterSlider
            label="Sepia"
            value={filters.sepia}
            onChange={(v) => handleFilterChange('sepia', v)}
            min={0}
            max={100}
          />
          <FilterSlider
            label="Grayscale"
            value={filters.grayscale}
            onChange={(v) => handleFilterChange('grayscale', v)}
            min={0}
            max={100}
          />
          <FilterSlider
            label="Hue Rotate"
            value={filters.hue}
            onChange={(v) => handleFilterChange('hue', v)}
            min={-180}
            max={180}
          />

          <button
            onClick={handleReset}
            className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
          >
            Reset All
          </button>
        </div>
      )}
    </div>
  );
}

interface FilterSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

function FilterSlider({ label, value, onChange, min = 0, max = 100 }: FilterSliderProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="text-xs font-medium text-gray-600">{label}</label>
        <span className="text-xs font-mono text-gray-500">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
      />
    </div>
  );
}
