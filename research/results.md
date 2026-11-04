# Results log (post-election notes)

The pre-election record is everything else in `research/` and stays as written. This file holds the post-election notes (below) and the run log that records how each result on the page was sourced on the night.

## Post-election notes (written 4 Nov 2026, after live updates stopped at 10:30 IST)

Live updates stopped at the owner's request after the 10:27 IST run. Everything below describes the page as it stood then (artifact Version 42). Races still uncalled at that point are left uncalled; nothing here anticipates a call.

### Where the night stood at 10:27 IST

- **Senate control: Democrats.** NBC News projected it (seen 10:08 IST), CNN and ABC News also projected it, and AP then declared it; AP's time is nf, but it came after AP's Iowa call at 10:05 IST.
- **House control: Democrats.** NBC News projected it at 10:11 p.m. ET (08:41 IST), with CNN and CBS also projecting it. NBC estimated about 252 Democratic seats. AP had not called the House.
- **Senate seats called:** 26 of 35. The page's tally was 51 Democrats (34 not up plus 17 won) and 40 Republicans (31 not up plus 9 won), matching the boards at NBC and ABC News.
- **Democratic flips:** six, all from Republicans: North Carolina, South Carolina, Texas, Ohio, Kansas and Iowa. No Democratic-held seat had been called for a Republican (Michigan and Minnesota were still uncalled).
- **Uncalled Senate races (9):** Alaska, Idaho, Louisiana, Maine, Michigan, Minnesota, Mississippi, Montana and Nebraska. Last counts logged: Maine, Jackson 51.8% to Collins 48.2% (NBC); Michigan, El-Sayed 49.7% to Rogers 48.4% with about 43% counted (NBC). Alaska's polls had not closed; its ranked-choice tabulation is on 18 November.
- **House districts called on the page:** 13 of the competitive list, all won by Democrats. Eight were Republican-held flips: NC-11, KY-6, PA-10, PA-7, NJ-7, OH-15, IN-5 and CO-8. Five were Democratic holds or a new seat: FL-14, FL-22, TX-34, FL-25 and UT-1 (new court-drawn seat).

### Scorecard: Senate, the 26 called races

A rating counts as a call when it leans one way; Toss-up counts as no call. The desk row counts every desk number above or below 50% as a pick; on the page's own rule, where 40 to 60% is no call, the desk was 22 of 23 (missing only SC, with KS, IA and TX as toss-ups). Markets are the Polymarket price on the page (above 0.5 = Democratic).

| Forecaster | Races with a call | Right | Wrong | Misses |
|---|---|---|---|---|
| Desk | 26 | 23 | 3 | SC (0.25), KS (0.45), IA (0.42) |
| Polymarket | 26 | 25 | 1 | SC (0.305) |
| Sabato | 26 | 24 | 2 | SC (Lean R), IA (Lean R) |
| Inside Elections | 24 | 23 | 1 | SC (Tilt R); KS and IA were Toss-up |
| Cook | 22 | 21 | 1 | SC (Lean R); TX, OH, KS and IA were Toss-up |

Brier score on the same 26 races (lower is better): Desk 0.059, Polymarket 0.039. Both figures leave out the nine uncalled races, which include the closest ones (Maine, Michigan, Alaska), so they will move when those are called.

Senate control: the desk put Democrats at about 62% to reach 51 seats, below Kalshi and Polymarket (74 to 78%) and Silver Bulletin (81%). Democrats reached 51.

### Scorecard: House, the 13 called districts

The desk made no district-level House calls, so only the three raters are scored. All 13 went Democratic.

| Rater | Districts with a call | Right | Wrong | Misses |
|---|---|---|---|---|
| Cook | 10 | 8 | 2 | OH-15 (Lean R), IN-5 (Lean R) |
| Inside Elections | 10 | 8 | 2 | OH-15 (Lean R), IN-5 (Likely R) |
| Sabato | 12 | 9 | 3 | KY-6 (Lean R), OH-15 (Lean R), IN-5 (Likely R) |

OH-15 and IN-5 are the two called districts where all three raters missed. Sabato did not rate UT-1.

House size: NBC's estimate of about 252 Democratic seats sits above the desk's "polls understate Democrats by 3" band (244 to 250) and inside its "understate by 6" row (250 and up). The desk's central "polls right" band was 238 to 242.

### Desk: what the night says about the call (opinion)

