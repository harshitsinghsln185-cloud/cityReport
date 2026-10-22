import api from './api';

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  baseFeePaise: number;
  isActive: boolean;
  icon: string;
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

export const categoryService = {
  // Public endpoint for active categories
  async getActiveCategories(): Promise<Category[]> {
    const response = await api.get<{ success: boolean; data: Category[] }>('/categories');
    return response.data.data;
  },

  // Admin paginated categories
  async getAdminCategories(params?: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean | string;
  }): Promise<AdminCategoriesResponse> {
    const response = await api.get<AdminCategoriesResponse>('/admin/categories', { params });
    return response.data;
  },

  // Admin create category
  async createCategory(payload: CreateCategoryPayload): Promise<Category> {
    const response = await api.post<{ success: boolean; data: Category }>('/admin/categories', payload);
    return response.data.data;
  },

  // Admin update category
  async updateCategory(id: string, payload: UpdateCategoryPayload): Promise<Category> {
    const response = await api.put<{ success: boolean; data: Category }>(`/admin/categories/${id}`, payload);
    return response.data.data;
  },

  // Admin toggle active status
  async toggleCategoryStatus(id: string, isActive: boolean): Promise<Category> {
    const response = await api.patch<{ success: boolean; data: Category }>(`/admin/categories/${id}/status`, {
      isActive,
    });
    return response.data.data;
  },
};

export default categoryService;
