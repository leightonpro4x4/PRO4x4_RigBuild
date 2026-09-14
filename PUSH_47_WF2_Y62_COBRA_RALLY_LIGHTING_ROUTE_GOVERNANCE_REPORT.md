# PRO4X4 Rig Builder — WF2 Push 21
## Y62 Cobra Rally-Hoop + 9-inch Ass Kicker Lighting + Camera Relocation Governance

**Package scope:** one integrated Y62 front-lighting/top-hoop route only. No customer UX/application behaviour and no visual assets were changed or created.

## Priority decision

The previous Y62 Window Accessory Panel blocker was rechecked first. The unresolved load-limit and variant-identity issues remain manufacturer-source conflicts, so they were not forced closed. With the verified Next-Gen Ranger catalogue still holding at 65 governed records and no clean new Ranger slice introduced by this package, WF2 advanced the next source-backed Y62 package: the current Cobra bull-bar route using the Offroad Animal 9-inch Rally Hoop, Offroad Animal Ass Kicker 9-inch driving-light pair, and the exact Nissan camera-relocation kit required by the hoop route.

## Catalogue delta

- Ranger catalogue: **65 -> 65** records (unchanged)
- Y62 catalogue: **15 -> 18** records
- Y62 source-evidence registry: **4 -> 7** rows
- Y62 unique product IDs: **18 / 18**
- Y62 unique SKUs: **18 / 18**
- New governed route products: **3**

## 1. Rally Hoop — Offroad Animal 9-inch Ass Kicker route

**Governed ID:** `oa-y62-rally-hoop-9`  
**SKU:** `TB-COM-RAL-ORA-2X9-ASM0`  
**Verified current manufacturer price:** **AUD $330**  
**Normalized RRP:** unknown / `null` because the manufacturer MSRP field is blank  
**Normalized installed/net-added weight:** unknown / `null`  
**Storefront-listed weight retained separately:** **4 kg**  
**Manufacturer fitting time:** **15 minutes**

The current Y62 Cobra PDP independently offers this exact Rally Hoop as a selectable top-hoop option and separately offers the Ass Kicker 9-inch pair and Nissan camera-relocation kit. The universal Rally Hoop PDP verifies the exact SKU and current price, but its vehicle fitment table still references an older/historical Y62 front-bar part number. WF2 therefore preserves the route as **confirmed product identity with staff review required for the current-Cobra part-number drift**, rather than silently treating historical nomenclature as identical.

Dependencies and conflicts:
- requires current governed Y62 Cobra `oa-y62-cobra-frontbar`
- route requires `oa-y62-ass-kicker-9-pair`
- route requires `oa-y62-camera-relocation-kit`
- conflicts with governed Y62 Toro and SLX front-bar routes
- does not inherit a Toro camera-relocation route

The Rev B Rally Hoop instruction supplies the 15-minute fit time and verifies the hoop-to-bar fastener route, including the M10 fastening sequence. No PRO4X4 labour price was inferred from manufacturer/fitting-partner bundles.

## 2. Ass Kicker 9-inch driving lights — pair

**Governed ID:** `oa-y62-ass-kicker-9-pair`  
**SKU:** `ORA-ALO-GR7-B`  
**Verified current manufacturer price:** **AUD $580**  
**Normalized RRP:** unknown / `null` because the manufacturer MSRP field is blank  
**Normalized pair weight:** **9 kg**  
**Storefront-listed weight retained separately:** **7 kg**  
**Install duration:** unknown / staff review

The explicit manufacturer specification identifies **4.5 kg per light including wiring harness**. Because the product is sold as a pair, WF2 normalizes the governed pair mass to **9 kg**. The storefront's separate 7 kg weight field is retained as source-conflicting storefront metadata rather than overriding the explicit per-light specification.

Manufacturer-backed electrical/specification data retained:
- 205 W per light
- 9–36 V DC
- 23,760 lm per light
- combination beam
- Deutsch waterproof connector
- supplied per light: light, wiring harness, bolt kit, stainless mounting bracket

The exact Y62 high-beam trigger/interface, switch/CAN adapter, routing labour and any vehicle-specific electrical adapter SKU remain **engineering / staff-review**. No adapter was invented.

## 3. Nissan Camera Relocation Kit

**Governed ID:** `oa-y62-camera-relocation-kit`  
**SKU:** `TB-COM-NIS-CAM-BRKIT`  
**Price / RRP:** unknown  
**Weight:** unknown  
**Manufacturer fitting time:** **15 minutes**

