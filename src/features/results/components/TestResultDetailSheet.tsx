import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme';
import { Text } from '../../../components/common/Text';
import { Badge } from '../../../components/common/Badge';
import { ModalSheet } from '../../../components/common/ModalSheet';
import { RecentResultItem } from '../../../types/dashboard';
import { studentService } from '../../../services/api/studentService';

export interface TestResultDetailSheetProps {
  visible: boolean;
  onClose: () => void;
  result: RecentResultItem | null;
  onDownloadDocument?: (resultId: string, filename?: string) => Promise<void> | void;
  onViewDocument?: (resultId: string) => Promise<void> | void;
}

export const TestResultDetailSheet: React.FC<TestResultDetailSheetProps> = ({
  visible,
  onClose,
  result,
  onDownloadDocument,
  onViewDocument,
}) => {
  const { colors, spacing, borderRadius } = useTheme();
  const [downloading, setDownloading] = useState(false);
  const [viewing, setViewing] = useState(false);
  const [docError, setDocError] = useState<string | null>(null);

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

  const handleDownload = async () => {
    if (!result.resultId || downloading) return;
    try {
      setDownloading(true);
      setDocError(null);
      if (onDownloadDocument) {
        await onDownloadDocument(result.resultId, result.documentFilename || undefined);
      } else {
        await studentService.downloadResultDocument(result.resultId, result.documentFilename || undefined);
      }
    } catch (err: any) {
      setDocError(err?.message || 'Unable to download scorecard');
    } finally {
      setDownloading(false);
    }
  };

  const handleView = async () => {
    if (!result.resultId || viewing) return;
    try {
      setViewing(true);
      setDocError(null);
      if (onViewDocument) {
        await onViewDocument(result.resultId);
      } else {
        await studentService.viewResultDocument(result.resultId);
      }
    } catch (err: any) {
      setDocError(err?.message || 'Unable to preview scorecard');
    } finally {
      setViewing(false);
    }
  };

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

        {/* Attached Scorecard Document Box (if present) */}
        {result.hasDocument && result.resultId && (
          <View
            style={[
              styles.documentBox,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderRadius: borderRadius.md,
                padding: spacing.cardPadding,
                marginBottom: spacing.md,
              },
            ]}
          >
            <View style={styles.docHeader}>
              <View style={[styles.docIcon, { borderRadius: borderRadius.sm }]}>
                <Ionicons name="document-text" size={18} color="#DC2626" />
                <Text style={styles.docIconText}>PDF</Text>
              </View>

              <View style={{ flex: 1, marginHorizontal: 10 }}>
                <Text variant="bodySmall" color="primary" weight="700" numberOfLines={1}>
                  {result.documentFilename || `${result.testName} Scorecard.pdf`}
                </Text>
                <Text variant="caption" color="secondary" style={{ marginTop: 2 }}>
                  Official Verified Scorecard Document
                </Text>
              </View>
            </View>

            {docError && (
              <Text variant="caption" color="danger" style={{ marginTop: 6 }}>
                {docError}
              </Text>
            )}

            <View style={styles.docActionsRow}>
              <TouchableOpacity
                onPress={handleView}
                activeOpacity={0.7}
                disabled={viewing || downloading}
                style={[
                  styles.docBtn,
                  {
                    backgroundColor: colors.surfaceVariant,
                    borderColor: colors.borderLight,
                    borderRadius: borderRadius.sm,
                  },
                ]}
                accessibilityRole="button"
                accessibilityLabel="Preview Scorecard PDF"
              >
                {viewing ? (
                  <ActivityIndicator size="small" color={colors.violet} />
                ) : (
                  <>
                    <Ionicons name="eye-outline" size={15} color={colors.textPrimary} style={{ marginRight: 6 }} />
                    <Text variant="caption" color="primary" weight="600">
                      Preview Document
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleDownload}
                activeOpacity={0.7}
                disabled={viewing || downloading}
                style={[
                  styles.docBtn,
                  {
                    backgroundColor: colors.navy,
                    borderRadius: borderRadius.sm,
                    marginLeft: 8,
                  },
                ]}
                accessibilityRole="button"
                accessibilityLabel="Download Scorecard PDF"
              >
                {downloading ? (
                  <ActivityIndicator size="small" color={colors.onPrimary} />
                ) : (
                  <>
                    <Ionicons name="download-outline" size={15} color={colors.onPrimary} style={{ marginRight: 6 }} />
                    <Text variant="caption" weight="700" style={{ color: colors.onPrimary }}>
                      Download PDF
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

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
  documentBox: {
    borderWidth: 1,
  },
  docHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  docIcon: {
    width: 36,
    height: 40,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  docIconText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#DC2626',
    marginTop: 1,
  },
  docActionsRow: {
    flexDirection: 'row',
    marginTop: 12,
  },
  docBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'transparent',
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
