'use client'

/**
 * Client-side translation hook bound to the Zustand store's `uiLanguage`.
 *
 * Usage:
 *   import { useTranslation } from '@/lib/useTranslation'
 *   const t = useTranslation()
 *   <h1>{t('hero.title.pre')}</h1>
 *   <p>{t('builder.poweredBy', { n: 4 })}</p>
 */

import { useMemo } from 'react'
import { useAppStore } from '@/lib/store'
import { makeTranslator, type UiLanguage, type TranslateFn } from '@/lib/i18n'

export function useTranslation(): TranslateFn {
  const lang: UiLanguage = useAppStore((s) => s.uiLanguage) || 'en'
  return useMemo(() => makeTranslator(lang), [lang])
}

export { type UiLanguage, type TranslateFn } from '@/lib/i18n'
