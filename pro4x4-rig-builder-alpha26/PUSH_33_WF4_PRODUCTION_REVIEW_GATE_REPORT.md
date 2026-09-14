# Push 33 — WF4 Unified Production Reviewer-Evidence Gate

## Scope
Advanced one highest-priority WF4 package only: close the QA-returned production-control gap where the direct staff render-asset upsert path could reach `production-ready` without immutable reviewer identity and review timestamp, while preserving the existing version-promotion workflow, persisted visual-governance registry, canonical-reference visibility and one shared runtime/backbone.

No catalogue/product feature work was added. No customer UX or visual assets were created.

## Completed
- Extended the common server `productionProblems()` gate so every production-eligible canonical master or product layer requires:
  - an explicit persisted `governance.reviewedBy` identity;
  - an explicit persisted `governance.reviewedAt` timestamp;
  - a parseable review timestamp.
- The rule now applies to the direct `PUT /api/v1/staff/render-assets/:id` production path as well as version promotion, closing the path mismatch identified by WF5.
- Direct production upsert now creates and persists server-side `approval.reviewEvidence` containing:
  - review governance state;
  - reviewer identity;
  - reviewer timestamp;
  - camera-match result;
  - usage-rights state;
  - binary SHA-256;
  - current version pointer when one exists;
  - `promotionPath: direct-upsert`.
- The same review evidence is written into the render-asset audit metadata.
- Once a production record has persisted review evidence, a direct upsert cannot silently rewrite its reviewer identity or review timestamp. The server returns `review_evidence_immutable`; a fresh review decision must use a new staged asset version.
- Staff-side production preflight now also reports missing/invalid reviewer evidence before a production action is attempted.
- Preserved/merged the WF4 staff evidence surface: canonical-master reference packs, reference source/right/governance details, immutable promotion evidence, version lifecycle, reviewer identity and record history remain visible in the existing Render Assets registry.

## Governance result
`REFERENCE_BACKED_APPROVED_VISUALS_ONLY` is unchanged.

Reference-only, `master-draft`, `layer-draft`, unsupported-rights, unverified-camera or unreviewed assets remain ineligible for customer production. This push does not promote any Y62 candidate or create any production visual.

## Verification
- Added `tests/wf4-production-review-gate-alpha26.js`.
- Restored the existing `tests/alpha26-wf4-review-evidence-visibility.js` into the full Alpha chain so staff evidence visibility remains guarded during future merges.
- Updated historical synthetic production fixtures only to include the reviewer identity/timestamp now required by the stronger gate; no acceptance rule was weakened.
- `npm test`: **PASS**, including the complete historical Alpha 12 → Alpha 26 regression chain plus both WF4 evidence tests.
- `npm run test:wf4-review-gate`: **PASS**.
- `npm run test:wf5-promotion`: **PASS**; staged draft remains hidden, missing reviewer evidence is rejected, reviewed `master-approved` promotion resolves customer-visible only after promotion, immutable project/share/quote lineage remains intact.
- WF5 acceptance re-check: **WF4-DIRECT-PRODUCTION-REVIEW PASS**. The overall WF5 acceptance command remains red only because the separate WF1 `anyOfRequiredParts` BOM gate is still outstanding.
- `npm run check`: **PASS**.
- All **85 JavaScript files** pass `node --check`.
- All **12 JSON files** parse successfully.
- **15 HTML files / 236 local dependencies**: zero missing references.

## Next WF4 dependency
WF4's QA-returned production-review bypass is closed and is ready for WF5 re-adjudication. After that, the next delivery dependency is WF3 providing a clean, genuinely reviewable `Y62-F34-V1` canonical master candidate with completed overlay/provenance/rights evidence. WF4 can then run the real `master-draft` → `master-approved` → immutable production promotion path through the now-unified gate.
