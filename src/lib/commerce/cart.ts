import { CartItem } from './types';

const CART_STORAGE_KEY = 'frametale_cart';

export class CartManager {
  private static instance: CartManager;
  
  private constructor() {}
  
  static getInstance(): CartManager {
    if (!CartManager.instance) {
      CartManager.instance = new CartManager();
    }
    return CartManager.instance;
  }

  // Get cart from localStorage
  getCart(): CartItem[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const cart = localStorage.getItem(CART_STORAGE_KEY);
      return cart ? JSON.parse(cart) : [];
    } catch (error) {
      console.error('Error reading cart:', error);
      return [];
    }
  }

  // Save cart to localStorage
  private saveCart(cart: CartItem[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      // Dispatch custom event for cart updates
      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart }));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  }

  // Add item to cart
  addItem(item: Omit<CartItem, 'id'>): CartItem {
    const cart = this.getCart();
    const newItem: CartItem = {
      ...item,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    
    cart.push(newItem);
    this.saveCart(cart);
    return newItem;
  }

  // Update item quantity
  updateQuantity(itemId: string, quantity: number): void {
    const cart = this.getCart();
    const itemIndex = cart.findIndex(item => item.id === itemId);
    
    if (itemIndex >= 0) {
      if (quantity <= 0) {
        cart.splice(itemIndex, 1);
      } else {
        cart[itemIndex].quantity = quantity;
      }
      this.saveCart(cart);
    }
  }

  // Remove item from cart
  removeItem(itemId: string): void {
    const cart = this.getCart();
    const filtered = cart.filter(item => item.id !== itemId);
    this.saveCart(filtered);
  }

  // Clear entire cart
  clearCart(): void {
    this.saveCart([]);
  }

  // Get cart item count
  getItemCount(): number {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
  }

  // Calculate cart subtotal
  getSubtotal(): number {
    const cart = this.getCart();
    return cart.reduce((total, item) => {
      return total + (item.unitPrice * item.quantity);
    }, 0);
  }

  // Merge with server cart (for logged-in users)
  async mergeWithServerCart(serverCart: CartItem[]): Promise<void> {
    const localCart = this.getCart();
    
    // Simple merge: add server items that don't exist locally
    const merged = [...localCart];
    
    for (const serverItem of serverCart) {
      const exists = merged.some(item => 
        item.productType === serverItem.productType &&
        item.productName === serverItem.productName &&
        JSON.stringify(item.options) === JSON.stringify(serverItem.options)
      );
      
      if (!exists) {
        merged.push(serverItem);
      }
    }
    
    this.saveCart(merged);
  }
}

// Export singleton instance
export const cartManager = CartManager.getInstance();
