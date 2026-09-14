# PRO4X4 Rig Builder — Alpha 26 WF5 QA / Integration Gate — Push 10

## Scope
WF5-only QA hardening against the latest merged Alpha 26 checkpoint. No customer product feature, catalogue record, runtime production behaviour, customer UX, or visual asset was built or altered. This push changes QA acceptance coverage/evidence and package metadata only.

The governing visual rule remains `REFERENCE_BACKED_APPROVED_VISUALS_ONLY`. Reference-only, `master-draft`, `layer-draft`, unsupported exact-SKU, unreviewed, or otherwise unsupported visual output must never become customer production output.

## Package adjudication

| Package | QA decision | Evidence / rationale |
|---|---|---|
| WF1 Run 02 | **PACKAGE PASS / LANE RETURNED** | Conditional-fitment messaging remains green. Three `anyOfRequiredParts` acceptance defects remain open: durable dependency gate loss, downstream quote-review propagation, and removal revalidation. |
| WF2 Push 07 | **PASS / LOCK DATA** | 39 Ranger products / 20 source-evidence records remain deduplicated, source-backed and conservative. Unknown install states remain unknown and staff-review states remain preserved. |
| WF3 Push 32 | **PASS AS REVIEW ARTIFACT / RETURN FOR MASTER** | `Y62-F34-V1-CANDIDATE-02` remains `master-draft`, customer-hidden, and exact resolver state `missing`. No candidate/reference binary is promoted. |
| WF4 Push 04 | **PACKAGE PASS / LANE RETURNED** | Staff evidence visibility remains useful, but shared visual-production/quote controls now have ten explicit acceptance failures, including the new post-approval binary immutability failure below. |
| WF5 Push 10 | **PASS AS QA PACKAGE** | QA-only acceptance coverage/evidence added. Historical regression/static verification remain green; composite release gate stays red only on acceptance blockers. |

## New QA coverage in Push 10

### Promoted production binary checksum/version immutability — FAIL / RETURN WF4
New acceptance check `WF4-PRODUCTION-BINARY-IMMUTABILITY` starts with the governed positive path:

1. Stage a Y62 F34 canonical-master binary.
2. Bind the locked F34 owner-reference IDs.
3. Record `master-approved` reviewer evidence.
4. Promote the immutable version to production.
5. Verify the production asset, `approval.reviewEvidence`, and immutable production version are all checksum-pinned to the same approved SHA-256.

The test then attempts to upload/attach a different binary to that already-production asset **without creating and reviewing a new asset version**.

Current result: **FAIL**.

Observed behaviour:
- the replacement binary is accepted;
- the asset remains `production-ready`;
- the existing `lineage.currentVersionId` still points to the previously approved immutable version;
- `approval.reviewEvidence.checksumSha256` still points to the old approved checksum;
- but the current asset-object/file checksum changes to the new unreviewed checksum; and
- the customer resolver returns that new checksum as exact `available` production output under the old approved version identity.

The negative fixture demonstrates the split explicitly: active/customer checksum `bbbbbbbbbbbb…`, immutable review-evidence checksum `aaaaaaaaaaaa…`, immutable version checksum `aaaaaaaaaaaa…`.

This is a release-critical visual-governance breach. A production binary must not be mutable behind an existing approval/version pointer. Replacement must either:
- be rejected while the asset is production-ready; or
- be staged as a new candidate version that remains customer-hidden until reviewer evidence and governed promotion create a new immutable production version.

The resolver must never serve a checksum that is not the checksum pinned by the active reviewed production version.

## Acceptance gate state
`npm run test:wf5-acceptance` now reports **13 failing checks across 2 returned delivery lanes**.

### WF1 root defects — 3
1. `WF1-BOM-ANYOF` — unsatisfied OR dependency is missing from immutable project/quote gates.
2. `WF1-QUOTE-ANYOF` — downstream quote review treats the orphaned OR dependency as approved.
3. `WF1-REMOVE-ANYOF` — removing the final valid support item can strand the dependent selection.

### WF4 / shared-platform defects — 10
4. `WF4-DIRECT-PRODUCTION-REVIEW` — direct production upsert does not require immutable reviewer identity/timestamp.
5. `WF4-DIRECT-PRODUCTION-EVIDENCE` — reviewed direct upsert does not create checksum-pinned immutable review/audit evidence equivalent to version promotion.
6. `WF4-MASTER-REFERENCE-BACKING` — governed version promotion can make a canonical master customer-available with no reference IDs.
7. `WF4-QUOTE-GATE-TRUST-BOUNDARY` — quote intake trusts client-supplied fitment gates and can finalise a BOM whose required fitment review was omitted.
8. `WF4-MASTER-REFERENCE-ID-VALIDITY` — arbitrary/non-existent persisted reference IDs can satisfy the current promotion path.
9. `WF4-MASTER-BRIEF-REFERENCE-BINDING` — valid but unrelated owner references can be substituted for the exact canonical-view brief evidence.
10. `WF4-PRODUCTION-BINARY-IMMUTABILITY` — an already-approved production asset binary can be replaced without a new immutable reviewed version and the replacement becomes customer `available` under stale approval/version evidence.
11. `WF4-PROJECT-RENDER-TRUST-BOUNDARY` — unsupported customer-supplied production-ready render metadata can be persisted into project/share/quote artifacts.
12. `WF4-QUOTE-PROJECT-REVISION-BINDING` — a quote can claim immutable project/revision lineage while carrying BOM/customer/render data that differs from that stored revision and can still be formally finalised.
13. `WF4-FINALISED-QUOTE-IMMUTABILITY` — a customer upsert can mutate an already-finalised formal quote in place.

