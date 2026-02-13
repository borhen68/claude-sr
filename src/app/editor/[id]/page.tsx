"use client";
import { useState, useCallback, useRef, DragEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Layers, ZoomIn, ZoomOut, Eye, Download, Undo2, Redo2, Plus, Trash2,
  Type, Image, Palette, Settings, ChevronLeft, ChevronRight, GripVertical,
  Maximize2, Sun, Moon, LayoutGrid, BookOpen, PanelLeftClose,
  PanelLeft, Sparkles, Wand2, MousePointerClick, Move,
  Copy, Lock, Unlock, EyeOff, Minus, Square, Circle, Star,
  Heart, X, RotateCcw, Check, Bold, Italic, AlignLeft, AlignCenter, AlignRight, Pipette
} from "lucide-react";

type PageType = "hero" | "duo" | "grid" | "collage" | "quote" | "divider" | "mosaic" | "panoramic" | "journal";
type Tool = "select" | "move" | "text" | "crop";
type SidebarTab = "pages" | "photos" | "templates" | "text" | "shapes" | "settings";

interface PhotoSlot {
  slotId: string;
  photoId: string | null;
  filter: string;
  brightness: number;
  contrast: number;
  saturation: number;
}

interface BookPage {
  id: string;
  type: PageType;
  order: number;
  text?: string;
  textAlign?: "left" | "center" | "right";
  textBold?: boolean;
  textItalic?: boolean;
  locked: boolean;
  visible: boolean;
  background: string;
  opacity: number;
  slots: PhotoSlot[];
}

interface PhotoItem {
  id: string;
  color: string; // simulated photo with color
  name: string;
  emotion?: string;
}

const photoColors = ["#8B7355", "#6B8E6B", "#7B8BA3", "#A0826D", "#8E7BA0", "#6B9E9E", "#A08E6B", "#7B6B8E", "#9E6B6B", "#6B8E8B", "#A09B6B", "#8B6B7B", "#6BA08E", "#8E8B6B", "#6B7BA0", "#9E7B6B", "#7B9E6B", "#6B6BA0", "#A06B8E", "#8BA06B", "#6B9EA0", "#A07B6B", "#7BA06B", "#6B8EA0"];

const mockPhotos: PhotoItem[] = photoColors.map((c, i) => ({
  id: `photo-${i}`,
  color: c,
  name: `IMG_${1000 + i}.jpg`,
  emotion: ["joyful", "serene", "playful", "warm", "intimate"][i % 5],
}));

function createSlots(type: PageType): PhotoSlot[] {
  const counts: Record<PageType, number> = { hero: 1, duo: 2, grid: 6, collage: 5, mosaic: 4, panoramic: 1, quote: 0, divider: 0, journal: 1 };
  return Array.from({ length: counts[type] }, (_, i) => ({
    slotId: `slot-${i}`,
    photoId: null,
    filter: "none",
    brightness: 100,
    contrast: 100,
    saturation: 100,
  }));
}

const initialPages: BookPage[] = [
  { id: "cover", type: "hero", order: 0, text: "Summer in Tuscany", locked: false, visible: true, background: "#F5F0EB", opacity: 100, slots: createSlots("hero") },
  { id: "p1", type: "duo", order: 1, locked: false, visible: true, background: "#F5F0EB", opacity: 100, slots: createSlots("duo") },
  { id: "p2", type: "grid", order: 2, locked: false, visible: true, background: "#F5F0EB", opacity: 100, slots: createSlots("grid") },
  { id: "p3", type: "quote", order: 3, text: "Every moment tells a story worth preserving.", textAlign: "center", locked: false, visible: true, background: "#ffffff", opacity: 100, slots: [] },
  { id: "p4", type: "mosaic", order: 4, locked: false, visible: true, background: "#F5F0EB", opacity: 100, slots: createSlots("mosaic") },
  { id: "p5", type: "collage", order: 5, locked: false, visible: true, background: "#F5F0EB", opacity: 100, slots: createSlots("collage") },
  { id: "p6", type: "panoramic", order: 6, locked: false, visible: true, background: "#F5F0EB", opacity: 100, slots: createSlots("panoramic") },
  { id: "p7", type: "divider", order: 7, text: "Chapter Two", textAlign: "center", locked: false, visible: true, background: "#F5F0EB", opacity: 100, slots: [] },
  { id: "p8", type: "journal", order: 8, text: "The golden light of Tuscany painted every wall in warmth.", textAlign: "left", locked: false, visible: true, background: "#F5F0EB", opacity: 100, slots: createSlots("journal") },
  { id: "p9", type: "hero", order: 9, locked: false, visible: true, background: "#F5F0EB", opacity: 100, slots: createSlots("hero") },
  { id: "p10", type: "grid", order: 10, locked: false, visible: true, background: "#F5F0EB", opacity: 100, slots: createSlots("grid") },
  { id: "p11", type: "duo", order: 11, locked: false, visible: true, background: "#F5F0EB", opacity: 100, slots: createSlots("duo") },
  { id: "end", type: "divider", order: 12, text: "Fin", textAlign: "center", locked: false, visible: true, background: "#F5F0EB", opacity: 100, slots: [] },
];

