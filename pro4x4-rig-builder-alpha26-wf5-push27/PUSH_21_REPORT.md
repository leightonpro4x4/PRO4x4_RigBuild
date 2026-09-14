# Push 21 Report — Alpha 22

## Advanced
- Re-checked the master workflow and retained the Y62-first/no-fake-layer gates.
- Added exact render-state identity for paint and wheel/tyre selections.
- Updated the server resolver so a visually different state is a hard miss (`render-state-not-registered`), never a substitute.
- Made all four validated MY25 paint choices selectable while keeping missing visual states explicit.
- Added exact-binary delivery retry handling: maximum 3 attempts, 8-second timeout, same checksum-pinned URL identity.
- Added DB migration 6 and persistent render telemetry for resolve, load, retry, failure, ready and degraded states.
- Added customer load/retry diagnostics and persisted render delivery state in saved project revisions.
- Upgraded staff Production Stack Preview to state-bound resolution and recent telemetry.
- Added startup enrichment for existing databases so legacy base/wheel records acquire known Black Obsidian/factory-Warrior render-state metadata without changing status/approval.

## Verified
- Full `npm test` Alpha 12–22 suite passes.
- Exact Black Obsidian state resolves independently from Gun Metallic.
- A test-only approved Black Obsidian fixture never becomes a Gun Metallic visual.
- Factory Warrior wheel state resolves independently.
- Render telemetry persists, is staff-readable and is included in portable backup data.
- Existing-state backfill restores missing base/wheel state metadata.
- Production seed contains 0 `production-ready` layers.
- No reference/stage fallback was introduced.

## Next dependency
Genuine rights-cleared 1672 × 615 `Y62-F34-V1` transparent Black Obsidian Warrior base, followed by the genuine factory Warrior wheel/tyre layer.
