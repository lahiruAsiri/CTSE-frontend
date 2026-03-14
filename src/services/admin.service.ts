import { apiClient } from './apiClient';

export const adminService = {
  getAllUsers: async () => {
    const res = await apiClient.get('/api/admin-admin/users');
    return res.data.map((u: any) => ({
      ...u,
      role: u.role?.name || (u.roleId === 3 ? 'ADMIN' : 'USER')
    }));
  },
  
  updateUserRole: async (userId: number, role: 'USER' | 'ADMIN') => {
    const res = await apiClient.patch(`/api/admin-admin/users/${userId}/role`, { role });
    return res.data;
  },

  createProduct: async (data: any) => {
    const res = await apiClient.post('/api/product-products', data);
    return res.data;
  },

  updateProduct: async (id: number, data: any) => {
    const res = await apiClient.patch(`/api/product-products/${id}`, data);
    return res.data;
  },

  deleteProduct: async (id: number) => {
    const res = await apiClient.delete(`/api/product-products/${id}`);
    return res.data;
  },

  getAllOrders: async () => {
    const res = await apiClient.get('/api/order-admin');
    return res.data;
  },

  updateOrderStatus: async (orderId: number, status: string) => {
    const res = await apiClient.patch(`/api/order-admin/${orderId}/status`, { status });
    return res.data;
  },

  getAuditLogs: async () => {
    const res = await apiClient.get('/api/notif-admin/audit-logs');
    return res.data;
  }
};
