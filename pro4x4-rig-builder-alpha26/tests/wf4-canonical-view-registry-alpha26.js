'use strict';
const assert=require('node:assert');
const fs=require('node:fs');
const path=require('node:path');
const {RigDatabase}=require('../server/database');
const root=path.join(__dirname,'..');
const actor={actorId:'wf4-canonical-admin',displayName:'WF4 Canonical Admin',role:'admin'};
const db=new RigDatabase(':memory:');
try{
  const first=db.syncVisualGovernanceRegistry({vehicleId:'nissan-y62-warrior-2025'},{actor});
  assert.equal(first.summary.byClass.reference,9,'owner reference pack must persist nine reference records');
  assert.equal(first.summary.byClass['canonical-master']>=3,true,'three canonical master slots must persist');
  const assets=db.listRenderAssets({vehicleId:'nissan-y62-warrior-2025'});
  const masters=assets.filter(x=>x.assetClass==='canonical-master'&&x.canonicalView).sort((a,b)=>a.canonicalView.priority-b.canonicalView.priority);
  assert.equal(masters.length,3,'F34/SIDE/R34 canonical view metadata must be persisted');
  assert.deepEqual(masters.map(x=>x.canonicalView.briefId),['Y62-F34-V1','Y62-SIDE-V1','Y62-R34-V1']);
  const f34=masters[0],side=masters[1];
  assert.equal(f34.canonicalView.reviewContractId,'Y62-F34-V1-OVERLAY-01');
  assert.equal(f34.canonicalView.reviewContractRequiredChecks.length,8);
  assert.equal(f34.canonicalView.referenceIds.length,3);
  assert.equal(side.canonicalView.referenceGap?.severity,'required','side canonical master must expose the owner-pack source gap');
  for(const id of f34.canonicalView.referenceIds){
    const ref=assets.find(x=>x.assetId===id);assert(ref,`missing canonical reference ${id}`);assert.equal(ref.assetClass,'reference');assert.equal(ref.referenceEvidence.productionEligible,false);assert(ref.referenceEvidence.canonicalViewIds.includes('Y62-F34-V1'));
  }

  const prior=db.getRenderAsset(f34.assetId);
  const edited={...prior,canonicalView:undefined,approval:{...prior.approval,notes:'Candidate review notes must survive metadata refresh.'},governance:{...prior.governance,state:'master-draft',reviewedBy:null,reviewedAt:null}};
  // Simulate legacy/corrupted persisted metadata beneath the staff write boundary; generic staff upsert is intentionally blocked from removing canonicalView.
  db.db.prepare('UPDATE render_assets SET payload_json=? WHERE asset_id=?').run(JSON.stringify(edited),edited.assetId);
  const second=db.syncVisualGovernanceRegistry({vehicleId:'nissan-y62-warrior-2025'},{actor});
  assert(second.metadataUpdated.includes(f34.assetId),'sync must backfill missing static canonical metadata');
  const refreshed=db.getRenderAsset(f34.assetId);
  assert.equal(refreshed.canonicalView.briefId,'Y62-F34-V1');
  assert.equal(refreshed.approval.notes,'Candidate review notes must survive metadata refresh.','metadata refresh must not overwrite reviewer/candidate work');
  assert.equal(refreshed.governance.state,'master-draft');
  const third=db.syncVisualGovernanceRegistry({vehicleId:'nissan-y62-warrior-2025'},{actor});
  assert.equal(third.metadataUpdatedCount,0,'canonical metadata sync must be idempotent');

  const ui=fs.readFileSync(path.join(root,'readiness.js'),'utf8'),html=fs.readFileSync(path.join(root,'readiness.html'),'utf8'),css=fs.readFileSync(path.join(root,'styles.css'),'utf8');
  assert.match(html,/CANONICAL VIEW REGISTRY/);assert.match(html,/y62-reference-pack\.js/);assert.match(html,/y62-canonical-briefs\.js/);assert.match(html,/y62-f34-overlay-review-contract\.js/);
  assert.match(ui,/REFERENCE PACK/);assert.match(ui,/OPEN PRODUCTION BLOCKERS/);assert.match(ui,/canonicalBlockers/);assert.match(ui,/referenceGap/);assert.match(ui,/REVIEW EVIDENCE/);assert.match(ui,/CANDIDATE REVIEW/);assert.match(css,/\.canonical-registry/);

  console.log(JSON.stringify({alpha:'26-wf4',package:'canonical-view-registry',canonicalMasters:masters.length,ownerReferences:9,front34ReviewContract:f34.canonicalView.reviewContractId,sideSourceGapVisible:true,metadataBackfillPreservesReviewWork:true,idempotent:true,customerVisualPromotion:false,status:'pass'},null,2));
} finally { db.close(); }
