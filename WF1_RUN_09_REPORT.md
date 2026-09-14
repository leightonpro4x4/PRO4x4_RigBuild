# PRO4X4 Rig Builder — WF1 Run 09

## Package advanced

**Exact production visual-state explainability** — one WF1 package only.

The governed structured fitment-context question contract is still not present in the merged Alpha checkpoint, so WF1 did not invent question IDs, allowed answers or compatibility semantics from manufacturer free text. The next independent WF1 package from Run 08 was therefore advanced: make exact customer visual state understandable without creating imagery or duplicating the render resolver.

## Concrete progress

- Added `customer-visual-state.js`, a read-only customer explanation model over the existing production resolver response and existing catalogue visual-readiness metadata.
- The Y62 visual stage now exposes the exact server-governed production states:
  - `AVAILABLE` — an exact approved production asset resolved for the required layer;
  - `MISSING` — the exact required state/SKU does not have an eligible production asset;
  - `BLOCKED` — a governed fitment/production condition prevents customer output.
- Resolver reason codes are preserved and translated into customer-readable explanations, including:
  - `reference-only-not-production`;
  - `production-asset-missing`;
  - `render-state-not-registered`;
  - `exact-sku-not-registered`;
  - `hosted-production-proof-required`;
  - `approved-master-not-available`;
  - `fitment-blocked`;
  - production-governance review/gate states when supplied by the resolver.
- Missing/blocked rows deliberately discard any asset identity as a customer production choice. Only `available` rows may carry the exact approved asset/checksum identity in the explanation model.
- The visual panel restates `REFERENCE_BACKED_APPROVED_VISUALS_ONLY`, `fallback: none`, and exact-match-required behavior next to the layer result instead of leaving those rules hidden in backend contracts.
- Ranger now has an explicit **PRODUCTION VISUAL NOT YET ENABLED** state. It does not manufacture available/missing counts and does not display a stand-in vehicle image.
- The selected-build sidebar now distinguishes **BUILD VISUALS · PRODUCT READINESS** from the Y62 server-resolved production stack. This avoids presenting catalogue metadata as if it were an exact composited production render.
- Product-readiness definitions are visible in the build summary: approved, pending/review, and blocked.
- The existing immutable handoff remains unchanged; its saved snapshot still owns the exact resolver response that moves through project → revision → share/quote lineage.

## Scope protection

Functional diff against WF1 Run 08 is limited to:

- `customer-visual-state.js` — new read-only explainability model;
- `index.html` — visual-state host + script include;
- `merged-app.js` — renders the read-only explainability model and clarifies product visual readiness;
- `merged.css` — PRO4X4-styled state/count/layer presentation;
- `tests/wf1-visual-state-explainability-alpha26.js` — targeted regression coverage;
- `package.json` — version/test registration;
- Run 09 QA/report evidence.

No Ranger/Y62 catalogue records, fitment truth, product SKU/RRP/install/weight data, backend/server resolver code, project/quote persistence contract, render manifest, asset registry, canonical candidate, production asset, image file or visual-generation tooling was changed.

The customer entrypoint still does not load `y62-canonical-candidates.js`, `y62-f34-reconstruction-brief.js`, or `y62-f34-overlay-review-contract.js`.

## Verification

Passed:

- `npm run test:wf1-visual-state`
  - exact `available / missing / blocked` explanation behavior;
  - raw resolver reason preservation;
  - no reference/draft asset leakage from missing rows;
  - Ranger no-stand-in behavior;
  - read-only ownership check: no fetch, persistence, project save, catalogue mutation or selection mutation in the explanation module.
- complete `npm test` Alpha 12 → current Alpha 26 regression chain;
- `npm run check` server syntax gate;
- `npm run test:wf5-promotion` — PASS, including immutable reviewer evidence and project/share/quote visual lineage;
- static JavaScript syntax: **97 files / 0 failures**;
- JSON parsing: **9 files / 0 failures**;
- HTML dependency validation: **16 HTML files / 245 local references / 0 missing**.

WF5 combined acceptance remains held only by the existing separate WF4 defect:

- `WF1-BOM-ANYOF` — **PASS**;
- `WF5-CUSTOMER-DRAFT-ISOLATION` — **PASS**;
- `WF4-DIRECT-PRODUCTION-REVIEW` — **FAIL** because direct production upsert still accepts `master-approved` metadata without immutable `governance.reviewedBy` / `governance.reviewedAt` evidence.

This WF1 run does not modify or mask that WF4 failure.

## Next WF1 dependency

The highest-priority WF1 dependency remains **structured customer fitment-context capture**, blocked until WF2 publishes governed question IDs, allowed answer values, answer semantics and their mapping to fitment-review state.

If that WF2 contract is still absent at the next WF1 push, the next independent package should be **immutable handoff visual-state detail**: carry the already-persisted per-layer `available / missing / blocked` reasons into the save/share/quote review and receipt surfaces, reading only from the exact saved snapshot rather than live mutable builder state.
