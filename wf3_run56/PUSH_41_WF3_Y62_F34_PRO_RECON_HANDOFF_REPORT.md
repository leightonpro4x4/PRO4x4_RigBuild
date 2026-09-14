# PRO4X4 Rig Builder — Alpha 26 WF3 Push 41
## Y62-F34-V1 professional reconstruction handoff

### Scope
Advanced **one WF3 package only**: `Y62-F34-V1-PRO-RECON-HANDOFF-01`.

No new canonical vehicle binary was fabricated, no Candidate 04 pixel changed, no SIDE/R34 master was advanced, no customer UX was altered, and no production promotion occurred.

### Why this was the highest-priority unfinished package
`Y62-F34-V1-REVIEW-DECISION-01` returned Candidate 04 on `clean-reconstruction`: owner-source workshop/building/sky reflection residue remains materially visible. The next safe step was therefore to make the professional reconstruction requirement executable without relaxing `REFERENCE_BACKED_APPROVED_VISUALS_ONLY` or inviting unsupported geometry.

### Concrete progress
- Added governed handoff `Y62-F34-V1-PRO-RECON-HANDOFF-01`.
- Reserved the next review-only output as `Y62-F34-V1-CANDIDATE-05`.
- Candidate 04 remains byte-for-byte unchanged at SHA-256 `bab5e059a6da3a4b7455777c9e23e593ed851fcedb709d44e10bbe54847b6bd1`.
- Handoff authenticity pack uses only four owner-supplied 2025 Series 5 Warrior references:
  - `OWNER-Y62-F34-01 / IMG_4030.jpeg`;
  - `OWNER-Y62-F34-02 / IMG_3762.jpeg`;
  - `OWNER-Y62-FRONT-01 / IMG_4028.jpeg`;
  - `OWNER-Y62-FRONT-02 / IMG_4512.jpeg`.
- No external exact-vehicle production image is included in the handoff.
- Added source Candidate 04, exact-checksum overlay evidence, geometry/retouch map and review-decision gate to the retoucher bundle.
- Added explicit reconstruction rules:
  - keep 1672×615 F34 framing;
  - preserve silhouette/alpha unless a separately pre-authorised geometry exception exists;
  - preserve factory Warrior wheels/tyres, wheel centres, roofline, glasshouse proportions, lamp/fascia anchors, bumper-corner geometry and Premcar stance;
  - prohibit perspective warp, non-uniform scaling, replacement rolling stock, invented body/trim/accessory geometry, and unlicensed external exact-vehicle production pixels.
- Added required retoucher/provenance fields and explicit production-binary rights gate. Rights remain `pending`; the handoff does not infer ownership/licensing.
- Added ten acceptance gates for Candidate 05: binary, alpha/silhouette, camera registration, identity, factory wheels, clean reconstruction, provenance, rights, identified master review and WF5 exact-checksum gate.
- Added `assessSubmission()` structural intake guard. Even a structurally complete submission remains `productionEligible:false` and routes only to fresh exact-checksum overlay/review.
- Corrected the stale reconstruction brief reference list: the nonexistent `OWNER-Y62-FRONT-04` reference is removed; the brief now binds the exact four owner references above.
- Camera contract, readiness matrix, workflow board and staff-only review page now expose the handoff-ready state while keeping customer output blocked.

### Governance result
`REFERENCE_BACKED_APPROVED_VISUALS_ONLY` remains intact.

Current F34 state:
- Candidate 04: `master-draft` / returned;
- Candidate 05: reserved, **not received**;
- production rights: pending;
- camera geometry approval for the next binary: not run;
- master approval: not run;
- WF5 exact-checksum gate: not run;
- customer exposure: blocked.

SIDE remains queued behind the missing clean square-on owner source. R34 remains queued behind an accepted F34 canonical family.

### Handoff artifact integrity
- governed handoff JSON SHA-256: `825abc509f283e8d283f5ca3053c688acc2c131f2ab531d6c76077adde8dcd4b`;
- retoucher bundle manifest SHA-256: `54e4acaf3894e538c07e06ccfb3d8b2c9bc2dee8d806077213c24bd80127d27b`;
- every copied owner/source/evidence file is checksum-verified against the project source record.

### Verification
- New targeted regression `tests/wf3-y62-f34-professional-reconstruction-handoff-alpha26.js`: **PASS**.
- Full Alpha regression via `npm test`: **PASS**.
- `npm run check`: **PASS**.
- JavaScript syntax: **102 files / PASS**.
- JSON parsing: **19 files / PASS**.
- HTML/local dependency scan: **16 HTML files / 246 local references / 0 missing**.
- Customer `index.html` contains neither the handoff ID nor `CANDIDATE-05`.
- Candidate 04 exact SHA-256 remains unchanged.

### Next dependency
Receive `Y62-F34-V1-CANDIDATE-05` from the professional reconstruction handoff together with:
1. identified retoucher;
2. completion timestamp and method/provenance;
3. production-pixel source statement;
4. explicit statement on any external exact-vehicle pixel use; and
5. production-binary rights record.

Then regenerate the F34 overlay and reviewer packet **from scratch against Candidate 05's exact checksum**. If the new binary introduces unsupported geometry or cannot pass clean-reconstruction review, return it rather than relaxing the contract. Production remains blocked until identified reviewer PASS, recorded rights, master approval and WF5 exact-checksum promotion.
