const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const root=path.resolve(__dirname,'..');
const ctx={window:{}};vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.join(root,'data-ranger.js'),'utf8'),ctx);
const d=ctx.window.RANGER_DATA;const ev=require(path.join(root,'ranger-source-evidence.js'));
assert.equal(d.schemaVersion,'0.26.22');assert.equal(ev.schemaVersion,'0.26.22');assert.equal(d.accessories.length,73);
const byId=new Map(d.accessories.map(x=>[x.id,x]));
const expected={
 'oa-scout-tub-platform-ranger':['SP-COM-FT-MD-ASM0',1175],
 'oa-scout-tub-platform-short-ranger':['SP-COM-FT-500-ASM0',650],
 'oa-goat-rack-ranger':['GR-MED-COM-ASM0',4725],
 'egr-j-brace-ranger':['040174',249]
};
for(const [id,[sku,price]] of Object.entries(expected)){
 const p=byId.get(id);assert(p,`missing ${id}`);assert.equal(p.sku,sku);assert.equal(p.price,price);assert.equal(p.install,null);assert.equal(p.fitment?.source,'manufacturer');
 const e=ev.sources.find(x=>x.id===id);assert(e,`missing source evidence ${id}`);assert.equal(e.sku,sku);assert.equal(e.rrpAud,price);
 assert.notEqual(p.visual?.status,'approved',`${id} must not acquire an approved customer visual in WF2`);
}
for(const id of ['oa-scout-tub-platform-ranger','oa-scout-tub-platform-short-ranger']){
 const p=byId.get(id);assert.equal(p.status,'engineering');assert.equal(p.fitment.reviewRequired,true);assert.equal(p.visual.status,'staff-review');
 assert.equal(p.installTimeHours.min,2);assert.equal(p.installTimeHours.max,3);assert.equal(p.weightKg,null);assert(p.weightVariantsKg.lowLeg<p.weightVariantsKg.highLeg);
 assert(p.fitment.requiredExternalParts.some(x=>/brace|J-brace/i.test(x)));assert(p.fitment.conditions.some(x=>/1545/.test(x)));
}
const goat=byId.get('oa-goat-rack-ranger');assert.equal(goat.status,'engineering');assert.equal(goat.weightKg,50);assert.deepEqual(goat.installTimeHours,{min:3,max:4,source:'manufacturer'});assert(goat.fitment.conditions.some(x=>/RGr roller shutter/i.test(x)));
const jb=byId.get('egr-j-brace-ranger');assert.equal(jb.status,'confirmed');assert.equal(jb.fitment.reviewRequired,true);assert.equal(jb.visual.visualisable,false);assert.equal(jb.weightKg,null);
// Do not infer that a separately verified EGR J-brace automatically satisfies Offroad Animal's rack requirement.
for(const id of ['oa-scout-tub-platform-ranger','oa-scout-tub-platform-short-ranger']) assert(!byId.get(id).requires.includes('egr-j-brace-ranger'));
const adv=byId.get('oa-adventure-rack-ranger');assert(adv.fitment.conditions.some(x=>/Mountain Top roller shutters/i.test(x)),'known Adventure Rack Ranger roller-shutter exclusion must be preserved');
// Current manufacturer data conflicts on The Nice Rack price ($1,750 product page vs $1,300 category pages); preserve the product identity but do not normalise a price.
const nice=byId.get('oa-nice-tub-rack-ranger');assert(nice);assert.equal(nice.price,null);assert.equal(nice.priceState,'source-conflict');assert.equal(nice.status,'engineering');assert.equal(nice.fitment.reviewRequired,true);
const ids=d.accessories.map(x=>x.id),skus=d.accessories.map(x=>x.sku).filter(Boolean);assert.equal(new Set(ids).size,ids.length);assert.equal(new Set(skus).size,skus.length);
for(const p of d.accessories){for(const dep of [...(p.requires||[]),...(p.fitment?.requiredParts||[]),...(p.fitment?.anyOfRequiredParts||[])])assert(byId.has(dep),`${p.id} missing dependency ${dep}`);}
console.log(JSON.stringify({schemaVersion:d.schemaVersion,accessories:d.accessories.length,newRecords:Object.keys(expected).length,evidenceRows:ev.sources.length,staffReview:['oa-scout-tub-platform-ranger','oa-scout-tub-platform-short-ranger','oa-goat-rack-ranger','egr-j-brace-ranger'],sourceConflictPreserved:['TR-NR-COM-ASM1'],status:'pass'},null,2));
