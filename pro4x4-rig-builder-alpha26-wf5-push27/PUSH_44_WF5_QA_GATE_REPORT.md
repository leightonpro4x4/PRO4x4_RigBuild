# PRO4X4 Rig Builder — Alpha 26 WF5 QA / Integration Gate — Push 14

## Decision
**HOLD / NOT PROMOTABLE.**

Push 14 is QA/integration only. No product features, catalogue records, customer UX, runtime production behaviour or visual assets were changed. The latest merged Alpha candidate inputs remain WF1 Run 02, WF2 Ranger Support Push 07, WF3 Y62 F34 Push 32 and WF4 Review Evidence Push 04.

## Package adjudication
- **WF1 Run 02 — RETURNED.** Existing customer conditional-fitment UX remains regression-green, but three `anyOfRequiredParts` acceptance failures remain in persisted BOM/quote behaviour and removal revalidation.
- **WF2 Ranger Support Push 07 — PASS / LOCK DATA BOUNDARY.** 39 Ranger catalogue records and 20 source-evidence records remain deduplicated and conservative; unknown install values stay unknown and unproven Type X EVO Ranger fitment remains withheld.
- **WF3 Y62 F34 Push 32 — PASS AS REVIEW EVIDENCE ONLY / RETURN FOR CANONICAL MASTER.** `Y62-F34-V1-CANDIDATE-02` remains `master-draft`, customer-hidden and exact resolver state `missing`. No reference-only, draft or unsupported visual is promoted.
- **WF4 Review Evidence Push 04 — RETURNED.** Push 14 adds one further reviewer-authenticity trust-boundary failure to the existing production-governance, provenance, resolver and lineage defects.
- **WF5 Push 14 — PASS AS QA PACKAGE.** The QA package adds targeted acceptance coverage, preserves all prior regression controls and keeps the composite release gate red only at known acceptance blockers.

## New finding — WF4-REVIEWER-IDENTITY-AUTHENTICITY
The governed version-promotion path currently treats `governance.reviewedBy` as trusted free-text candidate metadata rather than an authenticated/audited reviewer identity.

WF5 staged a legitimate transparent product-layer candidate, then:
1. staged the binary as actor `wf5-stager`;
2. edited the candidate as actor `wf5-editor`;
3. set `reviewedBy` to `ghost-reviewer-never-authenticated` with a review timestamp;
4. promoted the candidate as actor `wf5-promoter`.

The promotion succeeded and immutable `approval.reviewEvidence` recorded `ghost-reviewer-never-authenticated` as the reviewer, despite there being no review audit event performed by that identity. The audit trail only shows the real stager/editor/promoter actors.

This breaks the intent of the Alpha 26 reviewer-evidence requirement: the immutable record can preserve a reviewer string that was never authenticated as the reviewer of that exact candidate/version/checksum.

### Required behaviour
A production approval must bind reviewer identity to an authenticated and auditable review transition for the exact candidate version/checksum. Acceptable remediation patterns include:
- an explicit review/approve action whose authenticated actor becomes `reviewedBy` and whose timestamp is server-generated; or
- validation during candidate update/promotion that the persisted reviewer identity matches an auditable authenticated actor transition for that exact version.

A promoter must not be able to manufacture reviewer identity simply by editing `reviewedBy` / `reviewedAt` fields before promotion.

The existing positive governed-promotion control remains green where `wf5-reviewer` is the actor performing the candidate review path, so this new test does not prohibit legitimate review/promotion; it rejects unauthenticated reviewer claims.

## Acceptance gate state
`npm run test:wf5-acceptance` now reports **17 failing checks across 2 returned delivery lanes**.

### WF1 root defects — 3
1. `WF1-BOM-ANYOF` — unsatisfied OR dependency is missing from immutable project/quote gates.
2. `WF1-QUOTE-ANYOF` — downstream quote review treats the orphaned OR dependency as approved.
3. `WF1-REMOVE-ANYOF` — removing the final valid support item can strand the dependent selection.

