'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {createApp}=require('../server/server');
const pack=require('../y62-reference-pack.js');
const briefs=require('../y62-canonical-briefs.js');
const packGov=require('../reference-pack-governance.js');
const reviewGate=require('../canonical-review-gate.js');

(async()=>{
  const actor={actorId:'wf4-reference-pack-admin',displayName:'WF4 Reference Pack Admin',role:'admin'};
  const {server,db}=createApp({dbFile:':memory:',seed:false});
  const sync=db.syncVisualGovernanceRegistry({vehicleId:pack.vehicleId},{actor});
  const manifest=packGov.manifest(pack,briefs.briefs||{});
  assert.match(manifest.manifestSha256,/^[a-f0-9]{64}$/);
  assert.equal(manifest.packId,'Y62-OWNER-REFERENCE-PACK-V1');
  assert.equal(manifest.declaredReferenceCount,9);
  assert.equal(manifest.declaredGapCount,1);

  let records=db.listRenderAssets({vehicleId:pack.vehicleId});
  const refs=records.filter(x=>x.assetClass==='reference'&&x.referencePack?.packId===manifest.packId);
  const masters=records.filter(x=>x.assetClass==='canonical-master'&&x.layerId==='base'&&x.canonicalView);
  assert.equal(refs.length,9,'all declared owner references must be persisted as pack members');
  assert.equal(masters.length,3,'all canonical masters must persist a reference-pack binding');
  for(const r of refs){
    assert.equal(r.referencePack.manifestSha256,manifest.manifestSha256);
    assert.equal(r.referencePack.productionEligible,false);
    assert.equal(r.status,'reference-only');
    assert.equal(r.referenceEvidence.productionEligible,false);
  }
  for(const m of masters){
    assert.equal(m.referencePack.packId,manifest.packId);
    assert.equal(m.referencePack.manifestSha256,manifest.manifestSha256);
    assert.deepEqual(m.referencePack.requiredReferenceIds,m.canonicalView.referenceIds);
    assert.equal(m.status,'candidate');
    assert.equal(m.governance.state,'master-draft');
  }

  let readiness=db.renderReadiness({vehicleId:pack.vehicleId});
  assert.equal(readiness.visualPolicy,'REFERENCE_BACKED_APPROVED_VISUALS_ONLY');
  assert.equal(readiness.referencePack.status,'complete');
  assert.equal(readiness.referencePack.registeredReferenceCount,9);
  assert.equal(readiness.referencePack.approvedReferenceCount,9);
  assert.equal(readiness.referencePack.problems.length,0);
  assert.equal(readiness.referencePack.gaps.length,1);

  const refId='OWNER-Y62-F34-01',original=db.getRenderAsset(refId);
  const badChecksum={...original,file:{...original.file,checksumSha256:'e'.repeat(64)}};
  db.db.prepare('UPDATE render_assets SET payload_json=? WHERE asset_id=?').run(JSON.stringify(badChecksum),refId);
  readiness=db.renderReadiness({vehicleId:pack.vehicleId});
  assert.equal(readiness.referencePack.status,'blocked');
  assert(readiness.referencePack.problems.some(x=>x.code==='CHECKSUM_MISMATCH'&&x.assetId===refId));
  assert.equal(db.getRenderAsset(refId).status,'reference-only','pack integrity failure must not promote or rewrite reference runtime state');

  const staleBinding={...original,referencePack:{...original.referencePack,manifestSha256:'f'.repeat(64)}};
  db.db.prepare('UPDATE render_assets SET payload_json=? WHERE asset_id=?').run(JSON.stringify(staleBinding),refId);
  readiness=db.renderReadiness({vehicleId:pack.vehicleId});
  assert(readiness.referencePack.problems.some(x=>x.code==='PACK_BINDING_STALE'&&x.assetId===refId));
  const resync=db.syncVisualGovernanceRegistry({vehicleId:pack.vehicleId},{actor});
  assert(resync.metadataUpdated.includes(refId),'governance sync must restore the persisted current pack binding without changing visual state');
  readiness=db.renderReadiness({vehicleId:pack.vehicleId});
  assert.equal(readiness.referencePack.status,'complete');
  assert.equal(db.getRenderAsset(refId).referencePack.manifestSha256,manifest.manifestSha256);

  records=db.listRenderAssets({vehicleId:pack.vehicleId});
  const f34=db.getRenderAsset('Y62-F34-V1-MASTER'),currentRefs=records.filter(x=>x.assetClass==='reference');
  const requiredId=f34.canonicalView.referenceIds[0];
  const tamperedRefs=currentRefs.map(r=>r.assetId===requiredId?{...r,referencePack:{...r.referencePack,manifestSha256:'a'.repeat(64)}}:r);
  const packProblems=reviewGate.referenceProblems(f34,tamperedRefs);
  assert(packProblems.some(x=>x.includes('stale canonical reference-pack manifest')),'canonical review must reject a required reference that no longer matches the persisted pack manifest');

  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
  const base=`http://127.0.0.1:${server.address().port}`;
  try{
    const r=await fetch(`${base}/api/v1/staff/render-readiness?vehicleId=${encodeURIComponent(pack.vehicleId)}`,{headers:{'x-pro4x4-role':'sales','x-pro4x4-actor':'wf4-pack-sales'}});
    assert.equal(r.status,200);
    const out=await r.json();
    assert.equal(out.referencePack.packId,manifest.packId);
    assert.equal(out.referencePack.status,'complete');
    assert.equal(out.referencePack.references.length,9);
  }finally{await new Promise(resolve=>server.close(resolve))}

  const root=path.join(__dirname,'..'),readinessHtml=fs.readFileSync(path.join(root,'readiness.html'),'utf8'),readinessUi=fs.readFileSync(path.join(root,'readiness.js'),'utf8'),assetUi=fs.readFileSync(path.join(root,'asset-registry.js'),'utf8');
  assert.match(readinessHtml,/REFERENCE PACK REGISTRY/);
  assert.match(readinessHtml,/reference-pack-governance\.js/);
  assert.match(readinessUi,/PACK INTEGRITY BLOCKERS/);
  assert.match(readinessUi,/Manifest SHA-256/);
  assert.match(assetUi,/Manifest SHA-256/);
  assert.equal(sync.createdCount,12);

  console.log(JSON.stringify({gate:'wf4-reference-pack-registry-alpha26',packId:manifest.packId,manifestSha256:manifest.manifestSha256,declaredReferences:9,canonicalMasters:3,packComplete:true,checksumTamperDetected:true,staleBindingDetected:true,syncRestoresBinding:true,canonicalReviewPackGate:true,staffVisibility:true,referenceOnlyPreserved:true,visualPromotion:false,policy:packGov.POLICY,status:'pass'},null,2));
})().catch(e=>{console.error(e);process.exit(1)});
