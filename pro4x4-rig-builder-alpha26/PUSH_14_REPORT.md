# Push 14 — Alpha 15 report

## Master workflow decision
The Y62 Warrior remains the production proof vehicle. Exact visual compositing remains the first visual milestone; no approximate product image was promoted.

## Advanced
- Added browser-side PNG/WebP candidate ingestion.
- SHA-256 is calculated from the actual selected file bytes.
- PNG/WebP metadata inspection records format, dimensions and alpha capability.
- Browser canvas inspection verifies whether transparent pixels actually exist; an alpha-capable format alone is not enough.
- Added `Y62-F34-V1`, the first locked camera profile, based on the approved Stage 02 front-three-quarter reference-board crop.
- Locked front-3/4 production canvas: **1672 × 615**.
- Candidate ingestion automatically resets camera match to false and requires a fresh manual overlay verification.
- Production approval is now server-blocked when a front-3/4 candidate does not match the locked canvas.
- Side and rear-3/4 profiles remain calibration-only, so they cannot be production-approved merely by ticking a match checkbox.
- Expanded asset metadata with inspected filename, byte size, inspection timestamp and alpha-capability evidence.

## Verified
- Existing reference board parses as PNG 1672 × 941 and is correctly identified as non-alpha RGB.
- SHA-256 generation returns a 64-character digest.
- Camera preflight accepts the locked canvas dimensions but still requires manual overlay verification.
- Incorrect 1672 × 941 front-3/4 candidate is rejected by the server production gate.
- Correct 1672 × 615 candidate with all other gates satisfied can be approved.
- Full regression suite remains passing.

## Important limitation
The current ingestion pipeline persists **metadata only**. It does not store the candidate binary. That is deliberate until object storage/CDN or a governed local asset directory is chosen.

## Next dependency
Obtain/create the first real transparent 1672 × 615 front-3/4 layer against `Y62-F34-V1`, starting with the clean Black Obsidian Warrior base. Once that exists, ingest it, clear provenance/rights, overlay-verify it, and promote it to the first genuine production-ready visual layer.
