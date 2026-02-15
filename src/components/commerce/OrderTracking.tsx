'use client';

import { useEffect, useState } from 'react';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';

interface OrderTrackingProps {
  orderNumber: string;
}

interface TrackingData {
  orderNumber: string;
  status: string;
  trackingNumber?: string;
  trackingUrl?: string;
  statusHistory: Array<{
    status: string;
    date?: Date;
    completed: boolean;
  }>;
}

export function OrderTracking({ orderNumber }: OrderTrackingProps) {
  const [tracking, setTracking] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTracking();
  }, [orderNumber]);

  const loadTracking = async () => {
    try {
      const response = await fetch(
        `/api/orders/track?orderNumber=${orderNumber}`
      );

      if (response.ok) {
        const data = await response.json();
        setTracking(data);
      } else {
        setError('Order not found');
      }
    } catch (err) {
      console.error('Error loading tracking:', err);
      setError('Failed to load tracking information');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin w-12 h-12 border-4 border-gray-200 border-t-black rounded-full mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading tracking information...</p>
      </div>
    );
  }

  if (error || !tracking) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <p className="text-gray-500">{error || 'Order not found'}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">
          Order #{tracking.orderNumber}
        </h2>
        <p className="text-gray-600">
          Status: <span className="font-semibold">{tracking.status}</span>
        </p>
      </div>

      {tracking.trackingNumber && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold mb-2">Tracking Information</h3>
          <p className="text-sm mb-3">
            Tracking Number: <span className="font-mono">{tracking.trackingNumber}</span>
          </p>
          {tracking.trackingUrl && (
            <a
              href={tracking.trackingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Track with Carrier
            </a>
          )}
        </div>
      )}

      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Order Progress</h3>
        
        <div className="relative">
          {tracking.statusHistory.map((item, index) => (
            <div key={index} className="flex gap-4 pb-8 last:pb-0">
              {/* Timeline Line */}
              {index < tracking.statusHistory.length - 1 && (
                <div
                  className={`absolute left-6 top-12 w-0.5 h-full ${
                    item.completed ? 'bg-black' : 'bg-gray-200'
                  }`}
                  style={{ marginTop: '-0.5rem' }}
                />
              )}

              {/* Status Icon */}
              <div
                className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center ${
                  item.completed
                    ? 'bg-black text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {item.status === 'Order Placed' && <Package className="w-6 h-6" />}
                {item.status === 'Processing' && <Clock className="w-6 h-6" />}
                {item.status === 'Shipped' && <Truck className="w-6 h-6" />}
                {item.status === 'Delivered' && <CheckCircle className="w-6 h-6" />}
                {item.status === 'Cancelled' && <span className="text-2xl">×</span>}
              </div>

              {/* Status Details */}
              <div className="flex-1 pt-2">
                <h4 className={`font-semibold ${item.completed ? '' : 'text-gray-400'}`}>
                  {item.status}
                </h4>
                {item.date && (
                  <p className="text-sm text-gray-600">
                    {new Date(item.date).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
