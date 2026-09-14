# PUSH 38 — WF2 Ranger Tub Rack Base + Mounting Routes

## Scope
WF2 only. Advanced one Catalogue + Fitment Data package from the Alpha 26 Push 11 checkpoint. No customer UX, runtime/backend production behaviour, or visual assets were changed.

## Result
- Ranger governed accessory records: **50 → 53**
- Ranger source-evidence rows: **31 → 34**
- Schema version: **0.26.10 → 0.26.11**
- Added three manufacturer-backed Offroad Animal records around the legacy Tub Rack Base mounting branch.

## New governed records

### 1. Tub Rack Base — Next-Gen Ranger Conditional
- ID: `oa-tub-rack-base-ranger`
- SKU: `TR-DC-COM-BASE`
- RRP: **AUD $1,150**
- Current manufacturer sale price observed: AUD $1,050 — **not used as normalized RRP**
- Manufacturer-listed weight: **30 kg**
- Manufacturer install time: **1–2 h**
- Install difficulty: **4/10**
- PRO4X4 labour price: **unknown / null**
- State: **engineering / staff-review**

Manufacturer evidence is mixed and is intentionally preserved rather than resolved by inference:
- The current Offroad Animal **Next-Gen Ranger category** lists `TR-DC-COM-BASE`.
- The direct product page still exposes an older vehicle-selector label: “Ranger, Raptor Ranger (2011-2021) or BT-50 (2011-2020)”.
- The same direct product page explicitly states it **does not suit Ranger Wildtrak or Next-Gen Ranger/Raptor with EGR roller shutter**.
- The direct product page states bare-tub installation requires drilling.

Because the category placement and direct selector are not perfectly aligned, this record is **not promoted to confirmed Next-Gen fitment**.

### 2. Roller Shutter Rails Tub Rack Fit Kit
- ID: `oa-tub-rack-roller-rail-kit-ranger`
- SKU: `TR-FRA-PX-11-RSFK`
- RRP: **AUD $470**
- Weight: **5 kg**
- Install time: **unknown / null**
- State: **engineering / staff-review**
- Requires governed parent: `oa-tub-rack-base-ranger`

The manufacturer describes this as a universal rail for most roller shutters with a compatible T-slot. It is offered as an option on the Tub Rack Base, but the SKU is legacy PX-era and no exact RA-specific statement was found. Next-Gen use therefore remains **roller-shutter geometry + parent-fitment review**, not inferred compatibility.

### 3. Angled Roller Shutter Rails Tub Rack Fit Kit — Mountain Top
- ID: `oa-tub-rack-angled-roller-rail-kit-ranger`
- SKU: `TR-FRA-PX-11-RSANFK`
- RRP: **AUD $470**
- Weight: **5 kg**
- Install time: **unknown / null**
- State: **engineering / staff-review**
- Requires governed parent: `oa-tub-rack-base-ranger`

Manufacturer states this route is for **Mountain Top branded angled-top roller shutters**, explicitly says **“Not Ford Wildtrak”**, supplies square nuts for 13 mm / 18 mm T-slots, and warns that an approved M6 track nut may still be required for the selected shutter.

## Structured mounting routes added to Tub Rack Base
1. `bare-tub-drill` — staff review; no inferred fitting part.
2. `roller-shutter-standard-t-slot` — staff review; requires `TR-FRA-PX-11-RSFK` only when that route is selected.
3. `roller-shutter-angled-mountaintop` — staff review; requires `TR-FRA-PX-11-RSANFK` only when that route is selected; Wildtrak excluded by the mount-kit manufacturer wording.

This preserves the distinction between a selectable rack and the fitting hardware required by the actual tub / roller-shutter configuration.

## Visual-readiness treatment
- Tub Rack Base: `visual.status = staff-review`; no production visual promoted.
- Both fit kits: non-visual support parts; `visualisable = false`, `visual.status = staff-review`.
- `REFERENCE_BACKED_APPROVED_VISUALS_ONLY` remains unchanged.

## Source register
Captured 2026-09-14.

- Next-Gen Ranger category: https://offroadanimal.com.au/ford/ranger/ra-ranger-next-gen-2022-on/
- Tub Rack Base: https://offroadanimal.com.au/tub-rack-base/
- Standard roller-shutter rail kit: https://offroadanimal.com.au/roller-shutter-rails-to-suit-tub-racks-fit-kit/
- Angled / Mountain Top roller-shutter rail kit: https://offroadanimal.com.au/angled-roller-shutter-rails-to-suit-mountain-top-brand-tub-rack-fit-kit/

## Validation
Targeted regression `tests/wf2-ranger-tub-rack-base-alpha26.js` verifies:
- schema `0.26.11`
- 53 governed Ranger records
- 34 evidence rows
- exact SKUs / RRP / manufacturer weights
- normalized RRP ignores the Tub Rack Base sale price
- Wildtrak / EGR roller-shutter exclusions are not lost
- route-specific fitting-part references resolve
- unknown install values remain null
- all three records remain non-approved visually
- global product IDs and SKUs are unique
- all governed dependency / mounting-route references resolve

Full verification:
- `npm test` — **PASS**, complete Alpha regression chain plus the new WF2 gate
- `npm run check` — **PASS**
- JavaScript syntax — **88 files PASS**
- JSON parse — **9 files PASS**
- HTML local dependency scan — **15 HTML files / 236 local refs / 0 missing**
- Catalogue dedupe — **53 unique IDs / 53 unique non-empty SKUs**

## Files changed from Push 11
Only WF2 data/evidence, WF2/historical schema-version regression gates, package metadata, the new targeted test, and this report. No customer UX file, server production file, or visual asset was changed.

## Next WF2 dependency
The next highest-value Ranger package is **Scout Roof Rack normalization + roof-rack accessory support**. The existing Scout roof-rack record is confirmed for Next-Gen Ranger but still lacks normalized manufacturer weight / install data and governed attachment dependencies. That should be closed before moving to looser universal cargo accessories or starting equivalent Y62 mappings.
