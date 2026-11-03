'use strict';
/* =========================================================
   WEAR — detailed dresses & one-pieces
   ========================================================= */
(() => {
  const K = CK, { sh, cloth, st, fold, shine, button, sym, side, cr, line, mir, PAT, gem, bow, lacing, ruffle, scallops } = K, C = DATA.C;
  const f = K.f;

  /* ---------- skirt geometry ---------- */
  const prof = (t, bell) => 1 - Math.pow(1 - t, 1 + bell);
  const fullSkirt = (y0, y1, wT, wH, o = {}) => { const bell = o.bell ?? .6, cv = o.curve ?? 10, wv = o.wave || 0, nw = o.waves || 6, sideP = [], hem = [];
    [0, .1, .25, .45, .7, .88, 1].forEach(t => sideP.push([200 - (wT + (wH - wT) * prof(t, bell)), y0 + (y1 - y0) * t]));
    for (let k = 0; k <= 12; k++) { const u = k / 12; hem.push([200 - wH + wH * u, y1 + cv * Math.sin(u * Math.PI / 2) + wv * (Math.cos(u * nw * Math.PI) * .5 + .5)]); }
    return sym([[[200, y0], [200 - wT, y0]], sideP, hem]); };
  const gathers = (y0, y1, wT, wH, n, c, o = {}) => { const bell = o.bell ?? .6, cv = o.curve ?? 10; let s = '';
    for (let i = 1; i < n; i++) { const u = -1 + 2 * i / n, j = ((i * 37) % 7) / 7 - .5, pts = [];
      [0, .3, .65, 1].forEach(t => { const w = wT + (wH - wT) * prof(t, bell); pts.push([200 + u * w + j * 4 * t, y0 + 4 + (y1 - y0 - 6) * t + (t === 1 ? cv * (1 - u * u) - 3 : 0)]); });
      const d = cr(pts.slice(o.from || 0)); s += i % 2 ? fold(d, c, o.w || 3, o.op || .3) : shine(d, (o.w || 3) + 1.5, .2); }
    return s; };
  const hemLine = (y1, wH, cv, c, o = {}) => { const wv = o.wave || 0, nw = o.waves || 6, pts = [];
    for (let k = 0; k <= 24; k++) { const u = k / 24, uu = Math.abs(u * 2 - 1); pts.push([200 - wH + 2 * wH * u, y1 + cv * Math.sin((1 - uu) * Math.PI / 2) + wv * (Math.cos((1 - uu) * nw * Math.PI) * .5 + .5)]); }
    return pts; };

  /* ---------- bodices ---------- */
  const BOD = {
    sweet: (yW = 522, v = 6) => sym([[[200, 404], [193, 394], [182, 388], [168, 390], [156, 398]], [[156, 398], [153, 416], ...side(432, yW, 1)], [[K.BL(yW) - 1, yW], [186, yW + v * .5], [200, yW + v]]]),
    square: (yW = 522, yN = 394) => sym([[[200, yN], [174, yN]], [[174, yN], [173, 360]], [[173, 360], [160, 362], [147, 371]], [[147, 371], ...side(386, yW, 2)], [[K.BL(yW) - 2, yW], [200, yW + 2]]]),
    vneck: (yW = 522, yV = 420) => sym([[[200, yV], [188, 392], [178, 357]], [[178, 357], [162, 361], [147, 371]], [[147, 371], ...side(386, yW, 2)], [[K.BL(yW) - 2, yW], [200, yW + 2]]]),
  };
  const sash = (y, h, c, o = {}) => { const xl = K.BL(y) - 3, xr = 400 - xl, xl2 = K.BL(y + h) - 3;
    return cloth(`M${xl},${y} Q200,${y + 3} ${xr},${y} L${400 - xl2},${y + h} Q200,${y + h + 3} ${xl2},${y + h} Z`, c, { sheen: o.sheen, vert: false, ew: 1 }) + fold(`M${xl + 6},${y + h * .5} Q200,${y + h * .5 + 4} ${xr - 6},${y + h * .5}`, c, 1.6, .35); };
  const tails = (x, y, c, len = 70, dir = 1) => cloth(`M${x - 3},${y} C${x - 8 * dir},${y + len * .4} ${x - 4 * dir},${y + len * .7} ${x - 10 * dir},${y + len} L${x - 2 * dir},${y + len - 6} L${x + 4 * dir},${y + len + 2} C${x + 4 * dir},${y + len * .6} ${x + 6 * dir},${y + len * .3} ${x + 4},${y} Z`, c, { vert: false, ew: 1, sheen: 'satin' })
    + cloth(`M${x + 2},${y} C${x + 12 * dir},${y + len * .35} ${x + 10 * dir},${y + len * .6} ${x + 18 * dir},${y + len * .85} L${x + 10 * dir},${y + len * .8} L${x + 8 * dir},${y + len * .9} C${x + 4 * dir},${y + len * .5} ${x + 2 * dir},${y + len * .3} ${x - 2},${y} Z`, sh(c, -10), { vert: false, ew: 1 });
  const tee = (c, yH = 528) => ({ sleeves: K.sleeves(c, { endY: 448, w0: 33, w1: 31 }), body: cloth(sym([[[200, 375], [189, 371], [181, 364], [178, 356]], [[178, 356], [162, 361], [147, 371]], [[147, 371], ...side(386, yH, 3.5)], [[K.BL(yH) - 3.5, yH], [200, yH + 3]]]), c) + line('M178,357 C186,368 194,372 200,372 C206,372 214,368 222,357', sh(c, -12), 3.4) });

  Object.assign(CK, { fullSkirt, gathers, hemLine, BOD, sash, tails, prof });

  const DRESSES = [
    /* --- Prinzessinnenkleid --- */
    { id: 'dress_princess', cat: 'dress', slot: 'dress', name: 'Prinzessinnenkleid', autoBox: 1, colors: ['#ffb8d6', '#c9a7ff', '#9ec9ff', '#f5d58a', '#ffffff', '#7de3c5'],
      art: c => { const d2 = sh(c, -8), l = sh(c, 28), y0 = 520;
        const under = fullSkirt(y0, 932, 36, 156, { bell: 1.25, curve: 14, wave: 6, waves: 7 });
        const over = fullSkirt(y0, 780, 36, 136, { bell: 1.3, curve: 8, wave: 26, waves: 4 });
        const hemPts = hemLine(932, 156, 14, c, { wave: 6, waves: 7 }).reverse();
        const peaks = [[-1, 0], [-.5, 1], [0, 2], [.5, 3], [1, 4]].map(([u]) => { const w = 36 + 100 * prof(1, 1.3); return [200 + u * w * .98, 780 + 8 * (1 - u * u) - 2]; });
        return { sleeves: mir(K.sleeve(l, { s0: .14, endY: 440, w0: 34, w1: 28, puff: 18, cap: [[160, 402], [146, 398]], pit: 412, seamX: 160, pat: 'url(#pSpark)', patOp: .7, cuff: 5, cuffC: c, hemSt: false }).svg)
          + mir(ruffle([[118, 404], [146, 398], [160, 404]].reverse(), 7, l, { n: 5 })),
          body: cloth(under, d2, { drop: 4 }) + gathers(y0, 932, 36, 156, 16, d2, { bell: 1.25, curve: 14 })
            + ruffle(hemPts, 12, l, { n: 22, flip: true, pat: 'url(#pSpark)', patOp: .5 })
            + cloth(over, c, { pat: 'url(#pSpark)', patOp: .9, sheen: 'satin' }) + gathers(y0, 780, 36, 136, 12, c, { bell: 1.3, curve: 8, op: .34 })
            + [[64, 766], [132, 790], [200, 798], [268, 790], [336, 766]].map(([x, y], i) => (i % 2 ? bow(x, y - 30, .48, sh(c, -18)) : '')).join('')
            + [[96, 808], [166, 834], [234, 834], [304, 808]].map(([x, y]) => bow(x, y - 36, .5, sh(c, -18)) + `<circle cx="${x}" cy="${y - 36}" r="3" fill="#fff"/>`).join('')
            + cloth(BOD.sweet(522, 12), c, { sheen: 'satin', edgeOp: .7 })
            + [176, 224].map(x => line(`M${x},396 C${x + (x < 200 ? 4 : -4)},450 ${x + (x < 200 ? 6 : -6)},490 ${x + (x < 200 ? 8 : -8)},${526}`, sh(c, -25), 1.2, .6)).join('')
            + [410, 430, 450, 470, 490, 510].map(y => gem(200, y, 3, y === 410 ? '#ff4f9a' : '#ffffff')).join('')
            + scallops(156, 244, 398, 3, l, false, -9) + shine('M180,410 C176,440 178,480 184,516', 5, .28)
            + `<path d="M200,514 L210,532 L200,546 L190,532 Z" fill="${sh(c, -20)}"/>` + gem(200, 530, 5.5, '#ff4f9a') }; } },

    /* --- Picknickkleid --- */
    { id: 'dress_gingham', cat: 'dress', slot: 'dress', name: 'Picknickkleid', autoBox: 1, colors: ['#e8344e', '#5aa9ff', '#ff8fc4', '#55c97a', '#b48ce8', '#ffb347'],
      art: c => { const gp = PAT.gingham(c), y0 = 524, sk = fullSkirt(y0, 700, 38, 96, { bell: .8, curve: 10 });
        return { sleeves: K.sleeves('#fff', { endY: 440, w0: 36, w1: 30, puff: 16, pat: gp, cuff: 6, cuffC: c, cap: [[172, 364], [152, 368]] }) + mir(ruffle([[151, 452], [125, 444]], 5, '#fff', { n: 4 })),
          body: cloth(sk, '#fff', { pat: gp, drop: 6 }) + gathers(y0, 700, 38, 96, 14, c, { bell: .8, curve: 10, op: .26 })
            + ruffle(hemLine(706, 96, 10, c).reverse(), 14, '#fff', { n: 16, flip: true, pat: gp })
            + cloth(BOD.square(526, 396), '#fff', { pat: gp }) + line('M174,396 L226,396', c, 3.4) + line('M174,396 L173,360 M226,396 L227,360', c, 2.6)
            + [412, 432, 452, 472, 492].map(y => button(200, y, 2.8, '#fff')).join('') + st('M196,400 L196,512 M204,400 L204,512', sh(c, -20), .5, .9)
            + sash(510, 16, c) + bow(160, 518, .55, c, -12) + tails(160, 526, c, 56, 1) }; } },

    /* --- Satin-Abendkleid --- */
    { id: 'dress_mermaid', cat: 'dress', slot: 'dress', name: 'Satin-Abendkleid', autoBox: 1, colors: ['#c8102e', '#2a2230', '#2b4fd8', '#0f8a6a', '#e6be6a', '#ff8fc4'],
      art: c => { const lin = sh(c, -35), fit = y => (y < 600 ? K.BL(y) - 1 : y < 760 ? 148 + (y - 600) / 160 * 12 : 160 - Math.pow((y - 760) / 175, 1.5) * 52);
        const left = []; for (let y = 400; y <= 935; y += 30) left.push([fit(y), y]);
        const hem = hemLine(940, 92, 8, c, { wave: 7, waves: 5 });
        const d = K.runs([[[150, 398], [172, 380], [196, 362], [214, 352], [226, 356]], [[226, 356], [240, 372], [251, 392], [400 - fit(410), 410], ...left.slice(1).map(K.mx)], hem.slice().reverse(), [...left.slice().reverse(), [150, 398]]]);
        return { body: cloth(d, c, { sheen: 'satin', drop: 3, edgeOp: .7 })
          + `<path d="M226,742 C226,800 230,870 236,946 L250,946 C244,880 236,810 230,742 Z" fill="${lin}"/><path d="M230,742 C236,810 244,880 250,946" stroke="${sh(c, 25)}" stroke-width="1.4" fill="none" opacity=".6"/>`
          + [[160, 410, 238, 470], [158, 440, 240, 510], [160, 470, 238, 540], [158, 500, 236, 572]].map(([a, b, x, y]) => fold(`M${a},${b} Q200,${(b + y) / 2 - 10} ${x},${y}`, c, 3, .3) + shine(`M${a + 2},${b + 7} Q200,${(b + y) / 2 - 2} ${x - 2},${y + 6}`, 3, .2)).join('')
          + [[-.7], [-.35], [0], [.35], [.7]].map(([u]) => fold(`M${200 + u * 40},770 Q${200 + u * 60},860 ${200 + u * 90},940`, c, 3, .3)).join('') + shine('M178,600 C176,680 178,740 182,770', 6, .25)
          + `<g transform="translate(220 360)"><circle r="10" fill="url(#gkMetal)"/>${gem(0, 0, 6.5, '#ffffff')}${[0, 60, 120, 180, 240, 300].map(a => `<circle cx="${f(Math.cos(a * Math.PI / 180) * 10)}" cy="${f(Math.sin(a * Math.PI / 180) * 10)}" r="1.8" fill="#fff"/>`).join('')}</g>` }; } },

    /* --- Matrosenkleid --- */
    { id: 'dress_sailor', cat: 'dress', slot: 'dress', name: 'Matrosenkleid', autoBox: 1, colors: ['#2f3f73', '#ffffff', '#5aa9ff', '#ff8fc4', '#e8344e'],
      art: c => { const col = U.luma(c) > .8 ? '#2f3f73' : '#ffffff', str = U.luma(c) > .8 ? '#ffffff' : (c === '#e8344e' ? '#2f3f73' : '#e8344e');
        const collar = sym([[[200, 446], [184, 410], [174, 384], [170, 362], [176, 352]], [[176, 352], [160, 360], [148, 372]], [[148, 372], [150, 400], [160, 420]], [[160, 420], [182, 448], [200, 470]]]);
        return { sleeves: K.sleeves(c, { endY: 452, w0: 33, w1: 31, cuff: 10, cuffC: col }) + mir(st('M125,446 L151,456', str, .9, 1.4, '0') + st('M126,442 L152,452', str, .9, 1.2, '0')),
          body: K.pleated(c, 540, 666, 70, 14, { curve: 8 }) + cloth(sym([[[200, 375], [189, 371], [181, 364], [178, 356]], [[178, 356], [162, 361], [147, 371]], [[147, 371], ...side(386, 548, 3)], [[K.BL(548) - 3, 548], [200, 551]]]), c)
            + fold('M166,500 Q178,510 192,504', c, 2.6, .28) + fold('M234,500 Q222,510 208,504', c, 2.6, .28) + st('M160,544 Q200,548 240,544', sh(c, -40), .6, 1)
            + cloth(collar, col, { edgeOp: .5 }) + line('M196,436 C184,410 176,386 172,364 M204,436 C216,410 224,386 228,364', str, 2.4) + line('M190,446 C178,420 170,394 165,372 M210,446 C222,420 230,394 235,372', str, 2.4)
            + `<path d="M190,452 L210,452 L216,500 L200,488 L184,500 Z" fill="${str}"/><path d="M190,452 L210,452 L216,500 L200,488 L184,500 Z" fill="url(#fabShade)"/>` + bow(200, 452, .58, str)
            + [480, 510].map(y => button(186, y, 3, '#e6be6a', 0) + button(214, y, 3, '#e6be6a', 0)).join('') }; } },

    /* --- Wickelkleid --- */
    { id: 'dress_wrap', cat: 'dress', slot: 'dress', name: 'Wickelkleid', autoBox: 1, colors: ['#2f3f73', '#fff6e8', '#2a2230', '#9cc9a8', '#ffc2d9', '#e8344e'],
      art: c => { const fc = U.luma(c) > .6 ? '#e8344e' : (c === '#e8344e' ? '#ffd84d' : '#ff8fc4'), fp = PAT.floral(fc, c), y0 = 524;
        const sk = fullSkirt(y0, 748, 38, 92, { bell: .7, curve: 10 });
        const fl = K.sleeve(c, { endY: 438, w0: 33, w1: 44, flare: 14, pat: fp, hemSt: false });
        return { sleeves: mir(fl.svg + ruffle([fl.S.outer[12], fl.S.inner[12]], 7, c, { n: 4, flip: true, pat: fp })),
          body: cloth(sk, c, { pat: fp, drop: 6 }) + gathers(y0, 748, 38, 92, 12, c, { bell: .7, curve: 10, op: .28 })
            + ruffle([[236, 528], [248, 600], [262, 680], [288, 752]], 8, c, { n: 10, pat: fp })
            + cloth(BOD.vneck(526, 452), c, { pat: fp })
            + cloth('M178,357 C190,400 204,440 236,524 L226,526 C200,470 186,420 172,360 Z', sh(c, -10), { pat: fp, patOp: .8, vert: false, ew: 1 })
            + fold('M222,360 C214,400 206,430 200,450', c, 2.4, .35) + fold('M176,420 Q190,440 196,460', c, 2.4, .3) + fold('M228,430 Q214,456 206,480', c, 2.4, .3)
            + sash(512, 13, sh(c, -14)) + bow(162, 520, .5, sh(c, -14), -10) + tails(162, 528, sh(c, -14), 66, 1) }; } },

    /* --- Spitzenkleid --- */
    { id: 'dress_lace', cat: 'dress', slot: 'dress', name: 'Spitzenkleid', autoBox: 1, colors: ['#2a2230', '#ffffff', '#f4c2c9', '#c8102e', '#2f3f73', '#c9a7ff'],
      art: c => { const lp = PAT.lace(c), y0 = 524, sk = fullSkirt(y0, 690, 38, 74, { bell: .5, curve: 8 }), yoke = BOD.square(530, 372);
        return { sleeves: mir(K.sleeve(c, { endY: 420, w0: 32, w1: 30, pat: lp, hemSt: false }).svg.replace(/<path d="([^"]+)" fill="([^"]+)"\/>/, '<path d="$1" fill="$2" opacity=".55"/>') + scallops(-15, 15, 0, 3, c, false).replace(/<path/g, `<path transform="translate(${f(K.armAt(K.armS(420)).p[0])} 420) rotate(-12)"`)),
          body: cloth(sk, c, { pat: lp, drop: 6 }) + gathers(y0, 690, 38, 74, 8, c, { bell: .5, curve: 8, op: .26 })
            + (() => { let s = ''; for (let k = 0; k < 14; k++) { const u = -1 + (k + .5) * 2 / 14, x = 200 + u * 74, y = 690 + 8 * (1 - u * u); s += `<circle cx="${f(x)}" cy="${f(y + 1)}" r="5.6" fill="${c}"/><circle cx="${f(x)}" cy="${f(y + 2.5)}" r="1.4" fill="#000" opacity=".25"/>`; } return s; })()
            + `<path d="${yoke}" fill="${c}" opacity=".42"/><path d="${yoke}" fill="${lp}" opacity=".9"/>` + cloth(BOD.sweet(526, 4), c, { pat: lp, edgeOp: .7 })
            + scallops(156, 244, 399, 3, U.luma(c) > .7 ? sh(c, -10) : sh(c, 25), false, -9)
            + sash(512, 12, sh(c, -18), { sheen: 1 }) + bow(200, 518, .42, sh(c, -18)) }; } },

    /* --- Boho-Maxikleid --- */
    { id: 'dress_boho', cat: 'dress', slot: 'dress', name: 'Boho-Maxikleid', autoBox: 1, colors: ['#d9744a', '#fff1d6', '#9cc9a8', '#8fc6e8', '#e6b43a', '#b48ce8'],
      art: c => { const acc = U.luma(c) > .75 ? '#d9744a' : '#fff6e8', pp = PAT.paisley(c, U.luma(c) > .75 ? sh(c, -30) : sh(c, 40));
        const tier = (y0, y1, w0, w1) => cloth(`M${200 - w0},${y0} L${200 + w0},${y0} L${200 + w1},${y1} Q200,${y1 + 8} ${200 - w1},${y1} Z`, c, { pat: pp, drop: 4, dropOp: .12 }) + gathers(y0, y1, w0, w1, 12, c, { bell: 0, curve: 6, w: 2.4, op: .26 }) + st(`M${200 - w0},${y0 + 3} L${200 + w0},${y0 + 3}`, acc, .8, 1.2, '1.4 1.6');
        return { sleeves: mir(K.sleeve(c, { s0: .12, endY: 456, w0: 34, w1: 30, puff: 10, cap: [[160, 400], [146, 396]], pit: 410, seamX: 160, pat: pp, cuff: 6, cuffC: sh(c, -10), hemSt: false }).svg)
            + ruffle([[118, 404], [150, 393], [200, 396], [250, 393], [282, 404]].reverse(), 14, c, { n: 16, jit: 1, pat: pp }) + st('M120,400 Q150,389 200,392 Q250,389 280,400', acc, .7, 1.2, '1.4 1.6'),
          body: tier(760, 930, 86, 116) + tier(640, 768, 66, 88) + tier(530, 648, 44, 68)
            + cloth(sym([[[200, 400], [176, 398], [150, 396]], [[150, 396], ...side(420, 532, 3)], [[K.BL(532) - 3, 532], [200, 534]]]), c, { pat: pp })
            + [412, 420, 428, 436].map(y => st(`M152,${y} Q200,${y + 4} 248,${y}`, sh(c, -30), .45, .9)).join('')
            + cloth('M163,516 Q200,520 237,516 L238,532 Q200,536 162,532 Z', acc, { vert: false, ew: 1 }) + [170, 180, 190, 200, 210, 220, 230].map((x, i) => `<path d="M${x},519 l3,5 -3,5 -3,-5 Z" fill="${i % 2 ? c : '#2f8a8a'}"/>`).join('')
            + line('M168,528 C166,550 164,570 160,590 M174,528 C174,550 174,566 172,584', acc, 1.6) + [[160, 592], [172, 586]].map(([x, y]) => `<path d="M${x - 3},${y} L${x + 3},${y} L${x + 4},${y + 14} L${x - 4},${y + 14} Z" fill="${acc}"/>` + line(`M${x - 3},${y + 14} L${x - 4},${y + 18} M${x},${y + 14} L${x},${y + 19} M${x + 3},${y + 14} L${x + 4},${y + 18}`, acc, 1)).join('') }; } },

    /* --- Dirndl --- */
    { id: 'dress_dirndl', cat: 'dress', slot: 'dress', name: 'Dirndl', autoBox: 1, colors: ['#2f6a4a', '#2f3f73', '#b8243a', '#ff8fc4', '#5aa9ff'],
      art: c => { const apron = c === '#ff8fc4' ? '#ffffff' : c === '#b8243a' ? '#f4c2c9' : '#ffd6e6', y0 = 524, sk = fullSkirt(y0, 724, 38, 92, { bell: .8, curve: 10 });
        const bod = sym([[[200, 412], [186, 410], [172, 404], [166, 384], [168, 362]], [[168, 362], [160, 364], [150, 374]], [[150, 374], ...side(392, 526, 1)], [[K.BL(526) - 1, 526], [200, 530]]]);
        return { sleeves: K.sleeves('#fffdf8', { endY: 430, w0: 36, w1: 30, puff: 18, cuff: 5, cuffC: '#fffdf8', lace: '#ffffff', cap: [[172, 362], [152, 368]] }),
          body: cloth(sk, c, { drop: 6 }) + gathers(y0, 724, 38, 92, 14, c, { bell: .8, curve: 10 })
            + (() => { let s = ''; const pts = hemLine(716, 90, 10, c); for (let i = 1; i < pts.length - 1; i += 2) s += K.ART_flower ? '' : `<circle cx="${f(pts[i][0])}" cy="${f(pts[i][1])}" r="3.4" fill="#fff"/><circle cx="${f(pts[i][0])}" cy="${f(pts[i][1])}" r="1.4" fill="#ffd84d"/>`; return line(cr(pts), '#ffd84d', 6, .9) + line(cr(pts), sh(c, -25), 1, .6) + s; })()
            + cloth('M172,530 L228,530 L238,706 Q200,716 162,706 Z', apron, { drop: 3, dropOp: .1 }) + gathers(530, 706, 28, 38, 7, apron, { bell: 0, curve: 6, w: 2.4, op: .22 }) + scallops(162, 238, 708, 3, apron, true, 4)
            + cloth('M168,356 C176,368 188,372 200,372 C212,372 224,368 232,356 L240,372 L200,408 L160,372 Z', '#fffdf8') + scallops(166, 234, 404, 2.6, '#ffffff', true, -4)
            + cloth(bod, c, { edgeOp: .7 }) + line('M200,412 C186,410 172,404 166,384 L168,362 M200,412 C214,410 228,404 234,384 L232,362', '#ffd84d', 2.4)
            + lacing(200, 424, 512, 12, 7, '#ffffff', 6) + [424, 441.6, 459.2, 476.8, 494.4, 512].map((y, i) => { const w = 12 - 5 * i / 5; return `<circle cx="${f(200 - w)}" cy="${f(y)}" r="2.6" fill="url(#gkSilver)"/><circle cx="${f(200 + w)}" cy="${f(y)}" r="2.6" fill="url(#gkSilver)"/>`; }).join('')
            + `<path d="M172,532 Q200,536 228,532 L228,540 Q200,544 172,540 Z" fill="${apron}"/>` + bow(168, 538, .5, apron, -10) + tails(168, 546, apron, 60, 1) }; } },

    /* --- Fransenkleid --- */
    { id: 'dress_flapper', cat: 'dress', slot: 'dress', name: 'Fransenkleid', autoBox: 1, colors: ['#e6be6a', '#d9dde6', '#2a2230', '#c8102e', '#7de3c5', '#ff8fc4'],
      art: c => { const body = sym([[[200, 430], [190, 404], [180, 372], [176, 356]], [[176, 356], [168, 356]], [[168, 356], [162, 374], [154, 394], [150, 410]], [[150, 410], [154, 470], [156, 540], [150, 600]], [[150, 600], [200, 604]]]);
        const fringe = (y, len, w0, w1) => { let s = ''; for (let x = 200 - w0, i = 0; x <= 200 + w0; x += 2.2, i++) { const u = (x - 200) / w0, xb = 200 + u * w1 + Math.sin(i * 1.7) * 1.4; s += `<path d="M${f(x)},${y} Q${f((x + xb) / 2 + Math.sin(i) * 1.5)},${y + len / 2} ${f(xb)},${y + len + Math.cos(i * 1.3) * 2}" stroke="${i % 3 === 0 ? sh(c, 30) : i % 3 === 1 ? c : sh(c, -22)}" stroke-width="1.5" fill="none" stroke-linecap="round"/>`; } return s; };
        return { body: fringe(620, 54, 56, 64) + fringe(580, 54, 54, 60) + fringe(540, 56, 52, 58) + cloth(body, c, { pat: ['url(#pSeq)', 'url(#pSpark)'], patOp: [1, .8], edgeOp: .7 }) + fringe(500, 50, 50, 54)
          + line('M200,430 C190,404 180,372 176,356 M200,430 C210,404 220,372 224,356', sh(c, -15), 3.6)
          + [[180, 372], [184, 388], [189, 404], [194, 418], [220, 372], [216, 388], [211, 404], [206, 418]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.2" fill="#fff"/>`).join('') + gem(200, 438, 6, '#ffffff')
          + `<path d="M154,490 Q200,498 246,490" stroke="url(#gkMetal)" stroke-width="5" fill="none"/>` + [160, 174, 188, 200, 212, 226, 240].map(x => `<circle cx="${x}" cy="${x === 200 ? 496 : 494 + (Math.abs(x - 200) < 20 ? 1.5 : 0)}" r="2.4" fill="#fff"/>`).join('') }; } },

    /* --- Latzhose --- */
    { id: 'dress_overall', cat: 'dress', slot: 'dress', name: 'Latzhose', autoBox: 1, colors: [C.denim, '#9cbbe6', '#ff8fc4', '#ffd84d', '#2a2230', '#c9a7ff'],
      art: c => { const t = U.luma(c) > .6 && c !== '#9cbbe6' ? '#ffffff' : '#fffaf2', tp = PAT.breton(t, '#ff8fc4'), T = tee(t), th = '#e6a84a';
        const pants = K.pants({ hem: 884, eo: (y, tt) => 5 + tt * 7, ei: (y, tt) => 3 + tt * 4, wy: 512 });
        return { sleeves: T.sleeves.replace(/fill="#fff(?:af2|fff)"\/>/, m => m) + mir(`<path d="${K.sleevePath({ endY: 448, w0: 33, w1: 31 }).d}" fill="${tp}" opacity=".9"/>`),
          body: T.body.replace(/(<path d="[^"]+" fill=")([^"]+)("\/>)/, `$1$2$3`) + `<path d="${sym([[[200, 375], [189, 371], [181, 364], [178, 356]], [[178, 356], [162, 361], [147, 371]], [[147, 371], ...side(386, 528, 3.5)], [[K.BL(528) - 3.5, 528], [200, 531]]])}" fill="${tp}" opacity=".9"/>`
            + cloth(pants, c, { pat: 'url(#pDenim)', drop: 3 }) + mir(cloth('M150,866 L198,868 L198,886 L148,884 Z', sh(c, 12), { pat: 'url(#pDenim)', vert: false, ew: 1 }) + st('M150,870 L198,872', th, .8, 1) + st('M166,530 Q174,548 158,564', th, .85, 1.1) + fold('M164,760 Q178,768 192,762', c, 2.2, .3))
            + cloth('M170,428 L230,428 L232,520 L168,520 Z', c, { pat: 'url(#pDenim)' }) + st('M173,432 L227,432 L229,516 L171,516 Z', th, .85, 1.1)
            + K.pocket(186, 446, 28, 26, c, { thread: th, fill: sh(c, 4) }) + `<path d="${ART.heart(200, 460, 6)}" fill="#ff4f9a"/>`
            + mir(cloth('M172,430 L162,374 L174,370 L182,430 Z', c, { pat: 'url(#pDenim)', vert: false, ew: 1 }) + st('M166,376 L175,428', th, .85, 1) + `<rect x="170" y="424" width="12" height="10" rx="2" fill="url(#gkSilver)" stroke="#8a90a0" stroke-width=".8"/>` + button(176, 438, 3.4, '#e6be6a', 0) + button(166, 522, 3, '#e6be6a', 0)) }; } },

    /* --- Jumpsuit --- */
    { id: 'dress_jumpsuit', cat: 'dress', slot: 'dress', name: 'Jumpsuit', autoBox: 1, colors: ['#0f8a6a', '#2a2230', '#c8102e', '#ffffff', '#2b4fd8', '#e6be6a'],
      art: c => { const top = sym([[[200, 448], [190, 420], [182, 392], [184, 360], [190, 340]], [[190, 340], [182, 342], [174, 362], [164, 388], [154, 404]], [[154, 404], ...side(420, 524, 2)], [[K.BL(524) - 2, 524], [200, 526]]]);
        const legs = K.pants({ hem: 942, eo: (y, t) => 4 + Math.pow(t, .8) * 26, ei: (y, t) => 2 + Math.pow(t, .8) * 9, wy: 518 });
        return { body: line('M188,336 Q200,330 212,336', c, 4) + cloth(legs, c, { sheen: 'satin', drop: 3 })
          + mir(fold('M170,640 Q160,780 150,936', c, 3, .3) + fold('M188,660 Q186,800 190,940', c, 2.6, .3) + shine('M176,620 Q170,760 166,930', 6, .22)) + fold('M200,620 L200,700', c, 1.6, .3)
          + cloth(top, c, { sheen: 'satin', edgeOp: .7 }) + mir(fold('M178,400 Q186,440 190,470', c, 2.4, .3))
          + sash(514, 12, sh(c, -14)) + `<rect x="190" y="511" width="20" height="18" rx="3" fill="none" stroke="url(#gkMetal)" stroke-width="3.4"/><rect x="198" y="514" width="3" height="12" rx="1" fill="url(#gkMetal)"/>` }; } },

    /* --- Kuschel-Pyjama --- */
    { id: 'dress_pj', cat: 'dress', slot: 'dress', name: 'Kuschel-Pyjama', autoBox: 1, colors: ['#ffc2d9', '#bfe3ff', '#d9c6ff', '#c3f0dc', '#fff0a8'],
      art: c => { const hp = PAT.hearts(c, U.luma(c) > .85 ? '#ff8fc4' : '#ffffff'), pip = sh(c, -30);
        const top = sym([[[200, 412], [192, 396], [182, 372], [178, 356]], [[178, 356], [162, 361], [147, 371]], [[147, 371], ...side(386, 572, 7)], [[K.BL(572) - 7, 572], [200, 575]]]);
        const pants = K.pants({ hem: 884, eo: (y, t) => 6 + t * 6, ei: (y, t) => 4 + t * 3 });
        return { sleeves: K.sleeves(c, { endY: 560, w0: 35, w1: 32, pat: hp, cuff: 10, cuffC: c, foldC: c }) + mir(line(`M${f(K.sleevePath({ endY: 560, w0: 35, w1: 32 }).outer[12][0])},549 L${f(K.sleevePath({ endY: 560, w0: 35, w1: 32 }).inner[12][0])},552`, pip, 2)),
          body: cloth(pants, c, { pat: hp }) + mir(cloth(`M${K.BL(870) - 12},866 L${K.IL(870) + 7},866 L${K.IL(890) + 5},888 L${K.BL(890) - 11},888 Z`, sh(c, -8), { pat: PAT.rib(c), vert: false, ew: 1 }) + fold('M160,700 Q176,710 192,702', c, 2.6, .25) + fold('M160,780 Q176,790 192,782', c, 2.4, .22))
            + cloth(top, c, { pat: hp }) + line('M200,412 C192,396 182,372 178,356 M200,412 C208,396 218,372 222,356', pip, 2.6)
            + mir(cloth('M178,356 L168,360 L172,392 L186,384 Z', c, { pat: hp, vert: false, ew: 1, edgeC: pip, edgeOp: .9 }) + line('M178,356 L168,360 L172,392 L186,384', pip, 2))
            + line('M200,412 L200,572', pip, 1.6) + [430, 462, 494, 526, 556].map(y => button(204, y, 3, '#ffffff')).join('')
            + K.pocket(214, 418, 22, 22, c, { pat: hp, thread: pip }) + line('M214,418 L236,418', pip, 2.2) + st('M162,566 Q200,572 238,566', pip, .7, 1) }; } },
  ];
  DRESSES.forEach(t => { t.fresh = 1; });
  WEAR.add(DRESSES);
})();
