# PRO4X4 Rig Builder — Alpha 26 — WF2 Push 30
## Next-Gen Ranger dual-output spotlight wiring governance

### Scope
Advanced one WF2 package only: source-backed vehicle-side electrical architecture for the already-governed Offroad Animal driving-light pairs on the Ford Ranger Next Gen. No customer UX, HTML/CSS behaviour, render manifests, camera profiles, or visual assets were changed.

### Catalogue movement
- Ranger governed accessories: **71 → 72**
- Ranger source-evidence rows: **52 → 53**
- Y62 governed accessories: **26 unchanged**
- New governed SKU: **STEDI `WIRQKFT-SMART`**
- Existing `LM-FRA-NG-IND` record was normalized and expanded from indicator-only metadata into its manufacturer-documented headlight-level/high-beam-breakout states.

## 1. New governed component — STEDI dual-output SMART Harness
**ID:** `stedi-dual-smart-harness-ranger`  
**SKU:** `WIRQKFT-SMART`  
**Current Australian retail:** **$69.99**  
**RRP/MSRP:** unknown / not explicitly published in the current source  
**Normalized weight:** unknown  
**Storefront-listed weight retained separately:** 1.00 kg  
**Standalone install time / PRO4X4 labour:** unknown

Source-backed specifications captured:
- dual driving-light outputs;
- 10 AWG high-current cable;
- 35 A fuse;
- 60 A relay;
- waterproof isolation switch;
- HB3 and H4 trigger adaptors supplied;
- DTP-to-DT reducers supplied;
- published wiring lengths retained without deriving unstated installed mass or labour.

Primary sources:
- https://offroadanimal.com.au/dual-connector-plug-play-smart-harness-high-beam-driving-light-wiring/
- https://support.stedi.com.au/hc/en-us/articles/21520348753177-STEDI-High-Beam-Piggy-Back-Adaptor-Installation
- https://support.stedi.com.au/hc/en-us/articles/18200648989977-Next-Gen-Ford-Ranger-Everest-High-Beam-Adaptor-Installation

## 2. Ranger headlight-level vehicle-side route now governed
The already-governed STEDI Ranger piggyback adaptors now have a source-backed dual-output harness endpoint:

- **Level 1 / Level 3 headlights:** `FRD-RNG-NG-ADAPTER-L13` → `WIRQKFT-SMART`
- **Level 2 headlights:** `FRD-RNG-NG-ADAPTER-L2` → `WIRQKFT-SMART`

STEDI's current installation guidance explicitly states that its vehicle-specific high-beam adaptor connects to the Smart Harness via the T-connector. This closes the previously-unresolved **vehicle-side two-light trigger/harness architecture** for the Ranger while retaining an actual-headlight-level staff gate.

The route is conditional, not automatic: actual headlight level must still be identified before selecting L13 versus L2.

## 3. `LM-FRA-NG-IND` normalization and high-beam evidence
The existing Offroad Animal Ranger harness record was corrected conservatively.

**SKU:** `LM-FRA-NG-IND`  
**Current manufacturer price:** **$80**  
**RRP/MSRP:** unknown / blank on current manufacturer page  
**Normalized weight:** changed from legacy 1 kg to **unknown**  
**Storefront-listed weight retained separately:** 1.00 kg

Offroad Animal's fitting note confirms:
- Level 1 headlight high-beam +12 V: **green wire**;
- Level 3 headlight high-beam +12 V: **brown wire**;
- indicator +12 V: yellow;
- earth: black;
- **Level 2 does not get a high-beam trigger from this harness** and instead requires the passenger-side kick-panel trigger route.

The current Predator and Toro configurators both expose this piggyback harness as an option. However, a direct electrical interface from its bare trigger outputs to the STEDI Smart Harness T-connector is **not** source-proven, and stacking this harness inline with the STEDI headlight adaptor is also not assumed. Those states remain workshop/staff review.

Primary sources:
- https://offroadanimal.com.au/ranger-toro-indicator-piggy-back-harness/
- https://offroadanimal.com.au/content/indicatorharness.pdf
- https://offroadanimal.com.au/predator-bull-bar-ford-ranger-next-gen-ra-2022-on/
- https://offroadanimal.com.au/toro-bull-bar-for-ford-ranger-next-gen-ra-2022-on/

## 4. Spotlight electrical records tightened
The existing Ranger Night Slapper, Ass Kicker and Butt Kicker records now each contain the governed conditional vehicle-side architecture above.

What is now confirmed:
- vehicle-specific high-beam selection by actual Ranger headlight level;
- STEDI vehicle-specific adaptor → Smart Harness T-connector architecture;
- dual-output Smart Harness availability for a two-light pair.

What remains engineering / staff review:
- exact lamp-side connector mating gender;
- exact pinout and polarity;
- selected lamp-pair circuit/load suitability;
- exact integration of the Offroad Animal supplied lamp looms with `WIRQKFT-SMART`;
- exact Predator/Toro physical spotlight mounting BOM already carried forward from Push 29.

For Butt Kicker only, the manufacturer describes the lamp connector as a **small DT connector**, and `WIRQKFT-SMART` includes DTP-to-DT reducers. This is recorded as **candidate connector-family compatibility only**; it is not released as plug-compatible because gender/pinout/polarity are still unproven.

## 5. Unknown / engineering-state preservation
No inferred certainty was introduced:
- `WIRQKFT-SMART` RRP remains null;
- `WIRQKFT-SMART` normalized mass remains null despite a 1.00 kg storefront field;
- `LM-FRA-NG-IND` RRP remains null;
- `LM-FRA-NG-IND` normalized mass is now null rather than retaining the legacy storefront 1 kg as product mass;
- standalone installation time/labour remains null for both harnesses;
- OA lamp-side connector release remains engineering;
- no customer visual was approved or generated.

## 6. Validation
- Focused Push 30 regression: **PASS**
- Full `npm test`: **PASS**
- `npm run check`: **PASS**
- JavaScript syntax: **107 / 107 valid**
- JSON parse: **9 / 9 valid**
- HTML/local-reference scan: **16 HTML files / 239 local references / 0 missing**
- Ranger accessory IDs: **72 unique / 72 records**
- Ranger SKUs: **72 unique / 72 records**
- Ranger evidence: **53 rows**
- Y62 catalogue: **26 records unchanged**
- Ranger/Y62 shared universal SKUs: **8**, with **0 brand/current-price identity conflicts**
- Ranger approved visual leakage: **0**
- Baseline diff: only WF2 Ranger data/evidence, regression tests, package metadata and this report changed; no customer UX, HTML/CSS, render-manifest, camera-profile, or visual-asset files changed.

## Next dependency
The highest-value unresolved dependency is now **lamp-side electrical release for the three Offroad Animal spotlight pairs**. Obtain authoritative manufacturer wiring/connector evidence for each selected lamp pair that identifies:
1. exact connector family;
2. mating gender;
3. pinout;
4. polarity;
5. pair current/load requirement; and
6. whether its supplied loom is retained, bypassed, adapted or reterminated when using `WIRQKFT-SMART`.

Until those details are source-proven, the Ranger vehicle-side high-beam architecture is governed, but final Smart-Harness-to-lamp plug compatibility remains engineering/staff-review.
