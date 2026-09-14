# Push 12 — Alpha 13 report

## Advanced
- Added trusted reverse-proxy / SSO staff identity gateway contract using HMAC-signed assertions exchanged into normal HttpOnly sessions.
- Added optional staff email-domain restriction and assertion replay-age bound.
- Added structured JSON request/error logging to stdout/stderr.
- Added readiness endpoint and Prometheus-compatible metrics endpoint with optional bearer-token protection.
- Added Docker Compose single-instance deployment manifest and health check.
- Added GitHub Actions CI workflow ready for repo connectivity.
- Added hosted architecture document defining the PostgreSQL/object-storage boundary required before horizontal scaling.
- Preserved the Y62-first milestone and strict no-fake-render-layer rule.

## Verified
- Existing Alpha 12 suites remain in the package.
- New hosted readiness suite checks DB readiness, protected metrics, valid signed staff identity exchange and invalid gateway-signature rejection.
- Production config continues to reject development login and prototype identity headers.

## Next dependency
- Visual: exact Black Obsidian Y62 front-3/4 production layer stack remains priority one.
- Non-visual fallback: introduce asset registry / provenance workflow and first PostgreSQL persistence adapter contract, then wire CI deployment once GitHub is connected.
