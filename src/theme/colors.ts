/**
 * Fundemics Institutional Color Palette
 * Source of truth: PROJECT_STRUCTURE.md & Fundemics Brand System
 *
 * Light theme uses the Academic Blue palette (white + pale blue + institutional blue).
 * Dark theme preserves the original navy/emerald glassmorphism palette.
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

  // Academic Blue Family (Light theme primary brand)
  academicBlue900: '#044269',
  academicBlue800: '#075B86',   // Deep academic blue — headers, primary text, active elements
  academicBlue700: '#087BAF',   // Vivid institutional blue — CTAs, links, icons
  academicBlue600: '#1A94CC',   // Mid-tone for progress fills
  academicBlue100: '#BEE3F4',   // Subtle border / divider
  academicBlue50:  '#E8F6FC',   // Pale-blue — section backgrounds, chips
  academicBlue25:  '#F5F9FC',   // Page background

  // Emerald - Academic Growth, Rigor, Verification
  emerald800: '#045A3F',
  emerald700: '#047857',
  emerald600: '#059669', // Core Accent
  emerald500: '#10B981',
  emerald100: '#D1FAE5',
  emerald50: '#ECFDF5',

  // Light theme semantic greens (attendance present)
  green800: '#0F6B4A',
  green700: '#15966A',   // Present day — success
  green100: '#D4F0E4',
  green50:  '#E7F7EF',

  // Light theme semantic reds (attendance absent)
  red700: '#B93040',
  red600: '#D94F55',     // Absent day — danger
  red100: '#F8D8DA',
  red50:  '#FDECEE',

  // Amber / Gold - Academic Excellence, Ranker Badges, Honors
  gold800: '#92400E',
  gold700: '#B45309',
  gold600: '#D97706', // Distinction Badge
  gold500: '#F59E0B',
  academicGold: '#C69A45', // Light theme academic gold
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

  // Dedicated Official Brand & Feature Accent Tokens
  navy: string;
  navyDeep: string;
  brandBlue: string;
  brandGreen: string;
  warmGold: string;
  primaryBlue: string;
  emerald: string;
  emeraldContainer: string;
  violet: string;
  violetContainer: string;
  skyBlue: string;
  skyBlueContainer: string;
  amber: string;
  amberContainer: string;
  coral: string;
  coralContainer: string;
  navyContainer: string;

  surfaceMint: string;
  surfaceAmber: string;

  academicGold: string;
  academicGoldContainer: string;
  navyPrimary: string;
  navyElevated: string;
  divider: string;
}

export const lightThemeColors: ColorTheme = {
  // Official Fundamics Brand Palette
  primary: '#12365A',                        // Primary navy
  primaryLight: '#3478B8',                   // Brand blue
  primaryDark: '#0B2948',                    // Deep navy
  primaryContainer: '#EAF0F6',               // Soft navy container
  onPrimary: '#FFFFFF',

  // Brand blue — CTAs, links, active icons
  accent: '#3478B8',                         // Brand blue
  accentLight: '#4A8EC9',
  accentDark: '#12365A',
  accentContainer: 'rgba(52, 120, 184, 0.08)',
  onAccent: '#FFFFFF',

  // Warm gold — distinction badges, merit
  distinction: '#F2C94C',
  distinctionContainer: 'rgba(242, 201, 76, 0.12)',
  onDistinction: '#8F6218',

  // Page & surface hierarchy
  background: '#FAFAF7',                     // Main background (warm white / ivory)
  surface: '#FFFFFF',                        // Pure white card surface
  surfaceElevated: '#FFFFFF',
  surfaceVariant: '#F3F5F8',

  // Structural borders
  border: '#E7EAF0',                         // Border
  borderLight: '#F0F3F7',
  borderFocus: '#12365A',

  // Typography
  textPrimary: '#1E293B',                    // Primary text
  textSecondary: '#64748B',                  // Secondary text
  textMuted: '#94A3B8',
  textInverse: '#FFFFFF',
  textInverseMuted: '#CBD5E1',

  // Semantics
  success: '#16845B',                        // Success (present attendance)
  successContainer: 'rgba(22, 132, 91, 0.08)',
  onSuccess: '#0F5B3F',

  warning: '#D99A24',                        // Warning (warm gold / amber)
  warningContainer: 'rgba(217, 154, 36, 0.08)',
  onWarning: '#92400E',

  danger: '#D94848',                         // Error (absent attendance)
  dangerContainer: 'rgba(217, 72, 72, 0.08)',
  onDanger: '#9E2A27',

  info: '#3478B8',                           // Brand blue
  infoContainer: 'rgba(52, 120, 184, 0.08)',
  onInfo: '#12365A',

  overlay: 'rgba(11, 41, 72, 0.35)',

  // Official Brand Tokens
  navy: '#12365A',
  navyDeep: '#0B2948',
  brandBlue: '#3478B8',
  brandGreen: '#76A843',
  warmGold: '#F2C94C',

  // Feature Accent Tokens
  primaryBlue: '#3478B8',
  emerald: '#16845B',
  emeraldContainer: 'rgba(22, 132, 91, 0.08)',
  violet: '#7657C8',
  violetContainer: 'rgba(118, 87, 200, 0.08)',
  skyBlue: '#3478B8',
  skyBlueContainer: 'rgba(52, 120, 184, 0.08)',
  amber: '#D99A24',
  amberContainer: 'rgba(217, 154, 36, 0.08)',
  coral: '#D94848',
  coralContainer: 'rgba(217, 72, 72, 0.08)',
  navyContainer: 'rgba(18, 54, 90, 0.08)',
  surfaceMint: 'rgba(22, 132, 91, 0.08)',
  surfaceAmber: 'rgba(242, 201, 76, 0.12)',

  academicGold: '#F2C94C',
  academicGoldContainer: 'rgba(242, 201, 76, 0.12)',
  navyPrimary: '#12365A',
  navyElevated: '#1A436D',
  divider: '#E7EAF0',
};

export const darkThemeColors: ColorTheme = {
  // Primary Navy & Indigo institutional base
  primary: '#38C995', // Emerald indicator for active elements
  primaryLight: '#4FE0AC',
  primaryDark: '#101D38',
  primaryContainer: '#141F32',
  onPrimary: '#0B1220',

  // Emerald accents - Academic rigor, growth, verified status
  accent: '#38C995',
  accentLight: '#4FE0AC',
  accentDark: '#28A77B',
  accentContainer: 'rgba(56, 201, 149, 0.14)',
  onAccent: '#0B1220',

  // Academic Gold - Distinction, merit, honors
  distinction: '#D6B46A',
  distinctionContainer: 'rgba(214, 180, 106, 0.14)',
  onDistinction: '#0B1220',

  // Canvas Hierarchy
  background: '#0B1220', // Deep background
  surface: '#101D38', // Primary navy surface
  surfaceElevated: '#141F32', // Elevated surface
  surfaceVariant: '#17243B', // Subtle tertiary elevated

  // Structural lines & dividers
  border: '#29354A', // Divider
  borderLight: 'rgba(41, 53, 74, 0.65)',
  borderFocus: '#38C995',

  // Typography
  textPrimary: '#F5F7FB', // Primary text
  textSecondary: '#A6B2C7', // Secondary text
  textMuted: '#6B7A94',
  textInverse: '#0B1220',
  textInverseMuted: '#A6B2C7',

  // Semantics
  success: '#15966A',
  successContainer: 'rgba(21, 150, 106, 0.15)',
  onSuccess: '#D1FAE5',

  warning: '#D99A2B',
  warningContainer: 'rgba(217, 154, 43, 0.15)',
  onWarning: '#FEF3C7',

  danger: '#F07878', // Absent / Warning state
  dangerContainer: 'rgba(240, 120, 120, 0.15)',
  onDanger: '#FEE2E2',

  info: '#4E88DE',
  infoContainer: 'rgba(78, 136, 222, 0.15)',
  onInfo: '#DBEAFE',

  overlay: 'rgba(11, 18, 32, 0.8)',

  // Official Brand Tokens (dark theme)
  navy: '#12365A',
  navyDeep: '#0B2948',
  brandBlue: '#3478B8',
  brandGreen: '#76A843',
  warmGold: '#F2C94C',

  primaryBlue: '#3478B8',
  emerald: '#15966A',
  emeraldContainer: 'rgba(21, 150, 106, 0.16)',
  violet: '#8E70DE',
  violetContainer: 'rgba(142, 112, 222, 0.16)',
  skyBlue: '#4E9AF2',
  skyBlueContainer: 'rgba(78, 154, 242, 0.16)',
  amber: '#D99A2B',
  amberContainer: 'rgba(217, 154, 43, 0.16)',
  coral: '#D96961',
  coralContainer: 'rgba(217, 105, 97, 0.16)',
  navyContainer: 'rgba(20, 43, 74, 0.25)',
  surfaceMint: 'rgba(56, 201, 149, 0.14)',
  surfaceAmber: 'rgba(214, 180, 106, 0.14)',

  // Dedicated Academic Tokens
  academicGold: '#D6B46A',
  academicGoldContainer: 'rgba(214, 180, 106, 0.14)',
  navyPrimary: '#101D38',
  navyElevated: '#141F32',
  divider: '#29354A',
};
