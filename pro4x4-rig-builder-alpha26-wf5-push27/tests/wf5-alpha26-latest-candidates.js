'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const crypto=require('node:crypto');
const contract=require('../merged-project-contract');
const {RigDatabase}=require('../server/database');
const {inspect}=require('../server/asset-vault');
const evidence=require('../ranger-source-evidence');
const cands=require('../y62-canonical-candidates');
const review=require('../y62-f34-candidate-02-review');
const root=path.join(__dirname,'..');
function loadBrowser(file){const ctx={};ctx.window=ctx;ctx.globalThis=ctx;vm.runInNewContext(fs.readFileSync(path.join(root,file),'utf8'),ctx,{filename:file});return ctx;}
const data=loadBrowser('data-ranger.js').RANGER_DATA;
const visuals=loadBrowser('product-visual-contract.js').PRO4X4_PRODUCT_VISUALS;
const byId=new Map(data.accessories.map(x=>[x.id,x]));

// Latest WF2 catalogue must remain deduplicated, source-backed and conservative.
assert.equal(data.schemaVersion,'0.26.6');
assert.equal(evidence.schemaVersion,'0.26.6');
assert.equal(data.accessories.length,39);
assert.equal(evidence.sources.length,20);
assert.equal(new Set(data.accessories.map(x=>x.id)).size,39);
assert.equal(new Set(data.accessories.map(x=>x.sku).filter(Boolean)).size,data.accessories.map(x=>x.sku).filter(Boolean).length);

const supportIds=[
  'oa-rally-hoop-stedi-pro-ranger',
  'oa-rally-hoop-9in-ranger',
  'oa-rally-hoop-7in-ranger',
  'oa-22in-slim-lightbar-ranger',
  'oa-deep-dish-floor-mats-ranger'
];
for(const id of supportIds){
  const p=byId.get(id);assert.ok(p,`missing latest WF2 support component ${id}`);
  assert.equal(p.status,'confirmed');
  assert.equal(p.fitment?.source,'manufacturer');
  assert.notEqual(p.visual?.status,'approved',`${id} must not gain approved production visual state in WF2`);
  assert.ok(evidence.sources.some(x=>x.id===id),`missing source evidence for ${id}`);
}
for(const id of ['oa-rally-hoop-stedi-pro-ranger','oa-rally-hoop-9in-ranger','oa-rally-hoop-7in-ranger']){
  const p=byId.get(id);
  assert.deepEqual(Array.from(p.requires).sort(),['oa-camera-relocation-ranger','oa-predator']);
  const gate=visuals.selectionGate(p,data.accessories,new Set());
  assert.equal(gate.allowed,true,'verified hard dependencies may be offered via explicit auto-add');
  assert.deepEqual(Array.from(gate.autoAdd).sort(),['oa-camera-relocation-ranger','oa-predator']);
}
const mats=byId.get('oa-deep-dish-floor-mats-ranger');
assert.equal(mats.visual.visualisable,false);
assert.deepEqual(Array.from(mats.visual.supportedViews),[]);
assert.equal(mats.installTimeHours,null,'unknown manufacturer install duration must remain unknown');
assert.ok(!data.accessories.some(x=>x.sku==='TB-COM-RAL-STE-2XEVO-ASM0'),'Type X EVO hoop must remain outside confirmed Ranger slice without exact fitment evidence');

// Existing conditional external fitment still must survive immutable BOM data.
const caps=byId.get('oa-egr-flare-endcaps-ranger');
assert.ok(caps);
assert.equal(caps.fitment.reviewRequired,true);
assert.deepEqual(Array.from(caps.fitment.anyOfRequiredParts),['oa-predator','oa-toro-ranger']);
assert.deepEqual(Array.from(caps.fitment.requiredExternalParts),['EGR branded flares']);
assert.equal(caps.visual.status,'staff-review');
assert.equal(visuals.selectionGate(caps,data.accessories,new Set()).allowed,false);
const capsWithToro=visuals.selectionGate(caps,data.accessories,new Set(['oa-toro-ranger']));
assert.equal(capsWithToro.allowed,true);
assert.ok(capsWithToro.warnings.some(x=>/fitment review/i.test(x)));
const capsSnap=contract.buildSnapshot({data,selectedProducts:[byId.get('oa-toro-ranger'),caps],lead:{name:'WF5'},reference:'P4X4-WF5-EGR-CAPS'});
const capsSelection=capsSnap.selections.find(x=>x.id===caps.id);
assert.deepEqual(Array.from(capsSelection.fitment.requiredExternalParts),['EGR branded flares']);
assert.ok(capsSnap.gates.some(g=>g.type==='fitment-review'&&g.id===caps.id));

