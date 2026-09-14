## WF4 Push 55 — persisted canonical reference coverage registry

WF4 now persists a per-view `canonicalReferenceCoverage` snapshot on each governed Y62 F34/SIDE/R34 canonical master. The snapshot SHA-256 binds the exact owner-reference IDs declared for that view to the active `Y62-OWNER-REFERENCE-PACK-V1` manifest, registered source checksums, pack membership, source/rights attestation freshness, evidence-review approval and any explicit source gap. It is `reference-coverage-evidence-only`, `productionEligible: false`, and generic staff edits cannot rewrite it.

Clean state is deliberately conservative: F34 is **3/3 complete**, R34 is **2/2 complete**, and SIDE is **3/3 evidence-complete but `blocked-source-gap`** because the declared clean square-on side geometry source is still missing. Production Readiness consumes the persisted coverage state, while Render Assets and the vehicle-level master-set registry expose the same evidence to staff. Reference/checksum drift makes coverage stale; governance sync refreshes it into an explicit evidence blocker rather than silently accepting changed source material. `REFERENCE_BACKED_APPROVED_VISUALS_ONLY` remains authoritative and this package promotes no visual.

## WF4 Push 17 — persisted layer approval + composite eligibility controls

WF4 now persists an exact composite-eligibility contract on every governed non-base Y62 visual layer using the existing render-asset registry. Each binding records the vehicle, canonical view, exact SKU/state, target F34/SIDE/R34 canonical master, required master/layer governance states, exact-match requirement and `fallbackPolicy: none`. The shared hosted resolver now fails closed when an accessory/state layer is requested without an approved production base, when its persisted binding is stale/tampered, or when either side of the governed composite is not production-ready. Filename/binary presence alone cannot make a preview eligible.

Render Assets exposes the persisted composite binding and current canonical-master governance state directly to staff. Governance sync may repair static binding metadata but cannot change approval state, binaries, reviewer evidence or production lineage. The current Y62 registry has **19 persisted composite bindings** and **0 production-eligible visuals**. `assets/`, `references/` and the checked customer entrypoints remain byte-identical to Push 16, so **REFERENCE_BACKED_APPROVED_VISUALS_ONLY** remains authoritative and no fake completeness was introduced.

The next dependency is still a genuinely clean `Y62-F34-V1` WF3 candidate. After F34 is approved and promoted through the existing reviewer/audit path, the first exact accessory layer can exercise the real master + layer composite path end-to-end.

## WF4 Push 16 — persisted canonical reviewer queue / assignment controls

WF4 now persists reviewer-assignment state on every governed Y62 canonical master, using the same render-asset registry, owner reference-pack metadata, WF3 candidate handoff and reviewer dossier already in the shared runtime. The assignment is SHA-256 bound to the exact canonical contract, backing reference snapshots and candidate handoff. Fitment/admin staff can refresh the queue, claim an eligible canonical review, or release that claim; Sales remains inspection-only. A changed reference checksum, pack binding, candidate checksum, upstream decision or handoff fingerprint makes the saved assignment basis stale, and an explicit refresh invalidates the old reviewer claim rather than silently carrying it onto different evidence.

The workflow has `authority: review-assignment-only` and `productionEligible: false`. Claiming a review cannot approve a master, stage a version, replace a binary or move a production pointer. Canonical production promotion additionally requires the acting reviewer to match the persisted assignment and the promoted binary checksum to match the candidate checksum bound at claim time. The current F34 remains `blocked-upstream`; SIDE and R34 remain `awaiting-wf3-candidate`, so no live Y62 visual is claimable or promoted by this package. **REFERENCE_BACKED_APPROVED_VISUALS_ONLY** remains authoritative.

## WF4 Push 12 — persisted canonical readiness assessments

The staff Production Readiness lane can now persist a governed point-in-time assessment on each Y62 canonical master. Each assessment records the current blocker set, backing owner-reference snapshots, immutable candidate/production version summary, identified assessor and a SHA-256 fingerprint of the exact governance evidence basis. The readiness screen compares that persisted basis against current reference/master/version state and shows CURRENT, STALE, INVALID or NOT ASSESSED instead of allowing an old green decision to look current after evidence changes.

