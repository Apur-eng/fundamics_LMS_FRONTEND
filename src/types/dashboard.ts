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
  hasDocument?: boolean;
  documentFilename?: string | null;
  resultId?: string;
  publishedAt?: string | null;
}

export interface ResultDocumentItem {
  resultId: string;
  examId: string;
  examName: string;
  subjectName?: string;
  title: string;
  filename: string;
  publishedAt?: string | null;
  examDate?: string;
  score?: number;
  maxScore?: number;
  percentage?: number;
}

export interface DayAttendanceRecord {
  date: string; // YYYY-MM-DD
  dayNumber: number; // 1-31
  dayOfWeek: number; // 0 (Sun) to 6 (Sat)
  status: 'PRESENT' | 'ABSENT' | 'OFF' | 'HOLIDAY' | 'LATE' | 'EXCUSED';
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

export interface StudyResourceItem {
  id: string;
  title: string;
  subject?: string;
  originalFilename?: string;
  fileSizeBytes?: number;
  date?: string;
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
  studyResources?: StudyResourceItem[];
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
