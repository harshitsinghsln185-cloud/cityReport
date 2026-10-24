import { api, ApiResponse } from './api';

export interface PublicTimelineItem {
  action: string;
  fromStatus: string;
  toStatus: string;
  remarks?: string;
  createdAt: string;
}

export interface PublicTrackData {
  issueCode: string;
  status: string;
  title: string;
  description: string;
  category: {
    name: string;
    slug: string;
  };
  city: string;
  pincode: string;
  suggestedPriority: string;
  createdAt: string;
  updatedAt: string;
  imagesCount: number;
  timeline: PublicTimelineItem[];
}

export interface QuerySubmissionPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface QueryItem {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'Pending' | 'Replied';
  reply?: string | null;
  repliedBy?: {
    _id: string;
    name: string;
    email: string;
  } | null;
  repliedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const publicService = {
  trackIssue: async (issueCode: string): Promise<PublicTrackData> => {
    const res = await api.get<any, ApiResponse<PublicTrackData>>(`/track/${encodeURIComponent(issueCode.trim())}`);
    return res.data!;
  },

  submitQuery: async (payload: QuerySubmissionPayload): Promise<{ queryId: string; status: string }> => {
    const res = await api.post<any, ApiResponse<{ queryId: string; status: string }>>('/queries', payload);
    return res.data!;
  },

  getAdminQueries: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<{ queries: QueryItem[]; meta: PaginationMeta }> => {
    const res = await api.get<any, any>('/admin/queries', { params });
    return {
      queries: (res.data || []) as QueryItem[],
      meta: (res.meta || { page: 1, limit: 10, total: 0, totalPages: 1 }) as PaginationMeta,
    };
  },

  replyAdminQuery: async (id: string, reply: string): Promise<QueryItem> => {
    const res = await api.patch<any, ApiResponse<QueryItem>>(`/admin/queries/${id}/reply`, { reply });
    return res.data!;
  },
};

export default publicService;
