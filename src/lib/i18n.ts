/**
 * Forge UI i18n — bilingual EN/FA for the BUILDER UI itself
 * (separate from `builderLanguage` which controls the GENERATED site's language)
 *
 * Usage:
 *   const t = useTranslation()
 *   t('nav.builder')
 *   t('hero.title')
 *
 * Strings can be looked up by dotted path. Falls back to English then to the key.
 */

export type UiLanguage = 'en' | 'fa'

export const UI_LANGUAGES: { id: UiLanguage; label: string; nativeLabel: string; dir: 'ltr' | 'rtl'; flag: string }[] = [
  { id: 'en', label: 'English',  nativeLabel: 'English',  dir: 'ltr', flag: '🇬🇧' },
  { id: 'fa', label: 'Persian',  nativeLabel: 'فارسی',    dir: 'rtl', flag: '🇮🇷' },
]

export const RTL_LANGUAGES: UiLanguage[] = ['fa']

export function isRtl(lang: UiLanguage): boolean {
  return RTL_LANGUAGES.includes(lang)
}

// ─── Translation dictionaries ──────────────────────────────────────────────

type Dict = Record<string, string>

const en: Dict = {
  // ─── Brand / common
  'brand.name': 'Forge',
  'common.loading': 'Loading…',
  'common.cancel': 'Cancel',
  'common.save': 'Save',
  'common.export': 'Export',
  'common.deploy': 'Deploy',
  'common.back': 'Back',
  'common.close': 'Close',
  'common.search': 'Search',

  // ─── Landing page nav
  'nav.builder': 'Builder',
  'nav.templates': 'Templates',
  'nav.pricing': 'Pricing',
  'nav.signin': 'Sign in',
  'nav.getStarted': 'Get Started',
  'nav.theme.toggleLight': 'Switch to light',
  'nav.theme.toggleDark': 'Switch to dark',

  // ─── Landing hero
  'hero.badge': 'AI-Powered Website Builder',
  'hero.title.pre': 'Your idea. Our AI.',
  'hero.title.highlight': 'A complete website.',
  'hero.subtitle': 'Describe what you want. Forge generates a full, responsive website in seconds. Customize with the visual editor, then deploy anywhere.',
  'hero.placeholder': 'A modern SaaS landing page with pricing...',
  'hero.generate': 'Generate',
  'hero.suggestion.saas': 'SaaS landing page',
  'hero.suggestion.portfolio': 'Portfolio site',
  'hero.suggestion.restaurant': 'Restaurant website',
  'hero.suggestion.ecommerce': 'E-commerce store',
  'hero.preview.getUrl': 'forge.ai/your-site',
  'hero.preview.cta': 'Get Started',

  // ─── Stats
  'stats.sitesBuilt': 'Sites Built',
  'stats.pagesGenerated': 'Pages Generated',
  'stats.uptime': 'Uptime',
  'stats.countries': 'Countries',

  // ─── Interactive playground
  'playground.badge': 'Interactive',
  'playground.title.pre': 'Build a site,',
  'playground.title.highlight': 'your way',
  'playground.subtitle': 'Drag blocks onto the canvas to arrange your website layout. Try different combinations — it\'s fun!',
  'playground.blocks': '6 block types to mix & match',

  // ─── Features
  'features.badge': 'Features',
  'features.title.pre': 'Everything you need,',
  'features.title.highlight': 'nothing you don\'t',
  'features.subtitle': 'Forge combines AI generation, visual editing, and export freedom in one fast, beautiful tool.',
  'features.ai.title': 'AI Generation',
  'features.ai.desc': 'Describe your vision in plain language. Forge crafts production-quality websites from your words.',
  'features.editor.title': 'Visual Editor',
  'features.editor.desc': 'Refine every detail with an intuitive editor. Drag, drop, tweak — or let AI handle it.',
  'features.export.title': 'Export Freedom',
  'features.export.desc': 'Export clean HTML, CSS, and JS anytime — no lock-in, no vendor dependency.',
  'features.deploy.title': 'Deploy Anywhere',
  'features.deploy.desc': 'Ship to Vercel, Netlify, or your own server. Forge doesn\'t tie you down.',

  // ─── How it works
  'how.badge': 'How It Works',
  'how.title.pre': 'From idea to live site in',
  'how.title.highlight': 'three steps',
  'how.subtitle': 'No code, no templates, no waiting. Just describe what you want and watch Forge build it.',
  'how.step1.title': 'Describe',
  'how.step1.desc': 'Tell Forge what you want — a portfolio, SaaS page, restaurant site, anything.',
  'how.step2.title': 'AI Builds',
  'how.step2.desc': 'Forge generates a complete, responsive website with proper structure in seconds.',
  'how.step3.title': 'Customize & Ship',
  'how.step3.desc': 'Polish with the visual editor, then deploy anywhere. Your site, your code.',

  // ─── Testimonials
  'testimonials.badge': 'Loved by Builders',
  'testimonials.title.pre': 'Don\'t take our',
  'testimonials.title.highlight': 'word for it',
  'testimonials.subtitle': 'Join thousands of founders, freelancers, and teams who ship faster with Forge.',

  // ─── FAQ
  'faq.badge': 'FAQ',
  'faq.title.pre': 'Common',
  'faq.title.highlight': 'questions',

  // ─── CTA
  'cta.title.pre': 'Ready to build something',
  'cta.title.highlight': 'extraordinary?',
  'cta.subtitle': 'Generate your first site in seconds — no credit card needed. Upgrade for custom domains, team features, and more.',
  'cta.primary': 'Start Building Free',
  'cta.secondary': 'Sign In',

  // ─── Footer
  'footer.tagline': 'AI-powered website builder. Describe, generate, customize, deploy.',
  'footer.product': 'Product',
  'footer.resources': 'Resources',
  'footer.company': 'Company',
  'footer.rights': '© 2025 Forge. All rights reserved.',

  // ─── Builder page
  'builder.poweredBy': 'Powered by AI · Generates {n} complete pages',
  'builder.title': 'Describe your vision',
  'builder.subtitle': 'Tell us what you want — the AI will craft a complete multi-page website with your specifications',
  'builder.industry': 'Industry',
  'builder.style': 'Visual Style',
  'builder.siteLanguage': 'Site Language',
  'builder.placeholder': 'Be specific — describe your business, name, target audience, vibe, and any must-have sections. e.g. \'A cozy specialty coffee shop called Ember & Roast in Portland — focus on single-origin beans and a warm rustic vibe\'',
  'builder.chars': '{n} chars · ⌘+Enter to generate',
  'builder.pageCount': '{enabled} core pages · {total} total enabled · ~4-6 min',
  'builder.advancedOptions': 'Advanced Options',
  'builder.generate': 'Generate Website',
  'builder.tryExample': 'Or try a fully-fleshed example',
  'builder.pleaseEnterPrompt': 'Please enter a prompt',
  'builder.promptDesc': 'Describe the website you want to build',
  'builder.backToHome': 'Back to home',

  // ─── Builder phases
  'builder.generating.title': 'Building your website',
  'builder.generating.subtitle': 'AI is crafting {n} complete pages sequentially — this takes ~4-6 minutes total',
  'builder.generating.pagesDone': '{done}/{total} pages done',
  'builder.generating.backToPrompt': 'Back to prompt',
  'builder.generating.retry': 'Retry',

  // ─── Builder preview
  'builder.preview.title': 'Your generated website',
  'builder.preview.regenerate': 'Regenerate',
  'builder.preview.save': 'Save',
  'builder.preview.export': 'Export',
  'builder.preview.exportAll': 'Export All',
  'builder.preview.edit': 'Edit',

  // ─── Editor
  'editor.export': 'Export',
  'editor.deploy': 'Deploy',
  'editor.untitled': 'Untitled',
  'editor.structure': 'Structure',
  'editor.addElements': 'Add Elements',
  'editor.pages': 'Pages',
  'editor.designs': 'Designs',
  'editor.pageStructure': 'Page Structure',
  'editor.pageStructureHint': 'This shows all the sections and parts that make up your page. Click anything here or in the preview to start editing it.',
  'editor.clickElementsHint': 'Click elements in preview',
  'editor.searchElements': 'Search for elements...',
  'editor.exportTitle': 'Export Website',
  'editor.download': 'Download {fmt}',
  'editor.deploymentStarted': 'Deployment started',
  'editor.applyTheme': 'Apply Theme to All Pages',
  'editor.apply': 'Apply',

  // ─── Language switcher
  'lang.switch': 'Switch language',
  'lang.english': 'English',
  'lang.persian': 'فارسی',
}

