# Advanced Editor Features Documentation

## Overview

This document describes the advanced photo editor features built for Frametale, including photo filters, backgrounds, stickers, text effects, masking, alignment tools, and layer management.

## 🎨 Features Implemented

### 1. Photo Filters

**Component:** `FilterPanel.tsx`

**Features:**
- **Preset Filters:** 8 one-click filter presets
  - Normal, Vintage, Grayscale, Sepia, Cold, Warm, Dramatic, Soft
  
- **Manual Adjustments:**
  - Brightness (-100 to +100)
  - Contrast (-100 to +100)
  - Saturation (-100 to +100)
  - Blur (0 to 100)
  - Sepia (0 to 100)
  - Grayscale (0 to 100)
  - Hue Rotation (-180° to +180°)

**Usage:**
```tsx
<FilterPanel 
  onApplyFilter={(filters) => canvas.applyFilter(filters)}
  onPresetFilter={(preset) => canvas.applyPresetFilter(preset)}
/>
```

### 2. Background Library

**Component:** `BackgroundLibrary.tsx`

**Features:**
- **70+ Solid Colors:** Organized color palette
- **28+ Gradients:** Linear and radial gradients
- **8+ Patterns:** Stripes, dots, checkerboard patterns
- **Textures:** SVG-based texture patterns

**Categories:**
- Solid colors (grayscale + full color spectrum)
- Linear gradients (various color combinations)
- Radial gradients (circular color transitions)
- Geometric patterns (stripes, grids, dots)

**Usage:**
```tsx
<BackgroundLibrary 
  onBackgroundSelect={(bg) => canvas.setBackground(bg)}
/>
```

### 3. Stickers & Elements Library

**Component:** `StickersLibrary.tsx`

**Features:**
- **Basic Shapes:** Circle, Square, Triangle, Heart, Star
- **16+ Icons:** Smile, Heart, Star, Zap, Crown, Award, Gift, Music, Camera, MapPin, Coffee, Sun, Moon, Cloud, Umbrella, Flower
- **6+ Decorative Elements:** Starburst, Arrow, Ribbon, Badge, Banner, Frame
- **Color Customization:** 8 preset colors for each sticker

**Usage:**
```tsx
<StickersLibrary 
  onStickerSelect={(sticker) => canvas.addSticker(sticker)}
/>
```

### 4. Text Effects

**Component:** `TextEffectsPanel.tsx`

**Features:**
- **Shadow Effect:**
  - Blur control (0-20px)
  - Offset X/Y positioning
  - Custom color

- **Outline Effect:**
  - Width control (1-10px)
  - Custom color

- **Glow Effect:**
  - Blur intensity (0-30px)
  - Custom color

- **Gradient Fill:**
  - Linear or Radial type
  - 6 preset gradient combinations
  - Angle control (0-360°)
  - Custom color stops

**Usage:**
```tsx
<TextEffectsPanel 
  onEffectChange={(effects) => canvas.applyTextEffects(effects)}
/>
```

### 5. Photo Masking

**Component:** `MaskingPanel.tsx`

**Features:**
- **Shape Masks:** Circle, Square, Heart, Star, Hexagon, Octagon
- **Non-destructive:** Original image preserved
- **Easy application:** Select photo, choose mask shape

**Usage:**
```tsx
<MaskingPanel 
  onApplyMask={(maskType) => canvas.applyMask(maskType)}
/>
```

### 6. Alignment Tools

**Component:** `AlignmentPanel.tsx`

**Features:**
- **Align Objects:**
  - Left, Center Horizontal, Right
  - Top, Center Vertical, Bottom

- **Distribute Objects:**
  - Horizontal distribution
  - Vertical distribution

- **Snap to Grid:**
  - Toggle grid overlay
  - 20px grid spacing
  - Visual grid lines

**Usage:**
```tsx
<AlignmentPanel 
  onAlign={(type) => canvas.alignObjects(type)}
  onDistribute={(dir) => canvas.distributeObjects(dir)}
  onToggleGrid={() => canvas.toggleGrid()}
  gridEnabled={gridEnabled}
/>
```

### 7. Layer Management

**Component:** `LayerManagementPanel.tsx`

