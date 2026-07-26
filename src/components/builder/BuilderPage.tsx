'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore, type BuilderStyle, type BuilderComplexity, type BuilderPageLength, type BuilderLayoutDensity, type BuilderAnimationLevel, type BuilderResponsivePriority, type BuilderContentTone, type BuilderNavigationStyle, type BuilderSEOLevel, type BuilderAccessibilityLevel, type BuilderImageStyle, type BuilderCTAStyle } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'
import {
  Sparkles, Wand2, Monitor, Smartphone, Tablet, Code2, Rocket,
  Download, Eye, ArrowLeft, RefreshCw, Save, X,
  ChevronRight, ChevronDown, ChevronUp, Zap, Layers, Palette, Type, Layout,
  Loader2, CheckCircle2, AlertCircle, Globe, Home, Mail, Server,
  Briefcase, Store, ShoppingBag, Newspaper, Building2, Calendar, User,
  Sun, Moon, Minimize, Flame, Sliders, Paintbrush, Shield, Accessibility,
  Image, Navigation, Megaphone, Clock, DollarSign, HelpCircle,
  MessageSquare, Share2, Phone, Columns, Grip, Tag, AlignLeft, AlignCenter, AlignRight, LayoutGrid,
} from 'lucide-react'

// ─── Industry metadata ──────────────────────────────────────────────────────

type Industry = 'portfolio' | 'saas' | 'restaurant' | 'ecommerce' | 'blog' | 'agency' | 'event' | 'personal'

const INDUSTRY_OPTIONS: { id: Industry; label: string; icon: typeof Briefcase; hint: string }[] = [
  { id: 'portfolio', label: 'Creative Portfolio', icon: Palette, hint: 'Designers, photographers, artists' },
  { id: 'saas', label: 'SaaS / Startup', icon: Zap, hint: 'Software products and apps' },
  { id: 'restaurant', label: 'Restaurant / Café', icon: Flame, hint: 'Food, menus, reservations' },
  { id: 'ecommerce', label: 'E-Commerce Store', icon: ShoppingBag, hint: 'Online shops, products' },
  { id: 'blog', label: 'Editorial Blog', icon: Newspaper, hint: 'Articles, magazines, content' },
  { id: 'agency', label: 'Agency / Studio', icon: Building2, hint: 'Services, case studies, team' },
  { id: 'event', label: 'Event / Conference', icon: Calendar, hint: 'Schedules, speakers, registration' },
  { id: 'personal', label: 'Personal / Resume', icon: User, hint: 'Bio, experience, projects' },
]

// ─── Style presets (expanded from 4 to 8) ────────────────────────────────────

const STYLE_OPTIONS: { id: BuilderStyle; label: string; icon: typeof Sun; swatch: { bg: string; accent: string; text: string } }[] = [
  { id: 'light', label: 'Light', icon: Sun, swatch: { bg: '#FFFFFF', accent: '#6366F1', text: '#0F172A' } },
  { id: 'dark', label: 'Dark', icon: Moon, swatch: { bg: '#0A0A0F', accent: '#A855F7', text: '#F8FAFC' } },
  { id: 'minimal', label: 'Minimal', icon: Minimize, swatch: { bg: '#FAFAF9', accent: '#1C1917', text: '#1C1917' } },
  { id: 'bold', label: 'Bold', icon: Flame, swatch: { bg: '#FFFBEB', accent: '#F59E0B', text: '#1F2937' } },
  { id: 'glassmorphism', label: 'Glass', icon: Sparkles, swatch: { bg: '#1a1a2e', accent: '#a855f7', text: '#f8fafc' } },
  { id: 'neobrutalism', label: 'Neo-Brutal', icon: Zap, swatch: { bg: '#FFF000', accent: '#000000', text: '#000000' } },
  { id: 'retro', label: 'Retro', icon: Clock, swatch: { bg: '#F5E6D3', accent: '#D2691E', text: '#3C2415' } },
  { id: 'gradient', label: 'Gradient', icon: Palette, swatch: { bg: '#0F172A', accent: '#6366F1', text: '#F8FAFC' } },
]

// ─── Font family options ────────────────────────────────────────────────────

const FONT_OPTIONS = [
  'Inter', 'Geist', 'system-ui', 'Arial', 'Helvetica', 'Georgia',
  'Times New Roman', 'Courier New', 'Verdana', 'Playfair Display',
  'Montserrat', 'Poppins', 'Roboto', 'Lora', 'Merriweather', 'Fira Code',
]

// ─── Option descriptors ─────────────────────────────────────────────────────

const COMPLEXITY_OPTIONS: { id: BuilderComplexity; label: string; desc: string }[] = [
  { id: 'simple', label: 'Simple', desc: 'Basic layout, minimal sections, quick generation' },
  { id: 'standard', label: 'Standard', desc: 'Balanced layout with key sections and content' },
  { id: 'advanced', label: 'Advanced', desc: 'Rich layout, multiple sections, detailed content' },
  { id: 'comprehensive', label: 'Comprehensive', desc: 'Full-featured site with every section fleshed out' },
]

const PAGE_LENGTH_OPTIONS: { id: BuilderPageLength; label: string; desc: string }[] = [
  { id: 'short', label: 'Short', desc: '1-2 sections, minimal scroll' },
  { id: 'medium', label: 'Medium', desc: '3-4 sections, balanced content' },
  { id: 'long', label: 'Long', desc: '5-7 sections, detailed content' },
  { id: 'extended', label: 'Extended', desc: '8+ sections, comprehensive coverage' },
]

const LAYOUT_DENSITY_OPTIONS: { id: BuilderLayoutDensity; label: string; desc: string }[] = [
  { id: 'compact', label: 'Compact', desc: 'Tight spacing, more content per view' },
  { id: 'comfortable', label: 'Comfortable', desc: 'Standard spacing, easy reading' },
  { id: 'spacious', label: 'Spacious', desc: 'Generous whitespace, elegant feel' },
  { id: 'ultra-spacious', label: 'Ultra-Spacious', desc: 'Maximum whitespace, premium feel' },
]

const CONTENT_TONE_OPTIONS: { id: BuilderContentTone; label: string; desc: string }[] = [
  { id: 'professional', label: 'Professional', desc: 'Formal, business-oriented language' },
  { id: 'casual', label: 'Casual', desc: 'Friendly, conversational tone' },
  { id: 'playful', label: 'Playful', desc: 'Fun, creative, energetic language' },
  { id: 'elegant', label: 'Elegant', desc: 'Refined, sophisticated expression' },
  { id: 'technical', label: 'Technical', desc: 'Precise, detailed, jargon-friendly' },
  { id: 'warm', label: 'Warm', desc: 'Inviting, personal, empathetic tone' },
]

const ANIMATION_LEVEL_OPTIONS: { id: BuilderAnimationLevel; label: string; desc: string }[] = [
  { id: 'none', label: 'None', desc: 'No animations, purely static' },
  { id: 'subtle', label: 'Subtle', desc: 'Micro-interactions, gentle transitions' },
  { id: 'moderate', label: 'Moderate', desc: 'Visible animations, scroll reveals' },
  { id: 'energetic', label: 'Energetic', desc: 'Dynamic animations, bold transitions' },
  { id: 'immersive', label: 'Immersive', desc: 'Full animated experience, parallax, 3D' },
]

const RESPONSIVE_PRIORITY_OPTIONS: { id: BuilderResponsivePriority; label: string; desc: string }[] = [
  { id: 'mobile-first', label: 'Mobile-First', desc: 'Optimized for mobile, then desktop' },
  { id: 'desktop-first', label: 'Desktop-First', desc: 'Optimized for desktop, then mobile' },
  { id: 'universal', label: 'Universal', desc: 'Equal priority for all devices' },
]

const NAVIGATION_STYLE_OPTIONS: { id: BuilderNavigationStyle; label: string; desc: string }[] = [
  { id: 'top', label: 'Top Bar', desc: 'Fixed navigation bar at top' },
  { id: 'sticky', label: 'Sticky Header', desc: 'Header sticks on scroll' },
  { id: 'sidebar', label: 'Sidebar', desc: 'Side navigation panel' },
  { id: 'centered', label: 'Centered', desc: 'Centered logo with nav below' },
  { id: 'minimal', label: 'Minimal', desc: 'Icon-only or hamburger menu' },
]

const CTA_STYLE_OPTIONS: { id: BuilderCTAStyle; label: string; desc: string }[] = [
  { id: 'button', label: 'Button', desc: 'Standard solid button' },
  { id: 'pill', label: 'Pill', desc: 'Rounded pill-shaped button' },
  { id: 'link', label: 'Link', desc: 'Text link with arrow' },
  { id: 'gradient', label: 'Gradient', desc: 'Gradient-filled button' },
  { id: 'outlined', label: 'Outlined', desc: 'Border-only button' },
]

