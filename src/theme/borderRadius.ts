/**
 * Institutional Corner Radii
 */

export const borderRadius = {
  none: 0,
  xs: 4,
  sm: 6,
  md: 10,
  lg: 16, // Standard card radius (Phase 3: 16–20)
  xl: 20, // Elevated cards
  pill: 28,
  full: 9999,
} as const;

export type BorderRadius = typeof borderRadius;
