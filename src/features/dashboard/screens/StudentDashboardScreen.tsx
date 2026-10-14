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
import { StudentAcademicHeader } from '../components/StudentAcademicHeader';
import { AttendanceCalendarPreview } from '../components/AttendanceCalendarPreview';
import { AcademicExaminationRecord } from '../components/AcademicExaminationRecord';
import { TodayTimeline } from '../components/TodayTimeline';
import { CompactNoticesRow } from '../components/CompactNoticesRow';
import { DashboardSkeleton } from '../components/DashboardSkeleton';
import { TestResultDetailSheet } from '../../results/components/TestResultDetailSheet';
import { useStudentDashboard } from '../hooks/useStudentDashboard';
import { RecentResultItem } from '../../../types/dashboard';

export const StudentDashboardScreen: React.FC = () => {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  const { data, loading, refreshing, error, refetch, onRefresh } = useStudentDashboard();

  // Test inspection modal sheet state
  const [selectedResult, setSelectedResult] = useState<RecentResultItem | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);

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
    dayWiseAttendance,
    performanceMetrics,
    upcomingClasses,
    recentResults,
    notices,
  } = data;

  const handleSelectResult = (item: RecentResultItem) => {
    setSelectedResult(item);
    setDetailVisible(true);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: Math.max(insets.top, 14),
            paddingHorizontal: spacing.screenPadding,
            paddingBottom: spacing.massive,
          },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* Background Sync Error Banner (Non-destructive) */}
        {error && (
          <View
            style={[
              styles.syncErrorBanner,
              {
                backgroundColor: colors.dangerContainer,
                borderColor: colors.danger,
                borderRadius: 6,
                padding: spacing.sm,
                marginBottom: spacing.md,
              },
            ]}
          >
            <Ionicons name="cloud-offline-outline" size={16} color={colors.danger} style={{ marginRight: 6 }} />
            <Text variant="caption" color="danger" style={{ flex: 1 }}>
              Sync error: {error}. Presenting offline cached academic records.
            </Text>
            <TouchableOpacity onPress={refetch} activeOpacity={0.7} style={{ marginLeft: 6 }}>
              <Text variant="caption" color="danger" weight="700">
                Retry
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 1. COMPACT ACADEMIC GRADIENT HEADER */}
        <StudentAcademicHeader
          greeting={data.greeting}
          studentName={academicProfile.studentName}
          admissionNumber={academicProfile.admissionNumber}
          classGrade={academicProfile.classGrade}
          board={academicProfile.board}
          branch={academicProfile.branch}
        />

        {/* 2. ATTENDANCE HERO & DAY-WISE MONTHLY CALENDAR (Primary Pillar) */}
        <AttendanceCalendarPreview
          overallPercentage={attendance.percentage}
          presentDays={attendance.presentDays}
          totalDays={attendance.totalDays}
          monthlyData={dayWiseAttendance}
          onViewAll={() => navigation.navigate('StudentAttendance')}
        />

        {/* 3. EXAMINATION RECORD & HISTORICAL PERFORMANCE (Second Primary Pillar) */}
        <AcademicExaminationRecord
          metrics={performanceMetrics}
          results={recentResults}
          onSelectResult={handleSelectResult}
          onViewAll={() => navigation.navigate('StudentResultsTab')}
        />

        {/* 4. TODAY'S SESSIONS (Secondary Content: Timetable Ledger) */}
        <TodayTimeline
          classes={upcomingClasses}
          onClassPress={() => navigation.navigate('StudentClassesTab')}
        />

        {/* 5. OFFICIAL CIRCULARS & NOTICES (Secondary Content: Minimal Row) */}
        <CompactNoticesRow
          notices={notices}
          onViewAll={() => navigation.navigate('StudentNotificationsTab')}
          onNoticePress={() => navigation.navigate('StudentNotificationsTab')}
        />
      </ScrollView>

      {/* Test Result Inspection Detail Sheet */}
      <TestResultDetailSheet
        visible={detailVisible}
        onClose={() => setDetailVisible(false)}
        result={selectedResult}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContent: {},
  syncErrorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
});
