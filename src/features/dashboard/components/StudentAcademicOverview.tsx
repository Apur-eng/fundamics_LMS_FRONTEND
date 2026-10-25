import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme';
import { Text } from '../../../components/common/Text';

export interface StudentAcademicOverviewProps {
  classGrade: string;
  board?: string;
  admissionNumber?: string;
  branch?: string;
}

export const StudentAcademicOverview: React.FC<StudentAcademicOverviewProps> = ({
  classGrade,
  board,
  admissionNumber,
  branch,
}) => {
  const { colors, spacing, borderRadius } = useTheme();
  const { width } = useWindowDimensions();

  // If width is very narrow (< 360px), stack cards vertically; otherwise side-by-side
  const isStacked = width < 360;

  return (
    <View style={styles.container}>
      <View style={[styles.gridRow, isStacked && styles.gridColumn]}>
        {/* Card 1: Academic Track & Programme */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: borderRadius.md,
              padding: spacing.cardPadding,
              flex: isStacked ? undefined : 1,
              marginBottom: isStacked ? spacing.sm : 0,
              marginRight: isStacked ? 0 : spacing.sm,
            },
          ]}
        >
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.iconBox,
                { backgroundColor: colors.navyContainer },
              ]}
            >
              <Ionicons name="school-outline" size={16} color={colors.navy} />
            </View>
            <Text
              variant="caption"
              color="secondary"
              weight="700"
              style={{ letterSpacing: 0.8, textTransform: 'uppercase', fontSize: 10 }}
            >
              Programme
            </Text>
          </View>

          <Text
            variant="h4"
            color="primary"
            weight="700"
            style={styles.cardTitle}
            numberOfLines={2}
          >
            {classGrade}
          </Text>

          <Text
            variant="caption"
            color="secondary"
            weight="500"
            style={{ marginTop: 2 }}
            numberOfLines={1}
          >
            {board || 'Regular Academic Track'}
          </Text>
        </View>

        {/* Card 2: Campus & Identity */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: borderRadius.md,
              padding: spacing.cardPadding,
              flex: isStacked ? undefined : 1,
            },
          ]}
        >
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.iconBox,
                { backgroundColor: colors.skyBlueContainer },
              ]}
            >
              <Ionicons name="business-outline" size={16} color={colors.primaryBlue} />
            </View>
            <Text
              variant="caption"
              color="secondary"
              weight="700"
              style={{ letterSpacing: 0.8, textTransform: 'uppercase', fontSize: 10 }}
            >
              Campus & Roll
            </Text>
          </View>

          <Text
            variant="h4"
            color="primary"
            weight="700"
            style={styles.cardTitle}
            numberOfLines={1}
          >
            {branch ? branch.split('(')[0].trim() : 'Flagship Campus'}
          </Text>

          <Text
            variant="caption"
            color="secondary"
            weight="500"
            style={{ marginTop: 2 }}
            numberOfLines={1}
          >
            {admissionNumber ? `ID: ${admissionNumber}` : 'Enrolled Scholar'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
  },
  gridRow: {
    flexDirection: 'row',
  },
  gridColumn: {
    flexDirection: 'column',
  },
  card: {
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconBox: {
    width: 26,
    height: 26,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 14,
    lineHeight: 18,
  },
});
