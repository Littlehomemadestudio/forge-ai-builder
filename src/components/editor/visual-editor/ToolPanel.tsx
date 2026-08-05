// ─── Slide-Out Tool Panels ──────────────────────────────────────────────
// Production-grade studio panel with categorized content, debounced search,
// framer-motion slide animation, dark mode, and real HTML templates.
// Width: 260px. Each tool shows its own specialized panel.

'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  // Sections
  LayoutTemplate, Heading1, Columns3, CreditCard, MessageSquareQuote,
  ArrowRight, Mail, Rows3, Star, HelpCircle, BarChart3,
  // Components
  Type, Heading2, Pilcrow, Quote, SquareMousePointer, FormInput, TextCursorInput,
  RectangleHorizontal, Columns2, Minus, MoveVertical,
  Image as ImageIcon, Video, Smile,
  // Media
  Upload, Search,
  // Layers
  ListTree, ChevronRight, ChevronDown, Eye, EyeOff,
  // AI
  Sparkles, Wand2, Lightbulb,
  // Pages
  Globe, Plus, Trash2, FileText,
  // Brand
  Palette, Type as TypeIcon,
  // Settings
  Settings2, Grid3x3, Magnet, Save,
  // Common
  Layers, FolderOpen, GripVertical, X, Check,
} from 'lucide-react'
import { COLORS, RADIUS, DARK_COLORS } from './design-tokens'
import { useAccessibility } from './AccessibilityContext'

// ─── Types ──────────────────────────────────────────────────────────────

export interface ToolPanelItem {
  id: string
  label: string
  description?: string
  icon?: React.ReactNode
  html?: string
  badge?: string
  category?: string
  variant?: string
}

export interface ToolPanelProps {
  activeTool: string
  onInsert: (html: string, label: string) => void
  darkMode?: boolean
  htmlContent?: string
}

// ─── Debounce hook ──────────────────────────────────────────────────────

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = React.useState(value)
  React.useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

// ─── Section templates with variants ────────────────────────────────────

