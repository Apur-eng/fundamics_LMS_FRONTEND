import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme';
import { Text } from '../../../components/common/Text';
import { Badge } from '../../../components/common/Badge';
import { RecentResultItem } from '../../../types/dashboard';

export interface RecentResultsListProps {
  results: RecentResultItem[];
  onSelectResult?: (item: RecentResultItem) => void;
  onViewAll?: () => void;
}

export const RecentResultsList: React.FC<RecentResultsListProps> = ({
  results,
  onSelectResult,
  onViewAll,
}) => {
  const { colors, spacing, borderRadius, shadows } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surfaceElevated,
          borderColor: colors.border,
          borderRadius: borderRadius.lg,
          padding: spacing.cardPadding,
          marginBottom: spacing.lg,
        },
      ]}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <Text variant="academicLabel" color="secondary" style={{ letterSpacing: 1.1 }}>
          RECENT EVALUATION RECORDS
        </Text>
        {onViewAll && (
          <TouchableOpacity
            onPress={onViewAll}
            activeOpacity={0.7}
            style={styles.viewAllBtn}
            accessibilityRole="button"
            accessibilityLabel="View all results"
          >
            <Text variant="buttonSmall" color="accent" weight="600">
              View all results
            </Text>
            <Ionicons name="arrow-forward" size={14} color={colors.accent} style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        )}
      </View>

      {/* Divider */}
      <View style={[styles.divider, { backgroundColor: colors.borderLight, marginVertical: spacing.md }]} />

      {/* Results Rows */}
      {results && results.length > 0 ? (
        <View style={styles.list}>
          {results.map((item, index) => {
            const isLast = index === results.length - 1;
            const pct = Math.round((item.score / item.maxScore) * 100);
            const isDistinction = pct >= 90;

            // Format date e.g. "28 Sep"
            const dateObj = new Date(item.date);
            const dateStr = !isNaN(dateObj.getTime())
              ? dateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
              : item.date;

            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => onSelectResult && onSelectResult(item)}
                activeOpacity={onSelectResult ? 0.7 : 1}
                style={[
                  styles.resultRow,
                  !isLast && { borderBottomColor: colors.borderLight, borderBottomWidth: 1 },
                  { paddingVertical: spacing.sm + 2 },
                ]}
                accessibilityRole={onSelectResult ? 'button' : 'none'}
                accessibilityLabel={`${item.testName}, scored ${item.score} out of ${item.maxScore}`}
              >
                {/* Date Col */}
                <View style={styles.dateCol}>
                  <Text variant="caption" color="secondary" weight="600">
                    {dateStr}
                  </Text>
                </View>

                {/* Test Name & Subject */}
                <View style={styles.infoCol}>
                  <Text variant="body" color="primary" weight="600" numberOfLines={1}>
                    {item.testName}
                  </Text>
                  {item.subject && (
                    <Text variant="caption" color="muted" style={{ marginTop: 1 }}>
                      {item.subject}
                    </Text>
                  )}
                </View>

                {/* Score & Badge Col */}
                <View style={styles.scoreCol}>
                  <Text variant="body" color="primary" weight="700">
                    {item.score}
                    <Text variant="caption" color="muted">
                      /{item.maxScore}
                    </Text>
                  </Text>
                  <Badge
                    label={`${pct}%`}
                    variant={isDistinction ? 'distinction' : 'accent'}
                    size="sm"
                    style={{ marginTop: 2 }}
                  />
                </View>

                {/* Chevron */}
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={colors.textMuted}
                  style={{ marginLeft: 6 }}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text variant="bodySmall" color="secondary" align="center">
            No tests recorded yet.
          </Text>
          <Text variant="caption" color="muted" align="center" style={{ marginTop: 2 }}>
            Assessment evaluations will appear here after board simulations.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  divider: {
    height: 1,
  },
  list: {},
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateCol: {
    width: 54,
  },
  infoCol: {
    flex: 1,
    paddingHorizontal: 8,
  },
  scoreCol: {
    alignItems: 'flex-end',
  },
  emptyContainer: {
    paddingVertical: 14,
    alignItems: 'center',
  },
});
