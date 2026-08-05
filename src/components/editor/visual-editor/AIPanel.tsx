'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { COLORS, RADIUS, ACCESSIBILITY, ANIMATION, SPACING } from './design-tokens'
import { useAccessibility } from './AccessibilityContext'
import { Sparkles, Wand2, MessageSquare, X } from 'lucide-react'
import { EditorButton } from './VisualEditorLayout'

export interface AISuggestion {
  id: string
  type: 'rewrite' | 'improve' | 'fix' | 'generate' | 'accessibility'
  title: string
  description: string
  icon?: React.ReactNode
  action: () => void
}

interface AIPanelProps {
  isOpen: boolean
  onClose: () => void
  suggestions?: AISuggestion[]
  onQuerySubmit?: (query: string) => void
  contextElementId?: string | null
}

export function AIPanel({
  isOpen,
  onClose,
  suggestions = [],
  onQuerySubmit,
  contextElementId,
}: AIPanelProps) {
  const { reduceMotion } = useAccessibility()
  const [query, setQuery] = React.useState('')
  const [isProcessing, setIsProcessing] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim() || isProcessing) return
    
    setIsProcessing(true)
    try {
      await onQuerySubmit?.(query)
      setQuery('')
    } finally {
      setIsProcessing(false)
    }
  }

  const getContextualSuggestions = (): AISuggestion[] => {
    if (contextElementId) {
      return [
        {
          id: 'improve',
          type: 'improve',
          title: '✨ Improve This Section',
          description: 'Make this design more modern and engaging',
          action: () => {},
        },
        {
          id: 'accessibility',
          type: 'accessibility',
          title: '♿ Fix Accessibility',
          description: 'Check and fix accessibility issues',
          action: () => {},
        },
        {
          id: 'rewrite',
          type: 'rewrite',
          title: '✏️ Rewrite Content',
          description: 'Generate better copy for this element',
          action: () => {},
        },
      ]
    }
    
    return suggestions.length > 0 ? suggestions : [
      {
        id: 'generate',
        type: 'generate',
        title: '🎨 Generate Section',
        description: 'Create a new section with AI',
        action: () => {},
      },
      {
        id: 'redesign',
        type: 'improve',
        title: '🔄 Redesign Page',
        description: 'Get AI suggestions for the entire page',
        action: () => {},
      },
      {
        id: 'audit',
        type: 'accessibility',
        title: '♿ Accessibility Audit',
        description: 'Scan and fix accessibility issues',
        action: () => {},
      },
    ]
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: reduceMotion ? 0 : 0.2 }}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '344px',
          width: '360px',
          backgroundColor: COLORS.panel,
          borderRadius: RADIUS.xl,
          boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
          border: `1px solid ${COLORS.border}`,
          zIndex: 400,
          overflow: 'hidden',
        }}
        role="dialog"
        aria-label="AI Assistant"
        aria-modal="true"
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: `${SPACING.lg} ${SPACING.lg}`,
            borderBottom: `1px solid ${COLORS.border}`,
            backgroundColor: COLORS.primaryLight,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles 
              size={20} 
              style={{ color: COLORS.primary }} 
              aria-hidden="true"
            />
            <h2
              style={{
                fontSize: '15px',
                fontWeight: 600,
                color: COLORS.text,
              }}
            >
              AI Assistant
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: RADIUS.md,
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              color: COLORS.textSecondary,
            }}
            aria-label="Close AI Assistant"
          >
            <X size={18} />
          </button>
        </div>

        {/* Context indicator */}
        {contextElementId && (
          <div
            style={{
              padding: `${SPACING.sm} ${SPACING.lg}`,
              backgroundColor: COLORS.successLight,
              borderBottom: `1px solid ${COLORS.border}`,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: COLORS.success,
              }}
              aria-hidden="true"
            />
            <span
              style={{
                fontSize: '13px',
                color: COLORS.textSecondary,
              }}
            >
              Editing selected element
            </span>
          </div>
        )}

        {/* Suggestions */}
        <div
          style={{
            padding: SPACING.lg,
            display: 'flex',
            flexDirection: 'column',
            gap: SPACING.md,
            maxHeight: '300px',
            overflowY: 'auto',
          }}
        >
          <h3
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: COLORS.textSecondary,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Quick Actions
          </h3>
          
          {getContextualSuggestions().map((suggestion) => (
            <motion.button
              key={suggestion.id}
              onClick={suggestion.action}
              whileHover={!reduceMotion ? { scale: 1.02 } : undefined}
              whileTap={!reduceMotion ? { scale: 0.98 } : undefined}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: SPACING.md,
                padding: SPACING.md,
                backgroundColor: COLORS.background,
                borderRadius: RADIUS.lg,
                border: `1px solid ${COLORS.border}`,
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                minHeight: ACCESSIBILITY.minTouchTarget,
                transition: reduceMotion ? 'none' : `all ${ANIMATION.duration.fast} ${ANIMATION.easing.ease}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = COLORS.primary
                e.currentTarget.style.backgroundColor = COLORS.primaryLight
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = COLORS.border
                e.currentTarget.style.backgroundColor = COLORS.background
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  borderRadius: RADIUS.md,
                  backgroundColor: COLORS.primaryLight,
                  color: COLORS.primary,
                  flexShrink: 0,
                }}
                aria-hidden="true"
              >
                {suggestion.icon || <Sparkles size={18} />}
              </div>
              <div>
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: COLORS.text,
                    marginBottom: '4px',
                  }}
                >
                  {suggestion.title}
                </div>
                <div
                  style={{
                    fontSize: '13px',
                    color: COLORS.textSecondary,
                    lineHeight: 1.4,
                  }}
                >
                  {suggestion.description}
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Query input */}
        <form
          onSubmit={handleSubmit}
          style={{
            padding: SPACING.lg,
            borderTop: `1px solid ${COLORS.border}`,
            display: 'flex',
            gap: SPACING.sm,
          }}
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask AI anything..."
            disabled={isProcessing}
            style={{
              flex: 1,
              padding: `${SPACING.md} ${SPACING.lg}`,
              borderRadius: RADIUS.full,
              border: `1px solid ${COLORS.border}`,
              backgroundColor: COLORS.background,
              fontSize: '15px',
              color: COLORS.text,
              outline: 'none',
              transition: reduceMotion ? 'none' : `border-color ${ANIMATION.duration.fast} ${ANIMATION.easing.ease}`,
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = COLORS.primary
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = COLORS.border
            }}
            aria-label="Ask AI a question"
          />
          <EditorButton
            type="submit"
            variant="primary"
            size="md"
            disabled={isProcessing || !query.trim()}
            icon={<Wand2 size={18} />}
          >
            {isProcessing ? 'Processing...' : 'Send'}
          </EditorButton>
        </form>
      </motion.div>
    </AnimatePresence>
  )
}

// Floating AI button for quick access
export function AIFloatingButton({ onClick }: { onClick: () => void }) {
  const { reduceMotion } = useAccessibility()

  return (
    <motion.button
      onClick={onClick}
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: `${SPACING.md} ${SPACING.lg}`,
        backgroundColor: COLORS.primary,
        color: '#FFFFFF',
        borderRadius: RADIUS.full,
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 4px 20px rgba(37, 99, 235, 0.4)',
        minHeight: ACCESSIBILITY.minTouchTarget,
        zIndex: 300,
      }}
      whileHover={!reduceMotion ? { scale: 1.05 } : undefined}
      whileTap={!reduceMotion ? { scale: 0.95 } : undefined}
      aria-label="Open AI Assistant"
    >
      <Sparkles size={20} />
      <span style={{ fontSize: '15px', fontWeight: 600 }}>AI</span>
    </motion.button>
  )
}
