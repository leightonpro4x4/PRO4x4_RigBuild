const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const root=path.resolve(__dirname,'..');
const ctx={window:{}};vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.join(root,'data-ranger.js'),'utf8'),ctx);
const d=ctx.window.RANGER_DATA;const ev=require(path.join(root,'ranger-source-evidence.js'));
assert.equal(d.schemaVersion,'0.26.22');assert.equal(ev.schemaVersion,'0.26.22');assert.equal(d.accessories.length,73);assert.equal(ev.sources.length,54);
const byId=new Map(d.accessories.map(x=>[x.id,x]));

const rack=byId.get('oa-scout-rack-ranger');
assert(rack);assert.equal(rack.sku,'RR-FRA-PU-22-SCT-ASM0');assert.equal(rack.price,1520);assert.equal(rack.weightKg,15);assert.equal(rack.storefrontListedWeightKg,16);assert.equal(rack.install,null);assert.equal(rack.status,'confirmed');
assert.deepEqual(JSON.parse(JSON.stringify(rack.installTimeHours)),{min:4,max:4,source:'manufacturer'});assert.equal(rack.installDifficulty10,5);
assert.equal(rack.dimensionsMm.width,1210);assert.equal(rack.dimensionsMm.length,1230);assert.equal(rack.dimensionsMm.heightAboveRoof,90);
assert.equal(rack.loadRatingsKg.dynamicOnRoad,95);assert.equal(rack.loadRatingsKg.dynamicOffRoad,63);assert.equal(rack.loadRatingsKg.static,190);
assert.equal(rack.fitment.reviewRequired,false);assert(/dual-cab Ford Ranger/i.test(rack.fitment.vehicleRange));assert.equal(rack.visual.status,'priced-only');assert.notEqual(rack.visual.status,'approved');
const unresolved=rack.fitment.unresolvedAccessoryMappings||[];assert(unresolved.some(x=>x.option==='light-bar-wind-deflector'&&x.state==='engineering'));assert(unresolved.some(x=>x.option==='42-inch-light-bar-support-route'&&x.state==='engineering'));assert(rack.fitment.optionalParts.includes('oa-slim-42-lightbar-scout-ranger'));assert(rack.fitment.optionalParts.includes('oa-double-42-lightbar-scout-ranger'));

const eye=byId.get('oa-roof-rack-eye-bolt-kit-ranger');
assert(eye);assert.equal(eye.sku,'RR-EBK-4-ASM0');assert.equal(eye.price,25);assert.equal(eye.weightKg,null);assert.equal(eye.storefrontListedWeightKg,0.5);assert.equal(eye.installTimeHours,null);assert.equal(eye.status,'confirmed');assert.equal(eye.fitment.reviewRequired,false);assert(eye.requires.includes(rack.id));assert.equal(eye.visual.visualisable,false);assert.equal(eye.visual.status,'priced-only');

const clamp=byId.get('clampit-quick-fist-scout-ranger');
assert(clamp);assert.equal(clamp.sku,'JED 25-57');assert.equal(clamp.price,25);assert.equal(clamp.weightKg,null);assert.equal(clamp.storefrontListedWeightKg,0.25);assert.equal(clamp.status,'confirmed');assert.equal(clamp.fitment.reviewRequired,false);assert(clamp.requires.includes(rack.id));assert.equal(clamp.visual.visualisable,false);

const awning=byId.get('oa-awning-mount-scout-ranger');
assert(awning);assert.equal(awning.sku,'RR-AM-COM-ASM0');assert.equal(awning.price,85);assert.equal(awning.weightKg,null);assert.equal(awning.storefrontListedWeightKg,0.7);assert.equal(awning.status,'engineering');assert.equal(awning.fitment.reviewRequired,true);assert(awning.requires.includes(rack.id));assert(awning.fitment.conditions.some(x=>/90-degree/.test(x)));assert(awning.fitment.conditions.some(x=>/drilling/.test(x)));assert.equal(awning.visual.status,'staff-review');
assert(awning.fitment.alternativeGovernedParts.some(x=>x.partId==='oa-awning-quick-connect-scout-ranger'));

const quick=byId.get('oa-awning-quick-connect-scout-ranger');
assert(quick);assert.equal(quick.sku,'RR-AMQ-MED-ASM0');assert.equal(quick.price,295);assert.equal(quick.weightKg,null);assert.equal(quick.storefrontListedWeightKg,4);assert.equal(quick.status,'engineering');assert.equal(quick.fitment.reviewRequired,true);assert(quick.requires.includes(rack.id));assert.deepEqual(JSON.parse(JSON.stringify(quick.installTimeHours)),{min:0.5,max:1,source:'manufacturer'});assert.equal(quick.installDifficulty10,2);assert.equal(quick.visual.status,'staff-review');

for(const p of [rack,eye,clamp,awning,quick]){
  const e=ev.sources.find(s=>s.id===p.id);assert(e,`missing evidence for ${p.id}`);assert.equal(e.sku,p.sku);assert.equal(e.rrpAud,p.price);
}
assert.equal(ev.sources.find(x=>x.id===rack.id).weightKg,15);assert.equal(ev.sources.find(x=>x.id===rack.id).storefrontListedWeightKg,16);assert.equal(ev.sources.find(x=>x.id===rack.id).installTimeHours.min,4);
assert(ev.sources.find(x=>x.id===awning.id).staffReviewReasons.length>=2);assert(ev.sources.find(x=>x.id===quick.id).staffReviewReasons.length>=1);

// Global identity/dependency integrity and conservative visual-governance guard.
const ids=d.accessories.map(x=>x.id),skus=d.accessories.map(x=>x.sku).filter(Boolean);assert.equal(new Set(ids).size,ids.length);assert.equal(new Set(skus).size,skus.length);
for(const p of d.accessories){
  for(const dep of [...(p.requires||[]),...(p.fitment?.requiredParts||[]),...(p.fitment?.anyOfRequiredParts||[])]) assert(byId.has(dep),`${p.id} missing dependency ${dep}`);
  for(const route of p.fitment?.mountingRoutes||[]) for(const dep of route.requiredParts||[]) assert(byId.has(dep),`${p.id} route ${route.route} missing dependency ${dep}`);
  for(const c of p.fitment?.supportCandidates||[]) assert(byId.has(c.partId),`${p.id} support candidate missing ${c.partId}`);
  for(const c of p.fitment?.alternativeGovernedParts||[]) assert(byId.has(c.partId),`${p.id} alternate part missing ${c.partId}`);
  for(const dep of p.fitment?.optionalParts||[]) assert(byId.has(dep),`${p.id} optional part missing ${dep}`);
}
assert(![rack,eye,clamp,awning,quick].some(p=>p.visual?.status==='approved'));
console.log(JSON.stringify({schemaVersion:d.schemaVersion,accessories:d.accessories.length,evidenceRows:ev.sources.length,normalizedRack:{sku:rack.sku,rrpAud:rack.price,weightKg:rack.weightKg,installHours:rack.installTimeHours.min},newRecords:[eye.id,clamp.id,awning.id,quick.id],confirmedDirectOptions:[eye.id,clamp.id],staffReviewOptions:[awning.id,quick.id],unresolvedMappings:unresolved.map(x=>x.option),duplicateIds:0,duplicateSkus:0,status:'pass'},null,2));
