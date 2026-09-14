# PRO4X4 Rig Builder API Contract — v0.14.0

Base path: `/api/v1`

## Runtime
- `GET /health` — contract version, database schema version/migration level, environment and auth mode.

## Server session boundary
- `GET /auth/session` — resolve or issue an anonymous customer session.
- `POST /auth/dev-login` — development-only staff/customer session issue; disabled by default in production.
- `POST /auth/logout` — revoke the current server session and clear the cookie.

Hosted mode uses an HttpOnly `p4x4_session` bearer cookie. The server stores only the SHA-256 token hash and session metadata. Prototype `x-pro4x4-*` identity headers are an explicitly configurable development bridge and default off in production.

## Error envelope
```json
{
  "error": "validation_error",
  "code": "validation_error",
  "message": "Build payload failed validation",
  "fieldErrors": [{"field":"vehicle.id","message":"Vehicle ID is required"}],
  "requestId": "..."
}
```

Additional hardening errors include `origin_forbidden`, `payload_too_large`, `rate_limited` and `dev_login_disabled`.

## Projects / revisions
- `GET /projects` — customer receives owned projects only; staff/admin can list across projects.
- `GET /projects/{projectId}`
- `POST /projects/{projectId}/revisions` — supports `expectedVersion`; stale writes return `409`.
- `PUT /projects/{projectId}/current-revision`

## Shares
- `POST /projects/{projectId}/shares`
- `DELETE /projects/{projectId}/shares/{tokenHash}`
- `GET /shares/{token}`
- `DELETE /shares/{token}`

Project share bearer tokens are returned only at creation time. Persisted share data stores SHA-256 hashes and hints.

## Builds / quotes
- `POST /builds`
- `GET /staff/quotes`
- `GET /staff/quotes/{reference}`
- `GET /staff/quotes/{reference}/lineage` — staff-only inspection of the immutable project revision, bound shares, persisted quote-lineage seal, frozen render state, checksum-pinned production visual evidence, and the quote-time visual-governance seal binding the canonical master, reference pack, owner-reference provenance snapshots and current-governance drift.
- `PATCH /staff/quotes/{reference}`
- `POST /staff/quotes/{reference}/finalise`

When a submitted build carries `project.id` + `project.revisionId`, that source pointer is sealed on first quote creation. Staff quote edits/finalisation may update review/pricing state but cannot repoint the quote to another project revision; a repoint attempt returns `quote_lineage_immutable`. Visuals reported as `available` by the lineage inspector must resolve to the exact frozen checksum of an immutable production/superseded version with approved governance and reviewer evidence. Reference-only, draft or unsupported fallback output is blocked. On first quote creation the render snapshot is also sealed under `REFERENCE_BACKED_APPROVED_VISUALS_ONLY`; subsequent attempts to alter the quote render/view/layer snapshot return `quote_visual_lineage_immutable`. The sealed governance packet is historical evidence: later canonical/reference-pack changes are surfaced as drift to staff without rewriting what was true when the quote was submitted.

## Staff settings
- `GET /staff/settings/quote`
- `PATCH /staff/settings/quote`

## Catalogue
- `GET /catalogue/{vehicleId}`
- `POST /staff/catalogue/{vehicleId}/revisions`
- `GET /staff/catalogue/{vehicleId}/draft`
- `PUT /staff/catalogue/{vehicleId}/draft`
- `DELETE /staff/catalogue/{vehicleId}/draft`

## Audit
- `GET /staff/audit?entityType=&entityId=&action=&limit=`
- `GET /staff/audit/integrity` — verifies the append-only SHA-256 event chain; `broken` is a production-control blocker.

Auth session issue/revocation is written into the audit ledger. Raw session tokens are never written to audit metadata.

## Seed / backup
- `POST /admin/import/seed`
- `GET /admin/backup`
- `POST /admin/backup/restore`

Portable backups intentionally omit `auth_sessions`; restoring business data must not resurrect browser credentials.


## Render asset registry — Alpha 14
Staff fitment/admin operations:
- `GET /api/v1/staff/render-assets?vehicleId=...&viewId=...&status=...`
- `PUT /api/v1/staff/render-assets/{assetId}`

### Alpha 26 WF4 — governance-managed metadata write boundary

For existing governed canonical masters and owner-reference records, the generic render-asset update route cannot rewrite system-owned identity or governance bindings. Protected fields include asset/view/layer identity, `referencePack`, `canonicalView`, `candidateHandoff`, `compositeEligibility`, `governanceDossier`, `reviewWorkflow`, `readinessAssessment`, `canonicalReviewEvidence`, immutable lineage, persisted approval-review evidence and the `governanceWriteBoundary` declaration itself. Pack-bound reference assets additionally protect `referenceEvidence`.

