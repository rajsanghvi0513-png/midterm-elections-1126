# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

static single-file HTML/CSS/JS, published as a claude.ai artifact (the artifact runtime dictates this; inline CSS/JS, allowlisted CDNs only). Decided by the delivery surface, not asked.

## Users

the owner (one reader), a data/business analyst by trade, following the 2026 US midterms from India on election night (US evening = IST early morning, 4 Nov). He asked for an unbiased read and a prediction, state by state, for both the Senate and the House, with visuals. He is explicitly skeptical of polling ("they have got it wrong a lot recently"). [confirmed via question round, 3 Nov 2026] He will use the page both as a pre-election read-through and as a live night tracker, analysis first, tracker below; he wants every competitive House district listed under its state, not just summaries.

## Product Purpose

An election-night desk: a single page that states the bottom line and the author's call, shows why (fundamentals, special-election record, markets, ratings), lays out every Senate seat and every competitive House district by state, and then gives an IST-ordered watch list for the night. Success: the owner can tell within a minute what each side needs, can check any state in two scrolls, and can judge for himself how much weight to put on polls vs other signals.

## Positioning

The mechanism no generic forecast page offers: every call carries three independent reads side by side (expert ratings, prediction markets, the author's own call) plus an explicit "polls skepticism" layer that says what happens if polls miss by the historical error in either direction. The author's opinion is stated as an opinion, labelled, and separable from the sourced data.

## Operating Context

Read on a laptop (Windows, Chrome) and possibly a phone, overnight IST. Results arrive 04:30 IST onward (first polls close 18:00 ET = 04:30 IST 4 Nov). Sources: Cook Political Report, Sabato's Crystal Ball, Inside Elections, Polymarket (Gamma API, read live), Kalshi, Silver Bulletin, Decision Desk HQ, NYT/Siena, AAPOR polling post-mortems, special-election results. Terms of art: Toss-up / Lean / Likely / Solid; net seats; generic ballot; effective ownership of nothing here, this is politics not FPL.

## Capabilities and Constraints

- Static page: no live data feed; all figures are a dated snapshot (3 Nov 2026, pre-close). Every number names its source and date.
- Must work in light and dark themes and at phone width.
- Visuals: Senate tile map of all 35 seats, House redistricting net-effect chart, House competitive-district table grouped by state, scenario bands for each chamber, polling-error band chart, night timeline in IST.
- Undecided: none material.

## Evidence on Hand

- Live Polymarket snapshot (3 Nov 2026) in `/tmp/claude-0/-home-claude/91a1b7ba-354f-5912-a832-abc8ac3da6e6/scratchpad/markets/markets_snapshot.json`, Kalshi final-odds post (2 Nov).
- Three research reports (Senate, House, national environment) being produced by subagents into the scratchpad.
- Absences not to fabricate: no exit polls yet, no results, no private polling. Where a rating or poll is "not found", say so.

## Product Principles

- Opinion is labelled; data is sourced; the two never blend.
- Both parties' strongest case appears, as its own side makes it.
- Polls are one input of several, and their historical error is shown, not asserted.
- State by state is the unit of analysis; the national number is derived from it, not the other way round.
- Nothing decorative: every mark on a chart is a value.
