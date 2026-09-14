# PUSH 36 — WF4 Catalogue + Fitment Governance

## Package advanced

One WF4 package only: **governed catalogue / fitment editing and publish controls**.

This push does not create customer product features or visual assets. It keeps the existing shared runtime/backbone and leaves `REFERENCE_BACKED_APPROVED_VISUALS_ONLY` untouched.

## Concrete progress

### Shared governance policy

Added `catalogue-governance.js` as the single catalogue/fitment validation policy used by both the browser-local staff adapter and the hosted/server database path.

The policy now validates:

- product identity and required fields;
- duplicate catalogue IDs and SKUs;
- component pricing structure and required-price declarations;
- confirmed / engineering / blocked states;
- compatible vehicle evidence;
- mandatory staff-review gates for engineering or blocked states;
- all-of accessory dependencies (`requiredParts`);
- any-of accessory dependencies (`anyOfRequiredParts`);
- unresolved custom fitting-part tokens without falsely promoting them to confirmed selectable dependencies;
- conflicts and setup conditions as retained source/fitment metadata;
- source authority, URL and verification state;
- non-negative weight and installation ranges.

Unknown or engineering states are not automatically upgraded. A blocked/engineering record may retain an unresolved fitting-part token as an explicit warning while a confirmed record is rejected if it claims an unresolved required selectable part.

### Persisted draft governance

Catalogue drafts can still be saved while incomplete, which is necessary for real staff work. Every hosted/local governed draft now persists:

- governance policy + policy version;
- validation stage;
- validation timestamp;
- validating staff identity/role;
- blocker/warning summary;
- concrete validation errors/warnings;
- hosted catalogue checksum.

The audit event for a draft save also records its governance summary and checksum.

### Server-enforced publication gate

Publication is no longer dependent on browser-side validation. The server independently re-validates the complete catalogue and rejects a publish with `catalogue_governance_blocked` if any governance blocker remains.

This prevents malformed or unsupported fitment states from bypassing the staff UI through a direct API request.

### Immutable catalogue revisions

Accepted server publications now always generate the next immutable catalogue revision (`Y62-CAT-001`, `Y62-CAT-002`, etc.) rather than trusting a revision ID carried forward in a draft.

The persisted validation record includes `publishedRevision`, `supersedesRevision` and a catalogue checksum. Regression coverage confirms publishing a second revision does not overwrite the first revision payload.

### Staff visibility / editing

The Catalogue + Fitment staff page now exposes:

- a visible **PUBLISH GATE** KPI;
- a dedicated **Governance blockers** review column;
- persisted validation actor/time/stage;
- explicit **ALL required** accessory dependencies;
- explicit **ANY ONE required** accessory dependencies;
- vehicle/setup conditions, one condition per line;
- a governed-draft save action that can retain incomplete work without allowing it to publish.

The current Y62 baseline passes the blocking gate with **0 errors** while retaining **12 warnings** for known quote/source uncertainty. Those warnings include the blocked Clearview custom-adaptation token and quote-only pricing gaps; they are intentionally not inferred away.

## Scope protection

A byte comparison against WF4 Push 07 confirms no changes to:

- `assets/`;
- `references/`;
- customer `index.html`;
- `merged-app.js`;
- `merged-project-contract.js`;
- `product-visual-contract.js`;
- `render-manifest-y62.js`;
- `visual-governance.js`;
- Y62 owner-reference/canonical brief sources.

The only functional files changed are the catalogue governance/staff lane, shared backend adapter, server catalogue persistence, its test, package metadata and staff styling.

## Verification

- `tests/wf4-catalogue-governance-alpha26.js` — **PASS**
- Full Alpha regression chain (`npm test`) — **PASS**
- `npm run check` — **PASS**
- WF5 positive visual promotion lifecycle — **PASS**
- JavaScript syntax validation — **89 files / 0 failures**
- JSON parse validation — **12 files / 0 failures**
- HTML/local dependency validation — **16 HTML files / 244 local references / 0 missing**
- Existing WF4 production-review, canonical-view and reference-intake regressions — **PASS** inside the full chain

WF5's combined acceptance gate remains red for the already-known **WF1-BOM-ANYOF** defect only. `WF4-DIRECT-PRODUCTION-REVIEW` remains **PASS** and customer draft/reference isolation remains **PASS**. This push does not alter that separate WF1 delivery lane.

## Next dependency

The primary WF4 visual dependency remains a genuine clean `Y62-F34-V1` candidate from WF3 with overlay, provenance and rights evidence complete. That enables the real canonical-master reviewer → approval → immutable production path to be exercised against the persisted registry.

If that binary is still unavailable on the next WF4 pass, the next independent WF4 package is **project / quote inspection**, surfacing the immutable project revision, quote snapshot, render state and governed evidence lineage to staff without changing customer behaviour.
