// Renders index.html with SAMPLE results injected (never published) to check the results layer.
// Usage: node tools/results-preview.js [outdir]
process.chdir(require('path').join(__dirname,'..'));
const fs=require('fs');const { chromium } = require('playwright');
const out=process.argv[2]||'shots';fs.mkdirSync(out,{recursive:true});
const SAMPLE=`const RES_SEN = {NC:{w:"D",m:"+9.8",by:"AP",at:"2026-11-04 06:42"},KS:{w:"R",m:"+1.4",by:"DDHQ",at:"2026-11-04 09:05"},KY:{w:"R",m:"+18",by:"AP",at:"2026-11-04 04:31"},NE:{w:"I",m:"+0.9",by:"AP",at:"2026-11-04 10:12"},GA:{w:"D",m:"+7.1",by:"AP",at:"2026-11-04 07:40"}};
const RES_HSE = {"PA-7":{w:"D",m:"+2.1",by:"AP",at:"2026-11-04 09:10"},"IN-5":{w:"R",m:"+6",by:"AP",at:"2026-11-04 05:02"},"TX-15":{w:"R",m:"+3.3",by:"DDHQ",at:"2026-11-04 10:40"}};
const RES_HOUSE_TOTAL = {d:120,r:98,by:"AP",at:"2026-11-04 08:15"};
const RES_CONTROL = {senate:null,house:{w:"D",by:"AP",at:"2026-11-04 13:05"}};`;
(async()=>{
  const browser=await chromium.launch();
  let html=fs.readFileSync('index.html','utf8');
  const sample=html.replace(/const RES_SEN = \{[\s\S]*?const RES_CONTROL = [^\n]*\n/,SAMPLE+"\n");
  if(sample===html)throw new Error('RES block not found');
  const wrap=(h,theme)=>`<!doctype html><html${theme?` data-theme="${theme}"`:''}><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>body{margin:0;font:14px system-ui}[hidden]{display:none!important}</style></head><body>${h}</body></html>`;
  for(const [tag,h] of [["empty",html],["sample",sample]])
  for(const [name,w,ht,theme,scheme] of [["desk-light",1400,900,null,"light"],["desk-dark",1400,900,"dark","dark"],["phone-light",390,844,null,"light"],["phone-dark",390,844,"dark","dark"]]){
    const ctx=await browser.newContext({viewport:{width:w,height:ht},deviceScaleFactor:1,colorScheme:scheme});const page=await ctx.newPage();
    const errs=[];page.on('console',m=>{if(m.type()==='error')errs.push(m.text())});page.on('pageerror',e=>errs.push('PAGEERROR '+e.message));
    await page.setContent(wrap(h,theme),{waitUntil:'load'});await page.waitForTimeout(800);
    const o=await page.evaluate(()=>({sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth}));
    console.log(tag,name,JSON.stringify(o),o.sw>o.cw?'OVERFLOW':'ok','errors:',errs.filter(e=>!/fonts\.g/.test(e)));
    await page.screenshot({path:`${out}/${tag}-${name}-top.png`});
    for(const id of ["results","senate","sen-table","house","night"]){const el=await page.$('#'+id);if(el){await el.scrollIntoViewIfNeeded();await page.screenshot({path:`${out}/${tag}-${name}-${id}.png`});}}
    await ctx.close();
  }
  await browser.close();
})();
