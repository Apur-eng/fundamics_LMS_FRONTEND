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
  const isCompliant = overallPercentage >= 75;
  const isExemplary = overallPercentage >= 90;

  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const records = monthlyData?.records || [];

  const firstDay = records[0];
  const startDayOfWeek = firstDay ? firstDay.dayOfWeek : 2;
  const leadEmptySlots = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

  const progressPct = Math.max(0, Math.min(100, overallPercentage));

  // Status colors — light palette
  const presentBg = '#E7F7EF';
  const presentBorder = '#A8DFC8';
  const presentText = '#0F6B4A';
  const absentBg = '#FDECEE';
  const absentBorder = '#F0B4B8';
  const absentText = '#B93040';

  return (
    <View
      style={[
        styles.container,
        shadows.sm,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: borderRadius.lg,
          marginBottom: spacing.lg,
          overflow: 'hidden',
        },
      ]}
    >
      {/* Section header with pale-blue accent band */}
      <View
        style={[
          styles.sectionHeader,
          {
            backgroundColor: colors.surfaceVariant,
            borderBottomColor: colors.border,
            paddingHorizontal: spacing.cardPadding,
            paddingVertical: 10,
          },
        ]}
      >
        <View style={styles.sectionHeaderLeft}>
          <Text
            variant="academicLabel"
            color="primary"
            style={styles.sectionTitle}
          >
            Attendance Record
          </Text>
          <Text variant="caption" color="muted" style={{ marginTop: 1 }}>
            Day-wise register · 2026–27
          </Text>
        </View>
        {onViewAll && (
          <TouchableOpacity
            onPress={onViewAll}
            activeOpacity={0.7}
            style={[
              styles.viewAllBtn,
              {
                backgroundColor: colors.primary,
                borderRadius: borderRadius.sm,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel="View full attendance ledger"
          >
            <Text style={styles.viewAllText} color="inverse" weight="700">
              Ledger
            </Text>
            <Ionicons name="arrow-forward" size={11} color={colors.textInverse} style={{ marginLeft: 3 }} />
          </TouchableOpacity>
        )}
      </View>

      <View style={{ paddingHorizontal: spacing.cardPadding, paddingTop: spacing.md }}>
        {/* 2. Attendance Hero: Percentage + Figures */}
        <View style={styles.heroRow}>
          {/* Left: Large percentage */}
          <View style={styles.percentageCol}>
            <Text
              variant="metricHero"
              color="primary"
              weight="700"
              style={styles.percentageNum}
            >
              {overallPercentage}%
            </Text>
            {/* Status badge */}
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: isExemplary
                    ? '#E7F7EF'
                    : isCompliant
                    ? '#FFFBEB'
                    : '#FDECEE',
                  borderColor: isExemplary
                    ? '#A8DFC8'
                    : isCompliant
                    ? '#E9D89A'
                    : '#F0B4B8',
                },
              ]}
            >
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor: isExemplary
                      ? '#15966A'
                      : isCompliant
                      ? '#C69A45'
                      : '#D94F55',
                  },
                ]}
              />
              <Text
                style={styles.statusText}
                color={isExemplary ? 'emerald' : isCompliant ? 'distinction' : 'danger'}
                weight="700"
              >
                {isExemplary ? 'EXEMPLARY' : isCompliant ? 'CRITERIA MET' : 'CRITICAL'}
              </Text>
            </View>
          </View>

          {/* Right: Aligned stat figures */}
          <View style={[styles.figuresRow, { borderColor: colors.borderLight }]}>
            <View style={styles.figureItem}>
              <Text variant="h3" weight="700" style={{ color: '#15966A' }}>
                {presentDays}
              </Text>
              <Text variant="caption" color="muted" style={styles.figureLabel}>
                Present
              </Text>
            </View>
            <View style={[styles.figureDivider, { backgroundColor: colors.border }]} />
            <View style={styles.figureItem}>
              <Text
                variant="h3"
                weight="700"
                style={{ color: absentDays > 0 ? '#D94F55' : colors.textMuted }}
              >
                {absentDays}
              </Text>
              <Text variant="caption" color="muted" style={styles.figureLabel}>
                Absent
              </Text>
            </View>
            <View style={[styles.figureDivider, { backgroundColor: colors.border }]} />
            <View style={styles.figureItem}>
              <Text variant="h3" color="primary" weight="700">
                {totalDays}
              </Text>
              <Text variant="caption" color="muted" style={styles.figureLabel}>
                Total
              </Text>
            </View>
          </View>
        </View>

        {/* Progress bar with 75% statutory marker */}
        <View style={[styles.progressWrap, { marginTop: spacing.md }]}>
          <View
            style={[
              styles.progressTrack,
              { backgroundColor: colors.surfaceVariant, borderColor: colors.border },
            ]}
          >
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progressPct}%`,
                  backgroundColor: isExemplary
                    ? '#15966A'
                    : isCompliant
                    ? '#087BAF'
                    : '#D94F55',
                },
              ]}
            />
            {/* 75% threshold marker */}
            <View
              style={[
                styles.thresholdMarker,
                { left: '75%', backgroundColor: '#C69A45' },
              ]}
            />
          </View>
          <View style={styles.progressLabels}>
            <Text variant="caption" color="muted" style={{ fontSize: 9 }}>0%</Text>
            <View style={styles.thresholdLabel}>
              <View style={[styles.thresholdDot, { backgroundColor: '#C69A45' }]} />
              <Text variant="caption" color="distinction" weight="600" style={{ fontSize: 9 }}>
                75% req.
              </Text>
            </View>
            <Text variant="caption" color="muted" style={{ fontSize: 9 }}>100%</Text>
          </View>
        </View>

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: colors.borderLight, marginVertical: spacing.md }]} />

        {/* 3. Day-Wise Calendar */}
        <View style={styles.calendarHeaderRow}>
          <View style={styles.monthTitleWrap}>
            <Text variant="academicLabel" color="primary" style={styles.monthTitle}>
              {monthlyData?.monthName?.toUpperCase() || 'SEPTEMBER 2026'}
            </Text>
          </View>
          {monthlyData && (
            <View style={styles.monthTally}>
              <Text variant="caption" style={{ color: '#15966A' }} weight="700">
                {monthlyData.presentDays}P
              </Text>
              <Text variant="caption" color="muted" style={{ marginHorizontal: 4 }}>·</Text>
              <Text variant="caption" style={{ color: '#D94F55' }} weight="700">
                {monthlyData.absentDays}A
              </Text>
              <Text variant="caption" color="muted" style={{ marginHorizontal: 4 }}>·</Text>
              <Text variant="caption" color="muted" weight="600">
                {records.filter((r) => r.status === 'OFF').length} Off
              </Text>
            </View>
          )}
        </View>

        {/* Weekday column headers */}
        <View style={[styles.weekRow, { borderBottomColor: colors.border }]}>
          {weekDays.map((day, idx) => (
            <View key={`${day}-${idx}`} style={styles.weekCol}>
              <Text
                variant="caption"
                color="muted"
                align="center"
                weight="700"
                style={styles.weekDayText}
              >
                {day}
              </Text>
            </View>
          ))}
        </View>

        {/* Calendar grid */}
        {records.length > 0 ? (
          <View style={styles.calendarGrid}>
            {Array.from({ length: leadEmptySlots }).map((_, idx) => (
              <View key={`lead-${idx}`} style={styles.dayCell}>
                <View style={[styles.dayCellInner, { backgroundColor: 'transparent', borderColor: 'transparent' }]} />
              </View>
            ))}

            {records.map((rec) => {
              const isPresent = rec.status === 'PRESENT';
              const isAbsent = rec.status === 'ABSENT';
              const isOff = rec.status === 'OFF';

              return (
                <View key={rec.date} style={styles.dayCell}>
                  <View
                    style={[
                      styles.dayCellInner,
                      isPresent && {
                        backgroundColor: presentBg,
                        borderColor: presentBorder,
                      },
                      isAbsent && {
                        backgroundColor: absentBg,
                        borderColor: absentBorder,
                      },
                      isOff && {
                        backgroundColor: colors.surfaceVariant,
                        borderColor: colors.borderLight,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayNumber,
                        {
                          color: isAbsent
                            ? absentText
                            : isPresent
                            ? presentText
                            : colors.textMuted,
                          fontWeight: isAbsent || isPresent ? '700' : '400',
                        },
                      ]}
                    >
                      {rec.dayNumber}
                    </Text>
                    <View style={styles.dayStatusIcon}>
                      {isPresent && (
                        <Ionicons name="checkmark" size={8} color={presentText} />
                      )}
                      {isAbsent && (
                        <Ionicons name="close" size={8} color={absentText} />
                      )}
                      {isOff && (
                        <View style={[styles.offDash, { backgroundColor: colors.textMuted }]} />
                      )}
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyCalendar}>
            <Text variant="caption" color="muted" align="center">
              Loading attendance data…
            </Text>
          </View>
        )}

        {/* Legend */}
        <View style={[styles.legend, { borderTopColor: colors.borderLight, marginTop: 10, paddingTop: spacing.sm }]}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#15966A' }]} />
            <Text variant="caption" color="secondary" style={styles.legendText}>Present</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#D94F55' }]} />
            <Text variant="caption" color="secondary" style={styles.legendText}>Absent</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#D1DDE6', borderWidth: 1, borderColor: '#C4D0DA' }]} />
            <Text variant="caption" color="muted" style={styles.legendText}>No Class</Text>
          </View>
        </View>
      </View>

      {/* Bottom padding */}
      <View style={{ height: spacing.md }} />
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
    borderBottomWidth: 1,
  },
  sectionHeaderLeft: {
    flex: 1,
    paddingRight: 8,
  },
  sectionTitle: {
    fontSize: 11,
    letterSpacing: 0.8,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  viewAllText: {
    fontSize: 11,
    letterSpacing: 0.2,
  },
  heroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  percentageCol: {
    flex: 1,
    paddingRight: 12,
  },
  percentageNum: {
    letterSpacing: -1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 5,
    marginTop: 6,
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginRight: 5,
  },
  statusText: {
    fontSize: 9,
    letterSpacing: 0.7,
  },
  figuresRow: {
    flex: 1.3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderLeftWidth: 1,
    paddingLeft: 12,
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
  divider: {
    height: 1,
  },
  calendarHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  monthTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthTitle: {
    fontSize: 10,
    letterSpacing: 0.8,
  },
  monthTally: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weekRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingBottom: 5,
    marginBottom: 5,
  },
  weekCol: {
    width: '14.285%',
    alignItems: 'center',
  },
  weekDayText: {
    fontSize: 9,
    letterSpacing: 0.3,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.285%',
    alignItems: 'center',
    marginVertical: 2,
    paddingHorizontal: 1.5,
  },
  dayCellInner: {
    width: '100%',
    aspectRatio: 1,
    maxWidth: 36,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 1,
  },
  dayNumber: {
    fontSize: 10,
    lineHeight: 12,
  },
  dayStatusIcon: {
    height: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  offDash: {
    width: 6,
    height: 1,
    opacity: 0.5,
  },
  emptyCalendar: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    gap: 18,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 4,
  },
  legendText: {
    fontSize: 10,
  },
});
