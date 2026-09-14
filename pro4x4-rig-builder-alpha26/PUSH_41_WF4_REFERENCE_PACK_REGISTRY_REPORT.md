# PUSH 41 — WF4 Persisted Owner Reference-Pack Registry

**Package:** A26-WF4-13  
**Lane:** WF4 — Platform / Staff Tools only  
**Schema:** 0.26.13  
**Policy:** `REFERENCE_BACKED_APPROVED_VISUALS_ONLY`

## Why this package was next

The real F34 production exercise remains dependent on WF3 supplying a genuinely clean reviewable `Y62-F34-V1` candidate. The highest-priority unblocked WF4 prerequisite was therefore to make the owner reference pack itself a persisted, checksum-addressed governance object and make that pack visible to staff and canonical-master review/readiness flows. This removes an otherwise implicit provenance dependency before any production promotion can occur.

## Concrete progress

### 1. Persisted owner reference-pack manifest

Added shared `reference-pack-governance.js` and upgraded the Y62 reference pack to schema `0.26.13`.

The active persisted pack is:

- Pack ID: `Y62-OWNER-REFERENCE-PACK-V1`
- Manifest SHA-256: `260a875ef1a787d477178faaa21e897a225a8113fa6d02cab73840e012fe0342`
- Declared owner references: **9**
- Primary authenticity references: **4**
- Support references: **5**
- Declared evidence gaps: **1**
- Canonical masters bound: **3**

The manifest deterministically covers vehicle identity, usage basis, declared reference IDs/files, source type, rights state, dimensions, source SHA-256, canonical-view bindings and known source gaps.

### 2. Persisted reference membership + canonical-master bindings

The existing shared visual registry now persists the manifest identity on all nine owner-reference records. Each record carries its pack ID, manifest checksum, declared position, primary/support role, canonical-view consumption and an explicit non-production lock.

The three existing canonical masters persist the same pack identity and the exact evidence subset required by their canonical contract:

- `Y62-F34-V1` → `OWNER-Y62-F34-01`, `OWNER-Y62-F34-02`, `OWNER-Y62-FRONT-01`
- `Y62-SIDE-V1` → `OWNER-Y62-DESIGNBOARD-01`, `OWNER-Y62-F34-01`, `OWNER-Y62-REAR34-01`
- `Y62-R34-V1` → `OWNER-Y62-REAR34-01`, `OWNER-Y62-REAR-01`

Governance sync repairs stale/missing static pack bindings without changing candidate binaries, canonical review work, approvals, production state or immutable version history.

### 3. Pack-level integrity gate

The new shared pack assessment detects:

- missing declared reference records;
- checksum mismatch against the owner pack;
- rights/source mismatch;
- reference records that leave `reference-only` / non-production state;
- references that are no longer `reference-approved`;
- stale manifest bindings;
- undeclared records claiming pack membership.

The current pack integrity result is **COMPLETE: 9/9 registered and approved**. This means the declared pack itself is intact; it does **not** clear canonical render readiness.

The existing required SIDE source gap remains explicitly persisted:

> No clean square-on raw side-profile owner photo exists in the current owner pack.

That gap remains a canonical-render blocker/reviewer condition rather than being inferred away.

### 4. Canonical review evidence now binds to pack identity

Where a canonical master carries a reference-pack binding, the locked canonical review gate now requires every mandatory reference to carry the same pack ID and manifest SHA-256.

Persisted canonical review evidence snapshots both the pack manifest and the per-reference pack identity. A later checksum or pack-manifest change invalidates that evidence instead of allowing a previously approved decision to float onto different source material.

### 5. Persisted render-readiness fingerprints include reference-pack state

Render-readiness fingerprints now include:

- canonical master pack ID and manifest SHA-256;
- required reference IDs;
- each backing reference's pack ID and manifest SHA-256.

Changing the pack binding therefore makes an older readiness assessment visibly stale and forces reassessment.

### 6. Staff visibility

The existing **Production Readiness** screen now includes a dedicated **REFERENCE PACK REGISTRY** showing:

- pack ID and vehicle identity;
- deterministic manifest SHA-256;
- declared / registered / approved evidence counts;
- primary vs support evidence counts;
- known source gaps;
- every pack member with source, rights and checksum state;
- direct links to the existing Render Assets record;
- explicit integrity blockers and usage basis.

The existing Render Assets view now also shows pack ID/manifest evidence on owner references and pack requirements on canonical masters.

This stays on the same shared registry/database/runtime backbone; no parallel evidence store was introduced.

## Visual/customer safety

`REFERENCE_BACKED_APPROVED_VISUALS_ONLY` is unchanged.

- **No Y62 visual was promoted.**
- No reference asset became production-eligible.
- No canonical master changed from its governed draft/blocked state as a result of this package.
- The complete `assets/` tree is byte-for-byte identical to Push 12.
- The complete `references/` tree is byte-for-byte identical to Push 12.
- Checked customer runtime/UX files (`index.html`, `merged-app.js`, `styles.css`, Y62/Ranger data, render manifest/contract, quote/share/projects surfaces) are byte-for-byte identical to Push 12.

Only WF4 staff/governance/runtime files, tests and documentation changed.

## Verification

### Full regression

`npm test` — **PASS** across the complete Alpha 12 → Alpha 26 chain, including the new `wf4-reference-pack-registry-alpha26` regression.

The new regression proves:

- deterministic pack manifest;
- all 9 reference memberships persist;
- all 3 canonical-master bindings persist;
- 9/9 pack integrity can be verified;
- checksum tampering is detected;
- stale bindings are detected;
- safe governance sync restores stale static binding metadata without visual promotion;
- canonical review rejects stale pack evidence;
- staff readiness endpoint exposes the pack to read-authorised staff;
- all owner references remain reference-only/non-production.

### Platform checks

- `npm run check` — **PASS**
- `npm run test:wf5-promotion` — **PASS**
- JavaScript syntax: **104 files / 0 failures**
- JSON parse: **15 files / 0 failures**
- HTML dependency scan: **16 files / 264 local references / 0 missing**

### Broader WF5 acceptance

The broader acceptance gate remains red for exactly the pre-existing unrelated WF1 defect:

- `WF1-BOM-ANYOF` — **FAIL**
- `WF4-DIRECT-PRODUCTION-REVIEW` — **PASS**
- `WF5-CUSTOMER-DRAFT-ISOLATION` — **PASS**

WF4 did not alter that WF1 delivery lane.

## Next dependency

The next WF4 package is **A26-WF4-14**, but it should not manufacture evidence to start it. The next meaningful dependency is the first genuinely clean reviewable `Y62-F34-V1` candidate from WF3 with the locked overlay/camera acceptance, production-rights provenance and identified reviewer evidence complete.

Once supplied, WF4 can exercise the real persisted chain end-to-end:

**owner reference pack → canonical-master binding → eight-check F34 review → identified reviewer → immutable production version → sealed audit evidence → project/quote inspection**.

The SIDE path remains separately blocked by its required clean-side-source gap until that gap is legitimately resolved or explicitly accepted through its engineering/reviewer gate.
