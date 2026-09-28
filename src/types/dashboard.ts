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
