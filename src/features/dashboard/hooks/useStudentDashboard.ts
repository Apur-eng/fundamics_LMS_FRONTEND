import { useState, useEffect, useCallback } from 'react';
import { dashboardService } from '../../../services/api/dashboardService';
import { StudentDashboardData } from '../../../types/dashboard';
import { useToast } from '../../../components/feedback';

export interface UseStudentDashboardResult {
  data: StudentDashboardData | null;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  onRefresh: () => void;
}

export const useStudentDashboard = (): UseStudentDashboardResult => {
  const [data, setData] = useState<StudentDashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { showToast } = useToast();

  const fetchDashboard = useCallback(
    async (isManualRefresh: boolean = false) => {
      if (isManualRefresh) {
        setRefreshing(true);
      } else if (!data) {
        setLoading(true);
      }

      try {
        const res = await dashboardService.getStudentDashboard();
        if (res.success && res.data) {
          setData(res.data);
          setError(null);
        } else {
          const errMsg = res.error || 'Failed to load timetable and records';
          setError(errMsg);
          if (isManualRefresh) {
            showToast({ message: errMsg, type: 'danger' });
          }
        }
      } catch (err: any) {
        const errMsg = err.message || 'Network connection failed. Please retry.';
        setError(errMsg);
        if (isManualRefresh) {
          showToast({ message: errMsg, type: 'danger' });
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [data, showToast]
  );

  useEffect(() => {
    fetchDashboard();
  }, []);

  const onRefresh = useCallback(() => {
    fetchDashboard(true);
  }, [fetchDashboard]);

  return {
    data,
    loading,
    refreshing,
    error,
    refetch: () => fetchDashboard(false),
    onRefresh,
  };
};
