# PRO4X4 Rig Builder — Merged Push 01 / Alpha 23

## Merge decision
Alpha 22 remains the platform/core. The 4WD Configurator Availability branch becomes the customer-facing catalogue/fitment experience.

## Advanced
- Replaced the default customer entry point with a merged two-vehicle configurator.
- Added Next-Gen Ranger as the catalogue/fitment proof vehicle beside the Y62 visual/render proof vehicle.
- Imported the 20 Ranger products visible in the latest saved configurator snapshot, including MCC bullbars, recovery points, bash plate, side steps/rails, rear bars and carrier packages plus the Offroad Animal Predator bar.
- Added live add/remove, undo/redo, parts/fitted estimate, known added weight, fitment review count and automatic supporting-part addition.
- Added exclusive product groups so mutually exclusive front bars, side-step packages and rear-bar choices replace one another instead of stacking.
- Preserved the complete Alpha 22 Y62 configurator as `y62-alpha22.html`; no render governance or backend files were removed.
- Kept the merged visual stage honest: Ranger and Y62 show production-visual-pending rather than using stage/reference imagery as production layers.

## Source reconciliation note
The latest File Library snapshot of the other configurator explicitly displays `STEP 02 · 20 PRODUCTS`. Earlier conversational summaries referred to 26 records, but only 20 product records are recoverable from the saved snapshot available to this merge. Alpha 23 imports the 20 recoverable records and does not invent six missing records.

## Verified
- `data-ranger.js` and `merged-app.js` pass Node syntax checks.
- `tests/merged-alpha23.js` passes.
- Ranger data contains exactly 20 recovered products.
- Rear carrier-arm dependency on the carrier-ready 022-02 base is enforced.
- Y62 Alpha 22 customer/engineering page and its render-contract scripts remain present.
- Existing Alpha 22 backend, staff, project, quote, audit, asset-vault and deployment files remain in the package.

## Next dependency
1. Wire the merged multi-vehicle customer shell into the Alpha 22 immutable project + staff quote backend (currently the merged shell saves locally while the preserved Y62 page retains the full server-backed flow).
2. Reconcile any additional Ranger records from the other branch only when a recoverable source is available.
3. Expand Ranger categories beyond Protection as source-backed products are mapped.
4. Resume genuine Y62 production visual acquisition; no fake layers.
