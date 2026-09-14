const assert=require('assert'),fs=require('fs'),vm=require('vm');
const ctx={window:{}};vm.createContext(ctx);vm.runInContext(fs.readFileSync('data-ranger.js','utf8'),ctx);
const d=ctx.window.RANGER_DATA,ev=require('../ranger-source-evidence.js');
assert.equal(d.schemaVersion,'0.26.22');assert.equal(ev.schemaVersion,'0.26.22');assert.equal(d.accessories.length,73);assert.equal(ev.sources.length,54);
const byId=new Map(d.accessories.map(x=>[x.id,x]));
const ids=d.accessories.map(x=>x.id),skus=d.accessories.map(x=>x.sku).filter(Boolean);assert.equal(new Set(ids).size,ids.length);assert.equal(new Set(skus).size,skus.length);
const w=byId.get('runva-11expedition-ranger-frontbar');assert(w);assert.equal(w.sku,'11EXPEDITION12V');assert.equal(w.price,1295);assert.equal(w.weightKg,29);assert.equal(w.storefrontListedWeightKg,31);assert.equal(w.shippingWeightKg,39);assert.equal(w.install,null);assert.equal(w.installTimeHours,null);assert.equal(w.status,'confirmed');assert.equal(w.fitment.reviewRequired,false);assert.deepEqual([...w.fitment.anyOfRequiredParts].sort(),['oa-predator','oa-toro-ranger']);assert.equal(w.fitment.installationPricingEvidence.normalizedStandaloneWinchLabourAud,null);assert.equal(w.fitment.electricalSupportState.exactIsolationPartSku,null);assert.equal(w.fitment.electricalSupportState.state,'installer-check');assert.equal(w.visual.visualisable,false);assert.equal(w.visual.status,'priced-only');assert.notEqual(w.visual.status,'approved');
for(const parent of ['oa-predator','oa-toro-ranger']){const p=byId.get(parent);assert(p.fitment.optionalParts.includes(w.id),`${parent} missing governed winch option`);}
const e=ev.sources.find(x=>x.id===w.id);assert(e);assert.equal(e.rrpAud,1295);assert.equal(e.fittedWeightKg,29);assert.equal(e.offroadAnimalStorefrontListedWeightKg,31);assert.equal(e.fittingPartnerBundlePricingAud.standaloneWinchLabourNormalized,null);assert.equal(e.ratedLinePullLb,11000);assert.equal(e.barRatedMaxWinchLb,12000);
for(const p of d.accessories){
 for(const ref of (p.requires||[])) assert(byId.has(ref),`${p.id} broken requires ${ref}`);
 for(const key of ['requiredParts','optionalParts','anyOfRequiredParts']) for(const ref of (p.fitment?.[key]||[])) assert(byId.has(ref),`${p.id} broken fitment ${key} ${ref}`);
 for(const route of (p.fitment?.mountingRoutes||[])) for(const ref of (route.requiredParts||[])) assert(byId.has(ref),`${p.id} broken mounting route requiredParts ${ref}`);
 for(const candidate of (p.fitment?.supportCandidates||[])) if(candidate.partId) assert(byId.has(candidate.partId),`${p.id} broken support candidate ${candidate.partId}`);
}
console.log('WF2 Ranger Runva 11EXPEDITION winch route governance: PASS');
