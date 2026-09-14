# Push 43 — WF4 Canonical Governance Dossier / Reviewer Evidence Packet

**Package:** A26-WF4-15  
**Owning workstream:** WF4 — Platform / Staff Tools  
**Policy:** `REFERENCE_BACKED_APPROVED_VISUALS_ONLY`  
**Backbone:** existing shared render-asset registry / SQLite runtime / audit ledger / browser adapter  
**Promotion performed:** **none**

## Why this was the next WF4 package

A26-WF4-14B remains correctly blocked until WF3 supplies a genuinely clean `Y62-F34-V1` candidate. The highest-value WF4 work that can advance independently is therefore reviewer intake visibility: staff need one persisted, checksum-addressed packet that answers **what exact evidence am I reviewing right now?** without introducing another runtime or treating a readiness screen as approval.

Push 43 adds that packet and nothing broader.

## Delivered

### 1. Persisted canonical governance dossier

New shared module: `canonical-governance-dossier.js`.

Every governed canonical master can now persist a `governanceDossier` containing a deterministic SHA-256 fingerprint of the current reviewer evidence basis:

- canonical master ID / brief / view / runtime status / governance state;
- canonical review contract and required check IDs;
- camera profile/match state and declared source gap;
- exact owner reference-pack ID + manifest SHA-256;
- per-required-reference checksum / rights / source / governance / authenticity snapshot;
- persisted WF3 candidate-handoff ID, handoff SHA-256, candidate ID/checksum, upstream decision and blockers;
- current canonical review result set and persisted review-evidence summary;
- persisted render-readiness assessment summary;
- computed reviewer-intake state/blockers; and
- current production blockers.

The dossier explicitly persists:

- `authority: inspection-only`
- `productionEligible: false`
- policy `REFERENCE_BACKED_APPROVED_VISUALS_ONLY`

It is therefore reviewer evidence, not a new approval mechanism.

### 2. Explicit freshness instead of silent evidence drift

Dossier freshness is recomputed against the current persisted canonical master and owner references. It reports `current`, `stale`, `invalid` or `unprepared`.

A change in backing reference state/checksum metadata, candidate handoff, review state/evidence, readiness evidence, camera/reviewer state or another fingerprinted governance input makes the old packet stale.

Normal visual-governance sync prepares dossiers only when they do not exist. It **does not silently overwrite an existing stale dossier**. That is deliberate: a changed evidence basis remains visible to staff until fitment/admin explicitly refreshes the packet.

### 3. Shared runtime persistence + audit

`server/database.js` now prepares missing dossiers during the existing idempotent visual-governance sync and provides `refreshCanonicalGovernanceDossier()` for explicit reviewer intake refresh.

Refreshing:

- persists only the reviewer dossier/history metadata;
- emits a chained `canonical.governance-dossier.prepared` audit event;
- does not change asset `status`;
- does not change `governance.state`;
- does not replace a candidate/production binary;
- does not stage an immutable asset version; and
- does not move the production pointer.

The audit event records the dossier SHA-256, reference-pack evidence, candidate handoff evidence, reviewer-intake state and the explicit inspection-only/non-production authority.

### 4. Staff endpoint

Added:

`POST /api/v1/staff/render-assets/:assetId/governance-dossier`

- `fitment` / `admin`: may explicitly refresh the persisted reviewer packet.
- `sales`: denied write access and remains inspection-only.
- applies only to governed canonical masters.

The existing HTTP adapter and browser-local adapter both use the same dossier policy module, preserving one shared runtime/backbone.

### 5. Staff visibility

**Render Assets** now shows a `CANONICAL GOVERNANCE DOSSIER` panel on canonical masters with:

- dossier freshness;
- reviewer-intake state;
- pack ID and required reference count;
- WF3 candidate ID;
- prepared staff/time;
- dossier SHA-256;
- candidate-handoff SHA-256;
- reference-pack manifest SHA-256;
- reviewer-intake blockers; and
- dossier integrity/freshness problems.

Fitment/admin can use **REFRESH REVIEWER DOSSIER**. The panel explicitly states that it cannot approve, promote or make a visual customer-visible.

**Production Readiness** now shows the same persisted reviewer dossier alongside each canonical master and visibly flags a non-current packet for refresh in Render Assets.

## Current governed Y62 state

Fresh bootstrap/sync verification produces three current dossiers:

