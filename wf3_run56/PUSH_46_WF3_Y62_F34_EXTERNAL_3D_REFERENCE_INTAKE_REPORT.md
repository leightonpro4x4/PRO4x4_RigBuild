# PRO4X4 Rig Builder — Alpha 26 WF3 Push 46
## Y62-F34-V1 External 3D Reference Intake 01

### Package advanced
`Y62-F34-V1-EXTERNAL-3D-REFERENCE-INTAKE-01`

Only this WF3 package was advanced. No new F34/SIDE/R34 master candidate was created, no camera was promoted, and no production resolver state was changed.

### New owner-supplied external pointer
The owner/user supplied:

- Provider: Sketchfab
- Short link: `https://skfb.ly/onCVs`
- Intended role: possible Y62 3D reconstruction/reference source

The short link could not be resolved to an exact Sketchfab model URL in the available runtime; the origin returned HTTP 403. Therefore model UUID, title, creator, downloadable mesh and licence are not verified.

The package explicitly forbids substituting another publicly indexed Y62 model for this exact pointer unless the identity is proven.

### Governance decision
Current state: `REFERENCE_ONLY_UNRESOLVED`

The external 3D pointer has:

- zero production geometry authority;
- zero production pixel/mesh authority;
- unknown / unrecorded licence;
- no commercial derivative rights record;
- no ability to override the owner-supplied MY25 Series 5 Warrior pack;
- no ability to unlock SIDE, approve R34, replace the Candidate 05 intake gate, or promote F34.

`REFERENCE_BACKED_APPROVED_VISUALS_ONLY` remains unchanged.

### Primary authenticity evidence remains owner-backed
The complete 9-file owner-supplied 2025 Series 5 Y62 Warrior reference pack remains the controlling authenticity evidence.

Any future resolved 3D mesh must be checked against the owner pack for at least:

- MY25 / Series 5 fascia identity;
- glasshouse proportions;
- wheelbase and body length;
- wheel-arch geometry;
- factory Warrior wheels and tyres;
- Premcar Warrior stance.

If it is a stock Patrol, earlier-generation Patrol, Nismo or other derivative, that must be explicitly recorded and it cannot silently become the canonical source.

### F34 status preserved
Current F34 binary remains:

- Candidate: `Y62-F34-V1-CANDIDATE-04`
- SHA-256: `bab5e059a6da3a4b7455777c9e23e593ed851fcedb709d44e10bbe54847b6bd1`
- Governance: `master-draft`
- Camera matched: false
- Production eligible: false
- Decision: returned for clean professional reconstruction

`Y62-F34-V1-CANDIDATE05-INTAKE-01` remains ready and unchanged.

### New package artifacts
- Manifest: `assets/y62-canonical-candidates/Y62-F34-V1-external-3d-reference-intake-v01.json`
  - SHA-256: `cba781780f2ceec4d82998a89929867ae8fbd1c6dcf2b64903d9fbc6a24191b7`
- Review board: `assets/y62-canonical-candidates/Y62-F34-V1-external-3d-reference-intake-v01.png`
  - SHA-256: `fdaf06f6c3ffc6fa7781a5be3d4abd7351d54d9ef54ab783d9c815f4bcbadd29`
- Governance module: `y62-f34-external-3d-reference-intake.js`
- Regression: `tests/wf3-y62-f34-external-3d-reference-intake-alpha26.js`

### Readiness matrix update
F34 now records a separate external-3D intake state:

- exact model resolved: false
- rights recorded: false
- geometry authority: false
- production eligible: false

SIDE remains source-blocked and R34 remains reviewer-signoff-ready / non-production.

### Verification
- Full `npm test`: PASS
- `npm run check`: PASS
- JavaScript syntax validation: 112 files PASS
- JSON parse validation: 25 files PASS
- HTML dependency scan: 16 HTML files / 246 local references / 0 missing
- All 9 owner-reference hashes reverified by regression
- Candidate 04 exact checksum unchanged
- No SIDE candidate exists
- R34 Candidate 01 remains non-production
- External Sketchfab URL/intake ID absent from customer `index.html`
- New manifest/review-board exact hashes verified

### Next dependency
Resolve `https://skfb.ly/onCVs` to the exact Sketchfab model identity and record its licence/rights. If the source is both rights-cleared for the intended production use and geometrically compatible with the owner-backed 2025 Series 5 Warrior, ingest it as a separately governed reconstruction source feeding `Y62-F34-V1-CANDIDATE-05` and potentially the SIDE measured-geometry gap. Otherwise retain the existing professional Candidate 05 reconstruction path unchanged.

No external exact-vehicle source may be promoted merely because it visually resembles a Y62.
