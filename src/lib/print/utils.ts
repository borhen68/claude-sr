/**
 * Print System Utilities
 */

import { PrintDimensions, PrintPage, BleedBox } from './types';

/**
 * Calculate bleed box dimensions
 */
export function calculateBleedBox(
  dimensions: PrintDimensions,
  includeBleed: boolean = true
): BleedBox {
  const bleed = includeBleed ? dimensions.bleed : 0;
  
  return {
    x: 0,
    y: 0,
    width: dimensions.width + (bleed * 2),
    height: dimensions.height + (bleed * 2),
  };
}

/**
 * Calculate trim box (without bleed)
 */
export function calculateTrimBox(dimensions: PrintDimensions): BleedBox {
  return {
    x: dimensions.bleed,
    y: dimensions.bleed,
    width: dimensions.width,
    height: dimensions.height,
  };
}

/**
 * Calculate art box (safe area within margins)
 */
export function calculateArtBox(
  dimensions: PrintDimensions,
  marginMm: number = 10
): BleedBox {
  return {
    x: dimensions.bleed + marginMm,
    y: dimensions.bleed + marginMm,
    width: dimensions.width - (marginMm * 2),
    height: dimensions.height - (marginMm * 2),
  };
}

/**
 * Convert pixels to mm at given DPI
 */
export function pixelsToMm(pixels: number, dpi: number): number {
  const inches = pixels / dpi;
  return inches * 25.4; // 1 inch = 25.4mm
}

/**
 * Convert mm to pixels at given DPI
 */
export function mmToPixels(mm: number, dpi: number): number {
  const inches = mm / 25.4;
  return Math.round(inches * dpi);
}

/**
 * Validate canvas dimensions match print requirements
 */
export function validateCanvasDimensions(
  canvasWidth: number,
  canvasHeight: number,
  dimensions: PrintDimensions
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  const expectedWidth = mmToPixels(dimensions.width + dimensions.bleed * 2, dimensions.dpi);
  const expectedHeight = mmToPixels(dimensions.height + dimensions.bleed * 2, dimensions.dpi);
  
  const tolerance = 10; // 10 pixels tolerance
  
  if (Math.abs(canvasWidth - expectedWidth) > tolerance) {
    errors.push(
      `Canvas width ${canvasWidth}px doesn't match expected ${expectedWidth}px (${dimensions.width}mm + bleed at ${dimensions.dpi} DPI)`
    );
  }
  
  if (Math.abs(canvasHeight - expectedHeight) > tolerance) {
    errors.push(
      `Canvas height ${canvasHeight}px doesn't match expected ${expectedHeight}px (${dimensions.height}mm + bleed at ${dimensions.dpi} DPI)`
    );
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Create a blank page with proper dimensions
 */
export function createBlankPage(
  pageNumber: number,
  dimensions: PrintDimensions
): PrintPage {
  const bleedBox = calculateBleedBox(dimensions);
  const trimBox = calculateTrimBox(dimensions);
  const artBox = calculateArtBox(dimensions);
  
  return {
    pageNumber,
    type: 'single',
    canvasData: JSON.stringify({
      version: '5.3.0',
      objects: [],
      background: '#FFFFFF',
    }),
    bleedBox,
    trimBox,
    artBox,
  };
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Estimate PDF file size
 */
export function estimatePDFSize(pageCount: number, averageImageSize: number = 500000): number {
  // Rough estimate: base overhead + images per page
  const baseSize = 50000; // 50KB base
  const perPageSize = averageImageSize * 0.7; // Assume 70% compression
  return baseSize + (pageCount * perPageSize);
}
