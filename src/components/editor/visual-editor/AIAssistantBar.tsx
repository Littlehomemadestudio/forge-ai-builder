'use client'

// ─── Bottom AI Assistant Bar ───────────────────────────────────────────────
// Persistent bottom bar for AI interaction. Professional studio design with:
// - AI badge + label on left
// - Auto-resizing textarea input center
// - Suggestion chips, Send/Stop buttons on right
// - Collapsible last-response area above bar
// - Streaming indicator when busy
// - Dark mode via Tailwind
// - Enter submits, Shift+Enter for newline

import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles, Send, Square, ChevronUp, ChevronDown } from 'lucide-react'

export interface AIAssistantBarProps {
  onSubmit: (prompt: string) => void
  isBusy: boolean
  onStop: () => void
  onRegenerate: () => void
  lastResponse: string
  suggestions: Array<{ id: string; label: string }>
}

// ─── Auto-resize textarea hook ─────────────────────────────────────────────
function useAutoResize(
  ref: React.RefObject<HTMLTextAreaElement | null>,
  value: string,
  maxHeight: number = 120,
) {
  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`
  }, [ref, value, maxHeight])
}

// ─── Component ─────────────────────────────────────────────────────────────
export function AIAssistantBar({
  onSubmit,
  isBusy,
  onStop,
  onRegenerate,
  lastResponse,
  suggestions,
}: AIAssistantBarProps) {
  const [value, setValue] = React.useState('')
  const [responseOpen, setResponseOpen] = React.useState(false)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const chipsRef = React.useRef<HTMLDivElement>(null)

  useAutoResize(textareaRef, value)

  // Focus textarea on mount
  React.useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  // Auto-open response panel when new response arrives
  React.useEffect(() => {
    if (lastResponse) setResponseOpen(true)
  }, [lastResponse])

  const send = React.useCallback(
    (text?: string) => {
      const t = (text ?? value).trim()
      if (!t || isBusy) return
      onSubmit(t)
      setValue('')
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    },
    [value, isBusy, onSubmit],
  )

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        send()
      }
    },
    [send],
  )

  const canSend = value.trim().length > 0 && !isBusy
  const visibleChips = suggestions.slice(0, 3)

  return (
    <div className="flex flex-col border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      {/* ── Collapsible last-response area ────────────────────────────── */}
      <AnimatePresence initial={false}>
        {lastResponse && (
          <motion.div
            key="response-panel"
            initial={false}
            animate={{ height: responseOpen ? 'auto' : 0, opacity: responseOpen ? 1 : 0 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="flex items-start gap-2 border-b border-gray-100 px-4 py-2.5 dark:border-gray-800">
              <Sparkles
                size={14}
                className="mt-0.5 shrink-0 text-blue-500 dark:text-blue-400"
                aria-hidden="true"
              />
              <p className="min-w-0 flex-1 text-xs leading-relaxed text-gray-600 dark:text-gray-300">
                {lastResponse}
              </p>
              <button
                type="button"
                onClick={() => setResponseOpen(false)}
                className="shrink-0 rounded p-0.5 text-gray-400 transition-colors hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                aria-label="Collapse response"
              >
                <ChevronDown size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Collapsed response toggle ──────────────────────────────────── */}
      {lastResponse && !responseOpen && (
        <button
          type="button"
          onClick={() => setResponseOpen(true)}
          className="flex items-center gap-1.5 border-b border-gray-100 px-4 py-1.5 text-xs text-gray-400 transition-colors hover:text-gray-600 dark:border-gray-800 dark:text-gray-500 dark:hover:text-gray-300"
        >
          <ChevronUp size={12} />
          <span className="truncate">Last response</span>
        </button>
      )}

      {/* ── Streaming / busy indicator ─────────────────────────────────── */}
      <AnimatePresence>
        {isBusy && (
          <motion.div
            key="busy-bar"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-2 border-b border-blue-100 bg-blue-50/50 px-4 py-2 dark:border-blue-900/40 dark:bg-blue-950/20">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
              </span>
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                AI is thinking…
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main bar (48px height) ─────────────────────────────────────── */}
      <div className="flex h-12 items-center gap-2.5 px-3 sm:gap-3 sm:px-4">
        {/* AI badge */}
        <div className="flex shrink-0 items-center gap-1.5 rounded-md bg-blue-50 px-2 py-1 dark:bg-blue-900/30">
          <Sparkles
            size={14}
            className="text-blue-600 dark:text-blue-400"
            aria-hidden="true"
          />
          <span className="hidden text-xs font-semibold text-blue-600 sm:inline dark:text-blue-400">
            AI Assistant
          </span>
          <span className="text-xs font-semibold text-blue-600 sm:hidden dark:text-blue-400">
            AI
          </span>
        </div>

        {/* Prompt textarea (auto-resize) */}
        <div className="relative flex min-w-0 flex-1 items-center">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask AI to build or improve something…"
            aria-label="AI prompt"
            rows={1}
            className={`
              min-h-[40px] max-h-[120px] w-full resize-none rounded-lg border
              border-gray-200 bg-gray-50 py-2.5 pl-3 pr-10
              text-sm text-gray-900 placeholder-gray-400
              transition-colors duration-150
              focus:border-blue-400 focus:bg-white focus:outline-none
              dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100
              dark:placeholder-gray-500 dark:focus:border-blue-500 dark:focus:bg-gray-800/80
            `}
          />
          {/* Inline send button */}
          <button
            type="button"
            onClick={() => send()}
            disabled={!canSend}
            aria-label="Send prompt"
            className={`
              absolute right-1.5 flex h-8 w-8 items-center justify-center rounded-md
              transition-all duration-150
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1
              dark:focus-visible:ring-blue-400
              ${
                canSend
                  ? 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 dark:bg-blue-500 dark:hover:bg-blue-600 dark:active:bg-blue-700'
                  : 'cursor-default bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
              }
            `}
          >
            <Send size={15} />
          </button>
        </div>

        {/* Suggestion chips — scrollable horizontally */}
        {visibleChips.length > 0 && (
          <div
            ref={chipsRef}
            className="hidden shrink-0 items-center gap-1.5 overflow-x-auto sm:flex"
            role="list"
            aria-label="AI suggestions"
          >
            {visibleChips.map((s) => (
              <button
                key={s.id}
                type="button"
                role="listitem"
                onClick={() => send(s.label)}
                aria-label={`AI suggestion: ${s.label}`}
                className="
                  shrink-0 rounded-full border border-gray-200 bg-white
                  px-2.5 py-1 text-xs font-medium text-gray-500
                  transition-all duration-150
                  hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600
                  active:bg-blue-100
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1
                  dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400
                  dark:hover:border-blue-500 dark:hover:bg-blue-900/30 dark:hover:text-blue-400
                  dark:active:bg-blue-900/50 dark:focus-visible:ring-blue-400
                "
              >
                {s.label}
              </button>
            ))}
          </div>
        )}

        {/* Stop button — shown only when busy */}
        <AnimatePresence>
          {isBusy && (
            <motion.button
              key="stop-btn"
              type="button"
              onClick={onStop}
              aria-label="Stop generating"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              className="
                flex h-9 min-w-[40px] shrink-0 items-center justify-center gap-1.5
                rounded-lg border border-red-200 bg-red-50 px-3
                text-xs font-medium text-red-600
                transition-colors duration-150
                hover:bg-red-100 hover:text-red-700 active:bg-red-200
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-1
                dark:border-red-800 dark:bg-red-900/20 dark:text-red-400
                dark:hover:bg-red-900/30 dark:hover:text-red-300
                dark:active:bg-red-900/40 dark:focus-visible:ring-red-400
              "
            >
              <Square size={12} fill="currentColor" />
              <span className="hidden sm:inline">Stop</span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Regenerate button — shown when not busy and last response exists */}
        <AnimatePresence>
          {!isBusy && lastResponse && (
            <motion.button
              key="regen-btn"
              type="button"
              onClick={onRegenerate}
              aria-label="Regenerate response"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              className="
                hidden sm:flex h-9 min-w-[40px] shrink-0 items-center justify-center gap-1.5
                rounded-lg border border-gray-200 bg-white px-3
                text-xs font-medium text-gray-600
                transition-colors duration-150
                hover:bg-gray-50 hover:text-gray-700 active:bg-gray-100
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1
                dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400
                dark:hover:bg-gray-700 dark:hover:text-gray-300
                dark:active:bg-gray-600 dark:focus-visible:ring-blue-400
              "
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 2v6h-6" />
                <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
                <path d="M3 22v-6h6" />
                <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
              </svg>
              <span>Retry</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
