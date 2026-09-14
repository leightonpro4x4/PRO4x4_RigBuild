# PRO4X4 Rig Builder — Alpha 26 WF5 QA / Integration Gate — Push 03

## Scope
WF5-only integration adjudication against the latest merged Alpha 26 Parallel Push 05 backbone plus the latest candidate packages supplied by WF1, WF2, WF3 and WF4. No product feature code was authored by WF5. WF5 assembled a temporary integration checkpoint, added QA tests/evidence, ran the full regression chain, and adjudicated promotion status.

Candidate overlays under test:
- WF1 Run 02 — conditional fitment / vehicle-setup messaging.
- WF2 Push 06 — Ranger catalogue 28 → 34 with fitment/install-time normalisation.
- WF3 Push 32 — `Y62-F34-V1-CANDIDATE-02` transparent owner-reference isolation preflight.
- WF4 Push 04 — reviewer evidence / canonical reference visibility.

## Promotion decision
**HOLD — the integrated Alpha 26 checkpoint is not promotable.**

The full historical Alpha regression chain and every new candidate's own targeted regression pass. The exact render lifecycle and immutable project/revision/share/quote lineage also pass. The expanded WF5 acceptance gate remains intentionally red because three promotion-blocking checks still fail: two manifestations of the same unresolved WF1 OR-dependency invariant, and the unresolved WF4 direct-production reviewer-evidence bypass.

No reference-only, `master-draft`, `layer-draft`, unsupported, approximate or fallback visual is accepted for customer production.

## Package adjudication

| Package | QA decision | Evidence / rationale |
|---|---|---|
| WF1 Run 02 — conditional fitment guidance | **PACKAGE PASS / LANE RETURNED** | The new customer condition messaging passes and immutable selections preserve manufacturer fitment conditions. However the inherited `anyOfRequiredParts` invariant remains broken: removing the final valid support item can strand the dependent product, and `merged-project-contract.gatesFor()` still does not persist an unsatisfied OR dependency into the project/quote gate. Not promotable until both customer state and immutable BOM gate are fixed. |
| WF2 Push 06 — Ranger 34-record catalogue | **PASS / LOCK DATA** | 34 records; zero duplicate IDs/SKUs; dependency references resolve; new manufacturer evidence rows match; unknown install time remains unknown; conditional EGR end-cap fitment remains staff-review. Brush rails preserve both required parts in saved BOM dependency gates. No WF2 visual was promoted to `approved`. |
| WF3 Push 32 — F34 Candidate 02 | **PASS AS REVIEW ARTIFACT / RETURN FOR MASTER** | Binary checksum, PNG 1672×615 and alpha are verified. Governance remains `master-draft`; production-binary rights are not separately recorded; review decision is `returned-to-wf3`; customer entrypoint does not load the candidate; resolver remains exact `missing`. It is therefore valid review evidence but not a promotable canonical master. |
| WF4 Push 04 — reviewer evidence visibility | **PACKAGE PASS / LANE RETURNED** | Staff evidence/lineage visibility passes and the governed version-promotion path correctly requires immutable reviewer identity/timestamp. The older direct render-asset production upsert still accepts `master-approved` metadata without `governance.reviewedBy` + `governance.reviewedAt`. That alternate production path remains a release-blocking bypass. |
| WF5 — QA / Integration Gate | **PASS** | Candidate integration assembled without product feature changes; new targeted integration and removal-invariant tests added; full regression green; release gate correctly remains red rather than weakening acceptance criteria. |

## New QA coverage in this push

### `tests/wf5-alpha26-latest-candidates.js` — PASS
Verifies the latest candidate set together, including:
- Ranger catalogue schema `0.26.5`, 34 records, unique IDs/SKUs.
- EGR flare-end-cap `anyOfRequiredParts` and external EGR-flare requirement survive into immutable BOM data and remain staff-review.
- Brush Rails retain both Toro + rock-slider dependencies and create two durable dependency gates when orphaned.
- The known lower-bash OR-dependency defect remains exposed rather than hidden.
- Y62 Candidate 02 checksum/dimensions/transparency are valid, governance remains `master-draft`, direct production rights are absent, customer entrypoint does not load it, and the production resolver remains `missing`.

