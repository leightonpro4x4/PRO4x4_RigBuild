# PRO4X4 Rig Builder — Push 15 / Alpha 16

## Workflow checkpoint
Y62 Warrior remains the production-first proof vehicle. No approximate render layer has been promoted. The locked front-3/4 camera remains `Y62-F34-V1` at 1672 × 615.

## Advanced
- Added a governed binary asset vault with content-addressed SHA-256 object keys.
- Added SQLite migration v4 and `asset_objects` metadata ledger.
- Added raw PNG/WebP ingestion endpoint for staff render assets.
- Added server-side PNG inspection, dimension verification and actual alpha-pixel verification for supported 8-bit non-interlaced RGBA/GA PNG layers.
- Production approval now requires a real stored vault object; payload metadata alone cannot fake the gate.
- Added immutable public binary delivery only for `production-ready` assets, with checksum ETag and long-lived immutable caching.
- Added staff-only binary retrieval for candidate inspection.
- Updated Render Asset Registry UI to inspect then ingest/vault the exact selected file.
- Added asset vault path and upload-size runtime configuration.
- Backup metadata now records asset-object manifests; binary files remain external governed objects and must be backed up with the vault directory/object store.

## Verified
- Full regression suite retained after migration v4 changes.
- Alpha 16 vault test stores a real transparent 1672 × 615 PNG, verifies alpha server-side, persists it under a SHA-256 object key, approves the corresponding Y62 front-3/4 base record, and serves the exact bytes back through the production binary endpoint.
- Production approval without a persisted vault object is rejected.
- Existing 22-layer Y62 registry baseline remains controlled; this test uses a synthetic fixture only and does not promote it into the shipped seed catalogue.

## Next dependency
The software can now safely retain the first genuine production render layer. The next visual dependency is still the real clean Black Obsidian Y62 Warrior front-3/4 transparent base matching `Y62-F34-V1`, followed by factory wheel/tyre state, SLX X-1, Scout rack, and AE4705B + BB-015P.

If exact artwork is still unavailable, next engineering priority is vault lifecycle management: replacement/supersession, orphan detection/garbage collection, vault backup/restore manifest verification, and CDN/object-storage adapter support.
