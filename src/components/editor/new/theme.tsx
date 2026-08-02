'use client';

import React, { createContext, useContext, useMemo, useState, useEffect, ReactNode } from 'react';
import { designTokens, type DesignTokens } from './designTokens';

// Theme context for design tokens
const ThemeContext = createContext<DesignTokens>(designTokens);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [fontScale, setFontScale] = useState<'small' | 'medium' | 'large' | 'extraLarge'>('medium');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  // Apply font scale to document root
  useEffect(() => {
    const scale = designTokens.typography.fontScale[fontScale];
    document.documentElement.style.fontSize = `${parseFloat(designTokens.typography.base) * scale}px`;
  }, [fontScale]);

  // Apply reduced motion preference
  useEffect(() => {
    if (reducedMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  }, [reducedMotion]);

  // Apply high contrast
  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [highContrast]);

  // Listen for system prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (!reducedMotion) { // Only auto-apply if user hasn't manually set
        document.documentElement.classList.toggle('reduce-motion', e.matches);
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [reducedMotion]);

  const value = useMemo(() => ({
    ...designTokens,
    fontScale,
    setFontScale,
    reducedMotion,
    setReducedMotion,
    highContrast,
    setHighContrast,
  }), [fontScale, reducedMotion, highContrast]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// CSS-in-JS helper for building styles
export function css(strings: TemplateStringsArray, ...values: (string | number | boolean | null | undefined)[]) {
  let result = '';
  for (let i = 0; i < strings.length; i++) {
    result += strings[i];
    if (i < values.length) {
      const val = values[i];
      result += val === undefined || val === null ? '' : String(val);
    }
  }
  return result;
}

// Helper to create responsive styles
export const responsive = {
  sm: (style: string) => `@media (min-width: 640px) { ${style} }`,
  md: (style: string) => `@media (min-width: 768px) { ${style} }`,
  lg: (style: string) => `@media (min-width: 1024px) { ${style} }`,
  xl: (style: string) => `@media (min-width: 1280px) { ${style} }`,
  motionSafe: (style: string) => `@media (prefers-reduced-motion: no-preference) { ${style} }`,
  motionReduce: (style: string) => `@media (prefers-reduced-motion: reduce) { ${style} }`,
  highContrast: (style: string) => `@media (prefers-contrast: more) { ${style} }`,
};

// Global styles injection
export const globalStyles = `
  * {
    box-sizing: border-box;
  }
  
  *:focus-visible {
    outline: none;
    ring: 2px solid #2563EB;
    ring-offset: 2px;
    ring-offset-color: white;
  }
  
  .reduce-motion *,
  .reduce-motion *::before,
  .reduce-motion *::after {
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 1ms !important;
    scroll-behavior: auto !important;
  }
  
  .high-contrast {
    --color-border: #000;
    --color-text-secondary: #000;
  }
  
  .high-contrast .panel {
    border: 2px solid #000 !important;
  }
  
  ::selection {
    background-color: #3B82F6;
    color: white;
  }
  
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  
  ::-webkit-scrollbar-thumb {
    background: #D1D5DB;
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: #9CA3AF;
  }
  
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 1ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 1ms !important;
      scroll-behavior: auto !important;
    }
  }
  
  @media (prefers-contrast: more) {
    :root {
      --color-border: #000;
      --color-text-secondary: #000;
    }
  }
`;

// Inject global styles on first load
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  const styleId = 'forge-editor-global-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = globalStyles;
    document.head.appendChild(style);
  }
}