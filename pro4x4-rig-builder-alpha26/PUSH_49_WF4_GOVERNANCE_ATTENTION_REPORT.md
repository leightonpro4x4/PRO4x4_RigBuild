# PRO4X4 Rig Builder — Push 49 / WF4 Push 21

## A26-WF4-21 — Persisted Governance Attention Queue / Evidence Drift Inbox

### Scope
This push advances one WF4 package only. It does not create a second visual registry, runtime, API lane or production-authority path. The existing render-asset registry remains the shared backbone and `REFERENCE_BACKED_APPROVED_VISUALS_ONLY` remains authoritative.

The package closes the staff-visibility gap created as WF4 governance became richer: reference-pack integrity, provenance attestations, WF3 handoff state, reviewer dossier/workflow, canonical review, readiness evidence and source-gap status were individually governed, but staff did not have one persisted actionable view showing which exact governance work remains on each canonical master.

### Delivered
A new shared `visual-governance-attention.js` module persists a checksum-addressed attention snapshot on every governed canonical master. Each snapshot is explicitly `inspection-and-routing-only` and `productionEligible: false` and includes:

- exact canonical-master identity and view brief;
- owner reference-pack identity, manifest and required evidence checksums;
- WF3 candidate/handoff identity and current intake state;
- reviewer dossier and assignment-workflow freshness;
- canonical-review evidence state;
- persisted render-readiness freshness/current verdict;
- required source-gap state;
- governance-write-boundary freshness;
- normalized blocker/action records with owning lane and next staff action;
- SHA-256 basis and attention fingerprints.

The snapshot is now protected as system-managed metadata by the existing governance write boundary. The generic Render Assets editor cannot forge or rewrite it. Evidence changes cause the persisted snapshot to become stale; governance sync recomputes it against the current evidence and writes the refresh into the existing tamper-evident audit chain without changing approval, binary, lineage or production state.

### Staff visibility
Production Readiness now includes a dedicated **GOVERNANCE ATTENTION QUEUE**. It shows total open blockers, staff actions and snapshot drift, then one evidence-linked card per canonical master with current/stale status and the next required action.

Render Assets now shows a **GOVERNANCE ATTENTION SNAPSHOT** on each canonical master, including the persisted SHA-256, evidence freshness, blocker/action count and the top actionable items beside the existing owner reference-pack, provenance, WF3 handoff, dossier and reviewer controls.

Staff-only presentation is isolated in `governance-attention.css`; the 11 checked customer presentation/data/render-contract files remain byte-for-byte unchanged from Push 48.

### Current governed state
A clean registry sync produces three current persisted attention snapshots and **0 production-eligible Y62 visuals**:

- `Y62-F34-V1-MASTER` — 3 blockers / 2 staff actions. Attention SHA-256 `38837f3283d4ee8b67501b98d0491addfb79d4650e4efe5e6e6d80450034d547`. It remains bound to `Y62-F34-V1-CANDIDATE-02` and correctly reports the candidate as `blocked-upstream`.
- `Y62-SIDE-V1-MASTER` — 4 blockers / 2 staff actions. Attention SHA-256 `65c4c1148411b28006c9bfc5048b25ebc65a07896c11cdac595721acc1f623ce`. It remains `awaiting-wf3-candidate` and preserves the required SIDE source-geometry gap as a separate blocker.
- `Y62-R34-V1-MASTER` — 3 blockers / 2 staff actions. Attention SHA-256 `951d6ed04132c3f8a2505e1b3ffae4ff3a15b2d2a74eaa733af1d9b06b1b377d`. It remains `awaiting-wf3-candidate`.

Across the three masters the clean queue contains **10 blockers and 6 staff actions**. All remain bound to `Y62-OWNER-REFERENCE-PACK-V1`, manifest SHA-256 `260a875ef1a787d477178faaa21e897a225a8113fa6d02cab73840e012fe0342`.

### Fail-closed verification
The new adversarial regression proves that:

- a generic attempt to forge `governanceAttention` is rejected by the existing governance write boundary;
- changing a required owner-reference checksum makes the persisted canonical attention snapshot stale;
- the next governance sync refreshes the snapshot against the changed evidence;
- the refreshed F34 snapshot explicitly surfaces the resulting reference-pack/provenance problem;
- reference evidence remains `reference-only` and non-production-eligible;
- refreshing an attention snapshot cannot promote any visual;
- refresh activity is present on the existing audit chain.

### Regression status
Verification completed successfully for this WF4 package:

- targeted `wf4-governance-attention-alpha26` regression — PASS;
- complete Alpha regression chain — PASS;
- `npm run check` — PASS;
- WF5 governed promotion lifecycle — PASS;
- static validation — **122 JavaScript files / 0 failures, 42 JSON files / 0 failures, 16 HTML files / 289 local references / 0 missing**;
- `assets/` + `references/` — **16 files, byte-for-byte unchanged** from Push 48;
- 11 customer-critical presentation/data/render-contract files — **11/11 byte-for-byte unchanged**;
- visual promotions — **0**.

The wider WF5 acceptance gate remains red for exactly one pre-existing issue: **WF1 `WF1-BOM-ANYOF`**. `WF4-DIRECT-PRODUCTION-REVIEW` passes and `WF5-CUSTOMER-DRAFT-ISOLATION` passes. This WF4 package introduces no new acceptance failure.

### Next dependency
The primary dependency remains **A26-WF4-14B / WF3**: provide the first genuinely clean, reviewable `Y62-F34-V1` candidate with clean reconstruction/isolation, locked overlay and camera acceptance, production-rights provenance and identified reviewer evidence.

Once that lands, the persisted queue can move F34 from a blocked-upstream attention item into the real evidence-bound chain: **attested owner references → WF3 handoff → reviewer claim → eight-check canonical review → immutable production → exact layer/composite eligibility → sealed project/quote inspection**.
