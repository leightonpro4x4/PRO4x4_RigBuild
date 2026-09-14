# PRO4X4 Rig Builder — WF2 Ranger Scout Roof Rack Support — Push 39 / WF2 Push 13

Date: 2026-09-14 (Australia/Adelaide)
Lane: WF2 — Catalogue + Fitment Data
Scope: one package only — Next-Gen Ranger Scout roof-rack normalization and direct attachment governance

## Outcome

- Schema/package version: **0.26.11 → 0.26.12**
- Governed Next-Gen Ranger records: **53 → 57**
- Source-evidence rows: **34 → 38**
- Customer UX changed: **no**
- Visual assets created/promoted: **no**
- `REFERENCE_BACKED_APPROVED_VISUALS_ONLY`: **preserved**
- New customer-approved visual states: **0**

## 1. Existing Scout rack normalized

Updated `oa-scout-rack-ranger` from the current direct manufacturer PDP rather than the older category-only record.

- Product: Offroad Animal Scout Roof Rack — Next Gen Ranger / Raptor / Ranger Super Duty 2022-current
- SKU: `RR-FRA-PU-22-SCT-ASM0`
- RRP: **AUD $1,520**
- Normalized rack mass: **15 kg** from the manufacturer feature specification
- Storefront header/listing weight retained separately: **16 kg** rather than allowing the conflicting storefront value to overwrite the product mass
- Manufacturer fitting time: **4 hours**
- Fitting difficulty: **5/10**
- Dimensions: **1210 mm W × 1230 mm L × 90 mm max height above roof surface**
- Load ratings: **95 kg on-road dynamic / 63 kg off-road dynamic / 190 kg static**
- Fitment: all dual-cab Ford Ranger and Raptor Ranger 2022-current, including Ranger Super Duty
- Installation remains PRO4X4 quote-priced (`install: null`); no labour dollar value was inferred
- Roof install remains no-drill into the roof; headliner removal is retained as an installation condition

Primary manufacturer source:
https://offroadanimal.com.au/scout-roof-rack-to-suit-next-gen-ranger-super-duty-and-raptor-2022-to-current/

## 2. Direct exact Scout options added as confirmed governed records

### Roof Rack Eye Bolt Kit

- ID: `oa-roof-rack-eye-bolt-kit-ranger`
- SKU: `RR-EBK-4-ASM0`
- RRP: **AUD $25**
- Parent dependency: `oa-scout-rack-ranger`
- State: **confirmed**
- Exact Next-Gen Scout PDP exposes the Eye Bolt Kit as a selectable option
- Eye Bolt PDP says the M8 kit fits any Offroad Animal roof rack
- Installed/product mass remains **unknown**; storefront-listed 0.50 kg is retained separately and not promoted to `weightKg`
- Install duration remains **unknown**
- Non-visual support hardware: `visualisable:false`, no customer visual layer

Source:
https://offroadanimal.com.au/roof-rack-eye-bolt-kit/

### Clampit Rubber Holder Quick Fist Style — Pair

- ID: `clampit-quick-fist-scout-ranger`
- SKU: `JED 25-57`
- RRP: **AUD $25**
- Parent dependency: `oa-scout-rack-ranger`
- State: **confirmed**
- Exact Next-Gen Scout PDP exposes the Clampit as a selectable option
- Offroad Animal states it is suitable for the side or top of Scout racks
- 25–57 mm object diameter and up-to-10 kg safe working load per clamp retained as source-backed conditions
- Installed/product mass remains **unknown**; storefront-listed 0.25 kg is retained separately
- Install duration remains **unknown**
- Non-visual support hardware: `visualisable:false`

Source:
https://offroadanimal.com.au/clampit-rubber-holder-quick-fist-style-pair/

## 3. Ford Ranger roof-rack accessories governed conservatively

### Awning Mount Roof Rack