const SEO_LEVEL_OPTIONS: { id: BuilderSEOLevel; label: string; desc: string }[] = [
  { id: 'basic', label: 'Basic', desc: 'Title, meta description, headings' },
  { id: 'standard', label: 'Standard', desc: 'Full meta tags, structured data hints' },
  { id: 'advanced', label: 'Advanced', desc: 'Complete SEO markup, OG tags, semantic HTML' },
]

const ACCESSIBILITY_LEVEL_OPTIONS: { id: BuilderAccessibilityLevel; label: string; desc: string }[] = [
  { id: 'basic', label: 'Basic', desc: 'Alt text, semantic elements' },
  { id: 'enhanced', label: 'Enhanced', desc: 'ARIA labels, keyboard nav, focus states' },
  { id: 'maximum', label: 'Maximum', desc: 'WCAG 2.1 AA compliant, full accessibility' },
]

const IMAGE_STYLE_OPTIONS: { id: BuilderImageStyle; label: string; desc: string }[] = [
  { id: 'illustrations', label: 'Illustrations', desc: 'Custom SVG/CSS illustrations' },
  { id: 'photos', label: 'Photos', desc: 'Real photography from Unsplash' },
  { id: 'icons', label: 'Icons', desc: 'Icon-focused design (Lucide-style)' },
  { id: 'abstract', label: 'Abstract', desc: 'Abstract patterns, gradients, shapes' },
  { id: 'mixed', label: 'Mixed', desc: 'Combination of all styles' },
  { id: 'none', label: 'None', desc: 'No images, pure typography & color' },
]

const LOGO_PLACEMENT_OPTIONS = [
  { id: 'left', label: 'Left', icon: AlignLeft },
  { id: 'center', label: 'Center', icon: AlignCenter },
  { id: 'right', label: 'Right', icon: AlignRight },
]

const SECTION_TOGGLE_ITEMS: { key: string; label: string; icon: typeof Sparkles; desc: string }[] = [
  { key: 'includeHero', label: 'Hero Section', icon: Layout, desc: 'Large headline + CTA area' },
  { key: 'includeFeatures', label: 'Features Grid', icon: LayoutGrid, desc: '3-6 feature cards' },
  { key: 'includeTestimonials', label: 'Testimonials', icon: MessageSquare, desc: 'Customer quotes & reviews' },
  { key: 'includePricing', label: 'Pricing', icon: DollarSign, desc: 'Pricing tiers table' },
  { key: 'includeFAQ', label: 'FAQ', icon: HelpCircle, desc: 'Frequently asked questions' },
  { key: 'includeNewsletter', label: 'Newsletter', icon: Mail, desc: 'Email signup form' },
  { key: 'includeCTA', label: 'CTA Banner', icon: Megaphone, desc: 'Call-to-action section' },
  { key: 'includeFooter', label: 'Footer', icon: Layers, desc: 'Site footer with links' },
  { key: 'includeAnimations', label: 'Animations', icon: Sparkles, desc: 'Scroll reveals & transitions' },
  { key: 'includeSocialLinks', label: 'Social Links', icon: Share2, desc: 'Social media icons' },
  { key: 'includeContactForm', label: 'Contact Form', icon: Phone, desc: 'Contact form with fields' },
]

const PAGE_CONFIG_ITEMS = [
  { id: 'home', name: 'Home', icon: Home },
  { id: 'about', name: 'About', icon: Layers },
  { id: 'services', name: 'Services', icon: Briefcase },
  { id: 'contact', name: 'Contact', icon: Mail },
  { id: 'blog', name: 'Blog', icon: Newspaper },
  { id: 'pricing', name: 'Pricing', icon: DollarSign },
  { id: 'faq', name: 'FAQ', icon: HelpCircle },
  { id: 'portfolio', name: 'Portfolio', icon: Palette },
]

const CORE_PAGE_ORDER: { id: 'home' | 'about' | 'services' | 'contact'; name: string; icon: typeof Home }[] = [
  { id: 'home', name: 'Home', icon: Home },
  { id: 'about', name: 'About', icon: Layers },
  { id: 'services', name: 'Services', icon: Briefcase },
  { id: 'contact', name: 'Contact', icon: Mail },
]

const PROMPT_SUGGESTIONS: { text: string; industry: Industry; icon: string }[] = [
  { text: 'A cozy specialty coffee shop called "Ember & Roast" in Portland — focus on single-origin beans and a warm, rustic vibe', industry: 'restaurant', icon: '☕' },
  { text: 'A photography portfolio for Mira Solano, a Brooklyn-based editorial photographer who shoots for fashion magazines', industry: 'portfolio', icon: '📷' },
  { text: 'A SaaS landing page for "NovaPulse" — an AI analytics platform for product teams, with a 14-day free trial', industry: 'saas', icon: '⚡' },
  { text: 'An online store for "Luxe Market" — a curated marketplace for handmade home goods and ceramics', industry: 'ecommerce', icon: '🛍️' },
  { text: 'A design agency site for "Studio Arc" — a brand strategy and visual design studio in Berlin', industry: 'agency', icon: '🎨' },
  { text: 'A personal site for a senior product designer showing case studies, blog posts, and contact info', industry: 'personal', icon: '👤' },
]

const DEVICE_SIZES = {
  desktop: { width: '100%', label: 'Desktop', icon: Monitor },
  tablet: { width: '768px', label: 'Tablet', icon: Tablet },
  mobile: { width: '375px', label: 'Mobile', icon: Smartphone },
} as const

// ─── Reusable glass card wrapper ────────────────────────────────────────────

function GlassCard({ label, icon, children, className = '' }: { label: string; icon: typeof Sparkles; children: React.ReactNode; className?: string }) {
  const Icon = icon
  return (
    <div className={`rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-4 ${className}`}>
      <label className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-white/50">
        <Icon className="h-3.5 w-3.5" /> {label}
      </label>
      {children}
    </div>
  )
}

// ─── Color picker input ─────────────────────────────────────────────────────

function ColorPicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      <Label className="text-xs text-white/40 min-w-[60px]">{label}</Label>
      <div className="relative flex items-center gap-1.5">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-7 w-7 rounded-md border border-white/20 cursor-pointer bg-transparent [&::-webkit-color-swatch-wrapper]:p-0.5 [&::-webkit-color-swatch]:rounded-md"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-7 w-[80px] text-xs border-white/10 bg-white/5 text-white/70 px-2"
        />
      </div>
    </div>
  )
}

// ─── Advanced Options Panel ─────────────────────────────────────────────────

