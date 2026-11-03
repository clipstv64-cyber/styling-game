'use strict';
/* aligns the salon picture so its mirror frames the character (face of the picture -> face of the character) */
(() => {
  const IMG = { w: 1061, h: 1482, fx: 533, fy: 659, fw: 393 };   // face centre & width in the picture
  const CH = { fx: 200, fy: 228, fw: 184 };                       // face centre & width in character space (hair page)
  const img = document.getElementById('salon-img'), app = document.getElementById('app'), box = document.getElementById('bg-hair');
  if (!img) return;
  function fit() {
    if (GAME.page !== 'hair') return;
    const a = GAME.toScreen(CH.fx - CH.fw / 2, CH.fy), b = GAME.toScreen(CH.fx + CH.fw / 2, CH.fy), r = box.getBoundingClientRect();
    if (!r.width || b.x - a.x < 10) return;
    let s = (b.x - a.x) / IMG.fw;
    // the picture must always cover the scene
    s = Math.max(s, r.width / IMG.w, (r.height * .78) / IMG.h);
    const cx = (a.x + b.x) / 2 - r.left, cy = a.y - r.top;
    let x = cx - IMG.fx * s, y = cy - IMG.fy * s;
    x = Math.min(0, Math.max(r.width - IMG.w * s, x)); y = Math.min(0, y);
    img.style.width = IMG.w + 'px'; img.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px) scale(${s.toFixed(4)})`;
  }
  let t = 0; const later = (ms = 750) => { clearTimeout(t); t = setTimeout(fit, ms); };
  window.addEventListener('resize', () => later(120));
  new MutationObserver(() => later()).observe(app, { attributes: true, attributeFilter: ['data-page'] });
  if (img.complete) fit(); else img.addEventListener('load', fit);
  setTimeout(fit, 60); setTimeout(fit, 600);
})();
