# Push 32 — WF4 Reviewer Evidence + Canonical Reference Visibility

## Scope
Advanced one WF4 package only: make the already-persisted Visual Governance v2 metadata and immutable version evidence clearly inspectable by staff inside the existing Render Assets registry. No product features and no second backend/runtime were introduced.

## Completed
- Added an explicit staff **Review / Approval Evidence** panel for the selected asset/version.
- Promoted immutable versions now surface the persisted `approval.reviewEvidence` fields: governance review state, reviewer identity, review timestamp, approving actor, approval timestamp, camera-match result, usage-rights state, immutable version ID and checksum evidence.
- Candidate versions remain clearly marked **WORKING**; promoted production versions are marked **LOCKED / IMMUTABLE PROMOTION EVIDENCE** so staff can distinguish editable review metadata from frozen production evidence.
- Expanded immutable version lineage rows with staged/promoted/superseded/rejected lifecycle, acting staff identity and reviewer identity.
- Added visible rejection notes for rejected candidate versions.
- Expanded canonical-master evidence to show every backing reference record with source type, reference governance state and checksum prefix, while retaining click-through to the protected staff reference source.
- Expanded reference records with source type, rights state, view and governance state.
- Added in-registry record-history visibility for recent governance/version actions.
- Preserved `REFERENCE_BACKED_APPROVED_VISUALS_ONLY`; this package changes staff visibility only and does not make any draft/reference asset customer eligible.

## Backend/runtime impact
- None required. The existing persisted version payload, review evidence, reference registry and audit event already expose the required authoritative data.
- One shared runtime/backbone remains in use.

## Verification
- Added targeted test `tests/alpha26-wf4-review-evidence-visibility.js`.
- Test constructs a canonical-master candidate, records explicit `master-approved` reviewer evidence, promotes the immutable version and confirms the same reviewer evidence is present in both the production version payload and promotion audit event.
- Test verifies the staff registry contains the immutable evidence panel, lifecycle visibility, canonical reference-pack visibility, record history and reviewer-pending state.
- Full Alpha regression chain passes including the new test.
- `npm run check` passes.
- All 82 JavaScript files pass `node --check`.
- All project JSON files parse successfully.
- Existing persisted-governance regression still confirms 9 owner references + 3 canonical master slots, idempotent sync, protected reference delivery and zero governed production-eligible records before genuine approval.

## Next WF4 dependency
WF3 must provide the first genuine transparent `Y62-F34-V1` staged candidate. WF4 can then use this now-visible evidence surface to review overlay/provenance, move the candidate to `master-approved`, promote the immutable version and expose the complete evidence trail for WF5's staged-candidate → production resolver test.
