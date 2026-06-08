/*
 * Constants.
 */

/** Width breakpoints — layout only. Use pointer queries for tap targets. */
export const breakpoints = {
  /** Full-width column, in-flow results panel, safe-area body padding. */
  narrow: '40rem'
} as const;

/** WCAG 2.5.5 recommended minimum touch target (level AAA). */
export const touchTargetMin = '44px';

/*
 * Helpers.
 */

export const media = {
  narrow: `(max-width: ${breakpoints.narrow})`,
  coarsePointer: '(pointer: coarse)',
  reducedMotion: '(prefers-reduced-motion: reduce)',
  highContrast: '(prefers-contrast: more)'
} as const;
