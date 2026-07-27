import type { AnimationDef } from './types';

// ─── Count-Up ─────────────────────────────────────────────────────────────
// Animates a number from 0 to its target value when the element enters the
// viewport. Uses requestAnimationFrame with ease-out cubic.
// Trigger: any element with data-count-target="1234" (and class .forge-count-up
// for opt-in). Optional data-count-suffix="+" data-count-prefix="$"
// data-count-duration="2000" (ms).

export const countUp: AnimationDef = {
  id: 'count-up',
  nameEn: 'Count-Up Number',
  nameFa: 'شمارنده افزایشی',
  category: 'metric',
  icon: '🔢',
  accent: '#34D399',
  descEn: 'Numbers animate from 0 to their target value when scrolled into view. Add data-count-target="N" to any element — works with prefixes ($), suffixes (+, %, K), and decimals.',
  descFa: 'اعداد هنگام ورود به نما از ۰ تا مقدار هدف انیمیشن می‌شوند. کافیست data-count-target="N" به هر عنصر اضافه کنید — با پیشوند ($)، پسوند (+، %، K) و اعشار کار می‌کند.',
  triggers: ['[data-count-target]', '.forge-count-up'],
  keywords: [
    'count up', 'count-up', 'countup', 'count-up animation', 'animated counter',
    'animated number', 'number animation', 'animated stat',
    'شمارنده افزایشی', 'شمارش افزایشی', 'عدد انیمیشنی', 'عدد متحرک',
  ],
  snippet: {
    css: `/* ── Forge Animation: Count-Up ── */
.forge-count-up,
[data-count-target] {
  font-variant-numeric: tabular-nums;
  font-feature-settings: "tnum";
  display: inline-block;
  /* Prevent layout shift before init runs */
  min-width: 1ch;
}
/* Optional pulse when the count finishes */
.forge-count-up.forge-count-done {
  animation: forge-count-pop 380ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes forge-count-pop {
  0%   { transform: scale(1); }
  50%  { transform: scale(1.12); }
  100% { transform: scale(1); }
}
@media (prefers-reduced-motion: reduce) {
  .forge-count-up,
  [data-count-target] { transition: none; animation: none; }
}`,
    js: `/* ── Forge Animation: Count-Up (init) ── */
(function(){
  function easeOutCubic(t){ return 1 - Math.pow(1 - t, 3); }

  function runCount(el){
    var target = parseFloat(el.getAttribute('data-count-target') || '0');
    if (isNaN(target)) return;
    var prefix = el.getAttribute('data-count-prefix') || '';
    var suffix = el.getAttribute('data-count-suffix') || '';
    var duration = parseInt(el.getAttribute('data-count-duration') || '2000', 10);
    var decimals = parseInt(el.getAttribute('data-count-decimals') || '0', 10);
    var useGroup = el.getAttribute('data-count-group') !== 'off';

    var start = null;
    function frame(ts){
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var value = target * easeOutCubic(progress);
      var formatted;
      if (decimals > 0) {
        formatted = value.toFixed(decimals);
      } else {
        formatted = Math.round(value).toString();
      }
      if (useGroup) {
        var parts = formatted.split('.');
        parts[0] = parts[0].replace(/\\B(?=(\\d{3})+(?!\\d))/g, ',');
        formatted = parts.join('.');
      }
      el.textContent = prefix + formatted + suffix;
      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        el.classList.add('forge-count-done');
      }
    }
    requestAnimationFrame(frame);
  }

  function initForgeCountUp(){
    var els = document.querySelectorAll('[data-count-target]:not([data-forge-counted])');
    if (!els.length) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach(function(el){
        var target = parseFloat(el.getAttribute('data-count-target') || '0');
        var prefix = el.getAttribute('data-count-prefix') || '';
        var suffix = el.getAttribute('data-count-suffix') || '';
        el.textContent = prefix + target + suffix;
        el.setAttribute('data-forge-counted', '1');
      });
      return;
    }
    if (!('IntersectionObserver' in window)) {
      els.forEach(function(el){ runCount(el); el.setAttribute('data-forge-counted', '1'); });
      return;
    }
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting) {
          runCount(entry.target);
          entry.target.setAttribute('data-forge-counted', '1');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    els.forEach(function(el){ io.observe(el); });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initForgeCountUp);
  } else {
    initForgeCountUp();
  }
})();`,
  },
  demo: {
    html: `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;text-align:center;color:#0f172a;font-family:system-ui">
  <div>
    <div style="font-size:36px;font-weight:800;color:#34D399" data-count-target="12847" data-count-suffix="+">0</div>
    <div style="font-size:12px;color:#64748b;margin-top:4px">Customers</div>
  </div>
  <div>
    <div style="font-size:36px;font-weight:800;color:#6366f1" data-count-target="98" data-count-suffix="%">0</div>
    <div style="font-size:12px;color:#64748b;margin-top:4px">Satisfaction</div>
  </div>
  <div>
    <div style="font-size:36px;font-weight:800;color:#f59e0b" data-count-target="2.4" data-count-decimals="1" data-count-prefix="$" data-count-suffix="M">0</div>
    <div style="font-size:12px;color:#64748b;margin-top:4px">Revenue</div>
  </div>
</div>`,
    css: `body{background:#f8fafc;padding:32px}`,
  },
};

export default countUp;
