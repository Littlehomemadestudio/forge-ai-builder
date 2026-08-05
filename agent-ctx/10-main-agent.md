---
Task ID: 10
Agent: Main Agent
Task: Rewrite Overlays.tsx and FloatingSelectionBar.tsx to production-grade studio quality

Work Log:
- Read current Overlays.tsx (143 lines), FloatingSelectionBar.tsx (157 lines), design-tokens.ts, primitives.tsx, keyboard.ts, Canvas.tsx, AccessibilityContext.tsx, index.ts
- Completely rewrote Overlays.tsx (~585 lines):
  - CommandPalette: Full-screen backdrop (bg-black/50 backdrop-blur-sm), centered modal (max-w-lg), search input with magnifying glass icon, categorized commands (File/Edit/View/AI), arrow up/down navigation with scroll-into-view, Enter to execute, Escape to close, focus trap hook (Tab stays within dialog), framer-motion entrance/exit (scale 0.95 + fade), footer with navigation hints
  - Commands organized into 4 categories: File (New, Open, Save), Edit (Undo, Redo, Delete, Duplicate), View (Zoom In/Out, Fit, Toggle Grid, Toggle Inspector), AI (Improve, Generate, Audit)
  - Each command: icon + label + keyboard shortcut badge (Kbd component)
  - ShortcutsHelp: Modal overlay with categorized shortcuts (Editing/Canvas/Selection/General/View), group icons, Kbd components for key badges, close button, Escape to close, focus trap, framer-motion animation
  - Both: Tailwind CSS throughout, dark mode via dark: variants, AnimatePresence for mount/unmount, useAccessibility() for reduceMotion support
- Completely rewrote FloatingSelectionBar.tsx (~378 lines):
  - Desktop: Dark floating bar (bg-gray-900) above selected element, rounded-lg, shadow-xl, compact
  - Tag badge (blue-500/15 bg, blue-400 text) + context-sensitive actions:
    - Text: Bold, Italic, Align Left/Center/Right
    - Image: Edit alt text, Crop
    - Button/Link: Edit link, Change label
    - All: AI sparkle, Duplicate, Delete
  - Downward caret arrow below bar pointing to element
  - Flip below if too close to top of viewport
  - framer-motion spring entrance/exit (scale 0.8 + fade, spring stiffness 300/damping 22)
  - RAF-throttled repositioning on scroll/resize with requestAnimationFrame
  - Mobile: Bottom sheet on <768px with safe area inset padding
  - BarButton component: 32px (w-8 h-8), proper ARIA labels, focus-visible ring, keyboard accessible
  - VDivider component for visual separation between groups
  - TagBadge and ContextButtons extracted as sub-components outside render
- Props match existing interfaces exactly (CommandPaletteProps, ShortcutsHelpProps, FloatingSelectionBarProps)
- Fixed lint: useFocusTrap hook, selectionRef via useEffect (not during render), eslint-disable for useLayoutEffect+setState (standard React DOM measurement pattern)
- Build: passes `npx next build` with zero type errors
- Lint: zero new errors (pre-existing errors in AnimationShowcase.tsx, VisualEditor.tsx unrelated)

Stage Summary:
- Production-grade Overlays.tsx with full-screen backdrop, categorized command palette, focus trap, framer-motion
- Production-grade FloatingSelectionBar.tsx with dark floating bar, context actions, caret arrow, spring animation, mobile bottom sheet
- Both use Tailwind CSS, dark mode, accessibility, keyboard navigation
- Zero new lint/type errors, build passes
