# PRO4X4 Rig Builder — Alpha 26 WF5 QA / Integration Gate — Push 04

## Scope
WF5-only integration adjudication against the latest Alpha 26 QA checkpoint, with the newest available WF2 Push 07 catalogue candidate overlaid onto the already integrated WF1 Run 02, WF3 Push 32 and WF4 Push 04 candidates. WF5 authored no customer, catalogue, render or staff product features. The only non-QA data changes in this integration package are the WF2 Push 07 candidate files under test.

Candidate set under test:
- WF1 Run 02 — conditional fitment / vehicle-setup messaging.
- WF2 Push 07 — Ranger support-components expansion, 34 → 39 governed records and source evidence 15 → 20.
- WF3 Push 32 — `Y62-F34-V1-CANDIDATE-02` transparent owner-reference isolation preflight.
- WF4 Push 04 — reviewer evidence / canonical reference visibility.

## Promotion decision
**HOLD — the integrated Alpha 26 checkpoint remains not promotable.**

The full historical Alpha regression chain is green, the latest WF2 Push 07 candidate is green at the data boundary, the governed visual rejection policy is now explicitly regression-tested, exact render-state behavior is green, and immutable project/revision/share/quote visual lineage is green. The acceptance gate remains intentionally red on the same returned WF1/WF4 delivery defects. No acceptance criterion was weakened to obtain a pass.

No reference-only, `master-draft`, `layer-draft`, blocked-fitment, unsupported exact-SKU or fallback visual is accepted for customer production.

## Package adjudication

| Package | QA decision | Evidence / rationale |
|---|---|---|
| WF1 Run 02 — conditional fitment guidance | **PACKAGE PASS / LANE RETURNED** | Conditional fitment messaging continues to pass. The inherited `anyOfRequiredParts` invariant is still broken: removing the final valid supporting product can strand an OR-dependent product, and `merged-project-contract.gatesFor()` still does not persist an unsatisfied OR dependency into the immutable project/quote gate. WF2 Push 07 expands the practical blast radius because the new 22-inch Slim LED Light Bar also depends on Predator **or** Toro. |
| WF2 Push 07 — Ranger 39-record catalogue | **PASS / LOCK DATA** | 39 records; 20 source-evidence rows; zero duplicate IDs/SKUs; all dependency references resolve; five new support records remain manufacturer-backed; unknown install duration remains unknown; Type X EVO remains excluded from the confirmed slice because exact Ranger fitment is not proven; no new record gains approved production visual state. |
| WF3 Push 32 — F34 Candidate 02 | **PASS AS REVIEW ARTIFACT / RETURN FOR MASTER** | Candidate checksum/dimensions/transparency remain verified. Governance stays `master-draft`; production-binary rights remain unrecorded; review decision remains `returned-to-wf3`; customer resolver remains exact `missing`. Valid review evidence, not a promotable master. |
| WF4 Push 04 — reviewer evidence visibility | **PACKAGE PASS / LANE RETURNED** | Staff lineage/evidence visibility still passes and governed version promotion requires reviewer identity/timestamp. The older direct `production-ready` upsert still accepts `master-approved` metadata without immutable `governance.reviewedBy` + `governance.reviewedAt`, leaving an alternate production-control bypass. |
| WF5 — QA / Integration Gate | **PASS** | Latest WF2 candidate integrated and verified, explicit visual rejection coverage added, full regression green, release gate correctly remains red on unresolved delivery defects. |

## New QA coverage in Push 04

### Latest candidate integration — PASS
`tests/wf5-alpha26-latest-candidates.js` now verifies:
- Ranger schema `0.26.6`, **39** governed products, **20** source-evidence rows and deduplicated IDs/SKUs.
- All five Push 07 support-component records are confirmed, manufacturer-backed and not visually promoted by WF2.
- Rally hoops preserve Predator + camera-relocation hard dependencies and explicit auto-add behavior.
- Floor mats remain non-visualisable and unknown install duration remains `null`.
- `TB-COM-RAL-STE-2XEVO-ASM0` remains outside the confirmed Ranger slice rather than being inferred from category placement.
- The new 22-inch Slim LED Light Bar correctly requires **Predator OR Toro** at pre-selection.
- The existing WF1 immutable OR-dependency defect now demonstrably affects both the Lower Bash Plate and the newly added Slim Light Bar if the supporting bar is later absent.
- Y62 Candidate 02 remains `master-draft`, customer-hidden and exact `missing`.

### Explicit customer visual-governance rejection — PASS
New `tests/wf5-visual-governance-rejection-alpha26.js` proves:
- reference-only assets are never production eligible;
- `master-draft` candidates remain customer `missing`;
- `layer-draft` candidates remain customer `missing`;
- blocked fitment remains `blocked`;
- unsupported exact SKU remains `missing` with no substitute/fallback;
- candidate/draft states expose no production binary URL.

