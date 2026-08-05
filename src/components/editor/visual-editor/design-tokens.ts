// ─────────────────────────────────────────────────────────────────────────────
// Design Tokens — Production-Grade Visual Editor Token System
// Inspired by Figma, Webflow, Linear, Framer, and Apple HIG
// Supports light + dark mode with semantic tokens
// ─────────────────────────────────────────────────────────────────────────────

import * as React from 'react'

// ═══════════════════════════════════════════════════════════════════════════
// 1. COLOR SYSTEM — Semantic tokens for light and dark modes
// ═══════════════════════════════════════════════════════════════════════════

/** Light-mode semantic color palette */
export const LIGHT_COLORS = {
  // ── Surface hierarchy ──────────────────────────────────────────────────
  surface: {
    root:       '#FFFFFF',
    base:       '#F8F9FA',
    raised:     '#FFFFFF',
    overlay:    '#FFFFFF',
    sunken:     '#F1F2F4',
    inset:      '#ECEDEF',
  },

  // ── On-surface (text on surface) ───────────────────────────────────────
  onSurface: {
    primary:    '#111827',
    secondary:  '#4B5563',
    tertiary:   '#9CA3AF',
    muted:      '#D1D5DB',
    inverse:    '#FFFFFF',
  },

  // ── Primary accent ─────────────────────────────────────────────────────
  primary: {
    base:       '#2563EB',
    hover:      '#1D4ED8',
    active:     '#1E40AF',
    light:      '#EFF6FF',
    lighter:    '#DBEAFE',
    onPrimary:  '#FFFFFF',
  },

  // ── Secondary accent ───────────────────────────────────────────────────
  secondary: {
    base:       '#7C3AED',
    hover:      '#6D28D9',
    active:     '#5B21B6',
    light:      '#F5F3FF',
    lighter:    '#EDE9FE',
    onSecondary:'#FFFFFF',
  },

  // ── Error / Danger ─────────────────────────────────────────────────────
  error: {
    base:       '#DC2626',
    hover:      '#B91C1C',
    active:     '#991B1B',
    light:      '#FEF2F2',
    lighter:    '#FEE2E2',
    onError:    '#FFFFFF',
  },

  // ── Warning ────────────────────────────────────────────────────────────
  warning: {
    base:       '#F59E0B',
    hover:      '#D97706',
    active:     '#B45309',
    light:      '#FFFBEB',
    lighter:    '#FEF3C7',
    onWarning:  '#1F2937',
  },

  // ── Success ────────────────────────────────────────────────────────────
  success: {
    base:       '#16A34A',
    hover:      '#15803D',
    active:     '#166534',
    light:      '#F0FDF4',
    lighter:    '#DCFCE7',
    onSuccess:  '#FFFFFF',
  },

  // ── Info ───────────────────────────────────────────────────────────────
  info: {
    base:       '#0EA5E9',
    hover:      '#0284C7',
    active:     '#0369A1',
    light:      '#F0F9FF',
    lighter:    '#E0F2FE',
    onInfo:     '#FFFFFF',
  },

  // ── Border ─────────────────────────────────────────────────────────────
  border: {
    default:    '#E5E7EB',
    hover:      '#D1D5DB',
    active:     '#9CA3AF',
    focus:      '#2563EB',
    error:      '#DC2626',
    muted:      '#F3F4F6',
  },

  // ── State overlays ─────────────────────────────────────────────────────
  state: {
    hover:      '#F9FAFB',
    active:     '#F3F4F6',
    selected:   '#EFF6FF',
    disabled:   '#F9FAFB',
    drag:       '#EFF6FF',
  },

  // ── Selection ──────────────────────────────────────────────────────────
  selection: {
    fill:       '#2563EB',
    stroke:     '#2563EB',
    light:      '#DBEAFE',
    marquee:    'rgba(37, 99, 235, 0.15)',
    handle:     '#FFFFFF',
  },

  // ── Canvas ─────────────────────────────────────────────────────────────
  canvas: {
    background: '#F8F9FA',
    dot:        '#D1D5DB',
    frame:      '#FFFFFF',
    artboard:   '#FFFFFF',
  },
} as const


