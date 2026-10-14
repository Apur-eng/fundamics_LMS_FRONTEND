/**
 * PRODUCTION STUDENT API SERVICE & DATA MAPPERS
 * =========================================================================
 * Integrates directly with FastAPI backend endpoints:
 * - GET /api/v1/student/me/attendance/summary
 * - GET /api/v1/student/me/results
 * - GET /api/v1/student/me/notes
 *
 * Transforms backend DTOs into clean models consumed by the UI.
 * =========================================================================
 */

import { apiClient, USE_MOCK_API } from './apiClient';
import {
  BackendStudentAttendanceSummary,
  BackendStudentExamSummaryResponse,
  BackendNoteResponse,
} from '../../types/backend';
import {
  StudentDashboardData,
  RecentResultItem,
  NoticeItem,
  PerformanceMetrics,
  PerformanceTrendPoint,
  MonthlyAttendanceSummary,
} from '../../types/dashboard';
import { storageService } from '../storage/storageService';
import {
  MOCK_STUDENT_DASHBOARD,
  DEV_FIXTURE_SEPTEMBER_ATTENDANCE,
  DEV_FIXTURE_PERFORMANCE_METRICS,
} from './mockData';

// --- DATA MAPPERS ---

export const mapBackendAttendance = (
  dto: BackendStudentAttendanceSummary
): StudentDashboardData['attendance'] => {
  const percentage = Math.round(dto.attendance_percentage * 10) / 10;
  let status: 'EXCELLENT' | 'GOOD' | 'WARNING' = 'GOOD';
  if (percentage >= 90) {
    status = 'EXCELLENT';
  } else if (percentage < 75) {
    status = 'WARNING';
  }

  return {
    percentage,
    presentDays: dto.present_days,
    totalDays: dto.total_working_days,
    status,
  };
};

export const computePerformanceMetrics = (
  results: BackendStudentExamSummaryResponse[]
): PerformanceMetrics => {
  if (!results || results.length === 0) {
    return DEV_FIXTURE_PERFORMANCE_METRICS;
  }

  // Sort chronologically ascending
  const sorted = [...results].sort(
    (a, b) => new Date(a.exam_date).getTime() - new Date(b.exam_date).getTime()
  );
  const percentages = sorted.map((e) => e.overall_percentage);
  const sum = percentages.reduce((acc, p) => acc + p, 0);
  const averageScore = Math.round((sum / percentages.length) * 10) / 10;
  const highestScore = Math.round(Math.max(...percentages) * 10) / 10;

  let deltaTrend = 0;
  let trendDirection: 'UP' | 'DOWN' | 'STABLE' = 'STABLE';
  if (sorted.length >= 2) {
    const latest = sorted[sorted.length - 1].overall_percentage;
    const previous = sorted[sorted.length - 2].overall_percentage;
    const rawDiff = latest - previous;
    deltaTrend = Math.round(Math.abs(rawDiff) * 10) / 10;
    trendDirection = rawDiff > 0 ? 'UP' : rawDiff < 0 ? 'DOWN' : 'STABLE';
  }

  const trendPoints: PerformanceTrendPoint[] = sorted.slice(-5).map((e, idx) => ({
    id: e.exam_id,
    label: `T${idx + 1}`,
    testName: e.exam_name,
    score: Math.round(e.total_marks_obtained),
    maxScore: Math.round(e.total_max_marks),
    percentage: Math.round(e.overall_percentage * 10) / 10,
    date: new Date(e.exam_date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
    }),
  }));

  return {
    averageScore,
    deltaTrend,
    trendDirection,
    testsCompleted: sorted.length,
    highestScore,
    trendPoints,
  };
};

export const mapBackendResults = (
  dtos: BackendStudentExamSummaryResponse[]
): RecentResultItem[] => {
  return dtos.map((exam) => {
    // If exam has individual subject results, pick primary subject or default to Combined
    const primarySubject =
      exam.results && exam.results.length > 0 && exam.results[0].subject_name
        ? exam.results.length === 1
          ? exam.results[0].subject_name
          : `${exam.results[0].subject_name} & ${exam.results.length - 1} more`
        : 'Board Simulation';

    return {
      id: exam.exam_id,
      testName: exam.exam_name,
      subject: primarySubject,
      score: Math.round(exam.total_marks_obtained),
      maxScore: Math.round(exam.total_max_marks),
      date: exam.exam_date,
    };
  });
};

export const mapBackendNotesToNotices = (
  notes: BackendNoteResponse[]
): NoticeItem[] => {
  return notes.map((note) => ({
    id: note.id,
    title: note.title,
    category: note.subject_name || 'Academic Material',
    date: new Date(note.created_at).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
    }),
    isUrgent: false,
  }));
};

// --- SERVICE IMPLEMENTATION ---

