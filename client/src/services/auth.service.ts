import api, { ApiResponse } from './api';

export interface Address {
  street: string;
  city: string;
  state: string;
  pincode: string;
}

export interface AuthUser {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  role: 'User' | 'Resolver' | 'Admin';
  address?: Address;
  isEmailVerified?: boolean;
  photo?: {
    url: string;
    publicId: string;
  } | null;
  resolverStatus?: 'Pending' | 'Approved' | 'Rejected';
  rejectionReason?: string;
  createdAt?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  address: Address;
}

export const authService = {
  login: async (credentials: LoginPayload): Promise<ApiResponse<{ user: AuthUser }>> => {
    return api.post('/auth/login', credentials);
  },

  register: async (payload: RegisterPayload): Promise<ApiResponse<{ userId: string; email: string }>> => {
    return api.post('/auth/register', payload);
  },

  logout: async (): Promise<ApiResponse<null>> => {
    return api.post('/auth/logout');
  },

  getMe: async (): Promise<ApiResponse<{ user: AuthUser }>> => {
    return api.get('/auth/me');
  },

  verifyEmail: async (token: string): Promise<ApiResponse<null>> => {
    return api.post('/auth/verify-email', { token });
  },

  forgotPassword: async (email: string): Promise<ApiResponse<null>> => {
    return api.post('/auth/forgot-password', { email });
  },

  resetPassword: async (token: string, newPassword: string): Promise<ApiResponse<null>> => {
    return api.post('/auth/reset-password', { token, newPassword });
  },
};

export default authService;
