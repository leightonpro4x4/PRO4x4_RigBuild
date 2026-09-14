# PRO4X4 Rig Builder — Alpha 26 — WF3 Push 53
## Y62-R34-V1 Candidate 03 Alpha-Edge Cleanup

**Package:** `Y62-R34-V1-CANDIDATE03-ALPHA-EDGE-CLEANUP-01`  
**Policy:** `REFERENCE_BACKED_APPROVED_VISUALS_ONLY`  
**Vehicle:** 2025 Nissan Patrol Y62 Series 5 Warrior  
**View:** `Y62-R34-V1` / rear three-quarter  
**Production promotion:** **NO**

## Priority decision

`Y62-F34-V1-CANDIDATE-05` remains the first WF3 production dependency, but the professional reconstruction binary and completed provenance/rights intake are still absent. SIDE remains source-gap blocked. The highest-priority executable unfinished package was therefore the owner-only R34 Candidate 03 alpha-edge cleanup already required by `Y62-R34-V1-CANDIDATE02-EDGE-REVIEW-01`.

No F34/SIDE geometry was guessed and no package was advanced out of sequence.

## Concrete progress

Created checksum-new **`Y62-R34-V1-CANDIDATE-03`**:

- Candidate: `assets/y62-canonical-candidates/Y62-R34-V1-transparent-isolation-v03.png`
- SHA-256: `1260362df7d22c70dafbfd3deba3f767150496093fdaeb8178b826e0470fd6b7`
- Alpha mask: `assets/y62-canonical-candidates/Y62-R34-V1-candidate-03-alpha-mask-v01.png`
- Alpha-mask SHA-256: `c0d66588f0dbba6300383f7beffaf10524d93d6814aa7cb967a4324b708e0041`
- Evidence board: `assets/y62-canonical-candidates/Y62-R34-V1-candidate-03-alpha-edge-cleanup-v01.png`
- Evidence-board SHA-256: `14a7887110ba53c1c29992ccb310aeff879c2e5c22f544c85c63d12d9abffc7e`
- Manifest: `assets/y62-canonical-candidates/Y62-R34-V1-candidate-03-alpha-edge-cleanup-v01.json`
- Manifest SHA-256: `54def38d936e0d9b4d9d13a9cd763de4f5c632e8ea4becfb95ec5279886bd61e`

Candidate 03 uses `OWNER-Y62-REAR34-01 / IMG_4540.jpeg` as the direct camera/RGB source and Candidate 02 only as the frozen alpha-support lineage. The operation is deliberately limited to **inward alpha antialiasing** over the exact existing nonzero support.

### Geometry/provenance invariants

- Owner-source RGB exact fraction: **1.000000** across **119,584** visible pixels.
- Candidate 02 alpha-support pixels added: **0**.
- Candidate 02 alpha-support pixels removed: **0**.
- Alpha-support shape therefore remains exactly identical at the pixel-support level.
- Alpha bytes changed: **1,901**.
- New semi-transparent boundary pixels: **1,901**.
- Perspective warp: **false**.
- Non-uniform scaling: **false**.
- RGB repaint/retouch: **false**.
- Synthetic/generative geometry: **false**.
- External exact-vehicle production pixels: **false**.

This addresses the hard binary `0/255` stair-step problem without expanding the silhouette or inventing missing geometry. It does **not** claim to remove every source-scene boundary contaminant, and it deliberately does not alter photographed reflections inside the body/glass.

## Governance/readiness state

R34 advances from `candidate02-edge-returned` to **`candidate03-edge-review-required`**.

Candidate 03 remains:

- `master-draft`
- `cameraMatched:false`
- `productionEligible:false`
- edge semantic quality: **HOLD pending fresh exact-checksum review**
- source-scene boundary residue: **HOLD pending fresh exact-checksum review**
- clean neutral reconstruction: **FAIL / not addressed by this alpha-only package**
- F34-family alignment: **HOLD**
- production-binary rights: **HOLD**
- master approval: **HOLD**
- WF5 promotion: **HOLD**

The canonical candidate history, camera profile, readiness matrix and WF3 workflow-board state were updated to point to Candidate 03 without granting production authority. Customer-facing resolver/entry files contain no Candidate 03 path/package reference.

## Verification

- Deterministic Candidate 03 regeneration: **PASS** — candidate/mask/evidence-board/manifest hashes reproduce identically.
- Full `npm test`: **PASS**.
- `npm run check`: **PASS**.
- JavaScript syntax validation: **126 files / 0 failures**.
- JSON parse validation: **32 files / 0 failures**.
- HTML/local dependency scan: **16 HTML files / 249 local references / 0 missing**.
- Owner reference pack hashes: **9/9 verified**.
- F34 Candidate 04 remains byte-identical: `bab5e059a6da3a4b7455777c9e23e593ed851fcedb709d44e10bbe54847b6bd1`.
- R34 Candidate 02 remains byte-identical: `b9258e98454d49b11197e5c04d89796eb3ad35dd064892f01f21490f2147b346`.

## Next dependency

**F34 remains first:** receive professionally reconstructed `Y62-F34-V1-CANDIDATE-05` plus completed retoucher/provenance/production-rights intake, then run the prepared deterministic intake and exact-checksum review pipeline.

If F34 Candidate 05 is still unavailable, the next legitimate R34 package is a **fresh identified exact-checksum edge review of Candidate 03**. That review must decide the roof/spoiler, mirror/front-side boundary and lower bumper/tow contours against the owner evidence. Clean neutral/professional reconstruction must not begin until that exact Candidate 03 checksum receives its edge decision. Production remains blocked behind accepted F34-family alignment, production-binary rights, master approval and WF5.
