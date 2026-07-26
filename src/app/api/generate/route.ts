import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';
import { db } from '@/lib/db';

// ─── Types ────────────────────────────────────────────────────────────────

type Industry =
  | 'portfolio' | 'saas' | 'restaurant' | 'ecommerce'
  | 'blog' | 'agency' | 'event' | 'personal';

type StyleMode = 'light' | 'dark' | 'minimal' | 'bold';

interface GeneratePageRequest {
  prompt: string;
  industry?: Industry;
  style?: StyleMode;
  page: 'home' | 'about' | 'services' | 'contact';
  siteName?: string;
  brandColors?: { bg: string; surface: string; text: string; muted: string; accent: string; border: string };
  industryContext?: string;
}

// ─── In-memory job store (persists across hot reloads via globalThis) ──────

interface GenJob {
  id: string;
  status: 'pending' | 'generating' | 'done' | 'error';
  page: string;
  startedAt: number;
  updatedAt: number;
  heartbeats: number;
  result?: {
    page: { id: string; name: string; route: string; html: string; css: string; js: string };
    siteName: string;
    industry: string;
    style: string;
    projectId?: string;
  };
  error?: string;
}

const GLOBAL = globalThis as unknown as { __FORGE_GEN_JOBS__?: Map<string, GenJob> };
if (!GLOBAL.__FORGE_GEN_JOBS__) {
  GLOBAL.__FORGE_GEN_JOBS__ = new Map();
}
const JOBS = GLOBAL.__FORGE_GEN_JOBS__!;

// Cleanup old jobs (>30 min old) — avoids memory leak
function cleanupOldJobs() {
  const cutoff = Date.now() - 30 * 60 * 1000;
  for (const [id, job] of JOBS) {
    if (job.updatedAt < cutoff) JOBS.delete(id);
  }
}

