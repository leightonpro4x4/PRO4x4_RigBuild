'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const http=require('node:http');
const vm=require('node:vm');
const {webcrypto}=require('node:crypto');
const {createApp}=require('../server/server');

const start=app=>new Promise(r=>app.server.listen(0,'127.0.0.1',()=>r(app.server.address().port)));
const stop=app=>new Promise(r=>app.server.close(()=>{app.db.close();r()}));
function request(port,method,url,body=null,headers={}){return new Promise((resolve,reject)=>{const q=http.request({host:'127.0.0.1',port,path:url,method,headers},res=>{const chunks=[];res.on('data',c=>chunks.push(c));res.on('end',()=>{const b=Buffer.concat(chunks);let data=b;try{data=JSON.parse(b.toString())}catch{}resolve({status:res.statusCode,headers:res.headers,body:b,data})})});q.on('error',reject);if(body)q.write(body);q.end()})}
function productionRecord(asset){return {...asset,status:'production-ready',governance:{...(asset.governance||{}),state:asset.layerId==='base'||asset.layerId==='wheels'?'master-approved':'layer-approved',reviewedBy:'Alpha 20 Test',reviewedAt:new Date().toISOString()},provenance:{...asset.provenance,sourceType:'pro4x4-original',licenceStatus:'owned',licenceNote:'Synthetic Alpha 20 resolver test fixture only.'},cameraGeometry:{...asset.cameraGeometry,matched:true,notes:'Synthetic test fixture matched to locked Y62-F34-V1 canvas.'},approval:{...asset.approval,state:'approved-production',approvedBy:'Alpha 20 Test',approvedAt:new Date().toISOString()}}}
function body(x){return Buffer.from(JSON.stringify(x))}
class Storage{constructor(){this.m=new Map()}get length(){return this.m.size}key(i){return [...this.m.keys()][i]??null}getItem(k){return this.m.has(k)?this.m.get(k):null}setItem(k,v){this.m.set(String(k),String(v))}removeItem(k){this.m.delete(k)}}

