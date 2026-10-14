/**
 * MOCK DATA REPOSITORY
 * =========================================================================
 * NOTE: These mock fixtures are strictly for development phase testing.
 * They replicate the exact payload contracts expected from the FastAPI backend.
 * All mock data is clearly isolated and marked for replacement in future phases.
 * =========================================================================
 */

import { User } from '../../types/auth';
import {
  StudentDashboardData,
  TeacherDashboardData,
  AdminDashboardData,
  MonthlyAttendanceSummary,
  PerformanceMetrics,
} from '../../types/dashboard';

// --- DEVELOPMENT FIXTURE: SEPTEMBER 2026 DAY-WISE ATTENDANCE ---
// Isolated fixture for visual validation while backend day-logs endpoint is developed.
export const DEV_FIXTURE_SEPTEMBER_ATTENDANCE: MonthlyAttendanceSummary = {
  monthName: 'September 2026',
  monthKey: '2026-09',
  presentDays: 24,
  absentDays: 2,
  scheduledDays: 26,
  percentage: 92.3,
  records: Array.from({ length: 30 }, (_, i) => {
    const day = i + 1;
    // 1 Sep 2026 was Tuesday (dayOfWeek = 2)
    const dayOfWeek = (2 + i) % 7; // 0=Sun, 1=Mon, ..., 6=Sat
    const date = `2026-09-${day < 10 ? '0' + day : day}`;

    if (dayOfWeek === 0) {
      return { date, dayNumber: day, dayOfWeek, status: 'OFF' as const, remarks: 'Sunday - Institute Closed' };
    }
    // Absent on day 16 and 25
    if (day === 16) {
      return { date, dayNumber: day, dayOfWeek, status: 'ABSENT' as const, remarks: 'Medical Leave' };
    }
    if (day === 25) {
      return { date, dayNumber: day, dayOfWeek, status: 'ABSENT' as const, remarks: 'Family Emergency' };
    }
    return { date, dayNumber: day, dayOfWeek, status: 'PRESENT' as const };
  }),
};

// --- DEVELOPMENT FIXTURE: TEST PERFORMANCE METRICS & TRENDS ---
export const DEV_FIXTURE_PERFORMANCE_METRICS: PerformanceMetrics = {
  averageScore: 91.8,
  deltaTrend: 4.6,
  trendDirection: 'UP',
  testsCompleted: 4,
  highestScore: 98,
  trendPoints: [
    { id: 'res-04', label: 'T1', testName: 'Weekly Test #6', score: 87, maxScore: 100, percentage: 87, date: '15 Sep' },
    { id: 'res-03', label: 'T2', testName: 'Organic Reactions', score: 91, maxScore: 100, percentage: 91, date: '20 Sep' },
    { id: 'res-02', label: 'T3', testName: 'Calculus Precision', score: 98, maxScore: 100, percentage: 98, date: '24 Sep' },
    { id: 'res-01', label: 'T4', testName: 'Board Simulation #8', score: 96, maxScore: 100, percentage: 96, date: '28 Sep' },
  ],
};

// --- MOCK USERS ---
export const MOCK_STUDENT_USER: User = {
  id: 'usr-std-001',
  name: 'Aryan Srivastava',
  email: 'aryan.srivastava@student.fundamics.in',
  phone: '9876543210',
  role: 'STUDENT',
  branchId: 'br-triveni',
  branchName: 'Triveni Nagar (Flagship Campus)',
  classOrDept: 'Class XII (ISC Science)',
  admissionNo: 'FND-2025-1042',
};

export const MOCK_TEACHER_USER: User = {
  id: 'usr-tch-001',
  name: 'Manish K. Verma',
  email: 'manish.verma@fundamics.in',
  phone: '7800001288',
  role: 'TEACHER',
  branchId: 'br-triveni',
  branchName: 'Triveni Nagar & Aliganj',
  classOrDept: 'Department of Physics & Mathematics',
};

export const MOCK_ADMIN_USER: User = {
  id: 'usr-adm-001',
  name: 'Mayank Aggarwal',
  email: 'admin@fundamics.in',
  phone: '7617018888',
  role: 'ADMIN',
  branchId: 'br-all',
  branchName: 'Central Academic Administration',
  classOrDept: 'Executive Leadership',
};