| Canonical master | Reviewer intake | References | WF3 candidate | Review checks | Production eligibility |
|---|---|---:|---|---:|---|
| `Y62-F34-V1-MASTER` | `blocked-upstream` | 3 | `Y62-F34-V1-CANDIDATE-02` | 0/8 pass | false |
| `Y62-SIDE-V1-MASTER` | `awaiting-wf3-candidate` | 3 | none | no active contract checks | false |
| `Y62-R34-V1-MASTER` | `awaiting-wf3-candidate` | 2 | none | no active contract checks | false |

F34 remains bound to candidate SHA-256:

`a353980a92131b960fed91baa46609bc63c1ec07a485fd4612fa305f0f7cea28`

and handoff SHA-256:

`65499126b33adddd48591a2d35a4ad33f773c4c3659bfa4c5289567333160cba`

Its clean-state dossier SHA-256 is:

`612955c612a8182e7ae3eae9a635b8dbf6c140bf01f1af6ce832fc8901405e7c`

The persisted owner pack remains:

- pack: `Y62-OWNER-REFERENCE-PACK-V1`
- manifest SHA-256: `260a875ef1a787d477178faaa21e897a225a8113fa6d02cab73840e012fe0342`
- 9 owner reference records total.

SIDE still explicitly retains the required clean-side source gap. Nothing attempts to infer unsupported geometry.

## Regression / adversarial verification

New test: `tests/wf4-canonical-governance-dossier-alpha26.js`.

It proves:

1. all three canonical masters receive a persisted dossier;
2. dossier policy is `REFERENCE_BACKED_APPROVED_VISUALS_ONLY`;
3. dossier authority remains inspection-only / non-production;
4. F34 binds the exact owner pack, three required references, WF3 candidate checksum/handoff and all eight required review checks;
5. SIDE/R34 remain explicitly awaiting WF3 candidates;
6. SIDE source-gap blocker survives into reviewer intake;
7. explicit refresh cannot change master status, approval, binary, lineage or asset-version count;
8. dossier creation is audit logged without breaking the tamper-evident audit ledger;
9. mutating backing owner-reference governance makes the old dossier stale;
10. normal governance sync does **not** hide that staleness;
11. explicit refresh fingerprints the changed evidence and exposes its new blocker;
12. `sales` cannot refresh the dossier while `fitment` can; and
13. the staff Render Assets / Production Readiness surfaces load the shared dossier contract.

### Verification results

- targeted WF4 dossier regression: **PASS**
- complete Alpha 12 → Alpha 26 regression chain including Push 43 test: **PASS**
- `npm run check`: **PASS**
- WF5 governed production-promotion lifecycle: **PASS**
- JavaScript syntax sweep: **108 files / 0 failures**
- JSON parse sweep: **23 files / 0 failures**
- HTML local dependency sweep: **16 HTML files / 268 local references / 0 missing**
- `assets/` vs Push 42/Push 14 input package: **byte-for-byte identical**
- `references/` vs Push 42/Push 14 input package: **byte-for-byte identical**
- customer-critical `index.html`, `merged-app.js`, `app.js`, Y62/Ranger data, render manifest, visual contract, project store and share page: **byte-for-byte identical**

The browser/support adapters changed only to expose the same staff dossier action; customer behaviour remains governed by the existing exact-state resolver and production policy.

## WF5 integration status

The broader WF5 acceptance gate is still **red for one pre-existing non-WF4 defect only**:

- `WF1-BOM-ANYOF`: **FAIL** — unsatisfied `anyOfRequiredParts` dependency can be lost from saved project/quote gates.
- `WF4-DIRECT-PRODUCTION-REVIEW`: **PASS**.
- `WF5-CUSTOMER-DRAFT-ISOLATION`: **PASS**.

Push 43 does not expand into WF1 to fix that defect because this run is intentionally restricted to one WF4 package.

## Production-safety statement

No Y62 visual was promoted. No owner reference became production-eligible. No immutable production version was staged. No master approval was granted. No production pointer was moved.

`Y62-F34-V1-MASTER` remains `candidate` / `master-draft`; `Y62-F34-V1-CANDIDATE-02` remains upstream-returned and non-production.

## Next dependency

The primary WF4 dependency remains **A26-WF4-14B**: WF3 must supply the first genuinely clean/reviewable `Y62-F34-V1` candidate with clean isolation/reconstruction, locked overlay + camera acceptance, production-binary rights provenance and identified reviewer evidence.

Once that arrives, WF4 can run the real persisted chain end-to-end:

**owner reference pack → current reviewer dossier / WF3 handoff → canonical review contract → identified reviewer → immutable production promotion → sealed audit → project/quote inspection**.
