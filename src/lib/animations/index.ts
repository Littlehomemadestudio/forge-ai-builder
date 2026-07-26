import type { AnimationDef, AnimationId, AnimationCategory } from './types';
import { ALL_ANIMATION_IDS } from './types';
import glassmorphism from './glassmorphism';
import parallax from './parallax';
import skeleton from './skeleton';
import rotate360 from './rotate-360';
import countUp from './count-up';
import shakeCart from './shake-cart';

// ─── Registry ─────────────────────────────────────────────────────────────

export const ANIMATIONS: Record<AnimationId, AnimationDef> = {
  'glassmorphism': glassmorphism,
  'parallax': parallax,
  'skeleton': skeleton,
  'rotate-360': rotate360,
  'count-up': countUp,
  'shake-cart': shakeCart,
};

export const ALL_ANIMATIONS: AnimationDef[] = ALL_ANIMATION_IDS.map(id => ANIMATIONS[id]);

export function getAnimationById(id: string): AnimationDef | null {
  return ANIMATIONS[id as AnimationId] || null;
}

export function getAnimationsByCategory(cat: AnimationCategory): AnimationDef[] {
  return ALL_ANIMATIONS.filter(a => a.category === cat);
}

// ─── Detection from a free-text prompt ────────────────────────────────────
// Returns the set of animation IDs whose keywords appear in the prompt.

export function detectAnimations(prompt: string): AnimationId[] {
  if (!prompt) return [];
  const lower = prompt.toLowerCase();
  const matched = new Set<AnimationId>();
  for (const anim of ALL_ANIMATIONS) {
    for (const kw of anim.keywords) {
      if (lower.includes(kw.toLowerCase())) {
        matched.add(anim.id);
        break;
      }
    }
  }
  return Array.from(matched);
}

// ─── Bundle builder ───────────────────────────────────────────────────────
// Produces the combined <style> + <script> blocks to inject into a generated
// site. Returns empty strings if no animations matched.

export interface AnimationBundle {
  ids: AnimationId[];
  css: string;   // combined CSS, ready for <style id="forge-animations">
  js: string;    // combined JS, ready for <script> at end of body
  /** Human-readable list of included animation names (EN). */
  namesEn: string[];
  /** Human-readable list of included animation names (FA). */
  namesFa: string[];
}

export function buildAnimationBundle(ids: AnimationId[]): AnimationBundle {
  const unique = Array.from(new Set(ids));
  const cssParts: string[] = [];
  const jsParts: string[] = [];
  const namesEn: string[] = [];
  const namesFa: string[] = [];

  for (const id of unique) {
    const def = ANIMATIONS[id];
    if (!def) continue;
    cssParts.push(`/* === ${def.nameEn} === */\n${def.snippet.css}`);
    if (def.snippet.js) {
      jsParts.push(`/* === ${def.nameEn} === */\n${def.snippet.js}`);
    }
    namesEn.push(def.nameEn);
    namesFa.push(def.nameFa);
  }

  return {
    ids: unique,
    css: cssParts.join('\n\n'),
    js: jsParts.join('\n\n'),
    namesEn,
    namesFa,
  };
}

// ─── Re-exports ───────────────────────────────────────────────────────────

export * from './types';
export { default as glassmorphism } from './glassmorphism';
export { default as parallax } from './parallax';
export { default as skeleton } from './skeleton';
export { default as rotate360 } from './rotate-360';
export { default as countUp } from './count-up';
export { default as shakeCart } from './shake-cart';
