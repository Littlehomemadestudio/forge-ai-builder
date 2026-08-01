'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Check,
  Code2,
  Download,
  Globe2,
  Hexagon,
  Layers3,
  LockKeyhole,
  Moon,
  Palette,
  ShieldCheck,
  Sparkles,
  Sun,
  Wand2,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { isRtl } from '@/lib/i18n'
import { useAppStore } from '@/lib/store'
import { useTranslation } from '@/lib/useTranslation'

const fadeIn = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.55, ease: 'easeOut' },
}

const promptSuggestions = [
  'landing.prompt.saas',
  'landing.prompt.portfolio',
  'landing.prompt.restaurant',
]

const productPillars = [
  { icon: Wand2, title: 'landing.pillar.ai.title', desc: 'landing.pillar.ai.desc' },
  { icon: Palette, title: 'landing.pillar.editor.title', desc: 'landing.pillar.editor.desc' },
  { icon: Code2, title: 'landing.pillar.export.title', desc: 'landing.pillar.export.desc' },
  { icon: ShieldCheck, title: 'landing.pillar.production.title', desc: 'landing.pillar.production.desc' },
]

const workflow = [
  { step: '01', title: 'landing.workflow.describe.title', desc: 'landing.workflow.describe.desc' },
  { step: '02', title: 'landing.workflow.refine.title', desc: 'landing.workflow.refine.desc' },
  { step: '03', title: 'landing.workflow.launch.title', desc: 'landing.workflow.launch.desc' },
]

const proof = [
  { value: '2.5k+', label: 'landing.proof.sites' },
  { value: '15k+', label: 'landing.proof.pages' },
  { value: '99.9%', label: 'landing.proof.uptime' },
]

const checklist = [
  'landing.check.responsive',
  'landing.check.rtl',
  'landing.check.export',
  'landing.check.accessible',
]

