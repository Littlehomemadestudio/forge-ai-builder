'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useAppStore, type AppView } from '@/lib/store'
import {
  Sparkles,
  Paintbrush,
  Palette,
  Download,
  Eye,
  Globe,
  ArrowRight,
  ChevronDown,
  Check,
  Star,
  Zap,
  Shield,
  Menu,
  X,
  MessageSquare,
  MousePointerClick,
  Code2,
  Layers,
  LayoutGrid,
  ShoppingCart,
  UtensilsCrossed,
  PenTool,
  FileText,
  Building2,
  Github,
  Twitter,
  Linkedin,
  Youtube,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'

// ─── Animation Helpers ───────────────────────────────────────────────

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
}

// ─── Section Data ────────────────────────────────────────────────────

const features = [
  {
    icon: Sparkles,
    title: 'AI Generation',
    description: 'Describe what you want. Our AI understands context, style, and intent to generate production-quality websites.',
    accent: 'oklch(0.85 0.08 260)',
  },
  {
    icon: Paintbrush,
    title: 'Visual Editor',
    description: 'Click, drag, refine. Every element is editable visually — no code needed, but code is always accessible.',
    accent: 'oklch(0.75 0.15 200)',
  },
  {
    icon: Palette,
    title: 'Design System',
    description: 'Built-in design tokens, spacing rules, and typography scales. Consistent, beautiful, every time.',
    accent: 'oklch(0.85 0.2 140)',
  },
  {
    icon: Download,
    title: 'Export Freedom',
    description: 'Download clean HTML, React, or Next.js code. Your website belongs to you — no lock-in, ever.',
    accent: 'oklch(0.85 0.08 260)',
  },
  {
    icon: Eye,
    title: 'Live Preview',
    description: 'See changes instantly. Real-time preview across desktop, tablet, and mobile as you build.',
    accent: 'oklch(0.75 0.15 200)',
  },
  {
    icon: Globe,
    title: 'Deploy Anywhere',
    description: 'One-click deploy to Vercel, Netlify, or your own server. Go from idea to live site in minutes.',
    accent: 'oklch(0.85 0.2 140)',
  },
]

const builderSteps = [
  { icon: MessageSquare, label: 'Type Prompt', sublabel: 'Describe your vision' },
  { icon: Sparkles, label: 'AI Generates', sublabel: 'Website appears' },
  { icon: MousePointerClick, label: 'Edit Visually', sublabel: 'Refine every detail' },
  { icon: Code2, label: 'Export / Deploy', sublabel: 'Ship it live' },
]

const showcaseSites = [
  {
    category: 'Portfolio',
    icon: PenTool,
    title: 'Creative Portfolio',
    description: 'Minimalist designer portfolio with smooth animations',
    gradient: 'from-[oklch(0.85_0.08_260)] to-[oklch(0.75_0.15_200)]',
  },
  {
    category: 'E-commerce',
    icon: ShoppingCart,
    title: 'Premium Store',
    description: 'Luxury e-commerce with product galleries and checkout',
    gradient: 'from-[oklch(0.75_0.15_200)] to-[oklch(0.85_0.2_140)]',
  },
  {
    category: 'SaaS',
    icon: Layers,
    title: 'SaaS Dashboard',
    description: 'Analytics dashboard with charts and data visualization',
    gradient: 'from-[oklch(0.85_0.2_140)] to-[oklch(0.85_0.08_260)]',
  },
  {
    category: 'Restaurant',
    icon: UtensilsCrossed,
    title: 'Bistro Website',
    description: 'Elegant restaurant site with menu and reservations',
    gradient: 'from-[oklch(0.85_0.08_260)] to-[oklch(0.7_0.15_330)]',
  },
  {
    category: 'Agency',
    icon: Building2,
    title: 'Agency Studio',
    description: 'Creative agency with case studies and team showcase',
    gradient: 'from-[oklch(0.75_0.15_200)] to-[oklch(0.85_0.08_260)]',
  },
  {
    category: 'Blog',
    icon: FileText,
    title: 'Editorial Blog',
    description: 'Typography-focused blog with reading experience',
    gradient: 'from-[oklch(0.85_0.2_140)] to-[oklch(0.75_0.15_200)]',
  },
]

