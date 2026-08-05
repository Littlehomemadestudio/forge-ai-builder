'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { useAppStore } from '@/lib/store'
import { isRtl } from '@/lib/i18n'
import { useTranslation } from '@/lib/useTranslation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import {
  Sparkles, Sun, Moon, ArrowRight, Zap, Shield, MousePointerClick,
  Github, Twitter, Linkedin, Hexagon, Eye, Globe, LayoutGrid, Users,
  Code2, Download, Rocket, Paintbrush, Layers, Check, Menu, X,
  Star, Clock, TrendingUp, Monitor, Smartphone, HelpCircle,
} from 'lucide-react'

// Lazy-load the interactive AI demo (heavy, client-only)
const AIDemo = dynamic(
  () => import('@/components/landing/AIDemo').then((m) => ({ default: m.AIDemo })),
  { ssr: false }
)

// ─── Shared animation ───────────────────────────────────────────────────
const sectionFadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, ease: 'easeOut' },
}

// ─── Animated counter (deterministic, no Math.random) ───────────────────
function AnimatedCounter({
  target,
  suffix = '',
  duration = 2000,
}: {
  target: number
  suffix?: string
  duration?: number
}) {
  const [count, setCount] = useState(0)
  const [triggered, setTriggered] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered) {
          setTriggered(true)
          const startTime = performance.now()
          const animate = (now: number) => {
            const elapsed = now - startTime
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(target * eased))
            if (progress < 1) requestAnimationFrame(animate)
          }
          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [triggered, target, duration])

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

// ─── Aurora background — soft indigo→violet→fuchsia blobs ───────────────
function AuroraBackground({ isDark }: { isDark: boolean }) {
  const o1 = isDark ? 0.18 : 0.10
  const o2 = isDark ? 0.12 : 0.06
  const o3 = isDark ? 0.08 : 0.04
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute top-[8%] left-[6%] h-72 w-72 rounded-full animate-morph"
        style={{
          background: `radial-gradient(circle, oklch(0.55 0.28 280 / ${o1}), oklch(0.5 0.25 250 / ${o2}), transparent 70%)`,
          animationDelay: '-3s',
        }}
      />
      <div
        className="absolute top-[40%] right-[4%] h-80 w-80 rounded-full animate-morph"
        style={{
          background: `radial-gradient(circle, oklch(0.6 0.25 320 / ${o1}), oklch(0.55 0.25 290 / ${o2}), transparent 70%)`,
          animationDelay: '-7s',
        }}
      />
      <div
        className="absolute bottom-[6%] left-[40%] h-64 w-64 rounded-full animate-morph"
        style={{
          background: `radial-gradient(circle, oklch(0.55 0.25 265 / ${o3}), transparent 70%)`,
          animationDelay: '-11s',
        }}
      />
    </div>
  )
}

