// ─── Left Icon Toolbar ─────────────────────────────────────────────────────
// Icon-only, 44px targets, hover/focus expands the label, fully keyboard
// navigable with a roving tabindex. Enhanced with better active states.

import * as React from 'react'
import { useId } from 'react'
import { Layers, FileCode, LayoutTemplate, LayoutGrid, Image as ImageIcon, Sparkles,
  Palette, ListTree, History, Globe, Settings2 } from 'lucide-react'
import { COLORS, RADIUS, SPACING, ANIMATION, SHADOWS } from './design-tokens'
import { useAccessibility } from './AccessibilityContext'

export interface ToolDef {
  id: string
  label: string
  hint: string
  icon: React.ReactNode
}

const DEFAULT_TOOLS: ToolDef[] = [
  { id: 'pages', label: 'Pages', hint: 'Manage site pages', icon: <Layers size={18} /> },
  { id: 'sections', label: 'Sections', hint: 'Prebuilt sections', icon: <LayoutTemplate size={18} /> },
  { id: 'components', label: 'Components', hint: 'UI components', icon: <LayoutGrid size={18} /> },
  { id: 'media', label: 'Media', hint: 'Images & uploads', icon: <ImageIcon size={18} /> },
  { id: 'ai', label: 'AI', hint: 'Generate with AI', icon: <Sparkles size={18} /> },
  { id: 'assets', label: 'Assets', hint: 'Design assets', icon: <Palette size={18} /> },
  { id: 'layers', label: 'Layers', hint: 'Element layers', icon: <ListTree size={18} /> },
  { id: 'history', label: 'History', hint: 'Version history', icon: <History size={18} /> },
  { id: 'brand', label: 'Brand', hint: 'Brand kit', icon: <Globe size={18} /> },
  { id: 'settings', label: 'Settings', hint: 'Editor settings', icon: <Settings2 size={18} /> },
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
        width: 56,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${SPACING.sm} ${SPACING.xs}`,
        gap: 2,
        background: COLORS.panel,
        borderRight: `1px solid ${COLORS.border}`,
        overflowY: 'auto',
        overflowX: 'visible',
      }}>
      {tools.map((tool, i) => {
        const isActive = tool.id === active
        const rowId = `${groupId}-${tool.id}`
        return (
          <div key={tool.id} style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
            <button
              type="button" data-tool={tool.id} aria-label={tool.label} aria-describedby={rowId}
              aria-current={isActive ? 'page' : undefined}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onSelect(tool.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
              style={{
                width: 40,
                height: 40,
                borderRadius: RADIUS.lg,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: isActive ? COLORS.primaryLight : 'transparent',
                color: isActive ? COLORS.primary : COLORS.textSecondary,
                transition: reduceMotion ? 'none' : `background ${ANIMATION.duration.fast}, color ${ANIMATION.duration.fast}`,
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background = COLORS.hover
                  ;(e.currentTarget as HTMLElement).style.color = COLORS.text
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background = 'transparent'
                  ;(e.currentTarget as HTMLElement).style.color = COLORS.textSecondary
                }
              }}
            >
              {tool.icon}
              {/* Active indicator bar */}
              {isActive && (
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 3,
                  height: 20,
                  borderRadius: '0 3px 3px 0',
                  background: COLORS.primary,
                }} />
              )}
              <span id={rowId} hidden>{tool.label}</span>
            </button>
            {/* Expand-on-hover / focus label tooltip */}
            <span aria-hidden="true"
              style={{
                position: 'absolute', left: 50, top: '50%', transform: 'translateY(-50%)',
                whiteSpace: 'nowrap', padding: '4px 8px', borderRadius: RADIUS.md,
                background: COLORS.text, color: '#FFFFFF', fontSize: 12, fontWeight: 500,
                boxShadow: SHADOWS.md, opacity: 0, pointerEvents: 'none',
                transition: reduceMotion ? 'none' : `opacity 100ms ease`,
                zIndex: 999,
              }}
            />
          </div>
        )
      })}

      {/* CSS-driven tooltip visibility */}
      <style>{`
        [id="${groupId}"] > div > button:hover ~ span[aria-hidden],
        [id="${groupId}"] > div > button:focus-visible ~ span[aria-hidden] { opacity: 1; }
      `}</style>
    </nav>
  )
}
