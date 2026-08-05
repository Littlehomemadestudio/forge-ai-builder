'use client'

// ─────────────────────────────────────────────────────────────────────────────
// Command Palette & Shortcuts Help — Production-Grade Studio Overlays
// Full-screen backdrop, centered modal, categorized commands, arrow nav,
// scroll-into-view, focus trap, framer-motion entrance/exit, Tailwind CSS.
// ─────────────────────────────────────────────────────────────────────────────

import * as React from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Search,
  FilePlus,
  FolderOpen,
  Save,
  Undo2,
  Redo2,
  Trash2,
  Copy,
  ZoomIn,
  ZoomOut,
  Maximize,
  Grid3X3,
  Eye,
  Sparkles,
  Wand2,
  ShieldCheck,
  X,
  Type,
  Layers,
  Image as ImageIcon,
  Link,
  Code,
} from 'lucide-react'
import { Z_INDEX, ANIMATION } from './design-tokens'
import { Kbd } from './primitives'
import { SHORTCUTS, formatKeys } from './keyboard'
import { useAccessibility } from './AccessibilityContext'

// ═══════════════════════════════════════════════════════════════════════════
// 1. Command type & registry
// ═══════════════════════════════════════════════════════════════════════════

export interface Command {
  id: string
  label: string
  detail: string
  category: 'file' | 'edit' | 'view' | 'ai'
  keys?: string[]
  icon?: React.ReactNode
}

const CATEGORY_META: Record<Command['category'], { label: string; order: number }> = {
  file: { label: 'File', order: 0 },
  edit: { label: 'Edit', order: 1 },
  view: { label: 'View', order: 2 },
  ai:   { label: 'AI',   order: 3 },
}

export const COMMANDS: Command[] = [
  // ── File ─────────────────────────────────────────────────────────────
  { id: 'file-new',     label: 'New page',       detail: 'Create a blank page',     category: 'file', icon: <FilePlus size={16} />,    keys: ['mod', 'n'] },
  { id: 'file-open',   label: 'Open page',      detail: 'Open an existing page',   category: 'file', icon: <FolderOpen size={16} /> },
  { id: 'file-save',   label: 'Save',           detail: 'Save current page',       category: 'file', icon: <Save size={16} />,        keys: ['mod', 's'] },

  // ── Edit ─────────────────────────────────────────────────────────────
  { id: 'undo',         label: 'Undo',           detail: 'Revert last change',      category: 'edit', icon: <Undo2 size={16} />,       keys: ['mod', 'z'] },
  { id: 'redo',         label: 'Redo',           detail: 'Reapply last change',     category: 'edit', icon: <Redo2 size={16} />,       keys: ['mod', 'shift', 'z'] },
  { id: 'delete',       label: 'Delete',         detail: 'Remove selected element', category: 'edit', icon: <Trash2 size={16} />,      keys: ['delete'] },
  { id: 'duplicate',    label: 'Duplicate',      detail: 'Copy selected element',   category: 'edit', icon: <Copy size={16} />,        keys: ['mod', 'd'] },

  // ── View ─────────────────────────────────────────────────────────────
  { id: 'zoom-in',      label: 'Zoom in',        detail: 'Increase zoom level',     category: 'view', icon: <ZoomIn size={16} />,      keys: ['mod', 'plus'] },
  { id: 'zoom-out',     label: 'Zoom out',       detail: 'Decrease zoom level',     category: 'view', icon: <ZoomOut size={16} />,     keys: ['mod', 'minus'] },
  { id: 'fit',          label: 'Fit to screen',  detail: 'Fit page to viewport',    category: 'view', icon: <Maximize size={16} />,    keys: ['shift', '1'] },
  { id: 'toggle-grid',  label: 'Toggle grid',    detail: 'Show / hide canvas grid', category: 'view', icon: <Grid3X3 size={16} /> },
  { id: 'toggle-inspector', label: 'Toggle inspector', detail: 'Show / hide inspector panel', category: 'view', icon: <Eye size={16} /> },

  // ── AI ───────────────────────────────────────────────────────────────
  { id: 'ai-improve',   label: 'Improve',        detail: 'AI-enhance selected element', category: 'ai', icon: <Sparkles size={16} /> },
  { id: 'ai-generate',  label: 'Generate',       detail: 'AI build a section',          category: 'ai', icon: <Wand2 size={16} /> },
  { id: 'ai-audit',     label: 'Audit',          detail: 'AI accessibility audit',      category: 'ai', icon: <ShieldCheck size={16} /> },
]

