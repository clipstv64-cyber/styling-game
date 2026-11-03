'use strict';
const U = {
  clamp: (v, a, b) => Math.max(a, Math.min(b, v)),
  rgb(h) {
    h = String(h).replace('#', '');
    if (h.length === 3) h = h.split('').map(c => c + c).join('');
    const n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  },
  hex(r, g, b) {
    return '#' + [r, g, b].map(v => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('');
  },
  // p < 0 → toward black, p > 0 → toward white (percent)
  shade(h, p) {
    const [r, g, b] = U.rgb(h);
    const t = p < 0 ? 0 : 255, k = Math.abs(p) / 100;
    return U.hex(r + (t - r) * k, g + (t - g) * k, b + (t - b) * k);
  },
  mix(a, b, t) {
    const A = U.rgb(a), B = U.rgb(b);
    return U.hex(A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t);
  },
  luma(h) { const [r, g, b] = U.rgb(h); return (0.299 * r + 0.587 * g + 0.114 * b) / 255; },
  rand: (a, b) => a + Math.random() * (b - a),
  pick: a => a[Math.floor(Math.random() * a.length)],
  ease: t => (t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
  clone: o => JSON.parse(JSON.stringify(o)),
};
