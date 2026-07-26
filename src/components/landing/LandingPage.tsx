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
    gradient: 'from-pink-500 to-rose-500',
    bgGlow: 'oklch(0.65 0.25 350 / 15%)',
  },
  {
    icon: Paintbrush,
    title: 'Visual Editor',
    description: 'Refine every detail with an intuitive editor. Drag, drop, tweak — or let AI handle it.',
    gradient: 'from-emerald-500 to-teal-500',
    bgGlow: 'oklch(0.65 0.2 160 / 15%)',
  },
  {
    icon: Download,
    title: 'Export Freedom',
    description: 'Export clean HTML, CSS, and JS anytime — no lock-in, no vendor dependency.',
    gradient: 'from-amber-500 to-orange-500',
    bgGlow: 'oklch(0.7 0.2 80 / 15%)',
  },
  {
    icon: Rocket,
    title: 'Deploy Anywhere',
    description: 'Ship to Vercel, Netlify, or your own server. Forge doesn\'t tie you down.',
    gradient: 'from-cyan-500 to-blue-500',
    bgGlow: 'oklch(0.65 0.2 220 / 15%)',
  },
]

const steps = [
  {
    number: '1',
    title: 'Describe',
    description: 'Tell Forge what you want — a portfolio, SaaS page, restaurant site, anything.',
    icon: MousePointerClick,
    color: 'oklch(0.65 0.25 350)',
    colorLight: 'oklch(0.65 0.25 350 / 15%)',
  },
  {
    number: '2',
    title: 'AI Builds',
    description: 'Forge generates a complete, responsive website with proper structure in seconds.',
    icon: Zap,
    color: 'oklch(0.65 0.2 180)',
    colorLight: 'oklch(0.65 0.2 180 / 15%)',
  },
  {
    number: '3',
    title: 'Customize & Ship',
    description: 'Polish with the visual editor, then deploy anywhere. Your site, your code.',
    icon: Rocket,
    color: 'oklch(0.65 0.25 270)',
    colorLight: 'oklch(0.65 0.25 270 / 15%)',
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
  { id: 'hero', label: 'Hero', icon: Layout, color: '#f43f5e', bgGradient: 'linear-gradient(135deg, #f43f5e, #e11d48)', height: 'h-12' },
  { id: 'features', label: 'Features', icon: Columns3, color: '#8b5cf6', bgGradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', height: 'h-10' },
  { id: 'pricing', label: 'Pricing', icon: DollarSign, color: '#f59e0b', bgGradient: 'linear-gradient(135deg, #f59e0b, #d97706)', height: 'h-10' },
  { id: 'testimonials', label: 'Testimonials', icon: Star, color: '#10b981', bgGradient: 'linear-gradient(135deg, #10b981, #059669)', height: 'h-10' },
  { id: 'cta', label: 'CTA', icon: MessageSquare, color: '#06b6d4', bgGradient: 'linear-gradient(135deg, #06b6d4, #0891b2)', height: 'h-8' },
  { id: 'footer', label: 'Footer', icon: Type, color: '#6366f1', bgGradient: 'linear-gradient(135deg, #6366f1, #4f46e5)', height: 'h-6' },
]

// ─── Interactive Builder Playground ──────────────────────────────────

function BuilderPlayground() {
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      {/* Block Palette */}
      <div>
        <p className="text-xs text-gray-400 mb-3 font-medium uppercase tracking-wider">Drag blocks to build</p>
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
                  background: `${block.color}15`,
                  border: `1px solid ${block.color}30`,
                }}
              >
                <div
                  className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
                  style={{ background: block.bgGradient }}
                >
                  <Icon className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-xs font-medium text-white/90">{block.label}</span>
                <GripVertical className="w-3 h-3 text-white/30 ml-auto" />
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
            className="text-xs border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
          >
            <Shuffle className="w-3 h-3 mr-1" /> Shuffle
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleClear}
            disabled={placedBlocks.length === 0}
            className="text-xs border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
          >
            <Trash2 className="w-3 h-3 mr-1" /> Clear
          </Button>
        </div>
      </div>

      {/* Mini Canvas Preview */}
      <div>
        <p className="text-xs text-gray-400 mb-3 font-medium uppercase tracking-wider">Live preview</p>
        <div
          ref={canvasRef}
          onDrop={handleCanvasDrop}
          onDragOver={handleCanvasDragOver}
          onDragLeave={() => setDragOverIndex(null)}
          className="min-h-[280px] rounded-xl border border-white/10 bg-gray-950/50 p-3 relative overflow-hidden"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, oklch(1 0 0 / 5%) 1px, transparent 0)',
            backgroundSize: '20px 20px',
          }}
        >
          {/* Navbar mockup */}
          <div className="h-5 rounded bg-white/5 mb-2 flex items-center px-2 gap-1">
            <div className="w-2 h-2 rounded-full bg-rose-500/60" />
            <div className="w-2 h-2 rounded-full bg-amber-500/60" />
            <div className="w-2 h-2 rounded-full bg-emerald-500/60" />
            <div className="flex-1" />
            <div className="w-6 h-1.5 rounded bg-white/10" />
            <div className="w-6 h-1.5 rounded bg-white/10" />
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
                    <div className="absolute -top-1 left-0 right-0 h-0.5 bg-cyan-400 rounded-full" />
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
            <div className="h-0.5 bg-cyan-400 rounded-full mb-1.5" />
          )}

          {/* Empty state */}
          {placedBlocks.length === 0 && (
            <div className="flex flex-col items-center justify-center h-48 text-gray-500">
              <LayoutGrid className="w-8 h-8 mb-2 text-gray-600" />
              <p className="text-xs">Drag blocks here to build your site</p>
            </div>
          )}

          {/* Animated grid overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-cyan-500/20 animate-pulse-glow" />
            <div className="absolute bottom-8 left-4 w-12 h-12 rounded-full bg-rose-500/20 animate-pulse-glow" style={{ animationDelay: '2s' }} />
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Interactive Theme Playground ────────────────────────────────────

function ThemePlayground() {
  const [accentColor, setAccentColor] = useState('#8b5cf6')
  const [isDark, setIsDark] = useState(false)
  const [fontStyle, setFontStyle] = useState<'modern' | 'classic' | 'playful'>('modern')

  const fontStyles = {
    modern: { fontFamily: 'system-ui, sans-serif', letterSpacing: '-0.02em' },
    classic: { fontFamily: 'Georgia, serif', letterSpacing: '0.01em' },
    playful: { fontFamily: 'system-ui, sans-serif', letterSpacing: '0.02em' },
  }

  const colorPresets = ['#8b5cf6', '#f43f5e', '#10b981', '#f59e0b', '#06b6d4', '#ec4899']

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      {/* Controls */}
      <div className="space-y-4">
        <div>
          <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wider">Accent Color</p>
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
                  borderColor: accentColor === color ? 'white' : 'transparent',
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
          <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wider">Mode</p>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsDark(false)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all"
              style={{
                background: !isDark ? 'oklch(1 0 0 / 10%)' : 'oklch(1 0 0 / 3%)',
                border: !isDark ? '1px solid oklch(1 0 0 / 20%)' : '1px solid oklch(1 0 0 / 5%)',
                color: !isDark ? 'white' : 'oklch(1 0 0 / 50%)',
              }}
            >
              <Sun className="w-3.5 h-3.5" /> Light
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsDark(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all"
              style={{
                background: isDark ? 'oklch(1 0 0 / 10%)' : 'oklch(1 0 0 / 3%)',
                border: isDark ? '1px solid oklch(1 0 0 / 20%)' : '1px solid oklch(1 0 0 / 5%)',
                color: isDark ? 'white' : 'oklch(1 0 0 / 50%)',
              }}
            >
              <Moon className="w-3.5 h-3.5" /> Dark
            </motion.button>
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wider">Font Style</p>
          <div className="flex gap-2">
            {(['modern', 'classic', 'playful'] as const).map((style) => (
              <motion.button
                key={style}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setFontStyle(style)}
                className="px-3 py-2 rounded-lg text-xs font-medium transition-all capitalize"
                style={{
                  background: fontStyle === style ? 'oklch(1 0 0 / 10%)' : 'oklch(1 0 0 / 3%)',
                  border: fontStyle === style ? '1px solid oklch(1 0 0 / 20%)' : '1px solid oklch(1 0 0 / 5%)',
                  color: fontStyle === style ? 'white' : 'oklch(1 0 0 / 50%)',
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
      <div className="rounded-xl overflow-hidden border border-white/10 shadow-lg">
        <motion.div
          layout
          className="p-3"
          style={{
            background: isDark ? '#0f0f1a' : '#ffffff',
            transition: 'background 0.4s ease',
          }}
        >
          {/* Mini nav */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded" style={{ background: accentColor }} />
              <span className="text-[9px] font-bold" style={{ color: isDark ? '#fff' : '#111', ...fontStyles[fontStyle] }}>Brand</span>
            </div>
            <div className="flex gap-2">
              <div className="w-5 h-1 rounded" style={{ background: isDark ? '#ffffff20' : '#00000015' }} />
              <div className="w-5 h-1 rounded" style={{ background: isDark ? '#ffffff20' : '#00000015' }} />
            </div>
          </div>

          {/* Mini hero */}
          <div
            className="rounded-lg p-3 mb-2 text-center"
            style={{
              background: isDark
                ? `linear-gradient(135deg, ${accentColor}30, ${accentColor}10)`
                : `linear-gradient(135deg, ${accentColor}15, ${accentColor}05)`,
              transition: 'background 0.4s ease',
            }}
          >
            <motion.h3
              layout
              className="text-[11px] font-bold mb-1"
              style={{ color: isDark ? '#fff' : '#111', ...fontStyles[fontStyle] }}
            >
              Build something amazing
            </motion.h3>
            <p className="text-[8px] mb-2" style={{ color: isDark ? '#ffffff80' : '#00000060' }}>
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
                  background: isDark ? '#ffffff08' : '#00000005',
                  border: `1px solid ${isDark ? '#ffffff10' : '#00000008'}`,
                  transition: 'background 0.4s ease',
                }}
              >
                <div className="w-3 h-3 rounded mx-auto mb-0.5" style={{ background: `${accentColor}40` }} />
                <div className="w-5 h-0.5 rounded mx-auto mb-0.5" style={{ background: isDark ? '#ffffff20' : '#00000015' }} />
                <div className="w-7 h-0.5 rounded mx-auto" style={{ background: isDark ? '#ffffff10' : '#00000008' }} />
              </motion.div>
            ))}
          </div>

          {/* Mini footer */}
          <div
            className="rounded-md p-1.5 flex items-center justify-between"
            style={{
              background: isDark ? '#ffffff05' : '#00000003',
              transition: 'background 0.4s ease',
            }}
          >
            <div className="w-4 h-0.5 rounded" style={{ background: isDark ? '#ffffff15' : '#00000010' }} />
            <div className="w-6 h-0.5 rounded" style={{ background: isDark ? '#ffffff10' : '#00000008' }} />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// ─── Interactive AI Demo ─────────────────────────────────────────────

function AIDemo() {
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

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center gap-3">
        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="text-xs bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white border-0 shadow-lg shadow-violet-500/20"
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
              className="text-xs border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
            >
              <RotateCcw className="w-3 h-3 mr-1" /> Regenerate
            </Button>
          </motion.div>
        )}
      </div>

      {/* Progress bar */}
      {isGenerating && (
        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #8b5cf6, #ec4899, #06b6d4)' }}
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
          className="text-[10px] text-violet-300/70 font-mono"
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
        className="rounded-xl border border-white/10 bg-gray-950/50 p-3 min-h-[200px] relative overflow-hidden"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, oklch(1 0 0 / 3%) 1px, transparent 0)',
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
              className="flex items-center justify-between mb-3 pb-2 border-b border-white/5"
            >
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-gradient-to-br from-violet-500 to-fuchsia-500" />
                <div className="w-8 h-1.5 rounded bg-white/15" />
              </div>
              <div className="flex gap-2">
                <div className="w-6 h-1 rounded bg-white/10" />
                <div className="w-6 h-1 rounded bg-white/10" />
                <div className="w-6 h-1 rounded bg-white/10" />
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
                background: 'linear-gradient(135deg, #8b5cf615, #ec489915)',
              }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '70%' }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="h-2 rounded bg-white/20 mx-auto mb-1.5"
              />
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '50%' }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="h-1 rounded bg-white/10 mx-auto mb-2"
              />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.8 }}
                className="inline-block px-2.5 py-1 rounded-full text-[8px] font-medium text-white bg-gradient-to-r from-violet-500 to-fuchsia-500"
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
                  className="rounded-md p-2 bg-white/5 border border-white/5"
                >
                  <div className="w-4 h-4 rounded bg-white/10 mb-1" />
                  <div className="w-full h-1 rounded bg-white/10 mb-0.5" />
                  <div className="w-2/3 h-1 rounded bg-white/5" />
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
              className="flex items-center justify-between p-2 rounded-md bg-white/5"
            >
              <div className="w-6 h-1 rounded bg-white/10" />
              <div className="flex gap-1.5">
                <div className="w-3 h-1 rounded bg-white/5" />
                <div className="w-3 h-1 rounded bg-white/5" />
                <div className="w-3 h-1 rounded bg-white/5" />
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
              className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center"
            >
              <CheckCircle2 className="w-3 h-3 text-white" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Idle state */}
        {stage === 'idle' && !isGenerating && (
          <div className="flex flex-col items-center justify-center h-48 text-gray-500">
            <Wand2 className="w-8 h-8 mb-2 text-gray-600" />
            <p className="text-xs">Click &quot;Watch AI Build&quot; to see the magic</p>
          </div>
        )}

        {/* Floating decorative elements */}
        <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-violet-500/5 animate-pulse-glow pointer-events-none" />
        <div className="absolute bottom-6 left-6 w-8 h-8 rounded-full bg-fuchsia-500/5 animate-pulse-glow pointer-events-none" style={{ animationDelay: '2s' }} />
      </div>
    </div>
  )
}

