# PRO4X4 Rig Builder — Alpha 26 WF1 Run 04

## Scope
WF1-only package from the latest merged Alpha 26 customer-configurator checkpoint.

The next planned WF1 package remains structured customer fitment-context capture, but it is still dependent on WF2 publishing governed question keys/options. WF1 therefore does not parse free-text fitment conditions or create a second source of fitment truth.

The highest-priority actionable unfinished WF1 package advanced here is **explicit customer catalogue navigation: category → manufacturer/vendor → product**.

No catalogue record, fitment truth, backend production rule, staff tool, project/quote contract, render asset or customer image was created or changed.

## Concrete progress

### 1. Explicit three-level browse path
The customer catalogue now exposes a dedicated browse hierarchy:
- **Category** selector;
- **Manufacturer** selector derived directly from the currently governed product catalogue;
- existing **product/vendor accordion** results filtered to the selected path.

Manufacturer choices are recalculated for the selected category and show live product counts. A manufacturer that is no longer valid after a category change is automatically reset to `ALL` rather than leaving the customer in an empty/stale state.

### 2. Visible browse breadcrumb + reset
The catalogue now shows the exact customer path, for example:

`ALL GEAR / PROTECTION / OFFROAD ANIMAL`

A single **RESET BROWSE** action returns the customer to the complete catalogue without changing the selected build.

### 3. Browse state is presentation-only
A new `customer-navigation.js` helper derives categories, manufacturers, counts and visible products from the existing authoritative catalogue records.

It does **not** own product identity, SKU, pricing, fitment, dependencies, visual readiness or catalogue persistence. Category/manufacturer browsing is not written into the immutable project/revision/share/quote snapshot.

Vehicle changes, loaded project revisions and undo/redo build snapshots reset the browse path safely without changing build lineage.

### 4. Mobile / accessibility pass
Category and manufacturer controls retain the existing PRO4X4 dark technical design direction and now:
- expose `aria-pressed` selection state;
- horizontally scroll on narrow screens rather than compressing labels into unreadable controls;
- preserve manufacturer counts and the browse breadcrumb on mobile.

### 5. Visual-governance rule unchanged
`REFERENCE_BACKED_APPROVED_VISUALS_ONLY` remains unchanged.

No image or fallback logic was added. Customer production still rejects reference-only, `master-draft`, `layer-draft` and unsupported visual output.

## Verification

### WF1 targeted navigation regression
`npm run test:wf1-browse` — **PASS**.

Verified:
- category derivation is deterministic;
- manufacturer lists are scoped to the selected category;
- manufacturer product counts reconcile exactly with the governed catalogue slice;
- category + manufacturer filtering returns only matching catalogue records;
- stale manufacturer selections reset to `ALL`;
- the browse breadcrumb reflects the exact navigation path;
- Ranger integration derives navigation from the existing catalogue rather than duplicating it;
- `customer-navigation.js` loads before the configurator runtime;
- vehicle/category/reset paths return browse state safely to `ALL`.

### Full Alpha regression chain
`npm test` — **PASS** across the complete Alpha 12 → Alpha 26 chain plus WF1 Run 02, Run 03 and the new Run 04 test.

### Server/runtime syntax gate
`npm run check` — **PASS**.

### Visual promotion / immutable lineage regression
`npm run test:wf5-promotion` — **PASS**.

This confirms the WF1 navigation package did not disturb staged visual isolation, reviewed master promotion, exact resolver behavior, immutable review evidence, or project → revision → share → quote visual lineage.

### WF5 acceptance status
`npm run test:wf5-acceptance` remains red **only** for the pre-existing separate WF4 issue:
- `WF1-BOM-ANYOF` — PASS;
- `WF5-CUSTOMER-DRAFT-ISOLATION` — PASS;
- `WF4-DIRECT-PRODUCTION-REVIEW` — FAIL (unchanged cross-workflow blocker).

No WF4 code was changed in this package.

### Static/integrity verification
- JavaScript syntax sweep — **87 files / 0 failures**;
- JSON parse sweep — **9 files / 0 failures**;
- HTML local dependency sweep — **16 HTML files / 240 local references / 0 missing**.

### File-scope check against WF1 Run 03
Runtime additions/changes are limited to:
- `customer-navigation.js` — new WF1 presentation helper;
- `index.html` — category/manufacturer browse controls + script load;
- `merged-app.js` — browse state/render wiring only;
- `merged.css` — browse path styling/responsive behavior;
- `package.json` — test/version metadata.

Verification addition:
- `tests/wf1-catalogue-browse-path-alpha26.js`;
- this report.

No `data-ranger.js`, `data-y62.js`, `merged-project-contract.js`, server/database file, asset registry, render manifest or visual candidate was modified.

## Next WF1 dependency
The next highest-value WF1 package remains **structured customer fitment-context capture** once WF2 provides governed question IDs, option sets and answer semantics for conditional manufacturer fitment. Until that contract exists, WF1 should continue showing the source conditions without assuming answers.

If that WF2 contract is still unavailable at the next WF1 push, the next independent WF1 package should be a save/share/quote review screen that summarizes the exact immutable revision, open fitment gates and exact visual state before customer submission — without changing backend or catalogue ownership.
