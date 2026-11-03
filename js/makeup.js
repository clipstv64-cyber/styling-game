'use strict';
/* =========================================================
   PAINT — free-hand make-up layers in character space.
   'under' sits below brows/eyes/mouth (foundation, blush,
   eyeshadow, glow, freckles); 'over' sits on top (lipstick,
   eyeliner, mascara, stickers).
   ========================================================= */
const PAINT = (() => {
  const OX = 70, OY = 70, W = 260, H = 290, K = 3;
  const mkCanvas = () => { const c = document.createElement('canvas'); c.width = W * K; c.height = H * K; return c; };
  const under = mkCanvas(), over = mkCanvas();
  const uc = under.getContext('2d'), oc = over.getContext('2d');
  let face = null, lips = null;
  const lashes = new Array(ART.LID.length).fill(0), mlash = {};
  const flags = { lips: false, eyes: false };

  function clips() { if (!face) { face = new Path2D(ART.FACE); lips = new Path2D(ART.LIPS); } }
  function begin(ctx, clip) {
    api.dirty = true;
    clips(); ctx.save(); ctx.setTransform(K, 0, 0, K, -OX * K, -OY * K);
    if (clip === 'face') ctx.clip(face); else if (clip === 'lips') ctx.clip(lips);
  }
  function rgba(c, a) { const [r, g, b] = U.rgb(c); return `rgba(${r},${g},${b},${a})`; }
  function soft(ctx, x, y, r, c, a) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, rgba(c, a)); g.addColorStop(.55, rgba(c, a * .55)); g.addColorStop(1, rgba(c, 0));
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.3); ctx.fill();
  }
  function hard(ctx, x, y, r, c, a = 1) { ctx.globalAlpha = a; ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.3); ctx.fill(); ctx.globalAlpha = 1; }
  function line(layer, clip, a, b, spacing, dab) {
    api.dirty = true;
    const ctx = layer === 'over' ? oc : uc; begin(ctx, clip);
    const d = Math.hypot(b.x - a.x, b.y - a.y), n = Math.max(1, Math.ceil(d / spacing));
    for (let i = 1; i <= n; i++) { const t = i / n; dab(ctx, a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t); }
    ctx.restore();
  }

  /* --- brushes --- */
  const B = {
    foundation: (a, b, c) => line('under', 'face', a, b, 4, (x, X, Y) => soft(x, X, Y, 17, c, .16)),
    shadow: (a, b, c) => line('under', 'face', a, b, 2, (x, X, Y) => soft(x, X, Y, 8, c, .2)),
    blush: (a, b, c) => line('under', 'face', a, b, 3, (x, X, Y) => soft(x, X, Y, 15, c, .08)),
    glow: (a, b, c) => line('under', 'face', a, b, 2, (x, X, Y) => soft(x, X, Y, 7, c, .2)),
    liner: (a, b, c) => { flags.eyes = true; line('over', 'face', a, b, .8, (x, X, Y) => hard(x, X, Y, 1.5, c)); },
    lips: (a, b, c) => { flags.lips = true; line('over', 'lips', a, b, 1.2, (x, X, Y) => hard(x, X, Y, 4.6, c, .55)); },
    freckles: (a, b, c, st) => {
      st.f = (st.f || 0) + Math.hypot(b.x - a.x, b.y - a.y) + 1.5;
      if (st.f < 7) return; st.f = 0;
      begin(uc, 'face');
      const ang = Math.random() * 6.28, r = Math.random() * 9;
      hard(uc, b.x + Math.cos(ang) * r, b.y + Math.sin(ang) * r, U.rand(.8, 1.3), c, .55);
      uc.restore();
    },
    mascara: (a, b, c) => {
      // volumising mascara: the brush lengthens & thickens the drawn lashes (same tapered, curved shape as the eye art)
      let any = false;
      for (let side = 0; side < 2; side++) ART.LASHES.forEach((L, j) => {
        const k = side * 100 + j, [tx, ty] = ART.eyeT(L[0], L[1]), bx = side ? 400 - tx : tx, by = ty;
        if (mlash[k] >= 3 || Math.hypot(b.x - bx, b.y - (by - 4)) > 13) return;
        mlash[k] = (mlash[k] || 0) + 1; any = true; flags.eyes = true;
        const lv = mlash[k], P = ART.lashPts(L[0], L[1], L[2], L[3] * (1.02 + .13 * lv), L[4] * (1 + .18 * lv)).map(([x, y]) => ART.eyeT(x, y)).map(([x, y]) => side ? [400 - x, y] : [x, y]);
        begin(oc, null);
        oc.fillStyle = c; oc.beginPath(); oc.moveTo(P[0][0], P[0][1]); oc.quadraticCurveTo(P[1][0], P[1][1], P[2][0], P[2][1]); oc.quadraticCurveTo(P[3][0], P[3][1], P[4][0], P[4][1]); oc.closePath(); oc.fill();
        // lash line gets a little denser with each coat
        oc.strokeStyle = c; oc.lineWidth = 1.6 + .5 * lv; oc.lineCap = 'round'; oc.beginPath();
        const nb = ART.LASHES[Math.min(ART.LASHES.length - 1, j + 1)], [nbx, nby] = ART.eyeT(nb[0], nb[1]), nx2 = side ? 400 - nbx : nbx;
        oc.moveTo(bx, by); oc.lineTo(nx2, nby); oc.stroke();
        oc.restore();
      });
      return any;
    },
    sticker: (a, b, kind, st) => {
      st.s = (st.s === undefined ? 99 : st.s) + Math.hypot(b.x - a.x, b.y - a.y);
      if (st.s < 34) return false; st.s = 0;
      begin(oc, null);
      const x = b.x, y = b.y;
      if (kind === 'heart') { const p = new Path2D(ART.heart(x, y, 9)); oc.fillStyle = '#ff4f8b'; oc.fill(p); oc.strokeStyle = '#fff'; oc.lineWidth = 1.3; oc.stroke(p); hard(oc, x - 4, y - 5, 2, '#fff', .75); }
      if (kind === 'star') { const p = new Path2D(ART.star(x, y, 10, 4.3)); oc.fillStyle = '#ffd54a'; oc.fill(p); oc.strokeStyle = '#f2a900'; oc.lineWidth = 1; oc.stroke(p); }
      if (kind === 'gems') { [['#8fd0ff', 0, -7, 5], ['#ff8fc4', 7, 3, 4.5], ['#c9a7ff', -5, 6, 4]].forEach(([c, dx, dy, r]) => { oc.fillStyle = c; oc.fill(new Path2D(ART.spark4(x + dx, y + dy, r))); }); }
      if (kind === 'moon') { const p = new Path2D(`M${x},${y - 11} A11,11 0 1,0 ${x + 5},${y + 9} A8,8 0 1,1 ${x},${y - 11} Z`); oc.fillStyle = '#ffd54a'; oc.fill(p); oc.strokeStyle = '#f2a900'; oc.lineWidth = 1; oc.stroke(p); }
      if (kind === 'flower') { for (let i = 0; i < 5; i++) { const t = i * 1.2566; hard(oc, x + Math.cos(t) * 5, y + Math.sin(t) * 5, 4.2, '#ff8fc4'); } hard(oc, x, y, 3, '#ffd54a'); }
      oc.restore();
      return true;
    },
  };
  /* blending brush: softens & drags existing make-up (result = orig*(1-m) + blurred*m) */
  const tmpA = document.createElement('canvas'), tmpB = document.createElement('canvas');
  function blendAt(canvas, x, y, r, dx, dy) {
    const ctx = canvas.getContext('2d'), R = Math.ceil(r * K), S = R * 2, cx = (x - OX) * K, cy = (y - OY) * K;
    if (cx < -R || cy < -R || cx > canvas.width + R || cy > canvas.height + R) return;
    tmpA.width = S; tmpA.height = S; tmpB.width = Math.max(2, Math.round(S / 3.2)); tmpB.height = tmpB.width;
    const a = tmpA.getContext('2d'), b = tmpB.getContext('2d');
    // source sampled a little "behind" the stroke so colour is dragged along
    b.imageSmoothingEnabled = true; b.clearRect(0, 0, tmpB.width, tmpB.height);
    b.drawImage(canvas, cx - R - dx * K * .6, cy - R - dy * K * .6, S, S, 0, 0, tmpB.width, tmpB.height);
    a.imageSmoothingEnabled = true; a.clearRect(0, 0, S, S); a.drawImage(tmpB, 0, 0, tmpB.width, tmpB.height, 0, 0, S, S);
    const m = a.createRadialGradient(R, R, 0, R, R, R); m.addColorStop(0, 'rgba(0,0,0,.32)'); m.addColorStop(.6, 'rgba(0,0,0,.18)'); m.addColorStop(1, 'rgba(0,0,0,0)');
    a.globalCompositeOperation = 'destination-in'; a.fillStyle = m; a.fillRect(0, 0, S, S); a.globalCompositeOperation = 'source-over';
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = 'destination-out'; const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R); g.addColorStop(0, 'rgba(0,0,0,.32)'); g.addColorStop(.6, 'rgba(0,0,0,.18)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(cx - R, cy - R, S, S);
    ctx.globalCompositeOperation = 'source-over'; ctx.drawImage(tmpA, cx - R, cy - R);
    ctx.restore();
  }
  function blend(a, b, r = 11) {
    const d = Math.hypot(b.x - a.x, b.y - a.y), n = Math.max(1, Math.ceil(d / 4));
    for (let i = 1; i <= n; i++) { const t = i / n, x = a.x + (b.x - a.x) * t, y = a.y + (b.y - a.y) * t, dx = (b.x - a.x) / n, dy = (b.y - a.y) / n; blendAt(under, x, y, r, dx, dy); blendAt(over, x, y, r * .8, dx, dy); }
    api.dirty = true;
  }
  function erase(x, y, r) {
    for (const ctx of [uc, oc]) {
      begin(ctx, null); ctx.globalCompositeOperation = 'destination-out';
      soft(ctx, x, y, r, '#000000', .6); ctx.restore();
    }
    ART.LID.forEach((p, j) => { if (Math.hypot(x - p.x, y - p.y) < r) lashes[j] = 0; });
    for (let side = 0; side < 2; side++) ART.LASHES.forEach((L, j) => { const [tx, ty] = ART.eyeT(L[0], L[1]), bx = side ? 400 - tx : tx; if (Math.hypot(x - bx, y - ty) < r + 6) mlash[side * 100 + j] = 0; });
  }
  function clear() { api.dirty = true; uc.clearRect(0, 0, under.width, under.height); oc.clearRect(0, 0, over.width, over.height); lashes.fill(0); for (const k in mlash) delete mlash[k]; flags.lips = false; flags.eyes = false; }
  function drawUnder(ctx) { ctx.drawImage(under, OX, OY, W, H); }
  /* lip details drawn on top of painted lipstick: shading, mouth line, creases, gloss */
  let up = null, lo = null, lipsP = null;
  function lipDetail(ctx) {
    if (!up) { up = new Path2D(ART.LIPS_UP); lo = new Path2D(ART.LIPS_LO); lipsP = new Path2D(ART.LIPS); }
    ctx.save(); ctx.clip(lipsP);
    ctx.fillStyle = 'rgba(70,10,30,.16)'; ctx.fill(up);
    let g = ctx.createLinearGradient(0, 288, 0, 304); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.55, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(60,5,25,.28)'); ctx.fillStyle = g; ctx.fill(lo);
    g = ctx.createRadialGradient(200, 282, 1, 200, 282, 26); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(60,5,25,.22)'); ctx.fillStyle = g; ctx.fill(lipsP);
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgba(60,5,22,.18)'; ctx.lineWidth = .7; ctx.beginPath();
    [[186, 291, 185, 298], [191, 291, 190.5, 300], [196, 291.5, 196, 301], [204, 291.5, 204, 301], [209, 291, 209.5, 300], [214, 291, 215, 298], [188, 281, 189, 285.5], [194, 279.5, 194.5, 285.5], [206, 279.5, 205.5, 285.5], [212, 281, 211, 285.5]].forEach(([a, b, c, d]) => { ctx.moveTo(a, b); ctx.quadraticCurveTo((a + c) / 2 + .6, (b + d) / 2, c, d); });
    ctx.stroke(); ctx.restore();
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgba(55,5,20,.7)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(177, 285.5); ctx.bezierCurveTo(186, 288.5, 214, 288.5, 223, 285.5); ctx.stroke();
    ctx.fillStyle = 'rgba(55,5,20,.22)'; [[176, 284.6], [224, 284.6]].forEach(([x, y]) => { ctx.beginPath(); ctx.arc(x, y, 1, 0, 6.3); ctx.fill(); });
    ctx.strokeStyle = 'rgba(255,255,255,.4)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(193, 280); ctx.bezierCurveTo(196, 278.5, 198, 280, 200, 281); ctx.bezierCurveTo(202, 280, 204, 278.5, 207, 280); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.beginPath(); ctx.ellipse(205, 295, 6.5, 2.4, -.08, 0, 6.3); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.3)'; ctx.beginPath(); ctx.ellipse(191, 294.6, 3, 1.3, .1, 0, 6.3); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.25)'; ctx.beginPath(); ctx.ellipse(208, 282.6, 3.4, 1.2, -.2, 0, 6.3); ctx.fill();
  }
  /* average colour + coverage of painted make-up inside circles (character coords) */
  function sample(layer, pts, r) {
    const cv = layer === 'over' ? over : under, ctx = cv.getContext('2d');
    let A = 0, R = 0, G = 0, Bc = 0, N = 0;
    for (const p of pts) {
      const x0 = Math.round((p.x - r - OX) * K), y0 = Math.round((p.y - r - OY) * K), S = Math.round(2 * r * K);
      const d = ctx.getImageData(x0, y0, S, S).data;
      for (let y = 0; y < S; y += 2) for (let x = 0; x < S; x += 2) {
        const dx = x - S / 2, dy = y - S / 2; if (dx * dx + dy * dy > S * S / 4) continue;
        const i = (y * S + x) * 4, a = d[i + 3] / 255; N++; A += a; R += d[i] * a; G += d[i + 1] * a; Bc += d[i + 2] * a;
      }
    }
    return { cov: N ? A / N : 0, rgb: A > 0 ? [R / A, G / A, Bc / A] : null };
  }
  const api = { B, erase, clear, drawUnder, flags, shut: false, dirty: true, blend, sample };
  api.drawOver = ctx => {
    if (api.shut) {
      ctx.save(); const r = new Path2D(); r.rect(0, 0, 400, 1000);
      [150, 250].forEach(x => { r.moveTo(x + 50, 212); r.ellipse(x, 212, 50, 38, 0, 0, Math.PI * 2); }); ctx.clip(r, 'evenodd');
      ctx.drawImage(over, OX, OY, W, H); ctx.restore();
    } else ctx.drawImage(over, OX, OY, W, H);
    if (flags.lips) lipDetail(ctx);
  };
  return api;
})();
