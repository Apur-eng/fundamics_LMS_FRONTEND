/**
 * Institutional Corner Radii
 */

export const borderRadius = {
  none: 0,
  xs: 4,
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  pill: 28,
  full: 9999,
} as const;

export type BorderRadius = typeof borderRadius;
