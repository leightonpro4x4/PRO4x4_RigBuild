# PRO4X4 Rig Builder bootstrap seed — Alpha 12

`bootstrap.seed.json` is intentionally safe to import into a new persistent environment:

- one Y62 Warrior catalogue baseline
- current 11 fitment-aware accessory records
- no customer PII
- no quote records
- no saved customer projects

Target endpoint: `POST /api/v1/admin/import/seed`.

The importer must be idempotent at the deployment layer. In this browser mock it publishes a catalogue revision and reports imported counts; a production database importer should use stable vehicle/accessory IDs and upsert inside one transaction.

Do not treat the seed's quote-only component blanks as zero-dollar values. `pricingRequired` remains authoritative for quote gating.
