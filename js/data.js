'use strict';
/* =========================================================
   DATA — palettes, tools, themes and all wardrobe items
   ========================================================= */
const DATA = (() => {
  const sh = (c, p) => U.shade(c, p);
  const { fab, ln, slv, mirror: mir } = ART;
  const pat = (d, id, op = 1) => `<path d="${d}" fill="url(#${id})" opacity="${op}"/>`;
  const T = (party, beach, casual, gala, winter) => ({ party, beach, casual, gala, winter });
  const contrast = c => (U.luma(c) > .72 ? '#ff4f9a' : '#ffffff');
  const C = {
    white: '#ffffff', cream: '#fff6e8', rose: '#ffc2d9', pink: '#ff8fc4', hot: '#ff4f9a', red: '#e8344e', coral: '#ff7f6b',
    orange: '#ffa94d', yellow: '#ffd84d', mint: '#7de3c5', green: '#55c97a', sky: '#8fd0ff', blue: '#4f8dff', navy: '#2f3f73',
    lilac: '#c9a7ff', purple: '#8b5cf6', black: '#2a2230', grey: '#b3adbd', beige: '#e8d3b5', camel: '#c9965f', brown: '#7a4f33',
    gold: '#f2c14e', silver: '#d9dde6', denim: '#5b86c5', denimL: '#9cbbe6', nude: '#e8c3a5', straw: '#ecd29c', pearl: '#fffaf0',
  };

  /* ---------- palettes ---------- */
  const SKIN = ['#ffe3cc', '#f8d1b0', '#eab98e', '#d39b6a', '#a8703f', '#7a4a2a', '#5a3420'];
  const EYES = ['#7a4a2a', '#a8742e', '#4f8a3c', '#3a86c8', '#7a8ea0', '#8b5cf6', '#ff6fa5', '#2a1a1a'];
  const HAIR_COLORS = ['#1d1517', '#3b2420', '#5c3a24', '#8a4b2a', '#b5562a', '#d08a3a', '#e6be6a', '#f3e2b5', '#c9c3bd', '#ff8cc6', '#b48ce8', '#6aa8ff', '#5fd6bd', '#e0384f'];
  const STREAKS = ['#f7e3a1', '#ffffff', '#ff8cc6', '#b48ce8', '#6aa8ff', '#5fd6bd', '#ffb35c', '#e0384f'];
  const SHADOWS = ['#ffb3c8', '#f08bb4', '#c9a7ff', '#9a7ad8', '#8fd0ff', '#7de3c5', '#ffd36b', '#e8b38a', '#b7a49a', '#5b4a6e'];
  const LINERS = ['#1a1016', '#5a3420', '#2c3e75', '#6b3fa0', '#1f8a8a', '#d4a23a'];
  const MASCARAS = ['#1a1016', '#4a2c1e', '#2c4fa0', '#6b3fa0'];
  const BLUSHES = ['#ff9fb2', '#ff8a80', '#f7a8c4', '#e8838f', '#ffb38a', '#d9869c'];
  const LIPS = ['#ff6f91', '#e0245e', '#c2185b', '#ff8a65', '#d84315', '#b5838d', '#9c27b0', '#8b1e3f', '#ffb3c1', '#e53935'];
  const HILITES = ['#fff4d6', '#ffe1f0', '#f7d58a', '#e0f0ff'];

  /* ---------- zones in character space ---------- */
  const ZONES = {
    hair: { shape: 'ell', cx: 200, cy: 150, rx: 132, ry: 122, aim: [{ x: 200, y: 108 }] },
    face: { shape: 'ell', cx: 200, cy: 222, rx: 92, ry: 102, aim: [{ x: 168, y: 240 }, { x: 232, y: 240 }] },
    eyes: { shape: 'circ', pts: [{ x: 161, y: 212, r: 38 }, { x: 239, y: 212, r: 38 }], aim: [{ x: 161, y: 204 }, { x: 239, y: 204 }] },
    cheeks: { shape: 'circ', pts: [{ x: 148, y: 262, r: 34 }, { x: 252, y: 262, r: 34 }], aim: [{ x: 148, y: 258 }, { x: 252, y: 258 }] },
    lips: { shape: 'circ', pts: [{ x: 200, y: 290, r: 32 }], aim: [{ x: 200, y: 288 }] },
  };

  /* ---------- tools ---------- */
  const SALON_CARE = [
    { id: 'shampoo', name: 'Shampoo', icon: 'shampoo', kind: 'rub', zone: 'hair', need: 1100, fx: 'bubble', sfx: 'bubble', hint: 'Reibe das Shampoo in die Haare!', msg: 'Schön schaumig! 🫧', apply: (p, L) => { L.foam = p; } },
    { id: 'rinse', name: 'Ausspülen', icon: 'shower', kind: 'rub', zone: 'hair', need: 1100, fx: 'drop', sfx: 'water', hint: 'Spüle den ganzen Schaum aus!', msg: 'Blitzsauber! 💦', apply: (p, L) => { L.foam = 1 - p; L.wet = Math.max(L.wet, Math.min(1, p * 3)); } },
    { id: 'dry', name: 'Föhnen', icon: 'dryer', kind: 'rub', zone: 'hair', need: 1200, fx: 'wind', sfx: 'wind', hint: 'Föhne die Haare schön trocken!', msg: 'Trocken & fluffig! 💨', apply: (p, L) => { L.wet = 1 - p; } },
    { id: 'comb', name: 'Kämmen', icon: 'comb', kind: 'rub', zone: 'hair', need: 1000, fx: 'spark', sfx: 'tick', hint: 'Kämme alle Knoten raus!', msg: 'Seidig glänzend! ✨', apply: (p, L) => { L.messy = 1 - p; L.shine = p; } },
  ];
  const SALON_STYLE = [
    { id: 'style', name: 'Frisur', icon: 'scissors', kind: 'styles', zone: 'hair' },
    { id: 'color', name: 'Haarfarbe', icon: 'dye', kind: 'palette', key: 'hairColor', palette: HAIR_COLORS, zone: 'hair', msg: 'Neue Haarfarbe! 🎨' },
    { id: 'streak', name: 'Strähnchen', icon: 'brush', kind: 'palette', key: 'streak', palette: STREAKS, none: true, zone: 'hair', msg: 'Coole Strähnchen! 🌈' },
    { id: 'curler', name: 'Lockenstab', icon: 'curler', kind: 'rub', zone: 'hair', need: 650, fx: 'steam', sfx: 'sizzle', repeat: true, hint: 'Wickle die Haare um den Lockenstab!', apply: () => {},
      done: L => { const n = ART.HAIR[L.hair].curl; if (n) { L.hair = n; return 'Traumlocken! 🌀'; } return 'Diese Frisur hält ihre Form 😉'; } },
    { id: 'straight', name: 'Glätteisen', icon: 'straightener', kind: 'rub', zone: 'hair', need: 650, fx: 'steam', sfx: 'sizzle', repeat: true, hint: 'Ziehe das Glätteisen durch die Haare!', apply: () => {},
      done: L => { const n = ART.HAIR[L.hair].straight; if (n) { L.hair = n; return 'Glatt & glänzend! ✨'; } return 'Schon perfekt glatt! 💁‍♀️'; } },
    { id: 'glitter', name: 'Glitzer', icon: 'spray', kind: 'rub', zone: 'hair', need: 520, fx: 'glitter', sfx: 'spray', repeat: true, hint: 'Sprühe Glitzer auf die Haare!', apply: () => {},
      done: L => { L.glitter = true; return 'Funkel-Alarm! ✨'; } },
  ];
  const FACE_CARE = [
    { id: 'mask', name: 'Maske', icon: 'mask', kind: 'rub', zone: 'face', need: 1150, fx: 'green', sfx: 'squish', hint: 'Verteile die Gesichtsmaske!', msg: 'Wellness-Zeit! 🥒', apply: (p, L) => { L.maskOn = p; }, done: L => { L.cucumbers = true; } },
    { id: 'wash', name: 'Abwaschen', icon: 'sponge', kind: 'rub', zone: 'face', need: 1150, fx: 'bubble', sfx: 'water', hint: 'Wasche die Maske sanft ab!', msg: 'Strahlende Haut! ✨', start: L => { L.cucumbers = false; }, apply: (p, L) => { L.maskOn = 1 - p; L.pimples = Math.min(L.pimples, 1 - p); } },
  ];
  const MAKEUP = [
    { id: 'foundation', name: 'Teint', icon: 'foundation', kind: 'palette', zone: 'face', key: 'skin', palette: SKIN, msg: 'Makelloser Teint! 🌸' },
    { id: 'lens', name: 'Linsen', icon: 'lens', kind: 'palette', zone: 'eyes', key: 'eye', palette: EYES, msg: 'Was für Augen! 👀' },
    { id: 'shadow', name: 'Lidschatten', icon: 'palette', kind: 'palette', zone: 'eyes', key: 'mk.shadow', palette: SHADOWS, none: true, msg: 'Traumhafter Lidschatten! 🎨' },
    { id: 'liner', name: 'Eyeliner', icon: 'liner', kind: 'palette', zone: 'eyes', key: 'mk.liner', palette: LINERS, none: true, msg: 'Perfekter Lidstrich! ✏️' },
    { id: 'mascara', name: 'Mascara', icon: 'mascara', kind: 'palette', zone: 'eyes', key: 'mk.mascara', palette: MASCARAS, none: true, msg: 'Endlos lange Wimpern! 🦋' },
    { id: 'blush', name: 'Rouge', icon: 'blushbrush', kind: 'palette', zone: 'cheeks', key: 'mk.blush', palette: BLUSHES, none: true, msg: 'Süßes Rouge! 🌸' },
    { id: 'lips', name: 'Lippen', icon: 'lipstick', kind: 'palette', zone: 'lips', key: 'mk.lips', palette: LIPS, none: true, msg: 'Kussmund! 💋' },
    { id: 'hilite', name: 'Glow', icon: 'hilite', kind: 'palette', zone: 'cheeks', key: 'mk.hilite', palette: HILITES, none: true, msg: 'Strahlender Glow! ✨' },
    { id: 'freckles', name: 'Sommersprossen', icon: 'freckles', kind: 'palette', zone: 'cheeks', key: 'mk.freckles', palette: ['#a0663f', '#7a4a2e', '#d08a5a'], none: true, msg: 'Süße Sommersprossen! 🌞' },
    { id: 'sticker', name: 'Sticker', icon: 'sticker', kind: 'variants', zone: 'cheeks', key: 'mk.sticker', none: true, msg: 'Glitzer-Sticker! 💖',
      variants: [{ v: 'heart', e: '💖', n: 'Herz' }, { v: 'star', e: '⭐', n: 'Stern' }, { v: 'gems', e: '💎', n: 'Steinchen' }, { v: 'moon', e: '🌙', n: 'Mond' }] },
  ];

  /* ---------- themes ---------- */
  const THEMES = [
    { id: 'party', name: 'Party-Nacht', e: '🎉', level: 1, desc: 'Glitzer, Minikleider & High Heels', grad: 'linear-gradient(150deg,#ff6fb5,#9b5de5)', photo: ['#3a1760', '#c2307a'], mk: ['sticker', 'liner', 'shadow'] },
    { id: 'beach', name: 'Strandtag', e: '🏖️', level: 1, desc: 'Luftig, bunt & sonnig', grad: 'linear-gradient(150deg,#4fd1e8,#ffb35c)', photo: ['#8fd0ff', '#ffe0a8'], mk: ['freckles', 'blush', 'lips'] },
    { id: 'casual', name: 'Stadtbummel', e: '🛍️', level: 1, desc: 'Lässig, cool & bequem', grad: 'linear-gradient(150deg,#7de3c5,#4f8dff)', photo: ['#c9f0ff', '#e7d9ff'], mk: ['mascara', 'blush', 'freckles'] },
    { id: 'gala', name: 'Gala-Abend', e: '👑', level: 2, desc: 'Ballkleider, Schmuck & Eleganz', grad: 'linear-gradient(150deg,#f2c14e,#c2307a)', photo: ['#2b1046', '#8a5a00'], mk: ['lips', 'hilite', 'liner'] },
    { id: 'winter', name: 'Winterzauber', e: '❄️', level: 3, desc: 'Kuschelig, warm & glitzernd', grad: 'linear-gradient(150deg,#9fd8ff,#8b5cf6)', photo: ['#dff1ff', '#b8a2ff'], mk: ['hilite', 'shadow', 'blush'] },
  ];

  /* ---------- clothing paths ---------- */
  const P = {
    tank: 'M176,358 L186,358 Q200,392 214,358 L224,358 C230,380 246,396 250,414 C246,452 238,492 237,526 L163,526 C162,492 154,452 150,414 C154,396 170,380 176,358 Z',
    tee: 'M172,358 Q200,374 228,358 C240,362 250,366 254,376 C258,392 254,416 250,436 C244,466 237,494 236,526 L164,526 C163,494 156,466 150,436 C146,416 142,392 146,376 C150,366 160,362 172,358 Z',
    crop: 'M168,360 Q200,380 232,360 C242,368 250,380 250,400 C248,430 244,450 242,470 L158,470 C156,450 152,430 150,400 C150,380 158,368 168,360 Z',
    blouse: 'M168,360 L176,388 L224,388 L232,360 C242,364 250,368 254,378 C258,394 254,418 250,438 C244,468 237,496 236,528 L164,528 C163,496 156,468 150,438 C146,418 142,394 146,378 C150,368 158,364 168,360 Z',
    sweater: 'M172,360 Q200,372 228,360 C242,364 252,368 256,380 C262,396 256,420 252,440 C246,470 240,500 240,528 C246,552 254,572 256,592 L144,592 C146,572 154,552 160,528 C160,500 154,470 148,440 C144,420 138,396 144,380 C148,368 158,364 172,360 Z',
    turtle: 'M180,328 L220,328 L222,366 Q200,374 178,366 Z',
    hood: 'M150,374 C138,344 162,322 200,322 C238,322 262,344 250,374 C240,364 222,358 200,358 C178,358 160,364 150,374 Z',
    cami: 'M156,396 Q200,412 244,396 C252,412 250,430 248,442 C244,470 237,498 236,526 L164,526 C163,498 156,470 152,442 C150,430 148,412 156,396 Z',
    shirtV: 'M172,358 L200,410 L228,358 C240,362 250,366 254,376 C258,392 254,416 250,436 C244,466 237,494 236,530 L164,530 C163,494 156,466 150,436 C146,416 142,392 146,376 C150,366 160,362 172,358 Z',
    shorts: 'M162,516 L238,516 C246,544 252,570 254,598 L256,648 L207,652 L200,612 L193,652 L144,648 L146,598 C148,570 154,544 162,516 Z',
    jeans: 'M162,516 L238,516 C246,544 252,570 252,600 C250,700 240,800 235,906 L209,906 C207,800 205,700 201,618 L199,618 C195,700 193,800 191,906 L165,906 C160,800 150,700 148,600 C148,570 154,544 162,516 Z',
    leggings: 'M162,516 L238,516 C246,544 252,570 251,600 C248,700 238,800 232,906 L210,906 C208,800 205,700 201,616 L199,616 C195,700 192,800 190,906 L168,906 C162,800 152,700 149,600 C148,570 154,544 162,516 Z',
    mini: 'M164,516 L236,516 C250,556 268,606 280,656 C240,670 160,670 120,656 C132,606 150,556 164,516 Z',
    tutuIn: 'M164,516 L236,516 C258,560 288,630 300,724 Q200,742 100,724 C112,630 142,560 164,516 Z',
    tutuOut: 'M164,516 L236,516 C262,560 296,640 310,744 Q292,758 274,746 Q256,762 236,750 Q218,766 200,752 Q182,766 164,750 Q144,762 126,746 Q108,758 90,744 C104,640 138,560 164,516 Z',
    maxi: 'M164,516 L236,516 C254,600 272,760 288,910 Q244,924 200,918 Q156,924 112,910 C128,760 146,600 164,516 Z',
    waist: 'M162,516 L238,516 L240,530 L160,530 Z',
    sun: 'M158,396 Q200,412 242,396 C250,420 245,470 236,516 C256,580 282,660 296,742 Q200,764 104,742 C118,660 144,580 164,516 C155,470 150,420 158,396 Z',
    gala: 'M152,404 C164,392 184,396 200,410 C216,396 236,392 248,404 C250,440 242,480 236,512 C268,600 318,760 342,930 Q302,950 262,936 Q232,952 200,940 Q168,952 138,936 Q98,950 58,930 C82,760 132,600 164,512 C158,480 150,440 152,404 Z',
    party: 'M152,404 L230,360 C246,366 252,384 248,410 C244,450 236,490 236,516 C244,560 256,610 262,660 Q200,672 138,660 C144,610 156,560 164,516 C164,490 156,450 152,420 Z',
    swim: 'M156,398 Q200,412 244,398 C252,420 246,470 238,520 C242,550 252,575 254,600 C236,602 214,614 204,640 L196,640 C186,614 164,602 146,600 C148,575 158,550 162,520 C154,470 148,420 156,398 Z',
    knit: 'M172,360 Q200,372 228,360 C242,364 252,368 256,380 C262,396 256,420 252,440 C246,470 240,500 240,528 C248,580 256,640 262,690 L138,690 C144,640 152,580 160,528 C160,500 154,470 148,440 C144,420 138,396 144,380 C148,368 158,364 172,360 Z',
    leatherL: 'M146,374 C138,392 146,416 150,436 C156,466 159,500 159,542 L190,542 L188,452 L176,398 L176,360 C162,362 152,366 146,374 Z',
    lapelL: 'M176,360 L162,372 L172,410 L188,452 L176,398 Z',
    coatL: 'M146,374 C138,392 146,416 150,436 C156,470 158,520 152,600 C146,660 140,710 136,764 L198,764 L198,420 L182,362 C166,362 154,366 146,374 Z',
    denimL: 'M146,374 C138,392 146,416 150,436 C156,466 159,500 160,532 L196,532 L196,420 L180,362 C164,362 152,366 146,374 Z',
    stole: 'M138,380 C150,404 176,414 200,414 C224,414 250,404 262,380 C272,404 280,440 286,480 C258,460 232,450 200,450 C168,450 142,460 114,480 C120,440 128,404 138,380 Z',
    sneaker: 'M164,900 L194,900 C198,914 200,928 197,942 C188,950 168,950 162,942 C158,928 160,912 164,900 Z',
    sneakSole: 'M160,936 C170,946 190,946 198,936 L198,945 C190,954 168,954 160,945 Z',
    ballet: 'M165,916 L195,916 C197,926 197,936 193,942 C186,950 172,950 166,943 C162,936 163,926 165,916 Z',
    heel: 'M166,906 C170,903 190,903 194,906 C196,922 192,940 182,958 L178,958 C168,940 164,922 166,906 Z',
    boot: 'M164,770 L196,770 C196,830 193,876 194,904 C198,920 200,934 197,946 C188,954 168,954 162,946 C158,930 162,900 164,870 C164,830 163,800 164,770 Z',
    sandal: 'M162,940 C172,950 190,950 198,940 L198,947 C190,957 170,957 162,947 Z',
    clutch: 'M258,598 L302,598 Q308,598 308,604 L308,626 Q308,632 302,632 L258,632 Q252,632 252,626 L252,604 Q252,598 258,598 Z',
    tote: 'M250,610 L306,610 L314,684 L242,684 Z',
    cross: 'M246,556 L294,556 Q300,556 300,562 L300,592 Q300,598 294,598 L246,598 Q240,598 240,592 L240,562 Q240,556 246,556 Z',
    heartBag: 'M282,618 C274,604 254,608 258,626 C262,640 282,652 282,652 C282,652 302,640 306,626 C310,608 290,604 282,618 Z',
  };
  const longSleeves = (c, w = 38, knit = false) => slv(ART.LONG_L, c, w) + slv(ART.LONG_R, c, w)
    + (knit ? `<path d="${ART.LONG_L}" stroke="url(#pKnit)" stroke-width="${w}" fill="none"/><path d="${ART.LONG_R}" stroke="url(#pKnit)" stroke-width="${w}" fill="none"/>` : '')
    + ln('M125.6,566 L125,582', sh(c, -15), w + 2, 1, 'butt') + ln('M274.4,566 L275,582', sh(c, -15), w + 2, 1, 'butt');
  const hemBand = (c, y = 576) => `<path d="M144,${y} L256,${y} L256,${y + 16} L144,${y + 16} Z" fill="${sh(c, -14)}"/>` + ln(Array.from({ length: 18 }, (_, i) => `M${147 + i * 6},${y + 2} L${147 + i * 6},${y + 15}`).join(' '), sh(c, -28), 1.4, .55);
  const fur = (pts, r = 11) => `<g fill="#fffaf2">${pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')}</g><g fill="#e9e1d6" opacity=".7">${pts.map(([x, y]) => `<circle cx="${x + 3}" cy="${y + 4}" r="${r * .45}"/>`).join('')}</g>`;
  const flower = (x, y, r, c) => `<g>${[0, 72, 144, 216, 288].map(a => { const t = a * Math.PI / 180; return `<circle cx="${(x + Math.cos(t) * r).toFixed(1)}" cy="${(y + Math.sin(t) * r).toFixed(1)}" r="${r * .85}" fill="${c}"/>`; }).join('')}<circle cx="${x}" cy="${y}" r="${r * .6}" fill="#ffd54a"/></g>`;

  /* ---------- items ---------- */
  const ITEMS = [
    /* --- tops --- */
    { id: 'top_tank', cat: 'top', slot: 'top', name: 'Tanktop', price: 0, box: '112 340 176 200', colors: [C.white, C.rose, C.sky, C.mint, C.yellow, C.lilac, C.black], tags: T(1, 2, 2, 0, 0),
      art: c => ({ body: fab(P.tank, c) + ln('M186,358 Q200,392 214,358', sh(c, -20), 2.4) + ln('M164,520 L236,520', sh(c, -12), 3, .5) }) },
    { id: 'top_tee', cat: 'top', slot: 'top', name: 'T-Shirt', price: 0, box: '106 340 188 200', colors: [C.white, C.pink, C.sky, C.yellow, C.lilac, C.black], tags: T(0, 2, 3, 0, 1),
      art: c => ({ sleeves: slv(ART.SHORT_L, c, 36) + slv(ART.SHORT_R, c, 36) + ln('M117,447 L149,456', sh(c, -15), 2.5) + ln('M283,447 L251,456', sh(c, -15), 2.5),
        body: fab(P.tee, c) + ln('M172,358 Q200,374 228,358', sh(c, -22), 3) + `<path d="${ART.star(200, 438, 15, 6.5)}" fill="${contrast(c)}" opacity=".92"/>` }) },
    { id: 'top_crop', cat: 'top', slot: 'top', name: 'Crop-Top', price: 60, box: '112 340 176 150', colors: [C.hot, C.white, C.mint, C.yellow, C.lilac, C.black], tags: T(2, 3, 2, 0, 0),
      art: c => ({ body: fab(P.crop, c) + ln('M159,466 L241,466', sh(c, -18), 5, 1, 'butt') + ln('M168,360 Q200,380 232,360', sh(c, -20), 2.5) + `<path d="${ART.heart(200, 420, 10)}" fill="${contrast(c)}" opacity=".88"/>` }) },
    { id: 'top_blouse', cat: 'top', slot: 'top', name: 'Rüschenbluse', price: 90, box: '106 340 188 200', colors: [C.white, C.rose, C.sky, C.beige, C.lilac], tags: T(1, 1, 3, 2, 1),
      art: c => { const rf = U.luma(c) > .85 ? sh(c, -14) : sh(c, 35); return {
        sleeves: mir(`<ellipse cx="146" cy="402" rx="21" ry="25" transform="rotate(18 146 402)" fill="${c}"/><ellipse cx="146" cy="402" rx="21" ry="25" transform="rotate(18 146 402)" fill="url(#fabShade)"/>` + ln('M128,418 L156,430', rf, 5)),
        body: fab(P.blouse, c) + `<path d="M174,386 ${'q4,8 8,0 '.repeat(7)}" fill="none" stroke="${rf}" stroke-width="3.5" stroke-linecap="round"/>` + [404, 428, 452, 476, 500].map(y => `<circle cx="200" cy="${y}" r="2.8" fill="${sh(c, -28)}"/>`).join('') }; } },
    { id: 'top_sweater', cat: 'top', slot: 'top', name: 'Strickpulli', price: 120, box: '102 320 196 280', colors: [C.rose, C.beige, C.white, C.sky, C.red, C.navy], tags: T(0, 0, 2, 0, 3),
      art: c => ({ sleeves: longSleeves(c, 38, true),
        body: fab(P.turtle, c) + ln('M186,334 L186,364 M194,334 L194,368 M206,334 L206,368 M214,334 L214,364', sh(c, -15), 1.6, .6) + fab(P.sweater, c) + pat(P.sweater, 'pKnit') + hemBand(c) }) },
    { id: 'top_hoodie', cat: 'top', slot: 'top', name: 'Hoodie', price: 80, box: '102 318 196 282', colors: [C.lilac, C.pink, C.grey, C.mint, C.black], tags: T(0, 0, 3, 0, 2),
      art: c => ({ sleeves: longSleeves(c, 38),
        body: fab(P.hood, sh(c, -12)) + fab(P.sweater, c) + hemBand(c) + `<path d="M166,520 L234,520 L244,566 L156,566 Z" fill="${sh(c, -8)}"/>` + ln('M166,520 L234,520 L244,566 L156,566 Z', sh(c, -22), 1.6, .6)
          + ln('M188,368 L185,414', '#fff', 2.4) + ln('M212,368 L215,414', '#fff', 2.4) + `<rect x="182.5" y="412" width="5" height="8" rx="2" fill="${sh(c, -30)}"/><rect x="212.5" y="412" width="5" height="8" rx="2" fill="${sh(c, -30)}"/>` }) },
    { id: 'top_sequin', cat: 'top', slot: 'top', name: 'Paillettentop', price: 150, box: '112 350 176 190', colors: [C.gold, C.silver, C.hot, C.purple, C.black], tags: T(3, 0, 1, 2, 1),
      art: c => ({ body: fab(P.cami, c) + pat(P.cami, 'pSeq') + pat(P.cami, 'pSpark', .7) + ln('M164,398 L178,357', sh(c, -15), 3.5) + ln('M236,398 L222,357', sh(c, -15), 3.5) + ln('M156,396 Q200,412 244,396', '#fff', 2, .6) }) },
    { id: 'top_hawaii', cat: 'top', slot: 'top', name: 'Hawaii-Hemd', price: 70, box: '106 340 188 200', colors: [C.coral, C.sky, C.mint, C.yellow], tags: T(1, 3, 2, 0, 0),
      art: c => ({ sleeves: slv(ART.SHORT_L, c, 36) + slv(ART.SHORT_R, c, 36) + `<path d="${ART.SHORT_L}" stroke="url(#pHibis)" stroke-width="36" fill="none"/><path d="${ART.SHORT_R}" stroke="url(#pHibis)" stroke-width="36" fill="none"/>`,
        body: fab(P.shirtV, c) + pat(P.shirtV, 'pHibis') + `<path d="M172,358 L192,398 L180,404 L160,368 Z" fill="${sh(c, 18)}"/><path d="M228,358 L208,398 L220,404 L240,368 Z" fill="${sh(c, 18)}"/>` + ln('M200,410 L200,530', sh(c, -25), 1.6) + [436, 462, 488, 514].map(y => `<circle cx="204" cy="${y}" r="2.6" fill="#fff"/>`).join('') }) },

    /* --- bottoms --- */
    { id: 'bot_shorts', cat: 'bottom', slot: 'bottom', name: 'Shorts', price: 0, box: '128 506 144 152', colors: [C.rose, C.white, C.sky, C.mint, C.yellow], tags: T(1, 2, 2, 0, 0),
      art: c => ({ body: fab(P.shorts, c) + `<path d="${P.waist}" fill="${sh(c, -10)}"/>` + ln('M200,530 L200,612', sh(c, -22), 1.5, .6) + ln('M145,640 L193,644', sh(c, -12), 5) + ln('M207,644 L255,640', sh(c, -12), 5) }) },
    { id: 'bot_jeans', cat: 'bottom', slot: 'bottom', name: 'Skinny Jeans', price: 0, box: '128 506 144 408', colors: [C.denim, '#3d5a8a', C.black, C.white, C.pink], tags: T(1, 0, 3, 0, 2),
      art: c => ({ body: fab(P.jeans, c) + pat(P.jeans, 'pDenim') + `<path d="${P.waist}" fill="${sh(c, -10)}"/>` + ln('M168,536 Q182,556 194,536', sh(c, -28), 1.6) + ln('M232,536 Q218,556 206,536', sh(c, -28), 1.6) + ln('M200,530 L200,584', sh(c, -28), 1.6)
        + `<path d="M176,620 C176,720 177,820 178,902 M224,620 C224,720 223,820 222,902" stroke="${sh(c, 30)}" stroke-width="1.2" fill="none" stroke-dasharray="4 3" opacity=".7"/><circle cx="200" cy="523" r="3" fill="#e6be6a"/>` }) },
    { id: 'bot_mini', cat: 'bottom', slot: 'bottom', name: 'Faltenrock', price: 50, box: '108 506 184 170', colors: [C.pink, C.black, C.navy, C.red, C.lilac, C.white], tags: T(2, 1, 2, 1, 0),
      art: c => ({ body: fab(P.mini, c) + ln('M176,530 L150,662 M188,530 L176,666 M200,530 L200,668 M212,530 L224,666 M224,530 L250,662', sh(c, -25), 1.8, .5) + `<path d="M164,516 L236,516 L238,530 L162,530 Z" fill="${sh(c, -12)}"/>` }) },
    { id: 'bot_tutu', cat: 'bottom', slot: 'bottom', name: 'Tüllrock', price: 140, box: '82 506 236 266', colors: [C.pink, C.lilac, C.sky, C.white, C.black], tags: T(3, 0, 1, 2, 1),
      art: c => ({ body: `<path d="${P.tutuIn}" fill="${sh(c, -6)}"/><path d="${P.tutuIn}" fill="url(#fabShade)"/><path d="${P.tutuOut}" fill="${sh(c, 30)}" opacity=".72"/>` + pat(P.tutuOut, 'pSpark', .95) + ln('M180,530 C170,600 150,680 130,742 M200,530 L200,750 M220,530 C230,600 250,680 270,742', '#fff', 2, .35) + `<path d="M164,512 L236,512 L237,530 L163,530 Z" fill="${sh(c, -15)}"/>` }) },
    { id: 'bot_maxi', cat: 'bottom', slot: 'bottom', name: 'Maxirock', price: 90, box: '104 506 192 420', colors: [C.white, C.coral, C.mint, C.lilac, C.yellow], tags: T(1, 2, 2, 1, 0),
      art: c => ({ body: fab(P.maxi, c) + pat(P.maxi, 'pFlow', .55) + ln('M182,530 C176,640 160,780 140,912 M200,530 L200,918 M218,530 C224,640 240,780 260,912', sh(c, -20), 2, .35) + `<path d="M164,516 L236,516 L238,532 L162,532 Z" fill="${sh(c, -12)}"/>` }) },
    { id: 'bot_leggings', cat: 'bottom', slot: 'bottom', name: 'Leggings', price: 40, box: '128 506 144 408', colors: [C.black, C.grey, C.navy, C.pink, C.purple], tags: T(0, 0, 2, 0, 3),
      art: c => ({ body: fab(P.leggings, c) + `<path d="${P.waist}" fill="${sh(c, -10)}"/>` + ln('M160,620 C162,720 168,820 172,900 M240,620 C238,720 232,820 228,900', '#fff', 2.5, .18) }) },
    { id: 'bot_denim', cat: 'bottom', slot: 'bottom', name: 'Jeansshorts', price: 60, box: '128 506 144 152', colors: [C.denim, C.denimL, C.white, C.black], tags: T(1, 3, 2, 0, 0),
      art: c => ({ body: fab(P.shorts, c) + pat(P.shorts, 'pDenim') + `<path d="${P.waist}" fill="${sh(c, -10)}"/>` + ln('M168,536 Q182,556 194,536 M232,536 Q218,556 206,536', sh(c, -28), 1.6)
        + ln(Array.from({ length: 10 }, (_, i) => `M${148 + i * 5},${646 + (i % 2)} L${149 + i * 5},${654}`).join(' ') + ' ' + Array.from({ length: 10 }, (_, i) => `M${208 + i * 5},${650 - (i % 2)} L${209 + i * 5},${657}`).join(' '), '#fff', 1.3, .75) }) },

    /* --- dresses --- */
    { id: 'dress_sun', cat: 'dress', slot: 'dress', name: 'Sommerkleid', price: 0, box: '94 352 212 420', colors: [C.pink, C.yellow, C.sky, C.mint, C.coral, C.white], tags: T(1, 3, 2, 0, 0),
      art: c => ({ body: fab(P.sun, c) + pat(P.sun, 'pFlow', .85) + ln('M166,398 L178,357', c, 5) + ln('M234,398 L222,357', c, 5) + `<path d="M163,506 L237,506 L238,522 L162,522 Z" fill="${sh(c, -22)}"/><path d="M218,514 L206,506 L206,522 Z M218,514 L230,506 L230,522 Z" fill="${sh(c, -30)}"/><circle cx="218" cy="514" r="3.5" fill="${sh(c, -35)}"/>` }) },
    { id: 'dress_party', cat: 'dress', slot: 'dress', name: 'Glitzerkleid', price: 180, box: '126 352 148 328', colors: [C.hot, C.purple, C.gold, C.silver, C.black, C.red], tags: T(3, 0, 0, 2, 1),
      art: c => ({ body: fab(P.party, c) + pat(P.party, 'pSeq') + pat(P.party, 'pSpark', .65) + ln('M140,654 Q200,668 260,654', '#fff', 2, .4) + `<g fill="${sh(c, 18)}">${[[236, 364], [244, 372], [248, 384]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6"/>`).join('')}</g>` }) },
    { id: 'dress_gala', cat: 'dress', slot: 'dress', name: 'Ballkleid', price: 250, box: '50 380 300 580', colors: ['#ffb8d6', C.lilac, '#9ec9ff', C.red, '#f5d58a', C.white], tags: T(1, 0, 0, 3, 1),
      art: c => ({ body: fab(P.gala, c) + ln('M180,522 C168,640 140,800 120,936 M200,522 L200,938 M220,522 C232,640 260,800 280,936 M168,522 C150,640 112,800 88,930 M232,522 C250,640 288,800 312,930', sh(c, -20), 3, .35)
        + ln('M214,532 C226,650 248,780 266,920', '#fff', 12, .16) + pat(P.gala, 'pSpark', .8) + `<path d="M163,502 L237,502 L237,518 L163,518 Z" fill="${C.gold}"/>` + [174, 188, 200, 212, 226].map(x => `<circle cx="${x}" cy="510" r="3" fill="${x === 200 ? '#ff4f9a' : '#fff'}"/>`).join('') }) },
    { id: 'dress_swim', cat: 'dress', slot: 'dress', name: 'Badeanzug', price: 60, box: '134 352 132 296', colors: [C.hot, C.sky, C.coral, C.yellow, C.black], tags: T(0, 3, 0, 0, 0),
      art: c => ({ body: fab(P.swim, c) + pat(P.swim, 'pStripe', .45) + ln('M164,400 L178,357', c, 5) + ln('M236,400 L222,357', c, 5) }) },
    { id: 'dress_knit', cat: 'dress', slot: 'dress', name: 'Strickkleid', price: 130, box: '100 320 200 380', colors: [C.beige, C.rose, C.white, C.grey, C.red], tags: T(0, 0, 2, 1, 3),
      art: c => ({ sleeves: longSleeves(c, 38, true),
        body: fab(P.turtle, c) + fab(P.knit, c) + pat(P.knit, 'pKnit') + `<path d="M160,520 L240,520 L240,532 L160,532 Z" fill="${sh(c, -35)}"/><rect x="192" y="518" width="16" height="16" rx="3" fill="none" stroke="${C.gold}" stroke-width="2.5"/>` + ln('M140,684 L260,684', sh(c, -15), 6, 1, 'butt') }) },

    /* --- outerwear --- */
    { id: 'outer_leather', cat: 'outer', slot: 'outer', name: 'Lederjacke', price: 120, box: '100 350 200 250', colors: [C.black, C.brown, C.hot, C.white], tags: T(2, 0, 2, 0, 1),
      art: c => ({ sleeves: longSleeves(c, 38) + ln('M139,500 L146,500 M261,500 L254,500', '#cfd6df', 2),
        body: mir(fab(P.leatherL, c) + `<path d="${P.lapelL}" fill="${sh(c, 14)}"/>` + ln('M189,456 L190,540', '#cfd6df', 2) + `<path d="M159,530 L190,530 L190,542 L159,542 Z" fill="${sh(c, -12)}"/>` + ln('M154,422 C158,450 160,490 162,526', '#fff', 4, .18)) }) },
    { id: 'outer_coat', cat: 'outer', slot: 'outer', name: 'Wintermantel', price: 160, box: '100 340 200 430', colors: [C.beige, C.rose, C.white, C.red, C.navy], tags: T(0, 0, 1, 1, 3),
      art: c => ({ sleeves: longSleeves(c, 40) + fur([[125, 578], [119, 572], [131, 572], [275, 578], [269, 572], [281, 572]], 8),
        body: mir(fab(P.coatL, c)) + `<path d="M154,516 L246,516 L246,532 L154,532 Z" fill="${sh(c, -18)}"/><rect x="190" y="512" width="20" height="24" rx="4" fill="none" stroke="${C.gold}" stroke-width="3"/>` + [446, 488, 560, 610].map(y => `<circle cx="212" cy="${y}" r="4" fill="${sh(c, -30)}"/>`).join('')
          + fur([[156, 374], [168, 386], [182, 394], [200, 398], [218, 394], [232, 386], [244, 374], [164, 364], [236, 364]], 12) }) },
    { id: 'outer_denim', cat: 'outer', slot: 'outer', name: 'Jeansjacke', price: 80, box: '100 350 200 230', colors: [C.denim, C.denimL, C.white, C.black], tags: T(1, 1, 3, 0, 1),
      art: c => ({ sleeves: longSleeves(c, 36) + `<path d="${ART.LONG_L}" stroke="url(#pDenim)" stroke-width="36" fill="none"/><path d="${ART.LONG_R}" stroke="url(#pDenim)" stroke-width="36" fill="none"/>`,
        body: mir(fab(P.denimL, c) + pat(P.denimL, 'pDenim') + `<path d="M162,420 L186,420 L186,444 L162,444 Z" fill="${sh(c, -8)}"/><path d="M161,414 L187,414 L187,424 L174,428 L161,424 Z" fill="${sh(c, -16)}"/><circle cx="174" cy="424" r="2.2" fill="${C.gold}"/><path d="M180,362 L162,372 L172,394 L188,382 Z" fill="${sh(c, -12)}"/>` + `<path d="M160,520 L196,520 L196,532 L160,532 Z" fill="${sh(c, -12)}"/>`) + [440, 470, 500].map(y => `<circle cx="206" cy="${y}" r="2.6" fill="${C.gold}"/>`).join('') }) },
    { id: 'outer_stole', cat: 'outer', slot: 'outer', name: 'Glitzer-Stola', price: 140, box: '104 370 192 124', colors: [C.white, C.pink, C.lilac, C.gold], tags: T(2, 0, 0, 3, 2),
      art: c => ({ body: `<path d="${P.stole}" fill="${c}" opacity=".8"/>` + pat(P.stole, 'pSeq') + pat(P.stole, 'pSpark') + ln('M114,480 C142,460 168,450 200,450 C232,450 258,460 286,480', sh(c, -15), 2.5, .6) }) },

    /* --- shoes --- */
    { id: 'shoe_sneaker', cat: 'shoes', slot: 'shoes', name: 'Sneaker', price: 0, box: '152 888 96 72', colors: [C.white, C.pink, C.black, C.sky], tags: T(0, 1, 3, 0, 1),
      art: c => { const acc = U.luma(c) > .8 ? C.hot : '#ffffff'; return { body: mir(fab(P.sneaker, c) + `<path d="${P.sneakSole}" fill="${acc}"/>` + `<path d="M164,930 C170,940 188,940 196,930 C196,936 196,940 194,942 C186,948 172,948 164,942 Z" fill="#fff" opacity=".45"/>` + ln('M170,912 L190,910 M169,920 L191,918', sh(c, -35), 2)) }; } },
    { id: 'shoe_ballet', cat: 'shoes', slot: 'shoes', name: 'Ballerinas', price: 0, box: '152 900 96 56', colors: [C.pink, C.red, C.black, C.white, C.gold], tags: T(1, 1, 2, 1, 0),
      art: c => ({ body: mir(fab(P.ballet, c) + `<path d="M173,914 L180,918 L173,922 Z M187,914 L180,918 L187,922 Z" fill="${sh(c, -25)}"/><circle cx="180" cy="918" r="2" fill="${sh(c, -35)}"/>`) }) },
    { id: 'shoe_heels', cat: 'shoes', slot: 'shoes', name: 'High Heels', price: 100, box: '152 888 96 76', colors: [C.red, C.black, C.pink, C.nude, C.white, C.purple], tags: T(3, 0, 1, 3, 0),
      art: c => ({ body: mir(ln('M168,898 L192,898', c, 3.5) + fab(P.heel, c) + `<ellipse cx="174" cy="920" rx="2.5" ry="8" fill="#fff" opacity=".45"/>`) }) },
    { id: 'shoe_glitter', cat: 'shoes', slot: 'shoes', name: 'Glitzer-Pumps', price: 160, box: '152 888 96 76', colors: [C.gold, C.silver, C.hot, C.purple], tags: T(3, 0, 0, 3, 1),
      art: c => ({ body: mir(ln('M168,898 L192,898', c, 3.5) + fab(P.heel, c) + pat(P.heel, 'pSeq') + pat(P.heel, 'pSpark')) }) },
    { id: 'shoe_boots', cat: 'shoes', slot: 'shoes', name: 'Fellstiefel', price: 120, box: '150 756 100 204', colors: [C.camel, C.beige, C.white, C.black, C.pink], tags: T(0, 0, 1, 0, 3),
      art: c => ({ body: mir(fab(P.boot, c) + `<path d="M162,944 C170,952 190,952 197,944 L197,950 C190,958 170,958 162,950 Z" fill="${sh(c, -35)}"/>` + fur([[164, 772], [172, 768], [180, 772], [188, 768], [196, 772]], 7)) }) },
    { id: 'shoe_sandals', cat: 'shoes', slot: 'shoes', name: 'Sandalen', price: 40, box: '152 894 96 66', colors: [C.camel, C.gold, C.white, C.pink], tags: T(0, 3, 1, 0, 0),
      art: c => ({ body: mir(`<path d="${P.sandal}" fill="${sh(c, -20)}"/>` + ln('M168,922 L192,922', c, 5) + ln('M171,934 L189,934', c, 4) + ln('M168,904 L192,904', c, 3) + flower(180, 922, 3, '#ff8fc4')) }) },

    /* --- bags --- */
    { id: 'bag_clutch', cat: 'bag', slot: 'bag', name: 'Clutch', price: 70, box: '244 588 72 52', colors: [C.gold, C.silver, C.hot, C.black, C.red], tags: T(3, 0, 1, 3, 1),
      art: c => ({ body: fab(P.clutch, c) + pat(P.clutch, 'pSpark', .8) + `<path d="M252,604 Q252,598 258,598 L302,598 Q308,598 308,604 L280,620 Z" fill="${sh(c, -12)}"/><circle cx="280" cy="619" r="3.5" fill="#fff"/>` }) },
    { id: 'bag_tote', cat: 'bag', slot: 'bag', name: 'Strandtasche', price: 50, box: '234 578 88 112', colors: [C.straw, '#f6e2b8'], tags: T(0, 3, 1, 0, 0),
      art: c => ({ body: ln('M262,612 C262,584 296,584 296,612', sh(c, -30), 4) + fab(P.tote, c) + pat(P.tote, 'pWeave') + `<path d="M247,632 L309,632 L310,644 L246,644 Z" fill="#ff6fa5"/>` + flower(296, 660, 5, '#fff') }) },
    { id: 'bag_cross', cat: 'bag', slot: 'bag', name: 'Umhängetasche', price: 0, box: '156 356 154 248', colors: [C.brown, C.black, C.pink, C.white], tags: T(1, 1, 3, 0, 2),
      art: c => ({ body: ln('M168,366 L262,560', sh(c, -25), 4) + fab(P.cross, c) + `<path d="M240,562 Q240,556 246,556 L294,556 Q300,556 300,562 L300,576 L240,576 Z" fill="${sh(c, -14)}"/><circle cx="270" cy="576" r="3.5" fill="${C.gold}"/>` }) },
    { id: 'bag_heart', cat: 'bag', slot: 'bag', name: 'Herz-Tasche', price: 90, box: '248 584 68 74', colors: [C.hot, C.red, C.white, C.lilac], tags: T(2, 1, 2, 1, 0),
      art: c => ({ body: `<path d="M266,612 Q277,586 298,612" stroke="${C.gold}" stroke-width="2" fill="none" stroke-dasharray="3 2"/>` + fab(P.heartBag, c) + `<ellipse cx="268" cy="618" rx="4" ry="2.5" fill="#fff" opacity=".6"/><circle cx="282" cy="624" r="2.6" fill="${C.gold}"/>` }) },

    /* --- jewellery --- */
    { id: 'neck_heart', cat: 'jewel', slot: 'necklace', name: 'Herzkette', price: 0, box: '166 334 68 66', colors: [C.gold, C.silver], tags: T(1, 1, 2, 1, 1),
      art: c => ({ body: ln('M180,356 Q200,394 220,356', c, 1.6) + `<path d="${ART.heart(200, 384, 8)}" fill="#ff4f8b" stroke="${c}" stroke-width="1.5"/>` }) },
    { id: 'neck_pearls', cat: 'jewel', slot: 'necklace', name: 'Perlenkette', price: 80, box: '166 334 68 66', colors: [C.pearl, '#ffd9e6', '#e8e0ff'], tags: T(1, 0, 1, 3, 1),
      art: c => ({ body: Array.from({ length: 15 }, (_, i) => { const t = i / 14, x = (1 - t) * (1 - t) * 178 + 2 * (1 - t) * t * 200 + t * t * 222, y = (1 - t) * (1 - t) * 358 + 2 * (1 - t) * t * 402 + t * t * 358; return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4.2" fill="${c}" stroke="${sh(c, -18)}" stroke-width=".8"/><circle cx="${(x - 1.3).toFixed(1)}" cy="${(y - 1.3).toFixed(1)}" r="1.3" fill="#fff"/>`; }).join('') }) },
    { id: 'neck_choker', cat: 'jewel', slot: 'necklace', name: 'Choker', price: 40, box: '174 326 52 30', colors: [C.black, C.red, C.purple, C.pink], tags: T(2, 0, 2, 0, 0),
      art: c => ({ body: `<path d="M182,334 Q200,340 218,334 L218,344 Q200,350 182,344 Z" fill="${c}"/><circle cx="200" cy="346" r="4" fill="#8fd0ff" stroke="#fff" stroke-width="1"/>` }) },
    { id: 'neck_collier', cat: 'jewel', slot: 'necklace', name: 'Collier', price: 200, box: '164 334 72 84', colors: [C.gold, C.silver], tags: T(2, 0, 0, 3, 1),
      art: c => ({ body: ln('M176,356 Q200,398 224,356', c, 3) + [[184, 372], [192, 380], [200, 384], [208, 380], [216, 372]].map(([x, y], i) => `<path d="M${x},${y} C${x - 4},${y + 6} ${x - 4},${y + 11} ${x},${y + 13} C${x + 4},${y + 11} ${x + 4},${y + 6} ${x},${y} Z" fill="${i === 2 ? '#ff4f9a' : '#8fd0ff'}" stroke="${c}" stroke-width="1.2"/>`).join('') }) },
    { id: 'ear_studs', cat: 'jewel', slot: 'ear', name: 'Ohrstecker', price: 0, box: '94 228 28 28', colors: ['#f5fbff', C.pink, C.sky, C.gold], tags: T(1, 1, 2, 1, 1),
      art: c => ({ body: mir(`<circle cx="108" cy="242" r="5" fill="${c}" stroke="${sh(c, -25)}" stroke-width="1"/><circle cx="106.5" cy="240.5" r="1.8" fill="#fff" opacity=".9"/>`) }) },
    { id: 'ear_hoops', cat: 'jewel', slot: 'ear', name: 'Creolen', price: 50, box: '90 236 36 36', colors: [C.gold, C.silver, C.pink], tags: T(2, 2, 2, 0, 0),
      art: c => ({ body: mir(`<circle cx="108" cy="254" r="13" fill="none" stroke="${c}" stroke-width="3.2"/>`) }) },
    { id: 'ear_drops', cat: 'jewel', slot: 'ear', name: 'Tropfen', price: 110, box: '96 234 24 44', colors: [C.sky, C.pink, C.purple, C.green], tags: T(2, 0, 0, 3, 1),
      art: c => ({ body: mir(`<circle cx="108" cy="241" r="3.5" fill="${C.gold}"/><path d="M108,244 L108,257" stroke="${C.gold}" stroke-width="1.6"/><path d="M108,256 C102,263 102,271 108,274 C114,271 114,263 108,256 Z" fill="${c}" stroke="#fff" stroke-width="1"/>`) }) },
    { id: 'ear_stars', cat: 'jewel', slot: 'ear', name: 'Sternchen', price: 60, box: '94 236 28 30', colors: [C.gold, C.silver, C.pink], tags: T(3, 1, 1, 0, 1),
      art: c => ({ body: mir(`<path d="${ART.star(108, 250, 8.5, 3.6)}" fill="${c}" stroke="${sh(c, -25)}" stroke-width="1"/>`) }) },

    /* --- headwear --- */
    { id: 'head_band', cat: 'head', slot: 'head', name: 'Haarreif', price: 0, box: '96 56 208 140', colors: [C.hot, C.red, C.black, C.white, C.lilac], tags: T(2, 1, 2, 1, 0),
      art: c => ({ body: ln('M104,190 C100,112 150,74 200,74 C250,74 300,112 296,190', c, 9) + ln('M106,170 C106,112 150,80 200,80', '#fff', 2.5, .35) + `<g transform="translate(250 90) rotate(25)"><path d="M0,0 C-10,-18 -30,-14 -26,0 C-30,14 -10,18 0,0 Z" fill="${c}"/><path d="M0,0 C10,-18 30,-14 26,0 C30,14 10,18 0,0 Z" fill="${c}"/><path d="M0,0 C-10,-18 -30,-14 -26,0 C-30,14 -10,18 0,0 Z" fill="url(#fabShade)"/><circle r="5.5" fill="${sh(c, -22)}"/></g>` }) },
    { id: 'head_cap', cat: 'head', slot: 'head', name: 'Cap', price: 40, box: '96 36 208 128', colors: [C.pink, C.white, C.black, C.sky], tags: T(0, 2, 3, 0, 0),
      art: c => ({ body: fab('M108,130 C104,70 148,40 200,40 C252,40 296,70 292,130 Z', c) + ln('M200,42 L200,128 M150,56 C160,80 166,104 168,128 M250,56 C240,80 234,104 232,128', sh(c, -18), 1.6, .5) + `<path d="M100,128 C150,112 250,112 300,128 C296,146 262,156 200,156 C138,156 104,146 100,128 Z" fill="${sh(c, -16)}"/><circle cx="200" cy="40" r="5" fill="${sh(c, -20)}"/>` }) },
    { id: 'head_sunhat', cat: 'head', slot: 'head', name: 'Sonnenhut', price: 70, box: '44 20 312 120', colors: [C.straw, C.white, C.rose], tags: T(0, 3, 1, 0, 0),
      art: c => ({ body: `<path d="M50,104 C50,82 120,72 200,72 C280,72 350,82 350,104 C350,124 280,134 200,134 C120,134 50,124 50,104 Z" fill="${c}"/><path d="M50,104 C50,82 120,72 200,72 C280,72 350,82 350,104 C350,124 280,134 200,134 C120,134 50,124 50,104 Z" fill="url(#pWeave)"/>` + fab('M132,98 C130,40 160,24 200,24 C240,24 270,40 268,98 Z', c) + pat('M132,98 C130,40 160,24 200,24 C240,24 270,40 268,98 Z', 'pWeave') + `<path d="M134,82 C170,90 230,90 266,82 L268,98 C230,106 170,106 132,98 Z" fill="#ff6fa5"/>` + flower(248, 92, 6, '#fff') }) },
    { id: 'head_beanie', cat: 'head', slot: 'head', name: 'Bommelmütze', price: 60, box: '92 -6 216 168', colors: [C.red, C.white, C.pink, C.grey, C.navy], tags: T(0, 0, 1, 0, 3),
      art: c => ({ body: fab('M100,142 C96,60 146,22 200,22 C254,22 304,60 300,142 Z', c) + pat('M100,142 C96,60 146,22 200,22 C254,22 304,60 300,142 Z', 'pKnit') + `<path d="M98,128 C150,114 250,114 302,128 L304,158 C250,144 150,144 96,158 Z" fill="${sh(c, -14)}"/>` + ln(Array.from({ length: 24 }, (_, i) => `M${104 + i * 8.4},${126 - Math.sin(i / 23 * Math.PI) * 10} L${104 + i * 8.4},${154 - Math.sin(i / 23 * Math.PI) * 10}`).join(' '), sh(c, -28), 1.6, .5) + fur([[200, 16], [188, 10], [212, 10], [194, 2], [206, 2], [200, 22]], 12) }) },
    { id: 'head_tiara', cat: 'head', slot: 'head', name: 'Tiara', price: 220, box: '138 48 124 64', colors: [C.gold, C.silver, '#f4b6c2'], tags: T(1, 0, 0, 3, 1),
      art: c => ({ body: `<path d="M146,100 L158,74 L172,90 L186,60 L200,84 L214,60 L228,90 L242,74 L254,100 Q200,86 146,100 Z" fill="${c}" stroke="${sh(c, -28)}" stroke-width="1.5"/><path d="M146,100 Q200,86 254,100 L254,106 Q200,92 146,106 Z" fill="${sh(c, -18)}"/><circle cx="200" cy="74" r="6" fill="#ff4f9a" stroke="#fff" stroke-width="1"/><circle cx="186" cy="70" r="3.5" fill="#8fd0ff"/><circle cx="214" cy="70" r="3.5" fill="#8fd0ff"/><circle cx="158" cy="84" r="3" fill="#c9a7ff"/><circle cx="242" cy="84" r="3" fill="#c9a7ff"/>` }) },
    { id: 'head_flowers', cat: 'head', slot: 'head', name: 'Blumenkranz', price: 90, box: '96 60 208 92', colors: [C.pink, C.white, C.yellow, C.lilac], tags: T(1, 3, 1, 1, 0),
      art: c => ({ body: `<g fill="#6cc887">${[[121, 124], [144, 96], [178, 80], [222, 80], [256, 96], [279, 124]].map(([x, y], i) => `<ellipse cx="${x}" cy="${y}" rx="9" ry="4" transform="rotate(${i * 30 - 70} ${x} ${y})"/>`).join('')}</g>` + [[112, 140], [130, 108], [158, 86], [200, 78], [242, 86], [270, 108], [288, 140]].map(([x, y], i) => flower(x, y, 7, i % 2 ? '#fff' : c)).join('') }) },

    /* --- glasses --- */
    { id: 'gl_round', cat: 'glasses', slot: 'glasses', name: 'Nerd-Brille', price: 0, box: '110 182 180 70', colors: [C.gold, C.black, C.silver], tags: T(0, 0, 3, 0, 1),
      art: c => ({ body: mir(`<circle cx="161" cy="216" r="27" fill="#fff" opacity=".12" stroke="${c}" stroke-width="3"/><path d="M134,210 L116,204" stroke="${c}" stroke-width="3"/><path d="M146,198 L154,192" stroke="#fff" stroke-width="3" opacity=".6" stroke-linecap="round"/>`) + ln('M188,212 Q200,204 212,212', c, 3) }) },
    { id: 'gl_sun', cat: 'glasses', slot: 'glasses', name: 'Sonnenbrille', price: 50, box: '110 182 180 70', colors: [C.black, C.white, C.pink, C.gold], tags: T(0, 3, 2, 0, 0),
      art: c => ({ body: mir(`<path d="M128,204 C128,194 134,190 142,190 L180,190 C188,190 192,196 191,205 C189,224 180,238 161,238 C142,238 129,226 128,210 Z" fill="url(#lensDark)" stroke="${c}" stroke-width="3.5"/><path d="M128,200 L112,196" stroke="${c}" stroke-width="4"/><path d="M142,198 L156,198" stroke="#fff" stroke-width="3" opacity=".45" stroke-linecap="round"/>`) + ln('M191,200 Q200,193 209,200', c, 4) }) },
    { id: 'gl_heart', cat: 'glasses', slot: 'glasses', name: 'Herzbrille', price: 70, box: '110 182 180 70', colors: [C.hot, C.red, C.purple], tags: T(3, 2, 1, 0, 0),
      art: c => ({ body: mir(`<path d="M161,206 C156,192 132,194 134,212 C136,226 161,240 161,240 C161,240 186,226 188,212 C190,194 166,192 161,206 Z" fill="${c}" fill-opacity=".45" stroke="${sh(c, -25)}" stroke-width="3.5"/><path d="M134,206 L116,200" stroke="${sh(c, -25)}" stroke-width="3.5"/><ellipse cx="146" cy="204" rx="4" ry="2.5" fill="#fff" opacity=".6"/>`) + ln('M188,208 Q200,200 212,208', sh(c, -25), 3.5) }) },
    { id: 'gl_cat', cat: 'glasses', slot: 'glasses', name: 'Cat-Eye', price: 90, box: '106 180 188 70', colors: [C.black, C.red, C.white], tags: T(2, 1, 1, 1, 0),
      art: c => ({ body: mir(`<path d="M130,206 C140,194 170,190 190,198 C192,214 184,236 162,238 C142,238 132,226 130,214 L118,194 Z" fill="#fff" fill-opacity=".12" stroke="${c}" stroke-width="4" stroke-linejoin="round"/><circle cx="124" cy="198" r="2" fill="#fff"/>`) + ln('M190,204 Q200,198 210,204', c, 4) }) },
    { id: 'gl_star', cat: 'glasses', slot: 'glasses', name: 'Sternbrille', price: 80, box: '106 178 188 80', colors: [C.gold, C.pink, C.sky], tags: T(3, 1, 0, 0, 0),
      art: c => ({ body: mir(`<path d="${ART.star(161, 218, 30, 14)}" fill="${c}" fill-opacity=".4" stroke="${sh(c, -25)}" stroke-width="3.5" stroke-linejoin="round"/>`) + ln('M186,212 Q200,204 214,212', sh(c, -25), 3.5) }) },
  ];
  const ITEM_BY_ID = Object.fromEntries(ITEMS.map(i => [i.id, i]));
  const THEME_BY_ID = Object.fromEntries(THEMES.map(t => [t.id, t]));
  const CATS = [
    { id: 'dress', name: 'Kleider', e: '👗' }, { id: 'top', name: 'Oberteile', e: '👚' }, { id: 'bottom', name: 'Hosen & Röcke', e: '👖' },
    { id: 'outer', name: 'Jacken', e: '🧥' }, { id: 'shoes', name: 'Schuhe', e: '👠' }, { id: 'bag', name: 'Taschen', e: '👜' },
    { id: 'jewel', name: 'Schmuck', e: '💍' }, { id: 'head', name: 'Kopf', e: '👑' }, { id: 'glasses', name: 'Brillen', e: '🕶️' },
  ];
  const JUDGES = [
    { id: 'lou', name: 'Lou', role: 'Mode' },
    { id: 'mira', name: 'Mira', role: 'Make-up' },
    { id: 'rafa', name: 'Rafa', role: 'Haare' },
  ];

  return { C, SKIN, EYES, HAIR_COLORS, ZONES, SALON_CARE, SALON_STYLE, FACE_CARE, MAKEUP, THEMES, THEME_BY_ID, ITEMS, ITEM_BY_ID, CATS, JUDGES };
})();
