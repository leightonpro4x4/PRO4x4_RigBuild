const assert=require('assert');
const path=require('path');
const fs=require('fs'),vm=require('vm');
const root=path.join(__dirname,'..');

global.window={};require(path.join(root,'data-y62.js'));const y62=window.RIG_DATA;delete global.window;
const evidence=require(path.join(root,'y62-source-evidence.js'));
assert.equal(y62.wf2Revision,'0.26.25');
assert.equal(y62.accessories.length,26,'Y62 governed catalogue should advance 25 -> 26 for Toro accessory-route governance');
assert.equal(evidence.schemaVersion,'0.26.25');
assert.equal(evidence.sources.length,15);

const ids=y62.accessories.map(x=>x.id),skus=y62.accessories.map(x=>x.sku).filter(Boolean);
assert.equal(new Set(ids).size,ids.length,'duplicate Y62 product IDs');
assert.equal(new Set(skus).size,skus.length,'duplicate Y62 SKUs');
const byId=new Map(y62.accessories.map(x=>[x.id,x]));
const toro=byId.get('oa-y62-toro-frontbar');
const runva=byId.get('runva-11expedition-y62-toro');
const light22=byId.get('oa-y62-22in-slim-lightbar');
const ass=byId.get('oa-y62-ass-kicker-9-pair');
const night=byId.get('oa-y62-night-slapper-9-pair');
const butt=byId.get('oa-y62-butt-kicker-7-pair');
const cobra=byId.get('oa-y62-cobra-frontbar');
for(const x of [toro,runva,light22,ass,night,butt,cobra])assert(x,'missing governed Toro route record');

assert.equal(toro.sku,'FB-NPT-Y62-19-TOR-ASM0');
assert.equal(toro.pricing.parts,3990);
assert.equal(toro.pricingMeta.rrpAud,null);
assert.deepEqual([...toro.fitment.currentManufacturerOptionSet.lighting].sort(),[light22.id,ass.id,night.id,butt.id].sort());
assert.deepEqual(toro.fitment.currentManufacturerOptionSet.recovery,[runva.id]);
assert.deepEqual(toro.fitment.currentManufacturerOptionSet.warriorMandatorySupport,['oa-y62-warrior-lower-bash']);
const bundles=toro.fitment.installationPricingEvidence;
assert.equal(bundles.frontBarOnlyAud,900);
assert.equal(bundles.frontBarPlusOneLightBarOrDrivingLightsAud,1200);
assert.equal(bundles.frontBarPlusLightBarAndDrivingLightsAud,1350);
assert.equal(bundles.frontBarPlusWinchAud,1200);
assert.equal(bundles.frontBarPlusOneLightBarOrDrivingLightsAndWinchAud,1500);
assert.equal(bundles.frontBarPlusLightBarDrivingLightsAndWinchAud,1650);
assert.equal(bundles.standaloneWinchLabourAud,null);
assert.equal(bundles.standaloneLightingLabourAud,null);

assert.equal(runva.sku,'11EXPEDITION12V');
assert.equal(runva.status,'confirmed');
assert.equal(runva.pricing.parts,1295);
assert.equal(runva.pricingMeta.rrpAud,1295);
assert.equal(runva.pricingMeta.currentManufacturerPriceAud,1295);
assert.equal(runva.pricingMeta.currentOffroadAnimalPriceAud,1295);
assert.equal(runva.weightKg,29);
assert.equal(runva.storefrontListedWeightKg,31);
assert.equal(runva.shippingWeightKg,39);
assert.deepEqual(runva.fitment.requiredParts,[toro.id]);
assert.equal(runva.fitment.reviewRequired,true);
assert.equal(runva.install.estimateHoursMin,null);
assert.equal(runva.install.estimateHoursMax,null);
assert.equal(runva.specifications.ratedLinePullLb,11000);
assert.equal(runva.specifications.ratedLinePullKg,4990);
assert.equal(runva.specifications.mountingBoltPatternMm.width,254);
assert.equal(runva.specifications.mountingBoltPatternMm.depth,114.3);
assert.equal(runva.specifications.mountingBoltPatternMm.hardware,'4 x M10 bolts');
assert.equal(runva.visualisable,false);
assert.equal(runva.visual.status,'non-visual');
assert.equal(runva.visual.approved,false);
assert(runva.fittingParts.unresolvedExternalParts.some(x=>/isolation/i.test(x)));

