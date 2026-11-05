import api from './api';
import { CIVIC_TAXONOMY } from '../data/civicTaxonomy';

export interface SubCategory {
  name: string;
  slug: string;
  order: number;
  defaultPriority: 'Critical' | 'High' | 'Medium' | 'Low';
  isActive: boolean;
  imageKey?: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  baseFeePaise: number;
  isActive: boolean;
  icon: string;
  order?: number;
  estimatedResolutionHours?: number;
  freeRadiusKm?: number;
  subCategories?: SubCategory[];
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

export const DEFAULT_CIVIC_CATEGORIES: Category[] = CIVIC_TAXONOMY.map((item, idx) => ({
  _id: item._id || `civic_cat_${item.slug}`,
  name: item.name,
  slug: item.slug,
  description: item.description,
  baseFeePaise: item.baseFeePaise,
  isActive: true,
  icon: item.icon,
  order: item.order ?? idx + 1,
  estimatedResolutionHours: item.estimatedResolutionHours,
  freeRadiusKm: item.freeRadiusKm,
  subCategories: item.subCategories.map((s) => ({
    name: s.name,
    slug: s.slug,
    order: s.order,
    defaultPriority: s.defaultPriority,
    isActive: s.isActive !== false,
    imageKey: s.imageKey,
  })),
}));

export const categoryService = {
  // Public endpoint for active categories with graceful fallback
  async getActiveCategories(): Promise<Category[]> {
    try {
      const response: any = await api.get('/categories');
      const payload = response?.data !== undefined ? response.data : response;
      const rawList = Array.isArray(payload) && payload.length > 0
        ? payload
        : Array.isArray(payload?.data) && payload.data.length > 0
        ? payload.data
        : null;

      if (rawList && rawList.length > 0) {
        return rawList.map((cat: any) => {
          const match = CIVIC_TAXONOMY.find((t) => t.slug === cat.slug);
          const subs = Array.isArray(cat.subCategories) && cat.subCategories.length > 0
            ? cat.subCategories
            : match?.subCategories || [];
          return {
            ...cat,
            _id: cat._id || cat.id || `civic_cat_${cat.slug}`,
            subCategories: subs,
          };
        });
      }
      return DEFAULT_CIVIC_CATEGORIES;
    } catch (err) {
      console.warn('Failed to get active categories from server, using verified fallback list:', err);
      return DEFAULT_CIVIC_CATEGORIES;
    }
  },

  // Public endpoint for category detail by slug with fallback
  async getCategoryBySlug(slug: string): Promise<Category | null> {
    if (!slug) return null;
    const cleanSlug = slug.toLowerCase().trim();

    try {
      const response: any = await api.get(`/categories/${cleanSlug}`);
      const payload = response?.data !== undefined ? response.data : response;
      if (payload && payload.slug && payload.name) {
        const match = CIVIC_TAXONOMY.find((t) => t.slug === payload.slug);
        const subs = Array.isArray(payload.subCategories) && payload.subCategories.length > 0
          ? payload.subCategories
          : match?.subCategories || [];
        return {
          ...payload,
          subCategories: subs,
        };
      }
    } catch (err) {
      // Backend /api/categories/:slug may not be routed or reachable yet
    }

    const all = await this.getActiveCategories();
    const found = all.find((c) => c.slug === cleanSlug);
    if (found) return found;

    const taxMatch = CIVIC_TAXONOMY.find((t) => t.slug === cleanSlug);
    if (taxMatch) {
      return {
        _id: `civic_cat_${taxMatch.slug}`,
        name: taxMatch.name,
        slug: taxMatch.slug,
        description: taxMatch.description,
        baseFeePaise: taxMatch.baseFeePaise,
        isActive: true,
        icon: taxMatch.icon,
        order: taxMatch.order,
        estimatedResolutionHours: taxMatch.estimatedResolutionHours,
        freeRadiusKm: taxMatch.freeRadiusKm,
        subCategories: taxMatch.subCategories.map((s) => ({
          name: s.name,
          slug: s.slug,
          order: s.order,
          defaultPriority: s.defaultPriority,
          isActive: s.isActive !== false,
          imageKey: s.imageKey,
        })),
      };
    }

    return null;
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
