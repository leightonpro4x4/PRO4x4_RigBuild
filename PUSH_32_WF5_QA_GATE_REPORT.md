# PRO4X4 Rig Builder — Alpha 26 WF5 QA / Integration Gate — Push 02

## Scope
WF5-only integration adjudication against the latest merged Alpha 26 Parallel Push 05 checkpoint. No product feature work was added. This push adds QA tests/evidence only and verifies WF1–WF4 candidate work against the Alpha 26 acceptance criteria, exact render-state rules, compatibility/BOM integrity, immutable project/revision/share/quote lineage, reviewer/audit controls and regression safety.

## Promotion decision
**Merged Alpha 26 Parallel Push 05 is NOT promotable yet.**

The legacy/full Alpha 12 → Alpha 26 regression chain remains green, and the complete governed staged-candidate → reviewed `master-approved` → immutable promotion → customer resolver path is proven green. Two new cross-stream acceptance defects were found that are not covered by the older regression set:

1. WF1 does not preserve an unsatisfied `anyOfRequiredParts` dependency into the immutable project/quote gate after a valid support product is later removed.
2. WF4's direct render-asset production upsert can still accept `master-approved` metadata without immutable `governance.reviewedBy` + `governance.reviewedAt`, bypassing the stricter version-promotion reviewer-evidence rule.

Until both are fixed and the new `npm run test:gate` command passes, the merged package must remain held from Alpha promotion.

## Package adjudication

| Package | Decision | Verification |
|---|---|---|
| WF1 — Push 05 guided compatibility resolution | **RETURNED** | Guided `anyOfRequiredParts` add choices work, but removing the supporting bar can strand the dependent bash plate. `merged-project-contract.gatesFor()` ignores `fitment.anyOfRequiredParts`, so the saved BOM/quote can lose the hard dependency gate. |
| WF2 — Ranger 28-record catalogue + any-of data contract | **PASS / LOCK DATA** | `BP-FRA-NG-22-ASM0` retains the two valid support alternatives and `selectionGate()` correctly blocks until one is selected. The source-backed data itself is sound; the defect is in downstream customer/project persistence. |
| WF3 — Y62 F34 overlay/reconstruction governance | **PASS TO REVIEW ONLY / HOLD FROM CUSTOMER PRODUCTION** | Reference-only and master-draft assets remain customer-ineligible. No draft/reference candidate is loaded by the customer entrypoint. No unsupported visual was promoted. |
| WF4 — immutable reviewer evidence on version promotion | **RETURNED** | Governed version promotion correctly rejects absent reviewer evidence and preserves immutable review evidence when successful. However the older direct `PUT /api/v1/staff/render-assets/:id` production path still bypasses reviewer identity/timestamp. |
| WF5 — QA / Integration Gate | **PASS** | New full promotion-path and acceptance tests added; customer draft isolation remains green; defects are explicitly returned rather than promoted. |

## Verification evidence

### Full Alpha regression chain
`npm test` — **PASS**.

This re-ran Alpha 12 through Alpha 26, including security, hosted runtime, asset registry/ingestion/vault, immutable asset versions, resolver, render telemetry/readiness, merged project handoff, multi-vehicle pipeline, parallel workstreams, persisted visual governance and Parallel Pushes 02–05.

The render-resolver regression explicitly remains green for:
- exact states: `available`, `missing`, `blocked`;
- exact-SKU no substitution;
- checksum-pinned binary delivery;
- customer reference fallback: `none`;
- no fake production seed.

### New WF5 promotion-path test
`npm run test:wf5-promotion` — **PASS**.

Verified end-to-end:
- seed/reference master resolves `missing`;
- staging a candidate does not change customer output;
- promotion without reviewer identity/timestamp is rejected with `review_evidence_required`;
- reviewed `master-approved` candidate with cleared rights, locked camera match, transparent 1672×615 metadata and immutable version identity promotes successfully;
- resolver flips to exact `available` with checksum-pinned binary URL only after promotion;
- promotion audit stores the immutable review evidence;
- R0001 project/share/formal quote retain the original missing visual state after the live resolver later becomes available and R0002 is saved with the new approved visual state.

### New WF5 acceptance gate
`npm run test:wf5-acceptance` — **FAIL (2 returned defects)**.

**WF1-BOM-ANYOF:** saved BOM retains `fitment.anyOfRequiredParts`, but no immutable project/quote gate is created when neither allowed support item is present. This is reproducible with Ranger lower bash/skid plate `BP-FRA-NG-22-ASM0` after its supporting Predator/Toro bar is removed.

**WF4-DIRECT-PRODUCTION-REVIEW:** direct production upsert accepts a technically valid `canonical-master` with governance state `master-approved` even when both `governance.reviewedBy` and `governance.reviewedAt` are null. This means reviewer evidence is mandatory on version promotion but not yet mandatory on every production mutation path.

**WF5-CUSTOMER-DRAFT-ISOLATION:** PASS. The customer entrypoint does not load canonical candidate/reconstruction/overlay-review tooling and the shared project contract preserves `fallbackPolicy:'none'`.

### Static/integrity checks
- `npm run check` — **PASS**.
- JavaScript syntax sweep — **83 files, 0 failures**.
- JSON parse sweep — **9 files, 0 failures**.
- Internal HTML dependency sweep — **15 HTML files / 236 local references, 0 missing**.

## Visual-governance disposition
Reference-only, master-draft, layer-draft and unsupported visuals remain rejected from customer production in the resolver/customer entrypoint. The new positive lifecycle test proves a canonical master becomes customer-visible only after the governed version is explicitly reviewed, approved and promoted.

The WF4 direct-upsert reviewer-evidence gap is a **production-control bypass**, not evidence of a current customer visual leak. It is nevertheless promotion-blocking because the same production state can be reached through two staff API paths with different review requirements.

## Compatibility / BOM disposition
The new Ranger `anyOfRequiredParts` catalogue representation is correct and the pre-add customer gate is correct. The failure appears after selection-state mutation: removal logic only cascades `requires/requiredParts`, not `anyOfRequiredParts`, and the immutable snapshot gate builder likewise ignores the OR dependency. That means the build summary can warn while the persisted quote workflow can lose the hard dependency.

WF1 must make removal/quote persistence revalidate OR dependencies. It must not silently invent one of the alternatives; the persisted gate should state that **one of the verified alternatives is required** until a valid support item exists.

## Immutable lineage disposition
PASS. The new QA path proves an exact visual state is frozen into the saved revision and inherited by its share and quote. Later production-asset approval and a later R0002 project revision do not rewrite the R0001 share or quote. This is the required project → revision → share → quote visual lineage behavior.

## Next QA dependency
Re-run `npm run test:gate` after:

1. **WF1** updates customer removal/invariant handling and `merged-project-contract.gatesFor()` so an unsatisfied `fitment.anyOfRequiredParts` produces a durable dependency/fitment gate in saved project and quote snapshots.
2. **WF4** makes immutable reviewer identity + timestamp mandatory in `productionProblems()` / direct `production-ready` upsert, not only in `promoteAssetVersion()`.

Expected next-gate result: both currently failing acceptance checks flip to PASS, while the staged master promotion path, exact available/missing/blocked behavior and full Alpha regression chain remain green.
