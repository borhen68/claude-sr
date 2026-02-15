/**
 * Printful API Integration
 * Product creation, order submission, and tracking
 */

import {
  PrintfulProduct,
  PrintfulOrder,
  PrintfulRecipient,
  PrintfulOrderItem,
  PrintOrder,
  OrderStatus,
} from '../types';

export class PrintfulClient {
  private apiKey: string;
  private baseUrl = 'https://api.printful.com';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Printful API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.result;
  }

  /**
   * Get available photobook products
   */
  async getProducts(): Promise<PrintfulProduct[]> {
    return this.request('/products');
  }

  /**
   * Get product details including variants
   */
  async getProduct(productId: number): Promise<PrintfulProduct> {
    return this.request(`/products/${productId}`);
  }

  /**
   * Create a new product (photobook with custom design)
   */
  async createProduct(data: {
    name: string;
    variantId: number;
    files: Array<{ url: string; type: string }>;
  }): Promise<PrintfulProduct> {
    return this.request('/sync/products', {
      method: 'POST',
      body: JSON.stringify({
        sync_product: {
          name: data.name,
          thumbnail: data.files[0]?.url,
        },
        sync_variants: [
          {
            variant_id: data.variantId,
            files: data.files,
          },
        ],
      }),
    });
  }

  /**
   * Submit an order for printing
   */
  async createOrder(order: {
    recipient: PrintfulRecipient;
    items: Array<{
      variantId: number;
      quantity: number;
      files: Array<{ url: string; type: string }>;
    }>;
  }): Promise<PrintfulOrder> {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify({
        recipient: order.recipient,
        items: order.items.map(item => ({
          variant_id: item.variantId,
          quantity: item.quantity,
          files: item.files,
        })),
      }),
    });
  }

  /**
   * Get order status
   */
  async getOrder(orderId: number): Promise<PrintfulOrder> {
    return this.request(`/orders/${orderId}`);
  }

  /**
   * Confirm and pay for an order
   */
  async confirmOrder(orderId: number): Promise<PrintfulOrder> {
    return this.request(`/orders/${orderId}/confirm`, {
      method: 'POST',
    });
  }

  /**
   * Cancel an order
   */
  async cancelOrder(orderId: number): Promise<void> {
    await this.request(`/orders/${orderId}`, {
      method: 'DELETE',
    });
  }

  /**
   * Get shipping rates
   */
  async getShippingRates(orderId: number): Promise<any> {
    return this.request(`/orders/${orderId}/shipping`);
  }

  /**
   * Convert Printful status to our internal status
   */
  static mapStatus(printfulStatus: string): OrderStatus {
    const statusMap: Record<string, OrderStatus> = {
      'draft': 'draft',
      'pending': 'pending',
      'failed': 'failed',
      'canceled': 'cancelled',
      'inprocess': 'processing',
      'onhold': 'pending',
      'partial': 'processing',
      'fulfilled': 'shipped',
    };

    return statusMap[printfulStatus] || 'pending';
  }

  /**
   * Common photobook product IDs (update based on catalog)
   */
  static readonly PHOTOBOOK_PRODUCTS = {
    HARDCOVER_8X8: 254,
    HARDCOVER_8X10: 255,
    SOFTCOVER_8X8: 256,
    SOFTCOVER_8X10: 257,
  };
}
