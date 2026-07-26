# Task 5: Editor Bug Fixes & UX Improvements

## Summary of Changes

### Bug 1 Fix: Purple selection borders remain when scrolling
**Root Cause**: Overlay elements (selectionBox, overlayEl, labelEl, resizeHandles) inside the iframe used `position:fixed`, which positions them relative to the iframe viewport. While `updateOverlayPositions` tried to reposition on scroll, this was unreliable and could leave stale overlays.

**Fix Applied**: Changed all selection-related overlays from `position:fixed` to `position:absolute` with document-relative coordinates. Now overlays use `rect.top + window.scrollY` and `rect.left + window.scrollX` to compute their position relative to the document. This means overlays naturally scroll with the content without needing scroll event listeners. The scroll listener was removed; only resize events still trigger position updates.

Files changed: `src/components/editor/EditorPage.tsx` (iframe inject script section)

### Bug 2 Fix: Multiple purple borders persist when switching selections
**Root Cause**: When selecting element A then B, `hideSelection()` was not called before `showSelection(B)` in the click handler, potentially leaving stale state. Also, `createOverlays()` could create duplicate overlay elements if called multiple times without cleanup.

**Fix Applied**:
1. Added `hideSelection()` call in the iframe click handler before showing a new selection
2. Added cleanup in `createOverlays()`: before creating new overlays, removes any existing elements with IDs `#forge-hover-overlay`, `#forge-selection-box`, `#forge-label`, `#forge-grid`, `.forge-resize-handle`
3. Added `display:none` to initial overlay styles so they're hidden until explicitly shown

Files changed: `src/components/editor/EditorPage.tsx` (iframe inject script section)

### UX Improvements for Non-Technical Users

**Left Panel Tab Labels** (values unchanged, display labels changed):
- "Layers" → "Structure"
- "Add" → "Add Elements"
- "Theme" → "Designs"
- "Pages" → stays "Pages"

**Inspector Tab Labels** (values unchanged, display labels changed):
- "Edit" → "Text & Images"
- "Look" → "Appearance"
- "Arrange" → "Position & Size"
- "Animate" → "Motion Effects"
- "Info" → "Search Settings"

**Descriptions Added**: Brief helper text under section headers explaining what each section does, written in plain language.

**Property Labels Expanded**: FRIENDLY_PROP_LABELS greatly expanded:
- margin-top/bottom/left/right → "Space Above/Below/Left/Right"
- padding-top/bottom/left/right → "Inner Space Above/Below/Left/Right"
- border-*-width → "Top/Right/Bottom/Left Line Width"
- border-*-radius → "Top Left/Right/Bottom Left/Right Corner Roundness"
- flex-grow/shrink/basis → "Grow to Fill Space / Shrink if Needed / Starting Size"
- And many more (see file for complete list)

**Box Model Diagram**: Labels changed from "margin"/"border"/"padding" → "Outer Space"/"Border Line"/"Inner Space"

**Design Tokens Labels**: 
- "Theme Presets" → "Color Themes (pick one to start)"
- "Colors" → "Custom Colors" with friendly color names
- "Font Family" → "Text Font (applies everywhere)"
- "Border Radius Scale" → "Corner Roundness"
- "Spacing Scale" → "Space Between Items"
- "Shadow Scale" → "Shadow Strength"
- "Apply Theme Globally" → "Apply Theme to All Pages"

**Empty Inspector Panel**: Changed "Pick something to edit" → "Pick a section to customize"

**Responsive Preview Section**: "Responsive Preview" → "Screen Sizes" with description

**All store types (EditorPanel, InspectorTab) remain unchanged** - only the UI display labels were modified.

## Verification
- Lint passes (only 1 pre-existing alt-text warning)
- Dev server compiles successfully
- No TypeScript errors
