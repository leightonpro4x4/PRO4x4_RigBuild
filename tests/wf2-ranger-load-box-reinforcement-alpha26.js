const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const root=path.resolve(__dirname,'..');
const ctx={window:{}};vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.join(root,'data-ranger.js'),'utf8'),ctx);
const d=ctx.window.RANGER_DATA;const ev=require(path.join(root,'ranger-source-evidence.js'));
assert.equal(d.schemaVersion,'0.26.22');assert.equal(ev.schemaVersion,'0.26.22');assert.equal(d.accessories.length,73);assert.equal(ev.sources.length,54);
const byId=new Map(d.accessories.map(x=>[x.id,x]));

const ford=byId.get('ford-load-box-reinforcement-ranger');
assert(ford,'missing governed Ford load-box reinforcement kit');
assert.equal(ford.brand,'Ford');assert.equal(ford.sku,'VN1WZ2627726A');assert.equal(ford.price,336.12);assert.equal(ford.priceState,'secondary-source-rrp');
assert.equal(ford.weightKg,null);assert.equal(ford.install,null);assert.equal(ford.installTimeHours,null);assert.equal(ford.status,'engineering');
assert.equal(ford.fitment.reviewRequired,true);assert(ford.fitment.excludedTrims.includes('Raptor'));assert(ford.fitment.directlyListedTrims.includes('Wildtrak'));assert(ford.fitment.vinConfirmationTrims.includes('Platinum'));
assert.equal(ford.fitment.aftermarketSuitability,'staff-review');assert.equal(ford.visual.visualisable,false);assert.notEqual(ford.visual.status,'approved');
const fe=ev.sources.find(s=>s.id===ford.id);assert(fe,'missing Ford reinforcement source evidence');assert.equal(fe.sku,ford.sku);assert.equal(fe.rrpAud,ford.price);assert.equal(fe.weightKg,null);assert.equal(fe.installTimeHours,null);
assert(/ford\.com\//.test(fe.url));assert(/australianonlinecarparts\.com\.au/.test(fe.rrpUrl));assert(/jeffersonfordparts\.com\.au/.test(fe.trimConfirmationUrl));

// Offroad Animal Scout brace requirement remains staff-review: the Ford part is a candidate only, never auto-satisfying the cross-vendor requirement.
for(const id of ['oa-scout-tub-platform-ranger','oa-scout-tub-platform-short-ranger']){
  const p=byId.get(id);assert(p,`missing ${id}`);assert.equal(p.status,'engineering');assert.equal(p.fitment.reviewRequired,true);
  assert(p.fitment.supportCandidates.some(x=>x.partId===ford.id&&x.state==='staff-review'));
  assert(!(p.fitment.requiredParts||[]).includes(ford.id),'Ford kit must not auto-satisfy OA brace requirement');
  const bare=(p.fitment.mountingRoutes||[]).find(x=>x.route==='bare-tub-top');assert(bare);assert(bare.supportCandidates.some(x=>x.partId===ford.id&&x.state==='staff-review'));
}

// EGR exclusion remains intact; Ford kit is a separate governed option rather than a silently equivalent substitute.
const egr=byId.get('egr-j-brace-ranger');assert(egr);assert(egr.fitment.excludedTrims.includes('Wildtrak'));assert(egr.fitment.excludedTrims.includes('Platinum'));
assert(egr.fitment.alternativeGovernedParts.some(x=>x.partId===ford.id&&x.state==='separate-option'));

// GOAT is 50 kg, so Ford's >40 kg elevated-accessory threshold triggers review, but the kit is not auto-added.
const goat=byId.get('oa-goat-rack-ranger');assert(goat);assert.equal(goat.weightKg,50);assert.equal(goat.fitment.reinforcementReview.state,'staff-review');assert.equal(goat.fitment.reinforcementReview.candidatePartId,ford.id);assert.equal(goat.fitment.reinforcementReview.observedAccessoryWeightKg,50);assert(!(goat.requires||[]).includes(ford.id));

// Global identity/dependency integrity + approved-visual guard.
const ids=d.accessories.map(x=>x.id),skus=d.accessories.map(x=>x.sku).filter(Boolean);assert.equal(new Set(ids).size,ids.length);assert.equal(new Set(skus).size,skus.length);
for(const p of d.accessories){
  for(const dep of [...(p.requires||[]),...(p.fitment?.requiredParts||[]),...(p.fitment?.anyOfRequiredParts||[])]) assert(byId.has(dep),`${p.id} missing dependency ${dep}`);
  for(const route of p.fitment?.mountingRoutes||[]) for(const dep of route.requiredParts||[]) assert(byId.has(dep),`${p.id} route ${route.route} missing dependency ${dep}`);
  for(const c of p.fitment?.supportCandidates||[]) assert(byId.has(c.partId),`${p.id} support candidate missing ${c.partId}`);
  for(const c of p.fitment?.alternativeGovernedParts||[]) assert(byId.has(c.partId),`${p.id} alternate part missing ${c.partId}`);
}
assert.notEqual(ford.visual?.status,'approved');
console.log(JSON.stringify({schemaVersion:d.schemaVersion,accessories:d.accessories.length,evidenceRows:ev.sources.length,newRecord:ford.id,fordRrpAud:ford.price,wildtrakDirectlyListed:true,platinumVinReview:true,oaScoutAutoSatisfied:false,goatThresholdReview:true,duplicateIds:0,duplicateSkus:0,status:'pass'},null,2));
