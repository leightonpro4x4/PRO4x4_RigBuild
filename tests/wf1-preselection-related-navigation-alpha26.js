'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const guidance=require('../customer-product-guidance.js');
const root=path.join(__dirname,'..');

// Pure contract proof: governed related-product identities are exposed by guidance, without mutation.
const products=[
  {id:'main',name:'Main Product',category:'Protection',brand:'Vendor A',fitment:{anyOfRequiredParts:['support-a','support-b'],conflicts:['conflict']}},
  {id:'support-a',name:'Support A',category:'Protection',brand:'Vendor B'},
  {id:'support-b',name:'Support B',category:'Suspension',brand:'Vendor C'},
  {id:'conflict',name:'Conflicting Item',category:'Protection',brand:'Vendor D'}
];
const selected=new Set();
const beforeProducts=JSON.stringify(products),beforeSelected=[...selected];
const model=guidance.compatibility(products[0],products,selected);
const anyOf=model.rows.find(r=>r.code==='anyof-required');
const conflict=model.rows.find(r=>r.code==='conflict-known');
assert.deepEqual(anyOf.productIds,['support-a','support-b']);
assert.equal(conflict.productId,'conflict');
assert.equal(JSON.stringify(products),beforeProducts);
assert.deepEqual([...selected],beforeSelected);

// Real governed Ranger proof: lower bash exposes both exact governed alternatives for inspection.
const ctx={};ctx.window=ctx;ctx.globalThis=ctx;
vm.runInNewContext(fs.readFileSync(path.join(root,'data-ranger.js'),'utf8'),ctx,{filename:'data-ranger.js'});
const ranger=ctx.RANGER_DATA.accessories;
const bash=ranger.find(p=>p.id==='oa-lower-bash-ranger');
assert(bash,'governed Ranger lower bash record must exist');
const rangerModel=guidance.compatibility(bash,ranger,new Set());
const rangerAnyOf=rangerModel.rows.find(r=>r.code==='anyof-required');
assert(rangerAnyOf,'lower bash must preserve its governed OR dependency');
assert.deepEqual([...rangerAnyOf.productIds].sort(),['oa-predator','oa-toro-ranger'].sort());
for(const id of rangerAnyOf.productIds)assert(ranger.some(p=>p.id===id),`related product ${id} must be a governed catalogue record`);

// Real Y62 proof: manufacturer-only conflict tokens remain review text, not invented navigation targets.
const y62ctx={};y62ctx.window=y62ctx;y62ctx.globalThis=y62ctx;
vm.runInNewContext(fs.readFileSync(path.join(root,'data-y62.js'),'utf8'),y62ctx,{filename:'data-y62.js'});
const y62=y62ctx.RIG_DATA.accessories;
const hbmc=y62.find(p=>p.id==='hbmc-lift');
assert(hbmc,'governed Y62 HBMC allowance record must exist');
const hbmcModel=guidance.compatibility(hbmc,y62,new Set());
const unmapped=hbmcModel.rows.find(r=>r.code==='conflict-unmapped');
assert(unmapped,'unmapped factory-lift conflict must remain an explicit staff-review constraint');
assert.equal(unmapped.productId,undefined,'WF1 must not invent a catalogue product identity for a manufacturer-only conflict token');

const app=fs.readFileSync(path.join(root,'merged-app.js'),'utf8');
const css=fs.readFileSync(path.join(root,'merged.css'),'utf8');
assert.match(app,/function guidanceTraceMarkup\(row\)/,'product-card guidance must render related-product inspection actions');
assert.match(app,/data-guidance-product=/,'related-product actions must carry stable governed product IDs');
assert.match(app,/guidanceTraceMarkup\(row\)/,'compatibility rows must render the non-mutating related-product navigation');
assert.match(app,/inspectProductConstraint\(p\.id,b\.dataset\.guidanceProduct/,'related-product inspection must retain the governed source product before following the exact catalogue trace path');
assert.match(app,/focusProductConstraint\(targetProductId,issueLabel,\{preserveInspection:true\}\)/,'related-product inspection must still reuse the existing exact catalogue trace path');
assert.match(app,/VIEW OPTION/,'OR dependencies must be presented as inspectable alternatives rather than an inferred choice');
assert.match(app,/VIEW CONFLICT/,'known incompatibilities must be inspectable before selection');
assert.match(app,/VIEW REQUIRED PART/,'required governed parts must be inspectable before selection');
assert.match(css,/\.mp-guidance-actions/,'related-product navigation must have a dedicated PRO4X4 customer style');

// The new guidance-navigation layer is presentation-only: no selection, project, quote, catalogue or render writes.
const start=app.indexOf('function guidanceTraceLabel('),end=app.indexOf('function renderProducts()');
assert(start>=0&&end>start,'guidance trace helper block must exist before product rendering');
const helperBlock=app.slice(start,end);
assert.doesNotMatch(helperBlock,/state\.selected\.(add|delete|clear)/);
assert.doesNotMatch(helperBlock,/saveProject|createBuild|createProjectShare|resolveRenderStack/);
assert.doesNotMatch(helperBlock,/\.price\s*=|\.sku\s*=|\.fitment\s*=/);

console.log('WF1 Alpha 26 pre-selection related-product navigation: PASS');
