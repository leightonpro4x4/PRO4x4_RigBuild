# PRO4X4 Alpha 94 consolidation — baseline, catalogue and shared domain

Stages 1–5 are validated. Stage 5 connects the Ranger preview through canonical domain decisions; automated gates and the Edge desktop smoke test pass. iOS acceptance is not tested. Stage 6 remains deferred.

Run `npm start` and open `http://127.0.0.1:8094/`. The server serves one public entrypoint, ten unchanged GLBs, and an explicit allowlist of domain/runtime modules and catalogue JSON. Source archives and nested apps remain inaccessible. Three.js remains the original pinned CDN dependency; internet access is required for it. No quote API or persistence service is added.

Run `npm test` for archive/source hashes, all 45 Alpha 93 relocations, 24 GLBs, ten live asset report hashes, script syntax, import-map resolution and the serving boundary. Run `npm run check` for infrastructure syntax.

## Boundaries

| Responsibility | Stage 2 location |
|---|---|
| Customer app | `public/index.html`; `subsystems/customer-app/` documents future extraction |
| Shared domain engine | `subsystems/domain/` — pure decisions/transitions, shared client/server validation, isolated regression fixture |
| Catalogue/data | `subsystems/catalogue/` — authoritative WF2 data, normalization and checkpoint mappings; not wired into the app |
| Visual runtime | Unchanged inline runtime and assets in `public/`; `subsystems/visual-runtime/` contract |
| Visual eligibility adapter | `subsystems/visual-eligibility/` — reserved |
| Server/persistence | `subsystems/server-persistence/` — reserved; `tools/serve.mjs` is preview infrastructure only |
| Governance | `subsystems/governance/` — reserved |
| Y62 evidence pipeline | `subsystems/y62-evidence/` — reserved |
| Acceptance/tests | `acceptance/tests/` |
| Evidence archive | `evidence/archive/` — excluded from web serving |

The original monolithic HTML is archived with its exact hash; the active entrypoint loads the integrated customer/runtime modules. Do not serve the repository root. Use the allowlisted preview server or an equivalent deployment mapping.

See `consolidation/manifest.json` for the complete machine-readable baseline, `consolidation/BASELINE.md` for limitations and source classifications, and `consolidation/STAGE_2_VALIDATION.json` for the gate record. Original branch histories remain the source references; snapshot ZIPs are preservation containers, not applications to deploy.

See `consolidation/STAGE_3.md` and `consolidation/STAGE_3_VALIDATION.json` for the current catalogue gate. `npm test` also validates the Stage 3 counts, identities, mapping outcomes, unresolved values and fixture total. The original baseline documents remain historical Stage 1/2 records.

Stage 4 adds 29 domain tests to npm test. See subsystems/domain/README.md and consolidation/STAGE_4_VALIDATION.json for the semantics, limitations and gate record. No customer app behavior, production quote workflow or Y62 visual has been changed.