- **Direction right, size wrong.** The desk called both chambers for Democrats and named the path (North Carolina, Ohio, Texas, Maine, Alaska). The result ran past the central scenario toward the desk's own "understate by 6" row, the one it described as the 2025 off-year miss. Kansas, Iowa and South Carolina all fell; that row named Kansas, Iowa, South Carolina and Nebraska.
- **All three misses have one shape.** South Carolina, Kansas and Iowa were Republican-held seats in states Trump won comfortably, where the desk shaded the Republican below 50/50 against small Democratic poll leads or close polls. The stated reason, "a late-breaking Republican turnout pattern" and past Republican beats of final polls, did not hold in a midterm without Trump on the ballot. The desk named that risk in the call ("the big misses of 2016, 2020 and 2024 came when Trump was on the ballot") and then discounted it.
- **The hedge cost accuracy.** The desk sat below the markets on control and on Texas, Kansas and Iowa, and the markets were closer on every one. On this night, leaning against the consensus because of past Republican poll beats was the wrong adjustment.
- **What held.** Every desk call at 0.9 or above, or 0.1 or below, was right. Texas at 0.55 and Ohio at 0.70 were right. Georgia and New Hampshire held for Democrats, as the call said; Michigan and Minnesota were still uncalled at 10:27.
- **To check when counting ends:** Maine (desk 0.60), Michigan (0.78), Alaska (0.60), Nebraska (0.30, Osborn) and Minnesota (0.88). Re-score the table above when those are called, and re-run `tools/senate_mc.py` with final margins to see what national shift the result implies.

### How the night was sourced

- **Outlets checked every run:** AP (results pages and live blog), NBC News, Fox News, CNN, ABC News and CBS News. Fox News, CNN, ABC and CBS were added through the evening at the owner's request.
- **Who is credited:** a call is credited to the first outlet the desk could show called it. Senate credits at 10:27 IST: AP 17, NBC 6, ABC 2, CNN 1. House: CNN 6, AP 4, NBC 3.
- **Re-credits:** Texas, Oregon, Arkansas and Tennessee were first logged under another outlet and moved to AP once AP's own declared time proved it was earlier. Each move is stated in that race's note.
- **Seen times:** where an outlet's call carried no time, the page uses the IST time the desk saw it and says so in the note (Ohio, Kansas, Tennessee before its re-credit, South Dakota, Senate control, OH-15, IN-5, UT-1). These are upper bounds, not call times.
- **Margins:** every called race carries margin "nf". The desk logged partial counts in the live log but did not record final margins; fill them from certified results.
- **Never overwritten:** the desk calls, the scenario strip and the pre-election ratings on the page stand as published on 3 November. Results sit beside them.

### Open items

1. Record calls for the nine uncalled Senate races, the House control call from AP, and final House seat totals (`RES_HOUSE_TOTAL` is still null).
2. Replace "nf" margins with certified margins.
3. Alaska: ranked-choice tabulation 18 November; note the pre-election DOJ certification suit if it is pursued.
4. Re-score both tables and the Brier scores once the Senate is complete.

## Run log

| Entered (IST) | Race | Winner | Margin | Called by | Notes |
|---|---|---|---|---|---|
| 2026-11-03 20:00 | (no calls) | pre-close check; logged NYT early-vote item and a Desk read | NYT live |
| 2026-11-03 21:00 | (no calls) | logged Westchester scanner fault (NY-17) and Southwest flooding | NYT live; AP |
| 2026-11-03 22:00 | (no calls) | logged Florida polling-place moves for flooding and the Broward stall; Desk note on reading the FL margin | CNN live; TIME live |
| 2026-11-03 23:00 | (no calls) | logged Chester County PA hours extension, Fulton County GA scam texts, FL relocations at 23, and the DCCC watch list | CNN live |
| 2026-11-04 00:00 | (no calls) | logged Westchester cause (programming error), Detroit turnout and reporting schedule, NC extension request and Tarrant County waits; completed the DCCC list to eight; Desk note | CNN live; ABC News live |
| 2026-11-04 01:00 | (no calls) | logged Florida turnout vs 2022 by county lean, Byrd on hours, Black early vote in SC and LA; Desk note on Florida | NBC News live |
| 2026-11-04 02:00 | (no calls) | logged NC extensions (results held to 06:45 IST), Westchester 250k bagged ballots and escort plan, Democratic 230-235 House range; Desk note vs 236 | CNN live; NYT live |
| 2026-11-04 03:00 | (no calls) | logged DOJ Alaska probe escalation (100+ subpoenas, 20+ target letters); Desk note on a contested AK result | ABC News live |
| 2026-11-04 04:00 | (no calls) | logged NBC exit poll (Trump 38/62) and Voter Poll issues; Desk read against 2018 | NBC News Exit Poll; BBC live |
| 2026-11-04 05:00 | Phase B begins. IN/KY polls closed; partial returns (IN-5 D +27 at 31%, KY Sen Barr +34 at 1%); DelBene caution; Desk note. No AP calls. |
| 2026-11-04 06:00 | 7 p.m. ET closings logged; Voter Poll: 7 in 10 say Congress not checking Trump enough. No AP calls confirmed. |
| 2026-11-04 06:15 | First AP call: VA Sen Warner (D) at 05:30 IST; FL-20 Wasserman Schultz (D) logged; AP Voter Poll GA/SC; cadence to 15 min until 12:10 IST (owner). |

