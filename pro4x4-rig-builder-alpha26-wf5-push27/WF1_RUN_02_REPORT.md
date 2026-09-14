# WF1 Run 02 — Conditional Fitment Guidance

## Package advanced
**A26-WF1-04 — Pre-selection vehicle-setup / conditional-fitment UX**

This run advances one WF1 package only. It does not alter catalogue ownership, fitment truth, backend approval logic or visual assets.

## Implemented
- Manufacturer `fitment.conditions` are now visible on customer product cards before ADD.
- Conditions are deliberately separated from hard conflicts/dependencies so the configurator does not imply that a factory tow bar, T-slot mounting route, camera obstruction state or similar vehicle detail has already been satisfied.
- Conditional/review products use **ADD FOR REVIEW**; otherwise confirmed products with configuration conditions use **ADD — CHECK SETUP**.
- Selected-build rows retain the exact manufacturer conditions as **VEHICLE SETUP CHECK** notes.
- The fitment banner now distinguishes true PRO4X4 review gates from vehicle setup checks and other open fitment notes.
- Quote submission remains available; when setup checks exist, the success message makes clear that those checks remain visible to staff for confirmation.
- Existing immutable snapshot behaviour already clones each selected product's fitment object, so the source conditions travel with the saved revision/quote without inventing customer answers or adding a parallel data model.

## Governance preserved
- No product imagery was created or substituted.
- `REFERENCE_BACKED_APPROVED_VISUALS_ONLY` is unchanged.
- No fitment condition is auto-marked true.
- No catalogue record or shared visual/fitment contract is re-owned by WF1.
- Save/share/quote continue through the same immutable project/revision backbone.

## Verification
- `node --check merged-app.js` — PASS.
- New `tests/wf1-conditional-fitment-guidance-alpha26.js` — PASS.
- Full `npm test` Alpha 12 → Alpha 26 chain — PASS.
- `npm run check` server syntax gate — PASS.
- 82 JavaScript files — syntax PASS.
- 9 JSON files — parse PASS.
- Managed Chromium journey — SKIPPED because local HTTP navigation is blocked by the runtime policy (same environment limitation as prior gates).

## Next WF1 dependency
**Customer fitment-context capture only after WF2 defines governed question keys/options.** The UX can then collect structured answers such as factory tow-bar state or roller-shutter mounting route and preserve them immutably, without parsing free-text conditions or creating a second source of fitment truth. Until then, conditions remain visible and explicitly unassumed.
