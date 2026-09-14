'use strict';
const assert=require('node:assert/strict');
const {createApp}=require('../server/server');
(async()=>{
  const actor={actorId:'wf4-boundary-http',displayName:'WF4 Boundary HTTP',role:'admin'};
  const {server,db}=createApp({dbFile:':memory:',seed:false});
  db.syncVisualGovernanceRegistry({vehicleId:'nissan-y62-warrior-2025'},{actor});
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
  const base=`http://127.0.0.1:${server.address().port}`;
  const adminHeaders={'content-type':'application/json','x-pro4x4-role':'admin','x-pro4x4-actor':actor.actorId,'x-pro4x4-name':actor.displayName};
  try{
    const f34=db.getRenderAsset('Y62-F34-V1-MASTER'),tampered=JSON.parse(JSON.stringify(f34));
    tampered.referencePack.manifestSha256='0'.repeat(64);
    let r=await fetch(`${base}/api/v1/staff/render-assets/${encodeURIComponent(f34.assetId)}`,{method:'PUT',headers:adminHeaders,body:JSON.stringify(tampered)});
    assert.equal(r.status,409,'generic staff render-asset route must fail closed on governance-managed metadata');
    let body=await r.json();assert.equal(body.code,'governance_metadata_protected');
    assert.equal(db.getRenderAsset(f34.assetId).referencePack.manifestSha256,f34.referencePack.manifestSha256,'blocked HTTP write must not persist');

    const refId=f34.referencePack.requiredReferenceIds[0];
    r=await fetch(`${base}/api/v1/staff/render-assets/${encodeURIComponent(refId)}/provenance-attestation`,{method:'POST',headers:adminHeaders,body:'{}'});
    assert.equal(r.status,200,'dedicated provenance workflow remains writable for fitment/admin');
    body=await r.json();assert.equal(body.freshness,'current');assert.equal(body.asset.status,'reference-only');assert.equal(body.asset.referenceEvidence.productionEligible,false);

    r=await fetch(`${base}/api/v1/staff/render-assets/${encodeURIComponent(refId)}/provenance-attestation`,{method:'POST',headers:{'content-type':'application/json','x-pro4x4-role':'sales','x-pro4x4-actor':'wf4-boundary-sales'},body:'{}'});
    assert.equal(r.status,403,'sales remains inspection-only for provenance attestation');

    r=await fetch(`${base}/api/v1/staff/audit?entityType=render-asset&entityId=${encodeURIComponent(f34.assetId)}&action=visual-governance.protected-write.blocked`,{headers:adminHeaders});
    assert.equal(r.status,200);const audit=await r.json();assert(audit.some(e=>(e.metadata?.changedPaths||[]).includes('referencePack')),'HTTP bypass attempt must be visible in persisted audit history');
    assert.equal(db.listRenderAssets({vehicleId:'nissan-y62-warrior-2025'}).filter(x=>x.status==='production-ready').length,0);
    console.log(JSON.stringify({gate:'wf4-governance-write-boundary-endpoint-alpha26',genericProtectedWriteHttp409:true,dedicatedProvenanceEndpoint:true,salesMutationDenied:true,blockedWriteAudited:true,visualPromotion:false,status:'pass'},null,2));
  }finally{await new Promise(resolve=>server.close(resolve));db.close()}
})().catch(e=>{console.error(e);process.exit(1)});
