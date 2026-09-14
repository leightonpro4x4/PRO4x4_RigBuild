# PRO4X4 Rig Builder — WF2 Push 29
## Next-Gen Ranger Offroad Animal Spotlight Family Governance

**Scope:** one WF2 package only. No customer UX/application behaviour or visual assets were altered.

## Concrete catalogue advance

Ranger WF2 advances from **68 to 71 governed records** and Ranger evidence from **49 to 52 rows** (`schemaVersion 0.26.20`). Y62 remains at 26 governed records.

Added current Offroad Animal spotlight products:

| Governed ID | SKU | Current manufacturer price | Normalized weight | Ranger route |
|---|---|---:|---:|---|
| `oa-night-slapper-9-pair-ranger` | `ORA-ALO-P-R-9-C31D1-AW` | $795 | unknown | Toro only (current parent option) |
| `oa-ass-kicker-9-pair-ranger` | `ORA-ALO-GR7-B` | $580 | 9 kg pair | Predator + Toro |
| `oa-butt-kicker-7-pair-ranger` | `ORA-ALO-R5-C10D1` | $415 | unknown | Predator + Toro |

Manufacturer MSRP fields are blank on all three current PDPs, so `rrpAud` remains `null`; current selling price is stored separately as current manufacturer price.

### Weight normalization

- Ass Kicker: manufacturer explicitly publishes **4.5 kg each including wiring harness**, sold as a pair, so governed pair mass = **9 kg**. The generic storefront `7.00 KGS` value is retained as conflicting ancillary metadata.
- Night Slapper: storefront `3.00 KGS` has undefined product/pair/shipping semantics; normalized mass stays unknown.
- Butt Kicker: storefront `7.00 KGS` has undefined product/pair/shipping semantics; normalized mass stays unknown.

## Applicability / dependencies / conflicts

- Current Next-Gen Ranger **Predator** configurator directly offers Butt Kicker 7-inch pair and Ass Kicker 9-inch pair. It does not expose Night Slapper in the current spotlight choices.
- Current Next-Gen Ranger **Toro** configurator directly offers Night Slapper, Ass Kicker and Butt Kicker.
- The governed 9-inch Rally Hoop is a dedicated compatible Ass Kicker route on Predator; the governed 7-inch Rally Hoop is a dedicated compatible Butt Kicker route on Predator. Neither hoop is made a hard spotlight dependency because current configurator evidence does not prove that either light pair cannot use another mounting route.
- Toro does not inherit Predator Rally Hoop dependencies.
- The three spotlight pairs are mutually exclusive within the governed `front-spotlighting` choice group.
- They do **not** conflict with the 22-inch centre light-bar routes because Offroad Animal publishes combined light-bar + driving-light fitting bundles.

## Required fitting parts / engineering gates

Included product hardware is recorded from manufacturer PDPs. Ass Kicker and Butt Kicker each include one light, one wiring harness, one bolt kit and one stainless mounting bracket **per light**. Night Slapper is supplied as a pair with covers and wiring looms.

Still gated for staff/engineering review:

1. exact minimum Predator mounting BOM when a dedicated Rally Hoop is not selected;
2. exact Toro spotlight mounting holes/brackets/fasteners beyond the supplied light brackets;
3. exact Next-Gen Ranger two-light high-beam trigger/harness topology and interface for the Offroad Animal supplied looms;
4. standalone PRO4X4 install time/labour for each pair.

Offroad Animal's published bar fitting-partner bundle prices are stored only as parent-bundle evidence. They are not decomposed into standalone spotlight labour because the manufacturer expressly notes custom wiring, factory-switch integration and non-standard accessories can attract additional charges.

## Electrical normalization

- Ass Kicker: 205 W per light, 9–36 V, 23,760 lm per light, IP68, manufacturer calls the connector `Deutsch waterproof`.
- Butt Kicker: 105 W per light, 9–36 V, 5,800 lm per light, IP68/IP69K, `small DT connector`.
- Night Slapper: manufacturer publishes 9–30 V, 118.8 W ±11.88 W and 9 A ±0.9 A at 13.2 V plus 9,508 lm ±950.8 lm, but does not explicitly state whether those table values are per lamp or pair. WF2 preserves them verbatim and does not derive circuit sizing.

No STEDI vehicle adaptor or single-output harness has been inferred as compatible with these Offroad Animal two-light looms.

## Visual readiness

All three new records are `visualisable:false`, `status: staff-review`, `approved:false`, with no layer ID and no new visual asset.

## Validation

- Targeted Push 29 spotlight regression: **PASS**
- Full `npm test`: **PASS**
- `npm run check`: **PASS**
- JavaScript syntax: **106/106 valid**
- JSON parse: **9/9 valid**
- HTML local references: **16 HTML files / 239 references / 0 missing**
- Ranger: **71 unique IDs / 71 unique SKUs**
- Ranger evidence: **52 rows**
- Y62: **26 unique IDs / 26 unique SKUs**
- Cross-catalogue shared universal SKUs: **8**, with **0 brand/current-price identity conflicts**
- New shared spotlight weight semantics: Night `null/null`, Ass `9/9`, Butt `null/null` across Ranger/Y62 — no new weight drift introduced
- Existing legacy shared-weight drifts (`ORA-ALO-S5D1-20`, `TB-COM-PR-ASM0`, `TB-COM-RAL-ORA-2X7-ASM0`, `TB-COM-RAL-ORA-2X9-ASM0`) remain deliberately untouched because repairing them is outside this one-package scope.
- Baseline file diff contains WF2 Ranger data/evidence, regression baselines/tests, package metadata and this report only; **no HTML/CSS/customer UX/render/camera/visual asset files changed**.

## Next dependency

Obtain authoritative Offroad Animal Ranger fitting/wiring evidence for the spotlight pairs that identifies the **exact Predator/Toro mounting BOM and the exact two-light high-beam trigger/harness interface**. Until that is source-proven, mounting release and electrical release remain engineering/staff-review rather than inferred.
