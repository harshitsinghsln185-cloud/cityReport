import api from './api';

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  baseFeePaise: number;
  isActive: boolean;
  icon: string;
  estimatedResolutionHours?: number;
  freeRadiusKm?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminCategoriesResponse {
  success: boolean;
  data: Category[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateCategoryPayload {
  name: string;
  slug: string;
  description: string;
  baseFeePaise: number;
  icon?: string;
}

export interface UpdateCategoryPayload {
  name?: string;
  description?: string;
  baseFeePaise?: number;
  icon?: string;
}

export const DEFAULT_CIVIC_CATEGORIES: Category[] = [
  {
    _id: '67c1c0a00000000000000001',
    name: 'Road damage & Potholes',
    slug: 'road-damage',
    description: 'Potholes, broken roads, damaged pavements, and street surface issues.',
    baseFeePaise: 60000,
    isActive: true,
    icon: 'road',
    estimatedResolutionHours: 48,
  },
  {
    _id: '67c1c0a00000000000000002',
    name: 'Water supply & Pipelines',
    slug: 'water-supply',
    description: 'Pipeline leakages, contaminated municipal supply, and low water pressure.',
    baseFeePaise: 40000,
    isActive: true,
    icon: 'droplet',
    estimatedResolutionHours: 24,
  },
  {
    _id: '67c1c0a00000000000000003',
    name: 'Drainage & Sewers',
    slug: 'drainage',
    description: 'Blocked sewers, overflowing drains, and rainwater stagnation.',
    baseFeePaise: 50000,
    isActive: true,
    icon: 'waves',
    estimatedResolutionHours: 36,
  },
  {
    _id: '67c1c0a00000000000000004',
    name: 'Streetlight & Electricity',
    slug: 'streetlight-electricity',
    description: 'Non-functional streetlights, dangling power cables, and open transformer hazards.',
    baseFeePaise: 35000,
    isActive: true,
    icon: 'zap',
    estimatedResolutionHours: 24,
  },
  {
    _id: '67c1c0a00000000000000005',
    name: 'Garbage & Sanitation',
    slug: 'garbage',
    description: 'Uncollected domestic waste, illegal dumping, and overflowing municipal bins.',
    baseFeePaise: 30000,
    isActive: true,
    icon: 'trash-2',
    estimatedResolutionHours: 24,
  },
  {
    _id: '67c1c0a00000000000000006',
    name: 'General Public Works',
    slug: 'other',
    description: 'General civic problems, illegal hoardings, park maintenance, and public property hazards.',
    baseFeePaise: 30000,
    isActive: true,
    icon: 'help-circle',
    estimatedResolutionHours: 48,
  },
];

export const categoryService = {
  // Public endpoint for active categories with graceful fallback
  async getActiveCategories(): Promise<Category[]> {
    try {
      const response: any = await api.get('/categories');
      const payload = response?.data !== undefined ? response.data : response;
      if (Array.isArray(payload) && payload.length > 0) return payload;
      if (Array.isArray(payload?.data) && payload.data.length > 0) return payload.data;
      return DEFAULT_CIVIC_CATEGORIES;
    } catch (err) {
      console.warn('Failed to get active categories from server, using verified fallback list:', err);
      return DEFAULT_CIVIC_CATEGORIES;
    }
  },

  // Admin paginated categories
  async getAdminCategories(params?: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean | string;
  }): Promise<AdminCategoriesResponse> {
    const response: any = await api.get('/admin/categories', { params });
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

  // Admin create category
  async createCategory(payload: CreateCategoryPayload): Promise<Category> {
    const response: any = await api.post('/admin/categories', payload);
    return response?.data !== undefined ? response.data : response;
  },

  // Admin update category
  async updateCategory(id: string, payload: UpdateCategoryPayload): Promise<Category> {
    const response: any = await api.put(`/admin/categories/${id}`, payload);
    return response?.data !== undefined ? response.data : response;
  },

  // Admin toggle active status
  async toggleCategoryStatus(id: string, isActive: boolean): Promise<Category> {
    const response: any = await api.patch(`/admin/categories/${id}/status`, {
      isActive,
    });
    return response?.data !== undefined ? response.data : response;
  },
};

export default categoryService;
