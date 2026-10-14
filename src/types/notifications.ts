export type NotificationCategory =
  | 'ALL'
  | 'ACADEMIC'
  | 'EXAMINATIONS'
  | 'ADMINISTRATIVE'
  | 'SCHEDULE';

export interface NotificationItem {
  id: string;
  title: string;
  content: string;
  category: NotificationCategory;
  date: string;
  isUrgent?: boolean;
  isRead?: boolean;
  signatory?: string;
  attachmentName?: string;
}
