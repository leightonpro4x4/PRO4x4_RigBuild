# PUSH 55 — WF4 Persisted Canonical Reference Coverage Registry

**Package:** A26-WF4-27  
**Lane:** WF4 — Platform / Staff Tools  
**Policy:** `REFERENCE_BACKED_APPROVED_VISUALS_ONLY`  
**Scope:** one package only — persisted canonical reference coverage / source-gap evidence controls

## Delivered

WF4 now persists a `canonicalReferenceCoverage` evidence record on every governed Y62 canonical master using the existing shared `render_assets` payload/backbone. The record gives staff a deterministic, per-view answer to which exact references currently support a canonical master and whether that evidence is still current enough to enter review/readiness.

Each SHA-256 coverage basis binds:

- canonical master / brief / view identity;
- active `Y62-OWNER-REFERENCE-PACK-V1` and manifest SHA-256;
- exact required reference IDs declared for that canonical view;
- each declared pack row and the currently registered reference record;
- declared checksum versus registered checksum;
- reference-pack binding and canonical-view declaration;
- source type, rights/licence state and non-production lock;
- provenance-attestation freshness and SHA-256;
- reference-review decision state/freshness and SHA-256; and
- explicit source gaps that apply to that canonical view.

The record has `authority: reference-coverage-evidence-only` and `productionEligible: false`. It does not approve a reference, approve a master, stage a version, create artwork or move a production pointer.

## Staff visibility

The same persisted coverage state is exposed in both WF4 staff surfaces:

- **Render Assets** — each canonical master shows coverage freshness/state, exact reference rows, checksum/pack/attestation/review status, coverage SHA and source gaps.
- **Production Readiness** — a vehicle-level Canonical Reference Coverage section shows complete, source-gap-blocked and evidence-blocked views, with exact per-view counts and evidence fingerprints.

The vehicle-level canonical master-set registry now carries the coverage status/freshness for F34, SIDE and R34 so staff can inspect canonical view contract + reference coverage + candidate/reviewer/production progression from one persisted truth index.

## Fail-closed behaviour

`canonicalReferenceCoverage` is protected by the existing system-managed governance write boundary. Generic render-asset editing cannot forge it.

A reference checksum, pack binding, attestation or review-decision change makes the persisted coverage stale. Governance sync recalculates the evidence from the existing reference records and surfaces the changed view as `blocked-evidence`; it never promotes or substitutes a visual. An explicit declared geometry/source gap remains visible even when every currently-declared supporting reference is otherwise current.

Render readiness now consumes the persisted coverage record and adds a `CANONICAL_REFERENCE_COVERAGE` blocker when coverage is stale, invalid or non-complete.

## Clean governed Y62 state

After clean governance sync:

- owner references: **9**;
- reference pack: `Y62-OWNER-REFERENCE-PACK-V1`;
- reference-pack manifest SHA-256: `260a875ef1a787d477178faaa21e897a225a8113fa6d02cab73840e012fe0342`;
- canonical masters: **3**;
- canonical reference coverage: **3/3 CURRENT**;
- complete views: **2**;
- source-gap-blocked views: **1**;
- evidence-blocked views: **0**;
- F34: **3/3 complete**, coverage SHA-256 `83689b01b235650a3dc2e341584071f2fdb39ed7f38c5f2d7be6ac6840e014ff`;
- R34: **2/2 complete**, coverage SHA-256 `523f1b50c7a8cded265cc1c6d482e9afb6c8aecb04947592c30d3ac8354cc3f7`;
- SIDE: **3/3 current/approved support references**, but `blocked-source-gap` with one required square-on side geometry/source gap retained; coverage SHA-256 `e5779d1a6cef6781f794cabcb8147712acabc9e57b7f15f0986f7d94f0f92b7b`;
- canonical master-set registry: **CURRENT**, with **4** explicit set-level problems (SIDE calibration, SIDE reference coverage source gap, SIDE required source geometry gap, R34 calibration);
- production-eligible Y62 visuals: **0**.

F34 remains `Y62-F34-V1-CANDIDATE-02 / blocked-upstream`; SIDE and R34 remain `awaiting-wf3-candidate`. No approval or production state was manufactured.

## Verification

- targeted `wf4-canonical-reference-coverage-registry-alpha26`: **PASS**;
- complete Alpha regression (`npm test`): **PASS**;
- `npm run check`: **PASS**;
- canonical production evidence seal regression: **PASS**;
- WF5 governed promotion lifecycle: **PASS**;
- WF5 acceptance gate: **expected RED only for pre-existing WF1 `WF1-BOM-ANYOF`**;
  - `WF4-DIRECT-PRODUCTION-REVIEW`: **PASS**;
  - `WF5-CUSTOMER-DRAFT-ISOLATION`: **PASS**.

Static verification:

- JavaScript: **135 files / 0 syntax failures**;
- JSON: **58 files / 0 parse failures**;
- HTML: **16 files / 301 local references / 0 missing**.

Byte identity against Push 54 input checkpoint:

- `assets/` + `references/`: **16/16 files unchanged**;
- checked customer-critical presentation/data/render-contract files: **11/11 unchanged**.

## Runtime/backbone constraint

No new database, runtime, registry service, customer fallback lane or duplicate approval path was introduced. Browser/local and hosted/server paths use the same coverage contract and the existing render-asset/audit persistence model.

## Next dependency

The primary delivery dependency remains **A26-WF4-14B / WF3**: the first genuinely clean, reviewable `Y62-F34-V1` candidate with clean reconstruction/isolation, locked overlay + camera acceptance, production-binary rights provenance and identified reviewer evidence.

That will let the real F34 chain move through: **review-approved owner evidence → exact per-view coverage → WF3 handoff → reviewer claim → canonical approval → immutable production seal → governed composite eligibility → sealed project/quote inspection**.

SIDE and R34 separately remain calibration/candidate dependent; SIDE additionally retains the declared source-geometry gap until supporting evidence is supplied and governed.
