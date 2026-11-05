import React, { createContext, useState, useEffect, useCallback } from 'react';
import authService, { AuthUser, LoginPayload } from '../services/auth.service';
import { ensureCsrfToken, setStoredToken, setStoredCsrf } from '../services/api';

export interface AuthContextType {
  user: AuthUser | null;
  role: 'User' | 'Resolver' | 'Admin' | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginPayload) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = useCallback(async () => {
    try {
      const response: any = await authService.getMe();
      const user = response?.data?.user || response?.user || (response?.data?.email ? response.data : null);
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      // Pre-fetch CSRF token for double-submit cookie protection
      await ensureCsrfToken();
      await refreshUser();
    };

    initAuth();
  }, [refreshUser]);

  const login = async (credentials: LoginPayload): Promise<AuthUser> => {
    // Ensure CSRF token is in place before state-changing login
    await ensureCsrfToken();
    const rawRes: any = await authService.login(credentials);
    let res = rawRes;
    if (typeof res === 'string') {
      try { res = JSON.parse(res); } catch {}
    }
    const dataObj = typeof res?.data === 'string' ? (() => { try { return JSON.parse(res.data); } catch { return res.data; } })() : res?.data;
    const loggedUser = dataObj?.user || res?.user || (dataObj?.email ? dataObj : null) || (res?.email ? res : null);
    if (!loggedUser) {
      throw new Error('Authentication succeeded but user profile was not returned.');
    }
    const token = dataObj?.token || res?.token;
    if (token) {
      setStoredToken(token);
    }
    const csrfToken = dataObj?.csrfToken || res?.csrfToken;
    if (csrfToken) {
      setStoredCsrf(csrfToken);
    }
    setUser(loggedUser);
    return loggedUser;
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
    } finally {
      setStoredToken(null);
      setStoredCsrf(null);
      setUser(null);
    }
  };

  const role = user?.role || null;
  const isAuthenticated = Boolean(user);

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        isLoading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
