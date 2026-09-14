# PRO4X4 Rig Builder — WF1 Run 22

## Package advanced

**Persisted receipt customer/contact + build-notes parity** — one WF1 package only.

The higher-priority structured customer fitment-context capture package remains blocked because the merged Alpha checkpoint still contains no WF2-owned governed question IDs, permitted answer values, answer semantics, or answer → dependency/conflict/staff-review mappings. WF1 therefore did not infer compatibility from manufacturer free text.

Run 22 advances the next independent save/share/quote UX gap: after a handoff completes, the receipt now shows the exact customer/contact details and build notes that were stored on that immutable revision. It never refreshes those values from the mutable quote form after the save/share/quote action.

## Customer UX delivered

- New **CUSTOMER & BUILD NOTES ON THIS REVISION** receipt section.
- Displays persisted:
  - name;
  - preferred contact method;
  - phone;
  - email;
  - postcode;
  - build notes.
- Missing fields show **NOT RECORDED** rather than being guessed or backfilled.
- Missing notes show an explicit no-notes-recorded state.
- Multiline notes preserve their readable line breaks.
- The receipt labels its source as `persisted-revision.lead` and explains that later quote-form edits do not alter the saved receipt.

## Immutable backbone and ownership boundaries preserved

The existing immutable **project → revision → share → quote** backbone remains the only persisted authority.

- `customer-handoff-receipt.js` clones primitive lead/contact values from the persisted revision into the presentation model.
- `renderReceiptCustomer(...)` reads only `model.customer`.
- It does not call `leadFromForm()`, mutate selected products, save a project, create a quote/share, or resolve render state.
- Receipt customer data remains pinned even if caller-owned snapshot/form objects change after receipt creation.
- No backend/server contract, catalogue record, SKU/RRP/install/mass value, fitment rule, or staff workflow ownership changed.

## Visual governance preserved

- Y62 remains the first production visual milestone.
- `REFERENCE_BACKED_APPROVED_VISUALS_ONLY` remains unchanged.
- Exact production states remain `available / missing / blocked`.
- `fallbackPolicy: none` remains unchanged.
- Run 21 → Run 22 visual binary comparison found **15 visual files in both packages and 0 added, removed, or changed visual files**.
- No product imagery, vehicle imagery, canonical candidate, render manifest, or asset-registry record was created or modified.

## Functional changes versus Run 21

- `customer-handoff-receipt.js`
  - presentation schema advanced to `0.26.25`;
  - adds immutable `customer` detail sourced from `snapshot.lead`;
  - exposes `snapshotSource: persisted-revision.lead`.
- `merged-app.js`
  - adds `renderReceiptCustomer(...)`;
  - inserts exact saved customer/contact/build-note detail into save/share/quote receipts.
- `merged.css`
  - adds PRO4X4 dark/orange receipt treatment with responsive customer/contact grid and notes block.
- `tests/wf1-persisted-receipt-customer-parity-alpha26.js`
  - verifies exact persisted values, empty states, snapshot non-mutation, post-build caller mutation isolation, and prohibition on mutable-form refresh/writes.
- Existing receipt BOM/share tests were updated only for the receipt presentation schema version.
- `package.json`
  - version advanced to `0.26.25` and Run 22 regression added to the complete Alpha chain.

## Verification

Passed on the final Run 22 package:

- targeted Run 22 customer/contact/build-notes regression — **PASS**;
- complete `npm test` Alpha 12 → current Alpha 26 regression chain — **PASS**;
- `npm run check` server syntax gate — **PASS**;
- `npm run test:wf5-promotion` immutable promotion/lineage gate — **PASS**;
- JavaScript syntax validation — **115 files / 0 failures**;
- JSON parse validation — **30 pre-Run-22 evidence JSON inputs / 0 failures**;
- HTML local dependency validation — **16 HTML files / 251 local references / 0 missing**;
- Run 21 → Run 22 visual binary comparison — **0 visual changes**.

Managed Chromium journey was attempted and returned the existing environment-policy skip because local HTTP navigation is blocked. The browser test itself exited successfully and classified the journey as skipped rather than failed.

The combined WF5 acceptance gate remains held only by the existing separate WF4 defect:

- `WF1-BOM-ANYOF` — **PASS**;
- `WF5-CUSTOMER-DRAFT-ISOLATION` — **PASS**;
- `WF4-DIRECT-PRODUCTION-REVIEW` — **FAIL** because direct production upsert still accepts `master-approved` metadata without immutable `governance.reviewedBy` / `governance.reviewedAt` evidence.

WF1 Run 22 does not modify or mask that WF4 defect.

## Next dependency

The highest-priority unfinished WF1 dependency remains **structured customer fitment-context capture**. WF1 still requires a WF2-owned governed contract containing stable question IDs, permitted/typed answers, customer-facing semantics, answer → dependency/conflict/staff-review mappings, and revision-safe persistence semantics.

Until that contract exists, WF1 should continue exposing explicit fitment/setup review states rather than manufacturing compatibility from prose. If the dependency remains unavailable at the next checkpoint, the next independent WF1 package should be **persisted receipt vehicle-state parity** so the receipt can expose the exact saved vehicle paint / wheel-tyre / configured-view identifiers from the immutable revision without refreshing them from current catalogue defaults.
