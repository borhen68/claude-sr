"use client";
import { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { useEditorStore } from '@/store/editorStore';

export default function EditorCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const { project, currentPageId, zoom, selectedTool } = useEditorStore();

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize Fabric canvas
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 800,
      backgroundColor: '#ffffff',
    });

    fabricRef.current = canvas;

    // Add sample elements
    const text = new fabric.Text('Double click to edit', {
      left: 100,
      top: 100,
      fontSize: 24,
      fill: '#333',
    });
    canvas.add(text);

    return () => {
      canvas.dispose();
    };
  }, []);

  // Update zoom
  useEffect(() => {
    if (fabricRef.current) {
      fabricRef.current.setZoom(zoom);
      fabricRef.current.renderAll();
    }
  }, [zoom]);

  // Handle tool changes
  useEffect(() => {
    if (!fabricRef.current) return;

    switch (selectedTool) {
      case 'select':
        fabricRef.current.isDrawingMode = false;
        fabricRef.current.selection = true;
        break;
      case 'text':
        // Add text on click
        break;
      case 'photo':
        // Add photo on click
        break;
      case 'shape':
        // Add shape on click
        break;
    }
  }, [selectedTool]);

  return (
    <div className="flex-1 bg-gray-100 overflow-auto p-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <canvas ref={canvasRef} />
        </div>
      </div>
    </div>
  );
}
