'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {createApp}=require('../server/server');
const governance=require('../render-readiness-governance.js');

(async()=>{
  const actor={actorId:'wf4-readiness-admin',displayName:'WF4 Readiness Admin',role:'admin'};
  const {server,db}=createApp({dbFile:':memory:',seed:false});
  db.syncVisualGovernanceRegistry({vehicleId:'nissan-y62-warrior-2025'},{actor});
  const before=db.renderReadiness({vehicleId:'nissan-y62-warrior-2025'});
  assert.equal(before.visualPolicy,'REFERENCE_BACKED_APPROVED_VISUALS_ONLY');
  assert.equal(before.canonicalAssessments.length,3);
  assert(before.canonicalAssessments.every(x=>x.freshness==='unassessed'));

  const f34Before=db.getRenderAsset('Y62-F34-V1-MASTER');
  const assessed=db.assessRenderReadiness({vehicleId:'nissan-y62-warrior-2025'},{actor});
  assert.equal(assessed.summary.canonicalMasters,3);
  assert.equal(assessed.summary.ready,0);
  assert.equal(assessed.summary.blocked,3);
  const f34=db.getRenderAsset('Y62-F34-V1-MASTER');
  assert(f34.readinessAssessment,'canonical readiness assessment must persist on the governed master record');
  assert.equal(f34.readinessAssessment.policy,governance.policy);
  assert.equal(f34.readinessAssessment.verdict,'blocked');
  assert.match(f34.readinessAssessment.fingerprintSha256,/^[a-f0-9]{64}$/);
  assert.equal(f34.readinessAssessment.referenceSnapshots.length,3);
  assert.equal(f34.readinessAssessment.assessedBy.actorId,actor.actorId);
  assert(f34.readinessAssessment.blockers.some(x=>x.code==='MASTER_APPROVAL'));
  assert(f34.readinessAssessment.blockers.some(x=>x.code==='PRODUCTION_BINARY'));
  assert.equal(f34.status,f34Before.status,'readiness assessment must not change the canonical master registry status');
  assert.equal(f34.governance.state,'master-draft');

  let report=db.renderReadiness({vehicleId:'nissan-y62-warrior-2025'});
  let state=report.canonicalAssessments.find(x=>x.assetId===f34.assetId);
  assert.equal(state.freshness,'current');
  assert.equal(state.persistedHashValid,true);
  assert.equal(state.currentVerdict,'blocked');

  const refId=f34.canonicalView.referenceIds[0],ref=db.getRenderAsset(refId),changed={...ref,file:{...ref.file,checksumSha256:'e'.repeat(64)}};
  db.db.prepare('UPDATE render_assets SET payload_json=? WHERE asset_id=?').run(JSON.stringify(changed),refId);
  report=db.renderReadiness({vehicleId:'nissan-y62-warrior-2025'});
  state=report.canonicalAssessments.find(x=>x.assetId===f34.assetId);
  assert.equal(state.freshness,'stale','changed reference evidence must visibly stale the persisted readiness assessment');
  assert.notEqual(state.fingerprintSha256,f34.readinessAssessment.fingerprintSha256);
  assert.equal(db.getRenderAsset(refId).status,'reference-only');
  assert.equal(db.getRenderAsset(refId).referenceEvidence.productionEligible,false);

  db.assessRenderReadiness({vehicleId:'nissan-y62-warrior-2025'},{actor});
  report=db.renderReadiness({vehicleId:'nissan-y62-warrior-2025'});
  state=report.canonicalAssessments.find(x=>x.assetId===f34.assetId);
  assert.equal(state.freshness,'current','reassessment must seal the changed current evidence rather than silently treating the old assessment as current');
  const events=db.listAudit({action:'render.readiness.assessed',entityType:'render-readiness',entityId:'nissan-y62-warrior-2025',limit:20});
  assert.equal(events.length,2);
  assert(events.every(e=>e.integrity?.eventHash),'readiness assessment audit events must remain on the tamper-evident audit chain');

  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
  const base=`http://127.0.0.1:${server.address().port}`,headers={'content-type':'application/json','x-pro4x4-role':'admin','x-pro4x4-actor':actor.actorId,'x-pro4x4-name':actor.displayName};
  try{
    let r=await fetch(`${base}/api/v1/staff/render-readiness/assess`,{method:'POST',headers,body:JSON.stringify({vehicleId:'nissan-y62-warrior-2025'})});assert.equal(r.status,200);const out=await r.json();assert.equal(out.policy,governance.policy);assert.equal(out.summary.canonicalMasters,3);
    r=await fetch(`${base}/api/v1/staff/render-readiness/assess`,{method:'POST',headers:{'content-type':'application/json','x-pro4x4-role':'sales','x-pro4x4-actor':'wf4-sales'},body:JSON.stringify({vehicleId:'nissan-y62-warrior-2025'})});assert.equal(r.status,403,'sales may inspect readiness but may not persist governance assessments');
  }finally{await new Promise(resolve=>server.close(resolve))}

  const root=path.join(__dirname,'..'),html=fs.readFileSync(path.join(root,'readiness.html'),'utf8'),ui=fs.readFileSync(path.join(root,'readiness.js'),'utf8'),css=fs.readFileSync(path.join(root,'styles.css'),'utf8');
  assert.match(html,/ASSESS \+ PERSIST READINESS/);assert.match(html,/render-readiness-governance\.js/);assert.match(ui,/PERSISTED READINESS ASSESSMENT/);assert.match(ui,/STALE ASSESSMENT/);assert.match(ui,/CURRENT GOVERNANCE CHANGED/);assert.match(css,/\.canonical-assessment\.stale/);
  console.log(JSON.stringify({gate:'wf4-render-readiness-assessment-alpha26',canonicalMastersAssessed:3,persistedOnCanonicalMaster:true,sha256Fingerprint:true,ownerReferenceSnapshots:3,staleOnReferenceMutation:true,reassessmentRestoresCurrent:true,auditChained:true,staffEndpoint:true,writeRoleGuard:true,visualPromotion:false,policy:governance.policy,status:'pass'},null,2));
})().catch(e=>{console.error(e);process.exit(1)}).finally(()=>{});