const fa: Dict = {
  // ─── برند / عمومی
  'brand.name': 'فورج',
  'common.loading': 'در حال بارگذاری…',
  'common.cancel': 'انصراف',
  'common.save': 'ذخیره',
  'common.export': 'خروجی',
  'common.deploy': 'استقرار',
  'common.back': 'بازگشت',
  'common.close': 'بستن',
  'common.search': 'جستجو',

  // ─── نوار بالا - لندینگ
  'nav.builder': 'ساختگر',
  'nav.templates': 'قالب‌ها',
  'nav.pricing': 'قیمت‌گذاری',
  'nav.signin': 'ورود',
  'nav.getStarted': 'شروع کنید',
  'nav.theme.toggleLight': 'تغییر به حالت روشن',
  'nav.theme.toggleDark': 'تغییر به حالت تاریک',

  // ─── هیرو لندینگ
  'hero.badge': 'ساختگر وب‌سایت با هوش مصنوعی',
  'hero.title.pre': 'ایده شما. هوش مصنوعی ما.',
  'hero.title.highlight': 'یک وب‌سایت کامل.',
  'hero.subtitle': 'توضیح بده چی می‌خوای. فورج در چند ثانیه یک وب‌سایت کامل و واکنش‌گرا می‌سازد. با ویرایشگر بصری شخصی‌سازی کن و هرجا خواستی دیپلوی کن.',
  'hero.placeholder': 'یک لندینگ پیج SaaS مدرن با قیمت‌گذاری...',
  'hero.generate': 'تولید کن',
  'hero.suggestion.saas': 'لندینگ SaaS',
  'hero.suggestion.portfolio': 'سایت نمونه‌کار',
  'hero.suggestion.restaurant': 'وب‌سایت رستوران',
  'hero.suggestion.ecommerce': 'فروشگاه آنلاین',
  'hero.preview.getUrl': 'forge.ai/your-site',
  'hero.preview.cta': 'شروع کنید',

  // ─── آمار
  'stats.sitesBuilt': 'سایت ساخته شده',
  'stats.pagesGenerated': 'صفحه تولید شده',
  'stats.uptime': 'آپ‌تایم',
  'stats.countries': 'کشور',

  // ─── محیط تعاملی
  'playground.badge': 'تعاملی',
  'playground.title.pre': 'سایت بساز،',
  'playground.title.highlight': 'به روش خودت',
  'playground.subtitle': 'بلوک‌ها را روی بوم بکش تا چیدمان وب‌سایت‌ت را بچینی. ترکیب‌های مختلف را امتحان کن — جالبه!',
  'playground.blocks': '۶ نوع بلوک برای ترکیب',

  // ─── ویژگی‌ها
  'features.badge': 'ویژگی‌ها',
  'features.title.pre': 'همه چیز که می‌خوای،',
  'features.title.highlight': 'هیچ چیز اضافه نه',
  'features.subtitle': 'فورج تولید با هوش مصنوعی، ویرایش بصری و آزادی خروجی را در یک ابزار سریع و زیبا ترکیب می‌کند.',
  'features.ai.title': 'تولید با هوش مصنوعی',
  'features.ai.desc': 'ایده‌ات را به زبان ساده توضیح بده. فورج از حرف‌هایت وب‌سایت با کیفیت تولیدی می‌سازد.',
  'features.editor.title': 'ویرایشگر بصری',
  'features.editor.desc': 'هر جزئیات را با ویرایشگر شهودی ریفاین کن. بکش، رها کن، تنظیم کن — یا بگذار هوش مصنوعی انجام دهد.',
  'features.export.title': 'آزادی خروجی',
  'features.export.desc': 'هر زمان HTML، CSS و JS تمیز خروجی بگیر — بدون قفل، بدون وابستگی به فروشنده.',
  'features.deploy.title': 'هرجا دیپلوی کن',
  'features.deploy.desc': 'به Vercel، Netlify یا سرور خودت بفرست. فورج تو را محدود نمی‌کند.',

  // ─── چطور کار می‌کند
  'how.badge': 'چطور کار می‌کند',
  'how.title.pre': 'از ایده تا سایت زنده در',
  'how.title.highlight': 'سه قدم',
  'how.subtitle': 'بدون کد، بدون قالب، بدون انتظار. فقط توضیح بده چی می‌خوای و تماشا کن فورج می‌سازدش.',
  'how.step1.title': 'توضیح بده',
  'how.step1.desc': 'به فورج بگو چی می‌خوای — نمونه‌کار، صفحه SaaS، سایت رستوران، هرچیزی.',
  'how.step2.title': 'هوش مصنوعی می‌سازد',
  'how.step2.desc': 'فورج در چند ثانیه یک وب‌سایت کامل و واکنش‌گرا با ساختار درست می‌سازد.',
  'how.step3.title': 'شخصی‌سازی و دیپلوی',
  'how.step3.desc': 'با ویرایشگر بصری صیقل بده و بعد هرجا خواستی دیپلوی کن. سایت تو، کد تو.',

  // ─── نظر کاربران
  'testimonials.badge': 'محبوب سازندگان',
  'testimonials.title.pre': 'به حرف ما',
  'testimonials.title.highlight': 'اعتماد نکن',
  'testimonials.subtitle': 'به هزاران بنیان‌گذار، فریلنسر و تیم بپیوند که با فورج سریع‌تر محصول می‌سازند.',

  // ─── سوالات متداول
  'faq.badge': 'سوالات متداول',
  'faq.title.pre': 'سوالات',
  'faq.title.highlight': 'رایج',

  // ─── CTA
  'cta.title.pre': 'آماده‌ای چیزی',
  'cta.title.highlight': 'خارق‌العاده بسازی؟',
  'cta.subtitle': 'اولین سایتت را در چند ثانیه تولید کن — بدون نیاز به کارت اعتباری. برای دامنه اختصاصی، ویژگی‌های تیمی و بیشتر ارتقا بده.',
  'cta.primary': 'شروع رایگان ساخت',
  'cta.secondary': 'ورود',

  // ─── فوتر
  'footer.tagline': 'ساختگر وب‌سایت با هوش مصنوعی. توضیح بده، تولید کن، شخصی‌سازی کن، دیپلوی کن.',
  'footer.product': 'محصول',
  'footer.resources': 'منابع',
  'footer.company': 'شرکت',
  'footer.rights': '© ۲۰۲۵ فورج. تمام حقوق محفوظ است.',

  // ─── صفحه ساختگر
  'builder.poweredBy': 'با نیروی هوش مصنوعی · {n} صفحه کامل تولید می‌کند',
  'builder.title': 'ایده‌ات را توضیح بده',
  'builder.subtitle': 'بگو چی می‌خوای — هوش مصنوعی یک وب‌سایت چند صفحه‌ای کامل با مشخصات تو می‌سازد',
  'builder.industry': 'صنعت',
  'builder.style': 'استایل بصری',
  'builder.siteLanguage': 'زبان سایت',
  'builder.placeholder': 'دقیق باش — کسب‌وکارت، نام، مخاطب هدف، حال و هوا و بخش‌های ضروری را توضیح بده. مثلاً: «یک کافه تخصصی دنج به نام Ember & Roast در پورتلند — روی قهوه تک‌خاستگاه و حال و هوای گرم و روستیک تمرکز کن»',
  'builder.chars': '{n} کاراکتر · ⌘+Enter برای تولید',
  'builder.pageCount': '{enabled} صفحه اصلی · {total} صفحه کل فعال · ~۴-۶ دقیقه',
  'builder.advancedOptions': 'گزینه‌های پیشرفته',
  'builder.generate': 'تولید وب‌سایت',
  'builder.tryExample': 'یا یک نمونه کامل را امتحان کن',
  'builder.pleaseEnterPrompt': 'لطفاً یک پرامپت وارد کن',
  'builder.promptDesc': 'وب‌سایتی که می‌خوای بسازی را توضیح بده',
  'builder.backToHome': 'بازگشت به خانه',

  // ─── فازهای ساختگر
  'builder.generating.title': 'در حال ساخت وب‌سایت تو',
  'builder.generating.subtitle': 'هوش مصنوعی {n} صفحه کامل را به ترتیب می‌سازد — در مجموع ~۴-۶ دقیقه طول می‌کشد',
  'builder.generating.pagesDone': '{done}/{total} صفحه انجام شد',
  'builder.generating.backToPrompt': 'بازگشت به پرامپت',
  'builder.generating.retry': 'تلاش مجدد',

  // ─── پیش‌نمایش ساختگر
  'builder.preview.title': 'وب‌سایت تولید شده',
  'builder.preview.regenerate': 'تولید مجدد',
  'builder.preview.save': 'ذخیره',
  'builder.preview.export': 'خروجی',
  'builder.preview.exportAll': 'خروجی همه',
  'builder.preview.edit': 'ویرایش',

  // ─── ویرایشگر
  'editor.export': 'خروجی',
  'editor.deploy': 'استقرار',
  'editor.untitled': 'بدون عنوان',
  'editor.structure': 'ساختار',
  'editor.addElements': 'افزودن عناصر',
  'editor.pages': 'صفحات',
  'editor.designs': 'طراحی‌ها',
  'editor.pageStructure': 'ساختار صفحه',
  'editor.pageStructureHint': 'این همه بخش‌ها و اجزایی که صفحه‌ات را می‌سازند را نشان می‌دهد. روی هرکدام اینجا یا در پیش‌نمایش کلیک کن تا ویرایش را شروع کنی.',
  'editor.clickElementsHint': 'روی عناصر در پیش‌نمایش کلیک کن',
  'editor.searchElements': 'جستجوی عناصر...',
  'editor.exportTitle': 'خروجی وب‌سایت',
  'editor.download': 'دانلود {fmt}',
  'editor.deploymentStarted': 'استقرار شروع شد',
  'editor.applyTheme': 'اعمال تم روی همه صفحات',
  'editor.apply': 'اعمال',

  // ─── سوییچر زبان
  'lang.switch': 'تغییر زبان',
  'lang.english': 'English',
  'lang.persian': 'فارسی',
}

