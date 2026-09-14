# Push 56 — WF4 Persisted Canonical Source-Gap Resolution / Evidence-Bound Decision Controls

**Package:** A26-WF4-28  
**Policy:** `REFERENCE_BACKED_APPROVED_VISUALS_ONLY`  
**Scope:** WF4 Platform / Staff Tools only

## Delivery advanced

This push advances one WF4 package only: the authority boundary for a required canonical geometry/source gap.

The prior state retained the SIDE source gap correctly, but an older editable `canonicalReview.sourceGapResolution` field could still imply approval authority. That is no longer accepted. Required source gaps now use a dedicated persisted `canonicalSourceGapResolution` record on the existing shared `render_assets` backbone.

The record is SHA-256-addressed, carries `authority: source-gap-decision-only`, is permanently `productionEligible: false`, and binds the declared canonical gap to the exact owner-reference pack, exact required reference snapshots, current source/rights attestations, evidence-review decisions and canonical view contract. For reviewed reconstruction, the evidence basis additionally binds the WF3 candidate/handoff, claimed reviewer and camera-match state.

## Fail-closed decision paths

Only fitment/admin may record `APPROVED` or `RETURNED` through the dedicated source-gap workflow. Sales remains inspection-only.

`additional-reference` approval requires evidence that is exact-view, same-pack, reference-only, checksum identified, canonical-view declared, source/rights-attested and evidence-review-approved.

`reviewed-reconstruction` approval requires all of the following at decision time:

- a CURRENT + LOCKED canonical view contract;
- a checksum-identified WF3 candidate;
- WF3 handoff state `ready-for-wf4-review`;
- a claimed canonical reviewer whose identity matches the acting fitment/admin reviewer;
- camera/geometry match; and
- an explicit reviewer note describing the geometry evidence.

The real SIDE state cannot satisfy those conditions today, so no approval was manufactured. It remains `OPEN / CURRENT` and its canonical reference coverage remains `blocked-source-gap`.

## Write boundary + downstream governance

`canonicalSourceGapResolution` is now protected by the existing system-managed governance write boundary. Generic asset editing cannot change it; attempted forgery returns `409 governance_metadata_protected` and remains auditable.

Canonical reference coverage, reviewer dossier intake, canonical review decision/evidence, render readiness, governance-attention routing and the vehicle-level master-set registry now consume the dedicated source-gap state. Evidence drift stales an explicit decision. Governance sync can create/refresh only the non-authoritative OPEN placeholder; it deliberately never rewrites an explicit APPROVED or RETURNED reviewer decision.

## Staff visibility

Render Assets now exposes a dedicated **CANONICAL SOURCE-GAP DECISION** panel with decision/freshness, decision SHA, basis SHA, declared gap, exact-view pack evidence count, WF3 intake state, reviewer identity, method/evidence inputs and fitment/admin approve/return actions.

The generic canonical-review form no longer contains a source-gap approval selector. Production Readiness now exposes a separate **CANONICAL SOURCE-GAP DECISIONS** registry and the master-set truth index carries source-gap state beside reference coverage, reviewer, decision and seal progression.

## Clean governed state

- owner reference pack: `Y62-OWNER-REFERENCE-PACK-V1`;
- pack manifest SHA-256: `260a875ef1a787d477178faaa21e897a225a8113fa6d02cab73840e012fe0342`;
- owner references: **9**;
- current source/rights attestations: **9/9**;
- current APPROVED reference-review decisions: **9/9**;
- governed canonical masters: **3**;
- required canonical source gaps: **1**;
- source-gap state: **1 CURRENT / 1 OPEN / 0 APPROVED**;
- SIDE view contract: **CURRENT / CALIBRATION**;
- SIDE canonical reference coverage: **CURRENT / BLOCKED-SOURCE-GAP**;
- F34 candidate: `Y62-F34-V1-CANDIDATE-02 / blocked-upstream`;
- SIDE/R34: `awaiting-wf3-candidate`;
- canonical reviewer assignments: **0**;
- canonical approved decisions: **0**;
- canonical production seals: **0**;
- production-eligible Y62 visuals: **0**.

The master-set truth index now reports four explicit set-level issues: SIDE view-contract calibration, SIDE reference-coverage source gap, SIDE source-gap decision `open/current`, and R34 view-contract calibration.

## Verification

Passed:

- new canonical source-gap database/governance regression;
- new HTTP endpoint/role/tamper regression;
- seven cross-WF4 regressions covering canonical reference coverage, reviewer dossier, reviewer workflow, governance attention, canonical review decision, immutable production seal and canonical master-set registry;
- `npm run check`;
- WF5 governed promotion lifecycle.

WF5 acceptance remains red for exactly the pre-existing `WF1-BOM-ANYOF` defect. `WF4-DIRECT-PRODUCTION-REVIEW` remains PASS and `WF5-CUSTOMER-DRAFT-ISOLATION` remains PASS.

Static package verification: **138 JavaScript files / 0 syntax failures, 62 JSON files / 0 parse failures, 16 HTML files / 303 local references / 0 missing**.

Byte identity against Push 55 input: **16/16 `assets/` + `references/` files unchanged** and **11/11 customer-critical presentation/data/render-contract files unchanged**. No artwork, owner reference binary or customer production pointer was changed.

## Runtime/backbone constraint

No parallel database, runtime, visual registry, approval pipeline or customer fallback path was introduced. Browser/local and hosted/server operation continue through the existing persistence/runtime adapters and render-asset/audit stores. The only backend route added is the active delivery-lane decision endpoint required to prevent generic metadata from carrying approval authority.

## Next dependency

The primary WF4 delivery dependency remains **A26-WF4-14B / WF3**: the first genuinely clean, reviewable `Y62-F34-V1` candidate with clean reconstruction/isolation, locked overlay + camera acceptance, production-binary rights provenance and identified reviewer evidence.

SIDE remains separately blocked until either a clean exact side reference is governed into the owner pack, or WF3 delivers a SIDE candidate under a locked canonical view contract that can satisfy the reviewed-reconstruction source-gap decision path. No unsupported geometry will be promoted.
