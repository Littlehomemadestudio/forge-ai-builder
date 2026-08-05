// ─── Slide-Out Tool Panels ──────────────────────────────────────────────
// Panels that slide out from the left toolbar when a tool is selected.
// Each panel provides content relevant to the tool: sections, components,
// media, layers, pages, templates, assets, history, brand, settings.

'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutTemplate, Type, Image as ImageIcon, ListTree, Layers, Palette,
  History, Globe, Settings2, Plus, Sparkles, ChevronRight,
  Heading1, Heading2, Pilcrow, Square, Columns, Rows3, Rows,
  CreditCard, MessageSquare, Star, Mail, MapPin, Phone, Calendar,
  ArrowRight, Check, Search, Upload, FolderOpen
} from 'lucide-react'
import { COLORS, RADIUS, SPACING, SHADOWS, DARK_COLORS } from './design-tokens'
import { useAccessibility } from './AccessibilityContext'

// ─── Types ──────────────────────────────────────────────────────────────

export interface ToolPanelItem {
  id: string
  label: string
  description?: string
  icon?: React.ReactNode
  html?: string  // HTML to insert when clicked
  badge?: string
  category?: string
}

export interface ToolPanelProps {
  activeTool: string
  onInsert: (html: string, label: string) => void
  darkMode?: boolean
  htmlContent?: string  // Current page HTML for layers panel
}

// ─── Section templates ──────────────────────────────────────────────────

