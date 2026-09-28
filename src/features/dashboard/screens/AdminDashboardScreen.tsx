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
import { dashboardService } from '../../../services/api/dashboardService';
import { AdminDashboardData } from '../../../types/dashboard';

export const AdminDashboardScreen: React.FC = () => {
  const { colors, spacing, borderRadius } = useTheme();

  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    try {
      const res = await dashboardService.getAdminDashboard();
      if (res.success && res.data) {
        setData(res.data);
        setError(null);
      } else {
        setError('Failed to load administrative overview');
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
    return <LoadingState message="Aggregating branch operations and records..." fullScreen />;
  }

  if (error || !data) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center' }}>
        <ErrorState message={error || 'No administrative data found'} onRetry={fetchDashboard} />
      </View>
    );
  }

  const { metrics, branchOverviews, recentSystemActivity } = data;

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
        greeting="Institute Administration"
        subtitle="Central Academic Command • Lucknow"
        badgeLabel="Director / Admin"
      />

      {/* KPI Metrics Matrix */}
      <View style={[styles.statsRow, { marginBottom: spacing.md }]}>
        <StatCard
          label="Enrolled Students"
          value={metrics.activeStudents}
          subValue="Across 3 campuses"
          iconName="people-outline"
          variant="primary"
        />
        <View style={{ width: spacing.md }} />
        <StatCard
          label="Faculty Members"
          value={metrics.activeFaculty}
          subValue="10 departments"
          iconName="school-outline"
          variant="accent"
        />
      </View>

      <View style={[styles.statsRow, { marginBottom: spacing.lg }]}>
        <StatCard
          label="Daily Attendance"
          value={`${metrics.overallAttendanceToday}%`}
          subValue="Institutional average"
          iconName="checkmark-circle-outline"
          variant="accent"
        />
        <View style={{ width: spacing.md }} />
        <StatCard
          label="Fee Realization"
          value={`${metrics.feeCollectionProgress}%`}
          subValue="Term installment target"
          iconName="wallet-outline"
          variant="distinction"
        />
      </View>

      {/* Branch Breakdown Section */}
      <View style={{ marginBottom: spacing.lg }}>
        <View style={styles.sectionHeader}>
          <Text variant="h3" color="primary" weight="700">
            Lucknow Branch Operations
          </Text>
        </View>

        {branchOverviews.map((branch, index) => (
          <Card key={index} elevation="sm" padding="md" style={styles.branchCard}>
            <View style={styles.branchHeader}>
              <View style={{ flex: 1 }}>
                <Text variant="h4" color="primary" weight="700">
                  {branch.branchName}
                </Text>
                <Text variant="caption" color="secondary" style={{ marginTop: 2 }}>
                  {branch.studentCount} Students • {branch.facultyCount} Faculty Staff
                </Text>
              </View>

              <Badge
                label={`${branch.attendanceRate}% Attendance`}
                variant="accent"
                size="sm"
              />
            </View>
          </Card>
        ))}
      </View>

      {/* Audit Log / Recent Activity Section */}
      <View style={{ marginBottom: spacing.md }}>
        <View style={styles.sectionHeader}>
          <Text variant="h3" color="primary" weight="700">
            Recent Institutional Activity
          </Text>
        </View>

        <Card elevation="sm" padding="md">
          {recentSystemActivity.map((act, index) => (
            <View
              key={act.id}
              style={[
                styles.activityRow,
                index !== recentSystemActivity.length - 1 && {
                  borderBottomColor: colors.borderLight,
                  borderBottomWidth: 1,
                  paddingBottom: spacing.sm,
                  marginBottom: spacing.sm,
                },
              ]}
            >
              <View style={[styles.activityDot, { backgroundColor: colors.primary }]} />
              <View style={{ flex: 1, marginLeft: spacing.sm }}>
                <Text variant="bodySmall" color="primary" weight="600">
                  {act.activity}
                </Text>
                <Text variant="caption" color="muted" style={{ marginTop: 2 }}>
                  {act.actor} • {act.timestamp}
                </Text>
              </View>
            </View>
          ))}
        </Card>
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
  branchCard: {
    marginBottom: 10,
  },
  branchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
  },
});
