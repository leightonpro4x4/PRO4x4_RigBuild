# PRO4X4 Rig Builder — WF1 Run 15

## Package advanced

**Immutable revision navigation + dirty-state protection** — one WF1 package only.

The higher-priority structured customer fitment-context package remains blocked because this merged Alpha checkpoint still contains no WF2-owned governed question IDs, allowed answer values, answer semantics or answer → fitment/dependency/staff-review mappings. WF1 did not infer these from manufacturer free text.

The highest-value independent package advanced instead was customer movement between existing immutable revisions without losing unsaved work or mutating project history.

## Concrete progress

- Added `customer-revision-navigation.js`, a read-only WF1 helper over the existing project/revision record.
- Added an **IMMUTABLE REVISION** navigator directly beneath the customer project status.
- Customers can now move backward/forward through saved revisions or select an exact saved revision from a list.
- Each revision option shows the existing immutable revision ID and selected-item count; the backend project `currentRevisionId` is marked **LATEST**.
- The customer is explicitly told whether they are viewing:
  - `LATEST` — the project’s current immutable revision;
  - `HISTORICAL` — an older immutable checkpoint;
  - `UNSAVED EDITS` — mutable on-screen work based on the active checkpoint.
- Historical revision navigation loads the **exact persisted snapshot** plus its separately stored revision-scoped browse context.
- Navigation updates the URL to the exact `project + revision` pair and preserves category/manufacturer/product-focus recovery from Run 14.
- Loading an older revision does **not** call `restoreProjectRevision`, alter `currentRevisionId`, increment project version, create a quote, create a share or write catalogue/fitment state.
- Editing a historical checkpoint is clearly described as branching from that checkpoint; the next save still appends a normal new immutable revision through the existing `saveProjectRevision` backbone.

## Dirty-state protection

Revision changes are now guarded whenever the on-screen build is dirty.

- Previous/next/select navigation detects unsaved changes before loading another revision.
- The PRO4X4 confirmation panel states that all saved revisions remain safe and that only the unsaved on-screen edits would be discarded.
- `KEEP WORKING` returns the customer to the dirty build without changing active revision.
- `DISCARD UNSAVED + LOAD` explicitly abandons only the mutable screen state and then loads the selected immutable revision.
- Cancelling the guard re-renders the selector back to the actually active revision, preventing the UI from implying that a revision changed when it did not.
- Existing save/share protection remains intact: dirty builds still cannot be shared until saved.

## Immutable backbone protection

This package does not add a second history model.

- The project → immutable revision → share → quote chain remains the only persisted build backbone.
- The revision navigator reads `project.revisions` and exact `revision.snapshot` records only.
- The helper deliberately returns `null` for an unknown revision ID instead of silently falling back to latest/current.
- Historical browsing never uses the backend restore mutation path.
- `buildPayload()` is not called during revision navigation.
- No catalogue ownership, fitment truth, pricing fields, staff workflow state or sales queue state is duplicated.

## Visual governance

`REFERENCE_BACKED_APPROVED_VISUALS_ONLY` remains unchanged.

- Y62 remains the first production visual milestone.
- Exact production resolver states remain `available / missing / blocked`.
- `fallbackPolicy: none` remains unchanged.
- The loaded immutable revision retains its saved visual-state lineage; WF1 does not invent or substitute artwork while navigating revisions.
- A binary visual-asset diff against Run 14 found **15 visual files in each package and 0 changed visual files**.
- No product imagery, vehicle imagery, render manifest, Y62 canonical candidate, asset-registry record or production layer changed.

## Functional scope versus Run 14

Functional changes are limited to:

- `customer-revision-navigation.js` — new read-only exact-revision navigation model;
- `merged-app.js` — revision navigator, exact snapshot load, historical-state messaging and dirty guard wiring;
- `index.html` — revision controls/guard UI and helper loading;
- `merged.css` — PRO4X4-aligned revision navigator and warning treatment;
- `tests/wf1-revision-navigation-alpha26.js` — targeted immutable navigation regression;
- `package.json` — version `0.26.18`, description and targeted test registration;
- Run 15 verification evidence and this report.

No backend/server implementation, immutable project/quote schema, catalogue record, fitment rule, visual asset or staff tool was modified.

## Verification

Passed on the final Run 15 package:

- `npm run test:wf1-revision-nav`;
- complete `npm test` Alpha 12 → current Alpha 26 regression chain;
- `npm run check` server syntax gate;
- `npm run test:wf5-promotion`, including immutable reviewer evidence and project/share/quote visual lineage;
- static JavaScript syntax: **106 files / 0 failures**;
- JSON parsing: **18 files / 0 failures**;
- HTML local dependency validation: **16 HTML files / 249 local references / 0 missing**;
- Run 14 → Run 15 visual binary comparison: **0 changed visual files**.

The managed Chromium journey was attempted and returned the existing environment-policy skip because local HTTP navigation is blocked. This is not a product-test failure.

The combined WF5 acceptance gate remains held only by the pre-existing separate WF4 defect:

- `WF1-BOM-ANYOF` — **PASS**;
- `WF5-CUSTOMER-DRAFT-ISOLATION` — **PASS**;
- `WF4-DIRECT-PRODUCTION-REVIEW` — **FAIL** because direct production upsert still accepts `master-approved` metadata without immutable `governance.reviewedBy` / `governance.reviewedAt` evidence.

WF1 Run 15 does not modify or mask that WF4 defect.

## Next dependency

The highest-priority unfinished WF1 dependency remains **structured customer fitment-context capture**. WF1 still requires a WF2-owned contract containing governed question IDs, allowed answer values, answer semantics and answer → dependency/conflict/staff-review mappings before the configurator can safely collect vehicle-specific setup facts without inventing compatibility.
