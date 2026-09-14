'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {RigDatabase}=require('../server/database');
const overlay=require('../y62-f34-overlay-review-contract');
const integrity=require('../audit-integrity.js');
const root=path.join(__dirname,'..');
const actor={actorId:'wf4-canonical-reviewer',displayName:'WF4 Canonical Reviewer',role:'admin'};
const db=new RigDatabase(':memory:');

function reviewedCandidate(payload,{checksumNote='Synthetic canonical review fixture only.'}={}){
  return {...payload,
    provenance:{...payload.provenance,sourceType:'reference-derived-canonical',licenceStatus:'owned',licenceNote:checksumNote},
    cameraGeometry:{...payload.cameraGeometry,matched:true,notes:'Locked Y62-F34-V1 overlay contract verified in synthetic regression fixture.'},
    governance:{...payload.governance,state:'master-approved',reviewedBy:actor.actorId,reviewedAt:'2026-09-14T02:25:00+09:30'},
    canonicalReview:{schemaVersion:'0.26.11',contractId:overlay.reviewContractId,results:overlay.checks.filter(x=>x.required).map(x=>({id:x.id,result:'pass',note:`${x.id} synthetic pass fixture`})),sourceGapResolution:null,notes:'Synthetic regression fixture proving persisted contract evidence.'},
    approval:{...payload.approval,notes:'All locked F34 review checks passed in synthetic test fixture.'}
  };
}