The assessment is deliberately non-promotional: it cannot change registry status, reviewer state, binaries or production eligibility. **REFERENCE_BACKED_APPROVED_VISUALS_ONLY** remains authoritative. The next WF4 dependency is still the first clean WF3 `Y62-F34-V1` candidate so the real owner-reference → overlay review → approval → immutable production → quote inspection chain can be exercised end-to-end.

## WF4 Push 11 — persisted canonical review evidence

The Y62 canonical-master reviewer workflow now persists the locked review contract rather than relying on a generic `master-approved` flag. `Y62-F34-V1` stores the eight `Y62-F34-V1-OVERLAY-01` checks, candidate checksum, identified reviewer/time and immutable checksum snapshots of the three required owner-reference records. Both direct production upsert and version promotion fail closed if this evidence is incomplete or if backing reference evidence changes after review. Staff Render Assets and Production Readiness expose the contract, per-check state, reference snapshots and open blockers.

No customer visual is promoted by this package. Owner and external source imagery remains reference-only, and **REFERENCE_BACKED_APPROVED_VISUALS_ONLY** remains the production rule. The next WF4 dependency is the first clean WF3 `Y62-F34-V1` candidate so this persisted path can be exercised with real review evidence.

WF4 now persists the canonical-view contract itself alongside the existing visual-governance records. The F34, SIDE and R34 master slots carry their versioned brief ID, canvas/framing/camera/tolerances, backing owner-reference IDs, source-pack gaps, priority and review-contract linkage. The registry sync backfills this static metadata onto existing master/reference records without overwriting staged candidate, reviewer, approval or production state.

The staff Production Readiness screen now includes a Canonical View Registry. It exposes each master’s owner/reference pack coverage, primary/support evidence roles, rights state, camera-match state, staged/production version counts, source gaps, review contract and exact production blockers before the state-level readiness matrix. Reference records remain explicitly non-production.


## WF4 Push 50 — persisted canonical reviewer decision / approval envelope

WF4 now persists the reviewer verdict itself instead of allowing canonical approval to rely only on editable check fields plus an assignment. `canonicalReviewDecision` is SHA-256 bound to the exact canonical master/contract, current owner-reference snapshots and provenance attestations, WF3 candidate handoff/checksum, and the current identified reviewer assignment. The assigned fitment/admin reviewer can explicitly record either `APPROVED` or `RETURNED`; sales remains inspection-only.

The decision is deliberately **decision-only** and `productionEligible: false`. Generic render-asset editing cannot rewrite it. Evidence drift makes it stale, and canonical direct-upsert/version promotion now fails closed unless the decision is current, `approved`, belongs to the assigned reviewer and matches the candidate/binary checksum. Render Assets and Production Readiness show the persisted decision, freshness, reviewer, candidate checksum and decision/evidence fingerprints. The live governed Y62 bootstrap remains unchanged: all three canonical views have **unrecorded** decisions because no real reviewable WF3 candidate has reached the claim/decision lane, and there are still **0 production-eligible visuals**.

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

### Alpha 26 WF4 canonical candidate handoff
WF4 now persists the latest WF3 canonical-candidate handoff on each governed Y62 canonical master. Staff can inspect candidate checksum, upstream review decision, reference-pack binding and blockers in Render Assets and Production Readiness. Handoff metadata is non-production by policy and cannot implicitly stage or promote a render asset. Customer entrypoints remain isolated from WF3 candidate/reference modules.

## WF4 Push 15 — canonical reviewer governance dossier
WF4 now persists an inspection-only governance dossier on each governed Y62 canonical master. The dossier fingerprints the exact canonical-view contract, owner reference-pack membership/checksums, WF3 candidate handoff, current canonical review state, persisted readiness assessment and production blockers into one SHA-256-addressed reviewer packet. F34 therefore exposes the returned `Y62-F34-V1-CANDIDATE-02` and its eight-check review contract in the same evidence surface as the three required owner references; SIDE and R34 remain explicitly awaiting WF3 candidates, with the SIDE source gap retained.

The dossier is deliberately **not an approval token**. It cannot change `master-draft`, stage an immutable version, replace a binary, grant production rights or move a production pointer. If backing evidence changes, the persisted dossier becomes `STALE` and normal governance sync leaves that staleness visible until fitment/admin staff explicitly refresh the reviewer packet. `REFERENCE_BACKED_APPROVED_VISUALS_ONLY` remains authoritative and no visual is promoted by this package.

## WF4 Push 18 — persisted reference provenance attestation + evidence freshness

