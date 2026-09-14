'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const integrity=require('../audit-integrity.js');
const {createApp}=require('../server/server');

(async()=>{
  assert.equal(integrity.sha256Hex('abc'),'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad','shared SHA-256 helper must match the standard test vector');
  const actor={actorId:'wf4-audit-admin',displayName:'WF4 Audit Admin',role:'admin'};
  const {server,db}=createApp({dbFile:':memory:',seed:false});
  const before=db.verifyAuditIntegrity();
  assert.equal(before.status,'sealed','fresh Alpha 26 runtime audit ledger must be fully sealed');
  assert(before.totalEvents>0&&before.totalEvents===before.sealedEvents,'all current events must carry chain evidence');
  assert.match(before.headHash,/^[a-f0-9]{64}$/);

  db.audit('render.asset.governance.qa','render-asset','Y62-F34-V1',{governanceState:'master-draft',productionEligible:false,referenceIds:['Y62-OWNER-F34-01'],decision:'reference-backed-draft-only'},actor);
  const visualEvent=db.listAudit({entityType:'render-asset',entityId:'Y62-F34-V1',limit:20}).find(e=>e.action==='render.asset.governance.qa');
  assert(visualEvent?.integrity?.eventHash,'visual-governance audit events must persist tamper-evident evidence');
  assert.equal(visualEvent.metadata.productionEligible,false);
  const clean=db.verifyAuditIntegrity();
  assert.equal(clean.status,'sealed');
  assert.equal(clean.sealedEvents,clean.totalEvents);

  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
  const base=`http://127.0.0.1:${server.address().port}`,headers={'x-pro4x4-role':'admin','x-pro4x4-actor':'wf4-audit-admin','x-pro4x4-name':'WF4 Audit Admin'};
  try{
    let r=await fetch(`${base}/api/v1/staff/audit/integrity`,{headers});assert.equal(r.status,200);let report=await r.json();assert.equal(report.status,'sealed');assert.equal(report.policy,'append-only-sha256-chain');
    r=await fetch(`${base}/api/v1/staff/audit/integrity`,{headers:{'x-pro4x4-role':'customer','x-pro4x4-actor':'wf4-audit-customer'}});assert.equal(r.status,403,'customer role must not inspect staff audit controls');

    const row=db.db.prepare('SELECT rowid,payload_json FROM audit_events ORDER BY rowid ASC LIMIT 1 OFFSET 5').get();assert(row,'expected an audit row to tamper for regression proof');const payload=JSON.parse(row.payload_json);payload.metadata={...(payload.metadata||{}),tamperedAfterWrite:true};db.db.prepare('UPDATE audit_events SET payload_json=? WHERE rowid=?').run(JSON.stringify(payload),row.rowid);
    report=db.verifyAuditIntegrity();assert.equal(report.status,'broken','post-write mutation must be detected');assert(report.problems.some(p=>p.code==='event_hash_mismatch'),'tamper report must identify the changed event hash');
    const governed=db.listRenderAssets({vehicleId:'nissan-y62-warrior-2025'}).find(x=>x.assetClass==='canonical-master');assert(governed);assert.throws(()=>db.upsertRenderAsset({...governed,status:'production-ready'},{actor}),e=>e?.code==='audit_integrity_blocked','broken audit evidence must block direct production transition');
    r=await fetch(`${base}/api/v1/staff/audit/integrity`,{headers});assert.equal(r.status,200);const broken=await r.json();assert.equal(broken.status,'broken');assert(broken.problems.length>0);

    const auditHtml=fs.readFileSync(path.join(__dirname,'..','audit.html'),'utf8');assert(auditHtml.indexOf('audit-integrity.js')<auditHtml.indexOf('audit-store.js'),'browser-local audit chain helper must load before the append-only store');assert(auditHtml.includes('value="render-asset"'),'staff audit UI must expose render-asset governance filtering');
    console.log(JSON.stringify({gate:'wf4-audit-production-controls-alpha26',sha256StandardVector:true,fullySealedLedger:true,visualGovernanceEvidenceSealed:true,staffIntegrityEndpoint:true,roleGuard:true,tamperDetected:true,productionBlockedOnBrokenAudit:true,customerProductionPolicy:'REFERENCE_BACKED_APPROVED_VISUALS_ONLY unchanged',status:'pass'},null,2));
  }finally{await new Promise(resolve=>server.close(resolve));db.close()}
})().catch(e=>{console.error(e);process.exit(1)});
