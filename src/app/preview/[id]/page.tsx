"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Download, ShoppingCart, BookOpen, Printer, ChevronLeft, ChevronRight, Maximize2, Minimize2 } from "lucide-react";
import { BookPage, mockPhotos, pageTypeConfig, loadProject, createSlots } from "@/lib/store";

const defaultPages: BookPage[] = [
  { id: "cover", type: "hero", order: 0, text: "Summer in Tuscany", locked: false, visible: true, background: "#F5F0EB", opacity: 100, slots: [{ slotId: "s0", photoId: "photo-0", filter: "none" }] },
  { id: "p1", type: "duo", order: 1, locked: false, visible: true, background: "#F5F0EB", opacity: 100, slots: [{ slotId: "s0", photoId: "photo-1", filter: "none" }, { slotId: "s1", photoId: "photo-2", filter: "none" }] },
  { id: "p2", type: "grid", order: 2, locked: false, visible: true, background: "#F5F0EB", opacity: 100, slots: Array.from({ length: 6 }, (_, i) => ({ slotId: `s${i}`, photoId: `photo-${i + 3}`, filter: "none" })) },
  { id: "p3", type: "quote", order: 3, text: "Every moment tells a story worth preserving.", locked: false, visible: true, background: "#ffffff", opacity: 100, slots: [] },
  { id: "p4", type: "mosaic", order: 4, locked: false, visible: true, background: "#F5F0EB", opacity: 100, slots: Array.from({ length: 4 }, (_, i) => ({ slotId: `s${i}`, photoId: `photo-${i + 9}`, filter: "none" })) },
  { id: "p5", type: "collage", order: 5, locked: false, visible: true, background: "#F5F0EB", opacity: 100, slots: Array.from({ length: 5 }, (_, i) => ({ slotId: `s${i}`, photoId: `photo-${i + 13}`, filter: "none" })) },
  { id: "p6", type: "journal", order: 6, text: "The golden light of Tuscany painted every wall in warmth we would never forget.", locked: false, visible: true, background: "#F5F0EB", opacity: 100, slots: [{ slotId: "s0", photoId: "photo-18", filter: "none" }] },
  { id: "p7", type: "divider", order: 7, text: "Fin", locked: false, visible: true, background: "#F5F0EB", opacity: 100, slots: [] },
];