const pageTypeConfig: Record<PageType, { label: string; icon: React.ReactNode; desc: string }> = {
  hero: { label: "Hero", icon: <Maximize2 className="w-4 h-4" />, desc: "Full-bleed single image" },
  duo: { label: "Duo", icon: <BookOpen className="w-4 h-4" />, desc: "Two images side by side" },
  grid: { label: "Grid", icon: <LayoutGrid className="w-4 h-4" />, desc: "Up to 6 images" },
  collage: { label: "Collage", icon: <Layers className="w-4 h-4" />, desc: "Asymmetric layout" },
  mosaic: { label: "Mosaic", icon: <Square className="w-4 h-4" />, desc: "Masonry arrangement" },
  panoramic: { label: "Panoramic", icon: <Minus className="w-4 h-4" />, desc: "Wide cinematic" },
  quote: { label: "Quote", icon: <Type className="w-4 h-4" />, desc: "Typography page" },
  divider: { label: "Divider", icon: <Minus className="w-4 h-4" />, desc: "Chapter break" },
  journal: { label: "Journal", icon: <Type className="w-4 h-4" />, desc: "Text + image" },
};

const filters = [
  { id: "none", label: "Original" },
  { id: "grayscale(100%)", label: "B&W" },
  { id: "sepia(80%)", label: "Sepia" },
  { id: "saturate(150%)", label: "Vivid" },
  { id: "contrast(120%) brightness(110%)", label: "Pop" },
  { id: "brightness(110%) saturate(80%)", label: "Soft" },
  { id: "hue-rotate(30deg) saturate(120%)", label: "Warm" },
  { id: "hue-rotate(-30deg) saturate(90%)", label: "Cool" },
];

const bgColors = ["#ffffff", "#F5F0EB", "#E8E3DE", "#2C2825", "#1a1a1a", "#f0e6d3", "#e6ece0", "#dde6ed", "#ede0e6", "#e8e5d0"];

