'use strict';
/* finalise wardrobe: new detailed pieces first, auto thumbnail boxes */
(() => {
  const order = DATA.ITEMS.map((it, i) => [it, i]);
  order.sort((a, b) => ((b[0].fresh ? 1 : 0) - (a[0].fresh ? 1 : 0)) || (a[1] - b[1]));
  DATA.ITEMS.length = 0; order.forEach(([it]) => DATA.ITEMS.push(it));
  // layering hints
  ['bot_flare', 'bot_cargo', 'bot_maxi'].forEach(id => { const i = DATA.ITEM_BY_ID[id]; if (i) i.overShoes = true; });
  ['outer_puffer', 'outer_varsity', 'outer_coat', 'top_sweater', 'dress_knit'].forEach(id => { const i = DATA.ITEM_BY_ID[id]; if (i) i.highNeck = true; });
  // glasses: long temple arms that run over the hair to the ears
  // arms continue from each frame's own little hinge, over the side hair, to the ears
  const END = { gl_round: [116, 204], gl_sun: [112, 196], gl_heart: [116, 200], gl_cat: [119, 195], gl_star: [133, 214], gl_aviator: [114, 198], gl_retro: [114, 198], gl_butterfly: [112, 198] };
  DATA.ITEMS.filter(i => i.cat === 'glasses').forEach(it => {
    const art = it.art, [x0, y0] = END[it.id] || [116, 200];
    it.art = c => { const r = art(c), fc = ['gl_heart', 'gl_star', 'gl_butterfly'].includes(it.id) ? U.shade(c, -22) : c === '#ffffff' ? '#d9dde6' : c;
      const d = `M${x0 + 2},${y0} C${x0 - 8},${y0 + 1} ${(x0 + 90) / 2},${y0 + 4} 90,${y0 + 11}`;
      const arm = `<path d="${d}" stroke="rgba(30,10,20,.22)" stroke-width="4.4" fill="none" stroke-linecap="round" transform="translate(0 1.5)"/><path d="${d}" stroke="${fc}" stroke-width="3.2" fill="none" stroke-linecap="round"/><path d="M${x0 - 2},${y0 - .8} C${x0 - 10},${y0} ${(x0 + 94) / 2},${y0 + 2.6} 96,${y0 + 7.5}" stroke="#fff" stroke-width=".8" fill="none" opacity=".35" stroke-linecap="round"/>`;
      return { ...r, body: ART.mirror(arm) + (r.body || '') }; };
  });
  WEAR.autoBox();
})();
