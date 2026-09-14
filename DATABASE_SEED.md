# First persistent database seed / import plan

Alpha 12 now includes `seed/bootstrap.seed.json`, a customer-data-free bootstrap bundle for the first server/database deployment.

## Import order
1. Create vehicle `nissan-y62-warrior-2025`.
2. Upsert its paint and wheel/tyre baseline records.
3. Upsert accessories by stable `id` and enforce SKU uniqueness where SKU is present.
4. Store source/provenance and fitment dependencies as structured JSON or normalized child tables.
5. Publish the imported catalogue in one transaction.
6. Write an audit event for the import.

## Safety / integrity rules
- Never convert `null` quote components to `$0` during import.
- Preserve `pricingRequired` because it determines whether a missing value blocks a formal quote.
- Preserve source authority, URL and verification state.
- Preserve net vehicle-added mass separately from packaged product mass where both exist.
- Customer projects/quotes should use separate import jobs with explicit ownership mapping rather than being mixed into the base catalogue seed.

## Prototype endpoint
`POST /api/v1/admin/import/seed`

The Alpha 12 mock endpoint accepts the seed contract and returns counts plus any row-level errors. Production must require an authenticated admin role and execute the import transaction server-side.

## Alpha 18 render lineage seed rule
`asset_versions` is intentionally **not pre-populated** by the bootstrap seed. Version lineage is created only when a real governed binary exists. A legacy production record is backfilled only when its first genuine replacement is staged; this avoids inventing render history or creating fake production versions.

## Alpha 22 render-state seed rule
Known Y62 base records are explicitly state-bound to `paintId: black-obsidian`; factory wheel records are state-bound to `wheelTyreId: factory-warrior`. Other validated paint states are not cloned from Black Obsidian and remain missing until genuine state-specific assets are registered. Existing databases receive the same metadata mapping at startup without changing status or approval.