const SECTION_CATEGORIES: { name: string; icon: React.ReactNode; items: ToolPanelItem[] }[] = [
  {
    name: 'Hero',
    icon: <Heading1 size={14} />,
    items: [
      {
        id: 'hero-centered', label: 'Hero Centered', category: 'Hero', variant: 'Centered',
        icon: <Heading1 size={14} />,
        html: `<section style="padding:80px 24px;text-align:center;max-width:900px;margin:0 auto">
  <h1 style="font-size:52px;font-weight:800;color:#111827;margin:0 0 20px;line-height:1.08;letter-spacing:-0.02em">Build something remarkable</h1>
  <p style="font-size:20px;color:#6B7280;margin:0 auto 40px;max-width:600px;line-height:1.5">Start creating with the most powerful visual editor. No code needed.</p>
  <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
    <a href="#" style="display:inline-block;background:#2563EB;color:#fff;font-weight:600;font-size:16px;padding:14px 36px;border-radius:10px;text-decoration:none;box-shadow:0 1px 2px rgba(37,99,235,0.3)">Get started free</a>
    <a href="#" style="display:inline-block;background:transparent;color:#374151;font-weight:600;font-size:16px;padding:14px 36px;border-radius:10px;text-decoration:none;border:1px solid #D1D5DB">Watch demo</a>
  </div>
</section>`,
      },
      {
        id: 'hero-split', label: 'Hero Split', category: 'Hero', variant: 'Split',
        icon: <Heading1 size={14} />,
        html: `<section style="padding:80px 48px;max-width:1200px;margin:0 auto;display:flex;align-items:center;gap:64px">
  <div style="flex:1;min-width:0">
    <div style="display:inline-block;background:#EFF6FF;color:#2563EB;font-size:13px;font-weight:600;padding:6px 14px;border-radius:999px;margin-bottom:20px">New release</div>
    <h1 style="font-size:48px;font-weight:800;color:#111827;margin:0 0 20px;line-height:1.1;letter-spacing:-0.02em">Design at the speed of thought</h1>
    <p style="font-size:18px;color:#6B7280;margin:0 0 32px;line-height:1.6">A modern editor that adapts to your workflow. Build, iterate, and ship faster than ever.</p>
    <a href="#" style="display:inline-block;background:#2563EB;color:#fff;font-weight:600;font-size:16px;padding:14px 32px;border-radius:10px;text-decoration:none">Start building &rarr;</a>
  </div>
  <div style="flex:1;min-width:0;display:flex;justify-content:center">
    <div style="width:380px;height:280px;background:linear-gradient(135deg,#EFF6FF,#DBEAFE);border-radius:16px;display:flex;align-items:center;justify-content:center;color:#93C5FD;font-size:48px">&#9889;</div>
  </div>
</section>`,
      },
      {
        id: 'hero-minimal', label: 'Hero Minimal', category: 'Hero', variant: 'Minimal',
        icon: <Heading1 size={14} />,
        html: `<section style="padding:120px 24px 80px;text-align:center;max-width:720px;margin:0 auto">
  <h1 style="font-size:56px;font-weight:300;color:#111827;margin:0 0 24px;line-height:1.15;letter-spacing:-0.03em">Simple is powerful.</h1>
  <p style="font-size:18px;color:#9CA3AF;margin:0 auto 40px;line-height:1.6">Less noise. More impact.</p>
  <a href="#" style="color:#2563EB;font-weight:600;font-size:16px;text-decoration:none;border-bottom:2px solid #2563EB;padding-bottom:2px">Learn more</a>
</section>`,
      },
    ],
  },
  {
    name: 'Features',
    icon: <Columns3 size={14} />,
    items: [
      {
        id: 'features-grid', label: 'Features Grid', category: 'Features', variant: 'Grid',
        icon: <Columns3 size={14} />,
        html: `<section style="padding:80px 24px;max-width:1100px;margin:0 auto">
  <div style="text-align:center;margin-bottom:56px">
    <h2 style="font-size:36px;font-weight:700;color:#111827;margin:0 0 12px;letter-spacing:-0.02em">Everything you need</h2>
    <p style="font-size:18px;color:#6B7280;margin:0;max-width:520px;margin:0 auto">Powerful features to help you build faster and smarter.</p>
  </div>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:32px">
    <div style="text-align:center">
      <div style="width:52px;height:52px;background:#EFF6FF;border-radius:14px;display:flex;align-items:center;justify-content:center;margin:0 auto 18px;font-size:24px">&#9889;</div>
      <h3 style="font-size:18px;font-weight:600;color:#111827;margin:0 0 8px">Lightning Fast</h3>
      <p style="font-size:14px;color:#6B7280;line-height:1.6;margin:0">Optimized performance that keeps your site blazing fast.</p>
    </div>
    <div style="text-align:center">
      <div style="width:52px;height:52px;background:#F0FDF4;border-radius:14px;display:flex;align-items:center;justify-content:center;margin:0 auto 18px;font-size:24px">&#128274;</div>
      <h3 style="font-size:18px;font-weight:600;color:#111827;margin:0 0 8px">Secure by Default</h3>
      <p style="font-size:14px;color:#6B7280;line-height:1.6;margin:0">Enterprise-grade security built into every layer.</p>
    </div>
    <div style="text-align:center">
      <div style="width:52px;height:52px;background:#FEF3C7;border-radius:14px;display:flex;align-items:center;justify-content:center;margin:0 auto 18px;font-size:24px">&#127912;</div>
      <h3 style="font-size:18px;font-weight:600;color:#111827;margin:0 0 8px">Beautiful Design</h3>
      <p style="font-size:14px;color:#6B7280;line-height:1.6;margin:0">Stunning templates that make your brand stand out.</p>
    </div>
    <div style="text-align:center">
      <div style="width:52px;height:52px;background:#F5F3FF;border-radius:14px;display:flex;align-items:center;justify-content:center;margin:0 auto 18px;font-size:24px">&#128640;</div>
      <h3 style="font-size:18px;font-weight:600;color:#111827;margin:0 0 8px">AI Powered</h3>
      <p style="font-size:14px;color:#6B7280;line-height:1.6;margin:0">Smart suggestions that learn from your design style.</p>
    </div>
    <div style="text-align:center">
      <div style="width:52px;height:52px;background:#FFF7ED;border-radius:14px;display:flex;align-items:center;justify-content:center;margin:0 auto 18px;font-size:24px">&#128260;</div>
      <h3 style="font-size:18px;font-weight:600;color:#111827;margin:0 0 8px">Auto Save</h3>
      <p style="font-size:14px;color:#6B7280;line-height:1.6;margin:0">Never lose your work with real-time auto saving.</p>
    </div>
    <div style="text-align:center">
      <div style="width:52px;height:52px;background:#F0F9FF;border-radius:14px;display:flex;align-items:center;justify-content:center;margin:0 auto 18px;font-size:24px">&#127760;</div>
      <h3 style="font-size:18px;font-weight:600;color:#111827;margin:0 0 8px">Global CDN</h3>
      <p style="font-size:14px;color:#6B7280;line-height:1.6;margin:0">Deploy worldwide with one click. Edge-ready.</p>
    </div>
  </div>
</section>`,
      },
      {
        id: 'features-cards', label: 'Features Cards', category: 'Features', variant: 'Cards',
        icon: <Columns3 size={14} />,
        html: `<section style="padding:80px 24px;max-width:1100px;margin:0 auto">
  <h2 style="font-size:36px;font-weight:700;color:#111827;text-align:center;margin:0 0 48px;letter-spacing:-0.02em">Why choose us</h2>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px">
    <div style="border:1px solid #E5E7EB;border-radius:16px;padding:32px;transition:box-shadow 0.2s">
      <div style="width:44px;height:44px;background:#EFF6FF;border-radius:12px;display:flex;align-items:center;justify-content:center;margin-bottom:20px;font-size:22px">&#9889;</div>
      <h3 style="font-size:18px;font-weight:600;color:#111827;margin:0 0 10px">Speed First</h3>
      <p style="font-size:14px;color:#6B7280;line-height:1.6;margin:0">Sub-second load times with optimized asset delivery.</p>
    </div>
    <div style="border:1px solid #E5E7EB;border-radius:16px;padding:32px">
      <div style="width:44px;height:44px;background:#F0FDF4;border-radius:12px;display:flex;align-items:center;justify-content:center;margin-bottom:20px;font-size:22px">&#128274;</div>
      <h3 style="font-size:18px;font-weight:600;color:#111827;margin:0 0 10px">Bank-level Security</h3>
      <p style="font-size:14px;color:#6B7280;line-height:1.6;margin:0">SOC2 compliant with end-to-end encryption.</p>
    </div>
    <div style="border:1px solid #E5E7EB;border-radius:16px;padding:32px">
      <div style="width:44px;height:44px;background:#FEF3C7;border-radius:12px;display:flex;align-items:center;justify-content:center;margin-bottom:20px;font-size:22px">&#127912;</div>
      <h3 style="font-size:18px;font-weight:600;color:#111827;margin:0 0 10px">Pixel Perfect</h3>
      <p style="font-size:14px;color:#6B7280;line-height:1.6;margin:0">Every detail matters. Control every pixel of your design.</p>
    </div>
  </div>
</section>`,
      },
    ],
  },
  {
    name: 'Testimonials',
    icon: <MessageSquareQuote size={14} />,
    items: [
      {
        id: 'testimonials-cards', label: 'Testimonial Cards', category: 'Testimonials', variant: 'Cards',
        icon: <MessageSquareQuote size={14} />,
        html: `<section style="padding:80px 24px;max-width:1000px;margin:0 auto">
  <h2 style="font-size:36px;font-weight:700;color:#111827;text-align:center;margin:0 0 48px;letter-spacing:-0.02em">Loved by creators</h2>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px">
    <div style="background:#F9FAFB;border-radius:16px;padding:28px">
      <div style="display:flex;gap:2px;margin-bottom:14px;color:#F59E0B">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
      <p style="font-size:15px;color:#374151;line-height:1.6;margin:0 0 20px">"This completely changed how we approach design. Absolutely incredible."</p>
      <div style="display:flex;align-items:center;gap:10px">
        <div style="width:36px;height:36px;background:#DBEAFE;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:600;color:#2563EB">S</div>
        <div><div style="font-size:14px;font-weight:600;color:#111827">Sarah Chen</div><div style="font-size:12px;color:#9CA3AF">Designer at Acme</div></div>
      </div>
    </div>
    <div style="background:#F9FAFB;border-radius:16px;padding:28px">
      <div style="display:flex;gap:2px;margin-bottom:14px;color:#F59E0B">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
      <p style="font-size:15px;color:#374151;line-height:1.6;margin:0 0 20px">"We shipped our new site in half the time. Best investment we made."</p>
      <div style="display:flex;align-items:center;gap:10px">
        <div style="width:36px;height:36px;background:#DCFCE7;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:600;color:#16A34A">M</div>
        <div><div style="font-size:14px;font-weight:600;color:#111827">Mike Johnson</div><div style="font-size:12px;color:#9CA3AF">CTO at Startup</div></div>
      </div>
    </div>
    <div style="background:#F9FAFB;border-radius:16px;padding:28px">
      <div style="display:flex;gap:2px;margin-bottom:14px;color:#F59E0B">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
      <p style="font-size:15px;color:#374151;line-height:1.6;margin:0 0 20px">"The AI suggestions are spooky good. It feels like magic."</p>
      <div style="display:flex;align-items:center;gap:10px">
        <div style="width:36px;height:36px;background:#FEF3C7;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:600;color:#D97706">A</div>
        <div><div style="font-size:14px;font-weight:600;color:#111827">Ana Rivera</div><div style="font-size:12px;color:#9CA3AF">Founder at Pixel</div></div>
      </div>
    </div>
  </div>
</section>`,
      },
      {
        id: 'testimonials-quote', label: 'Testimonial Quote', category: 'Testimonials', variant: 'Quote',
        icon: <MessageSquareQuote size={14} />,
        html: `<section style="padding:80px 24px;max-width:800px;margin:0 auto;text-align:center">
  <div style="font-size:64px;color:#DBEAFE;line-height:1;margin-bottom:12px">&ldquo;</div>
  <blockquote style="font-size:28px;font-weight:500;color:#111827;line-height:1.4;margin:0 0 32px;letter-spacing:-0.01em">This tool has fundamentally changed how our team works. We build twice as fast with half the effort.</blockquote>
  <div style="display:flex;align-items:center;justify-content:center;gap:12px">
    <div style="width:44px;height:44px;background:#DBEAFE;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:600;color:#2563EB">J</div>
    <div style="text-align:left"><div style="font-size:15px;font-weight:600;color:#111827">James Park</div><div style="font-size:13px;color:#9CA3AF">VP Engineering, TechCorp</div></div>
  </div>
</section>`,
      },
    ],
  },
  {
    name: 'Pricing',
    icon: <CreditCard size={14} />,
    items: [
      {
        id: 'pricing-3col', label: 'Pricing 3-Column', category: 'Pricing', variant: '3-col',
        icon: <CreditCard size={14} />,
        html: `<section style="padding:80px 24px;max-width:1100px;margin:0 auto">
  <div style="text-align:center;margin-bottom:56px">
    <h2 style="font-size:36px;font-weight:700;color:#111827;margin:0 0 12px;letter-spacing:-0.02em">Simple pricing</h2>
    <p style="font-size:18px;color:#6B7280;margin:0">No surprises. Cancel anytime.</p>
  </div>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;align-items:start">
    <div style="border:1px solid #E5E7EB;border-radius:16px;padding:36px">
      <h3 style="font-size:20px;font-weight:600;margin:0 0 8px;color:#111827">Starter</h3>
      <p style="font-size:14px;color:#6B7280;margin:0 0 28px">Perfect for individuals</p>
      <div style="font-size:40px;font-weight:800;color:#111827;margin:0 0 28px">$9<span style="font-size:16px;font-weight:400;color:#9CA3AF">/mo</span></div>
      <a href="#" style="display:block;text-align:center;background:#F3F4F6;color:#111827;font-weight:600;padding:12px;border-radius:10px;text-decoration:none;font-size:15px">Get started</a>
    </div>
    <div style="border:2px solid #2563EB;border-radius:16px;padding:36px;position:relative;box-shadow:0 4px 12px rgba(37,99,235,0.15)">
      <div style="position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:#2563EB;color:#fff;font-size:12px;font-weight:600;padding:4px 16px;border-radius:999px">Popular</div>
      <h3 style="font-size:20px;font-weight:600;margin:0 0 8px;color:#111827">Pro</h3>
      <p style="font-size:14px;color:#6B7280;margin:0 0 28px">For growing teams</p>
      <div style="font-size:40px;font-weight:800;color:#111827;margin:0 0 28px">$29<span style="font-size:16px;font-weight:400;color:#9CA3AF">/mo</span></div>
      <a href="#" style="display:block;text-align:center;background:#2563EB;color:#fff;font-weight:600;padding:12px;border-radius:10px;text-decoration:none;font-size:15px">Get started</a>
    </div>
    <div style="border:1px solid #E5E7EB;border-radius:16px;padding:36px">
      <h3 style="font-size:20px;font-weight:600;margin:0 0 8px;color:#111827">Enterprise</h3>
      <p style="font-size:14px;color:#6B7280;margin:0 0 28px">For organizations</p>
      <div style="font-size:40px;font-weight:800;color:#111827;margin:0 0 28px">$99<span style="font-size:16px;font-weight:400;color:#9CA3AF">/mo</span></div>
      <a href="#" style="display:block;text-align:center;background:#F3F4F6;color:#111827;font-weight:600;padding:12px;border-radius:10px;text-decoration:none;font-size:15px">Contact sales</a>
    </div>
  </div>
</section>`,
      },
      {
        id: 'pricing-minimal', label: 'Pricing Minimal', category: 'Pricing', variant: 'Minimal',
        icon: <CreditCard size={14} />,
        html: `<section style="padding:80px 24px;max-width:500px;margin:0 auto;text-align:center">
  <h2 style="font-size:36px;font-weight:700;color:#111827;margin:0 0 12px;letter-spacing:-0.02em">One plan. Everything.</h2>
  <p style="font-size:18px;color:#6B7280;margin:0 0 40px">No tiers. No limits. Just build.</p>
  <div style="border:1px solid #E5E7EB;border-radius:16px;padding:48px 32px">
    <div style="font-size:48px;font-weight:800;color:#111827;margin:0 0 8px">$19<span style="font-size:18px;font-weight:400;color:#9CA3AF">/mo</span></div>
    <p style="font-size:15px;color:#6B7280;margin:0 0 32px">Billed annually ($228/yr)</p>
    <a href="#" style="display:inline-block;background:#2563EB;color:#fff;font-weight:600;font-size:16px;padding:14px 40px;border-radius:10px;text-decoration:none">Start free trial</a>
    <div style="margin-top:24px;font-size:13px;color:#9CA3AF">No credit card required</div>
  </div>
</section>`,
      },
    ],
  },
  {
    name: 'CTA',
    icon: <ArrowRight size={14} />,
    items: [
      {
        id: 'cta-centered', label: 'CTA Centered', category: 'CTA', variant: 'Centered',
        icon: <ArrowRight size={14} />,
        html: `<section style="padding:80px 24px;text-align:center;background:linear-gradient(135deg,#111827,#1E293B);color:#fff">
  <h2 style="font-size:40px;font-weight:700;margin:0 0 16px;letter-spacing:-0.02em">Ready to get started?</h2>
  <p style="font-size:18px;color:#94A3B8;margin:0 auto 36px;max-width:480px">Join thousands of creators building amazing websites today.</p>
  <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
    <a href="#" style="display:inline-block;background:#2563EB;color:#fff;font-weight:600;font-size:16px;padding:14px 36px;border-radius:10px;text-decoration:none">Start for free</a>
    <a href="#" style="display:inline-block;background:rgba(255,255,255,0.1);color:#fff;font-weight:600;font-size:16px;padding:14px 36px;border-radius:10px;text-decoration:none">Talk to sales</a>
  </div>
</section>`,
      },
      {
        id: 'cta-banner', label: 'CTA Banner', category: 'CTA', variant: 'Banner',
        icon: <ArrowRight size={14} />,
        html: `<section style="padding:20px 24px;background:#2563EB;color:#fff;display:flex;align-items:center;justify-content:center;gap:20px;flex-wrap:wrap">
  <span style="font-size:15px;font-weight:500">&#127881; Limited time: 50% off Pro plan</span>
  <a href="#" style="display:inline-block;background:#fff;color:#2563EB;font-weight:600;font-size:14px;padding:8px 20px;border-radius:8px;text-decoration:none">Claim offer &rarr;</a>
</section>`,
      },
    ],
  },
  {
    name: 'Footer',
    icon: <Rows3 size={14} />,
    items: [
      {
        id: 'footer-simple', label: 'Footer Simple', category: 'Footer', variant: 'Simple',
        icon: <Rows3 size={14} />,
        html: `<footer style="padding:48px 24px 32px;background:#111827;color:#9CA3AF">
  <div style="max-width:1100px;margin:0 auto;display:flex;justify-content:space-between;align-items:start;flex-wrap:wrap;gap:32px">
    <div><div style="font-size:18px;font-weight:700;color:#fff;margin-bottom:12px">Brand</div><p style="font-size:14px;line-height:1.6;margin:0;max-width:280px">Building the future of web design with AI-powered tools.</p></div>
    <div style="display:flex;gap:48px;flex-wrap:wrap">
      <div><h4 style="font-size:13px;font-weight:600;color:#fff;margin:0 0 16px;text-transform:uppercase;letter-spacing:0.05em">Product</h4><div style="display:flex;flex-direction:column;gap:8px"><a href="#" style="color:#9CA3AF;text-decoration:none;font-size:14px">Features</a><a href="#" style="color:#9CA3AF;text-decoration:none;font-size:14px">Pricing</a><a href="#" style="color:#9CA3AF;text-decoration:none;font-size:14px">Templates</a></div></div>
      <div><h4 style="font-size:13px;font-weight:600;color:#fff;margin:0 0 16px;text-transform:uppercase;letter-spacing:0.05em">Company</h4><div style="display:flex;flex-direction:column;gap:8px"><a href="#" style="color:#9CA3AF;text-decoration:none;font-size:14px">About</a><a href="#" style="color:#9CA3AF;text-decoration:none;font-size:14px">Blog</a><a href="#" style="color:#9CA3AF;text-decoration:none;font-size:14px">Careers</a></div></div>
    </div>
  </div>
  <div style="max-width:1100px;margin:32px auto 0;padding-top:20px;border-top:1px solid #374151;text-align:center;font-size:13px">&copy; 2025 Your Company. All rights reserved.</div>
</footer>`,
      },
      {
        id: 'footer-rich', label: 'Footer Rich', category: 'Footer', variant: 'Rich',
        icon: <Rows3 size={14} />,
        html: `<footer style="padding:64px 24px 32px;background:#0F172A;color:#94A3B8">
  <div style="max-width:1100px;margin:0 auto;display:grid;grid-template-columns:2fr 1fr 1fr 1fr 1fr;gap:32px">
    <div><div style="font-size:20px;font-weight:700;color:#fff;margin-bottom:16px">Brand</div><p style="font-size:14px;line-height:1.7;margin:0 0 20px">Building the future of web design with AI.</p><div style="display:flex;gap:8px"><a href="#" style="width:32px;height:32px;background:#1E293B;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#94A3B8;text-decoration:none;font-size:14px">X</a><a href="#" style="width:32px;height:32px;background:#1E293B;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#94A3B8;text-decoration:none;font-size:14px">in</a><a href="#" style="width:32px;height:32px;background:#1E293B;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#94A3B8;text-decoration:none;font-size:14px">GH</a></div></div>
    <div><h4 style="font-size:13px;font-weight:600;color:#fff;margin:0 0 16px;text-transform:uppercase;letter-spacing:0.05em">Product</h4><div style="display:flex;flex-direction:column;gap:10px"><a href="#" style="color:#94A3B8;text-decoration:none;font-size:14px">Features</a><a href="#" style="color:#94A3B8;text-decoration:none;font-size:14px">Pricing</a><a href="#" style="color:#94A3B8;text-decoration:none;font-size:14px">Changelog</a></div></div>
    <div><h4 style="font-size:13px;font-weight:600;color:#fff;margin:0 0 16px;text-transform:uppercase;letter-spacing:0.05em">Resources</h4><div style="display:flex;flex-direction:column;gap:10px"><a href="#" style="color:#94A3B8;text-decoration:none;font-size:14px">Docs</a><a href="#" style="color:#94A3B8;text-decoration:none;font-size:14px">API</a><a href="#" style="color:#94A3B8;text-decoration:none;font-size:14px">Guides</a></div></div>
    <div><h4 style="font-size:13px;font-weight:600;color:#fff;margin:0 0 16px;text-transform:uppercase;letter-spacing:0.05em">Company</h4><div style="display:flex;flex-direction:column;gap:10px"><a href="#" style="color:#94A3B8;text-decoration:none;font-size:14px">About</a><a href="#" style="color:#94A3B8;text-decoration:none;font-size:14px">Blog</a><a href="#" style="color:#94A3B8;text-decoration:none;font-size:14px">Careers</a></div></div>
    <div><h4 style="font-size:13px;font-weight:600;color:#fff;margin:0 0 16px;text-transform:uppercase;letter-spacing:0.05em">Legal</h4><div style="display:flex;flex-direction:column;gap:10px"><a href="#" style="color:#94A3B8;text-decoration:none;font-size:14px">Privacy</a><a href="#" style="color:#94A3B8;text-decoration:none;font-size:14px">Terms</a><a href="#" style="color:#94A3B8;text-decoration:none;font-size:14px">Cookies</a></div></div>
  </div>
  <div style="max-width:1100px;margin:48px auto 0;padding-top:20px;border-top:1px solid #1E293B;display:flex;justify-content:space-between;font-size:13px;flex-wrap:wrap;gap:8px"><span>&copy; 2025 Your Company</span><span>Made with &#10084;&#65039; worldwide</span></div>
</footer>`,
      },
    ],
  },
  {
    name: 'Other',
    icon: <LayoutTemplate size={14} />,
    items: [
      {
        id: 'about', label: 'About', category: 'Other',
        icon: <Star size={14} />,
        html: `<section style="padding:80px 24px;max-width:800px;margin:0 auto">
  <h2 style="font-size:36px;font-weight:700;color:#111827;margin:0 0 24px;letter-spacing:-0.02em">About us</h2>
  <p style="font-size:18px;color:#4B5563;line-height:1.7;margin:0 0 20px">We believe great design should be accessible to everyone. Our mission is to empower creators with tools that make building beautiful websites effortless.</p>
  <p style="font-size:18px;color:#4B5563;line-height:1.7;margin:0">Founded in 2024, our team of designers and engineers is building the future of visual web design. We combine the power of AI with intuitive design tools to help you bring your ideas to life.</p>
</section>`,
      },
      {
        id: 'contact', label: 'Contact', category: 'Other',
        icon: <Mail size={14} />,
        html: `<section style="padding:80px 24px;max-width:600px;margin:0 auto">
  <h2 style="font-size:36px;font-weight:700;color:#111827;margin:0 0 12px;letter-spacing:-0.02em">Get in touch</h2>
  <p style="font-size:16px;color:#6B7280;margin:0 0 32px">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
  <form style="display:flex;flex-direction:column;gap:20px">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
      <div><label style="display:block;font-size:14px;font-weight:500;color:#374151;margin-bottom:6px">First name</label><input type="text" placeholder="John" style="width:100%;padding:10px 14px;border:1px solid #D1D5DB;border-radius:8px;font-size:15px;box-sizing:border-box"></div>
      <div><label style="display:block;font-size:14px;font-weight:500;color:#374151;margin-bottom:6px">Last name</label><input type="text" placeholder="Doe" style="width:100%;padding:10px 14px;border:1px solid #D1D5DB;border-radius:8px;font-size:15px;box-sizing:border-box"></div>
    </div>
    <div><label style="display:block;font-size:14px;font-weight:500;color:#374151;margin-bottom:6px">Email</label><input type="email" placeholder="you@example.com" style="width:100%;padding:10px 14px;border:1px solid #D1D5DB;border-radius:8px;font-size:15px;box-sizing:border-box"></div>
    <div><label style="display:block;font-size:14px;font-weight:500;color:#374151;margin-bottom:6px">Message</label><textarea placeholder="How can we help?" rows="5" style="width:100%;padding:10px 14px;border:1px solid #D1D5DB;border-radius:8px;font-size:15px;box-sizing:border-box;resize:vertical"></textarea></div>
    <button type="button" style="background:#2563EB;color:#fff;font-weight:600;font-size:16px;padding:12px 24px;border-radius:8px;border:none;cursor:pointer">Send message</button>
  </form>
</section>`,
      },
      {
        id: 'stats', label: 'Stats', category: 'Other',
        icon: <BarChart3 size={14} />,
        html: `<section style="padding:64px 24px;background:#F9FAFB">
  <div style="max-width:900px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);gap:32px;text-align:center">
    <div><div style="font-size:44px;font-weight:800;color:#111827;letter-spacing:-0.02em">10K+</div><div style="font-size:14px;color:#6B7280;margin-top:6px">Active users</div></div>
    <div><div style="font-size:44px;font-weight:800;color:#111827;letter-spacing:-0.02em">50M+</div><div style="font-size:14px;color:#6B7280;margin-top:6px">Pages built</div></div>
    <div><div style="font-size:44px;font-weight:800;color:#111827;letter-spacing:-0.02em">99.9%</div><div style="font-size:14px;color:#6B7280;margin-top:6px">Uptime</div></div>
    <div><div style="font-size:44px;font-weight:800;color:#111827;letter-spacing:-0.02em">4.9</div><div style="font-size:14px;color:#6B7280;margin-top:6px">User rating</div></div>
  </div>
</section>`,
      },
      {
        id: 'faq', label: 'FAQ', category: 'Other',
        icon: <HelpCircle size={14} />,
        html: `<section style="padding:80px 24px;max-width:700px;margin:0 auto">
  <h2 style="font-size:36px;font-weight:700;color:#111827;text-align:center;margin:0 0 48px;letter-spacing:-0.02em">Frequently asked questions</h2>
  <div style="display:flex;flex-direction:column;gap:24px">
    <div><h3 style="font-size:17px;font-weight:600;color:#111827;margin:0 0 8px">How does the free trial work?</h3><p style="font-size:15px;color:#6B7280;line-height:1.6;margin:0">You get 14 days of full access. No credit card required. Cancel anytime before the trial ends.</p></div>
    <div><h3 style="font-size:17px;font-weight:600;color:#111827;margin:0 0 8px">Can I export my code?</h3><p style="font-size:15px;color:#6B7280;line-height:1.6;margin:0">Yes! Export clean HTML, CSS, and React code. Full ownership of everything you build.</p></div>
    <div><h3 style="font-size:17px;font-weight:600;color:#111827;margin:0 0 8px">Do you offer team plans?</h3><p style="font-size:15px;color:#6B7280;line-height:1.6;margin:0">Pro and Enterprise plans include team collaboration with shared projects and permissions.</p></div>
  </div>
</section>`,
      },
      {
        id: 'newsletter', label: 'Newsletter', category: 'Other',
        icon: <Mail size={14} />,
        html: `<section style="padding:64px 24px;text-align:center;max-width:500px;margin:0 auto">
  <h2 style="font-size:28px;font-weight:700;color:#111827;margin:0 0 12px">Stay in the loop</h2>
  <p style="font-size:16px;color:#6B7280;margin:0 0 24px">Get the latest updates and tips delivered to your inbox.</p>
  <form style="display:flex;gap:8px;max-width:400px;margin:0 auto">
    <input type="email" placeholder="Enter your email" style="flex:1;padding:10px 16px;border:1px solid #D1D5DB;border-radius:8px;font-size:15px;box-sizing:border-box">
    <button type="button" style="background:#2563EB;color:#fff;font-weight:600;padding:10px 20px;border-radius:8px;border:none;cursor:pointer;font-size:15px;white-space:nowrap">Subscribe</button>
  </form>
</section>`,
      },
    ],
  },
]

