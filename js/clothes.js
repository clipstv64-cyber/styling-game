'use strict';
/* =========================================================
   CLOTHES KIT — tailoring helpers for highly detailed garments
   (body-fitted cuts, real sleeves, seams, folds, trims, prints)
   ========================================================= */
const CK = (() => {
  const sh = (c, p) => U.shade(c, p), mix = (a, b, t) => U.mix(a, b, t);
  const f = n => Math.round(n * 10) / 10;
  const pt = p => `${f(p[0])},${f(p[1])}`;
  const mir = ART.mirror;

  /* ---------- smooth paths ---------- */
  const crSeg = pts => {
    let s = '';
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(i - 1, 0)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(i + 2, pts.length - 1)];
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      s += ` C${pt(c1)} ${pt(c2)} ${pt(p2)}`;
    }
    return s;
  };
  const cr = pts => `M${pt(pts[0])}${crSeg(pts)}`;
  /* runs = list of smooth runs, consecutive runs meet at sharp corners */
  const runs = (rs, close = true) => {
    let s = `M${pt(rs[0][0])}`, last = rs[0][0];
    rs.forEach(r => { const q = (r[0][0] === last[0] && r[0][1] === last[1]) ? r : [last, ...r]; s += crSeg(q); last = q[q.length - 1]; });
    return s + (close ? ' Z' : '');
  };
  const mx = p => [400 - p[0], p[1]];
  /* symmetric garment: left half runs from centre-top to centre-bottom */
  const sym = left => {
    const right = left.slice().reverse().map(r => r.slice().reverse().map(mx));
    return runs([...left, ...right]);
  };

  /* ---------- body contour (left side) ---------- */
  const TORSO = [[352, 186], [358, 175], [364, 162], [370, 152], [378, 145], [390, 143], [405, 146], [420, 149], [440, 153], [460, 157], [480, 160], [500, 163], [522, 166], [540, 161], [560, 155], [580, 150], [598, 148], [620, 150], [660, 156], [700, 160], [740, 163], [780, 166], [820, 167], [860, 169], [900, 171]];
  const INLEG = [[600, 200], [620, 199], [660, 198], [700, 197], [740, 196], [780, 192], [820, 191], [860, 190], [900, 189], [912, 189]];
  const lerpT = (T, y) => { if (y <= T[0][0]) return T[0][1]; for (let i = 1; i < T.length; i++) if (y <= T[i][0]) { const a = T[i - 1], b = T[i], t = (y - a[0]) / (b[0] - a[0]); return a[1] + (b[1] - a[1]) * t; } return T[T.length - 1][1]; };
  const BL = y => lerpT(TORSO, y), IL = y => lerpT(INLEG, y);
  const side = (y0, y1, ease = 4, step = 18) => {
    const e = typeof ease === 'function' ? ease : () => ease, out = [], n = Math.max(1, Math.round(Math.abs(y1 - y0) / step));
    for (let i = 0; i <= n; i++) { const y = y0 + (y1 - y0) * i / n; out.push([BL(y) - e(y, i / n), y]); }
    return out;
  };
  const inleg = (y0, y1, ease = 3, step = 24) => {
    const e = typeof ease === 'function' ? ease : () => ease, out = [], n = Math.max(1, Math.round(Math.abs(y1 - y0) / step));
    for (let i = 0; i <= n; i++) { const y = y0 + (y1 - y0) * i / n; out.push([IL(y) + e(y, i / n), y]); }
    return out;
  };

  /* ---------- dynamic patterns (coloured per garment colour) ---------- */
  let defs = null;
  const D = () => defs || (defs = document.querySelector('#char defs'));
  const key = c => String(c).replace(/[^a-z0-9]/gi, '');
  const dyn = (id, mk) => { if (!document.getElementById(id)) D().insertAdjacentHTML('beforeend', mk()); return `url(#${id})`; };
  const PAT = {
    tartan: (c, acc = '#ffd84d') => dyn(`dpTar${key(c)}${key(acc)}`, () => { const d1 = sh(c, -38), d2 = sh(c, -58), l = sh(c, 40); return `<pattern id="dpTar${key(c)}${key(acc)}" width="40" height="40" patternUnits="userSpaceOnUse">`
      + `<rect x="0" y="0" width="14" height="40" fill="${d1}" opacity=".55"/><rect x="0" y="0" width="40" height="14" fill="${d1}" opacity=".55"/>`
      + `<rect x="4" y="0" width="5" height="40" fill="${d2}" opacity=".45"/><rect x="0" y="4" width="40" height="5" fill="${d2}" opacity=".45"/>`
      + `<rect x="26" y="0" width="1.6" height="40" fill="${acc}" opacity=".85"/><rect x="0" y="26" width="40" height="1.6" fill="${acc}" opacity=".85"/>`
      + `<rect x="20" y="0" width="1" height="40" fill="${l}" opacity=".6"/><rect x="0" y="20" width="40" height="1" fill="${l}" opacity=".6"/>`
      + `<path d="M0,40 L40,0" stroke="#000" stroke-opacity=".05" stroke-width="1"/></pattern>`; }),
    breton: (c, s) => dyn(`dpBre${key(c)}${key(s)}`, () => `<pattern id="dpBre${key(c)}${key(s)}" width="12" height="13" patternUnits="userSpaceOnUse"><rect y="0" width="12" height="5.2" fill="${s}"/></pattern>`),
    gingham: c => dyn(`dpGin${key(c)}`, () => `<pattern id="dpGin${key(c)}" width="14" height="14" patternUnits="userSpaceOnUse"><rect width="14" height="14" fill="#fff"/><rect width="7" height="14" fill="${c}" opacity=".5"/><rect width="14" height="7" fill="${c}" opacity=".5"/></pattern>`),
    dots: (c, d = '#fff', r = 2.6, s = 16) => dyn(`dpDot${key(c)}${key(d)}${s}`, () => `<pattern id="dpDot${key(c)}${key(d)}${s}" width="${s}" height="${s}" patternUnits="userSpaceOnUse"><circle cx="${s / 4}" cy="${s / 4}" r="${r}" fill="${d}"/><circle cx="${s * .75}" cy="${s * .75}" r="${r}" fill="${d}"/></pattern>`),
    floral: (c, base) => dyn(`dpFlo${key(c)}${key(base)}`, () => { const p = sh(c, 25), d = sh(c, -25), lf = '#5fae6e';
      const rose = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/><path d="M${x - r * .55},${y} a${r * .55},${r * .55} 0 1 1 ${r * 1.1},0" fill="none" stroke="${d}" stroke-width=".9"/><path d="M${x - r * .25},${y + r * .1} a${r * .3},${r * .3} 0 1 0 ${r * .6},0" fill="none" stroke="${d}" stroke-width=".8"/><circle cx="${x - r * .35}" cy="${y - r * .4}" r="${r * .28}" fill="${p}"/>`;
      const leaf = (x, y, a) => `<ellipse cx="${x}" cy="${y}" rx="4" ry="1.8" fill="${lf}" transform="rotate(${a} ${x} ${y})"/>`;
      return `<pattern id="dpFlo${key(c)}${key(base)}" width="36" height="36" patternUnits="userSpaceOnUse"><rect width="36" height="36" fill="${base}"/>${leaf(14, 13, 30)}${leaf(4, 8, -40)}${rose(9, 9, 5)}${leaf(30, 30, -30)}${leaf(22, 31, 40)}${rose(27, 26, 4.2)}<circle cx="27" cy="7" r="1.6" fill="${p}"/><circle cx="7" cy="28" r="1.4" fill="${p}"/><circle cx="18" cy="20" r="1" fill="${d}"/></pattern>`; }),
    hearts: (c, h) => dyn(`dpHrt${key(c)}${key(h)}`, () => `<pattern id="dpHrt${key(c)}${key(h)}" width="22" height="22" patternUnits="userSpaceOnUse"><path d="${ART.heart(6, 7, 3.6)}" fill="${h}"/><path d="${ART.heart(17, 18, 3)}" fill="${h}" opacity=".8"/></pattern>`),
    stars: (c, s) => dyn(`dpStr${key(c)}${key(s)}`, () => `<pattern id="dpStr${key(c)}${key(s)}" width="26" height="26" patternUnits="userSpaceOnUse"><path d="${ART.star(7, 7, 4.2, 1.8)}" fill="${s}"/><path d="${ART.star(19, 19, 3, 1.3)}" fill="${s}" opacity=".75"/><circle cx="20" cy="6" r=".9" fill="${s}"/></pattern>`),
    leo: c => dyn(`dpLeo${key(c)}`, () => { const d = sh(c, -62), m = sh(c, -22);
      const spot = (x, y, r, a) => `<g transform="rotate(${a} ${x} ${y})"><ellipse cx="${x}" cy="${y}" rx="${r * 1.2}" ry="${r}" fill="${m}"/><path d="M${x - r * 1.3},${y - r * .2} q${r * .3},${-r * 1.1} ${r * 1.2},${-r * 1}" stroke="${d}" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M${x + r * .2},${y + r * 1.05} q${r * .9},0 ${r * 1.2},${-r * 1}" stroke="${d}" stroke-width="2" fill="none" stroke-linecap="round"/></g>`;
      return `<pattern id="dpLeo${key(c)}" width="40" height="40" patternUnits="userSpaceOnUse">${spot(10, 10, 4, 20)}${spot(30, 22, 3.6, -30)}${spot(14, 32, 3, 60)}<circle cx="30" cy="6" r="1.5" fill="${d}"/><circle cx="4" cy="22" r="1.3" fill="${d}"/></pattern>`; }),
    argyle: (c, a, l) => dyn(`dpArg${key(c)}${key(a)}`, () => `<pattern id="dpArg${key(c)}${key(a)}" width="28" height="36" patternUnits="userSpaceOnUse"><path d="M14,0 L28,18 L14,36 L0,18 Z" fill="${a}"/><path d="M0,0 L28,36 M28,0 L0,36" stroke="${l}" stroke-width="1" stroke-dasharray="2.5 2"/></pattern>`),
    cable: c => dyn(`dpCab${key(c)}`, () => { const d = sh(c, -22), h = sh(c, 18);
      return `<pattern id="dpCab${key(c)}" width="26" height="30" patternUnits="userSpaceOnUse"><rect x="0" width="3" height="30" fill="${d}" opacity=".55"/><rect x="23" width="3" height="30" fill="${d}" opacity=".55"/>`
        + `<path d="M7,0 C7,8 19,7 19,15 C19,23 7,22 7,30" stroke="${d}" stroke-width="5.2" fill="none"/><path d="M19,0 C19,8 7,7 7,15 C7,23 19,22 19,30" stroke="${d}" stroke-width="5.2" fill="none"/>`
        + `<path d="M7,0 C7,8 19,7 19,15 C19,23 7,22 7,30" stroke="${h}" stroke-width="2.2" fill="none" opacity=".8"/><path d="M19,0 C19,8 7,7 7,15" stroke="${h}" stroke-width="2.2" fill="none" opacity=".8"/></pattern>`; }),
    quilt: c => dyn(`dpQlt${key(c)}`, () => `<pattern id="dpQlt${key(c)}" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="16" height="16" fill="#fff" opacity=".07"/><rect x="1" y="1" width="14" height="14" rx="3" fill="#fff" opacity=".1"/><path d="M0,0 L16,0 M0,0 L0,16" stroke="${sh(c, -40)}" stroke-width="1.2" stroke-dasharray="2 1.5" opacity=".8"/></pattern>`),
    rib: c => dyn(`dpRib${key(c)}`, () => `<pattern id="dpRib${key(c)}" width="5" height="6" patternUnits="userSpaceOnUse"><rect width="2" height="6" fill="${sh(c, -20)}" opacity=".55"/><rect x="2.6" width="1" height="6" fill="#fff" opacity=".18"/></pattern>`),
    cord: c => dyn(`dpCrd${key(c)}`, () => `<pattern id="dpCrd${key(c)}" width="6" height="8" patternUnits="userSpaceOnUse"><rect width="2.4" height="8" fill="${sh(c, -18)}" opacity=".6"/><rect x="3.4" width="1.6" height="8" fill="#fff" opacity=".16"/></pattern>`),
    lace: c => dyn(`dpLac${key(c)}`, () => { const d = sh(c, -35), l = U.luma(c) > .6 ? sh(c, -12) : sh(c, 30);
      return `<pattern id="dpLac${key(c)}" width="18" height="18" patternUnits="userSpaceOnUse"><path d="M0,9 Q4.5,4 9,9 T18,9 M9,0 Q4,4.5 9,9 T9,18" stroke="${l}" stroke-width=".9" fill="none"/>`
        + `<circle cx="9" cy="9" r="2.6" fill="none" stroke="${l}" stroke-width="1.1"/><circle cx="9" cy="9" r="1" fill="${d}" opacity=".5"/>${[0, 90, 180, 270].map(a => `<ellipse cx="9" cy="4.6" rx="1.2" ry="1.9" fill="${l}" transform="rotate(${a + 45} 9 9)"/>`).join('')}<circle cx="0" cy="0" r="1.6" fill="${d}" opacity=".35"/><circle cx="18" cy="18" r="1.6" fill="${d}" opacity=".35"/><circle cx="0" cy="18" r="1.6" fill="${d}" opacity=".35"/><circle cx="18" cy="0" r="1.6" fill="${d}" opacity=".35"/></pattern>`; }),
    net: (c, w = 9) => dyn(`dpNet${key(c)}${w}`, () => `<pattern id="dpNet${key(c)}${w}" width="${w}" height="${w}" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0,0 L${w},0 M0,0 L0,${w}" stroke="${c}" stroke-width="1.15"/></pattern>`),
    stripeV: (c, s, w = 10, sw = 4) => dyn(`dpStV${key(c)}${key(s)}${w}`, () => `<pattern id="dpStV${key(c)}${key(s)}${w}" width="${w}" height="10" patternUnits="userSpaceOnUse"><rect width="${sw}" height="10" fill="${s}"/></pattern>`),
    pin: c => dyn(`dpPin${key(c)}`, () => `<pattern id="dpPin${key(c)}" width="9" height="10" patternUnits="userSpaceOnUse"><rect width=".9" height="10" fill="${U.luma(c) > .5 ? sh(c, -40) : sh(c, 45)}" opacity=".7"/></pattern>`),
    boucle: c => dyn(`dpBou${key(c)}`, () => { const d = sh(c, -18), l = sh(c, 22);
      return `<pattern id="dpBou${key(c)}" width="14" height="14" patternUnits="userSpaceOnUse">${[[3, 3], [10, 5], [6, 10], [13, 12], [1, 12]].map(([x, y], i) => `<path d="M${x - 2},${y} a2,2 0 1 1 2,2" stroke="${i % 2 ? d : l}" stroke-width="1.4" fill="none"/>`).join('')}</pattern>`; }),
    tweed: c => dyn(`dpTwd${key(c)}`, () => `<pattern id="dpTwd${key(c)}" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M0,10 L10,0" stroke="${sh(c, -35)}" stroke-width="1.2" opacity=".5"/><path d="M0,0 L10,10" stroke="#fff" stroke-width=".8" opacity=".25"/><circle cx="3" cy="7" r=".9" fill="#ff6fa5"/><circle cx="8" cy="3" r=".8" fill="#fff" opacity=".7"/></pattern>`),
    paisley: (c, a) => dyn(`dpPai${key(c)}${key(a)}`, () => `<pattern id="dpPai${key(c)}${key(a)}" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M10,6 C16,6 18,14 12,18 C8,21 4,18 6,14 C8,11 12,13 10,16" fill="none" stroke="${a}" stroke-width="1.5"/><circle cx="10" cy="11" r="1.6" fill="${a}"/><path d="M24,20 l2,4 -2,4 -2,-4 Z" fill="${a}" opacity=".8"/><circle cx="24" cy="6" r="1.2" fill="${a}"/><circle cx="4" cy="26" r="1.2" fill="${a}"/></pattern>`),
    strawb: () => dyn('dpStraw', () => `<pattern id="dpStraw" width="10" height="10" patternUnits="userSpaceOnUse"><ellipse cx="3" cy="3" rx=".8" ry="1.2" fill="#ffe07a"/><ellipse cx="8" cy="8" rx=".8" ry="1.2" fill="#ffe07a"/></pattern>`),
  };

  /* ---------- static gradients (sheen etc.) ---------- */
  const G = () => dyn('gkSatin', () => `<linearGradient id="gkSatin" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".22"/><stop offset=".18" stop-color="#fff" stop-opacity="0"/><stop offset=".3" stop-color="#fff" stop-opacity=".42"/><stop offset=".38" stop-color="#fff" stop-opacity="0"/><stop offset=".62" stop-color="#000" stop-opacity=".06"/><stop offset=".74" stop-color="#fff" stop-opacity=".3"/><stop offset=".82" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".25"/></linearGradient>`
    + `<linearGradient id="gkLeather" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".3"/><stop offset=".2" stop-color="#fff" stop-opacity=".05"/><stop offset=".27" stop-color="#fff" stop-opacity=".38"/><stop offset=".33" stop-color="#fff" stop-opacity=".02"/><stop offset=".85" stop-color="#000" stop-opacity=".08"/><stop offset="1" stop-color="#000" stop-opacity=".32"/></linearGradient>`
    + `<linearGradient id="gkVert" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".18"/></linearGradient>`
    + `<linearGradient id="gkSleeve" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".22"/><stop offset=".35" stop-color="#fff" stop-opacity=".12"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".25"/></linearGradient>`
    + `<radialGradient id="gkBall" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#fff" stop-opacity=".85"/><stop offset=".35" stop-color="#fff" stop-opacity=".15"/><stop offset="1" stop-color="#000" stop-opacity=".3"/></radialGradient>`
    + `<linearGradient id="gkMetal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff8d8"/><stop offset=".45" stop-color="#f2c14e"/><stop offset=".55" stop-color="#c8902a"/><stop offset="1" stop-color="#ffe08a"/></linearGradient>`
    + `<linearGradient id="gkSilver" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".45" stop-color="#d9dde6"/><stop offset=".55" stop-color="#98a0b0"/><stop offset="1" stop-color="#eef1f6"/></linearGradient>`
    + `<linearGradient id="gkGlass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".75"/><stop offset=".4" stop-color="#bfe8ff" stop-opacity=".35"/><stop offset="1" stop-color="#8fd0ff" stop-opacity=".55"/></linearGradient>`
    + `<filter id="gkSoft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="1.3"/></filter>`);
  const satin = () => (G(), 'url(#gkSatin)');
  const metal = c => (G(), U.luma(c) > .8 || c === '#d9dde6' ? 'url(#gkSilver)' : 'url(#gkMetal)');

  /* ---------- painting primitives ---------- */
  const cloth = (d, c, o = {}) => {
    G();
    const pats = o.pat ? (Array.isArray(o.pat) ? o.pat : [o.pat]) : [];
    return (o.drop ? `<path d="${d}" transform="translate(${o.dx || 0} ${o.drop})" fill="#3a1424" opacity="${(o.dropOp || .16) * .5}"/><path d="${d}" transform="translate(${o.dx || 0} ${o.drop * .5})" fill="#3a1424" opacity="${(o.dropOp || .16) * .5}"/>` : '')
      + `<path d="${d}" fill="${c}"${o.op ? ` opacity="${o.op}"` : ''}/>`
      + pats.map((p, i) => `<path d="${d}" fill="${p}" opacity="${(Array.isArray(o.patOp) ? o.patOp[i] : o.patOp) ?? 1}"/>`).join('')
      + (o.shade === false ? '' : `<path d="${d}" fill="${o.shadeUrl || 'url(#fabShade)'}"/>`)
      + (o.sheen ? `<path d="${d}" fill="${o.sheen === 'leather' ? 'url(#gkLeather)' : 'url(#gkSatin)'}"/>` : '')
      + (o.vert === false ? '' : `<path d="${d}" fill="url(#gkVert)"/>`)
      + (o.edge === false ? '' : `<path d="${d}" fill="none" stroke="${o.edgeC || sh(c, -42)}" stroke-width="${o.ew || 1.3}" stroke-linejoin="round" opacity="${o.edgeOp || .55}"/>`);
  };
  const st = (d, c, op = .8, w = 1.1, dash = '2.8 2.2') => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-dasharray="${dash}" stroke-linecap="round" opacity="${op}"/>`;
  const fold = (d, c, w = 3, op = .32) => `<path d="${d}" fill="none" stroke="${sh(c, -45)}" stroke-width="${w * 1.5}" stroke-linecap="round" opacity="${op * .35}"/><path d="${d}" fill="none" stroke="${sh(c, -45)}" stroke-width="${w * .8}" stroke-linecap="round" opacity="${op * .55}"/><path d="${d}" fill="none" stroke="${sh(c, -30)}" stroke-width="${w * .3}" stroke-linecap="round" opacity="${op}"/>`;
  const shine = (d, w = 4, op = .3) => `<path d="${d}" fill="none" stroke="#fff" stroke-width="${w * 1.5}" stroke-linecap="round" opacity="${op * .35}"/><path d="${d}" fill="none" stroke="#fff" stroke-width="${w * .7}" stroke-linecap="round" opacity="${op * .6}"/>`;
  const line = (d, c, w = 1.4, op = 1) => ART.ln(d, c, w, op);
  const button = (x, y, r, c, holes = 4) => { const d = sh(c, -38);
    return `<circle cx="${x}" cy="${y + .8}" r="${r}" fill="#000" opacity=".2"/><circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/><circle cx="${x}" cy="${y}" r="${r}" fill="url(#gkBall)"/><circle cx="${x}" cy="${y}" r="${r * .72}" fill="none" stroke="${d}" stroke-width=".6" opacity=".7"/>`
      + (holes === 4 ? [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b]) => `<circle cx="${f(x + a * r * .3)}" cy="${f(y + b * r * .3)}" r="${f(r * .14)}" fill="${d}"/>`).join('') : holes === 2 ? `<circle cx="${f(x - r * .28)}" cy="${y}" r="${f(r * .15)}" fill="${d}"/><circle cx="${f(x + r * .28)}" cy="${y}" r="${f(r * .15)}" fill="${d}"/>` : ''); };
  const rivet = (x, y, r = 2, c = '#e6be6a') => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/><circle cx="${x}" cy="${y}" r="${r}" fill="url(#gkBall)"/>`;
  const gem = (x, y, r, c) => `<path d="M${x},${y - r} L${x + r * .87},${y - r * .3} L${x + r * .55},${y + r} L${x - r * .55},${y + r} L${x - r * .87},${y - r * .3} Z" fill="${c}"/><path d="M${x},${y - r} L${x + r * .35},${y - r * .1} L${x},${y + r} L${x - r * .35},${y - r * .1} Z" fill="#fff" opacity=".35"/><path d="M${x - r * .87},${y - r * .3} L${x + r * .87},${y - r * .3}" stroke="#fff" stroke-width=".6" opacity=".6"/><circle cx="${f(x - r * .3)}" cy="${f(y - r * .45)}" r="${f(r * .2)}" fill="#fff"/>`;
  const bow = (x, y, s, c, rot = 0) => { const d = sh(c, -28), l = sh(c, 30);
    return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">`
      + `<path d="M-2,2 C-6,10 -10,20 -14,26 L-7,25 L-4,30 C-2,22 0,12 1,3 Z" fill="${d}"/><path d="M2,2 C6,10 10,20 14,26 L7,25 L4,30 C2,22 0,12 -1,3 Z" fill="${d}"/>`
      + `<path d="M0,0 C-8,-12 -22,-13 -22,-2 C-22,9 -8,8 0,0 Z" fill="${c}"/><path d="M0,0 C8,-12 22,-13 22,-2 C22,9 8,8 0,0 Z" fill="${c}"/>`
      + `<path d="M-3,-1 C-9,-6 -15,-6 -17,-2 M3,-1 C9,-6 15,-6 17,-2" stroke="${d}" stroke-width="1.4" fill="none" opacity=".7"/><path d="M-16,-6 C-14,-9 -10,-9 -8,-7" stroke="${l}" stroke-width="1.6" fill="none" opacity=".8" stroke-linecap="round"/>`
      + `<path d="M0,0 C-8,-12 -22,-13 -22,-2 C-22,9 -8,8 0,0 Z M0,0 C8,-12 22,-13 22,-2 C22,9 8,8 0,0 Z" fill="none" stroke="${sh(c, -45)}" stroke-width="1" opacity=".55"/>`
      + `<ellipse cx="0" cy="0" rx="4.6" ry="5.4" fill="${sh(c, -12)}" stroke="${sh(c, -45)}" stroke-width=".9"/><path d="M-2,-3 Q0,-4 2,-3" stroke="${l}" stroke-width="1" fill="none"/></g>`; };
  const zipper = (x, y1, y2, c = '#c8ccd6', pull = true) => {
    let s = `<path d="M${x},${y1} L${x},${y2}" stroke="#555" stroke-width="2.6" opacity=".55"/>`;
    for (let y = y1 + 2; y < y2; y += 3.2) s += `<rect x="${x - 2.2}" y="${f(y)}" width="4.4" height="1.5" rx=".6" fill="${c}"/>`;
    return s + (pull ? `<rect x="${x - 2.6}" y="${y1 + 2}" width="5.2" height="5" rx="1" fill="url(#gkSilver)" stroke="#7a808c" stroke-width=".6"/><path d="M${x},${y1 + 7} L${x},${y1 + 17}" stroke="#7a808c" stroke-width="3" stroke-linecap="round"/><path d="M${x},${y1 + 7} L${x},${y1 + 17}" stroke="#eef1f6" stroke-width="1.6" stroke-linecap="round"/>` : '');
  };
  const lacing = (x, y1, y2, w1, w2, c, n = 5) => { let s = '', h = '';
    for (let i = 0; i < n; i++) { const t = i / (n - 1), y = y1 + (y2 - y1) * t, w = w1 + (w2 - w1) * t, yn = y1 + (y2 - y1) * Math.min(1, (i + 1) / (n - 1)), wn = w1 + (w2 - w1) * Math.min(1, (i + 1) / (n - 1));
      h += `<circle cx="${f(x - w)}" cy="${f(y)}" r="1.9" fill="#fff" stroke="${sh(c, -40)}" stroke-width=".8"/><circle cx="${f(x + w)}" cy="${f(y)}" r="1.9" fill="#fff" stroke="${sh(c, -40)}" stroke-width=".8"/>`;
      if (i < n - 1) s += `M${f(x - w)},${f(y)} L${f(x + wn)},${f(yn)} M${f(x + w)},${f(y)} L${f(x - wn)},${f(yn)} `; }
    return h + `<path d="${s}" stroke="${c}" stroke-width="2" fill="none" stroke-linecap="round"/><path d="${s}" stroke="#fff" stroke-width=".7" fill="none" opacity=".5"/>`; };
  /* ruffle / flounce along a polyline: bumps hang to the "outside" (normal to the left of travel) */
  const ruffle = (pts, depth, c, o = {}) => {
    const n = o.n || 10;
    let L = 0; const acc = [0]; for (let i = 1; i < pts.length; i++) { L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); acc.push(L); }
    const at = s => { let i = 1; while (i < pts.length - 1 && s > acc[i]) i++; const a = pts[i - 1], b = pts[i], t = Math.max(0, Math.min(1, (s - acc[i - 1]) / ((acc[i] - acc[i - 1]) || 1))), dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; return { p: [a[0] + dx * t, a[1] + dy * t], n: [dy / l, -dx / l] }; };
    const sgn = o.flip ? -1 : 1, M = n * 4, edge = [], base = [];
    for (let k = 0; k <= M; k++) { const a = at(L * k / M), ph = (k % 4) / 4, j = o.jit ? (.86 + .28 * (((Math.floor(k / 4) * 7919) % 13) / 13)) : 1;
      const dd = depth * j * (.74 + .26 * Math.sin(ph * Math.PI * 2 - Math.PI / 2 + Math.PI) * -1 * -1);
      const dep = depth * j * (ph === 0 ? .72 : ph === .5 ? 1.06 : .93);
      edge.push([a.p[0] + a.n[0] * dep * sgn, a.p[1] + a.n[1] * dep * sgn]); base.push(a.p); void dd; }
    const d = `M${pt(base[0])} L${pt(edge[0])}${crSeg(edge)} L${pt(base[M])}${crSeg(base.slice().reverse())} Z`;
    let folds = '', hls = '';
    for (let i = 0; i <= n; i++) { const a = at(L * i / n); folds += `M${pt([a.p[0] + a.n[0] * depth * .15 * sgn, a.p[1] + a.n[1] * depth * .15 * sgn])} L${pt([a.p[0] + a.n[0] * depth * .7 * sgn, a.p[1] + a.n[1] * depth * .7 * sgn])} `;
      if (i < n) { const m = at(L * (i + .5) / n); hls += `M${pt([m.p[0] + m.n[0] * depth * .25 * sgn, m.p[1] + m.n[1] * depth * .25 * sgn])} L${pt([m.p[0] + m.n[0] * depth * .85 * sgn, m.p[1] + m.n[1] * depth * .85 * sgn])} `; } }
    return cloth(d, c, { edgeOp: .5, ew: 1, pat: o.pat, patOp: o.patOp, vert: false, sheen: o.sheen, shade: o.shade })
      + `<path d="${folds}" stroke="${sh(c, -40)}" stroke-width="2.2" fill="none" opacity=".3" stroke-linecap="round"/><path d="${folds}" stroke="${sh(c, -30)}" stroke-width=".9" fill="none" opacity=".5" stroke-linecap="round"/>`
      + `<path d="${hls}" stroke="#fff" stroke-width="2.4" fill="none" opacity=".28" stroke-linecap="round"/>`
      + (o.trim ? `<path d="M${pt(edge[0])}${crSeg(edge)}" fill="none" stroke="${o.trim}" stroke-width="1.6" opacity=".9"/>` : '');
  };
  /* scalloped edge: row of half circles hanging below a horizontal-ish line */
  const scallops = (x0, x1, y, r, c, holes = true, curve = 0) => { let s = `M${x0},${y}`, h = ''; const n = Math.max(2, Math.round((x1 - x0) / (2 * r))), w = (x1 - x0) / n;
    for (let i = 0; i < n; i++) { const xa = x0 + i * w, xb = xa + w, yc = y + curve * Math.sin(Math.PI * (i + .5) / n); s += ` L${f(xa)},${f(yc)} A${f(w / 2)},${f(r)} 0 0 0 ${f(xb)},${f(yc)}`; if (holes) h += `<circle cx="${f(xa + w / 2)}" cy="${f(yc + r * .45)}" r="${f(r * .22)}" fill="#000" opacity=".22"/>`; }
    s += ` L${x1},${y - 2} L${x0},${y - 2} Z`;
    return `<path d="${s}" fill="${c}"/><path d="${s}" fill="none" stroke="${sh(c, -30)}" stroke-width=".9" opacity=".6"/>` + h; };
  const pleatLines = (xs, yTop, xb, yBot, c, op = .42) => xs.map((x, i) => fold(`M${x},${yTop} L${xb[i]},${yBot}`, c, 2.6, op)).join('');
  const pocket = (x, y, w, h, c, o = {}) => { const d = `M${x},${y} L${x + w},${y} L${x + w},${y + h - 5} Q${x + w / 2},${y + h + 3} ${x},${y + h - 5} Z`;
    return cloth(d, o.fill || sh(c, 4), { edgeOp: .5, ew: 1, pat: o.pat, vert: false }) + st(`M${x + 2.5},${y + 3} L${x + w - 2.5},${y + 3} M${x + 2.5},${y + 3} L${x + 2.5},${y + h - 6} Q${x + w / 2},${y + h} ${x + w - 2.5},${y + h - 6} L${x + w - 2.5},${y + 3}`, o.thread || sh(c, -35), .75, 1)
      + (o.flap ? cloth(`M${x - 1.5},${y - 2} L${x + w + 1.5},${y - 2} L${x + w + 1.5},${y + 9} L${x + w / 2},${y + 13} L${x - 1.5},${y + 9} Z`, sh(c, -6), { edgeOp: .55, ew: 1, vert: false }) + st(`M${x + 1},${y + 7} L${x + w / 2},${y + 10.5} L${x + w - 1},${y + 7}`, o.thread || sh(c, -35), .7, .9) + (o.btn ? button(x + w / 2, y + 9, 2.4, o.btn, 2) : '') : ''); };

  /* ---------- arm / sleeve geometry (left arm; mirror for right) ---------- */
  const SEG = [[[150, 386], [132, 430], [130, 480]], [[130, 480], [128, 535], [124, 590]]];
  const armAt = s => { const k = Math.min(1, Math.floor(s)), t = Math.min(1, s - k), [a, b, c] = SEG[k];
    const p = [(1 - t) * (1 - t) * a[0] + 2 * t * (1 - t) * b[0] + t * t * c[0], (1 - t) * (1 - t) * a[1] + 2 * t * (1 - t) * b[1] + t * t * c[1]];
    const d = [2 * (1 - t) * (b[0] - a[0]) + 2 * t * (c[0] - b[0]), 2 * (1 - t) * (b[1] - a[1]) + 2 * t * (c[1] - b[1])], l = Math.hypot(d[0], d[1]);
    return { p, t: [d[0] / l, d[1] / l], n: [-d[1] / l, d[0] / l] }; };
  const armS = y => (y <= 480 ? (() => { for (let s = 0; s <= 1; s += .01) if (armAt(s).p[1] >= y) return s; return 1; })() : (() => { for (let s = 1; s <= 2; s += .01) if (armAt(s).p[1] >= y) return s; return 2; })());
  /* sleeve: returns {d, cuff:[outer,inner], seam} for the left arm */
  const sleevePath = (o) => {
    const sE = o.end ?? armS(o.endY ?? 452), s0 = o.s0 || 0, w0 = o.w0 ?? 31, w1 = o.w1 ?? 28, puff = o.puff || 0, flare = o.flare || 0, N = 12;
    const outer = [], inner = [];
    for (let i = 0; i <= N; i++) { const u = i / N, s = s0 + (sE - s0) * u, a = armAt(s), w = (w0 + (w1 - w0) * u + puff * Math.sin(Math.PI * Math.min(1, u * 1.05)) + flare * u * u) / 2;
      outer.push([a.p[0] + a.n[0] * w, a.p[1] + a.n[1] * w]); inner.push([a.p[0] - a.n[0] * w, a.p[1] - a.n[1] * w]); }
    const capTop = o.cap || [[164, 365], [150, 369]];
    const iStart = inner.findIndex(p => p[1] > (o.pit || 402));
    const innerUp = inner.slice(Math.max(1, iStart)).reverse();
    const pitPt = [o.pitX || 163, o.pit || 402];
    const d = runs([[...capTop, ...outer.slice(0, 1)], outer, [outer[N], inner[N]], [inner[N], ...innerUp, pitPt], [pitPt, [o.seamX || 164, 384], capTop[0]]]);
    const a = armAt(sE);
    return { d, outer, inner, end: a, sE, seam: cr([capTop[0], [o.seamX || 164, 384], pitPt]) };
  };
  const sleeve = (c, o = {}) => {
    const S = sleevePath(o), A = S.end, wE = Math.hypot(S.outer[12][0] - S.inner[12][0], S.outer[12][1] - S.inner[12][1]) / 2;
    let s = cloth(S.d, c, { pat: o.pat, patOp: o.patOp, shadeUrl: (G(), 'url(#gkSleeve)'), sheen: o.sheen, edgeOp: .5 });
    // creases
    const fc = o.foldC || c;
    if (S.sE > .5) { const m = armAt(S.sE * .55); s += fold(`M${pt([m.p[0] - m.n[0] * 8, m.p[1] - m.n[1] * 8 + 6])} Q${pt([m.p[0], m.p[1] - 2])} ${pt([m.p[0] + m.n[0] * 9, m.p[1] + m.n[1] * 9 - 3])}`, fc, 2.4, .3); }
    if (S.sE > 1.1) { const e = armAt(1.02); s += fold(`M${pt([e.p[0] - e.n[0] * 10, e.p[1] + 3])} Q${pt([e.p[0] + 2, e.p[1] - 5])} ${pt([e.p[0] + e.n[0] * 10, e.p[1] - 4])}`, fc, 2.4, .34) + fold(`M${pt([e.p[0] - e.n[0] * 8, e.p[1] + 12])} Q${pt([e.p[0] + 1, e.p[1] + 6])} ${pt([e.p[0] + e.n[0] * 9, e.p[1] + 6])}`, fc, 2, .26);
      const lo = armAt(S.sE * .9); s += fold(`M${pt([lo.p[0] - lo.n[0] * 9, lo.p[1] - 4])} Q${pt([lo.p[0], lo.p[1] + 3])} ${pt([lo.p[0] + lo.n[0] * 9, lo.p[1] - 2])}`, fc, 2, .24); }
    s += shine(cr(S.outer.slice(1, 8).map((p, i) => { const a = armAt(S.sE * (i + 1) / 12); return [p[0] - a.n[0] * 6, p[1] - a.n[1] * 6]; })), 3.4, .22);
    if (o.seam !== false) s += st(S.seam, sh(c, -38), .55, 1);
    // cuff band / hem
    const co = S.outer[12], ci = S.inner[12], t = A.t;
    if (o.cuff) { const h = o.cuff, cc = o.cuffC || sh(c, -10), q = `M${pt(co)} L${pt(ci)} L${pt([ci[0] - t[0] * h, ci[1] - t[1] * h])} L${pt([co[0] - t[0] * h, co[1] - t[1] * h])} Z`;
      s += cloth(q, cc, { pat: o.cuffPat, vert: false, edgeOp: .5, ew: 1 }); if (o.rib) { for (let k = 1; k < 8; k++) { const u = k / 8, x0 = co[0] + (ci[0] - co[0]) * u, y0 = co[1] + (ci[1] - co[1]) * u; s += `<path d="M${f(x0)},${f(y0)} L${f(x0 - t[0] * h)},${f(y0 - t[1] * h)}" stroke="${sh(cc, -25)}" stroke-width="1" opacity=".6"/>`; } }
      if (o.cuffBtn) s += button(f(co[0] + (ci[0] - co[0]) * .7 - t[0] * h / 2), f(co[1] + (ci[1] - co[1]) * .7 - t[1] * h / 2), 2.1, o.cuffBtn, 2); }
    else if (o.hemSt !== false) s += st(`M${pt([co[0] - t[0] * 4, co[1] - t[1] * 4])} L${pt([ci[0] - t[0] * 4, ci[1] - t[1] * 4])}`, sh(c, -38), .6, 1);
    if (o.ruffle) s += ruffle([co, ci], o.ruffle, o.ruffleC || c, { n: 4, flip: true, pat: o.pat });
    if (o.lace) s += `<g transform="translate(${f((co[0] + ci[0]) / 2)} ${f((co[1] + ci[1]) / 2)}) rotate(${f(Math.atan2(ci[1] - co[1], ci[0] - co[0]) * 180 / Math.PI)})">${scallops(-wE, wE, 0, 3.2, o.lace)}</g>`;
    return { svg: s, S };
  };
  const sleeves = (c, o = {}) => mir(sleeve(c, o).svg);

  return { sh, mix, f, pt, cr, crSeg, runs, sym, mx, BL, IL, side, inleg, PAT, satin, metal, cloth, st, fold, shine, line, button, rivet, gem, bow, zipper, lacing, ruffle, scallops, pleatLines, pocket, armAt, armS, sleevePath, sleeve, sleeves, mir, G };
})();