This test is now part of the passing `npm test` regression chain and the WF5 gate command.

### Expanded acceptance gate — RED BY DESIGN
`tests/wf5-alpha26-acceptance-gate.js` continues to fail only the release blockers:
1. `WF1-BOM-ANYOF` — saved project/quote snapshot does not create a durable unresolved OR-dependency gate. The test now checks the current Ranger data surface rather than a single historical fixture.
2. `WF1-REMOVE-ANYOF` — customer removal path still does not revalidate `fitment.anyOfRequiredParts` after the final valid support product is removed.
3. `WF4-DIRECT-PRODUCTION-REVIEW` — direct production upsert still bypasses immutable reviewer identity/timestamp.

Passing acceptance check:
- `WF5-CUSTOMER-DRAFT-ISOLATION` — customer entrypoint loads no canonical-candidate/reconstruction production tooling and keeps fallback policy `none`.

## Exact available / missing / blocked verification
`npm run test:render-resolver` — **PASS**.

Confirmed rules remain:
- exact `available`, `missing` and `blocked` states;
- exact-SKU matching and no substitution;
- checksum-pinned binary delivery;
- reference-only assets are not production output;
- no fake production seed;
- exact paint/wheel state matching;
- no-fallback telemetry/readiness behavior.

The new WF5 visual-safety test separately proves `master-draft`, `layer-draft`, blocked-fitment and unsupported exact SKU cannot be surfaced as customer production.

## Immutable project / revision / share / quote lineage
`npm run test:wf5-promotion` — **PASS**.

The positive governed lifecycle remains intact:
- staged draft is customer-invisible;
- missing reviewer evidence blocks version promotion;
- an explicitly reviewed `master-approved` immutable version can promote;
- only then does exact resolver state become `available`;
- checksum/version/reviewer evidence is immutable;
- R0001 share and quote stay pinned to their original `missing` visual snapshot after R0002 records a later approved production asset.

## Compatibility / BOM integrity
WF2 Push 07 itself is internally sound. AND dependencies continue to persist correctly into immutable BOM gates. The returned integration defect is specifically OR semantics owned by WF1/project-contract handling: `fitment.anyOfRequiredParts` is correctly present in catalogue data and correctly enforced before selection, but it is not revalidated after support removal and is not represented as an unresolved immutable gate when no valid alternative remains.

Push 07 makes that defect more important rather than introducing a new data defect: the new Slim Light Bar is another confirmed Ranger product that legally depends on one of two verified support bars.

## Visual-governance disposition
`REFERENCE_BACKED_APPROVED_VISUALS_ONLY` remains enforced at the QA gate. The current owner-backed F34 Candidate 02 remains review-only. No reference-only, `master-draft`, `layer-draft`, blocked-fitment or unsupported exact-SKU visual is promoted or substituted for customer output.

## Verification evidence
- Full `npm test` Alpha 12 → current Alpha 26 chain: **PASS**.
- WF2 Push 07 targeted support-component regression: **PASS**.
- Latest-candidate integration: **PASS**.
- Explicit WF5 visual-safety rejection test: **PASS**.
- Governed promotion + immutable lineage lifecycle: **PASS**.
- Exact render resolver chain: **PASS**.
- `npm run check`: **PASS**.
- WF5 acceptance gate: **FAIL / EXPECTED HOLD** with the 3 blockers above.
- Composite `npm run test:gate`: **FAIL / EXPECTED HOLD** because it terminates on those same acceptance blockers after all prior suites pass.
- JavaScript syntax sweep: **91 files / 0 failures**.
- JSON parse sweep: **14 files / 0 failures**.
- HTML dependency sweep: **16 HTML files / 239 local references / 0 missing**.
- QA logs and diff manifest are persisted under `qa-evidence/push04/`.

## Next QA dependency
Re-run the gate when a new candidate arrives from either returned delivery lane, with priority on:

1. **WF1:** revalidate OR-dependent selections after removal and persist a durable unresolved `anyOfRequiredParts` project/quote gate without silently selecting another alternative. The fix must cover both existing Lower Bash logic and newer support products such as the Slim Light Bar.
2. **WF4:** require immutable reviewer identity + review timestamp in the common direct-production gate as well as version promotion.

WF3 can continue the clean F34 master in parallel, but QA must continue to resolve it as customer `missing` until overlay acceptance, production rights and identified reviewer approval are complete.

Expected promotion result after the returned fixes: the three acceptance failures become green while the 39-record Ranger data checks, explicit draft/reference rejection, exact available/missing/blocked behavior, no-fallback policy and immutable revision/share/quote lineage remain unchanged.
