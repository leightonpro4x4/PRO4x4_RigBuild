# PRO4X4 Rig Builder — Alpha 26 WF3 Push 48
## Y62-F34-V1 Candidate 05 Exact-Checksum Review Pipeline 01

### Package advanced
`Y62-F34-V1-CANDIDATE05-REVIEW-PIPELINE-01`

Only this WF3 package was advanced. No new F34/SIDE/R34 master binary was created, no camera was promoted, no production resolver state changed, and no guessed or unsupported geometry was introduced.

### Why this was the highest-priority executable WF3 package
`Y62-F34-V1` remains the first production-priority canonical view. Candidate 04 is still returned for professional clean reconstruction, while the professionally reconstructed Candidate 05 binary and completed intake/provenance manifest have not yet arrived. SIDE remains source-blocked and R34 remains reviewer-signoff-ready/non-production.

The highest-value safe work was therefore to make the **first Candidate 05 review deterministic before the binary arrives**, so a returned reconstruction cannot inherit Candidate 04 approval or be reviewed against stale evidence.

### New review-pipeline contract
The new package binds Candidate 05 review to all of the following before evidence can be generated:

- candidate ID must be `Y62-F34-V1-CANDIDATE-05`;
- deterministic intake contract must be `Y62-F34-V1-CANDIDATE05-INTAKE-01`;
- deterministic intake must report `structurallyReady=true`;
- camera-transfer contract must be `Y62-F34-V1-CAMERA-TRANSFER-CONTRACT-01`;
- returned Candidate 05 SHA-256 must exactly equal the binary SHA recorded by the intake result;
- canvas remains `1672 × 615` RGBA;
- alpha/camera coordinate frame remains checksum-locked to raw alpha SHA-256 `f8c0c48381120ddb1eef0c225959955820e1f4753a3905ec96d1e87506602d05` unless a geometry exception was explicitly pre-authorised before editing;
- primary authenticity evidence remains owner-supplied `OWNER-Y62-F34-01 / IMG_4030.jpeg`, SHA-256 `400a6e3f7fddeb5dba175173491ddd2bab62c0cea6fd286b5c4e6119d9a72fdc`;
- supporting owner evidence remains the owner F34/support/front reference set;
- Candidate 04 review, overlay and decision evidence may **not** be inherited by Candidate 05.

### Exact-checksum review executor prepared
A new deterministic executor is now ready at:

`tools/prepare-y62-f34-candidate05-review.py`

Once valid Candidate 05 intake exists, it will:

1. reject Candidate 04 reuse or any candidate whose SHA does not equal the intake result;
2. reverify the locked alpha/camera-transfer frame;
3. register the owner F34 primary source to the exact Candidate 05 binary using SIFT + Lowe ratio + RANSAC partial-affine evidence;
4. generate a new checksum-specific owner/candidate/overlay review board;
5. create a new Candidate 05 review manifest bound to that exact binary;
6. leave reviewer decision, `cameraGeometryMatched`, master approval and production promotion false/pending.

Machine registration authority is explicitly **preflight-only**. It cannot approve camera geometry, master state or production.

### Mandatory identified-reviewer checks
The Candidate 05 packet will require explicit review of:

- 2025 Series 5 Warrior identity;
- factory Warrior wheel/tyre geometry;
- Premcar/Warrior stance;
- F34 camera perspective;
- body silhouette / arches / overhangs;
- roofline and glasshouse proportions;
- Series 5 front fascia and bumper geometry;
- headlamp/grille anchors;
- wheel centres / stance coordinate lock;
- production-clean transparent edges;
- clean reconstruction with no photographed environment/reflection residue;
- no guessed, warped or unsupported geometry.

Even a complete reviewer PASS remains separate from production-binary rights, exact-checksum master approval and WF5 promotion.

### External-source governance
`REFERENCE_BACKED_APPROVED_VISUALS_ONLY` remains unchanged.

External exact-vehicle images or 3D sources retain zero automatic production geometry authority. If an external exact-vehicle source contributes production pixels, its source-specific rights must already be separately recorded by the Candidate 05 intake chain. Rights clearance alone still does not supersede the owner Series 5 Warrior pack as authenticity evidence.

### Current readiness
F34 remains:

- Candidate 04 unchanged and returned for professional reconstruction;
- Candidate 05 not yet received;
- Candidate 05 intake gate ready;
- F34 camera-transfer contract ready;
- **Candidate 05 exact-checksum review pipeline ready**;
- external Sketchfab pointer reference-only/unresolved;
- `cameraGeometryMatched: false`;
- `masterApproved: false`;
- `productionEligible: false`.

SIDE remains source-gap-confirmed with no candidate. R34 remains Candidate 01 / identified-reviewer-signoff-ready and non-production. Neither secondary view was advanced.

### New artifacts
- Review-pipeline contract: `y62-f34-candidate05-review-pipeline.js`
- Deterministic review executor: `tools/prepare-y62-f34-candidate05-review.py`
- Deterministic pipeline-board builder: `tools/build-y62-f34-candidate05-review-pipeline.py`
- Review-pipeline manifest: `assets/y62-canonical-candidates/Y62-F34-V1-candidate-05-review-pipeline-v01.json`
  - SHA-256 `7483c3abace2934eb2471808f44be25272b08b5697e0b107d629d3321d07114f`
- Review-pipeline board: `assets/y62-canonical-candidates/Y62-F34-V1-candidate-05-review-pipeline-v01.png`
  - SHA-256 `e51044a5d93563ff7c2ded7870e3fbed4b0d3acf31ca20107e3935529ebfe785`
- Regression: `tests/wf3-y62-f34-candidate05-review-pipeline-alpha26.js`

### Verification
- New package regression: **PASS**.
- Full `npm test`: **PASS**.
- `npm run check`: **PASS**.
- JavaScript syntax validation: **116 files PASS**.
- JSON parse validation: **27 files PASS**.
- HTML dependency scan: **16 HTML files / 246 local references / 0 missing**.
- Owner-reference integrity: **9/9 recorded owner files reverified against SHA-256**.
- Candidate 04 remains byte-for-byte unchanged at SHA-256 `bab5e059a6da3a4b7455777c9e23e593ed851fcedb709d44e10bbe54847b6bd1`.
- Pipeline board deterministic regeneration: **PASS**, identical SHA-256.
- Pipeline manifest deterministic regeneration: **PASS**, identical SHA-256.
- Negative safety test: the Candidate 05 review executor was deliberately presented Candidate 04 behind a forged structurally-ready intake result and correctly **rejected** it.
- Customer exposure check: the review pipeline ID/artifact are absent from `index.html`; no Candidate 05 fallback or production exposure was added.

### Next dependency
Receive the professionally reconstructed `Y62-F34-V1-CANDIDATE-05` plus its completed Candidate 05 intake/provenance/rights manifest.

Then:

1. run `Y62-F34-V1-CANDIDATE05-INTAKE-01`;
2. require deterministic structural/coordinate-frame PASS;
3. execute `Y62-F34-V1-CANDIDATE05-REVIEW-PIPELINE-01` against the exact new checksum;
4. complete identified camera/semantic/clean-reconstruction review;
5. only after those gates address production-binary rights, exact-checksum master approval and WF5 promotion.

No production promotion is authorised by this push.
