'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useAppStore } from '@/lib/store'
import { isRtl } from '@/lib/i18n'
import dynamic from 'next/dynamic'
import {
  Sparkles,
  Paintbrush,
  Download,
  Rocket,
  Sun,
  Moon,
  ArrowRight,
  Zap,
  Shield,
  MousePointerClick,
  Github,
  Twitter,
  Linkedin,
  Hexagon,
  Eye,
  LayoutGrid,
  Globe,
  TrendingUp,
  Clock,
  Users,
  Star,
  Play,
  Palette,
  Wand2,
  Code2,
  Layers,
  Monitor,
  Smartphone,
  Check,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import { Separator } from '@/components/ui/separator'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { useTranslation } from '@/lib/useTranslation'

// Lazy-load heavy interactive components
const BuilderPlayground = dynamic(() => import('@/components/landing/BuilderPlayground').then(m => ({ default: m.BuilderPlayground })), { ssr: false })
const ThemePlayground = dynamic(() => import('@/components/landing/ThemePlayground').then(m => ({ default: m.ThemePlayground })), { ssr: false })
const AIDemo = dynamic(() => import('@/components/landing/AIDemo').then(m => ({ default: m.AIDemo })), { ssr: false })

// ─── Minimal Animation — only 4-5 key moments ────────────────────────

const sectionFadeIn = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

// ─── Animated Counter (kept — deterministic, no Math.random) ──────────

function AnimatedCounter({ target, suffix = '', duration = 2000 }: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const [triggered, setTriggered] = useState(false)
  const ref = React.useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
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
    }, { threshold: 0.3 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [triggered, target, duration])

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

// ─── Abstract Background — reduced blobs, only used on Hero & CTA ─────

function AbstractBackground({ isDark }: { isDark: boolean }) {
  const o1 = isDark ? 0.15 : 0.08
  const o2 = isDark ? 0.10 : 0.05
  const o3 = isDark ? 0.06 : 0.03

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Blue-to-violet gradient blobs — more prominent */}
      <div className="absolute top-[10%] left-[5%] w-56 h-56 rounded-full animate-morph" style={{
        background: `radial-gradient(circle, oklch(0.5 0.25 250 / ${o1}), oklch(0.55 0.3 280 / ${o2}), transparent 70%)`,
      }} />
      <div className="absolute bottom-[15%] right-[5%] w-64 h-64 rounded-full animate-morph" style={{
        background: `radial-gradient(circle, oklch(0.55 0.3 280 / ${o1}), oklch(0.5 0.25 250 / ${o2}), transparent 70%)`,
        animationDelay: '-3s',
      }} />
      <div className="absolute top-[50%] left-[50%] w-48 h-48 rounded-full animate-morph" style={{
        background: `radial-gradient(circle, oklch(0.55 0.25 270 / ${o3}), transparent 70%)`,
        animationDelay: '-6s',
      }} />
    </div>
  )
}

// ─── Accent color constants for each section ──────────────────────────

const ACCENT = {
  hero: 'primary',       // blue-to-violet (uses gradient overrides)
  features: 'oklch(0.65 0.2 80)',   // warm amber
  themePg: 'oklch(0.6 0.2 160)',    // teal/green
  howItWorks: 'oklch(0.6 0.15 250)', // sky blue
  aiDemo: 'primary',     // blue-to-violet
  testimonials: 'oklch(0.65 0.2 350)', // warm rose
  pricing: 'primary',    // blue-to-violet
  cta: 'primary',        // blue-to-violet
}

// ─── Trust logos data ──────────────────────────────────────────────────

const TRUST_LOGOS = ['TechFlow', 'DesignLab', 'CloudNine', 'DataPulse', 'NovaSoft', 'PixelCraft']

// ─── Main Landing Page Component ──────────────────────────────────────

