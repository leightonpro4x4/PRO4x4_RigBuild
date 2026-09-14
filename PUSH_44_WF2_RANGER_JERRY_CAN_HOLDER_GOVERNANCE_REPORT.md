# PUSH 44 — WF2 Ranger Dual Jerry-Can Holder Governance

**Workflow:** WF2 — Catalogue + Fitment Data  
**Package:** Next-Gen Ranger dual jerry-can holder identity + mounting-route governance  
**Schema:** 0.26.16 → 0.26.17  
**Catalogue:** 63 → 65 governed records  
**Evidence registry:** 44 → 46 rows  
**Scope discipline:** WF2 data only. No customer UX, production interaction behaviour, or visual asset creation.

## Scope completed

Advanced one Ranger catalogue package only: the two Offroad Animal dual jerry-can holder orientations currently merchandised in the manufacturer’s dedicated **Ford Ranger RA (Next Gen) 2022-on** collection.

### 1. Dual Jerry Can Holder — Horizontal Sit

- Governed ID: `oa-dual-jerry-holder-horizontal-ranger`
- Manufacturer SKU: `JC-COM-DBL-LGE-ASM0`
- Current manufacturer price: **$265 AUD**
- Normalised RRP: **unknown / null** — the current Offroad Animal PDP and Ranger collection show `$265` under “Now” while the MSRP field is blank, so this push does not relabel that value as an explicit manufacturer RRP.
- Normalised installed/product-only weight: **unknown / null**
- Storefront-listed weight retained separately: **3.00 kg**
- Install price: **unknown / null**
- Install duration: **unknown / null**
- Construction: **3 mm aluminium**
- External dimensions: **512 × 390 × 180 mm**
- Internal footprint: **505 × 383 mm**
- Capacity/orientation: **dual can / horizontal**

Manufacturer source:  
https://offroadanimal.com.au/dual-jerry-can-holder-horizontal-sit/

### 2. Dual Jerry Can Holder — Upright Sit

- Governed ID: `oa-dual-jerry-holder-upright-ranger`
- Manufacturer SKU: `JC-COM-DBL-STD-ASM0`
- Current manufacturer price: **$240 AUD**
- Normalised RRP: **unknown / null** — the current PDP and Ranger collection show `$240` under “Now” with blank MSRP, so the data preserves the current price without inventing an RRP label.
- Normalised installed/product-only weight: **unknown / null**
- Storefront-listed weight retained separately: **3.00 kg**
- Install price: **unknown / null**
- Install duration: **unknown / null**
- Construction: **3 mm aluminium**
- External dimensions: **375 × 390 × 180 mm**
- Internal footprint: **369 × 383 mm**
- Capacity/orientation: **dual can / upright**

Manufacturer source:  
https://offroadanimal.com.au/dual-jerry-can-holder-upright-sit/

Vehicle-category evidence for both SKUs:  
https://offroadanimal.com.au/ford/ranger/ra-ranger-next-gen-2022-on/

## Vehicle applicability / fitment governance

Both exact SKUs are currently listed by Offroad Animal inside its dedicated **Ranger RA (Next Gen) 2022-on** collection, so the Ranger merchandising/applicability relationship is source-backed. The direct product pages, however, do **not** publish a Ranger-specific mounting surface, fitting instruction, hardware SKU, reinforcement requirement or install duration.

Accordingly, both records remain:

- `status: engineering`
- `fitment.reviewRequired: true`
- `fitment.source: manufacturer-exact-vehicle-category-only`
- no inferred `requires` parent
- no inferred rack/tub/roller-shutter/toolbox dependency
- no invented mounting fastener SKU
- no invented install charge or install hours

The required staff gate is physical installation review: confirm the selected mounting surface, fastener method, substrate/reinforcement capacity and clearance with the cans loaded before quote release.

## Weight normalisation decision

The direct Offroad Animal PDP header exposes **3.00 KGS** for each product but does not identify that field as installed mass, bare-product mass or shipping/storefront weight. To avoid repeating the ambiguity already encountered on other Offroad Animal PDPs, WF2 now stores:

- `weightKg: null`
- `storefrontListedWeightKg: 3`

No 3 kg installed-weight assertion is made.

## Dependencies and conflicts

No exact mandatory governed parent or fitting component is published by the sources used in this package. `requires` and `fitment.requiredParts` therefore remain empty. This is intentional: category placement alone does not prove that either holder must be mounted to the Scout rack, GOAT rack, Nice Rack, Tub Rack Base, roller shutter or bare tub.

No hard product conflict is asserted. Spatial/configuration conflict checking remains a staff responsibility until a manufacturer-backed physical mounting route is identified.

## Visual-readiness metadata

Both records have manufacturer reference imagery available, but **vehicle placement is unresolved**. They are therefore stored as:

- `visualisable: false`
- `visual.status: staff-review`
- `visual.fitmentConfidence: engineering`
- no supported vehicle view
- no layer ID
- zero approved visual state

No image or render asset was created or promoted.

## Validation

All relevant validation is green after the package update:

- Targeted `wf2-ranger-jerry-can-holder-alpha26.js`: **PASS**
- Full Alpha regression chain (`npm test`): **PASS**
- Backend syntax gate (`npm run check`): **PASS**
- JavaScript syntax: **94 / 94 valid**
- JSON parse validation: **9 / 9 valid**
- HTML/local-reference scan: **15 HTML files / 236 local references / 0 missing**
- Ranger catalogue: **65 unique IDs / 65 unique non-empty SKUs**
- Source evidence: **46 rows**
- Broken governed dependency references: **0**
- Approved Ranger visual leakage: **0**

## Next dependency

The blocking dependency for this package is **authoritative Offroad Animal mounting evidence** for `JC-COM-DBL-LGE-ASM0` and `JC-COM-DBL-STD-ASM0`: an installation sheet, BOM, mounting-hole/fastener specification, or explicit supported parent/mounting surface for the Next-Gen Ranger route. Until that exists, both products remain engineering/staff-review rather than being attached automatically to any rack or tub configuration.

If that evidence remains unavailable, WF2 should leave these gates intact and move to the next source-resolvable exact Ranger subsystem; Y62 expansion remains next after the verified Ranger catalogue expansion queue is exhausted.
