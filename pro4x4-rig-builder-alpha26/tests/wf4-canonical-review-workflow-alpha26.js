'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {createApp}=require('../server/server');
const workflowGov=require('../canonical-review-workflow.js');
const dossierGov=require('../canonical-governance-dossier.js');
const integrity=require('../audit-integrity.js');

function resignHandoff(h){
  const basis=Object.fromEntries(Object.entries(h).filter(([k])=>!['handoffId','handoffSha256'].includes(k)));
  return {...h,handoffSha256:integrity.sha256Hex(integrity.stableStringify(integrity.canonicalize(basis)))};
}

(async()=>{
  const vehicleId='nissan-y62-warrior-2025';
  const admin={actorId:'wf4-review-admin',displayName:'WF4 Review Admin',role:'admin'};
  const reviewer={actorId:'wf4-reviewer-01',displayName:'WF4 Canonical Reviewer',role:'fitment'};
  const reviewer2={actorId:'wf4-reviewer-02',displayName:'Other Reviewer',role:'fitment'};
  const sales={actorId:'wf4-review-sales',displayName:'WF4 Sales',role:'sales'};
  const {server,db}=createApp({dbFile:':memory:',seed:false});
  const sync=db.syncVisualGovernanceRegistry({vehicleId},{actor:admin});
  assert.equal(sync.createdCount,12);
  assert.equal(sync.workflowPreparedCount,3,'governance sync must persist reviewer workflow for each canonical master');
  assert.equal(sync.summary.reviewWorkflows.total,3);
  assert.equal(sync.summary.reviewWorkflows.claimed,0);

  let all=db.listRenderAssets({vehicleId}),refs=all.filter(x=>x.assetClass==='reference');
  let f34=db.getRenderAsset('Y62-F34-V1-MASTER'),side=db.getRenderAsset('Y62-SIDE-V1-MASTER'),rear=db.getRenderAsset('Y62-R34-V1-MASTER');
  for(const master of [f34,side,rear]){
    const wf=master.reviewWorkflow;
    assert(wf,'canonical master must persist review-workflow metadata');
    assert.equal(wf.policy,'REFERENCE_BACKED_APPROVED_VISUALS_ONLY');
    assert.equal(wf.authority,'review-assignment-only');
    assert.equal(wf.productionEligible,false);
    assert.match(wf.workflowSha256,/^[a-f0-9]{64}$/);
    assert.match(wf.evidenceBindingSha256,/^[a-f0-9]{64}$/);
    assert.equal(workflowGov.freshness(wf,master,refs),'current');
    assert.equal(wf.assignment,null);
  }
  assert.equal(f34.reviewWorkflow.intake.sourceState,'blocked-upstream');
  assert.equal(f34.reviewWorkflow.intake.canClaim,false);
  assert.equal(side.reviewWorkflow.intake.sourceState,'awaiting-wf3-candidate');
  assert.equal(rear.reviewWorkflow.intake.sourceState,'awaiting-wf3-candidate');
  assert.equal(f34.reviewWorkflow.evidenceBinding.candidateHandoff.candidateId,'Y62-F34-V1-CANDIDATE-02');
  assert.equal(f34.reviewWorkflow.evidenceBinding.referencePack.packId,'Y62-OWNER-REFERENCE-PACK-V1');
  assert.equal(f34.reviewWorkflow.evidenceBinding.referencePack.referenceSnapshots.length,3);
  await assert.rejects(Promise.resolve().then(()=>db.claimCanonicalReviewWorkflow(f34.assetId,{actor:reviewer})),e=>e.code==='review_claim_blocked');
  await assert.rejects(Promise.resolve().then(()=>db.claimCanonicalReviewWorkflow(f34.assetId,{actor:sales})),e=>e.code==='review_claim_forbidden');

  // Simulate a future clean WF3 handoff without promoting or staging any visual binary.
  const cleanSha='7'.repeat(64),clean=JSON.parse(JSON.stringify(f34));
  clean.candidateHandoff=JSON.parse(JSON.stringify(clean.candidateHandoff));
  clean.candidateHandoff.candidate.checksumSha256=cleanSha;
  clean.candidateHandoff.candidate.hasAlpha=true;
  clean.candidateHandoff.candidate.referenceIds=[...clean.referencePack.requiredReferenceIds];
  clean.candidateHandoff.upstreamReview.decision='passed-to-wf4';
  clean.candidateHandoff.intake={...clean.candidateHandoff.intake,state:'ready-for-wf4-review',blockers:[],nextAction:'WF4 canonical overlay review.',productionEligible:false,implicitPromotionAllowed:false};
  clean.candidateHandoff=resignHandoff(clean.candidateHandoff);
  clean.canonicalReview={...(clean.canonicalReview||{}),results:(clean.canonicalView.reviewContractRequiredChecks||[]).map(id=>({id,result:'pending',note:null}))};
  clean.governanceDossier=dossierGov.build({master:clean,references:refs,preparedAt:new Date().toISOString(),preparedBy:admin});
  clean.reviewWorkflow=workflowGov.build({master:clean,references:refs,preparedAt:new Date().toISOString(),preparedBy:admin});
  assert.equal(dossierGov.reviewEligibility(clean,refs).state,'ready-for-review');
  assert.equal(workflowGov.intake(clean,refs).canClaim,true);
  db.db.prepare('UPDATE render_assets SET payload_json=? WHERE asset_id=?').run(JSON.stringify(clean),clean.assetId);

  const claimed=db.claimCanonicalReviewWorkflow(clean.assetId,{actor:reviewer});
  f34=claimed.asset;refs=db.listRenderAssets({vehicleId}).filter(x=>x.assetClass==='reference');
  assert.equal(f34.reviewWorkflow.assignment.reviewerActorId,reviewer.actorId);
  assert.equal(f34.reviewWorkflow.assignment.reviewerDisplayName,reviewer.displayName);
  assert.equal(f34.reviewWorkflow.productionEligible,false);
  assert.equal(f34.status,'candidate','claiming review must not make the canonical master production-ready');
  assert.equal(f34.governance.state,'master-draft','claiming review must not grant master approval');
  assert.equal(db.listAssetVersions(f34.assetId).length,0,'claiming review must not stage a binary version');
  await assert.rejects(Promise.resolve().then(()=>db.claimCanonicalReviewWorkflow(f34.assetId,{actor:reviewer2})),e=>e.code==='review_already_claimed');

  // Reviewer assignment must gate canonical approval identity and exact candidate checksum.
  const reviewReady=JSON.parse(JSON.stringify(f34));
  reviewReady.file={...(reviewReady.file||{}),checksumSha256:cleanSha,mimeType:'image/png',width:2200,height:1400,hasAlpha:true};
  reviewReady.provenance={...(reviewReady.provenance||{}),licenceStatus:'owned',sourceType:'owner-derived-production'};
  reviewReady.cameraGeometry={...(reviewReady.cameraGeometry||{}),matched:true};
  reviewReady.governance={...(reviewReady.governance||{}),state:'master-approved',reviewedBy:reviewer.displayName,reviewedAt:new Date().toISOString()};
  reviewReady.canonicalReview={...(reviewReady.canonicalReview||{}),contractId:reviewReady.canonicalView.reviewContractId,results:(reviewReady.canonicalView.reviewContractRequiredChecks||[]).map(id=>({id,result:'pass',note:'WF4 controlled review test pass.'}))};
  assert.deepEqual(workflowGov.approvalProblems(reviewReady,refs,reviewer),[]);
  assert(workflowGov.approvalProblems(reviewReady,refs,reviewer2).some(x=>x.includes('not the acting reviewer')));
  const wrongChecksum=JSON.parse(JSON.stringify(reviewReady));wrongChecksum.file.checksumSha256='8'.repeat(64);
  assert(workflowGov.approvalProblems(wrongChecksum,refs,reviewer).some(x=>x.includes('candidate binding')));
  const decisionOut=db.submitCanonicalReviewDecision(f34.assetId,{decision:'approved',results:reviewReady.canonicalReview.results,notes:'WF4 controlled review workflow approval fixture.'},{actor:reviewer});
  reviewReady.canonicalReviewDecision=decisionOut.decision;reviewReady.reviewWorkflow=decisionOut.asset.reviewWorkflow;
  db.prepareCanonicalReviewEvidence(reviewReady,reviewer);
  assert.equal(reviewReady.canonicalReviewEvidence.verdict,'pass');
  assert.equal(reviewReady.canonicalReviewEvidence.reviewedBy,reviewer.displayName);
  await assert.rejects(Promise.resolve().then(()=>db.prepareCanonicalReviewEvidence(reviewReady,reviewer2)),e=>['canonical_review_assignment_blocked','canonical_review_decision_blocked'].includes(e.code));

  // Evidence drift must stale the assignment basis; explicit refresh invalidates the old claim.
  const refId=f34.referencePack.requiredReferenceIds[0],mutatedRef=db.getRenderAsset(refId);
  mutatedRef.file={...(mutatedRef.file||{}),checksumSha256:'9'.repeat(64)};
  db.db.prepare('UPDATE render_assets SET payload_json=? WHERE asset_id=?').run(JSON.stringify(mutatedRef),refId);
  f34=db.getRenderAsset(f34.assetId);refs=db.listRenderAssets({vehicleId}).filter(x=>x.assetClass==='reference');
  assert.equal(workflowGov.freshness(f34.reviewWorkflow,f34,refs),'stale');
  const refreshed=db.refreshCanonicalReviewWorkflow(f34.assetId,{actor:admin});
  assert(refreshed.invalidatedAssignment,'evidence-changing refresh must explicitly invalidate the previous reviewer claim');
  assert.equal(refreshed.workflow.assignment,null);
  assert.equal(refreshed.workflow.productionEligible,false);

  const audit=db.listAudit({entityType:'render-asset',entityId:f34.assetId,limit:100});
  assert(audit.some(x=>x.action==='canonical.review-workflow.claimed'));
  assert(audit.some(x=>x.action==='canonical.review-workflow.refreshed'));
  assert.notEqual(db.verifyAuditIntegrity().status,'broken');

  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
  const base=`http://127.0.0.1:${server.address().port}`;
  try{
    const salesRes=await fetch(`${base}/api/v1/staff/render-assets/${encodeURIComponent(f34.assetId)}/review-workflow`,{method:'POST',headers:{'content-type':'application/json','x-pro4x4-role':'sales','x-pro4x4-actor':'wf4-sales-http'},body:JSON.stringify({action:'refresh'})});
    assert.equal(salesRes.status,403,'sales must remain inspection-only for canonical review assignment');
    const fitmentRes=await fetch(`${base}/api/v1/staff/render-assets/${encodeURIComponent(f34.assetId)}/review-workflow`,{method:'POST',headers:{'content-type':'application/json','x-pro4x4-role':'fitment','x-pro4x4-actor':'wf4-fitment-http','x-pro4x4-name':'WF4 Fitment HTTP'},body:JSON.stringify({action:'refresh'})});
    assert.equal(fitmentRes.status,200);const body=await fitmentRes.json();
    assert.equal(body.workflow.authority,'review-assignment-only');
    assert.equal(body.workflow.productionEligible,false);
  }finally{await new Promise(resolve=>server.close(resolve))}

  const root=path.join(__dirname,'..'),assetHtml=fs.readFileSync(path.join(root,'asset-registry.html'),'utf8'),readyHtml=fs.readFileSync(path.join(root,'readiness.html'),'utf8'),assetUi=fs.readFileSync(path.join(root,'asset-registry.js'),'utf8'),readyUi=fs.readFileSync(path.join(root,'readiness.js'),'utf8');
  assert.match(assetHtml,/canonical-review-workflow\.js/);assert.match(readyHtml,/canonical-review-workflow\.js/);
  assert.match(assetUi,/CANONICAL REVIEW WORKFLOW/);assert.match(assetUi,/CLAIM REVIEW/);assert.match(assetUi,/RELEASE CLAIM/);
  assert.match(readyUi,/Canonical reviewer assignment/);

  console.log(JSON.stringify({gate:'wf4-canonical-review-workflow-alpha26',canonicalMasters:3,workflowPrepared:3,f34BootstrapState:'blocked-upstream',sideBootstrapState:'awaiting-wf3-candidate',rearBootstrapState:'awaiting-wf3-candidate',claimBlockedUntilEvidenceReady:true,successfulGovernedClaimProved:true,assignmentBoundToExactCandidateChecksum:true,wrongReviewerBlocked:true,evidenceDriftStalesWorkflow:true,explicitRefreshInvalidatesClaim:true,salesMutationDenied:true,fitmentEndpoint:true,implicitApproval:false,implicitVersionStaging:false,visualPromotion:false,policy:workflowGov.policy,status:'pass'},null,2));
  db.close();
})().catch(e=>{console.error(e);process.exit(1)});
