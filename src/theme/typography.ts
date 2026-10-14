import { TextStyle, Platform } from 'react-native';

export const fontFamilies = {
  regular: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),
  medium: Platform.select({
    ios: 'System',
    android: 'Roboto-Medium',
    default: 'System',
  }),
  bold: Platform.select({
    ios: 'System',
    android: 'Roboto-Bold',
    default: 'System',
  }),
};

export const typography = {
  hero: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700' as TextStyle['fontWeight'],
    letterSpacing: -0.5,
  },
  h1: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700' as TextStyle['fontWeight'],
    letterSpacing: -0.3,
  },
  h2: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '600' as TextStyle['fontWeight'],
    letterSpacing: -0.2,
  },
  h3: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600' as TextStyle['fontWeight'],
    letterSpacing: 0,
  },
  h4: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600' as TextStyle['fontWeight'],
    letterSpacing: 0,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '500' as TextStyle['fontWeight'],
    letterSpacing: 0.1,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as TextStyle['fontWeight'],
    letterSpacing: 0,
  },
  bodySmall: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400' as TextStyle['fontWeight'],
    letterSpacing: 0.1,
  },
  caption: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '500' as TextStyle['fontWeight'],
    letterSpacing: 0.2,
  },
  badge: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700' as TextStyle['fontWeight'],
    letterSpacing: 0.4,
    textTransform: 'uppercase' as TextStyle['textTransform'],
  },
  button: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600' as TextStyle['fontWeight'],
    letterSpacing: 0.2,
  },
  buttonSmall: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600' as TextStyle['fontWeight'],
    letterSpacing: 0.1,
  },
  metricHero: {
    fontSize: 36,
    lineHeight: 42,
    fontWeight: '700' as TextStyle['fontWeight'],
    letterSpacing: -0.5,
  },
  academicLabel: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700' as TextStyle['fontWeight'],
    letterSpacing: 1.2,
    textTransform: 'uppercase' as TextStyle['textTransform'],
  },
} as const;

export type Typography = typeof typography;
export type TypographyVariant = keyof typeof typography;
