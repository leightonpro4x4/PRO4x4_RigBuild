# PUSH 45 — WF2 Y62 Offroad Animal Front-Protection Governance

**Workflow:** WF2 — Catalogue + Fitment Data  
**Package:** Y62 Warrior Offroad Animal Toro / Cobra + mandatory lower-bash route  
**Package revision:** 0.26.17 → 0.26.18  
**Ranger catalogue:** 65 governed records retained / unchanged  
**Y62 catalogue:** 11 → 14 governed records  
**Y62 source evidence registry:** new / 3 rows  
**Scope discipline:** WF2 data only. No customer UX code, customer interaction behaviour, production backend logic, or visual asset creation.

## Priority decision

The current dedicated Offroad Animal **Ford Ranger RA (Next Gen) 2022-on** category was rechecked before advancing this package. The source-resolvable exact Ranger SKUs visible in the current category slice are already represented in the 65-record governed Ranger catalogue from the recovered Alpha checkpoint. Rather than manufacture more Ranger certainty from generic/universal catalogue placement, this push moved to the next user-prioritised phase: **equivalent Y62 mappings**.

The first Y62 package selected is front protection because it is high-value, vehicle-specific, directly relevant to the MY25 Warrior baseline, and exposes a hard Warrior-only fitting dependency that must be represented correctly.

## Scope completed

### 1. Offroad Animal Toro Bull Bar — Y62 Series 5

- Governed ID: `oa-y62-toro-frontbar`
- Manufacturer SKU: `FB-NPT-Y62-19-TOR-ASM0`
- Current manufacturer price: **$3,990 AUD**
- Normalised RRP: **unknown / null** — the PDP displays `$3,990` as “Now” while MSRP is blank; no RRP label is inferred.
- Normalised installed/net-added weight: **unknown / null**
- Storefront-listed weight retained separately: **77 kg**
- Manufacturer install estimate: **5–6 hours**
- Manufacturer install difficulty: **5/10**
- PRO4X4 labour: **unknown / null**
- Vehicle route: Nissan Patrol Y62 Series 5/current; source states Series 5 Ti from MY19 and separately offers the Warrior replacement bashplate.
- Warrior required fitting part: `oa-y62-warrior-lower-bash`
- Hard front-bar conflicts: `slx-x1`, `oa-y62-cobra-frontbar`
- Staff review: **required**

Manufacturer source:  
https://offroadanimal.com.au/toro-bull-bar-nissan-patrol-y62-series-5-2020-current/

The manufacturer states `MY22 vehicles requires grille cut`, but does not define whether that means MY22 only or MY22 onward. The exact MY25 Warrior grille-cut instruction therefore remains a staff/fitting-instruction gate instead of being generalised.

### 2. Offroad Animal Cobra Bull Bar — Y62 Series 5

- Governed ID: `oa-y62-cobra-frontbar`
- Manufacturer SKU: `FB-NPT-Y62-19-PR-ASM0`
- Current manufacturer price: **$3,415 AUD**
- Normalised RRP: **unknown / null** — current “Now” price is verified, MSRP is blank.
- Normalised installed/net-added weight: **unknown / null**
- Storefront-listed weight retained separately: **65 kg**
- Manufacturer install estimate: **4 hours**
- Manufacturer install difficulty: **5/10**
- PRO4X4 labour: **unknown / null**
- Vehicle route: Nissan Patrol Y62 Series 5/current; source states Series 5 Ti from MY19 and separately offers the Warrior replacement bash plate.
- Warrior required fitting part: `oa-y62-warrior-lower-bash`
- Hard front-bar conflicts: `slx-x1`, `oa-y62-toro-frontbar`
- Staff review: **required**

Manufacturer source:  
https://offroadanimal.com.au/cobra-bull-bar-nissan-patrol-y62-series-5-2020-current/

The PDP exposes a Nissan camera-relocation option, but does not state that it is universally mandatory for a Warrior or expose the exact selectable option SKU in the page data used here. The camera-relocation path therefore remains `engineering` rather than being auto-added.

### 3. Y62 Lower Bash Plate Kit to suit Warrior

- Governed ID: `oa-y62-warrior-lower-bash`
- Manufacturer SKU: `FB-NPT-Y62-19-PR-ASM6`
- Current manufacturer price: **$420 AUD**
- Normalised RRP: **unknown / null** — current “Now” price is verified, MSRP is blank.
- Normalised installed/net-added weight: **unknown / null**
- Storefront-listed weight retained separately: **8 kg**
- Install duration: **unknown / null**
- PRO4X4 labour: **unknown / null**
- Construction: **3 mm steel**
- Manufacturer fitment statement: the kit is **required if the vehicle is a Warrior** and only fits Offroad Animal bars.
- Parent route: requires any one of `oa-y62-toro-frontbar` / `oa-y62-cobra-frontbar`
- Hard conflict: `slx-x1`
- Staff review: **required**

