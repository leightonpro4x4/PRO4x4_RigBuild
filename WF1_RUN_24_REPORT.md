# PRO4X4 Rig Builder — WF1 Run 24

## Package advanced

**Persisted receipt mass / compliance-state parity** — one WF1 package only.

The higher-priority **structured customer fitment-context capture** package remains blocked. A fresh checkpoint scan still found no WF2-owned governed `questionId`, permitted-answer, answer-semantics, or answer → fitment/dependency/staff-review contract, so WF1 did not invent customer setup questions or compatibility truth.

Run 24 advances the next independent save/share/quote UX gap: the completed immutable handoff receipt now exposes the exact mass-planning state saved on that revision and makes the compliance boundary explicit without recalculating from the current catalogue.

## Customer UX delivered

A new **MASS / COMPLIANCE STATE LOCKED TO THIS REVISION** receipt section now shows only persisted revision data:

- saved kerb mass;
- saved GVM;
- saved nominal payload;
- known accessory mass;
- unknown-mass item count;
- planning kerb mass derived only from the saved kerb + saved known accessory mass;
- remaining payload derived only from the saved GVM / kerb / known accessory mass;
- an explicit **REVIEW REQUIRED** compliance status.

The customer-facing state is classified as:

- **KNOWN MASS EXCEEDS SAVED GVM** — known persisted mass alone is already over the saved GVM;
- **UNKNOWN ACCESSORY MASS REMAINS** — one or more selected items still have unknown mass in the saved revision;
- **PERSISTED MASS DATA INCOMPLETE** — required saved planning fields are absent;
- **KNOWN-MASS PLANNING DATA COMPLETE** — all persisted known-mass planning fields are present, while still clearly marked as planning data only rather than compliance sign-off.

The receipt carries a permanent visible boundary: **PLANNING ONLY · NOT WEIGHBRIDGE / AXLE / GVM SIGN-OFF**.

## Immutable backbone and ownership boundaries preserved

The unified immutable **project → revision → share → quote** backbone remains the only persisted authority.

- `massDetail(...)` reads only `persisted-revision.weight`.
- It does not re-scan `selections`, catalogue product weights, mutable vehicle defaults, current products, staff calculations, or backend state.
- Receipt presentation remains pinned if caller-owned snapshot objects later change.
- Missing values remain missing; they are not backfilled from current catalogue/vehicle data.
- The complete-planning state still uses a `next` review state rather than claiming compliance clearance.
- No selected BOM state, project revision, share, quote, catalogue record, fitment rule, render resolver, or backend contract is written by the new receipt section.
- No backend/catalogue ownership was duplicated into WF1.

## Y62 / visual governance preserved

- Y62 remains the first production visual milestone and is the governed mass fixture for the new regression.
- `REFERENCE_BACKED_APPROVED_VISUALS_ONLY` remains unchanged.
- Exact production visual states remain `available / missing / blocked`.
- `fallbackPolicy: none` remains unchanged.
- Run 23 → Run 24 binary comparison found **15 visual files in both packages and 0 added, removed or changed visual files**.
- No product imagery, vehicle imagery, canonical candidate, render manifest, or asset-registry record was created or modified.

## Functional changes versus Run 23

- `customer-handoff-receipt.js`
  - receipt presentation schema advanced to `0.26.27`;
  - adds immutable `massDetail(...)` / `massCompliance` presentation data;
  - adds persisted-weight-only planning calculations;
  - adds explicit unknown-mass, incomplete-data, known-over-GVM and planning-record-complete states;
  - adds `WEIGHT / COMPLIANCE` verification without ever reporting compliance as cleared.
- `merged-app.js`
  - adds `renderReceiptMassCompliance(...)`;
  - places immutable mass/compliance state beside vehicle/customer/BOM receipt truth;
  - explicitly states that current catalogue weights, vehicle defaults and later staff recalculations are not backfilled.
- `merged.css`
  - adds responsive PRO4X4 dark/orange mass-state treatment with distinct warning / over-GVM / planning-complete states.
- `tests/wf1-persisted-receipt-mass-compliance-parity-alpha26.js`
  - verifies Y62 saved baseline, known mass and unknown count;
  - verifies persisted-only calculations;
  - verifies caller-mutation isolation;
  - verifies selection/catalogue weight disagreement cannot change receipt truth;
  - verifies unknown, complete, over-GVM and incomplete states;
  - verifies complete planning data still cannot become compliance sign-off;
  - verifies no catalogue/backend/write-path ownership leakage.
- Existing receipt tests were updated only for presentation schema `0.26.27` and the new receipt-section ordering.
- `package.json`
  - version advanced to `0.26.27` and the Run 24 regression was added to the complete Alpha chain.

## Verification

Passed on the final Run 24 package:

- targeted persisted mass/compliance-state regression — **PASS**;
- complete `npm test` Alpha 12 → current Alpha 26 regression chain — **PASS**;
- `npm run check` server syntax gate — **PASS**;
- `npm run test:wf5-promotion` immutable promotion/lineage gate — **PASS**;
- JavaScript syntax validation — **117 files / 0 failures**;
- JSON parse validation — **35 validation-input files / 0 failures**;
- HTML local dependency validation — **16 HTML files / 251 local references / 0 missing**;
- Run 23 → Run 24 visual binary comparison — **15 files / 0 added / 0 removed / 0 changed**.

Managed Chromium journey was attempted and returned the existing environment-policy skip because local HTTP navigation is blocked. The browser test itself exited successfully and classified the journey as skipped rather than failed.

The combined WF5 acceptance gate remains held only by the existing separate WF4 defect:

- `WF1-BOM-ANYOF` — **PASS**;
- `WF5-CUSTOMER-DRAFT-ISOLATION` — **PASS**;
- `WF4-DIRECT-PRODUCTION-REVIEW` — **FAIL** because direct production upsert still accepts `master-approved` metadata without immutable `governance.reviewedBy` / `governance.reviewedAt` evidence.

WF1 Run 24 does not modify or mask that WF4 defect.

## Next dependency

The highest-priority unfinished WF1 dependency remains **structured customer fitment-context capture**. WF1 still requires a WF2-owned governed contract containing stable question IDs, typed/permitted answers, customer-facing semantics, answer → dependency/conflict/staff-review mappings, and revision-safe persistence semantics.

Until that contract exists, WF1 should continue exposing explicit setup/review states rather than manufacturing compatibility from prose or current catalogue assumptions.
