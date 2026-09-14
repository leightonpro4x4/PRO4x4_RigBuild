'use strict';
const assert=require('node:assert');
const fs=require('node:fs');
const path=require('node:path');
const {RigDatabase}=require('../server/database');
const boundary=require('../visual-governance-write-boundary.js');
const root=path.join(__dirname,'..');
const actor={actorId:'wf4-boundary-reviewer',displayName:'WF4 Boundary Reviewer',role:'admin'};
const db=new RigDatabase(':memory:');
function clone(v){return JSON.parse(JSON.stringify(v))}
function expectProtected(fn,pathName){
  assert.throws(fn,e=>e?.code==='governance_metadata_protected'&&Array.isArray(e.changedPaths)&&e.changedPaths.includes(pathName),`${pathName} generic mutation must be blocked`);
}
try{
  const sync=db.syncVisualGovernanceRegistry({vehicleId:'nissan-y62-warrior-2025'},{actor});
  assert.equal(sync.summary.byClass.reference,9);
  assert(sync.summary.byClass['canonical-master']>=3);
  assert.equal(db.listRenderAssets({vehicleId:'nissan-y62-warrior-2025'}).filter(x=>x.assetClass==='canonical-master'&&x.canonicalView?.briefId).length,3,'three governed canonical master slots must exist');

  const f34=db.getRenderAsset('Y62-F34-V1-MASTER');
  assert(f34.referencePack?.packId,'F34 canonical master must carry persisted reference-pack binding');
  assert(f34.canonicalView?.briefId,'F34 canonical master must carry canonical-view contract');
  assert(f34.candidateHandoff?.handoffSha256,'F34 canonical master must carry persisted WF3 handoff');
  assert(f34.governanceDossier?.dossierSha256,'F34 canonical master must carry persisted reviewer dossier');
  assert(f34.reviewWorkflow?.workflowSha256,'F34 canonical master must carry persisted review workflow');
  assert(f34.governanceWriteBoundary?.protectedPaths?.length,'F34 canonical master must carry persisted write-boundary metadata');
  assert.equal(boundary.freshness(f34.governanceWriteBoundary,f34),'current','F34 persisted write-boundary metadata must match the current governed record');

  const packTamper=clone(f34);packTamper.referencePack.manifestSha256='0'.repeat(64);
  expectProtected(()=>db.upsertRenderAsset(packTamper,{actor}),'referencePack');
  assert.equal(db.getRenderAsset(f34.assetId).referencePack.manifestSha256,f34.referencePack.manifestSha256,'blocked pack mutation must not persist');

  const contractTamper=clone(f34);contractTamper.canonicalView.referenceIds=[...contractTamper.canonicalView.referenceIds].reverse();
  expectProtected(()=>db.upsertRenderAsset(contractTamper,{actor}),'canonicalView');

  const handoffTamper=clone(f34);handoffTamper.candidateHandoff.intake.state='ready-for-review';
  expectProtected(()=>db.upsertRenderAsset(handoffTamper,{actor}),'candidateHandoff');

  const dossierTamper=clone(f34);dossierTamper.governanceDossier.dossierSha256='f'.repeat(64);
  expectProtected(()=>db.upsertRenderAsset(dossierTamper,{actor}),'governanceDossier');

  const workflowTamper=clone(f34);workflowTamper.reviewWorkflow.assignment={reviewerActorId:'forged',reviewerDisplayName:'Forged Reviewer',reviewerRole:'admin',assignedAt:'2026-09-14T00:00:00.000Z'};
  expectProtected(()=>db.upsertRenderAsset(workflowTamper,{actor}),'reviewWorkflow');

  const identityTamper=clone(f34);identityTamper.viewId='side';
  expectProtected(()=>db.upsertRenderAsset(identityTamper,{actor}),'viewId');

  const refId=f34.referencePack.requiredReferenceIds[0],ref=db.getRenderAsset(refId);
  assert(ref.governanceWriteBoundary?.protectedPaths?.includes('referenceEvidence'),'pack-bound owner reference must persist reference-evidence write protection');
  assert.equal(boundary.freshness(ref.governanceWriteBoundary,ref),'current','owner reference persisted write-boundary metadata must be current');
  const refBindingTamper=clone(ref);refBindingTamper.referenceEvidence.canonicalViewIds=[];
  expectProtected(()=>db.upsertRenderAsset(refBindingTamper,{actor}),'referenceEvidence');
  const attestationTamper=clone(ref);attestationTamper.provenanceAttestation={...(attestationTamper.provenanceAttestation||{}),attestedBy:{actorId:'forged',displayName:'Forged Attestor',role:'admin'}};
  expectProtected(()=>db.upsertRenderAsset(attestationTamper,{actor}),'provenanceAttestation');
  const reattested=db.attestReferenceProvenance(refId,{actor});
  assert.equal(reattested.freshness,'current','dedicated provenance workflow remains able to write its owned attestation');

  const allowed=clone(f34);allowed.approval.notes='Reviewer working note updated through the normal editor.';allowed.canonicalReview.notes='Working review note only; no system-owned binding changed.';
  const saved=db.upsertRenderAsset(allowed,{actor});
  assert.equal(saved.approval.notes,allowed.approval.notes,'reviewer-owned working metadata remains editable');
  assert.equal(saved.referencePack.manifestSha256,f34.referencePack.manifestSha256);
  assert.equal(saved.candidateHandoff.handoffSha256,f34.candidateHandoff.handoffSha256);

  const refreshed=db.refreshCanonicalGovernanceDossier(f34.assetId,{actor});
  assert.equal(refreshed.freshness,'current','dedicated dossier workflow remains able to write its owned field');
  const assessed=db.assessRenderReadiness({vehicleId:'nissan-y62-warrior-2025'},{actor});
  assert.equal(assessed.summary.canonicalMasters,3,'dedicated readiness workflow remains able to persist assessments');
  assert.equal(db.getRenderAsset(f34.assetId).readinessAssessment?.policy,'REFERENCE_BACKED_APPROVED_VISUALS_ONLY');

  const blockedAudit=db.listAudit({entityType:'render-asset',entityId:f34.assetId,action:'visual-governance.protected-write.blocked',limit:20});
  assert(blockedAudit.length>=6,'blocked generic governance writes must be audit-visible');
  assert(blockedAudit.some(e=>(e.metadata?.changedPaths||[]).includes('referencePack')),'audit identifies protected reference-pack mutation');
  assert(blockedAudit.some(e=>(e.metadata?.changedPaths||[]).includes('reviewWorkflow')),'audit identifies protected review-workflow mutation');

  const after=db.listRenderAssets({vehicleId:'nissan-y62-warrior-2025'});
  assert.equal(after.filter(x=>x.status==='production-ready').length,0,'write-boundary package must not promote visuals');
  const ui=fs.readFileSync(path.join(root,'asset-registry.js'),'utf8'),assetHtml=fs.readFileSync(path.join(root,'asset-registry.html'),'utf8'),readyHtml=fs.readFileSync(path.join(root,'readiness.html'),'utf8'),readyUi=fs.readFileSync(path.join(root,'readiness.js'),'utf8'),localStore=fs.readFileSync(path.join(root,'asset-registry-store.js'),'utf8');
  assert.match(ui,/GOVERNANCE WRITE BOUNDARY/);
  assert.match(ui,/SYSTEM-MANAGED METADATA LOCK/);
  assert.match(assetHtml,/visual-governance-write-boundary\.js/);
  assert.match(readyHtml,/visual-governance-write-boundary\.js/);
  assert.match(readyUi,/Governance write boundary/);
  assert.match(readyUi,/SYSTEM MANAGED/);
  assert.match(localStore,/governance_metadata_protected|assertWritable/,'browser-local registry must enforce the same boundary helper');

  const pure=boundary.summary(f34);
  assert(pure.protectedPaths.includes('referencePack'));
  assert(pure.protectedPaths.includes('canonicalView'));
  assert(pure.protectedPaths.includes('candidateHandoff'));
  assert(pure.protectedPaths.includes('governanceDossier'));
  assert(pure.protectedPaths.includes('reviewWorkflow'));
  assert.equal(pure.policy,'REFERENCE_BACKED_APPROVED_VISUALS_ONLY');

  console.log(JSON.stringify({gate:'wf4-governance-write-boundary-alpha26',canonicalMasters:3,ownerReferences:9,protectedPackBinding:true,protectedCanonicalContract:true,protectedCandidateHandoff:true,protectedReviewerDossier:true,protectedReviewWorkflow:true,protectedIdentity:true,protectedReferenceMembership:true,protectedProvenanceAttestation:true,dedicatedProvenanceWorkflow:true,persistedBoundaryMetadata:true,dedicatedDossierWorkflow:true,dedicatedReadinessWorkflow:true,blockedWritesAudited:true,browserLocalParity:true,visualPromotion:false,policy:boundary.policy,status:'pass'},null,2));
}finally{db.close()}
