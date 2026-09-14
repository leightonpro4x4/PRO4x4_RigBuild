# PUSH 46 — WF2 Y62 Scout Window Accessory Panel Governance

**Workflow:** WF2 — Catalogue + Fitment Data  
**Package:** Y62 Scout Window Accessory Panel identity / dependency / load-governance route  
**Package revision:** 0.26.18 → 0.26.19  
**Ranger catalogue:** 65 governed records retained / unchanged  
**Y62 catalogue:** 14 → 15 governed records  
**Y62 source evidence registry:** 3 → 4 rows  
**Scope discipline:** WF2 data only. No customer UX changes, no customer interaction behaviour changes, no production visual assets created or promoted.

## Priority decision

The previous Y62 front-protection package left the next clean source-resolvable package as the **Offroad Animal Window Accessory Panel for Nissan Patrol Y62 (`WP-NPT-Y62-13-XX-ASM0`)**. It is vehicle-specific, has an explicit hard dependency on the already-governed Y62 Scout roof rack, and has current manufacturer fitting instructions exposing the fitting route and hardware. This package advances only that product route.

## Source-backed product identity

### Offroad Animal Window Accessory Panel — Nissan Patrol Y62 2013-on

- Governed ID: `oa-y62-window-panel`
- Live PDP SKU: `WP-NPT-Y62-13-XX-ASM0`
- Current manufacturer base price: **$635 AUD**
- Normalised RRP: **unknown / null** — the live PDP displays `$635` as “Now” while MSRP is blank.
- Vehicle applicability: **Nissan Patrol Y62 2013-on**, therefore applicable to the governed MY25 Warrior baseline.
- Live side options: **RH / LH / both**.
- Current fitting instruction header explicitly identifies **RH assembly SKU `WP-NPT-Y62-13-RH-ASM0`**.
- Authoritative LH assembly SKU: **not source-resolved / remains unknown**.
- Exact composite/bundle SKU and option-adjusted price for selecting **both** sides: **not source-resolved / remains unknown**.

Manufacturer PDP:  
https://offroadanimal.com.au/window-accessory-panel-to-suit-nissan-patrol-y62-2013-on/

Manufacturer fitting instruction Rev A (20/05/2026):  
https://offroadanimal.com.au/content/Y62%20Window%20Accessory%20Panel%20Fitting%20Instruction%20Rev.A.pdf

## Fitment dependency / conflicts

The manufacturer fitting instruction explicitly states that the Window Accessory Panel:

- **only works with** the Offroad Animal Scout Roof Rack for Y62;
- requires parent SKU **`RR-NPT-Y62-13-SCT-ASM0`** to be installed first; and
- is **not compatible with any other roof-rack variant**.

The governed record therefore has a hard required dependency on existing product ID `scout-rack` and an exclusive-parent rule tied to `RR-NPT-Y62-13-SCT-ASM0`. No generic rack compatibility is inferred.

There is no separate fitting-kit product SKU auto-added. The hardware route is included/reused as published by the manufacturer.

## Required / supplied fitting parts

The governed fitment route records the manufacturer-supplied hardware without manufacturing another catalogue product:

**Supplied with panel:**

- 1 x LH or RH panel
- 2 x 4.5-inch Sea Sucker vacuum suction cups
- 1 x small fastener kit
- 1 x side-specific bottle-opener plate
- 3 x M6x12 button-head cap screws
- 3 x M6 flat washers
- 3 x M6 flange nuts
- 2 x 1/4-inch x 0.5-inch UNC high-tensile zinc-plated hex bolts
- 2 x M6 mudguard washers

**Reused from the Scout rack:**

- 4 x M8x20 black button-head bolts from the second/third cross rails from the rear
- 4 x matching M8 black flat washers

The manufacturer instruction says to use the supplied hardware and not modify the product/fixings except where the instructions state otherwise.

## Install normalisation

- Manufacturer fitting difficulty: **1/10**
- Manufacturer fitting time: **10–15 minutes for the panel**
- Accessory mounting time: **extra / not included in the 10–15 minute figure**
- PRO4X4 labour price: **unknown / null**
- Freight: **unknown / quote item**

## Weight normalisation

The live PDP exposes a storefront `Weight: 4.00 KGS`, but does not identify that value as installed mass, net-added vehicle mass, or bare product mass. Consistent with existing WF2 governance:

