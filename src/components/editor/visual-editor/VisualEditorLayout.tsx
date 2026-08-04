'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { COLORS, SPACING, ANIMATION, ACCESSIBILITY, SHADOWS } from './design-tokens'
import { useAccessibility } from './AccessibilityContext'
import { TooltipProvider } from '@/components/ui/tooltip'

interface VisualEditorLayoutProps {
  children: React.ReactNode
  topNav?: React.ReactNode
  leftToolbar?: React.ReactNode
  rightInspector?: React.ReactNode
  bottomPanel?: React.ReactNode
  canvas?: React.ReactNode
}

export function VisualEditorLayout({
  children,
  topNav,
  leftToolbar,
  rightInspector,
  bottomPanel,
  canvas,
}: VisualEditorLayoutProps) {
  const { reduceMotion } = useAccessibility()

  return (
    <TooltipProvider delayDuration={200}>
      <div 
        className="visual-editor-root"
        style={{
          display: 'grid',
          gridTemplateRows: topNav ? '56px 1fr' : '1fr',
          gridTemplateColumns: `
            ${leftToolbar ? '64px' : '0'} 
            1fr 
            ${rightInspector ? '320px' : '0'}
          `,
          height: '100vh',
          width: '100vw',
          overflow: 'hidden',
          backgroundColor: COLORS.background,
          fontFamily: '"Inter", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
        role="application"
        aria-label="Visual Website Editor"
      >
        {/* Top Navigation */}
        {topNav && (
          <header
            style={{
              gridColumn: '1 / -1',
              gridRow: '1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: `0 ${SPACING.lg}`,
              backgroundColor: COLORS.panel,
              borderBottom: `1px solid ${COLORS.border}`,
              zIndex: 200,
            }}
            role="banner"
          >
            {topNav}
          </header>
        )}

        {/* Left Toolbar */}
        {leftToolbar && (
          <aside
            style={{
              gridColumn: '1',
              gridRow: topNav ? '2' : '1',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: `${SPACING.lg} ${SPACING.sm}`,
              backgroundColor: COLORS.panel,
              borderRight: `1px solid ${COLORS.border}`,
              gap: SPACING.md,
              overflowY: 'auto',
              zIndex: 150,
            }}
            role="navigation"
            aria-label="Editor Tools"
          >
            {leftToolbar}
          </aside>
        )}

        {/* Main Canvas Area */}
        <main
          style={{
            gridColumn: leftToolbar ? '2' : '1',
            gridRow: topNav ? '2' : '1',
            position: 'relative',
            overflow: 'hidden',
            backgroundColor: COLORS.background,
          }}
          role="main"
          aria-label="Design Canvas"
        >
          {canvas || children}
        </main>

        {/* Right Inspector */}
        {rightInspector && (
          <aside
            style={{
              gridColumn: '-1',
              gridRow: topNav ? '2' : '1',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: COLORS.panel,
              borderLeft: `1px solid ${COLORS.border}`,
              overflow: 'hidden',
              zIndex: 150,
            }}
            role="complementary"
            aria-label="Properties Inspector"
          >
            {rightInspector}
          </aside>
        )}

        {/* Bottom Panel */}
        {bottomPanel && (
          <footer
            style={{
              gridColumn: leftToolbar ? '2 / -1' : '1 / -1',
              gridRow: '-1',
              borderTop: `1px solid ${COLORS.border}`,
              backgroundColor: COLORS.panel,
              zIndex: 150,
            }}
            role="contentinfo"
          >
            {bottomPanel}
          </footer>
        )}
      </div>
    </TooltipProvider>
  )
}

// Utility components for consistent styling

interface EditorButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
  tooltip?: string
}

export const EditorButton = React.forwardRef<HTMLButtonElement, EditorButtonProps>(
  ({ variant = 'secondary', size = 'md', icon, children, tooltip, className, ...props }, ref) => {
    const { reduceMotion } = useAccessibility()
    
    const baseStyles: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      minHeight: ACCESSIBILITY.minTouchTarget,
      padding: size === 'sm' ? '6px 12px' : size === 'lg' ? '12px 20px' : '8px 16px',
      borderRadius: '8px',
      fontSize: '15px',
      fontWeight: 500,
      cursor: 'pointer',
      transition: reduceMotion ? 'none' : `all ${ANIMATION.duration.fast} ${ANIMATION.easing.ease}`,
      border: '1px solid transparent',
      outline: 'none',
    }

    const variants = {
      primary: {
        backgroundColor: COLORS.primary,
        color: '#FFFFFF',
        ':hover': { backgroundColor: COLORS.primaryHover },
        ':focus-visible': { boxShadow: ACCESSIBILITY.focusRing },
      },
      secondary: {
        backgroundColor: COLORS.panel,
        color: COLORS.text,
        border: `1px solid ${COLORS.border}`,
        ':hover': { backgroundColor: COLORS.hover },
        ':focus-visible': { boxShadow: ACCESSIBILITY.focusRing },
      },
      ghost: {
        backgroundColor: 'transparent',
        color: COLORS.textSecondary,
        ':hover': { backgroundColor: COLORS.hover, color: COLORS.text },
        ':focus-visible': { boxShadow: ACCESSIBILITY.focusRing },
      },
      danger: {
        backgroundColor: COLORS.danger,
        color: '#FFFFFF',
        ':hover': { backgroundColor: '#B91C1C' },
        ':focus-visible': { boxShadow: ACCESSIBILITY.focusRing },
      },
    }

    return (
      <motion.button
        ref={ref}
        {...props}
        style={{
          ...baseStyles,
          ...(variants[variant] as React.CSSProperties),
        }}
        whileTap={!reduceMotion ? { scale: 0.97 } : undefined}
        className={className}
      >
        {icon && <span aria-hidden="true">{icon}</span>}
        {children}
      </motion.button>
    )
  }
)

EditorButton.displayName = 'EditorButton'

interface EditorPanelProps {
  children: React.ReactNode
  title?: string
  collapsible?: boolean
  defaultOpen?: boolean
}

export function EditorPanel({ 
  children, 
  title, 
  collapsible = false,
  defaultOpen = true 
}: EditorPanelProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)
  const { reduceMotion } = useAccessibility()

  if (!collapsible) {
    return (
      <div
        style={{
          padding: SPACING.lg,
          borderBottom: `1px solid ${COLORS.border}`,
        }}
      >
        {title && (
          <h3
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: COLORS.text,
              marginBottom: SPACING.md,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            {title}
          </h3>
        )}
        {children}
      </div>
    )
  }

  return (
    <div
      style={{
        borderBottom: `1px solid ${COLORS.border}`,
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: `${SPACING.md} ${SPACING.lg}`,
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          minHeight: ACCESSIBILITY.minTouchTarget,
          color: COLORS.text,
          fontSize: '13px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}
        aria-expanded={isOpen}
      >
        {title}
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.15 }}
        >
          ▼
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.15 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: `0 ${SPACING.lg} ${SPACING.lg}` }}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
