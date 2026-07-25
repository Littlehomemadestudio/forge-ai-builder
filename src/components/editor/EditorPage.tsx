'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from '@/hooks/use-toast'

import {
  Undo2, Redo2, Monitor, Smartphone, Tablet, Code2, Save, Download, Rocket,
  ArrowLeft, Eye, EyeOff, Lock, Unlock, Trash2, Copy, Plus, Search, Layers,
  Grid3X3, Palette, Type, Layout, Square, Circle, ChevronDown, ChevronRight,
  Move, Maximize2, ZoomIn, ZoomOut, Sparkles, Wand2, Bold, Italic, Underline,
  AlignLeft, AlignCenter, AlignRight, Image, Link, Settings2, FileCode, Globe,
  Hash, ToggleLeft, ToggleRight
} from 'lucide-react'

// ─── Default Website HTML for the iframe preview ───────────────────────────
const defaultWebsiteHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content=device-width, initial-scale=1.0">
<title>Nexus — AI-Powered Analytics Platform</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  :root {
    --primary: #6C5CE7;
    --primary-light: #A29BFE;
    --accent: #00CEC9;
    --dark: #0A0A1A;
    --dark-surface: #12122A;
    --dark-card: #1A1A3A;
    --text: #E8E8F0;
    --text-muted: #8888AA;
    --gradient-1: linear-gradient(135deg, #6C5CE7 0%, #00CEC9 100%);
    --gradient-2: linear-gradient(135deg, #0A0A1A 0%, #1A1A3A 100%);
  }
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: var(--dark);
    color: var(--text);
    line-height: 1.6;
    overflow-x: hidden;
  }
  .nav { padding: 1rem 2rem; display: flex; align-items: center; justify-content: space-between; background: rgba(10,10,26,0.8); backdrop-filter: blur(20px); position: sticky; top: 0; z-index: 100; border-bottom: 1px solid rgba(108,92,231,0.1); }
  .nav-logo { font-size: 1.5rem; font-weight: 700; color: var(--primary); display: flex; align-items: center; gap: 0.5rem; }
  .nav-logo span { background: var(--gradient-1); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .nav-links { display: flex; gap: 2rem; list-style: none; }
  .nav-links a { color: var(--text-muted); text-decoration: none; transition: color 0.3s; font-size: 0.9rem; }
  .nav-links a:hover { color: var(--text); }
  .nav-cta { background: var(--gradient-1); color: white; padding: 0.5rem 1.5rem; border-radius: 8px; font-weight: 600; font-size: 0.9rem; cursor: pointer; border: none; transition: transform 0.2s, box-shadow 0.2s; }
  .nav-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(108,92,231,0.4); }
  .hero { padding: 6rem 2rem; text-align: center; position: relative; overflow: hidden; min-height: 80vh; display: flex; flex-direction: column; align-items: center; justify-content: center; }
  .hero::before { content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle at 50% 50%, rgba(108,92,231,0.08) 0%, transparent 50%); animation: pulse 8s ease-in-out infinite; }
  @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 0.5; } 50% { transform: scale(1.1); opacity: 1; } }
  .hero-badge { display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(108,92,231,0.15); border: 1px solid rgba(108,92,231,0.3); padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.85rem; color: var(--primary-light); margin-bottom: 1.5rem; }
  .hero h1 { font-size: 3.5rem; font-weight: 800; line-height: 1.1; margin-bottom: 1.5rem; max-width: 800px; }
  .hero h1 .gradient { background: var(--gradient-1); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .hero p { font-size: 1.2rem; color: var(--text-muted); max-width: 600px; margin-bottom: 2rem; }
  .hero-buttons { display: flex; gap: 1rem; }
  .btn-primary { background: var(--gradient-1); color: white; padding: 0.75rem 2rem; border-radius: 10px; font-weight: 600; cursor: pointer; border: none; font-size: 1rem; transition: transform 0.2s, box-shadow 0.2s; }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 35px rgba(108,92,231,0.4); }
  .btn-secondary { background: transparent; color: var(--text); padding: 0.75rem 2rem; border-radius: 10px; font-weight: 600; cursor: pointer; font-size: 1rem; border: 1px solid rgba(255,255,255,0.2); transition: all 0.3s; }
  .btn-secondary:hover { border-color: var(--primary); color: var(--primary-light); }
  .stats { padding: 4rem 2rem; display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; max-width: 900px; margin: 0 auto; }
  .stat-card { text-align: center; padding: 2rem; background: var(--dark-card); border-radius: 16px; border: 1px solid rgba(108,92,231,0.1); }
  .stat-number { font-size: 2.5rem; font-weight: 800; background: var(--gradient-1); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .stat-label { color: var(--text-muted); font-size: 0.9rem; margin-top: 0.5rem; }
  .features { padding: 6rem 2rem; max-width: 1200px; margin: 0 auto; }
  .features h2 { text-align: center; font-size: 2.5rem; font-weight: 800; margin-bottom: 0.5rem; }
  .features h2 .gradient { background: var(--gradient-1); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .features .subtitle { text-align: center; color: var(--text-muted); margin-bottom: 3rem; font-size: 1.1rem; }
  .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
  .feature-card { padding: 2rem; background: var(--dark-card); border-radius: 16px; border: 1px solid rgba(108,92,231,0.1); transition: all 0.3s; cursor: pointer; }
  .feature-card:hover { border-color: var(--primary); transform: translateY(-4px); box-shadow: 0 16px 40px rgba(108,92,231,0.15); }
  .feature-icon { width: 48px; height: 48px; background: var(--gradient-1); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem; font-size: 1.5rem; }
  .feature-card h3 { font-size: 1.2rem; font-weight: 700; margin-bottom: 0.5rem; }
  .feature-card p { color: var(--text-muted); font-size: 0.9rem; line-height: 1.5; }
  .pricing { padding: 6rem 2rem; text-align: center; }
  .pricing h2 { font-size: 2.5rem; font-weight: 800; margin-bottom: 0.5rem; }
  .pricing h2 .gradient { background: var(--gradient-1); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .pricing .subtitle { color: var(--text-muted); margin-bottom: 3rem; font-size: 1.1rem; }
  .pricing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; max-width: 1000px; margin: 0 auto; }
  .pricing-card { padding: 2.5rem 2rem; background: var(--dark-card); border-radius: 16px; border: 1px solid rgba(108,92,231,0.1); text-align: center; transition: all 0.3s; }
  .pricing-card:hover { transform: translateY(-4px); }
  .pricing-card.popular { border-color: var(--primary); position: relative; }
  .pricing-card.popular::before { content: 'Most Popular'; position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: var(--gradient-1); color: white; padding: 0.25rem 1rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600; }
  .pricing-tier { font-size: 1.1rem; color: var(--text-muted); font-weight: 600; }
  .pricing-price { font-size: 3rem; font-weight: 800; margin: 1rem 0; }
  .pricing-price .month { font-size: 0.9rem; color: var(--text-muted); }
  .pricing-features { list-style: none; padding: 0; margin: 1.5rem 0; }
  .pricing-features li { padding: 0.5rem 0; color: var(--text-muted); font-size: 0.9rem; }
  .pricing-features li::before { content: '✓'; color: var(--accent); margin-right: 0.5rem; }
  .cta-section { padding: 6rem 2rem; text-align: center; background: var(--gradient-2); position: relative; }
  .cta-section::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 50% 50%, rgba(108,92,231,0.15), transparent 70%); }
  .cta-section h2 { font-size: 2.5rem; font-weight: 800; margin-bottom: 1rem; }
  .cta-section p { color: var(--text-muted); font-size: 1.1rem; margin-bottom: 2rem; max-width: 500px; margin-left: auto; margin-right: auto; }
  .cta-buttons { display: flex; gap: 1rem; justify-content: center; }
  .footer { padding: 3rem 2rem; border-top: 1px solid rgba(108,92,231,0.1); }
  .footer-inner { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 2rem; }
  .footer-brand .logo { font-size: 1.3rem; font-weight: 700; color: var(--primary); margin-bottom: 1rem; }
  .footer-brand p { color: var(--text-muted); font-size: 0.85rem; line-height: 1.5; }
  .footer-col h4 { font-size: 0.9rem; font-weight: 600; margin-bottom: 1rem; color: var(--text); }
  .footer-col ul { list-style: none; }
  .footer-col ul li { padding: 0.3rem 0; }
  .footer-col ul li a { color: var(--text-muted); text-decoration: none; font-size: 0.85rem; transition: color 0.3s; }
  .footer-col ul li a:hover { color: var(--primary-light); }
  .footer-bottom { max-width: 1200px; margin: 2rem auto 0; padding-top: 1rem; border-top: 1px solid rgba(108,92,231,0.05); display: flex; justify-content: space-between; color: var(--text-muted); font-size: 0.8rem; }
  .element-highlight { outline: 2px solid #6C5CE7; outline-offset: 2px; cursor: pointer; transition: outline-color 0.2s; }
  .element-highlight:hover { outline-color: #A29BFE; }
  [data-element-id] { cursor: pointer; transition: outline 0.2s, outline-offset 0.2s; }
  [data-element-id].selected { outline: 2px solid #6C5CE7; outline-offset: 2px; }
  [data-element-id]:hover { outline: 1px dashed rgba(108,92,231,0.5); outline-offset: 2px; }
</style>
</head>
<body>
  <nav data-element-id="nav" class="nav">
    <div class="nav-logo"><span>Nexus</span></div>
    <ul class="nav-links">
      <li><a href="#features">Features</a></li>
      <li><a href="#pricing">Pricing</a></li>
      <li><a href="#about">About</a></li>
      <li><a href="#docs">Docs</a></li>
    </ul>
    <button class="nav-cta">Get Started Free</button>
  </nav>

  <section data-element-id="hero" class="hero">
    <div class="hero-badge">&#9733; New: AI Insights Engine v2.0</div>
    <h1>Transform Data Into <span class="gradient">Actionable Intelligence</span></h1>
    <p>Nexus uses advanced AI models to analyze your data streams in real-time, delivering insights that drive growth and efficiency.</p>
    <div class="hero-buttons">
      <button class="btn-primary">Start Free Trial</button>
      <button class="btn-secondary">Watch Demo &#9654;</button>
    </div>
  </section>

  <section data-element-id="stats" class="stats">
    <div class="stat-card">
      <div class="stat-number">10M+</div>
      <div class="stat-label">Data Points Processed</div>
    </div>
    <div class="stat-card">
      <div class="stat-number">500+</div>
      <div class="stat-label">Enterprise Clients</div>
    </div>
    <div class="stat-card">
      <div class="stat-number">99.9%</div>
      <div class="stat-label">Uptime Guarantee</div>
    </div>
  </section>

  <section data-element-id="features" class="features">
    <h2>Powerful <span class="gradient">Features</span></h2>
    <p class="subtitle">Everything you need to turn data into decisions</p>
    <div class="features-grid">
      <div data-element-id="feature-1" class="feature-card">
        <div class="feature-icon">&#128202;</div>
        <h3>Real-time Analytics</h3>
        <p>Process millions of data points in milliseconds with our distributed computing engine.</p>
      </div>
      <div data-element-id="feature-2" class="feature-card">
        <div class="feature-icon">&#129302;</div>
        <h3>AI-Powered Insights</h3>
        <p>Our ML models identify patterns and anomalies humans miss, delivering predictive intelligence.</p>
      </div>
      <div data-element-id="feature-3" class="feature-card">
        <div class="feature-icon">&#128274;</div>
        <h3>Enterprise Security</h3>
        <p>SOC 2 Type II certified with end-to-end encryption and role-based access controls.</p>
      </div>
      <div data-element-id="feature-4" class="feature-card">
        <div class="feature-icon">&#9881;</div>
        <h3>Custom Dashboards</h3>
        <p>Build personalized dashboards with drag-and-drop widgets and real-time data feeds.</p>
      </div>
      <div data-element-id="feature-5" class="feature-card">
        <div class="feature-icon">&#128279;</div>
        <h3>Seamless Integrations</h3>
        <p>Connect to 200+ data sources including Salesforce, HubSpot, and custom APIs.</p>
      </div>
      <div data-element-id="feature-6" class="feature-card">
        <div class="feature-icon">&#128640;</div>
        <h3>Auto-scaling Infrastructure</h3>
        <p>Cloud-native architecture that scales from 1 to 100M requests without configuration.</p>
      </div>
    </div>
  </section>

  <section data-element-id="pricing" class="pricing">
    <h2>Simple <span class="gradient">Pricing</span></h2>
    <p class="subtitle">Start free. Scale as you grow. No hidden fees.</p>
    <div class="pricing-grid">
      <div data-element-id="pricing-starter" class="pricing-card">
        <div class="pricing-tier">Starter</div>
        <div class="pricing-price">$0<span class="month">/mo</span></div>
        <ul class="pricing-features">
          <li>5,000 data points/day</li>
          <li>3 dashboards</li>
          <li>Basic AI insights</li>
          <li>Email support</li>
        </ul>
        <button class="btn-secondary" style="width:100%">Get Started</button>
      </div>
      <div data-element-id="pricing-pro" class="pricing-card popular">
        <div class="pricing-tier">Professional</div>
        <div class="pricing-price">$49<span class="month">/mo</span></div>
        <ul class="pricing-features">
          <li>Unlimited data points</li>
          <li>Unlimited dashboards</li>
          <li>Advanced AI insights</li>
          <li>Priority support</li>
          <li>Custom integrations</li>
        </ul>
        <button class="btn-primary" style="width:100%">Start Trial</button>
      </div>
      <div data-element-id="pricing-enterprise" class="pricing-card">
        <div class="pricing-tier">Enterprise</div>
        <div class="pricing-price">Custom</div>
        <ul class="pricing-features">
          <li>Everything in Pro</li>
          <li>Dedicated infrastructure</li>
          <li>Custom ML models</li>
          <li>24/7 phone support</li>
          <li>SLA guarantees</li>
        </ul>
        <button class="btn-secondary" style="width:100%">Contact Sales</button>
      </div>
    </div>
  </section>

  <section data-element-id="cta" class="cta-section">
    <h2>Ready to <span style="background: var(--gradient-1); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Transform</span> Your Data?</h2>
    <p>Join 500+ companies already using Nexus to drive smarter decisions.</p>
    <div class="cta-buttons">
      <button class="btn-primary">Start Free Trial</button>
      <button class="btn-secondary">Schedule Demo</button>
    </div>
  </section>

  <footer data-element-id="footer" class="footer">
    <div class="footer-inner">
      <div class="footer-brand">
        <div class="logo">Nexus</div>
        <p>AI-powered analytics platform that transforms raw data into actionable business intelligence.</p>
      </div>
      <div class="footer-col">
        <h4>Product</h4>
        <ul>
          <li><a href="#">Features</a></li>
          <li><a href="#">Pricing</a></li>
          <li><a href="#">Integrations</a></li>
          <li><a href="#">Changelog</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Company</h4>
        <ul>
          <li><a href="#">About</a></li>
          <li><a href="#">Blog</a></li>
          <li><a href="#">Careers</a></li>
          <li><a href="#">Press</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Legal</h4>
        <ul>
          <li><a href="#">Privacy</a></li>
          <li><a href="#">Terms</a></li>
          <li><a href="#">Security</a></li>
          <li><a href="#">GDPR</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>&copy; 2025 Nexus. All rights reserved.</span>
      <span>Made with &#10084; by Forge</span>
    </div>
  </footer>
</body>
</html>
`

// ─── Layer Tree Data ───────────────────────────────────────────────────────
interface LayerItem {
  id: string
  name: string
  type: string
  icon: React.ReactNode
  children?: LayerItem[]
  visible: boolean
  locked: boolean
}

const defaultLayers: LayerItem[] = [
  {
    id: 'nav', name: 'Navigation Bar', type: 'nav', icon: <Layout size={14} />,
    visible: true, locked: false
  },
  {
    id: 'hero', name: 'Hero Section', type: 'section', icon: <Maximize2 size={14} />,
    visible: true, locked: false
  },
  {
    id: 'stats', name: 'Stats Section', type: 'section', icon: <Grid3X3 size={14} />,
    visible: true, locked: false
  },
  {
    id: 'features', name: 'Features Section', type: 'section', icon: <Sparkles size={14} />,
    visible: true, locked: false,
    children: [
      { id: 'feature-1', name: 'Feature Card 1', type: 'card', icon: <Square size={12} />, visible: true, locked: false },
      { id: 'feature-2', name: 'Feature Card 2', type: 'card', icon: <Square size={12} />, visible: true, locked: false },
      { id: 'feature-3', name: 'Feature Card 3', type: 'card', icon: <Square size={12} />, visible: true, locked: false },
      { id: 'feature-4', name: 'Feature Card 4', type: 'card', icon: <Square size={12} />, visible: true, locked: false },
      { id: 'feature-5', name: 'Feature Card 5', type: 'card', icon: <Square size={12} />, visible: true, locked: false },
      { id: 'feature-6', name: 'Feature Card 6', type: 'card', icon: <Square size={12} />, visible: true, locked: false },
    ]
  },
  {
    id: 'pricing', name: 'Pricing Section', type: 'section', icon: <Hash size={14} />,
    visible: true, locked: false,
    children: [
      { id: 'pricing-starter', name: 'Starter Card', type: 'card', icon: <Square size={12} />, visible: true, locked: false },
      { id: 'pricing-pro', name: 'Pro Card', type: 'card', icon: <Square size={12} />, visible: true, locked: false },
      { id: 'pricing-enterprise', name: 'Enterprise Card', type: 'card', icon: <Square size={12} />, visible: true, locked: false },
    ]
  },
  {
    id: 'cta', name: 'CTA Section', type: 'section', icon: <Wand2 size={14} />,
    visible: true, locked: false
  },
  {
    id: 'footer', name: 'Footer', type: 'footer', icon: <Globe size={14} />,
    visible: true, locked: false
  },
]

// ─── Component Library Data ────────────────────────────────────────────────
interface ComponentItem {
  id: string
  name: string
  category: string
  preview: string
  description: string
}

const componentCategories = [
  { id: 'navigation', name: 'Navigation', icon: <Layout size={16} /> },
  { id: 'hero', name: 'Hero', icon: <Maximize2 size={16} /> },
  { id: 'content', name: 'Content', icon: <Type size={16} /> },
  { id: 'cards', name: 'Cards', icon: <Square size={16} /> },
  { id: 'forms', name: 'Forms', icon: <Move size={16} /> },
  { id: 'footer', name: 'Footer', icon: <Globe size={16} /> },
  { id: 'media', name: 'Media', icon: <Image size={16} /> },
]

const componentItems: ComponentItem[] = [
  { id: 'comp-nav-simple', name: 'Simple Nav', category: 'navigation', preview: '≡', description: 'Clean minimal navigation bar' },
  { id: 'comp-nav-sticky', name: 'Sticky Nav', category: 'navigation', preview: '≡⊙', description: 'Sticky navigation with CTA' },
  { id: 'comp-nav-mega', name: 'Mega Nav', category: 'navigation', preview: '≡≡≡', description: 'Full mega menu navigation' },
  { id: 'comp-hero-classic', name: 'Classic Hero', category: 'hero', preview: 'H↕', description: 'Centered hero with gradient' },
  { id: 'comp-hero-split', name: 'Split Hero', category: 'hero', preview: 'H|↕', description: 'Side-by-side hero layout' },
  { id: 'comp-hero-video', name: 'Video Hero', category: 'hero', preview: 'H▶', description: 'Hero with video background' },
  { id: 'comp-content-text', name: 'Text Block', category: 'content', preview: 'T¶', description: 'Rich text content section' },
  { id: 'comp-content-timeline', name: 'Timeline', category: 'content', preview: 'T↕↕', description: 'Vertical timeline layout' },
  { id: 'comp-content-testimonial', name: 'Testimonials', category: 'content', preview: 'T💬', description: 'Customer testimonial carousel' },
  { id: 'comp-card-basic', name: 'Basic Card', category: 'cards', preview: '□', description: 'Simple content card' },
  { id: 'comp-card-pricing', name: 'Pricing Card', category: 'cards', preview: '□$', description: 'Pricing tier card' },
  { id: 'comp-card-team', name: 'Team Card', category: 'cards', preview: '□☺', description: 'Team member profile card' },
  { id: 'comp-card-feature', name: 'Feature Card', category: 'cards', preview: '□✦', description: 'Feature showcase card' },
  { id: 'comp-card-stats', name: 'Stats Card', category: 'cards', preview: '□#', description: 'Statistics display card' },
  { id: 'comp-form-contact', name: 'Contact Form', category: 'forms', preview: 'F✉', description: 'Contact form with validation' },
  { id: 'comp-form-signup', name: 'Signup Form', category: 'forms', preview: 'F+', description: 'Registration/signup form' },
  { id: 'comp-form-search', name: 'Search Bar', category: 'forms', preview: 'F🔍', description: 'Search input component' },
  { id: 'comp-footer-minimal', name: 'Minimal Footer', category: 'footer', preview: '—', description: 'Simple centered footer' },
  { id: 'comp-footer-full', name: 'Full Footer', category: 'footer', preview: '≡≡', description: 'Multi-column footer' },
  { id: 'comp-media-gallery', name: 'Gallery', category: 'media', preview: '🖼', description: 'Image gallery grid' },
  { id: 'comp-media-carousel', name: 'Carousel', category: 'media', preview: '🖼▸', description: 'Image carousel slider' },
]

// ─── Design Library Data ───────────────────────────────────────────────────
interface DesignBlock {
  id: string
  name: string
  category: string
  preview: string
}

const designBlocks: DesignBlock[] = [
  // Buttons
  { id: 'btn-primary-gradient', name: 'Gradient Primary', category: 'buttons', preview: 'Primary →' },
  { id: 'btn-outline-glow', name: 'Outline Glow', category: 'buttons', preview: 'Outline →' },
  { id: 'btn-pill-glass', name: 'Pill Glass', category: 'buttons', preview: '( Pill )' },
  { id: 'btn-icon-arrow', name: 'Icon Arrow', category: 'buttons', preview: '→ Arrow' },
  { id: 'btn-3d-shadow', name: '3D Shadow', category: 'buttons', preview: '3D Btn' },
  { id: 'btn-neon-border', name: 'Neon Border', category: 'buttons', preview: '⚡ Neon' },
  // Cards
  { id: 'card-dark-glass', name: 'Dark Glass', category: 'cards', preview: '□ Glass' },
  { id: 'card-gradient-border', name: 'Gradient Border', category: 'cards', preview: '□ Grad' },
  { id: 'card-hover-lift', name: 'Hover Lift', category: 'cards', preview: '□ Lift' },
  { id: 'card-glow-effect', name: 'Glow Effect', category: 'cards', preview: '□ Glow' },
  { id: 'card-minimal-flat', name: 'Minimal Flat', category: 'cards', preview: '□ Flat' },
  { id: 'card-pattern-bg', name: 'Pattern BG', category: 'cards', preview: '□ Pat' },
  // Inputs
  { id: 'input-glass-border', name: 'Glass Border', category: 'inputs', preview: '[ Glass ]' },
  { id: 'input-underlined', name: 'Underlined', category: 'inputs', preview: 'Underline_' },
  { id: 'input-floating-label', name: 'Floating Label', category: 'inputs', preview: '[ Float ]' },
  // Colors
  { id: 'palette-neon', name: 'Neon Palette', category: 'colors', preview: '🟣🟢🔴' },
  { id: 'palette-ocean', name: 'Ocean Palette', category: 'colors', preview: '🔵🟢⚪' },
  { id: 'palette-sunset', name: 'Sunset Palette', category: 'colors', preview: '🟡🟠🔴' },
  // Typography
  { id: 'typo-display-bold', name: 'Display Bold', category: 'typography', preview: 'ABCD' },
  { id: 'typo-serif-elegant', name: 'Serif Elegant', category: 'typography', preview: 'Abcd' },
  { id: 'typo-mono-tech', name: 'Mono Tech', category: 'typography', preview: '0x00' },
  // Animations
  { id: 'anim-fade-up', name: 'Fade Up', category: 'animations', preview: '↑ Fade' },
  { id: 'anim-slide-in', name: 'Slide In', category: 'animations', preview: '← Slide' },
  { id: 'anim-scale-pop', name: 'Scale Pop', category: 'animations', preview: '⊙ Pop' },
  { id: 'anim-rotate-in', name: 'Rotate In', category: 'animations', preview: '↻ Rotate' },
]

const designCategories = ['buttons', 'cards', 'inputs', 'colors', 'typography', 'animations']

// ─── Main Component ─────────────────────────────────────────────────────────

export default function EditorPage() {
  const store = useAppStore()
  const {
    editorPanel, inspectorTab, devicePreview, selectedElementId,
    showCodePanel, historyIndex, editorHistory,
    setEditorPanel, setInspectorTab, setDevicePreview,
    setSelectedElement, undo, redo, setShowCodePanel,
    navigate
  } = store

  const [layers, setLayers] = useState<LayerItem[]>(defaultLayers)
  const [componentSearch, setComponentSearch] = useState('')
  const [designSearch, setDesignSearch] = useState('')
  const [expandedLayers, setExpandedLayers] = useState<string[]>(['features', 'pricing'])
  const [zoom, setZoom] = useState(100)
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Inspector local states
  const [fontFamily, setFontFamily] = useState('Inter')
  const [fontSize, setFontSize] = useState(16)
  const [fontWeight, setFontWeight] = useState('400')
  const [fontColor, setFontColor] = useState('#E8E8F0')
  const [bgColor, setBgColor] = useState('#0A0A1A')
  const [bgGradient, setBgGradient] = useState('linear-gradient(135deg, #6C5CE7, #00CEC9)')
  const [bgType, setBgType] = useState<'color' | 'gradient' | 'image'>('color')
  const [borderWidth, setBorderWidth] = useState(0)
  const [borderStyle, setBorderStyle] = useState('solid')
  const [borderColor, setBorderColor] = useState('#6C5CE7')
  const [borderRadius, setBorderRadius] = useState(0)
  const [shadowType, setShadowType] = useState('none')
  const [shadowBlur, setShadowBlur] = useState(0)
  const [shadowOffset, setShadowOffset] = useState(0)
  const [shadowColor, setShadowColor] = useState('#6C5CE740')
  const [opacity, setOpacity] = useState(100)
  // Layout
  const [padding, setPadding] = useState({ top: 0, right: 0, bottom: 0, left: 0 })
  const [margin, setMargin] = useState({ top: 0, right: 0, bottom: 0, left: 0 })
  const [width, setWidth] = useState('auto')
  const [height, setHeight] = useState('auto')
  const [displayType, setDisplayType] = useState('block')
  const [flexDirection, setFlexDirection] = useState('row')
  const [flexAlign, setFlexAlign] = useState('center')
  const [flexJustify, setFlexJustify] = useState('center')
  const [positionType, setPositionType] = useState('relative')
  // Animation
  const [animType, setAnimType] = useState('fade')
  const [animDuration, setAnimDuration] = useState(500)
  const [animDelay, setAnimDelay] = useState(0)
  const [animEasing, setAnimEasing] = useState('ease')
  const [hoverEffect, setHoverEffect] = useState('none')
  const [scrollAnim, setScrollAnim] = useState('none')
  // SEO
  const [pageTitle, setPageTitle] = useState('Nexus — AI-Powered Analytics Platform')
  const [pageDescription, setPageDescription] = useState('Advanced AI analytics platform transforming data into actionable business intelligence.')
  const [ogImage, setOgImage] = useState('')
  const [keywords, setKeywords] = useState('analytics, AI, data, business intelligence')
  const [canonicalUrl, setCanonicalUrl] = useState('https://nexus.example.com')
  const [sitemapEnabled, setSitemapEnabled] = useState(true)
  // Code panel
  const [codeTab, setCodeTab] = useState<'html' | 'css' | 'js'>('html')
  const [htmlCode, setHtmlCode] = useState(defaultWebsiteHTML)
  const [cssCode, setCssCode] = useState('')
  const [jsCode, setJsCode] = useState('')

  // ─── iframe message handling ──────────────────────────────────────────
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'element-selected') {
        setSelectedElement(e.data.elementId)
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [setSelectedElement])

  // ─── Send selection highlight to iframe ───────────────────────────────
  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'highlight-element',
        elementId: selectedElementId
      }, '*')
    }
  }, [selectedElementId])

  // ─── Inject click listener into iframe on load ────────────────────────
  const handleIframeLoad = useCallback(() => {
    setIframeLoaded(true)
    try {
      const iframeDoc = iframeRef.current?.contentDocument
      if (!iframeDoc) return

      // Inject a script that handles click events and selection
      const script = iframeDoc.createElement('script')
      script.textContent = `
        (function() {
          document.addEventListener('click', function(e) {
            var target = e.target;
            // Find closest element with data-element-id
            while (target && !target.getAttribute('data-element-id')) {
              target = target.parentElement;
            }
            if (target && target.getAttribute('data-element-id')) {
              e.preventDefault();
              e.stopPropagation();
              // Remove previous selection
              var prev = document.querySelector('.selected');
              if (prev) prev.classList.remove('selected');
              // Add selection
              target.classList.add('selected');
              // Notify parent
              window.parent.postMessage({
                type: 'element-selected',
                elementId: target.getAttribute('data-element-id')
              }, '*');
            }
          }, true);

          // Listen for highlight messages from parent
          window.addEventListener('message', function(e) {
            if (e.data && e.data.type === 'highlight-element') {
              var prev = document.querySelector('.selected');
              if (prev) prev.classList.remove('selected');
              if (e.data.elementId) {
                var el = document.querySelector('[data-element-id="' + e.data.elementId + '"]');
                if (el) el.classList.add('selected');
              }
            }
          });
        })();
      `
      iframeDoc.body.appendChild(script)
    } catch {
      // Cross-origin restrictions may prevent this
    }
  }, [])

  // ─── Layer visibility/lock toggles ────────────────────────────────────
  const toggleLayerVisibility = (id: string) => {
    setLayers(prev => prev.map(l => {
      if (l.id === id) return { ...l, visible: !l.visible }
      if (l.children) return { ...l, children: l.children.map(c => c.id === id ? { ...c, visible: !c.visible } : c) }
      return l
    }))
    toast({ title: `Element visibility toggled`, description: `${id} visibility changed` })
  }

  const toggleLayerLock = (id: string) => {
    setLayers(prev => prev.map(l => {
      if (l.id === id) return { ...l, locked: !l.locked }
      if (l.children) return { ...l, children: l.children.map(c => c.id === id ? { ...c, locked: !c.locked } : c) }
      return l
    }))
  }

  const duplicateLayer = (id: string) => {
    toast({ title: 'Element duplicated', description: `${id} has been duplicated` })
  }

  const deleteLayer = (id: string) => {
    setLayers(prev => prev.filter(l => l.id !== id).map(l => ({
      ...l,
      children: l.children?.filter(c => c.id !== id)
    })))
    if (selectedElementId === id) setSelectedElement(null)
    toast({ title: 'Element deleted', description: `${id} has been removed` })
  }

  const toggleExpand = (id: string) => {
    setExpandedLayers(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  // ─── Component add ────────────────────────────────────────────────────
  const addComponent = (comp: ComponentItem) => {
    toast({ title: 'Component added', description: `${comp.name} has been added to the canvas` })
  }

  // ─── Design block add ─────────────────────────────────────────────────
  const addDesignBlock = (block: DesignBlock) => {
    toast({ title: 'Design block applied', description: `${block.name} has been applied` })
  }

  // ─── Device frame widths ──────────────────────────────────────────────
  const getDeviceWidth = () => {
    switch (devicePreview) {
      case 'desktop': return '100%'
      case 'tablet': return 768
      case 'mobile': return 375
      case 'landscape': return 1024
      case 'portrait': return 414
      default: return '100%'
    }
  }

  const getDeviceHeight = () => {
    switch (devicePreview) {
      case 'desktop': return '100%'
      case 'tablet': return 1024
      case 'mobile': return 667
      case 'landscape': return 768
      case 'portrait': return 896
      default: return '100%'
    }
  }

  const isDesktop = devicePreview === 'desktop'

  // ─── Save/Export/Deploy handlers ──────────────────────────────────────
  const handleSave = () => {
    toast({ title: 'Project saved', description: 'All changes have been saved successfully' })
  }

  const handleExport = () => {
    toast({ title: 'Project exported', description: 'HTML/CSS/JS files have been exported' })
  }

  const handleDeploy = () => {
    toast({ title: 'Deployment started', description: 'Your site is being deployed to production' })
  }

  // ─── Selected element info ────────────────────────────────────────────
  const getSelectedElementName = () => {
    for (const layer of layers) {
      if (layer.id === selectedElementId) return layer.name
      if (layer.children) {
        for (const child of layer.children) {
          if (child.id === selectedElementId) return child.name
        }
      }
    }
    return selectedElementId || ''
  }

  // ─── RENDER ───────────────────────────────────────────────────────────

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0D0D1A] text-[#E8E8F0] overflow-hidden">
      {/* ── TOP TOOLBAR ────────────────────────────────────────────────── */}
      <div className="h-12 flex items-center justify-between px-3 border-b border-[#2A2A4A]/60 bg-[#0D0D1A]/90 backdrop-blur-sm z-50 shrink-0">
        {/* Left section */}
        <div className="flex items-center gap-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-[#8888AA] hover:text-[#E8E8F0] hover:bg-[#1A1A3A]"
                onClick={() => navigate('dashboard')}
              >
                <ArrowLeft size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-[#1A1A3A] text-[#E8E8F0] border-[#2A2A4A]">Back to Dashboard</TooltipContent>
          </Tooltip>

          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#6C5CE7]" />
            <span className="font-bold text-sm bg-gradient-to-r from-[#6C5CE7] to-[#00CEC9] bg-clip-text text-transparent">Forge</span>
            <Separator orientation="vertical" className="h-5 bg-[#2A2A4A]" />
            <span className="text-sm font-medium text-[#8888AA]">Nexus Project</span>
          </div>
        </div>

        {/* Center section - undo/redo + device preview */}
        <div className="flex items-center gap-2">
          {/* Undo/Redo */}
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-[#8888AA] hover:text-[#E8E8F0] hover:bg-[#1A1A3A] disabled:opacity-40"
                  onClick={undo}
                  disabled={historyIndex <= 0}
                >
                  <Undo2 size={15} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-[#1A1A3A] text-[#E8E8F0] border-[#2A2A4A]">Undo (Ctrl+Z)</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-[#8888AA] hover:text-[#E8E8F0] hover:bg-[#1A1A3A] disabled:opacity-40"
                  onClick={redo}
                  disabled={historyIndex >= editorHistory.length - 1}
                >
                  <Redo2 size={15} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-[#1A1A3A] text-[#E8E8F0] border-[#2A2A4A]">Redo (Ctrl+Shift+Z)</TooltipContent>
            </Tooltip>
          </div>

          <Separator orientation="vertical" className="h-5 bg-[#2A2A4A] mx-1" />

          {/* Device Preview Switcher */}
          <div className="flex items-center gap-1 bg-[#1A1A3A] rounded-lg p-1">
            {([
              { device: 'desktop' as const, icon: <Monitor size={15} />, label: 'Desktop' },
              { device: 'tablet' as const, icon: <Tablet size={15} />, label: 'Tablet' },
              { device: 'mobile' as const, icon: <Smartphone size={15} />, label: 'Mobile' },
            ]).map(({ device, icon, label }) => (
              <Tooltip key={device}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-7 w-7 rounded-md transition-all ${
                      devicePreview === device
                        ? 'bg-[#6C5CE7] text-white shadow-md shadow-[#6C5CE7]/30'
                        : 'text-[#8888AA] hover:text-[#E8E8F0] hover:bg-[#2A2A4A]'
                    }`}
                    onClick={() => setDevicePreview(device)}
                  >
                    {icon}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-[#1A1A3A] text-[#E8E8F0] border-[#2A2A4A]">{label}</TooltipContent>
              </Tooltip>
            ))}
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-1 ml-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-[#8888AA] hover:text-[#E8E8F0] hover:bg-[#1A1A3A]"
                  onClick={() => setZoom(Math.max(50, zoom - 10))}
                >
                  <ZoomOut size={14} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-[#1A1A3A] text-[#E8E8F0] border-[#2A2A4A]">Zoom Out</TooltipContent>
            </Tooltip>
            <span className="text-xs text-[#8888AA] w-8 text-center">{zoom}%</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-[#8888AA] hover:text-[#E8E8F0] hover:bg-[#1A1A3A]"
                  onClick={() => setZoom(Math.min(200, zoom + 10))}
                >
                  <ZoomIn size={14} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-[#1A1A3A] text-[#E8E8F0] border-[#2A2A4A]">Zoom In</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Right section - actions */}
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 ${showCodePanel ? 'bg-[#6C5CE7] text-white' : 'text-[#8888AA] hover:text-[#E8E8F0] hover:bg-[#1A1A3A]'}`}
                onClick={() => setShowCodePanel(!showCodePanel)}
              >
                <Code2 size={15} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-[#1A1A3A] text-[#E8E8F0] border-[#2A2A4A]">Toggle Code Panel</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="h-5 bg-[#2A2A4A]" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-[#8888AA] hover:text-[#E8E8F0] hover:bg-[#1A1A3A] gap-1.5"
                onClick={handleSave}
              >
                <Save size={14} />
                <span className="text-xs font-medium">Save</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-[#1A1A3A] text-[#E8E8F0] border-[#2A2A4A]">Save (Ctrl+S)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-[#8888AA] hover:text-[#E8E8F0] hover:bg-[#1A1A3A] gap-1.5"
                onClick={handleExport}
              >
                <Download size={14} />
                <span className="text-xs font-medium">Export</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-[#1A1A3A] text-[#E8E8F0] border-[#2A2A4A]">Export HTML/CSS/JS</TooltipContent>
          </Tooltip>

          <Button
            size="sm"
            className="h-8 bg-gradient-to-r from-[#6C5CE7] to-[#00CEC9] text-white hover:shadow-lg hover:shadow-[#6C5CE7]/30 gap-1.5 font-semibold text-xs"
            onClick={handleDeploy}
          >
            <Rocket size={14} />
            Deploy
          </Button>
        </div>
      </div>

      {/* ── MAIN CONTENT AREA ─────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* ── LEFT PANEL ────────────────────────────────────────────────── */}
        <motion.div
          className="w-[280px] shrink-0 border-r border-[#2A2A4A]/60 bg-[#0D0D1A] flex flex-col overflow-hidden"
          initial={{ x: 0 }}
          animate={{ x: 0 }}
        >
          {/* Panel Tabs */}
          <div className="px-2 pt-2 pb-1">
            <Tabs value={editorPanel} onValueChange={(v) => setEditorPanel(v as any)}>
              <TabsList className="w-full bg-[#1A1A3A] h-9 p-1 rounded-lg">
                <TabsTrigger
                  value="layers"
                  className="flex-1 data-[state=active]:bg-[#6C5CE7] data-[state=active]:text-white text-[#8888AA] h-7 rounded-md text-xs font-medium gap-1"
                >
                  <Layers size={13} />
                  Layers
                </TabsTrigger>
                <TabsTrigger
                  value="components"
                  className="flex-1 data-[state=active]:bg-[#6C5CE7] data-[state=active]:text-white text-[#8888AA] h-7 rounded-md text-xs font-medium gap-1"
                >
                  <Grid3X3 size={13} />
                  Components
                </TabsTrigger>
                <TabsTrigger
                  value="design-library"
                  className="flex-1 data-[state=active]:bg-[#6C5CE7] data-[state=active]:text-white text-[#8888AA] h-7 rounded-md text-xs font-medium gap-1"
                >
                  <Palette size={13} />
                  Design
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <Separator className="bg-[#2A2A4A]/40" />

          {/* Panel Content */}
          <ScrollArea className="flex-1">
            <AnimatePresence mode="wait">
              {/* ── LAYERS TAB ─────────────────────────────────────────── */}
              {editorPanel === 'layers' && (
                <motion.div
                  key="layers"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="p-3"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#8888AA] uppercase tracking-wider">Page Structure</span>
                    <Badge variant="outline" className="text-[10px] bg-[#1A1A3A] text-[#8888AA] border-[#2A2A4A] h-5">
                      {layers.length} elements
                    </Badge>
                  </div>

                  {layers.map((layer) => (
                    <div key={layer.id}>
                      <motion.div
                        className={`group flex items-center gap-1.5 py-1.5 px-2 rounded-md cursor-pointer transition-all ${
                          selectedElementId === layer.id
                            ? 'bg-[#6C5CE7]/15 border border-[#6C5CE7]/30'
                            : 'hover:bg-[#1A1A3A] border border-transparent'
                        }`}
                        whileHover={{ scale: 1.01 }}
                        onClick={() => setSelectedElement(layer.id)}
                      >
                        {layer.children && (
                          <button
                            className="h-5 w-5 flex items-center justify-center text-[#8888AA] hover:text-[#E8E8F0]"
                            onClick={(e) => { e.stopPropagation(); toggleExpand(layer.id) }}
                          >
                            {expandedLayers.includes(layer.id) ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                          </button>
                        )}
                        {!layer.children && <div className="w-5" />}
                        <span className="text-[#8888AA] shrink-0">{layer.icon}</span>
                        <span className={`text-xs font-medium truncate ${
                          selectedElementId === layer.id ? 'text-[#A29BFE]' : 'text-[#E8E8F0]'
                        }`}>{layer.name}</span>
                        <div className="flex-1" />
                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            className="h-5 w-5 flex items-center justify-center text-[#8888AA] hover:text-[#E8E8F0] rounded"
                            onClick={(e) => { e.stopPropagation(); toggleLayerVisibility(layer.id) }}
                          >
                            {layer.visible ? <Eye size={11} /> : <EyeOff size={11} />}
                          </button>
                          <button
                            className="h-5 w-5 flex items-center justify-center text-[#8888AA] hover:text-[#E8E8F0] rounded"
                            onClick={(e) => { e.stopPropagation(); toggleLayerLock(layer.id) }}
                          >
                            {layer.locked ? <Lock size={11} /> : <Unlock size={11} />}
                          </button>
                          <button
                            className="h-5 w-5 flex items-center justify-center text-[#8888AA] hover:text-[#A29BFE] rounded"
                            onClick={(e) => { e.stopPropagation(); duplicateLayer(layer.id) }}
                          >
                            <Copy size={11} />
                          </button>
                          <button
                            className="h-5 w-5 flex items-center justify-center text-[#8888AA] hover:text-[#FF6B6B] rounded"
                            onClick={(e) => { e.stopPropagation(); deleteLayer(layer.id) }}
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </motion.div>

                      {/* Children */}
                      <AnimatePresence>
                        {layer.children && expandedLayers.includes(layer.id) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="ml-4 pl-2 border-l border-[#2A2A4A]/40"
                          >
                            {layer.children.map((child) => (
                              <motion.div
                                key={child.id}
                                className={`group flex items-center gap-1.5 py-1 px-2 rounded-md cursor-pointer transition-all ${
                                  selectedElementId === child.id
                                    ? 'bg-[#6C5CE7]/15 border border-[#6C5CE7]/30'
                                    : 'hover:bg-[#1A1A3A] border border-transparent'
                                }`}
                                whileHover={{ scale: 1.01 }}
                                onClick={() => setSelectedElement(child.id)}
                              >
                                <span className="text-[#8888AA] shrink-0">{child.icon}</span>
                                <span className={`text-xs font-medium truncate ${
                                  selectedElementId === child.id ? 'text-[#A29BFE]' : 'text-[#E8E8F0]'
                                }`}>{child.name}</span>
                                <div className="flex-1" />
                                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    className="h-5 w-5 flex items-center justify-center text-[#8888AA] hover:text-[#E8E8F0] rounded"
                                    onClick={(e) => { e.stopPropagation(); toggleLayerVisibility(child.id) }}
                                  >
                                    {child.visible ? <Eye size={11} /> : <EyeOff size={11} />}
                                  </button>
                                  <button
                                    className="h-5 w-5 flex items-center justify-center text-[#8888AA] hover:text-[#E8E8F0] rounded"
                                    onClick={(e) => { e.stopPropagation(); toggleLayerLock(child.id) }}
                                  >
                                    {child.locked ? <Lock size={11} /> : <Unlock size={11} />}
                                  </button>
                                  <button
                                    className="h-5 w-5 flex items-center justify-center text-[#8888AA] hover:text-[#FF6B6B] rounded"
                                    onClick={(e) => { e.stopPropagation(); deleteLayer(child.id) }}
                                  >
                                    <Trash2 size={11} />
                                  </button>
                                </div>
                              </motion.div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}

                  <div className="mt-3 flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-[#2A2A4A] bg-[#1A1A3A] text-[#8888AA] hover:text-[#E8E8F0] hover:bg-[#2A2A4A] h-8 text-xs gap-1.5"
                    >
                      <Plus size={13} />
                      Add Section
                    </Button>
                  </div>

                  {/* Keyboard shortcuts */}
                  <div className="mt-4 p-2 rounded-md bg-[#1A1A3A]/50 border border-[#2A2A4A]/30">
                    <span className="text-[10px] font-semibold text-[#8888AA] uppercase tracking-wider">Shortcuts</span>
                    <div className="mt-1.5 space-y-1">
                      {[
                        { key: 'Ctrl+Z', action: 'Undo' },
                        { key: 'Ctrl+Shift+Z', action: 'Redo' },
                        { key: 'Ctrl+S', action: 'Save' },
                        { key: 'Delete', action: 'Remove element' },
                        { key: 'Ctrl+D', action: 'Duplicate' },
                      ].map(({ key, action }) => (
                        <div key={key} className="flex items-center justify-between">
                          <span className="text-[10px] text-[#8888AA]">{action}</span>
                          <kbd className="text-[10px] bg-[#2A2A4A] text-[#8888AA] px-1.5 py-0.5 rounded font-mono">{key}</kbd>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── COMPONENTS TAB ─────────────────────────────────────── */}
              {editorPanel === 'components' && (
                <motion.div
                  key="components"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="p-3"
                >
                  {/* Search */}
                  <div className="relative mb-3">
                    <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8888AA]" />
                    <Input
                      placeholder="Search components..."
                      value={componentSearch}
                      onChange={(e) => setComponentSearch(e.target.value)}
                      className="h-8 bg-[#1A1A3A] border-[#2A2A4A] text-[#E8E8F0] placeholder:text-[#8888AA] pl-8 text-xs rounded-lg"
                    />
                  </div>

                  {/* Categories */}
                  {componentCategories.map((cat) => {
                    const filtered = componentItems
                      .filter(c => c.category === cat.id)
                      .filter(c => componentSearch === '' || c.name.toLowerCase().includes(componentSearch.toLowerCase()))

                    if (filtered.length === 0) return null

                    return (
                      <div key={cat.id} className="mb-4">
                        <div className="flex items-center gap-1.5 mb-2">
                          <span className="text-[#8888AA]">{cat.icon}</span>
                          <span className="text-xs font-semibold text-[#8888AA] uppercase tracking-wider">{cat.name}</span>
                          <Badge variant="outline" className="text-[10px] bg-[#1A1A3A] text-[#8888AA] border-[#2A2A4A] h-4 ml-1">
                            {filtered.length}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-1.5">
                          {filtered.map((comp) => (
                            <motion.div
                              key={comp.id}
                              whileHover={{ scale: 1.03, y: -2 }}
                              whileTap={{ scale: 0.97 }}
                            >
                              <Card
                                className="bg-[#1A1A3A] border-[#2A2A4A] hover:border-[#6C5CE7]/50 cursor-pointer transition-colors overflow-hidden"
                                onClick={() => addComponent(comp)}
                              >
                                <CardContent className="p-2.5">
                                  <div className="h-8 bg-[#2A2A4A] rounded-md flex items-center justify-center text-xs font-mono text-[#8888AA] mb-1.5">
                                    {comp.preview}
                                  </div>
                                  <span className="text-[11px] font-medium text-[#E8E8F0] truncate block">{comp.name}</span>
                                  <span className="text-[10px] text-[#8888AA] truncate block">{comp.description}</span>
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </motion.div>
              )}

              {/* ── DESIGN LIBRARY TAB ─────────────────────────────────── */}
              {editorPanel === 'design-library' && (
                <motion.div
                  key="design-library"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="p-3"
                >
                  {/* Search */}
                  <div className="relative mb-3">
                    <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8888AA]" />
                    <Input
                      placeholder="Search designs..."
                      value={designSearch}
                      onChange={(e) => setDesignSearch(e.target.value)}
                      className="h-8 bg-[#1A1A3A] border-[#2A2A4A] text-[#E8E8F0] placeholder:text-[#8888AA] pl-8 text-xs rounded-lg"
                    />
                  </div>

                  {/* Categories */}
                  {designCategories.map((cat) => {
                    const filtered = designBlocks
                      .filter(d => d.category === cat)
                      .filter(d => designSearch === '' || d.name.toLowerCase().includes(designSearch.toLowerCase()))

                    if (filtered.length === 0) return null

                    const catLabel = cat.charAt(0).toUpperCase() + cat.slice(1)
                    const catIcon = cat === 'buttons' ? <ToggleLeft size={13} />
                      : cat === 'cards' ? <Square size={13} />
                      : cat === 'inputs' ? <Move size={13} />
                      : cat === 'colors' ? <Palette size={13} />
                      : cat === 'typography' ? <Type size={13} />
                      : <Sparkles size={13} />

                    return (
                      <div key={cat} className="mb-4">
                        <div className="flex items-center gap-1.5 mb-2">
                          <span className="text-[#8888AA]">{catIcon}</span>
                          <span className="text-xs font-semibold text-[#8888AA] uppercase tracking-wider">{catLabel}</span>
                          <Badge variant="outline" className="text-[10px] bg-[#1A1A3A] text-[#8888AA] border-[#2A2A4A] h-4 ml-1">
                            {filtered.length}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          {filtered.map((block) => (
                            <motion.div
                              key={block.id}
                              whileHover={{ scale: 1.02, x: 4 }}
                              whileTap={{ scale: 0.98 }}
                              className="flex items-center gap-2 py-1.5 px-2 rounded-md bg-[#1A1A3A] border border-[#2A2A4A] hover:border-[#6C5CE7]/50 cursor-pointer transition-colors"
                              onClick={() => addDesignBlock(block)}
                            >
                              <div className="h-7 w-7 bg-[#2A2A4A] rounded-md flex items-center justify-center text-[10px] font-mono text-[#8888AA] shrink-0">
                                {block.preview.substring(0, 3)}
                              </div>
                              <span className="text-xs font-medium text-[#E8E8F0]">{block.name}</span>
                              <Plus size={12} className="text-[#8888AA] ml-auto" />
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </ScrollArea>
        </motion.div>

        {/* ── CENTER - LIVE PREVIEW ─────────────────────────────────────── */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#080818] relative">
          {/* Selected element info bar */}
          {selectedElementId && (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="h-8 flex items-center gap-2 px-3 bg-[#1A1A3A]/80 border-b border-[#2A2A4A]/40 shrink-0"
            >
              <Badge className="bg-[#6C5CE7] text-white text-[10px] h-5">{selectedElementId}</Badge>
              <span className="text-xs text-[#8888AA]">{getSelectedElementName()}</span>
              <div className="flex-1" />
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-[10px] text-[#8888AA] hover:text-[#E8E8F0] hover:bg-[#2A2A4A]"
                onClick={() => setSelectedElement(null)}
              >
                Deselect
              </Button>
            </motion.div>
          )}

          {/* Preview container */}
          <div className="flex-1 flex items-center justify-center overflow-auto p-4 relative">
            {/* Device frame */}
            <div
              className={`relative transition-all duration-500 ease-out ${
                !isDesktop ? 'rounded-2xl border-[3px] border-[#2A2A4A] shadow-2xl shadow-black/50' : ''
              }`}
              style={{
                width: isDesktop ? '100%' : `${getDeviceWidth()}px`,
                height: isDesktop ? '100%' : `${getDeviceHeight()}px`,
                maxWidth: isDesktop ? 'none' : `${getDeviceWidth()}px`,
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'center center',
              }}
            >
              {/* Device bezel top (not desktop) */}
              {!isDesktop && (
                <div className="h-6 bg-[#1A1A3A] rounded-t-xl flex items-center justify-center gap-2 border-b border-[#2A2A4A]">
                  <div className="w-2 h-2 rounded-full bg-[#2A2A4A]" />
                  <span className="text-[10px] text-[#8888AA] font-mono">
                    {devicePreview === 'tablet' ? '768 × 1024' : devicePreview === 'mobile' ? '375 × 667' : `${getDeviceWidth()} × ${getDeviceHeight()}`}
                  </span>
                </div>
              )}

              <iframe
                ref={iframeRef}
                srcDoc={defaultWebsiteHTML}
                className="w-full h-full bg-white rounded-none"
                style={{
                  height: isDesktop ? '100%' : `${(getDeviceHeight() as number) - 24}px`,
                  border: 'none',
                }}
                onLoad={handleIframeLoad}
                title="Website Preview"
                sandbox="allow-scripts allow-same-origin"
              />

              {/* Device bezel bottom (not desktop) */}
              {!isDesktop && (
                <div className="h-4 bg-[#1A1A3A] rounded-b-xl flex items-center justify-center">
                  <div className="w-16 h-1 rounded-full bg-[#2A2A4A]" />
                </div>
              )}
            </div>
          </div>

          {/* ── CODE PANEL (toggleable bottom) ──────────────────────────── */}
          <AnimatePresence>
            {showCodePanel && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 240 }}
                exit={{ height: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="border-t border-[#2A2A4A]/60 bg-[#0D0D1A] shrink-0 overflow-hidden"
              >
                <div className="h-full flex flex-col">
                  {/* Code panel tabs + copy */}
                  <div className="h-8 flex items-center justify-between px-3 bg-[#1A1A3A]/50 border-b border-[#2A2A4A]/40 shrink-0">
                    <Tabs value={codeTab} onValueChange={(v) => setCodeTab(v as any)}>
                      <TabsList className="bg-[#1A1A3A] h-7 p-0.5 rounded-md">
                        <TabsTrigger
                          value="html"
                          className="data-[state=active]:bg-[#6C5CE7] data-[state=active]:text-white text-[#8888AA] h-6 px-2 rounded text-[11px] font-medium gap-1"
                        >
                          <FileCode size={12} />
                          HTML
                        </TabsTrigger>
                        <TabsTrigger
                          value="css"
                          className="data-[state=active]:bg-[#6C5CE7] data-[state=active]:text-white text-[#8888AA] h-6 px-2 rounded text-[11px] font-medium gap-1"
                        >
                          <Palette size={12} />
                          CSS
                        </TabsTrigger>
                        <TabsTrigger
                          value="js"
                          className="data-[state=active]:bg-[#6C5CE7] data-[state=active]:text-white text-[#8888AA] h-6 px-2 rounded text-[11px] font-medium gap-1"
                        >
                          <Settings2 size={12} />
                          JS
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>

                    <div className="flex items-center gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-[#8888AA] hover:text-[#E8E8F0]"
                            onClick={() => {
                              navigator.clipboard.writeText(
                                codeTab === 'html' ? htmlCode : codeTab === 'css' ? cssCode : jsCode
                              )
                              toast({ title: 'Code copied to clipboard' })
                            }}
                          >
                            <Copy size={12} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="bg-[#1A1A3A] text-[#E8E8F0] border-[#2A2A4A]">Copy Code</TooltipContent>
                      </Tooltip>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-[#8888AA] hover:text-[#E8E8F0]"
                        onClick={() => setShowCodePanel(false)}
                      >
                        <ChevronDown size={12} />
                      </Button>
                    </div>
                  </div>

                  {/* Code content */}
                  <div className="flex-1 overflow-auto">
                    <textarea
                      value={codeTab === 'html' ? htmlCode : codeTab === 'css' ? cssCode : jsCode}
                      onChange={(e) => {
                        if (codeTab === 'html') setHtmlCode(e.target.value)
                        else if (codeTab === 'css') setCssCode(e.target.value)
                        else setJsCode(e.target.value)
                      }}
                      className="w-full h-full bg-[#0A0A1A] text-[#8888AA] font-mono text-xs p-3 resize-none outline-none border-none leading-relaxed"
                      spellCheck={false}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── RIGHT PANEL - INSPECTOR ───────────────────────────────────── */}
        <motion.div
          className="w-[320px] shrink-0 border-l border-[#2A2A4A]/60 bg-[#0D0D1A] flex flex-col overflow-hidden"
          initial={{ x: 0 }}
          animate={{ x: 0 }}
        >
          {/* Inspector Tabs */}
          <div className="px-2 pt-2 pb-1">
            <Tabs value={inspectorTab} onValueChange={(v) => setInspectorTab(v as any)}>
              <TabsList className="w-full bg-[#1A1A3A] h-9 p-1 rounded-lg">
                <TabsTrigger
                  value="style"
                  className="flex-1 data-[state=active]:bg-[#6C5CE7] data-[state=active]:text-white text-[#8888AA] h-7 rounded-md text-xs font-medium gap-1"
                >
                  <Palette size={13} />
                  Style
                </TabsTrigger>
                <TabsTrigger
                  value="layout"
                  className="flex-1 data-[state=active]:bg-[#6C5CE7] data-[state=active]:text-white text-[#8888AA] h-7 rounded-md text-xs font-medium gap-1"
                >
                  <Layout size={13} />
                  Layout
                </TabsTrigger>
                <TabsTrigger
                  value="animation"
                  className="flex-1 data-[state=active]:bg-[#6C5CE7] data-[state=active]:text-white text-[#8888AA] h-7 rounded-md text-xs font-medium gap-1"
                >
                  <Sparkles size={13} />
                  Animate
                </TabsTrigger>
                <TabsTrigger
                  value="seo"
                  className="flex-1 data-[state=active]:bg-[#6C5CE7] data-[state=active]:text-white text-[#8888AA] h-7 rounded-md text-xs font-medium gap-1"
                >
                  <Globe size={13} />
                  SEO
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <Separator className="bg-[#2A2A4A]/40" />

          {/* Inspector Content */}
          <ScrollArea className="flex-1">
            <AnimatePresence mode="wait">
              {/* ── STYLE TAB ──────────────────────────────────────────── */}
              {inspectorTab === 'style' && (
                <motion.div
                  key="style"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="p-3 space-y-4"
                >
                  {/* Typography */}
                  <div>
                    <Label className="text-xs font-semibold text-[#8888AA] uppercase tracking-wider mb-2 block">
                      <Type size={12} className="inline mr-1" /> Typography
                    </Label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Select value={fontFamily} onValueChange={setFontFamily}>
                          <SelectTrigger className="h-8 bg-[#1A1A3A] border-[#2A2A4A] text-xs text-[#E8E8F0] flex-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1A1A3A] border-[#2A2A4A]">
                            {['Inter', 'Helvetica', 'Arial', 'Georgia', 'Times New Roman', 'Courier New', 'Fira Code'].map(f => (
                              <SelectItem key={f} value={f} className="text-[#E8E8F0] text-xs focus:bg-[#2A2A4A]">{f}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <Label className="text-[10px] text-[#8888AA] mb-1 block">Size</Label>
                          <div className="flex items-center gap-1">
                            <Slider
                              value={[fontSize]}
                              onValueChange={(v) => setFontSize(v[0])}
                              min={8}
                              max={72}
                              step={1}
                              className="flex-1 [&_[role=slider]]:h-3 [&_[role=slider]]:w-3 [&_[role=slider]]:bg-[#6C5CE7]"
                            />
                            <Input
                              value={fontSize}
                              onChange={(e) => setFontSize(Number(e.target.value))}
                              className="w-12 h-7 bg-[#1A1A3A] border-[#2A2A4A] text-xs text-[#E8E8F0] text-center"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select value={fontWeight} onValueChange={setFontWeight}>
                          <SelectTrigger className="h-8 bg-[#1A1A3A] border-[#2A2A4A] text-xs text-[#E8E8F0] flex-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1A1A3A] border-[#2A2A4A]">
                            {['300', '400', '500', '600', '700', '800', '900'].map(w => (
                              <SelectItem key={w} value={w} className="text-[#E8E8F0] text-xs focus:bg-[#2A2A4A]">
                                {w === '300' ? 'Light' : w === '400' ? 'Regular' : w === '500' ? 'Medium' : w === '600' ? 'Semibold' : w === '700' ? 'Bold' : w === '800' ? 'Extrabold' : 'Black'}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="flex gap-0.5">
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-[#8888AA] hover:text-[#E8E8F0] hover:bg-[#1A1A3A]">
                            <Bold size={13} />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-[#8888AA] hover:text-[#E8E8F0] hover:bg-[#1A1A3A]">
                            <Italic size={13} />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-[#8888AA] hover:text-[#E8E8F0] hover:bg-[#1A1A3A]">
                            <Underline size={13} />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-0.5">
                          {([
                            { icon: <AlignLeft size={13} />, value: 'left' },
                            { icon: <AlignCenter size={13} />, value: 'center' },
                            { icon: <AlignRight size={13} />, value: 'right' },
                          ]).map(({ icon, value }) => (
                            <Button key={value} variant="ghost" size="icon" className="h-7 w-7 text-[#8888AA] hover:text-[#E8E8F0] hover:bg-[#1A1A3A]">
                              {icon}
                            </Button>
                          ))}
                        </div>
                        <div className="flex-1 flex items-center gap-1.5">
                          <Label className="text-[10px] text-[#8888AA] shrink-0">Color</Label>
                          <div className="relative flex-1">
                            <input
                              type="color"
                              value={fontColor}
                              onChange={(e) => setFontColor(e.target.value)}
                              className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 rounded cursor-pointer opacity-0"
                            />
                            <Input
                              value={fontColor}
                              onChange={(e) => setFontColor(e.target.value)}
                              className="h-7 bg-[#1A1A3A] border-[#2A2A4A] text-xs text-[#E8E8F0] pl-7"
                            />
                            <div className="absolute left-1 top-1/2 -translate-y-1/2 w-4 h-4 rounded border border-[#2A2A4A]" style={{ background: fontColor }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-[#2A2A4A]/40" />

                  {/* Background */}
                  <div>
                    <Label className="text-xs font-semibold text-[#8888AA] uppercase tracking-wider mb-2 block">
                      <Circle size={12} className="inline mr-1" /> Background
                    </Label>
                    <div className="space-y-2">
                      <div className="flex gap-1">
                        {(['color', 'gradient', 'image'] as const).map((type) => (
                          <Button
                            key={type}
                            variant="ghost"
                            size="sm"
                            className={`flex-1 h-7 text-xs font-medium ${
                              bgType === type
                                ? 'bg-[#6C5CE7] text-white'
                                : 'text-[#8888AA] hover:text-[#E8E8F0] hover:bg-[#1A1A3A]'
                            }`}
                            onClick={() => setBgType(type)}
                          >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </Button>
                        ))}
                      </div>
                      {bgType === 'color' && (
                        <div className="flex items-center gap-1.5">
                          <Label className="text-[10px] text-[#8888AA] shrink-0">Color</Label>
                          <div className="relative flex-1">
                            <input
                              type="color"
                              value={bgColor}
                              onChange={(e) => setBgColor(e.target.value)}
                              className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 rounded cursor-pointer opacity-0"
                            />
                            <Input
                              value={bgColor}
                              onChange={(e) => setBgColor(e.target.value)}
                              className="h-7 bg-[#1A1A3A] border-[#2A2A4A] text-xs text-[#E8E8F0] pl-7"
                            />
                            <div className="absolute left-1 top-1/2 -translate-y-1/2 w-4 h-4 rounded border border-[#2A2A4A]" style={{ background: bgColor }} />
                          </div>
                        </div>
                      )}
                      {bgType === 'gradient' && (
                        <div className="flex items-center gap-1.5">
                          <Label className="text-[10px] text-[#8888AA] shrink-0">Gradient</Label>
                          <Input
                            value={bgGradient}
                            onChange={(e) => setBgGradient(e.target.value)}
                            className="h-7 bg-[#1A1A3A] border-[#2A2A4A] text-xs text-[#E8E8F0] flex-1"
                          />
                        </div>
                      )}
                      {bgType === 'image' && (
                        <div className="flex items-center gap-1.5">
                          <Label className="text-[10px] text-[#8888AA] shrink-0">URL</Label>
                          <Input
                            placeholder="https://..."
                            className="h-7 bg-[#1A1A3A] border-[#2A2A4A] text-xs text-[#E8E8F0] placeholder:text-[#8888AA] flex-1"
                          />
                        </div>
                      )}
                      {/* Color palette */}
                      <div className="flex gap-1 mt-1">
                        {['#0A0A1A', '#1A1A3A', '#6C5CE7', '#00CEC9', '#FF6B6B', '#FDCB6E', '#E8E8F0', '#FFFFFF'].map(c => (
                          <button
                            key={c}
                            className="w-6 h-6 rounded-md border border-[#2A2A4A] hover:border-[#6C5CE7] transition-colors"
                            style={{ background: c }}
                            onClick={() => setBgColor(c)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-[#2A2A4A]/40" />

                  {/* Border */}
                  <div>
                    <Label className="text-xs font-semibold text-[#8888AA] uppercase tracking-wider mb-2 block">
                      <Square size={12} className="inline mr-1" /> Border
                    </Label>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-[10px] text-[#8888AA] mb-1 block">Width</Label>
                          <Slider
                            value={[borderWidth]}
                            onValueChange={(v) => setBorderWidth(v[0])}
                            min={0}
                            max={20}
                            step={1}
                            className=" [&_[role=slider]]:h-3 [&_[role=slider]]:w-3 [&_[role=slider]]:bg-[#6C5CE7]"
                          />
                          <span className="text-[10px] text-[#8888AA] mt-0.5 block">{borderWidth}px</span>
                        </div>
                        <div>
                          <Label className="text-[10px] text-[#8888AA] mb-1 block">Radius</Label>
                          <Slider
                            value={[borderRadius]}
                            onValueChange={(v) => setBorderRadius(v[0])}
                            min={0}
                            max={50}
                            step={1}
                            className="[&_[role=slider]]:h-3 [&_[role=slider]]:w-3 [&_[role=slider]]:bg-[#6C5CE7]"
                          />
                          <span className="text-[10px] text-[#8888AA] mt-0.5 block">{borderRadius}px</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select value={borderStyle} onValueChange={setBorderStyle}>
                          <SelectTrigger className="h-7 bg-[#1A1A3A] border-[#2A2A4A] text-xs text-[#E8E8F0] flex-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1A1A3A] border-[#2A2A4A]">
                            {['none', 'solid', 'dashed', 'dotted', 'double'].map(s => (
                              <SelectItem key={s} value={s} className="text-[#E8E8F0] text-xs focus:bg-[#2A2A4A]">{s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="relative flex items-center">
                          <input
                            type="color"
                            value={borderColor}
                            onChange={(e) => setBorderColor(e.target.value)}
                            className="w-5 h-5 rounded cursor-pointer opacity-0 absolute"
                          />
                          <div className="w-5 h-5 rounded border border-[#2A2A4A] cursor-pointer" style={{ background: borderColor }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-[#2A2A4A]/40" />

                  {/* Shadow */}
                  <div>
                    <Label className="text-xs font-semibold text-[#8888AA] uppercase tracking-wider mb-2 block">
                      <Square size={12} className="inline mr-1" /> Shadow
                    </Label>
                    <div className="space-y-2">
                      <Select value={shadowType} onValueChange={setShadowType}>
                        <SelectTrigger className="h-7 bg-[#1A1A3A] border-[#2A2A4A] text-xs text-[#E8E8F0]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1A1A3A] border-[#2A2A4A]">
                          {['none', 'drop', 'inner', 'outline'].map(s => (
                            <SelectItem key={s} value={s} className="text-[#E8E8F0] text-xs focus:bg-[#2A2A4A]">{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {shadowType !== 'none' && (
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-[10px] text-[#8888AA] mb-1 block">Blur</Label>
                            <Slider value={[shadowBlur]} onValueChange={(v) => setShadowBlur(v[0])} min={0} max={100} step={1} className="[&_[role=slider]]:h-3 [&_[role=slider]]:w-3 [&_[role=slider]]:bg-[#6C5CE7]" />
                            <span className="text-[10px] text-[#8888AA]">{shadowBlur}px</span>
                          </div>
                          <div>
                            <Label className="text-[10px] text-[#8888AA] mb-1 block">Offset</Label>
                            <Slider value={[shadowOffset]} onValueChange={(v) => setShadowOffset(v[0])} min={0} max={50} step={1} className="[&_[role=slider]]:h-3 [&_[role=slider]]:w-3 [&_[role=slider]]:bg-[#6C5CE7]" />
                            <span className="text-[10px] text-[#8888AA]">{shadowOffset}px</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator className="bg-[#2A2A4A]/40" />

                  {/* Opacity */}
                  <div>
                    <Label className="text-xs font-semibold text-[#8888AA] uppercase tracking-wider mb-2 block">
                      Opacity
                    </Label>
                    <div className="flex items-center gap-2">
                      <Slider value={[opacity]} onValueChange={(v) => setOpacity(v[0])} min={0} max={100} step={1} className="flex-1 [&_[role=slider]]:h-3 [&_[role=slider]]:w-3 [&_[role=slider]]:bg-[#6C5CE7]" />
                      <span className="text-xs text-[#8888AA] w-8 text-right">{opacity}%</span>
                    </div>
                  </div>

                  {/* Color picker */}
                  <div>
                    <Label className="text-xs font-semibold text-[#8888AA] uppercase tracking-wider mb-2 block">
                      Color Picker
                    </Label>
                    <div className="grid grid-cols-8 gap-1">
                      {[
                        '#FFFFFF', '#E8E8F0', '#8888AA', '#2A2A4A', '#1A1A3A', '#0A0A1A', '#0D0D1A', '#000000',
                        '#6C5CE7', '#A29BFE', '#00CEC9', '#55EFC4', '#FF6B6B', '#FDCB6E', '#E17055', '#74B9FF',
                        '#9B59B6', '#3498DB', '#1ABC9C', '#2ECC71', '#F39C12', '#E74C3C', '#95A5A6', '#34495E',
                      ].map(c => (
                        <button
                          key={c}
                          className="w-6 h-6 rounded-md border border-[#2A2A4A] hover:border-[#6C5CE7] hover:scale-110 transition-all"
                          style={{ background: c }}
                          onClick={() => setFontColor(c)}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── LAYOUT TAB ───────────────────────────────────────────── */}
              {inspectorTab === 'layout' && (
                <motion.div
                  key="layout"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="p-3 space-y-4"
                >
                  {/* Spacing diagram */}
                  <div>
                    <Label className="text-xs font-semibold text-[#8888AA] uppercase tracking-wider mb-2 block">
                      Padding
                    </Label>
                    {/* Visual spacing diagram */}
                    <div className="relative w-full aspect-square max-w-[140px] mx-auto mb-2">
                      <div className="absolute inset-0 bg-[#00CEC9]/10 border-2 border-[#00CEC9]/30 rounded-md flex items-center justify-center">
                        <div className="bg-[#6C5CE7]/10 border-2 border-[#6C5CE7]/30 rounded-md w-[60%] h-[60%] flex items-center justify-center">
                          <span className="text-[10px] text-[#8888AA]">Content</span>
                        </div>
                      </div>
                      {/* Padding labels */}
                      <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[10px] text-[#00CEC9]">{padding.top}</span>
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] text-[#00CEC9]">{padding.bottom}</span>
                      <span className="absolute left-1 top-1/2 -translate-y-1/2 text-[10px] text-[#00CEC9]">{padding.left}</span>
                      <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[10px] text-[#00CEC9]">{padding.right}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {(['top', 'right', 'bottom', 'left'] as const).map((dir) => (
                        <div key={dir} className="flex items-center gap-1.5">
                          <Label className="text-[10px] text-[#8888AA] w-8 shrink-0 capitalize">{dir}</Label>
                          <Input
                            type="number"
                            value={padding[dir]}
                            onChange={(e) => setPadding({ ...padding, [dir]: Number(e.target.value) })}
                            className="h-7 bg-[#1A1A3A] border-[#2A2A4A] text-xs text-[#E8E8F0] text-center"
                          />
                          <span className="text-[10px] text-[#8888AA]">px</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="bg-[#2A2A4A]/40" />

                  {/* Margin */}
                  <div>
                    <Label className="text-xs font-semibold text-[#8888AA] uppercase tracking-wider mb-2 block">
                      Margin
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['top', 'right', 'bottom', 'left'] as const).map((dir) => (
                        <div key={dir} className="flex items-center gap-1.5">
                          <Label className="text-[10px] text-[#8888AA] w-8 shrink-0 capitalize">{dir}</Label>
                          <Input
                            type="number"
                            value={margin[dir]}
                            onChange={(e) => setMargin({ ...margin, [dir]: Number(e.target.value) })}
                            className="h-7 bg-[#1A1A3A] border-[#2A2A4A] text-xs text-[#E8E8F0] text-center"
                          />
                          <span className="text-[10px] text-[#8888AA]">px</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="bg-[#2A2A4A]/40" />

                  {/* Size */}
                  <div>
                    <Label className="text-xs font-semibold text-[#8888AA] uppercase tracking-wider mb-2 block">
                      Size
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-1.5">
                        <Label className="text-[10px] text-[#8888AA] shrink-0">W</Label>
                        <Input
                          value={width}
                          onChange={(e) => setWidth(e.target.value)}
                          className="h-7 bg-[#1A1A3A] border-[#2A2A4A] text-xs text-[#E8E8F0] text-center"
                        />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Label className="text-[10px] text-[#8888AA] shrink-0">H</Label>
                        <Input
                          value={height}
                          onChange={(e) => setHeight(e.target.value)}
                          className="h-7 bg-[#1A1A3A] border-[#2A2A4A] text-xs text-[#E8E8F0] text-center"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-[#2A2A4A]/40" />

                  {/* Display */}
                  <div>
                    <Label className="text-xs font-semibold text-[#8888AA] uppercase tracking-wider mb-2 block">
                      Display
                    </Label>
                    <div className="flex gap-1">
                      {['block', 'flex', 'grid', 'inline', 'none'].map(d => (
                        <Button
                          key={d}
                          variant="ghost"
                          size="sm"
                          className={`flex-1 h-7 text-[11px] font-medium ${
                            displayType === d
                              ? 'bg-[#6C5CE7] text-white'
                              : 'text-[#8888AA] hover:text-[#E8E8F0] hover:bg-[#1A1A3A]'
                          }`}
                          onClick={() => setDisplayType(d)}
                        >
                          {d}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Flex/Grid controls (shown when relevant) */}
                  {(displayType === 'flex' || displayType === 'grid') && (
                    <div>
                      <Label className="text-xs font-semibold text-[#8888AA] uppercase tracking-wider mb-2 block">
                        {displayType === 'flex' ? 'Flex' : 'Grid'} Controls
                      </Label>
                      {displayType === 'flex' && (
                        <div className="space-y-2">
                          <div>
                            <Label className="text-[10px] text-[#8888AA] mb-1 block">Direction</Label>
                            <div className="flex gap-1">
                              {['row', 'column', 'row-reverse', 'column-reverse'].map(d => (
                                <Button
                                  key={d}
                                  variant="ghost"
                                  size="sm"
                                  className={`flex-1 h-6 text-[10px] font-medium ${
                                    flexDirection === d
                                      ? 'bg-[#6C5CE7] text-white'
                                      : 'text-[#8888AA] hover:text-[#E8E8F0] hover:bg-[#1A1A3A]'
                                  }`}
                                  onClick={() => setFlexDirection(d)}
                                >
                                  {d}
                                </Button>
                              ))}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label className="text-[10px] text-[#8888AA] mb-1 block">Align</Label>
                              <Select value={flexAlign} onValueChange={setFlexAlign}>
                                <SelectTrigger className="h-7 bg-[#1A1A3A] border-[#2A2A4A] text-xs text-[#E8E8F0]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1A1A3A] border-[#2A2A4A]">
                                  {['start', 'center', 'end', 'stretch', 'baseline'].map(a => (
                                    <SelectItem key={a} value={a} className="text-[#E8E8F0] text-xs focus:bg-[#2A2A4A]">{a}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label className="text-[10px] text-[#8888AA] mb-1 block">Justify</Label>
                              <Select value={flexJustify} onValueChange={setFlexJustify}>
                                <SelectTrigger className="h-7 bg-[#1A1A3A] border-[#2A2A4A] text-xs text-[#E8E8F0]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1A1A3A] border-[#2A2A4A]">
                                  {['start', 'center', 'end', 'between', 'around', 'evenly'].map(j => (
                                    <SelectItem key={j} value={j} className="text-[#E8E8F0] text-xs focus:bg-[#2A2A4A]">{j}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <Separator className="bg-[#2A2A4A]/40" />

                  {/* Position */}
                  <div>
                    <Label className="text-xs font-semibold text-[#8888AA] uppercase tracking-wider mb-2 block">
                      Position
                    </Label>
                    <div className="flex gap-1">
                      {['static', 'relative', 'absolute', 'fixed', 'sticky'].map(p => (
                        <Button
                          key={p}
                          variant="ghost"
                          size="sm"
                          className={`flex-1 h-7 text-[11px] font-medium ${
                            positionType === p
                              ? 'bg-[#6C5CE7] text-white'
                              : 'text-[#8888AA] hover:text-[#E8E8F0] hover:bg-[#1A1A3A]'
                          }`}
                          onClick={() => setPositionType(p)}
                        >
                          {p}
                        </Button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── ANIMATION TAB ────────────────────────────────────────── */}
              {inspectorTab === 'animation' && (
                <motion.div
                  key="animation"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="p-3 space-y-4"
                >
                  {/* Animation type */}
                  <div>
                    <Label className="text-xs font-semibold text-[#8888AA] uppercase tracking-wider mb-2 block">
                      Animation Type
                    </Label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { type: 'fade', label: 'Fade', icon: <Circle size={14} /> },
                        { type: 'slide', label: 'Slide', icon: <Move size={14} /> },
                        { type: 'scale', label: 'Scale', icon: <Maximize2 size={14} /> },
                        { type: 'rotate', label: 'Rotate', icon: <ChevronRight size={14} /> },
                      ].map(({ type, label, icon }) => (
                        <Button
                          key={type}
                          variant="ghost"
                          size="sm"
                          className={`h-9 gap-1.5 ${
                            animType === type
                              ? 'bg-[#6C5CE7] text-white'
                              : 'text-[#8888AA] hover:text-[#E8E8F0] hover:bg-[#1A1A3A] border border-[#2A2A4A]'
                          }`}
                          onClick={() => setAnimType(type)}
                        >
                          {icon}
                          <span className="text-xs font-medium">{label}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Separator className="bg-[#2A2A4A]/40" />

                  {/* Duration */}
                  <div>
                    <Label className="text-xs font-semibold text-[#8888AA] uppercase tracking-wider mb-2 block">
                      Duration
                    </Label>
                    <div className="flex items-center gap-2">
                      <Slider value={[animDuration]} onValueChange={(v) => setAnimDuration(v[0])} min={100} max={3000} step={50} className="flex-1 [&_[role=slider]]:h-3 [&_[role=slider]]:w-3 [&_[role=slider]]:bg-[#6C5CE7]" />
                      <span className="text-xs text-[#8888AA] w-10 text-right">{animDuration}ms</span>
                    </div>
                  </div>

                  {/* Delay */}
                  <div>
                    <Label className="text-xs font-semibold text-[#8888AA] uppercase tracking-wider mb-2 block">
                      Delay
                    </Label>
                    <div className="flex items-center gap-2">
                      <Slider value={[animDelay]} onValueChange={(v) => setAnimDelay(v[0])} min={0} max={2000} step={50} className="flex-1 [&_[role=slider]]:h-3 [&_[role=slider]]:w-3 [&_[role=slider]]:bg-[#6C5CE7]" />
                      <span className="text-xs text-[#8888AA] w-10 text-right">{animDelay}ms</span>
                    </div>
                  </div>

                  <Separator className="bg-[#2A2A4A]/40" />

                  {/* Easing */}
                  <div>
                    <Label className="text-xs font-semibold text-[#8888AA] uppercase tracking-wider mb-2 block">
                      Easing
                    </Label>
                    <Select value={animEasing} onValueChange={setAnimEasing}>
                      <SelectTrigger className="h-7 bg-[#1A1A3A] border-[#2A2A4A] text-xs text-[#E8E8F0]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1A1A3A] border-[#2A2A4A]">
                        {['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear', 'cubic-bezier'].map(e => (
                          <SelectItem key={e} value={e} className="text-[#E8E8F0] text-xs focus:bg-[#2A2A4A]">{e}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator className="bg-[#2A2A4A]/40" />

                  {/* Hover effects */}
                  <div>
                    <Label className="text-xs font-semibold text-[#8888AA] uppercase tracking-wider mb-2 block">
                      Hover Effects
                    </Label>
                    <div className="flex gap-1">
                      {['none', 'lift', 'glow', 'scale', 'color-change'].map(h => (
                        <Button
                          key={h}
                          variant="ghost"
                          size="sm"
                          className={`flex-1 h-7 text-[11px] font-medium ${
                            hoverEffect === h
                              ? 'bg-[#6C5CE7] text-white'
                              : 'text-[#8888AA] hover:text-[#E8E8F0] hover:bg-[#1A1A3A]'
                          }`}
                          onClick={() => setHoverEffect(h)}
                        >
                          {h === 'none' ? 'None' : h === 'lift' ? 'Lift' : h === 'glow' ? 'Glow' : h === 'scale' ? 'Scale' : 'Color'}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Separator className="bg-[#2A2A4A]/40" />

                  {/* Scroll animations */}
                  <div>
                    <Label className="text-xs font-semibold text-[#8888AA] uppercase tracking-wider mb-2 block">
                      Scroll Animation
                    </Label>
                    <Select value={scrollAnim} onValueChange={setScrollAnim}>
                      <SelectTrigger className="h-7 bg-[#1A1A3A] border-[#2A2A4A] text-xs text-[#E8E8F0]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1A1A3A] border-[#2A2A4A]">
                        {['none', 'fade-in', 'slide-up', 'slide-left', 'slide-right', 'zoom-in'].map(s => (
                          <SelectItem key={s} value={s} className="text-[#E8E8F0] text-xs focus:bg-[#2A2A4A]">{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Preview button */}
                  <div className="flex items-center gap-2 mt-2">
                    <Button
                      size="sm"
                      className="h-8 bg-gradient-to-r from-[#6C5CE7] to-[#00CEC9] text-white text-xs font-medium gap-1.5"
                    >
                      <Wand2 size={13} />
                      Preview Animation
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 border-[#2A2A4A] bg-[#1A1A3A] text-[#8888AA] hover:text-[#E8E8F0] hover:bg-[#2A2A4A] text-xs"
                    >
                      Reset
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* ── SEO TAB ──────────────────────────────────────────────── */}
              {inspectorTab === 'seo' && (
                <motion.div
                  key="seo"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="p-3 space-y-4"
                >
                  {/* Page Title */}
                  <div>
                    <Label className="text-xs font-semibold text-[#8888AA] uppercase tracking-wider mb-2 block">
                      Page Title
                    </Label>
                    <Input
                      value={pageTitle}
                      onChange={(e) => setPageTitle(e.target.value)}
                      className="h-8 bg-[#1A1A3A] border-[#2A2A4A] text-sm text-[#E8E8F0]"
                    />
                    <div className="mt-1.5 p-2 rounded-md bg-[#0A0A1A] border border-[#2A2A4A]/30">
                      <span className="text-[10px] text-[#8888AA]">Google Preview</span>
                      <div className="mt-1">
                        <span className="text-sm font-medium text-[#A29BFE] block truncate">{pageTitle}</span>
                        <span className="text-xs text-[#00CEC9] block truncate">nexus.example.com</span>
                        <span className="text-xs text-[#8888AA] block truncate">{pageDescription}</span>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-[#2A2A4A]/40" />

                  {/* Description */}
                  <div>
                    <Label className="text-xs font-semibold text-[#8888AA] uppercase tracking-wider mb-2 block">
                      Description
                    </Label>
                    <textarea
                      value={pageDescription}
                      onChange={(e) => setPageDescription(e.target.value)}
                      className="w-full h-20 bg-[#1A1A3A] border border-[#2A2A4A] rounded-md text-sm text-[#E8E8F0] p-2 resize-none outline-none"
                      maxLength={160}
                    />
                    <span className="text-[10px] text-[#8888AA] mt-0.5 block">{pageDescription.length}/160 characters</span>
                  </div>

                  <Separator className="bg-[#2A2A4A]/40" />

                  {/* OG Image */}
                  <div>
                    <Label className="text-xs font-semibold text-[#8888AA] uppercase tracking-wider mb-2 block">
                      OG Image
                    </Label>
                    <Input
                      value={ogImage}
                      onChange={(e) => setOgImage(e.target.value)}
                      placeholder="https://example.com/og-image.jpg"
                      className="h-8 bg-[#1A1A3A] border-[#2A2A4A] text-sm text-[#E8E8F0] placeholder:text-[#8888AA]"
                    />
                    {!ogImage && (
                      <div className="mt-1.5 h-24 bg-[#1A1A3A] border border-[#2A2A4A] rounded-md flex items-center justify-center">
                        <div className="text-center">
                          <Image size={20} className="text-[#8888AA] mx-auto mb-1" />
                          <span className="text-[10px] text-[#8888AA]">Upload or paste image URL</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator className="bg-[#2A2A4A]/40" />

                  {/* Keywords */}
                  <div>
                    <Label className="text-xs font-semibold text-[#8888AA] uppercase tracking-wider mb-2 block">
                      Keywords
                    </Label>
                    <Input
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                      className="h-8 bg-[#1A1A3A] border-[#2A2A4A] text-sm text-[#E8E8F0]"
                    />
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {keywords.split(',').map((kw, i) => (
                        <Badge key={i} variant="outline" className="text-[10px] bg-[#1A1A3A] text-[#8888AA] border-[#2A2A4A] h-5">
                          {kw.trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Separator className="bg-[#2A2A4A]/40" />

                  {/* Canonical URL */}
                  <div>
                    <Label className="text-xs font-semibold text-[#8888AA] uppercase tracking-wider mb-2 block">
                      <Link size={12} className="inline mr-1" /> Canonical URL
                    </Label>
                    <Input
                      value={canonicalUrl}
                      onChange={(e) => setCanonicalUrl(e.target.value)}
                      className="h-8 bg-[#1A1A3A] border-[#2A2A4A] text-sm text-[#E8E8F0]"
                    />
                  </div>

                  <Separator className="bg-[#2A2A4A]/40" />

                  {/* Sitemap toggle */}
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold text-[#8888AA]">Include in Sitemap</Label>
                    <Switch
                      checked={sitemapEnabled}
                      onCheckedChange={setSitemapEnabled}
                      className="data-[state=checked]:bg-[#6C5CE7]"
                    />
                  </div>

                  {/* SEO Score indicator */}
                  <div className="p-3 rounded-lg bg-[#1A1A3A] border border-[#2A2A4A]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-[#8888AA]">SEO Score</span>
                      <Badge className="bg-[#00CEC9] text-white text-[11px] h-5">Good</Badge>
                    </div>
                    <div className="w-full h-2 bg-[#2A2A4A] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#6C5CE7] to-[#00CEC9] rounded-full" style={{ width: '75%' }} />
                    </div>
                    <span className="text-[10px] text-[#8888AA] mt-1 block">75/100 — Add OG image for better score</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </ScrollArea>
        </motion.div>
      </div>
    </div>
  )
}
