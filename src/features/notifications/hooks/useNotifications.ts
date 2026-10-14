import { useState, useEffect, useCallback } from 'react';
import { notificationsService } from '../../../services/api/notificationsService';
import { NotificationItem, NotificationCategory } from '../../../types/notifications';
import { useToast } from '../../../components/feedback';

export interface UseNotificationsResult {
  items: NotificationItem[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  selectedCategory: NotificationCategory;
  selectedNotification: NotificationItem | null;
  setSelectedCategory: (category: NotificationCategory) => void;
  openNotification: (item: NotificationItem) => void;
  closeNotification: () => void;
  refetch: () => Promise<void>;
  onRefresh: () => void;
}

export const useNotifications = (): UseNotificationsResult => {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<NotificationCategory>('ALL');
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);

  const { showToast } = useToast();

  const fetchItems = useCallback(
    async (isManualRefresh: boolean = false) => {
      if (isManualRefresh) {
        setRefreshing(true);
      } else if (items.length === 0) {
        setLoading(true);
      }

      try {
        const res = await notificationsService.getNotifications(selectedCategory);
        if (res.success && res.data) {
          setItems(res.data);
          setError(null);
        } else {
          const errMsg = res.error || 'Failed to fetch circulars';
          setError(errMsg);
          if (isManualRefresh) {
            showToast({ message: errMsg, type: 'danger' });
          }
        }
      } catch (err: any) {
        const errMsg = err.message || 'Network connection failed';
        setError(errMsg);
        if (isManualRefresh) {
          showToast({ message: errMsg, type: 'danger' });
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [selectedCategory, items.length, showToast]
  );

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const onRefresh = useCallback(() => {
    fetchItems(true);
  }, [fetchItems]);

  const openNotification = (item: NotificationItem) => {
    setSelectedNotification(item);
    if (!item.isRead) {
      notificationsService.markAsRead(item.id);
      setItems((prev) =>
        prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n))
      );
    }
  };

  const closeNotification = () => {
    setSelectedNotification(null);
  };

  return {
    items,
    loading,
    refreshing,
    error,
    selectedCategory,
    selectedNotification,
    setSelectedCategory,
    openNotification,
    closeNotification,
    refetch: () => fetchItems(false),
    onRefresh,
  };
};
