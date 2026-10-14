import React, { useState, useEffect, useCallback } from 'react';
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
import { Badge } from '../../../components/common/Badge';
import { studentService } from '../../../services/api/studentService';
import { MonthlyAttendanceSummary, DayAttendanceRecord } from '../../../types/dashboard';
import { BackendStudentAttendanceSummary } from '../../../types/backend';
import { LoadingState } from '../../../components/feedback/LoadingState';
import { ErrorState } from '../../../components/feedback/ErrorState';

export interface StudentAttendanceScreenProps {
  onBack?: () => void;
}

export const StudentAttendanceScreen: React.FC<StudentAttendanceScreenProps> = ({ onBack }) => {
  const { colors, spacing, borderRadius, shadows } = useTheme();
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [summary, setSummary] = useState<BackendStudentAttendanceSummary | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyAttendanceSummary | null>(null);
  const [selectedDay, setSelectedDay] = useState<DayAttendanceRecord | null>(null);

  // Month navigation: default to September 2026
  const [activeMonthKey, setActiveMonthKey] = useState<string>('2026-09');

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const [sumRes, dailyRes] = await Promise.all([
        studentService.getAttendanceSummary(),
        studentService.getDailyAttendance(activeMonthKey),
      ]);
      setSummary(sumRes);
      setMonthlyData(dailyRes);

      // Default select the latest scheduled day
      if (dailyRes && dailyRes.records.length > 0) {
        const latestWorking = dailyRes.records.filter((r) => r.status !== 'OFF').pop();
        setSelectedDay(latestWorking || dailyRes.records[0]);
      }
    } catch (err: any) {
      setError(err?.message || 'Unable to load attendance records');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeMonthKey]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  if (loading && !monthlyData) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center' }}>
        <LoadingState message="Loading attendance records..." />
      </View>
    );
  }

  if (error && !monthlyData) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center' }}>
        <ErrorState message={error} onRetry={fetchData} />
      </View>
    );
  }

  const overallPercentage = summary ? Math.round(summary.attendance_percentage * 10) / 10 : 94.2;
  const presentCount = summary ? summary.present_days : 81;
  const absentCount = summary ? summary.absent_days : 5;
  const totalCount = summary ? summary.total_working_days : 86;

  // Calendar alignment for 7 columns (Mon-Sun):
  // 1 Sep 2026 was Tuesday (Mon=0, Tue=1 -> leadOffset = 1)
  const records = monthlyData?.records || [];
  const firstDay = records[0];
  const startDayOfWeek = firstDay ? firstDay.dayOfWeek : 2; // 0=Sun, 1=Mon, 2=Tue
  const monSunOffset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1; // 0 (Mon) -> 6 (Sun)

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
      {/* Navigation Header */}
      <View style={[styles.navHeader, { marginBottom: spacing.md }]}>
        {onBack && (
          <TouchableOpacity
            onPress={onBack}
            activeOpacity={0.7}
            style={[styles.backBtn, { backgroundColor: colors.surfaceVariant, borderRadius: borderRadius.full }]}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
        )}
        <View style={{ flex: 1, marginLeft: onBack ? spacing.sm : 0 }}>
          <Text variant="caption" color="secondary" weight="700" style={{ letterSpacing: 0.8 }}>
            ACADEMIC ATTENDANCE
          </Text>
          <Text variant="h2" color="primary" weight="700">
            Attendance Record
          </Text>
        </View>
      </View>

      {/* Top Overall Summary Block */}
      <View
        style={[
          styles.kpiCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: borderRadius.lg,
            padding: spacing.cardPadding,
            marginBottom: spacing.lg,
            ...shadows.sm,
          },
        ]}
      >
        <Text variant="caption" color="secondary" weight="700" style={{ letterSpacing: 0.8 }}>
          VERIFIED ATTENDANCE RATE
        </Text>
        <View style={styles.kpiScoreRow}>
          <Text variant="hero" color="primary" weight="700" style={{ fontSize: 36, lineHeight: 42 }}>
            {overallPercentage}%
          </Text>
          <Badge
            label={overallPercentage >= 85 ? 'On Track' : 'Warning'}
            variant={overallPercentage >= 85 ? 'accent' : 'danger'}
            size="md"
            style={{ marginLeft: 10 }}
          />
        </View>

        {/* 3 Metrics Row */}
        <View style={[styles.triMetricsRow, { borderTopColor: colors.borderLight, marginTop: spacing.md, paddingTop: spacing.md }]}>
          <View style={styles.metricItem}>
            <Text variant="h3" color="success" weight="700">
              {presentCount}
            </Text>
            <Text variant="caption" color="muted" style={{ marginTop: 2 }}>
              Present
            </Text>
          </View>

          <View style={[styles.metricSeparator, { backgroundColor: colors.borderLight }]} />

          <View style={styles.metricItem}>
            <Text variant="h3" color="danger" weight="700">
              {absentCount}
            </Text>
            <Text variant="caption" color="muted" style={{ marginTop: 2 }}>
              Absent
            </Text>
          </View>

          <View style={[styles.metricSeparator, { backgroundColor: colors.borderLight }]} />

          <View style={styles.metricItem}>
            <Text variant="h3" color="primary" weight="700">
              {totalCount}
            </Text>
            <Text variant="caption" color="muted" style={{ marginTop: 2 }}>
              Scheduled
            </Text>
          </View>
        </View>
      </View>

      {/* Month Selector */}
      <View
        style={[
          styles.monthSelector,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: borderRadius.md,
            paddingVertical: spacing.sm,
            paddingHorizontal: spacing.md,
            marginBottom: spacing.md,
            ...shadows.sm,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => setActiveMonthKey('2026-08')}
          style={styles.monthNavBtn}
          accessibilityRole="button"
          accessibilityLabel="Previous month"
        >
          <Ionicons name="chevron-back" size={18} color={colors.textSecondary} />
        </TouchableOpacity>

        <Text variant="body" color="primary" weight="700">
          {monthlyData?.monthName || 'September 2026'}
        </Text>

        <TouchableOpacity
          onPress={() => setActiveMonthKey('2026-10')}
          style={styles.monthNavBtn}
          accessibilityRole="button"
          accessibilityLabel="Next month"
        >
          <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Full 7-Day Calendar Grid Card */}
      <View
        style={[
          styles.calendarCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: borderRadius.lg,
            padding: spacing.cardPadding,
            marginBottom: spacing.lg,
            ...shadows.sm,
          },
        ]}
      >
        {/* Day of Week Headers */}
        <View style={[styles.dayHeaderRow, { borderBottomColor: colors.borderLight, paddingBottom: spacing.sm }]}>
          {daysOfWeek.map((day) => (
            <View key={day} style={styles.dayHeaderCol}>
              <Text variant="caption" color="muted" align="center" weight="600">
                {day}
              </Text>
            </View>
          ))}
        </View>

        {/* Calendar Cells */}
        <View style={[styles.calendarMatrix, { marginTop: spacing.sm }]}>
          {/* Leading empty spacers */}
          {Array.from({ length: monSunOffset }).map((_, idx) => (
            <View key={`empty-${idx}`} style={styles.cellCol}>
              <Text variant="caption" color="muted" style={{ opacity: 0.2 }}>
                —
              </Text>
            </View>
          ))}

          {/* Days */}
          {records.map((item) => {
            const isSelected = selectedDay?.date === item.date;
            const isPresent = item.status === 'PRESENT';
            const isAbsent = item.status === 'ABSENT';

            return (
              <TouchableOpacity
                key={item.date}
                onPress={() => setSelectedDay(item)}
                activeOpacity={0.7}
                style={[
                  styles.cellCol,
                  isSelected && [
                    styles.selectedCell,
                    { borderColor: colors.primary, backgroundColor: colors.surfaceVariant },
                  ],
                ]}
                accessibilityRole="button"
                accessibilityLabel={`Date ${item.dayNumber}, status ${item.status}`}
              >
                <View
                  style={[
                    styles.cellBadge,
                    isPresent && { backgroundColor: colors.successContainer },
                    isAbsent && { backgroundColor: colors.dangerContainer },
                    item.status === 'OFF' && { backgroundColor: colors.surfaceVariant },
                  ]}
                >
                  {isPresent && <Ionicons name="checkmark" size={12} color={colors.success} />}
                  {isAbsent && <Ionicons name="close" size={12} color={colors.danger} />}
                  {item.status === 'OFF' && <Text variant="caption" color="muted">—</Text>}
                </View>
                <Text
                  variant="caption"
                  color={isSelected ? 'primary' : isAbsent ? 'danger' : 'secondary'}
                  weight={isSelected ? '700' : '500'}
                  style={{ fontSize: 10, marginTop: 2 }}
                >
                  {item.dayNumber}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Selected Day Inspector Card */}
      {selectedDay && (
        <View
          style={[
            styles.inspectorCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: borderRadius.lg,
              padding: spacing.cardPadding,
              marginBottom: spacing.lg,
              ...shadows.sm,
            },
          ]}
        >
          <View style={styles.inspectorTopRow}>
            <View>
              <Text variant="caption" color="secondary" weight="700" style={{ letterSpacing: 0.6 }}>
                SELECTED DATE INSPECTION
              </Text>
              <Text variant="h3" color="primary" weight="700" style={{ marginTop: 2 }}>
                {selectedDay.dayNumber} {monthlyData?.monthName || 'September 2026'}
              </Text>
            </View>

            <Badge
              label={
                selectedDay.status === 'PRESENT'
                  ? 'Present'
                  : selectedDay.status === 'ABSENT'
                  ? 'Absent'
                  : 'Institute Closed'
              }
              variant={
                selectedDay.status === 'PRESENT'
                  ? 'success'
                  : selectedDay.status === 'ABSENT'
                  ? 'danger'
                  : 'neutral'
              }
              size="md"
            />
          </View>

          <View style={[styles.inspectorDivider, { backgroundColor: colors.borderLight, marginVertical: spacing.sm }]} />

          <View style={styles.metaRow}>
            <Text variant="caption" color="muted">
              Academic Programme:
            </Text>
            <Text variant="caption" color="primary" weight="600">
              Fundemics Regular Academic Batch
            </Text>
          </View>

          <View style={[styles.metaRow, { marginTop: 6 }]}>
            <Text variant="caption" color="muted">
              Verification Mode:
            </Text>
            <Text variant="caption" color="secondary" weight="600">
              {selectedDay.status === 'PRESENT' ? 'Classroom Biometric Log' : 'Official Attendance Log'}
            </Text>
          </View>

          {selectedDay.remarks && (
            <View style={[styles.metaRow, { marginTop: 6 }]}>
              <Text variant="caption" color="muted">
                Official Remark:
              </Text>
              <Text variant="caption" color="danger" weight="600">
                {selectedDay.remarks}
              </Text>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {},
  navHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kpiCard: {
    borderWidth: 1,
  },
  kpiScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  triMetricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricSeparator: {
    width: 1,
    height: 28,
  },
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
  },
  monthNavBtn: {
    padding: 6,
  },
  calendarCard: {
    borderWidth: 1,
  },
  dayHeaderRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  dayHeaderCol: {
    flex: 1,
    alignItems: 'center',
  },
  calendarMatrix: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cellCol: {
    width: '14.285%', // 7 columns
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: 8,
  },
  selectedCell: {
    borderWidth: 1,
  },
  cellBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inspectorCard: {
    borderWidth: 1,
  },
  inspectorTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  inspectorDivider: {
    height: 1,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
