/**
 * Layout Templates
 * Professional layouts - no AI needed
 */

export type LayoutType = 
  | 'hero-full'      // Full page single photo
  | 'duo-side'       // Two photos side by side
  | 'trio-row'       // Three photos in a row
  | 'quad-grid'      // Four photos in grid
  | 'asymmetric'     // Mixed sizes
  | 'quote-page';    // Text page

export interface PageLayout {
  type: LayoutType;
  photoSlots: number;
  positions: Array<{
    x: number;      // percentage
    y: number;      // percentage
    width: number;  // percentage
    height: number; // percentage
  }>;
}

/**
 * Template library
 */
export const templates: Record<LayoutType, PageLayout> = {
  'hero-full': {
    type: 'hero-full',
    photoSlots: 1,
    positions: [
      { x: 0, y: 0, width: 100, height: 100 }
    ]
  },
  
  'duo-side': {
    type: 'duo-side',
    photoSlots: 2,
    positions: [
      { x: 0, y: 0, width: 48, height: 100 },
      { x: 52, y: 0, width: 48, height: 100 }
    ]
  },
  
  'trio-row': {
    type: 'trio-row',
    photoSlots: 3,
    positions: [
      { x: 0, y: 10, width: 30, height: 80 },
      { x: 35, y: 10, width: 30, height: 80 },
      { x: 70, y: 10, width: 30, height: 80 }
    ]
  },
  
  'quad-grid': {
    type: 'quad-grid',
    photoSlots: 4,
    positions: [
      { x: 0, y: 0, width: 48, height: 48 },
      { x: 52, y: 0, width: 48, height: 48 },
      { x: 0, y: 52, width: 48, height: 48 },
      { x: 52, y: 52, width: 48, height: 48 }
    ]
  },
  
  'asymmetric': {
    type: 'asymmetric',
    photoSlots: 3,
    positions: [
      { x: 0, y: 0, width: 60, height: 100 },
      { x: 65, y: 0, width: 35, height: 48 },
      { x: 65, y: 52, width: 35, height: 48 }
    ]
  },
  
  'quote-page': {
    type: 'quote-page',
    photoSlots: 0,
    positions: []
  }
};

/**
 * Smart template selection based on photo characteristics
 */
export function selectTemplate(
  photoCount: number,
  orientation: 'portrait' | 'landscape' | 'square'
): LayoutType {
  if (photoCount === 1) return 'hero-full';
  if (photoCount === 2) return 'duo-side';
  if (photoCount === 3) {
    return orientation === 'landscape' ? 'trio-row' : 'asymmetric';
  }
  if (photoCount >= 4) return 'quad-grid';
  
  return 'hero-full';
}
