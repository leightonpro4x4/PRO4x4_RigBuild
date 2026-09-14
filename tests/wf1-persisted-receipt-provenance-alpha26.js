'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const receipt=require('../customer-handoff-receipt.js');
const contract=require('../merged-project-contract.js');
global.window=global;
require('../data-ranger.js');
const data=global.RANGER_DATA;
const steps=data.accessories.find(p=>p.id==='mcc-309bsbk');
assert(steps,'governed Ranger fixture required');
const snapshot=contract.buildSnapshot({
  data,
  selectedProducts:[steps],
  lead:{name:'WF1 Provenance',phone:'0400000000'},
  reference:'P4X4-WF1-PROVENANCE',
  renderResolution:{productionReady:false,fallbackPolicy:'none',exactMatchRequired:true,layers:[]}
});
snapshot.createdAt='2026-09-14T08:31:00.000Z';
snapshot.workflow.status='ready-to-quote';
snapshot.workflow.owner=null;
snapshot.workflow.lastUpdatedAt='2026-09-14T08:31:00.000Z';
snapshot.catalogue.schemaVersion='0.23.0';
snapshot.catalogue.revision='MERGED-RANGER-GOVERNED';
snapshot.project={id:'P4X4-PROJ-PROVENANCE',revisionId:'R0026',revisionNumber:26,savedAt:'2026-09-14T09:12:00.000Z',source:'merged-sales-queue-submit',projectVersion:26};
const before=JSON.stringify(snapshot);
const model=receipt.build(snapshot,{mode:'quote',projectId:'P4X4-PROJ-PROVENANCE',revisionId:'R0026',queueReference:'P4X4-Q-R0026',handoffWorkflowStatus:'needs-fitment-review'});
assert.equal(JSON.stringify(snapshot),before,'receipt provenance derivation must not mutate persisted revision');
assert.equal(model.schemaVersion,'0.26.29');
assert.equal(model.workflowStatus,'ready-to-quote','top-level legacy workflowStatus must remain the saved revision workflow, not quote outcome');
assert.equal(model.handoffStatus,'needs-fitment-review','quote outcome must be separate from saved revision workflow');
assert.equal(model.queueReference,'P4X4-Q-R0026');
assert.equal(model.provenance.snapshotSource,'persisted-revision');
assert.equal(model.provenance.handoffSource,'handoff-result-context');
assert.equal(model.provenance.snapshot.schemaVersion,'0.12.0');
assert.equal(model.provenance.snapshot.channel,'web-configurator-merged');
assert.equal(model.provenance.project.savedAt,'2026-09-14T09:12:00.000Z');
assert.equal(model.provenance.project.source,'merged-sales-queue-submit');
assert.equal(model.provenance.project.revisionNumber,26);
assert.equal(model.provenance.project.projectVersion,26);
assert.equal(model.provenance.catalogue.revision,'MERGED-RANGER-GOVERNED');
assert.equal(model.provenance.catalogue.schemaVersion,'0.23.0');
assert.equal(model.provenance.contract.version,'0.12.0');
assert.equal(model.provenance.contract.createEndpoint,'POST /api/v1/builds');
assert.equal(model.provenance.revisionWorkflow.status,'ready-to-quote');
assert.equal(model.provenance.handoff.status,'needs-fitment-review');
// Caller-owned persisted metadata can change later without changing the already-built receipt.
snapshot.project.savedAt='2099-01-01T00:00:00.000Z';
snapshot.workflow.status='mutated-later';
snapshot.catalogue.revision='MUTATED-LATER';
snapshot.contract.version='99.0.0';
assert.equal(model.provenance.project.savedAt,'2026-09-14T09:12:00.000Z');
assert.equal(model.provenance.revisionWorkflow.status,'ready-to-quote');
assert.equal(model.provenance.catalogue.revision,'MERGED-RANGER-GOVERNED');
assert.equal(model.provenance.contract.version,'0.12.0');
// Legacy caller field is accepted as handoff context but still cannot overwrite persisted revision workflow.
const legacy=contract.buildSnapshot({data,selectedProducts:[steps],renderResolution:{productionReady:false,layers:[]}});
legacy.workflow.status='pricing-incomplete';
const legacyModel=receipt.build(legacy,{mode:'quote',workflowStatus:'new'});
assert.equal(legacyModel.workflowStatus,'pricing-incomplete');
assert.equal(legacyModel.handoffStatus,'new');
// Save receipt has no fabricated handoff state.
const saved=receipt.build(legacy,{mode:'save'});
assert.equal(saved.handoffStatus,null);
assert.equal(saved.provenance.handoffSource,'none');
const root=path.join(__dirname,'..');
const source=fs.readFileSync(path.join(root,'customer-handoff-receipt.js'),'utf8');
const app=fs.readFileSync(path.join(root,'merged-app.js'),'utf8');
const css=fs.readFileSync(path.join(root,'merged.css'),'utf8');
assert.match(source,/function provenanceDetail\(snapshot=\{\},context=\{\}\)/);
const start=source.indexOf('function provenanceDetail(snapshot={},context={})'),end=source.indexOf('\n  function massDetail(',start);
assert(start>=0&&end>start,'persisted provenance model must exist');
const block=source.slice(start,end);
assert.doesNotMatch(block,/products\(|current\(|catalogue-store|backend|fetch\(|saveProject|createBuild|createProjectShare|resolveRenderStack/,'provenance model must not refresh current state or own backend/catalogue writes');
assert.match(app,/function renderReceiptRevisionProvenance\(/);
assert.match(app,/REVISION PROVENANCE · LOCKED/);
assert.match(app,/Quote\/share outcome is shown separately and never replaces the workflow state stored on the immutable revision/);
assert.match(app,/model\.handoffStatus\|\|'status-pending'/,'quote receipt pill must use handoff outcome status');
assert.match(app,/handoffWorkflowStatus:review\.mode==='quote'\?result\?\.workflow\?\.status:null/,'runtime must pass queue result as handoff context, not persisted revision workflow');
assert.match(app,/\$\{renderReceiptRevisionProvenance\(model\)\}\$\{renderReceiptShareAccess\(model,runtime\)\}/);
const renderStart=app.indexOf('function renderReceiptRevisionProvenance('),renderEnd=app.indexOf('\nfunction renderHandoffReceipt',renderStart);
assert(renderStart>=0&&renderEnd>renderStart,'provenance renderer must exist');
assert.doesNotMatch(app.slice(renderStart,renderEnd),/products\(|current\(|selectedProducts|resolveRenderStack|saveProject|createBuild|createProjectShare/,'provenance rendering must remain presentation-only');
assert.match(css,/\.merge-receipt-provenance/);
assert.match(css,/\.merge-receipt-provenance-grid/);
assert.doesNotMatch(app,/fallbackPolicy\s*:\s*['\"]approx/i,'WF1 must never add approximate production visual fallback');
console.log('WF1 Alpha 26 persisted receipt revision provenance + handoff-status separation: PASS');
