# PRO4X4 Rig Builder — WF2 Ranger STEDI High-Beam Adaptor Governance — Push 28

## Scope
One WF2 package only. This push resolves the highest-priority unfinished electrical-support package from Push 27 for the STEDI ST3K 21.5-inch Predator route. No customer UX, HTML/CSS behaviour, render manifest, camera profile, or visual asset was changed or created.

## Catalogue progress
- Ranger governed catalogue: **66 → 68** records.
- Ranger evidence registry: **47 → 49** records.
- Y62 catalogue remains **26** records.
- Added governed STEDI vehicle-specific high-beam adaptors:
  - `FRD-RNG-NG-ADAPTER-L13` — Next-Gen Ranger/Everest Headlight Levels 1 & 3.
  - `FRD-RNG-NG-ADAPTER-L2` — Next-Gen Ranger/Everest Headlight Level 2.

## Product identity / SKU normalization
### Levels 1 & 3 adaptor
- Canonical governed SKU: `FRD-RNG-NG-ADAPTER-L13`.
- Retail cross-reference alias preserved: `FRDRNGNGADAPTERL13`.
- Current AU retail captured: **$50 AUD**.
- RRP: **unknown / null**.
- Normalized product weight: **unknown / null**.
- Timed install allowance / labour: **unknown / null**.

### Level 2 adaptor
- Canonical governed SKU: `FRD-RNG-NG-ADAPTER-L2`.
- Retail cross-reference alias preserved: `FRDRNGNGADAPTERL2`.
- Current AU retail captured: **$25 AUD**.
- RRP: **unknown / null**.
- Normalized product weight: **unknown / null**.
- Timed install allowance / labour: **unknown / null**.

No generic 1 kg shipping/listing figure was promoted to normalized product weight.

## Vehicle applicability and installation route
STEDI's current support material separates Next-Gen Ranger/Everest headlights into three levels. The actual headlight level is now a mandatory staff-selection gate rather than being inferred only from trim badge.

- **Level 1 / Level 3:** governed adaptor `FRD-RNG-NG-ADAPTER-L13`. STEDI instructs an inline connection at the passenger-side headlight harness, chassis earth at the adjacent M6 point, then connection to the STEDI Smart/Quick Fit harness T-pin/T-connector.
- **Level 2:** governed adaptor `FRD-RNG-NG-ADAPTER-L2`. STEDI instructs routing the adaptor wiring through a suitable passenger-side firewall grommet, connecting to the labelled positive/negative high-beam signal wires behind the passenger kick panel with the supplied crimp connectors, then connecting the STEDI Smart Harness T-connector.

Typical trim guidance is retained only as a guide because headlight optioning can change the actual level.

## ST3K route normalization
`LEDST3K-20L` remains physically governed to the Offroad Animal Predator centre aperture. The electrical support state is improved from candidate part numbers to a source-backed conditional map:

- Headlight Level 1 → `FRD-RNG-NG-ADAPTER-L13`
- Headlight Level 2 → `FRD-RNG-NG-ADAPTER-L2`
- Headlight Level 3 → `FRD-RNG-NG-ADAPTER-L13`

STEDI states its Next-Gen piggybacks connect to its driving-light/Smart harness family, so the adaptor-to-STEDI-harness component family is now source-backed. The exact standalone SKU printed on the Quick Fit harness bundled inside `LEDST3K-20L` is still not published in the current light-bar specification and remains `null`; it was not inferred as `WIRQKFT-HIBEAM` merely because the feature set is similar.

## Dependencies / conflicts / fitting parts
- L1/L3 and L2 adaptors are mutually exclusive selections.
- Both are governed only with STEDI Smart/Quick Fit driving-light harness architecture; third-party harness compatibility is not asserted.
- Existing ST3K Predator route remains dependent on `oa-predator` for physical mounting.
- Conditional electrical fitting part is selected strictly by verified headlight level.
- Standalone PRO4X4 electrical labour remains quote-only / unknown.

## Staff review gates
1. Identify actual headlight Level 1, 2 or 3 before electrical release.
2. Do not select adaptor only by trim badge.
3. Use `FRD-RNG-NG-ADAPTER-L13` only for verified Levels 1/3.
4. Use `FRD-RNG-NG-ADAPTER-L2` only for verified Level 2.
5. Level 2 footwell signal-wire identification and crimp quality require workshop verification.
6. Do not assume third-party harness compatibility.
7. Keep bundled ST3K Quick Fit harness SKU unknown until an authoritative source explicitly prints it.

## Visual readiness
Both new electrical components are non-visual support items:
- `visualisable: false`
- `status: non-visual`
- `approved: false`
- no layer ID
- no new render or source asset created

The ST3K product retains its existing staff-review visual state. Zero visual assets were added or modified.

## Validation
- Focused Push 28 regression: **PASS**.
- Full `npm test`: **PASS**.
- `npm run check`: **PASS**.
- JavaScript syntax: **105 / 105 valid**.
- JSON parse: **9 / 9 valid**.
- HTML local-reference validation: **16 HTML / 239 references / 0 missing**.
- Ranger IDs: **68 / 68 unique**.
- Ranger SKUs: **68 / 68 unique**.
- Ranger evidence rows: **49 / 49 unique IDs and SKUs**.
- Y62 remains **26** governed records.
- Shared Ranger/Y62 universal SKUs: **5**, with **0 brand/current-price identity conflicts**.
- Diff from Push 27 is confined to WF2 Ranger data/evidence, regression baselines/tests and package metadata/report; no customer UX or visual files changed.

## Sources captured
- STEDI current Next-Gen Ranger/Everest high-beam installation support: https://support.stedi.com.au/hc/en-us/articles/18200648989977-Next-Gen-Ford-Ranger-Everest-High-Beam-Adaptor-Installation
- STEDI current headlight-level identification support: https://support.stedi.com.au/hc/en-us/articles/15124999956633-Ford-Next-Gen-Everest-Ranger-high-beam-pick-up
- STEDI product family page: https://stediuk.com/products/stedi-next-gen-ford-ranger-raptor-everest-piggyback-adaptor
- AU L1/L3 price/part cross-check: https://www.repco.com.au/globes-batteries-electrical/driving-lights-accessories/driving-light-mounts-accessories/stedi-next-gen-ranger-everest-piggy-back-adaptor-trim-levels-1-3-frdrngngadapterl13/p/A5691972
- AU L2 price/part cross-check: https://www.repco.com.au/globes-batteries-electrical/driving-lights-accessories/driving-light-mounts-accessories/stedi-next-gen-ranger-everest-piggy-back-adaptor-trim-level-2-frdrngngadapterl2/p/A5691973
- AU canonical hyphenated L2 part cross-check: https://www.sawleysautoandmarine.com.au/products/high-beam-adaptor-frd-rng-ng-adapter-l2-piggy-back-adapter-next-gen-ford-ranger-everest-l2

## Next dependency
The remaining dependency on this route is authoritative evidence that explicitly identifies the **SKU of the Quick Fit harness bundled inside `LEDST3K-20L`**. Until that source exists, the bundled-harness SKU remains unknown even though STEDI confirms the vehicle-specific adaptor family connects to its driving-light/Smart harness architecture. If no stronger source becomes available, this unknown should remain preserved and WF2 can move to the next verified Ranger catalogue-expansion package rather than infer `WIRQKFT-HIBEAM`.
