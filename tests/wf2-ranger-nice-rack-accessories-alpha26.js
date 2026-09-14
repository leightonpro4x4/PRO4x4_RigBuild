const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const root=path.resolve(__dirname,'..');
const ctx={window:{}};vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.join(root,'data-ranger.js'),'utf8'),ctx);
const d=ctx.window.RANGER_DATA;const ev=require(path.join(root,'ranger-source-evidence.js'));
assert.equal(d.schemaVersion,'0.26.22');assert.equal(ev.schemaVersion,'0.26.22');assert.equal(d.accessories.length,73);assert.equal(ev.sources.length,54);
const byId=new Map(d.accessories.map(x=>[x.id,x]));

const expected={
 'oa-nice-rack-toolbox-50l-ranger':{sku:'TR-NR-COM-ASM2',price:765,weightKg:13,capacityLitres:50,dimensionsMm:{length:630,width:300,height:480}},
 'oa-nice-rack-toolbox-92l-ranger':{sku:'TR-NR-COM-ASM5',price:965,weightKg:19,capacityLitres:92,dimensionsMm:{length:1100,width:300,height:480}},
 'oa-nice-rack-molle-low-ranger':{sku:'TR-NR-COM-ASM3',price:162,weightKg:4,requiredRackSetting:'low',dimensionsMm:{width:500,height:350}},
 'oa-nice-rack-molle-high-ranger':{sku:'TR-NR-COM-ASM4',price:240,weightKg:5,requiredRackSetting:'high',dimensionsMm:{width:500,height:525}}
};
for(const [id,x] of Object.entries(expected)){
 const p=byId.get(id);assert(p,`missing ${id}`);assert.equal(p.sku,x.sku);assert.equal(p.price,x.price);assert.equal(p.weightKg,x.weightKg);assert.equal(p.install,null);assert.equal(p.installTimeHours,null);assert.equal(p.status,'engineering');assert.equal(p.fitment.reviewRequired,true);assert.deepEqual(p.requires,['oa-nice-tub-rack-ranger']);assert.notEqual(p.visual.status,'approved');assert.equal(p.visual.fitmentConfidence,'conditional');
 if(x.capacityLitres) assert.equal(p.capacityLitres,x.capacityLitres);
 if(x.requiredRackSetting) assert.equal(p.fitment.requiredRackSetting,x.requiredRackSetting);
 for(const [k,v] of Object.entries(x.dimensionsMm)) assert.equal(p.dimensionsMm[k],v);
 const e=ev.sources.find(s=>s.id===id);assert(e,`missing evidence ${id}`);assert.equal(e.sku,x.sku);assert.equal(e.rrpAud,x.price);assert.equal(e.weightKg,x.weightKg);assert.equal(e.installTimeHours,null);
}

// Parent Nice Rack remains unresolved; child accessory certainty must not launder parent vehicle fitment or price state.
const nice=byId.get('oa-nice-tub-rack-ranger');assert(nice);assert.equal(nice.price,null);assert.equal(nice.priceState,'source-conflict');assert.equal(nice.status,'engineering');assert.equal(nice.fitment.reviewRequired,true);assert.deepEqual(nice.rrpCandidatesAud.map(x=>x.amount).sort((a,b)=>a-b),[1300,1750]);

// Identity/dependency integrity and visual governance remain strict.
const ids=d.accessories.map(x=>x.id),skus=d.accessories.map(x=>x.sku).filter(Boolean);assert.equal(new Set(ids).size,ids.length);assert.equal(new Set(skus).size,skus.length);
for(const p of d.accessories){for(const dep of [...(p.requires||[]),...(p.fitment?.requiredParts||[]),...(p.fitment?.anyOfRequiredParts||[])]) assert(byId.has(dep),`${p.id} missing dependency ${dep}`);for(const route of p.fitment?.mountingRoutes||[]) for(const dep of route.requiredParts||[]) assert(byId.has(dep),`${p.id} route ${route.route} missing dependency ${dep}`);}
for(const id of Object.keys(expected)) assert.notEqual(byId.get(id).visual?.status,'approved');
console.log(JSON.stringify({schemaVersion:d.schemaVersion,accessories:d.accessories.length,evidenceRows:ev.sources.length,newRecords:Object.keys(expected),parentFitmentStillEngineering:'oa-nice-tub-rack-ranger',unknownInstallPreserved:Object.keys(expected),duplicateIds:0,duplicateSkus:0,status:'pass'},null,2));
