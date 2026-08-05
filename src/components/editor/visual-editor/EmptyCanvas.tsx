// ─── Empty Canvas Start Screen ─────────────────────────────────────────────
// "Never show a blank page." Offers clear, large, keyboard-navigable starting
// points. Screen-reader friendly structure. Animated gradient background.

import * as React from 'react'
import { Sparkles, LayoutTemplate, Globe, FileCode, FilePlus2 } from 'lucide-react'
import { COLORS, RADIUS, SPACING, SHADOWS } from './design-tokens'

export interface StartOption {
  id: string
  label: string
  desc: string
  icon: React.ReactNode
  accent: boolean
}

export interface EmptyCanvasProps {
  onAction: (action: string) => void
}

const OPTIONS: StartOption[] = [
  { id: 'ai', label: 'Start with AI', desc: 'Describe your site and generate it instantly', icon: <Sparkles size={20} />, accent: true },
  { id: 'templates', label: 'Browse templates', desc: 'Pick a professional starting point', icon: <LayoutTemplate size={20} />, accent: false },
  { id: 'import', label: 'Import website', desc: 'Bring in an existing site or URL', icon: <Globe size={20} />, accent: false },
  { id: 'paste', label: 'Paste existing HTML', desc: 'Drop in code you already have', icon: <FileCode size={20} />, accent: false },
  { id: 'start-blank', label: 'Start blank', desc: 'Begin with an empty accessible page', icon: <FilePlus2 size={20} />, accent: false },
]

export function EmptyCanvas({ onAction }: EmptyCanvasProps) {
  const [hovered, setHovered] = React.useState<string | null>(null)

  return (
    <section aria-label="Get started"
      className="ve-empty-canvas"
      style={{
        height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: SPACING['3xl'], textAlign: 'center', gap: SPACING.xl,
        position: 'relative', overflow: 'hidden',
      }}>
      {/* Animated gradient background */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg, #EFF6FF 0%, #FAFAFA 30%, #FEF3C7 60%, #FAFAFA 100%)',
        backgroundSize: '300% 300%',
        animation: 've-gradient-shift 12s ease infinite',
        opacity: 0.6,
      }} />

      <div style={{ position: 'relative', zIndex: 1, width: 72, height: 72, borderRadius: '50%', background: COLORS.selectionLight, display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS.selection }}>
        <Sparkles size={34} />
      </div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <h2 style={{ fontSize: 26, fontWeight: 700, color: COLORS.text, margin: 0 }}>Start building your website</h2>
        <p style={{ fontSize: 15, color: COLORS.textSecondary, margin: '8px 0 0', maxWidth: 420, lineHeight: 1.5 }}>
          Build a stunning, accessible site with AI — faster than Canva.
        </p>
      </div>

      <div role="list" aria-label="Ways to start" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: SPACING.md, width: '100%', maxWidth: 620, position: 'relative', zIndex: 1 }}>
        {OPTIONS.map((o) => {
          const isHovered = hovered === o.id
          return (
            <button
              key={o.id} type="button" role="listitem" onClick={() => onAction(o.id)}
              className="ve-icobtn"
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10, textAlign: 'left',
                minHeight: 120, padding: SPACING.lg, borderRadius: RADIUS.xl, cursor: 'pointer',
                background: o.accent ? COLORS.primary : (isHovered ? COLORS.hover : COLORS.panel),
                color: o.accent ? '#FFFFFF' : COLORS.text,
                border: o.accent ? 'none' : `1px solid ${isHovered ? COLORS.borderHover : COLORS.border}`,
                boxShadow: isHovered ? SHADOWS.md : (o.accent ? SHADOWS.md : SHADOWS.sm),
                transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
                transition: 'transform 150ms ease, box-shadow 150ms ease, border-color 150ms ease, background 150ms ease',
              }}
              onMouseEnter={() => setHovered(o.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <span style={{ display: 'inline-flex', opacity: 0.9 }} aria-hidden="true">{o.icon}</span>
              <span style={{ fontSize: 15, fontWeight: 600 }}>{o.label}</span>
              <span style={{ fontSize: 13, opacity: o.accent ? 0.85 : 0.75 }}>{o.desc}</span>
            </button>
          )
        })}
      </div>

      <p style={{ fontSize: 13, color: COLORS.textTertiary, margin: 0, position: 'relative', zIndex: 1 }}>
        Tip: press <KbdInline>Ctrl+Shift+P</KbdInline> to run any command from anywhere.
      </p>
    </section>
  )
}

function KbdInline({ children }: { children: React.ReactNode }) {
  return (
    <kbd style={{ padding: '1px 6px', fontSize: 12, border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.sm, background: COLORS.panel }}>
      {children}
    </kbd>
  )
}