### Expanded `tests/wf5-alpha26-acceptance-gate.js` — RED BY DESIGN
Current failing checks:
1. `WF1-BOM-ANYOF` — saved project/quote gate does not persist an unsatisfied `anyOfRequiredParts` dependency.
2. `WF1-REMOVE-ANYOF` — customer removal path does not revalidate OR dependencies after the last valid support product is removed.
3. `WF4-DIRECT-PRODUCTION-REVIEW` — direct production upsert still bypasses immutable reviewer identity/timestamp.

Passing check:
- `WF5-CUSTOMER-DRAFT-ISOLATION` — customer entrypoint contains no reference/master-draft production tooling or fallback path.

The acceptance gate is written so future WF1 work can satisfy the removal invariant either by explicitly incorporating `anyOfRequiredParts` into dependency handling or by revalidating the selection after removal.

## Exact render-state / visual-governance verification
`npm run test:render-resolver` — **PASS**.

Confirmed states and rules:
- exact `available` / `missing` / `blocked`;
- exact-SKU no substitution;
- checksum-pinned binary delivery;
- customer reference fallback `none`;
- no fake production seed;
- exact paint/wheel state matching;
- no-fallback telemetry/readiness behavior.

`npm run test:wf5-promotion` — **PASS**.

Confirmed lifecycle:
- reference/master draft resolves `missing`;
- staging does not change customer output;
- promotion without reviewer evidence is rejected;
- an explicitly reviewed `master-approved` immutable version can promote;
- only after promotion does exact resolver state become `available`;
- review checksum/version/reviewer evidence is immutable;
- R0001 share + quote remain pinned to their original `missing` visual state after a later R0002 revision records the newly available production asset.

## Regression / integrity evidence
- Full `npm test` Alpha 12 → Alpha 26 chain: **PASS**.
- Latest-candidate integration test: **PASS**.
- Positive governed promotion lifecycle: **PASS**.
- WF5 acceptance gate: **FAIL / EXPECTED HOLD** with the 3 blockers listed above.
- `npm run check`: **PASS**.
- JavaScript syntax sweep: **89 files, 0 failures**.
- JSON parse sweep: **14 files, 0 failures**.
- Internal HTML dependency sweep: **15 HTML files / 236 local references / 0 missing**.
- Render resolver chain: **PASS** with `available`, `missing`, `blocked`, no substitution and no fallback.

## Compatibility / BOM disposition
WF2's new data is internally sound. The integration gate specifically verifies that ordinary AND dependencies remain durable in immutable snapshots: an orphaned Brush Rail creates both missing-dependency gates. The unresolved defect is limited to OR semantics: `fitment.anyOfRequiredParts` is represented correctly by WF2 and enforced before add by the customer selection gate, but is not revalidated after support removal and is not encoded as a durable dependency gate by `merged-project-contract.gatesFor()`.

WF1 must not auto-select a different alternative after the customer's chosen supporting part is removed. It may remove/flag the dependent or keep it selected with an explicit unresolved "one of these verified alternatives is required" gate, but the project/quote snapshot must remain incompatible until a valid alternative exists.

## Visual disposition
`Y62-F34-V1-CANDIDATE-02` remains deliberately non-production. Its owner-source derivation is useful authenticity evidence, but the QA gate agrees with WF3's own return decision: source-scene contamination and edge quality remain unsuitable for layer compositing, camera overlay approval is not complete, and direct production-binary rights are not separately recorded. The candidate is therefore accepted only as a governed review artifact.

## Next QA dependency
Re-run this gate after **both returned lanes** deliver fixes:

1. **WF1:** removal-state revalidation for `anyOfRequiredParts` **and** a durable unsatisfied OR-dependency gate in `merged-project-contract.gatesFor()` / project + quote snapshots, without silently choosing an alternative.
2. **WF4:** make `governance.reviewedBy` and `governance.reviewedAt` mandatory in the common production gate used by direct `production-ready` upsert as well as version promotion.

WF3 can continue producing the next clean F34 master candidate in parallel, but it must remain `master-draft`/customer-missing until clean isolation, locked overlay acceptance, production rights and identified reviewer approval all exist.

Expected next WF5 outcome: the three acceptance failures flip green while full regression, exact render states, no-fallback policy and immutable revision/share/quote lineage remain unchanged.
