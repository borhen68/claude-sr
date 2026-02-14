/**
 * Book Generator
 * Takes analyzed photos, creates a beautiful book
 */

import { PhotoAnalysis } from '../photo-analyzer';
import { selectTemplate, templates } from '../layout-engine/templates';

export interface BookPage {
  pageNumber: number;
  layout: string;
  photos: Array<{
    id: string;
    filename: string;
    position: number;
    x: number;
    y: number;
    width: number;
    height: number;
  }>;
}

export interface GeneratedBook {
  title: string;
  pages: BookPage[];
  totalPages: number;
  theme: {
    primaryColor: string;
    accentColor: string;
    textColor: string;
  };
}

/**
 * Generate a complete book from analyzed photos
 */
export function generateBook(
  photos: PhotoAnalysis[],
  title: string = 'My Photo Book'
): GeneratedBook {
  
  // Extract color theme from best photos
  const topPhotos = photos.slice(0, 3);
  const theme = extractTheme(topPhotos);
  
  // Create pages
  const pages = layoutPhotos(photos);
  
  return {
    title,
    pages,
    totalPages: pages.length,
    theme,
  };
}

/**
 * Layout photos into pages
 */
function layoutPhotos(photos: PhotoAnalysis[]): BookPage[] {
  const pages: BookPage[] = [];
  let pageNumber = 1;
  let photoIndex = 0;
  
  while (photoIndex < photos.length) {
    // Determine how many photos for this page (2-4 usually)
    const remaining = photos.length - photoIndex;
    const photosForPage = remaining === 1 ? 1 : 
                         remaining === 2 ? 2 :
                         remaining >= 4 ? 4 : 
                         3;
    
    const pagePhotos = photos.slice(photoIndex, photoIndex + photosForPage);
    const orientation = pagePhotos[0].orientation;
    
    // Select template
    const templateType = selectTemplate(photosForPage, orientation);
    const template = templates[templateType];
    
    // Create page
    pages.push({
      pageNumber,
      layout: templateType,
      photos: pagePhotos.map((photo, idx) => ({
        id: photo.id,
        filename: photo.filename,
        position: idx,
        ...template.positions[idx],
      })),
    });
    
    photoIndex += photosForPage;
    pageNumber++;
  }
  
  return pages;
}

/**
 * Extract color theme from photos
 */
function extractTheme(photos: PhotoAnalysis[]) {
  if (photos.length === 0) {
    return {
      primaryColor: '#1A1612',
      accentColor: '#C9A870',
      textColor: '#1A1612',
    };
  }
  
  const colors = photos.map(p => p.colorPalette);
  
  return {
    primaryColor: colors[0]?.dominant || '#1A1612',
    accentColor: colors[0]?.vibrant || '#C9A870',
    textColor: '#1A1612',
  };
}
