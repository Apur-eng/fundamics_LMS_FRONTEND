/**
 * DASHBOARD SERVICE ABSTRACTION
 * =========================================================================
 * Fetches role-specific dashboard metrics, schedules, and alerts.
 * Student dashboard routes directly to real FastAPI student endpoints
 * via studentService.
 * =========================================================================
 */

import { apiClient, USE_MOCK_API } from './apiClient';
import { ApiResponse } from '../../types/api';
import {
  StudentDashboardData,
  TeacherDashboardData,
  AdminDashboardData,
} from '../../types/dashboard';
import { BackendTeacherAttendanceSummary } from '../../types/backend';
import { studentService } from './studentService';
import { storageService } from '../storage/storageService';
import {
  MOCK_TEACHER_DASHBOARD,
  MOCK_ADMIN_DASHBOARD,
} from './mockData';

export const dashboardService = {
  /**
   * Retrieves student dashboard metrics and schedule from real backend endpoints.
   */
  async getStudentDashboard(): Promise<ApiResponse<StudentDashboardData>> {
    const data = await studentService.getDashboardData();
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  },

  /**
   * Retrieves teacher daily classes and urgent evaluations.
   */
  async getTeacherDashboard(): Promise<ApiResponse<TeacherDashboardData>> {
    if (USE_MOCK_API) {
      await apiClient.simulateLatency(350);
      return {
        success: true,
        data: MOCK_TEACHER_DASHBOARD,
        timestamp: new Date().toISOString(),
      };
    }

    try {
      const user = await storageService.getUserSession();
      const res = await apiClient.get<BackendTeacherAttendanceSummary>(
        '/teacher/me/attendance/summary'
      );
      const attendance = res.data;

      const data: TeacherDashboardData = {
        greeting: `Welcome back, ${user?.name ? user.name.split(' ')[0] : 'Faculty'}`,
        facultyProfile: {
          name: user?.name || MOCK_TEACHER_DASHBOARD.facultyProfile.name,
          department: user?.classOrDept || MOCK_TEACHER_DASHBOARD.facultyProfile.department,
          designation: 'Senior Faculty Member',
          branch: user?.branchName || MOCK_TEACHER_DASHBOARD.facultyProfile.branch,
        },
        metrics: {
          totalBatches: 5,
          totalStudents: 148,
          pendingAssessments: attendance ? attendance.incomplete_days : 0,
          classesToday: attendance ? attendance.total_days : 3,
        },
        todaySchedule: MOCK_TEACHER_DASHBOARD.todaySchedule,
        urgentTasks: MOCK_TEACHER_DASHBOARD.urgentTasks,
      };

      return {
        success: true,
        data,
        timestamp: new Date().toISOString(),
      };
    } catch {
      return {
        success: true,
        data: MOCK_TEACHER_DASHBOARD,
        timestamp: new Date().toISOString(),
      };
    }
  },

  /**
   * Retrieves institute-wide administrative KPIs and branch statistics.
   */
  async getAdminDashboard(): Promise<ApiResponse<AdminDashboardData>> {
    if (USE_MOCK_API) {
      await apiClient.simulateLatency(350);
      return {
        success: true,
        data: MOCK_ADMIN_DASHBOARD,
        timestamp: new Date().toISOString(),
      };
    }

    try {
      const [studentsRes, teachersRes] = await Promise.allSettled([
        apiClient.get<any[]>('/admin/students'),
        apiClient.get<any[]>('/admin/teachers'),
      ]);

      const activeStudents =
        studentsRes.status === 'fulfilled' && Array.isArray(studentsRes.value.data)
          ? studentsRes.value.data.length
          : MOCK_ADMIN_DASHBOARD.metrics.activeStudents;

      const activeFaculty =
        teachersRes.status === 'fulfilled' && Array.isArray(teachersRes.value.data)
          ? teachersRes.value.data.length
          : MOCK_ADMIN_DASHBOARD.metrics.activeFaculty;

      const data: AdminDashboardData = {
        metrics: {
          activeStudents,
          activeFaculty,
          overallAttendanceToday: MOCK_ADMIN_DASHBOARD.metrics.overallAttendanceToday,
          feeCollectionProgress: MOCK_ADMIN_DASHBOARD.metrics.feeCollectionProgress,
        },
        branchOverviews: MOCK_ADMIN_DASHBOARD.branchOverviews,
        recentSystemActivity: MOCK_ADMIN_DASHBOARD.recentSystemActivity,
      };

      return {
        success: true,
        data,
        timestamp: new Date().toISOString(),
      };
    } catch {
      return {
        success: true,
        data: MOCK_ADMIN_DASHBOARD,
        timestamp: new Date().toISOString(),
      };
    }
  },
};
