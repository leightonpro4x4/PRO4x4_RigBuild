'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const nav=require('../customer-handoff-requirement-nav.js');
const contract=require('../merged-project-contract.js');
const root=path.join(__dirname,'..');

global.window=global;
require('../data-ranger.js');
const data=global.RANGER_DATA;
const products=data.accessories;
const bash=products.find(p=>p.id==='oa-lower-bash-ranger');
assert(bash,'governed Ranger lower-bash fixture must exist');
const gate=contract.gatesFor([bash],data.vehicle.id,products).find(g=>g.type==='dependency-any-of');
assert(gate,'lower bash must expose its governed any-of support gate');
const actions=nav.gateActions(gate,products);
assert.equal(actions[0].role,'source');
assert.equal(actions[0].productId,'oa-lower-bash-ranger');
assert(actions.some(a=>a.role==='option'&&a.productId==='oa-predator'),'Predator must be exposed only because its governed product id is in requiredAnyOf');
assert(actions.some(a=>a.role==='option'&&a.productId==='oa-toro-ranger'),'Toro must be exposed only because its governed product id is in requiredAnyOf');
assert(actions.every(a=>products.some(p=>p.id===a.productId)),'handoff navigation may target governed catalogue records only');

const requiredGate={type:'dependency',productId:'oa-lower-bash-ranger',requiredId:'oa-predator',note:'Source requires Predator.'};
const requiredActions=nav.gateActions(requiredGate,products);
assert(requiredActions.some(a=>a.role==='source'&&a.productId==='oa-lower-bash-ranger'));
assert(requiredActions.some(a=>a.role==='required'&&a.productId==='oa-predator'));

const setup=nav.setupActions({productId:'oa-lower-bash-ranger',productName:bash.name,conditions:['Example governed condition']},products);
assert.equal(setup.length,1);
assert.equal(setup[0].productId,'oa-lower-bash-ranger');
assert.equal(setup[0].role,'setup-source');

// Free text with no governed product identity must never fabricate a target.
assert.deepEqual(nav.gateActions({type:'fitment-review',note:'Requires a manufacturer-specific setup that is not mapped.'},products),[]);
assert.deepEqual(nav.setupActions({productName:'Unmapped setup only'},products),[]);

// Presentation derivation must not mutate the immutable gate or catalogue inputs.
const gateBefore=JSON.stringify(gate),productBefore=JSON.stringify(bash);
nav.gateActions(gate,products);nav.setupActions({productId:bash.id},products);
assert.equal(JSON.stringify(gate),gateBefore);
assert.equal(JSON.stringify(bash),productBefore);

const app=fs.readFileSync(path.join(root,'merged-app.js'),'utf8');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const css=fs.readFileSync(path.join(root,'merged.css'),'utf8');
assert.ok(html.indexOf('customer-handoff-requirement-nav.js')<html.indexOf('merged-app.js'),'handoff requirement navigation contract must load before configurator runtime');
assert.match(app,/PRO4X4_HANDOFF_REQUIREMENT_NAV/);
assert.match(app,/function handoffRequirementActions\(/);
assert.match(app,/data-handoff-requirement-product=/);
assert.match(app,/function navigateFromHandoffRequirement\(/);
assert.match(app,/closeHandoffReview\(\);const moved=focusProductConstraint\(/,'leaving the review must discard the captured review before catalogue inspection so stale snapshot confirmation cannot survive navigation');
assert.match(app,/Reopen .*review when ready; this inspection did not change the selected build\./);
assert.match(css,/\.merge-handoff-requirement-actions/);

const start=app.indexOf('function navigateFromHandoffRequirement('),end=app.indexOf('function renderHandoffReview(',start);
assert(start>=0&&end>start,'handoff requirement navigation block must exist');
const block=app.slice(start,end);
assert.doesNotMatch(block,/state\.selected\.(add|delete|clear)/,'handoff review inspection must not change BOM selections');
assert.doesNotMatch(block,/saveProject|createBuild|createProjectShare|resolveRenderStack/,'handoff review inspection must not persist projects, quotes, shares, or render state');
assert.doesNotMatch(block,/\.price\s*=|\.sku\s*=|\.fitment\s*=/,'handoff review inspection must not become catalogue/fitment ownership');

console.log('WF1 Alpha 26 handoff-review requirement return navigation: PASS');
