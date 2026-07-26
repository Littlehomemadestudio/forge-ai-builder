'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import {
  Sparkles,
  Paintbrush,
  Download,
  Rocket,
  Sun,
  Moon,
  ArrowRight,
  Star,
  Zap,
  Shield,
  Code2,
  Layers,
  MousePointerClick,
  Github,
  Twitter,
  Linkedin,
  ChevronDown,
  Hexagon,
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

// ─── Animation Helpers ───────────────────────────────────────────────

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

// ─── Data ────────────────────────────────────────────────────────────

const features = [
  {
    icon: Sparkles,
    title: 'AI Generation',
    description: 'Describe your vision in plain language. Forge understands context, style, and intent to craft production-quality websites.',
  },
  {
    icon: Paintbrush,
    title: 'Visual Editor',
    description: 'Refine every detail with an intuitive editor. Drag, drop, tweak — or let AI handle the heavy lifting.',
  },
  {
    icon: Download,
    title: 'Export Freedom',
    description: 'Your code is yours. Export clean HTML, CSS, and JS anytime — no lock-in, no vendor dependency.',
  },
  {
    icon: Rocket,
    title: 'Deploy Anywhere',
    description: 'Ship to any platform in seconds. Vercel, Netlify, or your own server — Forge doesn\'t tie you down.',
  },
]

const steps = [
  {
    number: '01',
    title: 'Describe',
    description: 'Tell Forge what you want. A portfolio, a SaaS landing page, a restaurant site — just describe it naturally.',
    icon: MousePointerClick,
  },
  {
    number: '02',
    title: 'AI Builds',
    description: 'Our AI generates a complete, responsive website with proper structure, styling, and interactions in seconds.',
    icon: Zap,
  },
  {
    number: '03',
    title: 'Customize & Ship',
    description: 'Polish with the visual editor, then deploy anywhere. Your site, your code, your choice of platform.',
    icon: Rocket,
  },
]

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Founder, Lumina Design',
    quote: 'Forge turned my rough idea into a stunning website in under 2 minutes. The AI understood exactly what I wanted.',
    avatar: 'SC',
  },
  {
    name: 'Marcus Rivera',
    role: 'CTO, BuildStack',
    quote: 'We replaced weeks of frontend work with Forge. The export quality is so clean our devs actually prefer it.',
    avatar: 'MR',
  },
  {
    name: 'Aisha Patel',
    role: 'Freelance Developer',
    quote: 'I use Forge for every client project now. It handles the initial build, I customize — client gets results faster.',
    avatar: 'AP',
  },
]

const faqs = [
  {
    question: 'How does Forge\'s AI generate websites?',
    answer: 'Forge uses advanced AI models that understand web design principles, user experience patterns, and modern development practices. You describe what you want, and the AI generates complete, responsive code — not templates, but custom-built sites tailored to your description.',
  },
  {
    question: 'Can I edit the generated code?',
    answer: 'Absolutely. Forge includes a visual editor for quick tweaks, and you can export the full source code (HTML, CSS, JS) to edit in any tool you prefer. There\'s no lock-in — the code is yours.',
  },
  {
    question: 'Is Forge free to use?',
    answer: 'Forge offers a generous free tier that lets you generate and customize multiple sites. When you\'re ready for advanced features like custom domains, team collaboration, or priority generation, our Pro plan has you covered.',
  },
  {
    question: 'What frameworks or platforms does Forge support?',
    answer: 'Forge generates standard web code that works everywhere. Deploy to Vercel, Netlify, AWS, GitHub Pages, or any hosting provider. The output is clean, framework-free HTML/CSS/JS that any platform can serve.',
  },
  {
    question: 'How does Forge compare to traditional website builders?',
    answer: 'Traditional builders give you templates and drag-and-drop. Forge gives you AI-powered generation that creates unique, custom designs from your description — then lets you refine with visual editing and export clean code. It\'s faster, more flexible, and produces better results.',
  },
]

// ─── Hexagonal Logo ──────────────────────────────────────────────────

function ForgeLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Hexagon className="w-7 h-7 text-primary fill-primary/20" strokeWidth={2.5} />
      <span className="text-xl font-bold tracking-tight text-foreground">Forge</span>
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
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl"
    >
      <div className="mx-auto max-w-6xl flex items-center justify-between h-14 px-4 sm:px-6">
        <ForgeLogo />
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Toggle theme"
          >
            {themeMode === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('login')}
            className="text-muted-foreground hover:text-foreground hidden sm:inline-flex"
          >
            Sign in
          </Button>
          <Button
            size="sm"
            onClick={() => navigate('builder')}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Get Started
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
      </div>
    </motion.nav>
  )
}

// ─── Hero ────────────────────────────────────────────────────────────