const TRUST_LOGOS = ['TechFlow', 'DesignLab', 'CloudNine', 'DataPulse', 'NovaSoft', 'PixelCraft']
// ─── Main component ─────────────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useAppStore((s) => s.navigate)
  const setBuilderPrompt = useAppStore((s) => s.setBuilderPrompt)
  const setDashboardTab = useAppStore((s) => s.setDashboardTab)
  const themeMode = useAppStore((s) => s.themeMode)
  const setThemeMode = useAppStore((s) => s.setThemeMode)
  const uiLanguage = useAppStore((s) => s.uiLanguage)
  const isAuthenticated = useAppStore((s) => s.isAuthenticated)
  const t = useTranslation()

  const [promptValue, setPromptValue] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isDark = themeMode === 'dark'
  const isRtlMode = isRtl(uiLanguage)
  const textAlignClass = isRtlMode ? 'text-right' : 'text-left'

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  const toggleTheme = useCallback(() => {
    setThemeMode(isDark ? 'light' : 'dark')
  }, [isDark, setThemeMode])

  const handleGenerate = useCallback(() => {
    if (!promptValue.trim()) return
    setBuilderPrompt(promptValue)
    navigate(isAuthenticated ? 'builder' : 'login')
  }, [promptValue, setBuilderPrompt, navigate, isAuthenticated])

  const handleGetStarted = useCallback(() => {
    navigate(isAuthenticated ? 'builder' : 'login')
  }, [navigate, isAuthenticated])

  const scrollToPricing = useCallback(() => {
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const goTemplates = useCallback(() => {
    setDashboardTab('templates')
    navigate(isAuthenticated ? 'dashboard' : 'login')
  }, [setDashboardTab, navigate, isAuthenticated])

  const localizedStats = [
    { value: 2500, suffix: '+', label: 'stats.sitesBuilt', icon: Globe },
    { value: 15000, suffix: '+', label: 'stats.pagesGenerated', icon: LayoutGrid },
    { value: 99, suffix: '.9%', label: 'stats.uptime', icon: Shield },
    { value: 50, suffix: '+', label: 'stats.countries', icon: Users },
  ]

  const localizedFeatures = [
    { icon: Sparkles, titleKey: 'features.ai.title', descKey: 'features.ai.desc' },
    { icon: Paintbrush, titleKey: 'features.editor.title', descKey: 'features.editor.desc' },
    { icon: Download, titleKey: 'features.export.title', descKey: 'features.export.desc' },
    { icon: Rocket, titleKey: 'features.deploy.title', descKey: 'features.deploy.desc' },
  ]

  const localizedSteps = [
    { number: '1', titleKey: 'how.step1.title', descKey: 'how.step1.desc', icon: MousePointerClick, bullets: [{ icon: Monitor, key: 'how.step1.bullet1' }, { icon: Smartphone, key: 'how.step1.bullet2' }] },
    { number: '2', titleKey: 'how.step2.title', descKey: 'how.step2.desc', icon: Zap, bullets: [{ icon: Code2, key: 'how.step2.bullet1' }, { icon: Layers, key: 'how.step2.bullet2' }] },
    { number: '3', titleKey: 'how.step3.title', descKey: 'how.step3.desc', icon: Rocket, bullets: [{ icon: Download, key: 'how.step3.bullet1' }, { icon: Rocket, key: 'how.step3.bullet2' }] },
  ]

  const localizedTestimonials = [
    { id: '1', avatar: 'SC', metricIcon: Clock },
    { id: '2', avatar: 'MR', metricIcon: TrendingUp, featured: true },
    { id: '3', avatar: 'AP', metricIcon: Globe },
  ]

  const pricingTiers = [
    { key: 'free', features: ['pricing.free.f1', 'pricing.free.f2', 'pricing.free.f3'] },
    { key: 'pro', features: ['pricing.pro.f1', 'pricing.pro.f2', 'pricing.pro.f3', 'pricing.pro.f4'], highlighted: true },
    { key: 'enterprise', features: ['pricing.enterprise.f1', 'pricing.enterprise.f2', 'pricing.enterprise.f3', 'pricing.enterprise.f4'] },
  ]

  const localizedPills = [
    t('hero.suggestion.saas'),
    t('hero.suggestion.portfolio'),
    t('hero.suggestion.restaurant'),
    t('hero.suggestion.ecommerce'),
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Skip to content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md focus:text-sm"
      >
        Skip to content
      </a>
      {/* ─── Navbar ────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-5 sm:px-6">
          <div className="flex items-center gap-2">
            <Hexagon className="h-5 w-5 text-primary" />
            <span className="gradient-text text-sm font-bold">{t('brand.name')}</span>
          </div>

          <div className="hidden items-center gap-6 md:flex">
            <button onClick={handleGetStarted} className="rounded text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">{t('nav.builder')}</button>
            <button onClick={goTemplates} className="rounded text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">{t('nav.templates')}</button>
            <button onClick={scrollToPricing} className="rounded text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">{t('nav.pricing')}</button>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <LanguageSwitcher variant="pill" compact />
            <Button variant="ghost" size="sm" onClick={toggleTheme} className="h-9 w-9 p-0" title={isDark ? t('nav.theme.toggleLight') : t('nav.theme.toggleDark')} aria-label="Toggle theme">
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate('login')} className="text-xs">{t('nav.signin')}</Button>
            <Button size="sm" onClick={handleGetStarted} className="border-0 bg-gradient-to-r from-blue-500 to-violet-500 text-xs text-white shadow-md shadow-violet-500/15 hover:from-blue-600 hover:to-violet-600">{t('nav.getStarted')}</Button>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <Button variant="ghost" size="sm" onClick={toggleTheme} className="h-9 w-9 p-0" aria-label="Toggle theme">
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="h-9 w-9 p-0" aria-label="Menu">
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-border/50 bg-background/95 backdrop-blur-md md:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-4">
              <button onClick={() => { handleGetStarted(); setMobileMenuOpen(false) }} className="py-2 text-start text-sm text-muted-foreground transition-colors hover:text-foreground">{t('nav.builder')}</button>
              <button onClick={() => { goTemplates(); setMobileMenuOpen(false) }} className="py-2 text-start text-sm text-muted-foreground transition-colors hover:text-foreground">{t('nav.templates')}</button>
              <button onClick={() => { scrollToPricing(); setMobileMenuOpen(false) }} className="py-2 text-start text-sm text-muted-foreground transition-colors hover:text-foreground">{t('nav.pricing')}</button>
              <Separator />
              <Button variant="ghost" onClick={() => { navigate('login'); setMobileMenuOpen(false) }} className="justify-start text-sm">{t('nav.signin')}</Button>
              <Button onClick={() => { handleGetStarted(); setMobileMenuOpen(false) }} className="border-0 bg-gradient-to-r from-blue-500 to-violet-500 text-sm text-white hover:from-blue-600 hover:to-violet-600">{t('nav.getStarted')}</Button>
            </div>
          </div>
        )}
      </nav>

      <main id="main-content" className="flex-1">
        {/* ─── Hero ─────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-28 pb-16 sm:pt-32 md:pt-40 md:pb-24">
          <AuroraBackground isDark={isDark} />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          <div className="relative z-10 mx-auto max-w-3xl px-5 text-center sm:px-6">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Badge className="mb-6 gap-1.5 rounded-full border-primary/20 bg-primary/10 px-3 py-1 text-[11px] text-primary">
                <Sparkles className="h-3 w-3" /> {t('hero.badge')}
              </Badge>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                {t('hero.title.pre')}{' '}
                <span className="gradient-text">{t('hero.title.highlight')}</span>
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
                {t('hero.subtitle')}
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }} className="mt-8">
              <div className={`flex flex-wrap items-center gap-3 rounded-2xl border border-border/60 bg-card/80 p-3 shadow-xl shadow-primary/5 backdrop-blur-sm focus-within:border-primary/40 sm:flex-nowrap ${isRtlMode ? 'rtl:flex-row-reverse' : ''}`}>
                <Sparkles className="h-5 w-5 shrink-0 text-primary" />
                <input
                  value={promptValue}
                  onChange={(e) => setPromptValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                  placeholder={t('hero.placeholder')}
                  className={`min-h-12 flex-1 rounded-xl bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground/60 ${textAlignClass}`}
                />
                <Button onClick={handleGenerate} className="h-11 shrink-0 rounded-xl border-0 bg-gradient-to-r from-blue-500 to-violet-500 px-5 text-xs text-white shadow-lg shadow-violet-500/20 hover:from-blue-600 hover:to-violet-600">
                  {t('hero.generate')} <ArrowRight className="ms-1 h-3.5 w-3.5 rtl-flip-x" />
                </Button>
              </div>
              <div className={`mt-3 flex flex-wrap justify-center gap-2 ${isRtlMode ? 'rtl:flex-row-reverse' : ''}`}>
                {localizedPills.map((pill) => (
                  <motion.button
                    key={pill}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => { setPromptValue(pill); setBuilderPrompt(pill); navigate(isAuthenticated ? 'builder' : 'login') }}
                    className="rounded-full border border-border/50 bg-secondary/50 px-4 py-2 text-[11px] text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
                  >
                    {pill}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }} className="relative z-10 mx-auto mt-12 max-w-4xl px-5 sm:px-6">
            <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-2xl shadow-primary/10">
              <div className="flex items-center gap-2 border-b border-border/50 bg-secondary/40 px-4 py-2.5">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
                </div>
                <div className="flex h-5 flex-1 items-center rounded-md bg-background px-2">
                  <span className="font-mono text-[9px] text-muted-foreground" dir="ltr">{t('hero.preview.getUrl')}</span>
                </div>
              </div>
              <div className="relative aspect-[16/9] bg-gradient-to-br from-violet-600/15 via-blue-500/10 to-indigo-600/15">
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
                  <div className="inline-flex items-center gap-2 rounded-lg bg-background/60 px-3 py-1.5 backdrop-blur-sm">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                    <span className="text-[11px] font-medium text-foreground/80">AI Generated Preview</span>
                  </div>
                  <div className="h-4 w-2/3 rounded bg-foreground/15" />
                  <div className="h-3 w-1/2 rounded bg-foreground/10" />
                  <div className="mt-2 grid w-full max-w-sm grid-cols-3 gap-3">
                    <div className="h-12 rounded-lg bg-foreground/10" />
                    <div className="h-12 rounded-lg bg-foreground/10" />
                    <div className="h-12 rounded-lg bg-foreground/10" />
                  </div>
                  <div className="mt-2 h-8 w-28 rounded-full bg-gradient-to-r from-blue-500 to-violet-500" />
                </div>
              </div>
            </div>
          </motion.div>
        </section>
        {/* ─── Trust ───────────────────────────────────────────────── */}
        <section className="border-y border-border/40 py-8">
          <div className="mx-auto max-w-7xl px-5 sm:px-6">
            <p className="mb-5 text-center text-[11px] uppercase tracking-[0.25em] text-muted-foreground/70">{t('trust.title')}</p>
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-60">
              {TRUST_LOGOS.map((name) => (
                <span key={name} className="text-sm font-semibold tracking-tight text-muted-foreground">{name}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Stats ───────────────────────────────────────────────── */}
        <section className="py-14 md:py-20">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/60 md:grid-cols-4">
            {localizedStats.map((s) => {
              const Icon = s.icon
              return (
                <div key={s.label} className="flex flex-col items-center gap-2 bg-background p-6 text-center">
                  <Icon className="h-5 w-5 text-primary" />
                  <div className="text-2xl font-semibold tracking-tight sm:text-3xl">
                    <AnimatedCounter target={s.value} suffix={s.suffix} />
                  </div>
                  <div className="text-[11px] text-muted-foreground">{t(s.label)}</div>
                </div>
              )
            })}
          </div>
        </section>

        {/* ─── Features ────────────────────────────────────────────── */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6">
            <motion.div {...sectionFadeIn} className={`mx-auto mb-12 max-w-2xl ${textAlignClass}`}>
              <Badge className="mb-3 gap-1.5 rounded-full border-primary/20 bg-primary/10 px-3 py-1 text-[11px] text-primary">
                <Zap className="h-3 w-3" /> {t('features.badge')}
              </Badge>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {t('features.title.pre')}{' '}
                <span className="gradient-text">{t('features.title.highlight')}</span>
              </h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">{t('features.subtitle')}</p>
            </motion.div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {localizedFeatures.map((f) => {
                const Icon = f.icon
                return (
                  <motion.div key={f.titleKey} {...sectionFadeIn} className="group rounded-2xl border border-border/60 bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                    <div className="mb-5 grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-blue-500/15 to-violet-500/15 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-base font-semibold">{t(f.titleKey)}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{t(f.descKey)}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>
        {/* ─── How it works ────────────────────────────────────────── */}
        <section className="border-y border-border/40 bg-secondary/20 py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6">
            <motion.div {...sectionFadeIn} className="mx-auto mb-14 max-w-2xl text-center">
              <Badge className="mb-3 gap-1.5 rounded-full border-primary/20 bg-primary/10 px-3 py-1 text-[11px] text-primary">
                <Eye className="h-3 w-3" /> {t('how.badge')}
              </Badge>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {t('how.title.pre')}{' '}
                <span className="gradient-text">{t('how.title.highlight')}</span>
              </h2>
            </motion.div>

            <div className="relative grid gap-8 md:grid-cols-3">
              <div className="absolute left-0 right-0 top-9 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block" />
              {localizedSteps.map((step) => {
                const Icon = step.icon
                return (
                  <motion.div key={step.number} {...sectionFadeIn} className="relative rounded-2xl border border-border/60 bg-card p-6">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-sm font-semibold text-white shadow-md shadow-violet-500/20">{step.number}</div>
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-base font-semibold">{t(step.titleKey)}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{t(step.descKey)}</p>
                    <ul className="mt-4 space-y-2">
                      {step.bullets.map((b) => {
                        const BIcon = b.icon
                        return (
                          <li key={b.key} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <BIcon className="h-3.5 w-3.5 text-primary" /> {t(b.key)}
                          </li>
                        )
                      })}
                    </ul>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ─── AI Demo ─────────────────────────────────────────────── */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-5xl px-5 sm:px-6">
            <motion.div {...sectionFadeIn} className={`mx-auto mb-10 max-w-2xl ${textAlignClass}`}>
              <Badge className="mb-3 gap-1.5 rounded-full border-primary/20 bg-primary/10 px-3 py-1 text-[11px] text-primary">
                <Sparkles className="h-3 w-3" /> {t('aidemo.badge')}
              </Badge>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {t('aidemo.title.pre')}{' '}
                <span className="gradient-text">{t('aidemo.title.highlight')}</span>
              </h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">{t('aidemo.subtitle')}</p>
            </motion.div>
            <motion.div {...sectionFadeIn} className="overflow-hidden rounded-2xl border border-border/60 bg-card p-4 shadow-xl shadow-primary/5 sm:p-6">
              <AIDemo isDark={isDark} />
            </motion.div>
          </div>
        </section>
        {/* ─── Testimonials ────────────────────────────────────────── */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6">
            <motion.div {...sectionFadeIn} className="mx-auto mb-12 max-w-2xl text-center">
              <Badge className="mb-3 gap-1.5 rounded-full border-primary/20 bg-primary/10 px-3 py-1 text-[11px] text-primary">
                <Star className="h-3 w-3" /> {t('testimonials.badge')}
              </Badge>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {t('testimonials.title.pre')}{' '}
                <span className="gradient-text">{t('testimonials.title.highlight')}</span>
              </h2>
            </motion.div>

            <div className="grid gap-5 md:grid-cols-3">
              {localizedTestimonials.map((tm) => {
                const MetricIcon = tm.metricIcon
                const featured = tm.featured
                return (
                  <Card key={tm.id} className={`relative overflow-hidden ${featured ? 'border-primary/30 shadow-lg shadow-primary/10 md:scale-[1.03]' : 'border-border/60'}`}>
                    {featured && <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-blue-500 to-violet-500" />}
                    <CardContent className="p-6">
                      <div className="mb-3 flex items-center gap-2">
                        <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-[10px] font-bold text-white">{tm.avatar}</div>
                        <div>
                          <div className="text-xs font-medium text-foreground">{t(`testimonials.${tm.id}.name`)}</div>
                          <div className="text-[10px] text-muted-foreground">{t(`testimonials.${tm.id}.role`)}</div>
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">&ldquo;{t(`testimonials.${tm.id}.quote`)}&rdquo;</p>
                      <div className="mt-4 flex items-center gap-1.5 text-[10px] text-primary">
                        <MetricIcon className="h-3.5 w-3.5" /> {t(`testimonials.${tm.id}.metric`)}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* ─── Pricing ─────────────────────────────────────────────── */}
        <section id="pricing" className="border-y border-border/40 bg-secondary/20 py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6">
            <motion.div {...sectionFadeIn} className="mx-auto mb-12 max-w-2xl text-center">
              <Badge className="mb-3 gap-1.5 rounded-full border-primary/20 bg-primary/10 px-3 py-1 text-[11px] text-primary">
                <Zap className="h-3 w-3" /> {t('pricing.badge')}
              </Badge>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {t('pricing.title.pre')}{' '}
                <span className="gradient-text">{t('pricing.title.highlight')}</span>
              </h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">{t('pricing.subtitle')}</p>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-3">
              {pricingTiers.map((tier) => {
                const highlighted = tier.highlighted
                return (
                  <Card key={tier.key} className={`relative overflow-hidden ${highlighted ? 'border-primary/40 shadow-xl shadow-primary/10 md:scale-[1.04]' : 'border-border/60'}`}>
                    {highlighted && <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-violet-500" />}
                    {highlighted && <Badge className="absolute right-4 top-4 border-0 bg-gradient-to-r from-blue-500 to-violet-500 px-2 py-0.5 text-[9px] text-white">{t('pricing.pro.popular')}</Badge>}
                    <CardContent className="p-6">
                      <h3 className="text-base font-bold text-foreground">{t(`pricing.${tier.key}.name`)}</h3>
                      <div className="mt-2 flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-foreground">{t(`pricing.${tier.key}.price`)}</span>
                        <span className="text-xs text-muted-foreground">{t(`pricing.${tier.key}.period`)}</span>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">{t(`pricing.${tier.key}.desc`)}</p>
                      <Separator className="my-4" />
                      <ul className="space-y-2.5">
                        {tier.features.map((fKey) => (
                          <li key={fKey} className="flex items-center gap-2 text-xs text-foreground">
                            <Check className={`h-3.5 w-3.5 ${highlighted ? 'text-primary' : 'text-muted-foreground'}`} />
                            {t(fKey)}
                          </li>
                        ))}
                      </ul>
                      <Button
                        onClick={handleGetStarted}
                        variant={highlighted ? 'default' : 'outline'}
                        className={`mt-6 w-full text-xs ${highlighted ? 'border-0 bg-gradient-to-r from-blue-500 to-violet-500 text-white hover:from-blue-600 hover:to-violet-600' : ''}`}
                      >
                        {t(`pricing.${tier.key}.cta`)}
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>
        {/* ─── FAQ ─────────────────────────────────────────────────── */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-3xl px-5 sm:px-6">
            <motion.div {...sectionFadeIn} className="mb-10 text-center">
              <Badge className="mb-3 gap-1.5 rounded-full border-primary/20 bg-primary/10 px-3 py-1 text-[11px] text-primary">
                <HelpCircle className="h-3 w-3" /> {t('faq.badge')}
              </Badge>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {t('faq.title.pre')}{' '}
                <span className="gradient-text">{t('faq.title.highlight')}</span>
              </h2>
            </motion.div>
            <Accordion type="single" collapsible className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="rounded-lg border border-border/50 px-4 transition-colors data-[state=open]:border-primary/30 data-[state=open]:bg-primary/5">
                  <AccordionTrigger className="py-4 text-sm font-medium text-foreground hover:no-underline">
                    {t(`faq.${i}.q`)}
                  </AccordionTrigger>
                  <AccordionContent className="text-xs leading-relaxed text-muted-foreground">
                    {t(`faq.${i}.a`)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* ─── CTA ──────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden py-20 md:py-28">
          <AuroraBackground isDark={isDark} />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/8 via-violet-500/8 to-transparent" />
          <div className="relative z-10 mx-auto max-w-3xl px-5 text-center sm:px-6">
            <motion.div {...sectionFadeIn}>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
                {t('cta.title.pre')}{' '}
                <span className="gradient-text">{t('cta.title.highlight')}</span>
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">{t('cta.subtitle')}</p>
              <div className={`mt-8 flex flex-wrap justify-center gap-3 ${isRtlMode ? 'rtl:flex-row-reverse' : ''}`}>
                <Button onClick={handleGetStarted} className="h-12 rounded-xl border-0 bg-gradient-to-r from-blue-500 to-violet-500 px-7 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 hover:from-blue-600 hover:to-violet-600">
                  {t('cta.primary')} <ArrowRight className="ms-1.5 h-4 w-4 rtl-flip-x" />
                </Button>
                <Button variant="outline" onClick={() => navigate('login')} className="h-12 rounded-xl px-7 text-sm">
                  {t('cta.secondary')}
                </Button>
              </div>
              <ul className="mx-auto mt-8 flex max-w-xl flex-wrap justify-center gap-x-6 gap-y-2">
                {['how.step3.bullet1', 'how.step3.bullet2', 'how.step2.bullet1', 'how.step1.bullet2'].map((key) => (
                  <li key={key} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Check className="h-3.5 w-3.5 text-primary" /> {t(key)}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>
      </main>

      {/* ─── Footer ─────────────────────────────────────────────────── */}
      <footer className="border-t border-border/60 bg-secondary/20">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6">
          <div className={`grid grid-cols-2 gap-8 md:grid-cols-4 ${isRtlMode ? 'rtl:text-right' : ''}`}>
            <div className="col-span-2 md:col-span-1">
              <div className="mb-3 flex items-center gap-2">
                <Hexagon className="h-5 w-5 text-primary" />
                <span className="gradient-text text-sm font-bold">{t('brand.name')}</span>
              </div>
              <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">{t('footer.tagline')}</p>
            </div>
            <div>
              <h4 className="mb-3 text-xs font-semibold text-foreground">{t('footer.product')}</h4>
              <div className="space-y-2">
                <button onClick={handleGetStarted} className="block text-xs text-muted-foreground transition-colors hover:text-primary">{t('nav.builder')}</button>
                <button onClick={goTemplates} className="block text-xs text-muted-foreground transition-colors hover:text-primary">{t('nav.templates')}</button>
                <button onClick={scrollToPricing} className="block text-xs text-muted-foreground transition-colors hover:text-primary">{t('nav.pricing')}</button>
              </div>
            </div>
            <div>
              <h4 className="mb-3 text-xs font-semibold text-foreground">{t('footer.resources')}</h4>
              <div className="space-y-2">
                {[t('footer.docs'), t('footer.blog'), t('footer.changelog'), t('footer.support')].map((item) => (
                  <span key={item} className="block cursor-default text-xs text-muted-foreground transition-colors hover:text-primary/70">{item}</span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="mb-3 text-xs font-semibold text-foreground">{t('footer.company')}</h4>
              <div className="space-y-2">
                {[t('footer.about'), t('footer.careers'), t('footer.privacy'), t('footer.terms')].map((item) => (
                  <span key={item} className="block cursor-default text-xs text-muted-foreground transition-colors hover:text-primary/70">{item}</span>
                ))}
              </div>
            </div>
          </div>
          <Separator className="my-6" />
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <span className="text-xs text-muted-foreground">{t('footer.rights')}</span>
            <div className="flex items-center gap-3">
              <a href="#" aria-label="GitHub" className="grid h-9 w-9 place-items-center rounded-md text-muted-foreground transition-colors hover:text-primary"><Github className="h-4 w-4" /></a>
              <a href="#" aria-label="Twitter" className="grid h-9 w-9 place-items-center rounded-md text-muted-foreground transition-colors hover:text-primary"><Twitter className="h-4 w-4" /></a>
              <a href="#" aria-label="LinkedIn" className="grid h-9 w-9 place-items-center rounded-md text-muted-foreground transition-colors hover:text-primary"><Linkedin className="h-4 w-4" /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}