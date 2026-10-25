import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../../theme';
import { Text } from '../../../components/common/Text';

export interface AcademicOverviewProps {
  attendancePercentage: number;
  attendanceTotalDays: number;
  testsCompleted: number;
  averageScore: number;
  todayClassesCount: number;
}

export const AcademicOverview: React.FC<AcademicOverviewProps> = ({
  attendancePercentage,
  attendanceTotalDays,
  testsCompleted,
  averageScore,
  todayClassesCount,
}) => {
  const { colors, spacing, borderRadius, shadows } = useTheme();

  const hasAttendance = attendanceTotalDays > 0;
  const isCompliant = hasAttendance && attendancePercentage >= 75;

  return (
    <View
      style={[
        styles.container,
        shadows.sm,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: borderRadius.lg,
          paddingVertical: 12,
          paddingHorizontal: spacing.cardPadding,
          marginBottom: spacing.lg,
        },
      ]}
    >
      {/* 3 Metric Columns */}
      <View style={styles.metricsRow}>
        {/* Attendance */}
        <View style={styles.metricCol}>
          <Text variant="caption" color="secondary" style={styles.metricHeader}>
            ATTENDANCE
          </Text>
          <Text
            variant="h3"
            color={hasAttendance && isCompliant ? 'emerald' : 'primary'}
            weight="700"
            style={{ marginTop: 2 }}
          >
            {hasAttendance ? `${attendancePercentage}%` : '—'}
          </Text>
          <Text variant="caption" color="muted" style={styles.metricSub}>
            {hasAttendance ? (isCompliant ? 'Compliant' : 'Below 75%') : 'No Records'}
          </Text>
        </View>

        <View style={[styles.colDivider, { backgroundColor: colors.borderLight }]} />

        {/* Test Performance */}
        <View style={styles.metricCol}>
          <Text variant="caption" color="secondary" style={styles.metricHeader}>
            TEST AVERAGE
          </Text>
          <Text
            variant="h3"
            color={averageScore >= 90 ? 'accent' : 'primary'}
            weight="700"
            style={{ marginTop: 2 }}
          >
            {testsCompleted > 0 ? `${averageScore}%` : '—'}
          </Text>
          <Text variant="caption" color="muted" style={styles.metricSub}>
            {testsCompleted > 0 ? `${testsCompleted} Evaluated` : 'No Tests'}
          </Text>
        </View>

        <View style={[styles.colDivider, { backgroundColor: colors.borderLight }]} />

        {/* Sessions Today */}
        <View style={styles.metricCol}>
          <Text variant="caption" color="secondary" style={styles.metricHeader}>
            TODAY'S CLASSES
          </Text>
          <Text variant="h3" color="primary" weight="700" style={{ marginTop: 2 }}>
            {todayClassesCount}
          </Text>
          <Text variant="caption" color="muted" style={styles.metricSub}>
            {todayClassesCount === 1 ? 'Scheduled' : 'Scheduled'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metricCol: {
    flex: 1,
    alignItems: 'center',
  },
  metricHeader: {
    fontSize: 9,
    letterSpacing: 0.8,
    fontWeight: '700',
  },
  metricSub: {
    fontSize: 10,
    marginTop: 2,
  },
  colDivider: {
    width: 1,
    height: 32,
  },
});