Attempting to change a protected field through the generic route fails closed with HTTP `409` / `governance_metadata_protected`, records the blocked field paths in the existing audit ledger, and leaves the persisted record unchanged. Dedicated governance workflows retain narrowly scoped authority to update only their owned metadata (for example readiness assessment or reviewer dossier refresh). This control creates no new persistence or customer-render lane and does not weaken `REFERENCE_BACKED_APPROVED_VISUALS_ONLY`.

`POST /api/v1/staff/render-assets/:assetId/provenance-attestation` is the narrow fitment/admin write path for refreshing an owner-reference source/rights attestation after staff review. The generic asset editor cannot rewrite `provenanceAttestation`; `sales` remains inspection-only.

`production-ready` is server-gated. The record must have cleared owned/licensed provenance, a valid SHA-256 checksum, file metadata, verified alpha transparency, matched locked camera geometry and no unresolved fitment block. Failed promotion returns `422 asset_gate_blocked`.

## Render candidate ingestion — Alpha 15

The browser-side ingestion pipeline accepts **PNG or WebP** candidate layers. The browser computes SHA-256, dimensions, format and transparent-pixel evidence before metadata is written to the existing render-asset record with `PUT /api/v1/staff/render-assets/{assetId}`.

The current Alpha intentionally does **not** upload or persist the binary image. `fileName`, `sizeBytes`, `inspectedAt`, checksum and inspection evidence are persisted; object-storage upload is a later hosted dependency.

Production approval remains server-enforced. For `front34`, Alpha 15 additionally enforces the locked `Y62-F34-V1` canvas of **1672 × 615**. A staff checkbox cannot bypass this dimension gate, provenance/licensing, checksum, transparent-pixel evidence, fitment state or manual camera-overlay verification.

## Alpha 16 — governed render binary vault

- `PUT /api/v1/staff/render-assets/{assetId}/binary` — fitment/admin only. Raw PNG/WebP request body. Stores content-addressed binary and attaches server-verified metadata.
- `GET /api/v1/staff/render-assets/{assetId}/binary` — fitment/admin candidate retrieval.
- `GET /api/v1/render-assets/{assetId}/binary` — public only when the registry record is `production-ready`; Alpha 21 resolver-supplied `?sha=` URLs provide checksum-pinned immutable delivery.

Production approval requires the persisted `asset_objects` record to agree with the registry checksum/dimensions and to carry server-side transparency verification. Client-supplied `vault` metadata is not sufficient.

## Alpha 17 — asset vault lifecycle
- `GET /api/v1/admin/asset-vault/status` — admin-only integrity reconciliation of governed DB references vs vault files.
- `POST /api/v1/admin/asset-vault/gc` with `{ "execute": false }` — dry-run orphan scan.
- `POST /api/v1/admin/asset-vault/gc` with `{ "execute": true }` — remove only unreferenced vault objects and audit the operation.
- `GET /api/v1/admin/backup` now includes `vaultManifest` and `vaultManifestHealthy`; binary bytes remain outside the JSON backup.

## Alpha 18 — render asset version lineage

All endpoints below require `fitment` or `admin` role and preserve the existing production asset until explicit promotion.

### `GET /api/v1/staff/render-assets/:assetId/versions`
Returns immutable version history newest-first. States: `candidate`, `production`, `superseded`, `rejected`.

### `POST /api/v1/staff/render-assets/:assetId/versions`
Body is the raw PNG/WebP binary. Stores the content-addressed object and creates a new `candidate` version. If the asset is already production-ready but predates version lineage, the existing production asset is backfilled as the first immutable production version. Only one open candidate is permitted per asset.

### `PUT /api/v1/staff/render-assets/:assetId/versions/:versionId`
Updates review metadata on a `candidate` version only. Logical slot identity and binary checksum/dimensions/object key are server-locked.

### `POST /api/v1/staff/render-assets/:assetId/versions/:versionId/promote`
Runs the full production gate against the candidate's persisted binary. On success, previous production becomes `superseded`, candidate becomes `production`, and the active production pointer moves atomically.

### `POST /api/v1/staff/render-assets/:assetId/versions/:versionId/reject`
Marks a candidate `rejected` and preserves its binary/provenance history. Current production is unchanged.

