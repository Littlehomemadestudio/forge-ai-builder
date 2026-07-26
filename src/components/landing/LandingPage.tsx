'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, useInView } from 'framer-motion'
import { useAppStore } from '@/lib/store'
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
  Code2,
  Layers,
  MousePointerClick,
  Github,
  Twitter,
  Linkedin,
  Hexagon,
  Play,
  Eye,
  FileCode2,
  LayoutGrid,
  Monitor,
  Palette,
  Send,
  CheckCircle2,
  Globe,
  TrendingUp,
  Clock,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import { Separator } from '@/components/ui/separator'

// ─── Animation Helpers ───────────────────────────────────────────────

const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
}

// ─── Animated Counter ────────────────────────────────────────────────

function AnimatedCounter({ target, suffix = '', duration = 2000 }: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!inView || hasAnimated.current) return
    hasAnimated.current = true
    const start = 0
    const startTime = performance.now()

    const animate = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(start + (target - start) * eased))
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [inView, target, duration])

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

// ─── Data ────────────────────────────────────────────────────────────

const stats = [
  { value: 10000, suffix: '+', label: 'Sites Built', icon: Globe },
  { value: 50000, suffix: '+', label: 'Pages Generated', icon: LayoutGrid },
  { value: 99, suffix: '.9%', label: 'Uptime', icon: Shield },
  { value: 180, suffix: '+', label: 'Countries', icon: Users },
]

const features = [
  {
    icon: Sparkles,
    title: 'AI Generation',
    description: 'Describe your vision in plain language. Forge crafts production-quality websites from your words.',
  },
  {
    icon: Paintbrush,
    title: 'Visual Editor',
    description: 'Refine every detail with an intuitive editor. Drag, drop, tweak — or let AI handle it.',
  },
  {
    icon: Download,
    title: 'Export Freedom',
    description: 'Export clean HTML, CSS, and JS anytime — no lock-in, no vendor dependency.',
  },
  {
    icon: Rocket,
    title: 'Deploy Anywhere',
    description: 'Ship to Vercel, Netlify, or your own server. Forge doesn\'t tie you down.',
  },
]

const steps = [
  {
    number: '1',
    title: 'Describe',
    description: 'Tell Forge what you want — a portfolio, SaaS page, restaurant site, anything.',
    icon: MousePointerClick,
  },
  {
    number: '2',
    title: 'AI Builds',
    description: 'Forge generates a complete, responsive website with proper structure in seconds.',
    icon: Zap,
  },
  {
    number: '3',
    title: 'Customize & Ship',
    description: 'Polish with the visual editor, then deploy anywhere. Your site, your code.',
    icon: Rocket,
  },
]

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Founder, Lumina Design',
    quote: 'Forge turned my rough idea into a stunning website in under 2 minutes. The AI understood exactly what I wanted.',
    avatar: 'SC',
    metric: 'Built in 2 min',
    metricIcon: Clock,
  },
  {
    name: 'Marcus Rivera',
    role: 'CTO, BuildStack',
    quote: 'We replaced weeks of frontend work with Forge. The export quality is so clean our devs actually prefer it.',
    avatar: 'MR',
    metric: '3,500 monthly visitors',
    metricIcon: TrendingUp,
  },
  {
    name: 'Aisha Patel',
    role: 'Freelance Developer',
    quote: 'I use Forge for every client project now. It handles the initial build, I customize — client gets results faster.',
    avatar: 'AP',
    metric: '12 client sites',
    metricIcon: Globe,
  },
]

const faqs = [
  {
    question: 'How does Forge\'s AI generate websites?',
    answer: 'Forge uses advanced AI models that understand web design, UX patterns, and modern development practices. You describe what you want, and the AI generates complete, responsive code — custom-built, not templated.',
  },
  {
    question: 'Can I edit the generated code?',
    answer: 'Absolutely. Forge includes a visual editor for quick tweaks, and you can export full source code (HTML, CSS, JS) to edit in any tool. No lock-in — the code is yours.',
  },
  {
    question: 'Is Forge free to use?',
    answer: 'Forge offers a generous free tier for generating and customizing multiple sites. Upgrade to Pro for custom domains, team collaboration, and priority generation.',
  },
  {
    question: 'What platforms does Forge support?',
    answer: 'Forge generates standard web code that works everywhere. Deploy to Vercel, Netlify, AWS, GitHub Pages, or any host. Clean, framework-free HTML/CSS/JS.',
  },
  {
    question: 'How does Forge compare to traditional builders?',
    answer: 'Traditional builders give templates and drag-and-drop. Forge gives AI-powered generation that creates unique designs from your description — faster, more flexible, better results.',
  },
]

