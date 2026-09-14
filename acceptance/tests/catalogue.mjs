import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import vm from 'node:vm';
import {loadSources,normalize,identity} from '../../subsystems/catalogue/normalize.mjs';
const root=new URL('../../',import.meta.url);
const read=p=>fs.readFileSync(new URL(p,root));
const json=p=>JSON.parse(read(p));
const data=json('subsystems/catalogue/catalogue.json');
const mapping=json('subsystems/catalogue/alpha93-mapping.json');
const fixture=json('subsystems/catalogue/alpha93-fixture.json');
const baseline=json('consolidation/manifest.json');
const source=baseline.sources.find(s=>s.branch==='wf2');
for(const file of ['data-ranger.js','data-y62.js','ranger-source-evidence.js','y62-source-evidence.js']) {
  assert.equal(crypto.createHash('sha256').update(read('subsystems/catalogue/source-wf2/'+file)).digest('hex'),source.files.find(f=>f.path===file).sha256,file);
}
// Exact semantic preservation includes every null, condition, route and evidence field.
assert.deepEqual(data,normalize(loadSources()));
assert.equal(data.sourceCommit,source.commit);
assert.equal(new Set(data.products.map(p=>p.identity)).size,99);
assert.equal(new Set(data.evidence.map(p=>p.identity)).size,69);
assert.equal(identity('ranger','shared-sku'), 'ranger::shared-sku');
assert.notEqual(identity('ranger','shared-sku'),identity('y62','shared-sku'));
for(const [vehicleId,products,evidence] of [['ford-ranger-nextgen-2025',73,54],['nissan-y62-warrior-2025',26,15]]) {
  assert.equal(data.products.filter(p=>p.vehicleId===vehicleId).length,products);
  assert.equal(data.evidence.filter(p=>p.vehicleId===vehicleId).length,evidence);
}
for(const product of data.products) {
  assert.equal(product.identity,identity(product.vehicleId,product.data.id));
  assert.equal(product.variantContext.trim,data.vehicles.find(v=>v.vehicleId===product.vehicleId).definition.vehicle.trim);
}
assert.equal(mapping.mappings.length,7);
assert.equal(new Set(mapping.mappings.map(p=>p.visualProductId)).size,7);
for(const row of mapping.mappings) {
  assert.equal(row.sku,fixture.products[row.visualProductId].sku);
  if(row.catalogueIdentity) {
    const product=data.products.find(p=>p.identity===row.catalogueIdentity);
    assert(product);assert.equal(product.vehicleId,mapping.vehicleId);assert.equal(product.data.sku,row.sku);
  } else {
    assert.equal(row.visualProductId,'powerboards');assert.equal(row.outcome,'alpha93-only-mapping-gap');
  }
}
assert(!data.products.some(p=>p.data.sku==='PB-FD-005'));
const get=id=>data.products.find(p=>p.identity===identity(mapping.vehicleId,id)).data;
assert.deepEqual(get('oa-rally-hoop-7in-ranger').requires,['oa-predator','oa-camera-relocation-ranger']);
const lights=get('oa-butt-kicker-7-pair-ranger');
assert.equal(lights.status,'engineering');assert.equal(lights.visual.approved,false);
assert.deepEqual(lights.requires,[]);assert.deepEqual(lights.fitment.anyOfRequiredParts,['oa-predator','oa-toro-ranger']);
assert.equal(lights.fitment.routeDependencies.length,2);assert.equal(lights.weightKg,null);assert.equal(lights.install,null);
assert(lights.fitment.routeDependencies[0].state.includes('hard-dependency-unproven'));
const scout=get('oa-scout-rack-ranger');
assert(scout.fitment.unresolvedAccessoryMappings.length>=2);assert(scout.fitment.conditions.length>0);assert.equal(scout.install,null);
const tub=get('oa-nice-tub-rack-ranger');
assert.equal(tub.price,null);assert.equal(tub.priceState,'source-conflict');assert.equal(tub.status,'engineering');
assert.deepEqual(tub.rrpCandidatesAud.map(p=>p.amount),[1750,1300]);assert.equal(tub.fitment.reviewRequired,true);
const rear=get('oa-rear-protection-ranger');
assert.equal(rear.status,'engineering');assert.equal(rear.fitment.reviewRequired,true);
assert(rear.fitment.conditions.includes('factory tow bar required'));
assert(rear.fitment.conditions.includes('not compatible with Hayman Reese tow bars'));
const y62=data.vehicles.find(v=>v.vehicleId==='nissan-y62-warrior-2025');
assert.equal(y62.visualAvailability.approvedProduction3DBase,false);assert.equal(y62.visualAvailability.approvedBaseAsset,null);
assert.equal(fixture.partsTotal,10239);assert.equal(Object.values(fixture.products).reduce((sum,p)=>sum+p.price,0),10239);
assert.equal(fixture.products.tubrack.price,1300);assert.equal(fixture.productionQuote,false);
// Fixture remains tied to the unchanged app, not an invented product list.
const scripts=[...read('evidence/archive/alpha93/runtime/index.html.source').toString().matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)];
const body=scripts.find(s=>!s[1].includes('type'))[2];const context=vm.createContext({});
vm.runInContext(body.slice(0,body.indexOf('let selected'))+';globalThis.fixture=PRODUCTS;',context);
assert.deepEqual(fixture.products,JSON.parse(JSON.stringify(context.fixture)));
console.log(JSON.stringify({status:'PASS',ranger:{accessories:73,evidence:54},y62:{accessories:26,evidence:15,approvedProduction3DBase:false},vehicleAwareProducts:99,mappingMatches:6,explicitAlpha93OnlyGaps:1,fixturePartsAUD:10239,sourceData:'byte-identical',normalizedData:'all source fields preserved',stage4Started:false},null,2));