**Features:**
- **Layer List:** Visual hierarchy of all canvas objects
- **Layer Controls:**
  - Visibility toggle (Eye icon)
  - Lock/Unlock (Lock icon)
  - Delete layer
  - Duplicate layer
  - Reorder (Move up/down)
  
- **Layer Information:**
  - Layer name
  - Layer type (text, image, shape, sticker)
  - Z-index position

- **Bulk Actions:**
  - Toggle all visibility
  - Lock all layers

**Usage:**
```tsx
<LayerManagementPanel
  layers={layers}
  selectedLayerId={selectedLayerId}
  onLayerSelect={(id) => selectLayer(id)}
  onLayerVisibilityToggle={(id) => toggleVisibility(id)}
  onLayerLockToggle={(id) => toggleLock(id)}
  onLayerDelete={(id) => deleteLayer(id)}
  onLayerDuplicate={(id) => duplicateLayer(id)}
  onLayerReorder={(id, dir) => reorderLayer(id, dir)}
/>
```

## 🏗️ Architecture

### Component Structure

```
EditorWithAdvancedFeatures (Main Container)
├── EditorToolbar
├── LeftSidebarEnhanced
│   ├── PhotoUploadPanel
│   ├── FilterPanel
│   ├── BackgroundLibrary
│   ├── StickersLibrary
│   ├── TextEffectsPanel
│   ├── MaskingPanel
│   └── AlignmentPanel
├── EditorCanvasEnhanced (Fabric.js Canvas)
├── RightSidebarEnhanced
│   ├── Properties Panel
│   └── LayerManagementPanel
├── PageTimeline
└── KeyboardShortcuts
```

### Enhanced Canvas API

**EditorCanvasEnhanced** exposes these methods via ref:

```typescript
interface CanvasHandle {
  // Basic operations
  addPhoto: (url: string) => void;
  addText: () => void;
  addShape: (type: 'rectangle' | 'circle') => void;
  deleteSelected: () => void;
  getCanvas: () => fabric.Canvas | null;
  
  // Advanced features
  applyFilter: (filters: FilterSettings) => void;
  applyPresetFilter: (preset: string) => void;
  applyTextEffects: (effects: TextEffects) => void;
  applyMask: (maskType: string) => void;
  setBackground: (background: string) => void;
  addSticker: (sticker: StickerData) => void;
  
  // Alignment
  alignObjects: (type: string) => void;
  distributeObjects: (direction: 'horizontal' | 'vertical') => void;
  toggleGrid: () => void;
  
  // Layer management
  getLayers: () => Layer[];
  toggleLayerVisibility: (layerId: string) => void;
  toggleLayerLock: (layerId: string) => void;
  deleteLayer: (layerId: string) => void;
  duplicateLayer: (layerId: string) => void;
  reorderLayer: (layerId: string, direction: 'up' | 'down') => void;
  selectLayer: (layerId: string) => void;
}
```

## 🎯 Usage Examples

### Example 1: Complete Editor Integration

```tsx
import EditorWithAdvancedFeatures from '@/components/editor/EditorWithAdvancedFeatures';

function MyEditorPage() {
  return <EditorWithAdvancedFeatures />;
}
```

### Example 2: Custom Integration

```tsx
import { useRef } from 'react';
import EditorCanvasEnhanced, { CanvasHandle } from './EditorCanvasEnhanced';
import FilterPanel from './FilterPanel';

function CustomEditor() {
  const canvasRef = useRef<CanvasHandle>(null);
  
  return (
    <div>
      <FilterPanel 
        onApplyFilter={(filters) => canvasRef.current?.applyFilter(filters)}
        onPresetFilter={(preset) => canvasRef.current?.applyPresetFilter(preset)}
      />
      <EditorCanvasEnhanced ref={canvasRef} />
    </div>
  );
}
```

### Example 3: Programmatic Control

