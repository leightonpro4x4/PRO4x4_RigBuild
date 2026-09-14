# PRO4X4 Rig Builder — Alpha 26 Implementation Board

## Programme goal
Establish the 2025 Series 5 Nissan Y62 Patrol Warrior as the first **canonical master vehicle** while continuing Ranger catalogue/fitment scale and customer configurator improvements in parallel.

## Governing visual rule
The old shorthand `NO_FAKE_RENDER_LAYERS` is refined, not weakened:

> **REFERENCE_BACKED_APPROVED_VISUALS_ONLY** — no customer-facing vehicle master or accessory layer may be treated as production-ready unless its source references, identity, intended use, review state and approval are recorded. Third-party photos may be used as reference evidence only unless separate usage rights permit production use.

This explicitly allows a canonical render derived from genuine source material while preventing guessed, unreviewed or misleading imagery from appearing as verified.

## Alpha 26 package sequence

### A26-WF3-01 — Y62 Reference Pack Lock
**Owner:** WF3  
**Priority:** Critical  
**Inputs:** owner-supplied 2025 Series 5 Y62 Warrior photos; exact-vehicle third-party references where useful.  
**Tasks:**
- Register owner-supplied images as primary authenticity references.
- Record owner approval/use basis for internal PRO4X4 Rig Builder reference and canonical-render development.
- Classify external Carsales/dealer/Nissan images as `reference-only` unless explicit production rights exist.
- Build an angle inventory: F34, SIDE, R34, FRONT, REAR, wheel detail, Warrior trim detail.
- Record geometry gaps rather than inventing them.

**Acceptance:** reference pack is provenance-logged; exact trim/year/body/wheel state is verified; no external reference is promoted as a production layer.

### A26-WF3-02 — Canonical View Briefs
**Owner:** WF3  
**Depends on:** A26-WF3-01  
**Tasks:**
- Lock camera/framing specifications for `Y62-F34-V1`, `Y62-SIDE-V1`, `Y62-R34-V1`.
- Define stance, wheel direction, crop, canvas, light direction, background/isolation and tolerance rules.
- Define support views `Y62-FRONT-V1` and `Y62-REAR-V1` as optional but governed.

**Acceptance:** each canonical view has a versioned brief and measurable review criteria.

### A26-WF4-01 — Visual Governance Registry v2
**Owner:** WF4  
**Can run in parallel with:** A26-WF3-01  
**Tasks:**
- Extend the asset model with: `reference-only`, `reference-approved`, `brief-approved`, `master-draft`, `master-approved`, `layer-draft`, `layer-approved`, `held`, `blocked`, `production-live`.
- Add source/provenance, usage basis, reviewer, review timestamp, supported vehicle, supported view, product/SKU linkage and revision history.
- Keep canonical masters distinct from raw reference photos and accessory layers.

**Acceptance:** staff can distinguish evidence, draft masters, approved masters and product layers without ambiguity.

**Status — Push 50 / WF4-22:** persisted canonical reviewer decision envelope added on the shared visual registry. An identified assigned fitment/admin reviewer can now record `approved` or `returned` against the exact WF3 candidate checksum, canonical contract, owner-reference snapshots and reviewer-assignment evidence. The SHA-256-addressed decision is protected governance metadata, is visible in Render Assets and Production Readiness, becomes stale on evidence drift, and remains explicitly non-promotional. Canonical production approval now requires a current `approved` decision whose candidate checksum matches the binary under review.

**Status — Push 52 / WF4-24:** persisted canonical master-set registry added on the same render-asset backbone. F34, SIDE and R34 now share one SHA-256-addressed vehicle-level truth index binding the exact reference-pack manifest, per-view reference snapshots/provenance freshness, canonical contracts, WF3 handoffs, reviewer workflow/decision, readiness, governance attention and production-seal state. The index is system-write-protected, inspection-only, visible in Render Assets and Production Readiness, and becomes stale on evidence drift without granting approval or production eligibility.

**Status — Push 53 / WF4-25:** persisted reference review decision boundary added to reference/provenance intake. New evidence can only enter as `reference-only`; source/rights attestation and reference approval are now separate dedicated actions. Every approved reference carries an evidence-bound SHA-256 review decision, generic render-asset editing cannot forge governance/approval identity, changed attested evidence invalidates prior approval pending re-review, and unchanged re-attestation is non-destructive. Owner reference-pack integrity and the vehicle canonical master-set truth index now require a current APPROVED reference decision. Existing owner-source approvals are migrated explicitly from their persisted intake evidence and remain non-production.

**Status — Push 54 / WF4-26:** persisted canonical view-contract registry added to the same render-asset backbone. Each F34/SIDE/R34 canonical master now carries SHA-256-addressed evidence binding the static canonical brief, persisted view contract, camera-profile geometry/output-canvas state and owner-reference pack. F34 is `LOCKED`; SIDE and R34 remain `CALIBRATION` and fail closed for production. The contract is system-write-protected, inspection/evidence-only, visible in Render Assets, Production Readiness and the vehicle master-set truth index, and becomes stale/invalid on contract drift or tampering without promoting any visual.

**Status — Push 55 / WF4-27:** persisted canonical reference-coverage registry added on the same backbone. Each governed master now carries deterministic per-view evidence over the exact owner references, checksum/pack binding, provenance attestation and reference-review state. F34 and R34 are complete; SIDE remains `blocked-source-gap` because the required clean square-on geometry source is still absent. Coverage is protected, evidence-only and staff-visible.

