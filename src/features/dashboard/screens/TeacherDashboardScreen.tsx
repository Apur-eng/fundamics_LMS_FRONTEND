import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme';
import { Text } from '../../../components/common/Text';
import { Card } from '../../../components/common/Card';
import { Badge } from '../../../components/common/Badge';
import { Button } from '../../../components/common/Button';
import { LoadingState } from '../../../components/feedback/LoadingState';
import { ErrorState } from '../../../components/feedback/ErrorState';
import { DashboardHeader } from '../components/DashboardHeader';
import { StatCard } from '../components/StatCard';
import { dashboardService } from '../../../services/api/dashboardService';
import { TeacherDashboardData } from '../../../types/dashboard';

export const TeacherDashboardScreen: React.FC = () => {
  const { colors, spacing, borderRadius } = useTheme();
  const insets = useSafeAreaInsets();

  const [data, setData] = useState<TeacherDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    try {
      const res = await dashboardService.getTeacherDashboard();
      if (res.success && res.data) {
        setData(res.data);
        setError(null);
      } else {
        setError('Failed to load teacher dashboard');
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
    return <LoadingState message="Fetching faculty rosters and schedules..." fullScreen />;
  }

  if (error || !data) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center' }}>
        <ErrorState message={error || 'No faculty data found'} onRetry={fetchDashboard} />
      </View>
    );
  }

  const { facultyProfile, metrics, todaySchedule, urgentTasks } = data;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={[
        styles.scrollContent,
        {
          paddingTop: Math.max(insets.top, 16),
          paddingHorizontal: spacing.screenPadding,
          paddingBottom: spacing.massive,
        },
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
        subtitle={`${facultyProfile.department} • ${facultyProfile.designation}`}
        badgeLabel="Senior Faculty"
      />

      {/* Metrics Grid */}
      <View style={[styles.statsRow, { marginBottom: spacing.md }]}>
        <StatCard
          label="Active Students"
          value={metrics.totalStudents}
          subValue={`${metrics.totalBatches} active batches`}
          iconName="people-outline"
          variant="primary"
        />
        <View style={{ width: spacing.md }} />
        <StatCard
          label="Classes Today"
          value={metrics.classesToday}
          subValue="Schedule on track"
          iconName="time-outline"
          variant="accent"
        />
      </View>

      <View style={[styles.statsRow, { marginBottom: spacing.lg }]}>
        <StatCard
          label="Pending Grading"
          value={metrics.pendingAssessments}
          subValue="Unit test papers"
          iconName="document-text-outline"
          variant="distinction"
        />
      </View>

      {/* Quick Actions Bar */}
      <Card elevation="sm" padding="md" style={{ marginBottom: spacing.lg }}>
        <Text variant="h4" color="primary" weight="700" style={{ marginBottom: spacing.sm }}>
          Quick Workflows
        </Text>
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: colors.surfaceVariant, borderRadius: borderRadius.md }]}
            activeOpacity={0.7}
          >
            <Ionicons name="checkmark-done-circle-outline" size={22} color={colors.accent} />
            <Text variant="caption" color="primary" weight="600" style={{ marginTop: 4 }}>
              Attendance
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: colors.surfaceVariant, borderRadius: borderRadius.md }]}
            activeOpacity={0.7}
          >
            <Ionicons name="create-outline" size={22} color={colors.primary} />
            <Text variant="caption" color="primary" weight="600" style={{ marginTop: 4 }}>
              Enter Marks
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: colors.surfaceVariant, borderRadius: borderRadius.md }]}
            activeOpacity={0.7}
          >
            <Ionicons name="megaphone-outline" size={22} color={colors.distinction} />
            <Text variant="caption" color="primary" weight="600" style={{ marginTop: 4 }}>
              Batch Notice
            </Text>
          </TouchableOpacity>
        </View>
      </Card>

      {/* Today's Teaching Schedule */}
      <View style={{ marginBottom: spacing.lg }}>
        <View style={styles.sectionHeader}>
          <Text variant="h3" color="primary" weight="700">
            Teaching Schedule Today
          </Text>
          <Badge label={`${todaySchedule.length} Sessions`} variant="neutral" size="sm" />
        </View>

        {todaySchedule.map((item) => (
          <Card key={item.id} elevation="sm" padding="md" style={styles.scheduleCard}>
            <View style={styles.scheduleHeader}>
              <View style={{ flex: 1 }}>
                <Text variant="h4" color="primary" weight="700">
                  {item.batchName}
                </Text>
                <Text variant="caption" color="secondary" style={{ marginTop: 2 }}>
                  {item.subject}
                </Text>
              </View>
              <Badge
                label={item.attendanceMarked ? 'Attendance Marked' : 'Pending Attendance'}
                variant={item.attendanceMarked ? 'success' : 'warning'}
                size="sm"
              />
            </View>

            <View
              style={[
                styles.scheduleFooter,
                { borderTopColor: colors.borderLight, borderTopWidth: 1, marginTop: spacing.sm, paddingTop: spacing.sm },
              ]}
            >
              <View style={styles.metaRow}>
                <Ionicons name="time-outline" size={14} color={colors.textSecondary} style={{ marginRight: 4 }} />
                <Text variant="caption" color="primary" weight="600">
                  {item.time}
                </Text>
                <Text variant="caption" color="muted" style={{ marginHorizontal: 4 }}>
                  •
                </Text>
                <Text variant="caption" color="secondary">
                  {item.room}
                </Text>
              </View>

              {!item.attendanceMarked && (
                <Button
                  title="Mark"
                  onPress={() => {}}
                  size="sm"
                  variant="outline"
                />
              )}
            </View>
          </Card>
        ))}
      </View>

      {/* Urgent Tasks */}
      <View style={{ marginBottom: spacing.md }}>
        <View style={styles.sectionHeader}>
          <Text variant="h3" color="primary" weight="700">
            Priority Tasks
          </Text>
        </View>

        {urgentTasks.map((task) => (
          <Card key={task.id} elevation="sm" padding="md" style={styles.taskCard}>
            <View style={styles.taskRow}>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <Text variant="body" color="primary" weight="600">
                  {task.title}
                </Text>
                <Text variant="caption" color="secondary" style={{ marginTop: 2 }}>
                  Due: {task.deadline}
                </Text>
              </View>
              <Badge
                label={task.priority}
                variant={task.priority === 'HIGH' ? 'danger' : 'neutral'}
                size="sm"
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
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    marginHorizontal: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  scheduleCard: {
    marginBottom: 10,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  scheduleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskCard: {
    marginBottom: 10,
  },
  taskRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
