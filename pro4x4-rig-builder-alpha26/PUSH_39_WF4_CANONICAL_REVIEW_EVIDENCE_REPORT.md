# PRO4X4 Rig Builder — Alpha 26 WF4 Push 11
## Persisted Canonical Review Evidence / Locked Review-Contract Gate

**Owner:** WF4 — Platform / Staff Tools  
**Package:** A26-WF4-11  
**Version:** 0.26.11  
**Production rule:** `REFERENCE_BACKED_APPROVED_VISUALS_ONLY`  
**Customer feature work:** none  
**Visual asset creation/promotion:** none in the shipped package

## Why this was the highest-priority unfinished WF4 package

The Y62 canonical-view registry already persisted the F34/SIDE/R34 master contracts and the owner reference pack, and the production gate already required an identified reviewer. The remaining governance gap was that a real F34 candidate could still be represented by a generic `master-approved` state without persisting the **locked F34 overlay review contract itself** — its eight required checks and the exact reference evidence used for that decision.

This push closes that gap for governed canonical masters before the first clean WF3 F34 production candidate arrives.

## Concrete progress

### 1. Shared canonical-review gate added

Added `canonical-review-gate.js` as one shared browser/server policy module. It applies to canonical base assets with a persisted `canonicalView.briefId` and verifies:

- canonical brief identity;
- required reference records are present;
- each required reference remains `assetClass: reference`;
- each required reference remains `status: reference-only`;
- each required reference is `reference-approved`;
- `referenceEvidence.productionEligible` remains `false`;
- each required reference has a valid SHA-256;
- the candidate is bound to the expected review contract;
- every required contract check is individually persisted as `pass`;
- a required source-gap resolution is explicitly approved where the canonical brief declares one;
- the candidate binary has a valid SHA-256;
- `master-approved` carries reviewer identity and a valid review timestamp.

For `Y62-F34-V1`, this binds directly to `Y62-F34-V1-OVERLAY-01` and its eight required checks:

1. identity;
2. stance;
3. wheel centres;
4. silhouette;
5. factory wheels;
6. transparency;
7. edge quality;
8. no invented accessories.

### 2. Server-generated immutable canonical review evidence

When a governed canonical candidate enters `master-approved`, the server now builds and persists `canonicalReviewEvidence` from the candidate plus the registered reference records. It contains:

- schema/version;
- pass verdict;
- canonical brief ID;
- view ID;
- locked review-contract ID;
- candidate SHA-256;
- reviewer identity and review timestamp;
- complete required-check result set;
- exact reference snapshots containing reference ID, SHA-256, governance state, source type, rights status and authenticity role;
- explicit source-gap resolution where required.

The evidence is therefore tied to the exact candidate binary and the exact authenticity evidence that was reviewed.

### 3. Evidence is revalidated at production promotion

Both governed direct production upsert and immutable candidate-version promotion now re-run the canonical evidence gate. Production is blocked if:

- review evidence is missing;
- a required check is missing or not `pass`;
- contract/brief identity changes;
- candidate checksum differs from the reviewed checksum;
- reviewer identity/timestamp differs from the review evidence;
- a required reference disappears or ceases to be approved reference-only evidence;
- a required reference checksum changes after review;
- a required source gap is unresolved.

Candidate approval failures return `canonical_review_gate_blocked`; final production-gate failures return `asset_gate_blocked`.

### 4. Staff reviewer visibility expanded

The existing Render Assets reviewer now exposes a **CANONICAL REVIEW CONTRACT** panel for governed masters. It shows:

- exact contract identity;
- all required checks with PENDING / PASS / FAIL state;
- per-check notes;
- required source-gap resolution where applicable;
- persisted evidence checksum/reviewer/verdict;
- exact reference snapshots used by the review.

Production Readiness now includes canonical-review blockers and reports a persisted pass with the number of checks and backing reference snapshots when the gate is satisfied.

### 5. Registry metadata remains safe to sync

Canonical slots now initialise a versioned `canonicalReview` draft without implying approval. Visual-governance sync only backfills this static review structure when it is absent; it does not overwrite candidate review results, reviewer state, production evidence or version lineage.

