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
  Code2,
  Layers,
  Monitor,
  Smartphone,
  Check,
  Menu,
  X,
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
  const [promptValue, setPromptValue] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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

      {/* ─── Navbar ────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hexagon className="w-5 h-5 text-primary" />
            <span className="font-bold text-sm gradient-text">{t('brand.name')}</span>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <button onClick={handleGetStarted} className="text-xs text-muted-foreground hover:text-foreground transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded">{t('nav.builder')}</button>
            <button onClick={() => { setDashboardTab('templates'); navigate('dashboard') }} className="text-xs text-muted-foreground hover:text-foreground transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded">{t('nav.templates')}</button>
            <button onClick={handleGetStarted} className="text-xs text-muted-foreground hover:text-foreground transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded">{t('nav.pricing')}</button>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <LanguageSwitcher variant="pill" compact />
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="w-10 h-10 p-0 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              title={isDark ? t('nav.theme.toggleLight') : t('nav.theme.toggleDark')}
            >
              {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('login')}
              className="text-xs text-muted-foreground min-h-[44px] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              {t('nav.signin')}
            </Button>
            <Button
              size="sm"
              onClick={handleGetStarted}
              className="text-xs bg-gradient-to-r from-blue-500 to-violet-500 text-white hover:from-blue-600 hover:to-violet-600 border-0 min-h-[44px] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              {t('nav.getStarted')}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate('login')} className="hidden rounded-full text-xs sm:inline-flex">{t('nav.signin')}</Button>
            <Button size="sm" onClick={() => openBuilder()} className="rounded-full px-4 text-xs">{t('nav.getStarted')}</Button>
          </div>
          {/* Mobile: hamburger + theme toggle */}
          <div className="flex sm:hidden items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="w-10 h-10 p-0 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              title={isDark ? t('nav.theme.toggleLight') : t('nav.theme.toggleDark')}
            >
              {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-10 h-10 p-0 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
        {/* Mobile slide-down menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-border/50 bg-background/95 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-3">
              <button onClick={() => { handleGetStarted(); setMobileMenuOpen(false) }} className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left py-2 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded">{t('nav.builder')}</button>
              <button onClick={() => { setDashboardTab('templates'); navigate('dashboard'); setMobileMenuOpen(false) }} className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left py-2 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded">{t('nav.templates')}</button>
              <button onClick={() => { handleGetStarted(); setMobileMenuOpen(false) }} className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left py-2 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded">{t('nav.pricing')}</button>
              <Separator />
              <Button
                variant="ghost"
                onClick={() => { navigate('login'); setMobileMenuOpen(false) }}
                className="text-sm text-muted-foreground min-h-[44px] justify-start focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                {t('nav.signin')}
              </Button>
              <Button
                onClick={() => { handleGetStarted(); setMobileMenuOpen(false) }}
                className="text-sm bg-gradient-to-r from-blue-500 to-violet-500 text-white hover:from-blue-600 hover:to-violet-600 border-0 min-h-[44px] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                {t('nav.getStarted')}
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* ─── Main Content ──────────────────────────────────────────── */}
      <div id="main-content">

        {/* ─── Hero Section — Centered, professional like z.ai ────────── */}
        <section className="relative overflow-hidden pt-16 sm:pt-24 pb-12 md:pt-32 md:pb-16 flex flex-col items-center justify-center min-h-[50vh]">
          <AbstractBackground isDark={isDark} />

          {/* Blue-to-violet gradient accent line at top */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-violet-500 to-blue-500 opacity-50" />

          {/* Additional gradient wash */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-violet-500/8 to-blue-500/3 pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
            <motion.div {...sectionFadeIn}>
              <Badge className="bg-gradient-to-r from-blue-500/10 to-violet-500/10 text-violet-500 border-violet-500/20 text-[10px] px-3 py-1 mx-auto">
                <Sparkles className="w-3 h-3 me-1" /> {t('hero.badge')}
              </Badge>

              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-7xl">
                {t('landing.hero.title')}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                {t('landing.hero.subtitle')}
              </p>

              {/* Professional prompt input — centered, full width */}
              <div className="mt-8 w-full">
                <div className={`flex flex-wrap sm:flex-nowrap items-center gap-3 p-3 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/60 shadow-xl shadow-blue-500/5 transition-all duration-300 focus-within:border-blue-500/40 focus-within:shadow-blue-500/10 ${isRtlMode ? 'rtl:flex-row-reverse' : ''}`}>
                  <Sparkles className="w-5 h-5 text-violet-500 shrink-0" />
                  <input
                    value={prompt}
                    onChange={(event) => setPrompt(event.target.value)}
                    onKeyDown={(event) => event.key === 'Enter' && openBuilder()}
                    placeholder={t('landing.hero.placeholder')}
                    className={`min-h-12 flex-1 rounded-[1.45rem] bg-transparent px-4 text-sm outline-none placeholder:text-muted-foreground/60 ${textAlign}`}
                  />
                  <Button
                    onClick={handleGenerate}
                    size="sm"
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-violet-500 text-white hover:from-blue-600 hover:to-violet-600 border-0 text-xs px-5 h-11 rounded-xl shadow-lg shadow-violet-500/20 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 shrink-0"
                  >
                    {t('hero.generate')} <ArrowRight className="w-3 h-3 ms-1 rtl-flip-x" />
                  </Button>
                </div>
              </div>

              {/* Suggestion pills */}
              <div className={`flex flex-wrap justify-center gap-2 mt-4 ${isRtlMode ? 'rtl:flex-row-reverse' : ''}`}>
                {localizedPills.map((pill) => (
                  <motion.button
                    key={pill}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { setPromptValue(pill); setBuilderPrompt(pill); if (!isAuthenticated) { navigate('login'); return; } navigate('builder') }}
                    className="text-[11px] text-muted-foreground px-4 py-2.5 rounded-full bg-secondary/50 border border-border/50 hover:border-blue-500/30 hover:text-violet-500 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
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
              <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 shadow-lg shadow-violet-500/30 animate-pulse" />
              <div className="absolute -bottom-2 -left-2 w-4 h-4 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 shadow-md shadow-blue-500/20 animate-pulse" style={{ animationDelay: '-1.5s' }} />
            </div>
          </motion.div>
        </section>

        {/* ─── Trust Logos / Social Proof ──────────────────────────── */}
        <section className="py-6 border-y border-border/30">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-[10px] text-muted-foreground opacity-50 text-center mb-3">{t('trust.title')}</p>
            <div className={`flex flex-wrap items-center justify-center gap-6 md:gap-10 ${isRtlMode ? 'rtl:flex-row-reverse' : ''}`}>
              {TRUST_LOGOS.map((name) => (
                <span key={name} className="text-xs font-semibold text-muted-foreground opacity-50 hover:opacity-70 transition-opacity tracking-wide">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Stats Bar ───────────────────────────────────────────── */}
        <section className="relative py-8 overflow-hidden border-y border-blue-500/15">
          {/* Blue-to-violet gradient strip */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-violet-500/8 to-blue-500/10" />

          <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {localizedStats.map((stat, i) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className={`flex items-center gap-2 sm:gap-4 ${i > 0 ? 'md:border-s md:border-border/50 md:ps-6 rtl:md:border-e rtl:md:border-s-0 rtl:md:ps-0 rtl:md:pe-6' : ''}`}>
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500/10 to-violet-500/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-violet-500" />
                  </div>
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

            {/* Testimonial cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {localizedTestimonials.map((tm, i) => {
                const MetricIcon = tm.metricIcon
                const isFeatured = tm.featured
                return (
                  <Card key={tm.id} className={`group relative overflow-hidden border-border/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:shadow-blue-500/5 bg-card/80 backdrop-blur-md ${isFeatured ? 'border-blue-500/20 shadow-md' : ''}`}>
                    <CardContent className={`${isFeatured ? 'p-8' : 'p-5'}`}>
                      <div className="flex gap-0.5 mb-3">
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} className="w-3 h-3 fill-[oklch(0.75_0.15_80)] text-[oklch(0.75_0.15_80)]" />
                        ))}
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white bg-gradient-to-br from-blue-500 to-violet-500">
                          {tm.avatar}
                        </div>
                        <div>
                          <div className="text-xs font-medium text-foreground">{t(`testimonials.${tm.id}.name`)}</div>
                          <div className="text-[10px] text-muted-foreground">{t(`testimonials.${tm.id}.role`)}</div>
                        </div>
                      </div>
                      <p className={`${isFeatured ? 'text-sm' : 'text-xs'} text-muted-foreground leading-relaxed mb-3`}>&ldquo;{t(`testimonials.${tm.id}.quote`)}&rdquo;</p>
                      <div className="flex items-center gap-1.5 text-[10px] text-violet-500">
                        <MetricIcon className="w-3 h-3" />
                        {t(`testimonials.${tm.id}.metric`)}
                      </div>
                    </CardContent>
                    <div className="absolute bottom-0 inset-x-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-blue-500 to-violet-500" />
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* ─── Pricing Section ────────────────────────────────────── */}
        <section className="relative py-16 md:py-24 lg:py-28 bg-background overflow-hidden">
          {/* Blue-to-violet gradient top */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-blue-500/30 via-violet-500/30 to-blue-500/30" />
          {/* Subtle gradient wash */}
          <div className="absolute inset-0 bg-gradient-to-b from-violet-500/3 via-transparent to-blue-500/2 pointer-events-none" />

          <div className="relative z-10 max-w-7xl mx-auto px-6">
            <motion.div
              {...sectionFadeIn}
              viewport={{ once: true, margin: '-50px' }}
              whileInView={{ opacity: 1, y: 0 }}
              className={`${textAlignClass} mb-10`}
            >
              <Badge className="text-[10px] mb-3 bg-gradient-to-r from-blue-500/10 to-violet-500/10 text-violet-500 border-violet-500/20 border">
                <Zap className="w-3 h-3 me-1" /> {t('pricing.badge')}
              </Badge>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                {t('pricing.title.pre')}{' '}
                <span className="gradient-text">{t('pricing.title.highlight')}</span>
              </h2>
              <p className="text-xs text-muted-foreground max-w-md">
                {t('pricing.subtitle')}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {pricingTiers.map((tier) => {
                const isHighlighted = tier.highlighted
                return (
                  <Card key={tier.key} className={`relative overflow-hidden transition-all duration-300 ${isHighlighted ? 'border-blue-500/30 shadow-lg shadow-violet-500/10 md:scale-[1.02] mobile-no-scale bg-gradient-to-b from-blue-500/5 to-violet-500/5' : 'border-border/50'}`}>
                    {isHighlighted && (
                      <Badge className="absolute top-4 right-4 rtl:right-auto rtl:left-4 bg-gradient-to-r from-blue-500 to-violet-500 text-white text-[9px] px-2 py-0.5 border-0">
                        {t('pricing.pro.popular')}
                      </Badge>
                    )}
                    <CardContent className={`p-6 ${isHighlighted ? 'pb-8' : ''}`}>
                      <h3 className="text-sm font-bold text-foreground">{t(`pricing.${tier.key}.name`)}</h3>
                      <div className="flex items-baseline gap-1 mt-2">
                        <span className="text-2xl font-bold text-foreground">{t(`pricing.${tier.key}.price`)}</span>
                        <span className="text-xs text-muted-foreground">{t(`pricing.${tier.key}.period`)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">{t(`pricing.${tier.key}.desc`)}</p>
                      <Separator className="my-4" />
                      <ul className="space-y-2.5">
                        {tier.features.map((fKey) => (
                          <li key={fKey} className="flex items-center gap-2 text-xs text-foreground">
                            <Check className={`w-3.5 h-3.5 ${isHighlighted ? 'text-violet-500' : 'text-[oklch(0.6_0.2_160)]'}`} />
                            {t(fKey)}
                          </li>
                        ))}
                      </ul>
                      <Button
                        onClick={handleGetStarted}
                        className={`w-full mt-6 text-xs font-semibold focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${isHighlighted ? 'bg-gradient-to-r from-blue-500 to-violet-500 text-white hover:from-blue-600 hover:to-violet-600 border-0 shadow-md shadow-violet-500/15' : 'border-border bg-card text-foreground hover:bg-accent'}`}
                        variant={isHighlighted ? 'default' : 'outline'}
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
        <section className="relative py-16 md:py-24 lg:py-28 bg-background overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-blue-500/20 via-violet-500/15 to-blue-500/20" />

          <div className="relative z-10 max-w-3xl mx-auto px-6">
            <motion.div
              {...sectionFadeIn}
              viewport={{ once: true, margin: '-50px' }}
              whileInView={{ opacity: 1, y: 0 }}
              className={`${textAlignClass} mb-6`}
            >
              <Badge className="text-[10px] mb-3 bg-gradient-to-r from-blue-500/10 to-violet-500/10 text-violet-500 border-violet-500/20 border">
                <Eye className="w-3 h-3 me-1" /> {t('faq.badge')}
              </Badge>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                {t('faq.title.pre')}{' '}
                <span className="gradient-text">{t('faq.title.highlight')}</span>
              </h2>
            </motion.div>

            <Accordion type="single" collapsible className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="border border-border/50 rounded-lg px-4 data-[state=open]:border-blue-500/30 data-[state=open]:bg-gradient-to-r data-[state=open]:from-blue-500/5 data-[state=open]:to-violet-500/5 transition-all"
                >
                  <AccordionTrigger className="text-xs font-medium text-foreground hover:no-underline py-3 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                    {t(`faq.${i}.q`)}
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-muted-foreground leading-relaxed pb-3">
                    {t(`faq.${i}.a`)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* ─── CTA Banner ─────────────────────────────────────────── */}
        <section className="relative py-16 md:py-24 lg:py-28 overflow-hidden">
          <AbstractBackground isDark={isDark} />

          {/* Blue-to-violet gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/8 via-violet-500/8 to-blue-500/5" />
          {/* Gradient line at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500/30 via-violet-500/40 to-blue-500/30" />

          <div className="relative z-10 max-w-7xl mx-auto px-6">
            <motion.div
              {...sectionFadeIn}
              viewport={{ once: true, margin: '-50px' }}
              whileInView={{ opacity: 1, y: 0 }}
              className={textAlignClass}
            >
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                {t('cta.title.pre')}{' '}
                <span className="gradient-text">{t('cta.title.highlight')}</span>
              </h2>
              <p className="text-xs text-muted-foreground max-w-md mt-2">
                {t('cta.subtitle')}
              </p>
              <div className={`flex flex-wrap gap-3 mt-5 ${isRtlMode ? 'rtl:flex-row-reverse' : ''}`}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={handleGetStarted}
                    className="bg-gradient-to-r from-blue-500 to-violet-500 text-white hover:from-blue-600 hover:to-violet-600 border-0 text-xs font-semibold shadow-lg shadow-violet-500/15 px-6 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  >
                    {t('cta.primary')} <ArrowRight className="w-3 h-3 ms-1 rtl-flip-x" />
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    onClick={() => navigate('login')}
                    className="border-border bg-card text-foreground hover:bg-accent text-xs focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  >
                    {t('cta.secondary')}
                  </Button>
                </motion.div>
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

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
          <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6 ${isRtlMode ? 'rtl:text-right' : ''}`}>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Hexagon className="w-4 h-4 text-violet-500" />
                <span className="font-bold text-sm gradient-text">{t('brand.name')}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t('footer.tagline')}
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-foreground mb-2">{t('footer.product')}</h4>
              <div className="space-y-1.5">
                <a href="#main-content" onClick={(e) => { e.preventDefault(); handleGetStarted() }} className="block text-xs text-muted-foreground hover:text-violet-500 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded">{t('nav.builder')}</a>
                <a href="#main-content" onClick={(e) => { e.preventDefault(); setDashboardTab('activity'); navigate('dashboard') }} className="block text-xs text-muted-foreground hover:text-violet-500 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded">{t('common.export')}</a>
                <a href="#main-content" onClick={(e) => { e.preventDefault(); setDashboardTab('activity'); navigate('dashboard') }} className="block text-xs text-muted-foreground hover:text-violet-500 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded">{t('nav.templates')}</a>
                <a href="#main-content" onClick={(e) => { e.preventDefault(); setDashboardTab('deployments'); navigate('dashboard') }} className="block text-xs text-muted-foreground hover:text-violet-500 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded">{t('common.deploy')}</a>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-foreground mb-2">{t('footer.resources')}</h4>
              <div className="space-y-1.5">
                {[t('footer.docs'), t('footer.blog'), t('footer.changelog'), t('footer.support')].map((item) => (
                  <span key={item} className="block text-xs text-muted-foreground hover:text-violet-500/70 transition-colors cursor-default">{item}</span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-foreground mb-2">{t('footer.company')}</h4>
              <div className="space-y-1.5">
                {[t('footer.about'), t('footer.careers'), t('footer.privacy'), t('footer.terms')].map((item) => (
                  <span key={item} className="block text-xs text-muted-foreground hover:text-violet-500/70 transition-colors cursor-default">{item}</span>
                ))}
              </div>
            </div>
          </div>
          <Separator className="mb-4" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground">{t('footer.rights')}</span>
            <div className="flex items-center gap-3">
              <a href="#" className="min-w-[44px] min-h-[44px] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"><Github className="w-3.5 h-3.5 text-muted-foreground hover:text-violet-500 transition-colors" /></a>
              <a href="#" className="min-w-[44px] min-h-[44px] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"><Twitter className="w-3.5 h-3.5 text-muted-foreground hover:text-violet-500 transition-colors" /></a>
              <a href="#" className="min-w-[44px] min-h-[44px] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"><Linkedin className="w-3.5 h-3.5 text-muted-foreground hover:text-violet-500 transition-colors" /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