const pricingPlans = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    credits: '10 AI credits/month',
    features: [
      'Basic AI generation',
      'Visual editor',
      'HTML export',
      '1 live deployment',
      'Community support',
    ],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/month',
    credits: '500 credits/month',
    features: [
      'Advanced AI generation',
      'Full visual editor',
      'All export formats',
      'Unlimited deployments',
      'Custom domains',
      'Design system library',
      'Priority support',
    ],
    cta: 'Start Pro Trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: '$49',
    period: '/month',
    credits: 'Unlimited credits',
    features: [
      'Unlimited AI generation',
      'White-label export',
      'API access',
      'Team collaboration',
      'Custom integrations',
      'SLA guarantee',
      'Dedicated support',
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
]

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Freelance Designer',
    quote: 'Forge replaced my entire design-to-code workflow. I ship client sites in hours instead of weeks.',
    avatar: 'SC',
  },
  {
    name: 'Marcus Rivera',
    role: 'Startup Founder',
    quote: 'I built our MVP landing page in 15 minutes. The AI understood exactly what I wanted — no back and forth.',
    avatar: 'MR',
  },
  {
    name: 'Aisha Patel',
    role: 'Creative Director',
    quote: 'The export quality is remarkable. Clean, semantic code that my developers actually want to work with.',
    avatar: 'AP',
  },
  {
    name: 'James Okonkwo',
    role: 'Agency Owner',
    quote: 'We went from 3-day turnarounds to same-day delivery. Forge is a game-changer for our business.',
    avatar: 'JO',
  },
]

const faqItems = [
  {
    question: 'How does the AI website generation work?',
    answer: 'You describe your website using natural language — the style, content, sections, and feel you want. Our AI model processes your prompt and generates complete, production-quality HTML, CSS, and JavaScript. It understands design principles, accessibility, and modern web standards.',
  },
  {
    question: 'Can I edit the generated website?',
    answer: 'Absolutely. Every generated website is fully editable through our visual editor. Click any element to modify its text, styles, layout, or animation. You can also switch to code view for direct editing. Changes are reflected in real-time.',
  },
  {
    question: 'What export formats are available?',
    answer: 'Free users can export clean HTML/CSS/JS. Pro users get React components, Next.js projects, and Tailwind CSS configurations. Enterprise users can white-label exports and access our API for programmatic generation.',
  },
  {
    question: 'Where can I deploy my website?',
    answer: 'One-click deployment to Vercel, Netlify, and Cloudflare Pages. You can also download the code and deploy to any server — AWS, DigitalOcean, your own VPS, or any static hosting provider. No lock-in whatsoever.',
  },
  {
    question: 'Do I own the generated code?',
    answer: 'Yes, 100%. All code generated by Forge belongs to you. There are no licensing restrictions, no attribution requirements, and no lock-in. Export it, modify it, sell it — it\'s yours.',
  },
  {
    question: 'How are AI credits consumed?',
    answer: 'Each generation consumes 1 credit. Refinements and edits within the visual editor are free. Pro plans include 500 credits/month (enough for most users), and Enterprise plans have unlimited generation.',
  },
  {
    question: 'Is there a free trial for Pro?',
    answer: 'Yes — every new user gets a 7-day Pro trial with full access to all features. No credit card required. After the trial, you can continue on the Free plan or upgrade to Pro.',
  },
  {
    question: 'Can I use Forge for client projects?',
    answer: 'Absolutely. Many agencies and freelancers use Forge to deliver client websites faster. Pro and Enterprise plans include features specifically designed for professional workflows — custom domains, white-label exports, and team collaboration.',
  },
]

// ─── Typing Animation Component ──────────────────────────────────────

