import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";

// GET single order
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            coverImage: true,
            theme: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Check if user owns this order
    if (order.userId !== user.id && user.role !== "admin") {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Order fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

// PATCH update order (status, tracking, etc.)
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: params.id },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { status, trackingNumber, notes, shippingAddress } = body;

    // Only admin can update status and tracking
    // User can update shipping address if order is still pending
    const updateData: any = {};

    if (user.role === "admin") {
      if (status !== undefined) updateData.status = status;
      if (trackingNumber !== undefined) updateData.trackingNumber = trackingNumber;
      if (notes !== undefined) updateData.notes = notes;
      if (shippingAddress !== undefined) updateData.shippingAddress = shippingAddress;
    } else if (order.userId === user.id) {
      // Regular user can only update shipping address if pending
      if (shippingAddress !== undefined && order.status === "pending") {
        updateData.shippingAddress = shippingAddress;
      } else {
        return NextResponse.json(
          { error: "You can only update shipping address for pending orders" },
          { status: 403 }
        );
      }
    } else {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: updateData,
      include: {
        project: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: "Order updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Order update error:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}