const SECTION_ITEMS: ToolPanelItem[] = [
  {
    id: 'hero', label: 'Hero', description: 'Large heading + CTA',
    icon: <Heading1 size={16} />,
    html: `<section style="padding:80px 24px;text-align:center;max-width:900px;margin:0 auto">
  <h1 style="font-size:48px;font-weight:800;color:#111827;margin:0 0 16px;line-height:1.1">Welcome to your site</h1>
  <p style="font-size:18px;color:#6B7280;margin:0 auto 32px;max-width:600px;line-height:1.6">Build something amazing with the power of AI and modern design.</p>
  <a href="#" style="display:inline-block;background:#2563EB;color:#fff;font-weight:600;font-size:16px;padding:14px 32px;border-radius:10px;text-decoration:none">Get started</a>
</section>`,
  },
  {
    id: 'features', label: 'Features', description: '3-column feature grid',
    icon: <Columns size={16} />,
    html: `<section style="padding:64px 24px;max-width:1100px;margin:0 auto">
  <h2 style="font-size:32px;font-weight:700;color:#111827;text-align:center;margin:0 0 48px">Features</h2>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:32px">
    <div style="text-align:center"><div style="width:48px;height:48px;background:#EFF6FF;border-radius:12px;display:flex;align-items:center;justify-content:center;margin:0 auto 16px"><span style="font-size:24px">&#9889;</span></div><h3 style="font-size:18px;font-weight:600;color:#111827;margin:0 0 8px">Fast</h3><p style="font-size:14px;color:#6B7280;line-height:1.5">Lightning-fast performance for the best user experience.</p></div>
    <div style="text-align:center"><div style="width:48px;height:48px;background:#F0FDF4;border-radius:12px;display:flex;align-items:center;justify-content:center;margin:0 auto 16px"><span style="font-size:24px">&#128274;</span></div><h3 style="font-size:18px;font-weight:600;color:#111827;margin:0 0 8px">Secure</h3><p style="font-size:14px;color:#6B7280;line-height:1.5">Enterprise-grade security to protect your data.</p></div>
    <div style="text-align:center"><div style="width:48px;height:48px;background:#FEF3C7;border-radius:12px;display:flex;align-items:center;justify-content:center;margin:0 auto 16px"><span style="font-size:24px">&#127912;</span></div><h3 style="font-size:18px;font-weight:600;color:#111827;margin:0 0 8px">Beautiful</h3><p style="font-size:14px;color:#6B7280;line-height:1.5">Stunning designs that make your brand stand out.</p></div>
  </div>
</section>`,
  },
  {
    id: 'pricing', label: 'Pricing', description: '3-tier pricing cards',
    icon: <CreditCard size={16} />,
    html: `<section style="padding:64px 24px;max-width:1100px;margin:0 auto">
  <h2 style="font-size:32px;font-weight:700;color:#111827;text-align:center;margin:0 0 48px">Pricing</h2>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px">
    <div style="border:1px solid #E5E7EB;border-radius:12px;padding:32px"><h3 style="font-size:20px;font-weight:600;margin:0 0 8px">Starter</h3><p style="font-size:14px;color:#6B7280;margin:0 0 24px">For individuals</p><div style="font-size:36px;font-weight:700;color:#111827;margin:0 0 24px">$9<span style="font-size:16px;font-weight:400;color:#9CA3AF">/mo</span></div><a href="#" style="display:block;text-align:center;background:#F3F4F6;color:#111827;font-weight:600;padding:12px;border-radius:8px;text-decoration:none">Choose plan</a></div>
    <div style="border:2px solid #2563EB;border-radius:12px;padding:32px;position:relative"><div style="position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:#2563EB;color:#fff;font-size:12px;font-weight:600;padding:4px 12px;border-radius:999px">Popular</div><h3 style="font-size:20px;font-weight:600;margin:0 0 8px">Pro</h3><p style="font-size:14px;color:#6B7280;margin:0 0 24px">For teams</p><div style="font-size:36px;font-weight:700;color:#111827;margin:0 0 24px">$29<span style="font-size:16px;font-weight:400;color:#9CA3AF">/mo</span></div><a href="#" style="display:block;text-align:center;background:#2563EB;color:#fff;font-weight:600;padding:12px;border-radius:8px;text-decoration:none">Choose plan</a></div>
    <div style="border:1px solid #E5E7EB;border-radius:12px;padding:32px"><h3 style="font-size:20px;font-weight:600;margin:0 0 8px">Enterprise</h3><p style="font-size:14px;color:#6B7280;margin:0 0 24px">For organizations</p><div style="font-size:36px;font-weight:700;color:#111827;margin:0 0 24px">$99<span style="font-size:16px;font-weight:400;color:#9CA3AF">/mo</span></div><a href="#" style="display:block;text-align:center;background:#F3F4F6;color:#111827;font-weight:600;padding:12px;border-radius:8px;text-decoration:none">Choose plan</a></div>
  </div>
</section>`,
  },
  {
    id: 'testimonials', label: 'Testimonials', description: 'Customer quotes',
    icon: <MessageSquare size={16} />,
    html: `<section style="padding:64px 24px;max-width:900px;margin:0 auto">
  <h2 style="font-size:32px;font-weight:700;color:#111827;text-align:center;margin:0 0 48px">What people say</h2>
  <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:24px">
    <div style="background:#F9FAFB;border-radius:12px;padding:24px"><div style="display:flex;gap:4px;margin-bottom:12px"><span style="color:#F59E0B">&#9733;</span><span style="color:#F59E0B">&#9733;</span><span style="color:#F59E0B">&#9733;</span><span style="color:#F59E0B">&#9733;</span><span style="color:#F59E0B">&#9733;</span></div><p style="font-size:15px;color:#374151;line-height:1.6;margin:0 0 16px">"This product has completely transformed how we build websites. Incredible tool!"</p><p style="font-size:14px;font-weight:600;color:#111827;margin:0">Sarah Chen</p></div>
    <div style="background:#F9FAFB;border-radius:12px;padding:24px"><div style="display:flex;gap:4px;margin-bottom:12px"><span style="color:#F59E0B">&#9733;</span><span style="color:#F59E0B">&#9733;</span><span style="color:#F59E0B">&#9733;</span><span style="color:#F59E0B">&#9733;</span><span style="color:#F59E0B">&#9733;</span></div><p style="font-size:15px;color:#374151;line-height:1.6;margin:0 0 16px">"The AI-powered editor saves us hours of work. Best investment we've made."</p><p style="font-size:14px;font-weight:600;color:#111827;margin:0">Mike Johnson</p></div>
  </div>
</section>`,
  },
  {
    id: 'cta', label: 'Call to Action', description: 'Bold CTA section',
    icon: <ArrowRight size={16} />,
    html: `<section style="padding:64px 24px;text-align:center;background:#111827;color:#fff">
  <h2 style="font-size:36px;font-weight:700;margin:0 0 16px">Ready to get started?</h2>
  <p style="font-size:18px;color:#9CA3AF;margin:0 auto 32px;max-width:500px">Join thousands of creators building amazing websites.</p>
  <a href="#" style="display:inline-block;background:#2563EB;color:#fff;font-weight:600;font-size:16px;padding:14px 32px;border-radius:10px;text-decoration:none">Start for free</a>
</section>`,
  },
  {
    id: 'contact', label: 'Contact', description: 'Contact form layout',
    icon: <Mail size={16} />,
    html: `<section style="padding:64px 24px;max-width:600px;margin:0 auto">
  <h2 style="font-size:32px;font-weight:700;color:#111827;margin:0 0 32px">Get in touch</h2>
  <form style="display:flex;flex-direction:column;gap:16px">
    <div><label style="display:block;font-size:14px;font-weight:500;color:#374151;margin-bottom:6px">Name</label><input type="text" placeholder="Your name" style="width:100%;padding:12px 16px;border:1px solid #D1D5DB;border-radius:8px;font-size:15px;box-sizing:border-box"></div>
    <div><label style="display:block;font-size:14px;font-weight:500;color:#374151;margin-bottom:6px">Email</label><input type="email" placeholder="you@example.com" style="width:100%;padding:12px 16px;border:1px solid #D1D5DB;border-radius:8px;font-size:15px;box-sizing:border-box"></div>
    <div><label style="display:block;font-size:14px;font-weight:500;color:#374151;margin-bottom:6px">Message</label><textarea placeholder="How can we help?" rows="4" style="width:100%;padding:12px 16px;border:1px solid #D1D5DB;border-radius:8px;font-size:15px;box-sizing:border-box;resize:vertical"></textarea></div>
    <button type="button" style="background:#2563EB;color:#fff;font-weight:600;font-size:16px;padding:14px 32px;border-radius:8px;border:none;cursor:pointer">Send message</button>
  </form>
</section>`,
  },
  {
    id: 'footer', label: 'Footer', description: 'Site footer with links',
    icon: <Rows3 size={16} />,
    html: `<footer style="padding:48px 24px 32px;background:#111827;color:#9CA3AF">
  <div style="max-width:1100px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);gap:32px">
    <div><h4 style="font-size:16px;font-weight:600;color:#fff;margin:0 0 16px">Company</h4><p style="font-size:14px;line-height:1.6;margin:0">Building the future of web design with AI.</p></div>
    <div><h4 style="font-size:14px;font-weight:600;color:#fff;margin:0 0 16px">Product</h4><div style="display:flex;flex-direction:column;gap:8px"><a href="#" style="color:#9CA3AF;text-decoration:none;font-size:14px">Features</a><a href="#" style="color:#9CA3AF;text-decoration:none;font-size:14px">Pricing</a><a href="#" style="color:#9CA3AF;text-decoration:none;font-size:14px">Templates</a></div></div>
    <div><h4 style="font-size:14px;font-weight:600;color:#fff;margin:0 0 16px">Support</h4><div style="display:flex;flex-direction:column;gap:8px"><a href="#" style="color:#9CA3AF;text-decoration:none;font-size:14px">Help center</a><a href="#" style="color:#9CA3AF;text-decoration:none;font-size:14px">Contact</a><a href="#" style="color:#9CA3AF;text-decoration:none;font-size:14px">Status</a></div></div>
    <div><h4 style="font-size:14px;font-weight:600;color:#fff;margin:0 0 16px">Legal</h4><div style="display:flex;flex-direction:column;gap:8px"><a href="#" style="color:#9CA3AF;text-decoration:none;font-size:14px">Privacy</a><a href="#" style="color:#9CA3AF;text-decoration:none;font-size:14px">Terms</a><a href="#" style="color:#9CA3AF;text-decoration:none;font-size:14px">Cookies</a></div></div>
  </div>
  <div style="max-width:1100px;margin:32px auto 0;padding-top:24px;border-top:1px solid #374151;text-align:center;font-size:13px">&copy; 2025 Your Company. All rights reserved.</div>
</footer>`,
  },
  {
    id: 'stats', label: 'Stats', description: 'Number counters',
    icon: <Star size={16} />,
    html: `<section style="padding:64px 24px;background:#F9FAFB">
  <div style="max-width:900px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);gap:32px;text-align:center">
    <div><div style="font-size:42px;font-weight:800;color:#111827">10K+</div><div style="font-size:14px;color:#6B7280;margin-top:4px">Users</div></div>
    <div><div style="font-size:42px;font-weight:800;color:#111827">50M+</div><div style="font-size:14px;color:#6B7280;margin-top:4px">Pages built</div></div>
    <div><div style="font-size:42px;font-weight:800;color:#111827">99.9%</div><div style="font-size:14px;color:#6B7280;margin-top:4px">Uptime</div></div>
    <div><div style="font-size:42px;font-weight:800;color:#111827">4.9</div><div style="font-size:14px;color:#6B7280;margin-top:4px">Rating</div></div>
  </div>
</section>`,
  },
]