### 6. Shared runtime preserved

No second persistence layer or separate review service was created. The package uses the existing:

- render-asset registry;
- immutable asset-version lineage;
- asset vault metadata;
- visual-governance registry;
- audit chain;
- staff backend adapter;
- production resolver.

The browser-local staff adapter mirrors the same canonical review gate for parity; hosted/server enforcement remains authoritative.

## Acceptance / verification evidence

### New targeted regression

`tests/wf4-canonical-review-evidence-alpha26.js` passes and proves:

- the governed `Y62-F34-V1-MASTER` persists the locked F34 review contract;
- direct production cannot bypass the eight per-check review requirements;
- a candidate cannot persist `master-approved` with incomplete contract results;
- a completed F34 review generates immutable evidence for all 8 checks and all 3 required owner references;
- the evidence checksum is exactly the staged candidate checksum;
- mutating a required reference checksum after review invalidates promotion;
- restoring the reviewed reference evidence permits promotion in the isolated synthetic test database;
- promotion audit evidence contains the canonical review verdict/contract/reference snapshots;
- reference records remain `reference-only`, `reference-approved`, `productionEligible: false`.

The synthetic promotion exists only in the in-memory regression database. **No production visual in the packaged registry was promoted.**

### Full regression

- `npm test` — **PASS**, including the complete Alpha 12 → Alpha 26 chain and the new canonical-review test.
- `npm run check` — **PASS**.
- `npm run test:wf5-promotion` — **PASS**; draft isolation, reviewer evidence, resolver state and immutable project/share/quote visual lineage remain intact.
- WF5 acceptance re-check — **WF4 PASS / WF5 draft isolation PASS**. The overall gate remains red solely for the pre-existing WF1 `anyOfRequiredParts` BOM-lineage defect.

### Static/package validation

- JavaScript syntax: **100 files / 0 failures**.
- JSON parse: **12 files / 0 failures**.
- HTML dependency scan: **16 HTML files / 260 local references / 0 missing**.
- `assets/` tree vs Push 10: **byte-identical**.
- `references/` tree vs Push 10: **byte-identical**.
- Customer runtime files `index.html`, `app.js`, `merged-app.js`, `merged.css`, `data-y62.js`, `data-ranger.js`, `render-manifest-y62.js`: **byte-identical to Push 10**.

QA evidence is stored under `qa-evidence/`:

- `WF4_CANONICAL_REVIEW_EVIDENCE_ALPHA_REGRESSION.log`
- `WF4_CANONICAL_REVIEW_EVIDENCE_SERVER_CHECK.log`
- `WF4_CANONICAL_REVIEW_EVIDENCE_WF5_PROMOTION.log`
- `WF4_CANONICAL_REVIEW_EVIDENCE_WF5_ACCEPTANCE.log`
- `WF4_CANONICAL_REVIEW_EVIDENCE_VALIDATION.json`

## Policy status

`REFERENCE_BACKED_APPROVED_VISUALS_ONLY` remains authoritative.

This package does **not** approve the current `Y62-F34-V1-CANDIDATE-02`. The real WF3 candidate remains outside production until it independently satisfies the locked review contract, production rights, clean transparency/edge requirements, camera match, candidate checksum, identified reviewer evidence and the existing audit/production gate.

External exact-vehicle images remain authenticity/reference evidence only unless separately governed rights allow another use. No guessed or unsupported geometry is converted into production output by this package.

## Next WF4 dependency

The next primary dependency is the first genuinely clean and reviewable **`Y62-F34-V1`** candidate from WF3.

Once supplied, WF4 should run one end-to-end real evidence path through:

**owner reference pack → canonical master candidate → 8-check `Y62-F34-V1-OVERLAY-01` review → identified reviewer → persisted reference/checksum evidence → immutable production promotion → sealed audit evidence → project/quote inspection.**

SIDE remains blocked by its explicit required clean-side/source-gap state and must not be inferred or reconstructed into certainty without reviewable evidence.
