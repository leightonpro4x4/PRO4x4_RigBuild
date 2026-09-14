# PRO4X4 Rig Builder — WF5 QA / Integration Gate — Push 22

## Gate decision
**Alpha 26 remains HOLD / NOT PROMOTABLE.**

Push 22 is QA/integration-only. No product feature, catalogue record, customer UX, runtime production behaviour, render implementation, product data, or visual asset was changed. Implementation/data/visual hash comparison against Push 21 reports **0 added / 0 removed / 0 changed** files outside QA/tests/package/report metadata.

Promotion rule remains unchanged: **only a package that makes the complete WF5 acceptance gate green is promotable.**

## Package adjudication
- **WF1 Run 02 — RETURNED.** Four compatibility/BOM integrity blockers remain: incomplete `anyOfRequiredParts` persistence/quote gating/removal revalidation plus missing immutable gates for material manufacturer fitment conditions.
- **WF2 Ranger Support Push 07 — PASS / LOCK DATA BOUNDARY.** Latest-candidate verification confirms **39 catalogue records / 20 evidence records**, support expansion verified, dedupe/unknown-value conservatism retained.
- **WF3 Y62 F34 Push 32 — PASS AS REVIEW EVIDENCE ONLY / RETURN FOR CANONICAL MASTER.** Candidate 02 remains review-only / `master-draft`; exact customer resolver state remains **`missing`**. It is not customer production output.
- **WF4 Review Evidence Push 04 — RETURNED.** Push 22 adds a twenty-first shared-platform/governance blocker: formal finalisation trusts supplied project/revision identifiers without proving the referenced immutable revision exists.
- **WF5 Push 22 — PASS AS QA PACKAGE.** Targeted negative coverage added; all non-acceptance regression chains pass; release stays intentionally held by acceptance failures.

## New finding — `WF4-QUOTE-LINEAGE-EXISTENCE`
Formal quote issuance currently accepts **fabricated/stale revision identity as lineage evidence**.

WF5 created a genuine project `P4X4-PROJ-WF5-LINEAGE-EXISTS` with one immutable revision, `R0001`. A customer quote was then submitted while claiming the same real project ID but a non-existent revision `R9999`. The quote was accepted and the staff finalisation path issued formal quote `Q-WF5-LINEAGE-EXISTS` while still carrying the fabricated revision identity.

This proves that requiring `project.id` / `project.revisionId` fields alone is insufficient. The exact lineage tuple must be resolved against persistent immutable project-revision storage before formal issuance.

### Required behaviour
Before a quote can become formally issued, the server must:
- require a project ID and revision ID;
- resolve the project under the correct authority/ownership context;
- resolve the exact immutable revision from authoritative revision storage;
- reject stale, fabricated, foreign, missing, or otherwise unresolved revision IDs;
- canonicalise or verify BOM, gates, pricing inputs, render evidence and customer configuration against that exact revision; and
- persist the verified immutable project/revision identity into the issued quote evidence.

This is distinct from the two existing lineage blockers:
- `WF4-QUOTE-LINEAGE-REQUIRED` proves a formal quote can currently be issued with **no** project/revision lineage at all; and
- `WF4-QUOTE-PROJECT-REVISION-BINDING` proves a quote can claim a **real** revision while carrying different commercial/render content.

Push 22 closes the missing middle case: a quote can claim lineage that **does not exist** and still be formally issued.

## Acceptance gate state
`npm run test:wf5-acceptance` reports **25 failing checks across only 2 returned lanes (WF1 and WF4)**.

### WF1 root defects — 4
1. `WF1-BOM-ANYOF` — unsatisfied OR dependency is missing from immutable project/quote gates.
2. `WF1-QUOTE-ANYOF` — downstream quote review treats the orphaned OR dependency as approved.
3. `WF1-REMOVE-ANYOF` — removing the final valid support item can strand the dependent selection.
4. `WF1-CONDITIONAL-FITMENT-GATE` — material manufacturer fitment conditions are visible in UI/BOM metadata but are not persisted as unresolved project/quote gates.

