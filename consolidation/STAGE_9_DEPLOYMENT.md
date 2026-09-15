# Stage 9 — Temporary preview deployment requirements

Assessed code: `7518af7b69aa0aff2461dce5c20cbeab45e17d1f` on `alpha94-consolidation`. This is a deployment assessment, **not an implemented launcher, deployment or authorization to change runtime configuration**.

## Existing exact local path

At repository root, with Node **24.19.0**, run `npm start` (`node tools/serve.mjs`) and open **`http://127.0.0.1:8094/`**. `PORT` changes the port but not the hostname or public origin. A fresh isolated checkout creates its own `.runtime/alpha94.sqlite`; never point testing at an existing production database. Use a fresh test browser profile and synthetic contact details.

`tools/serve.mjs` serves `public/index.html`, the ten GLBs at root URL paths, and an explicit list of current customer/domain/catalogue/visual modules. It routes `/api/` to `bootstrap(origin).api`, binds `127.0.0.1`, and constructs origin as `http://127.0.0.1:<PORT>`. It is the integrated Alpha 94 launcher; archived entrypoints are not deployment candidates.

This is sufficient for **local desktop** testing. It is not an iPhone-reachable deployment: `127.0.0.1` on the phone refers to the phone. A normal tunnel or HTTPS proxy alone does not fix API identity/origin. Stage 9 directly exercised the existing API: a remote Host returned **403 `invalid_host`**; retaining the local Host but sending a remote Origin returned **403 `same_origin_required`**. The checks should remain intact.

## Deployment configuration that is absent

The source tree has no production/preview container manifest, hosting configuration or deployment workflow. `.github/workflows/alpha94.yml` validates; it does not publish. The current launcher has no public-origin option or configurable database directory, although the underlying `bootstrap(origin, {directory})` API already supports both inputs.

Do not deploy only `public/`: the entrypoint requests `/subsystems/...` modules/data and `/api/...` workflows. A visual-only static demo would not meet the integrated saved-project/quote acceptance requirement. Do not expose the repository as a static web root. Do not publish archives or switch to an Alpha 93/WF wrapper app. Root-relative module/API paths and relative GLB loads require this app at the preview origin's `/`, not an untested path prefix.

## Minimum proposed deployment-only change — authorization required

Add a small preview launcher/configuration (for example `tools/serve-preview.mjs`) that **reuses** the existing `handle` export and `bootstrap` export. It must:

1. Require an explicit single public **HTTPS origin**, with no path/query/fragment, and pass it unchanged to `bootstrap`. Do not derive trusted origin from request headers or trust arbitrary forwarded headers. This enables the existing HTTPS Secure-cookie behaviour and same-origin checks without changing auth/domain logic.
2. Require an explicit private, writable **preview database directory** through the existing `directory` option. Use a dedicated volume/path; never copy or mount production SQLite data. Keep one application writer instance for this preview unless multi-instance operation is separately assessed.
3. Listen on a private loopback port behind a same-host HTTPS reverse proxy. No public bind change is needed for that arrangement. If a container platform requires another listen address, that is an explicit deployment option, not a change to API trust rules.
4. Preserve the current static allowlist and API dispatch, content types and private-file boundary. Restrict the proxy to the intended preview hostname. Pass the public Host and browser Origin intact. Do **not** “fix” failures by rewriting every Origin to localhost or dropping Host/Origin checks.
5. Fail deployment if `PRO4X4_FINALISER_ID` or `PRO4X4_FINALISER_TOKEN` is supplied. Keep governance grants at their current empty defaults. No admin/finaliser interface or credentials are needed for draft customer acceptance.

This is a proposal only. No launcher, environment setting, feature, lockfile, source asset, data or governance file was changed in Stage 9. After authorization, test the configuration's same-origin success, wrong-host/cross-origin rejection, Secure cookie and private path denial before publication. Existing validation remains mandatory; a deployment configuration is not a reason to bypass it.

## Safest temporary hosting arrangement

Use a **separate, access-controlled HTTPS preview origin** backed by the integrated Node application and its private SQLite volume. Restrict access to named staff/testers at the proxy/hosting layer; use an access mechanism that does not forward an Authorization credential as a quote-finaliser token. Preview operations are guest customer saves and draft review requests only. Identify an operator, expiry/teardown time and synthetic-data policy before starting the host.

