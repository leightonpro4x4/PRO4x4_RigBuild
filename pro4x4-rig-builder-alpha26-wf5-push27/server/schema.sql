PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;
PRAGMA busy_timeout = 5000;

CREATE TABLE IF NOT EXISTS meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS quotes (
  reference TEXT PRIMARY KEY,
  status TEXT NOT NULL,
  project_id TEXT,
  payload_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
CREATE INDEX IF NOT EXISTS idx_quotes_project ON quotes(project_id);

CREATE TABLE IF NOT EXISTS staff_settings (
  id TEXT PRIMARY KEY,
  payload_json TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS catalogue_revisions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  vehicle_id TEXT NOT NULL,
  revision TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  published_at TEXT NOT NULL,
  published_by TEXT,
  UNIQUE(vehicle_id, revision)
);
CREATE INDEX IF NOT EXISTS idx_catalogue_vehicle ON catalogue_revisions(vehicle_id, id DESC);

CREATE TABLE IF NOT EXISTS catalogue_drafts (
  vehicle_id TEXT PRIMARY KEY,
  payload_json TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  updated_by TEXT
);

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  owner_id TEXT,
  title TEXT,
  vehicle_id TEXT,
  version INTEGER NOT NULL DEFAULT 0,
  current_revision_id TEXT,
  payload_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS project_revisions (
  project_id TEXT NOT NULL,
  revision_id TEXT NOT NULL,
  revision_number INTEGER NOT NULL,
  source TEXT,
  actor_json TEXT,
  checksum TEXT,
  summary_json TEXT,
  snapshot_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY(project_id, revision_id),
  FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_project_revisions ON project_revisions(project_id, revision_number);

CREATE TABLE IF NOT EXISTS shares (
  token_hash TEXT PRIMARY KEY,
  token_hint TEXT NOT NULL,
  project_id TEXT NOT NULL,
  revision_id TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at TEXT NOT NULL,
  expires_at TEXT,
  revoked_at TEXT,
  metadata_json TEXT,
  FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_shares_project ON shares(project_id);

CREATE TABLE IF NOT EXISTS audit_events (
  id TEXT PRIMARY KEY,
  at TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  actor_role TEXT,
  actor_id TEXT,
  correlation_id TEXT,
  payload_json TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_events(entity_type, entity_id, at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_events(action, at DESC);

CREATE TABLE IF NOT EXISTS schema_migrations (
  version INTEGER PRIMARY KEY,
  applied_at TEXT NOT NULL,
  description TEXT NOT NULL
);
