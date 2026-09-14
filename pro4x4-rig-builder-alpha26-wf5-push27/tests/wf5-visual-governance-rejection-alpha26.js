'use strict';
const assert=require('node:assert/strict');
const vg=require('../visual-governance');
const {RigDatabase}=require('../server/database');

// Pure policy guard: these governance states can never be customer-production eligible.
assert.equal(vg.productionEligible({assetClass:'reference',status:'reference-only',governance:{state:'reference-approved'}}),false);
assert.equal(vg.productionEligible({assetClass:'canonical-master',status:'candidate',governance:{state:'master-draft'}}),false);
assert.equal(vg.productionEligible({assetClass:'product-layer',status:'candidate',governance:{state:'layer-draft'}}),false);
assert.equal(vg.productionEligible({assetClass:'canonical-master',status:'production-ready',governance:{state:'master-approved'}}),true);
assert.equal(vg.productionEligible({assetClass:'product-layer',status:'production-ready',governance:{state:'layer-approved'}}),true);

const db=new RigDatabase(':memory:');
try{
  // Reference-only canonical base stays missing.
  let r=db.resolveProductionRenderStack({vehicleId:'nissan-y62-warrior-2025',viewId:'front34',requirements:[{layerId:'base',exactSku:null,state:{paintId:'black-obsidian'},stateKey:'paint:black-obsidian'}]});
  assert.equal(r.productionReady,false);
  assert.equal(r.layers[0].state,'missing');
  assert.equal(r.layers[0].reason,'reference-only-not-production');

  // A staged master-draft candidate remains customer-missing even when its registry slot exists.
  let base=db.getRenderAsset('Y62-FRONT34-01-BASE');
  db.upsertRenderAsset({...base,status:'candidate',assetClass:'canonical-master',governance:{...(base.governance||{}),state:'master-draft'}},{actor:{actorId:'wf5',displayName:'WF5',role:'admin'}});
  r=db.resolveProductionRenderStack({vehicleId:'nissan-y62-warrior-2025',viewId:'front34',requirements:[{layerId:'base',exactSku:null,state:{paintId:'black-obsidian'},stateKey:'paint:black-obsidian'}]});
  assert.equal(r.layers[0].state,'missing');
  assert.equal(r.layers[0].reason,'candidate-not-approved');
  assert.equal(r.layers[0].binaryUrl,null);

  // A staged product layer-draft also remains customer-missing.
  let layer=db.getRenderAsset('Y62-FRONT34-05-ELECTRICAL-FRONT');
  db.upsertRenderAsset({...layer,status:'candidate',assetClass:'product-layer',governance:{...(layer.governance||{}),state:'layer-draft'}},{actor:{actorId:'wf5',displayName:'WF5',role:'admin'}});
  r=db.resolveProductionRenderStack({vehicleId:'nissan-y62-warrior-2025',viewId:'front34',requirements:[{layerId:'electrical-front',exactSku:'AE4705B + BB-015P',state:{},stateKey:null}]});
  assert.equal(r.layers[0].state,'missing');
  assert.equal(r.layers[0].reason,'candidate-not-approved');
  assert.equal(r.layers[0].binaryUrl,null);

  // Known blocked fitment stays blocked; resolver never substitutes a different asset.
  r=db.resolveProductionRenderStack({vehicleId:'nissan-y62-warrior-2025',viewId:'front34',requirements:[{layerId:'sides',exactSku:'PB-NN-003',state:{},stateKey:null}]});
  assert.equal(r.layers[0].state,'blocked');
  assert.equal(r.layers[0].binaryUrl,null);

  // Unsupported exact SKU cannot fall back to a visually similar registered layer.
  r=db.resolveProductionRenderStack({vehicleId:'nissan-y62-warrior-2025',viewId:'front34',requirements:[{layerId:'front',exactSku:'UNSUPPORTED-WF5-SKU',state:{},stateKey:null}]});
  assert.equal(r.layers[0].state,'missing');
  assert.equal(r.layers[0].binaryUrl,null);
  assert.equal(r.fallbackPolicy,'none');
} finally { db.close(); }

console.log(JSON.stringify({gate:'wf5-visual-governance-rejection-alpha26',referenceOnlyRejected:true,masterDraftRejected:true,layerDraftRejected:true,blockedFitmentBlocked:true,unsupportedExactSkuNoFallback:true,status:'pass'},null,2));
