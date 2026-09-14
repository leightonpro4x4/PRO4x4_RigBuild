'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const receipt=require('../customer-handoff-receipt.js');
const nav=require('../customer-handoff-requirement-nav.js');
const contract=require('../merged-project-contract.js');

global.window=global;
require('../data-ranger.js');
const data=global.RANGER_DATA;
const products=data.accessories;
const bash=products.find(p=>p.id==='oa-lower-bash-ranger');
assert(bash,'governed Ranger lower-bash fixture must exist');

const snap=contract.buildSnapshot({
  data,
  selectedProducts:[bash],
  lead:{name:'WF1 Receipt correction',phone:'0400000000'},
  reference:'P4X4-WF1-RECEIPT-CORRECTION',
  renderResolution:{productionReady:false,fallbackPolicy:'none',exactMatchRequired:true,layers:[{layerId:'base',state:'missing',reason:'approved-master-not-available'}]}
});
snap.project={id:'P4X4-PROJ-RECEIPT-CORR',revisionId:'R0019',revisionNumber:19,savedAt:'2026-09-14T03:30:00.000Z',source:'merged-sales-queue-submit',projectVersion:19};

const snapBefore=JSON.stringify(snap);
const model=receipt.build(snap,{mode:'quote',queueReference:'P4X4-Q-R0019',workflowStatus:'needs-fitment-review'});
assert.equal(JSON.stringify(snap),snapBefore,'receipt presentation model must not mutate persisted revision input');
assert.equal(model.gates.snapshotSource,'persisted-revision.gates');
assert.equal(model.gates.rows.length,1,'exact unresolved any-of gate must survive onto persisted receipt model');
assert.equal(model.gates.rows[0].type,'dependency-any-of');
assert.deepEqual(model.gates.rows[0].requiredAnyOf,['oa-predator','oa-toro-ranger']);
assert.equal(model.gates.setupRows.length,1,'saved product manufacturer conditions must remain explicit as setup checks');
assert.equal(model.gates.setupRows[0].productId,'oa-lower-bash-ranger');

const actions=nav.gateActions(model.gates.rows[0],products);
assert(actions.some(a=>a.role==='source'&&a.productId==='oa-lower-bash-ranger'));
assert(actions.some(a=>a.role==='option'&&a.productId==='oa-predator'));
assert(actions.some(a=>a.role==='option'&&a.productId==='oa-toro-ranger'));
assert(actions.every(a=>products.some(p=>p.id===a.productId)),'receipt correction targets may resolve only to governed catalogue products');
const setupActions=nav.setupActions(model.gates.setupRows[0],products);
assert.equal(setupActions.length,1);
assert.equal(setupActions[0].productId,'oa-lower-bash-ranger');

const root=path.join(__dirname,'..');
const app=fs.readFileSync(path.join(root,'merged-app.js'),'utf8');
const css=fs.readFileSync(path.join(root,'merged.css'),'utf8');
assert.match(app,/function receiptRequirementActions\(/);
assert.match(app,/data-receipt-requirement-product=/);
assert.match(app,/function navigateFromHandoffReceiptRequirement\(/);
assert.match(app,/OPEN REQUIREMENTS ON THIS SAVED REVISION/);
assert.match(app,/Source: .*persisted-revision\.gates/);
assert.match(app,/The submitted quote remains pinned to .*editing here creates a new revision and does not alter the queued quote\./);
assert.match(app,/The existing share remains pinned to .*save a new revision and create a new share if you want recipients to see changes\./);
assert.match(app,/remains immutable; any correction you make now will be saved as a new revision\./);
assert.match(css,/\.merge-receipt-requirements/);
assert.match(css,/\.merge-receipt-requirement-note/);

const start=app.indexOf('function navigateFromHandoffReceiptRequirement('),end=app.indexOf('\nfunction renderHandoffReview(',start);
assert(start>=0&&end>start,'receipt correction navigation block must exist before review rendering');
const block=app.slice(start,end);
assert.match(block,/closeHandoffReceipt\(\);const moved=focusProductConstraint\(/,'receipt must be closed before returning to mutable catalogue context');
assert.doesNotMatch(block,/state\.selected\.(add|delete|clear)/,'receipt correction navigation must not mutate selected BOM');
assert.doesNotMatch(block,/saveProject|createBuild|createProjectShare|resolveRenderStack/,'receipt correction navigation must not write project, quote, share, or render state');
assert.doesNotMatch(block,/\.price\s*=|\.sku\s*=|\.fitment\s*=/,'receipt correction navigation must not become catalogue or fitment ownership');

console.log('WF1 Alpha 26 persisted receipt requirement detail + correction navigation: PASS');