WF4 now persists a SHA-256-addressed source/rights attestation on every governed owner reference in the existing render-asset registry. Each attestation binds the reference identity, source path/type, file checksum, rights/licence state, reference-pack membership and canonical-view use while remaining explicitly `reference-evidence-only` and `productionEligible: false`. The active `Y62-OWNER-REFERENCE-PACK-V1` retains its existing manifest SHA-256 and now reports all 9 declared owner sources as currently source/rights-attested.

Evidence drift is fail-closed. Changing a backing source checksum, source type, rights note/status or pack binding makes the saved attestation stale. Routine governance sync does not silently replace a stale attestation; authorised staff must explicitly re-attest the current source + rights through the same shared render-asset upsert path. A stale required reference blocks the owner reference pack and canonical review, and propagates into readiness/dossier freshness. No new persistence store or production bypass was introduced, and **REFERENCE_BACKED_APPROVED_VISUALS_ONLY** remains authoritative.


## WF4 Push 23 — immutable canonical production evidence seal

WF4 now seals the complete approval-to-production evidence chain at the moment a governed canonical master actually becomes production. The SHA-256-addressed seal binds the exact production binary and vault identity to the canonical-view contract, owner reference pack and exact reference/provenance-attestation snapshots, WF3 candidate handoff, identified reviewer assignment, persisted APPROVED review decision, eight-check canonical review evidence, immutable version/direct-promotion lineage, and the tamper-evident audit-chain head immediately before promotion. The seal is evidence-only (`authority: immutable-production-evidence-only`, `productionEligible: false`): it cannot manufacture approval or make a draft visual eligible.

Render Assets and Production Readiness expose the persisted seal and distinguish **SEALED · CURRENT**, **SEALED · CURRENT EVIDENCE DRIFT**, **INVALID SEAL**, and **NOT SEALED**. Later source/reference drift does not rewrite or invalidate the historical production record; the original seal remains cryptographically verifiable while comparison against current evidence reports the drift. New canonical production transitions fail closed if the complete seal cannot be built. Historical production evidence is not silently backfilled. The live Y62 bootstrap remains at **0 production-eligible visuals**, so this package changes governance controls only and promotes no real artwork. `REFERENCE_BACKED_APPROVED_VISUALS_ONLY` remains authoritative.


## WF4 Push 26 — persisted canonical view-contract registry

WF4 now persists `canonicalViewContract` on every governed canonical master using the existing `render_assets.payload_json` backbone. The SHA-256-addressed evidence binds the source canonical brief, persisted canonical-view fields, the governed Y62 camera profile/output canvas and the owner-reference pack identity. It is explicitly `view-contract-evidence-only`, `productionEligible: false`, and protected by the existing governance write boundary.

F34 currently resolves as `locked` because the approved canonical brief and locked `Y62-F34-V1` camera profile agree on the 1672×615 output contract. SIDE and R34 remain `calibration`; their current contracts are valid/current evidence but are intentionally production-blocking until WF3 locks their camera/view geometry. Render Assets and Production Readiness expose contract state, freshness and SHA evidence while the master-set truth index reports cross-view lock state. `REFERENCE_BACKED_APPROVED_VISUALS_ONLY` remains authoritative and no contract record can itself approve or promote artwork.


## WF4 Push 57 — persisted canonical reviewer claim integrity / concurrency guard

WF4 now makes a reviewer claim a first-class, SHA-256-addressed governance object inside the existing `reviewWorkflow.assignment`. The claim binds the exact canonical master/brief, current workflow evidence basis, WF3 candidate checksum and reviewer identity/time. Its authority is `review-claim-only`, `productionEligible: false`; claiming work cannot approve a master, create/stage a version or move production lineage.

Same-reviewer claim retries are idempotent. Release carries the exact currently displayed `claimSha256`, and a stale release receives `409 review_claim_conflict` instead of clearing a newer/current reviewer assignment. Evidence/schema/claim drift is fail-closed: governance refresh invalidates the old claim rather than carrying it onto changed evidence. Canonical review decisions and immutable production seals now bind the exact claim ID/SHA/evidence binding, while Render Assets and Production Readiness expose claim integrity and fingerprints to staff. The governed Y62 bootstrap remains at **0 active reviewer claims and 0 production-eligible visuals**, preserving **REFERENCE_BACKED_APPROVED_VISUALS_ONLY**.
