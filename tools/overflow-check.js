process.chdir(require('path').join(__dirname,'..')); require('fs').mkdirSync('shots',{recursive:true});
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const html = require('fs').readFileSync('index.html','utf8');
  const wrap = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0}</style></head><body>${html}</body></html>`;
  const ctx = await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1});
  const page = await ctx.newPage(); await page.setContent(wrap,{waitUntil:'load'}); await page.waitForTimeout(1000);
  const r = await page.evaluate(()=>{
    const cw=document.documentElement.clientWidth; const out=[];
    for(const e of document.querySelectorAll('body *')){const b=e.getBoundingClientRect(); if(b.right>cw+1 && !e.closest('.tbl-wrap') && !e.closest('svg')){out.push(e.tagName+'#'+e.id+'.'+e.className+' right='+Math.round(b.right)+' w='+Math.round(b.width));}}
    return out.slice(0,15);
  });
  console.log(r.join('\n'));
  await browser.close();
})();
