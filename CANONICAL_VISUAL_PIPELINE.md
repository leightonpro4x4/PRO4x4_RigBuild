# Canonical Visual Pipeline

## Asset classes
1. **Reference source** — evidence used to verify identity, geometry, trim, colour or product fitment. Not customer production imagery by default.
2. **Canonical master** — a newly created, standardised vehicle render derived from verified source references.
3. **Product layer** — a view-specific accessory visual aligned to a canonical master and linked to a governed product/SKU/family.
4. **Customer composite** — a runtime output using only approved canonical masters and approved product layers.

## Source policy
- Owner-supplied vehicle photographs are the preferred authenticity source.
- Exact-vehicle third-party imagery may fill geometry/reference gaps but remains `reference-only` unless production rights are separately established.
- No single third-party source image needs to be copied into the configurator for it to serve as a geometric/reference input.
- Missing geometry must be recorded as a confidence gap and resolved through additional references, a controlled owner photo, or reviewed reconstruction.

## Canonical master approval
A master may be `master-approved` only when reviewers confirm:
- exact vehicle/generation/trim identity;
- body proportion and visible factory geometry;
- wheel/tyre identity and stance;
- no invented aftermarket accessories;
- view/framing matches the approved canonical brief;
- asset provenance and render method are logged;
- intended use is customer configurator visualisation.

## Product layer approval
A product layer may be `layer-approved` only when:
- exact product or governed family identity is known;
- exact vehicle/view support is recorded;
- scale and mounting location are credible and reference-backed;
- dependencies/conflicts are linked to catalogue rules;
- clipping/occlusion rules are defined where required;
- reviewer and version are recorded.

## Customer output rule
Customer-facing composite eligibility is:

`master-approved AND every rendered accessory layer = layer-approved`

A product without an approved visual layer may still be selectable where commercial/fitment rules allow, but the UI must disclose that its visual preview is pending. The renderer may not invent or borrow a substitute layer.

## Y62 first-master programme
Target vehicle: 2025 Series 5 Nissan Y62 Patrol Warrior, Black Obsidian.

Primary views:
- `Y62-F34-V1`
- `Y62-SIDE-V1`
- `Y62-R34-V1`

Support views:
- `Y62-FRONT-V1`
- `Y62-REAR-V1`

The owner-supplied photographs form the primary authenticity reference pack. External exact-vehicle references may support missing side/angle geometry, but are not automatically production assets.
