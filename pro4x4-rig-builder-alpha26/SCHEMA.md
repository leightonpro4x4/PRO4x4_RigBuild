# PRO4X4 Rig Builder Data Model — Alpha 22

## Contract version
Application payload/schema version: `0.12.0`.
Database schema version: `5`.

## Vehicle / catalogue
Vehicle and accessory records remain fitment-aware and source-traceable. Component pricing uses `parts`, `labour`, `paint`, `freight`, `engineering`, with `pricingRequired` determining which blank fields block a formal quote.

## Quote envelope v0.12.0
The build/quote envelope retains lead data, vehicle state, accessory snapshots, pricing completeness, payload planning, fitment gates, render readiness, workflow/finalisation state, catalogue revision and project pointer. See `schemas/quote-envelope.schema.json`.

## Project envelope v0.12.0
Projects have a stable ID, owner, optimistic `version`, append-only revisions and share metadata. Share records persist `tokenHash` + six-character `tokenHint`; raw share bearer tokens are never stored in the project envelope. See `schemas/project.schema.json`.

## Authentication sessions — DB schema 2
`auth_sessions` stores only a SHA-256 session token hash plus actor ID/display name, role, scopes, creation/expiry/revocation/last-seen timestamps and non-secret metadata. The raw session bearer stays in the HttpOnly cookie and is not included in backup exports.

## Database migration ledger
`schema_migrations` records each applied forward migration. Startup validates the migration level before serving requests.

## Audit event v0.12.0
Audit events contain event ID, timestamp, action, entity type/id, actor snapshot, optional correlation ID and metadata. Session issue/revocation now uses the same server-side ledger.

## Persistence boundary
`persistence.js` remains the shared storage/network boundary. HTTP mode now carries browser credentials via same-origin cookies while keeping the local and mock adapters available for offline/interface development.

## Alpha 18 / DB migration 5 — `asset_versions`
`asset_versions` stores immutable binary/version lineage per logical render asset. Each record carries `version_id`, monotonic `version_number`, lifecycle `state`, frozen binary identity (SHA-256/object key/MIME/dimensions/transparency), candidate/production metadata snapshot and promotion/supersession/rejection audit fields. The mutable `render_assets` + `asset_objects` records remain the active production pointer for compatibility and fast delivery.


## Alpha 21 — derived customer render resolution
No new table is introduced. The customer render stack is a derived read model over the exact `render_assets` logical slot plus its current `asset_objects` pointer. Each requested requirement resolves to `available`, `missing`, or `blocked`. `available` includes only current production identity (`assetId`, optional current `versionId`, SHA-256, dimensions and checksum-pinned binary URL). Reference/candidate/historical metadata is intentionally excluded from the customer compositor contract.

## Alpha 22 render state / telemetry
DB migration **6** adds `render_telemetry` with session, vehicle/view, layer/SKU/state, event type, attempt, duration, asset/checksum and error metadata. Render asset payloads may carry `renderState.paintId` (base) or `renderState.wheelTyreId` (wheels). Exact render-state identity participates in production resolution; it does not weaken the existing asset production gate.

## Alpha 26 WF4 — governed render-asset write boundary
No new table is introduced. Governed canonical masters and owner-reference records persist a `governanceWriteBoundary` object inside the existing `render_assets.payload_json`. It declares policy, purpose, authority and the protected field paths for the record. The declaration is refreshed only by the existing visual-governance sync path and is validated against the current record before staff display. Generic asset updates cannot modify governance-managed bindings; dedicated reviewer/readiness/provenance workflows remain the only allowed writers for their owned metadata. Blocked bypass attempts are written to the existing audit ledger.

## Alpha 26 WF4 — canonical reviewer decision envelope
No new table is introduced. A governed canonical master may persist `canonicalReviewDecision` in the existing `render_assets.payload_json`. The object is non-production (`authority: review-decision-only`, `productionEligible: false`) and stores `approved` or `returned`, decision/evidence SHA-256 fingerprints, exact candidate checksum, locked per-check results, source-gap resolution, identified reviewer and timestamp. Its evidence basis snapshots the canonical contract, reference-pack/source-rights evidence, WF3 handoff and reviewer assignment. The field is protected by the governed write boundary and may only be changed through the dedicated reviewer-decision workflow. Production approval requires a current `approved` envelope whose assigned reviewer and candidate/binary checksum still match.


## Alpha 26 WF4 — canonical view-contract evidence
No new database table is introduced. Governed canonical masters persist `canonicalViewContract` inside the existing render-asset payload. The evidence record fingerprints the canonical brief source, persisted canonical-view fields, governed camera-profile geometry/output canvas and reference-pack identity. `contractSha256` and `basisSha256` detect tampering or source-contract drift. The field is system-managed, non-production (`authority: view-contract-evidence-only`, `productionEligible: false`) and protected from generic staff edits. F34 is currently `locked`; SIDE/R34 are `calibration` and remain production-blocking until their camera/view contracts are locked.


## Alpha 26 WF4 — canonical reviewer claim integrity envelope
No new table is introduced. The existing `reviewWorkflow.assignment` object inside `render_assets.payload_json` now persists a signed claim envelope with `authority: review-claim-only`, `productionEligible: false`, `claimId`, `claimSha256`, canonical master/brief identity, workflow evidence-binding SHA-256, exact candidate checksum, reviewer actor/display/role and assignment timestamp. The claim fingerprint is validated against the current canonical record and references. Legacy/malformed/evidence-drifted claims are invalidated by reviewer-workflow refresh rather than migrated as active authority. Release is guarded by the exact expected claim SHA to prevent a stale UI from releasing a newer assignment. Canonical reviewer decisions and immutable production evidence snapshot the exact claim ID/SHA/evidence binding they consumed.
