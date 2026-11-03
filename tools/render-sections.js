process.chdir(require('path').join(__dirname,'..')); require('fs').mkdirSync('shots',{recursive:true});
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const html = require('fs').readFileSync('index.html','utf8');
  const wrap = (theme)=>`<!doctype html><html${theme?` data-theme="${theme}"`:''}><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>body{margin:0;font:14px system-ui}[hidden]{display:none!important}img{max-width:100%}</style></head><body>${html}</body></html>`;
  const ctx = await browser.newContext({viewport:{width:1400,height:900},deviceScaleFactor:1,colorScheme:'light'});
  const page = await ctx.newPage();
  await page.setContent(wrap(null),{waitUntil:'load'}); await page.waitForTimeout(1200);
  const ids=['control','call','evidence','senate','house','stakes','night'];
  for(const id of ids){ await page.evaluate(i=>document.getElementById(i).scrollIntoView(),id); await page.waitForTimeout(300); await page.screenshot({path:`shots/sec-${id}.png`}); }
  // tiles + dist region
  await page.evaluate(()=>document.getElementById('tiles').scrollIntoView({block:'center'})); await page.screenshot({path:'shots/sec-tiles.png'});
  await page.evaluate(()=>document.getElementById('fig-fc').scrollIntoView({block:'center'})); await page.screenshot({path:'shots/sec-fc.png'});
  await page.evaluate(()=>document.getElementById('fig-redist').scrollIntoView({block:'center'})); await page.screenshot({path:'shots/sec-redist.png'});
  await page.evaluate(()=>document.getElementById('hse-table').scrollIntoView()); await page.screenshot({path:'shots/sec-hse.png'});
  await page.evaluate(()=>document.getElementById('fig-time').scrollIntoView({block:'center'})); await page.screenshot({path:'shots/sec-time.png'});
  await ctx.close();
  const ctx2 = await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,colorScheme:'dark'});
  const p2 = await ctx2.newPage(); await p2.setContent(wrap('dark'),{waitUntil:'load'}); await p2.waitForTimeout(1200);
  console.log('phone scrollWidth', await p2.evaluate(()=>document.documentElement.scrollWidth));
  await p2.screenshot({path:'shots/ph-top.png'});
  await p2.evaluate(()=>document.getElementById('tiles').scrollIntoView()); await p2.screenshot({path:'shots/ph-tiles.png'});
  await p2.evaluate(()=>document.getElementById('night').scrollIntoView()); await p2.screenshot({path:'shots/ph-night.png'});
  await p2.evaluate(()=>document.querySelector('.scen').scrollIntoView()); await p2.screenshot({path:'shots/ph-scen.png'});
  await ctx2.close(); await browser.close();
})();