/** Dark-mode semantic color palette */
export const DARK_COLORS = {
  // ── Surface hierarchy ──────────────────────────────────────────────────
  surface: {
    root:       '#0F172A',
    base:       '#111827',
    raised:     '#1E293B',
    overlay:    '#1E293B',
    sunken:     '#0B1120',
    inset:      '#0F172A',
  },

  // ── On-surface ─────────────────────────────────────────────────────────
  onSurface: {
    primary:    '#F1F5F9',
    secondary:  '#94A3B8',
    tertiary:   '#64748B',
    muted:      '#475569',
    inverse:    '#0F172A',
  },

  // ── Primary ────────────────────────────────────────────────────────────
  primary: {
    base:       '#60A5FA',
    hover:      '#3B82F6',
    active:     '#2563EB',
    light:      '#172554',
    lighter:    '#1E3A5F',
    onPrimary:  '#0F172A',
  },

  // ── Secondary ──────────────────────────────────────────────────────────
  secondary: {
    base:       '#A78BFA',
    hover:      '#8B5CF6',
    active:     '#7C3AED',
    light:      '#1E1044',
    lighter:    '#2E1065',
    onSecondary:'#0F172A',
  },

  // ── Error ──────────────────────────────────────────────────────────────
  error: {
    base:       '#F87171',
    hover:      '#EF4444',
    active:     '#DC2626',
    light:      '#450A0A',
    lighter:    '#7F1D1D',
    onError:    '#0F172A',
  },

  // ── Warning ────────────────────────────────────────────────────────────
  warning: {
    base:       '#FBBF24',
    hover:      '#F59E0B',
    active:     '#D97706',
    light:      '#422006',
    lighter:    '#78350F',
    onWarning:  '#0F172A',
  },

  // ── Success ────────────────────────────────────────────────────────────
  success: {
    base:       '#4ADE80',
    hover:       '#22C55E',
    active:     '#16A34A',
    light:      '#052E16',
    lighter:    '#14532D',
    onSuccess:  '#0F172A',
  },

  // ── Info ───────────────────────────────────────────────────────────────
  info: {
    base:       '#38BDF8',
    hover:      '#0EA5E9',
    active:     '#0284C7',
    light:      '#082F49',
    lighter:    '#0C4A6E',
    onInfo:     '#0F172A',
  },

  // ── Border ─────────────────────────────────────────────────────────────
  border: {
    default:    '#334155',
    hover:      '#475569',
    active:     '#64748B',
    focus:      '#60A5FA',
    error:      '#F87171',
    muted:      '#1E293B',
  },

  // ── State ──────────────────────────────────────────────────────────────
  state: {
    hover:      '#1E293B',
    active:     '#253347',
    selected:   '#172554',
    disabled:   '#1E293B',
    drag:       '#1E293B',
  },

  // ── Selection ──────────────────────────────────────────────────────────
  selection: {
    fill:       '#60A5FA',
    stroke:     '#60A5FA',
    light:      '#1E3A5F',
    marquee:    'rgba(96, 165, 250, 0.15)',
    handle:     '#FFFFFF',
  },

  // ── Canvas ─────────────────────────────────────────────────────────────
  canvas: {
    background: '#111827',
    dot:        '#334155',
    frame:      '#1E293B',
    artboard:   '#1E293B',
  },
} as const


// ── Backward-compatible flat color objects ─────────────────────────────────
// These keep the old API working for existing consumers.

