# PRO4X4 Rig Builder — Alpha 26 WF5 QA / Integration Gate — Push 07

## Scope
WF5-only QA hardening against the latest integrated Alpha 26 candidate set. No customer feature, catalogue record, fitment data, render asset, visual candidate, or backend production behavior was changed. Push 07 adds provenance-integrity tests around the owner-supplied 2025 Series 5 Y62 Warrior reference pack and the canonical-view briefs.

Candidate set under test remains:
- WF1 Run 02 — conditional fitment / vehicle-setup guidance.
- WF2 Push 07 — verified Next-Gen Ranger 39-record catalogue / 20 source-evidence rows.
- WF3 Push 32 — `Y62-F34-V1-CANDIDATE-02`, governed owner-reference transparent isolation preflight.
- WF4 Push 04 — reviewer evidence / canonical reference visibility.

## Promotion decision
**HOLD — not promotable.**

Historical regression, exact available/missing/blocked behavior, no-fallback behavior, latest Ranger catalogue integrity, draft visual isolation, and immutable project/revision/share/quote visual lineage remain green. The acceptance gate is intentionally red only on returned WF1 and WF4 defects.

`REFERENCE_BACKED_APPROVED_VISUALS_ONLY` remains the governing production rule. Push 07 proves that the packaged owner evidence itself is intact, but also proves that the current production-promotion gate does not validate the identity or canonical-brief relevance of persisted `provenance.referenceIds`. A non-empty array is therefore not a sufficient production control.

## Package adjudication

| Package | QA decision | Evidence / rationale |
|---|---|---|
| WF1 Run 02 | **PACKAGE PASS / LANE RETURNED** | Conditional-fitment messaging remains green. The three OR-dependency acceptance defects remain open: durable gate loss, quote-review propagation, and removal revalidation. |
| WF2 Push 07 | **PASS / LOCK DATA** | 39 Ranger products / 20 source-evidence records remain deduplicated, source-backed and conservative. Unknowns remain unknown; WF2 adds no approved customer visuals. |
| WF3 Push 32 | **PASS AS REVIEW ARTIFACT / RETURN FOR MASTER** | Candidate 02 remains `master-draft`, customer-hidden, rights/overlay incomplete and exact customer state `missing`. |
| WF4 Push 04 | **PACKAGE PASS / LANE RETURNED** | Staff evidence visibility remains useful, but shared production/quote controls now have six explicit acceptance failures including two new reference-integrity failures. |
| WF5 Push 07 | **PASS AS QA PACKAGE** | Added tests/evidence only. Full regression/static verification are green; composite release gate remains red only on acceptance blockers. |

## New QA coverage in Push 07

### 1. Owner Y62 reference-pack file integrity — PASS
New positive control `WF5-OWNER-REFERENCE-PACK-INTEGRITY` verifies the primary authenticity pack before using it as promotion evidence.

Result: **PASS**.

Proven facts:
- all 9 owner-reference records resolve to packaged source files;
- every packaged file SHA-256 exactly matches its persisted reference-pack checksum;
- every reference retains `owner-project-approved` rights metadata;
- every `front34`, `side`, and `rear34` canonical-brief reference ID resolves to a real approved owner-reference record;
- canonical briefs and reference pack are bound to `nissan-y62-warrior-2025`.

This establishes that the evidence source is not the current problem. The remaining defects are production-gate validation defects.

### 2. Persisted reference-ID validity — FAIL / RETURN WF4
New acceptance check `WF4-MASTER-REFERENCE-ID-VALIDITY` stages a technically valid reviewed F34 master candidate, but deliberately sets:

`provenance.referenceIds = ['OWNER-Y62-NOT-A-REAL-REFERENCE']`

Current result: **FAIL**.

Observed behavior: governed version promotion accepts the candidate and the customer resolver returns the master as exact `available`. The promotion gate therefore treats arbitrary non-empty reference metadata as sufficient and does not resolve the persisted IDs against governed evidence.

Required remediation: before canonical-master promotion, every persisted reference ID must resolve to an approved reference record for the correct vehicle and must carry allowed rights. Unknown IDs, removed evidence, reference-only external records without separately-cleared rights, or cross-vehicle evidence must block promotion.

### 3. Canonical brief/reference binding — FAIL / RETURN WF4
New acceptance check `WF4-MASTER-BRIEF-REFERENCE-BINDING` stages an F34 canonical master that is backed only by two real, rights-approved owner references — but they are the rear34/rear records rather than the governing `Y62-F34-V1` references.

Current result: **FAIL**.

Observed behavior: the runtime accepts the reviewed candidate and resolves it customer `available` even though it omits all three governing F34 evidence IDs:
- `OWNER-Y62-F34-01`
- `OWNER-Y62-F34-02`
- `OWNER-Y62-FRONT-01`

Required remediation: canonical-master promotion must bind the candidate to the canonical brief for its exact `vehicleId + viewId`. The production record must retain the required governing brief reference IDs; extra references may be additive only when they also resolve to governed evidence with appropriate rights. A valid owner photo from an unrelated camera view cannot satisfy an F34 authenticity gate by itself.

## Acceptance gate state
`npm run test:wf5-acceptance` now reports **9 failing checks across 2 returned delivery lanes**.

