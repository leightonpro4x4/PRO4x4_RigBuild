CREATE TABLE IF NOT EXISTS asset_versions (
  version_id TEXT PRIMARY KEY,
  asset_id TEXT NOT NULL,
  version_number INTEGER NOT NULL,
  state TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  checksum_sha256 TEXT NOT NULL,
  object_key TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  has_alpha INTEGER,
  transparency_verified INTEGER NOT NULL DEFAULT 0,
  size_bytes INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  created_by TEXT,
  promoted_at TEXT,
  promoted_by TEXT,
  superseded_at TEXT,
  superseded_by TEXT,
  rejected_at TEXT,
  rejected_by TEXT,
  rejection_note TEXT,
  UNIQUE(asset_id, version_number),
  FOREIGN KEY(asset_id) REFERENCES render_assets(asset_id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_asset_versions_asset ON asset_versions(asset_id, version_number DESC);
CREATE INDEX IF NOT EXISTS idx_asset_versions_state ON asset_versions(state, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_asset_versions_object ON asset_versions(object_key);