Place the immutable branch checkout on the private server filesystem. Keep required server modules, governance baseline, source manifest and frozen source archives **private but available to startup**: `server-persistence/bootstrap.mjs` verifies the Alpha 93 report/assets; `governance/bootstrap.mjs` reads the manifest and WF3/WF4 archives via `source-archive.mjs` to validate policy. Simply deleting all evidence directories from the server would break that existing integrity boundary. The web handler must not expose them. The normalized supplier catalogue/evidence JSON is intentionally browser-readable; private visual references/reviewers are not.

Keep all ten GLBs, unchanged, served from their existing root paths. Startup verifies sizes and SHA-256; test downloads through the actual preview origin too. Preserve JavaScript module and `model/gltf-binary` content types. Keep the pinned import map for **Three.js 0.180.0** and allow HTTPS browser access to **`cdn.jsdelivr.net`** for Three.js and its addons/transitive modules. npm's Playwright/YAML dependencies support validation; they do not replace browser Three.js. A host content policy must allow the current import map/module chain and inline CSS; do not introduce a restrictive policy that silently breaks the app. Offline operation is not implemented or certified.

Retain the existing “Preserved Ranger preview — not production approval” notice and dynamic Ranger/Y62 badges. The current checkpoint selector and A$10,239 amount stay identified as regression-only. There is no Y62 base fallback or production visual claim to enable. Keep the current app unchanged and give testers the Stage 9 checklist to address historical inline copy limitations.

## Target-host release gate, before inviting testers

Record URL, app commit, deployment/configuration revision, operator and timestamp. Initially deploy the assessed application commit (or its documentation-only descendant); compare the application/data/asset tree with the assessed SHA. All items below start **NOT RUN** for the remote host.

- [ ] HTTPS certificate is trusted on desktop and the real iPhone; app is at `/`; access gate works; no redirect loop for modules or `/api/`.
- [ ] Fresh browser load reaches `RUNTIME CHECK · 10/10 3D ASSETS LOADED`; all ten GLB responses are successful and hash-identical; pinned CDN modules load without mixed-content/module errors.
- [ ] `GET /api/session` succeeds on the exact configured Host. Cookie is HttpOnly, Secure and retains the existing same-site policy. A same-origin save succeeds; wrong Host and cross-origin mutations remain rejected.
- [ ] Runtime volume is a new private preview-only path; no production data/source credentials are mounted; finaliser credentials are absent; governance grants remain empty.
- [ ] Save a synthetic catalogue revision, reload, save a second revision, restore the first and request review. Receipt retains the first revision ID/checksum; no finalised quote or external delivery is claimed.
- [ ] Restart the application against that preview volume and confirm the same session/project/revision is readable; restart does not replace the SQLite database. Do not test by restarting a production service.
- [ ] Confirm 404/denial from the actual host for `/evidence/archive/snapshots/wf3.zip`, `/subsystems/governance/baseline.json`, `/subsystems/governance/registry.mjs`, `/subsystems/y62-evidence/r34-candidate05.json`, `/subsystems/server-persistence/store.mjs`, `/.runtime/alpha94.sqlite`, `/package.json`, `/.git/config` and directory listing paths. Access controls alone do not excuse static evidence exposure to authenticated testers.
- [ ] Customer requests cannot obtain a reviewer/admin/finaliser role. No extra admin service or directory/static catch-all is routed publicly. Pinned public-share DTO excludes owner, sibling revisions, reviewer registries and private provenance.
- [ ] Ranger remains preview, Y62 remains catalogue-only with all meshes hidden, and quote finalisation remains unavailable for unresolved/checkpoint builds.
- [ ] Complete the separate desktop and real iOS Safari acceptance record. Store evidence privately; do not publish test customer data, cookies, share tokens or internal reference images in the repository.

Only after the deployment blocker is resolved can the remote candidate be called ready to begin hands-on testing. Passing human acceptance and resolving commercial/production blockers are separate decisions. No merge to `main` is necessary or authorized, and this document makes no Ranger/Y62 production promotion.
