# PRO4X4 Rig Builder — Alpha 26 WF5 QA / Integration Gate — Push 09

## Scope
WF5-only QA hardening against the latest merged Alpha 26 checkpoint. No customer product feature, catalogue record, runtime production behaviour, customer UX, or visual asset was built or altered. This push changes only QA test/evidence metadata plus this report.

The governing visual rule remains `REFERENCE_BACKED_APPROVED_VISUALS_ONLY`. Reference-only, `master-draft`, `layer-draft`, unsupported exact-SKU, unreviewed, or otherwise unsupported visual output remains non-production.

## Package adjudication

| Package | QA decision | Evidence / rationale |
|---|---|---|
| WF1 Run 02 | **PACKAGE PASS / LANE RETURNED** | Conditional-fitment messaging remains green. Three OR-dependency acceptance defects remain open: durable `anyOfRequiredParts` gate loss, downstream quote-review propagation, and removal revalidation. |
| WF2 Push 07 | **PASS / LOCK DATA** | 39 Ranger products / 20 source-evidence records remain deduplicated, source-backed and conservative. Unknowns remain unknown; no approved customer visual is introduced. |
| WF3 Push 32 | **PASS AS REVIEW ARTIFACT / RETURN FOR MASTER** | `Y62-F34-V1-CANDIDATE-02` remains `master-draft`, customer-hidden, rights/overlay incomplete and exact customer state `missing`. |
| WF4 Push 04 | **PACKAGE PASS / LANE RETURNED** | Staff evidence visibility remains useful, but shared production/quote controls now have nine explicit acceptance failures, including the new quote-to-project-revision lineage failure below. |
| WF5 Push 09 | **PASS AS QA PACKAGE** | QA-only test/evidence added. Historical regression and static verification remain green; composite release gate stays red only on acceptance blockers. |

## New QA coverage in Push 09

### Immutable quote → project revision binding — FAIL / RETURN WF4
New acceptance check `WF4-QUOTE-PROJECT-REVISION-BINDING` creates a genuine immutable project revision `R0001`, then submits a quote that still claims that same project/revision lineage while changing the customer name, injecting a BOM line never saved in `R0001`, and replacing the saved `missing` render state with a fake `productionReady:true` / `available` asset claim.

Current result: **FAIL**.

Observed behaviour: quote intake accepts the divergent payload while preserving `project.id` + `revisionId=R0001`. Because the injected line has no unresolved price/fitment requirement, the altered quote can also be formally finalised. The resulting formal quote therefore claims immutable `R0001` lineage while containing commercial/render data that never existed in `R0001`.

Required remediation: a quote that references a project revision must either be constructed/canonicalised from the stored immutable revision snapshot, or reject any material mismatch. If commercial selections, fitment gates, customer/render state, or other quote-driving fields change, the system must first create an explicit new project/quote revision with lineage rather than reusing the prior revision identity.

This is distinct from Push 08's finalised-quote mutation finding: Push 08 proved a quote can be changed **after issue**; Push 09 proves a quote can already be detached from its claimed immutable project revision **before issue**.

## Acceptance gate state
`npm run test:wf5-acceptance` now reports **12 failing checks across 2 returned delivery lanes**.

WF1 root defects:
1. `WF1-BOM-ANYOF` — unsatisfied OR dependency is missing from immutable project/quote gates.
2. `WF1-QUOTE-ANYOF` — downstream quote review treats the orphaned OR dependency as approved.
3. `WF1-REMOVE-ANYOF` — removing the final valid support item can strand the dependent selection.

