# PUSH 49 — WF2 Y62 STEDI HIGH-BEAM TRIGGER ROUTE GOVERNANCE

## Scope

Advanced one WF2 package only: the Nissan Patrol Y62 Series 5 / MY25 Warrior high-beam trigger path supporting the governed Offroad Animal 22-inch Slim LED route. This push did not alter customer UX, customer-facing HTML/CSS/application behaviour, render manifests, or create/approve visual assets.

The verified Next-Gen Ranger catalogue remains locked at 65 governed records. The Y62 catalogue advances from 20 to 22 governed records and the Y62 evidence registry from 9 to 11 rows.

## Source-backed additions

### 1. STEDI Nissan Patrol Y62 Series 5 High Beam Adaptor

- Governed ID: `stedi-y62s5-highbeam-adapter`
- SKU: `PATROL-Y62S5-ADAPTER`
- Status: `confirmed`
- Vehicle applicability: Nissan Patrol Y62 Series 5, 2020-on; current WF2 vehicle `nissan-y62-warrior-2025`
- Current Australian dealer price: AUD $36
- RRP: unknown / not asserted
- Normalized weight: 0.3 kg, from STEDI product specification
- Install time / PRO4X4 labour: unknown
- Required governed route part: `stedi-single-smart-harness`
- Visual state: `non-visual`; no layer or approved visual state

STEDI explicitly states that this vehicle-specific adaptor is exclusively compatible with STEDI Quick Fit harnesses because the harness electronics neutralise the switching used by Y62 Series 5. STEDI further warns that use of this adaptor with other generic harnesses will likely cause headlight-module failure. That warning is now a hard staff-review/prohibited-integration gate rather than a note.

Authoritative source:
- https://stediuk.com/products/stedi-nissan-patrol-y62-series-5-high-beam-adaptor

Australian current-price evidence:
- https://www.roofracksgalore.com.au/stedi-patrol-y62-series-5-high-beam-adapter-patrol-y62s5-adapter

### 2. STEDI Single Connector Plug & Play Smart Harness

- Governed ID: `stedi-single-smart-harness`
- SKU: `WIRQKFT-HIBEAM`
- Status: `confirmed`
- Current Australian dealer price: AUD $45
- RRP: unknown / not asserted
- Normalized weight: unknown
- Retailer-listed weight evidence: 0.63–1.0 kg conflict retained; no invented normalization
- Electrical rating: 12 V DC / 30 A wiring kit; 30 A fuse; 60 A relay specification; 25 A maximum load at 12 V
- Light output: one Deutsch DT waterproof connector
- Required governed route part: `stedi-y62s5-highbeam-adapter`
- Install time / PRO4X4 labour: unknown
- Visual state: `non-visual`; no layer or approved visual state

For the governed Y62 route, the manufacturer-supplied generic HB3/H4 piggyback adaptors are not used; the exact Y62 `PATROL-Y62S5-ADAPTER` is required instead.

Authoritative source:
- https://stediuk.com/collections/best-sellers/products/stedi-plug-and-play-wiring-harness-high-beam-driving-light-single-connector

Australian current-price evidence:
- https://www.roofracksgalore.com.au/stedi-single-connector-plug-play-smart-harness-high-beam-driving-light-wiring-wirqkft-hibeam

## Existing Offroad Animal light route tightened

The existing governed `ORA-ALO-S5D1-20` Offroad Animal 22-inch Slim LED record now references the confirmed vehicle-side route:

`PATROL-Y62S5-ADAPTER` → `WIRQKFT-HIBEAM` → light-side interface pending verification.

The vehicle-side trigger path is therefore no longer a generic unknown. However, the final light-side electrical bridge deliberately remains `engineering-light-interface-unproven`.

Offroad Animal specifies only `Deutsch waterproof` for `ORA-ALO-S5D1-20`; STEDI specifies `Deutsch DT waterproof` for `WIRQKFT-HIBEAM`. The available authoritative evidence does not prove the Offroad Animal connector's exact Deutsch family, gender, two-pin arrangement, pinout, or polarity. WF2 therefore does not infer plug compatibility from the shared `Deutsch` description.

