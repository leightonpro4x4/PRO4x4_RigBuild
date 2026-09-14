# PRO4X4 Rig Builder — WF1 Run 18

## Package advanced

**Handoff-review requirement return navigation** — one WF1 package only.

The higher-priority structured customer fitment-context package remains blocked. This merged Alpha checkpoint still contains no WF2-owned governed question IDs, allowed answer values, answer semantics, or answer → dependency/conflict/staff-review mappings. WF1 therefore did not infer customer vehicle answers from manufacturer free text.

Run 18 advances the next independent WF1 package identified in Run 17: an open fitment/dependency requirement shown in the save/share/quote review can now return the customer to the exact governed catalogue source before the immutable handoff is confirmed.

## Customer UX delivered

- Every mapped gate in **OPEN FITMENT / DEPENDENCY RECORD** now exposes catalogue navigation derived only from governed product IDs already present on the immutable review snapshot.
- The customer can open the requirement owner with **REVIEW SOURCE PRODUCT →**.
- A single governed dependency can additionally expose **VIEW REQUIRED PART →** when `requiredId` resolves to a real catalogue record.
- An existing governed OR dependency can expose **VIEW SUPPORT OPTION 1 / 2 →** for its `requiredAnyOf` records without choosing one on the customer’s behalf.
- Vehicle setup checks derived from selected product fitment conditions expose **REVIEW SETUP SOURCE →** back to that exact selected product.
- Clicking a handoff-review navigation action closes and discards the captured review first, then reuses the existing category → manufacturer/vendor → product focus path. This prevents a stale review snapshot from remaining confirmable after leaving the review.
- The selected BOM is not changed by this inspection. The customer is explicitly told to reopen save/share/quote review when ready, so a fresh exact review snapshot is shown before any confirmation.

### Real governed proof

The governed Ranger `oa-lower-bash-ranger` unresolved `dependency-any-of` gate now produces only catalogue-backed actions:

- source: `oa-lower-bash-ranger`;
- support option: `oa-predator`;
- support option: `oa-toro-ranger`.

No choice is auto-selected. Free-text fitment/review text with no governed product identity produces **no navigation target**, so WF1 does not invent a product, fitment answer, or compatibility claim.

## Ownership and immutable-backbone boundaries preserved

Run 18 adds `customer-handoff-requirement-nav.js` as a presentation-only mapping layer over the existing `customer-build-trace.js` contract.

It does not own or write:

- catalogue records;
- SKU / RRP / install / mass data;
- fitment truth;
- customer selections;
- project revisions;
- quote envelopes;
- share records;
- render requests/resolution;
- visual candidates or asset registry data.

The unified immutable project → revision → share → quote backbone remains unchanged. Save/quote still submit the exact captured review snapshot, and share remains pinned to the reviewed immutable revision.

## Visual governance preserved

- Y62 remains the first production visual milestone.
- `REFERENCE_BACKED_APPROVED_VISUALS_ONLY` remains unchanged.
- Exact production resolver states remain `available / missing / blocked`.
- `fallbackPolicy: none` remains unchanged.
- Run 17 → Run 18 binary comparison found **15 visual files in each package and 0 added, removed, or changed visual files**.
- No product imagery, vehicle imagery, render manifest, canonical candidate, or asset-registry record was created or modified.

## Functional changes versus Run 17

- `customer-handoff-requirement-nav.js` — new presentation-only mapping from immutable handoff gate/setup records to governed catalogue targets.
- `merged-app.js` — renders governed review-navigation actions, closes the review before catalogue inspection, and reuses the existing exact product focus path without mutating the BOM.
- `merged.css` — PRO4X4 dark/orange treatment for requirement navigation controls, including mobile stacking.
- `index.html` — loads the new navigation contract before the configurator runtime.
- `tests/wf1-handoff-requirement-navigation-alpha26.js` — targeted real-Ranger, no-fabrication, ownership-boundary, and stale-review regression.
- `package.json` — version `0.26.21`, package description, regression registration.
- Verification evidence and this report.

No backend/server implementation, catalogue data, immutable project/quote schema, fitment rule, staff workflow, or visual asset was modified.

## Verification

Passed on the final Run 18 package:

- `npm run test:wf1-handoff-nav`;
- existing immutable handoff review, build-summary trace, related-product navigation and inspection-return regressions;
- complete `npm test` Alpha 12 → current Alpha 26 regression chain;
- `npm run check` server syntax gate;
- `npm run test:wf5-promotion`, including immutable reviewer evidence and project/share/quote visual lineage;
- static JavaScript syntax: **111 files / 0 failures**;
- JSON parse validation: **22 pre-Run-18-evidence JSON inputs / 0 failures**;
- HTML local dependency validation: **16 HTML files / 251 local references / 0 missing**;
- Run 17 → Run 18 visual binary comparison: **0 visual changes**.

The managed Chromium customer journey was attempted and returned the existing environment-policy skip because local HTTP navigation is blocked. The browser command exited successfully and classified the journey as skipped rather than failed.

The combined WF5 acceptance gate remains held only by the pre-existing separate WF4 defect:

- `WF1-BOM-ANYOF` — **PASS**;
- `WF5-CUSTOMER-DRAFT-ISOLATION` — **PASS**;
- `WF4-DIRECT-PRODUCTION-REVIEW` — **FAIL** because direct production upsert still accepts `master-approved` metadata without immutable `governance.reviewedBy` / `governance.reviewedAt` evidence.

WF1 Run 18 does not modify or mask that WF4 defect.

## Next dependency

The highest-priority unfinished WF1 dependency remains **structured customer fitment-context capture**. WF1 still requires a WF2-owned contract containing governed question IDs, allowed answer values, answer semantics, and answer → dependency/conflict/staff-review mappings before the configurator can safely collect vehicle-specific setup facts without inventing compatibility.