function TypingAnimation() {
  const prompts = [
    'A minimalist portfolio for a photographer with dark theme...',
    'SaaS landing page with pricing, testimonials, and hero...',
    'Restaurant website with menu cards and reservation form...',
    'E-commerce store for luxury watches with product grid...',
  ]
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const isDeletingRef = useRef(false)
  const [isDeletingFlag, setIsDeletingFlag] = useState(false)

  useEffect(() => {
    const currentPrompt = prompts[currentPromptIndex]
    let timeout: NodeJS.Timeout

    if (!isDeletingRef.current) {
      if (displayedText.length < currentPrompt.length) {
        timeout = setTimeout(() => {
          setDisplayedText(currentPrompt.slice(0, displayedText.length + 1))
        }, 40 + Math.random() * 30)
      } else {
        timeout = setTimeout(() => {
          isDeletingRef.current = true
          setIsDeletingFlag(true)
        }, 2000)
      }
    } else {
      if (displayedText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayedText(displayedText.slice(0, -1))
        }, 20)
      } else {
        timeout = setTimeout(() => {
          isDeletingRef.current = false
          setIsDeletingFlag(false)
          setCurrentPromptIndex((prev) => (prev + 1) % prompts.length)
        }, 0)
      }
    }

    return () => clearTimeout(timeout)
  }, [displayedText, currentPromptIndex, isDeletingFlag])

  return (
    <span className="font-mono">
      {displayedText}
      <span className="animate-blink-cursor text-[oklch(0.85_0.08_260)]">|</span>
    </span>
  )
}

// ─── Mouse Glow Tracker ──────────────────────────────────────────────

