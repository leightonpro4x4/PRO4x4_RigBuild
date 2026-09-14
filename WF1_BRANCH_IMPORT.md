# PRO4X4 Rig Builder — WF1 Branch Import

Target repository: `leightonpro4x4/PRO4x4_RigBuild`

Target branch: `wf1`

Checkpoint: **Merged Alpha 26 — WF1 Run 26**

This package is a complete repository-root snapshot for the dedicated WF1 Customer Configurator / UX branch. It preserves all source code, configuration, schemas, tests, documentation, governed Y62 reference/visual assets, QA evidence, workflow reports, and supporting project files contained in the latest WF1 checkpoint.

## Import rules

1. Checkout only branch `wf1`.
2. Copy the contents of this directory to the repository root.
3. Do not merge, reset, or write to `main`, `alpha93-master`, or branches `wf2`, `wf3`, `wf4`, `wf5`.
4. Preserve binary files exactly.
5. Commit the imported snapshot on `wf1` only.
6. Run the verification commands below after import.

## Required verification

```bash
npm test
npm run check
npm run test:wf5-promotion
```

The combined WF5 acceptance gate is expected to remain blocked by the existing WF4 reviewer-evidence issue described in the checkpoint reports; WF1-specific gates are expected to remain green.

## WF1 scope preserved

The package includes all completed WF1 work through Run 26, including customer browsing; category → manufacturer/vendor → product navigation; product cards; pre-selection dependency/conflict/replacement explanations; related-product inspection and return continuity; selected-state navigation; revision navigation and dirty-state protection; build summary traceability; exact visual-state messaging; immutable save/share/quote handoff review; post-handoff receipts; shared-build parity; persisted BOM/customer/vehicle/mass/pricing/provenance parity; and revision-locked share access/recovery.

The immutable project → revision → share → quote backbone, Y62-first visual milestone, `REFERENCE_BACKED_APPROVED_VISUALS_ONLY`, exact production visual state handling, and `fallbackPolicy: none` are preserved.
