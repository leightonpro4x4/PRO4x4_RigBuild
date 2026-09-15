# Stage 9 — Release assessment and hands-on test readiness

Assessed implementation: **`7518af7b69aa0aff2461dce5c20cbeab45e17d1f`**, branch **`alpha94-consolidation`**, 15 September 2026. This assessment changes documentation only. It does not deploy, implement features, migrate an existing database, change governance, or approve visuals. Stage 9 stops here.

**Decision: the local application is ready for controlled hands-on acceptance; the current repository is not yet ready to publish the complete journey as a remote desktop/iOS preview.** The missing piece is deployment configuration for the real HTTPS origin and a separate private preview database. The current launcher hard-codes a loopback origin. A normal remote request fails its Host/Origin checks. This is a deployment blocker, not a failed application regression or a requirement to finish Y62 visuals.

The minimum proposed change is described in [STAGE_9_DEPLOYMENT.md](STAGE_9_DEPLOYMENT.md). It is **not implemented or authorized by this assessment**. The exact desktop and real-device checklists are in [STAGE_9_ACCEPTANCE.md](STAGE_9_ACCEPTANCE.md). Machine-readable evidence, asset hashes and current validation results are in [STAGE_9_VALIDATION.json](STAGE_9_VALIDATION.json).

## 1. Release classifications

READY means the stated, limited capability has the required technical evidence. READY FOR HANDS-ON ACCEPTANCE means automated gates pass but human acceptance remains outstanding. PREVIEW ONLY explicitly excludes commercial/production approval. BLOCKED identifies an unmet prerequisite. NOT IMPLEMENTED is used for absent sub-capabilities, not as a synonym for untested.

| Area | State | Scope and reason |
|---|---|---|
| Developer/local build | **READY** | Pinned Node 24.19.0 runtime and root validation configuration work. Hosted nine-group validation passes; seven JavaScript groups were rerun locally. `npm start` runs the integrated app at `http://127.0.0.1:8094/`. Browser rendering needs the pinned Three.js CDN. This is not a production build certification. |
| Desktop hands-on preview | **READY FOR HANDS-ON ACCEPTANCE** | Local desktop journey is executable. Hosted Chromium completed three journeys with no page errors and 10/10 assets. Human visual/interaction acceptance is still required. Remote publication has the deployment blocker below. |
| iOS hands-on preview | **BLOCKED** | No real iOS Safari acceptance exists, and the shipped launcher supplies no remotely usable same-origin API configuration. Enable the isolated HTTPS preview first, then execute the real-device checklist. Desktop automation does not establish iOS compatibility. |
| Internal staff testing | **READY FOR HANDS-ON ACCEPTANCE** | Controlled local testing with synthetic customer details and a fresh database can begin now. Staff can test the customer journey and record review-required drafts. A staff operations UI/login is **NOT IMPLEMENTED**; remote staff access needs the proposed deployment. |
| Customer-facing preview | **BLOCKED** | Safe remote hosting and desktop/iOS sign-off are outstanding. The current UI is an acceptance surface with checkpoint controls and known limitations, not an accepted unrestricted customer experience. Do not issue an external customer invitation from this assessment. |
| Production/commercial release | **BLOCKED** | Incomplete commercial pricing/fitment, catalogue coverage in the UI, absent production operations/account recovery/delivery, incomplete human acceptance and visual approval prevent promotion. Green tests validate these restrictions; they do not remove them. |
| Ranger visuals | **PREVIEW ONLY** | Ten exact Alpha 93 GLBs render with preview status. Seven-product rendering is a checkpoint fixture; catalogue eligibility has six mappings and one Power Boards gap. No Ranger production approval is introduced. |
| Y62 catalogue | **PREVIEW ONLY** | 26 vehicle-scoped products and 15 evidence rows are preserved and navigable. Engineering/blocked records, unknown prices and conditional fitment remain explicit. This is ready for catalogue acceptance, not blanket commercial fitment approval. |
| Y62 visuals | **BLOCKED** | No approved production 3D base and no fallback. Governance production count is zero. This does **not** block Ranger testing or Y62 catalogue testing. |
| Saved projects | **READY FOR HANDS-ON ACCEPTANCE** | Server-owned SQLite projects, immutable revisions, checksums, ownership, reload, explicit revalidation and pinned shares pass automated gates. Remote preview needs origin/storage configuration. Guest-cookie identity is not an external account or cross-device recovery system. |
| Quote workflow | **PREVIEW ONLY** | The integrated customer can request review of a clean saved catalogue revision. Quotes bind project/revision/checksum and remain draft/review-required where unresolved. Checkpoints cannot quote. Authorized terminal finalisation has synthetic positive tests, not proof that real catalogue builds can be issued commercially. Email/CRM delivery and a staff finalisation UI are **NOT IMPLEMENTED**. |

