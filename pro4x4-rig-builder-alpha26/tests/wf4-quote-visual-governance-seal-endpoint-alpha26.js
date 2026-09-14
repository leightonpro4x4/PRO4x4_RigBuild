'use strict';
const assert=require('node:assert/strict');
const {createApp}=require('../server/server');
(async()=>{
  const actor={actorId:'wf4-visual-seal-http',displayName:'WF4 Visual Seal HTTP',role:'admin'};
  const {server,db}=createApp({dbFile:':memory:',seed:false});
  db.syncVisualGovernanceRegistry({vehicleId:'nissan-y62-warrior-2025'},{actor});
  const reference='P4X4-WF4-VISUAL-SEAL-HTTP';
  const snapshot={reference,vehicle:{id:'nissan-y62-warrior-2025',make:'Nissan',model:'Patrol Y62',trim:'Warrior',view:'front34'},lead:{name:'Visual Seal HTTP'},selections:[],gates:[],pricing:{},render:{view:'front34',fallbackPolicy:'none',exactMatchRequired:true,productionReady:false,layers:[{layerId:'base',state:'missing',reason:'canonical-master-not-production'}]},workflow:{status:'new',owner:null,staffNotes:'',lastUpdatedAt:new Date().toISOString()},catalogue:{revision:'HTTP-VISUAL-SEAL-QA'},contract:{version:'0.12.0'}};
  const saved=db.saveProjectRevision('P4X4-PROJ-WF4-VISUAL-SEAL-HTTP',snapshot,{expectedVersion:0,source:'wf4-visual-seal-http',actor});
  db.upsertQuote(saved.snapshot,{actor,action:'quote.submitted'});
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
  const base=`http://127.0.0.1:${server.address().port}`,headers={'x-pro4x4-role':'admin','x-pro4x4-actor':actor.actorId,'x-pro4x4-name':actor.displayName,'content-type':'application/json'};
  try{
    let r=await fetch(`${base}/api/v1/staff/quotes/${encodeURIComponent(reference)}/lineage`,{headers});assert.equal(r.status,200);const report=await r.json();
    assert.equal(report.visualGovernance.state,'verified');
    assert.equal(report.visualGovernance.canonicalMaster.assetId,'Y62-F34-V1-MASTER');
    assert.equal(report.visualGovernance.referencePack.packId,'Y62-OWNER-REFERENCE-PACK-V1');
    assert.match(report.visualGovernance.sealSha256,/^[a-f0-9]{64}$/);
    const quote=db.getQuote(reference);
    r=await fetch(`${base}/api/v1/staff/quotes/${encodeURIComponent(reference)}`,{method:'PATCH',headers,body:JSON.stringify({...quote,render:{...quote.render,view:'side'}})});assert.equal(r.status,409);const err=await r.json();assert.equal(err.code,'quote_visual_lineage_immutable');
    r=await fetch(`${base}/api/v1/staff/quotes/${encodeURIComponent(reference)}/lineage`,{headers:{'x-pro4x4-role':'customer','x-pro4x4-actor':'wf4-visual-seal-customer'}});assert.equal(r.status,403);
    console.log(JSON.stringify({gate:'wf4-quote-visual-governance-seal-endpoint-alpha26',staffInspection:true,canonicalPackEvidence:true,renderTamper409:true,roleGuard:true,status:'pass'},null,2));
  }finally{await new Promise(resolve=>server.close(resolve));db.close()}
})().catch(e=>{console.error(e);process.exit(1)});
