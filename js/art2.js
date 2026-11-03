'use strict';
/* =========================================================
   ART 2 — high-detail overrides: face, eyes, lips, body,
   rooms, table props and tool icons.
   ========================================================= */
(() => {
  const A = ART, sh = (c, p) => U.shade(c, p), mix = U.mix;

  /* ---------------- face ---------------- */
  A.LIPS = 'M176,284 C182,281 188,277 194,277 C197,277 199,279 200,280 C201,279 203,277 206,277 C212,277 218,281 224,284 C219,296 210,303 200,303 C190,303 181,296 176,284 Z';
  const UPPER = 'M176,284 C182,281 188,277 194,277 C197,277 199,279 200,280 C201,279 203,277 206,277 C212,277 218,281 224,284 C216,286.5 208,287.5 200,287.5 C192,287.5 184,286.5 176,284 Z';
  const LOWER = 'M177,285.5 C185,288.5 193,289.5 200,289.5 C207,289.5 215,288.5 223,285.5 C219,296 210,303 200,303 C190,303 181,296 177,285.5 Z';

  function lash(bx, by, ang, len, w, c) {
    const a = ang * Math.PI / 180, tx = bx + Math.cos(a) * len, ty = by + Math.sin(a) * len;
    const nx = -Math.sin(a), ny = Math.cos(a);
    const cx = bx + Math.cos(a) * len * .55 + nx * len * .28, cy = by + Math.sin(a) * len * .55 + ny * len * .28;
    return `<path d="M${(bx - nx * w).toFixed(1)},${(by - ny * w).toFixed(1)} Q${cx.toFixed(1)},${cy.toFixed(1)} ${tx.toFixed(1)},${ty.toFixed(1)} Q${(cx + nx * w * .6).toFixed(1)},${(cy + ny * w * .6).toFixed(1)} ${(bx + nx * w).toFixed(1)},${(by + ny * w).toFixed(1)} Z" fill="${c}"/>`;
  }

  A.eye = (mk, skin = '#f8d1b0') => {
    const lc = '#23111b', crease = sh(skin, -28);
    let e = '';
    e += `<path d="${A.EYE}" fill="url(#scleraGrad)"/>`;
    e += `<g clip-path="url(#eyeClip)">`;
    e += `<circle cx="161" cy="218" r="16.8" fill="url(#irisGrad)"/>`;
    let str = '';
    for (let i = 0; i < 18; i++) { const a = i * 20 * Math.PI / 180 + .1, r1 = 8.2, r2 = 15.2 - (i % 3); str += `M${(161 + Math.cos(a) * r1).toFixed(1)},${(218 + Math.sin(a) * r1).toFixed(1)} L${(161 + Math.cos(a) * r2).toFixed(1)},${(218 + Math.sin(a) * r2).toFixed(1)} `; }
    e += `<path d="${str}" stroke="#000" stroke-opacity=".2" stroke-width=".9" stroke-linecap="round"/>`;
    let str2 = '';
    for (let i = 0; i < 12; i++) { const a = (i * 30 + 12) * Math.PI / 180, r1 = 9, r2 = 13.5; str2 += `M${(161 + Math.cos(a) * r1).toFixed(1)},${(218 + Math.sin(a) * r1).toFixed(1)} L${(161 + Math.cos(a) * r2).toFixed(1)},${(218 + Math.sin(a) * r2).toFixed(1)} `; }
    e += `<path d="${str2}" stroke="#fff" stroke-opacity=".22" stroke-width=".8" stroke-linecap="round"/>`;
    e += `<circle cx="161" cy="218" r="16.3" fill="none" stroke="#1a0d14" stroke-opacity=".6" stroke-width="2.4"/>`;
    e += `<circle cx="161" cy="218" r="9.6" fill="none" stroke="#fff" stroke-opacity=".18" stroke-width="1.6"/>`;
    e += `<circle cx="161" cy="218" r="7.6" fill="url(#pupilGrad)"/>`;
    e += `<path d="${A.EYE}" fill="url(#eyeTop)"/>`;
    e += `<ellipse cx="154" cy="210" rx="5.6" ry="4.3" transform="rotate(-28 154 210)" fill="#fff"/>`;
    e += `<circle cx="168.5" cy="225.5" r="2.4" fill="#fff" opacity=".9"/><circle cx="151" cy="223" r="1.2" fill="#fff" opacity=".7"/>`;
    e += `</g>`;
    e += `<path d="M189,213 C185,200 175,192.5 162.5,192 C150,191.5 139,198 132.5,210 C130.5,213 128,214 125,214 C129,216.5 132,217.5 134,219 C139,205 149,198 162,198 C174,198 182,204 186.5,215 Z" fill="${lc}"/>`;
    e += `<path d="M186,212 C182,203 174,197 163,196.5" stroke="#5a3a48" stroke-width="1" fill="none" opacity=".5" stroke-linecap="round"/>`;
    e += lash(132.5, 211.2, 196, 13.5, 1.25, lc) + lash(135.1, 207.1, 201, 14.6, 1.22, lc) + lash(138.0, 203.5, 206, 12.5, 1.19, lc) + lash(141.2, 200.4, 211, 13.6, 1.16, lc) + lash(144.8, 197.8, 216, 11.5, 1.13, lc) + lash(148.6, 195.8, 221, 12.6, 1.10, lc) + lash(152.7, 194.3, 226, 10.5, 1.07, lc) + lash(156.9, 193.4, 231, 11.6, 1.04, lc) + lash(161.4, 193.2, 235, 9.5, 1.01, lc) + lash(165.8, 193.5, 240, 10.6, 0.98, lc) + lash(169.9, 194.4, 245, 8.5, 0.95, lc) + lash(173.8, 195.9, 250, 9.6, 0.92, lc) + lash(177.4, 197.9, 255, 7.5, 0.89, lc) + lash(180.6, 200.4, 260, 8.6, 0.86, lc) + lash(183.5, 203.5, 265, 6.5, 0.83, lc) + lash(185.9, 207.1, 270, 7.6, 0.80, lc);
    e += lash(140.0, 233.5, 128, 6.2, 0.60, lc) + lash(145.0, 236.0, 122, 6.9, 0.60, lc) + lash(150.0, 238.1, 116, 5.5, 0.60, lc) + lash(155.0, 239.5, 109, 6.2, 0.60, lc) + lash(160.0, 240.0, 103, 4.9, 0.60, lc) + lash(165.0, 239.5, 97, 5.6, 0.60, lc) + lash(170.0, 238.1, 90, 4.2, 0.60, lc) + lash(175.0, 236.0, 84, 4.9, 0.60, lc) + lash(180.0, 233.5, 78, 3.6, 0.60, lc);
    if (mk && mk.mascara) e += lash(131, 216, 194, 17, 1.8, mk.mascara) + lash(134, 208, 207, 18, 1.8, mk.mascara) + lash(139, 201, 222, 17, 1.7, mk.mascara) + lash(146, 196, 238, 15, 1.6, mk.mascara) + lash(154, 193, 252, 12, 1.4, mk.mascara);
    return e;
  };

  A.LIPS_UP = UPPER; A.LIPS_LO = LOWER;
  A.EYE_TF = 'translate(150 216) scale(1.18) translate(-161 -217)'; A.eyeT = (x, y) => [150 + (x - 161) * 1.18, 216 + (y - 217) * 1.18];
  A.BROW_TF = 'translate(152 176) scale(1.08) translate(-155 -176)';
  /* lash geometry shared with the mascara brush: [baseX, baseY, angle, length, width] for the left eye */
  A.LASHES = [[131, 216, 194, 13, 1.5], [133, 212, 200, 13, 1.5], [134.5, 208.5, 207, 12.5, 1.4], [136, 205, 214, 13.5, 1.5], [138.5, 202, 221, 12.5, 1.4], [141, 199, 228, 12.5, 1.4], [144.5, 197, 235, 11.5, 1.3], [148, 195, 242, 10.5, 1.3], [152, 194, 249, 9.5, 1.2], [156, 193, 256, 8.5, 1.1], [161, 192.6, 262, 7.5, 1], [167, 193.2, 268, 6.6, .9], [173, 195, 274, 6, .85], [179, 198.5, 280, 5.2, .8]];
  A.lashPts = (bx, by, ang, len, w) => {
    const a = ang * Math.PI / 180, tx = bx + Math.cos(a) * len, ty = by + Math.sin(a) * len, nx = -Math.sin(a), ny = Math.cos(a);
    const cx = bx + Math.cos(a) * len * .55 + nx * len * .28, cy = by + Math.sin(a) * len * .55 + ny * len * .28;
    return [[bx - nx * w, by - ny * w], [cx, cy], [tx, ty], [cx + nx * w * .6, cy + ny * w * .6], [bx + nx * w, by + ny * w]];
  };
  /* closed eye: lid line with lashes pointing down, no eyeball (skin + make-up show through) */
  A.eyeShut = (skin = '#f8d1b0') => {
    const lc = '#23111b', crease = sh(skin, -30);
    let e = '';
    e += `<path d="M135,209 C145,199 168,196 188,207" stroke="${crease}" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".42"/>`;
    e += `<path d="M129,217 C139,228 153,232.5 163,232.5 C175,232.5 185,227 191.5,217.5 C186.5,229.5 175.5,236 163,236 C152,236 139,231.5 129,217 Z" fill="${lc}"/>`;
    const L = [[131, 220, 150, 11, 1.4], [135, 225, 138, 11.5, 1.4], [141, 229.5, 125, 10.5, 1.3], [148, 232.5, 113, 9.5, 1.2], [155, 234.5, 104, 8.5, 1.1], [163, 235.5, 97, 7.5, 1], [171, 234.5, 90, 6.5, .9], [179, 232, 84, 5.5, .8]];
    e += L.map(([x, y, a, l, w]) => lash(x, y, a, l, w, lc)).join('');
    return e;
  };

  A.mouth = (L) => {
    const nat = mix(L.skin, '#d9627a', .52), up = sh(nat, -12), lo = nat, line = sh(nat, -42);
    if (L.mood === 'sad' && !L.lipsPainted) {
      return `<path d="M180,296 C188,284 212,284 220,296 C212,291 188,291 180,296 Z" fill="${up}"/><path d="M180,296 C188,284 212,284 220,296" stroke="${line}" stroke-width="2" fill="none" stroke-linecap="round"/>`;
    }
    if (L.mood === 'meh' && !L.lipsPainted) {
      return `<path d="M184,289 C192,287 208,291 216,288" stroke="${line}" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M186,292 C194,293 206,294 214,292" stroke="${lo}" stroke-width="3" fill="none" stroke-linecap="round" opacity=".7"/>`;
    }
    if (L.happy) {
      return `<path d="M176,281 C186,284 214,284 224,281 C221,300 211,310 200,310 C189,310 179,300 176,281 Z" fill="#7a2236"/><path d="M180,283 C190,286 210,286 220,283 L218,291 C209,293 191,293 182,291 Z" fill="#fff"/><path d="M187,302 C193,297 207,297 213,302 C208,308 192,308 187,302 Z" fill="#ef6f86"/><path d="M176,281 C186,284 214,284 224,281 C221,300 211,310 200,310 C189,310 179,300 176,281 Z" fill="none" stroke="${up}" stroke-width="3.5" stroke-linejoin="round"/>`;
    }
    return `<path d="${LOWER}" fill="${lo}"/><path d="${LOWER}" fill="url(#lipShade)"/><path d="${UPPER}" fill="${up}"/><path d="${UPPER}" fill="url(#lipShade)" opacity=".6"/>`
      + `<path d="M177,285.5 C186,288.5 214,288.5 223,285.5" stroke="${line}" stroke-width="1.4" fill="none" stroke-linecap="round"/>`
      + `<path d="M193,280 C196,278.5 198,280 200,281 C202,280 204,278.5 207,280" stroke="#fff" stroke-width="1" fill="none" opacity=".35" stroke-linecap="round"/>`
      + `<ellipse cx="204" cy="294.6" rx="8" ry="3" fill="#fff" opacity=".5"/><ellipse cx="190" cy="294.6" rx="4" ry="1.6" fill="#fff" opacity=".3"/><ellipse cx="207" cy="282.4" rx="3.4" ry="1.1" fill="#fff" opacity=".35"/><ellipse cx="193" cy="282.4" rx="3" ry="1" fill="#fff" opacity=".25"/>`
      + `<circle cx="175.5" cy="284.5" r="1.4" fill="${line}" opacity=".5"/><circle cx="224.5" cy="284.5" r="1.4" fill="${line}" opacity=".5"/>`;
  };

  A.headBase = (L) => {
    const s = L.skin, d = sh(s, -18), dd = sh(s, -30), warm = mix(s, '#e8806e', .35);
    const ear = x => { const m = x < 200 ? 1 : -1; return `<ellipse cx="${x}" cy="224" rx="14.5" ry="21" fill="${s}"/><ellipse cx="${x}" cy="224" rx="14.5" ry="21" fill="url(#limbShade)"/><path d="M${x + 6 * m},210 C${x - 4 * m},212 ${x - 5 * m},232 ${x + 3 * m},238" stroke="${dd}" stroke-width="2.2" fill="none" opacity=".45" stroke-linecap="round"/><path d="M${x + 2 * m},216 C${x - 2 * m},220 ${x - 1 * m},228 ${x + 3 * m},230" stroke="${warm}" stroke-width="3" fill="none" opacity=".5" stroke-linecap="round"/>`; };
    return ear(112) + ear(288)
      + `<path d="${A.FACE}" fill="${s}"/>`
      + `<g filter="url(#blur4)"><ellipse cx="148" cy="260" rx="30" ry="17" fill="#ff7f8f" opacity=".2"/><ellipse cx="252" cy="260" rx="30" ry="17" fill="#ff7f8f" opacity=".2"/></g>`;
  };

  /* iris gradient lives next to the eyes (own id per colour) so a new lens colour repaints at once */
  const irisId = c => 'iris_' + String(c || '#7a4a2a').replace(/[^a-z0-9]/gi, '');
  const irisDefs = c => { c = c || '#7a4a2a'; return `<defs><radialGradient id="${irisId(c)}" cx=".5" cy=".42" r=".6"><stop offset="0" stop-color="${sh(c, 42)}"/><stop offset=".55" stop-color="${c}"/><stop offset="1" stop-color="${sh(c, -45)}"/></radialGradient></defs>`; };

  A.headFeat = (L) => {
    const s = L.skin, dd = sh(s, -30);
    const bc = U.luma(L.hairColor) > .7 ? sh(L.hairColor, -45) : sh(L.hairColor, -14);
    const brow = m => {
      const P = 'M124,184 C132,171 150,164.5 172,166.5 C178,167 182,168.6 183.5,171 C176,170 160,169.5 148,172.5 C138,175 131,180 127,186 C126,187.2 123.6,186.4 124,184 Z';
      let strokes = '';
      for (let i = 0; i < 9; i++) { const x = 132 + i * 5.5, y = 180 - Math.sin(i / 8 * Math.PI) * 9 - i * .4; strokes += `M${x.toFixed(1)},${(y + 3).toFixed(1)} L${(x + 4).toFixed(1)},${(y - 2.5).toFixed(1)} `; }
      return `<path d="${P}" fill="${bc}"/><path d="${P}" fill="url(#browGrad)"/><path d="${strokes}" stroke="${sh(bc, -25)}" stroke-width=".9" stroke-linecap="round" opacity=".55"/>`;
    };
    return A.mirror(`<g transform="${A.BROW_TF}">${brow()}</g>`)
      + irisDefs(L.eye) + `<g id="eyes">${A.mirror(`<g transform="${A.EYE_TF}">${A.eye({}, s)}</g>`).replace(/url\(#irisGrad\)/g, `url(#${irisId(L.eye)})`)}</g><g id="eyes-shut" style="display:none">${A.mirror(`<g transform="${A.EYE_TF}">${A.eyeShut(s)}</g>`)}</g>`
      + `<g filter="url(#blur2)"><path d="M193.5,214 C191,228 189.5,240 189,249 C191.5,247 193,236 195.5,216 Z" fill="${dd}" opacity=".22"/><path d="M187,250 C188,256 193,259 200,259 C207,259 212,256 213,250 C209,254 204,255.5 200,255.5 C196,255.5 191,254 187,250 Z" fill="${dd}" opacity=".28"/></g>`
      + `<ellipse cx="200" cy="250.5" rx="6" ry="4.6" fill="${sh(s, 6)}"/><ellipse cx="201.5" cy="248.6" rx="2.8" ry="1.9" fill="#fff" opacity=".5"/><ellipse cx="202" cy="232" rx="1.6" ry="8" fill="#fff" opacity=".2" filter="url(#blur2)"/>`
      + `<ellipse cx="195" cy="255.2" rx="2.3" ry="1.3" fill="${sh(s, -42)}" opacity=".55" transform="rotate(18 195 255.2)"/><ellipse cx="205" cy="255.2" rx="2.3" ry="1.3" fill="${sh(s, -42)}" opacity=".55" transform="rotate(-18 205 255.2)"/>`
      + `<path d="M192,253 C193.5,256 195.5,256.5 197,255 M208,253 C206.5,256 204.5,256.5 203,255" stroke="${sh(s, -34)}" stroke-width="1.3" fill="none" stroke-linecap="round" opacity=".45"/>`
      + A.mouth(L);
  };
})();

/* =========================================================
   ROOMS (portrait 400 x 860)
   ========================================================= */
(() => {
  const A = ART, sh = (c, p) => U.shade(c, p);
  const VB = 'viewBox="0 0 400 860" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"';
  const gold = id => `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff3c2"/><stop offset=".3" stop-color="#e9b84f"/><stop offset=".5" stop-color="#fff0b0"/><stop offset=".75" stop-color="#c88d2a"/><stop offset="1" stop-color="#f3cf72"/></linearGradient>`;
  const chrome = id => `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8d98ab"/><stop offset=".35" stop-color="#f7f9fc"/><stop offset=".6" stop-color="#b9c3d2"/><stop offset="1" stop-color="#7c879b"/></linearGradient>`;
  const glow = (id, c) => `<radialGradient id="${id}"><stop offset="0" stop-color="${c}" stop-opacity=".9"/><stop offset=".4" stop-color="${c}" stop-opacity=".35"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`;
  const spark = (x, y, r, c = '#fff', cls = 'twinkle') => `<path class="${cls}" d="${A.spark4(x, y, r)}" fill="${c}"/>`;

  /* --- product helpers (salon & vanity props) --- */
  const bottle = (x, y, w, h, c, cap, lbl) => `<g><ellipse cx="${x + w / 2}" cy="${y + 1}" rx="${w * .6}" ry="2.5" fill="#000" opacity=".12"/>
    <rect x="${x}" y="${y - h}" width="${w}" height="${h}" rx="${w * .28}" fill="${c}"/>
    <rect x="${x}" y="${y - h}" width="${w}" height="${h}" rx="${w * .28}" fill="url(#gBot)"/>
    <rect x="${x + w * .18}" y="${y - h - h * .22}" width="${w * .64}" height="${h * .24}" rx="2" fill="${cap}"/>
    ${lbl ? `<rect x="${x + w * .12}" y="${y - h * .62}" width="${w * .76}" height="${h * .3}" rx="2" fill="#fff" opacity=".88"/><rect x="${x + w * .24}" y="${y - h * .52}" width="${w * .52}" height="2" rx="1" fill="${sh(c, -25)}" opacity=".7"/><rect x="${x + w * .3}" y="${y - h * .44}" width="${w * .4}" height="1.6" rx=".8" fill="${sh(c, -25)}" opacity=".5"/>` : ''}
    <rect x="${x + w * .14}" y="${y - h + 3}" width="${w * .16}" height="${h - 6}" rx="${w * .08}" fill="#fff" opacity=".45"/></g>`;
  const pump = (x, y, w, h, c) => `<g><ellipse cx="${x + w / 2}" cy="${y + 1}" rx="${w * .6}" ry="2.5" fill="#000" opacity=".12"/><rect x="${x}" y="${y - h}" width="${w}" height="${h}" rx="${w * .35}" fill="${c}"/><rect x="${x}" y="${y - h}" width="${w}" height="${h}" rx="${w * .35}" fill="url(#gBot)"/><rect x="${x + w * .35}" y="${y - h - 8}" width="${w * .3}" height="9" fill="#e9edf3"/><path d="M${x + w * .3},${y - h - 8} h${w * .9} v3 h-${w * .55} z" fill="#d7dce5"/><rect x="${x + w * .15}" y="${y - h * .65}" width="${w * .7}" height="${h * .3}" rx="2" fill="#fff" opacity=".85"/><rect x="${x + w * .12}" y="${y - h + 4}" width="${w * .15}" height="${h - 8}" rx="2" fill="#fff" opacity=".45"/></g>`;
  const jar = (x, y, w, c, lid) => `<g><ellipse cx="${x + w / 2}" cy="${y + 1}" rx="${w * .6}" ry="2.5" fill="#000" opacity=".12"/><rect x="${x}" y="${y - w * .7}" width="${w}" height="${w * .7}" rx="4" fill="${c}"/><rect x="${x}" y="${y - w * .7}" width="${w}" height="${w * .7}" rx="4" fill="url(#gBot)"/><rect x="${x - 1}" y="${y - w * .7 - 6}" width="${w + 2}" height="7" rx="2.5" fill="${lid}"/><rect x="${x + 3}" y="${y - w * .55}" width="${w * .15}" height="${w * .4}" rx="1.5" fill="#fff" opacity=".45"/></g>`;
  const towel = (x, y, r, c) => `<g><circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/><circle cx="${x}" cy="${y}" r="${r}" fill="url(#gBall)"/><path d="M${x - r * .55},${y} a${r * .55},${r * .55} 0 1,1 ${r * 1.1},0" fill="none" stroke="${sh(c, -18)}" stroke-width="1.5"/><path d="M${x - r * .25},${y} a${r * .25},${r * .25} 0 1,1 ${r * .5},0" fill="none" stroke="${sh(c, -18)}" stroke-width="1.2"/></g>`;
  const plant = (x, y, s, pot) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-22,0 L22,0 L17,40 Q0,46 -17,40 Z" fill="${pot}"/><path d="M-22,0 L22,0 L21,7 L-21,7 Z" fill="${sh(pot, -12)}"/><rect x="-14" y="10" width="5" height="26" rx="2.5" fill="#fff" opacity=".35"/>
    <g fill="#5dbb7a">${[[-30, -40, -35], [30, -42, 35], [-14, -62, -12], [14, -60, 14], [0, -70, 0], [-34, -16, -60], [34, -14, 60]].map(([dx, dy, r]) => `<ellipse cx="${dx * .5}" cy="${dy * .5}" rx="8" ry="22" transform="rotate(${r} ${dx * .5} ${dy * .5})"/>`).join('')}</g>
    <g fill="#3f9c5e">${[[-18, -30, -25], [18, -32, 25], [0, -45, 0]].map(([dx, dy, r]) => `<ellipse cx="${dx * .5}" cy="${dy * .5}" rx="5" ry="15" transform="rotate(${r} ${dx * .5} ${dy * .5})"/>`).join('')}</g>
    <g stroke="#2f7d4a" stroke-width="1" opacity=".6">${[[-30, -40, -35], [30, -42, 35], [0, -70, 0]].map(([dx, dy]) => `<path d="M0,0 L${dx * .5},${dy * .5}"/>`).join('')}</g></g>`;

  /* ================= SALON ================= */
  A.BG.salon = () => {
    let damask = '';
    const fleur = `<path d="M22,6 C26,14 32,16 32,24 C32,31 26,33 22,40 C18,33 12,31 12,24 C12,16 18,14 22,6 Z M22,14 C24,19 27,21 27,24 C27,28 24,29 22,33 C20,29 17,28 17,24 C17,21 20,19 22,14 Z" fill-rule="evenodd"/><circle cx="22" cy="46" r="2.5"/><circle cx="22" cy="2" r="2"/><path d="M8,24 C3,20 3,28 8,24 Z M36,24 C41,20 41,28 36,24 Z"/>`;
    const sconce = x => `<g transform="translate(${x} 270)"><circle cx="0" cy="-8" r="70" fill="url(#gLamp)"/><path d="M-6,22 L6,22 L4,44 L-4,44 Z" fill="url(#gGold)"/><ellipse cx="0" cy="46" rx="9" ry="3" fill="url(#gGold)"/><path d="M-20,22 L20,22 L13,-14 L-13,-14 Z" fill="#fffaf0"/><path d="M-20,22 L20,22 L13,-14 L-13,-14 Z" fill="url(#gShade)"/><path d="M-20,22 L20,22" stroke="url(#gGold)" stroke-width="3"/><path d="M-13,-14 L13,-14" stroke="url(#gGold)" stroke-width="2"/></g>`;
    const shelf = (x0, side) => {
      const items = side < 0
        ? bottle(x0 + 6, 430, 15, 34, '#ff9fcd', '#e2559a', 1) + pump(x0 + 25, 430, 15, 30, '#9fd8ff') + bottle(x0 + 44, 430, 12, 40, '#ffd36b', '#d99a10', 1) + jar(x0 + 60, 430, 17, '#c9a7ff', '#8b5cf6')
        : jar(x0 + 4, 430, 17, '#7de3c5', '#2fa98a') + bottle(x0 + 24, 430, 13, 38, '#ffb38a', '#e0703a', 1) + pump(x0 + 41, 430, 15, 32, '#ff9fcd') + bottle(x0 + 60, 430, 14, 28, '#9fd8ff', '#4f8dff', 1);
      return `<g><rect x="${x0}" y="430" width="82" height="8" rx="2" fill="#fff"/><rect x="${x0}" y="437" width="82" height="4" fill="#e7bfd2"/><path d="M${x0 + 10},441 l6,10 h-3 z M${x0 + 72},441 l-6,10 h3 z" fill="url(#gGold)"/>${items}</g>`;
    };
    let tufts = '', buttons = '';
    for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) {
      const x = 106 + c * 38 + (r % 2 ? 19 : 0), y = 486 + r * 34; if (x > 296) continue;
      buttons += `<circle cx="${x}" cy="${y}" r="3.4" fill="#c2366f"/><circle cx="${x - 1}" cy="${y - 1}" r="1.2" fill="#fff" opacity=".6"/>`;
      tufts += `M${x},${y} L${x + 19},${y + 34} M${x},${y} L${x - 19},${y + 34} `;
    }
    return `<svg ${VB}><defs>
      <linearGradient id="gWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffeef6"/><stop offset=".6" stop-color="#fbdcea"/><stop offset="1" stop-color="#f5c8dd"/></linearGradient>
      <pattern id="gDamask" width="44" height="52" patternUnits="userSpaceOnUse"><g fill="#fff" opacity=".45">${fleur}</g><g fill="#fff" opacity=".22" transform="translate(22 26)">${fleur}</g></pattern>
      ${gold('gGold')}${chrome('gChrome')}${glow('gLamp', '#fff1c4')}${glow('gHalo', '#ffffff')}
      <linearGradient id="gShade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e8d9c4" stop-opacity=".6"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#e8d9c4" stop-opacity=".6"/></linearGradient>
      <radialGradient id="gGlass" cx=".38" cy=".28" r=".9"><stop offset="0" stop-color="#ffffff"/><stop offset=".45" stop-color="#eef4fc"/><stop offset=".8" stop-color="#d5e2f1"/><stop offset="1" stop-color="#bccfe6"/></radialGradient>
      <linearGradient id="gBot" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".25"/><stop offset=".4" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".18"/></linearGradient>
      <radialGradient id="gBall" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset="1" stop-color="#000" stop-opacity=".12"/></radialGradient>
      <linearGradient id="gChair" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#d9457f"/><stop offset=".3" stop-color="#ff7fb2"/><stop offset=".55" stop-color="#ff96c1"/><stop offset="1" stop-color="#c93a72"/></linearGradient>
      <linearGradient id="gPanel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff7fb"/><stop offset="1" stop-color="#f6d6e6"/></linearGradient>
      <radialGradient id="gVig" cx=".5" cy=".42" r=".75"><stop offset=".6" stop-color="#7a2a5a" stop-opacity="0"/><stop offset="1" stop-color="#7a2a5a" stop-opacity=".22"/></radialGradient>
    </defs>
    <rect width="400" height="860" fill="url(#gWall)"/><rect width="400" height="560" fill="url(#gDamask)"/>
    <rect y="548" width="400" height="312" fill="url(#gPanel)"/>
    ${[18, 148, 278].map(x => `<rect x="${x}" y="576" width="104" height="140" rx="6" fill="none" stroke="#e9c3d6" stroke-width="3"/><rect x="${x + 6}" y="582" width="92" height="128" rx="4" fill="#fff" opacity=".35"/>`).join('')}
    <rect y="540" width="400" height="12" fill="#fff"/><rect y="551" width="400" height="4" fill="#e7bfd2"/>
    <rect width="400" height="22" fill="#fff"/><rect y="22" width="400" height="5" fill="#f0cfe0"/><path d="M0,27 ${Array.from({ length: 21 }, (_, i) => `h10 q5,8 10,0`).join(' ')}" fill="#fff"/>
    ${sconce(26)}${sconce(374)}
    <ellipse cx="200" cy="300" rx="190" ry="250" fill="url(#gHalo)" opacity=".5"/>
    <g>
      <ellipse cx="200" cy="300" rx="174" ry="238" fill="#b9852e" opacity=".35" transform="translate(4 8)"/>
      <ellipse cx="200" cy="300" rx="174" ry="238" fill="url(#gGold)"/>
      <ellipse cx="200" cy="300" rx="164" ry="228" fill="none" stroke="#fff3c9" stroke-width="2" opacity=".8"/>
      ${Array.from({ length: 36 }, (_, i) => { const a = i / 36 * Math.PI * 2; return `<circle cx="${(200 + Math.cos(a) * 169).toFixed(1)}" cy="${(300 + Math.sin(a) * 233).toFixed(1)}" r="2.2" fill="#fff7d6" opacity=".9"/>`; }).join('')}
      <ellipse cx="200" cy="300" rx="156" ry="220" fill="#b98a3a"/>
      <ellipse cx="200" cy="300" rx="152" ry="216" fill="url(#gGlass)"/>
      <g opacity=".55" stroke="#fff" stroke-linecap="round"><path d="M86,190 L168,96" stroke-width="18"/><path d="M78,250 L190,122" stroke-width="7"/><path d="M262,470 L318,400" stroke-width="12"/><path d="M290,486 L330,436" stroke-width="5"/></g>
      <path d="M150,68 C160,40 182,30 200,44 C218,30 240,40 250,68 C236,58 220,58 200,72 C180,58 164,58 150,68 Z" fill="url(#gGold)"/>
      <path d="M120,84 C110,62 128,50 140,62 C130,62 126,72 132,82 Z M280,84 C290,62 272,50 260,62 C270,62 274,72 268,82 Z" fill="url(#gGold)"/>
      <circle cx="200" cy="46" r="10" fill="#ff7fb2" stroke="url(#gGold)" stroke-width="3"/><circle cx="196.5" cy="42.5" r="3" fill="#fff" opacity=".7"/>
      <path d="M166,532 C180,548 220,548 234,532 C222,540 178,540 166,532 Z" fill="url(#gGold)"/>
    </g>
    ${shelf(-14, -1)}${shelf(332, 1)}
    <g>${towel(16, 528, 11, '#ffffff')}${towel(38, 528, 11, '#ffd6e8')}${towel(27, 510, 11, '#e8f2ff')}${towel(362, 528, 11, '#ffffff')}${towel(384, 528, 11, '#e7dbff')}${towel(373, 510, 11, '#ffd6e8')}</g>
    ${plant(372, 590, .9, '#ff9fcd')}
    <g>
      <path d="M78,860 L78,520 C78,462 128,438 200,438 C272,438 322,462 322,520 L322,860 Z" fill="#b8306a" transform="translate(0 6)" opacity=".35"/>
      <path d="M80,860 L80,520 C80,464 130,440 200,440 C270,440 320,464 320,520 L320,860 Z" fill="url(#gChair)"/>
      <path d="${tufts}" stroke="#c2366f" stroke-width="1.6" opacity=".55" fill="none"/>${buttons}
      <path d="M80,860 L80,520 C80,464 130,440 200,440 C270,440 320,464 320,520 L320,860" fill="none" stroke="url(#gChrome)" stroke-width="7"/>
      <path d="M104,500 C116,470 150,458 190,456" stroke="#fff" stroke-width="5" fill="none" opacity=".35" stroke-linecap="round"/>
    </g>
    ${spark(60, 120, 7)}${spark(340, 110, 6)}${spark(80, 380, 5)}${spark(330, 360, 6)}
    <rect width="400" height="860" fill="url(#gVig)"/></svg>`;
  };

  /* ================= MAKE-UP ROOM ================= */
  A.BG.makeup = () => {
    let bulbs = '';
    const bulb = (x, y) => `<g transform="translate(${x} ${y})"><circle r="26" fill="url(#mBulbGlow)"/><circle r="10.5" fill="#fffdf2"/><circle r="10.5" fill="url(#mBulb)"/><circle cx="-3" cy="-3" r="3.2" fill="#fff"/></g>`;
    for (let x = 72; x <= 328; x += 32) bulbs += bulb(x, 74);
    for (let y = 112; y <= 520; y += 40) bulbs += bulb(34, y) + bulb(366, y);
    const brush = (x, y, rot, c, head) => `<g transform="translate(${x} ${y}) rotate(${rot})"><rect x="-2.5" y="-46" width="5" height="40" rx="2.5" fill="${c}"/><rect x="-3.2" y="-54" width="6.4" height="9" fill="url(#mMetal)"/><path d="M-4,-54 C-6,-66 -3,-74 0,-76 C3,-74 6,-66 4,-54 Z" fill="${head}"/></g>`;
    const perfume = (x, y, c) => `<g><ellipse cx="${x}" cy="${y + 1}" rx="16" ry="3" fill="#000" opacity=".12"/><path d="M${x - 15},${y} C${x - 18},${y - 26} ${x - 10},${y - 34} ${x},${y - 34} C${x + 10},${y - 34} ${x + 18},${y - 26} ${x + 15},${y} Z" fill="${c}" opacity=".85"/><path d="M${x - 9},${y - 26} C${x - 11},${y - 16} ${x - 10},${y - 8} ${x - 7},${y - 4}" stroke="#fff" stroke-width="3" fill="none" opacity=".6" stroke-linecap="round"/><rect x="${x - 4}" y="${y - 42}" width="8" height="9" fill="url(#mGold)"/><circle cx="${x}" cy="${y - 48}" r="7" fill="${U.shade(c, 20)}"/><circle cx="${x - 2}" cy="${y - 50}" r="2" fill="#fff" opacity=".7"/></g>`;
    return `<svg ${VB}><defs>
      <linearGradient id="mWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff4f8"/><stop offset="1" stop-color="#f6dcef"/></linearGradient>
      <pattern id="mStripe" width="36" height="36" patternUnits="userSpaceOnUse"><rect width="18" height="36" fill="#fff" opacity=".5"/><path d="${A.heart(27, 18, 3.6)}" fill="#ffc2dc" opacity=".8"/></pattern>
      ${gold('mGold')}${glow('mBulbGlow', '#ffe9a8')}
      <radialGradient id="mBulb" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#f5d78a" stop-opacity=".7"/></radialGradient>
      <linearGradient id="mMetal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#b0b8c6"/><stop offset=".5" stop-color="#fff"/><stop offset="1" stop-color="#99a3b4"/></linearGradient>
      <linearGradient id="mGlass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".55" stop-color="#f3eefc"/><stop offset="1" stop-color="#d9cff2"/></linearGradient>
      <linearGradient id="mCurt" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#c9417e"/><stop offset=".25" stop-color="#ff86bc"/><stop offset=".45" stop-color="#d54a8a"/><stop offset=".7" stop-color="#ff8fc2"/><stop offset="1" stop-color="#c03a76"/></linearGradient>
      <linearGradient id="mWood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#f2d9e8"/></linearGradient>
      <radialGradient id="mVig" cx=".5" cy=".4" r=".75"><stop offset=".6" stop-color="#5a2a7a" stop-opacity="0"/><stop offset="1" stop-color="#5a2a7a" stop-opacity=".2"/></radialGradient>
    </defs>
    <rect width="400" height="860" fill="url(#mWall)"/><rect width="400" height="860" fill="url(#mStripe)"/>
    <rect x="20" y="46" width="360" height="510" rx="46" fill="#fff"/><rect x="20" y="46" width="360" height="510" rx="46" fill="none" stroke="url(#mGold)" stroke-width="5"/>
    <rect x="52" y="96" width="296" height="440" rx="30" fill="url(#mGlass)"/>
    <g opacity=".6" stroke="#fff" stroke-linecap="round"><path d="M80,200 L170,110" stroke-width="16"/><path d="M76,262 L198,140" stroke-width="6"/><path d="M262,520 L330,452" stroke-width="10"/></g>
    ${bulbs}
    <path d="M0,0 L58,0 C44,140 70,300 40,560 C30,640 26,760 20,860 L0,860 Z" fill="url(#mCurt)"/><path d="M400,0 L342,0 C356,140 330,300 360,560 C370,640 374,760 380,860 L400,860 Z" fill="url(#mCurt)"/>
    <path d="M0,0 L400,0 L400,30 C340,48 270,40 200,32 C130,40 60,48 0,30 Z" fill="url(#mCurt)"/>
    <ellipse cx="38" cy="540" rx="16" ry="8" fill="url(#mGold)"/><ellipse cx="362" cy="540" rx="16" ry="8" fill="url(#mGold)"/>
    <rect x="0" y="568" width="400" height="292" fill="url(#mWood)"/><rect x="0" y="564" width="400" height="8" fill="url(#mGold)"/>
    <g>${perfume(70, 562, '#ffb3d1')}${perfume(332, 562, '#c9a7ff')}</g>
    <g transform="translate(108 562)"><path d="M-14,0 L14,0 L11,-30 L-11,-30 Z" fill="#ffd6e8"/><path d="M-14,0 L14,0 L11,-30 L-11,-30 Z" fill="url(#gBotM)"/>${brush(-5, -24, -12, '#3b2547', '#f7a8c4')}${brush(2, -24, 4, '#ffffff', '#3b2547')}${brush(8, -24, 16, '#c9a7ff', '#f2c9a0')}</g>
    <g transform="translate(290 556)"><rect x="-10" y="-14" width="7" height="16" rx="1.5" fill="url(#mGold)"/><path d="M-9,-14 L-9,-24 Q-6.5,-29 -4,-23 L-4,-14 Z" fill="#e0245e"/><rect x="2" y="-12" width="7" height="14" rx="1.5" fill="url(#mGold)"/><path d="M3,-12 L3,-20 Q5.5,-25 8,-19 L8,-12 Z" fill="#ff6f91"/></g>
    ${spark(84, 160, 6)}${spark(320, 180, 7)}${spark(96, 470, 5)}${spark(308, 430, 6)}
    <rect width="400" height="860" fill="url(#mVig)"/>
    <defs><linearGradient id="gBotM" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".3"/><stop offset="1" stop-color="#000" stop-opacity=".15"/></linearGradient></defs></svg>`;
  };

  /* ================= BOUTIQUE ================= */
  A.BG.dress = () => {
    const hanger = (x, y, c, kind) => {
      const hook = `<path d="M${x},${y} q0,-7 5,-7 q4,0 4,4" stroke="#a7a0b8" stroke-width="1.6" fill="none"/><path d="M${x - 14},${y + 8} L${x},${y} L${x + 14},${y + 8}" stroke="#a7a0b8" stroke-width="2" fill="none"/>`;
      let g = '';
      if (kind === 0) g = `<path d="M${x - 11},${y + 8} L${x + 11},${y + 8} L${x + 9},${y + 30} C${x + 16},${y + 50} ${x + 20},${y + 70} ${x + 22},${y + 92} Q${x},${y + 98} ${x - 22},${y + 92} C${x - 20},${y + 70} ${x - 16},${y + 50} ${x - 9},${y + 30} Z" fill="${c}"/>`;
      if (kind === 1) g = `<path d="M${x - 16},${y + 8} L${x + 16},${y + 8} L${x + 24},${y + 30} L${x + 17},${y + 32} L${x + 15},${y + 66} L${x - 15},${y + 66} L${x - 17},${y + 32} L${x - 24},${y + 30} Z" fill="${c}"/>`;
      if (kind === 2) g = `<path d="M${x - 15},${y + 8} L${x + 15},${y + 8} L${x + 26},${y + 36} L${x + 18},${y + 38} L${x + 16},${y + 90} L${x - 16},${y + 90} L${x - 18},${y + 38} L${x - 26},${y + 36} Z" fill="${c}"/><path d="M${x},${y + 10} L${x},${y + 90}" stroke="${sh(c, -20)}" stroke-width="1.2"/>`;
      return hook + g + g.replace(/fill="[^"]+"/, 'fill="url(#dFab)"');
    };
    const shoe = (x, y, c) => `<path d="M${x},${y} C${x - 2},${y - 10} ${x + 6},${y - 14} ${x + 10},${y - 8} L${x + 22},${y - 4} C${x + 26},${y - 3} ${x + 26},${y} ${x + 22},${y} Z" fill="${c}"/><path d="M${x + 3},${y} L${x + 2},${y + 6}" stroke="${sh(c, -25)}" stroke-width="2"/>`;
    const lights = Array.from({ length: 13 }, (_, i) => { const x = 6 + i * 32, y = 34 + Math.sin(i * 1.1) * 8 + (i % 2) * 6; const c = ['#ff8fc4', '#ffd54a', '#8fd0ff', '#c9a7ff', '#7de3c5'][i % 5]; return `<circle cx="${x}" cy="${y}" r="14" fill="${c}" opacity=".25"/><circle cx="${x}" cy="${y}" r="5" fill="${c}"/><circle cx="${x - 1.5}" cy="${y - 1.5}" r="1.6" fill="#fff"/>`; }).join('');
    const cloud = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" fill="#fff"><circle r="18"/><circle cx="22" cy="-10" r="24"/><circle cx="48" cy="0" r="18"/><rect x="0" y="0" width="48" height="18" rx="9"/></g>`;
    return `<svg ${VB}><defs>
      <linearGradient id="dWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6efff"/><stop offset="1" stop-color="#e6d8fb"/></linearGradient>
      <pattern id="dPanel" width="80" height="860" patternUnits="userSpaceOnUse"><rect x="8" y="100" width="64" height="420" rx="6" fill="none" stroke="#fff" stroke-width="3" opacity=".7"/></pattern>
      <linearGradient id="dSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7cc7ff"/><stop offset=".65" stop-color="#bfe4ff"/><stop offset="1" stop-color="#ffe2f0"/></linearGradient>
      <linearGradient id="dCurt" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#a77be8"/><stop offset=".3" stop-color="#d9bcff"/><stop offset=".55" stop-color="#b58cf0"/><stop offset=".8" stop-color="#e2ccff"/><stop offset="1" stop-color="#9f72e2"/></linearGradient>
      <linearGradient id="dFab" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".18"/><stop offset=".45" stop-color="#fff" stop-opacity=".2"/><stop offset="1" stop-color="#000" stop-opacity=".18"/></linearGradient>
      <linearGradient id="dFloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3d9c2"/><stop offset="1" stop-color="#ddb08c"/></linearGradient>
      <radialGradient id="dPod" cx=".5" cy=".35" r=".7"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#ffc6e4"/></radialGradient>
      ${gold('dGold')}${chrome('dChrome')}
      <radialGradient id="dVig" cx=".5" cy=".4" r=".75"><stop offset=".6" stop-color="#3a2a7a" stop-opacity="0"/><stop offset="1" stop-color="#3a2a7a" stop-opacity=".2"/></radialGradient>
    </defs>
    <rect width="400" height="860" fill="url(#dWall)"/><rect width="400" height="860" fill="url(#dPanel)"/>
    <path d="M88,560 L88,170 C88,96 140,58 200,58 C260,58 312,96 312,170 L312,560 Z" fill="#fff"/>
    <path d="M100,552 L100,172 C100,104 146,72 200,72 C254,72 300,104 300,172 L300,552 Z" fill="url(#dSky)"/>
    ${cloud(126, 170, .9)}${cloud(220, 250, .7)}${cloud(140, 340, .55)}
    <g fill="#c9b6ec" opacity=".65"><rect x="100" y="440" width="34" height="112"/><rect x="138" y="410" width="26" height="142"/><rect x="168" y="460" width="40" height="92"/><rect x="212" y="420" width="30" height="132"/><rect x="246" y="450" width="54" height="102"/></g>
    <g fill="#fff" opacity=".7">${[[108, 456], [118, 476], [146, 430], [146, 456], [180, 476], [194, 496], [220, 440], [230, 466], [256, 470], [276, 490]].map(([x, y]) => `<rect x="${x}" y="${y}" width="6" height="8" rx="1"/>`).join('')}</g>
    <g stroke="#fff" stroke-width="6"><path d="M200,72 L200,552"/><path d="M100,300 L300,300"/></g>
    <path d="M76,40 C110,140 96,330 84,580 L58,580 C66,330 54,140 40,40 Z" fill="url(#dCurt)"/><path d="M324,40 C290,140 304,330 316,580 L342,580 C334,330 346,140 360,40 Z" fill="url(#dCurt)"/>
    <rect x="30" y="34" width="340" height="9" rx="4.5" fill="url(#dGold)"/>
    <rect x="-10" y="150" width="76" height="6" rx="3" fill="url(#dChrome)"/>${hanger(10, 158, '#ff8fc4', 0)}${hanger(34, 158, '#ffd54a', 2)}${hanger(56, 158, '#8fd0ff', 1)}
    <rect x="334" y="150" width="76" height="6" rx="3" fill="url(#dChrome)"/>${hanger(346, 158, '#c9a7ff', 1)}${hanger(368, 158, '#7de3c5', 0)}${hanger(392, 158, '#ff7f6b', 2)}
    <rect x="-6" y="390" width="70" height="7" rx="3" fill="#fff"/><g>${shoe(4, 390, '#ff4f9a')}${shoe(30, 390, '#8fd0ff')}</g>
    <rect x="336" y="390" width="70" height="7" rx="3" fill="#fff"/><g transform="translate(346 360)"><rect x="0" y="6" width="28" height="24" rx="4" fill="#ffd54a"/><path d="M5,6 Q14,-6 23,6" stroke="#ffd54a" stroke-width="3" fill="none"/><rect x="0" y="12" width="28" height="4" fill="#fff" opacity=".6"/></g>
    <rect y="560" width="400" height="300" fill="url(#dFloor)"/>
    <g stroke="#d4a27c" stroke-width="2" opacity=".55">${Array.from({ length: 8 }, (_, i) => `<path d="M0,${600 + i * 40} L400,${600 + i * 40}"/>`).join('')}${Array.from({ length: 16 }, (_, i) => `<path d="M${(i * 53 + (i % 2) * 26) % 400},${600 + (i % 7) * 40} l0,40"/>`).join('')}</g>
    <ellipse cx="200" cy="572" rx="150" ry="26" fill="#ffd1ea" opacity=".85"/><ellipse cx="200" cy="566" rx="120" ry="18" fill="url(#dPod)"/><ellipse cx="200" cy="566" rx="120" ry="18" fill="none" stroke="url(#dGold)" stroke-width="3"/>
    <path d="M0,34 Q100,66 200,40 Q300,66 400,34" stroke="#bfa6e8" stroke-width="1.5" fill="none"/>${lights}
    <rect width="400" height="860" fill="url(#dVig)"/></svg>`;
  };
})();

