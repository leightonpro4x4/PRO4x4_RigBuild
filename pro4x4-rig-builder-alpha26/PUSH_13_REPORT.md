# Push 13 — Alpha 14 report

## Workflow decision
The exact Y62 front-3/4 compositing stack remains blocked by missing independent, camera-matched production assets. The strict no-fake-layer rule was preserved. The next highest-priority dependency was therefore the asset registry/provenance control system.

## Advanced
- Built `asset-registry.html` and staff navigation.
- Seeded all 22 Y62 manifest layers into governed asset records: 7 reference-only, 13 asset-needed, 2 blocked-fitment, 0 production-ready.
- Added provenance/licence, source, SHA-256/file metadata, alpha verification, locked camera geometry, fitment scope, approval state and history.
- Added SQLite migration v3, persistent render asset table, HTTP list/update routes, audit events, and backup/restore inclusion.
- Added server-side production approval gate with explicit `422 asset_gate_blocked` failure.
- Added JSON Schema for render asset records and a dedicated Alpha 14 contract test.

## Verified
- 22 records seed correctly.
- Baseline status counts exactly match the Y62 render manifest.
- Invalid production promotion is rejected.
- A fully completed candidate can be promoted.
- Render assets survive portable backup.
- Render asset mutations appear in the audit ledger.
- Existing application tests remain part of the regression suite.

## Next dependency
Automated asset ingestion and front-3/4 camera calibration: real file checksum, dimensions/alpha detection, provenance attachment and locked Y62 camera profile. Exact visual source assets remain the blocker to the first genuine composite.
