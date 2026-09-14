# PUSH 41 — WF2 Ranger STEDI Type X EVO Route Governance

**Date:** 2026-09-14  
**Workstream:** WF2 — Catalogue + Fitment Data  
**Package:** Next-Gen Ranger Predator / STEDI Type X EVO route governance  
**Schema:** `0.26.13` → `0.26.14`  
**Scope discipline:** one WF2 package only; no customer UX changes; no visual asset creation or promotion.

## Outcome

Advanced the verified Next-Gen Ranger catalogue from **59 to 61 governed records** and the manufacturer/source evidence registry from **40 to 42 rows**.

The existing Scout roof-rack light-bar wind-deflector blocker was rechecked first. The exact Next-Gen Ranger Scout rack page still offers an optional wind deflector for a 42-inch light bar without exposing the option SKU. The separate Ranger/Raptor deflector PDP identifies `RR-FRA-PX-11-SCT-LBKIT`, but does not explicitly map that PX-coded component to the Next-Gen rack `RR-FRA-PU-22-SCT-ASM0`. That candidate remains reference-only and was **not promoted**.

The next exact Ranger subsystem was therefore advanced: the Predator-bar route for STEDI Type-X EVO 8.5-inch driving lights.

## New governed records

### 1. Offroad Animal Rally Hoop — STEDI Type X EVO 8.5

- ID: `oa-rally-hoop-stedi-evo-ranger`
- SKU: `TB-COM-RAL-STE-2XEVO-ASM0`
- RRP: **AUD $330**
- Manufacturer/storefront listed weight: **4 kg**; retained as normalized product weight because the direct manufacturer PDP identifies it as the product weight.
- PRO4X4 install price: **unknown / null**
- Manufacturer install duration: **unknown / null**
- Status: **engineering**
- Staff review: **required**
- Parent requirement: governed Next-Gen Ranger Predator bar `oa-predator`
- Visual-readiness: `staff-review`; no approved layer.

### Exact-vehicle applicability treatment

The current Offroad Animal **Ford Ranger category page** lists this hoop, but that page aggregates multiple Ranger families (RA Next Gen, Ranger Super Duty and PX) and therefore does not itself prove RA non-Raptor fitment. The direct hoop PDP fitment table explicitly lists PX Ranger, Raptor Gen 1 and **Raptor Gen 2 2022-on**, but omits Ranger RA non-Raptor.

Accordingly:

- broad Ranger category placement is preserved as evidence, not converted into exact RA certainty;
- exact Ranger RA non-Raptor applicability remains unresolved;
- the Raptor Gen 2 camera-relocation condition is **not copied** onto Ranger RA;
- the item cannot enter the confirmed Next-Gen Ranger slice until direct manufacturer evidence closes the exact fitment route.

### 2. STEDI Type-X EVO 8.5-inch LED Driving Lights — Pair

- ID: `stedi-type-x-evo-pair-ranger`
- SKU: `LEDTYPE-X-EVO`
- RRP: **AUD $858**
- Storefront listed weight: **7 kg**
- Normalized `weightKg`: **unknown / null** because the storefront field is not separately identified as installed/product-only mass.
- PRO4X4 install price: **unknown / null**
- Manufacturer install duration: **unknown / null**
- Status: **engineering**
- Staff review: **required**
- Governed parent requirement: `oa-rally-hoop-stedi-evo-ranger`
- Visual-readiness: `staff-review`; no approved layer.

### Mounting and electrical support gates

STEDI's manufacturer installation guidance says all three M10 bolts must be used to secure each Type-X EVO U-bracket base. That requirement is now persisted as fitting metadata.

Next-Gen Ranger high-beam triggering is retained as a separate staff-review support state. STEDI documents different high-beam pickup/adaptor routes for Next-Gen Ranger headlight Levels 1, 2 and 3. The exact vehicle headlight configuration therefore must be identified before selecting the high-beam adaptor/trigger route. No exact harness/adaptor SKU has been inferred into the governed dependency graph in this package.

## Source-governance decisions

- External manufacturer/storefront evidence is used for identity, SKU, RRP and published technical/fitting facts only.
- Broad category placement does not override a missing direct exact-vehicle fitment row.
- Raptor fitment conditions are not inherited by Ranger RA non-Raptor.
- The STEDI pair's 7 kg storefront field remains a raw listed value; normalized installed/product-only mass remains unknown.
- Install price and install duration remain null where no authoritative value exists.
- `REFERENCE_BACKED_APPROVED_VISUALS_ONLY` is unchanged.

## Validation

- Targeted `wf2-ranger-stedi-evo-route-alpha26.js`: **PASS**
- Updated historical Ranger support regression preventing false EVO promotion: **PASS**
- Full Alpha regression chain via `npm test`: **PASS**
- `npm run check`: **PASS**
- JavaScript syntax: **91 / 91 PASS**
- JSON parse: **9 / 9 PASS**
- HTML dependency validation: **16 HTML files / 239 local references / 0 missing**
- Ranger catalogue: **61 records / 61 unique IDs / 61 unique non-empty SKUs**
- Source evidence: **42 rows**
- Governed dependency / required-part / optional-part / mounting-route references: **0 broken**
- New approved visual states: **0**

## Scope verification

Compared with Push 14, changes are confined to WF2 Ranger catalogue/evidence data, package metadata, WF2/version regression assertions and the new targeted regression. No customer-facing HTML/CSS/app UX implementation or visual asset was modified by this WF2 package.

## Next dependency

The first blocker remains authoritative Offroad Animal evidence that either:

1. explicitly maps `TB-COM-RAL-STE-2XEVO-ASM0` to the **Ranger RA Next-Gen non-Raptor Predator bar** `FB-FRA-NG-22-PR-ASM0`, including any camera-relocation requirement; or
2. explicitly excludes that combination.

Until that evidence exists, this route remains engineering/staff-review. If the exact RA mapping is still unavailable on the next source pass, do not infer it: advance the next exact Ranger subsystem or begin the equivalent Y62 mapping phase now that the Ranger governed slice has reached 61 products.

## Primary source URLs

- https://offroadanimal.com.au/ford/ranger/
- https://offroadanimal.com.au/rally-hoop-to-suit-predator-bars-for-stedi-type-x-evo-8-5-inch/
- https://offroadanimal.com.au/type-x-evo-8-5-inch-led-driving-lights-pair/
- https://support.stedi.com.au/hc/en-us/articles/15100201192601-Type-X-EVO-8-5-and-7-LED-Driving-Lights
- https://support.stedi.com.au/hc/en-us/articles/18200648989977-Next-Gen-Ford-Ranger-Everest-High-Beam-Adaptor-Installation
- https://offroadanimalcomau-ymm.mybigcommerce.com/scout-roof-rack-to-suit-next-gen-ranger-and-raptor-2022-to-current/
- https://offroadanimal.com.au/scout-roof-rack-wind-deflector-to-suit-up-to-42in-light-bar-for-ranger-raptor/
