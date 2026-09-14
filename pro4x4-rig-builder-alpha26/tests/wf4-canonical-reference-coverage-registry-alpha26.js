'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {RigDatabase}=require('../server/database');
const coverage=require('../canonical-reference-coverage-registry.js');
const setRegistry=require('../canonical-master-set-registry.js');
const readinessGov=require('../render-readiness-governance.js');
const boundary=require('../visual-governance-write-boundary.js');
const root=path.join(__dirname,'..');
const vehicleId='nissan-y62-warrior-2025';
const actor={actorId:'wf4-reference-coverage',displayName:'WF4 Reference Coverage',role:'admin'};
const clone=v=>JSON.parse(JSON.stringify(v));
const writeAsset=(db,a)=>db.db.prepare('UPDATE render_assets SET payload_json=? WHERE asset_id=?').run(JSON.stringify(a),a.assetId);
const db=new RigDatabase(':memory:');
try{
  const sync=db.syncVisualGovernanceRegistry({vehicleId},{actor});
  assert.equal(sync.summary.productionEligible,0,'coverage sync must never promote a visual');
  assert.equal(sync.coverageUpdatedCount,3,'all governed canonical masters must persist a coverage snapshot');
  assert.equal(sync.summary.canonicalReferenceCoverage.total,3);
  assert.equal(sync.summary.canonicalReferenceCoverage.current,3);
  assert.equal(sync.summary.canonicalReferenceCoverage.complete,2);
  assert.equal(sync.summary.canonicalReferenceCoverage.blockedSourceGap,1);
  assert.equal(sync.summary.canonicalReferenceCoverage.blockedEvidence,0);

  let assets=db.listRenderAssets({vehicleId}),refs=assets.filter(x=>x.assetClass==='reference'),masters=assets.filter(x=>coverage.canonical(x));
  const f34=masters.find(x=>x.viewId==='front34'),side=masters.find(x=>x.viewId==='side'),r34=masters.find(x=>x.viewId==='rear34');
  assert(f34&&side&&r34);
  assert.equal(coverage.freshness(f34.canonicalReferenceCoverage,f34,refs),'current');
  assert.equal(f34.canonicalReferenceCoverage.status,'complete');
  assert.equal(f34.canonicalReferenceCoverage.summary.required,3);
  assert.equal(f34.canonicalReferenceCoverage.summary.registered,3);
  assert.equal(f34.canonicalReferenceCoverage.summary.checksumMatched,3);
  assert.equal(f34.canonicalReferenceCoverage.summary.attested,3);
  assert.equal(f34.canonicalReferenceCoverage.summary.reviewApproved,3);
  assert.equal(side.canonicalReferenceCoverage.status,'blocked-source-gap');
  assert.equal(side.canonicalReferenceCoverage.summary.required,3);
  assert.equal(side.canonicalReferenceCoverage.summary.requiredGaps,1);
  assert(side.canonicalReferenceCoverage.problems.some(x=>x.includes('required source gap retained')),'SIDE coverage must preserve the declared geometry-source gap');
  assert.equal(r34.canonicalReferenceCoverage.status,'complete');
  assert.equal(r34.canonicalReferenceCoverage.summary.required,2);
  assert.match(f34.canonicalReferenceCoverage.coverageSha256,/^[a-f0-9]{64}$/);
  assert.equal(f34.canonicalReferenceCoverage.authority,'reference-coverage-evidence-only');
  assert.equal(f34.canonicalReferenceCoverage.productionEligible,false);
  assert(boundary.summary(f34).protectedPaths.includes('canonicalReferenceCoverage'),'coverage metadata must be governance-write protected');

  const f34Readiness=readinessGov.assess(f34,refs,[]),sideReadiness=readinessGov.assess(side,refs,[]);
  assert(!f34Readiness.blockers.some(x=>x.code==='CANONICAL_REFERENCE_COVERAGE'),'complete F34 coverage must not create a false readiness blocker');
  assert(sideReadiness.blockers.some(x=>x.code==='CANONICAL_REFERENCE_COVERAGE'),'required SIDE source gap must be visible through the persisted coverage readiness control');

  const set=f34.canonicalMasterSetRegistry;
  assert.equal(setRegistry.freshness(set,{vehicleId,masters,references:refs}),'current');
  const setF34=set.basis.masters.find(x=>x.viewId==='front34'),setSide=set.basis.masters.find(x=>x.viewId==='side');
  assert.equal(setF34.canonicalReferenceCoverage.freshness,'current');
  assert.equal(setF34.canonicalReferenceCoverage.status,'complete');
  assert.equal(setSide.canonicalReferenceCoverage.status,'blocked-source-gap');
  assert(set.problems.some(x=>x.includes('Y62-SIDE-V1: canonical reference coverage blocked-source-gap')),'vehicle truth index must surface SIDE coverage state');

  const tampered=clone(f34);tampered.canonicalReferenceCoverage.coverageSha256='f'.repeat(64);
  assert.throws(()=>db.upsertRenderAsset(tampered,{actor}),e=>e?.code==='governance_metadata_protected'&&e.changedPaths?.includes('canonicalReferenceCoverage'),'generic editor must not forge persisted reference coverage');

  const targetId=f34.canonicalReferenceCoverage.basis.requiredReferenceIds[0],target=clone(refs.find(x=>x.assetId===targetId));target.file={...target.file,checksumSha256:'c'.repeat(64)};writeAsset(db,target);
  assets=db.listRenderAssets({vehicleId});refs=assets.filter(x=>x.assetClass==='reference');masters=assets.filter(x=>coverage.canonical(x));const staleF34=masters.find(x=>x.viewId==='front34');
  assert.equal(coverage.freshness(staleF34.canonicalReferenceCoverage,staleF34,refs),'stale','reference checksum drift must stale the exact canonical coverage snapshot');

  const resync=db.syncVisualGovernanceRegistry({vehicleId},{actor});
  assert.equal(resync.summary.productionEligible,0);
  assert.equal(resync.summary.canonicalReferenceCoverage.current,3);
  assert.equal(resync.summary.canonicalReferenceCoverage.blockedEvidence,2,'shared drifted F34 source must evidence-block both F34 and SIDE after governed refresh');
  const refreshed=db.getRenderAsset('Y62-F34-V1-MASTER');
  assert.equal(refreshed.canonicalReferenceCoverage.status,'blocked-evidence');
  assert(refreshed.canonicalReferenceCoverage.problems.some(x=>x.includes('checksum does not match')),'refreshed coverage must expose checksum mismatch rather than silently accepting drift');
  assert.notEqual(refreshed.canonicalReferenceCoverage.coverageSha256,f34.canonicalReferenceCoverage.coverageSha256);
  const readiness=db.renderReadiness({vehicleId});
  assert.equal(readiness.governanceSchemaVersion,'0.26.29');
  assert.equal(readiness.canonicalReferenceCoverage.total,3);
  assert.equal(readiness.canonicalReferenceCoverage.blockedEvidence,2);
  assert.equal(readiness.summary.productionReadySlots,0);
  const audit=db.listAudit({entityType:'visual-governance',entityId:vehicleId,action:'visual-governance.registry.synced',limit:10});
  assert(audit.some(x=>x.metadata?.coverageUpdatedCount>=1),'coverage refresh must remain visible on the existing visual-governance audit lane');
} finally {db.close()}