### WF4 / shared-platform defects — 21
5. `WF4-DIRECT-PRODUCTION-REVIEW` — direct production upsert does not require immutable reviewer identity/timestamp.
6. `WF4-DIRECT-PRODUCTION-EVIDENCE` — reviewed direct upsert lacks checksum-pinned review/audit evidence equivalent to governed promotion.
7. `WF4-REVIEWER-IDENTITY-AUTHENTICITY` — promotion accepts forged/free-text reviewer identity without an authenticated review transition for that exact candidate.
8. `WF4-MASTER-REFERENCE-BACKING` — canonical master can become customer-available without locked reference IDs.
9. `WF4-QUOTE-GATE-TRUST-BOUNDARY` — quote intake trusts client-supplied fitment gates and can omit required review.
10. `WF4-MASTER-REFERENCE-ID-VALIDITY` — arbitrary/non-existent reference IDs can satisfy promotion admission.
11. `WF4-MASTER-BRIEF-REFERENCE-BINDING` — unrelated valid owner references can replace the exact canonical-view brief evidence.
12. `WF4-PRODUCTION-BINARY-IMMUTABILITY` — approved production binary can be replaced without a new reviewed version.
13. `WF4-PRODUCTION-IDENTITY-IMMUTABILITY` — approved product-layer binary can be retargeted to a different exact SKU without new review.
14. `WF4-CANDIDATE-EVIDENCE-RESET` — newly staged replacement binary inherits prior production review/reference bindings.
15. `WF4-BLOCKED-FITMENT-PRECEDENCE` — exact active fitment hold is outranked by stale production-ready output.
16. `WF4-RENDER-STATE-EXACTNESS` — a stateful layer can resolve `available` when required state dimensions are omitted.
17. `WF4-PRODUCTION-TUPLE-UNIQUENESS` — multiple approved assets can own one exact tuple and resolver silently chooses one.
18. `WF4-PROJECT-RENDER-TRUST-BOUNDARY` — unsupported client-supplied production-ready render metadata can persist into project/share/quote artifacts.
19. `WF4-QUOTE-PROJECT-REVISION-BINDING` — quote can claim immutable project/revision lineage while carrying different commercial/render content.
20. `WF4-QUOTE-LINEAGE-REQUIRED` — formal quote can be issued with no existing immutable project/revision binding.
21. `WF4-QUOTE-LINEAGE-EXISTENCE` — formal quote can be issued while claiming a project/revision tuple whose revision does not exist.
22. `WF4-QUOTE-FINALISATION-AUTHORITY` — customer quote intake can forge formal quote status/number/issuance evidence despite unresolved gates.
23. `WF4-QUOTE-REFINALISATION-IMMUTABILITY` — already-issued quote can be silently re-finalised under changed settings.
24. `WF4-FINALISED-QUOTE-IMMUTABILITY` — customer upsert can mutate an already-finalised quote in place.
25. `WF4-SHARE-REVISION-ISOLATION` — public R0001 share leaks later unshared revision data through the live project object.

Passing acceptance controls remain:
- `WF1-BOM-ANYOF-SATISFIED` — one valid alternative satisfies one-of semantics without requiring every alternative.
- `WF5-OWNER-REFERENCE-PACK-INTEGRITY` — all 9 owner files/checksums/rights and canonical brief references verify.
- `WF5-CUSTOMER-DRAFT-ISOLATION` — customer entrypoint stays isolated from draft/reference tooling with `fallbackPolicy: none`.

## Visual-governance / exact resolver evidence
`npm run test:wf5-visual-safety` — **PASS**.

The governed fixtures still prove:
- reference-only output is rejected;
- `master-draft` is customer `missing`;
- `layer-draft` is customer `missing`;
- a lone blocked-fitment record resolves `blocked`;
- unsupported exact SKU resolves `missing`;
- no visual fallback/substitution is used in the covered exact-state fixtures; and
- draft/candidate states expose no production binary URL.

