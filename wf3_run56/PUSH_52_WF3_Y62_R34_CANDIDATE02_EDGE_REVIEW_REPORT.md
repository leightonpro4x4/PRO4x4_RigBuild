# PRO4X4 Rig Builder — Alpha 26 WF3 Push 52
## Y62-R34-V1 Candidate 02 Exact-Checksum Edge Review 01

### Package advanced
`Y62-R34-V1-CANDIDATE02-EDGE-REVIEW-01`

Only this WF3 package was advanced. No new F34, SIDE or R34 vehicle geometry was created. No camera was reframed, no RGB reconstruction was performed, no external exact-vehicle production pixels were introduced, and no production/customer resolver state changed.

### Why this was the highest-priority executable package
`Y62-F34-V1` remains the first canonical production priority, but the professionally reconstructed `Y62-F34-V1-CANDIDATE-05` binary plus completed provenance/rights intake are still absent. `Y62-SIDE-V1` remains source-gap-blocked because the owner pack has no clean square-on raw side source.

The next executable reference-backed package was therefore the identified exact-checksum edge review already required for the existing transparent R34 Candidate 02.

### Candidate under review
- Candidate: `Y62-R34-V1-CANDIDATE-02`
- File: `assets/y62-canonical-candidates/Y62-R34-V1-transparent-isolation-v02.png`
- SHA-256: `b9258e98454d49b11197e5c04d89796eb3ad35dd064892f01f21490f2147b346`
- Canvas: `1672 × 615 RGBA`
- Governance: `master-draft`
- Production eligible: **false**

Candidate 02 itself remains byte-for-byte unchanged by this package.

### Authenticity and provenance basis
Primary authenticity evidence remains the owner-supplied 2025 Series 5 Y62 Warrior pack:

- `OWNER-Y62-REAR34-01 / IMG_4540.jpeg` — primary R34 camera/authenticity source;
- `OWNER-Y62-REAR-01 / IMG_4508.jpeg` — rear lamp/tailgate/bumper support;
- `OWNER-Y62-F34-01 / IMG_4030.jpeg` — Warrior identity, stance and factory rolling-stock family support.

The accepted owner-source camera lineage remains valid. Candidate 02 still contains no perspective warp, non-uniform scaling, synthetic vehicle geometry or external exact-vehicle production pixels.

External exact-vehicle images/3D remain reference-only unless source-specific production rights are separately recorded. Rights do not override the owner pack as authenticity authority.

### Identified review authority
Reviewer: `OPENAI-WF3-VISUAL-QA-02`

Authority: `edge-review-return-only`.

This reviewer may return an exact candidate for edge cleanup. It cannot approve the canonical master, issue a production PASS, lock the production camera, approve rights, write the production registry or promote the asset to WF5/customer use.

### Exact-checksum edge findings
The candidate alpha was inspected directly and is fully binary:

- alpha values: `[0, 255]` only;
- opaque pixels: `119,584`;
- semi-transparent pixels: `0`;
- transparent pixels: `908,696`;
- vehicle alpha bbox: `[567, 118, 1025, 462]`.

This matters because at the current owner-source scale the hard 0/255 alpha contour is visibly stair-stepped/clipped in multiple high-curvature regions rather than carrying a production-clean anti-aliased edge.

Identified review result:

- **PASS** — exact candidate checksum;
- **PASS** — owner-camera lineage;
- **PASS** — no guessed/warped/replaced geometry;
- **RETURN** — roof/spoiler edge: visible hard stair-step/clipped contour;
- **RETURN** — near-side mirror/front-side boundary: visible source-scene foliage/background residue remains adjacent to the isolated vehicle boundary;
- **RETURN** — lower bumper/tow edge: hard binary contour/clipped soft-edge detail remains;
- **FAIL** — clean neutral reconstruction: photographed sky/building/foliage reflections remain in the retained body/glass RGB;
- **HOLD** — accepted F34 family alignment;
- **HOLD** — production-binary rights;
- **HOLD** — canonical master/WF5.