**Status — Push 56 / WF4-28:** persisted canonical source-gap resolution boundary added. Required geometry gaps can no longer be approved through generic canonical-review metadata. SIDE now carries a dedicated SHA-256-addressed `OPEN` decision bound to its declared gap, exact required owner-reference snapshots and view/pack evidence. Only fitment/admin may record `APPROVED` or `RETURNED` through the dedicated workflow; reviewed-reconstruction approval additionally requires a CURRENT/LOCKED view contract, checksum-identified WF3 candidate ready for WF4 review, claimed reviewer and camera match. Generic edits are blocked/audited, evidence drift stales explicit decisions, and sync never silently rewrites an explicit reviewer decision. Staff visibility is present in Render Assets, Production Readiness and the master-set truth index.

**Status — Push 57 / WF4-29:** persisted canonical reviewer-claim integrity added to the existing reviewer workflow. Every active claim now carries a deterministic claim ID/SHA-256 envelope bound to the exact canonical master/brief, workflow evidence binding, candidate checksum and reviewer identity/time. Same-reviewer retry is idempotent, stale release requests fail with `review_claim_conflict`, evidence/schema drift invalidates a legacy or changed claim during governance refresh, and canonical review decisions/production seals bind the exact claim envelope rather than reviewer display strings alone. Render Assets and Production Readiness expose claim integrity and SHA evidence; the claim remains `review-claim-only`, `productionEligible: false`.

### A26-WF2-01 — Product Visual-Readiness Contract
**Owner:** WF2  
**Can run in parallel with:** WF3/WF4  
**Tasks:**
- Add `visualisable`, `supportedViews`, `visualLayerRequired`, `visualStatus`, `referenceAvailable`, `fitmentConfidence` to governed product records.
- Preserve unknown/engineering-review states rather than infer visual coverage.
- Apply the fields to the existing Ranger slice and Y62 product families.

**Acceptance:** every governed product can state whether it is priced-only, fitment-ready, visually-ready or staff-review required.

### A26-WF1-01 — Customer Product Navigation + Visual State UX
**Owner:** WF1  
**Can run in parallel with:** WF2/WF3/WF4  
**Tasks:**
- Complete category → manufacturer/vendor → product accordions.
- Show dependency/conflict explanations before ADD.
- Show visual state labels: `Visual preview available`, `Priced / preview pending`, `Staff fitment review`.
- Never substitute unrelated imagery when a canonical view/layer is unavailable.

**Acceptance:** customer understands both compatibility and visual coverage before selection.

### A26-WF3-03 — Canonical Y62 Master Set
**Owner:** WF3  
**Depends on:** A26-WF3-02 + WF4 registry states  
**Tasks:**
- Produce reference-backed F34, SIDE and R34 canonical masters.
- Compare body shape, Warrior trim, wheels/tyres, stance and visible factory details against the locked reference pack.
- Submit each master independently for approval.

**Acceptance:** all three views are `master-approved`; no guessed accessory or unsupported trim detail is present.

### A26-WF4-02 — Layer Approval + Composite Eligibility
**Owner:** WF4  
**Depends on:** A26-WF4-01  
**Tasks:**
- Add product-layer linkage by SKU/family + vehicle + view.
- Add composite eligibility rules so only `master-approved` + `layer-approved` assets can produce a production preview.
- Preserve exact missing/blocked behavior when a layer is not approved.

**Acceptance:** approval state, not filename presence, controls production eligibility.

**Status — Push 45 / WF4-17:** shared-runtime implementation complete. Nineteen governed non-base Y62 visual records now persist exact canonical-master/SKU/view composite bindings; the production resolver fails closed on missing base approval, layer approval or binding integrity. Real production proof remains dependent on the first clean approved F34 master and exact approved accessory layer.

### A26-WF5-01 — Visual Governance Regression Gate
**Owner:** WF5  
**Depends on:** candidate packages from WF1–WF4  
**Tests:**
- `reference-only` cannot render to a customer.
- `master-draft` cannot render to a customer.
- `layer-draft` cannot render to a customer.
- approved canonical master can render without accessory layers.
- product selected with no approved layer is shown as priced/fitment state without fake visual substitution.
- quote/project revision remains consistent with the visual state shown.
- existing immutable project/share/quote behavior remains green.

**Acceptance:** complete Alpha regression suite passes and only then is Alpha 26 promoted.

## First accessory proof after master approval
Once the Y62 master set is approved, onboard one product family end-to-end before scaling:
1. Exact bullbar or front-bar SKU/family with verified reference geometry.
2. F34 layer first.
3. Product/fitment dependency record linked.
4. Layer review.
5. Customer composite preview.
6. Saved build → share → quote lineage check.

This proves the full visual pipeline before dozens of product layers are commissioned.

## Parallel execution map
| Lane | Immediate package | May run now? | Main blocker |
|---|---|---:|---|
| WF1 | A26-WF1-01 | Yes | visual state contract interface only |
| WF2 | A26-WF2-01 | Yes | source-backed product data |
| WF3 | A26-WF3-01 | Yes | side-view geometry quality for final SIDE master |
| WF4 | A26-WF4-01 | Yes | none |
| WF5 | A26-WF5-01 test scaffolding | Yes | final assertions wait for candidate packages |

## Alpha 26 promotion gate
Alpha 26 is not complete merely because the master render looks good. Promotion requires:
- WF1 customer status UX passed.
- WF2 visual-readiness schema populated for target records.
- WF3 reference pack + canonical briefs + minimum approved master view(s) passed.
- WF4 governance prevents unapproved assets from production output.
- WF5 full regression passes.

## Alpha 27 likely follow-on
- Complete all Y62 canonical views if Alpha 26 promotes with a staged subset.
- First approved accessory family across supported views.
- Product-layer batching process.
- Additional paint-state strategy based on canonical master, without pretending colour variants are photographed originals.
