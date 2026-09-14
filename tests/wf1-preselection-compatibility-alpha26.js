'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const guidance=require('../customer-product-guidance.js');
const root=path.join(__dirname,'..');

const required={id:'req',name:'Required Bracket',status:'confirmed'};
const altA={id:'a',name:'Predator Bar',status:'confirmed'};
const altB={id:'b',name:'Toro Bar',status:'confirmed'};
const conflict={id:'conflict',name:'Factory Hoop',status:'confirmed'};
const blockedReq={id:'blocked-req',name:'Blocked Support',status:'blocked'};
const all=[required,altA,altB,conflict,blockedReq];

let product={id:'p',name:'Accessory',requires:['req'],fitment:{anyOfRequiredParts:['a','b'],conflicts:['conflict']}};
let model=guidance.compatibility(product,all,new Set());
assert.equal(model.hasConstraints,true);
assert(model.rows.some(r=>r.code==='required-auto'&&/Required Bracket/.test(r.label)),'known all-of dependency must be explained before ADD');
assert(model.rows.some(r=>r.code==='anyof-required'&&/Predator Bar OR Toro Bar/.test(r.label)),'all verified any-of alternatives must be named without choosing one');
assert(model.rows.some(r=>r.code==='conflict-known'&&/Factory Hoop/.test(r.label)),'known conflict must be disclosed even before the conflicting item is selected');
assert.equal(model.blocking,0);

model=guidance.compatibility(product,all,new Set(['req','a','conflict']));
assert(model.rows.some(r=>r.code==='required-selected'),'selected required dependency must be shown as satisfied');
assert(model.rows.some(r=>r.code==='anyof-selected'&&/Predator Bar/.test(r.label)),'selected OR alternative must be shown as satisfied');
assert(model.rows.some(r=>r.code==='conflict-active'),'selected conflict must become an active blocker in guidance');
assert.equal(model.blocking,1);

product={id:'unknowns',fitment:{requiredParts:['catalogue-part-not-yet-governed'],conflicts:['manufacturer-constraint-token'],anyOfRequiredParts:['unknown-a','unknown-b']}};
model=guidance.compatibility(product,all,new Set());
assert.equal(model.review,3,'unknown dependencies/conflicts must remain explicit staff-review states');
assert(model.rows.every(r=>r.kind==='review'));
assert(model.rows.every(r=>/review|preserved|governed/i.test(`${r.label} ${r.detail}`)),'unknowns must not be presented as inferred certainty');

product={id:'blocked-dependency',fitment:{requiredParts:['blocked-req']}};
model=guidance.compatibility(product,all,new Set());
assert.equal(model.blocking,1);
assert(model.rows.some(r=>r.code==='required-blocked'));

// Presentation contract must not mutate catalogue inputs or own fitment truth.
const frozenProduct=Object.freeze({id:'immutable',requires:Object.freeze(['req']),fitment:Object.freeze({conflicts:Object.freeze(['conflict'])})});
const before=JSON.stringify(frozenProduct);
guidance.compatibility(frozenProduct,all,new Set());
assert.equal(JSON.stringify(frozenProduct),before);


// Integration against the governed checkpoint: show declared fitment impact without creating new fitment truth.
const ctx={};ctx.window=ctx;ctx.globalThis=ctx;
vm.runInNewContext(fs.readFileSync(path.join(root,'data-ranger.js'),'utf8'),ctx,{filename:'data-ranger.js'});
vm.runInNewContext(fs.readFileSync(path.join(root,'data-y62.js'),'utf8'),ctx,{filename:'data-y62.js'});
const ranger=ctx.RANGER_DATA.accessories;
const sideRail=ranger.find(p=>p.id==='mcc-309rp');
const sideRailGuide=guidance.compatibility(sideRail,ranger,new Set());
assert(sideRailGuide.rows.some(r=>r.code==='required-auto'&&/309BSBK|Side Step/i.test(r.label)),'Ranger side rail must disclose its governed support dependency before ADD');
const bash=ranger.find(p=>p.id==='oa-lower-bash-ranger');
const bashGuide=guidance.compatibility(bash,ranger,new Set());
assert(bashGuide.rows.some(r=>r.code==='anyof-required'&&/Predator.+OR.+Toro/i.test(r.label)),'Ranger lower bash must show both governed support alternatives');
const y62=ctx.RIG_DATA.accessories;
const hbmc=y62.find(p=>p.id==='hbmc-lift');
const hbmcGuide=guidance.compatibility(hbmc,y62,new Set());
assert(hbmcGuide.rows.some(r=>r.code==='conflict-unmapped'&&/factory-warrior-50mm-lift/i.test(r.label)),'unmapped Y62 conflict token must remain an explicit staff-review constraint');

const app=fs.readFileSync(path.join(root,'merged-app.js'),'utf8');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const css=fs.readFileSync(path.join(root,'merged.css'),'utf8');
assert.match(app,/PRO4X4_CUSTOMER_PRODUCT_GUIDANCE/);
assert.match(app,/BEFORE YOU ADD/);
assert.match(app,/guidance\.rows\.map/);
assert.ok(html.indexOf('customer-product-guidance.js')<html.indexOf('merged-app.js'),'guidance presentation helper must load before the app');
assert.match(css,/\.mp-compatibility-row\.conflict/);
assert.match(css,/\.mp-compatibility-row\.satisfied/);

console.log('WF1 Alpha 26 pre-selection compatibility impact preview: PASS');