function generateJobId(): string {
  return `job_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

// ─── Industry descriptors ─────────────────────────────────────────────────

const INDUSTRY_META: Record<Industry, { label: string; navItems: string[]; defaultSiteName: string; contentHint: string }> = {
  portfolio: {
    label: 'creative portfolio',
    navItems: ['Work', 'About', 'Process', 'Contact'],
    defaultSiteName: 'Studio',
    contentHint: 'Showcase creative work (design, photography, art). Include project gallery, brief bio, process explanation, and contact details.',
  },
  saas: {
    label: 'SaaS / startup product',
    navItems: ['Features', 'Pricing', 'About', 'Contact'],
    defaultSiteName: 'Forge',
    contentHint: 'Promote a software product. Include hero with CTA, feature grid, pricing tiers, social proof, and contact sales.',
  },
  restaurant: {
    label: 'restaurant / café',
    navItems: ['Menu', 'About', 'Reservations', 'Contact'],
    defaultSiteName: 'The Kitchen',
    contentHint: 'Promote a dining venue. Include menu sections (starters, mains, dessert), story/about, reservation form, hours and location.',
  },
  ecommerce: {
    label: 'e-commerce store',
    navItems: ['Shop', 'Collections', 'About', 'Contact'],
    defaultSiteName: 'Market',
    contentHint: 'Sell products online. Include product grid with prices, featured collections, brand story, and contact/shipping info.',
  },
  blog: {
    label: 'editorial blog',
    navItems: ['Articles', 'Topics', 'About', 'Contact'],
    defaultSiteName: 'Journal',
    contentHint: 'Publish written content. Include recent articles list, featured post, topic categories, about author, and newsletter signup.',
  },
  agency: {
    label: 'agency / studio',
    navItems: ['Services', 'Work', 'Team', 'Contact'],
    defaultSiteName: 'Agency',
    contentHint: 'Promote professional services. Include services list, case studies, team members, client logos, and contact form.',
  },
  event: {
    label: 'event / conference',
    navItems: ['Schedule', 'Speakers', 'Venue', 'Register'],
    defaultSiteName: 'Summit',
    contentHint: 'Promote an upcoming event. Include event schedule, speaker list, venue details, and registration form.',
  },
  personal: {
    label: 'personal / resume site',
    navItems: ['About', 'Experience', 'Projects', 'Contact'],
    defaultSiteName: 'Portfolio',
    contentHint: 'Showcase an individual. Include bio, work experience timeline, projects, skills, and contact info.',
  },
};

// ─── Style presets (consistent palette per style) ─────────────────────────

const STYLE_PRESETS: Record<StyleMode, { label: string; colors: { bg: string; surface: string; text: string; muted: string; accent: string; border: string }; fontStack: string; mood: string }> = {
  light: {
    label: 'light, airy, professional',
    colors: { bg: '#FFFFFF', surface: '#F8FAFC', text: '#0F172A', muted: '#64748B', accent: '#6366F1', border: '#E2E8F0' },
    fontStack: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    mood: 'clean, bright, with generous whitespace and subtle shadows',
  },
  dark: {
    label: 'dark, premium, sophisticated',
    colors: { bg: '#0A0A0F', surface: '#15151F', text: '#F8FAFC', muted: '#94A3B8', accent: '#A855F7', border: '#1E293B' },
    fontStack: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    mood: 'sophisticated dark theme with subtle gradients and elegant typography',
  },
  minimal: {
    label: 'minimalist, editorial, restrained',
    colors: { bg: '#FAFAF9', surface: '#FFFFFF', text: '#1C1917', muted: '#78716C', accent: '#1C1917', border: '#E7E5E4' },
    fontStack: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    mood: 'Swiss-style minimalism, heavy whitespace, single accent color, no gradients',
  },
  bold: {
    label: 'bold, expressive, vibrant',
    colors: { bg: '#FFFBEB', surface: '#FFFFFF', text: '#1F2937', muted: '#6B7280', accent: '#F59E0B', border: '#FCD34D' },
    fontStack: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    mood: 'expressive, with strong typography, vibrant accent colors, and confident layouts',
  },
};

// ─── Page definitions ─────────────────────────────────────────────────────

const PAGE_META: Record<GeneratePageRequest['page'], { name: string; route: string; purpose: string }> = {
  home: {
    name: 'Home',
    route: '/',
    purpose: 'The landing page. Must include: site header with logo + nav, a strong hero section with headline + subheadline + primary CTA, a features/services highlight section (3-6 items), a social proof or showcase section, and a footer with links and copyright. This is the most important page — make it complete and impressive.',
  },
  about: {
    name: 'About',
    route: '/about',
    purpose: 'The about page. Must include: site header, a story/mission section with 2-3 paragraphs of real copy, a values or timeline section, an optional team or founder section, and a footer. Use real, meaningful copy based on the brief — no lorem ipsum.',
  },
  services: {
    name: 'Services',
    route: '/services',
    purpose: 'The services / menu / pricing page (varies by industry). Must include: site header, the main content section (services list with descriptions, OR menu items with prices, OR pricing tiers), an optional FAQ or comparison section, and a footer. Use real, specific content based on the brief.',
  },
  contact: {
    name: 'Contact',
    route: '/contact',
    purpose: 'The contact page. Must include: site header, a contact form (name, email, message) with proper labels, contact information (email, phone, address), an optional map placeholder, social links, and a footer. Form should have visible submit button.',
  },
};

const PAGE_ORDER: GeneratePageRequest['page'][] = ['home', 'about', 'services', 'contact'];

// ─── HTML extraction helpers ──────────────────────────────────────────────

function extractHtmlFromResponse(content: string): string {
  if (!content) return '';
  const codeBlockMatch = content.match(/```(?:html)?\s*\n([\s\S]*?)```/i);
  if (codeBlockMatch) {
    return codeBlockMatch[1].trim();
  }
  const htmlStart = content.toLowerCase().indexOf('<!doctype');
  if (htmlStart !== -1) {
    const htmlEnd = content.toLowerCase().lastIndexOf('</html>');
    if (htmlEnd !== -1) {
      return content.substring(htmlStart, htmlEnd + '</html>'.length).trim();
    }
  }
  const htmlTagStart = content.toLowerCase().indexOf('<html');
  if (htmlTagStart !== -1) {
    const htmlEnd = content.toLowerCase().lastIndexOf('</html>');
    if (htmlEnd !== -1) {
      return content.substring(htmlTagStart, htmlEnd + '</html>'.length).trim();
    }
  }
  return content.trim();
}

function extractCssFromHtml(html: string): string {
  const match = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
  return match ? match[1].trim() : '';
}

function extractJsFromHtml(html: string): string {
  const matches = html.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
  if (!matches) return '';
  let js = '';
  for (const tag of matches) {
    if (tag.match(/<script[^>]*\bsrc=/i)) continue;
    const contentMatch = tag.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
    if (contentMatch) js += contentMatch[1] + '\n';
  }
  return js.trim();
}

function extractSiteNameFromPrompt(prompt: string, industry: Industry): string {
  const patterns = [
    /(?:called|named)\s+["']?([A-Z][\w&'-]+(?:\s+[A-Z][\w&'-]+)?)/,
    /for\s+(?:a|an|the)\s+(?:coffee shop|cafe|restaurant|studio|agency|brand|company|startup|business|shop|store)\s+(?:called|named)\s+["']?([A-Z][\w&'-]+)/,
  ];
  for (const p of patterns) {
    const m = prompt.match(p);
    if (m && m[1]) return m[1].trim();
  }
  const quoted = prompt.match(/["']([A-Z][\w\s&'-]{2,30})["']/);
  if (quoted && quoted[1]) return quoted[1].trim();
  return INDUSTRY_META[industry].defaultSiteName;
}

// ─── Prompt construction ──────────────────────────────────────────────────

function buildSystemPrompt(): string {
  return `You are Forge, an elite web designer and front-end engineer with 15+ years of experience. You generate production-quality, visually stunning, fully-responsive HTML websites.

CORE PRINCIPLES:
1. Output ONLY a single, complete, valid HTML5 document. No explanations, no markdown outside the HTML.
2. Embed ALL CSS in a single <style> tag in the <head>. No external CSS files.
3. Use semantic HTML5 elements: <header>, <nav>, <main>, <section>, <article>, <footer>, <aside>.
4. Mobile-first responsive design. Use CSS Grid and Flexbox. Test mentally at 375px, 768px, 1280px.
5. Use Google Fonts via <link> tags in <head>. Recommended: Inter, Playfair Display, JetBrains Mono.
6. Use real, meaningful, specific copy based on the brief — NEVER lorem ipsum, NEVER placeholder text.
7. Use https://images.unsplash.com/photo-XXXX format URLs for images (real Unsplash photo IDs), OR use pure CSS gradients/patterns/shapes for visuals.
8. Include subtle hover transitions (150-300ms ease) on all interactive elements.
9. Include subtle entrance animations using CSS @keyframes where appropriate (fade-in, slide-up).
10. WCAG 2.1 AA compliant: proper color contrast, alt text, semantic markup, keyboard-focusable elements.
11. The page must be COMPLETE — every section fully fleshed out with real content. No "TODO" or "coming soon" text.
12. Use CSS custom properties (variables) in :root for the color palette.
13. Include a consistent header with logo (text-based) + navigation, and a footer with copyright + links.
14. Do NOT use any JavaScript unless absolutely necessary (form validation, mobile menu toggle). If used, embed in a <script> tag at the end of <body>.
15. The HTML must be self-contained and render perfectly when opened directly in a browser.

OUTPUT FORMAT:
Return the HTML wrapped in a single \`\`\`html code fence. Start with <!DOCTYPE html>. End with </html>. No commentary before or after.`;
}

