# Push 50 — WF4 Persisted Canonical Review Decision / Approval Envelope

## Package advanced
**A26-WF4-22 — Persisted Canonical Review Decision / Approval Envelope** only.

This package closes the remaining reviewer-authority gap between the persisted reviewer assignment and immutable canonical production approval. It does not advance WF1/WF2/WF3, create visual artwork, or add a second runtime/persistence backbone.

## What changed
A new shared `canonical-review-decision.js` governance module persists an explicit reviewer verdict on a governed canonical master. The envelope is `REFERENCE_BACKED_APPROVED_VISUALS_ONLY`, `authority: review-decision-only`, and `productionEligible: false`.

Each decision is SHA-256 bound to:
- canonical master + canonical brief/review contract;
- owner reference-pack identity/manifest and exact required reference snapshots;
- current source/right provenance-attestation basis for each required reference;
- WF3 candidate handoff ID/SHA and exact candidate checksum;
- current evidence-bound reviewer workflow/assignment;
- locked per-check review results, source-gap resolution, reviewer identity and decision timestamp.

The identified assigned `fitment`/`admin` reviewer may explicitly record either `approved` or `returned`. Approval requires every locked canonical check to pass and any required source gap to be approved. A return requires a failed check or reviewer note. Sales remains inspection-only.

## Production enforcement
The existing direct-upsert and immutable version-promotion lanes now fail closed unless the canonical master has a **current `approved` decision** belonging to the assigned reviewer and matching the exact candidate/binary SHA-256. The final immutable promotion evidence mirrors the decision SHA, evidence-basis SHA, candidate checksum, reviewer and timestamp.

`canonicalReviewDecision` is now protected by the existing governance write boundary. Generic render-asset editing receives `409 governance_metadata_protected`; only the dedicated reviewer-decision path can replace it. Reference/evidence/assignment/checksum drift makes a saved decision stale rather than allowing approval to float onto different evidence.

## Staff visibility
Render Assets now includes a **CANONICAL REVIEW DECISION** panel with decision/freshness, identified reviewer, candidate checksum, decision SHA, evidence-basis SHA, and dedicated **RECORD APPROVAL DECISION** / **RETURN CANDIDATE** actions. Production Readiness exposes the same persisted decision state against each canonical master. Governance Attention incorporates decision freshness when a review is assigned.

No customer runtime or visual contract was changed.

## Current governed Y62 state
A clean governance sync reports:
- 9 owner references;
- 3 governed canonical masters;
- 0 production-eligible visuals;
- 3/3 canonical reviewer decisions `UNRECORDED` (correct because no real reviewable candidate is currently claimed);
- F34 remains `Y62-F34-V1-CANDIDATE-02` / `blocked-upstream` / `master-draft`;
- SIDE and R34 remain `awaiting-wf3-candidate` / `master-draft`;
- governance-attention snapshots remain 3/3 current with the existing 10 blockers / 6 staff actions;
- owner pack remains `Y62-OWNER-REFERENCE-PACK-V1`, manifest SHA-256 `260a875ef1a787d477178faaa21e897a225a8113fa6d02cab73840e012fe0342`.

This package deliberately does **not** manufacture an approval decision for blocked or absent WF3 candidates.

## Adversarial verification
The new targeted regression proves:
- decision cannot be recorded before reviewer assignment;
- approval cannot be recorded with pending locked checks;
- wrong reviewer cannot decide;
- `returned` persists but cannot promote or stage a binary;
- `approved` persists with deterministic decision/evidence fingerprints;
- candidate checksum is part of the approval authority;
- generic decision tampering is blocked by the shared write boundary;
- sales receives 403 on the decision endpoint; assigned fitment reviewer succeeds;
- backing-reference drift makes the persisted decision stale;
- stale decision blocks canonical production evidence preparation;
- decision and blocked-write events remain on the tamper-evident audit chain.

The existing canonical review evidence regression also proves the decision is mirrored into immutable promotion evidence.

## Shared-runtime / no-visual-change proof
The complete `assets/` + `references/` trees remain **16/16 byte-for-byte identical** to Push 49. All 11 checked customer-critical entrypoints/data/render-contract files are also byte-identical. No visual, production binary or production pointer was created, changed or promoted by this package.

## Verification
- `npm test`: PASS.
- `npm run check`: PASS.
- `npm run test:wf4-review-decision`: PASS.
- `npm run test:wf5-promotion`: PASS.
- WF5 acceptance: expected FAIL only on the pre-existing WF1 `WF1-BOM-ANYOF` defect; `WF4-DIRECT-PRODUCTION-REVIEW` PASS and `WF5-CUSTOMER-DRAFT-ISOLATION` PASS.
- Static verification: **124 JavaScript files / 0 failures, 46 JSON files / 0 failures, 16 HTML files / 291 local references / 0 missing**.

## Next dependency
The next primary dependency remains **A26-WF4-14B / WF3**: supply the first genuinely clean, reviewable `Y62-F34-V1` candidate with clean reconstruction/isolation, locked overlay + camera acceptance, production-rights provenance and reviewer-ready evidence. That will let WF4 exercise the real chain:

**attested owner references → WF3 handoff → reviewer claim → persisted APPROVED/RETURNED decision → canonical evidence → immutable production → exact composite eligibility → sealed project/quote inspection**.
