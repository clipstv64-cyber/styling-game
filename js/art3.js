'use strict';
/* =========================================================
   ART 3 — salon redesign after the reference picture:
   pink beauty room, Hollywood mirror with glowing bulbs,
   perfume shelves, trailing plant, flowers, brush cup.
   ========================================================= */
(() => {
  const A = ART;
  const r1 = n => Math.round(n * 10) / 10;

  const perfume = (x, y, w, h, glass, cap, kind = 0) => {
    const g = `<path d="M${x},${y} L${x + w},${y} L${x + w},${y - h + 6} Q${x + w},${y - h} ${x + w - 6},${y - h} L${x + 6},${y - h} Q${x},${y - h} ${x},${y - h + 6} Z" fill="${glass}" opacity=".85"/>`
      + `<path d="M${x + 2},${y - 2} L${x + w - 2},${y - 2} L${x + w - 2},${y - h * .55} L${x + 2},${y - h * .55} Z" fill="${glass}" opacity=".9"/>`
      + `<rect x="${x + w * .18}" y="${y - h + 4}" width="${w * .16}" height="${h - 8}" rx="2" fill="#fff" opacity=".55"/>`
      + `<rect x="${x + w * .2}" y="${y - h * .48}" width="${w * .6}" height="${h * .22}" rx="1.5" fill="#fff" opacity=".75"/>`;
    const c = kind === 1
      ? `<rect x="${x + w * .3}" y="${y - h - 8}" width="${w * .4}" height="9" rx="1.5" fill="url(#s3Gold)"/><ellipse cx="${x + w / 2}" cy="${y - h - 14}" rx="${w * .34}" ry="7" fill="${cap}"/><ellipse cx="${x + w / 2 - 2}" cy="${y - h - 16}" rx="${w * .12}" ry="3" fill="#fff" opacity=".6"/>`
      : kind === 2
        ? `<rect x="${x + w * .28}" y="${y - h - 6}" width="${w * .44}" height="7" fill="url(#s3Gold)"/><path d="M${x + w * .2},${y - h - 6} L${x + w * .8},${y - h - 6} L${x + w * .68},${y - h - 24} L${x + w * .32},${y - h - 24} Z" fill="${cap}"/>`
        : `<rect x="${x + w * .25}" y="${y - h - 12}" width="${w * .5}" height="13" rx="2" fill="url(#s3Gold)"/><rect x="${x + w * .3}" y="${y - h - 10}" width="${w * .08}" height="9" fill="#fff" opacity=".6"/>`;
    return `<ellipse cx="${x + w / 2}" cy="${y + 1}" rx="${w * .6}" ry="3" fill="#b0507a" opacity=".18"/>` + g + c;
  };
  const shelf = (x, y, w) => `<rect x="${x}" y="${y}" width="${w}" height="9" rx="2" fill="#fff3f8"/><rect x="${x}" y="${y + 7}" width="${w}" height="5" rx="2" fill="#e9b5cc"/><rect x="${x}" y="${y + 12}" width="${w}" height="10" fill="#c97a9e" opacity=".12"/>`;
  const bulb = (x, y) => `<circle cx="${x}" cy="${y}" r="30" fill="url(#s3Glow)"/><circle cx="${x}" cy="${y}" r="10.5" fill="#fff2cf"/><circle cx="${x}" cy="${y}" r="10.5" fill="url(#s3Bulb)"/><circle cx="${r1(x - 3)}" cy="${r1(y - 3.5)}" r="3.2" fill="#fff" opacity=".95"/>`;
  const leaf = (x, y, a, s, c) => `<path d="M0,0 C${4 * s},${-5 * s} ${11 * s},${-4 * s} ${14 * s},0 C${11 * s},${4 * s} ${4 * s},${5 * s} 0,0 Z" fill="${c}" transform="translate(${r1(x)} ${r1(y)}) rotate(${r1(a)})"/><path d="M0,0 L${12 * s},0" stroke="#2f7a46" stroke-width=".6" opacity=".5" transform="translate(${r1(x)} ${r1(y)}) rotate(${r1(a)})"/>`;
  const vine = (x, y, len, dir, seed) => { let s = '', px = x, py = y; for (let i = 0; i < len; i++) { const ny = py + 13, nx = px + Math.sin((i + seed) * .9) * 5 * dir; s += `<path d="M${r1(px)},${r1(py)} Q${r1(px + 4 * dir)},${r1(py + 6)} ${r1(nx)},${r1(ny)}" stroke="#4f9a5f" stroke-width="1.4" fill="none"/>` + leaf(nx, ny, (i % 2 ? 30 : 150) + dir * 10, .8 + (i % 3) * .12, i % 3 ? '#5fb36f' : '#7cc887'); px = nx; py = ny; } return s; };
  const blossom = (x, y, r) => `<g transform="translate(${r1(x)} ${r1(y)})">${[0, 72, 144, 216, 288].map(a => `<ellipse cx="0" cy="${-r * .62}" rx="${r * .48}" ry="${r * .62}" fill="#fffdf8" transform="rotate(${a})"/>`).join('')}<circle r="${r * .3}" fill="#f6d27a"/><circle r="${r * .14}" fill="#e6a94a"/></g>`;

  A.BG.salonDrawn = () => {
    let panels = '';
    for (const x of [12, 112, 212, 312]) panels += `<rect x="${x}" y="40" width="76" height="560" rx="6" fill="none" stroke="#f3b9d1" stroke-width="2"/><rect x="${x + 3}" y="43" width="70" height="554" rx="5" fill="none" stroke="#fff" stroke-width="1.2" opacity=".55"/>`;
    let bulbs = ''; const N = 16;
    for (let i = 0; i < N; i++) { const a = -Math.PI / 2 + i / N * Math.PI * 2; bulbs += bulb(r1(200 + Math.cos(a) * 166), r1(300 + Math.sin(a) * 232)); }
    const L = perfume(6, 286, 22, 40, '#ffc6dc', '#ffb3cf', 1) + perfume(32, 286, 16, 30, '#ffe8b8', '#d9a441', 0) + perfume(52, 286, 20, 46, '#f7d0e2', '#f1a7c6', 2)
      + perfume(8, 452, 18, 36, '#e7d6ff', '#c9a7ff', 2) + perfume(30, 452, 24, 28, '#ffd9b8', '#e8a46a', 1) + perfume(58, 452, 14, 40, '#ffcfe0', '#ff9fc4', 0);
    const R = perfume(330, 452, 22, 38, '#ffd9b8', '#e8a46a', 1) + perfume(356, 452, 16, 46, '#f7d0e2', '#f1a7c6', 0) + perfume(376, 452, 18, 30, '#ffe8b8', '#d9a441', 2)
      + perfume(334, 612, 26, 34, '#ffc6dc', '#ffb3cf', 1) + perfume(364, 612, 18, 44, '#e7d6ff', '#c9a7ff', 0);
    let flowers = ''; [[34, 600, 11], [52, 588, 10], [70, 602, 11], [22, 618, 10], [46, 614, 12], [66, 624, 10], [86, 612, 9], [30, 636, 9], [58, 638, 10], [80, 632, 9], [42, 574, 9], [64, 578, 8]].forEach(([x, y, r]) => { flowers += blossom(x, y, r); });
    let fleaves = ''; [[20, 640, 160], [90, 640, 20], [14, 620, 200], [96, 618, -20], [40, 650, 120], [76, 652, 60]].forEach(([x, y, a]) => { fleaves += leaf(x, y, a, 1.4, '#6dbb79'); });
    const brushes = [[360, 640, -8, '#3b2a2e', '#7a5640'], [372, 636, 4, '#2e2226', '#c9965f'], [384, 642, 14, '#4a3238', '#e8b996']].map(([x, y, a, h, t]) => `<g transform="rotate(${a} ${x} ${y})"><rect x="${x - 2}" y="${y - 40}" width="4" height="42" rx="2" fill="${h}"/><rect x="${x - 2.6}" y="${y - 46}" width="5.2" height="8" fill="url(#s3Gold)"/><path d="M${x - 4},${y - 46} C${x - 6},${y - 58} ${x - 2},${y - 66} ${x},${y - 68} C${x + 2},${y - 66} ${x + 6},${y - 58} ${x + 4},${y - 46} Z" fill="${t}"/></g>`).join('');
    return `<svg viewBox="0 0 400 860" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><defs>
      <linearGradient id="s3Wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbd3e3"/><stop offset=".55" stop-color="#f8c6db"/><stop offset="1" stop-color="#f3b4cd"/></linearGradient>
      <radialGradient id="s3Room" cx=".5" cy=".36" r=".7"><stop offset="0" stop-color="#fff4f8" stop-opacity=".85"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/></radialGradient>
      <linearGradient id="s3Gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff1c8"/><stop offset=".35" stop-color="#e9c07a"/><stop offset=".65" stop-color="#c8924a"/><stop offset="1" stop-color="#f3d79a"/></linearGradient>
      <linearGradient id="s3Frame" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f8e2c2"/><stop offset=".3" stop-color="#e9bf8f"/><stop offset=".55" stop-color="#d79a6a"/><stop offset=".8" stop-color="#f0cfa6"/><stop offset="1" stop-color="#c98a5e"/></linearGradient>
      <linearGradient id="s3Glass" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" stop-color="#eef3fb"/><stop offset=".5" stop-color="#d9e3f2"/><stop offset="1" stop-color="#cfd6ea"/></linearGradient>
      <radialGradient id="s3Glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff5d8" stop-opacity=".95"/><stop offset=".35" stop-color="#ffe9b0" stop-opacity=".45"/><stop offset="1" stop-color="#ffd890" stop-opacity="0"/></radialGradient>
      <radialGradient id="s3Bulb" cx=".38" cy=".35" r=".7"><stop offset="0" stop-color="#ffffff"/><stop offset=".6" stop-color="#fff3d2"/><stop offset="1" stop-color="#f6d79c"/></radialGradient>
      <linearGradient id="s3Chair" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e86aa0"/><stop offset=".35" stop-color="#ff9cc6"/><stop offset=".7" stop-color="#f77fb3"/><stop offset="1" stop-color="#d9578f"/></linearGradient>
      <radialGradient id="s3Vig" cx=".5" cy=".42" r=".75"><stop offset=".6" stop-color="#b8507e" stop-opacity="0"/><stop offset="1" stop-color="#b8507e" stop-opacity=".22"/></radialGradient>
    </defs>
    <rect width="400" height="860" fill="url(#s3Wall)"/><rect width="400" height="860" fill="url(#s3Room)"/>
    ${panels}
    <rect x="0" y="600" width="400" height="260" fill="#f1aac6"/><rect x="0" y="600" width="400" height="6" fill="#fff0f6"/><rect x="0" y="606" width="400" height="4" fill="#d98aae" opacity=".4"/>
    ${shelf(0, 286, 86)}${shelf(0, 452, 86)}${shelf(318, 452, 82)}${shelf(318, 612, 82)}${shelf(318, 286, 82)}
    ${L}${R}
    <path d="M352,286 C344,270 352,250 368,246 C388,242 398,258 392,286 Z" fill="#f4e6ee"/><path d="M350,286 L394,286 L390,262 L354,262 Z" fill="#fff6fa"/>${leaf(360, 252, -120, 1.4, '#5fb36f')}${leaf(372, 248, -70, 1.5, '#7cc887')}${leaf(384, 252, -30, 1.3, '#5fb36f')}${leaf(366, 258, 200, 1.2, '#7cc887')}
    ${vine(358, 286, 12, -1, 0)}${vine(382, 286, 9, 1, 2)}${vine(370, 286, 6, 1, 4)}
    <ellipse cx="200" cy="304" rx="190" ry="258" fill="url(#s3Glow)" opacity=".55"/>
    <ellipse cx="203" cy="309" rx="182" ry="248" fill="#a8587a" opacity=".2"/>
    <ellipse cx="200" cy="300" rx="182" ry="248" fill="url(#s3Frame)"/>
    <ellipse cx="200" cy="300" rx="172" ry="238" fill="none" stroke="#fff4e2" stroke-width="2" opacity=".85"/>
    <ellipse cx="200" cy="300" rx="152" ry="216" fill="#c48b62"/>
    <ellipse cx="200" cy="300" rx="148" ry="212" fill="url(#s3Glass)"/>
    <g opacity=".5" stroke="#fff" stroke-linecap="round"><path d="M92,200 L170,102" stroke-width="22"/><path d="M84,262 L196,130" stroke-width="7"/><path d="M262,478 L320,404" stroke-width="14"/></g>
    ${bulbs}
    <g transform="translate(0 4)">
      <path d="M90,860 L90,560 C90,500 136,476 200,476 C264,476 310,500 310,560 L310,860 Z" fill="#b8306a" opacity=".22" transform="translate(0 6)"/>
      <path d="M90,860 L90,560 C90,500 136,476 200,476 C264,476 310,500 310,560 L310,860 Z" fill="url(#s3Chair)"/>
      <path d="M110,540 C124,506 156,494 196,492" stroke="#fff" stroke-width="6" fill="none" opacity=".35" stroke-linecap="round"/>
    </g>
    <path d="M24,662 C22,644 34,636 56,636 C78,636 90,644 88,662 L82,700 L30,700 Z" fill="#e9e3ea"/><path d="M24,662 C22,644 34,636 56,636 C78,636 90,644 88,662 Z" fill="#fff" opacity=".5"/>
    ${fleaves}${flowers}
    <path d="M352,644 L392,644 L388,700 L356,700 Z" fill="#ffe4ef"/><path d="M352,644 L392,644 L391,652 L353,652 Z" fill="#fff"/>${brushes}
    <rect width="400" height="860" fill="url(#s3Vig)"/></svg>`;
  };
  /* salon = the room from the reference picture (img/salon.jpg), aligned to the character by js/bgfit */
  A.BG.salon = () => `<div class="bgimg"><img id="salon-img" src="img/salon.jpg" alt="" draggable="false"></div>`;
})();
