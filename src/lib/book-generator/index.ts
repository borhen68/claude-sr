import { PhotoAnalysis } from '../photo-analyzer';

export interface BookPage {
  pageNumber: number;
  layout: string;
}

export interface GeneratedBook {
  title: string;
  pages: BookPage[];
}

export async function generateBook(
  photos: PhotoAnalysis[],
  title: string
): Promise<GeneratedBook> {
  return {
    title,
    pages: []
  };
}
