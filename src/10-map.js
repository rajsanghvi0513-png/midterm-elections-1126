<script>
(function(){
"use strict";
const $=(s,r=document)=>r.querySelector(s);
const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const pct=p=>Math.round(p*100)+"%";
const fmtN=n=>n.toLocaleString("en-US");
const MON=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const fmtAt=a=>{const m=/^(\d{4})-(\d\d)-(\d\d)\s+(\d\d:\d\d)/.exec(a||"");return m&&MON[+m[2]-1]?`${+m[3]} ${MON[+m[2]-1]} ${m[4]} IST`:(a?esc(a):"time nf");};
const IND={NE:"Dan Osborn"};
const ok=w=>w==="D"||w==="R"||w==="I";
const normW=r=>r&&ok(String(r.w||"").trim().toUpperCase())?String(r.w).trim().toUpperCase():null;
// Results come pre-validated from 08-render.js, so the map, log and tables always agree.
const R_=window.__RES||{},RS=R_.RS||{},RH=R_.RH||{},RHT=R_.RHT||null,RC=R_.RC||{};
const senBy=Object.fromEntries(SEN.map(s=>[s.st,s]));
const winName=(s,w)=>w==="D"?s.d:w==="R"?s.r:(IND[s.st]||"Independent");
const RATE={TU:"Toss-up",LnD:"Lean D",LnR:"Lean R",LkD:"Likely D",LkR:"Likely R",TD:"Tilt D",TR:"Tilt R",SD:"Solid D",SR:"Solid R",nf:"nf"};
const rcls=t=>{t=t||"";if(/nf/.test(t))return"";if(/Toss/.test(t))return"t";if(/D\b/.test(t))return"d";if(/R\b/.test(t))return"r";return"";};
const chip=t=>t&&t!=="nf"?`<span class="chip ${rcls(t)}">${esc(t)}</span>`:`<span class="muted">nf</span>`;
function desk(p,isI){if(isI)return{label:"Lean R (Osborn "+pct(p)+")",cls:"r",fill:1};if(p>=0.85)return{label:p>=0.97?"Safe D":"Likely D",cls:"d",fill:2};if(p>=0.60)return{label:"Lean D",cls:"d",fill:1};if(p>=0.40)return{label:p>=0.5?"Toss-up, tilt D":"Toss-up, tilt R",cls:"t",fill:0};if(p>=0.15)return{label:"Lean R",cls:"r",fill:1};return{label:p>=0.03?"Likely R":"Safe R",cls:"r",fill:2};}
const oval=(fill,cls)=>`<svg class="oval xs col-${cls}" viewBox="0 0 24 14" aria-hidden="true"><use href="#ov${fill}"/></svg>`;
const STNAME={};for(const g of USGEO.objects.states.geometries){const st=FIPS_ST[g.id];if(st)STNAME[st]=g.properties.name;}

// ===================== LIVE UPDATES =====================
(function live(){
  const list=$("#live-list");if(!list)return;
  const AT_OK=a=>/^\d{4}-\d\d-\d\d \d\d:\d\d$/.test(String(a||""));
  const items=(typeof LIVE!=="undefined"?LIVE:[]).filter(e=>{if(e&&AT_OK(e.at)&&e.h)return true;console.warn("Live entry ignored (needs h and at \"YYYY-MM-DD HH:MM\" IST):",e);return false;}).map(e=>Object.assign({kind:"entry"},e));
  const CH={senate:"Senate",house:"House"};
  for(const k of["senate","house"]){const c=RC[k];if(!c)continue;
    items.push({kind:"call",tag:k,at:c.at,h:`${c.w==="D"?"Democrats":"Republicans"} win control of the ${CH[k]}`,t:`${k==="senate"?"The desk had Democrats at about 62% to control the Senate.":"The desk had Democrats at about 92% to win the House, central estimate 236 seats."}${c.n?" "+c.n:""}`,by:c.by||"nf"});}
  if(RHT)items.push({kind:"entry",tag:"house",at:RHT.at,h:`House tally: ${RHT.d} D, ${RHT.r} R, ${435-RHT.d-RHT.r} not yet called`,t:"218 seats are needed for a majority.",by:RHT.by||"nf"});
  for(const st in RS){const s=senBy[st],w=normW(RS[st]);if(!s||!w||(w==="I"&&!(st in IND)))continue;const r=RS[st];
    items.push({kind:"call",tag:"senate",st,at:r.at||"",h:`${s.name} Senate: ${winName(s,w)} (${w}) wins`,t:`${r.m&&r.m!=="nf"?"Margin "+r.m+" as reported. ":""}The desk had ${desk(s.desk,st in IND).label}${st in IND?"":" ("+pct(s.desk)+" D)"}.${r.n?" "+r.n:""}`,by:r.by||"nf"});}
  const hBy=Object.fromEntries(HSE.map(x=>[x[1],x]));
  for(const k in RH){const x=hBy[k],w=normW(RH[k]);if(!x||!w||w==="I")continue;const r=RH[k];const who=w==="D"?x[4]:x[5];
    items.push({kind:"call",tag:"house",st:x[0],at:r.at||"",h:`${k}: ${who&&who!=="nf"?who+" ("+w+")":(w==="D"?"Democrat":"Republican")} wins${(x[3]==="D"||x[3]==="R")&&x[3]!==w?", a seat changing party":""}`,t:`${r.m&&r.m!=="nf"?"Margin "+r.m+" as reported. ":""}Final ratings: Cook ${RATE[x[6]]||x[6]}, Sabato ${RATE[x[7]]||x[7]}, Inside ${RATE[x[8]]||x[8]}.${r.n?" "+r.n:""}`,by:r.by||"nf"});}
  items.sort((a,b)=>String(b.at).localeCompare(String(a.at)));
  let filter="all";
  const label={senate:"Senate",house:"House",desk:"Desk",night:"The night"};
  function render(){
    const r=items.filter(e=>filter==="all"||(filter==="call"?e.kind==="call":filter==="desk"?(e.tag==="desk"||e.by==="Desk"):e.tag===filter));
    $("#live-count").textContent=r.length+(r.length===1?" entry":" entries");
    list.innerHTML=r.length?r.map(e=>{const m=/^(\d{4})-(\d\d)-(\d\d)\s+(\d\d:\d\d)/.exec(e.at||"");const isDesk=(e.by||"")==="Desk"||e.tag==="desk";
      return`<li class="entry${e.kind==="call"?" is-call":""}"><div class="when">${m?`<b>${m[4]}</b><span>${+m[3]} ${MON[+m[2]-1]} IST</span>`:`<b>time nf</b>`}</div><div class="what">
        <p class="tags">${e.kind==="call"?`<span class="chip call-chip">Called</span>`:""}<span class="chip">${esc(label[e.tag]||e.tag)}</span>${isDesk?`<span class="chip op">Desk opinion</span>`:""}${e.st?` <a class="to-map" href="#map" data-st="${esc(e.st)}">${esc(STNAME[e.st]||e.st)} on the map</a>`:""}</p>
        <h3>${esc(e.h)}</h3>${e.t?`<p>${esc(e.t)}</p>`:""}<p class="by">Source: ${esc(e.by||"nf")}</p></div></li>`;}).join("")
      :`<li class="entry"><div class="when"></div><div class="what"><p class="muted">Nothing in this view yet.</p></div></li>`;
  }
  $("#live-filters").addEventListener("change",e=>{filter=e.target.value;render();});
  list.addEventListener("click",e=>{const a=e.target.closest(".to-map");if(!a)return;window.__mapGo&&window.__mapGo({st:a.dataset.st});});
  const last=items.length?items[0].at:"";
  if(last)$("#live-sub").insertAdjacentHTML("beforeend",` Last entry ${fmtAt(last)}.`);
  render();
})();

// ===================== MAP =====================
(function map(){
  const svg=$("#map-svg");if(!svg||typeof USGEO==="undefined")return;
  // --- TopoJSON decoding (quantized, delta-encoded arcs)
  const T=USGEO,[kx,ky]=T.transform.scale,[tx,ty]=T.transform.translate;
  const arcs=T.arcs.map(a=>{let x=0,y=0;return a.map(([dx,dy])=>{x+=dx;y+=dy;return[x*kx+tx,y*ky+ty];});});
  const arc=i=>i<0?arcs[~i].slice().reverse():arcs[i];
  const ring=idx=>{const pts=[];idx.forEach((i,n)=>{const a=arc(i);pts.push(...(n?a.slice(1):a));});return pts;};
  const rings=g=>g.type==="Polygon"?g.arcs.map(ring):g.type==="MultiPolygon"?g.arcs.flatMap(p=>p.map(ring)):[];
  const toPath=rs=>rs.map(r=>"M"+r.map(p=>p[0].toFixed(1)+","+p[1].toFixed(1)).join("L")+"Z").join("");
  const bbox=rs=>{let a=1e9,b=1e9,c=-1e9,d=-1e9;for(const r of rs)for(const[x,y]of r){if(x<a)a=x;if(y<b)b=y;if(x>c)c=x;if(y>d)d=y;}return[a,b,c,d];};
  const states=T.objects.states.geometries.filter(g=>FIPS_ST[g.id]).map(g=>{const rs=rings(g);return{id:g.id,st:FIPS_ST[g.id],name:g.properties.name,d:toPath(rs),bb:bbox(rs)};});
  states.forEach(s=>STNAME[s.st]=s.name);
  const stBy=Object.fromEntries(states.map(s=>[s.st,s]));
  const coGeo={};for(const g of T.objects.counties.geometries){const st=FIPS_ST[g.id.slice(0,2)];if(st)(coGeo[st]=coGeo[st]||[]).push(g);}
  const coCache={};
  const counties=st=>coCache[st]||(coCache[st]=(coGeo[st]||[]).map(g=>{const rs=rings(g);return{id:g.id,name:g.properties.name,st,d:toPath(rs),bb:bbox(rs)};}));
  const cities=CITIES.map(([name,st,p20,p25,x,y],i)=>({name,st,p20,p25,x,y,rank:i+1}));
  const hseBy={};for(const x of HSE)(hseBy[x[0]]=hseBy[x[0]]||[]).push(x);
  const KIND={LA:"parish",AK:"borough or census area"};
  const coLabel=c=>{if(c.st==="LA")return c.name+" Parish";if(c.st==="AK")return c.name;if(+c.id.slice(2)>=510)return c.name+" (independent city)";if(c.st==="DC")return c.name;return c.name+" County";};

  // --- state fill: tint = desk call, deeper tint = solid/likely, full colour = called
  const fillFor=st=>{const s=senBy[st];if(!s)return"var(--map-none)";const w=normW(RS[st]);if(w&&(w!=="I"||st in IND))return`var(--${w.toLowerCase()==="i"?"i":w.toLowerCase()})`;const d=desk(s.desk,st in IND);return d.cls==="t"?"var(--map-toss)":`var(--map-${d.cls}${d.fill===2?"2":"1"})`;};

  let view={lvl:"us"},vb=[0,0,975,610],anim=0;
  const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
  function setVB(t,instant){cancelAnimationFrame(anim);const f=vb.slice(),t0=performance.now(),D=reduce||instant?0:380;
    const step=now=>{const k=D?Math.min(1,(now-t0)/D):1,e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;vb=f.map((v,i)=>v+(t[i]-v)*e);svg.setAttribute("viewBox",vb.map(v=>v.toFixed(2)).join(" "));sizeMarks();if(k<1)anim=requestAnimationFrame(step);};
    anim=requestAnimationFrame(step);}
  const fit=(bb,minW)=>{let[a,b,c,d]=bb;let w=Math.max(c-a,minW),h=Math.max(d-b,minW*610/975);const cx=(a+c)/2,cy=(b+d)/2;const ar=975/610;if(w/h<ar)w=h*ar;else h=w/ar;w*=1.12;h*=1.12;return[cx-w/2,cy-h/2,w,h];};
  // keep strokes, dots and labels a constant on-screen size whatever the zoom
  function sizeMarks(){const px=vb[2]/(svg.clientWidth||975);svg.style.setProperty("--u",px);
    svg.querySelectorAll("circle.city").forEach(c=>c.setAttribute("r",(c.dataset.r*px).toFixed(3)));
    const placed=[];
    svg.querySelectorAll("text.clab").forEach(t=>{t.setAttribute("font-size",(12.5*px).toFixed(3));t.setAttribute("x",(+t.dataset.x+(+t.dataset.r+3)*px).toFixed(2));t.setAttribute("y",(+t.dataset.y+4*px).toFixed(2));
      // labels arrive largest city first; drop any that would collide with one already placed or with a bigger dot
      t.style.visibility="visible";t.removeAttribute("text-anchor");let b;try{b=t.getBBox();}catch(e){return;}const pad=2*px;
      if(b.x+b.width>vb[0]+vb[2]-2*px){t.setAttribute("text-anchor","end");t.setAttribute("x",(+t.dataset.x-(+t.dataset.r+3)*px).toFixed(2));try{b=t.getBBox();}catch(e){}}
      const hit=placed.some(q=>b.x<q.x+q.width+pad&&b.x+b.width+pad>q.x&&b.y<q.y+q.height+pad&&b.y+b.height+pad>q.y);
      if(hit&&!t.classList.contains("keep"))t.style.visibility="hidden";else placed.push(b);});}
  const cityR=c=>Math.max(3,Math.min(9,Math.sqrt(c.p25/1e5)*3));

  function draw(){
    const st=view.st,cos=st?counties(st):[];
    const inset=x=>x==="AK"||x==="HI";
    let h=`<g class="g-states">${states.filter(s=>!st||s.st===st||(!inset(s.st)&&!inset(st))).map(s=>`<path class="state${st?(s.st===st?" on":" off"):""}${!st&&normW(RS[s.st])&&(normW(RS[s.st])!=="I"||s.st in IND)?" called":""}" data-st="${s.st}" d="${s.d}" style="fill:${st&&s.st!==st?"var(--map-off)":fillFor(s.st)}"${st?"":` tabindex="0" role="button" aria-label="${esc(s.name)}"`}></path>`).join("")}</g>`;
    if(st){
      h+=`<g class="g-counties">${cos.map(c=>`<path class="county${WATCH_CO[c.id]?" watch":""}${view.co===c.id?" sel":""}" data-co="${c.id}" d="${c.d}"></path>`).join("")}</g>`;
      const cs=cities.filter(c=>c.st===st);
      const labelled=new Set(cs.slice(0,view.lvl==="state"?10:60).map(c=>c.name));
      h+=`<g class="g-cities">${cs.map(c=>`<circle class="city${view.city===c.name?" sel":""}" data-city="${esc(c.name)}" cx="${c.x}" cy="${c.y}" data-r="${cityR(c)}" r="1"></circle>`).join("")}</g>`;
      h+=`<g class="g-labels" aria-hidden="true">${cs.filter(c=>labelled.has(c.name)||view.city===c.name).sort((a,b)=>(b.name===view.city)-(a.name===view.city)).map(c=>`<text class="clab${view.city===c.name?" keep":""}" data-x="${c.x}" data-y="${c.y}" data-r="${cityR(c)}" x="${c.x}" y="${c.y}">${esc(c.name)}</text>`).join("")}</g>`;
    }
    svg.innerHTML=h;sizeMarks();
    svg.setAttribute("aria-label",st?`Map of ${STNAME[st]} with its counties and cities of 100,000 or more`:"Map of the United States, states coloured by the Senate race");
  }

  function crumbs(){const c=[`<button type="button" data-go="us"${view.lvl==="us"?' aria-current="true"':""}>United States</button>`];
    if(view.st)c.push(`<button type="button" data-go="st"${view.lvl==="state"?' aria-current="true"':""}>${esc(STNAME[view.st])}</button>`);
    if(view.co)c.push(`<span aria-current="true">${esc(coLabel(counties(view.st).find(x=>x.id===view.co)))}</span>`);
    if(view.city)c.push(`<span aria-current="true">${esc(view.city)}</span>`);
    $("#map-crumbs").innerHTML=c.join('<span class="sep" aria-hidden="true">/</span>');
    $("#map-pick").value=view.st||"";}

  function legend(){$("#map-legend").innerHTML=view.lvl==="us"
    ?`<span><i class="sw" style="background:var(--map-d2)"></i>Desk: Likely/Safe D</span><span><i class="sw" style="background:var(--map-d1)"></i>Lean D</span><span><i class="sw" style="background:var(--map-toss)"></i>Toss-up</span><span><i class="sw" style="background:var(--map-r1)"></i>Lean R</span><span><i class="sw" style="background:var(--map-r2)"></i>Likely/Safe R</span><span><i class="sw" style="background:var(--map-none)"></i>No Senate race</span><span class="res-only"><i class="sw" style="background:var(--ink-2)"></i>Full party colour: called</span>`
    :`<span><i class="sw dot"></i>City of 100,000+ (size by population)</span><span><i class="sw watch"></i>Watch county named in the desk's research</span>`;}

  // --- panels
  function senCard(s){const isI=s.st in IND,d=desk(s.desk,isI),r=RS[s.st],w=normW(r);
    return`<div class="mp-block"><h4>Senate${s.open?" · open seat":""}</h4><p class="mp-match"><b>${esc(s.d)}</b> (D) v <b>${esc(s.r)}</b> (R)${s.o?`<span class="sub-line">${esc(s.o)}</span>`:""}</p>
      ${w?`<p class="mp-res"><span class="res col-${w.toLowerCase()}">${oval(2,w.toLowerCase())}<svg class="check" viewBox="0 0 12 12" aria-hidden="true"><use href="#chk"/></svg><span style="color:var(--ink)">${esc(winName(s,w))} won</span></span><span class="res-line">${r.m&&r.m!=="nf"?esc(r.m)+" · ":""}called by ${esc(r.by||"nf")}, ${fmtAt(r.at)}</span></p>`:""}
      <dl class="mp-dl"><dt>Desk call</dt><dd><span class="call col-${d.cls}">${oval(d.fill,d.cls)}<span style="color:var(--ink)">${d.label}</span></span>${isI?"":` <span class="muted">${pct(s.desk)} D</span>`}</dd>
      <dt>Cook · Sabato · Inside</dt><dd>${chip(s.cook)} ${chip(s.sab)} ${chip(s.ie)}</dd><dt>Final polls</dt><dd>${esc(s.poll)}</dd>
      <dt>Polymarket</dt><dd>${isI?"Osborn ":"D "}${pct(s.pm)}${s.k?` · Kalshi ${esc(s.k)}`:""}</dd><dt>Polls close</dt><dd>${esc(s.ist)} IST (${esc(s.et)} ET)</dd></dl>
      <p class="sub-line">${s.held}-held · ${esc(s.inc)}</p></div>`;}
  function houseList(st){const xs=hseBy[st]||[];if(!xs.length)return`<div class="mp-block"><h4>House</h4><p class="muted">No district in this state is on the page's competitive list.</p></div>`;
    return`<div class="mp-block"><h4>House · ${xs.length} competitive district${xs.length>1?"s":""}</h4><ul class="mp-hse">${xs.map(x=>{const w=normW(RH[x[1]]);return`<li><b>${esc(x[1])}</b>${x[10]?` <span class="muted">redrawn</span>`:""}<span class="sub-line">${esc(x[2])}</span><span class="mp-chips">${chip(RATE[x[6]]||x[6])}<span class="muted">Cook</span></span>${w&&w!=="I"?`<span class="res-line"><b class="col-${w.toLowerCase()}" style="color:var(--${w.toLowerCase()})">Called ${w}</b> by ${esc(RH[x[1]].by||"nf")}, ${fmtAt(RH[x[1]].at)}</span>`:""}</li>`;}).join("")}</ul></div>`;}
  function cityList(st,limit){const cs=cities.filter(c=>c.st===st);if(!cs.length)return`<div class="mp-block"><h4>Cities</h4><p class="muted">No city in ${esc(STNAME[st])} reached 100,000 residents in the Census Bureau's 2025 estimates.</p></div>`;
    return`<div class="mp-block"><h4>Cities of 100,000+ · ${cs.length}</h4><ul class="mp-cities">${cs.slice(0,limit).map(c=>`<li><button type="button" data-city="${esc(c.name)}">${esc(c.name)}</button><span class="num">${fmtN(c.p25)}</span></li>`).join("")}</ul>${cs.length>limit?`<p class="sub-line">${cs.length-limit} more on the map; tap a dot.</p>`:""}</div>`;}
  function watchList(st){const ws=counties(st).filter(c=>WATCH_CO[c.id]);if(!ws.length)return"";
    return`<div class="mp-block"><h4>Counties to watch</h4><ul class="mp-watch">${ws.map(c=>`<li><button type="button" data-co="${c.id}">${esc(coLabel(c))}</button><span class="sub-line">${esc(WATCH_CO[c.id].note)}</span></li>`).join("")}</ul></div>`;}

  function panel(){const P=$("#map-panel");
    if(view.lvl==="us"){const calledN=SEN.filter(s=>normW(RS[s.st])).length;
      P.innerHTML=`<h3>United States</h3><p>${SEN.length} Senate races in ${new Set(SEN.map(s=>s.st)).size} states (Ohio and Florida hold specials). States are coloured by the desk's Senate call${calledN?`, or by the winner once a race is called (${calledN} so far)`:""}; the palest states have no Senate race. A called state is outlined.</p><p>${Object.keys(hseBy).length} states have at least one district on the page's competitive House list (${HSE.length} districts).</p><p class="muted">Pick a state on the map or from the list above.</p>`;return;}
    const st=view.st,s=senBy[st];
    if(view.lvl==="city"){const c=cities.find(x=>x.st===st&&x.name===view.city);const ch=(c.p25-c.p20)/c.p20*100;
      P.innerHTML=`<h3>${esc(c.name)}, ${esc(STNAME[st])}</h3><dl class="mp-dl stack"><dt>Population, 1 Jul 2025 (Census estimate)</dt><dd class="big-n">${fmtN(c.p25)}</dd><dt>Population, 1 Apr 2020 (Census)</dt><dd>${fmtN(c.p20)}</dd><dt>Change</dt><dd>${ch>=0?"+":"−"}${Math.abs(ch).toFixed(1)}%</dd><dt>National rank, 2025</dt><dd>${c.rank} of ${cities.length} cities of 100,000+</dd><dt>Polls close</dt><dd>${esc((SLOT||{})[st]||"nf")} IST (first close in ${esc(STNAME[st])})</dd></dl>
        <p class="sub-line">The dot marks the city's listed coordinates. City limits can cross county and district lines, so the map does not assign a city to either.</p>${s?senCard(s):""}`;return;}
    if(view.lvl==="county"){const c=counties(st).find(x=>x.id===view.co),w=WATCH_CO[c.id];
      P.innerHTML=`<h3>${esc(coLabel(c))}, ${esc(STNAME[st])}</h3><p class="sub-line">County or equivalent · FIPS ${esc(c.id)}</p>${w?`<div class="mp-block watch-note"><h4>Why the desk is watching (${esc(w.race)})</h4><p>${esc(w.note)}</p><p class="sub-line">From ${esc(w.src)}</p></div>`:""}
        <p>Polls in ${esc(STNAME[st])} first close at ${esc((SLOT||{})[st]||"nf")} IST; where a state spans two time zones, part of it closes later.</p>${s?senCard(s):`<p class="muted">No Senate race in ${esc(STNAME[st])}.</p>`}`;return;}
    P.innerHTML=`<h3>${esc(STNAME[st])}</h3><p class="sub-line">Polls first close ${esc((SLOT||{})[st]||"nf")} IST · ${counties(st).length} counties or equivalents</p>${s?senCard(s):`<div class="mp-block"><h4>Senate</h4><p class="muted">No Senate race in ${esc(STNAME[st])} this year.</p></div>`}${houseList(st)}${watchList(st)}${cityList(st,8)}`;}

  function go(v,instant){
    if(v.st&&!stBy[v.st])return;
    if(v.city)view={lvl:"city",st:v.st,city:v.city};else if(v.co)view={lvl:"county",st:v.st,co:v.co};else if(v.st)view={lvl:"state",st:v.st};else view={lvl:"us"};
    $("#tip").classList.remove("show");draw();crumbs();legend();panel();
    if(view.lvl==="us")setVB([0,0,975,610],instant);
    else if(view.lvl==="state")setVB(fit(stBy[view.st].bb,40),instant);
    else if(view.lvl==="county")setVB(fit(counties(view.st).find(x=>x.id===view.co).bb,28),instant);
    else{const c=cities.find(x=>x.st===view.st&&x.name===view.city);setVB(fit([c.x-1,c.y-1,c.x+1,c.y+1],70),instant);}
  }
  window.__mapGo=v=>{if(window.__tab)window.__tab("map");go(v);};

  // --- events
  $("#map-pick").innerHTML=`<option value="">United States</option>`+states.slice().sort((a,b)=>a.name.localeCompare(b.name)).map(s=>`<option value="${s.st}">${esc(s.name)}${senBy[s.st]?" (Senate race)":""}</option>`).join("");
  $("#map-pick").addEventListener("change",e=>go(e.target.value?{st:e.target.value}:{}));
  $("#map-crumbs").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;go(b.dataset.go==="us"?{}:{st:view.st});});
  $("#map-panel").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;if(b.dataset.city)go({st:view.st,city:b.dataset.city});else if(b.dataset.co)go({st:view.st,co:b.dataset.co});});
  svg.addEventListener("click",e=>{const t=e.target;
    if(t.matches("circle.city"))return go({st:view.st,city:t.dataset.city});
    if(t.matches("path.county"))return go(view.co===t.dataset.co?{st:view.st}:{st:view.st,co:t.dataset.co});
    if(t.matches("path.state")){if(!view.st||t.dataset.st!==view.st)return go({st:t.dataset.st});}
  });
  svg.addEventListener("keydown",e=>{if((e.key==="Enter"||e.key===" ")&&e.target.matches("path.state")){e.preventDefault();go({st:e.target.dataset.st});}});
  // hover tooltip
  const tip=$("#tip");
  const show=(html,x,y)=>{tip.innerHTML=html;tip.classList.add("show");const w=tip.offsetWidth,h=tip.offsetHeight;let L=x+14,T2=y+14;if(L+w>innerWidth-8)L=x-w-14;if(T2+h>innerHeight-8)T2=y-h-14;tip.style.left=Math.max(8,L)+"px";tip.style.top=Math.max(8,T2)+"px";};
  svg.addEventListener("pointermove",e=>{const t=e.target;let h="";
    if(t.matches("path.state")&&!view.st){const s=senBy[t.dataset.st];h=`<b>${esc(STNAME[t.dataset.st])}</b>${s?`<br>Senate: ${esc(s.d)} (D) v ${esc(s.r)} (R)<br>Desk: ${desk(s.desk,s.st in IND).label}${normW(RS[s.st])?`<br><b>Called: ${esc(winName(s,normW(RS[s.st])))}</b>`:""}`:"<br>No Senate race"}${hseBy[t.dataset.st]?`<br>${hseBy[t.dataset.st].length} competitive House district${hseBy[t.dataset.st].length>1?"s":""}`:""}`;}
    else if(t.matches("path.county")){const c=counties(view.st).find(x=>x.id===t.dataset.co);h=`<b>${esc(coLabel(c))}</b>${WATCH_CO[c.id]?"<br>Watch county":""}`;}
    else if(t.matches("circle.city")){const c=cities.find(x=>x.st===view.st&&x.name===t.dataset.city);h=`<b>${esc(c.name)}</b><br>${fmtN(c.p25)} (2025 est.)`;}
    if(h)show(h,e.clientX,e.clientY);else tip.classList.remove("show");});
  svg.addEventListener("pointerleave",()=>tip.classList.remove("show"));
  addEventListener("resize",sizeMarks);
  go({},true);
})();
})();
</script>
