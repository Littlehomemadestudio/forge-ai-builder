// ─── Floating Context Toolbar ──────────────────────────────────────────────
// Appears above the selected element. Keyboard accessible, tooltips on all
// icons, reduced-motion aware. Mirrors Framer/Figma selection UX.

import * as React from 'react'
import { Copy, Trash2, Wand2, Bold, AlignLeft, AlignCenter, AlignRight, Type, Italic, Crop, Link } from 'lucide-react'
import { COLORS, RADIUS, SHADOWS, Z_INDEX } from './design-tokens'
import { IconButton } from './primitives'
import type { SelectionInfo } from './Canvas'

export interface FloatingSelectionBarProps {
  selection: SelectionInfo | null
  onDuplicate: () => void
  onDelete: () => void
  onAI: () => void
  onBold: () => void
  onAlign: (align: 'left' | 'center' | 'right') => void
  onItalic?: () => void
}

export function FloatingSelectionBar(p: FloatingSelectionBarProps) {
  const [rect, setRect] = React.useState<DOMRect | null>(null)
  const [isMobile, setIsMobile] = React.useState(false)
  const barRef = React.useRef<HTMLDivElement>(null)

  // Measure the selected element so the bar floats above it.
  const updateRect = React.useCallback(() => {
    if (!p.selection) { setRect(null); return }
    const el = document.querySelector(`[data-ve-sel="${p.selection.fid}"]`) as HTMLElement | null
    if (el) setRect(el.getBoundingClientRect())
    else setRect(null)
  }, [p.selection])

  React.useLayoutEffect(() => {
    updateRect()
    setIsMobile(window.innerWidth < 768)
  }, [updateRect])

  // Recalculate position on scroll/resize
  React.useEffect(() => {
    const onScroll = () => updateRect()
    const onResize = () => { updateRect(); setIsMobile(window.innerWidth < 768) }
    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', onResize)
    }
  }, [updateRect])

  if (!p.selection || !rect) return null

  // Mobile: bottom sheet style
  if (isMobile) {
    return (
      <div
        ref={barRef}
        role="toolbar" aria-label={`Actions for ${p.selection.tag}`}
        className="ve-floating-bar-mobile"
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: Z_INDEX.floatingPanel,
          display: 'flex', alignItems: 'center', gap: 4, padding: '8px 12px',
          background: COLORS.panel, borderTop: `1px solid ${COLORS.border}`,
          boxShadow: SHADOWS.lg, justifyContent: 'space-between', flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <span aria-hidden style={{ fontSize: 11, fontWeight: 600, color: COLORS.textTertiary, padding: '0 4px', textTransform: 'uppercase' }}>
            {p.selection.tag}
          </span>
          {p.selection.isText && (
            <>
              <IconButton label="Bold" size={36} onClick={p.onBold}><Bold size={16} /></IconButton>
              {p.onItalic && <IconButton label="Italic" size={36} onClick={p.onItalic}><Italic size={16} /></IconButton>}
              <IconButton label="Align left" size={36} onClick={() => p.onAlign('left')}><AlignLeft size={16} /></IconButton>
              <IconButton label="Align center" size={36} onClick={() => p.onAlign('center')}><AlignCenter size={16} /></IconButton>
            </>
          )}
          {p.selection.isImage && (
            <IconButton label="Crop / fit" size={36} onClick={p.onAI}><Crop size={16} /></IconButton>
          )}
          {p.selection.isButton && (
            <IconButton label="Edit link" size={36} onClick={p.onAI}><Link size={16} /></IconButton>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton label="AI action" size={36} onClick={p.onAI} active><Wand2 size={16} /></IconButton>
          <IconButton label="Duplicate" size={36} onClick={p.onDuplicate}><Copy size={16} /></IconButton>
          <IconButton label="Delete" size={36} onClick={p.onDelete} danger><Trash2 size={16} /></IconButton>
        </div>
      </div>
    )
  }

  // Desktop: floating bar
  const barW = 280
  let left = rect.left + rect.width / 2 - barW / 2
  let top = rect.top - 52
  const vw = window.innerWidth
  left = Math.max(8, Math.min(vw - barW - 8, left))
  if (top < 60) top = rect.bottom + 12

  return (
    <div
      ref={barRef}
      role="toolbar" aria-label={`Actions for ${p.selection.tag}`}
      style={{
        position: 'fixed', left, top, zIndex: Z_INDEX.floatingPanel, display: 'flex', alignItems: 'center',
        gap: 2, padding: 4, background: COLORS.panel, borderRadius: RADIUS.xl,
        border: `1px solid ${COLORS.border}`, boxShadow: SHADOWS.lg, width: barW,
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <span aria-hidden style={{ fontSize: 12, fontWeight: 600, color: COLORS.textTertiary, padding: '0 6px', textTransform: 'uppercase' }}>
          {p.selection.tag}
        </span>
        {p.selection.isText && (
          <>
            <IconButton label="Bold" size={36} onClick={p.onBold}><Bold size={16} /></IconButton>
            {p.onItalic && <IconButton label="Italic" size={36} onClick={p.onItalic}><Italic size={16} /></IconButton>}
            <IconButton label="Align left" size={36} onClick={() => p.onAlign('left')}><AlignLeft size={16} /></IconButton>
            <IconButton label="Align center" size={36} onClick={() => p.onAlign('center')}><AlignCenter size={16} /></IconButton>
            <IconButton label="Align right" size={36} onClick={() => p.onAlign('right')}><AlignRight size={16} /></IconButton>
          </>
        )}
        {p.selection.isImage && (
          <IconButton label="Crop / fit" size={36} onClick={p.onAI}><Crop size={16} /></IconButton>
        )}
        {p.selection.isButton && (
          <IconButton label="Edit link" size={36} onClick={p.onAI}><Link size={16} /></IconButton>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton label="AI action" size={36} onClick={p.onAI} active><Wand2 size={16} /></IconButton>
        <IconButton label="Duplicate" size={36} onClick={p.onDuplicate}><Copy size={16} /></IconButton>
        <IconButton label="Delete" size={36} onClick={p.onDelete} danger><Trash2 size={16} /></IconButton>
      </div>
    </div>
  )
}