| Race | Winner | Margin | Called by | Called (IST) | Desk call |
|---|---|---|---|---|---|
| VA Senate | Warner (D) | nf | AP | 2026-11-04 05:30 | D, 0.99 (hit) |
| 2026-11-04 06:25 | NBC added as a source (owner). NBC projects GA Sen Ossoff (D). NBC exit poll economy D+5; Osceola; FL-25, SC, NH partials; Desk note. |
| GA Senate | Ossoff (D) | nf | NBC | 2026-11-04 06:16 | D, 0.93 (hit) |
| 2026-11-04 06:30 | Fox News added as a source (owner). Fox: SC close, Capito leads WV, Miami-Dade D +9 swing, panel tests (KY-6, SC); Desk note. |
| 2026-11-04 06:35 | CNN added as a source (owner). Catalist early-vote composition; CNN tiered guide; Desk note. |
| 2026-11-04 06:40 | ABC and CBS added as sources (owner). CBS also projects GA Ossoff; CBS exit poll Trump 38% record low; ABC Voter Poll GA/NH; Desk note. |
| 2026-11-04 06:30 | AP calls GA Ossoff (06:25 IST), confirming NBC/CBS; AP Voter Poll OH/health care; VA note adds CBS. |
| 2026-11-04 06:45 | AP calls NJ, DE, IL, MA, RI Senate (D) and FL-25 Moskowitz (D, first HSE call); Desk note on FL-25. |
| 2026-11-04 07:00 | AP calls NH Pappas, NC Cooper (first flip), FL-14 Castor; CNN projects FL-22 Dandiya. FL Senate toss-up (CBS). |
| 2026-11-04 07:15 | FL Moody (R, NBC first, AP 07:04), WV Capito (R, NBC), KY Barr (R, ABC). NC exit poll; TX/OH/MI early counts. |
| 2026-11-04 07:30 | NC-11 Ager (D) first House flip (CNN, NBC). OH Lean D (NBC). SC Andrews 53.6 at 65%. Desk note on SC. |
| 2026-11-04 07:45 | CO, NM (D) and WY (R) called by AP at 9 p.m. ET; CBS adds NC-11; CBS has SC lean D; 9 p.m. counts; Desk note on KS/IA |
| 2026-11-04 08:00 | TX-34 (D, NBC); AP times added for KY, FL-22, NC-11; NBC has SC lean D; counts |
| 2026-11-04 08:15 | OK (R, AP); NBC has TX and KS lean D; CBS TX lean D; Desk note on the 51-52 path |
| 2026-11-04 08:33 | SC (D flip, NBC/CNN): first desk Senate miss; KY-6 (D flip, CNN): first House miss; counts; Desk note |
| 2026-11-04 08:50 | HOUSE CONTROL: D (NBC 08:41; CNN, CBS); AL (R, NBC); PA-10, PA-7 D flips (NBC); counts; Desk note |
| 2026-11-04 09:05 | NJ-7 D (AP 08:18); AP times added to KY-6, PA-7 notes |
| 2026-11-04 09:22 | SC note: Fox projects, Graham concedes; TX Likely D at CBS; NBC counts; Desk note |
| 2026-11-04 09:40 | TX D (ABC/CNN/CBS), OH D (CNN), OR D, AR R (CNN); OH-15 D flip (CNN); Desk note |
| 2026-11-04 09:56 | KS D (NBC); TX, OR, AR re-credited to AP on exact times; AP times on OH, AL, TX-34, PA-10; IA Lean D (CBS); Desk note |
| 2026-11-04 10:12 | Senate control D (NBC, CNN, ABC); IA D (AP 11:35 p.m. ET, Desk miss), TN R (CNN), SD R (ABC); House IN-5 D flip and UT-1 D (CNN). Desk Senate record 23 of 26 |
| 2026-11-04 10:27 | AP calls Senate control D; TN re-credited to AP (11:28 p.m. ET); CO-8 D flip (AP 11:49 p.m. ET); counts ME, MI |
