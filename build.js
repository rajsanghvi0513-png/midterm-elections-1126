#!/usr/bin/env node
// Concatenates src/* in order into index.html (for the claude.ai artifact, which supplies its own HTML skeleton)
// and docs/index.html (GitHub Pages, with a skeleton). Nothing is written unless every check passes, so a typo
// entered on the night can never be published: a failed build leaves the last good page in place.
// Usage: node build.js   (exit code 1 = do not publish)
const fs = require("fs");
const path = require("path");
const root = __dirname;
const parts = fs.readdirSync(path.join(root, "src")).filter(f => /^\d\d-/.test(f)).sort();
const read = f => fs.readFileSync(path.join(root, "src", f), "utf8");
const html = parts.map(read).join("");
let ok = true;
const fail = m => { ok = false; console.error("FAIL " + m); };

// 1. every inline script must parse
[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].forEach((m, i) => {
  try { new Function(m[1]); } catch (e) { fail(`script ${i}: syntax error: ${e.message}`); }
});

// 2. results: no duplicate keys (JS would silently keep the last one), and every time is zero-padded IST
const data = read("07-data.js");
for (const name of ["RES_SEN", "RES_HSE"]) {
  const block = (data.match(new RegExp(`const ${name} = \\{([\\s\\S]*?)\\n\\};`)) || [, ""])[1];
  const keys = [...block.matchAll(/^\s*"?([A-Z]{2}(?:-(?:\d+|AL))?)"?\s*:/gm)].map(m => m[1]);
  const seen = new Set();
  for (const k of keys) { if (seen.has(k)) fail(`${name} has "${k}" twice; keep one line`); seen.add(k); }
}
const resStart = data.indexOf("// ---------- RESULTS");
for (const m of data.slice(resStart).matchAll(/\bat\s*:\s*"([^"]*)"/g))
  if (!/^\d{4}-\d\d-\d\d \d\d:\d\d$/.test(m[1])) fail(`time "${m[1]}" is not "YYYY-MM-DD HH:MM" (IST, zero-padded)`);

const sen = (html.match(/const SEN = \[([\s\S]*?)\];/) || [, ""])[1];
const hse = (html.match(/const HSE = \[([\s\S]*?)\];/) || [, ""])[1];
console.log(`index.html ${(html.length / 1024).toFixed(0)} KB · parts: ${parts.join(", ")}`);
console.log(`Senate rows: ${(sen.match(/\{st:/g) || []).length} (expect 35) · House rows: ${(hse.match(/\n \[/g) || []).length}`);
if (!ok) { console.error("Build failed: nothing written. Fix the entries above; do not publish or push."); process.exit(1); }

fs.writeFileSync(path.join(root, "index.html"), html);
// Standalone copy for GitHub Pages: 01-head.html (title, meta, fonts, CSS) goes in <head>, the rest in <body>.
const head = read(parts[0]), body = parts.slice(1).map(read).join("");
const shell = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="description" content="Election-night desk for the 3 Nov 2026 US midterms: calls, results, a drill-down map and a live log, in IST.">
<style>:root{box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>
${head}
</head><body>
${body}
</body></html>
`;
fs.mkdirSync(path.join(root, "docs"), { recursive: true });
fs.writeFileSync(path.join(root, "docs", "index.html"), shell);
fs.writeFileSync(path.join(root, "docs", ".nojekyll"), "");
console.log("wrote index.html and docs/index.html");
