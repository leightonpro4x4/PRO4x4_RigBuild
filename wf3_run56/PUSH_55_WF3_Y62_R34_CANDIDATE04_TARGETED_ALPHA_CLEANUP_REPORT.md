# PRO4X4 Rig Builder — WF3 Push 55
## Y62 R34 Candidate 04 Targeted Alpha Residue Cleanup

**Package advanced:** `Y62-R34-V1-CANDIDATE04-TARGETED-ALPHA-CLEANUP-01`  
**Policy:** `REFERENCE_BACKED_APPROVED_VISUALS_ONLY`  
**Production promotion:** **NO**

## Priority decision
`Y62-F34-V1-CANDIDATE-05` remains the first WF3 production dependency, but the professional reconstruction binary and completed provenance/production-rights intake are still absent. `Y62-SIDE-V1` remains blocked by the lack of a clean square-on owner source or separately rights-cleared measured reconstruction. The highest-priority executable package was therefore the already-authorised R34 Candidate 04 targeted alpha cleanup.

## Concrete progress
Created checksum-new `Y62-R34-V1-CANDIDATE-04` from exact-checksum Candidate 03 under `Y62-R34-V1-CANDIDATE03-EDGE-REVIEW-01` authority.

The edit is deliberately restricted to the two owner-evidenced source-scene residue zones already returned by the Candidate 03 edge review:

1. near-side mirror/front-side photographed foliage/background residue; and
2. running-board/rear-wheel underbody photographed road/ground residue.

The operation is **alpha-subtractive only**. No previously transparent pixel was made visible; no RGB byte was repainted; no perspective warp, non-uniform scale, synthetic geometry or external exact-vehicle production pixel was introduced.

### Candidate 04 binary
- Candidate: `assets/y62-canonical-candidates/Y62-R34-V1-transparent-isolation-v04.png`
- SHA-256: `b81f9fbd476db73dc87bdabd80427eb8441ea2db2223fda8421cee51a859cc18`
- Canvas: `1672 × 615 RGBA`
- Governance: `master-draft`
- `cameraMatched:false`
- `productionEligible:false`

### Alpha / provenance verification
- Owner primary evidence: `OWNER-Y62-REAR34-01 / references/y62-owner/IMG_4540.jpeg`
- Owner source SHA-256: `747c9edf7b39fca2cb9fa9dde0bf329cdbec8dc2c08643d873317b50c27d28e2`
- Candidate 03 lineage SHA-256: `1260362df7d22c70dafbfd3deba3f767150496093fdaeb8178b826e0470fd6b7`
- Candidate 03 authorising review manifest SHA-256: `caf4cd3bb1d1ff050bdecd178dfd8a99d593676c8846466b45bdf873e58d8e7c`
- Alpha support added: **0 px**
- Alpha support removed: **1,880 px**
- Alpha bytes changed: **2,775 px**
- Semi-transparent pixels: **2,596 px**
- Changed alpha pixels outside authorised zones: **0**
- Retained visible pixels: **117,704**
- Retained owner-source RGB exact fraction: **1.000000**
- RGB bytes changed: **0**
- External exact-vehicle production pixels: **0**

The deliberately conservative cleanup does not claim semantic edge acceptance. Uncertain vehicle pixels were retained rather than guessed away.

## New governed artifacts
- Candidate 04 alpha mask: `assets/y62-canonical-candidates/Y62-R34-V1-candidate-04-alpha-mask-v01.png`
  - SHA-256: `6960094525f0a695516a0ed4588b60059077bf6ba5cc1e62696484da50b70c6a`
- Candidate 04 preview: `assets/y62-canonical-candidates/Y62-R34-V1-transparent-isolation-v04-preview.jpg`
  - SHA-256: `c9edb08ec51b2b226544cc96402b52bcc715b2760c2d81e7df3c5b89cefbdaab`
- Generation/review board: `assets/y62-canonical-candidates/Y62-R34-V1-candidate-04-targeted-alpha-cleanup-v01.png`
  - SHA-256: `c6336fd203043338dcd42992ee6a623697562d3984dbf6b99dc8fc57c34b36cc`
- Manifest: `assets/y62-canonical-candidates/Y62-R34-V1-candidate-04-targeted-alpha-cleanup-v01.json`
  - SHA-256: `a9e44c975f7feacabdfab8324ed390595e088001960ec1809368606ca7b4701c`

The deterministic builder `tools/build-y62-r34-candidate04-targeted-alpha-residue-cleanup.py` was rerun and regenerated the same candidate, mask, preview, board and manifest checksums.

## Workflow state
R34 advances from `candidate03-edge-returned-targeted-cleanup` to **`candidate04-edge-review-required`**.

No camera lock, canonical-master approval, production registry write, customer resolver exposure or WF5 promotion occurred. Clean neutral reconstruction remains **FAIL** because photographed body/glass reflections are intentionally still present; this package does not repaint or infer replacement surfaces.

F34 Candidate 04 remains byte-identical at `bab5e059a6da3a4b7455777c9e23e593ed851fcedb709d44e10bbe54847b6bd1` and its Candidate 05 intake / camera-transfer / exact-checksum review / promotion-readiness gates remain waiting for the actual professional Candidate 05 binary.

## Verification
- Full `npm test`: **PASS**
- `npm run check`: **PASS**
- JavaScript syntax: **130 files / 0 failures**
- JSON parse: **34 files / 0 failures**
- HTML: **16 files**
- Local HTML references: **250 / 0 missing**
- Owner reference hashes: **9 / 9 verified**
- Candidate 04 deterministic regeneration: **PASS**
- Customer-facing Candidate 04 exposure: **NONE**

## Next dependency
**F34 Candidate 05 remains first.** Receive `Y62-F34-V1-CANDIDATE-05` with its completed retoucher/provenance/production-rights intake and run the prepared deterministic intake + exact-checksum review pipeline.

If F34 Candidate 05 remains unavailable, the next legitimate R34 package is a **fresh identified exact-checksum edge review of `Y62-R34-V1-CANDIDATE-04`**. Neutral/professional reconstruction remains blocked until that review passes. Production remains additionally blocked behind accepted F34-family alignment, separately recorded production-binary rights, master approval and WF5.
