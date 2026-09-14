# Push 53 — WF4 Persisted Reference Review Decision / Approval Boundary

## Package advanced

**A26-WF4-25 — Persisted Reference Review Decision / Approval Boundary**

This push advances one WF4 package only. It closes the remaining reference-intake authority gap where a generic render-asset edit could previously carry `reference-approved` state without a separately persisted, evidence-bound reviewer decision.

Policy remains **REFERENCE_BACKED_APPROVED_VISUALS_ONLY**. The application continues to use the existing shared render-asset/runtime backbone; no second reference registry, approval store, database lane or customer runtime was introduced.

## Concrete delivery

A new shared `reference-review-decision.js` governance module persists explicit **APPROVED** or **RETURNED** decisions against exact reference evidence. Each decision is SHA-256 bound to:

- the reference asset/vehicle/view identity;
- exact source and binary checksum/MIME/dimensions;
- source type, source URL and rights/licence evidence;
- reference authenticity role, canonical-view use and `productionEligible: false` state;
- owner reference-pack identity, manifest and declared membership;
- exact provenance-attestation identity, basis SHA-256, attestation SHA-256 and freshness;
- reviewer identity, review timestamp and decision notes.

The decision itself has `authority: reference-review-evidence-only` and `productionEligible: false`. It cannot promote a reference, create a production visual or substitute for canonical-master review.

The governed intake sequence is now explicit:

**reference-only intake → source/rights provenance attestation → explicit reference review APPROVED or RETURNED**

New references cannot arrive pre-approved through the generic editor. Generic editing cannot rewrite the decision or approval/governance identity. An APPROVED decision is required before the reference becomes `reference-approved` / `approved-reference`.

## Drift and re-review behaviour

The approval is evidence-bound rather than a loose status flag. Source checksum, path/type, licence/rights evidence, reference role/view use, pack membership or provenance-attestation basis drift makes the saved decision stale.

When changed source/right evidence is explicitly re-attested, the old reviewer decision is retained as historical evidence but its authority is invalidated: the reference returns to `reference-only` / `not-reviewed` until staff records a new review decision. Re-attesting unchanged evidence is treated as a non-destructive reaffirmation and does not unnecessarily invalidate a current approval.

The existing nine Y62 owner references had already been approved through owner-source intake in the preceding Alpha state. Their approvals are therefore migrated explicitly into the new decision contract with `legacyMigration: true`, rather than inventing a new reviewer approval. All nine remain reference-only and non-production.

## Downstream governance binding

The owner reference-pack gate now requires a **current APPROVED reference review decision** as well as current provenance attestation. The canonical master-set registry exposes review-decision freshness for every required owner reference.

The canonical review gate now persists the exact reference-review decision snapshot in canonical review evidence and fails closed if that decision changes or becomes stale after review.

The immutable canonical production evidence seal is advanced to schema `0.26.25` and now binds the exact approved reference-review decision SHA-256 and basis SHA-256 for every required owner reference, both in the live reference snapshot and the canonical-review evidence snapshot. Later reference decision drift leaves historical production evidence cryptographically intact while staff comparison reports the drift explicitly.

This closes the chain from reference intake through canonical production without allowing a governance flag alone to stand in for reviewer authority.

## Staff visibility

Render Assets now exposes **REFERENCE REVIEW DECISION** beside each reference record, including:

- APPROVED / RETURNED / unrecorded state;
- CURRENT / STALE / INVALID / MISSING freshness;
- reviewer and decision time;
- current provenance-attestation state;
- decision SHA-256 and evidence-basis SHA-256;
- explicit **APPROVE CURRENT REFERENCE EVIDENCE** and **RETURN TO INTAKE** actions for fitment/admin staff.

Production Readiness shows reference-review approval and provenance-attestation status together so staff can identify the exact evidence blocking a pack or canonical master. Sales remains inspection-only.

Attested source/right/checksum/camera evidence is sealed from the generic editor; replacement evidence must pass the governed intake/re-attestation/re-review lane.

## Governed Y62 state after this push

The clean verification state remains deliberately conservative:

- 9 owner references;
- 9/9 current source/rights provenance attestations;
- 9/9 current APPROVED reference review decisions;
- all 9 current decisions explicitly marked as migration from the pre-existing owner-source-intake approval evidence;
- all owner references remain `reference-only` and `productionEligible: false`;
- owner pack `Y62-OWNER-REFERENCE-PACK-V1` remains COMPLETE;
- owner-pack manifest SHA-256 remains `260a875ef1a787d477178faaa21e897a225a8113fa6d02cab73840e012fe0342`;
- 3 governed canonical masters;
- 1 WF3 candidate: `Y62-F34-V1-CANDIDATE-02`;
- F34 remains `blocked-upstream`;
- SIDE and R34 remain `awaiting-wf3-candidate`;
- the required SIDE source-geometry gap remains explicit;
- 0 assigned canonical reviewers;
- 0 approved canonical reviewer decisions;
- 0 real canonical production evidence seals;
- 0 production-eligible Y62 visuals.

No artwork, owner-reference binary or customer production pointer was created, modified or promoted in this package.

## Runtime / backend scope

Backend changes are limited to the active reference-governance delivery lane required to persist and enforce the new decision boundary:

- dedicated fitment/admin reference review endpoint;
- same decision operation in browser-local staff mode;
- existing render-asset persistence and audit ledger reused;
- existing governance write boundary extended to protect the new decision and reference approval identity;
- changed-evidence provenance re-attestation now invalidates reviewer authority safely;
- no new database table or parallel API/runtime was introduced.

No customer-facing presentation/data/render contract was changed.

## Verification

- Targeted reference review decision + endpoint regression — **PASS**.
- Canonical production evidence seal regression, including persisted reference-review decision binding and drift visibility — **PASS**.
- Complete Alpha regression chain (`npm test`) — **PASS**.
- `npm run check` — **PASS**.
- WF5 governed promotion lifecycle — **PASS**.
- WF5 acceptance — remains **RED only for the pre-existing WF1 `WF1-BOM-ANYOF` defect**; `WF4-DIRECT-PRODUCTION-REVIEW` and customer draft/reference isolation remain PASS.
- Static syntax / JSON / HTML local-reference verification — **PASS**; see `WF4_REFERENCE_REVIEW_STATIC_VALIDATION.json` for exact counts.
- `assets/` + `references/` — **16/16 byte-for-byte unchanged** from the Push 52 input checkpoint.
- 11 customer-critical presentation/data/render-contract files — **11/11 byte-for-byte unchanged** from the Push 52 input checkpoint.

## Next dependency

The primary dependency remains **A26-WF4-14B / WF3**: supply the first genuinely clean, reviewable `Y62-F34-V1` candidate with clean reconstruction/isolation, locked overlay + camera acceptance, production-binary rights provenance and identified reviewer evidence.

That unlocks the real end-to-end governed chain:

**review-approved + attested owner references → WF3 candidate handoff → reviewer claim → canonical APPROVED decision → canonical review evidence → immutable production evidence seal → exact composite eligibility → sealed project/quote inspection**.
