# WF1 Run 01 — Immutable Revision UX Integrity

## Package advanced
**A26-WF1-02 — Saved-build / share integrity**

The customer builder already had category → vendor → product navigation, pre-ADD compatibility gating and visual-state badges. The highest-risk remaining WF1 issue was that a customer could modify a previously saved build while the project chip still appeared saved, then potentially share a link to the older immutable revision. This run closes that mismatch without changing backend ownership.

## Implemented
- Added explicit customer-side `dirty` state for any on-screen change after an immutable save.
- Product add/remove, clear-build, undo/redo and quote/contact-field edits now invalidate the clean saved state.
- Saved-project chip changes to **UNSAVED CHANGES** and identifies the last saved revision.
- Share is disabled while changes are unsaved and changes its CTA to **SAVE CHANGES TO SHARE**.
- A direct share attempt while dirty is rejected with a clear customer explanation rather than sharing a stale revision.
- Header save CTA becomes **SAVE CHANGES** while dirty and **SAVED ✓** once the exact screen state is persisted.
- Repeated SAVE on an unchanged saved build no longer creates a redundant immutable revision.
- Saving a new immutable revision clears dirty state and restores sharing against the exact saved revision.
- Customer-facing checkpoint labels updated from stale Alpha 24 wording to Alpha 26.

## Governance preserved
- No backend/catalogue ownership duplicated.
- No visual asset, product image or render state invented.
- Share links still bind to a specific immutable revision.
- Quote submission still saves the exact current state before queue handoff.
- `REFERENCE_BACKED_APPROVED_VISUALS_ONLY` remains unchanged.

## Verification
- `node --check merged-app.js` — PASS.
- New `tests/wf1-save-share-integrity-alpha26.js` — PASS.
- Full `npm test` Alpha 12 → Alpha 26 chain — PASS after the WF1 changes.
- Existing WF3 candidate test present in the shared merged checkpoint also remained green; WF1 did not alter that workstream.

## Next WF1 dependency
**A26-WF1-03 — Selected-build visual readiness summary.**
Show approved-preview / preview-pending / staff-review counts inside the build summary so a customer knows exactly what will and will not be visually represented before saving or requesting a quote. This consumes the existing WF2 visual-readiness contract and does not require WF3 imagery to be complete.