// Flatten all section items with category populated
const ALL_SECTION_ITEMS: ToolPanelItem[] = SECTION_CATEGORIES.flatMap((cat) =>
  cat.items.map((item) => ({ ...item, category: cat.name }))
)

// ─── Component items ────────────────────────────────────────────────────

const COMPONENT_CATEGORIES: { name: string; icon: React.ReactNode; items: ToolPanelItem[] }[] = [
  {
    name: 'Typography',
    icon: <Type size={14} />,
    items: [
      {
        id: 'heading', label: 'Heading', category: 'Typography',
        icon: <Heading2 size={14} />,
        html: '<h2 style="font-size:32px;font-weight:700;color:#111827;margin:0 0 12px;letter-spacing:-0.02em">New heading</h2>',
      },
      {
        id: 'text', label: 'Text', category: 'Typography',
        icon: <Pilcrow size={14} />,
        html: '<p style="font-size:16px;color:#374151;line-height:1.7;margin:0 0 16px">Write your text here. This is a paragraph element you can edit and customize to fit your design.</p>',
      },
      {
        id: 'blockquote', label: 'Blockquote', category: 'Typography',
        icon: <Quote size={14} />,
        html: '<blockquote style="border-left:4px solid #2563EB;padding:16px 20px;margin:0 0 16px;background:#F9FAFB;border-radius:0 8px 8px 0"><p style="font-size:17px;color:#374151;font-style:italic;margin:0;line-height:1.6">"A meaningful quote goes here. Edit this to inspire your readers."</p></blockquote>',
      },
    ],
  },
  {
    name: 'Interactive',
    icon: <SquareMousePointer size={14} />,
    items: [
      {
        id: 'button', label: 'Button', category: 'Interactive',
        icon: <SquareMousePointer size={14} />,
        html: '<a href="#" style="display:inline-block;background:#2563EB;color:#fff;font-weight:600;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:15px;box-shadow:0 1px 2px rgba(37,99,235,0.3)">Click me</a>',
      },
      {
        id: 'form', label: 'Form', category: 'Interactive',
        icon: <FormInput size={14} />,
        html: `<form style="display:flex;flex-direction:column;gap:16px;max-width:400px">
  <div><label style="display:block;font-size:14px;font-weight:500;color:#374151;margin-bottom:6px">Label</label><input type="text" placeholder="Placeholder" style="width:100%;padding:10px 14px;border:1px solid #D1D5DB;border-radius:8px;font-size:15px;box-sizing:border-box"></div>
  <div><label style="display:block;font-size:14px;font-weight:500;color:#374151;margin-bottom:6px">Message</label><textarea placeholder="Your message" rows="3" style="width:100%;padding:10px 14px;border:1px solid #D1D5DB;border-radius:8px;font-size:15px;box-sizing:border-box;resize:vertical"></textarea></div>
  <button type="button" style="background:#2563EB;color:#fff;font-weight:600;padding:10px 24px;border-radius:8px;border:none;cursor:pointer;font-size:15px;align-self:flex-start">Submit</button>
</form>`,
      },
      {
        id: 'input', label: 'Input', category: 'Interactive',
        icon: <TextCursorInput size={14} />,
        html: '<div><label style="display:block;font-size:14px;font-weight:500;color:#374151;margin-bottom:6px">Label</label><input type="text" placeholder="Placeholder text" style="width:100%;max-width:400px;padding:10px 14px;border:1px solid #D1D5DB;border-radius:8px;font-size:15px;box-sizing:border-box"></div>',
      },
    ],
  },
  {
    name: 'Layout',
    icon: <Columns2 size={14} />,
    items: [
      {
        id: 'card', label: 'Card', category: 'Layout',
        icon: <RectangleHorizontal size={14} />,
        html: '<div style="border:1px solid #E5E7EB;border-radius:16px;padding:28px;max-width:400px"><h3 style="font-size:20px;font-weight:600;color:#111827;margin:0 0 10px">Card title</h3><p style="font-size:15px;color:#6B7280;line-height:1.6;margin:0 0 20px">Card description goes here. Customize this to share key information.</p><a href="#" style="color:#2563EB;font-weight:600;font-size:14px;text-decoration:none">Learn more &rarr;</a></div>',
      },
      {
        id: 'columns-2', label: 'Columns (2)', category: 'Layout',
        icon: <Columns2 size={14} />,
        html: '<div style="display:grid;grid-template-columns:1fr 1fr;gap:24px"><div style="background:#F9FAFB;border-radius:12px;padding:24px;text-align:center;color:#6B7280;font-size:14px">Column 1</div><div style="background:#F9FAFB;border-radius:12px;padding:24px;text-align:center;color:#6B7280;font-size:14px">Column 2</div></div>',
      },
      {
        id: 'columns-3', label: 'Columns (3)', category: 'Layout',
        icon: <Columns3 size={14} />,
        html: '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:24px"><div style="background:#F9FAFB;border-radius:12px;padding:24px;text-align:center;color:#6B7280;font-size:14px">Col 1</div><div style="background:#F9FAFB;border-radius:12px;padding:24px;text-align:center;color:#6B7280;font-size:14px">Col 2</div><div style="background:#F9FAFB;border-radius:12px;padding:24px;text-align:center;color:#6B7280;font-size:14px">Col 3</div></div>',
      },
      {
        id: 'columns-4', label: 'Columns (4)', category: 'Layout',
        icon: <Columns3 size={14} />,
        html: '<div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:16px"><div style="background:#F9FAFB;border-radius:10px;padding:20px;text-align:center;color:#6B7280;font-size:13px">Col 1</div><div style="background:#F9FAFB;border-radius:10px;padding:20px;text-align:center;color:#6B7280;font-size:13px">Col 2</div><div style="background:#F9FAFB;border-radius:10px;padding:20px;text-align:center;color:#6B7280;font-size:13px">Col 3</div><div style="background:#F9FAFB;border-radius:10px;padding:20px;text-align:center;color:#6B7280;font-size:13px">Col 4</div></div>',
      },
      {
        id: 'divider', label: 'Divider', category: 'Layout',
        icon: <Minus size={14} />,
        html: '<hr style="border:none;border-top:1px solid #E5E7EB;margin:32px 0">',
      },
      {
        id: 'spacer', label: 'Spacer', category: 'Layout',
        icon: <MoveVertical size={14} />,
        html: '<div style="height:48px"></div>',
      },
    ],
  },
  {
    name: 'Media',
    icon: <ImageIcon size={14} />,
    items: [
      {
        id: 'image', label: 'Image', category: 'Media',
        icon: <ImageIcon size={14} />,
        html: '<img src="https://placehold.co/800x400/EFF6FF/2563EB?text=Image" alt="Placeholder image" style="max-width:100%;border-radius:10px">',
      },
      {
        id: 'video', label: 'Video Placeholder', category: 'Media',
        icon: <Video size={14} />,
        html: '<div style="width:100%;max-width:800px;aspect-ratio:16/9;background:#111827;border-radius:12px;display:flex;align-items:center;justify-content:center;color:#6B7280;font-size:48px;cursor:pointer">&#9654;</div>',
      },
      {
        id: 'icon', label: 'Icon', category: 'Media',
        icon: <Smile size={14} />,
        html: '<div style="width:48px;height:48px;background:#EFF6FF;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:24px;color:#2563EB">&#9733;</div>',
      },
    ],
  },
]