for(const x of [light22,ass,night,butt]){
  assert(x.fitment.requiresAnyOf.includes(toro.id),`${x.id} must include Toro route`);
  assert(x.fitment.requiresAnyOf.includes(cobra.id),`${x.id} must retain Cobra route`);
  assert(x.fitment.routeDependencies.some(r=>r.parentId===toro.id&&r.state==='confirmed-current-configurator-option'),`${x.id} Toro route not confirmed`);
  assert.equal(x.visual?.approved,false,`${x.id} must remain non-approved visually`);
}
const assCobra=ass.fitment.routeDependencies.find(r=>r.parentId===cobra.id);
const assToro=ass.fitment.routeDependencies.find(r=>r.parentId===toro.id);
assert(assCobra.requiredParts.includes('oa-y62-rally-hoop-9'),'Cobra Ass Kicker route must retain 9-inch Rally Hoop');
assert.deepEqual(assToro.requiredParts,[],'Toro Ass Kicker route must not inherit Cobra Rally Hoop');
const buttToro=butt.fitment.routeDependencies.find(r=>r.parentId===toro.id);
assert.deepEqual(buttToro.requiredParts,[],'Toro Butt Kicker route must not infer 7-inch Rally Hoop');
assert(!buttToro.candidateParts?.includes('oa-y62-rally-hoop-7'),'Toro must not inherit Cobra 7-inch hoop candidate');

const evToro=evidence.sources.find(x=>x.id===toro.id),evRunva=evidence.sources.find(x=>x.id===runva.id);
assert(evToro&&evRunva,'missing Toro/Runva evidence');
assert(evToro.currentManufacturerOptionSet.recoverySkus.includes('11EXPEDITION12V'));
assert.equal(evToro.fittingPartnerBundlePricingAud.standaloneLabourNormalization,'not-derived');
assert.equal(evRunva.sku,'11EXPEDITION12V');
assert.equal(evRunva.weightKg,29);
assert.equal(evRunva.fittedWeightKg,29);
assert.equal(evRunva.currentManufacturerPriceAud,1295);
assert.deepEqual(evRunva.requiredParentSkus,[toro.sku]);
assert.equal(evRunva.fittingPartnerBundlePricingAud.standaloneWinchLabourNormalized,null);

// Cross-catalogue identity normalization: exact universal Runva SKU must match the locked Ranger record.
const ctx={window:{}};vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.join(root,'data-ranger.js'),'utf8'),ctx);const ranger=ctx.window.RANGER_DATA;
assert.equal(ranger.accessories.length,73,'Ranger catalogue baseline updated by subsequent governed WF2 packages');
const rangerRunva=ranger.accessories.find(x=>x.sku===runva.sku);assert(rangerRunva,'shared Ranger Runva SKU missing');
assert.equal(rangerRunva.brand,runva.brand);
assert.equal((rangerRunva.price??rangerRunva.pricing?.parts??null),runva.pricing.parts);
assert.equal(rangerRunva.weightKg,runva.weightKg);
assert.equal(rangerRunva.storefrontListedWeightKg,runva.storefrontListedWeightKg);
assert.equal(rangerRunva.shippingWeightKg,runva.shippingWeightKg);

// New/modified Toro package dependencies must resolve; pre-existing external engineering conflicts remain outside this package.
const resolvable=new Set(ids);
for(const x of [toro,runva,light22,ass,night,butt]){
  for(const id of x.fitment?.requiredParts||[])assert(resolvable.has(id),`${x.id}: missing required part ${id}`);
  for(const id of x.fitment?.optionalParts||[])assert(resolvable.has(id),`${x.id}: missing optional part ${id}`);
  for(const id of x.fitment?.requiresAnyOf||[])assert(resolvable.has(id),`${x.id}: missing requiresAnyOf ${id}`);
  for(const r of x.fitment?.routeDependencies||[]){
    assert(resolvable.has(r.parentId),`${x.id}: missing route parent ${r.parentId}`);
    for(const id of r.requiredParts||[])assert(resolvable.has(id),`${x.id}: missing route required ${id}`);
    for(const id of r.candidateParts||[])assert(resolvable.has(id),`${x.id}: missing route candidate ${id}`);
  }
}
for(const x of y62.accessories)assert.notEqual(x.visual?.status,'approved',`${x.id} must not gain approved visual state in WF2`);

const seed=JSON.parse(fs.readFileSync(path.join(root,'seed/bootstrap.seed.json'),'utf8'));
assert.equal(seed.schemaVersion,'0.12.0');
assert.equal(seed.catalogue.accessories.length,26);
const seedRunva=seed.catalogue.accessories.find(x=>x.id===runva.id);assert(seedRunva);assert.equal(seedRunva.sku,runva.sku);

console.log('WF2 Y62 Toro accessory-route governance PASS',{
  accessories:y62.accessories.length,
  evidence:evidence.sources.length,
  runvaSku:runva.sku,
  fittedWeightKg:runva.weightKg,
  toroOptionCount:toro.fitment.currentManufacturerOptionSet.lighting.length+toro.fitment.currentManufacturerOptionSet.recovery.length,
  rangerSharedSkuMatch:true
});
