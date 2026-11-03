# Night update plan (agreed with the owner, 3 Nov 2026 19:30 IST)

Each wakeup is a one-shot `send_later` into this session. The FIRST thing every run does is schedule the next one, so a failed run does not end the chain.

## Phases (all times IST)
| Phase | When | Interval |
|---|---|---|
| A, pre-close | now until 04:30 Wed 4 Nov (first polls close) | 30 min |
| B, counting | 04:30 Wed until high confidence: AP has called control of BOTH chambers and every Senate race except Alaska (RCV 18 Nov) is called | 5 min |
| C, settling | after B, until finalization: every Senate race except AK called and at least 90% of the competitive House districts in `HSE` called (or 48 h after C began, whichever first) | 30 min |
| C2 | the 12 hours after finalization | 30 min |
| D, tail | the next 3 days | twice a day, 09:10 and 21:10 IST |
| End | after D | no further wakeups |

Safety cap: if phase B has run 18 hours, move to C anyway and log why.

## Each run
1. Read the `state` line below; schedule the next wakeup for the current phase.
2. Look for new AP calls (Senate races in `SEN`, House districts in `HSE`, chamber control) and notable sourced developments. Search with Nimble (Tavily if it is not rate-limited). No Firecrawl. Only enter a call that names its caller (AP, or DDHQ/NBC if AP has not called, labelled as such).
3. If something new: add `RES_SEN` / `RES_HSE` / `RES_HOUSE_TOTAL` / `RES_CONTROL` / `LIVE` entries in `src/07-data.js` (IST timestamps), `node build.js`, republish `index.html` to the artifact, commit and push (this also redeploys `docs/` on Pages). If nothing new, do not push.
4. Update the `state` line if the phase changed.

state: phase=A since=2026-11-03 19:30
