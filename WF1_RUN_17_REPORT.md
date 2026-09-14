# PRO4X4 Rig Builder — WF1 Run 17

## Package advanced

**Related-fitment inspection return continuity** — one WF1 package only.

The higher-priority structured customer fitment-context package remains blocked because the merged Alpha checkpoint still contains no WF2-owned governed question IDs, allowed answer values, answer semantics, or answer → dependency/conflict/staff-review mappings. WF1 therefore did not infer vehicle answers from manufacturer free text.

Run 17 advances the next independent WF1 package identified in Run 16: when a customer opens a governed required/support/conflict/replacement product from another product card, they can now return directly to the exact originating product and browse context without changing the build.

## Customer UX delivered

- A related-product inspection records only a transient presentation frame: originating governed product ID, target governed product ID, the originating category/vendor browse context, and the exact issue label that opened the inspection.
- The inspected product card now displays a PRO4X4-styled **RELATED FITMENT INSPECTION** strip showing why the customer arrived there and which governed product they came from.
- The strip exposes **← RETURN TO [ORIGIN PRODUCT]**. Returning restores the original category → manufacturer/vendor → product card, opens the correct vendor group, focuses/highlights the originating card, and confirms that the selected build did not change.
- Nested inspection is supported as a presentation trail. If an inspected governed item links to another governed fitment item, each return moves back one inspection step rather than discarding context.
- Deliberate catalogue navigation, vehicle changes, project/revision loads, undo/redo snapshot application, clear-build and ordinary build-summary trace navigation clear the transient inspection trail so stale return state cannot masquerade as catalogue truth.
- Existing pre-selection actions remain governed: `VIEW REQUIRED PART`, `VIEW OPTION`, `VIEW SELECTED SUPPORT`, `VIEW CONFLICT`, `VIEW CURRENT OPTION`, and `VIEW AFFECTED ITEM` still resolve only to actual catalogue product IDs already supplied by governed fitment/dependency data.

### Real governed proof

The Ranger lower bash plate can open `oa-predator` as one of its existing `anyOfRequiredParts` alternatives. The new inspection state records `oa-lower-bash-ranger` as the origin and returns to that exact lower-bash product card. It does not select Predator, choose between Predator/Toro, alter the BOM, or infer compatibility.

Manufacturer-only conditions with no governed product identity remain plain staff-review text and cannot create an inspection/return target.

## Ownership and backbone boundaries preserved

Run 17 adds `customer-constraint-inspection.js` as a presentation-only navigation contract. It does not own catalogue, fitment, project, quote, render, or asset truth.

The inspection trail is deliberately excluded from:

- selected BOM state;
- undo/build snapshot payloads;
- immutable project revisions;
- quote envelopes;
- share records;
- catalogue records;
- fitment rules;
- render requests/resolution;
- asset registry / visual candidates.

The unified immutable project → revision → share → quote backbone remains unchanged.

## Visual governance preserved

- Y62 remains the first production visual milestone.
- `REFERENCE_BACKED_APPROVED_VISUALS_ONLY` remains unchanged.
- Exact production resolver states remain `available / missing / blocked`.
- `fallbackPolicy: none` remains unchanged.
- Run 16 → Run 17 binary comparison found **15 visual files in each package and 0 added, removed, or changed visual files**.
- No product imagery, vehicle imagery, render manifests, canonical candidates, or asset-registry records were created or modified.

## Functional changes versus Run 16

- `customer-constraint-inspection.js` — new transient inspection/return presentation contract.
- `merged-app.js` — captures governed source-product context, renders the inspection return strip, performs one-step return, and clears stale transient inspection state on deliberate navigation/context changes.
- `merged.css` — PRO4X4 dark/orange styling for the return strip and responsive mobile treatment.
- `index.html` — loads the new presentation contract.
- `tests/wf1-constraint-inspection-return-alpha26.js` — targeted pure-contract + real Ranger + ownership-boundary regression.
- `tests/wf1-preselection-related-navigation-alpha26.js` — updated to verify that the new inspection wrapper still reuses the pre-existing exact catalogue trace path.
- `package.json` — version `0.26.20`, package description, regression registration.
- Verification evidence and this report.

No backend/server implementation, catalogue data, immutable project/quote schema, fitment rule, staff workflow, or visual asset was modified.

## Verification

Passed on the final Run 17 package:

- `npm run test:wf1-inspection-return`;
- complete `npm test` Alpha 12 → current Alpha 26 regression chain;
- `npm run check` server syntax gate;
- `npm run test:wf5-promotion`, including immutable reviewer evidence and project/share/quote visual lineage;
- static JavaScript syntax: **109 files / 0 failures**;
- JSON parse validation: **21 pre-evidence JSON inputs / 0 failures**;
- HTML local dependency validation: **16 HTML files / 250 local references / 0 missing**;
- Run 16 → Run 17 visual binary comparison: **0 visual changes**;
- final package ZIP integrity check (performed after packaging).

The managed Chromium customer journey was attempted and returned the existing environment-policy skip because local HTTP navigation is blocked. The browser test command itself exited successfully and classified the journey as skipped rather than failed.

The combined WF5 acceptance gate remains held only by the pre-existing separate WF4 defect:

- `WF1-BOM-ANYOF` — **PASS**;
- `WF5-CUSTOMER-DRAFT-ISOLATION` — **PASS**;
- `WF4-DIRECT-PRODUCTION-REVIEW` — **FAIL** because direct production upsert still accepts `master-approved` metadata without immutable `governance.reviewedBy` / `governance.reviewedAt` evidence.

WF1 Run 17 does not modify or mask that WF4 defect.

## Next dependency

The highest-priority unfinished WF1 dependency remains **structured customer fitment-context capture**. WF1 still requires a WF2-owned contract containing governed question IDs, allowed answer values, answer semantics, and answer → dependency/conflict/staff-review mappings before it can safely collect vehicle-specific setup facts without inventing compatibility.

If that governed contract is still absent at the next WF1 checkpoint, the next independent UX package is **handoff-review requirement return navigation**: make an open fitment/dependency line in the save/share/quote review return the customer to the exact governed product card/requirement before confirming the immutable handoff, without rebuilding or mutating the snapshot.
