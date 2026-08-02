// ─── Multi-tier image provider ────────────────────────────────────────────
// Tier 1: Curated Unsplash URLs (always succeeds, no API call)
// Tier 2: SDK image search (web image search via z-ai-web-dev-sdk)
// Tier 3: SDK AI image generation (creates new image from prompt)
// Tier 4: SVG placeholder with industry color (always succeeds)
//
// The provider automatically falls back to the next tier if one fails.

import type { IndustryImage, ImageCategory, ImageSource } from './types';
import { getIndustryById } from './index';
import { getCuratedImages } from './curated-library';

// ─── Tier 4: SVG placeholder generator (always works) ────────────────────

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

  // Encode as data URL
  const encoded = encodeURIComponent(svg)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');
  return `data:image/svg+xml;charset=utf-8,${encoded}`;
}

// ─── Tier 1: Curated library lookup (synchronous, instant) ───────────────

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

// ─── Tier 2: SDK image search ─────────────────────────────────────────────
// Calls z-ai-web-dev-sdk.images.search.create({ query, count }) if SDK is
// installed and configured. Returns [] when unavailable so the caller falls
// through to the next tier (AI generation, then SVG placeholder).

export async function searchImagesViaSdk(
  query: string,
  count = 8
): Promise<Array<{ url: string; caption?: string; source?: string }>> {
  try {
    const ZAI = await import('z-ai-web-dev-sdk')
      .then((m) => m.default)
      .catch(() => null);
    if (!ZAI) {
      // SDK not installed — skip silently; caller falls through to next tier.
      return [];
    }
    const zai = await ZAI.create();
    const result = await zai.images.search.create({ query, count });
    if (!result.success || !result.results || result.results.length === 0) {
      return [];
    }
    return result.results.map((r: any) => ({
      url: r.original_url,
      caption: r.caption,
      source: r.source,
    }));
  } catch (err) {
    console.warn(`[image-provider] SDK search failed for "${query}":`, err);
    return [];
  }
}

// ─── Tier 3: SDK AI image generation ──────────────────────────────────────
// Calls z-ai-web-dev-sdk.images.generations.create({ prompt, size }) if SDK
// is installed. Returns null when unavailable so caller falls through to the
// SVG placeholder tier.

export async function generateImageViaSdk(
  prompt: string,
  size: '1024x1024' | '768x1344' | '864x1152' | '1344x768' | '1152x864' | '1440x720' | '720x1440' = '1024x1024'
): Promise<string | null> {
  try {
    const ZAI = await import('z-ai-web-dev-sdk')
      .then((m) => m.default)
      .catch(() => null);
    if (!ZAI) {
      // SDK not installed — caller falls through to SVG placeholder.
      return null;
    }
    const zai = await ZAI.create();
    const result = await zai.images.generations.create({ prompt, size });
    if (!result.data || result.data.length === 0) {
      return null;
    }
    const base64 = result.data[0].base64;
    return `data:image/png;base64,${base64}`;
  } catch (err) {
    console.warn(`[image-provider] SDK generation failed for "${prompt.slice(0, 60)}...":`, err);
    return null;
  }
}

// ─── Helper: URL reachability check ──────────────────────────────────────
// Head-only fetch; if non-200 or fails, mark URL as unreachable.
// We use a per-request timeout of 5s.

export async function isUrlReachable(url: string, timeoutMs = 5000): Promise<boolean> {
  // Skip data URLs (always reachable)
  if (url.startsWith('data:')) return true;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, {
        method: 'HEAD',
        signal: controller.signal,
        // Don't follow too many redirects
        redirect: 'follow',
      });
      return res.ok || (res.status >= 200 && res.status < 400);
    } finally {
      clearTimeout(timeout);
    }
  } catch {
    return false;
  }
}

// ─── Tiered provider: try Tier 1 → 2 → 3 → 4 in order ────────────────────

export interface IndustryImagesRequest {
  industryId: string;
  category?: ImageCategory;
  count?: number;
  // Skip certain tiers (e.g. for speed)
  skipTiers?: ImageSource[];
  // Verify URLs are reachable (slower, but eliminates dead links)
  verifyUrls?: boolean;
  // Allow AI generation (slower, costs API calls)
  allowGeneration?: boolean;
  // Language for prompts (when generating)
  language?: 'en' | 'fa';
}