WF4 / shared-platform defects:
4. `WF4-DIRECT-PRODUCTION-REVIEW` — direct production upsert does not require immutable reviewer identity/timestamp.
5. `WF4-DIRECT-PRODUCTION-EVIDENCE` — reviewed direct upsert does not create checksum-pinned immutable review/audit evidence equivalent to version promotion.
6. `WF4-MASTER-REFERENCE-BACKING` — governed version promotion can make a canonical master customer-available with no reference IDs.
7. `WF4-QUOTE-GATE-TRUST-BOUNDARY` — quote intake trusts client-supplied fitment gates and can finalise a BOM whose required fitment review was omitted.
8. `WF4-MASTER-REFERENCE-ID-VALIDITY` — arbitrary/non-existent persisted reference IDs can satisfy the current promotion path.
9. `WF4-MASTER-BRIEF-REFERENCE-BINDING` — valid but unrelated owner references can be substituted for the exact canonical-view brief evidence.
10. `WF4-PROJECT-RENDER-TRUST-BOUNDARY` — unsupported customer-supplied production-ready render metadata can be persisted into project/share/quote artifacts.
11. `WF4-QUOTE-PROJECT-REVISION-BINDING` — a quote can claim immutable project/revision lineage while carrying BOM/customer/render data that differs from that stored revision and can still be formally finalised.
12. `WF4-FINALISED-QUOTE-IMMUTABILITY` — a customer upsert can mutate an already-finalised formal quote in place.

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

`npm run test:render-resolver` — **PASS** for exact `available / missing / blocked`, exact-SKU matching, checksum-pinned binary delivery and fallback policy `none`.

The current WF3 F34 candidate remains customer `missing`. Push 09 promotes no visual asset.

## Governed promotion and immutable lineage
`npm run test:wf5-promotion` — **PASS**.

The positive path still proves staged drafts remain customer-hidden, reviewer evidence is mandatory for governed version promotion, valid F34 positive-control references resolve to approved owner evidence, the approved master becomes exact `available` only after promotion, and an existing R0001 share/quote remains pinned when a later R0002 sees a newly approved visual.

Push 09 narrows the remaining lineage gap: stored project revisions and existing shares are pinned correctly, but quote intake does not yet prove that the quote payload actually came from the immutable revision it claims to reference.

## Verification evidence
- Full `npm test` Alpha 12 → current Alpha 26 regression chain: **PASS**.
- Latest-candidate integration: **PASS**.
- Explicit visual-safety rejection suite: **PASS**.
- Governed reference-backed promotion + project/revision/share/quote historical visual lineage positive control: **PASS**.
- Exact render resolver suite: **PASS**.
- `npm run check`: **PASS**.
- WF5 acceptance gate: **FAIL / EXPECTED HOLD**, 12 checks across the 2 returned lanes above.
- Composite `npm run test:gate`: **FAIL / EXPECTED HOLD** only at the acceptance gate after all preceding suites pass.
- JavaScript syntax sweep: **91 JS files / 0 failures**.
- JSON parse sweep: **22 JSON files / 0 failures** including QA evidence artifacts.
- HTML dependency sweep: **16 HTML files / 239 local references / 0 missing**.
- Diff against Push 08: application/runtime/product/visual files unchanged; only `package.json`, `tests/wf5-alpha26-acceptance-gate.js`, QA evidence aliases/new Push 09 evidence, and this report differ.
- Push 09 evidence logs are stored under `qa-evidence/wf5-push09/`.

## Next QA dependency
The release remains blocked by WF1 and WF4. WF4 remains the highest-risk next candidate because it controls customer-production visual admission and quote lineage/integrity.

1. **WF4 / quote-project lineage:** construct quotes from the persisted immutable project revision or reject mismatched payloads; changed commercial/render content must create explicit new revision lineage.
2. **WF4 / server-authoritative immutable handoff:** recompute/validate render readiness during project/quote persistence and make issued formal quotes immutable to customer upsert.
3. **WF4 / canonical provenance gate:** resolve every `provenance.referenceId` against governed evidence, enforce allowed rights/vehicle identity, and bind canonical-master promotion to the exact canonical brief/view.
4. **WF4 / quote fitment trust boundary:** recompute required fitment gates from immutable BOM/governed fitment data rather than trusting client-supplied `gates`.
5. **WF4 / direct production parity:** remove/deny direct production promotion or require the same immutable reviewer/version/checksum/audit evidence as governed version promotion.
6. **WF1:** revalidate `anyOfRequiredParts` after removal and persist unresolved OR-dependency gates through project → quote lineage whenever no valid alternative remains.

WF2 remains promotable at its data boundary. WF3 Candidate 02 remains valid review evidence only and must continue resolving customer `missing` until clean F34 reconstruction/isolation, overlay acceptance, production rights, identified review, exact reference/brief governance and final production promotion are all satisfied.

The next candidate should be rerun against this Push 09 gate unchanged.
