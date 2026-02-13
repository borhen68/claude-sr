"use client";
import { createContext, useContext } from "react";

// Shared types used across the app
export type PageType = "hero" | "duo" | "grid" | "collage" | "quote" | "divider" | "mosaic" | "panoramic" | "journal";

export interface PhotoSlot {
  slotId: string;
  photoId: string | null;
  filter: string;
}

export interface BookPage {
  id: string;
  type: PageType;
  order: number;
  text?: string;
  textAlign?: "left" | "center" | "right";
  locked: boolean;
  visible: boolean;
  background: string;
  opacity: number;
  slots: PhotoSlot[];
}

export const photoColors = ["#8B7355", "#6B8E6B", "#7B8BA3", "#A0826D", "#8E7BA0", "#6B9E9E", "#A08E6B", "#7B6B8E", "#9E6B6B", "#6B8E8B", "#A09B6B", "#8B6B7B", "#6BA08E", "#8E8B6B", "#6B7BA0", "#9E7B6B", "#7B9E6B", "#6B6BA0", "#A06B8E", "#8BA06B", "#6B9EA0", "#A07B6B", "#7BA06B", "#6B8EA0"];

export const mockPhotos = photoColors.map((c, i) => ({
  id: `photo-${i}`,
  color: c,
  name: `IMG_${1000 + i}.jpg`,
  emotion: ["joyful", "serene", "playful", "warm", "intimate"][i % 5],
}));

export function createSlots(type: PageType): PhotoSlot[] {
  const counts: Record<PageType, number> = { hero: 1, duo: 2, grid: 6, collage: 5, mosaic: 4, panoramic: 1, quote: 0, divider: 0, journal: 1 };
  return Array.from({ length: counts[type] }, (_, i) => ({ slotId: `slot-${i}`, photoId: null, filter: "none" }));
}

export const pageTypeConfig: Record<PageType, { label: string; desc: string }> = {
  hero: { label: "Hero", desc: "Full-bleed single image" },
  duo: { label: "Duo", desc: "Two images side by side" },
  grid: { label: "Grid", desc: "Up to 6 images" },
  collage: { label: "Collage", desc: "Asymmetric layout" },
  mosaic: { label: "Mosaic", desc: "Masonry arrangement" },
  panoramic: { label: "Panoramic", desc: "Wide cinematic" },
  quote: { label: "Quote", desc: "Typography page" },
  divider: { label: "Divider", desc: "Chapter break" },
  journal: { label: "Journal", desc: "Text + image" },
};

// localStorage helpers
export function saveProject(pages: BookPage[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem("frametale-pages", JSON.stringify(pages));
  }
}

export function loadProject(): BookPage[] | null {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("frametale-pages");
    if (data) return JSON.parse(data);
  }
  return null;
}
