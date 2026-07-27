// ─── Animation Library Types ──────────────────────────────────────────────
// Phase 5 — Forge AI Builder
// Each animation ships with a guaranteed-working CSS+JS snippet that can be
// injected directly into any generated site, ensuring the effect renders
// correctly regardless of how the LLM interprets the prompt.

export type AnimationId =
  | 'glassmorphism'
  | 'parallax'
  | 'skeleton'
  | 'rotate-360'
  | 'count-up'
  | 'shake-cart';

export type AnimationCategory =
  | 'visual'      // decorative surface effect (glassmorphism)
  | 'scroll'      // scroll-triggered (parallax)
  | 'loading'     // placeholder while content loads (skeleton)
  | 'hover'       // mouse-hover triggered (360 rotate)
  | 'metric'      // animated number (count-up)
  | 'interaction';// user-action feedback (cart shake)

export interface AnimationSnippet {
  /** Pure CSS — placed in <style id="forge-anim-{id}">. */
  css: string;
  /** Optional JS — placed in <script> at end of body. SSR-safe, no React. */
  js?: string;
  /** Optional init code that runs after DOMContentLoaded. */
  init?: string;
}

export interface AnimationDemo {
  /** Standalone HTML fragment that shows the animation in action. */
  html: string;
  /** Inline CSS needed only for the demo (does NOT ship with the snippet). */
  css?: string;
}

export interface AnimationDef {
  id: AnimationId;
  /** EN display name, e.g. "Glassmorphism" */
  nameEn: string;
  /** FA display name, e.g. "افکت شیشه‌ای" */
  nameFa: string;
  category: AnimationCategory;
  /** EN description (1–2 sentences) */
  descEn: string;
  /** FA description (1–2 sentences) */
  descFa: string;
  /** Emoji/icon glyph for visual ID */
  icon: string;
  /** Hex accent color used in the demo card */
  accent: string;
  /** The actual production-ready snippet */
  snippet: AnimationSnippet;
  /** Demo for the showcase UI */
  demo: AnimationDemo;
  /** CSS class hooks the LLM should use to opt into the effect */
  triggers: string[];
  /** Prompt keywords (EN + FA) that auto-enable this animation */
  keywords: string[];
}

export const ALL_ANIMATION_IDS: AnimationId[] = [
  'glassmorphism',
  'parallax',
  'skeleton',
  'rotate-360',
  'count-up',
  'shake-cart',
];
