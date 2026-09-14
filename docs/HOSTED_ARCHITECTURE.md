# PRO4X4 Rig Builder hosted architecture — Alpha 13

## Current supported production profile
One Node 22 application instance, one durable SQLite volume, HTTPS reverse proxy and optional trusted staff identity gateway. Customer ownership remains server-session based.

## Staff identity gateway contract
The reverse proxy / SSO bridge may assert staff identity only when `PRO4X4_AUTH_GATEWAY_ENABLED=true`. It sends:
- `X-PRO4X4-IDP-SUB`
- `X-PRO4X4-IDP-EMAIL`
- `X-PRO4X4-IDP-NAME`
- `X-PRO4X4-IDP-ROLE` (`sales`, `fitment`, `admin`)
- `X-PRO4X4-IDP-TS` (Unix seconds)
- `X-PRO4X4-IDP-SIGNATURE`

The signature is HMAC-SHA256 of `sub|email|name|role|timestamp` using the shared gateway secret. The application rejects stale, incomplete or invalid assertions and can restrict staff identities to one email domain. A successful assertion is exchanged once for the normal HttpOnly application session cookie, so downstream application routes do not continuously trust proxy headers.

## Observability
JSON request logs are emitted to stdout/stderr and are suitable for Docker/hosting log drains. `/api/v1/health` reports service configuration posture. `/api/v1/ready` checks the database migration level. `/metrics` emits a small Prometheus-compatible request/uptime surface and can require a bearer token.

## Multi-instance boundary
Do not run two writable app instances against the same SQLite file over network storage. Before horizontal scaling, implement the persistence interfaces against PostgreSQL (projects, quotes, catalogue, sessions, audit) and object storage for large immutable visual/render assets and backup bundles. Keep asset metadata/checksums in SQL; keep binary assets in object storage/CDN.

## Visual architecture remains unchanged
The production visual milestone remains the exact Y62 front-3/4 stack. Hosted readiness must not weaken the no-fake-layer rule.
