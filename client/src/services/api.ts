import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  errors?: Array<{ field?: string; message: string }>;
  code?: string;
}

export const getCookie = (name: string): string | null => {
  const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
  return match ? decodeURIComponent(match[3]) : null;
};

export const api: AxiosInstance = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to automatically attach CSRF token header
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const csrfToken = getCookie('XSRF-TOKEN');
  if (csrfToken && config.headers) {
    config.headers['X-CSRF-Token'] = csrfToken;
  }
  return config;
});

// Ensure CSRF token is fetched once on client initialization
export const ensureCsrfToken = async (): Promise<string | null> => {
  try {
    const existing = getCookie('XSRF-TOKEN');
    if (existing) return existing;

    const res = await axios.get<ApiResponse<{ csrfToken: string }>>('/api/auth/csrf-token', {
      withCredentials: true,
    });
    return res.data.data?.csrfToken || null;
  } catch {
    return null;
  }
};

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: boolean = false) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  async (error: AxiosError<ApiResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Avoid infinite loops for login, refresh or logout
    const isAuthRoute =
      originalRequest?.url?.includes('/auth/login') ||
      originalRequest?.url?.includes('/auth/refresh') ||
      originalRequest?.url?.includes('/auth/logout');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axios.post('/api/auth/refresh', {}, { withCredentials: true });
        processQueue(null, true);
        return api(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, false);
        return Promise.reject(error.response?.data || error);
      } finally {
        isRefreshing = false;
      }
    }

    const errorPayload: ApiResponse = error.response?.data || {
      success: false,
      message: error.message || 'An unexpected network error occurred.',
    };
    return Promise.reject(errorPayload);
  }
);

export default api;
