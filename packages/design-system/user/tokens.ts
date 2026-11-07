/**
 * Owezy user-web design tokens (TypeScript).
 * Mirrors user/tokens.css — use CSS variables in components; use these
 * constants only in JS contexts (canvas rendering, inline styles, charts).
 * Generated from resources/owezy-web/design-tokens/tokens.json.
 */

// ── Color themes ─────────────────────────────────────────────────────────────

export const colorsLight = {
  bg: '#F7F7FB',
  surface: '#FFFFFF',
  surfaceRaised: '#FFFFFF',
  surfaceSunken: '#F7F7FB',
  border: '#ECEBF3',
  borderStrong: '#DCDAE8',
  divider: '#F2F1F7',
  track: '#F0EFF6',

  text: '#16152B',
  textMuted: '#6B6A80',
  textSubtle: '#9A99AD',

  primary: '#635BDB',
  primaryHover: '#544CC9',
  primaryText: '#4F46C8',
  primarySoft: '#EEEDFC',
  onPrimary: '#FFFFFF',

  sidebar: '#635BDB',
  sidebarActive: 'rgba(255,255,255,0.20)',
  hero: '#635BDB',
  heroTile: 'rgba(255,255,255,0.14)',

  owed: '#12805A',
  owedSoft: '#E6F5EE',
  owe: '#C2410C',
  oweSoft: '#FFF0E6',
  warningText: '#8A3208',

  inverse: '#16152B',
  onInverse: '#FFFFFF',
  scrim: 'rgba(22,21,43,0.50)',
} as const;

export const colorsDark = {
  bg: '#0F0E1A',
  surface: '#17162A',
  surfaceRaised: '#201F36',
  surfaceSunken: '#121124',
  border: '#2A2944',
  borderStrong: '#3A3858',
  divider: '#222137',
  track: '#232238',

  text: '#F2F1FA',
  textMuted: '#A3A2BC',
  textSubtle: '#6E6D88',

  primary: '#635BDB',
  primaryHover: '#7069E3',
  primaryText: '#A7A2FF',
  primarySoft: '#2A2758',
  onPrimary: '#FFFFFF',

  sidebar: '#2B2770',
  sidebarActive: 'rgba(255,255,255,0.14)',
  hero: '#4F48C9',
  heroTile: 'rgba(255,255,255,0.12)',

  owed: '#5BD69B',
  owedSoft: '#12352A',
  owe: '#FF9A5C',
  oweSoft: '#3A2318',
  warningText: '#FFB98A',

  inverse: '#F2F1FA',
  onInverse: '#16152B',
  scrim: 'rgba(5,5,12,0.70)',
} as const;

// ── Chart colors ─────────────────────────────────────────────────────────────

export const chart = {
  light: {
    positive: '#2E9B6F',
    negative: '#E8763A',
    barMuted: '#DCDAF5',
    grid: '#ECEBF3',
    series: ['#635BDB', '#14A3A3', '#F08A3C', '#E25C9A', '#4BA3F2'] as const,
  },
  dark: {
    positive: '#3FBF85',
    negative: '#F08A4B',
    barMuted: '#34325A',
    grid: '#2A2944',
    series: ['#8A84F5', '#2CC4C4', '#F59A55', '#EC74AA', '#6DB6F5'] as const,
  },
} as const;

// ── Category tiles ────────────────────────────────────────────────────────────

export const categories = {
  food:      { light: { bg: '#EEEDFC', fg: '#4F46C8' }, dark: { bg: '#2A2758', fg: '#A7A2FF' } },
  travel:    { light: { bg: '#E3F5F5', fg: '#0B7C7C' }, dark: { bg: '#123536', fg: '#5ED6D6' } },
  bills:     { light: { bg: '#FFF0E6', fg: '#B4500B' }, dark: { bg: '#3A2318', fg: '#FFAF7A' } },
  groceries: { light: { bg: '#FCE9F2', fg: '#B5336F' }, dark: { bg: '#3A1A2B', fg: '#F28DBB' } },
  fun:       { light: { bg: '#E6F2FD', fg: '#23679F' }, dark: { bg: '#15293F', fg: '#8CC6F7' } },
} as const;

// ── Avatar palette ────────────────────────────────────────────────────────────

export const avatars = {
  you: '#635BDB',
  1: '#D6457F',
  2: '#0F8A8A',
  3: '#C9601A',
  4: '#2F7FD1',
  5: '#2E8B57',
  6: '#A86B12',
} as const;

// ── Spacing (px values as numbers) ───────────────────────────────────────────

export const space = {
  1: 4,
  2: 8,
  3: 12,
  3.5: 14,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  12: 48,
} as const;

// ── Radius ────────────────────────────────────────────────────────────────────

export const radius = {
  r8: 8,
  r11: 11,
  r12: 12,
  r14: 14,
  r16: 16,
  r18: 18,
  r22: 22,
  r24: 24,
  r28: 28,
  pill: 999,
} as const;

// ── Shadows ───────────────────────────────────────────────────────────────────

export const shadows = {
  hero: '0 20px 40px -20px rgba(99,91,219,0.75)',
  floating: '0 20px 40px -24px rgba(22,21,43,0.35)',
  primary: '0 8px 20px -8px rgba(99,91,219,0.6)',
  segment: '0 1px 3px rgba(22,21,43,0.14)',
  cardHover: '0 14px 30px -18px rgba(99,91,219,0.55)',
  modal: '0 40px 80px -30px rgba(22,21,43,0.55)',
} as const;

// ── Layout ────────────────────────────────────────────────────────────────────

export const layout = {
  sidebarWidth: 252,
  sidebarRail: 84,
  topbarHeight: 72,
  contentMax: 1400,
  touchMin: 44,
  bpTablet: 1180,
  bpPhone: 720,
} as const;

// ── Typography scale (use .type-* CSS classes; these are for JS chart labels) ─

export const typography = {
  display:    { size: 40, weight: 800, lineHeight: 1.05, letterSpacing: -1.4 },
  amountLg:   { size: 30, weight: 800, lineHeight: 1.1,  letterSpacing: -1.0 },
  amount:     { size: 24, weight: 800, lineHeight: 1.15, letterSpacing: -0.6 },
  title:      { size: 28, weight: 800, lineHeight: 1.15, letterSpacing: -0.8 },
  headline:   { size: 17, weight: 700, lineHeight: 1.3,  letterSpacing: -0.2 },
  bodyStrong: { size: 15, weight: 700, lineHeight: 1.4,  letterSpacing: 0 },
  body:       { size: 15, weight: 600, lineHeight: 1.45, letterSpacing: 0 },
  label:      { size: 13, weight: 600, lineHeight: 1.35, letterSpacing: 0 },
  caption:    { size: 12, weight: 500, lineHeight: 1.4,  letterSpacing: 0 },
  micro:      { size: 11, weight: 600, lineHeight: 1.3,  letterSpacing: 0 },
  overline:   { size: 12, weight: 700, lineHeight: 1.3,  letterSpacing: 0.5 },
} as const;

export const fontFamily = 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
