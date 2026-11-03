'use strict';
/* =========================================================
   HAIR — strand physics (follow-the-leader chains) in character space.
   The physics only simulates a calm "guide" line per strand. Curls are
   a stable per-point spiral drawn on top of that guide, so curly hair
   never fights the solver.
   ========================================================= */
const HAIR = (() => {
  const SEG = 8, MAXL = 58, C = { x: 200, y: 212 }, ERX = 101, ERY = 117;
  const OMEGA = Math.PI * 2 / 25;
  const state = { wet: 0, t: 0 };
  let S = [], debris = [], foam = [];

  function mk(layer, rx, ry, nx, ny, len, w, cap, color) {
    const l = Math.hypot(nx, ny) || 1; nx /= l; ny /= l;
    const pts = [];
    for (let i = 0; i <= len; i++) {
      const x = rx + nx * Math.min(i, 1) * SEG, y = ry + ny * Math.min(i, 1) * SEG + Math.max(0, i - 1) * SEG;
      pts.push({ x, y, px: x, py: y });
    }
    return { layer, rx, ry, nx, ny, w, cap, pts, col: pts.map(() => color), cv: pts.map(() => 0), phase: Math.random() * 6.28, spray: 0, rest: null, grow: 0, frizz: 0, blunt: false, tipLen: 0, shade: U.rand(-1.5, 1.5) };
  }
  const sliceStrand = (s, n) => { s.pts = s.pts.slice(0, n); s.col = s.col.slice(0, n); s.cv = s.cv.slice(0, n); if (s.rest) s.rest = s.rest.slice(0, n); };

  function trimTo(s, maxY) {
    const P = s.pts;
    for (let i = 2; i < P.length; i++) if (P[i].y > maxY) {
      const a = P[i - 1], b = P[i], t = (maxY - a.y) / ((b.y - a.y) || 1);
      if (t > .15) { b.x = a.x + (b.x - a.x) * t; b.y = maxY; b.px = b.x; b.py = b.y; s.tipLen = SEG * t; sliceStrand(s, i + 1); }
      else { sliceStrand(s, i); s.tipLen = 0; }
      break;
    }
    s.blunt = true;
  }

  function build(color) {
    S = []; debris = []; foam = []; state.wet = 0;
    const NB = 124;
    for (let k = 0; k < NB; k++) {
      const t = k / (NB - 1), a = (-178 + t * 176) * Math.PI / 180, row = k % 2 ? .955 : 1;
      const x = C.x + Math.cos(a) * ERX * 1.05 * row, y = C.y + Math.sin(a) * ERY * 1.03 * row;
      const side = x < C.x ? 1 : -1, tx = -Math.sin(a) * side, ty = Math.cos(a) * side;
      const ox = Math.cos(a) * .2 + (ty >= 0 ? tx : -tx), oy = Math.sin(a) * .2 + Math.abs(ty);
      S.push(mk('back', x, y, ox, oy, 62, 15, null, color));
    }
    const NN = 28;
    for (let k = 0; k < NN; k++) {
      const t = k / (NN - 1), x = 110 + t * 180, y = 236 + (1 - Math.abs(t - .5) * 2) * 46;
      const s = mk('back', x, y, (x - 200) / 300, 1, 62, 19, null, color); s.nape = true; S.push(s);
    }
    const N = 40;
    for (let k = 0; k < N; k++) {
      const t = k / (N - 1), e = Math.abs(t - .5) * 2, sideX = t < .5 ? -1 : 1;
      const long = e > .68;
      let x = 110 + t * 180, y = 128 + Math.pow(e, 1.8) * 80;
      if (long) { const u = (e - .68) / .32; y = 162 + u * 50; x = C.x + sideX * (92 * Math.sqrt(Math.max(0, 1 - ((y - 214) / 112) ** 2)) - 2); }
      const a = Math.atan2(y - C.y, x - C.x);
      let cap = { x: C.x + Math.cos(a) * ERX, y: C.y + Math.sin(a) * ERY };
      if (long) { const cx = x + sideX * 3, q = Math.min(.98, ((cx - C.x) / ERX) ** 2); cap = { x: cx, y: C.y - ERY * Math.sqrt(1 - q) }; }
      const s = mk('front', x, y, long ? -sideX * .08 : (x - 200) / 170 * .2, 1, long ? 62 : 8, long ? 19 : 17, cap, color);
      s.zone = long ? 'long' : 'bang'; s.drape = long ? (e - .68) / .32 * 14 : 0; s.fringe = Math.max(y + 6, 169 + Math.pow(Math.abs(x - 200) / 72, 2) * 6);
      S.push(s);
    }
    for (let i = 0; i < 500; i++) step();
    for (const s of S) {
      if (s.layer === 'back' || s.zone === 'long') { trimTo(s, s.zone==='long' ? 530-(s.drape||0)*.7 : 548-14*Math.pow(Math.abs(s.rx-200)/110,1.5)); s.blunt=false; }
      else { trimTo(s, s.fringe + 4); s.blunt = false; }
    }
    for (let i = 0; i < 200; i++) step();
  }

  /* ---------- simulation (calm guide lines) ---------- */
  function step() {
    const wet = state.wet; state.t++;
    for (const s of S) {
      const P = s.pts, n = P.length;
      P[0].x = s.rx; P[0].y = s.ry;
      if (n < 2) continue;
      P[1].x = s.rx + s.nx * SEG; P[1].y = s.ry + s.ny * SEG; P[1].px = P[1].x; P[1].py = P[1].y;
      const grav = .34 * (1 + wet * .9) * (1 - .9 * s.spray);
      for (let i = 2; i < n; i++) {
        const p = P[i]; let vx = (p.x - p.px) * .88, vy = (p.y - p.py) * .88;
        const sp = Math.hypot(vx, vy); if (sp > 12) { vx *= 12 / sp; vy *= 12 / sp; }
        p.px = p.x; p.py = p.y; p.x += vx; p.y += vy + grav;
      }
      for (let it = 0; it < 3; it++) {
        for (let i = 2; i < n; i++) {
          const a = P[i - 2], b = P[i - 1], c = P[i];
          let ux = b.x - a.x, uy = b.y - a.y; const ul = Math.hypot(ux, uy) || 1; ux /= ul; uy /= ul;
          const kk = .07 * Math.max(.12, 1 - i / 10) + .05 * s.cv[i];
          c.x += (b.x + ux * SEG - c.x) * kk; c.y += (b.y + uy * SEG - c.y) * kk;
        }
        if (s.spray > 0 && s.rest) {
          const m = Math.min(n, s.rest.length);
          for (let i = 2; i < m; i++) { const c = P[i], r = s.rest[i]; c.x += (r.x - c.x) * .35 * s.spray; c.y += (r.y - c.y) * .35 * s.spray; }
        }
        if (s.zone === 'long' && s.spray < .5) { const side = s.rx < C.x ? -1 : 1, k = .035 * (1 - 2 * s.spray);
          for (let i = 2; i < n; i++) { const p = P[i]; if (p.y < 245) continue; const u0 = Math.min(1, (p.y - 245) / 150), u = u0 * u0 * (3 - 2 * u0), xt = C.x + side * (92 - u * 30 - (s.drape || 0) * u); p.x += (xt - p.x) * k * u; } }
        if (s.zone === 'long') for (let i = 2; i < n; i++) {
          const p = P[i], qx = (p.x - C.x) / 95, qy = (p.y - 214) / 112, q = qx * qx + qy * qy;
          if (q < 1) { const f = 1 / Math.sqrt(q || .0001), w = Math.min(1, Math.max(0, (p.y - 140) / 30)); p.x += (C.x + (p.x - C.x) * f - p.x) * w; p.y += (214 + (p.y - 214) * f - p.y) * w; }
        }
        if (s.layer === 'back' && !s.nape && s.spray < .5 && Math.abs(s.rx - C.x) > 70) { const side = s.rx < C.x ? -1 : 1, k = .02 * (1 - 2 * s.spray);
          for (let i = 2; i < n; i++) { const p = P[i]; if (p.y < 300) continue; const u = Math.min(1, (p.y - 300) / 120), xt = C.x + side * (100 - u * 22); if (side * (p.x - xt) > 0) p.x += (xt - p.x) * k * u; } }
        if (s.layer === 'back' && !s.nape) for (let i = 2; i < n; i++) {
          const p = P[i], qx = (p.x - C.x) / (ERX * 1.07), qy = (p.y - C.y) / (ERY * 1.03), q = qx * qx + qy * qy;
          if (q < 1) { const f = 1 / Math.sqrt(q || .0001); p.x = C.x + (p.x - C.x) * f; p.y = C.y + (p.y - C.y) * f; }
        }
        for (let i = 2; i < n; i++) {
          const a = P[i - 1], b = P[i];
          const base = (i === n - 1 && s.tipLen) ? s.tipLen : SEG;
          const L = base * (1 - .3 * s.cv[i] * (1 - .6 * wet));
          const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || .001, f = (d - L) / d;
          const cx = -dx * f, cy = -dy * f;
          b.x += cx; b.y += cy;
          if (i > 2) { a.px += cx * .9; a.py += cy * .9; }
        }
      }
    }
    for (const d of debris) { d.vy += .45; d.vx *= .98; for (const p of d.pts) { p.x += d.vx; p.y += d.vy; } d.life--; }
    debris = debris.filter(d => d.life > 0);
  }

  /* ---------- helpers ---------- */
  const d2 = (ax, ay, bx, by) => (ax - bx) * (ax - bx) + (ay - by) * (ay - by);
  function distSeg(px, py, ax, ay, bx, by) {
    const vx = bx - ax, vy = by - ay, l = vx * vx + vy * vy || 1;
    const t = Math.max(0, Math.min(1, ((px - ax) * vx + (py - ay) * vy) / l));
    return Math.sqrt(d2(px, py, ax + vx * t, ay + vy * t));
  }
  const capDist = (s, x, y) => (s.cap ? distSeg(x, y, s.cap.x, s.cap.y, s.rx, s.ry) : Math.sqrt(d2(x, y, s.rx, s.ry)));
  function touch(s, x, y, r) {
    if (capDist(s, x, y) < r) return true;
    const r2 = r * r; for (const p of s.pts) if (d2(p.x, p.y, x, y) < r2) return true;
    return false;
  }
  function segX(ax, ay, bx, by, cx, cy, dx, dy) {
    const den = (bx - ax) * (dy - cy) - (by - ay) * (dx - cx);
    if (Math.abs(den) < 1e-9) return false;
    const t = ((cx - ax) * (dy - cy) - (cy - ay) * (dx - cx)) / den, u = ((cx - ax) * (by - ay) - (cy - ay) * (bx - ax)) / den;
    return t >= 0 && t <= 1 && u >= 0 && u <= 1;
  }
  function cutAt(s, i, vx = 0) {
    const P = s.pts; if (i < 1 || i >= P.length) return;
    debris.push({ pts: P.slice(i - 1).map(p => ({ x: p.x, y: p.y })), col: s.col.slice(i - 1), cv: s.cv.slice(i - 1), phase: s.phase, w: s.w, vx: vx * .15 + U.rand(-1, 1), vy: -1.2, life: 70 });
    sliceStrand(s, i); s.grow = 0; s.blunt = true; s.tipLen = 0;
    foam = foam.filter(f => !(f.s === s && f.i >= i));
  }

  /* ---------- tools (character coords) ---------- */
  function cut(ax, ay, bx, by) {
    let n = 0;
    for (const s of S) {
      const P = s.pts;
      for (let i = 1; i < P.length; i++) if (segX(ax, ay, bx, by, P[i - 1].x, P[i - 1].y, P[i].x, P[i].y)) { cutAt(s, Math.max(1, i), bx - ax); n++; break; }
    }
    return n;
  }
  function shave(x, y, r) {
    let n = 0; const r2 = r * r;
    for (const s of S) {
      if (s.pts.length <= 1) continue;
      let hit = capDist(s, x, y) < r;
      if (!hit && s.nape) for (let i = 0; i < Math.min(12, s.pts.length); i++) if (d2(s.pts[i].x, s.pts[i].y, x, y) < r2) { hit = true; break; }
      if (hit) { cutAt(s, 1); n++; }
    }
    if (n) { const head = S.filter(s => !s.nape), bald = head.filter(s => s.pts.length <= 1).length;
      if (bald / head.length > .85) for (const s of S) if (s.nape && s.pts.length > 1) { cutAt(s, 1); n++; } }
    return n;
  }
  function grow(x, y, r, amt) {
    let any = false;
    for (const s of S) {
      if (!touch(s, x, y, r)) continue;
      any = true; s.grow += amt;
      while (s.grow >= SEG && s.pts.length - 1 < MAXL) {
        s.grow -= SEG;
        const P = s.pts, n = P.length; let dx, dy;
        if (n >= 2) { dx = P[n - 1].x - P[n - 2].x; dy = P[n - 1].y - P[n - 2].y; const l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l; }
        else { dx = s.nx; dy = s.ny; }
        dy = dy * .6 + .4; const l2 = Math.hypot(dx, dy) || 1; dx /= l2; dy /= l2;
        const nx = P[n - 1].x + dx * SEG, ny = P[n - 1].y + dy * SEG;
        P.push({ x: nx, y: ny, px: nx, py: ny }); s.col.push(s.col[n - 1]); s.cv.push(s.cv[n - 1]); s.blunt = false; s.tipLen = 0;
      }
      if (s.pts.length - 1 >= MAXL) s.grow = 0;
    }
    return any;
  }
  // comb: grab the strand where the comb passes and drag it, the part below follows
  function comb(ax, ay, bx, by, r) {
    let dx = bx - ax, dy = by - ay; const l = Math.hypot(dx, dy);
    if (l < .01) return false;
    if (l > 24) { dx *= 24 / l; dy *= 24 / l; }
    const R = r * 1.45, r2 = R * R; let any = false;
    for (const s of S) {
      const P = s.pts, n = P.length; let hit = -1, best = r2;
      for (let i = 2; i < n; i++) { const q = Math.min(d2(P[i].x, P[i].y, ax, ay), distSeg(P[i].x, P[i].y, ax, ay, bx, by) ** 2); if (q < best) { best = q; hit = i; } }
      if (hit < 0 && s.zone === 'bang' && n > 2) { const q = Math.min(capDist(s, ax, ay), Math.sqrt(d2(P[1].x, P[1].y, ax, ay))) ** 2; if (q < r2) { best = q; hit = 2; } }
      if (hit < 0) continue;
      const near = 1 - .3 * Math.sqrt(best) / R;
      for (let j = Math.max(2, hit - 4); j < n; j++) {
        const w = j < hit ? near * (1 - (hit - j) / 5) * .7 : near * Math.max(.7, 1 - (j - hit) / 30);
        P[j].x += dx * w; P[j].y += dy * w; P[j].px = P[j].x; P[j].py = P[j].y;
      }
      if (s.cap && hit <= 6) {
        const k = s.zone === 'bang' ? .05 : .02; let nx = s.nx + dx * k, ny = s.ny + dy * k * .5; ny = Math.max(.25, ny); const l2 = Math.hypot(nx, ny) || 1; s.nx = nx / l2; s.ny = ny / l2;
        P[1].x = s.rx + s.nx * SEG; P[1].y = s.ry + s.ny * SEG; P[1].px = P[1].x; P[1].py = P[1].y;
      }
      any = true; s.frizz = Math.max(0, s.frizz - .015);
      s.spray = Math.max(s.spray, s.zone === 'bang' ? .9 : .6); s.rest = P.map(p => ({ x: p.x, y: p.y }));
    }
    return any;
  }
  function settleComb() {}
  function blow(x, y, r, str) {
    const r2 = r * r; let any = false;
    for (const s of S) for (let i = 2; i < s.pts.length; i++) {
      const p = s.pts[i], q = d2(p.x, p.y, x, y);
      if (q < r2) { const d = Math.sqrt(q) || 1, f = (1 - d / r) * str; p.x += (p.x - x) / d * f + U.rand(-.6, .6); p.y += (p.y - y) / d * f + U.rand(-.6, .6); any = true; if (state.wet < .3) s.frizz = Math.min(1, s.frizz + .0015); }
    }
    return any;
  }
  // curl / straighten only where the tool touches (per point)
  function curlAt(x, y, r, delta) {
    const r2 = r * r; let any = false;
    for (const s of S) {
      let hit = false;
      const rq = s.zone === 'bang' ? r * 1.35 : r, rq2 = rq * rq;
      for (let i = 1; i < s.pts.length; i++) {
        const q = d2(s.pts[i].x, s.pts[i].y, x, y) * (r2 / rq2);
        if (q < r2) {
          const w = 1 - .5 * Math.sqrt(q) / r;
          for (let j = Math.max(1, i - 2); j <= Math.min(s.pts.length - 1, i + 2); j++) s.cv[j] = Math.max(0, Math.min(1, s.cv[j] + delta * w * (j === i ? 1 : .5)));
          hit = true;
        }
      }
      if (hit) { any = true; s.spray = 0; s.rest = null; if (delta < 0) s.frizz = Math.max(0, s.frizz - .02); }
    }
    return any;
  }
  function paint(x, y, r, color) {
    const r2 = r * r; let any = false;
    for (const s of S) {
      if (capDist(s, x, y) < r) { s.col[0] = color; any = true; }
      for (let i = 1; i < s.pts.length; i++) if (d2(s.pts[i].x, s.pts[i].y, x, y) < r2) { s.col[i] = color; any = true; }
    }
    return any;
  }
  function recolorAll(color) { for (const s of S) s.col = s.col.map(() => color); }
  function addFoam(x, y) {
    if (foam.length > 200) return false;
    let best = null, bd = 34 * 34;
    for (const s of S) for (let i = 0; i < s.pts.length; i++) { const q = d2(s.pts[i].x, s.pts[i].y, x, y); if (q < bd) { bd = q; best = { s, i }; } }
    if (!best) { const s = S.find(s => s.cap && capDist(s, x, y) < 20); if (s) best = { s, i: 0 }; }
    if (!best) return false;
    const p = best.s.pts[best.i];
    foam.push({ s: best.s, i: best.i, ox: x - p.x + U.rand(-5, 5), oy: y - p.y + U.rand(-5, 5), r: U.rand(7, 14) });
    return true;
  }
  function foamPos(f) { const p = f.s.pts[Math.min(f.i, f.s.pts.length - 1)]; return { x: p.x + f.ox, y: p.y + f.oy }; }
  function water(x, y, hw) {
    let hit = false; const popped = [];
    for (const s of S) {
      let sh = false;
      for (let i = 0; i < s.pts.length; i++) { const p = s.pts[i]; if (Math.abs(p.x - x) < hw && p.y > y && p.y < y + 320) { sh = true; if (i >= 2) p.y += .35; } }
      if (!sh && s.cap && Math.abs(s.cap.x - x) < hw && s.cap.y > y) sh = true;
      if (sh) { hit = true; s.spray = 0; s.rest = null; }
    }
    foam = foam.filter(f => { const q = foamPos(f); if (Math.abs(q.x - x) < hw && q.y > y && Math.random() < .25) { popped.push(q); return false; } return true; });
    return { hit, popped };
  }
  function sprayAt(x, y, r) { let n = 0; for (const s of S) if (touch(s, x, y, r)) { s.spray = 1; s.rest = s.pts.map(p => ({ x: p.x, y: p.y })); n++; } return n; }
  function overHair(x, y, r) { for (const s of S) if (touch(s, x, y, r)) return true; return false; }

  /* ---------- display line: guide + stable spiral for curls ---------- */
  function displayLine(s) {
    const P = s.pts, n = P.length, cv = s.cv || [];
    let curly = false; for (let i = 0; i < n; i++) if ((cv[i] || 0) > .02) { curly = true; break; }
    const wetK = 1 - .7 * state.wet;
    const pre = [];
    if(s.cap) {
      const a=s.cap, b=P[0], dx=b.x-a.x;
      const p1={x:a.x+dx*.65,y:a.y+6},p2={x:b.x-s.nx*12,y:b.y-s.ny*16};
      for(let k=0;k<8;k++) { const t=k/8,u=1-t;
        pre.push({x:u*u*u*a.x+3*u*u*t*p1.x+3*u*t*t*p2.x+t*t*t*b.x,
          y:u*u*u*a.y+3*u*u*t*p1.y+3*u*t*t*p2.y+t*t*t*b.y,ci:0,c:0,th:0});
      }
    }
    if (!curly) return pre.concat(P.map((p, i) => ({ x: p.x, y: p.y, ci: i, c: 0, th: 0 })));
    const out = pre.concat([{ x: P[0].x, y: P[0].y, ci: 0, c: 0, th: 0 }]); let dist = 0; const SUB = 3;
    let total = 0; for (let i = 0; i < n - 1; i++) total += Math.hypot(P[i + 1].x - P[i].x, P[i + 1].y - P[i].y);
    const short = total < 90, r0 = short ? 0 : 1, rr = short ? Math.max(5, total * .15) : 10, ampK = short ? Math.min(12, 4 + total * .14) : 12, om = short ? Math.max(OMEGA, Math.PI * 2 / Math.max(14, total * .7)) : OMEGA;
    for (let i = 0; i < n - 1; i++) {
      const a = P[i], b = P[i + 1], dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1, tx = dx / len, ty = dy / len, nx = -ty, ny = tx;
      for (let k = 1; k <= SUB; k++) {
        const t = k / SUB, c = ((cv[i] || 0) * (1 - t) + (cv[i + 1] || 0) * t) * wetK, d = dist + len * t;
        const amp = c * ampK * Math.min(1, Math.max(0, (d - r0) / rr)), th = d * om * (1 + .25 * c) + s.phase;
        const along = amp * .62 * Math.max(0, c - .35);
        out.push({ x: a.x + dx * t + nx * amp * Math.sin(th) + tx * along * Math.cos(th), y: a.y + dy * t + ny * amp * Math.sin(th) + ty * along * Math.cos(th), ci: t < .5 ? i : i + 1, c: amp > 1.5 ? c : 0, th });
      }
      dist += len;
    }
    return out;
  }

  /* ---------- drawing ---------- */
  let colCache = {};
  function wc(c) { const k = c + state.wet.toFixed(2); if (!colCache[k]) { const f = U.shade(c, -30 * state.wet); colCache[k] = { f, r: U.shade(f, -12), t: U.shade(f, 9), o: U.shade(c, (U.luma(c) > .55 ? -30 : -40) - 18 * state.wet) }; } return colCache[k]; }
  function geom(s) {
    if (s.pts.length < 2) return null;
    const D = displayLine(s), n = D.length; if (n < 2) return null;
    const L = [], R = [], W = [];
    for (let i = 0; i < n; i++) {
      const a = D[Math.max(0, i - 1)], b = D[Math.min(n - 1, i + 1)];
      let tx = b.x - a.x, ty = b.y - a.y; const tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl;
      const t = i / Math.max(1, n - 1);
      const capT = s.cap ? Math.min(1,.06+i*.14) : Math.min(1,.08+i*.3);
      const prof = capT * (s.blunt ? 1 - .12 * t : s.zone === 'bang' ? (t < .7 ? 1 : 1 - Math.pow((t - .7) / .3, 2) * .55) : (t < .62 ? 1 - .1 * t : .94 * Math.pow(1 - (t - .62) / .38, .8) + .04));
      const w = s.w * prof * (1 - .25 * state.wet) * (1 + .5 * (D[i].c || 0)) / 2;
      W.push(w); L.push([D[i].x - ty * w, D[i].y + tx * w]); R.push([D[i].x + ty * w, D[i].y - tx * w]);
    }
    const runs = []; let i0 = 0;
    while (i0 < n - 1) { let j = i0; while (j + 1 < n - 1 && s.col[D[j + 1].ci] === s.col[D[i0].ci]) j++; runs.push([i0, j + 1]); i0 = j + 1; }
    return { D, L, R, W, runs };
  }
  function smoothTo(ctx, pts, first) {
    if (!pts.length) return;
    if (first) ctx.moveTo(pts[0][0], pts[0][1]); else ctx.lineTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length - 1; i++) ctx.quadraticCurveTo(pts[i][0], pts[i][1], (pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2);
    const l = pts[pts.length - 1]; ctx.lineTo(l[0], l[1]);
  }
  function runPath(ctx, g, a, b) { ctx.beginPath(); smoothTo(ctx, g.L.slice(a, b + 1), true); smoothTo(ctx, g.R.slice(a, b + 1).reverse(), false); ctx.closePath(); }

  function drawSet(ctx, list, dim) {
    const C2 = (c, extra = 0) => { const k = wc(c), dd = dim + extra; return dd ? { f: U.shade(k.f, dd), r: U.shade(k.r, dd), t: U.shade(k.t, dd), o: U.shade(k.o, dim) } : k; };
    // Join pristine crown roots into one silhouette; shaved follicles reveal the scalp.
    if (list.length && list[0].layer === 'back' && list.every(s => s.pts.length > 1)) {
      ctx.fillStyle = C2(list[0].col[0]).f;
      ctx.beginPath(); ctx.ellipse(200,212,101,117,0,Math.PI,Math.PI*2); ctx.closePath(); ctx.fill();
    }
    const G = list.map(s => ({ s, g: geom(s) })), wet = state.wet;
    // A continuous curved crown replaces the old triangular caps. Live follicles
    // and their root colours define every patch; shaving separates the surface.
    if(list.length && list[0].layer==='front') {
      let group=[];
      const flush=()=>{
        if(group.length<2){group=[];return;}
        const first=group[0].g,last=group[group.length-1].g;
        ctx.beginPath();smoothTo(ctx,first.L.slice(0,9),true);
        smoothTo(ctx,group.map(({g})=>[g.D[8].x,g.D[8].y]),false);
        smoothTo(ctx,last.R.slice(0,9).reverse(),false);
        smoothTo(ctx,group.slice().reverse().map(({g})=>[g.D[0].x,g.D[0].y]),false);ctx.closePath();
        const col=C2(group[0].s.col[0]),gr=ctx.createLinearGradient(0,95,0,190);
        gr.addColorStop(0,col.r);gr.addColorStop(.38,U.mix(col.f,'#fff0cb',.44));gr.addColorStop(1,col.f);
        ctx.fillStyle=gr;ctx.fill();group=[];
      };
      for(const item of G){if(item.s.cap&&item.g){if(group.length&&group[0].s.col[0]!==item.s.col[0])flush();group.push(item);}else flush();}flush();
    }
    // Bridge neighbouring fringe fibers with the same lit surface, following their
    // live tips. Removed follicles split the patch so shaved gaps remain visible.
    if(list.length && list[0].layer==='front') {
      let group=[];
      const flush=()=>{
        if(group.length<2){group=[];return;}
        const first=group[0].g,last=group[group.length-1].g;
        ctx.beginPath();smoothTo(ctx,first.L,true);
        smoothTo(ctx,group.map(({g})=>[g.D[g.D.length-1].x,g.D[g.D.length-1].y]),false);
        smoothTo(ctx,last.R.slice().reverse(),false);
        smoothTo(ctx,group.slice().reverse().map(({g})=>[g.D[0].x,g.D[0].y]),false);ctx.closePath();
        const color=C2(group[0].s.col[0]),light=ctx.createLinearGradient(0,95,0,182);
        light.addColorStop(0,color.r);light.addColorStop(.4,U.mix(color.f,'#fff0cb',.46));light.addColorStop(1,color.f);
        ctx.fillStyle=light;ctx.fill();group=[];
      };
      for(const item of G){if(item.s.zone==='bang'&&item.g){if(group.length&&group[0].s.col[0]!==item.s.col[0])flush();group.push(item);}else flush();}flush();
    }
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    // 1) soft silhouette: drawn under everything, so only the outer edge and gaps show it
    for (const { s, g } of G) {
      if (!g || s.cap) continue;
      const cc = s.cv.reduce((a, v) => a + v, 0) / Math.max(1, s.cv.length); for (const [a, b] of g.runs) { const a2 = s.cap ? Math.max(a, 8) : a; if (b - a2 < 1) continue; ctx.strokeStyle = C2(s.col[g.D[a].ci]).o; ctx.lineWidth = .65 - .3 * Math.min(1, cc * 1.5); runPath(ctx, g, a2, b); ctx.stroke(); }
    }
    // 2) every lock: body gradient (root→tip, incl. sheen band), rounded light streak, curl rings
    const wetK = 1 + .5 * wet;
    const sheenW = (p, back) => { const dxh = (p.x - 200) / 100; if (Math.abs(p.x - 200) > 124) return 0; const yb = 128 + dxh * dxh * 46 + (back ? 0 : 6); return (Math.exp(-(((p.y - yb) / 24) ** 2)) + .45 * Math.exp(-(((p.y - (yb + 190)) / 46) ** 2))) * wetK; };
    const lerp3 = (A, B, t) => [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t];
    const locks = [], ringL = new Path2D(), ringD = new Path2D();
    for (const { s, g } of G) {
      if (!g) continue;
      const D = g.D, n = D.length, back = s.layer === 'back';
      for (let [a, b] of g.runs) {
        if(s.cap) { a=Math.max(a,8); if(b<=a) continue; }
        const c = C2(s.col[D[a].ci], s.shade), cs = U.rgb(a === 0 ? c.r : c.f), cf = U.rgb(c.f), ct = U.rgb(c.t);
        const hl = U.rgb(U.luma(c.f) > .62 ? U.mix(c.f, '#fffaf0', .55) : U.mix(c.f, '#fff4ea', .5));
        runPath(ctx, g, a, b);
        const p0 = D[a], p1 = D[Math.min(n - 1, b)], vx = p1.x - p0.x + .01, vy = p1.y - p0.y + .01, vl = vx * vx + vy * vy;
        const gr = ctx.createLinearGradient(p0.x, p0.y, p0.x + vx, p0.y + vy);
        const N = Math.min(6, Math.max(2, b - a)); let last = -1;
        for (let k = 0; k <= N; k++) {
          const idx = Math.round(a + (b - a) * k / N), q = D[Math.min(n - 1, idx)];
          let t = ((q.x - p0.x) * vx + (q.y - p0.y) * vy) / vl; t = Math.max(0, Math.min(1, t)); if (k === 0) t = 0; if (k === N) t = 1;
          if (t <= last && k !== N) continue; if (t <= last) t = Math.min(1, last + .0001);
          const u = (idx - a) / Math.max(1, b - a);
          let col = u < .35 ? lerp3(cs, cf, u / .35) : lerp3(cf, ct, (u - .35) / .65);
          const w = Math.min(.78, sheenW(q, back) * .72); if (w > .01) col = lerp3(col, hl, w);
          gr.addColorStop(t, `rgb(${col[0] | 0},${col[1] | 0},${col[2] | 0})`); last = t;
        }
        ctx.fillStyle = gr; ctx.fill();
        // Rounded cross-section, matching the dimensional ImageGen hair reference.
        const mid = Math.round((a+b)/2), l = g.L[mid], r = g.R[mid];
        const cross = ctx.createLinearGradient(l[0],l[1],r[0]+.001,r[1]+.001);
        cross.addColorStop(0,'rgba(35,12,15,.025)');
        cross.addColorStop(.26,'rgba(255,246,218,.03)');
        cross.addColorStop(.42,'rgba(255,246,218,.13)');
        cross.addColorStop(.65,'rgba(255,246,218,.02)');
        cross.addColorStop(1,'rgba(35,12,15,.04)');
        ctx.fillStyle = cross; ctx.fill();
      }
      if (n > 3) {
        // rounded light streak along the lock (gives each lock volume)
        const c0 = C2(s.col[D[Math.floor(n / 2)].ci], s.shade); locks.push({ g, k: c0.f, c: c0 });
        ctx.strokeStyle = U.luma(c0.f) > .62 ? U.shade(c0.f, 10) : U.mix(c0.f, '#fff6ee', .22); ctx.globalAlpha = .34 - .12 * wet; ctx.lineWidth = Math.max(1.6, s.w * .3);
        ctx.beginPath(); const st = s.cap ? 8 : 2;
        for (let i = st; i < n - 1; i++) { const x = D[i].x + (g.L[i][0] - D[i].x) * .32, y = D[i].y + (g.L[i][1] - D[i].y) * .32; if (i === st) ctx.moveTo(x, y); else ctx.lineTo(x, y); }
        ctx.stroke(); ctx.globalAlpha = 1;
        // ringlets: a bright arc where each curl turn faces us, a dark one where it turns away
        for (let i = 1; i < n; i++) {
          const c = D[i].c; if (c < .15) continue;
          const t0 = D[i - 1].th, t1 = D[i].th, f0 = Math.floor((t0 - 1.57) / 6.283), f1 = Math.floor((t1 - 1.57) / 6.283), k0 = Math.floor((t0 - 4.71) / 6.283), k1 = Math.floor((t1 - 4.71) / 6.283);
          if (f0 === f1 && k0 === k1) continue;
          const tx = D[i].x - D[i - 1].x, ty = D[i].y - D[i - 1].y, tl = Math.hypot(tx, ty) || 1, bw = g.W[i] * .7;
          const P2 = f0 !== f1 ? ringL : ringD, l = g.L[i], r = g.R[i];
          P2.moveTo(l[0] * .85 + D[i].x * .15, l[1] * .85 + D[i].y * .15); P2.quadraticCurveTo(D[i].x + tx / tl * bw, D[i].y + ty / tl * bw, r[0] * .85 + D[i].x * .15, r[1] * .85 + D[i].y * .15);
        }
      }
    }
    // 3) batched details for all locks: curl rings, lock separation, a few fine hairs
    ctx.lineWidth = 3.4; ctx.strokeStyle = `rgba(255,248,238,${(.15 - .05 * wet).toFixed(2)})`; ctx.stroke(ringL); ctx.lineWidth = 1; ctx.strokeStyle = `rgba(255,250,244,${(.2 - .07 * wet).toFixed(2)})`; ctx.stroke(ringL);
    ctx.lineWidth = 2.4; ctx.strokeStyle = 'rgba(28,6,16,.12)'; ctx.stroke(ringD);
    const fl = (g, k) => { const pts = g.D.slice(4).map((p,j) => [p.x+(g.L[j+4][0]-p.x)*k,p.y+(g.L[j+4][1]-p.y)*k]); if(pts.length>1) smoothTo(ctx,pts,true); };
    const groups = new Map(); for (const L of locks) { if (!groups.has(L.k)) groups.set(L.k, { c: L.c, list: [] }); groups.get(L.k).list.push(L.g); }
    for (const { c, list } of groups.values()) {
      const light = U.luma(c.f) > .55, dk = U.shade(c.f, light ? -26 : -34);
      ctx.lineWidth = 1; ctx.strokeStyle = dk; ctx.globalAlpha = .14; ctx.beginPath(); for (const g of list) smoothTo(ctx, g.R.slice(5), true); ctx.stroke();
      ctx.lineWidth = .35; ctx.globalAlpha = .18; ctx.beginPath(); for (const g of list) { fl(g, -.72); fl(g, -.2); fl(g, .38); } ctx.stroke();
      ctx.lineWidth = 1.1; ctx.globalAlpha = .14; ctx.beginPath(); for (const g of list) { fl(g, -.5); fl(g, .55); } ctx.stroke();
      ctx.strokeStyle = U.mix(c.f, '#fffaf2', light ? .55 : .42); ctx.lineWidth = .35; ctx.globalAlpha = .32; ctx.beginPath(); for (const g of list) { fl(g, -.46); fl(g, .1); fl(g, .66); } ctx.stroke();
      ctx.globalAlpha = 1;
    }
    // fly-aways after blow-drying
    for (const { s, g } of G) {
      const fz = s.frizz * (1 - wet); if (!g || fz < .05) continue;
      const D = g.D, n = D.length;
      ctx.strokeStyle = C2(s.col[0]).o; ctx.lineWidth = .8; ctx.globalAlpha = .7; ctx.beginPath();
      for (let i = 2; i < n; i += 3) {
        const rnd = Math.abs(Math.sin(i * 12.9898 + s.phase * 78.233) * 43758.5453) % 1, side = rnd > .5 ? 1 : -1;
        const nx = (g.L[i][0] - D[i].x) / (g.W[i] || 1), ny = (g.L[i][1] - D[i].y) / (g.W[i] || 1);
        const bx = D[i].x + nx * g.W[i] * side, by = D[i].y + ny * g.W[i] * side, len = (4 + rnd * 9) * fz;
        ctx.moveTo(bx, by); ctx.quadraticCurveTo(bx + nx * side * len * .6 - ny * len * .5, by + ny * side * len * .6 + nx * len * .5, bx + nx * side * len, by + ny * side * len + len * .3);
      }
      ctx.stroke(); ctx.globalAlpha = 1;
    }
  }

  const offs = {};
  function layerCanvas(key, ctx) {
    let o = offs[key]; if (!o) { o = document.createElement('canvas'); offs[key] = o; }
    if (o.width !== ctx.canvas.width || o.height !== ctx.canvas.height) { o.width = ctx.canvas.width; o.height = ctx.canvas.height; }
    const c = o.getContext('2d'); c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'source-over'; c.clearRect(0, 0, o.width, o.height); c.setTransform(ctx.getTransform());
    return { o, c };
  }
  // buzz cut: shaved strands leave short stubble on the scalp (drawn opaque, blended at once = even tone)
  function drawStubble(c, list, dim) {
    const sh = list.filter(s => s.pts.length <= 1 && s.cap); if (!sh.length) return;
    let so = offs['st']; if (!so) { so = document.createElement('canvas'); offs['st'] = so; }
    if (so.width !== c.canvas.width || so.height !== c.canvas.height) { so.width = c.canvas.width; so.height = c.canvas.height; }
    const x = so.getContext('2d'); x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, so.width, so.height); x.setTransform(c.getTransform());
    x.lineCap = 'round'; x.lineJoin = 'round';
    for (const s of sh) {
      const k = wc(s.col[0]), col = dim ? U.shade(k.r, dim) : k.r;
      x.strokeStyle = col; x.lineWidth = s.w * 1.7; x.beginPath();
      if (s.cap) { x.moveTo(s.cap.x, s.cap.y); x.lineTo(s.rx, s.ry); }
      else { const ox = (s.rx - C.x) / ERX, oy = (s.ry - C.y) / ERY, l = Math.hypot(ox, oy) || 1; x.moveTo(s.rx - ox / l * 5, s.ry - oy / l * 5); x.lineTo(s.rx + ox / l * 2.5, s.ry + oy / l * 2.5); }
      x.stroke();
    }
    // stubble grain
    x.fillStyle = 'rgba(20,6,12,.55)';
    for (const s of sh) { const ax = s.cap ? s.cap.x : s.rx, ay = s.cap ? s.cap.y : s.ry; for (let t = 0; t <= 1.001; t += .2) { const px = ax + (s.rx - ax) * t + Math.sin(t * 37 + s.phase * 9) * 2.4, py = ay + (s.ry - ay) * t + Math.cos(t * 23 + s.phase * 7) * 2.4; x.beginPath(); x.arc(px, py, .6, 0, 6.3); x.fill(); } }
    c.save(); if (!drawStubble.clip) {
      drawStubble.clip = new Path2D(ART.FACE);
      // natural hairline: stops above the eyebrows, sideburns down by the ears
      const hl = new Path2D(), yh = x => 144 + ((x - 200) / 100) ** 2 * 44; hl.moveTo(40, 0); hl.lineTo(360, 0); hl.lineTo(360, 250); hl.lineTo(296, 250); hl.lineTo(296, yh(296));
      for (let x = 290; x >= 110; x -= 6) hl.lineTo(x, yh(x)); hl.lineTo(104, yh(104)); hl.lineTo(104, 250); hl.lineTo(40, 250); hl.closePath(); drawStubble.line = hl;
    }
    c.clip(drawStubble.clip); c.clip(drawStubble.line); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = .45; c.drawImage(so, 0, 0); c.restore();
  }
  function renderMass(ctx, key, list, dim) {
    const { o, c } = layerCanvas(key, ctx);
    drawStubble(c, list, dim);
    drawSet(c, list, dim);
    // ImageGen micro-strands are masked by the LIVE hair silhouette: cuts, growth,
    // curls, colour painting and wetness continue to be rendered by the simulation.
    if (ART.atelierHairMaterial) {
      const {o:material, c:mc} = layerCanvas(key+'material',ctx);
      mc.drawImage(ART.atelierHairMaterial,627,0,627,627,65,65,270,555);
      mc.setTransform(1,0,0,1,0,0); mc.globalCompositeOperation='destination-in'; mc.drawImage(o,0,0);
      c.save(); c.setTransform(1,0,0,1,0,0); c.globalCompositeOperation='soft-light'; c.globalAlpha=.42;
      c.drawImage(material,0,0); c.restore();
    }

    // Broad soft light gives the simulated hair the volume of the painted reference.
    const {o:light, c:lc}=layerCanvas(key+'light',ctx);
    const shine=lc.createLinearGradient(80,0,320,0);
    for(const [t,col] of [[0,'rgba(40,15,12,.17)'],[.1,'rgba(255,242,205,0)'],[.22,'rgba(255,240,195,.29)'],[.34,'rgba(255,242,205,0)'],[.5,'rgba(44,20,18,.04)'],[.66,'rgba(255,242,205,0)'],[.78,'rgba(255,240,195,.29)'],[.9,'rgba(255,242,205,0)'],[1,'rgba(40,15,12,.17)']])shine.addColorStop(t,col);
    lc.fillStyle=shine;lc.fillRect(40,60,320,700);
    lc.setTransform(1,0,0,1,0,0);lc.globalCompositeOperation='destination-in';lc.drawImage(o,0,0);
    c.save();c.setTransform(1,0,0,1,0,0);c.drawImage(light,0,0);c.restore();

    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (key === 'f') {
      let so = offs.fs; if (!so) { so = document.createElement('canvas'); offs.fs = so; }
      if (so.width !== o.width || so.height !== o.height) { so.width = o.width; so.height = o.height; }
      const sc = so.getContext('2d'); sc.setTransform(1, 0, 0, 1, 0, 0); sc.globalCompositeOperation = 'source-over'; sc.clearRect(0, 0, so.width, so.height);
      sc.drawImage(o, 0, 0); sc.globalCompositeOperation = 'source-in'; sc.fillStyle = '#4a1c2c'; sc.fillRect(0, 0, so.width, so.height);
      const k = Math.abs(c.getTransform().a);
      ctx.globalAlpha = .16; ctx.drawImage(so, 0, 3.5 * k); ctx.globalAlpha = .08; ctx.drawImage(so, 0, 7 * k); ctx.globalAlpha = 1;
    }
    ctx.drawImage(o, 0, 0); ctx.restore();
  }
  function drawBack(ctx) { if (Object.keys(colCache).length > 400) colCache = {}; renderMass(ctx, 'b', S.filter(s => s.layer === 'back'), -9); }
  function drawFront(ctx) {
    renderMass(ctx, 'f', S.filter(s => s.layer === 'front'), 0);
    for (const f of foam) {
      const q = foamPos(f);
      ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#cfe3f5'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(q.x, q.y, f.r, 0, 6.3); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#e6f5ff'; ctx.beginPath(); ctx.arc(q.x - f.r * .35, q.y - f.r * .35, f.r * .28, 0, 6.3); ctx.fill();
    }
    for (const d of debris) {
      ctx.globalAlpha = Math.min(1, d.life / 25);
      drawSet(ctx, [{ pts: d.pts, col: d.col, cv: d.cv, w: d.w, cap: null, rx: d.pts[0].x, ry: d.pts[0].y, frizz: 0, blunt: true, phase: d.phase, shade: 0 }], 0);
      ctx.globalAlpha = 1;
    }
  }

  function sig() { let v = 0; for (const s of S) { for (const p of s.pts) v += Math.round(p.x * 3) * 1.31 + Math.round(p.y * 3) * .77; v += s.pts.length * 3.7; } return v + foam.length * 1000 + state.wet * 13; }
  const busy = () => debris.length > 0;
  return { sig, busy, SEG, state, build, settleComb, step, drawBack, drawFront, cut, shave, grow, comb, blow, curlAt, paint, recolorAll, addFoam, water, sprayAt, overHair, foamCount: () => foam.length, strands: () => S };
})();
