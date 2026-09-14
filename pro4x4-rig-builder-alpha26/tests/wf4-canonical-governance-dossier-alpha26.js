'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {createApp}=require('../server/server');
const dossierGov=require('../canonical-governance-dossier.js');

(async()=>{
  const actor={actorId:'wf4-dossier-admin',displayName:'WF4 Dossier Admin',role:'admin'};
  const vehicleId='nissan-y62-warrior-2025';
  const {server,db}=createApp({dbFile:':memory:',seed:false});
  const sync=db.syncVisualGovernanceRegistry({vehicleId},{actor});
  assert.equal(sync.createdCount,12);
  assert.equal(sync.dossierPreparedCount,3,'first governance sync must prepare the three canonical reviewer dossiers');
  assert.equal(sync.summary.dossiers.current,3);

  let all=db.listRenderAssets({vehicleId});
  let refs=all.filter(x=>x.assetClass==='reference');
  let f34=db.getRenderAsset('Y62-F34-V1-MASTER');
  const side=db.getRenderAsset('Y62-SIDE-V1-MASTER');
  const rear=db.getRenderAsset('Y62-R34-V1-MASTER');
  const fD=f34.governanceDossier,sD=side.governanceDossier,rD=rear.governanceDossier;

  for(const [master,d] of [[f34,fD],[side,sD],[rear,rD]]){
    assert(d,'governed canonical master must have a persisted reviewer evidence dossier');
    assert.equal(d.policy,'REFERENCE_BACKED_APPROVED_VISUALS_ONLY');
    assert.equal(d.purpose,'CANONICAL_REVIEWER_EVIDENCE_DOSSIER');
    assert.equal(d.basis.authority,'inspection-only');
    assert.equal(d.basis.productionEligible,false);
    assert.equal(d.basis.canonicalMaster.assetId,master.assetId);
    assert.equal(d.basis.referencePack.packId,'Y62-OWNER-REFERENCE-PACK-V1');
    assert.match(d.dossierSha256,/^[a-f0-9]{64}$/);
    assert.equal(dossierGov.freshness(d,master,refs),'current');
  }

  assert.equal(fD.basis.referencePack.referenceSnapshots.length,3);
  assert.equal(fD.basis.candidateHandoff.candidateId,'Y62-F34-V1-CANDIDATE-02');
  assert.equal(fD.basis.candidateHandoff.intakeState,'blocked-upstream');
  assert.match(fD.basis.candidateHandoff.candidateChecksumSha256,/^[a-f0-9]{64}$/);
  assert.equal(fD.basis.reviewerIntake.state,'blocked-upstream');
  assert.equal(fD.basis.reviewerIntake.requiredChecks,8);
  assert.equal(fD.basis.reviewerIntake.passedChecks,0);
  assert.equal(fD.basis.reviewerIntake.pendingChecks,8);
  assert(fD.basis.reviewerIntake.blockers.length>=10);
  assert(fD.basis.productionBlockers.length>=4);

  assert.equal(sD.basis.referencePack.referenceSnapshots.length,3);
  assert.equal(sD.basis.candidateHandoff.candidateId,null);
  assert.equal(sD.basis.reviewerIntake.state,'awaiting-wf3-candidate');
  assert(sD.basis.reviewerIntake.blockers.some(x=>x.includes('source gap')),'SIDE dossier must retain the required source gap');

  assert.equal(rD.basis.referencePack.referenceSnapshots.length,2);
  assert.equal(rD.basis.candidateHandoff.candidateId,null);
  assert.equal(rD.basis.reviewerIntake.state,'awaiting-wf3-candidate');

  const before={status:f34.status,governance:JSON.stringify(f34.governance),file:JSON.stringify(f34.file),lineage:JSON.stringify(f34.lineage),versions:db.listAssetVersions(f34.assetId).length,dossierSha:fD.dossierSha256};
  const refreshed=db.refreshCanonicalGovernanceDossier(f34.assetId,{actor});
  f34=refreshed.asset;refs=db.listRenderAssets({vehicleId}).filter(x=>x.assetClass==='reference');
  assert.equal(refreshed.freshness,'current');
  assert.equal(dossierGov.freshness(f34.governanceDossier,f34,refs),'current');
  assert.equal(f34.status,before.status,'dossier refresh must not change canonical runtime status');
  assert.equal(JSON.stringify(f34.governance),before.governance,'dossier refresh must not grant review approval');
  assert.equal(JSON.stringify(f34.file),before.file,'dossier refresh must not replace a candidate/production binary');
  assert.equal(JSON.stringify(f34.lineage),before.lineage,'dossier refresh must not move production lineage');
  assert.equal(db.listAssetVersions(f34.assetId).length,before.versions,'dossier refresh must not stage an asset version');
  assert.equal(f34.governanceDossier.basis.authority,'inspection-only');
  assert.equal(f34.governanceDossier.basis.productionEligible,false);

  const audit=db.listAudit({entityType:'render-asset',entityId:f34.assetId,action:'canonical.governance-dossier.prepared',limit:10});
  assert(audit.length>=1,'dossier preparation must be auditable');
  assert.equal(audit[0].metadata.authority,'inspection-only');
  assert.equal(audit[0].metadata.productionEligible,false);
  assert.equal(audit[0].metadata.dossierSha256,f34.governanceDossier.dossierSha256);
  const ledger=db.verifyAuditIntegrity();
  assert.notEqual(ledger.status,'broken','dossier audit event must preserve the tamper-evident audit chain');

  const refId=f34.referencePack.requiredReferenceIds[0];
  const changedRef=db.getRenderAsset(refId);
  changedRef.governance={...(changedRef.governance||{}),state:'reference-only'};
  db.db.prepare('UPDATE render_assets SET payload_json=? WHERE asset_id=?').run(JSON.stringify(changedRef),refId);
  f34=db.getRenderAsset(f34.assetId);refs=db.listRenderAssets({vehicleId}).filter(x=>x.assetClass==='reference');
  assert.equal(dossierGov.freshness(f34.governanceDossier,f34,refs),'stale','changing backing owner-reference governance must stale the persisted dossier');
  assert(dossierGov.problems(f34.governanceDossier,f34,refs).some(x=>x.includes('stale')));

  const resync=db.syncVisualGovernanceRegistry({vehicleId},{actor});
  f34=db.getRenderAsset(f34.assetId);refs=db.listRenderAssets({vehicleId}).filter(x=>x.assetClass==='reference');
  assert.equal(resync.dossierPreparedCount,0,'normal governance sync must not silently overwrite an existing reviewer dossier');
  assert.equal(dossierGov.freshness(f34.governanceDossier,f34,refs),'stale','stale reviewer evidence must remain visible until staff explicitly refreshes it');
  assert.equal(db.getRenderAsset(refId).governance.state,'reference-only','static metadata sync must not silently re-approve changed reference governance when reviewer evidence already exists');

  const staleSha=f34.governanceDossier.dossierSha256;
  const afterDrift=db.refreshCanonicalGovernanceDossier(f34.assetId,{actor});
  f34=afterDrift.asset;refs=db.listRenderAssets({vehicleId}).filter(x=>x.assetClass==='reference');
  assert.equal(dossierGov.freshness(f34.governanceDossier,f34,refs),'current');
  assert.notEqual(f34.governanceDossier.dossierSha256,staleSha,'explicit refresh must fingerprint the changed evidence basis');
  assert(f34.governanceDossier.basis.reviewerIntake.blockers.some(x=>x.includes(`${refId} is not reference-approved`)),'refreshed dossier must expose the changed reference-evidence blocker');
  assert.equal(f34.status,before.status);
  assert.equal(f34.governance.state,'master-draft');
  assert.equal(db.listAssetVersions(f34.assetId).length,before.versions);

  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
  const base=`http://127.0.0.1:${server.address().port}`;
  try{
    const sales=await fetch(`${base}/api/v1/staff/render-assets/${encodeURIComponent(f34.assetId)}/governance-dossier`,{method:'POST',headers:{'x-pro4x4-role':'sales','x-pro4x4-actor':'wf4-dossier-sales'}});
    assert.equal(sales.status,403,'sales must remain inspection-only and cannot refresh reviewer governance evidence');
    const fitment=await fetch(`${base}/api/v1/staff/render-assets/${encodeURIComponent(f34.assetId)}/governance-dossier`,{method:'POST',headers:{'x-pro4x4-role':'fitment','x-pro4x4-actor':'wf4-dossier-fitment','x-pro4x4-name':'WF4 Dossier Fitment'}});
    assert.equal(fitment.status,200);const body=await fitment.json();
    assert.equal(body.dossier.policy,'REFERENCE_BACKED_APPROVED_VISUALS_ONLY');
    assert.equal(body.dossier.basis.authority,'inspection-only');
    assert.equal(body.dossier.basis.productionEligible,false);
    assert.equal(body.asset.status,'candidate');
    assert.equal(body.asset.governance.state,'master-draft');
  }finally{await new Promise(resolve=>server.close(resolve))}

  const root=path.join(__dirname,'..');
  const assetHtml=fs.readFileSync(path.join(root,'asset-registry.html'),'utf8');
  const readinessHtml=fs.readFileSync(path.join(root,'readiness.html'),'utf8');
  const assetUi=fs.readFileSync(path.join(root,'asset-registry.js'),'utf8');
  const readinessUi=fs.readFileSync(path.join(root,'readiness.js'),'utf8');
  assert.match(assetHtml,/canonical-governance-dossier\.js/);
  assert.match(readinessHtml,/canonical-governance-dossier\.js/);
  assert.match(assetUi,/CANONICAL GOVERNANCE DOSSIER/);
  assert.match(assetUi,/REFRESH REVIEWER DOSSIER/);
  assert.match(readinessUi,/Reviewer governance dossier/);

  console.log(JSON.stringify({gate:'wf4-canonical-governance-dossier-alpha26',canonicalMasters:3,dossiersPrepared:3,currentAtBootstrap:3,f34ReviewerIntake:'blocked-upstream',sideReviewerIntake:'awaiting-wf3-candidate',rearReviewerIntake:'awaiting-wf3-candidate',f34RequiredChecks:8,f34ReferenceSnapshots:3,staleOnBackingEvidenceMutation:true,syncDoesNotHideStaleness:true,explicitRefreshRequired:true,fitmentRefreshEndpoint:true,salesRefreshDenied:true,implicitApproval:false,implicitVersionStaging:false,visualPromotion:false,policy:dossierGov.policy,status:'pass'},null,2));
  db.close();
})().catch(e=>{console.error(e);process.exit(1)});
