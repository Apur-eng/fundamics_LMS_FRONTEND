import { ViewStyle, Platform } from 'react-native';

export interface ShadowStyle {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

export const shadows: Record<'none' | 'sm' | 'md' | 'lg', ViewStyle> = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    ...Platform.select({
      ios: {
        shadowColor: '#087BAF',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.07,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      default: {},
    }),
  },
  md: {
    ...Platform.select({
      ios: {
        shadowColor: '#075B86',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.09,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      default: {},
    }),
  },
  lg: {
    ...Platform.select({
      ios: {
        shadowColor: '#075B86',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.11,
        shadowRadius: 14,
      },
      android: {
        elevation: 8,
      },
      default: {},
    }),
  },
};
