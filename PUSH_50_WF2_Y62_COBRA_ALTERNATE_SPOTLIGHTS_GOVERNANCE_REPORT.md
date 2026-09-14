# PRO4X4 Rig Builder — WF2 Push 24
## Y62 Cobra alternate driving-light options governance

Date: 2026-09-14  
WF2 revision: `0.26.23`  
Package scope: one WF2 package only — current Y62 Cobra alternate spotlight choices. No customer UX, render-manifest, camera-profile, or visual-asset changes.

## Result

The locked Next-Gen Ranger catalogue remains unchanged at **65 governed records**. The Y62 governed catalogue advances **22 → 24 records** and the Y62 manufacturer evidence registry advances **11 → 13 rows**.

New governed products:

1. **Offroad Animal Night Slapper 9-inch LED Driving Lights — pair**
   - SKU: `ORA-ALO-P-R-9-C31D1-AW`
   - Current manufacturer price: **AUD $795**
   - RRP: **unknown** — manufacturer MSRP field is blank; current price is not relabelled as RRP.
   - Manufacturer storefront weight: **3.00 kg**
   - Normalized `weightKg`: **unknown** — product is stated to be a pair, but manufacturer does not define whether the storefront weight is pair net mass, shipping mass, or another catalogue value.
   - Current Y62 Cobra applicability: **confirmed** from the exact current Cobra product configurator, which offers Night Slapper as a spot-light option.
   - Physical mounting position/bracket/top-hoop integration: **staff-review / engineering** — current Cobra PDP does not publish the exact mount geometry.
   - Electrical trigger/harness: **staff-review / engineering** — exact Series 5 two-light trigger and connector route is not source-resolved.
   - Manufacturer electrical values preserved as published: 9–30 V DC, 9 A ±0.9 A @13.2 V, 118.8 W ±11.88 W @13.2 V, 9508 lm ±950.8 lm @13.2 V, IP68/IP69K. The source does not clearly scope the current/power/lumen table as per-light vs pair, so WF2 does not derive harness sizing from it.
   - Included wording preserved: light pair, covers, wiring looms.

2. **Offroad Animal Butt Kicker 7-inch Round LED Driving Lights — pair**
   - SKU: `ORA-ALO-R5-C10D1`
   - Current manufacturer price: **AUD $415**
   - RRP: **unknown** — manufacturer MSRP field is blank.
   - Manufacturer storefront weight: **7.00 kg**
   - Normalized `weightKg`: **unknown** — no explicit pair/product net-mass semantic is published.
   - Current Y62 Cobra applicability: **confirmed** from the exact current Cobra configurator.
   - Product specification preserved: 105 W per light, 5800 lm per light, 9–36 V DC, combination beam, IP68/IP69K, small DT connector.
   - Supplied hardware preserved per light: light, wiring harness, bolt kit, stainless mounting bracket.
   - Dedicated 7-inch Rally Hoop candidate: SKU `TB-COM-RAL-ORA-2X7-ASM0`, **candidate only**. Manufacturer says this hoop houses only the Butt Kicker 7-inch lights and lists Nissan Patrol S5 2020-on, but the compatibility table uses historical parent-bar SKU `FB-NPT-S5-20-PR-ASM0` while the current Cobra is `FB-NPT-Y62-19-PR-ASM0`; the current Cobra configurator also does not offer this hoop. WF2 therefore does not auto-add it.
   - The historical Y62 hoop table says **Blocks Camera**. If engineering later approves that hoop on the current Cobra, camera relocation must be separately resolved before release.

## Dependency and conflict normalization

Both new spotlight records require the governed current Cobra bar `oa-y62-cobra-frontbar` / `FB-NPT-Y62-19-PR-ASM0` for this Y62 route.

The current Cobra product configurator exposes Night Slapper, Ass Kicker and Butt Kicker as alternate spot-light choices. WF2 now encodes the three spotlight choices as mutually exclusive within this governed Cobra route. The existing 9-inch Rally Hoop `TB-COM-RAL-ORA-2X9-ASM0` is also explicitly incompatible with the new Night Slapper and Butt Kicker records because the manufacturer describes that hoop as specific to the Ass Kicker 9-inch light geometry.

No unsupported conflict was added between the new spotlights and the separate 22-inch centre light-bar option; those are distinct option groups on the manufacturer Cobra configurator.

## Required fitting-parts and engineering gates

### Night Slapper

Confirmed required governed parent:
- `oa-y62-cobra-frontbar`

