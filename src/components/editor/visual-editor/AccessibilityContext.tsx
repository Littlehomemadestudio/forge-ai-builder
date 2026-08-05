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

  // Initialize reduceMotion from system preference (lazy initializer avoids effect setState)
  const [reduceMotion, setReduceMotion] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  )

  const [highContrast, setHighContrast] = useState(false)

  // Keep reduceMotion in sync with system preference changes
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleChange = (e: MediaQueryListEvent) => {
      setReduceMotion(e.matches)
    }
    mq.addEventListener('change', handleChange)
    return () => mq.removeEventListener('change', handleChange)
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
