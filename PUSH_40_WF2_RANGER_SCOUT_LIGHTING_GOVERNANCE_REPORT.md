# PRO4X4 Rig Builder — WF2 Ranger Scout Lighting Governance — Push 40 / WF2 Push 14

Date: 2026-09-14 (Australia/Adelaide)
Lane: WF2 — Catalogue + Fitment Data
Scope: one package only — Next-Gen Ranger Scout 42-inch lighting identity + support-part governance

## Outcome

- Schema/package version: **0.26.12 → 0.26.13**
- Governed Next-Gen Ranger records: **57 → 59**
- Source-evidence rows: **38 → 40**
- Customer UX changed: **no**
- Visual assets created/promoted: **no**
- `REFERENCE_BACKED_APPROVED_VISUALS_ONLY`: **preserved**
- New customer-approved visual states: **0**

## 1. Highest-priority unresolved Scout lighting route advanced without guessing the wind-deflector fitment

The exact Next-Gen Ranger Scout rack manufacturer PDP currently exposes three relevant selectable options:

- Light Bar wind deflector
- Offroad Animal Slim 42 inch LED light Bar
- Offroad Animal 42 inch Double Row LED light Bar

Source:
https://offroadanimal.com.au/scout-roof-rack-to-suit-next-gen-ranger-super-duty-and-raptor-2022-to-current/

The two light-bar identities are now resolved and governed. The wind-deflector identity remains unresolved because the exact Next-Gen Scout PDP still does not expose its SKU.

A live manufacturer wind-deflector PDP does expose **`RR-FRA-PX-11-SCT-LBKIT`**, AUD **$210**, manufacturer-listed **3 kg**, titled for Ranger/Raptor. However, the SKU retains the PX-11 family identifier and the PDP does not explicitly state Next-Gen 2022-current applicability or the `RR-FRA-PU-22-SCT-ASM0` interface. WF2 therefore records this SKU only as a **reference-only candidate** and does not promote it as a Next-Gen required fitting part.

Candidate source:
https://offroadanimal.com.au/scout-roof-rack-wind-deflector-to-suit-up-to-42in-light-bar-for-ranger-raptor/

## 2. Slim 42-inch light bar added with normalized manufacturer data

New governed record:

- ID: `oa-slim-42-lightbar-scout-ranger`
- SKU: `ORA-ALO-S5D1-40`
- RRP: **AUD $280**
- Product/specification mass: **2.7 kg**
- Storefront header/listing weight retained separately: **4.0 kg**
- Power: **200 W**
- Current draw: **14.4 A @ 13.2 V**
- Raw output: **19,040 lm**
- Effective output: **9,406 lm**
- 1-lux beam distance: **610 m**
- Body dimensions: **1065 × 46 × 49 mm**
- IP rating: **IP68 / IP69K**
- PRO4X4 labour price: **unknown / quote-priced**
- Manufacturer install duration: **unknown**
- Catalogue state: **engineering / staff-review**

The product identity is exact: the Next-Gen Ranger Scout rack PDP exposes this named option and the direct manufacturer light-bar PDP supplies the SKU/RRP/specification values.

Direct source:
https://offroadanimal.com.au/offroad-animal-slim-42-led-light-bar/

## 3. Double-row 42-inch light bar added, preserving weight uncertainty

New governed record:

- ID: `oa-double-42-lightbar-scout-ranger`
- SKU: `ORA-ALO-D6D1-40`
- RRP: **AUD $440**
- Manufacturer storefront-listed weight: **6.0 kg**
- Normalized `weightKg`: **null / unknown**
- Power: **400 W**
- Raw output: **38,080 lm**
- Voltage: **9–36 V**
- Colour temperature: **6500 K**
- IP rating: **IP68 / IP69K**
- PRO4X4 labour price: **unknown / quote-priced**
- Manufacturer install duration: **unknown**
- Catalogue state: **engineering / staff-review**

The 6.0 kg value is retained separately rather than asserted as product-only/installed mass because the current direct PDP exposes it as the page-level product weight but does not publish a separate mass value inside the technical specification table. No third-party mass was used to fill the gap.

Direct source:
https://offroadanimal.com.au/offroad-animal-42-double-row-led-light-bar/

## 4. Exact Ranger applicability and support dependency behaviour

Both new light bars now:

- require the governed `oa-scout-rack-ranger` parent,
- are exposed in that rack's governed optional-parts list because the exact Next-Gen Scout PDP offers them,
- remain `reviewRequired:true`,
- carry `blockedByUnresolvedSupportPart:true`,
- require a `light-bar-wind-deflector` support role whose exact SKU is deliberately `null`,
- explicitly prohibit silently substituting `RR-FRA-PX-11-SCT-LBKIT`,
- retain no inferred install time or PRO4X4 labour price.

The general Ford Ranger LED-light category independently lists both SKUs, but this is supporting identity/category evidence only; the exact Scout option is the stronger vehicle/rack applicability evidence.

Supporting manufacturer category:
https://offroadanimal.com.au/led-lights/led-light-bars/ford-ranger/

## 5. Visual-readiness governance

Both records are metadata-only additions:

- `visualisable:true`
- supported views: `front34`, `side`
- `visualLayerRequired:true`
- visual state: **`staff-review`**
- fitment confidence: **`engineering`**
- layer family: `roof-rack-lighting`

No render/image asset was created, no visual was set to `approved`, and no unsupported light-bar/wind-deflector geometry can enter customer production.

## 6. Verification

Targeted test added:
`tests/wf2-ranger-scout-lighting-alpha26.js`

Verified:

- schema `0.26.13`
- **59** governed Ranger records
- **40** source-evidence rows
- **59 unique IDs**
- **59 unique non-empty SKUs**
- zero broken governed `requires`, `requiredParts`, `anyOfRequiredParts`, `optionalParts`, mounting-route, support-candidate or alternative-part references
- exact Slim 42 SKU/RRP/spec weight normalization
- Double Row 42 SKU/RRP with page-level weight preserved separately and normalized mass left unknown
- exact Scout parent relationship for both new records
- exact wind-deflector SKU remains unresolved and staff-review
- legacy `RR-FRA-PX-11-SCT-LBKIT` is not present as a governed confirmed Next-Gen catalogue record
- both new visual states remain `staff-review`, never `approved`

Regression/package checks:

- full `npm test` Alpha regression chain: **PASS**
- `npm run check`: **PASS**
- all **90 JavaScript files**: syntax-valid
- all **9 JSON files**: parse-valid
- **16 HTML files / 239 local references**: zero missing references
- ZIP integrity: **PASS**

## 7. Scope integrity

Compared with WF2 Push 13, changes are limited to:

- `data-ranger.js`
- `ranger-source-evidence.js`
- `package.json`
- version/count-compatible WF2 regression assertions and Alpha schema allow-lists
- the new targeted WF2 lighting test
- this report

No customer UX HTML/CSS/application flow, server production behaviour, Y62 data, or image/render assets were changed.

## Next WF2 dependency

The remaining highest-priority Scout lighting dependency is still authoritative manufacturer proof of the exact Next-Gen Ranger light-bar wind-deflector **SKU/interface**. Until Offroad Animal explicitly maps a SKU to `RR-FRA-PU-22-SCT-ASM0` / Ranger 2022-current, the two governed 42-inch lights remain staff-review for roof-rack installation and `RR-FRA-PX-11-SCT-LBKIT` remains reference-only.

If that exact mapping remains unavailable on the next pass, WF2 should leave this route blocked and expand the next exact Next-Gen Ranger subsystem rather than infer compatibility; equivalent Y62 mappings remain behind the Ranger expansion gate.
