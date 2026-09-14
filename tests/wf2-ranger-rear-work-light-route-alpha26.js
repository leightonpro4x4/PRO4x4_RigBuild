const assert=require('assert'),fs=require('fs'),vm=require('vm');
const ctx={window:{}};vm.createContext(ctx);vm.runInContext(fs.readFileSync('data-ranger.js','utf8'),ctx);
const d=ctx.window.RANGER_DATA,ev=require('../ranger-source-evidence.js');
assert.equal(d.schemaVersion,'0.26.22');assert.equal(ev.schemaVersion,'0.26.22');assert.equal(d.accessories.length,73);assert.equal(ev.sources.length,54);
const byId=new Map(d.accessories.map(x=>[x.id,x]));
const ids=d.accessories.map(x=>x.id),skus=d.accessories.map(x=>x.sku).filter(Boolean);assert.equal(new Set(ids).size,ids.length);assert.equal(new Set(skus).size,skus.length);
const l=byId.get('oa-cube-reverse-work-light-ranger-rearbar');assert(l);assert.equal(l.sku,'ORA-ALO-2-E4T');assert.equal(l.price,95);assert.equal(l.weightKg,0.5);assert.equal(l.storefrontListedWeightKg,1);assert.equal(l.pairWeightKg,1);assert.equal(l.requiredQuantity,2);assert.equal(l.pairRrpBasisAud,190);assert.equal(l.rearBarOptionBundlePriceAud,null);assert.equal(l.install,null);assert.equal(l.installTimeHours,null);assert.equal(l.status,'engineering');assert.equal(l.fitment.reviewRequired,true);assert.deepEqual(l.requires,['oa-rear-protection-ranger']);assert.deepEqual(l.fitment.requiredParts,['oa-rear-protection-ranger']);assert.equal(l.fitment.identityResolution.state,'engineering-candidate-not-exact-sku-proven');assert.equal(l.fitment.identityResolution.exactSkuPrintedOnRearBarPdp,false);assert.equal(l.fitment.identityResolution.exactSkuPrintedInRearBarFittingInstructions,false);assert.equal(l.fitment.electricalSupportState.exactHarnessSku,null);assert.equal(l.fitment.electricalSupportState.blocking,true);assert.equal(l.visual.status,'staff-review');assert.notEqual(l.visual.status,'approved');
const rear=byId.get('oa-rear-protection-ranger');assert(rear.fitment.optionalParts.includes(l.id));
const e=ev.sources.find(x=>x.id===l.id);assert(e);assert.equal(e.rrpAud,95);assert.equal(e.weightKg,0.5);assert.equal(e.storefrontListedWeightKg,1);assert.equal(e.requiredQuantity,2);assert.equal(e.rearBarEvidence.lightSkuPrinted,false);assert.equal(e.sourceState,'engineering-candidate-not-exact-sku-proven');
for(const p of d.accessories){
 for(const ref of (p.requires||[])) assert(byId.has(ref),`${p.id} broken requires ${ref}`);
 for(const key of ['requiredParts','optionalParts','anyOfRequiredParts']) for(const ref of (p.fitment?.[key]||[])) assert(byId.has(ref),`${p.id} broken fitment ${key} ${ref}`);
 for(const route of (p.fitment?.mountingRoutes||[])) for(const ref of (route.requiredParts||[])) assert(byId.has(ref),`${p.id} broken mounting route requiredParts ${ref}`);
 for(const candidate of (p.fitment?.supportCandidates||[])) if(candidate.partId) assert(byId.has(candidate.partId),`${p.id} broken support candidate ${candidate.partId}`);
}
for(const p of d.accessories) assert.notEqual(p.visual?.status,'approved',`${p.id} unexpectedly approved visual`);
console.log('WF2 Ranger rear work-light candidate route governance: PASS');
