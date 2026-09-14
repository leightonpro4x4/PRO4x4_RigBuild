# PRO4X4 Rig Builder — Alpha 26 WF5 QA / Integration Gate — Push 19

## Decision
**HOLD / NOT PROMOTABLE.**

Push 19 is QA/integration only. No product features, catalogue records, customer UX, runtime production behaviour or visual assets were changed. Candidate inputs remain WF1 Run 02, WF2 Ranger Support Push 07, WF3 Y62 F34 Push 32 and WF4 Review Evidence Push 04.

## Package adjudication
- **WF1 Run 02 — RETURNED.** Four compatibility/BOM integrity blockers remain open: OR-dependency persistence, quote review of orphaned dependencies, removal revalidation, and immutable gating for material fitment conditions.
- **WF2 Ranger Support Push 07 — PASS / LOCK DATA BOUNDARY.** 39 Ranger catalogue records and 20 source-evidence records remain deduplicated and conservative; unknown install values remain unknown and unsupported fitment remains withheld.
- **WF3 Y62 F34 Push 32 — PASS AS REVIEW EVIDENCE ONLY / RETURN FOR CANONICAL MASTER.** `Y62-F34-V1-CANDIDATE-02` remains `master-draft`, customer-hidden and exact resolver state `missing`.
- **WF4 Review Evidence Push 04 — RETURNED.** Push 19 adds an eighteenth shared-platform/governance blocker: an already issued formal quote can be silently re-finalised in place under new issuance settings.
- **WF5 Push 19 — PASS AS QA PACKAGE.** Targeted acceptance coverage was added without changing product/runtime implementation; release remains intentionally blocked by acceptance failures only.

## New finding — WF4-QUOTE-REFINALISATION-IMMUTABILITY
The formal quote finalisation path is not idempotent and does not reject a second finalisation of an already issued quote.

WF5 created a clean quote, configured the staff quote settings to a labour rate of 165 and 14-day validity, and finalised it. The resulting formal quote recorded its quote number, `issuedAt`, `validUntil`, customer total and `labourRateUsed=165`.

WF5 then changed staff settings to labour rate 199 and 30-day validity and called the same formal finalisation path again for the same already-finalised quote reference. The system accepted the operation and rewrote the issuance evidence in place: `issuedAt` changed, `validUntil` moved to the new 30-day window and `labourRateUsed` changed from 165 to 199 while retaining the same formal quote number/reference.

This is separate from the existing `WF4-FINALISED-QUOTE-IMMUTABILITY` defect. That earlier test proves a customer payload can mutate a finalised quote through quote upsert; Push 19 proves the privileged finalisation path itself can reissue the same quote identity and silently alter formal issuance evidence.

### Required behaviour
An already-finalised quote must be either:
- **strictly immutable:** a subsequent finalisation request is rejected with an explicit immutable/already-finalised conflict; or
- **strictly idempotent:** the same final quote is returned unchanged, including quote number, `issuedAt`, `validUntil`, `customerTotal`, `labourRateUsed`, project/revision lineage, BOM, gates and render lineage.

Any later commercial change, changed validity policy, changed labour rate or revised build must create an explicit governed quote revision/new reference rather than rewriting the issued formal quote in place.

## Acceptance gate state
`npm run test:wf5-acceptance` reports **22 failing checks across 2 returned delivery lanes**.

### WF1 root defects — 4
1. `WF1-BOM-ANYOF` — unsatisfied OR dependency is missing from immutable project/quote gates.
2. `WF1-QUOTE-ANYOF` — downstream quote review treats the orphaned OR dependency as approved.
3. `WF1-REMOVE-ANYOF` — removing the final valid support item can strand the dependent selection.
4. `WF1-CONDITIONAL-FITMENT-GATE` — material manufacturer fitment conditions are visible in UI/BOM metadata but are not persisted as unresolved project/quote gates.

### WF4 / shared-platform defects — 18
5. `WF4-DIRECT-PRODUCTION-REVIEW` — direct production upsert does not require immutable reviewer identity/timestamp.
6. `WF4-DIRECT-PRODUCTION-EVIDENCE` — reviewed direct upsert lacks checksum-pinned review/audit evidence equivalent to governed promotion.
7. `WF4-REVIEWER-IDENTITY-AUTHENTICITY` — promotion accepts a forged/free-text reviewer identity without an authenticated review transition for that exact candidate.
8. `WF4-MASTER-REFERENCE-BACKING` — a canonical master can become customer-available with no reference IDs.
9. `WF4-QUOTE-GATE-TRUST-BOUNDARY` — quote intake trusts client-supplied fitment gates and can finalise a BOM whose required fitment review was omitted.
10. `WF4-MASTER-REFERENCE-ID-VALIDITY` — arbitrary/non-existent reference IDs can satisfy current promotion admission.
11. `WF4-MASTER-BRIEF-REFERENCE-BINDING` — valid but unrelated owner references can be substituted for exact canonical-view brief evidence.
12. `WF4-PRODUCTION-BINARY-IMMUTABILITY` — an approved production binary can be replaced without a new reviewed version and become customer `available` under stale approval evidence.
13. `WF4-PRODUCTION-IDENTITY-IMMUTABILITY` — an approved product-layer binary can be retargeted to another exact SKU without a new governed review.
14. `WF4-CANDIDATE-EVIDENCE-RESET` — a newly staged replacement binary inherits prior production review/reference bindings.
15. `WF4-BLOCKED-FITMENT-PRECEDENCE` — an exact active fitment block is outranked by an existing production-ready visual for the same tuple.
16. `WF4-RENDER-STATE-EXACTNESS` — a stateful layer can resolve `available` when the required state dimension is omitted.
17. `WF4-PRODUCTION-TUPLE-UNIQUENESS` — multiple independently approved production assets can own the same exact tuple and the resolver silently chooses one.
18. `WF4-PROJECT-RENDER-TRUST-BOUNDARY` — unsupported client-supplied production-ready render metadata can be persisted into project/share/quote artifacts.
19. `WF4-QUOTE-PROJECT-REVISION-BINDING` — a quote can claim immutable project/revision lineage while carrying different commercial/render content and still be finalised.
20. `WF4-QUOTE-REFINALISATION-IMMUTABILITY` — an issued formal quote can be re-finalised under changed settings, rewriting issuance timestamps, validity and labour-rate evidence in place.
21. `WF4-FINALISED-QUOTE-IMMUTABILITY` — a customer upsert can mutate an already-finalised formal quote in place.
22. `WF4-SHARE-REVISION-ISOLATION` — a public share pinned to `R0001` exposes later unshared revision data through the returned live project object.