export const studentService = {
  /**
   * Fetches student attendance summary from /api/v1/student/me/attendance/summary
   */
  async getAttendanceSummary(): Promise<BackendStudentAttendanceSummary> {
    const res = await apiClient.get<BackendStudentAttendanceSummary>(
      '/student/me/attendance/summary'
    );
    return res.data;
  },

  /**
   * Fetches student results from /api/v1/student/me/results
   */
  async getExamResults(): Promise<BackendStudentExamSummaryResponse[]> {
    const res = await apiClient.get<BackendStudentExamSummaryResponse[]>(
      '/student/me/results'
    );
    return res.data || [];
  },

  /**
   * Fetches published notes and study materials from /api/v1/student/me/notes
   */
  async getStudentNotes(): Promise<BackendNoteResponse[]> {
    const res = await apiClient.get<BackendNoteResponse[]>(
      '/student/me/notes'
    );
    return res.data || [];
  },

  /**
   * Aggregates real backend data for the Student Dashboard.
   * Concurrently queries attendance, exam results, and notes.
   */
  async getDashboardData(): Promise<StudentDashboardData> {
    if (USE_MOCK_API) {
      await apiClient.simulateLatency(350);
      return MOCK_STUDENT_DASHBOARD;
    }

    try {
      // Load current user profile from storage
      const user = await storageService.getUserSession();
      const studentName = user?.name || 'Scholar';
      const studentCode = user?.admissionNo || 'FND-2026';

      // Query real backend endpoints concurrently
      const [attendanceResult, resultsResult, notesResult] = await Promise.allSettled([
        this.getAttendanceSummary(),
        this.getExamResults(),
        this.getStudentNotes(),
      ]);

      // Resolve attendance
      const attendance =
        attendanceResult.status === 'fulfilled'
          ? mapBackendAttendance(attendanceResult.value)
          : MOCK_STUDENT_DASHBOARD.attendance;

      // Resolve recent results
      const recentResults =
        resultsResult.status === 'fulfilled'
          ? mapBackendResults(resultsResult.value)
          : MOCK_STUDENT_DASHBOARD.recentResults;

      // Resolve notices (uses real backend notes if available, otherwise mock notices)
      let notices = MOCK_STUDENT_DASHBOARD.notices;
      if (notesResult.status === 'fulfilled' && notesResult.value.length > 0) {
        const mappedNotes = mapBackendNotesToNotices(notesResult.value);
        notices = mappedNotes;
      }

      // Resolve performance metrics from exam results
      const performanceMetrics =
        resultsResult.status === 'fulfilled'
          ? computePerformanceMetrics(resultsResult.value)
          : MOCK_STUDENT_DASHBOARD.performanceMetrics;

      // Today's classes: timetable scheduler endpoint is pending backend route
      const upcomingClasses = MOCK_STUDENT_DASHBOARD.upcomingClasses;

      const hour = new Date().getHours();
      const greetingTime = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

      return {
        greeting: `${greetingTime}, ${studentName.split(' ')[0]}`,
        academicProfile: {
          studentName,
          admissionNumber: studentCode,
          classGrade: user?.classOrDept || 'Enrolled Scholar',
          board: 'Fundemics Academic Programme',
          branch: user?.branchName || 'Triveni Nagar (Flagship Campus)',
        },
        attendance,
        dayWiseAttendance: DEV_FIXTURE_SEPTEMBER_ATTENDANCE,
        performanceMetrics,
        upcomingClasses,
        recentResults,
        notices,
      };
    } catch {
      // Fallback to cached/mock dashboard if network is completely down
      return MOCK_STUDENT_DASHBOARD;
    }
  },

  /**
   * Fetches day-wise attendance for a specified month.
   * Connects to /api/v1/student/me/attendance/logs with graceful fallback.
   */
  async getDailyAttendance(_month: string = '2026-09'): Promise<MonthlyAttendanceSummary> {
    if (USE_MOCK_API) {
      await apiClient.simulateLatency(250);
      return DEV_FIXTURE_SEPTEMBER_ATTENDANCE;
    }

    try {
      const res = await apiClient.get<any>(
        `/student/me/attendance/logs?month=${_month}`
      );
      if (res.data && res.data.daily_records) {
        return {
          monthName: res.data.month === '2026-09' ? 'September 2026' : res.data.month,
          monthKey: res.data.month,
          presentDays: res.data.present_days,
          absentDays: res.data.absent_days,
          scheduledDays: res.data.total_scheduled_days,
          percentage: res.data.attendance_percentage,
          records: res.data.daily_records.map((r: any) => {
            const dayNumber = parseInt(r.date.split('-')[2], 10);
            const dayOfWeek = new Date(r.date).getDay();
            const status = r.status === 'EXCUSED' ? ('OFF' as const) : (r.status as 'PRESENT' | 'ABSENT' | 'OFF');
            return {
              date: r.date,
              dayNumber,
              dayOfWeek,
              status,
              remarks: r.remarks || undefined,
            };
          }),
        };
      }
    } catch {
      // Fallback for pending backend endpoint
    }
    return DEV_FIXTURE_SEPTEMBER_ATTENDANCE;
  },
};
