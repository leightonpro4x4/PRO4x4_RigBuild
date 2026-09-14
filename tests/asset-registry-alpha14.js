'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {createApp}=require('../server/server');
(async()=>{
  const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'p4x4-a14-assets-'));
  const {server,db}=createApp({dbFile:path.join(tmp,'test.sqlite'),config:{env:'development',allowPrototypeHeaders:true,allowDevLogin:true}});
  await new Promise(r=>server.listen(0,'127.0.0.1',r));const base=`http://127.0.0.1:${server.address().port}`;
  const headers={'content-type':'application/json','x-pro4x4-role':'admin','x-pro4x4-actor':'asset-test-admin','x-pro4x4-name':'Asset Test'};
  const req=async(method,url,body)=>{const r=await fetch(base+url,{method,headers,body:body===undefined?undefined:JSON.stringify(body)});let data=null;try{data=await r.json()}catch{}return {r,data}};
  try{
    let x=await req('GET','/api/v1/ready');assert.equal(x.r.status,200);assert.ok(x.data.migrationVersion>=5);
    x=await req('GET','/api/v1/staff/render-assets?vehicleId=nissan-y62-warrior-2025');assert.equal(x.r.status,200);assert.equal(x.data.length,22);
    const counts=x.data.reduce((m,a)=>(m[a.status]=(m[a.status]||0)+1,m),{});assert.deepEqual(counts,{'reference-only':7,'asset-needed':13,'blocked-fitment':2});
    const candidate={...x.data.find(a=>a.status==='asset-needed'),status:'production-ready'};
    x=await req('PUT',`/api/v1/staff/render-assets/${encodeURIComponent(candidate.assetId)}`,candidate);assert.equal(x.r.status,422);assert.equal(x.data.code,'asset_gate_blocked');
    candidate.status='candidate';candidate.provenance={...candidate.provenance,licenceStatus:'owned',sourceType:'pro4x4-original'};candidate.file={...candidate.file,checksumSha256:'a'.repeat(64),mimeType:'image/png',hasAlpha:true,width:1672,height:615};candidate.cameraGeometry={...candidate.cameraGeometry,matched:true};
    x=await req('PUT',`/api/v1/staff/render-assets/${encodeURIComponent(candidate.assetId)}`,candidate);assert.equal(x.r.status,200);assert.equal(x.data.status,'candidate');
    candidate.status='production-ready';candidate.governance={state:candidate.layerId==='base'||candidate.layerId==='wheels'?'master-approved':'layer-approved'};candidate.approval={...candidate.approval,state:'approved-production',approvedBy:'Asset Test',approvedAt:new Date().toISOString()};
    x=await req('PUT',`/api/v1/staff/render-assets/${encodeURIComponent(candidate.assetId)}`,candidate);assert.equal(x.r.status,422);assert.equal(x.data.code,'asset_gate_blocked');
    x=await req('GET','/api/v1/admin/backup');assert.equal(x.r.status,200);assert.equal(x.data.renderAssets.length,22);
    x=await req('GET','/api/v1/staff/audit?entityType=render-asset&limit=100');assert.equal(x.r.status,200);assert.ok(x.data.length>=23);
    console.log(JSON.stringify({alpha:14,assets:22,baseline:counts,productionGateReject:true,candidatePromotion:true,productionApprovalRequiresVault:true,backupIncludesAssets:true,migrationVersion:5,status:'pass'},null,2));
  }finally{await new Promise(r=>server.close(r));db.close();fs.rmSync(tmp,{recursive:true,force:true})}
})().catch(e=>{console.error(e);process.exit(1)});