function buildPagePrompt(req: GeneratePageRequest): string {
  const meta = INDUSTRY_META[req.industry || 'portfolio'];
  const stylePreset = STYLE_PRESETS[req.style || 'dark'];
  const pageMeta = PAGE_META[req.page];
  const siteName = req.siteName || meta.defaultSiteName;
  const colors = req.brandColors || stylePreset.colors;

  const navLinks = meta.navItems.map((label, i) => {
    const route = PAGE_ORDER[i] ? PAGE_META[PAGE_ORDER[i]].route : '/';
    return `<a href="${route}">${label}</a>`;
  }).join('\n          ');

  const otherPagesBrief = PAGE_ORDER
    .filter(p => p !== req.page)
    .map(p => `${PAGE_META[p].name} (at ${PAGE_META[p].route})`)
    .join(', ');

  return `Generate the **${pageMeta.name}** page for a ${meta.label} website.

PROJECT BRIEF:
"${req.prompt}"

SITE INFORMATION:
- Site name: ${siteName}
- Industry: ${meta.label}
- Visual style: ${stylePreset.label}
- Mood: ${stylePreset.mood}
- Other pages in the site (for context, do NOT generate them): ${otherPagesBrief}

PAGE PURPOSE:
${pageMeta.purpose}

DESIGN SYSTEM (use these exact values via CSS custom properties in :root):
:root {
  --bg: ${colors.bg};
  --surface: ${colors.surface};
  --text: ${colors.text};
  --muted: ${colors.muted};
  --accent: ${colors.accent};
  --border: ${colors.border};
  --font-sans: ${stylePreset.fontStack};
}

NAVIGATION (use these links in the header):
          ${navLinks}

CONTENT GUIDANCE:
${meta.contentHint}

REQUIREMENTS:
- Return ONLY the complete ${pageMeta.name} page HTML, starting with <!DOCTYPE html>.
- Use the design system colors above. The accent color should be used sparingly for CTAs and highlights.
- The header navigation links should point to the routes shown above.
- Include a footer with site name, copyright "© 2026 ${siteName}", and 2-3 columns of links.
- Write specific, believable content based on the brief. Make up realistic details (names, prices, descriptions) where the brief is silent.
- The page should look polished and complete, as if designed by a senior designer.`;
}

