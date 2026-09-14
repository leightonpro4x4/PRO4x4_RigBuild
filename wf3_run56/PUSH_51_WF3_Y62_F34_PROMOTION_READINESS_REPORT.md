# PRO4X4 Rig Builder — Alpha 26 WF3 Push 51
## Y62-F34-V1 Candidate 05 Promotion Readiness Gate 01

### Package advanced
`Y62-F34-V1-CANDIDATE05-PROMOTION-READINESS-01`

Only this WF3 package was advanced. No new F34/SIDE/R34 vehicle binary was created, no camera was re-framed, no geometry was inferred, no external exact-vehicle source was promoted, and no production/customer resolver state changed.

### Why this was the highest-priority executable WF3 package
`Y62-F34-V1` remains the first canonical production priority. The professionally reconstructed `Y62-F34-V1-CANDIDATE-05` binary and completed provenance/rights intake have still not arrived. The deterministic Candidate 05 intake, camera-transfer and exact-checksum review pipelines are already prepared.

The highest-value safe work was therefore to close the remaining gap between a future successful Candidate 05 review and WF5: a fail-closed promotion-readiness gate that binds the exact Candidate 05 checksum through intake, semantic review, rights and canonical-master approval without acquiring any authority to self-promote.

This preserves `REFERENCE_BACKED_APPROVED_VISUALS_ONLY` and avoids manufacturing a replacement vehicle simply to keep the workflow moving.

### New fail-closed promotion-readiness contract
The new gate is:

`Y62-F34-V1-CANDIDATE05-PROMOTION-READINESS-01`

It requires the exact Candidate 05 lineage:

1. `Y62-F34-V1-PRO-RECON-HANDOFF-01`;
2. `Y62-F34-V1-CANDIDATE05-INTAKE-01`;
3. `Y62-F34-V1-CAMERA-TRANSFER-CONTRACT-01`;
4. `Y62-F34-V1-CANDIDATE05-REVIEW-PIPELINE-01`;
5. then this promotion-readiness gate;
6. only then may the exact approved checksum be submitted to the separate WF5 production-promotion gate.

The gate explicitly has **no authority** to:

- set `productionEligible=true`;
- set `masterApproved=true`;
- set `cameraGeometryMatched=true` itself;
- write the production asset registry;
- promote an image to the customer resolver.

Its only successful output is `readyForWF5=true` for an already reviewed and separately master-approved exact checksum.

### Owner-backed authenticity remains primary
The promotion gate checksum-pins the same primary owner evidence used by the F34 reconstruction/review chain:

- `OWNER-Y62-F34-01` — primary F34;
- `OWNER-Y62-F34-02` — supporting F34;
- `OWNER-Y62-FRONT-01` — primary front;
- `OWNER-Y62-FRONT-02` — supporting front.

All nine owner-reference files were reverified against their recorded SHA-256 values during this push.

External exact-vehicle imagery or 3D remains reference-only unless source-specific production rights are separately recorded. Even where rights are available, those rights do not confer geometry authority and do not override the owner-supplied 2025 Series 5 Warrior pack as authenticity evidence.

### Exact checksum and camera-frame continuity
The gate rejects promotion readiness unless all four Candidate 05 checksum records exist and are identical:

- actual candidate binary SHA-256;
- deterministic intake binary SHA-256;
- exact-checksum review candidate SHA-256;
- canonical-master approval candidate SHA-256.

It also rejects:

- Candidate 04 reuse — SHA-256 `bab5e059a6da3a4b7455777c9e23e593ed851fcedb709d44e10bbe54847b6bd1` is explicitly forbidden as Candidate 05;
- dimensions other than `1672 × 615` with alpha;
- an alpha/camera coordinate frame different from raw-alpha SHA-256 `f8c0c48381120ddb1eef0c225959955820e1f4753a3905ec96d1e87506602d05`.

A geometry exception cannot silently pass this gate. Any authorised geometry-frame change requires a newly reviewed promotion contract rather than inheriting the locked F34 gate.

### Mandatory semantic/readiness matrix
Before `readyForWF5` can ever become true, all twelve Candidate 05 semantic checks must explicitly PASS:

- 2025 Series 5 Warrior identity;
- factory Warrior wheels/tyres;
- Premcar/Warrior stance;
- F34 camera perspective;
- silhouette / arches / overhangs;
- roofline / glasshouse;
- Series 5 front fascia / bumper;
- headlamp / grille anchors;
- wheel centres / stance coordinate lock;
- production-clean transparent edges;
- clean reconstruction with no photographed source-scene residue;
- no guessed, warped or unsupported geometry.