const assetHtml=fs.readFileSync(path.join(root,'asset-registry.html'),'utf8'),readyHtml=fs.readFileSync(path.join(root,'readiness.html'),'utf8'),assetUi=fs.readFileSync(path.join(root,'asset-registry.js'),'utf8'),readyUi=fs.readFileSync(path.join(root,'readiness.js'),'utf8'),store=fs.readFileSync(path.join(root,'asset-registry-store.js'),'utf8'),backend=fs.readFileSync(path.join(root,'backend-client.js'),'utf8'),writeBoundary=fs.readFileSync(path.join(root,'visual-governance-write-boundary.js'),'utf8');
assert.match(assetHtml,/canonical-reference-coverage-registry\.js/);assert.match(readyHtml,/CANONICAL REFERENCE COVERAGE/);assert.match(readyHtml,/canonical-reference-coverage-registry\.js/);assert.match(assetUi,/canonicalReferenceCoverageHtml/);assert.match(readyUi,/renderCanonicalReferenceCoverage/);assert.match(store,/canonicalReferenceCoverage/);assert.match(backend,/canonicalReferenceCoverage/);assert.match(writeBoundary,/canonicalReferenceCoverage/);
console.log(JSON.stringify({gate:'wf4-canonical-reference-coverage-registry-alpha26',schemaVersion:coverage.schemaVersion,canonicalViews:3,currentAtBootstrap:3,completeViews:2,sideSourceGapBlocked:true,exactReferenceChecksumsBound:true,packMembershipBound:true,provenanceAttestationBound:true,referenceReviewDecisionBound:true,systemManagedWriteProtected:true,referenceDriftStalesCoverage:true,resyncSurfacesEvidenceDrift:true,readinessVisibility:true,masterSetVisibility:true,sharedBrowserServerBackbone:true,visualPromotion:false,policy:coverage.policy,status:'pass'},null,2));
