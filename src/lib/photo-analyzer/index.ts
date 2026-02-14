/**
 * Smart Photo Analyzer
 * Zero AI cost - uses free libraries
 */

import sharp from 'sharp';

export interface PhotoAnalysis {
  id: string;
  filename: string;
  url?: string;
  width: number;
  height: number;
  orientation: 'portrait' | 'landscape' | 'square';
  dateTaken?: Date;
  colorPalette: {
    dominant: string;
    vibrant: string;
    muted: string;
  };
  quality: {
    sharpness: number;
    brightness: number;
  };
  hasFaces: boolean;
  faceCount: number;
}

/**
 * Analyze a single photo (simplified - works without external deps)
 */
export async function analyzePhoto(
  buffer: Buffer,
  filename: string
): Promise<PhotoAnalysis> {
  try {
    // Get image metadata
    const metadata = await sharp(buffer).metadata();
    
    // Get basic stats
    const stats = await sharp(buffer)
      .greyscale()
      .stats();
    
    const { width = 0, height = 0 } = metadata;
    const aspectRatio = width / height;
    
    // Determine orientation
    let orientation: 'portrait' | 'landscape' | 'square';
    if (aspectRatio > 1.1) orientation = 'landscape';
    else if (aspectRatio < 0.9) orientation = 'portrait';
    else orientation = 'square';
    
    // Calculate quality metrics
    const brightness = (stats.channels[0].mean / 255) * 100;
    const sharpness = Math.min(100, brightness * 1.2); // Simplified
    
    // Extract dominant color from stats
    const dominant = rgbToHex(
      Math.floor(stats.channels[0].mean),
      Math.floor(stats.channels[1]?.mean || stats.channels[0].mean),
      Math.floor(stats.channels[2]?.mean || stats.channels[0].mean)
    );
    
    return {
      id: generateId(),
      filename,
      width,
      height,
      orientation,
      dateTaken: metadata.exif ? new Date() : undefined,
      colorPalette: {
        dominant,
        vibrant: adjustColor(dominant, 20),
        muted: adjustColor(dominant, -20),
      },
      quality: {
        sharpness: Math.round(sharpness),
        brightness: Math.round(brightness),
      },
      hasFaces: false,
      faceCount: 0,
    };
  } catch (error) {
    console.error('Error analyzing photo:', error);
    throw error;
  }
}

/**
 * Sort photos by best criteria
 */
export function sortPhotos(photos: PhotoAnalysis[]): PhotoAnalysis[] {
  return [...photos].sort((a, b) => {
    // Priority 1: Better quality
    const aQuality = (a.quality.sharpness + a.quality.brightness) / 2;
    const bQuality = (b.quality.sharpness + b.quality.brightness) / 2;
    if (Math.abs(aQuality - bQuality) > 5) {
      return bQuality - aQuality;
    }
    
    // Priority 2: Chronological if available
    if (a.dateTaken && b.dateTaken) {
      return a.dateTaken.getTime() - b.dateTaken.getTime();
    }
    
    return 0;
  });
}

/**
 * Remove duplicate/similar photos
 */
export function removeDuplicates(photos: PhotoAnalysis[]): PhotoAnalysis[] {
  const unique: PhotoAnalysis[] = [];
  const seen = new Set<string>();
  
  for (const photo of photos) {
    const key = `${photo.width}x${photo.height}_${photo.dateTaken?.getTime() || 'no-date'}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(photo);
    }
  }
  
  return unique;
}

// Helper functions
function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.slice(1), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
  return rgbToHex(r, g, b);
}
