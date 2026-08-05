# Task 2: Upgrade design-tokens.ts and primitives.tsx to production-grade studio quality

## Agent: Main Agent

## Work Log

### design-tokens.ts — Complete rewrite
- Replaced flat color objects with comprehensive **Figma/Webflow-inspired semantic color system**:
  - `LIGHT_COLORS` and `DARK_COLORS` with nested semantic groups: `surface`, `onSurface`, `primary`, `secondary`, `error`, `warning`, `success`, `info`, `border`, `state`, `selection`, `canvas`
  - Each semantic group has `base/hover/active/light/lighter/on<Name>` variants
  - Backward-compatible flat `COLORS` and `DARK_COLORS` objects derived from semantic tokens
- **Spacing scale**: 4px base unit — 0,1,2,3,4,5,6,8,10,12,16,20,24,32,40,48,64 plus semantic aliases
- **Typography scale**: 10-96px font sizes, 6 line-height values, 9 font weights, 6 letter-spacing values
- **Elevation/shadow system**: none, xs, sm, md, lg, xl, 2xl, inner, glow, ring
- **Border radius scale**: none, xs, sm, md, lg, xl, 2xl, 3xl, full
- **Animation/transition presets**: 7 durations, 8 easings, 4 spring configs, 8 transition shorthand strings
- **Z-index scale**: canvas, selection, hover, toolbar, panel, floatingPanel, overlay, modal, popover, tooltip, toast, debug
- **Breakpoints**: sm=640, md=768, lg=1024, xl=1280, 2xl=1536 plus named aliases
- **Grid system tokens**: gridSize=8, majorGrid=64, snapThreshold=4, minorGrid=8, midGrid=16
- **`useEditorTheme()` hook**: reads dark mode from `<html>` class via MutationObserver, returns full EditorTheme
- **`useTheme()` hook**: backward-compat legacy hook retained

### primitives.tsx — Complete rewrite with 14 production-grade components
1. **LiveRegion + announce()** — 60ms debounce
2. **Kbd** — Tailwind-based, proper border/shadow, dark mode
3. **IconButton** — 3 sizes, Radix/shadcn Tooltip, focus-visible ring, hover scale
4. **Field** — label, description, error state, required indicator
5. **ActionButton** — 4 variants with Tailwind hover/focus, 3 sizes, transitions
6. **SegmentedControl** — motion.div active indicator with spring
7. **CollapsibleSection** — framer-motion AnimatePresence, reduced-motion aware
8. **SliderField** — styled range, value display, min/max labels
9. **ColorField** — swatch + hex + alpha slider
10. **SelectField** — custom chevron, focus ring
11. **ToggleField** — motion.span spring animation, ARIA switch
12. **Divider** — horizontal/vertical, ARIA separator
13. **Badge** — 5 variants, dark mode
14. **SimpleTooltip** — CSS-only, 4 sides, transitions

### index.ts — Updated barrel exports for all new tokens and primitives

## Verification
- Lint: No new errors (7 pre-existing unrelated)
- Dev server: 200 OK
- Backward compatibility: All existing imports preserved
