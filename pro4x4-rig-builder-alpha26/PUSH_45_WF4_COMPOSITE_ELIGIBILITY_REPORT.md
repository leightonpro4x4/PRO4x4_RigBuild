# PRO4X4 Rig Builder — Push 45 / A26-WF4-17
## Layer Approval + Composite Eligibility Controls

### Package advanced
One WF4 package only: **A26-WF4-02 Layer Approval + Composite Eligibility**. No catalogue expansion, WF3 visual production, customer UX work, quote workflow expansion or unrelated backend lane was advanced. Backend changes were limited to the active production-render eligibility path.

### Concrete progress
WF4 now persists a `compositeEligibility` contract on every governed non-base Y62 visual layer through the existing render-asset registry. The contract binds vehicle, view, exact SKU/state, layer role and target canonical master, while declaring the only canonical/layer governance states allowed in a production composite. Exact matching is mandatory and fallback remains `none`.

The current governance sync produces **19 persisted composite bindings** across F34, SIDE and R34 state/product-layer records. Bindings target `Y62-F34-V1-MASTER`, `Y62-SIDE-V1-MASTER` or `Y62-R34-V1-MASTER` according to the governed view. Static binding drift can be repaired by governance sync, but that operation cannot alter production status, reviewer state, binary objects or immutable production lineage.

The shared server render resolver now applies the composite gate after ordinary exact-SKU/state resolution. A non-base layer cannot resolve customer-visible without an available governed base/root in the same requested stack. Missing base approval fails closed; stale/tampered `compositeEligibility` metadata fails closed; an unapproved exact layer fails closed through the existing production gate. Binary/filename presence is therefore insufficient to make a preview production-eligible.

Staff **Render Assets** now exposes each layer's persisted canonical-master binding, exact SKU, allowed governance states, exact-match/fallback policy and current binding-integrity result, with a direct link to the bound canonical master. The reference-pack, canonical dossier, handoff and reviewer-assignment surfaces from earlier WF4 pushes remain on the same shared backbone.

### Governance state preserved
`REFERENCE_BACKED_APPROVED_VISUALS_ONLY` remains authoritative. There are **0 production-eligible Y62 visuals** in the clean governed state. F34 remains blocked upstream on the returned WF3 candidate; SIDE and R34 remain awaiting WF3 candidates, with the SIDE source gap still explicit. No visual was promoted.

`assets/` and `references/` are byte-for-byte identical to Push 16. Eleven customer-critical entrypoints/render-contract files are also byte-for-byte identical. This package changed the shared staff/governance runtime and server-side eligibility gate only; it did not introduce substitute artwork or customer-facing fallback behavior.

### Verification
The new `wf4-composite-eligibility-alpha26` regression passes and proves persisted binding, fail-closed layer-without-base behavior, a valid governed master+layer composite path, tampered-binding rejection, metadata repair without reviewer-state changes, and zero visual promotion from governance sync.

The complete Alpha regression chain passes. `npm run check` passes. The WF5 governed promotion lifecycle passes. Static validation passes at **112 JavaScript files / 0 syntax failures, 27 JSON files / 0 parse failures, and 16 HTML files / 276 local references / 0 missing**. ZIP integrity is checked after packaging.

The wider WF5 acceptance gate remains red for exactly the pre-existing WF1 defect `WF1-BOM-ANYOF`. `WF4-DIRECT-PRODUCTION-REVIEW` remains PASS and `WF5-CUSTOMER-DRAFT-ISOLATION` remains PASS.

### Next dependency
The primary dependency remains the first genuinely clean, reviewable **`Y62-F34-V1`** candidate from WF3 with clean isolation/reconstruction, locked overlay + camera acceptance, production-rights provenance and identified reviewer evidence. After F34 is approved and immutably promoted, the first exact accessory layer — preferably the front-bar proof family already in the governed sequence — must be reference-backed, exact-SKU bound and `layer-approved`. That will exercise the real **owner reference pack → WF3 handoff → canonical review/approval → immutable master production → exact product-layer approval → composite resolver → project/quote inspection** chain end-to-end.
