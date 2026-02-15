"use client";
import { useRef, useState } from 'react';
import EditorCanvasEnhanced, { CanvasHandle } from './EditorCanvasEnhanced';
import LeftSidebarEnhanced from './LeftSidebarEnhanced';
import RightSidebarEnhanced from './RightSidebarEnhanced';
import EditorToolbar from './EditorToolbar';
import PageTimeline from './PageTimeline';
import KeyboardShortcuts from './KeyboardShortcuts';
import { FilterSettings } from './FilterPanel';
import { TextEffects } from './TextEffectsPanel';

export default function EditorWithAdvancedFeatures() {
  const canvasRef = useRef<CanvasHandle>(null);
  const [gridEnabled, setGridEnabled] = useState(false);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);

  const handlePhotoSelect = (url: string) => {
    canvasRef.current?.addPhoto(url);
  };

  const handleAddText = () => {
    canvasRef.current?.addText();
  };

  const handleAddShape = (shape: 'rectangle' | 'circle') => {
    canvasRef.current?.addShape(shape);
  };

  const handleApplyFilter = (filters: FilterSettings) => {
    canvasRef.current?.applyFilter(filters);
  };

  const handlePresetFilter = (preset: string) => {
    canvasRef.current?.applyPresetFilter(preset);
  };

  const handleBackgroundSelect = (background: string) => {
    canvasRef.current?.setBackground(background);
  };

  const handleStickerSelect = (sticker: { type: string; icon: string; color: string }) => {
    canvasRef.current?.addSticker(sticker);
  };

  const handleTextEffectsChange = (effects: TextEffects) => {
    canvasRef.current?.applyTextEffects(effects);
  };

  const handleApplyMask = (maskType: string) => {
    canvasRef.current?.applyMask(maskType);
  };

  const handleAlign = (type: string) => {
    canvasRef.current?.alignObjects(type);
  };

  const handleDistribute = (direction: 'horizontal' | 'vertical') => {
    canvasRef.current?.distributeObjects(direction);
  };

  const handleToggleGrid = () => {
    canvasRef.current?.toggleGrid();
    setGridEnabled(!gridEnabled);
  };

  const handleLayerSelect = (layerId: string) => {
    setSelectedLayerId(layerId);
    canvasRef.current?.selectLayer(layerId);
  };

  const handleLayerVisibilityToggle = (layerId: string) => {
    canvasRef.current?.toggleLayerVisibility(layerId);
  };

  const handleLayerLockToggle = (layerId: string) => {
    canvasRef.current?.toggleLayerLock(layerId);
  };

  const handleLayerDelete = (layerId: string) => {
    canvasRef.current?.deleteLayer(layerId);
  };

  const handleLayerDuplicate = (layerId: string) => {
    canvasRef.current?.duplicateLayer(layerId);
  };

  const handleLayerReorder = (layerId: string, direction: 'up' | 'down') => {
    canvasRef.current?.reorderLayer(layerId, direction);
  };

  const handleDeleteSelected = () => {
    canvasRef.current?.deleteSelected();
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Toolbar */}
      <EditorToolbar onDelete={handleDeleteSelected} />

      {/* Main Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <LeftSidebarEnhanced
          onPhotoSelect={handlePhotoSelect}
          onAddText={handleAddText}
          onAddShape={handleAddShape}
          onApplyFilter={handleApplyFilter}
          onPresetFilter={handlePresetFilter}
          onBackgroundSelect={handleBackgroundSelect}
          onStickerSelect={handleStickerSelect}
          onTextEffectsChange={handleTextEffectsChange}
          onApplyMask={handleApplyMask}
          onAlign={handleAlign}
          onDistribute={handleDistribute}
          onToggleGrid={handleToggleGrid}
          gridEnabled={gridEnabled}
        />

        {/* Canvas */}
        <EditorCanvasEnhanced ref={canvasRef} />

        {/* Right Sidebar */}
        <RightSidebarEnhanced
          layers={canvasRef.current?.getLayers() || []}
          selectedLayerId={selectedLayerId}
          onLayerSelect={handleLayerSelect}
          onLayerVisibilityToggle={handleLayerVisibilityToggle}
          onLayerLockToggle={handleLayerLockToggle}
          onLayerDelete={handleLayerDelete}
          onLayerDuplicate={handleLayerDuplicate}
          onLayerReorder={handleLayerReorder}
        />
      </div>

      {/* Page Timeline */}
      <PageTimeline />

      {/* Keyboard Shortcuts */}
      <KeyboardShortcuts onDelete={handleDeleteSelected} />
    </div>
  );
}
