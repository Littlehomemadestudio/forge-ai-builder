// ─── Bottom AI Assistant Bar ───────────────────────────────────────────────
// Always-visible AI entry point (not a separate page). Suggests context-aware
// actions, keyboard accessible, shows progress feedback.

import * as React from 'react'
import { Sparkles, Send, Loader2 } from 'lucide-react'
import { COLORS, RADIUS, SPACING } from './design-tokens'
import { ActionButton } from './primitives'

export interface AIAssistantBarProps {
  onSubmit: (prompt: string) => void
  isBusy: boolean
  suggestions: { id: string; label: string }[]
}

export function AIAssistantBar({ onSubmit, isBusy, suggestions }: AIAssistantBarProps) {
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
        minHeight: 64, display: 'flex', alignItems: 'center', gap: SPACING.md, padding: `0 ${SPACING.lg}`,
        background: COLORS.panel, borderTop: `1px solid ${COLORS.border}`, flexWrap: 'wrap',
      }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: COLORS.primary }}>
        <Sparkles size={18} aria-hidden="true" />
        <span style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>Ask AI</span>
      </div>

      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') send() }}
        placeholder="Describe what to build or improve… (e.g. add a pricing section)"
        aria-label="AI prompt"
        className="ve-icobtn"
        style={{ flex: 1, minWidth: 220, minHeight: 44, padding: '0 14px', border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.lg, fontSize: 14, color: COLORS.text, background: COLORS.background }}
      />

      {suggestions.slice(0, 3).map((s) => (
        <button key={s.id} type="button" onClick={() => send(s.label)} className="ve-icobtn" aria-label={`AI suggestion: ${s.label}`}
          style={{ minHeight: 32, padding: '0 12px', borderRadius: 999, border: `1px solid ${COLORS.border}`, background: COLORS.background, fontSize: 13, color: COLORS.textSecondary, cursor: 'pointer', whiteSpace: 'nowrap' }}>
          {s.label}
        </button>
      ))}

      <ActionButton variant="primary" icon={isBusy ? <Loader2 size={16} className="spinner" /> : <Send size={16} />}
        onClick={() => send()} disabled={isBusy}>
        {isBusy ? 'Thinking…' : 'Go'}
      </ActionButton>
    </footer>
  )
}
