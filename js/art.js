'use strict';
/* =========================================================
   ART — all SVG drawing for the character, tools and scenes.
   Character space: 400 x 1000 (head ~100-320, feet ~950)
   ========================================================= */
const ART = (() => {
  const A = {};
  const sh = (c, p) => U.shade(c, p);

  /* ---------- shared geometry ---------- */
  A.ARM_L = 'M150,386 Q132,430 130,480 Q128,535 124,590';
  A.ARM_R = 'M250,386 Q268,430 270,480 Q272,535 276,590';
  A.SHORT_L = 'M150,383 Q137,418 133,452';
  A.SHORT_R = 'M250,383 Q263,418 267,452';
  A.LONG_L = 'M150,383 Q132,430 130,480 Q128,532 125,580';
  A.LONG_R = 'M250,383 Q268,430 270,480 Q272,532 275,580';
  A.FACE = 'M108,205 C108,140 148,100 200,100 C252,100 292,140 292,205 C292,262 256,316 200,320 C144,316 108,262 108,205 Z';
  A.EYE = 'M134,220 C138,200 152,193 162,193 C176,193 186,203 188,218 C184,234 172,241 160,241 C148,241 136,233 134,220 Z';
  A.MASK = A.FACE + ' M131,218 a30,26 0 1,0 60,0 a30,26 0 1,0 -60,0 Z M209,218 a30,26 0 1,0 60,0 a30,26 0 1,0 -60,0 Z M174,290 a26,16 0 1,0 52,0 a26,16 0 1,0 -52,0 Z';

  /* ---------- helpers ---------- */
  A.mirror = s => `${s}<g transform="translate(400 0) scale(-1 1)">${s}</g>`;
  A.fab = (d, c, x = '') => `<path d="${d}" fill="${c}"/><path d="${d}" fill="url(#fabShade)"/>${x}`;
  A.ln = (d, c, w = 2, op = 1, cap = 'round') => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="${cap}" stroke-linejoin="round" opacity="${op}"/>`;
  A.slv = (d, c, w = 34) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="butt"/><path d="${d}" fill="none" stroke="url(#fabShade)" stroke-width="${w}" stroke-linecap="butt"/>`;
  A.star = (cx, cy, R, r, n = 5, rot = -90) => {
    let d = '';
    for (let i = 0; i < n * 2; i++) {
      const rad = i % 2 ? r : R, a = (rot + i * 180 / n) * Math.PI / 180;
      d += (i ? 'L' : 'M') + (cx + Math.cos(a) * rad).toFixed(1) + ',' + (cy + Math.sin(a) * rad).toFixed(1) + ' ';
    }
    return d + 'Z';
  };
  A.spark4 = (x, y, r) => `M${x},${y - r} L${x + r * .28},${y - r * .28} L${x + r},${y} L${x + r * .28},${y + r * .28} L${x},${y + r} L${x - r * .28},${y + r * .28} L${x - r},${y} L${x - r * .28},${y - r * .28} Z`;
  A.heart = (x, y, s) => `M${x},${y - s * .35} C${x - s * .2},${y - s * .95} ${x - s},${y - s * .75} ${x - s * .9},${y - s * .1} C${x - s * .8},${y + s * .4} ${x},${y + s * .85} ${x},${y + s * .85} C${x},${y + s * .85} ${x + s * .8},${y + s * .4} ${x + s * .9},${y - s * .1} C${x + s},${y - s * .75} ${x + s * .2},${y - s * .95} ${x},${y - s * .35} Z`;

  /* ---------- body ---------- */
  A.body = (s) => {
    const d = sh(s, -16);
    const leg = 'M150,592 L200,592 L198,660 Q196,740 192,780 Q190,860 189,912 L171,912 Q170,860 166,780 Q160,740 156,660 Q152,620 150,592 Z';
    const foot = 'M169,904 L191,904 C194,918 196,930 191,940 C185,947 173,947 168,939 C164,929 166,916 169,904 Z';
    const torso = 'M184,354 L216,354 C230,361 248,365 256,378 C262,392 252,420 246,450 C240,480 234,500 234,522 C240,545 252,570 252,598 L148,598 C148,570 160,545 166,522 C166,500 160,480 154,450 C148,420 138,392 144,378 C152,365 170,361 184,354 Z';
    const neck = 'M183,292 L217,292 L219,364 Q200,374 181,364 Z';
    return {
      legs: A.mirror(`<path d="${leg}" fill="${s}"/><path d="${leg}" fill="url(#limbShade)"/><path d="M177,772 Q182,778 187,772" stroke="${d}" stroke-width="1.6" fill="none" opacity=".45"/><path d="${foot}" fill="${s}"/><path d="M172,934 Q180,940 188,934" stroke="${d}" stroke-width="1.3" fill="none" opacity=".35"/>`),
      torso: `<path d="${neck}" fill="${s}"/><path d="${neck}" fill="url(#limbShade)"/><path d="${torso}" fill="${s}"/><path d="${torso}" fill="url(#limbShade)"/><ellipse cx="200" cy="318" rx="28" ry="10" fill="${d}" opacity=".5"/><path d="M168,374 Q182,381 195,377 M232,374 Q218,381 205,377" stroke="${d}" stroke-width="1.6" fill="none" opacity=".45" stroke-linecap="round"/>`,
      arms: `<g fill="none" stroke-linecap="round"><path d="${A.ARM_L}" stroke="${d}" stroke-width="24" transform="translate(-2.5 0)"/><path d="${A.ARM_R}" stroke="${d}" stroke-width="24" transform="translate(2.5 0)"/><path d="${A.ARM_L}" stroke="${s}" stroke-width="23"/><path d="${A.ARM_R}" stroke="${s}" stroke-width="23"/></g>`,
      hands: A.mirror(`<ellipse cx="123" cy="603" rx="11.5" ry="15" fill="${s}"/><ellipse cx="131.5" cy="597" rx="4" ry="7.5" transform="rotate(-22 131.5 597)" fill="${s}"/><path d="M118,613 Q123,618 128,613" stroke="${d}" stroke-width="1.2" fill="none" opacity=".5"/>`),
    };
  };

  /* ---------- face ---------- */
  A.FRECKLES = [[172, 248, 1.7], [180, 242, 1.5], [166, 256, 1.6], [184, 254, 1.4], [228, 248, 1.7], [220, 242, 1.5], [234, 256, 1.6], [216, 254, 1.4], [156, 250, 1.4], [244, 250, 1.4], [192, 236, 1.2], [208, 236, 1.2]];

  A.eye = (mk) => {
    const lc = '#26161d';
    let e = `<path d="${A.EYE}" fill="#fff"/><path d="${A.EYE}" fill="url(#eyeTop)"/>`;
    e += `<circle cx="161" cy="217" r="15.5" fill="url(#irisGrad)"/><circle cx="161" cy="217" r="15.5" fill="none" stroke="#000" stroke-opacity=".28" stroke-width="1.6"/>`;
    e += `<circle cx="161" cy="217" r="7.2" fill="#1b1018"/><circle cx="155" cy="210.5" r="5" fill="#fff"/><circle cx="167" cy="224.5" r="2.3" fill="#fff" opacity=".85"/>`;
    e += `<path d="M131,219 C137,199 152,190 163,191 C176,192 186,200 190,214" stroke="${lc}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`;
    e += `<path d="M133,213 L123,206 M136,206 L128,197 M142,200 L137,190" stroke="${lc}" stroke-width="2.6" stroke-linecap="round" fill="none"/>`;
    e += `<path d="M140,234 C150,242 168,243 181,234" stroke="${lc}" stroke-width="1.4" fill="none" opacity=".45"/>`;
    if (mk.mascara) e += `<path d="M131,216 L116,206 M133,209 L120,196 M138,202 L130,188 M145,197 L141,183 M153,194 L151,180" stroke="${mk.mascara}" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M131,219 C137,199 152,190 163,191 C176,192 186,200 190,214" stroke="${mk.mascara}" stroke-width="5.5" fill="none" stroke-linecap="round"/><path d="M146,240 L144,247 M154,242 L153,249 M163,242 L163,249" stroke="${mk.mascara}" stroke-width="1.6" stroke-linecap="round"/>`;
    if (mk.liner) e += `<path d="M130,219 C136,198 152,189 163,190 C176,191 187,199 191,213" stroke="${mk.liner}" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M132,219 L113,205 L136,212 Z" fill="${mk.liner}"/>`;
    return e;
  };

  A.mouth = (L) => {
    const nat = U.mix(L.skin, '#d9627a', .5);
    const lipC = L.mk.lips || nat;
    const fill = L.mk.lips ? 'url(#lipGrad)' : nat;
    if (L.happy) {
      return `<path d="M176,280 C186,283 214,283 224,280 C221,299 211,309 200,309 C189,309 179,299 176,280 Z" fill="#7a2236"/><path d="M180,282 C190,285 210,285 220,282 L218,290 C209,292 191,292 182,290 Z" fill="#fff"/><path d="M187,301 C193,296 207,296 213,301 C208,307 192,307 187,301 Z" fill="#ef6f86"/><path d="M176,280 C186,283 214,283 224,280 C221,299 211,309 200,309 C189,309 179,299 176,280 Z" fill="none" stroke="${L.mk.lips ? L.mk.lips : sh(nat, -8)}" stroke-width="3.5" stroke-linejoin="round"/>`;
    }
    const gloss = L.mk.lips
      ? '<ellipse cx="208" cy="294" rx="6" ry="2.4" fill="#fff" opacity=".6"/><ellipse cx="191" cy="281.5" rx="4" ry="1.4" fill="#fff" opacity=".4"/>'
      : '<ellipse cx="206" cy="294" rx="5" ry="2" fill="#fff" opacity=".25"/>';
    return `<path d="M178,284 C186,277 194,276 200,280 C206,276 214,277 222,284 C214,287 206,288 200,288 C194,288 186,287 178,284 Z" fill="${fill}"/><path d="M179,285 C186,288 194,289 200,289 C206,289 214,288 221,285 C216,297 208,302 200,302 C192,302 184,297 179,285 Z" fill="${fill}"/><path d="M180,285 C190,289 210,289 220,285" stroke="${sh(lipC, -40)}" stroke-width="1.5" fill="none" stroke-linecap="round"/>${gloss}`;
  };

  A.LIPS = 'M178,284 C186,277 194,276 200,280 C206,276 214,277 222,284 C220,286 220,286 221,285 C216,297 208,302 200,302 C192,302 184,297 179,285 C178,285 178,285 178,284 Z';
  A.LID = (() => {
    const bz = (p0, p1, p2, p3, t) => { const u = 1 - t; return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3; };
    const pts = [];
    for (let i = 0; i <= 6; i++) { const t = i / 6; pts.push({ x: bz(131, 137, 152, 163, t), y: bz(219, 199, 190, 191, t) }); }
    for (let i = 1; i <= 5; i++) { const t = i / 5; pts.push({ x: bz(163, 176, 186, 190, t), y: bz(191, 192, 200, 214, t) }); }
    return pts.concat(pts.map(p => ({ x: 400 - p.x, y: p.y, r: 1 })));
  })();
  A.headBase = (L) => {
    const s = L.skin, d = U.shade(s, -18);
    return `<ellipse cx="112" cy="224" rx="14" ry="20" fill="${s}"/><path d="M110,212 C104,220 106,232 114,236" stroke="${d}" stroke-width="2" fill="none" opacity=".5"/>`
      + `<ellipse cx="288" cy="224" rx="14" ry="20" fill="${s}"/><path d="M290,212 C296,220 294,232 286,236" stroke="${d}" stroke-width="2" fill="none" opacity=".5"/>`
      + `<path d="${A.FACE}" fill="${s}"/><path d="${A.FACE}" fill="url(#faceShade)"/><ellipse cx="172" cy="158" rx="56" ry="40" fill="url(#faceGlow)"/>`
      + `<g filter="url(#blur4)"><ellipse cx="148" cy="262" rx="22" ry="12" fill="#ff8aa0" opacity=".18"/><ellipse cx="252" cy="262" rx="22" ry="12" fill="#ff8aa0" opacity=".18"/></g>`;
  };
  A.headFeat = (L) => {
    const s = L.skin, dd = U.shade(s, -32);
    const brow = U.luma(L.hairColor) > .7 ? U.shade(L.hairColor, -45) : U.shade(L.hairColor, -18);
    return `<path d="M128,182 C138,168 158,164 180,170 C182,173 180,176 177,175 C158,171 142,174 131,185 C128,186 126,184 128,182 Z" fill="${brow}"/>`
      + `<path d="M272,182 C262,168 242,164 220,170 C218,173 220,176 223,175 C242,171 258,174 269,185 C272,186 274,184 272,182 Z" fill="${brow}"/>`
      + `<g id="eyes">${A.mirror(A.eye({}))}</g>`
      + `<path d="M195,250 Q200,257 206,250" stroke="${dd}" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".75"/><ellipse cx="200" cy="236" rx="3" ry="9" fill="#fff" opacity=".22"/>`
      + A.mouth(L);
  };
  A.sticker = (t) => {
    if (t === 'heart') return `<path d="${A.heart(274, 252, 10)}" fill="#ff4f8b" stroke="#fff" stroke-width="1.2"/><ellipse cx="270" cy="246" rx="2.5" ry="1.6" fill="#fff" opacity=".75"/>`;
    if (t === 'star') return `<path d="${A.star(275, 250, 11, 4.6)}" fill="#ffd54a" stroke="#f2a900" stroke-width="1"/>`;
    if (t === 'gems') return `<path d="${A.spark4(272, 236, 6)}" fill="#8fd0ff"/><path d="${A.spark4(283, 250, 5)}" fill="#ff8fc4"/><path d="${A.spark4(272, 263, 4.5)}" fill="#c9a7ff"/>`;
    if (t === 'moon') return `<path d="M276,240 A12,12 0 1,0 281,262 A9,9 0 1,1 276,240 Z" fill="#ffd54a" stroke="#f2a900" stroke-width="1"/>`;
    return '';
  };

  A.head = (L) => {
    const s = L.skin, d = sh(s, -18), dd = sh(s, -32), mk = L.mk;
    const brow = U.luma(L.hairColor) > .7 ? sh(L.hairColor, -45) : sh(L.hairColor, -18);
    let o = '';
    o += `<ellipse cx="112" cy="224" rx="14" ry="20" fill="${s}"/><path d="M110,212 C104,220 106,232 114,236" stroke="${d}" stroke-width="2" fill="none" opacity=".5"/>`;
    o += `<ellipse cx="288" cy="224" rx="14" ry="20" fill="${s}"/><path d="M290,212 C296,220 294,232 286,236" stroke="${d}" stroke-width="2" fill="none" opacity=".5"/>`;
    o += `<path d="${A.FACE}" fill="${s}"/><path d="${A.FACE}" fill="url(#faceShade)"/><ellipse cx="172" cy="158" rx="56" ry="40" fill="url(#faceGlow)"/>`;
    o += `<g filter="url(#blur4)"><ellipse cx="148" cy="262" rx="22" ry="12" fill="#ff8aa0" opacity=".2"/><ellipse cx="252" cy="262" rx="22" ry="12" fill="#ff8aa0" opacity=".2"/></g>`;
    if (mk.freckles) o += `<g fill="${mk.freckles}" opacity=".6">${A.FRECKLES.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')}</g>`;
    if (mk.blush) o += `<g filter="url(#blur4)" opacity=".6"><ellipse cx="148" cy="262" rx="25" ry="15" fill="${mk.blush}"/><ellipse cx="252" cy="262" rx="25" ry="15" fill="${mk.blush}"/></g>`;
    if (mk.hilite) o += `<g fill="${mk.hilite}" filter="url(#blur2)" opacity=".9"><ellipse cx="138" cy="246" rx="13" ry="5" transform="rotate(-24 138 246)"/><ellipse cx="262" cy="246" rx="13" ry="5" transform="rotate(24 262 246)"/><ellipse cx="200" cy="232" rx="3.2" ry="11"/><ellipse cx="200" cy="142" rx="11" ry="4"/></g>`;
    o += `<path d="M128,182 C138,168 158,164 180,170 C182,173 180,176 177,175 C158,171 142,174 131,185 C128,186 126,184 128,182 Z" fill="${brow}"/>`;
    o += `<path d="M272,182 C262,168 242,164 220,170 C218,173 220,176 223,175 C242,171 258,174 269,185 C272,186 274,184 272,182 Z" fill="${brow}"/>`;
    if (mk.shadow) o += `<g fill="${mk.shadow}" filter="url(#blur2)" opacity=".85">${A.mirror('<path d="M128,216 C130,190 150,177 164,178 C181,179 193,194 194,213 C186,200 174,192 162,192 C149,192 136,201 128,216 Z"/>')}</g>`;
    o += `<g id="eyes">${A.mirror(A.eye(mk))}</g>`;
    o += `<path d="M195,250 Q200,257 206,250" stroke="${dd}" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".75"/><ellipse cx="200" cy="236" rx="3" ry="9" fill="#fff" opacity=".22"/>`;
    o += A.mouth(L);
    if (mk.sticker) o += A.sticker(mk.sticker);
    return o;
  };

  A.faceFx = (L) => {
    let s = '';
    if (L.pimples > .02) s += `<g opacity="${L.pimples.toFixed(2)}">${[[236, 152, 5], [146, 278, 4.5], [214, 306, 3.8]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#e8737a"/><circle cx="${x - 1}" cy="${y - 1}" r="${r * .4}" fill="#ffc0c0"/>`).join('')}</g>`;
    if (L.maskOn > .02) s += `<path d="${A.MASK}" fill="#a3dc9c" fill-rule="evenodd" opacity="${(L.maskOn * .95).toFixed(2)}"/><path d="${A.MASK}" fill="url(#maskTex)" fill-rule="evenodd" opacity="${L.maskOn.toFixed(2)}"/>`;
    if (L.cucumbers) s += A.mirror(`<circle cx="161" cy="216" r="27" fill="#5aa548"/><circle cx="161" cy="216" r="23.5" fill="#c8ec9c"/><circle cx="161" cy="216" r="15" fill="#e4f7c8"/><g fill="#9cc96f">${[0, 60, 120, 180, 240, 300].map(a => { const r = a * Math.PI / 180; return `<ellipse cx="${(161 + Math.cos(r) * 9).toFixed(1)}" cy="${(216 + Math.sin(r) * 9).toFixed(1)}" rx="2" ry="3.2" transform="rotate(${a + 90} ${(161 + Math.cos(r) * 9).toFixed(1)} ${(216 + Math.sin(r) * 9).toFixed(1)})"/>`; }).join('')}</g><ellipse cx="153" cy="206" rx="6" ry="3" fill="#fff" opacity=".5"/>`);
    return s;
  };

  /* ---------- hair ---------- */
  const hp = d => `<path d="${d}" fill="url(#hairGrad)"/>`;
  const strands = (c, w, op, ...ds) => `<g fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" opacity="${op}">${ds.map(d => `<path d="${d}"/>`).join('')}</g>`;
  const CENTER = 'M100,258 C86,150 128,62 200,62 C272,62 314,150 300,258 C297,222 291,194 279,172 C263,144 233,124 200,118 C167,124 137,144 121,172 C109,194 103,222 100,258 Z';
  const SLICK = 'M101,236 C89,148 130,64 200,64 C270,64 311,148 299,236 C295,204 287,176 271,154 C251,130 226,121 200,121 C174,121 149,130 129,154 C113,176 105,204 101,236 Z';
  const SIDE = 'M100,254 C86,150 128,62 200,62 C272,62 314,150 300,254 C298,226 292,200 282,182 C270,160 250,146 226,140 C208,156 184,170 156,177 C138,182 122,194 114,214 C108,228 104,242 100,254 Z';
  const BANGS = 'M94,332 C80,250 82,150 126,96 C148,72 176,62 200,62 C224,62 252,72 274,96 C318,150 320,250 306,332 C298,336 290,338 280,336 C284,292 284,238 278,188 L279,164 Q267,176 254,164 Q241,176 228,164 Q214,176 200,164 Q186,176 172,164 Q159,176 146,164 Q133,176 121,164 L122,188 C116,238 116,292 120,336 C110,338 102,336 94,332 Z';
  const CAP = 'M104,160 C84,230 96,292 122,312 L278,312 C304,292 316,230 296,160 C266,72 134,72 104,160 Z';
  const centerFront = c => hp(CENTER) + strands(c.dk, 2.5, .45, 'M200,64 C199,84 199,104 200,118') + strands(c.dk, 2, .3, 'M196,121 C170,129 142,147 124,177', 'M204,121 C230,129 258,147 276,177');
  const slickFront = c => hp(SLICK) + strands(c.dk, 2, .3, 'M150,128 C164,100 182,82 204,72', 'M250,128 C238,102 222,84 206,72', 'M126,160 C134,128 152,104 178,90', 'M274,160 C266,128 248,104 222,90');
  const braid = (x0, dir, c) => {
    let s = '';
    for (let i = 0; i < 9; i++) {
      const cx = x0 + dir * i * .8, cy = 266 + i * 27, rx = 20 - i * .5;
      s += `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="16.5" fill="url(#hairGrad)"/><path d="M${cx - rx + 5},${cy - 5} Q${cx},${cy + 9} ${cx + rx - 5},${cy - 5}" stroke="${c.dk}" stroke-width="2" fill="none" opacity=".4"/>`;
    }
    const ty = 266 + 9 * 27 - 6, tx = x0 + dir * 7;
    return s + `<path d="M${tx - 11},${ty} Q${tx},${ty + 42} ${tx + 11},${ty} Z" fill="url(#hairGrad)"/><rect x="${tx - 10}" y="${ty - 6}" width="20" height="8" rx="4" fill="#ff6fa5"/>`;
  };
  const bun = (cx, cy, r, c) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#hairGrad)"/>` + strands(c.dk, 2.4, .4, `M${cx - r * .6},${cy - r * .05} C${cx - r * .5},${cy - r * .65} ${cx + r * .55},${cy - r * .7} ${cx + r * .6},${cy - r * .1} C${cx + r * .62},${cy + r * .4} ${cx - r * .2},${cy + r * .55} ${cx - r * .35},${cy + r * .15}`, `M${cx - r * .3},${cy - r * .35} C${cx - r * .1},${cy - r * .55} ${cx + r * .3},${cy - r * .5} ${cx + r * .35},${cy - r * .2}`);
  const CURL_BACK = [[92, 170, 40], [80, 230, 42], [84, 292, 40], [100, 348, 36], [132, 380, 30], [308, 170, 40], [320, 230, 42], [316, 292, 40], [300, 348, 36], [268, 380, 30], [118, 104, 42], [158, 74, 42], [200, 64, 44], [242, 74, 42], [282, 104, 42]];
  const CURL_FRONT = [[118, 152, 26], [146, 124, 28], [178, 110, 28], [222, 110, 28], [254, 124, 28], [282, 152, 26], [106, 196, 22], [294, 196, 22]];

  A.HAIR = {
    wavy: {
      name: 'Beach Waves', tags: { party: 2, beach: 3, casual: 2, gala: 1, winter: 1 }, curl: 'curls', straight: 'straight',
      back: c => hp('M108,150 C70,220 58,320 70,420 C76,470 62,520 78,575 C96,600 120,582 132,600 C150,612 168,598 180,606 L220,606 C232,598 250,612 268,600 C280,582 304,600 322,575 C338,520 324,470 330,420 C342,320 330,220 292,150 C262,70 138,70 108,150 Z')
        + strands(c.dk, 3, .35, 'M96,240 C84,300 104,350 88,420 C78,470 96,520 88,570', 'M304,240 C316,300 296,350 312,420 C322,470 304,520 312,570', 'M118,320 C108,370 126,420 114,470 C106,510 118,550 110,590', 'M282,320 C292,370 274,420 286,470 C294,510 282,550 290,590'),
      front: c => hp(SIDE) + strands(c.dk, 2.5, .5, 'M226,140 C230,112 234,88 240,66') + strands(c.dk, 2, .35, 'M222,144 C204,160 180,172 152,178', 'M282,184 C292,200 296,226 298,250'),
      over: c => hp('M104,236 C90,290 112,330 98,380 C90,420 110,450 104,490 C120,470 126,440 120,400 C116,360 132,320 120,270 C116,256 112,244 108,236 Z') + hp('M296,236 C310,290 288,330 302,380 C310,420 290,450 296,490 C280,470 274,440 280,400 C284,360 268,320 280,270 C284,256 288,244 292,236 Z') + strands(c.dk, 2, .3, 'M108,260 C102,300 116,340 106,390', 'M292,260 C298,300 284,340 294,390'),
      shine: ['M104,200 C94,250 100,290 92,330', 'M150,84 C180,70 220,70 250,84', 'M296,200 C306,250 300,290 308,330'],
      streak: ['M184,68 C162,84 140,112 126,164', 'M250,74 C272,96 288,130 294,196', 'M112,252 C102,300 118,340 106,390', 'M288,252 C298,300 282,340 294,390'],
    },
    straight: {
      name: 'Glatt & Lang', tags: { party: 2, beach: 1, casual: 2, gala: 2, winter: 2 }, curl: 'wavy', straight: null,
      back: c => hp('M106,150 C80,230 78,330 80,600 L140,612 L200,620 L260,612 L320,600 C322,330 320,230 294,150 C262,68 138,68 106,150 Z') + strands(c.dk, 2.5, .25, 'M94,260 L92,590', 'M306,260 L308,590', 'M112,320 L112,600', 'M288,320 L288,600'),
      front: c => centerFront(c),
      over: c => hp('M100,240 C96,320 98,420 100,520 L112,534 L124,520 C122,430 122,340 122,262 C118,250 112,242 106,238 Z') + hp('M300,240 C304,320 302,420 300,520 L288,534 L276,520 C278,430 278,340 278,262 C282,250 288,242 294,238 Z'),
      shine: ['M112,210 C106,300 106,400 108,500', 'M140,92 C170,74 230,74 260,92', 'M288,210 C294,300 294,400 292,500'],
      streak: ['M190,70 C170,82 148,108 132,154', 'M210,70 C230,82 252,108 268,154', 'M110,262 C108,350 108,430 110,510', 'M290,262 C292,350 292,430 290,510'],
    },
    bob: {
      name: 'Bob mit Pony', tags: { party: 2, beach: 1, casual: 3, gala: 1, winter: 2 }, curl: 'curls', straight: null,
      back: c => hp('M100,160 C76,230 80,300 92,342 C120,354 160,352 200,352 C240,352 280,354 308,342 C320,300 324,230 300,160 C270,70 130,70 100,160 Z'),
      front: c => hp(BANGS) + strands(c.dk, 2, .28, 'M160,100 C152,130 150,150 150,166', 'M200,98 L200,164', 'M240,100 C248,130 250,150 250,166', 'M104,200 C100,250 102,300 106,330', 'M296,200 C300,250 298,300 294,330'),
      over: null,
      shine: ['M128,110 C160,80 240,80 272,110', 'M108,210 C102,260 104,300 110,326', 'M292,210 C298,260 296,300 290,326'],
      streak: ['M164,100 C154,130 152,150 152,166', 'M236,100 C246,130 248,150 248,166', 'M110,206 C104,256 104,300 108,330', 'M290,206 C296,256 296,300 292,330'],
    },
    pony: {
      name: 'Hoher Zopf', tags: { party: 1, beach: 2, casual: 2, gala: 1, winter: 1 }, curl: null, straight: null,
      back: c => hp(CAP) + hp('M200,74 C238,30 304,34 318,94 C332,150 320,212 332,272 C340,322 322,372 300,404 C306,354 296,304 286,254 C276,194 284,144 262,108 C246,86 222,82 202,86 Z') + strands(c.dk, 2.5, .3, 'M300,60 C318,110 306,170 318,230 C326,280 314,330 304,380') + '<ellipse cx="216" cy="70" rx="16" ry="9" fill="#ff6fa5"/>',
      front: c => slickFront(c),
      over: null,
      shine: ['M150,86 C180,72 220,72 250,86', 'M306,110 C318,160 308,220 316,290'],
      streak: ['M178,72 C160,86 144,110 134,142', 'M292,100 C312,150 302,220 308,300'],
    },
    bun: {
      name: 'Dutt', tags: { party: 1, beach: 1, casual: 1, gala: 3, winter: 2 }, curl: null, straight: null,
      back: c => hp(CAP) + bun(200, 54, 40, c),
      front: c => slickFront(c) + `<g fill="none" stroke="url(#hairGrad)" stroke-width="4.5" stroke-linecap="round"><path d="M114,196 C104,228 110,260 120,284"/><path d="M286,196 C296,228 290,260 280,284"/></g>`,
      over: null,
      shine: ['M150,86 C180,72 220,72 250,86', 'M178,30 C190,20 214,20 226,32'],
      streak: ['M178,72 C160,86 144,110 134,142', 'M222,72 C240,86 256,110 266,142'],
    },
    braids: {
      name: 'Zöpfe', tags: { party: 1, beach: 2, casual: 3, gala: 0, winter: 3 }, curl: null, straight: null,
      back: c => hp(CAP),
      front: c => centerFront(c),
      over: c => braid(110, 1, c) + braid(290, -1, c),
      shine: ['M140,92 C170,74 230,74 260,92', 'M104,262 C102,300 104,340 106,380', 'M296,262 C298,300 296,340 294,380'],
      streak: ['M190,70 C170,82 148,108 132,154', 'M210,70 C230,82 252,108 268,154'],
    },
    spacebuns: {
      name: 'Space Buns', tags: { party: 3, beach: 2, casual: 2, gala: 0, winter: 1 }, curl: null, straight: null,
      back: c => hp(CAP) + bun(124, 84, 35, c) + bun(276, 84, 35, c),
      front: c => centerFront(c) + `<g fill="none" stroke="url(#hairGrad)" stroke-width="4" stroke-linecap="round"><path d="M112,206 C104,236 110,262 118,282"/><path d="M288,206 C296,236 290,262 282,282"/></g>`,
      over: null,
      shine: ['M140,92 C170,74 230,74 260,92', 'M106,66 C114,56 128,54 138,60', 'M262,60 C272,54 286,56 294,66'],
      streak: ['M190,70 C170,82 148,108 132,154', 'M210,70 C230,82 252,108 268,154'],
    },
    curls: {
      name: 'Lockenmähne', tags: { party: 3, beach: 2, casual: 1, gala: 2, winter: 1 }, curl: null, straight: 'wavy',
      back: c => CURL_BACK.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#hairGrad)"/>`).join('') + strands(c.dk, 2.2, .3, ...CURL_BACK.filter((_, i) => i % 2 === 0).map(([x, y, r]) => `M${x - r * .4},${y} C${x - r * .4},${y - r * .45} ${x + r * .4},${y - r * .45} ${x + r * .35},${y + r * .1}`)),
      front: c => hp('M104,226 C96,140 140,80 200,80 C260,80 304,140 296,226 C284,176 250,146 200,146 C150,146 116,176 104,226 Z') + CURL_FRONT.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#hairGrad)"/>`).join('') + strands(c.dk, 2, .3, ...CURL_FRONT.map(([x, y, r]) => `M${x - r * .4},${y + r * .1} C${x - r * .4},${y - r * .5} ${x + r * .4},${y - r * .5} ${x + r * .35},${y + r * .1}`)),
      over: null,
      shine: ['M136,112 C140,104 150,100 158,102', 'M196,92 C202,86 214,86 220,92', 'M244,104 C252,102 262,106 266,114', 'M76,214 C78,206 86,202 92,204', 'M310,204 C316,202 324,206 326,214'],
      streak: ['M140,128 C150,118 166,116 176,124', 'M224,124 C234,116 250,118 260,128', 'M86,240 C92,232 104,232 110,240', 'M290,240 C296,232 308,232 314,240'],
    },
  };

  A.FLY = ['M104,150 q-12,-6 -10,-18 q2,-9 11,-7', 'M128,98 q-10,-12 -4,-22 q5,-6 11,0', 'M170,70 q-4,-14 6,-20 q8,-3 10,5', 'M222,68 q6,-14 16,-12 q7,3 3,11', 'M268,94 q12,-10 20,-2 q4,7 -4,11', 'M296,150 q12,-8 18,2 q3,8 -6,10', 'M100,214 q-14,-2 -16,-14 q0,-8 9,-7', 'M300,214 q14,-2 16,-14 q0,-8 -9,-7', 'M148,80 l-5,-9 l7,-2 l-4,-9', 'M252,80 l5,-9 l-7,-2 l4,-9'];
  A.FOAM = (() => { const a = []; for (let i = 0; i < 42; i++) { const ang = i * 2.39996, r = Math.sqrt((i + .5) / 42); a.push({ x: +(200 + Math.cos(ang) * r * 120).toFixed(1), y: +(128 + Math.sin(ang) * r * 80).toFixed(1), r: 8 + (i * 7 % 5) * 2.6 }); } return a; })();
  A.DROPS = [[130, 120], [170, 90], [232, 96], [272, 128], [118, 182], [284, 188], [150, 140], [252, 144], [200, 78], [104, 240], [296, 240], [180, 120]];
  A.GLIT = (() => { const a = []; for (let i = 0; i < 26; i++) { const ang = i * 2.39996 + 1, r = Math.sqrt((i + .5) / 26); a.push([+(200 + Math.cos(ang) * r * 118).toFixed(1), +(122 + Math.sin(ang) * r * 70).toFixed(1), 3 + (i % 4) * 1.4, ['#fff', '#ffe066', '#ff9fcd', '#b8e3ff', '#d9c2ff'][i % 5]]); } return a; })();

  A.hairFx = (L, c) => {
    const H = A.HAIR[L.hair];
    let s = '';
    const shOp = (0.12 + L.shine * 0.45) * (1 - L.wet * .6);
    s += `<g fill="none" stroke="#fff" stroke-linecap="round" opacity="${shOp.toFixed(2)}">${H.shine.map(d => `<path d="${d}" stroke-width="5"/>`).join('')}</g>`;
    if (L.streak) s += `<g fill="none" stroke-linecap="round">${H.streak.map(d => `<path d="${d}" stroke="${L.streak}" stroke-width="7" opacity=".92"/><path d="${d}" stroke="#fff" stroke-width="2" opacity=".35"/>`).join('')}</g>`;
    if (L.messy > .02) s += `<g fill="none" stroke="${c.dk}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" opacity="${(L.messy * .9).toFixed(2)}">${A.FLY.map(d => `<path d="${d}"/>`).join('')}</g>`;
    if (L.wet > .12) s += `<g opacity="${Math.min(1, L.wet * 1.3).toFixed(2)}">${A.DROPS.map(([x, y]) => `<path d="M${x},${y - 7} C${x + 5},${y} ${x + 5},${y + 5} ${x},${y + 6} C${x - 5},${y + 5} ${x - 5},${y} ${x},${y - 7} Z" fill="#d6f1ff" stroke="#8fd0ff" stroke-width="1"/><circle cx="${x - 1.5}" cy="${y}" r="1.2" fill="#fff"/>`).join('')}</g>`;
    if (L.glitter) s += `<g class="twinkle">${A.GLIT.map(([x, y, r, col]) => `<path d="${A.spark4(x, y, r)}" fill="${col}"/>`).join('')}</g>`;
    const n = Math.round(L.foam * A.FOAM.length);
    if (n > 0) s += `<g>${A.FOAM.slice(0, n).map(b => `<circle cx="${b.x}" cy="${b.y}" r="${b.r}" fill="#fff" stroke="#d6e6f5" stroke-width="1.5"/><circle cx="${(b.x - b.r * .35).toFixed(1)}" cy="${(b.y - b.r * .35).toFixed(1)}" r="${(b.r * .25).toFixed(1)}" fill="#e8f6ff"/>`).join('')}</g>`;
    return s;
  };

  A.hairThumb = (key, L) => {
    const H = A.HAIR[key];
    const c = { base: L.hairColor, dk: sh(L.hairColor, -30) };
    return `<svg viewBox="40 0 320 420">${H.back(c)}${H.over ? H.over(c) : ''}<ellipse cx="112" cy="224" rx="14" ry="20" fill="${L.skin}"/><ellipse cx="288" cy="224" rx="14" ry="20" fill="${L.skin}"/><path d="${A.FACE}" fill="${L.skin}"/><ellipse cx="161" cy="220" rx="10" ry="12" fill="#3b2547"/><ellipse cx="239" cy="220" rx="10" ry="12" fill="#3b2547"/><circle cx="157" cy="215" r="3.5" fill="#fff"/><circle cx="235" cy="215" r="3.5" fill="#fff"/><path d="M186,284 Q200,294 214,284" stroke="#d9627a" stroke-width="5" fill="none" stroke-linecap="round"/>${H.front(c)}</svg>`;
  };

  /* ---------- judges ---------- */
  A.judge = (id) => {
    const face = (skin) => `<circle cx="30" cy="33" r="14" fill="${skin}"/><circle cx="24.5" cy="33" r="2.1" fill="#2a1a22"/><circle cx="35.5" cy="33" r="2.1" fill="#2a1a22"/><circle cx="25.2" cy="32.2" r=".8" fill="#fff"/><circle cx="36.2" cy="32.2" r=".8" fill="#fff"/><path d="M26,39 Q30,42 34,39" stroke="#b8405a" stroke-width="1.6" fill="none" stroke-linecap="round"/><ellipse cx="21.5" cy="38" rx="2.8" ry="1.7" fill="#ff8aa0" opacity=".5"/><ellipse cx="38.5" cy="38" rx="2.8" ry="1.7" fill="#ff8aa0" opacity=".5"/>`;
    if (id === 'lou') return `<svg viewBox="0 0 60 60"><rect width="60" height="60" fill="#efe4ff"/><path d="M12,46 C10,22 18,14 30,14 C42,14 50,22 48,46 Z" fill="#8b5cf6"/><path d="M17,62 C17,50 43,50 43,62 Z" fill="#2a2230"/>${face('#f8d1b0')}<path d="M16,30 C16,18 24,15 30,15 C38,15 45,19 44,30 C40,24 30,22 24,26 C21,28 18,29 16,30 Z" fill="#8b5cf6"/><g fill="none" stroke="#2a2230" stroke-width="1.4"><circle cx="24.5" cy="33" r="4.6"/><circle cx="35.5" cy="33" r="4.6"/><path d="M29,33 L31,33"/></g></svg>`;
    if (id === 'mira') return `<svg viewBox="0 0 60 60"><rect width="60" height="60" fill="#ffe4f0"/><path d="M10,62 C8,30 14,12 30,12 C46,12 52,30 50,62 Z" fill="#ff8fc4"/><path d="M19,62 C19,51 41,51 41,62 Z" fill="#fff"/>${face('#eab98e')}<path d="M16,32 C14,18 24,13 32,13 C42,14 46,22 45,32 C40,22 28,20 16,32 Z" fill="#ff8fc4"/><circle cx="16.4" cy="40" r="1.9" fill="#ffd54a"/><circle cx="43.6" cy="40" r="1.9" fill="#ffd54a"/></svg>`;
    return `<svg viewBox="0 0 60 60"><rect width="60" height="60" fill="#e0f4ff"/><path d="M17,62 C17,50 43,50 43,62 Z" fill="#4f8dff"/><path d="M26,51 L30,54 L34,51 L34,57 L30,54 L26,57 Z" fill="#ff4f9a"/>${face('#a8703f')}<g fill="#2a1a14">${[[18, 24, 6], [24, 18, 6.5], [31, 16, 7], [38, 18, 6.5], [43, 24, 6], [16, 30, 4.5], [44, 30, 4.5]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')}</g></svg>`;
  };

  /* ---------- tool icons (48x48) ---------- */
  A.ICON = {
    shampoo: '<rect x="13" y="16" width="22" height="28" rx="7" fill="#7cc8f6"/><rect x="17" y="9" width="14" height="9" rx="3" fill="#ff6fa5"/><rect x="26" y="5" width="12" height="5" rx="2.5" fill="#ff6fa5"/><rect x="16" y="25" width="16" height="11" rx="3" fill="#fff" opacity=".9"/><circle cx="21" cy="30.5" r="2.6" fill="#7cc8f6"/><circle cx="27.5" cy="29" r="1.8" fill="#ff9fc9"/><rect x="15.5" y="18" width="3.5" height="22" rx="1.75" fill="#fff" opacity=".4"/>',
    shower: '<path d="M41,5 C41,15 33,13 30,19" stroke="#a9b6c8" stroke-width="4" fill="none" stroke-linecap="round"/><ellipse cx="23" cy="21" rx="13" ry="7.5" fill="#dfe7f1"/><ellipse cx="23" cy="23" rx="13" ry="5" fill="#a8b9cc"/><g stroke="#5fb8ff" stroke-width="2.6" stroke-linecap="round"><path d="M14,30 L11,40"/><path d="M20,31 L18.5,44"/><path d="M26,31 L26.5,43"/><path d="M32,30 L35,40"/></g>',
    dryer: '<path d="M5,15 C5,9 9,6 15,6 L30,6 C36,6 39,10 39,15.5 C39,21 35,24 30,24 L15,24 C9,24 5,21 5,15 Z" fill="#ff8fc4"/><circle cx="15" cy="15" r="5.5" fill="#fff" opacity=".9"/><circle cx="15" cy="15" r="2.2" fill="#ff8fc4"/><rect x="38" y="9" width="6" height="12" rx="2" fill="#d9619e"/><path d="M21,23 L19,40 C19,42.5 21,44 23.5,44 L26.5,44 C29,44 30,42.5 29.5,40 L28,23 Z" fill="#e8669f"/><rect x="20.5" y="31" width="8" height="3" rx="1.5" fill="#fff" opacity=".7"/><path d="M9,10 C11,8 15,7.5 19,8" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" opacity=".6"/>',
    comb: '<rect x="5" y="12" width="38" height="10" rx="5" fill="#ffb347"/><g fill="#ffb347">' + Array.from({ length: 9 }, (_, i) => `<rect x="${7.5 + i * 4}" y="20" width="2.6" height="${i % 2 ? 13 : 16}" rx="1.3"/>`).join('') + '</g><rect x="8" y="14" width="30" height="3" rx="1.5" fill="#fff" opacity=".55"/>',
    scissors: '<circle cx="13" cy="35" r="7" fill="none" stroke="#ff6fa5" stroke-width="4"/><circle cx="35" cy="35" r="7" fill="none" stroke="#ff6fa5" stroke-width="4"/><path d="M17,30 L34,5" stroke="#b8c2d0" stroke-width="4.5" stroke-linecap="round"/><path d="M31,30 L14,5" stroke="#dbe2ec" stroke-width="4.5" stroke-linecap="round"/><circle cx="24" cy="18" r="2.2" fill="#7a8494"/>',
    dye: '<path d="M6,26 L42,26 C42,38 34,44 24,44 C14,44 6,38 6,26 Z" fill="#c58bf2"/><ellipse cx="24" cy="26" rx="18" ry="5" fill="#8b5cf6"/><ellipse cx="24" cy="26" rx="15" ry="3.4" fill="#ff6fa5"/><g transform="rotate(28 30 14)"><rect x="28" y="0" width="4.5" height="20" rx="2.2" fill="#3b2547"/><path d="M27,19 L34,19 L33.5,27 L27.5,27 Z" fill="#ff6fa5"/></g>',
    brush: '<rect x="21" y="3" width="6" height="24" rx="3" fill="#3b2547"/><rect x="19" y="25" width="10" height="5" fill="#cfd6df"/><path d="M18,30 L30,30 L31,44 Q24,47 17,44 Z" fill="#ffd54a"/><path d="M18.6,37 L29.4,37" stroke="#ff8fc4" stroke-width="3"/>',
    curler: '<rect x="3" y="19" width="15" height="10" rx="5" fill="#8b5cf6"/><rect x="17" y="20.5" width="26" height="7" rx="3.5" fill="#e3e6ee"/><path d="M17,18 L39,15.5 L40,18.5 L18,21 Z" fill="#9aa2b4"/><circle cx="7.5" cy="24" r="1.7" fill="#ffd54a"/><path d="M4,26 C0,33 6,40 12,42" stroke="#8b5cf6" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M22,22.5 L40,22.5" stroke="#fff" stroke-width="1.6" opacity=".75"/><path d="M28,13 q2,-4 0,-8 M35,12 q2,-4 0,-8" stroke="#c9d3e0" stroke-width="1.8" fill="none" stroke-linecap="round"/>',
    straightener: '<g transform="rotate(-25 24 24)"><rect x="13" y="4" width="9" height="40" rx="4.5" fill="#3fc7b0"/><rect x="25" y="4" width="9" height="40" rx="4.5" fill="#2aa995"/><rect x="15" y="6" width="5" height="18" rx="2.5" fill="#e8eef3"/><rect x="27" y="6" width="5" height="18" rx="2.5" fill="#e8eef3"/><circle cx="23.5" cy="40" r="3" fill="#ffd54a"/></g>',
    spray: '<rect x="13" y="16" width="20" height="28" rx="6" fill="#ffd54a"/><rect x="17" y="9" width="12" height="8" rx="2" fill="#c58bf2"/><rect x="27" y="10" width="7" height="4" rx="2" fill="#a26be6"/><rect x="15.5" y="20" width="4" height="20" rx="2" fill="#fff" opacity=".45"/><path d="M40,4 l1.4,3.6 3.6,1.4 -3.6,1.4 -1.4,3.6 -1.4,-3.6 -3.6,-1.4 3.6,-1.4 Z" fill="#ff6fa5"/><circle cx="40" cy="20" r="1.6" fill="#7cc8f6"/><circle cx="44" cy="14" r="1.2" fill="#ff9fc9"/>',
    mask: '<rect x="9" y="22" width="30" height="20" rx="6" fill="#fff" stroke="#d9e6dc" stroke-width="1.5"/><rect x="7" y="16" width="34" height="8" rx="3" fill="#69c27b"/><path d="M14,23 Q24,12 34,23 Z" fill="#a8e6a3"/><path d="M30,8 C36,6 40,10 38,14 C34,15 30,12 30,8 Z" fill="#55b86a"/><circle cx="18" cy="33" r="2.4" fill="#a8e6a3"/><circle cx="29" cy="31" r="1.6" fill="#a8e6a3"/>',
    sponge: '<rect x="7" y="13" width="34" height="23" rx="9" fill="#ffd56b"/><rect x="7" y="13" width="34" height="8" rx="4" fill="#ffe7a6"/><g fill="#e6b23f"><circle cx="15" cy="27" r="2.2"/><circle cx="24" cy="30" r="1.8"/><circle cx="33" cy="26" r="2.4"/><circle cx="20" cy="22" r="1.4"/><circle cx="29" cy="32" r="1.4"/></g><circle cx="38" cy="9" r="3.5" fill="#fff" stroke="#bfe0ff"/><circle cx="43" cy="16" r="2" fill="#fff" stroke="#bfe0ff"/>',
    foundation: '<rect x="14" y="15" width="20" height="29" rx="6" fill="#f2c9a0"/><rect x="18" y="5" width="12" height="11" rx="2" fill="#3b2547"/><rect x="16.5" y="19" width="4" height="20" rx="2" fill="#fff" opacity=".45"/><rect x="18" y="28" width="12" height="8" rx="2" fill="#fff" opacity=".75"/>',
    lens: '<rect x="4" y="14" width="40" height="22" rx="11" fill="#fff" stroke="#e7d8ef" stroke-width="1.5"/><circle cx="15" cy="25" r="8" fill="#7cc8f6"/><circle cx="15" cy="25" r="3.5" fill="#2a4a6a"/><circle cx="33" cy="25" r="8" fill="#b48ce8"/><circle cx="33" cy="25" r="3.5" fill="#4a2a6a"/><circle cx="12.5" cy="22.5" r="1.6" fill="#fff"/><circle cx="30.5" cy="22.5" r="1.6" fill="#fff"/>',
    palette: '<rect x="4" y="10" width="40" height="28" rx="7" fill="#3b2547"/><circle cx="13" cy="19" r="5" fill="#ff8fc4"/><circle cx="24" cy="19" r="5" fill="#c9a7ff"/><circle cx="35" cy="19" r="5" fill="#8fd0ff"/><circle cx="13" cy="30" r="5" fill="#ffd84d"/><circle cx="24" cy="30" r="5" fill="#7de3c5"/><circle cx="35" cy="30" r="5" fill="#ff7f6b"/>',
    liner: '<g transform="rotate(40 24 24)"><rect x="20" y="4" width="8" height="32" rx="3" fill="#3b2547"/><rect x="20" y="12" width="8" height="4" fill="#ffd54a"/><path d="M20,36 L28,36 L24,46 Z" fill="#1a1016"/></g>',
    mascara: '<g transform="rotate(-35 24 24)"><rect x="19" y="20" width="10" height="26" rx="4" fill="#ff6fa5"/><rect x="22.5" y="8" width="3" height="13" fill="#777"/><rect x="20" y="2" width="8" height="9" rx="3.5" fill="#222"/><path d="M19,4 L29,4 M19,7 L29,7 M19,10 L29,10" stroke="#555" stroke-width="1"/><rect x="21" y="23" width="3" height="18" rx="1.5" fill="#fff" opacity=".45"/></g>',
    blushbrush: '<g transform="rotate(-30 24 24)"><rect x="21" y="22" width="6" height="24" rx="3" fill="#c58bf2"/><rect x="20" y="17" width="8" height="7" rx="1" fill="#e2e6ec"/><ellipse cx="24" cy="10" rx="9" ry="10" fill="#f7a8c4"/><ellipse cx="21" cy="7" rx="3" ry="4" fill="#fff" opacity=".4"/></g>',
    lipstick: '<rect x="16" y="26" width="16" height="18" rx="3" fill="#ffd54a"/><rect x="18" y="18" width="12" height="9" fill="#e6b13a"/><path d="M19,18 L19,9 Q22,3 29,8 L29,18 Z" fill="#e0245e"/><rect x="20" y="10" width="2.5" height="7" rx="1.2" fill="#fff" opacity=".45"/><rect x="18" y="29" width="3" height="12" rx="1.5" fill="#fff" opacity=".5"/>',
    hilite: '<circle cx="24" cy="26" r="17" fill="#f4e3ff"/><circle cx="24" cy="26" r="17" fill="none" stroke="#c9a7ff" stroke-width="2"/><circle cx="24" cy="26" r="11" fill="#fff6e0"/><path d="M24,16 l2,6 6,2 -6,2 -2,6 -2,-6 -6,-2 6,-2 Z" fill="#ffd54a"/>',
    freckles: '<circle cx="24" cy="24" r="18" fill="#f2c9a0"/><g fill="#a0663f"><circle cx="16" cy="24" r="1.8"/><circle cx="20" cy="20" r="1.5"/><circle cx="21" cy="27" r="1.6"/><circle cx="28" cy="20" r="1.5"/><circle cx="32" cy="24" r="1.8"/><circle cx="27" cy="27" r="1.6"/><circle cx="24" cy="23" r="1.3"/></g><path d="M18,33 Q24,37 30,33" stroke="#c0605a" stroke-width="2" fill="none" stroke-linecap="round"/>',
    sticker: '<path d="M18,14 C14,6 2,8 5,18 C7,25 18,32 18,32 C18,32 29,25 31,18 C34,8 22,6 18,14 Z" fill="#ff4f8b"/><path d="M34,24 l3,7 7,1 -5,5 1,7 -6,-3.5 -6,3.5 1,-7 -5,-5 7,-1 Z" fill="#ffd54a"/><circle cx="12" cy="13" r="2.5" fill="#fff" opacity=".7"/>',
  };
  A.icon = k => `<svg viewBox="0 0 48 48">${A.ICON[k] || ''}</svg>`;

  /* ---------- hanging shower (salon page) ---------- */
  A.showerHang = () => `<svg viewBox="0 0 100 200" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="chrH" x1="0" x2="1"><stop offset="0" stop-color="#8f9bb0"/><stop offset=".45" stop-color="#f6f8fc"/><stop offset="1" stop-color="#7f8ca3"/></linearGradient><linearGradient id="chrV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4f7fb"/><stop offset="1" stop-color="#9aa6b8"/></linearGradient></defs>
    <rect x="63" y="-4" width="11" height="58" fill="url(#chrH)"/><path d="M68.5,50 C68.5,68 60,76 48,78" stroke="url(#chrH)" stroke-width="11" fill="none" stroke-linecap="round"/>
    <path d="M14,104 C16,86 32,74 48,74 C64,74 80,86 82,104 Z" fill="url(#chrV)"/><path d="M24,92 C30,82 40,78 48,78" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/>
    <ellipse cx="48" cy="104" rx="34" ry="8" fill="#c6cfdc"/><ellipse cx="48" cy="104" rx="28" ry="5" fill="#8798b0"/>
    <g fill="#5d6f88">${[[34, 103], [42, 105], [50, 105], [58, 103], [38, 101], [46, 102], [54, 101], [62, 102]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.3"/>`).join('')}</g>
    <g fill="#9fd8ff" stroke="#5fb8ff" stroke-width="1">${[[34, 0], [48, .5], [62, 1], [41, .9], [55, .3]].map(([x, d]) => `<path class="drip" style="animation-delay:${d}s" d="M${x},112 C${x + 3.5},118 ${x + 3.5},122 ${x},124 C${x - 3.5},122 ${x - 3.5},118 ${x},112 Z"/>`).join('')}</g></svg>`;

  /* ---------- backgrounds (400 x 500) ---------- */
  const cloud = (x, y, s = 1, op = .9) => `<g transform="translate(${x} ${y}) scale(${s})" fill="#fff" opacity="${op}"><circle cx="0" cy="0" r="18"/><circle cx="22" cy="-10" r="24"/><circle cx="48" cy="0" r="18"/><rect x="0" y="0" width="48" height="18" rx="9"/></g>`;
  A.BG = {};
  A.BG.home = () => `<svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="hSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffc9e6"/><stop offset=".5" stop-color="#e5c4ff"/><stop offset="1" stop-color="#b9a2ff"/></linearGradient><radialGradient id="hSpot"><stop offset="0" stop-color="#fff" stop-opacity=".85"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>
    <rect width="400" height="500" fill="url(#hSky)"/><circle cx="200" cy="270" r="200" fill="url(#hSpot)"/>
    ${cloud(30, 140, 1.1)}${cloud(300, 100, .9)}${cloud(320, 330, 1, .7)}${cloud(10, 360, .8, .7)}
    <g fill="#fff">${[[60, 60, 8], [350, 200, 6], [40, 260, 5], [370, 420, 7], [120, 30, 5], [280, 40, 6]].map(([x, y, r]) => `<path class="twinkle" d="${A.spark4(x, y, r)}"/>`).join('')}</g>
    <ellipse cx="200" cy="478" rx="160" ry="26" fill="#fff" opacity=".5"/><ellipse cx="200" cy="472" rx="122" ry="16" fill="#ffc6e4"/><ellipse cx="200" cy="468" rx="122" ry="14" fill="#ffe0f0"/></svg>`;

  A.BG.salon = () => {
    const bottles = (x0, y) => [['#ff8fc4', 13, 30], ['#8fd0ff', 11, 24], ['#ffd54a', 10, 34], ['#c9a7ff', 13, 26]].map(([c, w, h], i) => { const x = x0 + i * 14; return `<rect x="${x}" y="${y - h}" width="${w}" height="${h}" rx="4" fill="${c}"/><rect x="${x + 2}" y="${y - h - 6}" width="${w - 4}" height="7" rx="2" fill="${sh(c, -22)}"/><rect x="${x + 2}" y="${y - h + 5}" width="3" height="${h - 10}" rx="1.5" fill="#fff" opacity=".5"/>`; }).join('');
    const sconce = x => `<circle cx="${x}" cy="140" r="58" fill="url(#sGlow)"/><path d="M${x - 8},152 L${x + 8},152 L${x + 5},170 L${x - 5},170 Z" fill="url(#sGold)"/><path d="M${x - 16},152 L${x + 16},152 L${x + 10},122 L${x - 10},122 Z" fill="#fff8e6"/>`;
    return `<svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="sWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe9f4"/><stop offset="1" stop-color="#f9d4ea"/></linearGradient><pattern id="sStr" width="36" height="36" patternUnits="userSpaceOnUse"><rect width="18" height="36" fill="#fff" opacity=".42"/><circle cx="27" cy="18" r="2" fill="#fff" opacity=".8"/></pattern><radialGradient id="sGlass" cx=".38" cy=".3" r=".85"><stop offset="0" stop-color="#ffffff"/><stop offset=".55" stop-color="#eef5ff"/><stop offset="1" stop-color="#cddff4"/></radialGradient><linearGradient id="sGold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff0b5"/><stop offset=".45" stop-color="#e3b04b"/><stop offset=".7" stop-color="#ffe49a"/><stop offset="1" stop-color="#c9902e"/></linearGradient><linearGradient id="sChair" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff9ccb"/><stop offset="1" stop-color="#e0558f"/></linearGradient><radialGradient id="sGlow"><stop offset="0" stop-color="#fff3c4" stop-opacity=".95"/><stop offset="1" stop-color="#fff3c4" stop-opacity="0"/></radialGradient></defs>
    <rect width="400" height="500" fill="url(#sWall)"/><rect width="400" height="380" fill="url(#sStr)"/><rect width="400" height="14" fill="#fff" opacity=".8"/>
    <rect y="378" width="400" height="122" fill="#f6b9d6"/><rect y="372" width="400" height="10" fill="#fff"/>
    <g fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="3"><rect x="14" y="396" width="104" height="90" rx="10"/><rect x="148" y="396" width="104" height="90" rx="10"/><rect x="282" y="396" width="104" height="90" rx="10"/></g>
    ${sconce(30)}${sconce(370)}
    <ellipse cx="200" cy="200" rx="138" ry="172" fill="url(#sGold)"/><ellipse cx="200" cy="200" rx="124" ry="158" fill="url(#sGlass)"/>
    <g stroke="#fff" stroke-linecap="round" opacity=".65"><path d="M112,130 L172,70" stroke-width="14"/><path d="M104,184 L196,92" stroke-width="7"/><path d="M262,320 L300,282" stroke-width="10"/></g>
    <path d="M164,36 Q200,4 236,36 Q218,28 200,44 Q182,28 164,36 Z" fill="url(#sGold)"/><circle cx="200" cy="24" r="7" fill="#ff8fc4"/>
    <rect x="-4" y="262" width="64" height="7" rx="3" fill="#fff"/>${bottles(2, 262)}<rect x="340" y="262" width="64" height="7" rx="3" fill="#fff"/>${bottles(344, 262)}
    <g transform="translate(366 300)"><path d="M-22,82 L22,82 L16,118 L-16,118 Z" fill="#ff9ccb"/><g fill="#6cc887"><ellipse cx="-12" cy="54" rx="9" ry="26" transform="rotate(-25 -12 54)"/><ellipse cx="12" cy="52" rx="9" ry="28" transform="rotate(22 12 52)"/><ellipse cx="0" cy="44" rx="9" ry="32"/></g><g fill="#4fb070"><ellipse cx="-20" cy="66" rx="7" ry="18" transform="rotate(-50 -20 66)"/><ellipse cx="20" cy="66" rx="7" ry="18" transform="rotate(50 20 66)"/></g></g>
    <path d="M100,500 L100,370 C100,334 140,318 200,318 C260,318 300,334 300,370 L300,500 Z" fill="url(#sChair)"/><path d="M114,500 L114,376 C114,346 148,334 200,334 C252,334 286,346 286,376 L286,500 Z" fill="#ff8cc0" opacity=".55"/>
    <g fill="#c8417c" opacity=".5">${[[150, 384], [200, 374], [250, 384], [175, 424], [225, 424], [150, 464], [200, 464], [250, 464]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4"/>`).join('')}</g></svg>`;
  };

  A.BG.makeup = () => {
    let bulbs = '';
    for (let x = 84; x <= 316; x += 29) bulbs += `<g transform="translate(${x} 34)"><circle r="17" fill="url(#mBulb)"/><circle r="6.5" fill="#fffbea"/></g>`;
    for (let y = 76; y <= 344; y += 38) bulbs += `<g transform="translate(58 ${y})"><circle r="17" fill="url(#mBulb)"/><circle r="6.5" fill="#fffbea"/></g><g transform="translate(342 ${y})"><circle r="17" fill="url(#mBulb)"/><circle r="6.5" fill="#fffbea"/></g>`;
    return `<svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="mWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff1e6"/><stop offset="1" stop-color="#ffdfe9"/></linearGradient><pattern id="mHearts" width="44" height="44" patternUnits="userSpaceOnUse"><path d="${A.heart(22, 22, 6)}" fill="#ffc2d9" opacity=".55"/></pattern><linearGradient id="mGlass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".6" stop-color="#f4f0ff"/><stop offset="1" stop-color="#ddd6f5"/></linearGradient><radialGradient id="mBulb"><stop offset="0" stop-color="#fffbe8"/><stop offset=".45" stop-color="#ffe9a8" stop-opacity=".9"/><stop offset="1" stop-color="#ffe9a8" stop-opacity="0"/></radialGradient><linearGradient id="mTable" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#f3dbe8"/></linearGradient><linearGradient id="mCurt" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#d94c88"/><stop offset=".5" stop-color="#ff8cc0"/><stop offset="1" stop-color="#d94c88"/></linearGradient></defs>
    <rect width="400" height="500" fill="url(#mWall)"/><rect width="400" height="500" fill="url(#mHearts)"/>
    <rect x="52" y="22" width="296" height="356" rx="40" fill="#fff"/><rect x="68" y="38" width="264" height="324" rx="30" fill="url(#mGlass)"/>
    <g stroke="#fff" stroke-linecap="round" opacity=".75"><path d="M92,124 L152,64" stroke-width="12"/><path d="M92,172 L172,92" stroke-width="6"/></g>${bulbs}
    <path d="M0,0 L44,0 C36,120 54,260 28,500 L0,500 Z" fill="url(#mCurt)"/><path d="M400,0 L356,0 C364,120 346,260 372,500 L400,500 Z" fill="url(#mCurt)"/>
    <rect x="0" y="392" width="400" height="108" fill="url(#mTable)"/><rect x="0" y="388" width="400" height="7" fill="#f2c14e"/>
    <g transform="translate(46 344)"><rect x="0" y="12" width="30" height="36" rx="8" fill="#ffb3d1" opacity=".9"/><rect x="9" y="0" width="12" height="14" rx="3" fill="#f2c14e"/><rect x="4" y="18" width="5" height="24" rx="2.5" fill="#fff" opacity=".55"/></g>
    <g transform="translate(330 330)"><path d="M0,24 L28,24 L25,62 L3,62 Z" fill="#c9a7ff"/><g stroke-linecap="round" stroke-width="4"><path d="M8,24 L4,0" stroke="#3b2547"/><path d="M14,24 L15,-4" stroke="#ff8fc4"/><path d="M20,24 L26,2" stroke="#3b2547"/></g><circle cx="4" cy="0" r="4" fill="#f7a8c4"/><circle cx="26" cy="2" r="4" fill="#f2c9a0"/></g>
    <g transform="translate(92 372)"><rect x="0" y="0" width="8" height="20" rx="2" fill="#f2c14e"/><path d="M1,0 L1,-9 Q4,-14 7,-8 L7,0 Z" fill="#e0245e"/></g><g transform="translate(296 370)"><circle cx="0" cy="12" r="11" fill="#fff" stroke="#f2c14e" stroke-width="2"/><circle cx="0" cy="12" r="6" fill="#ffc2d9"/></g></svg>`;
  };

  A.BG.dress = () => {
    const garment = (x, c) => `<path d="M${x},106 q0,-8 6,-8" stroke="#a99ac8" fill="none" stroke-width="2"/><path d="M${x - 12},114 L${x + 12},114 L${x},106 Z" fill="none" stroke="#a99ac8" stroke-width="2"/><path d="M${x - 9},114 L${x + 9},114 L${x + 16},${190} Q${x},${196} ${x - 16},${190} Z" fill="${c}"/><path d="M${x - 9},114 L${x + 9},114 L${x + 16},${190} Q${x},${196} ${x - 16},${190} Z" fill="url(#dFab)"/>`;
    const lights = Array.from({ length: 11 }, (_, i) => { const x = 10 + i * 38, y = 24 + Math.sin(i * 1.3) * 10 + (i % 2) * 8; const c = ['#ff8fc4', '#ffd54a', '#8fd0ff', '#c9a7ff', '#7de3c5'][i % 5]; return `<circle cx="${x}" cy="${y}" r="9" fill="${c}" opacity=".35"/><circle cx="${x}" cy="${y}" r="4" fill="${c}"/>`; }).join('');
    return `<svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="dWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f1e6ff"/><stop offset="1" stop-color="#e1d0ff"/></linearGradient><linearGradient id="dSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fd8ff"/><stop offset="1" stop-color="#ffe0f0"/></linearGradient><linearGradient id="dFloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4d7c0"/><stop offset="1" stop-color="#e2b796"/></linearGradient><radialGradient id="dPod" cx=".5" cy=".4" r=".6"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#ffc6e4"/></radialGradient><linearGradient id="dFab" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".15"/><stop offset=".5" stop-color="#fff" stop-opacity=".15"/><stop offset="1" stop-color="#000" stop-opacity=".15"/></linearGradient><linearGradient id="dCurt" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#b98cf0"/><stop offset=".5" stop-color="#d9bcff"/><stop offset="1" stop-color="#b98cf0"/></linearGradient></defs>
    <rect width="400" height="500" fill="url(#dWall)"/>
    <path d="M118,340 L118,124 C118,62 158,30 200,30 C242,30 282,62 282,124 L282,340 Z" fill="#fff"/><path d="M130,330 L130,126 C130,72 164,42 200,42 C236,42 270,72 270,126 L270,330 Z" fill="url(#dSky)"/>
    ${cloud(150, 120, .8)}${cloud(206, 190, .65, .8)}<g stroke="#fff" stroke-width="5"><path d="M200,42 L200,330"/><path d="M130,190 L270,190"/></g>
    <path d="M104,20 C130,90 120,200 112,346 L96,346 C100,200 92,90 82,20 Z" fill="url(#dCurt)"/><path d="M296,20 C270,90 280,200 288,346 L304,346 C300,200 308,90 318,20 Z" fill="url(#dCurt)"/>
    <rect x="0" y="92" width="96" height="6" rx="3" fill="#c9b6e8"/>${garment(18, '#ff8fc4')}${garment(44, '#ffd54a')}${garment(70, '#8fd0ff')}
    <rect x="304" y="92" width="96" height="6" rx="3" fill="#c9b6e8"/>${garment(330, '#c9a7ff')}${garment(356, '#7de3c5')}${garment(382, '#ff7f6b')}
    <rect x="0" y="262" width="92" height="8" rx="3" fill="#fff"/><g transform="translate(14 246)"><path d="M0,16 C0,6 10,0 16,8 L24,8 L24,16 Z" fill="#ff4f9a"/><path d="M34,16 C34,6 44,0 50,8 L58,8 L58,16 Z" fill="#ff4f9a"/></g>
    <rect x="308" y="262" width="92" height="8" rx="3" fill="#fff"/><g transform="translate(320 238)"><rect x="0" y="6" width="26" height="18" rx="4" fill="#ffd54a"/><path d="M5,6 Q13,-6 21,6" stroke="#ffd54a" stroke-width="3" fill="none"/><rect x="36" y="4" width="28" height="20" rx="4" fill="#c9a7ff"/></g>
    <rect y="372" width="400" height="128" fill="url(#dFloor)"/><g stroke="#d9a982" stroke-width="2" opacity=".55"><path d="M0,410 L400,410 M0,452 L400,452 M80,372 L70,410 M240,372 L236,410 M150,410 L144,452 M320,410 L318,452"/></g>
    <ellipse cx="200" cy="470" rx="160" ry="30" fill="#ffd1ea" opacity=".75"/><ellipse cx="200" cy="462" rx="120" ry="22" fill="url(#dPod)"/><ellipse cx="200" cy="462" rx="120" ry="22" fill="none" stroke="#f2c14e" stroke-width="3"/>
    <path d="M0,20 Q100,52 200,26 Q300,52 400,20" stroke="#bfa6e8" stroke-width="1.5" fill="none"/>${lights}</svg>`;
  };

  A.BG.runway = () => {
    const crowd = side => Array.from({ length: 14 }, (_, i) => { const row = Math.floor(i / 5), col = i % 5; const x = side < 0 ? 8 + col * 26 + row * 10 : 392 - col * 26 - row * 10; const y = 360 + row * 50; const r = 13 + row * 2; return `<circle cx="${x}" cy="${y}" r="${r}"/><rect x="${x - r * 1.4}" y="${y + r * .7}" width="${r * 2.8}" height="${r * 2.2}" rx="${r}"/>`; }).join('');
    return `<svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="rBg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b1046"/><stop offset="1" stop-color="#120720"/></linearGradient><linearGradient id="rBeam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><linearGradient id="rWalk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff7fbf"/><stop offset="1" stop-color="#b92a72"/></linearGradient><radialGradient id="rStar"><stop offset="0" stop-color="#ffe9a8"/><stop offset="1" stop-color="#ffe9a8" stop-opacity="0"/></radialGradient></defs>
    <rect width="400" height="500" fill="url(#rBg)"/><rect x="88" y="40" width="224" height="150" rx="18" fill="#3a1760" stroke="#ff8fc4" stroke-width="3"/>
    <g fill="#ffe9a8">${Array.from({ length: 12 }, (_, i) => `<circle class="twinkle" cx="${96 + i * 19}" cy="48" r="3"/><circle class="twinkle" cx="${96 + i * 19}" cy="182" r="3"/>`).join('')}</g>
    <circle cx="200" cy="115" r="62" fill="url(#rStar)"/><path d="${A.star(200, 112, 30, 13)}" fill="#ffd54a"/>
    <path d="M160,190 L240,190 L384,500 L16,500 Z" fill="url(#rWalk)"/><path d="M160,190 L16,500 M240,190 L384,500" stroke="#ffe9a8" stroke-width="4" stroke-dasharray="2 14" stroke-linecap="round"/>
    <path d="M30,0 L86,0 L240,500 L120,500 Z" fill="url(#rBeam)" opacity=".45"/><path d="M370,0 L314,0 L160,500 L280,500 Z" fill="url(#rBeam)" opacity=".45"/>
    <g fill="#0b0414">${crowd(-1)}${crowd(1)}</g></svg>`;
  };

  return A;
})();
