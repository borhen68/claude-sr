"use client";
import { Palette, Type, Layout, Layers } from 'lucide-react';

export default function RightSidebar() {
  return (
    <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
      {/* Properties Panel */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <Layout className="w-4 h-4" />
          Properties
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
            <input type="range" min="0" max="360" defaultValue="0" className="w-full" />
          </div>

          {/* Opacity */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-2 block">Opacity</label>
            <input type="range" min="0" max="100" defaultValue="100" className="w-full" />
          </div>
        </div>
      </div>

      {/* Text Properties */}
      <div className="p-4 border-b border-gray-200">
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
      <div className="p-4 border-b border-gray-200">
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
          
          <div className="grid grid-cols-4 gap-2">
            {['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFFFFF'].map(color => (
              <div
                key={color}
                className="aspect-square rounded border border-gray-300 cursor-pointer hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Layers */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4" />
          Layers
        </h3>
        
        <div className="space-y-1">
          {['Text Layer', 'Photo Layer 1', 'Background'].map((layer, i) => (
            <div
              key={i}
              className="px-3 py-2 rounded bg-gray-50 hover:bg-gray-100 cursor-pointer text-sm"
            >
              {layer}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
