"use client";
import { useEffect, useRef } from 'react';
import { useEditorStore } from '@/store/editorStore';
import EditorToolbar from '@/components/editor/EditorToolbar';
import LeftSidebar from '@/components/editor/LeftSidebar';
import EditorCanvas, { CanvasHandle } from '@/components/editor/EditorCanvas';
import RightSidebar from '@/components/editor/RightSidebar';
import PageTimeline from '@/components/editor/PageTimeline';
import KeyboardShortcuts from '@/components/editor/KeyboardShortcuts';

export default function EditorPage({ params }: { params: { id: string } }) {
  const { setProject, setTool } = useEditorStore();
  const canvasRef = useRef<CanvasHandle>(null);

  useEffect(() => {
    // Initialize with a sample project
    setProject({
      id: params.id,
      name: 'My Photo Book',
      size: '8x8',
      coverType: 'hardcover',
      paperType: 'matte',
      pages: [
        {
          id: 'page-1',
          number: 1,
          width: 800,
          height: 800,
          elements: [],
          background: '#ffffff',
        },
        {
          id: 'page-2',
          number: 2,
          width: 800,
          height: 800,
          elements: [],
          background: '#ffffff',
        },
      ],
    });

    // Keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      // Delete key
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        canvasRef.current?.deleteSelected();
      }

      // Tool shortcuts
      if (e.key === 'v' || e.key === 'V') {
        e.preventDefault();
        setTool('select');
      }
      if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        setTool('text');
        canvasRef.current?.addText();
      }
      if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        setTool('photo');
      }
      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        setTool('shape');
        canvasRef.current?.addShape('rectangle');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [params.id, setProject, setTool]);

  const handlePhotoSelect = (url: string) => {
    canvasRef.current?.addPhoto(url);
  };

  const handleAddText = () => {
    canvasRef.current?.addText();
  };

  const handleAddShape = (shape: 'rectangle' | 'circle') => {
    canvasRef.current?.addShape(shape);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      {/* Top Toolbar */}
      <EditorToolbar />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <LeftSidebar 
          onPhotoSelect={handlePhotoSelect}
          onAddText={handleAddText}
          onAddShape={handleAddShape}
        />

        {/* Canvas Area */}
        <EditorCanvas ref={canvasRef} />

        {/* Right Sidebar */}
        <RightSidebar />
      </div>

      {/* Bottom Timeline */}
      <PageTimeline />

      {/* Keyboard Shortcuts Helper */}
      <KeyboardShortcuts />
    </div>
  );
}
