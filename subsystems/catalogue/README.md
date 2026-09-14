# catalogue

Stage 3 imports the exact four authoritative WF2 source files from commit ebccc17ee9caf1b81834bf50a50319c7fcc21dbc into source-wf2/. SHA-256 hashes are pinned by consolidation/manifest.json. They are inert source inputs, not customer scripts.

catalogue.json preserves every source vehicle, accessory and evidence field. Product keys use vehicle ID plus source product ID; variant context includes the source trim, series, body, drivetrain and years. SKU is metadata, never a global primary key. Product-local dependency/fitment IDs remain scoped to their owning vehicle and are preserved verbatim, including any-of and route-specific structures. No dependency evaluation or enforcement is introduced.

Regenerate deterministically with node subsystems/catalogue/normalize.mjs. Run node acceptance/tests/catalogue.mjs to verify counts, full semantic preservation, source byte hashes, vehicle-aware identities and mapping conflicts.

alpha93-mapping.json records six catalogue identity matches and one explicit Powerboards mapping gap. Identity matching is not fitment/price/visual approval. alpha93-fixture.json preserves the exact seven-product A$10,239 checkpoint independently of catalogue pricing. It is not a consolidated quote total. In particular, the fixture's A$1,300 tub rack does not fill WF2's null price.

Y62 catalogue availability never implies an approved production 3D base. No catalogue code or data is imported by public/index.html, no GLB changes, no WF dependency engine integration, and no production quote service. Stage 4 remains deferred.
