import { create } from 'zustand';
import { orderService, CartItem } from '@/services/order.service';

interface CartState {
  items: CartItem[];
  totalCount: number;
  loading: boolean;
  fetchCart: () => Promise<void>;
  addItem: (productId: number, quantity?: number) => Promise<void>;
  removeItem: (cartItemId: number) => Promise<void>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  totalCount: 0,
  loading: false,

  fetchCart: async () => {
    set({ loading: true });
    try {
      const items = await orderService.getCart();
      const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
      set({ items, totalCount, loading: false });
    } catch (error) {
      set({ loading: false });
      console.error('Failed to fetch cart:', error);
    }
  },

  addItem: async (productId: number, quantity: number = 1) => {
    try {
      await orderService.addToCart(productId, quantity);
      await get().fetchCart();
    } catch (error) {
      console.error('Failed to add to cart:', error);
      throw error;
    }
  },

  removeItem: async (cartItemId: number) => {
    try {
      await orderService.removeFromCart(cartItemId);
      await get().fetchCart();
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      throw error;
    }
  },

  updateQuantity: async (cartItemId: number, quantity: number) => {
    try {
      if (quantity <= 0) {
        await get().removeItem(cartItemId);
      } else {
        await orderService.updateQuantity(cartItemId, quantity);
        await get().fetchCart();
      }
    } catch (error) {
      console.error('Failed to update quantity:', error);
      throw error;
    }
  },

  clearCart: () => set({ items: [], totalCount: 0 }),
}));
