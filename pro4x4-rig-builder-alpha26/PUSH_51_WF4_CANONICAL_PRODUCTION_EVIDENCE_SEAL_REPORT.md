# Push 51 — WF4 Immutable Canonical Production Evidence Seal

## Package advanced

**A26-WF4-23 — Immutable Canonical Production Evidence Seal / Approval-to-Production Lineage**

This push advances one WF4 package only. It closes the production/audit evidence gap between a current reviewer approval and the immutable canonical binary that actually becomes production. It does not create or promote a real Y62 visual.

Policy remains **REFERENCE_BACKED_APPROVED_VISUALS_ONLY** and the application continues to use one shared render-asset/runtime backbone.

## Concrete delivery

A new shared `canonical-production-seal.js` governance module creates a deterministic SHA-256 evidence seal only when a governed canonical master passes a real production transition. Both supported transition lanes use the same module:

- immutable candidate-version promotion;
- governed direct production upsert.

The seal has `authority: immutable-production-evidence-only` and `productionEligible: false`. It is evidence, not an approval token.

The sealed basis binds:

- exact canonical master / canonical-view / review-contract identity;
- exact production binary SHA-256, dimensions, alpha state and governed vault identity;
- source type and cleared rights state;
- locked camera match;
- `Y62-OWNER-REFERENCE-PACK-V1`, its exact manifest SHA-256 and exact required owner-reference snapshots;
- each required reference's checksum, governance state and current provenance-attestation basis;
- exact WF3 candidate handoff and candidate checksum;
- reviewer workflow / identified assignment;
- persisted APPROVED reviewer decision and decision fingerprint;
- persisted canonical-review evidence and locked review-check result basis;
- version/direct-promotion lineage;
- tamper-evident audit-ledger state and chain head immediately before promotion;
- identified sealing actor and time.

A production transition now fails closed with `canonical_production_seal_blocked` if that evidence cannot be sealed. Existing historical production evidence is not silently backfilled or fabricated.

## Staff visibility

Render Assets now exposes **CANONICAL PRODUCTION EVIDENCE SEAL** for governed canonical masters, including seal state, pack, WF3 candidate, reviewer decision, binary, audit head, seal/basis fingerprints and evidence drift.

Production Readiness exposes the same state in the canonical registry:

- `SEALED CURRENT`;
- `SEALED WITH DRIFT` when the historical seal remains valid but present-day source/governance evidence differs;
- `INVALID` for seal fingerprint/integrity failure;
- `UNSEALED` before a real production transition.

Later owner-reference or provenance changes do not rewrite historical production evidence. The sealed record remains internally verifiable while comparison against current evidence surfaces the drift.

## Runtime / backend scope

No second runtime, database, registry or approval path was introduced. The only backend changes are in the active canonical production lanes so they can build and persist the seal immediately before production. Browser-local staff parity uses the same module and existing asset/audit stores.

No customer-facing entrypoint loads the new governance module.

## Governed Y62 state after this push

The real bootstrap state remains deliberately unchanged:

- 9 owner references;
- 9/9 current source/rights provenance attestations;
- 3 governed F34/SIDE/R34 canonical masters;
- owner pack `Y62-OWNER-REFERENCE-PACK-V1`;
- manifest SHA-256 `260a875ef1a787d477178faaa21e897a225a8113fa6d02cab73840e012fe0342`;
- F34 remains `Y62-F34-V1-CANDIDATE-02` / `blocked-upstream`;
- SIDE and R34 remain `awaiting-wf3-candidate`;
- SIDE required source-geometry gap remains explicit;
- 3/3 real canonical reviewer decisions remain unrecorded;
- 0 real canonical production seals exist because no real canonical has passed production;
- 0 production-eligible Y62 visuals.

The production-seal regression uses synthetic in-memory candidate binaries only; it does not touch project artwork.

## Verification

- `npm run test:wf4-production-seal` — **PASS**
  - version promotion creates the seal;
  - direct production creates the same governed seal;
  - owner reference pack / exact provenance attestations are bound;
  - WF3 candidate, reviewer assignment, APPROVED decision and canonical review evidence are bound;
  - binary checksum and pre-promotion audit-chain head are bound;
  - generic seal tampering is rejected by the governance write boundary;
  - historical seal stays cryptographically valid after later evidence drift;
  - current-evidence drift remains visible;
  - the seal itself cannot grant production eligibility.
- Complete Alpha regression chain (`npm test`) — **PASS**.
- `npm run check` — **PASS**.
- WF5 governed promotion lifecycle — **PASS**.
- WF5 acceptance — remains **RED only for the pre-existing WF1 `WF1-BOM-ANYOF` defect**. `WF4-DIRECT-PRODUCTION-REVIEW` and customer draft/reference isolation remain PASS.
- Static syntax / reference verification — **PASS**; see validation manifest for final counts.
- `assets/` + `references/` — **16/16 byte-for-byte unchanged** from Push 50.
- 11 customer-critical runtime/data/render-contract files — **11/11 byte-for-byte unchanged** from Push 50.

## Next dependency

The next primary WF4 dependency remains **A26-WF4-14B / WF3**: supply the first genuinely clean, reviewable `Y62-F34-V1` candidate with clean reconstruction/isolation, locked overlay + camera acceptance, production-binary rights provenance and identified reviewer evidence.

That will let the real chain run end-to-end:

**attested owner references → WF3 candidate handoff → reviewer claim → APPROVED decision → canonical review evidence → immutable production evidence seal → approved composite eligibility → sealed project/quote inspection**.
