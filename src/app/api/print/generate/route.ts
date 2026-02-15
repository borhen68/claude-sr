import { NextRequest, NextResponse } from 'next/server';
import {
  PrintOrchestrator,
  STANDARD_DIMENSIONS,
  PRINT_COLOR_PROFILES,
  PDFGenerator,
} from '@/lib/print';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, pages, cover } = body;

    const orchestrator = new PrintOrchestrator({
      projectId,
      product: {
        id: 'photobook',
        provider: 'printful',
        productType: 'photobook',
        variant: 'hardcover',
        dimensions: STANDARD_DIMENSIONS.SQUARE_8X8,
        pageCount: pages.length,
        paperType: '170gsm',
        coverType: 'hardcover',
        binding: 'perfect',
      },
      pages,
      cover,
      colorProfile: PRINT_COLOR_PROFILES.FOGRA39,
      qualityChecks: true,
      autoFix: true,
      outputPath: `/tmp/print-${projectId}.pdf`,
    });

    const { pdfBuffer, qualityCheck } = await orchestrator.producePrintJob();

    return NextResponse.json({
      success: true,
      pdf: pdfBuffer.toString('base64'),
      quality: qualityCheck,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
