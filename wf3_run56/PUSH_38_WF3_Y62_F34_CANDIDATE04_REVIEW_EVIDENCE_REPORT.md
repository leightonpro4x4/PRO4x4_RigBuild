# PRO4X4 Rig Builder — Alpha 26 WF3 Push 38
## Y62-F34-V1 Candidate 04 — exact-checksum overlay + reviewer evidence regeneration

### Scope
Advanced **one WF3 package only**: the current-checksum review evidence for `Y62-F34-V1-CANDIDATE-04`.

No customer UX, catalogue/fitment data, backend feature, product-layer geometry, SIDE master, R34 master, or production promotion was advanced.

### Concrete progress
- Preserved the Candidate 04 binary unchanged:
  - `assets/y62-canonical-candidates/Y62-F34-V1-neutral-reconstruction-v04.png`
  - `1672 × 615` transparent PNG
  - SHA-256 `bab5e059a6da3a4b7455777c9e23e593ed851fcedb709d44e10bbe54847b6bd1`
  - governance remains `master-draft`
  - `productionEligible:false`
- Regenerated the locked F34 overlay evidence against **Candidate 04 exact checksum** as `Y62-F34-V1-OVERLAY-EVIDENCE-02`.
- The overlay uses the owner-supplied 2025 Series 5 Y62 Warrior pack as the authenticity chain, with `OWNER-Y62-F34-01 / IMG_4030.jpeg` as the primary registration source.
- Exact-checksum overlay machine precheck:
  - **1,101** good SIFT matches;
  - **1,075** RANSAC inliers;
  - **97.6385%** inlier ratio;
  - **0.1728 px** mean residual;
  - **0.6549 px** P95 residual;
  - **1.5439 px** maximum residual;
  - uniform scale `0.7278808323`;
  - rotation `-0.003854°`;
  - alpha remains **303,988 non-zero pixels**, one connected vehicle component, and no canvas-boundary contact.
- Created the current Candidate 04 overlay evidence board:
  - `assets/y62-canonical-candidates/Y62-F34-V1-candidate-04-overlay-evidence-v02.png`
  - SHA-256 `6b53745a23aaaedaf18d6f476381e0ff7192438e99d5dab7b556a7ff4d4afd96`.
- Created the current Candidate 04 identified-reviewer packet `Y62-F34-V1-REVIEWER-SIGNOFF-02` against four owner references:
  - `OWNER-Y62-F34-01`
  - `OWNER-Y62-F34-02`
  - `OWNER-Y62-FRONT-01`
  - `OWNER-Y62-FRONT-02`
- Reviewer packet artifact:
  - `assets/y62-canonical-candidates/Y62-F34-V1-candidate-04-reviewer-signoff-pack-v02.png`
  - SHA-256 `045c9891828df526e8336f13aab7428952d0b687e89aa0c63357482bdf759fab`.
- The reviewer packet is deliberately **unsigned**:
  - `reviewerId:null`
  - `reviewedAt:null`
  - `decision:pending`
  - `cameraGeometryMatched:false`
  - `masterState:master-draft`.
- Updated Candidate 04 governance/readiness from `candidate-review-ready` to **`reviewer-signoff-ready`**.
- Updated the locked F34 camera profile from `pending-regeneration` to **`ready-for-identified-review`** and attached the exact-checksum Candidate 04 evidence while retaining Candidate 03 evidence as immutable historical lineage.
- Updated staff review visibility so the current Candidate 04 overlay and reviewer packet are clearly separated from historical Candidate 03 evidence.

### Governance result
`REFERENCE_BACKED_APPROVED_VISUALS_ONLY` remains intact.

The new machine evidence is **not** a production approval. It proves that Candidate 04 still registers tightly to the primary owner reference and that its transparency structure is stable, but semantic camera/identity/edge approval remains an identified-human-review gate.

Candidate 04 remains:
- `master-draft`;
- `cameraGeometryMatched:false`;
- `productionEligible:false`;
- unavailable to customer resolver / quote imagery / product-layer compositing / production catalogue.

No external exact-vehicle image contributes production pixels or production approval evidence.

The remaining photographed reflection/detail residue is still explicitly held for reviewer disposition. The retouch envelope has **not** been widened and no unsupported geometry has been invented.

### Verification
- New targeted test `tests/wf3-y62-f34-candidate04-review-evidence-alpha26.js`: **PASS**.
- Historical Candidate 02 / Candidate 03 / overlay / reviewer / neutral-reconstruction regressions remain **PASS** after being updated to distinguish historical evidence from current Candidate 04 evidence.
- Full Alpha regression chain via `npm test`: **PASS**.
- `npm run check`: **PASS**.
- JavaScript syntax: **96 files / PASS**.
- JSON parsing: **16 files / PASS**.
- HTML/local dependency scan: **15 HTML files / 242 local references / 0 missing**.
- Deterministic overlay regeneration: **PASS**, artifact SHA remained `6b53745a23aaaedaf18d6f476381e0ff7192438e99d5dab7b556a7ff4d4afd96`.
- Deterministic reviewer-packet regeneration: **PASS**, artifact SHA remained `045c9891828df526e8336f13aab7428952d0b687e89aa0c63357482bdf759fab`.
- Customer entrypoint regression confirms the new evidence IDs, reviewer packet and staff artifacts are not exposed to customer production.

### Next dependency
Complete **identified reviewer signoff on `Y62-F34-V1-REVIEWER-SIGNOFF-02`** for Candidate 04 exact checksum.

If the reviewer returns the remaining photographed reflection/detail residue, do **not** widen the retouch envelope or infer/repaint unsupported geometry. Route F34 through a rights-cleared professional reconstruction path or keep Candidate 04 review-only.

If the reviewer accepts Candidate 04, separately record production-binary rights before any `master-approved` transition and then hand the exact checksum to WF5 for promotion gating.

SIDE remains queued because the owner pack does not yet provide the required clean square-on source. R34 remains queued behind the accepted F34 canonical family.
