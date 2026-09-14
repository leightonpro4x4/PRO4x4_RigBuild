'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const review=require('../customer-handoff-review.js');
const receipt=require('../customer-handoff-receipt.js');

const snapshot={
  reference:'P4X4-WF1-VISUAL-HANDOFF',
  vehicle:{id:'y62',yearRange:'2025',make:'Nissan',model:'Patrol',trim:'Warrior'},
  lead:{name:'Visual QA',phone:'0400000000'},
  selections:[],gates:[],pricing:{currency:'AUD',knownSubtotal:0,isComplete:true,unpricedComponentCounts:{}},
  workflow:{status:'ready-to-quote'},catalogue:{revision:'Y62-QA'},
  render:{view:'front34',fallbackPolicy:'none',exactMatchRequired:true,productionReady:false,layers:[
    {layerId:'base',state:'available',assetId:'Y62-F34-V1-PROD',checksumSha256:'abc123'},
    {layerId:'bullbar',exactSku:'BB-Y62-001',state:'missing',reason:'reference-only-not-production',assetId:'REFERENCE-SHOULD-NOT-LEAK',checksumSha256:'refhash'},
    {layerId:'rearbar',exactSku:'RB-Y62-001',state:'blocked',reason:'fitment-blocked',assetId:'BLOCKED-SHOULD-NOT-LEAK'}
  ]}
};
const reviewModel=review.build(snapshot,{mode:'quote'});
assert.equal(reviewModel.visual.snapshotSource,'review-snapshot.render');
assert.equal(reviewModel.visual.layers.length,3);
assert.equal(reviewModel.visual.counts.available,1);
assert.equal(reviewModel.visual.counts.missing,1);
assert.equal(reviewModel.visual.counts.blocked,1);
assert.equal(reviewModel.visual.layers[0].assetId,'Y62-F34-V1-PROD','available exact asset identity may be retained');
assert.equal(reviewModel.visual.layers[1].reason,'reference-only-not-production');
assert.match(reviewModel.visual.layers[1].detail,/Reference evidence exists/i);
assert.equal(reviewModel.visual.layers[1].assetId,null,'reference-only asset identity must not leak into handoff production detail');
assert.equal(reviewModel.visual.layers[1].checksumSha256,null);
assert.equal(reviewModel.visual.layers[2].assetId,null,'blocked visual identity must not leak into customer handoff detail');
assert.equal(reviewModel.customerVisualRule,'REFERENCE_BACKED_APPROVED_VISUALS_ONLY');

snapshot.render.layers[1].reason='MUTATED-LIVE-STATE';
assert.equal(reviewModel.visual.layers[1].reason,'reference-only-not-production','captured review model must not read later mutable state');

const persisted=JSON.parse(JSON.stringify(snapshot));
persisted.render.layers[1].reason='production-asset-missing';
persisted.project={id:'P4X4-PROJ-VISUAL',revisionId:'R0013'};
const receiptModel=receipt.build(persisted,{mode:'quote',projectId:'P4X4-PROJ-VISUAL',revisionId:'R0013',queueReference:'P4X4-Y62-Q-001'});
assert.equal(receiptModel.visual.snapshotSource,'persisted-revision.render');
assert.equal(receiptModel.visual.layers[1].reason,'production-asset-missing','receipt must read the persisted revision visual reason');
assert.match(receiptModel.visual.layers[1].detail,/exact production asset/i);
assert.equal(receiptModel.visual.layers[1].assetId,null);
assert.ok(receiptModel.verification.some(x=>x.type==='visual'&&/Per-layer reasons below are read from this saved revision/i.test(x.detail)));

const root=path.join(__dirname,'..');
const app=fs.readFileSync(path.join(root,'merged-app.js'),'utf8');
const reviewSource=fs.readFileSync(path.join(root,'customer-handoff-review.js'),'utf8');
const receiptSource=fs.readFileSync(path.join(root,'customer-handoff-receipt.js'),'utf8');
assert.match(app,/EXACT VISUAL LAYERS IN THIS HANDOFF SNAPSHOT/);
assert.match(app,/PERSISTED VISUAL LAYERS ON THIS REVISION/);
assert.match(app,/renderHandoffVisualLayers\(model\.visual/);
assert.match(reviewSource,/visualSummary\(snapshot\.render\|\|\{\}\)/,'review detail must derive only from captured snapshot.render');
assert.match(receiptSource,/visualDetail\(snapshot\.render\|\|\{\}\)/,'receipt detail must derive only from persisted snapshot.render');
for(const src of [reviewSource,receiptSource]){
  assert.doesNotMatch(src,/state\.renderResolution|buildPayload\(|fetch\(|saveProject\(|createProject\(/,'handoff visual detail modules must not read mutable builder/backend persistence state');
  assert.doesNotMatch(src,/fallbackPolicy\s*:\s*['"]approx/i);
}
console.log('WF1 Alpha 26 immutable handoff visual-state detail: PASS');
