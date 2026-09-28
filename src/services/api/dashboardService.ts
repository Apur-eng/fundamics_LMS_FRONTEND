/**
 * DASHBOARD SERVICE ABSTRACTION
 * =========================================================================
 * Fetches role-specific dashboard metrics, schedules, and alerts.
 * Uses typed mock fixtures until FastAPI backend integration.
 * =========================================================================
 */

import { apiClient, USE_MOCK_API } from './apiClient';
import { ApiResponse } from '../../types/api';
import {
  StudentDashboardData,
  TeacherDashboardData,
  AdminDashboardData,
} from '../../types/dashboard';
import {
  MOCK_STUDENT_DASHBOARD,
  MOCK_TEACHER_DASHBOARD,
  MOCK_ADMIN_DASHBOARD,
} from './mockData';

export const dashboardService = {
  /**
   * Retrieves student dashboard metrics and schedule.
   */
  async getStudentDashboard(): Promise<ApiResponse<StudentDashboardData>> {
    if (USE_MOCK_API) {
      await apiClient.simulateLatency(350);
      return {
        success: true,
        data: MOCK_STUDENT_DASHBOARD,
        timestamp: new Date().toISOString(),
      };
    }
    return apiClient.get<StudentDashboardData>('/v1/dashboard/student');
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
    return apiClient.get<TeacherDashboardData>('/v1/dashboard/teacher');
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
    return apiClient.get<AdminDashboardData>('/v1/dashboard/admin');
  },
};
