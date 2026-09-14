'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {RigDatabase}=require('../server/database');
const sourceGap=require('../canonical-source-gap-resolution.js');
const coverage=require('../canonical-reference-coverage-registry.js');
const readiness=require('../render-readiness-governance.js');
const boundary=require('../visual-governance-write-boundary.js');
const root=path.join(__dirname,'..');
const vehicleId='nissan-y62-warrior-2025';
const actor={actorId:'wf4-source-gap',displayName:'WF4 Source Gap Reviewer',role:'admin'};
const clone=v=>JSON.parse(JSON.stringify(v));
const writeAsset=(db,a)=>db.db.prepare('UPDATE render_assets SET payload_json=? WHERE asset_id=?').run(JSON.stringify(a),a.assetId);
const db=new RigDatabase(':memory:');
try{
  const sync=db.syncVisualGovernanceRegistry({vehicleId},{actor});
  assert.equal(sync.summary.productionEligible,0,'source-gap sync must not promote a visual');
  assert.equal(sync.sourceGapUpdatedCount,1,'only SIDE declares a required canonical source gap');
  assert.equal(sync.summary.canonicalSourceGaps.totalRequired,1);
  assert.equal(sync.summary.canonicalSourceGaps.current,1);
  assert.equal(sync.summary.canonicalSourceGaps.open,1);
  assert.equal(sync.summary.canonicalSourceGaps.approved,0);

  let assets=db.listRenderAssets({vehicleId}),refs=assets.filter(x=>x.assetClass==='reference'),side=assets.find(x=>x.assetId==='Y62-SIDE-V1-MASTER');
  assert(side);
  assert.equal(sourceGap.freshness(side.canonicalSourceGapResolution,side,refs),'current');
  assert.equal(side.canonicalSourceGapResolution.decision,'open');
  assert.equal(side.canonicalSourceGapResolution.authority,'source-gap-decision-only');
  assert.equal(side.canonicalSourceGapResolution.productionEligible,false);
  assert.match(side.canonicalSourceGapResolution.resolutionSha256,/^[a-f0-9]{64}$/);
  assert.match(side.canonicalSourceGapResolution.basisSha256,/^[a-f0-9]{64}$/);
  assert(boundary.summary(side).protectedPaths.includes('canonicalSourceGapResolution'),'dedicated source-gap authority must be protected from generic editing');
  assert.equal(side.canonicalReferenceCoverage.status,'blocked-source-gap');
  assert(readiness.assess(side,refs,[]).blockers.some(x=>x.code==='SOURCE_GAP'),'readiness must fail closed on the dedicated source-gap decision');

  const forged=clone(side);forged.canonicalSourceGapResolution={...forged.canonicalSourceGapResolution,decision:'approved'};
  assert.throws(()=>db.upsertRenderAsset(forged,{actor}),e=>e?.code==='governance_metadata_protected'&&e.changedPaths?.includes('canonicalSourceGapResolution'),'generic editor cannot forge source-gap approval');

  assert.throws(()=>db.submitCanonicalSourceGapResolution(side.assetId,{decision:'approved',resolutionMethod:'reviewed-reconstruction',notes:'Attempt before WF3 evidence exists.'},{actor}),e=>e?.code==='canonical_source_gap_resolution_blocked'&&e.fieldErrors?.some(x=>/CURRENT\/LOCKED canonical view contract|WF3 candidate|ready-for-wf4-review|claimed canonical reviewer/.test(x.message)),'reviewed reconstruction approval must fail closed before locked view + WF3 + reviewer evidence');
  side=db.getRenderAsset(side.assetId);assert.equal(side.canonicalSourceGapResolution.decision,'open');

  const returned=db.submitCanonicalSourceGapResolution(side.assetId,{decision:'returned',notes:'Keep SIDE source gap open until a clean square-on source or fully governed reconstruction evidence exists.'},{actor});
  assert.equal(returned.resolution.decision,'returned');
  assert.equal(returned.freshness,'current');
  assert.equal(returned.asset.canonicalReferenceCoverage.status,'blocked-source-gap');
  assert.equal(returned.asset.status,'candidate');
  assert.equal(returned.asset.canonicalSourceGapResolution.productionEligible,false);

  assets=db.listRenderAssets({vehicleId});refs=assets.filter(x=>x.assetClass==='reference');side=assets.find(x=>x.assetId==='Y62-SIDE-V1-MASTER');
  const targetId=side.referencePack.requiredReferenceIds[0],target=clone(refs.find(x=>x.assetId===targetId));
  target.file={...target.file,checksumSha256:'d'.repeat(64)};writeAsset(db,target);
  assets=db.listRenderAssets({vehicleId});refs=assets.filter(x=>x.assetClass==='reference');side=assets.find(x=>x.assetId==='Y62-SIDE-V1-MASTER');
  assert.equal(sourceGap.freshness(side.canonicalSourceGapResolution,side,refs),'stale','required reference drift must stale an explicit source-gap decision');
  const staleDecisionSha=side.canonicalSourceGapResolution.resolutionSha256;
  const resync=db.syncVisualGovernanceRegistry({vehicleId},{actor});
  side=db.getRenderAsset(side.assetId);refs=db.listRenderAssets({vehicleId}).filter(x=>x.assetClass==='reference');
  assert.equal(side.canonicalSourceGapResolution.resolutionSha256,staleDecisionSha,'explicit returned/approved source-gap decisions must never be silently rewritten by sync');
  assert.equal(sourceGap.freshness(side.canonicalSourceGapResolution,side,refs),'stale');
  assert.equal(resync.summary.productionEligible,0);
  assert.equal(db.listRenderAssets({vehicleId}).filter(x=>x.status==='production-ready').length,0);
  const audit=db.listAudit({entityType:'render-asset',entityId:'Y62-SIDE-V1-MASTER',limit:50});
  assert(audit.some(x=>x.action==='canonical.source-gap.returned'),'dedicated source-gap decision must remain visible in the existing audit ledger');
} finally {db.close()}