### Vault lifecycle interaction
`/api/v1/admin/asset-vault/status`, GC and backup manifests now include unique object keys referenced by current production or any asset version state. Superseded/rejected history is therefore not treated as orphaned storage.

## Alpha 19 — governed object storage and historical delivery

`GET /api/v1/staff/render-assets/:assetId/versions/:versionId/delivery` requires `fitment` or `admin`. It returns a short-lived delivery descriptor for the exact immutable version. Local storage returns a signed application URL; S3-compatible storage returns a SigV4 presigned GET URL.

`GET /api/v1/render-assets/version-delivery/:token` serves only a valid, unexpired locally signed immutable version and verifies the stored SHA-256 before delivery. Token tampering or expiry is rejected.

`GET /api/v1/render-assets/:assetId/binary` remains production-only. If `PRO4X4_ASSET_CDN_BASE_URL` is configured, an approved production object redirects to its immutable content-addressed CDN URL; non-production versions never use that public endpoint.

Vault status, GC and backup verification operate across either local or S3-compatible storage. Database migration remains v5; object keys and asset-version lineage do not change when storage providers change.

## Alpha 21 — customer production-layer resolver

### `POST /api/v1/render/resolve`
Customer-safe resolver. Request body:
```json
{
  "vehicleId": "nissan-y62-warrior-2025",
  "viewId": "front34",
  "requirements": [
    {"layerId":"base","exactSku":null},
    {"layerId":"wheels","exactSku":"FACTORY-WARRIOR-18X9-G015"},
    {"layerId":"front","exactSku":"Y62 S5 GEN-X"}
  ]
}
```

Response layers use only:
- `available` — exact registry slot is production-ready, its governed active binary exists, and the production gate still passes.
- `missing` — exact production visual is unavailable. Reference-only, candidate, retired and asset-needed records do not become customer visuals.
- `blocked` — exact registry slot is fitment-blocked.

`fallbackPolicy` is always `none` and `exactMatchRequired` is true. If another SKU exists for the same logical layer, it is not substituted. An exact SKU miss returns `reason: "exact-sku-not-registered"` and no `assetId`/`binaryUrl`.

An `available` layer includes a checksum-pinned `binaryUrl`, for example:
`/api/v1/render-assets/Y62-FRONT34-01-BASE/binary?sha=<64-char-sha256>`.

### Production binary checksum pin
`GET /api/v1/render-assets/:assetId/binary?sha=<sha256>` rejects the request with `409 asset_version_changed` if that checksum is no longer the active production binary. Long immutable caching is used only for checksum-pinned requests. Unpinned production requests retain short cache duration for compatibility.

The resolver never returns reference-stage source paths, candidate binaries, historical superseded/rejected versions or staff-only signed historical delivery URLs.


## Alpha 21 render diagnostics
`POST /api/v1/render/resolve` returns `diagnostics.baseState`, `diagnostics.unresolved[]` and `diagnostics.preloadOrder[]` in addition to explicit layer states.

## Alpha 22 — exact render state + delivery telemetry
`POST /render/resolve` requirements may include `state` and `stateKey`, e.g. `{"layerId":"base","exactSku":null,"state":{"paintId":"black-obsidian"},"stateKey":"paint:black-obsidian"}`. State matching is exact. If the layer/SKU exists but the requested state does not, the response is `missing` with `reason: "render-state-not-registered"`; no other paint/wheel state is substituted.

`POST /render/telemetry` accepts bounded customer delivery events (`resolve-start`, `resolve-success`, `resolve-error`, `asset-load-start`, `asset-load-success`, `asset-load-error`, `asset-load-retry`, `stack-ready`, `stack-degraded`). `GET /staff/render-telemetry` is staff-gated and supports vehicle/view/event filters.


## Alpha 26 WF4 — governed reference / provenance intake

The existing `PUT /api/v1/staff/render-assets/{assetId}` route also governs `assetClass: reference` evidence records. Reference intake does not create a production candidate and must remain `status: reference-only` with `layerId: reference`, `exactSku: null`, and `referenceEvidence.productionEligible: false`.

Reference records persist source type, rights status/note, authenticity role, optional checksum/file metadata, and the governed Y62 canonical master IDs the evidence supports. Local reference-pack paths require a valid SHA-256 provenance checksum; URL-only external evidence may be registered without pretending the remote binary is owned or vaulted. `reference-approved` evidence additionally requires persisted reviewer identity and review timestamp.

