import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PATCH - Update cart item
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { quantity } = body;

    if (!quantity || quantity < 1) {
      return NextResponse.json(
        { error: 'Invalid quantity' },
        { status: 400 }
      );
    }

    const cartItem = await prisma.cartItem.update({
      where: {
        id: params.id,
        userId, // Ensure user owns this cart item
      },
      data: { quantity },
    });

    return NextResponse.json(cartItem);
  } catch (error) {
    console.error('Error updating cart item:', error);
    return NextResponse.json(
      { error: 'Failed to update cart item' },
      { status: 500 }
    );
  }
}

// DELETE - Remove cart item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await prisma.cartItem.delete({
      where: {
        id: params.id,
        userId, // Ensure user owns this cart item
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing cart item:', error);
    return NextResponse.json(
      { error: 'Failed to remove cart item' },
      { status: 500 }
    );
  }
}