- `weightKg`: **null / unknown**
- `storefrontListedWeightKg`: **4**

No payload impact is manufactured from the ambiguous storefront field.

## Load-rating conflict — preserved, not hidden

This package uncovered a direct current-source conflict:

- Live PDP: **rated for 25 kg per panel**.
- Rev A fitting instruction dated **20/05/2026**: **“do not exceed 20kg.”**

WF2 does not silently choose the higher figure. The record now carries:

- `loadGovernance.status: engineering-source-conflict`
- PDP claim: **25 kg / panel**
- fitting-instruction maximum: **20 kg**
- conservative operational/workshop ceiling: **20 kg pending manufacturer clarification**
- staff-review gate: **required before treating 25 kg as valid**

This preserves both pieces of evidence and prevents a customer/build rule from being generated from the less conservative value.

## Maintenance / operational fitting note

The current fitting instruction requires periodic checks that both vacuum suction cups remain locked to the window. If a suction cup repeatedly releases, the instruction requires the window to be re-cleaned, wetted and the cup resealed. This requirement is persisted as maintenance metadata rather than being omitted from fitment governance.

## Staff-review gates

Quote/workshop release retains review for:

1. exact **RH or LH** side selection;
2. authoritative **LH assembly SKU** — not inferred from the RH naming pattern;
3. the **25 kg PDP vs 20 kg fitting-instruction** load conflict;
4. exact price/SKU treatment if the customer selects **both** sides;
5. PRO4X4 labour and freight.

The fitment itself to MY25 Y62 + `RR-NPT-Y62-13-SCT-ASM0` is manufacturer-backed; the review gate exists to protect unresolved variant/load/commercial states, not because the parent fitment is guessed.

## Visual-readiness metadata

No visual asset was created or promoted.

The new record is persisted as:

- `visualisable: false`
- supported reference views: `side`, `rear34`
- `visual.status: staff-review`
- manufacturer reference available: **yes**
- approved layer: **none**
- approved customer visual state added by this package: **0**
- policy: `REFERENCE_BACKED_APPROVED_VISUALS_ONLY`

## Backend catalogue consistency

The bootstrap Y62 catalogue seed has been synchronised from **14 → 15** accessories so runtime/backend catalogue data remains consistent with `data-y62.js`. Existing count-based smoke/contract regression expectations were updated to the new governed catalogue size only; no customer UX code was altered.

## Validation

All relevant validation is green:

- Targeted `wf2-y62-window-panel-alpha26.js`: **PASS**
- Previous Y62 front-protection regression: **PASS**
- Full Alpha regression chain (`npm test`): **PASS**
- Backend syntax gate (`npm run check`): **PASS**
- JavaScript syntax: **97 / 97 valid**
- JSON parse validation: **9 / 9 valid**
- HTML/local-reference scan: **16 HTML files / 239 local references / 0 missing**
- Ranger catalogue retained: **65 unique IDs / 65 unique SKUs**
- Y62 catalogue: **15 unique IDs / 15 unique SKUs**
- Cross-catalogue SKU duplicates: **0**
- Y62 source-evidence rows: **4**
- New panel dependency references: **1 / 1 resolved (`scout-rack`)**
- New approved Y62 visual states: **0**

## Files changed versus Push 19

WF2/data/regression/package files only:

- `data-y62.js`
- `y62-source-evidence.js`
- `seed/bootstrap.seed.json`
- `package.json`
- `tests/wf2-y62-window-panel-alpha26.js` (new)
- `tests/wf2-y62-front-protection-alpha26.js` (current-catalogue regression count/evidence maintenance)
- `tests/smoke-alpha12.js` (catalogue count only)
- `tests/server-contract-alpha12.js` (catalogue count only)
- `tests/client-journey-alpha12.js` (catalogue count only)
- this report

No HTML, CSS, customer-facing application logic, render manifest, reference image or production visual asset was changed.

## Next dependency

The highest-value dependency remaining for this package is **manufacturer clarification of the load limit and variant identity**:

1. resolve whether **20 kg or 25 kg per panel** is the current governing maximum; and
2. obtain the authoritative **LH assembly SKU** plus exact SKU/price treatment for the **both-side** option.

Until that evidence is available, WF2 keeps the 20 kg conservative workshop ceiling, the LH/both variant SKU fields unresolved, and quote release under staff review rather than inferring symmetry from the verified RH assembly.
