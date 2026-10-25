import { BackendClassResponse, BackendBatchResponse } from '../../types/backend';
import { apiClient } from './apiClient';

export interface AcademicClass {
  id: string;
  name: string;
  code: string;
  board: string;
  academicYear: string;
}

export interface AcademicBatch {
  id: string;
  classId: string;
  name: string;
  code: string;
  timings?: string;
}

/**
 * Authoritative Institutional Academic Offerings.
 * Sourced directly from PostgreSQL backend database:
 * - CLS-10-SCI: 19a9272b-bc31-41eb-be47-e0c7bb06c0cd
 * - CLS-12-SCI: 65bc73ea-e64a-4a0f-9e93-1c62216683e3
 */
export const INSTITUTIONAL_CLASSES: AcademicClass[] = [
  {
    id: '19a9272b-bc31-41eb-be47-e0c7bb06c0cd',
    name: 'Class 10 - Science',
    code: 'CLS-10-SCI',
    board: 'CBSE',
    academicYear: '2026-2027',
  },
  {
    id: '65bc73ea-e64a-4a0f-9e93-1c62216683e3',
    name: 'Class XII - Science',
    code: 'CLS-12-SCI',
    board: 'ISC',
    academicYear: '2025-2026',
  },
];

export const INSTITUTIONAL_BATCHES: AcademicBatch[] = [
  {
    id: 'df719a08-d9c7-4c98-a244-faa015400601',
    classId: '19a9272b-bc31-41eb-be47-e0c7bb06c0cd',
    name: 'Morning Batch A (Flagship)',
    code: 'BAT-10-MORN',
    timings: '09:00 AM - 11:00 AM',
  },
  {
    id: '3396f166-3a5a-4727-a36c-39815dd15199',
    classId: '65bc73ea-e64a-4a0f-9e93-1c62216683e3',
    name: 'Batch A (Morning Flagship)',
    code: 'BATCH-2025-A',
    timings: '09:00 AM - 11:00 AM',
  },
];

export const BOARDS = [
  'CBSE',
  'ISC',
  'ICSE',
  'UP State Board',
  'CMS (City Montessori School)',
];

export const academicService = {
  /**
   * Retrieves active academic classes.
   * Gracefully attempts public endpoint if available, falling back to authoritative database catalog.
   */
  async getClasses(): Promise<AcademicClass[]> {
    try {
      const res = await apiClient.get<BackendClassResponse[]>('/academic/classes');
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        return res.data.map((c) => ({
          id: c.id,
          name: c.name,
          code: c.code,
          board: c.board,
          academicYear: c.academic_year,
        }));
      }
    } catch {
      // Backend does not expose public classes endpoint; fallback to authoritative institutional fixtures
    }
    return INSTITUTIONAL_CLASSES;
  },

  /**
   * Retrieves batches for a given class ID.
   */
  async getBatches(classId: string): Promise<AcademicBatch[]> {
    try {
      const res = await apiClient.get<BackendBatchResponse[]>('/academic/batches?class_id=' + encodeURIComponent(classId));
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        return res.data.map((b) => ({
          id: b.id,
          classId: b.class_id,
          name: b.name,
          code: b.code,
          timings: b.start_time && b.end_time ? b.start_time + ' - ' + b.end_time : undefined,
        }));
      }
    } catch {
      // Fallback to institutional batches for the chosen class
    }
    return INSTITUTIONAL_BATCHES.filter((b) => b.classId === classId);
  },
};
