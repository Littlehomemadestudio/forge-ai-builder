'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from '@/lib/useTranslation';
import { ALL_INDUSTRIES, getIndustriesByGroup, getIndustryById } from '@/lib/industry';
import type { IndustryMeta, ImageCategory, IndustryImage, ImageSource } from '@/lib/industry/types';
import { Search, Sparkles, Loader2, Copy, Check, ChevronDown, ChevronRight, Image as ImageIcon, Wand2, AlertCircle, Layers } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────

interface CategoryImages {
  category: ImageCategory;
  images: IndustryImage[];
  tier: ImageSource;
  fallbackLog: string[];
}

interface IndustryGalleryProps {
  // Pre-selected industry (optional)
  initialIndustryId?: string;
  // Called when user picks an image to use
  onImageSelect?: (image: IndustryImage) => void;
  // Show compact view (no industry picker)
  compact?: boolean;
  // Disable AI generation fallback
  disableGeneration?: boolean;
  // Auto-load on industry select
  autoLoad?: boolean;
}

// ─── Helper: category metadata ─────────────────────────────────────────────

const CATEGORIES: ImageCategory[] = ['hero', 'product', 'lifestyle', 'team', 'workspace', 'detail'];

function tierColor(tier: ImageSource): string {
  switch (tier) {
    case 'curated': return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
    case 'search': return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
    case 'generated': return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
    case 'placeholder': return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
  }
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function IndustryGallery({
  initialIndustryId,
  onImageSelect,
  compact = false,
  disableGeneration = false,
  autoLoad = true,
}: IndustryGalleryProps) {
  const t = useTranslation();
  const isFa = t('brand.name') === 'فورج';

  // State
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryMeta | null>(
    initialIndustryId ? getIndustryById(initialIndustryId) || null : null
  );
  const [search, setSearch] = useState('');
  const [activeGroup, setActiveGroup] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [loadedCategories, setLoadedCategories] = useState<CategoryImages[]>([]);
  const [expandedCats, setExpandedCats] = useState<Set<ImageCategory>>(new Set(['hero', 'product']));
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [verifyUrls, setVerifyUrls] = useState(false);
  const [allowGeneration, setAllowGeneration] = useState(!disableGeneration);
  const [error, setError] = useState<string | null>(null);
  const [fallbackLog, setFallbackLog] = useState<string[]>([]);

  // ─── Industry list (filtered by group + search) ───
  const groupsList = useMemo(() => getIndustriesByGroup(), []);
  const filteredIndustries = useMemo(() => {
    let list = activeGroup === 'all'
      ? ALL_INDUSTRIES
      : ALL_INDUSTRIES.filter(i => i.group === activeGroup);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(i =>
        i.nameEn.toLowerCase().includes(q) ||
        i.nameFa.includes(search) ||
        i.keywords.some(k => k.toLowerCase().includes(q))
      );
    }
    return list;
  }, [activeGroup, search]);

  // ─── Load images for selected industry ───
  const loadImages = useCallback(async (industry: IndustryMeta) => {
    setLoading(true);
    setError(null);
    setFallbackLog([]);
    try {
      const res = await fetch('/api/industry-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          industryId: industry.id,
          category: 'all',
          count: 4,
          verifyUrls,
          allowGeneration: false, // never auto-generate, only on-demand
          language: isFa ? 'fa' : 'en',
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Unknown error');
      const cats = CATEGORIES.map(c => ({
        category: c,
        images: data.categories[c]?.images || [],
        tier: data.categories[c]?.tier || 'placeholder',
        fallbackLog: data.categories[c]?.fallbackLog || [],
      }));
      setLoadedCategories(cats);
      // Collect all fallback log entries
      const allLogs = cats.flatMap(c => c.fallbackLog);
      setFallbackLog(allLogs);
    } catch (err: any) {
      console.error('[IndustryGallery] loadImages failed:', err);
      setError(err?.message || 'Failed to load images');
    } finally {
      setLoading(false);
    }
  }, [verifyUrls, isFa]);

  // ─── Auto-load on industry select ───
  useEffect(() => {
    if (selectedIndustry && autoLoad) {
      loadImages(selectedIndustry);
    }
  }, [selectedIndustry, autoLoad, loadImages]);

  // ─── Generate single image via AI ───
  const generateImage = useCallback(async (category: ImageCategory) => {
    if (!selectedIndustry) return;
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          industryId: selectedIndustry.id,
          category,
          language: isFa ? 'fa' : 'en',
          fallbackToPlaceholder: true,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Generation failed');
      // Replace the first image of this category with the generated one
      setLoadedCategories(prev => prev.map(c => {
        if (c.category !== category) return c;
        const newImg: IndustryImage = {
          url: data.url,
          alt: `${selectedIndustry.nameEn} ${category} (AI generated)`,
          source: data.source,
          category,
        };
        return { ...c, images: [newImg, ...c.images], tier: data.source };
      }));
    } catch (err: any) {
      console.error('[IndustryGallery] generateImage failed:', err);
      setError(err?.message || 'Generation failed');
    } finally {
      setGenerating(false);
    }
  }, [selectedIndustry, isFa]);

  // ─── Copy URL ───
  const copyUrl = useCallback(async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 1500);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  }, []);

  // ─── Toggle category expansion ───
  const toggleCat = useCallback((cat: ImageCategory) => {
    setExpandedCats(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }, []);

  // ─── Stats ───
  const totalImages = useMemo(() => {
    return ALL_INDUSTRIES.reduce((sum, i) => {
      return sum + CATEGORIES.reduce((s, c) => {
        // We can't easily count curated URLs without importing the library here.
        // Just count industries × categories as a rough estimate.
        return s + 1;
      }, 0);
    }, 0);
  }, []);

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="industry-gallery" dir={isFa ? 'rtl' : 'ltr'}>
      {/* ─── Header ─── */}
      {!compact && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-bold">{t('p4.title')}</h2>
          </div>
          <p className="text-sm text-zinc-400">{t('p4.subtitle')}</p>
          <div className="flex gap-4 mt-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-500">{t('p4.stats.totalIndustries')}:</span>
              <span className="font-mono font-semibold text-zinc-200">{ALL_INDUSTRIES.length}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-500">{t('p4.stats.categories')}:</span>
              <span className="font-mono font-semibold text-zinc-200">{CATEGORIES.length}</span>
            </div>
          </div>
        </div>
      )}

      {/* ─── Industry picker (always visible — even in compact mode) ─── */}
      <div className="mb-6 space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder={t('p4.searchIndustry')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 rtl:pl-3 rtl:pr-10 pr-3 py-2 bg-zinc-900/60 border border-zinc-800 rounded-lg text-sm focus:outline-none focus:border-purple-500/50 transition"
            />
          </div>

          {/* Group filter chips */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setActiveGroup('all')}
              className={`px-3 py-1 text-xs rounded-full border transition ${
                activeGroup === 'all'
                  ? 'bg-purple-500/20 border-purple-500/50 text-purple-200'
                  : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              {t('p4.groups.all')}
            </button>
            {groupsList.map(g => (
              <button
                key={g.group}
                onClick={() => setActiveGroup(g.group)}
                className={`px-3 py-1 text-xs rounded-full border transition ${
                  activeGroup === g.group
                    ? 'bg-purple-500/20 border-purple-500/50 text-purple-200'
                    : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                {isFa ? g.groupFa : g.group}
              </button>
            ))}
          </div>

          {/* Industry chips (grid) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 max-h-64 overflow-y-auto pr-1">
            {filteredIndustries.map(ind => (
              <button
                key={ind.id}
                onClick={() => setSelectedIndustry(ind)}
                className={`px-3 py-2 text-xs text-left rtl:text-right rounded-lg border transition ${
                  selectedIndustry?.id === ind.id
                    ? 'bg-purple-500/15 border-purple-500/50 text-purple-100'
                    : 'bg-zinc-900/40 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900/70'
                }`}
              >
                <div className="font-semibold truncate">{isFa ? ind.nameFa : ind.nameEn}</div>
                <div className="text-[10px] text-zinc-500 truncate mt-0.5">
                  {isFa ? ind.groupFa : ind.group}
                </div>
              </button>
            ))}
          </div>
        </div>

      {/* ─── Selected industry info ─── */}
      {selectedIndustry && (
        <div className="mb-4 p-3 rounded-lg bg-zinc-900/40 border border-zinc-800">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div>
              <div className="font-semibold text-zinc-100">
                {isFa ? selectedIndustry.nameFa : selectedIndustry.nameEn}
              </div>
              <div className="text-xs text-zinc-500 mt-0.5">
                {isFa ? selectedIndustry.groupFa : selectedIndustry.group}
                {selectedIndustry.subIndustries.length > 0 && (
                  <span className="mx-1">·</span>
                )}
                {selectedIndustry.subIndustries.length > 0 && (
                  <span>
                    {selectedIndustry.subIndustries.length} {isFa ? 'زیرصنعت' : 'sub-industries'}
                  </span>
                )}
              </div>
            </div>
            {/* Color palette preview */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-zinc-500">{isFa ? 'پالت' : 'Palette'}:</span>
              <div
                className="w-5 h-5 rounded-full border border-zinc-700"
                style={{ background: selectedIndustry.palette.light.accent }}
                title={`Light accent: ${selectedIndustry.palette.light.accent}`}
              />
              <div
                className="w-5 h-5 rounded-full border border-zinc-700"
                style={{ background: selectedIndustry.palette.dark.accent }}
                title={`Dark accent: ${selectedIndustry.palette.dark.accent}`}
              />
            </div>
          </div>

          {/* Sample products / services */}
          <div className="mt-2 text-xs text-zinc-400">
            <span className="text-zinc-500">{isFa ? 'نمونه‌ها:' : 'Samples:'} </span>
            {selectedIndustry.sampleProducts.slice(0, 4).join('، ')}
          </div>
        </div>
      )}

      {/* ─── Loading ─── */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
          <span className="ml-2 rtl:ml-0 rtl:mr-2 text-sm text-zinc-400">{t('p4.loadingImages')}</span>
        </div>
      )}

      {/* ─── Error ─── */}
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-red-300">{error}</div>
        </div>
      )}

      {/* ─── Categories ─── */}
      {!loading && selectedIndustry && loadedCategories.length > 0 && (
        <div className="space-y-3">
          {loadedCategories.map(catData => {
            const cat = catData.category;
            const expanded = expandedCats.has(cat);
            return (
              <div key={cat} className="rounded-lg border border-zinc-800 overflow-hidden">
                {/* Category header */}
                <button
                  onClick={() => toggleCat(cat)}
                  className="w-full px-3 py-2 flex items-center justify-between bg-zinc-900/40 hover:bg-zinc-900/70 transition"
                >
                  <div className="flex items-center gap-2">
                    {expanded ? (
                      <ChevronDown className="w-4 h-4 text-zinc-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-zinc-400 rtl:rotate-180" />
                    )}
                    <span className="text-sm font-medium text-zinc-200">
                      {t(`p4.category.${cat}`)}
                    </span>
                    <span className="text-xs text-zinc-500">({catData.images.length})</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${tierColor(catData.tier)}`}>
                    {t(`p4.tier.${catData.tier}`)}
                  </span>
                </button>

                {/* Category content (collapsible) */}
                {expanded && (
                  <div className="p-3 space-y-3">
                    {/* Image grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {catData.images.map((img, i) => (
                        <div
                          key={`${img.url}-${i}`}
                          className="group relative rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900/40 hover:border-purple-500/40 transition"
                        >
                          {/* Image */}
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={img.url}
                            alt={img.alt}
                            className="w-full aspect-[4/3] object-cover"
                            loading="lazy"
                          />
                          {/* Source badge */}
                          <span className={`absolute top-1.5 left-1.5 rtl:left-auto rtl:right-1.5 text-[9px] px-1.5 py-0.5 rounded border ${tierColor(img.source)}`}>
                            {t(`p4.tier.${img.source}`)}
                          </span>
                          {/* Hover actions */}
                          <div className="absolute inset-0 bg-zinc-950/80 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => copyUrl(img.url)}
                              className="px-2 py-1 text-[10px] bg-zinc-900/90 hover:bg-zinc-800 rounded text-zinc-200 flex items-center gap-1"
                              title={t('p4.copyUrl')}
                            >
                              {copiedUrl === img.url ? (
                                <><Check className="w-3 h-3 text-emerald-400" />{t('p4.copied')}</>
                              ) : (
                                <><Copy className="w-3 h-3" />URL</>
                              )}
                            </button>
                            {onImageSelect && (
                              <button
                                onClick={() => onImageSelect(img)}
                                className="px-2 py-1 text-[10px] bg-purple-500/90 hover:bg-purple-500 rounded text-white flex items-center gap-1"
                                title={t('p4.useThis')}
                              >
                                <ImageIcon className="w-3 h-3" />{t('p4.useThis')}
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* AI generate button */}
                    {allowGeneration && (
                      <button
                        onClick={() => generateImage(cat)}
                        disabled={generating}
                        className="w-full px-3 py-2 text-xs bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 rounded-lg text-white flex items-center justify-center gap-2 transition"
                      >
                        {generating ? (
                          <><Loader2 className="w-3 h-3 animate-spin" />{t('p4.generating')}</>
                        ) : (
                          <><Wand2 className="w-3 h-3" />{t('p4.generateNew')}</>
                        )}
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ─── Fallback chain log (collapsible) ─── */}
      {!loading && fallbackLog.length > 0 && (
        <details className="mt-4 text-xs">
          <summary className="cursor-pointer text-zinc-500 hover:text-zinc-400 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" />
            {t('p4.fallbackChain')} ({fallbackLog.length} {isFa ? 'مرحله' : 'steps'})
          </summary>
          <div className="mt-2 p-2 rounded bg-zinc-900/60 border border-zinc-800 max-h-48 overflow-y-auto">
            {fallbackLog.map((line, i) => (
              <div key={i} className="text-[11px] text-zinc-500 font-mono py-0.5">
                {line}
              </div>
            ))}
          </div>
        </details>
      )}

      {/* ─── Empty state ─── */}
      {!selectedIndustry && !compact && (
        <div className="py-12 text-center text-zinc-500">
          <Layers className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">{t('p4.selectIndustry')}</p>
        </div>
      )}
    </div>
  );
}
