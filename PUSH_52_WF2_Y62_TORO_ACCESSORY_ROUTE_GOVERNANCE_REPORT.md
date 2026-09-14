# PUSH 52 — WF2 Y62 Toro Accessory Route Governance

**Package:** Alpha 26 / WF2 Push 26  
**Date:** 2026-09-14  
**Scope:** Catalogue + Fitment Data only. No customer UX or visual asset work.

## Priority decision

The current Offroad Animal Next-Gen Ranger category was rechecked before taking a Y62 package. The exact manufacturer-category SKUs surfaced in the live Ranger slice are already represented in the locked 65-record Ranger catalogue, so this push does not manufacture another Ranger mapping from generic compatibility. Per WF2 priority order, the next clean source-backed package is Y62 Toro accessory-route normalization.

## Package advanced

Y62 Toro current configurator accessory route, including exact Runva 11EXPEDITION recovery identity and route-specific normalization of the already-governed Toro lighting choices.

### New governed record

- **Runva 11EXPEDITION 12V with Synthetic Rope — Y62 Toro route**
- SKU: `11EXPEDITION12V`
- Status: `confirmed`
- Parts price: AUD $1,295
- RRP: AUD $1,295 from Runva direct manufacturer listing
- Normalized fitted weight: **29 kg** from Runva explicit `FITTED WEIGHT`
- OA storefront weight retained separately: 31 kg
- OA shipping weight retained separately: 39 kg
- Rated line pull: 11,000 lb / 4,990 kg
- Mounting bolt pattern: 254 x 114.3 mm, 4 x M10
- Parent dependency: `oa-y62-toro-frontbar`
- Standalone install time/labour: unknown / staff review
- Battery isolation SKU: unknown; not inferred
- Visual state: non-visual / unapproved

### Toro route normalization

The current Toro product configurator directly exposes these governed choices:

- `ORA-ALO-S5D1-20` — Offroad Animal Slim 22-inch LED light bar
- `ORA-ALO-GR7-B` — Ass Kicker 9-inch pair
- `ORA-ALO-P-R-9-C31D1-AW` — Night Slapper 9-inch pair
- `ORA-ALO-R5-C10D1` — Butt Kicker 7-inch pair
- `11EXPEDITION12V` — Runva 11EXPEDITION 12V
- Warrior lower bash remains the governed mandatory Warrior support route under the Toro bar

The lighting records are now route-aware instead of globally inheriting Cobra mounting parts:

- Ass Kicker on Cobra retains the 9-inch Rally Hoop dependency; Toro does **not** inherit that hoop automatically.
- Butt Kicker on Cobra retains the 7-inch Rally Hoop only as an engineering candidate; Toro explicitly does **not** inherit it.
- Night Slapper and the 22-inch Slim LED are confirmed Toro configurator options, while exact mounting hardware and Y62 electrical labour remain staff-review states.

### Installation-price evidence

The live Toro configurator publishes fitting-partner bundle prices of $900 / $1,200 / $1,350 / $1,200 / $1,500 / $1,650 across the current bar/light/winch combinations. These values are stored as **bundle evidence only**. No standalone PRO4X4 winch or lighting labour is derived by subtraction.

## Manufacturer sources

- Offroad Animal Y62 Toro: https://offroadanimal.com.au/toro-bull-bar-nissan-patrol-y62-series-5-2020-current/
- Runva 11EXPEDITION: https://www.runvawinch.com.au/11expedition-12v-with-synthetic-rope
- Offroad Animal Runva 11EXPEDITION: https://offroadanimal.com.au/runva-11expedition-winch-12v/
- Offroad Animal Next-Gen Ranger category recheck: https://offroadanimal.com.au/ford/ranger/ra-ranger-next-gen-2022-on/

## Catalogue movement

- Ranger: **65 → 65** governed records
- Y62: **25 → 26** governed records
- Y62 evidence registry: **14 → 15** rows
- Ranger/Y62 shared universal SKUs: **5**, with zero brand/current-price identity conflicts
- Y62 duplicate IDs: **0**
- Y62 duplicate SKUs: **0**
- Ranger duplicate IDs: **0**
- Ranger duplicate SKUs: **0**

## Validation

- Push 26 targeted WF2 regression: **PASS**
- Full `npm test`: **PASS**
- `npm run check`: **PASS**
- JavaScript syntax: **103 / 103 valid**
- JSON parse: **9 / 9 valid**
- HTML files: **16**
- Local HTML references: **239**
- Missing local references: **0**
- Changed files from Push 25 baseline: **16 including this report**
- Customer UX / HTML / CSS / render-manifest changes: **0**
- New approved visual states: **0**

## Preserved engineering / unknown states

- Standalone Y62 winch install duration and PRO4X4 labour are not published.
- Exact battery-isolation hardware is not published as mandatory and is not inferred.
- Final battery routing, cable protection, clutch/control-box access remain workshop checks.
- Toro spotlight mounting hardware/clearances remain unresolved beyond the current configurator option identity.
- Y62 two-light high-beam electrical architecture for spotlight pairs remains staff review.
- The Toro page's `MY22 vehicles requires grille cut` language is not generalized to MY25 without authoritative clarification.

## Next dependency

Highest-value next evidence target: authoritative Y62 Toro fitting/BOM detail for the **light-area cover plate / spotlight mounting hardware and exact electrical routing**, preferably with exact SKU(s). If that remains unavailable, the next clean WF2 package should be another source-backed Y62 Toro/Cobra support component rather than inferring mounting parts or standalone labour.
