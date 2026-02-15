import { prisma } from '@/lib/prisma';
import { OrderStatus, PromoType } from '@prisma/client';
import { updateOrderStatus } from './orders';
import { sendShippingNotificationEmail } from './email';

/**
 * Admin utilities for managing the e-commerce system
 * These should be protected by admin authentication in production
 */

// Get all orders with filters
export async function getAllOrders(filters?: {
  status?: OrderStatus;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
}) {
  const where: any = {};
  
  if (filters?.status) {
    where.status = filters.status;
  }
  
  if (filters?.startDate || filters?.endDate) {
    where.createdAt = {};
    if (filters.startDate) {
      where.createdAt.gte = filters.startDate;
    }
    if (filters.endDate) {
      where.createdAt.lte = filters.endDate;
    }
  }

  return prisma.order.findMany({
    where,
    include: {
      items: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      shippingAddress: true,
    },
    orderBy: { createdAt: 'desc' },
    take: filters?.limit || 100,
  });
}

// Mark order as shipped and send notification
export async function shipOrder(
  orderId: string,
  trackingNumber: string,
  trackingUrl?: string
) {
  await updateOrderStatus(orderId, OrderStatus.SHIPPED, {
    trackingNumber,
    trackingUrl,
  });

  await sendShippingNotificationEmail(orderId);
}

// Get sales statistics
export async function getSalesStats(startDate?: Date, endDate?: Date) {
  const where: any = {
    status: {
      in: [OrderStatus.PAID, OrderStatus.SHIPPED, OrderStatus.DELIVERED],
    },
  };

  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = startDate;
    if (endDate) where.createdAt.lte = endDate;
  }

  const orders = await prisma.order.findMany({ where });

  const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
  const totalOrders = orders.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Count by status
  const byStatus = await prisma.order.groupBy({
    by: ['status'],
    _count: true,
    where,
  });

  // Top products
  const items = await prisma.orderItem.groupBy({
    by: ['productName'],
    _count: true,
    _sum: {
      totalPrice: true,
    },
    orderBy: {
      _count: {
        productName: 'desc',
      },
    },
    take: 10,
  });

  return {
    totalRevenue,
    totalOrders,
    averageOrderValue,
    ordersByStatus: byStatus.map(s => ({
      status: s.status,
      count: s._count,
    })),
    topProducts: items.map(i => ({
      name: i.productName,
      quantity: i._count,
      revenue: i._sum.totalPrice || 0,
    })),
  };
}

// Get active promo codes
export async function getActivePromoCodes() {
  const now = new Date();
  
  return prisma.promoCode.findMany({
    where: {
      active: true,
      OR: [
        { validFrom: null, validUntil: null },
        { validFrom: { lte: now }, validUntil: { gte: now } },
        { validFrom: null, validUntil: { gte: now } },
        { validFrom: { lte: now }, validUntil: null },
      ],
    },
    orderBy: { createdAt: 'desc' },
  });
}

// Deactivate promo code
export async function deactivatePromoCode(code: string) {
  return prisma.promoCode.update({
    where: { code: code.toUpperCase() },
    data: { active: false },
  });
}

// Get low-stock alerts (for products tracked in inventory)
// This is a placeholder - you'd need to add inventory tracking to implement
export async function getLowStockAlerts() {
  // TODO: Implement inventory tracking
  return [];
}

// Bulk update order status
export async function bulkUpdateOrderStatus(
  orderIds: string[],
  status: OrderStatus
) {
  return prisma.order.updateMany({
    where: {
      id: { in: orderIds },
    },
    data: { status },
  });
}

// Export orders to CSV
export async function exportOrdersToCSV(
  startDate?: Date,
  endDate?: Date
): Promise<string> {
  const where: any = {};
  
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = startDate;
    if (endDate) where.createdAt.lte = endDate;
  }

  const orders = await prisma.order.findMany({
    where,
    include: {
      items: true,
      shippingAddress: true,
      user: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const headers = [
    'Order Number',
    'Date',
    'Customer Name',
    'Customer Email',
    'Status',
    'Items',
    'Subtotal',
    'Shipping',
    'Tax',
    'Discount',
    'Total',
    'Tracking Number',
  ];

  const rows = orders.map(order => [
    order.orderNumber,
    new Date(order.createdAt).toLocaleDateString(),
    order.customerName,
    order.customerEmail,
    order.status,
    order.items.map(i => `${i.productName} x${i.quantity}`).join('; '),
    order.subtotal.toFixed(2),
    order.shipping.toFixed(2),
    order.tax.toFixed(2),
    order.discount.toFixed(2),
    order.amount.toFixed(2),
    order.trackingNumber || '',
  ]);

  const csv = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');

  return csv;
}
