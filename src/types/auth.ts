export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
  branchId?: string;
  branchName?: string;
  classOrDept?: string;
  admissionNo?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  identifier: string;
  password: string;
  selectedRole: UserRole;
}

export interface ResetPasswordRequest {
  identifier: string;
}

export interface VerifyOtpRequest {
  identifier: string;
  otp: string;
}