Any attempt to put a reference record into candidate or production runtime state, give it an unsupported canonical binding, omit required provenance/rights metadata, or approve it without reviewer evidence returns `422 reference_evidence_gate_blocked`. This is separate from `asset_gate_blocked` for canonical-master/product-layer production promotion. Reference evidence remains non-production even when its authenticity use is approved.

## Alpha 26 WF4 — persisted canonical review evidence

A governed canonical master (`assetClass: canonical-master`, `layerId: base`, with a persisted `canonicalView.briefId`) is subject to its canonical-view review contract in addition to the generic production gate. For `Y62-F34-V1`, the locked contract is `Y62-F34-V1-OVERLAY-01` and all eight required checks must persist as `pass` before `master-approved` can be stored.

Candidate review persists `canonicalReviewEvidence` containing the exact canonical brief/contract ID, candidate SHA-256, reviewer identity/time, per-check result set, and checksum snapshots for every required reference record. The evidence is generated server-side from the persisted candidate plus registered reference records; staff clients cannot manufacture a production pass by setting only `master-approved`.

Both direct production upsert and immutable version promotion re-run this gate. Promotion fails if a required reference is missing/non-approved/non-reference-only, if a required check is not `pass`, if candidate/reviewer data no longer matches the persisted evidence, or if a reference checksum changed after review. These failures use `422 canonical_review_gate_blocked` during candidate review or `422 asset_gate_blocked` at production promotion.

Reference snapshots are evidence only. They remain `reference-only` with `referenceEvidence.productionEligible: false` and cannot become customer output. Legacy generic Alpha render slots without a persisted canonical-view contract continue through the generic production gate; new Y62 canonical production work must use the governed F34/SIDE/R34 master slots created by visual-governance sync.

## Staff canonical readiness assessment

`POST /api/v1/staff/render-readiness/assess` requires `fitment` or `admin`. It persists a non-promotional readiness assessment on each governed canonical master for the requested vehicle. The assessment contains the active blocker set, assessor identity/time, owner/reference snapshots, version summary, evidence fingerprint basis and SHA-256 fingerprint. Re-reading `GET /api/v1/staff/render-readiness` returns `canonicalAssessments` with `current`, `stale`, `invalid` or `unassessed` freshness. A readiness assessment never grants `master-approved`, never changes `production-ready`, and never substitutes reference evidence for a production binary.

## Alpha 26 WF4 — persisted owner reference-pack registry

The Y62 owner evidence bundle is governed as `Y62-OWNER-REFERENCE-PACK-V1` under `REFERENCE_BACKED_APPROVED_VISUALS_ONLY`. The manifest is deterministic and SHA-256 fingerprinted from the declared vehicle identity, usage basis, nine owner-reference records, canonical-view bindings and known geometry gaps.

Visual-governance sync persists `referencePack` metadata onto each declared owner reference and each governed canonical master through the existing `render_assets` backbone. Owner references remain `reference-only` with `referenceEvidence.productionEligible: false`. Canonical masters persist the pack ID, manifest SHA-256 and the exact required reference IDs for their view; this metadata does not approve or promote any binary.

`GET /api/v1/staff/render-readiness` now returns `referencePack` with current manifest integrity, declared/registered/approved counts, per-reference checksum/rights/source state, known source gaps and explicit integrity problems. A checksum mismatch, stale pack binding, missing declared reference, rights/source mismatch or undeclared member makes the pack state `blocked` for staff inspection without changing the underlying reference runtime state.

Canonical review additionally requires every required reference to carry the same persisted pack ID and manifest SHA-256 as the canonical master. Canonical review evidence snapshots the pack identity and manifest checksum so a later pack mutation invalidates the prior evidence rather than silently remaining production-eligible.

## Alpha 26 WF4 — canonical reviewer governance dossier

`POST /api/v1/staff/render-assets/:assetId/governance-dossier` requires `fitment` or `admin` and applies only to governed canonical masters. It persists an inspection-only `governanceDossier` containing a deterministic SHA-256 fingerprint of the current canonical master/brief, owner reference-pack snapshots, WF3 candidate handoff, canonical review results/evidence, persisted readiness assessment and current production blockers.

The stored dossier includes `authority: "inspection-only"` and `productionEligible: false`. Preparing or refreshing it does not change asset status, governance approval state, binary metadata, immutable version lineage or the current production pointer. `sales` may inspect the resulting metadata through staff asset/readiness APIs but cannot refresh it.

