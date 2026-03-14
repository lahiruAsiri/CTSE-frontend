import { apiClient } from './apiClient';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number;
  imageUrl?: string;
  category?: Category;
  isTrending?: boolean;
}

export interface Category {
  id: number;
  name: string;
  description: string;
}

export const productService = {
  getAllProducts: async (): Promise<Product[]> => {
    const res = await apiClient.get('/api/product-products');
    return res.data;
  },

  getProductById: async (id: number): Promise<Product> => {
    const res = await apiClient.get(`/api/product-products/${id}`);
    return res.data;
  },

  getAllCategories: async (): Promise<Category[]> => {
    const res = await apiClient.get('/api/product-categories');
    return res.data;
  },

  createCategory: async (data: any): Promise<Category> => {
    const res = await apiClient.post('/api/product-categories', data);
    return res.data;
  },

  updateCategory: async (id: number, data: any): Promise<Category> => {
    const res = await apiClient.patch(`/api/product-categories/${id}`, data);
    return res.data;
  },

  deleteCategory: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/product-categories/${id}`);
  },
};
