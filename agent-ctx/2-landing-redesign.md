# Task 2 - Landing Page Redesign

## Summary
Redesigned the Forge AI Website Builder landing page to be simplified and elegant, inspired by lovable.dev. Light theme is now the default with dark theme as an alternative.

## Changes Made
- **File**: `/home/z/my-project/src/components/landing/LandingPage.tsx` — Complete rewrite

## Key Design Decisions
1. **Light theme as default**: All styling uses shadcn CSS variables (bg-background, text-foreground, bg-primary, etc.) so both themes work seamlessly
2. **Theme toggle**: Navbar includes Sun/Moon icon toggle that updates both Zustand store (`setThemeMode`) and `document.documentElement.classList` for the 'dark' class
3. **No hardcoded dark colors**: Removed all `bg-[#0a0a0f]` type classes, replaced with theme-aware shadcn variables
4. **Purple/violet accent**: Uses `oklch(0.55 0.25 270)` in light mode, `oklch(0.85 0.08 260)` in dark mode via `bg-primary` and `text-primary`
5. **gradient-text class**: Used from existing globals.css for purple gradient text effect in hero and section headlines
6. **Hexagonal logo**: ForgeLogo uses Hexagon icon from lucide-react as brand mark

## Sections Included
1. **Navbar** — Sticky, with Forge logo, theme toggle (Sun/Moon), Sign in, Get Started buttons
2. **Hero** — Gradient background with animated orbs, "Your idea. Our AI. A complete website." headline, CTA buttons
3. **Features** — 4 cards (AI Generation, Visual Editor, Export Freedom, Deploy Anywhere) with icons
4. **How It Works** — 3 steps (Describe → AI Builds → Customize & Ship) with numbered icons
5. **Testimonials** — 3 user quotes with star ratings and avatar initials
6. **Pricing Hint** — "Free to start, scale when ready" messaging with CTA
7. **FAQ** — 5 questions using shadcn Accordion component
8. **Footer** — Links, social icons, copyright, sticky at bottom via min-h-screen flex layout

## Technical Details
- Uses `useAppStore` for navigate, themeMode, setThemeMode
- Uses Framer Motion for scroll-triggered animations (whileInView, staggerContainer, fadeInUp)
- Uses shadcn/ui components: Button, Card, CardContent, Badge, Accordion, Separator
- Uses lucide-react icons throughout
- Responsive: mobile-first grid layouts with sm/md/lg breakpoints
- Sticky footer: `min-h-screen flex flex-col` wrapper with `mt-auto` on footer
- `React.useEffect` syncs theme class on mount and themeMode changes

## Lint Results
- 0 errors in LandingPage.tsx
- 1 existing warning in EditorPage.tsx (alt-text) — unrelated to this task

## Dev Server
- Running on port 3000, HTTP 200 confirmed
