# PRO4X4 Rig Builder — Push 18 / Alpha 19

## Workflow checkpoint
Master workflow re-checked first. Y62 Warrior remains the production proof vehicle; Ranger remains behind the Y62 gate. The genuine manifest remains at 0 production-ready layers and no synthetic fixture is seeded into customer production.

## Advanced
- Added a pluggable governed asset-storage boundary: durable local filesystem remains the default, with an S3-compatible SigV4 provider for AWS S3 / compatible object stores.
- S3 mode supports content-addressed PUT/GET/LIST/DELETE, remote integrity scans, orphan GC and the existing backup manifest without changing asset lineage records.
- Added optional CDN delivery for active production-ready assets. The public production endpoint redirects only after the existing production gate has passed; CSP automatically permits only the configured CDN origin.
- Added short-lived historical binary delivery for staff. Local storage uses HMAC-signed application URLs; S3 mode returns a short-lived SigV4 presigned GET URL.
- Render Assets now exposes OPEN STORED BINARY for candidate, production, superseded and rejected immutable versions without moving the current production pointer.
- Delivery issuance and successful local delivery access are written to audit history.
- No DB migration was required: Alpha 19 reuses DB migration v5 immutable asset lineage and the existing content-addressed object keys.

## Verified
- Full Alpha 12–18 regression suite remains green.
- New Alpha 19 test proves superseded local binary retrieval, tamper rejection, unchanged production pointer, audited delivery issuance/access, S3-compatible signed PUT/GET/LIST, SigV4 presigned historical delivery, CDN redirect, CDN CSP allowance and remote vault integrity scan.
- Synthetic 1672 × 615 PNGs are generated inside tests only and are not written to the production seed.

## Next dependency
Highest-value dependency remains the first genuine transparent 1672 × 615 `Y62-F34-V1` Black Obsidian Warrior base with cleared rights. If still unavailable, the next engineering priority is configurator-side production layer composition/availability semantics: only server-approved production layers may resolve into the customer visual stack, with explicit fallback/asset-missing states rather than stand-ins.
