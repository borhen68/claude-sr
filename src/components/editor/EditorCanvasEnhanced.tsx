"use client";
import { useEffect, useRef, useImperativeHandle, forwardRef, useState } from 'react';
import { fabric } from 'fabric';
import { useEditorStore } from '@/store/editorStore';
import { FilterSettings } from './FilterPanel';
import { TextEffects } from './TextEffectsPanel';
import { Layer } from './LayerManagementPanel';

export interface CanvasHandle {
  addPhoto: (url: string) => void;
  addText: () => void;
  addShape: (type: 'rectangle' | 'circle') => void;
  deleteSelected: () => void;
  getCanvas: () => fabric.Canvas | null;
  applyFilter: (filters: FilterSettings) => void;
  applyPresetFilter: (preset: string) => void;
  applyTextEffects: (effects: TextEffects) => void;
  applyMask: (maskType: string) => void;
  alignObjects: (type: string) => void;
  distributeObjects: (direction: 'horizontal' | 'vertical') => void;
  toggleGrid: () => void;
  getLayers: () => Layer[];
  toggleLayerVisibility: (layerId: string) => void;
  toggleLayerLock: (layerId: string) => void;
  deleteLayer: (layerId: string) => void;
  duplicateLayer: (layerId: string) => void;
  reorderLayer: (layerId: string, direction: 'up' | 'down') => void;
  selectLayer: (layerId: string) => void;
  setBackground: (background: string) => void;
  addSticker: (sticker: { type: string; icon: string; color: string }) => void;
}

