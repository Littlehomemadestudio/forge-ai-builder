'use client'

// ─────────────────────────────────────────────────────────────────────────────
// Floating Selection Bar — Production-Grade Studio Component
// Dark floating bar above selected element, context-sensitive actions,
// framer-motion spring entrance/exit, reposition on scroll/resize,
// mobile bottom sheet, downward caret arrow, keyboard accessible.
// ─────────────────────────────────────────────────────────────────────────────

import * as React from 'react'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Copy,
  Trash2,
  Sparkles,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Crop,
  Link,
  Type,
  Image as ImageIcon,
  Pencil,
} from 'lucide-react'
import { Z_INDEX, ANIMATION } from './design-tokens'
import type { SelectionInfo } from './Canvas'
import { useAccessibility } from './AccessibilityContext'

// ═══════════════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════════════

export interface FloatingSelectionBarProps {
  selection: SelectionInfo | null
  onDuplicate: () => void
  onDelete: () => void
  onAI: () => void
  onBold: () => void
  onAlign: (align: 'left' | 'center' | 'right') => void
  onItalic?: () => void
}

// ═══════════════════════════════════════════════════════════════════════════
// Motion variants
// ═══════════════════════════════════════════════════════════════════════════

const BAR_VARIANTS = {
  initial: { opacity: 0, scale: 0.8, y: 4 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit:    { opacity: 0, scale: 0.8, y: 4 },
}

const CARET_VARIANTS = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit:    { opacity: 0 },
}

const SHEET_VARIANTS = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: 40 },
}

// ═══════════════════════════════════════════════════════════════════════════
// BarButton — 32px touch-friendly button for the floating bar
// ═══════════════════════════════════════════════════════════════════════════

function BarButton({
  label,
  onClick,
  active = false,
  danger = false,
  children,
}: {
  label: string
  onClick: () => void
  active?: boolean
  danger?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`
        flex items-center justify-center w-8 h-8 rounded-md
        transition-colors duration-75 outline-none
        focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 focus-visible:ring-offset-gray-900
        ${danger
          ? 'text-gray-400 hover:text-red-400 hover:bg-red-500/10 active:bg-red-500/20'
          : active
            ? 'text-blue-400 bg-blue-500/15 hover:bg-blue-500/25'
            : 'text-gray-300 hover:text-white hover:bg-white/10 active:bg-white/15'
        }
      `}
    >
      {children}
    </button>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// Vertical divider
// ═══════════════════════════════════════════════════════════════════════════

function VDivider() {
  return <div className="w-px h-5 bg-gray-700/60 mx-0.5 shrink-0" />
}

// ═══════════════════════════════════════════════════════════════════════════
// FloatingSelectionBar
// ═══════════════════════════════════════════════════════════════════════════

export function FloatingSelectionBar(p: FloatingSelectionBarProps) {
  const { reduceMotion } = useAccessibility()
  const [rect, setRect] = useState<DOMRect | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const barRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)

  // ── Ref to track current selection for event handlers ────────────────
  const selectionRef = useRef(p.selection)
  useEffect(() => { selectionRef.current = p.selection }, [p.selection])

  // ── DOM measurement (called from event handlers, not directly in effects) ──
  const measure = useCallback(() => {
    const sel = selectionRef.current
    if (!sel) { setRect(null); return }
    const el = document.querySelector(`[data-ve-sel="${sel.fid}"]`) as HTMLElement | null
    if (el) setRect(el.getBoundingClientRect())
    else setRect(null)
  }, [])

  // RAF-throttled update for scroll/resize
  const scheduleUpdate = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(measure)
  }, [measure])

  // Initial measurement when selection changes.
  // useLayoutEffect + setState is the standard React pattern for DOM measurement
  // (synchronous, before paint).
  /* eslint-disable react-hooks/set-state-in-effect */
  useLayoutEffect(() => {
    const sel = p.selection
    if (!sel) { setRect(null) } else {
      const el = document.querySelector(`[data-ve-sel="${sel.fid}"]`) as HTMLElement | null
      if (el) setRect(el.getBoundingClientRect())
      else setRect(null)
    }
    setIsMobile(window.innerWidth < 768)
  }, [p.selection])
  /* eslint-enable react-hooks/set-state-in-effect */

  // Recalculate position on scroll/resize
  useEffect(() => {
    const onResize = () => {
      setIsMobile(window.innerWidth < 768)
      scheduleUpdate()
    }
    window.addEventListener('scroll', scheduleUpdate, true)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('scroll', scheduleUpdate, true)
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(rafRef.current)
    }
  }, [scheduleUpdate])

  // ── Don't render if no selection ─────────────────────────────────────
  const hasSelection = p.selection !== null && rect !== null

  // ── Context actions based on element type ────────────────────────────
  const sel = p.selection

  // Spring transition config
  const springTransition = reduceMotion
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 300, damping: 22, mass: 1 }

  // ════════════════════════════════════════════════════════════════════
  // Mobile: Bottom sheet
  // ════════════════════════════════════════════════════════════════════
  if (isMobile && hasSelection) {
    return (
      <AnimatePresence>
        <motion.div
          ref={barRef}
          role="toolbar"
          aria-label={`Actions for ${sel!.tag}`}
          className="fixed bottom-0 left-0 right-0 z-[300]
                     bg-gray-900 border-t border-gray-700/60
                     px-3 pt-2 pb-[env(safe-area-inset-bottom,8px)]
                     shadow-[0_-4px_24px_rgba(0,0,0,0.3)]"
          style={{ zIndex: Z_INDEX.floatingPanel }}
          variants={SHEET_VARIANTS}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={springTransition}
        >
          {/* Top row: tag + context actions */}
          <div className="flex items-center gap-1 mb-2">
            <TagBadge tag={sel!.tag} />
            <VDivider />
            <ContextButtons sel={sel!} p={p} />
          </div>

          {/* Bottom row: universal actions */}
          <div className="flex items-center gap-1">
            <BarButton label="AI improve" onClick={p.onAI} active>
              <Sparkles size={15} />
            </BarButton>
            <BarButton label="Duplicate" onClick={p.onDuplicate}>
              <Copy size={15} />
            </BarButton>
            <BarButton label="Delete" onClick={p.onDelete} danger>
              <Trash2 size={15} />
            </BarButton>
          </div>
        </motion.div>
      </AnimatePresence>
    )
  }

  // ════════════════════════════════════════════════════════════════════
  // Desktop: Floating bar above selection
  // ════════════════════════════════════════════════════════════════════
  if (!hasSelection) return null

  const barW = 320
  let left = rect!.left + rect!.width / 2 - barW / 2
  let top = rect!.top - 52 // bar height + caret + gap
  const vw = window.innerWidth

  // Clamp to viewport
  left = Math.max(8, Math.min(vw - barW - 8, left))

  // If too close to top, flip below
  const flipBelow = top < 60
  if (flipBelow) {
    top = rect!.bottom + 10
  }

  return (
    <AnimatePresence>
      <div style={{ position: 'fixed', left, top, zIndex: Z_INDEX.floatingPanel, pointerEvents: 'none' }}>
        {/* Floating bar */}
        <motion.div
          ref={barRef}
          role="toolbar"
          aria-label={`Actions for ${sel!.tag}`}
          className="pointer-events-auto
                     flex items-center gap-0.5 px-1.5 py-1
                     bg-gray-900 rounded-lg
                     border border-gray-700/50
                     shadow-[0_8px_24px_rgba(0,0,0,0.35),0_2px_6px_rgba(0,0,0,0.2)]"
          variants={BAR_VARIANTS}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={springTransition}
        >
          {/* Tag badge */}
          <TagBadge tag={sel!.tag} />
          <VDivider />

          {/* Context-specific actions */}
          <ContextButtons sel={sel!} p={p} />
          <VDivider />

          {/* Universal actions */}
          <BarButton label="AI improve" onClick={p.onAI} active>
            <Sparkles size={14} />
          </BarButton>
          <BarButton label="Duplicate" onClick={p.onDuplicate}>
            <Copy size={14} />
          </BarButton>
          <BarButton label="Delete" onClick={p.onDelete} danger>
            <Trash2 size={14} />
          </BarButton>
        </motion.div>

        {/* Downward caret arrow */}
        {!flipBelow && (
          <motion.div
            className="flex justify-center"
            variants={CARET_VARIANTS}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: reduceMotion ? 0 : 0.15 }}
          >
            <div
              className="w-3 h-3 bg-gray-900 border-b border-r border-gray-700/50
                         rotate-45 -mt-1.5"
              style={{ marginLeft: barW / 2 - 6 + (rect!.left + rect!.width / 2 - left) - barW / 2 }}
            />
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  )
}


