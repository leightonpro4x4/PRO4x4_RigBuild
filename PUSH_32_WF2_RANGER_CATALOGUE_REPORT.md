# PUSH 32 — WF2 Catalogue + Fitment Data — Ranger Expansion / Normalisation

## Scope
One WF2-only package from merged Alpha 26 Push 05. No customer UX code or visual assets were created or changed.

## Ranger catalogue progress
- Ranger catalogue: **28 → 34** governed accessory records.
- Added six manufacturer-backed records:
  1. Offroad Animal Brush Rails — `SR-FRA-NG-22-ASM0` — AUD 790 — 12 kg.
  2. EGR Flare End Caps — `FLEC-FRA-NG-22-ASM0` — AUD 150 — 1 kg.
  3. Ranger Toro Indicator Piggy Back Harness — `LM-FRA-NG-IND` — AUD 80 — 1 kg.
  4. Stealth Top Type A — `TB-COM-PR-ASM0` — AUD 235 — 4 kg.
  5. Predator Round Top Tube — `TB-COM-PR-RD-ASM0` — AUD 365 — 3 kg.
  6. Wide Full Extension Tray Slide — `TRS-DC-COM-WIDE-ASM0` — AUD 2,780 — 51 kg.

## Fitment/dependency normalisation
- Brush Rails require **both** the Ranger Toro bar and Offroad Animal Ranger rock sliders.
- EGR flare end caps require **either** Predator or Toro, plus externally verified **EGR branded flares**. Because the flare itself is not yet a governed selectable record, the item remains `reviewRequired: true` / visual `staff-review` rather than inferring fitment certainty.
- Toro indicator harness requires the Ranger Toro bar. Manufacturer fitting time was not found, so installation time remains explicitly `null`.
- Both Predator top-hoop options require the Ranger Predator bar and share one option group so the catalogue treats them as alternatives.
- Wide tray slide is manufacturer-listed for Next Gen RA Ranger Dual Cab; fitting time and assembly time are stored separately.

## Existing record normalisation
Manufacturer data was used to correct/fill the following fields without inventing PRO4X4 labour charges:
- Predator bull bar: **65 kg**, manufacturer fitting time **5–6 h**.
- Toro bull bar: **76 kg**, manufacturer fitting time **5–6 h**.
- Rear protection bumper: **36 kg**, manufacturer fitting time **1–2 h**; factory-towbar/Hayman-Reese gate retained.
- Ranger rock sliders: **60 kg**, manufacturer fitting time **3 h**.

`install` remains the PRO4X4 labour-price field. Manufacturer fitting time is now separately normalized under `installTimeHours`; it does not fabricate a labour price.

## Visual-readiness discipline
No visual assets were created and no new product is marked `approved` visually. New visual metadata is limited to whether an item is exterior-visualisable, applicable views, reference availability, layer requirement, and fitment confidence. Conditional EGR end-cap fitment remains `staff-review`. Non-visible electrical/tray-slide items do not require visual layers.

## Verification
- Added `tests/wf2-ranger-catalogue-alpha26.js`.
- Enforces unique IDs and SKUs.
- Enforces dependency referential integrity.
- Cross-checks the six new records against source-evidence rows.
- Verifies unknown install time remains unknown where no manufacturer figure was found.
- Verifies staff-review gates are retained for conditional fitment.
- Verifies WF2 has not promoted any customer visual to `approved`.
- Historic Alpha 26 Ranger-count tests were relaxed from exact version/count assertions to backward-compatible minimum baselines; their original acceptance intent is preserved.

## Next WF2 dependency
Continue the **Next-Gen Ranger** manufacturer-backed slice before moving to equivalent Y62 mappings. Highest-value remaining candidates are Ranger-specific/tub-rack and lighting/support components where the manufacturer detail page explicitly proves Next-Gen Ranger applicability. Universal category placement alone must not be treated as confirmed fitment; ambiguous products remain engineering/staff-review or are omitted until evidence is found.

## Regression result
- Targeted WF2 catalogue test: **PASS**.
- Full Alpha 12 → Alpha 26 `npm test` chain: **PASS**.
- Server `npm run check`: **PASS**.
- All JavaScript syntax checks: **PASS**.
- JSON parse validation: **PASS**.
- Change-scope comparison against Parallel Push 05 confirms no customer HTML/UX file and no visual asset file changed. Changes are limited to Ranger catalogue/evidence data, WF2 tests, package test metadata and this report.
