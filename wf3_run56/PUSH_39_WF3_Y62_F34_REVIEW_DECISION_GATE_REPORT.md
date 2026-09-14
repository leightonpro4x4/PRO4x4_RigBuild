# PRO4X4 Rig Builder — Alpha 26 WF3 Push 39
## Y62-F34-V1 Candidate 04 — immutable identified-review decision gate

### Scope
Advanced **one WF3 package only**: `Y62-F34-V1-REVIEW-DECISION-GATE-01` for the existing `Y62-F34-V1-CANDIDATE-04` exact checksum.

No new canonical vehicle candidate, SIDE master, R34 master, catalogue/fitment work, customer UX, accessory layer, backend product feature, or production promotion was created in this push.

### Why this was the highest-priority unfinished package
Push 38 produced the exact-checksum Candidate 04 overlay evidence and `Y62-F34-V1-REVIEWER-SIGNOFF-02`, but the reviewer packet still had two checklist ambiguities before a real signoff could safely drive promotion:

1. factory Warrior wheel/tyre authenticity was visually represented but not separated into its own required semantic verdict; and
2. the remaining photographed reflection/detail residue was described as a review blocker but was not itself an explicit mandatory PASS / RETURN reviewer check.

The new decision gate closes those gaps without self-approving the candidate.

### Concrete progress
- Added immutable gate `Y62-F34-V1-REVIEW-DECISION-GATE-01`.
- Gate is pinned to:
  - candidate `Y62-F34-V1-CANDIDATE-04`;
  - candidate SHA-256 `bab5e059a6da3a4b7455777c9e23e593ed851fcedb709d44e10bbe54847b6bd1`;
  - overlay `Y62-F34-V1-OVERLAY-EVIDENCE-02` / SHA-256 `6b53745a23aaaedaf18d6f476381e0ff7192438e99d5dab7b556a7ff4d4afd96`;
  - reviewer packet `Y62-F34-V1-REVIEWER-SIGNOFF-02` / artifact SHA-256 `045c9891828df526e8336f13aab7428952d0b687e89aa0c63357482bdf759fab`.
- Owner-supplied 2025 Series 5 Y62 Warrior references remain the primary authenticity chain:
  - `OWNER-Y62-F34-01`;
  - `OWNER-Y62-F34-02`;
  - `OWNER-Y62-FRONT-01`;
  - `OWNER-Y62-FRONT-02`.
- All four owner source hashes were reverified against the files in the package.
- No external exact-vehicle image is accepted as production-pixel or production-approval evidence.
- The gate now requires **11 explicit semantic reviewer verdicts**:
  - identity;
  - stance;
  - factory wheels;
  - wheel centres;
  - silhouette;
  - roofline;
  - bumper corner;
  - headlamp anchor;
  - edge quality;
  - no invented accessories;
  - clean reconstruction.
- Clean reconstruction is now an explicit PASS / RETURN decision on the remaining photographed reflection/detail residue.
- A PASS is structurally valid only when:
  - the decision targets Candidate 04 exact SHA-256;
  - reviewer identity is present;
  - review timestamp is present;
  - every required semantic check is `pass`; and
  - `cameraGeometryMatched=true`.
- A RETURN is structurally valid only when at least one semantic check is returned and camera geometry remains unmatched.
- Even a valid reviewer PASS **does not promote** Candidate 04. It advances only to the separate production-binary-rights gate; WF5 exact-checksum promotion remains mandatory afterwards.
- Added staff-only decision-gate evidence board:
  - `assets/y62-canonical-candidates/Y62-F34-V1-review-decision-gate-v01.png`;
  - SHA-256 `97021196e2129573d6b6f1ca26d6421d67642de570c80f5e9938ab410761e763`.
- Added machine-readable gate JSON and JS decision validator.
- Updated Candidate 04 review state, camera profile, readiness matrix and WF3 workflow board to `review-decision-gate-ready` while retaining `master-draft`, `cameraMatched:false`, and `productionEligible:false`.

### Governance result
`REFERENCE_BACKED_APPROVED_VISUALS_ONLY` remains intact.

Candidate 04 remains:
- `master-draft`;
- exact checksum unchanged;
- `cameraGeometryMatched:false`;
- `productionEligible:false`;
- unavailable to customer resolver / quote imagery / accessory-layer compositing / production catalogue.

No guessed or unsupported geometry was introduced. No retouch envelope was widened. No external reference image was promoted. The decision-gate artifact itself is staff-only evidence and is not a customer production visual.

### Verification
- New targeted regression `tests/wf3-y62-f34-review-decision-gate-alpha26.js`: **PASS**.
- Gate validator rejects:
  - missing reviewer identity;
  - missing timestamp;
  - wrong/missing exact candidate checksum;
  - incomplete semantic checksets;
  - false PASS with a returned check;
  - PASS without `cameraGeometryMatched=true`.
- Gate validator accepts a structurally valid RETURN and routes it to rights-cleared professional reconstruction.
- Gate validator accepts a structurally valid hypothetical PASS but still reports `productionEligible:false` and routes next to production-binary rights.
- Full Alpha regression chain via `npm test`: **PASS**.
- `npm run check`: **PASS**.
- JavaScript syntax: **98 files / PASS**.
- JSON parsing: **17 files / PASS**.
- HTML/local dependency scan: **16 HTML files / 246 local references / 0 missing**.
- Customer entrypoint test confirms the decision gate ID and artifact are not exposed to customer production.
- Decision-gate artifact checksum verified at `97021196e2129573d6b6f1ca26d6421d67642de570c80f5e9938ab410761e763`.

### Next dependency
An **identified reviewer** must complete `Y62-F34-V1-REVIEW-DECISION-GATE-01` against Candidate 04 exact checksum.

- If any semantic item — especially clean reconstruction — is RETURNED, keep Candidate 04 review-only and route F34 to rights-cleared professional reconstruction. Do **not** widen the geometry-lock/retouch envelope by inference.
- If every semantic item PASSES and `cameraGeometryMatched=true`, separately record production-binary rights for the final binary. Only then may WF3 prepare a `master-approved` transition for WF5 exact-checksum promotion.

SIDE remains queued because the owner pack still lacks the required clean square-on source. R34 remains queued behind an accepted F34 canonical family.
