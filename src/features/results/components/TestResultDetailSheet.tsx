import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../../theme';
import { Text } from '../../../components/common/Text';
import { Badge } from '../../../components/common/Badge';
import { ModalSheet } from '../../../components/common/ModalSheet';
import { RecentResultItem } from '../../../types/dashboard';

export interface TestResultDetailSheetProps {
  visible: boolean;
  onClose: () => void;
  result: RecentResultItem | null;
}

export const TestResultDetailSheet: React.FC<TestResultDetailSheetProps> = ({
  visible,
  onClose,
  result,
}) => {
  const { colors, spacing, borderRadius } = useTheme();

  if (!result) return null;

  const percentage = Math.round((result.score / result.maxScore) * 100);
  const isDistinction = percentage >= 90;

  // Format date
  const dateObj = new Date(result.date);
  const dateFormatted = !isNaN(dateObj.getTime())
    ? dateObj.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : result.date;

  return (
    <ModalSheet visible={visible} onClose={onClose} title="TEST RESULT">
      <ScrollView bounces={false} contentContainerStyle={styles.content}>
        {/* Test Name & Date */}
        <View style={styles.headerBlock}>
          <Text variant="h2" color="primary" weight="700">
            {result.testName}
          </Text>
          <Text variant="bodySmall" color="secondary" style={{ marginTop: 4 }}>
            Evaluated on {dateFormatted}
          </Text>
          {result.subject && (
            <Text variant="caption" color="muted" style={{ marginTop: 2 }}>
              Subject: {result.subject}
            </Text>
          )}
        </View>

        {/* Big Score Card */}
        <View
          style={[
            styles.scoreCard,
            {
              backgroundColor: colors.surfaceVariant,
              borderRadius: borderRadius.lg,
              padding: spacing.cardPadding,
              marginVertical: spacing.md,
            },
          ]}
        >
          <Text variant="caption" color="secondary" weight="700" style={{ letterSpacing: 0.8 }}>
            FINAL EVALUATION
          </Text>

          <View style={styles.scoreRow}>
            <Text variant="hero" color="primary" weight="700" style={{ fontSize: 36, lineHeight: 42 }}>
              {result.score}
            </Text>
            <Text variant="h3" color="muted" weight="600" style={{ marginLeft: 6, marginBottom: 4 }}>
              / {result.maxScore}
            </Text>
          </View>

          <View style={styles.badgeRow}>
            <Badge
              label={`${percentage}% Score`}
              variant={isDistinction ? 'distinction' : 'accent'}
              size="md"
            />
            {isDistinction && (
              <Badge
                label="Distinction"
                variant="distinction"
                size="md"
                style={{ marginLeft: spacing.sm }}
              />
            )}
          </View>
        </View>

        {/* Academic Programme Metadata */}
        <View style={[styles.metaContainer, { borderTopColor: colors.borderLight, paddingTop: spacing.md }]}>
          <View style={styles.metaRow}>
            <Text variant="caption" color="muted">
              Examination Standard:
            </Text>
            <Text variant="caption" color="primary" weight="600">
              Fundemics Board Simulation Series
            </Text>
          </View>

          <View style={[styles.metaRow, { marginTop: 6 }]}>
            <Text variant="caption" color="muted">
              Verification Status:
            </Text>
            <Text variant="caption" color="success" weight="600">
              Official Faculty Verified
            </Text>
          </View>
        </View>
      </ScrollView>
    </ModalSheet>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingBottom: 24,
  },
  headerBlock: {},
  scoreCard: {
    alignItems: 'center',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginVertical: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  metaContainer: {
    borderTopWidth: 1,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