const ALL_COMPONENT_ITEMS: ToolPanelItem[] = COMPONENT_CATEGORIES.flatMap((cat) =>
  cat.items.map((item) => ({ ...item, category: cat.name }))
)

// ─── Panel subcomponents ────────────────────────────────────────────────

function PanelHeader({
  icon,
  title,
  darkMode,
  children,
}: {
  icon: React.ReactNode
  title: string
  darkMode?: boolean
  children?: React.ReactNode
}) {
  return (
    <div
      className={`sticky top-0 z-10 px-4 py-3 border-b flex items-center gap-2 ${
        darkMode
          ? 'bg-[#1E293B] border-[#334155]'
          : 'bg-white border-[#E5E7EB]'
      }`}
    >
      <span className={darkMode ? 'text-[#60A5FA]' : 'text-[#2563EB]'}>{icon}</span>
      <span className={`text-sm font-semibold flex-1 ${darkMode ? 'text-[#F1F5F9]' : 'text-[#111827]'}`}>
        {title}
      </span>
      {children}
    </div>
  )
}

function SearchBar({
  value,
  onChange,
  placeholder = 'Search...',
  darkMode,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  darkMode?: boolean
}) {
  return (
    <div
      className={`sticky top-[49px] z-10 px-4 py-2 border-b ${
        darkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E5E7EB]'
      }`}
    >
      <div
        className={`flex items-center gap-2 px-3 h-8 rounded-lg border ${
          darkMode
            ? 'border-[#334155] bg-[#0F172A] text-[#F1F5F9]'
            : 'border-[#E5E7EB] bg-[#F9FAFB] text-[#111827]'
        }`}
      >
        <Search size={13} className={darkMode ? 'text-[#64748B]' : 'text-[#9CA3AF]'} />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="border-none outline-none bg-transparent text-xs flex-1 min-w-0 placeholder:text-[#9CA3AF]"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className={`p-0.5 rounded ${
              darkMode ? 'text-[#64748B] hover:text-[#94A3B8]' : 'text-[#9CA3AF] hover:text-[#4B5563]'
            }`}
          >
            <X size={12} />
          </button>
        )}
      </div>
    </div>
  )
}

