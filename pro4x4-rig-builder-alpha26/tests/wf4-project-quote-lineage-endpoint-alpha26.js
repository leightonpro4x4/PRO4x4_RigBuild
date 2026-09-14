'use strict';
const assert=require('node:assert/strict');
const {createApp}=require('../server/server');
(async()=>{
  const actor={actorId:'wf4-lineage-http',displayName:'WF4 Lineage HTTP',role:'admin'};
  const {server,db}=createApp({dbFile:':memory:',seed:false});
  const snapshot={reference:'P4X4-WF4-LINEAGE-HTTP',vehicle:{id:'nissan-y62-warrior-2025',make:'Nissan',model:'Patrol Y62',trim:'Warrior'},lead:{name:'Lineage HTTP'},selections:[],gates:[],pricing:{},render:{view:'front34',fallbackPolicy:'none',exactMatchRequired:true,productionReady:false,layers:[{layerId:'base',state:'missing',reason:'reference-only-not-production'}]},workflow:{status:'new',owner:null,staffNotes:'',lastUpdatedAt:new Date().toISOString()},catalogue:{revision:'HTTP-QA'},contract:{version:'0.12.0'}};
  const saved=db.saveProjectRevision('P4X4-PROJ-WF4-LINEAGE-HTTP',snapshot,{expectedVersion:0,source:'wf4-http-qa',actor});
  db.upsertQuote(saved.snapshot,{actor,action:'quote.submitted'});
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
  const base=`http://127.0.0.1:${server.address().port}`,headers={'x-pro4x4-role':'admin','x-pro4x4-actor':'wf4-lineage-http','x-pro4x4-name':'WF4 Lineage HTTP'};
  try{
    let r=await fetch(`${base}/api/v1/staff/quotes/${encodeURIComponent(snapshot.reference)}/lineage`,{headers});assert.equal(r.status,200);const report=await r.json();assert.equal(report.policy,'immutable-project-revision-share-quote-visual-lineage');assert.equal(report.seal.state,'verified');assert.equal(report.project.linkedRevisionId,'R0001');assert.equal(report.render.layers[0].state,'missing');assert.equal(report.render.fallbackPolicy,'none');
    r=await fetch(`${base}/api/v1/staff/quotes/${encodeURIComponent(snapshot.reference)}/lineage`,{headers:{'x-pro4x4-role':'customer','x-pro4x4-actor':'wf4-lineage-customer'}});assert.equal(r.status,403);
    console.log(JSON.stringify({gate:'wf4-project-quote-lineage-endpoint-alpha26',staffEndpoint:true,roleGuard:true,persistedSeal:true,frozenRenderState:true,status:'pass'},null,2));
  }finally{await new Promise(resolve=>server.close(resolve));db.close()}
})().catch(e=>{console.error(e);process.exit(1)});
