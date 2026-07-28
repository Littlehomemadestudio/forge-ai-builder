import { NextRequest, NextResponse } from 'next/server';
import { generateImageViaSdk, generatePlaceholderSvg } from '@/lib/industry/image-provider';
import { getIndustryById } from '@/lib/industry';
import type { ImageCategory } from '@/lib/industry/types';

// ─── POST /api/generate-image ────────────────────────────────────────────
// AI-generates an industry-specific image using z-ai-web-dev-sdk.
// Falls back to SVG placeholder if generation fails.
//
// Body:
//   {
//     industryId: string,
//     category: ImageCategory,   // 'hero' | 'product' | 'lifestyle' | ...
//     prompt?: string,            // custom prompt (overrides industry default)
//     size?: '1024x1024' | '1344x768' | '1440x720' | ...,
//     language?: 'en' | 'fa',
//     fallbackToPlaceholder?: boolean   // default true
//   }

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      industryId,
      category = 'product',
      prompt,
      size,
      language = 'en',
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

    // Build prompt if not provided
    const finalPrompt = prompt || (
      language === 'fa'
        ? `تصویر حرفه‌ای ${category} برای وب‌سایت ${meta.nameFa}. ${
            meta.imageSearchKeywords[category as ImageCategory]?.join('، ') || ''
          }. مدرن، باکیفیت، ${category === 'hero' ? 'قالب بنر عریض' : 'ترکیب استاندارد'}.`
        : `Professional ${category} image for ${meta.nameEn} website. ${
            meta.imageSearchKeywords[category as ImageCategory]?.join(', ') || ''
          }. Modern, high-quality, ${category === 'hero' ? 'wide banner format' : 'standard composition'}.`
    );

    // Pick size based on category (banner for hero, square for product)
    const finalSize = size || (
      category === 'hero' ? '1344x768' :
      category === 'lifestyle' ? '1152x864' :
      '1024x1024'
    );

    console.log(`[generate-image] generating for ${industryId}/${category} (${language})`);
    const generatedUrl = await generateImageViaSdk(finalPrompt, finalSize as any);

    if (generatedUrl) {
      return NextResponse.json({
        success: true,
        url: generatedUrl,
        source: 'generated',
        industry: { id: meta.id, nameEn: meta.nameEn, nameFa: meta.nameFa },
        category,
        prompt: finalPrompt,
      });
    }

    // Fallback: SVG placeholder
    if (fallbackToPlaceholder) {
      const placeholderUrl = generatePlaceholderSvg(meta.id, category as ImageCategory);
      return NextResponse.json({
        success: true,
        url: placeholderUrl,
        source: 'placeholder',
        industry: { id: meta.id, nameEn: meta.nameEn, nameFa: meta.nameFa },
        category,
        note: 'AI generation failed; using SVG placeholder',
      });
    }

    return NextResponse.json(
      { success: false, error: 'AI image generation failed and fallback disabled' },
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
