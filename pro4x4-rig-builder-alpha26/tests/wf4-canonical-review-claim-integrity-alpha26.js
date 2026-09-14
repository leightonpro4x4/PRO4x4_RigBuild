'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {createApp}=require('../server/server');
const workflow=require('../canonical-review-workflow.js');
const dossier=require('../canonical-governance-dossier.js');
const integrity=require('../audit-integrity.js');

function clone(v){return JSON.parse(JSON.stringify(v))}
function resignHandoff(h){const basis=Object.fromEntries(Object.entries(h).filter(([k])=>!['handoffId','handoffSha256'].includes(k)));return {...h,handoffSha256:integrity.sha256Hex(integrity.stableStringify(integrity.canonicalize(basis)))}}
function makeReviewReady(master,refs,admin){
  const next=clone(master),sha='7'.repeat(64);
  next.candidateHandoff=clone(next.candidateHandoff);
  next.candidateHandoff.candidate.checksumSha256=sha;
  next.candidateHandoff.candidate.hasAlpha=true;
  next.candidateHandoff.candidate.referenceIds=[...next.referencePack.requiredReferenceIds];
  next.candidateHandoff.upstreamReview.decision='passed-to-wf4';
  next.candidateHandoff.intake={...next.candidateHandoff.intake,state:'ready-for-wf4-review',blockers:[],nextAction:'WF4 canonical overlay review.',productionEligible:false,implicitPromotionAllowed:false};
  next.candidateHandoff=resignHandoff(next.candidateHandoff);
  next.canonicalReview={...(next.canonicalReview||{}),results:(next.canonicalView.reviewContractRequiredChecks||[]).map(id=>({id,result:'pending',note:null}))};
  next.governanceDossier=dossier.build({master:next,references:refs,preparedAt:'2026-09-14T11:40:00.000Z',preparedBy:admin});
  next.reviewWorkflow=workflow.build({master:next,references:refs,preparedAt:'2026-09-14T11:40:00.000Z',preparedBy:admin});
  return next;
}

