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

  // Dedicated Academic Tokens
  academicGold: string;
  academicGoldContainer: string;
  emerald: string;
  emeraldContainer: string;
  navyPrimary: string;
  navyDeep: string;
  navyElevated: string;
  divider: string;
}

export const lightThemeColors: ColorTheme = {
  // Academic Blue — institutional primary brand
  primary: brandPalette.academicBlue800,       // #075B86 deep academic blue
  primaryLight: brandPalette.academicBlue700,  // #087BAF vivid blue
  primaryDark: brandPalette.academicBlue900,   // #044269 darkest
  primaryContainer: brandPalette.academicBlue50, // #E8F6FC pale-blue panel
  onPrimary: brandPalette.white,

  // Vivid institutional blue — CTAs, links, active icons
  accent: brandPalette.academicBlue700,        // #087BAF
  accentLight: brandPalette.academicBlue600,   // #1A94CC
  accentDark: brandPalette.academicBlue800,    // #075B86
  accentContainer: brandPalette.academicBlue50, // #E8F6FC
  onAccent: brandPalette.white,

  // Academic gold — distinction badges, merit
  distinction: brandPalette.academicGold,      // #C69A45
  distinctionContainer: brandPalette.gold50,   // #FFFBEB
  onDistinction: brandPalette.gold800,         // #92400E

  // Page & surface hierarchy
  background: brandPalette.academicBlue25,     // #F5F9FC pale page background
  surface: brandPalette.white,                 // #FFFFFF card surface
  surfaceElevated: brandPalette.white,         // #FFFFFF elevated card
  surfaceVariant: brandPalette.academicBlue50, // #E8F6FC section panels

  // Structural borders — soft blue-grey
  border: '#E4EBF0',
  borderLight: '#EEF4F8',
  borderFocus: brandPalette.academicBlue700,   // #087BAF

  // Typography — deep blue-grey on white
  textPrimary: '#172B3D',                      // deep academic blue-black
  textSecondary: '#6B7D8D',                    // medium blue-grey
  textMuted: '#A0B0BC',                        // light muted
  textInverse: brandPalette.white,
  textInverseMuted: brandPalette.academicBlue100,

  // Attendance present — restrained green
  success: brandPalette.green700,              // #15966A
  successContainer: brandPalette.green50,      // #E7F7EF
  onSuccess: brandPalette.green800,            // #0F6B4A

  // Warning — academic gold
  warning: brandPalette.academicGold,          // #C69A45
  warningContainer: brandPalette.gold50,       // #FFFBEB
  onWarning: brandPalette.gold800,

  // Attendance absent — soft red
  danger: brandPalette.red600,                 // #D94F55
  dangerContainer: brandPalette.red50,         // #FDECEE
  onDanger: brandPalette.red700,               // #B93040

  // Info — uses the primary blue family
  info: brandPalette.academicBlue700,          // #087BAF
  infoContainer: brandPalette.academicBlue50,  // #E8F6FC
  onInfo: brandPalette.academicBlue800,        // #075B86

  overlay: 'rgba(7, 91, 134, 0.15)',

  // Dedicated Academic Tokens (light theme)
  academicGold: brandPalette.academicGold,             // #C69A45
  academicGoldContainer: 'rgba(198, 154, 69, 0.12)',
  emerald: brandPalette.green700,                      // #15966A (used by Text color="emerald")
  emeraldContainer: brandPalette.green50,              // #E7F7EF
  navyPrimary: brandPalette.academicBlue700,           // #087BAF — used as primary nav/brand
  navyDeep: brandPalette.academicBlue800,              // #075B86
  navyElevated: brandPalette.academicBlue50,           // #E8F6FC
  divider: '#E4EBF0',
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
  success: '#38C995',
  successContainer: 'rgba(56, 201, 149, 0.15)',
  onSuccess: '#D1FAE5',

  warning: '#D6B46A',
  warningContainer: 'rgba(214, 180, 106, 0.15)',
  onWarning: '#FEF3C7',

  danger: '#F07878', // Absent / Warning state
  dangerContainer: 'rgba(240, 120, 120, 0.15)',
  onDanger: '#FEE2E2',

  info: '#4E88DE',
  infoContainer: 'rgba(78, 136, 222, 0.15)',
  onInfo: '#DBEAFE',

  overlay: 'rgba(11, 18, 32, 0.8)',

  // Dedicated Academic Tokens
  academicGold: '#D6B46A',
  academicGoldContainer: 'rgba(214, 180, 106, 0.14)',
  emerald: '#38C995',
  emeraldContainer: 'rgba(56, 201, 149, 0.14)',
  navyPrimary: '#101D38',
  navyDeep: '#0B1220',
  navyElevated: '#141F32',
  divider: '#29354A',
};
