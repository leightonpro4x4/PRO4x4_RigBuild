# PRO4X4 Rig Builder — Push 17 / Alpha 18

## Workflow checkpoint
The master workflow was re-checked before implementation. Y62 Warrior remains the production proof vehicle; Ranger stays behind the Y62 gate. Exact transparent render layers remain mandatory and no synthetic/test fixture is seeded into the customer configurator.

## Advanced
- Added SQLite migration **v5** with immutable `asset_versions` lineage.
- A replacement PNG/WebP is now **staged as a candidate version** instead of overwriting the currently served production binary.
- Existing legacy production assets are backfilled into lineage on the first replacement, preserving provenance and the original content-addressed object.
- Candidate metadata can be reviewed independently for provenance/licensing and manual camera-overlay verification. New binaries explicitly reset usage-rights state to `unknown` so a replacement cannot inherit clearance from an older file.
- Promotion is a server-gated atomic pointer move: old production becomes `superseded`, the approved candidate becomes `production`, `asset_objects` moves to the new immutable binary, and the public endpoint changes only after every production gate passes.
- Candidate rejection preserves both the current production asset and the rejected candidate history.
- Vault integrity/GC/backup now treats production, superseded, candidate and rejected version binaries as governed references so history cannot be garbage-collected accidentally.
- Render Assets UI now exposes the immutable version lineage, current production pointer, candidate staging, candidate review, explicit promotion and rejection.

## Verified
- Alpha 12–17 regression suite retained and updated for DB migration v5.
- New Alpha 18 destructive lineage test verifies:
  - first production binary remains publicly served while a replacement is staged;
  - legacy production is backfilled as V0001 and replacement becomes V0002;
  - candidate promotion atomically switches public delivery;
  - previous production becomes superseded and remains retrievable in governed storage;
  - a later V0003 rejection leaves production untouched;
  - vault GC does not delete superseded/rejected lineage binaries;
  - backup includes all asset versions and a healthy vault manifest; restore preserves the lineage/current production pointer when the governed vault is present.
- Synthetic test PNGs are generated only inside the test runtime and are never added to the production seed.

## Y62 visual status
The genuine visual gate is unchanged: **0 real production-ready Y62 layers have been supplied**. The priority sequence remains clean Black Obsidian Y62-F34-V1 base → factory Warrior wheel/tyre state → exact SLX X-1 → exact Scout rack → AE4705B + BB-015P.

## Next dependency
Highest-value dependency remains the first genuine transparent **1672 × 615 `Y62-F34-V1` Black Obsidian Warrior base** with cleared rights and exact geometry. If it remains unavailable, the next engineering task is the S3-compatible storage/CDN provider adapter plus signed/admin retrieval for historical version binaries, without weakening any production gate.
