# PRO4X4 Rig Builder — Alpha 26 WF5 QA / Integration Gate — Push 18

## Decision
**HOLD / NOT PROMOTABLE.**

Push 18 is QA/integration only. No product features, catalogue records, customer UX, runtime production behaviour or visual assets were changed. The candidate inputs remain WF1 Run 02, WF2 Ranger Support Push 07, WF3 Y62 F34 Push 32 and WF4 Review Evidence Push 04.

## Package adjudication
- **WF1 Run 02 — RETURNED.** Push 18 adds a fourth compatibility/BOM integrity blocker: confirmed manufacturer fitment conditions can disappear from immutable project/quote gating and permit formal quote finalisation without explicit setup confirmation.
- **WF2 Ranger Support Push 07 — PASS / LOCK DATA BOUNDARY.** 39 Ranger catalogue records and 20 source-evidence records remain deduplicated and conservative; unknown install values remain unknown and unsupported fitment remains withheld.
- **WF3 Y62 F34 Push 32 — PASS AS REVIEW EVIDENCE ONLY / RETURN FOR CANONICAL MASTER.** `Y62-F34-V1-CANDIDATE-02` remains `master-draft`, customer-hidden and exact resolver state `missing`.
- **WF4 Review Evidence Push 04 — RETURNED.** The 17 existing production-governance, provenance, resolver, project/share and quote-lineage blockers remain open.
- **WF5 Push 18 — PASS AS QA PACKAGE.** Targeted QA coverage was added without altering product/runtime implementation; the release gate remains intentionally red only at acceptance blockers.

## New finding — WF1-CONDITIONAL-FITMENT-GATE
The merged configurator correctly exposes manufacturer `fitment.conditions` to the customer before selection, but those conditions are not converted into immutable project/quote gates when the product is otherwise `confirmed` and `reviewRequired=false`.

WF5 used the current Ranger catalogue record `oa-ausb-sports-bar-ranger`. The product is confirmed, but its manufacturer conditions explicitly require the Next-Gen Ranger roller-shutter T-slot mounting route and state that tub-clamp mounting is not compatible for this Ranger fitment.

The test saved that real product through `merged-project-contract.buildSnapshot()` with complete pricing so fitment was the only gating concern. The snapshot retained the raw `fitment.conditions` metadata inside the BOM selection, but `snapshot.gates` contained no setup/fitment confirmation gate. After quote intake, `fitmentReview.allApproved` became `true`, and the formal quote could be finalised without any staff/customer confirmation that the required vehicle setup condition was satisfied.

This is a release blocker because the UI says the configurator does not assume the condition is already satisfied, while the persisted commercial workflow currently does exactly that.

### Required behaviour
Any selected product carrying material `fitment.conditions` must have those conditions represented in immutable project/quote compatibility state until explicitly resolved. Acceptable implementation patterns include:
- persist one or more explicit `fitment-condition` / `vehicle-setup-confirmation` gates derived from the selected product conditions;
- require a server-authoritative resolution record for each material condition before formal quote finalisation; and
- preserve the source condition text/identity in the immutable project revision and quote lineage so later staff approval is auditable.

A product may remain `confirmed` for its mapped vehicle while still requiring confirmation of a specific tub, bar, camera, light, towbar, flare or mounting configuration. `confirmed` must not silently mean every stated condition is already satisfied.

## Acceptance gate state
`npm run test:wf5-acceptance` reports **21 failing checks across 2 returned delivery lanes**.

### WF1 root defects — 4
1. `WF1-BOM-ANYOF` — unsatisfied OR dependency is missing from immutable project/quote gates.
2. `WF1-QUOTE-ANYOF` — downstream quote review treats the orphaned OR dependency as approved.
3. `WF1-REMOVE-ANYOF` — removing the final valid support item can strand the dependent selection.
4. `WF1-CONDITIONAL-FITMENT-GATE` — confirmed manufacturer fitment conditions are visible in the UI/BOM metadata but are not persisted as unresolved project/quote gates; a formal quote can be finalised without confirming the stated vehicle setup.

