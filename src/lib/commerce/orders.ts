import { prisma } from '@/lib/prisma';
import { OrderStatus } from '@prisma/client';

export async function getOrderById(orderId: string) {
  return prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
      shippingAddress: true,
      billingAddress: true,
      promoCode: true,
      user: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
  });
}

export async function getOrderByNumber(orderNumber: string) {
  return prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: true,
      shippingAddress: true,
      billingAddress: true,
      promoCode: true,
    },
  });
}

export async function getUserOrders(userId: string, limit = 50) {
  return prisma.order.findMany({
    where: { userId },
    include: {
      items: true,
      shippingAddress: true,
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  metadata?: {
    trackingNumber?: string;
    trackingUrl?: string;
    notes?: string;
  }
) {
  const updateData: any = { status };

  if (metadata?.trackingNumber) {
    updateData.trackingNumber = metadata.trackingNumber;
  }
  if (metadata?.trackingUrl) {
    updateData.trackingUrl = metadata.trackingUrl;
  }
  if (metadata?.notes) {
    updateData.notes = metadata.notes;
  }

  // Set timestamps based on status
  if (status === OrderStatus.SHIPPED && !updateData.shippedAt) {
    updateData.shippedAt = new Date();
  }
  if (status === OrderStatus.DELIVERED && !updateData.deliveredAt) {
    updateData.deliveredAt = new Date();
  }

  return prisma.order.update({
    where: { id: orderId },
    data: updateData,
  });
}

export async function cancelOrder(orderId: string, reason?: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    throw new Error('Order not found');
  }

  if (order.status !== OrderStatus.PENDING && order.status !== OrderStatus.PROCESSING) {
    throw new Error('Only pending or processing orders can be cancelled');
  }

  return prisma.order.update({
    where: { id: orderId },
    data: {
      status: OrderStatus.CANCELLED,
      notes: reason || 'Order cancelled by customer',
    },
  });
}

export async function getOrderTracking(orderNumber: string) {
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    select: {
      orderNumber: true,
      status: true,
      trackingNumber: true,
      trackingUrl: true,
      createdAt: true,
      shippedAt: true,
      deliveredAt: true,
    },
  });

  if (!order) {
    return null;
  }

  return {
    ...order,
    statusHistory: generateStatusHistory(order),
  };
}

function generateStatusHistory(order: any) {
  const history = [
    {
      status: 'Order Placed',
      date: order.createdAt,
      completed: true,
    },
  ];

  if (order.status !== OrderStatus.CANCELLED) {
    history.push({
      status: 'Processing',
      date: order.createdAt,
      completed: [OrderStatus.PROCESSING, OrderStatus.PAID, OrderStatus.SHIPPED, OrderStatus.DELIVERED].includes(order.status),
    });

    history.push({
      status: 'Shipped',
      date: order.shippedAt,
      completed: [OrderStatus.SHIPPED, OrderStatus.DELIVERED].includes(order.status),
    });

    history.push({
      status: 'Delivered',
      date: order.deliveredAt,
      completed: order.status === OrderStatus.DELIVERED,
    });
  } else {
    history.push({
      status: 'Cancelled',
      date: order.updatedAt,
      completed: true,
    });
  }

  return history;
}
