'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {createApp}=require('../server/server');

(async()=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'p4x4-a26-wf4-'));
  const app=createApp({config:{env:'development',host:'127.0.0.1',port:0,databaseFile:path.join(dir,'rig.db'),assetVaultDir:path.join(dir,'vault'),allowDevLogin:true,allowPrototypeHeaders:true,rateLimitMax:1000,authRateLimitMax:100}});
  await new Promise(r=>app.server.listen(0,'127.0.0.1',r));
  const base=`http://127.0.0.1:${app.server.address().port}`;
  const headers={'content-type':'application/json','x-pro4x4-role':'admin','x-pro4x4-actor':'wf4-admin','x-pro4x4-name':'WF4 Admin'};
  async function req(method,url,body){const r=await fetch(base+url,{method,headers,body:body===undefined?undefined:JSON.stringify(body)});let data=null;try{data=await r.json()}catch{}return {r,data}}
  try{
    let x=await req('GET','/api/v1/staff/render-assets?vehicleId=nissan-y62-warrior-2025');
    assert.equal(x.r.status,200);assert.equal(x.data.length,22,'legacy render registry must not silently grow until governance sync is requested');
    assert.ok(x.data.every(a=>a.assetClass&&a.governance?.state),'legacy records should expose normalized governance metadata');

    x=await req('POST','/api/v1/staff/visual-governance/sync',{vehicleId:'nissan-y62-warrior-2025'});
    assert.equal(x.r.status,200);assert.equal(x.data.createdCount,12);assert.equal(x.data.summary.total,34);assert.equal(x.data.summary.byClass.reference,9);assert.equal(x.data.summary.byGovernance['reference-approved'],9);assert.equal(x.data.summary.byGovernance['master-draft'],3);assert.equal(x.data.summary.productionEligible,0);

    x=await req('GET','/api/v1/staff/render-assets?vehicleId=nissan-y62-warrior-2025');
    assert.equal(x.data.length,34);
    const refs=x.data.filter(a=>a.assetClass==='reference'),masters=x.data.filter(a=>a.assetId.endsWith('-MASTER'));
    assert.equal(refs.length,9);assert.equal(masters.length,3);
    assert.ok(refs.every(a=>a.status==='reference-only'&&a.governance.state==='reference-approved'));
    assert.ok(refs.every(a=>a.source?.startsWith('references/y62-owner/')&&/^[a-f0-9]{64}$/i.test(a.file?.checksumSha256||'')));
    assert.ok(masters.every(a=>a.assetClass==='canonical-master'&&a.status==='candidate'&&a.governance.state==='master-draft'));
    assert.ok(masters.every(a=>Array.isArray(a.provenance?.referenceIds)&&a.provenance.referenceIds.length>=2));
    assert.ok(masters.every(a=>!a.file?.checksumSha256),'master slots must not imply a render binary');

    let refBinary=await fetch(base+'/api/v1/staff/render-assets/OWNER-Y62-F34-01/reference-source',{headers});assert.equal(refBinary.status,200);assert.equal(refBinary.headers.get('cache-control'),'private, no-store');assert.match(refBinary.headers.get('content-type')||'',/image\/jpeg/);assert.ok((await refBinary.arrayBuffer()).byteLength>100000);
    const publicRef=await fetch(base+'/references/y62-owner/IMG_4030.jpeg');assert.equal(publicRef.status,404,'owner reference pack must not be exposed by the public static file handler');

    const persisted=app.db.db.prepare("SELECT payload_json FROM render_assets WHERE asset_id='Y62-F34-V1-MASTER'").get();
    assert.ok(persisted);const payload=JSON.parse(persisted.payload_json);assert.equal(payload.assetClass,'canonical-master');assert.equal(payload.governance.state,'master-draft');assert.deepEqual(payload.provenance.referenceIds,['OWNER-Y62-F34-01','OWNER-Y62-F34-02','OWNER-Y62-FRONT-01']);

    x=await req('POST','/api/v1/staff/visual-governance/sync',{vehicleId:'nissan-y62-warrior-2025'});
    assert.equal(x.data.createdCount,0,'registry sync must be idempotent');assert.equal(x.data.preservedCount,12);assert.equal(x.data.summary.total,34);

    const ui=fs.readFileSync(path.join(__dirname,'..','asset-registry.js'),'utf8'),html=fs.readFileSync(path.join(__dirname,'..','asset-registry.html'),'utf8');
    assert.match(ui,/syncVisualGovernance/);assert.match(ui,/REFERENCE EVIDENCE/);assert.match(ui,/CANONICAL MASTER EVIDENCE/);assert.match(ui,/referenceIds/);assert.match(html,/classFilter/);assert.match(html,/governanceFilter/);assert.match(html,/SYNC \+ REFRESH/);

    console.log(JSON.stringify({alpha:'26-wf4',package:'persisted-visual-governance',initialAssets:22,persistedAssets:34,ownerReferences:9,canonicalMasterSlots:3,idempotentSync:true,productionEligible:0,staffReferenceVisibility:true,protectedReferenceDelivery:true,status:'pass'},null,2));
  }finally{
    await new Promise(r=>app.server.close(r));app.db.close();fs.rmSync(dir,{recursive:true,force:true});
  }
})().catch(e=>{console.error(e);process.exit(1)});