export default function LandingPage() {
  const navigate = useAppStore(s => s.navigate)
  const setBuilderPrompt = useAppStore(s => s.setBuilderPrompt)
  const setDashboardTab = useAppStore(s => s.setDashboardTab)
  const themeMode = useAppStore(s => s.themeMode)
  const setThemeMode = useAppStore(s => s.setThemeMode)
  const uiLanguage = useAppStore(s => s.uiLanguage)
  const t = useTranslation()
  const [promptValue, setPromptValue] = useState('')
  const isDark = themeMode === 'dark'
  const isRtlMode = isRtl(uiLanguage)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  const toggleTheme = useCallback(() => {
    setThemeMode(isDark ? 'light' : 'dark')
  }, [isDark, setThemeMode])

  const handleGenerate = useCallback(() => {
    if (!promptValue.trim()) return
    setBuilderPrompt(promptValue)
    navigate('builder')
  }, [promptValue, setBuilderPrompt, navigate])

  const handleGetStarted = useCallback(() => {
    navigate('builder')
  }, [navigate])

  // Stats — more startup-realistic
  const localizedStats = [
    { value: 2500, suffix: '+', label: t('stats.sitesBuilt'), icon: Globe },
    { value: 15000, suffix: '+', label: t('stats.pagesGenerated'), icon: LayoutGrid },
    { value: 99, suffix: '.9%', label: t('stats.uptime'), icon: Shield },
    { value: 50, suffix: '+', label: t('stats.countries'), icon: Users },
  ]

  // Features — amber accent
  const localizedFeatures = [
    { icon: Sparkles, titleKey: 'features.ai.title', descKey: 'features.ai.desc' },
    { icon: Paintbrush, titleKey: 'features.editor.title', descKey: 'features.editor.desc' },
    { icon: Download, titleKey: 'features.export.title', descKey: 'features.export.desc' },
    { icon: Rocket, titleKey: 'features.deploy.title', descKey: 'features.deploy.desc' },
  ]

  // Steps — sky blue accent
  const localizedSteps = [
    { number: '1', titleKey: 'how.step1.title', descKey: 'how.step1.desc', icon: MousePointerClick, bullets: [{ icon: Monitor, key: 'how.step1.bullet1' }, { icon: Smartphone, key: 'how.step1.bullet2' }] },
    { number: '2', titleKey: 'how.step2.title', descKey: 'how.step2.desc', icon: Zap, bullets: [{ icon: Code2, key: 'how.step2.bullet1' }, { icon: Layers, key: 'how.step2.bullet2' }] },
    { number: '3', titleKey: 'how.step3.title', descKey: 'how.step3.desc', icon: Rocket, bullets: [{ icon: Download, key: 'how.step3.bullet1' }, { icon: Rocket, key: 'how.step3.bullet2' }] },
  ]

  // Testimonials — rose accent, middle featured
  const localizedTestimonials = [
    { id: '1', avatar: 'SC', metricIcon: Clock },
    { id: '2', avatar: 'MR', metricIcon: TrendingUp, featured: true },
    { id: '3', avatar: 'AP', metricIcon: Globe },
  ]

  // Pricing tiers
  const pricingTiers = [
    { key: 'free', features: ['pricing.free.f1', 'pricing.free.f2', 'pricing.free.f3'] },
    { key: 'pro', features: ['pricing.pro.f1', 'pricing.pro.f2', 'pricing.pro.f3', 'pricing.pro.f4'], highlighted: true },
    { key: 'enterprise', features: ['pricing.enterprise.f1', 'pricing.enterprise.f2', 'pricing.enterprise.f3', 'pricing.enterprise.f4'] },
  ]

  // Suggestion pills
  const localizedPills = [
    t('hero.suggestion.saas'),
    t('hero.suggestion.portfolio'),
    t('hero.suggestion.restaurant'),
    t('hero.suggestion.ecommerce'),
  ]

  // Helper for section accent color (non-purple)
  const accentBg = (color: string, opacity: number) => `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`
  const accentBorder = (color: string, opacity: number) => `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`

  const textAlignClass = isRtlMode ? 'text-right' : 'text-left'

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* ─── Skip to content ────────────────────────────────────────── */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md focus:text-sm">
        Skip to content
      </a>

      {/* ─── Navbar ────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hexagon className="w-5 h-5 text-primary" />
            <span className="font-bold text-sm gradient-text">{t('brand.name')}</span>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <button onClick={() => navigate('builder')} className="text-xs text-muted-foreground hover:text-foreground transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded">{t('nav.builder')}</button>
            <button onClick={() => { setDashboardTab('templates'); navigate('dashboard') }} className="text-xs text-muted-foreground hover:text-foreground transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded">{t('nav.templates')}</button>
            <button onClick={handleGetStarted} className="text-xs text-muted-foreground hover:text-foreground transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded">{t('nav.pricing')}</button>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher variant="pill" compact />
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="w-8 h-8 p-0 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              title={isDark ? t('nav.theme.toggleLight') : t('nav.theme.toggleDark')}
            >
              {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('login')}
              className="text-xs text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              {t('nav.signin')}
            </Button>
            <Button
              size="sm"
              onClick={handleGetStarted}
              className="text-xs bg-gradient-to-r from-blue-500 to-violet-500 text-white hover:from-blue-600 hover:to-violet-600 border-0 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              {t('nav.getStarted')}
            </Button>
          </div>
        </div>
      </nav>

      {/* ─── Main Content ──────────────────────────────────────────── */}
      <div id="main-content">

        {/* ─── Hero Section — Bigger, more impactful ───────────────── */}
        <section className="relative overflow-hidden pt-24 pb-20 md:pt-32 md:pb-24">
          <AbstractBackground isDark={isDark} />

          {/* Blue-to-violet gradient accent line at top */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-violet-500 to-blue-500 opacity-50" />

          {/* Additional gradient wash */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-violet-500/8 to-blue-500/3 pointer-events-none" />

          <div className="relative z-10 max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center">
              {/* Left side: Text content (3 cols) */}
              <motion.div
                {...sectionFadeIn}
                className={`lg:col-span-3 ${textAlignClass}`}
              >
                <Badge className="bg-gradient-to-r from-blue-500/10 to-violet-500/10 text-violet-500 border-violet-500/20 text-[10px] px-3 py-1">
                  <Sparkles className="w-3 h-3 me-1" /> {t('hero.badge')}
                </Badge>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mt-6">
                  {t('hero.title.pre')}{' '}
                  <span className="gradient-text text-4xl sm:text-5xl lg:text-7xl">{t('hero.title.highlight')}</span>
                </h1>

                <p className="text-sm text-muted-foreground max-w-lg mt-4">
                  {t('hero.subtitle')}
                </p>

                {/* Prompt Input */}
                <div className="max-w-md mt-6">
                  <div className={`flex gap-2 p-1.5 rounded-xl bg-card border border-border shadow-sm ${isRtlMode ? 'rtl:flex-row-reverse' : ''}`}>
                    <input
                      value={promptValue}
                      onChange={(e) => setPromptValue(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                      placeholder={t('hero.placeholder')}
                      className="flex-1 bg-transparent text-foreground text-xs placeholder:text-muted-foreground px-3 py-2 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
                    />
                    <Button
                      onClick={handleGenerate}
                      size="sm"
                      className="bg-gradient-to-r from-blue-500 to-violet-500 text-white hover:from-blue-600 hover:to-violet-600 border-0 text-xs px-4 shadow-lg shadow-violet-500/15 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    >
                      <Sparkles className="w-3 h-3 me-1" /> {t('hero.generate')}
                    </Button>
                  </div>
                </div>

                {/* Suggestion pills */}
                <div className={`flex flex-wrap gap-1.5 mt-4 ${isRtlMode ? 'rtl:flex-row-reverse' : ''}`}>
                  {localizedPills.map((pill) => (
                    <motion.button
                      key={pill}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => { setPromptValue(pill); setBuilderPrompt(pill); navigate('builder') }}
                      className="text-[10px] text-muted-foreground px-2.5 py-1 rounded-full bg-secondary border border-border hover:border-primary/30 hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    >
                      {pill}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Right side: Real image preview (2 cols) */}
              <motion.div
                initial={{ opacity: 0, x: isRtlMode ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="lg:col-span-2"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-xl shadow-blue-500/10">
                  {/* Blue-to-violet gradient border effect */}
                  <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-br from-blue-500/40 via-violet-500/40 to-blue-500/20 pointer-events-none" />

                  {/* Browser chrome mockup */}
                  <div className="relative bg-card/90 backdrop-blur-sm flex items-center gap-2 px-4 py-2.5 border-b border-border/50">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[oklch(0.65_0.2_80_/_60%)]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[oklch(0.6_0.2_160_/_60%)]" />
                    </div>
                    <div className="flex-1 h-5 rounded-md bg-secondary flex items-center px-2">
                      <span className="text-[8px] text-muted-foreground font-mono" dir="ltr">{t('hero.preview.getUrl')}</span>
                    </div>
                  </div>

                  {/* Real AI-generated website image */}
                  <div className="relative bg-card">
                    <Image
                      src="/images/forge-hero-1.png"
                      alt="Forge AI-generated website preview"
                      width={800}
                      height={533}
                      className="w-full h-auto object-cover"
                      priority
                    />
                    {/* Blue-to-violet gradient overlay for brand consistency */}
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 via-transparent to-violet-500/10 pointer-events-none" />
                  </div>

                  {/* Floating accent dots */}
                  <div className={`absolute -top-3 ${isRtlMode ? '-left-3' : '-right-3'} w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 shadow-lg shadow-violet-500/30 animate-pulse`} />
                  <div className={`absolute -bottom-2 ${isRtlMode ? '-right-2' : '-left-2'} w-4 h-4 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 shadow-md shadow-blue-500/20 animate-pulse`} style={{ animationDelay: '-1.5s' }} />
                </div>
              </motion.div>
            </div>
          </div>
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
                <div key={stat.label} className={`flex items-center gap-4 ${i > 0 ? 'border-s border-border/50 ps-6 rtl:border-e rtl:border-s-0 rtl:ps-0 rtl:pe-6' : ''}`}>
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500/10 to-violet-500/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-violet-500" />
                  </div>
                  <div>
                    <div className="text-lg sm:text-xl font-bold text-foreground">
                      <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                    </div>
                    <div className="text-[10px] text-muted-foreground">{stat.label}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* ─── Builder Playground ──────────────────────────────────── */}
        <section className="relative py-16 md:py-24 lg:py-28 overflow-hidden bg-background">
          <div className="relative z-10 max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
              {/* Left: Heading (2 cols) */}
              <motion.div
                {...sectionFadeIn}
                viewport={{ once: true, margin: '-50px' }}
                whileInView={{ opacity: 1, y: 0 }}
                className={`lg:col-span-2 ${textAlignClass}`}
              >
                <Badge className="text-[10px] mb-3 bg-gradient-to-r from-blue-500/10 to-violet-500/10 text-violet-500 border-violet-500/20 border">
                  <MousePointerClick className="w-3 h-3 me-1" /> {t('playground.badge')}
                </Badge>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                  {t('playground.title.pre')}{' '}
                  <span className="gradient-text">{t('playground.title.highlight')}</span>
                </h2>
                <p className="text-xs text-muted-foreground max-w-sm">
                  {t('playground.subtitle')}
                </p>
                <div className="mt-4 flex gap-2">
                  <div className="w-5 h-5 rounded bg-gradient-to-br from-blue-500/10 to-violet-500/10 flex items-center justify-center">
                    <Layers className="w-2.5 h-2.5 text-violet-500" />
                  </div>
                  <span className="text-[10px] text-muted-foreground">{t('playground.blocks')}</span>
                </div>
              </motion.div>

              {/* Right: Playground (3 cols) */}
              <div className="lg:col-span-3">
                <BuilderPlayground isDark={isDark} />
              </div>
            </div>
          </div>
        </section>

        {/* ─── Blue-to-Violet Accent Divider ──────────────────────── */}
        <div className="h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
        <div className="h-px bg-gradient-to-l from-transparent via-violet-500/30 to-transparent -mt-px" />

        {/* ─── Features Section — warm amber accent ──────────────── */}
        <section className="relative py-16 md:py-24 lg:py-28 bg-background overflow-hidden">
          <div className="relative z-10 max-w-7xl mx-auto px-6">
            {/* Section header */}
            <motion.div
              {...sectionFadeIn}
              viewport={{ once: true, margin: '-50px' }}
              whileInView={{ opacity: 1, y: 0 }}
              className={`${textAlignClass} mb-10`}
            >
              <Badge className="text-[10px] mb-3" style={{ background: `${ACCENT.features}15`, color: ACCENT.features, borderColor: `${ACCENT.features}25` }}>
                <Zap className="w-3 h-3 me-1" /> {t('features.badge')}
              </Badge>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                {t('features.title.pre')}{' '}
                <span style={{ color: ACCENT.features }}>{t('features.title.highlight')}</span>
              </h2>
              <p className="text-xs text-muted-foreground max-w-md">
                {t('features.subtitle')}
              </p>
            </motion.div>

            {/* Features grid + showcase image */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Features cards (2 cols) */}
              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {localizedFeatures.map((feature) => {
                  const Icon = feature.icon
                  return (
                    <Card key={feature.titleKey} className="group relative overflow-hidden border-border/50 hover:border-blue-500/20 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5">
                      <CardContent className="relative z-10 p-5">
                        <div className="flex items-start gap-3">
                          <div
                            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm"
                            style={{ background: `${ACCENT.features}15`, border: `1px solid ${ACCENT.features}25` }}
                          >
                            <Icon className="w-4 h-4" style={{ color: ACCENT.features }} />
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-foreground mb-1">{t(feature.titleKey)}</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">{t(feature.descKey)}</p>
                          </div>
                        </div>
                      </CardContent>
                      {/* Blue-to-violet gradient accent line at bottom on hover */}
                      <div className="absolute bottom-0 inset-x-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-blue-500 to-violet-500" />
                    </Card>
                  )
                })}
              </div>

              {/* Showcase image (1 col) */}
              <motion.div
                {...sectionFadeIn}
                viewport={{ once: true, margin: '-50px' }}
                whileInView={{ opacity: 1, y: 0 }}
                className="lg:col-span-1"
              >
                <div className="relative rounded-2xl overflow-hidden border border-border/30 shadow-lg shadow-violet-500/5 h-full min-h-[300px]">
                  <Image
                    src="/images/forge-hero-2.png"
                    alt="Forge AI-powered design capabilities"
                    width={800}
                    height={426}
                    className="w-full h-full object-cover"
                  />
                  {/* Blue-to-violet gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-violet-500/15 via-transparent to-blue-500/10 pointer-events-none" />
                  {/* Gradient border effect */}
                  <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-b from-blue-500/20 via-transparent to-violet-500/20 pointer-events-none" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ─── Theme Playground — teal/green accent ─────────────── */}
        <section className="relative py-16 md:py-24 lg:py-28 overflow-hidden bg-background">
          <div className="relative z-10 max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
              {/* Left: Playground (3 cols) */}
              <div className="lg:col-span-3 order-2 lg:order-1">
                <ThemePlayground isDark={isDark} />
              </div>

              {/* Right: Heading (2 cols) */}
              <motion.div
                {...sectionFadeIn}
                viewport={{ once: true, margin: '-50px' }}
                whileInView={{ opacity: 1, y: 0 }}
                className={`lg:col-span-2 order-1 lg:order-2 ${textAlignClass} lg:text-right`}
              >
                <Badge className="text-[10px] mb-3" style={{ background: `${ACCENT.themePg}15`, color: ACCENT.themePg, borderColor: `${ACCENT.themePg}25` }}>
                  <Palette className="w-3 h-3 me-1" /> {t('themepg.badge')}
                </Badge>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                  {t('themepg.title.pre')}{' '}
                  <span style={{ color: ACCENT.themePg }}>{t('themepg.title.highlight')}</span>
                </h2>
                <p className="text-xs text-muted-foreground max-w-sm">
                  {t('themepg.subtitle')}
                </p>
                <div className={`mt-4 flex gap-2 ${textAlignClass === 'text-right' ? 'lg:justify-start' : 'lg:justify-end'}`}>
                  <div className="w-5 h-5 rounded flex items-center justify-center" style={{ background: `${ACCENT.themePg}15` }}>
                    <Palette className="w-2.5 h-2.5" style={{ color: ACCENT.themePg }} />
                  </div>
                  <span className="text-[10px] text-muted-foreground">{t('themepg.presetsHint')}</span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ─── How It Works — sky blue accent ─────────────────── */}
        <section className="relative py-16 md:py-24 lg:py-28 bg-background overflow-hidden">
          {/* Blue-to-violet gradient top border */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-blue-500/30 via-violet-500/20 to-blue-500/30" />
          {/* Subtle gradient wash */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/3 via-transparent to-transparent pointer-events-none" />

          <div className="relative z-10 max-w-7xl mx-auto px-6">
            <motion.div
              {...sectionFadeIn}
              viewport={{ once: true, margin: '-50px' }}
              whileInView={{ opacity: 1, y: 0 }}
              className={`${textAlignClass} mb-10`}
            >
              <Badge className="text-[10px] mb-3" style={{ background: `${ACCENT.howItWorks}15`, color: ACCENT.howItWorks, borderColor: `${ACCENT.howItWorks}25` }}>
                <ArrowRight className="w-3 h-3 me-1 rtl-flip-x" /> {t('how.badge')}
              </Badge>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                {t('how.title.pre')}{' '}
                <span style={{ color: ACCENT.howItWorks }}>{t('how.title.highlight')}</span>
              </h2>
            </motion.div>

            <div className="space-y-8">
              {localizedSteps.map((step, i) => {
                const Icon = step.icon
                const isEven = i % 2 === 0
                return (
                  <div key={step.number} className={`grid grid-cols-1 md:grid-cols-2 gap-6 items-center ${!isEven ? 'rtl:[direction:rtl]' : ''}`}>
                    {/* Visual side */}
                    <div className={`${!isEven ? 'rtl:[direction:ltr]' : ''}`}>
                      <div className={`relative rounded-2xl border border-border bg-card p-6 ${isEven ? 'md:ms-8 rtl:me-8 rtl:ms-0' : 'md:me-8 rtl:ms-8 rtl:me-0'}`}>
                        <div className={`absolute -top-3 ${isRtlMode ? '-right-3' : '-left-3'} w-8 h-8 rounded-full text-white text-sm font-bold flex items-center justify-center shadow-lg shadow-[oklch(0.6_0.15_250)_/_30]`} style={{ background: ACCENT.howItWorks }}>
                          {step.number}
                        </div>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${ACCENT.howItWorks}15` }}>
                            <Icon className="w-5 h-5" style={{ color: ACCENT.howItWorks }} />
                          </div>
                          <h3 className="text-sm font-bold text-foreground">{t(step.titleKey)}</h3>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{t(step.descKey)}</p>
                      </div>
                    </div>
                    {/* Text side */}
                    <div className={`${!isEven ? 'rtl:[direction:ltr]' : ''}`}>
                      <div className={`flex flex-col gap-2 ${isEven ? 'md:justify-end rtl:md:justify-start' : 'md:justify-start rtl:md:justify-end'}`}>
                        {step.bullets.map((b) => {
                          const BIcon = b.icon
                          return (
                            <div key={b.key} className="flex items-center gap-2">
                              <BIcon className="w-4 h-4" style={{ color: ACCENT.howItWorks }} />
                              <span className="text-[10px] text-muted-foreground">{t(b.key)}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ─── AI Demo — blue-to-violet gradient accent ─────────── */}
        <section className="relative py-16 md:py-24 lg:py-28 overflow-hidden bg-background">
          {/* Blue-to-violet gradient top border */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-blue-500/30 via-violet-500/30 to-blue-500/30" />
          {/* Gradient wash */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-violet-500/5 to-blue-500/3 pointer-events-none" />

          <div className="relative z-10 max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
              {/* Left: Heading (2 cols) */}
              <motion.div
                {...sectionFadeIn}
                viewport={{ once: true, margin: '-50px' }}
                whileInView={{ opacity: 1, y: 0 }}
                className={`lg:col-span-2 ${textAlignClass}`}
              >
                <Badge className="text-[10px] mb-3 bg-gradient-to-r from-blue-500/10 to-violet-500/10 text-violet-500 border-violet-500/20 border">
                  <Wand2 className="w-3 h-3 me-1" /> {t('aidemo.badge')}
                </Badge>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                  {t('aidemo.title.pre')}{' '}
                  <span className="gradient-text">{t('aidemo.title.highlight')}</span>
                </h2>
                <p className="text-xs text-muted-foreground max-w-sm">
                  {t('aidemo.subtitle')}
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <Play className="w-4 h-4 text-violet-500" />
                  <span className="text-[10px] text-muted-foreground">{t('aidemo.hint')}</span>
                </div>
              </motion.div>

              {/* Right: Demo (3 cols) */}
              <div className="lg:col-span-3">
                <AIDemo isDark={isDark} />
              </div>
            </div>
          </div>
        </section>

        {/* ─── Testimonials — with showcase image ─────────────────── */}
        <section className="relative py-16 md:py-24 lg:py-28 overflow-hidden bg-background">
          {/* Blue-to-violet gradient band at top */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500/20 via-violet-500/30 to-blue-500/20" />

          <div className="relative z-10 max-w-7xl mx-auto px-6">
            <motion.div
              {...sectionFadeIn}
              viewport={{ once: true, margin: '-50px' }}
              whileInView={{ opacity: 1, y: 0 }}
              className={`${textAlignClass} mb-10`}
            >
              <Badge className="text-[10px] mb-3" style={{ background: `${ACCENT.testimonials}15`, color: ACCENT.testimonials, borderColor: `${ACCENT.testimonials}25` }}>
                <Star className="w-3 h-3 me-1" /> {t('testimonials.badge')}
              </Badge>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                {t('testimonials.title.pre')}{' '}
                <span style={{ color: ACCENT.testimonials }}>{t('testimonials.title.highlight')}</span>
              </h2>
            </motion.div>

            {/* Showcase image + testimonial cards */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
              {/* Showcase image (1 col) */}
              <motion.div
                {...sectionFadeIn}
                viewport={{ once: true, margin: '-50px' }}
                whileInView={{ opacity: 1, y: 0 }}
                className="lg:col-span-1 lg:row-span-2"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-lg shadow-blue-500/5 h-full min-h-[300px]">
                  <Image
                    src="/images/forge-hero-3.png"
                    alt="Forge user success story — website built with AI"
                    width={800}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                  {/* Blue-to-violet gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-500/15 via-transparent to-violet-500/10 pointer-events-none" />
                  {/* Gradient border */}
                  <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-t from-violet-500/30 via-transparent to-blue-500/20 pointer-events-none" />
                  {/* Quote overlay */}
                  <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-violet-500/20 to-transparent">
                    <div className="text-xs text-white/90 font-medium italic">&ldquo;Built my entire site in 10 minutes&rdquo;</div>
                  </div>
                </div>
              </motion.div>

              {/* Testimonial cards (3 cols) */}
              <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {localizedTestimonials.map((tm, i) => {
                  const MetricIcon = tm.metricIcon
                  const isFeatured = tm.featured
                  return (
                    <Card key={tm.id} className={`group relative overflow-hidden border-border/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:shadow-blue-500/5 ${isFeatured ? 'border-blue-500/20 shadow-md' : ''}`}>
                      <CardContent className={`${isFeatured ? 'p-8' : 'p-5'}`}>
                        {/* Star ratings */}
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
                      {/* Blue-to-violet gradient accent bottom */}
                      <div className="absolute bottom-0 inset-x-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-blue-500 to-violet-500" />
                    </Card>
                  )
                })}
              </div>
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
                  <Card key={tier.key} className={`relative overflow-hidden transition-all duration-300 ${isHighlighted ? 'border-blue-500/30 shadow-lg shadow-violet-500/10 scale-[1.02] bg-gradient-to-b from-blue-500/5 to-violet-500/5' : 'border-border/50'}`}>
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
            </motion.div>
          </div>
        </section>
      </div>

      {/* ─── Footer ───────────────────────────────────────────────── */}
      <footer className="mt-auto border-t border-border bg-background">
        {/* Blue-to-violet accent line above footer */}
        <div className="h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
        <div className="h-px bg-gradient-to-l from-transparent via-violet-500/15 to-transparent -mt-px" />

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 mb-6 ${isRtlMode ? 'rtl:text-right' : ''}`}>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Hexagon className="w-4 h-4 text-primary" />
                <span className="font-bold text-sm gradient-text">{t('brand.name')}</span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                {t('footer.tagline')}
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-foreground mb-2">{t('footer.product')}</h4>
              <div className="space-y-1.5">
                <a href="#main-content" onClick={(e) => { e.preventDefault(); navigate('builder') }} className="block text-[10px] text-muted-foreground hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded">{t('nav.builder')}</a>
                <a href="#main-content" onClick={(e) => { e.preventDefault(); setDashboardTab('exports'); navigate('dashboard') }} className="block text-[10px] text-muted-foreground hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded">{t('common.export')}</a>
                <a href="#main-content" onClick={(e) => { e.preventDefault(); setDashboardTab('templates'); navigate('dashboard') }} className="block text-[10px] text-muted-foreground hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded">{t('nav.templates')}</a>
                <a href="#main-content" onClick={(e) => { e.preventDefault(); setDashboardTab('deployments'); navigate('dashboard') }} className="block text-[10px] text-muted-foreground hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded">{t('common.deploy')}</a>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-foreground mb-2">{t('footer.resources')}</h4>
              <div className="space-y-1.5">
                {[t('footer.docs'), t('footer.blog'), t('footer.changelog'), t('footer.support')].map((item) => (
                  <span key={item} className="block text-[10px] text-muted-foreground hover:text-primary/70 transition-colors cursor-default">{item}</span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-foreground mb-2">{t('footer.company')}</h4>
              <div className="space-y-1.5">
                {[t('footer.about'), t('footer.careers'), t('footer.privacy'), t('footer.terms')].map((item) => (
                  <span key={item} className="block text-[10px] text-muted-foreground hover:text-primary/70 transition-colors cursor-default">{item}</span>
                ))}
              </div>
            </div>
          </div>
          <Separator className="mb-4" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <span className="text-[10px] text-muted-foreground">{t('footer.rights')}</span>
            <div className="flex items-center gap-3">
              <a href="#" className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"><Github className="w-3.5 h-3.5 text-muted-foreground hover:text-primary transition-colors" /></a>
              <a href="#" className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"><Twitter className="w-3.5 h-3.5 text-muted-foreground hover:text-primary transition-colors" /></a>
              <a href="#" className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"><Linkedin className="w-3.5 h-3.5 text-muted-foreground hover:text-primary transition-colors" /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
