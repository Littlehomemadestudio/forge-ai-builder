/**
 * Design Tokens for the New Visual Editor
 * Light theme only, accessibility-first, modern, clean, timeless
 */

export const colors = {
  // Core backgrounds
  background: '#FAFAFA',
  panel: '#FFFFFF',
  border: '#EAEAEA',
  borderHover: '#D1D5DB',
  
  // Primary accent
  primary: '#2563EB',
  primaryHover: '#1D4ED8',
  primaryActive: '#1E40AF',
  selection: '#3B82F6',
  selectionBg: '#DBEAFE',
  
  // Text
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  textInverse: '#FFFFFF',
  
  // State colors
  success: '#16A34A',
  successBg: '#DCFCE7',
  warning: '#F59E0B',
  warningBg: '#FEF3C7',
  danger: '#DC2626',
  dangerBg: '#FEF2F2',
  
  // Interactive states
  hover: '#F3F4F6',
  active: '#E5E7EB',
  focus: '#2563EB',
  focusRing: '#DBEAFE',
  
  // Canvas
  canvasBg: '#F9FAFB',
  gridLine: '#E5E7EB',
  
  // Shadows
  shadowSm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  shadowMd: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  shadowLg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  shadowXl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
} as const;

export const typography = {
  // Base sizes (large and readable by default)
  base: '16px',
  scale: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
  },
  // Font scaling controls for accessibility
  fontScale: {
    small: 0.875,   // 14px base
    medium: 1,      // 16px base (default)
    large: 1.125,   // 18px base
    extraLarge: 1.25, // 20px base
  },
  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  fontFamilies: {
    sans: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: 'JetBrains Mono, "Fira Code", Consolas, monospace',
  },
  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

export const spacing = {
  // 4px base unit
  0: '0',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
} as const;

export const borderRadius = {
  none: '0',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '24px',
  full: '9999px',
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  selection: '0 0 0 2px #3B82F6',
  focus: '0 0 0 3px #DBEAFE',
} as const;

export const motion = {
  // Default durations (accessible)
  fast: '100ms',
  normal: '150ms',
  slow: '200ms',
  slower: '300ms',
  
  // Easing
  easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
  easeIn: 'cubic-bezier(0.7, 0, 0.84, 0)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  spring: 'cubic-bezier(0.16, 1, 0.3, 1)',
  
  // Reduced motion
  reduced: '1ms',
} as const;

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  modal: 1200,
  popover: 1300,
  tooltip: 1400,
  toast: 1500,
  floatingToolbar: 1600,
  modalBackdrop: 1100,
} as const;

export const canvas = {
  minZoom: 0.25,
  maxZoom: 3,
  defaultZoom: 1,
  zoomStep: 0.1,
  gridSize: 8,
  snapThreshold: 8,
} as const;

export const accessibility = {
  // Minimum touch target size (WCAG 2.5.5)
  minTouchTarget: 44,
  // Focus ring offset
  focusRingOffset: 2,
  // Minimum contrast ratios
  minContrastAA: 4.5,
  minContrastAALarge: 3,
  minContrastAAA: 7,
  minContrastAAALarge: 4.5,
} as const;

export type DesignTokens = {
  colors: typeof colors;
  typography: typeof typography;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  shadows: typeof shadows;
  motion: typeof motion;
  breakpoints: typeof breakpoints;
  zIndex: typeof zIndex;
  canvas: typeof canvas;
  accessibility: typeof accessibility;
};

export const designTokens: DesignTokens = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  motion,
  breakpoints,
  zIndex,
  canvas,
  accessibility,
};

export default designTokens;