function CategoryHeader({
  title,
  count,
  icon,
  darkMode,
}: {
  title: string
  count: number
  icon?: React.ReactNode
  darkMode?: boolean
}) {
  return (
    <div className={`flex items-center gap-1.5 px-3 pt-4 pb-1.5 ${darkMode ? 'text-[#64748B]' : 'text-[#9CA3AF]'}`}>
      {icon && <span className="opacity-60">{icon}</span>}
      <span className="text-[11px] font-semibold uppercase tracking-wider flex-1">{title}</span>
      <span
        className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md ${
          darkMode ? 'bg-[#0F172A] text-[#64748B]' : 'bg-[#F3F4F6] text-[#9CA3AF]'
        }`}
      >
        {count}
      </span>
    </div>
  )
}

function PanelItem({
  item,
  onInsert,
  darkMode,
}: {
  item: ToolPanelItem
  onInsert: (html: string, label: string) => void
  darkMode?: boolean
}) {
  return (
    <button
      type="button"
      onClick={() => item.html && onInsert(item.html, item.label)}
      className={`group w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
        item.html
          ? darkMode
            ? 'hover:bg-[#253347] active:bg-[#1E293B] cursor-pointer'
            : 'hover:bg-[#F1F2F4] active:bg-[#ECEDEF] cursor-pointer'
          : 'cursor-default'
      }`}
    >
      <span
        className={`flex items-center justify-center w-8 h-8 rounded-md flex-shrink-0 transition-colors duration-150 ${
          darkMode
            ? 'bg-[#172554] text-[#60A5FA] group-hover:bg-[#1E3A5F]'
            : 'bg-[#EFF6FF] text-[#2563EB] group-hover:bg-[#DBEAFE]'
        }`}
      >
        {item.icon || <Plus size={14} />}
      </span>
      <div className="flex-1 min-w-0">
        <div className={`text-[13px] font-medium truncate ${darkMode ? 'text-[#F1F5F9]' : 'text-[#111827]'}`}>
          {item.label}
        </div>
        {item.description && (
          <div className={`text-[11px] truncate mt-0.5 ${darkMode ? 'text-[#64748B]' : 'text-[#9CA3AF]'}`}>
            {item.description}
          </div>
        )}
        {item.variant && !item.description && (
          <div className={`text-[11px] truncate mt-0.5 ${darkMode ? 'text-[#64748B]' : 'text-[#9CA3AF]'}`}>
            {item.variant}
          </div>
        )}
      </div>
      {item.html && (
        <ChevronRight
          size={13}
          className={`flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150 ${
            darkMode ? 'text-[#64748B]' : 'text-[#9CA3AF]'
          }`}
        />
      )}
    </button>
  )
}

// ─── Sections Panel ─────────────────────────────────────────────────────

function SectionsPanel({ onInsert, darkMode }: { onInsert: (html: string, label: string) => void; darkMode?: boolean }) {
  const [search, setSearch] = React.useState('')
  const debouncedSearch = useDebouncedValue(search, 200)

  const filteredCategories = React.useMemo(() => {
    if (!debouncedSearch) return SECTION_CATEGORIES
    const q = debouncedSearch.toLowerCase()
    return SECTION_CATEGORIES.map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (i) =>
          i.label.toLowerCase().includes(q) ||
          (i.variant || '').toLowerCase().includes(q) ||
          cat.name.toLowerCase().includes(q)
      ),
    })).filter((cat) => cat.items.length > 0)
  }, [debouncedSearch])

  return (
    <>
      <PanelHeader icon={<LayoutTemplate size={16} />} title="Sections" darkMode={darkMode} />
      <SearchBar value={search} onChange={setSearch} placeholder="Search sections..." darkMode={darkMode} />
      <div className="flex-1 overflow-y-auto pb-2" style={{ scrollbarGutter: 'stable' }}>
        {filteredCategories.map((cat) => (
          <div key={cat.name}>
            <CategoryHeader title={cat.name} count={cat.items.length} icon={cat.icon} darkMode={darkMode} />
            {cat.items.map((item) => (
              <PanelItem key={item.id} item={item} onInsert={onInsert} darkMode={darkMode} />
            ))}
          </div>
        ))}
        {filteredCategories.length === 0 && (
          <div className={`px-4 py-8 text-center text-sm ${darkMode ? 'text-[#64748B]' : 'text-[#9CA3AF]'}`}>
            No sections match your search
          </div>
        )}
      </div>
      <div className={`px-4 py-3 border-t ${darkMode ? 'border-[#334155]' : 'border-[#E5E7EB]'}`}>
        <button
          type="button"
          onClick={() => onInsert('', 'AI generate')}
          className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-lg border border-dashed text-xs font-medium transition-colors duration-150 ${
            darkMode
              ? 'border-[#334155] text-[#60A5FA] hover:bg-[#172554]'
              : 'border-[#D1D5DB] text-[#2563EB] hover:bg-[#EFF6FF]'
          }`}
        >
          <Sparkles size={13} />
          Add with AI
        </button>
      </div>
    </>
  )
}

