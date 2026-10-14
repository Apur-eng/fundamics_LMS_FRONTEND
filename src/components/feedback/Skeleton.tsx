import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '../../theme';

export interface SkeletonProps {
  width?: number | `${number}%` | 'auto';
  height?: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 16,
  borderRadius,
  style,
}) => {
  const { colors, borderRadius: defaultRadius } = useTheme();
  const opacityAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 0.85,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.4,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();

    return () => animation.stop();
  }, [opacityAnim]);

  const resolvedRadius = borderRadius !== undefined ? borderRadius : defaultRadius.sm;

  return (
    <Animated.View
      accessibilityRole="progressbar"
      accessibilityLabel="Loading content"
      style={[
        {
          width,
          height,
          borderRadius: resolvedRadius,
          backgroundColor: colors.surfaceVariant,
          opacity: opacityAnim,
        },
        style,
      ]}
    />
  );
};
