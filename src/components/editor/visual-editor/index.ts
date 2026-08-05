// Visual Editor Module Exports
// This is the main entry point for the redesigned visual editor

export { 
  COLORS, 
  SPACING, 
  RADIUS, 
  SHADOWS, 
  TYPOGRAPHY, 
  ANIMATION, 
  ACCESSIBILITY, 
  Z_INDEX,
  BREAKPOINTS 
} from './design-tokens'

export type { FontSizeScale } from './AccessibilityContext'
export { AccessibilityProvider, useAccessibility } from './AccessibilityContext'

export { VisualEditorLayout, EditorButton, EditorPanel } from './VisualEditorLayout'

export { LeftToolbar, TOOLBAR_ITEMS } from './LeftToolbar'
export type { ToolbarItem } from './LeftToolbar'

export { AIPanel, AIFloatingButton } from './AIPanel'
export type { AISuggestion } from './AIPanel'

export { 
  FloatingToolbar, 
  TEXT_ACTIONS, 
  BUTTON_ACTIONS, 
  IMAGE_ACTIONS, 
  SECTION_ACTIONS,
  DEFAULT_ACTIONS 
} from './FloatingToolbar'
export type { FloatingToolbarAction } from './FloatingToolbar'

export { AccessibilityPanel, SAMPLE_ACCESSIBILITY_ISSUES } from './AccessibilityPanel'
export type { AccessibilityIssue } from './AccessibilityPanel'
