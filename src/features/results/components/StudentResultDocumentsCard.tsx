import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme';
import { Text } from '../../../components/common/Text';
import { Badge } from '../../../components/common/Badge';
import { ResultDocumentItem } from '../../../types/dashboard';
import { formatDate } from '../../../utils/formatting';
import { studentService } from '../../../services/api/studentService';

export interface StudentResultDocumentsCardProps {
  documents: ResultDocumentItem[];
  onDocumentDownload?: (doc: ResultDocumentItem) => Promise<void> | void;
  onDocumentView?: (doc: ResultDocumentItem) => Promise<void> | void;
}

export const StudentResultDocumentsCard: React.FC<StudentResultDocumentsCardProps> = ({
  documents = [],
  onDocumentDownload,
  onDocumentView,
}) => {
  const { colors, spacing, borderRadius, shadows } = useTheme();
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleDownload = async (doc: ResultDocumentItem) => {
    if (busyAction) return;
    const actionKey = `${doc.resultId}_download`;
    try {
      setBusyAction(actionKey);
      setActionError(null);
      if (onDocumentDownload) {
        await onDocumentDownload(doc);
      } else {
        await studentService.downloadResultDocument(doc.resultId, doc.filename);
      }
    } catch (err: any) {
      setActionError(err?.message || 'Unable to download scorecard PDF');
    } finally {
      setBusyAction(null);
    }
  };

  const handleView = async (doc: ResultDocumentItem) => {
    if (busyAction) return;
    const actionKey = `${doc.resultId}_view`;
    try {
      setBusyAction(actionKey);
      setActionError(null);
      if (onDocumentView) {
        await onDocumentView(doc);
      } else {
        await studentService.viewResultDocument(doc.resultId);
      }
    } catch (err: any) {
      setActionError(err?.message || 'Unable to open scorecard document');
    } finally {
      setBusyAction(null);
    }
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: borderRadius.lg,
          padding: spacing.cardPadding,
          marginBottom: spacing.lg,
          ...shadows.sm,
        },
      ]}
    >
      {/* Section Header */}
      <View style={styles.headerRow}>
        <View style={styles.titleWithIcon}>
          <View
            style={[
              styles.iconWrapper,
              { backgroundColor: colors.violetContainer },
            ]}
          >
            <Ionicons name="document-text" size={17} color={colors.violet} />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              variant="caption"
              weight="700"
              style={[styles.sectionHeader, { color: colors.violet }]}
            >
              OFFICIAL SCORECARDS & REPORTS
            </Text>
            <Text variant="bodySmall" color="secondary" weight="500">
              Faculty-verified result PDFs & answer scripts
            </Text>
          </View>
        </View>

        {documents.length > 0 && (
          <Badge
            label={`${documents.length} ${documents.length === 1 ? 'Report' : 'Reports'}`}
            variant="accent"
            size="sm"
          />
        )}
      </View>

      {/* Non-destructive Action Error Banner */}
      {actionError && (
        <View
          style={[
            styles.errorBanner,
            {
              backgroundColor: colors.dangerContainer,
              borderColor: colors.danger,
              borderRadius: borderRadius.md,
              padding: spacing.sm,
              marginVertical: spacing.sm,
            },
          ]}
        >
          <Ionicons
            name="alert-circle-outline"
            size={16}
            color={colors.danger}
            style={{ marginRight: 6 }}
          />
          <Text variant="caption" color="danger" style={{ flex: 1 }}>
            {actionError}
          </Text>
          <TouchableOpacity onPress={() => setActionError(null)} activeOpacity={0.7}>
            <Ionicons name="close" size={16} color={colors.danger} />
          </TouchableOpacity>
        </View>
      )}

      {/* Documents List */}
      {documents.length > 0 ? (
        <View style={styles.documentsList}>
          {documents.map((doc, idx) => {
            const isLast = idx === documents.length - 1;
            const isDownloading = busyAction === `${doc.resultId}_download`;
            const isViewing = busyAction === `${doc.resultId}_view`;

            return (
              <View
                key={doc.resultId || `doc-${idx}`}
                style={[
                  styles.documentRow,
                  !isLast && {
                    borderBottomWidth: 1,
                    borderBottomColor: colors.borderLight,
                  },
                ]}
              >
                {/* PDF Document Visual Badge */}
                <View style={[styles.pdfBadge, { borderRadius: borderRadius.md }]}>
                  <Ionicons name="document-text" size={18} color="#DC2626" />
                  <Text style={styles.pdfBadgeText}>PDF</Text>
                </View>

                {/* Metadata Column */}
                <View style={styles.metaCol}>
                  <Text
                    variant="body"
                    color="primary"
                    weight="600"
                    numberOfLines={1}
                    style={{ fontSize: 13 }}
                  >
                    {doc.title}
                  </Text>
                  <Text
                    variant="caption"
                    color="secondary"
                    weight="500"
                    numberOfLines={1}
                    style={{ marginTop: 2 }}
                  >
                    {doc.examName}
                    {doc.subjectName ? ` • ${doc.subjectName}` : ''}
                  </Text>
                  <Text variant="caption" color="muted" style={{ marginTop: 2, fontSize: 10 }}>
                    Published: {formatDate(doc.publishedAt || doc.examDate || '')}
                    {doc.score !== undefined && doc.maxScore !== undefined
                      ? ` • ${doc.score}/${doc.maxScore} (${doc.percentage}%)`
                      : ''}
                  </Text>
                </View>

                {/* Actions Column */}
                <View style={styles.actionsCol}>
                  {/* View Action */}
                  <TouchableOpacity
                    onPress={() => handleView(doc)}
                    activeOpacity={0.7}
                    disabled={!!busyAction}
                    style={[
                      styles.actionBtn,
                      {
                        backgroundColor: colors.surfaceVariant,
                        borderColor: colors.borderLight,
                        borderRadius: borderRadius.sm,
                      },
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel={`Preview ${doc.title}`}
                  >
                    {isViewing ? (
                      <ActivityIndicator size="small" color={colors.violet} />
                    ) : (
                      <>
                        <Ionicons
                          name="eye-outline"
                          size={14}
                          color={colors.textPrimary}
                          style={{ marginRight: 4 }}
                        />
                        <Text variant="caption" color="primary" weight="600" style={{ fontSize: 11 }}>
                          View
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>

                  {/* Download Action */}
                  <TouchableOpacity
                    onPress={() => handleDownload(doc)}
                    activeOpacity={0.7}
                    disabled={!!busyAction}
                    style={[
                      styles.actionBtn,
                      {
                        backgroundColor: colors.navy,
                        borderRadius: borderRadius.sm,
                        marginLeft: 6,
                      },
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel={`Download ${doc.title}`}
                  >
                    {isDownloading ? (
                      <ActivityIndicator size="small" color={colors.onPrimary} />
                    ) : (
                      <>
                        <Ionicons
                          name="download-outline"
                          size={14}
                          color={colors.onPrimary}
                          style={{ marginRight: 4 }}
                        />
                        <Text
                          variant="caption"
                          weight="700"
                          style={{ color: colors.onPrimary, fontSize: 11 }}
                        >
                          PDF
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <View
            style={[
              styles.emptyIconCircle,
              { backgroundColor: colors.surfaceVariant },
            ]}
          >
            <Ionicons name="document-text-outline" size={22} color={colors.textMuted} />
          </View>
          <Text
            variant="bodySmall"
            color="secondary"
            weight="600"
            style={{ marginTop: 8 }}
          >
            No Scorecards Published Yet
          </Text>
          <Text
            variant="caption"
            color="muted"
            align="center"
            style={{ marginTop: 4, maxWidth: 280 }}
          >
            Official examination result sheets and verified scorecards will be listed here once published by your instructors.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
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
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  documentsList: {
    marginTop: 4,
  },
  documentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  pdfBadge: {
    width: 38,
    height: 42,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  pdfBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#DC2626',
    marginTop: 1,
    letterSpacing: 0.5,
  },
  metaCol: {
    flex: 1,
    marginRight: 8,
  },
  actionsCol: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: 'transparent',
    minWidth: 54,
    minHeight: 30,
  },
  emptyContainer: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
