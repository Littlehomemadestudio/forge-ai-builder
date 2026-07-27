// ─── Industry types for Phase 4 ───────────────────────────────────────────
// Comprehensive industry metadata + categorized image library.

export type ImageCategory =
  | 'hero'         // Large hero/banner background image
  | 'product'      // Product close-up or product card image
  | 'lifestyle'    // In-context lifestyle usage
  | 'team'         // Team / staff / founder photos
  | 'workspace'    // Workspace / storefront / interior
  | 'detail';      // Close-up detail / texture / ingredient

export type ImageSource = 'curated' | 'search' | 'generated' | 'placeholder';

export interface IndustryImage {
  url: string;
  alt: string;
  source: ImageSource;
  category: ImageCategory;
  width?: number;
  height?: number;
  // For generated/placeholder images
  base64?: string;
}

export interface IndustryPalette {
  light: { bg: string; surface: string; accent: string; text: string; muted: string };
  dark: { bg: string; surface: string; accent: string; text: string; muted: string };
}

export interface IndustrySubGroup {
  id: string;
  nameEn: string;
  nameFa: string;
  keywords: string[];   // keywords in both EN + FA for detection
}

export interface IndustryMeta {
  id: string;
  nameEn: string;
  nameFa: string;
  // Top-level group (e.g. "E-commerce", "Food & Beverage")
  group: string;
  groupFa: string;
  // Keywords used by the auto-detector (English + Persian)
  keywords: string[];
  // Sub-industries / specializations
  subIndustries: IndustrySubGroup[];
  // Suggested color palette for this industry
  palette: IndustryPalette;
  // Suggested site sections for this industry
  suggestedSections: string[];
  // Sample products / services (used as content inspiration)
  sampleProducts: string[];
  // Image search keywords per category (used for SDK image search fallback)
  imageSearchKeywords: Record<ImageCategory, string[]>;
  // Font pairing suggestion
  fontPairing: string;
  // Decorative pattern hint (optional)
  patternHint?: string;
}

export const IMAGE_CATEGORIES: ImageCategory[] = [
  'hero', 'product', 'lifestyle', 'team', 'workspace', 'detail'
];

export const CATEGORY_LABELS_EN: Record<ImageCategory, string> = {
  hero: 'Hero / Banner',
  product: 'Product',
  lifestyle: 'Lifestyle',
  team: 'Team',
  workspace: 'Workspace / Interior',
  detail: 'Detail / Texture',
};

export const CATEGORY_LABELS_FA: Record<ImageCategory, string> = {
  hero: 'هیرو / بنر',
  product: 'محصول',
  lifestyle: 'لایف‌استایل',
  team: 'تیم',
  workspace: 'فضای کاری / داخلی',
  detail: 'جزئیات / بافت',
};
