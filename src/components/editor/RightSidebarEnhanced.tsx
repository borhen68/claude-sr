"use client";
import { useState, useEffect } from 'react';
import { Palette, Type, Layout, Layers } from 'lucide-react';
import LayerManagementPanel, { Layer } from './LayerManagementPanel';

interface RightSidebarEnhancedProps {
  layers: Layer[];
  selectedLayerId: string | null;
  onLayerSelect: (layerId: string) => void;
  onLayerVisibilityToggle: (layerId: string) => void;
  onLayerLockToggle: (layerId: string) => void;
  onLayerDelete: (layerId: string) => void;
  onLayerDuplicate: (layerId: string) => void;
  onLayerReorder: (layerId: string, direction: 'up' | 'down') => void;
  onPropertyChange?: (property: string, value: any) => void;
}

export default function RightSidebarEnhanced({
  layers,
  selectedLayerId,
  onLayerSelect,
  onLayerVisibilityToggle,
  onLayerLockToggle,
  onLayerDelete,
  onLayerDuplicate,
  onLayerReorder,
  onPropertyChange,
}: RightSidebarEnhancedProps) {
  const [activeTab, setActiveTab] = useState<'properties' | 'layers'>('layers');

  return (
    <div className="w-80 bg-white border-l border-gray-200 overflow-hidden flex flex-col">
      {/* Tabs */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="flex">
          <button
            onClick={() => setActiveTab('properties')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative flex items-center justify-center gap-2 ${
              activeTab === 'properties'
                ? 'text-blue-600 bg-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Layout className="w-4 h-4" />
            Properties
            {activeTab === 'properties' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('layers')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative flex items-center justify-center gap-2 ${
              activeTab === 'layers'
                ? 'text-blue-600 bg-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            Layers ({layers.length})
            {activeTab === 'layers' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'properties' && (
          <div className="p-4 space-y-4">
            {/* Properties Panel */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <Layout className="w-4 h-4" />
                Transform
              </h3>
              
              <div className="space-y-4">
                {/* Position */}
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-2 block">Position</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-gray-500">X</label>
                      <input type="number" className="w-full px-2 py-1 border rounded text-sm" defaultValue="0" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Y</label>
                      <input type="number" className="w-full px-2 py-1 border rounded text-sm" defaultValue="0" />
                    </div>
                  </div>
                </div>

                {/* Size */}
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-2 block">Size</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-gray-500">W</label>
                      <input type="number" className="w-full px-2 py-1 border rounded text-sm" defaultValue="200" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">H</label>
                      <input type="number" className="w-full px-2 py-1 border rounded text-sm" defaultValue="200" />
                    </div>
                  </div>
                </div>

                {/* Rotation */}
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-2 block">Rotation</label>
                  <input type="range" min="0" max="360" defaultValue="0" className="w-full accent-blue-600" />
                </div>

                {/* Opacity */}
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-2 block">Opacity</label>
                  <input type="range" min="0" max="100" defaultValue="100" className="w-full accent-blue-600" />
                </div>
              </div>
            </div>

            {/* Text Properties */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <Type className="w-4 h-4" />
                Text
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Font</label>
                  <select className="w-full px-2 py-1 border rounded text-sm">
                    <option>Inter</option>
                    <option>Playfair Display</option>
                    <option>Roboto</option>
                    <option>Montserrat</option>
                    <option>Lora</option>
                    <option>Open Sans</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">Size</label>
                    <input type="number" className="w-full px-2 py-1 border rounded text-sm" defaultValue="16" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">Weight</label>
                    <select className="w-full px-2 py-1 border rounded text-sm">
                      <option>Regular</option>
                      <option>Bold</option>
                      <option>Light</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Color */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Color
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-2 block">Fill</label>
                  <div className="flex gap-2">
                    <div className="w-10 h-10 rounded border border-gray-300 bg-black cursor-pointer"></div>
                    <input type="text" className="flex-1 px-2 py-1 border rounded text-sm" defaultValue="#000000" />
                  </div>
                </div>
                
                <div className="grid grid-cols-8 gap-2">
                  {['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFFFFF', '#F97316', '#FBBF24', '#34D399', '#3B82F6', '#8B5CF6', '#EC4899', '#6B7280', '#D1D5DB'].map(color => (
                    <div
                      key={color}
                      className="aspect-square rounded border border-gray-300 cursor-pointer hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'layers' && (
          <LayerManagementPanel
            layers={layers}
            selectedLayerId={selectedLayerId}
            onLayerSelect={onLayerSelect}
            onLayerVisibilityToggle={onLayerVisibilityToggle}
            onLayerLockToggle={onLayerLockToggle}
            onLayerDelete={onLayerDelete}
            onLayerDuplicate={onLayerDuplicate}
            onLayerReorder={onLayerReorder}
          />
        )}
      </div>
    </div>
  );
}
