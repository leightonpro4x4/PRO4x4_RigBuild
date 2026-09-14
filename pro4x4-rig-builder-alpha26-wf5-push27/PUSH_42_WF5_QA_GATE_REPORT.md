# PRO4X4 Rig Builder — Alpha 26 WF5 QA / Integration Gate — Push 12

## Scope
WF5-only QA hardening against the latest merged Alpha 26 checkpoint. No customer product feature, catalogue record, production runtime behaviour, customer UX, or visual asset was built or altered. This push changes QA acceptance coverage/evidence and package metadata only.

The governing visual rule remains `REFERENCE_BACKED_APPROVED_VISUALS_ONLY`. Reference-only, `master-draft`, `layer-draft`, unsupported exact-SKU, fitment-blocked, unreviewed, stale-evidence, or otherwise unsupported visual output must never become customer production output.

## Package adjudication

| Package | QA decision | Evidence / rationale |
|---|---|---|
| WF1 Run 02 | **PACKAGE PASS / LANE RETURNED** | Conditional-fitment messaging remains green. Three `anyOfRequiredParts` acceptance defects remain open: durable dependency gate loss, downstream quote-review propagation, and removal revalidation. |
| WF2 Push 07 | **PASS / LOCK DATA** | 39 Ranger products / 20 source-evidence records remain deduplicated, source-backed and conservative. Unknown install states remain unknown and staff-review states remain preserved. |
| WF3 Push 32 | **PASS AS REVIEW ARTIFACT / RETURN FOR MASTER** | `Y62-F34-V1-CANDIDATE-02` remains `master-draft`, customer-hidden, and exact resolver state `missing`. No candidate/reference binary is promoted. |
| WF4 Push 04 | **PACKAGE PASS / LANE RETURNED** | Staff evidence visibility remains useful, but shared visual-production/quote controls now have twelve explicit acceptance failures, including the new blocked-fitment precedence defect below. |
| WF5 Push 12 | **PASS AS QA PACKAGE** | QA-only acceptance coverage/evidence added. Historical regression/static verification remain green; composite release gate stays red only on acceptance blockers. |

## New QA coverage in Push 12

### Exact blocked-fitment precedence over stale production-ready visual — FAIL / RETURN WF4
New acceptance check `WF4-BLOCKED-FITMENT-PRECEDENCE` verifies a conflict state that the previous isolated `blocked` test did not cover.

The fixture:
1. registers an exact Y62 front-3/4 product-layer slot for one SKU/state;
2. stages, reviews, and promotes a valid governed production binary for that exact slot;
3. confirms the resolver returns `available` as the positive control;
4. then registers an exact `blocked-fitment` declaration for the same vehicle/view/layer/SKU/state; and
5. resolves the same exact requirement again.

Current result: **FAIL**.

The resolver still returns the old production asset as customer `available`. The current resolver rank explicitly places `production-ready` ahead of `blocked-fitment`, so an engineering/fitment hold can be masked by an already-approved visual record when both exact records coexist.

This is distinct from the existing passing visual-safety control. `npm run test:wf5-visual-safety` still proves that a lone blocked-fitment record resolves `blocked`; Push 12 proves that the block loses when a matching production-ready record is also present.

Required behaviour:
- an active exact `blocked-fitment` declaration must be authoritative for the same vehicle/view/layer/SKU/render-state tuple;
- the customer resolver must return `blocked`, not `available`, while that hold is active;
- a stale production visual must not override a current compatibility/engineering block; and
- clearing the block should require an explicit governed state transition rather than implicit ranking by visual availability.

No runtime resolver code was changed in WF5; this test intentionally holds the release gate red until a WF4/shared-platform remediation candidate arrives.

## Acceptance gate state
`npm run test:wf5-acceptance` now reports **15 failing checks across 2 returned delivery lanes**.

### WF1 root defects — 3
1. `WF1-BOM-ANYOF` — unsatisfied OR dependency is missing from immutable project/quote gates.
2. `WF1-QUOTE-ANYOF` — downstream quote review treats the orphaned OR dependency as approved.
3. `WF1-REMOVE-ANYOF` — removing the final valid support item can strand the dependent selection.

