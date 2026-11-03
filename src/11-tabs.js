<script>
// ---- tabs: each contents link shows one group of sections; plain #name routing
(function(){
const bar=document.getElementById("tabs");if(!bar)return;
const links=[...bar.querySelectorAll("a[href^='#']")],ids=links.map(a=>a.getAttribute("href").slice(1));
const secs=[...document.querySelectorAll("main.page > section")];let cur=ids[0];
secs.forEach(s=>{if(s.id&&ids.includes(s.id))cur=s.id;s.dataset.tab=cur;s.setAttribute("role","tabpanel");});
links.forEach(a=>{a.setAttribute("role","tab");a.id="tab-"+a.getAttribute("href").slice(1);});
function show(id,target){
  if(!ids.includes(id))id=ids[0];
  secs.forEach(s=>{s.hidden=s.dataset.tab!==id;});
  links.forEach(a=>{const on=a.getAttribute("href")==="#"+id;a.setAttribute("aria-selected",on);a.tabIndex=on?0:-1;});
  const tip=document.getElementById("tip");tip&&tip.classList.remove("show");
  dispatchEvent(new Event("resize")); // the map sizes its labels against the visible frame
  if(target){target.scrollIntoView({block:"start"});}
  else{const m=document.querySelector(".mast"),top=m?m.getBoundingClientRect().bottom+scrollY:0;if(scrollY>top)scrollTo({top,behavior:"instant"});}
}
function route(){
  const h=decodeURIComponent(location.hash.slice(1));
  if(ids.includes(h)||!h){show(h);return;}
  const el=document.getElementById(h),sec=el&&el.closest("main.page > section");
  if(sec){show(sec.dataset.tab,el);}else show(ids[0]);
}
window.__tab=id=>{if(location.hash!=="#"+id)history.replaceState(null,"","#"+id);show(id);};
bar.addEventListener("keydown",e=>{const i=links.indexOf(document.activeElement);if(i<0)return;
  const j=e.key==="ArrowRight"?(i+1)%links.length:e.key==="ArrowLeft"?(i-1+links.length)%links.length:-1;
  if(j<0)return;e.preventDefault();links[j].click();links[j].focus({preventScroll:true});});
addEventListener("hashchange",route);route();

// ---- theme toggle: light / dark, remembered per browser when storage allows
const btn=document.getElementById("theme-btn"),root=document.documentElement;
const sys=()=>matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";
const curT=()=>root.getAttribute("data-theme")||sys();
function label(){const t=curT();btn.textContent=t==="dark"?"Light mode":"Dark mode";btn.setAttribute("aria-pressed",t==="dark");}
try{const s=localStorage.getItem("md-theme");if(s==="dark"||s==="light")root.setAttribute("data-theme",s);}catch(e){}
if(btn){label();btn.addEventListener("click",()=>{const n=curT()==="dark"?"light":"dark";root.setAttribute("data-theme",n);try{localStorage.setItem("md-theme",n);}catch(e){}label();});
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change",label);}
})();
</script>
