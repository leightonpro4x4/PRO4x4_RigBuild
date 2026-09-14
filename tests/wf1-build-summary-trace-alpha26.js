'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const trace=require('../customer-build-trace.js');
const contract=require('../merged-project-contract.js');
const root=path.join(__dirname,'..');

const sample={id:'p1',name:'Skid Plate',category:'Protection',brand:'Offroad Animal'};
assert.deepEqual(trace.targetForProduct(sample),{
  productId:'p1',category:'PROTECTION',vendor:'Offroad Animal',path:['ALL GEAR','PROTECTION','Offroad Animal']
});
assert.equal(trace.targetForProduct({name:'No id'}),null);

const products=[sample,{id:'support',name:'Support',category:'Protection',brand:'Offroad Animal'}];
assert.equal(trace.gateOwnerId({productId:'p1',id:'p1:any-of'},products),'p1');
assert.equal(trace.gateOwnerId({id:'p1'},products),'p1');
assert.equal(trace.gateOwnerId({id:'p1:support'},products),'p1');
assert.equal(trace.gateOwnerId({id:'unknown:token'},products),null);
assert.equal(trace.targetForGate({productId:'p1'},products).productId,'p1');

// Presentation navigation must not mutate governed catalogue records.
const frozen=Object.freeze({id:'fixed',category:'Protection',brand:'MCC 4x4'});
const before=JSON.stringify(frozen);trace.targetForProduct(frozen);assert.equal(JSON.stringify(frozen),before);

// Integration against the governed checkpoint: an unresolved OR dependency must trace to its owner product.
const ctx={};ctx.window=ctx;ctx.globalThis=ctx;
vm.runInNewContext(fs.readFileSync(path.join(root,'data-ranger.js'),'utf8'),ctx,{filename:'data-ranger.js'});
const ranger=ctx.RANGER_DATA.accessories;
const bash=ranger.find(p=>p.id==='oa-lower-bash-ranger');
assert(bash,'governed Ranger lower bash record must exist');
const gates=contract.gatesFor([bash],ctx.RANGER_DATA.vehicle.id,ranger);
const anyOf=gates.find(g=>g.type==='dependency-any-of');
assert(anyOf,'lower bash must retain its unresolved any-of dependency gate when no support bar is selected');
const bashTarget=trace.targetForGate(anyOf,ranger);
assert.equal(bashTarget.productId,bash.id);
assert.equal(bashTarget.category,'PROTECTION');
assert.equal(bashTarget.vendor,'Offroad Animal');

const app=fs.readFileSync(path.join(root,'merged-app.js'),'utf8');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const css=fs.readFileSync(path.join(root,'merged.css'),'utf8');
assert.match(app,/PRO4X4_CUSTOMER_BUILD_TRACE/);
assert.match(app,/function focusProductConstraint\(/);
assert.match(app,/state\.category=target\.category;state\.vendor=target\.vendor;(?:state\.focusProductId=p\.id;)?renderCategories\(\);renderManufacturers\(\);renderProducts\(\)/);
assert.match(app,/d\.dataset\.productId=p\.id/,'rendered catalogue cards must expose stable governed product identity for trace targeting');
assert.match(app,/VIEW IN CATALOGUE →/);
assert.match(app,/data-trace-product/);
assert.match(app,/class=\"merge-build-remove\"/,'remove action must remain distinct from trace actions');
assert.ok(html.indexOf('customer-build-trace.js')<html.indexOf('merged-app.js'),'trace helper must load before customer app');
assert.match(css,/\.build-trace-link/);
assert.match(css,/\.merge-product\.trace-focus/);

// Focus navigation changes browse state only; it must not write catalogue truth or project selections.
const focusBlock=app.slice(app.indexOf('function focusProductConstraint('),app.indexOf('function buildTraceAction('));
assert.doesNotMatch(focusBlock,/state\.selected\.(add|delete|clear)/);
assert.doesNotMatch(focusBlock,/saveProject|createBuild|resolveRenderStack/);

console.log('WF1 Alpha 26 build-summary constraint traceability: PASS');
