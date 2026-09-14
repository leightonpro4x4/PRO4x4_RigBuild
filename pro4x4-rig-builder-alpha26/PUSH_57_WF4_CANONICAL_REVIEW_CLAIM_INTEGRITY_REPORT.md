# Push 57 — WF4 Canonical Reviewer Claim Integrity / Concurrency Guard

## Scope
A26-WF4-29 advances one WF4 package only: the persisted reviewer/approval workflow. The package closes the remaining claim-identity/concurrency gap without introducing a second runtime, registry, database or approval path. `REFERENCE_BACKED_APPROVED_VISUALS_ONLY` remains authoritative.

## Concrete progress
- Upgraded the existing `reviewWorkflow.assignment` from reviewer strings/timestamp to a deterministic signed claim envelope with `claimId`, `claimSha256`, canonical master/brief identity, workflow evidence-binding SHA-256, exact candidate checksum, reviewer actor/display/role and assignment time.
- The claim is explicitly `authority: review-claim-only`, `productionEligible: false`; claiming review work cannot approve, stage or promote a visual.
- Same-reviewer claim retry is idempotent, so request retries cannot mint competing claims.
- Reviewer release now accepts the exact current `claimSha256` as an optimistic-concurrency token. A stale token returns `409 review_claim_conflict` and preserves the current claim.
- Workflow integrity validates claim policy/authority, master/brief binding, evidence binding, candidate checksum, reviewer identity/time and claim fingerprint. Legacy, malformed or evidence-drifted active claims are invalidated on explicit/governance refresh instead of being silently migrated.
- `canonicalReviewDecision` now snapshots the exact claim ID/SHA/evidence binding it consumed. The immutable canonical production seal also binds that exact claim envelope.
- Governance Attention and the vehicle canonical master-set truth index now expose claim identity/integrity in their persisted evidence basis.
- Render Assets shows `CLAIMED VERIFIED` / `CLAIMED INVALID`, Claim ID, Claim SHA-256 and claim candidate SHA-256. Production Readiness shows the same claim-integrity state. Sales remains inspection-only.
- Shared server, browser-local and persistence adapters use the same reviewer-workflow lane; no new endpoint family or storage service was introduced.

## Governed Y62 state after clean sync
- Owner references: **9**; current provenance attestations: **9/9**; current approved reference-review decisions: **9/9**.
- Reference pack: `Y62-OWNER-REFERENCE-PACK-V1` / manifest `260a875ef1a787d477178faaa21e897a225a8113fa6d02cab73840e012fe0342`.
- Canonical masters: **3**; active reviewer claims: **0**; valid reviewer claims: **0**; approved canonical decisions: **0**; production seals: **0**; production-eligible Y62 visuals: **0**.
- F34 remains `Y62-F34-V1-CANDIDATE-02` / `blocked-upstream`, with a `locked` current view contract and complete/current reference coverage.
- SIDE remains `awaiting-wf3-candidate`, view contract `calibration`, coverage `blocked-source-gap`, source-gap decision `open/current`.
- R34 remains `awaiting-wf3-candidate` with `calibration` camera/view calibration.
- Vehicle canonical master-set registry is `current` with SHA-256 `845b06d275265d8b66eb8838bec81e2ef629487f8fb9784c647800f9bb186ac6` and **4** open set-level problems.
- Audit integrity is `sealed`.

## Verification
- Targeted reviewer workflow / claim-integrity / decision / production-seal / master-set / governance-attention / source-gap matrix: **PASS**.
- Claim-integrity adversarial checks prove idempotent same-reviewer claim, stale release rejection, current release success, new identity after release/reclaim, claim fingerprint tamper detection, exact claim binding in reviewer decision, and HTTP concurrency guard.
- Complete Alpha regression (`npm test`): **PASS**.
- Node server syntax gate (`npm run check`): **PASS**.
- WF5 governed promotion lifecycle: **PASS**.
- WF5 acceptance remains **RED only for the existing WF1 `WF1-BOM-ANYOF` defect**; `WF4-DIRECT-PRODUCTION-REVIEW` and `WF5-CUSTOMER-DRAFT-ISOLATION` remain PASS.
- `assets/` + `references/`: **16/16 byte-identical** to Push 56. The 11 checked customer-critical presentation/data/render-contract files are also byte-identical.
- Static verification: **139 JavaScript files / 0 syntax failures, 66 JSON files / 0 parse failures, 16 HTML files / 303 local references / 0 missing**. Final ZIP integrity is also recorded in `WF4_CANONICAL_REVIEW_CLAIM_INTEGRITY_VALIDATION.json`.

## Next dependency
Primary dependency remains **A26-WF4-14B / WF3**: deliver the first genuinely clean, reviewable `Y62-F34-V1` candidate with reconstruction/isolation complete, locked overlay + camera acceptance, production-binary rights provenance and identified reviewer evidence. That will allow this claim envelope to be exercised on the real chain: review-approved owner evidence → exact canonical coverage/view contract → WF3 handoff → signed reviewer claim → canonical decision → immutable production seal → governed composite → sealed project/quote inspection. SIDE remains separately blocked until its view contract/source-gap path is satisfied.
