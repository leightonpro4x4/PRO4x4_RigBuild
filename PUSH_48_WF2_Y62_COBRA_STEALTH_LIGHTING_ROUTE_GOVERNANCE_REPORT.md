# PUSH 48 — WF2 Y62 Cobra Stealth Hoop + 22-inch Slim LED Route Governance

**WF2 revision:** 0.26.21  
**Package scope:** One package only — Nissan Patrol Y62 Series 5 / MY25 Warrior, Offroad Animal Cobra + Type A Stealth top-hoop + 22-inch Slim LED route.  
**Customer UX / visual asset changes:** None.

## Concrete progress

- Y62 governed catalogue: **18 → 20 records**.
- Y62 source-evidence registry: **7 → 9 rows**.
- Ranger catalogue deliberately unchanged at **65 records**.
- Added governed Offroad Animal Type A Stealth hoop route:
  - SKU `TB-COM-PR-ASM0`
  - verified current manufacturer price **AUD $235**
  - MSRP/RRP remains **unknown** because manufacturer MSRP field is blank
  - storefront weight **4 kg** retained separately; normalized installed/net-added `weightKg` remains **null**
  - manufacturer hoop-only fitment time **30 minutes**, difficulty **2/10**
  - requires governed Y62 Cobra front bar and Y62 camera relocation kit
  - conflicts with Rally Hoop, Toro and SLX front-bar route
- Added governed Offroad Animal 22-inch Slim LED light bar:
  - SKU `ORA-ALO-S5D1-20`
  - verified current manufacturer price **AUD $200**
  - MSRP/RRP remains **unknown**
  - explicit manufacturer specification **1.7 kg including wiring harness** used as normalized product mass
  - storefront `2.00 KGS` retained as separate storefront metadata
  - 100 W, 9–36 V, IP68, combination beam, 11,880 lm, Deutsch connector
  - supplied light/harness/bolt-kit/bracket contents recorded
  - Y62 applicability governed only through source-backed Cobra/Toro/Stealth parent routes; no stand-alone vehicle-fitment claim
  - Y62-specific STEDI high-beam adaptor candidate `PATROL-Y62S5-ADAPTER` recorded as **candidate-only**; manufacturer support confirms the Y62 Series 5 adaptor family, while dealer evidence supplies the SKU. It is not treated as a required part because direct compatibility with the Offroad Animal supplied harness is not source-proven.
- Expanded `TB-COM-NIS-CAM-BRKIT` camera-relocation governance from Rally-only to the two source-backed Y62 Cobra top-hoop routes:
  - Cobra + Rally Hoop
  - Cobra + Type A Stealth Hoop
  - Toro remains explicitly incompatible
  - camera harness extension remains conditional and not supplied if required
- Added reciprocal Rally-vs-Stealth hoop conflict so the two Cobra top-hoop routes cannot coexist.

## Source-backed fitment decisions

The current Y62 Cobra product page explicitly offers the **Stealth Top suit Type A LED Light Predator style**, the **Offroad Animal 22-inch Slim LED light bar**, and the Nissan camera relocation option for the Stealth route. The standalone Type A page verifies SKU `TB-COM-PR-ASM0`, current price, 4 kg storefront field, 30-minute / 2-of-10 fitting guidance, two-M10 attachment route, up-to-22-inch single-row light envelope, and links Patrol Y62 camera-relocation instructions.

The standalone Type A product prose mentions Ranger/Hilux/Raptor examples rather than explicitly naming Y62. WF2 therefore does **not** use that generic prose as the Y62 fitment authority. Y62 applicability is governed from the exact current Y62 Cobra option plus Patrol-specific camera-relocation evidence.

The 22-inch Slim LED direct product page verifies SKU `ORA-ALO-S5D1-20`, current price, explicit 1.7 kg-with-harness specification and electrical/output data. Current Y62 Cobra and Toro product pages both offer this light, while the Type A hoop accepts up to a 22-inch single-row light. That supports the governed parent-route mapping without claiming arbitrary stand-alone Y62 compatibility.

## Preserved unknown / engineering states

- A vehicle-specific **STEDI Nissan Patrol Y62 Series 5 high-beam piggy-back route is now source-confirmed**. Australian dealer evidence identifies SKU `PATROL-Y62S5-ADAPTER`, but STEDI specifies its piggy-back adaptors for the STEDI Quick Fit/Smart harness ecosystem. Because the Offroad Animal 22-inch light ships with its own harness, direct harness/interface compatibility is **not proven**. WF2 records the STEDI SKU as a candidate only and does not auto-add it.
- Exact PRO4X4 light-wiring labour remains unknown. Bull-bar bundle labour was **not** reverse-engineered by subtraction.
- The Cobra page's front light-area cover plate remains an unresolved conditional part when the centre light aperture is unused; exact SKU and price are unknown.
- Type A hoop storefront `4 kg` is not labelled installed/net-added mass, so normalized vehicle-added weight remains null.
- No customer visual layer has been approved or created for the Stealth hoop or light bar.

## Validation

- Targeted Push 22 WF2 regression: **PASS**.
- Prior Push 21 Rally-lighting regression: **PASS**.
- Full Alpha regression chain (`npm test`): **PASS**.
- `npm run check`: **PASS**.
- JavaScript syntax: **99 / 99 files valid**.
- JSON parse: **9 / 9 files valid**.
- HTML/local dependency scan: **16 HTML files / 239 local references / 0 missing**.
- Y62 catalogue: **20 unique IDs / 20 unique SKUs**.
- Ranger catalogue: **65 unique IDs / 65 unique SKUs**.
- Y62 governed dependency/conflict/route references: **0 broken**.
- Y62 approved visual states introduced: **0**.
- Shared universal SKU audit: **3 shared SKUs**, **0 brand/current-price identity conflicts**.

### Deduplication note

The shared-SKU audit also surfaced **three existing cross-catalogue weight-normalization drifts** (`TB-COM-RAL-ORA-2X9-ASM0`, `TB-COM-PR-ASM0`, `ORA-ALO-S5D1-20`). Ranger still carries older storefront-weight semantics while the newer Y62 records separate storefront fields from explicit/unknown normalized mass. These are **not SKU/identity/price conflicts** and were deliberately not rewritten in this one-package Y62 push. They should be harmonized later through a shared universal-product normalization pass rather than silently changing the locked Ranger slice here.

## Next dependency

Highest-priority unresolved dependency is now narrower: authoritative evidence for the **electrical interface between the Offroad Animal supplied `ORA-ALO-S5D1-20` harness and the Y62-specific STEDI `PATROL-Y62S5-ADAPTER` / STEDI Smart Harness route**. Until that bridge is proven, the STEDI adaptor remains candidate-only and the light wiring route stays engineering/staff-review rather than being auto-added.
