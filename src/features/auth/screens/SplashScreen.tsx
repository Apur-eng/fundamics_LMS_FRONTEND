import React, { useEffect } from 'react';
import {
  View,
  Image,
  StyleSheet,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../../theme';
import { Text } from '../../../components/common/Text';
import { AuthStackParamList } from '../../../app/navigation/types';

type SplashScreenNavProp = NativeStackNavigationProp<AuthStackParamList, 'Splash'>;

export interface SplashScreenProps {
  standalone?: boolean;
}

// Official Fundamics Full Brand Identity (Horizontal Wordmark + Wings)
const BRAND_IMAGE = require('../../../../assets/fundamics_brand.png');

export const SplashScreen: React.FC<SplashScreenProps> = ({ standalone = false }) => {
  const { colors, spacing } = useTheme();
  const { width } = useWindowDimensions();

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
    }, 1500);
    return () => clearTimeout(timer);
  }, [navigation, standalone]);

  // Original aspect ratio of fundamics_brand.png is exactly 2.0 (1774 x 887)
  const brandWidth = Math.min(Math.round(width * 0.72), 320);
  const brandHeight = Math.round(brandWidth / 2);

  return (
    <View style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
      {/* Brand-led Authentic Hero Display */}
      <View style={styles.content}>
        <Image
          source={BRAND_IMAGE}
          style={{ width: brandWidth, height: brandHeight }}
          resizeMode="contain"
          accessibilityRole="image"
          accessibilityLabel="Fundamics LMS official logo"
        />

        {/* Subtle, Understated Brand Progress State */}
        <View style={[styles.indicatorContainer, { marginTop: spacing.xl }]}>
          <ActivityIndicator size="small" color={colors.accent || '#3478B8'} />
          <Text
            variant="bodySmall"
            color="secondary"
            align="center"
            weight="500"
            style={[styles.statusText, { color: colors.textSecondary }]}
          >
            Preparing your learning space
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  indicatorContainer: {
    alignItems: 'center',
  },
  statusText: {
    marginTop: 14,
    letterSpacing: 0.2,
  },
});
