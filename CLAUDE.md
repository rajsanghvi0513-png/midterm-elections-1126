# Midterm Desk 2026

Election-night analysis page for the 3 November 2026 US midterms (Senate + House), built for the owner, who follows it from India (all times on the page are IST). Published as a claude.ai artifact: https://claude.ai/artifact/L7BHse5WdMQHM1YFFDhvBV (republish by passing that URL to the Artifact tool, or re-upload `index.html` by hand).

## Layout
- `src/01-head.html` … `src/08-render.js` are concatenated in order into `index.html` by `node build.js`. Edit the parts, never `index.html` directly.
  - `01-head.html` title, meta, all CSS (design tokens on `:root`, dark mode twice: `prefers-color-scheme` guarded by `:root:not([data-theme="light"])` and `:root[data-theme="dark"]`).
  - `02-top.html` oval symbols, rail nav, masthead, the two Control contests.
  - `03-call.html` the desk's opinion, polling-error scenarios, evidence, the two parties' cases.
  - `04-senate.html` Senate section: tile map container, distribution chart container, filters, table shell, deep dives.
  - `05-house.html` House section: forecasters chart, redistricting chart + table, competitive-district table shell, state ranges.
  - `06-stakes-night.html` what it means for each side, the IST night tracker, sources, footer.
  - `07-data.js` `SEN` (all 35 Senate seats), `GRID` (tile positions), `HSE` (competitive House districts), `SLOT` (poll-closing IST by state).
  - `08-render.js` tables, tile map, tooltip, six SVG charts, rail highlight. No libraries.
- `research/` the three research reports the page was built from (Senate, House, national environment) and the live Polymarket/Kalshi snapshot. Every figure on the page traces to one of these or to the sources list in `06-stakes-night.html`.
- `design/` PRODUCT.md (product truth), brief.md and `surfaces/index-html.md` (the Impeccable direction contract: optical-scan ballot world, Read mode).
- `tools/` Playwright render checks (`render-check.js` = overflow + console errors at desktop/phone, light/dark; `render-sections.js` = section screenshots) and `senate_mc.py` (the desk's Senate Monte Carlo).

## Rules that must survive edits
- The page is a dated snapshot (3 Nov 2026, pre-close). If results are added, date-stamp them and keep the pre-election calls visible as a record; do not silently overwrite a call.
- Opinion is labelled "Desk" / "Opinion" and lives only in the call text, the Desk reads, the `desk` field of `SEN`, and the scenario strip. Everything else names its source and date. Never invent a number; write "nf" (not found) as the data already does.
- Both parties' cases stay, as their own side makes them.
- Status glyph is the fill-in oval only: empty = toss-up, half = lean, full = solid/likely/called. Party colour is the only hue encoding; `--d`, `--r`, `--i` passed the dataviz CVD validator in both themes.
- The artifact host wraps the file in `<!doctype html><html><head>…</head><body>`; the file itself must contain no doctype/html/head/body tags. External scripts/styles are CSP-blocked except Google Fonts (used) and cdnjs/jsdelivr/unpkg (unused).
- Phone width (390px) must not scroll horizontally; tables scroll inside `.tbl-wrap`. Run `node tools/render-check.js` after layout changes (needs `playwright` with Chromium installed).
- No em dashes in prose.

## Workflow
```
node build.js                 # rebuild index.html + syntax-check the two inline scripts
node tools/render-check.js    # optional: overflow/console check in 4 modes, writes shots/*.png
python tools/senate_mc.py     # optional: re-run the Senate model after changing P or M
```
Then republish `index.html` to the artifact URL above.

## Election-night update plan (what the owner will likely ask for)
1. Add a `result` field per `SEN` row (`"D"`, `"R"`, `"I"`, `"uncalled"`, with margin and the outlet that called it) and render a third oval state: a called race gets a full oval in the winner's colour plus a check mark; keep the desk call beside it so hits and misses are visible.
2. Same for `HSE` rows (`result` column).
3. A scoreboard under the Control contests: called seats, remaining, and the desk's running hit rate against Cook/Sabato/markets.
4. Keep `research/` as the pre-election record; put post-election notes in `research/results.md`.
