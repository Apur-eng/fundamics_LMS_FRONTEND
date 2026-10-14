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
import { studentService } from './studentService';
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
    return apiClient.get<TeacherDashboardData>('/teacher/me/attendance/summary');
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
    return apiClient.get<AdminDashboardData>('/admin/settings/institute');
  },
};
