# PRO4X4 Rig Builder — Push 44 / A26-WF4-16
## Persisted Canonical Review Queue / Assignment Controls

### Package advanced
One WF4 package only: reviewer / approval workflow. No catalogue, customer configurator, visual-production, or unrelated backend lane was advanced.

### Concrete progress
WF4 now persists a `reviewWorkflow` on every governed Y62 canonical master through the existing render-asset registry. The workflow is SHA-256 bound to the exact canonical brief/review contract, owner-reference pack snapshots and WF3 candidate handoff. It is explicitly `authority: review-assignment-only` and `productionEligible: false`.

Fitment/admin staff can refresh reviewer intake, claim an eligible canonical review and release a claim. Sales remains inspection-only. A claim records reviewer actor ID, display name, role and assignment time but cannot change `master-draft`, stage a version, replace a binary or move the production pointer.

The production path now verifies the current assignment as an additional fail-closed gate: the acting reviewer must match the persisted reviewer assignment and the canonical binary checksum must equal the candidate checksum bound when the review was claimed. Reference/candidate evidence drift makes the workflow stale. Explicit refresh drops a claim if its evidence binding changed instead of silently carrying review authority onto different source material.

Staff Render Assets now exposes the canonical review queue, assignment state, workflow SHA, evidence-binding SHA, dossier binding, candidate identity, claim blockers and claim/release controls. Production Readiness exposes the same persisted reviewer assignment state beside the canonical master, owner reference pack, WF3 handoff and governance dossier.

### Current governed Y62 state
- `Y62-F34-V1-MASTER`: `blocked-upstream`, current workflow, unassigned, 12 upstream blockers. It remains bound to `Y62-F34-V1-CANDIDATE-02` SHA-256 `a353980a92131b960fed91baa46609bc63c1ec07a485fd4612fa305f0f7cea28` and is not claimable.
- `Y62-SIDE-V1-MASTER`: `awaiting-wf3-candidate`, unassigned; required side source gap remains explicit.
- `Y62-R34-V1-MASTER`: `awaiting-wf3-candidate`, unassigned.

No Y62 visual was promoted. `assets/` and `references/` are byte-for-byte unchanged from Push 15. Customer-critical entrypoints/render contracts checked for this package are unchanged. `REFERENCE_BACKED_APPROVED_VISUALS_ONLY` remains authoritative.

### Verification
The new adversarial reviewer-workflow regression passes. It proves blocked current F34 intake, successful claim only after a synthetic clean evidence handoff, role enforcement, wrong-reviewer rejection, exact candidate-checksum binding, evidence-drift staleness, explicit claim invalidation, and no implicit approval/version staging/promotion.

The complete Alpha regression chain passes. `npm run check` passes. The WF5 governed promotion lifecycle passes. Static verification: 110 JavaScript files / 0 syntax failures; 24 JSON files / 0 parse failures; 16 HTML files / 274 local dependencies / 0 missing. ZIP integrity is checked after packaging.

The broader WF5 acceptance gate remains red for exactly one pre-existing WF1 defect: `WF1-BOM-ANYOF`. `WF4-DIRECT-PRODUCTION-REVIEW` remains PASS and customer draft/reference isolation remains PASS.

### Next dependency
`A26-WF4-14B`: WF3 must provide the first genuinely clean, reviewable `Y62-F34-V1` candidate with clean isolation/reconstruction, locked overlay + camera acceptance, production-rights provenance and identified reviewer evidence. That will allow WF4 to exercise the real owner-reference pack → persisted WF3 handoff → reviewer claim → eight-check canonical review → immutable production → sealed audit → project/quote inspection chain end-to-end.
