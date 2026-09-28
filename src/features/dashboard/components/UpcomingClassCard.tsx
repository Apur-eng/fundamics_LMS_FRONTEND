import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme';
import { Text } from '../../../components/common/Text';
import { Card } from '../../../components/common/Card';
import { Badge } from '../../../components/common/Badge';
import { UpcomingClassItem } from '../../../types/dashboard';

export interface UpcomingClassCardProps {
  item: UpcomingClassItem;
  onPress?: () => void;
}

export const UpcomingClassCard: React.FC<UpcomingClassCardProps> = ({ item, onPress }) => {
  const { colors, spacing, borderRadius } = useTheme();

  const isLive = item.status === 'LIVE';

  return (
    <Card elevation="sm" padding="md" style={styles.card} onPress={onPress}>
      <View style={styles.headerRow}>
        <View style={styles.subjectContainer}>
          <Text variant="h4" color="primary" weight="700">
            {item.subject}
          </Text>
          <Text
            variant="caption"
            color="secondary"
            numberOfLines={1}
            style={{ marginTop: 2 }}
          >
            {item.topic}
          </Text>
        </View>

        <Badge
          label={item.status}
          variant={isLive ? 'danger' : 'neutral'}
          size="sm"
          icon={isLive ? <Ionicons name="radio" size={10} color={colors.danger} /> : undefined}
        />
      </View>

      <View
        style={[
          styles.footerRow,
          {
            borderTopColor: colors.borderLight,
            borderTopWidth: 1,
            marginTop: spacing.sm,
            paddingTop: spacing.sm,
          },
        ]}
      >
        <View style={styles.metaCol}>
          <View style={styles.iconText}>
            <Ionicons name="person-outline" size={14} color={colors.textSecondary} style={{ marginRight: 4 }} />
            <Text variant="caption" color="secondary">
              {item.teacherName}
            </Text>
          </View>

          <View style={[styles.iconText, { marginTop: 4 }]}>
            <Ionicons name="time-outline" size={14} color={colors.textSecondary} style={{ marginRight: 4 }} />
            <Text variant="caption" color="primary" weight="600">
              {item.time}
            </Text>
            <Text variant="caption" color="muted" style={{ marginHorizontal: 4 }}>
              •
            </Text>
            <Text variant="caption" color="secondary">
              {item.room}
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  subjectContainer: {
    flex: 1,
    paddingRight: 8,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaCol: {
    flex: 1,
  },
  iconText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
