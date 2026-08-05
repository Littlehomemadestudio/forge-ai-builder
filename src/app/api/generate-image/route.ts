import { NextRequest, NextResponse } from 'next/server';
import { getCuratedImagesForIndustry, generatePlaceholderSvg } from '@/lib/industry/image-provider';
import { getIndustryById } from '@/lib/industry';
import type { ImageCategory } from '@/lib/industry/types';

// ─── POST /api/generate-image ──────────────────────────────────────────────
// Cerebras has no image endpoint, so we always answer via the curated library
// (Unsplash) or, as a last resort, a deterministic SVG placeholder. Never
// errors out — there is always an image.

export const runtime = 'nodejs';
export const maxDuration = 60;

// Body: { industryId: string, category?: ImageCategory, language?: 'en'|'fa', fallbackToPlaceholder?: boolean }

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      industryId,
      category = 'product',
      fallbackToPlaceholder = true,
    } = body;

    if (!industryId) {
      return NextResponse.json(
        { success: false, error: 'industryId is required' },
        { status: 400 }
      );
    }

    const meta = getIndustryById(industryId);
    if (!meta) {
      return NextResponse.json(
        { success: false, error: `Unknown industryId: ${industryId}` },
        { status: 404 }
      );
    }

    // Tier 1: curated library (always succeeds, no API call)
    const curated = getCuratedImagesForIndustry(industryId, category as ImageCategory, 1);
    if (curated.length > 0) {
      return NextResponse.json({
        success: true,
        url: curated[0].url,
        source: 'curated',
        industry: { id: meta.id, nameEn: meta.nameEn, nameFa: meta.nameFa },
        category,
      });
    }

    // Tier 2: SVG placeholder (always succeeds)
    if (fallbackToPlaceholder) {
      const placeholderUrl = generatePlaceholderSvg(industryId, category as ImageCategory);
      return NextResponse.json({
        success: true,
        url: placeholderUrl,
        source: 'placeholder',
        industry: { id: meta.id, nameEn: meta.nameEn, nameFa: meta.nameFa },
        category,
        note: 'No curated image available; using SVG placeholder',
      });
    }

    return NextResponse.json(
      { success: false, error: 'No image available' },
      { status: 500 }
    );
  } catch (err: any) {
    console.error('[generate-image] error:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
