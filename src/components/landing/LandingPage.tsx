'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
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
  MousePointerClick,
  Github,
  Twitter,
  Linkedin,
  Hexagon,
  Eye,
  LayoutGrid,
  Palette,
  CheckCircle2,
  Globe,
  TrendingUp,
  Clock,
  Users,
  Shuffle,
  Trash2,
  RotateCcw,
  Type,
  Layout,
  MessageSquare,
  DollarSign,
  Star,
  Columns3,
  Wand2,
  ChevronRight,
  GripVertical,
  Play,
  Code2,
  Layers,
  Monitor,
  Smartphone,
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
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
}

const slideInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const slideInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
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
    const startTime = performance.now()

    const animate = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(target * eased))
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
    accentColor: 'oklch(0.65 0.25 350)',
  },
  {
    icon: Paintbrush,
    title: 'Visual Editor',
    description: 'Refine every detail with an intuitive editor. Drag, drop, tweak — or let AI handle it.',
    accentColor: 'oklch(0.65 0.2 180)',
  },
  {
    icon: Download,
    title: 'Export Freedom',
    description: 'Export clean HTML, CSS, and JS anytime — no lock-in, no vendor dependency.',
    accentColor: 'oklch(0.65 0.2 80)',
  },
  {
    icon: Rocket,
    title: 'Deploy Anywhere',
    description: 'Ship to Vercel, Netlify, or your own server. Forge doesn\'t tie you down.',
    accentColor: 'oklch(0.55 0.25 270)',
  },
]