// ─── Component items ────────────────────────────────────────────────────

const COMPONENT_ITEMS: ToolPanelItem[] = [
  { id: 'heading', label: 'Heading', icon: <Heading2 size={16} />, html: '<h2 style="font-size:28px;font-weight:700;color:#111827;margin:0 0 8px">New heading</h2>' },
  { id: 'paragraph', label: 'Paragraph', icon: <Pilcrow size={16} />, html: '<p style="font-size:16px;color:#374151;line-height:1.6;margin:0 0 16px">Write your text here. This is a paragraph element you can edit.</p>' },
  { id: 'button', label: 'Button', icon: <Square size={16} />, html: '<a href="#" style="display:inline-block;background:#2563EB;color:#fff;font-weight:600;padding:12px 24px;border-radius:8px;text-decoration:none;font-size:15px">Click me</a>' },
  { id: 'image', label: 'Image', icon: <ImageIcon size={16} />, html: '<img src="https://placehold.co/800x400/EFF6FF/2563EB?text=Image" alt="Placeholder image" style="max-width:100%;border-radius:8px">' },
  { id: 'divider', label: 'Divider', icon: <Rows size={16} />, html: '<hr style="border:none;border-top:1px solid #E5E7EB;margin:32px 0">' },
  { id: 'card', label: 'Card', icon: <LayoutTemplate size={16} />, html: '<div style="border:1px solid #E5E7EB;border-radius:12px;padding:24px;max-width:400px"><h3 style="font-size:18px;font-weight:600;color:#111827;margin:0 0 8px">Card title</h3><p style="font-size:14px;color:#6B7280;line-height:1.5;margin:0 0 16px">Card description goes here. Edit this text to customize.</p><a href="#" style="color:#2563EB;font-weight:600;font-size:14px;text-decoration:none">Learn more &rarr;</a></div>' },
  { id: 'list', label: 'List', icon: <ListTree size={16} />, html: '<ul style="list-style:disc;padding-left:24px;font-size:16px;color:#374151;line-height:1.8"><li>First item</li><li>Second item</li><li>Third item</li></ul>' },
  { id: 'quote', label: 'Blockquote', icon: <MessageSquare size={16} />, html: '<blockquote style="border-left:4px solid #2563EB;padding-left:20px;font-size:18px;color:#374151;font-style:italic;margin:0 0 16px">"A meaningful quote goes here."</blockquote>' },
  { id: 'spacer', label: 'Spacer', icon: <Rows3 size={16} />, html: '<div style="height:48px"></div>' },
  { id: 'icon-text', label: 'Icon + Text', icon: <Sparkles size={16} />, html: '<div style="display:flex;align-items:center;gap:12px"><div style="width:40px;height:40px;background:#EFF6FF;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px">&#9889;</div><div><div style="font-size:15px;font-weight:600;color:#111827">Feature name</div><div style="font-size:13px;color:#6B7280">Short description</div></div></div>' },
]