function PreviewPage({ page }: { page: BookPage }) {
  const getPhotoColor = (photoId: string | null) => {
    if (!photoId) return "#E8E3DE";
    return mockPhotos.find(p => p.id === photoId)?.color || "#E8E3DE";
  };

  const renderSlot = (slot: { photoId: string | null; filter: string }, cls: string) => (
    <div className={cls} style={{
      backgroundColor: getPhotoColor(slot.photoId),
      filter: slot.filter !== "none" ? slot.filter : undefined,
    }} />
  );

  switch (page.type) {
    case "hero":
      return (
        <div className="w-full h-full relative" style={{ backgroundColor: getPhotoColor(page.slots[0]?.photoId) }}>
          {page.text && (
            <div className="absolute bottom-8 left-8 right-8">
              <h2 className="text-2xl font-serif text-white drop-shadow-lg">{page.text}</h2>
            </div>
          )}
        </div>
      );
    case "duo":
      return (
        <div className="w-full h-full grid grid-cols-2 gap-3 p-5" style={{ backgroundColor: page.background }}>
          {page.slots.map(s => renderSlot(s, "rounded-xl"))}
        </div>
      );
    case "grid":
      return (
        <div className="w-full h-full grid grid-cols-3 grid-rows-2 gap-2 p-4" style={{ backgroundColor: page.background }}>
          {page.slots.map((s, i) => <div key={i}>{renderSlot(s, "w-full h-full rounded-lg")}</div>)}
        </div>
      );
    case "collage":
      return (
        <div className="w-full h-full p-4 grid grid-cols-4 grid-rows-3 gap-2" style={{ backgroundColor: page.background }}>
          {renderSlot(page.slots[0], "col-span-2 row-span-2 rounded-xl")}
          {renderSlot(page.slots[1], "col-span-2 rounded-xl")}
          {renderSlot(page.slots[2], "rounded-xl")}
          {renderSlot(page.slots[3], "rounded-xl")}
          {page.slots[4] && renderSlot(page.slots[4], "col-span-2 rounded-xl")}
        </div>
      );
    case "mosaic":
      return (
        <div className="w-full h-full p-4 grid grid-cols-3 grid-rows-3 gap-2" style={{ backgroundColor: page.background }}>
          {renderSlot(page.slots[0], "row-span-2 rounded-xl")}
          {renderSlot(page.slots[1], "col-span-2 rounded-xl")}
          {renderSlot(page.slots[2], "rounded-xl")}
          {renderSlot(page.slots[3], "rounded-xl")}
        </div>
      );
    case "panoramic":
      return (
        <div className="w-full h-full flex items-center p-6" style={{ backgroundColor: page.background }}>
          {renderSlot(page.slots[0], "w-full h-2/3 rounded-2xl")}
        </div>
      );
    case "quote":
      return (
        <div className="w-full h-full flex flex-col items-center justify-center p-10" style={{ backgroundColor: page.background }}>
          <span className="text-5xl font-serif text-[#E8E3DE] mb-4">&ldquo;</span>
          <p className="text-center font-serif italic text-[#2C2825] text-lg leading-relaxed max-w-md">{page.text}</p>
          <div className="mt-6 w-12 h-px bg-[#D4CEC7]" />
        </div>
      );
    case "divider":
      return (
        <div className="w-full h-full flex flex-col items-center justify-center" style={{ backgroundColor: page.background }}>
          <div className="w-16 h-px bg-[#D4CEC7] mb-4" />
          <p className="text-sm uppercase tracking-[0.3em] text-[#8A8279]">{page.text}</p>
          <div className="w-16 h-px bg-[#D4CEC7] mt-4" />
        </div>
      );
    case "journal":
      return (
        <div className="w-full h-full flex gap-4 p-5" style={{ backgroundColor: page.background }}>
          {renderSlot(page.slots[0], "w-1/2 rounded-xl")}
          <div className="w-1/2 flex flex-col justify-center pr-2">
            <p className="text-xs uppercase tracking-[0.2em] text-[#8A8279] mb-2">June 15, 2024</p>
            <p className="text-sm text-[#2C2825] leading-relaxed font-serif italic">{page.text}</p>
            <div className="w-8 h-px bg-[#D4CEC7] mt-4" />
          </div>
        </div>
      );
    default:
      return <div className="w-full h-full" style={{ backgroundColor: page.background }} />;
  }
}

