# PRO4X4 Rig Builder — WF1 Run 10

## Package advanced

**Immutable handoff visual-state detail** — one WF1 package only.

The governed WF2 structured fitment-context contract is still absent from the latest merged Alpha checkpoint: no governed question IDs, allowed answer values, answer semantics, or fitment-review mappings are published. WF1 therefore did not infer customer fitment answers from manufacturer free text. The highest-priority independent WF1 package from Run 09 was advanced instead: make the exact per-layer production visual state survive visibly into save/share/quote review and the persisted handoff receipt.

## Concrete progress

- Extended `customer-handoff-review.js` so the pre-save / pre-share / pre-quote model carries the exact visual layer detail from the already-captured `snapshot.render`:
  - layer ID;
  - exact SKU when present;
  - `available / missing / blocked` state;
  - raw resolver reason code;
  - customer-readable reason text from the existing WF1 visual-state explanation contract;
  - approved production asset/checksum identity only when the layer is actually `available`.
- Missing, blocked, reference-only, draft or unsupported rows cannot expose their asset/checksum as a customer production choice.
- The review model records its visual source as `review-snapshot.render`; it does not read current mutable builder state after the review opens.
- Extended `customer-handoff-receipt.js` with the same per-layer detail, sourced only from the exact persisted revision passed to the receipt model.
- The receipt model records its source as `persisted-revision.render` and keeps the resolver's raw reason for staff/customer traceability.
- Updated the immutable handoff review UI with **EXACT VISUAL LAYERS IN THIS HANDOFF SNAPSHOT** rows.
- Updated the post-handoff receipt with **PERSISTED VISUAL LAYERS ON THIS REVISION** rows.
- Each row surfaces exact state + reason without substituting approximate imagery. The existing PRO4X4 dark technical design direction is preserved.
- The summary and receipt continue to restate:
  - `REFERENCE_BACKED_APPROVED_VISUALS_ONLY`;
  - exact-match requirement;
  - `fallback: none`.
- Added `tests/wf1-immutable-handoff-visual-detail-alpha26.js` to lock this behavior into regression coverage.

## Immutable lineage protection

The package does not create another project, quote, render or catalogue contract.

- Save / quote review visual detail is derived from the same captured snapshot already passed into the existing immutable revision workflow.
- Share review remains pinned to the selected saved revision.
- Receipt rendering still prefers `projectRevision(state.projectRecord,state.revisionId)?.snapshot` over the pre-save review snapshot, so the receipt reflects the persisted immutable revision.
- No handoff visual module reads `state.renderResolution`, calls `buildPayload()`, fetches backend state, saves a project, or mutates catalogue/selection state.

## Reference-backed visual rule

Preserved without relaxation:

- no reference-only production substitution;
- no `master-draft` or `layer-draft` substitution;
- no guessed/approximate geometry;
- no fallback imagery;
- only exact `available` resolver rows may retain approved asset/checksum identity.

No visual asset, candidate, canonical master, render manifest or asset-registry record was created or changed.

## Scope protection

Functional diff against WF1 Run 09 is limited to:

- `customer-handoff-review.js` — persisted/captured per-layer visual explanation;
- `customer-handoff-receipt.js` — persisted revision per-layer visual explanation;
- `merged-app.js` — review/receipt presentation only;
- `merged.css` — PRO4X4 handoff visual-state presentation;
- `tests/wf1-immutable-handoff-visual-detail-alpha26.js` — targeted regression;
- `package.json` — version/test registration;
- Run 10 QA/report evidence.

No customer catalogue records, SKU/RRP/install/weight values, fitment truth, dependencies/conflicts, backend/server behavior, project/quote persistence schema, production resolver, Y62 visual assets or product imagery changed.

## Verification

Passed:

- `npm run test:wf1-handoff-visual`;
- existing `npm run test:wf1-handoff`;
- existing `npm run test:wf1-receipt`;
- existing `npm run test:wf1-visual-state`;
- complete `npm test` Alpha 12 → current Alpha 26 regression chain;
- `npm run check` server syntax gate;
- `npm run test:wf5-promotion` including immutable reviewer evidence and project/share/quote visual lineage;
- static JavaScript syntax: **98 files / 0 failures**;
- JSON parsing: **12 files / 0 failures**;
- HTML dependency validation: **16 HTML files / 245 local references / 0 missing**.

The managed Chromium journey was attempted. It returned the existing environment skip because managed browser policy blocks local HTTP navigation; this is not a product-test failure.

WF5 combined acceptance remains held only by the existing separate WF4 defect:

- `WF1-BOM-ANYOF` — **PASS**;
- `WF5-CUSTOMER-DRAFT-ISOLATION` — **PASS**;
- `WF4-DIRECT-PRODUCTION-REVIEW` — **FAIL** because direct production upsert still accepts `master-approved` metadata without immutable `governance.reviewedBy` / `governance.reviewedAt` evidence.

This WF1 package does not modify or mask the WF4 failure.

## Next WF1 dependency

The highest-priority WF1 dependency remains **structured customer fitment-context capture**, blocked until WF2 publishes governed question IDs, allowed answers, answer semantics and their mapping to fitment-review state.

If that contract is still absent on the next WF1 push, the next independent WF1 package should be **revision-locked shared-build parity**: make the customer share view expose the exact immutable fitment gates and per-layer production visual reasons from the shared revision, without reading mutable configurator state or introducing any new render/catalogue ownership.
