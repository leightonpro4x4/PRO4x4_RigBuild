# PRO4X4 Rig Builder — Master Workflow Checkpoint (Merged Alpha 25)

## Locked direction
- PRO4X4 dark digital-workshop / premium 4WD retail interface.
- One application and one data/workflow backbone.
- Nissan Patrol Y62 Warrior = first production visual/render proof vehicle.
- Next-Gen Ranger = catalogue/fitment proof vehicle inside the same app.
- Reference-backed visual rule: unapproved references, approximate products and synthetic stand-ins can never be customer production layers. Canonical renders are permitted only when derived from verified references, separately governed, reviewed and approved.

## Verified foundation
1. Vehicle-first customer configurator with Ranger + Y62 programmes.
2. Recovered Ranger catalogue slice: 20 source-backed product records with dependencies/exclusive groups.
3. Governed Y62 catalogue, fitment/dependency/conflict gates, pricing, weight planning and formal quote workflow.
4. Immutable projects/revisions, sharing, sales queue and quote finalisation.
5. Hosted HTTP/SQLite runtime, authentication/session model, audit, backup/restore and deployment scaffold.
6. Governed Y62 render registry/provenance/vault/version lineage/S3-compatible storage/CDN boundary.
7. Server-authoritative exact render resolver with `available / missing / blocked`, exact SKU/state matching and no fallback.
8. Y62 production contracts, checksum-pinned delivery, retry/telemetry and state-aware readiness matrix.
9. Explicit Y62 core readiness plan: 15 paint/wheel/view slots; missing slots create only `asset-needed` records and never artwork.
10. Alpha 24 unified Ranger/Y62 customer shell now saves, shares and submits quotes through the same immutable project backend.

## Current Y62 visual gate
The owner has now supplied genuine photographs of the exact 2025 Series 5 Y62 Patrol Warrior target vehicle. This unblocks authenticity/reference intake but does not automatically create production-ready visual layers. External exact-vehicle imagery may be used as reference-only geometry support. The next gate is the canonical-master pipeline documented in `CANONICAL_VISUAL_PIPELINE.md` and `ALPHA26_IMPLEMENTATION_BOARD.md`.

## Immediate visual sequence
1. Clean Black Obsidian Warrior base — front 3/4 (`Y62-F34-V1`, 1672 × 615 transparent).
2. Factory Warrior wheel/tyre isolated state.
3. Exact SLX X-1.
4. Exact Offroad Animal Scout rack.
5. AE4705B + BB-015P aerial assembly.

## Alpha 25 checkpoint
- [x] Customer-facing Ranger/Y62 shell merged.
- [x] Alpha 23 Y62 readiness matrix preserved in merged branch.
- [x] Merged SAVE BUILD uses immutable project revisions.
- [x] Merged quote request saves exact revision before staff-queue submission.
- [x] Ranger and Y62 use the same project/quote/share backend contract.
- [x] Vehicle-neutral project titles in local and SQLite runtimes.
- [x] Project deep-link load into merged configurator.
- [x] Customer share links from merged configurator.
- [x] Ranger pricing normalisation does not invent Y62-specific quote components.
- [x] Ranger engineering products remain staff-fitment gated.
- [x] Merged Y62 shell queries exact server render readiness and shows no stand-in artwork.
- [x] Full Alpha 12–24 regression chain green.

- [x] WF1–WF5 parallel delivery model established with hard ownership boundaries.
- [x] Staff Workstream Control board added.
- [x] WF5 is the sole integration/promotion gate; WF1–WF4 cannot create competing backbones.
- [x] Y62 visual asset blocking isolated to WF3 so customer UX, catalogue/fitment and staff tooling can advance independently.
- [x] Alpha promotion rules explicitly preserve exact-state render resolution, immutable project lineage and the no-fake-render-layer rule.
- [ ] Complete remaining Ranger catalogue/fitment records from recoverable sources.
- [ ] Genuine clean Black Obsidian `Y62-F34-V1` production base.

## Next highest-priority unfinished work
WF1: finish category → manufacturer/vendor → product browsing and pre-selection dependency/conflict explanations.

WF2: expand verified Next-Gen Ranger catalogue/fitment data beyond the 20 recovered records.

WF3: lock the owner-supplied Y62 reference pack, issue canonical F34/SIDE/R34 briefs, then build reference-backed masters under the revised approval model. Do not directly promote third-party reference photos or unreviewed approximations.

WF4: deliver the editable governed catalogue/fitment staff workflow.

WF5: gate candidate packages independently, then run the complete regression chain before the next Alpha promotion.
