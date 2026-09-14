const assert=require('assert'),fs=require('fs'),path=require('path');
const {RigDatabase}=require('../server/database');
const root=path.join(__dirname,'..');
(function(){
  const db=new RigDatabase(':memory:');
  const actor={actorId:'wf4-reviewer',displayName:'WF4 QA Reviewer',role:'admin'};
  const assetId='WF4-EVIDENCE-VISIBILITY-TEST';
  db.upsertRenderAsset({
    schemaVersion:'0.26.4',assetId,assetClass:'canonical-master',vehicleId:'nissan-y62-warrior-2025',viewId:'front34',layerId:'base',exactSku:null,status:'candidate',source:null,
    renderState:{paintId:'factory-black'},
    provenance:{sourceType:'reference-derived-canonical',sourceUrl:null,referenceIds:['OWNER-Y62-F34-01','OWNER-Y62-F34-02','OWNER-Y62-FRONT-01'],licenceStatus:'pending-render',licenceNote:'Reference-backed candidate only.'},
    file:{checksumSha256:null,mimeType:null,width:null,height:null,hasAlpha:null},
    cameraGeometry:{profileId:'Y62-F34-V1',matched:false,notes:'Awaiting overlay review.'},
    fitmentScope:['nissan-y62-warrior-2025'],approval:{state:'not-reviewed',approvedBy:null,approvedAt:null,notes:''},
    governance:{state:'master-draft',reviewedBy:null,reviewedAt:null},history:[]
  },{actor});
  const staged=db.stageAssetVersion(assetId,{checksumSha256:'b'.repeat(64),objectKey:'wf4/test-v0001.png',mimeType:'image/png',width:1672,height:615,hasAlpha:true,transparencyVerified:true,sizeBytes:12345},{actor});
  const reviewed={...staged.payload,governance:{...staged.payload.governance,state:'master-approved',reviewedBy:'WF4 QA Reviewer',reviewedAt:'2026-09-13T10:30:00.000Z'},provenance:{...staged.payload.provenance,sourceType:'reference-derived-canonical',licenceStatus:'owned',licenceNote:'Canonical reconstruction owned by PRO4X4; owner references retained as provenance evidence.',referenceIds:['OWNER-Y62-F34-01','OWNER-Y62-F34-02','OWNER-Y62-FRONT-01']},cameraGeometry:{...staged.payload.cameraGeometry,matched:true,notes:'Overlay contract passed.'},approval:{...staged.payload.approval,notes:'Overlay and provenance reviewed.'}};
  db.updateAssetVersion(assetId,staged.versionId,reviewed,{actor});
  const promoted=db.promoteAssetVersion(assetId,staged.versionId,{actor});
  assert.equal(promoted.version.state,'production');
  assert.equal(promoted.version.payload.approval.reviewEvidence.reviewedBy,'WF4 QA Reviewer');
  assert.equal(promoted.version.payload.approval.reviewEvidence.reviewState,'master-approved');
  assert.equal(promoted.version.payload.approval.reviewEvidence.versionId,staged.versionId);
  assert.equal(promoted.asset.provenance.referenceIds.length,3);
  const audit=db.listAudit({entityType:'render-asset',entityId:assetId,action:'render.asset.version.promoted',limit:10});
  assert.equal(audit.length,1);assert.equal(audit[0].metadata.reviewEvidence.reviewedBy,'WF4 QA Reviewer');
  db.close();

  const ui=fs.readFileSync(path.join(root,'asset-registry.js'),'utf8');
  assert.match(ui,/IMMUTABLE PROMOTION EVIDENCE/);
  assert.match(ui,/reviewEvidenceHtml/);
  assert.match(ui,/approval\?\.reviewEvidence/);
  assert.match(ui,/versionLifecycle/);
  assert.match(ui,/reference-evidence-list/);
  assert.match(ui,/RECORD HISTORY/);
  assert.match(ui,/REVIEWER PENDING/);
  assert.match(ui,/Promotion evidence is stored inside the immutable production version payload and mirrored in the audit event/);
  const css=fs.readFileSync(path.join(root,'styles.css'),'utf8');
  assert.match(css,/\.asset-review-evidence/);assert.match(css,/\.reference-evidence-row/);assert.match(css,/\.asset-history/);
  console.log(JSON.stringify({alpha:'26-wf4',package:'review-evidence-visibility',immutablePromotionEvidence:true,versionLifecycleVisible:true,canonicalReferencePackVisible:true,recordHistoryVisible:true,auditEvidenceVisible:true,status:'pass'},null,2));
})();