// ─── Components Panel ───────────────────────────────────────────────────

function ComponentsPanel({ onInsert, darkMode }: { onInsert: (html: string, label: string) => void; darkMode?: boolean }) {
  const [search, setSearch] = React.useState('')
  const debouncedSearch = useDebouncedValue(search, 200)

  const filteredCategories = React.useMemo(() => {
    if (!debouncedSearch) return COMPONENT_CATEGORIES
    const q = debouncedSearch.toLowerCase()
    return COMPONENT_CATEGORIES.map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (i) =>
          i.label.toLowerCase().includes(q) ||
          (i.category || '').toLowerCase().includes(q)
      ),
    })).filter((cat) => cat.items.length > 0)
  }, [debouncedSearch])

  return (
    <>
      <PanelHeader icon={<Type size={16} />} title="Components" darkMode={darkMode} />
      <SearchBar value={search} onChange={setSearch} placeholder="Search components..." darkMode={darkMode} />
      <div className="flex-1 overflow-y-auto pb-2" style={{ scrollbarGutter: 'stable' }}>
        {filteredCategories.map((cat) => (
          <div key={cat.name}>
            <CategoryHeader title={cat.name} count={cat.items.length} icon={cat.icon} darkMode={darkMode} />
            {cat.items.map((item) => (
              <PanelItem key={item.id} item={item} onInsert={onInsert} darkMode={darkMode} />
            ))}
          </div>
        ))}
        {filteredCategories.length === 0 && (
          <div className={`px-4 py-8 text-center text-sm ${darkMode ? 'text-[#64748B]' : 'text-[#9CA3AF]'}`}>
            No components match your search
          </div>
        )}
      </div>
    </>
  )
}

// ─── Media Panel ────────────────────────────────────────────────────────

function MediaPanel({ onInsert, darkMode }: { onInsert: (html: string, label: string) => void; darkMode?: boolean }) {
  const [search, setSearch] = React.useState('')

  return (
    <>
      <PanelHeader icon={<ImageIcon size={16} />} title="Media" darkMode={darkMode} />
      <div className="flex-1 overflow-y-auto pb-2" style={{ scrollbarGutter: 'stable' }}>
        {/* Upload drop zone */}
        <div className="px-4 pt-4 pb-2">
          <div
            className={`flex flex-col items-center justify-center gap-2 py-8 rounded-xl border-2 border-dashed transition-colors duration-200 cursor-pointer ${
              darkMode
                ? 'border-[#334155] hover:border-[#60A5FA] hover:bg-[#172554]/50'
                : 'border-[#D1D5DB] hover:border-[#2563EB] hover:bg-[#EFF6FF]/50'
            }`}
          >
            <Upload size={24} className={darkMode ? 'text-[#64748B]' : 'text-[#9CA3AF]'} />
            <span className={`text-sm font-medium ${darkMode ? 'text-[#94A3B8]' : 'text-[#4B5563]'}`}>
              Drag & drop or click to upload
            </span>
            <span className={`text-xs ${darkMode ? 'text-[#64748B]' : 'text-[#9CA3AF]'}`}>
              PNG, JPG, SVG, GIF up to 10MB
            </span>
          </div>
        </div>

        {/* Stock search */}
        <div className="px-4 py-2">
          <div
            className={`flex items-center gap-2 px-3 h-8 rounded-lg border ${
              darkMode
                ? 'border-[#334155] bg-[#0F172A]'
                : 'border-[#E5E7EB] bg-[#F9FAFB]'
            }`}
          >
            <Search size={13} className={darkMode ? 'text-[#64748B]' : 'text-[#9CA3AF]'} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search stock photos..."
              className={`border-none outline-none bg-transparent text-xs flex-1 min-w-0 ${
                darkMode ? 'text-[#F1F5F9] placeholder:text-[#64748B]' : 'text-[#111827] placeholder:text-[#9CA3AF]'
              }`}
            />
          </div>
        </div>

        {/* Quick insert media items */}
        <CategoryHeader title="Quick Insert" count={5} icon={<ImageIcon size={14} />} darkMode={darkMode} />
        {[
          { id: 'img-wide', label: 'Wide (16:9)', html: '<img src="https://placehold.co/1200x675/F9FAFB/9CA3AF?text=Wide+Image" alt="Wide placeholder" style="max-width:100%;border-radius:8px">' },
          { id: 'img-square', label: 'Square (1:1)', html: '<img src="https://placehold.co/600x600/F9FAFB/9CA3AF?text=Square" alt="Square placeholder" style="max-width:100%;border-radius:8px">' },
          { id: 'img-portrait', label: 'Portrait (3:4)', html: '<img src="https://placehold.co/450x600/F9FAFB/9CA3AF?text=Portrait" alt="Portrait placeholder" style="max-width:100%;border-radius:8px">' },
          { id: 'img-avatar', label: 'Avatar', html: '<img src="https://placehold.co/80x80/EFF6FF/2563EB?text=A" alt="Avatar" style="width:80px;height:80px;border-radius:50%;object-fit:cover">' },
          { id: 'img-gallery', label: 'Gallery (3)', html: '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px"><img src="https://placehold.co/400x300/F9FAFB/9CA3AF?text=1" alt="1" style="width:100%;border-radius:8px;object-fit:cover"><img src="https://placehold.co/400x300/F0FDF4/16A34A?text=2" alt="2" style="width:100%;border-radius:8px;object-fit:cover"><img src="https://placehold.co/400x300/FEF3C7/F59E0B?text=3" alt="3" style="width:100%;border-radius:8px;object-fit:cover"></div>' },
        ].map((item) => (
          <PanelItem
            key={item.id}
            item={{ ...item, icon: <ImageIcon size={14} />, category: 'Media' }}
            onInsert={onInsert}
            darkMode={darkMode}
          />
        ))}

        {/* Recent images placeholder grid */}
        <CategoryHeader title="Recent" count={0} icon={<FolderOpen size={14} />} darkMode={darkMode} />
        <div className={`px-4 py-6 text-center text-xs ${darkMode ? 'text-[#64748B]' : 'text-[#9CA3AF]'}`}>
          <ImageIcon size={20} className="mx-auto mb-2 opacity-40" />
          No recent images
        </div>
      </div>
    </>
  )
}

// ─── Layers Panel ───────────────────────────────────────────────────────

interface LayerNode {
  tag: string
  text: string
  children: LayerNode[]
  index: number
}