```tsx
// Apply vintage filter
canvasRef.current?.applyPresetFilter('vintage');

// Align objects to center
canvasRef.current?.alignObjects('center-h');

// Add text with effects
canvasRef.current?.addText();
canvasRef.current?.applyTextEffects({
  shadow: { enabled: true, blur: 5, offsetX: 2, offsetY: 2, color: '#000000' },
  outline: { enabled: false, width: 2, color: '#000000' },
  glow: { enabled: false, blur: 10, color: '#FFFFFF' },
  gradient: { enabled: false, type: 'linear', colors: [], angle: 0 },
});
```

## 🎨 UI/UX Features

### Tabbed Interface
- Left sidebar uses tabs for easy navigation between features
- Right sidebar toggles between Properties and Layers
- Clean, organized interface prevents clutter

### Visual Feedback
- Hover states on all interactive elements
- Active/selected states clearly indicated
- Preview thumbnails for filters, backgrounds, and stickers
- Real-time updates when adjusting sliders

### Responsive Design
- Panels are scrollable when content exceeds viewport
- Grid layouts adapt to available space
- Icons and labels provide clear visual hierarchy

### Color Coding
- Blue accents for primary actions
- Gray tones for neutral states
- Red for destructive actions (delete)
- Gradient backgrounds for creative elements

## 🔧 Technical Details

### Fabric.js Integration

All features integrate seamlessly with Fabric.js:

```typescript
// Filters use native Fabric.js filter system
img.filters.push(new fabric.Image.filters.Brightness({ brightness: 0.2 }));
img.applyFilters();

// Text effects use Fabric.js shadow and stroke
text.set('shadow', new fabric.Shadow({ blur: 5, color: '#000' }));
text.set('stroke', '#fff');

// Masking uses clipPath
img.set('clipPath', maskShape);
```

### State Management

- Canvas state syncs with Zustand store
- Layer list updates on object add/remove/modify
- All changes trigger `saveCanvasState()` for undo/redo support

### Performance Optimizations

- Lazy loading of filter previews
- Debounced slider updates
- Efficient canvas re-rendering
- Grid lines stored as non-selectable objects

## 📝 Future Enhancements

Potential additions:
1. **More filters:** Instagram-style presets, custom LUTs
2. **Advanced masking:** Custom path drawing, magic wand selection
3. **Sticker packs:** Themed collections, seasonal stickers
4. **Text presets:** Pre-styled text templates
5. **Smart alignment:** Magnetic guides, auto-spacing
6. **Layer effects:** Blend modes, layer styles
7. **History panel:** Visual undo/redo timeline
8. **Templates:** Pre-designed page layouts

## 🐛 Known Limitations

1. Complex masks (heart, star) currently use placeholder shapes
2. Grid snapping is visual only (not magnetic)
3. Text gradient rendering may vary across browsers
4. Layer thumbnails not yet implemented
5. Undo/redo integration pending

## 🚀 Getting Started

1. **Install dependencies:** Already included in project
2. **Import components:** Use from `@/components/editor/`
3. **Use pre-built editor:** Import `EditorWithAdvancedFeatures`
4. **Customize:** Override styles, add custom filters/stickers

## 📚 Component Reference

| Component | File | Purpose |
|-----------|------|---------|
| FilterPanel | `FilterPanel.tsx` | Photo filter controls |
| BackgroundLibrary | `BackgroundLibrary.tsx` | Background selection |
| StickersLibrary | `StickersLibrary.tsx` | Sticker/element picker |
| TextEffectsPanel | `TextEffectsPanel.tsx` | Text styling effects |
| MaskingPanel | `MaskingPanel.tsx` | Photo shape masking |
| AlignmentPanel | `AlignmentPanel.tsx` | Alignment & distribution |
| LayerManagementPanel | `LayerManagementPanel.tsx` | Layer hierarchy control |
| EditorCanvasEnhanced | `EditorCanvasEnhanced.tsx` | Main canvas with all features |
| LeftSidebarEnhanced | `LeftSidebarEnhanced.tsx` | Organized left panel |
| RightSidebarEnhanced | `RightSidebarEnhanced.tsx` | Properties & layers |
| EditorWithAdvancedFeatures | `EditorWithAdvancedFeatures.tsx` | Complete editor |

---

**Version:** 1.0.0  
**Last Updated:** 2026-02-15  
**Compatibility:** Fabric.js 5.x, React 18+, Next.js 14+
