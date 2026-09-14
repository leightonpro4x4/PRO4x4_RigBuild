CREATE TABLE IF NOT EXISTS render_assets (
  asset_id TEXT PRIMARY KEY,
  vehicle_id TEXT NOT NULL,
  view_id TEXT NOT NULL,
  layer_id TEXT NOT NULL,
  exact_sku TEXT,
  status TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_render_assets_vehicle_view ON render_assets(vehicle_id, view_id, layer_id);
CREATE INDEX IF NOT EXISTS idx_render_assets_status ON render_assets(status, updated_at DESC);
