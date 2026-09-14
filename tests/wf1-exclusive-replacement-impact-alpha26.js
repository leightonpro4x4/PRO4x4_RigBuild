'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const guidance=require('../customer-product-guidance.js');
const root=path.join(__dirname,'..');

const supportA={id:'step-a',name:'Step A',sku:'STEP-A',group:'side-step',status:'confirmed'};
const supportB={id:'step-b',name:'Step B',sku:'STEP-B',group:'side-step',status:'confirmed'};
const dependent={id:'rail',name:'Side Rail',requires:['step-a'],status:'confirmed'};
const free={id:'light',name:'Light',status:'confirmed'};
const all=[supportA,supportB,dependent,free];

let model=guidance.compatibility(supportB,all,new Set(['step-a','rail']));
assert.equal(model.replacement.group,'side-step');
assert.deepEqual(model.replacement.replacements.map(x=>x.id),['step-a']);
assert.equal(model.replacement.affected.length,1,'replacement must disclose the selected dependent that will become unresolved');
assert.equal(model.replacement.affected[0].productId,'rail');
assert(model.rows.some(r=>r.code==='exclusive-replacement'&&/Step A/.test(r.label)),'same-group replacement must be disclosed before ADD');
assert(model.rows.some(r=>r.code==='replacement-opens-requirement'&&/Side Rail/.test(r.label)),'replacement must disclose downstream support impact before ADD');
assert.equal(model.blocking,0,'existing exclusive-group behaviour remains selectable; this package adds transparency rather than new fitment truth');

model=guidance.compatibility(supportB,all,new Set(['rail']));
assert.equal(model.replacement.replacements.length,0,'no replacement warning when no same-group option is selected');
model=guidance.compatibility(supportA,all,new Set(['step-a','rail']));
assert.equal(model.replacement.replacements.length,0,'selected product must not claim it replaces itself');

// OR dependency should be evaluated against the post-replacement selection, including the candidate being added.
const predator={id:'predator',name:'Predator',group:'front-bar',status:'confirmed'};
const toro={id:'toro',name:'Toro',group:'front-bar',status:'confirmed'};
const bash={id:'bash',name:'Bash Plate',fitment:{anyOfRequiredParts:['predator','toro']},status:'confirmed'};
model=guidance.compatibility(toro,[predator,toro,bash],new Set(['predator','bash']));
assert.equal(model.replacement.replacements[0].id,'predator');
assert.equal(model.replacement.affected.length,0,'Predator → Toro must not falsely strand a dependent when Toro satisfies the same governed OR requirement');

// Presentation helper must remain read-only.
const frozen=Object.freeze({id:'frozen-b',name:'Frozen B',group:'bar'});
const frozenPeer=Object.freeze({id:'frozen-a',name:'Frozen A',group:'bar'});
const before=JSON.stringify([frozen,frozenPeer]);
guidance.compatibility(frozen,[frozen,frozenPeer],new Set(['frozen-a']));
assert.equal(JSON.stringify([frozen,frozenPeer]),before);

// Real governed Ranger proof: replacing the MCC all-black side step must warn about the selected side rail dependency.
const ctx={};ctx.window=ctx;ctx.globalThis=ctx;
vm.runInNewContext(fs.readFileSync(path.join(root,'data-ranger.js'),'utf8'),ctx,{filename:'data-ranger.js'});
const ranger=ctx.RANGER_DATA.accessories;
const blackStep=ranger.find(p=>p.id==='mcc-309bsbk');
const chromeStep=ranger.find(p=>p.id==='mcc-309bs');
const sideRail=ranger.find(p=>p.id==='mcc-309rp');
assert(blackStep&&chromeStep&&sideRail,'Ranger replacement fixtures missing');
model=guidance.compatibility(chromeStep,ranger,new Set([blackStep.id,sideRail.id]));
assert(model.rows.some(r=>r.code==='exclusive-replacement'&&/309BSBK|All Black Side Step/i.test(r.label)));
assert(model.rows.some(r=>r.code==='replacement-opens-requirement'&&/Side Rail/i.test(r.label)));

const app=fs.readFileSync(path.join(root,'merged-app.js'),'utf8');
const css=fs.readFileSync(path.join(root,'merged.css'),'utf8');
assert.match(app,/REPLACE \+ REVIEW/,'customer action must distinguish a replacement that reopens another requirement');
assert.match(app,/REPLACE SELECTED/,'clean same-group swap must be explicit before selection');
assert.match(app,/replacement\.replacements/,'card action must consume read-only replacement impact');
assert.match(css,/\.mp-compatibility-row\.replacement/,'replacement guidance must have an explicit PRO4X4 visual state');
assert.doesNotMatch(app,/productGuidance\?\.compatibility[\s\S]*?\.group\s*=/,'WF1 must not mutate catalogue group ownership');

console.log('WF1 Alpha 26 exclusive-option replacement impact preview: PASS');