export interface IndustryImagesResponse {
  images: IndustryImage[];
  tier: ImageSource;        // which tier ultimately provided the images
  fallbackLog: string[];    // human-readable list of which tiers were tried
}

export async function getIndustryImages(req: IndustryImagesRequest): Promise<IndustryImagesResponse> {
  const {
    industryId,
    category = 'hero',
    count = 6,
    skipTiers = [],
    verifyUrls = false,
    allowGeneration = false,
    language = 'en',
  } = req;

  const meta = getIndustryById(industryId);
  const fallbackLog: string[] = [];

  if (!meta) {
    fallbackLog.push('industry not found — using generic-business');
  }
  const industry = meta || getIndustryById('generic-business')!;

  // ─── Tier 1: Curated ───
  if (!skipTiers.includes('curated')) {
    fallbackLog.push(`Tier 1 (curated): looking up ${industry.id}/${category}`);
    const curated = getCuratedImagesForIndustry(industry.id, category, count);
    if (curated.length > 0) {
      // Optional URL verification
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

  // ─── Tier 2: SDK search ───
  if (!skipTiers.includes('search')) {
    fallbackLog.push(`Tier 2 (SDK image search): querying web for "${industry.imageSearchKeywords[category]?.[0] || industry.nameEn}"`);
    const keywords = industry.imageSearchKeywords[category] || [industry.nameEn];
    const query = `${keywords[0]} ${industry.nameEn} ${language === 'fa' ? 'پر کیفیت' : 'high quality'}`;
    const results = await searchImagesViaSdk(query, count);
    if (results.length > 0) {
      let valid = results;
      if (verifyUrls) {
        const checks = await Promise.all(
          results.map(async r => ({ r, ok: await isUrlReachable(r.url) }))
        );
        valid = checks.filter(c => c.ok).map(c => c.r);
        fallbackLog.push(`  → ${valid.length}/${results.length} URLs reachable`);
      }
      if (valid.length > 0) {
        const imgs: IndustryImage[] = valid.slice(0, count).map(r => ({
          url: r.url,
          alt: r.caption || `${industry.nameEn} ${category}`,
          source: 'search' as ImageSource,
          category,
        }));
        return { images: imgs, tier: 'search', fallbackLog };
      }
      fallbackLog.push('  → no SDK search URLs verified, falling through');
    } else {
      fallbackLog.push('  → SDK search returned no results');
    }
  }

  // ─── Tier 3: AI generation (only if explicitly enabled) ───
  if (allowGeneration && !skipTiers.includes('generated')) {
    fallbackLog.push(`Tier 3 (AI generation): generating image for "${industry.nameEn} ${category}"`);
    const promptEn = `Professional ${category} image for ${industry.nameEn} website. ${
      industry.imageSearchKeywords[category]?.join(', ') || ''
    }. Modern, high-quality, ${category === 'hero' ? 'wide banner format' : 'standard composition'}.`;
    const promptFa = `تصویر حرفه‌ای ${category} برای وب‌سایت ${industry.nameFa}. ${
      industry.imageSearchKeywords[category]?.join('، ') || ''
    }. مدرن، باکیفیت، ${category === 'hero' ? 'قالب بنر عریض' : 'ترکیب استاندارد'}.`;
    const prompt = language === 'fa' ? promptFa : promptEn;
    const size: '1024x1024' | '1344x768' =
      category === 'hero' ? '1344x768' : '1024x1024';
    const generated = await generateImageViaSdk(prompt, size);
    if (generated) {
      return {
        images: [{
          url: generated,
          alt: `${industry.nameEn} ${category} (AI generated)`,
          source: 'generated',
          category,
        }],
        tier: 'generated',
        fallbackLog,
      };
    }
    fallbackLog.push('  → AI generation failed');
  }

  // ─── Tier 4: SVG placeholder (always succeeds) ───
  fallbackLog.push(`Tier 4 (placeholder): generating SVG for ${industry.id}/${category}`);
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
