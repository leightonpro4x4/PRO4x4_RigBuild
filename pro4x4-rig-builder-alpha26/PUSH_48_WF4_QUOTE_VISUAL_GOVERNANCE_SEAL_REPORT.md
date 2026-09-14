# PRO4X4 Rig Builder — Push 48 / WF4 Push 20

## A26-WF4-20 — Persisted Quote Visual-Governance Seal / Canonical Evidence Inspection

### Scope advanced

This push advances **one WF4 package only**: project/quote inspection of visual-governance evidence. It does not advance WF3 artwork production, catalogue breadth, customer UX, or speculative backend infrastructure.

The active policy remains:

**`REFERENCE_BACKED_APPROVED_VISUALS_ONLY`**

The package closes the gap between the existing immutable project/quote lineage and the persisted visual-governance registry. At first quote submission, the quote now receives a SHA-256 evidence seal that records exactly what governed visual evidence existed for the quoted vehicle/view at that point in time.

### Delivered

A new shared module, `quote-visual-governance-seal.js`, is used by the server, browser-local adapter and mock API. It persists an inspection-only quote evidence packet containing:

- the frozen render/view/layer snapshot and its SHA-256;
- the exact governed canonical master for the quoted vehicle/view, when registered;
- canonical brief/camera/review-contract identity;
- the bound owner reference pack and manifest SHA-256;
- exact owner-reference snapshots required by that canonical master, including source checksum, rights state, reference-only status and provenance-attestation fingerprint;
- the persisted WF3 candidate handoff/candidate checksum and upstream intake state;
- reviewer dossier/workflow state, canonical review evidence and readiness evidence when present;
- any resolved production layer evidence already frozen into the quote.

The packet is explicitly **inspection-only** and **non-promotional**. It cannot approve a canonical master, grant production rights, stage a binary, move a production pointer, or make a reference customer-visible.

### Quote-time evidence is now immutable

After the visual-governance seal is created, staff may still perform normal quote workflow/pricing edits, but they cannot replace the quote's frozen render/view/layer state. A mutation attempt fails closed with:

`409 quote_visual_lineage_immutable`

The seal itself is tamper-evident. Regression coverage directly alters the persisted quote-time evidence without recomputing its fingerprint and the staff inspector correctly returns a blocked state with an invalid-seal fingerprint problem.

Current registry changes do **not** rewrite historical quote evidence. Instead, the staff inspector compares the present canonical/reference-pack state with the sealed quote-time snapshot and reports **verified-with-drift** when they differ. This preserves both the historical decision basis and current staff visibility.

### Staff visibility

The existing Sales / project-quote inspection surface now includes **SEALED VISUAL GOVERNANCE EVIDENCE**. Staff can see, alongside the frozen render and immutable project revision:

- seal state and fingerprint;
- canonical master asset ID, brief, registry status and governance state;
- **REFERENCE PACK** ID, manifest fingerprint and required-reference count;
- WF3 handoff / reviewer dossier state;
- camera, review and readiness state;
- each sealed owner-reference record with checksum, licence state, provenance-attestation fingerprint and explicit production eligibility;
- the present canonical registry state versus the quote-time state.

The existing staff-only lineage endpoint carries the same evidence. Customer role access remains denied.

### Concrete governed Y62 evidence

A synced verification quote produced the following persisted evidence:

- quote seal SHA-256: `4e1df26b8b7843870ed8d44298c74127bb8c31e9664de1d3636773ecadc25728`
- frozen render SHA-256: `931e092bf501d16ef52ee06b2e4d26d1ef3f9dc97809e6921a2c7395a14cd0db`
- canonical master: `Y62-F34-V1-MASTER`
- canonical brief: `Y62-F34-V1`
- reference pack: `Y62-OWNER-REFERENCE-PACK-V1`
- pack manifest SHA-256: `260a875ef1a787d477178faaa21e897a225a8113fa6d02cab73840e012fe0342`
- sealed owner references: `OWNER-Y62-F34-01`, `OWNER-Y62-F34-02`, `OWNER-Y62-FRONT-01`
- WF3 candidate: `Y62-F34-V1-CANDIDATE-02`
- candidate SHA-256: `a353980a92131b960fed91baa46609bc63c1ec07a485fd4612fa305f0f7cea28`
- handoff SHA-256: `65499126b33adddd48591a2d35a4ad33f773c4c3659bfa4c5289567333160cba`
- WF3 intake: `blocked-upstream`

This is deliberately evidence of a **blocked** governed state, not an approval. A fresh governance sync still reports **0 production-eligible Y62 visuals**. F34 remains `master-draft` / `blocked-upstream`, R34 remains `awaiting-wf3-candidate`, and SIDE remains `awaiting-wf3-candidate` with its source gap preserved.

### Shared runtime / backend boundary

No second project store, quote store, render registry, approval system or database lane was introduced. The package reuses:

- the existing `quotes` payload persistence;
- the existing render-asset registry and immutable version lineage;
- the existing project/revision/share lineage inspector;
- the existing staff lineage endpoint;
- the existing browser-local/mock adapters.

Server changes are limited to the active quote-inspection lane: creating/preserving the seal, rejecting frozen-render mutation, and supplying the current governed asset set to the existing inspector.

### Visual safety

No visual asset was created, edited or promoted.

The complete `assets/` + `references/` trees are **byte-for-byte identical** to Push 47 / WF4 Push 19: 16 files before and 16 files after, with zero additions, removals or checksum changes.

Ten of the eleven pre-recorded customer-critical visual/catalogue/render files are byte-identical. `index.html` changed only to load the shared quote visual-governance seal module; `merged-app.js`, project/render contracts, Y62/Ranger data, app JS and customer styling remain byte-identical.

### Verification

- targeted existing WF4 project/quote lineage tests: **PASS**
- new quote visual-governance seal regression: **PASS**
- new staff endpoint / 409 mutation / customer-role guard regression: **PASS**
- sealed-evidence tamper detection: **PASS**
- complete Alpha regression chain (`npm test`): **PASS**
- `npm run check`: **PASS**
- WF5 governed promotion lifecycle: **PASS**
- browser journey: **SKIPPED by managed-browser policy** because local HTTP navigation is blocked in this environment; this is not an application test failure
- static validation: **120 JavaScript / 0 failures; 38 JSON / 0 failures; 16 HTML / 284 local references / 0 missing**
- final ZIP integrity: **PASS**

The wider WF5 acceptance gate remains red for exactly the pre-existing **WF1 `WF1-BOM-ANYOF`** defect. `WF4-DIRECT-PRODUCTION-REVIEW` remains PASS and `WF5-CUSTOMER-DRAFT-ISOLATION` remains PASS. No WF1 work was performed in this package.

### Next dependency

The primary WF4 dependency remains **A26-WF4-14B**: WF3 must supply the first genuinely clean, reviewable `Y62-F34-V1` candidate with clean reconstruction/isolation, locked overlay + camera acceptance, production-rights provenance and identified reviewer evidence.

Once that exists, WF4 can exercise the real sealed chain end-to-end:

**attested owner reference pack → WF3 handoff → reviewer claim → canonical approval → immutable production → exact layer/composite eligibility → sealed audit → quote-time governance seal / project inspection**.
