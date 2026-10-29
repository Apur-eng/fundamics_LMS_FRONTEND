import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Splash: undefined;
  Login: { prefillEmail?: string; initialMessage?: string } | undefined;
  Register: undefined;
  ApplicationStatus: {
    email?: string;
    prefillToken?: string;
    initialStatus?: 'PENDING_VERIFICATION' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';
  } | undefined;
  ForgotPassword: { email?: string } | undefined;
  ResetPassword: { token?: string; email?: string } | undefined;
};

export type StudentTabParamList = {
  StudentDashboardTab: undefined;
  StudentAttendanceTab: undefined;
  StudentStudyMaterialTab: undefined;
  StudentResultsTab: undefined;
  StudentNotificationsTab: undefined;
  // Backward compatibility aliases if any external callers use previous tab names
  StudentClassesTab?: undefined;
  StudentAssignmentsTab?: undefined;
};

export type StudentStackParamList = {
  StudentTabs: NavigatorScreenParams<StudentTabParamList> | undefined;
  StudentAttendance: undefined;
  StudentProfile: undefined;
  StudentStudyMaterial: undefined;
};

export type TeacherTabParamList = {
  TeacherDashboardTab: undefined;
  TeacherAttendanceTab: undefined;
  TeacherClassesTab: undefined;
  TeacherExamsTab: undefined;
  TeacherNotificationsTab: undefined;
};

export type AdminTabParamList = {
  AdminDashboardTab: undefined;
  AdminStudentsTab: undefined;
  AdminFeesTab: undefined;
  AdminNotificationsTab: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  StudentApp: NavigatorScreenParams<StudentStackParamList>;
  TeacherApp: NavigatorScreenParams<TeacherTabParamList>;
  AdminApp: NavigatorScreenParams<AdminTabParamList>;
};
