# PRO4X4 Rig Builder API Contract — v0.14.0

Base path: `/api/v1`

## Runtime
- `GET /health` — contract version, database schema version/migration level, environment and auth mode.

## Server session boundary
- `GET /auth/session` — resolve or issue an anonymous customer session.
- `POST /auth/dev-login` — development-only staff/customer session issue; disabled by default in production.
- `POST /auth/logout` — revoke the current server session and clear the cookie.

Hosted mode uses an HttpOnly `p4x4_session` bearer cookie. The server stores only the SHA-256 token hash and session metadata. Prototype `x-pro4x4-*` identity headers are an explicitly configurable development bridge and default off in production.

## Error envelope
```json
{
  "error": "validation_error",
  "code": "validation_error",
  "message": "Build payload failed validation",
  "fieldErrors": [{"field":"vehicle.id","message":"Vehicle ID is required"}],
  "requestId": "..."
}
```

Additional hardening errors include `origin_forbidden`, `payload_too_large`, `rate_limited` and `dev_login_disabled`.

## Projects / revisions
- `GET /projects` — customer receives owned projects only; staff/admin can list across projects.
- `GET /projects/{projectId}`
- `POST /projects/{projectId}/revisions` — supports `expectedVersion`; stale writes return `409`.
- `PUT /projects/{projectId}/current-revision`

## Shares
- `POST /projects/{projectId}/shares`
- `DELETE /projects/{projectId}/shares/{tokenHash}`
- `GET /shares/{token}`
- `DELETE /shares/{token}`

Project share bearer tokens are returned only at creation time. Persisted share data stores SHA-256 hashes and hints.

## Builds / quotes
- `POST /builds`
- `GET /staff/quotes`
- `GET /staff/quotes/{reference}`
- `PATCH /staff/quotes/{reference}`
- `POST /staff/quotes/{reference}/finalise`

## Staff settings
- `GET /staff/settings/quote`
- `PATCH /staff/settings/quote`

## Catalogue
- `GET /catalogue/{vehicleId}`
- `POST /staff/catalogue/{vehicleId}/revisions`
- `GET /staff/catalogue/{vehicleId}/draft`
- `PUT /staff/catalogue/{vehicleId}/draft`
- `DELETE /staff/catalogue/{vehicleId}/draft`

## Audit
- `GET /staff/audit?entityType=&entityId=&action=&limit=`

Auth session issue/revocation is written into the audit ledger. Raw session tokens are never written to audit metadata.

## Seed / backup
- `POST /admin/import/seed`
- `GET /admin/backup`
- `POST /admin/backup/restore`

Portable backups intentionally omit `auth_sessions`; restoring business data must not resurrect browser credentials.


## Render asset registry — Alpha 14
Staff fitment/admin operations:
- `GET /api/v1/staff/render-assets?vehicleId=...&viewId=...&status=...`
- `PUT /api/v1/staff/render-assets/{assetId}`

`production-ready` is server-gated. The record must have cleared owned/licensed provenance, a valid SHA-256 checksum, file metadata, verified alpha transparency, matched locked camera geometry and no unresolved fitment block. Failed promotion returns `422 asset_gate_blocked`.

## Render candidate ingestion — Alpha 15

The browser-side ingestion pipeline accepts **PNG or WebP** candidate layers. The browser computes SHA-256, dimensions, format and transparent-pixel evidence before metadata is written to the existing render-asset record with `PUT /api/v1/staff/render-assets/{assetId}`.

The current Alpha intentionally does **not** upload or persist the binary image. `fileName`, `sizeBytes`, `inspectedAt`, checksum and inspection evidence are persisted; object-storage upload is a later hosted dependency.

Production approval remains server-enforced. For `front34`, Alpha 15 additionally enforces the locked `Y62-F34-V1` canvas of **1672 × 615**. A staff checkbox cannot bypass this dimension gate, provenance/licensing, checksum, transparent-pixel evidence, fitment state or manual camera-overlay verification.

## Alpha 16 — governed render binary vault

- `PUT /api/v1/staff/render-assets/{assetId}/binary` — fitment/admin only. Raw PNG/WebP request body. Stores content-addressed binary and attaches server-verified metadata.
- `GET /api/v1/staff/render-assets/{assetId}/binary` — fitment/admin candidate retrieval.
- `GET /api/v1/render-assets/{assetId}/binary` — public only when the registry record is `production-ready`; Alpha 21 resolver-supplied `?sha=` URLs provide checksum-pinned immutable delivery.

Production approval requires the persisted `asset_objects` record to agree with the registry checksum/dimensions and to carry server-side transparency verification. Client-supplied `vault` metadata is not sufficient.

## Alpha 17 — asset vault lifecycle
- `GET /api/v1/admin/asset-vault/status` — admin-only integrity reconciliation of governed DB references vs vault files.
- `POST /api/v1/admin/asset-vault/gc` with `{ "execute": false }` — dry-run orphan scan.
- `POST /api/v1/admin/asset-vault/gc` with `{ "execute": true }` — remove only unreferenced vault objects and audit the operation.
- `GET /api/v1/admin/backup` now includes `vaultManifest` and `vaultManifestHealthy`; binary bytes remain outside the JSON backup.