// ═══════════════════════════════════════════════════════════════════════════
// Sub-components (kept outside to avoid re-creating on every render)
// ═══════════════════════════════════════════════════════════════════════════

function TagBadge({ tag }: { tag: string }) {
  return (
    <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wide
                     bg-blue-500/15 text-blue-400 shrink-0 select-none">
      {tag}
    </span>
  )
}

function ContextButtons({ sel, p }: { sel: SelectionInfo; p: FloatingSelectionBarProps }) {
  return (
    <div className="flex items-center gap-0.5">
      {/* Text element actions */}
      {sel.isText && (
        <>
          <BarButton label="Bold" onClick={p.onBold}>
            <Bold size={14} />
          </BarButton>
          {p.onItalic && (
            <BarButton label="Italic" onClick={p.onItalic}>
              <Italic size={14} />
            </BarButton>
          )}
          <VDivider />
          <BarButton label="Align left" onClick={() => p.onAlign('left')}>
            <AlignLeft size={14} />
          </BarButton>
          <BarButton label="Align center" onClick={() => p.onAlign('center')}>
            <AlignCenter size={14} />
          </BarButton>
          <BarButton label="Align right" onClick={() => p.onAlign('right')}>
            <AlignRight size={14} />
          </BarButton>
        </>
      )}

      {/* Image element actions */}
      {sel.isImage && (
        <>
          <BarButton label="Edit alt text" onClick={p.onAI}>
            <Pencil size={14} />
          </BarButton>
          <BarButton label="Crop / fit" onClick={p.onAI}>
            <Crop size={14} />
          </BarButton>
        </>
      )}

      {/* Button/Link element actions */}
      {(sel.isButton || sel.isLink) && (
        <>
          <BarButton label="Edit link" onClick={p.onAI}>
            <Link size={14} />
          </BarButton>
          <BarButton label="Change label" onClick={p.onAI}>
            <Type size={14} />
          </BarButton>
        </>
      )}
    </div>
  )
}
