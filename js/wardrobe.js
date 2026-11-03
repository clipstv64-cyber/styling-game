'use strict';
/* Tailoring and fabric finishes for the current figure, shared by game and previews. */
(() => {
  const A=ART,K=CK,sh=U.shade,mir=A.mirror;
  const defs=document.querySelector('#char defs');
  const materials=['cotton','satin','knit','denim','leather','lace'];
  defs.insertAdjacentHTML('beforeend',`
    <linearGradient id="cwClothVolume" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#251c2e" stop-opacity=".22"/><stop offset=".2" stop-color="#fff8ec" stop-opacity=".03"/><stop offset=".4" stop-color="#fff8ec" stop-opacity=".12"/><stop offset=".65" stop-color="#302237" stop-opacity=".02"/><stop offset="1" stop-color="#251c2e" stop-opacity=".24"/></linearGradient>
    ${materials.map((m,i)=>`<filter id="cwFabric-${m}" x="-.025" y="-.025" width="1.05" height="1.05" primitiveUnits="objectBoundingBox" color-interpolation-filters="sRGB"><feImage href="img/atelier-fabrics.webp" x="${-(i%3)}" y="${-Math.floor(i/3)}" width="3" height="2" preserveAspectRatio="none" result="weave"/><feComponentTransfer in="weave" result="drape"><feFuncR type="linear" slope=".82" intercept=".36"/><feFuncG type="linear" slope=".82" intercept=".36"/><feFuncB type="linear" slope=".82" intercept=".36"/></feComponentTransfer><feBlend in="SourceGraphic" in2="drape" mode="multiply" result="cloth"/><feComposite in="cloth" in2="SourceGraphic" operator="in"/></filter>`).join('')}
  `);
  const cut=(hem=536,ease=4)=>K.sym([
    [[200,368],[189,365],[179,354]],[[179,354],[163,359],[148,370]],
    [[148,370],...K.side(386,hem,ease)],[[K.BL(hem)-ease,hem],[200,hem+2]],
  ]);
  const stitch=(d,c)=>K.st(d,sh(c,-26),.48,.7,'1.8 2.4');
  const hem=(y,c)=>stitch(`M${K.BL(y)-2},${y-4} Q200,${y+1} ${400-K.BL(y)+2},${y-4}`,c);
  const collar=c=>K.line('M179,354 Q200,376 221,354',sh(c,-7),3.2)
    +stitch('M180,357 Q200,377 220,357',c);
  const register=(id,art)=>{const item=DATA.ITEM_BY_ID[id];if(item)item.art=art;};

  // Fresh cuts use the current shoulder seam and waist; no painted-on skin gaps.
  register('top_breton',c=>{
    const base='#fffaf2',stripe=K.PAT.breton(base,c);
    return {sleeves:K.sleeves(base,{endY:524,w0:33,w1:27,pat:stripe,foldC:c}),
      body:K.cloth(cut(538,4),base,{pat:stripe,edgeOp:.38})+collar(c)+hem(536,c)
        +mir(K.fold('M153,420 Q158,426 166,426',c,1.6,.15))
        +`<g transform="translate(224 412)"><path d="M0,-7 V7 M-5,2 Q0,10 5,2 M-3,-4 H3" fill="none" stroke="${c}" stroke-width="1.7" stroke-linecap="round"/><circle cy="-8" r="1.8" fill="none" stroke="${c}" stroke-width="1.2"/></g>`};
  });
  register('top_tee',c=>({sleeves:K.sleeves(c,{endY:450,w0:33,w1:29}),
    body:K.cloth(cut(536,4.5),c,{edgeOp:.4})+collar(c)+hem(534,c)
      +mir(K.fold('M154,420 Q161,426 169,423',c,1.8,.17))
      +`<path d="${A.star(200,424,14,6)}" fill="${U.luma(c)>.7?'#b983a8':'#fff9ed'}" opacity=".9"/>`
      +stitch('M192,441 Q200,444 208,441',c)}));
  register('top_tank',c=>{
    const d=K.sym([[[200,398],[189,393],[180,378],[178,356]],[[178,356],[168,356]],[[168,356],[162,374],[152,397],[146,410]],K.side(420,534,2),[[K.BL(534)-2,534],[200,536]]]);
    return {body:K.cloth(d,c,{pat:K.PAT.rib(c),patOp:.35,edgeOp:.4})
      +K.line('M178,356 Q180,393 200,398 Q220,393 222,356',sh(c,-8),2.8)
      +K.line('M168,356 Q162,385 146,410 M232,356 Q238,385 254,410',sh(c,-8),2.6)
      +hem(532,c)+`<rect x="225" y="515" width="8" height="4" rx="1" fill="#d5b77a"/>`};
  });
  register('top_hoodie',c=>{
    const hood='M154,375 C144,356 159,335 183,334 L217,334 C241,335 256,356 246,375 C232,366 218,361 200,361 C182,361 168,366 154,375 Z';
    return {sleeves:K.sleeves(c,{endY:570,w0:35,w1:29,puff:3,cuff:15,cuffC:sh(c,-7),rib:true}),
      body:K.cloth(hood,sh(c,-9),{edgeOp:.35})
        +K.cloth('M170,364 Q200,342 230,364 Q200,357 170,364 Z',sh(c,-23),{vert:false,edge:false})
        +K.cloth(cut(580,7),c,{edgeOp:.4})
        +K.cloth(`M${K.BL(570)-7},568 L${400-K.BL(570)+7},568 L${400-K.BL(590)+7},590 L${K.BL(590)-7},590 Z`,sh(c,-7),{pat:K.PAT.rib(c),vert:false,ew:.7})
        +K.cloth('M174,510 Q200,505 226,510 L239,554 Q200,561 161,554 Z',sh(c,-3),{vert:false,edgeOp:.3,ew:.8})
        +stitch('M176,514 Q200,509 224,514 L234,551 Q200,557 166,551 Z',c)
        +mir(K.line('M188,368 Q189,393 186,418','#fff9ee',1.8)+`<rect x="184.5" y="416" width="3" height="7" rx="1.2" fill="url(#gkSilver)"/>`)
        +mir(K.fold('M152,455 Q160,461 170,459',c,1.7,.18))};
  });
  // A softer sweetheart bodice, continuous waist and richer satin skirt for the gala look.
  register('dress_gala',c=>{
    const skirt=K.fullSkirt(520,932,37,148,{bell:1.05,curve:12,wave:5,waves:8});
    return {body:K.cloth(skirt,c,{sheen:'satin',drop:3,edgeOp:.4})
      +K.gathers(520,932,37,148,14,c,{bell:1.05,curve:12,op:.24})
      +K.cloth(K.BOD.sweet(524,4),c,{sheen:'satin',edgeOp:.4})
      +mir(K.line('M172,410 Q174,461 184,510',sh(c,-14),.85,.55))
      +K.sash(514,12,sh(c,-10))+K.gem(200,520,4.2,'#fff8e3')
      +K.line(K.cr(K.hemLine(932,148,12,c)),sh(c,-16),1,.6)
      +[[-68,727],[-22,806],[31,706],[78,843],[-92,871]].map(([x,y])=>`<path d="${A.spark4(200+x,y,2.8)}" fill="#fff8e6" opacity=".7"/>`).join('')};
  });

  const materialFor=item=>{
    const id=item.id;
    if(/denim|jeans|overall|jumpsuit/.test(id))return 'denim';
    if(/leather|cowboy|chelsea|quilt|belt|maryjane|gladiator/.test(id))return 'leather';
    if(/lace|tutu|princess|boho|flapper|peasant/.test(id))return 'lace';
    if(/knit|cable|argyle|sweater|cardigan|teddy|warmers|beanie|frill/.test(id))return 'knit';
    if(/gala|party|sequin|mermaid|wrap|crystal|heel|stole|satin/.test(id))return 'satin';
    return 'cotton';
  };
  const dressed=new Set(['top','bottom','dress','outer','legwear','shoes','bag']);
  for(const item of DATA.ITEMS){
    if(!dressed.has(item.slot))continue;
    const original=item.art,material=materialFor(item);item.fabric=material;
    item.art=function(color){const r=original.call(this,color);const wrap=s=>s?`<g filter="url(#cwFabric-${material})">${s}</g>`:'';return{...r,body:wrap(r.body),sleeves:wrap(r.sleeves)};};
  }

  // Thumbnails show the same fitted proportions as the live figure and wish picture.
  const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');
  svg.setAttribute('style','position:absolute;left:-10000px;width:500px;height:1100px');
  document.body.appendChild(svg);
  const bodySlots=new Set([...dressed,'necklace']);
  for(const item of DATA.ITEMS){
    const transform=bodySlots.has(item.slot)?A.BODY_TF:'';
    const r=item.art(item.colors[0]),g=document.createElementNS(ns,'g');
    g.innerHTML=`<g transform="${transform}">${r.sleeves||''}${r.body||''}</g>`;svg.appendChild(g);
    const b=g.getBBox(),pad=Math.max(b.width,b.height)*.055;
    if(b.width>1&&b.height>1){item.box=`${b.x-pad} ${b.y-pad} ${b.width+2*pad} ${b.height+2*pad}`;item.thumbTransform=transform;}
    g.remove();
  }
  svg.remove();
})();
