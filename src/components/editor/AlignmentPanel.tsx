"use client";
import { AlignLeft, AlignCenter, AlignRight, AlignVerticalJustifyCenter, AlignHorizontalJustifyCenter, Grid3x3, Distribute } from 'lucide-react';

interface AlignmentPanelProps {
  onAlign: (type: string) => void;
  onDistribute: (direction: 'horizontal' | 'vertical') => void;
  onToggleGrid: () => void;
  gridEnabled: boolean;
}

export default function AlignmentPanel({ onAlign, onDistribute, onToggleGrid, gridEnabled }: AlignmentPanelProps) {
  const alignments = [
    { icon: AlignLeft, name: 'Left', action: () => onAlign('left') },
    { icon: AlignCenter, name: 'Center H', action: () => onAlign('center-h') },
    { icon: AlignRight, name: 'Right', action: () => onAlign('right') },
    { icon: AlignVerticalJustifyCenter, name: 'Top', action: () => onAlign('top') },
    { icon: AlignHorizontalJustifyCenter, name: 'Center V', action: () => onAlign('center-v') },
    { icon: AlignVerticalJustifyCenter, name: 'Bottom', action: () => onAlign('bottom') },
  ];

  return (
    <div className="p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Alignment</h3>

      {/* Align */}
      <div className="mb-4">
        <label className="text-xs font-medium text-gray-600 mb-2 block">Align Objects</label>
        <div className="grid grid-cols-3 gap-2">
          {alignments.map((item) => (
            <button
              key={item.name}
              onClick={item.action}
              className="p-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all flex flex-col items-center gap-1"
              title={item.name}
            >
              <item.icon className="w-5 h-5 text-gray-600" />
              <span className="text-xs text-gray-500">{item.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Distribute */}
      <div className="mb-4">
        <label className="text-xs font-medium text-gray-600 mb-2 block">Distribute</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onDistribute('horizontal')}
            className="p-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all flex flex-col items-center gap-1"
          >
            <Distribute className="w-5 h-5 text-gray-600 rotate-90" />
            <span className="text-xs text-gray-500">Horizontal</span>
          </button>
          <button
            onClick={() => onDistribute('vertical')}
            className="p-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all flex flex-col items-center gap-1"
          >
            <Distribute className="w-5 h-5 text-gray-600" />
            <span className="text-xs text-gray-500">Vertical</span>
          </button>
        </div>
      </div>

      {/* Snap to Grid */}
      <div>
        <label className="text-xs font-medium text-gray-600 mb-2 block">Grid</label>
        <button
          onClick={onToggleGrid}
          className={`w-full p-3 rounded-lg border-2 transition-all flex items-center gap-2 ${
            gridEnabled
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-200 hover:border-gray-300 text-gray-700'
          }`}
        >
          <Grid3x3 className="w-5 h-5" />
          <span className="text-sm font-medium">
            {gridEnabled ? 'Grid Enabled' : 'Enable Grid'}
          </span>
        </button>
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600">
          <strong>Tip:</strong> Select multiple objects (Shift+Click) to align or distribute them.
        </p>
      </div>
    </div>
  );
}
