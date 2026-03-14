import { apiClient } from './apiClient';

export interface UserProfile {
  id: number;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
}

export const authService = {
  login: async (data: any) => {
    const res = await apiClient.post('/api/admin-auth/login', data);
    return res.data; // Expected { access_token }
  },

  register: async (data: any) => {
    const res = await apiClient.post('/api/admin-auth/register', data);
    return res.data;
  },

  getProfile: async (): Promise<UserProfile> => {
    const res = await apiClient.get('/api/admin-users/profile');
    const user = res.data;
    const roleStr = user.role?.name || (user.roleId === 3 ? 'ADMIN' : 'USER');
    const name = user.profile?.name || user.name || 'User';
    return { ...user, role: roleStr, name };
  },
};
