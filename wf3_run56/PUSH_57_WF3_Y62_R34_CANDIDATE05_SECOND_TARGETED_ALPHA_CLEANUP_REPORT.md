# PRO4X4 Rig Builder — WF3 Push 57
## Y62 R34 Candidate 05 Second Targeted Alpha Cleanup

**Package advanced:** `Y62-R34-V1-CANDIDATE05-SECOND-TARGETED-ALPHA-CLEANUP-01`  
**Policy:** `REFERENCE_BACKED_APPROVED_VISUALS_ONLY`  
**Production promotion:** **NO**

## Priority decision
`Y62-F34-V1-CANDIDATE-05` remains the first WF3 production dependency, but the actual professionally reconstructed F34 Candidate 05 binary plus completed retoucher/provenance/production-rights intake are still absent. The existing F34 Candidate 05 PNGs are governance/review-pipeline boards only, not the professional reconstruction binary. `Y62-SIDE-V1` remains source-gap blocked.

The highest-priority executable package was therefore the exact R34 follow-on already authorised by `Y62-R34-V1-CANDIDATE04-EDGE-REVIEW-01`: a checksum-new, second targeted **alpha-subtractive** cleanup of the two residual owner-evidenced source-scene zones.

## Concrete progress
Created:

- Candidate: `Y62-R34-V1-CANDIDATE-05`
- Binary: `assets/y62-canonical-candidates/Y62-R34-V1-transparent-isolation-v05.png`
- SHA-256: `bb5de7a857d4cab02095678bed816e66520faf606c27a2b7b2cc34bd7cba54af`
- Canvas: `1672 × 615 RGBA`
- Mask SHA-256: `91aedcb94de4727a560af9d461cbe8a0f220088a909a28b84bea012318abee2f`
- Governance: `master-draft`
- `cameraMatched:false`
- `productionEligible:false`

Primary authenticity/camera/RGB authority remains the owner-supplied `OWNER-Y62-REAR34-01 / IMG_4540.jpeg`, checksum `747c9edf7b39fca2cb9fa9dde0bf329cdbec8dc2c08643d873317b50c27d28e2`.

### Exact lineage
Candidate 05 is pinned to:

- exact Candidate 04 checksum: `b81f9fbd476db73dc87bdabd80427eb8441ea2db2223fda8421cee51a859cc18`
- Candidate 04 generation manifest: `a9e44c975f7feacabdfab8324ed390595e088001960ec1809368606ca7b4701c`
- authorising exact-checksum edge review: `Y62-R34-V1-CANDIDATE04-EDGE-REVIEW-01`
- authorising review manifest SHA-256: `775dd37da1e6bdfb1d288a160458c9e73f37c091e6e603cad414ade156691bd3`

### Authorised edits only
The second cleanup touched alpha only in the two regions returned by the exact Candidate 04 review:

1. unambiguous photographed foliage/background and pole residue left/above the near-side mirror and between mirror/A-pillar, conservatively inset from uncertain mirror/body/A-pillar pixels; and
2. unambiguous photographed road/kerb and source-ground residue beneath the running-board zone and left of the owner-visible tyre edge, conservatively inset from tyre/mudflap/underbody uncertainty.

No body, glass, wheel, tyre, mirror, bumper or other Y62 geometry was generated or repainted. Uncertain pixels were retained rather than guessed away.

## Measured transformation
Candidate 04 → Candidate 05:

- alpha-support pixels removed: **1,099**
- alpha-support pixels added: **0**
- alpha bytes changed: **1,099**
- alpha changes outside authorised zones: **0**
- retained visible pixels: **116,605**
- retained owner-source RGB exact fraction: **1.000000**
- RGB bytes changed: **0**
- semi-transparent pixels remaining: **1,920**
- current nonzero-alpha bbox: **[567, 118, 1024, 461]**
- perspective warp: **none**
- non-uniform scale: **none**
- synthetic/generative geometry: **none**
- external exact-vehicle production pixels: **none**

