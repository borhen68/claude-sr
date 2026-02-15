"use client";
import { useState, useEffect } from 'react';
import { Layers, Eye, EyeOff, Lock, Unlock, Trash2, Copy, ArrowUp, ArrowDown } from 'lucide-react';

export interface Layer {
  id: string;
  name: string;
  type: 'text' | 'image' | 'shape' | 'sticker';
  visible: boolean;
  locked: boolean;
  zIndex: number;
}

interface LayerManagementPanelProps {
  layers: Layer[];
  selectedLayerId: string | null;
  onLayerSelect: (layerId: string) => void;
  onLayerVisibilityToggle: (layerId: string) => void;
  onLayerLockToggle: (layerId: string) => void;
  onLayerDelete: (layerId: string) => void;
  onLayerDuplicate: (layerId: string) => void;
  onLayerReorder: (layerId: string, direction: 'up' | 'down') => void;
}

export default function LayerManagementPanel({
  layers,
  selectedLayerId,
  onLayerSelect,
  onLayerVisibilityToggle,
  onLayerLockToggle,
  onLayerDelete,
  onLayerDuplicate,
  onLayerReorder,
}: LayerManagementPanelProps) {
  // Sort layers by zIndex (highest on top)
  const sortedLayers = [...layers].sort((a, b) => b.zIndex - a.zIndex);

  return (
    <div className="p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <Layers className="w-4 h-4" />
        Layers ({layers.length})
      </h3>

      {/* Layer List */}
      <div className="space-y-1 max-h-96 overflow-y-auto">
        {sortedLayers.map((layer) => (
          <div
            key={layer.id}
            className={`group relative rounded-lg border-2 transition-all ${
              selectedLayerId === layer.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <div
              onClick={() => onLayerSelect(layer.id)}
              className="flex items-center gap-2 p-2 cursor-pointer"
            >
              {/* Type Icon */}
              <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                {layer.type === 'text' && 'T'}
                {layer.type === 'image' && '📷'}
                {layer.type === 'shape' && '⬛'}
                {layer.type === 'sticker' && '⭐'}
              </div>

              {/* Name */}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">{layer.name}</div>
                <div className="text-xs text-gray-500">{layer.type}</div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onLayerVisibilityToggle(layer.id);
                  }}
                  className="p-1 rounded hover:bg-gray-200 transition-colors"
                  title={layer.visible ? 'Hide' : 'Show'}
                >
                  {layer.visible ? (
                    <Eye className="w-4 h-4 text-gray-600" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  )}
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onLayerLockToggle(layer.id);
                  }}
                  className="p-1 rounded hover:bg-gray-200 transition-colors"
                  title={layer.locked ? 'Unlock' : 'Lock'}
                >
                  {layer.locked ? (
                    <Lock className="w-4 h-4 text-gray-600" />
                  ) : (
                    <Unlock className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Expanded Controls (on select) */}
            {selectedLayerId === layer.id && (
              <div className="border-t border-gray-200 bg-gray-50 p-2 flex gap-1">
                <button
                  onClick={() => onLayerReorder(layer.id, 'up')}
                  className="flex-1 px-2 py-1 text-xs rounded bg-white hover:bg-gray-100 border border-gray-200 flex items-center justify-center gap-1"
                  title="Move Up"
                >
                  <ArrowUp className="w-3 h-3" />
                  Up
                </button>
                <button
                  onClick={() => onLayerReorder(layer.id, 'down')}
                  className="flex-1 px-2 py-1 text-xs rounded bg-white hover:bg-gray-100 border border-gray-200 flex items-center justify-center gap-1"
                  title="Move Down"
                >
                  <ArrowDown className="w-3 h-3" />
                  Down
                </button>
                <button
                  onClick={() => onLayerDuplicate(layer.id)}
                  className="flex-1 px-2 py-1 text-xs rounded bg-white hover:bg-gray-100 border border-gray-200 flex items-center justify-center gap-1"
                  title="Duplicate"
                >
                  <Copy className="w-3 h-3" />
                  Copy
                </button>
                <button
                  onClick={() => onLayerDelete(layer.id)}
                  className="flex-1 px-2 py-1 text-xs rounded bg-white hover:bg-red-50 border border-gray-200 hover:border-red-300 text-red-600 flex items-center justify-center gap-1"
                  title="Delete"
                >
                  <Trash2 className="w-3 h-3" />
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}

        {layers.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <Layers className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No layers yet</p>
            <p className="text-xs">Add elements to create layers</p>
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {layers.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => layers.forEach(l => onLayerVisibilityToggle(l.id))}
              className="px-3 py-2 text-xs rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
            >
              <Eye className="w-3 h-3" />
              Toggle All
            </button>
            <button
              onClick={() => layers.forEach(l => onLayerLockToggle(l.id))}
              className="px-3 py-2 text-xs rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
            >
              <Lock className="w-3 h-3" />
              Lock All
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