WF1 root defects:
1. `WF1-BOM-ANYOF` — unsatisfied OR dependency is missing from immutable project/quote gates.
2. `WF1-QUOTE-ANYOF` — downstream quote review treats the orphaned OR dependency as approved.
3. `WF1-REMOVE-ANYOF` — removing the final valid support item can strand the dependent selection.

WF4 / shared-platform defects:
4. `WF4-DIRECT-PRODUCTION-REVIEW` — direct production upsert does not require immutable reviewer identity/timestamp.
5. `WF4-DIRECT-PRODUCTION-EVIDENCE` — reviewed direct upsert does not create checksum-pinned immutable review/audit evidence equivalent to version promotion.
6. `WF4-MASTER-REFERENCE-BACKING` — governed version promotion can make a canonical master customer-available with no reference IDs.
7. `WF4-QUOTE-GATE-TRUST-BOUNDARY` — quote intake trusts client-supplied gates and can finalise a BOM whose required fitment review was omitted.
8. `WF4-MASTER-REFERENCE-ID-VALIDITY` — arbitrary/non-existent persisted reference IDs can satisfy the current promotion path.
9. `WF4-MASTER-BRIEF-REFERENCE-BINDING` — valid but unrelated owner references can be substituted for the exact canonical-view brief evidence.

Passing acceptance controls:
- `WF1-BOM-ANYOF-SATISFIED` — one valid alternative satisfies one-of semantics without forcing every alternative.
- `WF5-OWNER-REFERENCE-PACK-INTEGRITY` — all 9 owner files/checksums/rights and canonical brief references verify.
- `WF5-CUSTOMER-DRAFT-ISOLATION` — customer entrypoint remains isolated from draft/reference tooling with `fallbackPolicy: none`.

## Visual-governance / exact resolver behavior
`npm run test:wf5-visual-safety` — **PASS**.

Still proven:
- reference-only output is rejected;
- `master-draft` is customer `missing`;
- `layer-draft` is customer `missing`;
- blocked fitment resolves `blocked`;
- unsupported exact SKU resolves `missing`;
- no visual fallback/substitution is used;
- draft/candidate states expose no production binary URL.

`npm run test:render-resolver` — **PASS** for exact `available / missing / blocked`, exact-SKU behavior, checksum-pinned delivery and fallback policy `none`.

Important distinction: the current live F34 seed/candidate state is still customer `missing`; no unsupported WF3 artifact was promoted in this package. The new negative fixtures prove a platform bypass would be possible if metadata were deliberately presented as approved, which is why the checkpoint remains held.

## Governed promotion and immutable lineage
`npm run test:wf5-promotion` — **PASS**.

The positive control continues to prove:
- staged draft does not change customer output;
- missing reviewer evidence rejects promotion;
- the valid F34 fixture uses the exact locked `Y62-F34-V1` owner-reference IDs;
- all retained positive-control reference IDs resolve to `owner-project-approved` evidence;
- a properly reviewed/versioned/checksum-pinned master becomes exact `available` only after promotion;
- R0001 share and quote remain pinned to historical `missing` visual state after R0002 records a later approved visual.

## Verification evidence
- Full `npm test` Alpha 12 → current Alpha 26 regression chain: **PASS**.
- Latest-candidate integration: **PASS**.
- Explicit visual-safety rejection suite: **PASS**.
- Governed reference-backed promotion + immutable project/revision/share/quote lineage: **PASS**.
- Exact render resolver suite: **PASS**.
- `npm run check`: **PASS**.
- WF5 acceptance gate: **FAIL / EXPECTED HOLD**, 9 checks across the 2 returned lanes above.
- Composite `npm run test:gate`: **FAIL / EXPECTED HOLD** only at the acceptance gate after preceding suites pass.
- JavaScript syntax sweep: **91 application JS files / 0 failures**.
- JSON parse sweep: **9 application JSON files / 0 failures**; **22 JSON files / 0 failures including QA evidence artifacts**.
- HTML dependency sweep: **16 HTML files / 239 local references / 0 missing**.
- Push 07 evidence logs are stored under `qa-evidence/wf5-push07/`.

## Next QA dependency
The release remains blocked by WF1 and WF4. WF4 remains the highest-risk next candidate because it controls formal quote eligibility and customer-production visual admission.

1. **WF4 / canonical provenance gate:** resolve every `provenance.referenceId` against governed reference evidence, enforce appropriate rights/vehicle identity, and bind canonical-master promotion to the exact canonical brief/view. For F34, the production record must retain the governing `Y62-F34-V1` evidence set; arbitrary, unknown, cross-view-only, or uncleared external references must not satisfy promotion.
2. **WF4 / quote trust boundary:** make formal-quote fitment gates server-authoritative from the immutable BOM/governed fitment contract.
3. **WF4 / direct production parity:** remove/deny direct production promotion or require the same immutable reviewer/version/checksum/audit evidence as governed version promotion.
4. **WF1:** revalidate `anyOfRequiredParts` after removal and persist unresolved OR-dependency gates through project → quote lineage whenever no valid alternative remains.

WF2 remains promotable at its data boundary. WF3 Candidate 02 remains valid review evidence only and must continue resolving customer `missing` until clean F34 reconstruction/isolation, overlay acceptance, production rights, identified review, exact reference/brief governance and final production promotion are all satisfied.

The next candidate should be rerun against this Push 07 gate unchanged.
