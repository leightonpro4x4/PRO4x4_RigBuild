# Alpha94 visual governance

Stage 7 reconciles frozen WF3 evidence with the WF4 lifecycle. It creates no production approval.

`baseline.json` contains nine original owner reference approvals/attestations, three canonical masters and nine actual WF3 candidate binaries. Candidate keys encode vehicle, source-derived variant, view and version. F34 Candidate 05 boards are evidence, not a candidate binary. Every source file is pinned to its frozen archive; images, masks, processing scripts and historical evidence remain outside web serving.

Raw WF4 records are **clean-sync source-policy replay**, not a recovered historical database. They were exported by running frozen WF4 `RigDatabase.syncVisualGovernanceRegistry` in a temporary in-memory database. Original owner-source approval identity/time and reference-review legacy-migration classifications are retained. Generated dossier/audit timestamps from replay are not new human review evidence. `tools/reconcile-governance.mjs <export.json>` verifies source bytes, normalizes WF3 history and copies exact WF4 validators. `tools/governance-projection.mjs` produces the safe customer policy. Neither promotes a visual.

| Transition | Required authority and binding |
|---|---|
| Register reference | Configured curator; actual source bytes/hash and scoped rights |
| Approve reference | Reference reviewer; exact current source hash |
| Register master | Approved references for exact vehicle/variant; explicit view/check contract |
| Accept new master contract | Reference reviewer; evidence hash and master/view binding |
| Stage candidate | Processor; scoped version identity, exact master/references, binary checksum and render tuple |
| Evidence / production rights | Processor / separate rights reviewer; exact candidate and evidence document hashes |
| Canonical claim | Reviewer; all source/camera/reconstruction/rights gates and current fingerprint |
| Reviewer decision | Same claimant; exact current claim checksum; immutable decision |
| Production seal | Sealer; current approved decision, binary/evidence fingerprint and audit head |
| Production visual | Publisher; current seal; unique vehicle/variant/view/layer/SKU/render-state tuple |

New candidate versions discard caller approval fields. Production versions remain immutable; binary/source/contract drift invalidates resolution. Blocked tuples override approvals. Missing or state-mismatched assets have no fallback. R34/SIDE cannot promote before valid F34 production of the same vehicle/variant.

The internal service uses append-only hash-linked `governance_events` **in the existing `.runtime/alpha94.sqlite` database**, with transactions, writer-concurrency checks and immutable-event triggers. Replay rejects tampering and baseline drift requires explicit migration. Actor IDs resolve through server-configured grants; passing a role field grants nothing. Default grants are empty. No customer-accessible governance write API, staff login or new credentials are introduced; quote finalisers do not gain visual-review authority.

The browser receives only `visual-eligibility/governance-policy.mjs`: checkpoint asset hashes and safe blocked/unavailable statuses, never reference images, candidate binaries, rights documents, reviewer identities or registries. Startup verifies this projection. Future approved production requires explicit runtime/projection integration rather than silently replacing a 3D runtime with an image. The complete positive lifecycle is tested using isolated synthetic QA evidence only.

Ranger's ten assets remain renderable **preview** checkpoints. Caller `trustedApprovals` no longer confers authority. Y62 governance is **blocked**, its 3D base is **unavailable**, and no image becomes a fallback. Stage 6 fingerprints the policy; old saved revisions require existing explicit revalidation and are never rewritten.
