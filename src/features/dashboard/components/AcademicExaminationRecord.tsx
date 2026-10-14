import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme';
import { Text } from '../../../components/common/Text';
import { Badge } from '../../../components/common/Badge';
import { PerformanceMetrics, RecentResultItem } from '../../../types/dashboard';

export interface AcademicExaminationRecordProps {
  metrics?: PerformanceMetrics;
  results: RecentResultItem[];
  onSelectResult?: (item: RecentResultItem) => void;
  onViewAll?: () => void;
}

export const AcademicExaminationRecord: React.FC<AcademicExaminationRecordProps> = ({
  metrics,
  results = [],
  onSelectResult,
  onViewAll,
}) => {
  const { colors, spacing, borderRadius, shadows } = useTheme();

  const latestResult = results.length > 0 ? results[0] : null;
  const previousResults = results.length > 1 ? results.slice(1) : [];

  const latestPct = latestResult
    ? Math.round((latestResult.score / latestResult.maxScore) * 100)
    : 0;
  const isLatestDistinction = latestPct >= 90;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    }
    return dateStr;
  };

  const hasTrend = metrics && metrics.trendPoints && metrics.trendPoints.length >= 2;
  const isUp = metrics?.trendDirection === 'UP';

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
      {/* Section header band — pale blue */}
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
          <Text variant="academicLabel" color="primary" style={styles.sectionTitle}>
            Test Performance
          </Text>
          <Text variant="caption" color="muted" style={{ marginTop: 1 }}>
            Individual test evaluations
          </Text>
        </View>
        {onViewAll && (
          <TouchableOpacity
            onPress={onViewAll}
            activeOpacity={0.7}
            style={[
              styles.viewAllBtn,
              { backgroundColor: colors.primary, borderRadius: borderRadius.sm },
            ]}
            accessibilityRole="button"
            accessibilityLabel="View full examination archive"
          >
            <Text style={styles.viewAllText} color="inverse" weight="700">
              Archive
            </Text>
            <Ionicons name="arrow-forward" size={11} color={colors.textInverse} style={{ marginLeft: 3 }} />
          </TouchableOpacity>
        )}
      </View>

      <View style={{ paddingHorizontal: spacing.cardPadding, paddingTop: spacing.md }}>
        {/* 2. LATEST TEST HERO */}
        {latestResult ? (
          <TouchableOpacity
            onPress={() => onSelectResult && onSelectResult(latestResult)}
            activeOpacity={onSelectResult ? 0.8 : 1}
            style={[
              styles.latestBlock,
              {
                backgroundColor: isLatestDistinction
                  ? colors.primaryContainer
                  : colors.surfaceVariant,
                borderColor: isLatestDistinction
                  ? colors.borderFocus + '50'
                  : colors.border,
                borderRadius: borderRadius.md,
                padding: spacing.md,
              },
            ]}
            accessibilityRole={onSelectResult ? 'button' : 'none'}
            accessibilityLabel={`Latest test: ${latestResult.testName}, scored ${latestResult.score} out of ${latestResult.maxScore}`}
          >
            {/* Top label row */}
            <View style={styles.latestTopRow}>
              <View style={styles.latestLabel}>
                <View style={[styles.labelDot, { backgroundColor: colors.accent }]} />
                <Text style={styles.latestLabelText} color="secondary" weight="700">
                  LATEST RESULT
                </Text>
              </View>
              <Badge
                label={isLatestDistinction ? `${latestPct}% · DISTINCTION` : `${latestPct}%`}
                variant={isLatestDistinction ? 'distinction' : 'accent'}
                size="sm"
              />
            </View>

            {/* Test name */}
            <Text
              variant="h3"
              color="primary"
              weight="700"
              style={styles.testName}
              numberOfLines={1}
            >
              {latestResult.testName}
            </Text>

            {/* Meta */}
            <View style={styles.testMeta}>
              <Text variant="caption" color="secondary" weight="600">
                {latestResult.subject}
              </Text>
              <Text variant="caption" color="muted" style={{ marginHorizontal: 6 }}>·</Text>
              <Text variant="caption" color="muted">
                {formatDate(latestResult.date)}
              </Text>
            </View>

            {/* Score hero row */}
            <View style={[styles.scoreRow, { borderTopColor: colors.borderLight }]}>
              <View style={styles.scoreGroup}>
                <Text
                  variant="metricHero"
                  color="primary"
                  weight="700"
                  style={styles.scoreNum}
                >
                  {latestResult.score}
                </Text>
                <Text
                  variant="h3"
                  color="muted"
                  weight="500"
                  style={styles.maxScore}
                >
                  /{latestResult.maxScore}
                </Text>
              </View>
              <View style={styles.inspectLink}>
                <Text variant="caption" color="accent" weight="600">
                  View Details
                </Text>
                <Ionicons name="chevron-forward" size={13} color={colors.accent} style={{ marginLeft: 2 }} />
              </View>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.emptyBlock}>
            <Text variant="bodySmall" color="secondary" align="center">
              No examinations evaluated yet for this session.
            </Text>
          </View>
        )}

        {/* 3. PERFORMANCE TREND — only when verified historical data */}
        {metrics && (
          <View
            style={[
              styles.trendBlock,
              {
                borderTopColor: colors.borderLight,
                marginTop: spacing.md,
                paddingTop: spacing.md,
              },
            ]}
          >
            <View style={styles.trendRow}>
              <View>
                <Text variant="caption" color="muted" weight="700" style={{ letterSpacing: 0.7 }}>
                  SESSION AVERAGE
                </Text>
                <View style={styles.meanRow}>
                  <Text variant="h3" color="primary" weight="700">
                    {metrics.averageScore}
                  </Text>
                  <Text variant="caption" color="muted" style={{ marginLeft: 4 }}>
                    / 100 across {metrics.testsCompleted} tests
                  </Text>
                </View>
              </View>
              {hasTrend && metrics.deltaTrend > 0 && (
                <View
                  style={[
                    styles.trendBadge,
                    {
                      borderColor: isUp ? '#A8DFC8' : '#E9D89A',
                      backgroundColor: isUp ? '#E7F7EF' : '#FFFBEB',
                    },
                  ]}
                >
                  <Ionicons
                    name={isUp ? 'trending-up' : 'trending-down'}
                    size={13}
                    color={isUp ? '#15966A' : '#C69A45'}
                    style={{ marginRight: 4 }}
                  />
                  <Text
                    variant="caption"
                    color={isUp ? 'emerald' : 'distinction'}
                    weight="700"
                  >
                    {isUp ? `+${metrics.deltaTrend}` : `-${metrics.deltaTrend}`} pts
                  </Text>
                </View>
              )}
            </View>

            {/* Micro bar chart */}
            {hasTrend && metrics.trendPoints && (
              <View style={[styles.microBarsRow, { marginTop: spacing.sm }]}>
                {metrics.trendPoints.map((point, index) => {
                  const isLatestPoint = index === metrics.trendPoints.length - 1;
                  const isDistinction = point.percentage >= 90;
                  return (
                    <View key={point.id} style={styles.microBarItem}>
                      <Text
                        variant="caption"
                        color={isLatestPoint ? 'primary' : 'muted'}
                        weight={isLatestPoint ? '700' : '500'}
                        style={{ fontSize: 10, marginBottom: 4 }}
                      >
                        {point.percentage}%
                      </Text>
                      <View
                        style={[
                          styles.microBarTrack,
                          {
                            backgroundColor: colors.surfaceVariant,
                            borderColor: colors.border,
                          },
                        ]}
                      >
                        <View
                          style={[
                            styles.microBarFill,
                            {
                              height: `${Math.max(20, Math.min(100, point.percentage))}%`,
                              backgroundColor: isDistinction
                                ? '#C69A45'
                                : '#087BAF',
                              opacity: isLatestPoint ? 1 : 0.55,
                            },
                          ]}
                        />
                      </View>
                      <Text
                        variant="caption"
                        color={isLatestPoint ? 'primary' : 'muted'}
                        weight={isLatestPoint ? '700' : '500'}
                        style={{ marginTop: 4, fontSize: 9 }}
                      >
                        {point.label}
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        )}

        {/* 4. PREVIOUS RESULTS — compact academic ledger list */}
        {previousResults.length > 0 && (
          <View
            style={[
              styles.previousSection,
              {
                borderTopColor: colors.borderLight,
                marginTop: spacing.md,
                paddingTop: spacing.md,
              },
            ]}
          >
            <View style={styles.previousHeader}>
              <Text variant="academicLabel" color="muted" style={styles.previousTitle}>
                PREVIOUS RESULTS
              </Text>
              <Text variant="caption" color="muted">
                {previousResults.length} records
              </Text>
            </View>

            <View>
              {previousResults.map((item, idx) => {
                const isLast = idx === previousResults.length - 1;
                const pct = Math.round((item.score / item.maxScore) * 100);
                const isDistinction = pct >= 90;

                return (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => onSelectResult && onSelectResult(item)}
                    activeOpacity={0.7}
                    style={[
                      styles.resultRow,
                      !isLast && { borderBottomColor: colors.borderLight, borderBottomWidth: 1 },
                      { paddingVertical: spacing.sm + 2 },
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel={`${item.testName}, score ${item.score} out of ${item.maxScore}`}
                  >
                    {/* Date */}
                    <View style={styles.colDate}>
                      <Text variant="caption" color="muted" weight="600">
                        {formatDate(item.date)}
                      </Text>
                    </View>

                    {/* Test name & subject */}
                    <View style={styles.colInfo}>
                      <Text
                        variant="bodySmall"
                        color="primary"
                        weight="600"
                        numberOfLines={1}
                      >
                        {item.testName}
                      </Text>
                      {item.subject && (
                        <Text
                          variant="caption"
                          color="muted"
                          numberOfLines={1}
                          style={{ marginTop: 1 }}
                        >
                          {item.subject}
                        </Text>
                      )}
                    </View>

                    {/* Score + badge */}
                    <View style={styles.colScore}>
                      <Text variant="bodySmall" color="primary" weight="700">
                        {item.score}
                        <Text variant="caption" color="muted">/{item.maxScore}</Text>
                      </Text>
                      <Badge
                        label={`${pct}%`}
                        variant={isDistinction ? 'distinction' : 'accent'}
                        size="sm"
                        style={{ marginTop: 2 }}
                      />
                    </View>

                    <Ionicons
                      name="chevron-forward"
                      size={13}
                      color={colors.textMuted}
                      style={{ marginLeft: 6 }}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Footer link */}
        {onViewAll && (
          <TouchableOpacity
            onPress={onViewAll}
            activeOpacity={0.7}
            style={[styles.footerLink, { borderTopColor: colors.borderLight }]}
            accessibilityRole="button"
            accessibilityLabel="Open all results tab"
          >
            <Text variant="caption" color="accent" weight="700">
              View full assessment record →
            </Text>
          </TouchableOpacity>
        )}
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
  latestBlock: {
    borderWidth: 1,
  },
  latestTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  latestLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginRight: 5,
  },
  latestLabelText: {
    fontSize: 9,
    letterSpacing: 0.9,
  },
  testName: {
    letterSpacing: -0.2,
  },
  testMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    marginTop: 10,
    paddingTop: 8,
  },
  scoreGroup: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  scoreNum: {
    letterSpacing: -0.5,
  },
  maxScore: {
    marginLeft: 4,
  },
  inspectLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 4,
  },
  emptyBlock: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  trendBlock: {
    borderTopWidth: 1,
  },
  trendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  meanRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 2,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
  microBarsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 64,
    paddingHorizontal: 4,
  },
  microBarItem: {
    alignItems: 'center',
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
  },
  microBarTrack: {
    width: 8,
    height: 38,
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  microBarFill: {
    width: '100%',
    borderRadius: 3,
  },
  previousSection: {
    borderTopWidth: 1,
  },
  previousHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  previousTitle: {
    fontSize: 9,
    letterSpacing: 1,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colDate: {
    width: 50,
  },
  colInfo: {
    flex: 1,
    paddingHorizontal: 6,
  },
  colScore: {
    alignItems: 'flex-end',
  },
  footerLink: {
    borderTopWidth: 1,
    marginTop: 12,
    paddingTop: 8,
    alignItems: 'center',
  },
});
