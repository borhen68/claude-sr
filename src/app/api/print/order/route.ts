import { NextRequest, NextResponse } from 'next/server';
import { PrintOrchestrator, STANDARD_DIMENSIONS, PRINT_COLOR_PROFILES } from '@/lib/print';

export async function POST(request: NextRequest) {
  try {
    const { provider, recipient, pdfUrl, projectId } = await request.json();

    const orchestrator = new PrintOrchestrator({
      projectId,
      product: {
        id: 'photobook',
        provider: provider || 'printful',
        productType: 'photobook',
        variant: 'hardcover',
        dimensions: STANDARD_DIMENSIONS.SQUARE_8X8,
        pageCount: 24,
        paperType: '170gsm',
        coverType: 'hardcover',
        binding: 'perfect',
      },
      pages: [],
      cover: { front: {} as any, back: {} as any, spineWidth: 4 },
      colorProfile: PRINT_COLOR_PROFILES.FOGRA39,
      qualityChecks: false,
      autoFix: false,
      outputPath: '',
    });

    const order = await orchestrator.submitOrder(provider, recipient, pdfUrl);

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        status: order.status,
        cost: order.cost,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit order' }, { status: 500 });
  }
}
