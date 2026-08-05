'use client'

// ─── Canvas ────────────────────────────────────────────────────────────────
// Production-grade studio canvas: pannable, zoomable viewport with dot grid,
// device preview, click-to-select with resize handles, hover indicators,
// zoom display, scroll-to-selected, dark mode, and smooth transitions.
// Inspired by Figma / Framer / Webflow editing surfaces.

import * as React from 'react'
import { useEffect, useRef, useState, useMemo } from 'react'
import {
  LIGHT_COLORS,
  DARK_COLORS,
  RADIUS,
  SHADOWS,
  GRID,
  ANIMATION,
  Z_INDEX,
  useEditorTheme,
} from './design-tokens'
import { announce } from './primitives'
import { useAccessibility } from './AccessibilityContext'

// ═══════════════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════════════

export interface SelectionInfo {
  fid: string
  tag: string
  text: string
  isImage: boolean
  isText: boolean
  isButton: boolean
  isLink: boolean
  isSection: boolean
  color?: string
  bgColor?: string
  fontSize?: string
  fontWeight?: string
  rect: { left: number; top: number; width: number; height: number }
}

export interface CanvasProps {
  html: string
  css: string
  device: 'desktop' | 'tablet' | 'mobile'
  zoom: number
  selectedFid: string | null
  spaceHeld: boolean
  onSelect: (s: SelectionInfo | null) => void
  onChangeHtml: (html: string, label: string) => void
  hasContent: boolean
  onContentReady?: (el: HTMLElement | null) => void
}

// ═══════════════════════════════════════════════════════════════════════════
// Constants
// ═══════════════════════════════════════════════════════════════════════════

export const DEVICE_WIDTH: Record<'desktop' | 'tablet' | 'mobile', number> = {
  desktop: 1280,
  tablet: 768,
  mobile: 390,
}

export const SELECTABLE =
  'h1,h2,h3,h4,h5,h6,p,img,button,a,section,header,footer,nav,div,ul,li,form,span'

const DEVICE_FRAME_RADIUS: Record<'desktop' | 'tablet' | 'mobile', string> = {
  desktop: RADIUS.xl,
  tablet: RADIUS['2xl'],
  mobile: RADIUS['3xl'],
}

const DEVICE_BEZEL: Record<'desktop' | 'tablet' | 'mobile', number> = {
  desktop: 0,
  tablet: 8,
  mobile: 16,
}

// ═══════════════════════════════════════════════════════════════════════════
// findByFid — exported so VisualEditor.tsx can import instead of duplicating
// ═══════════════════════════════════════════════════════════════════════════

/** Find a DOM node by its path-based fid (e.g. "0-1-2") inside root. */
export function findByFid(root: HTMLElement | null, fid: string): HTMLElement | null {
  if (!root) return null
  const parts = fid.split('-').map(Number)
  let el: Element = root
  for (const idx of parts) {
    const children = Array.from(el.children).filter((c) => c.nodeType === 1)
    if (idx >= children.length) return null
    el = children[idx]
  }
  return el as HTMLElement
}

// ═══════════════════════════════════════════════════════════════════════════
// buildFid — stable path id from element to root
// ═══════════════════════════════════════════════════════════════════════════

function buildFid(el: HTMLElement, root: HTMLElement): string {
  const parts: string[] = []
  let node: HTMLElement | null = el
  while (node && node !== root) {
    const parent = node.parentElement
    let index = 0
    if (parent) {
      for (let sib: ChildNode | null = node.previousSibling; sib; sib = sib.previousSibling) {
        if (sib.nodeType === 1) index++
      }
    }
    parts.unshift(String(index))
    node = parent
  }
  return parts.join('-')
}

// ═══════════════════════════════════════════════════════════════════════════
// Editor CSS — selection highlights, hover outlines, 8 resize handles (CSS)
// ═══════════════════════════════════════════════════════════════════════════