The Offroad Animal supplied/generic harness must not be connected directly to `PATROL-Y62S5-ADAPTER`; STEDI's explicit headlight-module warning is preserved as a hard safety/fitment gate.

Offroad Animal source:
- https://offroadanimal.com.au/offroad-animal-22-slim-led-light-bar/

## Dependencies, conflicts and staff-review gates

Confirmed governed dependency chain:

- `oa-y62-22in-slim-lightbar` requires the governed STEDI vehicle-side route for this Series 5 high-beam trigger implementation.
- `stedi-y62s5-highbeam-adapter` requires `stedi-single-smart-harness`.
- `stedi-single-smart-harness` requires `stedi-y62s5-highbeam-adapter` for this Y62 Series 5 route.

Hard prohibited integration:

- Do not connect `PATROL-Y62S5-ADAPTER` directly to the Offroad Animal supplied/generic light harness or another generic high-beam harness.

Remaining engineering gate:

- Prove the exact `WIRQKFT-HIBEAM` Deutsch DT light-output interface against the connector on `ORA-ALO-S5D1-20`, including connector family, gender, pinout and polarity. If it differs, an explicitly approved adapter or documented/reviewed retermination path is required; no improvised direct connection is permitted.

Unknowns preserved:

- Manufacturer RRP for both new STEDI records.
- PRO4X4 install labour and timed allowance for both electrical support parts.
- Normalized Smart Harness product mass because current retailer listings conflict.
- Final STEDI-to-Offroad-Animal light connector compatibility.

## Visual-readiness governance

Both new records are support/electrical components with `visualisable:false`, `visual.status:non-visual`, `approved:false`, and no visual layer ID. The existing OA light remains `staff-review` visually. No image, render, layer, manifest entry, or visual approval was created in this push.

## Data and regression validation

- Targeted `wf2-y62-stedi-highbeam-route-alpha26.js`: PASS.
- Complete `npm test` Alpha regression chain: PASS.
- `npm run check`: PASS.
- JavaScript syntax: 100 / 100 files PASS.
- JSON parse validation: 9 / 9 files PASS.
- HTML/local-reference scan: 16 HTML files / 239 local references / 0 missing.
- Y62 catalogue: 22 records / 22 unique IDs / 22 unique SKUs / 0 duplicate IDs / 0 duplicate SKUs.
- Y62 evidence registry: 11 rows.
- Ranger catalogue unchanged: 65 records / 65 unique IDs / 65 unique SKUs.
- Cross-catalogue shared universal SKUs: 3; no brand/current-price identity conflicts introduced.
- New governed dependency references: all resolve.
- Legacy non-product constraint tokens (`factory-warrior-50mm-lift`, `custom-warrior-adaptation`, `supplier-excludes-warrior`) remain deliberate sentinel constraints and were not reclassified as product IDs.
- Y62 approved visual leakage: 0.
- Customer-facing file comparison against Push 22: no HTML/CSS/customer application files changed. Changes are confined to WF2 data/evidence/seed/package metadata and regression tests.

The three previously identified shared-universal SKU weight-normalization drifts between the locked Ranger and newer Y62 records remain outside this one-package push and have not been silently rewritten.

## Next dependency

Obtain authoritative connector evidence for the Offroad Animal `ORA-ALO-S5D1-20` light lead that proves whether its connector is the exact Deutsch DT family used by `WIRQKFT-HIBEAM`, including mating gender, two-pin pinout and polarity. An Offroad Animal/STEDI wiring drawing, connector part number, manufacturer pinout, or an exact approved adapter/retermination part would close the gate.

Until that evidence exists, the vehicle-side Y62 trigger route is confirmed, while the final Smart-Harness-to-light bridge remains engineering/staff-review and must not be auto-released to a quote or workshop fitment as plug-compatible.