/* =========================================================
   BODY (same silhouette so clothes still fit, more modelling)
   ========================================================= */
(() => {
  const A = ART, sh = (c, p) => U.shade(c, p), mix = U.mix;
  A.body = (s) => {
    const d = sh(s, -16), dd = sh(s, -28), hl = mix(s, '#ffffff', .35), warm = mix(s, '#e87c6c', .3);
    const leg = 'M150,592 L200,592 L198,660 Q196,740 192,780 Q190,860 189,912 L171,912 Q170,860 166,780 Q160,740 156,660 Q152,620 150,592 Z';
    const foot = 'M169,904 L191,904 C194,918 196,930 191,940 C185,947 173,947 168,939 C164,929 166,916 169,904 Z';
    const torso = 'M184,354 L216,354 C230,361 248,365 256,378 C262,392 252,420 246,450 C240,480 234,500 234,522 C240,545 252,570 252,598 L148,598 C148,570 160,545 166,522 C166,500 160,480 154,450 C148,420 138,392 144,378 C152,365 170,361 184,354 Z';
    const neck = 'M182,290 L218,290 L220,362 Q200,374 180,362 Z';
    const legs = A.mirror(`<path d="${leg}" fill="${s}"/><path d="${leg}" fill="url(#limbShade)"/>`
      + `<path d="M158,620 C162,680 166,730 170,770" stroke="${hl}" stroke-width="5" fill="none" opacity=".45" stroke-linecap="round"/>`
      + `<path d="M196,640 C194,700 192,740 190,778" stroke="${dd}" stroke-width="4" fill="none" opacity=".18" stroke-linecap="round"/>`
      + `<ellipse cx="179" cy="772" rx="9" ry="6" fill="${hl}" opacity=".35"/><path d="M172,780 Q179,786 186,780" stroke="${dd}" stroke-width="1.6" fill="none" opacity=".4"/>`
      + `<path d="M168,800 C166,830 168,860 172,890" stroke="${dd}" stroke-width="3" fill="none" opacity=".15" stroke-linecap="round"/>`
      + `<path d="M173,898 Q175,903 172,906" stroke="${dd}" stroke-width="1.4" fill="none" opacity=".4"/>`
      + `<path d="${foot}" fill="${s}"/><path d="${foot}" fill="url(#limbShade)"/>`
      + `<path d="M171,934 Q180,941 189,934" stroke="${dd}" stroke-width="1.3" fill="none" opacity=".35"/>`
      + `<g fill="${warm}" opacity=".5">${[[172.5, 938, 2.4], [177, 940.5, 2.2], [181.5, 941, 2.1], [186, 940, 2], [189.5, 937.5, 1.8]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * .8}"/>`).join('')}</g>`);
    const torsoS = `<path d="${neck}" fill="${s}"/><path d="${neck}" fill="url(#limbShade)"/>`
      + `<path d="M182,300 C190,320 210,320 218,300 L218,330 Q200,340 182,330 Z" fill="${dd}" opacity=".28" filter="url(#blur4)"/>`
      + `<path d="M190,330 C188,342 189,352 192,360" stroke="${dd}" stroke-width="2" fill="none" opacity=".25" stroke-linecap="round"/><path d="M210,330 C212,342 211,352 208,360" stroke="${dd}" stroke-width="2" fill="none" opacity=".25" stroke-linecap="round"/>`
      + `<path d="${torso}" fill="${s}"/><path d="${torso}" fill="url(#limbShade)"/>`
      + `<path d="M162,372 Q180,382 196,378 M238,372 Q220,382 204,378" stroke="${dd}" stroke-width="2.2" fill="none" opacity=".4" stroke-linecap="round"/>`
      + `<path d="M164,368 Q180,376 194,373 M236,368 Q220,376 206,373" stroke="${hl}" stroke-width="2" fill="none" opacity=".55" stroke-linecap="round"/>`
      + `<ellipse cx="152" cy="382" rx="10" ry="7" fill="${hl}" opacity=".45"/><ellipse cx="248" cy="382" rx="10" ry="7" fill="${hl}" opacity=".45"/>`
      + `<path d="M200,384 L200,410" stroke="${dd}" stroke-width="2.5" opacity=".15" stroke-linecap="round"/>`
      + `<path d="M172,430 Q186,442 198,436 M228,430 Q214,442 202,436" stroke="${dd}" stroke-width="2" fill="none" opacity=".22" stroke-linecap="round"/>`
      + `<ellipse cx="200" cy="510" rx="3" ry="4.5" fill="${dd}" opacity=".35"/>`;
    const armStroke = (p, dx) => `<path d="${p}" stroke="${d}" stroke-width="25" transform="translate(${dx} 0)"/>`;
    const arms = `<g fill="none" stroke-linecap="round">${armStroke(A.ARM_L, -2.5)}${armStroke(A.ARM_R, 2.5)}<path d="${A.ARM_L}" stroke="${s}" stroke-width="24"/><path d="${A.ARM_R}" stroke="${s}" stroke-width="24"/>`
      + `<path d="M146,398 Q134,436 133,476" stroke="${hl}" stroke-width="5" opacity=".5"/><path d="M254,398 Q266,436 267,476" stroke="${hl}" stroke-width="5" opacity=".5"/>`
      + `<path d="M140,470 Q140,500 136,540" stroke="${dd}" stroke-width="4" opacity=".14"/><path d="M260,470 Q260,500 264,540" stroke="${dd}" stroke-width="4" opacity=".14"/></g>`
      + `<path d="M125,480 q5,4 10,0 M275,480 q-5,4 -10,0" stroke="${dd}" stroke-width="1.4" fill="none" opacity=".35"/>`;
    const hand = `<path d="M113,590 C111,604 113,620 119,626 C123,630 129,629 132,622 C135,614 136,604 134,592 Z" fill="${s}"/><path d="M113,590 C111,604 113,620 119,626 C123,630 129,629 132,622 C135,614 136,604 134,592 Z" fill="url(#limbShade)"/>`
      + `<path d="M131,596 C138,600 140,608 136,613 C134,615 132,612 132,608" fill="${s}" stroke="${d}" stroke-width=".8"/>`
      + `<path d="M118,612 L117,624 M123,614 L122,628 M128,613 L128,626" stroke="${dd}" stroke-width="1" opacity=".35" stroke-linecap="round"/>`
      + `<g fill="#ffd6e2" opacity=".85"><ellipse cx="117" cy="625" rx="1.8" ry="1.4"/><ellipse cx="122" cy="628" rx="1.8" ry="1.4"/><ellipse cx="127.5" cy="627" rx="1.8" ry="1.4"/></g>`;
    return { legs, torso: torsoS, arms, hands: A.mirror(hand) };
  };
})();

/* =========================================================
   TOOL ICONS (48 x 48) – glossy, shaded, detailed
   ========================================================= */
(() => {
  const I = ART.ICON;
  const side = (d) => `<path d="${d}" fill="url(#giSide)"/>`;
  const top = (d) => `<path d="${d}" fill="url(#giTop)"/>`;
  const rr = (x, y, w, h, r) => `M${x + r},${y} h${w - 2 * r} a${r},${r} 0 0 1 ${r},${r} v${h - 2 * r} a${r},${r} 0 0 1 -${r},${r} h-${w - 2 * r} a${r},${r} 0 0 1 -${r},-${r} v-${h - 2 * r} a${r},${r} 0 0 1 ${r},-${r} Z`;
  const shadow = '<ellipse cx="24" cy="44.5" rx="15" ry="2.6" fill="#3b1a35" opacity=".16"/>';

  I.scissors = shadow + `<g transform="rotate(8 24 24)"><path d="M22.5,25 L31,3.5 C32,2 34,2.4 33.6,4.2 L26,26 Z" fill="url(#giMetal)"/><path d="M25.5,25 L17,3.5 C16,2 14,2.4 14.4,4.2 L22,26 Z" fill="url(#giMetal)"/><path d="M31,3.5 L24.6,22" stroke="#fff" stroke-width=".8" opacity=".9"/><path d="M17,3.5 L23.4,22" stroke="#5f6b80" stroke-width=".7" opacity=".6"/>
    <circle cx="24" cy="25" r="2.6" fill="url(#giMetalV)" stroke="#6b768a" stroke-width=".6"/><circle cx="23.4" cy="24.4" r=".8" fill="#fff"/>
    <path d="M22,27 C20,30 16,30.5 13.5,32" stroke="#ff4f9a" stroke-width="3.6" fill="none" stroke-linecap="round"/><path d="M26,27 C28,30 32,30.5 34.5,32" stroke="#ff4f9a" stroke-width="3.6" fill="none" stroke-linecap="round"/>
    <circle cx="12" cy="36" r="6.8" fill="none" stroke="#ff4f9a" stroke-width="4"/><circle cx="36" cy="36" r="6.8" fill="none" stroke="#ff4f9a" stroke-width="4"/>
    <path d="M7.2,33 A6.8,6.8 0 0 1 14,29.5" stroke="#fff" stroke-width="1.5" fill="none" opacity=".7" stroke-linecap="round"/><path d="M31.2,33 A6.8,6.8 0 0 1 38,29.5" stroke="#fff" stroke-width="1.5" fill="none" opacity=".7" stroke-linecap="round"/>
    <circle cx="12" cy="36" r="8.8" fill="none" stroke="#c4246b" stroke-width=".8" opacity=".5"/><circle cx="36" cy="36" r="8.8" fill="none" stroke="#c4246b" stroke-width=".8" opacity=".5"/></g>`;

  I.razor = shadow + `<g transform="rotate(-18 24 25)"><path d="${rr(14, 13, 20, 31, 9)}" fill="#7d8cff"/>${side(rr(14, 13, 20, 31, 9))}<path d="M14,30 h20 v4 h-20 z" fill="#5c6ae0" opacity=".5"/>
    <path d="${rr(12, 6, 24, 9, 2.5)}" fill="url(#giMetalV)"/><g fill="#9aa4b6">${Array.from({ length: 8 }, (_, i) => `<rect x="${12.6 + i * 3}" y="1.8" width="1.7" height="5.5" rx=".8"/>`).join('')}</g><path d="M12,9.5 h24" stroke="#fff" stroke-width=".8" opacity=".8"/>
    <path d="${rr(20.5, 21, 7, 11, 3.5)}" fill="#ffd54a"/><circle cx="24" cy="24.5" r="1.6" fill="#fff" opacity=".85"/><circle cx="24" cy="38.5" r="1.4" fill="#38e28d"/><circle cx="24" cy="38.5" r="3" fill="#38e28d" opacity=".25"/>
    <path d="M17,16 v24" stroke="#fff" stroke-width="2.4" opacity=".4" stroke-linecap="round"/></g>`;

  I.grow = shadow + `<path d="M19,5 L29,5 L29,15 C37,18.5 41.5,25 41.5,31.5 C41.5,40 34,45 24,45 C14,45 6.5,40 6.5,31.5 C6.5,25 11,18.5 19,15 Z" fill="#e8fff8" opacity=".75"/>
    <path d="M8,30 C13,27 18,32 24,30 C30,28 35,32 40,30 C40.5,38 33.5,43.5 24,43.5 C14.5,43.5 7.5,38 8,30 Z" fill="#33cf9e"/><path d="M8,30 C13,27 18,32 24,30 C30,28 35,32 40,30" stroke="#8ff5d3" stroke-width="1.6" fill="none"/>
    <g fill="#fff" opacity=".8"><circle cx="18" cy="37" r="1.6"/><circle cx="27" cy="35" r="1.1"/><circle cx="31" cy="39" r="1.9"/><circle cx="22" cy="40.5" r="1"/></g>
    <path d="M19,5 L29,5 L29,15 C37,18.5 41.5,25 41.5,31.5 C41.5,40 34,45 24,45 C14,45 6.5,40 6.5,31.5 C6.5,25 11,18.5 19,15 Z" fill="url(#giGlass)" stroke="#9fe9d3" stroke-width="1.2"/>
    <path d="M12,24 C14,20 17,17.5 20.5,16.5" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".85"/>
    <path d="${rr(17.5, 1.5, 13, 6.5, 2)}" fill="#c58bf2"/>${top(rr(17.5, 1.5, 13, 6.5, 2))}
    <path d="M34,18 l1.3,3 3,1.3 -3,1.3 -1.3,3 -1.3,-3 -3,-1.3 3,-1.3 Z" fill="#fff"/><path d="M39,11 l.8,1.9 1.9,.8 -1.9,.8 -.8,1.9 -.8,-1.9 -1.9,-.8 1.9,-.8 Z" fill="#ffe066"/>`;

  I.comb = shadow + `<g transform="rotate(-10 24 24)"><path d="${rr(4, 11, 40, 11, 5.5)}" fill="#ff9fc9"/>${top(rr(4, 11, 40, 11, 5.5))}
    <g fill="#ff9fc9">${Array.from({ length: 12 }, (_, i) => `<path d="${rr(6.3 + i * 3.2, 20, 2.1, i % 2 ? 13 : 17, 1)}"/>`).join('')}</g>
    <g fill="#d9558f" opacity=".5">${Array.from({ length: 12 }, (_, i) => `<rect x="${7.6 + i * 3.2}" y="21" width=".8" height="${i % 2 ? 11 : 15}" rx=".4"/>`).join('')}</g>
    <path d="M8,14 h30" stroke="#fff" stroke-width="2.2" stroke-linecap="round" opacity=".75"/><circle cx="40" cy="16.5" r="1.8" fill="#fff" opacity=".7"/></g>`;

  I.dryer = shadow + `<path d="M22,24 L19.5,41 C19,43.5 21,45 23.5,45 L27,45 C29.5,45 30.8,43.5 30.2,41 L28,24 Z" fill="#e65d99"/>${side('M22,24 L19.5,41 C19,43.5 21,45 23.5,45 L27,45 C29.5,45 30.8,43.5 30.2,41 L28,24 Z')}
    <rect x="21" y="31" width="8.4" height="4" rx="2" fill="#fff" opacity=".85"/><circle cx="25.2" cy="33" r="1.1" fill="#38e28d"/>
    <path d="M4,15.5 C4,8.5 9,5 16,5 L30,5 C36,5 39,9.5 39,15.5 C39,21.5 35,25.5 30,25.5 L16,25.5 C9,25.5 4,21.5 4,15.5 Z" fill="#ff8cc0"/>${top('M4,15.5 C4,8.5 9,5 16,5 L30,5 C36,5 39,9.5 39,15.5 C39,21.5 35,25.5 30,25.5 L16,25.5 C9,25.5 4,21.5 4,15.5 Z')}
    <circle cx="14.5" cy="15.5" r="7.2" fill="#fff"/><circle cx="14.5" cy="15.5" r="7.2" fill="url(#giBall)"/><g stroke="#ff8cc0" stroke-width="1.3" stroke-linecap="round"><path d="M14.5,10.5 v10 M9.5,15.5 h10 M11,12 l7,7 M18,12 l-7,7"/></g><circle cx="14.5" cy="15.5" r="2" fill="#ff8cc0"/>
    <path d="${rr(38, 9, 7, 13, 2.5)}" fill="#c93f80"/>${side(rr(38, 9, 7, 13, 2.5))}
    <path d="M9,8.5 C12,7 16,6.6 20,6.8" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" opacity=".8"/>`;

  I.curler = shadow + `<g transform="rotate(-12 24 24)"><path d="${rr(2.5, 18, 15, 11, 5.5)}" fill="#9b6bff"/>${top(rr(2.5, 18, 15, 11, 5.5))}<circle cx="7.5" cy="23.5" r="1.8" fill="#ffd54a"/>
    <path d="${rr(16.5, 19.5, 27.5, 8, 4)}" fill="url(#giMetalV)"/><path d="M20,21.5 h22" stroke="#fff" stroke-width="1.6" opacity=".9" stroke-linecap="round"/>
    <path d="M17,17.2 L40,14 C41.5,13.8 42,15.5 40.6,16 L18,19.5 Z" fill="#a9b3c4"/><path d="M17,17.2 L40,14" stroke="#fff" stroke-width=".7" opacity=".8"/><circle cx="43" cy="23.5" r="1.4" fill="#ff4f9a"/>
    <path d="M3,27 C-1,34 5,42 12,43" stroke="#9b6bff" stroke-width="2.2" fill="none" stroke-linecap="round"/></g>
    <g stroke="#cfd8e6" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".9"><path d="M27,10 q2,-3 0,-6 q-2,-3 0,-5"/><path d="M34,9 q2,-3 0,-6"/></g>`;

  I.straightener = shadow + `<g transform="rotate(-24 24 24)"><path d="${rr(12.5, 3, 10, 41, 5)}" fill="#3fd0b8"/>${side(rr(12.5, 3, 10, 41, 5))}<path d="${rr(25.5, 3, 10, 41, 5)}" fill="#2bb59f"/>${side(rr(25.5, 3, 10, 41, 5))}
    <path d="${rr(14.6, 5.5, 5.8, 19, 2.8)}" fill="#f4f6fa"/><path d="${rr(27.6, 5.5, 5.8, 19, 2.8)}" fill="#f4f6fa"/><path d="M17.5,7 v16 M30.5,7 v16" stroke="#d5dbe6" stroke-width="1"/>
    <circle cx="24" cy="40" r="3.4" fill="url(#giGold)"/><circle cx="17.5" cy="33" r="1.4" fill="#ff4f9a"/><path d="M15,28 v12" stroke="#fff" stroke-width="1.6" opacity=".5" stroke-linecap="round"/></g>`;

  I.dye = shadow + `<path d="M5,24 L43,24 C43,37 35,44 24,44 C13,44 5,37 5,24 Z" fill="#c58bf2"/>${side('M5,24 L43,24 C43,37 35,44 24,44 C13,44 5,37 5,24 Z')}<ellipse cx="24" cy="24" rx="19" ry="5.5" fill="#a26be6"/><ellipse cx="24" cy="24.6" rx="16" ry="3.8" fill="#ff5fa2"/><ellipse cx="19" cy="23.6" rx="5" ry="1.2" fill="#fff" opacity=".5"/>
    <path d="M9,30 C10,36 14,40 19,41.5" stroke="#fff" stroke-width="2" fill="none" opacity=".55" stroke-linecap="round"/>
    <g transform="rotate(30 31 14)"><path d="${rr(29, -1, 4.6, 21, 2.3)}" fill="#3b2547"/><rect x="28.5" y="18.5" width="5.6" height="3.5" fill="url(#giMetal)"/><path d="M28.3,22 L34.3,22 L33.6,29 Q31.3,31 29,29 Z" fill="#ff5fa2"/></g>`;

  I.shampoo = shadow + `<path d="${rr(12, 15, 24, 30, 8)}" fill="#6cc3ff"/>${side(rr(12, 15, 24, 30, 8))}<path d="${rr(16.5, 8.5, 15, 8, 2)}" fill="#ff6fa5"/>${top(rr(16.5, 8.5, 15, 8, 2))}<path d="M22,8.5 V4 H37 V7.4 H25.5 V8.5 Z" fill="#ff6fa5"/><path d="M35.5,4 v3.4" stroke="#c93f80" stroke-width="1.2"/>
    <path d="${rr(15, 23, 18, 13, 3.5)}" fill="#fff" opacity=".92"/><path d="M19,27 h10 M19,30 h7" stroke="#6cc3ff" stroke-width="1.6" stroke-linecap="round"/><circle cx="29.5" cy="31.5" r="2" fill="#ff9fc9"/>
    <path d="M15,19 v22" stroke="#fff" stroke-width="2.6" stroke-linecap="round" opacity=".5"/><g fill="#fff" opacity=".9"><circle cx="38" cy="14" r="2.4"/><circle cx="41.5" cy="9" r="1.5"/><circle cx="8.5" cy="12" r="1.8"/></g>`;

  I.spray = shadow + `<path d="${rr(13, 15, 21, 30, 6)}" fill="#ffd36b"/>${side(rr(13, 15, 21, 30, 6))}<path d="M13,24 h21 v12 h-21 z" fill="#ff8cc0"/><path d="M13,24 h21 v12 h-21 z" fill="url(#giSide)"/><path d="M18,30 l2,-3 2,3 2,-3 2,3 2,-3 2,3" stroke="#fff" stroke-width="1.3" fill="none"/>
    <path d="${rr(15.5, 8, 16, 8, 2.5)}" fill="#c58bf2"/>${top(rr(15.5, 8, 16, 8, 2.5))}<path d="${rr(28, 9.5, 7.5, 4, 1.6)}" fill="#a26be6"/>
    <path d="M16,19 v22" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".55"/>
    <g fill="#fff">${[[40, 8, 1.6], [43, 12.5, 1.1], [39.5, 15.5, .9], [44.5, 6, .8]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')}</g><path d="M42,2 l1,2.4 2.4,1 -2.4,1 -1,2.4 -1,-2.4 -2.4,-1 2.4,-1 Z" fill="#ff6fa5"/>`;

  I.shower = `<g transform="rotate(-20 24 24)"><path d="M24,42 L24,22" stroke="url(#giMetal)" stroke-width="6" stroke-linecap="round"/><path d="M8,20 C8,10 15,5 24,5 C33,5 40,10 40,20 Z" fill="url(#giMetalV)"/><ellipse cx="24" cy="20" rx="16" ry="4.5" fill="#b8c3d3"/><ellipse cx="24" cy="20" rx="13" ry="3" fill="#8798b0"/>
    <g fill="#5d6f88">${[-8, -4, 0, 4, 8].map(x => `<circle cx="${24 + x}" cy="20" r=".9"/>`).join('')}</g><path d="M12,13 C14,9 18,7 22,6.5" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" opacity=".9"/></g>
    <g stroke="#5fb8ff" stroke-width="2" stroke-linecap="round"><path d="M14,30 L10,40"/><path d="M20,31 L18,43"/><path d="M26,30 L27,42"/></g>`;

  I.mask = shadow + `<path d="${rr(8, 21, 32, 22, 6)}" fill="#ffffff"/>${side(rr(8, 21, 32, 22, 6))}<path d="${rr(6, 14, 36, 9, 3.5)}" fill="#5fc27a"/>${top(rr(6, 14, 36, 9, 3.5))}
    <path d="M12,21 C16,14 32,14 36,21 Z" fill="#a8e6a3"/><path d="M12,21 C16,14 32,14 36,21" stroke="#7fd07f" stroke-width="1" fill="none"/>
    <rect x="12" y="28" width="24" height="9" rx="2" fill="#e9f7ea"/><path d="M15,32.5 h18" stroke="#5fc27a" stroke-width="1.6" stroke-linecap="round"/>
    <g transform="translate(36 9)"><circle r="7.5" fill="#4fae5e"/><circle r="6" fill="#c8ec9c"/><circle r="4" fill="#e6f8cc"/><g fill="#9cc96f">${[0, 72, 144, 216, 288].map(a => `<ellipse cx="${(Math.cos(a * Math.PI / 180) * 2.4).toFixed(1)}" cy="${(Math.sin(a * Math.PI / 180) * 2.4).toFixed(1)}" rx=".7" ry="1.2" transform="rotate(${a + 90} ${(Math.cos(a * Math.PI / 180) * 2.4).toFixed(1)} ${(Math.sin(a * Math.PI / 180) * 2.4).toFixed(1)})"/>`).join('')}</g></g>`;

  I.sponge2 = shadow + `<path d="M24,5 C30,5 37,15 38,25 C39,36 32,43 24,43 C16,43 9,36 10,25 C11,15 18,5 24,5 Z" fill="#ff9fc4"/><path d="M24,5 C30,5 37,15 38,25 C39,36 32,43 24,43 C16,43 9,36 10,25 C11,15 18,5 24,5 Z" fill="url(#giBall)"/>
    <g fill="#e66f9f" opacity=".45">${[[18, 28, 1.2], [26, 24, 1], [29, 33, 1.3], [21, 36, 1], [31, 27, .9], [16, 21, .9]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')}</g><path d="M15,18 C17,12 20,9 23,8.5" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".75"/>`;

  I.foundation = shadow + `<path d="${rr(13, 15, 22, 30, 5)}" fill="#f0c49a"/><path d="${rr(13, 15, 22, 30, 5)}" fill="url(#giGlass)"/><path d="${rr(13, 15, 22, 30, 5)}" fill="none" stroke="#e2b07f" stroke-width="1"/>
    <path d="M13,26 h22 v14 a5,5 0 0 1 -5,5 h-12 a5,5 0 0 1 -5,-5 z" fill="#e3a978" opacity=".65"/><path d="${rr(17, 4, 14, 12, 2.5)}" fill="#2f1f38"/>${side(rr(17, 4, 14, 12, 2.5))}<rect x="16" y="14.5" width="16" height="2.5" fill="url(#giGold)"/>
    <path d="${rr(17, 22, 14, 7, 1.5)}" fill="#fff" opacity=".9"/><path d="M19.5,25.5 h9" stroke="#c48d5c" stroke-width="1.2" stroke-linecap="round"/>`;

  I.lens = shadow + `<path d="${rr(3, 15, 42, 22, 11)}" fill="#ffffff"/>${side(rr(3, 15, 42, 22, 11))}<path d="${rr(3, 15, 42, 22, 11)}" fill="none" stroke="#e5d6ee" stroke-width="1.2"/>
    <circle cx="14" cy="26" r="8.4" fill="#6cc3ff"/><circle cx="14" cy="26" r="8.4" fill="url(#giBall)"/><circle cx="14" cy="26" r="3.6" fill="#24405e"/><circle cx="11.5" cy="23" r="2" fill="#fff"/>
    <circle cx="34" cy="26" r="8.4" fill="#b48ce8"/><circle cx="34" cy="26" r="8.4" fill="url(#giBall)"/><circle cx="34" cy="26" r="3.6" fill="#3a2460"/><circle cx="31.5" cy="23" r="2" fill="#fff"/><text x="10.5" y="20" font-size="4" font-family="sans-serif" font-weight="700" fill="#9a86a8">L</text><text x="30.5" y="20" font-size="4" font-family="sans-serif" font-weight="700" fill="#9a86a8">R</text>`;

  I.eyeshadow = shadow + `<g transform="rotate(-38 24 24)"><path d="${rr(21.8, 20, 4.4, 26, 2.2)}" fill="#3b2547"/>${side(rr(21.8, 20, 4.4, 26, 2.2))}<rect x="20.8" y="14.5" width="6.4" height="7" rx="1" fill="url(#giMetal)"/><path d="M20.6,15 C19,10 20.5,3 24,1.5 C27.5,3 29,10 27.4,15 Z" fill="#c9a7ff"/><path d="M20.6,15 C19,10 20.5,3 24,1.5 C27.5,3 29,10 27.4,15 Z" fill="url(#giSide)"/><path d="M22.4,12 C22,8 22.6,5 24,3.5" stroke="#fff" stroke-width="1.2" fill="none" opacity=".6"/></g>`;

  I.liner = shadow + `<g transform="rotate(40 24 24)"><path d="${rr(20, 6, 8, 30, 2)}" fill="#3b2547"/>${side(rr(20, 6, 8, 30, 2))}<rect x="19.6" y="12" width="8.8" height="3.5" fill="url(#giGold)"/><path d="M20,36 L28,36 L24.6,44 L23.4,44 Z" fill="#f0d6b8"/><path d="M22.6,41.5 L25.4,41.5 L24.4,45 L23.6,45 Z" fill="#1a1016"/><path d="M22,9 v24" stroke="#fff" stroke-width="1.2" opacity=".35"/></g>`;

  I.mascara = shadow + `<g transform="rotate(-35 24 24)"><path d="${rr(18.5, 21, 11, 25, 4)}" fill="#ff6fa5"/>${side(rr(18.5, 21, 11, 25, 4))}<rect x="18" y="20" width="12" height="3.5" fill="url(#giGold)"/><rect x="22.5" y="8" width="3" height="13" fill="url(#giMetal)"/>
    <path d="${rr(20, 1, 8, 9.5, 3.8)}" fill="#1f1420"/><g stroke="#4a3a4a" stroke-width=".8">${[2.5, 4.5, 6.5, 8.5].map(y => `<path d="M19,${y} h10"/>`).join('')}</g><path d="M21,25 v17" stroke="#fff" stroke-width="1.6" opacity=".5" stroke-linecap="round"/></g>`;

  I.blender = shadow + `<g transform="rotate(28 24 24)"><path d="${rr(21.5, 24, 5, 22, 2.5)}" fill="#7fd3c0"/>${side(rr(21.5, 24, 5, 22, 2.5))}<path d="M19,19 h10 l-1,7 h-8 z" fill="url(#giMetal)"/>
    <path d="M12,13 C12,4 18,0 24,0 C30,0 36,4 36,13 C36,18 31,20.5 24,20.5 C17,20.5 12,18 12,13 Z" fill="#fff4f8"/><path d="M12,13 C12,4 18,0 24,0 C30,0 36,4 36,13 C36,18 31,20.5 24,20.5 C17,20.5 12,18 12,13 Z" fill="url(#giBall)"/>
    <path d="M13,12 C16,8 20,7 24,7 C28,7 32,8 35,12" stroke="#ffb3cf" stroke-width="3" fill="none" opacity=".7" stroke-linecap="round"/><path d="M15,15 C19,12 29,12 33,15" stroke="#c9a7ff" stroke-width="2.4" fill="none" opacity=".55" stroke-linecap="round"/>
    <g stroke="#e9d6e0" stroke-width=".6" opacity=".8">${[15, 18, 21, 24, 27, 30, 33].map(x => `<path d="M${x},18 L${x + (x - 24) * .25},${5 + Math.abs(x - 24) * .55}"/>`).join('')}</g></g>`;
  I.blushbrush = shadow + `<g transform="rotate(-30 24 24)"><path d="${rr(21, 22, 6, 24, 3)}" fill="#c58bf2"/>${side(rr(21, 22, 6, 24, 3))}<path d="M19.5,17 h9 l-1,6 h-7 z" fill="url(#giMetal)"/>
    <path d="M14.5,12 C14.5,4 19,0.5 24,0.5 C29,0.5 33.5,4 33.5,12 C33.5,16 30,18 24,18 C18,18 14.5,16 14.5,12 Z" fill="#f7a8c4"/><path d="M14.5,12 C14.5,4 19,0.5 24,0.5 C29,0.5 33.5,4 33.5,12 C33.5,16 30,18 24,18 C18,18 14.5,16 14.5,12 Z" fill="url(#giBall)"/>
    <g stroke="#e0789f" stroke-width=".6" opacity=".6">${[17, 20, 23, 26, 29, 31].map(x => `<path d="M${x},16 L${x + (x - 24) * .2},${6 + Math.abs(x - 24) * .5}"/>`).join('')}</g></g>`;

  I.lipstick = shadow + `<path d="${rr(15, 26, 18, 19, 3)}" fill="url(#giGold)"/><path d="${rr(15, 26, 18, 19, 3)}" fill="url(#giSide)"/><path d="M15,33 h18" stroke="#b7811f" stroke-width="1"/>
    <path d="${rr(17.5, 18, 13, 9, 1)}" fill="url(#giGold)"/><path d="M18.5,18.5 L18.5,8 Q22,1.5 29.5,6.5 L29.5,18.5 Z" fill="#e0245e"/><path d="M18.5,18.5 L18.5,8 Q22,1.5 29.5,6.5 L29.5,18.5 Z" fill="url(#giSide)"/><path d="M20.5,9 v8" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".55"/><path d="M18,28 v14" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".5"/>`;

  I.hilite = shadow + `<circle cx="24" cy="25" r="18.5" fill="url(#giGold)"/><circle cx="24" cy="25" r="15.5" fill="#fff5e6"/><circle cx="24" cy="25" r="15.5" fill="url(#giBall)"/>
    <g fill="#ffe6b0" opacity=".9">${Array.from({ length: 14 }, (_, i) => { const a = i * 2.39, r = Math.sqrt((i + .5) / 14) * 12; return `<circle cx="${(24 + Math.cos(a) * r).toFixed(1)}" cy="${(25 + Math.sin(a) * r).toFixed(1)}" r=".9"/>`; }).join('')}</g>
    <path d="M24,14.5 l2.2,6.3 6.3,2.2 -6.3,2.2 -2.2,6.3 -2.2,-6.3 -6.3,-2.2 6.3,-2.2 Z" fill="#fff"/><path d="M33,15 l.9,2.2 2.2,.9 -2.2,.9 -.9,2.2 -.9,-2.2 -2.2,-.9 2.2,-.9 Z" fill="#ffd54a"/>`;

  I.freckles = shadow + `<g transform="rotate(38 24 24)"><path d="${rr(20.5, 4, 7, 32, 2.5)}" fill="#a0663f"/>${side(rr(20.5, 4, 7, 32, 2.5))}<rect x="20.2" y="10" width="7.6" height="3" fill="url(#giGold)"/><path d="M20.5,36 L27.5,36 L24.5,43 L23.5,43 Z" fill="#f0d6b8"/><circle cx="24" cy="42.5" r="1" fill="#6b3f22"/></g>
    <g fill="#a0663f">${[[9, 33, 1.6], [13, 37, 1.3], [8, 40, 1.1], [15, 42, 1.4], [11, 29, 1]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')}</g>`;

  I.sticker = shadow + `<path d="${rr(6, 6, 36, 36, 6)}" fill="#ffffff" transform="rotate(-6 24 24)"/><path d="${rr(6, 6, 36, 36, 6)}" fill="none" stroke="#f0d5e6" stroke-width="1.2" stroke-dasharray="2 2" transform="rotate(-6 24 24)"/>
    <path d="${ART.heart(18, 20, 8)}" fill="#ff4f8b"/><path d="${ART.heart(18, 20, 8)}" fill="url(#giBall)"/><path d="${ART.star(31, 30, 8, 3.5)}" fill="#ffd54a"/><path d="${ART.star(31, 30, 8, 3.5)}" fill="url(#giBall)"/><path d="${ART.spark4(15, 34, 4)}" fill="#8fd0ff"/><path d="M36,9 L42,9 L42,15 Z" fill="#f5e6f0"/>`;
})();
