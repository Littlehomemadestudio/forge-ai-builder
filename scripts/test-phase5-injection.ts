// Quick unit test: verify Phase 5 animation injection works correctly.
// Runs the injection helper on a sample HTML payload and prints results.
// Run: bun forge-ai-builder/scripts/test-phase5-injection.ts

import { buildAnimationBundle, detectAnimations, ANIMATIONS } from '../src/lib/animations';

const samplePrompt = "Build a Persian carpet e-commerce store with glassmorphism header, parallax hero, count-up stats showing 15000+ customers, skeleton loaders, and shake-cart";

const detected = detectAnimations(samplePrompt);
console.log('=== Detection ===');
console.log('Prompt:', samplePrompt);
console.log('Detected animations:', detected.map(id => `${id} (${ANIMATIONS[id].nameEn})`));
console.log('');

const bundle = buildAnimationBundle(detected);
console.log('=== Bundle ===');
console.log('IDs:', bundle.ids);
console.log('Names EN:', bundle.namesEn);
console.log('Names FA:', bundle.namesFa);
console.log('CSS length:', bundle.css.length, 'chars');
console.log('JS length:', bundle.js.length, 'chars');
console.log('');

function injectAnimationBundle(html: string, ids: typeof detected): string {
  if (ids.length === 0) return html;
  const b = buildAnimationBundle(ids);
  if (!b.css && !b.js) return html;
  let out = html;
  const cssBlock = `\n/* === FORGE ANIMATION LIBRARY (auto-injected) === */\n/* Includes: ${b.namesEn.join(', ')} */\n${b.css}\n/* === END FORGE ANIMATION LIBRARY === */\n`;
  const styleMatch = out.match(/<style[^>]*>/i);
  if (styleMatch && styleMatch.index !== undefined) {
    const insertAt = styleMatch.index + styleMatch[0].length;
    out = out.slice(0, insertAt) + cssBlock + out.slice(insertAt);
  } else {
    const headMatch = out.match(/<head[^>]*>/i);
    if (headMatch && headMatch.index !== undefined) {
      const insertAt = headMatch.index + headMatch[0].length;
      out = out.slice(0, insertAt) + `\n<style id="forge-animations">${cssBlock}</style>\n` + out.slice(insertAt);
    }
  }
  if (b.js) {
    const jsBlock = `\n<script id="forge-animations-js">\n/* === FORGE ANIMATION LIBRARY (auto-injected) === */\n/* Includes: ${b.namesEn.join(', ')} */\n${b.js}\n/* === END FORGE ANIMATION LIBRARY === */\n</script>\n`;
    const bodyEnd = out.toLowerCase().lastIndexOf('</body>');
    if (bodyEnd !== -1) {
      out = out.slice(0, bodyEnd) + jsBlock + out.slice(bodyEnd);
    } else {
      out = out + jsBlock;
    }
  }
  return out;
}

const sampleHtml = `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="utf-8">
  <title>Carpet Bazaar</title>
  <style>
    body { font-family: sans-serif; margin: 0; }
    .hero { background: #1a1a24; color: #fff; padding: 80px 24px; }
  </style>
</head>
<body>
  <header class="forge-glass">Welcome to Carpet Bazaar</header>
  <section class="forge-parallax">
    <div class="forge-parallax-bg" style="background-image:url('https://example.com/hero.jpg')"></div>
    <h1>Handmade Persian Rugs</h1>
  </section>
  <section class="stats">
    <div data-count-target="15000" data-count-suffix="+">0</div>
    <div data-count-target="98" data-count-suffix="%">0</div>
  </section>
  <section class="products">
    <div class="forge-skeleton forge-skeleton-block"></div>
    <div class="forge-skeleton forge-skeleton-block"></div>
  </section>
  <button data-shake-target="#cart">Add to cart</button>
  <div id="cart">Cart (0)</div>
</body>
</html>`;

const injected = injectAnimationBundle(sampleHtml, detected);

console.log('=== Injection Result ===');
console.log('Original HTML length:', sampleHtml.length);
console.log('Injected HTML length:', injected.length);
console.log('Delta:', injected.length - sampleHtml.length, 'chars added');
console.log('');

console.log('=== Verification ===');
const checks: [string, string][] = [
  ['FORGE ANIMATION LIBRARY (auto-injected)', 'Injection marker (CSS)'],
  ['forge-animations-js',                     'Injection script tag id'],
  ['.forge-glass {',                          'Glassmorphism CSS rule'],
  ['backdrop-filter: blur(14px)',             'Glassmorphism blur effect'],
  ['.forge-parallax-bg {',                    'Parallax CSS rule'],
  ['@keyframes forge-skeleton-shimmer',       'Skeleton keyframes'],
  ['forge-skeleton-shimmer 1.6s infinite',    'Skeleton animation duration'],
  ['function runCount(el)',                   'Count-up JS function'],
  ['requestAnimationFrame(frame)',            'Count-up uses rAF'],
  ['window.forgeShake',                       'Shake JS helper defined'],
  ['data-shake-target',                       'Shake auto-wire selector'],
  ['prefers-reduced-motion: reduce',          'Reduced-motion accessibility'],
  ['@keyframes forge-shake',                  'Shake keyframes'],
  ['@keyframes forge-rotate-once',            '360 rotate keyframes'],
];
let passed = 0, failed = 0;
for (const [needle, label] of checks) {
  const found = injected.includes(needle);
  console.log(`  ${found ? '\u2713' : '\u2717'} ${label.padEnd(40)} | "${needle}"`);
  if (found) passed++; else failed++;
}
console.log('');
console.log(`Result: ${passed} passed, ${failed} failed out of ${checks.length}`);
console.log('');

const fs = require('fs');
fs.writeFileSync('/tmp/phase5-injected-test.html', injected);
console.log('Saved injected HTML to /tmp/phase5-injected-test.html');
