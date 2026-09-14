'use strict';
const assert=require('node:assert/strict');
const {RigDatabase}=require('../server/database');

const actor={actorId:'wf5-reviewer',displayName:'WF5 Reviewer',role:'admin'};
const customer={actorId:'wf5-customer',displayName:'WF5 Customer',role:'customer'};
const db=new RigDatabase(':memory:');

function requirement(){return [{layerId:'base',exactSku:null,state:{paintId:'black-obsidian'},stateKey:'paint:black-obsidian'}]}

try{
  const asset=db.listRenderAssets({vehicleId:'nissan-y62-warrior-2025'}).find(x=>x.viewId==='front34'&&x.layerId==='base');
  assert.ok(asset,'front34 canonical base registry record must exist');
  assert.notEqual(asset.status,'production-ready','seed/reference base must not already be production-ready');

  // Before approval the exact customer state is missing; staging must not change the active customer pointer.
  let resolved=db.resolveProductionRenderStack({vehicleId:'nissan-y62-warrior-2025',viewId:'front34',requirements:requirement()});
  assert.equal(resolved.productionReady,false);
  assert.equal(resolved.layers[0].state,'missing');
  assert.equal(resolved.layers[0].reason,'reference-only-not-production');

  const object={checksumSha256:'c'.repeat(64),objectKey:'sha256/cc/wf5-approved-master.png',mimeType:'image/png',width:1672,height:615,hasAlpha:true,transparencyVerified:true,sizeBytes:123456};
  const staged=db.stageAssetVersion(asset.assetId,object,{actor});
  assert.equal(staged.state,'candidate');
  assert.equal(staged.payload.status,'candidate');
  assert.equal(staged.payload.governance.state,'master-draft');
  assert.equal(staged.payload.governance.reviewedBy,null);

  resolved=db.resolveProductionRenderStack({vehicleId:'nissan-y62-warrior-2025',viewId:'front34',requirements:requirement()});
  assert.equal(resolved.layers[0].state,'missing','staging a draft must never change customer output');

  assert.throws(()=>db.promoteAssetVersion(asset.assetId,staged.versionId,{actor}),e=>e?.code==='review_evidence_required','promotion without reviewer evidence must be rejected');

  const reviewed={...staged.payload,
    provenance:{...staged.payload.provenance,sourceType:'pro4x4-original',licenceStatus:'owned',licenceNote:'WF5 synthetic QA fixture; no production seed.'},
    cameraGeometry:{...staged.payload.cameraGeometry,matched:true,notes:'WF5 overlay acceptance fixture.'},
    governance:{...staged.payload.governance,state:'master-approved',reviewedBy:'wf5-reviewer',reviewedAt:'2026-09-13T19:45:00+09:30'},
    approval:{...staged.payload.approval,notes:'WF5 full-path acceptance fixture.'}
  };
  db.updateAssetVersion(asset.assetId,staged.versionId,reviewed,{actor});
  const promoted=db.promoteAssetVersion(asset.assetId,staged.versionId,{actor});
  assert.equal(promoted.asset.status,'production-ready');
  assert.equal(promoted.asset.governance.state,'master-approved');
  assert.equal(promoted.asset.lineage.currentVersionId,staged.versionId);
  assert.equal(promoted.asset.approval.reviewEvidence.versionId,staged.versionId);
  assert.equal(promoted.asset.approval.reviewEvidence.reviewedBy,'wf5-reviewer');
  assert.equal(promoted.asset.approval.reviewEvidence.checksumSha256,object.checksumSha256);

  resolved=db.resolveProductionRenderStack({vehicleId:'nissan-y62-warrior-2025',viewId:'front34',requirements:requirement()});
  assert.equal(resolved.productionReady,true);
  assert.equal(resolved.layers[0].state,'available');
  assert.equal(resolved.layers[0].assetId,asset.assetId);
  assert.equal(resolved.layers[0].checksumSha256,object.checksumSha256);
  assert.match(resolved.layers[0].binaryUrl,/sha=c{64}$/);

  const audit=db.listAudit({entityType:'render-asset',entityId:asset.assetId,action:'render.asset.version.promoted',limit:10});
  assert.equal(audit.length,1);
  assert.equal(audit[0].metadata.reviewEvidence.reviewedBy,'wf5-reviewer');
  assert.equal(audit[0].metadata.reviewEvidence.reviewState,'master-approved');

  // Freeze the pre-promotion visual state into R0001, its share and quote; later runtime readiness must not rewrite history.
  const oldRender={view:'front34',fallbackPolicy:'none',productionReady:false,exactMatchRequired:true,stateVariant:{paintId:'black-obsidian',wheelTyreId:'factory-warrior'},resolverVersion:'0.20.0',layers:[{layerId:'base',exactSku:null,state:'missing',reason:'reference-only-not-production',assetId:null,checksumSha256:null}]};
  const snap1={reference:'P4X4-WF5-VISUAL-LINEAGE',vehicle:{id:'nissan-y62-warrior-2025',yearRange:'2025',make:'Nissan',model:'Patrol Y62',trim:'Warrior'},lead:{name:'WF5 QA',phone:'0400000000',email:'',postcode:'',preferredContact:'phone',notes:''},selections:[],pricing:{currency:'AUD',components:{parts:0,labour:0,paint:0,freight:0,engineering:0},unpricedComponentCounts:{parts:0,labour:0,paint:0,freight:0,engineering:0},knownSubtotal:0,isComplete:true},gates:[],render:oldRender,workflow:{status:'ready-to-quote',owner:null,staffNotes:'',lastUpdatedAt:'2026-09-13T19:40:00+09:30'},catalogue:{revision:'WF5-QA'},contract:{version:'0.12.0'}};
  const saved1=db.saveProjectRevision('P4X4-PROJ-WF5-VISUAL-LINEAGE',snap1,{expectedVersion:0,source:'wf5-qa',actor:customer});
  assert.equal(saved1.revision.id,'R0001');
  const share=db.createShare(saved1.project.id,{revisionId:'R0001',role:'customer-view',expiresDays:1},{actor:customer});
  const quote=db.upsertQuote(saved1.snapshot,{actor:customer,action:'quote.submitted'});
  assert.equal(quote.project.revisionId,'R0001');
  assert.equal(quote.render.productionReady,false);
  assert.equal(quote.render.layers[0].state,'missing');
  const finalised=db.finaliseQuote(quote.reference,{actor});
  assert.equal(finalised.project.revisionId,'R0001');
  assert.equal(finalised.render.layers[0].state,'missing');

  const freshRender={...oldRender,productionReady:true,resolverVersion:resolved.schemaVersion,layers:resolved.layers.map(x=>({layerId:x.layerId,exactSku:x.exactSku||null,state:x.state,reason:x.reason||null,assetId:x.assetId||null,checksumSha256:x.checksumSha256||null}))};
  const saved2=db.saveProjectRevision(saved1.project.id,{...snap1,render:freshRender,lead:{...snap1.lead,name:'WF5 QA R2'}},{expectedVersion:2,source:'wf5-qa',actor:customer});
  assert.equal(saved2.revision.id,'R0002');
  assert.equal(saved2.snapshot.render.productionReady,true);

  const shareResolved=db.resolveShare(share.token);
  assert.equal(shareResolved.revision.id,'R0001');
  assert.equal(shareResolved.revision.snapshot.render.productionReady,false);
  assert.equal(shareResolved.revision.snapshot.render.layers[0].state,'missing');
  const quoteAfter=db.getQuote(quote.reference);
  assert.equal(quoteAfter.project.revisionId,'R0001');
  assert.equal(quoteAfter.render.productionReady,false);
  assert.equal(quoteAfter.render.layers[0].state,'missing');
  assert.equal(db.getProject(saved1.project.id,{actor:customer}).currentRevisionId,'R0002');

  console.log(JSON.stringify({
    gate:'wf5-alpha26-promotion-path',
    stagedDraftCustomerVisible:false,
    missingReviewerRejected:true,
    masterApprovedPromotion:true,
    resolverAvailableAfterPromotion:true,
    immutableReviewEvidence:true,
    projectShareQuoteVisualLineage:true,
    status:'pass'
  },null,2));
}finally{db.close()}
