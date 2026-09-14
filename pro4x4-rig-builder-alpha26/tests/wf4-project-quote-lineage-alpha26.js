'use strict';
const assert=require('node:assert/strict');
const {RigDatabase}=require('../server/database');
const lineage=require('../staff-project-quote-lineage');
const fs=require('node:fs');const path=require('node:path');

const admin={actorId:'wf4-lineage-admin',displayName:'WF4 Lineage Admin',role:'admin'};
const customer={actorId:'wf4-lineage-customer',displayName:'WF4 Lineage Customer',role:'customer'};
const db=new RigDatabase(':memory:');

function baseSnapshot(reference,render){return {
  reference,
  vehicle:{id:'nissan-y62-warrior-2025',yearRange:'2025',make:'Nissan',model:'Patrol Y62',trim:'Warrior'},
  lead:{name:'WF4 Lineage QA',phone:'0400000000',email:'qa@example.invalid',postcode:'5000',preferredContact:'phone',notes:''},
  selections:[],gates:[],
  pricing:{currency:'AUD',components:{parts:0,labour:0,paint:0,freight:0,engineering:0},unpricedComponentCounts:{parts:0,labour:0,paint:0,freight:0,engineering:0},knownSubtotal:0,isComplete:true},
  render,
  workflow:{status:'ready-to-quote',owner:null,staffNotes:'',lastUpdatedAt:'2026-09-14T00:30:00+09:30'},
  catalogue:{revision:'Y62-CAT-LINEAGE-QA'},contract:{version:'0.12.0'}
}}
const missingRender={view:'front34',fallbackPolicy:'none',productionReady:false,exactMatchRequired:true,resolverVersion:'0.26.9',layers:[{layerId:'base',exactSku:null,state:'missing',reason:'reference-only-not-production',assetId:null,checksumSha256:null}]};

