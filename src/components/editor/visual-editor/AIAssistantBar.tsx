// ─── Bottom AI Assistant Bar ───────────────────────────────────────────────
// Always-visible AI entry point (not a separate page). Suggests context-aware
// actions, keyboard accessible, shows progress feedback, streaming, stop/regen.
// Enhanced with better visual design and modern styling.

import * as React from 'react'
import { Sparkles, Send, Loader2, Square, RotateCcw } from 'lucide-react'
import { COLORS, RADIUS, SPACING, SHADOWS } from './design-tokens'
import { ActionButton } from './primitives'

export interface AIAssistantBarProps {
  onSubmit: (prompt: string) => void
  isBusy: boolean
  suggestions: { id: string; label: string }[]
  onStop?: () => void
  onRegenerate?: () => void
  lastResponse?: string
}

export function AIAssistantBar({ onSubmit, isBusy, suggestions, onStop, onRegenerate, lastResponse }: AIAssistantBarProps) {
  const [value, setValue] = React.useState('')
  const inputRef = React.useRef<HTMLInputElement>(null)

  const send = (text?: string) => {
    const t = (text ?? value).trim()
    if (!t || isBusy) return
    onSubmit(t)
    setValue('')
  }

  return (
    <footer role="contentinfo" aria-label="AI assistant"
      style={{
        minHeight: 56,
        display: 'flex',
        alignItems: 'center',
        gap: SPACING.md,
        padding: `0 ${SPACING.lg}`,
        background: COLORS.panel,
        borderTop: `1px solid ${COLORS.border}`,
        flexWrap: 'wrap',
      }}>
      {/* AI badge */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 10px',
        borderRadius: RADIUS.lg,
        background: COLORS.primaryLight,
      }}>
        <Sparkles size={15} style={{ color: COLORS.primary }} aria-hidden="true" />
        <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.primary }}>AI</span>
      </div>

      {/* Prompt input */}
      <div style={{
        flex: 1,
        minWidth: 220,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        minHeight: 40,
        padding: '0 12px',
        border: `1px solid ${COLORS.border}`,
        borderRadius: RADIUS.lg,
        background: COLORS.background,
        transition: 'border-color 150ms ease',
      }}>
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') send() }}
          placeholder="Describe what to build or improve…"
          aria-label="AI prompt"
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontSize: 14,
            color: COLORS.text,
            minHeight: 40,
          }}
        />
        <button
          type="button"
          onClick={() => send()}
          disabled={isBusy || !value.trim()}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
            borderRadius: RADIUS.md,
            border: 'none',
            background: (isBusy || !value.trim()) ? COLORS.border : COLORS.primary,
            color: '#FFFFFF',
            cursor: (isBusy || !value.trim()) ? 'default' : 'pointer',
            transition: 'background 150ms ease',
          }}
        >
          {isBusy ? <Loader2 size={15} className="ve-spinner" /> : <Send size={15} />}
        </button>
      </div>

      {/* Suggestion chips */}
      {suggestions.slice(0, 3).map((s) => (
        <button key={s.id} type="button" onClick={() => send(s.label)} aria-label={`AI suggestion: ${s.label}`}
          style={{
            minHeight: 32,
            padding: '0 12px',
            borderRadius: 999,
            border: `1px solid ${COLORS.border}`,
            background: COLORS.panel,
            fontSize: 12,
            color: COLORS.textSecondary,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            fontWeight: 500,
            transition: 'all 120ms ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = COLORS.primary
            e.currentTarget.style.color = COLORS.primary
            e.currentTarget.style.background = COLORS.primaryLight
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = COLORS.border
            e.currentTarget.style.color = COLORS.textSecondary
            e.currentTarget.style.background = COLORS.panel
          }}
        >
          {s.label}
        </button>
      ))}

      {isBusy && onStop && (
        <ActionButton variant="primary" icon={<Square size={14} />} onClick={onStop}>
          Stop
        </ActionButton>
      )}

      {!isBusy && lastResponse && onRegenerate && (
        <ActionButton icon={<RotateCcw size={14} />} onClick={onRegenerate}>
          Retry
        </ActionButton>
      )}
    </footer>
  )
}