export default function LandingPage() {
  const navigate = useAppStore((s) => s.navigate)
  const setBuilderPrompt = useAppStore((s) => s.setBuilderPrompt)
  const setDashboardTab = useAppStore((s) => s.setDashboardTab)
  const themeMode = useAppStore((s) => s.themeMode)
  const setThemeMode = useAppStore((s) => s.setThemeMode)
  const uiLanguage = useAppStore((s) => s.uiLanguage)
  const isAuthenticated = useAppStore((s) => s.isAuthenticated)
  const t = useTranslation()
  const [prompt, setPrompt] = useState('')

  const isDark = themeMode === 'dark'
  const isRtlMode = isRtl(uiLanguage)
  const textAlign = isRtlMode ? 'text-right' : 'text-left'

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  const openBuilder = useCallback((seed?: string) => {
    const finalPrompt = (seed ?? prompt).trim()
    if (finalPrompt) setBuilderPrompt(finalPrompt)
    navigate(isAuthenticated ? 'builder' : 'login')
  }, [isAuthenticated, navigate, prompt, setBuilderPrompt])

  const openTemplates = useCallback(() => {
    setDashboardTab('templates')
    navigate(isAuthenticated ? 'dashboard' : 'login')
  }, [isAuthenticated, navigate, setDashboardTab])

  const localizedSuggestions = useMemo(() => promptSuggestions.map((key) => t(key)), [t])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-foreground focus:px-4 focus:py-2 focus:text-xs focus:text-background">
        {t('landing.skip')}
      </a>

      <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
          <button type="button" onClick={() => navigate('landing')} className="flex items-center gap-2 rounded-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            <span className="grid h-8 w-8 place-items-center rounded-full border border-border bg-card shadow-sm">
              <Hexagon className="h-4 w-4 text-primary" />
            </span>
            <span className="text-sm font-semibold tracking-tight">{t('brand.name')}</span>
          </button>

          <nav className="hidden items-center gap-7 text-xs text-muted-foreground md:flex">
            <button type="button" onClick={() => openBuilder()} className="transition-colors hover:text-foreground">{t('nav.builder')}</button>
            <button type="button" onClick={openTemplates} className="transition-colors hover:text-foreground">{t('nav.templates')}</button>
            <a href="#pricing" className="transition-colors hover:text-foreground">{t('nav.pricing')}</a>
          </nav>

          <div className="flex items-center gap-2">
            <LanguageSwitcher variant="pill" compact />
            <Button variant="ghost" size="sm" onClick={() => setThemeMode(isDark ? 'light' : 'dark')} className="h-9 w-9 rounded-full p-0" aria-label={isDark ? t('nav.theme.toggleLight') : t('nav.theme.toggleDark')}>
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate('login')} className="hidden rounded-full text-xs sm:inline-flex">{t('nav.signin')}</Button>
            <Button size="sm" onClick={() => openBuilder()} className="rounded-full px-4 text-xs">{t('nav.getStarted')}</Button>
          </div>
        </div>
      </header>

      <main id="main-content">
        <section className="relative overflow-hidden px-5 pb-20 pt-28 sm:px-6 lg:px-8 lg:pb-28 lg:pt-36">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,oklch(0.75_0.12_260_/_0.16),transparent_35%),radial-gradient(circle_at_bottom_right,oklch(0.72_0.10_210_/_0.12),transparent_30%)]" />
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <motion.div {...fadeIn} className={textAlign}>
              <div className={`mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground shadow-sm ${isRtlMode ? 'flex-row-reverse' : ''}`}>
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span>{t('landing.badge')}</span>
              </div>

              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-7xl">
                {t('landing.hero.title')}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                {t('landing.hero.subtitle')}
              </p>

              <div className="mt-9 rounded-[2rem] border border-border bg-card/90 p-2 shadow-2xl shadow-primary/5">
                <div className={`flex flex-col gap-2 sm:flex-row ${isRtlMode ? 'sm:flex-row-reverse' : ''}`}>
                  <input
                    value={prompt}
                    onChange={(event) => setPrompt(event.target.value)}
                    onKeyDown={(event) => event.key === 'Enter' && openBuilder()}
                    placeholder={t('landing.hero.placeholder')}
                    className={`min-h-12 flex-1 rounded-[1.45rem] bg-transparent px-4 text-sm outline-none placeholder:text-muted-foreground/60 ${textAlign}`}
                  />
                  <Button onClick={() => openBuilder()} className="min-h-12 rounded-[1.45rem] px-6 text-sm">
                    {t('landing.hero.generate')}
                    <ArrowRight className="ms-2 h-4 w-4 rtl-flip-x" />
                  </Button>
                </div>
              </div>

              <div className={`mt-4 flex flex-wrap gap-2 ${isRtlMode ? 'justify-end' : ''}`}>
                {localizedSuggestions.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => { setPrompt(item); openBuilder(item) }}
                    className="rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, ease: 'easeOut' }} className="relative">
              <div className="rounded-[2rem] border border-border bg-card p-3 shadow-2xl shadow-primary/10">
                <div className="rounded-[1.5rem] border border-border bg-background p-4">
                  <div className="mb-5 flex items-center justify-between border-b border-border pb-4">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    </div>
                    <span className="rounded-full bg-muted px-3 py-1 text-[10px] text-muted-foreground" dir="ltr">forge.site/preview</span>
                  </div>

                  <div className={`grid gap-4 ${isRtlMode ? 'text-right' : 'text-left'}`}>
                    <div className="rounded-3xl bg-foreground p-6 text-background">
                      <div className="mb-16 flex items-center justify-between text-[10px] uppercase tracking-[0.3em] opacity-70">
                        <span>{t('landing.preview.brand')}</span>
                        <span>{t('landing.preview.status')}</span>
                      </div>
                      <h2 className="max-w-sm text-3xl font-semibold tracking-tight">{t('landing.preview.title')}</h2>
                      <div className="mt-5 flex gap-2">
                        <span className="h-9 w-24 rounded-full bg-background" />
                        <span className="h-9 w-9 rounded-full border border-background/30" />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {[Layers3, Zap, LockKeyhole].map((Icon, index) => (
                        <div key={index} className="rounded-2xl border border-border bg-muted/40 p-4">
                          <Icon className="mb-7 h-4 w-4 text-primary" />
                          <div className="h-2 rounded bg-foreground/20" />
                          <div className="mt-2 h-2 w-2/3 rounded bg-foreground/10" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -end-3 rounded-2xl border border-border bg-card p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/10"><Globe2 className="h-4 w-4 text-primary" /></span>
                  <div>
                    <p className="text-xs font-medium">{t('landing.preview.compat')}</p>
                    <p className="text-[10px] text-muted-foreground">{t('landing.preview.compatDesc')}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="border-y border-border bg-muted/25 px-5 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-3">
            {proof.map((item) => (
              <div key={item.label} className="text-center">
                <div className="text-2xl font-semibold tracking-tight">{item.value}</div>
                <div className="mt-1 text-xs text-muted-foreground">{t(item.label)}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <motion.div {...fadeIn} className={`mb-12 max-w-2xl ${textAlign}`}>
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-primary">{t('landing.section.product')}</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{t('landing.product.title')}</h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">{t('landing.product.subtitle')}</p>
            </motion.div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {productPillars.map(({ icon: Icon, title, desc }) => (
                <motion.div key={title} {...fadeIn} className={`rounded-[1.5rem] border border-border bg-card p-6 shadow-sm ${textAlign}`}>
                  <span className="mb-8 grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="text-base font-semibold">{t(title)}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{t(desc)}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-foreground px-5 py-20 text-background sm:px-6 lg:px-8 lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <motion.div {...fadeIn} className={textAlign}>
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-background/60">{t('landing.section.workflow')}</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{t('landing.workflow.title')}</h2>
              <p className="mt-4 text-sm leading-7 text-background/65">{t('landing.workflow.subtitle')}</p>
            </motion.div>
            <div className="grid gap-3">
              {workflow.map((item) => (
                <motion.div key={item.step} {...fadeIn} className={`rounded-[1.5rem] border border-background/10 bg-background/[0.06] p-5 ${textAlign}`}>
                  <div className={`flex gap-5 ${isRtlMode ? 'flex-row-reverse' : ''}`}>
                    <span className="text-sm font-mono text-background/45">{item.step}</span>
                    <div>
                      <h3 className="font-semibold">{t(item.title)}</h3>
                      <p className="mt-2 text-sm leading-6 text-background/65">{t(item.desc)}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.85fr] lg:items-center">
            <motion.div {...fadeIn} className={textAlign}>
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-primary">{t('landing.section.ready')}</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">{t('landing.ready.title')}</h2>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground">{t('landing.ready.subtitle')}</p>
              <div className={`mt-7 flex flex-wrap gap-3 ${isRtlMode ? 'justify-end' : ''}`}>
                <Button onClick={() => openBuilder()} className="rounded-full px-6">{t('cta.primary')}<ArrowRight className="ms-2 h-4 w-4 rtl-flip-x" /></Button>
                <Button variant="outline" onClick={openTemplates} className="rounded-full px-6">{t('nav.templates')}</Button>
              </div>
            </motion.div>

            <motion.div {...fadeIn} className="rounded-[2rem] border border-border bg-card p-6 shadow-xl shadow-primary/5">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{t('landing.ready.cardTitle')}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{t('landing.ready.cardDesc')}</p>
                </div>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">{t('landing.ready.badge')}</span>
              </div>
              <ul className="space-y-3">
                {checklist.map((key) => (
                  <li key={key} className={`flex items-center gap-3 text-sm ${isRtlMode ? 'flex-row-reverse text-right' : ''}`}>
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-primary/10 text-primary"><Check className="h-3.5 w-3.5" /></span>
                    <span>{t(key)}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border px-5 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div className={`flex items-center gap-2 ${isRtlMode ? 'flex-row-reverse' : ''}`}>
            <Hexagon className="h-4 w-4 text-primary" />
            <span>{t('footer.rights')}</span>
          </div>
          <div className={`flex gap-5 ${isRtlMode ? 'flex-row-reverse' : ''}`}>
            <span>{t('footer.privacy')}</span>
            <span>{t('footer.terms')}</span>
            <span>{t('footer.support')}</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