export const COLORS = {
  background:       LIGHT_COLORS.surface.base,
  panel:            LIGHT_COLORS.surface.raised,
  panelHover:       LIGHT_COLORS.state.hover,
  border:           LIGHT_COLORS.border.default,
  borderHover:      LIGHT_COLORS.border.hover,
  primary:          LIGHT_COLORS.primary.base,
  primaryHover:     LIGHT_COLORS.primary.hover,
  primaryLight:     LIGHT_COLORS.primary.light,
  selection:        LIGHT_COLORS.selection.fill,
  selectionLight:   LIGHT_COLORS.selection.light,
  hover:            LIGHT_COLORS.state.hover,
  active:           LIGHT_COLORS.state.active,
  text:             LIGHT_COLORS.onSurface.primary,
  textSecondary:    LIGHT_COLORS.onSurface.secondary,
  textTertiary:     LIGHT_COLORS.onSurface.tertiary,
  textMuted:        LIGHT_COLORS.onSurface.muted,
  success:          LIGHT_COLORS.success.base,
  successLight:     LIGHT_COLORS.success.lighter,
  warning:          LIGHT_COLORS.warning.base,
  warningLight:     LIGHT_COLORS.warning.lighter,
  danger:           LIGHT_COLORS.error.base,
  dangerLight:      LIGHT_COLORS.error.lighter,
  info:             LIGHT_COLORS.info.base,
  infoLight:        LIGHT_COLORS.info.lighter,
} as const

// DARK_COLORS flat object (backward-compat) – reassigned below to keep name
const _DARK_FLAT = {
  background:       DARK_COLORS.surface.base,
  panel:            DARK_COLORS.surface.raised,
  panelHover:       DARK_COLORS.state.hover,
  border:           DARK_COLORS.border.default,
  borderHover:      DARK_COLORS.border.hover,
  primary:          DARK_COLORS.primary.base,
  primaryHover:     DARK_COLORS.primary.hover,
  primaryLight:     DARK_COLORS.primary.light,
  selection:        DARK_COLORS.selection.fill,
  selectionLight:   DARK_COLORS.selection.light,
  hover:            DARK_COLORS.state.hover,
  active:           DARK_COLORS.state.active,
  text:             DARK_COLORS.onSurface.primary,
  textSecondary:    DARK_COLORS.onSurface.secondary,
  textTertiary:     DARK_COLORS.onSurface.tertiary,
  textMuted:        DARK_COLORS.onSurface.muted,
  success:          DARK_COLORS.success.base,
  successLight:     DARK_COLORS.success.lighter,
  warning:          DARK_COLORS.warning.base,
  warningLight:     DARK_COLORS.warning.lighter,
  danger:           DARK_COLORS.error.base,
  dangerLight:      DARK_COLORS.error.lighter,
  info:             DARK_COLORS.info.base,
  infoLight:        DARK_COLORS.info.lighter,
} as const

/** @deprecated Use semantic DARK_COLORS or useEditorTheme() instead */
export { _DARK_FLAT as DARK_COLORS }


// ═══════════════════════════════════════════════════════════════════════════
// 2. SPACING — 4px base unit scale
// ═══════════════════════════════════════════════════════════════════════════

export const SPACING = {
  0:  '0px',
  1:  '4px',
  2:  '8px',
  3:  '12px',
  4:  '16px',
  5:  '20px',
  6:  '24px',
  8:  '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
  32: '128px',
  40: '160px',
  48: '192px',
  64: '256px',

  // Semantic aliases (backward compat)
  xs:  '4px',
  sm:  '8px',
  md:  '12px',
  lg:  '16px',
  xl:  '20px',
  '2xl': '24px',
  '3xl': '32px',
  '4xl': '40px',
} as const


// ═══════════════════════════════════════════════════════════════════════════
// 3. TYPOGRAPHY — Complete type scale with line heights
// ═══════════════════════════════════════════════════════════════════════════

