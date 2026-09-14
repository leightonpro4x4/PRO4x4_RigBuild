# PRO4X4 Rig Builder — WF1 Run 26

## Package advanced

**Persisted receipt revision provenance + handoff-status separation** — one WF1 package only.

The higher-priority **structured customer fitment-context capture** package remains blocked. A fresh checkpoint scan still found no WF2-owned governed `questionId`, permitted/allowed-answer, answer-semantics, fitment-context, or answer → dependency/conflict/staff-review contract. WF1 therefore did not invent setup questions or compatibility truth.

Run 26 advances the next independent save/share/quote integrity gap: the customer receipt now distinguishes the workflow state saved on the immutable revision from the later handoff outcome returned by quote/share actions. A queue response can no longer replace or masquerade as the workflow state stored on the revision itself.

## Customer UX delivered

A new **REVISION PROVENANCE · LOCKED** receipt section now exposes persisted-only provenance for the exact saved revision:

- saved timestamp;
- saved revision workflow status;
- catalogue revision and catalogue schema;
- snapshot/contract version;
- save source and originating channel;
- quote/share handoff outcome shown separately from the saved revision workflow.

For quote receipts, the existing receipt status pill now uses the **handoff outcome status** returned by the sales-queue result, while the provenance panel continues to show the **persisted revision workflow**. The two states are deliberately separate.

The receipt explicitly states that quote/share outcome never replaces the workflow state stored on the immutable revision.

## Immutable lineage behaviour

Run 26 adds `provenanceDetail(snapshot, context)` to the WF1 receipt presentation contract.

Persisted provenance is read only from:

- `persisted-revision.schemaVersion` / `createdAt` / `channel`;
- `persisted-revision.project` metadata already attached to the immutable revision;
- `persisted-revision.catalogue`;
- `persisted-revision.contract`;
- `persisted-revision.workflow`.

The separate handoff context contains only the outcome needed to describe the action that just completed, such as queue reference and queue workflow status. It is not written back into the persisted revision.

Backward compatibility is retained for callers still using the previous `workflowStatus` context field, but that field is interpreted only as handoff context. It can no longer overwrite `model.workflowStatus`, which now remains pinned to `persisted-revision.workflow.status`.

The targeted regression proves this with a Ranger revision whose persisted workflow is `ready-to-quote` while the quote handoff returns `needs-fitment-review`: both states remain visible independently and correctly attributed.

The regression also mutates caller-owned project, workflow, catalogue and contract metadata after the receipt model is built and confirms the receipt remains pinned to the original saved values.

## Ownership boundaries preserved

The unified immutable **project → revision → share → quote** backbone remains the only persisted authority.

- No project/revision/share/quote write path was changed.
- No backend API contract or sales-queue ownership was changed.
- No current catalogue lookup is used to build receipt provenance.
- No catalogue record, SKU, RRP, fitment rule, dependency truth, mass truth or pricing truth was modified.
- The new provenance renderer is presentation-only and contains no product selection, render resolution, save, quote or share mutation calls.
- Existing receipt BOM, customer, vehicle, mass, pricing, requirement and share-link behavior remains unchanged.

## Y62 / visual governance preserved

- Y62 remains the first production visual milestone.
- `REFERENCE_BACKED_APPROVED_VISUALS_ONLY` remains unchanged.
- Exact production visual states remain `available / missing / blocked`.
- `fallbackPolicy: none` remains unchanged.
- Run 25 → Run 26 binary comparison found **15 visual files in both packages and 0 added, removed or changed visual files**.
- No product imagery, vehicle imagery, canonical candidate, render manifest or asset-registry record was created or modified.

## Functional changes versus Run 25

- `customer-handoff-receipt.js`
  - receipt presentation schema advanced to `0.26.29`;
  - adds persisted-only `provenanceDetail(...)`;
  - separates persisted revision workflow from handoff outcome status;
  - retains legacy handoff-context compatibility without allowing it to replace persisted revision state.
- `merged-app.js`
  - adds `renderReceiptRevisionProvenance(...)`;
  - adds a locked revision-provenance panel;
  - quote receipt pill now reads `handoffStatus` rather than the persisted revision workflow;
  - runtime passes quote queue state as `handoffWorkflowStatus`.
- `merged.css`
  - adds responsive PRO4X4 dark/orange provenance treatment aligned with existing receipt sections.
- `tests/wf1-persisted-receipt-provenance-alpha26.js`
  - verifies saved-vs-handoff workflow separation;
  - verifies persisted project/catalogue/contract provenance;
  - verifies caller-mutation isolation;
  - verifies no backend/catalogue/render ownership leakage;
  - verifies save receipts do not fabricate a handoff state.
- Existing receipt parity tests were updated only for presentation schema `0.26.29`.
- `package.json`
  - version advanced to `0.26.29` and the Run 26 regression was added to the complete Alpha chain.

## Verification

Passed on the final Run 26 package:

- targeted persisted revision-provenance regression — **PASS**;
- existing persisted receipt BOM/customer/vehicle/mass/pricing/share/requirement regressions — **PASS**;
- complete `npm test` Alpha 12 → current Alpha 26 regression chain — **PASS**;
- `npm run check` server syntax gate — **PASS**;
- `npm run test:wf5-promotion` immutable promotion/lineage gate — **PASS**;
- JavaScript syntax validation — **119 files / 0 failures**;
- JSON validation-input parse validation — **37 files / 0 failures**;
- HTML local dependency validation — **16 HTML files / 251 local references / 0 missing**;
- Run 25 → Run 26 visual binary comparison — **15 files / 0 added / 0 removed / 0 changed**.

Managed Chromium journey was attempted and returned the existing environment-policy skip because local HTTP navigation is blocked. The browser test exited successfully and classified the journey as skipped rather than failed.

The combined WF5 acceptance gate remains held only by the existing separate WF4 defect:

- `WF1-BOM-ANYOF` — **PASS**;
- `WF5-CUSTOMER-DRAFT-ISOLATION` — **PASS**;
- `WF4-DIRECT-PRODUCTION-REVIEW` — **FAIL** because direct production upsert still accepts `master-approved` metadata without immutable `governance.reviewedBy` / `governance.reviewedAt` evidence.

WF1 Run 26 does not modify or mask that WF4 defect.

## Next dependency

The highest-priority unfinished WF1 dependency remains **structured customer fitment-context capture**. WF1 still requires a WF2-owned governed contract containing stable question IDs, typed/permitted answers, customer-facing answer semantics, answer → dependency/conflict/staff-review mappings, and revision-safe persistence semantics.

Until that contract exists, WF1 should continue exposing explicit setup/review states rather than manufacturing compatibility from prose or current catalogue assumptions.
