import { NextRequest, NextResponse } from 'next/server';

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
    
    return NextResponse.json({
      success: true,
      totalPhotos: files.length,
      message: 'Photos received - processing coming soon',
    });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process photos' },
      { status: 500 }
    );
  }
}
