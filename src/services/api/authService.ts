/**
 * PRODUCTION AUTHENTICATION SERVICE
 * =========================================================================
 * Integrates with FastAPI endpoints:
 * - POST /api/v1/auth/login
 * - GET  /api/v1/auth/me
 * - POST /api/v1/auth/refresh
 * - POST /api/v1/auth/logout
 * =========================================================================
 */

import { Platform } from 'react-native';
import { apiClient, USE_MOCK_API, ApiError } from './apiClient';
import { storageService } from '../storage/storageService';
import {
  User,
  LoginCredentials,
  ForgotPasswordRequest,
  ResetPasswordSubmitRequest,
  ApplicationStatusResult,
} from '../../types/auth';
import { ApiResponse } from '../../types/api';
import {
  BackendTokenResponse,
  BackendUserProfileResponse,
  BackendMessageResponse,
  BackendStudentSelfRegisterRequest,
  BackendVerifyEmailRequest,
  BackendResendVerificationRequest,
} from '../../types/backend';
import {
  MOCK_STUDENT_USER,
  MOCK_TEACHER_USER,
  MOCK_ADMIN_USER,
} from './mockData';

export interface AuthResponseData {
  token: string;
  refreshToken?: string;
  user: User;
}

const REFRESH_TOKEN_STORAGE_KEY = '@fundamics:refresh_token';

