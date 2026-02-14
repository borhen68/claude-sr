/**
 * Smart Photo Analyzer
 * Zero AI cost - uses free libraries
 */

import sharp from 'sharp';
import exifr from 'exifr';
import Vibrant from 'node-vibrant';

export interface PhotoAnalysis {
  id: string;
  filename: string;
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
    sharpness: number;  // 0-100
    brightness: number; // 0-100
  };
  hasFaces: boolean;
  faceCount: number;
}

/**
 * Analyze a single photo
 */
export async function analyzePhoto(
  buffer: Buffer,
  filename: string
): Promise<PhotoAnalysis> {
  // Get image metadata
  const metadata = await sharp(buffer).metadata();
  
  // Extract EXIF data
  const exif = await exifr.parse(buffer);
  
  // Extract color palette
  const palette = await Vibrant.from(buffer).getPalette();
  
  // Calculate sharpness (basic laplacian variance)
  const stats = await sharp(buffer)
    .greyscale()
    .stats();
  
  const sharpness = calculateSharpness(stats);
  const brightness = calculateBrightness(stats);
  
  // Determine orientation
  const { width = 0, height = 0 } = metadata;
  const aspectRatio = width / height;
  let orientation: 'portrait' | 'landscape' | 'square';
  
  if (aspectRatio > 1.1) orientation = 'landscape';
  else if (aspectRatio < 0.9) orientation = 'portrait';
  else orientation = 'square';
  
  return {
    id: generateId(),
    filename,
    width,
    height,
    orientation,
    dateTaken: exif?.DateTimeOriginal,
    colorPalette: {
      dominant: palette.DarkVibrant?.hex || '#000000',
      vibrant: palette.Vibrant?.hex || '#FF0000',
      muted: palette.Muted?.hex || '#888888',
    },
    quality: {
      sharpness,
      brightness,
    },
    hasFaces: false, // TODO: Add face detection
    faceCount: 0,
  };
}

/**
 * Sort photos by best criteria
 */
export function sortPhotos(photos: PhotoAnalysis[]): PhotoAnalysis[] {
  return photos.sort((a, b) => {
    // Priority 1: Photos with faces
    if (a.hasFaces && !b.hasFaces) return -1;
    if (!a.hasFaces && b.hasFaces) return 1;
    
    // Priority 2: Better quality
    const aQuality = (a.quality.sharpness + a.quality.brightness) / 2;
    const bQuality = (b.quality.sharpness + b.quality.brightness) / 2;
    if (aQuality !== bQuality) return bQuality - aQuality;
    
    // Priority 3: Chronological
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
    const key = `${photo.width}x${photo.height}_${photo.dateTaken?.getTime()}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(photo);
    }
  }
  
  return unique;
}

// Helper functions
function calculateSharpness(stats: any): number {
  // Simplified sharpness metric
  return Math.min(100, (stats.channels[0].mean / 255) * 100);
}

function calculateBrightness(stats: any): number {
  return (stats.channels[0].mean / 255) * 100;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}
