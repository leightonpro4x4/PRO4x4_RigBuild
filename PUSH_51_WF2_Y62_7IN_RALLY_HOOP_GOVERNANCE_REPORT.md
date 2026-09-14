# PRO4X4 Rig Builder — WF2 Push 25
## Y62 Butt Kicker 7-inch Rally Hoop governance

Date: 2026-09-14  
WF2 revision: `0.26.24`  
Package scope: one WF2 package only — source-govern the Offroad Animal Butt Kicker 7-inch Rally Hoop inside the Y62 catalogue without promoting the unresolved current-Cobra parent mapping. No customer UX, render-manifest, camera-profile, or visual-asset changes.

## Result

The locked Next-Gen Ranger catalogue remains unchanged at **65 governed records**. The Y62 governed catalogue advances **24 → 25 records** and the Y62 manufacturer evidence registry advances **13 → 14 rows**.

New governed record:

- **Offroad Animal Rally Hoop to suit Butt Kicker 7-inch Driving Lights**
  - ID: `oa-y62-rally-hoop-7`
  - SKU: `TB-COM-RAL-ORA-2X7-ASM0`
  - Current manufacturer price: **AUD $315**
  - RRP: **unknown** — live MSRP field is blank, so current price is not relabelled as RRP.
  - Storefront weight: **8.00 kg**
  - Normalized `weightKg`: **unknown** — the storefront field does not identify net product / installed / shipping semantics.
  - Manufacturer hoop fitting time: **15 minutes**; governed as hoop-only installation, excluding light wiring and camera relocation.
  - Status: **engineering**.

## Vehicle applicability and parent-route state

The exact hoop SKU is now listed on Offroad Animal's live **Nissan Patrol Y62** category and its own compatibility table explicitly lists **Nissan Patrol Series 5, 2020-on**. That is enough to move the product from an ungoverned candidate into the Y62 source registry.

The exact current-Cobra parent route is **not** promoted to confirmed. The hoop compatibility table still names historical Y62 front-bar SKU `FB-NPT-S5-20-PR-ASM0`, while the current governed Cobra is `FB-NPT-Y62-19-PR-ASM0`; additionally, the current Cobra configurator offers the Butt Kicker lights but does not expose this 7-inch Rally Hoop as a top-hoop choice. WF2 therefore preserves the parent mapping as `engineering-historical-parent-nomenclature-current-cobra-configurator-omits-hoop`.

## Dependencies, conflicts and required parts

The hoop is designed only around the governed Butt Kicker 7-inch pair `ORA-ALO-R5-C10D1`, so that light pair is captured as the route-required lighting product. The existing Butt Kicker record now points to the new governed engineering hoop record rather than carrying a loose SKU-only candidate.

Mutually exclusive top-hoop conflicts are recorded against the governed 9-inch Rally Hoop and Type A Stealth Hoop.

The Y62 table says the 7-inch hoop **blocks the camera**. The current camera-relocation instruction for `TB-COM-NIS-CAM-BRKIT` explicitly supports Patrol Y62 Series 5 Predator/Cobra bars fitted with a **Rally Hoop**, and explicitly excludes Toro. WF2 therefore adds the camera kit as a **conditional confirmed requirement if the current-Cobra parent route is engineering-approved**. It is not auto-added while the parent route remains unresolved.

Manufacturer fitting instruction details now captured:
- driving-light brackets / lamp fasteners supplied with the lights;
- non-Quad rally-hoop section assembly uses M6 hardware;
- hoop outer corners secure to the bull bar with two M10x30 socket-head fasteners, one per side;
- separate camera-relocation hardware remains governed under `TB-COM-NIS-CAM-BRKIT`.

## Staff-review gates

Quote/workshop release remains blocked until authoritative evidence closes the historical-parent/current-Cobra mapping. Staff must not infer current-Cobra compatibility solely from shared physical appearance, Y62 category placement, or the fact that Butt Kicker lights are a current Cobra option.

Electrical integration for the Butt Kicker pair remains separately unresolved; this push does not infer a Series 5 two-light high-beam harness from the one-output STEDI route.

## Visual readiness

The new hoop record is:
- `visualisable: false`
- `visual.status: staff-review`
- `visual.approved: false`
- no layer ID
- policy `REFERENCE_BACKED_APPROVED_VISUALS_ONLY`

No visual asset, render manifest, camera profile, or customer-facing UX/application file was modified.

## Validation

Targeted regression:
- `tests/wf2-y62-rally-hoop-7-alpha26.js` — **PASS**

Full regression / static checks:
- `npm test` — **PASS**
- `npm run check` — **PASS**
- JavaScript syntax — **102/102 PASS**
- JSON parsing — **9/9 PASS**
- local HTML reference scan — **16 HTML files / 239 local references / 0 missing**
- Ranger records: **65 / unique IDs / unique SKUs preserved**
- Y62 records: **25 / 25 unique IDs / 25 unique SKUs**
- Y62 evidence rows: **14**
- governed dependencies/conflicts introduced by this package: **all resolved to governed IDs**
- approved Y62 visual leakage: **0**
- baseline diff vs Push 24: **0 customer-facing HTML/CSS/app/render-manifest/camera-profile changes**; only WF2 data/evidence/seed/package/test/report files changed
- seed catalogue synchronized: **25 records**, revision `SEED-Y62-WF2-0.26.24`

Cross-catalogue de-duplication now sees **4 intentional shared universal SKUs** between Ranger and Y62, including `TB-COM-RAL-ORA-2X7-ASM0`. Brand and current product price conflicts are **0**; this hoop agrees at Offroad Animal / $315. Four legacy cross-catalogue weight-normalization drifts are now visible (`ORA-ALO-S5D1-20`, `TB-COM-PR-ASM0`, `TB-COM-RAL-ORA-2X7-ASM0`, `TB-COM-RAL-ORA-2X9-ASM0`). The new 7-inch hoop drift is deliberate: locked Ranger data currently treats the storefront 8 kg value as `weightKg`, whereas this Y62 package preserves it as an untyped storefront field and keeps normalized `weightKg` null. Ranger cleanup is not performed inside this one-package Y62 push.

## Next dependency

Highest-value next dependency is **authoritative Offroad Animal/dealer engineering evidence explicitly mapping `TB-COM-RAL-ORA-2X7-ASM0` to current Cobra `FB-NPT-Y62-19-PR-ASM0`**. If that is obtained, the parent route can move from engineering to confirmed and `TB-COM-NIS-CAM-BRKIT` can become a hard route requirement.

If that mapping remains unavailable, leave the gate intact and advance the next clean Y62 package — the highest-value candidate is the **Toro accessory route normalization** (current 22-inch light bar / spotlight / Runva winch choices and fitting-partner bundle semantics) rather than inferring Cobra compatibility.
