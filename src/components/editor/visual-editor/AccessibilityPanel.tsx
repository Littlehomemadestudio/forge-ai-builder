'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { COLORS, RADIUS, ACCESSIBILITY, ANIMATION, SPACING } from './design-tokens'
import { useAccessibility } from './AccessibilityContext'
import { 
  Accessibility, AlertTriangle, CheckCircle2, X, Sparkles, ChevronRight,
  Eye, Type, Image, Link, Contrast, Focus
} from 'lucide-react'
import { EditorButton } from './VisualEditorLayout'

export interface AccessibilityIssue {
  id: string
  type: 'critical' | 'warning' | 'info'
  category: 'contrast' | 'alt-text' | 'heading' | 'focus' | 'keyboard' | 'aria'
  title: string
  description: string
  elementId?: string
  fixAction?: () => Promise<void>
}

interface AccessibilityPanelProps {
  isOpen: boolean
  onClose: () => void
  issues: AccessibilityIssue[]
  onFixAll?: () => Promise<void>
  isScanning?: boolean
}

export function AccessibilityPanel({
  isOpen,
  onClose,
  issues,
  onFixAll,
  isScanning = false,
}: AccessibilityPanelProps) {
  const { reduceMotion } = useAccessibility()

  const getIssueIcon = (category: AccessibilityIssue['category']) => {
    switch (category) {
      case 'contrast': return <Contrast size={18} />
      case 'alt-text': return <Image size={18} />
      case 'heading': return <Type size={18} />
      case 'focus': return <Focus size={18} />
      case 'keyboard': return <Accessibility size={18} />
      case 'aria': return <Accessibility size={18} />
      default: return <AlertTriangle size={18} />
    }
  }

  const getIssueColor = (type: AccessibilityIssue['type']) => {
    switch (type) {
      case 'critical': return { bg: COLORS.dangerLight, text: COLORS.danger, border: COLORS.danger }
      case 'warning': return { bg: COLORS.warningLight, text: COLORS.warning, border: COLORS.warning }
      case 'info': return { bg: COLORS.infoLight, text: COLORS.info, border: COLORS.info }
      default: return { bg: COLORS.infoLight, text: COLORS.info, border: COLORS.info }
    }
  }

  const criticalCount = issues.filter(i => i.type === 'critical').length
  const warningCount = issues.filter(i => i.type === 'warning').length

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: reduceMotion ? 0 : 0.2 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          backgroundColor: COLORS.panel,
        }}
        role="complementary"
        aria-label="Accessibility Audit"
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: `${SPACING.lg} ${SPACING.lg}`,
            borderBottom: `1px solid ${COLORS.border}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Accessibility 
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
              Accessibility
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
            aria-label="Close accessibility panel"
          >
            <X size={18} />
          </button>
        </div>

        {/* Summary */}
        <div
          style={{
            padding: SPACING.lg,
            backgroundColor: COLORS.background,
            borderBottom: `1px solid ${COLORS.border}`,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: SPACING.md,
            }}
          >
            <span
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: COLORS.text,
              }}
            >
              Issues Found
            </span>
            <div style={{ display: 'flex', gap: '12px' }}>
              {criticalCount > 0 && (
                <span
                  style={{
                    fontSize: '13px',
                    color: COLORS.danger,
                    fontWeight: 500,
                  }}
                >
                  {criticalCount} Critical
                </span>
              )}
              {warningCount > 0 && (
                <span
                  style={{
                    fontSize: '13px',
                    color: COLORS.warning,
                    fontWeight: 500,
                  }}
                >
                  {warningCount} Warnings
                </span>
              )}
            </div>
          </div>

          <EditorButton
            variant="primary"
            size="md"
            onClick={() => onFixAll?.()}
            disabled={issues.length === 0 || isScanning}
            icon={<Sparkles size={18} />}
            style={{ width: '100%' }}
          >
            {isScanning ? 'Scanning...' : 'Fix All Issues'}
          </EditorButton>
        </div>

        {/* Issues List */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: SPACING.lg,
          }}
        >
          {isScanning ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: `${SPACING['3xl']} 0`,
                gap: SPACING.md,
              }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Accessibility size={32} style={{ color: COLORS.primary }} />
              </motion.div>
              <span
                style={{
                  fontSize: '14px',
                  color: COLORS.textSecondary,
                }}
              >
                Scanning for accessibility issues...
              </span>
            </div>
          ) : issues.length === 0 ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: `${SPACING['3xl']} 0`,
                gap: SPACING.md,
              }}
            >
              <CheckCircle2 size={48} style={{ color: COLORS.success }} />
              <div
                style={{
                  textAlign: 'center',
                  fontSize: '14px',
                  color: COLORS.textSecondary,
                }}
              >
                <div style={{ fontWeight: 600, color: COLORS.text, marginBottom: '4px' }}>
                  All Good!
                </div>
                No accessibility issues found
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.sm }}>
              {issues.map((issue) => {
                const colors = getIssueColor(issue.type)
                return (
                  <motion.div
                    key={issue.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: reduceMotion ? 0 : 0.15 }}
                    style={{
                      padding: SPACING.md,
                      backgroundColor: colors.bg,
                      borderRadius: RADIUS.lg,
                      border: `1px solid ${colors.border}`,
                      display: 'flex',
                      gap: SPACING.md,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: colors.text,
                        flexShrink: 0,
                      }}
                      aria-hidden="true"
                    >
                      {getIssueIcon(issue.category)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: '14px',
                          fontWeight: 600,
                          color: colors.text,
                          marginBottom: '4px',
                        }}
                      >
                        {issue.title}
                      </div>
                      <div
                        style={{
                          fontSize: '13px',
                          color: COLORS.textSecondary,
                          lineHeight: 1.4,
                          marginBottom: '8px',
                        }}
                      >
                        {issue.description}
                      </div>
                      {issue.fixAction && (
                        <button
                          onClick={issue.fixAction}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '4px 8px',
                            backgroundColor: 'transparent',
                            border: `1px solid ${colors.border}`,
                            borderRadius: RADIUS.md,
                            color: colors.text,
                            fontSize: '12px',
                            fontWeight: 500,
                            cursor: 'pointer',
                            transition: reduceMotion ? 'none' : `all ${ANIMATION.duration.fast} ${ANIMATION.easing.ease}`,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.5)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent'
                          }}
                        >
                          <Sparkles size={12} />
                          Fix This Issue
                        </button>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>

        {/* Tips Section */}
        <div
          style={{
            padding: SPACING.lg,
            borderTop: `1px solid ${COLORS.border}`,
            backgroundColor: COLORS.background,
          }}
        >
          <h3
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: COLORS.textSecondary,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: SPACING.md,
            }}
          >
            Quick Tips
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <TipItem icon={<Eye size={16} />} text="Ensure all images have alt text" />
            <TipItem icon={<Contrast size={16} />} text="Maintain 4.5:1 contrast ratio" />
            <TipItem icon={<Focus size={16} />} text="All interactive elements must be focusable" />
            <TipItem icon={<Type size={16} />} text="Use proper heading hierarchy" />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

function TipItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '13px',
        color: COLORS.textSecondary,
      }}
    >
      <span style={{ color: COLORS.primary }}>{icon}</span>
      <span>{text}</span>
    </div>
  )
}

// Sample issues for testing
export const SAMPLE_ACCESSIBILITY_ISSUES: AccessibilityIssue[] = [
  {
    id: '1',
    type: 'critical',
    category: 'contrast',
    title: 'Low Contrast Text',
    description: 'Text color does not meet WCAG AA requirements (current ratio: 2.1:1)',
    elementId: 'heading-1',
    fixAction: async () => {},
  },
  {
    id: '2',
    type: 'critical',
    category: 'alt-text',
    title: 'Missing Alt Text',
    description: 'Image lacks alternative text for screen readers',
    elementId: 'image-3',
    fixAction: async () => {},
  },
  {
    id: '3',
    type: 'warning',
    category: 'heading',
    title: 'Skipped Heading Level',
    description: 'H3 follows H1 without an H2 in between',
    elementId: 'heading-5',
  },
  {
    id: '4',
    type: 'info',
    category: 'aria',
    title: 'Missing ARIA Label',
    description: 'Button could benefit from a more descriptive label',
    elementId: 'button-12',
  },
]
