'use strict';
const assert=require('node:assert/strict');
const {createApp}=require('../server/server');
(async()=>{
  const actor={actorId:'wf4-reference-review-http',displayName:'WF4 Reference Review HTTP',role:'admin'};
  const {server,db}=createApp({dbFile:':memory:',seed:false});
  db.syncVisualGovernanceRegistry({vehicleId:'nissan-y62-warrior-2025'},{actor});
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
  const base=`http://127.0.0.1:${server.address().port}`,adminHeaders={'content-type':'application/json','x-pro4x4-role':'admin','x-pro4x4-actor':actor.actorId,'x-pro4x4-name':actor.displayName};
  try{
    const refId='OWNER-Y62-F34-01';
    let r=await fetch(`${base}/api/v1/staff/render-assets/${encodeURIComponent(refId)}/reference-review-decision`,{method:'POST',headers:adminHeaders,body:JSON.stringify({decision:'returned',notes:'Endpoint workflow verification.'})});
    assert.equal(r.status,200);let body=await r.json();assert.equal(body.decision.decision,'returned');assert.equal(body.asset.governance.state,'reference-only');assert.equal(body.asset.referenceEvidence.productionEligible,false);
    r=await fetch(`${base}/api/v1/staff/render-assets/${encodeURIComponent(refId)}/reference-review-decision`,{method:'POST',headers:adminHeaders,body:JSON.stringify({decision:'approved',notes:'Endpoint re-approval verification.'})});
    assert.equal(r.status,200);body=await r.json();assert.equal(body.decision.decision,'approved');assert.equal(body.freshness,'current');assert.equal(body.asset.governance.state,'reference-approved');
    r=await fetch(`${base}/api/v1/staff/render-assets/${encodeURIComponent(refId)}/reference-review-decision`,{method:'POST',headers:{'content-type':'application/json','x-pro4x4-role':'sales','x-pro4x4-actor':'wf4-reference-review-sales'},body:JSON.stringify({decision:'returned'})});
    assert.equal(r.status,403,'sales remains inspection-only');
    const tampered=JSON.parse(JSON.stringify(db.getRenderAsset(refId)));tampered.referenceReviewDecision={...tampered.referenceReviewDecision,decision:'returned'};
    r=await fetch(`${base}/api/v1/staff/render-assets/${encodeURIComponent(refId)}`,{method:'PUT',headers:adminHeaders,body:JSON.stringify(tampered)});assert.equal(r.status,409);body=await r.json();assert.equal(body.code,'governance_metadata_protected');
    assert.equal(db.listRenderAssets({vehicleId:'nissan-y62-warrior-2025'}).filter(x=>x.status==='production-ready').length,0);
    console.log(JSON.stringify({gate:'wf4-reference-review-decision-endpoint-alpha26',dedicatedDecisionEndpoint:true,returnAndApprove:true,salesMutationDenied:true,genericDecisionTamperHttp409:true,visualPromotion:false,status:'pass'},null,2));
  }finally{await new Promise(resolve=>server.close(resolve));db.close()}
})().catch(e=>{console.error(e);process.exit(1)});
