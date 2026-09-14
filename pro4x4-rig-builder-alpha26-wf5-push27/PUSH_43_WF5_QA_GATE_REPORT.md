# PRO4X4 Rig Builder — Alpha 26 WF5 QA / Integration Gate — Push 13

## Scope
WF5-only QA hardening against the latest merged Alpha 26 checkpoint. No customer product feature, catalogue record, production runtime behaviour, customer UX, or visual asset was built or altered. This push changes QA acceptance coverage/evidence and package metadata only.

The governing visual rule remains `REFERENCE_BACKED_APPROVED_VISUALS_ONLY`. Reference-only, `master-draft`, `layer-draft`, unsupported exact-SKU, fitment-blocked, unreviewed, stale-evidence, retargeted-lineage, or otherwise unsupported visual output must never become customer production output.

## Package adjudication

| Package | QA decision | Evidence / rationale |
|---|---|---|
| WF1 Run 02 | **PACKAGE PASS / LANE RETURNED** | Conditional-fitment messaging remains green. Three `anyOfRequiredParts` acceptance defects remain open: durable dependency gate loss, downstream quote-review propagation, and removal revalidation. |
| WF2 Push 07 | **PASS / LOCK DATA** | 39 Ranger products / 20 source-evidence records remain deduplicated, source-backed and conservative. Unknown install states remain unknown and staff-review states remain preserved. |
| WF3 Push 32 | **PASS AS REVIEW ARTIFACT / RETURN FOR MASTER** | `Y62-F34-V1-CANDIDATE-02` remains `master-draft`, customer-hidden, and exact resolver state `missing`. No candidate/reference binary is promoted. |
| WF4 Push 04 | **PACKAGE PASS / LANE RETURNED** | Staff evidence visibility remains useful, but shared visual-production/quote controls now have thirteen explicit acceptance failures, including the new production-identity immutability defect below. |
| WF5 Push 13 | **PASS AS QA PACKAGE** | QA-only acceptance coverage/evidence added. Historical regression/static verification remain green; composite release gate stays red only on acceptance blockers. |

## New QA coverage in Push 13

### Reviewed production exact-SKU identity can be retargeted without a new version/review — FAIL / RETURN WF4
New acceptance check `WF4-PRODUCTION-IDENTITY-IMMUTABILITY` verifies that the immutable production version is bound not only to a checksum, but also to the exact identity tuple for which that binary was reviewed.

The fixture:
1. registers a Y62 front-3/4 product-layer asset for exact SKU `WF5-IDENTITY-SKU-A`;
2. stages, reviews, and promotes the layer through the governed version path;
3. confirms the exact original SKU resolves customer `available` as the positive control;
4. performs a direct update of the active `production-ready` asset changing only its exact SKU to `WF5-IDENTITY-SKU-B`, without staging a new version or recording a new review; and
5. resolves both the original and retargeted exact SKUs.

Current result: **FAIL**.

The active registry record changes to SKU B while the immutable production version remains bound to SKU A. The original reviewed SKU then becomes `missing`, while the never-reviewed SKU B becomes customer `available` using the same checksum, version ID, and review evidence. In other words, the binary itself is unchanged but its approved commercial/fitment identity can be reassigned after review.

This is distinct from the existing production-binary immutability failure. Push 10 proved an approved binary can be replaced under stale review lineage; Push 13 proves the same approved binary can be **retargeted to a different exact SKU** under stale review lineage. Both violate exact-SKU/no-substitution semantics and immutable visual approval.

Required behaviour:
- once a production version is approved, `vehicleId`, `viewId`, `layerId`, `exactSku`, render-state identity and binary checksum must be immutable as one governed tuple;
- any change to that tuple must create a fresh candidate version, reset binary-specific evidence as required, and pass review/promotion again;
- direct production updates must not be able to rewrite the exact-SKU mapping of an already-reviewed version; and
- resolver admission should verify that the active registry identity matches the active immutable production-version identity before returning `available`.

No runtime code was changed in WF5; this test intentionally holds the release gate red until a WF4/shared-platform remediation candidate arrives.

