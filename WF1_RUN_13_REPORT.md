# PRO4X4 Rig Builder — WF1 Run 13

## Package advanced

**Selection-aware catalogue navigation + build editing continuity** — one WF1 package only.

The highest-priority unfinished WF1 dependency remains structured customer fitment-context capture. The latest merged Alpha checkpoint still contains no WF2-owned fitment question contract: no governed question IDs, allowed answers, answer semantics or answer-to-fitment-state mapping. WF1 therefore did not invent vehicle questions or derive customer compatibility from manufacturer free text.

The highest-value independent WF1 issue advanced in this run was browse continuity once a customer has started building a rig. Category and manufacturer navigation previously showed catalogue counts but not where the customer's current selections lived, and a normal selected item in **YOUR BUILD** could only be removed unless it happened to have an unresolved requirement trace action. This becomes increasingly costly as the catalogue grows.

## Concrete progress

- Added read-only selection-aware navigation statistics to `customer-navigation.js`:
  - `categoryRows(products, selectedIds)`;
  - `vendorRows(products, category, selectedIds)`;
  - `visibleSelectionCount(products, category, vendor, selectedIds)`.
- Category controls now show:
  - governed product count; and
  - `N SELECTED` when the current build contains products in that category.
- Manufacturer controls now show the same selected-state context inside the active category.
- The browse result header now states how many products in the current category/manufacturer view are already selected: `N SELECTED IN VIEW`.
- Every selected item in **YOUR BUILD** now exposes **EDIT IN CATALOGUE →**.
- Editing a selected item reuses the existing exact product trace path:
  - sets the existing category;
  - sets the existing manufacturer/vendor;
  - opens the correct vendor group;
  - focuses/highlights the exact governed product card;
  - does not change the selected BOM.
- Removal remains a separate explicit control, so navigating back to a selected product cannot accidentally mutate the build.

## Governed Ranger proof

The targeted regression loads the current governed Ranger catalogue and proves that selection badges are derived from the catalogue and current selected IDs rather than hard-coded UI ownership. With the governed MCC side step and side rail selected:

- `ALL GEAR` reports two selected items;
- `PROTECTION` reports those same two selected items;
- the `MCC 4x4` manufacturer row reports two selected items; and
- `Offroad Animal` correctly reports zero for that same selection.

No category, brand, product, fitment or selection relationship is created by WF1.

## Ownership / backbone protection

This package remains presentation-only.

- Category, manufacturer/vendor and product identity remain catalogue-owned.
- WF1 reads the current governed catalogue and the existing customer selection Set only to derive counts/navigation context.
- No catalogue write path, duplicate product index, alternate selected-build store or backend ownership was added.
- Existing immutable project → revision → share → quote persistence is unchanged.
- Save/share/quote snapshot construction is unchanged.
- Existing pre-selection dependency/conflict and exclusive-replacement behavior is unchanged.

## Visual governance

`REFERENCE_BACKED_APPROVED_VISUALS_ONLY` remains unchanged.

- Y62 remains the first production visual milestone.
- Exact render resolver states remain `available / missing / blocked`.
- `fallbackPolicy: none` remains unchanged.
- No product imagery, vehicle imagery, canonical candidate, render manifest, asset-registry record, production layer or reference file was created or modified.
- Ranger still receives no stand-in customer render.

## Functional scope versus Run 12

Functional changes are limited to:

- `customer-navigation.js` — read-only selection-aware category/vendor/view statistics;
- `merged-app.js` — selected-count badges/header and edit-selected-item navigation;
- `merged.css` — PRO4X4-aligned selected-count and edit-link presentation;
- `tests/wf1-selection-aware-navigation-alpha26.js` — targeted regression including governed Ranger proof;
- `package.json` — version `0.26.16`, description and targeted test registration;
- Run 13 verification evidence and this report.

No backend/server, catalogue records, immutable project/quote schemas, render manifests, visual assets or staff tooling changed.

## Verification

Passed on the final Run 13 package:

- `npm run test:wf1-selection-nav`;
- existing `npm run test:wf1-browse`;
- existing `npm run test:wf1-summary-trace`;
- existing `npm run test:wf1-preselection`;
- existing `npm run test:wf1-replacement`;
- existing `npm run test:wf1-anyof`;
- complete `npm test` Alpha 12 → current Alpha 26 regression chain;
- `npm run check` server syntax gate;
- `npm run test:wf5-promotion`, including immutable reviewer evidence and project/share/quote visual lineage;
- static JavaScript syntax: **102 files / 0 failures**;
- JSON parsing: **17 files / 0 failures**;
- HTML local dependency validation: **16 HTML files / 247 local references / 0 missing**.

The Chromium journey was attempted and returned the existing managed-environment policy skip because local HTTP navigation is blocked. This is not a product-test failure.

The combined WF5 acceptance gate remains held only by the separate pre-existing WF4 issue:

- `WF1-BOM-ANYOF` — **PASS**;
- `WF5-CUSTOMER-DRAFT-ISOLATION` — **PASS**;
- `WF4-DIRECT-PRODUCTION-REVIEW` — **FAIL** because direct production upsert still accepts `master-approved` metadata without immutable `governance.reviewedBy` / `governance.reviewedAt` evidence.

WF1 Run 13 does not modify or mask that WF4 defect.

## Next dependency

The highest-priority unfinished WF1 dependency remains **structured customer fitment-context capture**. WF1 still requires a WF2-owned contract containing governed question IDs, allowed answers, answer semantics and answer → dependency/conflict/staff-review mappings before the customer configurator can safely capture vehicle-specific setup facts without inventing compatibility.

If that contract is still absent on the next WF1 push, the next independent WF1 package should be **browse-state / selected-state recovery after immutable project load and undo/redo**: make the customer return to the exact selected product/category context when editing an existing revision while preserving the current project lineage and without persisting presentation-only browse filters into the immutable build contract.
