'use strict';
/* =========================================================
   WEAR — bags, jewellery, headwear, glasses, legwear
   ========================================================= */
(() => {
  const K = CK, { sh, cloth, st, fold, shine, button, cr, line, mir, PAT, rivet, gem, bow, lacing, ruffle, scallops } = K, f = K.f;
  const chain = (d, c = 'url(#gkMetal)', w = 2.6) => `<path d="${d}" stroke="#8a6420" stroke-width="${w + 1}" fill="none" opacity=".5"/><path d="${d}" stroke="${c}" stroke-width="${w}" fill="none" stroke-dasharray="3.4 1.4" stroke-linecap="round"/>`;
  const metal = c => (U.luma(c) > .78 ? 'url(#gkSilver)' : 'url(#gkMetal)');
  const pearl = (x, y, r, c = '#fffaf0') => `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="${c}"/><circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="url(#gkBall)"/>`;

  /* ---------------- bags ---------------- */
  const BAGS = [
    { id: 'bag_quilt', cat: 'bag', slot: 'bag', name: 'Kettentasche', autoBox: 1, colors: ['#2a2230', '#ff8fc4', '#ffffff', '#c8102e', '#c9a7ff'],
      art: c => ({ body: chain('M226,360 C244,420 262,500 260,556') + chain('M234,358 C262,420 292,500 300,556')
        + cloth('M252,556 L308,556 Q312,556 312,560 L312,600 Q312,606 306,606 L254,606 Q248,606 248,600 L248,560 Q248,556 252,556 Z', c, { pat: PAT.quilt(c), sheen: 'leather', edgeOp: .7 })
        + cloth('M248,560 Q248,556 252,556 L308,556 Q312,556 312,560 L312,580 Q280,590 248,580 Z', sh(c, -6), { pat: PAT.quilt(c), sheen: 'leather', vert: false, edgeOp: .7 })
        + `<path d="${ART.heart(280, 584, 7)}" fill="url(#gkMetal)" stroke="#8a6420" stroke-width=".8"/>` + st('M251,559 L309,559', sh(c, 30), .4, .8) }) },
    { id: 'bag_bamboo', cat: 'bag', slot: 'bag', name: 'Henkeltasche', autoBox: 1, colors: ['#ff8fc4', '#c8965f', '#2a2230', '#7de3c5', '#ffffff', '#ffd84d'],
      art: c => ({ body: `<path d="M262,620 C262,586 292,586 292,620" stroke="#a8743a" stroke-width="5.4" fill="none"/><path d="M262,620 C262,586 292,586 292,620" stroke="#e6b46a" stroke-width="3" fill="none" stroke-dasharray="6 2"/>`
        + cloth('M248,620 L306,620 C312,640 314,660 310,672 L244,672 C240,660 242,640 248,620 Z', c, { sheen: 'leather', edgeOp: .7 }) + cloth('M246,620 L308,620 L304,644 Q277,652 250,644 Z', sh(c, -8), { sheen: 'leather', vert: false, edgeOp: .7 })
        + st('M250,624 L304,624 L301,641 Q277,648 253,641 Z', sh(c, 35), .5, .9) + `<rect x="270" y="640" width="14" height="10" rx="2" fill="url(#gkMetal)" stroke="#8a6420" stroke-width=".8"/>` + rivet(250, 622, 1.8) + rivet(304, 622, 1.8) }) },
    { id: 'bag_straw', cat: 'bag', slot: 'bag', name: 'Erdbeer-Tasche', autoBox: 1, colors: ['#e8344e', '#ff8fc4', '#ffd84d'],
      art: c => ({ body: chain('M262,604 C266,588 288,588 292,604', 'url(#gkMetal)', 2)
        + cloth('M277,604 C300,604 312,620 306,646 C300,666 286,676 277,678 C268,676 254,666 248,646 C242,620 254,604 277,604 Z', c, { pat: PAT.strawb(), edgeOp: .6 })
        + `<path d="M260,608 Q266,598 272,606 Q277,596 282,606 Q288,598 294,608 Q284,616 277,612 Q270,616 260,608 Z" fill="#4fae5e"/><path d="M277,606 L277,596" stroke="#3a8a4a" stroke-width="2.6" stroke-linecap="round"/>`
        + `<ellipse cx="264" cy="630" rx="4" ry="9" fill="#fff" opacity=".4" transform="rotate(20 264 630)"/>` }) },
    { id: 'bag_belt', cat: 'bag', slot: 'bag', name: 'Gürteltasche', autoBox: 1, colors: ['#2a2230', '#ff8fc4', '#c9a7ff', '#7de3c5', '#e6be6a'],
      art: c => ({ body: cloth('M234,364 L244,372 L166,508 L156,500 Z', sh(c, -12), { vert: false, ew: .8 }) + st('M237,368 L159,503 M242,372 L163,507', sh(c, 25), .5, .8)
        + cloth('M164,446 Q164,436 176,434 L218,428 Q230,428 232,438 L236,466 Q238,478 226,480 L182,486 Q170,488 168,476 Z', c, { sheen: 'satin', edgeOp: .7 })
        + line('M170,446 L230,438', '#555', 2.4, .5) + Array.from({ length: 18 }, (_, i) => `<rect x="${f(171 + i * 3.3)}" y="${f(444.6 - i * .44)}" width="1.6" height="3" fill="#d9dde6"/>`).join('')
        + `<rect x="224" y="436" width="5" height="6" rx="1" fill="url(#gkSilver)"/><path d="M226.5,442 L228,452" stroke="#c8ccd6" stroke-width="2.4" stroke-linecap="round"/>` + `<path d="${ART.star(196, 464, 7, 3)}" fill="#fff" opacity=".9"/>` }) },
    { id: 'bag_basket', cat: 'bag', slot: 'bag', name: 'Picknickkorb', autoBox: 1, colors: ['#e8344e', '#5aa9ff', '#ff8fc4', '#55c97a'],
      art: c => { const straw = '#e2bc7a', gp = PAT.gingham(c);
        return { body: `<path d="M252,624 C252,580 302,580 302,624" stroke="#b88a4a" stroke-width="6" fill="none"/><path d="M252,624 C252,580 302,580 302,624" stroke="${straw}" stroke-width="3" fill="none" stroke-dasharray="4 2"/>`
          + cloth('M256,620 C260,610 294,610 298,620 L292,632 L262,632 Z', '#fff', { pat: gp, vert: false, ew: .8 }) + ruffle([[298, 622], [277, 616], [256, 622]], 6, '#fff', { n: 5, pat: gp })
          + cloth('M244,626 L310,626 L302,672 Q277,680 252,672 Z', straw, { pat: 'url(#pWeave)', edgeOp: .6 }) + [636, 648, 660].map(y => st(`M${246 + (y - 626) * .17},${y} L${308 - (y - 626) * .17},${y}`, '#a0702e', .7, 1.4, '3 1.5')).join('')
          + cloth('M242,624 L312,624 L311,632 L243,632 Z', '#c89a5a', { vert: false, ew: .8 }) + `<g transform="translate(296 616)">${[0, 72, 144, 216, 288].map(a => `<ellipse cx="0" cy="-4" rx="2.6" ry="3.6" fill="#fff" transform="rotate(${a})"/>`).join('')}<circle r="2.2" fill="#ffd84d"/></g>` }; } },
  ];

  /* ---------------- jewellery ---------------- */
  const JEWEL = [
    { id: 'neck_locket', cat: 'jewel', slot: 'necklace', name: 'Medaillon', autoBox: 1, colors: ['#f2c14e', '#d9dde6', '#f4b6c2'],
      art: c => ({ body: chain('M180,356 Q200,402 220,356', metal(c), 1.6) + `<circle cx="200" cy="392" r="3" fill="none" stroke="${metal(c)}" stroke-width="1.6"/>`
        + `<path d="${ART.heart(200, 406, 11)}" fill="${metal(c)}" stroke="${U.luma(c) > .78 ? '#8a90a0' : '#8a6420'}" stroke-width="1"/><path d="${ART.heart(200, 406, 7.6)}" fill="none" stroke="#fff" stroke-width=".9" opacity=".7" stroke-dasharray="1.4 1"/>` + gem(200, 405, 3.2, '#ff4f9a') }) },
    { id: 'neck_layer', cat: 'jewel', slot: 'necklace', name: 'Layer-Ketten', autoBox: 1, colors: ['#f2c14e', '#d9dde6'],
      art: c => ({ body: chain('M184,352 Q200,372 216,352', metal(c), 1.3) + chain('M180,356 Q200,392 220,356', metal(c), 1.3) + chain('M177,360 Q200,418 223,360', metal(c), 1.3)
        + `<circle cx="200" cy="368" r="2.4" fill="#fff"/><path d="M196,382 a6,6 0 1 0 8,8 a5,5 0 1 1 -8,-8 Z" fill="${metal(c)}"/><path d="${ART.star(200, 396, 3, 1.2)}" fill="#fff"/>`
        + `<circle cx="200" cy="414" r="6.4" fill="${metal(c)}" stroke="#8a6420" stroke-width=".8"/><circle cx="200" cy="414" r="4.4" fill="none" stroke="#fff" stroke-width=".7" opacity=".7"/><path d="${ART.star(200, 414, 3, 1.3)}" fill="#fff" opacity=".9"/>` }) },
    { id: 'neck_butterfly', cat: 'jewel', slot: 'necklace', name: 'Schmetterling', autoBox: 1, colors: ['#8fd0ff', '#ff8fc4', '#c9a7ff', '#7de3c5'],
      art: c => ({ body: chain('M180,356 Q200,396 220,356', 'url(#gkSilver)', 1.4)
        + `<g transform="translate(200 396)"><path d="M0,0 C-6,-12 -18,-12 -16,-2 C-15,4 -6,4 0,0 Z M0,0 C6,-12 18,-12 16,-2 C15,4 6,4 0,0 Z" fill="${c}" stroke="#fff" stroke-width="1"/><path d="M0,1 C-5,8 -12,12 -11,6 C-10,3 -4,2 0,1 Z M0,1 C5,8 12,12 11,6 C10,3 4,2 0,1 Z" fill="${sh(c, -18)}" stroke="#fff" stroke-width="1"/>`
        + `<circle cx="-9" cy="-5" r="2" fill="#fff" opacity=".8"/><circle cx="9" cy="-5" r="2" fill="#fff" opacity=".8"/><ellipse cx="0" cy="1" rx="1.6" ry="6" fill="url(#gkSilver)"/></g>` }) },
    { id: 'neck_rainbow', cat: 'jewel', slot: 'necklace', name: 'Bonbon-Kette', autoBox: 1, colors: ['#ff8fc4', '#8fd0ff', '#ffd84d'],
      art: c => { const cols = ['#ff6b6b', '#ffa94d', '#ffd84d', '#6fd08c', '#5aa9ff', '#b48ce8', c]; let s = '';
        for (let i = 0; i < 17; i++) { const t = i / 16, x = (1 - t) * (1 - t) * 179 + 2 * (1 - t) * t * 200 + t * t * 221, y = (1 - t) * (1 - t) * 356 + 2 * (1 - t) * t * 400 + t * t * 356; s += pearl(x, y, i === 8 ? 5 : 3.6, cols[i % cols.length]); }
        return { body: s }; } },
    { id: 'ear_pearl', box: '90 230 36 40', cat: 'jewel', slot: 'ear', name: 'Perlen-Ohrringe', autoBox: 1, colors: ['#fffaf0', '#ffd9e6', '#e8e0ff'],
      art: c => ({ body: mir(bow(108, 242, .2, '#f2c14e') + `<path d="M108,245 L108,252" stroke="url(#gkMetal)" stroke-width="1.4"/>` + pearl(108, 258, 6, c)) }) },
    { id: 'ear_cherry', box: '88 230 38 46', cat: 'jewel', slot: 'ear', name: 'Kirschen', autoBox: 1, colors: ['#e8344e', '#ff8fc4'],
      art: c => ({ body: mir(`<path d="M108,240 C106,248 102,254 100,260 M108,240 C110,248 114,254 116,262" stroke="#4f8a3c" stroke-width="1.6" fill="none"/><ellipse cx="111" cy="240" rx="4" ry="2" fill="#5fae6e" transform="rotate(-20 111 240)"/>`
        + [[100, 263], [116, 265]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5.4" fill="${c}"/><circle cx="${x}" cy="${y}" r="5.4" fill="url(#gkBall)"/>`).join('')) }) },
    { id: 'ear_tassel', box: '90 234 36 50', cat: 'jewel', slot: 'ear', name: 'Quasten', autoBox: 1, colors: ['#ff4f9a', '#5aa9ff', '#ffd84d', '#7de3c5', '#2a2230'],
      art: c => ({ body: mir(`<circle cx="108" cy="242" r="3" fill="url(#gkMetal)"/><path d="M108,245 L108,250" stroke="url(#gkMetal)" stroke-width="1.4"/><rect x="104.5" y="250" width="7" height="5" rx="1.5" fill="url(#gkMetal)"/>`
        + Array.from({ length: 9 }, (_, i) => `<path d="M${105 + i * .75},255 Q${104 + i * .9},266 ${102.5 + i * 1.4},${278 + (i % 3)}" stroke="${i % 2 ? c : sh(c, -18)}" stroke-width="1.5" fill="none" stroke-linecap="round"/>`).join('')) }) },
    { id: 'ear_moon', box: '90 236 36 38', cat: 'jewel', slot: 'ear', name: 'Mond & Stern', autoBox: 1, colors: ['#f2c14e', '#d9dde6'],
      art: c => ({ body: `<circle cx="108" cy="242" r="2.6" fill="${metal(c)}"/><path d="M108,244 L108,250" stroke="${metal(c)}" stroke-width="1.2"/><path d="M104,252 a9,9 0 1 0 10,14 a7,7 0 1 1 -10,-14 Z" fill="${metal(c)}" stroke="#8a6420" stroke-width=".6"/>`
        + `<circle cx="292" cy="242" r="2.6" fill="${metal(c)}"/><path d="M292,244 L292,250" stroke="${metal(c)}" stroke-width="1.2"/><path d="${ART.star(292, 259, 8, 3.4)}" fill="${metal(c)}" stroke="#8a6420" stroke-width=".6"/>${gem(292, 259, 2, '#8fd0ff')}` }) },
  ];

  /* ---------------- headwear ---------------- */
  const HEAD = [
    { id: 'head_beret', cat: 'head', slot: 'head', name: 'Barett', autoBox: 1, colors: ['#c8102e', '#2a2230', '#ff8fc4', '#e8d3b5', '#2f3f73', '#c9a7ff'],
      art: c => ({ body: `<g transform="rotate(-12 210 90)">` + cloth('M116,100 C110,64 160,38 214,40 C270,42 310,66 300,98 C292,116 250,118 210,116 C168,114 122,118 116,100 Z', c, { pat: PAT.boucle(c), patOp: .5, edgeOp: .5 })
        + fold('M140,96 C170,82 240,80 284,92', c, 3, .3) + shine('M150,64 C180,48 230,46 262,56', 6, .25) + `<path d="M210,42 L212,30" stroke="${sh(c, -20)}" stroke-width="5" stroke-linecap="round"/>`
        + cloth('M126,104 C160,118 260,118 292,102 L292,112 C260,128 160,128 126,114 Z', sh(c, -14), { vert: false, ew: .8 }) + `</g>` }) },
    { id: 'head_cowboy', cat: 'head', slot: 'head', name: 'Cowboyhut', autoBox: 1, colors: ['#c89a5a', '#ff8fc4', '#ffffff', '#2a2230', '#c9a7ff'],
      art: c => ({ body: cloth('M36,104 C40,124 90,136 200,136 C310,136 360,124 364,104 C350,96 330,102 300,108 C260,116 140,116 100,108 C70,102 50,96 36,104 Z', c, { sheen: 'leather', edgeOp: .6 })
        + cloth('M128,108 C124,70 140,34 168,30 C182,28 192,40 200,40 C208,40 218,28 232,30 C260,34 276,70 272,108 C240,118 160,118 128,108 Z', c, { edgeOp: .6 }) + fold('M200,42 C198,60 200,80 200,104', c, 3, .35)
        + cloth('M130,94 C170,104 230,104 270,94 L272,108 C230,118 170,118 128,108 Z', sh(c, -40), { vert: false, ew: .8 }) + `<path d="${ART.star(200, 104, 8, 3.4)}" fill="url(#gkSilver)" stroke="#8a90a0" stroke-width=".8"/>`
        + st('M60,112 C100,124 300,124 340,112', sh(c, 30), .6, 1) + shine('M146,92 C142,70 150,46 166,38', 5, .3) }) },
    { id: 'head_bigbow', cat: 'head', slot: 'head', name: 'Riesenschleife', autoBox: 1, colors: ['#ff4f9a', '#ffffff', '#2a2230', '#c8102e', '#8fd0ff', '#c9a7ff'],
      art: c => ({ body: bow(200, 72, 2.1, c) + `<g transform="translate(200 72) scale(2.1)"><path d="M-17,-6 C-13,-10 -8,-9 -5,-5" stroke="#fff" stroke-width="1.2" fill="none" opacity=".6"/></g>` }) },
    { id: 'head_crown', cat: 'head', slot: 'head', name: 'Krone', autoBox: 1, colors: ['#f2c14e', '#d9dde6', '#f4b6c2'],
      art: c => { const m = metal(c), dk = U.luma(c) > .78 ? '#8a90a0' : '#8a6420';
        return { body: `<path d="M150,96 C148,70 150,56 156,52 C170,62 178,60 184,44 C190,56 196,58 200,36 C204,58 210,56 216,44 C222,60 230,62 244,52 C250,56 252,70 250,96 Z" fill="#8b1e5a"/>`
          + `<path d="M140,104 L144,60 L164,80 L182,46 L200,74 L218,46 L236,80 L256,60 L260,104 Q200,92 140,104 Z" fill="${m}" stroke="${dk}" stroke-width="1.4" stroke-linejoin="round"/>`
          + `<path d="M140,104 Q200,92 260,104 L261,116 Q200,104 139,116 Z" fill="${m}" stroke="${dk}" stroke-width="1.2"/>` + [150, 170, 190, 210, 230, 250].map((x, i) => pearl(x, 110 - Math.sin((x - 140) / 120 * Math.PI) * 4, 2.6)).join('')
          + gem(200, 86, 7, '#e8344e') + gem(168, 90, 5, '#2b4fd8') + gem(232, 90, 5, '#2b4fd8') + [[144, 60], [182, 46], [218, 46], [256, 60], [200, 74]].map(([x, y]) => pearl(x, y - 3, 3.4)).join('') }; } },
    { id: 'head_cat', cat: 'head', slot: 'head', name: 'Katzenohren', autoBox: 1, colors: ['#2a2230', '#ffffff', '#ff8fc4', '#c9965f', '#c9a7ff'],
      art: c => ({ body: line('M104,190 C100,112 150,74 200,74 C250,74 300,112 296,190', sh(c, -10), 7) + mir(`<path d="M118,112 L124,46 L170,84 Z" fill="${c}" stroke="${sh(c, -30)}" stroke-width="1.4" stroke-linejoin="round"/><path d="M128,104 L131,64 L160,88 Z" fill="#ffb3cf"/>`
        + `<path d="M118,112 L124,46 L170,84 Z" fill="url(#pSeq)" opacity=".2"/>` + Array.from({ length: 5 }, (_, i) => `<path d="M${130 + i * 4},${88 - i * 2} l-2,-8" stroke="#fff" stroke-width="1" opacity=".55"/>`).join('')) }) },
    { id: 'head_bucket', cat: 'head', slot: 'head', name: 'Fischerhut', autoBox: 1, colors: ['#ffd84d', '#ff8fc4', '#7de3c5', '#ffffff', '#2a2230'],
      art: c => { const fp = PAT.floral(U.luma(c) > .8 ? '#ffffff' : '#ff6fa5', c);
        return { body: cloth('M84,126 C100,104 130,98 200,98 C270,98 300,104 316,126 C300,144 260,150 200,150 C140,150 100,144 84,126 Z', c, { pat: fp, edgeOp: .55 })
          + [116, 124, 132].map((y, i) => st(`M${92 + i * 4},${y + 4} C130,${y + 18} 270,${y + 18} ${308 - i * 4},${y + 4}`, sh(c, -35), .6, .9)).join('')
          + cloth('M128,110 C124,60 160,40 200,40 C240,40 276,60 272,110 C240,118 160,118 128,110 Z', c, { pat: fp, edgeOp: .55 }) + st('M132,100 C170,108 230,108 268,100', sh(c, -35), .6, .9) + shine('M150,90 C148,70 160,52 180,46', 5, .25) }; } },
    { id: 'head_clips', box: '100 104 66 64', cat: 'head', slot: 'head', name: 'Haarspangen', autoBox: 1, colors: ['#fffaf0', '#ff8fc4', '#f2c14e', '#8fd0ff'],
      art: c => ({ body: [[114, 156, -62], [124, 134, -52], [138, 116, -42]].map(([x, y, a], i) => `<g transform="translate(${x} ${y}) rotate(${a}) scale(1.35)"><rect x="-12" y="-3.4" width="24" height="6.8" rx="3.4" fill="url(#gkMetal)"/>${[-8, -2.6, 2.6, 8].map(dx => i % 2 ? `<path d="${ART.star(dx, 0, 3.4, 1.4)}" fill="${c}"/>` : pearl(dx, 0, 2.6, c)).join('')}</g>`).join('')
        + `<g transform="translate(274 130) rotate(40)">${bow(0, 0, .5, c === '#fffaf0' ? '#ff8fc4' : c)}</g>` }) },
  ];

  /* ---------------- glasses ---------------- */
  const GLASSES = [
    { id: 'gl_aviator', cat: 'glasses', slot: 'glasses', name: 'Pilotenbrille', autoBox: 1, colors: ['#f2c14e', '#d9dde6', '#2a2230'],
      art: c => { const m = c === '#2a2230' ? '#2a2230' : metal(c);
        return { body: mir(`<path d="M130,204 C130,196 140,194 160,194 C180,194 190,198 189,208 C188,226 178,242 160,242 C142,242 130,226 130,210 Z" fill="url(#lensDark)" opacity=".85" stroke="${m}" stroke-width="2.4"/>`
          + `<path d="M138,206 L152,200" stroke="#fff" stroke-width="3" opacity=".5" stroke-linecap="round"/><path d="M140,232 C150,238 168,238 176,230" stroke="#ff9ad0" stroke-width="2" opacity=".35" fill="none"/><path d="M130,202 L114,198" stroke="${m}" stroke-width="2.6"/>`)
          + line('M189,204 Q200,198 211,204 M186,196 Q200,190 214,196', m, 2.2) }; } },
    { id: 'gl_retro', cat: 'glasses', slot: 'glasses', name: 'Retro-Brille', autoBox: 1, colors: ['#2a2230', '#c8102e', '#7a4f33', '#ff8fc4'],
      art: c => ({ body: mir(`<path d="M132,210 C132,228 144,238 160,238 C176,238 188,228 188,210 Z" fill="#fff" fill-opacity=".12" stroke="url(#gkMetal)" stroke-width="1.6"/><path d="M130,198 C140,192 180,192 190,198 L190,212 L130,212 Z" fill="${c}" stroke="${sh(c, -30)}" stroke-width="1"/><path d="M136,200 L150,198" stroke="#fff" stroke-width="1.6" opacity=".5" stroke-linecap="round"/><path d="M130,202 L114,198" stroke="${c}" stroke-width="3"/>`)
        + line('M190,206 Q200,200 210,206', 'url(#gkMetal)', 2) }) },
    { id: 'gl_butterfly', cat: 'glasses', slot: 'glasses', name: 'Schmetterlingsbrille', autoBox: 1, colors: ['#ff8fc4', '#c9a7ff', '#8fd0ff', '#ffd84d'],
      art: c => ({ body: mir(`<path d="M186,212 C186,196 170,184 150,186 C126,188 120,204 128,220 C134,232 148,238 160,236 C176,234 186,226 186,212 Z" fill="${c}" fill-opacity=".38" stroke="${sh(c, -20)}" stroke-width="3" stroke-linejoin="round"/>`
        + `<path d="M186,212 C186,196 170,184 150,186 C126,188 120,204 128,220" fill="none" stroke="url(#pSeq)" stroke-width="3"/>` + gem(132, 194, 3, '#ffffff') + gem(140, 188, 2.2, '#ffffff') + `<path d="M126,204 L112,198" stroke="${sh(c, -20)}" stroke-width="3"/><ellipse cx="148" cy="200" rx="6" ry="3" fill="#fff" opacity=".5"/>`)
        + line('M186,208 Q200,200 214,208', sh(c, -20), 3) }) },
  ];

  /* ---------------- legwear (new category) ---------------- */
  const FOOTD = 'C166,916 164,929 168,939 C173,947 185,947 191,940 C196,930 194,918 191,904';
  const legPath = (y0, ex = 1.2, yEnd = 904, foot = true) => { const o = [], i = [];
    for (let y = y0; y <= Math.min(yEnd, 900); y += 16) o.push([K.BL(y) - ex, y]);
    for (let y = Math.min(yEnd, 900); y >= y0; y -= 16) i.push([K.IL(y) + ex, y]);
    if (foot) return `M${K.pt([K.BL(y0) - ex, y0])}${K.crSeg(o)} L169,904 ${FOOTD} L${K.pt([K.IL(900) + ex, 900])}${K.crSeg(i)} Z`;
    return `M${K.pt(o[0])}${K.crSeg(o)} L${K.pt(i[0])}${K.crSeg(i)} Z`; };
  const tights = (c, o = {}) => { const d = legPath(o.y0 || 596, 1); return `<path d="${d}" fill="${c}" opacity="${o.op ?? 1}"/>` + (o.pat ? `<path d="${d}" fill="${o.pat}" opacity="${o.patOp ?? 1}"/>` : '') + `<path d="${d}" fill="url(#limbShade)"/>`
    + shine(cr([[160, 620], [164, 690], [170, 770], [172, 860]]), 5, o.gloss ?? .25) + `<ellipse cx="179" cy="772" rx="8" ry="5" fill="#fff" opacity="${(o.gloss ?? .25) * .8}"/>` + `<path d="${d}" fill="none" stroke="${sh(c, -35)}" stroke-width=".9" opacity="${o.edge ?? .4}"/>`; };
  const LEGS = [
    { id: 'leg_knee', cat: 'legwear', slot: 'legwear', name: 'Kniestrümpfe', autoBox: 1, colors: ['#ffffff', '#2a2230', '#ff8fc4', '#2f3f73', '#fff0a8'],
      art: c => { const acc = c === '#ffffff' ? '#ff8fc4' : '#ffffff';
        return { body: mir(tights(c, { y0: 770, gloss: .2, pat: PAT.rib(c), patOp: .6 }) + cloth(`M${K.BL(770) - 1.6},770 L${K.IL(770) + 1.6},770 L${K.IL(786) + 1.6},786 L${K.BL(786) - 1.6},786 Z`, sh(c, -6), { pat: PAT.rib(c), vert: false, ew: .8 })
          + line(`M${K.BL(776) - 1.6},776 L${K.IL(776) + 1.6},776`, acc, 2) + bow(K.BL(780) + 2, 780, .32, acc)) }; } },
    { id: 'leg_fishnet', cat: 'legwear', slot: 'legwear', name: 'Netzstrumpfhose', autoBox: 1, colors: ['#2a2230', '#ff4f9a', '#ffffff', '#8b5cf6'],
      art: c => ({ body: mir(`<path d="${legPath(596, .6)}" fill="${PAT.net(c, 8)}"/><path d="${legPath(596, .6)}" fill="none" stroke="${c}" stroke-width="1.4" opacity=".8"/>`) }) },
    { id: 'leg_stripe', cat: 'legwear', slot: 'legwear', name: 'Ringel-Overknees', autoBox: 1, colors: ['#ff8fc4', '#2a2230', '#8b5cf6', '#e8344e', '#5aa9ff'],
      art: c => ({ body: mir(tights('#ffffff', { y0: 690, pat: PAT.breton('#fff', c), gloss: .2 }) + cloth(`M${K.BL(690) - 1.6},690 L${K.IL(690) + 1.6},690 L${K.IL(702) + 1.6},702 L${K.BL(702) - 1.6},702 Z`, c, { vert: false, ew: .8 })) }) },
    { id: 'leg_frill', cat: 'legwear', slot: 'legwear', name: 'Rüschensöckchen', autoBox: 1, colors: ['#ffffff', '#ffc2d9', '#d9c6ff', '#fff0a8'],
      art: c => ({ body: mir(tights(c, { y0: 880, gloss: .1 }) + ruffle([[K.IL(880) + 3, 880], [180, 882], [K.BL(880) - 3, 880]], 7, c, { n: 6, flip: true }) + `<circle cx="174" cy="886" r="1.4" fill="#ff8fc4"/><circle cx="186" cy="886" r="1.4" fill="#ff8fc4"/>`) }) },
    { id: 'leg_tights', cat: 'legwear', slot: 'legwear', name: 'Strumpfhose', autoBox: 1, colors: ['#2a2230', '#c8102e', '#2f3f73', '#ff8fc4', '#7a4f33', '#8b5cf6'],
      art: c => ({ body: mir(tights(c, { gloss: .3 })) }) },
    { id: 'leg_hearts', cat: 'legwear', slot: 'legwear', name: 'Herzchen-Strümpfe', autoBox: 1, colors: ['#2a2230', '#ff4f9a', '#ffffff'],
      art: c => ({ body: mir(tights(c, { op: .45, pat: PAT.hearts(c, c === '#ffffff' ? '#ff4f9a' : c), patOp: 1, gloss: .2, edge: .3 })) }) },
    { id: 'leg_warmers', cat: 'legwear', slot: 'legwear', name: 'Stulpen', autoBox: 1, colors: ['#ff8fc4', '#ffffff', '#c9a7ff', '#7de3c5', '#b3adbd'],
      art: c => { const d = legPath(780, 5, 900, false);
        return { body: mir(cloth(d, c, { pat: PAT.cable(c), edgeOp: .5 }) + [790, 900].map(y => cloth(`M${K.BL(y - 8) - 6},${y - 8} L${K.IL(y - 8) + 6},${y - 8} L${K.IL(y) + 6},${y} L${K.BL(y) - 6},${y} Z`, sh(c, -8), { pat: PAT.rib(c), vert: false, ew: .8 })).join('')
          + fold(`M${K.BL(830) - 4},830 Q180,836 ${K.IL(830) + 4},830`, c, 2.6, .35) + fold(`M${K.BL(860) - 4},860 Q180,866 ${K.IL(860) + 4},860`, c, 2.6, .35)) }; } },
  ];

  [...JEWEL, ...HEAD].forEach(t => { if (t.box) t.autoBox = 0; });
  const ALL = [...BAGS, ...JEWEL, ...HEAD, ...GLASSES, ...LEGS];
  ALL.forEach(t => { t.fresh = 1; });
  WEAR.add(ALL);
  if (!DATA.CATS.find(c => c.id === 'legwear')) DATA.CATS.splice(DATA.CATS.findIndex(c => c.id === 'shoes'), 0, { id: 'legwear', name: 'Strümpfe', e: '🧦' });
})();
