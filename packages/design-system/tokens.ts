/**
 * Owezy design tokens (TypeScript)
 * Mirrors tokens.css for use in TypeScript/React code.
 * All web surfaces must import from here — do not hardcode values.
 */

export const colors = {
  primary: '#1a6ef0',
  primaryLight: '#e8f1fe',
  primaryPressed: '#1358c4',

  ink900: '#0f1f3b',
  ink700: '#374b6c',
  ink500: '#5a6e8c',
  ink300: '#93a3bc',

  surface: '#ffffff',
  background: '#f7fafe',
  line: '#e2ebf7',

  positive: '#1f7a52',
  positiveLight: '#e4f4ec',
  warning: '#8a5a12',
  warningLight: '#fcefdd',
  negative: '#b4402f',
  negativeLight: '#fcf0ee',

  textPrimary: '#0f1f3b',
  textSecondary: '#5a6e8c',
  textDisabled: '#93a3bc',
  textInverse: '#ffffff',
} as const;

export const fontFamilies = {
  sans: '"Inter", system-ui, -apple-system, sans-serif',
  mono: '"JetBrains Mono", "Courier New", monospace',
} as const;

export const spacing = {
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
} as const;

export const radius = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '0.75rem',
  lg: '1rem',
  xl: '1.5rem',
  full: '9999px',
} as const;
