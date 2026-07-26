import { NextRequest, NextResponse } from 'next/server';
import {
  ALL_ANIMATIONS,
  ANIMATIONS,
  buildAnimationBundle,
  detectAnimations,
  getAnimationById,
} from '@/lib/animations';
import type { AnimationId } from '@/lib/animations';

export const runtime = 'nodejs';

// ─── GET /api/animations ──────────────────────────────────────────────────
// Returns the full animation catalog. Optionally detect from a prompt:
//   GET /api/animations?detect=I%20want%20glassmorphism%20and%20parallax
//   GET /api/animations?id=glassmorphism            (single animation detail)
//   GET /api/animations?bundle=glassmorphism,parallax  (combined css+js)

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const detect = url.searchParams.get('detect');
  const singleId = url.searchParams.get('id');
  const bundleParam = url.searchParams.get('bundle');

  // ── Single animation detail ──
  if (singleId) {
    const def = getAnimationById(singleId);
    if (!def) {
      return NextResponse.json(
        { error: `Unknown animation id: ${singleId}`, validIds: Object.keys(ANIMATIONS) },
        { status: 404 }
      );
    }
    return NextResponse.json({ animation: serialize(def) });
  }

  // ── Combined bundle for injection ──
  if (bundleParam) {
    const ids = bundleParam
      .split(',')
      .map(s => s.trim())
      .filter((s): s is AnimationId => Boolean(s) && s in ANIMATIONS);
    const bundle = buildAnimationBundle(ids);
    return NextResponse.json({
      ids: bundle.ids,
      namesEn: bundle.namesEn,
      namesFa: bundle.namesFa,
      css: bundle.css,
      js: bundle.js,
    });
  }

  // ── Detection from prompt ──
  if (detect !== null) {
    const detected = detectAnimations(detect);
    return NextResponse.json({
      detected,
      names: detected.map(id => ANIMATIONS[id].nameEn),
    });
  }

  // ── Full catalog ──
  return NextResponse.json({
    total: ALL_ANIMATIONS.length,
    animations: ALL_ANIMATIONS.map(serialize),
    categories: ['visual', 'scroll', 'loading', 'hover', 'metric', 'interaction'],
  });
}

function serialize(def: typeof ALL_ANIMATIONS[number]) {
  return {
    id: def.id,
    nameEn: def.nameEn,
    nameFa: def.nameFa,
    category: def.category,
    icon: def.icon,
    accent: def.accent,
    descEn: def.descEn,
    descFa: def.descFa,
    triggers: def.triggers,
    keywords: def.keywords,
    snippet: {
      css: def.snippet.css,
      js: def.snippet.js || null,
      init: def.snippet.init || null,
    },
    demo: {
      html: def.demo.html,
      css: def.demo.css || '',
    },
  };
}
