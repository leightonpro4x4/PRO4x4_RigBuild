# PRO4X4 Rig Builder — WF1 Run 20

## Package advanced

**Persisted receipt BOM parity + non-mutating catalogue inspection** — one WF1 package only.

The higher-priority structured customer fitment-context capture package remains blocked: the merged Alpha checkpoint still contains no WF2-owned governed question IDs, allowed answer values, answer semantics, or answer → dependency/conflict/staff-review mappings. WF1 therefore did not infer customer setup answers from manufacturer free text.

Run 20 advances the next highest-value independent save/share/quote UX gap: the post-handoff receipt now exposes the exact selected BOM from the persisted immutable revision — product, vendor, SKU and persisted pricing values — and lets the customer inspect the matching current governed catalogue record without mutating the saved revision, selected BOM, submitted quote, or revision-locked share.

## Customer UX delivered

- The save/share/quote receipt now includes **EXACT SAVED BOM ON THIS REVISION**.
- Each persisted BOM row is derived from `persisted-revision.selections` and displays:
  - saved product name;
  - saved vendor/brand;
  - saved SKU;
  - saved product category;
  - persisted known line value;
  - persisted component values for parts / labour / paint / freight / engineering where recorded or required;
  - explicit `TBC` state for required pricing components that were missing on that saved revision.
- The receipt shows the persisted known build subtotal from the saved revision rather than recalculating it from the mutable builder/catalogue.
- Where the same governed product ID exists in the currently loaded catalogue, **INSPECT CURRENT CATALOGUE →** opens the exact category → manufacturer/vendor → product path.
- Catalogue inspection is explicitly labelled as non-mutating and warns that the current governed record may be newer than the persisted receipt record.
- If the saved product ID no longer exists in the current governed catalogue, no substitute product is invented; the receipt shows **CURRENT CATALOGUE RECORD UNAVAILABLE**.

### Real governed proof

The Ranger regression uses two existing governed records:

- `oa-lower-bash-ranger` / Offroad Animal / `BP-FRA-NG-22-ASM0`;
- `mcc-309bsbk` / MCC 4x4 / `309BSBK`.

The saved receipt model preserves the exact Ranger pricing state:

- lower bash: parts `$420`, required labour `TBC`, known line value `$420`;
- MCC side-step package: parts `$1,090`, labour `$390`, known line value `$1,480`;
- persisted known build value: `$1,900`;
- one required line-value component remains `TBC`.

The targeted regression mutates the caller-owned snapshot after the receipt model is built and proves the receipt retains the original saved product name, vendor, SKU and pricing values.

## Immutable-backbone and ownership boundaries preserved

Run 20 extends the existing `customer-handoff-receipt.js` presentation model only. It does not create a second catalogue, pricing, project, quote, share, or render model.

The receipt BOM inspection path does not write or own:

- catalogue records;
- SKU / RRP / install / mass data;
- fitment truth;
- customer selections;
- project revisions;
- queued quotes;
- share records/tokens;
- render requests/resolution;
- visual candidates, manifests, or asset-registry records.

The unified immutable **project → revision → share → quote** backbone remains unchanged. Mode-aware lineage messaging makes clear that:

- a submitted quote remains pinned to its submitted immutable revision;
- an existing share remains pinned to its shared immutable revision;
- an ordinary saved revision remains immutable;
- catalogue inspection cannot alter any of those persisted handoffs.

## Visual governance preserved

- Y62 remains the first production visual milestone.
- `REFERENCE_BACKED_APPROVED_VISUALS_ONLY` remains unchanged.
- Exact production resolver states remain `available / missing / blocked`.
- `fallbackPolicy: none` remains unchanged.
- Run 19 → Run 20 binary comparison found **15 visual files in each package and 0 added, removed, or changed visual files**.
- No product imagery, vehicle imagery, canonical candidate, render manifest, or asset-registry record was created or modified.

## Functional changes versus Run 19

- `customer-handoff-receipt.js`
  - receipt presentation schema advanced to `0.26.23`;
  - adds cloned persisted BOM rows sourced only from `snapshot.selections`;
  - retains saved product/vendor/SKU/category/pricing values and required-pricing TBC state;
  - adds exact source marker `persisted-revision.selections`;
  - exposes the saved catalogue revision for customer lineage context.
- `merged-app.js`
  - renders persisted BOM rows and component values in the receipt;
  - provides non-mutating exact-product catalogue inspection when the governed ID still exists;
  - refuses to fabricate a target when the current catalogue no longer contains the saved product ID;
  - adds quote/share/save lineage text confirming inspection cannot alter the persisted BOM.
- `merged.css`
  - adds PRO4X4 dark/orange receipt-BOM styling and responsive mobile layout.
- `tests/wf1-persisted-receipt-bom-parity-alpha26.js`
  - new persisted-value, clone-isolation, exact-ID navigation, no-selection-mutation, no-backend-write, and no-catalogue-ownership regression.
- `package.json`
  - version `0.26.23`;
  - targeted Run 20 regression registered in the complete Alpha chain.

No backend/server implementation, catalogue data, immutable project/quote schema, fitment rules, staff workflow, or visual asset was modified.

## Verification

Passed on the final Run 20 package:

- `npm run test:wf1-receipt-bom`;
- complete `npm test` Alpha 12 → current Alpha 26 regression chain;
- `npm run check` server syntax gate;
- `npm run test:wf5-promotion`, including immutable reviewer evidence and project/share/quote visual lineage;
- static JavaScript syntax: **113 files / 0 failures**;
- JSON parse validation: **26 pre-Run-20-evidence JSON inputs / 0 failures**;
- HTML local dependency validation: **16 HTML files / 251 local references / 0 missing**;
- Run 19 → Run 20 visual binary comparison: **0 visual changes**.

The managed Chromium customer journey was attempted and returned the existing environment-policy skip because local HTTP navigation is blocked. The browser command exited successfully and classified the journey as skipped rather than failed.

The combined WF5 acceptance gate remains held only by the pre-existing separate WF4 defect:

- `WF1-BOM-ANYOF` — **PASS**;
- `WF5-CUSTOMER-DRAFT-ISOLATION` — **PASS**;
- `WF4-DIRECT-PRODUCTION-REVIEW` — **FAIL** because direct production upsert still accepts `master-approved` metadata without immutable `governance.reviewedBy` / `governance.reviewedAt` evidence.

WF1 Run 20 does not modify or mask that WF4 defect.

## Next dependency

The highest-priority unfinished WF1 dependency remains **structured customer fitment-context capture**. WF1 still requires a WF2-owned governed contract containing:

- stable question IDs;
- permitted/typed answer values;
- customer-facing question/answer semantics;
- answer → dependency resolution mappings;
- answer → conflict/block mappings;
- answer → staff-review mappings;
- revision-safe persistence semantics for those answers.

Until that contract exists, WF1 should continue showing explicit dependency/setup review states rather than inventing vehicle compatibility from prose.