const suggestionPills = [
  'A modern SaaS landing page with pricing',
  'Portfolio site for a photographer',
  'Restaurant website with online ordering',
  'Minimal blog with dark theme',
]

// ─── Hexagonal Logo ──────────────────────────────────────────────────

function ForgeLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <Hexagon className="w-6 h-6 text-primary fill-primary/20" strokeWidth={2.5} />
      <span className="text-lg font-bold tracking-tight text-foreground">Forge</span>
    </div>
  )
}

// ─── Navbar ──────────────────────────────────────────────────────────

function Navbar() {
  const navigate = useAppStore(s => s.navigate)
  const themeMode = useAppStore(s => s.themeMode)
  const setThemeMode = useAppStore(s => s.setThemeMode)

  const toggleTheme = () => {
    const newMode = themeMode === 'dark' ? 'light' : 'dark'
    setThemeMode(newMode)
    document.documentElement.classList.toggle('dark', newMode === 'dark')
  }

  return (
    <motion.nav
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl"
    >
      <div className="mx-auto max-w-5xl flex items-center justify-between h-12 px-4 sm:px-6">
        <ForgeLogo />
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-muted-foreground hover:text-foreground h-8 w-8"
            aria-label="Toggle theme"
          >
            {themeMode === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('login')}
            className="text-muted-foreground hover:text-foreground text-xs hidden sm:inline-flex h-8"
          >
            Sign in
          </Button>
          <Button
            size="sm"
            onClick={() => navigate('builder')}
            className="bg-primary text-primary-foreground hover:bg-primary/90 h-8 text-xs px-3"
          >
            Get Started
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </div>
    </motion.nav>
  )
}

// ─── Hero ────────────────────────────────────────────────────────────

