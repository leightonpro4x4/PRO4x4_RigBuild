# PRO4X4 Rig Builder — Alpha 26 WF5 QA / Integration Gate — Push 15

## Decision
**HOLD / NOT PROMOTABLE.**

Push 15 is QA/integration only. No product features, catalogue records, customer UX, runtime production behaviour or visual assets were changed. The latest merged Alpha candidate inputs remain WF1 Run 02, WF2 Ranger Support Push 07, WF3 Y62 F34 Push 32 and WF4 Review Evidence Push 04.

## Package adjudication
- **WF1 Run 02 — RETURNED.** Existing conditional-fitment UX remains regression-green, but the three `anyOfRequiredParts` persistence/removal failures remain release blockers.
- **WF2 Ranger Support Push 07 — PASS / LOCK DATA BOUNDARY.** 39 Ranger catalogue records and 20 source-evidence records remain deduplicated and conservative; unknown install values remain unknown and unsupported fitment remains withheld.
- **WF3 Y62 F34 Push 32 — PASS AS REVIEW EVIDENCE ONLY / RETURN FOR CANONICAL MASTER.** `Y62-F34-V1-CANDIDATE-02` remains `master-draft`, customer-hidden and exact resolver state `missing`.
- **WF4 Review Evidence Push 04 — RETURNED.** Push 15 adds a public-share revision-isolation failure to the existing production-governance, provenance, resolver, project and quote-lineage defects.
- **WF5 Push 15 — PASS AS QA PACKAGE.** Targeted QA coverage was added without altering product/runtime implementation, and the release gate remains intentionally red only at acceptance blockers.

## New finding — WF4-SHARE-REVISION-ISOLATION
A public share token that is correctly pinned to immutable revision `R0001` currently exposes later project revisions that were never shared.

WF5 created `R0001`, created a `customer-view` share explicitly pinned to `R0001`, then created a private `R0002` containing deliberately distinct customer/staff-note data. `resolveShare(token)` still returned `revision.id = R0001`, but its accompanying `project` object contained the full live project revision array, including the private `R0002` snapshot and `currentRevisionId = R0002`.

The public API route `/api/v1/shares/:token` returns that object directly. Therefore the token is visually pinned in the current share UI, but the API trust boundary is not revision-isolated: a holder of an older share can inspect later unshared project state from the response.

### Required behaviour
A public share response must be a revision-scoped immutable projection. It should return only:
- the share metadata required for display/expiry/revocation semantics;
- sanitised project metadata that cannot expose other revisions or private share state; and
- the single immutable revision explicitly referenced by the share.

It must not return later/earlier unshared revision snapshots, silently follow `currentRevisionId`, or expose a live project object whose contents can advance after the share was issued.

The existing positive lineage test remains green: the selected `revision` object itself stays pinned to `R0001` after `R0002` is created. Push 15 closes the missing negative case by verifying that the rest of the public response is isolated to the same revision boundary.

## Acceptance gate state
`npm run test:wf5-acceptance` reports **18 failing checks across 2 returned delivery lanes**.

### WF1 root defects — 3
1. `WF1-BOM-ANYOF` — unsatisfied OR dependency is missing from immutable project/quote gates.
2. `WF1-QUOTE-ANYOF` — downstream quote review treats the orphaned OR dependency as approved.
3. `WF1-REMOVE-ANYOF` — removing the final valid support item can strand the dependent selection.

### WF4 / shared-platform defects — 15
4. `WF4-DIRECT-PRODUCTION-REVIEW` — direct production upsert does not require immutable reviewer identity/timestamp.
5. `WF4-DIRECT-PRODUCTION-EVIDENCE` — reviewed direct upsert lacks checksum-pinned review/audit evidence equivalent to governed promotion.
6. `WF4-REVIEWER-IDENTITY-AUTHENTICITY` — promotion accepts a forged/free-text reviewer identity without an authenticated review transition for that exact candidate.
7. `WF4-MASTER-REFERENCE-BACKING` — a canonical master can become customer-available with no reference IDs.
8. `WF4-QUOTE-GATE-TRUST-BOUNDARY` — quote intake trusts client-supplied fitment gates and can finalise a BOM whose required fitment review was omitted.
9. `WF4-MASTER-REFERENCE-ID-VALIDITY` — arbitrary/non-existent reference IDs can satisfy current promotion admission.
10. `WF4-MASTER-BRIEF-REFERENCE-BINDING` — valid but unrelated owner references can be substituted for the exact canonical-view brief evidence.
11. `WF4-PRODUCTION-BINARY-IMMUTABILITY` — an approved production binary can be replaced without a new reviewed version and become customer `available` under stale approval evidence.
12. `WF4-PRODUCTION-IDENTITY-IMMUTABILITY` — an approved product-layer binary can be retargeted to a different exact SKU without a new governed review.
13. `WF4-CANDIDATE-EVIDENCE-RESET` — a newly staged replacement binary inherits prior production review/reference bindings.
14. `WF4-BLOCKED-FITMENT-PRECEDENCE` — an exact active fitment block is outranked by an existing production-ready visual for the same tuple.
15. `WF4-PROJECT-RENDER-TRUST-BOUNDARY` — unsupported client-supplied production-ready render metadata can be persisted into project/share/quote artifacts.
16. `WF4-QUOTE-PROJECT-REVISION-BINDING` — a quote can claim immutable project/revision lineage while carrying commercial/render data that differs from that revision and still be finalised.
17. `WF4-FINALISED-QUOTE-IMMUTABILITY` — a customer upsert can mutate an already-finalised formal quote in place.
18. `WF4-SHARE-REVISION-ISOLATION` — a public share pinned to `R0001` exposes later unshared `R0002` snapshot data through the returned live project object.

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

