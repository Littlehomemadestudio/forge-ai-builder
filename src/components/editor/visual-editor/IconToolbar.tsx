'use client'

// ─── Left Icon Toolbar — Production-Grade Studio Sidebar ────────────────────
// Figma-inspired narrow icon rail with roving tabindex, keyboard shortcuts,
// group separators, accessible tooltips, and full dark mode support.

import * as React from 'react'
import { useId, useRef, useCallback, useState } from 'react'
import {
  MousePointer2,
  FileText,
  LayoutTemplate,
  Component,
  Image as ImageIcon,
  Sparkles,
  Layers,
  Palette,
  Settings2,
} from 'lucide-react'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { useAccessibility } from './AccessibilityContext'
import { LIGHT_COLORS, DARK_COLORS, ANIMATION, Z_INDEX } from './design-tokens'

// ═══════════════════════════════════════════════════════════════════════════
// 1. TOOL DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

export interface ToolDef {
  id: string
  label: string
  shortcut: string
  /** Which group this tool belongs to (for separators) */
  group: number
  icon: React.ElementType
}

/** Group 0: selection, Group 1: building, Group 2: ai, Group 3: system */
const DEFAULT_TOOLS: ToolDef[] = [
  // Group 0 — Selection
  { id: 'pointer',    label: 'Select',    shortcut: 'V',   group: 0, icon: MousePointer2 },
  // Group 1 — Building
  { id: 'pages',      label: 'Pages',     shortcut: '⇧1',  group: 1, icon: FileText },
  { id: 'sections',   label: 'Sections',  shortcut: '⇧2',  group: 1, icon: LayoutTemplate },
  { id: 'components', label: 'Components', shortcut: '⇧3', group: 1, icon: Component },
  { id: 'media',      label: 'Media',     shortcut: '⇧4',  group: 1, icon: ImageIcon },
  // Group 2 — AI
  { id: 'ai',         label: 'AI',        shortcut: '⇧A',  group: 2, icon: Sparkles },
  // Group 3 — System
  { id: 'layers',     label: 'Layers',    shortcut: '⇧L',  group: 3, icon: Layers },
  { id: 'brand',      label: 'Brand',     shortcut: '⇧B',  group: 3, icon: Palette },
  { id: 'settings',   label: 'Settings',  shortcut: '⇧S',  group: 3, icon: Settings2 },
]

/** IDs after which a separator line should be rendered */
const SEPARATOR_AFTER = new Set(['pointer', 'ai'])

// ═══════════════════════════════════════════════════════════════════════════
// 2. PROPS
// ═══════════════════════════════════════════════════════════════════════════

