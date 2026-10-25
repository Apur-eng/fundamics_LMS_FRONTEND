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
      ? 'Action Required'
      : 'On Track';

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
              { backgroundColor: colors.emeraldContainer },
            ]}
          >
            <Ionicons name="checkbox-outline" size={17} color={colors.emerald} />
          </View>
          <View>
            <Text
              variant="caption"
              color="emerald"
              weight="700"
              style={styles.sectionHeader}
            >
              ATTENDANCE RECORD
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
          <Text variant="caption" color="primaryBlue" weight="700">
            Full Log →
          </Text>
        </TouchableOpacity>
      </View>

      {/* Metrics Row */}
      <View style={styles.metricsRow}>
        <View style={styles.percentBlock}>
          <View style={styles.percentNumberRow}>
            <Text
              style={[
                styles.percentText,
                { color: colors.emerald },
              ]}
              weight="800"
            >
              {percentage.toFixed(1)}
            </Text>
            <Text
              style={[
                styles.percentUnit,
                { color: colors.emerald },
              ]}
              weight="700"
            >
              %
            </Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: isCompliant ? colors.emeraldContainer : colors.coralContainer,
                borderColor: isCompliant ? 'rgba(21, 150, 106, 0.25)' : 'rgba(217, 105, 97, 0.25)',
              },
            ]}
          >
            <Text
              variant="caption"
              style={[
                styles.statusBadgeText,
                { color: isCompliant ? colors.emerald : colors.coral },
              ]}
              weight="700"
            >
              {statusLabel}
            </Text>
          </View>
        </View>

        <View style={styles.dividerCol} />

        <View style={styles.statColumns}>
          <View style={styles.singleStat}>
            <Text variant="caption" color="secondary" weight="600">
              Present Sessions
            </Text>
            <Text variant="body" color="primary" weight="700" style={{ marginTop: 2 }}>
              {presentDays}{' '}
              <Text variant="caption" color="muted">
                / {totalDays}
              </Text>
            </Text>
          </View>

          <View style={[styles.singleStat, { marginTop: 8 }]}>
            <Text variant="caption" color="secondary" weight="600">
              Recorded Absences
            </Text>
            <Text variant="body" color={absentDays > 0 ? 'secondary' : 'emerald'} weight="700" style={{ marginTop: 2 }}>
              {absentDays} {absentDays === 1 ? 'day' : 'days'}
            </Text>
          </View>
        </View>
      </View>

      {/* Progress Track */}
      <View style={styles.progressContainer}>
        <View
          style={[
            styles.progressTrack,
            { backgroundColor: colors.borderLight },
          ]}
        >
          <View
            style={[
              styles.progressFill,
              {
                width: `${clampedProgress}%`,
                backgroundColor: colors.emerald,
              },
            ]}
          />
        </View>
        <View style={styles.benchmarkRow}>
          <Text variant="caption" color="muted" style={{ fontSize: 9 }}>
            Min. Requirement: 75%
          </Text>
          <Text variant="caption" color="muted" style={{ fontSize: 9 }}>
            Target: 95%
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
    borderRadius: 8,
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
    fontSize: 32,
    lineHeight: 36,
    letterSpacing: -1,
  },
  percentUnit: {
    fontSize: 18,
    marginLeft: 2,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    marginTop: 4,
  },
  statusBadgeText: {
    fontSize: 10,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  dividerCol: {
    width: 1,
    height: 52,
    backgroundColor: '#E5E9EE',
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
