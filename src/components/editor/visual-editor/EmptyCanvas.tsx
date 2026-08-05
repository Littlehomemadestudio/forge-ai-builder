// ─── Empty Canvas Start Screen ─────────────────────────────────────────────
// "Never show a blank page." Offers clear, large, keyboard-navigable starting
// points. Screen-reader friendly structure. Enhanced with modern visual design.

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
  { id: 'ai', label: 'Start with AI', desc: 'Describe your site and generate it instantly', icon: <Sparkles size={18} />, accent: true },
  { id: 'templates', label: 'Browse templates', desc: 'Pick a professional starting point', icon: <LayoutTemplate size={18} />, accent: false },
  { id: 'import', label: 'Import website', desc: 'Bring in an existing site or URL', icon: <Globe size={18} />, accent: false },
  { id: 'paste', label: 'Paste HTML', desc: 'Drop in code you already have', icon: <FileCode size={18} />, accent: false },
  { id: 'start-blank', label: 'Start blank', desc: 'Begin with an empty accessible page', icon: <FilePlus2 size={18} />, accent: false },
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
      {/* Subtle gradient background */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg, #EFF6FF 0%, #FAFAFA 25%, #F0FDF4 50%, #FEF3C7 75%, #FAFAFA 100%)',
        backgroundSize: '400% 400%',
        animation: 've-gradient-shift 15s ease infinite',
        opacity: 0.5,
      }} />

      {/* Logo/icon */}
      <div style={{
        position: 'relative', zIndex: 1,
        width: 64, height: 64,
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${COLORS.primary}, #7C3AED)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#FFFFFF',
        boxShadow: `0 8px 24px rgba(37, 99, 235, 0.3)`,
      }}>
        <Sparkles size={28} />
      </div>

      {/* Heading */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <h2 style={{
          fontSize: 28, fontWeight: 700, color: COLORS.text, margin: 0,
          letterSpacing: '-0.02em',
        }}>
          Start building your website
        </h2>
        <p style={{
          fontSize: 15, color: COLORS.textSecondary, margin: '10px 0 0', maxWidth: 440, lineHeight: 1.6,
        }}>
          Build a stunning, accessible site with AI — faster than ever.
        </p>
      </div>

      {/* Options grid */}
      <div role="list" aria-label="Ways to start" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: SPACING.md,
        width: '100%',
        maxWidth: 640,
        position: 'relative', zIndex: 1,
      }}>
        {OPTIONS.map((o) => {
          const isHovered = hovered === o.id
          return (
            <button
              key={o.id} type="button" role="listitem" onClick={() => onAction(o.id)}
              className="ve-icobtn"
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10, textAlign: 'left',
                minHeight: 110, padding: SPACING.lg, borderRadius: RADIUS.xl, cursor: 'pointer',
                background: o.accent
                  ? `linear-gradient(135deg, ${COLORS.primary}, #4F46E5)`
                  : (isHovered ? COLORS.hover : COLORS.panel),
                color: o.accent ? '#FFFFFF' : COLORS.text,
                border: o.accent ? 'none' : `1px solid ${isHovered ? COLORS.borderHover : COLORS.border}`,
                boxShadow: isHovered ? SHADOWS.md : (o.accent ? `0 4px 16px rgba(37, 99, 235, 0.25)` : SHADOWS.sm),
                transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
                transition: 'transform 150ms ease, box-shadow 150ms ease, border-color 150ms ease, background 150ms ease',
              }}
              onMouseEnter={() => setHovered(o.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <span style={{
                display: 'inline-flex',
                width: 32, height: 32,
                borderRadius: RADIUS.md,
                background: o.accent ? 'rgba(255,255,255,0.2)' : COLORS.primaryLight,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0.95,
              }} aria-hidden="true">
                {o.icon}
              </span>
              <span style={{ fontSize: 14, fontWeight: 600 }}>{o.label}</span>
              <span style={{ fontSize: 12, opacity: o.accent ? 0.85 : 0.7, lineHeight: 1.4 }}>{o.desc}</span>
            </button>
          )
        })}
      </div>

      <p style={{ fontSize: 12, color: COLORS.textTertiary, margin: 0, position: 'relative', zIndex: 1 }}>
        Tip: press <KbdInline>Ctrl+Shift+P</KbdInline> to open the command palette
      </p>

      <style>{`
        @keyframes ve-gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </section>
  )
}

function KbdInline({ children }: { children: React.ReactNode }) {
  return (
    <kbd style={{
      padding: '2px 6px',
      fontSize: 11,
      border: `1px solid ${COLORS.border}`,
      borderRadius: RADIUS.sm,
      background: COLORS.panel,
      fontFamily: 'inherit',
    }}>
      {children}
    </kbd>
  )
}
