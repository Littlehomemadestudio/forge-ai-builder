// ─── Image provider (no SDK — always answers) ───────────────────────────────
// Tier 1: Curated Unsplash URLs (always succeeds, no API call)
// Tier 2: SVG placeholder with industry color (always succeeds)
//
// Cerebras Inference does not provide an image-generation/search endpoint, so
// the previous z-ai-web-dev-sdk image tiers were removed. The provider always
// returns a real image (curated) or a deterministic SVG placeholder.

import type { IndustryImage, ImageCategory, ImageSource } from './types';
import { getIndustryById } from './index';
import { getCuratedImages } from './curated-library';

// ─── Tier 2: SVG placeholder generator (always works) ──────────────────────

export function generatePlaceholderSvg(
  industryId: string,
  category: ImageCategory,
  width = 800,
  height = 600
): string {
  const meta = getIndustryById(industryId);
  const accent = meta?.palette.light.accent || '#7C3AED';
  const bg = meta?.palette.light.bg || '#F8FAFC';
  const label = meta
    ? `${meta.nameEn} · ${category}`
    : `${industryId} · ${category}`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bg}"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0.3"/>
    </linearGradient>
    <pattern id="p" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
      <circle cx="20" cy="20" r="1.5" fill="${accent}" opacity="0.15"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <rect width="100%" height="100%" fill="url(#p)"/>
  <rect x="${width / 2 - 60}" y="${height / 2 - 60}" width="120" height="120" rx="16" fill="${accent}" opacity="0.12"/>
  <text x="${width / 2}" y="${height / 2 - 8}" font-family="Inter, system-ui, sans-serif" font-size="32" font-weight="700" fill="${accent}" text-anchor="middle">${(meta?.nameEn || industryId).split(' ')[0]}</text>
  <text x="${width / 2}" y="${height / 2 + 24}" font-family="Inter, system-ui, sans-serif" font-size="14" font-weight="500" fill="${accent}" opacity="0.7" text-anchor="middle">${category}</text>
</svg>`;

  const encoded = encodeURIComponent(svg)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');
  return `data:image/svg+xml;charset=utf-8,${encoded}`;
}

// ─── Tier 1: Curated library lookup (synchronous, instant) ─────────────────

export function getCuratedImagesForIndustry(
  industryId: string,
  category: ImageCategory,
  count = 8
): IndustryImage[] {
  const meta = getIndustryById(industryId);
  const urls = getCuratedImages(industryId, category, count);
  return urls.map((url, i) => ({
    url,
    alt: `${meta?.nameEn || industryId} ${category} ${i + 1}`,
    source: 'curated' as ImageSource,
    category,
  }));
}

// ─── Helper: URL reachability check ────────────────────────────────────────

export async function isUrlReachable(url: string, timeoutMs = 5000): Promise<boolean> {
  if (url.startsWith('data:')) return true;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, { method: 'HEAD', signal: controller.signal, redirect: 'follow' });
      return res.ok || (res.status >= 200 && res.status < 400);
    } finally {
      clearTimeout(timeout);
    }
  } catch {
    return false;
  }
}

export interface IndustryImagesRequest {
  industryId: string;
  category?: ImageCategory;
  count?: number;
  skipTiers?: ImageSource[];
  verifyUrls?: boolean;
  allowGeneration?: boolean; // kept for API compatibility; no-op (Cerebras has no image API)
  language?: 'en' | 'fa';
}

export interface IndustryImagesResponse {
  images: IndustryImage[];
  tier: ImageSource;
  fallbackLog: string[];
}


// ─── Tiered provider: Tier 1 (curated) → Tier 2 (SVG placeholder) ──────────

export async function getIndustryImages(req: IndustryImagesRequest): Promise<IndustryImagesResponse> {
  const {
    industryId,
    category = 'hero',
    count = 6,
    skipTiers = [],
    verifyUrls = false,
    language = 'en',
  } = req;

  const meta = getIndustryById(industryId);
  const fallbackLog: string[] = [];

  if (!meta) {
    fallbackLog.push('industry not found — using generic-business');
  }
  const industry = meta || getIndustryById('generic-business')!;

  // ── Tier 1: Curated ──
  if (!skipTiers.includes('curated')) {
    fallbackLog.push(`Tier 1 (curated): looking up ${industry.id}/${category}`);
    const curated = getCuratedImagesForIndustry(industry.id, category, count);
    if (curated.length > 0) {
      let valid = curated;
      if (verifyUrls) {
        const checks = await Promise.all(
          curated.map(async img => ({ img, ok: await isUrlReachable(img.url) }))
        );
        valid = checks.filter(c => c.ok).map(c => c.img);
        fallbackLog.push(`  → ${valid.length}/${curated.length} URLs reachable`);
      }
      if (valid.length > 0) {
        return { images: valid, tier: 'curated', fallbackLog };
      }
      fallbackLog.push('  → no curated URLs verified, falling through');
    } else {
      fallbackLog.push('  → no curated URLs for this industry/category');
    }
  }

  // ── Tier 2: SVG placeholder (always succeeds) ──
  fallbackLog.push(`Tier 2 (placeholder): generating SVG for ${industry.id}/${category}`);
  const placeholderUrl = generatePlaceholderSvg(industry.id, category);
  return {
    images: Array.from({ length: Math.min(count, 4) }, () => ({
      url: placeholderUrl,
      alt: `${industry.nameEn} ${category} placeholder`,
      source: 'placeholder' as ImageSource,
      category,
    })),
    tier: 'placeholder',
    fallbackLog,
  };
}

// ─── Batch: get all categories at once ────────────────────────────────────

export async function getAllIndustryImages(
  industryId: string,
  options: { perCategory?: number; allowGeneration?: boolean; language?: 'en' | 'fa'; verifyUrls?: boolean } = {}
): Promise<{ [k in ImageCategory]: IndustryImagesResponse }> {
  const cats: ImageCategory[] = ['hero', 'product', 'lifestyle', 'team', 'workspace', 'detail'];
  const results = await Promise.all(
    cats.map(c => getIndustryImages({
      industryId,
      category: c,
      count: options.perCategory || 4,
      allowGeneration: options.allowGeneration,
      language: options.language || 'en',
      verifyUrls: options.verifyUrls,
    }))
  );
  return Object.fromEntries(cats.map((c, i) => [c, results[i]])) as { [k in ImageCategory]: IndustryImagesResponse };
}
