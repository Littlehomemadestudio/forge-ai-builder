import type { AnimationDef } from './types';

// ─── Parallax ─────────────────────────────────────────────────────────────
// Scroll-driven depth: background moves slower than foreground. Two modes:
//   1. CSS-only: background-attachment: fixed (cheap, works on most browsers)
//   2. JS rAF: translateY based on scrollY (smoother, works everywhere)
// Trigger class: .forge-parallax (wrapper), .forge-parallax-bg (moving layer)

export const parallax: AnimationDef = {
  id: 'parallax',
  nameEn: 'Parallax Scroll',
  nameFa: 'پارالاکس اسکرول',
  category: 'scroll',
  icon: '🪁',
  accent: '#38BDF8',
  descEn: 'Background layers move slower than foreground content as the user scrolls, creating a depth illusion. Auto-initialized on any .forge-parallax element.',
  descFa: 'لایه‌های پس‌زمینه با سرعت کمتری نسبت به محتوای پیش‌زمینه هنگام اسکرول حرکت می‌کنند و عمق بصری می‌سازند. به‌طور خودکار روی عناصر .forge-parallax فعال می‌شود.',
  triggers: ['.forge-parallax'],
  keywords: [
    'parallax', 'parallax effect', 'parallax scroll', 'depth scroll',
    'پارالاکس', 'افکت پارالاکس', 'اسکرول پارالاکس',
  ],
  snippet: {
    css: `/* ── Forge Animation: Parallax ── */
.forge-parallax {
  position: relative;
  overflow: hidden;
  isolation: isolate;
}
.forge-parallax-bg {
  position: absolute;
  inset: -10% 0;             /* extra height so translate doesn't reveal edges */
  z-index: -1;
  background-size: cover;
  background-position: center;
  will-change: transform;
  transform: translate3d(0, 0, 0);
}
/* Reduced-motion users get a static background */
@media (prefers-reduced-motion: reduce) {
  .forge-parallax-bg { transform: none !important; }
}`,
    js: `/* ── Forge Animation: Parallax (init) ── */
(function(){
  function initForgeParallax(){
    var layers = document.querySelectorAll('.forge-parallax-bg');
    if (!layers.length) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var ticking = false;
    function update(){
      var vh = window.innerHeight;
      layers.forEach(function(layer){
        var parent = layer.closest('.forge-parallax') || layer.parentElement;
        if (!parent) return;
        var rect = parent.getBoundingClientRect();
        // Only animate while the parent is in or near the viewport
        if (rect.bottom < -200 || rect.top > vh + 200) return;
        // How far the parent is from the viewport center, as a fraction of viewport height
        var offset = (rect.top + rect.height / 2 - vh / 2) / vh;
        // Background moves at 30% of scroll speed (slower = deeper)
        var translate = offset * 60;
        layer.style.transform = 'translate3d(0,' + translate.toFixed(2) + 'px,0)';
      });
      ticking = false;
    }
    function onScroll(){
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initForgeParallax);
  } else {
    initForgeParallax();
  }
})();`,
  },
  demo: {
    html: `<div class="forge-parallax" style="height:220px;border-radius:14px;overflow:hidden;position:relative">
  <div class="forge-parallax-bg" style="background-image:url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200')"></div>
  <div style="position:relative;z-index:1;height:100%;display:flex;align-items:center;justify-content:center;color:#fff;text-shadow:0 2px 8px rgba(0,0,0,.6);font-size:22px;font-weight:700">Scroll inside the panel →</div>
</div>`,
    css: `body{background:#0f172a;padding:20px;font-family:system-ui}`,
  },
};

export default parallax;
