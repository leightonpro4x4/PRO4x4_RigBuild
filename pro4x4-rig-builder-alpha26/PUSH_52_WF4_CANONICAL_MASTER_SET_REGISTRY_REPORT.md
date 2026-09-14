# Push 52 — WF4 Persisted Canonical Master-Set Registry

## Package advanced

**A26-WF4-24 — Persisted Canonical Master-Set Registry / Vehicle Visual Truth Index**

This push advances one WF4 package only. It closes the cross-view staff-inspection gap between the owner reference pack and the individual F34, SIDE and R34 canonical masters. It does not create, alter or promote any real Y62 visual.

Policy remains **REFERENCE_BACKED_APPROVED_VISUALS_ONLY** and the application continues to use one shared render-asset/runtime backbone.

## Concrete delivery

A new shared `canonical-master-set-registry.js` governance module creates a persisted, SHA-256-addressed vehicle-level truth index across the governed canonical set. The same snapshot is attached to all three canonical master records so staff inspecting any one master can see the current state of the complete vehicle master set without introducing a second registry or persistence lane.

The persisted basis binds:

- exact vehicle identity and the three governed canonical master IDs/views/briefs;
- exact canonical-view/camera contract fingerprint for each master;
- the shared owner reference-pack ID and manifest SHA-256;
- every required per-view reference checksum and current provenance-attestation freshness;
- explicit required source gaps, including the unresolved SIDE geometry gap;
- WF3 candidate/handoff identity, checksum and intake state;
- reviewer dossier freshness;
- reviewer workflow/assignment state;
- persisted reviewer decision state and candidate checksum;
- persisted readiness state;
- canonical production evidence-seal state;
- persisted governance-attention state;
- current production-eligibility truth.

The registry has `authority: inspection-index-only` and `productionEligible: false`. It cannot approve a master, create a production pointer or make a draft/reference customer-visible.

## Persisted drift / write controls

`canonicalMasterSetRegistry` is now owned by the existing governance write boundary. Generic render-asset editing cannot forge or rewrite it. Reference checksum/provenance drift makes the persisted set registry stale. Governance sync then refreshes the index against the changed evidence and visibly carries the provenance problem forward rather than silently treating the changed source as trusted.

The write-boundary schema is advanced to `0.26.24` so the new set registry is protected alongside the existing reference pack, canonical contract, WF3 handoff, reviewer, readiness, lineage and approval evidence.

## Staff visibility

Production Readiness now includes **CANONICAL MASTER SET REGISTRY**, showing the full F34/SIDE/R34 progression in one view: reference coverage, candidate intake, reviewer assignment, reviewer decision and production-seal state.

Render Assets exposes the same persisted master-set registry while inspecting any governed canonical master, including the shared pack manifest, registry/basis SHA-256 values and cross-links to the other canonical views.

## Runtime / backend scope

No parallel runtime, database table, registry or approval path was introduced. Server persistence and browser-local staff mode both use the same shared module and existing render-asset store. Backend work is limited to the active visual-governance sync/readiness lane required to persist and expose the vehicle-level index.

No customer-facing presentation/data/render contract was changed.

## Governed Y62 state after this push

The clean verification state remains deliberately conservative:

- 9 owner references;
- 9/9 current source/rights provenance attestations;
- 3 governed canonical masters;
- owner pack `Y62-OWNER-REFERENCE-PACK-V1`;
- manifest SHA-256 `260a875ef1a787d477178faaa21e897a225a8113fa6d02cab73840e012fe0342`;
- canonical master-set registry: CURRENT across all three masters;
- 3 governed views indexed;
- 1 WF3 candidate visible in the set: `Y62-F34-V1-CANDIDATE-02`;
- F34 remains `blocked-upstream`;
- SIDE and R34 remain `awaiting-wf3-candidate`;
- SIDE required source-geometry gap remains explicit as the one set-level evidence problem;
- 0 assigned canonical reviewers;
- 0 approved reviewer decisions;
- 0 real canonical production seals;
- 0 production-eligible Y62 visuals.

The verification snapshot registry SHA-256 is `227716d663641484da80661508fe32840984de4acbd93f52095dc9ffdf2a7d91` with basis SHA-256 `dadde979670f171d0d02cbaed1d91510b7e927809958cafc3cc94c9ec6563e97`.

## Verification

- Targeted canonical master-set regression — **PASS**.
- Complete Alpha regression chain (`npm test`) — **PASS**.
- `npm run check` — **PASS**.
- Canonical production-seal regression — **PASS**.
- WF5 governed promotion lifecycle — **PASS**.
- WF5 acceptance — remains **RED only for the pre-existing WF1 `WF1-BOM-ANYOF` defect**; WF4 direct-production review and customer draft/reference isolation remain PASS.
- Static syntax / JSON / HTML local-reference verification — **PASS**: 128 JavaScript files / 0 syntax failures, 50 JSON files / 0 parse failures, 16 HTML files / 295 local references / 0 missing.
- `assets/` + `references/` — **16/16 byte-for-byte unchanged** from Push 51.
- 11 customer-critical presentation/data/render-contract files — **11/11 byte-for-byte unchanged** from Push 51.

## Next dependency

The primary dependency remains **A26-WF4-14B / WF3**: supply the first genuinely clean, reviewable `Y62-F34-V1` candidate with clean reconstruction/isolation, locked overlay + camera acceptance, production-binary rights provenance and identified reviewer evidence.

That will move the vehicle-level truth index from “candidate visible / blocked upstream” into the real governed chain:

**attested owner reference pack → WF3 candidate handoff → reviewer claim → APPROVED decision → canonical review evidence → immutable production evidence seal → approved composite eligibility → sealed project/quote inspection**.