### WF4 / shared-platform defects — 14
4. `WF4-DIRECT-PRODUCTION-REVIEW` — direct production upsert does not require immutable reviewer identity/timestamp.
5. `WF4-DIRECT-PRODUCTION-EVIDENCE` — reviewed direct upsert does not create checksum-pinned immutable review/audit evidence equivalent to version promotion.
6. `WF4-REVIEWER-IDENTITY-AUTHENTICITY` — governed promotion accepts a forged/free-text reviewer identity with no authenticated review audit for that exact candidate version.
7. `WF4-MASTER-REFERENCE-BACKING` — governed version promotion can make a canonical master customer-available with no reference IDs.
8. `WF4-QUOTE-GATE-TRUST-BOUNDARY` — quote intake trusts client-supplied fitment gates and can finalise a BOM whose required fitment review was omitted.
9. `WF4-MASTER-REFERENCE-ID-VALIDITY` — arbitrary/non-existent persisted reference IDs can satisfy the current promotion path.
10. `WF4-MASTER-BRIEF-REFERENCE-BINDING` — valid but unrelated owner references can be substituted for the exact canonical-view brief evidence.
11. `WF4-PRODUCTION-BINARY-IMMUTABILITY` — an approved production binary can be replaced without a new immutable reviewed version and the replacement becomes customer `available` under stale approval/version evidence.
12. `WF4-PRODUCTION-IDENTITY-IMMUTABILITY` — an approved product-layer binary can be retargeted to a different exact SKU without a new governed version/review.
13. `WF4-CANDIDATE-EVIDENCE-RESET` — a newly staged replacement binary inherits the previous production version's review evidence and reference bindings.
14. `WF4-BLOCKED-FITMENT-PRECEDENCE` — an exact active fitment block is outranked by an existing production-ready visual for the same exact tuple.
15. `WF4-PROJECT-RENDER-TRUST-BOUNDARY` — unsupported customer-supplied production-ready render metadata can be persisted into project/share/quote artifacts.
16. `WF4-QUOTE-PROJECT-REVISION-BINDING` — a quote can claim immutable project/revision lineage while carrying BOM/customer/render data that differs from that stored revision and can still be formally finalised.
17. `WF4-FINALISED-QUOTE-IMMUTABILITY` — a customer upsert can mutate an already-finalised formal quote in place.

Passing acceptance controls remain:
- `WF1-BOM-ANYOF-SATISFIED` — one valid alternative satisfies one-of semantics without forcing every alternative.
- `WF5-OWNER-REFERENCE-PACK-INTEGRITY` — all 9 owner files/checksums/rights and canonical brief references verify.
- `WF5-CUSTOMER-DRAFT-ISOLATION` — customer entrypoint remains isolated from draft/reference tooling with `fallbackPolicy: none`.

## Visual governance / exact resolver behaviour
`npm run test:wf5-visual-safety` — **PASS**.

Still proven under governed/non-conflicting fixtures:
- reference-only output is rejected;
- `master-draft` is customer `missing`;
- `layer-draft` is customer `missing`;
- a lone blocked-fitment record resolves `blocked`;
- unsupported exact SKU resolves `missing`;
- no visual fallback/substitution is used; and
- draft/candidate states expose no production binary URL.

`npm run test:render-resolver` — **PASS** for exact `available / missing / blocked`, exact-SKU matching, checksum-pinned binary delivery and `fallbackPolicy: none` under the approved-flow fixtures.

The existing WF3 F34 Candidate 02 remains customer `missing`. Push 14 promotes no project visual asset.

## Compatibility / BOM integrity
WF2 Push 07 remains clean at the data boundary:
- 39 Ranger catalogue records;
- 20 source-evidence records;
- zero duplicate IDs/SKUs under its package test;
- unknown install values remain unknown;
- staff-review states remain preserved; and
- unproven Type X EVO Ranger fitment remains withheld.

WF1 remains returned because unresolved `anyOfRequiredParts` dependencies can still disappear from immutable project/quote gates and can become stranded after supporting-item removal.

## Governed promotion and immutable lineage
`npm run test:wf5-promotion` — **PASS**.

The positive path still proves:
- staged drafts remain customer-hidden;
- missing reviewer fields block governed promotion;
- a valid reference-backed F34 positive fixture can promote;
- approved master becomes exact `available` only after governed promotion;
- checksum/version review evidence is persisted; and
- existing R0001 project/share/quote visual history remains pinned when R0002 later sees a newly approved visual.

