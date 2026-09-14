# Alpha 12 hosted deployment checklist

## Required before public access
- Place Node behind HTTPS reverse proxy / managed ingress.
- Set `NODE_ENV=production`.
- Set `PRO4X4_PUBLIC_ORIGIN` to the exact public HTTPS origin.
- Keep `PRO4X4_ALLOW_PROTOTYPE_HEADERS=false`.
- Keep `PRO4X4_ALLOW_DEV_LOGIN=false`.
- Mount persistent storage for the SQLite database.
- Export and test a restore from an off-host backup.
- Integrate a real staff identity provider/auth gateway that issues server sessions.
- Add central logs/metrics/error reporting.

## Required before multi-instance scale
- Replace single-node SQLite persistence with a shared production database adapter.
- Move future production render assets to object storage/CDN.
- Use shared/distributed rate limiting if multiple app instances are running.
- Add deployment migrations as an explicit pre-start release step.

## Visual release gate
Do not launch the visual configurator as photorealistic until the Y62 front-3/4 production layer stack is exact and view-matched. Reference-only imagery must remain labelled as such.

## Alpha 21 customer visual gate
- Customer configurator must use `/api/v1/render/resolve`; do not bind customer visuals directly to reference files or staff registry metadata.
- `fallbackPolicy` must remain `none` for production.
- Exact SKU/state mismatch must resolve `missing`; never choose a visually similar product.
- Do not render accessory production layers until the exact production base layer for that view is `available`.
- Missing and blocked active layers must remain visible in the customer readiness UI.
- Production binary requests should use the resolver-supplied checksum-pinned URL.
- A stale checksum response must be treated as a resolver refresh condition, not as permission to use a cached/alternate image.
- Current Y62 release remains non-photorealistic until the genuine `Y62-F34-V1` base and required exact layers are approved.

## Alpha 22 exact-state gate
- Treat `paintId` and `wheelTyreId` as part of render identity; do not reuse a layer across differing states unless that exact state is registered and approved.
- Keep customer retries bounded to the contract (3 attempts / 8 seconds per attempt). A retry may repeat the exact approved binary only.
- Review render telemetry for repeated load failures before visual release.
- Validated paint selection is not the same as visual readiness: missing paint-specific artwork must remain explicit.
- Confirm the production seed still has 0 production-ready layers until genuine approved assets arrive.

