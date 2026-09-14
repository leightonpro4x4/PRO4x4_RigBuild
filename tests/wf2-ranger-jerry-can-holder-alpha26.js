const assert=require('assert'),fs=require('fs'),vm=require('vm');
const ctx={window:{}};vm.createContext(ctx);vm.runInContext(fs.readFileSync('data-ranger.js','utf8'),ctx);
const d=ctx.window.RANGER_DATA,ev=require('../ranger-source-evidence.js');
assert.equal(d.schemaVersion,'0.26.22');assert.equal(ev.schemaVersion,'0.26.22');assert.equal(d.accessories.length,73);assert.equal(ev.sources.length,54);
const byId=new Map(d.accessories.map(x=>[x.id,x]));
const ids=d.accessories.map(x=>x.id),skus=d.accessories.map(x=>x.sku).filter(Boolean);assert.equal(new Set(ids).size,ids.length);assert.equal(new Set(skus).size,skus.length);
const h=byId.get('oa-dual-jerry-holder-horizontal-ranger'),u=byId.get('oa-dual-jerry-holder-upright-ranger');assert(h&&u);
for(const [p,sku,price,orientation,length,internal] of [[h,'JC-COM-DBL-LGE-ASM0',265,'horizontal',512,505],[u,'JC-COM-DBL-STD-ASM0',240,'upright',375,369]]){
 assert.equal(p.sku,sku);assert.equal(p.price,price);assert.equal(p.priceState,'verified-current-manufacturer-price-not-explicit-msrp');assert.equal(p.weightKg,null);assert.equal(p.storefrontListedWeightKg,3);assert.equal(p.install,null);assert.equal(p.installTimeHours,null);assert.equal(p.capacityCans,2);assert.equal(p.orientation,orientation);assert.equal(p.material,'3 mm aluminium');assert.equal(p.dimensionsMm.length,length);assert.equal(p.internalDimensionsMm.length,internal);assert.equal(p.status,'engineering');assert.equal(p.fitment.reviewRequired,true);assert.equal(p.fitment.source,'manufacturer-exact-vehicle-category-only');assert.equal(p.fitment.requiredParts.length,0);assert.equal(p.fitment.mountingSupportState.state,'unresolved-staff-review');assert.equal(p.fitment.mountingSupportState.blocking,true);assert.equal(p.fitment.mountingSupportState.exactMountingSurface,null);assert.equal(p.fitment.mountingSupportState.exactHardwareSku,null);assert.equal(p.visual.status,'staff-review');assert.equal(p.visual.visualisable,false);assert.notEqual(p.visual.status,'approved');
 const e=ev.sources.find(x=>x.id===p.id);assert(e);assert.equal(e.sku,sku);assert.equal(e.rrpAud,null);assert.equal(e.currentManufacturerPriceAud,price);assert.equal(e.weightKg,null);assert.equal(e.storefrontListedWeightKg,3);assert.equal(e.sourceState,'engineering-category-listed-mounting-route-unresolved');assert.equal(e.fittingPartsState.exactMountingSurface,null);assert.equal(e.fittingPartsState.exactHardwareSku,null);
}
for(const p of d.accessories){
 for(const ref of (p.requires||[])) assert(byId.has(ref),`${p.id} broken requires ${ref}`);
 for(const key of ['requiredParts','optionalParts','anyOfRequiredParts']) for(const ref of (p.fitment?.[key]||[])) assert(byId.has(ref),`${p.id} broken fitment ${key} ${ref}`);
 for(const route of (p.fitment?.mountingRoutes||[])) for(const ref of (route.requiredParts||[])) assert(byId.has(ref),`${p.id} broken mounting route requiredParts ${ref}`);
 for(const candidate of (p.fitment?.supportCandidates||[])) if(candidate.partId) assert(byId.has(candidate.partId),`${p.id} broken support candidate ${candidate.partId}`);
}
for(const p of d.accessories) assert.notEqual(p.visual?.status,'approved',`${p.id} unexpectedly approved visual`);
console.log('WF2 Ranger dual jerry-can holder governance: PASS');
