'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const inspection=require('../customer-constraint-inspection.js');
const root=path.join(__dirname,'..');

// Pure presentation contract: an inspection frame records only a governed origin/target and browse-return context.
const products=[
  {id:'origin',name:'Origin Product',category:'Protection',brand:'Vendor A'},
  {id:'target',name:'Support Product',category:'Suspension',brand:'Vendor B'}
];
const frame=inspection.createFrame({originProduct:products[0],targetProduct:products[1],browse:{category:'PROTECTION',vendor:'Vendor A'},issueLabel:'REQUIRES ONE OF'});
assert(frame,'governed origin and target should create an inspection frame');
assert.deepEqual({...frame.originBrowse},{category:'PROTECTION',vendor:'Vendor A',focusProductId:'origin'});
assert.equal(frame.originProductId,'origin');
assert.equal(frame.targetProductId,'target');
assert.equal(frame.issueLabel,'REQUIRES ONE OF');
assert.equal(inspection.createFrame({originProduct:products[0],targetProduct:products[0]}),null,'self-navigation must not create a return trail');
const trail=[frame];
const active=inspection.activeFor(trail,'target',products);
assert.equal(active.origin.id,'origin');
assert.equal(active.target.id,'target');
assert.equal(active.depth,1);
assert.equal(inspection.activeFor(trail,'origin',products),null,'return banner belongs only to the inspected target');
const returned=inspection.returnStep(trail,products);
assert.equal(returned.origin.id,'origin');
assert.deepEqual(returned.trail,[]);
assert.equal(trail.length,1,'return-step derivation must not mutate caller-owned navigation state');

// Real governed Ranger proof: lower bash -> Predator inspection can return to the exact originating lower-bash card.
const ctx={};ctx.window=ctx;ctx.globalThis=ctx;
vm.runInNewContext(fs.readFileSync(path.join(root,'data-ranger.js'),'utf8'),ctx,{filename:'data-ranger.js'});
const ranger=ctx.RANGER_DATA.accessories;
const bash=ranger.find(p=>p.id==='oa-lower-bash-ranger'),predator=ranger.find(p=>p.id==='oa-predator');
assert(bash&&predator,'governed Ranger origin/target records must exist');
const realFrame=inspection.createFrame({originProduct:bash,targetProduct:predator,browse:{category:'PROTECTION',vendor:'Offroad Animal'},issueLabel:'REQUIRES ONE OF: PREDATOR OR TORO'});
assert.equal(realFrame.originProductId,'oa-lower-bash-ranger');
assert.equal(realFrame.targetProductId,'oa-predator');
assert.equal(inspection.returnStep([realFrame],ranger).origin.id,'oa-lower-bash-ranger');

const app=fs.readFileSync(path.join(root,'merged-app.js'),'utf8');
const css=fs.readFileSync(path.join(root,'merged.css'),'utf8');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
assert.match(html,/customer-constraint-inspection\.js/,'configurator must load the presentation-only inspection contract');
assert.match(app,/constraintTrail:\[\]/,'inspection return state must remain transient UI state');
assert.match(app,/function inspectProductConstraint\(/,'related-product inspection must capture an origin before navigation');
assert.match(app,/function returnFromConstraintInspection\(/,'inspection must provide a direct return route');
assert.match(app,/data-inspection-return=/,'inspected governed product card must expose a return control');
assert.match(app,/← RETURN TO/,'return control must name the originating governed product');
assert.match(app,/inspectProductConstraint\(p\.id,b\.dataset\.guidanceProduct/,'guidance links must carry the actual originating product identity');
assert.match(app,/focusProductConstraint\(targetProductId,issueLabel,\{preserveInspection:true\}\)/,'inspection navigation must reuse the exact existing catalogue trace path');
assert.match(css,/\.mp-inspection-return/,'return continuity must use dedicated PRO4X4 customer styling');

// Inspection context must not enter the immutable project snapshot or mutate build/catalogue/render truth.
const snapBlock=app.slice(app.indexOf('const norm='),app.indexOf('function normalizeBrowse('));
assert.doesNotMatch(snapBlock,/constraintTrail/,'transient inspection state must stay outside undo/build snapshot data');
const inspectStart=app.indexOf('function inspectProductConstraint('),inspectEnd=app.indexOf('function guidanceTraceLabel(');
assert(inspectStart>=0&&inspectEnd>inspectStart,'inspection helper block must exist');
const inspectBlock=app.slice(inspectStart,inspectEnd);
assert.doesNotMatch(inspectBlock,/state\.selected\.(add|delete|clear)/,'inspection/return must never mutate selections');
assert.doesNotMatch(inspectBlock,/saveProject|createBuild|createProjectShare|resolveRenderStack/,'inspection/return must not write projects, quotes, shares, or renders');
assert.doesNotMatch(inspectBlock,/\.price\s*=|\.sku\s*=|\.fitment\s*=/,'inspection/return must not become catalogue or fitment ownership');

console.log('WF1 Alpha 26 related-fitment inspection return continuity: PASS');