## 2. Current technical baseline

Authority is the exact source, current tests and actual hosted run, not old narrative status. All **159 tracked files** in the downloaded source were compared with GitHub Git blob hashes and matched. Stage 9 also reran the seven JavaScript groups against those unchanged files. The first sandbox attempt could not spawn test processes; the normal-permission rerun passed all seven. Python and browser results below are the verified hosted results, not a claimed new local or human run.

[GitHub Actions run 34898558585](https://github.com/leightonpro4x4/PRO4x4_RigBuild/actions/runs/34898558585), attempt 1, job `validate` / `104158639245`, ran against the exact assessed SHA. It completed successfully on **2026-09-14 at 21:25:44 UTC**. The job API and decoded job logs were both inspected. Every required step completed successfully; none of the nine groups was skipped.

| Root validation group | Current hosted result | Supporting evidence |
|---|---|---|
| Static | **PASS** | 54 script/module syntax checks, 7 active JSON files, 147 imports, one HTML entrypoint, all nine workflow groups and root lock/runtime checks. Also PASS locally. |
| Catalogue | **PASS** | Ranger **73/54**, Y62 **26/15**, 99 unique scoped products, 69 scoped evidence rows; exact WF2 bytes and normalized semantics. Six visual mappings plus one explicit gap. Also PASS locally. |
| Domain | **PASS — 29 tests** | Stage 4 requirements, alternatives, explicit conflicts, blocked fitment precedence, trusted-context boundary, all 99 client/server decisions and isolated checkpoint. Also PASS locally. |
| Visual | **PASS — integrity gate + 17 tests** | 2,407 archived source files, 45 Alpha 93 relocations, **24 preserved GLBs**, **10 live GLBs**, exact byte lengths/hashes and serving responses; four front/rear combinations and no Y62 fallback. Also PASS locally. |
| Persistence | **PASS — 32 tests** | Ownership, forged prices/decisions/render data, lineage/checksum mismatch, stale revisions, immutable SQL triggers, terminal quote rules, idempotency, guest-cookie/API boundaries and public-share isolation. Also PASS locally. |
| Governance | **PASS — 34 tests** | Source identities, rights/camera/reconstruction gates, reviewer authority, immutable claims/decisions/seals, tamper rejection and F34-first. Synthetic positive controls do not promote actual assets. Also PASS locally. |
| WF5 | **PASS** | All **34 historical assertions bind to current Alpha 94 suites**, with five current integration checks. Archived failing runs are not current failures. Also PASS locally. |
| Browser | **PASS — 3 desktop journeys** | Managed Playwright Chromium 1.62.1: 10/10 GLBs, four replacement combinations, orbit/wheel input, persisted restoration, A$10,239 fixture, project/revision/quote journey and serving isolation; `pageErrors: []`. **iOS: NOT TESTED**. |
| Python | **PASS — 13 tests** | Exact isolated Python 3.12.14 dependency environment; candidate provenance/reconstruction and review-executor checks; zero failures/errors. No production promotion. |

These are nine groups and ten entrypoint executions because Visual has two entrypoints. Named tests, file checks, browser journeys and crosswalk bindings are different measures and must not be added into an invented test total. Commands and pins remain in `package.json`, `validation.config.json` and `.github/workflows/alpha94.yml`.

All ten assets resolve through the actual allowlisted serving handler and match the Alpha 93 report and consolidation manifest exactly: `ranger-static-front-rear.glb`, `factory-front.glb`, `factory-rear.glb`, `predator.glb`, `rally-hoop-v3.glb`, `butt-kicker-7-pair-v1.glb`, `scout.glb`, `powerboards.glb`, `tubrack.glb`, `rearbumper.glb`. The hosted browser additionally loaded all ten through HTTP and Three.js. Their byte counts and SHA-256 values are in the accompanying validation JSON. Host-specific asset/CDN loading must still be checked after deployment.

### Stage 4 remains application authority

`customer-app/app.mjs` uses `visual-runtime/session.mjs`, which calls the shared `domain/engine.mjs`; `server-persistence/store.mjs` recomputes the same canonical domain state. The renderer uses the eligibility adapter's visibility instead of inventing business rules. Server saves do not trust caller prices, decisions, ownership, approval fields or unverified vehicle assertions.

Hard prerequisites add recursively and removals cascade transitively. Any-of alternatives require an explicit choice. Removing the only alternative retains the dependent with a reopened choice gate. Conflicts require explicit removal rather than silent replacement. Conditional fitment stays review-required when trusted evidence is missing. The UI has no towbar/headlight/trim evidence-entry mechanism: backend tests can verify a known incompatible towbar, but a tester must not claim to have exercised that context through a nonexistent customer control.

The A$10,239 figure is green **only as the Alpha 93 checkpoint parts fixture**: Predator 3,100 + Rally 315 + Butt Kickers 415 + Scout 1,520 + Power Boards 1,649 + Nice Tub Rack 1,300 + rear bumper 1,940. It is not the authoritative catalogue's full fitted total. Catalogue mode requires the Rally camera relocation, leaves Power Boards unmapped, preserves the Nice Tub Rack null price, and retains labour/fitment review. Catalogue Butt Kickers have Predator/Toro alternatives; the renderer's preserved Predator/Rally assembly restriction is not a new universal commercial hoop dependency.

### Stage 6/7 and current governance

Saved revisions bind catalogue and implementation versions, canonical decisions/calculations, render state and exact asset provenance. Dirty or migration-required revisions cannot initiate review; checkpoint revisions cannot quote. Real unresolved builds cannot finalise. Quote lineage, finaliser privilege and terminal immutability gates remain green. No finaliser credential is needed or appropriate for a customer preview.

Actual governance remains: **9 owner references, 9 approvals/9 attestations, 3 masters, 9 candidate binaries, 0 canonical claims, 0 decisions, 0 seals, 0 production visuals**. F34 Candidate 02 is blocked upstream; SIDE remains calibration with a source gap; WF4 R34 remains awaiting candidate/calibration. Separately reconciled WF3 R34 Candidate 05 remains master-draft, cameraMatched false, productionEligible false, clean-neutral reconstruction fail, production-binary rights hold and exact-checksum edge review required. F34-first remains enforced. No source state was changed for Stage 9.

### Known implementation limits relevant to acceptance

* The Ranger UI renders the seven mapped checkpoint cards; only six have catalogue identities. It does **not** offer a general 73-record Ranger catalogue browser. Y62 renders all 26 records as a flat button list, not a new Y62 category tree.
* Conditional/unresolved pricing is shown as `KNOWN PARTS`, `+ UNPRICED`, `PRICE UNRESOLVED` and `INSTALL / REVIEW REQUIRED`. Component-level calculations exist in revisions; the customer UI is not a complete installed-price breakdown.
* The historical in-page `ALPHA 93 TEST CHECKLIST` still suggests submitting a QA quote, but current checkpoint mode deliberately disables quote requests. Follow the Stage 9 two-mode checklist; do not weaken the current guard to match old copy.
* `POSTCODE` is displayed but is not passed by `app.mjs` and is not accepted by `customerFields` in `store.mjs`. Only name, email, phone and notes are quote customer fields. Treat this as a real customer-workflow gap, not successful postcode capture.
* Reference/reviewer registries, raw owner/candidate evidence, server sources and SQLite files are outside the static allowlist. The normalized catalogue intentionally includes WF2 supplier/product evidence; that is distinct from private visual reviewer/reference evidence.
* Old README, domain/catalogue README and Stage 7/8 phrases such as “not wired,” “deferred,” “Stage 8 has not started” or “hosted rerun pending” are historical/stale. Current imports, tests and successful run above supersede those status claims. Historical reports are retained unchanged.

## 3. Blocker register

“Blocks preview” below means the **remote, complete customer journey**, unless explicitly scoped to a local test. Pending human acceptance is work to do during testing, not a demand to finish acceptance before opening a candidate locally.

| ID | Category | Remaining blocker / required exit evidence | Blocks preview testing? | Blocks production promotion? |
|---|---|---|---|---|
| D1 | Deployment | Loopback-only launcher and hard-coded API origin. Authorize minimal deployment launcher/config; configure exact HTTPS origin and isolated storage; preserve Host/Origin checks. | **Yes, remote full journey.** Local desktop works. | Yes |
| D2 | Deployment | No deployed, access-controlled preview URL or validated host configuration. Prove root routing, all modules/GLBs/CDN, session cookie, save/reload/quote and private-path denials on the target host. | **Yes, remote full journey.** | Yes |
| D3 | Deployment | Preview must have its own database/volume, no production data mount, no finaliser secrets, no governance grants, and access/teardown ownership. Establish these before accepting traffic. | **Yes, remote full journey.** | Yes |
| H1 | Hands-on acceptance | Human desktop checks, visual inspection, keyboard/scroll behaviour and actual-device screenshots/results not signed off. Execute desktop checklist. | No; this is the local acceptance task. External customer invitation waits. | Yes |
| H2 | Hands-on acceptance | Real iOS Safari load, touch orbit/pinch, scroll, orientation, cookie/reload and quote lineage untested. Record hardware/iOS/Safari/URL/SHA and results. | No after D1–D3; currently no suitable remote origin. | Yes |
| C1 | Commercial/catalogue | Ranger Power Boards `PB-FD-005` absent from WF2. Recover/approve exact source data before catalogue enablement; no fixture substitution. | No; test disabled catalogue control and checkpoint mesh separately. | Yes for that product/seven-product commercial build |
| C2 | Commercial/catalogue | Nice Tub Rack price conflict (1,750 vs 1,300), unresolved installation/required pricing components and source engineering/route conditions. Resolve from authoritative evidence. | No; unresolved states are required test cases. | Yes for affected builds |
| C3 | Commercial/catalogue | Ranger camera/lighting BOM, electrical/headlight routes, Scout mounting, rear factory/Hayman Reese towbar conditions and Y62 engineering/blocked products remain governed. Exact contextual evidence/review is required; no “confirmed” inference from a visible mesh. | No | Yes for affected routes/builds |
| C4 | Commercial/catalogue | Ranger full catalogue navigation and structured customer fitment-context entry are absent; Y62 is flat-list navigation. Define and accept intended commercial coverage before launch. | No for existing preview controls; unavailable coverage must be marked NOT IMPLEMENTED. | Yes for a claimed complete catalogue journey |
| V1 | Visual | Ranger is preview-only, with exact mapped assembly limitations. Required independent production rights/fitment/visual approvals are not present. | **No** | Yes for production visual claims |
| V2 | Visual | Y62 has no approved 3D runtime base or fallback. Do not substitute reference images, candidate images or Ranger meshes. | **No, including Ranger preview** | Yes for Y62 production visual offering |
| G1 | Governance | Y62 F34 upstream gate, SIDE source gap, R34 camera/reconstruction/rights/edge-review gaps and F34-first remain unresolved; real claim/decision/seal/production counts are zero. Required authorized lifecycle evidence must precede promotion. | **No**; policy isolates these from Ranger preview | Yes for affected visual promotion |
| P1 | Production release | Guest-cookie identity has no external account sign-in/recovery or cross-device project ownership recovery. Hosted account/operations policy is outside current implementation. | No for isolated synthetic guest testing | Yes for durable commercial customer accounts |
| P2 | Production release | Review request is a stored draft, not email/CRM delivery; staff review/finalisation UI is absent. Real builds remain unpriced/review-required. Postcode is visibly requested but discarded. Establish and test the intended handoff/customer-data workflow. | No if testers expect draft-only and record postcode limitation | Yes |
| P3 | Production release | Current human sign-off, production hosting/identity/security/backup-and-restore/operational readiness have not been demonstrated. A temporary preview configuration is not evidence of production operation. | No beyond D1–D3 | Yes |
| P4 | Production release | Historical inline checklist/category claims can confuse fixture, catalogue and quote readiness. Correct and accept customer-facing copy in a separately authorized application stage. | No for supervised testing with this plan | Yes for unrestricted customer presentation |

There is no evidence that Y62 production visual completion is architecturally required for Ranger preview. The current adapter returns an unavailable Y62 base with all layers hidden; Ranger continues using its own unchanged assets. Shared runtime loading does fetch Ranger GLBs on application startup even when Y62 is selected, so those ten assets must remain deployed in either journey.

## 4. Recommendation and stop condition

Authorize only the deployment-only scope in the separate deployment document if remote hands-on testing is wanted next: reuse the existing app/API, provide an exact public HTTPS origin, retain an allowlisted reverse-proxy boundary and private isolated SQLite directory, keep privileged credentials absent, and run target-host smoke checks. Then conduct desktop and **real iOS Safari** acceptance with synthetic data. No application feature or visual/governance promotion is required just to test the existing preview.

Local desktop acceptance can start now with the existing `npm start` path. Remote hands-on readiness must be reassessed after deployment configuration and host smoke evidence exist. Do not merge to `main`, modify `alpha93-master`/`wf1`–`wf5`, or promote Ranger/Y62 visuals. Stage 9 ends with documentation only.

ALPHA 94 NOT READY FOR HANDS-ON PREVIEW
