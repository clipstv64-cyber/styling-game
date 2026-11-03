'use strict';
/* =========================================================
   WEAR — detailed tops
   ========================================================= */
(() => {
  const K = CK, { sh, cloth, st, fold, shine, button, sym, side, cr, line, mir, PAT } = K, C = DATA.C;
  const hemSt = (y, c, x0 = 165, x1 = 235) => st(`M${x0},${y} Q200,${y + 2} ${x1},${y}`, sh(c, -38), .7, 1);
  const contrast = c => (U.luma(c) > .7 ? '#ff4f9a' : '#ffffff');

  /* ---------- reusable cuts ---------- */
  const CUT = {
    tank: sym([[[200, 400], [190, 395], [183, 382], [179, 364], [179, 358]], [[179, 358], [167, 358]], [[167, 358], [161, 373], [154, 392], [146, 410]], side(420, 526, 3), [[163, 526], [182, 528.5], [200, 529]]]),
    tee: sym([[[200, 375], [189, 371], [181, 364], [178, 356]], [[178, 356], [162, 361], [147, 371]], [[147, 371], ...side(386, 528, 3.5)], [[162.5, 528], [182, 530.5], [200, 531]]]),
    long: (yH = 528, ease = 4) => sym([[[200, 375], [189, 371], [181, 364], [178, 356]], [[178, 356], [162, 361], [147, 371]], [[147, 371], ...side(386, Math.min(yH, 598), ease)], [[K.BL(Math.min(yH, 598)) - ease, yH], [200, yH + 3]]]),
  };

  const TOPS = [
    /* --- Tanktop (upgrade) --- */
    { id: 'top_tank', cat: 'top', slot: 'top', name: 'Tanktop', box: '128 344 144 196', colors: [C.white, C.rose, C.sky, C.mint, C.yellow, C.lilac, C.black],
      art: c => ({ body: cloth(CUT.tank, c, { pat: PAT.rib(c), patOp: .55 })
        + line('M200,400 C190,395 183,382 179,364 L179,358 M200,400 C210,395 217,382 221,364 L221,358', sh(c, -8), 3.4) + st('M200,396 C192,391 186,380 183,364 M200,396 C208,391 214,380 217,364', sh(c, -38), .55, .9)
        + line('M167,358 C161,373 154,392 146,410 M233,358 C239,373 246,392 254,410', sh(c, -8), 3.2) + st('M170,362 C164,376 158,392 151,408 M230,362 C236,376 242,392 249,408', sh(c, -38), .5, .9)
        + fold('M168,448 Q182,455 194,450', c, 2.6, .28) + fold('M232,448 Q218,455 206,450', c, 2.6, .28) + fold('M160,486 Q168,494 172,506', c, 2.4, .25) + fold('M240,486 Q232,494 228,506', c, 2.4, .25)
        + shine('M178,412 C175,450 176,488 179,516', 7, .16) + hemSt(519, c) + hemSt(523, c)
        + K.bow(200, 402, .3, contrast(c) === '#ffffff' ? '#ffb3d0' : '#ff8fc4') }) },

    /* --- T-Shirt (upgrade) --- */
    { id: 'top_tee', cat: 'top', slot: 'top', name: 'T-Shirt', box: '112 344 176 194', colors: [C.white, C.pink, C.sky, C.yellow, C.lilac, C.black],
      art: c => ({ sleeves: K.sleeves(c, { endY: 452, w0: 33, w1: 31 }) + mir(fold('M140,424 Q150,430 156,420', c, 2.2, .26)),
        body: cloth(CUT.tee, c) + cloth('M178,356 C186,366 194,370 200,370 C206,370 214,366 222,356 L226,358 C216,372 208,377 200,377 C192,377 184,372 174,358 Z', sh(c, -10), { vert: false, ew: .9 })
          + st('M176,360 C186,371 194,374 200,374 C206,374 214,371 224,360', sh(c, -40), .55, .8)
          + fold('M166,452 Q180,460 192,454', c, 2.6, .25) + fold('M234,452 Q220,460 208,454', c, 2.6, .25) + fold('M162,500 Q172,506 178,518', c, 2.4, .24) + fold('M238,500 Q228,506 222,518', c, 2.4, .24)
          + shine('M176,392 C172,430 174,480 178,516', 7, .14) + hemSt(521, c, 164, 236) + hemSt(524.5, c, 164, 236)
          + `<path d="${ART.star(200, 436, 18, 8)}" fill="${sh(contrast(c), -15)}" transform="translate(1.5 2)" opacity=".5"/><path d="${ART.star(200, 436, 18, 8)}" fill="${contrast(c)}"/><path d="${ART.star(200, 436, 13, 6)}" fill="none" stroke="#fff" stroke-width="1.2" stroke-dasharray="2 1.6" opacity=".8"/>`
          + `<path d="${ART.spark4 ? ART.spark4(222, 418, 5) : ''}" fill="${contrast(c)}"/><circle cx="178" cy="452" r="2" fill="${contrast(c)}"/><circle cx="224" cy="456" r="1.5" fill="${contrast(c)}"/>` }) },

    /* --- Karohemd --- */
    { id: 'top_flannel', cat: 'top', slot: 'top', name: 'Karohemd', autoBox: 1, colors: ['#d8323f', '#3a6fd8', '#2f8a5a', '#ff8fc4', '#8b5cf6', '#2a2230'],
      art: c => { const tp = PAT.tartan(c, c === '#2a2230' ? '#e8344e' : '#ffd84d'), sl = K.sleeve(c, { endY: 474, w0: 34, w1: 32, pat: tp, cuff: 13, cuffC: c, cuffPat: tp }).svg;
        const body = sym([[[200, 372], [192, 368], [182, 360], [178, 355]], [[178, 355], [162, 360], [146, 371]], [[146, 371], ...side(386, 536, 5)], [[158, 536], [168, 548], [186, 548], [200, 538]]]);
        return { sleeves: mir(sl + fold('M140,456 Q150,462 158,452', c, 2.4, .3)),
          body: cloth(body, c, { pat: tp })
            + cloth('M196,372 L204,372 L205,540 L195,540 Z', c, { pat: tp, edgeOp: .45, ew: .9, vert: false }) + st('M196.5,376 L196.5,538 M203.5,376 L203.5,538', sh(c, -45), .55, .9)
            + [392, 420, 448, 476, 504, 530].map(y => button(200, y, 2.6, '#f3ece4')).join('')
            + mir(K.pocket(160, 404, 26, 28, c, { pat: tp, flap: true, btn: '#f3ece4' }))
            + mir(cloth('M200,372 L184,356 L178,352 L166,376 L186,388 Z', c, { pat: tp, edgeOp: .6, ew: 1, vert: false }) + st('M182,359 L171,377 L186,386', sh(c, -45), .6, .9) + fold('M184,388 L196,374', c, 2, .35))
            + fold('M164,468 Q178,476 190,470', c, 2.6, .3) + fold('M236,468 Q222,476 210,470', c, 2.6, .3) + fold('M158,508 Q168,516 176,530', c, 2.4, .3) + fold('M242,508 Q232,516 224,530', c, 2.4, .3)
            + st('M158,532 C168,543 186,543 196,535 M242,532 C232,543 214,543 204,535', sh(c, -45), .6, 1) }; } },

    /* --- Zopfpulli --- */
    { id: 'top_cable', cat: 'top', slot: 'top', name: 'Zopfpulli', autoBox: 1, colors: ['#f3e9da', '#ffc2d9', '#c9a7ff', '#8fd0ff', '#e8344e', '#7a8c6a'],
      art: c => { const body = CUT.long(584, 7);
        return { sleeves: K.sleeves(c, { endY: 566, w0: 36, w1: 33, puff: 4, pat: PAT.cable(c), cuff: 16, cuffC: sh(c, -6), rib: true, foldC: c }),
          body: cloth(body, c, { pat: PAT.cable(c) })
            + cloth('M176,352 C186,366 194,368 200,368 C206,368 214,366 224,352 L230,356 C218,376 208,380 200,380 C192,380 182,376 170,356 Z', sh(c, -6), { pat: PAT.rib(c), vert: false, ew: 1 })
            + cloth(`M${K.BL(570) - 7},568 L${400 - K.BL(570) + 7},568 L${400 - K.BL(590) + 7},590 L${K.BL(590) - 7},590 Z`, sh(c, -6), { pat: PAT.rib(c), vert: false, ew: 1 })
            + fold('M166,470 Q180,480 192,474', c, 3, .3) + fold('M234,470 Q220,480 208,474', c, 3, .3) + fold('M158,530 Q170,540 182,536', c, 3, .3) + fold('M242,530 Q230,540 218,536', c, 3, .3)
            + shine('M174,396 C170,440 172,500 176,560', 8, .14) }; } },

    /* --- Korsage --- */
    { id: 'top_corset', cat: 'top', slot: 'top', name: 'Korsage', autoBox: 1, colors: ['#2a2230', '#ff8fc4', '#ffffff', '#e8344e', '#c9a7ff', '#7de3c5'],
      art: c => { const lc = U.luma(c) > .7 ? '#ff8fc4' : '#ffffff';
        const d = sym([[[200, 402], [192, 392], [180, 388], [168, 392], [156, 400]], [[156, 400], [154, 420], ...side(440, 520, 1.5)], [[166, 520], [184, 528], [200, 540]]]);
        return { body: line('M168,393 L176,356 M232,393 L224,356', c, 3) + line('M168,393 L176,356 M232,393 L224,356', '#fff', 1, .4)
          + cloth(d, c, { sheen: 'satin', edgeOp: .7 })
          + [172, 186, 214, 228].map((x, i) => `${line(`M${x},${i % 3 ? 396 : 398} C${x + (x < 200 ? -1 : 1)},440 ${x + (x < 200 ? 2 : -2)},490 ${x + (x < 200 ? 2 : -2)},${528 + (Math.abs(x - 200) < 20 ? 6 : 0)}`, sh(c, -30), 1.2, .7)}${st(`M${x + 2.5},${398} C${x + 2.5},440 ${x + 4},490 ${x + 4},${526}`, sh(c, 35), .5, .8)}`).join('')
          + K.lacing(200, 410, 520, 7, 4, lc, 7) + K.bow(200, 530, .32, lc)
          + K.scallops(158, 200, 396, 3.4, lc, true, -6).replace('<path', '<path transform="rotate(8 179 396)"') + K.scallops(200, 242, 396, 3.4, lc, true, -6).replace('<path', '<path transform="rotate(-8 221 396)"')
          + shine('M178,404 C174,440 176,480 182,520', 5, .25) + shine('M222,404 C226,440 224,480 218,520', 3, .15) }; } },

    /* --- Carmen-Bluse (off shoulder) --- */
    { id: 'top_offsh', cat: 'top', slot: 'top', name: 'Carmen-Bluse', autoBox: 1, colors: ['#ffffff', '#ffc2d9', '#ffd84d', '#8fd0ff', '#e8344e', '#7de3c5'],
      art: c => { const body = sym([[[200, 400], [176, 398], [150, 396]], [[150, 396], ...side(420, 528, 6)], [[160, 528], [200, 532]]]);
        const puff = K.sleeve(c, { s0: .12, endY: 456, w0: 34, w1: 30, puff: 8, cap: [[160, 400], [146, 396]], pit: 410, seamX: 160, cuff: 6, cuffC: sh(c, -8), hemSt: false }).svg;
        return { sleeves: mir(puff) + K.ruffle([[118, 404], [150, 393], [200, 396], [250, 393], [282, 404]].reverse(), 13, c, { n: 16, jit: 1 }) + st('M120,400 Q150,389 200,392 Q250,389 280,400', sh(c, -35), .6, 1),
          body: cloth(body, c) + [408, 416, 424].map(y => st(`M152,${y} Q200,${y + 4} 248,${y}`, sh(c, -30), .45, .9)).join('')
            + fold('M170,430 L166,470 M186,432 L184,480 M214,432 L216,480 M230,430 L234,470', c, 2.4, .26) + fold('M162,500 Q172,508 178,522', c, 2.2, .24)
            + shine('M178,440 C176,470 178,500 180,520', 6, .16) + hemSt(522, c, 162, 238) }; } },

    /* --- Ringelshirt --- */
    { id: 'top_breton', cat: 'top', slot: 'top', name: 'Ringelshirt', autoBox: 1, colors: ['#2f3f73', '#e8344e', '#2a2230', '#ff8fc4', '#55c97a'],
      art: c => { const bp = PAT.breton('#fffaf2', c), base = '#fffaf2';
        const body = sym([[[200, 366], [176, 362], [160, 364]], [[160, 364], [146, 371]], [[146, 371], ...side(386, 530, 4)], [[162, 530], [200, 533]]]);
        return { sleeves: K.sleeves(base, { endY: 522, w0: 33, w1: 29, pat: bp, foldC: c }),
          body: cloth(body, base, { pat: bp }) + line('M160,364 Q200,372 240,364', sh(c, -10), 3) + st('M162,368 Q200,376 238,368', '#fff', .7, .9)
            + `<g transform="translate(178 432)"><path d="M0,-8 L0,8 M-6,3 Q0,10 6,3 M-3,-5 L3,-5" stroke="${c}" stroke-width="2.4" fill="none" stroke-linecap="round"/><circle cx="0" cy="-9.5" r="2.4" fill="none" stroke="${c}" stroke-width="1.6"/></g>`
            + fold('M166,460 Q180,468 192,462', c, 2.6, .22) + fold('M234,460 Q220,468 208,462', c, 2.6, .22) + shine('M176,392 C172,430 174,480 178,516', 7, .14) + hemSt(524, c, 164, 236) }; } },

    /* --- Folklore-Bluse --- */
    { id: 'top_peasant', cat: 'top', slot: 'top', name: 'Folklore-Bluse', autoBox: 1, colors: ['#ffffff', '#fff1d6', '#ffd6e6', '#d9ecff'],
      art: c => { const emb = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><circle r="3.2" fill="#e8344e"/><circle r="1.3" fill="#ffd84d"/>${[0, 72, 144, 216, 288].map(a => `<ellipse cx="0" cy="-4.6" rx="1.6" ry="2.2" fill="#e8344e" transform="rotate(${a})"/>`).join('')}<ellipse cx="6" cy="2" rx="3" ry="1.3" fill="#3fa36a" transform="rotate(25 6 2)"/><ellipse cx="-6" cy="2" rx="3" ry="1.3" fill="#3fa36a" transform="rotate(-25 -6 2)"/></g>`;
        const body = sym([[[200, 392], [180, 390], [166, 384]], [[166, 384], [150, 380], [146, 384]], [[146, 384], ...side(400, 530, 7)], [[159, 530], [200, 534]]]);
        const sl = K.sleeve(c, { endY: 524, w0: 34, w1: 27, puff: 14, cap: [[168, 386], [150, 380]], cuff: 7, cuffC: '#e8344e', ruffle: 8 });
        return { sleeves: mir(sl.svg + [0.3, 0.55].map(u => { const a = K.armAt(sl.S.sE * u); return fold(`M${a.p[0] - 12},${a.p[1] - 4} L${a.p[0] - 6},${a.p[1] + 14}`, c, 2, .22); }).join('')),
          body: cloth(body, c) + cloth('M166,384 Q200,396 234,384 L236,394 Q200,406 164,394 Z', '#2f3f73', { vert: false, ew: .9 })
            + [170, 182, 194, 206, 218, 230].map((x, i) => emb(x, 390 + Math.abs(x - 200) * -.08, .62)).join('')
            + st('M166,398 Q200,410 234,398', '#ffd84d', .9, 1, '2 2') + [404, 414, 424].map(y => st(`M176,${y} Q200,${y + 4} 224,${y}`, sh(c, -30), .4, .9)).join('')
            + line('M196,400 Q194,420 190,430 M204,400 Q206,420 210,430', '#e8344e', 1.4) + `<circle cx="190" cy="432" r="2.6" fill="#e8344e"/><circle cx="210" cy="432" r="2.6" fill="#e8344e"/>`
            + fold('M172,432 L166,480 M186,436 L184,500 M214,436 L216,500 M228,432 L234,480', c, 2.4, .2) + hemSt(524, c, 160, 240) }; } },

    /* --- Puffärmel-Top --- */
    { id: 'top_puff', cat: 'top', slot: 'top', name: 'Puffärmel-Top', autoBox: 1, colors: ['#ff8fc4', '#e8344e', '#2a2230', '#8fd0ff', '#ffd84d', '#55c97a'],
      art: c => { const dp = PAT.dots(c, '#fff', 2.3, 15);
        const body = sym([[[200, 398], [194, 390], [186, 390], [176, 396], [170, 396]], [[170, 396], [168, 370]], [[168, 370], [158, 372], [148, 380]], [[148, 380], ...side(394, 496, 3)], [[160, 496], [200, 498]]]);
        return { sleeves: K.sleeves(c, { endY: 440, w0: 36, w1: 30, puff: 20, pat: dp, cuff: 6, cuffC: sh(c, -12), seamX: 166, cap: [[168, 372], [152, 372]] }) + mir(fold('M130,402 Q138,396 146,402', c, 2, .3) + fold('M128,420 Q138,414 150,420', c, 2, .28)),
          body: cloth(body, c, { pat: dp }) + [436, 448, 460, 472, 484].map(y => st(`M158,${y} Q200,${y + 3} 242,${y}`, sh(c, -30), .55, 1, '1.6 2.2')).join('')
            + K.ruffle([[162, 494], [200, 497], [238, 494]].reverse(), 9, c, { n: 9, pat: dp, flip: true })
            + line('M176,396 C186,390 194,390 200,398 C206,390 214,390 224,396', sh(c, -15), 3) + K.bow(200, 400, .3, sh(c, -15)) }; } },

    /* --- Pullunder mit Bluse --- */
    { id: 'top_argyle', cat: 'top', slot: 'top', name: 'Pullunder', autoBox: 1, colors: ['#2f3f73', '#c9a7ff', '#e8344e', '#7a8c6a', '#c9965f'],
      art: c => { const shirt = '#fbf8f2', ap = PAT.argyle(c, sh(c, -22), sh(c, 45));
        const vest = sym([[[200, 434], [186, 400], [178, 362]], [[178, 362], [168, 364]], [[168, 364], [160, 384], [152, 404], [147, 416]], side(426, 556, 5), [[K.BL(556) - 5, 556], [200, 558]]]);
        return { sleeves: K.sleeves(shirt, { endY: 568, w0: 33, w1: 30, cuff: 12, cuffC: shirt, cuffBtn: '#e9e2d6' }),
          body: cloth(CUT.long(540, 4), shirt) + cloth(vest, c, { pat: ap })
            + line('M200,434 C194,420 186,400 178,362 M200,434 C206,420 214,400 222,362', sh(c, -12), 5) + st('M200,428 C194,414 188,398 181,364 M200,428 C206,414 212,398 219,364', sh(c, 30), .6, .9)
            + line('M168,364 C160,384 152,404 147,416 M232,364 C240,384 248,404 253,416', sh(c, -12), 4.6)
            + cloth(`M${K.BL(540) - 5},540 L${400 - K.BL(540) + 5},540 L${400 - K.BL(558) + 5},558 L${K.BL(558) - 5},558 Z`, sh(c, -12), { pat: PAT.rib(c), vert: false, ew: 1 })
            + mir(K.cloth('M200,366 L186,354 L180,350 L172,368 L190,378 Z', shirt, { edgeOp: .55, ew: 1, vert: false }) + st('M184,357 L176,369 L189,375', sh(shirt, -30), .6, .9))
            + `<path d="M196,368 L204,368 L203,432 L197,432 Z" fill="${sh(shirt, -4)}"/>` + [384, 404, 422].map(y => button(200, y, 2.2, '#efe8dc', 2)).join('')
            + fold('M168,478 Q180,486 192,480', c, 2.6, .3) + fold('M232,478 Q220,486 208,480', c, 2.6, .3) }; } },

    /* --- Regenbogen-Pulli --- */
    { id: 'top_rainbow', cat: 'top', slot: 'top', name: 'Regenbogen-Pulli', autoBox: 1, colors: ['#fffaf2', '#ffc2d9', '#c9a7ff', '#8fd0ff', '#2f3f73'],
      art: c => { const body = CUT.long(560, 6), rb = ['#ff6b6b', '#ffa94d', '#ffd84d', '#6fd08c', '#5aa9ff', '#b48ce8'];
        return { sleeves: K.sleeves(c, { endY: 560, w0: 35, w1: 32, puff: 3, pat: PAT.rib(c), patOp: .5, cuff: 14, cuffC: sh(c, -8), rib: true }),
          body: cloth(body, c, { pat: PAT.rib(c), patOp: .5 })
            + rb.map((r, i) => `<path d="M${164 + i * 6},${478} A${36 - i * 6},${36 - i * 6} 0 0 1 ${236 - i * 6},${478}" fill="none" stroke="${r}" stroke-width="6.4"/>`).join('')
            + rb.map((r, i) => st(`M${164 + i * 6},${478} A${36 - i * 6},${36 - i * 6} 0 0 1 ${236 - i * 6},${478}`, '#fff', .35, .8, '1.4 1.4')).join('')
            + [[168, 480], [232, 480]].map(([x, y]) => `<g><circle cx="${x - 7}" cy="${y}" r="7" fill="#fff"/><circle cx="${x + 2}" cy="${y - 4}" r="8.5" fill="#fff"/><circle cx="${x + 10}" cy="${y + 1}" r="6" fill="#fff"/><rect x="${x - 13}" y="${y}" width="28" height="7" rx="3.5" fill="#fff"/><path d="M${x - 12},${y + 6} L${x + 14},${y + 6}" stroke="#d9dfe9" stroke-width="2"/></g>`).join('')
            + cloth('M176,352 C186,366 194,368 200,368 C206,368 214,366 224,352 L230,356 C218,376 208,380 200,380 C192,380 182,376 170,356 Z', sh(c, -8), { pat: PAT.rib(c), vert: false, ew: 1 })
            + cloth(`M${K.BL(546) - 6},546 L${400 - K.BL(546) + 6},546 L${400 - K.BL(564) + 6},564 L${K.BL(564) - 6},564 Z`, sh(c, -8), { pat: PAT.rib(c), vert: false, ew: 1 })
            + fold('M164,506 Q176,514 186,510', c, 2.6, .25) + fold('M236,506 Q224,514 214,510', c, 2.6, .25) + shine('M174,396 C170,430 172,460 174,470', 7, .16) }; } },
  ];
  TOPS.forEach(t => { t.fresh = 1; });
  WEAR.add(TOPS);
})();
