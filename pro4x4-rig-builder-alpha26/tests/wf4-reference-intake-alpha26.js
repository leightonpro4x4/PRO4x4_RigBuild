'use strict';
const assert=require('node:assert');
const fs=require('node:fs');
const path=require('node:path');
const {RigDatabase}=require('../server/database');
const governance=require('../visual-governance');
const root=path.join(__dirname,'..');
const actor={actorId:'wf4-provenance-admin',displayName:'WF4 Provenance Admin',role:'admin'};
const db=new RigDatabase(':memory:');
try{
  const sync=db.syncVisualGovernanceRegistry({vehicleId:'nissan-y62-warrior-2025'},{actor});
  assert.equal(sync.summary.byClass.reference,9,'owner reference pack must remain persisted');
  const ownerRefs=db.listRenderAssets({vehicleId:'nissan-y62-warrior-2025'}).filter(x=>x.assetClass==='reference');
  assert(ownerRefs.every(x=>x.referenceEvidence?.productionEligible===false),'owner references must explicitly remain non-production');
  assert(ownerRefs.every(x=>x.governance?.state==='reference-approved'),'owner references must retain approved-reference governance');
  assert(ownerRefs.every(x=>x.governance?.reviewedBy&&x.governance?.reviewedAt),'approved owner references must carry persisted reviewer evidence');

  const external={
    schemaVersion:'0.26.7',assetId:'Y62-REF-EXTERNAL-F34-001',assetClass:'reference',vehicleId:'nissan-y62-warrior-2025',viewId:'front34',layerId:'reference',exactSku:null,status:'reference-only',source:null,
    provenance:{sourceType:'external-reference',sourceUrl:'https://example.invalid/y62-series5-warrior-front34.jpg',licenceStatus:'reference-only',licenceNote:'Exact-vehicle third-party image registered for internal geometry comparison only; no production rights recorded.',capturedAt:'2026-09-13T13:35:00.000Z'},
    referenceEvidence:{authenticityRole:'support',quality:'support',productionEligible:false,canonicalViewIds:['Y62-F34-V1']},
    file:{checksumSha256:null,mimeType:null,width:null,height:null,hasAlpha:false},cameraGeometry:{profileId:null,matched:false,notes:'Reference evidence only.'},fitmentScope:['nissan-y62-warrior-2025'],
    approval:{state:'not-reviewed',approvedBy:null,approvedAt:null,notes:'Reference-only intake.'},governance:{state:'reference-only',reviewedBy:null,reviewedAt:null},history:[]
  };
  assert.deepEqual(governance.referenceProblems(external),[],'URL-only external evidence should be registrable without implying binary ownership');
  const saved=db.upsertRenderAsset(external,{actor});
  assert.equal(saved.status,'reference-only');assert.equal(saved.assetClass,'reference');assert.equal(saved.referenceEvidence.productionEligible,false);assert.equal(governance.productionEligible(saved),false);
  assert(saved.referenceEvidence.canonicalViewIds.includes('Y62-F34-V1'));
  const audit=db.listAudit({entityType:'render-asset',entityId:external.assetId,limit:10})[0];
  assert.equal(audit.metadata.assetClass,'reference');assert.equal(audit.metadata.governanceState,'reference-only');assert.equal(audit.metadata.referenceEvidence.productionEligible,false);

  assert.throws(()=>db.upsertRenderAsset({...external,assetId:'Y62-REF-BAD-CANDIDATE',status:'candidate'},{actor}),e=>e?.code==='reference_evidence_gate_blocked'&&/reference-only at runtime/.test(e.message),'reference evidence must never become a candidate/production runtime asset');
  assert.throws(()=>db.upsertRenderAsset({...external,assetId:'Y62-REF-BAD-BINDING',referenceEvidence:{...external.referenceEvidence,canonicalViewIds:['Y62-NOT-A-CANONICAL-VIEW']}},{actor}),e=>e?.code==='reference_evidence_gate_blocked'&&/unsupported canonical master/.test(e.message),'reference evidence cannot bind to an unknown canonical master');
  assert.throws(()=>db.upsertRenderAsset({...external,assetId:'Y62-REF-BAD-LOCAL',source:'references/y62-owner/new.jpg',provenance:{...external.provenance,sourceUrl:null},file:{...external.file,checksumSha256:null}},{actor}),e=>e?.code==='reference_evidence_gate_blocked'&&/SHA-256/.test(e.message),'local reference paths require checksum provenance');
  assert.throws(()=>db.upsertRenderAsset({...external,assetId:'Y62-REF-BAD-APPROVAL',governance:{state:'reference-approved',reviewedBy:null,reviewedAt:null}},{actor}),e=>e?.code==='reference_evidence_gate_blocked'&&/reviewer identity/.test(e.message),'approved reference evidence requires reviewer identity/timestamp');

  const approvedIntake={...external,assetId:'Y62-REF-APPROVED-F34-001'};
  db.upsertRenderAsset(approvedIntake,{actor});db.attestReferenceProvenance(approvedIntake.assetId,{actor});
  const approved=db.submitReferenceReviewDecision(approvedIntake.assetId,{decision:'approved',notes:'Geometry support approved for internal reference use only.'},{actor}).asset;
  assert.equal(approved.governance.state,'reference-approved');assert.equal(approved.approval.state,'approved-reference');assert.equal(governance.productionEligible(approved),false);
  assert.throws(()=>db.upsertRenderAsset({...approved,status:'production-ready'},{actor}),e=>e?.code==='reference_evidence_gate_blocked','even approved reference evidence must be rejected from production runtime state');

  const html=fs.readFileSync(path.join(root,'asset-registry.html'),'utf8'),ui=fs.readFileSync(path.join(root,'asset-registry.js'),'utf8'),backend=fs.readFileSync(path.join(root,'backend-client.js'),'utf8');
  assert.match(html,/REGISTER REFERENCE/);assert.match(ui,/REFERENCE \/ PROVENANCE INTAKE/);assert.match(ui,/CANONICAL MASTERS USING THIS EVIDENCE/);assert.match(ui,/productionEligible:false/);assert.match(ui,/referenceProblems/);assert.match(backend,/reference_evidence_gate_blocked/);

  console.log(JSON.stringify({alpha:'26-wf4',package:'reference-provenance-intake',ownerReferences:ownerRefs.length,externalReferencePersisted:true,canonicalBindingPersisted:true,serverReferenceGate:true,approvedReferenceStillNonProduction:true,staffIntakeVisible:true,status:'pass'},null,2));
}finally{db.close()}
