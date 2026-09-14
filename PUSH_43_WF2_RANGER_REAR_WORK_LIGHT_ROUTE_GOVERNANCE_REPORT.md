# PUSH 43 — WF2 Ranger Rear Work-Light Route Governance

**Date:** 2026-09-14  
**Workflow:** WF2 — Catalogue + Fitment Data  
**Package:** Next-Gen Ranger rear-protection-bumper reverse/work-light route  
**Schema:** 0.26.15 → 0.26.16

## Concrete progress

This push advances one WF2 package only and does not alter customer UX, production backend behaviour, or create/promote visual assets.

- Ranger governed catalogue: **62 → 63** records.
- Manufacturer/source evidence registry: **43 → 44** rows.
- Added governed record for **Offroad Animal Cube Work Light 2x2 — rear protection bumper reverse-light candidate**, SKU **ORA-ALO-2-E4T**.
- Unit RRP normalized to **AUD $95 each** from the current manufacturer product page.
- Pair RRP basis recorded as **AUD $190**, but the actual Ranger rear-bumper option/bundle price remains **unknown/null**; WF2 does not infer a sellable option price from simple 2× unit arithmetic.
- Weight normalized to **0.5 kg each including wiring harness** from the explicit manufacturer specification. The manufacturer storefront/header value of **1.0 kg** is retained separately as a storefront-listed value and does not overwrite the explicit product-mass specification. Pair weight basis is therefore **1.0 kg**.
- Power/spec identity normalized: **40 W**, **1,940 lm**, flood pattern, **IP68**, **9–36 V**, Deutsch waterproof connection.

## Vehicle applicability and fitting route

The exact Next-Gen Ranger rear protection bumper, **RB-FRA-NG-22-ASM0**, currently offers an option labelled **“2x Offroad Animal Reverse Work Lights.”** Its current fitting instructions show a pair of auxiliary rear lights mounted to the rear light tabs using **M8 fasteners supplied with the lights**. If auxiliary lights are not fitted, the supplied rear light cover plates are installed instead. Wiring is explicitly left open to several configurations depending on customer requirements.

The strongest current manufacturer-backed candidate for that option is **ORA-ALO-2-E4T**, because the product is a square four-optic cube matching the auxiliary-light form shown in the Ranger rear-bumper fitting instructions and its dimensions/specification are appropriate for a compact rear work-light application.

However, the exact SKU **is not printed** on either the Ranger rear-bumper PDP or the fitting instructions. Offroad Animal also sells another 2-inch work-light family, **ORA-ALO-L2-P7T/E7T**, so WF2 does not elevate ORA-ALO-2-E4T to confirmed exact-option status from visual/product-name correlation alone.

## Governance state

- Product identity: **verified manufacturer product**.
- Exact Ranger rear-bumper option identity: **engineering candidate — not exact-SKU proven**.
- Vehicle route: requires governed parent **oa-rear-protection-ranger**.
- Required quantity when selected: **2**.
- Exact rear-bumper option bundle RRP: **unknown**.
- Exact electrical harness/trigger/switch SKU: **unknown**.
- Electrical configuration: **staff review required** because the fitting instructions allow several wiring configurations.
- Staff-review gate remains **blocking for quote-release as the exact rear-bumper option SKU** until manufacturer/dealer BOM or option evidence directly links `RB-FRA-NG-22-ASM0` to `ORA-ALO-2-E4T` (or identifies a different exact SKU).
- Visual readiness: **staff-review only**. Rear 3/4 relevance recorded; no approved render/layer state and no visual asset created.

## Data integrity and deduplication

Validation after the package merge:

- **63** catalogue records.
- **63** unique product IDs.
- **63** unique non-empty SKUs.
- **44** source-evidence rows.
- **0** duplicate IDs.
- **0** duplicate SKUs.
- **0** broken governed dependency / optional-part / alternative-part references.
- **0** approved Ranger visual states.

## Verification

- Targeted `wf2-ranger-rear-work-light-route-alpha26.js`: **PASS**.
- Full Alpha regression chain (`npm test`): **PASS**.
- `npm run check`: **PASS**.
- JavaScript syntax: **93/93 valid**.
- JSON parse validation: **9/9 valid**.
- HTML/local reference validation: **16 HTML files / 239 local references / 0 missing**.
- Package ZIP integrity: verified after build.

## Scope verification

Compared with Push 16, changed files are limited to WF2 data/evidence, version/regression gates, package metadata, the new targeted WF2 test, and this report. No HTML, CSS, customer-facing UX, production backend behaviour, or visual asset file was changed.

## Source evidence

- Offroad Animal — Rear Protection Bumper, Ford Ranger RA Next Gen 2022-on  
  https://offroadanimal.com.au/rear-protection-bumper-ford-ranger-ra-next-gen-2022-on/
- Offroad Animal — `RB-FRA-NG-22-ASM0` fitting instructions, Rev B 02/10/2025  
  https://offroadanimal.com.au/content/RB-FRA-NG-22-ASM0%20Fitting%20Instruction%20Rev.B.pdf
- Offroad Animal — Cube Work Light 2x2, SKU `ORA-ALO-2-E4T`  
  https://offroadanimal.com.au/offroad-animal-cube-work-light-2x-2/
- Offroad Animal — alternative 2-inch Working LED Light Pod, SKU family `ORA-ALO-L2-P7T/E7T`  
  https://offroadanimal.com.au/offroad-animal-2-working-led-light-pod/

## Next dependency

The next dependency for this route is **authoritative manufacturer/dealer BOM or current option data explicitly mapping `RB-FRA-NG-22-ASM0` “2x Offroad Animal Reverse Work Lights” to the exact light SKU**. Until that is obtained, `ORA-ALO-2-E4T` remains an engineering candidate and the rear-bumper option bundle price remains unknown rather than being inferred from two retail units.

If that exact identity cannot be resolved authoritatively, WF2 should preserve the gate and move to the next exact Next-Gen Ranger subsystem rather than spend further cycles inferring compatibility; equivalent Y62 mapping follows once the Ranger expansion gate is sufficiently mature.
