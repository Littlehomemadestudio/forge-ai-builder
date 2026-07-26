# Task 4 — Template Section for Forge AI Builder

## Summary

Added a "Start from a template" section at the bottom of the builder page (BuilderPage.tsx) that lets users pick from ready-made website templates organized by category.

## What was done

### 1. Store updates (`src/lib/store.ts`)
- Added `selectedTemplateHtml: string` field (default: `''`) to AppState
- Added `setSelectedTemplateHtml: (html: string) => void` action
- When a template is selected for editing, this stores the HTML in the Zustand store

### 2. BuilderPage.tsx updates (`src/components/builder/BuilderPage.tsx`)
- **New imports**: Dialog components, `FileText`, `Maximize2` from lucide-react
- **Template data**: Created `SITE_TEMPLATES` array with 7 complete HTML/CSS templates:
  - Stellar Portfolio (Portfolio) — dark creative portfolio with project grids
  - NovaPulse SaaS (SaaS) — modern SaaS landing with features and pricing
  - Ember & Roast Café (Restaurant) — warm rustic café with menu cards
  - Luxe Market Store (E-commerce) — elegant storefront with product cards
  - Studio Arc Agency (Agency) — bold agency with case studies and team
  - The Daily Editorial (Blog) — clean editorial blog layout
  - Summit Conference (Event) — bold event page with speakers and schedule
  - Dev Profile (Personal) — modern developer profile/resume

- **TemplatePreviewDialog**: A Dialog component that renders the template HTML in an iframe with browser chrome. Has "Close Preview" and "Edit this Template" buttons.

- **TemplatesSection**: 
  - Separator with "or" divider between AI section and templates
  - Badge header: "Ready-made templates · No AI needed"
  - Section title: "Start from a template"
  - Category dropdown filter (All, Portfolio, SaaS, Restaurant, E-commerce, Blog, Agency, Event, Personal)
  - Grid of template cards (2-4 columns responsive) with gradient thumbnails, hover effects, category badges
  - Clicking a card opens the TemplatePreviewDialog
  - "Edit this Template" button sets `selectedTemplateHtml`, `builderMode` to 'templates', and transitions to preview phase

- **PreviewPhase updates**: Added `builderMode` and `selectedTemplateHtml` from store. When in template mode, creates a virtual page with the template HTML instead of using generated pages.

- **PromptPhase update**: Added `<TemplatesSection />` at the bottom, after the suggestion cards

### 3. Lint check
- No errors introduced. Only 1 pre-existing warning in EditorPage.tsx (alt-text).

### 4. Dev server
- Compiling successfully, no errors.

## Files changed
- `src/lib/store.ts` — added `selectedTemplateHtml` state + action
- `src/components/builder/BuilderPage.tsx` — templates data, preview dialog, templates section, PreviewPhase template mode support