### WF4 / shared-platform defects — 17
5. `WF4-DIRECT-PRODUCTION-REVIEW` — direct production upsert does not require immutable reviewer identity/timestamp.
6. `WF4-DIRECT-PRODUCTION-EVIDENCE` — reviewed direct upsert lacks checksum-pinned review/audit evidence equivalent to governed promotion.
7. `WF4-REVIEWER-IDENTITY-AUTHENTICITY` — promotion accepts a forged/free-text reviewer identity without an authenticated review transition for that exact candidate.
8. `WF4-MASTER-REFERENCE-BACKING` — a canonical master can become customer-available with no reference IDs.
9. `WF4-QUOTE-GATE-TRUST-BOUNDARY` — quote intake trusts client-supplied fitment gates and can finalise a BOM whose required fitment review was omitted.
10. `WF4-MASTER-REFERENCE-ID-VALIDITY` — arbitrary/non-existent reference IDs can satisfy current promotion admission.
11. `WF4-MASTER-BRIEF-REFERENCE-BINDING` — valid but unrelated owner references can be substituted for the exact canonical-view brief evidence.
12. `WF4-PRODUCTION-BINARY-IMMUTABILITY` — an approved production binary can be replaced without a new reviewed version and become customer `available` under stale approval evidence.
13. `WF4-PRODUCTION-IDENTITY-IMMUTABILITY` — an approved product-layer binary can be retargeted to a different exact SKU without a new governed review.
14. `WF4-CANDIDATE-EVIDENCE-RESET` — a newly staged replacement binary inherits prior production review/reference bindings.
15. `WF4-BLOCKED-FITMENT-PRECEDENCE` — an exact active fitment block is outranked by an existing production-ready visual for the same tuple.
16. `WF4-RENDER-STATE-EXACTNESS` — a stateful layer can resolve `available` when the required state dimension is omitted, allowing arbitrary state substitution.
17. `WF4-PRODUCTION-TUPLE-UNIQUENESS` — multiple independently approved production assets can own the same exact tuple and the resolver silently chooses one by ranking/update time.
18. `WF4-PROJECT-RENDER-TRUST-BOUNDARY` — unsupported client-supplied production-ready render metadata can be persisted into project/share/quote artifacts.
19. `WF4-QUOTE-PROJECT-REVISION-BINDING` — a quote can claim immutable project/revision lineage while carrying commercial/render data that differs from that revision and still be finalised.
20. `WF4-FINALISED-QUOTE-IMMUTABILITY` — a customer upsert can mutate an already-finalised formal quote in place.
21. `WF4-SHARE-REVISION-ISOLATION` — a public share pinned to `R0001` exposes later unshared revision data through the returned live project object.

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

`npm run test:render-resolver` — **PASS** for its covered exact-state fixtures, checksum-pinned binary delivery and `fallbackPolicy: none`. The acceptance suite separately holds the known negative cases for blocked-fitment precedence, strict render-state admission and duplicate production-tuple ownership.

WF3 F34 Candidate 02 remains customer `missing`; Push 18 promotes no project visual asset.

## Compatibility / BOM integrity
WF2 Push 07 remains clean at the verified data boundary:
- 39 Ranger catalogue records;
- 20 source-evidence records;
- zero duplicate IDs/SKUs under package tests;
- unknown install values remain unknown;
- staff-review states remain preserved; and
- unproven fitment remains withheld.

WF1 remains returned because:
- unresolved `anyOfRequiredParts` dependencies can disappear from immutable project/quote gates;
- the final valid one-of support item can be removed while leaving the dependent item stranded; and
- material `fitment.conditions` can be displayed to the customer yet disappear from persisted gate/resolution state and permit formal quote finalisation without setup confirmation.

## Governed promotion and immutable lineage
`npm run test:wf5-promotion` — **PASS**.

The positive path still proves:
- staged drafts remain customer-hidden;
- missing reviewer fields block governed promotion;
- a valid reference-backed F34 fixture can promote;
- approved master becomes exact `available` only after governed promotion;
- checksum/version review evidence is persisted; and
- historical R0001 project/share/quote visual lineage remains pinned when R0002 later sees a newly approved visual.

The negative acceptance gate continues to reject promotion/release because the positive path does not yet protect every trust boundary listed above.

## Verification evidence
- Full `npm test` Alpha 12 → current Alpha 26 regression chain: **PASS**.
- Latest-candidate integration: **PASS** (`wf2Catalogue39=true`, `wf2Evidence20=true`, WF3 Candidate 02 customer state `missing`).
- Explicit visual-safety rejection suite: **PASS**.
- Governed reference-backed promotion + immutable historical project/revision/share/quote visual-lineage positive control: **PASS**.
- Exact render resolver suite: **PASS** for its covered exact-state fixtures.
- `npm run check`: **PASS**.
- JavaScript syntax sweep: **91 JS files / 0 failures**.
- JSON parse sweep: **25 JSON files / 0 failures**.
- HTML dependency sweep: **16 HTML files / 239 local references / 0 missing**.
- WF5 acceptance gate: **FAIL / EXPECTED HOLD**, 21 checks across the 2 returned lanes above.
- Composite `npm run test:gate`: **FAIL / EXPECTED HOLD** only when it reaches acceptance blockers after all preceding suites pass.

Push 18 evidence logs are stored under `qa-evidence/wf5-push18/`.

## Change isolation
Push 18 changes QA coverage/evidence plus QA package metadata/reporting only. No application/runtime/product/visual implementation file was changed.

Expected changed package files:
- `tests/wf5-alpha26-acceptance-gate.js` — added the targeted conditional-fitment persistence/finalisation check;
- `package.json` — QA package version/description only;
- `qa-evidence/WF5_INTEGRATION_MANIFEST.json` — blocker inventory/checkpoint only;
- `PUSH_48_WF5_QA_GATE_REPORT.md` — this report; and
- `qa-evidence/wf5-push18/*` — verification logs/evidence.

## Next QA dependency
**WF1 compatibility contract is now the most efficient next repair dependency:** update the immutable gate builder so both `anyOfRequiredParts` and material `fitment.conditions` survive into project/revision/quote state, then make selection removal revalidate the entire dependency/condition graph. The same server-authoritative gate set must be recomputed at quote intake/finalisation rather than trusted from the client.

WF4 remains the parallel safety dependency: enforce unique immutable production-tuple ownership, strict render-state admission, blocked-fitment precedence, authenticated review transitions, production binary/identity immutability, fresh candidate evidence, canonical provenance binding, revision-scoped shares, server-authoritative project/quote handoff and finalised-quote immutability.

**Promotion rule remains unchanged: only packages that make the complete WF5 acceptance gate green are promotable.**