// ─── Media items ────────────────────────────────────────────────────────

const MEDIA_ITEMS: ToolPanelItem[] = [
  { id: 'img-wide', label: 'Wide (16:9)', icon: <ImageIcon size={16} />, html: '<img src="https://placehold.co/1200x675/F9FAFB/9CA3AF?text=Wide+Image" alt="Wide placeholder" style="max-width:100%;border-radius:8px">' },
  { id: 'img-square', label: 'Square (1:1)', icon: <ImageIcon size={16} />, html: '<img src="https://placehold.co/600x600/F9FAFB/9CA3AF?text=Square" alt="Square placeholder" style="max-width:100%;border-radius:8px">' },
  { id: 'img-portrait', label: 'Portrait (3:4)', icon: <ImageIcon size={16} />, html: '<img src="https://placehold.co/450x600/F9FAFB/9CA3AF?text=Portrait" alt="Portrait placeholder" style="max-width:100%;border-radius:8px">' },
  { id: 'img-avatar', label: 'Avatar', icon: <ImageIcon size={16} />, html: '<img src="https://placehold.co/80x80/EFF6FF/2563EB?text=A" alt="Avatar" style="width:80px;height:80px;border-radius:50%;object-fit:cover">' },
  { id: 'img-gallery', label: 'Gallery (3)', icon: <Columns size={16} />, html: '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px"><img src="https://placehold.co/400x300/F9FAFB/9CA3AF?text=1" alt="Gallery image 1" style="width:100%;border-radius:8px;object-fit:cover"><img src="https://placehold.co/400x300/F0FDF4/16A34A?text=2" alt="Gallery image 2" style="width:100%;border-radius:8px;object-fit:cover"><img src="https://placehold.co/400x300/FEF3C7/F59E0B?text=3" alt="Gallery image 3" style="width:100%;border-radius:8px;object-fit:cover"></div>' },
]

