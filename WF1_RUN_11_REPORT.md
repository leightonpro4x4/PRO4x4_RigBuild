# PRO4X4 Rig Builder — WF1 Run 11

## Package advanced

**Revision-locked shared-build parity** — one WF1 package only.

The latest merged Alpha checkpoint still contains no WF2-owned structured customer fitment-context contract: no governed question IDs, allowed answer values, answer semantics, or mappings from customer answers into fitment-review state. WF1 therefore did not infer customer fitment answers from manufacturer notes. The highest-priority independent package identified in Run 10 was advanced instead: make a revision-locked shared build expose the same immutable fitment/dependency gates and exact production-visual reasons already carried through save/share/quote handoff.

## Concrete progress

- Added `customer-shared-build.js`, a read-only customer share-view model sourced only from `resolved-share.revision.snapshot`.
- The shared view now exposes the exact saved revision's:
  - dependency gates;
  - any-of support alternatives;
  - fitment-review gates;
  - vehicle-setup conditions recorded on selected products;
  - pricing completeness;
  - known/unknown accessory mass;
  - catalogue revision and workflow state;
  - exact per-layer production visual state and raw resolver reason.
- Added a dedicated **IMMUTABLE FITMENT STATE** section to `share.html` / `share.js`.
- Blocking requirements are visibly separated from PRO4X4 staff-review requirements.
- `dependency-any-of` gates display every alternative already recorded on the immutable revision without silently choosing one.
- Vehicle setup checks are displayed from the selected product fitment conditions preserved in that revision.
- Added an **EXACT PRODUCTION VISUAL STATE** section with per-layer `AVAILABLE / MISSING / BLOCKED` state and the persisted resolver reason.
- The share view explicitly states that it does not re-evaluate fitment against a newer catalogue or mutable configurator state.
- Added **REVISION LOCKED** messaging explaining that BOM, fitment and visual state are pinned to the revision referenced by the share token.
- Preserved the existing server-backed/local-adapter share behavior and staff-review links.

## Immutable lineage protection

The package introduces no new project, quote, catalogue, render, or persistence owner.

- `share.js` continues to resolve the existing share token through the existing backend adapter.
- The customer model is built only from `revision.snapshot` returned by that resolved token.
- It does not read `project.currentRevisionId`, live selected products, live render resolution, a new catalogue revision, or the current configurator payload.
- It does not call project save/create, quote save/create, catalogue write, render mutation, or asset-registry mutation code.
- Test coverage mutates the original fixture after the share model is built and confirms fitment gates, setup conditions and visual reasons remain detached from later mutable state.

## Visual governance

`REFERENCE_BACKED_APPROVED_VISUALS_ONLY` remains unchanged.

- exact match remains required;
- `fallbackPolicy` remains `none`;
- only an `available` exact production layer can retain approved asset/checksum identity in the share-view model;
- missing, blocked, reference-only or draft states cannot expose their asset/checksum as a production choice;
- no `<img>` or product/render image path was added by this package;
- no product imagery, render candidates, canonical masters, manifests, asset-registry records, or production visual assets were created or modified.

The Y62-first visual milestone remains the only production visual program surfaced by the existing resolver data. This package only explains the immutable visual state already saved on a revision.

## Scope protection

Functional changes versus WF1 Run 10 are limited to:

- `customer-shared-build.js` — new read-only revision-scoped share model;
- `share.js` — immutable fitment + visual parity presentation;
- `share.html` — loads the existing customer visual-state contract plus the new share-view model;
- `styles.css` — shared-build fitment / visual-state presentation in the existing PRO4X4 dark technical direction;
- `tests/wf1-shared-build-parity-alpha26.js` — targeted regression;
- `package.json` — version `0.26.14`, description and test registration;
- Run 11 QA/report evidence.

No catalogue records, SKU/RRP/install/weight values, fitment truth, backend/server behavior, immutable project/quote schema, production resolver logic, Y62 visual assets, or product imagery changed.

## Verification

Passed:

- `npm run test:wf1-share-parity`;
- existing immutable handoff visual-state test;
- existing save/share integrity test;
- complete `npm test` Alpha 12 → current Alpha 26 regression chain;
- `npm run check` server syntax gate;
- `npm run test:wf5-promotion`, including immutable reviewer evidence and project/share/quote visual lineage;
- static JavaScript syntax: **100 files / 0 failures**;
- JSON parsing: **14 files / 0 failures**;
- HTML dependency validation: **16 HTML files / 247 local references / 0 missing**.

The Chromium journey was attempted and returned the existing environment-policy skip because managed browser policy blocks local HTTP navigation. This is not a product-test failure.

The combined WF5 acceptance gate remains held only by the separate pre-existing WF4 defect:

- `WF1-BOM-ANYOF` — **PASS**;
- `WF5-CUSTOMER-DRAFT-ISOLATION` — **PASS**;
- `WF4-DIRECT-PRODUCTION-REVIEW` — **FAIL** because direct production upsert still accepts `master-approved` metadata without immutable `governance.reviewedBy` / `governance.reviewedAt` evidence.

WF1 Run 11 does not modify or mask that WF4 issue.

## Next dependency

The highest-priority unfinished WF1 dependency is still **structured customer fitment-context capture**. WF1 needs a WF2-owned contract containing governed question IDs, allowed answer values, answer semantics, and the mapping of each answer into dependency / conflict / staff-review state before the configurator can safely ask vehicle-specific fitment questions.

Until that contract exists, WF1 should continue to display the saved manufacturer/engineering conditions as review requirements rather than infer customer answers or compatibility.
