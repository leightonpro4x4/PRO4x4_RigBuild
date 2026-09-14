# PRO4X4 Alpha 94 consolidation — baseline, catalogue and shared domain

Stages 1–6 are validated. Stage 6 adds authoritative SQLite projects, immutable revisions and terminal quote lifecycle; automated acceptance and the refreshed desktop workflow smoke test pass. Stage 7 remains deferred. iOS acceptance is not tested.

Run `npm start` and open `http://127.0.0.1:8094/` (or set PORT). The server serves one public entrypoint, ten unchanged GLBs, an explicit static allowlist and the Stage 6 /api/ service. Source archives, nested apps and .runtime/alpha94.sqlite remain inaccessible. Three.js retains its pinned CDN dependency. Private SQLite data persists across server restarts and is excluded from Git.

Run `npm test` for archive/source hashes, all 45 Alpha 93 relocations, 24 GLBs, ten live asset report hashes, script syntax, import-map resolution and the serving boundary. Run `npm run check` for infrastructure syntax.

## Boundaries

| Responsibility | Stage 2 location |
|---|---|
| Customer app | `public/index.html`; `subsystems/customer-app/` documents future extraction |
| Shared domain engine | `subsystems/domain/` — pure decisions/transitions, shared client/server validation, isolated regression fixture |
| Catalogue/data | `subsystems/catalogue/` — authoritative WF2 data, normalization and checkpoint mappings; not wired into the app |
| Visual runtime | Unchanged inline runtime and assets in `public/`; `subsystems/visual-runtime/` contract |
| Visual eligibility adapter | `subsystems/visual-eligibility/` — reserved |
| Server/persistence | `subsystems/server-persistence/` — SQLite, WF4 auth/audit foundation, server canonicalization and ownership/quote boundaries |
| Governance | `subsystems/governance/` — reconciled evidence and authorized lifecycle |
| Y62 evidence pipeline | `subsystems/y62-evidence/` — scoped candidate provenance |
| Acceptance/tests | `acceptance/tests/` |
| Evidence archive | `evidence/archive/` — excluded from web serving |

The original monolithic HTML is archived with its exact hash; the active entrypoint loads the integrated customer/runtime modules. Do not serve the repository root. Use the allowlisted preview server or an equivalent deployment mapping.

See `consolidation/manifest.json` for the complete machine-readable baseline, `consolidation/BASELINE.md` for limitations and source classifications, and `consolidation/STAGE_2_VALIDATION.json` for the gate record. Original branch histories remain the source references; snapshot ZIPs are preservation containers, not applications to deploy.

See `consolidation/STAGE_3.md` and `consolidation/STAGE_3_VALIDATION.json` for the current catalogue gate. `npm test` also validates the Stage 3 counts, identities, mapping outcomes, unresolved values and fixture total. The original baseline documents remain historical Stage 1/2 records.

Stage 4 adds 29 domain tests to npm test. See subsystems/domain/README.md and consolidation/STAGE_4_VALIDATION.json for the semantics, limitations and gate record. No customer app behavior, production quote workflow or Y62 visual has been changed.

The current test chain also includes 17 visual-runtime tests and 32 Stage 6 persistence/adversarial/API/workflow tests. See subsystems/server-persistence/README.md for schema, migration, session identity, terminal quote and public-share policies. Historical stage reports describe their original checkpoint; the current Stage 6 report records the new lifecycle. Server review requests are not emailed or externally delivered by this implementation.

Stage 7 preserves zero Y62 production visuals and all Ranger checkpoint previews. See consolidation/STAGE_7.md for the current gate state and subsystems/governance/README.md for lifecycle/authorization boundaries. All 34 original WF5 acceptance assertions bind to current Alpha94 tests. Stage 8 has not started.
