import { apiClient } from './apiClient';

export interface Notification {
  id: number;
  userId: number;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export const notificationService = {
  getMyInbox: async (): Promise<Notification[]> => {
    const res = await apiClient.get('/api/notif-notifications/my-inbox');
    return res.data;
  },

  markAsRead: async (id: number) => {
    const res = await apiClient.patch(`/api/notif-notifications/${id}/read`);
    return res.data;
  }
};
