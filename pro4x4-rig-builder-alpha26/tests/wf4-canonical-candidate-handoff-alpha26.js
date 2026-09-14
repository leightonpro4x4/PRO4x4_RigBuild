'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const {createApp}=require('../server/server');
const handoffGov=require('../canonical-candidate-handoff.js');
const candidates=require('../y62-canonical-candidates.js');
const f34Review=require('../y62-f34-candidate-02-review.js');
const readinessGov=require('../render-readiness-governance.js');

(async()=>{
  const actor={actorId:'wf4-candidate-handoff-admin',displayName:'WF4 Candidate Handoff Admin',role:'admin'};
  const {server,db}=createApp({dbFile:':memory:',seed:false});
  const sync=db.syncVisualGovernanceRegistry({vehicleId:'nissan-y62-warrior-2025'},{actor});
  assert.equal(sync.createdCount,12);

  const f34=db.getRenderAsset('Y62-F34-V1-MASTER'),side=db.getRenderAsset('Y62-SIDE-V1-MASTER'),rear=db.getRenderAsset('Y62-R34-V1-MASTER');
  assert(f34?.candidateHandoff&&side?.candidateHandoff&&rear?.candidateHandoff,'all canonical masters must persist WF3 handoff state');
  const h=f34.candidateHandoff,latest=candidates.getLatest('front34');
  assert.equal(h.policy,'REFERENCE_BACKED_APPROVED_VISUALS_ONLY');
  assert.equal(h.handoffPolicy,handoffGov.handoffPolicy);
  assert.equal(h.candidate.candidateId,'Y62-F34-V1-CANDIDATE-02');
  assert.equal(h.candidate.checksumSha256,latest.file.checksumSha256);
  assert.equal(h.candidate.hasAlpha,true);
  assert.equal(h.candidate.productionEligible,false);
  assert.equal(h.intake.productionEligible,false);
  assert.equal(h.intake.implicitPromotionAllowed,false);
  assert.equal(h.intake.state,'blocked-upstream');
  assert.equal(h.upstreamReview.decision,'returned-to-wf3');
  assert.equal(h.upstreamReview.reviewId,f34Review.reviewId);
  assert(h.intake.blockers.length>=4);
  assert.equal(h.referencePack.packId,f34.referencePack.packId);
  assert.equal(h.referencePack.manifestSha256,f34.referencePack.manifestSha256);
  assert.deepEqual(h.referencePack.requiredReferenceIds,f34.referencePack.requiredReferenceIds);
  assert.match(h.handoffSha256,/^[a-f0-9]{64}$/);
  assert.deepEqual(handoffGov.problems(h,f34),[],'persisted handoff must pass its own integrity/binding validation');

  assert.equal(side.candidateHandoff.candidate,null);
  assert.equal(side.candidateHandoff.intake.state,'awaiting-wf3-candidate');
  assert.equal(side.candidateHandoff.intake.productionEligible,false);
  assert.equal(rear.candidateHandoff.candidate,null);
  assert.equal(rear.candidateHandoff.intake.state,'awaiting-wf3-candidate');
  const summary=handoffGov.summary([f34,side,rear]);
  assert.deepEqual({total:summary.total,withCandidate:summary.withCandidate,blockedUpstream:summary.blockedUpstream,awaitingCandidate:summary.awaitingCandidate,readyForWf4Review:summary.readyForWf4Review},{total:3,withCandidate:1,blockedUpstream:1,awaitingCandidate:2,readyForWf4Review:0});

  const candidatePath=path.join(__dirname,'..',h.candidate.source),candidateBytes=fs.readFileSync(candidatePath),actualSha=crypto.createHash('sha256').update(candidateBytes).digest('hex');
  assert.equal(actualSha,h.candidate.checksumSha256,'handoff must point at the exact existing WF3 candidate binary checksum');

  let current=readinessGov.assess(f34,db.listRenderAssets({vehicleId:f34.vehicleId}).filter(x=>x.assetClass==='reference'),db.listAssetVersions(f34.assetId));
  assert(current.blockers.some(x=>x.code==='WF3_CANDIDATE'),'render-readiness must expose the returned WF3 candidate as an explicit blocker');
  assert.equal(current.fingerprintBasis.asset.candidateHandoff.handoffSha256,h.handoffSha256,'readiness fingerprint must bind to the persisted candidate handoff');
  db.assessRenderReadiness({vehicleId:f34.vehicleId},{actor});
  let readiness=db.renderReadiness({vehicleId:f34.vehicleId}),f34Assessment=readiness.canonicalAssessments.find(x=>x.assetId===f34.assetId);
  assert.equal(f34Assessment.freshness,'current');

  const tampered={...db.getRenderAsset(f34.assetId),candidateHandoff:{...h,intake:{...h.intake,state:'ready-for-wf4-review'}}};
  db.db.prepare('UPDATE render_assets SET payload_json=? WHERE asset_id=?').run(JSON.stringify(tampered),f34.assetId);
  readiness=db.renderReadiness({vehicleId:f34.vehicleId});f34Assessment=readiness.canonicalAssessments.find(x=>x.assetId===f34.assetId);
  assert.equal(f34Assessment.freshness,'stale','changing WF3 handoff evidence must stale the persisted canonical readiness assessment');
  assert(handoffGov.problems(tampered.candidateHandoff,tampered).some(x=>x.includes('fingerprint')),'edited handoff state without a new governed fingerprint must be detected');

  const fileBefore=db.getRenderAsset(f34.assetId).file,governanceBefore=db.getRenderAsset(f34.assetId).governance,statusBefore=db.getRenderAsset(f34.assetId).status;
  const resync=db.syncVisualGovernanceRegistry({vehicleId:f34.vehicleId},{actor});
  const restored=db.getRenderAsset(f34.assetId);
  assert(resync.metadataUpdated.includes(f34.assetId));
  assert.equal(restored.candidateHandoff.handoffSha256,h.handoffSha256,'governance sync must restore authoritative static WF3 handoff metadata');
  assert.equal(restored.candidateHandoff.intake.state,'blocked-upstream');
  assert.deepEqual(restored.file,fileBefore,'handoff sync must not manufacture or replace a canonical production binary');
  assert.deepEqual(restored.governance,governanceBefore,'handoff sync must not grant canonical approval');
  assert.equal(restored.status,statusBefore);
  assert.equal(db.listAssetVersions(f34.assetId).length,0,'handoff metadata must not stage a governed asset version implicitly');

  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
  const base=`http://127.0.0.1:${server.address().port}`;
  try{
    const r=await fetch(`${base}/api/v1/staff/render-assets?vehicleId=${encodeURIComponent(f34.vehicleId)}`,{headers:{'x-pro4x4-role':'fitment','x-pro4x4-actor':'wf4-handoff-fitment'}});
    assert.equal(r.status,200);const out=await r.json(),row=out.find(x=>x.assetId===f34.assetId);
    assert.equal(row.candidateHandoff.candidate.candidateId,'Y62-F34-V1-CANDIDATE-02');
    assert.equal(row.candidateHandoff.intake.state,'blocked-upstream');
  }finally{await new Promise(resolve=>server.close(resolve))}

  const root=path.join(__dirname,'..'),assetHtml=fs.readFileSync(path.join(root,'asset-registry.html'),'utf8'),readinessHtml=fs.readFileSync(path.join(root,'readiness.html'),'utf8'),assetUi=fs.readFileSync(path.join(root,'asset-registry.js'),'utf8'),readinessUi=fs.readFileSync(path.join(root,'readiness.js'),'utf8');
  assert.match(assetHtml,/canonical-candidate-handoff\.js/);assert.match(readinessHtml,/canonical-candidate-handoff\.js/);
  assert.match(assetUi,/WF3 CANDIDATE HANDOFF/);assert.match(assetUi,/HANDOFF ONLY/);assert.match(readinessUi,/WF3 candidate handoff/);
  assert.equal(restored.status,'candidate');assert.equal(restored.governance.state,'master-draft');assert.equal(restored.candidateHandoff.candidate.productionEligible,false);

  console.log(JSON.stringify({gate:'wf4-canonical-candidate-handoff-alpha26',canonicalMasters:3,f34Candidate:'Y62-F34-V1-CANDIDATE-02',candidateChecksum:h.candidate.checksumSha256,handoffSha256:h.handoffSha256,f34State:h.intake.state,sideState:side.candidateHandoff.intake.state,rearState:rear.candidateHandoff.intake.state,upstreamBlockers:h.intake.blockers.length,readinessFingerprintsHandoff:true,staleOnHandoffMutation:true,syncRestoresAuthoritativeHandoff:true,implicitVersionStaging:false,visualPromotion:false,policy:handoffGov.policy,status:'pass'},null,2));
})().catch(e=>{console.error(e);process.exit(1)});
