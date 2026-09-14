# PRO4X4 Rig Builder — Alpha 26 WF5 QA / Integration Gate — Push 11

## Scope
WF5-only QA hardening against the latest merged Alpha 26 checkpoint. No customer product feature, catalogue record, runtime production behaviour, customer UX, or visual asset was built or altered. This push changes QA acceptance coverage/evidence and package metadata only.

The governing visual rule remains `REFERENCE_BACKED_APPROVED_VISUALS_ONLY`. Reference-only, `master-draft`, `layer-draft`, unsupported exact-SKU, unreviewed, stale-evidence, or otherwise unsupported visual output must never become customer production output.

## Package adjudication

| Package | QA decision | Evidence / rationale |
|---|---|---|
| WF1 Run 02 | **PACKAGE PASS / LANE RETURNED** | Conditional-fitment messaging remains green. Three `anyOfRequiredParts` acceptance defects remain open: durable dependency gate loss, downstream quote-review propagation, and removal revalidation. |
| WF2 Push 07 | **PASS / LOCK DATA** | 39 Ranger products / 20 source-evidence records remain deduplicated, source-backed and conservative. Unknown install states remain unknown and staff-review states remain preserved. |
| WF3 Push 32 | **PASS AS REVIEW ARTIFACT / RETURN FOR MASTER** | `Y62-F34-V1-CANDIDATE-02` remains `master-draft`, customer-hidden, and exact resolver state `missing`. No candidate/reference binary is promoted. |
| WF4 Push 04 | **PACKAGE PASS / LANE RETURNED** | Staff evidence visibility remains useful, but shared visual-production/quote controls now have eleven explicit acceptance failures, including the new candidate evidence-reset defect below. |
| WF5 Push 11 | **PASS AS QA PACKAGE** | QA-only acceptance coverage/evidence added. Historical regression/static verification remain green; composite release gate stays red only on acceptance blockers. |

## New QA coverage in Push 11

### Candidate-version evidence reset / per-binary provenance isolation — FAIL / RETURN WF4
New acceptance check `WF4-CANDIDATE-EVIDENCE-RESET` verifies the handoff from an already-approved production version to a newly staged replacement binary.

The test first creates a valid governed F34 V1:
1. stage a binary;
2. bind the locked F34 owner-reference IDs;
3. record identified `master-approved` reviewer evidence;
4. promote V1; and
5. verify V1 has checksum-pinned immutable review evidence.

It then stages a different V2 binary through the normal governed version path without promoting it.

Positive behaviour still holds: staging V2 does **not** replace the active customer output; the exact resolver continues serving approved V1.

However the V2 candidate itself inherits stale V1 evidence:
- `approval.reviewEvidence` survives into the new candidate and still points at the V1 checksum/version review; and
- `provenance.referenceIds` silently carries forward all three F34 owner-reference IDs from V1.

Current result: **FAIL**.

The negative fixture records the contamination explicitly: V2 is a different checksum but starts life carrying V1 review checksum `333333333333…` plus three inherited reference IDs.

This does not make the `master-draft` customer-visible by itself, but it weakens the production review boundary. A materially new binary can arrive in staff review already appearing to possess per-binary review/provenance evidence that was actually established for the previous binary. If a reviewer only records the new reviewer/camera/rights decision, stale reference bindings can survive into promotion without an explicit evidence re-bind.

Required behaviour:
- staging a new binary must clear inherited `approval.reviewEvidence`;
- staging a new binary must clear per-binary `provenance.referenceIds` (and other source-specific bindings where applicable);
- the candidate must require explicit provenance/reference re-binding for its own checksum/version before promotion; and
- the active production version must remain unchanged until the new candidate completes review/promotion.

## Acceptance gate state
`npm run test:wf5-acceptance` now reports **14 failing checks across 2 returned delivery lanes**.

### WF1 root defects — 3
1. `WF1-BOM-ANYOF` — unsatisfied OR dependency is missing from immutable project/quote gates.
2. `WF1-QUOTE-ANYOF` — downstream quote review treats the orphaned OR dependency as approved.
3. `WF1-REMOVE-ANYOF` — removing the final valid support item can strand the dependent selection.

### WF4 / shared-platform defects — 11
4. `WF4-DIRECT-PRODUCTION-REVIEW` — direct production upsert does not require immutable reviewer identity/timestamp.
5. `WF4-DIRECT-PRODUCTION-EVIDENCE` — reviewed direct upsert does not create checksum-pinned immutable review/audit evidence equivalent to version promotion.
6. `WF4-MASTER-REFERENCE-BACKING` — governed version promotion can make a canonical master customer-available with no reference IDs.
7. `WF4-QUOTE-GATE-TRUST-BOUNDARY` — quote intake trusts client-supplied fitment gates and can finalise a BOM whose required fitment review was omitted.
8. `WF4-MASTER-REFERENCE-ID-VALIDITY` — arbitrary/non-existent persisted reference IDs can satisfy the current promotion path.
9. `WF4-MASTER-BRIEF-REFERENCE-BINDING` — valid but unrelated owner references can be substituted for the exact canonical-view brief evidence.
10. `WF4-PRODUCTION-BINARY-IMMUTABILITY` — an already-approved production asset binary can be replaced without a new immutable reviewed version and the replacement becomes customer `available` under stale approval/version evidence.
11. `WF4-CANDIDATE-EVIDENCE-RESET` — a newly staged replacement binary inherits the previous production version's review evidence and reference bindings rather than starting with clean per-binary evidence.
12. `WF4-PROJECT-RENDER-TRUST-BOUNDARY` — unsupported customer-supplied production-ready render metadata can be persisted into project/share/quote artifacts.
13. `WF4-QUOTE-PROJECT-REVISION-BINDING` — a quote can claim immutable project/revision lineage while carrying BOM/customer/render data that differs from that stored revision and can still be formally finalised.
14. `WF4-FINALISED-QUOTE-IMMUTABILITY` — a customer upsert can mutate an already-finalised formal quote in place.

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
- no visual fallback/substitution is used; and
- draft/candidate states expose no production binary URL.

