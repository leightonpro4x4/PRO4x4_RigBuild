# PRO4X4 Rig Builder — Merged Alpha 26 Working Checkpoint

WF4 now persists the Y62 visual-governance model into the hosted registry instead of leaving owner references and canonical-master slots only in browser/local planning state. Opening the staff Render Assets screen performs an idempotent registry sync: the nine owner-supplied Series 5 Y62 Warrior reference records and three F34/SIDE/R34 canonical-master slots are stored alongside the existing render registry, while all legacy records are normalised with an explicit asset class and governance state. Raw owner references remain non-production and are delivered only through the authenticated staff route in hosted mode; `/references/...` is blocked from the public static handler.

The staff registry can now filter by asset class and governance state, preview governed reference evidence, and jump from each canonical master to its backing reference IDs. The three canonical slots remain `master-draft` with no binary/checksum, so **REFERENCE_BACKED_APPROVED_VISUALS_ONLY** is preserved and no fake completeness is introduced.

The next WF4 dependency is the first real WF3 `Y62-F34-V1` master candidate. Once that exists, WF4 can bind immutable candidate-version promotion to explicit `master-approved` / `layer-approved` reviewer transitions and audit evidence.


Merged Alpha 25 adds the governed parallel delivery model used to increase throughput without splitting the product into competing branches. WF1 Customer Configurator/UX, WF2 Catalogue + Fitment, WF3 Y62 Visual Production and WF4 Platform/Staff Tools may advance independently; WF5 QA / Integration is the sole promotion gate into the single merged Alpha. The Y62 source-asset dependency is isolated to WF3 so it cannot stall catalogue, UX or staff-tool delivery.

See `PARALLEL_WORKSTREAMS.md` and the staff `workstreams.html` control screen. Automated push schedules are not required by this architecture and are not restarted by this release.

Alpha 22 keeps the Nissan Patrol Y62 Warrior as the production proof vehicle and preserves the strict **no-fake-render-layer** rule. The PRO4X4 dark technical/workshop interface direction is unchanged.

This release makes render identity state-aware. Paint and wheel/tyre choices are now part of the server-authoritative production-layer request. A Black Obsidian base cannot satisfy Gun Metallic, Moonstone White or Brilliant Silver, and the factory Warrior wheel state cannot be substituted by another wheel package. All four validated MY25 paint choices can be selected in the configurator, but a paint without an exact approved production base resolves explicitly as `missing` rather than borrowing Black Obsidian artwork.

Approved binary delivery now has bounded reliability handling: up to three attempts, an 8-second timeout per attempt, and telemetry for resolve/load success, retry, failure and stack readiness. Retries always use the same checksum-pinned approved binary; they never switch SKU, render state, candidate asset, reference art or stage image. Customer revisions preserve the exact paint/wheel state and delivery status.

The staff Production Stack Preview now uses the same exact state-bound resolver and load policy as the customer configurator, and can inspect recent render telemetry. SQLite migration **6** adds `render_telemetry`. Existing Alpha 21 databases are safely enriched with the known Black Obsidian/factory-Warrior render-state metadata at startup without changing any asset approval state.

The Y62 production seed still contains **0 production-ready layers**. Synthetic transparent PNGs remain automated test fixtures only.

## Verify
```bash
npm test
npm run test:render-resolver
```

See `WORKFLOW.md`, `PUSH_21_REPORT.md`, `API_CONTRACT.md` and `PRODUCTION_CHECKLIST.md`.
