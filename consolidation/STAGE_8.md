# Stage 8 â€” Root CI and validation infrastructure

Base: `72f8096200ee011e54ba79795ad81adbc03dac71`. Only alpha94-consolidation is changed. Stage 9 is not started.

`.github/workflows/alpha94.yml` is the single active workflow. All commands run at repository root on `windows-2022`, for pushes to alpha94-consolidation, manual dispatch and all pull-request targets (including main and any future integration branch). It has read-only repository permissions, cancellation for superseded runs, bounded execution and failure artifact upload. Historical workflow files in frozen ZIP archives remain evidence, not executable workflows.

`validation.config.json` is the category/entrypoint inventory. `npm test` runs all nine groups through `tools/validate.mjs`; `npm run test:core` runs the seven JavaScript groups. Individual `test:<group>` scripts use the same runner. Every invoked test lives under acceptance/tests and targets current subsystems. Archived sources are used for immutable fixtures, provenance and assertion crosswalks, not old application/server imports.

| Category | Coverage |
|---|---|
| Static | 54 JS/module syntax checks, 7 active JSON files, 147 imports, one HTML entrypoint, lock/runtime/workflow checks |
| Catalogue | One comprehensive gate: 99 scoped products, Ranger 73 accessories/54 evidence, Y62 26/15, unresolved mapping/pricing retained |
| Domain | 29 tests: WF1 semantics, WF2 fitment, client/server parity and Alpha93 fixture |
| Visual runtime | 17 tests plus frozen integrity gate: 2,407 archived files, 24 preserved GLBs, 10 live GLBs |
| Persistence | 32 project/revision/quote/ownership/adversarial tests |
| Governance | 34 reference/master/candidate/reviewer/seal and negative tests |
| WF5 | Five current integration checks; all 34 historical acceptance assertions mapped to current suites, including promotion negative gates |
| Browser | Three current desktop journeys: Ranger visuals, project lifecycle, governance/public-serving isolation |
| Python | 13 isolated tests: exact WF3 imagery/masks/lineage, alpha-only reconstruction, current Candidate05 review executor rejection and OpenCV preflight |

Counts distinguish named tests from file checks, assertion crosswalks and multi-assertion journeys; the same crosswalk assertion is not counted twice as a new test.

Runtime pins: Node 24.19.0, npm 11.11.0, Python 3.12.14, Playwright 1.62.1 with its bundled Chromium revision, OpenCV headless 5.0.0.93, NumPy 2.5.3 and Pillow 12.3.0. `package-lock.json` v3 pins npm dependency/transitive integrity; setup-node npm cache explicitly uses this root lockfile. Python uses `.venv`, `requirements-validation.lock`, wheel-only installation and SHA-256 checking. YAML 2.8.1 parses the actual workflow during validation.

Browser scripts import the root Playwright package, launch managed Chromium and test a fresh temporary server database. They no longer depend on the Codex runtime's node_modules, a personal Edge installation, a pre-existing local server, or real customer project data. The production server's default database path is unchanged. Tests use an explicit internal test directory option. No 3D bytes, camera code or dependency rules change. The production Three.js import map remains pinned at 0.180.0; browser testing also checks the actual CDN-loaded app. iOS acceptance remains untested.

The current Python executor derives from WF3 `tools/prepare-y62-f34-candidate05-review.py`. Its inputs/output directory and owner image are explicit root-test inputs rather than a historical wrapper root. Exact Candidate04 reuse, checksums and camera contract checks survive. OpenCV SIFT/registration creates only QA preflight evidence. Even the synthetic positive control leaves reviewer identity absent and all production/master/camera approvals false. R34 reconstruction tests verify exact archived pixels and the source's authorized polygon coordinates; they do not overwrite source images or promote candidates.

Results/logs now go to ignored `.validation/results/`; ordinary tests no longer rewrite historical Stage 5â€“7 reports. CI uploads these results on success or failure. Environment launch/installation blockers are not successful source tests. Exit 78 and spawn EPERM are classified as BLOCKED_ENVIRONMENT and fail the run without granting acceptance.

Current status: all nine groups and all ten test entrypoints passed through the root runner in normal Windows PowerShell. The declared isolated Python environment passed all 13 tests with zero failures/errors. Managed Playwright Chromium passed all three desktop journeys, loading 10/10 GLBs and retaining the A$10,239 fixture, four replacement combinations, project workflows and governance isolation. All Stage 1â€“7 regressions passed. Verified run summaries and log hashes are recorded in STAGE_8_VALIDATION.json. Earlier sandbox launch/installation restrictions were environment blockers; the successful external run resolves the local validation gate. GitHub-hosted execution remains pending until this workflow is pushed. iOS remains untested. No protected branch changed and Stage 9 has not started.

References: [Playwright CI](https://playwright.dev/docs/ci), [Playwright browser installation](https://playwright.dev/docs/browsers), [Node 24.19.0 distribution](https://nodejs.org/download/release/v24.19.0/). Package versions and hashes were verified against official npm and PyPI release metadata.

Hosted CI provisioning correction: run 34897963413 failed before tests because actions/setup-python does not publish Python 3.12.14 for Windows 2022. The workflow now downloads the exact CPython 3.12.14 Windows standalone build from Astral release 20260901, verifies SHA-256 e90c1b6419da3bd812dd73bb3de40287a21abf153438147639ec5e20375ea93f, verifies the interpreter version, and creates the same isolated .venv. Runtime and dependency pins remain unchanged. Missing result artifacts on bootstrap failure now warn rather than masking the provisioning error. Hosted rerun is pending.