// ── Photo Slot Component (droppable + clickable) ──
function PhotoSlotView({ slot, pageId, onDrop, onRemove, onFilterChange, className }: {
  slot: PhotoSlot;
  pageId: string;
  onDrop: (pageId: string, slotId: string, photoId: string) => void;
  onRemove: (pageId: string, slotId: string) => void;
  onFilterChange: (pageId: string, slotId: string, filter: string) => void;
  className?: string;
}) {
  const [dragOver, setDragOver] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const photo = slot.photoId ? mockPhotos.find(p => p.id === slot.photoId) : null;

  const handleDragOver = (e: DragEvent) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = () => setDragOver(false);
  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const photoId = e.dataTransfer.getData("photoId");
    if (photoId) onDrop(pageId, slot.slotId, photoId);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => photo && setShowMenu(!showMenu)}
      className={`relative overflow-hidden transition-all duration-200 cursor-pointer group ${className || ""} ${
        dragOver ? "ring-2 ring-blue-500 ring-inset scale-[0.98]" : ""
      }`}
    >
      {photo ? (
        <>
          <div
            className="w-full h-full flex items-center justify-center text-white/70 text-xs font-medium"
            style={{
              backgroundColor: photo.color,
              filter: slot.filter === "none" ? undefined : slot.filter,

            }}
          >
            <span className="drop-shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">{photo.name}</span>
          </div>
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <button onClick={(e) => { e.stopPropagation(); onRemove(pageId, slot.slotId); }} className="p-1.5 bg-white/90 rounded-lg shadow hover:bg-white"><X className="w-3 h-3" /></button>
            </div>
          </div>
          {/* Filter menu */}
          {showMenu && (
            <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm p-2 z-20" onClick={(e) => e.stopPropagation()}>
              <p className="text-[8px] text-[#8A8279] mb-1 uppercase tracking-wider">Filter</p>
              <div className="flex gap-1 flex-wrap">
                {filters.map(f => (
                  <button
                    key={f.id}
                    onClick={() => { onFilterChange(pageId, slot.slotId, f.id); setShowMenu(false); }}
                    className={`px-1.5 py-0.5 text-[8px] rounded ${slot.filter === f.id ? "bg-[#2C2825] text-white" : "bg-[#F5F0EB] hover:bg-[#E8E3DE]"}`}
                  >{f.label}</button>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className={`w-full h-full flex flex-col items-center justify-center gap-1 transition-colors ${
          dragOver ? "bg-blue-50" : "bg-gradient-to-br from-[#E8E3DE] to-[#D4CEC7]"
        }`}>
          <Plus className={`w-5 h-5 ${dragOver ? "text-blue-500" : "text-[#8A8279] opacity-40"}`} />
          <span className={`text-[8px] ${dragOver ? "text-blue-500" : "text-[#8A8279] opacity-40"}`}>Drop photo</span>
        </div>
      )}
    </div>
  );
}

// ── Page Canvas (interactive) ──
function PageCanvas({ page, onDropPhoto, onRemovePhoto, onFilterChange, onTextChange, isSelected }: {
  page: BookPage;
  onDropPhoto: (pageId: string, slotId: string, photoId: string) => void;
  onRemovePhoto: (pageId: string, slotId: string) => void;
  onFilterChange: (pageId: string, slotId: string, filter: string) => void;
  onTextChange: (pageId: string, text: string) => void;
  isSelected: boolean;
}) {
  const [editing, setEditing] = useState(false);

  const slotProps = (slot: PhotoSlot, cls?: string) => ({
    slot, pageId: page.id, onDrop: onDropPhoto, onRemove: onRemovePhoto, onFilterChange, className: cls,
  });

  const editableText = (
    <div className="relative group/text" onDoubleClick={() => setEditing(true)}>
      {editing ? (
        <textarea
          autoFocus
          value={page.text || ""}
          onChange={(e) => onTextChange(page.id, e.target.value)}
          onBlur={() => setEditing(false)}
          onKeyDown={(e) => { if (e.key === "Escape") setEditing(false); }}
          className={`w-full bg-transparent resize-none focus:outline-none focus:ring-1 focus:ring-blue-400 rounded p-1 font-serif italic text-center ${
            page.type === "quote" ? "text-xl leading-relaxed text-[#2C2825]" :
            page.type === "divider" ? "text-sm uppercase tracking-[0.3em] text-[#8A8279]" :
            page.type === "journal" ? "text-sm leading-relaxed text-[#2C2825] text-left not-italic" :
            "text-2xl text-white drop-shadow-lg text-left not-italic"
          }`}
          style={{ textAlign: page.textAlign || "center" }}
          rows={page.type === "journal" ? 4 : 2}
        />
      ) : (
        <p className={`cursor-text rounded p-1 transition-colors group-hover/text:bg-black/5 ${
          page.type === "quote" ? "font-serif italic text-xl leading-relaxed text-[#2C2825]" :
          page.type === "divider" ? "text-sm uppercase tracking-[0.3em] text-[#8A8279]" :
          page.type === "journal" ? "text-sm leading-relaxed text-[#2C2825] font-serif italic" :
          "text-2xl font-serif text-white drop-shadow-lg"
        }`} style={{ textAlign: page.textAlign || "center" }}>
          {page.text || <span className="opacity-30">Double-click to edit</span>}
        </p>
      )}
    </div>
  );

  const renderLayout = () => {
    switch (page.type) {
      case "hero":
        return (
          <div className="w-full h-full relative">
            <PhotoSlotView {...slotProps(page.slots[0], "w-full h-full")} />
            <div className="absolute bottom-6 left-6 right-6 z-10">{editableText}</div>
          </div>
        );
      case "duo":
        return (
          <div className="w-full h-full grid grid-cols-2 gap-3 p-4">
            {page.slots.map(s => <PhotoSlotView key={s.slotId} {...slotProps(s, "rounded-xl")} />)}
          </div>
        );
      case "grid":
        return (
          <div className="w-full h-full grid grid-cols-3 grid-rows-2 gap-2 p-4">
            {page.slots.map(s => <PhotoSlotView key={s.slotId} {...slotProps(s, "rounded-lg")} />)}
          </div>
        );
      case "collage":
        return (
          <div className="w-full h-full p-4 grid grid-cols-4 grid-rows-3 gap-2">
            <PhotoSlotView {...slotProps(page.slots[0], "col-span-2 row-span-2 rounded-xl")} />
            <PhotoSlotView {...slotProps(page.slots[1], "col-span-2 rounded-xl")} />
            <PhotoSlotView {...slotProps(page.slots[2], "rounded-xl")} />
            <PhotoSlotView {...slotProps(page.slots[3], "rounded-xl")} />
            {page.slots[4] && <PhotoSlotView {...slotProps(page.slots[4], "col-span-2 rounded-xl")} />}
          </div>
        );
      case "mosaic":
        return (
          <div className="w-full h-full p-4 grid grid-cols-3 grid-rows-3 gap-2">
            <PhotoSlotView {...slotProps(page.slots[0], "row-span-2 rounded-xl")} />
            <PhotoSlotView {...slotProps(page.slots[1], "col-span-2 rounded-xl")} />
            <PhotoSlotView {...slotProps(page.slots[2], "rounded-xl")} />
            <PhotoSlotView {...slotProps(page.slots[3], "rounded-xl")} />
          </div>
        );
      case "panoramic":
        return (
          <div className="w-full h-full flex items-center p-6">
            <PhotoSlotView {...slotProps(page.slots[0], "w-full h-2/3 rounded-2xl")} />
          </div>
        );
      case "quote":
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-10 relative" style={{ backgroundColor: page.background }}>
            <div className="absolute top-6 left-8 text-6xl font-serif text-[#E8E3DE] leading-none select-none">&ldquo;</div>
            <div className="max-w-md z-10 w-full">{editableText}</div>
            <div className="absolute bottom-6 right-8 text-6xl font-serif text-[#E8E3DE] leading-none rotate-180 select-none">&ldquo;</div>
            <div className="mt-6 w-12 h-px bg-[#D4CEC7]" />
          </div>
        );
      case "divider":
        return (
          <div className="w-full h-full flex flex-col items-center justify-center gap-4" style={{ backgroundColor: page.background }}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-px bg-[#D4CEC7]" />
              <Star className="w-4 h-4 text-[#D4CEC7]" />
              <div className="w-12 h-px bg-[#D4CEC7]" />
            </div>
            {editableText}
            <div className="flex items-center gap-4">
              <div className="w-12 h-px bg-[#D4CEC7]" />
              <Star className="w-4 h-4 text-[#D4CEC7]" />
              <div className="w-12 h-px bg-[#D4CEC7]" />
            </div>
          </div>
        );
      case "journal":
        return (
          <div className="w-full h-full flex gap-4 p-5">
            <PhotoSlotView {...slotProps(page.slots[0], "w-1/2 rounded-xl")} />
            <div className="w-1/2 flex flex-col justify-center gap-3 pr-2">
              <div className="text-xs uppercase tracking-[0.2em] text-[#8A8279]">June 15, 2024</div>
              {editableText}
              <div className="w-8 h-px bg-[#D4CEC7] mt-2" />
            </div>
          </div>
        );
    }
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-lg border-2 overflow-hidden transition-all ${
        isSelected ? "border-blue-500 shadow-blue-500/20 shadow-xl" : "border-[#E8E3DE]"
      }`}
      style={{ opacity: page.opacity / 100 }}
    >
      <div className="aspect-[4/3]">{renderLayout()}</div>
    </div>
  );
}

// ── Main Editor ──
export default function Editor() {
  const [pages, setPages] = useState<BookPage[]>(initialPages);
  const [selectedPage, setSelectedPage] = useState<string>("cover");
  const [zoom, setZoom] = useState(85);
  const [view, setView] = useState<"spread" | "single" | "filmstrip">("spread");
  const [activeTool, setActiveTool] = useState<Tool>("select");
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>("photos");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [darkCanvas, setDarkCanvas] = useState(false);
  const [history, setHistory] = useState<BookPage[][]>([initialPages]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const selected = pages.find((p) => p.id === selectedPage);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2000); };

  const pushHistory = useCallback((newPages: BookPage[]) => {
    setHistory(prev => {
      const trimmed = prev.slice(0, historyIndex + 1);
      return [...trimmed, newPages];
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  const undo = () => { if (historyIndex > 0) { setHistoryIndex(historyIndex - 1); setPages(history[historyIndex - 1]); showToast("Undone"); } };
  const redo = () => { if (historyIndex < history.length - 1) { setHistoryIndex(historyIndex + 1); setPages(history[historyIndex + 1]); showToast("Redone"); } };

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) return;
    if ((e.metaKey || e.ctrlKey) && e.key === "z") { e.preventDefault(); if (e.shiftKey) redo(); else undo(); }
    if ((e.metaKey || e.ctrlKey) && e.key === "d" && selected) { e.preventDefault(); duplicatePage(selected.id); }
    if (e.key === "Delete" || e.key === "Backspace") { if (selected && !selected.locked) deletePage(selected.id); }
    if (e.key === "ArrowRight") { const idx = pages.findIndex(p => p.id === selectedPage); if (idx < pages.length - 1) setSelectedPage(pages[idx + 1].id); }
    if (e.key === "ArrowLeft") { const idx = pages.findIndex(p => p.id === selectedPage); if (idx > 0) setSelectedPage(pages[idx - 1].id); }
    if (e.key === "+" || e.key === "=") setZoom(z => Math.min(200, z + 10));
    if (e.key === "-") setZoom(z => Math.max(25, z - 10));
  }, [pages, selectedPage, selected, historyIndex, history]);

  // Register keyboard shortcuts
  useState(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("keydown", handleKeyDown as any);
      return () => window.removeEventListener("keydown", handleKeyDown as any);
    }
  });

  const dropPhotoOnSlot = (pageId: string, slotId: string, photoId: string) => {
    const newPages = pages.map(p => p.id === pageId ? { ...p, slots: p.slots.map(s => s.slotId === slotId ? { ...s, photoId } : s) } : p);
    setPages(newPages);
    pushHistory(newPages);
    showToast("Photo placed!");
  };

  const removePhotoFromSlot = (pageId: string, slotId: string) => {
    const newPages = pages.map(p => p.id === pageId ? { ...p, slots: p.slots.map(s => s.slotId === slotId ? { ...s, photoId: null, filter: "none" } : s) } : p);
    setPages(newPages);
    pushHistory(newPages);
    showToast("Photo removed");
  };

  const changeSlotFilter = (pageId: string, slotId: string, filter: string) => {
    const newPages = pages.map(p => p.id === pageId ? { ...p, slots: p.slots.map(s => s.slotId === slotId ? { ...s, filter } : s) } : p);
    setPages(newPages);
    pushHistory(newPages);
  };

  const updatePageText = (pageId: string, text: string) => {
    setPages(pages.map(p => p.id === pageId ? { ...p, text } : p));
  };

  const updatePageProp = (key: string, value: any) => {
    if (!selected) return;
    const newPages = pages.map(p => p.id === selected.id ? { ...p, [key]: value } : p);
    setPages(newPages);
    pushHistory(newPages);
  };

  const addPage = (type: PageType) => {
    const newPage: BookPage = { id: `new-${Date.now()}`, type, order: pages.length, locked: false, visible: true, background: "#F5F0EB", opacity: 100, slots: createSlots(type) };
    const newPages = [...pages, newPage];
    setPages(newPages);
    pushHistory(newPages);
    setSelectedPage(newPage.id);
    showToast(`${pageTypeConfig[type].label} page added`);
  };

  const deletePage = (id: string) => {
    if (pages.length <= 1) return;
    const newPages = pages.filter(p => p.id !== id).map((p, i) => ({ ...p, order: i }));
    setPages(newPages);
    pushHistory(newPages);
    if (selectedPage === id) setSelectedPage(newPages[0].id);
    showToast("Page deleted");
  };

  const duplicatePage = (id: string) => {
    const page = pages.find(p => p.id === id);
    if (!page) return;
    const idx = pages.findIndex(p => p.id === id);
    const newPage = { ...page, id: `dup-${Date.now()}`, order: idx + 1, slots: page.slots.map(s => ({ ...s, slotId: `slot-${Date.now()}-${Math.random().toString(36).slice(2)}` })) };
    const newPages = [...pages.slice(0, idx + 1), newPage, ...pages.slice(idx + 1)].map((p, i) => ({ ...p, order: i }));
    setPages(newPages);
    pushHistory(newPages);
    showToast("Page duplicated");
  };

  const autoFillPage = (pageId: string) => {
    const page = pages.find(p => p.id === pageId);
    if (!page) return;
    const usedPhotos = new Set(pages.flatMap(p => p.slots.filter(s => s.photoId).map(s => s.photoId)));
    const available = mockPhotos.filter(p => !usedPhotos.has(p.id));
    const newSlots = page.slots.map((s, i) => s.photoId ? s : { ...s, photoId: available[i]?.id || null });
    const newPages = pages.map(p => p.id === pageId ? { ...p, slots: newSlots } : p);
    setPages(newPages);
    pushHistory(newPages);
    showToast("Auto-filled with AI! ✨");
  };

  const changePageType = (newType: PageType) => {
    if (!selected || selected.locked) return;
    const newSlots = createSlots(newType);
    // Preserve existing photos
    selected.slots.forEach((s, i) => { if (s.photoId && newSlots[i]) newSlots[i].photoId = s.photoId; });
    const newPages = pages.map(p => p.id === selected.id ? { ...p, type: newType, slots: newSlots } : p);
    setPages(newPages);
    pushHistory(newPages);
    showToast(`Changed to ${pageTypeConfig[newType].label}`);
  };

  const sidebarTabs: { tab: SidebarTab; icon: React.ReactNode; label: string }[] = [
    { tab: "pages", icon: <Layers className="w-4 h-4" />, label: "Pages" },
    { tab: "photos", icon: <Image className="w-4 h-4" />, label: "Photos" },
    { tab: "templates", icon: <LayoutGrid className="w-4 h-4" />, label: "Layouts" },
    { tab: "text", icon: <Type className="w-4 h-4" />, label: "Text" },
    { tab: "shapes", icon: <Circle className="w-4 h-4" />, label: "Shapes" },
    { tab: "settings", icon: <Settings className="w-4 h-4" />, label: "Settings" },
  ];

  const filledPhotos = pages.reduce((sum, p) => sum + p.slots.filter(s => s.photoId).length, 0);
  const totalSlots = pages.reduce((sum, p) => sum + p.slots.length, 0);

  return (
    <div className={`h-screen flex flex-col overflow-hidden ${darkCanvas ? "bg-[#1a1a1a]" : "bg-[#E8E3DE]"}`}>
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed top-16 left-1/2 -translate-x-1/2 z-[100] bg-[#2C2825] text-white px-4 py-2 rounded-xl shadow-lg text-sm">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Toolbar */}
      <div className="h-12 bg-white border-b border-[#E8E3DE] flex items-center justify-between px-3 flex-shrink-0 z-50">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-[#8A8279] hover:text-[#2C2825]"><ChevronLeft className="w-5 h-5" /></Link>
          <div className="h-6 w-px bg-[#E8E3DE]" />
          <h2 className="font-serif text-base">Summer in Tuscany</h2>
          <span className="text-[10px] text-[#8A8279] bg-[#F5F0EB] px-2 py-0.5 rounded-full">{pages.length} pages</span>
          <span className="text-[10px] text-[#8A8279]">{filledPhotos}/{totalSlots} photos placed</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={undo} disabled={historyIndex === 0} className="p-1.5 text-[#8A8279] hover:text-[#2C2825] disabled:opacity-30" title="Undo (Ctrl+Z)"><Undo2 className="w-4 h-4" /></button>
          <button onClick={redo} disabled={historyIndex >= history.length - 1} className="p-1.5 text-[#8A8279] hover:text-[#2C2825] disabled:opacity-30" title="Redo (Ctrl+Shift+Z)"><Redo2 className="w-4 h-4" /></button>
          <div className="h-6 w-px bg-[#E8E3DE] mx-1" />
          <div className="flex items-center bg-[#F5F0EB] rounded-lg px-2 py-1 gap-2">
            <button onClick={() => setZoom(Math.max(25, zoom - 10))} className="text-[#8A8279] hover:text-[#2C2825]"><ZoomOut className="w-3.5 h-3.5" /></button>
            <span className="text-[11px] text-[#8A8279] w-8 text-center font-mono">{zoom}%</span>
            <button onClick={() => setZoom(Math.min(200, zoom + 10))} className="text-[#8A8279] hover:text-[#2C2825]"><ZoomIn className="w-3.5 h-3.5" /></button>
          </div>
          <div className="flex bg-[#F5F0EB] rounded-lg overflow-hidden ml-1">
            {(["spread", "single", "filmstrip"] as const).map(v => (
              <button key={v} onClick={() => setView(v)} className={`px-2.5 py-1 text-[10px] capitalize ${view === v ? "bg-[#2C2825] text-white" : "text-[#8A8279]"}`}>{v}</button>
            ))}
          </div>
          <div className="h-6 w-px bg-[#E8E3DE] mx-1" />
          <button onClick={() => setDarkCanvas(!darkCanvas)} className="p-1.5 text-[#8A8279] hover:text-[#2C2825]" title="Dark canvas">
            {darkCanvas ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <Link href="/preview/new" className="px-3 py-1.5 text-[11px] text-[#8A8279] hover:text-[#2C2825] border border-[#E8E3DE] rounded-lg flex items-center gap-1.5 ml-1">
            <Eye className="w-3.5 h-3.5" /> Preview
          </Link>
          <button className="px-3 py-1.5 text-[11px] bg-[#2C2825] text-white rounded-lg hover:bg-[#3d3a36] flex items-center gap-1.5 ml-1">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Tab Bar */}
        <div className="w-10 bg-white border-r border-[#E8E3DE] flex flex-col items-center py-2 gap-1 flex-shrink-0">
          {sidebarTabs.map(t => (
            <button key={t.tab} onClick={() => { setSidebarTab(t.tab); setSidebarOpen(true); }}
              className={`p-2 rounded-lg transition-all ${sidebarTab === t.tab && sidebarOpen ? "bg-[#2C2825] text-white" : "text-[#8A8279] hover:bg-[#F5F0EB]"}`}
              title={t.label}>{t.icon}</button>
          ))}
          <div className="flex-1" />
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-[#8A8279] hover:text-[#2C2825]">
            {sidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Left Sidebar Content */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 260, opacity: 1 }} exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.15 }}
              className="bg-white border-r border-[#E8E3DE] overflow-hidden flex-shrink-0">
              <div className="w-[260px] h-full overflow-y-auto">
                <div className="p-3 border-b border-[#E8E3DE]">
                  <h3 className="text-xs uppercase tracking-wider text-[#8A8279] font-medium">{sidebarTabs.find(t => t.tab === sidebarTab)?.label}</h3>
                </div>

                {/* Pages tab */}
                {sidebarTab === "pages" && (
                  <div className="p-3 space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      {pages.map(page => (
                        <div key={page.id} onClick={() => setSelectedPage(page.id)}
                          className={`relative cursor-pointer rounded-lg overflow-hidden transition-all ${selectedPage === page.id ? "ring-2 ring-blue-500 shadow-md" : "hover:ring-1 hover:ring-[#8A8279]"} ${!page.visible ? "opacity-40" : ""}`}>
                          <div className="aspect-[4/3] bg-[#F5F0EB] flex items-center justify-center">
                            <span className="text-[8px] text-[#8A8279]">{pageTypeConfig[page.type].label}</span>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-black/40 px-1 py-0.5">
                            <span className="text-[8px] text-white">{page.order + 1}</span>
                          </div>
                          {page.locked && <Lock className="absolute top-0.5 right-0.5 w-2.5 h-2.5 text-white drop-shadow" />}
                          {page.slots.some(s => s.photoId) && <div className="absolute top-0.5 left-0.5 w-2 h-2 bg-green-400 rounded-full" />}
                        </div>
                      ))}
                    </div>
                    <div className="pt-2 border-t border-[#E8E3DE]">
                      <p className="text-[10px] text-[#8A8279] mb-2">Add Page</p>
                      <div className="grid grid-cols-3 gap-1.5">
                        {(Object.keys(pageTypeConfig) as PageType[]).map(type => (
                          <button key={type} onClick={() => addPage(type)} className="p-1.5 rounded-lg border border-[#E8E3DE] hover:border-[#2C2825] text-center transition-colors group">
                            <div className="text-[#8A8279] group-hover:text-[#2C2825] flex justify-center mb-0.5">{pageTypeConfig[type].icon}</div>
                            <span className="text-[8px] text-[#8A8279]">{pageTypeConfig[type].label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Photos tab - DRAGGABLE */}
                {sidebarTab === "photos" && (
                  <div className="p-3">
                    <div className="mb-3 p-3 border-2 border-dashed border-[#D4CEC7] rounded-xl text-center hover:border-[#8A8279] cursor-pointer">
                      <Plus className="w-5 h-5 text-[#8A8279] mx-auto mb-1" />
                      <span className="text-[10px] text-[#8A8279]">Upload Photos</span>
                    </div>
                    <p className="text-[10px] text-[#8A8279] mb-2">Drag photos onto page slots 👇</p>
                    <div className="grid grid-cols-3 gap-1.5">
                      {mockPhotos.map(photo => {
                        const used = pages.some(p => p.slots.some(s => s.photoId === photo.id));
                        return (
                          <div
                            key={photo.id}
                            draggable
                            onDragStart={(e) => { e.dataTransfer.setData("photoId", photo.id); e.dataTransfer.effectAllowed = "copy"; }}
                            className={`aspect-square rounded-lg cursor-grab active:cursor-grabbing hover:ring-2 hover:ring-[#2C2825] transition-all relative group ${used ? "opacity-50 ring-1 ring-green-400" : ""}`}
                            style={{ backgroundColor: photo.color }}
                          >
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <GripVertical className="w-4 h-4 text-white drop-shadow" />
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 bg-black/40 px-1 py-0.5 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="text-[7px] text-white">{photo.name}</span>
                            </div>
                            {used && <Check className="absolute top-0.5 right-0.5 w-3 h-3 text-green-400 drop-shadow" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Templates/Layouts tab */}
                {sidebarTab === "templates" && (
                  <div className="p-3 space-y-2">
                    <p className="text-[10px] text-[#8A8279] mb-1">Change layout for selected page</p>
                    {(Object.keys(pageTypeConfig) as PageType[]).map(type => (
                      <button key={type} onClick={() => changePageType(type)}
                        className={`w-full flex items-center gap-3 p-2.5 rounded-xl border transition-colors text-left ${
                          selected?.type === type ? "border-[#2C2825] bg-[#F5F0EB]" : "border-[#E8E3DE] hover:border-[#2C2825]"
                        }`}>
                        <div className="w-12 h-9 bg-[#F5F0EB] rounded-lg flex items-center justify-center text-[#8A8279]">{pageTypeConfig[type].icon}</div>
                        <div>
                          <p className="text-xs font-medium">{pageTypeConfig[type].label}</p>
                          <p className="text-[10px] text-[#8A8279]">{pageTypeConfig[type].desc}</p>
                        </div>
                        {selected?.type === type && <Check className="w-4 h-4 text-[#2C2825] ml-auto" />}
                      </button>
                    ))}
                  </div>
                )}

                {/* Text tab */}
                {sidebarTab === "text" && (
                  <div className="p-3 space-y-3">
                    <p className="text-[10px] text-[#8A8279]">Double-click text on pages to edit inline</p>
                    {selected && (selected.type === "quote" || selected.type === "divider" || selected.type === "journal" || selected.type === "hero") && (
                      <>
                        <textarea value={selected.text || ""} onChange={e => updatePageText(selected.id, e.target.value)}
                          className="w-full p-3 text-sm border border-[#E8E3DE] rounded-xl focus:outline-none focus:border-[#2C2825] resize-none font-serif" rows={4} placeholder="Enter text..." />
                        <div className="flex items-center gap-1">
                          <button onClick={() => updatePageProp("textBold", !selected.textBold)} className={`p-2 rounded-lg ${selected.textBold ? "bg-[#2C2825] text-white" : "border border-[#E8E3DE] hover:border-[#2C2825]"}`}><Bold className="w-3.5 h-3.5" /></button>
                          <button onClick={() => updatePageProp("textItalic", !selected.textItalic)} className={`p-2 rounded-lg ${selected.textItalic ? "bg-[#2C2825] text-white" : "border border-[#E8E3DE] hover:border-[#2C2825]"}`}><Italic className="w-3.5 h-3.5" /></button>
                          <div className="w-px h-6 bg-[#E8E3DE] mx-1" />
                          {(["left", "center", "right"] as const).map(a => (
                            <button key={a} onClick={() => updatePageProp("textAlign", a)}
                              className={`p-2 rounded-lg ${selected.textAlign === a ? "bg-[#2C2825] text-white" : "border border-[#E8E3DE] hover:border-[#2C2825]"}`}>
                              {a === "left" ? <AlignLeft className="w-3.5 h-3.5" /> : a === "center" ? <AlignCenter className="w-3.5 h-3.5" /> : <AlignRight className="w-3.5 h-3.5" />}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Settings tab */}
                {sidebarTab === "settings" && (
                  <div className="p-3 space-y-4">
                    <div>
                      <p className="text-[10px] text-[#8A8279] mb-2 uppercase tracking-wider">Book Info</p>
                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between"><span>Size</span><span className="text-[#8A8279]">8.5 × 11 in</span></div>
                        <div className="flex justify-between"><span>Pages</span><span className="text-[#8A8279]">{pages.length}</span></div>
                        <div className="flex justify-between"><span>Photos placed</span><span className="text-[#8A8279]">{filledPhotos} / {totalSlots}</span></div>
                        <div className="flex justify-between"><span>Paper</span><span className="text-[#8A8279]">170gsm Silk</span></div>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#8A8279] mb-2 uppercase tracking-wider">Page Background</p>
                      <div className="flex gap-1.5 flex-wrap">
                        {bgColors.map(c => (
                          <button key={c} onClick={() => selected && updatePageProp("background", c)}
                            className={`w-7 h-7 rounded-lg border-2 transition-transform hover:scale-110 ${selected?.background === c ? "border-blue-500 scale-110" : "border-white shadow-sm"}`}
                            style={{ backgroundColor: c }} />
                        ))}
                      </div>
                    </div>
                    <button onClick={() => selected && autoFillPage(selected.id)} className="w-full flex items-center gap-2 p-3 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 text-purple-700 text-xs hover:shadow-md transition-all">
                      <Wand2 className="w-4 h-4" />
                      <div className="text-left"><p className="font-medium">AI Auto-Fill Page</p><p className="text-[10px] text-purple-500">Fill empty slots with best photos</p></div>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Canvas */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="max-w-5xl mx-auto" style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}>
              {view === "spread" && (
                <div className="space-y-8">
                  {Array.from({ length: Math.ceil(pages.length / 2) }).map((_, i) => {
                    const left = pages[i * 2];
                    const right = pages[i * 2 + 1];
                    return (
                      <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                        className={`grid ${right ? "grid-cols-2" : "grid-cols-1 max-w-[50%]"} gap-1 ${darkCanvas ? "bg-[#333]" : "bg-[#D4CEC7]"} p-1 rounded-2xl shadow-xl`}>
                        {left && <div onClick={() => setSelectedPage(left.id)} className="cursor-pointer rounded-l-xl overflow-hidden">
                          <PageCanvas page={left} onDropPhoto={dropPhotoOnSlot} onRemovePhoto={removePhotoFromSlot} onFilterChange={changeSlotFilter} onTextChange={updatePageText} isSelected={selectedPage === left.id} />
                        </div>}
                        {right && <div onClick={() => setSelectedPage(right.id)} className="cursor-pointer rounded-r-xl overflow-hidden">
                          <PageCanvas page={right} onDropPhoto={dropPhotoOnSlot} onRemovePhoto={removePhotoFromSlot} onFilterChange={changeSlotFilter} onTextChange={updatePageText} isSelected={selectedPage === right.id} />
                        </div>}
                      </motion.div>
                    );
                  })}
                </div>
              )}
              {view === "single" && selected && (
                <motion.div key={selected.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto">
                  <PageCanvas page={selected} onDropPhoto={dropPhotoOnSlot} onRemovePhoto={removePhotoFromSlot} onFilterChange={changeSlotFilter} onTextChange={updatePageText} isSelected={true} />
                  <div className="flex justify-center gap-3 mt-6">
                    <button onClick={() => { const idx = pages.findIndex(p => p.id === selectedPage); if (idx > 0) setSelectedPage(pages[idx - 1].id); }} className="p-2 rounded-full bg-white shadow hover:shadow-md"><ChevronLeft className="w-5 h-5" /></button>
                    <span className={`self-center text-sm ${darkCanvas ? "text-gray-400" : "text-[#8A8279]"}`}>Page {selected.order + 1} of {pages.length}</span>
                    <button onClick={() => { const idx = pages.findIndex(p => p.id === selectedPage); if (idx < pages.length - 1) setSelectedPage(pages[idx + 1].id); }} className="p-2 rounded-full bg-white shadow hover:shadow-md"><ChevronRight className="w-5 h-5" /></button>
                  </div>
                </motion.div>
              )}
              {view === "filmstrip" && (
                <div className="flex gap-6 overflow-x-auto pb-4">
                  {pages.map(page => (
                    <motion.div key={page.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setSelectedPage(page.id)} className={`flex-shrink-0 w-80 cursor-pointer ${selectedPage === page.id ? "ring-2 ring-blue-500 ring-offset-4 rounded-xl" : ""}`}>
                      <PageCanvas page={page} onDropPhoto={dropPhotoOnSlot} onRemovePhoto={removePhotoFromSlot} onFilterChange={changeSlotFilter} onTextChange={updatePageText} isSelected={selectedPage === page.id} />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <AnimatePresence>
          {rightPanelOpen && selected && (
            <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 240, opacity: 1 }} exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.15 }}
              className="bg-white border-l border-[#E8E3DE] overflow-hidden flex-shrink-0">
              <div className="w-[240px] h-full overflow-y-auto">
                <div className="p-3 border-b border-[#E8E3DE] flex items-center justify-between">
                  <h3 className="text-xs uppercase tracking-wider text-[#8A8279]">Properties</h3>
                  <button onClick={() => setRightPanelOpen(false)} className="text-[#8A8279]"><X className="w-4 h-4" /></button>
                </div>
                <div className="p-3 space-y-4">
                  <div className="flex items-center gap-2">
                    {pageTypeConfig[selected.type].icon}
                    <span className="text-sm font-medium">{pageTypeConfig[selected.type].label}</span>
                    <span className="text-[10px] text-[#8A8279] ml-auto">p.{selected.order + 1}</span>
                  </div>

                  {/* Photo slots status */}
                  {selected.slots.length > 0 && (
                    <div>
                      <p className="text-[10px] text-[#8A8279] mb-1.5 uppercase tracking-wider">Photo Slots</p>
                      <div className="space-y-1">
                        {selected.slots.map((s, i) => (
                          <div key={s.slotId} className="flex items-center gap-2 text-[11px]">
                            <div className={`w-3 h-3 rounded ${s.photoId ? "bg-green-400" : "bg-[#E8E3DE]"}`} />
                            <span>{s.photoId ? mockPhotos.find(p => p.id === s.photoId)?.name : `Slot ${i + 1} — empty`}</span>
                            {s.photoId && s.filter !== "none" && <span className="text-[9px] text-purple-500 ml-auto">{filters.find(f => f.id === s.filter)?.label}</span>}
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 h-1.5 bg-[#E8E3DE] rounded-full overflow-hidden">
                        <div className="h-full bg-green-400 rounded-full transition-all" style={{ width: `${(selected.slots.filter(s => s.photoId).length / selected.slots.length) * 100}%` }} />
                      </div>
                    </div>
                  )}

                  {/* Opacity */}
                  <div>
                    <p className="text-[10px] text-[#8A8279] mb-1 uppercase tracking-wider">Opacity</p>
                    <div className="flex items-center gap-2">
                      <input type="range" min="10" max="100" value={selected.opacity} onChange={e => updatePageProp("opacity", Number(e.target.value))} className="flex-1 accent-[#2C2825]" />
                      <span className="text-xs text-[#8A8279] w-8 text-right">{selected.opacity}%</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-1.5">
                    <button onClick={() => duplicatePage(selected.id)} className="flex items-center gap-1 p-2 text-[10px] rounded-lg border border-[#E8E3DE] hover:border-[#2C2825]"><Copy className="w-3 h-3" /> Duplicate</button>
                    <button onClick={() => updatePageProp("locked", !selected.locked)} className="flex items-center gap-1 p-2 text-[10px] rounded-lg border border-[#E8E3DE] hover:border-[#2C2825]">
                      {selected.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />} {selected.locked ? "Unlock" : "Lock"}
                    </button>
                    <button onClick={() => updatePageProp("visible", !selected.visible)} className="flex items-center gap-1 p-2 text-[10px] rounded-lg border border-[#E8E3DE] hover:border-[#2C2825]">
                      {selected.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />} {selected.visible ? "Hide" : "Show"}
                    </button>
                    <button onClick={() => deletePage(selected.id)} className="flex items-center gap-1 p-2 text-[10px] rounded-lg border border-red-200 text-red-600 hover:bg-red-50"><Trash2 className="w-3 h-3" /> Delete</button>
                  </div>

                  {/* AI */}
                  <button onClick={() => autoFillPage(selected.id)} className="w-full flex items-center gap-2 p-2.5 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 text-purple-700 text-[11px] hover:shadow-md">
                    <Sparkles className="w-4 h-4" /> Auto-fill with AI
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {!rightPanelOpen && <button onClick={() => setRightPanelOpen(true)} className="w-6 bg-white border-l border-[#E8E3DE] flex items-center justify-center text-[#8A8279] hover:text-[#2C2825] flex-shrink-0"><ChevronLeft className="w-3 h-3" /></button>}
      </div>

      {/* Status Bar */}
      <div className={`h-7 flex items-center justify-between px-4 text-[10px] flex-shrink-0 ${darkCanvas ? "bg-[#1f1f1f] text-gray-500 border-t border-[#333]" : "bg-white text-[#8A8279] border-t border-[#E8E3DE]"}`}>
        <div className="flex items-center gap-4">
          <span>{view} view</span>
          <span>{pages.length} pages</span>
          <span>{filledPhotos}/{totalSlots} photos</span>
          <span>⌘Z undo · ⌘D duplicate · ← → navigate</span>
        </div>
        <div className="flex items-center gap-4">
          <span>8.5 × 11 in</span>
          <span>300 DPI</span>
          <span>CMYK Ready</span>
        </div>
      </div>
    </div>
  );
}