`npm run test:render-resolver` — **PASS** for covered exact-state behaviour, checksum-pinned binary delivery and `fallbackPolicy: none`. The acceptance suite separately holds the known negative collision cases: blocked-fitment precedence, strict state admission, duplicate production-tuple ownership, binary/identity mutation, and provenance/review authority.

WF3 F34 Candidate 02 remains customer `missing`; Push 22 promotes no visual asset.

## Compatibility / BOM evidence
WF2 Push 07 remains clean at the verified data boundary:
- 39 Ranger catalogue records;
- 20 evidence records;
- support expansion verified;
- no duplicate IDs/SKUs under package tests;
- unknown install values remain unknown; and
- unproven fitment remains withheld.

WF1 remains returned because `anyOfRequiredParts` and material `fitment.conditions` are not yet an immutable, server-authoritative compatibility contract across selection removal, saved revision, quote intake and quote finalisation.

## Immutable project / revision / share / quote lineage evidence
`npm run test:wf5-promotion` — **PASS** positive control. It still proves draft customer isolation, reviewer-field gate, valid reference-backed F34 promotion, exact availability only after governed promotion, checksum/version review evidence, and historical R0001 project/share/quote render lineage remaining pinned when R0002 later sees a newly approved visual.

The negative acceptance suite keeps release blocked because server trust boundaries can still bypass or mutate that lineage. Push 22 adds explicit proof that even a supplied project/revision tuple is not authoritative until the exact revision is resolved from immutable storage.

## Full verification evidence
- Full `npm test` Alpha 12 → current Alpha 26 regression chain: **PASS**.
- Latest-candidate integration: **PASS** (`wf2Catalogue39=true`, `wf2Evidence20=true`, `wf2SupportExpansionVerified=true`, WF3 customer state `missing`).
- Explicit visual-safety rejection suite: **PASS**.
- Governed reference-backed promotion + historical immutable visual-lineage positive control: **PASS**.
- Exact render resolver suite: **PASS** for its covered fixtures.
- `npm run check`: **PASS**.
- JavaScript syntax sweep: **91 files / 0 failures**.
- JSON parse sweep: **26 files / 0 failures**.
- HTML dependency sweep: **16 HTML files / 239 local references / 0 missing**.
- WF5 acceptance gate: **FAIL / EXPECTED HOLD**, 25 checks across WF1/WF4.
- Composite `npm run test:gate`: **FAIL / EXPECTED HOLD** only after its preceding suites pass and it reaches acceptance blockers.
- Implementation/data/visual diff versus Push 21: **0 added / 0 removed / 0 changed**.

Push 22 evidence is stored under `qa-evidence/wf5-push22/`.

## Change isolation
Expected Push 22 changes are QA/package/reporting only:
- `tests/wf5-alpha26-acceptance-gate.js` — targeted `WF4-QUOTE-LINEAGE-EXISTENCE` negative test;
- `package.json` — QA package version/description only;
- `qa-evidence/WF5_INTEGRATION_MANIFEST.json` — blocker inventory/checkpoint only;
- `PUSH_52_WF5_QA_GATE_REPORT.md` — this report; and
- `qa-evidence/wf5-push22/*` — verification logs/evidence.

## Next QA dependency
**WF4 formal quote authority + immutable lineage remains the next QA dependency, now with exact revision existence as the first admission check.** Formal finalisation must resolve a real immutable project revision server-side, reject fabricated/stale lineage, canonicalise the quote against that exact revision, and then make the governed staff finalisation transition the sole authority that can mint terminal/idempotent formal issuance evidence. Any changed BOM, pricing, validity policy, labour rate, project revision or render lineage must create an explicit governed quote revision/new reference rather than rewriting the issued document.

WF1 remains the parallel compatibility dependency: persist and server-recompute `anyOfRequiredParts` plus material `fitment.conditions` as auditable gates and revalidate after removals. The remaining WF4 visual-governance dependencies remain hard release blockers behind the quote authority/lineage work: unique immutable production-tuple ownership, strict render-state admission, blocked-fitment precedence, authenticated review transitions, production binary/identity immutability, fresh candidate evidence, canonical provenance binding, revision-scoped shares and server-authoritative project/render handoff.
