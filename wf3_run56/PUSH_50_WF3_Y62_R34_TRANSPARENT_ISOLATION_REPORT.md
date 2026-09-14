# PUSH 50 — WF3 Y62 R34 Transparent Isolation Candidate 02

## Scope
Advanced one WF3 package only: `Y62-R34-V1-CANDIDATE02-TRANSPARENT-ISOLATION-01`.

F34 remains the first production priority, but `Y62-F34-V1-CANDIDATE-05` and its completed provenance/rights intake are still absent. SIDE remains source-gap-confirmed. The next executable reference-backed package was therefore R34 transparent isolation on the already accepted owner-source camera.

Policy remains `REFERENCE_BACKED_APPROVED_VISUALS_ONLY`. No guessed geometry, perspective warp, non-uniform scale, synthetic completion, external exact-vehicle production pixels, customer resolver change, master approval or production promotion occurred.

## Concrete progress
Created `Y62-R34-V1-CANDIDATE-02` as the first transparent R34 owner-source isolation candidate.

Primary authenticity/camera source:
- `OWNER-Y62-REAR34-01 / references/y62-owner/IMG_4540.jpeg`
- SHA-256 `747c9edf7b39fca2cb9fa9dde0bf329cdbec8dc2c08643d873317b50c27d28e2`

Supporting owner evidence remains:
- `OWNER-Y62-REAR-01 / IMG_4508.jpeg` — rear lamps, tailgate, bumper and tow-area support.
- `OWNER-Y62-F34-01 / IMG_4030.jpeg` — Warrior identity, stance and factory rolling-stock family support.

Transformation is deliberately narrow:
- uniform source resize to 700 × 525;
- fixed placement x486 / y45 on the 1672 × 615 canonical review canvas;
- alpha-only isolation using a frozen 700 × 525 mask;
- no crop;
- no perspective warp;
- no non-uniform scaling;
- no RGB retouch;
- no synthetic body, wheel, trim or accessory geometry.

Candidate 02:
- `assets/y62-canonical-candidates/Y62-R34-V1-transparent-isolation-v02.png`
- SHA-256 `b9258e98454d49b11197e5c04d89796eb3ad35dd064892f01f21490f2147b346`
- 1672 × 615 RGBA
- transparent background verified
- retained source-space RGB exact fraction: 1.000000
- retained source-space pixels: 119,584 / 367,500 (32.5399%)
- source-space alpha bbox: `[81, 73, 539, 417]`
- canvas-edge contact: false

Frozen alpha mask:
- `assets/y62-canonical-candidates/Y62-R34-V1-candidate-02-alpha-mask-v01.png`
- SHA-256 `33571a82c811f6ad2d4d1a338f1bdaf0ffe92aafa91f8164b3cc00665c173859`

Checksum-pinned review packet:
- manifest SHA-256 `1977d6138afdacf7b285d7bdbbf6ddfedb80041feaa4ba911cb47763ef4eeb9c`
- review board SHA-256 `bae653b23fef7ae9961011a867f9dc6f32b468f691af71e0fdc7622d5703f385`

## Review result
Candidate 02 is `master-draft`, `cameraMatched:false`, and `productionEligible:false`.

Automated/reproducible checks:
- PASS — direct owner authenticity source.
- PASS — accepted owner-source R34 camera preserved by uniform resize + fixed placement only.
- PASS — transparent alpha structure.
- PASS — retained RGB is byte-exact to the uniformly resized owner source.
- PASS — no external production pixels.
- PASS — no perspective warp or synthetic geometry.
- HOLD — edge quality requires identified exact-checksum visual review; minor source-scene boundary residue may remain around difficult mirror/underbody edges.
- FAIL — clean neutral reconstruction: photographed reflections/environment remain in body and glass pixels by design. This candidate is isolation evidence, not a clean canonical reconstruction.
- HOLD — accepted F34 canonical family alignment is still required before R34 production camera lock.
- HOLD — production-binary rights, master approval and WF5 exact-checksum promotion remain incomplete.

No customer-facing path references Candidate 02.

## Readiness movement
R34 moves from `camera-accepted-reconstruction-authorised` to `transparent-isolation-reviewable`.

F34 is unchanged:
- Candidate 04 SHA-256 `bab5e059a6da3a4b7455777c9e23e593ed851fcedb709d44e10bbe54847b6bd1`
- Candidate 05 intake/camera-transfer/exact-checksum review pipeline remains ready and waiting for the professional binary + completed manifest.

SIDE is unchanged:
- source-gap-confirmed;
- no square-on raw owner source;
- no candidate creation authorised.

R34 Candidate 01 is unchanged:
- SHA-256 `8d61ff21aa2bc0ec61122ab1641a232a6e2f3781c0601da6154593f15844a67b`
- camera acceptance remains reconstruction-only.

## Verification
- full `npm test`: PASS, including the new Candidate 02 regression.
- `npm run check`: PASS.
- 120 JavaScript files: syntax-valid, 0 failures.
- 29 JSON files: parse-valid, 0 failures.
- 16 HTML files / 247 local references: 0 missing dependencies.
- owner-supplied Y62 reference pack: 9/9 recorded hashes verified.
- deterministic Candidate 02 rebuild: PASS; candidate, mask, manifest and review-board hashes reproduce identically.
- customer exposure regression: PASS; Candidate 02 is absent from customer entrypoints/resolver paths tested.

## Next dependency
F34 remains first: receive professionally reconstructed `Y62-F34-V1-CANDIDATE-05` plus the completed provenance/rights intake manifest, then run the already prepared deterministic intake and exact-checksum review pipeline.

For R34 after F34 sequencing permits: perform identified exact-checksum edge review of Candidate 02, then execute a clean neutral/professional reconstruction against the accepted owner-source camera. Production camera lock remains blocked until F34-family alignment, production-binary rights, master approval and WF5 exact-checksum promotion all pass.
