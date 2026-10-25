import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme';
import { Text } from '../../../components/common/Text';
import { MonthlyAttendanceSummary } from '../../../types/dashboard';

export interface AttendanceCalendarPreviewProps {
  overallPercentage: number;
  presentDays: number;
  totalDays: number;
  monthlyData?: MonthlyAttendanceSummary;
  onViewAll?: () => void;
}

export const AttendanceCalendarPreview: React.FC<AttendanceCalendarPreviewProps> = ({
  overallPercentage,
  presentDays,
  totalDays,
  monthlyData,
  onViewAll,
}) => {
  const { colors, spacing, borderRadius, shadows } = useTheme();

  const absentDays = Math.max(0, totalDays - presentDays);
  const hasAttendanceData = totalDays > 0;
  const isCompliant = hasAttendanceData && overallPercentage >= 75;

  const progressPct = Math.max(0, Math.min(100, overallPercentage));

  // Determine fill color: Emerald if compliant, amber if borderline, red if critical
  const getProgressColor = () => {
    if (!hasAttendanceData) return colors.textMuted;
    if (overallPercentage >= 75) return colors.emerald;
    if (overallPercentage >= 65) return colors.accent;
    return colors.danger;
  };

  return (
    <View
      style={[
        styles.container,
        shadows.sm,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: borderRadius.lg,
          padding: spacing.cardPadding,
          marginBottom: spacing.lg,
        },
      ]}
    >
      {/* 1. Clean Unboxed Section Header */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeaderLeft}>
          <Text variant="academicLabel" color="primary" style={styles.sectionTitle}>
            ATTENDANCE SUMMARY
          </Text>
          <Text variant="caption" color="secondary" style={{ marginTop: 1 }}>
            Lecture & practical compliance register
          </Text>
        </View>

        {onViewAll && (
          <TouchableOpacity
            onPress={onViewAll}
            activeOpacity={0.7}
            style={[
              styles.registerBtn,
              {
                backgroundColor: colors.surfaceVariant,
                borderColor: colors.border,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Open attendance register"
          >
            <Text variant="buttonSmall" color="secondary" weight="600">
              Register
            </Text>
            <Ionicons name="arrow-forward" size={12} color={colors.textSecondary} style={{ marginLeft: 3 }} />
          </TouchableOpacity>
        )}
      </View>

      {/* Subtle Divider */}
      <View style={[styles.divider, { backgroundColor: colors.borderLight, marginVertical: spacing.md }]} />

      {/* 2. Hero Metric Row */}
      <View style={styles.heroRow}>
        {/* Main Metric & Status Badge */}
        <View style={styles.percentageCol}>
          <Text
            variant="metricHero"
            color="primary"
            weight="700"
            style={styles.percentageNum}
          >
            {hasAttendanceData ? `${overallPercentage}%` : '—'}
          </Text>

          {/* Compliance Badge */}
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: isCompliant
                  ? colors.surfaceMint
                  : hasAttendanceData
                  ? colors.dangerContainer
                  : colors.surfaceVariant,
                borderColor: isCompliant
                  ? colors.emerald
                  : hasAttendanceData
                  ? colors.danger
                  : colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor: isCompliant
                    ? colors.emerald
                    : hasAttendanceData
                    ? colors.danger
                    : colors.textMuted,
                },
              ]}
            />
            <Text
              style={styles.statusText}
              color={isCompliant ? 'emerald' : hasAttendanceData ? 'danger' : 'secondary'}
              weight="700"
            >
              {isCompliant
                ? 'COMPLIANT (≥75%)'
                : hasAttendanceData
                ? 'BELOW 75% REQ.'
                : 'NO LOGS RECORDED'}
            </Text>
          </View>
        </View>

        {/* Figures (Present, Absent, Total) */}
        <View style={[styles.figuresRow, { borderLeftColor: colors.borderLight }]}>
          <View style={styles.figureItem}>
            <Text
              variant="h3"
              color={presentDays > 0 ? 'emerald' : 'primary'}
              weight="700"
            >
              {presentDays}
            </Text>
            <Text variant="caption" color="secondary" style={styles.figureLabel}>
              Present
            </Text>
          </View>

          <View style={[styles.figureDivider, { backgroundColor: colors.borderLight }]} />

          <View style={styles.figureItem}>
            <Text
              variant="h3"
              color={absentDays > 0 ? 'danger' : 'secondary'}
              weight="700"
            >
              {absentDays}
            </Text>
            <Text variant="caption" color="secondary" style={styles.figureLabel}>
              Absent
            </Text>
          </View>

          <View style={[styles.figureDivider, { backgroundColor: colors.borderLight }]} />

          <View style={styles.figureItem}>
            <Text variant="h3" color="primary" weight="700">
              {totalDays}
            </Text>
            <Text variant="caption" color="secondary" style={styles.figureLabel}>
              Working
            </Text>
          </View>
        </View>
      </View>

      {/* 3. Compliance Progress Bar */}
      <View style={[styles.progressWrap, { marginTop: spacing.md }]}>
        <View style={[styles.progressTrack, { backgroundColor: colors.surfaceVariant, borderColor: colors.borderLight }]}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${progressPct}%`,
                backgroundColor: getProgressColor(),
              },
            ]}
          />
          {/* 75% threshold guide line */}
          <View
            style={[
              styles.thresholdMarker,
              { left: '75%', backgroundColor: colors.accent },
            ]}
          />
        </View>

        <View style={styles.progressLabels}>
          <Text variant="caption" color="muted" style={{ fontSize: 9 }}>
            0%
          </Text>
          <View style={styles.thresholdLabel}>
            <View style={[styles.thresholdDot, { backgroundColor: colors.accent }]} />
            <Text variant="caption" color="secondary" weight="600" style={{ fontSize: 9 }}>
              75% min. requirement
            </Text>
          </View>
          <Text variant="caption" color="muted" style={{ fontSize: 9 }}>
            100%
          </Text>
        </View>
      </View>

      {/* 4. Compact Context & Direct Link to Full Calendar */}
      {onViewAll && (
        <TouchableOpacity
          onPress={onViewAll}
          activeOpacity={0.7}
          style={[styles.calendarFooterLink, { borderTopColor: colors.borderLight, marginTop: spacing.md, paddingTop: spacing.sm }]}
          accessibilityRole="button"
          accessibilityLabel="Open attendance register with full calendar"
        >
          <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} style={{ marginRight: 6 }} />
          <Text variant="caption" color="secondary" weight="600" style={{ flex: 1 }}>
            View day-by-day calendar & monthly register
          </Text>
          <Ionicons name="chevron-forward" size={13} color={colors.textMuted} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionHeaderLeft: {
    flex: 1,
    paddingRight: 8,
  },
  sectionTitle: {
    fontSize: 11,
    letterSpacing: 0.8,
  },
  registerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
  },
  divider: {
    height: 1,
  },
  heroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  percentageCol: {
    flex: 1,
    paddingRight: 10,
  },
  percentageNum: {
    letterSpacing: -1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 5,
    marginTop: 4,
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginRight: 4,
  },
  statusText: {
    fontSize: 9,
    letterSpacing: 0.5,
  },
  figuresRow: {
    flex: 1.4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderLeftWidth: 1,
    paddingLeft: 10,
  },
  figureItem: {
    alignItems: 'center',
    flex: 1,
  },
  figureLabel: {
    fontSize: 10,
    marginTop: 2,
    letterSpacing: 0.2,
  },
  figureDivider: {
    width: 1,
    height: 22,
  },
  progressWrap: {},
  progressTrack: {
    height: 6,
    borderRadius: 3,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  thresholdMarker: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    zIndex: 2,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  thresholdLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  thresholdDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginRight: 3,
  },
  calendarFooterLink: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
  },
});