const dictionaries: Record<UiLanguage, Dict> = { en, fa }

// ─── Helper: format with {placeholder} ─────────────────────────────────────

function format(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template
  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    const v = vars[key]
    return v === undefined ? `{${key}}` : String(v)
  })
}

// ─── Server-side / non-hook lookup ─────────────────────────────────────────

export function translate(lang: UiLanguage, key: string, vars?: Record<string, string | number>): string {
  const dict = dictionaries[lang] || dictionaries.en
  const value = dict[key] ?? dictionaries.en[key] ?? key
  return format(value, vars)
}

// ─── React hook (client components only) ───────────────────────────────────
//
// `useTranslation` is defined in a separate client wrapper to keep this file
// isomorphic (it can be imported from server components too).
// See `src/lib/useTranslation.ts` for the hook.

export type TranslateFn = (key: string, vars?: Record<string, string | number>) => string

export function makeTranslator(lang: UiLanguage): TranslateFn {
  return (key, vars) => translate(lang, key, vars)
}

// ─── localStorage persistence ──────────────────────────────────────────────

const STORAGE_KEY = 'forge.uiLanguage'

export function loadUiLanguage(): UiLanguage {
  if (typeof window === 'undefined') return 'en'
  // Priority 1: URL ?lang= (explicit shareable link intent — always wins)
  try {
    const params = new URLSearchParams(window.location.search)
    const q = params.get('lang')
    if (q === 'en' || q === 'fa') return q
  } catch {}
  // Priority 2: localStorage (user's previous choice on this device)
  try {
    const v = window.localStorage.getItem(STORAGE_KEY)
    if (v === 'en' || v === 'fa') return v
  } catch {}
  // Priority 3: browser language hint
  try {
    const nav = window.navigator.language?.toLowerCase() || ''
    if (nav.startsWith('fa')) return 'fa'
    if (nav.startsWith('en')) return 'en'
  } catch {}
  // Priority 4: default
  return 'en'
}

export function saveUiLanguage(lang: UiLanguage) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, lang)
  } catch {}
}

// ─── <html> attribute helpers ──────────────────────────────────────────────

export function applyHtmlDirLang(lang: UiLanguage) {
  if (typeof document === 'undefined') return
  const html = document.documentElement
  html.lang = lang
  html.dir = isRtl(lang) ? 'rtl' : 'ltr'
  // Toggle a class on <body> for CSS targeting
  if (isRtl(lang)) {
    document.body.classList.add('rtl-ui')
    document.body.classList.remove('ltr-ui')
  } else {
    document.body.classList.add('ltr-ui')
    document.body.classList.remove('rtl-ui')
  }
}