Passing acceptance controls remain:
- `WF1-BOM-ANYOF-SATISFIED` — one valid alternative satisfies one-of semantics without forcing every alternative.
- `WF5-OWNER-REFERENCE-PACK-INTEGRITY` — all 9 owner files/checksums/rights and canonical brief references verify.
- `WF5-CUSTOMER-DRAFT-ISOLATION` — customer entrypoint remains isolated from draft/reference tooling with `fallbackPolicy: none`.

## Visual governance / exact resolver behaviour
`npm run test:wf5-visual-safety` — **PASS**.

Still proven:
- reference-only output is rejected;
- `master-draft` is customer `missing`;
- `layer-draft` is customer `missing`;
- blocked fitment resolves `blocked`;
- unsupported exact SKU resolves `missing`;
- no visual fallback/substitution is used;
- draft/candidate states expose no production binary URL.

`npm run test:render-resolver` — **PASS** for exact `available / missing / blocked`, exact-SKU matching, checksum-pinned binary delivery and `fallbackPolicy: none` under its existing approved-flow fixtures.

Push 10 does not weaken that resolver contract; the new acceptance test shows a higher-level admission/immutability flaw that can feed an unreviewed replacement checksum into an otherwise strict exact resolver.

The current WF3 F34 candidate remains customer `missing`. Push 10 promotes no project visual asset.

## Governed promotion and immutable lineage
`npm run test:wf5-promotion` — **PASS**.

The positive path still proves:
- staged drafts remain customer-hidden;
- missing reviewer evidence blocks governed promotion;
- valid F34 owner-reference evidence is present in the positive fixture;
- approved master becomes exact `available` only after governed promotion;
- immutable promotion audit/review evidence is recorded; and
- existing R0001 project/share/quote visual history remains pinned when R0002 later sees a newly approved visual.

Push 10 identifies the next immutability boundary beyond that positive path: **after** governed promotion succeeds, the active production binary itself can presently be replaced without creating R/V lineage-equivalent review evidence.

## Verification evidence
- Full `npm test` Alpha 12 → current Alpha 26 regression chain: **PASS**.
- Latest-candidate integration: **PASS**.
- Explicit visual-safety rejection suite: **PASS**.
- Governed reference-backed promotion + project/revision/share/quote historical visual lineage positive control: **PASS**.
- Exact render resolver suite: **PASS**.
- `npm run check`: **PASS**.
- WF5 acceptance gate: **FAIL / EXPECTED HOLD**, 13 checks across the 2 returned lanes above.
- Composite `npm run test:gate`: **FAIL / EXPECTED HOLD** only when it reaches the acceptance blockers after all preceding suites pass.
- JavaScript syntax sweep: **91 JS files / 0 failures**.
- JSON parse sweep: **23 JSON files / 0 failures** including QA evidence artifacts.
- HTML dependency sweep: **16 HTML files / 239 local references / 0 missing**.
- Push 10 evidence logs are stored under `qa-evidence/wf5-push10/`.

## Promotion decision
The Alpha checkpoint remains **HOLD / NOT PROMOTABLE**.

WF2 remains promotable only at its data boundary. WF3 Candidate 02 remains review evidence only and customer `missing`. WF1 and WF4 remain returned. No reference-only, `master-draft`, `layer-draft`, unsupported exact-SKU, blocked-fitment, unreviewed, or checksum-divergent visual output is approved by WF5 for customer production.

## Next QA dependency
The highest-priority next candidate remains **WF4**, now with the production binary boundary first because it can silently change what customers receive after a valid review has already been recorded.

1. **WF4 / production binary immutability:** deny direct binary replacement on a production-ready asset or force replacement through `stageAssetVersion` → review → `promoteAssetVersion`; resolver admission must verify the active object checksum equals the active immutable production-version checksum and its immutable review evidence.
2. **WF4 / canonical provenance gate:** resolve every `provenance.referenceId` against governed evidence, enforce allowed rights/vehicle identity, and bind canonical-master promotion to the exact canonical brief/view.
3. **WF4 / server-authoritative project/quote handoff:** recompute/validate render readiness and fitment gates during persistence; construct quotes from the stored immutable project revision or reject mismatches.
4. **WF4 / quote immutability:** make issued formal quotes immutable or explicitly revisioned.
5. **WF4 / direct production parity:** remove/deny direct production promotion or require the same immutable reviewer/version/checksum/audit evidence as governed version promotion.
6. **WF1:** revalidate `anyOfRequiredParts` after removal and persist unresolved OR-dependency gates through project → quote lineage whenever no valid alternative remains.

The next WF4/WF1 remediation candidate should be rerun against this Push 10 gate unchanged.
