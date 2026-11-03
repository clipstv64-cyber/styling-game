'use strict';
/* =========================================================
   WEAR — detailed jackets, coats & shoes
   ========================================================= */
(() => {
  const K = CK, { sh, cloth, st, fold, shine, button, sym, side, cr, line, mir, PAT, rivet, zipper, gem, bow, lacing } = K, C = DATA.C, f = K.f;

  /* open jacket panel (left), front edge at fx */
  const panel = (yH, ease = 6, fx = 190, top = 396) => K.runs([[[183, 352], [164, 359], [146, 371]], [[146, 371], ...side(386, Math.min(yH, 598), ease).slice(1), ...(yH > 598 ? [[K.BL(598) - ease - (yH - 598) * .08, yH]] : [])], [[yH > 598 ? K.BL(598) - ease - (yH - 598) * .08 : K.BL(yH) - ease, yH], [fx, yH + 2]], [[fx, yH + 2], [fx - .5, 470], [fx - 1, top]], [[fx - 1, top], [184, 370], [183, 352]]]);
  const closed = (yH, ease = 6) => sym([[[200, 370], [190, 366], [182, 358], [178, 352]], [[178, 352], [162, 358], [146, 370]], [[146, 370], ...side(386, Math.min(yH, 598), ease).slice(1)], [[K.BL(Math.min(yH, 598)) - ease, yH], [200, yH + 2]]]);
  const lapel = (c, yB = 452, w = 20) => cloth(`M183,352 C176,370 170,388 ${190 - w},${404} L${186 - w * .55},${410} C178,430 184,${yB - 20} 190,${yB} L190,${yB - 6} C192,430 190,400 188,376 Z`, sh(c, 10), { vert: false, edgeOp: .6, ew: 1 })
    + st(`M184,358 C178,374 173,390 ${193 - w},${404}`, sh(c, -35), .55, .9) + fold(`M${186 - w * .55},${410} C180,430 186,${yB - 22} 190,${yB - 2}`, c, 2, .4);

  const OUTER = [
    /* --- Pufferjacke --- */
    { id: 'outer_puffer', cat: 'outer', slot: 'outer', name: 'Pufferjacke', autoBox: 1, colors: ['#ff8fc4', '#2a2230', '#c9a7ff', '#d9dde6', '#ffd84d', '#ffffff'],
      art: c => { const ys = [396, 424, 452, 480, 508, 536], E = 12;
        const bump = []; for (let i = 0; i < ys.length; i++) { const y0 = i ? ys[i - 1] : 382, y1 = ys[i]; bump.push([K.BL((y0 + y1) / 2) - E - 3, (y0 + y1) / 2], [K.BL(y1) - E + 1, y1]); }
        const body = sym([[[200, 340], [188, 340], [180, 344]], [[180, 344], [180, 356], [164, 360], [146, 368]], [[146, 368], [K.BL(382) - E + 1, 382], ...bump, [K.BL(560) - E, 562]], [[K.BL(560) - E, 562], [200, 566]]]);
        const S = K.sleevePath({ endY: 572, w0: 44, w1: 40, puff: 8 });
        let sl = K.sleeve(c, { endY: 572, w0: 44, w1: 40, puff: 8, cuff: 12, cuffC: sh(c, -14), rib: true, sheen: 'satin', seam: false }).svg;
        [2, 4, 6, 8, 10].forEach(i => { sl += fold(`M${K.pt(S.outer[i])} Q${K.pt([(S.outer[i][0] + S.inner[i][0]) / 2, (S.outer[i][1] + S.inner[i][1]) / 2 + 3])} ${K.pt(S.inner[i])}`, c, 3, .45); });
        [3, 5, 7, 9].forEach(i => { sl += shine(`M${K.pt([S.outer[i][0] * .8 + S.inner[i][0] * .2, S.outer[i][1] * .8 + S.inner[i][1] * .2])} L${K.pt([S.outer[i][0] * .45 + S.inner[i][0] * .55, S.outer[i][1] * .45 + S.inner[i][1] * .55])}`, 3.4, .32); });
        return { sleeves: mir(sl),
          body: cloth(body, c, { sheen: 'satin', edgeOp: .65 })
            + ys.map(y => fold(`M${K.BL(y) - 12},${y} Q200,${y + 6} ${400 - K.BL(y) + 12},${y}`, c, 3.4, .45) + st(`M${K.BL(y) - 10},${y + .5} Q200,${y + 6.5} ${400 - K.BL(y) + 10},${y + .5}`, sh(c, -45), .4, .8)).join('')
            + [382, ...ys].slice(0, -1).map((y, i) => shine(`M${K.BL(y + 14) - 4},${y + 12} Q180,${y + 8} 194,${y + 11}`, 3.6, .32)).join('')
            + cloth('M176,336 Q200,330 224,336 L226,364 Q200,372 174,364 Z', sh(c, -6), { sheen: 'satin', vert: false })
            + zipper(200, 338, 562) + mir(cloth('M162,500 L170,500 L176,540 L168,540 Z', sh(c, -12), { vert: false, ew: .8 }) + zipper(172, 502, 538, '#c8ccd6', false)) }; } },

    /* --- Blazer --- */
    { id: 'outer_blazer', cat: 'outer', slot: 'outer', name: 'Blazer', autoBox: 1, colors: ['#2a2230', '#e8d3b5', '#ff8fc4', '#ffffff', '#2f3f73', '#c8102e'],
      art: c => { const pat = c === '#2f3f73' ? PAT.pin(c) : c === '#ff8fc4' ? PAT.tweed(c) : null;
        return { sleeves: K.sleeves(c, { endY: 574, w0: 35, w1: 31, pat }) + mir([0, 1, 2].map(i => button(f(K.armAt(K.armS(560)).p[0] + 6 - i * .6), 556 - i * 6, 1.8, sh(c, -30), 2)).join('')),
          body: mir(cloth(panel(588, 5, 196, 440), c, { pat }) + lapel(c, 470, 22) + st('M194,446 L195,586', sh(c, -40), .5, .9)
            + K.pocket(156, 530, 30, 14, c, { flap: true, pat }) + fold('M166,470 Q176,480 188,476', c, 2.4, .32) + fold('M162,512 Q170,520 178,518', c, 2.2, .28) + shine('M168,410 C164,460 166,520 170,580', 6, .14))
            + K.pocket(212, 418, 22, 8, c, { pat }) + `<path d="M216,418 L220,406 L224,414 L228,404 L232,418 Z" fill="#ff8fc4"/><path d="M216,418 L220,406 L224,414 L228,404 L232,418 Z" fill="url(#fabShade)"/>`
            + button(198, 506, 3.6, sh(c, -30), 4) + `<path d="M196,508 L204,508" stroke="${sh(c, -50)}" stroke-width="1" opacity=".5"/>` }; } },

    /* --- Collegejacke --- */
    { id: 'outer_varsity', cat: 'outer', slot: 'outer', name: 'Collegejacke', autoBox: 1, colors: ['#c8102e', '#2f3f73', '#2f6a4a', '#ff8fc4', '#2a2230', '#8b5cf6'],
      art: c => { const sl = '#fbf5ea', rib = (d) => cloth(d, sh(c, -6), { pat: PAT.rib(c), vert: false, ew: 1 });
        return { sleeves: K.sleeves(sl, { endY: 574, w0: 36, w1: 32, cuff: 14, cuffC: c, rib: true, sheen: 'leather' }) + mir(line(`M${f(K.sleevePath({ endY: 574, w0: 36, w1: 32 }).outer[12][0] + 2)},${562} L${f(K.sleevePath({ endY: 574, w0: 36, w1: 32 }).inner[12][0] - 2)},${565}`, sl, 2.4)),
          body: cloth(closed(560, 6), c, { pat: 'url(#pWeave)', patOp: .3 }) + rib('M172,348 Q200,358 228,348 L232,362 Q200,374 168,362 Z') + line('M170,356 Q200,368 230,356', sl, 2.2)
            + rib(`M${K.BL(544) - 6},544 L${400 - K.BL(544) + 6},544 L${400 - K.BL(564) + 6},564 L${K.BL(564) - 6},564 Z`) + line(`M${K.BL(552) - 6},552 L${400 - K.BL(552) + 6},552`, sl, 2.4) + line(`M${K.BL(557) - 6},557 L${400 - K.BL(557) + 6},557`, sl, 1.6)
            + line('M200,366 L200,544', sh(c, -35), 1.4) + [384, 414, 444, 474, 504, 532].map(y => rivet(200, y, 3, '#d9dde6')).join('')
            + `<g transform="translate(176 430)"><path d="M-12,-14 L12,-14 L12,14 L-12,14 Z" fill="${sl}" rx="3"/><text x="0" y="9" font-family="Georgia,serif" font-weight="900" font-size="26" text-anchor="middle" fill="${c}" stroke="${sl}" stroke-width="1">S</text></g>`
            + mir(cloth('M160,488 L172,484 L178,528 L166,530 Z', sh(c, 8), { vert: false, ew: .9, sheen: 'leather' }) + fold('M164,460 Q176,470 188,466', c, 2.4, .3)) + `<path d="${ART.star(226, 426, 8, 3.4)}" fill="#ffd84d" stroke="${sl}" stroke-width="1"/>` }; } },

    /* --- Trenchcoat --- */
    { id: 'outer_trench', cat: 'outer', slot: 'outer', name: 'Trenchcoat', autoBox: 1, colors: ['#d6b98a', '#2a2230', '#ffc2d9', '#7a8c6a', '#ffffff'],
      art: c => { const d2 = sh(c, -10), bt = sh(c, -40);
        const coat = K.runs([[[183, 352], [164, 359], [146, 371]], [[146, 371], ...side(386, 598, 6).slice(1), [K.BL(598) - 14, 680], [K.BL(598) - 22, 744]], [[K.BL(598) - 22, 744], [200, 750], [214, 748]], [[214, 748], [214, 470], [206, 420]], [[206, 420], [188, 374], [183, 352]]]);
        return { sleeves: K.sleeves(c, { endY: 574, w0: 37, w1: 33, cuff: 0 }) + mir(cloth(`M${f(K.armAt(K.armS(548)).p[0] - 18)},544 L${f(K.armAt(K.armS(548)).p[0] + 17)},548 L${f(K.armAt(K.armS(556)).p[0] + 17)},556 L${f(K.armAt(K.armS(556)).p[0] - 18)},552 Z`, d2, { vert: false, ew: .9 }) + rivet(f(K.armAt(K.armS(550)).p[0] + 12), 551, 2, '#c8a060')),
          body: mir(cloth(coat, c, { drop: 5 }) + fold('M168,600 Q160,680 150,740 M186,610 Q186,680 188,744', c, 3, .3) + st('M210,470 L210,744', bt, .5, .9) + lapel(c, 452, 26)
            + cloth('M146,371 L172,366 L174,378 L148,384 Z', d2, { vert: false, ew: .9 }) + button(168, 374, 2.6, bt, 2) + cloth('M150,402 C162,404 172,410 178,420 L170,438 C162,430 154,424 150,420 Z', d2, { vert: false, ew: .9 })
            + K.pocket(150, 600, 28, 30, c, { flap: true, btn: bt }) + shine('M168,400 C164,460 166,560 160,700', 6, .14))
            + [452, 488].map(y => button(184, y, 3.4, bt) + button(216, y, 3.4, bt)).join('')
            + cloth('M156,512 Q200,520 244,512 L246,530 Q200,538 154,530 Z', d2, { vert: false }) + `<rect x="186" y="510" width="22" height="24" rx="3" fill="none" stroke="${bt}" stroke-width="3"/>` + line('M200,522 L212,522', bt, 2)
            + cloth('M208,526 C214,560 210,600 216,640 L226,638 C222,600 224,560 218,524 Z', d2, { vert: false, ew: .9 }) }; } },

    /* --- Strickjacke --- */
    { id: 'outer_cardigan', cat: 'outer', slot: 'outer', name: 'Strickjacke', autoBox: 1, colors: ['#f3e9da', '#ffc2d9', '#9cc9a8', '#b3adbd', '#e6b43a', '#c9a7ff'],
      art: c => { const cp = PAT.cable(c), band = sh(c, -6);
        return { sleeves: K.sleeves(c, { endY: 572, w0: 37, w1: 34, puff: 3, pat: cp, cuff: 16, cuffC: band, rib: true }),
          body: mir(cloth(panel(582, 8, 196, 450), c, { pat: cp }) + cloth('M183,352 C186,380 192,420 196,452 L196,584 L189,584 L189,456 C184,424 178,384 176,354 Z', band, { pat: PAT.rib(c), vert: false, ew: 1 })
            + cloth(`M${K.BL(566) - 8},566 L196,568 L196,586 L${K.BL(584) - 8},584 Z`, band, { pat: PAT.rib(c), vert: false, ew: 1 }) + K.pocket(158, 526, 26, 26, c, { pat: PAT.rib(c) }) + fold('M164,470 Q176,480 186,476', c, 2.6, .3))
            + [460, 486, 512, 538, 564].map(y => button(192.5, y, 3, '#fff7ec')).join('') }; } },

    /* --- Teddyjacke --- */
    { id: 'outer_teddy', cat: 'outer', slot: 'outer', name: 'Teddyjacke', autoBox: 1, colors: ['#f5ecdc', '#ffd1e3', '#b98a62', '#d9c6ff', '#2a2230'],
      art: c => { const bp = PAT.boucle(c), fuzz = d => `<path d="${d}" fill="none" stroke="${c}" stroke-width="4" stroke-dasharray="1 3" stroke-linecap="round"/>`;
        return { sleeves: K.sleeves(c, { endY: 574, w0: 42, w1: 38, puff: 6, pat: bp, cuff: 0, seam: false }),
          body: mir(cloth(panel(580, 12, 194, 420), c, { pat: bp, edgeOp: .35 }) + fuzz(cr(side(386, 580, 13)))
            + cloth('M183,352 C174,366 160,384 150,394 L170,408 L188,420 L190,400 Z', sh(c, -10), { pat: bp, vert: false, edgeOp: .35 }) + K.pocket(152, 510, 30, 34, c, { pat: bp, fill: sh(c, -6), thread: sh(c, -20) })
            + fold('M162,460 Q174,470 186,466', c, 3, .3)) + zipper(194, 420, 578, '#c8ccd6', true) }; } },
  ];

  /* ---------------- shoes ---------------- */
  const FOOT = 'M169,904 L191,904 C194,918 196,930 191,940 C185,947 173,947 168,939 C164,929 166,916 169,904 Z';
  const shaft = (y0, ease = 3, yb = 906) => { const o = []; for (let y = y0; y <= yb; y += 16) o.push([K.BL(y) - ease, y]); const i = []; for (let y = yb; y >= y0; y -= 16) i.push([K.IL(y) + ease, y]); return K.runs([[[K.BL(y0) - ease, y0], [K.IL(y0) + ease, y0]], i.reverse().length ? [[K.IL(y0) + ease, y0], ...[...i].reverse().slice(1)] : [], [[K.IL(yb) + ease, yb], [195, 920], [197, 934], [192, 946], [180, 951], [168, 946], [163, 934], [164, 918], [K.BL(yb) - ease, yb]], [[K.BL(yb) - ease, yb], ...o.slice().reverse().slice(1)]]); };

  const SHOES = [
    { id: 'shoe_platform', cat: 'shoes', slot: 'shoes', name: 'Plateau-Sneaker', autoBox: 1, colors: ['#ffffff', '#ff8fc4', '#2a2230', '#c9a7ff', '#7de3c5'],
      art: c => { const acc = U.luma(c) > .8 ? '#ff4f9a' : '#ffffff', sole = '#fbfbfb';
        return { body: mir(cloth('M166,898 L194,898 C198,912 200,926 198,938 L162,938 C160,926 162,912 166,898 Z', c, { edgeOp: .6 })
          + cloth('M158,934 L202,934 L203,956 Q180,962 157,956 Z', sole, { edgeOp: .5 }) + line('M160,944 L201,944 M159,950 L202,950', '#d9dde6', 1.4) + `<path d="M157,956 Q180,962 203,956 L203,959 Q180,965 157,959 Z" fill="${acc}"/>`
          + cloth('M164,920 C170,914 190,914 196,920 L198,934 L162,934 Z', sh(c, -8), { vert: false, ew: .9 }) + line('M170,904 L190,904', sh(c, -25), 1.6) + lacing(180, 902, 916, 6, 7, acc, 4)
          + `<path d="M165,926 Q180,918 196,926" stroke="${acc}" stroke-width="3" fill="none" stroke-linecap="round"/>` + `<path d="${ART.star(170, 922, 3.4, 1.4)}" fill="${acc}"/>` + st('M164,932 L197,932', sh(c, -35), .6, .8) + shine('M168,906 L168,926', 2.4, .5)) }; } },
    { id: 'shoe_maryjane', cat: 'shoes', slot: 'shoes', name: 'Mary Janes', autoBox: 1, colors: ['#2a2230', '#c8102e', '#ff8fc4', '#ffffff', '#c9965f'],
      art: c => ({ body: mir(cloth('M166,890 L194,890 L195,906 L165,906 Z', '#ffffff', { vert: false, ew: .8 }) + K.ruffle([[194, 890], [180, 888], [166, 890]], 4, '#ffffff', { n: 5 })
        + cloth('M165,916 L195,916 C198,928 198,938 193,945 C186,952 172,952 166,945 C161,938 162,928 165,916 Z', c, { sheen: 'leather', edgeOp: .7 })
        + cloth('M164,906 L196,906 L196,912 L164,912 Z', c, { vert: false, ew: .9 }) + `<rect x="186" y="904" width="7" height="10" rx="1.5" fill="none" stroke="url(#gkMetal)" stroke-width="1.8"/>`
        + `<ellipse cx="172" cy="932" rx="3" ry="6" fill="#fff" opacity=".55"/>` + bow(180, 919, .22, c)) }) },
    { id: 'shoe_cowboy', cat: 'shoes', slot: 'shoes', name: 'Cowboystiefel', autoBox: 1, colors: ['#8a5a36', '#ffffff', '#ff8fc4', '#2a2230', '#c8102e'],
      art: c => { const th = U.luma(c) > .7 ? '#c9965f' : '#f3e2b5', d = 'M160,776 C164,772 196,772 200,776 L196,880 C196,900 198,920 196,936 C192,950 168,950 164,940 C160,926 162,900 164,880 Z';
        return { body: mir(cloth(d, c, { sheen: 'leather', edgeOp: .7 }) + `<path d="M160,776 L166,766 L170,778 Z M200,776 L194,766 L190,778 Z" fill="${sh(c, -15)}"/>`
          + st('M170,790 C176,810 184,810 190,790 M168,812 C176,840 184,840 192,812 M172,800 L180,830 L188,800', th, .9, 1.2) + `<path d="${ART.star(180, 852, 7, 3)}" fill="${th}"/>`
          + cloth('M164,940 L196,940 L198,950 L162,950 Z', sh(c, -40), { vert: false, ew: .8 }) + `<path d="M186,946 L196,946 L194,962 L188,962 Z" fill="${sh(c, -45)}"/>` + st('M166,882 Q180,888 194,882', th, .8, 1) + shine('M168,786 L166,880', 3, .25)) }; } },
    { id: 'shoe_chelsea', cat: 'shoes', slot: 'shoes', name: 'Glitzer-Stiefeletten', autoBox: 1, colors: ['#e6be6a', '#d9dde6', '#ff4f9a', '#2a2230', '#8b5cf6'],
      art: c => ({ body: mir(cloth('M164,852 L196,852 L195,906 C198,920 199,932 196,942 C190,952 170,952 164,944 C160,932 162,910 164,900 Z', c, { pat: ['url(#pSeq)', 'url(#pSpark)'], edgeOp: .7 })
        + cloth('M166,860 L174,860 L172,900 L166,904 Z', sh(c, -30), { vert: false, ew: .8, pat: PAT.rib(sh(c, -30)) }) + cloth('M188,846 L194,846 L194,860 L188,860 Z', sh(c, -20), { vert: false, ew: .8 })
        + `<path d="M186,944 L196,944 L193,966 L189,966 Z" fill="${sh(c, -35)}"/>` + cloth('M163,944 L197,944 L197,950 L163,950 Z', sh(c, -40), { vert: false, ew: .6 })) }) },
    { id: 'shoe_roller', cat: 'shoes', slot: 'shoes', name: 'Rollschuhe', autoBox: 1, colors: ['#ffffff', '#ff8fc4', '#7de3c5', '#c9a7ff', '#2a2230'],
      art: c => { const wh = c === '#ff8fc4' ? '#7de3c5' : '#ff8fc4';
        return { body: mir(cloth('M162,840 L198,840 L197,906 C200,918 200,930 198,938 L162,938 C160,926 160,910 163,900 Z', c, { edgeOp: .6 }) + cloth('M162,840 L198,840 L198,852 L162,852 Z', sh(c, -8), { pat: PAT.rib(c), vert: false, ew: .8 })
          + lacing(180, 860, 920, 7, 7, wh, 6) + cloth('M158,936 L202,936 L202,946 L158,946 Z', '#c8ccd6', { vert: false, ew: .8 }) + `<rect x="158" y="936" width="44" height="10" rx="2" fill="url(#gkSilver)"/>`
          + [[166, 954], [194, 954]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="${wh}"/><circle cx="${x}" cy="${y}" r="9" fill="url(#gkBall)"/><circle cx="${x}" cy="${y}" r="3.4" fill="#d9dde6"/><circle cx="${x}" cy="${y}" r="1.4" fill="#7a808c"/>`).join('')
          + `<ellipse cx="200" cy="944" rx="4" ry="6" fill="${wh}"/>` + `<path d="${ART.star(172, 892, 5, 2)}" fill="${wh}"/>`) }; } },
    { id: 'shoe_gladiator', cat: 'shoes', slot: 'shoes', name: 'Römersandalen', autoBox: 1, colors: ['#c9965f', '#e6be6a', '#2a2230', '#ffffff', '#ff8fc4'],
      art: c => { let s = `<path d="M162,940 C172,950 190,950 198,940 L198,947 C190,957 170,957 162,947 Z" fill="${sh(c, -20)}"/>`;
        [930, 914, 898, 878, 858, 838, 818].forEach((y, i) => { const xl = K.BL(Math.min(y, 900)) - 1.5, xr = K.IL(Math.min(y, 900)) + 1.5; s += line(`M${f(y > 904 ? 166 : xl)},${y} Q180,${y + 3} ${f(y > 904 ? 194 : xr)},${y}`, c, 3.6) + line(`M${f(y > 904 ? 166 : xl)},${y - 1} Q180,${y + 2} ${f(y > 904 ? 194 : xr)},${y - 1}`, '#fff', .9, .35); });
        s += line('M180,818 L180,930', c, 3) + [858, 898].map(y => `<circle cx="180" cy="${y + 2}" r="3.4" fill="none" stroke="url(#gkMetal)" stroke-width="2"/>`).join('');
        return { body: mir(s) }; } },
    { id: 'shoe_crystal', cat: 'shoes', slot: 'shoes', name: 'Glasschuhe', autoBox: 1, colors: ['#bfe8ff', '#ffd6ec', '#e3d6ff'],
      art: c => ({ body: mir(`<path d="M166,906 C170,903 190,903 194,906 C196,922 192,940 182,958 L178,958 C168,940 164,922 166,906 Z" fill="${c}" opacity=".55"/><path d="M166,906 C170,903 190,903 194,906 C196,922 192,940 182,958 L178,958 C168,940 164,922 166,906 Z" fill="url(#gkGlass)"/>`
        + `<path d="M166,906 C170,903 190,903 194,906 C196,922 192,940 182,958 L178,958 C168,940 164,922 166,906 Z" fill="none" stroke="#fff" stroke-width="1.6" opacity=".9"/><path d="M188,940 L194,964 L190,964 L184,944" fill="#fff" opacity=".6"/>`
        + `<path d="M170,912 L172,936" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".85"/>` + `<path d="${ART.spark4(186, 914, 4)}" fill="#fff"/><path d="${ART.spark4(176, 944, 3)}" fill="#fff"/>` + gem(180, 906, 3.2, '#ffffff')) }) },
    { id: 'shoe_bunny', cat: 'shoes', slot: 'shoes', name: 'Hasen-Pantoffeln', autoBox: 1, colors: ['#ffffff', '#ffc2d9', '#d9c6ff', '#fff0a8'],
      art: c => ({ body: mir(`<g transform="rotate(-14 172 902)"><ellipse cx="172" cy="884" rx="6" ry="20" fill="${c}"/><ellipse cx="172" cy="886" rx="3" ry="14" fill="#ffb3cf"/></g><g transform="rotate(12 188 902)"><ellipse cx="188" cy="884" rx="6" ry="20" fill="${c}"/><ellipse cx="188" cy="886" rx="3" ry="14" fill="#ffb3cf"/></g>`
        + cloth('M160,912 C160,898 200,898 200,912 C202,930 200,946 192,952 C184,956 176,956 168,952 C160,946 158,930 160,912 Z', c, { pat: PAT.boucle(c), edgeOp: .4 })
        + `<circle cx="173" cy="918" r="2.4" fill="#2a2230"/><circle cx="187" cy="918" r="2.4" fill="#2a2230"/><circle cx="173.8" cy="917.2" r=".8" fill="#fff"/><circle cx="187.8" cy="917.2" r=".8" fill="#fff"/><ellipse cx="180" cy="924" rx="2.4" ry="1.8" fill="#ff8fb4"/><ellipse cx="168" cy="926" rx="3.4" ry="2" fill="#ffb3cf" opacity=".7"/><ellipse cx="192" cy="926" rx="3.4" ry="2" fill="#ffb3cf" opacity=".7"/><path d="M177,928 Q180,931 183,928" stroke="#2a2230" stroke-width="1" fill="none"/>`
        + `<path d="M158,946 Q180,962 202,946 L202,950 Q180,966 158,950 Z" fill="${sh(c, -20)}"/>`) }) },
  ];
  void shaft;
  [...OUTER, ...SHOES].forEach(t => { t.fresh = 1; });
  WEAR.add([...OUTER, ...SHOES]);
})();
