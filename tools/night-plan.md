# Night update plan (agreed with the owner, 3 Nov 2026 19:30 IST)

Cadence revised by the owner at 3 Nov evening to save usage: hourly in every phase until the tail; no 5 or 15 minute runs. Exception (owner, 06:10 IST 4 Nov): every 15 minutes until 12:10 IST 4 Nov (06:40 UTC), then back to the phase cadence. Check AP first: apnews.com/live/midterm-election-2026 and apnews.com/projects/elections-2026/us-senate-results/. Also check NBC (owner, 06:20 IST): nbcnews.com/politics/2026-election/live-blog/midterm-election-results-2026-news-trump-live-updates-rcna605763, nbcnews.com/politics/2026-elections/senate-results and /house-results. Enter NBC Decision Desk projections in RES with by:"NBC"; when AP later calls the same race, keep the earlier entry and add AP in n. Also check Fox News (owner, 06:30 IST, for a balanced voice): foxnews.com/live-news/election-day-results-11-3-2026 (Fox News Decision Desk calls, Fox Insight, Fox News Voter Analysis). Fox Decision Desk calls go in RES with by:"Fox News" if first; otherwise note them in n. Give Fox panel commentary the same weight as other outlets' analysis, attributed by name. Also check CNN (owner, 06:35 IST): cnn.com/2026/11/03/politics/live-news/midterm-election-congress (CNN Decision Desk projections, CNN Voter Poll, Sightline). CNN calls follow the same rule as NBC and Fox: by:"CNN" if first, otherwise add to n. Also check ABC News (abcnews.com/elections live blog, ABC News Decision Desk) and CBS News (cbsnews.com/live-updates/election-day-2026-midterms/, CBS News Decision Desk) (owner, 06:40 IST). Same rule: by:"ABC" or by:"CBS" if first, otherwise add to n. Each wakeup is a one-shot `send_later` into this session. Every run: work out the phase FIRST (clock + conditions below), then schedule the next wakeup for that phase, then do the update. Scheduling early means a failed run does not end the chain.

## Clock
The container runs on UTC. Get IST with `TZ=Asia/Kolkata date '+%Y-%m-%d %H:%M'` and use that exact zero-padded form for every `at`. IST = UTC + 5:30; the IST date changes at 18:30 UTC. Poll closings and calls reported in ET: IST = ET + 10:30 (ET is UTC-5 after 1 Nov).

## Phases (all times IST)
"Callable Senate races" = every race in `SEN` EXCEPT any an outlet reports as going to a runoff (Georgia: runoff 1 Dec if nobody reaches 50%) or to a ranked-choice tabulation (Alaska, 18 Nov; Maine if no one passes 50%). Those are logged as "runoff" / "RCV pending" entries in `LIVE`, not waited for.

| Phase | Starts | Ends when | Interval |
|---|---|---|---|
| A, pre-close | now | 04:30 Wed 4 Nov (first polls close) | 60 min |
| B, counting | 04:30 Wed | AP (or the outlet of record) has called control of both chambers AND every callable Senate race is called. Hard cap: 18 h after B began | 60 min |
| C, settling | end of B | every callable Senate race called AND at least 90% of `HSE` districts called; or 48 h after C began (the fallback also counts as finalization) | 60 min |
| C2 | finalization | 12 h after finalization | 60 min |
| D, tail | end of C2 | 3 days after D began | twice a day, 09:10 and 21:10 IST |
| End | after D | | no further wakeups |

## Ad hoc updates
The owner can ask for an update at any time by messaging this session (in the Claude app), e.g. "update now" or "check Pennsylvania". Run the same steps below, scoped to what was asked, but do NOT schedule another wakeup: the hourly chain already has one pending. Keep ad hoc runs lean: one search round, and skip build/publish/push if nothing new turned up.

## Keeping runs cheap
No review agents during the night. If a run finds nothing new, stop after step 2: no build, no publish, no push.

## Each run
1. Read the `state` line at the bottom; decide the phase; schedule the next wakeup.
2. Look for new calls (Senate races in `SEN`, districts in `HSE`, chamber control, the House tally) and notable sourced developments. Search with Nimble (Tavily if it is not rate-limited). No Firecrawl. Enter a call only when it names its caller: AP first; DDHQ or NBC if AP has not called, with `by` saying so.
3. Before adding a race, grep `src/07-data.js` for its key. One line per race. The only allowed overwrite is upgrading a DDHQ/NBC call to AP: edit that line in place, keep the original time in `n` (e.g. `n:"DDHQ called 06:50; AP 07:20"`). A retracted call: delete the line and add a `LIVE` entry saying who retracted it and when; never silently remove.
4. Add `RES_SEN` / `RES_HSE` / `RES_HOUSE_TOTAL` / `RES_CONTROL` / `LIVE` entries in `src/07-data.js`, plus one row per call in `research/results.md`.
5. Run `node build.js` on its own (never piped into `tail` or `head`, which hides the exit code) and chain the commit with `&&` only after it. If it exits non-zero, nothing was written: fix the entry it names; never publish, commit or push a failed build.
6. On success: republish `index.html` to the artifact, commit and push (this redeploys `docs/` on GitHub Pages). If nothing changed, do not push.
7. Update the `state` line if the phase changed.

## Desk commentary (the owner asked for it, 3 Nov)
Do not hold back on analysis during the results phase. Alongside the sourced facts, post `LIVE` entries with `by:"Desk"` (they render as labelled opinion) whenever there is something worth saying, for example:
- what a call or a county swing means against the desk's pre-election call, the raters and the markets (a hit, a miss, by how much);
- what the early returns imply for races still out (e.g. a Florida margin against Siena's +6 as a polling-error read), always framed as a read, not a call;
- the running picture: where the desk now thinks each chamber lands, and what would change that;
- after the night: where the polls, markets and the desk were right or wrong.
Rules still hold: opinion only in `by:"Desk"` entries, every number in them must come from a sourced entry or the pre-election record, never pre-empt an outlet's call, and never edit or overwrite the pre-election calls.

state: phase=B since=2026-11-04 04:30 (15-min until 12:10 IST, then hourly; last run 2026-11-04 09:40)
