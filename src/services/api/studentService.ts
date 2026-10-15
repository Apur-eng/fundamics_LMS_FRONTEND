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
  BackendMonthlyAttendanceResponse,
} from '../../types/backend';
import {
  StudentDashboardData,
  RecentResultItem,
  NoticeItem,
  PerformanceMetrics,
  PerformanceTrendPoint,
  MonthlyAttendanceSummary,
  DayAttendanceRecord,
  AttendanceDisplayStatus,
  UpcomingClassItem,
} from '../../types/dashboard';
import { storageService } from '../storage/storageService';
import {
  MOCK_STUDENT_DASHBOARD,
  DEV_FIXTURE_SEPTEMBER_ATTENDANCE,
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
    return {
      averageScore: 0,
      deltaTrend: 0,
      trendDirection: 'STABLE',
      testsCompleted: 0,
      highestScore: 0,
      trendPoints: [],
    };
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
  /**
   * Aggregates real backend data for the Student Dashboard.
   * Concurrently queries attendance summary, monthly day-wise attendance, exam results, and notes.
   */
  async getDashboardData(): Promise<StudentDashboardData> {
    if (USE_MOCK_API) {
      await apiClient.simulateLatency(350);
      return MOCK_STUDENT_DASHBOARD;
    }

    // Load current user profile from storage
    const user = await storageService.getUserSession();
    const studentName = user?.name || 'Scholar';
    const studentCode = user?.admissionNo || 'FND-2026';

    const now = new Date();
    const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    // Query real backend endpoints concurrently
    const [attendanceResult, dailyAttendanceResult, resultsResult, notesResult] = await Promise.allSettled([
      this.getAttendanceSummary(),
      this.getDailyAttendance(currentMonthKey),
      this.getExamResults(),
      this.getStudentNotes(),
    ]);

    // Resolve attendance summary
    const attendance =
      attendanceResult.status === 'fulfilled'
        ? mapBackendAttendance(attendanceResult.value)
        : {
            percentage: 0,
            presentDays: 0,
            totalDays: 0,
            status: 'GOOD' as const,
          };

    // Resolve day-wise attendance (derived directly from real backend logs)
    const dayWiseAttendance =
      dailyAttendanceResult.status === 'fulfilled'
        ? dailyAttendanceResult.value
        : undefined;

    // Resolve recent results
    const recentResults =
      resultsResult.status === 'fulfilled'
        ? mapBackendResults(resultsResult.value)
        : [];

    // Resolve notices
    let notices: NoticeItem[] = [];
    if (notesResult.status === 'fulfilled' && notesResult.value.length > 0) {
      notices = mapBackendNotesToNotices(notesResult.value);
    }

    // Resolve performance metrics from exam results
    const performanceMetrics =
      resultsResult.status === 'fulfilled' && resultsResult.value.length > 0
        ? computePerformanceMetrics(resultsResult.value)
        : {
            averageScore: 0,
            deltaTrend: 0,
            trendDirection: 'STABLE' as const,
            testsCompleted: 0,
            highestScore: 0,
            trendPoints: [],
          };

    // Today's classes: timetable scheduler endpoint is pending backend route
    const upcomingClasses: UpcomingClassItem[] = [];

    const hour = now.getHours();
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
      dayWiseAttendance,
      performanceMetrics,
      upcomingClasses,
      recentResults,
      notices,
    };
  },

  /**
   * Fetches day-wise attendance for a specified month.
   * Connects to GET /api/v1/student/me/attendance/logs?month=YYYY-MM
   */
  async getDailyAttendance(month?: string): Promise<MonthlyAttendanceSummary> {
    const targetMonth = month || (() => {
      const now = new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    })();

    if (USE_MOCK_API) {
      await apiClient.simulateLatency(250);
      return DEV_FIXTURE_SEPTEMBER_ATTENDANCE;
    }

    const res = await apiClient.get<BackendMonthlyAttendanceResponse>(
      `/student/me/attendance/logs?month=${targetMonth}`
    );

    if (res.data) {
      const [year, monthNum] = res.data.month.split('-').map(Number);
      const dateObj = new Date(year, monthNum - 1, 1);
      const monthName = !isNaN(dateObj.getTime())
        ? dateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        : res.data.month;

      const records: DayAttendanceRecord[] = (res.data.daily_records || []).map((r) => {
        const [y, m, d] = r.date.split('-').map(Number);
        // Calculate weekday in local time without UTC date shift (0 = Sunday, 1 = Monday)
        const dayOfWeek = new Date(y, m - 1, d).getDay();
        const dayNumber = d;

        let status: AttendanceDisplayStatus = 'OFF';
        if (r.status === 'PRESENT') status = 'PRESENT';
        else if (r.status === 'ABSENT') status = 'ABSENT';
        else if (r.status === 'LATE') status = 'LATE';
        else if (r.status === 'EXCUSED') status = 'EXCUSED';
        else if (r.status === 'HOLIDAY') status = 'HOLIDAY';
        else if (r.status === 'OFF') status = 'OFF';

        return {
          date: r.date,
          dayNumber,
          dayOfWeek,
          status,
          remarks: r.remarks || undefined,
        };
      });

      return {
        monthName,
        monthKey: res.data.month,
        presentDays: res.data.present_days,
        absentDays: res.data.absent_days,
        scheduledDays: res.data.total_scheduled_days,
        percentage: res.data.attendance_percentage,
        records,
      };
    }

    return {
      monthName: targetMonth,
      monthKey: targetMonth,
      presentDays: 0,
      absentDays: 0,
      scheduledDays: 0,
      percentage: 0,
      records: [],
    };
  },
};
