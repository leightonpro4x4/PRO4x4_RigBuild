# PRO4X4 Rig Builder — WF1 Run 25

## Package advanced

**Persisted receipt pricing-state parity + immutable reconciliation messaging** — one WF1 package only.

The higher-priority **structured customer fitment-context capture** package remains blocked. A fresh checkpoint scan still found no WF2-owned governed `questionId`, permitted-answer, answer-semantics, or answer → fitment/dependency/staff-review contract, so WF1 did not invent setup questions or compatibility truth.

Run 25 advances the next independent save/share/quote UX integrity gap: the completed immutable handoff receipt now exposes the exact aggregate pricing state saved on that revision and reconciles it only against the exact persisted BOM on the same revision. It never refreshes current catalogue pricing or silently repairs a historical saved record.

## Customer UX delivered

A new **PRICING STATE LOCKED TO THIS REVISION** receipt section now shows:

- saved currency;
- saved tax mode;
- saved known subtotal;
- persisted BOM line-known subtotal;
- saved parts / labour / paint / freight / engineering component totals;
- saved required-TBC counts by pricing component;
- explicit reconciliation state between persisted aggregate pricing and persisted BOM line values.

The customer-facing state is classified as:

- **SAVED PRICING RECORD NEEDS REVIEW** — persisted aggregate subtotal/components and/or TBC counts disagree with the persisted BOM;
- **SAVED PRICING SUMMARY INCOMPLETE** — aggregate pricing fields are absent from the immutable revision;
- **SAVED PRICING RECONCILED · VALUES TBC** — saved totals reconcile but one or more required values remain TBC;
- **SAVED PRICING RECORD RECONCILED** — saved aggregate totals, persisted BOM known line values and required-value counts agree with no required TBC values outstanding.

The receipt explicitly states that current catalogue prices, promotions and later staff adjustments are **not backfilled** into the immutable receipt.

## Persisted-pricing integrity behaviour

The real governed Ranger regression uses:

- `oa-lower-bash-ranger` — $420 persisted parts value with labour TBC;
- `mcc-309bsbk` — $1,090 parts + $390 labour.

The persisted revision therefore records:

- known subtotal: **$1,900**;
- persisted parts total: **$1,510**;
- persisted labour total: **$390**;
- required labour values still TBC: **1**.

Run 25 verifies the receipt reports those exact saved values and does not change if caller-owned snapshot pricing or BOM values are subsequently mutated.

Synthetic immutable-record integrity cases also prove that:

- changing the saved aggregate subtotal to $2,000 while leaving persisted BOM lines unchanged produces **SAVED PRICING RECORD NEEDS REVIEW**;
- changing the saved TBC count without changing persisted line requirements also produces the mismatch state;
- a fully persisted/priced Ranger side-step revision reconciles at **$1,480** and is presented as complete;
- deleting persisted aggregate component totals produces **SAVED PRICING SUMMARY INCOMPLETE** rather than reconstructing them from current catalogue data.

## Immutable backbone and ownership boundaries preserved

The unified immutable **project → revision → share → quote** backbone remains the only persisted authority.

- `pricingDetail(...)` reads only `persisted-revision.pricing` plus the already-persisted BOM presentation derived from `persisted-revision.selections`.
- It does not query current catalogue products, promotions, server pricing, staff adjustments, render state, or any backend endpoint.
- A mismatch is surfaced as review-required; WF1 does not rewrite or repair the revision.
- No selected BOM state, project revision, share, quote, catalogue record, fitment rule, backend contract or sales ownership changed.
- Existing receipt BOM/customer/vehicle/mass/share presentation schemas were advanced only to the new receipt presentation version `0.26.28`.

## Y62 / visual governance preserved

- Y62 remains the first production visual milestone.
- `REFERENCE_BACKED_APPROVED_VISUALS_ONLY` remains unchanged.
- Exact production visual states remain `available / missing / blocked`.
- `fallbackPolicy: none` remains unchanged.
- Run 24 → Run 25 binary comparison found **15 visual files in both packages and 0 added, removed or changed visual files**.
- No product imagery, vehicle imagery, canonical candidate, render manifest or asset-registry record was created or modified.

## Functional changes versus Run 24

- `customer-handoff-receipt.js`
  - receipt presentation schema advanced to `0.26.28`;
  - adds persisted-only `pricingDetail(...)` presentation data;
  - adds aggregate-vs-BOM subtotal reconciliation;
  - adds aggregate-vs-component-total reconciliation;
  - adds saved TBC-count-vs-BOM-required-value reconciliation;
  - prevents an inconsistent saved record from being shown as pricing-clear.
- `merged-app.js`
  - adds `renderReceiptPricingState(...)`;
  - adds explicit immutable pricing provenance and reconciliation messaging;
  - keeps pricing state adjacent to the exact persisted BOM.
- `merged.css`
  - adds responsive PRO4X4 dark/orange pricing-state treatment with distinct reconciled, TBC, incomplete and mismatch states.
- `tests/wf1-persisted-receipt-pricing-state-parity-alpha26.js`
  - verifies real Ranger persisted values;
  - verifies caller-mutation isolation;
  - verifies saved subtotal mismatch, saved TBC-count mismatch, complete pricing and incomplete aggregate state;
  - verifies no current-catalogue/backend/write-path ownership leakage.
- Existing receipt tests were updated only for presentation schema `0.26.28`.
- `package.json`
  - version advanced to `0.26.28` and the Run 25 regression was added to the complete Alpha chain.

## Verification

Passed on the final Run 25 package:

- targeted persisted pricing-state parity regression — **PASS**;
- persisted BOM/customer/vehicle/mass/share receipt regressions — **PASS**;
- complete `npm test` Alpha 12 → current Alpha 26 regression chain — **PASS**;
- `npm run check` server syntax gate — **PASS**;
- `npm run test:wf5-promotion` immutable promotion/lineage gate — **PASS**;
- JavaScript syntax validation — **118 files / 0 failures**;
- JSON validation-input parse validation — **35 files / 0 failures**;
- HTML local dependency validation — **16 HTML files / 251 local references / 0 missing**;
- Run 24 → Run 25 visual binary comparison — **15 files / 0 added / 0 removed / 0 changed**.

Managed Chromium journey was attempted and returned the existing environment-policy skip because local HTTP navigation is blocked. The browser test exited successfully and classified the journey as skipped rather than failed.

The combined WF5 acceptance gate remains held only by the existing separate WF4 defect:

- `WF1-BOM-ANYOF` — **PASS**;
- `WF5-CUSTOMER-DRAFT-ISOLATION` — **PASS**;
- `WF4-DIRECT-PRODUCTION-REVIEW` — **FAIL** because direct production upsert still accepts `master-approved` metadata without immutable `governance.reviewedBy` / `governance.reviewedAt` evidence.

WF1 Run 25 does not modify or mask that WF4 defect.

## Next dependency

The highest-priority unfinished WF1 dependency remains **structured customer fitment-context capture**. WF1 still requires a WF2-owned governed contract containing stable question IDs, typed/permitted answers, customer-facing semantics, answer → dependency/conflict/staff-review mappings, and revision-safe persistence semantics.

Until that contract exists, WF1 should continue exposing explicit setup/review states rather than manufacturing compatibility from prose or current catalogue assumptions.
