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

