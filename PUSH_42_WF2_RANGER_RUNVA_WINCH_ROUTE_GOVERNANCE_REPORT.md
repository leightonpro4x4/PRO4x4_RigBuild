# PUSH 42 — WF2 Ranger Runva 11EXPEDITION Winch Route Governance

**Date:** 2026-09-14  
**Workstream:** WF2 — Catalogue + Fitment Data  
**Package:** Next-Gen Ranger Predator / Toro winch route governance  
**Schema:** `0.26.14` → `0.26.15`  
**Scope discipline:** one WF2 package only; no customer UX code changes; no visual asset creation or promotion.

## Outcome

Advanced the governed Next-Gen Ranger catalogue from **61 to 62 records** and manufacturer/source evidence from **42 to 43 rows**.

Added the exact **Runva 11EXPEDITION 12V with synthetic rope** route offered by Offroad Animal on both governed Next-Gen Ranger Predator and Toro bull bars. The winch is not treated as a free-floating vehicle fitment: it carries an explicit **either/or dependency** on the governed Predator or Toro front bar.

## New governed record

### Runva 11EXPEDITION 12V Winch with Synthetic Rope

- ID: `runva-11expedition-ranger-frontbar`
- SKU: `11EXPEDITION12V`
- RRP: **AUD $1,295**
- Normalized fitted weight: **29 kg** from Runva direct manufacturer specification
- Offroad Animal storefront-listed weight retained separately: **31 kg**
- Offroad Animal shipping weight retained separately: **39 kg**
- Rated line pull: **11,000 lb / 4,990 kg**
- Mounting bolt pattern: **254 x 114.3 mm, 4 x M10**
- Overall dimensions: **574 x 160 x 190 mm**
- Rope: **11 mm x 25 m synthetic**, published 25,250 lb rope rating
- Supplied electrical: **2 x 1.8 m heavy-duty battery leads** and rechargeable wireless remote
- PRO4X4 standalone install price: **unknown / null**
- Manufacturer standalone install duration: **unknown / null**
- Catalogue status: **confirmed for the governed Predator/Toro route**
- Visual readiness: **non-visual / priced-only**; no layer created or approved

## Vehicle / parent applicability

Exact Offroad Animal Next-Gen Ranger product pages for both:

- Predator `FB-FRA-NG-22-PR-ASM0`; and
- Toro `FB-FRA-NG-22-TOR-ASM0`

currently offer **Runva 11Expedition winch 12V** as a selectable electric-winch option.

Both governed bars are published as accepting low-mount winches up to **12,000 lb**. The governed Runva winch is **11,000 lb**, so the fitment route is source-backed without needing to infer capacity compatibility.

The data graph now records:

- `anyOfRequiredParts = [oa-predator, oa-toro-ranger]` on the winch;
- the winch as an optional governed part on both parent bars; and
- no false requirement to fit both bars.

## Install and fitting-parts normalization

Offroad Animal currently publishes the same fitting-partner package prices on both exact Ranger bar pages:

- Front bar only: **$900**
- Front bar + winch: **$1,200**

WF2 retains those numbers only as **bundle-pricing evidence**. It does **not** convert the $300 arithmetic difference into a PRO4X4 standalone winch labour charge. `install` therefore remains `null` until an explicit PRO4X4 labour schedule or authoritative standalone installation price is supplied.

Required/supporting fitment facts retained:

- governed Predator **or** Toro front bar is required;
- 254 x 114.3 mm / four-M10 winch mounting pattern;
- the front-bar route provides fairlead mounting provision and a number-plate flip;
- Predator additionally publishes a winch control-box bracket in the bar contents;
- Runva supplies two 1.8 m heavy-duty battery leads.

No battery isolator SKU is inferred. Exact isolation hardware is retained as a non-blocking installer check because neither governing source used in this package identifies a specific isolator as a mandatory fitting part for this exact Ranger/bar route.

## Weight normalization decision

There is a live manufacturer/storefront discrepancy:

- Runva direct manufacturer specification: **FITTED WEIGHT 29 kg**
- Offroad Animal storefront field: **31 kg**
- Offroad Animal shipping weight: **39 kg**

WF2 normalizes `weightKg` to **29 kg** because Runva explicitly identifies that value as fitted weight. The 31 kg Offroad Animal value is preserved separately rather than discarded or silently averaged.

## Source-governance decisions

- Direct Runva manufacturer data governs product identity, SKU, RRP, technical dimensions and explicit fitted weight.
- Offroad Animal exact Ranger bar PDPs govern the vehicle/bar application route.
- Cross-source weight disagreement is preserved rather than hidden.
- Bundle fitting prices are not reinterpreted as standalone labour.
- No electrical support/isolator SKU is invented.
- No visual asset or approved render state was created.

## Validation

- Targeted `wf2-ranger-runva-winch-route-alpha26.js`: **PASS**
- Full Alpha regression chain via `npm test`: **PASS**
- `npm run check`: **PASS**
- JavaScript syntax: **92 / 92 PASS**
- JSON parse: **9 / 9 PASS**
- HTML dependency validation: **16 HTML files / 239 local references / 0 missing**
- Ranger catalogue: **62 records / 62 unique IDs / 62 unique non-empty SKUs**
- Source evidence: **43 rows**
- Governed dependency / required-part / optional-part / any-of-part / mounting-route references: **0 broken**
- New approved visual states: **0**
- Duplicate occurrence search for SKU `11EXPEDITION12V` outside the new data/evidence/test route: **0 catalogue duplicates**

## Scope verification

Compared with Push 15, substantive runtime data changes are confined to:

- `data-ranger.js`
- `ranger-source-evidence.js`
- package/test version gates and the new targeted WF2 regression
- this report

No customer-facing HTML, CSS, merged app/customer UX logic, backend production behaviour, or visual asset files were changed.

## Next dependency

The next clean exact-Ranger package is the **rear-protection-bumper reverse-light route**. `RB-FRA-NG-22-ASM0` explicitly offers **2x Offroad Animal Reverse Work Lights**, but the live Ranger rear-bar PDP does not expose the exact reverse-light SKU in the option label.

Do not guess the product identity. The next WF2 pass should resolve the exact Offroad Animal reverse-work-light SKU/PDP, normalize its RRP/weight/electrical/install data, and then attach it to the governed Ranger rear bumper. If the exact identity cannot be source-proven, keep the option as an unresolved manufacturer-named accessory and move to the next exact Ranger subsystem before starting Y62.

## Primary source URLs

- https://www.runvawinch.com.au/11expedition-12v-with-synthetic-rope
- https://offroadanimal.com.au/runva-11expedition-winch-12v/
- https://offroadanimal.com.au/predator-bull-bar-ford-ranger-next-gen-ra-2022-on/
- https://offroadanimal.com.au/toro-bull-bar-for-ford-ranger-next-gen-ra-2022-on/
- https://offroadanimal.com.au/rear-protection-bumper-ford-ranger-ra-next-gen-2022-on/