export const TYPOGRAPHY = {
  fontFamily: {
    sans:  'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    mono:  '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, monospace',
  },
  fontSize: {
    '10': '10px',
    '11': '11px',
    '12': '12px',
    '13': '13px',
    '14': '14px',
    '15': '15px',
    '16': '16px',
    '18': '18px',
    '20': '20px',
    '22': '22px',
    '24': '24px',
    '26': '26px',
    '28': '28px',
    '30': '30px',
    '32': '32px',
    '36': '36px',
    '40': '40px',
    '48': '48px',
    '56': '56px',
    '64': '64px',
    '72': '72px',
    '80': '80px',
    '96': '96px',

    // Semantic aliases (backward compat)
    xs:   '11px',
    sm:   '13px',
    base: '15px',
    lg:   '17px',
    xl:   '19px',
    '2xl':'22px',
    '3xl':'26px',
  },
  lineHeight: {
    none:    '1',
    tight:   '1.25',
    snug:    '1.375',
    normal:  '1.5',
    relaxed: '1.625',
    loose:   '2',
  },
  fontWeight: {
    thin:       '100',
    extralight: '200',
    light:      '300',
    normal:     '400',
    medium:     '500',
    semibold:   '600',
    bold:       '700',
    extrabold:  '800',
    black:      '900',
  },
  letterSpacing: {
    tighter: '-0.05em',
    tight:   '-0.025em',
    normal:  '0em',
    wide:    '0.025em',
    wider:   '0.05em',
    widest:  '0.1em',
  },
} as const


// ═══════════════════════════════════════════════════════════════════════════
// 4. ELEVATION / SHADOWS
// ═══════════════════════════════════════════════════════════════════════════

export const SHADOWS = {
  none:   'none',
  xs:     '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
  sm:     '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md:     '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg:     '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl:     '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl':  '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner:  'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
  glow:   '0 0 0 2px rgba(59, 130, 246, 0.5)',
  ring:   '0 0 0 2px rgba(59, 130, 246, 0.35)',
} as const


// ═══════════════════════════════════════════════════════════════════════════
// 5. BORDER RADIUS
// ═══════════════════════════════════════════════════════════════════════════

export const RADIUS = {
  none:  '0px',
  xs:    '2px',
  sm:    '4px',
  md:    '6px',
  lg:    '8px',
  xl:    '12px',
  '2xl': '16px',
  '3xl': '24px',
  full:  '9999px',
} as const


// ═══════════════════════════════════════════════════════════════════════════
// 6. ANIMATION / TRANSITIONS
// ═══════════════════════════════════════════════════════════════════════════

