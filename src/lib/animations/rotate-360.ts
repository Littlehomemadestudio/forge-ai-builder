import type { AnimationDef } from './types';

// ─── 360° Rotation ────────────────────────────────────────────────────────
// Product image rotates a full 360° on hover. Uses CSS transform with
// perspective on the parent. Trigger class: .forge-rotate-360 on the image;
// add .forge-rotate-stage to the parent for the perspective.
// Also supports auto-rotate once on intersection (entrance effect).

export const rotate360: AnimationDef = {
  id: 'rotate-360',
  nameEn: '360° Rotation',
  nameFa: 'چرخش ۳۶۰ درجه',
  category: 'hover',
  icon: '🔄',
  accent: '#F472B6',
  descEn: 'Product image performs a full 360° rotation on hover, with 3D perspective on the parent stage. Ideal for e-commerce product cards.',
  descFa: 'تصویر محصول هنگام هاور یک چرخش کامل ۳۶۰ درجه با پرسپکتیو سه‌بعدی روی والد انجام می‌دهد. ایده‌آل برای کارت‌های محصول فروشگاه‌ها.',
  triggers: ['.forge-rotate-360', '.forge-rotate-stage'],
  keywords: [
    '360 rotation', '360 rotate', 'rotate 360', 'product rotation', 'spin image',
    'چرخش ۳۶۰', 'چرخش سیصد و شصت', 'دوران ۳۶۰',
  ],
  snippet: {
    css: `/* ── Forge Animation: 360° Rotation ── */
.forge-rotate-stage {
  perspective: 800px;
  perspective-origin: center center;
}
.forge-rotate-360 {
  transform-style: preserve-3d;
  transition: transform 1.4s cubic-bezier(0.22, 0.61, 0.36, 1);
  will-change: transform;
}
.forge-rotate-stage:hover .forge-rotate-360,
.forge-rotate-360:hover {
  transform: rotateY(360deg);
}
/* Auto spin once on entrance (when .forge-rotated-in is added by IntersectionObserver) */
.forge-rotate-360.forge-rotated-in {
  animation: forge-rotate-once 1.4s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
}
@keyframes forge-rotate-once {
  from { transform: rotateY(0); }
  to   { transform: rotateY(360deg); }
}
@media (prefers-reduced-motion: reduce) {
  .forge-rotate-360,
  .forge-rotate-stage:hover .forge-rotate-360,
  .forge-rotate-360:hover,
  .forge-rotate-360.forge-rotated-in {
    animation: none;
    transform: none;
    transition: none;
  }
}`,
    js: `/* ── Forge Animation: 360° Rotation (entrance observer) ── */
(function(){
  function initForgeRotate(){
    var els = document.querySelectorAll('.forge-rotate-360:not([data-forge-rotated])');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) {
      els.forEach(function(el){
        el.classList.add('forge-rotated-in');
        el.setAttribute('data-forge-rotated', '1');
      });
      return;
    }
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting) {
          entry.target.classList.add('forge-rotated-in');
          entry.target.setAttribute('data-forge-rotated', '1');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    els.forEach(function(el){ io.observe(el); });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initForgeRotate);
  } else {
    initForgeRotate();
  }
})();`,
  },
  demo: {
    html: `<div style="display:flex;gap:24px;align-items:center;justify-content:center;padding:20px">
  <div class="forge-rotate-stage">
    <img class="forge-rotate-360" src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400" alt="Sneaker" style="width:160px;height:160px;object-fit:cover;border-radius:12px">
  </div>
  <div style="color:#475569;font-size:14px;font-family:system-ui">← Hover the image</div>
</div>`,
    css: `body{background:#f1f5f9}`,
  },
};

export default rotate360;
