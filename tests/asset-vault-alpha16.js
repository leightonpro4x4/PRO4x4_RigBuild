'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const {createApp}=require('../server/server');
(async()=>{
 const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'p4x4-a16-vault-')),vault=path.join(tmp,'vault');
 const {server,db}=createApp({dbFile:path.join(tmp,'test.sqlite'),config:{env:'development',allowPrototypeHeaders:true,allowDevLogin:true,assetVaultDir:vault}});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const base=`http://127.0.0.1:${server.address().port}`,auth={'x-pro4x4-role':'admin','x-pro4x4-actor':'a16','x-pro4x4-name':'Alpha 16'};
 try{
  let r=await fetch(base+'/api/v1/staff/render-assets?vehicleId=nissan-y62-warrior-2025',{headers:auth}),assets=await r.json(),asset=assets.find(x=>x.viewId==='front34'&&x.layerId==='base');assert.ok(asset);
  const binary=fs.readFileSync(path.join(__dirname,'fixtures','transparent-y62-f34.png'));
  r=await fetch(base+`/api/v1/staff/render-assets/${encodeURIComponent(asset.assetId)}/binary`,{method:'PUT',headers:{...auth,'content-type':'image/png'},body:binary});assert.equal(r.status,201);let out=await r.json();assert.equal(out.object.width,1672);assert.equal(out.object.height,615);assert.equal(out.object.transparencyVerified,true);assert.equal(out.asset.vault.stored,true);assert.match(out.object.objectKey,/^sha256\/[a-f0-9]{2}\/[a-f0-9]{64}\.png$/);
  asset=out.asset;asset.provenance={...asset.provenance,sourceType:'pro4x4-original',licenceStatus:'owned',licenceNote:'Alpha 16 test-owned transparent base layer.'};asset.cameraGeometry={...asset.cameraGeometry,matched:true,notes:'Manual overlay verified in Alpha 16 test.'};asset.status='production-ready';asset.governance={...(asset.governance||{}),state:'master-approved'};asset.approval={...asset.approval,state:'approved-production',approvedBy:'Alpha 16',approvedAt:new Date().toISOString()};
  r=await fetch(base+`/api/v1/staff/render-assets/${encodeURIComponent(asset.assetId)}`,{method:'PUT',headers:{...auth,'content-type':'application/json'},body:JSON.stringify(asset)});assert.equal(r.status,200);out=await r.json();assert.equal(out.status,'production-ready');
  r=await fetch(base+`/api/v1/render-assets/${encodeURIComponent(asset.assetId)}/binary`);assert.equal(r.status,200);assert.equal(Number(r.headers.get('content-length')),binary.length);assert.match(r.headers.get('etag')||'',/sha256-/);const served=Buffer.from(await r.arrayBuffer());assert.deepEqual(served,binary);
  const backup=db.backup();assert.equal(backup.assetObjects.length,1);assert.ok(db.getDatabaseStatus().migrationVersion>=5);
  const audit=db.listAudit({entityType:'render-asset',entityId:asset.assetId,limit:100});assert.ok(audit.some(x=>x.action==='render.asset.binary.stored'));
  console.log(JSON.stringify({alpha:16,vault:'content-addressed',dimensions:'1672x615',serverTransparencyVerified:true,productionApproval:true,publicImmutableBinary:true,dbMigration:5,status:'pass'},null,2));
 }finally{await new Promise(r=>server.close(r));db.close();fs.rmSync(tmp,{recursive:true,force:true})}
})().catch(e=>{console.error(e);process.exit(1)});
