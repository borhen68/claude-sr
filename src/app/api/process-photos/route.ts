import { NextRequest, NextResponse } from 'next/server';
import { analyzePhoto, sortPhotos, removeDuplicates } from '@/lib/photo-analyzer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('photos') as File[];
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No photos provided' },
        { status: 400 }
      );
    }
    
    console.log(`Processing ${files.length} photos...`);
    
    // Convert files to buffers and analyze
    const analyses = await Promise.all(
      files.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        return analyzePhoto(buffer, file.name);
      })
    );
    
    console.log(`Analyzed ${analyses.length} photos`);
    
    // Sort and clean
    const sorted = sortPhotos(analyses);
    const unique = removeDuplicates(sorted);
    
    console.log(`Final: ${unique.length} unique photos`);
    
    return NextResponse.json({
      success: true,
      totalPhotos: files.length,
      processedPhotos: unique.length,
      removed: files.length - unique.length,
      photos: unique,
    });
    
  } catch (error: any) {
    console.error('Photo processing error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process photos' },
      { status: 500 }
    );
  }
}