export const ANIMATION = {
  duration: {
    instant:  '0ms',
    fast:     '150ms',
    normal:   '250ms',
    slow:     '350ms',
    slower:   '500ms',
    entrance: '300ms',
    exit:     '200ms',
  },
  easing: {
    linear:    'linear',
    ease:      'cubic-bezier(0.4, 0, 0.2, 1)',
    easeIn:    'cubic-bezier(0.4, 0, 1, 1)',
    easeOut:   'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring:    'cubic-bezier(0.34, 1.56, 0.64, 1)',
    bounce:    'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    decel:     'cubic-bezier(0, 0, 0.2, 1)',
  },
  /** Framer Motion spring config */
  spring: {
    gentle:   { stiffness: 120, damping: 14, mass: 1 },
    default:  { stiffness: 180, damping: 12, mass: 1 },
    snappy:   { stiffness: 300, damping: 20, mass: 1 },
    bouncy:   { stiffness: 180, damping: 8,  mass: 1 },
  },
  /** Common transition shorthand strings */
  transition: {
    fast:   'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow:   'all 350ms cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'all 350ms cubic-bezier(0.34, 1.56, 0.64, 1)',
    colors: 'color 150ms cubic-bezier(0.4, 0, 0.2, 1), background-color 150ms cubic-bezier(0.4, 0, 0.2, 1), border-color 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    shadow: 'box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    opacity:'opacity 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    transform:'transform 250ms cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
} as const


// ═══════════════════════════════════════════════════════════════════════════
// 7. Z-INDEX
// ═══════════════════════════════════════════════════════════════════════════

export const Z_INDEX = {
  canvas:         0,
  selection:      10,
  hover:          20,
  toolbar:        100,
  panel:          200,
  floatingPanel:  300,
  overlay:        400,
  modal:          500,
  popover:        600,
  tooltip:        700,
  toast:          800,
  debug:          900,
} as const


// ═══════════════════════════════════════════════════════════════════════════
// 8. BREAKPOINTS
// ═══════════════════════════════════════════════════════════════════════════

export const BREAKPOINTS = {
  sm:   640,
  md:   768,
  lg:   1024,
  xl:   1280,
  '2xl':1536,

  // Named aliases
  mobile:   375,
  tablet:   768,
  desktop:  1280,
  wide:     1920,
} as const


// ═══════════════════════════════════════════════════════════════════════════
// 9. ACCESSIBILITY
// ═══════════════════════════════════════════════════════════════════════════

export const ACCESSIBILITY = {
  minTouchTarget: '44px',
  focusRing:       '0 0 0 2px #FFFFFF, 0 0 0 4px #3B82F6',
  focusRingOffset: '2px',
  contrastRatio: {
    AA:  4.5,
    AAA: 7,
  },
} as const


// ═══════════════════════════════════════════════════════════════════════════
// 10. GRID SYSTEM TOKENS
// ═══════════════════════════════════════════════════════════════════════════

export const GRID = {
  /** Base grid size (8px) */
  gridSize:       8,
  /** Major grid line (64px = 8 × 8) */
  majorGrid:      64,
  /** Distance within which snapping activates (4px) */
  snapThreshold:  4,
  /** Small grid subdivision (8px) */
  minorGrid:      8,
  /** Medium grid subdivision (16px) */
  midGrid:        16,
  /** Grid line opacity for rendering */
  lineOpacity:    0.15,
  /** Dot size for dot-grid rendering */
  dotSize:        1.5,
  /** Color for grid dots/lines (light) */
  dotColor:       '#D1D5DB',
  /** Color for grid dots/lines (dark) */
  dotColorDark:   '#334155',
} as const


// ═══════════════════════════════════════════════════════════════════════════
// 11. COMPREHENSIVE THEME TYPE
// ═══════════════════════════════════════════════════════════════════════════

export type ColorScheme = 'light' | 'dark'

export interface EditorTheme {
  mode: ColorScheme
  colors: typeof LIGHT_COLORS
  spacing: typeof SPACING
  typography: typeof TYPOGRAPHY
  shadows: typeof SHADOWS
  radius: typeof RADIUS
  animation: typeof ANIMATION
  zIndex: typeof Z_INDEX
  breakpoints: typeof BREAKPOINTS
  accessibility: typeof ACCESSIBILITY
  grid: typeof GRID
}

// ═══════════════════════════════════════════════════════════════════════════
// 12. useEditorTheme() — React hook providing ALL tokens contextually
// ═══════════════════════════════════════════════════════════════════════════

/** Build a full theme object for the given color scheme */
function buildTheme(mode: ColorScheme): EditorTheme {
  return {
    mode,
    colors:   mode === 'dark' ? DARK_COLORS : LIGHT_COLORS,
    spacing:  SPACING,
    typography: TYPOGRAPHY,
    shadows:  SHADOWS,
    radius:   RADIUS,
    animation: ANIMATION,
    zIndex:   Z_INDEX,
    breakpoints: BREAKPOINTS,
    accessibility: ACCESSIBILITY,
    grid:     GRID,
  }
}

/**
 * Reads dark mode from the `dark` CSS class on `<html>` and provides
 * ALL design tokens contextually. Re-renders on class change.
 */
export function useEditorTheme(): EditorTheme {
  const [mode, setMode] = React.useState<ColorScheme>(() => {
    if (typeof document === 'undefined') return 'light'
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  })

  React.useEffect(() => {
    if (typeof document === 'undefined') return

    const el = document.documentElement
    setMode(el.classList.contains('dark') ? 'dark' : 'light')

    // Observe class mutations so we stay in sync with next-themes etc.
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.attributeName === 'class') {
          setMode(el.classList.contains('dark') ? 'dark' : 'light')
          break
        }
      }
    })
    observer.observe(el, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  return React.useMemo(() => buildTheme(mode), [mode])
}


// ═══════════════════════════════════════════════════════════════════════════
// 13. LEGACY useTheme() hook (backward compat)
// ═══════════════════════════════════════════════════════════════════════════

export function useTheme() {
  const [dark, setDark] = React.useState(false)

  const toggle = React.useCallback(() => {
    setDark((prev) => {
      const next = !prev
      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', next)
      }
      return next
    })
  }, [])

  return { dark, toggle }
}