Push 14 adds the missing identity-authenticity negative case: reviewer fields being present is not sufficient if the claimed reviewer cannot be tied to an authenticated/audited review transition.

## Verification evidence
- Full `npm test` Alpha 12 → current Alpha 26 regression chain: **PASS**.
- Latest-candidate integration: **PASS** (`wf2Catalogue39=true`, `wf2Evidence20=true`, WF3 Candidate 02 customer state `missing`).
- Explicit visual-safety rejection suite: **PASS**.
- Governed reference-backed promotion + immutable project/revision/share/quote historical visual lineage positive control: **PASS**.
- Exact render resolver suite: **PASS**.
- `npm run check`: **PASS**.
- WF5 acceptance gate: **FAIL / EXPECTED HOLD**, 17 checks across the 2 returned lanes above.
- Composite `npm run test:gate`: **FAIL / EXPECTED HOLD** only when it reaches the acceptance blockers after all preceding suites pass.
- JavaScript syntax sweep: **91 JS files / 0 failures**.
- JSON parse sweep: **24 JSON files / 0 failures**.
- HTML dependency sweep: **16 HTML files / 239 local references / 0 missing**.
- Final package ZIP integrity check: **PASS** (no compressed-data errors).
- Push 14 evidence logs are stored under `qa-evidence/wf5-push14/`.

## Change isolation
Push 14 changes QA evidence only plus QA package metadata/reporting. No application/runtime/product/visual implementation file was changed.

Expected changed package files versus Push 13 are:
- `tests/wf5-alpha26-acceptance-gate.js` — adds `WF4-REVIEWER-IDENTITY-AUTHENTICITY`.
- `package.json` — QA package version/description only.
- `qa-evidence/WF5_INTEGRATION_MANIFEST.json` — QA checkpoint/blocker metadata only.
- `qa-evidence/wf5-push14/*` — verification logs.
- `PUSH_44_WF5_QA_GATE_REPORT.md` — this report.

## Promotion decision
The Alpha checkpoint remains **HOLD / NOT PROMOTABLE**.

WF2 remains promotable only at its verified data boundary. WF3 Candidate 02 remains review evidence only and customer `missing`. WF1 and WF4 remain returned. No reference-only, `master-draft`, `layer-draft`, unsupported exact-SKU, blocked-fitment, unreviewed, stale-evidence, checksum-divergent, retargeted or unauthenticated-review visual output is approved by WF5 for customer production.

## Next QA dependency
The highest-priority next candidate remains **WF4/shared platform**, now with reviewer identity authenticity included in the production-admission trust boundary.

1. **WF4 / authenticated reviewer transition:** make review an actor-bound/audited event for the exact candidate version/checksum; do not trust editable `reviewedBy` / `reviewedAt` strings.
2. **WF4 / production tuple immutability:** bind `vehicleId + viewId + layerId + exactSku + renderState + checksum` to the reviewed immutable production version and reject direct retargeting.
3. **WF4 / production binary immutability:** deny direct replacement of a production-ready binary or force replacement through stage → review → promote; resolver admission must verify active checksum against active immutable version/review evidence.
4. **WF4 / blocked-fitment precedence:** an active exact fitment block must override any matching production-ready visual until explicitly cleared.
5. **WF4 / candidate evidence reset:** staging a new version must clear prior binary-specific review evidence/reference bindings and require fresh evidence for that version.
6. **WF4 / canonical provenance gate:** validate reference IDs, rights, vehicle identity and exact canonical-brief binding before promotion.
7. **WF4 / server-authoritative project/quote handoff:** recompute/validate render readiness and fitment gates during persistence; construct quotes from the stored immutable project revision or reject mismatches.
8. **WF4 / quote immutability:** make issued formal quotes immutable or explicitly revisioned.
9. **WF4 / direct production parity:** remove/deny direct production promotion or require the same immutable reviewer/version/checksum/audit evidence as governed version promotion.
10. **WF1:** revalidate `anyOfRequiredParts` after removal and persist unresolved OR-dependency gates through project → quote lineage whenever no valid alternative remains.

The next WF4/WF1 remediation candidate should be rerun against this Push 14 gate unchanged.
