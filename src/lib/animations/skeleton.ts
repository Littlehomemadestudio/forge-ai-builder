import type { AnimationDef } from './types';

// ─── Skeleton Loader ──────────────────────────────────────────────────────
// Shimmering placeholder shown while content loads. Auto-swaps when the real
// content arrives: add .forge-skeleton to a placeholder, then remove the
// element (or replace it) once content is ready.
// Trigger class: .forge-skeleton, .forge-skeleton-line, .forge-skeleton-block

export const skeleton: AnimationDef = {
  id: 'skeleton',
  nameEn: 'Skeleton Loader',
  nameFa: 'اسکلتون لودر',
  category: 'loading',
  icon: '💬',
  accent: '#94A3B8',
  descEn: 'Shimmering placeholder blocks shown while content loads. Drop-in class for any element — the shimmer runs automatically until you remove the class.',
  descFa: 'بلاک‌های جایگزین درخشنده که هنگام بارگذاری محتوا نمایش داده می‌شوند. کافیست کلاس را روی هر عنصر قرار دهید — درخشش به‌طور خودکار تا حذف کلاس ادامه می‌یابد.',
  triggers: ['.forge-skeleton'],
  keywords: [
    'skeleton', 'skeleton loader', 'shimmer', 'loading placeholder', 'content placeholder',
    'اسکلتون', 'اسکلتون لودر', 'درخشش', 'جایگزین بارگذاری',
  ],
  snippet: {
    css: `/* ── Forge Animation: Skeleton Loader ── */
.forge-skeleton {
  position: relative;
  overflow: hidden;
  background: #e2e8f0;
  border-radius: 8px;
  color: transparent !important;
  user-select: none;
  pointer-events: none;
}
.forge-skeleton::after {
  content: '';
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.65) 50%,
    transparent 100%
  );
  animation: forge-skeleton-shimmer 1.6s infinite;
}
.forge-skeleton-line {
  display: block;
  height: 12px;
  margin-bottom: 8px;
  border-radius: 6px;
}
.forge-skeleton-line:last-child { width: 65%; }
.forge-skeleton-block {
  display: block;
  width: 100%;
  height: 160px;
  border-radius: 12px;
}
.forge-skeleton-circle {
  display: inline-block;
  width: 44px;
  height: 44px;
  border-radius: 50%;
}
/* Dark-mode variant */
.dark .forge-skeleton,
.forge-skeleton.dark {
  background: #1e293b;
}
.dark .forge-skeleton::after,
.forge-skeleton.dark::after {
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.08) 50%,
    transparent 100%
  );
}
@media (prefers-reduced-motion: reduce) {
  .forge-skeleton::after { animation: none; opacity: 0.5; }
}
@keyframes forge-skeleton-shimmer {
  100% { transform: translateX(100%); }
}`,
  },
  demo: {
    html: `<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;max-width:480px">
  <div>
    <div class="forge-skeleton forge-skeleton-block"></div>
    <div style="margin-top:12px">
      <span class="forge-skeleton forge-skeleton-line" style="width:90%"></span>
      <span class="forge-skeleton forge-skeleton-line" style="width:70%"></span>
      <span class="forge-skeleton forge-skeleton-line" style="width:80%"></span>
    </div>
  </div>
  <div>
    <div class="forge-skeleton forge-skeleton-block"></div>
    <div style="margin-top:12px">
      <span class="forge-skeleton forge-skeleton-line" style="width:85%"></span>
      <span class="forge-skeleton forge-skeleton-line" style="width:60%"></span>
      <span class="forge-skeleton forge-skeleton-line" style="width:75%"></span>
    </div>
  </div>
</div>`,
    css: `body{background:#f8fafc;padding:24px;font-family:system-ui}`,
  },
};

export default skeleton;
