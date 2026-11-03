'use strict';
/* =========================================================
   WEAR — detailed trousers & skirts
   ========================================================= */
(() => {
  const K = CK, { sh, cloth, st, fold, shine, button, sym, side, inleg, cr, line, mir, PAT, rivet, zipper } = K, C = DATA.C;

  /* trousers: outer ease fn, inner ease fn, hem y */
  const pants = (o = {}) => { const yH = o.hem || 906, eo = o.eo ?? 3, ei = o.ei ?? 2, wy = o.wy || 516;
    const hemO = K.BL(Math.min(yH, 900)) - (typeof eo === 'function' ? eo(yH, 1) : eo), hemI = K.IL(Math.min(yH, 900)) + (typeof ei === 'function' ? ei(yH, 1) : ei);
    return sym([[[200, wy], [K.BL(wy) - 2, wy]], [[K.BL(wy) - 2, wy], ...side(wy + 10, Math.min(yH, 900), eo, 22).slice(1)], [[hemO, yH], [hemI, yH + 1]], [[hemI, yH + 1], ...inleg(Math.min(yH, 900), 620, ei).slice(1), [199.5, 616]], [[199.5, 616], [200, 614]]]); };
  const waistband = (c, y = 516, h = 14, o = {}) => { const xl = K.BL(y) - 2, xr = 400 - xl, xl2 = K.BL(y + h) - 3, xr2 = 400 - xl2;
    return cloth(`M${xl},${y} L${xr},${y} L${xr2},${y + h} L${xl2},${y + h} Z`, o.c || sh(c, -6), { pat: o.pat, vert: false, ew: 1 }) + st(`M${xl + 1},${y + 2.5} L${xr - 1},${y + 2.5} M${xl2 + 1},${y + h - 2.5} L${xr2 - 1},${y + h - 2.5}`, o.thread || sh(c, -40), .7, .9); };
  const loops = (c, y = 513, h = 18, xs = [168, 186, 214, 232]) => xs.map(x => cloth(`M${x - 2.6},${y} L${x + 2.6},${y} L${x + 2.6},${y + h} L${x - 2.6},${y + h} Z`, sh(c, -4), { vert: false, ew: .8 }) + st(`M${x - 2.6},${y + 2} L${x + 2.6},${y + 2} M${x - 2.6},${y + h - 2} L${x + 2.6},${y + h - 2}`, '#e6be6a', .9, .8, '1.4 1')).join('');
  const thread = '#e6a84a';

  /* skirt: A-line from waist (y0) to hem (y1) with hem half-width w */
  const skirt = (y0, y1, w, o = {}) => { const wl = K.BL(y0) - (o.e0 ?? 2), curve = o.curve ?? 8;
    return sym([[[200, y0], [wl, y0]], [[wl, y0], ...(o.mid ? [[wl - (200 - w - wl) * .35 - (o.mid || 0), y0 + (y1 - y0) * .45]] : []), [200 - w, y1]], [[200 - w, y1], [200 - w * .55, y1 + curve * .8], [200, y1 + curve]]]); };
  const pleated = (c, y0, y1, w, n, o = {}) => { const wl = K.BL(y0) - 2, cv = o.curve ?? 8;
    const top = i => [wl + (400 - 2 * wl) * i / n, y0], bot = i => { const t = i / n, x = 200 - w + 2 * w * t; return [x, y1 + cv * Math.sin(Math.PI * t) + (i % 2 ? 2.5 : 0)]; };
    let s = cloth(skirt(y0, y1, w, { curve: cv }), c, { pat: o.pat, drop: o.drop ?? 6 });
    for (let i = 0; i < n; i++) { const a = top(i), b = top(i + 1), cB = bot(i + 1), dB = bot(i), shadeOp = i % 2 ? .1 : 0;
      if (shadeOp) s += `<path d="M${a[0]},${a[1]} L${b[0]},${b[1]} L${cB[0]},${cB[1]} L${dB[0]},${dB[1]} Z" fill="#000" opacity="${shadeOp}"/>`;
      if (i) s += fold(`M${a[0]},${a[1] + 4} L${dB[0]},${dB[1] - 1}`, c, 2.4, .42) + line(`M${a[0] + 1.2},${a[1] + 6} L${dB[0] + 1.8},${dB[1] - 2}`, '#fff', .9, .25); }
    s += line(Array.from({ length: n + 1 }, (_, i) => { const p = bot(i); return `${i ? 'L' : 'M'}${K.f(p[0])},${K.f(p[1])}`; }).join(' '), sh(c, -42), 1.3, .6);
    return s; };

  Object.assign(CK, { pants, waistband, loops, skirt, pleated });

  const BOTS = [
    /* --- Shorts (upgrade) --- */
    { id: 'bot_shorts', cat: 'bottom', slot: 'bottom', name: 'Shorts', colors: [C.rose, C.white, C.sky, C.mint, C.yellow, C.lilac],
      art: c => { const d = pants({ hem: 646, eo: (y, t) => 3 + t * 6, ei: (y, t) => 1 + t * .5 });
        return { body: cloth(d, c, { drop: 5 }) + waistband(c, 514, 15, { pat: PAT.rib(c) }) + line('M194,520 Q190,534 186,540 M206,520 Q210,534 214,540', '#fff', 1.8) + `<circle cx="186" cy="541" r="2" fill="#fff"/><circle cx="214" cy="541" r="2" fill="#fff"/>`
          + mir(st('M168,530 Q174,548 160,566', sh(c, -40), .6, 1) + fold('M196,560 Q190,580 186,600', c, 2.4, .3) + fold('M160,590 Q164,610 160,630', c, 2.2, .24)
            + cloth('M143,630 L196,634 L196.5,648 L141.5,645 Z', sh(c, -8), { vert: false, ew: 1 }) + st('M144,634 L196,638', sh(c, -40), .6, .9) + shine('M162,560 C160,590 160,610 162,626', 5, .2))
          + fold('M200,560 L200,612', c, 1.6, .3) }; } },

    /* --- Skinny Jeans (upgrade) --- */
    { id: 'bot_jeans', cat: 'bottom', slot: 'bottom', name: 'Skinny Jeans', colors: [C.denim, '#3d5a8a', '#9cbbe6', C.black, C.white, C.pink],
      art: c => { const d = pants({ eo: 2.5, ei: 1.5 });
        return { body: cloth(d, c, { pat: 'url(#pDenim)' }) + waistband(c, 514, 13, { thread })
          + mir(st('M170,528 Q176,546 158,562', thread, .9, 1.1) + line('M170,527 Q176,546 158,561', sh(c, -30), 1.2, .6)
            + st('M176,530 L184,530 L184,540 L176,541', thread, .8, .9) + rivet(171, 529, 1.6) + rivet(159, 561, 1.6)
            + `<ellipse cx="180" cy="736" rx="10" ry="26" fill="url(#faceGlow)" opacity=".5"/><ellipse cx="178" cy="610" rx="10" ry="30" fill="url(#faceGlow)" opacity=".5"/>`
            + fold('M188,588 L182,596 M190,598 L184,604', c, 1.6, .4) + fold('M166,770 Q178,778 190,772', c, 2.2, .28) + fold('M168,786 Q178,790 188,786', c, 1.8, .22) + fold('M170,880 Q180,884 190,880', c, 1.8, .3)
            + st('M170,898 L190,897', thread, .8, 1) + st(cr([[K.BL(560) + 0, 560], [K.BL(700) + 1, 700], [K.BL(860) + 1, 860]]), thread, .5, .9))
          + st('M200,528 L207,528 L207,566 Q207,574 200,578', thread, .9, 1.1) + loops(c, 512, 18, [166, 186, 214, 234]) + button(200, 521, 3.4, '#e6be6a', 0) + `<circle cx="200" cy="521" r="1.4" fill="#a07020"/>`
          + fold('M200,580 L200,612', c, 1.4, .35) }; } },

    /* --- Karo-Faltenrock --- */
    { id: 'bot_plaid', cat: 'bottom', slot: 'bottom', name: 'Karo-Faltenrock', autoBox: 1, colors: ['#d8323f', '#2f3f73', '#2f8a5a', '#ff8fc4', '#8b5cf6', '#c9965f'],
      art: c => { const tp = PAT.tartan(c, c === '#ff8fc4' ? '#ffffff' : '#ffd84d');
        return { body: pleated(c, 516, 650, 64, 12, { pat: tp }) + waistband(c, 514, 14, { pat: tp })
          + `<rect x="224" y="566" width="5" height="28" rx="2.5" fill="url(#gkSilver)" stroke="#8a90a0" stroke-width=".8"/><circle cx="226.5" cy="596" r="4" fill="none" stroke="#c8ccd6" stroke-width="2"/><circle cx="226.5" cy="582" r="2.4" fill="#ff4f9a"/>`
          + cloth('M162,520 L176,520 L176,530 L162,530 Z', '#2a2230', { vert: false, ew: .8 }) + `<rect x="172" y="518" width="8" height="14" rx="1.5" fill="none" stroke="url(#gkSilver)" stroke-width="2"/>` }; } },

    /* --- Cargohose --- */
    { id: 'bot_cargo', cat: 'bottom', slot: 'bottom', name: 'Cargohose', autoBox: 1, colors: ['#8a8f6a', '#e8d3b5', '#2a2230', '#c9a7ff', '#ff8fc4', '#ffffff'],
      art: c => { const d = pants({ hem: 900, eo: (y, t) => 6 + t * 10, ei: (y, t) => 4 + t * 6 });
        return { body: cloth(d, c) + waistband(c, 514, 14) + loops(c, 512, 18, [166, 186, 214, 234])
          + mir(K.pocket(140, 650, 32, 40, c, { flap: true, btn: sh(c, -30) }) + st('M170,528 Q176,546 158,562', sh(c, -40), .6, 1)
            + fold('M150,612 Q152,640 150,660', c, 2.4, .3) + fold('M188,700 Q182,720 186,740', c, 2.4, .3) + st(cr([[152, 744], [176, 746], [194, 744]]), sh(c, -40), .55, 1)
            + fold('M156,790 Q170,800 190,794', c, 2.6, .3) + fold('M154,830 Q168,838 192,832', c, 2.2, .26)
            + cloth('M150,882 L198,884 L197,900 L149,898 Z', sh(c, -8), { vert: false, ew: 1 }) + line('M176,884 Q172,896 168,906 M176,884 Q180,896 184,906', sh(c, -40), 1.2) + `<circle cx="168" cy="907" r="2" fill="${sh(c, -40)}"/><circle cx="184" cy="907" r="2" fill="${sh(c, -40)}"/>`
            + cloth('M150,560 L162,560 L162,600 L150,600 Z', sh(c, -10), { vert: false, ew: .8 }) + K.rivet(156, 566, 2, '#c8ccd6'))
          + st('M200,528 L207,528 L207,566 Q207,574 200,578', sh(c, -40), .7, 1) + button(200, 521, 3, sh(c, -25), 4) }; } },

    /* --- Schlaghose --- */
    { id: 'bot_flare', cat: 'bottom', slot: 'bottom', name: 'Schlaghose', autoBox: 1, colors: [C.denim, '#9cbbe6', '#ffffff', '#c9965f', '#ff8fc4'],
      art: c => { const fl = (y, t) => (y > 730 ? 2 + Math.pow((y - 730) / 170, 1.6) * 22 : 2), d = pants({ hem: 910, eo: fl, ei: (y, t) => (y > 730 ? 1.5 + Math.pow((y - 730) / 170, 1.6) * 8.5 : 1.5) });
        const fl1 = (x, y, r, col) => `<g>${[0, 60, 120, 180, 240, 300].map(a => `<ellipse cx="${x}" cy="${y - r}" rx="${r * .5}" ry="${r * .8}" fill="${col}" transform="rotate(${a} ${x} ${y})"/>`).join('')}<circle cx="${x}" cy="${y}" r="${r * .45}" fill="#ffd84d"/></g>`;
        return { body: cloth(d, c, { pat: 'url(#pDenim)' }) + waistband(c, 514, 13, { thread }) + loops(c, 512, 18, [166, 186, 214, 234]) + button(200, 521, 3.4, '#e6be6a', 0)
          + mir(st('M170,528 Q176,546 158,562', thread, .9, 1.1) + rivet(171, 529, 1.6) + fold('M164,770 Q178,778 192,772', c, 2.2, .28)
            + fold('M170,820 L160,900 M184,830 L186,906', c, 2.6, .3) + st('M146,902 Q172,908 200,904', thread, .8, 1)
            + fl1(166, 860, 6, '#ff8fc4') + fl1(182, 884, 5, '#ffffff') + fl1(156, 886, 4, '#ffd84d') + `<ellipse cx="174" cy="872" rx="5" ry="2" fill="#5fae6e" transform="rotate(-30 174 872)"/><ellipse cx="160" cy="874" rx="4" ry="1.8" fill="#5fae6e" transform="rotate(40 160 874)"/>`)
          + st('M200,528 L207,528 L207,566 Q207,574 200,578', thread, .9, 1.1) }; } },

    /* --- Lederrock --- */
    { id: 'bot_leather', cat: 'bottom', slot: 'bottom', name: 'Lederrock', autoBox: 1, colors: ['#2a2230', '#7a4f33', '#e8344e', '#ff8fc4', '#ffffff'],
      art: c => { const d = skirt(516, 640, 62, { curve: 6 });
        return { body: cloth(d, c, { sheen: 'leather', drop: 6 }) + waistband(c, 514, 14) + zipper(200, 528, 600, '#d9dde6')
          + mir(st('M166,532 L146,636', sh(c, 30), .45, 1) + fold('M178,560 Q172,600 164,636', c, 2.4, .35) + shine('M180,548 C176,580 172,610 168,632', 4, .3) + [168, 178, 188].map(x => rivet(x, 521, 2, '#d9dde6')).join(''))
          + st('M140,632 Q200,644 260,632', sh(c, 35), .45, 1) }; } },

    /* --- Volantrock --- */
    { id: 'bot_tiered', cat: 'bottom', slot: 'bottom', name: 'Volantrock', autoBox: 1, colors: ['#ffffff', '#ffc2d9', '#c9a7ff', '#ffd84d', '#7de3c5', '#2a2230'],
      art: c => { const lc = U.luma(c) > .8 ? sh(c, -6) : sh(c, 30);
        const tier = (y0, y1, w0, w1, col) => { const d = `M${200 - w0},${y0} L${200 + w0},${y0} L${200 + w1},${y1} Q200,${y1 + 6} ${200 - w1},${y1} Z`;
          let s = cloth(d, col, { drop: 5, dropOp: .12 });
          for (let i = 1; i < 10; i++) { const t = i / 10; s += fold(`M${200 - w0 + 2 * w0 * t},${y0 + 3} L${200 - w1 + 2 * w1 * t},${y1 - 1}`, col, 2.2, .26); }
          return s + st(`M${200 - w0},${y0 + 4} L${200 + w0},${y0 + 4}`, sh(col, -35), .5, .9, '1.5 1.5'); };
        return { body: tier(648, 724, 70, 92, c) + K.scallops(108, 292, 728, 4, lc, true, 0) + tier(584, 654, 54, 72, c) + tier(516, 590, 38, 56, c) + waistband(c, 514, 12, { pat: PAT.rib(c) }) }; } },

    /* --- Jogginghose --- */
    { id: 'bot_jogger', cat: 'bottom', slot: 'bottom', name: 'Jogginghose', autoBox: 1, colors: ['#b3adbd', '#ff8fc4', '#2a2230', '#2f3f73', '#c9a7ff', '#7de3c5'],
      art: c => { const d = pants({ hem: 886, eo: (y, t) => 6 + Math.sin(t * Math.PI) * 6, ei: (y, t) => 4 + Math.sin(t * Math.PI) * 3 }), sc = U.luma(c) > .7 ? '#ff4f9a' : '#ffffff';
        return { body: cloth(d, c) + waistband(c, 514, 16, { pat: PAT.rib(c) }) + line('M194,522 Q190,540 186,550 M206,522 Q210,540 214,550', '#fff', 1.8) + `<rect x="183.5" y="548" width="5" height="8" rx="2" fill="${sh(c, -30)}"/><rect x="211.5" y="548" width="5" height="8" rx="2" fill="${sh(c, -30)}"/>`
          + mir(line(cr([[K.BL(536) - 4, 536], [K.BL(640) - 5, 640], [K.BL(760) - 9, 760], [K.BL(870) - 6, 870]]), sc, 2.4) + line(cr([[K.BL(536), 536], [K.BL(640) - 1, 640], [K.BL(760) - 5, 760], [K.BL(870) - 2, 870]]), sc, 2.4)
            + st('M170,532 Q176,548 160,566', sh(c, -40), .55, 1) + fold('M160,760 Q176,770 194,762', c, 3, .3) + fold('M158,800 Q176,810 194,800', c, 2.6, .28) + fold('M160,840 Q176,850 192,842', c, 2.4, .26) + fold('M186,600 Q184,640 188,690', c, 2.4, .25)
            + cloth(`M${K.BL(876) - 7},872 L${K.IL(876) + 4},872 L${K.IL(896) + 1},896 L${K.BL(896)},896 Z`, sh(c, -8), { pat: PAT.rib(c), vert: false, ew: 1 }))
          + fold('M200,580 L200,612', c, 1.6, .3) }; } },

    /* --- Tennisrock --- */
    { id: 'bot_tennis', cat: 'bottom', slot: 'bottom', name: 'Tennisrock', autoBox: 1, colors: ['#2f3f73', '#ff4f9a', '#55c97a', '#8b5cf6', '#e8344e'],
      art: c => { const w = '#fbf8f4';
        return { body: pleated(w, 516, 632, 58, 14, { curve: 6 }) + `<path d="M144,618 Q200,628 256,618 L257,624 Q200,634 143,624 Z" fill="${c}"/><path d="M143,627 Q200,637 257,627 L257.5,630 Q200,640 142.5,630 Z" fill="${c}"/>` + waistband(w, 514, 13, { c: c }) }; } },
  ];
  BOTS.forEach(t => { t.fresh = 1; });
  WEAR.add(BOTS);
})();
