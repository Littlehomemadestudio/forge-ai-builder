'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { COLORS, RADIUS, ACCESSIBILITY, ANIMATION, SPACING } from './design-tokens'
import { useAccessibility } from './AccessibilityContext'
import { 
  Type, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, 
  Palette, Link, Image, Sparkles, Copy, Trash2, Eye, EyeOff,
  ArrowUp, ArrowDown, Layers, Unlock, Lock
} from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export interface FloatingToolbarAction {
  id: string
  icon: React.ReactNode
  label: string
  onClick: () => void
  disabled?: boolean
  variant?: 'default' | 'primary' | 'danger'
}

interface FloatingToolbarProps {
  position: { x: number; y: number } | null
  actions: FloatingToolbarAction[]
  visible: boolean
  onClose?: () => void
}

export function FloatingToolbar({ 
  position, 
  actions, 
  visible, 
  onClose 
}: FloatingToolbarProps) {
  const { reduceMotion } = useAccessibility()

  if (!visible || !position) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 8 }}
      transition={{ duration: reduceMotion ? 0 : 0.15 }}
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        padding: '6px',
        backgroundColor: COLORS.text,
        borderRadius: RADIUS.lg,
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        zIndex: 500,
      }}
      role="toolbar"
      aria-label="Element Actions"
    >
      {actions.map((action) => (
        <Tooltip key={action.id}>
          <TooltipTrigger asChild>
            <button
              onClick={action.onClick}
              disabled={action.disabled}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                borderRadius: RADIUS.md,
                border: 'none',
                backgroundColor: action.variant === 'primary' 
                  ? COLORS.primary 
                  : 'transparent',
                color: action.variant === 'primary'
                  ? '#FFFFFF'
                  : action.variant === 'danger'
                    ? '#FCA5A5'
                    : '#FFFFFF',
                cursor: action.disabled ? 'not-allowed' : 'pointer',
                opacity: action.disabled ? 0.5 : 1,
                transition: reduceMotion ? 'none' : `all ${ANIMATION.duration.fast} ${ANIMATION.easing.ease}`,
              }}
              onMouseEnter={(e) => {
                if (!action.disabled && action.variant !== 'primary') {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'
                }
              }}
              onMouseLeave={(e) => {
                if (action.variant !== 'primary') {
                  e.currentTarget.style.backgroundColor = action.variant === 'primary' ? COLORS.primary : 'transparent'
                }
              }}
              aria-label={action.label}
              aria-disabled={action.disabled}
              tabIndex={action.disabled ? -1 : 0}
            >
              {React.cloneElement(action.icon as React.ReactElement, { size: 18 })}
            </button>
          </TooltipTrigger>
          <TooltipContent
            side="bottom"
            style={{
              backgroundColor: COLORS.panel,
              color: COLORS.text,
              fontSize: '13px',
              fontWeight: 500,
              padding: '6px 10px',
              borderRadius: RADIUS.md,
              border: `1px solid ${COLORS.border}`,
            }}
          >
            {action.label}
          </TooltipContent>
        </Tooltip>
      ))}

      {/* Close button */}
      {onClose && (
        <div
          style={{
            width: '1px',
            height: '24px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            margin: '0 4px',
          }}
        />
      )}
      {onClose && (
        <button
          onClick={onClose}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            borderRadius: RADIUS.md,
            border: 'none',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            color: '#FFFFFF',
            transition: reduceMotion ? 'none' : `all ${ANIMATION.duration.fast} ${ANIMATION.easing.ease}`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
          aria-label="Close toolbar"
        >
          <span style={{ fontSize: '20px', lineHeight: 1 }}>×</span>
        </button>
      )}
    </motion.div>
  )
}