(async()=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'p4x4-a20-')),app=createApp({config:{env:'development',host:'127.0.0.1',port:0,databaseFile:path.join(dir,'rig.db'),assetVaultDir:path.join(dir,'vault'),allowDevLogin:true,allowPrototypeHeaders:true,rateLimitMax:1000,authRateLimitMax:100}}),port=await start(app);
  const admin={'x-pro4x4-role':'admin','x-pro4x4-actor':'alpha20-admin','x-pro4x4-name':'Alpha 20 Admin','content-type':'application/json'};
  try{
    const requirements=[
      {layerId:'base',exactSku:null},
      {layerId:'wheels',exactSku:'FACTORY-WARRIOR-18X9-G015'},
      {layerId:'front',exactSku:'Y62 S5 GEN-X'},
      {layerId:'sides',exactSku:'PB-NN-003'}
    ];
    let r=await request(port,'POST','/api/v1/render/resolve',body({vehicleId:'nissan-y62-warrior-2025',viewId:'front34',requirements}),{'content-type':'application/json'});
    assert.equal(r.status,200);assert.equal(r.data.fallbackPolicy,'none');assert.equal(r.data.productionReady,false);assert.equal(r.data.counts.available,0);assert.equal(r.data.layers.find(x=>x.layerId==='base').state,'missing');assert.equal(r.data.layers.find(x=>x.layerId==='base').reason,'reference-only-not-production');assert.equal(r.data.layers.find(x=>x.layerId==='front').state,'missing');assert.equal(r.data.layers.find(x=>x.layerId==='sides').state,'blocked');assert.ok(r.data.layers.every(x=>!x.binaryUrl));

    r=await request(port,'POST','/api/v1/render/resolve',body({vehicleId:'nissan-y62-warrior-2025',viewId:'front34',requirements:[{layerId:'front',exactSku:'NOT-THE-SLX-X1'}]}),{'content-type':'application/json'});
    assert.equal(r.status,200);assert.equal(r.data.layers[0].state,'missing');assert.equal(r.data.layers[0].reason,'exact-sku-not-registered');assert.equal(r.data.layers[0].assetId,null);assert.equal(r.data.layers[0].binaryUrl,null);

    let asset=app.db.listRenderAssets({vehicleId:'nissan-y62-warrior-2025',viewId:'front34'}).find(x=>x.layerId==='base');
    const binary=fs.readFileSync(path.join(__dirname,'fixtures','transparent-y62-f34.png'));
    r=await request(port,'PUT',`/api/v1/staff/render-assets/${encodeURIComponent(asset.assetId)}/binary`,binary,{'x-pro4x4-role':'admin','x-pro4x4-actor':'alpha20-admin','x-pro4x4-name':'Alpha 20 Admin','content-type':'image/png'});assert.equal(r.status,201);
    asset=productionRecord(r.data.asset);r=await request(port,'PUT',`/api/v1/staff/render-assets/${encodeURIComponent(asset.assetId)}`,body(asset),admin);assert.equal(r.status,200);

    r=await request(port,'POST','/api/v1/render/resolve',body({vehicleId:'nissan-y62-warrior-2025',viewId:'front34',requirements:[{layerId:'base',exactSku:null},{layerId:'front',exactSku:'Y62 S5 GEN-X'}]}),{'content-type':'application/json'});
    assert.equal(r.status,200);const base=r.data.layers.find(x=>x.layerId==='base'),front=r.data.layers.find(x=>x.layerId==='front');assert.equal(base.state,'available');assert.equal(front.state,'missing');assert.match(base.binaryUrl,/\/api\/v1\/render-assets\/Y62-FRONT34-01-BASE\/binary\?sha=[a-f0-9]{64}$/);assert.equal(r.data.productionReady,false);assert.equal(r.data.counts.available,1);assert.equal(r.data.counts.missing,1);
    const served=await request(port,'GET',base.binaryUrl);assert.equal(served.status,200);assert.deepEqual(served.body,binary);assert.match(served.headers['cache-control']||'',/immutable/);
    const wrongSha='0'.repeat(64);const stale=await request(port,'GET',`/api/v1/render-assets/${encodeURIComponent(asset.assetId)}/binary?sha=${wrongSha}`);assert.equal(stale.status,409);assert.equal(stale.data.code,'asset_version_changed');

    const sandbox={console,Date,Math,JSON,URL,URLSearchParams,TextEncoder,Uint8Array,crypto:webcrypto,localStorage:new Storage(),location:{origin:'http://local.test',href:'file:///index.html',search:'?backend=local',protocol:'file:'},setTimeout,clearTimeout};sandbox.window=sandbox;sandbox.fetch=async()=>{throw new Error('network should not be used by local resolver')};vm.createContext(sandbox);for(const f of ['render-manifest-y62.js','persistence.js','auth.js','backend-client.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'..',f),'utf8'),sandbox,{filename:f});const local=sandbox.PRO4X4_BACKEND.local;const localResolved=await local.resolveRenderStack({vehicleId:'nissan-y62-warrior-2025',viewId:'front34',requirements:[{layerId:'base',exactSku:null},{layerId:'sides',exactSku:'PB-NN-003'}]});assert.equal(localResolved.counts.available,0);assert.equal(localResolved.layers[0].state,'missing');assert.equal(localResolved.layers[0].binaryUrl,null);assert.equal(localResolved.layers[1].state,'blocked');

    const appJs=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8'),index=fs.readFileSync(path.join(__dirname,'..','y62-alpha22.html'),'utf8');assert.doesNotMatch(appJs,/vehicleImage/);assert.doesNotMatch(index,/id="vehicleImage"/);assert.match(appJs,/fallbackPolicy:'none'/);assert.match(index,/Reference artwork is deliberately hidden/);
    const seed=JSON.parse(fs.readFileSync(path.join(__dirname,'..','seed','render-assets.y62.seed.json'),'utf8'));assert.equal(seed.assets.filter(x=>x.status==='production-ready').length,0);

    console.log(JSON.stringify({alpha:20,dbMigration:5,publicResolver:true,states:['available','missing','blocked'],exactSkuNoSubstitution:true,checksumPinnedBinary:true,customerReferenceFallback:'none',partialStackSupported:true,noFakeProductionSeed:true,status:'pass'},null,2));
  }finally{await stop(app);fs.rmSync(dir,{recursive:true,force:true})}
})().catch(e=>{console.error(e);process.exit(1)});
