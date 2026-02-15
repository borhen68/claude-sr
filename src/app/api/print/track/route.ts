import { NextRequest, NextResponse } from 'next/server';
import { PrintOrchestrator, STANDARD_DIMENSIONS, PRINT_COLOR_PROFILES } from '@/lib/print';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    const provider = searchParams.get('provider') as 'printful' | 'gelato';

    if (!orderId || !provider) {
      return NextResponse.json({ error: 'Missing orderId or provider' }, { status: 400 });
    }

    const orchestrator = new PrintOrchestrator({
      projectId: 'tracking',
      product: {
        id: 'photobook',
        provider,
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

    const order = await orchestrator.trackOrder(orderId, provider);

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        status: order.status,
        tracking: order.tracking,
        cost: order.cost,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to track order' }, { status: 500 });
  }
}