function Hero() {
  const navigate = useAppStore(s => s.navigate)

  return (
    <section className="relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/8 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px]" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-20 sm:pt-28 pb-16 sm:pb-24 text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="flex flex-col items-center"
        >
          <motion.div variants={fadeInUp}>
            <Badge variant="secondary" className="mb-6 px-3 py-1 text-sm font-medium">
              <Sparkles className="w-3 h-3 mr-1.5 text-primary" />
              AI-Powered Website Builder
            </Badge>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl leading-[1.1]"
          >
            Your idea. Our AI.{' '}
            <span className="gradient-text">A complete website.</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed"
          >
            Describe what you want, and Forge builds it in seconds. No templates, no coding, no compromise. Just results.
          </motion.p>

          <motion.div variants={fadeInUp} className="mt-8 flex flex-col sm:flex-row items-center gap-3">
            <Button
              size="lg"
              onClick={() => navigate('builder')}
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 text-base"
            >
              Start Building
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-12 px-8 text-base border-border"
            >
              See How It Works
            </Button>
          </motion.div>

          <motion.div variants={fadeInUp} className="mt-12 flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-primary" />
              No lock-in
            </div>
            <div className="flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-primary" />
              Clean code export
            </div>
            <div className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-primary" />
              Deploy anywhere
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Features ────────────────────────────────────────────────────────

function Features() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainer}
          className="text-center mb-12"
        >
          <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold tracking-tight">
            Everything you need,{' '}
            <span className="gradient-text">nothing you don&apos;t</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
            Forge combines AI generation, visual editing, and full code export in one seamless workflow.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={fadeInUp}>
              <Card className="border-border/50 bg-card/50 hover:border-primary/30 transition-colors duration-300 h-full">
                <CardContent className="p-6">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
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
    <section className="py-16 sm:py-24 bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainer}
          className="text-center mb-12"
        >
          <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold tracking-tight">
            Three steps.{' '}
            <span className="gradient-text">That&apos;s it.</span>
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8"
        >
          {steps.map((step, i) => (
            <motion.div key={step.number} variants={fadeInUp} className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 ring-1 ring-primary/20">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>
                <span className="text-xs font-mono text-primary/70 mb-2">{step.number}</span>
                <h3 className="font-semibold text-foreground text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">{step.description}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-7 -right-4 w-8">
                  <ArrowRight className="w-4 h-4 text-muted-foreground/50 mx-auto" />
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
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainer}
          className="text-center mb-12"
        >
          <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold tracking-tight">
            Loved by builders
          </motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 text-muted-foreground text-lg">
            See what people are saying about Forge.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6"
        >
          {testimonials.map((t) => (
            <motion.div key={t.name} variants={fadeInUp}>
              <Card className="border-border/50 bg-card/50 h-full">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-sm text-foreground leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                      {t.avatar}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">{t.name}</div>
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
    <section className="py-16 sm:py-24 bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp}>
            <Badge variant="secondary" className="mb-4 px-3 py-1">
              Simple Pricing
            </Badge>
          </motion.div>
          <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold tracking-tight">
            Free to start.{' '}
            <span className="gradient-text">Scale when ready.</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
            Start building with Forge&apos;s free tier — no credit card needed. Upgrade to Pro for unlimited generation, custom domains, and team features.
          </motion.p>
          <motion.div variants={fadeInUp} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-primary" />
                Free tier included
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-primary" />
                No credit card
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-primary" />
                Cancel anytime
              </div>
            </div>
          </motion.div>
          <motion.div variants={fadeInUp} className="mt-6">
            <Button
              size="lg"
              onClick={() => navigate('builder')}
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 text-base"
            >
              Start for Free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function CheckCircle({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

// ─── FAQ ──────────────────────────────────────────────────────────────

function FAQ() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainer}
          className="text-center mb-12"
        >
          <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold tracking-tight">
            Frequently asked questions
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeInUp}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-border/50">
                <AccordionTrigger className="text-foreground font-medium hover:no-underline hover:text-primary text-sm sm:text-base">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
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
    <footer className="mt-auto border-t border-border/50 bg-muted/20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <ForgeLogo className="mb-4" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              AI-powered website builder. Describe, generate, customize, ship.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground text-sm mb-3">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-foreground transition-colors cursor-pointer">Features</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">Pricing</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">Templates</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">Changelog</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground text-sm mb-3">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-foreground transition-colors cursor-pointer">Documentation</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">Blog</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">Community</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">Support</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground text-sm mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-foreground transition-colors cursor-pointer">Privacy</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">Terms</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">Cookies</li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-border/50" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Forge. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Github className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" />
            <Twitter className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" />
            <Linkedin className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" />
          </div>
        </div>
      </div>
    </footer>
  )
}

// ─── Main Component ──────────────────────────────────────────────────

export default function LandingPage() {
  // Sync theme on mount
  const themeMode = useAppStore(s => s.themeMode)

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', themeMode === 'dark')
  }, [themeMode])

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        <Hero />
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