// ─── Panel Component ────────────────────────────────────────────────────

function PanelItem({ item, onInsert, darkMode }: {
  item: ToolPanelItem
  onInsert: (html: string, label: string) => void
  darkMode?: boolean
}) {
  const [hovered, setHovered] = React.useState(false)
  const c = darkMode ? DARK_COLORS : COLORS

  return (
    <button
      type="button"
      onClick={() => item.html && onInsert(item.html, item.label)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        width: '100%',
        padding: '8px 10px',
        border: 'none',
        borderRadius: RADIUS.lg,
        background: hovered ? c.hover : 'transparent',
        color: c.text,
        cursor: item.html ? 'pointer' : 'default',
        textAlign: 'left',
        fontSize: 13,
        transition: 'background 120ms ease',
      }}
    >
      <span style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 32,
        height: 32,
        borderRadius: RADIUS.md,
        background: hovered ? c.primaryLight : c.background,
        color: c.primary,
        flexShrink: 0,
      }} aria-hidden="true">
        {item.icon || <Plus size={14} />}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 500, fontSize: 13, color: c.text }}>{item.label}</div>
        {item.description && (
          <div style={{ fontSize: 11, color: c.textTertiary, marginTop: 1 }}>{item.description}</div>
        )}
      </div>
      {item.html && (
        <ChevronRight size={14} style={{ color: c.textTertiary, flexShrink: 0 }} />
      )}
    </button>
  )
}

function PanelSection({ title, children, darkMode }: {
  title: string
  children: React.ReactNode
  darkMode?: boolean
}) {
  const c = darkMode ? DARK_COLORS : COLORS
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{
        fontSize: 11,
        fontWeight: 600,
        color: c.textTertiary,
        textTransform: 'uppercase' as const,
        letterSpacing: '0.5px',
        padding: '0 10px 6px',
      }}>
        {title}
      </div>
      {children}
    </div>
  )
}

// ─── Layers Panel (DOM tree) ────────────────────────────────────────────

