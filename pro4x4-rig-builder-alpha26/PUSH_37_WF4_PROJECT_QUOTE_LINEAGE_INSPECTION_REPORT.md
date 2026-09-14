# PRO4X4 Rig Builder — Alpha 26 WF4 Push 09
## Staff Project / Quote Inspection + Immutable Lineage Controls

### Scope advanced
One WF4 package only: **staff inspection of the immutable project → revision → share → quote → frozen render/evidence chain**.

This package does not add customer product features, catalogue records, product imagery or production visual output. Backend changes are limited to what this staff inspection lane requires.

### Concrete progress
- Added shared `staff-project-quote-lineage.js` policy/inspector used by hosted and browser-local staff tooling.
- First quote submission with `project.id` + `project.revisionId` now persists a `quoteLineage` seal containing:
  - source project ID;
  - source immutable revision ID;
  - persisted source revision checksum;
  - full SHA-256 of the submitted snapshot;
  - seal time and actor.
- Staff quote updates and finalisation may change sales/review state but **cannot repoint the quote to another project revision**. Attempts are rejected with `quote_lineage_immutable`.
- Added staff-only `GET /api/v1/staff/quotes/{reference}/lineage` with sales / fitment / admin role protection.
- Added the same conceptual seal/repoint protection to local/mock adapters so there is no second quote-lineage model.
- Added a new Sales Queue **IMMUTABLE HANDOFF INSPECTION** panel showing:
  - source project and quoted revision vs current project revision;
  - persisted lineage-seal state and revision checksum;
  - historical-revision-pinned warning when the project has advanced;
  - shares bound specifically to the quoted revision;
  - exact frozen render policy and available / missing / blocked counts;
  - per-layer asset/checksum/version/governance/reviewer/canonical-reference evidence;
  - recent quote/project audit events.
- Frozen `missing` and `blocked` render states remain exactly missing/blocked. There is no visual fallback.
- A frozen `available` layer is considered verified only when its exact asset/checksum resolves to an immutable `production` or historical `superseded` asset version carrying approved governance and reviewer evidence.
- `reference-only` visual records are explicitly rejected as production evidence, even if a malformed input attempts to label them available.

### REFERENCE_BACKED_APPROVED_VISUALS_ONLY
Preserved without exception.

This package promoted **zero** visual assets. Reference-only, `master-draft`, `layer-draft`, unresolved-checksum and non-production-version output cannot satisfy staff lineage verification. The merged WF3 `Y62-F34-V1-CANDIDATE-02` remains `master-draft`, `productionEligible === false`, decision `returned-to-wf3`, with SHA-256:

`a353980a92131b960fed91baa46609bc63c1ec07a485fd4612fa305f0f7cea28`

### Parallel-lane preservation
The working checkpoint was reconciled with already-completed lane-owned deltas before WF4 work, without advancing those lanes:
- WF2 Ranger governed catalogue preserved at schema `0.26.6`, **39 products**, **20 manufacturer evidence rows**.
- WF3 Candidate 02 and its review metadata/binaries preserved exactly as a non-production draft.
- Historical Alpha regression expectations were updated only where prior WF2 tests pinned obsolete catalogue schema/count baselines; product/fitment assertions remain intact.

### Targeted verification
`tests/wf4-project-quote-lineage-alpha26.js` — PASS
- persisted quote lineage seal;
- immutable source revision after a later `R0002` save;
- share remains bound to `R0001`;
- staff finalisation preserves `R0001` + seal;
- frozen missing state remains no-fallback;
- checksum-pinned approved production version resolves as verified evidence;
- reference-only output is rejected.

`tests/wf4-project-quote-lineage-endpoint-alpha26.js` — PASS
- staff lineage endpoint returns the persisted inspection report;
- customer role is denied;
- frozen render state and lineage seal are returned intact.

### Regression / integration verification
- Full Alpha regression chain (`npm test`) — **PASS**.
- `npm run check` — **PASS**.
- WF5 positive governed promotion lifecycle — **PASS**.
- JavaScript syntax: **96 files / 0 failures**.
- JSON parsing: **12 files / 0 failures**.
- HTML local dependency scan: **15 pages / 242 references / 0 missing**.
- Customer draft/reference isolation remains PASS.
- WF4 direct-production reviewer gate remains PASS.

WF5's overall acceptance command remains red for exactly one previously returned issue outside this package:
- `WF1-BOM-ANYOF` — FAIL: unsatisfied `anyOfRequiredParts` does not yet survive into the saved project/quote gate after its supporting part is removed.
- `WF4-DIRECT-PRODUCTION-REVIEW` — PASS.
- `WF5-CUSTOMER-DRAFT-ISOLATION` — PASS.

### Next WF4 dependency
The primary dependency is still the first genuinely reviewable **`Y62-F34-V1` canonical master** from WF3 with clean isolation/reconstruction, locked overlay acceptance, provenance/rights and identified reviewer evidence complete. Once supplied, WF4 can exercise the real reference pack → canonical master → reviewed version → immutable production promotion → quote-lineage inspection path end-to-end.

Until that candidate exists, no guessed or unsupported Y62 geometry should be promoted.
