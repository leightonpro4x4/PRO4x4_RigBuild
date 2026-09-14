# PRO4X4 Rig Builder — Alpha 26 WF1 Run 05

## Scope
WF1-only package from the latest merged Alpha 26 customer-configurator checkpoint.

The highest-priority independent unfinished WF1 package advanced here is **immutable save/share/quote handoff review**. The customer now sees the exact build snapshot, open fitment/dependency state and production visual state before a save, share or quote handoff is committed.

No catalogue data, fitment truth, backend production rule, staff tooling, render manifest, asset registry record or visual binary was created or modified.

## Concrete progress

### 1. One review gate for all customer handoffs
`SAVE BUILD`, `SHARE SAVED BUILD`, and `SAVE + REQUEST A QUOTE` now route through a single PRO4X4-styled review dialog.

The review shows:
- vehicle and selected-item count;
- exact project/revision identity where one already exists;
- known build value and whether required price components remain TBC;
- all persisted fitment/dependency gates;
- manufacturer vehicle-setup conditions preserved inside selected product fitment data;
- exact render-stack state: available / missing / blocked, production readiness, exact-match requirement and `fallbackPolicy: none`;
- customer/contact detail used for the handoff;
- selected BOM with SKU identity.

### 2. Exact reviewed snapshot is the handoff payload
For save and quote actions the configurator captures `buildPayload()` when the review opens. Confirming the review passes that captured snapshot into the existing project revision save function rather than rebuilding the customer payload at submission time.

This means the customer is approving the same build content that becomes the immutable revision. Normal project metadata (`project.id`, revision number, actor and saved timestamp) is then added by the existing shared project store/server as before.

Quote submission sends the saved immutable snapshot returned from that same revision operation into the existing sales queue. There is no parallel quote model.

### 3. Share remains revision-pinned
Share review never builds a fresh snapshot. It loads the exact already-saved revision selected in the customer project state, displays that revision ID, and creates the share token against that same revision ID.

Dirty builds remain non-shareable until another immutable revision is saved.

### 4. Visual-governance messaging is explicit
The review states the governing customer rule: `REFERENCE_BACKED_APPROVED_VISUALS_ONLY`.

If no exact production render stack exists, the review says so and confirms that no approximate or draft visual is substituted. No reference-only, `master-draft`, `layer-draft`, candidate or unsupported imagery is introduced by this package.

### 5. No duplicated ownership
A new `customer-handoff-review.js` helper is presentation-only. It summarizes an existing project snapshot; it does not own catalogue, fitment, pricing, project, quote or visual truth.

## Verification

### WF1 targeted handoff regression
`npm run test:wf1-handoff` — **PASS**.

Verified:
- unresolved `dependency-any-of` state appears in the review model;
- exact visual state is reported as missing/blocked/available from the snapshot rather than inferred;
- `fallbackPolicy: none` and exact-match behavior remain visible;
- share review is pinned to an immutable project/revision ID;
- save and quote flows accept the captured review snapshot;
- quote save does not rebuild the payload after review;
- share creation names the exact reviewed revision;
- no approximate-fallback path was introduced.

### Full Alpha regression chain
`npm test` — **PASS** across Alpha 12 → Alpha 26 plus all current WF1 regressions, including Run 05.

### Server/runtime syntax gate
`npm run check` — **PASS**.

### Visual promotion / immutable lineage regression
`npm run test:wf5-promotion` — **PASS**.

Confirmed again:
- staged drafts are not customer-visible;
- missing reviewer evidence is rejected;
- reviewed `master-approved` promotion resolves only after approval;
- immutable reviewer evidence survives;
- project → revision → share → quote visual lineage remains pinned.

### WF5 acceptance status
`npm run test:wf5-acceptance` remains red **only** for the pre-existing WF4 direct-production review bypass:
- `WF1-BOM-ANYOF` — PASS;
- `WF5-CUSTOMER-DRAFT-ISOLATION` — PASS;
- `WF4-DIRECT-PRODUCTION-REVIEW` — FAIL, unchanged and outside this WF1 package.

No WF4 code was changed.

### Static/integrity verification
- JavaScript syntax sweep — **89 files / 0 failures**;
- JSON parse sweep — **9 files / 0 failures**;
- HTML local dependency sweep — **15 HTML files / 238 local references / 0 missing**.

### File-scope check against WF1 Run 04
Runtime changes are limited to:
- `customer-handoff-review.js` — new WF1 presentation contract;
- `index.html` — review dialog and helper load;
- `merged-app.js` — review capture/render/confirm wiring and exact-snapshot handoff;
- `merged.css` — review dialog styling/responsive behavior;
- `package.json` — Run 05 test/version metadata.

Verification addition:
- `tests/wf1-immutable-handoff-review-alpha26.js`;
- this report.

No `data-ranger.js`, `data-y62.js`, `merged-project-contract.js`, server/database file, asset registry, render manifest, canonical candidate or visual asset was modified.

## Next WF1 dependency
The highest-value remaining WF1 package is still **structured customer fitment-context capture**, but it should not be implemented until WF2 publishes governed question IDs, option sets and answer semantics. WF1 will not parse free-text manufacturer conditions or create a second source of fitment truth.

If that contract is still unavailable on the next WF1 push, the next independent package should be the **post-handoff receipt/return journey**: a clear saved/share/quote confirmation state showing the exact immutable revision and what PRO4X4 will verify next, without changing the shared backend or sales model.

Global package promotion also remains held by WF4's separate direct-production reviewer-evidence bypass; WF1 itself is green against its current acceptance checks.
