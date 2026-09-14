# PRO4X4 Rig Builder Alpha 12 — deployment hardening

## Runtime
Alpha 12 remains dependency-free beyond Node.js 22.5+ and uses the built-in `node:sqlite` driver. Start locally with:

```bash
npm start
```

Default: `http://127.0.0.1:4180/`.

## Server-side identity boundary
Hosted HTTP mode now uses an HttpOnly `p4x4_session` cookie. The raw bearer token exists only in the browser cookie; SQLite stores a SHA-256 hash plus actor, role, scopes, expiry, revocation and last-seen metadata.

Unauthenticated customer traffic receives an anonymous customer session so project ownership remains stable across requests. Staff/admin routes require `sales`, `fitment` or `admin` server identity as appropriate.

Development role login is available at `staff-login.html` only while `PRO4X4_ALLOW_DEV_LOGIN=true`. Prototype `x-pro4x4-*` headers can be accepted locally while `PRO4X4_ALLOW_PROTOTYPE_HEADERS=true`. Both default to **false in `NODE_ENV=production`**.

Production still needs a real staff identity provider or trusted authentication gateway to issue staff sessions. The browser no longer needs to be the authorisation boundary.

## Security controls added in Alpha 12
- HttpOnly, SameSite=Lax server sessions; Secure cookies in production by default.
- Session revocation on logout and automatic expiry.
- Prototype identity headers ignored in production by default.
- Same-origin checks for browser mutation requests.
- API request-rate limits with separate auth-route limits.
- Configurable normal and backup request-size caps.
- CSP, frame denial, nosniff, referrer and permissions headers; HSTS when production is behind HTTPS.
- API request IDs returned on every response.
- Auth sessions are intentionally **excluded** from portable backups.

## Database migrations
`server/schema.sql` remains the idempotent baseline. `server/migrations/` contains numbered forward migrations. Alpha 12 introduces DB schema version **2**, adding hashed server sessions. Startup refuses a database newer than the runtime supports and aborts if migrations do not reach the expected version.

SQLite uses WAL mode and a 5-second busy timeout. This is appropriate for a single hosted instance with a persistent volume. Horizontal/multi-instance deployment should move the persistence adapter to a shared production database before scaling out.

## Reverse proxy / TLS
For a public deployment, terminate TLS at a reverse proxy or managed ingress and set:

```text
NODE_ENV=production
PRO4X4_PUBLIC_ORIGIN=https://your-rig-builder-host
PRO4X4_TRUST_PROXY=true
PRO4X4_SECURE_COOKIES=true
PRO4X4_ALLOW_PROTOTYPE_HEADERS=false
PRO4X4_ALLOW_DEV_LOGIN=false
```

Forward `Host`, `X-Forwarded-Host`, `X-Forwarded-Proto` and the client IP chain. Do not expose the Node process directly to the public internet while trusting forwarded headers.

## Container package
A `Dockerfile`, `.dockerignore` and `.env.example` are included. Mount `/data` persistently because the default production database path is `/data/rigbuilder.sqlite`.

```bash
docker build -t pro4x4-rig-builder:alpha12 .
docker run --rm -p 4180:4180 --env-file .env -v pro4x4-rig-data:/data pro4x4-rig-builder:alpha12
```

## Backup rule
Use `admin.html` / `GET /api/v1/admin/backup` before migrations or upgrades. Backup bundles contain business/configurator data and audit history, not active authentication sessions.

## Remaining production dependencies
1. Real staff identity provider / authentication gateway and account lifecycle.
2. Public hosting + TLS/reverse proxy configuration.
3. Shared database/object storage if the service becomes multi-instance or begins storing production render assets.
4. External observability/log aggregation and off-host backup retention.
5. GitHub/repository deployment pipeline once connectivity is available.

## Alpha 16 asset vault

Set `PRO4X4_ASSET_VAULT` to durable storage. On a single-node deployment this is a filesystem directory mounted on persistent storage. The database backup contains the asset-object manifest but not the binary files; back up the SQLite database and asset-vault directory together. Before horizontal scaling, replace the filesystem vault with the planned object-storage adapter/CDN boundary.

## Alpha 19 — S3-compatible storage / CDN

Single-node installs may keep `PRO4X4_ASSET_STORAGE_DRIVER=local`. Multi-instance or durable hosted deployments can set `PRO4X4_ASSET_STORAGE_DRIVER=s3` and provide endpoint, bucket, region and credentials. The adapter uses AWS Signature Version 4 and supports path-style addressing for compatible providers; set `PRO4X4_ASSET_S3_FORCE_PATH_STYLE=false` for virtual-hosted style when required.

`PRO4X4_ASSET_CDN_BASE_URL` is optional. When set, only active production-ready asset requests redirect to the configured immutable CDN path. The runtime CSP adds that exact CDN origin to `img-src`.

Historical staff binary retrieval is deliberately short-lived. For local storage set a persistent 32+ character `PRO4X4_ASSET_DELIVERY_SECRET`; if omitted the runtime uses an ephemeral process secret, which safely invalidates previously issued local links on restart. S3 storage uses SigV4 presigned GET URLs. Keep the signing TTL short (default 300 seconds).

## Alpha 22 render delivery observability
DB schema version 6 persists render resolve/load telemetry. Keep telemetry storage with the main SQLite database and include it in normal database backup/retention. Customer binary retry remains deliberately bounded to 3 attempts at the exact checksum-pinned URL; infrastructure must not rewrite failures to alternate artwork or stale objects.