function LayersPanel({ htmlContent, onInsert, darkMode }: {
  htmlContent?: string
  onInsert: (html: string, label: string) => void
  darkMode?: boolean
}) {
  const c = darkMode ? DARK_COLORS : COLORS

  // Parse top-level elements from HTML
  const elements = React.useMemo(() => {
    if (!htmlContent) return []
    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(htmlContent, 'text/html')
      return Array.from(doc.body.children).map((el, i) => ({
        tag: el.tagName.toLowerCase(),
        text: (el.textContent || '').trim().slice(0, 40),
        index: i,
      }))
    } catch {
      return []
    }
  }, [htmlContent])

  if (elements.length === 0) {
    return (
      <div style={{ padding: '24px 16px', textAlign: 'center', color: c.textTertiary, fontSize: 13 }}>
        <Layers size={24} style={{ margin: '0 auto 8px', display: 'block', opacity: 0.5 }} />
        No elements yet.<br />Add sections or components.
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {elements.map((el, i) => (
        <div key={i} style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 10px',
          borderRadius: RADIUS.md,
          fontSize: 13,
          color: c.text,
        }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 22,
            height: 22,
            borderRadius: RADIUS.sm,
            background: c.background,
            fontSize: 10,
            fontWeight: 600,
            color: c.primary,
            flexShrink: 0,
          }}>
            {el.tag.charAt(0).toUpperCase()}
          </span>
          <span style={{ fontWeight: 500 }}>{el.tag}</span>
          {el.text && (
            <span style={{ color: c.textTertiary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
              {el.text}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Main ToolPanel ─────────────────────────────────────────────────────

export function ToolPanel({ activeTool, onInsert, darkMode, htmlContent }: ToolPanelProps) {
  const { reduceMotion } = useAccessibility()
  const c = darkMode ? DARK_COLORS : COLORS
  const [searchQuery, setSearchQuery] = React.useState('')

  const getPanelContent = () => {
    switch (activeTool) {
      case 'sections':
        return {
          title: 'Sections',
          icon: <LayoutTemplate size={16} />,
          items: SECTION_ITEMS,
          emptyText: 'No sections available',
        }
      case 'components':
        return {
          title: 'Components',
          icon: <Type size={16} />,
          items: COMPONENT_ITEMS,
          emptyText: 'No components available',
        }
      case 'media':
        return {
          title: 'Media',
          icon: <ImageIcon size={16} />,
          items: MEDIA_ITEMS,
          emptyText: 'No media available',
        }
      default:
        return null
    }
  }

  const panelConfig = getPanelContent()

  // Compute filtered and categorized items (hooks must be before early returns)
  const filteredItems = React.useMemo(() => {
    if (!panelConfig) return []
    if (!searchQuery) return panelConfig.items
    return panelConfig.items.filter((i) =>
      i.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (i.description || '').toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [panelConfig, searchQuery])

  const categorized = React.useMemo(() => {
    const groups: Record<string, ToolPanelItem[]> = {}
    for (const item of filteredItems) {
      const cat = item.category || 'all'
      if (!groups[cat]) groups[cat] = []
      groups[cat].push(item)
    }
    return groups
  }, [filteredItems])

  // Tools that show custom panels
  if (activeTool === 'layers') {
    return (
      <div style={{
        width: 240,
        height: '100%',
        background: c.panel,
        borderRight: `1px solid ${c.border}`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '12px 14px',
          borderBottom: `1px solid ${c.border}`,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <ListTree size={16} style={{ color: c.primary }} />
          <span style={{ fontSize: 14, fontWeight: 600, color: c.text }}>Layers</span>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 6px' }}>
          <LayersPanel htmlContent={htmlContent} onInsert={onInsert} darkMode={darkMode} />
        </div>
      </div>
    )
  }

  if (activeTool === 'pages') {
    return (
      <div style={{
        width: 240,
        height: '100%',
        background: c.panel,
        borderRight: `1px solid ${c.border}`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '12px 14px',
          borderBottom: `1px solid ${c.border}`,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <Layers size={16} style={{ color: c.primary }} />
          <span style={{ fontSize: 14, fontWeight: 600, color: c.text }}>Pages</span>
        </div>
        <div style={{ padding: '12px 14px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 10px',
            borderRadius: RADIUS.lg,
            background: c.primaryLight,
            color: c.primary,
            fontWeight: 500,
            fontSize: 13,
          }}>
            <Globe size={14} />
            index.html
            <span style={{ marginLeft: 'auto', fontSize: 11, opacity: 0.7 }}>Active</span>
          </div>
          <button
            type="button"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              marginTop: 8,
              padding: '6px 10px',
              borderRadius: RADIUS.md,
              border: `1px dashed ${c.border}`,
              background: 'transparent',
              color: c.textTertiary,
              cursor: 'pointer',
              fontSize: 12,
              width: '100%',
            }}
          >
            <Plus size={12} />
            Add page
          </button>
        </div>
      </div>
    )
  }

  if (activeTool === 'history') {
    return (
      <div style={{
        width: 240,
        height: '100%',
        background: c.panel,
        borderRight: `1px solid ${c.border}`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '12px 14px',
          borderBottom: `1px solid ${c.border}`,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <History size={16} style={{ color: c.primary }} />
          <span style={{ fontSize: 14, fontWeight: 600, color: c.text }}>History</span>
        </div>
        <div style={{ flex: 1, padding: '16px 14px', textAlign: 'center', color: c.textTertiary, fontSize: 13 }}>
          <History size={24} style={{ margin: '0 auto 8px', display: 'block', opacity: 0.5 }} />
          Version history will appear here as you make changes.
        </div>
      </div>
    )
  }

  if (activeTool === 'brand' || activeTool === 'assets' || activeTool === 'settings') {
    const icons: Record<string, React.ReactNode> = {
      brand: <Palette size={16} />,
      assets: <FolderOpen size={16} />,
      settings: <Settings2 size={16} />,
    }
    const titles: Record<string, string> = {
      brand: 'Brand Kit',
      assets: 'Assets',
      settings: 'Settings',
    }
    const descs: Record<string, string> = {
      brand: 'Manage brand colors, fonts, and logos.',
      assets: 'Upload and manage images and files.',
      settings: 'Editor preferences and configuration.',
    }
    return (
      <div style={{
        width: 240,
        height: '100%',
        background: c.panel,
        borderRight: `1px solid ${c.border}`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '12px 14px',
          borderBottom: `1px solid ${c.border}`,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          {icons[activeTool]}
          <span style={{ fontSize: 14, fontWeight: 600, color: c.text }}>{titles[activeTool]}</span>
        </div>
        <div style={{ flex: 1, padding: '16px 14px', textAlign: 'center', color: c.textTertiary, fontSize: 13 }}>
          {activeTool === 'brand' && <Palette size={24} style={{ margin: '0 auto 8px', display: 'block', opacity: 0.5 }} />}
          {activeTool === 'assets' && <FolderOpen size={24} style={{ margin: '0 auto 8px', display: 'block', opacity: 0.5 }} />}
          {activeTool === 'settings' && <Settings2 size={24} style={{ margin: '0 auto 8px', display: 'block', opacity: 0.5 }} />}
          {descs[activeTool]}
        </div>
      </div>
    )
  }

  // Standard items-based panel (sections, components, media)
  if (!panelConfig) return null

  return (
    <div style={{
      width: 240,
      height: '100%',
      background: c.panel,
      borderRight: `1px solid ${c.border}`,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '10px 14px',
        borderBottom: `1px solid ${c.border}`,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: c.primary }}>{panelConfig.icon}</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: c.text }}>{panelConfig.title}</span>
          <span style={{
            marginLeft: 'auto',
            fontSize: 11,
            color: c.textTertiary,
            background: c.background,
            padding: '2px 6px',
            borderRadius: RADIUS.sm,
          }}>
            {panelConfig.items.length}
          </span>
        </div>
        {/* Search */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '0 8px',
          height: 32,
          borderRadius: RADIUS.lg,
          border: `1px solid ${c.border}`,
          background: c.background,
        }}>
          <Search size={13} style={{ color: c.textTertiary }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            style={{
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: 12,
              color: c.text,
              flex: 1,
            }}
          />
        </div>
      </div>

      {/* Items */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 6px' }}>
        {Object.entries(categorized).map(([cat, items]) => (
          <PanelSection key={cat} title={cat === 'all' ? panelConfig.title : cat} darkMode={darkMode}>
            {items.map((item) => (
              <PanelItem key={item.id} item={item} onInsert={onInsert} darkMode={darkMode} />
            ))}
          </PanelSection>
        ))}
        {filteredItems.length === 0 && (
          <div style={{ padding: '24px 16px', textAlign: 'center', color: c.textTertiary, fontSize: 13 }}>
            No results found
          </div>
        )}
      </div>

      {/* AI quick add */}
      <div style={{
        padding: '10px 14px',
        borderTop: `1px solid ${c.border}`,
      }}>
        <button
          type="button"
          onClick={() => onInsert('', 'AI generate')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            width: '100%',
            padding: '8px',
            borderRadius: RADIUS.lg,
            border: `1px dashed ${c.border}`,
            background: 'transparent',
            color: c.primary,
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: 500,
          }}
        >
          <Sparkles size={14} />
          Generate with AI
        </button>
      </div>
    </div>
  )
}
