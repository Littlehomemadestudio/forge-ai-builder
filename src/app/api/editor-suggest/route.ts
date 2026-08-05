import { NextRequest, NextResponse } from 'next/server';
import { checkAiAvailability, aiUnavailableMessage, streamChatDeltas } from '@/lib/ai-server';

// ─── Editor AI Suggestion API (streaming via Cerebras) ──────────────────────
//
// Takes the currently selected element (its tag + outerHTML + computed styles)
// and returns suggested improvements: better copy, better styling, etc.
// Used by the "AI Suggest" button in the editor toolbar.
//
// The response is an SSE stream:
//   event: delta   data: { chunk }       — raw model text as it arrives
//   event: result  data: { suggestions } — parsed suggestions (final)
//   event: done    data: { ok: true }
//   event: error   data: { message }

export const runtime = 'nodejs';
export const maxDuration = 120;

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
    newHtml?: string;
    newStyles?: Record<string, string>;
  }>;
}

function sseEncode(event: string, data: unknown): Uint8Array {
  return new TextEncoder().encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
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

    const av = await checkAiAvailability();
    if (!av.available) {
      return NextResponse.json({ error: aiUnavailableMessage(av.reason) }, { status: 503 });
    }

    const elementSnippet = body.elementHtml.slice(0, 4000);
    const stylesSnippet = Object.entries(body.computedStyles || {})
      .filter(([, v]) => v && v !== 'initial' && v !== 'normal' && v !== 'none' && v !== 'auto')
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
      "newStyles": {"<css-property>": "<value>", "...": "..."}
    }
  ]
}

Rules:
- Suggestions must be tasteful, modern, and broadly applicable
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

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        const send = (event: string, data: unknown) => {
          try { controller.enqueue(sseEncode(event, data)); } catch { /* closed */ }
        };
        let raw = '';
        try {
          for await (const chunk of streamChatDeltas(systemPrompt, userPrompt, {
            maxTokens: 2000,
            timeoutMs: 90_000,
          })) {
            raw += chunk;
            send('delta', { chunk });
          }

          const jsonMatch = raw.match(/\{[\s\S]*\}/);
          let parsed: SuggestResponse;
          if (!jsonMatch) {
            parsed = {
              suggestions: [{
                type: 'content',
                title: lang === 'fa' ? 'هیچ پیشنهادی دریافت نشد' : 'No suggestions received',
                description: lang === 'fa'
                  ? 'هوش مصنوعی نتوانست پیشنهادی تولید کند. دوباره تلاش کنید.'
                  : 'The AI could not generate suggestions. Please try again.',
              }],
            };
          } else {
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
          }
          send('result', parsed);
          send('done', { ok: true });
        } catch (err: any) {
          console.error('[editor-suggest] stream error:', err);
          send('error', { message: String(err?.message || err) });
        } finally {
          try { controller.close(); } catch { /* already closed */ }
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch (err: any) {
    console.error('[editor-suggest] Error:', err);
    return NextResponse.json(
      { error: 'Suggestion failed: ' + (err?.message || String(err)) },
      { status: 500 }
    );
  }
}
