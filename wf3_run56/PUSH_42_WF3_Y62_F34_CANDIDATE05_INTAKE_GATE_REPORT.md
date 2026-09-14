# PUSH 42 — WF3 Y62 F34 Candidate 05 Intake Gate

## Package advanced
`Y62-F34-V1-CANDIDATE05-INTAKE-01`

This push advances one WF3 package only. It does not create, reconstruct, approve or promote a new vehicle binary. Candidate 04 remains the latest F34 canonical candidate and remains returned / `master-draft`.

## Concrete progress
- Added a deterministic Candidate 05 intake contract tied to `Y62-F34-V1-PRO-RECON-HANDOFF-01`.
- Added a production-retoucher manifest template that requires identified retoucher provenance, tool/method declaration, explicit production-pixel source ledger, external exact-vehicle source declaration, production-binary rights basis, rights recorder and timestamp, and no-geometry-invention declarations.
- Added a deterministic binary intake validator for a returned `Y62-F34-V1-CANDIDATE-05` file.
- Validator checks exact candidate ID, PNG/RGBA format, 1672×615 canvas, new exact SHA-256, Candidate 04 alpha-byte equality unless a separately pre-authorised geometry exception exists, non-zero RGB change versus the returned Candidate 04, source-rights declarations, and production-rights metadata.
- Structural or binary intake success explicitly remains insufficient for promotion. The validator always reports `productionEligible:false`; fresh exact-checksum overlay, semantic/camera review, clean-reconstruction approval, rights approval and WF5 remain separate gates.
- Added a checksum-pinned machine-readable intake-gate state artifact.
- Updated the WF3 readiness matrix and workstream record to show that Candidate 05 intake is executable immediately when the professionally reconstructed binary arrives.

## Authenticity / rights discipline
Primary authenticity remains the owner-supplied MY25 Series 5 Y62 Warrior chain:
- `OWNER-Y62-F34-01`
- `OWNER-Y62-F34-02`
- `OWNER-Y62-FRONT-01`
- `OWNER-Y62-FRONT-02`

External exact-vehicle production sources must be declared explicitly. Any such source requires a production-ready rights state before the manifest can be rights-ready. Reference approval is not treated as production-pixel rights.

`REFERENCE_BACKED_APPROVED_VISUALS_ONLY` is unchanged. Candidate 04 stays checksum `bab5e059a6da3a4b7455777c9e23e593ed851fcedb709d44e10bbe54847b6bd1`, `master-draft`, camera unmatched and customer-ineligible.

## Intake artifacts
- `y62-f34-candidate05-intake-contract.js`
- `assets/y62-canonical-candidates/Y62-F34-V1-candidate-05-intake-template.json`
- `assets/y62-canonical-candidates/Y62-F34-V1-candidate-05-intake-gate-v01.json`
- `tools/validate-y62-f34-candidate05.py`
- `tests/wf3-y62-f34-candidate05-intake-gate-alpha26.js`

Artifact checksums recorded by the intake-gate state:
- contract: `5bdc520d125f5d71c4d38b36963e75255d0df22b0ed7e63f049b219c35eab1ee`
- manifest template: `81040d1eebb7fb04f2c3dce14d6046fe37bc8c1ebd14d84cdbb8f7134ad1c708`
- validator: `8ba3ab60a579102a1add9c5deb2d75854c7a722854a98671be26e19a5636e491`

## Verification
- Full Alpha regression chain: PASS, including the new Candidate 05 intake-gate test.
- `npm run check`: PASS.
- JavaScript syntax: 104 files PASS.
- JSON parse: 21 files PASS.
- HTML dependency scan: 15 HTML files / 243 local references / 0 missing.
- Validator negative-path test: PASS. Candidate 04 submitted as Candidate 05 with the incomplete template is correctly rejected; `productionEligible` remains false.
- No Customer UI / resolver exposure was introduced for the intake contract or Candidate 05.

## Readiness / next dependency
F34 is now intake-ready but still externally blocked on the actual professional reconstruction output. Next dependency:
1. receive `Y62-F34-V1-CANDIDATE-05` from the professional reconstruction handoff;
2. receive the completed intake manifest with identified retoucher, method/provenance, declared pixel sources and explicit production-binary rights state;
3. run the deterministic binary/alpha/provenance gate;
4. only if intake passes, regenerate F34 overlay evidence and identified reviewer evidence from scratch against Candidate 05's exact checksum.

SIDE remains queued behind the missing clean square-on owner source. R34 remains queued behind an accepted F34 canonical family.