try{
  const sync=db.syncVisualGovernanceRegistry({vehicleId:'nissan-y62-warrior-2025'},{actor});
  assert.equal(sync.summary.byClass.reference,9);
  let master=db.getRenderAsset('Y62-F34-V1-MASTER');
  assert.ok(master,'governed F34 canonical master must be persisted');
  assert.equal(master.canonicalView.reviewContractId,overlay.reviewContractId);
  assert.equal(master.canonicalView.reviewContractRequiredChecks.length,8);

  const directObject={checksumSha256:'a'.repeat(64),objectKey:'sha256/aa/wf4-canonical-direct.png',mimeType:'image/png',width:1672,height:615,hasAlpha:true,transparencyVerified:true,sizeBytes:111111};
  db.attachAssetObject(master.assetId,directObject,{actor});
  master=db.getRenderAsset(master.assetId);
  const directAttempt={...master,status:'production-ready',provenance:{...master.provenance,sourceType:'reference-derived-canonical',licenceStatus:'owned',licenceNote:'Synthetic direct-upsert gate fixture.'},cameraGeometry:{...master.cameraGeometry,matched:true},governance:{...master.governance,state:'master-approved',reviewedBy:actor.actorId,reviewedAt:'2026-09-14T02:20:00+09:30'}};
  assert.throws(()=>db.upsertRenderAsset(directAttempt,{actor}),e=>e?.code==='canonical_review_decision_blocked','direct canonical production must fail without a persisted evidence-bound reviewer decision');

  const object={checksumSha256:'b'.repeat(64),objectKey:'sha256/bb/wf4-canonical-version.png',mimeType:'image/png',width:1672,height:615,hasAlpha:true,transparencyVerified:true,sizeBytes:222222};
  // Strengthened WF4 reviewer workflow: simulate a clean WF3 handoff for this synthetic promotion fixture, then explicitly claim the exact evidence-bound review.
  master=db.getRenderAsset(master.assetId);const cleanHandoff=JSON.parse(JSON.stringify(master.candidateHandoff));
  cleanHandoff.candidate.checksumSha256=object.checksumSha256;cleanHandoff.candidate.hasAlpha=true;cleanHandoff.candidate.referenceIds=[...master.referencePack.requiredReferenceIds];cleanHandoff.upstreamReview.decision='passed-to-wf4';cleanHandoff.intake={...cleanHandoff.intake,state:'ready-for-wf4-review',blockers:[],nextAction:'WF4 synthetic canonical review fixture.',productionEligible:false,implicitPromotionAllowed:false};
  const cleanBasis=Object.fromEntries(Object.entries(cleanHandoff).filter(([k])=>!['handoffId','handoffSha256'].includes(k)));cleanHandoff.handoffSha256=integrity.sha256Hex(integrity.stableStringify(integrity.canonicalize(cleanBasis)));master.candidateHandoff=cleanHandoff;
  db.db.prepare('UPDATE render_assets SET payload_json=? WHERE asset_id=?').run(JSON.stringify(master),master.assetId);db.refreshCanonicalGovernanceDossier(master.assetId,{actor});db.refreshCanonicalReviewWorkflow(master.assetId,{actor});db.claimCanonicalReviewWorkflow(master.assetId,{actor});master=db.getRenderAsset(master.assetId);
  const pendingResults=(master.canonicalView.reviewContractRequiredChecks||[]).map(id=>({id,result:'pending',note:null}));
  assert.throws(()=>db.submitCanonicalReviewDecision(master.assetId,{decision:'approved',results:pendingResults},{actor}),e=>e?.code==='canonical_review_decision_blocked'&&/all 8 locked checks/i.test(e.message),'review approval decision must fail until all locked checks pass');
  const passResults=(master.canonicalView.reviewContractRequiredChecks||[]).map(id=>({id,result:'pass',note:`${id} synthetic pass fixture`}));
  const decisionOut=db.submitCanonicalReviewDecision(master.assetId,{decision:'approved',results:passResults,notes:'Synthetic evidence-bound reviewer approval.'},{actor});
  assert.equal(decisionOut.decision.decision,'approved');assert.equal(decisionOut.decision.candidateChecksumSha256,object.checksumSha256);
  master=decisionOut.asset;
  const staged=db.stageAssetVersion(master.assetId,object,{actor});
  assert.equal(staged.payload.governance.state,'master-draft');
  assert.equal(staged.payload.canonicalReviewDecision.decision,'approved');

  const reviewed=reviewedCandidate(staged.payload);
  const updated=db.updateAssetVersion(master.assetId,staged.versionId,reviewed,{actor});
  const evidence=updated.payload.canonicalReviewEvidence;
  assert.equal(evidence.verdict,'pass');
  assert.equal(evidence.contractId,overlay.reviewContractId);
  assert.equal(evidence.candidateChecksumSha256,object.checksumSha256);
  assert.equal(evidence.results.length,8);
  assert.ok(evidence.results.every(x=>x.result==='pass'));
  assert.deepEqual(evidence.referenceSnapshots.map(x=>x.assetId),overlay.requiredReferenceIds);
  assert.ok(evidence.referenceSnapshots.every(x=>/^[a-f0-9]{64}$/.test(x.checksumSha256)));

  const refId=overlay.requiredReferenceIds[0],ref=db.getRenderAsset(refId),originalRef=JSON.parse(JSON.stringify(ref));
  const changed={...ref,file:{...ref.file,checksumSha256:'f'.repeat(64)}};
  db.db.prepare('UPDATE render_assets SET payload_json=? WHERE asset_id=?').run(JSON.stringify(changed),refId);
  assert.throws(()=>db.promoteAssetVersion(master.assetId,staged.versionId,{actor}),e=>(e?.code==='canonical_review_assignment_blocked'&&/workflow is stale/i.test(e.message))||e?.code==='canonical_review_decision_blocked'||(e?.code==='asset_gate_blocked'&&/changed after canonical review/i.test(e.message)),'reference evidence mutation after review must invalidate promotion and the reviewer assignment basis');
  db.db.prepare('UPDATE render_assets SET payload_json=? WHERE asset_id=?').run(JSON.stringify(originalRef),refId);

  const promoted=db.promoteAssetVersion(master.assetId,staged.versionId,{actor});
  assert.equal(promoted.asset.status,'production-ready');
  assert.equal(promoted.asset.approval.reviewEvidence.canonicalReview.verdict,'pass');
  assert.equal(promoted.asset.approval.reviewEvidence.canonicalReview.contractId,overlay.reviewContractId);
  assert.equal(promoted.asset.approval.reviewEvidence.canonicalReview.referenceSnapshots.length,3);
  assert.equal(promoted.asset.approval.reviewEvidence.canonicalReviewDecision.decision,'approved');
  assert.equal(promoted.asset.approval.reviewEvidence.canonicalReviewDecision.candidateChecksumSha256,object.checksumSha256);
  assert.equal(promoted.asset.canonicalReviewEvidence.candidateChecksumSha256,object.checksumSha256);

  for(const id of overlay.requiredReferenceIds){const r=db.getRenderAsset(id);assert.equal(r.status,'reference-only');assert.equal(r.referenceEvidence.productionEligible,false);assert.equal(r.governance.state,'reference-approved')}
  const audit=db.listAudit({entityType:'render-asset',entityId:master.assetId,action:'render.asset.version.promoted',limit:10});
  assert.equal(audit.length,1);assert.equal(audit[0].metadata.reviewEvidence.canonicalReview.verdict,'pass');

  const registry=fs.readFileSync(path.join(root,'asset-registry.js'),'utf8'),html=fs.readFileSync(path.join(root,'asset-registry.html'),'utf8'),readiness=fs.readFileSync(path.join(root,'readiness.js'),'utf8');
  assert.match(html,/canonical-review-gate\.js/);assert.match(registry,/CANONICAL REVIEW CONTRACT/);assert.match(registry,/canonicalReviewEvidence/);assert.match(readiness,/PERSISTED PASS/);

  console.log(JSON.stringify({gate:'wf4-canonical-review-evidence-alpha26',canonicalMaster:'Y62-F34-V1-MASTER',reviewContract:overlay.reviewContractId,requiredChecks:8,referenceSnapshots:3,directBypassBlocked:true,incompleteReviewDecisionBlocked:true,referenceMutationInvalidatesPromotion:true,immutableEvidencePersisted:true,referenceOnlyPreserved:true,customerVisualPromotion:'synthetic test database only',status:'pass'},null,2));
} finally {db.close()}