// ─── Single-page generation with retry ────────────────────────────────────

const MAX_RETRIES = 4;

function sleep(ms: number) {
  return new Promise<void>(resolve => setTimeout(resolve, ms));
}

async function callGlmWithRetry(
  zai: Awaited<ReturnType<typeof ZAI.create>>,
  req: GeneratePageRequest,
  onTick: () => void
): Promise<string> {
  let lastError: any = null;
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      onTick();
      // Start a periodic tick during the long API call so the client
      // sees progress (otherwise the GLM call blocks for 60-150s with
      // no status updates). The tick resolves the underlying promise
      // race — the actual API call is what we await.
      const tickInterval = setInterval(onTick, 5000);
      try {
        const completion = await zai.chat.completions.create({
          model: 'glm-4.7',
          messages: [
            { role: 'system', content: buildSystemPrompt() },
            { role: 'user', content: buildPagePrompt(req) },
          ],
          thinking: { type: 'disabled' },
          temperature: 0.7,
          max_tokens: 8000,
        } as any);
        const content = completion.choices[0]?.message?.content || '';
        if (!content || content.length < 200) {
          throw new Error('AI returned empty or too-short content');
        }
        return content;
      } finally {
        clearInterval(tickInterval);
      }
    } catch (err: any) {
      lastError = err;
      const msg = String(err?.message || err);
      const is429 = msg.includes('429') || msg.includes('Too many requests') || msg.includes('rate');
      const is5xx = msg.includes('502') || msg.includes('503') || msg.includes('504') || msg.includes('500');
      if (is429 || is5xx) {
        const wait = 3000 * Math.pow(2, attempt);
        console.log(`[generate] ${req.page} attempt ${attempt + 1} failed (${msg.slice(0, 100)}), retrying in ${wait}ms`);
        const steps = Math.ceil(wait / 2000);
        for (let s = 0; s < steps; s++) {
          onTick();
          await sleep(2000);
        }
        continue;
      }
      throw err;
    }
  }
  throw lastError || new Error('AI generation failed after retries');
}

// ─── Background job runner ────────────────────────────────────────────────
//
// This is the KEY change: instead of holding the HTTP connection open for
// 60-150 seconds (which causes the preview-proxy to 502), we kick off the
// generation in the background, store progress in a global Map, and let
// the client poll for status with short (~2s) requests.

async function runGenerationJob(
  jobId: string,
  req: GeneratePageRequest,
  resolvedSiteName: string,
  userId?: string
) {
  const job = JOBS.get(jobId);
  if (!job) return;

  try {
    const zai = await ZAI.create();
    job.status = 'generating';
    job.updatedAt = Date.now();
    JOBS.set(jobId, job);

    const content = await callGlmWithRetry(zai, {
      prompt: req.prompt,
      industry: req.industry,
      style: req.style,
      page: req.page,
      siteName: resolvedSiteName,
      brandColors: STYLE_PRESETS[req.style || 'dark'].colors,
    }, () => {
      const j = JOBS.get(jobId);
      if (j) {
        j.heartbeats++;
        j.updatedAt = Date.now();
        JOBS.set(jobId, j);
      }
    });

    const html = extractHtmlFromResponse(content);
    if (!html || html.length < 200) {
      throw new Error(`AI returned empty or invalid HTML for ${req.page} page`);
    }
    const css = extractCssFromHtml(html);
    const js = extractJsFromHtml(html);
    const pageMeta = PAGE_META[req.page];

    let projectId: string | undefined;
    if (userId) {
      try {
        const project = await db.project.create({
          data: {
            name: `${resolvedSiteName} — ${pageMeta.name}`,
            description: req.prompt,
            prompt: req.prompt,
            framework: 'html',
            userId,
            status: 'generated',
            theme: req.style || 'dark',
          },
        });
        await db.page.create({
          data: {
            name: pageMeta.name,
            route: pageMeta.route,
            html, css, js,
            projectId: project.id,
          },
        });
        await db.version.create({
          data: {
            name: `Initial — ${pageMeta.name}`,
            snapshot: html,
            projectId: project.id,
          },
        });
        projectId = project.id;
      } catch (dbError) {
        console.error('[generate] DB persist failed:', dbError);
      }
    }

    const j = JOBS.get(jobId);
    if (j) {
      j.status = 'done';
      j.updatedAt = Date.now();
      j.result = {
        page: {
          id: `page-${req.page}`,
          name: pageMeta.name,
          route: pageMeta.route,
          html, css, js,
        },
        siteName: resolvedSiteName,
        industry: req.industry || 'portfolio',
        style: req.style || 'dark',
        projectId,
      };
      JOBS.set(jobId, j);
    }
  } catch (error: any) {
    console.error(`[generate] job ${jobId} failed:`, error);
    const j = JOBS.get(jobId);
    if (j) {
      j.status = 'error';
      j.updatedAt = Date.now();
      j.error = error?.message || 'AI generation failed';
      JOBS.set(jobId, j);
    }
  }
}

