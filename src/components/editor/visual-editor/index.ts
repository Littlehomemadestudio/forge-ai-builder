// Visual Editor – Barrel Exports
// Single entry point for the visual-editor module.

// Main component
export { VisualEditor } from './VisualEditor'

// Layout
export { VisualEditorLayout, EditorButton, EditorPanel } from './VisualEditorLayout'

// Sub-components (for advanced usage)
export { TopNav } from './TopNav'
export { IconToolbar } from './IconToolbar'
export { ToolPanel } from './ToolPanel'
export { Canvas, findByFid, type SelectionInfo } from './Canvas'
export { Inspector } from './Inspector'
export { FloatingSelectionBar } from './FloatingSelectionBar'
export { EmptyCanvas } from './EmptyCanvas'
export { AIAssistantBar } from './AIAssistantBar'
export { CommandPalette, ShortcutsHelp } from './Overlays'

// Utilities
export { matchShortcut, formatKeys, SHORTCUTS } from './keyboard'
export type { Shortcut } from './keyboard'

// Design system
export * from './design-tokens'

// Accessibility
export { AccessibilityProvider, useAccessibility } from './AccessibilityContext'
export type { FontSizeScale, AccessibilityContextType } from './AccessibilityContext'

// Primitives
export {
  LiveRegion,
  announce,
  Kbd,
  IconButton,
  Field,
  ActionButton,
  SegmentedControl,
  CollapsibleSection,
  SliderField,
  ColorField,
  SelectField,
  ToggleField,
  Divider,
  Badge,
  SimpleTooltip,
} from './primitives'
export type {
  KbdProps,
  IconButtonProps,
  FieldProps,
  ActionButtonProps,
  ActionButtonVariant,
  SegmentedControlProps,
  CollapsibleSectionProps,
  SliderFieldProps,
  ColorFieldProps,
  SelectFieldProps,
  ToggleFieldProps,
  DividerProps,
  BadgeProps,
  BadgeVariant,
  SimpleTooltipProps,
} from './primitives'