function parseHTMLToLayers(html: string): LayerNode[] {
  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    return Array.from(doc.body.children).map((el, i) => parseElement(el, i))
  } catch {
    return []
  }
}

function parseElement(el: Element, index: number): LayerNode {
  return {
    tag: el.tagName.toLowerCase(),
    text: (el.textContent || '').trim().slice(0, 30),
    children: Array.from(el.children).map((child, i) => parseElement(child, i)),
    index,
  }
}

function LayerItem({
  node,
  depth,
  darkMode,
}: {
  node: LayerNode
  depth: number
  darkMode?: boolean
}) {
  const [expanded, setExpanded] = React.useState(depth < 1)
  const [visible, setVisible] = React.useState(true)
  const hasChildren = node.children.length > 0

  return (
    <div>
      <div
        className={`group flex items-center gap-1 py-1 px-2 rounded-md transition-colors duration-100 cursor-pointer ${
          darkMode
            ? 'hover:bg-[#253347]'
            : 'hover:bg-[#F1F2F4]'
        }`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        {/* Expand/collapse */}
        {hasChildren ? (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded) }}
            className={`p-0.5 rounded transition-colors ${
              darkMode ? 'text-[#64748B] hover:text-[#94A3B8]' : 'text-[#9CA3AF] hover:text-[#4B5563]'
            }`}
          >
            {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          </button>
        ) : (
          <span className="w-4 flex-shrink-0" />
        )}

        {/* Tag badge */}
        <span
          className={`flex items-center justify-center w-5 h-5 rounded text-[9px] font-bold flex-shrink-0 ${
            darkMode
              ? 'bg-[#172554] text-[#60A5FA]'
              : 'bg-[#EFF6FF] text-[#2563EB]'
          }`}
        >
          {node.tag.charAt(0).toUpperCase()}
        </span>

        {/* Tag name */}
        <span className={`text-xs font-medium ${darkMode ? 'text-[#F1F5F9]' : 'text-[#111827]'}`}>
          {node.tag}
        </span>

        {/* Text preview */}
        {node.text && (
          <span className={`text-[11px] truncate flex-1 min-w-0 ${darkMode ? 'text-[#64748B]' : 'text-[#9CA3AF]'}`}>
            {node.text}
          </span>
        )}

        {/* Visibility toggle */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setVisible(!visible) }}
          className={`p-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-100 ${
            darkMode ? 'text-[#64748B] hover:text-[#94A3B8]' : 'text-[#9CA3AF] hover:text-[#4B5563]'
          }`}
        >
          {visible ? <Eye size={12} /> : <EyeOff size={12} />}
        </button>
      </div>

      {/* Children */}
      {hasChildren && expanded && (
        <div>
          {node.children.map((child, i) => (
            <LayerItem key={`${child.tag}-${i}`} node={child} depth={depth + 1} darkMode={darkMode} />
          ))}
        </div>
      )}
    </div>
  )
}

function LayersPanel({ htmlContent, darkMode }: { htmlContent?: string; darkMode?: boolean }) {
  const layers = React.useMemo(() => parseHTMLToLayers(htmlContent || ''), [htmlContent])

  return (
    <>
      <PanelHeader icon={<ListTree size={16} />} title="Layers" darkMode={darkMode} />
      <div className="flex-1 overflow-y-auto py-2 px-1" style={{ scrollbarGutter: 'stable' }}>
        {layers.length === 0 ? (
          <div className={`px-4 py-8 text-center text-sm ${darkMode ? 'text-[#64748B]' : 'text-[#9CA3AF]'}`}>
            <Layers size={24} className="mx-auto mb-2 opacity-40" />
            No elements yet.<br />Add sections or components.
          </div>
        ) : (
          layers.map((node, i) => (
            <LayerItem key={`${node.tag}-${i}`} node={node} depth={0} darkMode={darkMode} />
          ))
        )}
      </div>
    </>
  )
}

// ─── AI Panel ───────────────────────────────────────────────────────────

function AIPanel({ onInsert, darkMode }: { onInsert: (html: string, label: string) => void; darkMode?: boolean }) {
  const [prompt, setPrompt] = React.useState('')
  const suggestions = ['Hero section', 'Features grid', 'Contact form', 'Pricing table', 'Testimonials']

  return (
    <>
      <PanelHeader icon={<Sparkles size={16} />} title="AI Generate" darkMode={darkMode} />
      <div className="flex-1 overflow-y-auto pb-2" style={{ scrollbarGutter: 'stable' }}>
        {/* Prompt textarea */}
        <div className="px-4 pt-4">
          <label className={`text-xs font-medium mb-1.5 block ${darkMode ? 'text-[#94A3B8]' : 'text-[#4B5563]'}`}>
            Describe what you want
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A hero section with a gradient background and centered text..."
            rows={4}
            className={`w-full px-3 py-2.5 rounded-lg border text-sm resize-none outline-none transition-colors duration-150 focus:ring-2 focus:ring-[#2563EB] ${
              darkMode
                ? 'bg-[#0F172A] border-[#334155] text-[#F1F5F9] placeholder:text-[#475569]'
                : 'bg-[#F9FAFB] border-[#E5E7EB] text-[#111827] placeholder:text-[#9CA3AF]'
            }`}
          />
        </div>

        {/* Suggestion chips */}
        <div className="px-4 pt-3 pb-2">
          <label className={`text-xs font-medium mb-1.5 block ${darkMode ? 'text-[#94A3B8]' : 'text-[#4B5563]'}`}>
            Suggestions
          </label>
          <div className="flex flex-wrap gap-1.5">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setPrompt(s)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors duration-150 ${
                  darkMode
                    ? 'bg-[#172554] text-[#60A5FA] hover:bg-[#1E3A5F]'
                    : 'bg-[#EFF6FF] text-[#2563EB] hover:bg-[#DBEAFE]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Generate button */}
        <div className="px-4 pt-2">
          <button
            type="button"
            onClick={() => onInsert('', 'AI generate')}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 ${
              prompt
                ? darkMode
                  ? 'bg-[#60A5FA] text-[#0F172A] hover:bg-[#3B82F6]'
                  : 'bg-[#2563EB] text-white hover:bg-[#1D4ED8] shadow-sm'
                : darkMode
                  ? 'bg-[#1E293B] text-[#64748B] cursor-not-allowed'
                  : 'bg-[#F3F4F6] text-[#9CA3AF] cursor-not-allowed'
            }`}
          >
            <Wand2 size={15} />
            Generate
          </button>
        </div>

        {/* Recent AI generations */}
        <CategoryHeader title="Recent Generations" count={0} icon={<Lightbulb size={14} />} darkMode={darkMode} />
        <div className={`px-4 py-6 text-center text-xs ${darkMode ? 'text-[#64748B]' : 'text-[#9CA3AF]'}`}>
          <Sparkles size={20} className="mx-auto mb-2 opacity-40" />
          AI generations will appear here
        </div>
      </div>
    </>
  )
}

// ─── Pages Panel ────────────────────────────────────────────────────────

function PagesPanel({ darkMode }: { darkMode?: boolean }) {
  const [pages, setPages] = React.useState([
    { id: 'index', name: 'index.html', active: true },
    { id: 'about', name: 'about.html', active: false },
  ])
  const [newPageName, setNewPageName] = React.useState('')

  return (
    <>
      <PanelHeader icon={<FileText size={16} />} title="Pages" darkMode={darkMode} />
      <div className="flex-1 overflow-y-auto pb-2" style={{ scrollbarGutter: 'stable' }}>
        <div className="px-3 pt-3 flex flex-col gap-1">
          {pages.map((page) => (
            <div
              key={page.id}
              className={`group flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors duration-150 ${
                page.active
                  ? darkMode
                    ? 'bg-[#172554] text-[#60A5FA]'
                    : 'bg-[#EFF6FF] text-[#2563EB]'
                  : darkMode
                    ? 'text-[#F1F5F9] hover:bg-[#253347]'
                    : 'text-[#111827] hover:bg-[#F1F2F4]'
              }`}
            >
              <Globe size={14} className="flex-shrink-0" />
              <span className="flex-1 font-medium truncate">{page.name}</span>
              {page.active && (
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md ${
                  darkMode ? 'bg-[#1E3A5F] text-[#60A5FA]' : 'bg-[#DBEAFE] text-[#2563EB]'
                }`}>
                  Active
                </span>
              )}
              {!page.active && (
                <button
                  type="button"
                  onClick={() => setPages((p) => p.filter((pg) => pg.id !== page.id))}
                  className={`p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity ${
                    darkMode ? 'text-[#64748B] hover:text-[#F87171]' : 'text-[#9CA3AF] hover:text-[#DC2626]'
                  }`}
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add page */}
        <div className="px-3 pt-3">
          {newPageName !== '' ? (
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
              darkMode ? 'border-[#334155] bg-[#0F172A]' : 'border-[#E5E7EB] bg-[#F9FAFB]'
            }`}>
              <Globe size={14} className={darkMode ? 'text-[#64748B]' : 'text-[#9CA3AF]'} />
              <input
                type="text"
                value={newPageName}
                onChange={(e) => setNewPageName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newPageName.trim()) {
                    setPages((p) => [...p, { id: newPageName.trim(), name: newPageName.trim(), active: false }])
                    setNewPageName('')
                  }
                  if (e.key === 'Escape') setNewPageName('')
                }}
                placeholder="page.html"
                autoFocus
                className={`flex-1 text-sm bg-transparent border-none outline-none min-w-0 ${
                  darkMode ? 'text-[#F1F5F9] placeholder:text-[#475569]' : 'text-[#111827] placeholder:text-[#9CA3AF]'
                }`}
              />
              <button type="button" onClick={() => setNewPageName('')} className={darkMode ? 'text-[#64748B]' : 'text-[#9CA3AF]'}>
                <X size={12} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setNewPageName('untitled.html')}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed text-xs font-medium transition-colors duration-150 ${
                darkMode
                  ? 'border-[#334155] text-[#94A3B8] hover:bg-[#253347]'
                  : 'border-[#D1D5DB] text-[#6B7280] hover:bg-[#F9FAFB]'
              }`}
            >
              <Plus size={13} />
              Add page
            </button>
          )}
        </div>
      </div>
    </>
  )
}

