// ─── Left Icon Toolbar ─────────────────────────────────────────────────────
// Icon-only, 44px targets, hover/focus expands the label, fully keyboard
// navigable with a roving tabindex. Mirrors Canva/Framer left rail.

import * as React from 'react'
import { useId } from 'react'
import { Layers, FileCode, LayoutTemplate, LayoutGrid, Image as ImageIcon, Sparkles,
  Palette, ListTree, History, Globe, Settings2 } from 'lucide-react'
import { COLORS, RADIUS, SPACING, ANIMATION } from './design-tokens'
import { useAccessibility } from './AccessibilityContext'

export interface ToolDef {
  id: string
  label: string
  hint: string
  icon: React.ReactNode
}

const DEFAULT_TOOLS: ToolDef[] = [
  { id: 'pages', label: 'Pages', hint: 'Manage site pages', icon: <Layers size={20} /> },
  { id: 'templates', label: 'Templates', hint: 'Apply a template', icon: <FileCode size={20} /> },
  { id: 'sections', label: 'Sections', hint: 'Prebuilt sections', icon: <LayoutTemplate size={20} /> },
  { id: 'components', label: 'Components', hint: 'UI components', icon: <LayoutGrid size={20} /> },
  { id: 'media', label: 'Media', hint: 'Images & uploads', icon: <ImageIcon size={20} /> },
  { id: 'ai', label: 'AI', hint: 'Generate with AI', icon: <Sparkles size={20} /> },
  { id: 'assets', label: 'Assets', hint: 'Design assets', icon: <Palette size={20} /> },
  { id: 'layers', label: 'Layers', hint: 'Element layers', icon: <ListTree size={20} /> },
  { id: 'history', label: 'History', hint: 'Version history', icon: <History size={20} /> },
  { id: 'brand', label: 'Brand', hint: 'Brand kit', icon: <Globe size={20} /> },
  { id: 'settings', label: 'Settings', hint: 'Editor settings', icon: <Settings2 size={20} /> },
]

export interface IconToolbarProps {
  tools?: ToolDef[]
  active: string
  onSelect: (id: string) => void
}

export function IconToolbar({ tools = DEFAULT_TOOLS, active, onSelect }: IconToolbarProps) {
  const groupId = useId()
  const containerRef = React.useRef<HTMLDivElement>(null)
  const { reduceMotion } = useAccessibility()

  // Roving tabindex: keep only the focused item tabbable; arrows move focus.
  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== 'Home' && e.key !== 'End') return
    e.preventDefault()
    const buttons = Array.from(containerRef.current?.querySelectorAll<HTMLButtonElement>('[data-tool]') || [])
    if (!buttons.length) return
    let next = index
    if (e.key === 'ArrowDown') next = (index + 1) % buttons.length
    else if (e.key === 'ArrowUp') next = (index - 1 + buttons.length) % buttons.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = buttons.length - 1
    buttons[next].focus()
  }

  return (
    <nav role="navigation" aria-label="Editor tools" id={groupId}
      style={{
        width: 68, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: `${SPACING.md} ${SPACING.xs}`, gap: 4, background: COLORS.panel,
        borderRight: `1px solid ${COLORS.border}`, overflowY: 'auto', overflowX: 'visible',
      }}>
      {tools.map((tool, i) => {
        const isActive = tool.id === active
        // Unique per-row id for aria-describedby label.
        const rowId = `${groupId}-${tool.id}`
        return (
          <div key={tool.id} style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
            <button
              type="button" data-tool={tool.id} aria-label={tool.label} aria-describedby={rowId}
              aria-current={isActive ? 'page' : undefined}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onSelect(tool.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className="ve-icobtn"
              style={{
                width: 48, height: 48, borderRadius: RADIUS.lg, border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isActive ? COLORS.selectionLight : 'transparent',
                color: isActive ? COLORS.selection : COLORS.textSecondary,
                transition: reduceMotion ? 'none' : `background ${ANIMATION.duration.fast}, color ${ANIMATION.duration.fast}`,
              }}
              onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = COLORS.hover }}
              onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
            >
              {tool.icon}
              <span id={rowId} hidden>{tool.label}</span>
            </button>
            {/* Expand-on-hover / focus label */}
            <span aria-hidden="true"
              style={{
                position: 'absolute', left: 56, top: '50%', transform: 'translateY(-50%)',
                whiteSpace: 'nowrap', padding: '5px 10px', borderRadius: RADIUS.md,
                background: COLORS.text, color: COLORS.panel, fontSize: 12.5, fontWeight: 500,
                boxShadow: '0 4px 12px rgba(0,0,0,0.12)', opacity: 0, pointerEvents: 'none',
                transition: reduceMotion ? 'none' : `opacity 120ms ease`,
                zIndex: 999,
              }}
              onMouseEnter={() => {}}
            />
          </div>
        )
      })}

      {/* CSS-driven expand via group hover would be complex inline; use JS: */}
      <style>{`
        [id="${groupId}"] > div > button:hover ~ span[aria-hidden],
        [id="${groupId}"] > div > button:focus-visible ~ span[aria-hidden] { opacity: 1; }
      `}</style>
    </nav>
  )
}
