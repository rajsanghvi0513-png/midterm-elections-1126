# Data palette validation (dataviz skill validator)

Categorical set (party hues): light `#2E64B8` D, `#C2362C` R, `#2F9E6E` I on surface `#FBFBF9`; dark `#5B8EDC`, `#E0614F`, `#45B98A` on `#15181D`.
Light: lightness band PASS, chroma floor PASS, CVD separation PASS (worst adjacent I↔R ΔE 9.3 deutan), normal-vision floor PASS (28.8), contrast ≥3:1 PASS.
Dark: all five checks PASS.
Rejected candidates: a gold `#8A6D1F` for independents failed chroma and CVD (ΔE 4.0 deutan vs red); `#2457A6` blue failed the dark lightness band.
Text/background contrast (computed): ink-2 8.6:1 light / 8.7 dark; ink-3 5.1 light (4.7 on wells) / 5.5 dark; chip text ≥10.8:1 in both themes; solid tile labels 5.8 light / 5.5 dark (paper-on-fill).
Status is never colour-alone: every call carries the oval glyph and a text label.
