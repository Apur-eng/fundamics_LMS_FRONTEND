export interface UpcomingClassItem {
  id: string;
  subject: string;
  topic: string;
  teacherName: string;
  time: string;
  room: string;
  status: 'UPCOMING' | 'LIVE' | 'COMPLETED';
}

export interface RecentResultItem {
  id: string;
  testName: string;
  subject: string;
  score: number;
  maxScore: number;
  date: string;
}

export interface DayAttendanceRecord {
  date: string; // YYYY-MM-DD
  dayNumber: number; // 1-31
  dayOfWeek: number; // 0 (Sun) to 6 (Sat)
  status: 'PRESENT' | 'ABSENT' | 'OFF';
  remarks?: string;
}

export interface MonthlyAttendanceSummary {
  monthName: string; // e.g. "September 2026"
  monthKey: string; // "2026-09"
  presentDays: number;
  absentDays: number;
  scheduledDays: number;
  percentage: number;
  records: DayAttendanceRecord[];
}

export interface PerformanceTrendPoint {
  id: string;
  label: string; // e.g. "T1", "T2"
  testName: string;
  score: number;
  maxScore: number;
  percentage: number;
  date: string;
}

export interface PerformanceMetrics {
  averageScore: number;
  deltaTrend: number; // e.g. +4.6
  trendDirection: 'UP' | 'DOWN' | 'STABLE';
  testsCompleted: number;
  highestScore: number;
  trendPoints: PerformanceTrendPoint[];
}

export interface NoticeItem {
  id: string;
  title: string;
  category: string;
  date: string;
  isUrgent?: boolean;
}

export interface StudentDashboardData {
  greeting: string;
  academicProfile: {
    studentName: string;
    admissionNumber: string;
    classGrade: string;
    board: string;
    branch: string;
  };
  attendance: {
    percentage: number;
    presentDays: number;
    totalDays: number;
    status: 'EXCELLENT' | 'GOOD' | 'WARNING';
  };
  dayWiseAttendance?: MonthlyAttendanceSummary;
  performanceMetrics?: PerformanceMetrics;
  upcomingClasses: UpcomingClassItem[];
  recentResults: RecentResultItem[];
  notices: NoticeItem[];
}

export interface TeacherScheduleItem {
  id: string;
  batchName: string;
  subject: string;
  time: string;
  room: string;
  attendanceMarked: boolean;
}

export interface TeacherTaskItem {
  id: string;
  title: string;
  deadline: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface TeacherDashboardData {
  greeting: string;
  facultyProfile: {
    name: string;
    department: string;
    designation: string;
    branch: string;
  };
  metrics: {
    totalBatches: number;
    totalStudents: number;
    pendingAssessments: number;
    classesToday: number;
  };
  todaySchedule: TeacherScheduleItem[];
  urgentTasks: TeacherTaskItem[];
}

export interface BranchOverviewItem {
  branchName: string;
  studentCount: number;
  facultyCount: number;
  attendanceRate: number;
}

export interface SystemActivityItem {
  id: string;
  activity: string;
  timestamp: string;
  actor: string;
}

export interface AdminDashboardData {
  metrics: {
    activeStudents: number;
    activeFaculty: number;
    overallAttendanceToday: number;
    feeCollectionProgress: number;
  };
  branchOverviews: BranchOverviewItem[];
  recentSystemActivity: SystemActivityItem[];
}
