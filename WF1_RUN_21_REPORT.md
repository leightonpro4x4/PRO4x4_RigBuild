# PRO4X4 Rig Builder — WF1 Run 21

## Package advanced

**Revision-locked share receipt access + copy recovery** — one WF1 package only.

The higher-priority structured customer fitment-context capture package remains blocked because the merged Alpha checkpoint still has no WF2-owned governed question IDs, allowed answers, answer semantics, or answer → dependency/conflict/staff-review mappings. WF1 therefore did not infer vehicle compatibility from free text.

Run 21 advances the next highest-value independent **save/share UX** gap: after a customer creates a revision-locked share, the handoff receipt now keeps safe, explicit access to that exact already-created share for the current session. The customer can copy the link again or open the shared view without creating another share, moving the share to a newer revision, or persisting the bearer token into the immutable project/receipt model.

## Customer UX delivered

- A successful share receipt now includes **REVISION-LOCKED CUSTOMER SHARE** status.
- The receipt shows:
  - the exact pinned immutable revision;
  - share expiry date/time;
  - token hint only;
  - explicit lineage text that later edits/saves/catalogue changes do not move the existing share.
- The receipt footer exposes:
  - **COPY SHARE LINK**;
  - **OPEN SHARED VIEW ↗**.
- Both actions reuse the exact already-created share URL held only in transient receipt runtime state.
- Closing the receipt clears that transient share URL from `state.handoffReceipt`.
- The full bearer token is not added to the immutable project snapshot, receipt presentation model, catalogue, or quote/share lineage schema.

### Clipboard recovery fixed

Previously, if `navigator.clipboard.writeText()` rejected after the backend had already created the share, the share flow could fall into the general error path and present the operation as failed even though a valid share existed.

Run 21 separates **share creation** from **clipboard convenience**:

- share creation remains the single backend action;
- clipboard copy is attempted after the share exists;
- a clipboard denial falls back to the existing copy dialog where available;
- copy failure no longer erases or invalidates the successfully created share result;
- the receipt remains available to copy/open the same pinned link again.

## Immutable-backbone and ownership boundaries preserved

Run 21 does not create a second share, project, quote, catalogue, pricing, fitment, or render model.

The existing immutable **project → revision → share → quote** backbone remains the only persisted authority:

- `createProjectShare(...)` is still called exactly once per deliberate share action;
- the request remains pinned to `targetRevision`;
- copy/open receipt actions do not call `createProjectShare`, `saveProjectRevision`, `createBuild`, or `resolveRenderStack`;
- no share URL is written to `localStorage`;
- no current project revision is changed by copy/open actions;
- later edits still require a new immutable revision and a deliberate new share if the customer wants recipients to see the changes.

No catalogue records, SKU/RRP/install/mass values, fitment truth, backend ownership, or staff workflow were changed.

## Visual governance preserved

- Y62 remains the first production visual milestone.
- `REFERENCE_BACKED_APPROVED_VISUALS_ONLY` remains unchanged.
- Exact production resolver states remain `available / missing / blocked`.
- `fallbackPolicy: none` remains unchanged.
- Run 20 → Run 21 binary comparison found **15 visual files in each package and 0 added, removed, or changed visual files**.
- No product imagery, vehicle imagery, canonical candidate, render manifest, or asset-registry record was created or modified.

## Functional changes versus Run 20

- `customer-handoff-receipt.js`
  - presentation schema advanced to `0.26.24`;
  - share metadata now carries `createdAt` alongside existing revision, expiry, and token hint;
  - raw share token remains excluded from the receipt model.
- `merged-app.js`
  - derives the customer share URL only after a successful share creation;
  - keeps that URL only in transient receipt runtime state;
  - adds copy-again and open-share actions;
  - clears transient link access when the receipt closes;
  - separates clipboard failure from share-creation failure.
- `index.html`
  - adds receipt-only **OPEN SHARED VIEW** and **COPY SHARE LINK** controls.
- `merged.css`
  - adds PRO4X4 dark/orange share-access receipt treatment and mobile layout.
- `tests/wf1-share-receipt-access-alpha26.js`
  - verifies revision pinning, raw-token exclusion, transient-only URL handling, copy/open non-mutation, single share creation, clipboard recovery, and visual-governance preservation.
- `tests/wf1-persisted-receipt-bom-parity-alpha26.js`
  - updates the expected receipt presentation schema version only.
- `package.json`
  - version advanced to `0.26.24` and Run 21 regression added to the complete Alpha chain.

## Verification

Passed on the final Run 21 package:

- `npm run test:wf1-share-receipt-access` / targeted Run 21 regression;
- existing immutable handoff receipt regression;
- existing persisted receipt BOM parity regression;
- existing save/share integrity regression;
- complete `npm test` Alpha 12 → current Alpha 26 regression chain;
- `npm run check` server syntax gate;
- `npm run test:wf5-promotion`, including immutable reviewer evidence and project/share/quote visual lineage;
- static JavaScript syntax: **114 files / 0 failures**;
- JSON parse validation: **28 pre-Run-21-evidence JSON inputs / 0 failures**;
- HTML local dependency validation: **16 HTML files / 251 local references / 0 missing**;
- Run 20 → Run 21 visual binary comparison: **0 visual changes**.

The managed Chromium customer journey was attempted and returned the existing environment-policy skip because local HTTP navigation is blocked. The browser command exited successfully and classified the journey as skipped rather than failed.

The combined WF5 acceptance gate remains held only by the pre-existing separate WF4 defect:

- `WF1-BOM-ANYOF` — **PASS**;
- `WF5-CUSTOMER-DRAFT-ISOLATION` — **PASS**;
- `WF4-DIRECT-PRODUCTION-REVIEW` — **FAIL** because direct production upsert still accepts `master-approved` metadata without immutable `governance.reviewedBy` / `governance.reviewedAt` evidence.

WF1 Run 21 does not modify or mask that WF4 defect.

## Next dependency

The highest-priority unfinished WF1 dependency remains **structured customer fitment-context capture**. WF1 still requires a WF2-owned governed contract containing:

- stable question IDs;
- permitted/typed answer values;
- customer-facing question and answer semantics;
- answer → dependency-resolution mappings;
- answer → conflict/block mappings;
- answer → staff-review mappings;
- revision-safe persistence semantics for those answers.

Until that contract exists, WF1 should continue showing explicit dependency/setup review states rather than inventing vehicle compatibility from prose.

If that dependency remains unavailable at the next checkpoint, the next independent WF1 package should be **persisted receipt customer/contact + build-notes parity**, so the post-save/share/quote receipt can show the exact customer details and notes carried by the immutable revision without refreshing them from mutable form state.