// Preset action groups for different element types
export const TEXT_ACTIONS: FloatingToolbarAction[] = [
  { id: 'bold', icon: <Bold />, label: 'Bold', onClick: () => {} },
  { id: 'italic', icon: <Italic />, label: 'Italic', onClick: () => {} },
  { id: 'underline', icon: <Underline />, label: 'Underline', onClick: () => {} },
  { id: 'align-left', icon: <AlignLeft />, label: 'Align Left', onClick: () => {} },
  { id: 'align-center', icon: <AlignCenter />, label: 'Align Center', onClick: () => {} },
  { id: 'align-right', icon: <AlignRight />, label: 'Align Right', onClick: () => {} },
  { id: 'color', icon: <Palette />, label: 'Color', onClick: () => {} },
  { id: 'ai-rewrite', icon: <Sparkles />, label: 'AI Rewrite', onClick: () => {}, variant: 'primary' },
  { id: 'duplicate', icon: <Copy />, label: 'Duplicate', onClick: () => {} },
  { id: 'delete', icon: <Trash2 />, label: 'Delete', onClick: () => {}, variant: 'danger' },
]

export const BUTTON_ACTIONS: FloatingToolbarAction[] = [
  { id: 'fill', icon: <Palette />, label: 'Fill Color', onClick: () => {} },
  { id: 'border-radius', icon: <Layers />, label: 'Border Radius', onClick: () => {} },
  { id: 'icon', icon: <Image />, label: 'Add Icon', onClick: () => {} },
  { id: 'link', icon: <Link />, label: 'Add Link', onClick: () => {} },
  { id: 'hover', icon: <Eye />, label: 'Hover State', onClick: () => {} },
  { id: 'ai-improve', icon: <Sparkles />, label: 'Better CTA', onClick: () => {}, variant: 'primary' },
  { id: 'duplicate', icon: <Copy />, label: 'Duplicate', onClick: () => {} },
  { id: 'delete', icon: <Trash2 />, label: 'Delete', onClick: () => {}, variant: 'danger' },
]

export const IMAGE_ACTIONS: FloatingToolbarAction[] = [
  { id: 'replace', icon: <Image />, label: 'Replace Image', onClick: () => {} },
  { id: 'crop', icon: <Layers />, label: 'Crop', onClick: () => {} },
  { id: 'filters', icon: <Palette />, label: 'Filters', onClick: () => {} },
  { id: 'border-radius', icon: <Layers />, label: 'Border Radius', onClick: () => {} },
  { id: 'shadow', icon: <Eye />, label: 'Shadow', onClick: () => {} },
  { id: 'alt-text', icon: <Type />, label: 'Add Alt Text', onClick: () => {} },
  { id: 'ai-bg-remove', icon: <Sparkles />, label: 'Remove Background', onClick: () => {}, variant: 'primary' },
  { id: 'duplicate', icon: <Copy />, label: 'Duplicate', onClick: () => {} },
  { id: 'delete', icon: <Trash2 />, label: 'Delete', onClick: () => {}, variant: 'danger' },
]

export const SECTION_ACTIONS: FloatingToolbarAction[] = [
  { id: 'layout', icon: <Layers />, label: 'Layout', onClick: () => {} },
  { id: 'padding', icon: <ArrowUp />, label: 'Padding', onClick: () => {} },
  { id: 'background', icon: <Palette />, label: 'Background', onClick: () => {} },
  { id: 'responsive', icon: <Eye />, label: 'Responsive', onClick: () => {} },
  { id: 'animation', icon: <Sparkles />, label: 'Animation', onClick: () => {} },
  { id: 'ai-improve', icon: <Sparkles />, label: 'Improve Section', onClick: () => {}, variant: 'primary' },
  { id: 'duplicate', icon: <Copy />, label: 'Duplicate', onClick: () => {} },
  { id: 'delete', icon: <Trash2 />, label: 'Delete', onClick: () => {}, variant: 'danger' },
]

export const DEFAULT_ACTIONS: FloatingToolbarAction[] = [
  { id: 'bring-forward', icon: <ArrowUp />, label: 'Bring Forward', onClick: () => {} },
  { id: 'send-backward', icon: <ArrowDown />, label: 'Send Backward', onClick: () => {} },
  { id: 'lock', icon: <Lock />, label: 'Lock', onClick: () => {} },
  { id: 'hide', icon: <EyeOff />, label: 'Hide', onClick: () => {} },
  { id: 'duplicate', icon: <Copy />, label: 'Duplicate', onClick: () => {} },
  { id: 'delete', icon: <Trash2 />, label: 'Delete', onClick: () => {}, variant: 'danger' },
]
