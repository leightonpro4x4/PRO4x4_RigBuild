# PRO4X4 Rig Builder — Alpha 26 — WF2 Ranger Tub/Rack Support Push 08

**Lane:** WF2 — Catalogue + Fitment Data  
**Scope:** One package only — Next-Gen Ranger tub/rack support and reinforcement data  
**Date:** 2026-09-13  
**Catalogue schema:** `0.26.7`

## Outcome

The governed Next-Gen Ranger catalogue expanded from **39 to 43 records**. This package adds three tub/rack products plus one exact Ranger tub-reinforcement support component. No customer UX, backend behaviour, or visual assets were changed.

### New governed records

1. **Offroad Animal Scout Ute Tub Platform Rack** — `SP-COM-FT-MD-ASM0` — RRP **$1,175**.
   - Manufacturer Ranger tub-rack catalogue lists the product for Ford Ranger.
   - Product page calls out Ranger/Raptor tub bracing.
   - Variant weight is preserved rather than flattened: **20.5 kg low-leg / 22.7 kg high-leg**.
   - Manufacturer install time: **2–3 h**.
   - Remains `engineering` / `staff-review` because the exact Next-Gen Ranger brace/J-brace and mounting route are not yet governed.

2. **Offroad Animal Scout Ute Tub Platform Rack Short 500 mm** — `SP-COM-FT-500-ASM0` — RRP **$650**.
   - Manufacturer Ranger tub-rack catalogue lists the product for Ford Ranger.
   - Product page calls out Ranger/Raptor tub bracing.
   - Variant weight preserved: **12.2 kg low-leg / 14.4 kg high-leg**.
   - Manufacturer install time: **2–3 h**.
   - Remains `engineering` / `staff-review` for the same unresolved brace/mounting dependency.

3. **Offroad Animal GOAT Rack** — `GR-MED-COM-ASM0` — RRP **$4,725**.
   - RRP is retained; the observed sale price is not used as catalogue RRP.
   - Manufacturer exposes a Ranger/Raptor/BT-50 vehicle option and specifically excludes **Next-Gen Ranger/Raptor with RGr roller shutters**.
   - Weight **50 kg**; install/assembly time **3–4 h**; difficulty **4/10**.
   - Remains `engineering` / `staff-review` until the exact tub and roller-shutter configuration is confirmed.

4. **EGR Lower Tub Strengthening Bracket (J-Brace)** — `040174` — RRP **$249**.
   - EGR manufacturer confirms Ford Ranger RA **2022-onwards** fitment.
   - Added as a confirmed vehicle support component.
   - It is **not automatically linked** as satisfying an Offroad Animal rack requirement because cross-vendor acceptance has not been proven.
   - PRO4X4 labour time/price and product weight remain unknown rather than inferred.

## Existing record tightened

`oa-adventure-rack-ranger` now retains the manufacturer-stated **Ranger/Raptor Mountain Top roller-shutter exclusion** while preserving its existing conditional/staff-review state. The universal product listing is not promoted to exact Next-Gen certainty.

## Deliberate deferral

**The Nice Tub Rack — `TR-NR-COM-ASM1` was not added.** Current manufacturer pages conflict on price: the direct product page presents **$1,750**, while Ranger/category surfaces present **$1,300**. WF2 does not choose between conflicting live values without an authoritative reconciliation.

The older Tub Rack Base is also not promoted into the confirmed Next-Gen slice merely because it appears in the Ford Ranger category; its vehicle selector still explicitly names older Ranger/Raptor years and its Next-Gen information is conditional/exclusion-based.

## Source evidence captured

- https://offroadanimal.com.au/tub-racks/ford-ranger-tub-racks/
- https://offroadanimal.com.au/scout-ute-tub-platform-rack/
- https://offroadanimal.com.au/scout-ute-tub-platform-rack-short-500mm/
- https://offroadanimal.com.au/goat-rack-greatest-of-all-time-tub-rack/
- https://offroadanimal.com.au/adventure-rack-universal-fit-all-aussie-utes/
- https://egrauto.com/products/egr-lower-tub-strengthening-bracket-j-brace
- https://offroadanimal.com.au/the-nice-tub-rack-universal-fit/

Source-evidence registry expanded from **20 to 24 rows**.

## Governance decisions

- Exact identity/SKU/RRP is recorded only where current manufacturer evidence exists.
- Sale price is not substituted for RRP on the GOAT Rack.
- Variant weights are preserved as variant data instead of inventing one nominal weight.
- An unresolved Ranger brace requirement is represented as `requiredExternalParts` plus `reviewRequired: true`; no brace SKU is invented.
- The EGR J-Brace is exact Ranger fitment, but cross-vendor sufficiency is not inferred.
- No new WF2 item has `visual.status = approved`.
- No imagery was created or promoted.

## Verification

- Targeted `wf2-ranger-tub-rack-support-alpha26.js`: **PASS**.
- Full Alpha regression chain via `npm test`: **PASS**.
- `npm run check`: **PASS**.
- JavaScript syntax: **84 files / 0 failures**.
- JSON parse: **9 files / 0 failures**.
- HTML dependency scan: **16 HTML files / 239 local references / 0 missing**.
- Ranger catalogue: **43 records / 43 unique IDs / 43 unique non-empty SKUs**.
- Dependency reference validation: **PASS**.
- Source evidence: **24 rows**.
- File-scope diff against Push 07 confirms changes are limited to WF2 catalogue/evidence, WF2/regression tests, package metadata, and this report. No customer UX or visual asset file changed.

## Next WF2 dependency

Close the **Next-Gen Ranger tub reinforcement/mounting-hardware certainty gap**: establish the exact approved J-brace/tub-brace and roller-shutter mounting combinations that may satisfy each tub rack without cross-vendor inference, and reconcile the live `TR-NR-COM-ASM1` RRP conflict. Once the Ranger tub/rack support chain is governed end-to-end, the next equivalent evidence pass can move into Y62 mappings.
