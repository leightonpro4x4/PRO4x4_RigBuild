# Legacy local-data migration

`migration.js` inspects earlier browser data without deleting it.

It can import:
- `pro4x4-last-concept` when it is not already a saved project revision.
- unversioned records from the local sales queue.

Imported records become immutable Alpha 12 project revisions with source labels `legacy-concept-import` or `legacy-queue-import`. The migration report is retained under the namespaced persistence store.

## Migration 005 — immutable render asset versions
Creates `asset_versions` and indexes by asset/state/object key. No existing render asset is rewritten at migration time. A legacy production asset is backfilled lazily when its first replacement candidate is staged, preventing fabricated history for assets that have never actually reached production.

## Alpha 21 — no database migration
The customer production resolver is derived from existing `render_assets`, `asset_objects` and migration-005 `asset_versions` state. Database schema version remains **5**. No production row is created, changed or promoted by resolving a customer stack.

## Alpha 22 / DB v6
Migration `006_render_telemetry.sql` adds persistent render delivery telemetry. On runtime startup, existing render registry rows are safely enriched where required: base records missing a state are assigned the established `black-obsidian` identity and wheel records missing a state are assigned `factory-warrior`. This metadata-only backfill never promotes, approves or changes an asset status.

