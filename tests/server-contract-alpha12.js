'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const {createApp}=require('../server/server');

(async()=>{
  const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'pro4x4-alpha12-'));
  const dbFile=':memory:';
  const {server,db}=createApp({dbFile,seed:true});
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
  const port=server.address().port,base=`http://127.0.0.1:${port}`;
  const headers={'content-type':'application/json','x-pro4x4-role':'admin','x-pro4x4-actor':'test-admin','x-pro4x4-name':'Contract Test'};
  const req=async(method,url,body=null,h=headers)=>{const r=await fetch(base+url,{method,headers:h,body:body==null?undefined:JSON.stringify(body)});let data=null;try{data=await r.json()}catch{}return {r,data}};
  try{
    let x=await req('GET','/api/v1/health');assert.equal(x.r.status,200);assert.equal(x.data.schemaVersion,'0.12.0');
    x=await req('GET','/api/v1/catalogue/nissan-y62-warrior-2025');assert.equal(x.r.status,200);assert.equal(x.data.accessories.length,26);const catalogue=x.data;
    const build={schemaVersion:'0.12.0',reference:'P4X4-ALPHA11-CONTRACT',createdAt:new Date().toISOString(),channel:'contract-test',lead:{name:'Contract Customer',phone:'0400000000'},vehicle:{id:'nissan-y62-warrior-2025',make:'Nissan',model:'Patrol Y62',trim:'Warrior by Premcar',paint:'black-obsidian',wheelTyre:'factory-warrior',view:'front34'},selections:[{id:'test-item',brand:'PRO4X4',name:'Contract Item',sku:'TEST-001',status:'confirmed',pricing:{parts:100,labour:null,paint:null,freight:null,engineering:null},pricingRequired:['parts'],fitment:{compatibleVehicleIds:['nissan-y62-warrior-2025'],requiredParts:[],conflicts:[],reviewRequired:false},weightKg:1}],pricing:{},weight:{baseline:{kerbMassKg:2884,gvmKg:3620}},gates:[],workflow:{status:'new',owner:null,staffNotes:'',lastUpdatedAt:new Date().toISOString()},catalogue:{schemaVersion:'0.12.0',revision:catalogue.revision},contract:{version:'0.12.0'}};
    x=await req('POST','/api/v1/builds',build);assert.equal(x.r.status,201);assert.equal(x.data.workflow.status,'ready-to-quote');
    x=await req('GET','/api/v1/staff/quotes');assert.equal(x.r.status,200);assert.equal(x.data.length,1);
    x=await req('GET','/api/v1/staff/quotes/P4X4-ALPHA11-CONTRACT');assert.equal(x.r.status,200);assert.equal(x.data.reference,build.reference);
    x=await req('PATCH','/api/v1/staff/settings/quote',{labourRate:165,quoteValidityDays:21});assert.equal(x.r.status,200);assert.equal(x.data.labourRate,165);
    x=await req('POST','/api/v1/staff/quotes/P4X4-ALPHA11-CONTRACT/finalise',{});assert.equal(x.r.status,200);assert.equal(x.data.workflow.status,'quoted');assert.equal(x.data.quoteFinalisation.customerTotal,100);
    x=await req('PUT','/api/v1/staff/catalogue/nissan-y62-warrior-2025/draft',{...catalogue,revision:'DRAFT-TEST'});assert.equal(x.r.status,200);assert.equal(x.data.revision,'DRAFT-TEST');
    x=await req('GET','/api/v1/staff/catalogue/nissan-y62-warrior-2025/draft');assert.equal(x.r.status,200);assert.equal(x.data.revision,'DRAFT-TEST');
    x=await req('DELETE','/api/v1/staff/catalogue/nissan-y62-warrior-2025/draft');assert.equal(x.r.status,204);
    const projectId='P4X4-PROJ-CONTRACT';
    x=await req('POST',`/api/v1/projects/${projectId}/revisions`,{snapshot:build,source:'contract-test',expectedVersion:0});assert.equal(x.r.status,201);assert.equal(x.data.project.version,1);const revisionId=x.data.revision.id;
    x=await req('GET','/api/v1/projects');assert.equal(x.r.status,200);assert.equal(x.data.length,1);
    x=await req('POST',`/api/v1/projects/${projectId}/revisions`,{snapshot:{...build,reference:'P4X4-ALPHA11-REV2'},source:'contract-test-2',expectedVersion:1});assert.equal(x.r.status,201);assert.equal(x.data.project.version,2);
    x=await req('POST',`/api/v1/projects/${projectId}/revisions`,{snapshot:build,source:'stale',expectedVersion:0});assert.equal(x.r.status,409);assert.equal(x.data.code,'version_conflict');
    x=await req('PUT',`/api/v1/projects/${projectId}/current-revision`,{revisionId,expectedVersion:2});assert.equal(x.r.status,200);assert.equal(x.data.project.currentRevisionId,revisionId);assert.equal(x.data.project.version,3);
    x=await req('POST',`/api/v1/projects/${projectId}/shares`,{role:'customer-view',revisionId,expiresDays:7});assert.equal(x.r.status,201);const token=x.data.token,tokenHash=x.data.tokenHash;assert.ok(token);assert.equal(tokenHash.length,64);
    x=await req('GET',`/api/v1/shares/${encodeURIComponent(token)}`);assert.equal(x.r.status,200);assert.equal(x.data.revision.id,revisionId);
    x=await req('DELETE',`/api/v1/projects/${projectId}/shares/${tokenHash}`);assert.equal(x.r.status,204);
    x=await req('GET',`/api/v1/shares/${encodeURIComponent(token)}`);assert.equal(x.r.status,404);
    const outsider={'content-type':'application/json','x-pro4x4-role':'customer','x-pro4x4-actor':'different-customer','x-pro4x4-name':'Different Customer'};x=await req('GET',`/api/v1/projects/${projectId}`,null,outsider);assert.equal(x.r.status,403);x=await req('GET','/api/v1/projects',null,outsider);assert.equal(x.r.status,200);assert.equal(x.data.length,0);
    x=await req('GET','/api/v1/staff/audit?limit=500');assert.equal(x.r.status,200);assert.ok(x.data.length>=8);
    const forbidden=await req('GET','/api/v1/admin/backup',null,{'content-type':'application/json','x-pro4x4-role':'customer'});assert.equal(forbidden.r.status,403);
    x=await req('GET','/api/v1/admin/backup');assert.equal(x.r.status,200);const backup=x.data;assert.equal(backup.schemaVersion,'0.12.0');assert.equal(backup.quotes.length,1);assert.equal(backup.projects.length,1);
    await req('PATCH','/api/v1/staff/settings/quote',{labourRate:99,quoteValidityDays:3});
    x=await req('POST','/api/v1/admin/backup/restore',backup);assert.equal(x.r.status,200);assert.equal(x.data.restored,true);
    x=await req('GET','/api/v1/staff/settings/quote');assert.equal(x.data.labourRate,165);assert.equal(x.data.quoteValidityDays,21);
    x=await fetch(base+'/sales.html');assert.equal(x.status,200);const html=await x.text();assert.match(html,/SALES QUEUE/);
    console.log(JSON.stringify({schemaVersion:'0.12.0',catalogueAccessories:catalogue.accessories.length,quotes:1,projectRevision:revisionId,projectList:true,restoreRevision:true,ownerIsolation:true,auditEvents:(await req('GET','/api/v1/staff/audit?limit=500')).data.length,backupTables:['quotes','catalogueRevisions','projects','shares','auditEvents'],httpStatic:true},null,2));
  }finally{await new Promise(resolve=>server.close(resolve));db.close();fs.rmSync(tmp,{recursive:true,force:true})}
})().catch(e=>{console.error(e);process.exit(1)});
