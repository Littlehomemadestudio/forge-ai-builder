'use client'

/**
 * LanguageSwitcher — bilingual EN/FA toggle for the BUILDER UI itself.
 *
 * Reads `uiLanguage` from the Zustand store and calls `setUiLanguage` to switch.
 * The store handles:
 *   - persisting to localStorage
 *   - updating <html lang/dir>
 *   - updating URL ?lang=
 *   - toggling the .rtl-ui class on <body>
 *
 * Visual: a small pill with two segments (EN | FA), the active one highlighted.
 * Compact size — designed to fit in a navbar next to theme toggle / sign-in.
 */

import React from 'react'
import { useAppStore } from '@/lib/store'
import { UI_LANGUAGES, type UiLanguage } from '@/lib/i18n'

interface LanguageSwitcherProps {
  /** 'pill' = two-button segmented control (default); 'button' = single toggle button */
  variant?: 'pill' | 'button'
  /** Optional class to size/position the switcher */
  className?: string
  /** Compact mode shows only flag/code, no native label */
  compact?: boolean
}

export function LanguageSwitcher({
  variant = 'pill',
  className = '',
  compact = true,
}: LanguageSwitcherProps) {
  const uiLanguage = useAppStore((s) => s.uiLanguage) as UiLanguage
  const setUiLanguage = useAppStore((s) => s.setUiLanguage)

  if (variant === 'button') {
    // Single-button toggle: click flips between EN and FA
    const next: UiLanguage = uiLanguage === 'en' ? 'fa' : 'en'
    const current = UI_LANGUAGES.find((l) => l.id === uiLanguage)!
    return (
      <button
        type="button"
        onClick={() => setUiLanguage(next)}
        className={`lang-switcher-btn ${className}`}
        title="Switch language"
        aria-label={`Switch language (current: ${current.label})`}
      >
        <span>{current.flag}</span>
        {!compact && <span>{current.nativeLabel}</span>}
        <span className="text-[10px] opacity-70">↔</span>
      </button>
    )
  }

  // Pill — two-segment control
  return (
    <div className={`lang-switcher ${className}`} role="group" aria-label="Language selector">
      {UI_LANGUAGES.map((lang) => {
        const isActive = uiLanguage === lang.id
        return (
          <button
            key={lang.id}
            type="button"
            onClick={() => setUiLanguage(lang.id)}
            className={`lang-switcher-btn ${isActive ? 'active' : ''}`}
            aria-pressed={isActive}
            title={lang.label}
          >
            <span>{lang.flag}</span>
            {!compact && <span>{lang.nativeLabel}</span>}
            {compact && <span className="uppercase">{lang.id}</span>}
          </button>
        )
      })}
    </div>
  )
}

export default LanguageSwitcher
