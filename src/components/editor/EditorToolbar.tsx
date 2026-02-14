"use client";
import Image from 'next/image';
import Link from 'next/link';
import { 
  MousePointer2, Type, Image as ImageIcon, Square, 
  Undo2, Redo2, ZoomIn, ZoomOut, Save, Download,
  Layers, AlignLeft, AlignCenter, AlignRight,
  Bold, Italic, Underline, Menu
} from 'lucide-react';
import { useEditorStore } from '@/store/editorStore';

export default function EditorToolbar() {
  const { selectedTool, setTool, zoom, setZoom, undo, redo, project } = useEditorStore();
  
  const tools = [
    { id: 'select' as const, icon: MousePointer2, label: 'Select (V)' },
    { id: 'text' as const, icon: Type, label: 'Text (T)' },
    { id: 'photo' as const, icon: ImageIcon, label: 'Photo (P)' },
    { id: 'shape' as const, icon: Square, label: 'Shape (R)' },
  ];

  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 gap-4">
      {/* Logo & Project Name */}
      <div className="flex items-center gap-4 min-w-[250px]">
        <Link href="/" className="flex items-center">
          <Image 
            src="/logo.svg" 
            alt="Frametale" 
            width={120} 
            height={24}
            className="h-6 w-auto"
          />
        </Link>
        <div className="w-px h-8 bg-gray-200" />
        <div>
          <div className="text-sm font-medium text-gray-900">
            {project?.name || 'Untitled Project'}
          </div>
          <div className="text-xs text-gray-500">
            {project?.size} • {project?.coverType}
          </div>
        </div>
      </div>

      {/* Left: Tools */}
      <div className="flex items-center gap-2">
        {tools.map(tool => (
          <button
            key={tool.id}
            onClick={() => setTool(tool.id)}
            className={`
              p-2.5 rounded-lg transition-all
              ${selectedTool === tool.id 
                ? 'bg-blue-100 text-blue-600 shadow-sm' 
                : 'hover:bg-gray-100 text-gray-700'
              }
            `}
            title={tool.label}
          >
            <tool.icon className="w-5 h-5" />
          </button>
        ))}
        
        <div className="w-px h-8 bg-gray-200 mx-1" />
        
        <button 
          onClick={undo} 
          className="p-2.5 rounded-lg hover:bg-gray-100 text-gray-700" 
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="w-5 h-5" />
        </button>
        <button 
          onClick={redo} 
          className="p-2.5 rounded-lg hover:bg-gray-100 text-gray-700" 
          title="Redo (Ctrl+Y)"
        >
          <Redo2 className="w-5 h-5" />
        </button>
      </div>

      {/* Center: Text Tools */}
      <div className="flex items-center gap-2">
        <button className="p-2.5 rounded-lg hover:bg-gray-100 text-gray-700" title="Bold (Ctrl+B)">
          <Bold className="w-5 h-5" />
        </button>
        <button className="p-2.5 rounded-lg hover:bg-gray-100 text-gray-700" title="Italic (Ctrl+I)">
          <Italic className="w-5 h-5" />
        </button>
        <button className="p-2.5 rounded-lg hover:bg-gray-100 text-gray-700" title="Underline (Ctrl+U)">
          <Underline className="w-5 h-5" />
        </button>
        
        <div className="w-px h-8 bg-gray-200 mx-1" />
        
        <button className="p-2.5 rounded-lg hover:bg-gray-100 text-gray-700" title="Align Left">
          <AlignLeft className="w-5 h-5" />
        </button>
        <button className="p-2.5 rounded-lg hover:bg-gray-100 text-gray-700" title="Align Center">
          <AlignCenter className="w-5 h-5" />
        </button>
        <button className="p-2.5 rounded-lg hover:bg-gray-100 text-gray-700" title="Align Right">
          <AlignRight className="w-5 h-5" />
        </button>
      </div>

      {/* Right: View & Actions */}
      <div className="flex items-center gap-2">
        <button 
          onClick={() => setZoom(zoom - 0.1)} 
          className="p-2.5 rounded-lg hover:bg-gray-100 text-gray-700"
          title="Zoom Out (Ctrl+-)"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <div className="min-w-[70px] text-center">
          <select 
            value={Math.round(zoom * 100)}
            onChange={(e) => setZoom(Number(e.target.value) / 100)}
            className="text-sm font-medium bg-transparent border-0 focus:ring-0 cursor-pointer"
          >
            <option value="25">25%</option>
            <option value="50">50%</option>
            <option value="75">75%</option>
            <option value="100">100%</option>
            <option value="150">150%</option>
            <option value="200">200%</option>
          </select>
        </div>
        <button 
          onClick={() => setZoom(zoom + 0.1)} 
          className="p-2.5 rounded-lg hover:bg-gray-100 text-gray-700"
          title="Zoom In (Ctrl++)"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        
        <div className="w-px h-8 bg-gray-200 mx-1" />
        
        <button className="p-2.5 rounded-lg hover:bg-gray-100 text-gray-700" title="Layers">
          <Layers className="w-5 h-5" />
        </button>
        <button className="p-2.5 rounded-lg hover:bg-gray-100 text-gray-700" title="Save (Ctrl+S)">
          <Save className="w-5 h-5" />
        </button>
        <button className="px-4 py-2 bg-gradient-to-r from-[#28BAAB] to-[#0376AD] text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>
    </div>
  );
}
