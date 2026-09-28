import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme';
import { Text } from '../../../components/common/Text';
import { Avatar } from '../../../components/common/Avatar';
import { Badge } from '../../../components/common/Badge';
import { useAuth } from '../../../app/providers/AuthContext';

export interface DashboardHeaderProps {
  greeting: string;
  subtitle?: string;
  badgeLabel?: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  greeting,
  subtitle,
  badgeLabel,
}) => {
  const { colors, spacing, borderRadius } = useTheme();
  const { user, logout, userRole } = useAuth();

  return (
    <View style={[styles.container, { marginBottom: spacing.lg }]}>
      <View style={styles.leftCol}>
        <View style={styles.nameRow}>
          <Text variant="h2" color="primary" weight="700">
            {greeting}
          </Text>
        </View>

        {subtitle && (
          <Text variant="bodySmall" color="secondary" style={{ marginTop: 2 }}>
            {subtitle}
          </Text>
        )}

        <View style={[styles.badgeRow, { marginTop: spacing.xs + 2 }]}>
          {badgeLabel && (
            <Badge
              label={badgeLabel}
              variant={userRole === 'STUDENT' ? 'accent' : userRole === 'TEACHER' ? 'primary' : 'distinction'}
              size="sm"
            />
          )}
          {user?.branchName && (
            <Text
              variant="caption"
              color="muted"
              style={{ marginLeft: spacing.sm }}
            >
              {user.branchName}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.rightCol}>
        <Avatar
          name={user?.name || 'User'}
          size={46}
          accent={userRole === 'STUDENT' ? 'accent' : 'primary'}
        />
        <TouchableOpacity
          onPress={logout}
          activeOpacity={0.7}
          style={[
            styles.logoutBtn,
            {
              backgroundColor: colors.surfaceVariant,
              borderRadius: borderRadius.full,
              marginTop: 4,
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Sign Out"
        >
          <Ionicons name="log-out-outline" size={16} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  leftCol: {
    flex: 1,
    paddingRight: 12,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  rightCol: {
    alignItems: 'center',
  },
  logoutBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
