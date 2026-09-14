# PUSH 53 — WF2 Ranger STEDI ST3K Predator Lighting Governance

## Scope
One WF2 package only. This push expands the governed Ford Ranger Next-Gen catalogue with the STEDI ST3K 21.5-inch 20 LED slim light bar on the confirmed Offroad Animal Predator front-bar route. No customer UX, HTML/CSS application behaviour, render manifest, camera profile, or visual asset was created or modified.

## Concrete catalogue progress
- Ranger governed accessories: **65 → 66**
- Ranger source-evidence rows: **46 → 47**
- Y62 governed accessories: **unchanged at 26**
- New governed record: `stedi-st3k-21-5-ranger-predator`
- SKU: `LEDST3K-20L`
- Brand: STEDI
- Governed parent: Offroad Animal Predator `FB-FRA-NG-22-PR-ASM0`
- Current Australian retail price: **AUD $219**
- Normalized RRP: **unknown / null** — no manufacturer RRP was inferred from retailer selling prices.
- Normalized product weight: **1.855 kg**, based on explicit repeated product specifications. Ancillary 2.55 kg shipping weight and a separate 4 kg retailer listing are retained as conflicting listing/shipping metadata rather than substituted for product mass.
- Standalone install time/labour: **unknown / null**.
- Product state: **engineering** because physical mounting is source-backed while final vehicle-specific electrical release still requires staff review.

## Source-backed identity and Ranger applicability
The Offroad Animal current Next-Gen Ranger Predator page confirms SKU `FB-FRA-NG-22-PR-ASM0`, Ranger RA 2022-current applicability, and a centre opening accepting up to a 22-inch single-row LED light bar. A current Australian retailer page for that exact Next-Gen Ranger Predator package explicitly offers the STEDI 21.5-inch ST3K light bar, and also exposes a single/twin ST3K option with the Type A Stealth top. The governed automatic route in this push is deliberately limited to one ST3K in the Predator centre aperture; the top-hoop/twin route is retained as secondary evidence and is not auto-selected.

### Primary evidence
- Offroad Animal Ranger Predator parent: https://offroadanimal.com.au/predator-bull-bar-ford-ranger-next-gen-ra-2022-on/
- Exact Ranger Predator + STEDI package evidence: https://www.autopartsco.com.au/offroad-animal-predator-bullbar-ford-ranger-next-g
- ST3K product listing / SKU / product specification: https://www.autopartsco.com.au/stedi-21.5-st3k-20-led-slim-led-light-bar
- ST3K specification cross-check: https://frankiesautoelectrics.com.au/products/stedi-ledst3k-20l
- STEDI Next-Gen Ranger high-beam support: https://support.stedi.com.au/hc/en-us/articles/18200648989977-Next-Gen-Ford-Ranger-Everest-High-Beam-Adaptor-Installation

## Normalized product specification
Stored source-backed fields include:
- 20 x Osram OSLON LEDs
- 4,100 effective lumens
- 10–30 V DC
- 4.3 A @ 13.5 V
- IP68
- 5700 K
- explicit product weight 1.855 kg
- low-profile height 51 mm without side brackets / 63 mm with side brackets
- majority detailed product-spec sources identify a Deutsch DT-2 connector

One current retailer labels the connector DTP rather than DT-2. The data preserves this as a source discrepancy and requires a workshop connector check rather than silently rewriting the conflicting source.

## Dependencies and conflicts
### Required
- Offroad Animal Predator `FB-FRA-NG-22-PR-ASM0` (`oa-predator`).

### Mutually exclusive centre-aperture light route
- Offroad Animal 22-inch Slim `ORA-ALO-S5D1-20` (`oa-22in-slim-lightbar-ranger`).

The mutual conflict is now stored in both product directions so a governed build cannot treat both as simultaneous occupants of the same centre-light aperture.

### Supplied fitting parts retained
The ST3K product specification states that the package includes:
- stainless fasteners;
- stainless steel side mounting brackets;
- 12 V Quick Fit high-beam wiring / relay / wiring kit / on-off switch;
- H4 adaptor;
- HB3 adaptor;
- wiring instructions.

The generic H4/HB3 adaptors are **not** treated as proof that every Next-Gen Ranger electrical route is complete.

## Electrical / staff-review gate
STEDI's current Next-Gen Ranger support confirms that high-beam pickup differs according to headlight level. Levels 1 and 3 use a vehicle-specific piggyback at the passenger-side headlight; Level 2 uses the high-beam signal in the passenger footwell. Current retailer evidence exposes candidate part numbers `FRDRNGNGADAPTERL13` / `FRD-RNG-NG-ADAPTER-L13` for Levels 1/3 and `FRDRNGNGADAPTERL2` for Level 2, but the Level 1/3 naming format is not consistent across retrieved sources and the exact SKU of the Easy Fit harness bundled with `LEDST3K-20L` is not exposed in the retrieved product specification.

Therefore WF2 does **not** auto-release an adapter SKU. Staff must first identify the vehicle's headlight level, reconcile the canonical adaptor part number, and confirm the bundled ST3K harness interface with that adaptor.

## Visual-readiness metadata
- `visualisable: true` because the accessory has an established physical Ranger mounting route.
- `visual.status: staff-review`
- `visual.approved: false`
- no new visual layer, image, render manifest, or generated asset was created.

## Validation
Final validation after all data changes:
- Targeted `wf2-ranger-stedi-st3k-predator-alpha26.js`: **PASS**
- Full `npm test`: **PASS**
- `npm run check`: **PASS**
- JavaScript syntax: **104 / 104 valid**
- JSON parse: **9 / 9 valid**
- HTML local-reference validation: **16 HTML files / 239 local refs / 0 missing**
- Ranger catalogue: **66 records / 66 unique IDs / 66 unique SKUs**
- Ranger evidence: **47 rows / 47 unique IDs / 47 unique SKUs**
- Ranger↔Y62 shared universal SKUs: **5**
- Cross-catalogue shared-SKU brand/current-price conflicts: **0**
- Diff against Push 26: only WF2 data, package metadata, regression tests and this report changed; **0 customer UX / visual / render-manifest / camera-profile changes**.

## Next dependency
Resolve the **exact Next-Gen Ranger STEDI electrical release path** for `LEDST3K-20L`:
1. identify the customer's Ranger headlight level;
2. reconcile the canonical STEDI part number for the Level 1/3 adaptor (`FRDRNGNGADAPTERL13` vs `FRD-RNG-NG-ADAPTER-L13`) and confirm Level 2 naming;
3. obtain the exact SKU/interface specification for the Quick Fit/Easy Fit harness bundled with `LEDST3K-20L` and prove its connection to the selected current Next-Gen Ranger piggyback adaptor.

Until those points are source-resolved, physical fitment remains confirmed but electrical release and labour remain engineering/staff-review.
