import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme';
import { Text } from '../../../components/common/Text';

export interface StudentAttendanceSummaryCardProps {
  percentage: number;
  presentDays: number;
  totalDays: number;
  status?: 'EXCELLENT' | 'GOOD' | 'WARNING';
  onViewDetails: () => void;
}

export const StudentAttendanceSummaryCard: React.FC<StudentAttendanceSummaryCardProps> = ({
  percentage,
  presentDays,
  totalDays,
  status,
  onViewDetails,
}) => {
  const { colors, spacing, borderRadius } = useTheme();

  const absentDays = Math.max(0, totalDays - presentDays);
  const isCompliant = percentage >= 75;
  const clampedProgress = Math.max(0, Math.min(100, percentage));

  const statusLabel =
    status === 'EXCELLENT' || percentage >= 90
      ? 'Exemplary'
      : status === 'WARNING' || percentage < 75
      ? 'Below Threshold'
      : 'Compliant';

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: borderRadius.md,
          padding: spacing.cardPadding,
          marginBottom: 14,
        },
      ]}
    >
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.titleWithIcon}>
          <View
            style={[
              styles.iconWrapper,
              { backgroundColor: colors.iconEmeraldBg },
            ]}
          >
            <Ionicons name="calendar-outline" size={17} color={colors.iconEmerald} />
          </View>
          <View>
            <Text
              variant="caption"
              weight="700"
              style={[styles.sectionHeader, { color: colors.iconEmerald }]}
            >
              ATTENDANCE OVERVIEW
            </Text>
            <Text variant="bodySmall" color="secondary" weight="500">
              Institutional Session Compliance
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={onViewDetails}
          activeOpacity={0.7}
          style={styles.actionLink}
          accessibilityRole="button"
          accessibilityLabel="View full attendance ledger"
        >
          <Text variant="caption" color="primary" weight="700">
            View Ledger →
          </Text>
        </TouchableOpacity>
      </View>

      {/* Metrics Row: Big Percentage & Stats */}
      <View style={styles.metricsRow}>
        <View style={styles.percentBlock}>
          <View style={styles.percentNumberRow}>
            <Text
              style={[
                styles.percentText,
                { color: isCompliant ? colors.navy : colors.warning },
              ]}
              weight="800"
            >
              {percentage.toFixed(1)}
            </Text>
            <Text
              style={[
                styles.percentUnit,
                { color: colors.textSecondary },
              ]}
              weight="600"
            >
              %
            </Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: isCompliant ? colors.accentContainer : colors.warningContainer,
                borderColor: isCompliant ? 'rgba(22, 133, 117, 0.3)' : 'rgba(183, 121, 31, 0.3)',
              },
            ]}
          >
            <View
              style={[
                styles.statusDot,
                { backgroundColor: isCompliant ? colors.accent : colors.warning },
              ]}
            />
            <Text
              variant="caption"
              style={[
                styles.statusBadgeText,
                { color: isCompliant ? colors.accent : colors.warning },
              ]}
              weight="700"
            >
              {statusLabel}
            </Text>
          </View>
        </View>

        <View style={[styles.dividerCol, { backgroundColor: colors.border }]} />

        <View style={styles.statColumns}>
          <View style={styles.singleStat}>
            <Text variant="caption" color="secondary" weight="600">
              Sessions Attended
            </Text>
            <Text variant="body" color="primary" weight="700" style={{ marginTop: 2 }}>
              {presentDays}{' '}
              <Text variant="caption" color="muted">
                / {totalDays} total
              </Text>
            </Text>
          </View>

          <View style={[styles.singleStat, { marginTop: 8 }]}>
            <Text variant="caption" color="secondary" weight="600">
              Recorded Absences
            </Text>
            <Text
              variant="body"
              color={absentDays > 0 ? 'secondary' : 'accent'}
              weight="700"
              style={{ marginTop: 2 }}
            >
              {absentDays} {absentDays === 1 ? 'session' : 'sessions'}
            </Text>
          </View>
        </View>
      </View>

      {/* Clean Progress Track */}
      <View style={styles.progressContainer}>
        <View
          style={[
            styles.progressTrack,
            { backgroundColor: colors.surfaceVariant },
          ]}
        >
          <View
            style={[
              styles.progressFill,
              {
                width: `${clampedProgress}%`,
                backgroundColor: isCompliant ? colors.accent : colors.warning,
              },
            ]}
          />
        </View>
        <View style={styles.benchmarkRow}>
          <Text variant="caption" color="muted" style={{ fontSize: 10 }}>
            Institutional Threshold: 75%
          </Text>
          <Text variant="caption" color="muted" style={{ fontSize: 10 }}>
            Target: 95%+
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  sectionHeader: {
    letterSpacing: 0.8,
    fontSize: 11,
  },
  actionLink: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  percentBlock: {
    flex: 1,
  },
  percentNumberRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  percentText: {
    fontSize: 34,
    lineHeight: 38,
    letterSpacing: -1,
  },
  percentUnit: {
    fontSize: 18,
    marginLeft: 3,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    marginTop: 6,
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginRight: 4,
  },
  statusBadgeText: {
    fontSize: 10,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  dividerCol: {
    width: 1,
    height: 54,
    marginHorizontal: 16,
  },
  statColumns: {
    flex: 1.2,
  },
  singleStat: {},
  progressContainer: {
    marginTop: 12,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  benchmarkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
});
