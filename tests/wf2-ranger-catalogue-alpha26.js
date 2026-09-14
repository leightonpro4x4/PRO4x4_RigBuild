const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const root=path.resolve(__dirname,'..');
const ctx={window:{}};vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.join(root,'data-ranger.js'),'utf8'),ctx);
const d=ctx.window.RANGER_DATA;const ev=require(path.join(root,'ranger-source-evidence.js'));
assert.equal(d.schemaVersion,'0.26.22');assert.equal(ev.schemaVersion,'0.26.22');assert.equal(d.accessories.length,73);
const ids=d.accessories.map(x=>x.id),skus=d.accessories.map(x=>x.sku).filter(Boolean);
assert.equal(new Set(ids).size,ids.length,'Ranger accessory ids must be unique');
assert.equal(new Set(skus).size,skus.length,'Ranger accessory SKUs must be unique');
const byId=new Map(d.accessories.map(x=>[x.id,x]));
for(const p of d.accessories){
  for(const dep of [...(p.requires||[]),...(p.fitment?.requiredParts||[]),...(p.fitment?.anyOfRequiredParts||[])]) assert(byId.has(dep),`${p.id} references missing dependency ${dep}`);
  assert(!['approved'].includes(p.visual?.status),`${p.id} must not gain an approved customer visual in WF2`);
}
const expected={
 'oa-brush-rails-ranger':['SR-FRA-NG-22-ASM0',790,12],
 'oa-egr-flare-endcaps-ranger':['FLEC-FRA-NG-22-ASM0',150,1],
 'oa-toro-indicator-harness-ranger':['LM-FRA-NG-IND',80,null],
 'oa-predator-stealth-top-ranger':['TB-COM-PR-ASM0',235,4],
 'oa-predator-round-top-ranger':['TB-COM-PR-RD-ASM0',365,3],
 'oa-tray-slide-wide-ranger':['TRS-DC-COM-WIDE-ASM0',2780,51]
};
for(const [id,[sku,price,weight]] of Object.entries(expected)){
 const p=byId.get(id);assert(p,id);assert.equal(p.sku,sku);assert.equal(p.price,price);assert.equal(p.weightKg,weight);assert(/^manufacturer/.test(p.fitment?.source||''));assert(/^https:\/\/offroadanimal\.com\.au\//.test(p.sourceUrl));
 const e=ev.sources.find(x=>x.id===id);assert(e,`missing source evidence for ${id}`);assert.equal(e.sku,sku);if(id==='oa-toro-indicator-harness-ranger'){assert.equal(e.rrpAud,null);assert.equal(e.currentManufacturerPriceAud,price);}else assert.equal(e.rrpAud,price);
}
const brush=byId.get('oa-brush-rails-ranger');assert.deepEqual([...brush.requires].sort(),['oa-rock-sliders-ranger','oa-toro-ranger']);assert.equal(brush.installTimeHours.min,2);assert.equal(brush.installTimeHours.max,3);
const caps=byId.get('oa-egr-flare-endcaps-ranger');assert.equal(caps.fitment.reviewRequired,true);assert.deepEqual([...caps.fitment.anyOfRequiredParts].sort(),['oa-predator','oa-toro-ranger']);assert(caps.fitment.requiredExternalParts.includes('EGR branded flares'));assert.equal(caps.visual.status,'staff-review');
const harness=byId.get('oa-toro-indicator-harness-ranger');assert.deepEqual(harness.requires,[]);assert.deepEqual([...harness.fitment.anyOfRequiredParts].sort(),['oa-predator','oa-toro-ranger']);assert.equal(harness.installTimeHours,null);assert.equal(harness.weightKg,null);assert.equal(harness.weightNormalization.storefrontListedWeightKg,1);
for(const id of ['oa-predator-stealth-top-ranger','oa-predator-round-top-ranger']){const p=byId.get(id);assert.deepEqual(p.requires,['oa-predator']);assert.equal(p.group,'predator-top-hoop');}
const tray=byId.get('oa-tray-slide-wide-ranger');assert.equal(tray.installTimeHours.min,1);assert.equal(tray.assemblyTimeHours.min,2);assert.equal(tray.visual.visualisable,false);
assert.equal(byId.get('oa-predator').weightKg,65);assert.deepEqual(byId.get('oa-predator').installTimeHours,{min:5,max:6,source:'manufacturer'});
assert.equal(byId.get('oa-toro-ranger').weightKg,76);assert.deepEqual(byId.get('oa-toro-ranger').installTimeHours,{min:5,max:6,source:'manufacturer'});
assert.equal(byId.get('oa-rear-protection-ranger').weightKg,36);assert.equal(byId.get('oa-rear-protection-ranger').fitment.reviewRequired,true);
assert.equal(byId.get('oa-rock-sliders-ranger').weightKg,60);assert.equal(byId.get('oa-rock-sliders-ranger').installTimeHours.min,3);
console.log(JSON.stringify({schemaVersion:d.schemaVersion,accessories:d.accessories.length,previousManufacturerBackedSlice:6,evidenceRows:ev.sources.length,duplicateIds:0,duplicateSkus:0,unknownInstallPreserved:['oa-toro-indicator-harness-ranger'],staffReviewPreserved:['oa-egr-flare-endcaps-ranger','oa-rear-protection-ranger'],status:'pass'},null,2));
