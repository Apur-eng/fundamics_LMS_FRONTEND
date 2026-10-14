import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../../theme';
import { Text } from '../../../components/common/Text';
import { Badge } from '../../../components/common/Badge';
import { AuthStackParamList } from '../../../app/navigation/types';

type SplashScreenNavProp = NativeStackNavigationProp<AuthStackParamList, 'Splash'>;

export interface SplashScreenProps {
  standalone?: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ standalone = false }) => {
  const { colors, spacing, borderRadius } = useTheme();
  let navigation: SplashScreenNavProp | null = null;
  try {
    navigation = useNavigation<SplashScreenNavProp>();
  } catch {
    navigation = null;
  }

  useEffect(() => {
    if (standalone || !navigation) return;
    const timer = setTimeout(() => {
      navigation?.replace?.('Login');
    }, 1800);
    return () => clearTimeout(timer);
  }, [navigation, standalone]);

  return (
    <View style={[styles.container, { backgroundColor: colors.primaryDark }]}>
      {/* Institutional Insignia */}
      <View
        style={[
          styles.logoCircle,
          {
            backgroundColor: colors.primary,
            borderColor: colors.borderFocus,
            borderRadius: borderRadius.xl,
          },
        ]}
      >
        <Text
          variant="hero"
          color="inverse"
          weight="800"
          style={{ letterSpacing: 1 }}
        >
          FU
        </Text>
      </View>

      <Text
        variant="h1"
        color="inverse"
        align="center"
        weight="700"
        style={{ marginTop: spacing.lg, letterSpacing: 0.5 }}
      >
        FUNDEMICS
      </Text>

      <Text
        variant="subtitle"
        color="accent"
        align="center"
        weight="600"
        style={{ marginTop: 2, letterSpacing: 1.5, textTransform: 'uppercase' }}
      >
        Learning Management System
      </Text>

      <Text
        variant="bodySmall"
        color="inverseMuted"
        align="center"
        style={{ marginTop: spacing.sm, fontStyle: 'italic' }}
      >
        "Fundamentals First. Confidence Forever."
      </Text>

      <View style={{ marginTop: spacing.xl }}>
        <Badge
          label="10+ Years of Academic Excellence"
          variant="distinction"
          size="md"
        />
      </View>

      <View style={styles.footer}>
        <ActivityIndicator size="small" color={colors.accent} />
        <Text
          variant="caption"
          color="inverseMuted"
          align="center"
          style={{ marginTop: spacing.sm }}
        >
          Initializing Secure Session • Lucknow
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logoCircle: {
    width: 88,
    height: 88,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 48,
    alignItems: 'center',
  },
});
