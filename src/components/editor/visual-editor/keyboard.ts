// ─── Keyboard Shortcut Registry & Hook ─────────────────────────────────────
// Single source of truth for editor shortcuts, powering both the live handler
// and the discoverable "Shortcuts" help overlay and Command Palette.

export interface Shortcut {
  id: string
  label: string
  group: 'edit' | 'canvas' | 'selection' | 'command' | 'view'
  keys: string[] // e.g. ['mod', 'd']  -> "⌘D" / "Ctrl+D"
  description: string
}

/** Detect macOS via userAgent (navigator.platform is deprecated). */
function isMacOS(): boolean {
  if (typeof navigator === 'undefined') return false
  return /Mac|iPhone|iPad/.test(navigator.userAgent)
}

// `mod` = Cmd on macOS, Ctrl elsewhere.
export const SHORTCUTS: Shortcut[] = [
  { id: 'undo', label: 'Undo', group: 'edit', keys: ['mod', 'z'], description: 'Undo last change' },
  { id: 'redo', label: 'Redo', group: 'edit', keys: ['mod', 'shift', 'z'], description: 'Redo last change' },
  { id: 'duplicate', label: 'Duplicate', group: 'edit', keys: ['mod', 'd'], description: 'Duplicate selected element' },
  { id: 'group', label: 'Group', group: 'edit', keys: ['mod', 'g'], description: 'Group selected elements' },
  { id: 'ungroup', label: 'Ungroup', group: 'edit', keys: ['mod', 'shift', 'g'], description: 'Ungroup selection' },
  { id: 'command-palette', label: 'Command Palette', group: 'command', keys: ['mod', 'shift', 'p'], description: 'Search all commands' },
  { id: 'quick-command', label: 'Quick Command', group: 'command', keys: ['mod', 'k'], description: 'Open command palette' },
  { id: 'pan', label: 'Pan canvas', group: 'canvas', keys: ['space'], description: 'Hold to pan the canvas' },
  { id: 'zoom-in', label: 'Zoom in', group: 'view', keys: ['mod', 'plus'], description: 'Zoom into canvas' },
  { id: 'zoom-out', label: 'Zoom out', group: 'view', keys: ['mod', 'minus'], description: 'Zoom out of canvas' },
  { id: 'fit', label: 'Fit to screen', group: 'view', keys: ['shift', '1'], description: 'Fit page to viewport' },
  { id: 'grid-toggle', label: 'Toggle grid', group: 'view', keys: ['mod', 'g'], description: 'Show or hide the canvas grid' },
  { id: 'duplicate-drag', label: 'Duplicate while dragging', group: 'selection', keys: ['alt'], description: 'Hold Alt to duplicate while dragging' },
  { id: 'nudge', label: 'Nudge', group: 'selection', keys: ['arrow'], description: 'Arrow keys to move in small steps' },
  { id: 'nudge-fast', label: 'Nudge (large)', group: 'selection', keys: ['shift', 'arrow'], description: 'Shift + arrows to move in large steps' },
  { id: 'constrained', label: 'Constrain movement', group: 'selection', keys: ['shift'], description: 'Hold Shift to constrain to axis' },
  { id: 'delete', label: 'Delete', group: 'selection', keys: ['delete'], description: 'Delete selected element' },
]

/** Convert a logical key token to a readable, cross-platform label. */
export function formatKeys(keys: string[]): string {
  const isMac = isMacOS()
  return keys
    .map((k) => {
      if (k === 'mod') return isMac ? '⌘' : 'Ctrl'
      if (k === 'shift') return isMac ? '⇧' : 'Shift'
      if (k === 'alt') return isMac ? '⌥' : 'Alt'
      if (k === 'space') return 'Space'
      if (k === 'arrow') return 'Arrows'
      if (k === 'plus') return '+'
      if (k === 'minus') return '−'
      if (k === 'delete') return 'Del'
      return k.length === 1 ? k.toUpperCase() : k.charAt(0).toUpperCase() + k.slice(1)
    })
    .join(isMac ? '' : ' + ')
}

/** Normalize a KeyboardEvent against the registry (returns matched shortcut id or null). */
export function matchShortcut(e: KeyboardEvent, allowed: Record<string, boolean> = {}): string | null {
  const mod = e.metaKey || e.ctrlKey
  const key = e.key.toLowerCase()

  if ((allowed['command'] === false) && mod && (key === 'p' || key === 'k')) return null

  // Pan (space alone)
  if (key === ' ' && !mod && !e.shiftKey && !e.altKey) return 'pan'

  // Undo / Redo
  if (mod && key === 'z') return e.shiftKey ? 'redo' : 'undo'
  // Duplicate
  if (mod && !e.shiftKey && key === 'd') return 'duplicate'
  // Group / ungroup (note: Ctrl+G also matches grid-toggle; group takes priority)
  if (mod && e.shiftKey && key === 'g') return 'ungroup'
  if (mod && !e.shiftKey && key === 'g') return 'group'
  // Command palette
  if (mod && e.shiftKey && key === 'p') return 'command-palette'
  if (mod && key === 'k') return 'quick-command'
  // Zoom
  if (mod && (key === '+' || key === '=')) return 'zoom-in'
  if (mod && key === '-') return 'zoom-out'
  // Fit to screen (Shift+1)
  if (!mod && e.shiftKey && key === '1') return 'fit'
  // Grid toggle (Ctrl+Shift+G is ungroup; plain Ctrl+G is group — grid-toggle is an alias
  // that consumers can map to a different key if desired)
  // Delete
  if (key === 'delete' || key === 'backspace') return 'delete'

  return null
}