// ═══════════════════════════════════════════════════════════════════════════
// 2. Focus trap hook
// ═══════════════════════════════════════════════════════════════════════════

function useFocusTrap(containerRef: React.RefObject<HTMLElement | null>, active: boolean) {
  useEffect(() => {
    if (!active || !containerRef.current) return

    const container = containerRef.current
    const getFocusable = () =>
      Array.from(
        container.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => !el.hasAttribute('aria-hidden'))

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const focusable = getFocusable()
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    container.addEventListener('keydown', onKeyDown)
    return () => container.removeEventListener('keydown', onKeyDown)
  }, [active, containerRef])
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. CommandPalette
// ═══════════════════════════════════════════════════════════════════════════

export interface CommandPaletteProps {
  open: boolean
  onClose: () => void
  onRun: (id: string) => void
}

const PALETTE_VARIANTS = {
  backdrop: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit:    { opacity: 0 },
  },
  dialog: {
    initial: { opacity: 0, scale: 0.95, y: -8 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit:    { opacity: 0, scale: 0.95, y: -8 },
  },
}

export function CommandPalette({ open, onClose, onRun }: CommandPaletteProps) {
  const { reduceMotion } = useAccessibility()
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useFocusTrap(dialogRef, open)

  // Reset on open
  useEffect(() => {
    if (open) {
      setQuery('')
      setActive(0)
      // Auto-focus search input
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [open])

  // Global Escape
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        e.preventDefault()
        onClose()
      }
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [open, onClose])

  // Filter commands
  const q = query.trim().toLowerCase()
  const filtered = React.useMemo(() => {
    const results = q
      ? COMMANDS.filter(
          (c) =>
            c.label.toLowerCase().includes(q) ||
            c.detail.toLowerCase().includes(q) ||
            c.category.toLowerCase().includes(q)
        )
      : COMMANDS

    // Group by category
    return results.sort((a, b) => {
      const ao = CATEGORY_META[a.category].order
      const bo = CATEGORY_META[b.category].order
      if (ao !== bo) return ao - bo
      return a.label.localeCompare(b.label)
    })
  }, [q])

  // Scroll active item into view
  useEffect(() => {
    if (!listRef.current) return
    const activeEl = listRef.current.querySelector(`[data-command-index="${active}"]`)
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth' })
    }
  }, [active, filtered, reduceMotion])

  const run = useCallback(
    (c: Command) => {
      onRun(c.id)
      onClose()
    },
    [onRun, onClose]
  )

  const onKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActive((a) => Math.min(a + 1, filtered.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActive((a) => Math.max(a - 1, 0))
      } else if (e.key === 'Enter' && filtered[active]) {
        e.preventDefault()
        run(filtered[active])
      }
    },
    [filtered, active, run]
  )

  // Determine category headers for the filtered list
  const groupedFiltered = React.useMemo(() => {
    const groups: { category: Command['category']; commands: Command[] }[] = []
    let currentCategory: Command['category'] | null = null

    for (const cmd of filtered) {
      if (cmd.category !== currentCategory) {
        currentCategory = cmd.category
        groups.push({ category: cmd.category, commands: [cmd] })
      } else {
        groups[groups.length - 1].commands.push(cmd)
      }
    }
    return groups
  }, [filtered])

  // Compute command's global index for active tracking
  let commandIndex = 0

  const motionDuration = reduceMotion ? 0 : 0.15

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Full-screen backdrop */}
          <motion.div
            key="cp-backdrop"
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            style={{ zIndex: Z_INDEX.modal }}
            onClick={onClose}
            variants={PALETTE_VARIANTS.backdrop}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: motionDuration }}
          />

          {/* Centered modal dialog */}
          <motion.div
            key="cp-dialog"
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className="fixed inset-0 flex items-start justify-center pt-[18vh]"
            style={{ zIndex: Z_INDEX.modal + 1, pointerEvents: 'none' }}
            variants={PALETTE_VARIANTS.dialog}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{
              duration: reduceMotion ? 0 : 0.2,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <div
              className="w-full max-w-lg pointer-events-auto
                         bg-white dark:bg-gray-900
                         rounded-xl border border-gray-200 dark:border-gray-700/60
                         shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700/60">
                <Search size={18} className="text-gray-400 dark:text-gray-500 shrink-0" aria-hidden="true" />
                <input
                  ref={inputRef}
                  autoFocus
                  placeholder="Type a command…"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value)
                    setActive(0)
                  }}
                  onKeyDown={onKey}
                  aria-label="Search commands"
                  className="flex-1 bg-transparent text-sm text-gray-900 dark:text-gray-100
                             placeholder:text-gray-400 dark:placeholder:text-gray-500
                             outline-none border-none"
                />
                <Kbd>Esc</Kbd>
              </div>

              {/* Command list */}
              <div
                ref={listRef}
                className="max-h-[340px] overflow-y-auto py-1"
                role="listbox"
                aria-label="Commands"
              >
                {filtered.length === 0 && (
                  <div className="px-4 py-8 text-center text-sm text-gray-400 dark:text-gray-500">
                    No commands found.
                  </div>
                )}

                {groupedFiltered.map((group) => {
                  const meta = CATEGORY_META[group.category]
                  return (
                    <div key={group.category}>
                      {/* Category header */}
                      <div className="px-4 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                        {meta.label}
                      </div>

                      {/* Commands in this category */}
                      {group.commands.map((c) => {
                        const idx = commandIndex++
                        const isActive = idx === active
                        return (
                          <button
                            key={c.id}
                            type="button"
                            role="option"
                            aria-selected={isActive}
                            data-command-index={idx}
                            onClick={() => run(c)}
                            onMouseEnter={() => setActive(idx)}
                            className={`
                              w-full flex items-center gap-3 px-4 py-2 text-left text-sm
                              transition-colors duration-75 outline-none
                              ${isActive
                                ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                              }
                            `}
                          >
                            {/* Icon */}
                            <span className="shrink-0 text-gray-400 dark:text-gray-500 w-4 h-4 flex items-center justify-center" aria-hidden="true">
                              {c.icon}
                            </span>

                            {/* Label */}
                            <span className="flex-1 font-medium truncate">{c.label}</span>

                            {/* Detail or shortcut */}
                            <span className="shrink-0 text-xs text-gray-400 dark:text-gray-500">
                              {c.keys ? (
                                <Kbd>{formatKeys(c.keys)}</Kbd>
                              ) : (
                                <span className="opacity-70">{c.detail}</span>
                              )}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  )
                })}
              </div>

              {/* Footer hint */}
              <div className="flex items-center gap-4 px-4 py-2 border-t border-gray-200 dark:border-gray-700/60 text-[11px] text-gray-400 dark:text-gray-500">
                <span className="flex items-center gap-1"><Kbd>↑↓</Kbd> Navigate</span>
                <span className="flex items-center gap-1"><Kbd>↵</Kbd> Run</span>
                <span className="flex items-center gap-1"><Kbd>Esc</Kbd> Close</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}


// ═══════════════════════════════════════════════════════════════════════════
// 4. ShortcutsHelp
// ═══════════════════════════════════════════════════════════════════════════

export interface ShortcutsHelpProps {
  open: boolean
  onClose: () => void
}

const SHORTCUT_GROUP_META: Record<string, { label: string; icon: React.ReactNode }> = {
  edit:      { label: 'Editing',    icon: <Type size={14} /> },
  canvas:    { label: 'Canvas',     icon: <Layers size={14} /> },
  selection: { label: 'Selection',  icon: <Copy size={14} /> },
  command:   { label: 'General',    icon: <Code size={14} /> },
  view:      { label: 'View',       icon: <Eye size={14} /> },
}

const HELP_VARIANTS = {
  backdrop: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit:    { opacity: 0 },
  },
  dialog: {
    initial: { opacity: 0, scale: 0.95, y: -8 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit:    { opacity: 0, scale: 0.95, y: -8 },
  },
}

export function ShortcutsHelp({ open, onClose }: ShortcutsHelpProps) {
  const { reduceMotion } = useAccessibility()
  const dialogRef = useRef<HTMLDivElement>(null)

  useFocusTrap(dialogRef, open)

  // Escape to close
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        e.preventDefault()
        onClose()
      }
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [open, onClose])

  // Focus the close button on open
  useEffect(() => {
    if (!open || !dialogRef.current) return
    requestAnimationFrame(() => {
      const closeBtn = dialogRef.current?.querySelector<HTMLButtonElement>('[data-shortcuts-close]')
      closeBtn?.focus()
    })
  }, [open])

  const groups = React.useMemo(
    () => [...new Set(SHORTCUTS.map((s) => s.group))],
    []
  )

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="sh-backdrop"
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            style={{ zIndex: Z_INDEX.modal }}
            onClick={onClose}
            variants={HELP_VARIANTS.backdrop}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: reduceMotion ? 0 : 0.15 }}
          />

          {/* Centered dialog */}
          <motion.div
            key="sh-dialog"
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Keyboard shortcuts"
            className="fixed inset-0 flex items-center justify-center p-4"
            style={{ zIndex: Z_INDEX.modal + 1, pointerEvents: 'none' }}
            variants={HELP_VARIANTS.dialog}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{
              duration: reduceMotion ? 0 : 0.2,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <div
              className="w-full max-w-md pointer-events-auto
                         bg-white dark:bg-gray-900
                         rounded-xl border border-gray-200 dark:border-gray-700/60
                         shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700/60">
                <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  Keyboard shortcuts
                </h2>
                <button
                  type="button"
                  data-shortcuts-close
                  onClick={onClose}
                  aria-label="Close shortcuts"
                  className="p-1 rounded-md text-gray-400 hover:text-gray-600
                             dark:text-gray-500 dark:hover:text-gray-300
                             hover:bg-gray-100 dark:hover:bg-gray-800
                             transition-colors duration-75 outline-none
                             focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Shortcut groups */}
              <div className="max-h-[60vh] overflow-y-auto p-5 space-y-5">
                {groups.map((g) => {
                  const meta = SHORTCUT_GROUP_META[g] || { label: g, icon: null }
                  const shortcuts = SHORTCUTS.filter((s) => s.group === g)
                  return (
                    <section key={g}>
                      {/* Group header */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-gray-400 dark:text-gray-500 w-4 h-4 flex items-center justify-center" aria-hidden="true">
                          {meta.icon}
                        </span>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          {meta.label}
                        </h3>
                      </div>

                      {/* Shortcut rows */}
                      <div className="space-y-1">
                        {shortcuts.map((s) => (
                          <div
                            key={s.id}
                            className="flex items-center justify-between py-1.5 px-1"
                          >
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {s.label}
                            </span>
                            <div className="flex items-center gap-1">
                              {formatKeys(s.keys)
                                .split(/(\s*\+\s*|\s+)/)
                                .filter(Boolean)
                                .map((part, i) => (
                                  <Kbd key={i}>{part.trim()}</Kbd>
                                ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )
                })}
              </div>

              {/* Footer */}
              <div className="px-5 py-3 border-t border-gray-200 dark:border-gray-700/60 text-[11px] text-gray-400 dark:text-gray-500 text-center">
                Press <Kbd>Esc</Kbd> to close
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
