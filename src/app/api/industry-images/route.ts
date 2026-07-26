import { NextRequest, NextResponse } from 'next/server';
import {
  getIndustryImages,
  getAllIndustryImages,
} from '@/lib/industry/image-provider';
import { ALL_INDUSTRIES, getIndustryById, detectIndustry } from '@/lib/industry';
import type { ImageCategory } from '@/lib/industry/types';

// ─── GET /api/industry-images ────────────────────────────────────────────
// Returns the full industry catalog (metadata only — no image URLs).
// Optional query: ?group=E-commerce  → filter by group
// Optional query: ?detect=prompt-text  → returns detected industry + suggested images

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const group = url.searchParams.get('group');
  const detect = url.searchParams.get('detect');

  // ─── Detection endpoint: /api/industry-images?detect=user-prompt ───
  if (detect !== null) {
    const result = detectIndustry(detect);
    return NextResponse.json({
      success: true,
      detected: {
        industry: result.industry,
        confidence: result.confidence,
        matchedKeywords: result.matchedKeywords,
        subIndustry: result.detectedSubIndustry,
      },
    });
  }

  // ─── Catalog endpoint: /api/industry-images[?group=...] ───
  let industries = ALL_INDUSTRIES;
  if (group) {
    industries = industries.filter(i => i.group === group);
  }
  return NextResponse.json({
    success: true,
    count: industries.length,
    industries: industries.map(i => ({
      id: i.id,
      nameEn: i.nameEn,
      nameFa: i.nameFa,
      group: i.group,
      groupFa: i.groupFa,
      keywords: i.keywords,
      subIndustries: i.subIndustries,
      palette: i.palette,
      suggestedSections: i.suggestedSections,
      sampleProducts: i.sampleProducts,
      fontPairing: i.fontPairing,
    })),
  });
}

// ─── POST /api/industry-images ───────────────────────────────────────────
// Returns image URLs for a specific industry × category (with multi-tier fallback).
//
// Body:
//   {
//     industryId: string,
//     category?: ImageCategory | 'all',       // default 'hero'
//     count?: number,                          // default 6
//     verifyUrls?: boolean,                    // default false (slow if true)
//     allowGeneration?: boolean,               // default false (slow, costs API)
//     language?: 'en' | 'fa',                  // default 'en'
//   }

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      industryId,
      category = 'hero',
      count = 6,
      verifyUrls = false,
      allowGeneration = false,
      language = 'en',
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

    // ─── "all" returns every category in one response ───
    if (category === 'all') {
      const all = await getAllIndustryImages(industryId, {
        perCategory: count,
        allowGeneration,
        language,
        verifyUrls,
      });
      return NextResponse.json({
        success: true,
        industry: meta,
        categories: all,
      });
    }

    // ─── Single category ───
    const validCats: ImageCategory[] = ['hero', 'product', 'lifestyle', 'team', 'workspace', 'detail'];
    if (!validCats.includes(category as ImageCategory)) {
      return NextResponse.json(
        { success: false, error: `Invalid category: ${category}` },
        { status: 400 }
      );
    }

    const result = await getIndustryImages({
      industryId,
      category: category as ImageCategory,
      count,
      verifyUrls,
      allowGeneration,
      language,
    });

    return NextResponse.json({
      success: true,
      industry: {
        id: meta.id,
        nameEn: meta.nameEn,
        nameFa: meta.nameFa,
      },
      category,
      tier: result.tier,
      fallbackLog: result.fallbackLog,
      images: result.images,
    });
  } catch (err: any) {
    console.error('[industry-images] POST error:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
