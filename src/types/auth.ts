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

export interface ForgotPasswordRequest {
  email: string;
}

/**
 * Backward-compatible alias for ForgotPasswordRequest.
 */
export type ResetPasswordRequest = ForgotPasswordRequest;

export interface ResetPasswordSubmitRequest {
  token: string;
  newPassword: string;
}

export type ApplicationStatus =
  | 'PENDING_VERIFICATION'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'REJECTED'
  | 'INVALID_CREDENTIALS'
  | 'ERROR';

export interface ApplicationStatusResult {
  status: ApplicationStatus;
  message: string;
  email: string;
  studentCode?: string | null;
  studentName?: string | null;
  studentId?: string | null;
  className?: string | null;
  batchName?: string | null;
  accessToken?: string;
}

export interface StudentRegistrationFormData {
  // Step 1: Student Details
  name: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  gender?: string;
  password: string;
  confirmPassword: string;

  // Step 2: Parent / Guardian Details
  parentName: string;
  relationship: string;
  parentPhone: string;
  parentEmail?: string;
  emergencyContact?: string;

  // Step 3: Academic Details
  board: string;
  classId: string;
  batchId: string;
  academicSession: string;
  schoolName?: string;

  // Step 4: Address Details
  addressLine?: string;
  city: string;
  state: string;
  pinCode: string;

  // Step 5: Declaration & Consent
  consentAgreed: boolean;
}
