'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { COLORS, RADIUS, ACCESSIBILITY, ANIMATION } from './design-tokens'
import { useAccessibility } from './AccessibilityContext'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export interface ToolbarItem {
  id: string
  icon: React.ReactNode
  label: string
  category?: string
  onClick?: () => void
  isActive?: boolean
  badge?: string | number
  disabled?: boolean
  shortcut?: string
}

interface LeftToolbarProps {
  items: ToolbarItem[]
  activeItemId?: string
  onItemClick?: (item: ToolbarItem) => void
  onExpand?: (itemId: string) => void
}

export function LeftToolbar({ 
  items, 
  activeItemId, 
  onItemClick,
  onExpand 
}: LeftToolbarProps) {
  const { reduceMotion } = useAccessibility()
  const [expandedItem, setExpandedItem] = React.useState<string | null>(null)
  const [hoveredItem, setHoveredItem] = React.useState<string | null>(null)

  const handleKeyDown = (e: React.KeyboardEvent, item: ToolbarItem) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onItemClick?.(item)
    }
  }

  return (
    <nav 
      className="left-toolbar"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 8px',
        width: '100%',
      }}
      role="navigation"
      aria-label="Editor Tools"
    >
      {items.map((item) => (
        <div key={item.id} style={{ position: 'relative', width: '100%' }}>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button
                onClick={() => {
                  onItemClick?.(item)
                  if (onExpand && !item.onClick) {
                    setExpandedItem(expandedItem === item.id ? null : item.id)
                  }
                }}
                onKeyDown={(e) => handleKeyDown(e, item)}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                disabled={item.disabled}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '48px',
                  height: '48px',
                  borderRadius: RADIUS.lg,
                  border: 'none',
                  backgroundColor: item.isActive 
                    ? COLORS.primaryLight 
                    : 'transparent',
                  color: item.isActive 
                    ? COLORS.primary 
                    : item.disabled 
                      ? COLORS.textMuted 
                      : COLORS.textSecondary,
                  cursor: item.disabled ? 'not-allowed' : 'pointer',
                  transition: reduceMotion ? 'none' : `all ${ANIMATION.duration.fast} ${ANIMATION.easing.ease}`,
                  position: 'relative',
                }}
                whileHover={!item.disabled && !reduceMotion ? { scale: 1.05 } : undefined}
                whileTap={!item.disabled && !reduceMotion ? { scale: 0.95 } : undefined}
                aria-label={item.label}
                aria-current={item.isActive ? 'true' : undefined}
                aria-disabled={item.disabled}
                data-tooltip={item.label}
                tabIndex={item.disabled ? -1 : 0}
              >
                <span style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  width: '24px',
                  height: '24px',
                }}>
                  {item.icon}
                </span>
                
                {/* Badge */}
                {item.badge && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '6px',
                      right: '6px',
                      minWidth: '18px',
                      height: '18px',
                      borderRadius: RADIUS.full,
                      backgroundColor: COLORS.primary,
                      color: '#FFFFFF',
                      fontSize: '11px',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0 4px',
                    }}
                    aria-label={`${item.badge} notifications`}
                  >
                    {item.badge}
                  </span>
                )}

                {/* Focus indicator */}
                <span
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: RADIUS.lg,
                    boxShadow: 'inset 0 0 0 2px transparent',
                    transition: reduceMotion ? 'none' : `box-shadow ${ANIMATION.duration.fast} ${ANIMATION.easing.ease}`,
                  }}
                />
              </motion.button>
            </TooltipTrigger>
            <TooltipContent 
              side="right" 
              style={{
                backgroundColor: COLORS.text,
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 500,
                padding: '6px 10px',
                borderRadius: RADIUS.md,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>{item.label}</span>
                {item.shortcut && (
                  <kbd
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      padding: '2px 6px',
                      borderRadius: RADIUS.sm,
                      fontSize: '11px',
                      fontFamily: 'inherit',
                    }}
                  >
                    {item.shortcut}
                  </kbd>
                )}
              </div>
            </TooltipContent>
          </Tooltip>

          {/* Expanded panel */}
          {expandedItem === item.id && !item.onClick && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: reduceMotion ? 0 : 0.15 }}
              style={{
                position: 'absolute',
                left: '56px',
                top: 0,
                backgroundColor: COLORS.panel,
                borderRadius: RADIUS.lg,
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                border: `1px solid ${COLORS.border}`,
                padding: '8px',
                minWidth: '200px',
                zIndex: 300,
              }}
            >
              {/* Expanded content would go here */}
            </motion.div>
          )}
        </div>
      ))}

      {/* Spacer to push bottom items down */}
      <div style={{ flex: 1 }} />

      {/* Bottom section for settings */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: '8px',
        marginTop: 'auto',
        paddingTop: '12px',
        borderTop: `1px solid ${COLORS.border}`,
        width: '100%',
      }}>
        {/* Settings and other bottom items can be added here */}
      </div>
    </nav>
  )
}

// Preset toolbar items
export const TOOLBAR_ITEMS: Record<string, Omit<ToolbarItem, 'icon'>> = {
  PAGES: { id: 'pages', label: 'Pages', category: 'structure' },
  TEMPLATES: { id: 'templates', label: 'Templates', category: 'structure' },
  SECTIONS: { id: 'sections', label: 'Sections', category: 'structure' },
  COMPONENTS: { id: 'components', label: 'Components', category: 'structure' },
  MEDIA: { id: 'media', label: 'Media', category: 'assets' },
  AI: { id: 'ai', label: 'AI Assistant', category: 'ai', badge: 'NEW' },
  ASSETS: { id: 'assets', label: 'Assets', category: 'assets' },
  LAYERS: { id: 'layers', label: 'Layers', category: 'structure' },
  HISTORY: { id: 'history', label: 'History', category: 'tools' },
  BRAND: { id: 'brand', label: 'Brand', category: 'settings' },
  SETTINGS: { id: 'settings', label: 'Settings', category: 'settings' },
} as const