The reviewer must be identified and hold `identified-semantic-review` authority. The exact checksum must then receive a separate identified `canonical-master-approval` decision.

### Rights gate hardened
Promotion readiness now requires an explicit `productionBinaryRightsReady=true` state.

If Candidate 05 contains **no external production pixels**, the external-source rights branch is satisfied without inventing a rights record.

If any external exact-vehicle image or 3D source contributes production pixels, every contributing source must carry a source identifier plus separately recorded:

- rights record;
- commercial derivative-use permission;
- production-pixel-use permission.

A generic reference or a usable-looking model can therefore never become production evidence by implication.

### Current readiness state
F34 remains safely blocked:

- Candidate 04 unchanged and returned for professional clean reconstruction;
- Candidate 05 not received;
- deterministic Candidate 05 intake gate ready;
- camera-transfer contract ready;
- exact-checksum Candidate 05 review pipeline ready;
- **Candidate 05 promotion-readiness gate now ready**;
- exact Sketchfab short-link model identity/rights remain unresolved and reference-only;
- `cameraGeometryMatched:false`;
- `masterApproved:false`;
- `readyForWF5:false`;
- `productionEligible:false`.

SIDE remains source-gap-confirmed. R34 Candidate 02 remains unchanged and non-production. Neither secondary view was advanced by this package.

### New artifacts
- Promotion-readiness contract: `y62-f34-candidate05-promotion-readiness.js`
- Deterministic board/manifest builder: `tools/build-y62-f34-candidate05-promotion-readiness.py`
- Promotion-readiness manifest: `assets/y62-canonical-candidates/Y62-F34-V1-candidate-05-promotion-readiness-v01.json`
  - SHA-256 `b87ab132b57233e205bcf68a7c0bf3d1377e31e1d9e337143674ae90ab0f646b`
- Promotion-readiness matrix board: `assets/y62-canonical-candidates/Y62-F34-V1-candidate-05-promotion-readiness-v01.png`
  - SHA-256 `41de59395c6d9638d1ca06e26f058937ef851db31ba6891f9d694216c8dacb1e`
- Regression: `tests/wf3-y62-f34-candidate05-promotion-readiness-alpha26.js`

The staff canonical-review page, F34 canonical brief, readiness plan and WF3 workflow board now reference this gate. Customer-facing entrypoints do not.

### Safety regression cases added
The new regression verifies that the gate:

- fails closed with missing inputs;
- can return `readyForWF5=true` only for a hypothetical fully satisfied exact-checksum record while still returning `productionEligible:false` and `productionRegistryWriteAllowed:false`;
- rejects Candidate 04 binary reuse;
- rejects a changed alpha/camera coordinate frame;
- rejects external production sources with incomplete commercial/production rights;
- remains absent from customer `index.html`.

### Verification
- New package regression: **PASS**.
- Full `npm test`: **PASS**.
- `npm run check`: **PASS**.
- JavaScript syntax validation: **122 files PASS**.
- JSON parse validation: **30 files PASS**.
- HTML dependency scan: **16 HTML files / 248 local references / 0 missing**.
- Owner-reference integrity: **9/9 recorded owner files reverified against SHA-256**.
- F34 Candidate 04 remains byte-for-byte unchanged at SHA-256 `bab5e059a6da3a4b7455777c9e23e593ed851fcedb709d44e10bbe54847b6bd1`.
- R34 Candidate 02 remains byte-for-byte unchanged at SHA-256 `b9258e98454d49b11197e5c04d89796eb3ad35dd064892f01f21490f2147b346`.
- Promotion-readiness board deterministic regeneration: **PASS**, SHA-256 unchanged.
- Promotion-readiness manifest deterministic regeneration: **PASS**, SHA-256 unchanged.
- No customer production resolver/fallback was added.

### Next dependency
The next dependency remains the actual professionally reconstructed `Y62-F34-V1-CANDIDATE-05` binary plus its completed retoucher/provenance/rights manifest.

Once received:

1. run deterministic Candidate 05 intake;
2. require the locked camera/alpha coordinate-frame PASS;
3. generate fresh exact-checksum owner overlay and reviewer evidence through `Y62-F34-V1-CANDIDATE05-REVIEW-PIPELINE-01`;
4. obtain identified semantic PASS including clean reconstruction and no unsupported geometry;
5. record production-binary/external-source rights as applicable;
6. obtain identified canonical-master approval against the same checksum;
7. evaluate `Y62-F34-V1-CANDIDATE05-PROMOTION-READINESS-01`;
8. only if `readyForWF5=true`, hand that exact checksum to WF5.

No production promotion is authorised by this push.
