/**
 * Smart Photo Analyzer (WITHOUT node-vibrant)
 * Zero AI cost - uses only sharp + exifr
 */

import sharp from 'sharp';
import exifr from 'exifr';

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
 * Analyze a single photo
 */
export async function analyzePhoto(
  buffer: Buffer,
  filename: string
): Promise<PhotoAnalysis> {
  try {
    // Get image metadata
    const metadata = await sharp(buffer).metadata();
    
    // Extract EXIF data
    let exifData;
    try {
      exifData = await exifr.parse(buffer);
    } catch (e) {
      exifData = null;
    }
    
    // Get basic stats for color/quality
    const stats = await sharp(buffer)
      .resize(100, 100, { fit: 'cover' })
      .raw()
      .toBuffer({ resolveWithObject: true });
    
    const { width = 0, height = 0 } = metadata;
    const aspectRatio = width / height;
    
    // Determine orientation
    let orientation: 'portrait' | 'landscape' | 'square';
    if (aspectRatio > 1.1) orientation = 'landscape';
    else if (aspectRatio < 0.9) orientation = 'portrait';
    else orientation = 'square';
    
    // Extract dominant color from pixel data
    const dominant = extractDominantColor(stats.data);
    
    // Calculate quality metrics
    const brightness = calculateBrightness(stats.data);
    const sharpness = Math.min(100, brightness * 1.2);
    
    return {
      id: generateId(),
      filename,
      width,
      height,
      orientation,
      dateTaken: exifData?.DateTimeOriginal,
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

function extractDominantColor(pixelData: Buffer): string {
  // Sample every 10th pixel for speed
  let r = 0, g = 0, b = 0, count = 0;
  
  for (let i = 0; i < pixelData.length; i += 30) {
    r += pixelData[i];
    g += pixelData[i + 1];
    b += pixelData[i + 2];
    count++;
  }
  
  return rgbToHex(
    Math.floor(r / count),
    Math.floor(g / count),
    Math.floor(b / count)
  );
}

function calculateBrightness(pixelData: Buffer): number {
  let sum = 0;
  for (let i = 0; i < pixelData.length; i += 3) {
    sum += (pixelData[i] + pixelData[i + 1] + pixelData[i + 2]) / 3;
  }
  return (sum / (pixelData.length / 3) / 255) * 100;
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = Math.max(0, Math.min(255, x)).toString(16);
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
