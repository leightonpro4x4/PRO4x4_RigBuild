# Push 28 — Alpha 26 Parallel Push 03

## WF1 — Customer Configurator / UX
- The selected-build rail now surfaces governed dependency chains and open fitment notes, not just a generic review counter.
- Customer-facing build summary remains tied to the same selection gate used before ADD.
- Mobile styling hooks were added for dependency/warning detail without changing the PRO4X4 visual direction.

## WF2 — Catalogue + Fitment Data
- Ranger catalogue expanded from 20 to 24 governed records using current official Offroad Animal manufacturer data.
- Corrected the previous placeholder Predator mapping to exact SKU `FB-FRA-NG-22-PR-ASM0` and current RRP $3,100.
- Added exact Toro (`FB-FRA-NG-22-TOR-ASM0`, $3,770), Scout roof rack (`RR-FRA-PU-22-SCT-ASM0`, $1,520), Rear Protection Bumper (`RB-FRA-NG-22-ASM0`, $1,940) and Rock Sliders (`RSW-FRA-NG-22-ASM0`, $1,895).
- Rear bumper remains staff-review gated because manufacturer fitment requires the factory tow bar and excludes Hayman Reese tow bars.
- Added a source-evidence register so these records retain manufacturer provenance rather than becoming unattributed catalogue rows.

## WF3 — Y62 Visual Production
- Ran the first actual `Y62-F34-V1` owner-photo isolation preflight against the locked 1672×615 canvas.
- Vehicle identity and canvas gates passed, but automated subject isolation retained background contamination and camera match remains unverified.
- The attempt was explicitly rejected before registry promotion and stored only as review evidence under `assets/rejected/`.
- This proves the governance flow is working: a visually plausible-but-unsafe candidate cannot become a master merely because a PNG exists.

## WF4 — Platform / Staff Tools
- Server/SQLite asset persistence now normalizes visual asset class/governance state on write/read.
- Staff render-asset listing can filter by `governanceState`.
- `production-ready` can no longer bypass `master-approved` / `layer-approved` / `production-live` governance state even if other binary fields are later present.
- Production render resolution therefore has a server-side visual-governance enforcement boundary, not only a browser/UI convention.

## WF5 — QA / Integration Gate
- Added Push 03 regression coverage for build-summary dependency detail, Ranger source-backed expansion, rejected F34 preflight handling, persisted governance filtering and production bypass prevention.
- Rejected preflight artwork is confirmed absent from the governed client registry.

## Next dependencies
- WF1: guided conflict-resolution actions and tighter mobile dependency presentation.
- WF2: next source-backed Ranger batch, concentrating on roof/touring/cargo rather than more protection duplicates.
- WF3: clean reference-backed `Y62-F34-V1` canonical reconstruction/render; automatic raw-photo cutout is not sufficient.
- WF4: surface persisted governance filter/reviewer history in staff UI.
- WF5: gate the next F34 canonical candidate through server persistence before any visual promotion.
