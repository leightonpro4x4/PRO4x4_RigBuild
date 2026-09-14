# PRO4X4 Rig Builder — Alpha 26 WF5 QA / Integration Gate — Push 06

## Scope
WF5-only QA hardening against the latest integrated Alpha 26 candidate set. No customer feature, catalogue record, fitment data, render asset, backend production behavior, or staff-product behavior was changed. This push adds acceptance coverage and strengthens the positive promotion fixture so it is explicitly reference-backed.

Candidate set under test remains:
- WF1 Run 02 — conditional fitment / vehicle-setup guidance.
- WF2 Push 07 — verified Next-Gen Ranger 39-record catalogue / 20 source-evidence rows.
- WF3 Push 32 — `Y62-F34-V1-CANDIDATE-02`, governed owner-reference transparent isolation preflight.
- WF4 Push 04 — reviewer evidence / canonical reference visibility.

## Promotion decision
**HOLD — not promotable.**

Historical Alpha regression, exact render-state behavior, no-fallback behavior, catalogue integrity, governed draft isolation, and immutable project/revision/share/quote visual lineage remain green. The acceptance gate is intentionally red on returned WF1 and WF4 defects. No acceptance criterion was weakened.

`REFERENCE_BACKED_APPROVED_VISUALS_ONLY` remains the governing rule. Push 06 found that the current version-promotion gate does not itself enforce the “reference-backed” half of that rule for a canonical master, so production promotion remains blocked at QA even when a synthetic candidate otherwise satisfies rights, camera, checksum, transparency and reviewer fields.

## Package adjudication

| Package | QA decision | Evidence / rationale |
|---|---|---|
| WF1 Run 02 | **PACKAGE PASS / LANE RETURNED** | Conditional fitment messaging remains green. OR-dependency removal/persistence defects are unchanged: unresolved `anyOfRequiredParts` can disappear from durable gates and downstream quote review. |
| WF2 Push 07 | **PASS / LOCK DATA** | 39 products / 20 source-evidence rows remain deduplicated and conservative. Unknowns remain unknown; no product gains approved customer visual state. |
| WF3 Push 32 | **PASS AS REVIEW ARTIFACT / RETURN FOR MASTER** | Candidate 02 remains `master-draft`, customer-hidden, rights/overlay incomplete, and exact resolver state `missing`. Its owner-reference provenance is present; no WF3 artifact is being promoted. |
| WF4 Push 04 | **PACKAGE PASS / LANE RETURNED** | Reviewer visibility remains useful, but platform production/quote controls now have four explicit acceptance failures: direct production reviewer parity, direct immutable evidence parity, missing canonical reference-backing enforcement, and customer-supplied quote-gate trust. |
| WF5 Push 06 | **PASS AS QA PACKAGE** | Added only tests/evidence; full regression and static verification are green; composite release gate remains red only on acceptance defects. |

## New QA coverage in Push 06

### 1. Canonical master reference-backing enforcement
New acceptance check `WF4-MASTER-REFERENCE-BACKING` stages a clean 1672×615 transparent Y62 F34 canonical-master candidate with:
- `master-approved` governance;
- reviewer identity and timestamp;
- owned usage rights;
- camera matched;
- stored checksum-pinned binary.

The negative fixture deliberately removes `provenance.referenceIds`.

Current result: **FAIL / RETURN WF4**.

Observed behavior: governed version promotion accepts the unbacked canonical master and the customer resolver returns it as exact `available`. This directly violates `REFERENCE_BACKED_APPROVED_VISUALS_ONLY` and the Y62-first canonical-master contract.

The positive promotion path was simultaneously hardened so its successful fixture now explicitly carries the locked F34 owner-reference IDs from `Y62-F34-V1`; each ID is verified against the owner reference pack with `owner-project-approved` rights. That positive control remains **PASS**.

Required remediation: canonical-master production promotion must require persisted reference-backing evidence. At minimum the Y62 master must retain the governing canonical brief/reference IDs; a missing/empty reference set must fail promotion and customer production resolution. The fix must not convert owner reference images themselves into customer render layers.

### 2. Server-authoritative quote fitment gates
New acceptance check `WF4-QUOTE-GATE-TRUST-BOUNDARY` starts from a real Ranger engineering-review product. The normal immutable snapshot correctly contains a `fitment-review` gate. The test then simulates a stale/buggy/tampered client payload that preserves the BOM selection but submits `gates: []`.

Current result: **FAIL / RETURN WF4**.

Observed behavior: server quote intake trusts the customer-supplied empty gate list, reports the fitment review as approved, and can finalise the formal quote even though the persisted BOM still contains an engineering-review product.

This is a shared-runtime trust-boundary defect rather than a catalogue defect. Fitment gates used for formal quote eligibility must be server-authoritative: recomputed/validated from the immutable BOM and governed catalogue/fitment contract, or the intake must reject snapshots whose persisted selections and gate set are inconsistent. A client must never be able to make required fitment review disappear by omitting a gate array.

