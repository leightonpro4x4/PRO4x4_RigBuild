# server-persistence

Stage 6 implements a SQLite project/revision/quote service in store.mjs and exposes it through api.mjs on the same preview origin. bootstrap.mjs opens the private ignored .runtime/alpha94.sqlite database. It is never on the static allowlist. SQLite uses foreign keys, WAL, immediate write transactions and immutable revision/terminal quote/audit triggers.

## WF4 foundation and authority changes

vendor/audit-integrity.cjs and vendor/auth.cjs are byte-identical copies of WF4 commit 26331f4619ee0516ce02f594567ca3e7bdc129c0. The new storage schema follows WF4's projects/revisions/quotes/shares/session separation, optimistic versions and sealed audit events; it does not import the old permissive snapshot/quote/share paths. Prototype headers and development login are disabled. Same-origin HttpOnly cookie sessions establish server-issued customer identities. This local guest session is not an external account sign-in or account-recovery system.

For a trusted operational finaliser, the server operator must provision both PRO4X4_FINALISER_ID and PRO4X4_FINALISER_TOKEN. Only that server-side credential can obtain the HTTP finaliser role via Authorization: Bearer. Browser role/name headers and payload actor/approval fields cannot create privilege. No finaliser credential is generated or committed by this stage. Mutations require the configured same origin; API Host checks protect the local service boundary. An external hosted authentication/deployment setup is outside this stage.

## Versioned revisions

alpha94-project-v1 snapshots contain the owner, immutable revision identity, vehicle/variant, profile, exact catalogue hash, implementation hash, selected scoped identities, server-recomputed Stage 4 decisions, complete/unknown pricing components and required components, Stage 5 render state, exact asset-hash provenance and migration source. Startup verifies the ten GLBs against Alpha93 and checks the audit chain. Catalogue/implementation drift requires explicit revalidation into a new revision; old bytes remain immutable and readable with migrationRequired=true. A stale revision cannot initiate/finalise a quote.

Save rejects caller-authored prices, ownership and unknown fields. Supplied decision/render assertions must match canonical recomputation. Variant assertions cannot manufacture towbar or fitment evidence; unknown conditions retain review. Parts knownSubtotal is not a claim of complete installed pricing.

Migration is explicit: /api/migrations/revision needs acknowledgement, source checksum and expected project version. /api/migrations/legacy accepts only acknowledged p4x4-a87/p4x4-a93 selection IDs into an isolated Alpha93 checkpoint revision with legacy-alpha93-v1 provenance. Old storage IDs are never server project IDs. Powerboards stays a checkpoint mapping gap and the A$10,239 fixture cannot become a normal quote.

## Quote lifecycle and sharing

Quote creation requires both existing lineage IDs and an exact matching immutable checksum, revalidates source decisions/calculations/render state, and checks project ownership. Optional submitted content/render state must match; merely recording mismatching hashes is forbidden. Draft quotes may be review-required/unpriced. Only a fully validated, fully priced non-checkpoint revision with at least one product can finalise. No price or fitment override endpoint exists.

Finalisation requires an authorised named finaliser and idempotency key, binds total/issuer/revision checksum, and becomes terminal. An exact same-issuer/key retry returns the existing state without a new audit event. Other retries and all customer/staff terminal mutations are rejected; database triggers also enforce this. No post-issuance amendment mechanism is introduced.

Public shares store only a hashed random token, pinned revision and expiry. Resolution constructs an explicit public DTO: pinned revision ID/checksum, vehicle, selections, derived pricing and visible/state flags. It excludes the project aggregate, sibling revisions/shares, token hashes/hints, owner/actor data, reviewer/master registries and internal render provenance. Public sharing does not confer visual production approval.

## Tests

node acceptance/tests/persistence.mjs runs 32 persistence/adversarial/API/workflow tests, including fresh database reopen, immutable SQL triggers and exact WF4 source hashes. Positive finalisation uses synthetic complete-price test data only; the authoritative WF2 records remain unchanged and unresolved normal builds stay review-required. Run test:desktop in normal Windows PowerShell for the real browser saved-project workflow and prior visual regressions when the Codex browser sandbox is unavailable.
