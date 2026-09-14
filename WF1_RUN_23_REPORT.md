# PRO4X4 Rig Builder — WF1 Run 23

## Package advanced

**Persisted receipt vehicle-state parity** — one WF1 package only.

The higher-priority structured customer fitment-context capture package remains blocked. A fresh scan of the merged Alpha checkpoint found no WF2-owned governed `questionId` / permitted-answer / answer-semantics / answer→fitment mapping contract, so WF1 did not invent customer setup questions or infer compatibility from manufacturer prose.

Run 23 advances the next independent save/share/quote UX gap: a completed handoff receipt now exposes the exact vehicle-state identifiers saved on that immutable revision and compares them only with the render-state identifiers persisted on the same revision.

## Customer UX delivered

A new **VEHICLE STATE LOCKED TO THIS REVISION** receipt section now shows the exact persisted:

- vehicle ID;
- paint ID;
- wheel / tyre ID;
- configured view ID.

The same section separately shows the persisted render-state paint / wheel-tyre / view identifiers and classifies their relationship as:

- **aligned** — persisted configuration and persisted render state agree;
- **mismatch** — at least one saved identifier conflicts;
- **incomplete** — one or more saved render-state identifiers are absent.

The receipt explicitly states that current catalogue labels/defaults are not consulted or backfilled. Missing identifiers remain **NOT RECORDED**.

A mismatch can no longer coexist with a customer-facing **APPROVED EXACT STACK** message. The receipt instead shows **STATE MISMATCH · REVIEW REQUIRED** and the verification model remains open. A nominally production-ready visual with incomplete saved state identifiers is likewise held for review rather than silently normalized from current defaults.

## Immutable backbone and ownership boundaries preserved

The unified immutable **project → revision → share → quote** backbone remains the only persisted authority.

- `vehicleDetail(...)` copies primitive identifiers only from `persisted-revision.vehicle` and `persisted-revision.render`.
- Receipt presentation remains pinned if caller-owned snapshot objects later change.
- No vehicle label, paint name, wheel/tyre name, fitment decision or compatibility result is refreshed from the current catalogue.
- No selected BOM state, project revision, share, quote, render resolver, catalogue record or backend contract is written by the new receipt section.
- No catalogue / fitment ownership was duplicated into WF1.

## Y62 / visual governance preserved

- Y62 remains the first production visual milestone and is the governed fixture used by the new regression.
- `REFERENCE_BACKED_APPROVED_VISUALS_ONLY` remains unchanged.
- Exact production states remain `available / missing / blocked`.
- `fallbackPolicy: none` remains unchanged.
- Run 22 → Run 23 binary comparison found **15 visual files in both packages and 0 added, removed or changed visual files**.
- No product imagery, vehicle imagery, canonical candidate, render manifest or asset-registry record was created or modified.

## Functional changes versus Run 22

- `customer-handoff-receipt.js`
  - receipt presentation schema advanced to `0.26.26`;
  - adds `vehicleDetail(...)` and immutable `vehicleState` presentation data;
  - adds saved configuration ↔ saved render-state parity classification;
  - visual verification requires aligned persisted state before an exact production stack can be reported clear.
- `merged-app.js`
  - adds `renderReceiptVehicleState(...)`;
  - adds aligned / mismatch / incomplete customer messaging;
  - prevents mismatch/incomplete persisted state from presenting as a clean production visual.
- `merged.css`
  - adds responsive PRO4X4 dark/orange vehicle-state and parity treatment.
- `tests/wf1-persisted-receipt-vehicle-state-parity-alpha26.js`
  - verifies Y62 persisted paint / wheel-tyre / view IDs;
  - verifies caller-mutation isolation;
  - verifies mismatch and incomplete-state handling;
  - verifies no current catalogue/default refresh and no write-path ownership leakage.
- Existing receipt tests were updated only for presentation schema `0.26.26` and the new receipt-section ordering.
- `package.json`
  - version advanced to `0.26.26` and the Run 23 regression was added to the complete Alpha chain.

## Verification

Passed on the final Run 23 package:

- targeted Run 23 persisted vehicle-state parity regression — **PASS**;
- complete `npm test` Alpha 12 → current Alpha 26 regression chain — **PASS**;
- `npm run check` server syntax gate — **PASS**;
- `npm run test:wf5-promotion` immutable promotion/lineage gate — **PASS**;
- JavaScript syntax validation — **116 files / 0 failures**;
- JSON parse validation — **34 files / 0 failures**;
- HTML local dependency validation — **16 HTML files / 251 local references / 0 missing**;
- Run 22 → Run 23 visual binary comparison — **15 files / 0 added / 0 removed / 0 changed**.

Managed Chromium journey was attempted and returned the existing environment-policy skip because local HTTP navigation is blocked. The browser test itself exited successfully and classified the journey as skipped rather than failed.

The combined WF5 acceptance gate remains held only by the existing separate WF4 defect:

- `WF1-BOM-ANYOF` — **PASS**;
- `WF5-CUSTOMER-DRAFT-ISOLATION` — **PASS**;
- `WF4-DIRECT-PRODUCTION-REVIEW` — **FAIL** because direct production upsert still accepts `master-approved` metadata without immutable `governance.reviewedBy` / `governance.reviewedAt` evidence.

WF1 Run 23 does not modify or mask that WF4 defect.

## Next dependency

The highest-priority unfinished WF1 dependency remains **structured customer fitment-context capture**. WF1 still requires a WF2-owned governed contract containing stable question IDs, typed/permitted answers, customer-facing semantics, answer → dependency/conflict/staff-review mappings, and revision-safe persistence semantics.

Until that contract exists, WF1 should continue exposing explicit setup/review states rather than manufacturing compatibility from prose. If the dependency remains unavailable at the next checkpoint, the next independent WF1 package should be **persisted receipt mass / compliance-state parity** so save/share/quote receipts can expose the exact saved baseline mass, known accessory mass and unknown-mass count from the immutable revision without recalculating from current catalogue values.
