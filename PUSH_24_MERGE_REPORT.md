# PRO4X4 Rig Builder — Merged Push 02 / Alpha 24

## Master workflow re-check
- PRO4X4 dark digital-workshop customer direction remains locked.
- Y62 Warrior remains the first production visual/render proof vehicle.
- Next-Gen Ranger remains the catalogue/fitment proof vehicle inside the same application, not a competing branch.
- No approximate, reference-board, stage-image or synthetic stand-in may be served as a production vehicle layer.
- Alpha 23 state-aware Y62 visual readiness work is preserved in the merged branch.

## Advanced
1. Unified the merged Ranger/Y62 customer shell with the existing immutable project backend.
2. SAVE BUILD now creates a server/local-adapter project revision rather than a separate merged-shell localStorage record.
3. SAVE + REQUEST A QUOTE now saves the exact project revision first, then submits that same snapshot/reference to the shared staff sales queue.
4. Customer contact capture was added to the merged summary rail; quote submission requires name plus phone or email, while concept saving remains available without contact details.
5. Saved builds can generate the existing governed 30-day customer share link.
6. Existing project revisions can be opened directly in the merged configurator with `?project=...&revision=...`; saving creates a new immutable revision.
7. Project titles are now vehicle-neutral/generic in both browser-local and SQLite runtimes. Ranger projects no longer get hard-coded Y62 titles.
8. Added `merged-project-contract.js` as the shared normalisation boundary for Ranger/Y62 selections, pricing requirements, gates, weight, project titles and quote payloads.
9. Ranger recovered records use their known parts + install components without inventing Y62 freight/paint/engineering requirements. Engineering-status products remain fitment-gated.
10. The merged Y62 stage now queries the existing exact render resolver and reports available/missing/blocked counts; it still displays no unapproved vehicle image.
11. Brought the Alpha 23 Y62 readiness matrix into the merged package: 15 explicit core visual-state slots, governed slot creation and staff readiness/telemetry view remain available.

## Verified
- Full Alpha 12 → Alpha 24 regression chain passes, including Alpha 23 render readiness and the original merged Alpha 23 test.
- Pure merged contract test confirms Ranger + Y62 snapshot normalisation, no render fallback and vehicle-neutral project titles.
- SQLite integration test confirms a Ranger build saves as an immutable project, enters the quote queue with the same project lineage and retains `needs-fitment-review` where appropriate.
- Y62 project save retains `fallbackPolicy: none`.
- Production Y62 seed remains at zero genuine production-ready visual layers.

## Next dependency
Highest-value customer-app dependency: finish the Ranger catalogue/fitment merge beyond the 20 currently recoverable records and expose richer dependency/conflict feedback in the merged product UI using the shared backend contract.

Highest-value visual dependency remains unchanged: a genuine rights-cleared 1672 × 615 transparent Black Obsidian Y62 Warrior base for `Y62-F34-V1`, followed by the genuine factory Warrior wheel/tyre layer.
