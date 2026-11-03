process.chdir(require('path').join(__dirname,'..')); require('fs').mkdirSync('shots',{recursive:true});
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const html = require('fs').readFileSync('index.html','utf8');
  const wrap = (theme)=>`<!doctype html><html${theme?` data-theme="${theme}"`:''}><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>:root{padding-top:env(safe-area-inset-top,0px)}body{margin:0;font:14px system-ui}[hidden]{display:none!important}img{max-width:100%}</style></head><body>${html}</body></html>`;
  for (const [name,w,h,theme,scheme] of [["desk-light",1400,900,null,"light"],["desk-dark",1400,900,"dark","dark"],["phone-light",390,844,null,"light"],["phone-dark",390,844,"dark","dark"]]) {
    const ctx = await browser.newContext({viewport:{width:w,height:h},deviceScaleFactor:1,colorScheme:scheme});
    const page = await ctx.newPage();
    const errs=[]; page.on('console',m=>{if(m.type()==='error')errs.push(m.text())}); page.on('pageerror',e=>errs.push('PAGEERROR '+e.message));
    await page.setContent(wrap(theme),{waitUntil:'load'});
    await page.waitForTimeout(1500);
    const over = await page.evaluate(()=>({sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth,h:document.documentElement.scrollHeight,
      wide:[...document.querperySelectorAll?[]:document.querySelectorAll('*')].filter(e=>e.getBoundingClientRect().right>document.documentElement.clientWidth+1).slice(0,8).map(e=>e.tagName+'.'+e.className)}));
    console.log(name, JSON.stringify(over), 'errors:', errs);
    await page.screenshot({path:`shots/${name}-full.png`, fullPage:true});
    await page.screenshot({path:`shots/${name}-top.png`});
    await ctx.close();
  }
  await browser.close();
})();