### WF4 / shared-platform defects — 12
4. `WF4-DIRECT-PRODUCTION-REVIEW` — direct production upsert does not require immutable reviewer identity/timestamp.
5. `WF4-DIRECT-PRODUCTION-EVIDENCE` — reviewed direct upsert does not create checksum-pinned immutable review/audit evidence equivalent to version promotion.
6. `WF4-MASTER-REFERENCE-BACKING` — governed version promotion can make a canonical master customer-available with no reference IDs.
7. `WF4-QUOTE-GATE-TRUST-BOUNDARY` — quote intake trusts client-supplied fitment gates and can finalise a BOM whose required fitment review was omitted.
8. `WF4-MASTER-REFERENCE-ID-VALIDITY` — arbitrary/non-existent persisted reference IDs can satisfy the current promotion path.
9. `WF4-MASTER-BRIEF-REFERENCE-BINDING` — valid but unrelated owner references can be substituted for the exact canonical-view brief evidence.
10. `WF4-PRODUCTION-BINARY-IMMUTABILITY` — an already-approved production asset binary can be replaced without a new immutable reviewed version and the replacement becomes customer `available` under stale approval/version evidence.
11. `WF4-CANDIDATE-EVIDENCE-RESET` — a newly staged replacement binary inherits the previous production version's review evidence and reference bindings rather than starting with clean per-binary evidence.
12. `WF4-BLOCKED-FITMENT-PRECEDENCE` — an exact active fitment block is outranked by an existing production-ready visual for the same exact SKU/state and the resolver incorrectly returns customer `available`.
13. `WF4-PROJECT-RENDER-TRUST-BOUNDARY` — unsupported customer-supplied production-ready render metadata can be persisted into project/share/quote artifacts.
14. `WF4-QUOTE-PROJECT-REVISION-BINDING` — a quote can claim immutable project/revision lineage while carrying BOM/customer/render data that differs from that stored revision and can still be formally finalised.
15. `WF4-FINALISED-QUOTE-IMMUTABILITY` — a customer upsert can mutate an already-finalised formal quote in place.

Passing acceptance controls remain:
- `WF1-BOM-ANYOF-SATISFIED` — one valid alternative satisfies one-of semantics without forcing every alternative.
- `WF5-OWNER-REFERENCE-PACK-INTEGRITY` — all 9 owner files/checksums/rights and canonical brief references verify.
- `WF5-CUSTOMER-DRAFT-ISOLATION` — customer entrypoint remains isolated from draft/reference tooling with `fallbackPolicy: none`.

## Visual governance / exact resolver behaviour
`npm run test:wf5-visual-safety` — **PASS**.

Still proven in non-conflicting states:
- reference-only output is rejected;
- `master-draft` is customer `missing`;
- `layer-draft` is customer `missing`;
- a lone blocked-fitment record resolves `blocked`;
- unsupported exact SKU resolves `missing`;
- no visual fallback/substitution is used; and
- draft/candidate states expose no production binary URL.

`npm run test:render-resolver` — **PASS** for exact `available / missing / blocked`, exact-SKU matching, checksum-pinned binary delivery and `fallbackPolicy: none` under the existing approved-flow fixtures.

Push 12 adds the missing collision case: **exact `blocked-fitment` + exact `production-ready` simultaneously**. That case fails because the production-ready record currently wins. Therefore the resolver suite remains useful but is not sufficient for release promotion without the new WF5 acceptance gate.

The current WF3 F34 Candidate 02 remains customer `missing`. Push 12 promotes no project visual asset.

## Compatibility / BOM integrity
WF2 Push 07 remains clean at the data boundary:
- 39 Ranger catalogue records;
- 20 source-evidence records;
- zero duplicate IDs/SKUs under its package test;
- unknown install values remain unknown;
- staff-review states remain preserved; and
- the unproven Type X EVO Ranger fitment remains withheld.

WF1 remains returned because the immutable BOM/quote path still loses unresolved `anyOfRequiredParts` dependencies after support removal.