## Acceptance gate state
`npm run test:wf5-acceptance` now reports **7 failing checks across 2 returned delivery lanes**.

WF1 root defect:
1. `WF1-BOM-ANYOF` — unsatisfied OR dependency is missing from immutable project/quote gates.
2. `WF1-QUOTE-ANYOF` — downstream quote review treats the orphaned OR dependency as approved.
3. `WF1-REMOVE-ANYOF` — removing the final valid support item can strand the dependent selection.

WF4 / shared-platform defects:
4. `WF4-DIRECT-PRODUCTION-REVIEW` — direct production upsert does not require immutable reviewer identity/timestamp.
5. `WF4-DIRECT-PRODUCTION-EVIDENCE` — reviewed direct upsert does not create checksum-pinned immutable review/audit evidence equivalent to version promotion.
6. `WF4-MASTER-REFERENCE-BACKING` — governed version promotion can make an unbacked canonical master customer-available.
7. `WF4-QUOTE-GATE-TRUST-BOUNDARY` — quote intake trusts client-supplied gates and can finalise a BOM whose required fitment review was omitted from the payload.

Passing controls:
- `WF1-BOM-ANYOF-SATISFIED` — one valid alternative satisfies one-of semantics without forcing every alternative.
- `WF5-CUSTOMER-DRAFT-ISOLATION` — customer entrypoint stays isolated from draft/reference tooling and retains `fallbackPolicy: none`.
- Reference-backed governed promotion positive control — locked F34 owner reference IDs persist through promotion and match the approved owner pack.

## Visual governance / exact resolver behavior
`npm run test:wf5-visual-safety` — **PASS**.

Still proven:
- reference-only output is rejected;
- `master-draft` is customer `missing`;
- `layer-draft` is customer `missing`;
- blocked fitment resolves `blocked`;
- unsupported exact SKU resolves `missing`;
- no fallback/substitution is used;
- draft/candidate states expose no production binary URL.

`npm run test:render-resolver` — **PASS** for exact `available / missing / blocked`, exact-SKU matching, checksum-pinned delivery and fallback policy `none`.

Important Push 06 distinction: draft-state rejection is still correct, but a candidate manually marked approved can currently be promoted without canonical reference IDs. The new acceptance test closes that QA coverage gap and keeps such output non-promotable until the platform gate is fixed.

## Governed promotion and immutable lineage
`npm run test:wf5-promotion` — **PASS** with a stricter reference-backed positive fixture.

The positive path now proves:
- staged draft does not change customer output;
- missing reviewer evidence rejects promotion;
- a reference-backed, reviewed `master-approved` immutable version promotes;
- the F34 reference IDs persist and resolve to approved owner-pack records;
- only after promotion does resolver state become exact `available`;
- reviewer/version/checksum evidence remains immutable;
- R0001 share and quote stay pinned to their historical `missing` visual state after R0002 records a later approved visual.

## Verification evidence
- Full `npm test` Alpha 12 → current Alpha 26 regression chain: **PASS**.
- Latest-candidate integration: **PASS**.
- Explicit visual-safety rejection test: **PASS**.
- Governed reference-backed promotion + immutable project/revision/share/quote lineage: **PASS**.
- Exact render resolver suite: **PASS**.
- `npm run check`: **PASS**.
- WF5 acceptance gate: **FAIL / EXPECTED HOLD**, 7 checks across the 2 returned lanes above.
- Composite `npm run test:gate`: **FAIL / EXPECTED HOLD** only at the acceptance gate after preceding suites pass.
- JavaScript syntax sweep: **91 application JS files / 0 failures**.
- JSON parse sweep: **9 application JSON files / 0 failures**; **20 JSON files / 0 failures including QA evidence artifacts**.
- HTML dependency sweep: **16 HTML files / 239 local references / 0 missing**.
- Push 06 evidence logs are stored under `qa-evidence/wf5-push06/`.

## Next QA dependency
The release remains blocked by WF1 and WF4, with WF4 now the highest-risk next candidate because it controls both production visuals and formal quote eligibility.

1. **WF4 / shared platform:** make formal quote fitment gates server-authoritative. A BOM requiring review must remain unresolved even if the client omits/tampers with `gates`.
2. **WF4 / visual production control:** require reference-backing evidence for canonical-master promotion, while continuing to keep raw owner/reference images out of customer production.
3. **WF4 / direct production parity:** either remove/deny direct production promotion in favor of immutable version promotion, or enforce reviewer identity/timestamp plus equivalent checksum-pinned review/audit evidence.
4. **WF1:** revalidate `anyOfRequiredParts` after removal and persist unresolved OR-dependency gates through project → quote lineage whenever no valid alternative remains.

WF2 remains promotable at the data boundary. WF3 Candidate 02 remains valid review evidence only and must continue resolving customer `missing` until clean reconstruction/isolation, overlay acceptance, production rights, identified review, reference-backed governance and final promotion are all satisfied.

The next candidate should be rerun against this Push 06 gate without weakening any rule.