Still unknown / staff-review:
- exact lamp mounting position and bracket interface on current Cobra;
- exact top-hoop clearance with selected Cobra configuration;
- exact two-light Y62 Series 5 high-beam trigger/harness;
- exact lamp connector family/pinout/polarity;
- PRO4X4 install duration and labour.

The existing STEDI `WIRQKFT-HIBEAM` route is a one-output harness and is **not** automatically reused for this pair.

### Butt Kicker

Confirmed required governed parent:
- `oa-y62-cobra-frontbar`

Candidate only, not auto-required:
- `TB-COM-RAL-ORA-2X7-ASM0` — historical-parent-nomenclature/current-configurator-unconfirmed.

Still unknown / staff-review:
- whether the dedicated 7-inch Rally Hoop is authorised against current Cobra SKU `FB-NPT-Y62-19-PR-ASM0`;
- camera-relocation part/route if that hoop is used;
- exact two-light Y62 Series 5 high-beam trigger/harness;
- PRO4X4 install duration and labour.

## Prior blocker preservation

The previous Y62 22-inch Slim LED/STEDI interface remains unchanged. Current Offroad Animal material for the exact 22-inch light still does not provide enough authoritative detail to prove connector mating gender, pinout and polarity against the STEDI Deutsch-DT output. No certainty was inferred in this push.

## Visual-readiness metadata

Both new products are:
- `visualisable: false`
- `visual.status: staff-review`
- `visual.approved: false`
- no visual layer ID
- governed under `REFERENCE_BACKED_APPROVED_VISUALS_ONLY`

No render asset, render manifest, camera profile, canonical visual brief, customer-facing HTML/CSS, or customer application file changed.

## Validation

Targeted WF2 regression:
- `tests/wf2-y62-cobra-alternate-spotlights-alpha26.js` — **PASS**

Prior Y62 WF2 regression set:
- front protection — **PASS**
- window accessory panel — **PASS**
- Cobra Rally Hoop / Ass Kicker route — **PASS**
- Cobra Type A Stealth / 22-inch route — **PASS**
- STEDI high-beam trigger route — **PASS**

Full Alpha regression chain:
- `npm test` — **PASS** after catalogue-count expectations were synchronized to the 24-record Y62 seed.
- `npm run check` — **PASS**

Static/data checks:
- JavaScript syntax: **101/101 PASS**
- JSON parsing: **9/9 PASS**
- HTML files checked: **15**
- Local HTML references checked: **236**
- Missing local HTML references: **0**
- Y62 records: **24 / 24 unique IDs / 24 unique SKUs**
- Y62 evidence rows: **13**
- Ranger records: **65 / 65 unique IDs / 65 unique SKUs**
- New-package governed required/conflict references: **8 checked / 0 unresolved**
- Cross-catalogue shared universal SKUs: **3**
- Cross-catalogue shared-SKU brand identity conflicts: **0**
- Cross-catalogue shared-SKU current-price conflicts: **0**
- Approved Y62 visual leakage: **0**
- Seed catalogue synchronized: **24 records**, revision `SEED-Y62-WF2-0.26.23`

A project-wide generic reference scan also sees three pre-existing symbolic engineering/conflict tokens on unrelated legacy Y62 records (`factory-warrior-50mm-lift`, `custom-warrior-adaptation`, `supplier-excludes-warrior`). Those are not product IDs introduced or changed by this package and are preserved as existing engineering-state tokens rather than rewritten outside scope.

Baseline-diff guard against Push 23:
- changed files are confined to WF2 data/evidence, seed/package metadata, regression tests, and this report;
- customer UX files changed: **0**;
- visual assets/render manifests/camera profiles changed: **0**.

## Next dependency

Highest-value unresolved dependency from this package is authoritative manufacturer/dealer engineering evidence that explicitly maps the dedicated Butt Kicker 7-inch Rally Hoop `TB-COM-RAL-ORA-2X7-ASM0` to the **current Cobra `FB-NPT-Y62-19-PR-ASM0`**, including the correct camera-relocation requirement/part for that route. Until that mapping is proved, the hoop remains candidate-only.

In parallel, both alternate spotlight pairs still need a source-backed **Y62 Series 5 two-light high-beam trigger/harness route** before electrical fitment can be released without staff review. If the 7-inch hoop/current-Cobra mapping remains unavailable, WF2 should leave this gate intact and advance the next clean Y62 catalogue package rather than infer compatibility.