External exact-vehicle images/3D remain reference-only unless source-specific production rights are separately recorded. No external exact-vehicle pixels were introduced by this package.

## Review/readiness state
This package has **generation authority only**. It does not approve the isolation edge, camera geometry, master or production state.

R34 advances from:

`candidate04-edge-returned-second-targeted-cleanup`

to:

**`candidate05-edge-review-required`**

Current gating remains:

- edge acceptance: **HOLD — fresh exact-checksum Candidate 05 edge review required**
- clean neutral reconstruction: **FAIL — photographed body/glass environment/reflections intentionally remain untouched**
- F34 family alignment: **HOLD**
- production-binary rights: **HOLD**
- master approval / WF5: **HOLD**
- production eligibility: **FALSE**

No camera lock, production registry write, customer resolver exposure, canonical-master approval or WF5 promotion occurred.

## New governed artifacts
- Candidate 05 binary: `assets/y62-canonical-candidates/Y62-R34-V1-transparent-isolation-v05.png`
  - SHA-256: `bb5de7a857d4cab02095678bed816e66520faf606c27a2b7b2cc34bd7cba54af`
- Candidate 05 alpha mask: `assets/y62-canonical-candidates/Y62-R34-V1-candidate-05-alpha-mask-v01.png`
  - SHA-256: `91aedcb94de4727a560af9d461cbe8a0f220088a909a28b84bea012318abee2f`
- Preview: `assets/y62-canonical-candidates/Y62-R34-V1-transparent-isolation-v05-preview.jpg`
  - SHA-256: `2c8d57dd3af160a8724f20aed15550c61feb5c0c1e4e0180765e91a29de054dc`
- Evidence board: `assets/y62-canonical-candidates/Y62-R34-V1-candidate-05-second-targeted-alpha-cleanup-v01.png`
  - SHA-256: `79685f0f0965f94a7fd493d60b2053c7f51e8d798bd73cef87685a9cc27c690b`
- Generation manifest: `assets/y62-canonical-candidates/Y62-R34-V1-candidate-05-second-targeted-alpha-cleanup-v01.json`
  - SHA-256: `b00da011dd51452626c4edbb342bb39207cfeef9f75bca74d3be039721e45785`
- Package module: `y62-r34-candidate05-second-targeted-alpha-cleanup.js`
- Deterministic builder: `tools/build-y62-r34-candidate05-second-targeted-alpha-cleanup.py`
- Regression: `tests/wf3-y62-r34-candidate05-second-targeted-alpha-cleanup-alpha26.js`

Readiness, camera-profile history, candidate history and workflow-board state were advanced only to the new **review-required** R34 state. Historical Candidate 04 review evidence remains intact.

## Verification
- full `npm test`: **PASS**
- `npm run check`: **PASS**
- JavaScript syntax: **134 files / 0 failures**
- JSON parse: **36 files / 0 failures**
- HTML: **16 files**
- local HTML references: **250 / 0 missing**
- owner-reference hashes: **9 / 9 verified**
- deterministic Candidate 05 regeneration: **PASS** — candidate/mask/preview/board/manifest aggregate hash identical before/after rebuild
- F34 Candidate 04 checksum unchanged: **PASS** — `bab5e059a6da3a4b7455777c9e23e593ed851fcedb709d44e10bbe54847b6bd1`
- actual professional F34 Candidate 05 binary present: **NO**
- customer-facing Candidate 05 exposure: **NONE**

## Next dependency
**F34 Candidate 05 remains first.** Receive the professionally reconstructed `Y62-F34-V1-CANDIDATE-05` binary plus completed retoucher/provenance/production-rights intake, then run the prepared deterministic F34 intake and exact-checksum review pipeline.

If that F34 binary is still unavailable at the next WF3 pass, the next legitimate R34 package is a **fresh identified exact-checksum edge review of `Y62-R34-V1-CANDIDATE-05`**. No clean-neutral/professional R34 reconstruction may begin until that review accepts the isolation boundary. Production remains additionally blocked behind accepted F34-family alignment, production-binary rights, canonical-master approval and WF5.
