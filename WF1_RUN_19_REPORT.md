# PRO4X4 Rig Builder — WF1 Run 19

## Package advanced

**Persisted handoff-receipt requirement detail + correction navigation** — one WF1 package only.

The higher-priority structured customer fitment-context package remains blocked. This merged Alpha checkpoint still contains no WF2-owned governed question IDs, allowed answer values, answer semantics, or answer → dependency/conflict/staff-review mappings. WF1 therefore did not infer customer vehicle answers from manufacturer free text.

Run 19 advances the next highest-value independent save/share/quote UX gap: after a save, share creation, or quote submission, the receipt now preserves and exposes the exact unresolved fitment/dependency/setup records from the persisted immutable revision, and can return the customer to a governed catalogue source without rewriting the saved handoff.

## Customer UX delivered

- The post-handoff receipt now shows **OPEN REQUIREMENTS ON THIS SAVED REVISION** using only records copied from `persisted-revision.gates` and setup conditions already present on the persisted revision.
- Each mapped requirement can expose the same governed catalogue actions already proven in the pre-handoff review:
  - **REVIEW SOURCE PRODUCT**;
  - **VIEW REQUIRED PART**;
  - **VIEW SUPPORT OPTION 1 / 2**;
  - **REVIEW SETUP SOURCE**.
- Clicking a receipt requirement closes the receipt, opens the exact governed category → manufacturer/vendor → product path, focuses the source card, and leaves the selected BOM unchanged.
- Lineage messaging is mode-aware:
  - **quote:** the queued quote remains pinned to the submitted immutable revision; inspecting/editing from the receipt does not alter the queued quote;
  - **share:** the existing share remains pinned to the shared immutable revision; customer changes require a new saved revision and a new share;
  - **save:** the saved revision remains immutable; corrections append a new revision.
- If a persisted requirement contains only free text and no governed catalogue identity, no product target is fabricated.

### Real governed proof

The Ranger `oa-lower-bash-ranger` persisted receipt regression carries its exact unresolved `dependency-any-of` record and manufacturer setup conditions. Receipt navigation exposes only the governed records already encoded in the catalogue:

- source: `oa-lower-bash-ranger`;
- support option: `oa-predator`;
- support option: `oa-toro-ranger`.

No support option is auto-selected and the saved quote/share/revision is not changed by inspection.

## Ownership and immutable-backbone boundaries preserved

Run 19 extends the existing `customer-handoff-receipt.js` presentation model. It now retains cloned gate/setup rows plus their persisted source marker; it does not create a second fitment or history model.

The correction path does not write or own:

- catalogue records;
- SKU / RRP / install / mass data;
- fitment truth;
- customer selections;
- project revisions;
- queued quotes;
- share records/tokens;
- render requests/resolution;
- visual candidates, manifests, or asset-registry records.

The unified immutable **project → revision → share → quote** backbone remains unchanged. The existing queued quote/share continues to reference the revision originally handed off; any later customer correction must flow through a new immutable revision.

## Visual governance preserved

- Y62 remains the first production visual milestone.
- `REFERENCE_BACKED_APPROVED_VISUALS_ONLY` remains unchanged.
- Exact production resolver states remain `available / missing / blocked`.
- `fallbackPolicy: none` remains unchanged.
- Run 18 → Run 19 binary comparison found **15 visual files in each package and 0 added, removed, or changed visual files**.
- No product imagery, vehicle imagery, canonical candidate, render manifest, or asset-registry record was created or modified.

## Functional changes versus Run 18

- `customer-handoff-receipt.js`
  - receipt schema advanced to `0.26.22`;
  - persisted gate rows and setup rows are now retained in the receipt presentation model;
  - exact source marker `persisted-revision.gates` added.
- `merged-app.js`
  - renders persisted receipt requirements;
  - maps governed requirement actions through the existing catalogue trace contract;
  - returns from the receipt to the exact source product without mutating selections;
  - adds explicit quote/share/save lineage messaging so customers cannot mistake later edits for changes to an already handed-off revision.
- `merged.css`
  - extends the existing PRO4X4 dark/orange handoff styling for persisted receipt requirements.
- `tests/wf1-receipt-requirement-navigation-alpha26.js`
  - new real-Ranger persistence, governed-target, no-fabrication, no-selection-mutation, and no-backend-write regression.
- `package.json`
  - version `0.26.22`;
  - new targeted regression registered in the full Alpha chain.

No backend/server implementation, catalogue data, immutable project/quote schema, fitment rule, staff workflow, or visual asset was modified.

## Verification

Passed on the final Run 19 package:

- `npm run test:wf1-receipt-nav`;
- complete `npm test` Alpha 12 → current Alpha 26 regression chain, including the existing handoff receipt and Run 18 handoff-review navigation regressions;
- `npm run check` server syntax gate;
- `npm run test:wf5-promotion`, including immutable reviewer evidence and project/share/quote visual lineage;
- static JavaScript syntax: **112 files / 0 failures**;
- JSON parse validation: **24 pre-Run-19-evidence JSON inputs / 0 failures**;
- HTML local dependency validation: **16 HTML files / 251 local references / 0 missing**;
- Run 18 → Run 19 visual binary comparison: **0 visual changes**.

The managed Chromium customer journey was attempted and returned the existing environment-policy skip because local HTTP navigation is blocked. The browser command exited successfully and classified the journey as skipped rather than failed.

The combined WF5 acceptance gate remains held only by the pre-existing separate WF4 defect:

- `WF1-BOM-ANYOF` — **PASS**;
- `WF5-CUSTOMER-DRAFT-ISOLATION` — **PASS**;
- `WF4-DIRECT-PRODUCTION-REVIEW` — **FAIL** because direct production upsert still accepts `master-approved` metadata without immutable `governance.reviewedBy` / `governance.reviewedAt` evidence.

WF1 Run 19 does not modify or mask that WF4 defect.

## Next dependency

The highest-priority unfinished WF1 dependency remains **structured customer fitment-context capture**. WF1 still requires a WF2-owned contract containing governed question IDs, allowed answer values, answer semantics, and answer → dependency/conflict/staff-review mappings before the configurator can safely collect vehicle-specific setup facts without inventing compatibility.

If that contract remains absent at the next WF1 checkpoint, the next independent package should be **persisted receipt BOM parity**: show the exact saved selected BOM (product, vendor, SKU and persisted known line value) on the save/share/quote receipt and allow non-mutating catalogue inspection from that persisted list, without reading mutable builder state or changing an already submitted quote/share.