## Acceptance gate state
`npm run test:wf5-acceptance` now reports **16 failing checks across 2 returned delivery lanes**.

### WF1 root defects — 3
1. `WF1-BOM-ANYOF` — unsatisfied OR dependency is missing from immutable project/quote gates.
2. `WF1-QUOTE-ANYOF` — downstream quote review treats the orphaned OR dependency as approved.
3. `WF1-REMOVE-ANYOF` — removing the final valid support item can strand the dependent selection.

### WF4 / shared-platform defects — 13
4. `WF4-DIRECT-PRODUCTION-REVIEW` — direct production upsert does not require immutable reviewer identity/timestamp.
5. `WF4-DIRECT-PRODUCTION-EVIDENCE` — reviewed direct upsert does not create checksum-pinned immutable review/audit evidence equivalent to version promotion.
6. `WF4-MASTER-REFERENCE-BACKING` — governed version promotion can make a canonical master customer-available with no reference IDs.
7. `WF4-QUOTE-GATE-TRUST-BOUNDARY` — quote intake trusts client-supplied fitment gates and can finalise a BOM whose required fitment review was omitted.
8. `WF4-MASTER-REFERENCE-ID-VALIDITY` — arbitrary/non-existent persisted reference IDs can satisfy the current promotion path.
9. `WF4-MASTER-BRIEF-REFERENCE-BINDING` — valid but unrelated owner references can be substituted for the exact canonical-view brief evidence.
10. `WF4-PRODUCTION-BINARY-IMMUTABILITY` — an approved production binary can be replaced without a new immutable reviewed version and the replacement becomes customer `available` under stale approval/version evidence.
11. `WF4-PRODUCTION-IDENTITY-IMMUTABILITY` — an approved product-layer binary can be retargeted from its reviewed exact SKU to a different exact SKU without a new version/review; the unreviewed SKU becomes customer `available` while the immutable version still records the old SKU.
12. `WF4-CANDIDATE-EVIDENCE-RESET` — a newly staged replacement binary inherits the previous production version's review evidence and reference bindings rather than starting with clean per-binary evidence.
13. `WF4-BLOCKED-FITMENT-PRECEDENCE` — an exact active fitment block is outranked by an existing production-ready visual for the same exact SKU/state and the resolver incorrectly returns customer `available`.
14. `WF4-PROJECT-RENDER-TRUST-BOUNDARY` — unsupported customer-supplied production-ready render metadata can be persisted into project/share/quote artifacts.
15. `WF4-QUOTE-PROJECT-REVISION-BINDING` — a quote can claim immutable project/revision lineage while carrying BOM/customer/render data that differs from that stored revision and can still be formally finalised.
16. `WF4-FINALISED-QUOTE-IMMUTABILITY` — a customer upsert can mutate an already-finalised formal quote in place.

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

Push 13 adds the missing **post-approval identity-mutation** case. A previously reviewed production version can currently be mapped to a different exact SKU by changing the active registry record directly. Therefore the existing resolver suite remains useful but is not sufficient for promotion without the WF5 identity-lineage gate.

The current WF3 F34 Candidate 02 remains customer `missing`. Push 13 promotes no project visual asset.

## Compatibility / BOM integrity
WF2 Push 07 remains clean at the data boundary:
- 39 Ranger catalogue records;
- 20 source-evidence records;
- zero duplicate IDs/SKUs under its package test;
- unknown install values remain unknown;
- staff-review states remain preserved; and
- the unproven Type X EVO Ranger fitment remains withheld.

WF1 remains returned because the immutable BOM/quote path still loses unresolved `anyOfRequiredParts` dependencies after support removal.

Push 13 also tightens the meaning of exact compatibility on the visual side: a reviewed visual for exact SKU A must never become proof for SKU B merely because the registry identity was edited after approval.

## Governed promotion and immutable lineage
`npm run test:wf5-promotion` — **PASS**.

The positive path still proves:
- staged drafts remain customer-hidden;
- missing reviewer evidence blocks governed promotion;
- valid F34 owner-reference evidence is present in the positive fixture;
- approved master becomes exact `available` only after governed promotion;
- immutable promotion audit/review evidence is recorded; and
- existing R0001 project/share/quote visual history remains pinned when R0002 later sees a newly approved visual.