/* ---------- registry: add / replace wardrobe items ---------- */
const WEAR = (() => {
  const add = list => list.forEach(it => {
    it.price = 0; it.tags = it.tags || {};
    const i = DATA.ITEMS.findIndex(x => x.id === it.id);
    if (i >= 0) DATA.ITEMS[i] = it; else DATA.ITEMS.push(it);
    DATA.ITEM_BY_ID[it.id] = it;
  });
  /* auto thumbnail boxes for items without one */
  const autoBox = () => {
    const ns = 'http://www.w3.org/2000/svg', svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('style', 'position:absolute;left:-9999px;top:0;width:400px;height:900px'); svg.setAttribute('viewBox', '0 0 400 960');
    document.body.appendChild(svg);
    const BX = WEAR.BOXES || {};
    DATA.ITEMS.forEach(it => {
      if (it.autoBox && BX[it.id]) { it.box = BX[it.id]; return; }
      if (it.box && !it.autoBox) return;
      const r = it.art(it.colors[0]), g = document.createElementNS(ns, 'g'); g.innerHTML = (r.sleeves || '') + (r.body || ''); svg.appendChild(g);
      try { const b = g.getBBox(), p = Math.max(b.width, b.height) * .05; it.box = b.width > 1 && b.height > 1 ? `${Math.round(b.x - p)} ${Math.round(b.y - p)} ${Math.round(b.width + 2 * p)} ${Math.round(b.height + 2 * p)}` : '0 20 400 940'; } catch (e) { it.box = '0 20 400 940'; }
      svg.removeChild(g);
    });
    svg.remove();
  };
  const W = { add, autoBox };
  return W;
})();
