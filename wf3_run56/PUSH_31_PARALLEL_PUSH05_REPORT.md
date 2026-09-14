# PRO4X4 Rig Builder — Alpha 26 Parallel Push 05

## WF1 — Customer Configurator / UX
- Added guided compatibility-resolution actions directly on blocked product cards.
- Conflicting selected products can now be removed from the blocked card; products with an any-of supporting requirement can offer valid supporting products to add.
- Added narrow-screen card/action polish without changing the PRO4X4 visual direction.

## WF2 — Catalogue + Fitment Data
- Ranger governed catalogue expanded 26 → 28 records using current manufacturer evidence.
- Added Offroad Animal Lower Bash / Skid Plate (BP-FRA-NG-22-ASM0): AUD 420, 5 kg; requires either the verified Predator or Toro Offroad Animal bar route and excludes factory bumper/stone guard.
- Added Next Gen Camera Relocation Kit (FB-FRA-NG-22-PR-ASM5): AUD 165, 1 kg; confirmed Next Gen Ranger/Raptor/Everest application with conditional use when hoops/lights obstruct the camera.
- Added `anyOfRequiredParts` support so mutually valid dependency choices are represented without pretending all alternatives are required.

## WF3 — Y62 Visual Production
- Added the measurable `Y62-F34-V1-OVERLAY-01` review contract for the first canonical master candidate.
- Locked reference IDs, 1672×615 canvas, silhouette/wheel/roof/bumper tolerances, transparency/edge-quality rules and explicit no-invented-accessory gate.
- No draft/reference imagery was promoted; customer exposure remains prohibited until full production approval.

## WF4 — Platform / Staff Tools
- Promotion now requires immutable reviewer identity + review timestamp before an asset version can become production-ready.
- Promoted versions persist `approval.reviewEvidence` containing governance state, reviewer, review time, camera-match result, licence state, checksum and immutable version ID.
- Promotion audit records now carry the same review evidence.

## WF5 — QA / Integration Gate
- Added Push 05 regression tests for 28-product Ranger state, any-of dependency guidance, customer guided-resolution controls, Y62 overlay contract and immutable reviewer evidence.
- Full Alpha regression chain remains the promotion gate.

## Next dependencies
- WF1: add guided handling for conditional fitment notes (factory tow bar / mounting-route questions) without turning them into false certainty.
- WF2: continue source-backed Ranger touring/cargo expansion and encode mutually exclusive mounting systems where manufacturer data supports it.
- WF3: create/stage the first transparent reference-backed F34 master candidate and score it against the new overlay contract.
- WF4: expose immutable reviewer evidence/version history clearly in the staff registry UI.
- WF5: execute full staged-candidate review → master-approved → immutable promotion → resolver-visible test path, including rejection when reviewer evidence is absent.
