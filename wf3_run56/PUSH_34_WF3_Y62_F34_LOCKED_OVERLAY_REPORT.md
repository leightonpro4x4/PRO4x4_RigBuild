# PRO4X4 Rig Builder — Alpha 26 WF3 Push 34
## Y62-F34-V1 locked overlay evidence package

### Scope
Advanced one WF3 package only: **Candidate 03 → reviewer-ready locked overlay evidence** for the first Y62-F34-V1 canonical master lane. No customer UX, catalogue data, product layers, backend production rules, SIDE, or R34 assets were advanced.

### Concrete progress
- Preserved the exact `Y62-F34-V1-CANDIDATE-03` vehicle binary unchanged at SHA-256 `67fae4a0bec8ab714a852a8841e8ca5610cdb32fbf58506900e3fd1ec28bb64e`.
- Added `Y62-F34-V1-OVERLAY-EVIDENCE-01`, a reproducible reviewer evidence bundle generated from the primary owner-supplied 2025 Series 5 Y62 Warrior reference `OWNER-Y62-F34-01 / IMG_4030.jpeg`.
- The bundle registers the owner source to Candidate 03 with SIFT + Lowe ratio + RANSAC partial affine for verification only; it does **not** rewrite candidate geometry or mark the camera matched.
- Machine alignment result: **1,104 good matches / 1,082 inliers / 98.01% inlier ratio** with **0.584 px P95** and **1.518 px max** residual.
- Transparency structure result: **303,988 non-zero alpha pixels**, **one connected foreground component**, **no canvas-boundary contact**, verified alpha range `0..255`.
- Added a checksum-pinned four-panel review board showing registered owner source, Candidate 03 on alpha, a 50/50 geometry overlay, and the candidate alpha edge plus sampled RANSAC inliers. Evidence PNG SHA-256: `522f7ac76841a023d0a1b5e3ae9da39d3f4747c59f9015f2e44a0b7c4e9ebaa1`.
- Updated the staff canonical review page, F34 camera profile, candidate review state, readiness matrix, and workflow board to `overlay-review-ready` while keeping `cameraGeometry.matched:false`, `master-draft`, and `productionEligible:false`.
- Added a targeted Alpha 26 regression proving the evidence artifact/checksum, machine metrics, reviewer-pending state, non-promotion, and non-exposure through the customer entry point.

### Governance result
`REFERENCE_BACKED_APPROVED_VISUALS_ONLY` remains intact.

Candidate 03 is **not production-approved**. The machine bundle is evidence for an identified reviewer, not an automatic semantic approval. The following remain blocking:
1. identified reviewer signoff for wheel centres, silhouette, roofline, bumper corner, headlamp anchor, identity/stance cross-check and compositing edge quality;
2. direct production-binary rights for photo-derived customer use **or** a rights-cleared neutral reconstruction that removes source-scene reflections without inventing geometry;
3. explicit `master-approved` promotion with reviewer identity/time and `cameraGeometry.matched:true` only after the above;
4. WF5 gate on the exact approved checksum.

External exact-vehicle images remain reference-only unless rights are separately recorded. No guessed geometry was added and no generated visual was promoted.

### Verification
- New `wf3-y62-f34-overlay-evidence-alpha26.js`: **PASS**.
- Full Alpha 12 → current Alpha 26 `npm test`: **PASS**.
- `npm run check`: **PASS**.
- JavaScript syntax: **87 files / PASS**.
- JSON parsing: **11 files / PASS**.
- HTML/local dependency scan: **15 HTML files / 238 local references / 0 missing**.
- Overlay evidence regeneration is deterministic: pre/post SHA-256 both `522f7ac76841a023d0a1b5e3ae9da39d3f4747c59f9015f2e44a0b7c4e9ebaa1`.
- Push 33 → Push 34 diff: 10 existing files changed, 5 files added, 0 removed. Changes are confined to WF3 review/evidence metadata, tests, package metadata and the staff review surface.

### Next dependency
Use `Y62-F34-V1-OVERLAY-EVIDENCE-01` for identified reviewer semantic/camera/edge signoff against the primary and supporting owner references. In parallel, resolve the production-rights route: either record explicit rights for direct photo-derived production use or produce a rights-cleared neutral reconstruction without inventing geometry. Only then can the F34 candidate be promoted and handed to WF5; SIDE and R34 remain queued behind F34.