- ID: `oa-awning-mount-scout-ranger`
- SKU: `RR-AM-COM-ASM0`
- RRP: **AUD $85**
- Parent dependency: `oa-scout-rack-ranger`
- Manufacturer install: **20 min**, difficulty **1/10**
- State: **engineering / staff-review**
- Manufacturer explicitly warns the bracket does **not** fit every Scout roof rack without potentially drilling extra side-rail holes
- Manufacturer limits this bracket to **90-degree awnings**
- No exact Next-Gen Scout side-rail hole-alignment claim was inferred
- Storefront-listed 0.70 kg retained separately; installed/product mass remains unknown
- Quick Connect is linked as the governed alternative for 180/270-degree awnings

Source:
https://offroadanimal.com.au/awning-mount-roof-rack/

### Awning Quick Connect Brackets

- ID: `oa-awning-quick-connect-scout-ranger`
- SKU: `RR-AMQ-MED-ASM0`
- RRP: **AUD $295**
- Parent dependency: `oa-scout-rack-ranger`
- Manufacturer install: **0.5–1.0 h**, difficulty **2/10**
- Manufacturer states suitability for awnings up to **25 kg**, including 180/270-degree styles
- State: **engineering / staff-review**
- The product is listed in the Ford Ranger roof-rack range, but its direct PDP does not explicitly confirm the exact Next-Gen Scout side-rail interface
- Storefront-listed 4.0 kg retained separately; installed/product mass remains unknown

Sources:
https://offroadanimal.com.au/awning-quick-connect-brackets/
https://offroadanimal.com.au/roof-racks/ford-ranger/

## 4. Unknowns deliberately preserved

The exact Next-Gen Scout PDP exposes a **Light Bar wind deflector** and single/double-row **42-inch light-bar** options, but does not expose the exact wind-deflector SKU in the selectable option data used here. WF2 therefore records both as `engineering` unresolved accessory mappings.

No legacy Ranger/Raptor wind-deflector SKU has been promoted to Next-Gen fitment by inference. The 42-inch rack-light path is also held until that exact deflector mapping is resolved.

## 5. Dependency / visual-readiness behaviour

- Eye Bolt and Clampit require the confirmed Scout rack and are confirmed support accessories.
- Traditional Awning Mount and Quick Connect require the Scout rack but remain staff-review because exact Next-Gen interface evidence is incomplete.
- No added support component is customer-visual output.
- Existing Scout rack remains `priced-only` visually; it was not promoted to an approved visual asset.
- New records contain no `approved` visual state.

## 6. Verification

Targeted test added:
`tests/wf2-ranger-scout-roof-rack-alpha26.js`

Verified:
- schema `0.26.12`
- 57 governed Ranger records
- 38 source-evidence rows
- 57 unique IDs
- 57 unique non-empty SKUs
- zero broken `requires`, `requiredParts`, `anyOfRequiredParts`, `optionalParts`, mounting-route, support-candidate or alternative-part references
- exact Scout SKU/RRP/weight/install normalization
- Eye Bolt and Clampit confirmed-parent dependencies
- Awning Mount and Quick Connect staff-review states
- unresolved light-bar mappings remain engineering
- zero approved visual states in Ranger catalogue

Regression / package checks:
- full `npm test` Alpha regression chain: **PASS**
- `npm run check`: **PASS**
- all **89 JavaScript files**: syntax-valid
- all **9 JSON files**: parse-valid
- **16 HTML files / 239 local references**: zero missing references
- ZIP integrity: **PASS**

## 7. Scope integrity

Compared with WF2 Push 12, only WF2 catalogue/evidence, schema/version-compatible regression tests, package metadata, the new targeted WF2 test, and this report changed. No customer UX HTML/CSS/application-flow changes and no render/image assets were introduced.

## Next WF2 dependency

Highest-priority remaining Ranger roof-rack dependency is to resolve the exact Next-Gen **light-bar wind-deflector SKU/interface** and then govern the two manufacturer-offered 42-inch light bars against that exact support part. If authoritative exact mapping is still unavailable, those options stay engineering and WF2 should move to the next exact Ranger accessory slice rather than infer compatibility. Equivalent Y62 catalogue mapping remains behind the Ranger expansion gate.