## Alpha 18 — render asset version lineage

All endpoints below require `fitment` or `admin` role and preserve the existing production asset until explicit promotion.

### `GET /api/v1/staff/render-assets/:assetId/versions`
Returns immutable version history newest-first. States: `candidate`, `production`, `superseded`, `rejected`.

### `POST /api/v1/staff/render-assets/:assetId/versions`
Body is the raw PNG/WebP binary. Stores the content-addressed object and creates a new `candidate` version. If the asset is already production-ready but predates version lineage, the existing production asset is backfilled as the first immutable production version. Only one open candidate is permitted per asset.

### `PUT /api/v1/staff/render-assets/:assetId/versions/:versionId`
Updates review metadata on a `candidate` version only. Logical slot identity and binary checksum/dimensions/object key are server-locked.

### `POST /api/v1/staff/render-assets/:assetId/versions/:versionId/promote`
Runs the full production gate against the candidate's persisted binary. On success, previous production becomes `superseded`, candidate becomes `production`, and the active production pointer moves atomically.

### `POST /api/v1/staff/render-assets/:assetId/versions/:versionId/reject`
Marks a candidate `rejected` and preserves its binary/provenance history. Current production is unchanged.

### Vault lifecycle interaction
`/api/v1/admin/asset-vault/status`, GC and backup manifests now include unique object keys referenced by current production or any asset version state. Superseded/rejected history is therefore not treated as orphaned storage.

## Alpha 19 — governed object storage and historical delivery

`GET /api/v1/staff/render-assets/:assetId/versions/:versionId/delivery` requires `fitment` or `admin`. It returns a short-lived delivery descriptor for the exact immutable version. Local storage returns a signed application URL; S3-compatible storage returns a SigV4 presigned GET URL.

`GET /api/v1/render-assets/version-delivery/:token` serves only a valid, unexpired locally signed immutable version and verifies the stored SHA-256 before delivery. Token tampering or expiry is rejected.

`GET /api/v1/render-assets/:assetId/binary` remains production-only. If `PRO4X4_ASSET_CDN_BASE_URL` is configured, an approved production object redirects to its immutable content-addressed CDN URL; non-production versions never use that public endpoint.

Vault status, GC and backup verification operate across either local or S3-compatible storage. Database migration remains v5; object keys and asset-version lineage do not change when storage providers change.

## Alpha 21 — customer production-layer resolver

### `POST /api/v1/render/resolve`
Customer-safe resolver. Request body:
```json
{
  "vehicleId": "nissan-y62-warrior-2025",
  "viewId": "front34",
  "requirements": [
    {"layerId":"base","exactSku":null},
    {"layerId":"wheels","exactSku":"FACTORY-WARRIOR-18X9-G015"},
    {"layerId":"front","exactSku":"Y62 S5 GEN-X"}
  ]
}
```

Response layers use only:
- `available` — exact registry slot is production-ready, its governed active binary exists, and the production gate still passes.
- `missing` — exact production visual is unavailable. Reference-only, candidate, retired and asset-needed records do not become customer visuals.
- `blocked` — exact registry slot is fitment-blocked.

`fallbackPolicy` is always `none` and `exactMatchRequired` is true. If another SKU exists for the same logical layer, it is not substituted. An exact SKU miss returns `reason: "exact-sku-not-registered"` and no `assetId`/`binaryUrl`.

An `available` layer includes a checksum-pinned `binaryUrl`, for example:
`/api/v1/render-assets/Y62-FRONT34-01-BASE/binary?sha=<64-char-sha256>`.

### Production binary checksum pin
`GET /api/v1/render-assets/:assetId/binary?sha=<sha256>` rejects the request with `409 asset_version_changed` if that checksum is no longer the active production binary. Long immutable caching is used only for checksum-pinned requests. Unpinned production requests retain short cache duration for compatibility.

The resolver never returns reference-stage source paths, candidate binaries, historical superseded/rejected versions or staff-only signed historical delivery URLs.


## Alpha 21 render diagnostics
`POST /api/v1/render/resolve` returns `diagnostics.baseState`, `diagnostics.unresolved[]` and `diagnostics.preloadOrder[]` in addition to explicit layer states.

## Alpha 22 — exact render state + delivery telemetry
`POST /render/resolve` requirements may include `state` and `stateKey`, e.g. `{"layerId":"base","exactSku":null,"state":{"paintId":"black-obsidian"},"stateKey":"paint:black-obsidian"}`. State matching is exact. If the layer/SKU exists but the requested state does not, the response is `missing` with `reason: "render-state-not-registered"`; no other paint/wheel state is substituted.

`POST /render/telemetry` accepts bounded customer delivery events (`resolve-start`, `resolve-success`, `resolve-error`, `asset-load-start`, `asset-load-success`, `asset-load-error`, `asset-load-retry`, `stack-ready`, `stack-degraded`). `GET /staff/render-telemetry` is staff-gated and supports vehicle/view/event filters.

