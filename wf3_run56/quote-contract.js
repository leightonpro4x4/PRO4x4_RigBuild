window.PRO4X4_QUOTE_CONTRACT = {
  schemaVersion: '0.12.0',
  storageKey: 'pro4x4-sales-queue-v1',
  staffSettingsKey: 'pro4x4-staff-settings-v1',
  quotePreviewKey: 'pro4x4-formal-quote-current',
  statuses: [
    {id:'new',label:'New lead'},
    {id:'needs-fitment-review',label:'Fitment review'},
    {id:'pricing-incomplete',label:'Pricing incomplete'},
    {id:'ready-to-quote',label:'Ready to quote'},
    {id:'quoted',label:'Quoted'},
    {id:'won',label:'Won'},
    {id:'lost',label:'Lost'}
  ],
  endpoints: {
    createBuild: 'POST /api/v1/builds',
    listQuotes: 'GET /api/v1/staff/quotes',
    updateQuote: 'PATCH /api/v1/staff/quotes/{reference}',
    getCatalogue: 'GET /api/v1/catalogue/{vehicleId}',
    publishCatalogue: 'POST /api/v1/staff/catalogue/{vehicleId}/revisions',
    finaliseQuote: 'POST /api/v1/staff/quotes/{reference}/finalise',
    createProject: 'POST /api/v1/projects',
    getProject: 'GET /api/v1/projects/{projectId}',
    saveRevision: 'POST /api/v1/projects/{projectId}/revisions',
    createShare: 'POST /api/v1/projects/{projectId}/shares',
    resolveShare: 'GET /api/v1/shares/{token}',
    revokeShare: 'DELETE /api/v1/shares/{token}',
    listAudit: 'GET /api/v1/staff/audit',
    importSeed: 'POST /api/v1/admin/import/seed'
  }
};
