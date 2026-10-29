import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme';
import { Text } from '../../../components/common/Text';
import { studentService } from '../../../services/api/studentService';
import { BackendNoteResponse } from '../../../types/backend';
import { LoadingState } from '../../../components/feedback/LoadingState';
import { ErrorState } from '../../../components/feedback/ErrorState';
import { EmptyState } from '../../../components/feedback/EmptyState';

export interface StudentStudyMaterialScreenProps {
  onBack?: () => void;
}

export const StudentStudyMaterialScreen: React.FC<StudentStudyMaterialScreenProps> = ({ onBack }) => {
  const { colors, spacing, borderRadius } = useTheme();
  const insets = useSafeAreaInsets();

  const [notes, setNotes] = useState<BackendNoteResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');

  // Active downloading item tracking
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fetchNotes = useCallback(async () => {
    try {
      setError(null);
      const res = await studentService.getStudentNotes();
      setNotes(res || []);
    } catch (err: any) {
      setError(err?.message || 'Unable to load study materials');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotes();
  };

  // Extract distinct subjects from real backend notes
  const availableSubjects = useMemo(() => {
    const subjects = new Set<string>();
    for (const note of notes) {
      if (note.subject_name) {
        subjects.add(note.subject_name.trim());
      }
    }
    return ['ALL', ...Array.from(subjects).sort()];
  }, [notes]);

  // Filter notes based on subject and search query
  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const matchesSubject =
        selectedSubject === 'ALL' ||
        (note.subject_name && note.subject_name.trim() === selectedSubject);

      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        note.title.toLowerCase().includes(q) ||
        (note.description && note.description.toLowerCase().includes(q)) ||
        (note.subject_name && note.subject_name.toLowerCase().includes(q)) ||
        (note.original_filename && note.original_filename.toLowerCase().includes(q));

      return matchesSubject && matchesQuery;
    });
  }, [notes, selectedSubject, searchQuery]);

  const handleDownload = async (note: BackendNoteResponse) => {
    try {
      setDownloadingId(note.id);
      setFeedbackMessage(null);
      const filename = note.original_filename || `${note.title.replace(/\s+/g, '_')}.pdf`;
      await studentService.downloadNoteFile(note.id, filename);
      setFeedbackMessage({ text: `Downloaded "${filename}"`, type: 'success' });
      setTimeout(() => setFeedbackMessage(null), 4000);
    } catch (err: any) {
      setFeedbackMessage({
        text: err?.message || 'Could not download file. Please retry.',
        type: 'error',
      });
      setTimeout(() => setFeedbackMessage(null), 5000);
    } finally {
      setDownloadingId(null);
    }
  };

  const handlePreview = async (note: BackendNoteResponse) => {
    try {
      setDownloadingId(note.id);
      setFeedbackMessage(null);
      await studentService.viewNoteFile(note.id);
    } catch (err: any) {
      setFeedbackMessage({
        text: err?.message || 'Could not preview file.',
        type: 'error',
      });
      setTimeout(() => setFeedbackMessage(null), 5000);
    } finally {
      setDownloadingId(null);
    }
  };

  const formatFileSize = (bytes?: number | null) => {
    if (!bytes) return null;
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatUploadDate = (isoStr: string) => {
    const d = new Date(isoStr);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    }
    return isoStr;
  };

  const getDocIcon = (filename?: string | null) => {
    const ext = filename?.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return 'document-text-outline';
    if (ext === 'doc' || ext === 'docx') return 'document-outline';
    if (ext === 'xls' || ext === 'xlsx') return 'grid-outline';
    if (ext === 'png' || ext === 'jpg' || ext === 'jpeg') return 'image-outline';
    return 'document-text-outline';
  };

  if (loading && notes.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center' }}>
        <LoadingState message="Loading study materials..." />
      </View>
    );
  }

  if (error && notes.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center' }}>
        <ErrorState message={error} onRetry={fetchNotes} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* 1. SCREEN HEADER */}
      <View
        style={[
          styles.headerSection,
          {
            backgroundColor: colors.surface,
            borderBottomColor: colors.border,
            paddingTop: Math.max(insets.top, 16) + 4,
            paddingHorizontal: spacing.screenPadding,
          },
        ]}
      >
        <View style={styles.titleRow}>
          {onBack && (
            <TouchableOpacity
              onPress={onBack}
              activeOpacity={0.7}
              style={[styles.backBtn, { backgroundColor: colors.surfaceVariant, marginRight: 10 }]}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
            </TouchableOpacity>
          )}
          <View style={{ flex: 1 }}>
            <Text variant="caption" color="secondary" weight="700" style={{ letterSpacing: 0.8 }}>
              ACADEMIC REPOSITORY
            </Text>
            <Text variant="h2" color="primary" weight="700" style={styles.titleText}>
              Study Material
            </Text>
            <Text variant="bodySmall" color="secondary" style={{ marginTop: 2 }}>
              Lecture notes, DPP sheets & reference documents
            </Text>
          </View>
        </View>

        {/* Search Input Box */}
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: colors.surfaceVariant,
              borderColor: colors.border,
              borderRadius: borderRadius.sm,
            },
          ]}
        >
          <Ionicons name="search-outline" size={16} color={colors.textSecondary} style={{ marginRight: 8 }} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search by chapter, topic or title..."
            placeholderTextColor={colors.textMuted}
            style={[styles.searchInput, { color: colors.textPrimary }]}
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} activeOpacity={0.7}>
              <Ionicons name="close-circle" size={16} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Subject Filter Pills */}
        {availableSubjects.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            {availableSubjects.map((subject) => {
              const isSelected = selectedSubject === subject;
              return (
                <TouchableOpacity
                  key={subject}
                  onPress={() => setSelectedSubject(subject)}
                  activeOpacity={0.7}
                  style={[
                    styles.filterChip,
                    {
                      backgroundColor: isSelected ? colors.navy : colors.surfaceVariant,
                      borderColor: isSelected ? colors.navy : colors.border,
                      borderRadius: borderRadius.sm,
                    },
                  ]}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                >
                  <Text
                    variant="caption"
                    style={{
                      color: isSelected ? '#FFFFFF' : colors.textSecondary,
                      fontWeight: isSelected ? '700' : '500',
                      letterSpacing: 0.2,
                    }}
                  >
                    {subject === 'ALL' ? 'All Subjects' : subject}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
      </View>

      {/* 2. NOTIFICATION / FEEDBACK BANNER */}
      {feedbackMessage && (
        <View
          style={[
            styles.feedbackBanner,
            {
              backgroundColor: feedbackMessage.type === 'success' ? colors.successContainer : colors.dangerContainer,
              borderColor: feedbackMessage.type === 'success' ? colors.success : colors.danger,
              marginHorizontal: spacing.screenPadding,
              marginTop: 10,
            },
          ]}
        >
          <Ionicons
            name={feedbackMessage.type === 'success' ? 'checkmark-circle-outline' : 'alert-circle-outline'}
            size={16}
            color={feedbackMessage.type === 'success' ? colors.success : colors.danger}
            style={{ marginRight: 8 }}
          />
          <Text
            variant="caption"
            color={feedbackMessage.type === 'success' ? 'success' : 'danger'}
            style={{ flex: 1 }}
          >
            {feedbackMessage.text}
          </Text>
        </View>
      )}

      {/* 3. SCROLLABLE MATERIAL LIST */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.listContent,
          {
            paddingHorizontal: spacing.screenPadding,
            paddingBottom: Math.max(insets.bottom, 16) + 80,
          },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.navy}
            colors={[colors.navy]}
          />
        }
      >
        {filteredNotes.length === 0 ? (
          <View style={{ paddingTop: 40 }}>
            <EmptyState
              iconName="document-text-outline"
              title={searchQuery ? 'No matching materials found' : 'No Study Materials Available'}
              description={
                searchQuery
                  ? `No resources matching "${searchQuery}" for the selected subject.`
                  : 'Authorized lecture notes and revision problem sheets will appear here once published for your class.'
              }
            />
          </View>
        ) : (
          filteredNotes.map((note) => {
            const isDownloading = downloadingId === note.id;
            const sizeStr = formatFileSize(note.file_size_bytes);
            const uploadDate = formatUploadDate(note.created_at);
            const docIcon = getDocIcon(note.original_filename);

            return (
              <View
                key={note.id}
                style={[
                  styles.materialCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    borderRadius: borderRadius.md,
                  },
                ]}
              >
                <View style={styles.cardHeader}>
                  {/* Disciplined Document Icon (Muted Violet) */}
                  <View style={[styles.iconWrapper, { backgroundColor: colors.iconVioletBg }]}>
                    <Ionicons name={docIcon as any} size={20} color={colors.iconViolet} />
                  </View>

                  <View style={styles.cardInfo}>
                    <View style={styles.subjectRow}>
                      {note.subject_name && (
                        <View style={[styles.subjectBadge, { backgroundColor: colors.iconVioletBg }]}>
                          <Text variant="caption" weight="600" style={{ fontSize: 10, color: colors.iconViolet }}>
                            {note.subject_name}
                          </Text>
                        </View>
                      )}
                      <Text variant="caption" color="muted" style={styles.dateLabel}>
                        {uploadDate}
                      </Text>
                    </View>

                    <Text variant="body" color="primary" weight="600" style={styles.materialTitle}>
                      {note.title}
                    </Text>

                    {note.description ? (
                      <Text variant="bodySmall" color="secondary" numberOfLines={2} style={styles.descText}>
                        {note.description}
                      </Text>
                    ) : null}

                    {/* Metadata row */}
                    <View style={styles.metaRow}>
                      {note.original_filename && (
                        <Text variant="caption" color="muted" numberOfLines={1} style={styles.filenameText}>
                          {note.original_filename}
                        </Text>
                      )}
                      {sizeStr && (
                        <Text variant="caption" color="muted" style={styles.sizeText}>
                          ({sizeStr})
                        </Text>
                      )}
                    </View>
                  </View>
                </View>

                {/* Bottom Card Actions: Preview & Download */}
                <View style={[styles.cardActionsRow, { borderTopColor: colors.borderLight }]}>
                  <TouchableOpacity
                    onPress={() => handlePreview(note)}
                    disabled={isDownloading}
                    activeOpacity={0.7}
                    style={styles.cardActionBtn}
                  >
                    <Ionicons name="eye-outline" size={14} color={colors.navy} style={{ marginRight: 5 }} />
                    <Text variant="caption" color="primary" weight="600">
                      View
                    </Text>
                  </TouchableOpacity>

                  <View style={[styles.actionDivider, { backgroundColor: colors.borderLight }]} />

                  <TouchableOpacity
                    onPress={() => handleDownload(note)}
                    disabled={isDownloading}
                    activeOpacity={0.7}
                    style={styles.cardActionBtn}
                  >
                    {isDownloading ? (
                      <ActivityIndicator size="small" color={colors.navy} style={{ marginRight: 6 }} />
                    ) : (
                      <Ionicons name="download-outline" size={14} color={colors.accent} style={{ marginRight: 5 }} />
                    )}
                    <Text variant="caption" color="accent" weight="700">
                      {isDownloading ? 'Downloading...' : 'Download'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  headerSection: {
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    letterSpacing: -0.3,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    paddingVertical: 0,
  },
  filterScroll: {
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 4,
  },
  filterChip: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  feedbackBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
  },
  listContent: {
    paddingTop: 12,
  },
  materialCard: {
    borderWidth: 1,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    padding: 14,
  },
  iconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  subjectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  subjectBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  dateLabel: {
    fontSize: 11,
  },
  materialTitle: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 4,
  },
  descText: {
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  filenameText: {
    fontSize: 11,
    flexShrink: 1,
  },
  sizeText: {
    fontSize: 11,
    marginLeft: 4,
  },
  cardActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
  },
  cardActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  actionDivider: {
    width: 1,
    height: '60%',
  },
});
