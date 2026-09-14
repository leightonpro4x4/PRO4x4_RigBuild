'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const http=require('node:http');
const {createApp}=require('../server/server');
const plan=require('../y62-readiness-plan.js');
const start=app=>new Promise(r=>app.server.listen(0,'127.0.0.1',()=>r(app.server.address().port)));
const stop=app=>new Promise(r=>app.server.close(()=>{app.db.close();r()}));
function request(port,method,url,body=null,headers={}){return new Promise((resolve,reject)=>{const q=http.request({host:'127.0.0.1',port,path:url,method,headers},res=>{const chunks=[];res.on('data',c=>chunks.push(c));res.on('end',()=>{const b=Buffer.concat(chunks);let data=b;try{data=JSON.parse(b.toString())}catch{}resolve({status:res.statusCode,data,body:b})})});q.on('error',reject);if(body)q.write(body);q.end()})}
const body=x=>Buffer.from(JSON.stringify(x));
(async()=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'p4x4-a23-')),app=createApp({config:{env:'development',host:'127.0.0.1',port:0,databaseFile:path.join(dir,'rig.db'),assetVaultDir:path.join(dir,'vault'),allowDevLogin:true,allowPrototypeHeaders:true,rateLimitMax:1000,authRateLimitMax:100}}),port=await start(app),admin={'x-pro4x4-role':'admin','x-pro4x4-actor':'alpha23-admin','x-pro4x4-name':'Alpha 23 Admin','content-type':'application/json'};
  try{
    assert.equal(plan.expectedSlots().length,15);assert.equal(plan.paints.filter(x=>x.validated).length,4);assert.equal(plan.wheelTyres.filter(x=>x.validated).length,1);
    let r=await request(port,'GET',`/api/v1/staff/render-readiness?vehicleId=${encodeURIComponent(plan.vehicleId)}`,null,admin);assert.equal(r.status,200);assert.equal(r.data.schemaVersion,'0.23.0');assert.equal(r.data.summary.plannedSlots,15);assert.equal(r.data.summary.registeredSlots,6);assert.equal(r.data.summary.missingSlots,9);assert.equal(r.data.summary.productionReadySlots,0);assert.equal(r.data.summary.health,'red');assert.equal(r.data.policy,'exact-state-no-substitution');
    const gunFront=r.data.views.find(v=>v.viewId==='front34').cells.find(c=>c.stateKey==='paint:gun-metallic');assert.equal(gunFront.registered,false);assert.equal(gunFront.status,'slot-missing');assert.equal(gunFront.nextAction,'create-slot');
    r=await request(port,'POST','/api/v1/staff/render-readiness/slots/sync',body({vehicleId:plan.vehicleId}),admin);assert.equal(r.status,200);assert.equal(r.data.createdCount,9);assert.equal(r.data.readiness.summary.registeredSlots,15);assert.equal(r.data.readiness.summary.missingSlots,0);assert.equal(r.data.readiness.summary.productionReadySlots,0);
    const assets=app.db.listRenderAssets({vehicleId:plan.vehicleId}),created=assets.filter(a=>r.data.created.includes(a.assetId));assert.equal(created.length,9);assert.ok(created.every(a=>a.status==='asset-needed'));assert.ok(created.every(a=>a.source==null));assert.ok(created.every(a=>!a.file?.checksumSha256));assert.ok(created.every(a=>a.approval?.state==='not-reviewed'));assert.ok(created.every(a=>a.provenance?.licenceStatus==='unknown'));assert.equal(assets.filter(a=>a.status==='production-ready').length,0);
    const gun=created.find(a=>a.viewId==='front34'&&a.renderState?.paintId==='gun-metallic');assert.ok(gun);assert.equal(gun.exactSku,null);assert.match(gun.approval.notes,/No visual binary is implied/);
    r=await request(port,'POST','/api/v1/staff/render-readiness/slots/sync',body({vehicleId:plan.vehicleId}),admin);assert.equal(r.status,200);assert.equal(r.data.createdCount,0);assert.equal(r.data.existingCount,15);
    const events=app.db.listAudit({action:'render.readiness.slots.synced'});assert.equal(events.length,2);assert.equal(events[0].metadata.createdCount,0);assert.equal(events[1].metadata.createdCount,9);
    const html=fs.readFileSync(path.join(__dirname,'..','readiness.html'),'utf8'),js=fs.readFileSync(path.join(__dirname,'..','readiness.js'),'utf8');assert.match(html,/VISUAL <span style="color:var\(--orange\)">READINESS/);assert.match(js,/CREATE MISSING STATE SLOTS/);assert.match(js,/asset-registry\.html\?assetId=/);
    const seed=JSON.parse(fs.readFileSync(path.join(__dirname,'..','seed','render-assets.y62.seed.json'),'utf8'));assert.equal(seed.assets.filter(x=>x.status==='production-ready').length,0);
    console.log(JSON.stringify({alpha:23,plannedCoreSlots:15,existingCoreSlots:6,createdAssetNeededSlots:9,idempotentSync:true,productionReadySeed:0,readinessMatrix:true,telemetryHealth:true,noFakeLayerRule:true,status:'pass'},null,2));
  }finally{await stop(app);fs.rmSync(dir,{recursive:true,force:true})}
})().catch(e=>{console.error(e);process.exit(1)});
