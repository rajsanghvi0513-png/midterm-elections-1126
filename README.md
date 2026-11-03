# Midterm Desk 2026

A single-page election-night desk for the 3 November 2026 US midterms: the desk's call for the Senate and the House, what happens if the polls are wrong in either direction, every Senate seat and every competitive House district grouped by state, what each outcome means for both parties, and an IST-ordered watch list for the night.

Live page: https://claude.ai/artifact/L7BHse5WdMQHM1YFFDhvBV

## Build
```
node build.js
```
`index.html` is generated from `src/` (eight parts concatenated in order). Open `index.html` in a browser to preview; note the artifact host adds the `<html>` skeleton, so a local preview is best done through `tools/render-check.js`, which wraps it the same way.

## What is opinion and what is sourced
The desk's probabilities (Senate 62% D, House 92% D, the per-seat `desk` numbers, the scenario strip) are one analyst's judgment and are labelled as such on the page. Every other number carries its source and date: Cook, Sabato's Crystal Ball and Inside Elections final ratings; RealClearPolling, Silver Bulletin and NYT/Siena polls; Polymarket (read live 3 Nov) and Kalshi (2 Nov); DDHQ, Economist, Split Ticket forecasts; AAPOR and Silver Bulletin polling-error records. The research behind the page is in `research/`.

## Folders
- `src/` page source parts · `index.html` built page
- `research/` Senate, House and national-environment reports; market snapshot
- `design/` product truth and the design contract (optical-scan ballot world)
- `tools/` Playwright render checks and the Senate Monte Carlo (`senate_mc.py`)

See `CLAUDE.md` for the editing rules and the election-night update plan.