// ─── Brand Panel ────────────────────────────────────────────────────────

function BrandPanel({ darkMode }: { darkMode?: boolean }) {
  const brandColors = [
    { name: 'Primary', hex: '#2563EB' },
    { name: 'Secondary', hex: '#7C3AED' },
    { name: 'Accent', hex: '#F59E0B' },
    { name: 'Success', hex: '#16A34A' },
    { name: 'Error', hex: '#DC2626' },
    { name: 'Neutral', hex: '#6B7280' },
  ]
  const fontPairings = [
    { heading: 'Inter', body: 'Inter', style: 'sans-serif' },
    { heading: 'Playfair Display', body: 'Source Sans 3', style: 'serif' },
    { heading: 'Space Grotesk', body: 'DM Sans', style: 'sans-serif' },
  ]

  return (
    <>
      <PanelHeader icon={<Palette size={16} />} title="Brand Kit" darkMode={darkMode} />
      <div className="flex-1 overflow-y-auto pb-2" style={{ scrollbarGutter: 'stable' }}>
        {/* Color palette */}
        <CategoryHeader title="Color Palette" count={brandColors.length} icon={<Palette size={14} />} darkMode={darkMode} />
        <div className="px-4 pt-1 pb-3">
          <div className="grid grid-cols-3 gap-2">
            {brandColors.map((color) => (
              <div key={color.name} className="flex flex-col items-center gap-1">
                <div
                  className="w-full aspect-square rounded-lg border transition-transform duration-150 hover:scale-105 cursor-pointer"
                  style={{
                    backgroundColor: color.hex,
                    borderColor: darkMode ? '#334155' : '#E5E7EB',
                  }}
                />
                <span className={`text-[10px] font-medium ${darkMode ? 'text-[#94A3B8]' : 'text-[#6B7280]'}`}>
                  {color.name}
                </span>
                <span className={`text-[10px] ${darkMode ? 'text-[#64748B]' : 'text-[#9CA3AF]'}`}>
                  {color.hex}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Font pairings */}
        <CategoryHeader title="Font Pairings" count={fontPairings.length} icon={<TypeIcon size={14} />} darkMode={darkMode} />
        <div className="px-4 pt-1 flex flex-col gap-2">
          {fontPairings.map((pair, i) => (
            <div
              key={i}
              className={`p-3 rounded-lg border transition-colors duration-150 cursor-pointer ${
                i === 0
                  ? darkMode ? 'border-[#60A5FA] bg-[#172554]' : 'border-[#2563EB] bg-[#EFF6FF]'
                  : darkMode
                    ? 'border-[#334155] hover:border-[#475569]'
                    : 'border-[#E5E7EB] hover:border-[#D1D5DB]'
              }`}
            >
              <div className={`text-lg font-bold mb-1 ${darkMode ? 'text-[#F1F5F9]' : 'text-[#111827]'}`} style={{ fontFamily: pair.style }}>
                {pair.heading}
              </div>
              <div className={`text-sm ${darkMode ? 'text-[#94A3B8]' : 'text-[#6B7280]'}`} style={{ fontFamily: pair.style }}>
                {pair.body}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

// ─── Settings Panel ─────────────────────────────────────────────────────

function SettingToggle({ label, icon, value, onToggle, darkMode }: {
  label: string
  icon: React.ReactNode
  value: boolean
  onToggle: () => void
  darkMode?: boolean
}) {
  return (
    <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-150 ${
      darkMode ? 'hover:bg-[#253347]' : 'hover:bg-[#F1F2F4]'
    }`}>
      <span className={darkMode ? 'text-[#94A3B8]' : 'text-[#6B7280]'}>{icon}</span>
      <span className={`flex-1 text-sm font-medium ${darkMode ? 'text-[#F1F5F9]' : 'text-[#111827]'}`}>{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={onToggle}
        className={`relative w-9 h-5 rounded-full transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
          value
            ? 'bg-[#2563EB]'
            : darkMode ? 'bg-[#334155]' : 'bg-[#D1D5DB]'
        }`}
      >
        <span
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            value ? 'translate-x-4' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  )
}

function SettingsPanel({ darkMode }: { darkMode?: boolean }) {
  const [grid, setGrid] = React.useState(true)
  const [snap, setSnap] = React.useState(true)
  const [autoSave, setAutoSave] = React.useState(true)

  return (
    <>
      <PanelHeader icon={<Settings2 size={16} />} title="Settings" darkMode={darkMode} />
      <div className="flex-1 overflow-y-auto pb-2" style={{ scrollbarGutter: 'stable' }}>
        <CategoryHeader title="Canvas" count={3} icon={<Settings2 size={14} />} darkMode={darkMode} />
        <div className="px-3 pt-1 flex flex-col gap-0.5">
          <SettingToggle label="Show grid" icon={<Grid3x3 size={15} />} value={grid} onToggle={() => setGrid(!grid)} darkMode={darkMode} />
          <SettingToggle label="Snap to grid" icon={<Magnet size={15} />} value={snap} onToggle={() => setSnap(!snap)} darkMode={darkMode} />
          <SettingToggle label="Auto-save" icon={<Save size={15} />} value={autoSave} onToggle={() => setAutoSave(!autoSave)} darkMode={darkMode} />
        </div>

        <CategoryHeader title="Device" count={0} icon={<Globe size={14} />} darkMode={darkMode} />
        <div className="px-4 py-3">
          <div className={`flex gap-1.5 p-1 rounded-lg ${darkMode ? 'bg-[#0F172A]' : 'bg-[#F3F4F6]'}`}>
            {['Desktop', 'Tablet', 'Mobile'].map((device) => (
              <button
                key={device}
                type="button"
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors duration-150 ${
                  device === 'Desktop'
                    ? darkMode ? 'bg-[#1E293B] text-[#F1F5F9] shadow-sm' : 'bg-white text-[#111827] shadow-sm'
                    : darkMode ? 'text-[#64748B] hover:text-[#94A3B8]' : 'text-[#9CA3AF] hover:text-[#4B5563]'
                }`}
              >
                {device}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

// ─── Main ToolPanel ─────────────────────────────────────────────────────

export function ToolPanel({ activeTool, onInsert, darkMode, htmlContent }: ToolPanelProps) {
  const { reduceMotion } = useAccessibility()

  const panelContent = (
    <div
      className={`flex flex-col h-full overflow-hidden border-r ${
        darkMode
          ? 'bg-[#1E293B] border-[#334155]'
          : 'bg-white border-[#E5E7EB]'
      }`}
      style={{ width: 260 }}
    >
      {activeTool === 'sections' && <SectionsPanel onInsert={onInsert} darkMode={darkMode} />}
      {activeTool === 'components' && <ComponentsPanel onInsert={onInsert} darkMode={darkMode} />}
      {activeTool === 'media' && <MediaPanel onInsert={onInsert} darkMode={darkMode} />}
      {activeTool === 'layers' && <LayersPanel htmlContent={htmlContent} darkMode={darkMode} />}
      {activeTool === 'ai' && <AIPanel onInsert={onInsert} darkMode={darkMode} />}
      {activeTool === 'pages' && <PagesPanel darkMode={darkMode} />}
      {activeTool === 'brand' && <BrandPanel darkMode={darkMode} />}
      {activeTool === 'settings' && <SettingsPanel darkMode={darkMode} />}
    </div>
  )

  // Wrap in framer-motion for slide-in/out animation
  return (
    <motion.div
      initial={{ x: -260, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -260, opacity: 0 }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { type: 'spring', stiffness: 300, damping: 30, mass: 1 }
      }
      className="flex-shrink-0"
    >
      {panelContent}
    </motion.div>
  )
}
