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

## Persisted owner reference-pack manifest

The first governed Y62 evidence bundle is `Y62-OWNER-REFERENCE-PACK-V1`. Its manifest fingerprint covers the declared 2025 Series 5 Patrol Warrior identity, owner-use basis, nine source records, view bindings and the known square-on side-source gap. The fingerprint is persisted on both reference records and F34/SIDE/R34 canonical master slots.

This is a provenance/integrity contract, not an artwork container. Owner photographs remain staff-only `reference-only` evidence and cannot be promoted. A canonical master can only pass its review contract when all required references are still bound to the same pack manifest and their persisted checksum snapshots still match.

## WF3 → WF4 canonical candidate handoff (Alpha 26 / WF4-14A)
Canonical master slots now persist an explicit WF3 handoff envelope. The envelope is staff-only governance metadata, not an asset version and not a production approval. It binds the latest declared WF3 candidate identity, source checksum, upstream review decision/checks, reference-pack manifest, required reference IDs, production-use restrictions, blockers and next dependency to a deterministic SHA-256 handoff fingerprint.

The current F34 handoff points to `Y62-F34-V1-CANDIDATE-02`, preserves the upstream `returned-to-wf3` decision and remains `productionEligible: false`. SIDE and R34 persist `awaiting-wf3-candidate`. Render-readiness fingerprints include this handoff so a changed candidate/review decision makes an earlier readiness assessment stale. Governance sync may refresh this static handoff contract but may not stage a version, grant approval, replace a binary or alter immutable production lineage.

## Reviewer governance dossier (Alpha 26 / WF4-15)
Each persisted Y62 canonical master now carries a SHA-256-addressed reviewer governance dossier assembled from the same shared render-asset backbone. The dossier binds the exact canonical brief/review contract to the owner reference-pack snapshots, persisted WF3 candidate handoff, current review evidence/check results, readiness assessment and production blockers.

This packet is inspection-only. It does not approve a master, stage a version or grant production eligibility. Any change to its evidence basis makes the saved dossier stale; routine governance sync does not silently replace it. Fitment/admin staff must explicitly refresh the packet before relying on it for the next reviewer intake. The real production path remains reference pack → clean WF3 candidate → canonical review/identified reviewer → immutable production promotion → audit/quote inspection.
## Canonical reviewer queue and evidence-bound assignment (Alpha 26 / WF4-16)
Each governed canonical master now carries a persisted `reviewWorkflow`. The workflow is assignment authority only: it fingerprints the canonical brief/review contract, current owner reference-pack snapshots and exact WF3 candidate handoff into an evidence-binding SHA-256. A reviewer may claim the work only when the governance dossier is current and reviewer intake has no upstream/reference blockers.

A claim records a deterministic `claimId` / `claimSha256` envelope over the reviewer actor, display name, role/time, canonical master + brief, workflow evidence binding and exact candidate checksum. It cannot change `master-draft`, create a binary, approve a visual or move production lineage. Same-reviewer retries are idempotent. If the reference/candidate evidence binding changes, the workflow becomes stale and refresh drops the old claim; release is optimistic-concurrency guarded by the exact current claim SHA. Canonical reviewer decisions and production evidence bind this exact claim envelope, and production promotion still requires the acting reviewer and binary checksum to match. This prevents a decision from floating onto a different claim, source pack or candidate binary.

Current Y62 status remains conservative: F34 is blocked by the WF3 returned candidate, while SIDE and R34 are awaiting WF3 candidates. No current master is claimable for production review.
## Layer approval and composite eligibility (Alpha 26 / WF4-17)
Every governed non-base Y62 visual layer now persists a `compositeEligibility` contract in the shared render-asset registry. The contract binds the layer to vehicle + canonical view + exact SKU/state + target canonical master and records the only governance states that may participate in a customer production composite. Exact match is mandatory and fallback is `none`.

A production composite therefore requires both sides of the visual stack to pass governance: the base/root must be a production-ready approved canonical state, and the requested exact product/state layer must be production-ready in its allowed layer governance state. Missing approval, missing base, stale/tampered binding or an unresolved exact SKU fails closed as `missing`/blocked rather than substituting another visual. Governance sync can repair the static binding contract but is not allowed to promote an asset, alter reviewer state or move immutable production lineage.

