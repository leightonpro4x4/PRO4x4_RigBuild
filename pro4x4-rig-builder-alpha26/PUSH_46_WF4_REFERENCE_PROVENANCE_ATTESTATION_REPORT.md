# PRO4X4 Rig Builder — Push 46 / A26-WF4-18
## Persisted Reference Provenance Attestation + Evidence Freshness Controls

### Package advanced
One WF4 package only: **reference/provenance intake and persisted evidence-freshness governance**. No catalogue expansion, WF3 visual production, customer UX work, quote workflow expansion or unrelated backend lane was advanced. Backend changes were limited to the active shared render-asset governance path required to persist and enforce reference source/rights evidence.

### Concrete progress
WF4 now persists a SHA-256-addressed `provenanceAttestation` on every governed owner reference in the existing render-asset registry. The attestation binds the exact reference identity, source path/type, file checksum, rights/licence state, canonical-view consumption and owner reference-pack identity/manifest. It is explicitly `authority: reference-evidence-only` and `productionEligible: false`, so it records what source/rights evidence staff reviewed without upgrading reference imagery into customer production content.

The active **`Y62-OWNER-REFERENCE-PACK-V1`** retains its existing manifest SHA-256 **`260a875ef1a787d477178faaa21e897a225a8113fa6d02cab73840e012fe0342`**. In the clean governed state all **9/9 owner references are registered, reference-approved and currently source/rights-attested**: 4 primary and 5 support references. The required SIDE source gap remains explicitly preserved.

Evidence drift now fails closed. Changing a reference source checksum/path/type, rights/licence evidence or pack binding makes the persisted attestation stale. Routine governance sync deliberately does **not** replace an existing stale attestation, so source/rights drift remains visible to staff. A stale required reference blocks owner reference-pack integrity and canonical review, and the attestation snapshot also feeds canonical review evidence, render-readiness fingerprints and the reviewer governance dossier so downstream evidence becomes stale when its backing source/rights basis changes.

Staff **Render Assets** now exposes a dedicated **REFERENCE PROVENANCE ATTESTATION** panel with freshness, actor/time, rights state and basis SHA-256, plus **BACKING REFERENCE ATTESTATIONS** on canonical masters. Authorised fitment/admin staff can explicitly **ATTEST CURRENT SOURCE + RIGHTS** after reviewing changed evidence. Production Readiness exposes the same freshness state and the pack-level attested count. Re-attestation reuses the existing shared render-asset upsert path; no parallel database, API lane or runtime was introduced.

### Governance state preserved
**REFERENCE_BACKED_APPROVED_VISUALS_ONLY** remains authoritative. Owner sources remain `reference-only`, `reference-approved` and `productionEligible: false`. The clean governed Y62 state still contains **0 production-ready visuals**, and governance sync reports **0 production-eligible visuals**. No visual, reference or candidate was promoted by this package.

The complete `assets/` and `references/` trees are byte-for-byte identical to Push 17. Eleven customer-critical entrypoint/render-contract files are also byte-for-byte identical, so no customer configurator behaviour or artwork was changed. The F34 upstream dependency remains the same returned WF3 candidate; this package only hardens the evidence basis that a future clean candidate must rely on.

### Verification
The new `wf4-reference-provenance-attestation-alpha26` adversarial regression passes. It proves 9/9 current attestations at bootstrap, pack completeness, source/rights drift detection, governance-sync preservation of stale evidence, fail-closed canonical review, rejection of a forged attestation fingerprint, explicit authorised re-attestation, audit visibility and zero visual promotion.

The complete Alpha regression chain passes. `npm run check` passes. The WF5 governed promotion lifecycle passes. The broader WF5 acceptance gate remains red for exactly the pre-existing **WF1 `WF1-BOM-ANYOF`** defect; `WF4-DIRECT-PRODUCTION-REVIEW` and `WF5-CUSTOMER-DRAFT-ISOLATION` remain PASS. Static validation passes at **114 JavaScript files / 0 syntax failures, 31 JSON files / 0 parse failures, and 16 HTML files / 278 local references / 0 missing**. Final ZIP integrity is also verified and recorded in the accompanying validation manifest.

### Next dependency
The primary WF4 dependency remains the first genuinely clean, reviewable **`Y62-F34-V1`** candidate from WF3 with clean isolation/reconstruction, locked overlay + camera acceptance, production-rights provenance and identified reviewer evidence. When that arrives, WF4 can exercise the real **attested owner reference pack → WF3 handoff → evidence-bound reviewer claim → eight-check canonical review → immutable master production → sealed audit → exact layer/composite eligibility → project/quote inspection** chain end-to-end.
