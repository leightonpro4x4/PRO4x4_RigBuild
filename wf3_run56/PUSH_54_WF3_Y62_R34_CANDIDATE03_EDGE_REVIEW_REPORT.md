# PRO4X4 Rig Builder — Alpha 26 — WF3 Push 54
## Y62-R34-V1 Candidate 03 Exact-Checksum Edge Review

**Package:** `Y62-R34-V1-CANDIDATE03-EDGE-REVIEW-01`  
**Policy:** `REFERENCE_BACKED_APPROVED_VISUALS_ONLY`  
**Vehicle:** 2025 Nissan Patrol Y62 Series 5 Warrior  
**View:** `Y62-R34-V1` / rear three-quarter  
**Production promotion:** **NO**

## Priority decision

`Y62-F34-V1-CANDIDATE-05` remains the first WF3 production dependency, but its professional reconstruction binary and completed provenance/production-rights intake are still absent. SIDE remains source-gap blocked. The highest-priority executable unfinished package was therefore the fresh identified exact-checksum edge review already required for `Y62-R34-V1-CANDIDATE-03`.

No new vehicle candidate was fabricated in this push. Candidate 03 itself remains byte-identical.

## Concrete progress

Reviewed exact checksum **`1260362df7d22c70dafbfd3deba3f767150496093fdaeb8178b826e0470fd6b7`** against the owner-supplied 2025 Series 5 Y62 Warrior evidence, led by `OWNER-Y62-REAR34-01 / IMG_4540.jpeg`.

Created:

- Review package: `Y62-R34-V1-CANDIDATE03-EDGE-REVIEW-01`
- Evidence board: `assets/y62-canonical-candidates/Y62-R34-V1-candidate-03-edge-review-v01.png`
- Evidence-board SHA-256: `b386fe73a73805ec29e1f7a9cec6dc870f04e785fff90b4e44bd5aa8f4319a74`
- Review manifest: `assets/y62-canonical-candidates/Y62-R34-V1-candidate-03-edge-review-v01.json`
- Review-manifest SHA-256: `caf4cd3bb1d1ff050bdecd178dfd8a99d593676c8846466b45bdf873e58d8e7c`
- Reviewer: `OPENAI-WF3-VISUAL-QA-03`
- Reviewer authority: edge review / return + constrained alpha-cleanup authorisation only; **no master or production-pass authority**

## Exact-checksum review result

Candidate 03's inward antialiasing materially improves the prior binary edge. Its current alpha structure is:

- Canvas: **1672 × 615 RGBA**
- Nonzero support: **119,584 px**
- Opaque: **117,683 px**
- Semi-transparent: **1,901 px**
- Transparent: **908,696 px**
- Alpha levels: `[0, 142, 198, 255]`
- Support added versus Candidate 02: **0 px**
- Support removed versus Candidate 02: **0 px**

### PASS

- Exact candidate checksum / owner-camera lineage.
- No guessed, warped or synthetic geometry.
- Antialias improvement: 1,901 boundary pixels are now semi-transparent without outward alpha support.
- Roof / spoiler contour: materially smoother and does not introduce unsupported outward silhouette.
- Tow / lower-bumper contour: reviewable after antialiasing; no separate geometry addition is required at this stage.

### RETURN

- **Mirror / front-side boundary:** photographed foliage/background remains visibly inside the alpha support immediately behind and around the near-side mirror.
- **Wheel / underbody boundary:** a material photographed road/ground patch remains attached below the running-board/rear-wheel region, including a clearly visible residual cut.

These are owner-source scene pixels, not Y62 geometry. Their removal can therefore be authorised without inventing missing vehicle shape, provided the next operation is strictly alpha-subtractive and limited to the evidenced residue zones.

### Still FAIL / HOLD

- Clean neutral reconstruction: **FAIL** — photographed environment reflections remain in the body/glass RGB and this review does not authorise guessed repainting.
- F34 family alignment: **HOLD** — accepted F34 canonical master remains pending Candidate 05.
- Production-binary rights: **HOLD**.
- Master approval / WF5: **HOLD**.

## Review decision

**`return-targeted-alpha-residue-cleanup-before-neutral-reconstruction`**

R34 state advances from `candidate03-edge-review-required` to **`candidate03-edge-returned-targeted-cleanup`**.

The next R34 cleanup, if reached before F34 Candidate 05 arrives, is constrained to:

- alpha subtraction only;
- the two owner-evidenced source-residue zones only;
- no outward alpha support;
- no RGB repaint or neutralisation;
- no perspective warp or non-uniform scale;
- no synthetic/generative geometry;
- do not remove uncertain vehicle pixels.

`cameraGeometryMatched:false`, `productionEligible:false`, master approval and customer exposure all remain unchanged.

## Governance integration

Updated the R34 candidate registry, camera profile, readiness matrix and WF3 workflow board to point to this exact-checksum review result. The internal canonical-review page now includes the review board. Customer-facing entrypoints/resolvers do not reference the review package or its staff evidence board.

External exact-vehicle images/3D remain reference-only unless source-specific production rights are separately recorded. No external exact-vehicle production pixels were introduced.

## Verification

- Deterministic review-board/manifest regeneration: **PASS**.
- Full `npm test`: **PASS**.
- `npm run check`: **PASS**.
- JavaScript syntax validation: **128 files / 0 failures**.
- JSON parse validation: **33 files / 0 failures**.
- HTML/local dependency scan: **16 HTML files / 250 local references / 0 missing**.
- Owner reference pack hashes: **9/9 verified**.
- F34 Candidate 04 remains byte-identical: `bab5e059a6da3a4b7455777c9e23e593ed851fcedb709d44e10bbe54847b6bd1`.
- R34 Candidate 03 remains byte-identical: `1260362df7d22c70dafbfd3deba3f767150496093fdaeb8178b826e0470fd6b7`.
- Review board SHA-256: `b386fe73a73805ec29e1f7a9cec6dc870f04e785fff90b4e44bd5aa8f4319a74`.
- Review manifest SHA-256: `caf4cd3bb1d1ff050bdecd178dfd8a99d593676c8846466b45bdf873e58d8e7c`.

## Next dependency

**F34 remains first:** receive professionally reconstructed `Y62-F34-V1-CANDIDATE-05` plus completed retoucher/provenance/production-rights intake, then run the prepared deterministic intake, camera-transfer and exact-checksum review pipeline.

If F34 Candidate 05 is still unavailable, the next legitimate R34 package is checksum-new **`Y62-R34-V1-CANDIDATE-04` targeted alpha-subtractive residue cleanup** in the two exact owner-evidenced zones above. It must then receive a fresh exact-checksum edge review before any clean neutral/professional reconstruction. Production remains blocked behind accepted F34-family alignment, production-binary rights, master approval and WF5.
