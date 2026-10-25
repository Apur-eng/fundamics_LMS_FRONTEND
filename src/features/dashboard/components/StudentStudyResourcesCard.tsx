import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme';
import { Text } from '../../../components/common/Text';

export interface StudyResourceItem {
  id: string;
  title: string;
  subject?: string;
  originalFilename?: string;
  fileSizeBytes?: number;
  date?: string;
}

export interface StudentStudyResourcesCardProps {
  resources?: StudyResourceItem[];
  onResourcePress?: (item: StudyResourceItem) => void;
  onViewAll?: () => void;
}

export const StudentStudyResourcesCard: React.FC<StudentStudyResourcesCardProps> = ({
  resources = [],
  onResourcePress,
  onViewAll,
}) => {
  const { colors, spacing, borderRadius } = useTheme();

  const displayItems = resources.slice(0, 2);

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'PDF';
    const kb = bytes / 1024;
    if (kb < 1024) return `${Math.round(kb)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

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
              { backgroundColor: colors.amberContainer },
            ]}
          >
            <Ionicons name="book-outline" size={17} color={colors.amber} />
          </View>
          <View>
            <Text
              variant="caption"
              color="amber"
              weight="700"
              style={styles.sectionHeader}
            >
              LEARNING RESOURCES
            </Text>
            <Text variant="bodySmall" color="secondary" weight="500">
              Lecture Notes & Subject Handouts
            </Text>
          </View>
        </View>

        {onViewAll && resources.length > 2 && (
          <TouchableOpacity
            onPress={onViewAll}
            activeOpacity={0.7}
            style={styles.actionLink}
            accessibilityRole="button"
            accessibilityLabel="View all study materials"
          >
            <Text variant="caption" color="primaryBlue" weight="700">
              Library →
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Resource Items */}
      {displayItems.length > 0 ? (
        <View style={styles.resourceList}>
          {displayItems.map((item, idx) => (
            <TouchableOpacity
              key={item.id || `res-${idx}`}
              onPress={() => onResourcePress?.(item)}
              activeOpacity={0.75}
              style={[
                styles.itemRow,
                idx < displayItems.length - 1 && styles.itemBorder,
                { borderColor: colors.borderLight },
              ]}
            >
              <View
                style={[
                  styles.docIcon,
                  { backgroundColor: colors.amberContainer },
                ]}
              >
                <Ionicons name="document-text-outline" size={16} color={colors.amber} />
              </View>

              <View style={styles.itemTextCol}>
                <Text
                  variant="body"
                  color="primary"
                  weight="600"
                  numberOfLines={1}
                  style={{ fontSize: 13 }}
                >
                  {item.title}
                </Text>
                <View style={styles.itemMetaRow}>
                  {item.subject && (
                    <Text variant="caption" color="secondary" weight="600">
                      {item.subject}
                    </Text>
                  )}
                  {item.fileSizeBytes !== undefined && (
                    <>
                      <Text variant="caption" color="muted" style={{ marginHorizontal: 5 }}>
                        •
                      </Text>
                      <Text variant="caption" color="muted">
                        {formatFileSize(item.fileSizeBytes)}
                      </Text>
                    </>
                  )}
                </View>
              </View>

              <Ionicons name="download-outline" size={16} color={colors.primaryBlue} />
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="folder-open-outline" size={20} color={colors.textMuted} />
          <Text variant="caption" color="muted" style={{ marginTop: 4 }}>
            No new subject handouts uploaded this week.
          </Text>
        </View>
      )}
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
    marginBottom: 8,
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
  resourceList: {
    marginTop: 2,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
  },
  itemBorder: {
    borderBottomWidth: 1,
  },
  docIcon: {
    width: 30,
    height: 30,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  itemTextCol: {
    flex: 1,
    marginRight: 8,
  },
  itemMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  emptyContainer: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
