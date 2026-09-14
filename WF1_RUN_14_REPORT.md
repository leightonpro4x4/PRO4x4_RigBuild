# PRO4X4 Rig Builder — WF1 Run 14

## Package advanced

**Browse-state / selected-state recovery after immutable project load and undo/redo** — one WF1 package only.

The highest-priority blocked WF1 dependency remains structured customer fitment-context capture. The merged Alpha checkpoint still has no WF2-owned governed question IDs, allowed answers, answer semantics or answer → fitment-state mappings, so WF1 did not invent vehicle questions or convert manufacturer free text into compatibility truth.

The highest-value independent WF1 package advanced in this run was customer editing continuity. Before this change, undo/redo reset catalogue browsing to `ALL GEAR`, and reopening an immutable saved revision also reset the customer to the catalogue root even when they had been editing a specific selected product. That made larger builds unnecessarily difficult to resume.

## Concrete progress

- Added `customer-browse-session.js`, a read-only presentation-state helper that is deliberately separate from the immutable build/project contract.
- Undo/redo snapshots now retain the current presentation context alongside the existing in-memory build history:
  - category;
  - manufacturer/vendor;
  - selected-product focus identity.
- Undo and redo now restore that exact valid browse context rather than forcing `ALL GEAR / ALL MANUFACTURERS`.
- Saved project revision loads now recover a revision-scoped customer browse context from local presentation storage using the exact `projectId + revisionId` pair.
- If no local presentation cache exists, a safe selected-product fallback opens a real selected product using the current governed catalogue rather than inventing a category/vendor association.
- Restored product focus is validated against all three conditions before it is shown:
  - the product still exists in the current vehicle catalogue;
  - the product is actually selected on that immutable revision/current history state;
  - the product belongs to the restored category/vendor scope.
- Recovered selected-product context opens the correct manufacturer group, scrolls/focuses the exact product card and uses a short PRO4X4-aligned restore highlight.
- Clean saved revisions update their presentation cache when the customer changes category/manufacturer, resets browse state or uses `EDIT IN CATALOGUE` / requirement trace navigation.
- Dirty unsaved changes are explicitly prevented from overwriting the presentation cache for the last immutable revision.
- Saving a new immutable revision creates a new revision-scoped presentation cache for that revision.
- Project-load messaging now tells the customer which browse path was restored.

## Immutable backbone protection

Browse recovery remains UI-only and is not persisted into the project snapshot, quote envelope, catalogue or backend.

- `buildPayload()` remains unchanged and receives no category, vendor, focused-product or browse-session fields.
- The project → revision → share → quote lineage remains the single immutable backbone.
- Presentation state is keyed separately by exact project/revision only for local UX continuity.
- Dirty edits cannot rewrite the cache of the last immutable revision.
- Catalogue ownership remains read-only: the helper validates existing product ID/category/brand records but never writes them.
- No alternate selected-build store, duplicate catalogue index, fitment source or backend endpoint was introduced.

## Governed Ranger proof

The targeted regression validates the new recovery contract against the current governed Ranger catalogue. A saved context for selected MCC product `mcc-309rp` correctly resolves to:

- category `PROTECTION`;
- manufacturer `MCC 4x4`;
- exact focused selected product `mcc-309rp`.

Invalid or stale product/category/vendor references are normalised away instead of being treated as catalogue truth.

## Visual governance

`REFERENCE_BACKED_APPROVED_VISUALS_ONLY` remains unchanged.

- Y62 remains the first production visual milestone.
- Exact render resolver states remain `available / missing / blocked`.
- `fallbackPolicy: none` remains unchanged.
- No product imagery, vehicle imagery, canonical candidate, render manifest, asset-registry record, production layer or reference file was created or modified.
- Ranger still receives no stand-in customer render.

## Functional scope versus Run 13

Functional changes are limited to:

- `customer-browse-session.js` — new read-only revision-scoped presentation recovery helper;
- `merged-app.js` — history/load/save/browse continuity wiring;
- `index.html` — loads the helper before the customer app;
- `merged.css` — restored-product focus treatment;
- `tests/wf1-browse-session-recovery-alpha26.js` — targeted recovery regression with governed Ranger proof;
- three existing WF1 regex regressions updated only to tolerate the new non-mutating browse continuity statements;
- `package.json` — version `0.26.17`, description and targeted test registration;
- Run 14 verification evidence and this report.

No backend/server implementation, catalogue records, immutable project/quote schemas, fitment truth, render manifests, visual assets or staff tooling changed.

## Verification

Passed on the final Run 14 package:

- `npm run test:wf1-browse-recovery`;
- existing `npm run test:wf1-selection-nav`;
- existing `npm run test:wf1-browse`;
- existing `npm run test:wf1-summary-trace`;
- complete `npm test` Alpha 12 → current Alpha 26 regression chain;
- `npm run check` server syntax gate;
- `npm run test:wf5-promotion`, including immutable reviewer evidence and project/share/quote visual lineage;
- static JavaScript syntax: **104 files / 0 failures**;
- JSON parsing: **18 files / 0 failures**;
- HTML local dependency validation: **16 HTML files / 248 local references / 0 missing**.

The Chromium journey was attempted and returned the existing managed-environment policy skip because local HTTP navigation is blocked. This is not a product-test failure.

The combined WF5 acceptance gate remains held only by the separate pre-existing WF4 issue:

- `WF1-BOM-ANYOF` — **PASS**;
- `WF5-CUSTOMER-DRAFT-ISOLATION` — **PASS**;
- `WF4-DIRECT-PRODUCTION-REVIEW` — **FAIL** because direct production upsert still accepts `master-approved` metadata without immutable `governance.reviewedBy` / `governance.reviewedAt` evidence.

WF1 Run 14 does not modify or mask that WF4 defect.

## Next dependency

The highest-priority unfinished WF1 dependency remains **structured customer fitment-context capture**. WF1 still requires a WF2-owned contract containing governed question IDs, allowed answer values, answer semantics and answer → dependency/conflict/staff-review mappings before the configurator can safely capture vehicle-specific setup facts without inventing compatibility.

If that contract remains absent on the next WF1 push, the next independent package should be **revision navigation + dirty-state protection**: make movement between existing immutable revisions explicit in the customer configurator, including a clear warning when unsaved edits would be abandoned, while continuing to use the existing project/revision backbone rather than creating a second history model.
