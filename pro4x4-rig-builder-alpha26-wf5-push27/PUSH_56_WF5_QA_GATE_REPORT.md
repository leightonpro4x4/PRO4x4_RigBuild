# PRO4X4 Rig Builder — WF5 QA / Integration Gate — Push 26

## Gate decision
**Alpha 26 remains HOLD / NOT PROMOTABLE.**

Push 26 is QA/integration-only. No product features, catalogue records, customer UX, runtime production behaviour, render implementation, data records, or visual assets were changed. Candidate packages are promoted only when their acceptance checks pass; returned lanes remain isolated from production.

## Package adjudication
| Lane / package | WF5 verdict | Evidence / reason |
|---|---|---|
| WF1 — merged Alpha26 Run 02 | **RETURNED** | Package executes, but 4 compatibility/BOM acceptance blockers remain: unsatisfied `anyOfRequiredParts` persistence, quote review recomputation, removal revalidation, and material conditional-fitment gating. |
| WF2 — Ranger Support Push 07 | **PASS / LOCK DATA BOUNDARY** | 39 Ranger catalogue records, 20 evidence records, support expansion verified, no package regression. |
| WF3 — Y62 F34 Push 32 | **PASS AS REVIEW EVIDENCE ONLY** | Candidate 02 remains `master-draft`; customer resolver remains exact `missing`. No customer-production promotion. |
| WF4 — merged review/governance lane | **RETURNED** | 26 shared-platform/governance acceptance blockers now remain, including formal quote authority, immutable lineage, issuance evidence, quote ownership/immutability, resolver and visual-governance defects. |
| WF5 — QA Push 26 | **PASS AS QA PACKAGE** | Two targeted formal-issuance evidence tests added, complete Alpha regression chain rerun, no implementation/data/visual drift. |

## New Push 26 blocker — `WF4-QUOTE-FINALISER-IDENTITY`
Formal quote issuance does not bind the authenticated staff finaliser identity into the issued quote evidence.

Targeted control:
1. A customer-owned immutable project revision is created.
2. The exact saved revision snapshot is submitted to the quote queue.
3. An authenticated admin actor performs the governed formal finalisation transition.
4. WF5 inspects the resulting issued quote for immutable issuance identity evidence.

Observed result: `quoteFinalisation` contains status, quote number, issue/validity timestamps, total and labour rate, but **no `finalisedBy` / `issuedBy` identity**. The root snapshot `actor` remains the original customer actor. The commercial record therefore cannot prove which authenticated staff identity authorised issuance, even though the audit log separately received an actor.

Required acceptance behaviour: the terminal issued quote must embed immutable finalisation evidence bound to the authenticated staff principal for that exact issuance transition. Free-text or inherited customer snapshot identity is not sufficient.

## New Push 26 blocker — `WF4-QUOTE-REVISION-CHECKSUM-BINDING`
Formal quote issuance identifies a project/revision by ID but does not cryptographically bind the exact immutable revision checksum into issuance evidence.

Targeted control:
1. WF5 creates a real customer-owned immutable project revision (`R0001`) and records its stored revision checksum.
2. The exact revision snapshot is submitted without mutation.
3. Staff formally issues the quote.
4. WF5 compares the issued quote evidence against the authoritative stored revision checksum.

Observed result: the issued record retains `project.id` and `project.revisionId`, but neither `quoteFinalisation` nor another explicit issuance-lineage field pins the authoritative revision checksum. IDs alone therefore do not independently prove which immutable snapshot was authorised when the commercial document was issued.

Required acceptance behaviour: formal finalisation must resolve the exact authorised immutable project revision server-side and persist its checksum (or an equivalently strong immutable content digest) in the terminal quote issuance envelope, alongside the finaliser identity and issued quote identity.

## Acceptance gate state
`npm run test:wf5-acceptance` reports **30 failing checks across only 2 returned lanes (WF1 and WF4)**.

### WF1 root defects — 4
1. `WF1-BOM-ANYOF`
2. `WF1-QUOTE-ANYOF`
3. `WF1-REMOVE-ANYOF`
4. `WF1-CONDITIONAL-FITMENT-GATE`

### WF4 / shared-platform defects — 26
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
24. `WF4-QUOTE-FINALISER-IDENTITY`
25. `WF4-QUOTE-REVISION-CHECKSUM-BINDING`
26. `WF4-SHARE-REVISION-ISOLATION`

Passing acceptance controls remain:
- `WF1-BOM-ANYOF-SATISFIED` — one valid alternative satisfies one-of semantics without forcing every alternative.
- `WF5-OWNER-REFERENCE-PACK-INTEGRITY` — locked owner/reference files, checksums, rights and canonical brief references verify.
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

`npm run test:render-resolver` — **PASS** for the covered exact-state behaviour, checksum-pinned delivery, telemetry/readiness and `fallbackPolicy: none`.

WF3 F34 Candidate 02 remains customer `missing`. Push 26 promotes **no visual asset**. Reference-only, `master-draft`, `layer-draft`, or unsupported visual output is therefore not admitted to customer production by this package.

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
- checksum/version-pinned visual review evidence; and
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
- mutate a finalised quote through staff review/update while retaining its formal issue identity;
- **issue a formal quote without embedding the authenticated staff finaliser identity;**
- **issue a formal quote without pinning the authoritative immutable project-revision checksum;** and
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
- WF5 acceptance gate: **FAIL / EXPECTED HOLD**, 30 blockers across WF1/WF4.
- Composite `npm run test:gate`: **FAIL / EXPECTED HOLD** only when it reaches the acceptance blockers after preceding suites pass.
- Implementation/data/visual diff versus Push 25: **0 added / 0 removed / 0 changed**.

Push 26 evidence is stored under `qa-evidence/wf5-push26/`.

## Change isolation
Expected Push 26 changes are QA/package/reporting only:
- `tests/wf5-alpha26-acceptance-gate.js` — targeted finaliser-identity and revision-checksum issuance evidence tests;
- `package.json` — QA package version/description only;
- `qa-evidence/WF5_INTEGRATION_MANIFEST.json` — blocker inventory/checkpoint only;
- `PUSH_56_WF5_QA_GATE_REPORT.md` — this report; and
- `qa-evidence/wf5-push26/*` — verification logs/evidence.

## Next QA dependency
**WF4 needs a terminal, server-authoritative formal quote issuance envelope.** Finalisation must resolve an authorised immutable project revision, canonicalise the quote against that snapshot, persist the revision checksum/content digest and authenticated finaliser identity into immutable issuance evidence, and then reject/no-op every subsequent mutation/re-finalisation path. Any later commercial/BOM/render/fitment/lead change must create a new governed quote revision/reference with explicit supersession lineage.

WF1 remains the parallel compatibility dependency: persist and server-recompute `anyOfRequiredParts` and material `fitment.conditions`, and revalidate them after selection removal and at quote intake/finalisation. Existing visual-governance blockers remain hard release gates behind the quote lifecycle work.