const steps = [
  {
    number: '1',
    title: 'Describe',
    description: 'Tell Forge what you want — a portfolio, SaaS page, restaurant site, anything.',
    icon: MousePointerClick,
    accentColor: 'oklch(0.55 0.25 270)',
  },
  {
    number: '2',
    title: 'AI Builds',
    description: 'Forge generates a complete, responsive website with proper structure in seconds.',
    icon: Zap,
    accentColor: 'oklch(0.55 0.25 270)',
  },
  {
    number: '3',
    title: 'Customize & Ship',
    description: 'Polish with the visual editor, then deploy anywhere. Your site, your code.',
    icon: Rocket,
    accentColor: 'oklch(0.55 0.25 270)',
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

// ─── Builder Playground Block Types ─────────────────────────────────

interface PlaygroundBlock {
  id: string
  label: string
  icon: React.ElementType
  color: string
  bgGradient: string
  height: string
}

const BLOCK_TYPES: PlaygroundBlock[] = [
  { id: 'hero', label: 'Hero', icon: Layout, color: 'oklch(0.55 0.25 270)', bgGradient: 'linear-gradient(135deg, oklch(0.55 0.25 270), oklch(0.45 0.2 290))', height: 'h-12' },
  { id: 'features', label: 'Features', icon: Columns3, color: 'oklch(0.6 0.2 180)', bgGradient: 'linear-gradient(135deg, oklch(0.6 0.2 180), oklch(0.5 0.15 160))', height: 'h-10' },
  { id: 'pricing', label: 'Pricing', icon: DollarSign, color: 'oklch(0.65 0.2 80)', bgGradient: 'linear-gradient(135deg, oklch(0.65 0.2 80), oklch(0.55 0.18 60))', height: 'h-10' },
  { id: 'testimonials', label: 'Testimonials', icon: Star, color: 'oklch(0.6 0.2 160)', bgGradient: 'linear-gradient(135deg, oklch(0.6 0.2 160), oklch(0.5 0.15 140))', height: 'h-10' },
  { id: 'cta', label: 'CTA', icon: MessageSquare, color: 'oklch(0.55 0.25 270)', bgGradient: 'linear-gradient(135deg, oklch(0.55 0.25 270), oklch(0.5 0.2 290))', height: 'h-8' },
  { id: 'footer', label: 'Footer', icon: Type, color: 'oklch(0.5 0.15 260)', bgGradient: 'linear-gradient(135deg, oklch(0.5 0.15 260), oklch(0.4 0.1 260))', height: 'h-6' },
]

// ─── Interactive Builder Playground ──────────────────────────────────

function BuilderPlayground({ isDark }: { isDark: boolean }) {
  const [placedBlocks, setPlacedBlocks] = useState<PlaygroundBlock[]>([])
  const [draggedBlock, setDraggedBlock] = useState<string | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  const handleDragStart = useCallback((blockId: string) => {
    setDraggedBlock(blockId)
  }, [])

  const handleDragEnd = useCallback(() => {
    setDraggedBlock(null)
    setDragOverIndex(null)
  }, [])

  const handleCanvasDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (!draggedBlock) return
    const block = BLOCK_TYPES.find(b => b.id === draggedBlock)
    if (block) {
      const newBlock = { ...block, id: `${block.id}-${Date.now()}` }
      if (dragOverIndex !== null) {
        setPlacedBlocks(prev => {
          const newBlocks = [...prev]
          newBlocks.splice(dragOverIndex, 0, newBlock)
          return newBlocks
        })
      } else {
        setPlacedBlocks(prev => [...prev, newBlock])
      }
    }
    setDraggedBlock(null)
    setDragOverIndex(null)
  }, [draggedBlock, dragOverIndex])

  const handleCanvasDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (!canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    const y = e.clientY - rect.top
    const blockHeight = 50
    const index = Math.floor(y / blockHeight)
    setDragOverIndex(Math.min(index, placedBlocks.length))
  }, [placedBlocks.length])

  const handleShuffle = useCallback(() => {
    setPlacedBlocks(prev => {
      const shuffled = [...prev]
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }
      return shuffled
    })
  }, [])

  const handleClear = useCallback(() => {
    setPlacedBlocks([])
  }, [])

  const handleRemoveBlock = useCallback((blockId: string) => {
    setPlacedBlocks(prev => prev.filter(b => b.id !== blockId))
  }, [])

  const canvasBg = isDark ? 'bg-[oklch(0.1_0.01_260)]' : 'bg-[oklch(0.97_0.01_260)]'
  const canvasBorder = isDark ? 'border-[oklch(0.25_0.02_260)]' : 'border-[oklch(0.85_0.02_260)]'
  const dotPattern = isDark ? 'oklch(1 0 0 / 5%)' : 'oklch(0 0 0 / 5%)'
  const labelColor = isDark ? 'text-white/60' : 'text-foreground/60'
  const mutedColor = isDark ? 'text-white/40' : 'text-muted-foreground'
  const btnClass = isDark
    ? 'border-[oklch(0.25_0.02_260)] bg-[oklch(0.15_0.01_260)] text-white/70 hover:bg-[oklch(0.2_0.01_260)]'
    : 'border-border bg-secondary text-muted-foreground hover:bg-accent'
  const emptyIconColor = isDark ? 'text-white/20' : 'text-foreground/20'
  const emptyTextColor = isDark ? 'text-white/40' : 'text-muted-foreground'
  const navDotColor1 = isDark ? 'bg-rose-500/60' : 'bg-rose-400/40'
  const navDotColor2 = isDark ? 'bg-amber-500/60' : 'bg-amber-400/40'
  const navDotColor3 = isDark ? 'bg-emerald-500/60' : 'bg-emerald-400/40'
  const navBarBg = isDark ? 'bg-white/5' : 'bg-foreground/5'
  const navLineBg = isDark ? 'bg-white/10' : 'bg-foreground/10'

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      {/* Block Palette */}
      <div>
        <p className={`text-xs ${mutedColor} mb-3 font-medium uppercase tracking-wider`}>Drag blocks to build</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {BLOCK_TYPES.map((block) => {
            const Icon = block.icon
            return (
              <motion.div
                key={block.id}
                draggable
                onDragStart={() => handleDragStart(block.id)}
                onDragEnd={handleDragEnd}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-grab active:cursor-grabbing transition-shadow"
                style={{
                  background: isDark ? `${block.color}15` : `${block.color}10`,
                  border: `1px solid ${block.color}25`,
                }}
              >
                <div
                  className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
                  style={{ background: block.bgGradient }}
                >
                  <Icon className="w-3.5 h-3.5 text-white" />
                </div>
                <span className={`text-xs font-medium ${labelColor}`}>{block.label}</span>
                <GripVertical className={`w-3 h-3 ${mutedColor} ml-auto`} />
              </motion.div>
            )
          })}
        </div>
        <div className="flex gap-2 mt-4">
          <Button
            size="sm"
            variant="outline"
            onClick={handleShuffle}
            disabled={placedBlocks.length < 2}
            className={`text-xs ${btnClass}`}
          >
            <Shuffle className="w-3 h-3 mr-1" /> Shuffle
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleClear}
            disabled={placedBlocks.length === 0}
            className={`text-xs ${btnClass}`}
          >
            <Trash2 className="w-3 h-3 mr-1" /> Clear
          </Button>
        </div>
      </div>

      {/* Mini Canvas Preview */}
      <div>
        <p className={`text-xs ${mutedColor} mb-3 font-medium uppercase tracking-wider`}>Live preview</p>
        <div
          ref={canvasRef}
          onDrop={handleCanvasDrop}
          onDragOver={handleCanvasDragOver}
          onDragLeave={() => setDragOverIndex(null)}
          className={`min-h-[280px] rounded-xl border ${canvasBorder} ${canvasBg} p-3 relative overflow-hidden`}
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, ${dotPattern} 1px, transparent 0)`,
            backgroundSize: '20px 20px',
          }}
        >
          {/* Navbar mockup */}
          <div className={`h-5 rounded ${navBarBg} mb-2 flex items-center px-2 gap-1`}>
            <div className={`w-2 h-2 rounded-full ${navDotColor1}`} />
            <div className={`w-2 h-2 rounded-full ${navDotColor2}`} />
            <div className={`w-2 h-2 rounded-full ${navDotColor3}`} />
            <div className="flex-1" />
            <div className={`w-6 h-1.5 rounded ${navLineBg}`} />
            <div className={`w-6 h-1.5 rounded ${navLineBg}`} />
          </div>

          {/* Placed blocks */}
          <AnimatePresence mode="popLayout">
            {placedBlocks.map((block, index) => {
              const Icon = block.icon
              return (
                <motion.div
                  key={block.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: -50 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className="relative group mb-1.5"
                >
                  {dragOverIndex === index && (
                    <div className="absolute -top-1 left-0 right-0 h-0.5 bg-[oklch(0.55_0.25_270)] rounded-full" />
                  )}
                  <div
                    className={`${block.height} rounded-lg flex items-center px-3 gap-2 cursor-pointer transition-all`}
                    style={{
                      background: block.bgGradient,
                      opacity: 0.9,
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.opacity = '1' }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.opacity = '0.9' }}
                  >
                    <Icon className="w-3 h-3 text-white/80" />
                    <span className="text-[10px] font-medium text-white/80">{block.label}</span>
                    <button
                      onClick={() => handleRemoveBlock(block.id)}
                      className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity w-4 h-4 rounded-full bg-black/30 flex items-center justify-center"
                    >
                      <span className="text-white/60 text-[8px] leading-none">✕</span>
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>

          {/* Drop indicator at end */}
          {dragOverIndex === placedBlocks.length && draggedBlock && (
            <div className="h-0.5 bg-[oklch(0.55_0.25_270)] rounded-full mb-1.5" />
          )}

          {/* Empty state */}
          {placedBlocks.length === 0 && (
            <div className={`flex flex-col items-center justify-center h-48 ${emptyTextColor}`}>
              <LayoutGrid className={`w-8 h-8 mb-2 ${emptyIconColor}`} />
              <p className="text-xs">Drag blocks here to build your site</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Interactive Theme Playground ────────────────────────────────────

function ThemePlayground({ isDark }: { isDark: boolean }) {
  const [accentColor, setAccentColor] = useState('#7c3aed')
  const [isPreviewDark, setIsPreviewDark] = useState(false)
  const [fontStyle, setFontStyle] = useState<'modern' | 'classic' | 'playful'>('modern')

  const fontStyles = {
    modern: { fontFamily: 'system-ui, sans-serif', letterSpacing: '-0.02em' },
    classic: { fontFamily: 'Georgia, serif', letterSpacing: '0.01em' },
    playful: { fontFamily: 'system-ui, sans-serif', letterSpacing: '0.02em' },
  }

  const colorPresets = ['#7c3aed', '#f43f5e', '#10b981', '#f59e0b', '#06b6d4', '#ec4899']

  const labelColor = isDark ? 'text-white/60' : 'text-foreground/60'
  const btnActiveBg = isDark ? 'oklch(1 0 0 / 10%)' : 'oklch(0.55 0.25 270 / 10%)'
  const btnActiveBorder = isDark ? 'oklch(1 0 0 / 20%)' : 'oklch(0.55 0.25 270 / 30%)'
  const btnActiveColor = isDark ? 'white' : 'oklch(0.55 0.25 270)'
  const btnInactiveBg = isDark ? 'oklch(1 0 0 / 3%)' : 'oklch(0.96 0.01 260)'
  const btnInactiveBorder = isDark ? 'oklch(1 0 0 / 5%)' : 'oklch(0.9 0.01 260)'
  const btnInactiveColor = isDark ? 'oklch(1 0 0 / 50%)' : 'oklch(0.5 0.02 260)'
  const previewBorder = isDark ? 'border-[oklch(0.25_0.02_260)]' : 'border-border'

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      {/* Controls */}
      <div className="space-y-4">
        <div>
          <p className={`text-xs ${labelColor} mb-2 font-medium uppercase tracking-wider`}>Accent Color</p>
          <div className="flex gap-2 flex-wrap">
            {colorPresets.map((color) => (
              <motion.button
                key={color}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setAccentColor(color)}
                className="w-8 h-8 rounded-full border-2 transition-all"
                style={{
                  background: color,
                  borderColor: accentColor === color ? (isDark ? 'white' : color) : 'transparent',
                  boxShadow: accentColor === color ? `0 0 12px ${color}60` : 'none',
                }}
              />
            ))}
            <input
              type="color"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              className="w-8 h-8 rounded-full cursor-pointer border-0 bg-transparent"
            />
          </div>
        </div>

        <div>
          <p className={`text-xs ${labelColor} mb-2 font-medium uppercase tracking-wider`}>Preview Mode</p>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsPreviewDark(false)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all"
              style={{
                background: !isPreviewDark ? btnActiveBg : btnInactiveBg,
                border: `1px solid ${!isPreviewDark ? btnActiveBorder : btnInactiveBorder}`,
                color: !isPreviewDark ? btnActiveColor : btnInactiveColor,
              }}
            >
              <Sun className="w-3.5 h-3.5" /> Light
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsPreviewDark(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all"
              style={{
                background: isPreviewDark ? btnActiveBg : btnInactiveBg,
                border: `1px solid ${isPreviewDark ? btnActiveBorder : btnInactiveBorder}`,
                color: isPreviewDark ? btnActiveColor : btnInactiveColor,
              }}
            >
              <Moon className="w-3.5 h-3.5" /> Dark
            </motion.button>
          </div>
        </div>

        <div>
          <p className={`text-xs ${labelColor} mb-2 font-medium uppercase tracking-wider`}>Font Style</p>
          <div className="flex gap-2">
            {(['modern', 'classic', 'playful'] as const).map((style) => (
              <motion.button
                key={style}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setFontStyle(style)}
                className="px-3 py-2 rounded-lg text-xs font-medium transition-all capitalize"
                style={{
                  background: fontStyle === style ? btnActiveBg : btnInactiveBg,
                  border: `1px solid ${fontStyle === style ? btnActiveBorder : btnInactiveBorder}`,
                  color: fontStyle === style ? btnActiveColor : btnInactiveColor,
                  ...fontStyles[style],
                }}
              >
                {style}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Live Preview */}
      <div className={`rounded-xl overflow-hidden border ${previewBorder} shadow-lg`}>
        <motion.div
          layout
          className="p-3"
          style={{
            background: isPreviewDark ? '#0f0f1a' : '#ffffff',
            transition: 'background 0.4s ease',
          }}
        >
          {/* Mini nav */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded" style={{ background: accentColor }} />
              <span className="text-[9px] font-bold" style={{ color: isPreviewDark ? '#fff' : '#111', ...fontStyles[fontStyle] }}>Brand</span>
            </div>
            <div className="flex gap-2">
              <div className="w-5 h-1 rounded" style={{ background: isPreviewDark ? '#ffffff20' : '#00000015' }} />
              <div className="w-5 h-1 rounded" style={{ background: isPreviewDark ? '#ffffff20' : '#00000015' }} />
            </div>
          </div>

          {/* Mini hero */}
          <div
            className="rounded-lg p-3 mb-2 text-center"
            style={{
              background: isPreviewDark
                ? `linear-gradient(135deg, ${accentColor}30, ${accentColor}10)`
                : `linear-gradient(135deg, ${accentColor}15, ${accentColor}05)`,
              transition: 'background 0.4s ease',
            }}
          >
            <motion.h3
              layout
              className="text-[11px] font-bold mb-1"
              style={{ color: isPreviewDark ? '#fff' : '#111', ...fontStyles[fontStyle] }}
            >
              Build something amazing
            </motion.h3>
            <p className="text-[8px] mb-2" style={{ color: isPreviewDark ? '#ffffff80' : '#00000060' }}>
              Create stunning websites with AI
            </p>
            <motion.div
              layout
              className="inline-block px-2.5 py-1 rounded-full text-[8px] font-medium text-white"
              style={{ background: accentColor, transition: 'background 0.3s ease' }}
            >
              Get Started
            </motion.div>
          </div>

          {/* Mini feature cards */}
          <div className="grid grid-cols-3 gap-1.5 mb-2">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                layout
                className="rounded-md p-1.5 text-center"
                style={{
                  background: isPreviewDark ? '#ffffff08' : '#00000005',
                  border: `1px solid ${isPreviewDark ? '#ffffff10' : '#00000008'}`,
                  transition: 'background 0.4s ease',
                }}
              >
                <div className="w-3 h-3 rounded mx-auto mb-0.5" style={{ background: `${accentColor}40` }} />
                <div className="w-5 h-0.5 rounded mx-auto mb-0.5" style={{ background: isPreviewDark ? '#ffffff20' : '#00000015' }} />
                <div className="w-7 h-0.5 rounded mx-auto" style={{ background: isPreviewDark ? '#ffffff10' : '#00000008' }} />
              </motion.div>
            ))}
          </div>

          {/* Mini footer */}
          <div
            className="rounded-md p-1.5 flex items-center justify-between"
            style={{
              background: isPreviewDark ? '#ffffff05' : '#00000003',
              transition: 'background 0.4s ease',
            }}
          >
            <div className="w-4 h-0.5 rounded" style={{ background: isPreviewDark ? '#ffffff15' : '#00000010' }} />
            <div className="w-6 h-0.5 rounded" style={{ background: isPreviewDark ? '#ffffff10' : '#00000008' }} />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// ─── Interactive AI Demo ─────────────────────────────────────────────

function AIDemo({ isDark }: { isDark: boolean }) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [stage, setStage] = useState<'idle' | 'navbar' | 'hero' | 'features' | 'footer' | 'done'>('idle')

  const handleGenerate = useCallback(() => {
    setIsGenerating(true)
    setProgress(0)
    setStage('idle')

    const timeline = [
      { time: 0, progress: 5, stage: 'idle' as const },
      { time: 400, progress: 15, stage: 'navbar' as const },
      { time: 1200, progress: 35, stage: 'hero' as const },
      { time: 2800, progress: 70, stage: 'features' as const },
      { time: 4200, progress: 90, stage: 'footer' as const },
      { time: 5000, progress: 100, stage: 'done' as const },
    ]

    timeline.forEach(({ time, progress: p, stage: s }) => {
      setTimeout(() => {
        setProgress(p)
        setStage(s)
      }, time)
    })

    setTimeout(() => {
      setIsGenerating(false)
    }, 5200)
  }, [])

  const canvasBg = isDark ? 'bg-[oklch(0.1_0.01_260)]' : 'bg-[oklch(0.97_0.01_260)]'
  const canvasBorder = isDark ? 'border-[oklch(0.25_0.02_260)]' : 'border-border'
  const dotPattern = isDark ? 'oklch(1 0 0 / 3%)' : 'oklch(0 0 0 / 3%)'
  const barBg = isDark ? 'bg-white/5' : 'bg-foreground/5'
  const barLineBg = isDark ? 'bg-white/10' : 'bg-foreground/10'
  const heroBg = isDark ? 'oklch(0.55 0.25 270 / 15%), oklch(0.65 0.25 350 / 15%)' : 'oklch(0.55 0.25 270 / 8%), oklch(0.65 0.25 350 / 8%)'
  const featureBg = isDark ? 'bg-white/5 border-white/5' : 'bg-foreground/5 border-border/50'
  const iconBg = isDark ? 'bg-white/10' : 'bg-foreground/10'
  const lineBg = isDark ? 'bg-white/10' : 'bg-foreground/10'
  const lineBg2 = isDark ? 'bg-white/5' : 'bg-foreground/5'
  const footerBg = isDark ? 'bg-white/5' : 'bg-foreground/5'
  const footerLineBg = isDark ? 'bg-white/10' : 'bg-foreground/10'
  const footerLineBg2 = isDark ? 'bg-white/5' : 'bg-foreground/5'
  const emptyTextColor = isDark ? 'text-white/40' : 'text-muted-foreground'
  const emptyIconColor = isDark ? 'text-white/20' : 'text-foreground/20'
  const statusColor = isDark ? 'text-[oklch(0.85_0.08_260)]/70' : 'text-[oklch(0.55_0.25_270)]/70'
  const outlineBtnClass = isDark
    ? 'border-[oklch(0.25_0.02_260)] bg-[oklch(0.15_0.01_260)] text-white/70 hover:bg-[oklch(0.2_0.01_260)]'
    : 'border-border bg-secondary text-muted-foreground hover:bg-accent'
  const progressTrackBg = isDark ? 'bg-white/5' : 'bg-foreground/5'

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center gap-3">
        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="text-xs bg-[oklch(0.55_0.25_270)] text-white hover:bg-[oklch(0.5_0.22_270)] border-0 shadow-lg shadow-[oklch(0.55_0.25_270)_/_20]"
          >
            <Wand2 className="w-3.5 h-3.5 mr-1.5" />
            {isGenerating ? 'Generating...' : 'Watch AI Build'}
          </Button>
        </motion.div>
        {stage === 'done' && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
            <Button
              size="sm"
              variant="outline"
              onClick={handleGenerate}
              className={`text-xs ${outlineBtnClass}`}
            >
              <RotateCcw className="w-3 h-3 mr-1" /> Regenerate
            </Button>
          </motion.div>
        )}
      </div>

      {/* Progress bar */}
      {isGenerating && (
        <div className={`w-full h-1.5 ${progressTrackBg} rounded-full overflow-hidden`}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, oklch(0.55 0.25 270), oklch(0.65 0.25 350), oklch(0.6 0.2 180))' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>
      )}

      {/* Status text */}
      {isGenerating && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-[10px] ${statusColor} font-mono`}
        >
          {stage === 'idle' && 'Initializing AI model...'}
          {stage === 'navbar' && 'Generating navigation component...'}
          {stage === 'hero' && 'Building hero section with content...'}
          {stage === 'features' && 'Creating feature grid layout...'}
          {stage === 'footer' && 'Assembling footer and final touches...'}
        </motion.p>
      )}

      {/* Generated Preview */}
      <div
        className={`rounded-xl border ${canvasBorder} ${canvasBg} p-3 min-h-[200px] relative overflow-hidden`}
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, ${dotPattern} 1px, transparent 0)`,
          backgroundSize: '16px 16px',
        }}
      >
        {/* Navbar */}
        <AnimatePresence>
          {stage !== 'idle' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className={`flex items-center justify-between mb-3 pb-2 ${isDark ? 'border-white/5' : 'border-border'}`}
              style={{ borderBottomWidth: 1 }}
            >
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-[oklch(0.55_0.25_270)]" />
                <div className={`w-8 h-1.5 rounded ${barLineBg}`} />
              </div>
              <div className="flex gap-2">
                <div className={`w-6 h-1 rounded ${barLineBg}`} />
                <div className={`w-6 h-1 rounded ${barLineBg}`} />
                <div className={`w-6 h-1 rounded ${barLineBg}`} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero */}
        <AnimatePresence>
          {(stage === 'hero' || stage === 'features' || stage === 'footer' || stage === 'done') && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="mb-3 p-3 rounded-lg text-center"
              style={{
                background: `linear-gradient(135deg, ${heroBg})`,
              }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '70%' }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className={`h-2 rounded ${isDark ? 'bg-white/20' : 'bg-foreground/15'} mx-auto mb-1.5`}
              />
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '50%' }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className={`h-1 rounded ${isDark ? 'bg-white/10' : 'bg-foreground/8'} mx-auto mb-2`}
              />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.8 }}
                className="inline-block px-2.5 py-1 rounded-full text-[8px] font-medium text-white bg-[oklch(0.55_0.25_270)]"
              >
                Get Started
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Features */}
        <AnimatePresence>
          {(stage === 'features' || stage === 'footer' || stage === 'done') && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="grid grid-cols-3 gap-1.5 mb-3"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.15 }}
                  className={`rounded-md p-2 ${featureBg}`}
                >
                  <div className={`w-4 h-4 rounded ${iconBg} mb-1`} />
                  <div className={`w-full h-1 rounded ${lineBg} mb-0.5`} />
                  <div className={`w-2/3 h-1 rounded ${lineBg2}`} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <AnimatePresence>
          {(stage === 'footer' || stage === 'done') && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className={`flex items-center justify-between p-2 rounded-md ${footerBg}`}
            >
              <div className={`w-6 h-1 rounded ${footerLineBg}`} />
              <div className="flex gap-1.5">
                <div className={`w-3 h-1 rounded ${footerLineBg2}`} />
                <div className={`w-3 h-1 rounded ${footerLineBg2}`} />
                <div className={`w-3 h-1 rounded ${footerLineBg2}`} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Done checkmark */}
        <AnimatePresence>
          {stage === 'done' && !isGenerating && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[oklch(0.6_0.2_160)] flex items-center justify-center"
            >
              <CheckCircle2 className="w-3 h-3 text-white" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Idle state */}
        {stage === 'idle' && !isGenerating && (
          <div className={`flex flex-col items-center justify-center h-48 ${emptyTextColor}`}>
            <Wand2 className={`w-8 h-8 mb-2 ${emptyIconColor}`} />
            <p className="text-xs">Click &quot;Watch AI Build&quot; to see the magic</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Floating Particles Component ────────────────────────────────────

function FloatingParticles({ isDark }: { isDark: boolean }) {
  const particleOpacity = isDark ? '30%' : '15%'
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 4 + Math.random() * 6,
            height: 4 + Math.random() * 6,
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
            background: `oklch(${isDark ? 0.7 + Math.random() * 0.2 : 0.5 + Math.random() * 0.1} ${0.15 + Math.random() * 0.1} ${Math.random() * 360} / ${particleOpacity})`,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, (Math.random() - 0.5) * 20, 0],
            opacity: [isDark ? 0.3 : 0.15, isDark ? 0.6 : 0.3, isDark ? 0.3 : 0.15],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

// ─── Abstract SVG Background ─────────────────────────────────────────

function AbstractBackground({ isDark }: { isDark: boolean }) {
  const blobOpacity = isDark ? 0.12 : 0.06
  const blobOpacity2 = isDark ? 0.08 : 0.04

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Morphing blobs */}
      <div className="absolute top-1/4 left-0 w-48 h-48 rounded-full animate-morph" style={{
        background: `radial-gradient(circle, oklch(0.55 0.25 270 / ${blobOpacity}), transparent 70%)`,
      }} />
      <div className="absolute bottom-1/4 right-0 w-56 h-56 rounded-full animate-morph" style={{
        background: `radial-gradient(circle, oklch(0.55 0.25 270 / ${blobOpacity2}), transparent 70%)`,
        animationDelay: '-3s',
      }} />
      <div className="absolute top-1/2 left-1/3 w-32 h-32 rounded-full animate-pulse-glow" style={{
        background: `radial-gradient(circle, oklch(0.55 0.25 270 / ${blobOpacity2}), transparent 70%)`,
      }} />
    </div>
  )
}

// ─── Main Landing Page Component ─────────────────────────────────────

export default function LandingPage() {
  const navigate = useAppStore(s => s.navigate)
  const setBuilderPrompt = useAppStore(s => s.setBuilderPrompt)
  const themeMode = useAppStore(s => s.themeMode)
  const setThemeMode = useAppStore(s => s.setThemeMode)
  const [promptValue, setPromptValue] = useState('')
  const isDark = themeMode === 'dark'

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

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* ─── Navbar ───────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hexagon className="w-5 h-5 text-primary" />
            <span className="font-bold text-sm gradient-text">Forge</span>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <button onClick={() => navigate('builder')} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Builder</button>
            <button onClick={() => navigate('templates')} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Templates</button>
            <button onClick={handleGetStarted} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Pricing</button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="w-8 h-8 p-0"
            >
              {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('login')}
              className="text-xs text-muted-foreground"
            >
              Sign in
            </Button>
            <Button
              size="sm"
              onClick={handleGetStarted}
              className="text-xs bg-[oklch(0.55_0.25_270)] text-white hover:bg-[oklch(0.5_0.22_270)] border-0"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* ─── Hero Section (Left-aligned, asymmetric) ─────────────────── */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-24 md:pb-20">
        <AbstractBackground isDark={isDark} />

        {/* Deep purple accent line at top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[oklch(0.55_0.25_270)] to-transparent opacity-40" />

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
            {/* Left side: Text content (3 cols) */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="lg:col-span-3 text-left"
            >
              <motion.div variants={fadeInUp}>
                <Badge className="bg-[oklch(0.55_0.25_270_/_10%)] text-[oklch(0.55_0.25_270)] border-[oklch(0.55_0.25_270_/_20%)] text-[10px] px-3 py-1">
                  <Sparkles className="w-3 h-3 mr-1" /> AI-Powered Website Builder
                </Badge>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground leading-tight mt-4">
                Your idea. Our AI.{' '}
                <span className="gradient-text">A complete website.</span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="text-sm text-muted-foreground max-w-lg mt-3">
                Describe what you want. Forge generates a full, responsive website in seconds.
                Customize with the visual editor, then deploy anywhere.
              </motion.p>

              {/* Prompt Input */}
              <motion.div variants={fadeInUp} className="max-w-md mt-5">
                <div className="flex gap-2 p-1.5 rounded-xl bg-card border border-border shadow-sm">
                  <input
                    value={promptValue}
                    onChange={(e) => setPromptValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                    placeholder="A modern SaaS landing page with pricing..."
                    className="flex-1 bg-transparent text-foreground text-xs placeholder:text-muted-foreground px-3 py-2 outline-none"
                  />
                  <Button
                    onClick={handleGenerate}
                    size="sm"
                    className="bg-[oklch(0.55_0.25_270)] text-white hover:bg-[oklch(0.5_0.22_270)] border-0 text-xs px-4 shadow-lg shadow-[oklch(0.55_0.25_270)_/_15]"
                  >
                    <Sparkles className="w-3 h-3 mr-1" /> Generate
                  </Button>
                </div>
              </motion.div>

              {/* Suggestion pills */}
              <motion.div variants={fadeInUp} className="flex flex-wrap gap-1.5 mt-3">
                {['SaaS landing page', 'Portfolio site', 'Restaurant website', 'E-commerce store'].map((pill) => (
                  <motion.button
                    key={pill}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { setPromptValue(pill); setBuilderPrompt(pill); navigate('builder') }}
                    className="text-[10px] text-muted-foreground px-2.5 py-1 rounded-full bg-secondary border border-border hover:border-[oklch(0.55_0.25_270_/_30%)] hover:text-[oklch(0.55_0.25_270)] transition-colors"
                  >
                    {pill}
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>

            {/* Right side: Visual preview (2 cols) */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="lg:col-span-2"
            >
              <div className="relative rounded-2xl border border-border bg-card p-4 shadow-xl shadow-[oklch(0.55_0.25_270)_/_5]">
                {/* Browser chrome mockup */}
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[oklch(0.65_0.2_80)_/_60%]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[oklch(0.6_0.2_160)_/_60%]" />
                  </div>
                  <div className="flex-1 h-5 rounded-md bg-secondary flex items-center px-2">
                    <span className="text-[8px] text-muted-foreground font-mono">forge.ai/your-site</span>
                  </div>
                </div>

                {/* Mini website preview */}
                <div className="space-y-2">
                  {/* Navbar */}
                  <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-1">
                      <div className="w-2.5 h-2.5 rounded bg-[oklch(0.55_0.25_270)]" />
                      <div className="w-6 h-1 rounded bg-foreground/15" />
                    </div>
                    <div className="flex gap-1.5">
                      <div className="w-4 h-1 rounded bg-foreground/10" />
                      <div className="w-4 h-1 rounded bg-foreground/10" />
                      <div className="w-4 h-1 rounded bg-foreground/10" />
                    </div>
                  </div>
                  {/* Hero */}
                  <div className="rounded-lg p-3 text-center" style={{
                    background: isDark ? 'linear-gradient(135deg, oklch(0.55 0.25 270 / 15%), oklch(0.5 0.2 290 / 10%))' : 'linear-gradient(135deg, oklch(0.55 0.25 270 / 8%), oklch(0.55 0.25 270 / 3%))',
                  }}>
                    <div className="h-2 rounded bg-foreground/15 mx-auto mb-1 w-3/4" />
                    <div className="h-1 rounded bg-foreground/8 mx-auto mb-2 w-1/2" />
                    <div className="inline-block px-2 py-0.5 rounded-full text-[7px] font-medium text-white bg-[oklch(0.55_0.25_270)]">
                      Get Started
                    </div>
                  </div>
                  {/* Features */}
                  <div className="grid grid-cols-3 gap-1">
                    {[1,2,3].map(i => (
                      <div key={i} className="rounded p-1.5 bg-secondary/50 border border-border/50">
                        <div className="w-3 h-3 rounded bg-[oklch(0.55_0.25_270_/_20%)] mx-auto mb-0.5" />
                        <div className="h-0.5 rounded bg-foreground/10 mx-auto w-3/4" />
                      </div>
                    ))}
                  </div>
                  {/* Footer */}
                  <div className="flex items-center justify-between px-2 py-1 rounded bg-secondary/30">
                    <div className="w-4 h-0.5 rounded bg-foreground/8" />
                    <div className="w-8 h-0.5 rounded bg-foreground/5" />
                  </div>
                </div>

                {/* Floating accent dot */}
                <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-[oklch(0.55_0.25_270)] shadow-lg shadow-[oklch(0.55_0.25_270)_/_30] animate-pulse" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Stats Bar (Deep purple accent strip) ─────────────────────── */}
      <section className="relative py-6 overflow-hidden border-y border-[oklch(0.55_0.25_270_/_15%)]">
        {/* Purple accent gradient strip */}
        <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.55_0.25_270_/_8%)] via-transparent to-[oklch(0.55_0.25_270_/_8%)]" />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {stats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <motion.div key={stat.label} variants={fadeInUp} className={`flex items-center gap-3 ${i === 0 ? '' : 'border-l border-border/50 pl-6'}`}>
                <div className="w-8 h-8 rounded-lg bg-[oklch(0.55_0.25_270_/_10%)] flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-[oklch(0.55_0.25_270)]" />
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-bold text-foreground">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-[10px] text-muted-foreground">{stat.label}</div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </section>

      {/* ─── Interactive Builder Playground (Left heading, right playground) ─── */}
      <section className="relative py-14 md:py-20 overflow-hidden bg-background">
        <AbstractBackground isDark={isDark} />

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            {/* Left: Heading + description */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              className="lg:col-span-2 text-left"
            >
              <motion.div variants={fadeInUp}>
                <Badge className="bg-[oklch(0.55_0.25_270_/_10%)] text-[oklch(0.55_0.25_270)] border-[oklch(0.55_0.25_270_/_20%)] text-[10px] mb-3">
                  <MousePointerClick className="w-3 h-3 mr-1" /> Interactive
                </Badge>
              </motion.div>
              <motion.h2 variants={fadeInUp} className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                Build a site,{' '}
                <span className="gradient-text">your way</span>
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-xs text-muted-foreground max-w-sm">
                Drag blocks onto the canvas to arrange your website layout. Try different combinations — it&apos;s fun!
              </motion.p>
              <motion.div variants={fadeInUp} className="mt-4 flex gap-2">
                <div className="w-5 h-5 rounded bg-[oklch(0.55_0.25_270_/_10%)] flex items-center justify-center">
                  <Layers className="w-2.5 h-2.5 text-[oklch(0.55_0.25_270)]" />
                </div>
                <span className="text-[10px] text-muted-foreground">6 block types to mix & match</span>
              </motion.div>
            </motion.div>

            {/* Right: Playground (3 cols) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-3"
            >
              <BuilderPlayground isDark={isDark} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Deep Purple Accent Divider ──────────────────────────────── */}
      <div className="h-px bg-gradient-to-r from-transparent via-[oklch(0.55_0.25_270_/_40%)] to-transparent" />

      {/* ─── Features Section (Left-aligned, 2-col asymmetric) ────────── */}
      <section className="relative py-14 md:py-20 bg-background overflow-hidden">
        <AbstractBackground isDark={isDark} />
        <FloatingParticles isDark={isDark} />

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          {/* Section header - left aligned */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="text-left mb-10"
          >
            <motion.div variants={fadeInUp}>
              <Badge className="bg-[oklch(0.55_0.25_270_/_10%)] text-[oklch(0.55_0.25_270)] border-[oklch(0.55_0.25_270_/_20%)] text-[10px] mb-3">
                <Zap className="w-3 h-3 mr-1" /> Features
              </Badge>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-xl sm:text-2xl font-bold text-foreground mb-2">
              Everything you need to{' '}
              <span className="gradient-text">build</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xs text-muted-foreground max-w-md">
              From AI generation to deployment, Forge has every tool to take your idea live.
            </motion.p>
          </motion.div>

          {/* Features grid - 2 columns */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  variants={fadeInUp}
                  whileHover={{
                    y: -4,
                    transition: { duration: 0.2 },
                  }}
                >
                  <Card className="group relative overflow-hidden border-border/50 hover:border-[oklch(0.55_0.25_270_/_30%)] transition-all duration-300 hover:shadow-lg hover:shadow-[oklch(0.55_0.25_270)_/_5]">
                    <CardContent className="relative z-10 p-5">
                      <div className="flex items-start gap-3">
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm"
                          style={{ background: `${feature.accentColor}15`, border: `1px solid ${feature.accentColor}25` }}
                        >
                          <Icon className="w-4 h-4" style={{ color: feature.accentColor }} />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-foreground mb-1">{feature.title}</h3>
                          <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
                        </div>
                      </div>
                    </CardContent>
                    {/* Deep purple accent line at bottom on hover */}
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[oklch(0.55_0.25_270)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* ─── Interactive Theme Playground (Right-aligned heading) ─────── */}
      <section className="relative py-14 md:py-20 overflow-hidden bg-background">
        <AbstractBackground isDark={isDark} />

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            {/* Left: Playground (3 cols) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-3 order-2 lg:order-1"
            >
              <ThemePlayground isDark={isDark} />
            </motion.div>

            {/* Right: Heading + description (2 cols) - right aligned text */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              className="lg:col-span-2 order-1 lg:order-2 text-left lg:text-right"
            >
              <motion.div variants={fadeInUp}>
                <Badge className="bg-[oklch(0.6_0.2_160_/_10%)] text-[oklch(0.6_0.2_160)] border-[oklch(0.6_0.2_160_/_20%)] text-[10px] mb-3">
                  <Palette className="w-3 h-3 mr-1" /> Live Customizer
                </Badge>
              </motion.div>
              <motion.h2 variants={fadeInUp} className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                Make it{' '}
                <span className="gradient-text">yours</span>
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-xs text-muted-foreground max-w-sm">
                Pick your accent color, toggle light/dark, and choose a font style. Watch the preview update live.
              </motion.p>
              <motion.div variants={fadeInUp} className="mt-4 flex gap-2 lg:justify-end">
                <div className="w-5 h-5 rounded bg-[oklch(0.6_0.2_160_/_10%)] flex items-center justify-center">
                  <Palette className="w-2.5 h-2.5 text-[oklch(0.6_0.2_160)]" />
                </div>
                <span className="text-[10px] text-muted-foreground">6 color presets + custom picker</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── How It Works (Alternating layout) ────────────────────────── */}
      <section className="relative py-14 md:py-20 bg-background overflow-hidden">
        {/* Purple accent top border */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[oklch(0.55_0.25_270_/_30%)] to-transparent" />
        <FloatingParticles isDark={isDark} />

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="text-left mb-10"
          >
            <motion.div variants={fadeInUp}>
              <Badge className="bg-[oklch(0.55_0.25_270_/_10%)] text-[oklch(0.55_0.25_270)] border-[oklch(0.55_0.25_270_/_20%)] text-[10px] mb-3">
                <ArrowRight className="w-3 h-3 mr-1" /> How It Works
              </Badge>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-xl sm:text-2xl font-bold text-foreground mb-2">
              Three steps to your{' '}
              <span className="gradient-text">site</span>
            </motion.h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="space-y-6"
          >
            {steps.map((step, i) => {
              const Icon = step.icon
              const isEven = i % 2 === 0
              return (
                <motion.div
                  key={step.number}
                  variants={fadeInUp}
                  className={`grid grid-cols-1 md:grid-cols-2 gap-6 items-center ${isEven ? '' : 'md:[direction:rtl]'}`}
                >
                  {/* Visual side */}
                  <div className={`${isEven ? '' : 'md:[direction:ltr]'}`}>
                    <div className={`relative rounded-2xl border border-border bg-card p-6 ${isEven ? 'md:ml-8' : 'md:mr-8'}`}>
                      {/* Step number badge */}
                      <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-[oklch(0.55_0.25_270)] text-white text-sm font-bold flex items-center justify-center shadow-lg shadow-[oklch(0.55_0.25_270)_/_30]">
                        {step.number}
                      </div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-[oklch(0.55_0.25_270_/_10%)] flex items-center justify-center">
                          <Icon className="w-5 h-5 text-[oklch(0.55_0.25_270)]" />
                        </div>
                        <h3 className="text-sm font-bold text-foreground">{step.title}</h3>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                  {/* Text side */}
                  <div className={`${isEven ? '' : 'md:[direction:ltr]'}`}>
                    <div className={`flex items-center gap-4 ${isEven ? 'md:justify-end' : 'md:justify-start'}`}>
                      {i === 0 && (
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <Monitor className="w-4 h-4 text-[oklch(0.55_0.25_270)]" />
                            <span className="text-[10px] text-muted-foreground">Describe on any device</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Smartphone className="w-4 h-4 text-muted-foreground" />
                            <span className="text-[10px] text-muted-foreground">Works on mobile too</span>
                          </div>
                        </div>
                      )}
                      {i === 1 && (
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <Code2 className="w-4 h-4 text-[oklch(0.55_0.25_270)]" />
                            <span className="text-[10px] text-muted-foreground">Clean, semantic code</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Layers className="w-4 h-4 text-muted-foreground" />
                            <span className="text-[10px] text-muted-foreground">Proper structure & layout</span>
                          </div>
                        </div>
                      )}
                      {i === 2 && (
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <Download className="w-4 h-4 text-[oklch(0.55_0.25_270)]" />
                            <span className="text-[10px] text-muted-foreground">Export anytime</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Rocket className="w-4 h-4 text-muted-foreground" />
                            <span className="text-[10px] text-muted-foreground">Deploy anywhere</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* ─── Interactive AI Demo (Left-aligned heading) ───────────────── */}
      <section className="relative py-14 md:py-20 overflow-hidden bg-background">
        <AbstractBackground isDark={isDark} />

        {/* Purple accent top border */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[oklch(0.55_0.25_270_/_30%)] to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            {/* Left: Heading (2 cols) */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              className="lg:col-span-2 text-left"
            >
              <motion.div variants={fadeInUp}>
                <Badge className="bg-[oklch(0.55_0.25_270_/_10%)] text-[oklch(0.55_0.25_270)] border-[oklch(0.55_0.25_270_/_20%)] text-[10px] mb-3">
                  <Wand2 className="w-3 h-3 mr-1" /> AI Demo
                </Badge>
              </motion.div>
              <motion.h2 variants={fadeInUp} className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                Watch AI build a site{' '}
                <span className="gradient-text">in real-time</span>
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-xs text-muted-foreground max-w-sm">
                See how Forge generates a complete website piece by piece — navbar, hero, features, and footer.
              </motion.p>
              <motion.div variants={fadeInUp} className="mt-4 flex items-center gap-2">
                <Play className="w-4 h-4 text-[oklch(0.55_0.25_270)]" />
                <span className="text-[10px] text-muted-foreground">Click the button to start the demo</span>
              </motion.div>
            </motion.div>

            {/* Right: Demo (3 cols) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-3"
            >
              <AIDemo isDark={isDark} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Testimonials (Offset grid, left-aligned) ─────────────────── */}
      <section className="relative py-14 md:py-20 overflow-hidden bg-background">
        {/* Deep purple accent band at top */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[oklch(0.55_0.25_270_/_20%)] via-[oklch(0.55_0.25_270_/_40%)] to-[oklch(0.55_0.25_270_/_20%)]" />
        <AbstractBackground isDark={isDark} />

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="text-left mb-10"
          >
            <motion.div variants={fadeInUp}>
              <Badge className="bg-[oklch(0.55_0.25_270_/_10%)] text-[oklch(0.55_0.25_270)] border-[oklch(0.55_0.25_270_/_20%)] text-[10px] mb-3">
                <Star className="w-3 h-3 mr-1" /> Testimonials
              </Badge>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-xl sm:text-2xl font-bold text-foreground mb-2">
              Loved by builders{' '}
              <span className="gradient-text">everywhere</span>
            </motion.h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6"
          >
            {testimonials.map((t, i) => {
              const MetricIcon = t.metricIcon
              return (
                <motion.div
                  key={t.name}
                  variants={fadeInUp}
                  className={i === 1 ? 'md:mt-6' : ''}
                >
                  <Card className="group relative overflow-hidden border-border/50 hover:border-[oklch(0.55_0.25_270_/_30%)] transition-all duration-300 hover:shadow-lg hover:shadow-[oklch(0.55_0.25_270)_/_5] hover:-translate-y-1">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-full bg-[oklch(0.55_0.25_270)] flex items-center justify-center text-[10px] font-bold text-white">
                          {t.avatar}
                        </div>
                        <div>
                          <div className="text-xs font-medium text-foreground">{t.name}</div>
                          <div className="text-[10px] text-muted-foreground">{t.role}</div>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-3">&ldquo;{t.quote}&rdquo;</p>
                      <div className="flex items-center gap-1.5 text-[10px] text-[oklch(0.6_0.2_160)]">
                        <MetricIcon className="w-3 h-3" />
                        {t.metric}
                      </div>
                    </CardContent>
                    {/* Purple accent bottom */}
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[oklch(0.55_0.25_270)] opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* ─── CTA Banner (Deep purple accent background strip) ──────────── */}
      <section className="relative py-14 md:py-20 overflow-hidden">
        {/* Deep purple accent band - narrow, not overwhelming */}
        <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.55_0.25_270_/_8%)] via-background to-[oklch(0.55_0.25_270_/_5%)]" />
        {/* Decorative purple shapes */}
        <div className="absolute top-0 left-1/4 w-48 h-48 rounded-full animate-morph" style={{
          background: `radial-gradient(circle, oklch(0.55 0.25 270 / ${isDark ? '8%' : '5%'}), transparent 70%)`,
        }} />
        <div className="absolute bottom-0 right-1/4 w-36 h-36 rounded-full animate-morph" style={{
          background: `radial-gradient(circle, oklch(0.55 0.25 270 / ${isDark ? '6%' : '3%'}), transparent 70%)`,
          animationDelay: '-4s',
        }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="text-left"
          >
            <motion.h2 variants={fadeInUp} className="text-xl sm:text-2xl font-bold text-foreground">
              Free to start.{' '}
              <span className="gradient-text">Scale when ready.</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xs text-muted-foreground max-w-md mt-2">
              Generate your first site in seconds — no credit card needed. Upgrade for custom domains, team features, and more.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-3 mt-5">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleGetStarted}
                  className="bg-[oklch(0.55_0.25_270)] text-white hover:bg-[oklch(0.5_0.22_270)] border-0 text-xs font-semibold shadow-lg shadow-[oklch(0.55_0.25_270)_/_15] px-6"
                >
                  Start Building Free <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  onClick={() => navigate('login')}
                  className="border-border bg-card text-foreground hover:bg-accent text-xs"
                >
                  Sign In
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── FAQ (Left-aligned, max-w narrower) ────────────────────────── */}
      <section className="relative py-14 md:py-20 bg-background overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[oklch(0.55_0.25_270_/_20%)] to-transparent" />
        <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full animate-morph" style={{
          background: `radial-gradient(circle, oklch(0.55 0.25 270 / ${isDark ? '8%' : '5%'}), transparent 70%)`,
        }} />

        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="text-left mb-6"
          >
            <motion.div variants={fadeInUp}>
              <Badge className="bg-[oklch(0.55_0.25_270_/_10%)] text-[oklch(0.55_0.25_270)] border-[oklch(0.55_0.25_270_/_20%)] text-[10px] mb-3">
                <Eye className="w-3 h-3 mr-1" /> FAQ
              </Badge>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-xl sm:text-2xl font-bold text-foreground mb-2">
              Common{' '}
              <span className="gradient-text">questions</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Accordion type="single" collapsible className="space-y-2">
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="border border-border/50 rounded-lg px-4 data-[state=open]:border-[oklch(0.55_0.25_270_/_30%)] data-[state=open]:bg-[oklch(0.55_0.25_270_/_5%)] transition-all"
                >
                  <AccordionTrigger className="text-xs font-medium text-foreground hover:no-underline py-3">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-muted-foreground leading-relaxed pb-3">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* ─── Footer ───────────────────────────────────────────────────── */}
      <footer className="mt-auto border-t border-border bg-background">
        {/* Purple accent line above footer */}
        <div className="h-px bg-gradient-to-r from-transparent via-[oklch(0.55_0.25_270_/_20%)] to-transparent" />

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Hexagon className="w-4 h-4 text-[oklch(0.55_0.25_270)]" />
                <span className="font-bold text-sm gradient-text">Forge</span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                AI-powered website builder. Describe, generate, customize, deploy.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-foreground mb-2">Product</h4>
              <div className="space-y-1.5">
                {['Builder', 'Editor', 'Templates', 'Deploy'].map((item) => (
                  <button key={item} onClick={handleGetStarted} className="block text-[10px] text-muted-foreground hover:text-[oklch(0.55_0.25_270)] transition-colors">
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-foreground mb-2">Resources</h4>
              <div className="space-y-1.5">
                {['Documentation', 'Blog', 'Changelog', 'Support'].map((item) => (
                  <span key={item} className="block text-[10px] text-muted-foreground">{item}</span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-foreground mb-2">Company</h4>
              <div className="space-y-1.5">
                {['About', 'Careers', 'Privacy', 'Terms'].map((item) => (
                  <span key={item} className="block text-[10px] text-muted-foreground">{item}</span>
                ))}
              </div>
            </div>
          </div>
          <Separator className="mb-4" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <span className="text-[10px] text-muted-foreground">&copy; 2025 Forge. All rights reserved.</span>
            <div className="flex items-center gap-3">
              <Github className="w-3.5 h-3.5 text-muted-foreground hover:text-[oklch(0.55_0.25_270)] transition-colors cursor-pointer" />
              <Twitter className="w-3.5 h-3.5 text-muted-foreground hover:text-[oklch(0.55_0.25_270)] transition-colors cursor-pointer" />
              <Linkedin className="w-3.5 h-3.5 text-muted-foreground hover:text-[oklch(0.55_0.25_270)] transition-colors cursor-pointer" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
