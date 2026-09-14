# PRO4X4 Rig Builder — Alpha 26 — WF2 Push 31
## Next-Gen Ranger STEDI Type-X PRO Predator-route governance

### Scope
Advanced one WF2 package only: add the missing STEDI Type-X PRO light pair behind the already-governed Offroad Animal Type-X PRO Rally Hoop route for Ford Ranger RA Next Gen. No customer UX, HTML/CSS behaviour, render manifests, camera profiles, or visual assets were changed or created.

### Catalogue movement
- Ranger governed accessories: **72 → 73**
- Ranger source-evidence rows: **53 → 54**
- Y62 governed accessories: **26 unchanged**
- New governed SKU: **STEDI `LEDTYPE-X-PRO`**
- Ranger schema/evidence revision: **0.26.22**

## 1. New governed product identity
**ID:** `stedi-type-x-pro-pair-ranger`  
**SKU:** `LEDTYPE-X-PRO`  
**Product:** STEDI TYPE-X PRO 8.5-inch LED Driving Lights — pair  
**Current Australian retail/list price:** **$699 AUD**  
**Manufacturer RRP/MSRP:** **unknown / null**  
**Standalone PRO4X4 labour/time:** **unknown / null**

Current Australian retailer evidence independently lists the exact SKU at $699. That value is retained as current Australian retail/list pricing only; it is not promoted to manufacturer RRP without manufacturer evidence.

Primary product / pricing sources:
- https://stediuk.com/products/type-x-pro-led-driving-lights
- https://www.carracks.com.au/products/stedi-type-x-pro-lights-pair-ledtype-x-pro
- https://peak4x4.com.au/products/stedi-type-x-pro-led-driving-lights

## 2. Weight and technical normalization
STEDI publishes **2.860 kg each**. Because the governed catalogue item is explicitly a pair, WF2 normalizes product mass to **5.72 kg per pair** by transparent arithmetic; no shipping/storefront mass is substituted.

Source-backed specifications retained:
- 37 × Oslon High-Flux LEDs per lamp;
- 26,270 raw lumens per pair;
- 15,870 tested lumens per pair;
- 10.4 A @ 13.2 V each;
- normalized pair current **20.8 A @ 13.2 V**, arithmetic only;
- published power row **137 W**, with scope deliberately left unresolved because the source does not label it as each/pair;
- 1,334,025 cd;
- 1 lux at 1,155 m;
- IP68;
- 5700 K;
- 12/24 V compatibility;
- 2.860 kg per lamp.

Dimensions **215 W × 234 H × 109 D mm** are retained as current Australian retailer technical metadata for exact SKU `LEDTYPE-X-PRO`; the STEDI product page itself presents dimensions as an image rather than machine-readable text.

## 3. Exact Ranger physical route
Offroad Animal's current `TB-COM-RAL-STE-2XPRO-ASM0` product page states that the hoop houses **two STEDI Type-X PRO lights and only these lights**. Its exact fitment table maps:

- **Ford Ranger RA 2022-on**
- to Predator **`FB-FRA-NG-22-PR-ASM0`**
- and states the hoop is **very close to the grille** and **camera relocation is required from the OA kit**.

The governed dependency chain is therefore:

`LEDTYPE-X-PRO` → `oa-rally-hoop-stedi-pro-ranger` → `oa-predator` + `oa-camera-relocation-ranger`

The new light-pair record requires the governed Rally Hoop rather than duplicating the parent bar/camera dependencies; the hoop continues to own those exact route requirements.

Primary vehicle-fitment source:
- https://offroadanimal.com.au/rally-hoop-to-suit-predator-bars-for-stedi-type-x-pro/

## 4. Required fitting parts and installation gates
The STEDI product package is source-backed as including:
- 2 × Type-X PRO lights;
- 2 × blackout covers;
- grey and orange colour rings;
- Smart High Beam Wiring Harness with DTP-2 sealed connectors;
- H4 and HB3 high-beam adapter plugs;
- 60 A relay;
- fuse;
- switch;
- complete stainless-steel fastener kit;
- wiring/fitting instructions.

STEDI's installation support explicitly requires **all three M10 base bolts per U-bracket**. One- or two-bolt mounting is prohibited by the manufacturer due to vibration/bracket-failure risk. WF2 records this as a hard staff-review gate.

