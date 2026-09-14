# Push 54 — WF4 Persisted Canonical View Contract Registry

**Package:** A26-WF4-26  
**Workstream:** WF4 — Platform / Staff Tools  
**Policy:** `REFERENCE_BACKED_APPROVED_VISUALS_ONLY`  
**Scope:** one package only — persisted canonical-view brief/camera lock evidence and staff inspection.

## What advanced
WF4 now persists a deterministic `canonicalViewContract` on each governed Y62 canonical master using the existing `render_assets.payload_json` backbone. No second registry, service, persistence path or customer runtime was introduced.

Each contract is SHA-256 bound to the exact static canonical brief, the persisted canonical-view fields, the governed Y62 camera-profile geometry/output-canvas state, and the owner-reference pack identity. The record is explicitly `view-contract-evidence-only` and `productionEligible: false`; it cannot approve, promote or substitute visual artwork.

The existing governance write boundary now protects `canonicalViewContract`, so generic staff editing cannot rewrite the contract fingerprint, lock state or evidence basis. Contract drift returns `stale`; hash/authority tampering returns `invalid`. The render-readiness governance assessment consumes this evidence and fails closed when a contract is not current and locked.

## Governed Y62 state
All three canonical master slots persist current contracts:

| View | Contract state | Contract SHA-256 | Production effect |
|---|---|---|---|
| `Y62-F34-V1` | `locked` | `303bc938a957a99c703a78bf8b2a6c6f6e77464a919b1e41c834f7aac6d9e4e0` | view contract itself is clear; upstream candidate/reviewer/production gates remain blocked |
| `Y62-SIDE-V1` | `calibration` | `c048d68f7893e385ac76d22f040b4f42a72ae20e538764f3ae8d25dfaf428dae` | production blocked until camera/view contract is locked |
| `Y62-R34-V1` | `calibration` | `c8a0f27ee0154aa3051b891d5f3383793582f2f111d27ea5f1d97bb1e4525a9f` | production blocked until camera/view contract is locked |

F34's canonical brief and locked camera profile agree on the governed 1672×615 output canvas. SIDE retains its required source-geometry gap. The master-set truth index is current and now deliberately reports three open set-level problems: SIDE calibration, R34 calibration, and the retained SIDE geometry gap.

The owner evidence baseline is unchanged: 9 owner references, 9/9 current source/rights attestations, 9/9 current approved reference-review decisions, `Y62-OWNER-REFERENCE-PACK-V1` manifest `260a875ef1a787d477178faaa21e897a225a8113fa6d02cab73840e012fe0342`. F34 still points to `Y62-F34-V1-CANDIDATE-02` as `blocked-upstream`; SIDE/R34 remain `awaiting-wf3-candidate`. There are 0 canonical reviewer assignments, 0 approved canonical decisions, 0 production seals and 0 production-eligible Y62 visuals.

## Staff visibility
Render Assets now shows a dedicated **CANONICAL VIEW CONTRACT** block with freshness, lock/calibration state, contract/basis SHA-256, canonical brief source, camera profile/state, output canvas, reference-pack binding and any source/lock problems. Production Readiness exposes the same contract status and includes `CANONICAL VIEW CONTRACT` in production blockers. The vehicle canonical master-set registry also displays per-view contract freshness/state so staff can inspect the whole F34/SIDE/R34 truth set without opening separate evidence systems.

## Verification
Targeted canonical-view-contract regression: **PASS**. It verifies 3/3 persisted current contracts, F34 locked, SIDE/R34 calibration, exact brief/camera/pack binding, generic tamper rejection, evidence-drift staleness, hash-integrity failure, readiness consumption, cross-view master-set visibility and zero visual promotion.

Complete Alpha regression: **PASS**. `npm run check`: **PASS**. WF5 governed promotion lifecycle: **PASS**. Canonical production-seal regression: **PASS**.

WF5 acceptance remains red only for the pre-existing unrelated WF1 defect `WF1-BOM-ANYOF`. `WF4-DIRECT-PRODUCTION-REVIEW` and `WF5-CUSTOMER-DRAFT-ISOLATION` both remain **PASS**.

Static verification: 133 JavaScript files / 0 syntax failures; 56 JSON files / 0 parse failures; 16 HTML files / 299 local references / 0 missing. The complete `assets/` + `references/` trees remain 16/16 byte-for-byte unchanged from Push 53, and all 11 customer-critical presentation/data/render-contract files remain byte-identical. No visual, reference binary or customer production pointer changed.

## Next dependency
The primary next dependency remains **A26-WF4-14B / WF3**: supply the first genuinely clean, reviewable `Y62-F34-V1` candidate with clean reconstruction/isolation, locked overlay + camera acceptance, production-binary rights provenance and identified reviewer evidence. F34 can then exercise the real reviewer/approval/immutable-production chain against the now-persisted locked view contract. SIDE/R34 remain calibration-only until WF3 separately locks their camera/view profiles.
