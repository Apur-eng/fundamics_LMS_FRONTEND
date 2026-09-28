/**
 * AUTHENTICATION SERVICE ABSTRACTION
 * =========================================================================
 * Provides typed methods for authentication. Uses mock responses with
 * realistic network delays until the FastAPI backend authentication
 * endpoint (/api/v1/auth/login) is deployed.
 * =========================================================================
 */

import { apiClient, USE_MOCK_API } from './apiClient';
import {
  User,
  LoginCredentials,
  ResetPasswordRequest,
  VerifyOtpRequest,
} from '../../types/auth';
import { ApiResponse } from '../../types/api';
import {
  MOCK_STUDENT_USER,
  MOCK_TEACHER_USER,
  MOCK_ADMIN_USER,
} from './mockData';

export interface AuthResponseData {
  token: string;
  user: User;
}

export const authService = {
  /**
   * Authenticates user against credentials or returns role-based mock fixture.
   */
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponseData>> {
    if (USE_MOCK_API) {
      await apiClient.simulateLatency(450);

      let mockUser: User = MOCK_STUDENT_USER;
      if (credentials.selectedRole === 'TEACHER') {
        mockUser = MOCK_TEACHER_USER;
      } else if (credentials.selectedRole === 'ADMIN') {
        mockUser = MOCK_ADMIN_USER;
      }

      const mockToken = `mock-fnd-jwt-${credentials.selectedRole.toLowerCase()}-${Date.now()}`;
      apiClient.setToken(mockToken);

      return {
        success: true,
        data: {
          token: mockToken,
          user: mockUser,
        },
        message: 'Authentication successful',
        timestamp: new Date().toISOString(),
      };
    }

    return apiClient.post<AuthResponseData>('/v1/auth/login', credentials);
  },

  /**
   * Requests a password reset link or OTP.
   */
  async requestPasswordReset(
    req: ResetPasswordRequest
  ): Promise<ApiResponse<{ message: string }>> {
    if (USE_MOCK_API) {
      await apiClient.simulateLatency(350);
      return {
        success: true,
        data: {
          message: `Verification code sent to registered contact for ${req.identifier}`,
        },
        timestamp: new Date().toISOString(),
      };
    }

    return apiClient.post<{ message: string }>('/v1/auth/forgot-password', req);
  },

  /**
   * Verifies a 6-digit OTP code.
   */
  async verifyOtp(
    req: VerifyOtpRequest
  ): Promise<ApiResponse<{ verified: boolean }>> {
    if (USE_MOCK_API) {
      await apiClient.simulateLatency(350);
      return {
        success: true,
        data: {
          verified: req.otp.length === 6,
        },
        timestamp: new Date().toISOString(),
      };
    }

    return apiClient.post<{ verified: boolean }>('/v1/auth/verify-otp', req);
  },

  /**
   * Clears active authentication tokens.
   */
  async logout(): Promise<void> {
    apiClient.setToken(null);
  },
};