try{
  const root=path.join(__dirname,'..'),salesHtml=fs.readFileSync(path.join(root,'sales.html'),'utf8'),salesJs=fs.readFileSync(path.join(root,'sales.js'),'utf8');
  assert.match(salesHtml,/staff-project-quote-lineage\.js/);
  assert.match(salesJs,/IMMUTABLE HANDOFF INSPECTION/);assert.match(salesJs,/getQuoteLineage/);
  // R0001 -> share -> quote. Later R0002 must not rewrite the quote's source revision.
  const s1=db.saveProjectRevision('P4X4-PROJ-WF4-LINEAGE',baseSnapshot('P4X4-WF4-LINEAGE',missingRender),{expectedVersion:0,source:'wf4-qa',actor:customer});
  const share=db.createShare(s1.project.id,{revisionId:s1.revision.id,role:'customer-view',expiresDays:7},{actor:customer});
  const quote=db.upsertQuote(s1.snapshot,{actor:customer,action:'quote.submitted'});
  assert.equal(quote.quoteLineage.sourceProjectId,s1.project.id);
  assert.equal(quote.quoteLineage.sourceRevisionId,'R0001');
  assert.equal(quote.quoteLineage.sourceRevisionChecksum,s1.revision.checksum);
  assert.match(quote.quoteLineage.submittedSnapshotChecksum,/^[a-f0-9]{64}$/);

  const s2=db.saveProjectRevision(s1.project.id,{...s1.snapshot,lead:{...s1.snapshot.lead,name:'WF4 Lineage QA R2'}},{expectedVersion:2,source:'wf4-qa',actor:customer});
  assert.equal(s2.revision.id,'R0002');
  const report=db.inspectQuoteLineage(quote.reference,{actor:admin});
  assert.equal(report.status,'verified');
  assert.equal(report.project.linkedRevisionId,'R0001');
  assert.equal(report.project.currentRevisionId,'R0002');
  assert.equal(report.project.linkedRevisionIsCurrent,false);
  assert.equal(report.seal.state,'verified');
  assert.equal(report.project.shares.length,1);
  assert.equal(report.project.shares[0].tokenHint,share.tokenHint);
  assert.equal(report.render.counts.missing,1);
  assert.equal(report.render.layers[0].evidenceState,'not-required');
  assert.equal(report.render.fallbackPolicy,'none');
  assert.equal(report.render.exactMatchRequired,true);

  assert.throws(()=>db.updateQuote(quote.reference,{...quote,project:{...quote.project,revisionId:'R0002'}},{actor:admin}),e=>e?.code==='quote_lineage_immutable');
  assert.equal(db.getQuote(quote.reference).project.revisionId,'R0001');
  assert.equal(db.getQuote(quote.reference).quoteLineage.sourceRevisionChecksum,s1.revision.checksum);
  const finalised=db.finaliseQuote(quote.reference,{actor:admin});
  assert.equal(finalised.project.revisionId,'R0001');assert.equal(finalised.quoteLineage.sourceRevisionChecksum,s1.revision.checksum);
  const afterFinalise=db.inspectQuoteLineage(quote.reference,{actor:admin});assert.equal(afterFinalise.seal.state,'verified');assert.ok(afterFinalise.audit.quoteEvents.some(e=>e.action==='quote.finalised'));

  // A genuinely approved immutable version may be proven by the frozen quote checksum.
  const asset=db.listRenderAssets({vehicleId:'nissan-y62-warrior-2025'}).find(x=>x.viewId==='front34'&&x.layerId==='base');
  assert.ok(asset);
  const object={checksumSha256:'d'.repeat(64),objectKey:'sha256/dd/wf4-lineage-approved.png',mimeType:'image/png',width:1672,height:615,hasAlpha:true,transparencyVerified:true,sizeBytes:222222};
  const staged=db.stageAssetVersion(asset.assetId,object,{actor:admin});
  db.updateAssetVersion(asset.assetId,staged.versionId,{...staged.payload,
    provenance:{...staged.payload.provenance,sourceType:'pro4x4-original',licenceStatus:'owned',licenceNote:'Synthetic QA fixture only.'},
    cameraGeometry:{...staged.payload.cameraGeometry,matched:true,notes:'WF4 lineage QA overlay fixture.'},
    governance:{...staged.payload.governance,state:'master-approved',reviewedBy:admin.actorId,reviewedAt:'2026-09-14T00:35:00+09:30'}
  },{actor:admin});
  const promoted=db.promoteAssetVersion(asset.assetId,staged.versionId,{actor:admin});
  const availableRender={view:'front34',fallbackPolicy:'none',productionReady:true,exactMatchRequired:true,resolverVersion:'0.26.9',layers:[{layerId:'base',exactSku:null,state:'available',reason:null,assetId:asset.assetId,checksumSha256:object.checksumSha256}]};
  const a1=db.saveProjectRevision('P4X4-PROJ-WF4-AVAILABLE',baseSnapshot('P4X4-WF4-AVAILABLE',availableRender),{expectedVersion:0,source:'wf4-qa',actor:customer});
  db.upsertQuote(a1.snapshot,{actor:customer,action:'quote.submitted'});
  const availableReport=db.inspectQuoteLineage('P4X4-WF4-AVAILABLE',{actor:admin});
  assert.equal(availableReport.status,'verified');
  assert.equal(availableReport.render.layers[0].evidenceState,'verified');
  assert.equal(availableReport.render.layers[0].versionId,promoted.version.versionId);
  assert.equal(availableReport.render.layers[0].versionState,'production');
  assert.equal(availableReport.render.layers[0].governanceState,'master-approved');
  assert.equal(availableReport.render.layers[0].reviewedBy,admin.actorId);

  // REFERENCE_BACKED_APPROVED_VISUALS_ONLY: reference-only or unsupported output can never pass inspection.
  const rejected=lineage.inspect({quote:{reference:'Q-REF-REJECT',project:null,render:{view:'front34',fallbackPolicy:'none',exactMatchRequired:true,layers:[{layerId:'base',state:'available',assetId:'REF-ONLY',checksumSha256:'e'.repeat(64)}]}},assets:[{assetId:'REF-ONLY',assetClass:'reference',status:'reference-only'}],versionsByAsset:{'REF-ONLY':[{versionId:'REF-V1',state:'production',checksumSha256:'e'.repeat(64),payload:{assetId:'REF-ONLY',assetClass:'reference',status:'reference-only',governance:{state:'master-approved',reviewedBy:'x',reviewedAt:'2026-09-14T00:00:00+09:30'}}}]}});
  assert.equal(rejected.status,'blocked');
  assert.equal(rejected.render.layers[0].evidenceState,'reference-output-rejected');

  console.log(JSON.stringify({gate:'wf4-project-quote-lineage-alpha26',immutableProjectRevision:true,persistedLineageSeal:true,historicalShareBinding:true,frozenMissingStateNoFallback:true,approvedVersionEvidence:true,referenceOutputRejected:true,status:'pass'},null,2));
}finally{db.close()}