export const authService = {
  /**
   * Retrieves active session from local storage on app boot.
   */
  async getStoredSession(): Promise<{ token: string; user: User } | null> {
    const token = await storageService.getAuthToken();
    const user = await storageService.getUserSession();
    if (token && user) {
      apiClient.setToken(token);
      return { token, user };
    }
    return null;
  },

  /**
   * Authenticates user against FastAPI backend.
   * On success, fetches /auth/me profile and stores session.
   */
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponseData>> {
    // If explicitly configured for mock operation, return role fixture
    if (USE_MOCK_API) {
      await apiClient.simulateLatency(350);
      let mockUser: User = MOCK_STUDENT_USER;
      if (credentials.selectedRole === 'TEACHER') {
        mockUser = MOCK_TEACHER_USER;
      } else if (credentials.selectedRole === 'ADMIN') {
        mockUser = MOCK_ADMIN_USER;
      }

      const mockToken = `mock-fnd-jwt-${credentials.selectedRole.toLowerCase()}-${Date.now()}`;
      apiClient.setToken(mockToken);
      await storageService.setAuthToken(mockToken);
      await storageService.setUserSession(mockUser);

      return {
        success: true,
        data: {
          token: mockToken,
          user: mockUser,
        },
        message: 'Authentication successful (Mock Mode)',
        timestamp: new Date().toISOString(),
      };
    }

    try {
      // Backend expects email. If student provided code or phone, fallback appropriately
      const email = credentials.identifier.includes('@')
        ? credentials.identifier.trim().toLowerCase()
        : credentials.selectedRole === 'STUDENT'
        ? `${credentials.identifier.trim().toLowerCase()}@student.fundamics.in`
        : `${credentials.identifier.trim().toLowerCase()}@fundamics.in`;

      const loginPayload = {
        email,
        password: credentials.password,
        device_info: `Fundemics Mobile (${Platform.OS})`,
      };

      const loginRes = await apiClient.post<BackendTokenResponse>('/auth/login', loginPayload);

      if (!loginRes.data || !loginRes.data.access_token) {
        throw new ApiError('Invalid response from authentication server', 500);
      }

      const accessToken = loginRes.data.access_token;
      const refreshToken = loginRes.data.refresh_token;

      // Temporarily set bearer token to query user profile
      apiClient.setToken(accessToken);

      // Query authenticated user profile
      const profileRes = await apiClient.get<BackendUserProfileResponse>('/auth/me');

      if (!profileRes.data) {
        throw new ApiError('Failed to fetch user profile', 500);
      }

      const profile = profileRes.data;

      const user: User = {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        phone: profile.phone || '',
        role: profile.role,
        branchId: 'br-triveni',
        branchName: 'Triveni Nagar (Flagship Campus)',
        classOrDept:
          profile.role === 'STUDENT'
            ? 'Enrolled Scholar'
            : profile.role === 'TEACHER'
            ? 'Faculty Department'
            : 'Central Academic Command',
        admissionNo: profile.student_code || undefined,
      };

      // Persist access token and user session
      await storageService.setAuthToken(accessToken);
      await storageService.setUserSession(user);
      if (refreshToken) {
        await storageService.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);
      }

      return {
        success: true,
        data: {
          token: accessToken,
          refreshToken,
          user,
        },
        message: 'Authentication successful',
        timestamp: new Date().toISOString(),
      };
    } catch (err: any) {
      // Security: Under NO circumstances should network failure or backend outage create a synthetic authenticated session
      if (err.statusCode === 0 || err.code === 'NETWORK_ERROR') {
        throw new ApiError(
          'Unable to reach authentication server. Please check your network connection and retry.',
          0,
          'NETWORK_ERROR'
        );
      }
      throw err;
    }
  },

  /**
   * Refreshes JWT token with backend rotation.
   */
  async refreshSession(): Promise<string | null> {
    const refreshToken = await storageService.getItem(REFRESH_TOKEN_STORAGE_KEY);
    if (!refreshToken) return null;

    try {
      const res = await apiClient.post<BackendTokenResponse>('/auth/refresh', {
        refresh_token: refreshToken,
      });

      if (res.data?.access_token) {
        apiClient.setToken(res.data.access_token);
        await storageService.setAuthToken(res.data.access_token);
        if (res.data.refresh_token) {
          await storageService.setItem(REFRESH_TOKEN_STORAGE_KEY, res.data.refresh_token);
        }
        return res.data.access_token;
      }
      return null;
    } catch {
      await this.logout();
      return null;
    }
  },

  /**
   * Clears active authentication tokens and wipes local storage.
   */
  async logout(): Promise<void> {
    const activeToken = apiClient.getToken();

    // Immediately clear in-memory token and persistent session storage
    // to prevent cascading 401 requests from any concurrent component renders
    apiClient.setToken(null);
    await storageService.clearAuth();
    await storageService.removeItem(REFRESH_TOKEN_STORAGE_KEY);

    // If an active token existed, inform backend asynchronously (best-effort, idempotent)
    if (activeToken) {
      try {
        await apiClient.post(
          '/auth/logout',
          {},
          {
            headers: {
              Authorization: `Bearer ${activeToken}`,
            },
          }
        );
      } catch {
        // Suppress any network errors or expired session errors during logout
      }
    }
  },

  /**
   * Initiates password reset via backend POST /api/v1/auth/forgot-password.
   * Backend dispatches a secure reset token via email/notification.
   */
  async requestPasswordReset(
    req: ForgotPasswordRequest
  ): Promise<ApiResponse<{ message: string }>> {
    if (USE_MOCK_API) {
      await apiClient.simulateLatency(300);
      return {
        success: true,
        data: {
          message: `If your account is registered and active, password reset instructions have been dispatched to ${req.email}.`,
        },
        timestamp: new Date().toISOString(),
      };
    }

    const email = req.email.trim().toLowerCase();
    const res = await apiClient.post<BackendMessageResponse>('/auth/forgot-password', { email });

    return {
      success: true,
      data: {
        message:
          res.data?.message ||
          'If your account is registered and active, password reset instructions have been dispatched.',
      },
      timestamp: new Date().toISOString(),
    };
  },

  /**
   * Completes password reset using secure token via backend POST /api/v1/auth/reset-password.
   * Requires token and new_password (min 8, max 128 chars).
   */
  async resetPassword(
    req: ResetPasswordSubmitRequest
  ): Promise<ApiResponse<{ message: string }>> {
    if (USE_MOCK_API) {
      await apiClient.simulateLatency(350);
      return {
        success: true,
        data: {
          message: 'Password reset successful (Mock Mode). Please login with your new credentials.',
        },
        timestamp: new Date().toISOString(),
      };
    }

    const res = await apiClient.post<BackendMessageResponse>('/auth/reset-password', {
      token: req.token.trim(),
      new_password: req.newPassword,
    });

    return {
      success: true,
      data: {
        message:
          res.data?.message ||
          'Password reset successful. Please login with your new credentials.',
      },
      timestamp: new Date().toISOString(),
    };
  },

  /**
   * Registers a new student via POST /api/v1/auth/register/student.
   * Account is created in PENDING_VERIFICATION status with a unique student code.
   */
  async registerStudent(
    req: BackendStudentSelfRegisterRequest
  ): Promise<ApiResponse<BackendMessageResponse>> {
    if (USE_MOCK_API) {
      await apiClient.simulateLatency(450);
      return {
        success: true,
        data: {
          success: true,
          message: 'Registration submitted successfully. Please check your email to verify your address.',
        },
        timestamp: new Date().toISOString(),
      };
    }

    const payload = {
      name: req.name.trim(),
      email: req.email.trim().toLowerCase(),
      phone: req.phone?.trim() || null,
      password: req.password,
      class_id: req.class_id,
      batch_id: req.batch_id,
    };

    const res = await apiClient.post<BackendMessageResponse>('/auth/register/student', payload);
    return {
      success: true,
      data: res.data || {
        success: true,
        message: 'Registration submitted successfully. Please check your email to verify your address.',
      },
      timestamp: new Date().toISOString(),
    };
  },

  /**
   * Verifies applicant email via POST /api/v1/auth/verify-email.
   * Moves account from PENDING_VERIFICATION to PENDING_APPROVAL.
   */
  async verifyEmail(
    token: string,
    email?: string
  ): Promise<ApiResponse<BackendMessageResponse>> {
    if (USE_MOCK_API) {
      await apiClient.simulateLatency(350);
      return {
        success: true,
        data: {
          success: true,
          message: 'Email verified successfully. Your account is now pending administrator approval.',
        },
        timestamp: new Date().toISOString(),
      };
    }

    const payload: BackendVerifyEmailRequest = {
      token: token.trim(),
      email: email?.trim().toLowerCase() || null,
    };

    const res = await apiClient.post<BackendMessageResponse>('/auth/verify-email', payload);
    return {
      success: true,
      data: res.data || {
        success: true,
        message: 'Email verified successfully. Your account is now pending administrator approval.',
      },
      timestamp: new Date().toISOString(),
    };
  },

  /**
   * Resends verification email via POST /api/v1/auth/resend-verification.
   */
  async resendVerification(email: string): Promise<ApiResponse<BackendMessageResponse>> {
    if (USE_MOCK_API) {
      await apiClient.simulateLatency(350);
      return {
        success: true,
        data: {
          success: true,
          message: 'If an account exists with this email address, a verification link has been sent.',
        },
        timestamp: new Date().toISOString(),
      };
    }

    const res = await apiClient.post<BackendMessageResponse>('/auth/resend-verification', {
      email: email.trim().toLowerCase(),
    });

    return {
      success: true,
      data: res.data || {
        success: true,
        message: 'If an account exists with this email address, a verification link has been sent.',
      },
      timestamp: new Date().toISOString(),
    };
  },

  /**
   * Securely checks applicant status using student email & password.
   * Leverages real backend authentication status responses without exposing unauthenticated data.
   */
  async checkApplicationStatus(credentials: {
    email: string;
    password: string;
  }): Promise<ApplicationStatusResult> {
    const cleanEmail = credentials.email.trim().toLowerCase();

    if (USE_MOCK_API) {
      await apiClient.simulateLatency(400);
      return {
        status: 'PENDING_APPROVAL',
        message: 'Your registration is awaiting verification by the Fundamics administration team.',
        email: cleanEmail,
        studentName: 'Applicant Scholar',
      };
    }

    try {
      const loginPayload = {
        email: cleanEmail,
        password: credentials.password,
        device_info: 'Fundemics Status Checker (' + Platform.OS + ')',
      };

      const loginRes = await apiClient.post<BackendTokenResponse>('/auth/login', loginPayload);

      if (loginRes.data?.access_token) {
        // Account is ACTIVE and APPROVED!
        const token = loginRes.data.access_token;
        apiClient.setToken(token);
        const profileRes = await apiClient.get<BackendUserProfileResponse>('/auth/me');
        const profile = profileRes.data;

        return {
          status: 'APPROVED',
          message: 'Application Approved! Your student account is active.',
          email: cleanEmail,
          studentCode: profile?.student_code || null,
          studentName: profile?.name || null,
          studentId: profile?.student_id || profile?.id || null,
          accessToken: token,
        };
      }

      return {
        status: 'PENDING_APPROVAL',
        message: 'Application is under review by the administration team.',
        email: cleanEmail,
      };
    } catch (err: any) {
      const msg = err?.rawMessage || err?.message || '';

      if (msg.includes('PENDING_VERIFICATION')) {
        return {
          status: 'PENDING_VERIFICATION',
          message: 'Email verification required. Please click the verification link sent to your email or enter your token below.',
          email: cleanEmail,
        };
      }

      if (msg.includes('PENDING_APPROVAL')) {
        return {
          status: 'PENDING_APPROVAL',
          message: 'Application Under Review. Your registration has been received and is awaiting administrative verification by Fundamics Lucknow Campus.',
          email: cleanEmail,
        };
      }

      if (msg.includes('REJECTED')) {
        return {
          status: 'REJECTED',
          message: 'Registration Not Approved. Your application could not be approved at this time. Please contact the campus office for assistance.',
          email: cleanEmail,
        };
      }

      if (msg.toLowerCase().includes('invalid email or password')) {
        return {
          status: 'INVALID_CREDENTIALS',
          message: 'The email or password does not match our records. Please double-check your credentials.',
          email: cleanEmail,
        };
      }

      return {
        status: 'ERROR',
        message: msg || 'Unable to verify status at this moment. Please check your connection and retry.',
        email: cleanEmail,
      };
    }
  },
};
