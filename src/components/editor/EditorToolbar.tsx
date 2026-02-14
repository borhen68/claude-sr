"use client";
import { 
  MousePointer2, Type, Image as ImageIcon, Square, 
  Undo2, Redo2, ZoomIn, ZoomOut, Save, Download,
  Layers, AlignLeft, AlignCenter, AlignRight,
  Bold, Italic, Underline
} from 'lucide-react';
import { useEditorStore } from '@/store/editorStore';

export default function EditorToolbar() {
  const { selectedTool, setTool, zoom, setZoom, undo, redo } = useEditorStore();
  
  const tools = [
    { id: 'select' as const, icon: MousePointer2, label: 'Select' },
    { id: 'text' as const, icon: Type, label: 'Text' },
    { id: 'photo' as const, icon: ImageIcon, label: 'Photo' },
    { id: 'shape' as const, icon: Square, label: 'Shape' },
  ];

  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4">
      {/* Left: Tools */}
      <div className="flex items-center gap-2">
        {tools.map(tool => (
          <button
            key={tool.id}
            onClick={() => setTool(tool.id)}
            className={`
              p-2 rounded-lg transition-colors
              ${selectedTool === tool.id 
                ? 'bg-blue-100 text-blue-600' 
                : 'hover:bg-gray-100 text-gray-700'
              }
            `}
            title={tool.label}
          >
            <tool.icon className="w-5 h-5" />
          </button>
        ))}
        
        <div className="w-px h-8 bg-gray-200 mx-2" />
        
        <button onClick={undo} className="p-2 rounded-lg hover:bg-gray-100" title="Undo">
          <Undo2 className="w-5 h-5" />
        </button>
        <button onClick={redo} className="p-2 rounded-lg hover:bg-gray-100" title="Redo">
          <Redo2 className="w-5 h-5" />
        </button>
      </div>

      {/* Center: Text Tools */}
      <div className="flex items-center gap-2">
        <button className="p-2 rounded-lg hover:bg-gray-100" title="Bold">
          <Bold className="w-5 h-5" />
        </button>
        <button className="p-2 rounded-lg hover:bg-gray-100" title="Italic">
          <Italic className="w-5 h-5" />
        </button>
        <button className="p-2 rounded-lg hover:bg-gray-100" title="Underline">
          <Underline className="w-5 h-5" />
        </button>
        
        <div className="w-px h-8 bg-gray-200 mx-2" />
        
        <button className="p-2 rounded-lg hover:bg-gray-100" title="Align Left">
          <AlignLeft className="w-5 h-5" />
        </button>
        <button className="p-2 rounded-lg hover:bg-gray-100" title="Align Center">
          <AlignCenter className="w-5 h-5" />
        </button>
        <button className="p-2 rounded-lg hover:bg-gray-100" title="Align Right">
          <AlignRight className="w-5 h-5" />
        </button>
      </div>

      {/* Right: View & Actions */}
      <div className="flex items-center gap-2">
        <button 
          onClick={() => setZoom(zoom - 0.1)} 
          className="p-2 rounded-lg hover:bg-gray-100"
          title="Zoom Out"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <span className="text-sm font-medium min-w-[60px] text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button 
          onClick={() => setZoom(zoom + 0.1)} 
          className="p-2 rounded-lg hover:bg-gray-100"
          title="Zoom In"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        
        <div className="w-px h-8 bg-gray-200 mx-2" />
        
        <button className="p-2 rounded-lg hover:bg-gray-100" title="Layers">
          <Layers className="w-5 h-5" />
        </button>
        <button className="p-2 rounded-lg hover:bg-gray-100" title="Save">
          <Save className="w-5 h-5" />
        </button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>
    </div>
  );
}