const assetHtml=fs.readFileSync(path.join(root,'asset-registry.html'),'utf8');
const readyHtml=fs.readFileSync(path.join(root,'readiness.html'),'utf8');
const assetUi=fs.readFileSync(path.join(root,'asset-registry.js'),'utf8');
const readyUi=fs.readFileSync(path.join(root,'readiness.js'),'utf8');
const server=fs.readFileSync(path.join(root,'server/server.js'),'utf8');
const persistence=fs.readFileSync(path.join(root,'persistence.js'),'utf8');
assert.match(assetHtml,/canonical-source-gap-resolution\.js/);
assert.match(readyHtml,/CANONICAL SOURCE-GAP DECISIONS/);
assert.match(readyHtml,/canonical-source-gap-resolution\.js/);
assert.match(assetUi,/canonicalSourceGapResolutionHtml/);
assert.doesNotMatch(assetUi,/id="canonicalGapStatus"/,'generic canonical review form must no longer expose source-gap approval');
assert.match(readyUi,/renderCanonicalSourceGaps/);
assert.match(server,/source-gap-resolution/);
assert.match(persistence,/submitCanonicalSourceGapResolution/);
console.log(JSON.stringify({gate:'wf4-canonical-source-gap-resolution-alpha26',schemaVersion:sourceGap.schemaVersion,requiredGapViews:1,currentOpenAtBootstrap:1,dedicatedDecisionAuthority:true,genericApprovalRemoved:true,writeBoundaryProtected:true,reviewedReconstructionFailsClosed:true,explicitReturnPersisted:true,requiredReferenceDriftStalesDecision:true,syncDoesNotRewriteExplicitDecision:true,auditVisible:true,staffRegistryVisible:true,visualPromotion:false,policy:sourceGap.policy,status:'pass'},null,2));
