'use strict';
/* ImageGen art direction. Rendering only: all coordinates, tool IDs and game state stay intact. */
(() => {
  const A = ART, sh = U.shade;
  const defs = document.querySelector('#char defs');
  defs.insertAdjacentHTML('beforeend', `
    <radialGradient id="atFaceLight" cx=".43" cy=".35" r=".7"><stop stop-color="#fff5df" stop-opacity=".22"/><stop offset=".48" stop-color="#fff1e5" stop-opacity=".05"/><stop offset=".84" stop-color="#3c1522" stop-opacity=".12"/><stop offset="1" stop-color="#2c101a" stop-opacity=".3"/></radialGradient>
    <radialGradient id="atCheek"><stop stop-color="#f47b83" stop-opacity=".4"/><stop offset="1" stop-color="#ed7391" stop-opacity="0"/></radialGradient>
    <radialGradient id="atGlow"><stop stop-color="#fff6db" stop-opacity=".42"/><stop offset="1" stop-color="#fff6db" stop-opacity="0"/></radialGradient>
    <linearGradient id="atArm" x1="0" x2="1"><stop stop-color="#31121d" stop-opacity=".23"/><stop offset=".25" stop-color="#fff0df" stop-opacity=".1"/><stop offset=".46" stop-color="#fff4e6" stop-opacity=".22"/><stop offset=".75" stop-color="#57202a" stop-opacity="0"/><stop offset="1" stop-color="#461720" stop-opacity=".24"/></linearGradient>
    <clipPath id="atFaceClip"><path d="${A.FACE}"/></clipPath>
    <pattern id="atFaceMaterial" width="184" height="220" x="108" y="100" patternUnits="userSpaceOnUse"><svg width="184" height="220" viewBox="0 0 627 627" preserveAspectRatio="none"><image href="img/atelier-materials.webp" width="1254" height="1254"/></svg></pattern>
    <filter id="atTextile" x="0" y="0" width="1" height="1" primitiveUnits="objectBoundingBox" color-interpolation-filters="sRGB"><feImage href="img/atelier-materials.webp" width="2" height="2" y="-1" preserveAspectRatio="none" result="material"/><feComponentTransfer in="material" result="softMaterial"><feFuncR type="linear" slope=".24" intercept=".81"/><feFuncG type="linear" slope=".24" intercept=".81"/><feFuncB type="linear" slope=".24" intercept=".81"/></feComponentTransfer><feBlend in="SourceGraphic" in2="softMaterial" mode="multiply" result="fabric"/><feComposite in="fabric" in2="SourceGraphic" operator="in"/></filter>
  `);

  const baseHead = A.headBase;
  A.headBase = L => baseHead(L)
    + `<path d="${A.FACE}" fill="url(#atFaceLight)"/>`
    + `<path d="${A.FACE}" fill="url(#atFaceMaterial)" opacity=".22" style="mix-blend-mode:multiply"/>`
    + `<ellipse cx="145" cy="258" rx="33" ry="24" fill="url(#atCheek)"/><ellipse cx="255" cy="258" rx="33" ry="24" fill="url(#atCheek)"/>`
    + `<ellipse cx="178" cy="153" rx="44" ry="36" fill="url(#atGlow)" opacity=".45"/><ellipse cx="137" cy="243" rx="19" ry="9" fill="url(#atGlow)" opacity=".32"/><ellipse cx="263" cy="243" rx="19" ry="9" fill="url(#atGlow)" opacity=".32"/><ellipse cx="200" cy="309" rx="23" ry="8" fill="url(#atGlow)" opacity=".35"/>`;

  const baseBody = A.body;
  A.body = skin => {
    const b = baseBody(skin), dark = sh(skin,-20);
    // Follow CK's sleeve centreline exactly; taper the wrist instead of using tube strokes.
    const arm = 'M144,374 C136,376 132,387 131,402 C125,428 121,454 120,479 C119,510 116,550 116,587 Q122,597 133,590 C137,554 139,514 140,482 C142,456 147,434 155,410 C161,393 159,379 151,375 Z';
    const hand = 'M116,585 C113,596 112,607 114,617 Q115,623 117,620 L118,608 L118,624 Q120,629 122,624 L123,609 L123,625 Q125,630 127,625 L128,609 L128,621 Q130,625 132,620 L134,602 C140,607 142,605 140,601 L133,589 Z';
    const paint = d => `<path d="${d}" fill="${skin}"/><path d="${d}" fill="url(#atArm)"/>`;
    const leg = 'M150,592 L200,592 L198,660 Q196,740 192,780 Q190,860 189,912 L171,912 Q170,860 166,780 Q160,740 156,660 Q152,620 150,592 Z';
    const foot = 'M169,904 L191,904 C194,918 196,930 191,940 C185,947 173,947 168,939 C164,929 166,916 169,904 Z';
    b.legs = A.mirror(paint(leg)+paint(foot)+`<ellipse cx="179" cy="774" rx="9" ry="15" fill="url(#atGlow)" opacity=".3"/><path d="M172,935 Q180,940 188,935" fill="none" stroke="${dark}" stroke-width=".7" opacity=".2"/>`);
    b.arms = A.mirror(paint(arm) + `<path d="M125,480 Q130,484 136,480" fill="none" stroke="${dark}" stroke-width=".8" opacity=".2"/>`);
    b.hands = A.mirror(paint(hand) + `<path d="M119,591 Q124,594 131,591" fill="none" stroke="${dark}" stroke-width=".6" opacity=".2"/>`);
    return b;
  };

  const icons = ['scissors','razor','grow','comb','dryer','curler','straightener','dye','shampoo','spray','mask','sponge2','foundation','blender','lens','eyeshadow','liner','mascara','blushbrush','lipstick','hilite','freckles','sticker','shower','brush'];
  const oldIcon = A.icon;
  A.icon = key => {
    const n = icons.indexOf(key); if(n<0) return oldIcon(key);
    return `<svg class="atelier-icon" viewBox="${n%5*100} ${Math.floor(n/5)*100} 100 100" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><image href="img/atelier-tools.webp" width="500" height="500"/></svg>`;
  };
  A.showerHang = () => `<svg viewBox="0 0 84 168" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="atHose"><stop stop-color="#9d8395"/><stop offset=".5" stop-color="#fff4f7"/><stop offset="1" stop-color="#a78b9d"/></linearGradient></defs><path d="M62,-12 L62,52 Q62,65 52,72" stroke="url(#atHose)" stroke-width="9" fill="none"/><defs><clipPath id="atShowerCrop"><rect x="10" y="60" width="70" height="70"/></clipPath></defs><g clip-path="url(#atShowerCrop)"><image href="img/atelier-tools.webp" x="-200" y="-220" width="350" height="350"/></g></svg>`;

  const room = n => `<svg class="atelier-room" viewBox="${n*512} 0 512 1024" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><image href="img/atelier-rooms.webp" width="1536" height="1024"/></svg>`;
  A.BG.salon = () => room(0); A.BG.makeup = () => room(1); A.BG.dress = () => room(2);

  // Add generated satin grain to existing vector garments, retaining every cut and colour.
  for (const item of DATA.ITEMS) {
    if (!['dress','top','bottom','outer'].includes(item.slot)) continue;
    const original = item.art;
    item.art = function(color) {
      const r = original.call(this,color), wrap = s => s ? `<g filter="url(#atTextile)">${s}</g>` : '';
      return {...r, body:wrap(r.body), sleeves:wrap(r.sleeves)};
    };
  }

  // Reusable generated hair material; the live strand renderer clips it to each lock.
  const hair = new Image();
  hair.onload = () => { A.atelierHairMaterial = hair; if (window.GAME) GAME.redraw(); };
  hair.src = 'img/atelier-materials.webp';
})();
