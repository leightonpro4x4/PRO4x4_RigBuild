# PRO4X4 Rig Builder — WF5 QA / Integration Gate — Push 27

## Gate decision
**Alpha 26 remains HOLD / NOT PROMOTABLE.**

Push 27 is QA/integration-only. No product features, catalogue records, customer UX, production runtime behaviour, render implementation, data records, or visual assets were changed. Candidate packages are promoted only when their acceptance checks pass; returned lanes remain isolated from production.

## Package adjudication
| Lane / package | WF5 verdict | Evidence / reason |
|---|---|---|
| WF1 — merged Alpha26 Run 02 | **RETURNED** | Package executes, but 4 compatibility/BOM acceptance blockers remain: unsatisfied `anyOfRequiredParts` persistence, quote review recomputation, removal revalidation, and material conditional-fitment gating. |
| WF2 — Ranger Support Push 07 | **PASS / LOCK DATA BOUNDARY** | 39 Ranger catalogue records, 20 evidence records, support expansion verified, no package regression. |
| WF3 — Y62 F34 Push 32 | **PASS AS REVIEW EVIDENCE ONLY** | Candidate 02 remains `master-draft`; customer resolver remains exact `missing`. No customer-production promotion. |
| WF4 — merged review/governance lane | **RETURNED** | 27 shared-platform/governance acceptance blockers remain, including quote authority/lineage, public-share isolation, resolver and visual-governance defects. |
| WF5 — QA Push 27 | **PASS AS QA PACKAGE** | One targeted public-share isolation test added, complete Alpha regression chain rerun, no implementation/data/visual drift. |

## New Push 27 blocker — `WF4-SHARE-REGISTRY-ISOLATION`
A public share token exposes private share-management metadata beyond the pinned revision it is intended to disclose.

Targeted control:
1. WF5 creates one immutable customer project revision (`R0001`).
2. Two independent public share tokens are created for that same revision.
3. Share A is resolved through the public share path.
4. WF5 inspects the public response for Share B's management metadata and for private token-derived identifiers belonging to Share A.

Observed result: the public response includes the full `project.shares` registry, including the sibling share's `tokenHash` and `tokenHint`, and also returns the active share's `tokenHash` in `resolved.share`. A holder of one share token can therefore inspect private share-management material for other shares on the project.

Required acceptance behaviour: public share resolution must return a minimum, sanitised share descriptor plus only the pinned immutable revision and safe project display metadata. The private share registry, token hashes, token hints for sibling shares, revocation-management metadata, future revisions, and owner/staff-only state must remain outside the public response boundary.

This is distinct from `WF4-SHARE-REVISION-ISOLATION`: Push 26 and earlier coverage proved a pinned R0001 share leaks later unshared revisions/current-project state; Push 27 proves that even without creating a later revision, the public response leaks the private **share registry itself**.

## Acceptance gate state
`npm run test:wf5-acceptance` reports **31 failing checks across only 2 returned lanes (WF1 and WF4)**.

### WF1 root defects — 4
1. `WF1-BOM-ANYOF`
2. `WF1-QUOTE-ANYOF`
3. `WF1-REMOVE-ANYOF`
4. `WF1-CONDITIONAL-FITMENT-GATE`

### WF4 / shared-platform defects — 27
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
27. `WF4-SHARE-REGISTRY-ISOLATION`

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

WF3 F34 Candidate 02 remains customer `missing`. Push 27 promotes **no visual asset**. Reference-only, `master-draft`, `layer-draft`, or unsupported visual output is therefore not admitted to customer production by this package.

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
- persist customer-supplied production-ready render metadata without authoritative resolver canonicalisation;
- issue a formal quote with no immutable revision lineage;
- issue against a fabricated/non-existent revision;
- claim a real revision while carrying different content;
- use another customer's real revision lineage;
- overwrite another customer's draft quote reference;
- forge formal issuance fields from customer intake;
- re-finalise an already-issued quote under changed settings;
- mutate a finalised quote through customer upsert;
- mutate a finalised quote through staff review/update while retaining its formal issue identity;
- issue without embedding the authenticated finaliser identity;
- issue without pinning the authoritative immutable project-revision checksum;
- expose later unshared revisions through a share pinned to an older revision; and
- **expose the private project share registry, including sibling token hashes/hints, through a public share response.**

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
- WF5 acceptance gate: **FAIL / EXPECTED HOLD**, 31 blockers across WF1/WF4.
- Composite `npm run test:gate`: **FAIL / EXPECTED HOLD** only when it reaches the acceptance blockers after preceding suites pass.
- Implementation/data/visual diff versus Push 26: **0 added / 0 removed / 0 changed**.

Push 27 evidence is stored under `qa-evidence/wf5-push27/`.

## Change isolation
Expected Push 27 changes are QA/package/reporting only:
- `tests/wf5-alpha26-acceptance-gate.js` — targeted public-share registry isolation test;
- `package.json` — QA package version/description only;
- `qa-evidence/WF5_INTEGRATION_MANIFEST.json` — blocker inventory/checkpoint only;
- `PUSH_57_WF5_QA_GATE_REPORT.md` — this report; and
- `qa-evidence/wf5-push27/*` — verification logs/evidence.

## Next QA dependency
**WF4 needs an explicit public-share projection boundary.** `resolveShare` must stop returning the mutable/private project aggregate. It should resolve the exact stored share record, verify expiry/revocation, fetch only the pinned immutable revision, and return a sanitised public DTO containing safe project display metadata plus that revision. The response must not expose `project.revisions`, `project.shares`, sibling token hashes/hints, private owner/staff metadata, or mutable `currentRevisionId` state.

The formal-quote authority/immutable-lineage cluster remains the parallel WF4 release dependency: server-side project/revision authorisation, canonicalisation, revision checksum binding, authenticated issuer identity, and terminal/idempotent issuance. WF1 remains the parallel compatibility dependency: persist and server-recompute `anyOfRequiredParts` and material `fitment.conditions`, and revalidate them after selection removal and at quote intake/finalisation. Existing visual-governance blockers remain hard release gates behind those trust-boundary fixes.