export default function Preview() {
  const [pages, setPages] = useState<BookPage[]>(defaultPages);
  const [viewMode, setViewMode] = useState<"spread" | "single" | "book">("spread");
  const [currentSpread, setCurrentSpread] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    const saved = loadProject();
    if (saved && saved.length > 0) setPages(saved);
  }, []);

  const visiblePages = pages.filter(p => p.visible);
  const spreads = Array.from({ length: Math.ceil(visiblePages.length / 2) }, (_, i) => ({
    left: visiblePages[i * 2],
    right: visiblePages[i * 2 + 1],
  }));
  const filledPhotos = pages.reduce((s, p) => s + p.slots.filter(sl => sl.photoId).length, 0);

  return (
    <div className={`min-h-screen bg-[#1a1a1a] ${fullscreen ? "fixed inset-0 z-50" : ""}`}>
      {/* Toolbar */}
      <div className="sticky top-0 z-40 bg-[#2C2825] border-b border-[#3d3632] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/editor/new" className="text-[#8A8279] hover:text-white transition-colors flex items-center gap-2 text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Editor
          </Link>
          <div className="h-5 w-px bg-[#3d3632]" />
          <h2 className="font-serif text-white text-sm">Summer in Tuscany</h2>
          <span className="text-[10px] text-[#8A8279] bg-[#3d3632] px-2 py-0.5 rounded-full">{visiblePages.length} pages · {filledPhotos} photos</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-[#3d3632] rounded-lg overflow-hidden">
            {(["spread", "single", "book"] as const).map(v => (
              <button key={v} onClick={() => { setViewMode(v); setCurrentSpread(0); }}
                className={`px-3 py-1.5 text-[11px] capitalize ${viewMode === v ? "bg-white text-[#2C2825]" : "text-[#8A8279] hover:text-white"}`}>{v}</button>
            ))}
          </div>
          <button onClick={() => setFullscreen(!fullscreen)} className="p-2 text-[#8A8279] hover:text-white">
            {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <div className="h-5 w-px bg-[#3d3632]" />
          <button className="px-4 py-1.5 text-sm text-[#8A8279] hover:text-white border border-[#3d3632] rounded-lg flex items-center gap-2">
            <Download className="w-4 h-4" /> PDF
          </button>
          <Link href="/pricing" className="px-4 py-1.5 text-sm bg-white text-[#2C2825] rounded-lg hover:bg-gray-100 flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" /> Order Print
          </Link>
        </div>
      </div>

      <div className="p-8">
        {/* SPREAD VIEW */}
        {viewMode === "spread" && (
          <div className="max-w-5xl mx-auto space-y-12">
            {/* Cover */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-xs mx-auto">
              <div className="bg-[#2C2825] rounded-2xl shadow-2xl p-10 aspect-[3/4] flex flex-col items-center justify-end border border-[#3d3632]">
                <div className="flex-1 flex items-center justify-center">
                  <div className="w-28 h-28 rounded-2xl" style={{ backgroundColor: mockPhotos[0].color }} />
                </div>
                <h2 className="text-xl font-serif text-[#F5F0EB] tracking-wide mb-1">Summer in Tuscany</h2>
                <p className="text-[#8A8279] text-[10px] tracking-[0.3em] uppercase">2026</p>
              </div>
              <p className="text-center text-xs text-[#8A8279] mt-3">Front Cover</p>
            </motion.div>

            {/* Spreads */}
            {spreads.map((spread, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }}>
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                  <div className={`grid ${spread.right ? "grid-cols-2" : "grid-cols-1"} aspect-[${spread.right ? "2/1.3" : "1/1.3"}]`}>
                    <div className="aspect-[1/1.3] border-r border-[#E8E3DE]">
                      <PreviewPage page={spread.left} />
                    </div>
                    {spread.right && (
                      <div className="aspect-[1/1.3]">
                        <PreviewPage page={spread.right} />
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-center text-xs text-[#8A8279] mt-3">
                  Pages {spread.left.order + 1}{spread.right ? ` – ${spread.right.order + 1}` : ""}
                </p>
              </motion.div>
            ))}

            {/* Back cover */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-xs mx-auto">
              <div className="bg-[#F5F0EB] rounded-2xl shadow-2xl p-10 aspect-[3/4] flex flex-col items-center justify-center border border-[#E8E3DE]">
                <p className="font-serif italic text-[#8A8279] text-sm text-center">&ldquo;The best things in life are the people you love, the places you have been, and the memories you have made.&rdquo;</p>
                <div className="w-12 h-px bg-[#D4CEC7] mt-6" />
              </div>
              <p className="text-center text-xs text-[#8A8279] mt-3">Back Cover</p>
            </motion.div>
          </div>
        )}

        {/* SINGLE PAGE VIEW */}
        {viewMode === "single" && (
          <div className="max-w-lg mx-auto">
            <motion.div key={currentSpread} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}>
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden aspect-[1/1.3]">
                <PreviewPage page={visiblePages[currentSpread]} />
              </div>
              <p className="text-center text-sm text-[#8A8279] mt-4">
                Page {currentSpread + 1} of {visiblePages.length} · {pageTypeConfig[visiblePages[currentSpread].type]?.label}
              </p>
            </motion.div>
            <div className="flex justify-center gap-4 mt-6">
              <button onClick={() => setCurrentSpread(Math.max(0, currentSpread - 1))} disabled={currentSpread === 0}
                className="p-3 rounded-full bg-[#3d3632] text-white disabled:opacity-30 hover:bg-[#4d4642]"><ChevronLeft className="w-5 h-5" /></button>
              <button onClick={() => setCurrentSpread(Math.min(visiblePages.length - 1, currentSpread + 1))} disabled={currentSpread >= visiblePages.length - 1}
                className="p-3 rounded-full bg-[#3d3632] text-white disabled:opacity-30 hover:bg-[#4d4642]"><ChevronRight className="w-5 h-5" /></button>
            </div>
          </div>
        )}

        {/* BOOK VIEW - 3D-ish flip */}
        {viewMode === "book" && (
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-1">
              <motion.div key={`left-${currentSpread}`} initial={{ rotateY: -15, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }}
                className="w-[45%] bg-white rounded-l-2xl shadow-2xl overflow-hidden" style={{ perspective: "1000px" }}>
                <div className="aspect-[1/1.3]">
                  {spreads[currentSpread]?.left && <PreviewPage page={spreads[currentSpread].left} />}
                </div>
              </motion.div>
              <div className="w-1 bg-[#D4CEC7] self-stretch rounded-full shadow-inner" />
              <motion.div key={`right-${currentSpread}`} initial={{ rotateY: 15, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }}
                className="w-[45%] bg-white rounded-r-2xl shadow-2xl overflow-hidden" style={{ perspective: "1000px" }}>
                <div className="aspect-[1/1.3]">
                  {spreads[currentSpread]?.right ? <PreviewPage page={spreads[currentSpread].right} /> : <div className="w-full h-full bg-[#F5F0EB]" />}
                </div>
              </motion.div>
            </div>
            <div className="flex justify-center gap-4 mt-8">
              <button onClick={() => setCurrentSpread(Math.max(0, currentSpread - 1))} disabled={currentSpread === 0}
                className="px-4 py-2 rounded-xl bg-[#3d3632] text-white text-sm disabled:opacity-30 hover:bg-[#4d4642] flex items-center gap-2">
                <ChevronLeft className="w-4 h-4" /> Prev Spread
              </button>
              <span className="self-center text-sm text-[#8A8279]">Spread {currentSpread + 1} of {spreads.length}</span>
              <button onClick={() => setCurrentSpread(Math.min(spreads.length - 1, currentSpread + 1))} disabled={currentSpread >= spreads.length - 1}
                className="px-4 py-2 rounded-xl bg-[#3d3632] text-white text-sm disabled:opacity-30 hover:bg-[#4d4642] flex items-center gap-2">
                Next Spread <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Print specs bar */}
        <div className="max-w-5xl mx-auto mt-12 p-6 bg-[#2C2825] rounded-2xl border border-[#3d3632]">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-6 text-[#8A8279] text-xs">
              <div className="flex items-center gap-2"><Printer className="w-4 h-4" /> <span>300 DPI · CMYK</span></div>
              <div className="flex items-center gap-2"><BookOpen className="w-4 h-4" /> <span>8.5 × 11 in · Perfect Bound</span></div>
              <span>170gsm Uncoated Silk</span>
              <span>{visiblePages.length} pages · {filledPhotos} photos</span>
            </div>
            <Link href="/pricing" className="px-6 py-2.5 bg-white text-[#2C2825] rounded-xl text-sm font-medium hover:bg-gray-100 flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" /> Order Print — from $29
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
