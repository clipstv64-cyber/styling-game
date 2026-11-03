'use strict';
/* ImageGen body rig. Keep the garment contours and ART.BODY_TF shared with the wardrobe. */
(() => {
  const A = ART, atlas = 'img/atelier-body.webp';
  // These silhouettes are also the fit boundaries of the existing sleeve and trouser cuts.
  const shape = {
    torso: 'M181,308 L219,308 C218,326 217,342 221,353 C230,361 248,365 256,378 C262,392 252,420 246,450 C240,480 234,500 234,522 C240,545 252,570 252,598 L148,598 C148,570 160,545 166,522 C166,500 160,480 154,450 C148,420 138,392 144,378 C152,365 170,361 179,353 C183,342 182,326 181,308 Z',
    arm: 'M146,376 C138,383 133,392 131,405 C125,428 121,454 120,479 C119,510 116,550 116,587 Q122,597 133,590 C137,554 139,514 140,482 C142,456 147,434 155,410 C159,394 157,383 151,378 Z',
    leg: 'M150,592 L200,592 L198,660 Q196,740 192,780 Q190,860 189,912 L171,912 Q170,860 166,780 Q160,740 156,660 Q152,620 150,592 Z',
    wrist: 'M116,581 L134,584 L133,602 Q123,607 115,600 Z'
  };
  const image = (x,y,w,h,box) => `<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="${box}" preserveAspectRatio="none" style="width:${w}px;height:${h}px;overflow:hidden"><image href="${atlas}" width="1536" height="1024"/></svg>`;
  const defs = `
    ${Object.entries(shape).map(([name,d])=>`<clipPath id="bodyClip-${name}" clipPathUnits="userSpaceOnUse"><path d="${d}"/></clipPath>`).join('')}
    <linearGradient id="bodyVolume" x1="0" x2="1"><stop stop-color="#351622" stop-opacity=".13"/><stop offset=".28" stop-color="#ffeddd" stop-opacity=".06"/><stop offset=".46" stop-color="#fff3e7" stop-opacity=".15"/><stop offset=".72" stop-color="#441d26" stop-opacity="0"/><stop offset="1" stop-color="#351622" stop-opacity=".16"/></linearGradient>
    <radialGradient id="bodyJaw" cx=".5" cy="0" r=".6"><stop stop-color="#33121d" stop-opacity=".27"/><stop offset="1" stop-color="#33121d" stop-opacity="0"/></radialGradient>
    <linearGradient id="bodyNeckFade" gradientUnits="userSpaceOnUse" x1="0" y1="370" x2="0" y2="398"><stop stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient>
    <mask id="bodyNeckMask" maskUnits="userSpaceOnUse" x="130" y="300" width="140" height="115"><rect x="130" y="300" width="140" height="115" fill="url(#bodyNeckFade)"/></mask>
    <linearGradient id="bodyTorsoFade" gradientUnits="userSpaceOnUse" x1="0" y1="375" x2="0" y2="418"><stop stop-color="#000"/><stop offset="1" stop-color="#fff"/></linearGradient>
    <mask id="bodyTorsoMask" maskUnits="userSpaceOnUse" x="138" y="350" width="124" height="250"><rect x="138" y="350" width="124" height="250" fill="url(#bodyTorsoFade)"/></mask>
    <linearGradient id="bodyArmFade" gradientUnits="userSpaceOnUse" x1="0" y1="370" x2="0" y2="410"><stop stop-color="#000"/><stop offset="1" stop-color="#fff"/></linearGradient>
    <mask id="bodyArmMask" maskUnits="userSpaceOnUse" x="110" y="370" width="54" height="230"><rect x="110" y="370" width="54" height="230" fill="url(#bodyArmFade)"/></mask>
    <linearGradient id="bodyHandFade" gradientUnits="userSpaceOnUse" x1="0" y1="582" x2="0" y2="594"><stop stop-color="#000"/><stop offset="1" stop-color="#fff"/></linearGradient>
    <mask id="bodyHandMask" maskUnits="userSpaceOnUse" x="109" y="580" width="32" height="56"><rect x="109" y="580" width="32" height="56" fill="url(#bodyHandFade)"/></mask>
    <linearGradient id="bodyAnkleFade" gradientUnits="userSpaceOnUse" x1="0" y1="900" x2="0" y2="910"><stop stop-color="#000"/><stop offset="1" stop-color="#fff"/></linearGradient>
    <mask id="bodyFootMask" maskUnits="userSpaceOnUse" x="162" y="898" width="38" height="52"><rect x="162" y="898" width="38" height="52" fill="url(#bodyAnkleFade)"/></mask>`;

  A.body = (skin, outfit = {}) => {
    // Same grayscale tinting as the face, calibrated to this atlas's mid-gray clay.
    const id = 'bodySkin'+skin.replace(/[^a-z0-9]/gi,''), rgb = U.rgb(skin);
    const filter = `<filter id="${id}" color-interpolation-filters="sRGB" x="-.1" y="-.1" width="1.2" height="1.2"><feColorMatrix type="saturate" values="0"/><feComponentTransfer>${rgb.map((v,i)=>`<feFunc${'RGB'[i]} type="linear" slope="${v/255/.65}" intercept="0"/>`).join('')}</feComponentTransfer></filter>`;
    const tint = s => `<g filter="url(#${id})">${s}</g>`;
    const base = name => `<path d="${shape[name]}" fill="${skin}"/><path d="${shape[name]}" fill="url(#bodyVolume)"/>`;
    const clip = (name,s) => `<g clip-path="url(#bodyClip-${name})">${s}</g>`;
    const shoe = outfit.shoes && outfit.shoes.id;
    const open = !shoe || shoe === 'shoe_sandals' || shoe === 'shoe_gladiator';
    // Closed shoes cover the toes; leave the instep visible above low-cut shoes.
    const footClip = open ? '' : shoe === 'shoe_crystal'
      ? '<path d="M166,900 L194,900 L194,906 C196,922 192,940 182,958 L178,958 C168,940 164,922 166,906 Z"/>'
      : '<rect x="162" y="898" width="38" height="26"/>';
    const footId = 'bodyShoe-'+(shoe || 'bare');
    const torso = `<defs>${defs}${filter}${footClip?`<clipPath id="${footId}" clipPathUnits="userSpaceOnUse">${footClip}</clipPath>`:''}</defs>`+base('torso')+clip('torso',
      `<g mask="url(#bodyNeckMask)" opacity=".88">${tint(image(134,308,132,94,'17 122 479 243'))}</g>`
      +`<g mask="url(#bodyTorsoMask)" opacity=".76">${tint(image(143,352,114,246,'1160 529 249 477'))}</g>`
      +`<ellipse cx="200" cy="331" rx="23" ry="15" fill="url(#bodyJaw)"/>`);
    // Affine placement follows the sloping arm instead of stretching an upright texture over it.
    const armMap = `<image href="${atlas}" width="1536" height="1024" transform="matrix(.4 0 .09 .45 -187.4 367)"/>`;
    // Share the neck's shoulder lighting across the arm joint, then blend into arm anatomy.
    const arms = A.mirror(`<path d="${shape.arm}" fill="${skin}"/>`+clip('arm',
      `<g mask="url(#bodyNeckMask)" opacity=".88">${tint(image(134,308,132,94,'17 122 479 243'))}</g>`
      +`<g mask="url(#bodyArmMask)"><path d="${shape.arm}" fill="url(#bodyVolume)"/><g opacity=".78">${tint(armMap)}</g></g>`));
    const hand = base('wrist')+`<g mask="url(#bodyHandMask)">${tint(image(111,581,26.5,50,'1180 24 220 462'))}</g>`;
    const legMap = `<image href="${atlas}" width="1536" height="1024" transform="matrix(.49 0 .018 .674 40.5 235.45)"/>`;
    const leg = base('leg')+clip('leg',`<g opacity=".8">${tint(legMap)}</g>`);
    // Mirror the source foot so the big toe faces inward on the left leg.
    const foot = `<g mask="url(#bodyFootMask)"${footClip?` clip-path="url(#${footId})"`:''}>${tint(`<g transform="translate(362 0) scale(-1 1)">${image(165,900,32,47,'665 538 199 468')}</g>`)}</g>`;
    return {torso, arms, hands:A.mirror(hand), legs:A.mirror(leg+foot)};
  };
})();
