import api from './api';
import { AuthUser } from './auth.service';
import { Category } from './category.service';
import { FileAsset } from './user.service';

export interface ResolverProfile {
  _id: string;
  user: AuthUser;
  status: 'Pending' | 'Approved' | 'Rejected';
  rejectionReason?: string | null;
  idProof: FileAsset;
  idProofSignedUrl?: string;
  skills: Category[];
  serviceLocation: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  serviceAddress: string;
  serviceRadiusKm: number;
  isAvailable: boolean;
  totalEarningsPaise: number;
  pendingPayoutPaise: number;
  completedTasksCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminResolversResponse {
  success: boolean;
  data: ResolverProfile[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UpdateResolverSettingsPayload {
  serviceRadiusKm?: number;
  isAvailable?: boolean;
  skills?: string[];
}

export const resolverService = {
  // Public resolver onboarding
  async register(formData: FormData): Promise<{ userId: string; profileId: string }> {
    const response = await api.post<{
      success: boolean;
      message: string;
      data: { userId: string; profileId: string };
    }>('/resolvers/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },

  // Resolver: fetch my own profile
  async getMe(): Promise<ResolverProfile> {
    const response = await api.get<{ success: boolean; data: ResolverProfile }>('/resolvers/me');
    return response.data.data;
  },

  // Resolver: update availability, radius, or skills
  async updateSettings(payload: UpdateResolverSettingsPayload): Promise<ResolverProfile> {
    const response = await api.patch<{ success: boolean; data: ResolverProfile }>(
      '/resolvers/me',
      payload
    );
    return response.data.data;
  },

  // Admin: list resolver applications
  async adminListResolvers(params?: {
    status?: 'Pending' | 'Approved' | 'Rejected';
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<AdminResolversResponse> {
    const response = await api.get<AdminResolversResponse>('/admin/resolvers', { params });
    return response.data;
  },

  // Admin: get single application with signed ID proof URL
  async adminGetResolver(id: string): Promise<ResolverProfile> {
    const response = await api.get<{ success: boolean; data: ResolverProfile }>(
      `/admin/resolvers/${id}`
    );
    return response.data.data;
  },

  // Admin: approve resolver
  async adminApprove(id: string): Promise<ResolverProfile> {
    const response = await api.patch<{ success: boolean; message: string; data: ResolverProfile }>(
      `/admin/resolvers/${id}/approve`
    );
    return response.data.data;
  },

  // Admin: reject resolver with reason
  async adminReject(id: string, reason: string): Promise<ResolverProfile> {
    const response = await api.patch<{ success: boolean; message: string; data: ResolverProfile }>(
      `/admin/resolvers/${id}/reject`,
      { reason }
    );
    return response.data.data;
  },
};

export default resolverService;