The new WF4 precedence failure extends compatibility safety into rendering: even where fitment is explicitly blocked, the customer-facing resolver can currently expose a matching old visual as `available` if both records coexist.

## Governed promotion and immutable lineage
`npm run test:wf5-promotion` — **PASS**.

The positive path still proves:
- staged drafts remain customer-hidden;
- missing reviewer evidence blocks governed promotion;
- valid F34 owner-reference evidence is present in the positive fixture;
- approved master becomes exact `available` only after governed promotion;
- immutable promotion audit/review evidence is recorded; and
- existing R0001 project/share/quote visual history remains pinned when R0002 later sees a newly approved visual.

The historical lineage positive control does not waive the negative trust-boundary failures: customer-supplied project render state, quote/revision divergence, and finalised quote mutation remain explicit release blockers.

## Verification evidence
- Full `npm test` Alpha 12 → current Alpha 26 regression chain: **PASS**.
- Latest-candidate integration: **PASS** (`wf2Catalogue39=true`, `wf2Evidence20=true`, WF3 Candidate 02 customer state `missing`).
- Explicit visual-safety rejection suite: **PASS**.
- Governed reference-backed promotion + project/revision/share/quote historical visual lineage positive control: **PASS**.
- Exact render resolver suite: **PASS**.
- `npm run check`: **PASS**.
- WF5 acceptance gate: **FAIL / EXPECTED HOLD**, 15 checks across the 2 returned lanes above.
- Composite `npm run test:gate`: **FAIL / EXPECTED HOLD** only when it reaches the acceptance blockers after all preceding suites pass.
- JavaScript syntax sweep: **91 JS files / 0 failures**.
- JSON parse sweep: **24 JSON files / 0 failures** including packaged QA evidence artifacts.
- HTML dependency sweep: **16 HTML files / 239 local references / 0 missing**.
- Push 12 evidence logs are stored under `qa-evidence/wf5-push12/`.

## Change isolation
Diff against the packaged Push 11 checkpoint confirms no application/runtime/product/visual file changed. Excluding the new QA evidence directory and this report, the only changed files are:
- `tests/wf5-alpha26-acceptance-gate.js`
- `package.json`

## Promotion decision
The Alpha checkpoint remains **HOLD / NOT PROMOTABLE**.

WF2 remains promotable only at its verified data boundary. WF3 Candidate 02 remains review evidence only and customer `missing`. WF1 and WF4 remain returned. No reference-only, `master-draft`, `layer-draft`, unsupported exact-SKU, active fitment-blocked, unreviewed, stale-evidence, or checksum-divergent visual output is approved by WF5 for customer production.

## Next QA dependency
The highest-priority next candidate remains **WF4/shared platform**, with compatibility safety at the resolver boundary now explicitly included.

1. **WF4 / blocked-fitment precedence:** an active exact fitment block must override an existing production-ready visual for the same vehicle/view/layer/SKU/state until the block is explicitly cleared.
2. **WF4 / production binary immutability:** deny direct binary replacement on a production-ready asset or force replacement through `stageAssetVersion` → review → `promoteAssetVersion`; resolver admission must verify active object checksum against active immutable production-version/review evidence.
3. **WF4 / candidate evidence reset:** staging a new version must clear prior review evidence/reference IDs and require fresh per-binary evidence binding.
4. **WF4 / canonical provenance gate:** validate reference IDs, rights, vehicle identity, and exact canonical-brief binding before promotion.
5. **WF4 / server-authoritative project/quote handoff:** recompute/validate render readiness and fitment gates during persistence; construct quotes from the stored immutable project revision or reject mismatches.
6. **WF4 / quote immutability:** make issued formal quotes immutable or explicitly revisioned.
7. **WF4 / direct production parity:** remove/deny direct production promotion or require the same immutable reviewer/version/checksum/audit evidence as governed version promotion.
8. **WF1:** revalidate `anyOfRequiredParts` after removal and persist unresolved OR-dependency gates through project → quote lineage whenever no valid alternative remains.

The next WF4/WF1 remediation candidate should be rerun against this Push 12 gate unchanged.
