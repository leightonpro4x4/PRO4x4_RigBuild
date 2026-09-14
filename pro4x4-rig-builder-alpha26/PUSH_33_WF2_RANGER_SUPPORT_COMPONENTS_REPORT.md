# PRO4X4 Rig Builder — Alpha 26 — WF2 Ranger Catalogue Push 07

## Scope
WF2 only. This package expands the governed Next-Gen Ranger catalogue and manufacturer evidence. It does not modify customer UX, staff UX, backend runtime behaviour, project/quote lineage, or create/promote visual assets.

## Result
- Ranger governed catalogue: **34 → 39 records**.
- Manufacturer evidence registry: **15 → 20 rows**.
- New records: **5 confirmed manufacturer-backed records**.
- Duplicate product IDs: **0**.
- Duplicate SKUs: **0**.
- Broken governed dependency references: **0**.
- New products with invented labour price or install duration: **0**.
- New products with `visual.status=approved`: **0**.

## New governed records

### 1. Rally Hoop — Stedi Type X Pro — Next Gen Ranger
- ID: `oa-rally-hoop-stedi-pro-ranger`
- SKU: `TB-COM-RAL-STE-2XPRO-ASM0`
- RRP: **AUD $330**
- Weight: **4 kg**
- Applicability: manufacturer table explicitly lists Ford Ranger RA 2022-on on Predator `FB-FRA-NG-22-PR-ASM0`.
- Required governed parts: `oa-predator` + `oa-camera-relocation-ranger`.
- Preserved manufacturer condition: hoop is very close to the grille; camera relocation required.
- Install duration: **unknown / null**.
- Labour price: **unknown / null**.
- Visual metadata: `priced-only`; no approved asset created.

### 2. Rally Hoop — Offroad Animal 9-inch Arse Kicker — Next Gen Ranger
- ID: `oa-rally-hoop-9in-ranger`
- SKU: `TB-COM-RAL-ORA-2X9-ASM0`
- RRP: **AUD $330**
- Weight: **4 kg**
- Applicability: manufacturer table explicitly lists Ford Ranger RA 2022-on on Predator `FB-FRA-NG-22-PR-ASM0`.
- Required governed parts: `oa-predator` + `oa-camera-relocation-ranger`.
- Install duration / labour price remain unknown rather than inferred.
- Visual metadata remains `priced-only`.

### 3. Rally Hoop — Offroad Animal Butt Kicker 7-inch — Next Gen Ranger
- ID: `oa-rally-hoop-7in-ranger`
- SKU: `TB-COM-RAL-ORA-2X7-ASM0`
- RRP: **AUD $315**
- Weight: **8 kg**
- Applicability: manufacturer table explicitly lists Ford Ranger RA 2022-on on Predator `FB-FRA-NG-22-PR-ASM0`.
- Required governed parts: `oa-predator` + `oa-camera-relocation-ranger`.
- Install duration / labour price remain unknown rather than inferred.
- Visual metadata remains `priced-only`.

### 4. Offroad Animal 22-inch Slim LED Light Bar — Ranger support mapping
- ID: `oa-22in-slim-lightbar-ranger`
- SKU: `ORA-ALO-S5D1-20`
- RRP: **AUD $200**
- Shipping/catalogue weight: **2 kg**
- Manufacturer states it fits inside Offroad Animal bull bars/top hoops; current Next-Gen Ranger Predator and Toro product pages offer/recommend this 22-inch light bar.
- Governed applicability is deliberately constrained to **Predator OR Toro** via `fitment.anyOfRequiredParts`; no stand-alone Ranger fitment is inferred.
- Install duration / labour price remain unknown.
- Visual metadata remains `priced-only`.

### 5. Deep Dish Floor Mats — Next Gen Ranger MY22+
- ID: `oa-deep-dish-floor-mats-ranger`
- SKU: `FM-FRA-NG-22`
- RRP: **AUD $250**
- Weight: **5 kg**
- Exact manufacturer model-specific product; vehicle-specific retention clips and precision moulded fit are stated by the manufacturer.
- No dependencies or conflicts required.
- Install duration / labour price remain unknown.
- Exterior rig visualisation is explicitly disabled (`visualisable=false`).

## Uncertainty preserved
`TB-COM-RAL-STE-2XEVO-ASM0` (Stedi Type X EVO 8.5-inch Rally Hoop) was **not** admitted to the confirmed Next-Gen Ranger slice. It appears in Ranger category navigation, but the current product-page fitment table does not explicitly list Ford Ranger RA 2022-on. Category placement alone therefore does not override the missing exact fitment row.

## Data / schema changes
- `data-ranger.js`: schema `0.26.5 → 0.26.6`; 5 records appended.
- `ranger-source-evidence.js`: schema `0.26.5 → 0.26.6`; 5 manufacturer evidence rows appended.
- `package.json`: version `0.26.6`; full regression now includes the new WF2 support-component gate.
- Historical Alpha 26 regression version allow-lists were extended to accept `0.26.6`; their original behavioural assertions were not weakened.

## Verification
Targeted gates:
- `node tests/wf2-ranger-catalogue-alpha26.js` — PASS.
- `node tests/wf2-ranger-support-components-alpha26.js` — PASS.

Full chain:
- `npm test` — PASS, Alpha 12 through current Alpha 26 WF2 tests.
- `npm run check` — PASS.
- JavaScript syntax validation — PASS across 83 JS files.
- JSON parse validation — PASS across 9 JSON files.
- Package ZIP integrity — PASS.

The new targeted gate verifies exact SKU/RRP/weight, manufacturer evidence presence, hard/OR dependency integrity, unknown install preservation, no duplicate ID/SKU, no broken dependency target, and no WF2-approved visual state. It also asserts that the unsupported Type X EVO Ranger inference remains absent.

## Source register
- Stedi Type X Pro Rally Hoop: https://offroadanimal.com.au/rally-hoop-to-suit-predator-bars-for-stedi-type-x-pro/
- OA 9-inch Rally Hoop: https://offroadanimal.com.au/rally-hoop-to-suit-predator-bars-to-suit-offroad-animal-9-inch-arse-kicker-lights/
- OA 7-inch Butt Kicker Rally Hoop: https://offroadanimal.com.au/rally-hoop-to-suit-offroad-animal-butt-kicker-7inch-driving-lights/
- OA 22-inch Slim LED Light Bar: https://offroadanimal.com.au/offroad-animal-22-slim-led-light-bar/
- Next-Gen Ranger Predator: https://offroadanimal.com.au/predator-bull-bar-ford-ranger-next-gen-ra-2022-on/
- Next-Gen Ranger Toro: https://offroadanimal.com.au/toro-bull-bar-for-ford-ranger-next-gen-ra-2022-on/
- Next-Gen Ranger floor mats: https://offroadanimal.com.au/deep-dish-floor-matts-to-suit-next-gen-ranger-my22/
- Type X EVO 8.5 Rally Hoop (held out): https://offroadanimal.com.au/rally-hoop-to-suit-predator-bars-for-stedi-type-x-evo-8-5-inch/

## Next WF2 dependency
Continue Ranger-first source verification into the next high-value tub/rack and support-component slice. The Scout tub-platform rack family is a likely next candidate, but Ranger brace/mounting requirements must be captured as governed fitting-part or staff-review state before any record can be marked confirmed. After the Ranger verified slice is materially broader, move the same evidence model into equivalent Y62 mappings.
