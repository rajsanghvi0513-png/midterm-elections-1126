#!/usr/bin/env node
// Builds src/09-geo.js (inline geography for the drill-down map) from research/geo/.
//   Boundaries: us-atlas 3.0.1 counties-albers-10m.json = Census cartographic boundary files, 2017 edition,
//               pre-projected with d3.geoAlbersUsa().scale(1300).translate([487.5,305]) into a 975x610 box.
//   Cities:     research/geo/cities_100k_census_v2025.json = every incorporated place of 100,000+ (Census Vintage 2025),
//               parsed from the Wikipedia table that cites the Census Bureau (extract kept beside it).
// Checks, and fails loudly on: unknown state names, any city whose projected point falls outside its own state,
// and any watch-county name that does not resolve to exactly one county in its state.
// Needs: npm i --no-save d3-geo@3.1.1 topojson-client@3.1.0   Usage: node tools/build-geo.js
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");
const d3 = require("d3-geo"), topo = require("topojson-client");
const T = JSON.parse(fs.readFileSync(path.join(root, "research/geo/counties-albers-10m.json"), "utf8"));
const cities = JSON.parse(fs.readFileSync(path.join(root, "research/geo/cities_100k_census_v2025.json"), "utf8"));

const POSTAL = {Alabama:"AL",Alaska:"AK",Arizona:"AZ",Arkansas:"AR",California:"CA",Colorado:"CO",Connecticut:"CT",Delaware:"DE","District of Columbia":"DC",Florida:"FL",Georgia:"GA",Hawaii:"HI",Idaho:"ID",Illinois:"IL",Indiana:"IN",Iowa:"IA",Kansas:"KS",Kentucky:"KY",Louisiana:"LA",Maine:"ME",Maryland:"MD",Massachusetts:"MA",Michigan:"MI",Minnesota:"MN",Mississippi:"MS",Missouri:"MO",Montana:"MT",Nebraska:"NE",Nevada:"NV","New Hampshire":"NH","New Jersey":"NJ","New Mexico":"NM","New York":"NY","North Carolina":"NC","North Dakota":"ND",Ohio:"OH",Oklahoma:"OK",Oregon:"OR",Pennsylvania:"PA","Rhode Island":"RI","South Carolina":"SC","South Dakota":"SD",Tennessee:"TN",Texas:"TX",Utah:"UT",Vermont:"VT",Virginia:"VA",Washington:"WA","West Virginia":"WV",Wisconsin:"WI",Wyoming:"WY"};

let bad = 0;
const fail = m => { bad++; console.error("FAIL " + m); };

// state FIPS -> postal, checked by name
const fips2st = {};
for (const g of T.objects.states.geometries) {
  const p = POSTAL[g.properties.name];
  if (!p) { if (!/Puerto Rico|Guam|Virgin|Samoa|Mariana/.test(g.properties.name)) fail("unknown state " + g.properties.name); continue; }
  fips2st[g.id] = p;
}
if (Object.keys(fips2st).length !== 51) fail("expected 50 states + DC, got " + Object.keys(fips2st).length);

// city points: project and test against own state polygon
const proj = d3.geoAlbersUsa().scale(1300).translate([487.5, 305]);
const stFeat = {};
for (const f of topo.feature(T, T.objects.states).features) if (fips2st[f.id]) stFeat[fips2st[f.id]] = f;
const inside = (f, pt) => {
  const polys = f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates;
  return polys.some(rings => { let c = false; for (const ring of rings) { for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) { const [xi, yi] = ring[i], [xj, yj] = ring[j]; if ((yi > pt[1]) !== (yj > pt[1]) && pt[0] < (xj - xi) * (pt[1] - yi) / (yj - yi) + xi) c = !c; } } return c; });
};
// Display-only position fixes, each with its reason. Populations are never touched.
// San Francisco: the source point (37.73 N, 123.03 W) is the centroid of the whole city-county including the
// Farallon Islands, 30 km offshore. Plotted at City Hall (37.779 N, 122.419 W) instead.
const PLOT_AT = { "San Francisco|CA": [-122.419, 37.779] };
const out = [];
for (const c of cities) {
  const p = proj(PLOT_AT[c.name + "|" + c.st] || [c.lon, c.lat]);
  if (!p) { fail("unprojectable " + c.name); continue; }
  if (!stFeat[c.st]) { fail("no state " + c.st + " for " + c.name); continue; }
  if (!inside(stFeat[c.st], p)) {
    // Simplified 10m outlines can clip a coastal or border point by a pixel; accept within 2px, flag otherwise.
    const near = [[2,0],[-2,0],[0,2],[0,-2],[1.4,1.4],[-1.4,-1.4],[1.4,-1.4],[-1.4,1.4]].some(([dx, dy]) => inside(stFeat[c.st], [p[0] + dx, p[1] + dy]));
    if (near) console.warn(`note: ${c.name}, ${c.st} sits on the simplified state edge (within 2px); kept`);
    else fail(`${c.name}, ${c.st} projects outside its state`);
  }
  out.push([c.name, c.st, c.pop2020, c.pop2025, +p[0].toFixed(1), +p[1].toFixed(1)]);
}

