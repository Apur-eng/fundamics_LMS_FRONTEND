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
import { StudentAttendanceSummaryCard } from '../components/StudentAttendanceSummaryCard';
import { StudentPerformanceCard } from '../components/StudentPerformanceCard';
import { StudentRecentActivityCard } from '../components/StudentRecentActivityCard';
import { DashboardSkeleton } from '../components/DashboardSkeleton';
import { TestResultDetailSheet } from '../../results/components/TestResultDetailSheet';
import { useStudentDashboard } from '../hooks/useStudentDashboard';
import { useAuth } from '../../../app/providers/AuthContext';
import { RecentResultItem } from '../../../types/dashboard';

export const StudentDashboardScreen: React.FC = () => {
  const { colors, spacing, borderRadius } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { user } = useAuth();

  const { data, loading, refreshing, error, refetch, onRefresh } = useStudentDashboard();

  // Test inspection modal sheet state
  const [selectedResult, setSelectedResult] = useState<RecentResultItem | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);

  // Safe bottom padding so scrollable content is NEVER hidden behind bottom tab bar
  const bottomContentPadding = Math.max(insets.bottom, 16) + 80;

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
            tintColor={colors.navy}
            colors={[colors.navy]}
          />
        }
      >
        {/* 1. BRAND-LED RESTRAINED NAVY PROFILE HEADER */}
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
          onProfilePress={() => navigation.navigate('StudentProfile')}
        />

        {/* 2. CARD CONTENT CONTAINER WITH STRICT VISUAL HIERARCHY */}
        <View style={[styles.mainCardsSection, { paddingHorizontal: spacing.screenPadding }]}>
          {/* Background Sync Error Banner (Non-destructive) */}
          {error && (
            <View
              style={[
                styles.syncErrorBanner,
                {
                  backgroundColor: colors.dangerContainer,
                  borderColor: colors.danger,
                  borderRadius: borderRadius.sm,
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

          {/* HIERARCHY #1: ATTENDANCE OVERVIEW (Most visually prominent academic component) */}
          <StudentAttendanceSummaryCard
            percentage={attendance.percentage}
            presentDays={attendance.presentDays}
            totalDays={attendance.totalDays}
            status={attendance.status}
            onViewDetails={() => navigation.navigate('StudentAttendanceTab')}
          />

          {/* HIERARCHY #2: EXAMINATION PERFORMANCE */}
          <StudentPerformanceCard
            metrics={performanceMetrics}
            results={recentResults}
            onSelectResult={handleSelectResult}
            onViewAll={() => navigation.navigate('StudentResultsTab')}
          />

          {/* HIERARCHY #3: RECENT ACADEMIC ACTIVITY (Unified chronological stream) */}
          <StudentRecentActivityCard
            recentResults={recentResults}
            studyResources={studyResources}
            notices={notices}
            onSelectResult={handleSelectResult}
            onNavigateStudyMaterial={() => navigation.navigate('StudentStudyMaterialTab')}
            onNavigateNotices={() => navigation.navigate('StudentNotificationsTab')}
            onNavigateResults={() => navigation.navigate('StudentResultsTab')}
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
    borderWidth: 1,
    marginBottom: 12,
  },
});
