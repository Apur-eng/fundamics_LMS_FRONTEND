import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, LoginCredentials, AuthState } from '../../types/auth';
import { authService } from '../../services/api/authService';
import {
  MOCK_STUDENT_USER,
  MOCK_TEACHER_USER,
  MOCK_ADMIN_USER,
} from '../../services/api/mockData';

export interface AuthContextType extends AuthState {
  userRole: UserRole | null;
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
          error: response.error || 'Authentication failed',
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

  const logout = async () => {
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
  };

  const switchRole = (newRole: UserRole) => {
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
