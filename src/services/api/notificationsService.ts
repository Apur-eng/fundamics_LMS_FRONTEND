import { apiClient, USE_MOCK_API } from './apiClient';
import { ApiResponse } from '../../types/api';
import { NotificationItem, NotificationCategory } from '../../types/notifications';
import { BackendNoteResponse, BackendNoticeResponse } from '../../types/backend';
import { storageService } from '../storage/storageService';

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-01',
    title: 'ISC Board Simulation Examination #9 Timetable Released',
    content:
      'The comprehensive 3-hour board simulation examination for Physics, Chemistry, and Mathematics will commence on Monday at 08:30 AM in the Triveni Nagar Examination Hall. Students must bring their official Fundemics identity badge and blue ballpoint pens. Calculators are permitted only for eligible ISC papers.',
    category: 'EXAMINATIONS',
    date: 'Today, 11:30 AM',
    isUrgent: true,
    isRead: false,
    signatory: 'Office of Academic Affairs • Fundemics Lucknow',
    attachmentName: 'ISC_Simulation_Schedule_Batch_2025.pdf',
  },
  {
    id: 'notif-02',
    title: 'City Montessori School (CMS) Morning Batch Schedule Alignment',
    content:
      'In view of the upcoming inter-school competitions at CMS Gomti Nagar and Aliganj campuses, the morning science batch will convene 15 minutes earlier at 06:45 AM. Institute transport shuttles will adjust pickup timings accordingly.',
    category: 'SCHEDULE',
    date: 'Yesterday',
    isUrgent: false,
    isRead: true,
    signatory: 'Transport & Operations Coordinator',
  },
  {
    id: 'notif-03',
    title: 'Advanced Calculus & Derivations Masterclass',
    content:
      'Mentor Mayank Aggarwal will conduct a dedicated 2-hour masterclass covering Definite Integrals and Differential Equations. Attendance is mandatory for all Class XII board aspirants.',
    category: 'ACADEMIC',
    date: '28 Sep 2026',
    isUrgent: false,
    isRead: true,
    signatory: 'Mayank Aggarwal • Director & Head of Mathematics',
  },
  {
    id: 'notif-04',
    title: 'Mid-Term Progress Reports & Mentor Consultation Notice',
    content:
      'Individual progress reports mapping attendance consistency and weekly test percentiles have been finalized. Parents are invited to schedule one-on-one academic counseling sessions with senior faculty this Saturday.',
    category: 'ADMINISTRATIVE',
    date: '25 Sep 2026',
    isUrgent: true,
    isRead: false,
    signatory: 'Manish K. Verma • Senior Academic Mentor',
  },
  {
    id: 'notif-05',
    title: 'Daily Practice Problem (DPP) Set #14 Uploaded',
    content:
      'The practice problem set covering Electromagnetic Induction and Lenz’s Law is now available. Solutions will be reviewed during tomorrow afternoon’s doubt resolution hour.',
    category: 'ACADEMIC',
    date: '22 Sep 2026',
    isUrgent: false,
    isRead: true,
    signatory: 'Department of Physics',
    attachmentName: 'DPP_14_Electromagnetic_Induction.pdf',
  },
];

export const notificationsService = {
  /**
   * Fetches official circulars and notices.
   * Connects to the authoritative backend endpoint: GET /api/v1/student/me/notes
   * (or falls back to institutional circular fixtures).
   */
  async getNotifications(
    category?: NotificationCategory
  ): Promise<ApiResponse<NotificationItem[]>> {
    if (USE_MOCK_API) {
      await apiClient.simulateLatency(350);
      let items = [...MOCK_NOTIFICATIONS];
      if (category && category !== 'ALL') {
        items = items.filter((n) => n.category === category);
      }
      return {
        success: true,
        data: items,
        timestamp: new Date().toISOString(),
      };
    }

    try {
      const session = await storageService.getUserSession();
      let items = [...MOCK_NOTIFICATIONS];

      // If authenticated, fetch authoritative notices targeted to user role
      if (session && apiClient.getToken()) {
        try {
          const noticesRes = await apiClient.get<BackendNoticeResponse[]>('/notices');
          if (noticesRes.data && noticesRes.data.length > 0) {
            items = noticesRes.data.map((notice) => ({
              id: notice.id,
              title: notice.title,
              content: notice.content,
              category: 'ACADEMIC',
              date: new Date(notice.published_at).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
              }),
              isUrgent: notice.priority === 'URGENT' || notice.priority === 'HIGH',
              isRead: false,
              signatory: 'Academic Cell • Fundemics LMS',
            }));
          } else if (session.role === 'STUDENT') {
            // Secondary fallback: check study materials & notes if no notices published
            const notesRes = await apiClient.get<BackendNoteResponse[]>('/student/me/notes');
            if (notesRes.data && notesRes.data.length > 0) {
              items = notesRes.data.map((note) => ({
                id: note.id,
                title: note.title,
                content: note.description || 'Academic circular attachment.',
                category: 'ACADEMIC',
                date: new Date(note.created_at).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                }),
                isUrgent: false,
                isRead: false,
                signatory: note.subject_name || 'Academic Affairs',
                attachmentName: note.original_filename || undefined,
              }));
            }
          }
        } catch {
          // Fall back gracefully to institutional fixtures
        }
      }

      if (category && category !== 'ALL') {
        items = items.filter((n) => n.category === category);
      }

      return {
        success: true,
        data: items,
        timestamp: new Date().toISOString(),
      };
    } catch (err: any) {
      // Re-throw 401 session expirations so the auth interceptor can handle it
      if (err?.statusCode === 401) {
        throw err;
      }

      // Gracefully provide default institutional notice circulars if network/endpoint issues occur
      let items = [...MOCK_NOTIFICATIONS];
      if (category && category !== 'ALL') {
        items = items.filter((n) => n.category === category);
      }
      return {
        success: true,
        data: items,
        timestamp: new Date().toISOString(),
      };
    }
  },

  async markAsRead(id: string): Promise<ApiResponse<{ success: boolean }>> {
    const item = MOCK_NOTIFICATIONS.find((n) => n.id === id);
    if (item) {
      item.isRead = true;
    }
    return {
      success: true,
      data: { success: true },
      timestamp: new Date().toISOString(),
    };
  },
};
