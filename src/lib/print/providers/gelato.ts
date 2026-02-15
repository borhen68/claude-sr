/**
 * Gelato API Integration
 * Backup print provider with global reach
 */

import {
  GelatoProduct,
  GelatoOrder,
  GelatoOrderItem,
  GelatoAddress,
  OrderStatus,
} from '../types';

export class GelatoClient {
  private apiKey: string;
  private baseUrl = 'https://api.gelato.com/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'X-API-KEY': this.apiKey,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Gelato API error: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get available products
   */
  async getProducts(): Promise<GelatoProduct[]> {
    const response = await this.request('/products');
    return response.products;
  }

  /**
   * Get product details
   */
  async getProduct(productUid: string): Promise<GelatoProduct> {
    return this.request(`/products/${productUid}`);
  }

  /**
   * Create an order
   */
  async createOrder(order: {
    orderReferenceId: string;
    items: Array<{
      productUid: string;
      quantity: number;
      files: Array<{ url: string; type: string }>;
    }>;
    shippingAddress: GelatoAddress;
  }): Promise<GelatoOrder> {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify({
        orderReferenceId: order.orderReferenceId,
        items: order.items.map(item => ({
          productUid: item.productUid,
          quantity: item.quantity,
          files: item.files.map(f => ({
            url: f.url,
            type: f.type,
          })),
        })),
        shippingAddress: order.shippingAddress,
      }),
    });
  }

  /**
   * Get order status
   */
  async getOrder(orderId: string): Promise<GelatoOrder> {
    return this.request(`/orders/${orderId}`);
  }

  /**
   * Get shipping quote
   */
  async getShippingQuote(params: {
    productUid: string;
    quantity: number;
    destinationCountry: string;
  }): Promise<any> {
    return this.request('/shipping/quote', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  /**
   * Convert Gelato status to our internal status
   */
  static mapStatus(gelatoStatus: string): OrderStatus {
    const statusMap: Record<string, OrderStatus> = {
      'draft': 'draft',
      'created': 'pending',
      'processing': 'processing',
      'production': 'printing',
      'shipped': 'shipped',
      'delivered': 'delivered',
      'error': 'failed',
      'cancelled': 'cancelled',
    };

    return statusMap[gelatoStatus] || 'pending';
  }

  /**
   * Common photobook products (example UIDs - check actual catalog)
   */
  static readonly PHOTOBOOK_PRODUCTS = {
    HARDCOVER_A4: 'photobook_hardcover_a4_portrait',
    HARDCOVER_SQUARE: 'photobook_hardcover_square_210',
    SOFTCOVER_A4: 'photobook_softcover_a4_portrait',
    SOFTCOVER_SQUARE: 'photobook_softcover_square_210',
  };
}