// ─── Floating Particles Component ────────────────────────────────────

function FloatingParticles() {
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
            background: `oklch(${0.7 + Math.random() * 0.2} ${0.15 + Math.random() * 0.1} ${Math.random() * 360} / 30%)`,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, (Math.random() - 0.5) * 20, 0],
            opacity: [0.3, 0.6, 0.3],
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

// ─── Main Landing Page Component ─────────────────────────────────────

export default function LandingPage() {
  const navigate = useAppStore(s => s.navigate)
  const setBuilderPrompt = useAppStore(s => s.setBuilderPrompt)
  const themeMode = useAppStore(s => s.themeMode)
  const setThemeMode = useAppStore(s => s.setThemeMode)
  const [promptValue, setPromptValue] = useState('')

  const toggleTheme = useCallback(() => {
    const newMode = themeMode === 'light' ? 'dark' : 'light'
    setThemeMode(newMode)
    if (newMode === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [themeMode, setThemeMode])

  const handleGenerate = useCallback(() => {
    if (!promptValue.trim()) return
    setBuilderPrompt(promptValue)
    navigate('builder')
  }, [promptValue, setBuilderPrompt, navigate])

  const handleGetStarted = useCallback(() => {
    navigate('builder')
  }, [navigate])

  return (
    <div className="min-h-screen flex flex-col">
      {/* ─── Navbar ───────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-6xl mx-auto px-4 h-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hexagon className="w-5 h-5 text-primary" />
            <span className="font-bold text-sm gradient-text">Forge</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="w-8 h-8 p-0"
            >
              {themeMode === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
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
              className="text-xs bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* ─── Hero Section ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-16 pb-16 md:pt-20 md:pb-20" style={{
        background: 'linear-gradient(135deg, oklch(0.2 0.08 290), oklch(0.15 0.06 270), oklch(0.18 0.05 200))',
      }}>
        {/* Animated mesh gradient background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full animate-morph" style={{
            background: 'radial-gradient(circle, oklch(0.55 0.25 290 / 30%), transparent 70%)',
          }} />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full animate-morph" style={{
            background: 'radial-gradient(circle, oklch(0.55 0.2 180 / 25%), transparent 70%)',
            animationDelay: '-3s',
          }} />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full animate-pulse-glow" style={{
            background: 'radial-gradient(circle, oklch(0.6 0.22 350 / 20%), transparent 70%)',
          }} />
        </div>

        {/* Floating orbs */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute w-3 h-3 rounded-full bg-fuchsia-400/30"
            style={{ top: '20%', left: '15%' }}
            animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute w-2 h-2 rounded-full bg-cyan-400/30"
            style={{ top: '30%', right: '20%' }}
            animate={{ y: [0, 12, 0], x: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />
          <motion.div
            className="absolute w-4 h-4 rounded-full bg-violet-400/20"
            style={{ bottom: '30%', left: '30%' }}
            animate={{ y: [0, -10, 0], x: [0, 15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          />
          <motion.div
            className="absolute w-2 h-2 rounded-full bg-rose-400/30"
            style={{ bottom: '20%', right: '35%' }}
            animate={{ y: [0, 8, 0], x: [0, -12, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          />
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            <motion.div variants={fadeInUp}>
              <Badge className="bg-white/10 text-white/80 border-white/10 text-[10px] px-3 py-1 hover:bg-white/15">
                <Sparkles className="w-3 h-3 mr-1" /> AI-Powered Website Builder
              </Badge>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight">
              Your idea. Our AI.{' '}
              <span className="bg-gradient-to-r from-fuchsia-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent animate-gradient" style={{ backgroundSize: '200% 200%' }}>
                A complete website.
              </span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-sm text-white/60 max-w-lg mx-auto">
              Describe what you want. Forge generates a full, responsive website in seconds.
              Customize with the visual editor, then deploy anywhere.
            </motion.p>

            {/* Prompt Input */}
            <motion.div variants={fadeInUp} className="max-w-md mx-auto">
              <div className="flex gap-2 p-1.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
                <input
                  value={promptValue}
                  onChange={(e) => setPromptValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                  placeholder="A modern SaaS landing page with pricing..."
                  className="flex-1 bg-transparent text-white text-xs placeholder:text-white/40 px-3 py-2 outline-none"
                />
                <Button
                  onClick={handleGenerate}
                  size="sm"
                  className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-400 hover:to-fuchsia-400 text-white border-0 text-xs px-4 shadow-lg shadow-violet-500/20"
                >
                  <Sparkles className="w-3 h-3 mr-1" /> Generate
                </Button>
              </div>
            </motion.div>

            {/* Suggestion pills */}
            <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-1.5">
              {['SaaS landing page', 'Portfolio site', 'Restaurant website', 'E-commerce store'].map((pill) => (
                <motion.button
                  key={pill}
                  whileHover={{ scale: 1.05, backgroundColor: 'oklch(1 0 0 / 15%)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { setPromptValue(pill); setBuilderPrompt(pill); navigate('builder') }}
                  className="text-[10px] text-white/50 px-2.5 py-1 rounded-full bg-white/5 border border-white/5 hover:text-white/80 transition-colors"
                >
                  {pill}
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── Stats Section ────────────────────────────────────────────── */}
      <section className="relative py-8 overflow-hidden" style={{
        background: 'linear-gradient(135deg, oklch(0.65 0.2 25), oklch(0.55 0.2 290), oklch(0.5 0.18 270))',
      }}>
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, oklch(1 0 0 / 30%) 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }} />
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="relative z-10 max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <motion.div key={stat.label} variants={fadeInUp} className="text-center">
                <Icon className="w-4 h-4 text-white/60 mx-auto mb-1" />
                <div className="text-lg sm:text-xl font-bold text-white">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-[10px] text-white/60">{stat.label}</div>
              </motion.div>
            )
          })}
        </motion.div>
      </section>

      {/* ─── Interactive Builder Playground ────────────────────────────── */}
      <section className="relative py-12 md:py-16 overflow-hidden" style={{
        background: 'linear-gradient(180deg, oklch(0.13 0.03 270), oklch(0.1 0.02 260))',
      }}>
        {/* Decorative blobs */}
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full animate-morph" style={{
          background: 'radial-gradient(circle, oklch(0.6 0.25 290 / 15%), transparent 70%)',
        }} />
        <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full animate-morph" style={{
          background: 'radial-gradient(circle, oklch(0.6 0.2 180 / 12%), transparent 70%)',
          animationDelay: '-4s',
        }} />

        <div className="relative z-10 max-w-6xl mx-auto px-4">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="text-center mb-6"
          >
            <motion.div variants={fadeInUp}>
              <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 text-[10px] mb-3">
                <MousePointerClick className="w-3 h-3 mr-1" /> Interactive
              </Badge>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-xl sm:text-2xl font-bold text-white mb-2">
              Build a site,{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">your way</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xs text-white/50 max-w-md mx-auto">
              Drag blocks onto the canvas to arrange your website layout. Try different combinations — it&apos;s fun!
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <BuilderPlayground />
          </motion.div>
        </div>
      </section>

      {/* ─── Features Section ─────────────────────────────────────────── */}
      <section className="relative py-12 md:py-16 bg-background overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-48 h-48 rounded-full animate-morph" style={{
          background: 'radial-gradient(circle, oklch(0.65 0.2 290 / 8%), transparent 70%)',
        }} />
        <div className="absolute bottom-20 left-10 w-36 h-36 rounded-full animate-morph" style={{
          background: 'radial-gradient(circle, oklch(0.65 0.2 180 / 8%), transparent 70%)',
          animationDelay: '-5s',
        }} />
        <FloatingParticles />

        <div className="relative z-10 max-w-6xl mx-auto px-4">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="text-center mb-8"
          >
            <motion.div variants={fadeInUp}>
              <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] mb-3">
                <Zap className="w-3 h-3 mr-1" /> Features
              </Badge>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-xl sm:text-2xl font-bold text-foreground mb-2">
              Everything you need to build
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xs text-muted-foreground max-w-md mx-auto">
              From AI generation to deployment, Forge has every tool to take your idea live.
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  variants={fadeInUp}
                  whileHover={{
                    y: -4,
                    rotateY: 2,
                    transition: { duration: 0.2 },
                  }}
                  style={{ perspective: 1000 }}
                >
                  <Card className="group relative overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                    {/* Glow effect on hover */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: feature.bgGlow }}
                    />
                    <CardContent className="relative z-10 p-5">
                      <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-3 shadow-lg`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-sm font-semibold text-foreground mb-1">{feature.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
                    </CardContent>
                    {/* Gradient border bottom on hover */}
                    <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* ─── Interactive Theme Playground ──────────────────────────────── */}
      <section className="relative py-12 md:py-16 overflow-hidden" style={{
        background: 'linear-gradient(180deg, oklch(0.12 0.02 270), oklch(0.1 0.02 260))',
      }}>
        <div className="absolute top-10 right-1/4 w-44 h-44 rounded-full animate-morph" style={{
          background: 'radial-gradient(circle, oklch(0.6 0.22 200 / 12%), transparent 70%)',
        }} />
        <div className="absolute bottom-10 left-1/4 w-32 h-32 rounded-full animate-morph" style={{
          background: 'radial-gradient(circle, oklch(0.6 0.2 350 / 10%), transparent 70%)',
          animationDelay: '-3s',
        }} />

        <div className="relative z-10 max-w-6xl mx-auto px-4">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="text-center mb-6"
          >
            <motion.div variants={fadeInUp}>
              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] mb-3">
                <Palette className="w-3 h-3 mr-1" /> Live Customizer
              </Badge>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-xl sm:text-2xl font-bold text-white mb-2">
              Make it{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">yours</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xs text-white/50 max-w-md mx-auto">
              Pick your accent color, toggle light/dark, and choose a font style. Watch the preview update live.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ThemePlayground />
          </motion.div>
        </div>
      </section>

      {/* ─── How It Works ─────────────────────────────────────────────── */}
      <section className="relative py-12 md:py-16 bg-background overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <FloatingParticles />

        <div className="relative z-10 max-w-6xl mx-auto px-4">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="text-center mb-8"
          >
            <motion.div variants={fadeInUp}>
              <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] mb-3">
                <ArrowRight className="w-3 h-3 mr-1" /> How It Works
              </Badge>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-xl sm:text-2xl font-bold text-foreground mb-2">
              Three steps to your site
            </motion.h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {steps.map((step, i) => {
              const Icon = step.icon
              return (
                <motion.div key={step.number} variants={fadeInUp} className="text-center">
                  <div className="relative inline-flex items-center justify-center mb-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{ background: step.colorLight }}
                    >
                      <Icon className="w-5 h-5" style={{ color: step.color }} />
                    </div>
                    <div
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
                      style={{ background: step.color }}
                    >
                      {step.number}
                    </div>
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">{step.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 text-muted-foreground/30">
                      <ChevronRight className="w-6 h-6" />
                    </div>
                  )}
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* ─── Interactive AI Demo ──────────────────────────────────────── */}
      <section className="relative py-12 md:py-16 overflow-hidden" style={{
        background: 'linear-gradient(180deg, oklch(0.15 0.04 290), oklch(0.12 0.03 270), oklch(0.1 0.02 260))',
      }}>
        {/* Decorative elements */}
        <div className="absolute top-20 left-20 w-52 h-52 rounded-full animate-morph" style={{
          background: 'radial-gradient(circle, oklch(0.5 0.25 290 / 15%), transparent 70%)',
        }} />
        <div className="absolute bottom-20 right-20 w-40 h-40 rounded-full animate-morph" style={{
          background: 'radial-gradient(circle, oklch(0.5 0.2 330 / 12%), transparent 70%)',
          animationDelay: '-6s',
        }} />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }} />

        <div className="relative z-10 max-w-6xl mx-auto px-4">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="text-center mb-6"
          >
            <motion.div variants={fadeInUp}>
              <Badge className="bg-violet-500/10 text-violet-400 border-violet-500/20 text-[10px] mb-3">
                <Wand2 className="w-3 h-3 mr-1" /> AI Demo
              </Badge>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-xl sm:text-2xl font-bold text-white mb-2">
              Watch AI build a site{' '}
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">in real-time</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xs text-white/50 max-w-md mx-auto">
              See how Forge generates a complete website piece by piece — navbar, hero, features, and footer.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            <AIDemo />
          </motion.div>
        </div>
      </section>

      {/* ─── Testimonials ─────────────────────────────────────────────── */}
      <section className="relative py-12 md:py-16 overflow-hidden" style={{
        background: 'linear-gradient(135deg, oklch(0.55 0.08 290), oklch(0.5 0.06 270), oklch(0.45 0.05 200))',
      }}>
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, oklch(1 0 0 / 30%) 1px, transparent 0)',
          backgroundSize: '20px 20px',
        }} />
        <div className="absolute top-10 right-20 w-40 h-40 rounded-full animate-morph" style={{
          background: 'radial-gradient(circle, oklch(0.7 0.15 200 / 10%), transparent 70%)',
        }} />

        <div className="relative z-10 max-w-6xl mx-auto px-4">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="text-center mb-8"
          >
            <motion.div variants={fadeInUp}>
              <Badge className="bg-white/10 text-white/80 border-white/10 text-[10px] mb-3">
                <Star className="w-3 h-3 mr-1" /> Testimonials
              </Badge>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-xl sm:text-2xl font-bold text-white mb-2">
              Loved by builders everywhere
            </motion.h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {testimonials.map((t) => {
              const MetricIcon = t.metricIcon
              return (
                <motion.div key={t.name} variants={fadeInUp}>
                  <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/8 transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-400 flex items-center justify-center text-[10px] font-bold text-white">
                        {t.avatar}
                      </div>
                      <div>
                        <div className="text-xs font-medium text-white">{t.name}</div>
                        <div className="text-[10px] text-white/50">{t.role}</div>
                      </div>
                    </div>
                    <p className="text-xs text-white/70 leading-relaxed mb-3">&ldquo;{t.quote}&rdquo;</p>
                    <div className="flex items-center gap-1.5 text-[10px] text-emerald-400/80">
                      <MetricIcon className="w-3 h-3" />
                      {t.metric}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* ─── Pricing Hint / CTA Banner ───────────────────────────────── */}
      <section className="relative py-12 md:py-16 overflow-hidden" style={{
        background: 'linear-gradient(135deg, oklch(0.55 0.25 350), oklch(0.5 0.2 290), oklch(0.45 0.18 250))',
      }}>
        {/* Animated gradient */}
        <div className="absolute inset-0 animate-gradient" style={{
          background: 'linear-gradient(135deg, oklch(0.55 0.25 350 / 50%), oklch(0.5 0.2 290 / 50%), oklch(0.45 0.18 250 / 50%))',
          backgroundSize: '200% 200%',
        }} />
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, oklch(1 0 0 / 40%) 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }} />

        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="space-y-4"
          >
            <motion.h2 variants={fadeInUp} className="text-xl sm:text-2xl font-bold text-white">
              Free to start. Scale when ready.
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xs text-white/60 max-w-md mx-auto">
              Generate your first site in seconds — no credit card needed. Upgrade for custom domains, team features, and more.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-3">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleGetStarted}
                  className="bg-white text-black hover:bg-white/90 text-xs font-semibold shadow-lg shadow-black/20 px-6"
                >
                  Start Building Free <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  onClick={() => navigate('login')}
                  className="border-white/20 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white text-xs"
                >
                  Sign In
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── FAQ ──────────────────────────────────────────────────────── */}
      <section className="relative py-12 md:py-16 bg-background overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full animate-morph" style={{
          background: 'radial-gradient(circle, oklch(0.65 0.2 290 / 8%), transparent 70%)',
        }} />

        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="text-center mb-6"
          >
            <motion.div variants={fadeInUp}>
              <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] mb-3">
                <Eye className="w-3 h-3 mr-1" /> FAQ
              </Badge>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-xl sm:text-2xl font-bold text-foreground mb-2">
              Common questions
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
                  className="border border-border/50 rounded-lg px-4 data-[state=open]:border-primary/30 data-[state=open]:bg-primary/5 transition-all"
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
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Hexagon className="w-4 h-4 text-primary" />
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
                  <button key={item} onClick={handleGetStarted} className="block text-[10px] text-muted-foreground hover:text-foreground transition-colors">
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
              <Github className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" />
              <Twitter className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" />
              <Linkedin className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
