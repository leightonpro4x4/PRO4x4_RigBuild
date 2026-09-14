# PUSH 42 — WF4 Canonical Candidate Handoff / Reviewer Intake

**Package:** A26-WF4-14A  
**Lane:** WF4 — Platform / Staff Tools only  
**Policy:** `REFERENCE_BACKED_APPROVED_VISUALS_ONLY`  
**Result:** PASS — package complete; real production promotion remains intentionally blocked pending a clean WF3 candidate.

## Why this package
The owner reference-pack registry and canonical review/readiness controls were already persisted, but WF3 candidate state still lived beside the governed canonical master rather than *on* it. That left the staff review lane dependent on remembering which candidate/review packet was current. This push closes that handoff gap without creating or promoting artwork.

## Concrete progress

### 1. Persisted WF3 → WF4 candidate handoff envelope
Added shared `canonical-candidate-handoff.js` and bound one deterministic handoff record to each governed Y62 canonical master.

The handoff persists:
- canonical master asset ID / brief / view;
- active reference-pack ID and manifest SHA-256;
- required reference IDs;
- latest WF3 candidate identity and source path where one exists;
- candidate binary SHA-256, MIME type, canvas and alpha state;
- candidate provenance / transformation / production-use restriction;
- upstream review ID, decision and check results;
- accepted/prohibited use;
- current blockers and next dependency;
- explicit `productionEligible: false`;
- explicit `implicitPromotionAllowed: false`;
- deterministic handoff SHA-256.

No handoff field can itself create a render-asset version, change `master-draft`, grant reviewer approval or move a production pointer.

### 2. Current governed Y62 handoff state
The persisted master state is now explicit:

- `Y62-F34-V1-MASTER`
  - latest candidate: `Y62-F34-V1-CANDIDATE-02`;
  - candidate SHA-256: `a353980a92131b960fed91baa46609bc63c1ec07a485fd4612fa305f0f7cea28`;
  - handoff SHA-256: `65499126b33adddd48591a2d35a4ad33f773c4c3659bfa4c5289567333160cba`;
  - upstream decision: `returned-to-wf3`;
  - intake state: `blocked-upstream`;
  - 12 normalized upstream blockers after deduplication/policy additions;
  - production eligible: **false**.
- `Y62-SIDE-V1-MASTER`
  - intake state: `awaiting-wf3-candidate`;
  - no candidate fabricated;
  - existing required square-on side-source gap remains preserved.
- `Y62-R34-V1-MASTER`
  - intake state: `awaiting-wf3-candidate`;
  - no candidate fabricated.

The existing F34 candidate file on disk was re-hashed during regression and exactly matches the persisted candidate checksum above.

### 3. Readiness is now candidate-handoff aware
`render-readiness-governance.js` now includes the candidate handoff in the canonical readiness fingerprint. This means a changed candidate, upstream review decision, checksum, blocker set or handoff fingerprint makes an earlier persisted readiness assessment **STALE** rather than silently carrying approval context forward.

New readiness blocker handling exposes:
- `WF3_CANDIDATE` when a canonical candidate has not arrived;
- `WF3_CANDIDATE` when the latest candidate was returned upstream;
- `WF3_CANDIDATE` when an incoming handoff still contains unresolved upstream blockers.

This is additive to — not a replacement for — rights, camera, reviewer, canonical-review, reference-pack, production-binary and immutable-version gates.

### 4. Governance sync repairs metadata only
The shared browser/server visual-governance sync now restores stale/missing candidate-handoff metadata from the governed WF3 handoff source.

Regression proves sync does **not**:
- create a candidate asset version;
- replace a canonical binary;
- change registry runtime status;
- change canonical governance approval state;
- promote a visual;
- mutate immutable version lineage.

### 5. Staff visibility
**Render Assets** now shows a dedicated `WF3 CANDIDATE HANDOFF` panel on canonical masters with:
- candidate ID/checksum/format/alpha state;
- upstream decision;
- reference-pack binding;
- handoff fingerprint;
- upstream check results;
- exact blockers and next action;
- clear non-production / handoff-only state.

**Production Readiness** now shows the candidate-handoff state on every canonical master card alongside the reference pack, review contract and persisted readiness assessment.

WF3 candidate/reference modules remain absent from the customer entrypoint.

## Verification

### WF4 package tests
- `tests/wf4-canonical-candidate-handoff-alpha26.js` — **PASS**
- handoff SHA integrity — **PASS**
- F34 source binary checksum match — **PASS**
- current reference-pack binding match — **PASS**
- returned WF3 decision preserved — **PASS**
- SIDE/R34 missing candidate states preserved — **PASS**
- readiness becomes stale after handoff mutation — **PASS**
- governance sync restores authoritative handoff — **PASS**
- implicit asset-version staging — **0**
- visual promotion — **0**

### Regression / integration
- full `npm test` Alpha regression chain — **PASS**
- `npm run check` — **PASS**
- WF5 governed promotion lifecycle — **PASS**
- WF5 acceptance:
  - `WF4-DIRECT-PRODUCTION-REVIEW` — **PASS**
  - `WF5-CUSTOMER-DRAFT-ISOLATION` — **PASS**
  - overall gate remains **FAIL** only for the pre-existing WF1 `WF1-BOM-ANYOF` defect.

### Static integrity
- JavaScript: **106 files / 0 syntax failures**
- JSON: **19 files / 0 parse failures**
- HTML: **15 files / 267 local references / 0 missing**
- `assets/` + `references/`: **byte-for-byte unchanged from Push 41**
- checked customer runtime files (`index.html`, `merged-app.js`, `app.js`, Ranger/Y62 data, render manifest, product visual contract, project contract, share shell): **byte-for-byte unchanged from Push 41**

## Visual-governance state after this package
`REFERENCE_BACKED_APPROVED_VISUALS_ONLY` is unchanged. No visual asset was created, altered or promoted. The current F34 candidate remains staff evidence only and `Y62-F34-V1-MASTER` remains `master-draft` / non-production.

## Next dependency
The next package is **A26-WF4-14B** and should begin only when WF3 supplies the first genuinely clean `Y62-F34-V1` candidate with:
- clean isolation / reconstruction;
- locked F34 overlay + camera acceptance;
- production-binary rights provenance;
- identified reviewer evidence suitable for the governed canonical review contract.

At that point WF4 can exercise the real sealed path end-to-end:

**owner reference pack → persisted WF3 handoff → canonical master → eight-check reviewer decision → immutable production version → sealed audit evidence → project/quote inspection**.