Manufacturer source:  
https://offroadanimal.com.au/y62-lower-bash-plate-kit-to-suit-warrior/

The lower-bash PDP uses the wording `Toro and Predator bars`, while the current Y62 second bar is sold as **Cobra**. The Cobra PDP independently offers the Y62 Warrior lower-bash option, so the route is represented, but the naming mismatch is deliberately retained as a staff-review gate rather than silently rewritten as certainty.

## Existing Y62 conflict normalisation

The existing selected SLX Extreme X-1 record `slx-x1` now carries `group: front-bar` and explicit conflicts against both new Offroad Animal front-bar alternatives. This prevents mutually exclusive front bars from coexisting in governed data without changing customer UX behaviour.

## Price / weight normalisation policy

For all three new records:

- The live manufacturer PDP exposes a current **“Now”** price and a blank **MSRP** field. `pricing.parts` stores the verified current manufacturer price, while `pricingMeta.rrpAud` stays `null`.
- Manufacturer storefront weight fields are preserved as `storefrontListedWeightKg`.
- `weightKg` remains `null` unless the source explicitly defines installed, product-only, or net-added mass. No payload figure is manufactured from an ambiguous storefront field.
- Published fitting-partner bundle prices are not converted into PRO4X4 labour pricing.

## Dependencies / engineering gates

The governed Warrior route is:

- `oa-y62-toro-frontbar` **or** `oa-y62-cobra-frontbar`
- plus mandatory `oa-y62-warrior-lower-bash`
- mutually exclusive with existing `slx-x1`

The following remain deliberately unresolved:

- exact MY25 interpretation of the manufacturer’s `MY22 vehicles requires grille cut` statement;
- exact Warrior camera-relocation requirement / SKU;
- Cobra vs legacy/generic `Predator` naming on the lower-bash PDP;
- PRO4X4 standalone labour/freight;
- installed/net-added weight for all three components.

## Visual-readiness metadata

No visual asset was created or promoted.

- Toro: `visualisable: false`, `visual.status: staff-review`, manufacturer reference available, zero approved layer.
- Cobra: `visualisable: false`, `visual.status: staff-review`, manufacturer reference available, zero approved layer.
- Warrior lower bash: `visualisable: false`, `visual.status: non-visual`, no customer render layer required for this package.

All new records explicitly retain `REFERENCE_BACKED_APPROVED_VISUALS_ONLY` governance.

## Backend catalogue consistency

The bootstrap Y62 catalogue seed was updated from 11 to 14 accessories so the runtime/backend catalogue and `data-y62.js` no longer disagree. The three legacy Alpha tests with a hard-coded `11` accessory baseline were updated to `14`; this is regression maintenance only, not a UX or behaviour change.

## Validation

All relevant validation is green after the package update:

- Targeted `wf2-y62-front-protection-alpha26.js`: **PASS**
- Full Alpha regression chain (`npm test`): **PASS**
- Backend syntax gate (`npm run check`): **PASS**
- JavaScript syntax: **96 / 96 valid**
- JSON parse validation: **9 / 9 valid**
- HTML/local-reference scan: **15 HTML files / 236 local references / 0 missing**
- Ranger catalogue retained: **65 unique IDs / 65 unique SKUs**
- Y62 catalogue: **14 unique IDs / 14 unique SKUs**
- Cross-catalogue SKU duplicates: **0**
- New Y62 source-evidence rows: **3**
- Broken new governed dependency references: **0**
- New approved Y62 visual states: **0**

## Files changed versus Push 18

WF2/data/regression files only:

- `data-y62.js`
- `y62-source-evidence.js` (new)
- `seed/bootstrap.seed.json`
- `package.json`
- `tests/wf2-y62-front-protection-alpha26.js` (new)
- `tests/smoke-alpha12.js`
- `tests/server-contract-alpha12.js`
- `tests/client-journey-alpha12.js`
- this report

No HTML, CSS, customer UX JavaScript, render assets, image files, or visual manifests were changed.

## Next dependency

The remaining dependency for this front-protection package is **authoritative manufacturer/fitting-instruction confirmation for the MY25 Warrior route**:

1. whether the `MY22 vehicles requires grille cut` statement applies to MY25 Warrior; and
2. explicit current naming/BOM confirmation that `FB-NPT-Y62-19-PR-ASM6` is the intended lower-bash support part for the current Y62 **Cobra** naming, not only legacy `Predator` wording.

Until those details are source-resolved, quote release remains staff-review even though the bar identities, Warrior lower-bash requirement, current manufacturer pricing and published install times are governed.

If those two details remain unavailable, the next clean source-resolvable WF2 package should be the **Y62 Scout Window Accessory Panel (`WP-NPT-Y62-13-XX-ASM0`)**, because its exact parent dependency on the existing Y62 Scout roof rack, load rating and install duration are manufacturer-published without requiring fitment inference.