export interface IconToolbarProps {
  active: string
  onSelect: (id: string) => void
  darkMode?: boolean
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export function IconToolbar({
  active,
  onSelect,
  darkMode = false,
}: IconToolbarProps) {
  const uid = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const { reduceMotion } = useAccessibility()

  // ── Roving Tabindex ──────────────────────────────────────────────────────
  // Only the active (or last-focused) tool is tabbable; arrow keys move focus.
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number, total: number) => {
      let next: number | null = null

      switch (e.key) {
        case 'ArrowDown':
          next = (index + 1) % total
          break
        case 'ArrowUp':
          next = (index - 1 + total) % total
          break
        case 'Home':
          next = 0
          break
        case 'End':
          next = total - 1
          break
        default:
          return
      }

      e.preventDefault()
      setFocusedIndex(next)

      // Move actual DOM focus
      const buttons = containerRef.current?.querySelectorAll<HTMLButtonElement>(
        '[data-toolbar-item]'
      )
      if (buttons && next !== null) {
        buttons[next]?.focus()
      }
    },
    []
  )

  // ── Colors ───────────────────────────────────────────────────────────────
  const colors = darkMode ? DARK_COLORS : LIGHT_COLORS

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      role="toolbar"
      aria-label="Editor tools"
      aria-orientation="vertical"
      id={uid}
      className={cn(
        // Layout
        'flex flex-col items-center w-[48px] h-full',
        'py-1.5 gap-0',
        // Surface
        darkMode
          ? 'bg-[#111827]'
          : 'bg-[#FAFAFA]',
        // Border
        'border-r',
        darkMode
          ? 'border-r-[#334155]'
          : 'border-r-[#E5E7EB]',
        // Overflow
        'overflow-y-auto overflow-x-visible',
        // Scrollbar
        'scrollbar-thin scrollbar-w-1',
        darkMode ? 'scrollbar-track-transparent scrollbar-thumb-neutral-700' : 'scrollbar-track-transparent scrollbar-thumb-neutral-300',
      )}
    >
      {DEFAULT_TOOLS.map((tool, i) => {
        const isActive = tool.id === active
        const Icon = tool.icon
        const isTabbable = isActive || focusedIndex === i
        const showSeparator = SEPARATOR_AFTER.has(tool.id)

        return (
          <React.Fragment key={tool.id}>
            <Tooltip delayDuration={150}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  data-toolbar-item={tool.id}
                  aria-label={tool.label}
                  aria-pressed={isActive}
                  role="button"
                  tabIndex={isTabbable ? 0 : -1}
                  onClick={() => onSelect(tool.id)}
                  onKeyDown={(e) =>
                    handleKeyDown(e, i, DEFAULT_TOOLS.length)
                  }
                  onFocus={() => setFocusedIndex(i)}
                  className={cn(
                    // Base sizing: 48px × 40px
                    'w-[48px] h-[40px]',
                    // Layout
                    'relative flex items-center justify-center',
                    // Shape
                    'rounded-md',
                    // Remove native styling
                    'border-none outline-none cursor-pointer',
                    // Transition
                    reduceMotion
                      ? ''
                      : 'transition-colors duration-150 ease-[cubic-bezier(0.4,0,0.2,1)]',
                    // Focus-visible ring
                    'focus-visible:ring-2 focus-visible:ring-offset-1',
                    darkMode
                      ? 'focus-visible:ring-blue-400 focus-visible:ring-offset-[#111827]'
                      : 'focus-visible:ring-blue-500 focus-visible:ring-offset-[#FAFAFA]',
                    // Hover
                    !isActive && (
                      darkMode
                        ? 'hover:bg-[#1E293B] hover:text-[#F1F5F9]'
                        : 'hover:bg-[#F1F2F4] hover:text-[#111827]'
                    ),
                    // Active state
                    isActive && (
                      darkMode
                        ? 'bg-[#172554] text-[#60A5FA]'
                        : 'bg-[#EFF6FF] text-[#2563EB]'
                    ),
                    // Inactive icon color
                    !isActive && (
                      darkMode
                        ? 'text-[#94A3B8]'
                        : 'text-[#6B7280]'
                    ),
                  )}
                >
                  <Icon size={18} strokeWidth={1.75} />

                  {/* Active accent bar — 2px left edge indicator */}
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className={cn(
                        'absolute left-0 top-1/2 -translate-y-1/2',
                        'w-[2px] h-5',
                        'rounded-r-sm',
                        darkMode ? 'bg-[#60A5FA]' : 'bg-[#2563EB]',
                      )}
                    />
                  )}
                </button>
              </TooltipTrigger>

              <TooltipContent
                side="right"
                sideOffset={8}
                className={cn(
                  'flex items-center gap-2 px-2.5 py-1',
                  'rounded-md',
                  'text-xs font-medium',
                  darkMode
                    ? 'bg-[#1E293B] text-[#F1F5F9] border-[#334155]'
                    : 'bg-[#1F2937] text-white border-[#374151]',
                  'shadow-md',
                  'select-none',
                )}
                style={{ zIndex: Z_INDEX.tooltip }}
              >
                <span>{tool.label}</span>
                <kbd
                  className={cn(
                    'inline-flex items-center justify-center',
                    'min-w-[18px] h-[18px] px-1',
                    'rounded-[3px]',
                    'text-[10px] font-semibold leading-none',
                    darkMode
                      ? 'bg-[#334155] text-[#94A3B8]'
                      : 'bg-[#374151] text-[#9CA3AF]',
                  )}
                >
                  {tool.shortcut}
                </kbd>
              </TooltipContent>
            </Tooltip>

            {/* Group separator line */}
            {showSeparator && (
              <div
                aria-hidden="true"
                className={cn(
                  'w-6 h-px my-0.5',
                  darkMode ? 'bg-[#334155]' : 'bg-[#E5E7EB]',
                )}
              />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}
