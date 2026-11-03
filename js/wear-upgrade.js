'use strict';
/* =========================================================
   WEAR — detail upgrades for the original wardrobe pieces
   (same ids, names & colours — richer art)
   ========================================================= */
(() => {
  const K = CK, { sh, cloth, st, fold, shine, button, sym, side, cr, line, mir, PAT, rivet, zipper, gem, bow, ruffle, scallops } = K, C = DATA.C, f = K.f;
  const old = id => DATA.ITEM_BY_ID[id];
  const up = (id, art, extra = {}) => { const o = old(id); if (!o) return null; return { ...o, ...extra, art, box: undefined, autoBox: 1, fresh: 0 }; };
  const hemSt = (y, c, x0 = 165, x1 = 235) => st(`M${x0},${y} Q200,${y + 2} ${x1},${y}`, sh(c, -38), .7, 1);
  const contrast = c => (U.luma(c) > .7 ? '#ff4f9a' : '#ffffff');
  const longBody = (yH, ease = 5) => sym([[[200, 375], [189, 371], [181, 364], [178, 356]], [[178, 356], [162, 361], [147, 371]], [[147, 371], ...side(386, Math.min(yH, 598), ease)], [[K.BL(Math.min(yH, 598)) - ease, yH], [200, yH + 3]]]);
  const ribBand = (y0, y1, c, ease = 5) => cloth(`M${K.BL(y0) - ease},${y0} L${400 - K.BL(y0) + ease},${y0} L${400 - K.BL(y1) + ease},${y1} L${K.BL(y1) - ease},${y1} Z`, sh(c, -8), { pat: PAT.rib(c), vert: false, ew: 1 });
  const crew = c => cloth('M176,352 C186,366 194,368 200,368 C206,368 214,366 224,352 L230,356 C218,376 208,380 200,380 C192,380 182,376 170,356 Z', sh(c, -6), { pat: PAT.rib(c), vert: false, ew: 1 });

  const L = [
    /* --- tops --- */
    up('top_crop', c => { const d = sym([[[200, 384], [190, 380], [182, 370], [178, 358]], [[178, 358], [168, 358]], [[168, 358], [161, 372], [154, 390], [150, 404]], side(412, 470, 2), [[K.BL(470) - 2, 470], [200, 472]]]);
      return { body: cloth(d, c, { pat: PAT.rib(c), patOp: .5 }) + line('M178,358 C182,370 190,380 200,384 C210,380 218,370 222,358', sh(c, -10), 3.4) + line('M168,358 C161,372 154,390 150,404 M232,358 C239,372 246,390 250,404', sh(c, -10), 3)
        + cloth(`M${K.BL(460) - 2},460 L${400 - K.BL(460) + 2},460 L${400 - K.BL(472) + 2},472 L${K.BL(472) - 2},472 Z`, sh(c, -12), { pat: PAT.rib(c), vert: false, ew: 1 })
        + `<path d="${ART.heart(200, 420, 13)}" fill="${sh(contrast(c), -20)}" transform="translate(1 1.5)" opacity=".5"/><path d="${ART.heart(200, 420, 13)}" fill="${contrast(c)}"/><path d="${ART.heart(200, 420, 9.4)}" fill="none" stroke="#fff" stroke-width="1.1" stroke-dasharray="1.8 1.4" opacity=".8"/><path d="${ART.spark4(216, 406, 4)}" fill="${contrast(c)}"/>`
        + fold('M168,430 Q180,438 190,434', c, 2.4, .25) + fold('M232,430 Q220,438 210,434', c, 2.4, .25) }; }),
    up('top_blouse', c => { const rf = U.luma(c) > .85 ? sh(c, -6) : sh(c, 30);
      return { sleeves: K.sleeves(c, { endY: 440, w0: 36, w1: 30, puff: 16, cuff: 6, cuffC: sh(c, -6), ruffle: 6 }),
        body: cloth(longBody(530, 4), c) + mir(cloth('M200,374 L188,362 L178,354 L172,370 L188,384 Z', c, { vert: false, ew: 1 }) + scallops(173, 188, 382, 2.2, rf, false, 2) + fold('M176,420 Q172,460 174,500', c, 2.4, .25))
          + ruffle([[193, 384], [191, 430], [190, 480], [191, 528]], 7, rf, { n: 9 }) + ruffle([[207, 528], [209, 480], [210, 430], [207, 384]], 7, rf, { n: 9 })
          + [400, 424, 448, 472, 496, 518].map(y => button(200, y, 2.6, '#fffdf8')).join('') + hemSt(523, c, 162, 238) + bow(200, 378, .34, '#ff8fc4') }; }),
    up('top_sweater', c => ({ sleeves: K.sleeves(c, { endY: 566, w0: 36, w1: 33, puff: 4, pat: 'url(#pKnit)', cuff: 16, cuffC: sh(c, -6), rib: true }),
      body: cloth('M180,318 L220,318 L224,362 Q200,376 176,362 Z', sh(c, -4), { pat: PAT.rib(c), vert: false }) + [326, 338, 350].map(y => fold(`M180,${y} Q200,${y + 5} 220,${y}`, c, 2.6, .35)).join('')
        + cloth(longBody(584, 7), c, { pat: 'url(#pKnit)' }) + ribBand(566, 590, c, 7) + fold('M166,470 Q180,480 192,474', c, 3, .3) + fold('M234,470 Q220,480 208,474', c, 3, .3) + shine('M174,396 C170,440 172,500 176,560', 8, .14) })),
    up('top_hoodie', c => ({ sleeves: K.sleeves(c, { endY: 566, w0: 37, w1: 34, puff: 3, cuff: 15, cuffC: sh(c, -6), rib: true }),
      body: cloth('M150,376 C136,346 162,318 200,318 C238,318 264,346 250,376 C238,364 222,358 200,358 C178,358 162,364 150,376 Z', sh(c, -10), { edgeOp: .6 }) + cloth('M164,368 C170,350 186,344 200,344 C214,344 230,350 236,368 C224,362 212,360 200,360 C188,360 176,362 164,368 Z', sh(c, -34), { vert: false, edge: false })
        + cloth(longBody(584, 7), c) + ribBand(566, 590, c, 7) + cloth('M168,508 L232,508 L246,560 L154,560 Z', sh(c, -4), { vert: false, ew: 1 }) + st('M171,512 L229,512 L242,556 L158,556 Z', sh(c, -40), .55, 1) + fold('M170,512 Q176,530 160,556 M230,512 Q224,530 240,556', c, 2.4, .35)
        + mir(line('M188,368 C188,390 186,404 184,420', '#fff', 2.6) + `<rect x="181.5" y="418" width="5" height="10" rx="2" fill="url(#gkSilver)"/>` + `<circle cx="188" cy="368" r="2.6" fill="url(#gkSilver)" stroke="#8a90a0" stroke-width=".6"/>`)
        + fold('M166,460 Q180,470 192,464', c, 2.6, .28) + fold('M234,460 Q220,470 208,464', c, 2.6, .28) })),
    up('top_sequin', c => { const d = sym([[[200, 404], [186, 398], [172, 396], [158, 400]], [[158, 400], [154, 418], ...side(436, 526, 1.5)], [[K.BL(526) - 1.5, 526], [200, 530]]]);
      return { body: line('M164,400 L178,357 M236,400 L222,357', sh(c, -12), 2.4) + line('M164,400 L178,357 M236,400 L222,357', '#fff', .8, .5) + cloth(d, c, { pat: ['url(#pSeq)', 'url(#pSpark)'], patOp: [1, .8], sheen: 'satin' })
        + scallops(158, 242, 403, 2.6, U.luma(c) > .6 ? '#fffaf2' : sh(c, 35), true, -5) + fold('M170,450 Q182,460 194,454', c, 2.4, .3) + fold('M230,450 Q218,460 206,454', c, 2.4, .3)
        + [[176, 430], [222, 468], [190, 500], [212, 420]].map(([x, y]) => `<path d="${ART.spark4(x, y, 4)}" fill="#fff"/>`).join('') }; }),
    up('top_hawaii', c => { const sl = K.sleeve(c, { endY: 456, w0: 35, w1: 33, pat: 'url(#pHibis)' });
      return { sleeves: mir(sl.svg + line(`M${K.pt(sl.S.outer[12])} L${K.pt(sl.S.inner[12])}`, sh(c, -12), 4)),
        body: cloth(sym([[[200, 412], [188, 386], [178, 357]], [[178, 357], [162, 361], [147, 371]], [[147, 371], ...side(386, 532, 5)], [[K.BL(532) - 5, 532], [200, 534]]]), c, { pat: 'url(#pHibis)' })
          + mir(cloth('M178,357 L170,362 L166,380 L190,404 L196,412 L186,386 Z', sh(c, 12), { pat: 'url(#pHibis)', vert: false, ew: 1 }) + st('M172,366 L170,382 L190,402', sh(c, -40), .6, .9))
          + line('M200,412 L200,532', sh(c, -30), 1.4) + [430, 458, 486, 514].map(y => button(204, y, 2.6, '#fffaf0', 2)).join('') + K.pocket(158, 420, 24, 24, c, { pat: 'url(#pHibis)' }) + hemSt(527, c, 160, 240) }; }),

    /* --- bottoms --- */
    up('bot_mini', c => ({ body: K.pleated(c, 516, 660, 64, 12, { curve: 8 }) + K.waistband(c, 514, 14) + `<rect x="190" y="514" width="20" height="14" rx="2" fill="none" stroke="url(#gkSilver)" stroke-width="2"/>` + line('M200,516 L200,526', '#c8ccd6', 2) })),
    up('bot_tutu', c => { const lay = (y1, w, op, sp) => { const d = K.fullSkirt(520, y1, 40, w, { bell: 1, curve: 10, wave: 6, waves: 9 }); return `<path d="${d}" fill="${sh(c, 18)}" opacity="${op}"/>` + (sp ? `<path d="${d}" fill="url(#pSpark)" opacity=".9"/>` : '') + `<path d="${d}" fill="none" stroke="#fff" stroke-width="1.4" opacity=".6"/>`; };
      return { body: cloth(K.fullSkirt(520, 724, 40, 92, { bell: 1, curve: 10 }), c, { drop: 5 }) + K.gathers(520, 724, 40, 92, 12, c, { bell: 1, curve: 10, op: .26 }) + lay(742, 104, .45, 0) + lay(732, 98, .4, 1) + lay(716, 90, .35, 1)
        + K.waistband(c, 512, 14, { c: sh(c, -15) }) + bow(222, 520, .46, sh(c, -15)) }; }),
    up('bot_maxi', c => ({ body: cloth(K.fullSkirt(520, 920, 38, 92, { bell: .4, curve: 10, wave: 5, waves: 6 }), c, { pat: 'url(#pFlow)', patOp: .55, drop: 5 }) + K.gathers(520, 920, 38, 92, 14, c, { bell: .4, curve: 10 })
      + K.waistband(c, 514, 14) + mir(line('M178,526 C176,546 172,566 168,590', sh(c, -20), 1.6) + `<circle cx="168" cy="592" r="2.6" fill="${sh(c, -20)}"/>`) })),
    up('bot_leggings', c => { const d = K.pants({ eo: 1, ei: .8 });
      return { body: cloth(d, c, { sheen: 'satin' }) + K.waistband(c, 514, 16, { c: sh(c, -8) }) + mir(st(cr([[K.BL(560) + 8, 560], [K.BL(700) + 4, 700], [K.BL(860) + 3, 860]]), sh(c, 25), .4, .9) + fold('M168,770 Q178,776 190,772', c, 2, .3)) }; }),
    up('bot_denim', c => { const d = K.pants({ hem: 636, eo: (y, t) => 2 + t * 5, ei: (y, t) => 1 + t * .5 });
      return { body: cloth(d, c, { pat: 'url(#pDenim)', drop: 5 }) + K.waistband(c, 514, 13, { thread: '#e6a84a' }) + K.loops(c, 512, 18, [166, 186, 214, 234]) + button(200, 521, 3.4, '#e6be6a', 0)
        + mir(st('M170,528 Q176,546 158,562', '#e6a84a', .9, 1.1) + rivet(171, 529, 1.6) + cloth('M152,560 L170,556 L172,626 L150,628 Z', sh(c, -10), { pat: 'url(#pDenim)', vert: false, edge: false, op: .6 })
          + line(Array.from({ length: 12 }, (_, i) => `M${142 + i * 4.6},${636 + (i % 2)} L${143 + i * 4.6},${644 + (i % 3)}`).join(' '), '#fff', 1.2, .8) + `<ellipse cx="176" cy="598" rx="12" ry="20" fill="url(#faceGlow)" opacity=".5"/>`)
        + st('M200,528 L207,528 L207,566 Q207,574 200,578', '#e6a84a', .9, 1.1) }; }),

    /* --- dresses --- */
    up('dress_sun', c => { const sk = K.fullSkirt(524, 742, 38, 98, { bell: .9, curve: 10, wave: 4, waves: 7 });
      return { body: cloth(sk, c, { pat: 'url(#pFlow)', patOp: .85, drop: 6 }) + K.gathers(524, 742, 38, 98, 14, c, { bell: .9, curve: 10 })
        + line('M166,398 L178,357 M234,398 L222,357', sh(c, -10), 4) + bow(178, 360, .2, sh(c, -10)) + bow(222, 360, .2, sh(c, -10))
        + cloth(K.BOD.sweet(526, 4), c, { pat: 'url(#pFlow)', patOp: .85 }) + [420, 440, 460, 480, 500].map(y => st(`M158,${y} Q200,${y + 3} 242,${y}`, sh(c, -30), .45, 1, '1.6 2.2')).join('')
        + K.sash(512, 14, sh(c, -22)) + bow(218, 518, .48, sh(c, -22)) + K.tails(218, 526, sh(c, -22), 50, -1) }; }),
    up('dress_party', c => { const d = K.runs([[[152, 404], [170, 384], [196, 366], [222, 356], [234, 360]], [[234, 360], [246, 376], [251, 396], [400 - K.BL(420) + 1, 420], ...side(440, 598, 1).map(K.mx)], [[400 - K.BL(598) + 1, 598], [258, 640], [262, 664]], K.hemLine(664, 62, 6, c).reverse(), [[138, 664], [142, 640], [K.BL(598) - 1, 598], ...side(440, 598, 1).reverse().slice(1), [152, 404]]]);
      return { body: cloth(d, c, { pat: ['url(#pSeq)', 'url(#pSpark)'], patOp: [1, .65], sheen: 'satin' }) + ruffle([[218, 352], [236, 360], [248, 378], [254, 400]], 13, sh(c, 12), { n: 6, jit: 1 })
        + [[162, 440, 236, 520], [160, 480, 240, 560], [146, 560, 252, 620]].map(([a, b, x, y]) => fold(`M${a},${b} Q200,${(b + y) / 2 - 6} ${x},${y}`, c, 2.6, .3)).join('') + line(cr(K.hemLine(664, 62, 6, c)), '#fff', 2, .45) }; }),
    up('dress_gala', c => { const sk = K.fullSkirt(516, 936, 38, 150, { bell: 1.1, curve: 14, wave: 8, waves: 8 });
      return { body: cloth(sk, c, { pat: 'url(#pSpark)', patOp: .8, sheen: 'satin', drop: 4 }) + K.gathers(516, 936, 38, 150, 18, c, { bell: 1.1, curve: 14, op: .32 })
        + ruffle(K.hemLine(936, 150, 14, c, { wave: 8, waves: 8 }).reverse(), 9, sh(c, 15), { n: 22, flip: true })
        + cloth(K.BOD.sweet(520, 8), c, { sheen: 'satin', edgeOp: .7 }) + [180, 220].map(x => line(`M${x},396 C${x},450 ${x + (x < 200 ? 4 : -4)},490 ${x + (x < 200 ? 6 : -6)},520`, sh(c, -25), 1.2, .6)).join('')
        + `<path d="M163,502 Q200,506 237,502 L237,518 Q200,522 163,518 Z" fill="url(#gkMetal)"/>` + [174, 188, 212, 226].map(x => gem(x, 510, 3, '#ffffff')).join('') + gem(200, 510, 5, '#ff4f9a') }; }),
    up('dress_swim', c => { const d = old('dress_swim') && 'M156,398 Q200,412 244,398 C252,420 246,470 238,520 C242,550 252,575 254,600 C236,602 214,614 204,640 L196,640 C186,614 164,602 146,600 C148,575 158,550 162,520 C154,470 148,420 156,398 Z';
      return { body: line('M164,400 L178,357 M236,400 L222,357', c, 5) + line('M164,400 L178,357 M236,400 L222,357', '#fff', 1.2, .4) + cloth(d, c, { pat: PAT.breton(c, '#ffffff'), patOp: .55, sheen: 'satin' })
        + ruffle([[146, 598], [170, 606], [196, 638]].reverse(), 6, c, { n: 5 }) + ruffle([[204, 638], [230, 606], [254, 598]].reverse(), 6, c, { n: 5 })
        + st('M157,404 Q200,418 243,404', '#fff', .6, 1) + bow(200, 410, .36, '#fff') }; }),
    up('dress_knit', c => ({ sleeves: K.sleeves(c, { endY: 566, w0: 36, w1: 33, puff: 3, pat: PAT.cable(c), cuff: 16, cuffC: sh(c, -6), rib: true }),
      body: cloth('M180,318 L220,318 L224,362 Q200,376 176,362 Z', sh(c, -4), { pat: PAT.rib(c), vert: false }) + [326, 338, 350].map(y => fold(`M180,${y} Q200,${y + 5} 220,${y}`, c, 2.6, .35)).join('')
        + cloth(sym([[[200, 375], [189, 371], [181, 364], [178, 356]], [[178, 356], [162, 361], [147, 371]], [[147, 371], ...side(386, 598, 6), [K.BL(598) - 10, 690]], [[K.BL(598) - 10, 690], [200, 694]]]), c, { pat: PAT.cable(c), drop: 5 })
        + cloth(`M${K.BL(598) - 9},676 L${400 - K.BL(598) + 9},676 L${400 - K.BL(598) + 10},692 L${K.BL(598) - 10},692 Z`, sh(c, -8), { pat: PAT.rib(c), vert: false, ew: 1 })
        + K.sash(516, 14, '#7a4f33', { sheen: 1 }) + `<rect x="190" y="513" width="20" height="20" rx="3" fill="none" stroke="url(#gkMetal)" stroke-width="3"/><rect x="198.5" y="516" width="3" height="14" rx="1" fill="url(#gkMetal)"/>` })),

    /* --- outerwear --- */
    up('outer_leather', c => { const S = K.sleevePath({ endY: 574, w0: 36, w1: 32 });
      return { sleeves: mir(K.sleeve(c, { endY: 574, w0: 36, w1: 32, sheen: 'leather', cuff: 0 }).svg + zipper(f((S.outer[12][0] + S.inner[12][0]) / 2 - 3), 548, 576, '#d9dde6', false)),
        body: mir(cloth(K.runs([[[183, 352], [164, 359], [146, 371]], [[146, 371], ...side(386, 540, 5).slice(1)], [[K.BL(540) - 5, 540], [192, 542]], [[192, 542], [192, 450], [188, 404]], [[188, 404], [184, 372], [183, 352]]]), c, { sheen: 'leather' })
          + cloth('M183,352 L166,370 L176,400 L188,436 L190,404 Z', sh(c, 12), { sheen: 'leather', vert: false, edgeOp: .7 }) + rivet(172, 378, 2, '#d9dde6') + rivet(182, 418, 2, '#d9dde6')
          + cloth(`M${K.BL(526) - 5},526 L192,527 L192,542 L${K.BL(540) - 5},540 Z`, sh(c, -10), { sheen: 'leather', vert: false, ew: 1 }) + zipper(168, 450, 500, '#d9dde6', true) + shine('M156,420 C160,460 162,500 164,530', 4, .25))
          + `<rect x="152" y="527" width="8" height="12" rx="1.5" fill="none" stroke="url(#gkSilver)" stroke-width="2"/>` }; }),
    up('outer_coat', c => { const fur = PAT.boucle('#fffaf2');
      return { sleeves: K.sleeves(c, { endY: 566, w0: 38, w1: 36, cuff: 0 }) + mir(`<path d="M${f(K.armAt(K.armS(566)).p[0] - 22)},560 Q${f(K.armAt(K.armS(566)).p[0])},552 ${f(K.armAt(K.armS(566)).p[0] + 22)},564 L${f(K.armAt(K.armS(580)).p[0] + 22)},580 Q${f(K.armAt(K.armS(580)).p[0])},572 ${f(K.armAt(K.armS(580)).p[0] - 22)},576 Z" fill="#fffaf2"/><path d="M${f(K.armAt(K.armS(566)).p[0] - 22)},560 Q${f(K.armAt(K.armS(566)).p[0])},552 ${f(K.armAt(K.armS(566)).p[0] + 22)},564 L${f(K.armAt(K.armS(580)).p[0] + 22)},580 Q${f(K.armAt(K.armS(580)).p[0])},572 ${f(K.armAt(K.armS(580)).p[0] - 22)},576 Z" fill="${fur}"/>`),
        body: mir(cloth(K.runs([[[183, 352], [164, 359], [146, 371]], [[146, 371], ...side(386, 598, 6).slice(1), [K.BL(598) - 12, 690], [K.BL(598) - 16, 764]], [[K.BL(598) - 16, 764], [204, 766]], [[204, 766], [204, 470], [198, 420]], [[198, 420], [186, 376], [183, 352]]]), c, { drop: 5 })
          + fold('M168,600 Q160,680 154,760 M188,610 Q188,680 190,764', c, 3, .3) + K.pocket(150, 590, 30, 30, c, { flap: true }) + st('M200,470 L200,764', sh(c, -35), .5, .9))
          + `<path d="M150,372 C166,360 180,356 200,388 C220,356 234,360 250,372 C256,392 236,404 200,412 C164,404 144,392 150,372 Z" fill="#fffaf2"/><path d="M150,372 C166,360 180,356 200,388 C220,356 234,360 250,372 C256,392 236,404 200,412 C164,404 144,392 150,372 Z" fill="${fur}"/>`
          + K.sash(516, 16, sh(c, -14)) + `<rect x="188" y="512" width="24" height="24" rx="4" fill="none" stroke="url(#gkMetal)" stroke-width="3.2"/>` + [446, 488, 560, 610, 660].map(y => button(212, y, 3.6, sh(c, -32))).join('') }; }),
    up('outer_denim', c => { const th = '#e6a84a';
      return { sleeves: K.sleeves(c, { endY: 570, w0: 36, w1: 33, pat: 'url(#pDenim)', cuff: 12, cuffC: c, cuffBtn: '#e6be6a' }),
        body: mir(cloth(K.runs([[[183, 352], [164, 359], [146, 371]], [[146, 371], ...side(386, 532, 5).slice(1)], [[K.BL(532) - 5, 532], [196, 533]], [[196, 533], [196, 430], [188, 400]], [[188, 400], [184, 370], [183, 352]]]), c, { pat: 'url(#pDenim)' })
          + cloth('M183,352 L162,370 L174,394 L188,382 Z', sh(c, -10), { pat: 'url(#pDenim)', vert: false, ew: 1 }) + st('M180,358 L166,371 L175,389', th, .85, 1)
          + st('M150,398 Q170,404 194,402', th, .85, 1.1) + K.pocket(160, 418, 26, 24, c, { flap: true, btn: '#e6be6a', thread: th, pat: 'url(#pDenim)' })
          + st('M174,446 L170,520 M180,446 L178,520', th, .7, 1) + cloth(`M${K.BL(518) - 5},518 L196,519 L196,533 L${K.BL(532) - 5},532 Z`, sh(c, -10), { pat: 'url(#pDenim)', vert: false, ew: 1 }) + st(`M${K.BL(521) - 4},521 L195,522`, th, .8, 1))
          + [410, 440, 470, 500, 526].map(y => button(206, y, 2.8, '#e6be6a', 0) + `<circle cx="206" cy="${y}" r="1.1" fill="#a07020"/>`).join('') }; }),
    up('outer_stole', c => { const bp = PAT.boucle(c);
      return { body: cloth('M136,378 C150,404 176,416 200,416 C224,416 250,404 264,378 C278,404 286,446 290,484 C262,464 234,454 200,454 C166,454 138,464 110,484 C114,446 122,404 136,378 Z', c, { pat: [bp, 'url(#pSpark)'], patOp: [1, .8], edgeOp: .4 })
        + `<path d="M110,484 C138,464 166,454 200,454 C234,454 262,464 290,484" fill="none" stroke="${c}" stroke-width="5" stroke-dasharray="1 3.4" stroke-linecap="round"/>` + fold('M140,420 Q160,440 172,452 M260,420 Q240,440 228,452', c, 3, .3) + gem(200, 430, 6, '#ffffff') }; }),
  ].filter(Boolean);
  WEAR.add(L);
})();
