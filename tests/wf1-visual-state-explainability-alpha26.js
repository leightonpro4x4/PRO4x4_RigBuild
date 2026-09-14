'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const visual=require('../customer-visual-state');

const root=path.join(__dirname,'..');

assert.equal(visual.rule,'REFERENCE_BACKED_APPROVED_VISUALS_ONLY');

const blocked=visual.fromResolution({
  productionReady:false,
  fallbackPolicy:'none',
  exactMatchRequired:true,
  viewId:'front34',
  layers:[
    {layerId:'base',state:'available',reason:null,assetId:'Y62-F34-BASE',checksumSha256:'a'.repeat(64)},
    {layerId:'wheels',exactSku:'FACTORY-WARRIOR-18X9-G015',state:'missing',reason:'reference-only-not-production',assetId:'REFERENCE-SHOULD-NOT-SURVIVE'},
    {layerId:'sides',exactSku:'PB-NN-003',state:'blocked',reason:'fitment-blocked'}
  ]
},{vehicleKey:'y62'});
assert.equal(blocked.mode,'blocked');
assert.equal(blocked.tone,'bad');
assert.deepEqual(blocked.counts,{available:1,missing:1,blocked:1,other:0});
assert.equal(blocked.fallbackPolicy,'none');
assert.equal(blocked.exactMatchRequired,true);
assert.match(blocked.summary,/will not substitute/i);
const base=blocked.layers.find(x=>x.layerId==='base');
const wheels=blocked.layers.find(x=>x.layerId==='wheels');
const sides=blocked.layers.find(x=>x.layerId==='sides');
assert.equal(base.assetId,'Y62-F34-BASE');
assert.equal(base.checksumSha256,'a'.repeat(64));
assert.equal(wheels.assetId,null,'missing layers must never expose a reference/draft asset as the production choice');
assert.match(wheels.detail,/reference evidence exists/i);
assert.equal(wheels.reason,'reference-only-not-production');
assert.match(sides.detail,/blocked by a governed fitment condition/i);

const pending=visual.fromResolution({productionReady:false,fallbackPolicy:'none',exactMatchRequired:true,layers:[{layerId:'base',state:'missing',reason:'render-state-not-registered'}]},{vehicleKey:'y62',viewId:'front34'});
assert.equal(pending.mode,'pending');
assert.equal(pending.tone,'warn');
assert.match(pending.layers[0].detail,/exact visual state is not registered/i);

const ready=visual.fromResolution({productionReady:true,fallbackPolicy:'none',exactMatchRequired:true,layers:[{layerId:'base',state:'available',assetId:'MASTER',checksumSha256:'b'.repeat(64)}]},{vehicleKey:'y62'});
assert.equal(ready.mode,'ready');
assert.equal(ready.productionReady,true);
assert.equal(ready.counts.available,1);
assert.equal(ready.counts.missing,0);
assert.equal(ready.counts.blocked,0);

const ranger=visual.fromResolution(null,{vehicleKey:'ranger'});
assert.equal(ranger.mode,'unconfigured');
assert.equal(ranger.fallbackPolicy,'none');
assert.equal(ranger.exactMatchRequired,true);
assert.match(ranger.summary,/no stand-in vehicle artwork/i);
assert.deepEqual(ranger.layers,[]);

const coverage=visual.selectedCoverage([
  {id:'a',name:'A',visual:{status:'approved'}},
  {id:'b',name:'B',visual:{status:'priced-only'}},
  {id:'c',name:'C',visual:{status:'staff-review'}},
  {id:'d',name:'D',visual:{status:'blocked'}}
],p=>p.visual);
assert.equal(coverage.total,4);
assert.equal(coverage.counts.approved,1);
assert.equal(coverage.counts['priced-only'],1);
assert.equal(coverage.counts['staff-review'],1);
assert.equal(coverage.counts.blocked,1);

const moduleSource=fs.readFileSync(path.join(root,'customer-visual-state.js'),'utf8');
const app=fs.readFileSync(path.join(root,'merged-app.js'),'utf8');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
assert.doesNotMatch(moduleSource,/\bfetch\s*\(|localStorage|saveProject|createBuild|upsert|state\.selected/,'visual explainability must remain read-only and must not become backend/catalogue ownership');
assert.match(app,/PRO4X4_CUSTOMER_VISUAL_STATE/);
assert.match(app,/EXACT VISUAL STATE/);
assert.match(app,/BUILD VISUALS · PRODUCT READINESS/);
assert.match(app,/reference-only-not-production|layer\.reason/,'customer messaging must preserve the server resolver reason code');
assert.match(html,/id="visualStateExplain"/);
assert.match(html,/customer-visual-state\.js/);
assert.doesNotMatch(html,/y62-canonical-candidates\.js|y62-f34-reconstruction-brief\.js|y62-f34-overlay-review-contract\.js/,'customer entrypoint must not load draft/reference production tooling');
assert.doesNotMatch(app,/fallbackPolicy\s*:\s*['"]approx/i,'WF1 must not introduce approximate fallback');

console.log(JSON.stringify({wf:'WF1',package:'exact-visual-state-explainability',resolverStates:['available','missing','blocked'],rawReasonPreserved:true,referenceDraftSubstitution:false,rangerStandIn:false,customerVisualRule:visual.rule,status:'pass'},null,2));
