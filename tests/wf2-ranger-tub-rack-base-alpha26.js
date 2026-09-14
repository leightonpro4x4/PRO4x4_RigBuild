const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const root=path.resolve(__dirname,'..');
const ctx={window:{}};vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.join(root,'data-ranger.js'),'utf8'),ctx);
const d=ctx.window.RANGER_DATA;const ev=require(path.join(root,'ranger-source-evidence.js'));
assert.equal(d.schemaVersion,'0.26.22');assert.equal(ev.schemaVersion,'0.26.22');assert.equal(d.accessories.length,73);assert.equal(ev.sources.length,54);
const byId=new Map(d.accessories.map(x=>[x.id,x]));

const base=byId.get('oa-tub-rack-base-ranger');
assert(base,'missing governed Tub Rack Base');assert.equal(base.sku,'TR-DC-COM-BASE');assert.equal(base.price,1150);assert.equal(base.weightKg,30);assert.equal(base.install,null);assert.equal(base.status,'engineering');
assert.equal(base.fitment.reviewRequired,true);assert(base.fitment.excludedTrims.includes('Wildtrak'));assert(base.fitment.excludedConfigurations.includes('Next-Gen Ranger with EGR roller shutter'));
assert.deepEqual(JSON.parse(JSON.stringify(base.installTimeHours)),{min:1,max:2,source:'manufacturer'});assert.equal(base.visual.status,'staff-review');assert.notEqual(base.visual.status,'approved');
const bare=base.fitment.mountingRoutes.find(x=>x.route==='bare-tub-drill');const std=base.fitment.mountingRoutes.find(x=>x.route==='roller-shutter-standard-t-slot');const angle=base.fitment.mountingRoutes.find(x=>x.route==='roller-shutter-angled-mountaintop');
assert(bare&&std&&angle,'missing governed mounting routes');assert.equal(bare.state,'staff-review');assert(std.requiredParts.includes('oa-tub-rack-roller-rail-kit-ranger'));assert(angle.requiredParts.includes('oa-tub-rack-angled-roller-rail-kit-ranger'));

const standard=byId.get('oa-tub-rack-roller-rail-kit-ranger');
assert(standard);assert.equal(standard.sku,'TR-FRA-PX-11-RSFK');assert.equal(standard.price,470);assert.equal(standard.weightKg,5);assert.equal(standard.status,'engineering');assert.equal(standard.fitment.reviewRequired,true);assert(standard.requires.includes(base.id));assert.equal(standard.installTimeHours,null);assert.equal(standard.visual.visualisable,false);
const angled=byId.get('oa-tub-rack-angled-roller-rail-kit-ranger');
assert(angled);assert.equal(angled.sku,'TR-FRA-PX-11-RSANFK');assert.equal(angled.price,470);assert.equal(angled.weightKg,5);assert.equal(angled.status,'engineering');assert.equal(angled.fitment.reviewRequired,true);assert(angled.requires.includes(base.id));assert(angled.fitment.excludedTrims.includes('Wildtrak'));assert.equal(angled.installTimeHours,null);assert.equal(angled.visual.visualisable,false);

for(const p of [base,standard,angled]){
  const e=ev.sources.find(s=>s.id===p.id);assert(e,`missing evidence for ${p.id}`);assert.equal(e.sku,p.sku);assert.equal(e.rrpAud,p.price);assert.equal(e.weightKg,p.weightKg);assert(/offroadanimal\.com\.au/.test(e.url));
}
const baseEvidence=ev.sources.find(s=>s.id===base.id);assert.equal(baseEvidence.saleAudObserved,1050);assert(/categoryUrl/.test(JSON.stringify(baseEvidence)));assert(baseEvidence.staffReviewReasons.some(x=>/Wildtrak/.test(x)));

// Global identity/dependency integrity and conservative visual-state guard.
const ids=d.accessories.map(x=>x.id),skus=d.accessories.map(x=>x.sku).filter(Boolean);assert.equal(new Set(ids).size,ids.length);assert.equal(new Set(skus).size,skus.length);
for(const p of d.accessories){
  for(const dep of [...(p.requires||[]),...(p.fitment?.requiredParts||[]),...(p.fitment?.anyOfRequiredParts||[])]) assert(byId.has(dep),`${p.id} missing dependency ${dep}`);
  for(const route of p.fitment?.mountingRoutes||[]) for(const dep of route.requiredParts||[]) assert(byId.has(dep),`${p.id} route ${route.route} missing dependency ${dep}`);
  for(const c of p.fitment?.supportCandidates||[]) assert(byId.has(c.partId),`${p.id} support candidate missing ${c.partId}`);
  for(const c of p.fitment?.alternativeGovernedParts||[]) assert(byId.has(c.partId),`${p.id} alternate part missing ${c.partId}`);
}
assert(![base,standard,angled].some(p=>p.visual?.status==='approved'));
console.log(JSON.stringify({schemaVersion:d.schemaVersion,accessories:d.accessories.length,evidenceRows:ev.sources.length,newRecords:[base.id,standard.id,angled.id],baseRrpAud:base.price,baseSaleIgnoredAud:baseEvidence.saleAudObserved,wildtrakExcluded:true,egrShutterBlocked:true,exactRaFitmentInferred:false,duplicateIds:0,duplicateSkus:0,status:'pass'},null,2));
