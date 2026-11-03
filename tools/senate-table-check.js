process.chdir(require('path').join(__dirname,'..')); require('fs').mkdirSync('shots',{recursive:true});
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const html = require('fs').readFileSync('index.html','utf8');
  const ctx = await browser.newContext({viewport:{width:1400,height:900}});
  const page = await ctx.newPage();
  await page.setContent(`<!doctype html><html><head><meta charset="utf-8"></head><body>${html}</body></html>`,{waitUntil:'load'});
  await page.waitForTimeout(800);
  await page.click('input[name=senf][value=comp]');
  await page.evaluate(()=>document.getElementById('sen-table').scrollIntoView());
  console.log(await page.evaluate(()=>({tw:document.getElementById('sen-table').scrollWidth,cw:document.querySelector('#sen-table').parentElement.clientWidth})));
  await page.screenshot({path:'shots/sec-sen-table.png'});
  await browser.close();
})();