function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const navigate = useAppStore((s) => s.navigate)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!heroRef.current) return
    const rect = heroRef.current.getBoundingClientRect()
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }, [])

  return (
    <section
      ref={heroRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 noise" style={{ zIndex: 0 }}>
        {/* Morphing gradient blobs */}
        <div
          className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] animate-morph animate-pulse-glow"
          style={{
            background: 'radial-gradient(circle, oklch(0.85 0.08 260 / 30%), transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          className="absolute top-1/2 -right-1/4 w-[500px] h-[500px] animate-morph"
          style={{
            background: 'radial-gradient(circle, oklch(0.75 0.15 200 / 25%), transparent 70%)',
            filter: 'blur(80px)',
            animationDelay: '-4s',
          }}
        />
        <div
          className="absolute -bottom-1/4 left-1/3 w-[400px] h-[400px] animate-morph"
          style={{
            background: 'radial-gradient(circle, oklch(0.85 0.2 140 / 20%), transparent 70%)',
            filter: 'blur(80px)',
            animationDelay: '-2s',
          }}
        />

        {/* Mouse-tracking glow */}
        <div
          className="absolute transition-all duration-300 ease-out"
          style={{
            left: mousePos.x - 200,
            top: mousePos.y - 200,
            width: 400,
            height: 400,
            background: 'radial-gradient(circle, oklch(0.85 0.08 260 / 8%), transparent 70%)',
            filter: 'blur(40px)',
            pointerEvents: 'none',
          }}
        />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(oklch(1 0 0 / 1px) 1px, transparent 1px),
              linear-gradient(90deg, oklch(1 0 0 / 1px) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-medium text-muted-foreground">
            <Zap className="w-3 h-3 text-[oklch(0.85_0.08_260)]" />
            Now with AI-powered design systems
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
        >
          <span className="block">Build websites with AI.</span>
          <span className="block gradient-text">Ship in seconds.</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed"
        >
          Describe your vision. Forge generates production-quality websites you can edit visually, export cleanly, and deploy anywhere.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12"
        >
          <Button
            onClick={() => navigate('builder')}
            size="lg"
            className="bg-[oklch(0.85_0.08_260)] text-[oklch(0.15_0.01_260)] hover:bg-[oklch(0.85_0.08_260/90%)] h-12 px-8 text-base font-semibold rounded-xl"
          >
            Start Building
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-12 px-8 text-base font-medium rounded-xl border-border/50 hover:border-border"
          >
            See Examples
          </Button>
        </motion.div>

        {/* Typing prompt preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="relative max-w-2xl mx-auto"
        >
          <div className="glass rounded-2xl p-4 sm:p-6 shadow-2xl">
            {/* Prompt bar */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[oklch(0.577_0.245_27.325/80%)]" />
                <div className="w-3 h-3 rounded-full bg-[oklch(0.75_0.15_200/80%)]" />
                <div className="w-3 h-3 rounded-full bg-[oklch(0.85_0.2_140/80%)]" />
              </div>
              <span className="text-xs text-muted-foreground font-mono">forge.ai</span>
            </div>

            {/* Typing area */}
            <div className="bg-[oklch(0.05_0.01_260)] rounded-xl p-4 sm:p-5 text-sm sm:text-base">
              <div className="flex items-start gap-2">
                <Sparkles className="w-5 h-5 text-[oklch(0.85_0.08_260)] shrink-0 mt-0.5" />
                <div className="text-foreground/80 min-h-[1.5em]">
                  <TypingAnimation />
                </div>
              </div>
            </div>

            {/* Generated preview hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="mt-4 flex items-center gap-2 text-xs text-muted-foreground"
            >
              <div className="w-2 h-2 rounded-full bg-[oklch(0.85_0.2_140)]" />
              AI understands context, style, and layout intent
            </motion.div>
          </div>

          {/* Floating decorative elements */}
          <motion.div
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-6 -right-4 glass rounded-xl p-3 shadow-lg hidden sm:block"
          >
            <LayoutGrid className="w-5 h-5 text-[oklch(0.75_0.15_200)]" />
          </motion.div>
          <motion.div
            animate={{ y: [10, -10, 10] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-6 -left-4 glass rounded-xl p-3 shadow-lg hidden sm:block"
          >
            <Palette className="w-5 h-5 text-[oklch(0.85_0.08_260)]" />
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  )
}

// ─── Features Section ─────────────────────────────────────────────────

function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Everything you need.
            <span className="gradient-text"> Nothing you don&apos;t.</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From idea to live website — Forge handles generation, editing, and deployment so you can focus on creating.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={fadeInUp}>
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="glass rounded-2xl p-6 sm:p-8 group cursor-default h-full"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-colors duration-300"
                  style={{
                    background: `${feature.accent} / 15%`,
                  }}
                >
                  <feature.icon
                    className="w-6 h-6 transition-colors duration-300"
                    style={{ color: feature.accent }}
                  />
                </div>
                <h3 className="text-xl font-semibold mb-3 tracking-tight">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{feature.description}</p>

                {/* Hover glow */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 50% 0%, ${feature.accent} / 5%, transparent 70%)`,
                  }}
                />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ─── AI Builder Explanation ──────────────────────────────────────────

function BuilderExplanationSection() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            How it works
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Four steps. Zero friction.
          </motion.p>
        </motion.div>

        {/* Steps with connecting lines */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative"
        >
          {builderSteps.map((step, index) => (
            <motion.div key={step.label} variants={fadeInUp} className="relative">
              {/* Connecting line (desktop only) */}
              {index < builderSteps.length - 1 && (
                <div className="hidden lg:block absolute top-12 -right-4 w-8 h-[2px]">
                  <div className="w-full h-full bg-gradient-to-r from-border to-transparent" />
                </div>
              )}

              <motion.div whileHover={{ y: -4 }} className="text-center group">
                {/* Step number */}
                <div className="text-xs font-mono text-muted-foreground mb-3">0{index + 1}</div>

                {/* Icon circle */}
                <div
                  className="w-16 h-16 rounded-2xl glass mx-auto mb-5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                  style={{
                    boxShadow: `0 0 30px ${index === 0 ? 'oklch(0.85 0.08 260 / 15%)' : index === 1 ? 'oklch(0.75 0.15 200 / 15%)' : index === 2 ? 'oklch(0.85 0.2 140 / 15%)' : 'oklch(0.85 0.08 260 / 15%)'}`,
                  }}
                >
                  <step.icon
                    className="w-7 h-7"
                    style={{
                      color: index === 0 ? 'oklch(0.85 0.08 260)' : index === 1 ? 'oklch(0.75 0.15 200)' : index === 2 ? 'oklch(0.85 0.2 140)' : 'oklch(0.85 0.08 260)',
                    }}
                  />
                </div>

                <h3 className="text-lg font-semibold mb-2 tracking-tight">{step.label}</h3>
                <p className="text-sm text-muted-foreground">{step.sublabel}</p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ─── Live Builder Preview ────────────────────────────────────────────

function LiveBuilderPreview() {
  const [activeStep, setActiveStep] = useState(0)
  const navigate = useAppStore((s) => s.navigate)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const steps = [
    { label: 'Prompt', content: 'A sleek SaaS dashboard with analytics cards, user charts, and a clean navigation sidebar...' },
    { label: 'Generating', content: 'AI is analyzing your prompt and generating layout structures...' },
    { label: 'Preview', content: 'Website generated — viewing live preview with responsive breakpoints' },
    { label: 'Export', content: 'Exporting as Next.js project with Tailwind CSS and clean component structure' },
  ]

  return (
    <section className="relative py-24 sm:py-32">
      {/* Background accent */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-[0.03]"
          style={{
            background: 'radial-gradient(circle, oklch(0.85 0.08 260), transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          className="text-center mb-12"
        >
          <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            See it in action
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From prompt to production — watch the entire workflow.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="glass rounded-2xl p-4 sm:p-6 shadow-2xl">
            {/* Builder mock UI */}
            <div className="bg-[oklch(0.05_0.01_260)] rounded-xl overflow-hidden">
              {/* Top bar */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[oklch(0.25_0.02_260)]">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[oklch(0.577_0.245_27.325/80%)]" />
                    <div className="w-3 h-3 rounded-full bg-[oklch(0.75_0.15_200/80%)]" />
                    <div className="w-3 h-3 rounded-full bg-[oklch(0.85_0.2_140/80%)]" />
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">Forge Builder</span>
                </div>

                {/* Step indicators */}
                <div className="flex items-center gap-2">
                  {steps.map((step, i) => (
                    <motion.div
                      key={step.label}
                      animate={{
                        backgroundColor: i <= activeStep ? 'oklch(0.85 0.08 260)' : 'oklch(0.25 0.02 260)',
                        scale: i === activeStep ? 1.1 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                      className="w-2 h-2 rounded-full"
                    />
                  ))}
                </div>
              </div>

              {/* Main content area */}
              <div className="flex flex-col sm:flex-row min-h-[280px] sm:min-h-[320px]">
                {/* Left panel - prompt/edit */}
                <div className="sm:w-1/2 p-4 sm:p-6 border-b sm:border-b-0 sm:border-r border-[oklch(0.25_0.02_260)]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeStep}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        {activeStep === 0 && <MessageSquare className="w-4 h-4 text-[oklch(0.85_0.08_260)]" />}
                        {activeStep === 1 && <Sparkles className="w-4 h-4 text-[oklch(0.75_0.15_200)] animate-pulse" />}
                        {activeStep === 2 && <MousePointerClick className="w-4 h-4 text-[oklch(0.85_0.2_140)]" />}
                        {activeStep === 3 && <Code2 className="w-4 h-4 text-[oklch(0.85_0.08_260)]" />}
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          {steps[activeStep].label}
                        </span>
                      </div>
                      <p className="text-sm text-foreground/70 leading-relaxed font-mono">
                        {steps[activeStep].content}
                      </p>
                    </motion.div>
                  </AnimatePresence>

                  {/* Progress bar for generating */}
                  {activeStep === 1 && (
                    <motion.div
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 2.5, ease: 'easeInOut' }}
                      className="mt-4 h-1 rounded-full bg-gradient-to-r from-[oklch(0.85_0.08_260)] to-[oklch(0.75_0.15_200)]"
                    />
                  )}
                </div>

                {/* Right panel - preview */}
                <div className="sm:w-1/2 p-4 sm:p-6 flex items-center justify-center">
                  {activeStep < 2 ? (
                    <motion.div
                      animate={{ opacity: activeStep === 0 ? 0.3 : [0.3, 0.6, 0.3] }}
                      transition={{ duration: activeStep === 0 ? 0.3 : 2, repeat: activeStep === 1 ? Infinity : 0 }}
                      className="w-full space-y-3"
                    >
                      {/* Skeleton preview */}
                      <div className="h-8 rounded-lg bg-[oklch(0.15_0.01_260)] shimmer" />
                      <div className="grid grid-cols-3 gap-2">
                        <div className="h-16 rounded-lg bg-[oklch(0.15_0.01_260)] shimmer" />
                        <div className="h-16 rounded-lg bg-[oklch(0.15_0.01_260)] shimmer" />
                        <div className="h-16 rounded-lg bg-[oklch(0.15_0.01_260)] shimmer" />
                      </div>
                      <div className="h-24 rounded-lg bg-[oklch(0.15_0.01_260)] shimmer" />
                      <div className="grid grid-cols-2 gap-2">
                        <div className="h-12 rounded-lg bg-[oklch(0.15_0.01_260)] shimmer" />
                        <div className="h-12 rounded-lg bg-[oklch(0.15_0.01_260)] shimmer" />
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="w-full space-y-3"
                    >
                      {/* Generated preview */}
                      <div className="h-8 rounded-lg bg-[oklch(0.15_0.01_260)] flex items-center px-3">
                        <div className="flex gap-2">
                          <div className="w-6 h-2 rounded bg-[oklch(0.85_0.08_260/30%)]" />
                          <div className="w-8 h-2 rounded bg-[oklch(0.3_0.02_260)]" />
                          <div className="w-8 h-2 rounded bg-[oklch(0.3_0.02_260)]" />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="h-16 rounded-lg bg-[oklch(0.15_0.01_260)] flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-[oklch(0.85_0.08_260/15%)]" />
                        </div>
                        <div className="h-16 rounded-lg bg-[oklch(0.15_0.01_260)] flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-[oklch(0.75_0.15_200/15%)]" />
                        </div>
                        <div className="h-16 rounded-lg bg-[oklch(0.15_0.01_260)] flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-[oklch(0.85_0.2_140/15%)]" />
                        </div>
                      </div>
                      <div className="h-24 rounded-lg bg-[oklch(0.15_0.01_260)] flex items-center justify-center">
                        <div className="w-3/4 h-3/4 rounded bg-[oklch(0.75_0.15_200/10%)]" />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="h-12 rounded-lg bg-[oklch(0.15_0.01_260)]" />
                        <div className="h-12 rounded-lg bg-[oklch(0.15_0.01_260)]" />
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            {/* Try it button */}
            <div className="mt-4 text-center">
              <Button
                onClick={() => navigate('builder')}
                className="bg-[oklch(0.85_0.08_260)] text-[oklch(0.15_0.01_260)] hover:bg-[oklch(0.85_0.08_260/90%)] rounded-xl"
              >
                Try the Builder
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Showcase Section ─────────────────────────────────────────────────

function ShowcaseSection() {
  return (
    <section id="showcase" className="relative py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Built with Forge
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real websites, generated in minutes. Each one started as a single prompt.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          {showcaseSites.map((site) => (
            <motion.div key={site.title} variants={scaleIn}>
              <motion.div
                whileHover={{ y: -6, scale: 1.03 }}
                transition={{ duration: 0.25 }}
                className="glass rounded-2xl overflow-hidden group cursor-default"
              >
                {/* Preview area */}
                <div className={`h-40 sm:h-48 bg-gradient-to-br ${site.gradient} relative overflow-hidden`}>
                  {/* Mock website skeleton */}
                  <div className="absolute inset-4 rounded-lg bg-[oklch(0.05_0.01_260/80%)] p-3">
                    <div className="h-4 w-1/3 rounded bg-white/10 mb-3" />
                    <div className="h-2 w-2/3 rounded bg-white/5 mb-2" />
                    <div className="h-2 w-1/2 rounded bg-white/5 mb-4" />
                    <div className="grid grid-cols-2 gap-2">
                      <div className="h-10 rounded bg-white/5" />
                      <div className="h-10 rounded bg-white/5" />
                    </div>
                    <div className="mt-3 h-12 rounded bg-white/5" />
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-[oklch(0.05_0.01_260/60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-sm font-medium text-foreground/80">View Site</span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 sm:p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <site.icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{site.category}</span>
                  </div>
                  <h3 className="text-base font-semibold mb-1 tracking-tight">{site.title}</h3>
                  <p className="text-xs text-muted-foreground">{site.description}</p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ─── Pricing Section ──────────────────────────────────────────────────

function PricingSection() {
  const navigate = useAppStore((s) => s.navigate)

  return (
    <section id="pricing" className="relative py-24 sm:py-32">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Simple pricing.
            <span className="gradient-text"> No surprises.</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start free. Upgrade when you need more power.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerContainer}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {pricingPlans.map((plan) => (
            <motion.div key={plan.name} variants={fadeInUp}>
              <motion.div
                whileHover={{ y: -4 }}
                className={`rounded-2xl p-6 sm:p-8 h-full ${
                  plan.highlighted
                    ? 'glass-strong border-[oklch(0.85_0.08_260/30%)] relative'
                    : 'glass'
                }`}
              >
                {/* Highlight badge */}
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[oklch(0.85_0.08_260)] text-[oklch(0.15_0.01_260)] text-xs font-semibold">
                    Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-1">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{plan.credits}</p>
                </div>

                <div className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <Check
                        className="w-4 h-4 shrink-0"
                        style={{ color: plan.highlighted ? 'oklch(0.85 0.08 260)' : 'oklch(0.65 0.02 260)' }}
                      />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => navigate(plan.highlighted ? 'register' : 'login')}
                  className={`w-full rounded-xl h-11 ${
                    plan.highlighted
                      ? 'bg-[oklch(0.85_0.08_260)] text-[oklch(0.15_0.01_260)] hover:bg-[oklch(0.85_0.08_260/90%)]'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  {plan.cta}
                </Button>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ─── Testimonials Section ─────────────────────────────────────────────

function TestimonialsSection() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Loved by builders
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Designers, founders, and agencies building faster with Forge.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
        >
          {testimonials.map((testimonial) => (
            <motion.div key={testimonial.name} variants={fadeInUp}>
              <motion.div
                whileHover={{ y: -3 }}
                className="glass rounded-2xl p-6 sm:p-8 group"
              >
                {/* Quote */}
                <div className="mb-6">
                  <p className="text-base sm:text-lg leading-relaxed text-foreground/80">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                </div>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold"
                    style={{
                      background: 'oklch(0.85 0.08 260 / 15%)',
                      color: 'oklch(0.85 0.08 260)',
                    }}
                  >
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{testimonial.name}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex gap-0.5 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3.5 h-3.5 fill-[oklch(0.85_0.08_260)]"
                      style={{ color: 'oklch(0.85 0.08 260)' }}
                    />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ─── FAQ Section ──────────────────────────────────────────────────────

function FAQSection() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          className="text-center mb-12"
        >
          <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Questions? Answered.
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-lg text-muted-foreground">
            Everything you need to know about Forge.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Accordion type="single" collapsible className="glass rounded-2xl p-2">
            {faqItems.map((item, index) => (
              <AccordionItem
                key={index}
                value={`faq-${index}`}
                className="border-[oklch(0.25_0.02_260)] px-4"
              >
                <AccordionTrigger className="text-base font-medium hover:text-[oklch(0.85_0.08_260)] py-5">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────

function Footer() {
  const navigate = useAppStore((s) => s.navigate)

  const footerLinks = {
    Product: [
      { label: 'Features', action: () => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }) },
      { label: 'Pricing', action: () => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }) },
      { label: 'Showcase', action: () => document.getElementById('showcase')?.scrollIntoView({ behavior: 'smooth' }) },
      { label: 'Builder', action: () => navigate('builder') },
    ],
    Resources: [
      { label: 'Documentation', action: () => {} },
      { label: 'API Reference', action: () => {} },
      { label: 'Tutorials', action: () => {} },
      { label: 'Blog', action: () => {} },
    ],
    Company: [
      { label: 'About', action: () => {} },
      { label: 'Careers', action: () => {} },
      { label: 'Contact', action: () => {} },
      { label: 'Legal', action: () => {} },
    ],
  }

  const socialLinks = [
    { icon: Github, label: 'GitHub' },
    { icon: Twitter, label: 'Twitter' },
    { icon: Linkedin, label: 'LinkedIn' },
    { icon: Youtube, label: 'YouTube' },
  ]

  return (
    <footer className="mt-auto border-t border-[oklch(0.25_0.02_260)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-12">
          {/* Brand column */}
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[oklch(0.85_0.08_260)] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[oklch(0.15_0.01_260)]" />
              </div>
              <span className="text-lg font-bold tracking-tight">Forge</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Build websites with AI. Ship in seconds. No lock-in, no compromise.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={link.action}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-[oklch(0.25_0.02_260)]">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Forge. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <button
                key={social.label}
                className="w-8 h-8 rounded-lg glass flex items-center justify-center hover:scale-110 transition-transform"
                aria-label={social.label}
              >
                <social.icon className="w-4 h-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

// ─── Navigation Bar ───────────────────────────────────────────────────

function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useAppStore((s) => s.navigate)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'Features', href: 'features' },
    { label: 'Pricing', href: 'pricing' },
    { label: 'Showcase', href: 'showcase' },
  ]

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setIsMobileMenuOpen(false)
  }

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass-strong shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[oklch(0.85_0.08_260)] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[oklch(0.15_0.01_260)]" />
            </div>
            <span className="text-lg font-bold tracking-tight">Forge</span>
          </div>

          {/* Desktop nav links */}
          <div className="hidden sm:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollToSection(link.href)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Desktop auth buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => navigate('login')}
              className="text-sm"
            >
              Login
            </Button>
            <Button
              onClick={() => navigate('register')}
              className="bg-[oklch(0.85_0.08_260)] text-[oklch(0.15_0.01_260)] hover:bg-[oklch(0.85_0.08_260/90%)] text-sm rounded-xl"
            >
              Sign Up
            </Button>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="sm:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="sm:hidden glass-strong border-t border-[oklch(0.25_0.02_260)]"
          >
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => scrollToSection(link.href)}
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                >
                  {link.label}
                </button>
              ))}
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => { navigate('login'); setIsMobileMenuOpen(false) }}
                  className="flex-1 text-sm rounded-xl"
                >
                  Login
                </Button>
                <Button
                  onClick={() => { navigate('register'); setIsMobileMenuOpen(false) }}
                  className="flex-1 bg-[oklch(0.85_0.08_260)] text-[oklch(0.15_0.01_260)] hover:bg-[oklch(0.85_0.08_260/90%)] text-sm rounded-xl"
                >
                  Sign Up
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

// ─── Main Landing Page ────────────────────────────────────────────────

interface LandingPageProps {
  onNavigate?: (view: AppView) => void
  onLogin?: () => void
}

export default function LandingPage({ onNavigate, onLogin }: LandingPageProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavBar />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <BuilderExplanationSection />
        <LiveBuilderPreview />
        <ShowcaseSection />
        <PricingSection />
        <TestimonialsSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  )
}
