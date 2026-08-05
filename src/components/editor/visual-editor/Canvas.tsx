// ─── Canvas ────────────────────────────────────────────────────────────────
// Renders the edited page (HTML + CSS) inside a pannable, zoomable viewport.
// Supports: device-preview widths, click-to-select with audible announcement,
// arrow-key nudge, duplicate/delete, and drag-to-pan (Space or middle mouse).

import * as React from 'react'
import { useEffect, useRef, useState, useCallback } from 'react'
import { COLORS, RADIUS, SHADOWS } from './design-tokens'
import { announce } from './primitives'
import { useAccessibility } from './AccessibilityContext'

export interface SelectionInfo {
  fid: string          // stable path id like "0-1-2"
  tag: string          // element tag: 'h1' | 'img' | ...
  text: string         // textContent (trimmed)
  isImage: boolean
  isText: boolean
  isButton: boolean
  isSection: boolean
  color?: string       // text color (computed)
  bgColor?: string     // background color (computed)
  fontSize?: string
  fontWeight?: string
  rect: { left: number; top: number; width: number; height: number }
}

export const DEVICE_WIDTH: Record<'desktop' | 'tablet' | 'mobile', number> = {
  desktop: 1280, tablet: 768, mobile: 390,
}
export const SELECTABLE = 'h1,h2,h3,h4,h5,h6,p,img,button,a,section,header,footer,nav,div,ul,li,form,span'

/** Build a stable path id from an element by counting siblings from root. */
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
  onRenderNode?: (rect: DOMRect, fid: string) => void
  onContentReady?: (el: HTMLElement | null) => void
}

function findByFid(root: HTMLElement, fid: string): HTMLElement | null {
  const parts = fid.split('-').map(Number)
  let el: Element = root
  for (const idx of parts) {
    const children = Array.from(el.children).filter((c) => c.nodeType === 1)
    if (idx >= children.length) return null
    el = children[idx]
  }
  return el as HTMLElement
}

// Editor-specific CSS injected into the canvas for selection highlights & hover outlines
const EDITOR_CSS = `
.ve-selected {
  outline: 2px solid #3B82F6 !important;
  outline-offset: 2px !important;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25) !important;
  position: relative;
}
.ve-selected::before {
  content: '';
  position: absolute;
  inset: -5px;
  border: 1px dashed rgba(59, 130, 246, 0.4);
  border-radius: 2px;
  pointer-events: none;
}
.ve-hover-target {
  cursor: pointer;
}
.ve-hover-target:hover {
  outline: 1px dashed rgba(59, 130, 246, 0.5) !important;
  outline-offset: 1px !important;
}
/* Resize handle indicators at corners */
.ve-selected::after {
  content: '';
  position: absolute;
  top: -5px; left: -5px; right: -5px; bottom: -5px;
  pointer-events: none;
  background:
    radial-gradient(circle 4px at 0% 0%, #3B82F6 50%, transparent 50%),
    radial-gradient(circle 4px at 100% 0%, #3B82F6 50%, transparent 50%),
    radial-gradient(circle 4px at 0% 100%, #3B82F6 50%, transparent 50%),
    radial-gradient(circle 4px at 100% 100%, #3B82F6 50%, transparent 50%);
}
`

