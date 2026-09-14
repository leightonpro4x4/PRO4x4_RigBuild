# Push 34 — WF4 Canonical View Registry + Evidence Readiness

## Scope
Advanced one WF4 package only: persist the canonical-view governance contract on the existing shared render registry and make that evidence visible to staff from the Production Readiness screen. No customer UX, product catalogue ownership, visual generation or production promotion was added.

## Completed
- Extended persisted owner/reference records with `referenceEvidence` metadata:
  - primary/support authenticity role;
  - explicit `productionEligible: false`;
  - canonical master briefs that consume each reference.
- Extended the three governed Y62 canonical master slots with persisted `canonicalView` metadata:
  - `briefId`, view label and launch priority;
  - canvas, framing, camera and tolerance contract;
  - exact backing owner/reference IDs;
  - owner-pack source gap where applicable;
  - F34 overlay review contract ID and required checks;
  - required promotion target and customer-exposure rule.
- Updated hosted visual-governance sync so missing static metadata is backfilled onto existing records without replacing candidate binaries, reviewer notes, governance state, approvals, version lineage or production evidence.
- Added `metadataUpdatedCount` / `metadataUpdated` to the sync report and audit metadata.
- Kept the sync idempotent: a second run changes nothing once the static contract is current.
- Added the same canonical/reference metadata to the browser-local registry seed for one shared data model.
- Added a Canonical View Registry panel to staff Production Readiness showing, for F34/SIDE/R34:
  - persisted governance state;
  - camera profile and match state;
  - backing reference coverage and primary/support roles;
  - provenance/rights state;
  - candidate and production version counts;
  - owner-pack source gaps;
  - review contract;
  - exact open production blockers;
  - direct links to the canonical master and each backing reference record.

## Governance result
`REFERENCE_BACKED_APPROVED_VISUALS_ONLY` is unchanged. Owner/source references remain evidence-only and never satisfy production readiness. This package promotes no Y62 asset and creates no visual binary.

## Verification
- New targeted test: `tests/wf4-canonical-view-registry-alpha26.js` — PASS.
- Confirmed 9 persisted owner references and 3 persisted canonical master contracts.
- Confirmed `Y62-F34-V1-OVERLAY-01` is bound to the F34 master with all 8 required checks visible in persisted metadata.
- Confirmed the SIDE master exposes the required clean-side-source gap rather than implying certainty.
- Confirmed static metadata refresh preserves candidate/reviewer notes and governance state.
- Confirmed a second metadata sync is idempotent.
- Complete Alpha 12 → Alpha 26 regression chain (`npm test`) — PASS.
- WF5 positive production-promotion lifecycle — PASS.
- Server static check (`npm run check`) — PASS.
- All 86 JavaScript files pass `node --check`.
- All 12 JSON files parse.
- 15 HTML files / 240 local dependencies — zero missing references.

## Next WF4 dependency
The canonical-view control plane is now ready to accept a genuine reviewable master. The next highest-value dependency is WF3 supplying a clean `Y62-F34-V1` candidate that actually passes the locked overlay/provenance/rights contract. WF4 can then exercise the visible candidate → identified reviewer → `master-approved` → immutable production path against this persisted canonical contract. SIDE and R34 remain behind F34, with the SIDE source-pack gap intentionally visible to staff.