// ─── Route handlers ───────────────────────────────────────────────────────

// POST — kicks off a background generation job and returns the jobId immediately.
// The client then polls GET /api/generate?jobId=... every ~2s for status.
export async function POST(request: NextRequest) {
  try {
    cleanupOldJobs();

    const body = await request.json();
    const {
      prompt,
      industry = 'portfolio',
      style = 'dark',
      page,
      siteName,
    } = body as GeneratePageRequest;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'prompt is required' },
        { status: 400 }
      );
    }
    if (!page || !PAGE_META[page]) {
      return NextResponse.json(
        { error: 'page is required and must be one of: home, about, services, contact' },
        { status: 400 }
      );
    }

    const resolvedSiteName = siteName || extractSiteNameFromPrompt(prompt, industry);
    const userId = body.userId;

    // Create job
    const jobId = generateJobId();
    const job: GenJob = {
      id: jobId,
      status: 'pending',
      page,
      startedAt: Date.now(),
      updatedAt: Date.now(),
      heartbeats: 0,
    };
    JOBS.set(jobId, job);

    // Kick off generation in the background — do NOT await
    runGenerationJob(jobId, {
      prompt,
      industry,
      style,
      page,
      siteName: resolvedSiteName,
    }, resolvedSiteName, userId).catch(err => {
      console.error(`[generate] unhandled error in job ${jobId}:`, err);
      const j = JOBS.get(jobId);
      if (j) {
        j.status = 'error';
        j.error = String(err?.message || err);
        j.updatedAt = Date.now();
        JOBS.set(jobId, j);
      }
    });

    // Return immediately with the jobId — client will poll
    return NextResponse.json({ jobId, status: 'pending', page });
  } catch (error: any) {
    console.error('[generate] POST error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal error' },
      { status: 500 }
    );
  }
}

// GET — if ?jobId=X provided, return that job's status (and result if done).
// Otherwise, return metadata about supported industries/styles/pages.
export async function GET(request: NextRequest) {
  const jobId = request.nextUrl.searchParams.get('jobId');

  if (jobId) {
    cleanupOldJobs();
    const job = JOBS.get(jobId);
    if (!job) {
      return NextResponse.json(
        { error: 'Job not found (it may have expired after 30 minutes)' },
        { status: 404 }
      );
    }
    return NextResponse.json({
      jobId: job.id,
      status: job.status,
      page: job.page,
      startedAt: job.startedAt,
      updatedAt: job.updatedAt,
      heartbeats: job.heartbeats,
      elapsedMs: Date.now() - job.startedAt,
      error: job.error,
      result: job.result,
    });
  }

  // No jobId — return metadata
  return NextResponse.json({
    industries: Object.entries(INDUSTRY_META).map(([id, meta]) => ({
      id,
      label: meta.label,
      defaultSiteName: meta.defaultSiteName,
      navItems: meta.navItems,
    })),
    styles: Object.entries(STYLE_PRESETS).map(([id, s]) => ({
      id,
      label: s.label,
      mood: s.mood,
      colors: s.colors,
    })),
    pages: PAGE_ORDER.map(p => ({ id: p, name: PAGE_META[p].name, route: PAGE_META[p].route })),
  });
}