// Watch counties named in research/ (house_report.md "The night" list, senate_report.md close-time table).
const WATCH = [
  ["IN", "Hamilton", "House", "Bellwether for IN-5 (Spartz). Trump won the county 52-46 and Spartz carried it by 11 in 2024; how much she loses there is the first tell.", "research/house_report.md"],
  ["FL", "Osceola", "House", "Bellwether for the Puerto Rican Latino swing; Trump flipped it 50-48 in 2024.", "research/house_report.md"],
  ["NC", "Cabarrus", "House", "Bellwether at the 7:30 pm ET closing.", "research/house_report.md"],
  ["TX", "Collin", "House", "Bellwether at the 8 pm ET closing.", "research/house_report.md"],
  ["IA", "Dubuque", "Senate + House", "Bellwether at the 9 pm ET closing; one of the eastern river counties to watch in the Senate race (with Scott and Linn).", "research/house_report.md; research/senate_report.md"],
  ["IA", "Scott", "Senate", "Eastern river county to watch in the Senate race.", "research/senate_report.md"],
  ["IA", "Linn", "Senate", "Eastern river county to watch in the Senate race.", "research/senate_report.md"],
  ["KS", "Johnson", "Senate", "Kansas City suburbs; called decisive for the Senate race.", "research/senate_report.md"],
  ["NE", "Douglas", "Senate", "Omaha. Osborn needs a big margin here.", "research/senate_report.md"],
  ["NE", "Lancaster", "Senate", "Lincoln. Osborn needs a big margin here.", "research/senate_report.md"],
  ["MI", "Wayne", "Senate", "Detroit. Slow absentee processing; a call may slip to Wednesday if the margin is under 4 points.", "research/senate_report.md"],
  ["MI", "Oakland", "Senate", "Slow absentee processing.", "research/senate_report.md"]
];
const coByState = {};
for (const g of T.objects.counties.geometries) { const st = fips2st[g.id.slice(0, 2)]; if (!st) continue; (coByState[st] = coByState[st] || []).push(g); }
const watch = {};
for (const [st, name, race, note, src] of WATCH) {
  const hits = (coByState[st] || []).filter(g => g.properties.name === name);
  if (hits.length !== 1) { fail(`watch county ${name}, ${st}: ${hits.length} matches`); continue; }
  watch[hits[0].id] = { race, note, src };
}

const counts = Object.fromEntries(Object.entries(coByState).map(([k, v]) => [k, v.length]));
console.log(`states ${Object.keys(fips2st).length} · counties ${Object.values(counts).reduce((a, b) => a + b, 0)} · cities ${out.length} · watch counties ${Object.keys(watch).length}`);
if (bad) { console.error(bad + " check(s) failed; src/09-geo.js not written"); process.exit(1); }

const js = `<script>
// GENERATED by tools/build-geo.js. Do not edit by hand.
// Boundaries: U.S. Census Bureau cartographic boundary files, 2017 edition, via us-atlas 3.0.1 (ISC), pre-projected Albers USA 975x610.
// Cities: incorporated places of 100,000+, U.S. Census Bureau 2020 Census and Vintage 2025 estimates (via Wikipedia's sourced table, rev. 1379161001, read 3 Nov 2026).
const USGEO=${JSON.stringify(T)};
const FIPS_ST=${JSON.stringify(fips2st)};
const CITIES=${JSON.stringify(out)};
const WATCH_CO=${JSON.stringify(watch)};
</script>
`;
fs.writeFileSync(path.join(root, "src/09-geo.js"), js);
console.log(`wrote src/09-geo.js ${(js.length / 1024).toFixed(0)} KB`);
