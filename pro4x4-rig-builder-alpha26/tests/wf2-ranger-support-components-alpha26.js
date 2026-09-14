const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const root=path.resolve(__dirname,'..');
const ctx={window:{}};vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.join(root,'data-ranger.js'),'utf8'),ctx);
const d=ctx.window.RANGER_DATA;const ev=require(path.join(root,'ranger-source-evidence.js'));
assert.equal(d.schemaVersion,'0.26.6');assert.equal(ev.schemaVersion,'0.26.6');assert.equal(d.accessories.length,39);
const byId=new Map(d.accessories.map(x=>[x.id,x]));
const skus=new Set(d.accessories.map(x=>x.sku).filter(Boolean));
const expected={
  'oa-rally-hoop-stedi-pro-ranger':['TB-COM-RAL-STE-2XPRO-ASM0',330,4],
  'oa-rally-hoop-9in-ranger':['TB-COM-RAL-ORA-2X9-ASM0',330,4],
  'oa-rally-hoop-7in-ranger':['TB-COM-RAL-ORA-2X7-ASM0',315,8],
  'oa-22in-slim-lightbar-ranger':['ORA-ALO-S5D1-20',200,2],
  'oa-deep-dish-floor-mats-ranger':['FM-FRA-NG-22',250,5]
};
for(const [id,[sku,price,weight]] of Object.entries(expected)){
  const p=byId.get(id);assert(p,`missing ${id}`);assert.equal(p.sku,sku);assert.equal(p.price,price);assert.equal(p.weightKg,weight);assert.equal(p.status,'confirmed');assert.equal(p.install,null);assert.equal(p.fitment?.source,'manufacturer');assert(/^https:\/\/offroadanimal\.com\.au\//.test(p.sourceUrl));
  const e=ev.sources.find(x=>x.id===id);assert(e,`missing source evidence ${id}`);assert.equal(e.sku,sku);assert.equal(e.rrpAud,price);assert.equal(e.weightKg,weight);
  assert.notEqual(p.visual?.status,'approved',`${id} must not acquire approved visual state in WF2`);
}
for(const id of ['oa-rally-hoop-stedi-pro-ranger','oa-rally-hoop-9in-ranger','oa-rally-hoop-7in-ranger']){
  const p=byId.get(id);assert.equal(p.group,'predator-top-hoop');
  assert.deepEqual([...p.requires].sort(),['oa-camera-relocation-ranger','oa-predator']);
  assert.deepEqual([...p.fitment.requiredParts].sort(),['oa-camera-relocation-ranger','oa-predator']);
  assert.equal(p.fitment.reviewRequired,false);assert.equal(p.installTimeHours,null);assert.equal(p.installDifficulty10,null);
}
assert(byId.get('oa-rally-hoop-stedi-pro-ranger').fitment.conditions.some(x=>/very close/i.test(x)));
const light=byId.get('oa-22in-slim-lightbar-ranger');
assert.deepEqual([...light.fitment.anyOfRequiredParts].sort(),['oa-predator','oa-toro-ranger']);assert.equal(light.installTimeHours,null);assert.equal(light.visual.layerId,'front-lighting');
const mats=byId.get('oa-deep-dish-floor-mats-ranger');
assert.equal(mats.visual.visualisable,false);assert.deepEqual(mats.visual.supportedViews,[]);assert.equal(mats.installTimeHours,null);assert.equal(mats.fitment.reviewRequired,false);
// Manufacturer category placement alone is not enough. The current Type X EVO product-page fitment table omits Ranger RA 2022-on, so this SKU must stay out of the confirmed governed slice.
assert(!skus.has('TB-COM-RAL-STE-2XEVO-ASM0'),'Type X EVO 8.5 hoop must not be inferred as confirmed Next Gen Ranger fitment');
const ids=d.accessories.map(x=>x.id), allSkus=d.accessories.map(x=>x.sku).filter(Boolean);
assert.equal(new Set(ids).size,ids.length);assert.equal(new Set(allSkus).size,allSkus.length);
for(const p of d.accessories){for(const dep of [...(p.requires||[]),...(p.fitment?.requiredParts||[]),...(p.fitment?.anyOfRequiredParts||[])])assert(byId.has(dep),`${p.id} missing dependency ${dep}`);}
console.log(JSON.stringify({schemaVersion:d.schemaVersion,accessories:d.accessories.length,newConfirmedRecords:Object.keys(expected).length,evidenceRows:ev.sources.length,deferredForMissingExactFitment:['TB-COM-RAL-STE-2XEVO-ASM0'],unknownInstallPreserved:['oa-rally-hoop-stedi-pro-ranger','oa-rally-hoop-9in-ranger','oa-rally-hoop-7in-ranger','oa-22in-slim-lightbar-ranger','oa-deep-dish-floor-mats-ranger'],status:'pass'},null,2));
