# PRO4X4 Rig Builder — Alpha 26 WF5 QA / Integration Gate — Push 17

## Decision
**HOLD / NOT PROMOTABLE.**

Push 17 is QA/integration only. No product features, catalogue records, customer UX, runtime production behaviour or visual assets were changed. The candidate inputs remain WF1 Run 02, WF2 Ranger Support Push 07, WF3 Y62 F34 Push 32 and WF4 Review Evidence Push 04.

## Package adjudication
- **WF1 Run 02 — RETURNED.** Conditional-fitment UX remains regression-green, but the three `anyOfRequiredParts` persistence/removal failures remain release blockers.
- **WF2 Ranger Support Push 07 — PASS / LOCK DATA BOUNDARY.** 39 Ranger catalogue records and 20 source-evidence records remain deduplicated and conservative; unknown install values remain unknown and unsupported fitment remains withheld.
- **WF3 Y62 F34 Push 32 — PASS AS REVIEW EVIDENCE ONLY / RETURN FOR CANONICAL MASTER.** `Y62-F34-V1-CANDIDATE-02` remains `master-draft`, customer-hidden and exact resolver state `missing`.
- **WF4 Review Evidence Push 04 — RETURNED.** Push 17 adds an exact production-tuple uniqueness defect to the existing production-governance, provenance, resolver, project/share and quote-lineage defects.
- **WF5 Push 17 — PASS AS QA PACKAGE.** Targeted QA coverage was added without altering product/runtime implementation; the release gate remains intentionally red only at acceptance blockers.

## New finding — WF4-PRODUCTION-TUPLE-UNIQUENESS
The governed production path currently allows two different asset IDs and two independently reviewed binaries to become `production-ready` for the **same exact vehicle/view/layer/SKU/render-state tuple**.

WF5 created two separate Y62 Front 3/4 `bullbar` assets with the same exact SKU `WF5-DUPLICATE-TUPLE-SKU`, staged different binaries for each, reviewed each candidate, and promoted each through the normal governed version path. Both remained simultaneously `production-ready` for the same exact tuple.

The customer resolver then returned `available` and silently selected the most recently updated asset (`WF5-DUPLICATE-TUPLE-B`). The competing approved asset (`WF5-DUPLICATE-TUPLE-A`) remained equally valid in the registry. The selection is therefore based on row ranking/update time rather than a unique immutable production identity.

This is a release blocker because an exact request can produce a different customer visual merely because another duplicate record was touched or promoted later, while the response still reports `exactMatchRequired: true` and `productionReady: true`.

### Required behaviour
For every exact production tuple — **vehicle + view + layer + exact SKU + canonical render state** — the platform must enforce one authoritative production owner. Any of the following are acceptable if implemented atomically and audibly:
- reject promotion when another production-ready asset already owns the exact tuple;
- explicitly supersede/retire the prior tuple owner as part of the same governed promotion transaction; or
- detect an ambiguous production tuple at resolve time and return non-production (`missing`/blocked ambiguity), never arbitrarily choose one.

The immutable production version and audit trail must identify which exact tuple it owns. Duplicate `production-ready` rows may not coexist as interchangeable candidates for customer output.

## Acceptance gate state
`npm run test:wf5-acceptance` reports **20 failing checks across 2 returned delivery lanes**.

### WF1 root defects — 3
1. `WF1-BOM-ANYOF` — unsatisfied OR dependency is missing from immutable project/quote gates.
2. `WF1-QUOTE-ANYOF` — downstream quote review treats the orphaned OR dependency as approved.
3. `WF1-REMOVE-ANYOF` — removing the final valid support item can strand the dependent selection.

### WF4 / shared-platform defects — 17
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
15. `WF4-RENDER-STATE-EXACTNESS` — a stateful layer can resolve `available` when the required state dimension is omitted, allowing arbitrary state substitution.
16. `WF4-PRODUCTION-TUPLE-UNIQUENESS` — multiple independently approved production assets can own the same exact tuple and the resolver silently chooses one by ranking/update time.
17. `WF4-PROJECT-RENDER-TRUST-BOUNDARY` — unsupported client-supplied production-ready render metadata can be persisted into project/share/quote artifacts.
18. `WF4-QUOTE-PROJECT-REVISION-BINDING` — a quote can claim immutable project/revision lineage while carrying commercial/render data that differs from that revision and still be finalised.
19. `WF4-FINALISED-QUOTE-IMMUTABILITY` — a customer upsert can mutate an already-finalised formal quote in place.
20. `WF4-SHARE-REVISION-ISOLATION` — a public share pinned to `R0001` exposes later unshared revision data through the returned live project object.

Passing acceptance controls remain:
- `WF1-BOM-ANYOF-SATISFIED` — one valid alternative satisfies one-of semantics without forcing every alternative.
- `WF5-OWNER-REFERENCE-PACK-INTEGRITY` — all 9 owner files/checksums/rights and canonical brief references verify.
- `WF5-CUSTOMER-DRAFT-ISOLATION` — customer entrypoint remains isolated from draft/reference tooling with `fallbackPolicy: none`.

## Visual governance / exact resolver behaviour
`npm run test:wf5-visual-safety` — **PASS** for the existing governed fixtures.

