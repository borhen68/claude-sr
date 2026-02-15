'use client';

import { useEffect, useState } from 'react';
import { Package, Truck, CheckCircle } from 'lucide-react';
import { OrderStatus } from '@prisma/client';

interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  amount: number;
  currency: string;
  createdAt: string;
  items: Array<{
    productName: string;
    quantity: number;
  }>;
}

interface OrderHistoryProps {
  userId: string;
}

export function OrderHistory({ userId }: OrderHistoryProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, [userId]);

  const loadOrders = async () => {
    try {
      const response = await fetch('/api/orders', {
        headers: {
          'x-user-id': userId,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'DELIVERED':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'SHIPPED':
        return <Truck className="w-5 h-5 text-blue-600" />;
      default:
        return <Package className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'DELIVERED':
        return 'text-green-600 bg-green-50';
      case 'SHIPPED':
        return 'text-blue-600 bg-blue-50';
      case 'PAID':
      case 'PROCESSING':
        return 'text-yellow-600 bg-yellow-50';
      case 'CANCELLED':
      case 'REFUNDED':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <p className="text-gray-500 text-lg mb-4">No orders yet</p>
        <a
          href="/pricing"
          className="inline-block px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800"
        >
          Start Shopping
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order.id}
          className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                {getStatusIcon(order.status)}
                <h3 className="font-semibold text-lg">
                  Order #{order.orderNumber}
                </h3>
              </div>
              <p className="text-sm text-gray-600">
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold">
                ${order.amount.toFixed(2)}
              </p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  order.status
                )}`}
              >
                {order.status}
              </span>
            </div>
          </div>

          <div className="border-t pt-4 mb-4">
            <h4 className="text-sm font-semibold mb-2">Items</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {order.items.map((item, i) => (
                <li key={i}>
                  {item.productName} × {item.quantity}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-3">
            <a
              href={`/orders/${order.orderNumber}`}
              className="px-4 py-2 border border-black rounded-lg hover:bg-gray-100 text-sm"
            >
              View Details
            </a>
            {(order.status === OrderStatus.SHIPPED || order.status === OrderStatus.DELIVERED) && (
              <a
                href={`/orders/track?orderNumber=${order.orderNumber}`}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 text-sm"
              >
                Track Order
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
