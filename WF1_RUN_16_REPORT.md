# PRO4X4 Rig Builder — WF1 Run 16

## Package advanced

**Pre-selection governed related-product navigation** — one WF1 package only.

The higher-priority structured customer fitment-context package remains blocked because this merged Alpha checkpoint still contains no WF2-owned governed question IDs, allowed answer values, answer semantics or answer → dependency/conflict/staff-review mappings. WF1 did not infer vehicle answers from manufacturer free text.

The highest-value independent WF1 gap advanced instead was the dead-end between a product card explaining a governed requirement/conflict and the customer actually finding the related governed product in the catalogue.

## Concrete progress

Product-card compatibility guidance is now directly inspectable before selection:

- a governed required part exposes **VIEW REQUIRED PART**;
- an unresolved governed `anyOfRequiredParts` relationship exposes each verified alternative as **VIEW OPTION**;
- an already satisfied OR dependency exposes **VIEW SELECTED SUPPORT**;
- a governed known conflict exposes **VIEW CONFLICT**;
- an exclusive-group replacement exposes **VIEW CURRENT OPTION**;
- a replacement consequence can expose **VIEW AFFECTED ITEM**.

Every action reuses the existing exact product trace path from Run 08. It opens the related product at its governed **category → manufacturer/vendor → product card**, focuses/highlights that exact record and updates the customer browse path without changing the selected BOM.

This closes an important usability gap in the pre-selection explanation flow: the customer can inspect what “requires”, “one of”, “conflicts with” or “replaces” actually refers to before making a selection decision, rather than manually hunting through the catalogue.

## Governed-data boundary

The new controls are presentation/navigation only.

- Related targets come only from existing `productId` / `productIds` emitted by the existing WF1 compatibility guidance over governed catalogue records.
- The navigation layer does not add, remove, replace or auto-select products.
- It does not write category, manufacturer, SKU, pricing, fitment, project, share, quote or render records.
- Existing direct resolution controls remain separate from inspection controls.
- Manufacturer-only/free-text constraint tokens do **not** receive invented catalogue links.

A real Y62 regression proves this boundary: `hbmc-lift` still carries the manufacturer constraint token `factory-warrior-50mm-lift` as `conflict-unmapped` / staff review, with no fabricated product identity or navigation target.

## Governed Ranger proof

The real Next-Gen Ranger lower bash plate remains governed by:

- `oa-predator`, **or**
- `oa-toro-ranger`.

Run 16 now exposes both exact governed alternatives as inspectable product paths before selection. WF1 still does not choose between them for the customer.

The existing MCC required-part path is also supported by the same UI treatment: required governed parts can be inspected before the parent product is added.

## Visual and backbone protection

No visual or persistence ownership changed.

- `REFERENCE_BACKED_APPROVED_VISUALS_ONLY` remains unchanged.
- Y62 remains the first production visual milestone.
- Exact production resolver states remain `available / missing / blocked`.
- `fallbackPolicy: none` remains unchanged.
- The immutable project → revision → share → quote backbone is untouched.
- No catalogue records, fitment rules, backend/server implementation, render manifests, canonical candidates, asset-registry records, product imagery or vehicle imagery were modified.
- Binary comparison against Run 15 found **15 visual files in each package and 0 changed visual files**.

## Functional scope versus Run 15

Functional changes are limited to:

- `merged-app.js` — non-mutating related-product inspection actions inside pre-selection compatibility rows;
- `merged.css` — PRO4X4-aligned styling for the new compatibility navigation controls;
- `tests/wf1-preselection-related-navigation-alpha26.js` — targeted governed-navigation regression;
- `package.json` — version `0.26.19`, package description and targeted regression registration;
- Run 16 verification evidence and this report.

No backend/server implementation, immutable project/quote schema, catalogue record, fitment rule, visual asset or staff tool was modified.

## Verification

Passed on the final Run 16 package:

- `npm run test:wf1-related-nav`;
- complete `npm test` Alpha 12 → current Alpha 26 regression chain;
- `npm run check` server syntax gate;
- `npm run test:wf5-promotion`, including immutable reviewer evidence and project/share/quote visual lineage;
- static JavaScript syntax: **107 files / 0 failures**;
- JSON parsing: **20 files / 0 failures**;
- HTML local dependency validation: **16 HTML files / 249 local references / 0 missing**;
- Run 15 → Run 16 visual binary comparison: **0 changed visual files**.

The managed Chromium journey was attempted and returned the existing environment-policy skip because local HTTP navigation is blocked. This is not a product-test failure.

The combined WF5 acceptance gate remains held only by the pre-existing separate WF4 defect:

- `WF1-BOM-ANYOF` — **PASS**;
- `WF5-CUSTOMER-DRAFT-ISOLATION` — **PASS**;
- `WF4-DIRECT-PRODUCTION-REVIEW` — **FAIL** because direct production upsert still accepts `master-approved` metadata without immutable `governance.reviewedBy` / `governance.reviewedAt` evidence.

WF1 Run 16 does not modify or mask that WF4 defect.

## Next dependency

The highest-priority unfinished WF1 dependency remains **structured customer fitment-context capture**. WF1 still requires a WF2-owned contract containing governed question IDs, allowed answer values, answer semantics and answer → dependency/conflict/staff-review mappings before the configurator can safely collect vehicle-specific setup facts without inventing compatibility.

If that contract remains absent, the next independent WF1 package should be **constraint-inspection return continuity**: after opening a required/support/conflict product from a pre-selection explanation, give the customer an explicit non-mutating route back to the originating product card and browse context without creating another catalogue/history model.
