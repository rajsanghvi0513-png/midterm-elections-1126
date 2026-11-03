<script>
(function(){
"use strict";
const $=(s,r=document)=>r.querySelector(s);
const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const pct=p=>Math.round(p*100)+"%";

// ---- desk call helpers
function deskInfo(p,isI){
  if(isI) return {label:"Lean R (Osborn "+pct(p)+")",cls:"r",fill:1};
  if(p>=0.97) return {label:"Safe D",cls:"d",fill:2};
  if(p>=0.85) return {label:"Likely D",cls:"d",fill:2};
  if(p>=0.60) return {label:"Lean D",cls:"d",fill:1};
  if(p>=0.50) return {label:"Toss-up, tilt D",cls:"t",fill:0};
  if(p>=0.40) return {label:"Toss-up, tilt R",cls:"t",fill:0};
  if(p>=0.15) return {label:"Lean R",cls:"r",fill:1};
  if(p>=0.03) return {label:"Likely R",cls:"r",fill:2};
  return {label:"Safe R",cls:"r",fill:2};
}
const ovalSvg=(fill,cls,size="sm")=>`<svg class="oval ${size} col-${cls}" viewBox="0 0 24 14" aria-hidden="true"><use href="#ov${fill}"/></svg>`;
function rateCls(t){t=t||"";if(/nf/.test(t))return"";if(/Toss/.test(t))return"t";if(/D\b/.test(t)||/D \(/.test(t))return"d";if(/R\b/.test(t))return"r";return"";}
const chip=t=>t&&t!=="nf"?`<span class="chip ${rateCls(t)}">${esc(t)}</span>`:`<span class="muted" title="not found in a live source">nf</span>`;
const nm=s=>s==="nf"?`<span class="muted">not found</span>`:esc(s);
const RATE_FULL={TU:"Toss-up",LnD:"Lean D",LnR:"Lean R",LkD:"Likely D",LkR:"Likely R",TD:"Tilt D",TR:"Tilt R",SD:"Solid D",SR:"Solid R",nf:"nf"};

// ---- tooltip
const tip=$("#tip");
function showTip(html,x,y){tip.innerHTML=html;tip.classList.add("show");const w=tip.offsetWidth,h=tip.offsetHeight;let L=x+14,T=y+14;if(L+w>innerWidth-8)L=x-w-14;if(T+h>innerHeight-8)T=y-h-14;tip.style.left=Math.max(8,L)+"px";tip.style.top=Math.max(8,T)+"px";}
function hideTip(){tip.classList.remove("show");}

// ---- Senate tiles
const senBy=Object.fromEntries(SEN.map(r=>[r.st,r]));
(function tiles(){
  const box=$("#tiles");const cells=[];
  for(let row=0;row<8;row++)for(let col=0;col<11;col++)cells.push([col,row]);
  const byPos={};for(const k in GRID){byPos[GRID[k].join(",")]=k;}
  box.innerHTML=cells.map(([c,r])=>{
    const st=byPos[c+","+r];
    if(!st)return`<div class="tile empty" aria-hidden="true"></div>`;
    const s=senBy[st];
    if(!s)return`<div class="tile" role="listitem" aria-label="${st}, no Senate race">${st}<svg class="oval col-t" viewBox="0 0 24 14" aria-hidden="true"><use href="#ovx"/></svg></div>`;
    const isI=st==="NE";const d=deskInfo(s.desk,isI);
    const cls=isI?"rl":(d.cls==="d"?(d.fill===2?"ds":"dl"):d.cls==="r"?(d.fill===2?"rs":"rl"):"tt");
    const ring=`box-shadow:inset 0 0 0 2px var(--${s.held==="D"?"d":"r"})`;
    return`<div class="tile race ${cls}" role="listitem" tabindex="0" data-st="${st}" style="${ring}" aria-label="${esc(s.name)}: ${d.label}">${st}${ovalSvg(d.fill,cls==="tt"?"t":(cls[0]==="d"?"d":"r"),"")}</div>`;
  }).join("");
  const html=s=>{const isI=s.st==="NE";const d=deskInfo(s.desk,isI);return`<b>${esc(s.name)}</b> · ${esc(s.inc)}<br>${esc(s.d)} (D) v ${esc(s.r)} (R)${s.o?" · "+esc(s.o):""}<br>Cook ${esc(s.cook)} · Sabato ${esc(s.sab)} · IE ${esc(s.ie)}<br>Polls: ${esc(s.poll)}<br>Polymarket ${isI?"Osborn":"D"} ${pct(s.pm)}${s.k?" · Kalshi "+esc(s.k):""}<br>Desk: ${d.label}${isI?"":" ("+pct(s.desk)+" D)"} · closes ${s.ist} IST`;};
  box.addEventListener("pointermove",e=>{const t=e.target.closest(".tile.race");if(!t)return hideTip();showTip(html(senBy[t.dataset.st]),e.clientX,e.clientY);});
  box.addEventListener("pointerleave",hideTip);
  box.addEventListener("focusin",e=>{const t=e.target.closest(".tile.race");if(!t)return;const b=t.getBoundingClientRect();showTip(html(senBy[t.dataset.st]),b.left+b.width/2,b.top+b.height/2);});
  box.addEventListener("focusout",hideTip);
})();

// ---- Senate table
(function senTable(){
  const thead=$("#sen-table thead"),tbody=$("#sen-table tbody"),count=$("#sen-count");
  const cols=[["name","State / seat"],["d","Matchup"],["cook","Cook"],["sab","Sabato"],["ie","Inside"],["poll","Final polls"],["pm","Market (D)"],["desk","Desk call"],["ist","Closes IST"]];
  let sortKey="ist",dir=1,filter="all";
  thead.innerHTML="<tr>"+cols.map(([k,l])=>`<th${k==="pm"?' class="num"':""}><button type="button" data-k="${k}" ${k===sortKey?'aria-sort="ascending"':'aria-sort="none"'}>${l}<svg class="sort" viewBox="0 0 10 10" aria-hidden="true"><use href="#chev"/></svg></button></th>`).join("")+"</tr>";
  const comp=/Toss|Lean|Tilt|Likely/;
  function rows(){
    let r=SEN.slice();
    if(filter==="comp")r=r.filter(s=>comp.test(s.cook)||comp.test(s.sab)||comp.test(s.ie));
    if(filter==="r")r=r.filter(s=>s.held==="R");if(filter==="d")r=r.filter(s=>s.held==="D");
    if(filter==="split")r=r.filter(s=>new Set([rateCls(s.cook),rateCls(s.sab),rateCls(s.ie)]).size>1);
    r.sort((a,b)=>{let x=a[sortKey],y=b[sortKey];if(sortKey==="desk"&&a.st==="NE")x=1-a.desk;if(sortKey==="desk"&&b.st==="NE")y=1-b.desk;if(sortKey==="pm"&&a.st==="NE")x=1-a.pm;if(sortKey==="pm"&&b.st==="NE")y=1-b.pm;if(typeof x==="number")return (x-y)*dir;return String(x).localeCompare(String(y))*dir;});
    return r;
  }
  function render(){
    const r=rows();count.textContent=r.length+" seats";
    tbody.innerHTML=r.map(s=>{const isI=s.st==="NE";const d=deskInfo(s.desk,isI);
      return`<tr><td class="st" style="max-width:210px;white-space:normal">${esc(s.name)}<br><span class="muted" style="font-weight:400;font-size:12px">${s.held}-held${s.open?" · open":""} · ${esc(s.inc)}</span></td><td style="min-width:180px"><b>${esc(s.d)}</b> <span class="muted">(D)</span> v <b>${esc(s.r)}</b> <span class="muted">(R)</span>${s.o?`<br><span class="muted" style="font-size:12px">${esc(s.o)}</span>`:""}${s.note?`<br><span class="muted" style="font-size:12px">${esc(s.note)}</span>`:""}</td><td>${chip(s.cook)}</td><td>${chip(s.sab)}</td><td>${chip(s.ie)}</td><td style="min-width:160px">${esc(s.poll)}</td><td class="num">${isI?"Osborn "+pct(s.pm):pct(s.pm)}${s.k?`<br><span class="muted" style="font-size:12px">K: ${esc(s.k)}</span>`:""}</td><td><span class="call col-${d.cls}">${ovalSvg(d.fill,d.cls,"xs")}<span style="color:var(--ink)">${d.label}</span></span>${isI?"":`<br><span class="muted" style="font-size:12px">${pct(s.desk)} D</span>`}</td><td>${esc(s.ist)}<br><span class="muted" style="font-size:12px">${esc(s.et)} ET</span></td></tr>`;}).join("");
  }
  thead.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;const k=b.dataset.k;if(k===sortKey)dir=-dir;else{sortKey=k;dir=k==="pm"||k==="desk"?-1:1;}thead.querySelectorAll("button").forEach(x=>x.setAttribute("aria-sort",x.dataset.k===sortKey?(dir>0?"ascending":"descending"):"none"));render();});
  $("#sen-filters").addEventListener("change",e=>{filter=e.target.value;render();});
  render();
})();

// ---- House table
(function hseTable(){
  const thead=$("#hse-table thead"),tbody=$("#hse-table tbody"),count=$("#hse-count");
  thead.innerHTML=`<tr><th>District</th><th>Incumbent / status</th><th>Democrat</th><th>Republican</th><th>Cook</th><th>Sabato</th><th>Inside</th><th>Notes</th></tr>`;
  let filter="all";
  const NAMES={AL:"Alabama",AK:"Alaska",AZ:"Arizona",CA:"California",CO:"Colorado",FL:"Florida",IN:"Indiana",IA:"Iowa",KY:"Kentucky",LA:"Louisiana",ME:"Maine",MI:"Michigan",MN:"Minnesota",MO:"Missouri",MT:"Montana",NE:"Nebraska",NV:"Nevada",NJ:"New Jersey",NM:"New Mexico",NY:"New York",NC:"North Carolina",OH:"Ohio",PA:"Pennsylvania",SC:"South Carolina",TN:"Tennessee",TX:"Texas",UT:"Utah",VA:"Virginia",WA:"Washington",WI:"Wisconsin"};
  const sym=t=>RATE_FULL[t]||t;
  function render(){
    let r=HSE.slice();
    if(filter==="toss")r=r.filter(x=>x[6]==="TU"||x[8]==="TU");
    if(filter==="rheld")r=r.filter(x=>x[3]==="R");if(filter==="dheld")r=r.filter(x=>x[3]==="D");
    if(filter==="split")r=r.filter(x=>new Set([x[6],x[7],x[8]].filter(v=>v!=="nf").map(v=>rateCls(sym(v)))).size>1);
    if(filter==="redraw")r=r.filter(x=>x[10]===1);
    const dn=x=>parseInt(x[1].split("-")[1])||0;
    r.sort((a,b)=>(NAMES[a[0]]||a[0]).localeCompare(NAMES[b[0]]||b[0])||dn(a)-dn(b));
    count.textContent=r.length+" districts";
    let html="",last="";
    for(const x of r){
      if(x[0]!==last){last=x[0];const n=r.filter(y=>y[0]===x[0]).length;html+=`<tr class="group"><td colspan="8">${NAMES[x[0]]||x[0]} · ${n} seat${n>1?"s":""} · polls close ${SLOT[x[0]]} IST</td></tr>`;}
      const heldTxt={R:"R-held",D:"D-held",I:"Ind.-held",V:"Vacant",N:"New seat"}[x[3]];
      html+=`<tr><td class="st">${esc(x[1])}<br><span class="muted" style="font-weight:400;font-size:12px">${heldTxt}${x[10]?" · redrawn":""}</span></td><td>${esc(x[2])}</td><td>${nm(x[4])}</td><td>${nm(x[5])}</td><td>${chip(sym(x[6]))}</td><td>${chip(sym(x[7]))}</td><td>${chip(sym(x[8]))}</td><td class="muted" style="min-width:180px">${esc(x[9])||"—"}</td></tr>`;
    }
    tbody.innerHTML=html;
  }
  $("#hse-filters").addEventListener("change",e=>{filter=e.target.value;render();});
  render();
})();

// ---- SVG helpers
const svgEl=(w,h,extra="")=>`<svg viewBox="0 0 ${w} ${h}" role="img" ${extra}>`;
const txt=(x,y,s,cls="",anchor="start",extra="")=>`<text x="${x}" y="${y}" class="${cls}" text-anchor="${anchor}" ${extra}>${esc(s)}</text>`;

// ---- Polling bias by cycle
(function bias(){
  const data=[["2016",3.0,true],["2018",-0.5,false],["2020",4.7,true],["2022",0.8,false],["2024",2.9,true],["2025",-6.1,false]];
  const W=560,H=250,L=100,R=40,T=30,B=36,x0=L+(W-L-R)*(6.5/11.5),sc=(W-L-R)/11.5;
  let s=svgEl(W,H,'aria-label="Signed polling bias by cycle"');
  s+=`<line x1="${x0}" y1="${T-8}" x2="${x0}" y2="${H-B+6}" class="zero" stroke-width="1.5"/>`;
  for(const v of [-6,-4,-2,2,4]){const x=x0+v*sc;s+=`<line x1="${x}" y1="${T-4}" x2="${x}" y2="${H-B}" class="axis"/>`+txt(x,H-B+16,(v>0?"+":"")+v,"t2","middle");}
  s+=txt(x0+5*sc,T-12,"polls overstated Democrats →","t2","end")+txt(x0-6*sc,T-12,"← overstated Republicans","t2","start");
  const rowH=(H-T-B)/data.length;
  data.forEach(([y,v,pres],i)=>{const cy=T+i*rowH+rowH/2,w=Math.abs(v)*sc,x=v>0?x0:x0-w;
    s+=`<rect x="${x}" y="${cy-9}" width="${w}" height="18" rx="2" style="fill:var(--ink-2)"><title>${y}: ${v>0?"+":""}${v} pts</title></rect>`;
    const inside=v<0&&x<L+30;
    s+=txt(L-8,cy+4,y+(pres?" (pres.)":""),"t1","end")+(inside?txt(x+6,cy+4,v.toFixed(1),"","start",'style="fill:var(--paper)"'):txt(v>0?x+w+6:x-6,cy+4,(v>0?"+":"")+v.toFixed(1),"",v>0?"start":"end"));
  });
  s+="</svg>";
  $("#fig-bias").innerHTML=s;
})();

// ---- Midterm history scatter
(function hist(){
  const pts=[["1994",48,-54],["1998",65,4],["2002",67,8],["2006",37,-30],["2010",45,-63],["2014",41,-13],["2018",44,-41],["2022",40,-9]];
  const W=760,H=300,L=56,R=24,T=24,B=40;const xs=v=>L+(v-30)/(70-30)*(W-L-R),ys=v=>T+(15-v)/(15+70)*(H-T-B);
  let s=svgEl(W,H,'aria-label="Presidential approval against House seat change in midterms since 1994"');
  for(const v of [-60,-40,-20,0]){s+=`<line x1="${L}" y1="${ys(v)}" x2="${W-R}" y2="${ys(v)}" class="${v===0?"zero":"axis"}"/>`+txt(L-8,ys(v)+4,(v>0?"+":"")+v,"t2","end");}
  for(const v of [35,40,45,50,55,60,65]){s+=txt(xs(v),H-B+18,v+"%","t2","middle");}
  s+=txt(W-R,H-B+34,"Gallup approval in late October","t2","end")+txt(L-8,T-6,"House seats, president's party","t2","start");
  s+=`<rect x="${xs(37.5)}" y="${T}" width="${xs(39.5)-xs(37.5)}" height="${H-T-B}" style="fill:var(--d);opacity:.14"/>`+txt(xs(38.5),T+14,"2026: 38–39%","t1","middle");
  for(const [y,a,c] of pts){s+=`<circle cx="${xs(a)}" cy="${ys(c)}" r="6" style="fill:var(--ink)"><title>${y}: approval ${a}%, House ${c>0?"+":""}${c}</title></circle>`+txt(xs(a)+10,ys(c)+4,`${y} (${c>0?"+":""}${c})`,"t1");}
  s+="</svg>";$("#fig-hist").innerHTML=s;
})();

// ---- Senate seat distribution
(function dist(){
  const d={44:.011,45:.018,46:.031,47:.047,48:.068,49:.087,50:.104,51:.114,52:.115,53:.109,54:.092,55:.07,56:.049,57:.031,58:.019,59:.011};
  const ks=Object.keys(d).map(Number),W=560,H=260,L=36,R=16,T=28,B=40,bw=(W-L-R)/ks.length,ys=v=>T+(1-v/0.13)*(H-T-B);
  let s=svgEl(W,H,'aria-label="Distribution of Democratic Senate seats in the desk model"');
  for(const v of [.05,.10]){s+=`<line x1="${L}" y1="${ys(v)}" x2="${W-R}" y2="${ys(v)}" class="axis"/>`+txt(L-6,ys(v)+4,pct(v),"t2","end");}
  ks.forEach((k,i)=>{const x=L+i*bw+2,w=bw-4,y=ys(d[k]),h=H-B-y;const col=k>=51?"var(--d)":k===50?"var(--toss)":"var(--r)";
    s+=`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" style="fill:${col}"><title>${k} Democratic seats: ${(d[k]*100).toFixed(1)}%</title></rect>`+txt(x+w/2,H-B+16,k,k===51?"t1":"t2","middle");});
  const xl=L+7*bw;s+=`<line x1="${xl}" y1="${T-6}" x2="${xl}" y2="${H-B+4}" class="zero" stroke-dasharray="4 3"/>`+txt(xl+6,T+4,"51 = Democratic control","t1")+txt(xl-6,T+4,"50 = Vance tiebreak","t2","end");
  s+=txt(L,H-6,"Democratic seats after the election","t2")+"</svg>";
  $("#fig-dist").innerHTML=s;
})();

// ---- House forecasters dot plot
(function fc(){
  const rows=[["Desk (this page)",236,226,248,true],["Cook Political Report",235,230,240],["Inside Elections",236,235,245],["Sabato's Crystal Ball",239],["Split Ticket / The Argument",239],["Silver Bulletin",240],["Decision Desk HQ",241],["NYT panel: Odio / Ruffini / Vavreck",235,229,235],["The Economist (median D+37)",252]];
  const W=760,R=24,L=250,T=36,B=36,rowH=30,H=T+B+rows.length*rowH;const xs=v=>L+(v-212)/(260-212)*(W-L-R);
  let s=svgEl(W,H,'aria-label="Forecasters central Democratic House seat estimates"');
  for(const [v,l] of [[218,"218 majority"],[235,"235 = 2018"],[257,"257 = 2008"]]){s+=`<line x1="${xs(v)}" y1="${T-8}" x2="${xs(v)}" y2="${H-B+6}" class="${v===218?"zero":"axis"}" ${v===218?'stroke-dasharray="4 3"':""}/>`+txt(xs(v),T-14,l,"t2","middle");}
  for(const v of [220,230,240,250]){s+=txt(xs(v),H-B+18,v,"t2","middle");}
  rows.forEach((r,i)=>{const cy=T+i*rowH+rowH/2;const [name,c,lo,hi,desk]=r;
    if(lo!=null)s+=`<line x1="${xs(lo)}" y1="${cy}" x2="${xs(hi)}" y2="${cy}" style="stroke:${desk?"var(--d)":"var(--ink-3)"};stroke-width:${desk?6:4};opacity:${desk?.35:.5}" stroke-linecap="round"/>`;
    s+=`<circle cx="${xs(c)}" cy="${cy}" r="${desk?8:6}" style="fill:${desk?"var(--d)":"var(--ink)"}"><title>${name}: ${c}${lo!=null?" ("+lo+"–"+hi+")":""}</title></circle>`;
    s+=txt(L-12,cy+4,name,desk?"t1":"","end")+txt(xs(c)+(desk?12:10),cy+4,c,desk?"t1":"","start");
  });
  s+=txt(W-R,H-6,"Democratic seats (central estimate; bar = published range)","t2","end")+"</svg>";
  $("#fig-fc").innerHTML=s;
})();

// ---- Redistricting paired bars
(function redist(){
  const rows=[["Texas",5,2],["California",-5,-4],["Florida",4,0],["Ohio",2,0],["North Carolina",1,-1],["Tennessee",1,null],["Louisiana",1,null],["Alabama",1,null],["Utah",-1,null],["Missouri (Prop A pending)",0,0],["Virginia (struck down)",0,0]];
  const W=560,L=180,R=20,T=30,B=34,rowH=26,H=T+B+rows.length*rowH,x0=L+(W-L-R)/2,sc=(W-L-R)/12;
  let s=svgEl(W,H,'aria-label="Redistricting paper gain against expected realized gain by state"');
  for(const v of [-4,-2,2,4]){s+=`<line x1="${x0+v*sc}" y1="${T-4}" x2="${x0+v*sc}" y2="${H-B}" class="axis"/>`+txt(x0+v*sc,H-B+16,(v>0?"R +":"D +")+Math.abs(v),"t2","middle");}
  s+=`<line x1="${x0}" y1="${T-8}" x2="${x0}" y2="${H-B+4}" class="zero"/>`;
  rows.forEach(([n,p,r],i)=>{const cy=T+i*rowH+rowH/2;
    const bar=(v,y,h,op)=>{if(v===0)return`<rect x="${x0-1.5}" y="${y}" width="3" height="${h}" style="fill:var(--ink-3)"/>`;const w=Math.abs(v)*sc,x=v>0?x0:x0-w;return`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" style="fill:var(--${v>0?"r":"d"});opacity:${op}"><title>${n}: ${v>0?"R":"D"} +${Math.abs(v)}</title></rect>`;};
    s+=bar(p,cy-9,9,1);if(r!=null)s+=bar(r,cy+1,8,.45);else s+=txt(x0+(p>0?-6:6),cy+8,"realized est. nf","t2",p>0?"end":"start");
    s+=txt(L-10,cy+4,n,"t1","end");
  });
  s+="</svg>";
  $("#fig-redist").innerHTML=s+`<div class="legend"><span><i style="display:inline-block;width:12px;height:8px;background:var(--ink)"></i> drawn to deliver</span><span><i style="display:inline-block;width:12px;height:8px;background:var(--ink);opacity:.45"></i> DDHQ expected realized (14 Sep)</span></div>`;
})();

// ---- Night timeline
(function time(){
  const slots=[["04:30",["IN, KY"]],["05:30",["GA SC VA FL","NH VT"]],["06:00",["NC OH WV"]],["06:30",["ME PA NJ MI","TX KS +15"]],["07:00",["AR"]],["07:30",["IA NE MN NY","WI AZ CO +6"]],["08:30",["NV MT UT ID"]],["09:30",["CA WA OR HI"]],["10:30",["AK"]]];
  const senAt={};for(const s of SEN){if(/Toss|Lean|Tilt|Likely/.test(s.cook+s.sab+s.ie)){(senAt[s.ist.slice(0,5)]=senAt[s.ist.slice(0,5)]||[]).push(s.st);}}
  const hseAt={};for(const h of HSE){const k=SLOT[h[0]];hseAt[k]=(hseAt[k]||0)+1;}
  const W=1000,H=206,L=40,R=40,T=96;const toMin=t=>{const [h,m]=t.split(":").map(Number);return h*60+m;};const xs=t=>L+(toMin(t)-toMin("04:00"))/(toMin("11:00")-toMin("04:00"))*(W-L-R);
  let s=svgEl(W,H,'aria-label="Poll closing times in IST with competitive Senate races and House district counts"');
  s+=`<line x1="${L}" y1="${T}" x2="${W-R}" y2="${T}" class="zero" stroke-width="2"/>`;
  for(let m=toMin("04:00");m<=toMin("11:00");m+=60){const x=xs(Math.floor(m/60)+":"+String(m%60).padStart(2,"0"));s+=`<line x1="${x}" y1="${T-5}" x2="${x}" y2="${T+5}" class="axis" stroke-width="1.5"/>`;}
  slots.forEach(([t,states],i)=>{const x=xs(t);const up=i%2===0;const dirn=up?-1:1;let y=up?T-16:T+24;const line=(str,cls)=>{s+=txt(x,y,str,cls,"middle");y+=dirn*14;};
    s+=`<line x1="${x}" y1="${T-9}" x2="${x}" y2="${T+9}" style="stroke:var(--ink);stroke-width:2.5"/>`;
    line(t,"t1");states.forEach(st=>line(st,"t2"));
    const sen=(senAt[t]||[]);if(sen.length){line("Senate: "+sen.slice(0,4).join(" "),"t2");if(sen.length>4)line(sen.slice(4).join(" "),"t2");}
    line((hseAt[t]||0)+" House seats","t2");
  });
  s+="</svg>";
  $("#fig-time").innerHTML=s+`<p class="src">Wednesday 4 November, IST. US Eastern = IST − 10 h 30 m. House counts are the competitive districts listed above, by state.</p>`;
  const sl=$("#slotlist");if(sl)sl.innerHTML=slots.map(([t,states])=>`<div><b>${t}</b><span>${esc(states.join(" "))}${(senAt[t]||[]).length?`<br>Senate: ${esc(senAt[t].join(" · "))}`:""}<br><span class="muted">${hseAt[t]||0} House seats</span></span></div>`).join("");
})();

// ---- rail highlight
(function rail(){
  const links=[...document.querySelectorAll(".rail a")];if(!links.length)return;
  const secs=links.map(a=>document.getElementById(a.getAttribute("href").slice(1)));
  let ticking=false;
  function update(){ticking=false;const y=innerHeight*0.35;let cur=0;secs.forEach((el,i)=>{if(el&&el.getBoundingClientRect().top<=y)cur=i;});links.forEach((a,i)=>a.classList.toggle("on",i===cur));}
  addEventListener("scroll",()=>{if(!ticking){ticking=true;requestAnimationFrame(update);}},{passive:true});update();
})();
})();
</script>