// Ordinary AND dependencies remain durable in immutable BOM gates.
const brush=byId.get('oa-brush-rails-ranger');
assert.ok(brush);
const brushGate=visuals.selectionGate(brush,data.accessories,new Set());
assert.equal(brushGate.allowed,true);
assert.deepEqual(Array.from(brushGate.autoAdd).sort(),['oa-rock-sliders-ranger','oa-toro-ranger']);
const brushSnap=contract.buildSnapshot({data,selectedProducts:[brush],lead:{name:'WF5'},reference:'P4X4-WF5-BRUSH'});
assert.equal(brushSnap.gates.filter(g=>g.type==='dependency'&&String(g.id).startsWith(`${brush.id}:`)).length,2);

// Latest WF2 support expansion increases the blast radius of the returned WF1 any-of defect.
// Both the lower bash plate and the newly added light bar are confirmed products whose saved BOM
// must remain incompatible when neither verified support bar is selected.
const bash=byId.get('oa-lower-bash-ranger');
const light=byId.get('oa-22in-slim-lightbar-ranger');
for(const p of [bash,light]){
  assert.ok(p);
  assert.deepEqual(Array.from(p.fitment.anyOfRequiredParts).sort(),['oa-predator','oa-toro-ranger']);
  assert.equal(visuals.selectionGate(p,data.accessories,new Set()).allowed,false,'pre-selection gate must reject missing OR support');
  assert.equal(visuals.selectionGate(p,data.accessories,new Set(['oa-predator'])).allowed,true,'Predator must satisfy OR support');
  assert.equal(visuals.selectionGate(p,data.accessories,new Set(['oa-toro-ranger'])).allowed,true,'Toro must satisfy OR support');
  const orphan=contract.buildSnapshot({data,selectedProducts:[p],lead:{name:'WF5'},reference:`P4X4-WF5-ORPHAN-${p.id}`});
  assert.ok(orphan.selections[0].fitment.anyOfRequiredParts?.length,'any-of metadata must survive the snapshot');
  const dependencyGate=orphan.gates.some(g=>g.type==='dependency'&&String(g.id).startsWith(`${p.id}:`));
  assert.equal(dependencyGate,false,'expected known WF1 acceptance defect to remain exposed until returned package is fixed');
}

// WF3 Candidate 02 must remain a review artifact only and verifiably non-production.
const cand=cands.getLatest('front34');
assert.equal(cand.candidateId,'Y62-F34-V1-CANDIDATE-02');
assert.equal(cand.governance.state,'master-draft');
assert.equal(cands.productionEligible(cand),false);
assert.equal(review.promotionDecision,'returned-to-wf3');
assert.equal(cand.provenance.productionBinaryRights,'not-separately-recorded');
const binary=fs.readFileSync(path.join(root,cand.source));
assert.equal(crypto.createHash('sha256').update(binary).digest('hex'),cand.file.checksumSha256);
const meta=inspect(binary);
assert.equal(meta.width,1672);assert.equal(meta.height,615);assert.equal(meta.hasAlpha,true);assert.equal(meta.transparencyVerified,true);
const customerHtml=fs.readFileSync(path.join(root,'index.html'),'utf8');
assert.equal(customerHtml.includes(cand.source),false);
assert.equal(customerHtml.includes('y62-f34-candidate-02-review.js'),false);
const db=new RigDatabase(':memory:');
try{
  const resolved=db.resolveProductionRenderStack({vehicleId:'nissan-y62-warrior-2025',viewId:'front34',requirements:[{layerId:'base',exactSku:null,state:{paintId:'black-obsidian'},stateKey:'paint:black-obsidian'}]});
  assert.equal(resolved.productionReady,false);
  assert.equal(resolved.layers[0].state,'missing');
  assert.equal(resolved.layers[0].reason,'reference-only-not-production');
}finally{db.close();}

console.log(JSON.stringify({gate:'wf5-alpha26-latest-candidates',wf2Catalogue39:true,wf2Evidence20:true,wf2SupportExpansionVerified:true,wf1AnyOfBlastRadius:['oa-lower-bash-ranger','oa-22in-slim-lightbar-ranger'],wf3Candidate02ReviewOnly:true,wf3CustomerResolverState:'missing',status:'pass'},null,2));
