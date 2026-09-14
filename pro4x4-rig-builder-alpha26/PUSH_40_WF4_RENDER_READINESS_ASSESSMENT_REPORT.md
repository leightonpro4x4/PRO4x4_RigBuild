# Push 40 — WF4 persisted canonical render-readiness assessment

**Package:** A26-WF4-12  
**Lane:** WF4 — Platform / Staff Tools  
**Policy:** `REFERENCE_BACKED_APPROVED_VISUALS_ONLY`  
**Scope:** One WF4 package only — persisted render-readiness controls for governed canonical masters.

## Why this package was next

The intended next end-to-end WF4 exercise remains dependent on a genuinely clean, reviewable `Y62-F34-V1` candidate from WF3. That binary is not yet available for promotion. The highest-priority unblocked WF4 prerequisite was therefore to make canonical readiness a persisted, auditable decision rather than a transient UI calculation.

This push closes the risk that staff could view an old readiness decision after the backing owner/reference evidence, canonical record, review state, rights state, camera state or immutable production lineage had changed.

A readiness assessment is evidence of the current governance state. **It is not an approval token and it never grants production eligibility.**

## Delivered

### 1. Shared persisted readiness governance

Added `render-readiness-governance.js` as one shared browser/server policy module. It evaluates canonical masters against the existing visual-governance backbone and computes:

- readiness verdict: `ready` or `blocked`;
- explicit blocker codes and messages;
- exact backing reference snapshots;
- current immutable version summary;
- deterministic evidence basis;
- SHA-256 evidence fingerprint;
- freshness state: `unassessed`, `current`, `stale`, or `invalid`.

The policy remains `REFERENCE_BACKED_APPROVED_VISUALS_ONLY` and reuses the existing canonical review gate rather than creating a parallel approval system.

### 2. Persisted metadata on the canonical master record

`server/database.js` now persists `readinessAssessment` on each canonical-master render asset through the existing `render_assets` backbone. The record includes:

- policy and schema version;
- current verdict and blockers;
- SHA-256 evidence fingerprint and fingerprint basis;
- backing owner/reference evidence snapshots;
- immutable production-version summary;
- assessor identity and timestamp.

Assessment writes an existing-chain audit event `render.readiness.assessed`. It does **not** mutate the asset status, governance state, candidate binary, production eligibility, reviewer approval, version lineage, or production promotion state.

### 3. Stale-evidence invalidation

Readiness reads now recompute the current evidence fingerprint and compare it with the persisted assessment. If any governed evidence changes, the former decision becomes visibly `stale` rather than remaining apparently current.

The regression specifically mutates a backing owner-reference checksum after assessment. The old assessment becomes stale immediately; a deliberate reassessment then seals the new current evidence without auto-approving the master.

### 4. Staff endpoint and role gate

Added:

`POST /api/v1/staff/render-readiness/assess`

The operation uses the existing server/runtime/database. `fitment` and `admin` roles can persist an assessment. `sales` can inspect readiness but receives HTTP 403 if it attempts to write governance assessment state.

The local browser adapter mirrors the same governed action so local and hosted staff runtimes do not diverge.

### 5. Production Readiness staff visibility

The Production Readiness screen now includes **ASSESS + PERSIST READINESS** and displays a dedicated persisted assessment block for every canonical master:

- `NOT ASSESSED`;
- `BLOCKED · CURRENT` / `READY · CURRENT`;
- `STALE ASSESSMENT` with `CURRENT GOVERNANCE CHANGED — REASSESS REQUIRED`;
- invalid stored-evidence state.

Current live blockers are rendered independently of the stored decision. A stale historic assessment can therefore never mask the current governance state.

## Current governed Y62 readiness

A clean in-memory sync + assessment against the merged Alpha registry returns **3 canonical masters, 0 ready, 3 blocked**.

### `Y62-F34-V1-MASTER`

Current blockers:

1. `MASTER_APPROVAL` — still `master-draft`.
2. `PRODUCTION_BINARY` — registry state remains candidate, not production-ready.
3. `RIGHTS` — production usage rights are not yet recorded as owned/licensed for the canonical binary.
4. `CAMERA_MATCH` — locked camera/view contract has not passed.
5. `REVIEW_EVIDENCE` — identified reviewer + valid review timestamp are not complete.
6. `CANONICAL_REVIEW` — locked canonical review evidence remains incomplete.

The assessment snapshots all **3 backing owner reference records**. Those remain `reference-only` and `productionEligible: false`.

### `Y62-SIDE-V1-MASTER`

Carries the same core production blockers plus `SOURCE_GAP`: the required clean square-on side geometry gap has no persisted approved resolution. This is intentionally exposed rather than inferred away.

### `Y62-R34-V1-MASTER`

Carries the same six core blockers as F34. It remains behind the F34 production priority.

## Safety / scope verification

This push did not create, edit, promote or substitute any customer visual.

- `assets/`: **7 files**, byte-for-byte identical to Push 11.
- `references/`: **9 files**, byte-for-byte identical to Push 11.
- Customer runtime comparison: **all 11 checked files byte-identical** to Push 11 (`index.html`, app/runtime JS/CSS, Y62/Ranger data, render manifest, product visual contract, quote/share/projects).
- No customer UX path was altered.
- No Y62 canonical master or candidate was promoted.

## Regression / validation

All WF4 package checks are green:

- `npm run check` — PASS.
- Full Alpha regression suite — PASS, including new `wf4-render-readiness-assessment-alpha26.js`.
- New WF4 readiness regression — PASS:
  - 3 canonical masters assessed;
  - persisted on canonical master;
  - SHA-256 fingerprint enforced;
  - 3 owner-reference snapshots captured for F34;
  - reference mutation makes assessment stale;
  - deliberate reassessment restores current state without promoting;
  - audit events remain SHA-256 chained;
  - staff endpoint passes;
  - sales write-role gate returns 403;
  - visual promotion remains false.
- WF5 governed promotion lifecycle — PASS.
- JavaScript syntax: **102 files / 0 failures**.
- JSON parse: **12 files / 0 failures**.
- HTML/local dependency validation: **16 HTML files / 261 local references / 0 missing**.

The broader WF5 acceptance gate remains red for exactly one existing, unrelated item:

- `WF1-BOM-ANYOF` — FAIL: saved project/quote lineage does not yet preserve an unsatisfied `anyOfRequiredParts` gate after its supporting bar is removed.
- `WF4-DIRECT-PRODUCTION-REVIEW` — PASS.
- `WF5-CUSTOMER-DRAFT-ISOLATION` — PASS.

## Next dependency

WF4's next production-path package is now **A26-WF4-13** and remains correctly blocked on WF3 supplying the first genuinely clean, reviewable `Y62-F34-V1` canonical candidate.

That candidate must arrive with clean reference-backed geometry/isolation, the locked F34 overlay review completed, camera/view match passed, production rights/provenance recorded, and identified reviewer evidence. WF4 can then exercise the real owner-reference → canonical master → review contract → identified reviewer → immutable production → sealed audit → project/quote inspection chain end-to-end.

Until then, F34, SIDE and R34 correctly remain blocked rather than using guessed or unsupported geometry.
