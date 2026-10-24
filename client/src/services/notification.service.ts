import { api, ApiResponse } from './api';

export type NotificationType =
  | 'ISSUE'
  | 'PAYMENT'
  | 'ASSIGNMENT'
  | 'SYSTEM'
  | 'PAYOUT'
  | 'REWORK'
  | 'VERIFICATION';

export interface NotificationItem {
  _id: string;
  recipient: string;
  title: string;
  message: string;
  type: NotificationType;
  link?: string | null;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const notificationService = {
  list: async (params?: {
    page?: number;
    limit?: number;
    isRead?: boolean;
    type?: string;
  }): Promise<{ notifications: NotificationItem[]; meta: PaginationMeta }> => {
    const res = await api.get<any, any>('/notifications', { params });
    return {
      notifications: (res.data || []) as NotificationItem[],
      meta: (res.meta || { page: 1, limit: 20, total: 0, totalPages: 1 }) as PaginationMeta,
    };
  },

  getUnreadCount: async (): Promise<number> => {
    const res = await api.get<any, ApiResponse<{ unreadCount: number }>>('/notifications/unread-count');
    return res.data?.unreadCount || 0;
  },

  markAsRead: async (id: string): Promise<NotificationItem> => {
    const res = await api.patch<any, ApiResponse<NotificationItem>>(`/notifications/${id}/read`);
    return res.data!;
  },

  markAllAsRead: async (): Promise<{ modifiedCount: number }> => {
    const res = await api.patch<any, ApiResponse<{ modifiedCount: number }>>('/notifications/read-all');
    return res.data!;
  },
};

export default notificationService;
