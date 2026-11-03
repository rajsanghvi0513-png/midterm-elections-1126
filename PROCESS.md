# How this was built: the full trail, 3 November 2026

Everything below happened in one Claude session on Election Day (US), before any polls closed. Times are UTC unless stated.

## 0. The ask
The owner asked for an unbiased opinion and prediction on the midterms, state by state with visuals, both chambers, with explicit skepticism of polling. Follow-ups during the run: use connectors where needed; use Opus agents for the research; use Tavily or Nimble where needed; use my computer for the handover; include everything from research to end product.

Two clarifying questions were asked and answered (AskUserQuestion): the page is a pre-election read-through first and an IST night tracker below; every competitive House district is listed under its state. One design question: the owner delegated the direction choice ("your choice").

## 1. Research (three Opus agents, in parallel, ~10 minutes)
Briefs are in `research/briefs/`. Each agent used WebSearch/WebFetch first and Tavily or Nimble (`vx8` driver) as fallbacks; Firecrawl was excluded (the owner's allowance). Outputs:
- `research/senate_report.md` (45 KB): all 35 seats, 12-rater table, 11 deep dives, night order, 53 sources. Corrected several of the brief's stale assumptions (Cornyn and Cassidy lost primaries; Lindsey Graham died 11 Jul, sister appointed; Maine's nominee is Troy Jackson; Nebraska has no Democrat).
- `research/house_report.md` (34 KB): composition, nine forecasters, redistricting state by state with court status, 66 competitive districts with three raters each, night order, 45 sources.
- `research/national_report.md` (36 KB): fundamentals, specials record 2025–26, polling accuracy by cycle (AAPOR, Silver), markets, both parties' cases with quotes, 1994–2022 history.
Intermediate extracts the agents saved are in `research/raw/` (Wikipedia Senate page, the 12-rater ratings table, 270toWin Sabato House table) with the parser in `research/scripts/`.

## 2. Live market read
Claude in Chrome could not open Polymarket or Kalshi (the extension's site permissions reverted every navigation to a blank tab). Switched to Tavily extract on the Polymarket Gamma API (`public-search`), which returned 0.9 MB and 5.2 MB payloads; parsed in Python rather than read. Raw payloads: `research/raw/polymarket_*_2026-11-03.json`. Parsed snapshot: `research/markets_snapshot.json`. Kalshi's final-odds post (2 Nov noon ET) was extracted in full. Findings: Polymarket D 94.5% House / 77.5% Senate; Kalshi 94 / 74; per-state Senate prices; GOP seat buckets; House popular-vote buckets; AP call-timing legs (thin).

## 3. The desk model
`tools/senate_mc.py`: each of the 35 seats gets a desk probability (opinion); 200,000 simulations with a shared national factor (correlation 0.65) give the seat distribution on the page (mean 51.6, P(≥51) 62%). A second pass uses poll-average margins with a uniform national shift of −5/−3/0/+3/+6 points (the sizes of real recent misses) to produce the scenario table. House figures are judgment against the forecasters' ranges, not a model.

## 4. Design (Impeccable flow, the owner's design ethos)
- `design/PRODUCT.md` written after the question round (platform, users, product truth, evidence on hand, absences not to fabricate).
- Concept seed rolled (`design/impeccable/roll.json`, seed reference `seed:407918f8e0300e09`). The roll ran degraded (no network for the catalog challengers) and assigned candidate 4 of the seven grounded directions: 1 Almanac of American Politics page, 2 the Cook/Sabato ratings ramp table, 3 broadcast big board, 4 **optical-scan ballot**, 5 canvass tally sheet, 6 Congressional Record, 7 hex cartogram. Mode: Read, with an Operate section. The decision was offered to the owner via the structured question tool (the decision page cannot be served from the sandbox); the owner delegated it, and the assigned direction was built.
- Direction contract: `design/brief.md` and `design/surfaces/index-html.md` (THESIS, OWN-WORLD, STORY, FIRST VIEWPORT, FORM, FINISH).
- Data palette validated with the dataviz skill's CVD validator in both themes: D `#2E64B8`, R `#C2362C`, I `#2F9E6E` (light); `#5B8EDC`, `#E0614F`, `#45B98A` (dark). Results in `design/palette-validation.md`.
- Build: code-led, eight source parts concatenated by `build.js`; inline SVG charts, no libraries; three theme states handled at the token level.

## 5. Verification
- `tools/render-check.js`: desktop 1400 and phone 390, light and dark; checks horizontal overflow, console errors, wide elements. First pass found phone overflow from `summary .meta` (nowrap) and grid children without `min-width:0`; fixed. Tile map initially broke because `.fig svg{width:100%}` caught the oval symbols; fixed by scoping the chart selector and adding `viewBox` to every oval.
- Contrast computed for every text/background token pair in both themes (all ≥4.5:1 for body text after darkening `--ink-3` and switching solid-tile text to `var(--paper)` in dark mode).
- Impeccable detector run once on `index.html`: 237 "low-contrast" findings were false positives (the static detector cannot resolve theme tokens; it evaluated dark-mode text on white); 4 "cramped-padding" findings are the ballot's rule-then-header styling, kept on purpose.
- Fresh-eyes finish review by the Impeccable finish-reviewer agent (`review/finish-review.md`): verdict "fix", eight material items. All eight applied: scenario cards replaced by ballot candidate rows; polling-miss strip became a ruled table; the OPINION kicker removed (an inline filled oval marks the lead sentence instead); the polling-bias chart's left margin widened with inside labels for negative bars; the timeline SVG hidden under 640px and replaced by a ruled list from the same data; the three reads forced to three columns on desktop; the ground changed from white to ballot stock (`#F4F3EE`) with contrast re-verified; the unicode sort arrows replaced by an authored chevron symbol. Re-rendered in all four modes (no overflow, no script errors) and republished as version 2.

## 6. Delivery
- Published artifact, version 1 at 12:40 UTC, version 2 (post-review) at 12:46 UTC: https://claude.ai/artifact/L7BHse5WdMQHM1YFFDhvBV
- Project written to `C:\Users\samue\Documents\midterm-desk-2026` on sam-xps13 through the desktop link (folder access granted for Documents only).
- Not transferred: the `.git` directory (none was created; run `git init && git add -A && git commit -m "Midterm Desk 2026"` in Claude Code), and the `node_modules`/Playwright browser (install with `npm i -D playwright && npx playwright install chromium` if you want the render checks locally).

## 7. Things that went wrong, for the record
- The container restarted mid-run after the research agents finished; their outputs survived on disk and were picked up.
- Google Fonts are blocked in the sandbox, so every local screenshot shows fallback faces; the published page loads Public Sans and Source Serif 4.
- Chrome site permissions blocked the market sites; Tavily was the working path.
- The Impeccable decision page and QUALITY BAR boards need network from the sandbox and were unavailable; the roll ran degraded and the structured question tool stood in.