Dossier freshness is recomputed against current persisted evidence. A change to a required reference, candidate handoff, canonical review result/evidence, readiness assessment, camera/reviewer state or production-governance input makes an earlier dossier `stale`. Visual-governance sync prepares a dossier only when one is absent; it deliberately does not overwrite an existing stale dossier, so evidence drift stays visible until an authorised reviewer refreshes it. The dossier supports reviewer intake and auditability but never substitutes for canonical review evidence or the production promotion gate.
### `POST /api/v1/staff/render-assets/:assetId/review-workflow`
Requires `fitment` or `admin` and applies only to a governed canonical master. Body `{"action":"refresh"}`, `{"action":"claim"}` or `{"action":"release","claimSha256":"<current-claim-sha256>"}` updates the persisted reviewer-assignment workflow through the shared render-asset registry. The workflow is non-production (`authority: review-assignment-only`, `productionEligible: false`) and is SHA-256 bound to the current canonical contract, owner reference snapshots and WF3 candidate handoff. An active assignment also carries `authority: review-claim-only`, `productionEligible: false`, `claimId`, `claimSha256`, canonical master/brief IDs, workflow evidence-binding SHA, exact candidate checksum and reviewer identity/time. Same-reviewer claim retry is idempotent. Evidence or claim-integrity drift invalidates the claim on refresh. Release is optimistic-concurrency guarded: when the supplied `claimSha256` does not match the current claim, the server returns `409 review_claim_conflict` and preserves the current assignment. Canonical review decisions and production evidence bind the exact claim envelope; production promotion still requires the assigned reviewer and exact candidate/binary checksum.

### `POST /api/v1/staff/render-assets/:assetId/review-decision`
Requires `fitment` or `admin`; `sales` is inspection-only. The body carries `decision: "approved" | "returned"`, the locked review `results`, and an optional reviewer note. Required geometry-source gaps are not editable through this endpoint; they are consumed from the dedicated persisted `canonicalSourceGapResolution` decision. The server persists `canonicalReviewDecision` on the same render-asset record, with `authority: "review-decision-only"` and `productionEligible: false`.

The decision SHA-256 binds the exact canonical contract, owner-reference pack and per-reference source/rights attestation snapshots, WF3 candidate/handoff checksum, current reviewer assignment and the recorded check results. `approved` requires every locked check to pass and any required source gap to be explicitly approved; `returned` requires a failed check or reviewer note. Generic render-asset writes cannot alter `canonicalReviewDecision`. Evidence/assignment/checksum drift makes the decision stale. Direct canonical production upsert and immutable version promotion fail closed unless a current `approved` decision belongs to the assigned reviewer and its candidate checksum matches the binary under review.


### Reference provenance attestation (Alpha 26 / WF4-18)
Governed `reference-approved` owner evidence that belongs to a persisted reference pack carries a `provenanceAttestation`. The attestation is SHA-256 bound to the current source checksum/path/type, rights/licence metadata, reference-pack identity/manifest and canonical-view bindings. It has `authority: "reference-evidence-only"` and `productionEligible: false`.

No new API lane is introduced. Fitment/admin staff use the existing render-asset upsert path to explicitly re-attest a source after reviewing changed source/rights evidence. An incoming malformed, forged or stale attestation is rejected with `reference_attestation_blocked`. Governance sync may backfill a missing legacy attestation but deliberately does not overwrite a persisted stale attestation, so evidence drift stays visible. Required stale/missing attestations block reference-pack integrity and downstream canonical review/readiness evidence.


### `POST /api/v1/staff/render-assets/:assetId/source-gap-resolution` (Alpha 26 / WF4-28)
Requires `fitment` or `admin`; `sales` is inspection-only. Applies only to a governed canonical master whose canonical brief declares `referenceGap.severity: required`. Body carries `decision: "approved" | "returned"`, optional `resolutionMethod: "additional-reference" | "reviewed-reconstruction"`, optional `evidenceReferenceIds[]`, and a reviewer `notes` field.

The server persists `canonicalSourceGapResolution` on the existing render-asset record with `authority: "source-gap-decision-only"` and `productionEligible: false`. Generic render-asset writes cannot alter this field and return `409 governance_metadata_protected`. `reviewed-reconstruction` approval fails with `422 canonical_source_gap_resolution_blocked` unless the canonical view contract is CURRENT/LOCKED, the WF3 handoff has a checksum-identified candidate in `ready-for-wf4-review`, the acting fitment/admin is the claimed reviewer, camera geometry is matched and a reviewer explanation is present. `additional-reference` approval requires exact-view, same-pack, current attested and evidence-review-approved reference records. Evidence drift makes the persisted decision stale. Registry sync never silently replaces an explicit APPROVED or RETURNED reviewer decision.