`npm run test:render-resolver` — **PASS** for exact `available / missing / blocked`, exact-SKU matching, checksum-pinned binary delivery and `fallbackPolicy: none` in the approved-flow fixtures.

WF3 F34 Candidate 02 remains customer `missing`; Push 15 promotes no project visual asset.

## Compatibility / BOM integrity
WF2 Push 07 remains clean at the verified data boundary:
- 39 Ranger catalogue records;
- 20 source-evidence records;
- zero duplicate IDs/SKUs under package tests;
- unknown install values remain unknown;
- staff-review states remain preserved; and
- unproven fitment remains withheld.

WF1 remains returned because unresolved `anyOfRequiredParts` dependencies can disappear from immutable project/quote gates and can become stranded after supporting-item removal.

## Governed promotion and immutable lineage
`npm run test:wf5-promotion` — **PASS**.

The positive path still proves:
- staged drafts remain customer-hidden;
- missing reviewer fields block governed promotion;
- a valid reference-backed F34 fixture can promote;
- approved master becomes exact `available` only after governed promotion;
- checksum/version review evidence is persisted; and
- R0001 project/share/quote visual history remains pinned when R0002 later sees a newly approved visual.

Push 15 adds the missing share-response isolation negative case: immutable revision selection alone is insufficient if the public response also leaks the live project's later revisions.

## Verification evidence
- Full `npm test` Alpha 12 → current Alpha 26 regression chain: **PASS**.
- Latest-candidate integration: **PASS** (`wf2Catalogue39=true`, `wf2Evidence20=true`, WF3 Candidate 02 customer state `missing`).
- Explicit visual-safety rejection suite: **PASS**.
- Governed reference-backed promotion + immutable historical project/revision/share/quote visual lineage positive control: **PASS**.
- Exact render resolver suite: **PASS**.
- `npm run check`: **PASS**.
- WF5 acceptance gate: **FAIL / EXPECTED HOLD**, 18 checks across the 2 returned lanes above.
- Composite `npm run test:gate`: **FAIL / EXPECTED HOLD** only when it reaches acceptance blockers after all preceding suites pass.
- JavaScript syntax sweep: **91 JS files / 0 failures**.
- JSON parse sweep: **25 JSON files / 0 failures** including generated QA evidence.
- HTML dependency sweep: **16 HTML files / 239 local references / 0 missing**.
- Push 15 evidence logs are stored under `qa-evidence/wf5-push15/`.

## Change isolation
Push 15 changes QA evidence only plus QA package metadata/reporting. No application/runtime/product/visual implementation file was changed.

Expected changed package files versus Push 14 are:
- `tests/wf5-alpha26-acceptance-gate.js` — adds `WF4-SHARE-REVISION-ISOLATION`.
- `package.json` — QA package version/description only.
- `qa-evidence/WF5_INTEGRATION_MANIFEST.json` — checkpoint/blocker metadata only.
- `qa-evidence/wf5-push15/*` — verification logs.
- `PUSH_45_WF5_QA_GATE_REPORT.md` — this report.

## Promotion decision
The Alpha checkpoint remains **HOLD / NOT PROMOTABLE**.

WF2 remains promotable only at its verified data boundary. WF3 Candidate 02 remains review evidence only and customer `missing`. WF1 and WF4 remain returned. WF5 does not approve reference-only, `master-draft`, `layer-draft`, unsupported exact-SKU, active blocked-fitment, unreviewed, stale-evidence, checksum-divergent, retargeted, unauthenticated-review, or revision-leaking share output for customer production.

## Next QA dependency
The highest-priority next candidate remains **WF4/shared platform**.

1. **WF4 / public share revision isolation:** make `/api/v1/shares/:token` return a sanitised revision-scoped projection only; never expose the live project's other revisions/current revision through a pinned share.
2. **WF4 / authenticated reviewer transition:** bind review identity to an authenticated/audited event for the exact candidate version/checksum.
3. **WF4 / production tuple + binary immutability:** bind vehicle/view/layer/SKU/render-state/checksum to the reviewed immutable production version and force all replacements/retargeting through stage → review → promote.
4. **WF4 / blocked-fitment precedence:** active exact fitment blocks must override matching production-ready visuals until explicitly cleared.
5. **WF4 / candidate evidence reset:** new candidates must start without prior binary-specific review/reference evidence.
6. **WF4 / canonical provenance gate:** validate reference existence, rights, vehicle/view identity and exact canonical-brief binding before promotion.
7. **WF4 / server-authoritative project/quote handoff:** recompute/validate render readiness and fitment gates during persistence; bind quotes to stored immutable revisions.
8. **WF4 / quote immutability:** make issued formal quotes immutable or explicitly revisioned.
9. **WF4 / direct production parity:** remove/deny direct production promotion or require the same immutable reviewer/version/checksum/audit evidence as governed promotion.
10. **WF1:** revalidate `anyOfRequiredParts` after removal and preserve unresolved OR-dependency gates through project → quote lineage whenever no valid alternative remains.

The next WF4/WF1 remediation candidate should be rerun against this Push 15 gate unchanged.
