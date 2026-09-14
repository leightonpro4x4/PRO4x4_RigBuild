# Stage 3 — authoritative catalogue identities

Source: WF2 ebccc17ee9caf1b81834bf50a50319c7fcc21dbc (Push31). Four source files are imported byte-for-byte; the Stage 1 manifest pins their hashes. catalogue.json is a deterministic, lossless data envelope, not a replacement dependency engine.

Ranger: 73 accessories / 54 evidence records. Y62: 26 accessories / 15 evidence records. All 99 products have unique vehicle-scoped source identities; all 69 evidence records remain scoped to their vehicle. Variant context and original fitment conditions are retained. SKU alone is not an identity. Source dependency IDs are interpreted only within the owner vehicle; raw routes, alternatives and unresolved mappings are unchanged.

| Alpha 93 visual | Ranger WF2 source ID | Outcome / unresolved conflict |
|---|---|---|
| Predator | oa-predator | Identity match; installation price unknown; priced-only visual status is not production approval |
| Rally Hoop | oa-rally-hoop-7in-ranger | Identity match; WF2 also requires camera relocation; dedicated two-light conditions and unknown installation values retained |
| Butt Kicker pair | oa-butt-kicker-7-pair-ranger | Engineering/staff-review; alternative Predator/Toro routes, no universal Rally hard dependency; mounting/electrical/connector/weight/labour uncertainties retained |
| Scout | oa-scout-rack-ranger | Identity match; exact Next-Gen wind-deflector and 42-inch light-bar support mappings unresolved; install conditions and unknown labour retained |
| Powerboards PB-FD-005 | None | Explicit Alpha93-only gap; no WF2 product fabricated |
| Nice Tub Rack | oa-nice-tub-rack-ranger | Engineering; price null with A$1750/A$1300 conflicting evidence; tub/shutter mounting and installation unresolved |
| Rear bumper | oa-rear-protection-ranger | Engineering/staff-review; factory tow bar required; Hayman Reese incompatible; reverse-light mapping and labour unresolved |

alpha93-mapping.json provides full vehicle-scoped IDs and outcome classifications. A match is identity reconciliation only, never certification of exact vehicle trim, installation variant, fitment, rights or production visual eligibility. Full source records preserve all additional conditions and evidence, not merely the highlighted seven-product issues.

alpha93-fixture.json preserves exact product names, SKUs, seven prices and original requires arrays from the unchanged app. A$10,239 is a regression-only parts total; its A$1300 tub-rack amount never fills the normalized null price. No universal consolidated total or production quote is introduced.

Y62 has catalogue data but approvedProduction3DBase=false and approvedBaseAsset=null. WF3/WF4 review evidence is not promoted. The active public app, import map, asset bytes, local saved state and quote snapshots remain unchanged. There is no import of catalogue data from public/index.html.

Validation runs Stage 1/2 preservation and layout checks plus Stage 3 semantic-preservation/count/identity/conflict/fixture tests and JavaScript syntax checks. In this execution environment npm is absent from PATH; the exact Node commands in package.json are run directly. No later-stage business integration suite is claimed to have run.

Stop before Stage 4. Original main and six source branch SHAs must remain equal to consolidation/manifest.json locally and remotely.
