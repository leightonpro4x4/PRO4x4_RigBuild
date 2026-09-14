# PRO4X4 Rig Builder — WF1 Run 08

## Package advanced

**Build-summary traceability back to governed product constraints** — one WF1 package only.

This run closes the next independent customer-understanding gap after the pre-selection compatibility preview. Open dependency/fitment/setup items shown in **YOUR BUILD** can now take the customer directly back to the exact governed product card and manufacturer path that owns the requirement. The navigation is presentation-only; it does not create fitment truth, change BOM selections, or write project/quote state.

## Concrete progress

- Added `customer-build-trace.js`, a read-only navigation helper that resolves a governed product or persisted gate owner to its existing category → manufacturer → product target.
- Selected-build rows now show explicit trace actions for:
  - unresolved **REQUIRES ONE OF** support choices;
  - manufacturer **VEHICLE SETUP CHECK** conditions;
  - existing governed blocker/warning text from the selection gate.
- Clicking **VIEW IN CATALOGUE →**:
  - switches the browse state to the owning product's existing category;
  - switches the manufacturer filter to that product's existing brand/vendor;
  - re-renders the existing catalogue path;
  - opens the correct vendor group;
  - scrolls/focuses the exact governed product card;
  - applies a temporary PRO4X4 orange focus treatment;
  - leaves the selected BOM unchanged.
- Product cards expose only their existing governed `product.id` as a DOM trace key; no duplicate product identity or catalogue store was introduced.
- Build-row removal is now explicitly bound to `.merge-build-remove`, so the new trace action can never be mistaken for the destructive remove action.
- The hard support-choice banner now directs the customer to the build-summary trace route rather than leaving the unresolved requirement as a dead-end warning.
- Trace navigation does not call project save, quote submission, render resolution, catalogue mutation, or selection mutation.

## Scope protection

Diff against WF1 Run 07 confirms functional changes are limited to:

- `customer-build-trace.js` (new)
- `index.html`
- `merged-app.js`
- `merged.css`
- `tests/wf1-build-summary-trace-alpha26.js` (new)
- `package.json`
- this report and Run 08 QA evidence

No Ranger/Y62 catalogue data, fitment records, backend/server implementation, project/quote persistence contract, asset registry, render manifest, canonical candidate, or visual asset file was changed.

`REFERENCE_BACKED_APPROVED_VISUALS_ONLY`, exact-match production resolution, and `fallbackPolicy: none` remain unchanged. No product imagery was invented or added.

## Verification

Passed:

- `npm run test:wf1-summary-trace`
- governed Ranger integration: unresolved `oa-lower-bash-ranger` any-of gate resolves back to its existing `PROTECTION / Offroad Animal / oa-lower-bash-ranger` catalogue owner
- presentation immutability check: trace targeting does not mutate frozen catalogue records
- focus-path source check: trace navigation does not add/delete/clear `state.selected` and does not call save/quote/render endpoints
- complete `npm test` Alpha 12 → current Alpha 26 regression chain
- `npm run check`
- `npm run test:wf5-promotion`
- WF5 `WF1-BOM-ANYOF`: **PASS**
- WF5 customer draft-visual isolation: **PASS**
- JavaScript syntax validation: **95 files passed**
- JSON parsing: **9 files passed**
- HTML dependency validation: **16 HTML files / 244 local references / 0 missing**

The managed browser journey remains **skipped by environment policy** because local HTTP navigation is blocked; this is not a test failure. Static integration checks and the full regression chain are green.

The combined WF5 acceptance gate remains held only by the pre-existing **WF4-DIRECT-PRODUCTION-REVIEW** defect: direct production upsert still accepts `master-approved` metadata without immutable reviewer identity/timestamp. This WF1 run does not touch WF4.

## Next WF1 dependency

The highest-priority blocked WF1 package remains **structured customer fitment-context capture**. WF1 still requires a WF2-owned contract containing governed question IDs, allowed answers, answer semantics, and their mapping to fitment review state. Until that exists, WF1 must not infer customer questions or compatibility answers from free-text manufacturer notes.

If that contract is still unavailable at the next WF1 push, the next independent customer package should be **exact visual-state explainability**: expand the current approved/pending/review summary into a read-only explanation of the exact available/missing/blocked production state and no-fallback rule, without creating visual assets or duplicating resolver ownership.
