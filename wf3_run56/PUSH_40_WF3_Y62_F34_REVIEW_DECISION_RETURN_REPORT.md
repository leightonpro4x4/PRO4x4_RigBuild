# PRO4X4 Rig Builder — Alpha 26 WF3 Push 40
## Y62-F34-V1 Candidate 04 — conservative review decision RETURN

### Scope
Advanced **one WF3 package only**: `Y62-F34-V1-REVIEW-DECISION-01` against the existing `Y62-F34-V1-CANDIDATE-04` exact checksum.

No new canonical vehicle candidate, SIDE/R34 master, accessory layer, catalogue/fitment work, customer UX, or production promotion was created. Candidate 04 pixels are unchanged.

### Why this was the highest-priority unfinished package
Push 39 made `Y62-F34-V1-REVIEW-DECISION-GATE-01` structurally ready. The immediate unresolved dependency was the explicit PASS/RETURN disposition for Candidate 04, especially the mandatory `clean-reconstruction` check.

The owner-supplied 2025 Series 5 Y62 Warrior reference set remains the primary authenticity evidence:
- `OWNER-Y62-F34-01` / `IMG_4030.jpeg` / SHA-256 `400a6e3f7fddeb5dba175173491ddd2bab62c0cea6fd286b5c4e6119d9a72fdc`
- `OWNER-Y62-F34-02` / `IMG_3762.jpeg` / SHA-256 `5a3f5209582446cb21622c7c4a5b2741437c55095c7ce7276a9c22e6adb1dfd4`
- `OWNER-Y62-FRONT-01` / `IMG_4028.jpeg` / SHA-256 `96e9d873a7fc7eeff48a95eab46896e4572549c8e6a8e286e631a269d42cfb8e`
- `OWNER-Y62-FRONT-02` / `IMG_4512.jpeg` / SHA-256 `8fabad7df166ce1ac3e95b5fe38f13572e1d86e2c2d21343917a0842321d5739`

### Concrete progress
- Added immutable decision record `Y62-F34-V1-REVIEW-DECISION-01`.
- Candidate 04 exact SHA-256 remains unchanged: `bab5e059a6da3a4b7455777c9e23e593ed851fcedb709d44e10bbe54847b6bd1`.
- Decision reviewer is explicitly identified as `OPENAI-WF3-VISUAL-QA-01` with class `automated-visual-qa` and **return-only authority**.
- The automated reviewer is explicitly not authorised to issue a PASS, master approval, production-rights approval, or WF5 promotion.
- Decision: **RETURN**.
- `cameraGeometryMatched` remains `false`.
- Ten semantic checks retain PASS evidence:
  - identity;
  - stance;
  - factory wheels;
  - wheel centres;
  - silhouette;
  - roofline;
  - bumper corner;
  - headlamp anchor;
  - edge quality;
  - no invented accessories.
- Mandatory `clean-reconstruction` check is **RETURN**.
- Return basis:
  - strong owner-source roller-door / corrugated-building reflection bands remain materially visible across the side glass and bodywork;
  - photographed environment reflections remain on the windscreen and bonnet;
  - removing those safely requires a rights-cleared professional reconstruction rather than widening the automated retouch envelope or inventing surfaces.
- Updated Candidate 04 review state to `returned-professional-reconstruction-required`.
- Updated camera/view contract, readiness matrix and WF3 workflow board to the returned state.
- Updated the staff-only canonical review page to show the RETURN disposition.
- Customer production remains blocked and customer entrypoints remain unchanged.

### Governance result
`REFERENCE_BACKED_APPROVED_VISUALS_ONLY` remains intact.

Candidate 04 remains:
- `master-draft`;
- exact checksum unchanged;
- `cameraGeometryMatched:false`;
- `productionEligible:false`;
- unavailable to customer resolver, quote imagery, product-layer compositing, and production catalogue.

No guessed or unsupported geometry was introduced. No retouch envelope was widened. No external exact-vehicle image contributes production pixels or approval evidence.

### Verification
- New targeted regression `tests/wf3-y62-f34-review-decision01-alpha26.js`: **PASS**.
- The recorded decision validates through the existing immutable review-gate rules and routes to `rights-cleared-professional-reconstruction`.
- Full Alpha regression via `npm test`: **PASS**.
- `npm run check`: **PASS**.
- JavaScript syntax: **100 files / PASS**.
- JSON parsing: **17 files / PASS**.
- HTML/local dependency scan: **16 HTML files / 246 local references / 0 missing**.
- Candidate 04 checksum reverified unchanged.
- All four owner-reference hashes reverified unchanged.
- Customer `index.html` does not expose the decision record or candidate binary.
- No canonical vehicle image file changed during this push.

### Next dependency
Produce a **rights-cleared professional F34 reconstruction** against the locked owner-backed silhouette/camera/wheel geometry.

The next binary must:
1. remove the returned photographed reflection residue without widening the automated geometry lock by inference;
2. preserve the authenticated Series 5 Warrior geometry and factory rolling-stock evidence;
3. record its own exact checksum and production provenance;
4. regenerate the F34 exact-checksum overlay and reviewer evidence from scratch; and
5. remain non-production until clean review, production-binary rights, master approval and WF5 exact-checksum promotion all pass.

SIDE remains queued behind the missing clean square-on owner source. R34 remains queued behind an accepted F34 canonical family.
