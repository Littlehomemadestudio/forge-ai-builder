import type { AnimationDef } from './types';

// ─── Shake Cart ───────────────────────────────────────────────────────────
// Cart icon shakes briefly when an item is added. Two parts:
//   1. The CSS animation (always shipped)
//   2. A tiny JS helper that adds .forge-shake to any element for 450ms
// Use: forgeShake(el) — or — element.classList.add('forge-shake'); setTimeout(()=>el.classList.remove('forge-shake'),450);

export const shakeCart: AnimationDef = {
  id: 'shake-cart',
  nameEn: 'Shake Cart',
  nameFa: 'تکان سبد خرید',
  category: 'interaction',
  icon: '🛒',
  accent: '#FB7185',
  descEn: 'The cart icon shakes briefly whenever an item is added — gives instant tactile feedback to the user. Works on any element via the .forge-shake class.',
  descFa: 'آیکون سبد خرید هنگام افزودن کالا به‌طور مختصر تکان می‌خورد — بازخورد لمسی فوری به کاربر. روی هر عنصر با کلاس .forge-shake کار می‌کند.',
  triggers: ['.forge-shake', '.forge-shake-target'],
  keywords: [
    'shake', 'shake animation', 'cart shake', 'shake cart', 'wobble',
    'تکان', 'تکان سبد', 'لرزش سبد', 'لرزش کارت',
  ],
  snippet: {
    css: `/* ── Forge Animation: Shake Cart ── */
.forge-shake {
  animation: forge-shake 450ms cubic-bezier(0.36, 0.07, 0.19, 0.97);
  transform-origin: 50% 50%;
}
@keyframes forge-shake {
  0%, 100%   { transform: translateX(0) rotate(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px) rotate(-7deg); }
  20%, 40%, 60%, 80%      { transform: translateX(5px)  rotate(7deg);  }
}
/* Variant: shake + scale pulse (more attention-grabbing) */
.forge-shake.forge-shake-pop {
  animation:
    forge-shake 450ms cubic-bezier(0.36, 0.07, 0.19, 0.97),
    forge-shake-pop 450ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes forge-shake-pop {
  0%   { filter: brightness(1); }
  40%  { filter: brightness(1.35); transform: scale(1.18); }
  100% { filter: brightness(1); transform: scale(1); }
}
@media (prefers-reduced-motion: reduce) {
  .forge-shake, .forge-shake.forge-shake-pop { animation: none; }
}`,
    js: `/* ── Forge Animation: Shake Cart (helper) ── */
window.forgeShake = function(el, opts){
  if (!el) return;
  var pop = opts && opts.pop;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var cls = pop ? 'forge-shake forge-shake-pop' : 'forge-shake';
  el.classList.remove('forge-shake', 'forge-shake-pop');
  // Force reflow so the animation can re-trigger
  void el.offsetWidth;
  if (pop) { el.classList.add('forge-shake', 'forge-shake-pop'); }
  else     { el.classList.add('forge-shake'); }
  setTimeout(function(){
    el.classList.remove('forge-shake', 'forge-shake-pop');
  }, 460);
};
/* Auto-wire any element with data-shake-on="click" — common for "Add to cart" buttons */
(function(){
  function initForgeShake(){
    var triggers = document.querySelectorAll('[data-shake-on], [data-shake-target]');
    triggers.forEach(function(btn){
      if (btn.getAttribute('data-forge-shake-wired') === '1') return;
      btn.setAttribute('data-forge-shake-wired', '1');
      btn.addEventListener('click', function(){
        var sel = btn.getAttribute('data-shake-target');
        var target = sel ? document.querySelector(sel) : btn;
        if (target && window.forgeShake) window.forgeShake(target, { pop: true });
      });
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initForgeShake);
  } else {
    initForgeShake();
  }
})();`,
  },
  demo: {
    html: `<div style="display:flex;gap:16px;align-items:center;justify-content:center;font-family:system-ui">
  <button id="forge-shake-demo-btn" data-shake-target="#forge-shake-demo-cart" style="background:#6366f1;color:#fff;border:none;padding:10px 20px;border-radius:10px;cursor:pointer;font-weight:600">Add to cart</button>
  <div id="forge-shake-demo-cart" style="position:relative;width:56px;height:56px;background:#fff;border:2px solid #fb7185;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:28px;box-shadow:0 4px 14px rgba(251,113,133,.3)">🛒</div>
</div>`,
    css: `body{background:#fef2f2;padding:32px}`,
  },
};

export default shakeCart;
