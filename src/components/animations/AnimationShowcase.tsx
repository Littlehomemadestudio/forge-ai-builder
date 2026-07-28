'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from '@/lib/useTranslation';
import { ALL_ANIMATIONS, ANIMATIONS, buildAnimationBundle } from '@/lib/animations';
import type { AnimationDef, AnimationCategory } from '@/lib/animations';
import {
  Sparkles, Search, Copy, Check, ChevronDown, ChevronRight,
  Code2, Play, RotateCcw, Wand2,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────

interface AnimationShowcaseProps {
  /** Pre-select an animation by id */
  initialId?: string;
  /** Hide the search/filter UI (compact mode) */
  compact?: boolean;
  /** Show only a specific category */
  onlyCategory?: AnimationCategory;
  /** Called when the user picks an animation */
  onSelect?: (id: string) => void;
}

type Tab = 'preview' | 'css' | 'js';

const CATEGORY_LABELS: Record<AnimationCategory, { en: string; fa: string; color: string }> = {
  'visual':      { en: 'Visual',      fa: 'بصری',         color: 'bg-violet-500/15 text-violet-300 border-violet-500/30' },
  'scroll':      { en: 'Scroll',      fa: 'اسکرول',       color: 'bg-sky-500/15 text-sky-300 border-sky-500/30' },
  'loading':     { en: 'Loading',     fa: 'بارگذاری',     color: 'bg-slate-500/15 text-slate-300 border-slate-500/30' },
  'hover':       { en: 'Hover',       fa: 'هاور',         color: 'bg-pink-500/15 text-pink-300 border-pink-500/30' },
  'metric':      { en: 'Metric',      fa: 'متریک',        color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
  'interaction': { en: 'Interaction', fa: 'تعاملی',       color: 'bg-rose-500/15 text-rose-300 border-rose-500/30' },
};

// ─── Component ──────────────────────────────────────────────────────────────

export default function AnimationShowcase({
  initialId,
  compact = false,
  onlyCategory,
  onSelect,
}: AnimationShowcaseProps) {
  const { t, lang } = useTranslation();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<AnimationCategory | 'all'>('all');
  const [selectedId, setSelectedId] = useState<string | null>(initialId || null);
  const [tab, setTab] = useState<Tab>('preview');
  const [copied, setCopied] = useState<'css' | 'js' | null>(null);
  const [iframeKey, setIframeKey] = useState(0);
  const previewRef = useRef<HTMLIFrameElement>(null);

  // Reset selection when initialId changes
  useEffect(() => {
    if (initialId) setSelectedId(initialId);
  }, [initialId]);

  // Filter animations
  const filtered = useMemo(() => {
    let list = ALL_ANIMATIONS;
    if (onlyCategory) list = list.filter(a => a.category === onlyCategory);
    if (categoryFilter !== 'all' && !onlyCategory) list = list.filter(a => a.category === categoryFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(a =>
        a.nameEn.toLowerCase().includes(q) ||
        a.nameFa.includes(search) ||
        a.descEn.toLowerCase().includes(q) ||
        a.descFa.includes(search) ||
        a.keywords.some(k => k.toLowerCase().includes(q))
      );
    }
    return list;
  }, [search, categoryFilter, onlyCategory]);

  const selected = selectedId ? ANIMATIONS[selectedId as keyof typeof ANIMATIONS] : null;

  // Build the iframe document for the live preview
  const previewDoc = useMemo(() => {
    if (!selected) return '';
    const bundle = buildAnimationBundle([selected.id]);
    return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  * { box-sizing: border-box; }
  body { margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif; min-height: 100vh; }
  ${selected.demo.css || ''}
  ${bundle.css}
</style>
</head>
<body>
${selected.demo.html}
<script>
${bundle.js}
</script>
</body>
</html>`;
  }, [selected, lang]);

  // Copy code to clipboard
  const handleCopy = async (which: 'css' | 'js') => {
    if (!selected) return;
    const text = which === 'css' ? selected.snippet.css : (selected.snippet.js || '');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(which);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      // ignore
    }
  };

  // Re-render iframe (re-trigger animations)
  const replayPreview = () => setIframeKey(k => k + 1);

  return (
    <div className="forge-animation-showcase" dir={lang === 'fa' ? 'rtl' : 'ltr'}>
      {/* ── Header ── */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-bold text-white">
            {lang === 'fa' ? t('p5.title') : 'Animation Library'}
          </h3>
          <p className="text-xs text-white/50">
            {lang === 'fa'
              ? '۶ انیمیشن آماده — در هر سایتی به‌طور خودکار تزریق می‌شود'
              : '6 ready-to-use animations — auto-injected into every generated site'}
          </p>
        </div>
        <span className="text-[10px] px-2 py-1 rounded-full bg-white/10 text-white/70 border border-white/10">
          {ALL_ANIMATIONS.length} {lang === 'fa' ? 'انیمیشن' : 'animations'}
        </span>
      </div>

      {/* ── Search & filter ── */}
      {!compact && (
        <div className="mb-4 space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={lang === 'fa' ? 'جستجوی انیمیشن...' : 'Search animations...'}
              className="w-full pl-9 pr-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 transition-colors"
            />
          </div>
          {!onlyCategory && (
            <div className="flex flex-wrap gap-1.5">
              <FilterChip active={categoryFilter === 'all'} onClick={() => setCategoryFilter('all')}>
                {lang === 'fa' ? 'همه' : 'All'}
              </FilterChip>
              {(Object.keys(CATEGORY_LABELS) as AnimationCategory[]).map(cat => (
                <FilterChip
                  key={cat}
                  active={categoryFilter === cat}
                  onClick={() => setCategoryFilter(cat)}
                >
                  {lang === 'fa' ? CATEGORY_LABELS[cat].fa : CATEGORY_LABELS[cat].en}
                </FilterChip>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Animation grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
        {filtered.map(anim => (
          <button
            key={anim.id}
            onClick={() => { setSelectedId(anim.id); setTab('preview'); replayPreview(); }}
            className={`group relative p-3 rounded-xl border text-left transition-all ${
              selectedId === anim.id
                ? 'bg-violet-500/15 border-violet-500/50 shadow-lg shadow-violet-500/10'
                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
            }`}
            style={{ borderColor: selectedId === anim.id ? anim.accent + '80' : undefined }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl leading-none">{anim.icon}</span>
              <span className="text-sm font-semibold text-white truncate">
                {lang === 'fa' ? anim.nameFa : anim.nameEn}
              </span>
            </div>
            <span className={`inline-block text-[10px] px-1.5 py-0.5 rounded border ${CATEGORY_LABELS[anim.category].color}`}>
              {lang === 'fa' ? CATEGORY_LABELS[anim.category].fa : CATEGORY_LABELS[anim.category].en}
            </span>
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-6 text-white/40 text-sm">
            {lang === 'fa' ? 'انیمیشنی یافت نشد' : 'No animations found'}
          </div>
        )}
      </div>

      {/* ── Selected animation detail ── */}
      {selected && (
        <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
          {/* Title row */}
          <div className="flex items-center gap-3 p-3 border-b border-white/10">
            <span className="text-2xl">{selected.icon}</span>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-white truncate">
                {lang === 'fa' ? selected.nameFa : selected.nameEn}
              </h4>
              <p className="text-[11px] text-white/50 line-clamp-2 mt-0.5">
                {lang === 'fa' ? selected.descFa : selected.descEn}
              </p>
            </div>
            {onSelect && (
              <button
                onClick={() => onSelect(selected.id)}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-violet-500 to-pink-500 text-white hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                {lang === 'fa' ? 'استفاده' : 'Use'}
              </button>
            )}
          </div>

          {/* Tab bar */}
          <div className="flex items-center gap-1 px-3 pt-2 border-b border-white/10">
            <TabButton active={tab === 'preview'} onClick={() => setTab('preview')} icon={<Play className="w-3.5 h-3.5" />}>
              {lang === 'fa' ? 'پیش‌نمایش زنده' : 'Live Preview'}
            </TabButton>
            <TabButton active={tab === 'css'} onClick={() => setTab('css')} icon={<Code2 className="w-3.5 h-3.5" />}>
              CSS
            </TabButton>
            <TabButton
              active={tab === 'js'}
              onClick={() => setTab('js')}
              icon={<Code2 className="w-3.5 h-3.5" />}
              disabled={!selected.snippet.js}
            >
              JS {!selected.snippet.js && <span className="text-[9px] text-white/30 ml-1">(none)</span>}
            </TabButton>
            <div className="flex-1" />
            {tab === 'preview' && (
              <button
                onClick={replayPreview}
                title={lang === 'fa' ? 'اجرا مجدد' : 'Replay'}
                className="p-1.5 rounded-md hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
            {(tab === 'css' || tab === 'js') && (
              <button
                onClick={() => handleCopy(tab)}
                disabled={tab === 'js' && !selected.snippet.js}
                className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded-md bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors disabled:opacity-30"
              >
                {copied === tab ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copied === tab ? (lang === 'fa' ? 'کپی شد' : 'Copied') : (lang === 'fa' ? 'کپی' : 'Copy')}
              </button>
            )}
          </div>

          {/* Tab content */}
          <div className="p-3">
            {tab === 'preview' && (
              <div className="relative">
                <iframe
                  key={iframeKey}
                  ref={previewRef}
                  srcDoc={previewDoc}
                  title={`preview-${selected.id}`}
                  className="w-full h-[260px] rounded-lg bg-white border border-white/10"
                  sandbox="allow-scripts allow-same-origin"
                />
                <div className="mt-2 flex flex-wrap gap-1">
                  {selected.triggers.map(trig => (
                    <code key={trig} className="text-[10px] px-1.5 py-0.5 rounded bg-black/40 text-violet-300 border border-violet-500/20 font-mono">
                      {trig}
                    </code>
                  ))}
                </div>
              </div>
            )}

            {tab === 'css' && (
              <pre className="text-[11px] leading-relaxed font-mono text-white/80 overflow-x-auto max-h-[260px] p-3 bg-black/40 rounded-lg border border-white/10">
                <code>{selected.snippet.css}</code>
              </pre>
            )}

            {tab === 'js' && selected.snippet.js && (
              <pre className="text-[11px] leading-relaxed font-mono text-white/80 overflow-x-auto max-h-[260px] p-3 bg-black/40 rounded-lg border border-white/10">
                <code>{selected.snippet.js}</code>
              </pre>
            )}

            {tab === 'js' && !selected.snippet.js && (
              <div className="text-center py-8 text-white/40 text-xs">
                {lang === 'fa' ? 'این انیمیشن فقط CSS دارد' : 'This animation is pure CSS — no JS needed.'}
              </div>
            )}
          </div>

          {/* Keywords footer */}
          <div className="px-3 pb-3 pt-1 border-t border-white/10">
            <div className="text-[10px] text-white/40 mb-1">
              {lang === 'fa' ? 'کلمات کلیدی (در پرامپت کاربر)' : 'Auto-detect keywords (in user prompt)'}:
            </div>
            <div className="flex flex-wrap gap-1">
              {selected.keywords.slice(0, 6).map(kw => (
                <span key={kw} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/50 border border-white/10">
                  {kw}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
        active
          ? 'bg-violet-500/20 border-violet-500/50 text-white'
          : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:border-white/20'
      }`}
    >
      {children}
    </button>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  disabled,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors disabled:opacity-30 ${
        active
          ? 'border-violet-500 text-white'
          : 'border-transparent text-white/50 hover:text-white/80'
      }`}
    >
      {icon}
      {children}
    </button>
  );
}
