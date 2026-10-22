import api from './api';
import { AuthUser } from './auth.service';

export interface FileAsset {
  publicId: string;
  url: string;
  resourceType: string;
  format: string;
  bytes: number;
  width?: number;
  height?: number;
  accessType: 'public' | 'authenticated';
}

export interface UserProfile extends AuthUser {
  photo?: FileAsset | null;
  address?: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  isBlocked?: boolean;
}

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
}

export const userService = {
  // Get active user profile
  async getProfile(): Promise<UserProfile> {
    const response = await api.get<{ success: boolean; data: UserProfile }>('/users/me');
    return response.data.data;
  },

  // Update profile text fields
  async updateProfile(payload: UpdateProfilePayload): Promise<UserProfile> {
    const response = await api.patch<{ success: boolean; message: string; data: UserProfile }>(
      '/users/me',
      payload
    );
    return response.data.data;
  },

  // Upload or replace profile photo
  async uploadPhoto(file: File): Promise<{ photo: FileAsset }> {
    const formData = new FormData();
    formData.append('photo', file);

    const response = await api.put<{ success: boolean; message: string; data: { photo: FileAsset } }>(
      '/users/me/photo',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  },

  // Remove profile photo
  async deletePhoto(): Promise<void> {
    await api.delete('/users/me/photo');
  },
};

export default userService;
