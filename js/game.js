(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const D = DATA;
  const app = $('#app'), scene = $('#scene'), charSvg = $('#char'), fx = $('#fx'), table = $('#table'), picker = $('#picker'), shower = $('#shower'), ring = $('#ring');

  /* ================= sound (synthesised) ================= */
  const Sfx = {
    ctx: null, on: true, nb: null,
    init() {
      try {
        if (!this.ctx) {
          const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
          this.ctx = new AC();
          const len = this.ctx.sampleRate * .5, b = this.ctx.createBuffer(1, len, this.ctx.sampleRate), d = b.getChannelData(0);
          for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
          this.nb = b;
        }
        if (this.ctx.state === 'suspended') this.ctx.resume();
      } catch (e) {}
    },
    tone(f, dur, type = 'sine', vol = .12, when = 0, to = null) {
      if (!this.on || !this.ctx) return;
      try {
        const t = this.ctx.currentTime + when, o = this.ctx.createOscillator(), g = this.ctx.createGain();
        o.type = type; o.frequency.setValueAtTime(f, t); if (to) o.frequency.exponentialRampToValueAtTime(to, t + dur);
        g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + .012); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
        o.connect(g); g.connect(this.ctx.destination); o.start(t); o.stop(t + dur + .05);
      } catch (e) {}
    },
    noise(dur, freq = 1000, vol = .06, q = 1) {
      if (!this.on || !this.ctx || !this.nb) return;
      try {
        const t = this.ctx.currentTime, s = this.ctx.createBufferSource(), f = this.ctx.createBiquadFilter(), g = this.ctx.createGain();
        s.buffer = this.nb; f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = q;
        g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
        s.connect(f); f.connect(g); g.connect(this.ctx.destination); s.start(t); s.stop(t + dur + .02);
      } catch (e) {}
    },
    tap() { this.tone(660, .07, 'triangle', .08); },
    pop() { this.tone(420, .12, 'sine', .14, 0, 900); },
    sparkle() { [1568, 2093, 2637].forEach((f, i) => this.tone(f, .16, 'sine', .06, i * .07)); },
    bubble() { this.tone(U.rand(380, 620), .08, 'sine', .07, 0, U.rand(900, 1400)); },
    water() { this.noise(.18, 2600, .05, .7); },
    wind() { this.noise(.2, 700, .06, .6); },
    tick() { this.tone(U.rand(1800, 2400), .03, 'square', .025); },
    sizzle() { this.noise(.15, 4200, .045, 1.5); },
    spray() { this.noise(.18, 5200, .05, 1); },
    squish() { this.tone(U.rand(200, 300), .1, 'sine', .07, 0, 120); },
    brush() { this.noise(.1, 3200, .035, .8); },
    snip() { this.tone(2400, .04, 'square', .04); this.tone(1800, .05, 'square', .04, .06); },
    whoosh() { this.noise(.3, 900, .05, .5); },
    buzz() { this.noise(.13, 170, .09, .7); this.tone(120, .12, 'sawtooth', .025); },
  };
  try { Sfx.on = localStorage.getItem('styleStudio.sound') !== '0'; } catch (e) {}

  /* ================= look ================= */
  const BASE_TOP = { id: 'top_breton', color: '#2f3f73' }, BASE_BOTTOM = { id: 'bot_shorts', color: '#ffc2d9' };
  function freshLook() {
    return {
      skin: '#c4804f', eye: '#a8742e', hairColor: '#dfa95f',
      maskOn: 0, pimples: 0, cucumbers: false, happy: false, mk: {},
      outfit: { top: { ...BASE_TOP }, bottom: { ...BASE_BOTTOM }, dress: null, outer: null, shoes: null, bag: null, necklace: null, head: null, glasses: null, legwear: null, ear: { id: 'ear_studs', color: '#f2c14e' } },
    };
  }
  let look = freshLook();

  /* ================= state ================= */
  const PAGES = ['hair', 'makeup', 'dress'];
  const META = {
    hair: { e: '💇‍♀️', title: 'Haare', front: 'Haarprodukte', view: [52, 58, 296, 500], cols: 5 },
    makeup: { e: '💄', title: 'Make-up', front: 'Schminksachen', view: [80, 66, 240, 300], cols: 7 },
    dress: { e: '👗', title: 'Outfit', front: 'Kleiderschrank', view: [-6, 24, 412, 950] },
  };
  const mkPal = id => D.MAKEUP.find(t => t.id === id).palette;
  const G = {
    page: 'hair', tool: null, use: null, pickerFor: null, swipe: null, cat: 'dress', lastPick: {}, eyesShut: false, maskDone: false,
    col: { dye: D.HAIR_COLORS[9], foundation: D.SKIN[2], lens: D.EYES[3], shadow: mkPal('shadow')[2], liner: '#1a1016', mascara: '#1a1016', blush: mkPal('blush')[0], lips: mkPal('lips')[1], glow: mkPal('hilite')[0], freckles: '#a0663f', sticker: 'heart' },
  };

  /* ================= character render ================= */
  const L = (name, html) => { const g = document.getElementById('L-' + name); if (g) g.innerHTML = html; };
  const setStop = (id, c) => { const el = document.getElementById(id); if (el) el.setAttribute('stop-color', c); };
  function updateGradients() {
    setStop('ig1', U.shade(look.eye, 42)); setStop('ig2', look.eye); setStop('ig3', U.shade(look.eye, -45));
  }
  function itemArt(entry) {
    if (!entry) return { body: '', sleeves: '' };
    const it = D.ITEM_BY_ID[entry.id]; if (!it) return { body: '', sleeves: '' };
    const r = it.art(entry.color || it.colors[0]); return { body: r.body || '', sleeves: r.sleeves || '' };
  }
  function renderHead() { L('head', ART.headBase(look)); L('feat', ART.headFeat(look)); }
  function renderChar() {
    updateGradients();
    const b = ART.body(look.skin, look.outfit);
    L('legs', b.legs); L('torso', b.torso); L('arms', b.arms); L('hands', b.hands);
    const o = look.outfit, empty = { body: '', sleeves: '' };
    const dress = itemArt(o.dress), top = o.dress ? empty : itemArt(o.top), bottom = o.dress ? empty : itemArt(o.bottom), outer = itemArt(o.outer);
    const it = e => (e ? D.ITEM_BY_ID[e.id] : null), shoes = itemArt(o.shoes).body;
    // layering rules: wide trousers / long skirts fall over shoes; jacket sleeves hide inner sleeves; high necks cover necklaces
    const overShoes = !o.dress && it(o.bottom) && it(o.bottom).overShoes;
    const high = [o.dress, o.dress ? null : o.top, o.outer].some(e => it(e) && it(e).highNeck);
    L('legwear', itemArt(o.legwear).body); L('shoesunder', overShoes ? shoes : ''); L('bottom', bottom.body); L('shoes', overShoes ? '' : shoes); L('dress', dress.body); L('top', top.body);
    L('sleeves', outer.sleeves ? '' : dress.sleeves + top.sleeves); L('outer', outer.body); L('outersleeves', outer.sleeves);
    L('bag', itemArt(o.bag).body); L('neckunder', high ? itemArt(o.necklace).body : ''); L('necklace', high ? '' : itemArt(o.necklace).body);
    renderHead(); L('earrings', ''); L('earrings2', itemArt(o.ear).body);
    L('glasses', itemArt(o.glasses).body); L('headwear', itemArt(o.head).body);
    renderFx();
  }
  function renderFx() { L('facefx', ART.faceFx(look)); }
  let happyT = null;
  function happy(ms = 1000) {
    if (PAINT.flags.lips) return;
    look.happy = true; renderHead();
    clearTimeout(happyT); happyT = setTimeout(() => { look.happy = false; renderHead(); }, ms);
  }
  const eyesPainted = () => PAINT.flags.eyes;
  /* no idle blinking (wished) – eyes only close under the shower */

  /* ================= view & coordinates ================= */
  const SVGS = [charSvg, $('#char-feat'), $('#char-top')];
  let vb = META.hair.view.slice(), vbRaf = 0;
  const applyVB = () => { const v = vb.map(n => n.toFixed(2)).join(' '); SVGS.forEach(s => s.setAttribute('viewBox', v)); };
  function setView(name, instant) {
    const target = META[name].view; cancelAnimationFrame(vbRaf);
    if (instant) { vb = target.slice(); applyVB(); return; }
    const from = vb.slice(), t0 = performance.now();
    const step = now => { const t = Math.min(1, (now - t0) / 550), e = U.ease(t); vb = from.map((v, i) => v + (target[i] - v) * e); applyVB(); if (t < 1) vbRaf = requestAnimationFrame(step); };
    vbRaf = requestAnimationFrame(step);
  }
  function toSvg(cx, cy) { const m = charSvg.getScreenCTM(); if (!m) return { x: -999, y: -999 }; const p = charSvg.createSVGPoint(); p.x = cx; p.y = cy; const r = p.matrixTransform(m.inverse()); return { x: r.x, y: r.y }; }
  function toScreen(x, y) { const m = charSvg.getScreenCTM(); if (!m) return { x: 0, y: 0 }; const p = charSvg.createSVGPoint(); p.x = x; p.y = y; const r = p.matrixTransform(m); return { x: r.x, y: r.y }; }
  const svgScale = () => { const m = charSvg.getScreenCTM(); return m ? m.a : 1; };
  function inZone(z, p) {
    if (z.shape === 'ell') { const dx = (p.x - z.cx) / z.rx, dy = (p.y - z.cy) / z.ry; return dx * dx + dy * dy <= 1; }
    return z.pts.some(c => (p.x - c.x) ** 2 + (p.y - c.y) ** 2 <= (c.r * 1.35) ** 2);
  }

  /* ================= effects ================= */
  function particle(cls, x, y, vars = {}, life = 1000, text = '') {
    const r = scene.getBoundingClientRect(), d = document.createElement('div');
    d.className = 'p ' + cls; d.style.left = (x - r.left) + 'px'; d.style.top = (y - r.top) + 'px';
    for (const k in vars) d.style.setProperty('--' + k, vars[k]);
    if (text) d.textContent = text;
    fx.appendChild(d); setTimeout(() => d.remove(), life);
  }
  const PFX = {
    bubble: (x, y) => particle('p-bubble', x + U.rand(-16, 16), y + U.rand(-10, 10), { s: U.rand(10, 24) + 'px', dx: U.rand(-30, 30) + 'px', dy: U.rand(-60, -20) + 'px' }),
    drop: (x, y) => { for (let i = 0; i < 2; i++) particle('p-drop', x + U.rand(-22, 22), y + U.rand(-8, 8), { dx: U.rand(-8, 8) + 'px', dy: U.rand(50, 90) + 'px' }, 750); },
    wind: (x, y) => particle('p-wind', x + U.rand(-10, 10), y + U.rand(-16, 16), { dx: (U.rand(40, 70) * (Math.random() < .5 ? -1 : 1)) + 'px', dy: U.rand(-12, 12) + 'px', r: U.rand(-20, 20) + 'deg' }, 600),
    spark: (x, y, c) => particle('p-spark', x + U.rand(-16, 16), y + U.rand(-16, 16), { c: c || U.pick(['#fff', '#ffe066', '#ff9fcd', '#b8e3ff']), s: U.rand(12, 22) + 'px', dx: U.rand(-40, 40) + 'px', dy: U.rand(-40, 40) + 'px' }, 800, '✦'),
    steam: (x, y) => particle('p-steam', x + U.rand(-10, 10), y, { dx: U.rand(-15, 15) + 'px', dy: U.rand(-55, -30) + 'px' }),
    green: (x, y) => particle('p-blob', x + U.rand(-14, 14), y + U.rand(-14, 14), { c: '#9ad49a', s: U.rand(8, 16) + 'px' }, 650),
    cloud: (x, y) => particle('p-cloud', x + U.rand(-30, 30), y + U.rand(-30, 30), { dx: U.rand(-40, 40) + 'px', dy: U.rand(-40, 20) + 'px' }, 750),
  };
  function burst(x, y, n = 9, c) { for (let i = 0; i < n; i++) setTimeout(() => PFX.spark(x, y, c), i * 25); }
  function praise(word) { const d = document.createElement('div'); d.className = 'praise'; d.textContent = word || U.pick(['Super!', 'Wow!', 'Perfekt!', 'Traumhaft!']); scene.appendChild(d); setTimeout(() => d.remove(), 1200); }
  let toastT = null;
  function toast(msg) { if (G.pickerFor && G.page === 'makeup') return; const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2000); }
  function makeGhost(icon, x, y, cls) {
    const g = document.createElement('div'); g.className = 'tool-ghost' + (cls ? ' ' + cls : '');
    g.innerHTML = ART.icon(icon); g.style.left = x + 'px'; g.style.top = y + 'px'; document.body.appendChild(g); return g;
  }
  const moveGhost = (g, x, y) => { if (g) { g.style.left = x + 'px'; g.style.top = y + 'px'; } };
  function tweenGhost(g, x, y, ms, cb) {
    g.style.transition = `left ${ms}ms cubic-bezier(.4,.1,.3,1), top ${ms}ms cubic-bezier(.4,.1,.3,1)`;
    requestAnimationFrame(() => { g.style.left = x + 'px'; g.style.top = y + 'px'; });
    setTimeout(() => { g.style.transition = ''; cb && cb(); }, ms + 20);
  }
  const elFor = t => (t.id === 'shower' ? shower : table.querySelector(`.item[data-id="${t.id}"]`));
  const centerOf = el => { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; };

  /* ================= hair tools ================= */

  const TIP = 0;
  const HAIR_TOOLS = [
    { id: 'scissors', size: 3, name: 'Schere', icon: 'scissors', hint: 'Wische quer über die Haare zum Schneiden ✂️',
      tick: (a, b, mv) => { if (mv > .3 && HAIR.cut(a.x, a.y, b.x, b.y)) { Sfx.snip(); if (Math.random() < .25) happy(600); } } },
    { id: 'razor', size: 22, name: 'Rasierer', icon: 'razor', hint: 'Fahr über den Kopf zum Abrasieren',
      tick: (a, b, mv, u) => { if (HAIR.shave(b.x, b.y, 22)) Sfx.snip(); if ((u.n = (u.n || 0) + 1) % 7 === 0) Sfx.buzz(); } },
    { id: 'grow', size: 32, name: 'Haarwuchs', icon: 'grow', hint: 'Reibe über die Haare – sie wachsen! 🌱',
      tick: (a, b, mv, u, s) => { if (HAIR.grow(b.x, b.y, 32, mv * .9 + 1.1)) { if ((u.n = (u.n || 0) + 1) % 5 === 0) PFX.spark(s.x, s.y, '#8ff0cf'); if (u.n % 12 === 0) Sfx.bubble(); } } },
    { id: 'comb', size: 32, name: 'Kamm', icon: 'comb', hint: 'Zieh die Haare in jede Richtung',
      tick: (a, b, mv, u) => {
        const st = Math.max(1, Math.ceil(mv / 5)); let any = false;
        for (let i = 0; i < st; i++) { const t0 = i / st, t1 = (i + 1) / st; any = HAIR.comb(a.x + (b.x - a.x) * t0, a.y + (b.y - a.y) * t0, a.x + (b.x - a.x) * t1, a.y + (b.y - a.y) * t1, 32) || any; }
        if (any) { u.d = (u.d || 0) + mv; if (u.d > 40) { u.d = 0; Sfx.tick(); } } } },
    { id: 'dryer', size: 36, name: 'Föhn', icon: 'dryer', hint: 'Halt den Föhn an die Haare – sie werden trocken & fluffig 💨',
      tick: (a, b, mv, u, s) => { if (HAIR.blow(b.x, b.y, 110, 1.7)) HAIR.state.wet = Math.max(0, HAIR.state.wet - .005); if ((u.n = (u.n || 0) + 1) % 3 === 0) PFX.wind(s.x, s.y); if (u.n % 12 === 0) Sfx.wind(); } },
    { id: 'curler', size: 36, name: 'Lockenstab', icon: 'curler', hint: 'Reibe über die Haare für Locken 🌀',
      tick: (a, b, mv, u, s) => { if (HAIR.curlAt(b.x, b.y, 36, .006 + mv * .003)) { if ((u.n = (u.n || 0) + 1) % 6 === 0) PFX.steam(s.x, s.y); if (u.n % 14 === 0) Sfx.sizzle(); } } },
    { id: 'straight', size: 36, name: 'Glätteisen', icon: 'straightener', hint: 'Reibe drüber – die Haare werden glatt ✨',
      tick: (a, b, mv, u, s) => { if (HAIR.curlAt(b.x, b.y, 36, -(.01 + mv * .004))) { if ((u.n = (u.n || 0) + 1) % 6 === 0) PFX.steam(s.x, s.y); if (u.n % 14 === 0) Sfx.sizzle(); } } },
    { id: 'dye', size: 22, name: 'Haarfarbe', icon: 'dye', palette: D.HAIR_COLORS, all: true, hint: 'Male mit der Farbe auf die Haare 🎨',
      tick: (a, b, mv, u, s) => { const st = Math.max(1, Math.ceil(mv / 5)); let any = false; for (let i = 1; i <= st; i++) any = HAIR.paint(a.x + (b.x - a.x) * i / st, a.y + (b.y - a.y) * i / st, 22, G.col.dye) || any; if (any && (u.n = (u.n || 0) + 1) % 4 === 0) { PFX.spark(s.x, s.y, G.col.dye); if (u.n % 12 === 0) Sfx.brush(); } } },
    { id: 'shampoo', size: 18, name: 'Shampoo', icon: 'shampoo', hint: 'Reibe Shampoo in die Haare 🫧',
      tick: (a, b, mv, u, s) => { u.f = (u.f || 0) + mv; while (u.f > 8) { u.f -= 8; if (HAIR.addFoam(b.x, b.y)) { PFX.bubble(s.x, s.y); if (Math.random() < .3) Sfx.bubble(); } } } },
    { id: 'spray', size: 40, name: 'Haarspray', icon: 'spray', hint: 'Sprühen – die Frisur hält! Tipp: erst hochkämmen 😉',
      tick: (a, b, mv, u, s) => { if (HAIR.sprayAt(b.x, b.y, 40)) { if ((u.n = (u.n || 0) + 1) % 2 === 0) PFX.cloud(s.x, s.y); if (u.n % 10 === 0) Sfx.spray(); } } },
  ];
  const SHOWER = { id: 'shower', name: 'Dusche', icon: 'shower', hint: 'Zieh die Dusche über den Kopf 🚿', tipOff: 0, size: 46,
    tick: (a, b, mv, u, s) => {
      if ((u.n = (u.n || 0) + 1) % 2 === 0) PFX.drop(s.x, s.y + 6);
      if (u.n % 9 === 0) Sfx.water();
      const r = HAIR.water(b.x, b.y, 46);
      if (r.hit) HAIR.state.wet = Math.min(1, HAIR.state.wet + .006);
      r.popped.forEach(q => { const p = toScreen(q.x, q.y); PFX.bubble(p.x, p.y); });
      G.eyesShut = b.y < 200 && Math.abs(b.x - 200) < 110;
    } };

  /* ================= make-up tools (free painting) ================= */
  const brushTick = (key, every = 6) => (a, b, mv, u, s) => {
    PAINT.B[key](a, b, G.col[key], u);
    u.d = (u.d || 0) + mv + .2; if (u.d > every * 4) { u.d = 0; Sfx.brush(); }
    if (Math.random() < .06) PFX.spark(s.x, s.y, G.col[key]);
  };
  const MAKEUP_TOOLS = [
    { id: 'mask', name: 'Maske', icon: 'mask', hint: 'Reibe die Gesichtsmaske auf 🥒',
      tick: (a, b, mv, u, s) => {
        if (!inZone(D.ZONES.face, b)) return;
        const before = look.maskOn; look.maskOn = Math.min(1, look.maskOn + mv / 900 + .002);
        if (look.maskOn >= 1 && before < 1) { look.cucumbers = true; Sfx.sparkle(); burst(s.x, s.y, 8, '#9ad49a'); toast('Wellness-Zeit! 🥒'); }
        renderFx(); if ((u.n = (u.n || 0) + 1) % 4 === 0) PFX.green(s.x, s.y); if (u.n % 10 === 0) Sfx.squish();
      } },
    { id: 'sponge', name: 'Schwamm', icon: 'sponge2', hint: 'Reibe drüber zum Abschminken 🧽', size: 13,
      start: () => { if (look.cucumbers) { look.cucumbers = false; renderFx(); } },
      tick: (a, b, mv, u, s) => {
        const st = Math.max(1, Math.ceil(mv / 4)); for (let i = 1; i <= st; i++) PAINT.erase(a.x + (b.x - a.x) * i / st, a.y + (b.y - a.y) * i / st, 13);
        if (look.maskOn > 0 && inZone(D.ZONES.face, b)) { look.maskOn = Math.max(0, look.maskOn - mv / 700 - .002); renderFx(); }
        if ((u.n = (u.n || 0) + 1) % 4 === 0) PFX.bubble(s.x, s.y); if (u.n % 12 === 0) Sfx.water();
      } },
    { id: 'foundation', name: 'Teint', icon: 'foundation', palette: D.SKIN, size: 17, hint: 'Male Make-up übers Gesicht', tick: brushTick('foundation', 10) },
    { id: 'blend', name: 'Verblender', icon: 'blender', size: 11, hint: 'Reibe über Make-up, um es weich zu verblenden ✨',
      tick: (a, b, mv, u, s) => { PAINT.blend(a, b, 11); u.d = (u.d || 0) + mv; if (u.d > 40) { u.d = 0; Sfx.brush(); } if (Math.random() < .05) PFX.spark(s.x, s.y, '#fff'); } },
    { id: 'lens', name: 'Linsen', icon: 'lens', palette: D.EYES, size: 10, hint: 'Tippe eine Farbe an 👁️',
      tick: (a, b, mv, u, s) => {
        if (u.done) return;
        if (Math.hypot(b.x - 150, b.y - 216) < 24 || Math.hypot(b.x - 250, b.y - 216) < 24) {
          u.done = true; look.eye = G.col.lens; updateGradients(); renderHead(); Sfx.sparkle(); burst(s.x, s.y, 8, G.col.lens); toast('Neue Augenfarbe! 👀');
        }
      } },
    { id: 'shadow', name: 'Lidschatten', icon: 'eyeshadow', palette: mkPal('shadow'), size: 8, hint: 'Male über den Augen', tick: brushTick('shadow') },
    { id: 'liner', name: 'Eyeliner', icon: 'liner', palette: ['#1a1016', '#5a3420', '#2c3e75', '#6b3fa0', '#1f8a8a', '#d4a23a', '#ff4f9a', '#ffffff', '#4f8dff', '#2fbf71'], size: 1.6, hint: 'Zeichne feine Linien – auch zum Gesicht-Bemalen ✏️', tick: brushTick('liner', 8) },
    { id: 'mascara', name: 'Mascara', icon: 'mascara', palette: mkPal('mascara'), size: 9, hint: 'Bürste über die Wimpern',
      tick: (a, b, mv, u, s) => { if (PAINT.B.mascara(a, b, G.col.mascara)) { Sfx.brush(); if (Math.random() < .3) PFX.spark(s.x, s.y, '#fff'); } } },
    { id: 'blush', name: 'Rouge', icon: 'blushbrush', palette: mkPal('blush'), size: 15, hint: 'Pinsel sanft über die Wangen', tick: brushTick('blush', 10) },
    { id: 'lips', name: 'Lippen', icon: 'lipstick', palette: mkPal('lips'), size: 4.6, hint: 'Male die Lippen an 💋', tick: brushTick('lips') },
    { id: 'glow', name: 'Glow', icon: 'hilite', palette: mkPal('hilite'), size: 7, hint: 'Tupfe Glanz auf Wangen & Nase ✨', tick: brushTick('glow') },
    { id: 'freckles', name: 'Sommersprossen', icon: 'freckles', palette: mkPal('freckles'), size: 9, hint: 'Tupfe Sommersprossen auf 🌞', tick: brushTick('freckles') },
    { id: 'sticker', name: 'Sticker', icon: 'sticker', variants: [{ v: 'heart', e: '💖', n: 'Herz' }, { v: 'star', e: '⭐', n: 'Stern' }, { v: 'gems', e: '💎', n: 'Steinchen' }, { v: 'moon', e: '🌙', n: 'Mond' }, { v: 'flower', e: '🌸', n: 'Blume' }], size: 10, hint: 'Tipp aufs Gesicht – der Sticker klebt! 💖',
      tick: (a, b, mv, u, s) => { if (PAINT.B.sticker(a, b, G.col.sticker, u)) { Sfx.pop(); burst(s.x, s.y, 4); } } },
  ];
  const ALL = [...HAIR_TOOLS, ...MAKEUP_TOOLS, SHOWER];
  const toolById = id => ALL.find(t => t.id === id);
  const label = t => t.name.replace('Sommersprossen', 'Sommer&shy;sprossen').replace('Lidschatten', 'Lid&shy;schatten').replace('Verblender', 'Ver&shy;blender');
  const isPaint = t => MAKEUP_TOOLS.includes(t);

  /* ================= picker bubble ================= */
  function openPicker(t) {
    G.pickerFor = t.id; $('#toast').classList.remove('show');
    picker.innerHTML = pickerHTML(t); bindPicker(t); wireStrips(picker);
    picker.classList.toggle('top', G.page === 'makeup');
    const el = elFor(t), pr = picker.getBoundingClientRect(), c = centerOf(el);
    picker.style.setProperty('--ax', Math.max(24, Math.min(pr.width - 24, c.x - pr.left)) + 'px');
    picker.classList.add('show'); markSel();
  }
  function closePicker() { G.pickerFor = null; picker.classList.remove('show'); markSel(); }
  function markSel() { $$('.item', table).forEach(i => i.classList.toggle('sel', !!(G.tool && i.dataset.id === G.tool.id))); }
  function refreshPicker() {
    if (!G.pickerFor) return;
    const t = toolById(G.pickerFor), sc = picker.querySelector('.pal, .row-cards'), left = sc ? sc.scrollLeft : 0;
    picker.innerHTML = pickerHTML(t); bindPicker(t); wireStrips(picker);
    const sc2 = picker.querySelector('.pal, .row-cards'); if (sc2) sc2.scrollLeft = left;
  }
  function pickerHTML(t) {
    const cur = G.col[t.id];
    let h = `<div class="pk-head"><span class="pk-ic">${ART.icon(t.icon)}</span><b>${t.name}</b><small>${t.hint}</small><button class="pk-x" aria-label="Schließen">✕</button></div>`;
    if (t.variants) h += `<div class="row-cards" style="height:84px">${t.variants.map(v => `<button class="card ${cur === v.v ? 'on' : ''}" data-c="${v.v}"><span class="em">${v.e}</span><span class="nm">${v.n}</span></button>`).join('')}</div>`;
    else h += `<div class="pal ${t.palette.length > 8 ? 'many' : ''}">${t.palette.map(c => `<button class="sw ${cur === c ? 'sel' : ''}" style="--c:${c}" data-c="${c}"></button>`).join('')}${t.all ? '<button class="sw all" data-all="1">Alles</button>' : ''}</div>`;
    return h;
  }
  function bindPicker(t) {
    picker.querySelector('.pk-x').addEventListener('click', () => { Sfx.tap(); G.tool = null; closePicker(); ring.classList.remove('on'); });
    $$('[data-c]', picker).forEach(b => b.addEventListener('click', () => {
      G.col[t.id] = b.dataset.c; Sfx.tap(); refreshPicker(); refreshTableDots();
      if (t.id === 'lens') { look.eye = b.dataset.c; updateGradients(); renderHead(); Sfx.sparkle(); [150, 250].forEach(x => { const q = toScreen(x, 216); burst(q.x, q.y, 6, b.dataset.c); }); }
    }));
    const all = picker.querySelector('[data-all]');
    if (all) all.addEventListener('click', () => { HAIR.recolorAll(G.col.dye); G.redraw = true; Sfx.sparkle(); const p = toScreen(200, 150); burst(p.x, p.y, 12, G.col.dye); happy(); toast('Ganz neue Haarfarbe! 🎨'); });
  }

  /* ================= table ================= */
  const ROT = [-8, 6, -4, 9, -6, 5, -9, 4, -5, 7, -3, 8];
  function renderTable(swap) {
    const m = META[G.page];
    if (G.page === 'dress') renderWardrobe();
    else {
      const tools = G.page === 'hair' ? HAIR_TOOLS : MAKEUP_TOOLS;
      table.innerHTML = `<div class="surface"><div class="items" style="--cols:${m.cols}">${tools.map((t, i) => `<button class="item" data-id="${t.id}" style="--r:${ROT[i % ROT.length]}deg"><span class="obj">${ART.icon(t.icon)}${dotHTML(t)}</span><span class="lbl">${label(t)}</span></button>`).join('')}</div></div><div class="front"><span>${m.front}</span></div>`;
      $$('.item', table).forEach(el => el.addEventListener('pointerdown', e => { Sfx.init(); useDown(e, toolById(el.dataset.id), false); }));
      markSel();
    }
    if (swap) { table.classList.remove('swap'); void table.offsetWidth; table.classList.add('swap'); }
  }
  const dotHTML = t => (t.palette ? `<i class="dot" style="background:${G.col[t.id]}"></i>` : '');
  function refreshTableDots() {
    if (G.page === 'dress') return;
    $$('.item', table).forEach(el => {
      const t = toolById(el.dataset.id), obj = el.querySelector('.obj'), old = obj.querySelector('.dot');
      if (old) old.remove(); const h = dotHTML(t); if (h) obj.insertAdjacentHTML('beforeend', h);
    });
  }

  /* ================= using tools (drag from table or select + use) ================= */
  function useDown(e, t, fromScene) {
    e.preventDefault();
    if (G.use) return;
    const u = { t, x: e.clientX, y: e.clientY, lx: e.clientX, ly: e.clientY, sx: e.clientX, sy: e.clientY, started: false, ghost: null };
    G.use = u;
    if (fromScene) startUse(u);
    document.addEventListener('pointermove', useMove);
    document.addEventListener('pointerup', useUp);
    document.addEventListener('pointercancel', useUp);
  }
  function startUse(u) {
    u.started = true;
    if (G.pickerFor && G.page === 'hair') closePicker();
    u.ghost = makeGhost(u.t.icon, u.x, u.y, u.t.id === 'shower' ? 'shower' : 'cursor');
    if (['dryer', 'razor', 'curler', 'straight', 'shampoo', 'grow', 'spray', 'mask', 'sponge'].includes(u.t.id)) u.ghost.classList.add('rubbing');
    const el = elFor(u.t); if (el) el.classList.add('lifted');
    if (u.t.start) u.t.start();
    u.lx = u.x; u.ly = u.y;
  }
  function useMove(e) {
    const u = G.use; if (!u || u.auto) return;
    u.x = e.clientX; u.y = e.clientY;
    if (!u.started && Math.hypot(u.x - u.sx, u.y - u.sy) > 10) startUse(u);
    if (u.started) moveGhost(u.ghost, u.x, u.y);
  }
  function useUp() {
    document.removeEventListener('pointermove', useMove);
    document.removeEventListener('pointerup', useUp);
    document.removeEventListener('pointercancel', useUp);
    const u = G.use; if (!u || u.auto) return;
    G.use = null; ring.classList.remove('on');
    if (u.t.id === 'comb') HAIR.settleComb();
    if (u.ghost) u.ghost.remove();
    const el = elFor(u.t); if (el) el.classList.remove('lifted');
    G.eyesShut = false;
    if (!u.started) { if (u.t.id === 'shower') autoShower(); else selectTool(u.t); }
  }
  function selectTool(t) {
    Sfx.tap();
    if (G.tool === t) { G.tool = null; closePicker(); return; }
    G.tool = t;
    if (t.palette || t.variants) openPicker(t); else { closePicker(); toast(t.hint); }
    markSel();
  }
  const tipOff = t => (t.tipOff !== undefined ? t.tipOff : TIP);
  function useTick() {
    const u = G.use; if (!u || !u.started) return;
    const off = tipOff(u.t), a = toSvg(u.lx, u.ly - off), b = toSvg(u.x, u.y - off);
    if (u.t.size) { const r = Math.max(6, u.t.size * svgScale()); ring.style.width = ring.style.height = (r * 2) + 'px'; const sr = scene.getBoundingClientRect(); ring.style.left = (u.x - sr.left) + 'px'; ring.style.top = (u.y - off - sr.top) + 'px'; ring.classList.add('on'); }
    u.t.tick(a, b, Math.hypot(b.x - a.x, b.y - a.y), u, { x: u.x, y: u.y - off });
    u.lx = u.x; u.ly = u.y;
  }
  function autoShower() {
    if (G.use) return;
    const from = centerOf(shower), top = toScreen(200, 46), k = svgScale();
    const u = { t: SHOWER, auto: true, started: false, x: from.x, y: from.y + 40, lx: from.x, ly: from.y + 40 };
    u.ghost = makeGhost('shower', u.x, u.y, 'shower'); shower.classList.add('lifted'); G.use = u;
    tweenGhost(u.ghost, top.x, top.y, 420, () => {
      u.x = top.x; u.y = top.y; u.lx = u.x; u.ly = u.y; u.started = true;
      const t0 = performance.now();
      const step = now => {
        const tt = (now - t0) / 2800;
        if (tt >= 1) { u.started = false; ring.classList.remove('on'); tweenGhost(u.ghost, from.x, from.y + 40, 380, () => { u.ghost.remove(); shower.classList.remove('lifted'); G.use = null; G.eyesShut = false; }); return; }
        u.x = top.x + Math.sin(tt * Math.PI * 4) * 78 * k; moveGhost(u.ghost, u.x, u.y);
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }
  shower.addEventListener('pointerdown', e => { Sfx.init(); useDown(e, SHOWER, false); });

  /* ================= wardrobe (outfit page) ================= */
  function equippedIn(cat) {
    const o = look.outfit;
    if (cat === 'jewel') {
      const last = G.lastPick.jewel && D.ITEM_BY_ID[G.lastPick.jewel];
      const e = last && o[last.slot] && o[last.slot].id === last.id ? o[last.slot] : (o.necklace || o.ear);
      return e ? { entry: e, item: D.ITEM_BY_ID[e.id] } : null;
    }
    const e = o[cat]; if (!e) return null;
    if ((cat === 'top' || cat === 'bottom') && o.dress) return null;
    return { entry: e, item: D.ITEM_BY_ID[e.id] };
  }
  const isWorn = it => { const e = look.outfit[it.slot]; if (!e || e.id !== it.id) return false; return !((it.slot === 'top' || it.slot === 'bottom') && look.outfit.dress); };
  const itemThumb = (it, color) => { const r = it.art(color || it.colors[0]); return `<svg viewBox="${it.box}" preserveAspectRatio="xMidYMid meet"><g transform="${it.thumbTransform || ''}">${r.sleeves || ''}${r.body || ''}</g></svg>`; };
  function renderWardrobe() {
    const cat = G.cat, sel = equippedIn(cat), m = META.dress;
    const g = table.querySelector('.grid'), gl = g ? g.scrollLeft : 0, c = table.querySelector('.cats'), cl = c ? c.scrollLeft : 0;
    let h = `<div class="surface"><div class="wardrobe"><div class="cats">${D.CATS.map(c => `<button class="cat ${c.id === cat ? 'on' : ''}" data-cat="${c.id}"><span>${c.e}</span>${c.id === cat ? c.name : ''}</button>`).join('')}</div>`;
    if (sel && sel.item.colors.length > 1) h += `<div class="pal small">${sel.item.colors.map(c => `<button class="sw ${c === sel.entry.color ? 'sel' : ''}" style="--c:${c}" data-col="${c}"></button>`).join('')}</div>`;
    h += `<div class="grid">${D.ITEMS.filter(i => i.cat === cat).map(it => `<button class="card ${isWorn(it) ? 'on' : ''}" data-item="${it.id}">${itemThumb(it, isWorn(it) ? look.outfit[it.slot].color : it.colors[0])}<span class="nm">${it.name}</span></button>`).join('')}</div></div></div><div class="front"><span>${m.front}</span></div>`;
    table.innerHTML = h;
    wireStrips(table);
    const g2 = table.querySelector('.grid'); if (g2) g2.scrollLeft = gl;
    const c2 = table.querySelector('.cats'); if (c2) c2.scrollLeft = cl;
    $$('.cat', table).forEach(b => b.addEventListener('click', () => { G.cat = b.dataset.cat; Sfx.tap(); renderWardrobe(); const gg = table.querySelector('.grid'); if (gg) gg.scrollLeft = 0; }));
    $$('[data-col]', table).forEach(b => b.addEventListener('click', () => { const s = equippedIn(G.cat); if (!s) return; s.entry.color = b.dataset.col; Sfx.brush(); renderChar(); renderWardrobe(); sparkleOn(s.item.slot); }));
    $$('[data-item]', table).forEach(b => b.addEventListener('click', () => wear(D.ITEM_BY_ID[b.dataset.item])));
  }
  const SLOT_PT = { legwear: [200, 800], top: [200, 450], bottom: [200, 620], dress: [200, 560], outer: [200, 470], shoes: [200, 930], bag: [280, 610], necklace: [200, 380], ear: [110, 250], head: [200, 90], glasses: [200, 215] };
  function sparkleOn(slot) { const p = SLOT_PT[slot] || [200, 400], s = toScreen(p[0], p[1]); burst(s.x, s.y, 8); }
  function wear(it) {
    Sfx.init();
    const o = look.outfit, cur = o[it.slot];
    G.lastPick[it.cat] = it.id;
    if (isWorn(it)) {
      if (it.slot === 'top') { if (it.id === BASE_TOP.id) return; o.top = { ...BASE_TOP }; }
      else if (it.slot === 'bottom') { if (it.id === BASE_BOTTOM.id) return; o.bottom = { ...BASE_BOTTOM }; }
      else o[it.slot] = null;
      Sfx.pop(); renderChar(); renderWardrobe(); return;
    }
    o[it.slot] = { id: it.id, color: cur && cur.id === it.id ? cur.color : it.colors[0] };
    if (it.slot === 'top' || it.slot === 'bottom') o.dress = null;
    Sfx.sparkle(); renderChar(); renderWardrobe(); sparkleOn(it.slot); happy(800);
  }

  /* ================= pages ================= */
  function goPage(i) {
    if (i < 0 || i >= PAGES.length || G.use) return;
    const name = PAGES[i]; if (name === G.page) return;
    const dir = i > PAGES.indexOf(G.page) ? 1 : -1, m0 = charSvg.getScreenCTM();
    $('#toast').classList.remove('show');
    G.page = name; app.dataset.page = name; G.tool = null; G.eyesShut = false;
    table.style.setProperty('--sx', (dir * 46) + 'px');
    $$('.bg').forEach(b => { const k = PAGES.indexOf(b.id.slice(3)); b.style.setProperty('--bx', k === i ? '0%' : (k < i ? '-9%' : '9%')); b.classList.toggle('on', k === i); });
    setView(name, true); closePicker(); renderTable(true); updateNav(); Sfx.whoosh();
    flip(m0);
    if (name === 'makeup') setTimeout(() => { if (G.page === 'makeup' && !G.tool) toast('Nimm einen Pinsel und male aufs Gesicht 🖌️'); }, 700);
  }
  /* FLIP: draw the character at the new zoom once, then animate the layers with a GPU transform */
  const CHARBOXES = $$('.charbox');
  let flipT = 0;
  function flip(m0) {
    clearTimeout(flipT);
    CHARBOXES.forEach(el => { el.style.transition = 'none'; el.style.transform = ''; });
    const m1 = charSvg.getScreenCTM(); if (!m0 || !m1) return;
    G.flipping = false; layers.forEach(drawLayer); G.redraw = false;
    const O = CHARBOXES[0].getBoundingClientRect(), s = m0.a / m1.a;
    const tx = s * (O.left - m1.e) + m0.e - O.left, ty = s * (O.top - m1.f) + m0.f - O.top;
    CHARBOXES.forEach(el => { el.style.transformOrigin = '0 0'; el.style.transform = `translate(${tx}px,${ty}px) scale(${s})`; });
    G.flipping = true; void CHARBOXES[0].offsetWidth;
    requestAnimationFrame(() => CHARBOXES.forEach(el => { el.style.transition = 'transform .62s cubic-bezier(.22,.85,.25,1)'; el.style.transform = 'none'; }));
    flipT = setTimeout(() => { CHARBOXES.forEach(el => { el.style.transition = ''; el.style.transform = ''; }); G.flipping = false; G.redraw = true; }, 680);
  }
  function updateNav() {
    const i = PAGES.indexOf(G.page), m = META[G.page];
    $('#title').innerHTML = `<span>${m.e}</span>${m.title}<span class="dots">${PAGES.map(p => `<i class="${p === G.page ? 'on' : ''}"></i>`).join('')}</span>`;
    $('#nav-l').disabled = i === 0; $('#nav-r').disabled = i === PAGES.length - 1;
  }
  $('#nav-l').addEventListener('click', () => { Sfx.init(); goPage(PAGES.indexOf(G.page) - 1); });
  $('#nav-r').addEventListener('click', () => { Sfx.init(); goPage(PAGES.indexOf(G.page) + 1); });
  document.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') goPage(PAGES.indexOf(G.page) - 1); if (e.key === 'ArrowRight') goPage(PAGES.indexOf(G.page) + 1); });

  scene.addEventListener('pointerdown', e => {
    if (e.target.closest('#table, #picker, #shower, button')) return;
    Sfx.init();
    if (G.tool && !G.use && G.page !== 'dress') { useDown(e, G.tool, true); return; }
    G.swipe = { x: e.clientX, y: e.clientY };
  });
  scene.addEventListener('pointerup', e => {
    const s = G.swipe; G.swipe = null; if (!s) return;
    const dx = e.clientX - s.x, dy = e.clientY - s.y;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.4) { goPage(PAGES.indexOf(G.page) + (dx < 0 ? 1 : -1)); return; }
    if (Math.hypot(dx, dy) < 10) {
      const p = toSvg(e.clientX, e.clientY);
      if (Math.abs(p.x - 200) < 130 && p.y > 40 && p.y < 960) { happy(900); Sfx.pop(); burst(e.clientX, e.clientY, 5); }
    }
  });

  [scene, app].forEach(el => el.addEventListener('scroll', () => { el.scrollLeft = 0; el.scrollTop = 0; }));

  /* ================= horizontal strips: drag (mouse + touch), wheel, arrows ================= */
  const STRIPS = '.cats, .grid, .row-cards';
  let drag = null, eatClick = false;
  document.addEventListener('pointerdown', e => {
    const el = e.target.closest(STRIPS); if (!el || el.scrollWidth <= el.clientWidth + 2) return;
    drag = { el, x: e.clientX, sl: el.scrollLeft, moved: false, v: 0, lx: e.clientX, lt: performance.now(), id: e.pointerId };
    cancelAnimationFrame(el._glide || 0);
  }, true);
  document.addEventListener('pointermove', e => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x;
    if (!drag.moved && Math.abs(dx) > 6) drag.moved = true;
    if (drag.moved) { drag.el.scrollLeft = drag.sl - dx; const t = performance.now(), dt = Math.max(1, t - drag.lt); drag.v = drag.v * .6 + ((e.clientX - drag.lx) / dt) * .4; drag.lx = e.clientX; drag.lt = t; e.preventDefault(); }
  }, { capture: true, passive: false });
  const endDrag = e => {
    if (!drag || e.pointerId !== drag.id) return;
    const d = drag; drag = null;
    if (!d.moved) return;
    eatClick = true; setTimeout(() => { eatClick = false; }, 60);
    let v = -d.v * 16; const el = d.el;
    const glide = () => { if (Math.abs(v) < .4) { updArrows(el); return; } el.scrollLeft += v; v *= .93; el._glide = requestAnimationFrame(glide); };
    glide();
  };
  document.addEventListener('pointerup', endDrag, true); document.addEventListener('pointercancel', endDrag, true);
  document.addEventListener('click', e => { if (eatClick && e.target.closest(STRIPS)) { e.stopPropagation(); e.preventDefault(); eatClick = false; } }, true);
  document.addEventListener('wheel', e => {
    const el = e.target.closest(STRIPS); if (!el || el.scrollWidth <= el.clientWidth + 2) return;
    el.scrollLeft += Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX; e.preventDefault(); updArrows(el);
  }, { passive: false });
  function updArrows(el) {
    const w = el.parentElement && el.parentElement.classList.contains('strip') ? el.parentElement : null; if (!w) return;
    w.classList.toggle('can-l', el.scrollLeft > 4); w.classList.toggle('can-r', el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }
  function wireStrips(root) {
    $$(STRIPS, root).forEach(el => {
      if (!el.parentElement.classList.contains('strip')) { const w = document.createElement('div'); w.className = 'strip ' + (el.classList.contains('cats') ? 'cats-w' : 'grid-w'); el.parentElement.insertBefore(w, el); w.appendChild(el);
        w.insertAdjacentHTML('beforeend', '<button class="sarr l" aria-label="zurück">‹</button><button class="sarr r" aria-label="weiter">›</button>');
        w.querySelector('.sarr.l').addEventListener('click', ev => { ev.stopPropagation(); el.scrollBy({ left: -el.clientWidth * .8, behavior: 'smooth' }); setTimeout(() => updArrows(el), 400); });
        w.querySelector('.sarr.r').addEventListener('click', ev => { ev.stopPropagation(); el.scrollBy({ left: el.clientWidth * .8, behavior: 'smooth' }); setTimeout(() => updArrows(el), 400); });
        el.addEventListener('scroll', () => updArrows(el), { passive: true }); }
      requestAnimationFrame(() => updArrows(el));
    });
  }

  /* ================= top buttons ================= */
  function modal(html, cb) {
    const m = $('#modal'), card = $('#modal-card');
    card.innerHTML = html; m.classList.add('show');
    const close = a => { m.classList.remove('show'); card.innerHTML = ''; cb && cb(a); };
    $$('[data-a]', card).forEach(b => b.addEventListener('click', () => close(b.dataset.a)));
    m.onclick = e => { if (e.target === m) close('no'); };
  }
  $('#btn-reset').addEventListener('click', () => {
    Sfx.init(); Sfx.tap();
    modal('<h3>Neu anfangen?</h3><p>Haare, Make-up und Outfit werden zurückgesetzt.</p><div class="mrow"><button class="btn ghost" data-a="no">Nein</button><button class="btn" data-a="yes">Ja, neu</button></div>', a => {
      if (a !== 'yes') return;
      if (window.GAME && GAME.onReset) { GAME.onReset(); toast('Zurück zum Anfang ↺'); return; }
      look = freshLook(); G.lastPick = {}; G.tool = null; HAIR.build(look.hairColor); PAINT.clear(); G.redraw = true; closePicker(); renderChar(); renderTable(); toast('Alles zurückgesetzt ↺');
    });
  });
  const soundBtn = $('#btn-sound');
  const paintSound = () => { soundBtn.textContent = Sfx.on ? '🔊' : '🔇'; };
  soundBtn.addEventListener('click', () => { Sfx.init(); Sfx.on = !Sfx.on; try { localStorage.setItem('styleStudio.sound', Sfx.on ? '1' : '0'); } catch (e) {} paintSound(); Sfx.tap(); });

  /* ================= render loop ================= */
  const layers = [[$('#hb'), HAIR.drawBack], [$('#mu'), PAINT.drawUnder], [$('#mo'), PAINT.drawOver], [$('#hf'), HAIR.drawFront]].map(([cv, fn]) => ({ cv, ctx: cv.getContext('2d'), fn }));
  function drawLayer(l) {
    const dpr = Math.min(1.5, window.devicePixelRatio || 1), w = Math.round(l.cv.clientWidth * dpr), h = Math.round(l.cv.clientHeight * dpr);
    if (l.cv.width !== w || l.cv.height !== h) { l.cv.width = w; l.cv.height = h; }
    const m = charSvg.getScreenCTM(), r = l.cv.getBoundingClientRect();
    l.ctx.setTransform(1, 0, 0, 1, 0, 0); l.ctx.clearRect(0, 0, l.cv.width, l.cv.height);
    if (!m) return;
    l.ctx.setTransform(dpr * m.a, 0, 0, dpr * m.d, dpr * (m.e - r.left), dpr * (m.f - r.top));
    l.fn(l.ctx);
  }
  let lastT = 0, accT = 0, lastView = '', lastSig = 0;
  function frame(now) {
    if (!lastT) lastT = now;
    accT += Math.min(60, now - lastT); lastT = now;
    let n = 0;
    while (accT >= 16.67 && n < 3) { useTick(); HAIR.step(); accT -= 16.67; n++; }
    if (n === 3) accT = 0;
    const view = vb.join(',') + '|' + scene.clientWidth + 'x' + scene.clientHeight, sg = HAIR.sig();
    if (!G.flipping) {
      const vch = view !== lastView, all = G.redraw || vch;
      const hairD = all || Math.abs(sg - lastSig) > .01 || HAIR.busy() || (G.use && G.use.started && G.page === 'hair');
      const mkD = all || PAINT.dirty;
      if (hairD) { drawLayer(layers[0]); drawLayer(layers[3]); lastSig = sg; }
      if (mkD) { drawLayer(layers[1]); drawLayer(layers[2]); PAINT.dirty = false; }
      lastView = view; G.redraw = false;
    }
    const eyes = document.getElementById('eyes'), shut = document.getElementById('eyes-shut'), want = !!(G.eyesShut || G.blink) && !look.cucumbers;
    if (eyes && shut && eyes.dataset.s !== String(want)) { eyes.style.display = want ? 'none' : ''; shut.style.display = want ? '' : 'none'; eyes.dataset.s = String(want); }
    if (PAINT.shut !== want) { PAINT.shut = want; G.redraw = true; }
    requestAnimationFrame(frame);
  }

  /* ================= boot ================= */
  $('#bg-hair').innerHTML = ART.BG.salon();
  $('#bg-makeup').innerHTML = ART.BG.makeup();
  $('#bg-dress').innerHTML = ART.BG.dress();
  $('#bg-hair').classList.add('on');
  shower.innerHTML = ART.showerHang();
  HAIR.build(look.hairColor);
  renderChar(); setView('hair', true); renderTable(); updateNav(); paintSound();
  requestAnimationFrame(frame);
  window.GAME = {
    get look() { return look; },
    setLook(l) { look = l; G.lastPick = {}; G.tool = null; G.eyesShut = false; closePicker(); ring.classList.remove('on'); HAIR.build(look.hairColor); PAINT.clear(); G.redraw = true; renderChar(); renderTable(); },
    freshLook, renderChar, renderHead, toast, burst, toScreen, Sfx, PAGES,
    goPage: i => goPage(i), get page() { return G.page; }, get busy() { return !!G.use; },
    onReset: null, redraw() { G.redraw = true; },
  };
})();
