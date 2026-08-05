// ─── Command Palette & Shortcuts Help ──────────────────────────────────────
// Fully keyboard accessible. Ctrl+Shift+P / Ctrl+K open the palette.

import * as React from 'react'
import { Search, Type, Layers, Image as ImageIcon, Wand2, Accessibility, Sparkles, X } from 'lucide-react'
import { COLORS, RADIUS, SPACING, SHADOWS, Z_INDEX } from './design-tokens'
import { Kbd } from './primitives'
import { SHORTCUTS, formatKeys } from './keyboard'

export interface Command {
  id: string
  label: string
  detail: string
  keys?: string[]
  icon?: React.ReactNode
}

export const COMMANDS: Command[] = [
  { id: 'command-palette', label: 'Open command palette', detail: 'Search all commands', icon: <Search size={16} />, keys: ['mod', 'shift', 'p'] },
  { id: 'undo', label: 'Undo', detail: 'Revert last change', icon: <Type size={16} />, keys: ['mod', 'z'] },
  { id: 'redo', label: 'Redo', detail: 'Reapply last change', icon: <Type size={16} />, keys: ['mod', 'shift', 'z'] },
  { id: 'duplicate', label: 'Duplicate selection', detail: 'Copy the selected element', icon: <Layers size={16} />, keys: ['mod', 'd'] },
  { id: 'delete', label: 'Delete selection', detail: 'Remove the selected element', icon: <X size={16} />, keys: ['delete'] },
  { id: 'add-section', label: 'Add section', detail: 'Insert a new accessible section', icon: <Layers size={16} /> },
  { id: 'add-text', label: 'Add text', detail: 'Insert a heading or paragraph', icon: <Type size={16} /> },
  { id: 'add-image', label: 'Add image', detail: 'Insert an image placeholder', icon: <ImageIcon size={16} /> },
  { id: 'ai-generate', label: 'AI: Generate section', detail: 'Let AI build a section', icon: <Wand2 size={16} /> },
  { id: 'ai-redesign', label: 'AI: Redesign page', detail: 'Modernize the whole page', icon: <Sparkles size={16} /> },
  { id: 'accessibility', label: 'Accessibility audit', detail: 'Scan for WCAG AA issues', icon: <Accessibility size={16} /> },
  { id: 'publish', label: 'Publish', detail: 'Deploy your site', icon: <Sparkles size={16} /> },
  { id: 'shortcuts', label: 'Keyboard shortcuts', detail: 'View all shortcuts', icon: <Type size={16} /> },
]
function ModalShell({ open, onClose, label, children }: {
  open: boolean
  onClose: () => void
  label: string
  children: React.ReactNode
}) {
  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.stopPropagation(); onClose() } }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [open, onClose])

  if (!open) return null
  return (
    <div role="presentation"
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: Z_INDEX.modal, background: 'rgba(17,24,39,0.3)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '18vh' }}>
      <div role="dialog" aria-modal="true" aria-label={label}
        onClick={(e) => e.stopPropagation()}
        style={{ background: COLORS.panel, borderRadius: RADIUS.xl, boxShadow: SHADOWS.xl, width: 'min(560px, 92vw)', maxHeight: '60vh', overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  )
}

export function CommandPalette({ open, onClose, onRun }: {
  open: boolean
  onClose: () => void
  onRun: (id: string) => void
}) {
  const [query, setQuery] = React.useState('')
  const [active, setActive] = React.useState(0)

  React.useEffect(() => { if (open) { setQuery(''); setActive(0) } }, [open])

  const q = query.trim().toLowerCase()
  const filtered = COMMANDS.filter((c) => !q || c.label.toLowerCase().includes(q) || c.detail.toLowerCase().includes(q))

  const run = (c: Command) => { onRun(c.id); onClose() }
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, filtered.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)) }
    else if (e.key === 'Enter' && filtered[active]) { e.preventDefault(); run(filtered[active]) }
  }

  return (
    <ModalShell open={open} onClose={onClose} label="Command palette">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: SPACING.lg, borderBottom: `1px solid ${COLORS.border}` }}>
        <Search size={18} style={{ color: COLORS.textSecondary }} aria-hidden="true" />
        <input
          autoFocus placeholder="Type a command…" value={query}
          onChange={(e) => { setQuery(e.target.value); setActive(0) }}
          onKeyDown={onKey}
          aria-label="Search commands"
          className="ve-icobtn"
          style={{ flex: 1, border: 'none', outline: 'none', fontSize: 16, color: COLORS.text, background: 'transparent' }}
        />
      </div>
      <div style={{ maxHeight: 'calc(60vh - 60px)', overflowY: 'auto', padding: 8 }} role="listbox" aria-label="Commands">
        {filtered.length === 0 && <p style={{ padding: SPACING.lg, color: COLORS.textSecondary, fontSize: 14 }}>No commands found.</p>}
        {filtered.map((c, i) => (
          <button
            key={c.id} type="button" role="option" aria-selected={i === active} onClick={() => run(c)}
            onMouseEnter={() => setActive(i)}
            className="ve-icobtn"
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left', padding: '10px 12px',
              borderRadius: RADIUS.lg, border: 'none', cursor: 'pointer', fontSize: 14,
              background: i === active ? COLORS.hover : 'transparent', color: COLORS.text,
            }}
          >
            <span style={{ color: COLORS.textSecondary }} aria-hidden="true">{c.icon}</span>
            <span style={{ fontWeight: 500 }}>{c.label}</span>
            <span style={{ marginLeft: 'auto', color: COLORS.textTertiary, fontSize: 12 }}>
              {c.keys ? <Kbd>{formatKeys(c.keys)}</Kbd> : c.detail}
            </span>
          </button>
        ))}
      </div>
    </ModalShell>
  )
}


export function ShortcutsHelp({ open, onClose }: { open: boolean; onClose: () => void }) {
  const groups = [...new Set(SHORTCUTS.map((s) => s.group))]
  return (
    <ModalShell open={open} onClose={onClose} label="Keyboard shortcuts">
      <div style={{ padding: SPACING.lg, borderBottom: `1px solid ${COLORS.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: COLORS.text }}>Keyboard shortcuts</h3>
        <button type="button" onClick={onClose} aria-label="Close" className="ve-icobtn"><X size={18} /></button>
      </div>
      <div style={{ maxHeight: 'calc(60vh - 60px)', overflowY: 'auto', padding: SPACING.md }}>
        {groups.map((g) => (
          <div key={g} style={{ marginBottom: SPACING.lg }}>
            <h4 style={{ margin: '0 0 8px', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5, color: COLORS.textSecondary }}>{g}</h4>
            {SHORTCUTS.filter((s) => s.group === g).map((s) => (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0' }}>
                <span style={{ fontSize: 14, color: COLORS.text }}>{s.label}</span>
                <Kbd>{formatKeys(s.keys)}</Kbd>
              </div>
            ))}
          </div>
        ))}
      </div>
    </ModalShell>
  )
}