function buildEditorCss(selectionColor: string, handleColor: string): string {
  // Handle gradient: white center with blue border ring
  // 8 handles: 4 corners + 4 edge midpoints
  const h = (x: string, y: string) =>
    `radial-gradient(circle 5px at ${x} ${y}, ${handleColor} 42%, ${selectionColor} 44%, ${selectionColor} 48%, transparent 50%)`

  return `
/* ── Selection highlight ─────────────────────────────────────────────── */
.ve-selected {
  outline: 2px solid ${selectionColor} !important;
  outline-offset: 2px !important;
  box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.12) !important;
  position: relative;
  border-radius: 2px;
  z-index: 1;
}

/* Dashed outer ring around selection */
.ve-selected::before {
  content: '';
  position: absolute;
  inset: -6px;
  border: 1px dashed rgba(59, 130, 246, 0.3);
  border-radius: 3px;
  pointer-events: none;
}

/* ── Resize handles (8 total: 4 corners + 4 edge midpoints) ─────────── */
.ve-selected::after {
  content: '';
  position: absolute;
  top: -6px; left: -6px; right: -6px; bottom: -6px;
  pointer-events: none;
  background:
    ${h('0%', '0%')},
    ${h('50%', '0%')},
    ${h('100%', '0%')},
    ${h('0%', '50%')},
    ${h('100%', '50%')},
    ${h('0%', '100%')},
    ${h('50%', '100%')},
    ${h('100%', '100%')};
}

/* ── Hover target ────────────────────────────────────────────────────── */
.ve-hover-target {
  cursor: pointer;
}
.ve-hover-target:hover {
  outline: 1.5px dashed rgba(59, 130, 246, 0.45) !important;
  outline-offset: 2px !important;
}

/* ── Active hover indicator (programmatic) ───────────────────────────── */
.ve-hovered {
  outline: 1.5px dashed rgba(59, 130, 246, 0.5) !important;
  outline-offset: 2px !important;
}
`
}

// ═══════════════════════════════════════════════════════════════════════════
// Canvas Component
// ═══════════════════════════════════════════════════════════════════════════

