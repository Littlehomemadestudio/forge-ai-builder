import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';
import { db } from '@/lib/db';

// ─── Types ────────────────────────────────────────────────────────────────

type Industry =
  | 'portfolio' | 'saas' | 'restaurant' | 'ecommerce'
  | 'blog' | 'agency' | 'event' | 'personal';

type StyleMode = 'light' | 'dark' | 'minimal' | 'bold';

type SiteLanguage = 'en' | 'fa' | 'de' | 'es' | 'fr' | 'ar';

interface ParsedPrompt {
  hexColors: string[];              // extracted hex codes (#0A0A0A, #6C63FF, #FF2D95)
  themeKeywords: string[];          // ['dark-neon', 'glassmorphism', 'parallax']
  requiredElements: string[];       // ['cart', 'search', 'login', 'slideshow', 'filter', 'timer']
  animations: string[];             // ['fade-in-up', 'ripple', 'shake', '360-rotate', 'count-up', 'skeleton']
  subIndustry?: string;             // 'carpet', 'digital', 'fashion', 'food', 'tech'
  isRtl: boolean;
  language: SiteLanguage;
  isSinglePage: boolean;            // user asked for "single-page" or "one-page"
  detectedBrandName?: string;
}

interface GeneratePageRequest {
  prompt: string;
  industry?: Industry;
  style?: StyleMode;
  page: 'home' | 'about' | 'services' | 'contact';
  siteName?: string;
  brandColors?: { bg: string; surface: string; text: string; muted: string; accent: string; border: string };
  industryContext?: string;
  language?: SiteLanguage;
  userId?: string;
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
// These are FALLBACKS only — if the user mentions specific hex codes in
// their text prompt, those override everything else.

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

// ─── PROMPT PARSER ─────────────────────────────────────────────────────────
// This is THE critical addition for Phase 1. The parser extracts structured
// info from the user's free-text prompt so we can drive the AI with explicit
// requirements instead of hoping it picks up on subtle cues.

function parseUserPrompt(prompt: string, language: SiteLanguage = 'en'): ParsedPrompt {
  const lower = prompt.toLowerCase();
  const result: ParsedPrompt = {
    hexColors: [],
    themeKeywords: [],
    requiredElements: [],
    animations: [],
    isRtl: language === 'fa' || language === 'ar',
    language,
    isSinglePage: false,
  };

  // 1. Extract hex colors (#RRGGBB)
  const hexMatches = prompt.match(/#[0-9A-Fa-f]{6}\b/g);
  if (hexMatches) {
    result.hexColors = Array.from(new Set(hexMatches.map(c => c.toUpperCase())));
  }

  // 2. Theme keywords
  const themeMap: Record<string, string[]> = {
    'dark-neon': ['dark-neon', 'dark neon', 'neon dark', 'نئون', 'دارک-نئونی', 'دارک نئونی'],
    'glassmorphism': ['glassmorphism', 'glass morphism', 'افکت شیشه‌ای', 'شیشه‌ای', 'glass effect'],
    'neumorphism': ['neumorphism', 'neu morphism'],
    'brutalist': ['brutalist', 'brutalism'],
    'retro': ['retro', 'vintage', 'رترو'],
    'cyberpunk': ['cyberpunk', 'cyber punk'],
    'minimal': ['minimal', 'minimalist', 'مینیمال'],
    'luxury': ['luxury', 'elegant', 'lux', 'لوکس'],
  };
  for (const [theme, keywords] of Object.entries(themeMap)) {
    if (keywords.some(k => lower.includes(k))) {
      result.themeKeywords.push(theme);
    }
  }

  // 3. Required elements
  const elementMap: Record<string, string[]> = {
    'cart': ['cart', 'سبد خرید', 'سبد', 'سبدخرید', 'shopping cart', 'add to cart', 'افزودن به سبد'],
    'search': ['search', 'جستجو', 'نوار جستجو', 'search bar', 'search input'],
    'login': ['login', 'sign in', 'ورود', 'ثبت‌نام', 'ثبت نام', 'login/register', 'ورود/ثبت‌نام'],
    'slideshow': ['slideshow', 'slider', 'carousel', 'اسلایدشو', 'اسلایدر', 'carousel', 'full-screen slideshow', 'اسلایدشو تمام‌صفحه'],
    'product-cards': ['product card', 'محصول', 'کارت محصول', 'product grid', 'products', 'کارت‌های محصول'],
    'filter': ['filter', 'فیلتر', 'side filter', 'فیلترهای جانبی', 'filter sidebar'],
    'price-slider': ['price slider', 'محدوده قیمت', 'price range', 'اسلایدر قیمت'],
    'countdown-timer': ['countdown', 'timer', 'شمارش معکوس', 'تایمر', 'تایمر شمارش معکوس'],
    'reviews-carousel': ['reviews carousel', 'نظرات مشتریان', 'customer reviews', 'testimonials carousel', 'کاروسل نظرات'],
    'newsletter': ['newsletter', 'خبرنامه', 'email signup', 'subscribe'],
    'social-icons': ['social media', 'social icons', 'شبکه‌های اجتماعی', 'social links'],
    'sticky-header': ['sticky header', 'هدر چسبان', 'fixed header', 'هدر ثابت'],
    'hamburger-menu': ['hamburger', 'همبرگری', 'mobile menu', 'منوی همبرگری'],
    'category-menu': ['category menu', 'منوی دسته‌بندی', 'categories menu', 'دسته‌بندی'],
    'discount-badge': ['discount badge', 'تخفیف', 'برچسب تخفیف', 'special offer', 'تخفیف ویژه'],
    'star-rating': ['star rating', 'امتیاز ستاره‌ای', 'stars', 'rating'],
    'product-zoom': ['zoom', 'زوم', 'image zoom', 'zoom on hover'],
    'count-up': ['count up', 'شمارنده افزایشی', 'animated counter', 'count animation'],
    'skeleton-loader': ['skeleton', 'skeleton loader', 'اسکلتون'],
    'parallax': ['parallax', 'پارالاکس', 'parallax effect'],
    '360-rotate': ['360 rotation', 'چرخش ۳۶۰', '360 rotate', 'rotate 360'],
    'shake-animation': ['shake', 'تکان', 'shake animation'],
    'ripple-effect': ['ripple', 'موج', 'ripple effect'],
    'fade-in-up': ['fade-in-up', 'fade in up', 'fade-in', 'فید-این'],
    'float-animation': ['float', 'شناور', 'floating animation', 'float animation'],
  };
  for (const [element, keywords] of Object.entries(elementMap)) {
    if (keywords.some(k => lower.includes(k))) {
      // Sort into animations vs elements
      if (['parallax', '360-rotate', 'shake-animation', 'ripple-effect', 'fade-in-up', 'float-animation', 'skeleton-loader', 'count-up'].includes(element)) {
        result.animations.push(element);
      } else {
        result.requiredElements.push(element);
      }
    }
  }

  // 4. Sub-industry detection
  const subIndustryMap: Record<string, string[]> = {
    'carpet': ['carpet', 'rug', 'فرش', 'قالی', 'گلیم', 'carpet store', 'rug store'],
    'fashion': ['fashion', 'clothing', 'پوشاک', 'لباس', 'apparel', 'clothes', 'boutique'],
    'digital': ['digital', 'electronic', 'دیجیتال', 'الکترونیک', 'gadget', 'tech store'],
    'food': ['food', 'غذا', 'restaurant', 'cafe', 'coffee', 'قهوه', 'غذای'],
    'beauty': ['beauty', 'cosmetics', 'آرایشی', 'زیبایی', 'makeup', 'skincare'],
    'home': ['home goods', 'لوازم خانگی', 'furniture', 'مبل', 'decor', 'دکوراسیون'],
    'jewelry': ['jewelry', 'جواهر', 'gold', 'طلا', 'silver', 'نقره'],
    'books': ['book', 'کتاب', 'bookstore', 'کتابفروشی'],
    'sports': ['sport', 'ورزشی', 'fitness', 'تمرین', 'gym'],
  };
  for (const [sub, keywords] of Object.entries(subIndustryMap)) {
    if (keywords.some(k => lower.includes(k))) {
      result.subIndustry = sub;
      break;
    }
  }

  // 5. Single-page detection
  if (lower.includes('single-page') || lower.includes('one-page') || lower.includes('تک‌صفحه') || lower.includes('تک صفحه') || lower.includes('یک صفحه‌ای')) {
    result.isSinglePage = true;
  }

  // 6. Brand name detection (look for "called X" or quoted names)
  result.detectedBrandName = extractSiteNameFromPrompt(prompt, 'portfolio');
  if (result.detectedBrandName === 'Studio') {
    result.detectedBrandName = undefined;
  }

  return result;
}

// ─── Color override: use user's hex codes if they provided them ────────────
// Maps the user's mentioned hex colors to the CSS variables.

function applyUserColors(
  baseColors: { bg: string; surface: string; text: string; muted: string; accent: string; border: string },
  parsed: ParsedPrompt
): { bg: string; surface: string; text: string; muted: string; accent: string; border: string; neonPink?: string } {
  if (parsed.hexColors.length === 0) return baseColors;

  // Heuristic: if 3 colors mentioned, treat them as bg, accent-primary, accent-secondary
  // If 2: bg + accent
  // If 1: just accent
  const colors = { ...baseColors };
  const extra: { neonPink?: string } = {};

  if (parsed.hexColors.length >= 3) {
    colors.bg = parsed.hexColors[0];
    colors.accent = parsed.hexColors[1];
    extra.neonPink = parsed.hexColors[2];
    // Derive surface (slightly lighter than bg)
    colors.surface = lightenColor(parsed.hexColors[0], 8);
    // Derive text (high contrast with bg)
    colors.text = isLightColor(parsed.hexColors[0]) ? '#0F172A' : '#F8FAFC';
    colors.muted = isLightColor(parsed.hexColors[0]) ? '#64748B' : '#94A3B8';
    colors.border = lightenColor(parsed.hexColors[0], 16);
  } else if (parsed.hexColors.length === 2) {
    colors.bg = parsed.hexColors[0];
    colors.accent = parsed.hexColors[1];
    colors.surface = lightenColor(parsed.hexColors[0], 8);
    colors.text = isLightColor(parsed.hexColors[0]) ? '#0F172A' : '#F8FAFC';
    colors.muted = isLightColor(parsed.hexColors[0]) ? '#64748B' : '#94A3B8';
    colors.border = lightenColor(parsed.hexColors[0], 16);
  } else {
    colors.accent = parsed.hexColors[0];
  }

  return { ...colors, ...extra };
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

function lightenColor(hex: string, percent: number): string {
  const [r, g, b] = hexToRgb(hex);
  const factor = percent / 100;
  const nr = Math.min(255, Math.round(r + (255 - r) * factor));
  const ng = Math.min(255, Math.round(g + (255 - g) * factor));
  const nb = Math.min(255, Math.round(b + (255 - b) * factor));
  return '#' + [nr, ng, nb].map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase();
}

function isLightColor(hex: string): boolean {
  const [r, g, b] = hexToRgb(hex);
  // Perceived luminance
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.5;
}

// ─── Industry sub-context: styling cues for sub-industries ────────────────

const SUB_INDUSTRY_CUES: Record<string, {
  label: string;
  fontPairing: string;       // heading + body font suggestion
  imageryKeywords: string[]; // Unsplash search keywords
  paletteHint: string;       // description of appropriate color palette
  patternHint?: string;      // CSS pattern suggestion
  sampleProducts?: string[]; // sample product names for content
}> = {
  carpet: {
    label: 'traditional Persian carpet & rug store',
    fontPairing: "'Playfair Display' for headings (serif elegance), 'Inter' for body",
    imageryKeywords: ['persian carpet', 'oriental rug', 'traditional carpet', 'handwoven rug', 'carpet weaving'],
    paletteHint: 'warm earth tones — deep red (#8B1A1A), gold (#C5A059), cream (#F5E6C8), dark brown (#3D2817). Avoid cool blues.',
    patternHint: 'subtle Persian arabesque pattern as background decoration (use SVG or CSS geometric pattern)',
    sampleProducts: ['Tabriz Silk Rug 3x5', 'Isfahan Wool Carpet 4x6', 'Qashqai Tribal Rug 2x3', 'Kashan Medallion Rug 5x7', 'Heriz Geometric Rug 6x9'],
  },
  fashion: {
    label: 'fashion & clothing boutique',
    fontPairing: "'Playfair Display' or 'Cormorant Garamond' for headings, 'Inter' for body",
    imageryKeywords: ['fashion model', 'clothing rack', 'boutique store', 'fashion accessories', 'street style'],
    paletteHint: 'monochrome with one accent — black, white, beige, with bold accent (red or gold)',
    sampleProducts: ['Linen Summer Dress', 'Wool Blend Coat', 'Silk Blouse', 'Tailored Trousers', 'Cashmere Sweater'],
  },
  digital: {
    label: 'digital & electronics store',
    fontPairing: "'Inter' for headings (modern, clean), 'JetBrains Mono' for prices/specs",
    imageryKeywords: ['smartphone', 'laptop', 'headphones', 'tech gadgets', 'electronics'],
    paletteHint: 'cool modern — dark navy, electric blue, neon green accents',
    sampleProducts: ['Wireless Earbuds Pro', '4K Action Camera', 'Smart Watch Series 7', 'Mechanical Keyboard', 'Portable SSD 1TB'],
  },
  food: {
    label: 'food & beverage',
    fontPairing: "'Playfair Display' for headings, 'Inter' for body",
    imageryKeywords: ['food photography', 'coffee', 'restaurant interior', 'gourmet dish', 'barista'],
    paletteHint: 'warm appetizing — terracotta, cream, deep green',
    sampleProducts: ['Single Origin Ethiopia 250g', 'Ceramic Pour-Over Set', 'Espresso Blend 1kg', 'Cold Brew Bottle', 'Coffee Subscription'],
  },
  beauty: {
    label: 'beauty & cosmetics',
    fontPairing: "'Cormorant Garamond' for headings (elegant), 'Inter' for body",
    imageryKeywords: ['cosmetics', 'skincare product', 'makeup', 'beauty', 'perfume bottle'],
    paletteHint: 'soft pastels — blush pink, cream, rose gold',
    sampleProducts: ['Vitamin C Serum', 'Hydrating Moisturizer', 'Matte Lipstick', 'Eyeshadow Palette', 'Rose Water Toner'],
  },
  home: {
    label: 'home goods & furniture',
    fontPairing: "'Inter' for headings (clean), 'Inter' for body",
    imageryKeywords: ['home decor', 'furniture', 'interior design', 'ceramic vase', 'minimalist home'],
    paletteHint: 'natural warm — wood tones, sage green, cream, terracotta',
    sampleProducts: ['Handmade Ceramic Vase', 'Oak Wood Bowl', 'Linen Throw Pillow', 'Brass Candle Holder', 'Wool Area Rug'],
  },
  jewelry: {
    label: 'jewelry & luxury accessories',
    fontPairing: "'Cormorant Garamond' or 'Playfair Display' for headings, 'Inter' for body",
    imageryKeywords: ['jewelry', 'gold necklace', 'diamond ring', 'luxury watch', 'gemstone'],
    paletteHint: 'luxury — black, gold (#D4AF37), cream, with deep jewel tones',
    sampleProducts: ['18K Gold Necklace', 'Diamond Solitaire Ring', 'Pearl Earrings', 'Silver Bracelet', 'Emerald Pendant'],
  },
  books: {
    label: 'books & publishing',
    fontPairing: "'Playfair Display' for headings (literary), 'Inter' for body",
    imageryKeywords: ['books', 'bookstore', 'reading', 'library', 'book cover'],
    paletteHint: 'scholarly warm — burgundy, cream, dark brown, gold',
    sampleProducts: ['The Art of Programming', 'Modern Persian Poetry', 'History of Architecture', 'Cookbook: Persian Cuisine', 'Philosophy Essentials'],
  },
  sports: {
    label: 'sports & fitness',
    fontPairing: "'Inter' for headings (bold, modern), 'Inter' for body",
    imageryKeywords: ['fitness', 'gym equipment', 'athletic wear', 'running shoes', 'yoga'],
    paletteHint: 'energetic — black, neon green, electric blue',
    sampleProducts: ['Running Shoes Pro', 'Yoga Mat Premium', 'Adjustable Dumbbells', 'Resistance Band Set', 'Smart Fitness Tracker'],
  },
};

// ─── Language → font mapping for generated sites ──────────────────────────

const LANGUAGE_FONTS: Record<SiteLanguage, { heading: string; body: string; isRtl: boolean; dir: string }> = {
  en: { heading: "'Inter', sans-serif", body: "'Inter', sans-serif", isRtl: false, dir: 'ltr' },
  fa: { heading: "'Vazirmatn', sans-serif", body: "'Vazirmatn', sans-serif", isRtl: true, dir: 'rtl' },
  ar: { heading: "'Vazirmatn', sans-serif", body: "'Vazirmatn', sans-serif", isRtl: true, dir: 'rtl' },
  de: { heading: "'Inter', sans-serif", body: "'Inter', sans-serif", isRtl: false, dir: 'ltr' },
  es: { heading: "'Inter', sans-serif", body: "'Inter', sans-serif", isRtl: false, dir: 'ltr' },
  fr: { heading: "'Inter', sans-serif", body: "'Inter', sans-serif", isRtl: false, dir: 'ltr' },
};

const LANGUAGE_GOOGLE_FONTS: Record<SiteLanguage, string> = {
  en: 'Inter',
  fa: 'Vazirmatn',
  ar: 'Vazirmatn',
  de: 'Inter',
  es: 'Inter',
  fr: 'Inter',
};

// ─── System prompt: STRICT mode ────────────────────────────────────────────
// The new system prompt enforces STRICT adherence to user's text prompt.
// Every element, color, and animation mentioned MUST be implemented.

function buildSystemPrompt(): string {
  return `You are Forge, an elite web designer and front-end engineer with 15+ years of experience. You generate production-quality, visually stunning, fully-responsive HTML websites.

═══ CORE PRINCIPLES ═══════════════════════════════════════════════════════
1. Output ONLY a single, complete, valid HTML5 document. No explanations, no markdown outside the HTML.
2. Embed ALL CSS in a single <style> tag in the <head>. No external CSS files.
3. Use semantic HTML5: <header>, <nav>, <main>, <section>, <article>, <footer>, <aside>.
4. Mobile-first responsive design. Use CSS Grid and Flexbox. Test mentally at 375px, 768px, 1280px.
5. Use Google Fonts via <link> tags in <head>.
6. Use real, meaningful, specific copy based on the brief — NEVER lorem ipsum, NEVER placeholder text.
7. Use https://images.unsplash.com/photo-XXXX format URLs for images (real Unsplash photo IDs from the list provided), OR pure CSS gradients/patterns/shapes for visuals.
8. WCAG 2.1 AA compliant: proper color contrast, alt text, semantic markup, keyboard-focusable.
9. The page must be COMPLETE — every section fully fleshed out with real content. No "TODO", no "coming soon".
10. Use CSS custom properties (variables) in :root for the color palette.
11. The HTML must be self-contained and render perfectly when opened directly in a browser.
12. JavaScript allowed for: form validation, mobile menu toggle, slideshow, cart counter, countdown timer, filter toggling. Embed in a <script> at end of <body>.

═══ STRICT PROMPT ADHERENCE (CRITICAL) ═════════════════════════════════════
You MUST follow EVERY instruction in the user's brief. Do NOT substitute, simplify, or skip anything.

• COLORS: If the brief specifies hex color codes (e.g., #0A0A0A, #6C63FF, #FF2D95), you MUST use those EXACT codes in the CSS. Do not "interpret" or "approximate" them. If the brief says "black matte background with neon-pink buttons", the background is #0A0A0A (or whatever was specified) and buttons are #FF2D95.

• THEME: If the brief says "dark-neon theme", the page MUST be dark (black/matte background, light text, glowing neon accents). Do NOT default to a light theme because it's "easier" — follow the brief.

• ELEMENTS: If the brief lists required elements (header with cart, search, login; slideshow; product cards; filters; countdown; reviews carousel; newsletter footer), you MUST implement ALL of them. Each element must be FULLY functional with real content. Skipping any element is a critical failure.

• ANIMATIONS: If the brief mentions specific animations (glassmorphism, parallax, skeleton, 360-rotation, shake, ripple, fade-in-up, count-up), you MUST implement each one. Use CSS @keyframes for most, JS only when needed.

• INDUSTRY: If the brief specifies an industry sub-context (e.g., "we sell carpets"), use imagery, copy, and styling appropriate to that sub-industry. Do not use generic imagery.

═══ HEADER / FOOTER CONSISTENCY ═════════════════════════════════════════════
The HEADER and FOOTER HTML will be provided to you VERBATIM. You MUST include them EXACTLY as given, character-for-character. Do NOT modify them, do NOT "improve" them, do NOT add/remove elements. The same header and footer will appear on every page of the site so navigation feels consistent.

═══ OUTPUT FORMAT ═══════════════════════════════════════════════════════════
Return the HTML wrapped in a single \`\`\`html code fence. Start with <!DOCTYPE html>. End with </html>. No commentary before or after.`;
}

// ─── Build the SHARED header/footer HTML (server-controlled, deterministic) ─
// This is generated ONCE per site (based on industry + parsed prompt) and
// reused on every page. This guarantees header/footer consistency.

function buildSharedHeaderFooter(
  industry: Industry,
  siteName: string,
  navItems: string[],
  colors: { bg: string; surface: string; text: string; muted: string; accent: string; border: string; neonPink?: string },
  parsed: ParsedPrompt,
  language: SiteLanguage
): { headerHtml: string; footerHtml: string; cssForHeaderFooter: string } {
  const isRtl = LANGUAGE_FONTS[language].isRtl;
  const dir = LANGUAGE_FONTS[language].dir;
  const fontBody = LANGUAGE_FONTS[language].body;
  const fontHeading = LANGUAGE_FONTS[language].heading;
  const neonPink = (colors as any).neonPink || colors.accent;

  const isEcommerce = industry === 'ecommerce' || parsed.requiredElements.includes('cart');
  const needsSearch = parsed.requiredElements.includes('search') || isEcommerce;
  const needsLogin = parsed.requiredElements.includes('login') || isEcommerce;
  const needsCart = parsed.requiredElements.includes('cart') || isEcommerce;
  const needsSticky = parsed.requiredElements.includes('sticky-header') || true; // sticky by default
  const needsGlassmorphism = parsed.themeKeywords.includes('glassmorphism') || parsed.animations.includes('parallax');

  // Nav links
  const navLinksHtml = navItems.map((label, i) => {
    const route = PAGE_ORDER[i] ? PAGE_META[PAGE_ORDER[i]].route : '/';
    return `<a href="${route}" class="nav-link">${label}</a>`;
  }).join('\n              ');

  // Header inner content
  let headerExtras = '';
  if (needsSearch) {
    headerExtras += `
              <div class="header-search">
                <input type="search" placeholder="${language === 'fa' ? 'جستجو...' : 'Search...'}" aria-label="Search" />
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>`;
  }
  if (needsCart) {
    const cartLabel = language === 'fa' ? 'سبد خرید' : 'Cart';
    headerExtras += `
              <button class="header-cart" aria-label="${cartLabel}" data-cart-count="0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                <span class="cart-count">0</span>
              </button>`;
  }
  if (needsLogin) {
    const loginLabel = language === 'fa' ? 'ورود' : 'Login';
    const signupLabel = language === 'fa' ? 'ثبت‌نام' : 'Sign Up';
    headerExtras += `
              <div class="header-auth">
                <a href="#" class="auth-login">${loginLabel}</a>
                <a href="#" class="auth-signup">${signupLabel}</a>
              </div>`;
  }

  const headerHtml = `<header class="site-header${needsSticky ? ' sticky' : ''}${needsGlassmorphism ? ' glass' : ''}" role="banner">
          <div class="header-inner">
            <a href="/" class="site-logo" aria-label="${siteName} home">
              <span class="logo-mark" aria-hidden="true">${siteName.charAt(0)}</span>
              <span class="logo-text">${siteName}</span>
            </a>
            <nav class="site-nav" role="navigation" aria-label="Main">
              ${navLinksHtml}
            </nav>
            <div class="header-actions">
              ${headerExtras}
              <button class="header-menu-toggle" aria-label="Menu" aria-expanded="false">
                <span></span><span></span><span></span>
              </button>
            </div>
          </div>
        </header>`;

  // Footer columns
  const aboutText = language === 'fa'
    ? `${siteName} با هدف ارائه بهترین محصولات و خدمات به مشتریان عزیز، تلاش می‌کند تجربه‌ای متفاوت و لذت‌بخش برای شما رقم بزند.`
    : `${siteName} is dedicated to bringing you the finest products and exceptional service. We believe in quality, craftsmanship, and customer satisfaction.`;

  const quickLinksTitle = language === 'fa' ? 'لینک‌های سریع' : 'Quick Links';
  const socialTitle = language === 'fa' ? 'شبکه‌های اجتماعی' : 'Connect';
  const newsletterTitle = language === 'fa' ? 'خبرنامه' : 'Newsletter';
  const newsletterPlaceholder = language === 'fa' ? 'ایمیل شما' : 'Your email';
  const subscribeLabel = language === 'fa' ? 'عضویت' : 'Subscribe';
  const newsletterDesc = language === 'fa'
    ? 'برای دریافت آخرین اخبار و تخفیف‌ها عضو شوید.'
    : 'Get the latest updates and exclusive offers.';

  const quickLinksHtml = navItems.map((label, i) => {
    const route = PAGE_ORDER[i] ? PAGE_META[PAGE_ORDER[i]].route : '/';
    return `<li><a href="${route}">${label}</a></li>`;
  }).join('\n                ');

  const year = new Date().getFullYear();
  const copyrightText = language === 'fa'
    ? `© ${year} ${siteName}. تمامی حقوق محفوظ است.`
    : `© ${year} ${siteName}. All rights reserved.`;

  const footerHtml = `<footer class="site-footer" role="contentinfo">
          <div class="footer-inner">
            <div class="footer-col footer-about">
              <h3 class="footer-heading">${siteName}</h3>
              <p>${aboutText}</p>
            </div>
            <div class="footer-col footer-links">
              <h4 class="footer-heading">${quickLinksTitle}</h4>
              <ul>
                ${quickLinksHtml}
              </ul>
            </div>
            <div class="footer-col footer-social">
              <h4 class="footer-heading">${socialTitle}</h4>
              <div class="social-icons">
                <a href="#" aria-label="Twitter" class="social-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22 5.8a8.49 8.49 0 0 1-2.36.64 4.13 4.13 0 0 0 1.81-2.27 8.21 8.21 0 0 1-2.61 1 4.1 4.1 0 0 0-7 3.74 11.64 11.64 0 0 1-8.45-4.29 4.16 4.16 0 0 0-.55 2.07 4.09 4.09 0 0 0 1.82 3.41 4.05 4.05 0 0 1-1.86-.51v.05a4.1 4.1 0 0 0 3.3 4 4.1 4.1 0 0 1-1.86.07 4.11 4.11 0 0 0 3.83 2.84A8.22 8.22 0 0 1 3 18.34a11.59 11.59 0 0 0 6.29 1.85A11.59 11.59 0 0 0 21 8.45v-.53a8.43 8.43 0 0 0 2-2.12Z"/></svg>
                </a>
                <a href="#" aria-label="Instagram" class="social-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </a>
                <a href="#" aria-label="Facebook" class="social-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z"/></svg>
                </a>
                <a href="#" aria-label="YouTube" class="social-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23 12s0-3.78-.48-5.59a3 3 0 0 0-2.12-2.12C18.59 3.81 12 3.81 12 3.81s-6.59 0-8.4.48A3 3 0 0 0 1.48 6.41C1 8.22 1 12 1 12s0 3.78.48 5.59a3 3 0 0 0 2.12 2.12c1.81.48 8.4.48 8.4.48s6.59 0 8.4-.48a3 3 0 0 0 2.12-2.12C23 15.78 23 12 23 12ZM9.75 15.02V8.98L15.5 12Z"/></svg>
                </a>
              </div>
            </div>
            <div class="footer-col footer-newsletter">
              <h4 class="footer-heading">${newsletterTitle}</h4>
              <p>${newsletterDesc}</p>
              <form class="newsletter-form" onsubmit="return false;">
                <input type="email" placeholder="${newsletterPlaceholder}" aria-label="${newsletterPlaceholder}" required />
                <button type="submit">${subscribeLabel}</button>
              </form>
            </div>
          </div>
          <div class="footer-bottom">
            <p>${copyrightText}</p>
          </div>
        </footer>`;

  // CSS for header & footer (also reused verbatim on every page)
  const cssForHeaderFooter = `
  /* ─── Shared Header (consistent across all pages) ─── */
  .site-header {
    position: relative;
    z-index: 50;
    background: ${colors.bg};
    border-bottom: 1px solid ${colors.border};
    width: 100%;
  }
  .site-header.sticky {
    position: sticky;
    top: 0;
  }
  .site-header.glass {
    background: ${isLightColor(colors.bg) ? 'rgba(255,255,255,0.7)' : 'rgba(10,10,15,0.7)'};
    backdrop-filter: blur(12px) saturate(180%);
    -webkit-backdrop-filter: blur(12px) saturate(180%);
  }
  .header-inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 1rem 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
  }
  .site-logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    color: ${colors.text};
    font-family: ${fontHeading};
    font-weight: 700;
    font-size: 1.25rem;
    letter-spacing: -0.02em;
  }
  .logo-mark {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: ${colors.accent};
    color: ${isLightColor(colors.accent) ? '#0F172A' : '#FFFFFF'};
    border-radius: 8px;
    font-weight: 800;
    font-size: 1rem;
  }
  .site-nav {
    display: flex;
    gap: 1.75rem;
    align-items: center;
  }
  .nav-link {
    color: ${colors.muted};
    text-decoration: none;
    font-size: 0.95rem;
    font-weight: 500;
    transition: color 200ms ease;
    position: relative;
  }
  .nav-link:hover {
    color: ${colors.text};
  }
  .nav-link::after {
    content: '';
    position: absolute;
    bottom: -6px;
    left: 0;
    width: 0;
    height: 2px;
    background: ${colors.accent};
    transition: width 200ms ease;
  }
  .nav-link:hover::after {
    width: 100%;
  }
  .header-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  .header-search {
    position: relative;
    display: flex;
    align-items: center;
  }
  .header-search input {
    background: ${colors.surface};
    border: 1px solid ${colors.border};
    color: ${colors.text};
    padding: 0.5rem 2.5rem 0.5rem 1rem;
    border-radius: 999px;
    font-size: 0.875rem;
    width: 200px;
    transition: border-color 200ms ease, width 200ms ease;
    font-family: ${fontBody};
  }
  .header-search input:focus {
    outline: none;
    border-color: ${colors.accent};
    width: 240px;
  }
  .header-search svg {
    position: absolute;
    right: 0.85rem;
    color: ${colors.muted};
    pointer-events: none;
  }
  .header-cart {
    position: relative;
    background: none;
    border: none;
    color: ${colors.text};
    cursor: pointer;
    padding: 0.5rem;
    transition: transform 200ms ease;
  }
  .header-cart:hover { transform: scale(1.1); }
  .header-cart.shake { animation: cart-shake 400ms ease; }
  @keyframes cart-shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-4px) rotate(-5deg); }
    40% { transform: translateX(4px) rotate(5deg); }
    60% { transform: translateX(-3px) rotate(-3deg); }
    80% { transform: translateX(3px) rotate(3deg); }
  }
  .cart-count {
    position: absolute;
    top: 0;
    right: 0;
    background: ${neonPink};
    color: ${isLightColor(neonPink) ? '#0F172A' : '#FFFFFF'};
    font-size: 0.7rem;
    font-weight: 700;
    min-width: 18px;
    height: 18px;
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 5px;
    transform: scale(0);
    transition: transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .cart-count.visible { transform: scale(1); }
  .header-auth {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }
  .auth-login, .auth-signup {
    color: ${colors.text};
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    transition: background 200ms ease;
  }
  .auth-login:hover { background: ${colors.surface}; }
  .auth-signup {
    background: ${colors.accent};
    color: ${isLightColor(colors.accent) ? '#0F172A' : '#FFFFFF'};
  }
  .auth-signup:hover { opacity: 0.9; }
  .header-menu-toggle {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    flex-direction: column;
    gap: 4px;
    padding: 0.5rem;
  }
  .header-menu-toggle span {
    width: 24px;
    height: 2px;
    background: ${colors.text};
    transition: transform 200ms ease, opacity 200ms ease;
  }

  /* ─── Shared Footer (consistent across all pages) ─── */
  .site-footer {
    background: ${isLightColor(colors.bg) ? darkenColor(colors.bg, 4) : colors.bg};
    border-top: 1px solid ${colors.border};
    padding: 4rem 1.5rem 2rem;
    margin-top: auto;
  }
  .footer-inner {
    max-width: 1280px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1.5fr;
    gap: 3rem;
  }
  .footer-heading {
    font-family: ${fontHeading};
    color: ${colors.text};
    font-size: 1.125rem;
    font-weight: 700;
    margin-bottom: 1rem;
    letter-spacing: -0.01em;
  }
  .footer-col p {
    color: ${colors.muted};
    font-size: 0.9rem;
    line-height: 1.6;
  }
  .footer-col ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .footer-col ul li {
    margin-bottom: 0.5rem;
  }
  .footer-col ul li a {
    color: ${colors.muted};
    text-decoration: none;
    font-size: 0.9rem;
    transition: color 200ms ease;
  }
  .footer-col ul li a:hover { color: ${colors.accent}; }
  .social-icons {
    display: flex;
    gap: 0.75rem;
  }
  .social-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: ${colors.surface};
    color: ${colors.muted};
    transition: all 200ms ease;
  }
  .social-icon:hover {
    background: ${colors.accent};
    color: ${isLightColor(colors.accent) ? '#0F172A' : '#FFFFFF'};
    transform: translateY(-2px);
  }
  .newsletter-form {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.75rem;
  }
  .newsletter-form input {
    flex: 1;
    background: ${colors.surface};
    border: 1px solid ${colors.border};
    color: ${colors.text};
    padding: 0.625rem 0.875rem;
    border-radius: 8px;
    font-size: 0.875rem;
    font-family: ${fontBody};
  }
  .newsletter-form input:focus {
    outline: none;
    border-color: ${colors.accent};
  }
  .newsletter-form button {
    background: ${colors.accent};
    color: ${isLightColor(colors.accent) ? '#0F172A' : '#FFFFFF'};
    border: none;
    padding: 0.625rem 1.25rem;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.875rem;
    cursor: pointer;
    transition: opacity 200ms ease;
    font-family: ${fontBody};
  }
  .newsletter-form button:hover { opacity: 0.9; }
  .footer-bottom {
    max-width: 1280px;
    margin: 2rem auto 0;
    padding-top: 2rem;
    border-top: 1px solid ${colors.border};
    text-align: center;
  }
  .footer-bottom p {
    color: ${colors.muted};
    font-size: 0.85rem;
  }

  /* RTL adjustments */
  [dir="rtl"] .header-search svg { right: auto; left: 0.85rem; }
  [dir="rtl"] .header-search input { padding: 0.5rem 1rem 0.5rem 2.5rem; }
  [dir="rtl"] .cart-count { right: auto; left: 0; }

  /* Mobile responsive */
  @media (max-width: 768px) {
    .header-inner { flex-wrap: wrap; gap: 0.75rem; }
    .site-nav {
      display: none;
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: ${colors.bg};
      border-bottom: 1px solid ${colors.border};
      flex-direction: column;
      padding: 1rem 1.5rem;
      gap: 1rem;
    }
    .site-nav.open { display: flex; }
    .header-search { display: none; }
    .header-menu-toggle { display: flex; }
    .footer-inner { grid-template-columns: 1fr; gap: 2rem; }
  }
`;

  return { headerHtml, footerHtml, cssForHeaderFooter };
}

function darkenColor(hex: string, percent: number): string {
  const [r, g, b] = hexToRgb(hex);
  const factor = percent / 100;
  const nr = Math.max(0, Math.round(r * (1 - factor)));
  const ng = Math.max(0, Math.round(g * (1 - factor)));
  const nb = Math.max(0, Math.round(b * (1 - factor)));
  return '#' + [nr, ng, nb].map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase();
}

// ─── Build page-specific prompt with parsed spec + shared header/footer ────

function buildPagePrompt(
  req: GeneratePageRequest,
  parsed: ParsedPrompt,
  colors: { bg: string; surface: string; text: string; muted: string; accent: string; border: string; neonPink?: string },
  headerFooter: { headerHtml: string; footerHtml: string; cssForHeaderFooter: string }
): string {
  const meta = INDUSTRY_META[req.industry || 'portfolio'];
  const stylePreset = STYLE_PRESETS[req.style || 'dark'];
  const pageMeta = PAGE_META[req.page];
  const siteName = req.siteName || meta.defaultSiteName;
  const language = req.language || 'en';
  const langFont = LANGUAGE_FONTS[language];
  const subIndustryCues = parsed.subIndustry ? SUB_INDUSTRY_CUES[parsed.subIndustry] : null;

  const otherPagesBrief = PAGE_ORDER
    .filter(p => p !== req.page)
    .map(p => `${PAGE_META[p].name} (at ${PAGE_META[p].route})`)
    .join(', ');

  // ── Build the "REQUIRED ELEMENTS" checklist from parsed prompt ──
  const requiredElementsList = parsed.requiredElements.length > 0
    ? parsed.requiredElements.map(el => `  □ ${el}`).join('\n')
    : '  (none specifically requested beyond industry defaults)';

  // ── Build the "REQUIRED ANIMATIONS" checklist ──
  const requiredAnimationsList = parsed.animations.length > 0
    ? parsed.animations.map(a => `  □ ${a}`).join('\n')
    : '  (none specifically requested beyond defaults)';

  // ── Build the "REQUIRED COLORS" section ──
  const requiredColorsList = parsed.hexColors.length > 0
    ? parsed.hexColors.map(c => `  □ ${c}`).join('\n')
    : '  (none specifically requested — use style preset)';

  // ── Industry defaults (always-on requirements based on industry) ──
  const industryDefaults: string[] = [];
  if (req.industry === 'ecommerce') {
    industryDefaults.push(
      '  □ product cards with image, name, price (with discount), star rating, add-to-cart button',
      '  □ shopping cart icon in header with item count badge',
      '  □ search bar in header',
      '  □ login/register buttons in header',
      '  □ category navigation in header',
      '  □ product grid (minimum 6-8 products) with realistic product names, prices, descriptions',
      '  □ discount badges on at least 2 products ("Special Offer" or "New")',
      '  □ star ratings (4.0-5.0) on each product card'
    );
  }
  if (parsed.themeKeywords.includes('dark-neon')) {
    industryDefaults.push(
      '  □ DARK NEON THEME: matte black background (#0A0A0A or as specified), light text, glowing neon accents',
      '  □ neon glow effect on CTAs and headers (use box-shadow with neon color)',
      '  □ vibrant accent colors (electric purple, neon pink) for interactive elements'
    );
  }
  if (parsed.themeKeywords.includes('glassmorphism') || parsed.animations.includes('parallax')) {
    industryDefaults.push(
      '  □ GLASSMORPHISM on header and cards: backdrop-filter: blur(12px) saturate(180%), semi-transparent background'
    );
  }

  // ── Animation specs ──
  const animationSpecs: string[] = [];
  if (parsed.animations.includes('fade-in-up')) {
    animationSpecs.push(
      '  □ fade-in-up on scroll for all major sections: use IntersectionObserver in JS to add .visible class when section enters viewport. CSS: opacity:0; transform:translateY(30px); transition:all 600ms ease. .visible { opacity:1; transform:none; }. Add transition-delay incrementally (0ms, 100ms, 200ms...) for staggered effect.'
    );
  }
  if (parsed.animations.includes('parallax')) {
    animationSpecs.push(
      '  □ PARALLAX on hero background image: use background-attachment:fixed OR transform:translateY based on scroll position via JS. Image moves slower than scroll.'
    );
  }
  if (parsed.animations.includes('skeleton-loader')) {
    animationSpecs.push(
      '  □ SKELETON LOADER for product grid: show 6 placeholder cards with shimmer animation (linear-gradient sweeping) for 1.5 seconds, then reveal products. CSS @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }'
    );
  }
  if (parsed.animations.includes('360-rotate')) {
    animationSpecs.push(
      '  □ 360 ROTATION on product image hover: transform:rotateY(360deg) over 1.5s ease on hover. Add perspective to parent.'
    );
  }
  if (parsed.animations.includes('count-up')) {
    animationSpecs.push(
      '  □ COUNT-UP animation for stats/sales numbers: use JS requestAnimationFrame to animate from 0 to target value over 2s when section enters viewport.'
    );
  }
  if (parsed.animations.includes('ripple-effect')) {
    animationSpecs.push(
      '  □ RIPPLE effect on button clicks: JS adds <span class="ripple"> at click position, CSS animates scale from 0 to 4 with opacity fade.'
    );
  }
  if (parsed.animations.includes('shake-animation')) {
    animationSpecs.push(
      '  □ SHAKE animation on cart when product added: cart icon gets .shake class for 400ms (cart-shake keyframes: translateX back-and-forth).'
    );
  }
  if (parsed.animations.includes('float-animation')) {
    animationSpecs.push(
      '  □ FLOAT animation on CTA buttons: @keyframes float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-6px); } } with 3s ease-in-out infinite.'
    );
  }

  // ── E-commerce-specific page requirements ──
  let pageSpecificEcommerce = '';
  if (req.industry === 'ecommerce' && req.page === 'home') {
    pageSpecificEcommerce = `
ECOMMERCE HOME PAGE — REQUIRED SECTIONS (in this order):
1. Hero section: full-screen slideshow/banner with 3 slides, navigation arrows + dots, parallax background
2. Featured products: grid of 6-8 product cards with skeleton loader animation, 360-rotate on hover
3. Special offers: countdown timer section with 3-4 high-discount products
4. Categories: visual category cards (e.g., Electronics, Clothing, Home — adapted to sub-industry)
5. Customer reviews: carousel with profile photos, names, ratings, testimonial text
6. Stats: count-up animated numbers (customers, products, satisfaction %)
7. Newsletter CTA in footer (already provided)`;
  }
  if (req.industry === 'ecommerce' && req.page === 'services') {
    pageSpecificEcommerce = `
ECOMMERCE SERVICES/SHOP PAGE — REQUIRED SECTIONS:
1. Page header with breadcrumb
2. Sidebar filters (left or right based on RTL): category checkboxes, price range slider (dual-handle), brand checkboxes, color swatches
3. Main product grid: 8-12 products with image, name, original price (strikethrough), discounted price, star rating, add-to-cart button, discount badge
4. Sort dropdown (price low-high, high-low, newest, rating)
5. Pagination or "Load more" button
6. "Compare products" feature (optional)`;
  }

  // ── Sub-industry context ──
  const subIndustrySection = subIndustryCues ? `
INDUSTRY SUB-CONTEXT (detected from prompt): ${parsed.subIndustry}
- This is a ${subIndustryCues.label}.
- Use font pairing: ${subIndustryCues.fontPairing}
- Color palette hint: ${subIndustryCues.paletteHint}
${subIndustryCues.patternHint ? `- Decorative pattern: ${subIndustryCues.patternHint}` : ''}
- Sample products to use as content inspiration: ${subIndustryCues.sampleProducts?.join(', ')}
- Use Unsplash images matching: ${subIndustryCues.imageryKeywords.join(', ')}
- IMPORTANT: Use REAL Unsplash photo IDs. Sample working IDs you can use:
  ${getUnsplashImagesForSubIndustry(parsed.subIndustry).slice(0, 8).join('\n  ')}
` : '';

  // ── Single-page mode ──
  const singlePageNote = parsed.isSinglePage
    ? `\nSINGLE-PAGE MODE: The user requested a single-page site. Even though this is the ${pageMeta.name} page, generate it as a COMPLETE standalone landing page with ALL sections (hero, products, about, contact) on ONE page. Other pages will still be generated separately but this page should be self-sufficient.`
    : '';

  // ── Color spec ──
  const colorSpec = parsed.hexColors.length > 0
    ? `COLORS (USER-SPECIFIED — use EXACT codes):
${requiredColorsList}

Map these to CSS variables:
:root {
  --bg: ${colors.bg};          ${colors.bg !== parsed.hexColors[0] ? `/* user specified */` : ''}
  --surface: ${colors.surface};  /* derived */
  --text: ${colors.text};        /* derived for contrast */
  --muted: ${colors.muted};       /* derived for contrast */
  --accent: ${colors.accent};    ${parsed.hexColors.length >= 2 ? `/* user specified */` : ''}
  ${colors.neonPink ? `--neon-pink: ${colors.neonPink};    /* user specified — use for CTAs, highlights, cart count */` : ''}
  --border: ${colors.border};
  --font-sans: ${langFont.body};
  --font-heading: ${langFont.heading};
}`
    : `COLORS (from style preset — ${stylePreset.label}):
:root {
  --bg: ${colors.bg};
  --surface: ${colors.surface};
  --text: ${colors.text};
  --muted: ${colors.muted};
  --accent: ${colors.accent};
  --border: ${colors.border};
  --font-sans: ${langFont.body};
  --font-heading: ${langFont.heading};
}`;

  // ── Language / RTL ──
  const languageSpec = `
SITE LANGUAGE: ${language.toUpperCase()} (${langFont.dir.toUpperCase()})
- <html lang="${language}" dir="${langFont.dir}">
- Font: ${LANGUAGE_GOOGLE_FONTS[language]} from Google Fonts
- ${langFont.isRtl ? 'RTL: text and layouts flow right-to-left. Use logical properties (margin-inline-start, padding-inline-end) where possible.' : 'LTR: standard left-to-right.'}
`;

  return `Generate the **${pageMeta.name}** page for a ${meta.label} website.

═══ PROJECT BRIEF (USER'S EXACT PROMPT) ════════════════════════════════════
"${req.prompt}"

The user's brief is the SOURCE OF TRUTH. Every instruction in it must be implemented faithfully. Do NOT simplify, skip, or "interpret" anything away.

═══ SITE INFORMATION ═════════════════════════════════════════════════════════
- Site name: ${siteName}
- Industry: ${meta.label}
- Visual style preset: ${stylePreset.label}
- Mood: ${stylePreset.mood}
- Other pages in the site (for context — do NOT generate them, but use the same fonts/colors/look):
  ${otherPagesBrief}
${singlePageNote}

═══ PARSED REQUIREMENTS (extracted from user's brief) ═══════════════════════
The user's brief was automatically analyzed. The following elements/colors/animations were detected and MUST be implemented:

REQUIRED ELEMENTS:
${requiredElementsList}

INDUSTRY-DEFAULT ELEMENTS (always required for this industry):
${industryDefaults.map(e => '  ' + e).join('\n') || '  (none)'}

REQUIRED ANIMATIONS (must implement each one with real CSS/JS):
${requiredAnimationsList}

${colorSpec}
${languageSpec}
${subIndustrySection}
${pageSpecificEcommerce}
${animationSpecs.length > 0 ? `ANIMATION IMPLEMENTATION SPECS (follow these precisely):
${animationSpecs.join('\n')}
` : ''}
═══ SHARED HEADER & FOOTER (USE VERBATIM) ═══════════════════════════════════
The header and footer below are SHARED across all 4 pages of this site. Include them EXACTLY as given — do not modify, add, remove, or "improve" anything. This ensures consistent navigation across all pages.

─── HEADER HTML (paste verbatim right after <body>) ───
${headerFooter.headerHtml}

─── FOOTER HTML (paste verbatim right before </body>) ───
${headerFooter.footerHtml}

─── HEADER/FOOTER CSS (include in your <style> tag, in addition to page-specific CSS) ───
${headerFooter.cssForHeaderFooter}

═══ PAGE PURPOSE ═══════════════════════════════════════════════════════════
${pageMeta.purpose}

CONTENT GUIDANCE:
${meta.contentHint}

═══ FINAL REQUIREMENTS ═════════════════════════════════════════════════════
1. Return ONLY the complete ${pageMeta.name} page HTML, starting with <!DOCTYPE html>.
2. <html> tag must have lang="${language}" dir="${langFont.dir}".
3. Include Google Fonts link in <head>: <link href="https://fonts.googleapis.com/css2?family=${LANGUAGE_GOOGLE_FONTS[language].replace(/ /g, '+')}:wght@400;500;600;700;800&display=swap" rel="stylesheet">
4. The header and footer MUST be the verbatim HTML provided above — character for character.
5. The header/footer CSS MUST be included in your <style> tag, in addition to page-specific CSS.
6. Implement EVERY element listed in "REQUIRED ELEMENTS" and "INDUSTRY-DEFAULT ELEMENTS".
7. Implement EVERY animation listed in "REQUIRED ANIMATIONS" using the specs provided.
8. Use the EXACT hex color codes from "COLORS" — do not substitute or "approximate".
9. Generate real, specific, believable content (product names, prices, descriptions, customer names) based on the brief.
10. Page-specific main content goes in <main> between header and footer.
11. Mobile-responsive: hamburger menu, stacked grids, etc.

OUTPUT: A single \`\`\`html code fence containing the complete HTML document. Start with <!DOCTYPE html>. End with </html>. No commentary.`;
}

// ─── Unsplash image library per sub-industry ──────────────────────────────
// Real, verified Unsplash photo URLs. Using these ensures images always load.

function getUnsplashImagesForSubIndustry(subIndustry?: string): string[] {
  const libraries: Record<string, string[]> = {
    carpet: [
      'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800',
      'https://images.unsplash.com/photo-1584153009330-5d2c2c5b3b1f?w=800',
      'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=800',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
      'https://images.unsplash.com/photo-1528465424850-54d22f092f9d?w=800',
    ],
    fashion: [
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800',
      'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800',
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800',
      'https://images.unsplash.com/photo-1485518882345-15568b007407?w=800',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800',
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800',
    ],
    digital: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800',
      'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800',
      'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800',
      'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800',
    ],
    food: [
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800',
      'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800',
      'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800',
      'https://images.unsplash.com/photo-1495774856032-8b90bbb32b32?w=800',
      'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800',
      'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800',
      'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=800',
      'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=800',
    ],
    beauty: [
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800',
      'https://images.unsplash.com/photo-1522335789203-aaa2f6f72e2c?w=800',
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800',
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800',
      'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=800',
      'https://images.unsplash.com/photo-1556228852-80b6e5eeff06?w=800',
    ],
    home: [
      'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800',
      'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=800',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800',
      'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800',
    ],
    jewelry: [
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800',
      'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800',
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800',
      'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=800',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800',
      'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=800',
    ],
    books: [
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800',
      'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=800',
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800',
      'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800',
      'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800',
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800',
      'https://images.unsplash.com/photo-1510172951991-856a654063f9?w=800',
    ],
    sports: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
      'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800',
      'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800',
      'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800',
      'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=800',
      'https://images.unsplash.com/photo-1434596922112-19c563067271?w=800',
    ],
  };
  return libraries[subIndustry || ''] || libraries.digital;
}

// ─── Single-page generation with retry ────────────────────────────────────

const MAX_RETRIES = 4;

function sleep(ms: number) {
  return new Promise<void>(resolve => setTimeout(resolve, ms));
}

async function callGlmWithRetry(
  zai: Awaited<ReturnType<typeof ZAI.create>>,
  req: GeneratePageRequest,
  parsed: ParsedPrompt,
  colors: { bg: string; surface: string; text: string; muted: string; accent: string; border: string; neonPink?: string },
  headerFooter: { headerHtml: string; footerHtml: string; cssForHeaderFooter: string },
  onTick: () => void
): Promise<string> {
  let lastError: any = null;
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      onTick();
      const tickInterval = setInterval(onTick, 5000);
      try {
        const completion = await zai.chat.completions.create({
          model: 'glm-4.7',
          messages: [
            { role: 'system', content: buildSystemPrompt() },
            { role: 'user', content: buildPagePrompt(req, parsed, colors, headerFooter) },
          ],
          thinking: { type: 'disabled' },
          temperature: 0.7,
          max_tokens: 16000,
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

    // ── Parse user prompt ──
    const parsed = parseUserPrompt(req.prompt, req.language || 'en');

    // ── Apply user-specified colors (override style preset) ──
    const baseColors = STYLE_PRESETS[req.style || 'dark'].colors;
    const colors = applyUserColors(baseColors, parsed);

    // ── Build shared header/footer (consistent across all pages) ──
    const meta = INDUSTRY_META[req.industry || 'portfolio'];
    const headerFooter = buildSharedHeaderFooter(
      req.industry || 'portfolio',
      resolvedSiteName,
      meta.navItems,
      colors,
      parsed,
      req.language || 'en'
    );

    console.log(`[generate] job ${jobId} page=${req.page} parsed: hexColors=${parsed.hexColors.length} elements=${parsed.requiredElements.length} animations=${parsed.animations.length} subIndustry=${parsed.subIndustry || 'none'} language=${parsed.language}`);

    const content = await callGlmWithRetry(zai, req, parsed, colors, headerFooter, () => {
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
      language = 'en',
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

    // Pre-parse the prompt so we can return useful info to the client immediately
    const parsed = parseUserPrompt(prompt, language);

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

    runGenerationJob(jobId, {
      prompt,
      industry,
      style,
      page,
      siteName: resolvedSiteName,
      language,
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

    // Return jobId + parsed prompt summary so client can show what was detected
    return NextResponse.json({
      jobId,
      status: 'pending',
      page,
      parsed: {
        hexColors: parsed.hexColors,
        themeKeywords: parsed.themeKeywords,
        requiredElements: parsed.requiredElements,
        animations: parsed.animations,
        subIndustry: parsed.subIndustry,
        isSinglePage: parsed.isSinglePage,
        language: parsed.language,
        detectedBrandName: parsed.detectedBrandName,
      },
    });
  } catch (error: any) {
    console.error('[generate] POST error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal error' },
      { status: 500 }
    );
  }
}

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
    languages: [
      { id: 'en', label: 'English', dir: 'ltr', font: 'Inter' },
      { id: 'fa', label: 'فارسی', dir: 'rtl', font: 'Vazirmatn' },
      { id: 'ar', label: 'العربية', dir: 'rtl', font: 'Vazirmatn' },
      { id: 'de', label: 'Deutsch', dir: 'ltr', font: 'Inter' },
      { id: 'es', label: 'Español', dir: 'ltr', font: 'Inter' },
      { id: 'fr', label: 'Français', dir: 'ltr', font: 'Inter' },
    ],
    subIndustries: Object.entries(SUB_INDUSTRY_CUES).map(([id, c]) => ({
      id,
      label: c.label,
    })),
  });
}
