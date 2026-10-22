import React, { createContext, useState, useEffect, useCallback } from 'react';
import authService, { AuthUser, LoginPayload } from '../services/auth.service';
import { ensureCsrfToken } from '../services/api';

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
      const response = await authService.getMe();
      if (response.data?.user) {
        setUser(response.data.user);
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
    const response = await authService.login(credentials);
    const loggedUser = response.data?.user;
    if (!loggedUser) {
      throw new Error('Authentication succeeded but user profile was not returned.');
    }
    setUser(loggedUser);
    return loggedUser;
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
    } finally {
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
