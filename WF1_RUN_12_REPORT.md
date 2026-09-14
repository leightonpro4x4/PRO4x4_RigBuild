# PRO4X4 Rig Builder — WF1 Run 12

## Package advanced

**Exclusive-option replacement impact preview** — one WF1 package only.

The highest-priority blocked WF1 dependency remains structured customer fitment-context capture; the merged Alpha checkpoint still contains no WF2-owned governed question IDs, answer values, answer semantics, or answer-to-fitment-state mapping. WF1 therefore did not infer customer vehicle answers from manufacturer free text.

The highest-value independent WF1 defect was instead advanced: catalogue records already use governed `group` values to enforce one active product in families such as Ranger `front-bar`, `side-step` and `rear-bar`, but the customer add path could replace a selected same-group product without clearly explaining the replacement and its downstream dependency impact before the click.

## Concrete progress

- Extended the existing read-only `customer-product-guidance.js` presentation contract to derive same-group replacement impact from catalogue data already owned by WF2.
- Product cards now disclose **REPLACES SELECTED** before ADD whenever a same-group product is already in the build.
- The main product action becomes:
  - **REPLACE SELECTED** when the swap is otherwise clean; or
  - **REPLACE + REVIEW** when the swap will reopen a governed dependency/support requirement on another selected product.
- The replacement model evaluates the **post-replacement** selected set, including the candidate being added, so it does not create false warnings when the new product itself satisfies an existing governed requirement.
- Added exact accessible action text identifying the selected product(s) that will be replaced and the incoming product.
- Added PRO4X4-aligned replacement styling inside the existing **BEFORE YOU ADD** block; no new screen, navigation model or backend state was introduced.

## Governed Ranger proof cases

The new regression locks two important real-catalogue behaviours:

1. With `mcc-309bsbk` and its dependent `mcc-309rp` side rail selected, browsing `mcc-309bs` now states that the selected all-black side step will be replaced **and** that the side rail will reopen a required-support condition after that replacement.
2. With the Offroad Animal Predator bar and lower bash plate selected, browsing the Toro bar correctly identifies the Predator as the same-group replacement **without** claiming the lower bash plate will become unsupported, because the incoming Toro bar satisfies the existing governed `anyOfRequiredParts` rule.

No new fitment relationship, conflict, dependency or exclusivity rule was invented by WF1; the package only exposes the selection behaviour and dependencies already encoded in the merged catalogue contracts.

## Ownership / backbone protection

This package does not create or duplicate catalogue, fitment, project, quote or render ownership.

- `group`, `requires`, `fitment.requiredParts` and `fitment.anyOfRequiredParts` remain catalogue-owned inputs.
- WF1 only reads those fields to explain the effect of the existing selection behaviour.
- The existing selected-build mutation path remains authoritative; no alternate selection store was added.
- Immutable project → revision → share → quote persistence is unchanged.
- No project schema, quote schema, backend endpoint, catalogue write path or staff tool changed.

## Visual governance

`REFERENCE_BACKED_APPROVED_VISUALS_ONLY` remains unchanged.

- Y62 remains the first production visual milestone.
- Exact render resolver behaviour remains `available / missing / blocked` with `fallbackPolicy: none`.
- No product imagery, canonical vehicle master, accessory layer, manifest, asset-registry record, candidate or visual file was created or changed.
- Ranger continues to use catalogue/fitment proof messaging rather than stand-in vehicle imagery.

## Functional scope versus Run 11

Functional changes are limited to:

- `customer-product-guidance.js` — read-only exclusive replacement + downstream requirement impact derivation;
- `merged-app.js` — replacement-aware customer action labels / accessibility text;
- `merged.css` — replacement guidance state styling;
- `tests/wf1-exclusive-replacement-impact-alpha26.js` — targeted regression;
- `package.json` — version `0.26.15`, package description and test registration;
- Run 12 QA/report evidence.

No catalogue records, SKU/RRP/install/weight values, vehicle applicability, governed fitment truth, backend/server logic, project/quote contracts or visual assets changed.

## Verification

Passed:

- `npm run test:wf1-replacement`;
- existing `npm run test:wf1-preselection`;
- existing `npm run test:wf1-anyof`;
- existing `npm run test:wf1-summary-trace`;
- complete `npm test` Alpha 12 → current Alpha 26 regression chain;
- `npm run check` server syntax gate;
- `npm run test:wf5-promotion`, including immutable reviewer evidence and project/share/quote visual lineage;
- static JavaScript syntax: **101 files / 0 failures**;
- JSON parsing: **16 files / 0 failures**;
- HTML local dependency validation: **16 HTML files / 247 local references / 0 missing**;
- ZIP integrity check.

The Chromium journey was attempted and returned the existing managed-environment policy skip because local HTTP navigation is blocked. This is not a product-test failure.

The combined WF5 acceptance gate remains held only by the separate pre-existing WF4 issue:

- `WF1-BOM-ANYOF` — **PASS**;
- `WF5-CUSTOMER-DRAFT-ISOLATION` — **PASS**;
- `WF4-DIRECT-PRODUCTION-REVIEW` — **FAIL** because direct production upsert still accepts `master-approved` metadata without immutable `governance.reviewedBy` / `governance.reviewedAt` evidence.

WF1 Run 12 does not modify or mask that WF4 defect.

## Next dependency

The highest-priority unfinished WF1 dependency remains **structured customer fitment-context capture**. WF1 needs a WF2-owned contract containing governed question IDs, allowed answers, answer semantics and answer → dependency/conflict/staff-review mappings before the configurator can safely ask vehicle-specific fitment questions and use those answers without guessing.
