'use client'

/**
 * HtmlDirLangSync — invisible client component that keeps <html lang/dir>
 * and the .rtl-ui class on <body> in sync with the Zustand `uiLanguage` state.
 *
 * Mount this ONCE near the root (e.g. in app/layout.tsx or app/page.tsx).
 *
 * On mount:
 *   1. Reads the user's preferred language from URL ?lang= / localStorage / browser
 *   2. If it differs from the current store value (which is 'en' after SSR),
 *      calls setUiLanguage() — this updates the store, persists to localStorage,
 *      and applies <html lang/dir>
 *   3. If it matches, just applies <html lang/dir> directly
 *
 * On subsequent uiLanguage changes (from LanguageSwitcher clicks), re-applies to DOM.
 *
 * This two-step approach avoids the React hydration mismatch that would occur
 * if the store initialized from URL on the client (server would render 'en',
 * client would render 'fa', React would error).
 */

import { useEffect } from 'react'
import { useAppStore } from '@/lib/store'
import { applyHtmlDirLang, loadUiLanguage } from '@/lib/i18n'

export function HtmlDirLangSync() {
  const uiLanguage = useAppStore((s) => s.uiLanguage)
  const setUiLanguage = useAppStore((s) => s.setUiLanguage)

  // On mount: read user's actual preference and apply it
  useEffect(() => {
    const preferred = loadUiLanguage()
    if (preferred !== uiLanguage) {
      // Update store (which will also apply to DOM via the effect below + the action's applyHtmlDirLang call)
      setUiLanguage(preferred)
    } else {
      // Already matches — just ensure DOM is in sync (covers SSR case where store is 'en' but DOM <html> might not have lang/dir set yet)
      applyHtmlDirLang(uiLanguage)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // On any uiLanguage change: apply to DOM
  useEffect(() => {
    applyHtmlDirLang(uiLanguage)
  }, [uiLanguage])

  // Render nothing — this is a side-effect only component
  return null
}

export default HtmlDirLangSync