export function Canvas(p: CanvasProps) {
  const vpRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [worldSize] = useState({ w: 1600, h: 2000 })
  const { reduceMotion } = useAccessibility()
  const panning = useRef(false)
  const lastPoint = useRef({ x: 0, y: 0 })
  const selToken = useRef<string | null>(null)

  const width = DEVICE_WIDTH[p.device]

  // Keep the selection highlight in sync with the selected fid (imperatively,
  // so it survives React re-renders of the authored HTML).
  useEffect(() => {
    const root = contentRef.current
    if (!root) return
    if (selToken.current) {
      const prev = root.querySelector(`[data-ve-sel="${selToken.current}"]`)
      if (prev) prev.classList.remove('ve-selected')
      selToken.current = null
    }
    if (!p.selectedFid) return
    const el = findByFid(root, p.selectedFid)
    if (el) {
      el.classList.add('ve-selected')
      el.setAttribute('data-ve-sel', p.selectedFid)
      selToken.current = p.selectedFid
      p.onRenderNode?.(el.getBoundingClientRect(), p.selectedFid)
      // Scroll to element
      const vp = vpRef.current
      if (vp) {
        const elRect = el.getBoundingClientRect()
        const vpRect = vp.getBoundingClientRect()
        if (elRect.top < vpRect.top || elRect.bottom > vpRect.bottom ||
            elRect.left < vpRect.left || elRect.right > vpRect.right) {
          el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest', inline: 'nearest' })
        }
      }
    }
  }, [p.selectedFid, p.html, p.onRenderNode, reduceMotion])

  // Expose the content root for imperative mutation (inspector/delete/AI).
  useEffect(() => {
    p.onContentReady?.(contentRef.current)
  }, [p.onContentReady])

  // Add hover outlines to selectable elements
  useEffect(() => {
    const root = contentRef.current
    if (!root) return
    const elements = root.querySelectorAll(SELECTABLE)
    elements.forEach((el) => {
      (el as HTMLElement).classList.add('ve-hover-target')
    })
    return () => {
      elements.forEach((el) => {
        (el as HTMLElement).classList.remove('ve-hover-target')
      })
    }
  }, [p.html])

  const readInfo = useCallback((el: HTMLElement, root: HTMLElement): SelectionInfo | null => {
    const fid = buildFid(el, root)
    const tag = el.tagName.toLowerCase()
    const cs = window.getComputedStyle(el)
    const rect = el.getBoundingClientRect()
    const isSection = ['section', 'header', 'footer', 'nav', 'ul', 'li', 'form', 'div'].includes(tag)
    return {
      fid, tag,
      text: (el.textContent || '').trim().slice(0, 120),
      isImage: tag === 'img',
      isText: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a', 'span', 'li'].includes(tag),
      isButton: tag === 'button',
      isSection,
      color: cs.color,
      bgColor: cs.backgroundColor && cs.backgroundColor !== 'rgba(0, 0, 0, 0)' ? cs.backgroundColor : undefined,
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
      rect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height },
    }
  }, [])

  const handleClick = (e: React.MouseEvent) => {
    if (panning.current) return
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

  // Drag-to-pan over the empty viewport (Space held or middle mouse).
  const startPan = (e: React.PointerEvent) => {
    if (e.button !== 1 && !p.spaceHeld) return
    e.preventDefault()
    panning.current = true
    lastPoint.current = { x: e.clientX, y: e.clientY }
    const vp = vpRef.current
    const move = (ev: PointerEvent) => {
      if (!vp) return
      vp.scrollLeft -= (ev.clientX - lastPoint.current.x)
      vp.scrollTop -= (ev.clientY - lastPoint.current.y)
      lastPoint.current = { x: ev.clientX, y: ev.clientY }
    }
    const up = () => {
      panning.current = false
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  // Keyboard: nudge + delete on the selected element.
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
        let nx = tx, ny = ty
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

  // Merge editor CSS with user CSS
  const fullCss = EDITOR_CSS + (p.css || '')

  return (
    <div
      ref={vpRef}
      onPointerDown={startPan}
      onClick={handleClick}
      role="region" aria-label="Design canvas"
      className="ve-canvas-viewport"
      style={{
        position: 'relative', flex: 1, overflow: 'auto', background: COLORS.background,
        cursor: p.spaceHeld ? 'grab' : 'default',
      }}
    >
      <div style={{ width: worldSize.w, height: Math.max(worldSize.h, 1400), position: 'relative', padding: 48 }}>
        <div
          className="ve-canvas"
          style={{
            width, minHeight: 900, background: '#FFFFFF', borderRadius: RADIUS.lg,
            boxShadow: SHADOWS.xl, margin: '0 auto', transform: `scale(${p.zoom / 100})`,
            transformOrigin: 'top center', transition: reduceMotion ? 'none' : 'transform 160ms ease',
            overflow: 'hidden',
          }}
        >
          <style dangerouslySetInnerHTML={{ __html: fullCss }} />
          {p.hasContent ? (
            <div ref={contentRef} dangerouslySetInnerHTML={{ __html: p.html || '' }} style={{ minHeight: 900, padding: 0 }} />
          ) : null}
        </div>
      </div>
    </div>
  )
}
