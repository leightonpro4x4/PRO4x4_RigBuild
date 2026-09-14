'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {RigDatabase}=require('../server/database');
const attention=require('../visual-governance-attention.js');
const boundary=require('../visual-governance-write-boundary.js');
const root=path.join(__dirname,'..');
const actor={actorId:'wf4-attention-admin',displayName:'WF4 Attention Admin',role:'admin'};
const vehicleId='nissan-y62-warrior-2025';
const clone=v=>JSON.parse(JSON.stringify(v));
const db=new RigDatabase(':memory:');
try{
  const sync=db.syncVisualGovernanceRegistry({vehicleId},{actor});
  assert.equal(sync.attentionUpdatedCount,3,'initial governance sync must persist one attention snapshot per canonical master');
  assert.equal(sync.summary.governanceAttention.total,3);
  assert.equal(sync.summary.governanceAttention.current,3);
  assert.equal(sync.summary.governanceAttention.openBlockers,10);
  assert(sync.summary.governanceAttention.openActions>=3);

  const records=db.listRenderAssets({vehicleId}),refs=records.filter(x=>x.assetClass==='reference'),masters=records.filter(x=>attention.canonical(x));
  assert.equal(masters.length,3);
  for(const master of masters){
    const versions=db.listAssetVersions(master.assetId),saved=master.governanceAttention;
    assert(saved,'canonical master must carry persisted staff attention snapshot');
    assert.match(saved.attentionSha256,/^[a-f0-9]{64}$/);
    assert.match(saved.basisSha256,/^[a-f0-9]{64}$/);
    assert.equal(saved.policy,'REFERENCE_BACKED_APPROVED_VISUALS_ONLY');
    assert.equal(saved.authority,'inspection-and-routing-only');
    assert.equal(saved.productionEligible,false);
    assert.equal(attention.freshness(saved,master,refs,versions),'current');
    assert(saved.summary.blockers>0,'blocked alpha canonical masters must expose blockers in the staff queue');
  }

  let f34=db.getRenderAsset('Y62-F34-V1-MASTER');
  let f34Ids=f34.governanceAttention.issues.map(x=>x.id);
  assert(f34Ids.includes('WF3_CANDIDATE'),'F34 queue must retain the blocked WF3 candidate dependency');
  assert(f34Ids.includes('CANONICAL_REVIEW'),'F34 queue must expose canonical review work');
  assert(f34Ids.includes('PRODUCTION_READINESS'),'F34 queue must expose production-readiness blockers');
  assert.equal(f34.governanceAttention.basis.canonicalMaster.referencePack.packId,'Y62-OWNER-REFERENCE-PACK-V1');
  assert.equal(f34.governanceAttention.basis.canonicalMaster.candidateHandoff.candidateId,'Y62-F34-V1-CANDIDATE-02');

  const side=db.getRenderAsset('Y62-SIDE-V1-MASTER');
  assert(side.governanceAttention.issues.some(x=>x.id==='SOURCE_GAP'),'SIDE queue must preserve the required source-geometry gap rather than infer it away');
  assert(side.governanceAttention.issues.some(x=>x.id==='WF3_CANDIDATE'));
  const r34=db.getRenderAsset('Y62-R34-V1-MASTER');
  assert(r34.governanceAttention.issues.some(x=>x.id==='WF3_CANDIDATE'));

  const readiness=db.renderReadiness({vehicleId});
  assert.equal(readiness.governanceSchemaVersion,'0.26.29');
  assert.equal(readiness.governanceAttention.total,3);
  assert.equal(readiness.governanceAttention.current,3);
  assert(readiness.governanceAttention.openBlockers>0);

  const tamper=clone(f34);tamper.governanceAttention.attentionSha256='f'.repeat(64);
  assert.throws(()=>db.upsertRenderAsset(tamper,{actor}),e=>e?.code==='governance_metadata_protected'&&e.changedPaths?.includes('governanceAttention'),'generic asset editor must not be able to forge the persisted attention snapshot');
  assert(boundary.summary(f34).protectedPaths.includes('governanceAttention'),'write boundary must own the persisted governance-attention field');

  const refId=f34.referencePack.requiredReferenceIds[0],ref=db.getRenderAsset(refId),drift=clone(ref);
  drift.file.checksumSha256='0'.repeat(64);
  db.db.prepare('UPDATE render_assets SET payload_json=? WHERE asset_id=?').run(JSON.stringify(drift),refId);
  let changedRefs=db.listRenderAssets({vehicleId}).filter(x=>x.assetClass==='reference');
  assert.equal(attention.freshness(f34.governanceAttention,f34,changedRefs,db.listAssetVersions(f34.assetId)),'stale','backing reference drift must visibly stale the persisted queue snapshot');

  const resync=db.syncVisualGovernanceRegistry({vehicleId},{actor});
  assert(resync.attentionUpdated.includes(f34.assetId),'governance sync must refresh an evidence-drifted canonical attention snapshot');
  f34=db.getRenderAsset(f34.assetId);changedRefs=db.listRenderAssets({vehicleId}).filter(x=>x.assetClass==='reference');
  assert.equal(attention.freshness(f34.governanceAttention,f34,changedRefs,db.listAssetVersions(f34.assetId)),'current');
  assert(f34.governanceAttention.issues.some(x=>x.id==='REFERENCE_PACK'),'refreshed snapshot must surface the now-stale reference provenance/pack integrity problem');
  assert.equal(db.getRenderAsset(refId).status,'reference-only');
  assert.equal(db.getRenderAsset(refId).referenceEvidence.productionEligible,false);
  assert.equal(db.listRenderAssets({vehicleId}).filter(x=>x.status==='production-ready').length,0,'attention refresh must never promote a visual');

  const events=db.listAudit({action:'visual-governance.registry.synced',entityType:'visual-governance',entityId:vehicleId,limit:20});
  assert(events.some(e=>(e.metadata?.attentionUpdated||[]).includes(f34.assetId)),'attention refresh must be visible in the existing audit chain');
  assert(events.every(e=>e.integrity?.eventHash),'attention updates remain inside the tamper-evident audit ledger');

  const readyHtml=fs.readFileSync(path.join(root,'readiness.html'),'utf8'),readyJs=fs.readFileSync(path.join(root,'readiness.js'),'utf8'),assetHtml=fs.readFileSync(path.join(root,'asset-registry.html'),'utf8'),assetJs=fs.readFileSync(path.join(root,'asset-registry.js'),'utf8'),store=fs.readFileSync(path.join(root,'asset-registry-store.js'),'utf8'),backend=fs.readFileSync(path.join(root,'backend-client.js'),'utf8');
  assert.match(readyHtml,/GOVERNANCE ATTENTION QUEUE/);
  assert.match(readyHtml,/visual-governance-attention\.js/);
  assert.match(readyJs,/OPEN BLOCKERS/);
  assert.match(readyJs,/inspection-and-routing-only/);
  assert.match(assetHtml,/visual-governance-attention\.js/);
  assert.match(assetJs,/GOVERNANCE ATTENTION SNAPSHOT/);
  assert.match(store,/governanceAttention/,'browser-local shared registry must persist the same attention metadata');
  assert.match(backend,/governanceAttention/,'browser-local readiness response must expose the same attention summary');

  console.log(JSON.stringify({gate:'wf4-governance-attention-alpha26',canonicalMasters:3,persistedAttentionSnapshots:true,initialOpenBlockers:sync.summary.governanceAttention.openBlockers,initialOpenActions:sync.summary.governanceAttention.openActions,f34CandidateDependency:true,sideSourceGapRetained:true,protectedSystemMetadata:true,referenceDriftStalesSnapshot:true,resyncRefreshesSnapshot:true,referencePackProblemSurfaced:true,auditVisible:true,browserServerSharedBackbone:true,visualPromotion:false,policy:attention.policy,status:'pass'},null,2));
}finally{db.close()}
