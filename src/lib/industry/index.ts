import type { IndustryMeta, ImageCategory } from './types';
import { ECOMMERCE_INDUSTRIES } from './ecommerce';
import { FOOD_INDUSTRIES } from './food';
import { SERVICES_INDUSTRIES } from './services';
import { TECH_EDU_CREATIVE_INDUSTRIES } from './tech-edu-creative';
import { MISC_INDUSTRIES } from './misc';

// ─── Unified industry registry ────────────────────────────────────────────
// 40+ industries across 7 groups.

export const ALL_INDUSTRIES: IndustryMeta[] = [
  ...ECOMMERCE_INDUSTRIES,
  ...FOOD_INDUSTRIES,
  ...SERVICES_INDUSTRIES,
  ...TECH_EDU_CREATIVE_INDUSTRIES,
  ...MISC_INDUSTRIES,
];

export const INDUSTRY_MAP: Record<string, IndustryMeta> = Object.fromEntries(
  ALL_INDUSTRIES.map(i => [i.id, i])
);

export function getIndustryById(id: string): IndustryMeta | undefined {
  return INDUSTRY_MAP[id];
}

// ─── Auto-detection ────────────────────────────────────────────────────────
// Returns the best matching industry for a free-text prompt + its confidence.

export interface IndustryDetectionResult {
  industry: IndustryMeta;
  confidence: number;          // 0..1
  matchedKeywords: string[];
  detectedSubIndustry?: string;
}

export function detectIndustry(prompt: string): IndustryDetectionResult {
  const lower = prompt.toLowerCase();
  const scores: Array<{ meta: IndustryMeta; matched: string[]; score: number }> = [];

  for (const meta of ALL_INDUSTRIES) {
    const matched: string[] = [];
    let score = 0;

    // Top-level keyword matching
    for (const kw of meta.keywords) {
      if (lower.includes(kw.toLowerCase())) {
        matched.push(kw);
        score += kw.length > 6 ? 2 : 1; // longer keywords weigh more
      }
    }

    // Sub-industry keyword matching (worth a bit more, since they're specific)
    for (const sub of meta.subIndustries) {
      for (const kw of sub.keywords) {
        if (lower.includes(kw.toLowerCase())) {
          matched.push(`${sub.id}:${kw}`);
          score += 1.5;
        }
      }
    }

    if (score > 0) {
      scores.push({ meta, matched, score });
    }
  }

  scores.sort((a, b) => b.score - a.score);
  const top = scores[0];

  if (!top) {
    // Default fallback — generic business
    return {
      industry: INDUSTRY_MAP['generic-business'],
      confidence: 0,
      matchedKeywords: [],
    };
  }

  // Confidence: ratio of top score to second score (clear winner = high conf)
  const second = scores[1];
  const confidence = second
    ? Math.min(1, top.score / (second.score + 1))
    : 1;

  // Sub-industry detection (the matched sub-industry with most hits)
  let detectedSub: string | undefined;
  let subScore = 0;
  for (const sub of top.meta.subIndustries) {
    let s = 0;
    for (const kw of sub.keywords) {
      if (lower.includes(kw.toLowerCase())) s++;
    }
    if (s > subScore) {
      subScore = s;
      detectedSub = sub.id;
    }
  }

  return {
    industry: top.meta,
    confidence,
    matchedKeywords: top.matched,
    detectedSubIndustry: detectedSub,
  };
}

// ─── Group listings (for UI gallery) ───────────────────────────────────────

export function getIndustriesByGroup(): Array<{ group: string; groupFa: string; industries: IndustryMeta[] }> {
  const groups = new Map<string, { group: string; groupFa: string; industries: IndustryMeta[] }>();
  for (const ind of ALL_INDUSTRIES) {
    const key = ind.group;
    if (!groups.has(key)) {
      groups.set(key, { group: ind.group, groupFa: ind.groupFa, industries: [] });
    }
    groups.get(key)!.industries.push(ind);
  }
  return Array.from(groups.values());
}

// ─── Re-exports ────────────────────────────────────────────────────────────
export * from './types';
export type { IndustryMeta, IndustryImage, ImageCategory };
