"use client";
import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { fabric } from 'fabric';
import { useEditorStore } from '@/store/editorStore';

export interface CanvasHandle {
  addPhoto: (url: string) => void;
  addText: () => void;
  addShape: (type: 'rectangle' | 'circle') => void;
  deleteSelected: () => void;
  getCanvas: () => fabric.Canvas | null;
}

const EditorCanvas = forwardRef<CanvasHandle>((props, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const { project, currentPageId, zoom, selectedTool, updatePage } = useEditorStore();

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 800,
      backgroundColor: '#ffffff',
      preserveObjectStacking: true,
    });

    fabricRef.current = canvas;

    // Selection styles
    fabric.Object.prototype.set({
      transparentCorners: false,
      cornerColor: '#0376AD',
      cornerStyle: 'circle',
      borderColor: '#28BAAB',
      borderScaleFactor: 2,
      padding: 10,
    });

    // Add sample text
    const welcomeText = new fabric.IText('Click to edit text', {
      left: 100,
      top: 100,
      fontSize: 32,
      fontFamily: 'Inter',
      fill: '#1A1612',
    });
    canvas.add(welcomeText);

    // Handle object modifications
    canvas.on('object:modified', () => {
      saveCanvasState();
    });

    return () => {
      canvas.dispose();
    };
  }, []);

  // Save canvas state to store
  const saveCanvasState = () => {
    if (!fabricRef.current || !currentPageId) return;
    const json = fabricRef.current.toJSON();
    updatePage(currentPageId, { elements: json.objects });
  };

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
      case 'photo':
      case 'shape':
        fabricRef.current.isDrawingMode = false;
        fabricRef.current.selection = true;
        break;
    }
  }, [selectedTool]);

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    addPhoto: (url: string) => {
      if (!fabricRef.current) return;
      
      fabric.Image.fromURL(url, (img) => {
        // Scale to fit
        const maxWidth = 400;
        const maxHeight = 400;
        const scale = Math.min(maxWidth / (img.width || 1), maxHeight / (img.height || 1));
        
        img.scale(scale);
        img.set({
          left: 200,
          top: 200,
        });
        
        fabricRef.current?.add(img);
        fabricRef.current?.setActiveObject(img);
        fabricRef.current?.renderAll();
        saveCanvasState();
      });
    },

    addText: () => {
      if (!fabricRef.current) return;
      
      const text = new fabric.IText('Double click to edit', {
        left: 200,
        top: 200,
        fontSize: 32,
        fontFamily: 'Inter',
        fill: '#1A1612',
      });
      
      fabricRef.current.add(text);
      fabricRef.current.setActiveObject(text);
      fabricRef.current.renderAll();
      saveCanvasState();
    },

    addShape: (type: 'rectangle' | 'circle') => {
      if (!fabricRef.current) return;
      
      let shape: fabric.Object;
      
      if (type === 'rectangle') {
        shape = new fabric.Rect({
          left: 200,
          top: 200,
          width: 200,
          height: 200,
          fill: '#28BAAB',
          stroke: '#0376AD',
          strokeWidth: 2,
        });
      } else {
        shape = new fabric.Circle({
          left: 200,
          top: 200,
          radius: 100,
          fill: '#28BAAB',
          stroke: '#0376AD',
          strokeWidth: 2,
        });
      }
      
      fabricRef.current.add(shape);
      fabricRef.current.setActiveObject(shape);
      fabricRef.current.renderAll();
      saveCanvasState();
    },

    deleteSelected: () => {
      if (!fabricRef.current) return;
      const active = fabricRef.current.getActiveObjects();
      fabricRef.current.remove(...active);
      fabricRef.current.discardActiveObject();
      fabricRef.current.renderAll();
      saveCanvasState();
    },

    getCanvas: () => fabricRef.current,
  }));

  return (
    <div className="flex-1 bg-gray-100 overflow-auto p-8 flex items-center justify-center">
      <div className="bg-white shadow-2xl rounded-lg overflow-hidden" style={{ width: 800, height: 800 }}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
});

EditorCanvas.displayName = 'EditorCanvas';

export default EditorCanvas;
