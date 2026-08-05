# Task 4: Rewrite IconToolbar.tsx to Production-Grade Studio Quality

## Agent: Main Agent

## Work Log

- Read `/home/z/my-project/worklog.md` for context on prior tasks (design-tokens upgrade, primitives upgrade)
- Read current `IconToolbar.tsx` — inline-styles, 56px width, 40x40 buttons, CSS-driven tooltips via `<style>` injection, no keyboard shortcut display, no group separators, no `darkMode` prop
- Read new `design-tokens.ts` — full semantic color system with `LIGHT_COLORS` / `DARK_COLORS`, `Z_INDEX`, `ANIMATION`
- Read `AccessibilityContext.tsx` — provides `reduceMotion`, `fontSizeScale`, `highContrast`
- Read `primitives.tsx` — has `IconButton` with Radix Tooltip, `Kbd`, `SimpleTooltip`
- Read `VisualEditor.tsx` usage — passes `active` and `onSelect` to `IconToolbar`, `darkMode` available but not yet passed
- Read `keyboard.ts` — existing shortcut registry
- Read `@/components/ui/tooltip.tsx` — Radix-based Tooltip component with `delayDuration`
- Verified `cn` utility exists at `@/lib/utils`

### Rewrite Summary

Rewrote `IconToolbar.tsx` with full production-grade quality:

1. **Tool definitions**: 9 tools with correct lucide-react icons:
   - `pointer` (MousePointer2), `pages` (FileText), `sections` (LayoutTemplate), `components` (Component), `media` (Image), `ai` (Sparkles), `layers` (Layers), `brand` (Palette), `settings` (Settings2)

2. **Layout**: 48px width (Figma-compact), full height flex column, `role="toolbar"`, `aria-orientation="vertical"`

3. **Styling** (all Tailwind CSS):
   - Background: `#FAFAFA` light / `#111827` dark
   - Right border: 1px matching surface tokens
   - Each button: 48px × 40px, icon centered at 18px/1.75 stroke
   - Active: left 2px accent bar + `bg-[#EFF6FF]` + `text-[#2563EB]` (light) / dark equivalents
   - Hover: subtle `bg-[#F1F2F4]` shift (150ms transition, respects `reduceMotion`)
   - Focus-visible: 2px ring with proper offset

4. **Tooltips**: Radix Tooltip (`@/components/ui/tooltip`) with 150ms delay, positioned right, shows tool name + keyboard shortcut in a `<kbd>` badge

5. **Group separators**: Horizontal divider after `pointer` (group 0) and `ai` (group 2)

6. **Roving tabindex**: Only active/focused item is tabbable; ArrowUp/Down, Home/End move focus

7. **Props interface**: `{ active: string, onSelect: (id: string) => void, darkMode?: boolean }` — matches requirement and is backward-compatible

8. **Accessibility**: `role="toolbar"`, `aria-label`, `aria-orientation`, `aria-pressed` on each button, `focus-visible` rings, reduced-motion aware transitions

## Lint: No new errors (pre-existing errors in AnimationShowcase.tsx and test-phase5-injection.ts only)
## Server: All imports verified, no compilation issues
