'use strict';
const assert=require('assert'),path=require('path');
const root=path.resolve(__dirname,'..'),C=require(path.join(root,'merged-project-contract.js')),{RigDatabase}=require(path.join(root,'server/database.js'));
global.window={};require(path.join(root,'data-ranger.js'));require(path.join(root,'data-y62.js'));const ranger=window.RANGER_DATA,y62=window.RIG_DATA;delete global.window;
const actor={actorId:'customer-alpha24',displayName:'Alpha 24 Customer',role:'customer',prototype:true};
const db=new RigDatabase(':memory:');
try{
 const rangerPicked=[ranger.accessories.find(x=>x.id==='mcc-707-01')];
 const rs=C.buildSnapshot({data:ranger,selectedProducts:rangerPicked,lead:{name:'Ranger Customer',email:'ranger@example.com'},reference:'P4X4-RANGER-PIPELINE'});
 const saved=db.saveProjectRevision('P4X4-PROJ-RANGER-PIPELINE',rs,{expectedVersion:0,source:'merged-sales-queue-submit',actor});
 assert.equal(saved.project.vehicleId,'ford-ranger-nextgen-2025');assert(saved.project.title.includes('Ford Ranger Next-Gen'));assert.equal(saved.snapshot.project.revisionId,'R0001');
 const rq=db.upsertQuote(saved.snapshot,{actor,action:'quote.submitted'});assert.equal(rq.project.id,'P4X4-PROJ-RANGER-PIPELINE');assert.equal(rq.vehicle.id,'ford-ranger-nextgen-2025');assert.equal(rq.workflow.status,'needs-fitment-review');
 const ys=C.buildSnapshot({data:y62,selectedProducts:[y62.accessories.find(x=>x.id==='scout-rack')],lead:{name:'Patrol Customer',phone:'0400000000'},reference:'P4X4-Y62-PIPELINE'});
 const ySaved=db.saveProjectRevision('P4X4-PROJ-Y62-PIPELINE',ys,{expectedVersion:0,source:'merged-customer-builder',actor});assert(ySaved.project.title.includes('Nissan Patrol Y62'));assert.equal(ySaved.snapshot.render.fallbackPolicy,'none');
 console.log('multi-vehicle-pipeline-alpha24: PASS — both proof vehicles persist as immutable projects; Ranger queue handoff retains project lineage and fitment gate');
}finally{db.close()}
