import React, { useState } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme';
import { Text } from '../../../components/common/Text';
import { ErrorState } from '../../../components/feedback/ErrorState';
import { StudentProfileHeader } from '../components/StudentProfileHeader';
import { StudentQuickMetrics } from '../components/StudentQuickMetrics';
import { StudentAcademicOverview } from '../components/StudentAcademicOverview';
import { StudentAttendanceSummaryCard } from '../components/StudentAttendanceSummaryCard';
import { StudentPerformanceCard } from '../components/StudentPerformanceCard';
import { StudentClassesCard } from '../components/StudentClassesCard';
import { StudentStudyResourcesCard } from '../components/StudentStudyResourcesCard';
import { StudentNoticesCard } from '../components/StudentNoticesCard';
import { DashboardSkeleton } from '../components/DashboardSkeleton';
import { TestResultDetailSheet } from '../../results/components/TestResultDetailSheet';
import { useStudentDashboard } from '../hooks/useStudentDashboard';
import { useAuth } from '../../../app/providers/AuthContext';
import { RecentResultItem } from '../../../types/dashboard';

export const StudentDashboardScreen: React.FC = () => {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { user, logout } = useAuth();

  const { data, loading, refreshing, error, refetch, onRefresh } = useStudentDashboard();

  // Test inspection modal sheet state
  const [selectedResult, setSelectedResult] = useState<RecentResultItem | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);

  // Safe bottom padding so scrollable content is NEVER hidden behind bottom tab bar
  const bottomContentPadding = Math.max(insets.bottom, 16) + 84;

  if (loading && !data) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <DashboardSkeleton />
      </View>
    );
  }

  if (error && !data) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center' }}>
        <ErrorState message={error} onRetry={refetch} />
      </View>
    );
  }

  if (!data) return null;

  const {
    academicProfile,
    attendance,
    performanceMetrics,
    upcomingClasses,
    recentResults,
    notices,
    studyResources,
  } = data;

  const handleSelectResult = (item: RecentResultItem) => {
    setSelectedResult(item);
    setDetailVisible(true);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* SINGLE NATURAL VERTICAL SCROLL TREE */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: bottomContentPadding },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.brandBlue || colors.primary}
            colors={[colors.brandBlue || colors.primary]}
          />
        }
      >
        {/* 1. BRAND-LED COMPACT NATURAL-SCROLLING NAVY PROFILE HEADER */}
        <StudentProfileHeader
          studentName={academicProfile.studentName}
          greeting={data.greeting}
          admissionNumber={academicProfile.admissionNumber}
          classGrade={academicProfile.classGrade}
          board={academicProfile.board}
          branch={academicProfile.branch}
          avatarUrl={user?.avatarUrl}
          hasUnreadNotifications={notices && notices.length > 0}
          onNotificationPress={() => navigation.navigate('StudentNotificationsTab')}
          onSignOut={logout}
        />

        {/* 2. CARD CONTENT CONTAINER */}
        <View style={[styles.mainCardsSection, { paddingHorizontal: spacing.screenPadding }]}>
          {/* Background Sync Error Banner (Non-destructive) */}
          {error && (
            <View
              style={[
                styles.syncErrorBanner,
                {
                  backgroundColor: colors.dangerContainer,
                  borderColor: colors.danger,
                },
              ]}
            >
              <Ionicons name="cloud-offline-outline" size={16} color={colors.danger} style={{ marginRight: 6 }} />
              <Text variant="caption" color="danger" style={{ flex: 1 }}>
                Sync issue: {error}. Presenting cached academic records.
              </Text>
              <TouchableOpacity onPress={refetch} activeOpacity={0.7} style={{ marginLeft: 6 }}>
                <Text variant="caption" color="danger" weight="700">
                  Retry
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Quick Pulse Metrics (Attendance, Test Average, Classes) */}
          <StudentQuickMetrics
            attendancePercentage={attendance.percentage}
            presentDays={attendance.presentDays}
            totalDays={attendance.totalDays}
            testAverage={performanceMetrics?.averageScore}
            deltaTrend={performanceMetrics?.deltaTrend}
            trendDirection={performanceMetrics?.trendDirection}
            classesCount={upcomingClasses.length}
            nextClassTime={upcomingClasses.length > 0 ? upcomingClasses[0].time.split(' - ')[0] : undefined}
            onAttendancePress={() => navigation.navigate('StudentAttendance')}
            onPerformancePress={() => navigation.navigate('StudentResultsTab')}
            onTimetablePress={() => navigation.navigate('StudentClassesTab')}
          />

          {/* Academic Overview: Programme & Enrollment Details */}
          <StudentAcademicOverview
            classGrade={academicProfile.classGrade}
            board={academicProfile.board}
            admissionNumber={academicProfile.admissionNumber}
            branch={academicProfile.branch}
          />

          {/* Attendance Summary Card (Green accent, compliant status) */}
          <StudentAttendanceSummaryCard
            percentage={attendance.percentage}
            presentDays={attendance.presentDays}
            totalDays={attendance.totalDays}
            status={attendance.status}
            onViewDetails={() => navigation.navigate('StudentAttendance')}
          />

          {/* Test Performance Card (Blue & Gold accents) */}
          <StudentPerformanceCard
            metrics={performanceMetrics}
            results={recentResults}
            onSelectResult={handleSelectResult}
            onViewAll={() => navigation.navigate('StudentResultsTab')}
          />

          {/* Today's Timetable & Classes (Green accent) */}
          <StudentClassesCard
            classes={upcomingClasses}
            onViewAll={() => navigation.navigate('StudentClassesTab')}
          />

          {/* Study Resources / Notes (Brand blue accent) */}
          <StudentStudyResourcesCard
            resources={studyResources}
            onViewAll={() => navigation.navigate('StudentClassesTab')}
          />

          {/* Official Notices & Circulars (Warm accent) */}
          <StudentNoticesCard
            notices={notices}
            onViewAll={() => navigation.navigate('StudentNotificationsTab')}
          />
        </View>
      </ScrollView>

      {/* Test Result Inspection Bottom Sheet */}
      <TestResultDetailSheet
        visible={detailVisible}
        result={selectedResult}
        onClose={() => {
          setDetailVisible(false);
          setSelectedResult(null);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  mainCardsSection: {
    paddingTop: 14,
  },
  syncErrorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
});
