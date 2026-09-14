# PRO4X4 Rig Builder — WF2 Ranger Nice Rack Accessory Ecosystem Push 10

**Alpha:** 26  
**WF:** WF2 — Catalogue + Fitment Data only  
**Schema:** `0.26.9`  
**Captured:** 2026-09-13  
**Catalogue:** 49 governed Next-Gen Ranger records  
**Manufacturer evidence registry:** 30 rows

## Package advanced

This push advances one unfinished WF2 package only: **The Nice Rack accessory ecosystem for the governed Next-Gen Ranger catalogue**. It expands the catalogue without changing customer UX, backend production behaviour, or visual assets.

The unresolved parent Nice Rack state remains deliberately intact: `TR-NR-COM-ASM1` is still `engineering`, `reviewRequired`, and `price: null` because current manufacturer surfaces still conflict on its RRP and its exact Next-Gen Ranger tub / roller-shutter setup is not independently proven.

### 1. Added 50L Nice Rack toolbox

New governed record:

- ID: `oa-nice-rack-toolbox-50l-ranger`
- SKU: `TR-NR-COM-ASM2`
- RRP: **$765 AUD**
- Manufacturer-listed weight: **13 kg**
- Capacity: **50 L**
- Dimensions: **630 × 300 × 480 mm**
- Install price: unknown / `null`
- Manufacturer install time: unknown / `null`
- State: `engineering` / `reviewRequired: true`
- Dependency: `oa-nice-tub-rack-ranger`

The manufacturer confirms the toolbox is specifically for The Nice Rack and includes mounting brackets for both low and high rack positions. Vehicle fitment is therefore not inferred from the accessory: the parent rack still has to pass PRO4X4 staff review for the actual Ranger tub / roller-shutter setup.

Source: https://offroadanimal.com.au/tool-box-to-suit-the-nice-rack-50l/

### 2. Added 92L Nice Rack toolbox

New governed record:

- ID: `oa-nice-rack-toolbox-92l-ranger`
- SKU: `TR-NR-COM-ASM5`
- RRP: **$965 AUD**
- Manufacturer-listed weight: **19 kg**
- Capacity: **92 L**
- Dimensions: **1100 × 300 × 480 mm**
- Install price: unknown / `null`
- Manufacturer install time: unknown / `null`
- State: `engineering` / `reviewRequired: true`
- Dependency: `oa-nice-tub-rack-ranger`

As with the 50L box, manufacturer evidence confirms rack compatibility and supplied low/high mounting brackets, but does not close the parent Ranger fitment gate.

Source: https://offroadanimal.com.au/tool-box-to-suit-the-nice-rack-92l/

### 3. Added low-height Nice Rack Molle panel

New governed record:

- ID: `oa-nice-rack-molle-low-ranger`
- SKU: `TR-NR-COM-ASM3`
- RRP: **$162 AUD**
- Manufacturer-listed weight: **4 kg**
- Dimensions: **500 × 350 mm**
- Required rack setting: **low**
- Install price/time: unknown / `null`
- State: `engineering` / `reviewRequired: true`
- Dependency: `oa-nice-tub-rack-ranger`

The low/high distinction is now structured fitment data rather than prose only. This product cannot be treated as valid with the Nice Rack high configuration.

Source: https://offroadanimal.com.au/molle-panel-to-suit-the-nice-rack-low-version/

### 4. Added high-height Nice Rack Molle panel

New governed record:

- ID: `oa-nice-rack-molle-high-ranger`
- SKU: `TR-NR-COM-ASM4`
- RRP: **$240 AUD**
- Manufacturer-listed weight: **5 kg**
- Dimensions: **500 × 525 mm**
- Required rack setting: **high**
- Install price/time: unknown / `null`
- State: `engineering` / `reviewRequired: true`
- Dependency: `oa-nice-tub-rack-ranger`

Source: https://offroadanimal.com.au/molle-panel-to-suit-the-nice-rack-high-version/

## Fitment and governance behaviour

- All four products require the governed parent `oa-nice-tub-rack-ranger`.
- Product-to-rack compatibility is manufacturer-backed.
- Next-Gen Ranger vehicle compatibility **inherits the parent rack's unresolved engineering/staff-review state**.
- Child accessories do not launder the parent Nice Rack into confirmed vehicle fitment.
- Parent Nice Rack price remains `null` / `source-conflict` with preserved $1,300 and $1,750 candidates.
- No install price or install duration was invented where the manufacturer did not publish one.
- No visual asset was created or promoted; all four product visual records remain `staff-review` and non-approved.
- `REFERENCE_BACKED_APPROVED_VISUALS_ONLY` is untouched.

## Verification

Passed:

- `node tests/wf2-ranger-nice-rack-accessories-alpha26.js`
- full `npm test` Alpha regression chain
- `npm run check`
- **86 JavaScript files** syntax-valid
- **9 JSON files** parse-valid
- **16 HTML files / 239 local dependencies** with zero missing references using server-root resolution
- **49 unique product IDs**
- **49 unique non-empty SKUs**
- **30 manufacturer evidence rows**
- all governed `requires`, `requiredParts`, `anyOfRequiredParts`, and conditional mounting-route references resolve
- no new governed visual is `approved`
- parent Nice Rack source-conflict state remains intact

File-level comparison against Push 09 confirms changes are limited to WF2 catalogue/evidence data, WF2/regression tests, package metadata, and this WF2 report.

## Next WF2 dependency

The highest-value Ranger gap is still the **authoritative tub-reinforcement path for Wildtrak and Platinum**. The existing EGR J-Brace `040174` remains excluded for those trims, and no manufacturer evidence found in this pass justified substituting another brace or treating a cross-vendor component as equivalent.

If that cannot be closed with manufacturer-backed evidence, the next Ranger package should expand another exact manufacturer-supported subsystem rather than infer the tub-brace solution. The Nice Rack parent RRP conflict also remains open and must stay unresolved until the manufacturer surfaces agree or a newer authoritative pricing source supersedes them.
