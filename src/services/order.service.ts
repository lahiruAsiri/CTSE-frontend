import { apiClient } from './apiClient';

export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
}

export const orderService = {
  getCart: async (): Promise<CartItem[]> => {
    const res = await apiClient.get('/api/order-cart');
    return res.data;
  },

  addToCart: async (productId: number, quantity: number = 1) => {
    const res = await apiClient.post('/api/order-cart/add', { productId, quantity });
    return res.data;
  },

  removeFromCart: async (cartItemId: number) => {
    const res = await apiClient.delete(`/api/order-cart/${cartItemId}`);
    return res.data;
  },

  updateQuantity: async (cartItemId: number, quantity: number) => {
    const res = await apiClient.patch(`/api/order-cart/${cartItemId}/quantity`, { quantity });
    return res.data;
  },

  checkout: async () => {
    const res = await apiClient.post('/api/order-orders/checkout');
    return res.data;
  },

  getOrderHistory: async () => {
    const res = await apiClient.get('/api/order-orders/history');
    return res.data;
  }
};
