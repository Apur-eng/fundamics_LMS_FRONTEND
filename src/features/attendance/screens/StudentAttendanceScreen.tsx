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

  // Month navigation: default to current calendar month
  const [activeMonthKey, setActiveMonthKey] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

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
      if (dailyRes && dailyRes.records && dailyRes.records.length > 0) {
        const latestWorking = dailyRes.records.filter((r) => r.status !== 'OFF' && r.status !== 'HOLIDAY').pop();
        setSelectedDay(latestWorking || dailyRes.records[0]);
      } else {
        setSelectedDay(null);
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

  if (loading && !monthlyData && !summary) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center' }}>
        <LoadingState message="Loading attendance records..." />
      </View>
    );
  }

  if (error && !monthlyData && !summary) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: Math.max(insets.top, 16), paddingHorizontal: spacing.screenPadding }}>
        {onBack && (
          <TouchableOpacity
            onPress={onBack}
            activeOpacity={0.7}
            style={[styles.backBtn, { backgroundColor: colors.surfaceVariant, borderRadius: borderRadius.full, marginBottom: spacing.md }]}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
        )}
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ErrorState message={error} onRetry={fetchData} />
        </View>
      </View>
    );
  }

  const hasSummary = summary !== null && summary !== undefined;
  const hasSummaryData = hasSummary && summary.total_working_days > 0;
  const overallPercentage = hasSummary ? Math.round(summary.attendance_percentage * 10) / 10 : null;
  const presentCount = hasSummary ? summary.present_days : null;
  const absentCount = hasSummary ? summary.absent_days : null;
  const totalCount = hasSummary ? summary.total_working_days : null;

  // Calendar alignment for 7 columns (Mon-Sun):
  const [activeYear, activeMonthNum] = activeMonthKey.split('-').map(Number);
  const firstDayOfMonth = new Date(activeYear, activeMonthNum - 1, 1);
  const firstDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
  const monSunOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1; // 0 (Mon) -> 6 (Sun)

  const records = monthlyData?.records || [];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={[
        styles.scrollContent,
        {
          paddingTop: Math.max(insets.top, 16),
          paddingHorizontal: spacing.screenPadding,
          paddingBottom: Math.max(insets.bottom, 16) + 70,
        },
      ]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.navy}
          colors={[colors.navy]}
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
            Attendance Ledger
          </Text>
        </View>
      </View>

      {/* Background Sync Error Banner (Non-destructive) */}
      {error && (monthlyData || summary) && (
        <View
          style={[
            styles.syncErrorBanner,
            {
              backgroundColor: colors.dangerContainer,
              borderColor: colors.danger,
              borderRadius: borderRadius.sm,
              padding: spacing.sm,
              marginBottom: spacing.md,
              flexDirection: 'row',
              alignItems: 'center',
            },
          ]}
        >
          <Ionicons name="alert-circle-outline" size={16} color={colors.danger} style={{ marginRight: 6 }} />
          <Text variant="caption" color="danger" style={{ flex: 1 }}>
            {error}
          </Text>
          <TouchableOpacity onPress={fetchData} activeOpacity={0.7}>
            <Text variant="caption" color="danger" weight="700">
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Top Overall Summary Block */}
      <View
        style={[
          styles.kpiCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: borderRadius.md,
            padding: spacing.cardPadding,
            marginBottom: spacing.md,
            ...shadows.sm,
          },
        ]}
      >
        <Text variant="caption" color="secondary" weight="700" style={{ letterSpacing: 0.8 }}>
          VERIFIED ATTENDANCE RATE
        </Text>
        <View style={styles.kpiScoreRow}>
          <Text variant="hero" color="primary" weight="700" style={{ fontSize: 36, lineHeight: 42 }}>
            {hasSummaryData ? `${overallPercentage}%` : '—'}
          </Text>
          {hasSummaryData ? (
            <Badge
              label={overallPercentage! >= 75 ? 'Compliant' : 'Below 75%'}
              variant={overallPercentage! >= 75 ? 'accent' : 'warning'}
              size="md"
              style={{ marginLeft: 10 }}
            />
          ) : (
            <Badge
              label="No Records"
              variant="neutral"
              size="md"
              style={{ marginLeft: 10 }}
            />
          )}
        </View>

        {/* 3 Metrics Row */}
        <View style={[styles.triMetricsRow, { borderTopColor: colors.borderLight, marginTop: spacing.md, paddingTop: spacing.md }]}>
          <View style={styles.metricItem}>
            <Text variant="h3" color={hasSummaryData ? 'accent' : 'muted'} weight="700">
              {hasSummaryData ? presentCount : '—'}
            </Text>
            <Text variant="caption" color="secondary" style={{ marginTop: 2 }}>
              Present
            </Text>
          </View>

          <View style={[styles.metricSeparator, { backgroundColor: colors.borderLight }]} />

          <View style={styles.metricItem}>
            <Text variant="h3" color={hasSummaryData ? 'danger' : 'muted'} weight="700">
              {hasSummaryData ? absentCount : '—'}
            </Text>
            <Text variant="caption" color="secondary" style={{ marginTop: 2 }}>
              Absent
            </Text>
          </View>

          <View style={[styles.metricSeparator, { backgroundColor: colors.borderLight }]} />

          <View style={styles.metricItem}>
            <Text variant="h3" color={hasSummaryData ? 'primary' : 'muted'} weight="700">
              {hasSummaryData ? totalCount : '—'}
            </Text>
            <Text variant="caption" color="secondary" style={{ marginTop: 2 }}>
              Total Sessions
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
            borderRadius: borderRadius.sm,
            paddingVertical: spacing.sm,
            paddingHorizontal: spacing.md,
            marginBottom: spacing.md,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            const [y, m] = activeMonthKey.split('-').map(Number);
            const prev = new Date(y, m - 2, 1);
            setActiveMonthKey(`${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}`);
          }}
          style={styles.monthNavBtn}
          accessibilityRole="button"
          accessibilityLabel="Previous month"
        >
          <Ionicons name="chevron-back" size={18} color={colors.textSecondary} />
        </TouchableOpacity>

        <Text variant="body" color="primary" weight="700">
          {monthlyData?.monthName || activeMonthKey}
        </Text>

        <TouchableOpacity
          onPress={() => {
            const [y, m] = activeMonthKey.split('-').map(Number);
            const next = new Date(y, m, 1);
            setActiveMonthKey(`${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}`);
          }}
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
            borderRadius: borderRadius.md,
            padding: spacing.cardPadding,
            marginBottom: spacing.md,
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
        {records.length > 0 ? (
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
              const isHolidayOrOff = item.status === 'HOLIDAY' || item.status === 'OFF';

              return (
                <TouchableOpacity
                  key={item.date}
                  onPress={() => setSelectedDay(item)}
                  activeOpacity={0.7}
                  style={[
                    styles.cellCol,
                    isSelected && [
                      styles.selectedCell,
                      { borderColor: colors.navy, backgroundColor: colors.surfaceVariant },
                    ],
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`Date ${item.dayNumber}, status ${item.status}`}
                >
                  <View
                    style={[
                      styles.cellBadge,
                      isPresent && { backgroundColor: colors.accentContainer },
                      isAbsent && { backgroundColor: colors.dangerContainer },
                      isHolidayOrOff && { backgroundColor: colors.surfaceVariant },
                    ]}
                  >
                    {isPresent && <Ionicons name="checkmark" size={12} color={colors.accent} />}
                    {isAbsent && <Ionicons name="close" size={12} color={colors.danger} />}
                    {isHolidayOrOff && <Text variant="caption" color="muted">—</Text>}
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
        ) : (
          <View style={styles.emptyCalendarContainer}>
            <Ionicons name="calendar-outline" size={30} color={colors.textMuted} style={{ marginBottom: 6 }} />
            <Text variant="bodySmall" color="secondary" align="center" weight="600">
              No Attendance Logs Recorded
            </Text>
            <Text variant="caption" color="muted" align="center" style={{ marginTop: 2 }}>
              Daily register records have not been published for this month.
            </Text>
          </View>
        )}
      </View>

      {/* Selected Day Inspector Card */}
      {selectedDay && (
        <View
          style={[
            styles.inspectorCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: borderRadius.md,
              padding: spacing.cardPadding,
              marginBottom: spacing.md,
              ...shadows.sm,
            },
          ]}
        >
          <View style={styles.inspectorTopRow}>
            <View>
              <Text variant="caption" color="secondary" weight="700" style={{ letterSpacing: 0.6 }}>
                SELECTED DATE RECORD
              </Text>
              <Text variant="h3" color="primary" weight="700" style={{ marginTop: 2 }}>
                {selectedDay.dayNumber} {monthlyData?.monthName || activeMonthKey}
              </Text>
            </View>

            <Badge
              label={
                selectedDay.status === 'PRESENT'
                  ? 'Present'
                  : selectedDay.status === 'ABSENT'
                  ? 'Absent'
                  : selectedDay.status === 'HOLIDAY'
                  ? 'Holiday'
                  : 'Off Day'
              }
              variant={
                selectedDay.status === 'PRESENT'
                  ? 'accent'
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
              Academic Session:
            </Text>
            <Text variant="caption" color="primary" weight="600">
              Classroom Lecture & Problem Session
            </Text>
          </View>

          <View style={[styles.metaRow, { marginTop: 6 }]}>
            <Text variant="caption" color="muted">
              Verification Mode:
            </Text>
            <Text variant="caption" color="secondary" weight="600">
              {selectedDay.status === 'PRESENT' ? 'Verified Biometric Attendance' : 'Institutional Daily Register'}
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

      {/* Chronological Daily Attendance Log (Sequential list) */}
      {records.length > 0 && (
        <View
          style={[
            styles.logCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: borderRadius.md,
              padding: spacing.cardPadding,
              marginBottom: spacing.md,
            },
          ]}
        >
          <Text variant="caption" color="secondary" weight="700" style={{ letterSpacing: 0.8, marginBottom: 8 }}>
            CHRONOLOGICAL SESSION LOG
          </Text>

          {records
            .filter((r) => r.status !== 'OFF' && r.status !== 'HOLIDAY')
            .slice(-10)
            .reverse()
            .map((item, idx, arr) => (
              <View
                key={`log-${item.date}`}
                style={[
                  styles.logRow,
                  idx < arr.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.borderLight },
                ]}
              >
                <View style={styles.logLeft}>
                  <Text variant="body" color="primary" weight="600" style={{ fontSize: 13 }}>
                    {item.date}
                  </Text>
                  <Text variant="caption" color="muted">
                    Day {item.dayNumber} • Regular Session
                  </Text>
                </View>

                <View
                  style={[
                    styles.logStatusBadge,
                    {
                      backgroundColor: item.status === 'PRESENT' ? colors.accentContainer : colors.dangerContainer,
                    },
                  ]}
                >
                  <Text
                    variant="caption"
                    style={{
                      color: item.status === 'PRESENT' ? colors.accent : colors.danger,
                      fontWeight: '700',
                      fontSize: 10,
                    }}
                  >
                    {item.status}
                  </Text>
                </View>
              </View>
            ))}
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
    borderRadius: 6,
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
  syncErrorBanner: {
    borderWidth: 1,
  },
  emptyCalendarContainer: {
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logCard: {
    borderWidth: 1,
  },
  logRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  logLeft: {
    flex: 1,
  },
  logStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
});
