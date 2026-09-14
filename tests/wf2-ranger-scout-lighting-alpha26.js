const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const root=path.resolve(__dirname,'..');
const ctx={window:{}};vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.join(root,'data-ranger.js'),'utf8'),ctx);
const d=ctx.window.RANGER_DATA;const ev=require(path.join(root,'ranger-source-evidence.js'));
assert.equal(d.schemaVersion,'0.26.22');assert.equal(ev.schemaVersion,'0.26.22');assert.equal(d.accessories.length,73);assert.equal(ev.sources.length,54);
const byId=new Map(d.accessories.map(x=>[x.id,x]));
const rack=byId.get('oa-scout-rack-ranger');assert(rack);

// Highest-priority unresolved support part remains explicitly unresolved: observed legacy SKU is evidence only.
const deflector=(rack.fitment.unresolvedAccessoryMappings||[]).find(x=>x.option==='light-bar-wind-deflector');
assert(deflector);assert.equal(deflector.state,'engineering');assert.equal(deflector.candidateSkuObserved,'RR-FRA-PX-11-SCT-LBKIT');assert.equal(deflector.candidateState,'reference-only-not-proven-nextgen');assert(/do not promote/i.test(deflector.reason));
assert(!d.accessories.some(x=>x.sku==='RR-FRA-PX-11-SCT-LBKIT'),'legacy deflector must not enter governed Next-Gen catalogue as confirmed product');

const slim=byId.get('oa-slim-42-lightbar-scout-ranger');
assert(slim);assert.equal(slim.sku,'ORA-ALO-S5D1-40');assert.equal(slim.price,280);assert.equal(slim.weightKg,2.7);assert.equal(slim.storefrontListedWeightKg,4);assert.equal(slim.install,null);assert.equal(slim.installTimeHours,null);assert.equal(slim.status,'engineering');assert(slim.requires.includes(rack.id));
assert.equal(slim.specification.powerW,200);assert.equal(slim.specification.effectiveLumens,9406);assert.equal(slim.specification.bodyDimensionsMm.length,1065);
assert.equal(slim.fitment.reviewRequired,true);assert.equal(slim.fitment.blockedByUnresolvedSupportPart,true);assert.equal(slim.fitment.requiredSupportState.role,'light-bar-wind-deflector');assert.equal(slim.fitment.requiredSupportState.state,'engineering-unresolved');assert.equal(slim.fitment.requiredSupportState.sku,null);assert.equal(slim.visual.status,'staff-review');assert.notEqual(slim.visual.status,'approved');

const dbl=byId.get('oa-double-42-lightbar-scout-ranger');
assert(dbl);assert.equal(dbl.sku,'ORA-ALO-D6D1-40');assert.equal(dbl.price,440);assert.equal(dbl.weightKg,null);assert.equal(dbl.storefrontListedWeightKg,6);assert.equal(dbl.install,null);assert.equal(dbl.installTimeHours,null);assert.equal(dbl.status,'engineering');assert(dbl.requires.includes(rack.id));
assert.equal(dbl.specification.powerW,400);assert.equal(dbl.specification.rawLumens,38080);assert.equal(dbl.fitment.reviewRequired,true);assert.equal(dbl.fitment.blockedByUnresolvedSupportPart,true);assert.equal(dbl.fitment.requiredSupportState.state,'engineering-unresolved');assert.equal(dbl.visual.status,'staff-review');assert.notEqual(dbl.visual.status,'approved');

for(const id of [slim.id,dbl.id]) assert(rack.fitment.optionalParts.includes(id),`${id} must be an exact Scout PDP optional product`);
const mapped=(rack.fitment.unresolvedAccessoryMappings||[]).find(x=>x.option==='42-inch-light-bar-support-route');
assert(mapped);assert.equal(mapped.state,'engineering');assert(mapped.mappedProductIds.includes(slim.id));assert(mapped.mappedProductIds.includes(dbl.id));

const es=ev.sources.find(x=>x.id===slim.id),ed=ev.sources.find(x=>x.id===dbl.id),er=ev.sources.find(x=>x.id===rack.id);
assert(es&&ed&&er);assert.equal(es.sku,slim.sku);assert.equal(es.rrpAud,slim.price);assert.equal(es.weightKg,2.7);assert.equal(ed.sku,dbl.sku);assert.equal(ed.rrpAud,dbl.price);assert.equal(ed.weightKg,null);assert.equal(ed.storefrontListedWeightKg,6);
const erDef=(er.unresolvedAccessoryMappings||[]).find(x=>x.option==='Light Bar wind deflector');assert(erDef);assert.equal(erDef.candidateSkuObserved,'RR-FRA-PX-11-SCT-LBKIT');assert.equal(erDef.candidateState,'reference-only-not-proven-nextgen');
const erLights=(er.unresolvedAccessoryMappings||[]).find(x=>x.option==='42-inch light bars');assert(erLights);assert.equal(erLights.state,'products-governed-support-unresolved');assert(erLights.mappedProductIds.includes(slim.id)&&erLights.mappedProductIds.includes(dbl.id));

// Global identity/dependency integrity and conservative visual-governance guard.
const ids=d.accessories.map(x=>x.id),skus=d.accessories.map(x=>x.sku).filter(Boolean);assert.equal(new Set(ids).size,ids.length);assert.equal(new Set(skus).size,skus.length);
for(const p of d.accessories){
  for(const dep of [...(p.requires||[]),...(p.fitment?.requiredParts||[]),...(p.fitment?.anyOfRequiredParts||[])]) assert(byId.has(dep),`${p.id} missing dependency ${dep}`);
  for(const route of p.fitment?.mountingRoutes||[]) for(const dep of route.requiredParts||[]) assert(byId.has(dep),`${p.id} route ${route.route} missing dependency ${dep}`);
  for(const c of p.fitment?.supportCandidates||[]) assert(byId.has(c.partId),`${p.id} support candidate missing ${c.partId}`);
  for(const c of p.fitment?.alternativeGovernedParts||[]) assert(byId.has(c.partId),`${p.id} alternate part missing ${c.partId}`);
  for(const dep of p.fitment?.optionalParts||[]) assert(byId.has(dep),`${p.id} optional part missing ${dep}`);
}
assert(!d.accessories.some(p=>p.visual?.status==='approved'),'WF2 must not promote customer visuals');
console.log(JSON.stringify({schemaVersion:d.schemaVersion,accessories:d.accessories.length,evidenceRows:ev.sources.length,newRecords:[slim.id,dbl.id],legacyDeflectorCandidate:{sku:deflector.candidateSkuObserved,state:deflector.candidateState},lightbarSupportState:mapped.state,duplicateIds:0,duplicateSkus:0,status:'pass'},null,2));
