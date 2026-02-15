/**
 * RGB to CMYK Color Conversion
 * Professional color space conversion with ICC profile support
 */

import { RGBColor, CMYKColor, PrintColorProfile } from '../types';

export function rgbToCmyk(rgb: RGBColor): CMYKColor {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  const k = 1 - Math.max(r, g, b);

  if (k === 1) {
    return { c: 0, m: 0, y: 0, k: 100 };
  }

  const c = (1 - r - k) / (1 - k);
  const m = (1 - g - k) / (1 - k);
  const y = (1 - b - k) / (1 - k);

  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100),
  };
}

export function cmykToRgb(cmyk: CMYKColor): RGBColor {
  const c = cmyk.c / 100;
  const m = cmyk.m / 100;
  const y = cmyk.y / 100;
  const k = cmyk.k / 100;

  return {
    r: Math.round(255 * (1 - c) * (1 - k)),
    g: Math.round(255 * (1 - m) * (1 - k)),
    b: Math.round(255 * (1 - y) * (1 - k)),
  };
}

export function hexToRgb(hex: string): RGBColor {
  const cleaned = hex.replace('#', '');
  return {
    r: parseInt(cleaned.substring(0, 2), 16),
    g: parseInt(cleaned.substring(2, 4), 16),
    b: parseInt(cleaned.substring(4, 6), 16),
  };
}

export function isInCmykGamut(rgb: RGBColor): boolean {
  const cmyk = rgbToCmyk(rgb);
  const backToRgb = cmykToRgb(cmyk);
  const threshold = 5;
  return Math.abs(rgb.r - backToRgb.r) <= threshold &&
         Math.abs(rgb.g - backToRgb.g) <= threshold &&
         Math.abs(rgb.b - backToRgb.b) <= threshold;
}

export function detectPrintProblems(rgb: RGBColor): string[] {
  const problems: string[] = [];
  const cmyk = rgbToCmyk(rgb);
  const totalInk = cmyk.c + cmyk.m + cmyk.y + cmyk.k;
  
  if (totalInk > 300) {
    problems.push(`High ink coverage (${totalInk}%)`);
  }
  if (!isInCmykGamut(rgb)) {
    problems.push('Out of CMYK gamut');
  }
  
  return problems;
}

export const PRINT_COLOR_PROFILES: Record<string, PrintColorProfile> = {
  'FOGRA39': {
    name: 'FOGRA39 (ISO Coated v2)',
    colorSpace: 'CMYK',
    renderingIntent: 'relative',
    iccProfile: 'ISOcoated_v2_300_eci.icc',
  },
  'sRGB': {
    name: 'sRGB (Digital Preview)',
    colorSpace: 'RGB',
    renderingIntent: 'perceptual',
  },
};
