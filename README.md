# PRO4X4 Alpha 94 consolidation — baseline and layout only

Stages 1 and 2 are established. Stage 3 and all business-logic integration are deferred.

Run `npm start` and open `http://127.0.0.1:8094/`. This serves only `public/`, containing the unchanged Alpha 93 HTML and its ten live GLBs. Three.js remains the original pinned CDN dependency; internet access is required for it. The local server adds no quote API or persistence service.

Run `npm test` for archive/source hashes, all 45 Alpha 93 relocations, 24 GLBs, ten live asset report hashes, script syntax, import-map resolution and the serving boundary. Run `npm run check` for infrastructure syntax.

## Boundaries

| Responsibility | Stage 2 location |
|---|---|
| Customer app | `public/index.html`; `subsystems/customer-app/` documents future extraction |
| Shared domain engine | `subsystems/domain/` — reserved |
| Catalogue/data | `subsystems/catalogue/` — reserved |
| Visual runtime | Unchanged inline runtime and assets in `public/`; `subsystems/visual-runtime/` contract |
| Visual eligibility adapter | `subsystems/visual-eligibility/` — reserved |
| Server/persistence | `subsystems/server-persistence/` — reserved; `tools/serve.mjs` is preview infrastructure only |
| Governance | `subsystems/governance/` — reserved |
| Y62 evidence pipeline | `subsystems/y62-evidence/` — reserved |
| Acceptance/tests | `acceptance/tests/` |
| Evidence archive | `evidence/archive/` — excluded from web serving |

The preserved monolithic application is intentionally not refactored at this stage. Reserved boundaries contain documentation, not invented implementations or duplicate entrypoints. Do not deploy the repository root; `public/` is the sole web root.

See `consolidation/manifest.json` for the complete machine-readable baseline, `consolidation/BASELINE.md` for limitations and source classifications, and `consolidation/STAGE_2_VALIDATION.json` for the gate record. Original branch histories remain the source references; snapshot ZIPs are preservation containers, not applications to deploy.
