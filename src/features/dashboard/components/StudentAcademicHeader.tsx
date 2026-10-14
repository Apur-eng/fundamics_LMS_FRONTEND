import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme';
import { Text } from '../../../components/common/Text';
import { Avatar } from '../../../components/common/Avatar';
import { useAuth } from '../../../app/providers/AuthContext';

export interface StudentAcademicHeaderProps {
  greeting: string;
  studentName: string;
  admissionNumber?: string;
  classGrade: string;
  board?: string;
  branch?: string;
}

export const StudentAcademicHeader: React.FC<StudentAcademicHeaderProps> = ({
  greeting,
  studentName,
  admissionNumber,
  classGrade,
  board,
  branch,
}) => {
  const { colors, spacing, borderRadius, shadows } = useTheme();
  const { logout } = useAuth();

  const programmeSubtitle = board ? `${classGrade} · ${board}` : classGrade;

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
        },
      ]}
    >
      {/* Top bar: Fundemics brand + avatar + logout */}
      <View
        style={[
          styles.topBar,
          {
            backgroundColor: colors.primary,
            borderTopLeftRadius: borderRadius.lg,
            borderTopRightRadius: borderRadius.lg,
            paddingHorizontal: spacing.cardPadding,
            paddingVertical: 10,
          },
        ]}
      >
        {/* Brand */}
        <View style={styles.brandRow}>
          <View
            style={[
              styles.monogram,
              {
                backgroundColor: 'rgba(255,255,255,0.18)',
                borderColor: 'rgba(255,255,255,0.30)',
              },
            ]}
          >
            <Text style={styles.monogramText} color="inverse" weight="800">
              FN
            </Text>
          </View>
          <View style={{ marginLeft: 8 }}>
            <Text style={styles.brandTitle} color="inverse" weight="800">
              FUNDAMICS
            </Text>
            <Text style={styles.brandSub} color="inverse" weight="500">
              Academic Portal · 2026–27
            </Text>
          </View>
        </View>

        {/* Avatar + Logout */}
        <View style={styles.rightActions}>
          <View
            style={[
              styles.avatarRing,
              { borderColor: 'rgba(255,255,255,0.4)' },
            ]}
          >
            <Avatar name={studentName} size={32} accent="distinction" />
          </View>
          <TouchableOpacity
            onPress={logout}
            activeOpacity={0.7}
            style={[
              styles.logoutBtn,
              { backgroundColor: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.25)' },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Sign out"
          >
            <Ionicons name="log-out-outline" size={15} color="rgba(255,255,255,0.85)" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Identity panel — white body */}
      <View
        style={[
          styles.identityPanel,
          { paddingHorizontal: spacing.cardPadding, paddingTop: spacing.md, paddingBottom: spacing.md },
        ]}
      >
        {/* Greeting */}
        <Text variant="caption" color="muted" weight="600" style={styles.greeting}>
          {greeting.toUpperCase()}
        </Text>

        {/* Student name */}
        <Text
          variant="h2"
          color="primary"
          weight="700"
          style={styles.studentName}
          numberOfLines={1}
        >
          {studentName}
        </Text>

        {/* Programme subtitle */}
        <Text
          variant="bodySmall"
          color="secondary"
          style={{ marginTop: 2 }}
          numberOfLines={1}
        >
          {programmeSubtitle}
        </Text>

        {/* Meta chips */}
        <View style={styles.chipRow}>
          {admissionNumber && (
            <View
              style={[
                styles.chip,
                {
                  backgroundColor: colors.primaryContainer,
                  borderColor: colors.borderFocus + '40',
                },
              ]}
            >
              <Ionicons
                name="id-card-outline"
                size={10}
                color={colors.primary}
                style={{ marginRight: 4 }}
              />
              <Text style={styles.chipText} color="primary" weight="700">
                {admissionNumber}
              </Text>
            </View>
          )}

          {branch && (
            <View
              style={[
                styles.chip,
                {
                  backgroundColor: colors.surfaceVariant,
                  borderColor: colors.border,
                  marginLeft: admissionNumber ? spacing.xs : 0,
                },
              ]}
            >
              <Ionicons
                name="business-outline"
                size={10}
                color={colors.textSecondary}
                style={{ marginRight: 4 }}
              />
              <Text style={styles.chipText} color="secondary" weight="600" numberOfLines={1}>
                {branch.split('(')[0].trim()}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    overflow: 'hidden',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  monogram: {
    width: 28,
    height: 28,
    borderRadius: 7,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monogramText: {
    fontSize: 10,
    letterSpacing: 0.5,
  },
  brandTitle: {
    fontSize: 12,
    letterSpacing: 1.6,
  },
  brandSub: {
    fontSize: 9,
    letterSpacing: 0.3,
    opacity: 0.75,
    marginTop: 1,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarRing: {
    padding: 1.5,
    borderWidth: 1.5,
    borderRadius: 20,
  },
  logoutBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  identityPanel: {},
  greeting: {
    letterSpacing: 1.1,
    fontSize: 10,
    marginBottom: 2,
  },
  studentName: {
    letterSpacing: -0.3,
    marginTop: 1,
  },
  chipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 10,
    gap: 6,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
  },
  chipText: {
    fontSize: 10,
    letterSpacing: 0.3,
  },
});
