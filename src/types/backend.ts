/**
 * FASTAPI BACKEND RESPONSE SCHEMAS
 * =========================================================================
 * Authoritative TypeScript interfaces matching the Pydantic schemas in:
 * - d:\fundamics_backend\src\schemas\auth.py
 * - d:\fundamics_backend\src\schemas\student_attendance.py
 * - d:\fundamics_backend\src\schemas\exam_result.py
 * - d:\fundamics_backend\src\schemas\note_file.py
 * =========================================================================
 */

// --- Authentication DTOs ---
export interface BackendTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in_seconds: number;
}

// --- Password Recovery DTOs ---
export interface BackendForgotPasswordRequest {
  email: string;
}

export interface BackendResetPasswordRequest {
  token: string;
  new_password: string;
}

export interface BackendMessageResponse {
  success: boolean;
  message: string;
}

export interface BackendStudentSelfRegisterRequest {
  name: string;
  email: string;
  phone?: string | null;
  password: string;
  class_id: string;
  batch_id: string;
}

export interface BackendVerifyEmailRequest {
  token: string;
  email?: string | null;
}

export interface BackendResendVerificationRequest {
  email: string;
}

export interface BackendClassResponse {
  id: string;
  name: string;
  code: string;
  board: string;
  academic_year: string;
  status: string;
}

export interface BackendBatchResponse {
  id: string;
  class_id: string;
  name: string;
  code: string;
  start_time: string;
  end_time: string;
  status: string;
}

export interface BackendUserProfileResponse {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT';
  status: 'ACTIVE' | 'PENDING_VERIFICATION' | 'PENDING_APPROVAL' | 'REJECTED' | 'SUSPENDED' | 'INACTIVE';
  student_id: string | null;
  teacher_id: string | null;
  student_code: string | null;
  teacher_code: string | null;
}

// --- Student Attendance DTOs ---
export interface BackendStudentAttendanceSummary {
  student_id: string;
  student_code: string;
  total_working_days: number;
  present_days: number;
  absent_days: number;
  late_days: number;
  excused_days: number;
  attendance_percentage: number;
}

/**
 * Required FastAPI endpoint payload:
 * GET /api/v1/student/me/attendance/logs?month=YYYY-MM
 */
export type BackendAttendanceStatus =
  | 'PRESENT'
  | 'ABSENT'
  | 'LATE'
  | 'EXCUSED'
  | 'HOLIDAY';

export interface BackendDailyAttendanceRecord {
  date: string; // YYYY-MM-DD
  status: BackendAttendanceStatus | string;
  session_count?: number;
  remarks?: string | null;
}

export interface BackendMonthlyAttendanceResponse {
  month: string; // e.g. "2026-09"
  total_scheduled_days: number;
  present_days: number;
  absent_days: number;
  attendance_percentage: number;
  daily_records: BackendDailyAttendanceRecord[];
}

// --- Exam Results DTOs ---
export interface BackendSubjectResult {
  id: string;
  exam_id: string;
  exam_name: string | null;
  student_id: string;
  subject_id: string;
  subject_name: string | null;
  marks_obtained: number;
  max_marks: number;
  percentage: number;
  grade: string | null;
  published_at: string | null;
  document_file_id?: string | null;
  document_filename?: string | null;
  has_document?: boolean;
}

export interface BackendStudentExamSummaryResponse {
  exam_id: string;
  exam_name: string;
  exam_date: string;
  total_marks_obtained: number;
  total_max_marks: number;
  overall_percentage: number;
  results: BackendSubjectResult[];
}

// --- Note / Material DTOs ---
export interface BackendNoteResponse {
  id: string;
  title: string;
  description: string | null;
  class_id: string;
  batch_id: string | null;
  subject_id: string;
  subject_name: string | null;
  file_id: string;
  original_filename: string | null;
  file_size_bytes: number | null;
  status: string;
  created_at: string;
}

// --- Notice / Announcement DTOs ---
export interface BackendNoticeResponse {
  id: string;
  title: string;
  content: string;
  target_audience: string;
  class_id?: string | null;
  batch_id?: string | null;
  priority: 'URGENT' | 'HIGH' | 'NORMAL' | 'LOW';
  attachment_file_id?: string | null;
  is_active: boolean;
  published_at: string;
  expires_at?: string | null;
  created_by: string;
}

// --- Teacher Attendance DTOs ---
export interface BackendTeacherAttendanceSummary {
  teacher_id: string;
  teacher_code: string;
  total_days: number;
  present_days: number;
  absent_days: number;
  half_days: number;
  incomplete_days: number;
  total_served_hours: number;
}

// --- Backend Standard Error Envelope ---
export interface BackendErrorEnvelope {
  success: false;
  error: {
    code: string;
    message: string;
    details: unknown | null;
  };
  request_id?: string;
}

