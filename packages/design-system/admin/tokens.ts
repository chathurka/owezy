/**
 * Owezy admin-web design tokens (TypeScript).
 * Mirrors admin/tokens.css — use CSS variables in components; use these
 * constants only in JS contexts (canvas rendering, inline styles, charts).
 * Generated from resources/owezy-admin-console/assets/design-system/tokens.json.
 */

// ── Color themes ─────────────────────────────────────────────────────────────

export const colorsLight = {
  bg: '#F6F5FB',
  surface: '#FFFFFF',
  surfaceRaised: '#FFFFFF',
  surfaceSunken: '#F1F0F7',
  border: '#E9E7F2',
  borderStrong: '#D9D6E6',
  divider: '#F0EEF6',
  track: '#EFEEF5',

  text: '#15132B',
  textMuted: '#5F5C78',
  textSubtle: '#6A6782',

  primary: '#635BDB',
  primaryHover: '#554DCB',
  primaryText: '#4F47C7',
  primarySoft: '#EFEEFD',
  onPrimary: '#FFFFFF',

  owed: '#087A4F',
  owedFill: '#19A672',
  owedSoft: '#E5F5EE',
  owe: '#B34C15',
  oweFill: '#EE7A30',
  oweSoft: '#FDEFE5',

  danger: '#C9303F',
  dangerSoft: '#FCEAEC',
  info: '#2467C2',
  infoSoft: '#E8F0FC',

  inverse: '#15132B',
  onInverse: '#FFFFFF',
} as const;

export const colorsDark = {
  bg: '#0D0C16',
  surface: '#16142A',
  surfaceRaised: '#1F1C36',
  surfaceSunken: '#110F20',
  border: '#2A2744',
  borderStrong: '#3A365A',
  divider: '#221F3A',
  track: '#1B1932',

  text: '#F2F1FA',
  textMuted: '#A9A6C4',
  textSubtle: '#8F8CAB',

  primary: '#6A62E6',
  primaryHover: '#7A72F0',
  primaryText: '#ABA5FA',
  primarySoft: '#26224A',
  onPrimary: '#FFFFFF',

  owed: '#43CF93',
  owedFill: '#43CF93',
  owedSoft: '#12332A',
  owe: '#F59A5B',
  oweFill: '#F59A5B',
  oweSoft: '#3A2416',

  danger: '#F27583',
  dangerSoft: '#3C1A22',
  info: '#6EA8F2',
  infoSoft: '#172A45',

  inverse: '#F2F1FA',
  onInverse: '#15132B',
} as const;

// ── Chart colors ─────────────────────────────────────────────────────────────

export const chart = {
  light: {
    series: ['#635BDB', '#1FA595', '#F2A53D', '#E2668A', '#4A8FE2'] as const,
    muted: '#DCD9EC',
    grid: '#EEECF5',
  },
  dark: {
    series: ['#8A83F4', '#3FCDB9', '#F5B65E', '#F08AA8', '#74AEF5'] as const,
    muted: '#34304F',
    grid: '#26233F',
  },
} as const;

// ── Spacing (px values) ───────────────────────────────────────────────────────

export const space = { 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32 } as const;

// ── Radius ────────────────────────────────────────────────────────────────────

export const radius = {
  xs: 6,
  sm: 10,
  md: 12,
  lg: 16,
  xl: 22,
  pill: 999,
} as const;

// ── Shadows ───────────────────────────────────────────────────────────────────

export const shadows = {
  card: '0 1px 2px rgba(21,19,43,0.04)',
  hero: '0 18px 40px -16px rgba(99,91,219,0.55)',
  popover: '0 12px 32px -8px rgba(21,19,43,0.18)',
  button: '0 6px 16px -6px rgba(99,91,219,0.6)',
} as const;

// ── Layout ────────────────────────────────────────────────────────────────────

export const layout = {
  sidebarWidth: 248,
  sidebarRail: 72,
  topbarHeight: 64,
  contentMax: 1440,
  touchMin: 40,
  bpCollapsed: 960,
  bpMobile: 640,
} as const;

// ── Typography scale (admin is denser: 14px body) ────────────────────────────

export const typography = {
  display:    { size: 40, weight: 800, lineHeight: '44px', letterSpacing: '-1.4px' },
  kpi:        { size: 28, weight: 800, lineHeight: '32px', letterSpacing: '-0.8px' },
  title:      { size: 24, weight: 800, lineHeight: '30px', letterSpacing: '-0.6px' },
  headline:   { size: 17, weight: 700, lineHeight: '24px', letterSpacing: '-0.2px' },
  bodyStrong: { size: 14, weight: 700, lineHeight: '20px' },
  body:       { size: 14, weight: 500, lineHeight: '20px' },
  label:      { size: 13, weight: 600, lineHeight: '18px' },
  caption:    { size: 12, weight: 500, lineHeight: '16px' },
  micro:      { size: 11, weight: 600, lineHeight: '14px' },
  overline:   { size: 11, weight: 700, lineHeight: '14px', letterSpacing: '0.6px', transform: 'uppercase' },
  mono:       { size: 12, weight: 500, lineHeight: '18px', family: 'JetBrains Mono' },
} as const;

export const fontFamily = '"Inter", system-ui, -apple-system, "Segoe UI", sans-serif';
export const fontMono = '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace';
