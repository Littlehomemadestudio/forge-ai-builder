import type { AnimationDef } from './types';

// ─── Glassmorphism ────────────────────────────────────────────────────────
// Frosted-glass surface effect: backdrop-filter blur + semi-transparent bg
// + subtle border + soft shadow. Works on header, cards, modals, hero overlays.
// Trigger class: .forge-glass

export const glassmorphism: AnimationDef = {
  id: 'glassmorphism',
  nameEn: 'Glassmorphism',
  nameFa: 'افکت شیشه‌ای',
  category: 'visual',
  icon: '🪟',
  accent: '#A78BFA',
  descEn: 'Frosted-glass surface with backdrop blur, translucent background, and a soft inner glow. Use on headers, cards, and modals.',
  descFa: 'سطح شیشه‌ای مات با بلور پس‌زمینه، پس‌زمینه نیمه‌شفاف و درخشش داخلی ملایم. برای هدر، کارت‌ها و مودال‌ها.',
  triggers: ['.forge-glass'],
  keywords: [
    'glassmorphism', 'glass morphism', 'glass effect', 'frosted glass', 'blur glass',
    'افکت شیشه‌ای', 'شیشه‌ای', 'بلور شیشه‌ای', 'شیشه مات',
  ],
  snippet: {
    css: `/* ── Forge Animation: Glassmorphism ── */
.forge-glass {
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(14px) saturate(180%);
  -webkit-backdrop-filter: blur(14px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.22);
  border-radius: 16px;
}
/* Dark variant — swap on dark sections */
.forge-glass.dark {
  background: rgba(15, 23, 42, 0.55);
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
}
/* Strong variant — more opacity, less blur */
.forge-glass.solid {
  background: rgba(255, 255, 255, 0.22);
  backdrop-filter: blur(8px) saturate(140%);
  -webkit-backdrop-filter: blur(8px) saturate(140%);
}
/* Fallback when backdrop-filter is unsupported */
@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .forge-glass { background: rgba(255, 255, 255, 0.85); }
  .forge-glass.dark { background: rgba(15, 23, 42, 0.85); }
}`,
  },
  demo: {
    html: `<div class="forge-glass" style="padding:32px;max-width:360px;color:#1e293b">
  <h3 style="margin:0 0 8px;font-size:18px;font-weight:700">Frosted Card</h3>
  <p style="margin:0;font-size:14px;opacity:0.85">This card has the glassmorphism effect — backdrop blur, translucent fill, and a soft inner highlight.</p>
</div>`,
    css: `body{background:linear-gradient(135deg,#6366f1 0%,#ec4899 50%,#f59e0b 100%);min-height:200px;display:flex;align-items:center;justify-content:center;padding:24px;font-family:system-ui}`,
  },
};

export default glassmorphism;
