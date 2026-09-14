# PRO4X4 Rig Builder — Alpha 26 WF5 QA / Integration Gate — Push 08

## Scope
WF5-only QA hardening against the latest integrated Alpha 26 candidate set. No customer feature, catalogue record, fitment data, render asset, visual candidate, or backend production behavior was changed. Push 08 advances one QA package: **immutable handoff / trust-boundary verification** across project revision → customer share → formal quote.

Candidate set under test remains:
- WF1 Run 02 — conditional fitment / vehicle-setup guidance.
- WF2 Push 07 — verified Next-Gen Ranger 39-record catalogue / 20 source-evidence rows.
- WF3 Push 32 — `Y62-F34-V1-CANDIDATE-02`, governed owner-reference transparent isolation preflight.
- WF4 Push 04 — reviewer evidence / canonical reference visibility.

## Promotion decision
**HOLD — not promotable.**

Historical regression, exact available/missing/blocked behavior, exact-SKU/no-fallback behavior, Ranger catalogue integrity, draft visual isolation, positive governed promotion, and existing immutable project revision/share lineage remain green. The acceptance gate is intentionally red only on unresolved WF1/WF4 production controls.

Push 08 adds two release-critical findings: customer-supplied render readiness can currently be persisted into project/share/quote artifacts without resolver validation, and a previously finalised formal quote can be overwritten in place through the normal customer quote upsert path.

`REFERENCE_BACKED_APPROVED_VISUALS_ONLY` remains the governing production rule. These findings do not promote any current WF3 draft asset; instead they show that downstream persisted artifacts must also be authoritative and immutable so unsupported visual claims cannot bypass the resolver or alter a formal quote after issue.

## Package adjudication

| Package | QA decision | Evidence / rationale |
|---|---|---|
| WF1 Run 02 | **PACKAGE PASS / LANE RETURNED** | Conditional-fitment messaging remains green. Three OR-dependency acceptance defects remain open: durable gate loss, quote-review propagation, and removal revalidation. |
| WF2 Push 07 | **PASS / LOCK DATA** | 39 Ranger products / 20 source-evidence records remain deduplicated, source-backed and conservative. Unknowns remain unknown; no approved customer visuals are introduced. |
| WF3 Push 32 | **PASS AS REVIEW ARTIFACT / RETURN FOR MASTER** | Candidate 02 remains `master-draft`, customer-hidden, rights/overlay incomplete and exact customer state `missing`. |
| WF4 Push 04 | **PACKAGE PASS / LANE RETURNED** | Staff evidence visibility remains useful, but shared production/quote controls now have eight explicit acceptance failures, including the two new immutable handoff failures below. |
| WF5 Push 08 | **PASS AS QA PACKAGE** | QA-only tests/evidence added. Full historical regression and static verification are green; composite release gate remains red only on acceptance blockers. |

## New QA coverage in Push 08

### 1. Project/share/quote render trust boundary — FAIL / RETURN WF4
New acceptance check `WF4-PROJECT-RENDER-TRUST-BOUNDARY` submits a customer snapshot that falsely claims:
- `render.productionReady = true`;
- a base layer with `state = available`;
- an arbitrary asset ID that does not exist in governed production;
- an arbitrary SHA-256 value.

Current result: **FAIL**.

Observed behavior: the untrusted render claim survives unchanged into the immutable project revision, customer share and quote payload. The share/staff surfaces can therefore report “Production ready” even though the server resolver has never admitted that asset.

Required remediation: persisted render state must be server-authoritative. On project save and quote intake, either recompute the render snapshot from the governed exact resolver or validate every claimed available layer against the active production asset/version/checksum. Unsupported or stale claims must be rejected or normalized to exact `missing` / `blocked`; client-supplied readiness must never become authoritative merely because it is inside an immutable snapshot.

### 2. Finalised formal quote immutability — FAIL / RETURN WF4
New acceptance check `WF4-FINALISED-QUOTE-IMMUTABILITY` creates and finalises a formal quote, then reuses the normal customer upsert path with the same quote reference and changed customer/render data.

Current result: **FAIL**.

Observed behavior: the customer upsert mutates the already-finalised quote payload in place. The quote can move back to `ready-to-quote`, customer data can change, and unsupported render metadata can replace the originally issued snapshot while the old `quoteFinalisation` object still exists.

Required remediation: once `quoteFinalisation.status === finalised`, the issued quote payload must be immutable. Later commercial changes require an explicit governed quote revision/new quote reference with lineage to the prior issued quote. Customer upsert must reject mutation of an issued quote (or create a new draft revision) rather than overwrite the formal record.

