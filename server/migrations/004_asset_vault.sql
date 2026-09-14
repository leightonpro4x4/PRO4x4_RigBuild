CREATE TABLE IF NOT EXISTS asset_objects (
  asset_id TEXT PRIMARY KEY,
  checksum_sha256 TEXT NOT NULL,
  object_key TEXT NOT NULL UNIQUE,
  mime_type TEXT NOT NULL,
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  has_alpha INTEGER,
  transparency_verified INTEGER NOT NULL DEFAULT 0,
  size_bytes INTEGER NOT NULL,
  stored_at TEXT NOT NULL,
  stored_by TEXT,
  FOREIGN KEY(asset_id) REFERENCES render_assets(asset_id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_asset_objects_checksum ON asset_objects(checksum_sha256);
