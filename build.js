#!/usr/bin/env node
// Concatenates src/* in order into index.html and syntax-checks every inline <script>.
// Usage: node build.js
const fs = require("fs");
const path = require("path");
const root = __dirname;
const parts = fs.readdirSync(path.join(root, "src")).filter(f => /^\d\d-/.test(f)).sort();
const html = parts.map(f => fs.readFileSync(path.join(root, "src", f), "utf8")).join("");
fs.writeFileSync(path.join(root, "index.html"), html);
// Standalone copy for GitHub Pages (docs/). The artifact host adds this skeleton itself; a plain web host does not.
const shell = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="description" content="Election-night desk for the 3 Nov 2026 US midterms: calls, results, a drill-down map and a live log, in IST.">
<style>:root{box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>
</head><body>
${html}
</body></html>
`;
fs.mkdirSync(path.join(root, "docs"), { recursive: true });
fs.writeFileSync(path.join(root, "docs", "index.html"), shell);
fs.writeFileSync(path.join(root, "docs", ".nojekyll"), "");
let ok = true;
[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].forEach((m, i) => {
  try { new Function(m[1]); } catch (e) { ok = false; console.error(`script ${i}: SYNTAX ERROR ${e.message}`); }
});
const sen = (html.match(/const SEN = \[([\s\S]*?)\];/) || [,""])[1];
const hse = (html.match(/const HSE = \[([\s\S]*?)\];/) || [,""])[1];
console.log(`index.html ${(html.length/1024).toFixed(0)} KB · parts: ${parts.join(", ")}`);
console.log(`Senate rows: ${(sen.match(/\{st:/g) || []).length} (expect 35) · House rows: ${(hse.match(/\n \[/g) || []).length}`);
if (!ok) process.exit(1);
