# PRO4X4 Rig Builder — Alpha 26 WF5 QA / Integration Gate — Push 05

## Scope
WF5-only QA hardening against the latest integrated Alpha 26 candidate set. No customer, catalogue, render-production, staff-product, backend feature, or visual asset behavior was changed. This push adds acceptance tests and verification evidence only.

Candidate set under test remains:
- WF1 Run 02 — conditional fitment / vehicle-setup guidance.
- WF2 Push 07 — verified Next-Gen Ranger 39-record catalogue / 20 source-evidence rows.
- WF3 Push 32 — `Y62-F34-V1-CANDIDATE-02`, governed owner-reference transparent isolation preflight.
- WF4 Push 04 — reviewer evidence / canonical reference visibility.

## Promotion decision
**HOLD — not promotable.**

The historical Alpha regression chain remains green. Exact render `available / missing / blocked`, no-fallback behavior, immutable project/revision/share/quote visual lineage, WF2 catalogue integrity, WF3 draft isolation, and the governed version-promotion path remain green. The release gate is intentionally red on returned WF1 and WF4 defects. No acceptance rule was weakened.

`REFERENCE_BACKED_APPROVED_VISUALS_ONLY` remains enforced. Reference-only, `master-draft`, `layer-draft`, blocked-fitment, unsupported exact-SKU, or fallback output is not accepted for customer production.

## Package adjudication

| Package | QA decision | Evidence / rationale |
|---|---|---|
| WF1 Run 02 | **PACKAGE PASS / LANE RETURNED** | Conditional fitment messaging itself remains green. OR dependency persistence/removal is still broken. Push 05 now proves the defect propagates into the persisted quote review: an orphaned any-of dependency can produce `fitmentReview.allApproved=true` because no durable gate exists. |
| WF2 Push 07 | **PASS / LOCK DATA** | 39 products, 20 source-evidence rows, deduplicated IDs/SKUs, conservative unknowns, exact-fitment exclusions preserved, and no catalogue item gains approved customer visual state. |
| WF3 Push 32 | **PASS AS REVIEW ARTIFACT / RETURN FOR MASTER** | Candidate 02 remains checksum/dimension/transparency verified but `master-draft`, rights-incomplete, customer-hidden, and exact resolver state `missing`. |
| WF4 Push 04 | **PACKAGE PASS / LANE RETURNED** | Staff evidence visibility and governed version promotion are green. The direct production upsert remains an alternate path that can bypass reviewer requirements; Push 05 additionally proves that even a direct upsert carrying reviewer fields does not create the checksum-pinned immutable `approval.reviewEvidence` and audit evidence produced by version promotion. |
| WF5 Push 05 | **PASS AS QA PACKAGE** | Added targeted release tests only; regression and static verification are green; composite release gate remains red only on acceptance defects. |

## New QA coverage in Push 05

### 1. Downstream quote integrity for OR dependencies
New acceptance check `WF1-QUOTE-ANYOF` verifies that an orphaned `fitment.anyOfRequiredParts` requirement must survive into the persisted sales/quote fitment review as unresolved.

Current result: **FAIL / RETURN WF1**.

Observed behavior:
- the product snapshot still carries `anyOfRequiredParts` metadata;
- no immutable dependency gate is generated;
- quote recomputation therefore reports `fitmentReview.allApproved=true` for the fitment requirement even though neither verified support alternative is selected.

This confirms the issue is not only configurator presentation. It crosses the immutable handoff into staff quote inspection.

### 2. Positive control for correct one-of semantics
New acceptance check `WF1-BOM-ANYOF-SATISFIED` is **PASS** and protects the remediation from an overly broad fix. Selecting one valid support item must satisfy the one-of requirement without forcing the other alternative.

### 3. Immutable evidence parity for direct production writes
New acceptance check `WF4-DIRECT-PRODUCTION-EVIDENCE` verifies that if the direct production upsert route remains supported, it must either:
- reject direct production and require governed version promotion; **or**
- create immutable review evidence equivalent to promotion, including reviewer, review timestamp, checksum-pinned evidence, and production audit evidence.

Current result: **FAIL / RETURN WF4**.

