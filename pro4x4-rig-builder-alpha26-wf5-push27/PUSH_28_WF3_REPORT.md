# Push 28 — WF3 Y62 Visual Production

## Package advanced
**A26-WF3-03 — first reviewable `Y62-F34-V1` canonical-master candidate**

## Concrete progress
- Produced `Y62-F34-V1-CANDIDATE-01`, a genuine owner-source geometry board on the locked 1672 × 615 F34 canvas.
- Candidate uses `OWNER-Y62-F34-01` as its primary source and binds the exact reference set already approved in the F34 brief.
- No vehicle body, Warrior wheel/tyre, trim or accessory geometry was synthesized. The source photograph is only scaled/centred inside a neutral review canvas.
- Added a versioned WF3 candidate manifest (`y62-canonical-candidates.js`) with provenance, checksum, governance state, review gates and explicit blockers.
- Bound the candidate into the locked `Y62-F34-V1` camera profile while retaining `master-draft` and `hasAlpha:false`.
- Added `y62-canonical-review.html` so staff can review the candidate beside the three primary owner references.

## Governance outcome
This is deliberately **not** a production master. It remains `master-draft` because:
1. camera/perspective still needs manual acceptance as the canonical F34 family target;
2. the genuine photographed background remains present;
3. transparent isolation / clean canonical reconstruction has not been completed;
4. locked-profile manual overlay verification has not been completed.

This preserves `REFERENCE_BACKED_APPROVED_VISUALS_ONLY` and creates a reviewable visual checkpoint without pretending the final canonical render exists.

## Verification
- New candidate asset checksum verified against manifest.
- Exact 1672 × 615 canvas verified.
- All bound references are owner-project-approved references in the locked Y62 pack.
- Candidate is asserted non-production-eligible.
- Camera profile binding is asserted as `master-draft`, non-alpha.
- Existing Alpha regression suite remains the merge gate.

## Next WF3 dependency
Produce the first **clean transparent reconstruction candidate** for `Y62-F34-V1` using this approved owner-backed geometry target. It must preserve the MY25 Series 5 Warrior body/fascia, factory Warrior rolling stock and real stance, then pass manual overlay verification before `master-approved` is possible.

SIDE and R34 remain queued behind F34; SIDE still has the known raw side-profile geometry gap.
