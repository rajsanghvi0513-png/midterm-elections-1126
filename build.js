#!/usr/bin/env node
// Concatenates src/* in order into index.html and syntax-checks every inline <script>.
// Usage: node build.js
const fs = require("fs");
const path = require("path");
const root = __dirname;
const parts = fs.readdirSync(path.join(root, "src")).filter(f => /^\d\d-/.test(f)).sort();
const html = parts.map(f => fs.readFileSync(path.join(root, "src", f), "utf8")).join("");
fs.writeFileSync(path.join(root, "index.html"), html);
let ok = true;
[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].forEach((m, i) => {
  try { new Function(m[1]); } catch (e) { ok = false; console.error(`script ${i}: SYNTAX ERROR ${e.message}`); }
});
const sen = (html.match(/const SEN = \[([\s\S]*?)\];/) || [,""])[1];
const hse = (html.match(/const HSE = \[([\s\S]*?)\];/) || [,""])[1];
console.log(`index.html ${(html.length/1024).toFixed(0)} KB · parts: ${parts.join(", ")}`);
console.log(`Senate rows: ${(sen.match(/\{st:/g) || []).length} (expect 35) · House rows: ${(hse.match(/\n \[/g) || []).length}`);
if (!ok) process.exit(1);
