# Push 28 — WF4 Persisted Visual Governance

## Scope
This package advances one WF4 deliverable only: move the Alpha 26 Y62 visual-governance model from browser/local planning state into the shared hosted platform while improving staff visibility of owner references and canonical masters.

## Completed
- Added an idempotent staff visual-governance sync endpoint on the existing server/runtime.
- Persisted the nine owner-supplied 2025 Series 5 Y62 Warrior references as `reference` / `reference-approved` evidence records.
- Persisted three governed canonical master slots: `Y62-F34-V1-MASTER`, `Y62-SIDE-V1-MASTER`, and `Y62-R34-V1-MASTER`.
- Canonical slots remain `candidate` runtime records with governance `master-draft`; no binary, checksum, transparency proof or production approval is invented.
- Normalised legacy render registry records with explicit `assetClass` and governance state while preserving their established runtime status.
- Added staff registry filters for asset class and governance state, class/governance KPIs, persistent sync status, reference previews and canonical-master backing-reference links.
- Added protected staff-only reference-source delivery with SHA-256 verification. Hosted public static delivery under `/references/...` is blocked.
- Kept browser/local fallback aligned with hosted record semantics (`reference-only` runtime status for raw references and `candidate` for master draft slots).

## Verification
- New test: `tests/alpha26-wf4-persisted-visual-governance.js`.
- Initial hosted render registry remains 22 records before explicit governance sync, preserving previous test/runtime assumptions.
- First sync creates exactly 12 governed records: 9 references + 3 canonical master slots, total 34.
- Second sync creates 0 records and preserves all 12 governed records, proving idempotence.
- Production-eligible governed records after sync: 0.
- Protected owner-reference source resolves for staff and is denied by the public static path.
- Full Alpha regression chain passes.

## Next WF4 dependency
`A26-WF4-02`: when WF3 supplies the first real `Y62-F34-V1` master candidate, bind immutable version promotion to explicit `master-approved` / `layer-approved` reviewer transitions, approval evidence and audit history. This should extend the existing vault/version-lineage path rather than create a second workflow or backend.