The current Y62 registry persists 19 such bindings across F34, SIDE and R34 governed visual state/product-layer records. This is infrastructure readiness only: there are still 0 production-eligible Y62 visuals while F34 is returned to WF3 and SIDE/R34 are awaiting clean canonical candidates.


## Reference source/rights attestation (Alpha 26 / WF4-18)
Every governed owner reference in `Y62-OWNER-REFERENCE-PACK-V1` now carries a persisted provenance attestation over its exact source checksum/path/type, rights/licence basis, pack binding and canonical-view consumption. This attestation proves which reference evidence was reviewed; it is not a licence upgrade and cannot make reference imagery production eligible.

If source or rights evidence changes after attestation, the attestation becomes stale and the reference pack fails closed. Canonical review, render-readiness fingerprints and reviewer dossier evidence consume this freshness state, so a prior review cannot float onto changed source material. Routine registry sync preserves stale evidence for staff inspection; explicit authorised re-attestation is required after the new source/rights state has been reviewed. Owner references remain `reference-only` throughout.


## Persisted canonical view contract (Alpha 26 / WF4-26)
Each F34/SIDE/R34 canonical master now persists a deterministic `canonicalViewContract` that binds the static canonical brief, its persisted view/framing/canvas contract, the governed camera profile and the owner reference-pack identity. This is evidence of what geometry/camera contract staff are reviewing; it is not approval authority and cannot make a visual customer eligible.

The current F34 contract is `locked` because the governed F34 camera profile and canonical brief agree on the 1672×615 output canvas. SIDE and R34 remain `calibration`, so readiness fails closed with a canonical-view-contract blocker until WF3 locks those camera/view profiles. Contract integrity/freshness is shown in Render Assets, Production Readiness and the cross-view canonical master-set registry. Generic edits cannot rewrite the evidence.
## Canonical reference coverage registry (Alpha 26 / WF4-27)
Each governed canonical master persists an evidence-only `canonicalReferenceCoverage` record over the exact reference IDs declared for its view. The record binds active pack/manifest identity, source checksum match, pack membership, canonical-view declaration, provenance-attestation freshness, reference-review approval and any explicit source gap into a deterministic SHA-256 basis.

This does not replace the owner reference-pack gate or grant production authority. It gives staff a persisted per-master answer to “which exact evidence backs this view right now?” and fails closed when source evidence drifts. F34 and R34 are complete against their declared owner references; SIDE remains `blocked-source-gap` despite all three declared support references being current because the owner pack still records the required square-on side source gap.



## Canonical source-gap resolution boundary (Alpha 26 / WF4-28)
A required canonical geometry-source gap is governed by `canonicalSourceGapResolution`, not by editable `canonicalReview` metadata. The persisted decision is SHA-256 bound to the declared gap, owner-reference pack, exact required reference snapshots and canonical view contract. It carries `authority: source-gap-decision-only` and `productionEligible: false`.

The current SIDE master is deliberately `OPEN`. `APPROVED` by `additional-reference` requires current evidence-review-approved, source/rights-attested, exact-side evidence bound to the same pack. `APPROVED` by `reviewed-reconstruction` additionally requires a CURRENT/LOCKED view contract, checksum-identified WF3 candidate in `ready-for-wf4-review`, a claimed fitment/admin reviewer, camera match and reviewer note. Evidence drift makes an explicit decision stale; governance sync may refresh a missing/stale OPEN placeholder but never silently rewrites an explicit APPROVED or RETURNED decision.


## Persisted canonical reviewer claim integrity (Alpha 26 / WF4-29)
The existing `reviewWorkflow.assignment` now contains a signed non-production claim envelope rather than only mutable reviewer strings. `claimSha256` binds `claimId`, canonical master/brief, the workflow evidence-binding SHA, exact candidate checksum, reviewer actor/display/role and assignment timestamp. Its authority is `review-claim-only` and `productionEligible: false`.

Claim operations remain on the existing shared reviewer-workflow lane. A same-reviewer claim retry returns the same claim identity; another reviewer cannot take an active claim; release must present the currently displayed claim SHA, so a stale browser/session cannot release a newer claim. Evidence or claim-integrity drift invalidates the assignment on explicit/governance refresh instead of silently carrying it forward. `canonicalReviewDecision`, governance attention, the canonical master-set truth index and immutable production evidence now retain the exact claim identity they consumed. Staff surfaces show CLAIM VERIFIED/INVALID, claim ID and claim SHA-256. No claim can itself approve or promote artwork.
