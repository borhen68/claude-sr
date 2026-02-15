import { NextRequest, NextResponse } from 'next/server';
import { getOrderTracking } from '@/lib/commerce/orders';

// GET - Track order by order number (public endpoint)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const orderNumber = searchParams.get('orderNumber');
    
    if (!orderNumber) {
      return NextResponse.json(
        { error: 'Order number is required' },
        { status: 400 }
      );
    }

    const tracking = await getOrderTracking(orderNumber);
    
    if (!tracking) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(tracking);
  } catch (error) {
    console.error('Error tracking order:', error);
    return NextResponse.json(
      { error: 'Failed to track order' },
      { status: 500 }
    );
  }
}