Observed behavior: a direct upsert carrying `master-approved`, reviewer identity/timestamp, owned rights, camera match, and production approval can succeed, but the resulting asset has no checksum-pinned `approval.reviewEvidence`. This is weaker than the governed version-promotion path and therefore not acceptable for production parity.

## Acceptance gate state
`npm run test:wf5-acceptance` currently reports **5 failing checks / 2 returned delivery lanes**:

WF1 root defect:
1. `WF1-BOM-ANYOF` — unsatisfied OR dependency is missing from immutable project/quote gates.
2. `WF1-QUOTE-ANYOF` — downstream quote fitment review incorrectly treats the orphaned OR dependency as approved.
3. `WF1-REMOVE-ANYOF` — removing the last valid support item can strand the dependent selection.

WF4 root defect:
4. `WF4-DIRECT-PRODUCTION-REVIEW` — direct production upsert does not require immutable reviewer identity/timestamp.
5. `WF4-DIRECT-PRODUCTION-EVIDENCE` — reviewed direct upsert does not create checksum-pinned immutable review/audit evidence equivalent to version promotion.

Passing controls:
- `WF1-BOM-ANYOF-SATISFIED` — one valid alternative satisfies one-of semantics without forcing the other.
- `WF5-CUSTOMER-DRAFT-ISOLATION` — customer entrypoint remains isolated from draft/reference production tooling and keeps fallback policy `none`.

## Visual governance / resolver evidence
`npm run test:wf5-visual-safety` — **PASS**.

Explicitly proven:
- reference-only is never customer production eligible;
- `master-draft` remains customer `missing`;
- `layer-draft` remains customer `missing`;
- blocked fitment remains `blocked`;
- unsupported exact SKU remains `missing`;
- no substitute/fallback asset is used;
- draft/candidate states expose no production binary URL.

`npm run test:render-resolver` — **PASS** for exact `available / missing / blocked`, exact-SKU matching, checksum-pinned delivery and no fallback.

## Governed promotion and immutable lineage
`npm run test:wf5-promotion` — **PASS**.

The canonical positive path still proves:
- staged draft does not change customer output;
- missing reviewer evidence rejects promotion;
- reviewed `master-approved` immutable version promotes;
- only then does resolver state become exact `available`;
- reviewer/version/checksum evidence is immutable;
- R0001 share and quote remain pinned to the historical `missing` visual state after R0002 records a later approved visual.

## Verification evidence
- Full `npm test` Alpha 12 → current Alpha 26 regression chain: **PASS**.
- Latest-candidate integration: **PASS**.
- Explicit visual-safety rejection test: **PASS**.
- Governed promotion + project/revision/share/quote lineage: **PASS**.
- Exact render resolver suite: **PASS**.
- `npm run check`: **PASS**.
- WF5 acceptance gate: **FAIL / EXPECTED HOLD**, 5 checks across the 2 returned lanes above.
- Composite `npm run test:gate`: **FAIL / EXPECTED HOLD** only when it reaches the acceptance gate after preceding suites pass.
- JavaScript syntax sweep: **91 files / 0 failures**.
- JSON parse sweep: **18 files / 0 failures**.
- HTML dependency sweep: **16 HTML files / 239 local references / 0 missing**.
- Push 05 evidence logs are stored under `qa-evidence/wf5-push05/`.

## Next QA dependency
Priority remains the two returned delivery lanes:

1. **WF1:** implement one-of dependency revalidation after removal and persist an unresolved immutable project/quote gate whenever none of the verified alternatives is selected. The quote fitment review must then remain unresolved. A valid single alternative must continue to satisfy the requirement without auto-forcing every alternative.
2. **WF4:** close the direct-production parity gap. Either remove/deny direct production promotion in favor of immutable version promotion, or make the direct path enforce reviewer identity/timestamp and emit the same checksum-pinned immutable review evidence plus audit evidence.

WF3 may continue producing the clean owner-reference-backed F34 master in parallel, but QA must continue to resolve Candidate 02 as customer `missing` until rights, overlay acceptance, identified review, and governed promotion are complete.

The next candidate should be tested against this Push 05 gate unchanged. Promotion is allowed only when all returned acceptance checks turn green while visual rejection, no fallback, exact state behavior, catalogue integrity and immutable lineage remain green.
