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
  _id?: string;
  photo?: FileAsset | null;
  address?: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  isBlocked?: boolean;
  blockReason?: string | null;
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
    const response: any = await api.get('/users/me');
    return response?.data !== undefined ? response.data : response;
  },

  // Update profile text fields
  async updateProfile(payload: UpdateProfilePayload): Promise<UserProfile> {
    const response: any = await api.patch('/users/me', payload);
    return response?.data !== undefined ? response.data : response;
  },

  // Upload or replace profile photo
  async uploadPhoto(file: File): Promise<{ photo: FileAsset }> {
    const formData = new FormData();
    formData.append('photo', file);

    const response: any = await api.put('/users/me/photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response?.data !== undefined ? response.data : response;
  },

  // Remove profile photo
  async deletePhoto(): Promise<void> {
    await api.delete('/users/me/photo');
  },
};

export default userService;
