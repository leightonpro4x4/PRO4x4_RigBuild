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


## Alpha 26 audit / production-control gate
- Staff audit events are SHA-256 chained at write time through the shared audit integrity policy.
- `/api/v1/staff/audit/integrity` must report `sealed` or, during migration only, `sealed-with-legacy-prefix`; `broken` blocks production promotion.
- A sealed visual-governance event must retain the exact reviewer/rights/checksum metadata recorded at approval or promotion.
- Reference-only, `master-draft`, `layer-draft` and unsupported output remain ineligible for customer production regardless of audit state.
- `REFERENCE_BACKED_APPROVED_VISUALS_ONLY` remains authoritative.

## Alpha 26 canonical-master review evidence gate
- For a governed canonical master, confirm `canonicalView.briefId` and its review contract are persisted before review starts.
- For `Y62-F34-V1`, all eight checks in `Y62-F34-V1-OVERLAY-01` must be individually recorded as `pass`; a blanket `master-approved` state is insufficient.
- Reviewer identity and review timestamp must be present and immutable for the approved candidate.
- An active canonical reviewer assignment must report valid claim integrity and persist `claimId`, `claimSha256`, evidence-binding SHA-256 and exact candidate checksum.
- Release/reassignment must operate against the exact current `claimSha256`; treat `review_claim_conflict` as a stale reviewer-session condition, not permission to force-release.
- `canonicalReviewDecision` and canonical production evidence must reference the same valid claim ID/SHA consumed during review.
- Persisted canonical review evidence must bind the candidate SHA-256 to exact snapshots of every required owner/reference record.
- Any required reference checksum/governance change after review invalidates promotion until the candidate is reviewed again against the current evidence.
- Required source gaps (SIDE in particular) must remain blocked until a CURRENT dedicated `canonicalSourceGapResolution` is explicitly APPROVED by fitment/admin; generic canonical-review metadata cannot grant this authority. Reviewed reconstruction additionally requires a locked view contract, checksum WF3 candidate, ready handoff, claimed reviewer and camera match. Do not infer geometry.
- Owner/external evidence remains `reference-only` and `productionEligible: false` even when authenticity use is approved.
- Customer production remains resolver-only with no fallback; `REFERENCE_BACKED_APPROVED_VISUALS_ONLY` remains authoritative.

## Canonical reviewer dossier
- Before reviewer intake, open the canonical master in Render Assets and confirm the persisted governance dossier is `CURRENT` against the exact reference pack and WF3 handoff.
- Treat `STALE`, `INVALID` or `NOT PREPARED` as staff evidence warnings requiring explicit fitment/admin refresh before review work continues.
- The dossier is inspection-only. A current dossier is **not** approval, production rights, a production-ready binary or permission to promote.
- Continue to require the canonical review contract, identified reviewer evidence, immutable version promotion and the normal production/audit gates under `REFERENCE_BACKED_APPROVED_VISUALS_ONLY`.
