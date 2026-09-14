const assert=require('assert');const path=require('path');const root=path.join(__dirname,'..');
global.window={};require(path.join(root,'data-y62.js'));const y62=window.RIG_DATA;delete global.window;
const evidence=require(path.join(root,'y62-source-evidence.js'));
assert.equal(y62.wf2Revision,'0.26.25');
assert.equal(y62.accessories.length,26,'Y62 governed catalogue must retain the three governed front-protection records in the current 25-record catalogue');
const ids=y62.accessories.map(x=>x.id),skus=y62.accessories.map(x=>x.sku).filter(Boolean);
assert.equal(new Set(ids).size,ids.length,'Y62 IDs must be unique');
assert.equal(new Set(skus).size,skus.length,'Y62 SKUs must be unique');
const byId=new Map(y62.accessories.map(x=>[x.id,x]));
const toro=byId.get('oa-y62-toro-frontbar'),cobra=byId.get('oa-y62-cobra-frontbar'),bash=byId.get('oa-y62-warrior-lower-bash'),slx=byId.get('slx-x1');
for(const x of [toro,cobra,bash])assert(x,'new Y62 front protection record missing');
assert.equal(toro.sku,'FB-NPT-Y62-19-TOR-ASM0');assert.equal(toro.pricing.parts,3990);assert.equal(toro.pricingMeta.rrpAud,null);assert.equal(toro.weightKg,null);assert.equal(toro.storefrontListedWeightKg,77);assert.deepEqual([toro.install.estimateHoursMin,toro.install.estimateHoursMax],[5,6]);assert.equal(toro.install.difficulty10,5);assert(toro.fitment.requiredParts.includes(bash.id));assert(toro.fitment.conflicts.includes(cobra.id));assert(toro.fitment.conflicts.includes(slx.id));assert.equal(toro.fitment.reviewRequired,true);assert.equal(toro.visual.approved,false);
assert.equal(cobra.sku,'FB-NPT-Y62-19-PR-ASM0');assert.equal(cobra.pricing.parts,3415);assert.equal(cobra.pricingMeta.rrpAud,null);assert.equal(cobra.weightKg,null);assert.equal(cobra.storefrontListedWeightKg,65);assert.deepEqual([cobra.install.estimateHoursMin,cobra.install.estimateHoursMax],[4,4]);assert.equal(cobra.install.difficulty10,5);assert(cobra.fitment.requiredParts.includes(bash.id));assert(cobra.fitment.conflicts.includes(toro.id));assert(cobra.fitment.conflicts.includes(slx.id));assert.equal(cobra.fitment.reviewRequired,true);assert.equal(cobra.visual.approved,false);
assert.equal(bash.sku,'FB-NPT-Y62-19-PR-ASM6');assert.equal(bash.pricing.parts,420);assert.equal(bash.pricingMeta.rrpAud,null);assert.equal(bash.weightKg,null);assert.equal(bash.storefrontListedWeightKg,8);assert.deepEqual(bash.fitment.requiresAnyOf.sort(),[cobra.id,toro.id].sort());assert.equal(bash.fitment.reviewRequired,true);assert.equal(bash.visual.approved,false);assert.equal(bash.visual.status,'non-visual');
assert(slx.fitment.conflicts.includes(toro.id)&&slx.fitment.conflicts.includes(cobra.id),'existing selected SLX route must conflict with new front-bar alternatives');
assert.equal(evidence.schemaVersion,'0.26.25');assert.equal(evidence.sources.length,15);for(const sku of [toro.sku,cobra.sku,bash.sku])assert(evidence.sources.some(x=>x.sku===sku),`missing front-protection evidence ${sku}`);
// Resolve all newly governed references without pretending arbitrary conflict strings are product IDs.
for(const x of [toro,cobra,bash]){for(const id of x.fitment.requiredParts||[])assert(byId.has(id),`missing required part ${id}`);for(const id of x.fitment.requiresAnyOf||[])assert(byId.has(id),`missing any-of part ${id}`);for(const id of (x.fitment.conflicts||[]).filter(id=>id.startsWith('oa-y62-')||id==='slx-x1'))assert(byId.has(id),`missing conflict ${id}`);}
console.log('WF2 Y62 front protection governance PASS', {accessories:y62.accessories.length,evidence:evidence.sources.length,skus:[toro.sku,cobra.sku,bash.sku]});
