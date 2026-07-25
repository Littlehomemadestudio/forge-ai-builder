import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';
import { db } from '@/lib/db';

interface GenerateRequest {
  prompt: string;
  framework?: string;
  userId?: string;
}

const SYSTEM_PROMPT = `You are an expert web developer AI. When given a prompt, you generate a complete, production-ready, beautiful website. Return ONLY the complete HTML code with embedded CSS (in a style tag) and JavaScript (in a script tag). The website must be: responsive, modern, animated, with proper typography, color scheme, and layout. Include all sections (hero, features, about, contact, footer). Use modern CSS (flexbox, grid, gradients, shadows, animations). No external dependencies - everything must be self-contained in the HTML. The output should be a single complete HTML document.`;

function extractHtmlFromResponse(content: string): string {
  // Try to extract HTML from code blocks if present
  const codeBlockMatch = content.match(/```(?:html)?\s*\n([\s\S]*?)```/);
  if (codeBlockMatch) {
    return codeBlockMatch[1].trim();
  }

  // Try to find HTML directly (look for <!DOCTYPE or <html)
  const htmlStart = content.indexOf('<!DOCTYPE');
  if (htmlStart !== -1) {
    const htmlEnd = content.lastIndexOf('</html>');
    if (htmlEnd !== -1) {
      return content.substring(htmlStart, htmlEnd + '</html>'.length).trim();
    }
  }

  // Look for <html tag
  const htmlTagStart = content.indexOf('<html');
  if (htmlTagStart !== -1) {
    const htmlEnd = content.lastIndexOf('</html>');
    if (htmlEnd !== -1) {
      return content.substring(htmlTagStart, htmlEnd + '</html>'.length).trim();
    }
  }

  // Return the whole content as-is if no HTML structure found
  return content.trim();
}

function extractCssFromHtml(html: string): string {
  const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/);
  return styleMatch ? styleMatch[1].trim() : '';
}

function extractJsFromHtml(html: string): string {
  const scriptMatches = html.match(/<script[^>]*>([\s\S]*?)<\/script>/g);
  if (!scriptMatches) return '';
  // Combine all script contents, excluding script tags with src attribute
  let js = '';
  for (const scriptTag of scriptMatches) {
    if (!scriptTag.match(/<script[^>]*src=/)) {
      const contentMatch = scriptTag.match(/<script[^>]*>([\s\S]*?)<\/script>/);
      if (contentMatch) {
        js += contentMatch[1] + '\n';
      }
    }
  }
  return js.trim();
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();
    const { prompt, framework, userId } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'prompt is required' },
        { status: 400 }
      );
    }

    // Enhance the prompt based on framework
    const frameworkHint = framework && framework !== 'html'
      ? ` The framework preference is ${framework}, but still output as a single self-contained HTML document.`
      : '';

    const userPrompt = `${prompt}${frameworkHint}`;

    // Create ZAI instance and generate
    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      thinking: { type: 'disabled' },
    });

    const responseContent = completion.choices[0]?.message?.content;

    if (!responseContent) {
      return NextResponse.json(
        { error: 'AI generation failed - no content returned' },
        { status: 500 }
      );
    }

    // Extract and parse the HTML content
    const fullHtml = extractHtmlFromResponse(responseContent);
    const css = extractCssFromHtml(fullHtml);
    const js = extractJsFromHtml(fullHtml);

    // Build structured response
    const result = {
      html: fullHtml,
      css,
      js,
      pages: [
        {
          name: 'Home',
          route: '/',
          html: fullHtml,
          css,
          js,
        },
      ],
      rawResponse: responseContent,
    };

    // Optionally create a project if userId is provided
    if (userId) {
      try {
        const project = await db.project.create({
          data: {
            name: `AI Generated: ${prompt.substring(0, 50)}`,
            description: prompt,
            prompt: prompt,
            framework: framework || 'html',
            userId,
            status: 'generated',
          },
        });

        await db.page.create({
          data: {
            name: 'Home',
            route: '/',
            html: fullHtml,
            css,
            js,
            projectId: project.id,
          },
        });

        // Create an initial version snapshot
        await db.version.create({
          data: {
            name: 'Initial AI Generation',
            snapshot: fullHtml,
            projectId: project.id,
          },
        });

        result.projectId = project.id;
      } catch (dbError) {
        console.error('Failed to create project from generation:', dbError);
        // Don't fail the whole request - still return the generated content
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Generate error:', error);
    return NextResponse.json(
      { error: 'Internal server error during AI generation' },
      { status: 500 }
    );
  }
}


