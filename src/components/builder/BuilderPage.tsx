'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore, type BuilderStyle, type BuilderComplexity, type BuilderPageLength, type BuilderLayoutDensity, type BuilderAnimationLevel, type BuilderResponsivePriority, type BuilderContentTone, type BuilderNavigationStyle, type BuilderSEOLevel, type BuilderAccessibilityLevel, type BuilderImageStyle, type BuilderCTAStyle, type BuilderAdvancedOptions } from '@/lib/store'
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
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import IndustryGallery from '@/components/industry/IndustryGallery'
import AnimationShowcase from '@/components/animations/AnimationShowcase'
import {
  Sparkles, Wand2, Monitor, Smartphone, Tablet, Code2, Rocket,
  Download, Eye, ArrowLeft, RefreshCw, Save, X,
  ChevronRight, ChevronDown, ChevronUp, Zap, Layers, Palette, Type, Layout,
  Loader2, CheckCircle2, AlertCircle, Globe, Home, Mail, Server,
  Briefcase, Store, ShoppingBag, Newspaper, Building2, Calendar, User,
  Sun, Moon, Minimize, Flame, Sliders, Paintbrush, Shield, Accessibility,
  Image, Navigation, Megaphone, Clock, DollarSign, HelpCircle,
  MessageSquare, Share2, Phone, Columns, Grip, Tag, AlignLeft, AlignCenter, AlignRight, LayoutGrid,
  FileText, Maximize2, Trash2, Plus, Check, PanelLeft,
} from 'lucide-react'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { useTranslation } from '@/lib/useTranslation'
import { ALL_PALETTES, PALETTE_CATEGORIES, type ThemePalette } from '@/lib/palettes'

// ─── Builder Theme Helper ──────────────────────────────────────────────────
// Classic cubic minimalistic: flat solid colors, no gradients, rounded-md corners
// Selected/accent: deep blue (blue-700), unselected: white (light) / charcoal (dark)

function useBuilderTheme() {
  const themeMode = useAppStore((s) => s.themeMode)
  const isDark = themeMode === 'dark'
  return {
    isDark,
    // Card backgrounds
    cardBg: isDark ? 'bg-zinc-800' : 'bg-white',
    cardBorder: isDark ? 'border-zinc-700' : 'border-zinc-200',
    // Option button unselected
    optBg: isDark ? 'bg-zinc-800' : 'bg-white',
    optBorder: isDark ? 'border-zinc-700' : 'border-zinc-200',
    optText: isDark ? 'text-zinc-300' : 'text-gray-700',
    optDesc: isDark ? 'text-zinc-400' : 'text-gray-400',
    optHoverBg: isDark ? 'hover:bg-zinc-700' : 'hover:bg-zinc-50',
    optHoverText: isDark ? 'hover:text-zinc-100' : 'hover:text-gray-900',
    // Option button selected (always blue-700 regardless of theme)
    selBg: 'bg-blue-700',
    selBorder: 'border-blue-700',
    selText: 'text-white',
    selDesc: 'text-blue-100/70',
    selHoverBg: 'hover:bg-blue-800',
    // Input / select backgrounds
    inputBg: isDark ? 'bg-zinc-700' : 'bg-zinc-50',
    inputBorder: isDark ? 'border-zinc-600' : 'border-zinc-200',
    inputText: isDark ? 'text-zinc-200' : 'text-gray-700',
    inputPlaceholder: isDark ? 'placeholder:text-zinc-400' : 'placeholder:text-gray-400',
    // Page backgrounds
    pageBg: isDark ? 'bg-zinc-900' : 'bg-white',
    pageBgAlt: isDark ? 'bg-zinc-800' : 'bg-slate-50',
    // Text hierarchy
    text: isDark ? 'text-zinc-100' : 'text-gray-900',
    textMuted: isDark ? 'text-zinc-400' : 'text-gray-500',
    textDim: isDark ? 'text-zinc-500' : 'text-gray-400',
    textSub: isDark ? 'text-zinc-600' : 'text-gray-300',
    textBright: isDark ? 'text-zinc-200' : 'text-gray-800',
    // Label
    labelIcon: isDark ? 'text-zinc-500' : 'text-zinc-400',
    labelText: isDark ? 'text-zinc-400' : 'text-gray-500',
    // Hover
    hoverBg: isDark ? 'hover:bg-zinc-700' : 'hover:bg-gray-50',
    hoverText: isDark ? 'hover:text-zinc-100' : 'hover:text-gray-700',
    // Badge
    badgeBg: isDark ? 'bg-zinc-700' : 'bg-zinc-100',
    badgeBorder: isDark ? 'border-zinc-600' : 'border-zinc-200',
    badgeText: isDark ? 'text-zinc-300' : 'text-gray-500',
    // Info highlight (for selected palette info, etc.)
    infoBg: isDark ? 'bg-blue-900/30' : 'bg-blue-50',
    infoBorder: isDark ? 'border-blue-800/40' : 'border-blue-200',
    infoText: isDark ? 'text-blue-400' : 'text-blue-700',
    infoBadgeBg: isDark ? 'bg-blue-900/30' : 'bg-blue-100',
    infoBadgeBorder: isDark ? 'border-blue-800/40' : 'border-blue-200',
    infoBadgeText: isDark ? 'text-blue-400' : 'text-blue-600',
    // Tab active state
    tabActiveBg: isDark ? 'data-[state=active]:bg-blue-700' : 'data-[state=active]:bg-blue-50',
    tabActiveBorder: isDark ? 'data-[state=active]:border-blue-700' : 'data-[state=active]:border-blue-200',
    tabActiveText: isDark ? 'data-[state=active]:text-white' : 'data-[state=active]:text-blue-700',
    // Separators
    separator: isDark ? 'bg-zinc-700' : 'bg-gray-200',
    borderSub: isDark ? 'border-zinc-700' : 'border-zinc-100',
    // Scrollbar
    scrollbarThumb: isDark ? 'bg-zinc-600' : 'bg-gray-200',
    // Status colors (functional, not accent)
    doneBg: isDark ? 'bg-emerald-900/20' : 'bg-emerald-50',
    doneBorder: isDark ? 'border-emerald-800/30' : 'border-emerald-200',
    doneText: isDark ? 'text-emerald-400' : 'text-emerald-700',
    errorBg: isDark ? 'bg-red-900/20' : 'bg-red-50',
    errorBorder: isDark ? 'border-red-800/30' : 'border-red-300',
    errorText: isDark ? 'text-red-400' : 'text-red-700',
    generatingBg: isDark ? 'bg-blue-900/20' : 'bg-blue-50',
    generatingBorder: isDark ? 'border-blue-800/30' : 'border-blue-200',
    generatingText: isDark ? 'text-blue-400' : 'text-blue-600',
    // Dot grid opacity
    dotGridOpacity: isDark ? 'opacity-[0.03]' : 'opacity-[0.04]',
    // Focus colors for SelectItems
    focusBg: isDark ? 'focus:bg-blue-900/30 focus:text-zinc-100' : 'focus:bg-blue-50 focus:text-gray-900',
  }
}

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

// ─── Language options ─────────────────────────────────────────────────────

