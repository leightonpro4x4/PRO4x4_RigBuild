'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {RigDatabase}=require('../server/database');
const att=require('../reference-provenance-attestation.js');
const review=require('../reference-review-decision.js');
const packGov=require('../reference-pack-governance.js');
const setGov=require('../canonical-master-set-registry.js');
const canonicalReviewGate=require('../canonical-review-gate.js');
const refPack=require('../y62-reference-pack.js');
const briefs=require('../y62-canonical-briefs.js');
const root=path.join(__dirname,'..');
const actor={actorId:'wf4-reference-reviewer',displayName:'WF4 Reference Reviewer',role:'admin'};
const db=new RigDatabase(':memory:');
try{
  const sync=db.syncVisualGovernanceRegistry({vehicleId:'nissan-y62-warrior-2025'},{actor});
  assert.equal(sync.summary.byClass.reference,9,'nine owner references remain governed');
  let refs=db.listRenderAssets({vehicleId:'nissan-y62-warrior-2025'}).filter(x=>x.assetClass==='reference');
  assert.equal(refs.length,9);
  assert(refs.every(r=>review.freshness(r.referenceReviewDecision,r)==='current'&&r.referenceReviewDecision.decision==='approved'),'all migrated owner-source approvals must have current persisted review decisions');
  assert(refs.every(r=>r.referenceReviewDecision.legacyMigration===true),'bootstrap decision must explicitly identify migration from existing owner-source approval evidence');
  assert(refs.every(r=>r.referenceReviewDecision.productionEligible===false&&r.referenceEvidence.productionEligible===false),'review decisions and references remain non-production');

  let readiness=db.renderReadiness({vehicleId:'nissan-y62-warrior-2025'});
  assert.equal(readiness.referencePack.status,'complete');
  assert.equal(readiness.referencePack.reviewApprovedReferenceCount,9);
  assert.equal(readiness.referencePack.attestedReferenceCount,9);
  assert.equal(readiness.canonicalMasterSet.state,'current');
  assert.equal(readiness.summary.productionReadySlots,0,'reference review package must not promote render slots');

  const fresh={
    schemaVersion:'0.26.25',assetId:'TEST-REFERENCE-REVIEW-01',assetClass:'reference',vehicleId:'nissan-y62-warrior-2025',viewId:'front34',layerId:'reference',exactSku:null,status:'reference-only',source:'references/test-reference-review-01.jpg',
    provenance:{sourceType:'owner-supplied',sourceUrl:null,licenceStatus:'owner-project-approved',licenceNote:'Test owner reference evidence for governed intake.',rightsTag:'owner-project-approved'},
    referenceEvidence:{authenticityRole:'support',quality:'support',productionEligible:false,canonicalViewIds:['Y62-F34-V1']},
    file:{checksumSha256:'1'.repeat(64),mimeType:'image/jpeg',width:1600,height:1200,hasAlpha:false},cameraGeometry:{profileId:null,matched:false,notes:'Reference evidence only.'},fitmentScope:['nissan-y62-warrior-2025'],
    approval:{state:'not-reviewed',approvedBy:null,approvedAt:null,notes:'Awaiting explicit provenance attestation and reference review.'},governance:{state:'reference-only',reviewedBy:null,reviewedAt:null},history:[]
  };
  const directApproved=JSON.parse(JSON.stringify(fresh));directApproved.governance={state:'reference-approved',reviewedBy:actor.displayName,reviewedAt:new Date().toISOString()};directApproved.approval={state:'approved-reference',approvedBy:actor.displayName,approvedAt:new Date().toISOString(),notes:'forged generic approval'};
  assert.throws(()=>db.upsertRenderAsset(directApproved,{actor}),e=>e?.code==='reference_review_workflow_required','new references cannot arrive pre-approved through the generic editor');

  let saved=db.upsertRenderAsset(fresh,{actor});
  assert.equal(saved.governance.state,'reference-only');
  assert.equal(saved.referenceReviewDecision,undefined);
  assert.equal(saved.referenceEvidence.productionEligible,false);

  let attested=db.attestReferenceProvenance(fresh.assetId,{actor});
  assert.equal(attested.freshness,'current');assert.equal(attested.asset.governance.state,'reference-only');
  let decided=db.submitReferenceReviewDecision(fresh.assetId,{decision:'approved',notes:'Source, rights and canonical-view use reviewed.'},{actor});
  assert.equal(decided.freshness,'current');assert.equal(decided.decision.decision,'approved');assert.equal(decided.asset.governance.state,'reference-approved');assert.equal(decided.asset.approval.state,'approved-reference');assert.equal(decided.asset.referenceEvidence.productionEligible,false);

  const tampered=JSON.parse(JSON.stringify(decided.asset));tampered.governance.state='reference-only';tampered.referenceReviewDecision={...tampered.referenceReviewDecision,decision:'returned'};
  assert.throws(()=>db.upsertRenderAsset(tampered,{actor}),e=>e?.code==='governance_metadata_protected'&&(e.changedPaths||[]).some(x=>x==='governance'||x==='referenceReviewDecision'),'generic staff editor cannot forge reference approval state/decision');

  const changed=JSON.parse(JSON.stringify(decided.asset));changed.provenance.licenceNote+=' UPDATED';
  assert.equal(review.freshness(decided.asset.referenceReviewDecision,changed),'stale','source/rights drift must stale exact reference review decision');
  db.db.prepare('UPDATE render_assets SET payload_json=? WHERE asset_id=?').run(JSON.stringify(changed),fresh.assetId);
  const reattested=db.attestReferenceProvenance(fresh.assetId,{actor});
  assert.equal(reattested.freshness,'current');assert.equal(reattested.reviewInvalidated,true);assert.equal(reattested.asset.governance.state,'reference-only');assert.equal(reattested.asset.approval.state,'not-reviewed');
  assert.equal(review.freshness(reattested.asset.referenceReviewDecision,reattested.asset),'stale','historical approval remains evidence but cannot authorize changed evidence');
  const reapproved=db.submitReferenceReviewDecision(fresh.assetId,{decision:'approved',notes:'Re-reviewed after provenance evidence change.'},{actor});
  assert.equal(reapproved.freshness,'current');assert.equal(reapproved.asset.governance.state,'reference-approved');
  const reaffirm=db.attestReferenceProvenance(fresh.assetId,{actor});assert.equal(reaffirm.reaffirmed,true,'re-attesting unchanged evidence is a non-destructive reaffirmation');assert.equal(reaffirm.asset.governance.state,'reference-approved');assert.equal(review.freshness(reaffirm.asset.referenceReviewDecision,reaffirm.asset),'current');

  const canonical=db.getRenderAsset('Y62-F34-V1-MASTER'),decisionTamper=JSON.parse(JSON.stringify(refs.find(r=>(canonical.referencePack?.requiredReferenceIds||[]).includes(r.assetId))));decisionTamper.referenceReviewDecision.decision='returned';const decisionTamperRefs=refs.map(r=>r.assetId===decisionTamper.assetId?decisionTamper:r);assert(canonicalReviewGate.referenceProblems(canonical,decisionTamperRefs).some(x=>x.includes('review decision is not current/approved')),'canonical review gate must fail closed on invalid/stale reference review evidence even when reference governance still says approved');

  const owner=refs[0],ownerDrift=JSON.parse(JSON.stringify(owner));ownerDrift.file.checksumSha256='f'.repeat(64);
  assert.equal(review.freshness(owner.referenceReviewDecision,ownerDrift),'stale');
  const manifest=packGov.manifest(refPack,briefs.briefs||{}),driftRefs=refs.map(r=>r.assetId===owner.assetId?ownerDrift:r),assessment=packGov.assess(manifest,driftRefs);
  assert.equal(assessment.status,'blocked');assert(assessment.problems.some(x=>x.code==='REFERENCE_REVIEW_DECISION'&&x.assetId===owner.assetId));
  const masters=db.listRenderAssets({vehicleId:'nissan-y62-warrior-2025'}).filter(x=>x.assetClass==='canonical-master');
  const registry=setGov.build({vehicleId:'nissan-y62-warrior-2025',masters,references:driftRefs,generatedAt:new Date().toISOString(),generatedBy:actor});
  assert(registry.problems.some(x=>String(x).includes('review decision')),'canonical master-set truth index must surface reference review decision drift');

  decided=db.submitReferenceReviewDecision(fresh.assetId,{decision:'returned',notes:'Return test reference to intake.'},{actor});
  assert.equal(decided.freshness,'current');assert.equal(decided.decision.decision,'returned');assert.equal(decided.asset.governance.state,'reference-only');assert.equal(decided.asset.referenceEvidence.productionEligible,false);

  const ui=fs.readFileSync(path.join(root,'asset-registry.js'),'utf8'),readinessUi=fs.readFileSync(path.join(root,'readiness.js'),'utf8'),html=fs.readFileSync(path.join(root,'asset-registry.html'),'utf8'),boundary=fs.readFileSync(path.join(root,'visual-governance-write-boundary.js'),'utf8');
  assert.match(ui,/REFERENCE REVIEW DECISION/);assert.match(ui,/APPROVE CURRENT REFERENCE EVIDENCE/);assert.match(ui,/RETURN TO INTAKE/);assert.match(ui,/Attested reference source, rights, checksum and camera evidence are sealed/);
  assert.match(readinessUi,/evidence-review-approved/);assert.match(readinessUi,/review .*attestation/);assert.match(html,/reference-review-decision\.js/);assert.match(boundary,/referenceReviewDecision/);
  assert.equal(db.listRenderAssets({vehicleId:'nissan-y62-warrior-2025'}).filter(x=>x.status==='production-ready').length,0);
  console.log(JSON.stringify({gate:'wf4-reference-review-decision-alpha26',ownerReferences:9,migratedDecisionsCurrent:9,genericPreApprovalRejected:true,dedicatedAttestThenReview:true,protectedApprovalMetadata:true,evidenceDriftStalesReview:true,reattestInvalidatesChangedEvidenceReview:true,unchangedReaffirmationNonDestructive:true,packFailsClosed:true,masterSetSurfacesDrift:true,canonicalReviewFailsClosedOnDecision:true,staffVisibility:true,visualPromotion:false,policy:review.policy,status:'pass'},null,2));
}finally{db.close()}
