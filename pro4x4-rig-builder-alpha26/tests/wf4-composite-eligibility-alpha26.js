'use strict';
const assert=require('node:assert/strict');
const {RigDatabase}=require('../server/database');
const composite=require('../composite-eligibility');
const actor={actorId:'wf4-composite-admin',displayName:'WF4 Composite Admin',role:'admin'};
const db=new RigDatabase(':memory:');
const object=(sha,key)=>({checksumSha256:sha,objectKey:key,mimeType:'image/png',width:1672,height:615,hasAlpha:true,transparencyVerified:true,sizeBytes:2048});
function approve(asset,state){return {...asset,status:'production-ready',provenance:{...(asset.provenance||{}),sourceType:'pro4x4-original',licenceStatus:'owned',licenceNote:'Synthetic WF4 composite-governance regression fixture only.'},cameraGeometry:{...(asset.cameraGeometry||{}),matched:true,notes:'Synthetic locked-camera fixture.'},governance:{...(asset.governance||{}),state,reviewedBy:actor.displayName,reviewedAt:'2026-09-14T09:10:00+09:30'},approval:{...(asset.approval||{}),state:'approved-production',approvedBy:actor.displayName,approvedAt:'2026-09-14T09:10:00+09:30'}}}
try{
  const sync=db.syncVisualGovernanceRegistry({vehicleId:'nissan-y62-warrior-2025'},{actor});
  assert(sync.compositeMetadataUpdatedCount>=1,'visual governance sync must persist composite bindings on governed non-base visual layers');
  let front=db.listRenderAssets({vehicleId:'nissan-y62-warrior-2025',viewId:'front34'}).find(x=>x.layerId==='front'&&x.exactSku==='Y62 S5 GEN-X');
  assert(front,'SLX front product-layer fixture missing');
  assert.equal(front.assetClass,'product-layer');
  assert.equal(front.compositeEligibility?.policy,composite.policy);
  assert.equal(front.compositeEligibility?.canonicalMasterAssetId,'Y62-F34-V1-MASTER');
  assert.equal(front.compositeEligibility?.exactSku,'Y62 S5 GEN-X');
  assert.deepEqual(front.compositeEligibility?.requiredLayerGovernanceStates,['layer-approved','production-live']);
  assert.equal(composite.bindingProblems(front,front.compositeEligibility,require('../y62-canonical-briefs').briefs).length,0);

  let base=db.listRenderAssets({vehicleId:'nissan-y62-warrior-2025',viewId:'front34'}).find(x=>x.assetId==='Y62-FRONT34-01-BASE');
  db.attachAssetObject(base.assetId,object('1'.repeat(64),'sha256/11/base.png'),{actor});
  base=approve(db.getRenderAsset(base.assetId),'master-approved');db.upsertRenderAsset(base,{actor});
  db.attachAssetObject(front.assetId,object('2'.repeat(64),'sha256/22/front.png'),{actor});
  front=approve(db.getRenderAsset(front.assetId),'layer-approved');db.upsertRenderAsset(front,{actor});

  const onlyLayer=db.resolveProductionRenderStack({vehicleId:'nissan-y62-warrior-2025',viewId:'front34',requirements:[{layerId:'front',exactSku:'Y62 S5 GEN-X'}]});
  assert.equal(onlyLayer.layers[0].state,'missing');
  assert.equal(onlyLayer.layers[0].reason,'canonical-master-required-for-composite','approved product layer must never resolve without a governed base master in the same requested stack');
  assert.equal(onlyLayer.layers[0].binaryUrl,null);

  const stack=db.resolveProductionRenderStack({vehicleId:'nissan-y62-warrior-2025',viewId:'front34',requirements:[{layerId:'base',exactSku:null},{layerId:'front',exactSku:'Y62 S5 GEN-X'}]});
  assert.equal(stack.visualPolicy,composite.policy);
  assert.equal(stack.productionReady,true);
  assert.equal(stack.compositeEligible,true);
  assert.equal(stack.layers.find(x=>x.layerId==='base').state,'available');
  assert.equal(stack.layers.find(x=>x.layerId==='front').state,'available');
  assert.equal(stack.layers.find(x=>x.layerId==='front').compositeEligibility?.eligible,true);

  const tampered=db.getRenderAsset(front.assetId);tampered.compositeEligibility={...tampered.compositeEligibility,canonicalMasterAssetId:'Y62-R34-V1-MASTER'};
  db.db.prepare('UPDATE render_assets SET payload_json=? WHERE asset_id=?').run(JSON.stringify(tampered),tampered.assetId);
  const blocked=db.resolveProductionRenderStack({vehicleId:'nissan-y62-warrior-2025',viewId:'front34',requirements:[{layerId:'base',exactSku:null},{layerId:'front',exactSku:'Y62 S5 GEN-X'}]});
  const blockedLayer=blocked.layers.find(x=>x.layerId==='front');assert.equal(blockedLayer.state,'missing');assert.equal(blockedLayer.reason,'composite-binding-invalid');assert.equal(blocked.productionReady,false);
  const repaired=db.syncVisualGovernanceRegistry({vehicleId:'nissan-y62-warrior-2025'},{actor});assert(repaired.compositeMetadataUpdated.includes(front.assetId),'sync must repair drifted static composite binding');
  const restored=db.getRenderAsset(front.assetId);assert.equal(restored.status,'production-ready','binding repair must not alter production state');assert.equal(restored.governance.state,'layer-approved','binding repair must not alter reviewer state');assert.equal(restored.compositeEligibility.canonicalMasterAssetId,'Y62-F34-V1-MASTER');

  console.log(JSON.stringify({gate:'wf4-composite-eligibility-alpha26',policy:composite.policy,persistedLayerBinding:true,canonicalMasterBinding:front.compositeEligibility.canonicalMasterAssetId,approvedLayerAloneCustomerVisible:false,approvedMasterPlusLayerComposite:true,tamperedBindingFailClosed:true,syncRepairsBindingWithoutPromotion:true,visualPromotionFromSync:false,status:'pass'},null,2));
} finally {db.close()}
