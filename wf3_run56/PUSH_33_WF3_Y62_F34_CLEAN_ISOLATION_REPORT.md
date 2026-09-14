# PRO4X4 Rig Builder — Alpha 26 WF3 Y62 Visual Production Push 33

## Package advanced
**A26-WF3-03 / F34 — `Y62-F34-V1-CANDIDATE-03` clean alpha-isolation review package**

## Concrete progress
- Advanced only the highest-priority unfinished WF3 package: the first F34 canonical master path.
- Produced `Y62-F34-V1-CANDIDATE-03` from Candidate 02 with a strictly non-generative alpha-only cleanup workflow.
- Retained owner-source RGB geometry is byte-identical wherever Candidate 03 remains visible; no repaint, perspective warp, body reconstruction, wheel replacement, stance change or accessory geometry was introduced.
- Removed **12,138** edge-attached pixels from Candidate 02 (**3.8396%** of its non-zero alpha mask) and added **0** new foreground pixels.
- Removed the obvious roll-door / floor boundary contamination that caused Candidate 02's clean-isolation failure.
- Added a deterministic build script and independent verification script so the exact candidate can be regenerated and checked.
- Added a mask-delta evidence image showing removed alpha coverage only.
- Added Candidate 03 to immutable candidate history while preserving Candidates 01 and 02 as prior review evidence.
- Bound Candidate 03 to locked camera profile `Y62-F34-V1` as `master-draft`, `cameraMatched:false`, `productionEligible:false`.
- Updated the Y62 readiness matrix and staff canonical review page to reflect the new state.

## Geometry / overlay precheck
A source-space feature-alignment precheck was run against primary owner reference `OWNER-Y62-F34-01` / `IMG_4030.jpeg`.

- good feature matches: **1,104**
- RANSAC inliers: **1,082**
- inlier ratio: **98.007%**
- uniform scale: **0.7278773324**
- rotation: **-0.00318°**
- residual mean: **0.165 px**
- residual P95: **0.584 px**
- residual max: **1.518 px**

This is evidence that the candidate has not drifted geometrically from the owner source. It is **not** a substitute for identified reviewer approval under `Y62-F34-V1-OVERLAY-01`; `cameraMatched` therefore remains false.

## Review outcome
**Returned to WF3 — not promotable.**

Now passing / materially advanced:
- exact MY25 Series 5 Warrior identity;
- genuine Warrior/Premcar stance;
- factory Warrior wheel/tyre source pixels;
- 1672 × 615 locked canvas;
- verified PNG alpha capability;
- clean-isolation automated precheck;
- source-space geometry overlay precheck;
- no invented accessories or synthetic vehicle geometry.

Still blocking production:
- final compositing-edge quality has not been signed by an identified reviewer;
- photographed body reflections/source-scene appearance remain, so Candidate 03 is still a photo-derived isolation rather than a neutral canonical reconstruction;
- direct production-binary rights for customer use of the photo-derived pixels are not separately recorded;
- reviewer `master-approved` state and `cameraGeometry.matched:true` are not recorded;
- WF5 has not run the promotion gate on this exact checksum.

The customer resolver remains unchanged. Candidate 03 is not referenced by the customer page and remains prohibited for quotes, product overlays, production catalogue output or fallback imagery.

## Verification evidence
- Candidate SHA-256: `67fae4a0bec8ab714a852a8841e8ca5610cdb32fbf58506900e3fd1ec28bb64e`.
- Independent image verifier confirms:
  - retained RGB exact match: **true**;
  - new foreground pixels: **0**;
  - removed pixels: **12,138**;
  - source-space overlay P95 residual: **0.584 px**.
- Server asset inspector confirms PNG, 1672 × 615 and verified transparency.
- Targeted Candidate 03 regression confirms candidate history, provenance, overlay precheck, non-promotion state, camera binding, readiness blockers and customer non-exposure.
- Full Alpha regression chain passes.

## Next WF3 dependency
Resolve the production-use route without weakening authenticity: either complete a rights-cleared professional retouch/reconstruction that neutralises photographed scene reflections **without inventing geometry**, or separately record explicit direct production rights for the owner-photo-derived binary. Then obtain identified reviewer edge/camera approval against `Y62-F34-V1-OVERLAY-01` and submit this exact checksum (or the rights-cleared successor checksum) to WF5. SIDE and R34 remain queued behind the F34 gate.
