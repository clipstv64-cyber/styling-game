'use strict';
/* =========================================================
   CLIENT MODE — start screen, random customers with a wish
   picture, hand-in & satisfaction rating.
   ========================================================= */
(() => {
  const D = DATA, $ = s => document.querySelector(s), app = $('#app');
  const R = Math.random, pick = a => a[Math.floor(R() * a.length)];
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const clone = o => JSON.parse(JSON.stringify(o));
  const sh = U.shade;
  const NAMES = ['Mia', 'Lena', 'Emma', 'Sofia', 'Lina', 'Ella', 'Clara', 'Nora', 'Luisa', 'Zoe', 'Amira', 'Yuna', 'Leni', 'Ida', 'Maja', 'Hanna', 'Elif', 'Paula', 'Romy', 'Aylin', 'Frieda', 'Nele', 'Malia', 'Juna'];
  const BASES = [['top_tank', 'bot_shorts'], ['top_tee', 'bot_jeans'], ['top_hoodie', 'bot_leggings'], ['top_breton', 'bot_denim'], ['top_tee', 'bot_jogger'], ['top_crop', 'bot_mini']];
  const LEN = { long: 'lang', medium: 'schulterlang', short: 'kurz' };
  const byId = id => D.ITEM_BY_ID[id];
  const PAL = id => (D.MAKEUP.find(m => m.id === id) || {}).palette || ['#ff6f91'];
  const LIPS = PAL('lips'), SHADOWS = PAL('shadow'), BLUSHES = PAL('blush');
  let C = null, count = 0, mode = 'menu';

  /* ---------------- customer & wish ---------------- */
  function makeStart() {
    const L = GAME.freshLook();
    L.skin = pick(D.SKIN); L.eye = pick(D.EYES); L.hairColor = pick(D.HAIR_COLORS.slice(0, 9));
    const [t, b] = pick(BASES), col = id => pick(byId(id).colors);
    L.outfit.top = { id: t, color: col(t) }; L.outfit.bottom = { id: b, color: col(b) };
    L.outfit.shoes = R() < .7 ? { id: 'shoe_sneaker', color: col('shoe_sneaker') } : null;
    if (R() < .2) L.outfit.glasses = { id: 'gl_round', color: col('gl_round') };
    if (R() < .3) L.outfit.ear = { id: 'ear_studs', color: col('ear_studs') };
    return L;
  }
  function makeWish(start) {
    const W = { hair: {}, mk: {}, outfit: {} }, items = cat => D.ITEMS.filter(i => i.cat === cat);
    const it = (cat, avoid) => { let i; do { i = pick(items(cat)); } while (avoid && i.id === avoid && items(cat).length > 1); return { id: i.id, color: pick(i.colors) }; };
    W.hair.color = pick(D.HAIR_COLORS.filter(c => c !== start.hairColor));
    W.hair.len = pick(['long', 'long', 'medium', 'short']);
    W.hair.curly = R() < .5;
    if (R() < .85) W.mk.lips = pick(LIPS);
    if (R() < .6) W.mk.shadow = pick(SHADOWS);
    if (R() < .5) W.mk.blush = pick(BLUSHES);
    if (R() < .45) W.eye = pick(D.EYES.filter(c => c !== start.eye));
    if (R() < .5) W.outfit.dress = it('dress');
    else { W.outfit.top = it('top', start.outfit.top.id); W.outfit.bottom = it('bottom', start.outfit.bottom.id); }
    if (R() < .75) W.outfit.shoes = it('shoes', 'shoe_sneaker');
    shuffle(['head', 'glasses', 'bag', 'jewel', 'outer', 'legwear']).slice(0, R() < .4 ? 2 : 1).forEach(cat => { const i = pick(items(cat)); W.outfit[i.slot] = { id: i.id, color: pick(i.colors) }; });
    if (W.outfit.dress && W.outfit.legwear && byId(W.outfit.dress.id).id === 'dress_overall') delete W.outfit.legwear;
    return W;
  }
  const targetLook = (S, W) => {
    const L = clone(S); L.eye = W.eye || S.eye; L.hairColor = W.hair.color; L.happy = false; L.mood = null;
    Object.entries(W.outfit).forEach(([slot, e]) => { L.outfit[slot] = { ...e }; });
    if (W.outfit.dress) { L.outfit.top = null; L.outfit.bottom = null; } else L.outfit.dress = null;
    return L;
  };

  /* ---------------- wish picture (SVG) ---------------- */
  function hairSVGBase(c, len, curly, part) {
    const dk = sh(c, -30), hl = U.luma(c) > .6 ? sh(c, 14) : U.mix(c, '#fff4ea', .38), y1 = { long: 470, medium: 385, short: 318 }[len];
    if (part === 'back') {
      const L = []; const n = 12;
      for (let k = 0; k <= n; k++) { const t = k / n, y = 150 + (y1 - 150) * t; let x = 95 - 5 * Math.sin(t * Math.PI) - (curly ? 14 * Math.sin(t * Math.PI * .85) + (k % 2 ? 0 : 7) : 0); L.push([x, y]); }
      const bot = []; const xb = L[n][0];
      for (let k = 0; k <= 8; k++) { const x = xb + (200 - xb) * k / 8; bot.push([x, y1 + (curly ? (k % 2 ? 14 : 2) : 3 + k * .4)]); }
      const d = CK.sym([[[200, 82], [150, 84], [112, 104], [96, 142]], L, bot]);
      let lines = '';
      if (!curly) for (let i = 0; i < 7; i++) { const x = 100 + i * 4; lines += `<path d="M${x + 14},${150} C${x},${230} ${x + 2},${330} ${x + 6},${y1 - 4}" stroke="${i % 2 ? dk : hl}" stroke-width="1.4" fill="none" opacity=".55"/>`; }
      else for (let y = 200; y < y1 - 6; y += 22) for (const x of [88, 104]) lines += `<path d="M${x},${y} a8,8 0 1 1 8,8" stroke="${dk}" stroke-width="1.8" fill="none" opacity=".55"/><path d="M${x + 2},${y + 2} a5,5 0 1 1 5,5" stroke="${hl}" stroke-width="1.4" fill="none" opacity=".6"/>`;
      return `<path d="${d}" fill="${c}"/><path d="${d}" fill="none" stroke="${sh(c, -42)}" stroke-width="2.2"/>` + ART.mirror(lines) + `<path d="M120,120 C150,98 250,98 280,120" stroke="${hl}" stroke-width="10" fill="none" opacity=".35" stroke-linecap="round"/>`;
    }
    // front: fringe + face-framing locks
    let bottom = '';
    const xs = []; for (let x = 290; x >= 110; x -= 9) xs.push(x);
    bottom = xs.map((x, k) => (curly ? `A8,7 0 0 1 ${x},${164}` : `L${x},${170 + Math.cos((x - 200) / 90 * Math.PI / 2) * 3 + (k % 2 ? .7 : -.7)}`)).join(' ');
    const fr = `M112,178 C108,118 148,86 200,86 C252,86 292,118 288,178 L290,166 ${bottom} L110,166 Z`;
    const ly = Math.min(y1, 470), lock = curly
      ? `M98,150 ${Array.from({ length: 8 }, (_, k) => `Q${k % 2 ? 90 : 104},${150 + (ly - 150) * (k + .5) / 8} ${98 + (k % 2 ? -3 : 3)},${150 + (ly - 150) * (k + 1) / 8}`).join(' ')} L124,${ly - 4} ${Array.from({ length: 8 }, (_, k) => `Q${k % 2 ? 130 : 118},${ly - (ly - 160) * (k + .5) / 8} 124,${ly - (ly - 160) * (k + 1) / 8}`).join(' ')} Z`
      : `M100,152 C96,230 106,340 116,${ly} L138,${ly - 8} C132,340 116,245 124,166 Z`;
    let tex = ''; for (let i = 0; i < 12; i++) { const x = 126 + i * 13; tex += `<path d="M${200 + (x - 200) * .3},${92} C${x},${110} ${x},${140} ${x + (x - 200) * .05},${162}" stroke="${i % 2 ? dk : hl}" stroke-width="1.2" fill="none" opacity=".5"/>`; }
    return ART.mirror(`<path d="${lock}" fill="${c}"/><path d="${lock}" fill="none" stroke="${sh(c, -42)}" stroke-width="1.8"/><path d="M108,180 C106,250 110,320 114,${ly - 10}" stroke="${hl}" stroke-width="2" fill="none" opacity=".45"/>`)
      + `<path d="${fr}" fill="${c}"/>` + tex + `<path d="M126,124 C150,100 250,100 274,124" stroke="${hl}" stroke-width="8" fill="none" opacity=".4" stroke-linecap="round"/><path d="${fr}" fill="none" stroke="${sh(c, -42)}" stroke-width="2"/>`;
  }
  let hairPreviewId = 0;
  function hairSVG(c,len,curly,part) {
    const id = 'atPreviewHair'+(++hairPreviewId);
    let art = hairSVGBase(c,len,curly,part);
    const defs = `<defs><linearGradient id="${id}" x1="90" y1="0" x2="310" y2="0" gradientUnits="userSpaceOnUse"><stop stop-color="${sh(c,-22)}"/><stop offset=".16" stop-color="${sh(c,14)}"/><stop offset=".3" stop-color="${c}"/><stop offset=".52" stop-color="${sh(c,10)}"/><stop offset=".7" stop-color="${c}"/><stop offset=".84" stop-color="${sh(c,20)}"/><stop offset="1" stop-color="${sh(c,-22)}"/></linearGradient><pattern id="${id}Tex" x="90" y="80" width="220" height="420" patternUnits="userSpaceOnUse"><svg width="220" height="420" viewBox="627 0 627 627" preserveAspectRatio="none"><image href="img/atelier-materials.webp" width="1254" height="1254"/></svg></pattern></defs>`;
    art = art.replace(/<path d="([^"]+)" fill="([^"]+)"\/>/g,(match,d,fill)=>fill===c ? `<path d="${d}" fill="url(#${id})"/><path d="${d}" fill="url(#${id}Tex)" opacity=".2" style="mix-blend-mode:multiply"/>` : match);
    return defs+art;
  }
  const art = e => { if (!e) return { body: '', sleeves: '' }; const i = byId(e.id); if (!i) return { body: '', sleeves: '' }; const r = i.art(e.color || i.colors[0]); return { body: r.body || '', sleeves: r.sleeves || '' }; };
  function charSVG(L, W, vb, cls = '') {
    const o = L.outfit, b = ART.body(L.skin), dress = art(o.dress), top = o.dress ? art(null) : art(o.top), bottom = o.dress ? art(null) : art(o.bottom), outer = art(o.outer);
    const mk = (W && W.mk) || {}, hair = W ? W.hair : { color: L.hairColor, len: 'long', curly: false };
    const mir = ART.mirror;
    let under = '';
    if (mk.shadow) under += `<g filter="url(#blur2)" opacity=".7">${mir(`<path d="M132,210 C138,190 184,186 192,206 C182,199 146,199 132,210 Z" fill="${mk.shadow}"/>`)}</g>`;
    if (mk.blush) under += `<g filter="url(#blur4)" opacity=".55">${mir(`<ellipse cx="146" cy="262" rx="22" ry="12" fill="${mk.blush}"/>`)}</g>`;
    const lips = mk.lips ? `<path d="${ART.LIPS}" fill="${mk.lips}" opacity=".92"/><path d="M177,285.5 C186,288.5 214,288.5 223,285.5" stroke="${sh(mk.lips, -40)}" stroke-width="1.4" fill="none"/><ellipse cx="205" cy="295" rx="6" ry="2.2" fill="#fff" opacity=".45"/>` : '';
    const feat = ART.headFeat({ ...L, happy: false }).replace(/ id="eyes(-shut)?"/g, '');
    const shoes = art(o.shoes).body, over = !o.dress && o.bottom && byId(o.bottom.id) && byId(o.bottom.id).overShoes;
    return `<svg class="${cls}" viewBox="${vb}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">`
      + hairSVG(hair.color, hair.len, hair.curly, 'back') + `<g transform="${ART.BODY_TF}">` + b.legs + art(o.legwear).body + (over ? shoes : '') + b.torso + bottom.body + (over ? '' : shoes) + dress.body + top.body + b.arms
      + (outer.sleeves ? '' : dress.sleeves + top.sleeves) + outer.body + outer.sleeves + art(o.bag).body + b.hands + art(o.necklace).body
      + '</g>' + ART.headBase(L) + under + feat + lips + hairSVG(hair.color, hair.len, hair.curly, 'front') + art(o.ear).body + art(o.glasses).body + art(o.head).body + '</svg>';
  }
  function wishList(W) {
    const sw = c => `<i class="sw-dot" style="--c:${c}"></i>`, L = [];
    L.push({ k: 'hc', t: 'Haarfarbe', c: W.hair.color }, { k: 'hl', t: 'Haare ' + LEN[W.hair.len], e: '✂️' }, { k: 'cu', t: W.hair.curly ? 'Locken' : 'Glatte Haare', e: W.hair.curly ? '🌀' : '〰️' });
    if (W.mk.lips) L.push({ k: 'li', t: 'Lippenstift', c: W.mk.lips });
    if (W.mk.shadow) L.push({ k: 'sd', t: 'Lidschatten', c: W.mk.shadow });
    if (W.mk.blush) L.push({ k: 'bl', t: 'Rouge', c: W.mk.blush });
    if (W.eye) L.push({ k: 'ey', t: 'Augenfarbe', c: W.eye });
    Object.entries(W.outfit).forEach(([slot, e]) => { const i = byId(e.id); if (i) L.push({ k: 'o:' + slot, t: i.name, c: e.color }); });
    return L.map(x => ({ ...x, html: `<span class="wl">${x.c ? sw(x.c) : `<b>${x.e}</b>`}${x.t}</span>` }));
  }

  /* ---------------- scoring ---------------- */
  const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
  const sim = (rgb, hex, tol = 150) => (rgb ? Math.max(0, 1 - dist(rgb, U.rgb(hex)) / tol) : 0);
  function score(W) {
    const L = GAME.look, S = HAIR.strands(), res = {}, wet = HAIR.state.wet;
    // hair colour: share of hair painted in the wished colour
    let tot = 0, m = 0; S.forEach(s => s.col.forEach(c => { tot++; if (c === W.hair.color) m++; })); res.hc = Math.min(1, (m / Math.max(1, tot)) / .85);
    // length: median (uncurled) tip height of the back hair
    const tips = S.filter(s => s.layer === 'back').map(s => { const P = s.pts, n = P.length; let y = P[n - 1].y; for (let i = 1; i < n; i++) y += HAIR.SEG * .3 * (s.cv[i] || 0) * (1 - .6 * wet) * .9; return y; }).sort((a, b) => a - b);
    const tip = tips[Math.floor(tips.length / 2)] || 0, rng = { long: [430, 9999], medium: [335, 430], short: [0, 335] }[W.hair.len];
    const dd = tip < rng[0] ? rng[0] - tip : tip > rng[1] ? tip - rng[1] : 0; res.hl = Math.max(0, 1 - dd / 70);
    // curls
    let cs = 0, cn = 0; S.forEach(s => s.cv.forEach((v, i) => { if (i) { cs += v; cn++; } })); const cv = cs / Math.max(1, cn);
    res.cu = W.hair.curly ? Math.min(1, cv / .4) : Math.max(0, 1 - cv / .22);
    // make-up (sampled from the painted layers)
    if (W.mk.lips) { const s = PAINT.sample('over', [{ x: 186, y: 286 }, { x: 200, y: 284 }, { x: 214, y: 286 }, { x: 192, y: 295 }, { x: 208, y: 295 }], 4); res.li = Math.min(1, s.cov / .5) * sim(s.rgb, W.mk.lips); }
    if (W.mk.shadow) { const s = PAINT.sample('under', [{ x: 139, y: 201 }, { x: 156, y: 197 }, { x: 244, y: 197 }, { x: 261, y: 201 }], 6); res.sd = Math.min(1, s.cov / .28) * sim(s.rgb, W.mk.shadow, 170); }
    if (W.mk.blush) { const s = PAINT.sample('under', [{ x: 146, y: 262 }, { x: 254, y: 262 }], 12); res.bl = Math.min(1, s.cov / .16) * sim(s.rgb, W.mk.blush, 170); }
    if (W.eye) res.ey = L.eye === W.eye ? 1 : Math.max(0, 1 - dist(U.rgb(L.eye), U.rgb(W.eye)) / 90) * .5;
    // outfit
    Object.entries(W.outfit).forEach(([slot, e]) => {
      let w = L.outfit[slot]; if ((slot === 'top' || slot === 'bottom') && L.outfit.dress) w = null;
      const ti = byId(e.id), wi = w && byId(w.id);
      res['o:' + slot] = !wi ? 0 : wi.id === e.id ? (w.color === e.color ? 1 : .7) : wi.cat === ti.cat ? .2 : 0;
    });
    const vals = Object.values(res), pct = Math.round(100 * vals.reduce((a, b) => a + b, 0) / vals.length);
    return { res, pct };
  }

  /* ---------------- UI ---------------- */
  const ui = document.createElement('div'); ui.id = 'client-ui';
  ui.innerHTML = `<button id="wish-btn" aria-label="Wunsch ansehen"><span class="wb-pic"></span><span class="wb-lbl">Wunsch</span></button><button id="submit-btn" class="btn">Fertig ✓</button>`;
  app.appendChild(ui);
  const ov = document.createElement('div'); ov.id = 'wish'; app.appendChild(ov);
  const bubble = document.createElement('div'); bubble.id = 'bubble'; app.appendChild(bubble);
  const start = document.createElement('div'); start.id = 'start'; app.appendChild(start);

  function renderStart() {
    const L = makeStart(), W = makeWish(L); W.hair.len = 'long';
    const T = targetLook(L, W); T.outfit.dress = { id: 'dress_princess', color: '#ffb8d6' }; T.outfit.top = null; T.outfit.bottom = null; T.outfit.head = { id: 'head_crown', color: '#f2c14e' }; T.outfit.glasses = null; T.outfit.bag = null; T.outfit.outer = null;
    W.mk = { lips: '#e0245e', shadow: '#f08bb4', blush: '#ff9fb2' };
    start.innerHTML = `<div class="st-bg">${Array.from({ length: 18 }, (_, i) => `<i style="--x:${(i * 53) % 100}%;--y:${(i * 37) % 100}%;--d:${(i % 6) * .4}s;--s:${8 + (i % 4) * 5}px"></i>`).join('')}</div>
      <div class="st-logo"><span>Style</span><span>Studio</span><small>Beauty-Salon ✨</small></div>
      <div class="st-pic">${charSVG(T, W, '58 40 284 330')}</div>
      <button class="st-play" id="st-play"><span aria-hidden="true">✦</span> Salon öffnen</button>
      <button class="st-free" id="st-free">Freies Stylen</button>`;
    $('#st-play').addEventListener('click', () => { GAME.Sfx.init(); GAME.Sfx.sparkle(); hideStart(); newClient(); });
    $('#st-free').addEventListener('click', () => { GAME.Sfx.init(); GAME.Sfx.tap(); hideStart(); freePlay(); });
  }
  function showStart() { mode = 'menu'; app.classList.remove('client'); ov.classList.remove('show'); bubble.classList.remove('show'); renderStart(); start.classList.remove('hide'); }
  function hideStart() { start.classList.add('hide'); }
  function freePlay() { mode = 'free'; C = null; GAME.onReset = null; app.classList.remove('client'); GAME.setLook(GAME.freshLook()); if (GAME.page !== 'hair') GAME.goPage(0); }

  function walk(cls, ms) { app.classList.remove('walk-in', 'walk-out'); void app.offsetWidth; app.classList.add(cls); return new Promise(r => setTimeout(() => { app.classList.remove(cls); r(); }, ms)); }
  async function newClient(prevOut) {
    if (prevOut) await walk('walk-out', 650);
    count++; mode = 'client'; app.classList.add('client');
    const S = makeStart(), W = makeWish(S); C = { name: pick(NAMES), start: S, wish: W, n: count };
    if (GAME.page !== 'hair') GAME.goPage(0);
    GAME.setLook(clone(S));
    GAME.onReset = () => GAME.setLook(clone(C.start));
    ui.querySelector('.wb-pic').innerHTML = charSVG(targetLook(S, W), W, '70 60 260 260');
    walk('walk-in', 950);
    setTimeout(() => { say(`Hallo, ich bin ${C.name}! 👋`, 1600); }, 700);
    setTimeout(() => showWish(true), 1500);
  }
  function showWish(first) {
    if (!C) return;
    const T = targetLook(C.start, C.wish);
    ov.innerHTML = `<div class="w-card"><div class="w-head"><b>${C.name}</b> wünscht sich diesen Look:<small>Kundin ${C.n}</small></div>
      <div class="w-pics"><div class="w-face">${charSVG(T, C.wish, '58 40 284 330')}</div><div class="w-body">${charSVG(T, C.wish, '-6 24 412 950')}</div></div>
      <div class="w-list">${wishList(C.wish).map(x => x.html).join('')}</div>
      <button class="btn w-go">${first ? 'Los geht’s! ✂️' : 'Weiter stylen'}</button></div>`;
    ov.classList.add('show');
    ov.querySelector('.w-go').addEventListener('click', () => { GAME.Sfx.tap(); ov.classList.remove('show'); });
  }
  function say(txt, ms = 2200, cls = '') {
    const p = GAME.toScreen(200, 92), r = app.getBoundingClientRect();
    bubble.className = cls; bubble.innerHTML = txt; bubble.style.left = (p.x - r.left) + 'px'; bubble.style.top = Math.max(70, p.y - r.top - 10) + 'px';
    void bubble.offsetWidth; bubble.classList.add('show');
    clearTimeout(say.t); if (ms) say.t = setTimeout(() => bubble.classList.remove('show'), ms);
  }
  function submit() {
    if (!C || GAME.busy) return;
    const { res, pct } = score(C.wish), L = GAME.look;
    const lv = pct >= 80 ? 3 : pct >= 55 ? 2 : pct >= 30 ? 1 : 0;
    L.lipsPainted = PAINT.flags.lips; L.mood = lv >= 2 ? null : lv === 1 ? 'meh' : 'sad'; L.happy = lv >= 2 && !PAINT.flags.lips; GAME.renderHead();
    const TXT = [['Das wollte ich überhaupt nicht! 😤', 'Unzufrieden'], ['Hmm… naja, geht so. 😕', 'Nicht ganz zufrieden'], ['Schön! Das gefällt mir! 😊', 'Zufrieden'], ['WOW! Genau so wollte ich es! 😍', 'Begeistert']][lv];
    GAME.Sfx[lv >= 2 ? 'sparkle' : 'pop']();
    say(TXT[0], 0, lv >= 2 ? 'good' : 'bad');
    const head = GAME.toScreen(200, 150);
    if (lv >= 2) { for (let i = 0; i < (lv === 3 ? 4 : 2); i++) setTimeout(() => GAME.burst(head.x + (R() - .5) * 120, head.y + (R() - .5) * 80, 10), i * 220); }
    setTimeout(() => {
      const items = wishList(C.wish).map(x => { const v = res[x.k] ?? 0, m = v >= .7 ? 'ok' : v >= .4 ? 'mid' : 'no'; return `<span class="wl r-${m}">${x.html.replace('<span class="wl">', '').replace('</span>', '')}<em>${m === 'ok' ? '✓' : m === 'mid' ? '~' : '✗'}</em></span>`; }).join('');
      ov.innerHTML = `<div class="w-card result r${lv}"><div class="r-face">${['😤', '😕', '😊', '😍'][lv]}</div><div class="r-title">${C.name} ist ${TXT[1].toLowerCase()}</div>
        <div class="r-stars">${[1, 2, 3].map(i => `<i class="${i <= lv ? 'on' : ''}">★</i>`).join('')}</div><div class="r-pct">${pct}% getroffen</div>
        <div class="w-list">${items}</div>
        <div class="r-btns"><button class="btn ghost r-menu">Menü</button><button class="btn r-next">Nächste Kundin ➜</button></div></div>`;
      ov.classList.add('show');
      ov.querySelector('.r-next').addEventListener('click', () => { GAME.Sfx.tap(); ov.classList.remove('show'); bubble.classList.remove('show'); newClient(true); });
      ov.querySelector('.r-menu').addEventListener('click', () => { GAME.Sfx.tap(); showStart(); });
    }, 1700);
  }
  ui.querySelector('#wish-btn').addEventListener('click', () => { GAME.Sfx.tap(); showWish(false); });
  ui.querySelector('#submit-btn').addEventListener('click', () => {
    GAME.Sfx.tap();
    ov.innerHTML = `<div class="w-card confirm"><div class="r-title">Fertig mit ${C.name}?</div><p>Zeig ihr den Look – sie sagt dir, wie zufrieden sie ist.</p><div class="r-btns"><button class="btn ghost c-no">Weiter stylen</button><button class="btn c-yes">Abgeben ✓</button></div></div>`;
    ov.classList.add('show');
    ov.querySelector('.c-no').addEventListener('click', () => ov.classList.remove('show'));
    ov.querySelector('.c-yes').addEventListener('click', () => { ov.classList.remove('show'); submit(); });
  });

  document.getElementById('btn-home').addEventListener('click', () => {
    if (GAME.busy) return; GAME.Sfx.init(); GAME.Sfx.tap();
    if (mode !== 'client') { showStart(); return; }
    ov.innerHTML = `<div class="w-card confirm"><div class="r-title">Zurück zum Menü?</div><p>${C ? C.name + ' geht dann ohne neuen Look nach Hause.' : ''}</p><div class="r-btns"><button class="btn ghost h-no">Weiter stylen</button><button class="btn h-yes">Zum Menü 🏠</button></div></div>`;
    ov.classList.add('show');
    ov.querySelector('.h-no').addEventListener('click', () => ov.classList.remove('show'));
    ov.querySelector('.h-yes').addEventListener('click', () => { GAME.Sfx.tap(); showStart(); });
  });
  renderStart();
  window.CLIENT = { score: () => C && score(C.wish), get C() { return C; }, newClient, showStart };
})();
