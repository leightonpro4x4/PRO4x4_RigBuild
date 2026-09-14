# PRO4X4 Rig Builder — Parallel Delivery Model

## Purpose
Increase delivery throughput without creating multiple competing versions of the Rig Builder. WF1–WF4 can advance independently. WF5 is the only integration/promotion gate. All promoted work lands in one merged Alpha and one data/runtime backbone.

## Locked programme rules
- PRO4X4 dark digital-workshop / premium 4WD retail direction remains authoritative.
- Nissan Patrol Y62 Warrior remains the first production visual proof vehicle.
- Next-Gen Ranger remains the catalogue/fitment proof vehicle.
- Reference-backed approved visuals only: raw references, approximate artwork and unreviewed synthetic stand-ins can never be promoted to customer production. A canonical render is allowed when it is derived from verified references, separately governed and approved.
- Existing immutable project → revision → share → quote lineage is preserved.

## WF1 — Customer Configurator / UX
Owns customer browsing, category/manufacturer/product menus, product cards, pre-selection compatibility messages, build summary and customer save/share/quote experience.

Current package: finish openable category → manufacturer/vendor → product navigation and explain requirements/conflicts before ADD.

## WF2 — Catalogue + Fitment Data
Owns source-backed product identity, SKU, RRP, install, weight, fitment, dependencies, conflicts, hidden fitting parts and review gates.

Current package: expand Next-Gen Ranger beyond the recovered 20 source-backed records, then prepare equivalent Y62 mappings.

## WF3 — Y62 Visual Production
Owns Y62 camera contracts, readiness matrix, source/provenance, candidate review, production promotion and exact-state render delivery.

Current package: lock the exact-vehicle owner photo reference pack, add reference-only external geometry support where useful, create canonical F34/SIDE/R34 briefs, then produce reference-backed canonical masters.

WF3 visual production must never block WF1, WF2 or WF4. Missing visual coverage is represented explicitly rather than fabricated.

## WF4 — Platform / Staff Tools
Owns catalogue/fitment editing, approvals, render readiness controls, project/quote inspection and audit/production tools. Backend expansion is allowed only when one of the delivery lanes needs it.

Current package: editable governed catalogue/fitment review workflow.

## WF5 — QA / Integration Gate
WF5 builds no features. It verifies each incoming package against its acceptance criteria, checks cross-stream regressions, runs the full Alpha regression chain, and locks passing packages. Only WF5 may mark a package ready for Alpha promotion.

## Merge rules
1. Every package has one owning workstream.
2. Shared contracts are changed deliberately, not copied into stream-specific variants.
3. Workstream packages may be developed independently but may not create separate persistence, project, quote, render or catalogue backbones.
4. A package must carry verification evidence before WF5 accepts it.
5. Any Y62 visual path must preserve exact `available / missing / blocked` resolution and zero fallback.
6. Failed WF5 packages return to their owning stream with a concrete defect; passing packages are locked unless a regression is later demonstrated.
7. Only after WF5 passes the package set is the merged Alpha version advanced.

## Parallel push shape
A productive cycle may advance all four delivery lanes independently:
- WF1: one UX package.
- WF2: one catalogue/fitment batch.
- WF3: one visual readiness/asset package if a genuine source exists; otherwise record the external block and do not fabricate work.
- WF4: one staff/platform package.
- WF5: test completed candidate packages and promote only passing work.

This model is deliberately compatible with manual pushes or future scheduled runners. Automated pushing is not required for the model itself.