Installation support:
- https://support.stedi.com.au/hc/en-us/articles/360023907832-STEDI-Type-X-Pro-LED-Driving-Lights

## 5. Ranger electrical applicability
The pair ships with a STEDI Smart High Beam harness. The already-governed Next-Gen Ranger high-beam adaptor logic is applied conditionally:
- verified Headlight Level **1 or 3** → `stedi-ranger-highbeam-adapter-l13`;
- verified Headlight Level **2** → `stedi-ranger-highbeam-adapter-l2`.

The actual Ranger headlight level remains a mandatory staff gate before electrical release.

The exact standalone SKU of the Smart High Beam Wiring Harness bundled inside `LEDTYPE-X-PRO` remains **unknown**. WF2 explicitly does **not** equate it to separately governed `WIRQKFT-SMART` merely because the descriptions are similar. This prevents accidental duplicate charging or an unproven electrical substitution.

## 6. Conflicts
The dedicated Type-X PRO pair route is governed as mutually exclusive with alternative front spotlight pairs occupying the same primary spotlight choice:
- `stedi-type-x-evo-pair-ranger`;
- `oa-night-slapper-9-pair-ranger`;
- `oa-ass-kicker-9-pair-ranger`;
- `oa-butt-kicker-7-pair-ranger`.

No conflict is inferred against the centre light-bar route because existing manufacturer fitting bundles support light-bar + driving-light combinations.

## 7. Staff-review and visual-readiness state
Physical product/vehicle applicability is confirmed, but release still requires staff checks for:
- actual Ranger headlight level;
- corresponding L13 versus L2 adaptor selection;
- installation of all three M10 base bolts per lamp;
- final grille/camera clearance after bull-bar position is set;
- final fuse, switch and cable routing;
- standalone PRO4X4 labour/time.

Visual metadata is recorded only for future readiness:
- `visualisable: true`;
- `status: staff-review`;
- `approved: false`;
- `layerId: null`;
- `assetState: not-created`.

**No visual asset was generated or approved in this package.**

## 8. Unknown / engineering-state preservation
No unsupported certainty was introduced:
- manufacturer RRP remains null;
- standalone install time/labour remains null;
- bundled Smart Harness standalone SKU remains null;
- 137 W power scope remains explicitly unresolved as each vs pair;
- final workshop wiring/switch routing remains staff-review;
- no visual layer ID was invented.

## 9. Validation
- Focused Push 31 regression: **PASS**
- Full `npm test`: **PASS**
- `npm run check`: **PASS**
- JavaScript syntax: **108 / 108 valid**
- JSON parse: **9 / 9 valid**
- HTML/local-reference scan: **16 HTML files / 239 local references / 0 missing**
- Ranger accessory IDs: **73 unique / 73 records**
- Ranger SKUs: **73 unique / 73 records**
- Ranger evidence IDs: **54 unique / 54 rows**
- Ranger evidence SKUs: **54 unique / 54 rows**
- Y62 catalogue: **26 records unchanged**
- Ranger/Y62 shared universal SKUs: **8**, with **0 brand/current-price identity conflicts**
- Existing cross-catalogue normalized-weight drift retained outside this package: `ORA-ALO-S5D1-20` Ranger 2.0 kg vs Y62 1.7 kg
- New Type-X PRO governed dependency/electrical references: **0 dangling**
- Ranger approved visual leakage: **0**
- Baseline diff against Push 30: WF2 Ranger data/evidence, regression tests, package metadata and this report only; **0 HTML/CSS/render-manifest/camera-profile/asset changes**.

## Next dependency
The highest-value unresolved dependency for this newly governed route is an authoritative STEDI BOM/source that explicitly identifies the **standalone SKU of the Smart High Beam Wiring Harness bundled inside `LEDTYPE-X-PRO`**, or explicitly states that the bundled loom is a unique/non-separately-sold variant.

Until that is proven, WF2 must not deduplicate the included loom to `WIRQKFT-SMART`, add a second paid harness automatically, or claim exact standalone-harness interchangeability. If no stronger source becomes available, preserve that unknown and move to the next verified Ranger catalogue-expansion package.
