'use strict';
const assert=require('node:assert/strict');
const {createApp}=require('../server/server');
(async()=>{
  const actor={actorId:'wf4-source-gap-http',displayName:'WF4 Source Gap HTTP',role:'admin'},vehicleId='nissan-y62-warrior-2025';
  const {server,db}=createApp({dbFile:':memory:',seed:false});
  db.syncVisualGovernanceRegistry({vehicleId},{actor});
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
  const base=`http://127.0.0.1:${server.address().port}`,headers={'content-type':'application/json','x-pro4x4-role':'admin','x-pro4x4-actor':actor.actorId,'x-pro4x4-name':actor.displayName},id='Y62-SIDE-V1-MASTER';
  try{
    let r=await fetch(`${base}/api/v1/staff/render-assets/${encodeURIComponent(id)}/source-gap-resolution`,{method:'POST',headers,body:JSON.stringify({decision:'returned',notes:'Endpoint verifies dedicated source-gap authority.'})});
    assert.equal(r.status,200);let body=await r.json();assert.equal(body.resolution.decision,'returned');assert.equal(body.freshness,'current');assert.equal(body.asset.canonicalSourceGapResolution.productionEligible,false);
    r=await fetch(`${base}/api/v1/staff/render-assets/${encodeURIComponent(id)}/source-gap-resolution`,{method:'POST',headers,body:JSON.stringify({decision:'approved',resolutionMethod:'reviewed-reconstruction',notes:'Should remain blocked.'})});
    assert.equal(r.status,422);body=await r.json();assert.equal(body.code,'canonical_source_gap_resolution_blocked');
    r=await fetch(`${base}/api/v1/staff/render-assets/${encodeURIComponent(id)}/source-gap-resolution`,{method:'POST',headers:{'content-type':'application/json','x-pro4x4-role':'sales','x-pro4x4-actor':'wf4-source-gap-sales'},body:JSON.stringify({decision:'returned',notes:'not allowed'})});
    assert.equal(r.status,403,'sales remains inspection-only');
    const tampered=JSON.parse(JSON.stringify(db.getRenderAsset(id)));tampered.canonicalSourceGapResolution={...tampered.canonicalSourceGapResolution,decision:'approved'};
    r=await fetch(`${base}/api/v1/staff/render-assets/${encodeURIComponent(id)}`,{method:'PUT',headers,body:JSON.stringify(tampered)});assert.equal(r.status,409);body=await r.json();assert.equal(body.code,'governance_metadata_protected');
    assert.equal(db.listRenderAssets({vehicleId}).filter(x=>x.status==='production-ready').length,0);
    console.log(JSON.stringify({gate:'wf4-canonical-source-gap-resolution-endpoint-alpha26',dedicatedEndpoint:true,returnDecision:true,approvalFailsClosed:true,salesMutationDenied:true,genericTamperHttp409:true,visualPromotion:false,status:'pass'},null,2));
  } finally {await new Promise(resolve=>server.close(resolve));db.close()}
})().catch(e=>{console.error(e);process.exit(1)});
