# PRO4X4 Rig Builder — WF2 Ranger Mounting-Route Governance Push 09

**Alpha:** 26  
**WF:** WF2 — Catalogue + Fitment Data only  
**Schema:** `0.26.8`  
**Captured:** 2026-09-13  
**Catalogue:** 45 governed Next-Gen Ranger records  
**Manufacturer evidence registry:** 26 rows

## Package advanced

This push advances one unfinished WF2 package only: **Next-Gen Ranger tub / roller-shutter mounting-route governance**. It does not alter customer UX, backend behaviour, or visual assets.

### 1. A.U.S.B. mounting routes are now structured rather than buried in notes

Existing product: `oa-ausb-sports-bar-ranger` / `SB-COM-MED-ASM0`.

Manufacturer evidence confirms the Next-Gen Ranger route is **roller-shutter T-slot mounting** and explicitly excludes the tub-clamp route. The A.U.S.B. fitting instruction further separates flat and angled T-slot tracks:

- flat T-slot track: the A.U.S.B. supplies the applicable mounting hardware, with roller-shutter-approved T-slot fasteners still governed by the shutter manufacturer;
- angled T-slot track: the optional `SB-COM-RSAN-KIT` is required;
- bare-tub clamp: blocked for Next-Gen Ranger.

WF2 now persists those as three `fitment.mountingRoutes` states (`confirmed`, `conditional`, `blocked`) without changing customer behaviour.

Source:
- https://offroadanimal.com.au/actually-useful-sports-bar-a-u-s-b/
- https://offroadanimal.com.au/content/Sports%20Bar%20Fitting%20Instruction%20Rev.A.pdf

### 2. Added the conditional angled roller-shutter fitting kit

New governed record:

- ID: `oa-ausb-angled-roller-mount-ranger`
- SKU: `SB-COM-RSAN-KIT`
- Product: Sports Bar Angled Roller Shutter Mount Kit
- RRP: **$175 AUD**
- Manufacturer-listed weight: **5 kg**
- State: `engineering` / `reviewRequired: true`
- Dependency: `oa-ausb-sports-bar-ranger`

It is not treated as mandatory for every Ranger. It applies only when the actual Ranger roller shutter has **angled T-slot tracks**, with the manufacturer naming Mountain Top and Real Truck as examples.

Source:
- https://offroadanimal.com.au/sports-bar-angled-roller-shutter-mount-kit/

### 3. Scout platform mounting routes tightened from the manufacturer fitting instruction

Both existing Scout tub platform records now carry explicit installation routes from Rev B of the manufacturer fitting instruction:

- roller-shutter T-slot route: supplied square nuts may fit; otherwise use the roller-shutter manufacturer's approved T-slot nuts;
- bare-tub route: drill/bolt through the tub top lip as instructed;
- Ranger/Raptor brace requirement remains open because the manufacturer does not identify a current exact Next-Gen brace SKU on the Scout product page.

The catalogue therefore **does not** automatically attach the separately verified EGR J-Brace to either Scout rack.

Sources:
- https://offroadanimal.com.au/scout-ute-tub-platform-rack/
- https://offroadanimal.com.au/scout-ute-tub-platform-rack-short-500mm/
- https://offroadanimal.com.au/content/SCOUT%20PLATFORM%20Fitting%20Instruction%20Rev.B.pdf

### 4. EGR J-Brace applicability corrected

Existing record: `egr-j-brace-ranger` / SKU `040174`.

Current EGR manufacturer data confirms:

- RRP **$249 AUD**;
- Ford Ranger RA **2022-onwards**;
- **does not fit Wildtrak or Platinum variants**;
- package weight **3 kg**.

WF2 stores `packageWeightKg: 3` separately and leaves `weightKg: null` because the source states package weight, not an unambiguous installed component weight. Wildtrak and Platinum are now explicit `excludedTrims`. Cross-vendor sufficiency remains staff review.

Source:
- https://egrauto.com/products/egr-lower-tub-strengthening-bracket-j-brace

### 5. The Nice Rack is now governed without inventing an RRP

New governed record:

- ID: `oa-nice-tub-rack-ranger`
- SKU: `TR-NR-COM-ASM1`
- Manufacturer-listed weight: **23 kg**
- State: `engineering` / `reviewRequired: true`
- Normalised RRP: **null**
- Price state: `source-conflict`

The direct manufacturer product page currently presents **$1,750**, while the manufacturer's Next-Gen Ranger/category listing presents **$1,300**. Rather than choose one, WF2 now preserves both values under `rrpCandidatesAud` and blocks normalised customer pricing until the discrepancy is reconciled. The Ranger category placement is retained as evidence of relevance, but exact tub/roller-shutter fitment remains staff review because the universal PDP does not independently prove the vehicle setup.

Sources:
- https://offroadanimal.com.au/the-nice-tub-rack-universal-fit/
- https://offroadanimal.com.au/ford/ranger/ra-ranger-next-gen-2022-on/

## Governance / scope preservation

- No customer UX files changed.
- No backend/runtime production code changed.
- No visual assets were created or modified.
- No new product acquired `approved` visual status.
- `REFERENCE_BACKED_APPROVED_VISUALS_ONLY` remains untouched.
- Unknown fitment and pricing states remain explicit rather than inferred.

## Verification

Passed:

- `node tests/wf2-ranger-mounting-governance-alpha26.js`
- full `npm test` Alpha regression chain
- `npm run check`
- **85 JavaScript files** syntax-valid
- **9 JSON files** parse-valid
- **16 HTML files / 239 local dependencies** with zero missing references using server-root resolution
- **45 unique product IDs**
- **45 unique non-empty SKUs**
- all governed `requires`, `requiredParts`, `anyOfRequiredParts`, and conditional mounting-route product references resolve
- source-conflict Nice Rack has no normalised price
- EGR package weight is not misrepresented as installed product weight
- no new governed visual is `approved`

File-level comparison against Push 08 confirms only WF2 data/evidence, tests, package metadata and this report changed.

## Next WF2 dependency

The remaining Ranger tub/rack certainty gap is now narrower:

1. find an authoritative **Next-Gen Ranger tub-brace / reinforcement path for Wildtrak and Platinum**, because EGR SKU `040174` explicitly excludes those trims;
2. reconcile the live manufacturer **Nice Rack RRP conflict** before customer pricing can be normalised;
3. only after those are resolved should WF2 promote any rack/brace combination from staff review to confirmed.

If no manufacturer evidence closes those gaps, keep them engineering/staff-review and move the next catalogue expansion to other exact Next-Gen Ranger products before beginning the equivalent Y62 mapping pass.
