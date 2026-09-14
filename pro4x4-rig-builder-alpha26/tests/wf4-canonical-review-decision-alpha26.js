'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {createApp}=require('../server/server');
const decisionGov=require('../canonical-review-decision.js');
const workflowGov=require('../canonical-review-workflow.js');
const dossierGov=require('../canonical-governance-dossier.js');
const integrity=require('../audit-integrity.js');

function resignHandoff(h){
  const basis=Object.fromEntries(Object.entries(h).filter(([k])=>!['handoffId','handoffSha256'].includes(k)));
  return {...h,handoffSha256:integrity.sha256Hex(integrity.stableStringify(integrity.canonicalize(basis)))};
}
function writeMaster(db,master){db.db.prepare('UPDATE render_assets SET payload_json=? WHERE asset_id=?').run(JSON.stringify(master),master.assetId)}

(async()=>{
  const vehicleId='nissan-y62-warrior-2025';
  const admin={actorId:'wf4-decision-admin',displayName:'WF4 Decision Admin',role:'admin'};
  const reviewer={actorId:'wf4-decision-reviewer',displayName:'WF4 Decision Reviewer',role:'fitment'};
  const other={actorId:'wf4-decision-other',displayName:'Other Reviewer',role:'fitment'};
  const {server,db}=createApp({dbFile:':memory:',seed:false});
  const sync=db.syncVisualGovernanceRegistry({vehicleId},{actor:admin});
  assert.equal(sync.summary.productionEligible,0);
  let refs=db.listRenderAssets({vehicleId}).filter(x=>x.assetClass==='reference');
  let f34=db.getRenderAsset('Y62-F34-V1-MASTER');
  assert.equal(decisionGov.freshness(f34.canonicalReviewDecision,f34,refs),'unrecorded');
  assert.equal(f34.canonicalReviewDecision,undefined);
  assert.throws(()=>db.submitCanonicalReviewDecision(f34.assetId,{decision:'approved',results:[]},{actor:reviewer}),e=>e.code==='canonical_review_decision_blocked'&&/assigned reviewer/i.test(e.message));

  const candidateSha='7'.repeat(64),clean=JSON.parse(JSON.stringify(f34));
  clean.candidateHandoff=JSON.parse(JSON.stringify(clean.candidateHandoff));
  clean.candidateHandoff.candidate.checksumSha256=candidateSha;
  clean.candidateHandoff.candidate.hasAlpha=true;
  clean.candidateHandoff.candidate.referenceIds=[...clean.referencePack.requiredReferenceIds];
  clean.candidateHandoff.upstreamReview.decision='passed-to-wf4';
  clean.candidateHandoff.intake={...clean.candidateHandoff.intake,state:'ready-for-wf4-review',blockers:[],nextAction:'WF4 reviewer decision fixture.',productionEligible:false,implicitPromotionAllowed:false};
  clean.candidateHandoff=resignHandoff(clean.candidateHandoff);
  clean.canonicalReview={...(clean.canonicalReview||{}),results:(clean.canonicalView.reviewContractRequiredChecks||[]).map(id=>({id,result:'pending',note:null}))};
  clean.governanceDossier=dossierGov.build({master:clean,references:refs,preparedAt:'2026-09-14T04:40:00.000Z',preparedBy:admin});
  clean.reviewWorkflow=workflowGov.build({master:clean,references:refs,preparedAt:'2026-09-14T04:40:00.000Z',preparedBy:admin});
  writeMaster(db,clean);
  f34=db.claimCanonicalReviewWorkflow(clean.assetId,{actor:reviewer}).asset;
  refs=db.listRenderAssets({vehicleId}).filter(x=>x.assetClass==='reference');
  assert.equal(f34.reviewWorkflow.assignment.reviewerActorId,reviewer.actorId);

  const pending=(f34.canonicalView.reviewContractRequiredChecks||[]).map(id=>({id,result:'pending',note:null}));
  assert.throws(()=>db.submitCanonicalReviewDecision(f34.assetId,{decision:'approved',results:pending},{actor:reviewer}),e=>e.code==='canonical_review_decision_blocked'&&/all 8 locked checks/i.test(e.message));
  assert.throws(()=>db.submitCanonicalReviewDecision(f34.assetId,{decision:'approved',results:pending},{actor:other}),e=>e.code==='canonical_review_decision_blocked'&&/assigned to/i.test(e.message));

  const returnedResults=(f34.canonicalView.reviewContractRequiredChecks||[]).map((id,i)=>({id,result:i===0?'fail':'pending',note:i===0?'Controlled return fixture.':null}));
  let out=db.submitCanonicalReviewDecision(f34.assetId,{decision:'returned',results:returnedResults,notes:'Return to WF3: controlled regression fixture.'},{actor:reviewer});
  assert.equal(out.decision.decision,'returned');
  assert.equal(out.decision.productionEligible,false);
  assert.equal(out.asset.status,'candidate');
  assert.equal(out.asset.governance.state,'master-draft');
  assert.equal(db.listAssetVersions(f34.assetId).length,0);
  assert.equal(decisionGov.freshness(out.decision,out.asset,refs),'current');

  const tampered=JSON.parse(JSON.stringify(out.asset));tampered.canonicalReviewDecision.decision='approved';
  assert.throws(()=>db.upsertRenderAsset(tampered,{actor:admin}),e=>e.code==='governance_metadata_protected'&&e.changedPaths.includes('canonicalReviewDecision'));

  // Simulate reviewer re-checking the same candidate after the returned item is corrected, then refresh the pre-approval packet/workflow.
  let corrected=db.getRenderAsset(f34.assetId);const pass=(corrected.canonicalView.reviewContractRequiredChecks||[]).map(id=>({id,result:'pass',note:'Controlled reviewer pass.'}));
  corrected.canonicalReview={...(corrected.canonicalReview||{}),results:pass};writeMaster(db,corrected);
  db.refreshCanonicalGovernanceDossier(f34.assetId,{actor:admin});db.refreshCanonicalReviewWorkflow(f34.assetId,{actor:admin});
  corrected=db.getRenderAsset(f34.assetId);assert.equal(corrected.reviewWorkflow.assignment.reviewerActorId,reviewer.actorId,'same evidence binding may preserve the identified reviewer claim');
  out=db.submitCanonicalReviewDecision(f34.assetId,{decision:'approved',results:pass,notes:'Exact evidence-bound reviewer approval.'},{actor:reviewer});
  assert.equal(out.decision.decision,'approved');assert.match(out.decision.decisionSha256,/^[a-f0-9]{64}$/);assert.match(out.decision.basisSha256,/^[a-f0-9]{64}$/);
  assert.equal(out.decision.candidateChecksumSha256,candidateSha);assert.equal(decisionGov.freshness(out.decision,out.asset,refs),'current');
  assert.deepEqual(decisionGov.approvalProblems(out.decision,out.asset,refs,reviewer,candidateSha),[]);
  assert(decisionGov.approvalProblems(out.decision,out.asset,refs,other,candidateSha).some(x=>x.includes('acting reviewer')));
  assert(decisionGov.approvalProblems(out.decision,out.asset,refs,reviewer,'8'.repeat(64)).some(x=>x.includes('binary checksum')));

  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
  const base=`http://127.0.0.1:${server.address().port}`;
  try{
    const salesRes=await fetch(`${base}/api/v1/staff/render-assets/${encodeURIComponent(f34.assetId)}/review-decision`,{method:'POST',headers:{'content-type':'application/json','x-pro4x4-role':'sales','x-pro4x4-actor':'wf4-decision-sales'},body:JSON.stringify({decision:'approved',results:pass})});
    assert.equal(salesRes.status,403,'sales remains inspection-only for reviewer decisions');
    const fitmentRes=await fetch(`${base}/api/v1/staff/render-assets/${encodeURIComponent(f34.assetId)}/review-decision`,{method:'POST',headers:{'content-type':'application/json','x-pro4x4-role':'fitment','x-pro4x4-actor':reviewer.actorId,'x-pro4x4-name':reviewer.displayName},body:JSON.stringify({decision:'approved',results:pass,notes:'HTTP exact-evidence approval refresh.'})});
    assert.equal(fitmentRes.status,200);const body=await fitmentRes.json();assert.equal(body.decision.decision,'approved');assert.equal(body.decision.productionEligible,false);
  } finally {await new Promise(resolve=>server.close(resolve))}

  f34=db.getRenderAsset(f34.assetId);const refId=f34.referencePack.requiredReferenceIds[0],mutated=db.getRenderAsset(refId);mutated.file={...mutated.file,checksumSha256:'9'.repeat(64)};writeMaster(db,mutated);
  refs=db.listRenderAssets({vehicleId}).filter(x=>x.assetClass==='reference');f34=db.getRenderAsset(f34.assetId);
  assert.equal(decisionGov.freshness(f34.canonicalReviewDecision,f34,refs),'stale','reference evidence drift must stale the reviewer decision');
  const productionAttempt=JSON.parse(JSON.stringify(f34));productionAttempt.file={...(productionAttempt.file||{}),checksumSha256:candidateSha,mimeType:'image/png',width:2200,height:1400,hasAlpha:true};productionAttempt.provenance={...(productionAttempt.provenance||{}),licenceStatus:'owned'};productionAttempt.cameraGeometry={...(productionAttempt.cameraGeometry||{}),matched:true};productionAttempt.governance={...(productionAttempt.governance||{}),state:'master-approved',reviewedBy:reviewer.displayName,reviewedAt:new Date().toISOString()};
  assert.throws(()=>db.prepareCanonicalReviewEvidence(productionAttempt,reviewer),e=>e.code==='canonical_review_decision_blocked'&&/stale/i.test(e.message));

  const audit=db.listAudit({entityType:'render-asset',entityId:f34.assetId,limit:100});
  assert(audit.filter(x=>x.action==='canonical.review-decision.recorded').length>=3);
  assert(audit.some(x=>x.action==='visual-governance.protected-write.blocked'));
  assert.notEqual(db.verifyAuditIntegrity().status,'broken');

  const root=path.join(__dirname,'..'),assetHtml=fs.readFileSync(path.join(root,'asset-registry.html'),'utf8'),readyHtml=fs.readFileSync(path.join(root,'readiness.html'),'utf8'),assetUi=fs.readFileSync(path.join(root,'asset-registry.js'),'utf8'),readyUi=fs.readFileSync(path.join(root,'readiness.js'),'utf8'),boundary=fs.readFileSync(path.join(root,'visual-governance-write-boundary.js'),'utf8');
  assert.match(assetHtml,/canonical-review-decision\.js/);assert.match(readyHtml,/canonical-review-decision\.js/);assert.match(assetUi,/CANONICAL REVIEW DECISION/);assert.match(assetUi,/RECORD APPROVAL DECISION/);assert.match(assetUi,/RETURN CANDIDATE/);assert.match(readyUi,/Reviewer decision/);assert.match(boundary,/canonicalReviewDecision/);

  console.log(JSON.stringify({gate:'wf4-canonical-review-decision-alpha26',canonicalMasters:3,cleanStateDecisions:0,blockedBeforeAssignment:true,approvalRequiresAllLockedChecks:true,wrongReviewerBlocked:true,returnedDecisionPersisted:true,returnedDecisionNonPromotional:true,approvedDecisionPersisted:true,decisionFingerprintBound:true,candidateChecksumBound:true,genericTamperBlocked:true,salesMutationDenied:true,fitmentEndpoint:true,referenceDriftStalesDecision:true,productionGateRequiresCurrentApprovedDecision:true,auditSealed:true,visualPromotion:false,policy:decisionGov.policy,status:'pass'},null,2));
  db.close();
})().catch(e=>{console.error(e);process.exit(1)});