function Hero() {
  const navigate = useAppStore(s => s.navigate)
  const setBuilderPrompt = useAppStore(s => s.setBuilderPrompt)
  const [promptText, setPromptText] = useState('')

  const handleGenerate = useCallback(() => {
    if (!promptText.trim()) return
    setBuilderPrompt(promptText.trim())
    navigate('builder')
  }, [promptText, setBuilderPrompt, navigate])

  const handleSuggestionClick = useCallback((text: string) => {
    setPromptText(text)
  }, [])

  return (
    <section className="relative overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/8 rounded-full blur-[80px] animate-pulse-glow" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-primary/5 rounded-full blur-[60px] animate-float" />
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-12 sm:pt-16 pb-8 sm:pb-12 text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="flex flex-col items-center"
        >
          <motion.h1
            variants={fadeInUp}
            className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight max-w-2xl leading-snug"
          >
            Your idea. Our AI.{' '}
            <span className="gradient-text">A complete website.</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="mt-3 text-sm sm:text-base text-muted-foreground max-w-lg"
          >
            Describe what you want, and Forge builds it in seconds. No templates, no coding — just results.
          </motion.p>

          {/* Interactive prompt input */}
          <motion.div variants={fadeInUp} className="mt-6 w-full max-w-xl">
            <div className="relative flex items-center gap-2 bg-card border border-border rounded-lg p-2 shadow-sm hover:shadow-md transition-shadow">
              <Sparkles className="w-4 h-4 text-primary/60 ml-2 shrink-0" />
              <input
                type="text"
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleGenerate() }}
                placeholder="Describe the website you want to build..."
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 outline-none min-w-0 py-1.5"
                aria-label="Website description prompt"
              />
              <Button
                size="sm"
                onClick={handleGenerate}
                disabled={!promptText.trim()}
                className="bg-primary text-primary-foreground hover:bg-primary/90 h-8 px-3 text-xs shrink-0 disabled:opacity-40"
              >
                <Send className="w-3 h-3 mr-1" />
                Generate
              </Button>
            </div>

            {/* Suggestion pills */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
              {suggestionPills.map((pill) => (
                <button
                  key={pill}
                  onClick={() => handleSuggestionClick(pill)}
                  className="text-xs text-muted-foreground hover:text-foreground bg-muted/60 hover:bg-muted border border-border/40 rounded-full px-2.5 py-1 transition-colors cursor-pointer"
                >
                  {pill}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-primary" />
              No lock-in
            </div>
            <div className="flex items-center gap-1">
              <Code2 className="w-3 h-3 text-primary" />
              Clean code export
            </div>
            <div className="flex items-center gap-1">
              <Layers className="w-3 h-3 text-primary" />
              Deploy anywhere
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Stats Bar ───────────────────────────────────────────────────────

function StatsBar() {
  return (
    <section className="border-y border-border/30 bg-muted/20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
        >
          {stats.map((stat) => (
            <motion.div key={stat.label} variants={fadeInUp} className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <stat.icon className="w-3.5 h-3.5 text-primary" />
                <span className="text-xl sm:text-2xl font-bold text-foreground tabular-nums">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ─── Product Showcase ────────────────────────────────────────────────

function ProductShowcase() {
  return (
    <section className="py-10 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerContainer}
          className="text-center mb-6"
        >
          <motion.h2 variants={fadeInUp} className="text-xl sm:text-2xl font-bold tracking-tight">
            See how <span className="gradient-text">Forge works</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
            From prompt to production-ready website in three powerful tools.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
        >
          <Tabs defaultValue="ai-builder" className="w-full">
            <TabsList className="mx-auto mb-4 h-8">
              <TabsTrigger value="ai-builder" className="text-xs px-3 h-6">
                <Sparkles className="w-3 h-3 mr-1" />
                AI Builder
              </TabsTrigger>
              <TabsTrigger value="visual-editor" className="text-xs px-3 h-6">
                <Paintbrush className="w-3 h-3 mr-1" />
                Visual Editor
              </TabsTrigger>
              <TabsTrigger value="code-export" className="text-xs px-3 h-6">
                <FileCode2 className="w-3 h-3 mr-1" />
                Code Export
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ai-builder">
              <Card className="border-border/40 bg-card/80 overflow-hidden">
                <CardContent className="p-0">
                  {/* Mock editor UI: AI Builder */}
                  <div className="bg-muted/30 border-b border-border/30 px-4 py-2 flex items-center gap-2">
                    <Hexagon className="w-4 h-4 text-primary fill-primary/20" strokeWidth={2} />
                    <span className="text-xs font-semibold text-foreground">Forge</span>
                    <span className="text-xs text-muted-foreground ml-2">AI Builder</span>
                  </div>
                  <div className="p-4 sm:p-6 flex flex-col items-center gap-4">
                    <div className="w-full max-w-md bg-background border border-border/40 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-3.5 h-3.5 text-primary" />
                        <span className="text-xs font-medium text-foreground">Describe your website</span>
                      </div>
                      <div className="bg-muted/40 rounded px-3 py-2 text-xs text-muted-foreground leading-relaxed">
                        A modern SaaS landing page for a project management tool called "TaskFlow". Include hero section with gradient background, feature grid, pricing comparison table, and testimonials. Use a clean, professional design with subtle animations.
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <span className="text-xs text-muted-foreground">AI is generating your website...</span>
                    </div>
                    <div className="w-full grid grid-cols-3 gap-2 mt-2">
                      {['Hero Section', 'Features Grid', 'Pricing Table'].map((section) => (
                        <div key={section} className="bg-muted/30 border border-border/30 rounded-md p-2 text-center">
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary mx-auto mb-1" />
                          <span className="text-xs text-foreground font-medium">{section}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="visual-editor">
              <Card className="border-border/40 bg-card/80 overflow-hidden">
                <CardContent className="p-0">
                  {/* Mock editor UI: Visual Editor */}
                  <div className="bg-muted/30 border-b border-border/30 px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Hexagon className="w-4 h-4 text-primary fill-primary/20" strokeWidth={2} />
                      <span className="text-xs font-semibold text-foreground">Forge</span>
                      <span className="text-xs text-muted-foreground ml-2">Visual Editor</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Monitor className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Desktop</span>
                    </div>
                  </div>
                  <div className="flex">
                    {/* Left panel mock */}
                    <div className="w-44 border-r border-border/30 bg-muted/20 p-2 hidden sm:block">
                      <div className="text-xs font-medium text-muted-foreground mb-2">Components</div>
                      {['Header', 'Hero', 'Features', 'Pricing', 'Footer'].map((comp) => (
                        <div key={comp} className="text-xs text-foreground py-1 px-2 rounded hover:bg-muted/40 cursor-pointer flex items-center gap-1.5">
                          <LayoutGrid className="w-2.5 h-2.5 text-muted-foreground" />
                          {comp}
                        </div>
                      ))}
                    </div>
                    {/* Canvas mock */}
                    <div className="flex-1 p-4 sm:p-6">
                      <div className="bg-background border-2 border-primary/40 rounded-lg p-4 max-w-sm mx-auto">
                        <div className="h-2 w-16 bg-primary/20 rounded mb-2" />
                        <div className="h-1.5 w-24 bg-muted-foreground/20 rounded mb-3" />
                        <div className="h-8 bg-primary/10 rounded flex items-center justify-center">
                          <span className="text-xs text-primary font-medium">Get Started</span>
                        </div>
                        <div className="mt-2 h-1 w-20 bg-muted-foreground/10 rounded" />
                      </div>
                      <div className="text-center mt-2">
                        <span className="text-xs text-muted-foreground">Click any element to edit</span>
                      </div>
                    </div>
                    {/* Right panel mock */}
                    <div className="w-40 border-l border-border/30 bg-muted/20 p-2 hidden sm:block">
                      <div className="text-xs font-medium text-muted-foreground mb-2">Properties</div>
                      <div className="space-y-1.5">
                        {['Font Size', 'Color', 'Padding', 'Margin'].map((prop) => (
                          <div key={prop} className="text-xs">
                            <span className="text-muted-foreground">{prop}</span>
                            <div className="h-1.5 bg-muted/40 rounded mt-0.5" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="code-export">
              <Card className="border-border/40 bg-card/80 overflow-hidden">
                <CardContent className="p-0">
                  {/* Mock editor UI: Code Export */}
                  <div className="bg-muted/30 border-b border-border/30 px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Hexagon className="w-4 h-4 text-primary fill-primary/20" strokeWidth={2} />
                      <span className="text-xs font-semibold text-foreground">Forge</span>
                      <span className="text-xs text-muted-foreground ml-2">Code Export</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Download className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Export ZIP</span>
                    </div>
                  </div>
                  <div className="p-4 sm:p-6">
                    <div className="bg-muted/20 rounded-lg overflow-hidden border border-border/30">
                      {/* File tabs */}
                      <div className="flex items-center gap-0 border-b border-border/30 bg-muted/30">
                        {['index.html', 'styles.css', 'app.js'].map((file, i) => (
                          <div key={file} className={`px-3 py-1.5 text-xs ${i === 0 ? 'bg-background text-foreground border-b-2 border-primary' : 'text-muted-foreground'}`}>
                            {file}
                          </div>
                        ))}
                      </div>
                      {/* Code content mock */}
                      <div className="p-3 text-xs leading-relaxed font-mono">
                        <div className="text-muted-foreground/60">
                          <span className="text-primary/70">&lt;!DOCTYPE</span> html<br />
                          <span className="text-primary/70">&lt;html</span> lang="en"<span className="text-primary/70">&gt;</span><br />
                          &nbsp;&nbsp;<span className="text-primary/70">&lt;head&gt;</span><br />
                          &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-primary/70">&lt;meta</span> charset="UTF-8"<br />
                          &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-primary/70">&lt;title&gt;</span>TaskFlow — Project Management<span className="text-primary/70">&lt;/title&gt;</span><br />
                          &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-primary/70">&lt;link</span> rel="stylesheet" href="styles.css"<br />
                          &nbsp;&nbsp;<span className="text-primary/70">&lt;/head&gt;</span><br />
                          &nbsp;&nbsp;<span className="text-primary/70">&lt;body&gt;</span><br />
                          &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-muted-foreground/40">... clean, production-ready code ...</span><br />
                          &nbsp;&nbsp;<span className="text-primary/70">&lt;/body&gt;</span><br />
                          <span className="text-primary/70">&lt;/html&gt;</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-3 mt-3">
                      <Button variant="outline" size="sm" className="h-7 text-xs">
                        <Eye className="w-3 h-3 mr-1" />
                        Preview
                      </Button>
                      <Button size="sm" className="h-7 text-xs bg-primary text-primary-foreground">
                        <Download className="w-3 h-3 mr-1" />
                        Download ZIP
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Features ────────────────────────────────────────────────────────

function Features() {
  return (
    <section className="py-10 sm:py-16 bg-muted/20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerContainer}
          className="text-center mb-6"
        >
          <motion.h2 variants={fadeInUp} className="text-xl sm:text-2xl font-bold tracking-tight">
            Everything you need,{' '}
            <span className="gradient-text">nothing you don&apos;t</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
            AI generation, visual editing, and full code export in one seamless workflow.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={fadeInUp}>
              <Card className="border-border/40 bg-card/60 hover:border-primary/20 transition-colors duration-300 h-full">
                <CardContent className="p-4">
                  <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center mb-3">
                    <feature.icon className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ─── How It Works ────────────────────────────────────────────────────

function HowItWorks() {
  return (
    <section className="py-10 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerContainer}
          className="text-center mb-6"
        >
          <motion.h2 variants={fadeInUp} className="text-xl sm:text-2xl font-bold tracking-tight">
            Three steps.{' '}
            <span className="gradient-text">That&apos;s it.</span>
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {steps.map((step, i) => (
            <motion.div key={step.number} variants={fadeInUp} className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-3 ring-1 ring-primary/20">
                  <span className="text-xs font-bold text-primary">{step.number}</span>
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1">{step.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">{step.description}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-4 -right-2 w-4">
                  <ArrowRight className="w-3 h-3 text-muted-foreground/40 mx-auto" />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ─── Testimonials ────────────────────────────────────────────────────

function Testimonials() {
  return (
    <section className="py-10 sm:py-16 bg-muted/20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerContainer}
          className="text-center mb-6"
        >
          <motion.h2 variants={fadeInUp} className="text-xl sm:text-2xl font-bold tracking-tight">
            Loved by builders
          </motion.h2>
          <motion.p variants={fadeInUp} className="mt-2 text-xs text-muted-foreground">
            Real results from real users.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-3"
        >
          {testimonials.map((t) => (
            <motion.div key={t.name} variants={fadeInUp}>
              <Card className="border-border/40 bg-card/60 h-full">
                <CardContent className="p-4">
                  <p className="text-xs text-foreground leading-relaxed mb-3">&ldquo;{t.quote}&rdquo;</p>
                  {/* Metric badge */}
                  <div className="flex items-center gap-1.5 mb-3 bg-primary/10 rounded-full px-2.5 py-1">
                    <t.metricIcon className="w-3 h-3 text-primary" />
                    <span className="text-xs font-medium text-primary">{t.metric}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                      {t.avatar}
                    </div>
                    <div>
                      <div className="text-xs font-medium text-foreground">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ─── Pricing Hint ────────────────────────────────────────────────────

function PricingHint() {
  const navigate = useAppStore(s => s.navigate)

  return (
    <section className="py-10 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp}>
            <Badge variant="secondary" className="mb-3 px-2 py-0.5 text-xs">
              Simple Pricing
            </Badge>
          </motion.div>
          <motion.h2 variants={fadeInUp} className="text-xl sm:text-2xl font-bold tracking-tight">
            Free to start.{' '}
            <span className="gradient-text">Scale when ready.</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
            Start building with Forge&apos;s free tier — no credit card needed. Upgrade for unlimited generation, custom domains, and team features.
          </motion.p>
          <motion.div variants={fadeInUp} className="mt-4 flex items-center justify-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-primary" />
              Free tier included
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-primary" />
              No credit card
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-primary" />
              Cancel anytime
            </div>
          </motion.div>
          <motion.div variants={fadeInUp} className="mt-5">
            <Button
              size="sm"
              onClick={() => navigate('builder')}
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-8 px-4 text-xs"
            >
              Start for Free
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── FAQ ──────────────────────────────────────────────────────────────

function FAQ() {
  return (
    <section className="py-10 sm:py-16 bg-muted/20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerContainer}
          className="text-center mb-6"
        >
          <motion.h2 variants={fadeInUp} className="text-xl sm:text-2xl font-bold tracking-tight">
            Frequently asked questions
          </motion.h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-border/40">
                <AccordionTrigger className="text-sm font-medium hover:no-underline hover:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Footer ──────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="mt-auto border-t border-border/40 bg-muted/15">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          <div className="col-span-2 sm:col-span-1">
            <ForgeLogo className="mb-2" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              AI-powered website builder. Describe, generate, customize, ship.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground text-xs mb-2">Product</h4>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li className="hover:text-foreground transition-colors cursor-pointer">Features</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">Pricing</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">Templates</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">Changelog</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground text-xs mb-2">Resources</h4>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li className="hover:text-foreground transition-colors cursor-pointer">Documentation</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">Blog</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">Community</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">Support</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground text-xs mb-2">Legal</h4>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li className="hover:text-foreground transition-colors cursor-pointer">Privacy</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">Terms</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">Cookies</li>
            </ul>
          </div>
        </div>

        <Separator className="my-4 bg-border/40" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Forge. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <Github className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" />
            <Twitter className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" />
            <Linkedin className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" />
          </div>
        </div>
      </div>
    </footer>
  )
}

// ─── Main Component ──────────────────────────────────────────────────

export default function LandingPage() {
  const themeMode = useAppStore(s => s.themeMode)

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', themeMode === 'dark')
  }, [themeMode])

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <StatsBar />
        <ProductShowcase />
        <Features />
        <HowItWorks />
        <Testimonials />
        <PricingHint />
        <FAQ />
      </main>
      <Footer />
    </div>
  )
}