Passing acceptance controls remain:
- `WF1-BOM-ANYOF-SATISFIED` — one valid alternative satisfies one-of semantics without forcing every alternative.
- `WF5-OWNER-REFERENCE-PACK-INTEGRITY` — all 9 owner files/checksums/rights and canonical brief references verify.
- `WF5-CUSTOMER-DRAFT-ISOLATION` — customer entrypoint remains isolated from draft/reference tooling with `fallbackPolicy: none`.

## Visual governance / exact resolver behaviour
`npm run test:wf5-visual-safety` — **PASS** for the governed fixtures.

Still proven:
- reference-only output is rejected;
- `master-draft` is customer `missing`;
- `layer-draft` is customer `missing`;
- a lone blocked-fitment record resolves `blocked`;
- unsupported exact SKU resolves `missing`;
- no visual fallback/substitution is used in the covered exact-state fixtures; and
- draft/candidate states expose no production binary URL.

`npm run test:render-resolver` — **PASS** for its covered exact-state fixtures, checksum-pinned binary delivery and `fallbackPolicy: none`. The acceptance suite separately holds the known negative cases for blocked-fitment precedence, strict render-state admission and duplicate production-tuple ownership.

WF3 F34 Candidate 02 remains customer `missing`; Push 19 promotes no project visual asset.

## Compatibility / BOM integrity
WF2 Push 07 remains clean at the verified data boundary:
- 39 Ranger catalogue records;
- 20 source-evidence records;
- zero duplicate IDs/SKUs under package tests;
- unknown install values remain unknown;
- staff-review states remain preserved; and
- unproven fitment remains withheld.

WF1 remains returned because unresolved `anyOfRequiredParts` dependencies and material `fitment.conditions` do not yet survive as a complete immutable/server-authoritative compatibility contract through selection removal, project revision, quote intake and quote finalisation.

## Governed promotion and immutable lineage
`npm run test:wf5-promotion` — **PASS**.

The positive path still proves staged drafts remain customer-hidden; missing reviewer fields block governed promotion; a valid reference-backed F34 fixture can promote; approved master becomes exact `available` only after governed promotion; checksum/version review evidence is persisted; and historical R0001 project/share/quote visual lineage remains pinned when R0002 later sees a newly approved visual.

The negative acceptance gate continues to reject release because those positive controls do not yet protect every trust boundary listed above.

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
- WF5 acceptance gate: **FAIL / EXPECTED HOLD**, 22 checks across the 2 returned lanes above.
- Composite `npm run test:gate`: **FAIL / EXPECTED HOLD** only when it reaches acceptance blockers after all preceding suites pass.

Push 19 evidence logs are stored under `qa-evidence/wf5-push19/`.

## Change isolation
Push 19 changes QA coverage/evidence plus QA package metadata/reporting only. No application/runtime/product/visual implementation file was changed.

Expected changed package files:
- `tests/wf5-alpha26-acceptance-gate.js` — added the targeted quote re-finalisation immutability check;
- `package.json` — QA package version/description only;
- `qa-evidence/WF5_INTEGRATION_MANIFEST.json` — blocker inventory/checkpoint only;
- `PUSH_49_WF5_QA_GATE_REPORT.md` — this report; and
- `qa-evidence/wf5-push19/*` — verification logs/evidence.

## Next QA dependency
**WF4 formal quote lifecycle is the next QA dependency:** make finalisation terminal/idempotent and make finalised quote payloads immutable to all update paths. A changed BOM, pricing policy, labour rate, validity window, project revision or render lineage must result in an explicit governed quote revision/new reference rather than mutation of the issued quote identity.

WF1 remains the parallel compatibility dependency: persist `anyOfRequiredParts` and material `fitment.conditions` as immutable auditable gates, revalidate them after removals, and recompute the compatibility/gate graph server-side at quote intake/finalisation. The remaining WF4 visual-governance dependencies stay hard blockers: unique immutable production-tuple ownership, strict render-state admission, blocked-fitment precedence, authenticated review transitions, production binary/identity immutability, fresh candidate evidence, canonical provenance binding, revision-scoped shares and server-authoritative project/quote handoff.

**Promotion rule remains unchanged: only packages that make the complete WF5 acceptance gate green are promotable.**