// --- MOCK STUDENT DASHBOARD PAYLOAD ---
export const MOCK_STUDENT_DASHBOARD: StudentDashboardData = {
  greeting: 'Good afternoon, Aryan',
  academicProfile: {
    studentName: 'Aryan Srivastava',
    admissionNumber: 'FND-2025-1042',
    classGrade: 'Class XII — Science (PCM)',
    board: 'ISC Board',
    branch: 'Triveni Nagar Campus',
  },
  attendance: {
    percentage: 94.2,
    presentDays: 81,
    totalDays: 86,
    status: 'EXCELLENT',
  },
  dayWiseAttendance: DEV_FIXTURE_SEPTEMBER_ATTENDANCE,
  performanceMetrics: DEV_FIXTURE_PERFORMANCE_METRICS,
  upcomingClasses: [
    {
      id: 'cls-01',
      subject: 'Physics',
      topic: 'Electromagnetic Induction & Alternating Current',
      teacherName: 'Manish K. Verma (IIT Dhanbad)',
      time: '10:30 AM – 12:00 PM',
      room: 'Hall A (Smart Room)',
      status: 'LIVE',
    },
    {
      id: 'cls-02',
      subject: 'Mathematics',
      topic: 'Definite Integrals & Calculus Precision',
      teacherName: 'Mayank Aggarwal',
      time: '12:00 PM – 01:30 PM',
      room: 'Room 102',
      status: 'UPCOMING',
    },
    {
      id: 'cls-03',
      subject: 'Chemistry',
      topic: 'Organic Reaction Mechanisms & Kinetics',
      teacherName: 'Dr. S. K. Gupta',
      time: '02:00 PM – 03:30 PM',
      room: 'Chemistry Lab 2',
      status: 'UPCOMING',
    },
  ],
  recentResults: [
    {
      id: 'res-01',
      testName: 'Weekly Board Simulation #8',
      subject: 'Physics',
      score: 96,
      maxScore: 100,
      date: '2026-09-28',
    },
    {
      id: 'res-02',
      testName: 'Calculus Precision Check',
      subject: 'Mathematics',
      score: 98,
      maxScore: 100,
      date: '2026-09-24',
    },
    {
      id: 'res-03',
      testName: 'Organic Reactions Unit Test',
      subject: 'Chemistry',
      score: 91,
      maxScore: 100,
      date: '2026-09-20',
    },
    {
      id: 'res-04',
      testName: 'Weekly Test #6',
      subject: 'Physics',
      score: 87,
      maxScore: 100,
      date: '2026-09-15',
    },
  ],
  notices: [
    {
      id: 'not-01',
      title: 'Pre-Board Mock Series datesheet released for ISC Class XII',
      category: 'Exams',
      date: '26 Sep 2026',
      isUrgent: false,
    },
    {
      id: 'not-02',
      title: 'Sunday doubt clearance session announced for Physics',
      category: 'Academic Batch',
      date: '28 Sep 2026',
      isUrgent: true,
    },
  ],
};

// --- MOCK TEACHER DASHBOARD PAYLOAD ---
export const MOCK_TEACHER_DASHBOARD: TeacherDashboardData = {
  greeting: 'Welcome back, Sir',
  facultyProfile: {
    name: 'Manish K. Verma',
    department: 'Department of Physics & Mathematics',
    designation: 'Senior Faculty & Co-Founder',
    branch: 'Triveni Nagar & Aliganj',
  },
  metrics: {
    totalBatches: 5,
    totalStudents: 148,
    pendingAssessments: 12,
    classesToday: 3,
  },
  todaySchedule: [
    {
      id: 'sch-01',
      batchName: 'Batch P1 (Class XII ISC Science)',
      subject: 'Physics (EMI & AC)',
      time: '04:30 PM – 06:00 PM',
      room: 'Hall A',
      attendanceMarked: false,
    },
    {
      id: 'sch-02',
      batchName: 'Batch M2 (Class XI ISC PCM)',
      subject: 'Physics (Rotational Dynamics)',
      time: '06:15 PM – 07:45 PM',
      room: 'Hall B',
      attendanceMarked: false,
    },
    {
      id: 'sch-03',
      batchName: 'Special CMS Advanced Guidance',
      subject: 'Problems in General Physics',
      time: '08:00 PM – 09:00 PM',
      room: 'Seminar Room',
      attendanceMarked: true,
    },
  ],
  urgentTasks: [
    {
      id: 'tsk-01',
      title: 'Evaluate Unit Test #8 Papers for Class XII Physics',
      deadline: 'Tomorrow, 5:00 PM',
      priority: 'HIGH',
    },
    {
      id: 'tsk-02',
      title: 'Upload Revision Notes for Wave Optics',
      deadline: '30 Sep 2026',
      priority: 'MEDIUM',
    },
  ],
};

// --- MOCK ADMIN DASHBOARD PAYLOAD ---
export const MOCK_ADMIN_DASHBOARD: AdminDashboardData = {
  metrics: {
    activeStudents: 542,
    activeFaculty: 24,
    overallAttendanceToday: 91.8,
    feeCollectionProgress: 88.5,
  },
  branchOverviews: [
    {
      branchName: 'Triveni Nagar Flagship',
      studentCount: 310,
      facultyCount: 14,
      attendanceRate: 93.4,
    },
    {
      branchName: 'Faizullaganj Branch',
      studentCount: 142,
      facultyCount: 6,
      attendanceRate: 89.6,
    },
    {
      branchName: 'Aliganj Extension',
      studentCount: 90,
      facultyCount: 4,
      attendanceRate: 91.1,
    },
  ],
  recentSystemActivity: [
    {
      id: 'act-01',
      activity: 'Batch P1 Attendance logged by Manish K. Verma',
      timestamp: '10 mins ago',
      actor: 'Manish K. Verma',
    },
    {
      id: 'act-02',
      activity: 'New admission confirmed: ICSE Class X (Triveni Nagar)',
      timestamp: '35 mins ago',
      actor: 'Admissions Office',
    },
    {
      id: 'act-03',
      activity: 'Notice published: Pre-Board Mock Series Schedule',
      timestamp: '2 hours ago',
      actor: 'Academic Cell',
    },
  ],
};
