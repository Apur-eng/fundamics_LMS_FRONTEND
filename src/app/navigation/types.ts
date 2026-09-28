import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  ForgotPassword: undefined;
  OtpVerification: { identifier: string };
};

export type StudentTabParamList = {
  StudentDashboardTab: undefined;
  StudentClassesTab: undefined;
  StudentAssignmentsTab: undefined;
  StudentResultsTab: undefined;
  StudentNotificationsTab: undefined;
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
  StudentApp: NavigatorScreenParams<StudentTabParamList>;
  TeacherApp: NavigatorScreenParams<TeacherTabParamList>;
  AdminApp: NavigatorScreenParams<AdminTabParamList>;
};
