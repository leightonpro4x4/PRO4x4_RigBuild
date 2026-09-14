# PRO4X4 Rig Builder — Alpha 26 WF3 Push 37
## Y62-F34-V1 Candidate 04 — geometry-locked RGB neutralisation

### Scope
Advanced **one WF3 package only**: `Y62-F34-V1-CANDIDATE-04`, the first checksum-pinned RGB-neutralisation attempt under `Y62-F34-V1-NEUTRAL-RECONSTRUCTION-01`.

No customer UX, catalogue/fitment data, product-layer geometry, SIDE master, R34 master, production resolver rule, or backend feature was advanced.

### Concrete progress
- Preserved Candidate 03 as the immutable reconstruction source at SHA-256 `67fae4a0bec8ab714a852a8841e8ca5610cdb32fbf58506900e3fd1ec28bb64e`.
- Preserved the retouch envelope at SHA-256 `7ebf9e43e9a7676253f1e09307812026b13c1809d685da7954d3b31b65d8282b`.
- Created `Y62-F34-V1-CANDIDATE-04`:
  - file: `assets/y62-canonical-candidates/Y62-F34-V1-neutral-reconstruction-v04.png`;
  - canvas: `1672 × 615` RGBA;
  - SHA-256: `bab5e059a6da3a4b7455777c9e23e593ed851fcedb709d44e10bbe54847b6bd1`;
  - governance: `master-draft`;
  - production eligibility: `false`.
- Candidate 04 is derived only from the owner-reference-backed Candidate 03 chain using `OWNER-Y62-F34-01`, `OWNER-Y62-F34-02`, `OWNER-Y62-FRONT-01`, and `OWNER-Y62-FRONT-02` as authenticity evidence.
- No external exact-vehicle image contributes Candidate 04 production pixels.
- Retouch process is deterministic and RGB-only:
  - Candidate 03 alpha mask is byte-identical;
  - no coordinate transform, perspective warp, resampling, wheel/tyre replacement, body reconstruction, new body line, trim invention, or accessory geometry is introduced;
  - every changed RGB pixel is inside the previously checksum-pinned retouch envelope.
- Envelope verification:
  - eligible pixels: **38,943**;
  - changed eligible pixels: **38,419**;
  - changed pixels outside envelope: **0**;
  - mean absolute channel delta: **3.3683**;
  - P95 channel delta: **9**;
  - maximum channel delta: **23**.
- Conservative neutralisation proxies improved inside the eligible region:
  - high-frequency RMS: **−17.7576%**;
  - mean LAB chroma: **−10.7773%**.
- Added checksum-pinned Candidate 04 build evidence, RGB delta, staff review board, candidate review metadata, camera/readiness pointers and targeted regression coverage.
- Candidate 03 overlay/reviewer evidence is now explicitly treated as **historical-only** for Candidate 04. It cannot approve the new checksum.

### Governance result
`REFERENCE_BACKED_APPROVED_VISUALS_ONLY` remains intact.

Candidate 04 is **not promoted**. It remains `master-draft`, `cameraGeometryMatched:false`, and `productionEligible:false`.

The conservative retouch envelope intentionally locks many photographed reflection/detail edges. Therefore Candidate 04 is a valid geometry-locked neutralisation attempt, but it is **not claimed to be a clean neutral canonical master**. Remaining photographic reflection/detail residue must be decided by an identified reviewer or addressed through a rights-cleared professional reconstruction path without widening geometry by inference.

Production blockers remain:
1. regenerate the locked F34 overlay evidence against Candidate 04 exact checksum;
2. regenerate the reviewer signoff packet against Candidate 04 exact checksum;
3. obtain an identified reviewer decision for camera geometry, edge quality and clean-reconstruction acceptability;
4. separately record production-binary rights for the final retouched/photo-derived output;
5. obtain `master-approved` governance and then pass WF5 on the exact approved checksum.

SIDE remains queued because the owner pack still lacks the required clean square-on raw side source. R34 remains queued behind the accepted F34 canonical family.

### Verification
- `tools/verify-y62-f34-candidate04.py`: **PASS** — independently confirms byte-identical alpha, zero outside-envelope RGB changes, exact checksums and non-production state.
- `tests/wf3-y62-f34-candidate04-alpha26.js`: **PASS**.
- Historical Candidate 02 / Candidate 03 / overlay / reviewer / neutral-reconstruction regression tests: **PASS** after being updated to distinguish historical evidence from the current Candidate 04 pointer.
- Full Alpha regression chain via `npm test`: **PASS**.
- `npm run check`: **PASS**.
- JavaScript syntax: **93 files / PASS**.
- JSON parsing: **14 files / PASS**.
- HTML/local dependency scan: **16 HTML files / 243 local references / 0 missing**.
- Candidate 04 deterministic rebuild: **PASS** — regenerated candidate SHA remained `bab5e059a6da3a4b7455777c9e23e593ed851fcedb709d44e10bbe54847b6bd1`; review board SHA remained `58e3962211ea5e2bcf33946734572a1acf368dc96d04ade2aaff7248abace267`.
- Customer entrypoint regression confirms Candidate 04 ID, binary and review module are not exposed to customer production.

### Next dependency
Regenerate the locked F34 overlay evidence and reviewer signoff packet against **Candidate 04 exact checksum**. If semantic review still rejects the remaining photographed reflection/detail residue, do **not** widen the retouch contract or invent geometry; route the F34 master through a rights-cleared professional reconstruction path or retain Candidate 04 as review-only evidence. Production rights, identified reviewer approval and WF5 exact-checksum promotion remain mandatory before customer availability.
