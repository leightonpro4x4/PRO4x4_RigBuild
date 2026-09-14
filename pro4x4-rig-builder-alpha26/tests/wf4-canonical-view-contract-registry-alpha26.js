'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {RigDatabase}=require('../server/database');
const viewContracts=require('../canonical-view-contract-registry.js');
const readinessGov=require('../render-readiness-governance.js');
const boundary=require('../visual-governance-write-boundary.js');
const setRegistry=require('../canonical-master-set-registry.js');
const root=path.join(__dirname,'..');
const vehicleId='nissan-y62-warrior-2025';
const actor={actorId:'wf4-view-contract-registry',displayName:'WF4 View Contract Registry',role:'admin'};
const clone=v=>JSON.parse(JSON.stringify(v));
const db=new RigDatabase(':memory:');
try{
  const sync=db.syncVisualGovernanceRegistry({vehicleId},{actor});
  assert.equal(sync.summary.productionEligible,0,'view-contract sync must never promote a visual');
  const summary=sync.summary.canonicalViewContracts;
  assert.equal(summary.total,3);assert.equal(summary.current,3);assert.equal(summary.locked,1);assert.equal(summary.calibration,2);assert.equal(summary.stale,0);assert.equal(summary.invalid,0);assert.equal(summary.missing,0);

  const assets=db.listRenderAssets({vehicleId}),refs=assets.filter(x=>x.assetClass==='reference'),masters=assets.filter(x=>setRegistry.canonical(x));
  assert.equal(masters.length,3);
  const f34=masters.find(x=>x.viewId==='front34'),side=masters.find(x=>x.viewId==='side'),r34=masters.find(x=>x.viewId==='rear34');
  assert(f34&&side&&r34);
  for(const m of masters){
    const c=m.canonicalViewContract;
    assert(c,'canonical master must persist its canonical view contract');
    assert.match(c.contractSha256,/^[a-f0-9]{64}$/);assert.match(c.basisSha256,/^[a-f0-9]{64}$/);
    assert.equal(c.authority,'view-contract-evidence-only');assert.equal(c.productionEligible,false);assert.equal(c.policy,'REFERENCE_BACKED_APPROVED_VISUALS_ONLY');
    assert.equal(c.basis.assetId,m.assetId);assert.equal(c.basis.viewId,m.viewId);assert.equal(c.basis.referencePack.packId,'Y62-OWNER-REFERENCE-PACK-V1');
    assert(c.basis.briefSourceSchemaVersion);assert(c.basis.cameraProfileSourceSchemaVersion);assert(c.basis.brief?.briefId);assert(c.basis.cameraProfile?.profileId);
    assert.equal(viewContracts.freshness(c,m),'current');
    assert(boundary.summary(m).protectedPaths.includes('canonicalViewContract'),'generic staff editor must not own view-contract evidence');
  }
  assert.equal(f34.canonicalViewContract.state,'locked');
  assert.equal(side.canonicalViewContract.state,'calibration');assert.equal(r34.canonicalViewContract.state,'calibration');
  assert.equal(f34.canonicalViewContract.basis.brief.canvas.width,1672);assert.equal(f34.canonicalViewContract.basis.brief.canvas.height,615);
  assert.equal(f34.canonicalViewContract.basis.cameraProfile.outputCanvas.width,1672);assert.equal(f34.canonicalViewContract.basis.cameraProfile.outputCanvas.height,615);
  assert.equal(viewContracts.readinessProblems(f34.canonicalViewContract,f34).length,0,'F34 static brief/camera contract must be locked and internally current');
  assert(viewContracts.readinessProblems(side.canonicalViewContract,side).some(x=>x.includes('locked is required')),'SIDE calibration state must remain production-blocking');
  assert(viewContracts.readinessProblems(r34.canonicalViewContract,r34).some(x=>x.includes('locked is required')),'R34 calibration state must remain production-blocking');

  const tamper=clone(f34);tamper.canonicalViewContract.contractSha256='f'.repeat(64);
  assert.throws(()=>db.upsertRenderAsset(tamper,{actor}),e=>e?.code==='governance_metadata_protected'&&e.changedPaths?.includes('canonicalViewContract'),'generic staff edit must not forge the persisted view-contract registry');

  const changed=clone(f34);changed.canonicalView.camera=`${changed.canonicalView.camera} / drift`;
  assert.equal(viewContracts.freshness(f34.canonicalViewContract,changed),'stale','brief/camera contract drift must stale persisted evidence');
  const corrupt=clone(f34);corrupt.canonicalViewContract.contractSha256='0'.repeat(64);
  assert.equal(viewContracts.freshness(corrupt.canonicalViewContract,corrupt),'invalid','contract hash tampering must fail integrity');

  const f34Assessment=readinessGov.assess(f34,refs,[]),sideAssessment=readinessGov.assess(side,refs,[]);
  assert(!f34Assessment.blockers.some(x=>x.code==='CANONICAL_VIEW_CONTRACT'),'locked F34 contract must not add a false view-contract blocker');
  assert(sideAssessment.blockers.some(x=>x.code==='CANONICAL_VIEW_CONTRACT'),'SIDE calibration contract must remain visible as a readiness blocker');

  const set=f34.canonicalMasterSetRegistry;
  assert.equal(setRegistry.freshness(set,{vehicleId,masters,references:refs}),'current');
  const setF34=set.basis.masters.find(x=>x.viewId==='front34'),setSide=set.basis.masters.find(x=>x.viewId==='side');
  assert.equal(setF34.canonicalViewContract.freshness,'current');assert.equal(setF34.canonicalViewContract.state,'locked');
  assert.equal(setSide.canonicalViewContract.freshness,'current');assert.equal(setSide.canonicalViewContract.state,'calibration');
  assert(set.problems.some(x=>x.includes('Y62-SIDE-V1: canonical view contract calibration')),'vehicle truth index must surface non-locked SIDE contract');

  const readiness=db.renderReadiness({vehicleId});
  assert.equal(readiness.governanceSchemaVersion,'0.26.29');assert.equal(readiness.canonicalViewContracts.total,3);assert.equal(readiness.canonicalViewContracts.locked,1);assert.equal(readiness.canonicalViewContracts.calibration,2);
  assert.equal(readiness.summary.productionReadySlots,0,'new view-contract evidence must not create customer production visuals');
} finally {db.close()}

