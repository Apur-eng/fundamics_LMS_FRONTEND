import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme';
import { Text } from '../../../components/common/Text';
import { Card } from '../../../components/common/Card';
import { Badge } from '../../../components/common/Badge';
import { LoadingState } from '../../../components/feedback/LoadingState';
import { ErrorState } from '../../../components/feedback/ErrorState';
import { DashboardHeader } from '../components/DashboardHeader';
import { StatCard } from '../components/StatCard';
import { UpcomingClassCard } from '../components/UpcomingClassCard';
import { dashboardService } from '../../../services/api/dashboardService';
import { StudentDashboardData } from '../../../types/dashboard';

export const StudentDashboardScreen: React.FC = () => {
  const { colors, spacing, borderRadius } = useTheme();

  const [data, setData] = useState<StudentDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    try {
      const res = await dashboardService.getStudentDashboard();
      if (res.success && res.data) {
        setData(res.data);
        setError(null);
      } else {
        setError('Failed to load dashboard data');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboard();
  };

  if (loading) {
    return <LoadingState message="Fetching student timetable and records..." fullScreen />;
  }

  if (error || !data) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center' }}>
        <ErrorState message={error || 'No student data found'} onRetry={fetchDashboard} />
      </View>
    );
  }

  const { academicProfile, attendance, upcomingClasses, recentResults, notices } = data;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={[
        styles.scrollContent,
        { paddingHorizontal: spacing.screenPadding, paddingBottom: spacing.massive },
      ]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.primary}
          colors={[colors.primary]}
        />
      }
    >
      {/* Header */}
      <DashboardHeader
        greeting={data.greeting}
        subtitle={`${academicProfile.classGrade} • ${academicProfile.board}`}
        badgeLabel="Enrolled Scholar"
      />

      {/* Attendance & Performance Stats Row */}
      <View style={[styles.statsRow, { marginBottom: spacing.lg }]}>
        <StatCard
          label="Attendance Rate"
          value={`${attendance.percentage}%`}
          subValue={`${attendance.presentDays}/${attendance.totalDays} sessions`}
          iconName="calendar-outline"
          variant="accent"
        />
        <View style={{ width: spacing.md }} />
        <StatCard
          label="Simulations Taken"
          value={recentResults.length}
          subValue="Last 30 days"
          iconName="trophy-outline"
          variant="distinction"
        />
      </View>

      {/* Institutional Notices Banner */}
      {notices && notices.length > 0 && (
        <View style={{ marginBottom: spacing.lg }}>
          <View style={styles.sectionHeader}>
            <Text variant="h3" color="primary" weight="700">
              Notice Board
            </Text>
            <Badge label="Official" variant="neutral" size="sm" />
          </View>

          {notices.map((notice) => (
            <Card
              key={notice.id}
              elevation="sm"
              padding="md"
              style={[
                styles.noticeCard,
                notice.isUrgent && { borderLeftColor: colors.accent, borderLeftWidth: 4 },
              ]}
            >
              <View style={styles.noticeHeader}>
                <Badge
                  label={notice.category}
                  variant={notice.isUrgent ? 'accent' : 'neutral'}
                  size="sm"
                />
                <Text variant="caption" color="muted">
                  {notice.date}
                </Text>
              </View>
              <Text variant="body" color="primary" weight="600" style={{ marginTop: 6 }}>
                {notice.title}
              </Text>
            </Card>
          ))}
        </View>
      )}

      {/* Today's Classes Section */}
      <View style={{ marginBottom: spacing.lg }}>
        <View style={styles.sectionHeader}>
          <Text variant="h3" color="primary" weight="700">
            Classes Today
          </Text>
          <Text variant="caption" color="secondary">
            {upcomingClasses.length} Scheduled
          </Text>
        </View>

        {upcomingClasses.map((cls) => (
          <UpcomingClassCard key={cls.id} item={cls} />
        ))}
      </View>

      {/* Recent Test Results Section */}
      <View style={{ marginBottom: spacing.md }}>
        <View style={styles.sectionHeader}>
          <Text variant="h3" color="primary" weight="700">
            Recent Assessment Scores
          </Text>
        </View>

        {recentResults.map((res) => (
          <Card key={res.id} elevation="sm" padding="md" style={styles.resultCard}>
            <View style={styles.resultRow}>
              <View style={{ flex: 1 }}>
                <Text variant="body" color="primary" weight="600">
                  {res.testName}
                </Text>
                <Text variant="caption" color="secondary" style={{ marginTop: 2 }}>
                  {res.subject} • {res.date}
                </Text>
              </View>

              <Badge
                label={`${res.score}/${res.maxScore}`}
                variant={res.score >= 90 ? 'distinction' : 'accent'}
                size="md"
              />
            </View>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: 16,
  },
  statsRow: {
    flexDirection: 'row',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  noticeCard: {
    marginBottom: 10,
  },
  noticeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultCard: {
    marginBottom: 10,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
