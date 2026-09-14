'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const receipt=require('../customer-handoff-receipt.js');
const contract=require('../merged-project-contract.js');
global.window=global;
require('../data-y62.js');
const data=global.RIG_DATA;
assert.equal(data.vehicle.id,'nissan-y62-warrior-2025','Y62 remains the first production visual milestone fixture');
const product=data.accessories.find(p=>p.id==='scout-rack');
assert(product,'governed Y62 fixture must exist');
const snapshot=contract.buildSnapshot({
  data,
  selectedProducts:[product],
  lead:{name:'WF1 Vehicle State',phone:'0400000000'},
  paintId:'gun-metallic',
  wheelTyreId:'factory-warrior',
  view:'side',
  reference:'P4X4-WF1-VEHICLE-STATE',
  renderResolution:{schemaVersion:'0.22.0',productionReady:false,exactMatchRequired:true,fallbackPolicy:'none',layers:[{layerId:'base',state:'missing',reason:'approved-master-not-available'}]}
});
snapshot.project={id:'P4X4-PROJ-VEHICLE',revisionId:'R0023',revisionNumber:23,savedAt:'2026-09-14T07:00:00.000Z',source:'merged-customer-builder',projectVersion:23};
const before=JSON.stringify(snapshot);
const model=receipt.build(snapshot,{mode:'save',projectId:snapshot.project.id,revisionId:snapshot.project.revisionId});
assert.equal(JSON.stringify(snapshot),before,'receipt vehicle-state derivation must not mutate the persisted revision');
assert.equal(model.schemaVersion,'0.26.29');
assert.equal(model.customerVisualRule,'REFERENCE_BACKED_APPROVED_VISUALS_ONLY');
assert.equal(model.visual.fallbackPolicy,'none');
assert.deepEqual(model.vehicleState,{
  vehicleId:'nissan-y62-warrior-2025',
  paintId:'gun-metallic',
  wheelTyreId:'factory-warrior',
  viewId:'side',
  renderState:{paintId:'gun-metallic',wheelTyreId:'factory-warrior',viewId:'side'},
  visualStateParity:'aligned',
  snapshotSource:'persisted-revision.vehicle',
  renderSnapshotSource:'persisted-revision.render'
});
// Presentation data must remain pinned after caller-owned persisted objects are changed later.
snapshot.vehicle.paint='black-obsidian';
snapshot.vehicle.wheelTyre='aftermarket-pending';
snapshot.vehicle.view='rear34';
snapshot.render.stateVariant.paintId='black-obsidian';
snapshot.render.stateVariant.wheelTyreId='aftermarket-pending';
snapshot.render.view='rear34';
assert.equal(model.vehicleState.paintId,'gun-metallic');
assert.equal(model.vehicleState.wheelTyreId,'factory-warrior');
assert.equal(model.vehicleState.viewId,'side');
assert.equal(model.vehicleState.renderState.paintId,'gun-metallic');
assert.equal(model.vehicleState.visualStateParity,'aligned');

const mismatch=contract.buildSnapshot({data,selectedProducts:[],paintId:'black-obsidian',wheelTyreId:'factory-warrior',view:'front34',renderResolution:{productionReady:false,fallbackPolicy:'none',exactMatchRequired:true,layers:[]}});
mismatch.render.stateVariant.paintId='gun-metallic';
const mismatchModel=receipt.build(mismatch,{mode:'save'});
assert.equal(mismatchModel.vehicleState.visualStateParity,'mismatch','persisted configuration/render mismatch must remain explicit rather than being silently normalized');
assert.equal(mismatchModel.verification.find(x=>x.type==='visual')?.state,'open','a persisted vehicle/render mismatch must never be presented as a clear production visual');
assert.match(mismatchModel.verification.find(x=>x.type==='visual')?.detail||'',/do not agree/);
const incomplete=JSON.parse(JSON.stringify(mismatch));
delete incomplete.render.stateVariant.paintId; delete incomplete.render.stateVariant.wheelTyreId; delete incomplete.render.view;
assert.equal(receipt.build(incomplete,{mode:'save'}).vehicleState.visualStateParity,'incomplete','missing persisted render identifiers must not be backfilled from vehicle defaults');

const root=path.join(__dirname,'..');
const app=fs.readFileSync(path.join(root,'merged-app.js'),'utf8');
const css=fs.readFileSync(path.join(root,'merged.css'),'utf8');
assert.match(app,/function renderReceiptVehicleState\(/);
assert.match(app,/VEHICLE STATE LOCKED TO THIS REVISION/);
assert.match(app,/persisted-revision\.vehicle/);
assert.match(app,/persisted-revision\.render/);
assert.match(app,/Current catalogue labels\/defaults are not consulted or backfilled\./);
assert.match(app,/no substitute visual is permitted\./);
assert.match(app,/STATE MISMATCH · REVIEW REQUIRED/);
assert.match(app,/\$\{renderReceiptShareAccess\(model,runtime\)\}\$\{renderReceiptVehicleState\(model\)\}\$\{renderReceiptMassCompliance\(model\)\}\$\{renderReceiptCustomer\(model\)\}/);
const start=app.indexOf('function renderReceiptVehicleState('),end=app.indexOf('\nasync function copyHandoffReceiptShare',start);
assert(start>=0&&end>start,'receipt vehicle-state renderer block must exist');
const renderBlock=app.slice(start,end);
assert.doesNotMatch(renderBlock,/current\(|products\(|vehicles\[|catalogueNav|leadFromForm|saveProject|createBuild|createProjectShare|resolveRenderStack/,'persisted vehicle-state receipt must not refresh from mutable catalogue/backend state or write project state');
assert.match(css,/\.merge-receipt-vehicle-state/);
assert.match(css,/\.merge-receipt-vehicle-parity\.mismatch/);
console.log('WF1 Alpha 26 persisted receipt vehicle-state parity: PASS');
