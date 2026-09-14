# Push 35 — WF4 Governed Reference / Provenance Intake

## Scope
Advanced one WF4 package only: reference/provenance intake and persisted evidence governance inside the existing render-asset registry. No customer product features, catalogue product data, visual generation, or Y62 master promotion were added.

## Completed
- Added a staff **REGISTER REFERENCE** workflow to the existing Render Assets registry.
- Staff can persist owner/external authenticity evidence with:
  - stable reference ID;
  - Y62 view;
  - source type;
  - source URL or governed local reference path;
  - rights/licence status and provenance note;
  - primary/support authenticity role;
  - optional file metadata / SHA-256;
  - canonical master bindings (`Y62-F34-V1`, `Y62-SIDE-V1`, `Y62-R34-V1`);
  - reference-only vs reviewed `reference-approved` state.
- Existing reference records now show the canonical master(s) that consume their evidence and link directly to those persisted master records.
- Reference records explicitly display `productionEligible: false` to staff.
- Added one shared visual-governance reference gate used by both hosted persistence and the browser-local adapter.
- The server now rejects reference records that attempt to:
  - leave `reference-only` runtime status;
  - use a production layer/SKU;
  - use master/layer production governance states;
  - claim production eligibility;
  - use unsupported canonical master IDs;
  - omit source type, rights status or provenance note;
  - register a local reference path without SHA-256 integrity evidence;
  - enter `reference-approved` without reviewer identity and timestamp.
- Persisted reference audit events now include asset class, governance state and the non-production reference-evidence payload.
- Existing owner-reference governance metadata receives safe reviewer-evidence backfill during registry sync if an older persisted Alpha record is missing the source-intake reviewer/timestamp. Candidate/production state is not changed.
- Browser-local governance sync mirrors the same metadata refresh behaviour so the staff tool does not diverge from the hosted model.
- No new endpoint or persistence backbone was introduced; the package uses the existing render-asset registry and `PUT /staff/render-assets/{assetId}` route.

## Governance result
`REFERENCE_BACKED_APPROVED_VISUALS_ONLY` is preserved and strengthened. A reference may be approved as authenticity/provenance evidence, but `visualGovernance.productionEligible(reference)` always remains false and the server rejects candidate or production runtime status for the reference class.

No reference image, master draft, layer draft, approximate asset or unsupported visual was promoted to customer production in this package.

## Verification
- New targeted regression: `tests/wf4-reference-intake-alpha26.js` — PASS.
- Confirmed all 9 owner references persist `productionEligible: false` and reviewer evidence for approved owner-source intake.
- Confirmed URL-only external exact-vehicle evidence can be registered as reference-only without pretending binary ownership.
- Confirmed canonical master bindings persist on reference evidence.
- Confirmed invalid runtime state, unsupported canonical binding, missing local checksum and unreviewed `reference-approved` records are rejected with `reference_evidence_gate_blocked`.
- Confirmed even a correctly reviewed `reference-approved` record remains non-production and is rejected from `production-ready`.
- Existing WF4 canonical-view registry regression — PASS.
- Existing WF4 production reviewer gate — PASS.
- Full Alpha 12 → Alpha 26 regression chain (`npm test`) — PASS.
- WF5 positive production-promotion lifecycle — PASS.
- `npm run check` — PASS.
- 87 JavaScript files pass `node --check`.
- 12 JSON files parse successfully.
- 15 HTML files / 240 local dependencies — zero missing references.

## Next WF4 dependency
The highest-value next WF4 dependency is still a genuine reviewable `Y62-F34-V1` candidate from WF3 with the locked overlay/provenance/rights package complete. WF4 can then use the now-complete evidence chain — owner/external reference intake → persisted canonical master contract → identified reviewer → `master-approved` → immutable production promotion — without relying on untracked source material.

If WF3 remains blocked on the F34 binary, the next independent WF4 package should be governed catalogue/fitment editing validation on the existing shared catalogue runtime; it should not create a second catalogue or fitment authority.
