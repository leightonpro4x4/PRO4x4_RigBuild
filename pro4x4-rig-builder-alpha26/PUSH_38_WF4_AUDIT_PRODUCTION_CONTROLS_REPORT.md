# PRO4X4 Rig Builder — Alpha 26 WF4 Push 10
## Tamper-Evident Audit / Production Controls

### Scope advanced
One WF4 package only: **tamper-evident persisted audit evidence plus a common production-control integrity gate for governed visual assets**.

This package adds no catalogue products, customer-facing product features, Y62 geometry or visual assets. Backend changes are limited to the active WF4 audit/production-control lane and continue to use the existing shared audit/runtime backbone.

### Concrete progress
- Added shared `audit-integrity.js` policy for browser-local and hosted runtime paths.
- New audit events are SHA-256 chained (`sha256-chain-v1`) using stable canonical JSON, each persisting:
  - previous event hash;
  - current event hash;
  - chain version.
- Hosted `RigDatabase.audit(...)` now seals all newly appended audit events before persistence.
- Added runtime verification of the persisted audit chain with explicit states:
  - `sealed`;
  - `sealed-with-legacy-prefix`;
  - `unsealed`;
  - `broken`.
- Added a shared production integrity gate to both production-capable visual paths:
  - direct `production-ready` render-asset upsert;
  - immutable asset-version promotion.
- A ledger that verifies as `broken`, `unsealed` or unavailable now blocks production with `audit_integrity_blocked` rather than allowing a visual approval/promotion to proceed.
- A legacy-only ledger may begin a new sealed epoch through an audited `audit.integrity.epoch.started` event; prior legacy history remains visible rather than being rewritten as trusted evidence.
- Added staff-only `GET /api/v1/staff/audit/integrity` and matching local/mock adapter support. Customer role is denied.
- Updated the staff Audit screen to expose:
  - ledger integrity status;
  - sealed / legacy / total event counts;
  - current chain-head SHA-256;
  - integrity problems;
  - SEALED / LEGACY event badges;
  - previous/current hash prefixes;
  - governed `render-asset` evidence including reviewer, review time, rights and checksum where present;
  - direct link back to the governed visual record.
- Browser-local audit writes use the same shared chain policy, avoiding a second governance model.
- The workflow board now records WF4 package 10 as the current completed package and keeps the real F34 production exercise as the next dependency.

### Persisted visual-governance protection
The production integrity check runs **before** a visual can enter production state. A later database mutation of an earlier sealed audit payload creates a deterministic `event_hash_mismatch` and causes subsequent production transition attempts to fail closed.

This directly protects the reviewer/provenance/checksum trail already persisted by earlier WF4 packages without creating a parallel event store or speculative infrastructure.

### REFERENCE_BACKED_APPROVED_VISUALS_ONLY
Preserved without exception.

This package promoted **zero** visual assets. The merged `Y62-F34-V1-CANDIDATE-02` remains:
- governance state: `master-draft`;
- production eligible: `false`;
- review decision: `returned-to-wf3`;
- SHA-256: `a353980a92131b960fed91baa46609bc63c1ec07a485fd4612fa305f0f7cea28`.

The complete `assets/` and `references/` trees remain byte-for-byte unchanged from the Push 09 checkpoint. No reference-only, master-draft, layer-draft or unsupported visual output was promoted.

### Targeted verification
`tests/wf4-audit-production-controls-alpha26.js` — **PASS**
- validates the standard SHA-256 test vector;
- verifies a fresh runtime audit ledger is fully sealed;
- verifies explicit visual-governance evidence is sealed while remaining `productionEligible: false`;
- verifies staff integrity endpoint access;
- verifies customer role denial;
- mutates a prior persisted audit payload and detects `event_hash_mismatch`;
- verifies a broken chain blocks direct production transition with `audit_integrity_blocked`;
- verifies the staff Audit UI loads the shared integrity helper before the local audit store.

### Regression / integration verification
- Full Alpha regression chain (`npm test`) — **PASS**.
- Server/static contract checks (`npm run check`) — **PASS**.
- WF5 positive governed promotion lifecycle (`npm run test:wf5-promotion`) — **PASS**.
- JavaScript syntax: **98 files / 0 failures**.
- JSON parsing: **12 files / 0 failures**.
- HTML dependency scan: **16 pages / 253 local references / 0 missing**.
- Audit helper load ordering: **0 failures**.
- Fresh in-memory runtime integrity: **22 / 22 seeded events sealed**, 64-character chain head, **0 integrity problems**, **0 production-ready events**.
- `assets/` diff against Push 09 — **no changes**.
- `references/` diff against Push 09 — **no changes**.

WF5's broader acceptance command remains red for exactly the already-returned issue outside this WF4 package:
- `WF1-BOM-ANYOF` — FAIL: unsatisfied `anyOfRequiredParts` does not yet survive into the saved project/quote gate after its supporting part is removed.
- `WF4-DIRECT-PRODUCTION-REVIEW` — PASS.
- `WF5-CUSTOMER-DRAFT-ISOLATION` — PASS.

No WF4 acceptance criterion was returned by this push.

### Next WF4 dependency
The primary next dependency remains the first genuinely clean and reviewable **`Y62-F34-V1` canonical master candidate** from WF3 with isolation/reconstruction, locked overlay acceptance, provenance/production rights and identified reviewer evidence complete.

Once supplied, WF4 can exercise the real sealed chain end-to-end:

`owner/reference evidence → canonical master contract → identified reviewer → master-approved version → immutable production promotion → sealed audit evidence → quote/project inspection`

Until that candidate exists, guessed or unsupported Y62 geometry remains non-production and the audit gate now fails closed if its persisted governance evidence is tampered with.
