// Design Tokens for the Visual Editor
// Inspired by Linear, Framer, Canva, and Apple HIG

export const COLORS = {
  // Backgrounds
  background: '#FAFAFA',
  panel: '#FFFFFF',
  panelHover: '#F9FAFB',
  
  // Borders
  border: '#EAEAEA',
  borderHover: '#D4D4D8',
  
  // Primary Accent
  primary: '#2563EB',
  primaryHover: '#1D4ED8',
  primaryLight: '#EFF6FF',
  
  // Selection
  selection: '#3B82F6',
  selectionLight: '#DBEAFE',
  
  // States
  hover: '#F3F4F6',
  active: '#E5E7EB',
  
  // Text
  text: '#111827',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  textMuted: '#D1D5DB',
  
  // Semantic
  success: '#16A34A',
  successLight: '#DCFCE7',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  danger: '#DC2626',
  dangerLight: '#FEE2E2',
  info: '#0EA5E9',
  infoLight: '#E0F2FE',
} as const

export const SPACING = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '32px',
  '4xl': '40px',
} as const

export const RADIUS = {
  none: '0px',
  sm: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  '2xl': '16px',
  full: '9999px',
} as const

export const SHADOWS = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  glow: '0 0 0 2px rgba(59, 130, 246, 0.5)',
} as const

export const TYPOGRAPHY = {
  fontFamily: {
    sans: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    mono: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, monospace',
  },
  fontSize: {
    xs: '11px',
    sm: '13px',
    base: '15px',
    lg: '17px',
    xl: '19px',
    '2xl': '22px',
    '3xl': '26px',
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
} as const

export const ANIMATION = {
  duration: {
    fast: '100ms',
    normal: '150ms',
    slow: '200ms',
    slower: '300ms',
  },
  easing: {
    ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
} as const

export const ACCESSIBILITY = {
  minTouchTarget: '44px',
  focusRing: '0 0 0 2px #FFFFFF, 0 0 0 4px #3B82F6',
  focusRingOffset: '2px',
  contrastRatio: {
    AA: 4.5,
    AAA: 7,
  },
} as const

export const Z_INDEX = {
  canvas: 0,
  overlay: 100,
  toolbar: 200,
  floatingPanel: 300,
  modal: 400,
  tooltip: 500,
} as const

export const BREAKPOINTS = {
  mobile: '375px',
  tablet: '768px',
  desktop: '1280px',
  wide: '1920px',
} as const