(async()=>{
  const vehicleId='nissan-y62-warrior-2025',admin={actorId:'wf4-claim-admin',displayName:'WF4 Claim Admin',role:'admin'},reviewer={actorId:'wf4-claim-reviewer',displayName:'WF4 Claim Reviewer',role:'fitment'};
  const {server,db}=createApp({dbFile:':memory:',seed:false});
  db.syncVisualGovernanceRegistry({vehicleId},{actor:admin});
  let refs=db.listRenderAssets({vehicleId}).filter(x=>x.assetClass==='reference'),master=makeReviewReady(db.getRenderAsset('Y62-F34-V1-MASTER'),refs,admin);
  db.db.prepare('UPDATE render_assets SET payload_json=? WHERE asset_id=?').run(JSON.stringify(master),master.assetId);

  let out=db.claimCanonicalReviewWorkflow(master.assetId,{actor:reviewer});
  const first=clone(out.workflow.assignment);
  assert.match(first.claimSha256,/^[a-f0-9]{64}$/);assert.match(first.evidenceBindingSha256,/^[a-f0-9]{64}$/);assert.equal(first.authority,'review-claim-only');assert.equal(first.productionEligible,false);assert.equal(first.canonicalMasterId,master.assetId);assert.equal(first.candidateChecksumSha256,'7'.repeat(64));
  refs=db.listRenderAssets({vehicleId}).filter(x=>x.assetClass==='reference');master=db.getRenderAsset(master.assetId);
  assert.deepEqual(workflow.assignmentProblems(first,master,refs),[]);assert.equal(workflow.freshness(master.reviewWorkflow,master,refs),'current');

  // Same reviewer retry is idempotent and cannot mint a second claim envelope.
  out=db.claimCanonicalReviewWorkflow(master.assetId,{actor:reviewer});assert.equal(out.workflow.assignment.claimSha256,first.claimSha256);assert.equal(out.workflow.assignment.assignedAt,first.assignedAt);

  // Exact-claim concurrency guard: a stale UI claim token cannot release a newer/current claim.
  assert.throws(()=>db.releaseCanonicalReviewWorkflow(master.assetId,{actor:reviewer,expectedClaimSha256:'8'.repeat(64)}),e=>e.code==='review_claim_conflict');
  out=db.releaseCanonicalReviewWorkflow(master.assetId,{actor:reviewer,expectedClaimSha256:first.claimSha256});assert.equal(out.workflow.assignment,null);
  await new Promise(r=>setTimeout(r,3));out=db.claimCanonicalReviewWorkflow(master.assetId,{actor:reviewer});const second=clone(out.workflow.assignment);assert.notEqual(second.claimSha256,first.claimSha256,'a new claim after release must have a new signed identity');

  // Reviewer decisions bind the exact claim envelope, not merely a display name.
  const returned=(master.canonicalView.reviewContractRequiredChecks||[]).map((id,i)=>({id,result:i===0?'fail':'pending',note:i===0?'Controlled claim-integrity return.':null}));
  const decision=db.submitCanonicalReviewDecision(master.assetId,{decision:'returned',results:returned,notes:'Claim integrity regression fixture.'},{actor:reviewer}).decision;
  assert.equal(decision.evidenceBasis.reviewWorkflow.assignment.claimSha256,second.claimSha256);assert.equal(decision.evidenceBasis.reviewWorkflow.assignment.claimId,second.claimId);assert.equal(decision.evidenceBasis.reviewWorkflow.assignment.evidenceBindingSha256,second.evidenceBindingSha256);

  // A forged claim checksum invalidates the workflow even if reviewer/candidate strings are unchanged.
  const tampered=clone(db.getRenderAsset(master.assetId));tampered.reviewWorkflow.assignment.claimSha256='f'.repeat(64);
  assert.equal(workflow.freshness(tampered.reviewWorkflow,tampered,refs),'invalid');assert(workflow.problems(tampered.reviewWorkflow,tampered,refs).some(x=>x.includes('claim fingerprint')));

  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
  const base=`http://127.0.0.1:${server.address().port}`,headers={'content-type':'application/json','x-pro4x4-role':'fitment','x-pro4x4-actor':reviewer.actorId,'x-pro4x4-name':reviewer.displayName};
  try{
    let r=await fetch(`${base}/api/v1/staff/render-assets/${encodeURIComponent(master.assetId)}/review-workflow`,{method:'POST',headers,body:JSON.stringify({action:'release',claimSha256:first.claimSha256})});assert.equal(r.status,409);let body=await r.json();assert.equal(body.code,'review_claim_conflict');
    r=await fetch(`${base}/api/v1/staff/render-assets/${encodeURIComponent(master.assetId)}/review-workflow`,{method:'POST',headers,body:JSON.stringify({action:'release',claimSha256:second.claimSha256})});assert.equal(r.status,200);body=await r.json();assert.equal(body.workflow.assignment,null);
  } finally {await new Promise(resolve=>server.close(resolve))}

  const assetUi=fs.readFileSync(path.join(__dirname,'..','asset-registry.js'),'utf8'),readyUi=fs.readFileSync(path.join(__dirname,'..','readiness.js'),'utf8');
  assert.match(assetUi,/Claim SHA-256/);assert.match(assetUi,/claimSha256:selected\.reviewWorkflow/);assert.match(readyUi,/CLAIM VERIFIED/);
  assert.equal(db.listRenderAssets({vehicleId}).filter(x=>x.status==='production-ready').length,0);assert.equal(db.listAssetVersions(master.assetId).length,0);assert.notEqual(db.verifyAuditIntegrity().status,'broken');
  console.log(JSON.stringify({gate:'wf4-canonical-review-claim-integrity-alpha26',schemaVersion:workflow.schemaVersion,signedClaimEnvelope:true,claimBoundToMaster:true,claimBoundToCandidate:true,claimBoundToEvidence:true,idempotentSameReviewerClaim:true,staleReleaseBlocked:true,currentReleaseAllowed:true,reclaimGetsNewIdentity:true,reviewDecisionBindsExactClaim:true,claimTamperDetected:true,httpConcurrencyGuard:true,staffVisibility:true,productionEligibleByClaim:false,visualPromotion:false,policy:workflow.policy,status:'pass'},null,2));
  db.close();
})().catch(e=>{console.error(e);process.exit(1)});
