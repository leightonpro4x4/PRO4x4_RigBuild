# PRO4X4 Rig Builder — Push 19 / Alpha 20

## Workflow checkpoint
Master workflow re-checked first. Y62 Warrior remains the production proof vehicle; Ranger remains behind the Y62 production gate. PRO4X4 visual direction and all Alpha 19 storage/delivery work remain intact. The genuine seed remains at 0 production-ready layers.

## Advanced
- Added `POST /api/v1/render/resolve`, a customer-safe, server-authoritative resolver for exact vehicle/view/layer/SKU requirements.
- Resolver returns only `available`, `missing`, or `blocked` and never substitutes another SKU or reference asset.
- `available` requires the logical asset to remain `production-ready`, have a governed active binary, and still pass the server production gate.
- Customer configurator no longer loads `data.vehicle.views[*].src` stage/reference images into its visual viewport.
- Added a true layered production canvas. It renders only server-resolved approved binaries and remains empty until the exact base layer is available.
- Partial composition is allowed only when the approved base exists; missing/blocked selected layers remain explicitly visible in the readiness UI instead of being faked.
- Saved build/revision payloads now carry resolver version, `fallbackPolicy: none`, authoritative per-layer visual state, production asset ID and checksum.
- Resolver URLs pin the current SHA-256. The public binary route rejects a stale checksum and only uses long immutable caching when the checksum is pinned.
- Local/mock modes intentionally report no production binaries because they cannot prove the hosted governed binary gate.
- No DB migration was required; database migration remains v5.

## Verified
- Full Alpha 12–19 regression suite passes unchanged.
- New Alpha 20 test proves baseline reference-only assets resolve as missing, blocked fitment resolves as blocked, wrong exact SKU cannot substitute an existing layer, a properly approved synthetic test base resolves as available, checksum-pinned delivery returns the expected bytes, stale checksum is rejected, local mode cannot claim a production binary, and production seed contains zero fake production-ready records.
- Static checks confirm the customer app no longer references the legacy `vehicleImage` stage/reference fallback.
- Browser journey test is still environment-skipped because managed browser policy blocks local HTTP navigation; this is unchanged and not an application failure.

## Next dependency
Highest-value dependency remains the first genuine, rights-cleared transparent **1672 × 615 `Y62-F34-V1` Black Obsidian Warrior base**. Once approved, Alpha 20 can expose it immediately through the production resolver.

If the source layer remains unavailable, the next engineering priority is production composition diagnostics/layer-set contracts and staff preview of the exact customer-resolved stack.
