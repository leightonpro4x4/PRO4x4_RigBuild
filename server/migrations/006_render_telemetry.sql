CREATE TABLE IF NOT EXISTS render_telemetry (
  id TEXT PRIMARY KEY,
  at TEXT NOT NULL,
  session_key TEXT,
  vehicle_id TEXT NOT NULL,
  view_id TEXT NOT NULL,
  layer_id TEXT,
  exact_sku TEXT,
  state_key TEXT,
  event_type TEXT NOT NULL,
  attempt INTEGER NOT NULL DEFAULT 0,
  duration_ms INTEGER,
  asset_id TEXT,
  checksum_sha256 TEXT,
  error_code TEXT,
  payload_json TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_render_telemetry_vehicle_at ON render_telemetry(vehicle_id, at DESC);
CREATE INDEX IF NOT EXISTS idx_render_telemetry_view_event_at ON render_telemetry(view_id, event_type, at DESC);
CREATE INDEX IF NOT EXISTS idx_render_telemetry_asset_at ON render_telemetry(asset_id, at DESC);
