# PRO4X4 Rig Builder — WF1 Run 07

## Package advanced

**Pre-selection dependency / conflict impact preview** — one WF1 package only.

This run closes a customer-understanding gap in the product cards. Governed dependencies and conflicts are now explained before the customer presses **ADD**, including incompatibilities that are not yet active in the current build. The package is presentation-only and does not create or modify catalogue truth.

## Concrete progress

- Added `customer-product-guidance.js`, a read-only presentation contract that derives compatibility guidance from the existing governed product record and current selection state.
- Product cards now include a **BEFORE YOU ADD** block whenever the governed record declares dependencies or conflicts.
- All-of dependencies are shown as one of:
  - **REQUIRES** — known supporting product will be auto-added by the existing selection gate;
  - **REQUIRED SUPPORT SELECTED** — dependency already satisfied;
  - **REQUIRED PART BLOCKED** — governed dependency itself has no approved fitment path;
  - **REQUIRED PART NEEDS STAFF REVIEW** — dependency token has no selectable governed catalogue record.
- Any-of dependencies show every governed alternative and never choose one for the customer. Once a valid alternative is selected, the card changes to **SUPPORT CHOICE MET**.
- Known conflicts are now disclosed before selection as **CANNOT COMBINE WITH**. If the conflicting product is already selected, the same row becomes **ACTIVE CONFLICT** and the existing selection gate remains the behavioural blocker.
- Non-product/manufacturer constraint tokens remain **FITMENT CONSTRAINT NEEDS STAFF REVIEW** rather than being converted into guessed compatibility rules.
- Existing live blocker/warning and resolution-action behaviour remains in `product-visual-contract.js`; this package only explains its governed inputs more clearly.
- New guidance strings are escaped before card rendering.

## Scope protection

Diff against WF1 Run 06 confirms changes are limited to:

- `customer-product-guidance.js` (new)
- `index.html`
- `merged-app.js`
- `merged.css`
- `tests/wf1-preselection-compatibility-alpha26.js` (new)
- `package.json`
- this report

No Ranger/Y62 catalogue data, fitment records, backend/server implementation, project/quote persistence, asset registry, render manifest, canonical candidate, or visual asset files were changed.

`REFERENCE_BACKED_APPROVED_VISUALS_ONLY` and exact/no-fallback customer visual behaviour are unchanged.

## Verification

Passed:

- `npm run test:wf1-preselection`
- targeted synthetic checks for known required parts, OR alternatives, known conflicts, active conflicts, blocked dependencies, and unmapped/staff-review constraints
- governed-checkpoint integration checks using:
  - Ranger `mcc-309rp` → `mcc-309bsbk` dependency;
  - Ranger lower bash → Predator **OR** Toro dependency;
  - Y62 `hbmc-lift` → preserved unmapped `factory-warrior-50mm-lift` conflict token
- complete `npm test` Alpha 12 → Alpha 26 regression chain
- `npm run check`
- `npm run test:wf5-promotion`
- WF5 `WF1-BOM-ANYOF` acceptance check: **PASS**
- WF5 customer draft-visual isolation: **PASS**
- JavaScript syntax validation: **93 files passed**
- JSON parsing: **9 files passed**
- HTML dependency validation: **15 HTML files / 240 local references / 0 missing**
- output ZIP integrity: passed

The combined WF5 acceptance gate remains held only by the existing **WF4-DIRECT-PRODUCTION-REVIEW** defect: direct production upsert can still accept `master-approved` metadata without immutable reviewer identity/timestamp. This WF1 run does not touch WF4.

## Next WF1 dependency

The highest-priority blocked WF1 package remains **structured customer fitment-context capture**. The latest governed catalogue checkpoint available to this merged branch does not publish question IDs, allowed answers, or answer semantics, so WF1 still must not infer them from free-text manufacturer conditions.

If that WF2 contract remains unavailable at the next WF1 push, the next independent UX package should be **build-summary traceability back to product constraints**: let a customer jump from an unresolved summary gate directly to the exact product card / manufacturer path that owns the requirement, without changing catalogue or fitment ownership.