const LANGUAGE_OPTIONS: { id: string; label: string; font: string; dir: string }[] = [
  { id: 'en', label: 'English', font: 'Inter', dir: 'ltr' },
  { id: 'fa', label: 'فارسی (Persian)', font: 'Vazirmatn', dir: 'rtl' },
  { id: 'ar', label: 'العربية (Arabic)', font: 'Vazirmatn', dir: 'rtl' },
  { id: 'de', label: 'Deutsch (German)', font: 'Inter', dir: 'ltr' },
  { id: 'es', label: 'Español (Spanish)', font: 'Inter', dir: 'ltr' },
  { id: 'fr', label: 'Français (French)', font: 'Inter', dir: 'ltr' },
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

// ─── Ready-made Template Data ───────────────────────────────────────────────────

interface SiteTemplate {
  id: string
  name: string
  category: string
  description: string
  thumbnailGradient: string
  thumbnailOverlay: string
  html: string
}

const TEMPLATE_CATEGORIES = ['All', 'Portfolio', 'SaaS', 'Restaurant', 'E-commerce', 'Blog', 'Agency', 'Event', 'Personal'] as const

const SITE_TEMPLATES: SiteTemplate[] = [
  {
    id: 'stellar-portfolio',
    name: 'Stellar Portfolio',
    category: 'Portfolio',
    description: 'A sleek dark portfolio for creatives with project grids and smooth transitions.',
    thumbnailGradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    thumbnailOverlay: 'rgba(168, 85, 247, 0.15)',
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Stellar Portfolio</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Inter',system-ui,sans-serif;background:#0a0a0f;color:#f8fafc;overflow-x:hidden}.nav{display:flex;justify-content:space-between;align-items:center;padding:1.5rem 3rem;border-bottom:1px solid rgba(255,255,255,0.06)}.nav-logo{font-size:1.25rem;font-weight:700;color:#a855f7}.nav-links{display:flex;gap:2rem}.nav-links a{color:#94a3b8;text-decoration:none;font-size:0.9rem;transition:color 0.3s}.nav-links a:hover{color:#a855f7}.hero{min-height:70vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:4rem 2rem}.hero-badge{background:rgba(168,85,247,0.1);border:1px solid rgba(168,85,247,0.2);padding:0.5rem 1.25rem;border-radius:50px;font-size:0.85rem;color:#c084fc;margin-bottom:1.5rem}.hero h1{font-size:4rem;font-weight:800;line-height:1.1;margin-bottom:1rem;letter-spacing:-0.02em}.hero h1 span{color:#a855f7}.hero p{font-size:1.2rem;color:#94a3b8;max-width:600px;margin-bottom:2rem}.hero-btn{background:#a855f7;color:#fff;padding:0.75rem 2rem;border-radius:12px;font-weight:600;text-decoration:none;transition:transform 0.3s,box-shadow 0.3s}.hero-btn:hover{transform:translateY(-2px);box-shadow:0 8px 30px rgba(168,85,247,0.3)}.projects{padding:4rem 3rem}.projects-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:2rem}.projects-header h2{font-size:2rem;font-weight:700}.projects-header a{color:#a855f7;text-decoration:none;font-size:0.9rem}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1.5rem}.card{border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,0.06);transition:transform 0.3s,border-color 0.3s}.card:hover{transform:translateY(-4px);border-color:rgba(168,85,247,0.3)}.card-img{height:200px;display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:700;color:#c084fc}.card-body{padding:1.25rem}.card-body h3{font-size:1.1rem;font-weight:600;margin-bottom:0.5rem}.card-body p{font-size:0.85rem;color:#64748b;line-height:1.5}.card-tags{display:flex;gap:0.5rem;margin-top:0.75rem}.card-tags span{background:rgba(168,85,247,0.1);color:#c084fc;padding:0.25rem 0.75rem;border-radius:8px;font-size:0.75rem}.footer{padding:3rem;text-align:center;border-top:1px solid rgba(255,255,255,0.06)}.footer p{color:#64748b;font-size:0.85rem}.ci1{background:linear-gradient(135deg,#1e1b4b,#4c1d95)}.ci2{background:linear-gradient(135deg,#0c4a6e,#164e63)}.ci3{background:linear-gradient(135deg,#4a1d1d,#7c2d12)}.ci4{background:linear-gradient(135deg,#14532d,#166534)}.ci5{background:linear-gradient(135deg,#1e3a5f,#2563eb)}.ci6{background:linear-gradient(135deg,#422006,#92400e)}</style></head><body><nav class="nav"><div class="nav-logo">✦ Stellar</div><div class="nav-links"><a href="#">Work</a><a href="#">About</a><a href="#">Contact</a></div></nav><section class="hero"><div class="hero-badge">Available for Projects</div><h1>I craft <span>digital</span><br>experiences</h1><p>Design-driven developer specializing in crafting memorable interfaces and functional experiences.</p><a href="#" class="hero-btn">View My Work →</a></section><section class="projects"><div class="projects-header"><h2>Selected Work</h2><a href="#">See all →</a></div><div class="grid"><div class="card"><div class="card-img ci1">Brand Redesign</div><div class="card-body"><h3>Flux Brand Identity</h3><p>Complete visual identity overhaul for a fintech startup redefining payments.</p><div class="card-tags"><span>Brand</span><span>Design</span></div></div></div><div class="card"><div class="card-img ci2">Dashboard</div><div class="card-body"><h3>Ocean Analytics</h3><p>Data visualization dashboard for marine research organizations worldwide.</p><div class="card-tags"><span>UI/UX</span><span>Data</span></div></div></div><div class="card"><div class="card-img ci3">Mobile App</div><div class="card-body"><h3>Ember Mobile</h3><p>Cross-platform companion app for coffee enthusiasts and specialty roasters.</p><div class="card-tags"><span>Mobile</span><span>App</span></div></div></div><div class="card"><div class="card-img ci4">E-commerce</div><div class="card-body"><h3>Verdant Market</h3><p>Organic marketplace connecting local farmers with conscious consumers.</p><div class="card-tags"><span>Web</span><span>E-com</span></div></div></div><div class="card"><div class="card-img ci5">Platform</div><div class="card-body"><h3>Neural Learning</h3><p>AI-powered adaptive learning platform for technical education.</p><div class="card-tags"><span>SaaS</span><span>AI</span></div></div></div><div class="card"><div class="card-img ci6">Campaign</div><div class="card-body"><h3>Solstice Festival</h3><p>Immersive digital campaign for an annual arts and music celebration.</p><div class="card-tags"><span>Event</span><span>Web</span></div></div></div></div></section><footer class="footer"><p>© 2025 Stellar Portfolio. Crafted with care.</p></footer></body></html>`
  },
  {
    id: 'novapulse-saas',
    name: 'NovaPulse SaaS',
    category: 'SaaS',
    description: 'A modern SaaS landing page with feature highlights, pricing tiers, and clean design.',
    thumbnailGradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
    thumbnailOverlay: 'rgba(56, 189, 248, 0.12)',
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>NovaPulse — AI Analytics</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Inter',system-ui,sans-serif;background:#0f172a;color:#e2e8f0}.nav{display:flex;justify-content:space-between;align-items:center;padding:1.25rem 3rem;position:sticky;top:0;background:rgba(15,23,42,0.9);backdrop-filter:blur(12px);border-bottom:1px solid rgba(255,255,255,0.06)}.nav-logo{font-size:1.2rem;font-weight:800;background:linear-gradient(135deg,#38bdf8,#818cf8);-webkit-background-clip:text;-webkit-text-fill-color:transparent}.nav-links{display:flex;gap:1.5rem;align-items:center}.nav-links a{color:#94a3b8;text-decoration:none;font-size:0.85rem}.nav-btn{background:#38bdf8;color:#0f172a;padding:0.5rem 1.25rem;border-radius:8px;font-weight:600;text-decoration:none;font-size:0.85rem}.hero{min-height:75vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:4rem 2rem;position:relative}.hero::before{content:'';position:absolute;top:-50px;width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,rgba(56,189,248,0.08),transparent 70%);pointer-events:none}.hero-badge{display:flex;gap:0.5rem;align-items:center;background:rgba(56,189,248,0.1);border:1px solid rgba(56,189,248,0.2);padding:0.5rem 1rem;border-radius:50px;font-size:0.8rem;color:#7dd3fc;margin-bottom:2rem}.hero-badge .dot{width:6px;height:6px;border-radius:50%;background:#38bdf8;animation:pulse 2s infinite}@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}.hero h1{font-size:3.5rem;font-weight:800;line-height:1.15;margin-bottom:1rem;letter-spacing:-0.02em}.hero h1 span{background:linear-gradient(135deg,#38bdf8,#818cf8);-webkit-background-clip:text;-webkit-text-fill-color:transparent}.hero p{font-size:1.1rem;color:#64748b;max-width:540px;margin-bottom:2rem;line-height:1.6}.hero-btns{display:flex;gap:1rem}.btn-primary{background:linear-gradient(135deg,#38bdf8,#818cf8);color:#0f172a;padding:0.75rem 2rem;border-radius:12px;font-weight:700;text-decoration:none;transition:transform 0.3s}.btn-primary:hover{transform:translateY(-2px)}.btn-secondary{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:#e2e8f0;padding:0.75rem 2rem;border-radius:12px;font-weight:600;text-decoration:none}.features{padding:4rem 3rem}.features h2{font-size:1.75rem;font-weight:700;text-align:center;margin-bottom:0.5rem}.features .sub{text-align:center;color:#64748b;margin-bottom:2.5rem;font-size:0.95rem}.features-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1.25rem}.feature{padding:1.5rem;border-radius:16px;border:1px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.02);transition:border-color 0.3s}.feature:hover{border-color:rgba(56,189,248,0.3)}.feature-icon{width:40px;height:40px;border-radius:10px;background:rgba(56,189,248,0.1);display:flex;align-items:center;justify-content:center;font-size:1.2rem;margin-bottom:1rem}.feature h3{font-size:1rem;font-weight:600;margin-bottom:0.5rem}.feature p{font-size:0.85rem;color:#64748b;line-height:1.5}.pricing{padding:4rem 3rem;text-align:center}.pricing h2{font-size:2rem;font-weight:700;margin-bottom:0.5rem}.pricing .sub{color:#64748b;margin-bottom:2.5rem}.pricing-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1.5rem;max-width:900px;margin:0 auto}.price-card{padding:2rem;border-radius:16px;border:1px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.02);text-align:left}.price-card.popular{border-color:rgba(56,189,248,0.3);background:rgba(56,189,248,0.05)}.price-card h3{font-size:1rem;font-weight:600;margin-bottom:0.25rem}.price-card .price{font-size:2.5rem;font-weight:800;margin-bottom:0.5rem}.price-card .price span{font-size:0.85rem;color:#64748b;font-weight:400}.price-card ul{list-style:none;padding:0;margin:1rem 0}.price-card li{font-size:0.85rem;color:#94a3b8;padding:0.4rem 0;border-bottom:1px solid rgba(255,255,255,0.04)}.price-btn{display:block;width:100%;padding:0.75rem;border-radius:10px;font-weight:600;text-align:center;text-decoration:none;margin-top:1rem}.price-btn.primary{background:#38bdf8;color:#0f172a}.price-btn.secondary{background:rgba(255,255,255,0.05);color:#e2e8f0;border:1px solid rgba(255,255,255,0.1)}.footer{padding:2.5rem 3rem;border-top:1px solid rgba(255,255,255,0.06);display:flex;justify-content:space-between;align-items:center}.footer p{color:#64748b;font-size:0.8rem}</style></head><body><nav class="nav"><div class="nav-logo">⚡ NovaPulse</div><div class="nav-links"><a href="#">Features</a><a href="#">Pricing</a><a href="#">Docs</a><a href="#" class="nav-btn">Start Free Trial</a></div></nav><section class="hero"><div class="hero-badge"><span class="dot"></span> Now with GPT-5 Integration</div><h1>Analytics that<br><span>move the needle</span></h1><p>AI-powered analytics platform that transforms raw data into actionable insights. 14-day free trial, no credit card required.</p><div class="hero-btns"><a href="#" class="btn-primary">Start Free Trial →</a><a href="#" class="btn-secondary">Watch Demo</a></div></section><section class="features"><h2>Everything you need</h2><p class="sub">Powerful features that give you the edge</p><div class="features-grid"><div class="feature"><div class="feature-icon">📊</div><h3>Real-time Dashboards</h3><p>Live metrics that update as data flows in. No refresh needed.</p></div><div class="feature"><div class="feature-icon">🤖</div><h3>AI Predictions</h3><p>Machine learning models that forecast trends before they happen.</p></div><div class="feature"><div class="feature-icon">🔗</div><h3>500+ Integrations</h3><p>Connect with your entire stack — CRM, marketing, finance, support.</p></div><div class="feature"><div class="feature-icon">🔒</div><h3>Enterprise Security</h3><p>SOC 2 Type II compliant. Your data is safe with us.</p></div><div class="feature"><div class="feature-icon">⚡</div><h3>Instant Reports</h3><p>Generate shareable reports in seconds, not hours.</p></div><div class="feature"><div class="feature-icon">📱</div><h3>Mobile Native</h3><p>Full analytics power on iOS and Android. Anywhere, anytime.</p></div></div></section><section class="pricing"><h2>Simple, transparent pricing</h2><p class="sub">No hidden fees. Cancel anytime.</p><div class="pricing-grid"><div class="price-card"><h3>Starter</h3><div class="price">$29<span>/mo</span></div><ul><li>✓ 5 team members</li><li>✓ 10 dashboards</li><li>✓ Basic AI insights</li><li>✓ Email reports</li></ul><a href="#" class="price-btn secondary">Get Started</a></div><div class="price-card popular"><h3>Pro</h3><div class="price">$79<span>/mo</span></div><ul><li>✓ 25 team members</li><li>✓ Unlimited dashboards</li><li>✓ Advanced AI predictions</li><li>✓ Custom integrations</li></ul><a href="#" class="price-btn primary">Start Free Trial</a></div><div class="price-card"><h3>Enterprise</h3><div class="price">Custom</div><ul><li>✓ Unlimited members</li><li>✓ White-label</li><li>✓ Dedicated support</li><li>✓ Custom SLA</li></ul><a href="#" class="price-btn secondary">Contact Sales</a></div></div></section><footer class="footer"><p>© 2025 NovaPulse Inc.</p><p>Privacy · Terms · Status</p></footer></body></html>`
  },
  {
    id: 'ember-roast',
    name: 'Ember & Roast Café',
    category: 'Restaurant',
    description: 'A warm, rustic café website with menu cards, reservation form, and cozy aesthetics.',
    thumbnailGradient: 'linear-gradient(135deg, #451a03 0%, #78350f 50%, #92400e 100%)',
    thumbnailOverlay: 'rgba(245, 158, 11, 0.15)',
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Ember & Roast — Specialty Coffee</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Georgia','Times New Roman',serif;background:#1c1410;color:#f5e6d3}.nav{display:flex;justify-content:space-between;align-items:center;padding:1.5rem 3rem;background:rgba(28,20,16,0.95);position:sticky;top:0;border-bottom:1px solid rgba(245,158,11,0.1)}.nav-logo{font-size:1.5rem;font-weight:700;color:#f59e0b}.nav-links{display:flex;gap:2rem}.nav-links a{color:#d4a574;text-decoration:none;font-size:0.9rem;transition:color 0.3s}.nav-links a:hover{color:#f59e0b}.hero{min-height:80vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:4rem 2rem;background:linear-gradient(180deg,rgba(28,20,16,0) 0%,rgba(120,53,15,0.2) 100%)}.hero-ornament{font-size:1.5rem;color:#f59e0b;margin-bottom:1rem;letter-spacing:0.5rem}.hero h1{font-size:4rem;font-weight:400;line-height:1.2;margin-bottom:0.5rem;letter-spacing:0.02em}.hero .subtitle{font-size:1.3rem;color:#d4a574;margin-bottom:0.5rem;font-style:italic}.hero p{font-size:1rem;color:#a0856c;max-width:500px;margin-bottom:2rem;line-height:1.7}.hero-btn{background:#f59e0b;color:#1c1410;padding:0.75rem 2.5rem;border-radius:50px;font-weight:700;text-decoration:none;font-family:'Inter',system-ui,sans-serif;transition:transform 0.3s}.hero-btn:hover{transform:translateY(-2px)}.menu{padding:4rem 3rem}.menu-header{text-align:center;margin-bottom:2.5rem}.menu-header h2{font-size:2rem;font-weight:400;margin-bottom:0.5rem}.menu-header .divider{width:60px;height:2px;background:#f59e0b;margin:0.75rem auto}.menu-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:1.5rem;max-width:900px;margin:0 auto}.menu-item{padding:1.5rem;border-radius:12px;border:1px solid rgba(245,158,11,0.1);background:rgba(245,158,11,0.03);text-align:center;transition:border-color 0.3s}.menu-item:hover{border-color:rgba(245,158,11,0.3)}.menu-item .emoji{font-size:2rem;margin-bottom:0.75rem}.menu-item h3{font-size:1.1rem;font-weight:600;margin-bottom:0.25rem}.menu-item .price{color:#f59e0b;font-size:1.2rem;font-weight:700;margin-bottom:0.5rem}.menu-item p{font-size:0.85rem;color:#a0856c;line-height:1.5}.story{padding:4rem 3rem;display:flex;gap:3rem;align-items:center;max-width:1000px;margin:0 auto}.story-text{flex:1}.story-text h2{font-size:2rem;font-weight:400;margin-bottom:1rem}.story-text p{color:#a0856c;line-height:1.7;font-size:0.95rem;margin-bottom:1rem}.story-img{flex:1;height:300px;border-radius:16px;background:linear-gradient(135deg,#78350f,#451a03);display:flex;align-items:center;justify-content:center;font-size:3rem}.reserve{padding:4rem 3rem;text-align:center;background:rgba(245,158,11,0.03)}.reserve h2{font-size:2rem;font-weight:400;margin-bottom:0.5rem}.reserve .divider{width:60px;height:2px;background:#f59e0b;margin:0.75rem auto}.reserve p{color:#a0856c;margin-bottom:2rem;max-width:400px;margin-left:auto;margin-right:auto}.reserve-btn{background:#f59e0b;color:#1c1410;padding:0.75rem 2.5rem;border-radius:50px;font-weight:700;text-decoration:none;font-family:'Inter',system-ui,sans-serif}.footer{padding:2rem 3rem;border-top:1px solid rgba(245,158,11,0.1);text-align:center}.footer p{color:#a0856c;font-size:0.8rem}</style></head><body><nav class="nav"><div class="nav-logo">☕ Ember & Roast</div><div class="nav-links"><a href="#">Menu</a><a href="#">Our Story</a><a href="#">Visit</a></div></nav><section class="hero"><div class="hero-ornament">✦ ✦ ✦</div><h1>Ember & Roast</h1><div class="subtitle">Specialty Coffee & Pastries</div><p>Single-origin beans, hand-crafted brews, and warm conversation in Portland's cozy corner.</p><a href="#" class="hero-btn">Reserve a Table</a></section><section class="menu"><div class="menu-header"><h2>Our Menu</h2><div class="divider"></div></div><div class="menu-grid"><div class="menu-item"><div class="emoji">☕</div><h3>House Drip</h3><div class="price">$4.50</div><p>Freshly roasted daily, smooth and balanced.</p></div><div class="menu-item"><div class="emoji">🫖</div><h3>Cold Brew</h3><div class="price">$5.50</div><p>18-hour steep, rich and refreshing.</p></div><div class="menu-item"><div class="emoji">🥐</div><h3>Almond Croissant</h3><div class="price">$6.00</div><p>Buttery layers with toasted almond filling.</p></div><div class="menu-item"><div class="emoji">🧁</div><h3>Matcha Latte</h3><div class="price">$6.50</div><p>Ceremonial-grade matcha with oat milk.</p></div></div></section><section class="story"><div class="story-text"><h2>Our Story</h2><p>We started in a tiny garage in 2019, roasting beans we loved and sharing cups with neighbors. Today, Ember & Roast is a community — a place where every cup tells a story.</p><p>Our beans come from small farms in Ethiopia, Colombia, and Guatemala. Every roast is done in-house, every brew made with intention.</p></div><div class="story-img">🫘</div></section><section class="reserve"><h2>Reserve Your Spot</h2><div class="divider"></div><p>Walk-ins welcome, but weekends fill fast. Book ahead to guarantee your table.</p><a href="#" class="reserve-btn">Make a Reservation</a></section><footer class="footer"><p>© 2025 Ember & Roast · 1427 SE Division St, Portland, OR</p></footer></body></html>`
  },
  {
    id: 'luxe-market',
    name: 'Luxe Market Store',
    category: 'E-commerce',
    description: 'An elegant e-commerce storefront with product cards, categories, and a refined shopping experience.',
    thumbnailGradient: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #3d3d3d 100%)',
    thumbnailOverlay: 'rgba(212, 175, 55, 0.12)',
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Luxe Market — Curated Home Goods</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Inter',system-ui,sans-serif;background:#0e0e0e;color:#e8e8e8}.nav{display:flex;justify-content:space-between;align-items:center;padding:1.25rem 3rem;background:rgba(14,14,14,0.95);position:sticky;top:0;border-bottom:1px solid rgba(212,175,55,0.08)}.nav-logo{font-size:1.3rem;font-weight:700;letter-spacing:0.15em;color:#d4af37;text-transform:uppercase}.nav-links{display:flex;gap:1.5rem;align-items:center}.nav-links a{color:#888;text-decoration:none;font-size:0.85rem;transition:color 0.3s}.nav-links a:hover{color:#d4af37}.cart{background:rgba(212,175,55,0.1);border:1px solid rgba(212,175,55,0.2);padding:0.4rem 1rem;border-radius:8px;color:#d4af37;font-size:0.85rem;text-decoration:none}.hero{min-height:60vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:4rem 2rem;background:linear-gradient(180deg,transparent,rgba(212,175,55,0.05))}.hero h1{font-size:3.5rem;font-weight:300;letter-spacing:0.08em;margin-bottom:0.75rem;text-transform:uppercase}.hero h1 span{color:#d4af37;font-weight:700}.hero p{font-size:1rem;color:#888;max-width:500px;margin-bottom:2rem}.categories{padding:2rem 3rem;display:flex;justify-content:center;gap:1rem}.cat-btn{background:rgba(212,175,55,0.05);border:1px solid rgba(212,175,55,0.15);padding:0.5rem 1.5rem;border-radius:50px;color:#888;text-decoration:none;font-size:0.85rem;transition:all 0.3s}.cat-btn:hover,.cat-btn.active{background:rgba(212,175,55,0.15);color:#d4af37;border-color:rgba(212,175,55,0.3)}.products{padding:2rem 3rem}.products-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1.5rem}.product{border-radius:16px;overflow:hidden;border:1px solid rgba(212,175,55,0.08);transition:transform 0.3s,border-color 0.3s;background:rgba(255,255,255,0.02)}.product:hover{transform:translateY(-4px);border-color:rgba(212,175,55,0.2)}.product-img{height:220px;display:flex;align-items:center;justify-content:center;font-size:2.5rem;position:relative}.product-img .tag{position:absolute;top:1rem;left:1rem;background:#d4af37;color:#0e0e0e;padding:0.25rem 0.75rem;border-radius:6px;font-size:0.7rem;font-weight:700}.product-body{padding:1.25rem}.product-body h3{font-size:1rem;font-weight:600;margin-bottom:0.25rem}.product-body .price{color:#d4af37;font-size:1.1rem;font-weight:700;margin-bottom:0.5rem}.product-body p{font-size:0.8rem;color:#888;line-height:1.5}.product-btn{display:block;padding:0.6rem;border:1px solid rgba(212,175,55,0.2);color:#d4af37;border-radius:8px;font-weight:600;text-align:center;text-decoration:none;font-size:0.85rem;margin-top:0.75rem;transition:all 0.3s}.product-btn:hover{background:#d4af37;color:#0e0e0e}.promo{padding:4rem 3rem;text-align:center;background:rgba(212,175,55,0.03);margin:2rem 0}.promo h2{font-size:2rem;font-weight:300;letter-spacing:0.05em;text-transform:uppercase;margin-bottom:1rem}.promo h2 span{color:#d4af37;font-weight:700}.promo p{color:#888;margin-bottom:2rem}.promo-btn{background:#d4af37;color:#0e0e0e;padding:0.75rem 2.5rem;border-radius:50px;font-weight:700;text-decoration:none}.pi1{background:linear-gradient(135deg,#3d2b1f,#5c4033)}.pi2{background:linear-gradient(135deg,#2d4a3e,#3d6b5e)}.pi3{background:linear-gradient(135deg,#4a3d5c,#6b5c8a)}.pi4{background:linear-gradient(135deg,#5c3d2b,#8a5c3d)}.pi5{background:linear-gradient(135deg,#3d3d3d,#5c5c5c)}.pi6{background:linear-gradient(135deg,#2b3d4a,#3d5c6b)}.footer{padding:2.5rem 3rem;border-top:1px solid rgba(212,175,55,0.08);display:flex;justify-content:space-between;align-items:center}.footer p{color:#888;font-size:0.8rem}</style></head><body><nav class="nav"><div class="nav-logo">Luxe Market</div><div class="nav-links"><a href="#">Shop</a><a href="#">Collections</a><a href="#">About</a><a href="#" class="cart">🛒 Cart (0)</a></div></nav><section class="hero"><h1>Curated <span>Luxury</span><br>for Modern Living</h1><p>Handcrafted home goods, artisan ceramics, and sustainable design — delivered to your door.</p></section><div class="categories"><a href="#" class="cat-btn active">All</a><a href="#" class="cat-btn">Ceramics</a><a href="#" class="cat-btn">Textiles</a><a href="#" class="cat-btn">Lighting</a><a href="#" class="cat-btn">Furniture</a></div><section class="products"><div class="products-grid"><div class="product"><div class="product-img pi1"><span class="tag">NEW</span>🏺</div><div class="product-body"><h3>Wabi-Sabi Vase</h3><div class="price">$128</div><p>Hand-thrown stoneware with organic glaze variations.</p><a href="#" class="product-btn">Add to Cart</a></div></div><div class="product"><div class="product-img pi2">🧶</div><div class="product-body"><h3>Alpaca Throw Blanket</h3><div class="price">$195</div><p>Peruvian alpaca wool, naturally dyed in earth tones.</p><a href="#" class="product-btn">Add to Cart</a></div></div><div class="product"><div class="product-img pi3">💡</div><div class="product-body"><h3>Arc Pendant Lamp</h3><div class="price">$340</div><p>Minimalist brass pendant with adjustable cord length.</p><a href="#" class="product-btn">Add to Cart</a></div></div><div class="product"><div class="product-img pi4"><span class="tag">BEST</span>🪑</div><div class="product-body"><h3>Herringbone Chair</h3><div class="price">$580</div><p>Solid oak frame with woven Danish paper cord seat.</p><a href="#" class="product-btn">Add to Cart</a></div></div><div class="product"><div class="product-img pi5">🎨</div><div class="product-body"><h3>Canvas Wall Art Set</h3><div class="price">$220</div><p>Three-piece abstract print on archival-quality canvas.</p><a href="#" class="product-btn">Add to Cart</a></div></div><div class="product"><div class="product-img pi6">🌿</div><div class="product-body"><h3>Terrazzo Planter</h3><div class="price">$68</div><p>Recycled terrazzo composite with drainage tray.</p><a href="#" class="product-btn">Add to Cart</a></div></div></div></section><section class="promo"><h2>Free shipping on <span>orders over $200</span></h2><p>Sustainable packaging. Carbon-neutral delivery. 30-day returns.</p><a href="#" class="promo-btn">Shop Now →</a></section><footer class="footer"><p>© 2025 Luxe Market</p><p>Shipping · Returns · Contact</p></footer></body></html>`
  },
  {
    id: 'studio-arc',
    name: 'Studio Arc Agency',
    category: 'Agency',
    description: 'A bold design agency site showcasing case studies, services, and a creative team.',
    thumbnailGradient: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #e11d48 100%)',
    thumbnailOverlay: 'rgba(225, 29, 72, 0.1)',
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Studio Arc — Brand Strategy & Design</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Inter',system-ui,sans-serif;background:#0a0a0a;color:#fafafa}.nav{display:flex;justify-content:space-between;align-items:center;padding:1.25rem 3rem;border-bottom:1px solid rgba(225,29,72,0.08)}.nav-logo{font-size:1.3rem;font-weight:800;background:linear-gradient(135deg,#e11d48,#f43f5e);-webkit-background-clip:text;-webkit-text-fill-color:transparent}.nav-links{display:flex;gap:1.5rem;align-items:center}.nav-links a{color:#888;text-decoration:none;font-size:0.85rem;transition:color 0.3s}.nav-links a:hover{color:#e11d48}.nav-btn{background:#e11d48;color:#fff;padding:0.5rem 1.5rem;border-radius:8px;font-weight:700;text-decoration:none;font-size:0.85rem}.hero{min-height:80vh;display:flex;align-items:center;padding:4rem 3rem;gap:3rem}.hero-text{flex:1}.hero-text .label{color:#e11d48;font-size:0.85rem;font-weight:600;margin-bottom:0.75rem;letter-spacing:0.1em;text-transform:uppercase}.hero-text h1{font-size:4.5rem;font-weight:900;line-height:1.05;margin-bottom:1rem;letter-spacing:-0.03em}.hero-text p{font-size:1.1rem;color:#888;max-width:500px;line-height:1.6;margin-bottom:2rem}.hero-btns{display:flex;gap:1rem}.hero-visual{flex:1;height:400px;border-radius:20px;background:linear-gradient(135deg,#1a1a1a,#2a2a2a);display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden}.hero-visual::before{content:'';position:absolute;width:300px;height:300px;border-radius:50%;background:radial-gradient(circle,rgba(225,29,72,0.15),transparent 70%)}.hero-visual span{font-size:4rem;font-weight:900;color:rgba(225,29,72,0.3)}.services{padding:4rem 3rem}.services h2{font-size:2rem;font-weight:700;text-align:center;margin-bottom:2.5rem}.services-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:1.25rem}.service{padding:1.5rem;border-radius:16px;border:1px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.02);transition:all 0.3s}.service:hover{border-color:rgba(225,29,72,0.3)}.service .num{color:#e11d48;font-size:0.8rem;font-weight:800;margin-bottom:0.75rem}.service h3{font-size:1rem;font-weight:600;margin-bottom:0.5rem}.service p{font-size:0.85rem;color:#888;line-height:1.5}.work{padding:4rem 3rem}.work h2{font-size:2rem;font-weight:700;margin-bottom:2rem}.work-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1.5rem}.work-card{border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,0.06);transition:transform 0.3s}.work-card:hover{transform:translateY(-4px)}.work-img{height:180px;display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:800}.work-body{padding:1.25rem}.work-body h3{font-size:1rem;font-weight:600;margin-bottom:0.25rem}.work-body .client{color:#e11d48;font-size:0.8rem;font-weight:600}.work-body p{font-size:0.85rem;color:#888;margin-top:0.5rem;line-height:1.5}.team{padding:4rem 3rem;text-align:center}.team h2{font-size:2rem;font-weight:700;margin-bottom:2rem}.team-grid{display:flex;justify-content:center;gap:2rem;flex-wrap:wrap}.team-member{padding:1.5rem;border-radius:16px;border:1px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.02);width:200px}.team-member .avatar{width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,#e11d48,#f43f5e);margin:0 auto 1rem;display:flex;align-items:center;justify-content:center;font-weight:800;color:#fff;font-size:1.2rem}.team-member h3{font-size:0.95rem;font-weight:600;margin-bottom:0.25rem}.team-member .role{color:#e11d48;font-size:0.75rem;font-weight:600}.cta{padding:4rem 3rem;text-align:center;background:rgba(225,29,72,0.05)}.cta h2{font-size:2.5rem;font-weight:900;margin-bottom:1rem}.cta p{color:#888;margin-bottom:2rem}.cta-btn{background:#e11d48;color:#fff;padding:0.75rem 2.5rem;border-radius:12px;font-weight:700;text-decoration:none}.wi1{background:linear-gradient(135deg,#1a1a2e,#4c1d95)}.wi2{background:linear-gradient(135deg,#14532d,#22c55e)}.wi3{background:linear-gradient(135deg,#0c4a6e,#0ea5e9)}.footer{padding:2rem 3rem;border-top:1px solid rgba(255,255,255,0.06);text-align:center;color:#888;font-size:0.8rem}</style></head><body><nav class="nav"><div class="nav-logo">◆ Studio Arc</div><div class="nav-links"><a href="#">Work</a><a href="#">Services</a><a href="#">Team</a><a href="#" class="nav-btn">Start a Project</a></div></nav><section class="hero"><div class="hero-text"><div class="label">Brand Strategy · Visual Design · Digital</div><h1>We shape brands that<br>move culture</h1><p>Studio Arc is a brand strategy and visual design studio in Berlin. We help ambitious companies stand out by design, not noise.</p><div class="hero-btns"><a href="#" class="hero-btns" style="background:#e11d48;color:#fff;padding:0.75rem 2rem;border-radius:12px;font-weight:700;text-decoration:none">View Case Studies</a><a href="#" style="border:1px solid rgba(255,255,255,0.1);color:#fafafa;padding:0.75rem 2rem;border-radius:12px;text-decoration:none">Our Process</a></div></div><div class="hero-visual"><span>ARC</span></div></section><section class="services"><h2>What We Do</h2><div class="services-grid"><div class="service"><div class="num">01</div><h3>Brand Strategy</h3><p>Positioning, narrative, and identity that connects with your audience.</p></div><div class="service"><div class="num">02</div><h3>Visual Identity</h3><p>Logos, typography, color systems, and guidelines that define you.</p></div><div class="service"><div class="num">03</div><h3>Digital Design</h3><p>Web, app, and product UI that converts and delights users.</p></div><div class="service"><div class="num">04</div><h3>Motion & Video</h3><p>Animated content that brings your brand story to life.</p></div></div></section><section class="work"><h2>Selected Case Studies</h2><div class="work-grid"><div class="work-card"><div class="work-img wi1" style="color:#c084fc">Flux Identity</div><div class="work-body"><h3>Flux Financial</h3><div class="client">Brand + Digital</div><p>Complete rebrand for a fintech startup, from logo to app interface.</p></div></div><div class="work-card"><div class="work-img wi2" style="color:#4ade80">Verdant Platform</div><div class="work-body"><h3>Verdant Market</h3><div class="client">Product Design</div><p>E-commerce platform connecting organic farmers with consumers.</p></div></div><div class="work-card"><div class="work-img wi3" style="color:#7dd3fc">Neural Dashboard</div><div class="work-body"><h3>Neural Learning</h3><div class="client">UI/UX Design</div><p>Analytics dashboard for an AI-powered adaptive learning system.</p></div></div></div></section><section class="team"><h2>The Team</h2><div class="team-grid"><div class="team-member"><div class="avatar">A</div><h3>Alex Chen</h3><div class="role">Creative Director</div></div><div class="team-member"><div class="avatar">M</div><h3>Mira Solano</h3><div class="role">Lead Designer</div></div><div class="team-member"><div class="avatar">S</div><h3>Sam Okafor</h3><div class="role">Strategy Lead</div></div><div class="team-member"><div class="avatar">J</div><h3>Jun Watanabe</h3><div class="role">Motion Designer</div></div></div></section><section class="cta"><h2>Let's build something remarkable</h2><p>Ready to transform your brand? We'd love to hear from you.</p><a href="#" class="cta-btn">Get in Touch →</a></section><footer class="footer"><p>© 2025 Studio Arc GmbH · Berlin, Germany</p></footer></body></html>`
  },
  {
    id: 'the-daily',
    name: 'The Daily Editorial',
    category: 'Blog',
    description: 'A clean editorial blog layout with featured articles, categories, and reading experience.',
    thumbnailGradient: 'linear-gradient(135deg, #faf5ee 0%, #f0e6d6 50%, #e8dcc8 100%)',
    thumbnailOverlay: 'rgba(139, 92, 42, 0.08)',
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>The Daily — Stories That Matter</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Georgia','Times New Roman',serif;background:#faf5ee;color:#2c1810}.nav{display:flex;justify-content:space-between;align-items:center;padding:1.5rem 3rem;border-bottom:2px solid #2c1810;background:#faf5ee;position:sticky;top:0}.nav-logo{font-size:2rem;font-weight:700;letter-spacing:-0.02em}.nav-links{display:flex;gap:2rem}.nav-links a{color:#5c4033;text-decoration:none;font-size:0.85rem;font-family:'Inter',system-ui,sans-serif;font-weight:600}.featured{padding:3rem;display:flex;gap:2rem;max-width:1100px;margin:0 auto}.featured-main{flex:2;border-radius:16px;overflow:hidden;background:linear-gradient(135deg,#8b5c3e,#5c4033);height:400px;display:flex;flex-direction:column;justify-content:flex-end;padding:2rem;position:relative}.featured-main .tag{position:absolute;top:1.5rem;left:1.5rem;background:#2c1810;color:#faf5ee;padding:0.4rem 1rem;border-radius:6px;font-size:0.75rem;font-weight:700;font-family:'Inter',system-ui,sans-serif}.featured-main h2{font-size:2rem;font-weight:700;line-height:1.2;margin-bottom:0.5rem;color:#faf5ee}.featured-main p{font-size:0.9rem;color:#d4a574;line-height:1.5}.featured-side{flex:1;display:flex;flex-direction:column;gap:1rem}.featured-card{padding:1.25rem;border-radius:12px;border:1px solid #d4a574;background:#faf5ee;transition:border-color 0.3s}.featured-card:hover{border-color:#8b5c3e}.featured-card .tag{color:#8b5c3e;font-size:0.75rem;font-weight:700;font-family:'Inter',system-ui,sans-serif;margin-bottom:0.5rem}.featured-card h3{font-size:1.1rem;font-weight:700;line-height:1.3;margin-bottom:0.5rem}.featured-card p{font-size:0.85rem;color:#5c4033;line-height:1.5;font-family:'Inter',system-ui,sans-serif}.articles{padding:3rem;max-width:1100px;margin:0 auto}.articles-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;border-bottom:2px solid #2c1810;padding-bottom:0.75rem}.articles-header h2{font-size:1.75rem;font-weight:700}.articles-header a{color:#8b5c3e;text-decoration:none;font-family:'Inter',system-ui,sans-serif;font-size:0.85rem;font-weight:600}.articles-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1.5rem}.article{padding:1.5rem;border-radius:12px;border:1px solid #d4a574;background:#fff;transition:border-color 0.3s}.article:hover{border-color:#8b5c3e}.article .meta{display:flex;justify-content:space-between;margin-bottom:0.75rem;font-family:'Inter',system-ui,sans-serif;font-size:0.75rem}.article .meta .cat{color:#8b5c3e;font-weight:700}.article .meta .date{color:#a0856c}.article h3{font-size:1.1rem;font-weight:700;line-height:1.3;margin-bottom:0.5rem}.article p{font-size:0.85rem;color:#5c4033;line-height:1.5;font-family:'Inter',system-ui,sans-serif}.article .read-more{color:#8b5c3e;font-size:0.8rem;font-weight:600;text-decoration:none;font-family:'Inter',system-ui,sans-serif;margin-top:0.75rem;display:block}.subscribe{padding:3rem;text-align:center;background:#2c1810;color:#faf5ee;margin:2rem 3rem;border-radius:16px}.subscribe h2{font-size:2rem;font-weight:700;margin-bottom:0.5rem}.subscribe p{color:#d4a574;margin-bottom:2rem;font-size:0.95rem}.subscribe-form{display:flex;gap:0.5rem;justify-content:center;max-width:400px;margin:0 auto}.subscribe-form input{padding:0.75rem 1rem;border:1px solid #5c4033;background:rgba(250,245,238,0.1);color:#faf5ee;border-radius:8px;font-size:0.85rem;flex:1}.subscribe-form button{background:#d4af37;color:#2c1810;padding:0.75rem 1.5rem;border-radius:8px;font-weight:700;font-family:'Inter',system-ui,sans-serif;border:none;font-size:0.85rem}.footer{padding:2rem 3rem;border-top:2px solid #2c1810;text-align:center}.footer p{color:#a0856c;font-size:0.8rem;font-family:'Inter',system-ui,sans-serif}</style></head><body><nav class="nav"><div class="nav-logo">The Daily</div><div class="nav-links"><a href="#">Culture</a><a href="#">Tech</a><a href="#">Design</a><a href="#">Opinion</a></div></nav><section class="featured"><div class="featured-main"><div class="tag">FEATURED</div><h2>The Art of Slow Living in a Hyperconnected World</h2><p>How creatives are reclaiming time and intentionality in the age of constant notifications.</p></div><div class="featured-side"><div class="featured-card"><div class="tag">TECH</div><h3>Why AI Won't Replace Good Taste</h3><p>The human edge in design isn't efficiency — it's judgment, empathy, and restraint.</p></div><div class="featured-card"><div class="tag">CULTURE</div><h3>Museum Without Walls</h3><p>Digital archives are making art accessible to everyone, everywhere.</p></div><div class="featured-card"><div class="tag">DESIGN</div><h3>The New Brutalism</h3><p>Bold borders, raw type, and unapologetic layouts are back.</p></div></div></section><section class="articles"><div class="articles-header"><h2>Latest Stories</h2><a href="#">View all →</a></div><div class="articles-grid"><div class="article"><div class="meta"><span class="cat">DESIGN</span><span class="date">Feb 12, 2025</span></div><h3>The Typography of Trust</h3><p>How font choices shape whether users believe your content.</p><a href="#" class="read-more">Read more →</a></div><div class="article"><div class="meta"><span class="cat">TECH</span><span class="date">Feb 10, 2025</span></div><h3>Building for the Next Billion</h3><p>Designing interfaces that work across languages, cultures, and connectivity levels.</p><a href="#" class="read-more">Read more →</a></div><div class="article"><div class="meta"><span class="cat">OPINION</span><span class="date">Feb 8, 2025</span></div><h3>Less Is More, Again</h3><p>The pendulum swings back toward simplicity in digital design.</p><a href="#" class="read-more">Read more →</a></div><div class="article"><div class="meta"><span class="cat">CULTURE</span><span class="date">Feb 5, 2025</span></div><h3>Sound as Interface</h3><p>Audio UX is the next frontier of accessible, ambient design.</p><a href="#" class="read-more">Read more →</a></div></div></section><section class="subscribe"><h2>Stay Curious</h2><p>Weekly dispatches on design, culture, and the stories that shape us.</p><div class="subscribe-form"><input placeholder="your@email.com"/><button>Subscribe</button></div></section><footer class="footer"><p>© 2025 The Daily · Made with words and coffee</p></footer></body></html>`
  },
  {
    id: 'summit-2025',
    name: 'Summit Conference',
    category: 'Event',
    description: 'A bold event page with speaker lineup, schedule, and registration for a tech conference.',
    thumbnailGradient: 'linear-gradient(135deg, #042f2e 0%, #0d4f4e 50%, #14b8a6 100%)',
    thumbnailOverlay: 'rgba(20, 184, 166, 0.1)',
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Summit 2025 — The Future of Design</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Inter',system-ui,sans-serif;background:#042f2e;color:#f0fdfa}.nav{display:flex;justify-content:space-between;align-items:center;padding:1.25rem 3rem;background:rgba(4,47,46,0.95);position:sticky;top:0;border-bottom:1px solid rgba(20,184,166,0.1)}.nav-logo{font-size:1.2rem;font-weight:800;color:#14b8a6}.nav-logo span{color:#5eead4}.nav-links{display:flex;gap:1.5rem;align-items:center}.nav-links a{color:#99f6e4;text-decoration:none;font-size:0.85rem}.nav-btn{background:#14b8a6;color:#042f2e;padding:0.5rem 1.5rem;border-radius:8px;font-weight:700;text-decoration:none}.hero{min-height:70vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:4rem 2rem;position:relative}.hero::before{content:'';position:absolute;width:500px;height:500px;border-radius:50%;background:radial-gradient(circle,rgba(20,184,166,0.1),transparent 70%)}.hero .date-badge{background:rgba(20,184,166,0.15);border:1px solid rgba(20,184,166,0.3);padding:0.5rem 1.5rem;border-radius:50px;color:#5eead4;font-size:0.85rem;font-weight:600;margin-bottom:2rem}.hero h1{font-size:4.5rem;font-weight:900;line-height:1.05;margin-bottom:0.5rem}.hero h1 span{color:#14b8a6}.hero .location{font-size:1rem;color:#99f6e4;margin-bottom:1rem}.hero p{font-size:1.1rem;color:#6b8f8e;max-width:540px;margin-bottom:2rem;line-height:1.6}.hero-btns{display:flex;gap:1rem}.speakers{padding:4rem 3rem}.speakers h2{font-size:2rem;font-weight:700;text-align:center;margin-bottom:2rem}.speakers-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:1.25rem;max-width:900px;margin:0 auto}.speaker{padding:1.5rem;border-radius:16px;border:1px solid rgba(20,184,166,0.1);background:rgba(20,184,166,0.03);text-align:center;transition:border-color 0.3s}.speaker:hover{border-color:rgba(20,184,166,0.3)}.speaker .avatar{width:70px;height:70px;border-radius:50%;background:linear-gradient(135deg,#14b8a6,#5eead4);margin:0 auto 1rem;display:flex;align-items:center;justify-content:center;font-weight:800;color:#042f2e;font-size:1.3rem}.speaker h3{font-size:0.95rem;font-weight:600;margin-bottom:0.25rem}.speaker .title{color:#14b8a6;font-size:0.75rem;font-weight:600}.speaker .company{color:#6b8f8e;font-size:0.8rem}.schedule{padding:4rem 3rem}.schedule h2{font-size:2rem;font-weight:700;text-align:center;margin-bottom:2rem}.schedule-grid{max-width:700px;margin:0 auto;display:flex;flex-direction:column;gap:1rem}.schedule-item{display:flex;align-items:center;gap:1.5rem;padding:1rem;border-radius:12px;border:1px solid rgba(20,184,166,0.08);background:rgba(20,184,166,0.02)}.schedule-item .time{color:#14b8a6;font-weight:700;font-size:0.85rem;min-width:80px}.schedule-item .title{font-weight:600;font-size:0.95rem}.schedule-item .speaker-name{color:#6b8f8e;font-size:0.8rem}.register{padding:4rem 3rem;text-align:center;background:rgba(20,184,166,0.05)}.register h2{font-size:2.5rem;font-weight:900;margin-bottom:0.5rem}.register .price{color:#14b8a6;font-size:1.5rem;font-weight:800;margin-bottom:1rem}.register p{color:#6b8f8e;margin-bottom:2rem}.register-btn{background:#14b8a6;color:#042f2e;padding:0.75rem 3rem;border-radius:12px;font-weight:700;text-decoration:none;font-size:1rem}.footer{padding:2rem 3rem;border-top:1px solid rgba(20,184,166,0.08);text-align:center;color:#6b8f8e;font-size:0.8rem}</style></head><body><nav class="nav"><div class="nav-logo">▲ <span>Summit</span> 2025</div><div class="nav-links"><a href="#">Speakers</a><a href="#">Schedule</a><a href="#" class="nav-btn">Register Now</a></div></nav><section class="hero"><div class="date-badge">September 18–20, 2025 · San Francisco</div><h1>The Future of<br><span>Design</span></h1><div class="location">Moscone Center · 3 days · 50+ sessions</div><p>Join 2,000+ designers, engineers, and founders for three days of talks, workshops, and connections that shape the future.</p><div class="hero-btns"><a href="#" style="background:#14b8a6;color:#042f2e;padding:0.75rem 2rem;border-radius:12px;font-weight:700;text-decoration:none">Register — $499</a><a href="#" style="border:1px solid rgba(20,184,166,0.2);color:#f0fdfa;padding:0.75rem 2rem;border-radius:12px;text-decoration:none">View Schedule</a></div></section><section class="speakers"><h2>Keynote Speakers</h2><div class="speakers-grid"><div class="speaker"><div class="avatar">S</div><h3>Sarah Kim</h3><div class="title">VP of Design</div><div class="company">Figma</div></div><div class="speaker"><div class="avatar">R</div><h3>Raj Patel</h3><div class="title">CTO</div><div class="company">Vercel</div></div><div class="speaker"><div class="avatar">E</div><h3>Elena Voss</h3><div class="title">Creative Director</div><div class="company">Apple</div></div><div class="speaker"><div class="avatar">M</div><h3>Marcus Chen</h3><div class="title">Head of AI</div><div class="company">Google</div></div></div></section><section class="schedule"><h2>Day 1 Highlights</h2><div class="schedule-grid"><div class="schedule-item"><div class="time">9:00 AM</div><div class="title">Opening Keynote: Design at Scale</div><div class="speaker-name">Sarah Kim</div></div><div class="schedule-item"><div class="time">11:00 AM</div><div class="title">AI-Assisted Design Workshop</div><div class="speaker-name">Marcus Chen</div></div><div class="schedule-item"><div class="time">2:00 PM</div><div class="title">From Zero to Production</div><div class="speaker-name">Raj Patel</div></div><div class="schedule-item"><div class="time">4:30 PM</div><div class="title">The Craft of Interface</div><div class="speaker-name">Elena Voss</div></div></div></section><section class="register"><h2>Secure your spot</h2><div class="price">Early Bird — $499</div><p>50% off through March. Group discounts available.</p><a href="#" class="register-btn">Register Now →</a></section><footer class="footer"><p>© 2025 Summit Conference · San Francisco, CA</p></footer></body></html>`
  },
  {
    id: 'dev-profile',
    name: 'Dev Profile',
    category: 'Personal',
    description: 'A modern developer profile/resume site with skills, projects, and contact information.',
    thumbnailGradient: 'linear-gradient(135deg, #0c0c1d 0%, #1a1a3e 50%, #2563eb 100%)',
    thumbnailOverlay: 'rgba(37, 99, 235, 0.1)',
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Kai Nakamura — Senior Product Designer</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Inter',system-ui,sans-serif;background:#0c0c1d;color:#e2e8f0}.nav{display:flex;justify-content:center;gap:2rem;padding:1.25rem;background:rgba(12,12,29,0.95);position:sticky;top:0;border-bottom:1px solid rgba(37,99,235,0.08)}.nav a{color:#64748b;text-decoration:none;font-size:0.85rem;font-weight:600;transition:color 0.3s}.nav a:hover{color:#2563eb}.hero{display:flex;align-items:center;gap:3rem;padding:4rem 3rem;max-width:1000px;margin:0 auto}.hero-avatar{width:120px;height:120px;border-radius:50%;background:linear-gradient(135deg,#2563eb,#3b82f6);display:flex;align-items:center;justify-content:center;font-size:2.5rem;font-weight:800;color:#0c0c1d}.hero-text .name{font-size:2.5rem;font-weight:800;margin-bottom:0.25rem}.hero-text .role{color:#3b82f6;font-size:1rem;font-weight:600;margin-bottom:0.5rem}.hero-text .location{color:#64748b;font-size:0.85rem;margin-bottom:1rem}.hero-text p{color:#94a3b8;line-height:1.6;max-width:600px;font-size:0.95rem}.hero-links{display:flex;gap:0.75rem;margin-top:1rem}.hero-links a{padding:0.5rem 1rem;border-radius:8px;font-size:0.8rem;font-weight:600;text-decoration:none;transition:transform 0.3s}.hero-links a:hover{transform:translateY(-2px)}.hero-links .primary{background:#2563eb;color:#fff}.hero-links .secondary{border:1px solid rgba(37,99,235,0.2);color:#3b82f6}.skills{padding:3rem;max-width:1000px;margin:0 auto}.skills h2{font-size:1.5rem;font-weight:700;margin-bottom:1.5rem;color:#3b82f6}.skills-grid{display:flex;flex-wrap:wrap;gap:0.75rem}.skill{padding:0.5rem 1rem;border-radius:8px;background:rgba(37,99,235,0.08);border:1px solid rgba(37,99,235,0.15);color:#93c5fd;font-size:0.85rem;font-weight:500}.experience{padding:3rem;max-width:1000px;margin:0 auto}.experience h2{font-size:1.5rem;font-weight:700;margin-bottom:1.5rem;color:#3b82f6}.exp-list{display:flex;flex-direction:column;gap:1rem}.exp-item{padding:1.5rem;border-radius:12px;border:1px solid rgba(37,99,235,0.08);background:rgba(37,99,235,0.02)}.exp-item .header{display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem}.exp-item .company{font-weight:700;font-size:1rem}.exp-item .period{color:#64748b;font-size:0.8rem}.exp-item .title{color:#3b82f6;font-size:0.85rem;font-weight:600;margin-bottom:0.5rem}.exp-item p{color:#94a3b8;font-size:0.85rem;line-height:1.5}.projects{padding:3rem;max-width:1000px;margin:0 auto}.projects h2{font-size:1.5rem;font-weight:700;margin-bottom:1.5rem;color:#3b82f6}.projects-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1.25rem}.project{padding:1.25rem;border-radius:12px;border:1px solid rgba(37,99,235,0.08);background:rgba(37,99,235,0.02);transition:border-color 0.3s}.project:hover{border-color:rgba(37,99,235,0.2)}.project h3{font-size:1rem;font-weight:600;margin-bottom:0.25rem}.project .tech{color:#3b82f6;font-size:0.75rem;font-weight:600;margin-bottom:0.5rem}.project p{color:#94a3b8;font-size:0.85rem;line-height:1.5}.project a{color:#3b82f6;font-size:0.8rem;text-decoration:none;font-weight:600;margin-top:0.75rem;display:block}.contact{padding:3rem;text-align:center;background:rgba(37,99,235,0.03)}.contact h2{font-size:2rem;font-weight:700;margin-bottom:0.5rem}.contact p{color:#94a3b8;margin-bottom:2rem}.contact-btn{background:#2563eb;color:#fff;padding:0.75rem 2.5rem;border-radius:12px;font-weight:700;text-decoration:none}.footer{padding:2rem 3rem;border-top:1px solid rgba(37,99,235,0.08);text-align:center;color:#64748b;font-size:0.8rem}</style></head><body><nav class="nav"><a href="#">About</a><a href="#">Experience</a><a href="#">Projects</a><a href="#">Contact</a></nav><section class="hero"><div class="hero-avatar">KN</div><div class="hero-text"><div class="name">Kai Nakamura</div><div class="role">Senior Product Designer</div><div class="location">📍 San Francisco · Available for contract work</div><p>I design products that people love to use. 8 years of experience bridging user needs, business goals, and technical constraints into cohesive experiences.</p><div class="hero-links"><a href="#" class="primary">Download Resume</a><a href="#" class="secondary">LinkedIn</a></div></div></section><section class="skills"><h2>Skills & Expertise</h2><div class="skills-grid"><span class="skill">Product Design</span><span class="skill">UX Research</span><span class="skill">Prototyping</span><span class="skill">Design Systems</span><span class="skill">Figma</span><span class="skill">React</span><span class="skill">TypeScript</span><span class="skill">User Testing</span><span class="skill">Information Architecture</span><span class="skill">Accessibility</span></div></section><section class="experience"><h2>Experience</h2><div class="exp-list"><div class="exp-item"><div class="header"><div class="company">Figma</div><div class="period">2022–Present</div></div><div class="title">Lead Product Designer</div><p>Led the redesign of the collaboration interface, improving team productivity by 34%.</p></div><div class="exp-item"><div class="header"><div class="company">Stripe</div><div class="period">2019–2022</div></div><div class="title">Senior UX Designer</div><p>Designed the merchant dashboard experience used by 100K+ businesses worldwide.</p></div><div class="exp-item"><div class="header"><div class="company">Airbnb</div><div class="period">2017–2019</div></div><div class="title">Product Designer</div><p>Created the host onboarding flow that reduced drop-off by 22%.</p></div></div></section><section class="projects"><h2>Side Projects</h2><div class="projects-grid"><div class="project"><h3>Palette Generator</h3><div class="tech">React · TypeScript</div><p>AI-powered color palette tool for designers. 12K+ weekly users.</p><a href="#">View project →</a></div><div class="project"><h3>FocusFlow</h3><div class="tech">Swift · iOS</div><p>Minimal pomodoro timer with ambient soundscapes.</p><a href="#">View project →</a></div><div class="project"><h3>DesignTokens</h3><div class="tech">Figma Plugin</div><p>Sync design tokens from Figma to code in one click.</p><a href="#">View project →</a></div></div></section><section class="contact"><h2>Let's work together</h2><p>Currently open for contract and full-time opportunities.</p><a href="#" class="contact-btn">kai@nakamura.design</a></section><footer class="footer"><p>© 2025 Kai Nakamura · Built with ☕ and care</p></footer></body></html>`
  },
]

// ─── Template Preview Dialog ───────────────────────────────────────────────────

function TemplatePreviewDialog({
  template,
  open,
  onOpenChange,
}: {
  template: SiteTemplate | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { setSelectedTemplateHtml, setBuilderMode, navigate, setBuilderPhase } = useAppStore()
  const bt = useBuilderTheme()
  const t = useTranslation()

  if (!template) return null

  const handleEditTemplate = () => {
    setSelectedTemplateHtml(template.html)
    setBuilderMode('templates')
    setBuilderPhase('preview')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] bg-white border-gray-200 text-gray-900 p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-3">
          <DialogTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Eye className="h-5 w-5 text-violet-500" />
            {template.name}
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            {template.description}
          </DialogDescription>
        </DialogHeader>
        <div className="px-6 flex-1 overflow-auto">
          {/* Browser chrome for iframe */}
          <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-t-lg border border-gray-200">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <div className="h-3 w-3 rounded-full bg-[#28c840]" />
            </div>
            <div className="flex-1 mx-4">
              <div className="flex items-center gap-1 rounded-md bg-gray-50 px-3 py-1">
                <span className="text-xs text-gray-400 truncate">
                  {template.name.toLowerCase().replace(/\s+/g, '-')}.app
                </span>
              </div>
            </div>
          </div>
          <iframe
            srcDoc={template.html}
            title={template.name}
            className="w-full bg-white border-0 rounded-b-lg"
            style={{ height: '500px' }}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        </div>
        <DialogFooter className="px-6 py-4 flex gap-3 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className={`${bt.cardBorder} ${bt.optBg} ${bt.textMuted} ${bt.hoverBg} ${bt.hoverText}`}
          >
            {t('builder.closePreview')}
          </Button>
          <Button
            onClick={handleEditTemplate}
            className="group relative h-auto overflow-hidden rounded-md px-6 py-2.5 text-sm font-semibold text-white transition-all bg-blue-700 hover:bg-blue-800"
          >
            <Wand2 className="mr-2 h-4 w-4" />
            {t('builder.editTemplate')}
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Templates Section ─────────────────────────────────────────────────────────

function TemplatesSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [previewTemplate, setPreviewTemplate] = useState<SiteTemplate | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const t = useTranslation()
  const bt = useBuilderTheme()

  const filteredTemplates = selectedCategory === 'All'
    ? SITE_TEMPLATES
    : SITE_TEMPLATES.filter(t => t.category === selectedCategory)

  const handleTemplateClick = (template: SiteTemplate) => {
    setPreviewTemplate(template)
    setPreviewOpen(true)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.5 }}
      className="mt-12"
    >
      {/* Divider */}
      <div className="flex items-center gap-3 mb-6">
        <div className={`h-px flex-1 ${bt.separator}`} />
        <span className={`${bt.textDim} text-xs uppercase tracking-widest`}>or</span>
        <div className={`h-px flex-1 ${bt.separator}`} />
      </div>

      {/* Section header */}
      <div className="mb-6 text-center">
        <div className={`inline-flex items-center gap-2 rounded-full border ${bt.cardBorder} ${bt.optBg} px-4 py-2 text-sm mb-3`}>
          <FileText className="h-4 w-4 text-emerald-600" />
          <span className={bt.textMuted}>{t('builder.adv.readyMade')}</span>
        </div>
        <h2 className={`text-3xl font-bold tracking-tight ${bt.text} mb-2`}>{t('builder.adv.startFromTemplate')}</h2>
        <p className={bt.textMuted}>{t('builder.adv.pickTemplate')}</p>
      </div>

      {/* Category dropdown */}
      <div className="mb-6 flex justify-center">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className={`w-[200px] ${bt.inputBorder} ${bt.inputBg} ${bt.textMuted} ${bt.hoverBg}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className={`${bt.cardBg} ${bt.cardBorder}`}>
            {TEMPLATE_CATEGORIES.map(cat => (
              <SelectItem key={cat} value={cat} className={`${bt.inputText} ${bt.focusBg}`}>
                {cat === 'All' ? '🌐 All Categories' : cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Template grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredTemplates.map((template, i) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 + i * 0.05, duration: 0.4 }}
          >
            <Card
              className={`cursor-pointer group ${bt.cardBorder} ${bt.cardBg} transition-all duration-300 hover:border-blue-200 hover:shadow-md hover:-translate-y-1 overflow-hidden`}
              onClick={() => handleTemplateClick(template)}
            >
              {/* Thumbnail */}
              <div
                className="relative h-40 overflow-hidden"
                style={{ background: template.thumbnailGradient }}
              >
                <div
                  className="absolute inset-0"
                  style={{ background: template.thumbnailOverlay }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white/80 group-hover:text-white transition-colors drop-shadow-lg">
                    {template.name}
                  </span>
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                  <Maximize2 className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100" />
                </div>
              </div>

              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className={`text-sm font-semibold ${bt.textBright} group-hover:${bt.text} transition-colors`}>
                    {template.name}
                  </h3>
                  <Badge
                    variant="secondary"
                    className={`ml-auto ${bt.badgeBorder} ${bt.badgeBg} text-xs ${bt.badgeText}`}
                  >
                    {template.category}
                  </Badge>
                </div>
                <p className={`text-xs ${bt.textMuted} line-clamp-2 group-hover:${bt.text} transition-colors`}>
                  {template.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Preview dialog */}
      <TemplatePreviewDialog
        template={previewTemplate}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
      />
    </motion.div>
  )
}

// ─── Reusable glass card wrapper ────────────────────────────────────────────

function GlassCard({ label, icon, children, className = '' }: { label: string; icon: typeof Sparkles; children: React.ReactNode; className?: string }) {
  const bt = useBuilderTheme()
  const Icon = icon
  return (
    <div className={`rounded-md border ${bt.cardBorder} ${bt.cardBg} p-4 ${className}`}>
      <label className={`mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wider ${bt.labelText}`}>
        <Icon className={`h-3.5 w-3.5 ${bt.labelIcon}`} /> {label}
      </label>
      {children}
    </div>
  )
}

// ─── Color picker input ─────────────────────────────────────────────────────

function ColorPicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const bt = useBuilderTheme()
  return (
    <div className="flex items-center gap-2">
      <Label className={`text-xs ${bt.textMuted} min-w-[60px]`}>{label}</Label>
      <div className="relative flex items-center gap-1.5">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`h-7 w-7 rounded-md border ${bt.inputBorder} cursor-pointer bg-transparent [&::-webkit-color-swatch-wrapper]:p-0.5 [&::-webkit-color-swatch]:rounded-md`}
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`h-7 w-[80px] text-xs ${bt.inputBorder} ${bt.inputBg} ${bt.inputText} px-2`}
        />
      </div>
    </div>
  )
}

// ─── Advanced Options Panel ─────────────────────────────────────────────────

function AdvancedOptionsPanel() {
  const { builderAdvancedOptions, setBuilderAdvancedOptions, builderStyle, setBuilderStyle, builderAdvancedUnlocked, setBuilderAdvancedUnlocked } = useAppStore()
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [activeTab, setActiveTab] = useState('brand')
  const t = useTranslation()
  const bt = useBuilderTheme()

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
      {/* Toggle / Unlock button */}
      {!builderAdvancedUnlocked ? (
        <button
          onClick={() => setBuilderAdvancedUnlocked(true)}
          className={`group flex w-full items-center justify-center gap-2 rounded-md border ${bt.cardBorder} ${bt.cardBg} px-4 py-3 text-sm font-medium ${bt.textDim} transition-all ${bt.hoverBg} ${bt.hoverText}`}
        >
          <Lock className="h-4 w-4" />
          <span>{t('builder.advancedOptions')} — unlock to customize</span>
        </button>
      ) : (
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`group flex w-full items-center justify-center gap-2 rounded-md border ${bt.cardBorder} ${bt.cardBg} px-4 py-3 text-sm font-medium ${bt.textMuted} transition-all ${bt.hoverBg} ${bt.hoverText}`}
        >
          <Sliders className="h-4 w-4" />
          <span>{t('builder.advancedOptions')}</span>
          {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      )}

      {/* Collapsible content */}
      <AnimatePresence>
        {showAdvanced && builderAdvancedUnlocked && (
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
                <TabsList className={`w-full ${bt.inputBg} border ${bt.cardBorder} rounded-md h-auto p-1 mb-4 flex-wrap`}>
                  <TabsTrigger value="brand" className={`${bt.tabActiveBg} ${bt.tabActiveBorder} ${bt.tabActiveText} ${bt.textMuted} text-xs flex-1 min-w-0`}>
                    <Paintbrush className="h-3 w-3 mr-1" /> Brand
                  </TabsTrigger>
                  <TabsTrigger value="complexity" className={`${bt.tabActiveBg} ${bt.tabActiveBorder} ${bt.tabActiveText} ${bt.textMuted} text-xs flex-1 min-w-0`}>
                    <Layers className="h-3 w-3 mr-1" /> Length
                  </TabsTrigger>
                  <TabsTrigger value="visual" className={`${bt.tabActiveBg} ${bt.tabActiveBorder} ${bt.tabActiveText} ${bt.textMuted} text-xs flex-1 min-w-0`}>
                    <Palette className="h-3 w-3 mr-1" /> Style
                  </TabsTrigger>
                  <TabsTrigger value="sections" className={`${bt.tabActiveBg} ${bt.tabActiveBorder} ${bt.tabActiveText} ${bt.textMuted} text-xs flex-1 min-w-0`}>
                    <Layout className="h-3 w-3 mr-1" /> Sections
                  </TabsTrigger>
                  <TabsTrigger value="navigation" className={`${bt.tabActiveBg} ${bt.tabActiveBorder} ${bt.tabActiveText} ${bt.textMuted} text-xs flex-1 min-w-0`}>
                    <Navigation className="h-3 w-3 mr-1" /> UX
                  </TabsTrigger>
                  <TabsTrigger value="seo" className={`${bt.tabActiveBg} ${bt.tabActiveBorder} ${bt.tabActiveText} ${bt.textMuted} text-xs flex-1 min-w-0`}>
                    <Shield className="h-3 w-3 mr-1" /> SEO
                  </TabsTrigger>
                </TabsList>

                {/* ─── Brand & Identity Tab ─────────────────────────────── */}
                <TabsContent value="brand" className="mt-0">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* Brand Name */}
                    <GlassCard label={t('builder.adv.brandName')} icon={Tag}>
                      <Input
                        value={builderAdvancedOptions.brandName}
                        onChange={(e) => setBuilderAdvancedOptions({ brandName: e.target.value })}
                        placeholder="Enter your brand name..."
                        className={`${bt.inputBorder} ${bt.inputBg} ${bt.inputText} ${bt.inputPlaceholder} h-9`}
                      />
                    </GlassCard>

                    {/* Font Family */}
                    <GlassCard label={t('builder.adv.fontFamily')} icon={Type}>
                      <Select
                        value={builderAdvancedOptions.fontFamily}
                        onValueChange={(v) => setBuilderAdvancedOptions({ fontFamily: v })}
                      >
                        <SelectTrigger className={`${bt.inputBorder} ${bt.inputBg} ${bt.inputText} hover:bg-zinc-100 h-9`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className={`${bt.cardBg} ${bt.cardBorder} max-h-60`}>
                          {FONT_OPTIONS.map(font => (
                            <SelectItem key={font} value={font} className={`${bt.inputText} ${bt.focusBg}`}>
                              <span style={{ fontFamily: font }} className="text-sm">{font}</span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </GlassCard>
                  </div>

                  {/* Logo Placement */}
                  <GlassCard label={t('builder.adv.logoPlacement')} icon={AlignLeft} className="mt-4">
                    <div className="flex gap-2">
                      {LOGO_PLACEMENT_OPTIONS.map(opt => {
                        const Icon = opt.icon
                        const isActive = builderAdvancedOptions.logoPlacement === opt.id
                        // Default to 'left' if not set
                        const currentPlacement = builderAdvancedOptions.logoPlacement || 'left'
                        const isSelected = currentPlacement === opt.id
                        return (
                          <button
                            key={opt.id}
                            onClick={() => setBuilderAdvancedOptions({ logoPlacement: opt.id })}
                            className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-xs transition-all ${
                              isSelected
                                ? `${bt.selBg} ${bt.selBorder} ${bt.selText}`
                                : `${bt.optBg} ${bt.optBorder} ${bt.optText} ${bt.optHoverBg} ${bt.optHoverText}`
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
                  <GlassCard label={t('builder.adv.colorScheme')} icon={Palette} className="mt-4">
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
                            <TooltipContent className={`${bt.cardBg} ${bt.cardBorder} text-xs ${bt.textMuted}`}>
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
                  <GlassCard label={t('builder.adv.complexityLevel')} icon={Layers}>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {COMPLEXITY_OPTIONS.map(opt => {
                        const isSelected = builderAdvancedOptions.complexity === opt.id
                        return (
                          <button
                            key={opt.id}
                            onClick={() => setBuilderAdvancedOptions({ complexity: opt.id })}
                            className={`flex flex-col rounded-md px-3 py-2.5 text-left transition-all ${
                              isSelected
                                ? `${bt.selBg} ${bt.selBorder} ${bt.selText}`
                                : `${bt.optBg} ${bt.optBorder} ${bt.optText} ${bt.optHoverBg} ${bt.optHoverText}`
                            }`}
                          >
                            <span className={`text-sm font-medium ${isSelected ? bt.selText : bt.optText}`}>
                              {opt.label}
                            </span>
                            <span className={`text-xs mt-0.5 ${isSelected ? bt.selDesc : bt.optDesc}`}>
                              {opt.desc}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </GlassCard>

                  {/* Default Page Length */}
                  <GlassCard label={t('builder.adv.pageLength')} icon={Grip} className="mt-4">
                    <div className="grid gap-2 sm:grid-cols-2">
                      {PAGE_LENGTH_OPTIONS.map(opt => {
                        const isSelected = builderAdvancedOptions.pageLength === opt.id
                        return (
                          <button
                            key={opt.id}
                            onClick={() => setBuilderAdvancedOptions({ pageLength: opt.id })}
                            className={`flex flex-col rounded-md px-3 py-2.5 text-left transition-all ${
                              isSelected
                                ? `${bt.selBg} ${bt.selBorder} ${bt.selText}`
                                : `${bt.optBg} ${bt.optBorder} ${bt.optText} ${bt.optHoverBg} ${bt.optHoverText}`
                            }`}
                          >
                            <span className={`text-sm font-medium ${isSelected ? bt.selText : bt.optText}`}>
                              {opt.label}
                            </span>
                            <span className={`text-xs mt-0.5 ${isSelected ? bt.selDesc : bt.optDesc}`}>
                              {opt.desc}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </GlassCard>

                  {/* Layout Density */}
                  <GlassCard label={t('builder.adv.layoutDensity')} icon={Columns} className="mt-4">
                    <div className="grid gap-2 sm:grid-cols-2">
                      {LAYOUT_DENSITY_OPTIONS.map(opt => {
                        const isSelected = builderAdvancedOptions.layoutDensity === opt.id
                        return (
                          <button
                            key={opt.id}
                            onClick={() => setBuilderAdvancedOptions({ layoutDensity: opt.id })}
                            className={`flex flex-col rounded-md px-3 py-2.5 text-left transition-all ${
                              isSelected
                                ? `${bt.selBg} ${bt.selBorder} ${bt.selText}`
                                : `${bt.optBg} ${bt.optBorder} ${bt.optText} ${bt.optHoverBg} ${bt.optHoverText}`
                            }`}
                          >
                            <span className={`text-sm font-medium ${isSelected ? bt.selText : bt.optText}`}>
                              {opt.label}
                            </span>
                            <span className={`text-xs mt-0.5 ${isSelected ? bt.selDesc : bt.optDesc}`}>
                              {opt.desc}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </GlassCard>

                  {/* Page Configuration Table */}
                  <GlassCard label={t('builder.adv.pageConfig')} icon={Layout} className="mt-4">
                    <div className="space-y-2">
                      {PAGE_CONFIG_ITEMS.map(pageItem => {
                        const config = builderAdvancedOptions.pageConfigs.find(p => p.id === pageItem.id)
                        if (!config) return null
                        const Icon = pageItem.icon
                        return (
                          <div key={pageItem.id} className={`flex items-center gap-3 rounded-md border ${bt.borderSub} ${bt.optBg} px-3 py-2`}>
                            <Icon className={`h-4 w-4 ${bt.textDim}`} />
                            <span className={`text-sm ${bt.textMuted} min-w-[80px]`}>{config.name}</span>
                            <Switch
                              checked={config.enabled}
                              onCheckedChange={(v) => updatePageConfig(pageItem.id, 'enabled', v)}
                              className="data-[state=checked]:bg-blue-700"
                            />
                            {config.enabled && (
                              <Select
                                value={config.length}
                                onValueChange={(v) => updatePageConfig(pageItem.id, 'length', v as BuilderPageLength)}
                              >
                                <SelectTrigger className={`h-7 w-[100px] text-xs ${bt.inputBorder} ${bt.inputBg} ${bt.inputText}`}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className={`${bt.cardBg} ${bt.cardBorder}`}>
                                  {PAGE_LENGTH_OPTIONS.map(opt => (
                                    <SelectItem key={opt.id} value={opt.id} className={`${bt.inputText} ${bt.focusBg} text-xs`}>
                                      {opt.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                            <Badge variant="secondary" className={`ml-auto text-xs border ${config.enabled ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : `${bt.badgeBorder} ${bt.badgeBg} ${bt.badgeText}`}`}>
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
                  {/* Expanded Palette Grid with category filtering */}
                  <GlassCard label={t('builder.adv.visualStyle')} icon={Palette}>
                    <PaletteAdvancedSelect />
                  </GlassCard>

                  {/* Content Tone */}
                  <GlassCard label={t('builder.adv.contentTone')} icon={MessageSquare} className="mt-4">
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {CONTENT_TONE_OPTIONS.map(opt => {
                        const isSelected = builderAdvancedOptions.contentTone === opt.id
                        return (
                          <button
                            key={opt.id}
                            onClick={() => setBuilderAdvancedOptions({ contentTone: opt.id })}
                            className={`flex flex-col rounded-md px-3 py-2 text-left transition-all ${
                              isSelected
                                ? `${bt.selBg} ${bt.selBorder} ${bt.selText}`
                                : `${bt.optBg} ${bt.optBorder} ${bt.optText} ${bt.optHoverBg} ${bt.optHoverText}`
                            }`}
                          >
                            <span className={`text-sm font-medium ${isSelected ? bt.selText : bt.optText}`}>
                              {opt.label}
                            </span>
                            <span className={`text-xs mt-0.5 ${isSelected ? bt.selDesc : bt.optDesc}`}>
                              {opt.desc}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </GlassCard>

                  {/* Layout Density (also shown here for convenience) */}
                  <GlassCard label={t('builder.adv.layoutDensity')} icon={Columns} className="mt-4">
                    <div className="grid gap-2 sm:grid-cols-2">
                      {LAYOUT_DENSITY_OPTIONS.map(opt => {
                        const isSelected = builderAdvancedOptions.layoutDensity === opt.id
                        return (
                          <button
                            key={opt.id}
                            onClick={() => setBuilderAdvancedOptions({ layoutDensity: opt.id })}
                            className={`flex flex-col rounded-md px-3 py-2.5 text-left transition-all ${
                              isSelected
                                ? `${bt.selBg} ${bt.selBorder} ${bt.selText}`
                                : `${bt.optBg} ${bt.optBorder} ${bt.optText} ${bt.optHoverBg} ${bt.optHoverText}`
                            }`}
                          >
                            <span className={`text-sm font-medium ${isSelected ? bt.selText : bt.optText}`}>
                              {opt.label}
                            </span>
                            <span className={`text-xs mt-0.5 ${isSelected ? bt.selDesc : bt.optDesc}`}>
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
                  <GlassCard label={t('builder.adv.sectionsFeatures')} icon={Layout}>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {SECTION_TOGGLE_ITEMS.map(item => {
                        const Icon = item.icon
                        const isEnabled = (builderAdvancedOptions[item.key as keyof BuilderAdvancedOptions] as boolean) ?? false
                        return (
                          <div key={item.key} className={`flex items-center justify-between rounded-md border ${bt.borderSub} ${bt.optBg} px-3 py-2.5`}>
                            <div className="flex items-center gap-2 min-w-0">
                              <Icon className={`h-4 w-4 ${bt.textDim} flex-shrink-0`} />
                              <div className="min-w-0">
                                <span className={`text-sm ${bt.textMuted} truncate block`}>{item.label}</span>
                                <span className={`text-xs ${bt.textSub} truncate block`}>{item.desc}</span>
                              </div>
                            </div>
                            <Switch
                              checked={isEnabled}
                              onCheckedChange={(v) => updateSectionToggle(item.key, v)}
                              className="data-[state=checked]:bg-blue-700 flex-shrink-0"
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
                    <GlassCard label={t('builder.adv.navigationStyle')} icon={Navigation}>
                      <div className="space-y-1.5">
                        {NAVIGATION_STYLE_OPTIONS.map(opt => {
                          const isSelected = builderAdvancedOptions.navigationStyle === opt.id
                          return (
                            <button
                              key={opt.id}
                              onClick={() => setBuilderAdvancedOptions({ navigationStyle: opt.id })}
                              className={`flex items-center gap-2 w-full rounded-md px-3 py-2 text-left transition-all ${
                                isSelected
                                  ? `${bt.selBg} ${bt.selBorder} ${bt.selText}`
                                  : `${bt.optBg} ${bt.optBorder} ${bt.optText} ${bt.optHoverBg} ${bt.optHoverText}`
                              }`}
                            >
                              <span className={`text-sm font-medium ${isSelected ? bt.selText : bt.optText}`}>
                                {opt.label}
                              </span>
                              <span className={`text-xs ${isSelected ? bt.selDesc : bt.optDesc}`}>
                                {opt.desc}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </GlassCard>

                    {/* CTA Style */}
                    <GlassCard label={t('builder.adv.ctaStyle')} icon={Megaphone}>
                      <div className="space-y-1.5">
                        {CTA_STYLE_OPTIONS.map(opt => {
                          const isSelected = builderAdvancedOptions.ctaStyle === opt.id
                          return (
                            <button
                              key={opt.id}
                              onClick={() => setBuilderAdvancedOptions({ ctaStyle: opt.id })}
                              className={`flex items-center gap-2 w-full rounded-md px-3 py-2 text-left transition-all ${
                                isSelected
                                  ? `${bt.selBg} ${bt.selBorder} ${bt.selText}`
                                  : `${bt.optBg} ${bt.optBorder} ${bt.optText} ${bt.optHoverBg} ${bt.optHoverText}`
                              }`}
                            >
                              <span className={`text-sm font-medium ${isSelected ? bt.selText : bt.optText}`}>
                                {opt.label}
                              </span>
                              <span className={`text-xs ${isSelected ? bt.selDesc : bt.optDesc}`}>
                                {opt.desc}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </GlassCard>
                  </div>

                  {/* Animation Level */}
                  <GlassCard label={t('builder.adv.animationLevel')} icon={Sparkles} className="mt-4">
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {ANIMATION_LEVEL_OPTIONS.map(opt => {
                        const isSelected = builderAdvancedOptions.animationLevel === opt.id
                        return (
                          <button
                            key={opt.id}
                            onClick={() => setBuilderAdvancedOptions({ animationLevel: opt.id })}
                            className={`flex flex-col rounded-md px-3 py-2 text-left transition-all ${
                              isSelected
                                ? `${bt.selBg} ${bt.selBorder} ${bt.selText}`
                                : `${bt.optBg} ${bt.optBorder} ${bt.optText} ${bt.optHoverBg} ${bt.optHoverText}`
                            }`}
                          >
                            <span className={`text-sm font-medium ${isSelected ? bt.selText : bt.optText}`}>
                              {opt.label}
                            </span>
                            <span className={`text-xs mt-0.5 ${isSelected ? bt.selDesc : bt.optDesc}`}>
                              {opt.desc}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </GlassCard>

                  {/* Responsive Priority */}
                  <GlassCard label={t('builder.adv.responsivePriority')} icon={Smartphone} className="mt-4">
                    <div className="grid gap-2 sm:grid-cols-3">
                      {RESPONSIVE_PRIORITY_OPTIONS.map(opt => {
                        const isSelected = builderAdvancedOptions.responsivePriority === opt.id
                        return (
                          <button
                            key={opt.id}
                            onClick={() => setBuilderAdvancedOptions({ responsivePriority: opt.id })}
                            className={`flex flex-col rounded-md px-3 py-2.5 text-left transition-all ${
                              isSelected
                                ? `${bt.selBg} ${bt.selBorder} ${bt.selText}`
                                : `${bt.optBg} ${bt.optBorder} ${bt.optText} ${bt.optHoverBg} ${bt.optHoverText}`
                            }`}
                          >
                            <span className={`text-sm font-medium ${isSelected ? bt.selText : bt.optText}`}>
                              {opt.label}
                            </span>
                            <span className={`text-xs mt-0.5 ${isSelected ? bt.selDesc : bt.optDesc}`}>
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
                    <GlassCard label={t('builder.adv.seoLevel')} icon={Shield}>
                      <div className="space-y-1.5">
                        {SEO_LEVEL_OPTIONS.map(opt => {
                          const isSelected = builderAdvancedOptions.seoLevel === opt.id
                          return (
                            <button
                              key={opt.id}
                              onClick={() => setBuilderAdvancedOptions({ seoLevel: opt.id })}
                              className={`flex items-center gap-2 w-full rounded-md px-3 py-2 text-left transition-all ${
                                isSelected
                                  ? `${bt.selBg} ${bt.selBorder} ${bt.selText}`
                                  : `${bt.optBg} ${bt.optBorder} ${bt.optText} ${bt.optHoverBg} ${bt.optHoverText}`
                              }`}
                            >
                              <span className={`text-sm font-medium ${isSelected ? bt.selText : bt.optText}`}>
                                {opt.label}
                              </span>
                              <span className={`text-xs ${isSelected ? bt.selDesc : bt.optDesc}`}>
                                {opt.desc}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </GlassCard>

                    {/* Accessibility Level */}
                    <GlassCard label={t('builder.adv.accessibilityLevel')} icon={Accessibility}>
                      <div className="space-y-1.5">
                        {ACCESSIBILITY_LEVEL_OPTIONS.map(opt => {
                          const isSelected = builderAdvancedOptions.accessibilityLevel === opt.id
                          return (
                            <button
                              key={opt.id}
                              onClick={() => setBuilderAdvancedOptions({ accessibilityLevel: opt.id })}
                              className={`flex items-center gap-2 w-full rounded-md px-3 py-2 text-left transition-all ${
                                isSelected
                                  ? `${bt.selBg} ${bt.selBorder} ${bt.selText}`
                                  : `${bt.optBg} ${bt.optBorder} ${bt.optText} ${bt.optHoverBg} ${bt.optHoverText}`
                              }`}
                            >
                              <span className={`text-sm font-medium ${isSelected ? bt.selText : bt.optText}`}>
                                {opt.label}
                              </span>
                              <span className={`text-xs ${isSelected ? bt.selDesc : bt.optDesc}`}>
                                {opt.desc}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </GlassCard>
                  </div>

                  {/* Image Style */}
                  <GlassCard label={t('builder.adv.imageStyle')} icon={Image} className="mt-4">
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {IMAGE_STYLE_OPTIONS.map(opt => {
                        const isSelected = builderAdvancedOptions.imageStyle === opt.id
                        return (
                          <button
                            key={opt.id}
                            onClick={() => setBuilderAdvancedOptions({ imageStyle: opt.id })}
                            className={`flex flex-col rounded-md px-3 py-2 text-left transition-all ${
                              isSelected
                                ? `${bt.selBg} ${bt.selBorder} ${bt.selText}`
                                : `${bt.optBg} ${bt.optBorder} ${bt.optText} ${bt.optHoverBg} ${bt.optHoverText}`
                            }`}
                          >
                            <span className={`text-sm font-medium ${isSelected ? bt.selText : bt.optText}`}>
                              {opt.label}
                            </span>
                            <span className={`text-xs mt-0.5 ${isSelected ? bt.selDesc : bt.optDesc}`}>
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

// ─── Palette Quick Select (inline in prompt phase) ──────────────────────────

function PaletteQuickSelect() {
  const { builderStyle, setBuilderStyle, setBuilderAdvancedOptions, builderAdvancedOptions } = useAppStore()
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [search, setSearch] = useState('')
  const t = useTranslation()
  const bt = useBuilderTheme()

  const filtered = categoryFilter === 'All'
    ? ALL_PALETTES
    : ALL_PALETTES.filter(p => p.category === categoryFilter)

  const searched = search.trim()
    ? filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase()) || (p.nameFa && p.nameFa.includes(search)))
    : filtered

  const handleSelect = (palette: ThemePalette) => {
    setBuilderStyle(palette.id)
    // Also update the color scheme in advanced options
    setBuilderAdvancedOptions({
      colorScheme: {
        primary: palette.colors.primary,
        accent: palette.colors.accent,
        background: palette.colors.background,
        surface: palette.colors.surface,
        text: palette.colors.text,
        muted: palette.colors.muted,
      },
      fontFamily: palette.fontSuggestion,
    })
  }

  const selectedPalette = ALL_PALETTES.find(p => p.id === builderStyle)

  return (
    <div className="space-y-3">
      {/* Selected palette info bar — shown prominently at the top */}
      {selectedPalette && (
        <div className={`rounded-md border ${bt.infoBorder} ${bt.infoBg} p-3`}>
          <div className="flex items-center gap-3">
            <div className="h-10 w-20 rounded-md" style={{ background: selectedPalette.thumbnailGradient }} />
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold ${bt.infoText}`}>{selectedPalette.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Badge variant="secondary" className={`text-[10px] ${bt.infoBadgeBg} ${bt.infoBadgeText} ${bt.infoBadgeBorder} px-1.5 py-0`}>{selectedPalette.category}</Badge>
                <span className={`text-xs ${bt.textMuted}`}>{selectedPalette.layoutStyle}</span>
              </div>
              {selectedPalette.nameFa && <p className={`text-xs ${bt.textDim} mt-0.5`}>{selectedPalette.nameFa}</p>}
            </div>
            <div className="flex gap-1">
              {Object.values(selectedPalette.colors).map((c, i) => (
                <div key={i} className={`h-6 w-6 rounded-md border ${bt.cardBorder}`} style={{ background: c }} />
              ))}
            </div>
          </div>
          <p className={`text-xs ${bt.textMuted} mt-1.5`}>{selectedPalette.mood}</p>
        </div>
      )}

      {/* Category filter pills + search */}
      <div className="flex flex-col gap-2">
        <div className={`flex gap-1.5 overflow-x-auto pb-1 [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:${bt.scrollbarThumb} [&::-webkit-scrollbar-thumb]:rounded-full`}>
          <button
            onClick={() => setCategoryFilter('All')}
            className={`text-xs px-3 py-1.5 rounded-md whitespace-nowrap transition-all font-medium ${
              categoryFilter === 'All' ? `${bt.selBg} ${bt.selBorder} ${bt.selText}` : `${bt.optBg} ${bt.optBorder} ${bt.optText} ${bt.optHoverBg} ${bt.optHoverText}`
            }`}
          >
            All ({ALL_PALETTES.length})
          </button>
          {PALETTE_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`text-xs px-3 py-1.5 rounded-md whitespace-nowrap transition-all font-medium ${
                categoryFilter === cat ? `${bt.selBg} ${bt.selBorder} ${bt.selText}` : `${bt.optBg} ${bt.optBorder} ${bt.optText} ${bt.optHoverBg} ${bt.optHoverText}`
              }`}
            >
              {cat} ({ALL_PALETTES.filter(p => p.category === cat).length})
            </button>
          ))}
        </div>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search palettes..."
          className={`${bt.inputBorder} ${bt.inputBg} ${bt.inputText} ${bt.inputPlaceholder} h-9 text-xs`}
        />
      </div>

      {/* Palette grid — scrollable, shows ALL matching palettes */}
      <div className={`max-h-[480px] overflow-y-auto rounded-md border ${bt.cardBorder} ${bt.cardBg} p-3 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2.5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:${bt.scrollbarThumb} [&::-webkit-scrollbar-thumb]:rounded-full`}>
        {searched.map(palette => {
          const isSelected = builderStyle === palette.id
          return (
            <motion.button
              key={palette.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelect(palette)}
              className={`group relative rounded-md overflow-hidden transition-all ${
                isSelected
                  ? 'ring-2 ring-blue-700'
                  : `hover:ring-1 hover:ring-zinc-300`
              }`}
            >
              {/* Gradient thumbnail */}
              <div className="h-14 w-full" style={{ background: palette.thumbnailGradient }} />
              {/* Color swatches row */}
              <div className="flex gap-0 px-2 pt-1.5 pb-1">
                {Object.values(palette.colors).map((c, i) => (
                  <div key={i} className="h-4 w-4 rounded-sm border border-gray-200/50" style={{ background: c }} />
                ))}
              </div>
              {/* Name + info */}
              <div className={`${bt.cardBg} px-2 pb-2 pt-0.5`}>
                <p className={`text-xs font-medium leading-tight ${isSelected ? bt.infoText : bt.optText}`}>
                  {palette.name}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Badge variant="secondary" className={`text-[9px] ${bt.badgeBg} ${bt.badgeText} ${bt.badgeBorder} px-1 py-0`}>{palette.category}</Badge>
                  <span className={`text-[10px] ${bt.textDim}`}>{palette.layoutStyle}</span>
                </div>
              </div>
              {isSelected && (
                <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-blue-700 flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-white" />
                </div>
              )}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Palette Advanced Select (in unlocked advanced options) ──────────────────

function PaletteAdvancedSelect() {
  const { builderStyle, setBuilderStyle, setBuilderAdvancedOptions, builderAdvancedOptions } = useAppStore()
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [search, setSearch] = useState('')
  const t = useTranslation()
  const bt = useBuilderTheme()

  const filtered = categoryFilter === 'All'
    ? ALL_PALETTES
    : ALL_PALETTES.filter(p => p.category === categoryFilter)

  const searched = search.trim()
    ? filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase()) || (p.nameFa && p.nameFa.includes(search)))
    : filtered

  const handleSelect = (palette: ThemePalette) => {
    setBuilderStyle(palette.id)
    setBuilderAdvancedOptions({
      colorScheme: {
        primary: palette.colors.primary,
        accent: palette.colors.accent,
        background: palette.colors.background,
        surface: palette.colors.surface,
        text: palette.colors.text,
        muted: palette.colors.muted,
      },
      fontFamily: palette.fontSuggestion,
    })
  }

  const selectedPalette = ALL_PALETTES.find(p => p.id === builderStyle)

  return (
    <div className="space-y-3">
      {/* Selected palette info */}
      {selectedPalette && (
        <div className={`rounded-md p-3 ${bt.infoBg} border ${bt.infoBorder}`}>
          <div className="flex items-center gap-3">
            <div className="h-10 w-20 rounded-md" style={{ background: selectedPalette.thumbnailGradient }} />
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold ${bt.infoText}`}>{selectedPalette.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Badge variant="secondary" className={`text-[10px] ${bt.infoBadgeBg} ${bt.infoBadgeText} ${bt.infoBadgeBorder} px-1.5 py-0`}>{selectedPalette.category}</Badge>
                <span className={`text-xs ${bt.textMuted}`}>{selectedPalette.layoutStyle}</span>
              </div>
              {selectedPalette.nameFa && <p className={`text-xs ${bt.textDim} mt-0.5`}>{selectedPalette.nameFa}</p>}
            </div>
            <div className="flex gap-1">
              {Object.values(selectedPalette.colors).map((c, i) => (
                <div key={i} className={`h-5 w-5 rounded-md border ${bt.cardBorder}`} style={{ background: c }} />
              ))}
            </div>
          </div>
          <p className={`text-xs ${bt.textMuted} mt-1`}>{selectedPalette.mood}</p>
          {selectedPalette.description && <p className={`text-xs ${bt.textDim} mt-0.5`}>{selectedPalette.description}</p>}
        </div>
      )}

      {/* Category filter pills */}
      <div className={`flex gap-1.5 overflow-x-auto pb-1 [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:${bt.scrollbarThumb} [&::-webkit-scrollbar-thumb]:rounded-full`}>
        <button
          onClick={() => setCategoryFilter('All')}
          className={`text-[10px] px-2.5 py-1 rounded-md whitespace-nowrap transition-all font-medium ${
            categoryFilter === 'All' ? `${bt.selBg} ${bt.selBorder} ${bt.selText}` : `${bt.optBg} ${bt.optBorder} ${bt.optText} ${bt.optHoverBg} ${bt.optHoverText}`
          }`}
        >
          All ({ALL_PALETTES.length})
        </button>
        {PALETTE_CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`text-[10px] px-2.5 py-1 rounded-md whitespace-nowrap transition-all font-medium ${
              categoryFilter === cat ? `${bt.selBg} ${bt.selBorder} ${bt.selText}` : `${bt.optBg} ${bt.optBorder} ${bt.optText} ${bt.optHoverBg} ${bt.optHoverText}`
            }`}
          >
            {cat} ({ALL_PALETTES.filter(p => p.category === cat).length})
          </button>
        ))}
      </div>

      {/* Search */}
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search palettes..."
        className={`${bt.inputBorder} ${bt.inputBg} ${bt.inputText} ${bt.inputPlaceholder} h-9 text-xs`}
      />

      {/* Palette grid — scrollable, shows ALL matching palettes */}
      <div className={`max-h-[420px] overflow-y-auto rounded-md border ${bt.cardBorder} ${bt.cardBg} p-3 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2.5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:${bt.scrollbarThumb} [&::-webkit-scrollbar-thumb]:rounded-full`}>
        {searched.map(palette => {
          const isSelected = builderStyle === palette.id
          return (
            <motion.button
              key={palette.id}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleSelect(palette)}
              className={`group relative rounded-md overflow-hidden transition-all ${
                isSelected
                  ? 'ring-2 ring-blue-700'
                  : `hover:ring-1 hover:ring-zinc-300`
              }`}
            >
              {/* Gradient thumbnail */}
              <div className="h-12 w-full" style={{ background: palette.thumbnailGradient }} />
              {/* Color swatches */}
              <div className="flex gap-0 px-2 pt-1 pb-0.5">
                {Object.values(palette.colors).map((c, i) => (
                  <div key={i} className="h-3.5 w-3.5 rounded-sm border border-gray-200/50" style={{ background: c }} />
                ))}
              </div>
              {/* Name + layout */}
              <div className={`${bt.cardBg} px-2 pb-1.5 pt-0.5`}>
                <p className={`text-[10px] font-medium leading-tight ${isSelected ? bt.infoText : bt.optText}`}>
                  {palette.name}
                </p>
                <p className={`text-[9px] ${bt.textDim}`}>{palette.layoutStyle}</p>
              </div>
              {isSelected && (
                <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-blue-700 flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-white" />
                </div>
              )}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Prompt Phase ───────────────────────────────────────────────────────────

function PromptPhase() {
  const {
    setBuilderPrompt, builderPrompt, startGeneration,
    builderIndustry, setBuilderIndustry,
    builderStyle, setBuilderStyle,
    builderLanguage, setBuilderLanguage,
    builderAdvancedOptions,
    navigate,
  } = useAppStore()
  const t = useTranslation()
  const bt = useBuilderTheme()

  const [cursorVisible, setCursorVisible] = useState(true)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const interval = setInterval(() => setCursorVisible(v => !v), 530)
    return () => clearInterval(interval)
  }, [])

  const handleGenerate = () => {
    if (!builderPrompt.trim()) {
      toast({ title: t('builder.pleaseEnterPrompt'), description: t('builder.promptDesc') })
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
    <div className={`relative flex min-h-[100dvh] flex-col items-center justify-center overflow-y-auto px-4 py-6 sm:py-12 ${bt.pageBg}`}>
      {/* Subtle dot grid pattern */}
      <div className={`absolute inset-0 ${bt.dotGridOpacity} pointer-events-none`} style={{
        backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.15) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }} />

      {/* Top-right language switcher + back button */}
      <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 z-20 flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('landing')}
          className={`${bt.textMuted} ${bt.hoverText} ${bt.hoverBg} text-xs`}
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-1 rtl:ml-1 rtl:mr-0 rtl:rotate-180" />
          {t('builder.backToHome')}
        </Button>
      </div>
      <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 z-20">
        <LanguageSwitcher variant="pill" compact />
      </div>

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
            className={`mb-6 inline-flex items-center gap-2 rounded-full border ${bt.cardBorder} ${bt.optBg} px-4 py-2 text-sm`}
          >
            <Sparkles className="h-4 w-4 text-blue-700" />
            <span className={bt.textMuted}>{t('builder.poweredBy', { n: totalEnabledPages })}</span>
          </motion.div>

          <h1 className={`mb-3 text-4xl font-bold tracking-tight ${bt.text} sm:text-5xl`}>
            {t('builder.title')}
          </h1>
          <p className={`text-lg ${bt.textMuted}`}>
            {t('builder.subtitle')}
          </p>
        </div>

        {/* Controls row: industry + language */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-5 grid gap-4 sm:grid-cols-2"
        >
          {/* Industry selector */}
          <GlassCard label={t('builder.industry')} icon={Briefcase}>
            <Select value={builderIndustry} onValueChange={(v) => setBuilderIndustry(v as Industry)}>
              <SelectTrigger className={`${bt.inputBorder} ${bt.inputBg} ${bt.inputText} hover:bg-zinc-100`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className={`${bt.cardBg} ${bt.cardBorder} max-h-80`}>
                {INDUSTRY_OPTIONS.map(opt => {
                  const Icon = opt.icon
                  return (
                    <SelectItem key={opt.id} value={opt.id} className={`${bt.inputText} ${bt.focusBg}`}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-blue-700" />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{opt.label}</span>
                          <span className={`text-xs ${bt.textMuted}`}>{opt.hint}</span>
                        </div>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </GlassCard>

          {/* Language selector (generated site's language, NOT UI language) */}
          <GlassCard label={t('builder.siteLanguage')} icon={Globe}>
            <Select value={builderLanguage} onValueChange={(v) => setBuilderLanguage(v as any)}>
              <SelectTrigger className={`${bt.inputBorder} ${bt.inputBg} ${bt.inputText} hover:bg-zinc-100`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className={`${bt.cardBg} ${bt.cardBorder} max-h-80`}>
                {LANGUAGE_OPTIONS.map(opt => (
                  <SelectItem key={opt.id} value={opt.id} className={`${bt.inputText} ${bt.focusBg}`}>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-blue-700" />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{opt.label}</span>
                        <span className={`text-xs ${bt.textMuted}`} dir="ltr">{opt.font} · {opt.dir.toUpperCase()}</span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </GlassCard>
        </motion.div>

        {/* Palette selector — full width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mb-5"
        >
          <GlassCard label={t('builder.style')} icon={Palette}>
            <PaletteQuickSelect />
          </GlassCard>
        </motion.div>

        {/* Prompt input area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative mb-6"
        >
          <div className={`relative overflow-hidden rounded-md border ${bt.cardBorder} ${bt.cardBg}`}>
            <Textarea
              ref={textareaRef}
              value={builderPrompt}
              onChange={(e) => setBuilderPrompt(e.target.value)}
              placeholder={t('builder.placeholder')}
              className={`relative min-h-[160px] resize-none border-0 bg-transparent p-6 text-base ${bt.text} ${bt.inputPlaceholder} focus-visible:ring-0 focus-visible:ring-offset-0 [&::-webkit-scrollbar]:hidden`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault()
                  handleGenerate()
                }
              }}
            />
            {builderPrompt.length === 0 && cursorVisible && (
              <div className={`absolute left-6 rtl:left-auto rtl:right-6 top-[88px] h-5 w-0.5 animate-pulse bg-blue-700`} />
            )}
            {/* Footer of textarea */}
            <div className={`flex items-center justify-between border-t ${bt.borderSub} ${bt.inputBg} px-6 py-2.5`}>
              <span className={`text-xs ${bt.textDim}`} dir="ltr">
                {t('builder.chars', { n: builderPrompt.length })}
              </span>
              <span className={`text-xs ${bt.textMuted}`}>
                {t('builder.pageCount', { enabled: enabledPages.length, total: totalEnabledPages })}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Advanced Options Panel */}
        <AdvancedOptionsPanel />

        {/* Generate button — classic cubic minimalistic, deep blue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-10 flex justify-center"
        >
          <Button
            onClick={handleGenerate}
            disabled={!builderPrompt.trim()}
            className="h-14 min-h-[44px] w-full sm:w-auto rounded-md px-10 text-base font-semibold bg-blue-700 text-white hover:bg-blue-800 active:bg-blue-900 shadow-none border-0 transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Wand2 className="mr-2 rtl:ml-2 rtl:mr-0 h-5 w-5" />
            {t('builder.generate')}
          </Button>
        </motion.div>

        {/* Suggestion cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className={`mb-4 text-center text-sm ${bt.textDim}`}>{t('builder.tryExample')}</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PROMPT_SUGGESTIONS.map((suggestion, i) => (
              <motion.div
                key={suggestion.text}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.06 }}
              >
                <Card
                  className={`cursor-pointer ${bt.cardBorder} ${bt.cardBg} transition-all duration-300 hover:border-blue-200 hover:shadow-md hover:-translate-y-1`}
                  onClick={() => handleSuggestionClick(suggestion.text, suggestion.industry)}
                >
                  <CardContent className="flex h-full flex-col gap-2 p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{suggestion.icon}</span>
                      <Badge variant="secondary" className={`ml-auto ${bt.badgeBorder} ${bt.badgeBg} text-xs ${bt.badgeText}`}>
                        {INDUSTRY_OPTIONS.find(o => o.id === suggestion.industry)?.label.split(' ')[0]}
                      </Badge>
                    </div>
                    <span className={`text-sm leading-relaxed ${bt.optText} line-clamp-3`}>{suggestion.text}</span>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Templates section */}
        <TemplatesSection />
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
    builderPrompt, builderIndustry, builderStyle, builderLanguage,
    builderAdvancedOptions, builderAdvancedUnlocked,
    setGeneratedPages, setGeneratedSiteName,
    setCurrentPreviewPage, setIsGenerating, setBuilderPhase,
    setGenerationProgress, setGenerationStatus,
    generationStatus,
    addChatEntry,
  } = useAppStore()
  const t = useTranslation()
  const bt = useBuilderTheme()

  // Determine which core pages to generate based on pageConfigs
  const pagesToGenerate = CORE_PAGE_ORDER.filter(cp =>
    builderAdvancedOptions.pageConfigs.find(pc => pc.id === cp.id && pc.enabled)
  )

  const [pageStates, setPageStates] = useState<PageGenState[]>(
    pagesToGenerate.map(p => ({ id: p.id, name: p.name, status: 'pending' }))
  )
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [parsedPrompt, setParsedPrompt] = useState<{
    hexColors: string[]; themeKeywords: string[]; requiredElements: string[];
    animations: string[]; subIndustry?: string; isSinglePage: boolean;
  } | null>(null)
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
          // Build request body — only include advanced options if the user explicitly unlocked them
          // When locked, we send NO advanced options so the AI doesn't get confused by default values
          const advancedOpts = builderAdvancedUnlocked ? {
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
            brandName: builderAdvancedOptions.brandName,
            logoPlacement: builderAdvancedOptions.logoPlacement,
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
            pageConfigs: builderAdvancedOptions.pageConfigs,
          } : undefined;

          const requestBody = {
            prompt: builderPrompt,
            industry: builderIndustry,
            style: builderStyle,
            language: builderLanguage,
            page: pageInfo.id,
            siteName: builderAdvancedUnlocked && builderAdvancedOptions.brandName ? builderAdvancedOptions.brandName : undefined,
            // Advanced options only included if user explicitly unlocked them
            advancedOptions: advancedOpts,
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

          // The server streams events via SSE: parsed → delta (live) → result → done/error
          const reader = startRes.body!.getReader()
          const decoder = new TextDecoder()
          let buffer = ''
          let pageResult: any = null
          let streamError: string | null = null
          let streamedChars = 0
          const genStart = Date.now()

          streamLoop: while (true) {
            const { done, value } = await reader.read()
            if (done) break
            if (cancelled || cancelRef.current) {
              try { reader.cancel() } catch {}
              return
            }
            buffer += decoder.decode(value, { stream: true })

            let delim: RegExpMatchArray | null
            while ((delim = buffer.match(/\r?\n\r?\n/)) !== null) {
              const rawEvent = buffer.slice(0, delim.index!)
              buffer = buffer.slice(delim.index! + delim[0].length)

              let ev = 'message'
              const dataLines: string[] = []
              for (const line of rawEvent.split(/\r?\n/)) {
                if (line.startsWith('event:')) ev = line.slice(6).trim()
                else if (line.startsWith('data:')) dataLines.push(line.slice(5).trim())
              }
              if (dataLines.length === 0) continue
              const dataStr = dataLines.join('\n')
              let data: any
              try { data = JSON.parse(dataStr) } catch { data = dataStr }

              switch (ev) {
                case 'parsed':
                  if (!parsedPrompt) setParsedPrompt(data)
                  break
                case 'delta':
                  streamedChars += (data?.chunk?.length) || 0
                  setGenerationStatus(`Generating ${pageInfo.name}… (${streamedChars} chars, ${Math.round((Date.now() - genStart) / 1000)}s)`)
                  break
                case 'result':
                  pageResult = data
                  break streamLoop
                case 'error':
                  streamError = (data?.message || data?.error || 'Generation failed')
                  break streamLoop
                case 'done':
                  break streamLoop
                default:
                  break
              }
            }
          }

          if (cancelled || cancelRef.current) return

          if (streamError) {
            throw new Error(streamError)
          }
          if (!pageResult?.result?.page?.html) {
            throw new Error('AI returned no HTML')
          }

          if (pageResult.result.siteName && !siteName) siteName = pageResult.result.siteName

          const completed: PageGenState = {
            id: pageInfo.id,
            name: pageResult.result.page.name || pageInfo.name,
            status: 'done',
            html: pageResult.result.page.html,
            css: pageResult.result.page.css || '',
            js: pageResult.result.page.js || '',
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
      // Add chat entry for this generation
      const siteNameFinal = siteName || builderAdvancedOptions.brandName || 'Untitled Site'
      addChatEntry({
        id: `chat-${Date.now()}`,
        title: siteNameFinal,
        prompt: builderPrompt,
        timestamp: Date.now(),
      })
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
    <div className={`relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-4 ${bt.pageBg}`}>
      {/* Subtle dot grid */}
      <div className={`absolute inset-0 ${bt.dotGridOpacity} pointer-events-none`} style={{
        backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.15) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }} />

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
            <div className="absolute inset-0 rounded-full border-2 border-blue-300/40" />
            <div className="absolute inset-2 rounded-full border-2 border-blue-200/30" style={{ animationDirection: 'reverse' }} />
            <div className="absolute inset-4 rounded-full border-2 border-emerald-300/30" />
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ rotate: hasError ? 0 : -360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            >
              {hasError ? <AlertCircle className="h-8 w-8 text-red-400" /> : <Sparkles className="h-8 w-8 text-blue-700" />}
            </motion.div>
          </motion.div>
        </div>

        {/* Title */}
        <div className="mb-8 text-center">
          <h2 className={`mb-2 text-2xl font-bold ${bt.text}`}>
            {hasError ? 'Generation hit an error' : 'Generating your website'}
          </h2>
          <p className={`text-sm ${bt.textMuted}`}>
            {hasError
              ? 'One of the pages failed. You can retry from the prompt, or cancel.'
              : `AI is crafting ${pagesToGenerate.length} complete pages sequentially — this takes ~4-6 minutes total`
            }
          </p>
        </div>

        {/* Parsed prompt summary — shows what the AI detected from user's prompt */}
        {parsedPrompt && !hasError && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`mb-6 rounded-md border ${bt.cardBorder} ${bt.cardBg} p-4 text-left`}
          >
            <div className={`mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wider ${bt.textMuted}`}>
              <Sparkles className="h-3 w-3 text-blue-700" />
              Detected from your prompt
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {parsedPrompt.hexColors.length > 0 && (
                <div>
                  <div className="mb-1.5 text-[10px] uppercase tracking-wider text-gray-500">Colors</div>
                  <div className="flex flex-wrap gap-1.5">
                    {parsedPrompt.hexColors.map(c => (
                      <div key={c} className={`flex items-center gap-1 rounded-md border ${bt.cardBorder} ${bt.optBg} px-2 py-1`}>
                        <div className="h-3 w-3 rounded-sm border border-gray-300" style={{ background: c }} />
                        <span className="text-[10px] font-mono text-gray-700">{c}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {parsedPrompt.themeKeywords.length > 0 && (
                <div>
                  <div className="mb-1.5 text-[10px] uppercase tracking-wider text-gray-500">Theme</div>
                  <div className="flex flex-wrap gap-1.5">
                    {parsedPrompt.themeKeywords.map(t => (
                      <span key={t} className={`rounded-md border ${bt.infoBorder} ${bt.infoBg} px-2 py-1 text-[10px] ${bt.infoText}`}>{t}</span>
                    ))}
                  </div>
                </div>
              )}
              {parsedPrompt.requiredElements.length > 0 && (
                <div>
                  <div className="mb-1.5 text-[10px] uppercase tracking-wider text-gray-500">Required Elements</div>
                  <div className="flex flex-wrap gap-1.5">
                    {parsedPrompt.requiredElements.map(e => (
                      <span key={e} className={`rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] ${bt.doneText}`}>{e}</span>
                    ))}
                  </div>
                </div>
              )}
              {parsedPrompt.animations.length > 0 && (
                <div>
                  <div className="mb-1.5 text-[10px] uppercase tracking-wider text-gray-500">Animations</div>
                  <div className="flex flex-wrap gap-1.5">
                    {parsedPrompt.animations.map(a => (
                      <span key={a} className="rounded-md border border-pink-200 bg-pink-50 px-2 py-1 text-[10px] text-pink-700">{a}</span>
                    ))}
                  </div>
                </div>
              )}
              {parsedPrompt.subIndustry && (
                <div>
                  <div className="mb-1.5 text-[10px] uppercase tracking-wider text-gray-500">Industry Sub-context</div>
                  <span className="rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-[10px] text-amber-700">{parsedPrompt.subIndustry}</span>
                </div>
              )}
              {parsedPrompt.isSinglePage && (
                <div>
                  <div className="mb-1.5 text-[10px] uppercase tracking-wider text-gray-500">Mode</div>
                  <span className="rounded-md border border-blue-200 bg-blue-50 px-2 py-1 text-[10px] text-blue-700">Single-page site</span>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Progress bar */}
        <div className="mb-6">
          <Progress
            value={hasError ? 100 : (doneCount / pagesToGenerate.length) * 100}
            className={`h-2 ${bt.pageBgAlt} [&>[data-slot=progress-indicator]]:bg-blue-700 ${hasError ? '[&>[data-slot=progress-indicator]]:bg-red-500' : ''}`}
          />
          <div className="mt-2 flex justify-between text-xs text-gray-500">
            <span className={bt.textMuted}>{doneCount}/{pagesToGenerate.length} pages done</span>
            <span className={bt.textMuted}>{formatTime(elapsedSeconds)} elapsed</span>
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
                className={`flex items-center gap-3 rounded-md border p-3 transition-all duration-500 ${
                  isError
                    ? `${bt.errorBorder} ${bt.errorBg}`
                    : isDone
                    ? `${bt.doneBorder} ${bt.doneBg}`
                    : isGenerating
                    ? `${bt.generatingBorder} ${bt.generatingBg}`
                    : `${bt.cardBorder} ${bt.pageBgAlt}`
                }`}
              >
                <div className={`flex h-8 w-8 items-center justify-center rounded-md ${
                  isError ? `bg-red-100 text-red-600`
                  : isDone ? `bg-emerald-100 text-emerald-600`
                  : isGenerating ? `bg-blue-100 text-blue-600`
                  : `bg-gray-100 text-gray-400`
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
                    isError ? bt.errorText
                    : isDone ? bt.doneText
                    : isGenerating ? bt.text
                    : bt.textDim
                  }`}>
                    {page.name}{t('builder.pageSuffix')}
                  </span>
                  {isError && page.error && (
                    <p className="text-xs text-red-500/70 mt-0.5 line-clamp-1">{page.error}</p>
                  )}
                  {isGenerating && (
                    <p className={`text-xs ${bt.generatingText}/70 mt-0.5`}>{t('builder.aiWriting')}</p>
                  )}
                  {isDone && (
                    <p className={`text-xs ${bt.doneText}/70 mt-0.5`}>
                      {page.html ? t('builder.kbGenerated', { n: (page.html.length / 1024).toFixed(1) }) : t('builder.ready')}
                    </p>
                  )}
                </div>
                {isDone && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-emerald-600">✓</motion.span>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Action buttons */}
        <div className="flex justify-center gap-3">
          {hasError ? (
            <Button onClick={handleRetry} className="bg-blue-700 text-white hover:bg-blue-800 shadow-none border-0 rounded-md">
              <RefreshCw className="mr-2 h-4 w-4" /> Back to prompt
            </Button>
          ) : null}
          <Button
            variant="ghost"
            onClick={handleCancel}
            className={`${bt.textDim} ${bt.hoverText} ${bt.hoverBg}`}
          >
            <X className="mr-2 h-4 w-4" />
            {t('builder.cancelGeneration')}
          </Button>
        </div>

        {/* Live status line */}
        {!hasError && (
          <p className={`mt-6 text-center text-xs ${bt.textDim}`}>
            {generationStatus || t('builder.initializing')}
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

function PreviewPhase({ sidebarOpen }: { sidebarOpen: boolean }) {
  const {
    generatedPages, generatedSiteName,
    currentPreviewPage, setCurrentPreviewPage,
    setBuilderPhase, builderPrompt,
    navigate, addProject,
        builderIndustry, builderStyle,
    builderAdvancedOptions,
    builderMode, selectedTemplateHtml,
    addChatEntry, setGeneratedPages,
  } = useAppStore()
  const t = useTranslation()

  const bt = useBuilderTheme()
  // Builder UI is always light theme — the preview iframe content has its own styling
  // isLight controls the builder chrome (toolbar, sidebar, etc.), not the generated site
  const isLight = true

  // Mobile sidebar state (drawer on small screens)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  // Dynamic classes — theme-aware for builder UI
  const th = {
    bg: bt.cardBg,
    bgAlt: bt.pageBgAlt,
    bgAlt2: bt.isDark ? 'bg-zinc-700' : 'bg-gray-100',
    text: bt.text,
    textMuted: bt.textMuted,
    textDim: bt.textDim,
    textBright: bt.textBright,
    textSub: bt.textSub,
    border: bt.cardBorder,
    borderSub: bt.borderSub,
    hover: bt.hoverBg,
    hoverText: bt.hoverText,
    activeBg: bt.infoBg,
    activeBorder: bt.infoBorder,
    activeText: bt.infoText,
    separator: bt.separator,
  }

  const [deviceSize, setDeviceSize] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Template mode: use the template HTML directly
  const isTemplateMode = builderMode === 'templates' && selectedTemplateHtml

  const currentPage = isTemplateMode
    ? { id: 'template', name: t('builder.template'), route: '/', html: selectedTemplateHtml, css: '' }
    : generatedPages.find(p => p.id === currentPreviewPage) || generatedPages[0]
  const siteName = isTemplateMode ? t('builder.templatePreview') : (generatedSiteName || t('builder.untitledSite'))

  // Update iframe content when page changes
  useEffect(() => {
    if (iframeRef.current && currentPage) {
      iframeRef.current.srcdoc = currentPage.html
    }
  }, [currentPreviewPage, currentPage])

  const handleSaveProject = async () => {
    // Create a chat entry for this generation
    const chatId = `chat-${Date.now()}`
    addChatEntry({
      id: chatId,
      title: siteName,
      prompt: builderPrompt,
      timestamp: Date.now(),
      projectId: undefined,
    })

    // Persist the project to the database via the /api/projects endpoint.
    // The server resolves the authenticated user from the NextAuth session
    // cookie and stores the project under their account. This means the
    // project survives logout/login cycles and is tied to the user's email
    // rather than just their browser's localStorage.
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: siteName,
          description: builderPrompt,
          prompt: builderPrompt,
          industry: builderIndustry,
          theme: `${builderIndustry}-${builderStyle}`,
          framework: 'html',
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }))
        throw new Error(err.error || `HTTP ${res.status}`)
      }
      const data = await res.json()
      const saved = data.project
      // Mirror the saved project into the local Zustand store so the UI
      // updates immediately without waiting for a dashboard refetch.
      const project = {
        id: saved.id,
        name: saved.name,
        description: saved.description || undefined,
        prompt: saved.prompt || undefined,
        thumbnail: saved.thumbnail || '',
        status: saved.status,
        framework: saved.framework,
        theme: saved.theme,
        createdAt: saved.createdAt,
        updatedAt: saved.updatedAt,
      }
      addProject(project)

      // If we have generated pages, persist them as Page rows attached to
      // the new project. This preserves the actual HTML/CSS/JS the user
      // generated so it can be re-opened from the dashboard later.
      if (generatedPages.length > 0) {
        const primary = generatedPages[0]
        try {
          await fetch(`/api/projects/${saved.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              // Save thumbnail as a tiny preview snapshot (first 200 chars)
              thumbnail: primary.html.slice(0, 200),
              // Persist the full generated HTML/CSS/JS of the home page
              pageName: primary.name,
              pageHtml: primary.html,
              pageCss: primary.css,
              pageJs: primary.js,
            }),
          })
        } catch {
          // Non-fatal: page content update is best-effort.
        }
      }

      toast({ title: t('builder.preview.saved'), description: t('builder.preview.savedDesc', { name: siteName }) })
    } catch (err: any) {
      toast({
        title: 'Save failed',
        description: err?.message || 'Could not save project to your account',
        variant: 'destructive',
      })
    }
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
    toast({ title: t('builder.preview.exported'), description: t('builder.preview.exportedDesc', { name: currentPage.name }) })
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
    toast({ title: t('builder.preview.exportingAll'), description: t('builder.preview.exportingAllDesc', { n: generatedPages.length }) })
  }

  const handleRegenerate = () => {
    setBuilderPhase('prompt')
  }

    const handleEdit = () => {
    if (!currentPage) return
    // When editing a ready-made template, make sure its HTML is loaded into
    // generatedPages so the editor finds it by currentPreviewPage instead of
    // falling back to a generic default site.
    if (isTemplateMode && selectedTemplateHtml) {
      setGeneratedPages([{
        id: 'template',
        name: t('builder.template'),
        route: '/',
        html: selectedTemplateHtml,
        css: '',
        js: '',
        status: 'draft',
        theme: 'light',
        framework: 'nextjs',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        thumbnail: null,
        description: null,
        prompt: null,
        industry: null,
      }])
    }
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
  const enabledSectionsCount = SECTION_TOGGLE_ITEMS.filter(item => (builderAdvancedOptions[item.key as keyof BuilderAdvancedOptions] as boolean) ?? false).length

  if (!currentPage) {
    return (
      <div className={`flex min-h-[100dvh] items-center justify-center ${th.bg} ${th.textMuted}`}>
        {t('builder.noPages')}
      </div>
    )
  }

  return (
    <div className={`flex h-[100dvh] flex-col ${th.bg}`}>
      {/* Top toolbar */}
      <div className={`flex items-center justify-between border-b ${th.border} ${th.bgAlt} px-2 sm:px-4 py-3`}>
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile sidebar toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileSidebarOpen(true)}
            className={`md:hidden min-h-[44px] min-w-[44px] ${th.textDim} ${th.hoverText} ${th.hover}`}
          >
            <PanelLeft className="h-5 w-5" />
          </Button>
          <Badge variant="secondary" className="border-emerald-200 bg-emerald-50 text-emerald-700">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            {t('common.ready')}
          </Badge>
          <span className={`text-sm font-semibold ${th.textBright} truncate max-w-[120px] sm:max-w-none`}>{siteName}</span>
          <span className={`hidden text-xs ${th.textDim} sm:inline`}>· {generatedPages.length} {t('builder.preview.pagesCount')} · {industryLabel} · {styleLabel}</span>
        </div>

        {/* Device toggle — hidden on mobile */}
        <div className={`hidden md:flex items-center gap-1 rounded-lg border ${th.border} bg-slate-50 p-1`}>
          {(Object.entries(DEVICE_SIZES) as [keyof typeof DEVICE_SIZES, typeof DEVICE_SIZES[keyof typeof DEVICE_SIZES]][]).map(([key, config]) => {
            const Icon = config.icon
            return (
              <Button
                key={key}
                variant={deviceSize === key ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setDeviceSize(key)}
                className={`h-8 px-2 ${deviceSize === key ? 'bg-white text-gray-900 shadow-sm' : `${th.textDim} ${th.hoverText}`}`}
              >
                <Icon className="h-4 w-4" />
              </Button>
            )
          })}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" size="sm" onClick={handleRegenerate} className={`${th.textDim} ${th.hoverText} ${th.hover} min-h-[44px]`}>
            <RefreshCw className="h-4 w-4 sm:mr-1 rtl:sm:ml-1 rtl:sm:mr-0" />
            <span className="hidden sm:inline">{t('builder.preview.regenerate')}</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={handleSaveProject} className={`hidden md:inline-flex ${th.textDim} ${th.hoverText} ${th.hover}`}>
            <Save className="mr-1 h-4 w-4 rtl:ml-1 rtl:mr-0" />
            <span className="hidden lg:inline">{t('builder.preview.save')}</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={handleExport} className={`hidden md:inline-flex ${th.textDim} ${th.hoverText} ${th.hover}`}>
            <Download className="mr-1 h-4 w-4 rtl:ml-1 rtl:mr-0" />
            <span className="hidden lg:inline">{t('builder.preview.export')}</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={handleExportAll} className="hidden md:inline-flex text-emerald-600/60 hover:text-emerald-700 hover:bg-emerald-50">
            <Rocket className="mr-1 h-4 w-4 rtl:ml-1 rtl:mr-0" />
            <span className="hidden lg:inline">{t('builder.preview.exportAll')}</span>
          </Button>
          <Button size="sm" onClick={handleEdit} className="bg-blue-700 text-white hover:bg-blue-800 shadow-none border-0 rounded-md min-h-[44px]">
            <Code2 className="mr-1 h-4 w-4 rtl:ml-1 rtl:mr-0" />
            {t('builder.preview.edit')}
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Mobile sidebar backdrop + drawer */}
        <AnimatePresence>
          {mobileSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/50 z-30 md:hidden"
                onClick={() => setMobileSidebarOpen(false)}
              />
              <motion.div
                initial={{ x: -256 }}
                animate={{ x: 0 }}
                exit={{ x: -256 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className={`fixed inset-y-0 left-0 z-40 md:hidden w-64 border-r ${th.border} ${th.bgAlt} p-4 overflow-y-auto`}
              >
                <div className="flex items-center justify-between mb-4">
                  <p className={`text-xs font-medium ${th.textDim} uppercase tracking-wider`}>{t('builder.preview.pages')}</p>
                  <button
                    onClick={() => setMobileSidebarOpen(false)}
                    className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-md ${th.hover} ${th.textDim}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-1">
                  {generatedPages.map((page, i) => {
                    const pageMeta = CORE_PAGE_ORDER[i]
                    const Icon = pageMeta?.icon || Layout
                    const isActive = currentPreviewPage === page.id
                    return (
                      <motion.button
                        key={page.id}
                        whileHover={{ x: 4 }}
                        onClick={() => { setCurrentPreviewPage(page.id); setMobileSidebarOpen(false) }}
                        className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-all ${
                          isActive
                            ? `${th.activeBg} ${th.text} border ${th.activeBorder}`
                            : `${th.textMuted} ${th.hover} ${th.hoverText}`
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <div className="flex-1">
                          <div className="font-medium">{page.name}</div>
                          <div className={`text-xs ${th.textDim}`}>{page.route}</div>
                        </div>
                        {page.html && (
                          <span className={`text-xs ${th.textSub}`}>{(page.html.length / 1024).toFixed(1)}K</span>
                        )}
                      </motion.button>
                    )
                  })}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Sidebar - Page navigation (desktop only) */}
        <div className={`hidden md:flex w-64 flex-col border-r ${th.border} ${th.bgAlt} p-4 overflow-y-auto`}>
          <div className="mb-4">
            <p className={`mb-2 text-xs font-medium ${th.textDim} uppercase tracking-wider`}>{t('builder.preview.pages')}</p>
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
                    className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-all ${
                      isActive
                        ? `${th.activeBg} ${th.text} border ${th.activeBorder}`
                        : `${th.textMuted} ${th.hover} ${th.hoverText}`
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <div className="flex-1">
                      <div className="font-medium">{page.name}</div>
                      <div className={`text-xs ${th.textDim}`}>{page.route}</div>
                    </div>
                    {page.html && (
                      <span className={`text-xs ${th.textSub}`}>{(page.html.length / 1024).toFixed(1)}K</span>
                    )}
                  </motion.button>
                )
              })}
            </div>
          </div>

          <div className={`mt-6 rounded-md border ${th.border} bg-slate-50 p-3`}>
            <p className={`mb-2 text-xs font-medium ${th.textDim} uppercase tracking-wider`}>{t('builder.preview.siteDetails')}</p>
            <div className={`space-y-2 text-xs ${th.textMuted}`}>
              <div className="flex justify-between">
                <span>{t('builder.preview.siteName')}</span>
                <span className={`${th.textBright} truncate ml-2 max-w-32`} title={siteName}>{siteName}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('builder.preview.industry')}</span>
                <span className={th.textBright}>{industryLabel}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('builder.preview.style')}</span>
                <span className={th.textBright}>{styleLabel}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('builder.preview.pagesCount')}</span>
                <span className={th.textBright}>{generatedPages.length}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('builder.preview.totalSize')}</span>
                <span className={th.textBright}>
                  {(generatedPages.reduce((sum, p) => sum + (p.html?.length || 0), 0) / 1024).toFixed(1)} KB
                </span>
              </div>
              <div className="flex justify-between">
                <span>{t('builder.preview.framework')}</span>
                <span className={th.textBright}>HTML/CSS</span>
              </div>
              <Separator className={`${th.separator} my-2`} />
              <div className="flex justify-between">
                <span>{t('builder.preview.complexity')}</span>
                <span className={th.textBright}>{complexityLabel}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('builder.preview.tone')}</span>
                <span className={th.textBright}>{toneLabel}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('builder.preview.density')}</span>
                <span className={th.textBright}>{densityLabel}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('builder.preview.seo')}</span>
                <span className={th.textBright}>{seoLabel}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('builder.preview.accessibility')}</span>
                <span className={th.textBright}>{accessibilityLabel}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('builder.preview.sections')}</span>
                <span className={th.textBright}>{enabledSectionsCount}/{SECTION_TOGGLE_ITEMS.length}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('builder.preview.font')}</span>
                <span className={`${th.textBright} truncate ml-2 max-w-32`}>{builderAdvancedOptions.fontFamily}</span>
              </div>
              <Separator className={`${th.separator} my-2`} />
              <div className="flex gap-1.5 mt-1">
                {Object.entries(builderAdvancedOptions.colorScheme).map(([key, color]) => (
                  <TooltipProvider key={key}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className={`h-5 w-5 rounded border border-gray-300 cursor-pointer`} style={{ backgroundColor: color }} />
                      </TooltipTrigger>
                      <TooltipContent className="bg-white border-gray-200 text-xs text-gray-500">
                        {key}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </div>
          </div>

          <div className={`mt-4 rounded-md border ${bt.cardBorder} ${bt.pageBgAlt} p-3`}>
            <p className={`mb-2 text-xs font-medium ${th.textDim} uppercase tracking-wider`}>{t('builder.preview.prompt')}</p>
            <p className={`text-xs ${th.textMuted} leading-relaxed line-clamp-6`}>{builderPrompt}</p>
          </div>

          {/* Phase 4: Industry Image Library — collapsible */}
          <div className={`mt-4 rounded-md border ${bt.infoBorder} ${bt.infoBg} overflow-hidden`}>
            <details>
              <summary className={`cursor-pointer px-3 py-2 text-xs font-medium ${bt.infoText}/70 uppercase tracking-wider hover:bg-blue-100/50 flex items-center gap-2`}>
                <Layers className="w-3 h-3" />
                {t('p4.title')}
              </summary>
              <div className={`p-3 pt-2 border-t border-gray-200`}>
                <IndustryGallery
                  compact
                  disableGeneration={false}
                  autoLoad={false}
                />
              </div>
            </details>
          </div>

          {/* Phase 5: Animation Library — collapsible */}
          <div className={`mt-3 rounded-md border ${bt.infoBorder} ${bt.infoBg} overflow-hidden`}>
            <details>
              <summary className={`cursor-pointer px-3 py-2 text-xs font-medium ${bt.infoText}/70 uppercase tracking-wider hover:bg-blue-100/50 flex items-center gap-2`}>
                <Sparkles className="w-3 h-3" />
                {t('p5.title')}
              </summary>
              <div className={`p-3 pt-3 border-t border-gray-200`}>
                <AnimationShowcase compact />
              </div>
            </details>
          </div>
        </div>

        {/* Preview area */}
        <div className={`flex flex-1 items-center justify-center bg-slate-50 p-4 overflow-auto`}>
          <motion.div
            layout
            className={`relative overflow-hidden rounded-md border ${bt.cardBorder} shadow-lg`}
            style={{ width: iframeWidth, maxWidth: '100%', height: deviceSize === 'mobile' ? '667px' : deviceSize === 'tablet' ? '1024px' : 'calc(100vh - 120px)' }}
          >
            {/* Browser chrome */}
            <div className={`flex items-center gap-2 ${th.bgAlt2} px-3 py-2 border-b ${th.borderSub}`}>
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
                <div className="h-3 w-3 rounded-full bg-[#28c840]" />
              </div>
              <div className="flex-1 mx-4">
                <div className={`flex items-center gap-1 rounded-md bg-gray-100 px-3 py-1`}>
                  <Lock className={`h-3 w-3 ${th.textSub}`} />
                  <span className={`text-xs ${th.textDim} truncate`}>
                    {siteName.toLowerCase().replace(/\s+/g, '-')}.app{currentPage.route === '/' ? '' : currentPage.route}
                  </span>
                </div>
              </div>
              <span className={`text-xs ${th.textDim}`}>{currentPage.name}</span>
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

// ─── Chat Sidebar (ChatGPT-like) ──────────────────────────────────────────

function ChatSidebar({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) {
  const chatHistory = useAppStore((s) => s.chatHistory)
  const activeChatId = useAppStore((s) => s.activeChatId)
  const setActiveChatId = useAppStore((s) => s.setActiveChatId)
  const clearChatHistory = useAppStore((s) => s.clearChatHistory)
  const builderStyle = useAppStore((s) => s.builderStyle)
  const t = useTranslation()
  const bt = useBuilderTheme()

  return (
    <>
      {/* Toggle button (always visible, positioned on the left edge) */}
      <button
        onClick={onToggle}
        className={`fixed top-3 left-3 z-50 h-11 w-11 rounded-md border ${bt.cardBorder} ${bt.cardBg} ${bt.text} flex items-center justify-center transition-all hover:opacity-80`}
        title={isOpen ? t('builder.closeSidebar') : t('builder.openSidebar')}
      >
        <MessageSquare className="h-5 w-5" />
      </button>

      {/* Sidebar panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop overlay on mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-30 lg:hidden"
              onClick={onToggle}
            />
            <motion.div
              initial={{ x: -260, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -260, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className={`fixed inset-y-0 left-0 z-40 w-[260px] ${bt.cardBg} border-r flex flex-col`}
            >
            {/* Header */}
            <div className={`flex items-center justify-between px-4 py-3 border-b ${bt.cardBorder}`}>
              <div className="flex items-center gap-2">
                <MessageSquare className={`h-4 w-4 ${bt.textDim}`} />
                <span className={`text-sm font-semibold ${bt.text}`}>{t('builder.chatHistory')}</span>
              </div>
              <div className="flex items-center gap-1">
                {chatHistory.length > 0 && (
                  <button
                    onClick={clearChatHistory}
                    className={`h-6 w-6 rounded ${bt.hoverBg} ${bt.textDim} flex items-center justify-center`}
                    title={t('builder.clearHistory')}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  onClick={onToggle}
                  className={`h-6 w-6 rounded ${bt.hoverBg} ${bt.textDim} flex items-center justify-center`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Chat list */}
            <div className="flex-1 overflow-y-auto px-2 py-2">
              {chatHistory.length === 0 ? (
                <div className={`flex flex-col items-center justify-center py-8 ${bt.textDim}`}>
                  <MessageSquare className="h-8 w-8 mb-2 opacity-30" />
                  <p className="text-xs text-center">{t('builder.noChatHistory')}</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {chatHistory.map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => setActiveChatId(chat.id)}
                      className={`flex flex-col w-full rounded-md px-3 py-2.5 text-left transition-all ${
                        activeChatId === chat.id ? `${bt.infoBg} ${bt.infoText}` : bt.hoverBg
                      }`}
                    >
                      <span className={`text-sm font-medium truncate ${activeChatId === chat.id ? '' : bt.textDim}`}>
                        {chat.title}
                      </span>
                      <span className={`text-xs mt-0.5 truncate ${bt.textDim}`}>
                        {chat.prompt.slice(0, 60)}{chat.prompt.length > 60 ? '...' : ''}
                      </span>
                      <span className={`text-[10px] mt-1 ${bt.textSub}`}>
                        {new Date(chat.timestamp).toLocaleDateString()} · {new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* New chat button */}
            <div className={`px-3 py-3 border-t ${bt.cardBorder}`}>
              <button
                onClick={() => {
                  useAppStore.getState().setBuilderPhase('prompt')
                  useAppStore.getState().setBuilderPrompt('')
                  setActiveChatId(null)
                }}
                className={`flex items-center gap-2 w-full rounded-md px-3 py-2 text-sm font-medium transition-all bg-blue-700 text-white hover:bg-blue-800`}
              >
                <Plus className="h-4 w-4" />
                {t('builder.newChat')}
              </button>
            </div>
          </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function BuilderPage() {
  const { builderPhase, builderStyle } = useAppStore()
  const t = useTranslation()
  const bt = useBuilderTheme()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Builder UI is always light theme
  const wrapperBg = `min-h-[100dvh] ${bt.pageBgAlt}`

  const toggleSidebar = useCallback(() => setSidebarOpen((v) => !v), [])

  return (
    <>
      {/* Chat sidebar — always rendered, toggleable */}
      <ChatSidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

      <AnimatePresence mode="wait">
        <motion.div
          key={builderPhase}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={wrapperBg}
        >
          {builderPhase === 'prompt' && <PromptPhase />}
          {builderPhase === 'generating' && <GeneratingPhase />}
          {builderPhase === 'preview' && <PreviewPhase sidebarOpen={sidebarOpen} />}
          {builderPhase === 'edit' && (
            <div className={`flex min-h-[100dvh] items-center justify-center ${bt.pageBgAlt}`}>
              <div className="text-center">
                <Loader2 className={`h-8 w-8 animate-spin text-blue-700 mx-auto mb-4`} />
                <p className={bt.textMuted}>{t('builder.transitioning')}</p>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </>
  )
}
