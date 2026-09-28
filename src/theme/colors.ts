/**
 * Fundemics Institutional Color Palette
 * Source of truth: PROJECT_STRUCTURE.md & Fundemics Brand System
 */

export const brandPalette = {
  // Deep Navy - Primary Institutional Canvas & Identity
  navy900: '#060E18',
  navy800: '#0B192C', // Core Brand Primary
  navy700: '#14253E',
  navy600: '#1F3556',
  navy500: '#2E4C78',
  navy100: '#E8EDF5',
  navy50: '#F3F6FA',

  // Emerald - Academic Growth, Rigor, Verification
  emerald800: '#045A3F',
  emerald700: '#047857',
  emerald600: '#059669', // Core Accent
  emerald500: '#10B981',
  emerald100: '#D1FAE5',
  emerald50: '#ECFDF5',

  // Amber / Gold - Academic Excellence, Ranker Badges, Honors
  gold800: '#92400E',
  gold700: '#B45309',
  gold600: '#D97706', // Distinction Badge
  gold500: '#F59E0B',
  gold100: '#FEF3C7',
  gold50: '#FFFBEB',

  // Semantic Status Colors
  crimson700: '#B91C1C',
  crimson600: '#DC2626',
  crimson100: '#FEE2E2',
  crimson50: '#FEF2F2',

  blue700: '#1D4ED8',
  blue600: '#2563EB',
  blue100: '#DBEAFE',
  blue50: '#EFF6FF',

  // Neutral Scales (Slate / Cool Grey)
  slate950: '#020617',
  slate900: '#0F172A',
  slate800: '#1E293B',
  slate700: '#334155',
  slate600: '#475569',
  slate500: '#64748B',
  slate400: '#94A3B8',
  slate300: '#CBD5E1',
  slate200: '#E2E8F0',
  slate100: '#F1F5F9',
  slate50: '#F8FAFC',
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

export interface ColorTheme {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  primaryContainer: string;
  onPrimary: string;

  accent: string;
  accentLight: string;
  accentDark: string;
  accentContainer: string;
  onAccent: string;

  distinction: string;
  distinctionContainer: string;
  onDistinction: string;

  background: string;
  surface: string;
  surfaceElevated: string;
  surfaceVariant: string;

  border: string;
  borderLight: string;
  borderFocus: string;

  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;
  textInverseMuted: string;

  success: string;
  successContainer: string;
  onSuccess: string;

  warning: string;
  warningContainer: string;
  onWarning: string;

  danger: string;
  dangerContainer: string;
  onDanger: string;

  info: string;
  infoContainer: string;
  onInfo: string;

  overlay: string;
}

export const lightThemeColors: ColorTheme = {
  primary: brandPalette.navy800,
  primaryLight: brandPalette.navy700,
  primaryDark: brandPalette.navy900,
  primaryContainer: brandPalette.navy50,
  onPrimary: brandPalette.white,

  accent: brandPalette.emerald600,
  accentLight: brandPalette.emerald500,
  accentDark: brandPalette.emerald700,
  accentContainer: brandPalette.emerald50,
  onAccent: brandPalette.white,

  distinction: brandPalette.gold600,
  distinctionContainer: brandPalette.gold50,
  onDistinction: brandPalette.gold800,

  background: brandPalette.slate50,
  surface: brandPalette.white,
  surfaceElevated: brandPalette.white,
  surfaceVariant: brandPalette.slate100,

  border: brandPalette.slate200,
  borderLight: brandPalette.slate100,
  borderFocus: brandPalette.navy800,

  textPrimary: brandPalette.slate900,
  textSecondary: brandPalette.slate600,
  textMuted: brandPalette.slate400,
  textInverse: brandPalette.white,
  textInverseMuted: brandPalette.slate300,

  success: brandPalette.emerald600,
  successContainer: brandPalette.emerald50,
  onSuccess: brandPalette.emerald800,

  warning: brandPalette.gold600,
  warningContainer: brandPalette.gold50,
  onWarning: brandPalette.gold800,

  danger: brandPalette.crimson600,
  dangerContainer: brandPalette.crimson50,
  onDanger: brandPalette.crimson700,

  info: brandPalette.blue600,
  infoContainer: brandPalette.blue50,
  onInfo: brandPalette.blue700,

  overlay: 'rgba(11, 25, 44, 0.45)',
};

export const darkThemeColors: ColorTheme = {
  primary: brandPalette.navy600,
  primaryLight: brandPalette.navy500,
  primaryDark: brandPalette.navy900,
  primaryContainer: brandPalette.navy800,
  onPrimary: brandPalette.white,

  accent: brandPalette.emerald500,
  accentLight: brandPalette.emerald600,
  accentDark: brandPalette.emerald700,
  accentContainer: brandPalette.emerald800,
  onAccent: brandPalette.white,

  distinction: brandPalette.gold500,
  distinctionContainer: brandPalette.gold800,
  onDistinction: brandPalette.gold100,

  background: brandPalette.navy900,
  surface: brandPalette.navy800,
  surfaceElevated: brandPalette.navy700,
  surfaceVariant: brandPalette.slate800,

  border: brandPalette.navy600,
  borderLight: brandPalette.navy700,
  borderFocus: brandPalette.emerald500,

  textPrimary: brandPalette.slate50,
  textSecondary: brandPalette.slate300,
  textMuted: brandPalette.slate500,
  textInverse: brandPalette.slate900,
  textInverseMuted: brandPalette.slate700,

  success: brandPalette.emerald500,
  successContainer: 'rgba(16, 185, 129, 0.15)',
  onSuccess: brandPalette.emerald100,

  warning: brandPalette.gold500,
  warningContainer: 'rgba(245, 158, 11, 0.15)',
  onWarning: brandPalette.gold100,

  danger: brandPalette.crimson600,
  dangerContainer: 'rgba(220, 38, 38, 0.15)',
  onDanger: brandPalette.crimson100,

  info: brandPalette.blue600,
  infoContainer: 'rgba(37, 99, 235, 0.15)',
  onInfo: brandPalette.blue100,

  overlay: 'rgba(2, 6, 23, 0.7)',
};