The positive path does not waive the negative post-promotion controls: binary replacement, exact-SKU retargeting, blocked-fitment precedence, customer-supplied project render state, quote/revision divergence, and finalised quote mutation remain explicit release blockers.

## Verification evidence
- Full `npm test` Alpha 12 → current Alpha 26 regression chain: **PASS**.
- Latest-candidate integration: **PASS** (`wf2Catalogue39=true`, `wf2Evidence20=true`, WF3 Candidate 02 customer state `missing`).
- Explicit visual-safety rejection suite: **PASS**.
- Governed reference-backed promotion + project/revision/share/quote historical visual lineage positive control: **PASS**.
- Exact render resolver suite: **PASS**.
- `npm run check`: **PASS**.
- WF5 acceptance gate: **FAIL / EXPECTED HOLD**, 16 checks across the 2 returned lanes above.
- Composite `npm run test:gate`: **FAIL / EXPECTED HOLD** only when it reaches the acceptance blockers after all preceding suites pass.
- JavaScript syntax sweep: **91 JS files / 0 failures**.
- JSON parse sweep: **24 JSON files / 0 failures** including packaged QA evidence artifacts.
- HTML dependency sweep: **16 HTML files / 239 local references / 0 missing**.
- Final package ZIP integrity check: **PASS** (no compressed-data errors).
- Push 13 evidence logs are stored under `qa-evidence/wf5-push13/`.

## Change isolation
Diff against the packaged Push 12 checkpoint confirms no application/runtime/product/visual file changed. Excluding the new QA evidence directory and this report, the only changed files are:
- `tests/wf5-alpha26-acceptance-gate.js`
- `package.json`
- `qa-evidence/WF5_INTEGRATION_MANIFEST.json` (QA metadata only)

## Promotion decision
The Alpha checkpoint remains **HOLD / NOT PROMOTABLE**.

WF2 remains promotable only at its verified data boundary. WF3 Candidate 02 remains review evidence only and customer `missing`. WF1 and WF4 remain returned. No reference-only, `master-draft`, `layer-draft`, unsupported exact-SKU, retargeted exact-SKU, active fitment-blocked, unreviewed, stale-evidence, or checksum-divergent visual output is approved by WF5 for customer production.

## Next QA dependency
The highest-priority next candidate remains **WF4/shared platform**, with the production object identity now treated as part of the immutable approval lineage.

1. **WF4 / production tuple immutability:** bind `vehicleId + viewId + layerId + exactSku + renderState + checksum` to the reviewed immutable production version. Deny direct mutation of any field in that tuple or force a new candidate/review/promotion cycle. Resolver admission must cross-check active registry identity against the active version.
2. **WF4 / production binary immutability:** deny direct binary replacement on a production-ready asset or force replacement through `stageAssetVersion` → review → `promoteAssetVersion`; resolver admission must verify active object checksum against active immutable production-version/review evidence.
3. **WF4 / blocked-fitment precedence:** an active exact fitment block must override an existing production-ready visual for the same vehicle/view/layer/SKU/state until explicitly cleared.
4. **WF4 / candidate evidence reset:** staging a new version must clear prior review evidence/reference IDs and require fresh per-binary evidence binding.
5. **WF4 / canonical provenance gate:** validate reference IDs, rights, vehicle identity, and exact canonical-brief binding before promotion.
6. **WF4 / server-authoritative project/quote handoff:** recompute/validate render readiness and fitment gates during persistence; construct quotes from the stored immutable project revision or reject mismatches.
7. **WF4 / quote immutability:** make issued formal quotes immutable or explicitly revisioned.
8. **WF4 / direct production parity:** remove/deny direct production promotion or require the same immutable reviewer/version/checksum/audit evidence as governed version promotion.
9. **WF1:** revalidate `anyOfRequiredParts` after removal and persist unresolved OR-dependency gates through project → quote lineage whenever no valid alternative remains.

The next WF4/WF1 remediation candidate should be rerun against this Push 13 gate unchanged.
