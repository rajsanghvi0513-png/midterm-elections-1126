# Handover brief for Claude Code: Midterm Desk 2026

You are taking over an election-night analysis page built earlier today (3 Nov 2026, before US polls closed) in a Claude session. The owner is the owner, in India (IST = US Eastern + 10 h 30 m). Read this file, then `CLAUDE.md` (editing rules), then `PROCESS.md` (how it was built) before touching anything.

## What exists
- `index.html`: the published page (version 2, post-review), live at https://claude.ai/artifact/L7BHse5WdMQHM1YFFDhvBV. Generated from `src/` by `node build.js`; never edit it directly.
- `src/01`–`08`: head + CSS, masthead and Control contests, the call and evidence, Senate section, House section, stakes + night tracker + sources, data (`SEN`, `HSE`, `GRID`, `SLOT`), render script (tables, tile map, six SVG charts).
- `research/`: the three Opus research reports and their briefs, the live Polymarket/Kalshi snapshot, raw payloads and intermediate extracts. These are the evidence base; every figure on the page traces to them or to the sources list.
- `design/`: product truth (PRODUCT.md), the direction contract (optical-scan ballot world, Read mode, seed reference `seed:407918f8e0300e09`), the Impeccable roll files, palette validation.
- `review/`: the fresh-eyes finish review (all eight fixes applied) and render screenshots at desktop/phone, light/dark.
- `tools/`: Playwright render checks and the Senate Monte Carlo (`senate_mc.py`).

## The state of play
Pre-election desk calls (opinion, labelled on the page): House D ~92%, central 236 D; Senate D ~62% to reach 51, most likely 51–52 D. Market and rater reads sit beside them. No results are on the page yet.

## What the owner will most likely ask for next
1. **Results as they land** (from 04:30 IST Wed 4 Nov). Add a `result` field to each `SEN` row and `HSE` row: winner, margin, who called it, time. Render a called race as a full oval in the winner's colour with a check glyph, keep the desk call visible beside it, and add a scoreboard under the Control contests (called / remaining / desk hit rate vs Cook, Sabato, markets). Date-stamp every result; never overwrite a pre-election call.
2. **A post-mortem section** once control is known: where the polls, markets and the desk were right or wrong, by state.
3. **Governors**, which the page mentions only in passing (Kalshi 2 Nov: FL Donalds 62, TX Abbott 60, GA Lance Bottoms 68, OH Ramaswamy low).

## Rules that must hold
- Opinion stays labelled and separable from sourced data. No invented numbers; use "nf" (not found).
- Both parties' cases stay, as their own side makes them.
- The oval is the only status glyph; party colour is the only hue encoding (validated palette in `design/palette-validation.md`).
- No kickers/eyebrows above headings, no same-size card grids, no em dashes in prose, no emoji or unicode glyphs as icons.
- Phone (390px) must not scroll horizontally; run `node tools/render-check.js` after layout changes (needs `npm i -D playwright` and `npx playwright install chromium`).
- The artifact host wraps the file in the HTML skeleton; the file has no doctype/html/head/body. External resources are CSP-blocked except Google Fonts and the listed script CDNs.
- Retrieval, per the owner's standing rules: Tavily or Nimble (vx8) for pages; no Firecrawl (allowance); Polymarket via the Gamma API (`gamma-api.polymarket.com/public-search?q=…`), read-only, no auth.

## First commands
```
cd ~/Documents/midterm-desk-2026
git init && git add -A && git commit -m "Midterm Desk 2026: pre-election build, v2 after finish review"
node build.js
```
Then republish `index.html` to the artifact URL above after each change (Artifact tool with that `url`, or paste by hand).

## Known gaps (not found in a live source on 3 Nov)
Gallup's October approval; campaign money for ME, IA, AK, SC, MI, GA; several Republican House nominees (ME-2, MT-1, NV-2, SC-1, NY-21, FL-7); most new-map presidential margins; Dan Osborn's caucus intentions; Cook's 2 Nov final House moves (paywalled); four of Sabato's final Lean R names.