function AdvancedOptionsPanel() {
  const { builderAdvancedOptions, setBuilderAdvancedOptions, builderStyle, setBuilderStyle } = useAppStore()
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [activeTab, setActiveTab] = useState('brand')

  const updateColorScheme = (key: string, value: string) => {
    setBuilderAdvancedOptions({
      colorScheme: { ...builderAdvancedOptions.colorScheme, [key]: value },
    })
  }

  const updatePageConfig = (pageId: string, field: 'enabled' | 'length', value: boolean | BuilderPageLength) => {
    setBuilderAdvancedOptions({
      pageConfigs: builderAdvancedOptions.pageConfigs.map(p =>
        p.id === pageId ? { ...p, [field]: value } : p
      ),
    })
  }

  const updateSectionToggle = (key: string, value: boolean) => {
    setBuilderAdvancedOptions({ [key]: value })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.55 }}
      className="mb-6"
    >
      {/* Toggle button */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="group flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-xl px-4 py-3 text-sm font-medium text-white/50 transition-all hover:bg-white/[0.06] hover:text-white/70 hover:border-white/20"
      >
        <Sliders className="h-4 w-4" />
        <span>Advanced Options</span>
        {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>

      {/* Collapsible content */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="mt-4">
              {/* Tab navigation */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full bg-white/[0.03] border border-white/10 rounded-xl h-auto p-1 mb-4 flex-wrap">
                  <TabsTrigger value="brand" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300 text-white/40 text-xs flex-1 min-w-0">
                    <Paintbrush className="h-3 w-3 mr-1" /> Brand
                  </TabsTrigger>
                  <TabsTrigger value="complexity" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300 text-white/40 text-xs flex-1 min-w-0">
                    <Layers className="h-3 w-3 mr-1" /> Length
                  </TabsTrigger>
                  <TabsTrigger value="visual" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300 text-white/40 text-xs flex-1 min-w-0">
                    <Palette className="h-3 w-3 mr-1" /> Style
                  </TabsTrigger>
                  <TabsTrigger value="sections" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300 text-white/40 text-xs flex-1 min-w-0">
                    <Layout className="h-3 w-3 mr-1" /> Sections
                  </TabsTrigger>
                  <TabsTrigger value="navigation" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300 text-white/40 text-xs flex-1 min-w-0">
                    <Navigation className="h-3 w-3 mr-1" /> UX
                  </TabsTrigger>
                  <TabsTrigger value="seo" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300 text-white/40 text-xs flex-1 min-w-0">
                    <Shield className="h-3 w-3 mr-1" /> SEO
                  </TabsTrigger>
                </TabsList>

                {/* ─── Brand & Identity Tab ─────────────────────────────── */}
                <TabsContent value="brand" className="mt-0">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* Brand Name */}
                    <GlassCard label="Brand Name" icon={Tag}>
                      <Input
                        value={builderAdvancedOptions.brandName}
                        onChange={(e) => setBuilderAdvancedOptions({ brandName: e.target.value })}
                        placeholder="Enter your brand name..."
                        className="border-white/10 bg-white/5 text-white placeholder:text-white/25 h-9"
                      />
                    </GlassCard>

                    {/* Font Family */}
                    <GlassCard label="Font Family" icon={Type}>
                      <Select
                        value={builderAdvancedOptions.fontFamily}
                        onValueChange={(v) => setBuilderAdvancedOptions({ fontFamily: v })}
                      >
                        <SelectTrigger className="border-white/10 bg-white/5 text-white hover:bg-white/10 h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#15151F] border-white/10 max-h-60">
                          {FONT_OPTIONS.map(font => (
                            <SelectItem key={font} value={font} className="text-white focus:bg-purple-500/20 focus:text-white">
                              <span style={{ fontFamily: font }} className="text-sm">{font}</span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </GlassCard>
                  </div>

                  {/* Logo Placement */}
                  <GlassCard label="Logo Placement" icon={AlignLeft} className="mt-4">
                    <div className="flex gap-2">
                      {LOGO_PLACEMENT_OPTIONS.map(opt => {
                        const Icon = opt.icon
                        const isActive = (builderAdvancedOptions as any).logoPlacement === opt.id
                        // Default to 'left' if not set
                        const currentPlacement = (builderAdvancedOptions as any).logoPlacement || 'left'
                        const isSelected = currentPlacement === opt.id
                        return (
                          <button
                            key={opt.id}
                            onClick={() => setBuilderAdvancedOptions({ logoPlacement: opt.id } as any)}
                            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs transition-all ${
                              isSelected
                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                : 'bg-white/5 text-white/40 border border-white/10 hover:bg-white/10 hover:text-white/60'
                            }`}
                          >
                            <Icon className="h-3.5 w-3.5" />
                            {opt.label}
                          </button>
                        )
                      })}
                    </div>
                  </GlassCard>

                  {/* Color Scheme */}
                  <GlassCard label="Color Scheme" icon={Palette} className="mt-4">
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      <ColorPicker label="Primary" value={builderAdvancedOptions.colorScheme.primary} onChange={(v) => updateColorScheme('primary', v)} />
                      <ColorPicker label="Accent" value={builderAdvancedOptions.colorScheme.accent} onChange={(v) => updateColorScheme('accent', v)} />
                      <ColorPicker label="Background" value={builderAdvancedOptions.colorScheme.background} onChange={(v) => updateColorScheme('background', v)} />
                      <ColorPicker label="Surface" value={builderAdvancedOptions.colorScheme.surface} onChange={(v) => updateColorScheme('surface', v)} />
                      <ColorPicker label="Text" value={builderAdvancedOptions.colorScheme.text} onChange={(v) => updateColorScheme('text', v)} />
                      <ColorPicker label="Muted" value={builderAdvancedOptions.colorScheme.muted} onChange={(v) => updateColorScheme('muted', v)} />
                    </div>
                    {/* Color preview bar */}
                    <div className="mt-3 flex gap-1 rounded-lg overflow-hidden h-8">
                      {Object.entries(builderAdvancedOptions.colorScheme).map(([key, color]) => (
                        <TooltipProvider key={key}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div
                                className="flex-1 cursor-pointer transition-all hover:flex-[2]"
                                style={{ backgroundColor: color }}
                              />
                            </TooltipTrigger>
                            <TooltipContent className="bg-[#15151F] border-white/10 text-xs text-white/70">
                              {key}: {color}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                    </div>
                  </GlassCard>
                </TabsContent>

                {/* ─── Complexity & Length Tab ─────────────────────────── */}
                <TabsContent value="complexity" className="mt-0">
                  {/* Complexity */}
                  <GlassCard label="Complexity Level" icon={Layers}>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {COMPLEXITY_OPTIONS.map(opt => {
                        const isSelected = builderAdvancedOptions.complexity === opt.id
                        return (
                          <button
                            key={opt.id}
                            onClick={() => setBuilderAdvancedOptions({ complexity: opt.id })}
                            className={`flex flex-col rounded-lg px-3 py-2.5 text-left transition-all ${
                              isSelected
                                ? 'bg-purple-500/20 border border-purple-500/30'
                                : 'bg-white/5 border border-white/10 hover:bg-white/10'
                            }`}
                          >
                            <span className={`text-sm font-medium ${isSelected ? 'text-purple-300' : 'text-white/60'}`}>
                              {opt.label}
                            </span>
                            <span className={`text-xs mt-0.5 ${isSelected ? 'text-purple-300/60' : 'text-white/30'}`}>
                              {opt.desc}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </GlassCard>

                  {/* Default Page Length */}
                  <GlassCard label="Default Page Length" icon={Grip} className="mt-4">
                    <div className="grid gap-2 sm:grid-cols-2">
                      {PAGE_LENGTH_OPTIONS.map(opt => {
                        const isSelected = builderAdvancedOptions.pageLength === opt.id
                        return (
                          <button
                            key={opt.id}
                            onClick={() => setBuilderAdvancedOptions({ pageLength: opt.id })}
                            className={`flex flex-col rounded-lg px-3 py-2.5 text-left transition-all ${
                              isSelected
                                ? 'bg-purple-500/20 border border-purple-500/30'
                                : 'bg-white/5 border border-white/10 hover:bg-white/10'
                            }`}
                          >
                            <span className={`text-sm font-medium ${isSelected ? 'text-purple-300' : 'text-white/60'}`}>
                              {opt.label}
                            </span>
                            <span className={`text-xs mt-0.5 ${isSelected ? 'text-purple-300/60' : 'text-white/30'}`}>
                              {opt.desc}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </GlassCard>

                  {/* Layout Density */}
                  <GlassCard label="Layout Density" icon={Columns} className="mt-4">
                    <div className="grid gap-2 sm:grid-cols-2">
                      {LAYOUT_DENSITY_OPTIONS.map(opt => {
                        const isSelected = builderAdvancedOptions.layoutDensity === opt.id
                        return (
                          <button
                            key={opt.id}
                            onClick={() => setBuilderAdvancedOptions({ layoutDensity: opt.id })}
                            className={`flex flex-col rounded-lg px-3 py-2.5 text-left transition-all ${
                              isSelected
                                ? 'bg-purple-500/20 border border-purple-500/30'
                                : 'bg-white/5 border border-white/10 hover:bg-white/10'
                            }`}
                          >
                            <span className={`text-sm font-medium ${isSelected ? 'text-purple-300' : 'text-white/60'}`}>
                              {opt.label}
                            </span>
                            <span className={`text-xs mt-0.5 ${isSelected ? 'text-purple-300/60' : 'text-white/30'}`}>
                              {opt.desc}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </GlassCard>

                  {/* Page Configuration Table */}
                  <GlassCard label="Page Configuration" icon={Layout} className="mt-4">
                    <div className="space-y-2">
                      {PAGE_CONFIG_ITEMS.map(pageItem => {
                        const config = builderAdvancedOptions.pageConfigs.find(p => p.id === pageItem.id)
                        if (!config) return null
                        const Icon = pageItem.icon
                        return (
                          <div key={pageItem.id} className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2">
                            <Icon className="h-4 w-4 text-white/30" />
                            <span className="text-sm text-white/60 min-w-[80px]">{config.name}</span>
                            <Switch
                              checked={config.enabled}
                              onCheckedChange={(v) => updatePageConfig(pageItem.id, 'enabled', v)}
                              className="data-[state=checked]:bg-purple-500"
                            />
                            {config.enabled && (
                              <Select
                                value={config.length}
                                onValueChange={(v) => updatePageConfig(pageItem.id, 'length', v as BuilderPageLength)}
                              >
                                <SelectTrigger className="h-7 w-[100px] text-xs border-white/10 bg-white/5 text-white/70">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#15151F] border-white/10">
                                  {PAGE_LENGTH_OPTIONS.map(opt => (
                                    <SelectItem key={opt.id} value={opt.id} className="text-white focus:bg-purple-500/20 focus:text-white text-xs">
                                      {opt.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                            <Badge variant="secondary" className={`ml-auto text-xs border ${config.enabled ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300' : 'border-white/10 bg-white/5 text-white/30'}`}>
                              {config.enabled ? 'On' : 'Off'}
                            </Badge>
                          </div>
                        )
                      })}
                    </div>
                  </GlassCard>
                </TabsContent>

                {/* ─── Visual Style Tab ──────────────────────────────── */}
                <TabsContent value="visual" className="mt-0">
                  {/* Expanded Style Grid (8 options with swatches) */}
                  <GlassCard label="Visual Style" icon={Palette}>
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                      {STYLE_OPTIONS.map(opt => {
                        const Icon = opt.icon
                        const isSelected = builderStyle === opt.id
                        return (
                          <button
                            key={opt.id}
                            onClick={() => setBuilderStyle(opt.id)}
                            className={`group flex flex-col items-center gap-2 rounded-xl px-3 py-3 transition-all ${
                              isSelected
                                ? 'bg-purple-500/20 border border-purple-500/30 shadow-lg shadow-purple-500/10'
                                : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20'
                            }`}
                          >
                            <Icon className={`h-5 w-5 ${isSelected ? 'text-purple-300' : 'text-white/40'}`} />
                            <span className={`text-xs font-medium ${isSelected ? 'text-purple-300' : 'text-white/50'}`}>
                              {opt.label}
                            </span>
                            {/* Color swatches */}
                            <div className="flex gap-1">
                              <div className="h-4 w-4 rounded border border-white/20 transition-transform group-hover:scale-125" style={{ background: opt.swatch.bg }} />
                              <div className="h-4 w-4 rounded border border-white/20 transition-transform group-hover:scale-125" style={{ background: opt.swatch.accent }} />
                              <div className="h-4 w-4 rounded border border-white/20 transition-transform group-hover:scale-125" style={{ background: opt.swatch.text }} />
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </GlassCard>

                  {/* Content Tone */}
                  <GlassCard label="Content Tone" icon={MessageSquare} className="mt-4">
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {CONTENT_TONE_OPTIONS.map(opt => {
                        const isSelected = builderAdvancedOptions.contentTone === opt.id
                        return (
                          <button
                            key={opt.id}
                            onClick={() => setBuilderAdvancedOptions({ contentTone: opt.id })}
                            className={`flex flex-col rounded-lg px-3 py-2 text-left transition-all ${
                              isSelected
                                ? 'bg-purple-500/20 border border-purple-500/30'
                                : 'bg-white/5 border border-white/10 hover:bg-white/10'
                            }`}
                          >
                            <span className={`text-sm font-medium ${isSelected ? 'text-purple-300' : 'text-white/60'}`}>
                              {opt.label}
                            </span>
                            <span className={`text-xs mt-0.5 ${isSelected ? 'text-purple-300/60' : 'text-white/30'}`}>
                              {opt.desc}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </GlassCard>

                  {/* Layout Density (also shown here for convenience) */}
                  <GlassCard label="Layout Density" icon={Columns} className="mt-4">
                    <div className="grid gap-2 sm:grid-cols-2">
                      {LAYOUT_DENSITY_OPTIONS.map(opt => {
                        const isSelected = builderAdvancedOptions.layoutDensity === opt.id
                        return (
                          <button
                            key={opt.id}
                            onClick={() => setBuilderAdvancedOptions({ layoutDensity: opt.id })}
                            className={`flex flex-col rounded-lg px-3 py-2.5 text-left transition-all ${
                              isSelected
                                ? 'bg-purple-500/20 border border-purple-500/30'
                                : 'bg-white/5 border border-white/10 hover:bg-white/10'
                            }`}
                          >
                            <span className={`text-sm font-medium ${isSelected ? 'text-purple-300' : 'text-white/60'}`}>
                              {opt.label}
                            </span>
                            <span className={`text-xs mt-0.5 ${isSelected ? 'text-purple-300/60' : 'text-white/30'}`}>
                              {opt.desc}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </GlassCard>
                </TabsContent>

                {/* ─── Sections & Features Tab ────────────────────────── */}
                <TabsContent value="sections" className="mt-0">
                  <GlassCard label="Sections & Features" icon={Layout}>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {SECTION_TOGGLE_ITEMS.map(item => {
                        const Icon = item.icon
                        const isEnabled = (builderAdvancedOptions as any)[item.key] as boolean
                        return (
                          <div key={item.key} className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2.5">
                            <div className="flex items-center gap-2 min-w-0">
                              <Icon className="h-4 w-4 text-white/30 flex-shrink-0" />
                              <div className="min-w-0">
                                <span className="text-sm text-white/60 truncate block">{item.label}</span>
                                <span className="text-xs text-white/25 truncate block">{item.desc}</span>
                              </div>
                            </div>
                            <Switch
                              checked={isEnabled}
                              onCheckedChange={(v) => updateSectionToggle(item.key, v)}
                              className="data-[state=checked]:bg-purple-500 flex-shrink-0"
                            />
                          </div>
                        )
                      })}
                    </div>
                  </GlassCard>
                </TabsContent>

                {/* ─── Navigation & UX Tab ─────────────────────────────── */}
                <TabsContent value="navigation" className="mt-0">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* Navigation Style */}
                    <GlassCard label="Navigation Style" icon={Navigation}>
                      <div className="space-y-1.5">
                        {NAVIGATION_STYLE_OPTIONS.map(opt => {
                          const isSelected = builderAdvancedOptions.navigationStyle === opt.id
                          return (
                            <button
                              key={opt.id}
                              onClick={() => setBuilderAdvancedOptions({ navigationStyle: opt.id })}
                              className={`flex items-center gap-2 w-full rounded-lg px-3 py-2 text-left transition-all ${
                                isSelected
                                  ? 'bg-purple-500/20 border border-purple-500/30'
                                  : 'bg-white/5 border border-white/10 hover:bg-white/10'
                              }`}
                            >
                              <span className={`text-sm font-medium ${isSelected ? 'text-purple-300' : 'text-white/60'}`}>
                                {opt.label}
                              </span>
                              <span className={`text-xs ${isSelected ? 'text-purple-300/60' : 'text-white/30'}`}>
                                {opt.desc}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </GlassCard>

                    {/* CTA Style */}
                    <GlassCard label="CTA Style" icon={Megaphone}>
                      <div className="space-y-1.5">
                        {CTA_STYLE_OPTIONS.map(opt => {
                          const isSelected = builderAdvancedOptions.ctaStyle === opt.id
                          return (
                            <button
                              key={opt.id}
                              onClick={() => setBuilderAdvancedOptions({ ctaStyle: opt.id })}
                              className={`flex items-center gap-2 w-full rounded-lg px-3 py-2 text-left transition-all ${
                                isSelected
                                  ? 'bg-purple-500/20 border border-purple-500/30'
                                  : 'bg-white/5 border border-white/10 hover:bg-white/10'
                              }`}
                            >
                              <span className={`text-sm font-medium ${isSelected ? 'text-purple-300' : 'text-white/60'}`}>
                                {opt.label}
                              </span>
                              <span className={`text-xs ${isSelected ? 'text-purple-300/60' : 'text-white/30'}`}>
                                {opt.desc}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </GlassCard>
                  </div>

                  {/* Animation Level */}
                  <GlassCard label="Animation Level" icon={Sparkles} className="mt-4">
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {ANIMATION_LEVEL_OPTIONS.map(opt => {
                        const isSelected = builderAdvancedOptions.animationLevel === opt.id
                        return (
                          <button
                            key={opt.id}
                            onClick={() => setBuilderAdvancedOptions({ animationLevel: opt.id })}
                            className={`flex flex-col rounded-lg px-3 py-2 text-left transition-all ${
                              isSelected
                                ? 'bg-purple-500/20 border border-purple-500/30'
                                : 'bg-white/5 border border-white/10 hover:bg-white/10'
                            }`}
                          >
                            <span className={`text-sm font-medium ${isSelected ? 'text-purple-300' : 'text-white/60'}`}>
                              {opt.label}
                            </span>
                            <span className={`text-xs mt-0.5 ${isSelected ? 'text-purple-300/60' : 'text-white/30'}`}>
                              {opt.desc}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </GlassCard>

                  {/* Responsive Priority */}
                  <GlassCard label="Responsive Priority" icon={Smartphone} className="mt-4">
                    <div className="grid gap-2 sm:grid-cols-3">
                      {RESPONSIVE_PRIORITY_OPTIONS.map(opt => {
                        const isSelected = builderAdvancedOptions.responsivePriority === opt.id
                        return (
                          <button
                            key={opt.id}
                            onClick={() => setBuilderAdvancedOptions({ responsivePriority: opt.id })}
                            className={`flex flex-col rounded-lg px-3 py-2.5 text-left transition-all ${
                              isSelected
                                ? 'bg-purple-500/20 border border-purple-500/30'
                                : 'bg-white/5 border border-white/10 hover:bg-white/10'
                            }`}
                          >
                            <span className={`text-sm font-medium ${isSelected ? 'text-purple-300' : 'text-white/60'}`}>
                              {opt.label}
                            </span>
                            <span className={`text-xs mt-0.5 ${isSelected ? 'text-purple-300/60' : 'text-white/30'}`}>
                              {opt.desc}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </GlassCard>
                </TabsContent>

                {/* ─── SEO & Accessibility Tab ─────────────────────────── */}
                <TabsContent value="seo" className="mt-0">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* SEO Level */}
                    <GlassCard label="SEO Level" icon={Shield}>
                      <div className="space-y-1.5">
                        {SEO_LEVEL_OPTIONS.map(opt => {
                          const isSelected = builderAdvancedOptions.seoLevel === opt.id
                          return (
                            <button
                              key={opt.id}
                              onClick={() => setBuilderAdvancedOptions({ seoLevel: opt.id })}
                              className={`flex items-center gap-2 w-full rounded-lg px-3 py-2 text-left transition-all ${
                                isSelected
                                  ? 'bg-purple-500/20 border border-purple-500/30'
                                  : 'bg-white/5 border border-white/10 hover:bg-white/10'
                              }`}
                            >
                              <span className={`text-sm font-medium ${isSelected ? 'text-purple-300' : 'text-white/60'}`}>
                                {opt.label}
                              </span>
                              <span className={`text-xs ${isSelected ? 'text-purple-300/60' : 'text-white/30'}`}>
                                {opt.desc}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </GlassCard>

                    {/* Accessibility Level */}
                    <GlassCard label="Accessibility Level" icon={Accessibility}>
                      <div className="space-y-1.5">
                        {ACCESSIBILITY_LEVEL_OPTIONS.map(opt => {
                          const isSelected = builderAdvancedOptions.accessibilityLevel === opt.id
                          return (
                            <button
                              key={opt.id}
                              onClick={() => setBuilderAdvancedOptions({ accessibilityLevel: opt.id })}
                              className={`flex items-center gap-2 w-full rounded-lg px-3 py-2 text-left transition-all ${
                                isSelected
                                  ? 'bg-purple-500/20 border border-purple-500/30'
                                : 'bg-white/5 border border-white/10 hover:bg-white/10'
                              }`}
                            >
                              <span className={`text-sm font-medium ${isSelected ? 'text-purple-300' : 'text-white/60'}`}>
                                {opt.label}
                              </span>
                              <span className={`text-xs ${isSelected ? 'text-purple-300/60' : 'text-white/30'}`}>
                                {opt.desc}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </GlassCard>
                  </div>

                  {/* Image Style */}
                  <GlassCard label="Image Style" icon={Image} className="mt-4">
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {IMAGE_STYLE_OPTIONS.map(opt => {
                        const isSelected = builderAdvancedOptions.imageStyle === opt.id
                        return (
                          <button
                            key={opt.id}
                            onClick={() => setBuilderAdvancedOptions({ imageStyle: opt.id })}
                            className={`flex flex-col rounded-lg px-3 py-2 text-left transition-all ${
                              isSelected
                                ? 'bg-purple-500/20 border border-purple-500/30'
                                : 'bg-white/5 border border-white/10 hover:bg-white/10'
                            }`}
                          >
                            <span className={`text-sm font-medium ${isSelected ? 'text-purple-300' : 'text-white/60'}`}>
                              {opt.label}
                            </span>
                            <span className={`text-xs mt-0.5 ${isSelected ? 'text-purple-300/60' : 'text-white/30'}`}>
                              {opt.desc}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </GlassCard>
                </TabsContent>
              </Tabs>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Prompt Phase ───────────────────────────────────────────────────────────

function PromptPhase() {
  const {
    setBuilderPrompt, builderPrompt, startGeneration,
    builderIndustry, setBuilderIndustry,
    builderStyle, setBuilderStyle,
    builderAdvancedOptions,
  } = useAppStore()

  const [cursorVisible, setCursorVisible] = useState(true)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const interval = setInterval(() => setCursorVisible(v => !v), 530)
    return () => clearInterval(interval)
  }, [])

  const handleGenerate = () => {
    if (!builderPrompt.trim()) {
      toast({ title: 'Please enter a prompt', description: 'Describe the website you want to build' })
      return
    }
    startGeneration(builderPrompt)
  }

  const handleSuggestionClick = (text: string, industry: Industry) => {
    setBuilderPrompt(text)
    setBuilderIndustry(industry)
    textareaRef.current?.focus()
  }

  // Determine enabled pages for generation
  const enabledPages = builderAdvancedOptions.pageConfigs
    .filter(p => p.enabled && CORE_PAGE_ORDER.some(cp => cp.id === p.id))

  const totalEnabledPages = builderAdvancedOptions.pageConfigs.filter(p => p.enabled).length

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-y-auto px-4 py-12">
      {/* Background floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 blur-3xl"
          animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-gradient-to-br from-emerald-500/10 to-teal-500/10 blur-3xl"
          animate={{ y: [0, -40, 0], x: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 h-64 w-64 rounded-full bg-gradient-to-br from-orange-500/8 to-amber-500/8 blur-3xl"
          animate={{ y: [0, 20, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-4xl"
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm backdrop-blur-md"
          >
            <Sparkles className="h-4 w-4 text-purple-400" />
            <span className="text-white/60">Powered by AI · Generates {totalEnabledPages} complete pages</span>
          </motion.div>

          <h1 className="mb-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Describe your vision
          </h1>
          <p className="text-lg text-white/40">
            Tell us what you want — the AI will craft a complete multi-page website with your specifications
          </p>
        </div>

        {/* Controls row: industry + style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-5 grid gap-4 sm:grid-cols-2"
        >
          {/* Industry selector */}
          <GlassCard label="Industry" icon={Briefcase}>
            <Select value={builderIndustry} onValueChange={(v) => setBuilderIndustry(v as Industry)}>
              <SelectTrigger className="border-white/10 bg-white/5 text-white hover:bg-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#15151F] border-white/10 max-h-80">
                {INDUSTRY_OPTIONS.map(opt => {
                  const Icon = opt.icon
                  return (
                    <SelectItem key={opt.id} value={opt.id} className="text-white focus:bg-purple-500/20 focus:text-white">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-purple-400" />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{opt.label}</span>
                          <span className="text-xs text-white/40">{opt.hint}</span>
                        </div>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </GlassCard>

          {/* Style selector */}
          <GlassCard label="Visual Style" icon={Palette}>
            <Select value={builderStyle} onValueChange={(v) => setBuilderStyle(v as BuilderStyle)}>
              <SelectTrigger className="border-white/10 bg-white/5 text-white hover:bg-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#15151F] border-white/10 max-h-80">
                {STYLE_OPTIONS.map(opt => {
                  const Icon = opt.icon
                  return (
                    <SelectItem key={opt.id} value={opt.id} className="text-white focus:bg-purple-500/20 focus:text-white">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-purple-400" />
                        <span className="text-sm font-medium">{opt.label}</span>
                        <div className="ml-2 flex gap-1">
                          <div className="h-4 w-4 rounded border border-white/20" style={{ background: opt.swatch.bg }} />
                          <div className="h-4 w-4 rounded border border-white/20" style={{ background: opt.swatch.accent }} />
                          <div className="h-4 w-4 rounded border border-white/20" style={{ background: opt.swatch.text }} />
                        </div>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </GlassCard>
        </motion.div>

        {/* Prompt input area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative mb-6"
        >
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-2xl shadow-black/20">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/5 to-transparent" />
            <Textarea
              ref={textareaRef}
              value={builderPrompt}
              onChange={(e) => setBuilderPrompt(e.target.value)}
              placeholder="Be specific — describe your business, name, target audience, vibe, and any must-have sections. e.g. 'A cozy specialty coffee shop called Ember & Roast in Portland — focus on single-origin beans and a warm rustic vibe'"
              className="relative min-h-[160px] resize-none border-0 bg-transparent p-6 text-base text-white placeholder:text-white/30 focus-visible:ring-0 focus-visible:ring-offset-0 [&::-webkit-scrollbar]:hidden"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault()
                  handleGenerate()
                }
              }}
            />
            {builderPrompt.length === 0 && cursorVisible && (
              <div className="absolute left-6 top-[88px] h-5 w-0.5 animate-pulse bg-purple-400" />
            )}
            {/* Footer of textarea */}
            <div className="flex items-center justify-between border-t border-white/5 bg-black/20 px-6 py-2.5">
              <span className="text-xs text-white/30">
                {builderPrompt.length} chars · ⌘+Enter to generate
              </span>
              <span className="text-xs text-white/40">
                {enabledPages.length} core pages · {totalEnabledPages} total enabled · ~4-6 min
              </span>
            </div>
          </div>
        </motion.div>

        {/* Advanced Options Panel */}
        <AdvancedOptionsPanel />

        {/* Generate button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-10 flex justify-center"
        >
          <Button
            onClick={handleGenerate}
            disabled={!builderPrompt.trim()}
            className="group relative h-14 overflow-hidden rounded-xl border-0 px-10 text-base font-semibold text-white shadow-lg shadow-purple-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/30 hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0"
            style={{ background: 'linear-gradient(135deg, #6c5ce7, #a855f7, #ec4899)' }}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ backgroundSize: '200% 100%', animation: 'shimmer 2s linear infinite' }} />
            <Wand2 className="mr-2 h-5 w-5" />
            Generate Website
            <ChevronRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </motion.div>

        {/* Suggestion cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="mb-4 text-center text-sm text-white/30">Or try a fully-fleshed example</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PROMPT_SUGGESTIONS.map((suggestion, i) => (
              <motion.div
                key={suggestion.text}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.06 }}
              >
                <Card
                  className="cursor-pointer border-white/8 bg-white/[0.02] backdrop-blur-md transition-all duration-300 hover:border-purple-500/30 hover:bg-white/[0.05] hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/10"
                  onClick={() => handleSuggestionClick(suggestion.text, suggestion.industry)}
                >
                  <CardContent className="flex h-full flex-col gap-2 p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{suggestion.icon}</span>
                      <Badge variant="secondary" className="ml-auto border-white/10 bg-white/5 text-xs text-white/40">
                        {INDUSTRY_OPTIONS.find(o => o.id === suggestion.industry)?.label.split(' ')[0]}
                      </Badge>
                    </div>
                    <span className="text-sm leading-relaxed text-white/70 line-clamp-3">{suggestion.text}</span>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

// ─── Generating Phase (real API calls, real progress) ─────────────────────

interface PageGenState {
  id: string
  name: string
  status: 'pending' | 'generating' | 'done' | 'error'
  error?: string
  html?: string
  css?: string
  js?: string
  siteName?: string
}

function GeneratingPhase() {
  const {
    builderPrompt, builderIndustry, builderStyle,
    builderAdvancedOptions,
    setGeneratedPages, setGeneratedSiteName,
    setCurrentPreviewPage, setIsGenerating, setBuilderPhase,
    setGenerationProgress, setGenerationStatus,
    generationStatus,
  } = useAppStore()

  // Determine which core pages to generate based on pageConfigs
  const pagesToGenerate = CORE_PAGE_ORDER.filter(cp =>
    builderAdvancedOptions.pageConfigs.find(pc => pc.id === cp.id && pc.enabled)
  )

  const [pageStates, setPageStates] = useState<PageGenState[]>(
    pagesToGenerate.map(p => ({ id: p.id, name: p.name, status: 'pending' }))
  )
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [globalError, setGlobalError] = useState<string | null>(null)
  const cancelRef = useRef(false)

  // Tick elapsed timer
  useEffect(() => {
    const interval = setInterval(() => {
      if (!cancelRef.current) setElapsedSeconds(s => s + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Run page generations SEQUENTIALLY
  useEffect(() => {
    cancelRef.current = false
    let cancelled = false

    async function generateAll() {
      const collected: { id: string; name: string; route: string; html: string; css: string; js?: string }[] = []
      let siteName = ''

      for (let i = 0; i < pagesToGenerate.length; i++) {
        if (cancelled || cancelRef.current) return
        const pageInfo = pagesToGenerate[i]

        setPageStates(prev => prev.map(p => p.id === pageInfo.id ? { ...p, status: 'generating' } : p))
        setGenerationStatus(`Generating ${pageInfo.name} page…`)
        setGenerationProgress(Math.round((i / pagesToGenerate.length) * 100))

        try {
          // Build request body with advanced options
          const requestBody = {
            prompt: builderPrompt,
            industry: builderIndustry,
            style: builderStyle,
            page: pageInfo.id,
            siteName: builderAdvancedOptions.brandName || undefined,
            // Advanced options for the server to use in prompt construction
            advancedOptions: {
              complexity: builderAdvancedOptions.complexity,
              pageLength: builderAdvancedOptions.pageConfigs.find(p => p.id === pageInfo.id)?.length || builderAdvancedOptions.pageLength,
              layoutDensity: builderAdvancedOptions.layoutDensity,
              animationLevel: builderAdvancedOptions.animationLevel,
              responsivePriority: builderAdvancedOptions.responsivePriority,
              contentTone: builderAdvancedOptions.contentTone,
              navigationStyle: builderAdvancedOptions.navigationStyle,
              seoLevel: builderAdvancedOptions.seoLevel,
              accessibilityLevel: builderAdvancedOptions.accessibilityLevel,
              imageStyle: builderAdvancedOptions.imageStyle,
              ctaStyle: builderAdvancedOptions.ctaStyle,
              fontFamily: builderAdvancedOptions.fontFamily,
              colorScheme: builderAdvancedOptions.colorScheme,
              logoPlacement: (builderAdvancedOptions as any).logoPlacement || 'left',
              // Section toggles
              includeHero: builderAdvancedOptions.includeHero,
              includeFeatures: builderAdvancedOptions.includeFeatures,
              includeTestimonials: builderAdvancedOptions.includeTestimonials,
              includePricing: builderAdvancedOptions.includePricing,
              includeFAQ: builderAdvancedOptions.includeFAQ,
              includeNewsletter: builderAdvancedOptions.includeNewsletter,
              includeCTA: builderAdvancedOptions.includeCTA,
              includeFooter: builderAdvancedOptions.includeFooter,
              includeAnimations: builderAdvancedOptions.includeAnimations,
              includeSocialLinks: builderAdvancedOptions.includeSocialLinks,
              includeContactForm: builderAdvancedOptions.includeContactForm,
              // All page configs for context
              pageConfigs: builderAdvancedOptions.pageConfigs,
            },
          }

          const startRes = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
          })

          if (cancelled || cancelRef.current) return

          if (!startRes.ok) {
            const errBody = await startRes.json().catch(() => ({ error: `HTTP ${startRes.status}` }))
            throw new Error(errBody.error || `HTTP ${startRes.status}`)
          }

          const startData = await startRes.json()
          const jobId = startData?.jobId
          if (!jobId) {
            throw new Error('Server did not return a jobId')
          }

          // Poll until done/error
          let data: any = null
          let streamError: string | null = null
          const POLL_INTERVAL_MS = 2500
          const MAX_POLL_DURATION_MS = 8 * 60 * 1000
          const pollStart = Date.now()

          while (true) {
            if (cancelled || cancelRef.current) return

            const elapsed = Date.now() - pollStart
            if (elapsed > MAX_POLL_DURATION_MS) {
              throw new Error(`Timed out after ${Math.round(elapsed / 1000)}s waiting for ${pageInfo.name} page`)
            }

            if (elapsed > 0) {
              await new Promise<void>(r => setTimeout(r, POLL_INTERVAL_MS))
              if (cancelled || cancelRef.current) return
            }

            const statusRes = await fetch(`/api/generate?jobId=${encodeURIComponent(jobId)}`, {
              method: 'GET',
              headers: { 'Cache-Control': 'no-cache' },
            })

            if (!statusRes.ok) {
              if (statusRes.status === 404) {
                throw new Error('Generation job disappeared — please retry')
              }
              const errBody = await statusRes.json().catch(() => ({ error: `HTTP ${statusRes.status}` }))
              throw new Error(errBody.error || `Status poll HTTP ${statusRes.status}`)
            }

            const status = await statusRes.json()
            if (cancelled || cancelRef.current) return

            if (status.heartbeats !== undefined) {
              setGenerationStatus(
                `Generating ${pageInfo.name} page… (${status.heartbeats} AI ticks, ${Math.round((Date.now() - pollStart) / 1000)}s)`
              )
            }

            if (status.status === 'done') {
              data = status
              break
            }
            if (status.status === 'error') {
              streamError = status.error || 'Generation failed'
              break
            }
          }

          if (cancelled || cancelRef.current) return

          if (streamError) {
            throw new Error(streamError)
          }
          if (!data?.result?.page?.html) {
            throw new Error('AI returned no HTML')
          }

          if (data.result.siteName && !siteName) siteName = data.result.siteName

          const completed: PageGenState = {
            id: pageInfo.id,
            name: data.result.page.name || pageInfo.name,
            status: 'done',
            html: data.result.page.html,
            css: data.result.page.css || '',
            js: data.result.page.js || '',
          }

          collected.push({
            id: `page-${pageInfo.id}`,
            name: completed.name,
            route: pageInfo.id === 'home' ? '/' : `/${pageInfo.id}`,
            html: completed.html || '',
            css: completed.css || '',
            js: completed.js,
          })

          setPageStates(prev => prev.map(p => p.id === pageInfo.id ? completed : p))
          setGenerationProgress(Math.round(((i + 1) / pagesToGenerate.length) * 100))
        } catch (err: any) {
          if (cancelled || cancelRef.current) return
          const msg = err?.message || 'Generation failed'
          setPageStates(prev => prev.map(p => p.id === pageInfo.id ? { ...p, status: 'error', error: msg } : p))
          setGlobalError(msg)
          return
        }
      }

      if (cancelled || cancelRef.current) return

      setGeneratedPages(collected)
      setGeneratedSiteName(siteName || builderAdvancedOptions.brandName || 'Untitled Site')
      setCurrentPreviewPage(collected[0].id)
      setGenerationProgress(100)
      setGenerationStatus('Done!')
      setIsGenerating(false)
      setBuilderPhase('preview')
    }

    generateAll()

    return () => {
      cancelled = true
      cancelRef.current = true
    }
  }, [])

  const handleCancel = () => {
    cancelRef.current = true
    setIsGenerating(false)
    setGenerationProgress(0)
    setGenerationStatus('')
    setBuilderPhase('prompt')
  }

  const handleRetry = () => {
    setIsGenerating(false)
    setGenerationProgress(0)
    setGenerationStatus('')
    setBuilderPhase('prompt')
  }

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`
  const doneCount = pageStates.filter(p => p.status === 'done').length
  const hasError = pageStates.some(p => p.status === 'error')

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute left-1/4 top-1/4 h-60 w-60 rounded-full bg-purple-500/20 blur-[100px]"
          animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute right-1/4 bottom-1/4 h-60 w-60 rounded-full bg-pink-500/20 blur-[100px]"
          animate={{ scale: [1.5, 1, 1.5], opacity: [0.3, 0.2, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute left-1/2 top-1/2 h-40 w-40 rounded-full bg-emerald-500/15 blur-[80px]"
          animate={{ scale: [1, 1.3, 1], x: [0, 40, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-2xl"
      >
        {/* Central animation */}
        <div className="mb-8 flex justify-center">
          <motion.div
            className="relative h-24 w-24"
            animate={{ rotate: hasError ? 0 : 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          >
            <div className="absolute inset-0 rounded-full border-2 border-purple-500/30" />
            <div className="absolute inset-2 rounded-full border-2 border-pink-500/20" style={{ animationDirection: 'reverse' }} />
            <div className="absolute inset-4 rounded-full border-2 border-emerald-500/20" />
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ rotate: hasError ? 0 : -360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            >
              {hasError ? <AlertCircle className="h-8 w-8 text-red-400" /> : <Sparkles className="h-8 w-8 text-purple-400" />}
            </motion.div>
          </motion.div>
        </div>

        {/* Title */}
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-2xl font-bold text-white">
            {hasError ? 'Generation hit an error' : 'Generating your website'}
          </h2>
          <p className="text-sm text-white/40">
            {hasError
              ? 'One of the pages failed. You can retry from the prompt, or cancel.'
              : `AI is crafting ${pagesToGenerate.length} complete pages sequentially — this takes ~4-6 minutes total`
            }
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <Progress
            value={hasError ? 100 : (doneCount / pagesToGenerate.length) * 100}
            className={`h-2 bg-white/10 [&>[data-slot=progress-indicator]]:bg-gradient-to-r [&>[data-slot=progress-indicator]]:from-purple-500 [&>[data-slot=progress-indicator]]:via-pink-500 [&>[data-slot=progress-indicator]]:to-emerald-500 ${hasError ? '[&>[data-slot=progress-indicator]]:from-red-500 [&>[data-slot=progress-indicator]]:via-red-500 [&>[data-slot=progress-indicator]]:to-red-500' : ''}`}
          />
          <div className="mt-2 flex justify-between text-xs text-white/40">
            <span>{doneCount}/{pagesToGenerate.length} pages done</span>
            <span>{formatTime(elapsedSeconds)} elapsed</span>
          </div>
        </div>

        {/* Per-page status list */}
        <div className="mb-8 space-y-3">
          {pageStates.map((page, i) => {
            const isPending = page.status === 'pending'
            const isGenerating = page.status === 'generating'
            const isDone = page.status === 'done'
            const isError = page.status === 'error'
            const Icon = pagesToGenerate[i].icon

            return (
              <motion.div
                key={page.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`flex items-center gap-3 rounded-lg border p-3 transition-all duration-500 ${
                  isError
                    ? 'border-red-500/30 bg-red-500/10'
                    : isDone
                    ? 'border-emerald-500/20 bg-emerald-500/5'
                    : isGenerating
                    ? 'border-purple-500/30 bg-purple-500/10'
                    : 'border-white/5 bg-white/[0.02]'
                }`}
              >
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                  isError ? 'bg-red-500/20 text-red-400'
                  : isDone ? 'bg-emerald-500/20 text-emerald-400'
                  : isGenerating ? 'bg-purple-500/20 text-purple-400'
                  : 'bg-white/5 text-white/20'
                }`}>
                  {isDone ? (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}>
                      <CheckCircle2 className="h-4 w-4" />
                    </motion.div>
                  ) : isGenerating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isError ? (
                    <AlertCircle className="h-4 w-4" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1">
                  <span className={`text-sm font-medium ${
                    isError ? 'text-red-300'
                    : isDone ? 'text-emerald-300'
                    : isGenerating ? 'text-white'
                    : 'text-white/30'
                  }`}>
                    {page.name} page
                  </span>
                  {isError && page.error && (
                    <p className="text-xs text-red-400/70 mt-0.5 line-clamp-1">{page.error}</p>
                  )}
                  {isGenerating && (
                    <p className="text-xs text-purple-300/70 mt-0.5">AI is writing HTML, CSS, and content…</p>
                  )}
                  {isDone && (
                    <p className="text-xs text-emerald-400/70 mt-0.5">
                      {page.html ? `${(page.html.length / 1024).toFixed(1)} KB generated` : 'Ready'}
                    </p>
                  )}
                </div>
                {isDone && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-emerald-400">✓</motion.span>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Action buttons */}
        <div className="flex justify-center gap-3">
          {hasError ? (
            <Button onClick={handleRetry} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
              <RefreshCw className="mr-2 h-4 w-4" /> Back to prompt
            </Button>
          ) : null}
          <Button
            variant="ghost"
            onClick={handleCancel}
            className="text-white/30 hover:text-white/60 hover:bg-white/5"
          >
            <X className="mr-2 h-4 w-4" />
            Cancel Generation
          </Button>
        </div>

        {/* Live status line */}
        {!hasError && (
          <p className="mt-6 text-center text-xs text-white/30">
            {generationStatus || 'Initializing…'}
          </p>
        )}
      </motion.div>
    </div>
  )
}

// ─── Preview Phase ──────────────────────────────────────────────────────────

function LockIcon() {
  return (
    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}
const Lock = LockIcon

function PreviewPhase() {
  const {
    generatedPages, generatedSiteName,
    currentPreviewPage, setCurrentPreviewPage,
    setBuilderPhase, builderPrompt,
    navigate, addProject,
    builderIndustry, builderStyle,
    builderAdvancedOptions,
  } = useAppStore()

  const [deviceSize, setDeviceSize] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const currentPage = generatedPages.find(p => p.id === currentPreviewPage) || generatedPages[0]
  const siteName = generatedSiteName || 'Untitled Site'

  // Update iframe content when page changes
  useEffect(() => {
    if (iframeRef.current && currentPage) {
      iframeRef.current.srcdoc = currentPage.html
    }
  }, [currentPreviewPage, currentPage])

  const handleSaveProject = () => {
    const project = {
      id: `proj-${Date.now()}`,
      name: siteName,
      description: builderPrompt,
      prompt: builderPrompt,
      thumbnail: '',
      status: 'draft',
      framework: 'html',
      theme: `${builderIndustry}-${builderStyle}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    addProject(project)
    toast({ title: 'Project saved!', description: `${siteName} has been saved to your dashboard` })
  }

  const handleExport = () => {
    if (!currentPage) return
    const blob = new Blob([currentPage.html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = window.document.createElement('a')
    a.href = url
    a.download = `${siteName.toLowerCase().replace(/\s+/g, '-')}-${currentPage.route.replace('/', '') || 'home'}.html`
    window.document.body.appendChild(a)
    a.click()
    window.document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast({ title: 'Exported!', description: `${currentPage.name} page HTML downloaded` })
  }

  const handleExportAll = () => {
    generatedPages.forEach((page, i) => {
      setTimeout(() => {
        const blob = new Blob([page.html], { type: 'text/html' })
        const url = URL.createObjectURL(blob)
        const a = window.document.createElement('a')
        a.href = url
        a.download = `${siteName.toLowerCase().replace(/\s+/g, '-')}-${page.route.replace('/', '') || 'home'}.html`
        window.document.body.appendChild(a)
        a.click()
        window.document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }, i * 300)
    })
    toast({ title: 'Exporting all pages!', description: `${generatedPages.length} HTML files downloading…` })
  }

  const handleRegenerate = () => {
    setBuilderPhase('prompt')
  }

  const handleEdit = () => {
    if (!currentPage) return
    setCurrentPreviewPage(currentPage.id)
    navigate('editor')
  }

  const iframeWidth = DEVICE_SIZES[deviceSize].width

  const industryLabel = builderIndustry.charAt(0).toUpperCase() + builderIndustry.slice(1)
  const styleLabel = builderStyle.charAt(0).toUpperCase() + builderStyle.slice(1)

  // Helper labels for advanced options
  const complexityLabel = COMPLEXITY_OPTIONS.find(o => o.id === builderAdvancedOptions.complexity)?.label || 'Standard'
  const toneLabel = CONTENT_TONE_OPTIONS.find(o => o.id === builderAdvancedOptions.contentTone)?.label || 'Professional'
  const densityLabel = LAYOUT_DENSITY_OPTIONS.find(o => o.id === builderAdvancedOptions.layoutDensity)?.label || 'Comfortable'
  const seoLabel = SEO_LEVEL_OPTIONS.find(o => o.id === builderAdvancedOptions.seoLevel)?.label || 'Standard'
  const accessibilityLabel = ACCESSIBILITY_LEVEL_OPTIONS.find(o => o.id === builderAdvancedOptions.accessibilityLevel)?.label || 'Enhanced'

  // Count enabled sections
  const enabledSectionsCount = SECTION_TOGGLE_ITEMS.filter(item => (builderAdvancedOptions as any)[item.key]).length

  if (!currentPage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f] text-white/60">
        No pages generated yet.
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col bg-[#0a0a0f]">
      {/* Top toolbar */}
      <div className="flex items-center justify-between border-b border-white/8 bg-[#0c0c14] px-4 py-3">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="border-emerald-500/20 bg-emerald-500/10 text-emerald-300">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Ready
          </Badge>
          <span className="text-sm font-semibold text-white/80">{siteName}</span>
          <span className="hidden text-xs text-white/30 sm:inline">· {generatedPages.length} pages · {industryLabel} · {styleLabel}</span>
        </div>

        {/* Device toggle */}
        <div className="flex items-center gap-1 rounded-lg border border-white/8 bg-white/[0.03] p-1">
          {(Object.entries(DEVICE_SIZES) as [keyof typeof DEVICE_SIZES, typeof DEVICE_SIZES[keyof typeof DEVICE_SIZES]][]).map(([key, config]) => {
            const Icon = config.icon
            return (
              <Button
                key={key}
                variant={deviceSize === key ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setDeviceSize(key)}
                className={`h-8 px-2 ${deviceSize === key ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/60'}`}
              >
                <Icon className="h-4 w-4" />
              </Button>
            )
          })}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleRegenerate} className="text-white/30 hover:text-white/60 hover:bg-white/5">
            <RefreshCw className="mr-1 h-4 w-4" />
            <span className="hidden sm:inline">Regenerate</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={handleSaveProject} className="text-white/30 hover:text-white/60 hover:bg-white/5">
            <Save className="mr-1 h-4 w-4" />
            <span className="hidden sm:inline">Save</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={handleExport} className="text-white/30 hover:text-white/60 hover:bg-white/5">
            <Download className="mr-1 h-4 w-4" />
            <span className="hidden sm:inline">Export page</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={handleExportAll} className="text-emerald-400/60 hover:text-emerald-400 hover:bg-emerald-500/5">
            <Rocket className="mr-1 h-4 w-4" />
            <span className="hidden sm:inline">Export all</span>
          </Button>
          <Button size="sm" onClick={handleEdit} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 hover:opacity-90">
            <Code2 className="mr-1 h-4 w-4" />
            Edit in Visual Editor
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Page navigation */}
        <div className="w-64 border-r border-white/8 bg-[#0c0c14] p-4 overflow-y-auto max-h-screen">
          <div className="mb-4">
            <p className="mb-2 text-xs font-medium text-white/30 uppercase tracking-wider">Pages</p>
            <div className="space-y-1">
              {generatedPages.map((page, i) => {
                const pageMeta = CORE_PAGE_ORDER[i]
                const Icon = pageMeta?.icon || Layout
                const isActive = currentPreviewPage === page.id
                return (
                  <motion.button
                    key={page.id}
                    whileHover={{ x: 4 }}
                    onClick={() => setCurrentPreviewPage(page.id)}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-all ${
                      isActive
                        ? 'bg-purple-500/10 text-white border border-purple-500/20'
                        : 'text-white/40 hover:bg-white/5 hover:text-white/60'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <div className="flex-1">
                      <div className="font-medium">{page.name}</div>
                      <div className="text-xs text-white/30">{page.route}</div>
                    </div>
                    {page.html && (
                      <span className="text-xs text-white/20">{(page.html.length / 1024).toFixed(1)}K</span>
                    )}
                  </motion.button>
                )
              })}
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-white/8 bg-white/[0.02] p-3">
            <p className="mb-2 text-xs font-medium text-white/30 uppercase tracking-wider">Site Details</p>
            <div className="space-y-2 text-xs text-white/40">
              <div className="flex justify-between">
                <span>Site name</span>
                <span className="text-white/60 truncate ml-2 max-w-32" title={siteName}>{siteName}</span>
              </div>
              <div className="flex justify-between">
                <span>Industry</span>
                <span className="text-white/60">{industryLabel}</span>
              </div>
              <div className="flex justify-between">
                <span>Style</span>
                <span className="text-white/60">{styleLabel}</span>
              </div>
              <div className="flex justify-between">
                <span>Pages</span>
                <span className="text-white/60">{generatedPages.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Total size</span>
                <span className="text-white/60">
                  {(generatedPages.reduce((sum, p) => sum + (p.html?.length || 0), 0) / 1024).toFixed(1)} KB
                </span>
              </div>
              <div className="flex justify-between">
                <span>Framework</span>
                <span className="text-white/60">HTML/CSS</span>
              </div>
              <Separator className="bg-white/5 my-2" />
              <div className="flex justify-between">
                <span>Complexity</span>
                <span className="text-white/60">{complexityLabel}</span>
              </div>
              <div className="flex justify-between">
                <span>Tone</span>
                <span className="text-white/60">{toneLabel}</span>
              </div>
              <div className="flex justify-between">
                <span>Density</span>
                <span className="text-white/60">{densityLabel}</span>
              </div>
              <div className="flex justify-between">
                <span>SEO</span>
                <span className="text-white/60">{seoLabel}</span>
              </div>
              <div className="flex justify-between">
                <span>Accessibility</span>
                <span className="text-white/60">{accessibilityLabel}</span>
              </div>
              <div className="flex justify-between">
                <span>Sections</span>
                <span className="text-white/60">{enabledSectionsCount}/{SECTION_TOGGLE_ITEMS.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Font</span>
                <span className="text-white/60 truncate ml-2 max-w-32">{builderAdvancedOptions.fontFamily}</span>
              </div>
              <Separator className="bg-white/5 my-2" />
              <div className="flex gap-1.5 mt-1">
                {Object.entries(builderAdvancedOptions.colorScheme).map(([key, color]) => (
                  <TooltipProvider key={key}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="h-5 w-5 rounded border border-white/15 cursor-pointer" style={{ backgroundColor: color }} />
                      </TooltipTrigger>
                      <TooltipContent className="bg-[#15151F] border-white/10 text-xs text-white/70">
                        {key}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-white/8 bg-white/[0.02] p-3">
            <p className="mb-2 text-xs font-medium text-white/30 uppercase tracking-wider">Prompt</p>
            <p className="text-xs text-white/40 leading-relaxed line-clamp-6">{builderPrompt}</p>
          </div>
        </div>

        {/* Preview area */}
        <div className="flex flex-1 items-center justify-center bg-[#0a0a0f] p-4 overflow-auto">
          <motion.div
            layout
            className="relative overflow-hidden rounded-xl border border-white/10 shadow-2xl shadow-black/40"
            style={{ width: iframeWidth, maxWidth: '100%', height: deviceSize === 'mobile' ? '667px' : deviceSize === 'tablet' ? '1024px' : 'calc(100vh - 120px)' }}
          >
            {/* Browser chrome */}
            <div className="flex items-center gap-2 bg-[#1a1a24] px-3 py-2 border-b border-white/5">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
                <div className="h-3 w-3 rounded-full bg-[#28c840]" />
              </div>
              <div className="flex-1 mx-4">
                <div className="flex items-center gap-1 rounded-md bg-white/5 px-3 py-1">
                  <Lock className="h-3 w-3 text-white/20" />
                  <span className="text-xs text-white/30 truncate">
                    {siteName.toLowerCase().replace(/\s+/g, '-')}.app{currentPage.route === '/' ? '' : currentPage.route}
                  </span>
                </div>
              </div>
              <span className="text-xs text-white/30">{currentPage.name}</span>
            </div>

            {/* iframe */}
            <iframe
              ref={iframeRef}
              srcDoc={currentPage.html}
              title="Website Preview"
              className="w-full bg-white border-0"
              style={{ height: deviceSize === 'mobile' ? '641px' : deviceSize === 'tablet' ? '998px' : 'calc(100vh - 160px)' }}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function BuilderPage() {
  const { builderPhase } = useAppStore()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={builderPhase}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen bg-[#0a0a0f]"
      >
        {builderPhase === 'prompt' && <PromptPhase />}
        {builderPhase === 'generating' && <GeneratingPhase />}
        {builderPhase === 'preview' && <PreviewPhase />}
        {builderPhase === 'edit' && (
          <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-purple-400 mx-auto mb-4" />
              <p className="text-white/60">Transitioning to editor...</p>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
