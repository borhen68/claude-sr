# Editor Quick Start Guide

## Installation

All components are already in `/src/components/editor/`. No additional installation needed!

## Usage

### Option 1: Use the Complete Editor (Recommended)

```tsx
// In your page component
import EditorWithAdvancedFeatures from '@/components/editor/EditorWithAdvancedFeatures';

export default function EditorPage() {
  return <EditorWithAdvancedFeatures />;
}
```

That's it! You get all features out of the box.

### Option 2: Custom Integration

```tsx
import { useRef } from 'react';
import EditorCanvasEnhanced, { CanvasHandle } from '@/components/editor/EditorCanvasEnhanced';
import LeftSidebarEnhanced from '@/components/editor/LeftSidebarEnhanced';
import RightSidebarEnhanced from '@/components/editor/RightSidebarEnhanced';

export default function CustomEditor() {
  const canvasRef = useRef<CanvasHandle>(null);
  
  // Your custom handlers...
  
  return (
    <div className="flex">
      <LeftSidebarEnhanced {...handlers} />
      <EditorCanvasEnhanced ref={canvasRef} />
      <RightSidebarEnhanced {...handlers} />
    </div>
  );
}
```

## Feature Quick Reference

### Filters
- Select a photo
- Click "Filters" tab in left sidebar
- Choose preset or adjust manually

### Backgrounds
- Click "Backgrounds" tab
- Select from Solid, Gradient, or Pattern
- Click to apply to canvas

### Stickers
- Click "Stickers" tab
- Choose from Shapes, Icons, or Decorative
- Click to add to canvas

### Text Effects
- Add text to canvas
- Select the text
- Click "Text Effects" tab
- Enable Shadow, Outline, Glow, or Gradient

### Masking
- Select a photo on canvas
- Click "Masking" tab
- Choose shape to crop photo

### Alignment
- Select multiple objects (Shift+Click)
- Click "Alignment" tab
- Choose align or distribute option
- Toggle grid for visual reference

### Layers
- Click "Layers" tab in right sidebar
- See all objects
- Eye icon: show/hide
- Lock icon: lock/unlock
- Expand for more controls

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Delete selected | Delete/Backspace |
| Deselect | Esc |
| Duplicate | Ctrl/Cmd + D |
| Undo | Ctrl/Cmd + Z |
| Redo | Ctrl/Cmd + Shift + Z |

## Tips

1. **Multi-select:** Hold Shift and click objects
2. **Precise positioning:** Use Properties panel for exact values
3. **Quick filters:** Presets are fastest for common looks
4. **Layer order matters:** Use up/down arrows to reorder
5. **Lock backgrounds:** Lock layer to prevent accidental edits
6. **Grid snapping:** Enable grid for aligned layouts

## Component Files

```
src/components/editor/
├── EditorWithAdvancedFeatures.tsx  ← Use this for complete editor
├── EditorCanvasEnhanced.tsx        ← Enhanced canvas
├── LeftSidebarEnhanced.tsx         ← All tools in one sidebar
├── RightSidebarEnhanced.tsx        ← Properties + Layers
├── FilterPanel.tsx                 ← Photo filters
├── BackgroundLibrary.tsx           ← Backgrounds
├── StickersLibrary.tsx             ← Stickers
├── TextEffectsPanel.tsx            ← Text effects
├── MaskingPanel.tsx                ← Photo masking
├── AlignmentPanel.tsx              ← Alignment tools
└── LayerManagementPanel.tsx        ← Layer controls
```

## Troubleshooting

**Problem:** Filters not applying  
**Solution:** Make sure you've selected an image object first

**Problem:** Can't select object  
**Solution:** Check if layer is locked (lock icon in layers panel)

**Problem:** Text effects not visible  
**Solution:** Ensure text is selected and effects are enabled (checkboxes)

**Problem:** Alignment not working  
**Solution:** Select 2+ objects first (Shift+Click)

## Need More Help?

See `ADVANCED_EDITOR_FEATURES.md` for detailed documentation.