## Acceptance gate state
`npm run test:wf5-acceptance` now reports **11 failing checks across 2 returned delivery lanes**.

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
11. `WF4-FINALISED-QUOTE-IMMUTABILITY` — a customer upsert can mutate an already-finalised formal quote in place.

Passing acceptance controls remain:
- `WF1-BOM-ANYOF-SATISFIED` — one valid alternative satisfies one-of semantics without forcing every alternative.
- `WF5-OWNER-REFERENCE-PACK-INTEGRITY` — all 9 owner files/checksums/rights and canonical brief references verify.
- `WF5-CUSTOMER-DRAFT-ISOLATION` — customer entrypoint remains isolated from draft/reference tooling with `fallbackPolicy: none`.

## Visual governance / exact resolver behavior
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

The current WF3 F34 candidate remains customer `missing`. Push 08 does not promote any visual asset; the new negative fixture only demonstrates that client-provided persisted render metadata can currently misrepresent resolver state downstream.

## Governed promotion and immutable lineage
`npm run test:wf5-promotion` — **PASS**.

The positive control continues to prove:
- staged draft does not change customer output;
- missing reviewer evidence rejects promotion;
- the valid F34 fixture uses the exact locked `Y62-F34-V1` owner-reference IDs;
- all retained positive-control reference IDs resolve to `owner-project-approved` evidence;
- a properly reviewed/versioned/checksum-pinned master becomes exact `available` only after promotion;
- R0001 share and quote remain pinned to historical `missing` visual state after R0002 records a later approved visual.

Push 08 clarifies an important distinction: revision/share pinning is working once a trustworthy snapshot exists, but the server currently trusts unverified render fields when creating that snapshot and allows an issued quote record to be overwritten later. Immutability therefore needs to cover both **admission authenticity** and **post-finalisation mutation control**.

## Verification evidence
- Full `npm test` Alpha 12 → current Alpha 26 regression chain: **PASS**.
- Latest-candidate integration: **PASS**.
- Explicit visual-safety rejection suite: **PASS**.
- Governed reference-backed promotion + project/revision/share/quote visual lineage positive control: **PASS**.
- Exact render resolver suite: **PASS**.
- `npm run check`: **PASS**.
- WF5 acceptance gate: **FAIL / EXPECTED HOLD**, 11 checks across the 2 returned lanes above.
- Composite `npm run test:gate`: **FAIL / EXPECTED HOLD** only at the acceptance gate after all preceding suites pass.
- JavaScript syntax sweep: **91 JS files / 0 failures**.
- JSON parse sweep: **9 application JSON files / 0 failures; 22 JSON files / 0 failures including QA evidence artifacts**.
- HTML dependency sweep: **16 HTML files / 239 local references / 0 missing**.
- Diff against Push 07 confirms only `package.json`, the WF5 acceptance test, Push 08 QA evidence and this report changed; no product/runtime behavior was modified.
- Push 08 evidence logs are stored under `qa-evidence/wf5-push08/`.

## Next QA dependency
The release remains blocked by WF1 and WF4. WF4 remains the highest-risk next candidate because it controls both customer-production visual admission and formal quote integrity.

1. **WF4 / server-authoritative immutable handoff:** recompute or validate render readiness during project/quote persistence, and make issued formal quotes immutable to customer upsert. Later changes must create an explicit governed quote revision/new reference.
2. **WF4 / canonical provenance gate:** resolve every `provenance.referenceId` against governed evidence, enforce allowed rights/vehicle identity, and bind canonical-master promotion to the exact canonical brief/view.
3. **WF4 / quote fitment trust boundary:** recompute required fitment gates from immutable BOM/governed fitment data rather than trusting client-supplied `gates`.
4. **WF4 / direct production parity:** remove/deny direct production promotion or require the same immutable reviewer/version/checksum/audit evidence as governed version promotion.
5. **WF1:** revalidate `anyOfRequiredParts` after removal and persist unresolved OR-dependency gates through project → quote lineage whenever no valid alternative remains.

WF2 remains promotable at its data boundary. WF3 Candidate 02 remains valid review evidence only and must continue resolving customer `missing` until clean F34 reconstruction/isolation, overlay acceptance, production rights, identified review, exact reference/brief governance and final production promotion are all satisfied.

The next candidate should be rerun against this Push 08 gate unchanged.
