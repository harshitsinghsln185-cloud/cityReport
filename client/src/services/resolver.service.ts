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
    const response: any = await api.post('/resolvers/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response?.data !== undefined ? response.data : response;
  },

  // Resolver: fetch my own profile
  async getMe(): Promise<ResolverProfile> {
    const response: any = await api.get('/resolvers/me');
    return response?.data !== undefined ? response.data : response;
  },

  // Resolver: update availability, radius, or skills
  async updateSettings(payload: UpdateResolverSettingsPayload): Promise<ResolverProfile> {
    const response: any = await api.patch('/resolvers/me', payload);
    return response?.data !== undefined ? response.data : response;
  },

  // Admin: list resolver applications
  async adminListResolvers(params?: {
    status?: 'Pending' | 'Approved' | 'Rejected';
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<AdminResolversResponse> {
    const response: any = await api.get('/admin/resolvers', { params });
    const list = Array.isArray(response?.data)
      ? response.data
      : Array.isArray(response)
      ? response
      : [];
    const meta = response?.meta || {
      page: params?.page || 1,
      limit: params?.limit || 20,
      total: list.length,
      totalPages: Math.ceil(list.length / (params?.limit || 20)) || 1,
    };
    return {
      success: response?.success ?? true,
      data: list,
      meta,
    };
  },

  // Admin: get single application with signed ID proof URL
  async adminGetResolver(id: string): Promise<ResolverProfile> {
    const response: any = await api.get(`/admin/resolvers/${id}`);
    return response?.data !== undefined ? response.data : response;
  },

  // Admin: approve resolver
  async adminApprove(id: string): Promise<ResolverProfile> {
    const response: any = await api.patch(`/admin/resolvers/${id}/approve`);
    return response?.data !== undefined ? response.data : response;
  },

  // Admin: reject resolver with reason
  async adminReject(id: string, reason: string): Promise<ResolverProfile> {
    const response: any = await api.patch(`/admin/resolvers/${id}/reject`, { reason });
    return response?.data !== undefined ? response.data : response;
  },
};

export default resolverService;
