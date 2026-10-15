import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, UserRole, LoginCredentials, AuthState } from '../../types/auth';
import { authService } from '../../services/api/authService';
import { apiClient, USE_MOCK_API } from '../../services/api/apiClient';
import {
  MOCK_STUDENT_USER,
  MOCK_TEACHER_USER,
  MOCK_ADMIN_USER,
} from '../../services/api/mockData';

export interface AuthContextType extends AuthState {
  userRole: UserRole | null;
  isHydrating: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: false,
    error: null,
  });
  const [isHydrating, setIsHydrating] = useState<boolean>(true);

  const logout = useCallback(async () => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    try {
      await authService.logout();
    } finally {
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null,
      });
    }
  }, []);

  // Hydrate session from secure storage on startup
  useEffect(() => {
    let isMounted = true;

    const hydrateSession = async () => {
      try {
        const stored = await authService.getStoredSession();
        if (isMounted && stored) {
          setAuthState({
            isAuthenticated: true,
            user: stored.user,
            isLoading: false,
            error: null,
          });
        }
      } catch {
        // Fallback to unauthenticated if storage is corrupted
      } finally {
        if (isMounted) {
          setIsHydrating(false);
        }
      }
    };

    hydrateSession();

    // Register 401 interceptor
    const unregister = apiClient.registerUnauthorizedHandler(() => {
      logout();
    });

    return () => {
      isMounted = false;
      unregister();
    };
  }, [logout]);

  const userRole = authState.user ? authState.user.role : null;

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await authService.login(credentials);
      if (response.success && response.data) {
        setAuthState({
          isAuthenticated: true,
          user: response.data.user,
          isLoading: false,
          error: null,
        });
        return true;
      } else {
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          error: response.error || 'Authentication failed. Please verify your credentials.',
        }));
        return false;
      }
    } catch (err: any) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: err.message || 'An unexpected error occurred during login',
      }));
      return false;
    }
  };

  const switchRole = (newRole: UserRole) => {
    // Security: Role switching cannot grant authenticated status or change permissions outside explicit mock mode
    if (!USE_MOCK_API) {
      console.warn('[Security] Role switching is prohibited outside explicit mock mode.');
      return;
    }

    let mockUser: User = MOCK_STUDENT_USER;
    if (newRole === 'TEACHER') {
      mockUser = MOCK_TEACHER_USER;
    } else if (newRole === 'ADMIN') {
      mockUser = MOCK_ADMIN_USER;
    }

    setAuthState({
      isAuthenticated: true,
      user: mockUser,
      isLoading: false,
      error: null,
    });
  };

  const clearError = () => {
    setAuthState((prev) => ({ ...prev, error: null }));
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        userRole,
        isHydrating,
        login,
        logout,
        switchRole,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
