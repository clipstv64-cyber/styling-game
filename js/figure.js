'use strict';
/* Layered ImageGen face rig; painting and styling use the existing character coordinates. */
(() => {
  const A=ART, sh=U.shade;
  // Keep the smaller eyes and mascara brush on exactly the same coordinates.
  A.EYE_TF='translate(150 216) scale(1.04) translate(-161 -217)';
  A.eyeT=(x,y)=>[150+(x-161)*1.04,216+(y-217)*1.04];
  A.BODY_TF='translate(200 312) scale(1.22 1.025) translate(-200 -320)';
  const atlas='img/atelier-face.webp';
  const sprite=(x,y,w,h,box,extra='')=>`<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="${box}" preserveAspectRatio="none" overflow="hidden" style="width:${w}px;height:${h}px;overflow:hidden" ${extra}><image href="${atlas}" width="1254" height="1254"/></svg>`;
  const grey='<feColorMatrix type="saturate" values="0"/>';
  const key=c=>c.replace(/[^a-z0-9]/gi,'');
  const skinFilter=c=>{
    const id='figSkin'+key(c),rgb=U.rgb(c).map(v=>v/255);
    return {id,defs:`<filter id="${id}" color-interpolation-filters="sRGB" x="-.1" y="-.1" width="1.2" height="1.2">${grey}<feComponentTransfer>${rgb.map((v,i)=>`<feFunc${'RGB'[i]} type="linear" slope="${v/.73}" intercept="0"/>`).join('')}</feComponentTransfer></filter>`};
  };
  const tintFilter=(prefix,c)=>{
    const id=prefix+key(c),rgb=U.rgb(c).map(v=>v/255);
    return {id,defs:`<filter id="${id}" color-interpolation-filters="sRGB" x="-.05" y="-.05" width="1.1" height="1.1">${grey}<feComponentTransfer>${rgb.map((v,i)=>`<feFunc${'RGB'[i]} type="table" tableValues="0 ${v*.4} ${v} ${v+(1-v)*.4} 1"/>`).join('')}</feComponentTransfer></filter>`};
  };
  document.querySelector('#char defs').insertAdjacentHTML('beforeend',`<clipPath id="figIrisClip"><circle cx="161" cy="217" r="16.8"/></clipPath>`);

  A.headBase=L=>{
    const f=skinFilter(L.skin);
    return `<defs>${f.defs}</defs><g filter="url(#${f.id})">${sprite(93,92,214,231,'50 25 530 600')}</g>`
      +`<ellipse cx="143" cy="258" rx="29" ry="21" fill="url(#atCheek)" opacity=".5"/><ellipse cx="257" cy="258" rx="29" ry="21" fill="url(#atCheek)" opacity=".5"/>`;
  };
  A.eye=(mk={},skin='#c4804f',eye='#a8742e')=>{
    const f=tintFilter('figEye',eye);
    const art=sprite(115.7,190.5,85,52,'690 185 545 335');
    return `<defs>${f.defs}</defs>${art}<g clip-path="url(#figIrisClip)" filter="url(#${f.id})">${art}</g>`;
  };
  const oldMouth=A.mouth;
  A.mouth=L=>{
    if(L.mood==='sad'||L.mood==='meh') return oldMouth(L);
    const art=sprite(175,276,50,28,'55 847 525 255');
    return L.happy?`<g transform="translate(200 289) scale(1.04 1.02) translate(-200 -289)">${art}</g>`:art;
  };
  A.headFeat=L=>{
    const browColor=U.luma(L.hairColor)>.65?sh(L.hairColor,-42):sh(L.hairColor,-17);
    const f=tintFilter('figBrow',browColor);
    const brow=`<g filter="url(#${f.id})">${sprite(122,175.5,61,11,'685 850 520 135')}</g>`;
    return `<defs>${f.defs}</defs>`+A.mirror(`<g transform="${A.BROW_TF}">${brow}</g>`)
      +`<g id="eyes">${A.mirror(`<g transform="${A.EYE_TF}">${A.eye({},L.skin,L.eye)}</g>`)}</g>`
      +`<g id="eyes-shut" style="display:none">${A.mirror(`<g transform="${A.EYE_TF}">${A.eyeShut(L.skin)}</g>`)}</g>`+A.mouth(L);
  };
  // Give the doll natural shoulder width, applying the same transform to all clothes.
  for(const g of document.querySelectorAll('#char-anim > g')) if(g.id!=='L-head')
    g.setAttribute('transform',A.BODY_TF);
})();
