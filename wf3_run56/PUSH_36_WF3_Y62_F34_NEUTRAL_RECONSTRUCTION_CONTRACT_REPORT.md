# PRO4X4 Rig Builder — Alpha 26 WF3 Push 36
## Y62-F34-V1 neutral reconstruction retouch contract

### Scope
Advanced one WF3 package only: **Candidate 03 → checksum-pinned neutral-reconstruction retouch contract** for `Y62-F34-V1`. No customer UX, catalogue/fitment data, backend production rules, product layers, SIDE asset, or R34 asset was advanced.

### Concrete progress
- Preserved `Y62-F34-V1-CANDIDATE-03` byte-for-byte unchanged at SHA-256 `67fae4a0bec8ab714a852a8841e8ca5610cdb32fbf58506900e3fd1ec28bb64e`.
- Added `Y62-F34-V1-NEUTRAL-RECONSTRUCTION-01`, a deterministic RGB-only retouch contract for the next F34 reconstruction pass.
- The contract is anchored to the same owner-supplied 2025 Series 5 Y62 Warrior evidence set:
  - `OWNER-Y62-F34-01 / IMG_4030.jpeg`;
  - `OWNER-Y62-F34-02 / IMG_3762.jpeg`;
  - `OWNER-Y62-FRONT-01 / IMG_4028.jpeg`;
  - `OWNER-Y62-FRONT-02 / IMG_4512.jpeg`.
- No external exact-vehicle source contributes production pixels to the contract.
- Added a generated geometry/detail lock envelope which protects:
  - the alpha/silhouette boundary with an 18 px internal buffer;
  - detected body/detail edges;
  - the lower wheel/underbody/lower-bumper region;
  - the front fascia/headlamp/grille anchor region.
- The resulting editable interior envelope is intentionally conservative: **38,943 pixels / 12.8107%** of Candidate 03 foreground. The remaining **265,045 foreground pixels are locked** by the contract.
- The contract explicitly prohibits alpha changes, perspective/geometry warp, wheel/tyre replacement, new body lines, accessory geometry, or automatic production promotion.
- Added a checksum-pinned reviewer/retoucher board:
  - `Y62-F34-V1-neutral-reconstruction-map-v01.png` — SHA-256 `996d7d89b709d536bea628feb17d035bbc805c2031535fdbe9ccb17c30976c31`;
  - `Y62-F34-V1-neutral-reconstruction-envelope-v01.png` — SHA-256 `7ebf9e43e9a7676253f1e09307812026b13c1809d685da7954d3b31b65d8282b`.
- Added the immutable JSON/JS contract, build script, readiness/camera/candidate metadata, staff review-page visibility and targeted regression coverage.

### Governance result
`REFERENCE_BACKED_APPROVED_VISUALS_ONLY` remains intact.

This push **does not promote Candidate 03 and does not create Candidate 04**. Candidate 03 remains `master-draft`, `cameraGeometry.matched:false`, `productionEligible:false`, and prohibited from customer resolver/quote/product-layer use.

The neutral-reconstruction contract is an editing boundary, not an approval. It prevents the next retouch pass from quietly altering geometry while still allowing controlled removal of source-scene reflection/lighting dependence from interior RGB appearance.

Blocking gates remain:
1. create Candidate 04 under this exact geometry/alpha lock and rerun the locked overlay evidence;
2. identified reviewer signoff remains required for semantic camera geometry and final edge quality;
3. production-binary rights for the final photo-derived/retouched binary must be separately recorded;
4. only an identified `master-approved` candidate with `cameraGeometry.matched:true` may go to WF5;
5. WF5 must gate the exact final checksum before customer production.

SIDE remains source-blocked because the owner pack still lacks a clean square-on raw side source. R34 remains queued behind the accepted F34 canonical family rather than being advanced out of sequence.

### Verification
- New `tests/wf3-y62-f34-neutral-reconstruction-contract-alpha26.js`: **PASS**.
- Full Alpha 12 → current Alpha 26 `npm test`: **PASS**.
- `npm run check`: **PASS**.
- JavaScript syntax: **91 files / PASS**.
- JSON parsing: **13 files / PASS**.
- HTML/local dependency scan: **16 HTML files / 243 local references / 0 missing**.
- Contract regeneration is deterministic:
  - board SHA remained `996d7d89b709d536bea628feb17d035bbc805c2031535fdbe9ccb17c30976c31`;
  - envelope SHA remained `7ebf9e43e9a7676253f1e09307812026b13c1809d685da7954d3b31b65d8282b`.
- Candidate 03 SHA remained `67fae4a0bec8ab714a852a8841e8ca5610cdb32fbf58506900e3fd1ec28bb64e` after contract generation/regeneration.
- Customer-entry regression confirms the contract, map and envelope are not exposed to customer production.

### Next dependency
Create **`Y62-F34-V1-CANDIDATE-04`** by neutralising source-scene reflections/lighting only within `Y62-F34-V1-NEUTRAL-RECONSTRUCTION-01`, with alpha and locked geometry unchanged. Then rerun the F34 overlay/reviewer evidence against that exact checksum. Production rights and identified reviewer approval still remain mandatory before WF5 promotion. If Candidate 04 cannot meet the locked overlay without invented geometry, reject it and keep Candidate 03 as review evidence only.
