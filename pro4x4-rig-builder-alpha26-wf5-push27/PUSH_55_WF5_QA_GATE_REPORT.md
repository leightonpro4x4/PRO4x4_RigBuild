# PRO4X4 Rig Builder — WF5 QA / Integration Gate — Push 25

## Gate decision
**Alpha 26 remains HOLD / NOT PROMOTABLE.**

Push 25 is QA/integration-only. No product features, catalogue records, customer UX, runtime production behaviour, render implementation, data records, or visual assets were changed. Candidate packages are promoted only when their acceptance checks pass; returned lanes remain isolated from production.

## Package adjudication
| Lane / package | WF5 verdict | Evidence / reason |
|---|---|---|
| WF1 — merged Alpha26 Run 02 | **RETURNED** | Package executes, but 4 compatibility/BOM acceptance blockers remain: unsatisfied `anyOfRequiredParts` persistence, quote review recomputation, removal revalidation, and material conditional-fitment gating. |
| WF2 — Ranger Support Push 07 | **PASS / LOCK DATA BOUNDARY** | 39 Ranger catalogue records, 20 evidence records, support expansion verified, no package regression. |
| WF3 — Y62 F34 Push 32 | **PASS AS REVIEW EVIDENCE ONLY** | Candidate 02 remains `master-draft`; customer resolver remains exact `missing`. No customer-production promotion. |
| WF4 — merged review/governance lane | **RETURNED** | 24 shared-platform/governance acceptance blockers now remain, including quote authority/lineage/immutability defects. |
| WF5 — QA Push 25 | **PASS AS QA PACKAGE** | Targeted negative test added, complete regression chain rerun, no implementation/data/visual drift. |

## New Push 25 blocker — `WF4-FINALISED-QUOTE-STAFF-MUTATION`
An already-issued formal quote is still mutable through the staff review/update path.

Targeted control:
1. Customer submits a gate-clear draft quote.
2. Admin formally finalises it, creating a stable quote number and issuance evidence.
3. A sales/staff actor calls the ordinary quote update path against that same reference after issuance.
4. The update changes customer/lead payload, staff-review notes, and render lineage while retaining the existing formal quote identity and issuance evidence.

Observed result: the write succeeds. The same formal quote number remains attached to materially different post-issue payload/lineage.

This is distinct from the existing customer-mutation and re-finalisation blockers:
- `WF4-FINALISED-QUOTE-IMMUTABILITY` proves a customer can mutate a finalised quote through customer upsert.
- `WF4-QUOTE-REFINALISATION-IMMUTABILITY` proves staff can re-run finalisation and silently alter issuance evidence.
- **Push 25 proves the normal staff review/update path can mutate the already-issued quote payload while retaining the existing formal issuance identity.**

Required acceptance behaviour: once `quoteFinalisation.status === finalised`, every ordinary update path must reject mutation or become a no-op. Any post-issue commercial, BOM, render, lead, fitment, or staff-review change must create a new governed quote revision/reference with explicit lineage to the superseded issue.

## Acceptance gate state
`npm run test:wf5-acceptance` reports **28 failing checks across only 2 returned lanes (WF1 and WF4)**.

### WF1 root defects — 4
1. `WF1-BOM-ANYOF`
2. `WF1-QUOTE-ANYOF`
3. `WF1-REMOVE-ANYOF`
4. `WF1-CONDITIONAL-FITMENT-GATE`

### WF4 / shared-platform defects — 24
1. `WF4-DIRECT-PRODUCTION-REVIEW`
2. `WF4-DIRECT-PRODUCTION-EVIDENCE`
3. `WF4-REVIEWER-IDENTITY-AUTHENTICITY`
4. `WF4-MASTER-REFERENCE-BACKING`
5. `WF4-QUOTE-GATE-TRUST-BOUNDARY`
6. `WF4-MASTER-REFERENCE-ID-VALIDITY`
7. `WF4-MASTER-BRIEF-REFERENCE-BINDING`
8. `WF4-PRODUCTION-BINARY-IMMUTABILITY`
9. `WF4-PRODUCTION-IDENTITY-IMMUTABILITY`
10. `WF4-CANDIDATE-EVIDENCE-RESET`
11. `WF4-BLOCKED-FITMENT-PRECEDENCE`
12. `WF4-RENDER-STATE-EXACTNESS`
13. `WF4-PRODUCTION-TUPLE-UNIQUENESS`
14. `WF4-PROJECT-RENDER-TRUST-BOUNDARY`
15. `WF4-QUOTE-PROJECT-REVISION-BINDING`
16. `WF4-QUOTE-LINEAGE-REQUIRED`
17. `WF4-QUOTE-LINEAGE-EXISTENCE`
18. `WF4-QUOTE-LINEAGE-OWNERSHIP`
19. `WF4-QUOTE-REFERENCE-OWNERSHIP`
20. `WF4-QUOTE-FINALISATION-AUTHORITY`
21. `WF4-QUOTE-REFINALISATION-IMMUTABILITY`
22. `WF4-FINALISED-QUOTE-IMMUTABILITY`
23. `WF4-FINALISED-QUOTE-STAFF-MUTATION`
24. `WF4-SHARE-REVISION-ISOLATION`

