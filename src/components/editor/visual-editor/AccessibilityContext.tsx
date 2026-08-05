'use client'

import * as React from 'react'
import { createContext, useContext, useState, useCallback, useEffect } from 'react'

export type FontSizeScale = 'small' | 'medium' | 'large' | 'extra-large'

export interface AccessibilityContextType {
  fontSizeScale: FontSizeScale
  setFontSizeScale: (scale: FontSizeScale) => void
  reduceMotion: boolean
  setReduceMotion: (reduce: boolean) => void
  highContrast: boolean
  setHighContrast: (high: boolean) => void
  getBaseFontSize: () => number
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [fontSizeScale, setFontSizeScale] = useState<FontSizeScale>('medium')
  const [reduceMotion, setReduceMotion] = useState(false)
  const [highContrast, setHighContrast] = useState(false)

  // Check system preference for reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mediaQuery.matches) {
      setReduceMotion(true)
    }

    const handleChange = (e: MediaQueryListEvent) => {
      setReduceMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const getBaseFontSize = useCallback(() => {
    switch (fontSizeScale) {
      case 'small': return 14
      case 'medium': return 16
      case 'large': return 18
      case 'extra-large': return 20
      default: return 16
    }
  }, [fontSizeScale])

  const value = React.useMemo(
    () => ({
      fontSizeScale,
      setFontSizeScale,
      reduceMotion,
      setReduceMotion,
      highContrast,
      setHighContrast,
      getBaseFontSize,
    }),
    [fontSizeScale, reduceMotion, highContrast, getBaseFontSize]
  )

  return (
    <AccessibilityContext.Provider value={value}>
      <div 
        className="editor-accessibility-wrapper"
        style={{
          fontSize: `${getBaseFontSize()}px`,
        }}
        data-reduce-motion={reduceMotion}
        data-high-contrast={highContrast}
      >
        {children}
      </div>
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider')
  }
  return context
}
