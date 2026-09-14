'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {RigDatabase}=require('../server/database');
const visualSeal=require('../quote-visual-governance-seal');

const admin={actorId:'wf4-visual-seal-admin',displayName:'WF4 Visual Seal Admin',role:'admin'};
const customer={actorId:'wf4-visual-seal-customer',displayName:'WF4 Visual Seal Customer',role:'customer'};
const db=new RigDatabase(':memory:');
const reference='P4X4-WF4-VISUAL-SEAL';
const missingRender={view:'front34',fallbackPolicy:'none',productionReady:false,exactMatchRequired:true,resolverVersion:'0.26.20',layers:[{layerId:'base',exactSku:null,state:'missing',reason:'canonical-master-not-production',assetId:null,checksumSha256:null}]};
function snapshot(){return {reference,vehicle:{id:'nissan-y62-warrior-2025',yearRange:'2025',make:'Nissan',model:'Patrol Y62',trim:'Warrior',view:'front34'},lead:{name:'WF4 Visual Seal QA',phone:'0400000000'},selections:[],gates:[],pricing:{currency:'AUD',components:{parts:0,labour:0,paint:0,freight:0,engineering:0},unpricedComponentCounts:{parts:0,labour:0,paint:0,freight:0,engineering:0},knownSubtotal:0,isComplete:true},render:missingRender,workflow:{status:'ready-to-quote',owner:null,staffNotes:'',lastUpdatedAt:'2026-09-14T01:00:00+09:30'},catalogue:{revision:'Y62-CAT-VISUAL-SEAL-QA'},contract:{version:'0.12.0'}}}
try{
  db.syncVisualGovernanceRegistry({vehicleId:'nissan-y62-warrior-2025'},{actor:admin});
  const root=path.join(__dirname,'..');
  const salesHtml=fs.readFileSync(path.join(root,'sales.html'),'utf8'),salesJs=fs.readFileSync(path.join(root,'sales.js'),'utf8'),backend=fs.readFileSync(path.join(root,'backend-client.js'),'utf8');
  assert.match(salesHtml,/quote-visual-governance-seal\.js/);
  assert.match(salesJs,/SEALED VISUAL GOVERNANCE EVIDENCE/);
  assert.match(salesJs,/REFERENCE PACK/);
  assert.match(backend,/quote_visual_lineage_immutable/);

  const saved=db.saveProjectRevision('P4X4-PROJ-WF4-VISUAL-SEAL',snapshot(),{expectedVersion:0,source:'wf4-visual-seal-qa',actor:customer});
  const quote=db.upsertQuote(saved.snapshot,{actor:customer,action:'quote.submitted'});
  assert.ok(quote.visualGovernanceSeal);
  assert.equal(quote.visualGovernanceSeal.policy,'REFERENCE_BACKED_APPROVED_VISUALS_ONLY');
  assert.equal(quote.visualGovernanceSeal.purpose,'QUOTE_VISUAL_GOVERNANCE_EVIDENCE_SEAL');
  assert.match(quote.visualGovernanceSeal.sealSha256,/^[a-f0-9]{64}$/);
  assert.equal(quote.visualGovernanceSeal.basis.quote.renderSnapshotSha256,visualSeal.renderHash(quote.render));
  assert.equal(quote.visualGovernanceSeal.basis.canonicalMaster.assetId,'Y62-F34-V1-MASTER');
  assert.equal(quote.visualGovernanceSeal.basis.canonicalMaster.canonicalView.briefId,'Y62-F34-V1');
  assert.equal(quote.visualGovernanceSeal.basis.referencePack.packId,'Y62-OWNER-REFERENCE-PACK-V1');
  assert.match(quote.visualGovernanceSeal.basis.referencePack.manifestSha256,/^[a-f0-9]{64}$/);
  assert.equal(quote.visualGovernanceSeal.basis.canonicalMaster.references.length,3);
  quote.visualGovernanceSeal.basis.canonicalMaster.references.forEach(r=>{assert.equal(r.status,'reference-only');assert.equal(r.governanceState,'reference-approved');assert.equal(r.productionEligible,false);assert.match(r.checksumSha256,/^[a-f0-9]{64}$/);assert.match(r.attestationBasisSha256,/^[a-f0-9]{64}$/)});

  let report=db.inspectQuoteLineage(reference,{actor:admin});
  assert.equal(report.visualGovernance.state,'verified');
  assert.equal(report.visualGovernance.canonicalMaster.assetId,'Y62-F34-V1-MASTER');
  assert.equal(report.visualGovernance.referencePack.packId,'Y62-OWNER-REFERENCE-PACK-V1');
  assert.equal(report.status,'verified');

  assert.throws(()=>db.updateQuote(reference,{...quote,render:{...quote.render,view:'side'}},{actor:admin}),e=>e?.code==='quote_visual_lineage_immutable');
  const edited=db.updateQuote(reference,{...quote,workflow:{...quote.workflow,owner:'WF4 Sales',staffNotes:'Pricing review only'}},{actor:admin});
  assert.equal(edited.visualGovernanceSeal.sealSha256,quote.visualGovernanceSeal.sealSha256);
  assert.deepEqual(edited.render,quote.render);

  // Simulate out-of-band persisted governance drift. The quote-time seal must remain intact and staff must see the drift.
  const master=db.getRenderAsset('Y62-F34-V1-MASTER');
  const tampered=JSON.parse(JSON.stringify(master));
  tampered.candidateHandoff={...(tampered.candidateHandoff||{}),intake:{...(tampered.candidateHandoff?.intake||{}),state:'simulated-out-of-band-change'}};
  db.db.prepare('UPDATE render_assets SET payload_json=? WHERE asset_id=?').run(JSON.stringify(tampered),master.assetId);
  report=db.inspectQuoteLineage(reference,{actor:admin});
  assert.equal(report.visualGovernance.state,'verified-with-drift');
  assert.equal(report.status,'verified-with-warnings');
  assert.ok(report.visualGovernance.warnings.some(x=>x.includes('differs from the state sealed with this quote')));
  assert.equal(report.visualGovernance.canonicalMaster.candidateHandoff.intakeState,quote.visualGovernanceSeal.basis.canonicalMaster.candidateHandoff.intakeState);
  assert.equal(report.visualGovernance.currentCanonicalMaster.candidateHandoff.intakeState,'simulated-out-of-band-change');

  // The persisted quote-time seal itself is tamper-evident: editing sealed evidence without recomputing its SHA blocks inspection.
  const persisted=db.getQuote(reference),forged=JSON.parse(JSON.stringify(persisted));
  forged.visualGovernanceSeal.basis.referencePack.packId='FORGED-PACK-ID';
  db.db.prepare('UPDATE quotes SET payload_json=? WHERE reference=?').run(JSON.stringify(forged),reference);
  report=db.inspectQuoteLineage(reference,{actor:admin});
  assert.equal(report.visualGovernance.state,'blocked');
  assert.equal(report.status,'blocked');
  assert.ok(report.visualGovernance.problems.some(x=>x.includes('fingerprint is invalid')));

  console.log(JSON.stringify({gate:'wf4-quote-visual-governance-seal-alpha26',persistedSeal:true,canonicalMasterBound:true,referencePackVisible:true,ownerReferencesSnapshotted:3,renderImmutable:true,driftVisible:true,sealedEvidenceTamperDetected:true,policy:quote.visualGovernanceSeal.policy,status:'pass'},null,2));
}finally{db.close()}