Still proven:
- reference-only output is rejected;
- `master-draft` is customer `missing`;
- `layer-draft` is customer `missing`;
- a lone blocked-fitment record resolves `blocked`;
- unsupported exact SKU resolves `missing`;
- no visual fallback/substitution is used in the covered exact-state fixtures; and
- draft/candidate states expose no production binary URL.

`npm run test:render-resolver` — **PASS** for existing exact-state fixtures, checksum-pinned binary delivery and `fallbackPolicy: none`. Push 17 adds the missing negative test for **duplicate exact production ownership**, which currently fails acceptance.

WF3 F34 Candidate 02 remains customer `missing`; Push 17 promotes no project visual asset.

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
- historical R0001 project/share/quote visual lineage remains pinned when R0002 later sees a newly approved visual.

The new negative tuple-uniqueness test does not alter that positive path; it demonstrates that governed promotion must also enforce a unique active owner for each exact production tuple.

## Verification evidence
- Full `npm test` Alpha 12 → current Alpha 26 regression chain: **PASS**.
- Latest-candidate integration: **PASS** (`wf2Catalogue39=true`, `wf2Evidence20=true`, WF3 Candidate 02 customer state `missing`).
- Explicit visual-safety rejection suite: **PASS**.
- Governed reference-backed promotion + immutable historical project/revision/share/quote visual lineage positive control: **PASS**.
- Exact render resolver suite: **PASS** for its covered exact-state fixtures.
- `npm run check`: **PASS**.
- JavaScript syntax sweep: **91 JS files / 0 failures**.
- JSON parse sweep: **25 JSON files / 0 failures** including generated QA metadata.
- HTML dependency sweep: **16 HTML files / 239 local references / 0 missing**.
- WF5 acceptance gate: **FAIL / EXPECTED HOLD**, 20 checks across the 2 returned lanes above.
- Composite `npm run test:gate`: **FAIL / EXPECTED HOLD** only when it reaches acceptance blockers after all preceding suites pass.
- Final package ZIP integrity: **PASS**.
- Push 17 evidence logs are stored under `qa-evidence/wf5-push17/`.

## Change isolation
Push 17 changes QA evidence only plus QA package metadata/reporting. No application/runtime/product/visual implementation file was changed.

Expected changed package files versus Push 16 are:
- `tests/wf5-alpha26-acceptance-gate.js` — adds `WF4-PRODUCTION-TUPLE-UNIQUENESS`.
- `package.json` — QA package version/description only.
- `qa-evidence/WF5_INTEGRATION_MANIFEST.json` — checkpoint/blocker metadata only.
- `qa-evidence/wf5-push17/*` — verification logs.
- `PUSH_47_WF5_QA_GATE_REPORT.md` — this report.

## Promotion decision
The Alpha checkpoint remains **HOLD / NOT PROMOTABLE**.

WF2 remains promotable only at its verified data boundary. WF3 Candidate 02 remains review evidence only and customer `missing`. WF1 and WF4 remain returned. WF5 does not approve reference-only, `master-draft`, `layer-draft`, unsupported exact-SKU, underspecified render-state, ambiguous duplicate production tuples, active blocked-fitment, unreviewed, stale-evidence, checksum-divergent, retargeted, unauthenticated-review, or revision-leaking share output for customer production.

## Next QA dependency
The highest-priority next candidate remains **WF4/shared platform**.

1. **WF4 / exact production tuple ownership:** enforce a unique active production owner for vehicle/view/layer/SKU/render-state, with atomic supersession or conflict rejection; resolver must never pick arbitrarily among duplicate production-ready rows.
2. **WF4 / strict render-state admission:** require the exact state keys for stateful layers and canonicalise/validate `stateKey`; underspecified requests must reject or resolve `missing`.
3. **WF4 / public share revision isolation:** make `/api/v1/shares/:token` return a sanitised revision-scoped projection only.
4. **WF4 / authenticated reviewer transition:** bind review identity to an authenticated/audited event for the exact candidate version/checksum.
5. **WF4 / production tuple + binary immutability:** bind vehicle/view/layer/SKU/render-state/checksum to the reviewed immutable production version and force replacements/retargeting through stage → review → promote.
6. **WF4 / blocked-fitment precedence:** active exact fitment blocks must override matching production-ready visuals until explicitly cleared.
7. **WF4 / candidate evidence reset:** new candidates must start without prior binary-specific review/reference evidence.
8. **WF4 / canonical provenance gate:** validate reference existence, rights, vehicle/view identity and exact canonical-brief binding before promotion.
9. **WF4 / server-authoritative project/quote handoff:** recompute/validate render readiness and fitment gates during persistence; bind quotes to stored immutable revisions.
10. **WF4 / quote immutability:** make issued formal quotes immutable or explicitly revisioned.
11. **WF4 / direct production parity:** remove/deny direct production promotion or require the same immutable reviewer/version/checksum/audit evidence as governed promotion.
12. **WF1:** revalidate `anyOfRequiredParts` after removal and preserve unresolved OR-dependency gates through project → quote lineage whenever no valid alternative remains.

The next WF4/WF1 remediation candidate should be rerun against this Push 17 gate unchanged.
