'use strict';
const assert=require('node:assert');
const fs=require('node:fs');
const path=require('node:path');
const {RigDatabase}=require('../server/database');
const attestation=require('../reference-provenance-attestation.js');
const reviewGate=require('../canonical-review-gate.js');
const root=path.join(__dirname,'..');
const actor={actorId:'wf4-reference-governance',displayName:'WF4 Reference Governance',role:'admin'};
const db=new RigDatabase(':memory:');
try{
  const sync=db.syncVisualGovernanceRegistry({vehicleId:'nissan-y62-warrior-2025'},{actor});
  assert.equal(sync.summary.byClass.reference,9,'nine owner references remain governed');
  let refs=db.listRenderAssets({vehicleId:'nissan-y62-warrior-2025'}).filter(x=>x.assetClass==='reference');
  assert.equal(refs.length,9);
  assert(refs.every(r=>attestation.freshness(r.provenanceAttestation,r)==='current'),'owner reference source/rights attestations must be current after governance bootstrap');
  assert(refs.every(r=>r.referenceEvidence?.productionEligible===false),'attested references remain explicitly non-production');

  let readiness=db.renderReadiness({vehicleId:'nissan-y62-warrior-2025'});
  assert.equal(readiness.referencePack.status,'complete');
  assert.equal(readiness.referencePack.attestedReferenceCount,9,'reference pack reports all source/rights attestations current');

  const f34=db.getRenderAsset('Y62-F34-V1-MASTER');
  const required=f34.referencePack.requiredReferenceIds;
  assert.equal(required.length,3);
  assert(!reviewGate.referenceProblems(f34,refs).some(x=>x.includes('provenance attestation')),'current owner attestations must not create canonical review blockers');

  const targetId=required[0],target=db.getRenderAsset(targetId),tampered=JSON.parse(JSON.stringify(target));
  tampered.provenance.licenceNote=`${tampered.provenance.licenceNote} · changed after attestation`;
  db.db.prepare('UPDATE render_assets SET payload_json=? WHERE asset_id=?').run(JSON.stringify(tampered),targetId);
  let drifted=db.getRenderAsset(targetId);
  assert.equal(attestation.freshness(drifted.provenanceAttestation,drifted),'stale','source/rights metadata drift must stale the persisted attestation');

  const syncAfterDrift=db.syncVisualGovernanceRegistry({vehicleId:'nissan-y62-warrior-2025'},{actor});
  drifted=db.getRenderAsset(targetId);
  assert.equal(attestation.freshness(drifted.provenanceAttestation,drifted),'stale','governance sync must not silently overwrite a stale staff attestation');
  assert(!syncAfterDrift.metadataUpdated.includes(targetId),'static sync must not hide source/rights drift by replacing the attestation');

  readiness=db.renderReadiness({vehicleId:'nissan-y62-warrior-2025'});
  assert.equal(readiness.referencePack.status,'blocked','stale source/rights attestation must block the governed owner reference pack');
  assert(readiness.referencePack.problems.some(x=>x.code==='PROVENANCE_ATTESTATION'&&x.assetId===targetId),'pack blocker identifies the stale attestation');
  refs=db.listRenderAssets({vehicleId:'nissan-y62-warrior-2025'}).filter(x=>x.assetClass==='reference');
  assert(reviewGate.referenceProblems(db.getRenderAsset('Y62-F34-V1-MASTER'),refs).some(x=>x.includes(`${targetId} provenance attestation is not current`)),'canonical review must fail closed on stale backing-source attestation');

  const forged=JSON.parse(JSON.stringify(drifted));forged.provenanceAttestation={...forged.provenanceAttestation,basisSha256:'0'.repeat(64)};
  assert.throws(()=>db.upsertRenderAsset(forged,{actor}),e=>['reference_attestation_blocked','governance_metadata_protected'].includes(e?.code),'forged provenance attestation must be rejected by the shared server gate/write boundary');

  const saved=db.attestReferenceProvenance(targetId,{actor}).asset;
  assert.equal(attestation.freshness(saved.provenanceAttestation,saved),'current');
  assert.equal(saved.referenceEvidence.productionEligible,false);
  readiness=db.renderReadiness({vehicleId:'nissan-y62-warrior-2025'});
  assert.equal(readiness.referencePack.status,'blocked','changed evidence must remain blocked after re-attestation until the reference is explicitly re-reviewed');
  assert.equal(readiness.referencePack.attestedReferenceCount,9);
  assert(readiness.referencePack.problems.some(x=>x.code==='REFERENCE_REVIEW_DECISION'&&x.assetId===targetId),'re-attested changed evidence requires a new reference review decision');
  db.submitReferenceReviewDecision(targetId,{decision:'approved',notes:'Re-reviewed after changed source/rights evidence was re-attested.'},{actor});
  readiness=db.renderReadiness({vehicleId:'nissan-y62-warrior-2025'});
  assert.equal(readiness.referencePack.status,'complete','explicit re-review restores pack integrity after changed evidence is re-attested');

  const audit=db.listAudit({entityType:'render-asset',entityId:targetId,action:'reference.provenance-attested',limit:5})[0];
  assert.equal(audit.metadata.provenanceAttestation.freshness,'current','audit event mirrors attestation freshness/evidence hash');
  assert.equal(audit.metadata.provenanceAttestation.productionEligible,false);
  assert.equal(audit.metadata.reviewInvalidated,true,'changed evidence re-attestation invalidates prior reference approval');

  const ui=fs.readFileSync(path.join(root,'asset-registry.js'),'utf8'),readinessUi=fs.readFileSync(path.join(root,'readiness.js'),'utf8'),html=fs.readFileSync(path.join(root,'asset-registry.html'),'utf8');
  assert.match(ui,/REFERENCE PROVENANCE ATTESTATION/);
  assert.match(ui,/ATTEST CURRENT SOURCE \+ RIGHTS/);
  assert.match(ui,/BACKING REFERENCE ATTESTATIONS/);
  assert.match(readinessUi,/source\/rights-attested/);
  assert.match(readinessUi,/attestation/);
  assert.match(html,/reference-provenance-attestation\.js/);

  const productionEligible=db.listRenderAssets({vehicleId:'nissan-y62-warrior-2025'}).filter(x=>['production-ready'].includes(x.status)).length;
  assert.equal(productionEligible,0,'attestation package must not promote any Y62 visual');
  console.log(JSON.stringify({gate:'wf4-reference-provenance-attestation-alpha26',ownerReferences:9,currentAtBootstrap:9,packCompleteAtBootstrap:true,driftDetected:true,syncDoesNotHideDrift:true,canonicalReviewFailsClosed:true,forgedAttestationRejected:true,reattestRequiresRereview:true,staffVisibility:true,visualPromotion:false,policy:attestation.policy,status:'pass'},null,2));
}finally{db.close()}