The current Rev B fitting instruction explicitly limits the kit to Nissan Navara NP300 or Patrol Y62 Series 5 and states that camera relocation suits Offroad Animal Predator/Cobra bars only when fitted with a 22-inch Stealth Hoop or Rally Hoop. It explicitly excludes Toro bars and Predator bars without top hoops. This closes the exact camera-kit identity that was previously unresolved for the Y62 hoop route.

Required/supplied fitting data now governed:
- B-1467 camera relocation bracket
- B-1264 camera cover bracket
- supplied M6x16 button-head bolts, washers and flange nuts
- factory camera screws reused
- camera harness extension may be required if factory harness length is insufficient
- extension wire/solder/heatshrink is **not supplied**

The existing Cobra record was updated only within WF2 fitment metadata: the camera kit is now **conditional-confirmed** for Rally Hoop / 22-inch Stealth Hoop routes, not a universal bare-Cobra requirement.

## Staff-review gates retained

1. Current Cobra PDP vs older Rally Hoop fitment-table part-number drift must remain visible until Offroad Animal publishes one unambiguous current bar mapping.
2. Camera relocation is mandatory on the governed Y62 Series 5 Rally Hoop route; post-install camera operation/aim must be verified before release.
3. Exact high-beam trigger, switch/CAN integration and any vehicle-specific electrical adapter for the Ass Kicker pair remain unresolved.
4. Camera-kit retail/RRP, kit weight, PRO4X4 labour and any harness-extension materials remain unknown until source or workshop verification exists.
5. Offroad Animal fitting-partner bundle pricing is evidence only and is not converted into PRO4X4 labour pricing.

## Visual-readiness governance

No visual assets were created or changed. All three new records remain non-approved for render promotion:
- Rally Hoop: `visualisable:false`, `visual.status:'staff-review'`, `approved:false`
- Ass Kicker pair: `visualisable:false`, `visual.status:'staff-review'`, `approved:false`
- Camera kit: `visualisable:false`, `visual.status:'non-visual'`, `approved:false`

This preserves the `REFERENCE_BACKED_APPROVED_VISUALS_ONLY` policy.

## Validation / de-duplication

- targeted Push 21 WF2 regression: **PASS**
- prior Y62 Window Panel regression: **PASS**
- prior Y62 Front Protection regression: **PASS**
- complete Alpha regression chain: **PASS**
- `npm run check`: **PASS**
- JavaScript syntax validation: **98 / 98 valid**
- JSON parse validation: **9 / 9 valid**
- HTML/local-reference scan: **16 HTML files / 239 local references / 0 missing**
- Y62 IDs: **18 unique / 18**
- Y62 SKUs: **18 unique / 18**
- Push 21 governed dependency/route references checked: **13 / 13 resolved**
- cross-catalogue duplicate check: one intentional shared universal SKU (`TB-COM-RAL-ORA-2X9-ASM0`) between Ranger and Y62; brand and current product price agree; **0 conflicting duplicate identities**
- new approved visual states: **0**

A known pre-existing legacy placeholder (`clearview-powerboards` -> `custom-warrior-adaptation`) remains outside this package and was not converted into a false governed product dependency.

## Files changed in this package

- `data-y62.js`
- `y62-source-evidence.js`
- `seed/bootstrap.seed.json`
- `package.json`
- Y62/Ranger count/version regression fixtures required by the governed catalogue delta
- new `tests/wf2-y62-cobra-rally-lighting-alpha26.js`
- this report

No customer UX HTML/CSS/application logic and no render/visual asset files were changed.

## Next dependency

The next unresolved dependency for this route is **the exact Y62 Series 5 high-beam trigger/switch/CAN interface for `ORA-ALO-GR7-B`**, plus authoritative retail/RRP and weight evidence for `TB-COM-NIS-CAM-BRKIT`. A secondary source-cleanup dependency is manufacturer confirmation that the historical Rally Hoop fitment-table Y62 bar identifier maps to the current Cobra `FB-NPT-Y62-19-PR-ASM0` nomenclature.

Until those are resolved, the lighting electrical integration and camera-kit commercial fields remain staff-review/unknown. The next clean WF2 package, if this dependency remains unavailable, is the **Y62 Cobra Stealth Hoop + 22-inch Slim LED route**; it should be advanced separately rather than bundled into this push.
