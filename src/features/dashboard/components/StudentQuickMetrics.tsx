import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme';
import { Text } from '../../../components/common/Text';

export interface StudentQuickMetricsProps {
  attendancePercentage?: number;
  presentDays?: number;
  totalDays?: number;
  testAverage?: number;
  deltaTrend?: number;
  trendDirection?: 'UP' | 'DOWN' | 'STABLE';
  classesCount?: number;
  nextClassTime?: string;
  onAttendancePress?: () => void;
  onPerformancePress?: () => void;
  onTimetablePress?: () => void;
}

export const StudentQuickMetrics: React.FC<StudentQuickMetricsProps> = ({
  attendancePercentage,
  presentDays,
  totalDays,
  testAverage,
  deltaTrend,
  trendDirection,
  classesCount,
  nextClassTime,
  onAttendancePress,
  onPerformancePress,
  onTimetablePress,
}) => {
  const { colors, borderRadius } = useTheme();

  const hasAttendance = attendancePercentage !== undefined && attendancePercentage !== null;
  const hasTestAverage = testAverage !== undefined && testAverage !== null;
  const hasClasses = classesCount !== undefined && classesCount !== null;

  return (
    <View style={styles.container}>
      {/* 1. ATTENDANCE METRIC (Brand Green / Emerald) */}
      <TouchableOpacity
        onPress={onAttendancePress}
        activeOpacity={onAttendancePress ? 0.75 : 1}
        style={[
          styles.metricCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: borderRadius.md,
          },
        ]}
      >
        <View style={styles.topRow}>
          <View
            style={[
              styles.iconWrapper,
              { backgroundColor: colors.emeraldContainer || 'rgba(22, 132, 91, 0.08)' },
            ]}
          >
            <Ionicons name="checkbox-outline" size={15} color={colors.emerald || '#16845B'} />
          </View>
          <Text
            variant="caption"
            weight="700"
            style={[styles.metricLabel, { color: colors.emerald || '#16845B' }]}
          >
            ATTENDANCE
          </Text>
        </View>

        <Text
          variant="h3"
          color="primary"
          weight="800"
          style={styles.metricValue}
        >
          {hasAttendance ? `${attendancePercentage.toFixed(1)}%` : '—'}
        </Text>

        <Text
          variant="caption"
          color="secondary"
          weight="500"
          numberOfLines={1}
          style={styles.metricSub}
        >
          {hasAttendance && presentDays !== undefined && totalDays !== undefined
            ? `${presentDays}/${totalDays} Days`
            : 'No records'}
        </Text>
      </TouchableOpacity>

      {/* 2. TEST AVERAGE METRIC (Brand Blue / Gold) */}
      <TouchableOpacity
        onPress={onPerformancePress}
        activeOpacity={onPerformancePress ? 0.75 : 1}
        style={[
          styles.metricCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: borderRadius.md,
            marginHorizontal: 8,
          },
        ]}
      >
        <View style={styles.topRow}>
          <View
            style={[
              styles.iconWrapper,
              { backgroundColor: 'rgba(52, 120, 184, 0.08)' },
            ]}
          >
            <Ionicons name="trophy-outline" size={15} color={colors.brandBlue || '#3478B8'} />
          </View>
          <Text
            variant="caption"
            weight="700"
            style={[styles.metricLabel, { color: colors.brandBlue || '#3478B8' }]}
          >
            TEST AVG
          </Text>
        </View>

        <Text
          variant="h3"
          color="primary"
          weight="800"
          style={styles.metricValue}
        >
          {hasTestAverage ? `${testAverage.toFixed(1)}%` : '—'}
        </Text>

        <Text
          variant="caption"
          color="secondary"
          weight="500"
          numberOfLines={1}
          style={styles.metricSub}
        >
          {deltaTrend !== undefined
            ? `${trendDirection === 'UP' ? '+' : '-'}${deltaTrend}% vs prev`
            : hasTestAverage
            ? 'Score average'
            : 'No evaluations'}
        </Text>
      </TouchableOpacity>

      {/* 3. TODAY'S CLASSES METRIC (Brand Green) */}
      <TouchableOpacity
        onPress={onTimetablePress}
        activeOpacity={onTimetablePress ? 0.75 : 1}
        style={[
          styles.metricCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: borderRadius.md,
          },
        ]}
      >
        <View style={styles.topRow}>
          <View
            style={[
              styles.iconWrapper,
              { backgroundColor: 'rgba(118, 168, 67, 0.10)' },
            ]}
          >
            <Ionicons name="calendar-outline" size={15} color={colors.brandGreen || '#76A843'} />
          </View>
          <Text
            variant="caption"
            weight="700"
            style={[styles.metricLabel, { color: colors.brandGreen || '#76A843' }]}
          >
            CLASSES
          </Text>
        </View>

        <Text
          variant="h3"
          color="primary"
          weight="800"
          style={styles.metricValue}
        >
          {hasClasses ? `${classesCount}` : '—'}
        </Text>

        <Text
          variant="caption"
          color="secondary"
          weight="500"
          numberOfLines={1}
          style={styles.metricSub}
        >
          {hasClasses && classesCount > 0
            ? nextClassTime
              ? `Next ${nextClassTime}`
              : 'Lectures today'
            : 'None scheduled'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  metricCard: {
    flex: 1,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  iconWrapper: {
    width: 22,
    height: 22,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  metricLabel: {
    fontSize: 9,
    letterSpacing: 0.5,
  },
  metricValue: {
    fontSize: 17,
    lineHeight: 20,
    letterSpacing: -0.5,
  },
  metricSub: {
    fontSize: 10,
    marginTop: 2,
  },
});