export function Canvas(p: CanvasProps) {
  const theme = useEditorTheme()
  const { reduceMotion } = useAccessibility()
  const isDark = theme.mode === 'dark'

  // ── Refs ──────────────────────────────────────────────────────────────
  const vpRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const panningRef = useRef(false)
  const lastPoint = useRef({ x: 0, y: 0 })
  const selToken = useRef<string | null>(null)
  const hoveredFidRef = useRef<string | null>(null)

  // ── State ─────────────────────────────────────────────────────────────
  const [isPanning, setIsPanning] = useState(false)
  const [showGrid, setShowGrid] = useState(true)

  const width = DEVICE_WIDTH[p.device]
  const bezel = DEVICE_BEZEL[p.device]

  // ── Theme-derived colors ──────────────────────────────────────────────
  const colors = isDark ? DARK_COLORS : LIGHT_COLORS
  const canvasBg = colors.canvas.background
  const canvasDot = colors.canvas.dot
  const artboardBg = colors.canvas.artboard
  const selectionColor = colors.selection.fill
  const handleFill = colors.selection.handle
  const borderColor = colors.border.default
  const textTertiary = colors.onSurface.tertiary

  // ── Editor CSS (theme-aware) ──────────────────────────────────────────
  const editorCss = useMemo(
    () => buildEditorCss(selectionColor, handleFill),
    [selectionColor, handleFill]
  )
  const fullCss = editorCss + (p.css || '')

  // ── Dot grid background (minor + major dots) ─────────────────────────
  const gridStyle = useMemo(
    () => ({
      backgroundImage: `
        radial-gradient(circle ${GRID.dotSize}px at center, ${canvasDot} 0.8px, transparent 0.8px),
        radial-gradient(circle ${GRID.dotSize * 1.5}px at center, ${canvasDot} 0.4px, transparent 0.4px)
      `,
      backgroundSize: `${GRID.minorGrid}px ${GRID.minorGrid}px, ${GRID.majorGrid}px ${GRID.majorGrid}px`,
    }),
    [canvasDot]
  )

  // ── Selection highlight sync (imperative DOM, survives re-renders) ───
  useEffect(() => {
    const root = contentRef.current
    if (!root) return

    // Clear previous selection
    if (selToken.current) {
      const prev = root.querySelector(`[data-ve-sel="${selToken.current}"]`)
      if (prev) {
        prev.classList.remove('ve-selected')
        prev.removeAttribute('data-ve-sel')
      }
      selToken.current = null
    }

    if (!p.selectedFid) return

    const el = findByFid(root, p.selectedFid)
    if (el) {
      el.classList.add('ve-selected')
      el.setAttribute('data-ve-sel', p.selectedFid)
      selToken.current = p.selectedFid

      // Scroll to selected element if off-screen
      const vp = vpRef.current
      if (vp) {
        const elRect = el.getBoundingClientRect()
        const vpRect = vp.getBoundingClientRect()
        const margin = 80
        if (
          elRect.top < vpRect.top + margin ||
          elRect.bottom > vpRect.bottom - margin ||
          elRect.left < vpRect.left + margin ||
          elRect.right > vpRect.right - margin
        ) {
          el.scrollIntoView({
            behavior: reduceMotion ? 'auto' : 'smooth',
            block: 'nearest',
            inline: 'nearest',
          })
        }
      }
    }
  }, [p.selectedFid, p.html, reduceMotion])

  // ── Expose content root ──────────────────────────────────────────────
  useEffect(() => {
    p.onContentReady?.(contentRef.current)
  }, [p.onContentReady])

  // ── Attach hover outlines to selectable elements ─────────────────────
  useEffect(() => {
    const root = contentRef.current
    if (!root) return
    const elements = root.querySelectorAll(SELECTABLE)
    elements.forEach((el) => {
      ;(el as HTMLElement).classList.add('ve-hover-target')
    })
    return () => {
      elements.forEach((el) => {
        ;(el as HTMLElement).classList.remove('ve-hover-target')
      })
    }
  }, [p.html])

  // ── Track hover for dashed indicator ─────────────────────────────────
  const handleMouseMove = (e: React.MouseEvent) => {
    if (panningRef.current) return
    const root = contentRef.current
    if (!root) return

    const target = e.target as HTMLElement
    const el = target.closest(SELECTABLE) as HTMLElement | null

    // Clear previous hover
    if (hoveredFidRef.current) {
      const prev = findByFid(root, hoveredFidRef.current)
      if (prev && prev !== el) {
        prev.classList.remove('ve-hovered')
      }
    }

    if (el && root.contains(el) && el.classList.contains('ve-hover-target')) {
      const fid = buildFid(el, root)
      if (fid !== p.selectedFid) {
        el.classList.add('ve-hovered')
        hoveredFidRef.current = fid
      } else {
        hoveredFidRef.current = null
      }
    } else {
      hoveredFidRef.current = null
    }
  }

  const handleMouseLeave = () => {
    const root = contentRef.current
    if (root && hoveredFidRef.current) {
      const prev = findByFid(root, hoveredFidRef.current)
      if (prev) prev.classList.remove('ve-hovered')
    }
    hoveredFidRef.current = null
  }

  // ── Read element info ────────────────────────────────────────────────
  const readInfo = (el: HTMLElement, root: HTMLElement): SelectionInfo | null => {
    const fid = buildFid(el, root)
    const tag = el.tagName.toLowerCase()
    const cs = window.getComputedStyle(el)
    const rect = el.getBoundingClientRect()
    const isSection = ['section', 'header', 'footer', 'nav', 'ul', 'li', 'form', 'div'].includes(tag)
    return {
      fid,
      tag,
      text: (el.textContent || '').trim().slice(0, 120),
      isImage: tag === 'img',
      isText: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a', 'span', 'li'].includes(tag),
      isButton: tag === 'button',
      isLink: tag === 'a',
      isSection,
      color: cs.color,
      bgColor:
        cs.backgroundColor && cs.backgroundColor !== 'rgba(0, 0, 0, 0)'
          ? cs.backgroundColor
          : undefined,
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
      rect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height },
    }
  }

  // ── Click to select ──────────────────────────────────────────────────
  const handleClick = (e: React.MouseEvent) => {
    if (panningRef.current) return
    const root = contentRef.current
    if (!root) return
    const target = e.target as HTMLElement
    const el = target.closest(SELECTABLE) as HTMLElement | null
    if (el && root.contains(el)) {
      p.onSelect(readInfo(el, root))
    } else {
      p.onSelect(null)
    }
  }

  // ── Drag-to-pan (Space + drag or middle mouse) ──────────────────────
  const startPan = (e: React.PointerEvent) => {
    if (e.button !== 1 && !p.spaceHeld) return
    e.preventDefault()
    e.stopPropagation()
    panningRef.current = true
    setIsPanning(true)
    lastPoint.current = { x: e.clientX, y: e.clientY }

    const vp = vpRef.current

    const move = (ev: PointerEvent) => {
      if (!vp) return
      const dx = ev.clientX - lastPoint.current.x
      const dy = ev.clientY - lastPoint.current.y
      vp.scrollLeft -= dx
      vp.scrollTop -= dy
      lastPoint.current = { x: ev.clientX, y: ev.clientY }
    }
    const up = () => {
      panningRef.current = false
      setIsPanning(false)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  // ── Keyboard: nudge + delete ─────────────────────────────────────────
  useEffect(() => {
    if (!p.selectedFid) return
    const root = contentRef.current
    if (!root) return
    const el = findByFid(root, p.selectedFid)
    if (!el) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key.startsWith('Arrow')) {
        e.preventDefault()
        const dx = e.shiftKey ? 10 : 1
        const m = /translate\(([-\d.]+)px, ([-\d.]+)px\)/.exec(el.style.transform || '')
        const tx = m ? parseFloat(m[1]) : 0
        const ty = m ? parseFloat(m[2]) : 0
        let nx = tx,
          ny = ty
        if (e.key === 'ArrowLeft') nx -= dx
        else if (e.key === 'ArrowRight') nx += dx
        else if (e.key === 'ArrowUp') ny -= dx
        else if (e.key === 'ArrowDown') ny += dx
        el.style.transform = nx === 0 && ny === 0 ? '' : `translate(${nx}px, ${ny}px)`
        announce(`${p.selectedFid} nudge ${dx}px`)
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (el.parentElement && el.parentElement !== root) {
          const tag = el.tagName.toLowerCase()
          el.remove()
          announce(`Deleted ${tag}`)
          p.onSelect(null)
          setTimeout(() => p.onChangeHtml(root.innerHTML, `Delete ${tag}`), 0)
        } else {
          e.preventDefault()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [p.selectedFid, p.onChangeHtml, p.onSelect])

  // ── Grid toggle keyboard shortcut (Ctrl+G) ───────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
        e.preventDefault()
        setShowGrid((prev) => !prev)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // ── Device frame label ───────────────────────────────────────────────
  const deviceLabel = useMemo(() => {
    if (p.device === 'desktop') return 'Desktop'
    if (p.device === 'tablet') return 'Tablet'
    return 'Mobile'
  }, [p.device])

  // ── Cursor for viewport ──────────────────────────────────────────────
  const vpCursor = isPanning ? 'grabbing' : p.spaceHeld ? 'grab' : 'default'

  // ── Zoom transition ──────────────────────────────────────────────────
  const zoomTransition = reduceMotion
    ? 'none'
    : `transform ${ANIMATION.duration.fast} ${ANIMATION.easing.easeOut}`

  // ── Render ───────────────────────────────────────────────────────────
  return (
    <div
      ref={vpRef}
      onPointerDown={startPan}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      role="region"
      aria-label="Design canvas"
      className="ve-canvas-viewport"
      style={{
        position: 'relative',
        flex: 1,
        overflow: 'auto',
        background: canvasBg,
        cursor: vpCursor,
        ...(showGrid ? gridStyle : {}),
        // Subtle inner shadow for canvas depth
        boxShadow: 'inset 0 0 80px rgba(0,0,0,0.03)',
      }}
    >
      {/* Scrollable world surface */}
      <div
        style={{
          minWidth: '100%',
          minHeight: '100%',
          position: 'relative',
          padding: '64px 48px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Device frame label + grid toggle */}
        <div
          className="flex items-center justify-center gap-2 mb-3 select-none"
          style={{ zIndex: Z_INDEX.hover }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 500,
              fontFamily:
                'Inter, ui-sans-serif, system-ui, -apple-system, sans-serif',
              color: textTertiary,
              background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
              padding: '3px 10px',
              borderRadius: RADIUS.md,
              border: `1px solid ${borderColor}`,
              letterSpacing: '0.02em',
            }}
          >
            {deviceLabel} &middot; {width}px
          </span>

          {/* Grid toggle button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowGrid((prev) => !prev)
            }}
            title={showGrid ? 'Hide grid (Ctrl+G)' : 'Show grid (Ctrl+G)'}
            aria-label={showGrid ? 'Hide grid' : 'Show grid'}
            style={{
              fontSize: 10,
              fontWeight: 500,
              fontFamily:
                'Inter, ui-sans-serif, system-ui, -apple-system, sans-serif',
              color: showGrid ? selectionColor : textTertiary,
              background: showGrid
                ? isDark
                  ? 'rgba(96,165,250,0.12)'
                  : 'rgba(59,130,246,0.08)'
                : isDark
                  ? 'rgba(255,255,255,0.06)'
                  : 'rgba(0,0,0,0.04)',
              padding: '3px 8px',
              borderRadius: RADIUS.md,
              border: `1px solid ${showGrid ? selectionColor : borderColor}`,
              cursor: 'pointer',
              transition: reduceMotion ? 'none' : ANIMATION.transition.colors,
            }}
          >
            Grid
          </button>
        </div>

        {/* Device frame wrapper */}
        <div
          style={{
            position: 'relative',
            width: width + bezel * 2,
            borderRadius: DEVICE_FRAME_RADIUS[p.device],
            overflow: 'hidden',
            // Mobile/tablet device bezel border
            border:
              bezel > 0
                ? `${bezel}px solid ${isDark ? '#1E293B' : '#E5E7EB'}`
                : 'none',
            boxShadow: bezel > 0 ? SHADOWS['2xl'] : 'none',
            transition: reduceMotion ? 'none' : ANIMATION.transition.normal,
          }}
        >
          {/* Canvas artboard — the white "page" with shadow (Figma frame) */}
          <div
            className="ve-canvas"
            style={{
              width,
              minHeight: 900,
              background: artboardBg,
              borderRadius: bezel > 0 ? 0 : RADIUS.lg,
              boxShadow:
                bezel > 0
                  ? 'none'
                  : isDark
                    ? '0 2px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)'
                    : SHADOWS.xl,
              transform: `scale(${p.zoom / 100})`,
              transformOrigin: 'top center',
              transition: zoomTransition,
              overflow: 'hidden',
              position: 'relative',
              // Subtle border on the artboard edge
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : borderColor}`,
            }}
          >
            <style dangerouslySetInnerHTML={{ __html: fullCss }} />

            {p.hasContent ? (
              <div
                ref={contentRef}
                dangerouslySetInnerHTML={{ __html: p.html || '' }}
                style={{ minHeight: 900, padding: 0 }}
              />
            ) : null}
          </div>
        </div>
      </div>

      {/* Zoom display — sticky bottom-right */}
      <div
        className="select-none"
        style={{
          position: 'sticky',
          bottom: 12,
          right: 12,
          marginLeft: 'auto',
          marginTop: 'auto',
          width: 'fit-content',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '4px 10px',
          fontSize: 11,
          fontWeight: 500,
          fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, sans-serif',
          color: textTertiary,
          background: isDark ? 'rgba(30,41,59,0.85)' : 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(8px)',
          borderRadius: RADIUS.md,
          border: `1px solid ${borderColor}`,
          zIndex: Z_INDEX.tooltip,
          pointerEvents: 'none',
          letterSpacing: '0.01em',
        }}
      >
        {/* Magnifying glass icon */}
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          style={{ opacity: 0.5 }}
        >
          <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2" />
          <line x1="6" y1="1" x2="6" y2="3.5" stroke="currentColor" strokeWidth="1.2" />
          <line x1="6" y1="8.5" x2="6" y2="11" stroke="currentColor" strokeWidth="1.2" />
          <line x1="1" y1="6" x2="3.5" y2="6" stroke="currentColor" strokeWidth="1.2" />
          <line x1="8.5" y1="6" x2="11" y2="6" stroke="currentColor" strokeWidth="1.2" />
        </svg>
        {Math.round(p.zoom)}%
      </div>
    </div>
  )
}
