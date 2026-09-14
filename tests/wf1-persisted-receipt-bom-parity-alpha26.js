'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const receipt=require('../customer-handoff-receipt.js');
const contract=require('../merged-project-contract.js');

// Governed catalogue fixture only: receipt data must be copied from the immutable snapshot,
// while the optional catalogue inspection route may only use the existing product id.
global.window=global;
require('../data-ranger.js');
const data=global.RANGER_DATA;
const products=data.accessories;
const bash=products.find(p=>p.id==='oa-lower-bash-ranger');
const step=products.find(p=>p.id==='mcc-309bsbk');
assert(bash&&step,'governed Ranger fixtures must exist');

const snapshot=contract.buildSnapshot({
  data,
  selectedProducts:[bash,step],
  lead:{name:'WF1 BOM parity',phone:'0400000000'},
  reference:'P4X4-WF1-BOM-PARITY',
  renderResolution:{productionReady:false,fallbackPolicy:'none',exactMatchRequired:true,layers:[{layerId:'base',state:'missing',reason:'approved-master-not-available'}]}
});
snapshot.project={id:'P4X4-PROJ-BOM',revisionId:'R0020',revisionNumber:20,savedAt:'2026-09-14T04:00:00.000Z',source:'merged-sales-queue-submit',projectVersion:20};
const before=JSON.stringify(snapshot);
const model=receipt.build(snapshot,{mode:'quote',queueReference:'P4X4-Q-R0020',workflowStatus:'needs-fitment-review'});
assert.equal(JSON.stringify(snapshot),before,'receipt BOM derivation must not mutate persisted revision input');
assert.equal(model.schemaVersion,'0.26.29');
assert.equal(model.catalogueRevision,snapshot.catalogue.revision);
assert.equal(model.bom.snapshotSource,'persisted-revision.selections');
assert.equal(model.bom.itemCount,2);
assert.equal(model.bom.rows.length,2);
assert.equal(model.bom.knownSubtotal,snapshot.pricing.knownSubtotal);

const bashRow=model.bom.rows.find(row=>row.id===bash.id);
assert.deepEqual({name:bashRow.name,vendor:bashRow.vendor,sku:bashRow.sku,category:bashRow.category},{name:bash.name,vendor:bash.brand,sku:bash.sku,category:bash.category});
assert.equal(bashRow.pricing.parts,420);
assert.equal(bashRow.pricing.labour,null);
assert.equal(bashRow.knownValue,420);
assert.deepEqual(bashRow.missingRequired,['labour'],'saved Ranger pricing requirement must remain explicitly TBC');
const stepRow=model.bom.rows.find(row=>row.id===step.id);
assert.equal(stepRow.knownValue,1480);
assert.deepEqual(stepRow.missingRequired,[]);
assert.equal(model.bom.knownSubtotal,1900);
assert.equal(model.bom.missingRequiredCount,1);

// The presentation model must remain pinned even if caller-owned snapshot objects later change.
snapshot.selections[0].name='MUTATED AFTER RECEIPT';
snapshot.selections[0].brand='MUTATED VENDOR';
snapshot.selections[0].sku='MUTATED-SKU';
snapshot.selections[0].pricing.parts=999999;
assert.equal(bashRow.name,bash.name);
assert.equal(bashRow.vendor,bash.brand);
assert.equal(bashRow.sku,bash.sku);
assert.equal(bashRow.pricing.parts,420);

const root=path.join(__dirname,'..');
const app=fs.readFileSync(path.join(root,'merged-app.js'),'utf8');
const css=fs.readFileSync(path.join(root,'merged.css'),'utf8');
assert.match(app,/function renderReceiptBom\(/);
assert.match(app,/EXACT SAVED BOM ON THIS REVISION/);
assert.match(app,/persisted-revision\.selections/);
assert.match(app,/data-receipt-bom-product=/);
assert.match(app,/INSPECT CURRENT CATALOGUE/);
assert.match(app,/Catalogue inspection is non-mutating/);
assert.match(app,/function navigateFromHandoffReceiptBom\(/);
assert.match(app,/closeHandoffReceipt\(\);const moved=focusProductConstraint\(/,'receipt BOM inspection must leave receipt context before entering current catalogue context');
assert.match(app,/this catalogue inspection cannot alter the submitted BOM\./);
assert.match(css,/\.merge-receipt-bom-row/);
assert.match(css,/\.merge-receipt-bom-inspect/);

const start=app.indexOf('function navigateFromHandoffReceiptBom('),end=app.indexOf('\nfunction renderReceiptBom(',start);
assert(start>=0&&end>start,'receipt BOM inspection navigation block must exist');
const navBlock=app.slice(start,end);
assert.doesNotMatch(navBlock,/state\.selected\.(add|delete|clear)/,'receipt BOM inspection must never mutate selected products');
assert.doesNotMatch(navBlock,/saveProject|createBuild|createProjectShare|resolveRenderStack/,'receipt BOM inspection must not write project, quote, share, or render state');
assert.doesNotMatch(navBlock,/\.price\s*=|\.sku\s*=|\.fitment\s*=/,'receipt BOM inspection must not become catalogue or fitment ownership');

console.log('WF1 Alpha 26 persisted receipt BOM parity + non-mutating catalogue inspection: PASS');
