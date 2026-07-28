import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

// ─── Editor AI Suggestion API ──────────────────────────────────────────────
//
// Takes the currently selected element (its tag + outerHTML + computed styles)
// and returns suggested improvements: better copy, better styling, etc.
// Used by the "AI Suggest" button in the editor toolbar.

interface SuggestRequest {
  elementTag: string;
  elementHtml: string;
  computedStyles: Record<string, string>;
  currentText?: string;
  siteContext?: string;
  language?: 'en' | 'fa';
}

interface SuggestResponse {
  suggestions: Array<{
    type: 'content' | 'style' | 'both';
    title: string;
    description: string;
    newHtml?: string;       // if content/both — new outerHTML for the element
    newStyles?: Record<string, string>; // if style/both — CSS properties to apply
  }>;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as SuggestRequest;
    const lang = body.language === 'fa' ? 'fa' : 'en';

    if (!body.elementHtml || body.elementHtml.length < 3) {
      return NextResponse.json(
        { error: lang === 'fa' ? 'هیچ عنصری انتخاب نشده است' : 'No element provided' },
        { status: 400 }
      );
    }

    // Cap input size to avoid token explosion
    const elementSnippet = body.elementHtml.slice(0, 4000);
    const stylesSnippet = Object.entries(body.computedStyles || {})
      .filter(([_, v]) => v && v !== 'initial' && v !== 'normal' && v !== 'none' && v !== 'auto')
      .slice(0, 30)
      .map(([k, v]) => `${k}: ${v}`)
      .join('; ');

    const systemPrompt = `You are a senior UX/UI designer and frontend engineer reviewing a single HTML element on a user's website. Suggest 2-3 concrete improvements.

Output STRICT JSON only — no markdown, no code fences, no prose outside JSON.

Schema:
{
  "suggestions": [
    {
      "type": "content" | "style" | "both",
      "title": "<short headline in ${lang === 'fa' ? 'Persian' : 'English'}, max 6 words>",
      "description": "<one-sentence explanation in ${lang === 'fa' ? 'Persian' : 'English'}>",
      "newHtml": "<only if type is content or both — full replacement outerHTML, valid HTML, same tag>",
      "newStyles": {"<css-property>": "<value>", "...": "..."}  // only if type is style or both
    }
  ]
}

Rules:
- Suggestions must be tasteful, modern, and broadly applicable (no niche trends)
- For "style" suggestions, propose at most 3-4 CSS properties
- For "content" suggestions, keep the same tag and only improve the inner text/attributes
- Never invent new IDs or break the existing data-fid attribute
- Keep newHtml minimal — just the single element, no wrapper div
- Respond entirely in ${lang === 'fa' ? 'Persian' : 'English'} for title/description fields`;

    const userPrompt = `Element tag: ${body.elementTag}
Element HTML:
${elementSnippet}

Current computed styles (truncated):
${stylesSnippet || '(none provided)'}

Site context: ${body.siteContext || '(general website)'}
Current text content: ${body.currentText || '(empty)'}

Suggest 2-3 improvements. Output STRICT JSON only.`;

    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const raw = completion.choices?.[0]?.message?.content || '';
    // Extract JSON even if model wraps it in fences
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({
        suggestions: [{
          type: 'content' as const,
          title: lang === 'fa' ? 'هیچ پیشنهادی دریافت نشد' : 'No suggestions received',
          description: lang === 'fa'
            ? 'هوش مصنوعی نتوانست پیشنهادی تولید کند. دوباره تلاش کنید.'
            : 'The AI could not generate suggestions. Please try again.',
        }],
      } satisfies SuggestResponse);
    }

    let parsed: SuggestResponse;
    try {
      parsed = JSON.parse(jsonMatch[0]) as SuggestResponse;
    } catch {
      parsed = {
        suggestions: [{
          type: 'content',
          title: lang === 'fa' ? 'خطا در پردازش' : 'Parse error',
          description: lang === 'fa'
            ? 'خروجی هوش مصنوعی قابل پردازش نبود.'
            : 'The AI output could not be parsed.',
        }],
      };
    }

    return NextResponse.json(parsed);
  } catch (err: any) {
    console.error('[editor-suggest] Error:', err);
    return NextResponse.json(
      { error: 'Suggestion failed: ' + (err?.message || String(err)) },
      { status: 500 }
    );
  }
}
