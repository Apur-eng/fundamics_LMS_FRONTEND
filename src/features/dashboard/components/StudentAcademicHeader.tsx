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
          padding: spacing.cardPadding,
          marginBottom: spacing.lg,
        },
      ]}
    >
      {/* 1. Compact Brand & Utility Bar */}
      <View style={styles.topBrandBar}>
        <View style={styles.brandGroup}>
          <View
            style={[
              styles.monogramBox,
              {
                backgroundColor: colors.primary,
                borderRadius: borderRadius.xs,
              },
            ]}
          >
            <Text style={styles.monogramText} color="inverse" weight="800">
              FN
            </Text>
          </View>
          <View style={{ marginLeft: 8 }}>
            <Text style={styles.brandTitle} color="primary" weight="800">
              FUNDAMICS
            </Text>
            <Text style={styles.brandSub} color="secondary" weight="500">
              Academic Portal · 2026–27
            </Text>
          </View>
        </View>

        {/* Right: Avatar + Logout */}
        <View style={styles.rightActions}>
          <View
            style={[
              styles.avatarRing,
              { borderColor: colors.border, backgroundColor: colors.surfaceVariant },
            ]}
          >
            <Avatar name={studentName} size={30} accent="primary" />
          </View>
          <TouchableOpacity
            onPress={logout}
            activeOpacity={0.7}
            style={[
              styles.logoutBtn,
              {
                backgroundColor: colors.surfaceVariant,
                borderColor: colors.border,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Sign out"
          >
            <Ionicons name="log-out-outline" size={15} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Subtle Divider */}
      <View style={[styles.divider, { backgroundColor: colors.borderLight, marginVertical: spacing.md }]} />

      {/* 2. Student Greeting & Prominent Identity */}
      <View style={styles.identityContent}>
        <Text variant="caption" color="secondary" weight="600" style={styles.greeting}>
          {greeting.toUpperCase()}
        </Text>

        <Text
          variant="h2"
          color="primary"
          weight="700"
          style={styles.studentName}
          numberOfLines={1}
        >
          {studentName}
        </Text>

        <Text
          variant="bodySmall"
          color="secondary"
          style={{ marginTop: 2 }}
          numberOfLines={1}
        >
          {programmeSubtitle}
        </Text>

        {/* 3. Secondary Metadata Chips */}
        <View style={styles.chipRow}>
          {admissionNumber && (
            <View
              style={[
                styles.chip,
                {
                  backgroundColor: colors.primaryContainer,
                  borderColor: colors.border,
                },
              ]}
            >
              <Ionicons
                name="id-card-outline"
                size={11}
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
                },
              ]}
            >
              <Ionicons
                name="business-outline"
                size={11}
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
  },
  topBrandBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  monogramBox: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monogramText: {
    fontSize: 10,
    letterSpacing: 0.5,
  },
  brandTitle: {
    fontSize: 12,
    letterSpacing: 1.4,
  },
  brandSub: {
    fontSize: 9,
    letterSpacing: 0.2,
    marginTop: 1,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarRing: {
    padding: 1.5,
    borderWidth: 1,
    borderRadius: 18,
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
  divider: {
    height: 1,
  },
  identityContent: {},
  greeting: {
    letterSpacing: 0.9,
    fontSize: 10,
    marginBottom: 2,
  },
  studentName: {
    letterSpacing: -0.3,
  },
  chipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 6,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  chipText: {
    fontSize: 10,
    letterSpacing: 0.2,
  },
});
