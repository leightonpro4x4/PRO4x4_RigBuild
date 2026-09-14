'use strict';
const assert=require('node:assert');
const {RigDatabase}=require('../server/database');

const actor={actorId:'wf4-review-admin',displayName:'WF4 Review Admin',role:'admin'};
const db=new RigDatabase(':memory:');
try{
  let asset=db.listRenderAssets({vehicleId:'nissan-y62-warrior-2025'}).find(x=>x.viewId==='front34'&&x.layerId==='base');
  assert(asset,'Y62 front34 canonical base fixture missing');
  const sha='e'.repeat(64),reviewedAt='2026-09-13T11:45:00.000Z';
  db.attachAssetObject(asset.assetId,{checksumSha256:sha,objectKey:'sha256/ee/wf4-review-gate.png',mimeType:'image/png',width:1672,height:615,hasAlpha:true,transparencyVerified:true,sizeBytes:2048},{actor});
  asset=db.getRenderAsset(asset.assetId);
  const base={...asset,status:'production-ready',assetClass:'canonical-master',governance:{...(asset.governance||{}),state:'master-approved'},provenance:{...(asset.provenance||{}),sourceType:'pro4x4-original',licenceStatus:'owned'},cameraGeometry:{...(asset.cameraGeometry||{}),matched:true}};

  assert.throws(()=>db.upsertRenderAsset(base,{actor}),e=>e?.code==='asset_gate_blocked'&&/reviewer identity missing/.test(e.message)&&/review timestamp missing/.test(e.message),'direct production upsert must reject absent reviewer evidence');

  const reviewed={...base,governance:{...base.governance,reviewedBy:'Y62 Visual Reviewer',reviewedAt}};
  const live=db.upsertRenderAsset(reviewed,{actor});
  assert.equal(live.status,'production-ready');
  assert.equal(live.approval?.reviewEvidence?.reviewState,'master-approved');
  assert.equal(live.approval?.reviewEvidence?.reviewedBy,'Y62 Visual Reviewer');
  assert.equal(live.approval?.reviewEvidence?.reviewedAt,reviewedAt);
  assert.equal(live.approval?.reviewEvidence?.checksumSha256,sha);
  assert.equal(live.approval?.reviewEvidence?.promotionPath,'direct-upsert');
  assert.equal(live.approval?.state,'approved-production');

  const audit=db.listAudit({entityType:'render-asset',entityId:asset.assetId,limit:20}).find(e=>e.action==='render.asset.updated');
  assert(audit?.metadata?.reviewEvidence,'production audit event must retain immutable review evidence');
  assert.equal(audit.metadata.reviewEvidence.reviewedBy,'Y62 Visual Reviewer');

  const changed={...live,governance:{...live.governance,reviewedBy:'Different Reviewer',reviewedAt:'2026-09-13T11:46:00.000Z'}};
  assert.throws(()=>db.upsertRenderAsset(changed,{actor}),e=>e?.code==='review_evidence_immutable','live production reviewer evidence must not be mutable through direct upsert');

  const persisted=db.getRenderAsset(asset.assetId);
  assert.equal(persisted.approval.reviewEvidence.reviewedBy,'Y62 Visual Reviewer');
  assert.equal(persisted.approval.reviewEvidence.reviewedAt,reviewedAt);
  console.log(JSON.stringify({gate:'wf4-production-review-gate-alpha26',directUnreviewedRejected:true,reviewEvidencePersisted:true,auditEvidencePersisted:true,reviewEvidenceImmutable:true,status:'pass'},null,2));
}finally{db.close()}