`npm run test:render-resolver` — **PASS** for exact `available / missing / blocked`, exact-SKU matching, checksum-pinned binary delivery and `fallbackPolicy: none` under the approved-flow fixtures.

Push 11 also adds a positive control inside the new acceptance test: while V2 is only staged, the resolver keeps V1 as the active customer checksum. The new defect is evidence contamination inside the candidate, not premature customer activation.

The current WF3 F34 Candidate 02 remains customer `missing`. Push 11 promotes no project visual asset.

## Governed promotion and immutable lineage
`npm run test:wf5-promotion` — **PASS**.

The positive path still proves:
- staged drafts remain customer-hidden;
- missing reviewer evidence blocks governed promotion;
- valid F34 owner-reference evidence is present in the positive fixture;
- approved master becomes exact `available` only after governed promotion;
- immutable promotion audit/review evidence is recorded; and
- existing R0001 project/share/quote visual history remains pinned when R0002 later sees a newly approved visual.

Push 11 identifies a separate pre-promotion hygiene requirement: each staged replacement version needs its **own** evidence bindings. Production history can remain immutable while candidate metadata is still contaminated by stale prior-version evidence.

## Verification evidence
- Full `npm test` Alpha 12 → current Alpha 26 regression chain: **PASS**.
- Latest-candidate integration: **PASS**.
- Explicit visual-safety rejection suite: **PASS**.
- Governed reference-backed promotion + project/revision/share/quote historical visual lineage positive control: **PASS**.
- Exact render resolver suite: **PASS**.
- `npm run check`: **PASS**.
- WF5 acceptance gate: **FAIL / EXPECTED HOLD**, 14 checks across the 2 returned lanes above.
- Composite `npm run test:gate`: **FAIL / EXPECTED HOLD** only when it reaches the acceptance blockers after all preceding suites pass.
- JavaScript syntax sweep: **91 JS files / 0 failures**.
- JSON parse sweep: **23 JSON files / 0 failures** including QA evidence artifacts.
- HTML dependency sweep: **16 HTML files / 239 local references / 0 missing**.
- Push 11 evidence logs are stored under `qa-evidence/wf5-push11/`.

## Change isolation
Diff against the packaged Push 10 checkpoint confirms no runtime/product/visual file changed. Excluding the new QA evidence directory and this report, the only changed files are:
- `tests/wf5-alpha26-acceptance-gate.js`
- `package.json`

## Promotion decision
The Alpha checkpoint remains **HOLD / NOT PROMOTABLE**.

WF2 remains promotable only at its data boundary. WF3 Candidate 02 remains review evidence only and customer `missing`. WF1 and WF4 remain returned. No reference-only, `master-draft`, `layer-draft`, unsupported exact-SKU, blocked-fitment, unreviewed, stale-evidence, or checksum-divergent visual output is approved by WF5 for customer production.

## Next QA dependency
The highest-priority next candidate remains **WF4**, with the binary/version evidence boundary first.

1. **WF4 / production binary immutability:** deny direct binary replacement on a production-ready asset or force replacement through `stageAssetVersion` → review → `promoteAssetVersion`; resolver admission must verify the active object checksum equals the active immutable production-version checksum and its immutable review evidence.
2. **WF4 / candidate evidence reset:** when staging a new version, clear prior `approval.reviewEvidence`, prior reference IDs and any binary-specific source binding; require explicit evidence binding for the staged checksum/version before review/promotion.
3. **WF4 / canonical provenance gate:** resolve every `provenance.referenceId` against governed evidence, enforce allowed rights/vehicle identity, and bind canonical-master promotion to the exact canonical brief/view.
4. **WF4 / server-authoritative project/quote handoff:** recompute/validate render readiness and fitment gates during persistence; construct quotes from the stored immutable project revision or reject mismatches.
5. **WF4 / quote immutability:** make issued formal quotes immutable or explicitly revisioned.
6. **WF4 / direct production parity:** remove/deny direct production promotion or require the same immutable reviewer/version/checksum/audit evidence as governed version promotion.
7. **WF1:** revalidate `anyOfRequiredParts` after removal and persist unresolved OR-dependency gates through project → quote lineage whenever no valid alternative remains.

The next WF4/WF1 remediation candidate should be rerun against this Push 11 gate unchanged.
