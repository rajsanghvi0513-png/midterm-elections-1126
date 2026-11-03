"""Desk Senate model: Monte Carlo of the 35 race calls with a shared national error,
plus polling-error scenarios. Reproduces the figures on the page (62% D control,
mean 51.6, scenario medians). Run: python tools/senate_mc.py  (needs numpy, scipy)

Edit P (desk probability of a Democratic win per seat) or M (poll-average margins, D minus R)
and re-run; then update the figures in src/02-top.html, src/03-call.html and the
distribution object in src/08-render.js (function dist)."""
import numpy as np
from scipy.stats import norm

rng = np.random.default_rng(7)
N = 200_000
NOT_UP_D = 34  # Democratic-caucus seats not on the ballot (incl. King and Sanders)

# Desk probabilities of a Democratic win. Nebraska is excluded: Osborn (I) never counts as D.
P = {'NC': .95, 'OH': .70, 'ME': .60, 'AK': .60, 'TX': .55, 'KS': .45, 'IA': .42, 'SC': .25, 'FL': .14,
     'MS': .13, 'LA': .12, 'MT': .04, 'KY': .05, 'AL': .02, 'AR': .02, 'ID': .01, 'OK': .01, 'SD': .02,
     'TN': .02, 'WV': .01, 'WY': .01, 'GA': .93, 'MI': .78, 'MN': .88, 'NH': .92, 'CO': .99, 'DE': .99,
     'IL': .99, 'MA': .99, 'NJ': .99, 'NM': .99, 'OR': .99, 'RI': .99, 'VA': .99}

# Final poll-average margins (D minus R, points) where an average exists; safe seats set wide.
M = {'NC': 10.7, 'OH': 2.8, 'ME': 2.8, 'AK': 1.9, 'TX': 2.6, 'KS': 3.0, 'IA': 0.2, 'SC': -2.0, 'FL': -6,
     'MS': -8, 'LA': -12, 'MT': -8, 'GA': 8.2, 'MI': 6.5, 'MN': 8, 'NH': 7, 'KY': -18, 'AL': -30,
     'AR': -30, 'ID': -30, 'OK': -30, 'SD': -25, 'TN': -30, 'WV': -30, 'WY': -40, 'CO': 20, 'DE': 25,
     'IL': 25, 'MA': 25, 'NJ': 20, 'NM': 15, 'OR': 20, 'RI': 30, 'VA': 15}


def correlated(rho=0.65):
    names = list(P)
    z = norm.ppf([P[n] for n in names])
    Z = rng.standard_normal(N)[:, None]
    e = rng.standard_normal((N, len(names)))
    x = rho * Z + np.sqrt(1 - rho ** 2) * e
    return NOT_UP_D + (x < z).sum(1)


def scenario(shift, sd_nat=2.0, sd_race=3.5):
    s = rng.normal(shift, sd_nat, N)[:, None]
    e = rng.normal(0, sd_race, (N, len(M)))
    marg = np.array(list(M.values()))[None, :] + s + e
    return NOT_UP_D + (marg > 0).sum(1)


if __name__ == "__main__":
    seats = correlated()
    print(f"Desk model: mean {seats.mean():.2f} | P(D>=51) {(seats>=51).mean():.3f} | P(50) {(seats==50).mean():.3f} | P(<=49) {(seats<=49).mean():.3f}")
    vals, cnt = np.unique(seats, return_counts=True)
    print("distribution:", {int(v): round(c / N, 3) for v, c in zip(vals, cnt) if c / N > 0.01})
    for label, shift in [("polls right", 0), ("overstate D by 3 (2024-style)", -3), ("overstate D by 5 (2020-style)", -5),
                         ("understate D by 3", 3), ("understate D by 6 (2025-style)", 6)]:
        s = scenario(shift)
        print(f"{label}: median {int(np.median(s))}, P(D>=51) {(s>=51).mean():.2f}, 10-90% {int(np.percentile(s,10))}-{int(np.percentile(s,90))}")