const EditorCanvasEnhanced = forwardRef<CanvasHandle>((props, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const { project, currentPageId, zoom, selectedTool, updatePage } = useEditorStore();
  const [gridEnabled, setGridEnabled] = useState(false);
  const [layers, setLayers] = useState<Layer[]>([]);

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

    // Handle object modifications
    canvas.on('object:modified', () => {
      saveCanvasState();
      updateLayers();
    });

    canvas.on('object:added', () => {
      updateLayers();
    });

    canvas.on('object:removed', () => {
      updateLayers();
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

  // Update layers list
  const updateLayers = () => {
    if (!fabricRef.current) return;
    const objects = fabricRef.current.getObjects();
    const newLayers: Layer[] = objects.map((obj: any, index) => ({
      id: obj.id || `layer-${index}`,
      name: obj.name || `${obj.type} ${index + 1}`,
      type: obj.type === 'i-text' || obj.type === 'text' ? 'text' : 
            obj.type === 'image' ? 'image' : 
            obj.type === 'circle' || obj.type === 'rect' ? 'shape' : 'sticker',
      visible: obj.visible !== false,
      locked: obj.selectable === false,
      zIndex: objects.length - index,
    }));
    setLayers(newLayers);
  };

  // Update zoom
  useEffect(() => {
    if (fabricRef.current) {
      fabricRef.current.setZoom(zoom);
      fabricRef.current.renderAll();
    }
  }, [zoom]);

  // Grid
  const drawGrid = () => {
    if (!fabricRef.current) return;
    const canvas = fabricRef.current;
    const gridSize = 20;

    // Remove existing grid
    const objects = canvas.getObjects();
    objects.forEach(obj => {
      if ((obj as any).isGrid) {
        canvas.remove(obj);
      }
    });

    if (!gridEnabled) return;

    // Draw grid
    for (let i = 0; i < (canvas.width || 800) / gridSize; i++) {
      canvas.add(new fabric.Line([i * gridSize, 0, i * gridSize, canvas.height || 800], {
        stroke: '#e0e0e0',
        selectable: false,
        evented: false,
        strokeWidth: 0.5,
      } as any).set({ isGrid: true } as any));

      canvas.add(new fabric.Line([0, i * gridSize, canvas.width || 800, i * gridSize], {
        stroke: '#e0e0e0',
        selectable: false,
        evented: false,
        strokeWidth: 0.5,
      } as any).set({ isGrid: true } as any));
    }

    canvas.renderAll();
  };

  useEffect(() => {
    drawGrid();
  }, [gridEnabled]);

  // Apply filters to selected image
  const applyImageFilter = (filters: FilterSettings) => {
    if (!fabricRef.current) return;
    const activeObject = fabricRef.current.getActiveObject();
    if (!activeObject || activeObject.type !== 'image') return;

    const img = activeObject as fabric.Image;
    img.filters = [];

    if (filters.brightness !== 0) {
      img.filters.push(new fabric.Image.filters.Brightness({ brightness: filters.brightness / 100 }));
    }
    if (filters.contrast !== 0) {
      img.filters.push(new fabric.Image.filters.Contrast({ contrast: filters.contrast / 100 }));
    }
    if (filters.saturation !== 0) {
      img.filters.push(new fabric.Image.filters.Saturation({ saturation: filters.saturation / 100 }));
    }
    if (filters.blur > 0) {
      img.filters.push(new fabric.Image.filters.Blur({ blur: filters.blur / 100 }));
    }
    if (filters.sepia > 0) {
      img.filters.push(new fabric.Image.filters.Sepia());
    }
    if (filters.grayscale > 0) {
      img.filters.push(new fabric.Image.filters.Grayscale());
    }
    if (filters.hue !== 0) {
      img.filters.push(new fabric.Image.filters.HueRotation({ rotation: filters.hue / 180 }));
    }

    img.applyFilters();
    fabricRef.current.renderAll();
    saveCanvasState();
  };

  // Apply preset filters
  const applyPreset = (preset: string) => {
    const presets: { [key: string]: FilterSettings } = {
      normal: { brightness: 0, contrast: 0, saturation: 0, blur: 0, sepia: 0, grayscale: 0, vintage: 0, hue: 0, sharpen: 0 },
      vintage: { brightness: 10, contrast: 20, saturation: -20, blur: 0, sepia: 40, grayscale: 0, vintage: 100, hue: 0, sharpen: 0 },
      grayscale: { brightness: 0, contrast: 10, saturation: 0, blur: 0, sepia: 0, grayscale: 100, vintage: 0, hue: 0, sharpen: 0 },
      sepia: { brightness: 5, contrast: 10, saturation: 0, blur: 0, sepia: 80, grayscale: 0, vintage: 0, hue: 0, sharpen: 0 },
      cold: { brightness: 0, contrast: 10, saturation: 20, blur: 0, sepia: 0, grayscale: 0, vintage: 0, hue: -30, sharpen: 0 },
      warm: { brightness: 10, contrast: 10, saturation: 20, blur: 0, sepia: 0, grayscale: 0, vintage: 0, hue: 30, sharpen: 0 },
      dramatic: { brightness: -10, contrast: 50, saturation: 30, blur: 0, sepia: 0, grayscale: 0, vintage: 0, hue: 0, sharpen: 0 },
      soft: { brightness: 10, contrast: -10, saturation: -10, blur: 5, sepia: 0, grayscale: 0, vintage: 0, hue: 0, sharpen: 0 },
    };

    if (presets[preset]) {
      applyImageFilter(presets[preset]);
    }
  };

  // Apply text effects
  const applyTextEffects = (effects: TextEffects) => {
    if (!fabricRef.current) return;
    const activeObject = fabricRef.current.getActiveObject();
    if (!activeObject || (activeObject.type !== 'i-text' && activeObject.type !== 'text')) return;

    const text = activeObject as fabric.IText;

    // Shadow
    if (effects.shadow.enabled) {
      text.set('shadow', new fabric.Shadow({
        color: effects.shadow.color,
        blur: effects.shadow.blur,
        offsetX: effects.shadow.offsetX,
        offsetY: effects.shadow.offsetY,
      }));
    } else {
      text.set('shadow', null);
    }

    // Outline (stroke)
    if (effects.outline.enabled) {
      text.set({
        stroke: effects.outline.color,
        strokeWidth: effects.outline.width,
      });
    } else {
      text.set({
        stroke: '',
        strokeWidth: 0,
      });
    }

    // Glow
    if (effects.glow.enabled) {
      text.set('shadow', new fabric.Shadow({
        color: effects.glow.color,
        blur: effects.glow.blur,
        offsetX: 0,
        offsetY: 0,
      }));
    }

    // Gradient
    if (effects.gradient.enabled) {
      const gradient = new fabric.Gradient({
        type: effects.gradient.type,
        coords: effects.gradient.type === 'linear' 
          ? {
              x1: 0,
              y1: 0,
              x2: Math.cos((effects.gradient.angle * Math.PI) / 180) * (text.width || 100),
              y2: Math.sin((effects.gradient.angle * Math.PI) / 180) * (text.height || 100),
            }
          : {
              x1: (text.width || 100) / 2,
              y1: (text.height || 100) / 2,
              x2: (text.width || 100) / 2,
              y2: (text.height || 100) / 2,
              r1: 0,
              r2: (text.width || 100) / 2,
            },
        colorStops: [
          { offset: 0, color: effects.gradient.colors[0] },
          { offset: 1, color: effects.gradient.colors[1] },
        ],
      });
      text.set('fill', gradient);
    }

    fabricRef.current.renderAll();
    saveCanvasState();
  };

  // Apply mask to image
  const applyMask = (maskType: string) => {
    if (!fabricRef.current) return;
    const activeObject = fabricRef.current.getActiveObject();
    if (!activeObject || activeObject.type !== 'image') return;

    const img = activeObject as fabric.Image;
    const width = img.width || 200;
    const height = img.height || 200;

    let clipPath: fabric.Object | null = null;

    switch (maskType) {
      case 'circle':
        clipPath = new fabric.Circle({
          radius: Math.min(width, height) / 2,
          originX: 'center',
          originY: 'center',
          left: width / 2,
          top: height / 2,
        });
        break;
      case 'square':
        clipPath = new fabric.Rect({
          width: Math.min(width, height),
          height: Math.min(width, height),
          originX: 'center',
          originY: 'center',
          left: width / 2,
          top: height / 2,
        });
        break;
      case 'heart':
      case 'star':
        // For complex shapes, we'd use SVG paths
        clipPath = new fabric.Circle({
          radius: Math.min(width, height) / 2,
          originX: 'center',
          originY: 'center',
          left: width / 2,
          top: height / 2,
        });
        break;
    }

    if (clipPath) {
      img.set('clipPath', clipPath);
      fabricRef.current.renderAll();
      saveCanvasState();
    }
  };

  // Alignment tools
  const alignObjects = (type: string) => {
    if (!fabricRef.current) return;
    const activeObjects = fabricRef.current.getActiveObjects();
    if (activeObjects.length === 0) return;

    const canvas = fabricRef.current;
    const canvasWidth = canvas.width || 800;
    const canvasHeight = canvas.height || 800;

    activeObjects.forEach(obj => {
      switch (type) {
        case 'left':
          obj.set('left', 0);
          break;
        case 'center-h':
          obj.set('left', (canvasWidth - (obj.width || 0) * (obj.scaleX || 1)) / 2);
          break;
        case 'right':
          obj.set('left', canvasWidth - (obj.width || 0) * (obj.scaleX || 1));
          break;
        case 'top':
          obj.set('top', 0);
          break;
        case 'center-v':
          obj.set('top', (canvasHeight - (obj.height || 0) * (obj.scaleY || 1)) / 2);
          break;
        case 'bottom':
          obj.set('top', canvasHeight - (obj.height || 0) * (obj.scaleY || 1));
          break;
      }
      obj.setCoords();
    });

    canvas.renderAll();
    saveCanvasState();
  };

  // Distribute objects
  const distributeObjects = (direction: 'horizontal' | 'vertical') => {
    if (!fabricRef.current) return;
    const activeObjects = fabricRef.current.getActiveObjects();
    if (activeObjects.length < 3) return;

    const sorted = [...activeObjects].sort((a, b) => {
      if (direction === 'horizontal') {
        return (a.left || 0) - (b.left || 0);
      }
      return (a.top || 0) - (b.top || 0);
    });

    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    const totalSpace = direction === 'horizontal'
      ? (last.left || 0) - (first.left || 0)
      : (last.top || 0) - (first.top || 0);
    
    const spacing = totalSpace / (sorted.length - 1);

    sorted.forEach((obj, index) => {
      if (index === 0 || index === sorted.length - 1) return;
      
      if (direction === 'horizontal') {
        obj.set('left', (first.left || 0) + spacing * index);
      } else {
        obj.set('top', (first.top || 0) + spacing * index);
      }
      obj.setCoords();
    });

    fabricRef.current.renderAll();
    saveCanvasState();
  };

  // Layer management
  const toggleLayerVisibility = (layerId: string) => {
    if (!fabricRef.current) return;
    const obj = fabricRef.current.getObjects().find((o: any) => o.id === layerId);
    if (obj) {
      obj.set('visible', !obj.visible);
      fabricRef.current.renderAll();
      updateLayers();
    }
  };

  const toggleLayerLock = (layerId: string) => {
    if (!fabricRef.current) return;
    const obj = fabricRef.current.getObjects().find((o: any) => o.id === layerId);
    if (obj) {
      obj.set('selectable', !obj.selectable);
      obj.set('evented', obj.selectable);
      fabricRef.current.renderAll();
      updateLayers();
    }
  };

  const deleteLayer = (layerId: string) => {
    if (!fabricRef.current) return;
    const obj = fabricRef.current.getObjects().find((o: any) => o.id === layerId);
    if (obj) {
      fabricRef.current.remove(obj);
      saveCanvasState();
    }
  };

  const duplicateLayer = (layerId: string) => {
    if (!fabricRef.current) return;
    const obj = fabricRef.current.getObjects().find((o: any) => o.id === layerId);
    if (obj) {
      obj.clone((cloned: fabric.Object) => {
        cloned.set({
          left: (obj.left || 0) + 20,
          top: (obj.top || 0) + 20,
        });
        (cloned as any).id = `layer-${Date.now()}`;
        fabricRef.current?.add(cloned);
        saveCanvasState();
      });
    }
  };

  const reorderLayer = (layerId: string, direction: 'up' | 'down') => {
    if (!fabricRef.current) return;
    const obj = fabricRef.current.getObjects().find((o: any) => o.id === layerId);
    if (obj) {
      if (direction === 'up') {
        fabricRef.current.bringForward(obj);
      } else {
        fabricRef.current.sendBackwards(obj);
      }
      fabricRef.current.renderAll();
      updateLayers();
      saveCanvasState();
    }
  };

  const selectLayer = (layerId: string) => {
    if (!fabricRef.current) return;
    const obj = fabricRef.current.getObjects().find((o: any) => o.id === layerId);
    if (obj) {
      fabricRef.current.setActiveObject(obj);
      fabricRef.current.renderAll();
    }
  };

  // Set background
  const setBackground = (background: string) => {
    if (!fabricRef.current) return;
    fabricRef.current.setBackgroundColor(background, () => {
      fabricRef.current?.renderAll();
      saveCanvasState();
    });
  };

  // Add sticker
  const addSticker = (sticker: { type: string; icon: string; color: string }) => {
    if (!fabricRef.current) return;
    
    // For now, create a simple shape as sticker
    let shape: fabric.Object;
    
    if (sticker.icon === 'circle') {
      shape = new fabric.Circle({
        radius: 50,
        fill: sticker.color,
        left: 200,
        top: 200,
      });
    } else if (sticker.icon === 'heart') {
      // Simple heart shape using circle composition
      shape = new fabric.Circle({
        radius: 50,
        fill: sticker.color,
        left: 200,
        top: 200,
      });
    } else {
      shape = new fabric.Rect({
        width: 100,
        height: 100,
        fill: sticker.color,
        left: 200,
        top: 200,
      });
    }

    (shape as any).id = `sticker-${Date.now()}`;
    (shape as any).name = `Sticker ${sticker.icon}`;
    fabricRef.current.add(shape);
    fabricRef.current.setActiveObject(shape);
    fabricRef.current.renderAll();
    saveCanvasState();
  };

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    addPhoto: (url: string) => {
      if (!fabricRef.current) return;
      
      fabric.Image.fromURL(url, (img) => {
        const maxWidth = 400;
        const maxHeight = 400;
        const scale = Math.min(maxWidth / (img.width || 1), maxHeight / (img.height || 1));
        
        img.scale(scale);
        img.set({
          left: 200,
          top: 200,
        });
        
        (img as any).id = `image-${Date.now()}`;
        (img as any).name = 'Photo';
        
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
      
      (text as any).id = `text-${Date.now()}`;
      (text as any).name = 'Text';
      
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
        (shape as any).name = 'Rectangle';
      } else {
        shape = new fabric.Circle({
          left: 200,
          top: 200,
          radius: 100,
          fill: '#28BAAB',
          stroke: '#0376AD',
          strokeWidth: 2,
        });
        (shape as any).name = 'Circle';
      }
      
      (shape as any).id = `shape-${Date.now()}`;
      
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
    applyFilter: applyImageFilter,
    applyPresetFilter: applyPreset,
    applyTextEffects,
    applyMask,
    alignObjects,
    distributeObjects,
    toggleGrid: () => setGridEnabled(!gridEnabled),
    getLayers: () => layers,
    toggleLayerVisibility,
    toggleLayerLock,
    deleteLayer,
    duplicateLayer,
    reorderLayer,
    selectLayer,
    setBackground,
    addSticker,
  }));

  return (
    <div className="flex-1 bg-gray-100 overflow-auto p-8 flex items-center justify-center">
      <div className="bg-white shadow-2xl rounded-lg overflow-hidden" style={{ width: 800, height: 800 }}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
});

EditorCanvasEnhanced.displayName = 'EditorCanvasEnhanced';

export default EditorCanvasEnhanced;