const assetHtml=fs.readFileSync(path.join(root,'asset-registry.html'),'utf8'),readyHtml=fs.readFileSync(path.join(root,'readiness.html'),'utf8'),assetUi=fs.readFileSync(path.join(root,'asset-registry.js'),'utf8'),readyUi=fs.readFileSync(path.join(root,'readiness.js'),'utf8'),store=fs.readFileSync(path.join(root,'asset-registry-store.js'),'utf8'),backend=fs.readFileSync(path.join(root,'backend-client.js'),'utf8'),writeBoundary=fs.readFileSync(path.join(root,'visual-governance-write-boundary.js'),'utf8');
assert.match(assetHtml,/canonical-view-contract-registry\.js/);assert.match(readyHtml,/canonical-view-contract-registry\.js/);
assert.match(assetUi,/CANONICAL VIEW CONTRACT/);assert.match(readyUi,/Canonical view contract/);
assert.match(store,/canonicalViewContract/);assert.match(backend,/canonicalViewContracts/);assert.match(writeBoundary,/canonicalViewContract/);
console.log(JSON.stringify({gate:'wf4-canonical-view-contract-registry-alpha26',schemaVersion:viewContracts.schemaVersion,persistedCanonicalViewContracts:3,current:3,locked:1,calibration:2,f34ContractSha256:'303bc938a957a99c703a78bf8b2a6c6f6e77464a919b1e41c834f7aac6d9e4e0',briefAndCameraEvidenceBound:true,sharedReferencePackBound:true,systemManagedWriteProtected:true,contractDriftFailsClosed:true,contractTamperDetected:true,readinessVisibility:true,masterSetVisibility:true,sharedBrowserServerBackbone:true,visualPromotion:false,policy:viewContracts.policy,status:'pass'},null,2));
