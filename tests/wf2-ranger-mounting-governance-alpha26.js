const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const root=path.resolve(__dirname,'..');
const ctx={window:{}};vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.join(root,'data-ranger.js'),'utf8'),ctx);
const d=ctx.window.RANGER_DATA;const ev=require(path.join(root,'ranger-source-evidence.js'));
assert.equal(d.schemaVersion,'0.26.22');assert.equal(ev.schemaVersion,'0.26.22');assert.equal(d.accessories.length,73);assert.equal(ev.sources.length,54);
const byId=new Map(d.accessories.map(x=>[x.id,x]));

// A.U.S.B. remains exact Next-Gen Ranger only via roller-shutter T-slot mounting; bare-tub clamp is blocked.
const ausb=byId.get('oa-ausb-sports-bar-ranger');assert(ausb);assert.equal(ausb.status,'confirmed');
const routes=Object.fromEntries(ausb.fitment.mountingRoutes.map(x=>[x.route,x]));
assert.equal(routes['roller-shutter-flat-t-slot'].state,'confirmed');
assert.equal(routes['roller-shutter-angled-t-slot'].state,'conditional');
assert.deepEqual(routes['roller-shutter-angled-t-slot'].requiredParts,['oa-ausb-angled-roller-mount-ranger']);
assert.equal(routes['bare-tub-clamp'].state,'blocked');assert.equal(routes['bare-tub-clamp'].excludedPartSku,'SB-COM-TC-KIT');

const angled=byId.get('oa-ausb-angled-roller-mount-ranger');assert(angled);assert.equal(angled.sku,'SB-COM-RSAN-KIT');assert.equal(angled.price,175);assert.equal(angled.weightKg,5);assert.equal(angled.status,'engineering');assert.equal(angled.fitment.reviewRequired,true);assert.deepEqual(angled.requires,['oa-ausb-sports-bar-ranger']);assert.equal(angled.visual.visualisable,false);assert.notEqual(angled.visual.status,'approved');

// Scout routes are now explicit while the cross-vendor brace identity deliberately remains unresolved.
for(const id of ['oa-scout-tub-platform-ranger','oa-scout-tub-platform-short-ranger']){
 const p=byId.get(id);assert(p);assert.equal(p.fitment.reviewRequired,true);assert(p.fitment.mountingRoutes.some(x=>x.route==='roller-shutter-t-slot'&&x.state==='conditional'));assert(p.fitment.mountingRoutes.some(x=>x.route==='bare-tub-top'&&x.state==='conditional'));assert(!p.requires.includes('egr-j-brace-ranger'));
}

// EGR support component is exact RA 2022-on, but exclusions are explicit and product weight is not fabricated from package weight.
const jb=byId.get('egr-j-brace-ranger');assert(jb);assert.equal(jb.price,249);assert.equal(jb.packageWeightKg,3);assert.equal(jb.weightKg,null);assert.deepEqual(jb.fitment.excludedTrims,['Wildtrak','Platinum']);assert.equal(jb.fitment.reviewRequired,true);

// The Nice Rack product identity is admitted without guessing the RRP or exact Ranger mounting route.
const nice=byId.get('oa-nice-tub-rack-ranger');assert(nice);assert.equal(nice.sku,'TR-NR-COM-ASM1');assert.equal(nice.price,null);assert.equal(nice.priceState,'source-conflict');assert.deepEqual(nice.rrpCandidatesAud.map(x=>x.amount).sort((a,b)=>a-b),[1300,1750]);assert.equal(nice.weightKg,23);assert.equal(nice.status,'engineering');assert.equal(nice.fitment.reviewRequired,true);assert.equal(nice.visual.status,'staff-review');
const ne=ev.sources.find(x=>x.id==='oa-nice-tub-rack-ranger');assert(ne);assert.equal(ne.rrpAud,null);assert.equal(ne.rrpState,'source-conflict');assert.deepEqual([...ne.rrpCandidatesAud].sort((a,b)=>a-b),[1300,1750]);

// All governed dependencies and conditional mounting-route product references resolve; no duplicate identity/SKU and no new approved visual.
const ids=d.accessories.map(x=>x.id),skus=d.accessories.map(x=>x.sku).filter(Boolean);assert.equal(new Set(ids).size,ids.length);assert.equal(new Set(skus).size,skus.length);
for(const p of d.accessories){
 for(const dep of [...(p.requires||[]),...(p.fitment?.requiredParts||[]),...(p.fitment?.anyOfRequiredParts||[])]) assert(byId.has(dep),`${p.id} missing dependency ${dep}`);
 for(const route of p.fitment?.mountingRoutes||[]) for(const dep of route.requiredParts||[]) assert(byId.has(dep),`${p.id} route ${route.route} missing dependency ${dep}`);
}
for(const id of ['oa-ausb-angled-roller-mount-ranger','oa-nice-tub-rack-ranger']) assert.notEqual(byId.get(id).visual?.status,'approved');
console.log(JSON.stringify({schemaVersion:d.schemaVersion,accessories:d.accessories.length,evidenceRows:ev.sources.length,newRecords:['oa-ausb-angled-roller-mount-ranger','oa-nice-tub-rack-ranger'],tightened:['oa-ausb-sports-bar-ranger','oa-scout-tub-platform-ranger','oa-scout-tub-platform-short-ranger','egr-j-brace-ranger'],priceConflictPreserved:'TR-NR-COM-ASM1',status:'pass'},null,2));