Passing acceptance controls remain:
- `WF1-BOM-ANYOF-SATISFIED` — one valid alternative satisfies one-of semantics without forcing every alternative.
- `WF5-OWNER-REFERENCE-PACK-INTEGRITY` — all locked owner-reference files/checksums/rights and canonical brief references verify.
- `WF5-CUSTOMER-DRAFT-ISOLATION` — customer entrypoint remains isolated from reference/master/layer draft tooling and uses `fallbackPolicy: none`.

## Visual-governance and exact resolver evidence
`npm run test:wf5-visual-safety` — **PASS**.

Controlled fixtures still prove:
- reference-only visual output is rejected;
- `master-draft` is customer `missing`;
- `layer-draft` is customer `missing`;
- covered exact blocked-fitment resolves `blocked`;
- unsupported exact SKU resolves `missing`;
- no fallback/substitution is used in covered exact-state fixtures; and
- draft/candidate visual states expose no production binary URL.

`npm run test:render-resolver` — **PASS** for covered exact-state behaviour, checksum-pinned delivery, telemetry/readiness and `fallbackPolicy: none`.

WF3 F34 Candidate 02 remains customer `missing`. Push 25 promotes **no visual asset**. Reference-only, `master-draft`, `layer-draft`, or unsupported visual output is therefore not admitted to customer production by this package.

## Compatibility / BOM evidence
WF2 remains clean at the verified data boundary:
- 39 Ranger catalogue records;
- 20 evidence records;
- support expansion verified;
- no duplicate IDs/SKUs under package tests;
- unknown install values remain unknown; and
- unproven fitment remains withheld.

WF1 remains returned because OR-dependency and material fitment-condition state is not yet an immutable, server-authoritative contract across selection removal, saved revision, quote intake and quote finalisation.

## Project / revision / share / quote lineage evidence
`npm run test:wf5-promotion` — **PASS** positive control. Governed reference-backed promotion still proves:
- customer-hidden draft state;
- reviewer-field admission gate;
- exact availability only after governed promotion;
- checksum/version-pinned review evidence; and
- historical project → revision → share → quote visual lineage remaining pinned in the positive fixture.

Negative acceptance coverage now proves the release must remain held because the platform can still:
- issue a formal quote with no immutable revision lineage;
- issue against a fabricated/non-existent revision;
- claim a real revision while carrying different content;
- use another customer's real revision lineage;
- overwrite another customer's draft quote reference;
- forge formal issuance fields from customer intake;
- re-finalise an already-issued quote under changed settings;
- mutate a finalised quote through customer upsert;
- **mutate a finalised quote through staff review/update while retaining its formal issue identity;** and
- expose later unshared revisions through a share pinned to an older revision.

## Full verification evidence
- Full `npm test` Alpha 12 → current Alpha 26 regression chain: **PASS**.
- Latest-candidate integration: **PASS** (`wf2Catalogue39=true`, `wf2Evidence20=true`, `wf2SupportExpansionVerified=true`, WF3 customer state `missing`).
- Explicit visual-safety rejection suite: **PASS**.
- Governed reference-backed promotion + historical immutable visual-lineage positive control: **PASS**.
- Exact render resolver suite: **PASS** for covered fixtures.
- `npm run check`: **PASS**.
- JavaScript syntax sweep: **91 files / 0 failures**.
- JSON parse sweep: **26 files / 0 failures**.
- HTML dependency sweep: **16 HTML files / 239 local references / 0 missing**.
- WF5 acceptance gate: **FAIL / EXPECTED HOLD**, 28 blockers across WF1/WF4.
- Composite `npm run test:gate`: **FAIL / EXPECTED HOLD** only when it reaches the acceptance blockers after preceding suites pass.
- Implementation/data/visual diff versus Push 24: **0 added / 0 removed / 0 changed**.

Push 25 evidence is stored under `qa-evidence/wf5-push25/`.

## Change isolation
Expected Push 25 changes are QA/package/reporting only:
- `tests/wf5-alpha26-acceptance-gate.js` — targeted `WF4-FINALISED-QUOTE-STAFF-MUTATION` negative test;
- `package.json` — QA package version/description only;
- `qa-evidence/WF5_INTEGRATION_MANIFEST.json` — blocker inventory/checkpoint only;
- `PUSH_55_WF5_QA_GATE_REPORT.md` — this report; and
- `qa-evidence/wf5-push25/*` — verification logs/evidence.

## Next QA dependency
**WF4 formal quote lifecycle immutability is the next QA dependency.** The platform needs one terminal server-authoritative issued-quote state that is immutable across customer upsert, staff update/review, and repeated finalisation. Post-issue changes must create a new governed quote revision/reference rather than rewriting the issued record. The same remediation should enforce quote owner identity plus exact authorised project/revision lineage before finalisation.

WF1 remains the parallel compatibility dependency: persist and server-recompute `anyOfRequiredParts` and material `fitment.conditions`, and revalidate them after selection removal and at quote intake/finalisation. Visual-governance blockers remain hard release gates behind the quote lifecycle work.
