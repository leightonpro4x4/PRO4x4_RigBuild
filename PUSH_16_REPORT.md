# PRO4X4 Rig Builder — Push 16 / Alpha 17

## Workflow checkpoint
Y62 Warrior remains the production proof vehicle. Exact render layers remain mandatory; no synthetic or approximate layer is promoted to production.

## Advanced
- Added governed asset-vault integrity scanning across SQLite references and content-addressed binary files.
- Detects missing binaries, checksum corruption, unreferenced/orphan files and total vault footprint.
- Added two-stage garbage collection: dry-run first, explicit execute second. Only unreferenced files are eligible for deletion.
- Added audit events for executed vault garbage collection.
- Portable JSON backup now carries a binary vault manifest with existence/checksum verification and a `vaultManifestHealthy` gate.
- Runtime Admin now exposes vault health, orphan count, corruption/missing counts, dry-run GC and explicit orphan removal.
- Preserved the Alpha 16 production gate and immutable public delivery rules.

## Verified
- Existing Alpha 12–16 regression tests remain in the package.
- Alpha 17 lifecycle test verifies: real governed binary ingestion, healthy reference/file reconciliation, orphan detection, dry-run GC, explicit GC, backup manifest verification and deliberate corruption detection.
- Y62 catalogue remains 11 fitment-aware accessory records; visual registry remains governed by exact-layer status.

## Next dependency
The first genuine transparent `Y62-F34-V1` Black Obsidian Warrior base layer remains the highest-value visual dependency. If unavailable, next infrastructure work is asset supersession/replacement history plus a storage-provider adapter for S3-compatible object storage/CDN without changing the registry contract.