### Decision
`return-edge-cleanup-before-neutral-reconstruction`

Candidate 02 is therefore **returned for alpha-edge cleanup**. This is not a rejection of the owner-backed camera or vehicle geometry. The accepted R34 camera remains the reconstruction target; the returned component is the transparent isolation boundary quality.

`REFERENCE_BACKED_APPROVED_VISUALS_ONLY` remains fully intact.

### Readiness state advanced
R34 moved from:

`transparent-isolation-reviewable`

to:

`candidate02-edge-returned`

The workflow now records the exact review package, board, manifest, reviewer identity and return-only authority against the same Candidate 02 checksum.

No production flags were relaxed:

- `cameraGeometryMatched:false`;
- `productionEligible:false`;
- production camera lock: **blocked**;
- production-binary rights: **not separately recorded**;
- master approval: **not granted**;
- WF5 promotion: **not run**;
- customer exposure: **none**.

### New artifacts
- Review contract: `y62-r34-candidate02-edge-review.js`
- Deterministic board/manifest builder: `tools/build-y62-r34-candidate02-edge-review.py`
- Exact-checksum review manifest: `assets/y62-canonical-candidates/Y62-R34-V1-candidate-02-edge-review-v01.json`
  - SHA-256 `806f897506d0465ca44cc6430d74c310c66aa9841b477dc70d4aff9ae63cca1a`
- Review board: `assets/y62-canonical-candidates/Y62-R34-V1-candidate-02-edge-review-v01.png`
  - SHA-256 `f5a2cb86e74645bc75a8155ade94d16d988cdd5ca5349ef7af9a0e6d18296ae6`
- Regression: `tests/wf3-y62-r34-candidate02-edge-review-alpha26.js`

The staff canonical-review page, Y62 readiness matrix, R34 camera profile and WF3 workflow board now expose the return state. Customer-facing entrypoints do not.

### Verification
- New package regression: **PASS**.
- Full `npm test`: **PASS**.
- `npm run check`: **PASS**.
- JavaScript syntax validation: **124 files / 0 failures**.
- JSON parse validation: **31 files / 0 failures**.
- HTML/local dependency scan: **16 HTML files / 249 local references / 0 missing**.
- Owner-reference integrity: **9/9 owner files reverified against recorded SHA-256**.
- F34 Candidate 04 remains byte-for-byte unchanged at SHA-256 `bab5e059a6da3a4b7455777c9e23e593ed851fcedb709d44e10bbe54847b6bd1`.
- R34 Candidate 02 remains byte-for-byte unchanged at SHA-256 `b9258e98454d49b11197e5c04d89796eb3ad35dd064892f01f21490f2147b346`.
- Review-board deterministic regeneration: **PASS**, SHA-256 unchanged at `f5a2cb86e74645bc75a8155ade94d16d988cdd5ca5349ef7af9a0e6d18296ae6`.
- Review-manifest deterministic regeneration: **PASS**, SHA-256 unchanged at `806f897506d0465ca44cc6430d74c310c66aa9841b477dc70d4aff9ae63cca1a`.
- No customer production resolver/fallback was added.

### Next dependency
The first WF3 dependency remains the real professionally reconstructed `Y62-F34-V1-CANDIDATE-05` plus its completed retoucher/provenance/rights manifest.

If that remains unavailable, the next R34 package is now unambiguous: create a **checksum-new `Y62-R34-V1-CANDIDATE-03` alpha-edge cleanup** using owner-source pixels only, with no RGB repaint, perspective warp, non-uniform scale or synthetic geometry. That new checksum must receive fresh identified edge review before any clean neutral/professional reconstruction is considered.

R34 production camera lock must remain blocked until accepted F34-family alignment, production-binary rights, canonical-master approval and the separate WF5 exact-checksum gate all pass.
