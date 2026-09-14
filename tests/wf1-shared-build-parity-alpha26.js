'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const shared=require('../customer-shared-build.js');

const snapshot={
  reference:'P4X4-Y62-SHARE-PARITY',
  vehicle:{id:'nissan-patrol-y62-2025',yearRange:'2025',make:'Nissan',model:'Patrol',trim:'Warrior'},
  lead:{name:'Share QA'},
  selections:[
    {id:'rearbar',name:'Raslarr rear bar',brand:'Raslarr',sku:'RB-Y62-001',pricing:{parts:4100,labour:null},fitment:{conditions:['Factory towbar configuration must be confirmed before fitment.']}},
    {id:'bullbar',name:'SLX bullbar',brand:'SLX',sku:'BB-Y62-001',pricing:{parts:3600,labour:550},fitment:{}}
  ],
  pricing:{currency:'AUD',knownSubtotal:8250,isComplete:false,unpricedComponentCounts:{parts:0,labour:1,paint:0,freight:0,engineering:0}},
  weight:{knownAccessoryMassKg:96,unknownAccessoryMassCount:0},
  gates:[
    {type:'dependency-any-of',id:'rearbar:any-of',productId:'rearbar',requiredAnyOf:['towbar-a','towbar-b'],alternatives:[{id:'towbar-a',name:'Factory towbar'},{id:'towbar-b',name:'Approved replacement towbar'}],note:'Raslarr rear bar requires one verified towbar path.'},
    {type:'fitment-review',id:'rearbar',note:'Rear parking sensor arrangement requires PRO4X4 review.'}
  ],
  render:{view:'front34',fallbackPolicy:'none',exactMatchRequired:true,productionReady:false,layers:[
    {layerId:'base',state:'available',assetId:'Y62-F34-V1-PROD',checksumSha256:'prodhash'},
    {layerId:'bullbar',exactSku:'BB-Y62-001',state:'missing',reason:'reference-only-not-production',assetId:'REFERENCE-MUST-NOT-LEAK',checksumSha256:'refhash'},
    {layerId:'rearbar',exactSku:'RB-Y62-001',state:'blocked',reason:'fitment-blocked',assetId:'BLOCKED-MUST-NOT-LEAK'}
  ]},
  workflow:{status:'needs-fitment-review'},catalogue:{revision:'Y62-ALPHA26'}
};

const model=shared.build(snapshot,{projectId:'P4X4-PROJ-001',revisionId:'R0014',revisionChecksum:'check14',revisionCreatedAt:'2026-09-14T04:30:00+09:30',role:'customer-view'});
assert.equal(model.immutableSource,'resolved-share.revision.snapshot');
assert.equal(model.revisionId,'R0014');
assert.equal(model.gates.snapshotSource,'resolved-share.revision.snapshot.gates');
assert.equal(model.gates.blockingCount,1);
assert.equal(model.gates.reviewCount,1);
assert.deepEqual(model.gates.rows[0].requiredAnyOf,['towbar-a','towbar-b']);
assert.deepEqual(model.gates.rows[0].alternatives.map(x=>x.name),['Factory towbar','Approved replacement towbar']);
assert.equal(model.setupChecks.length,1);
assert.match(model.setupChecks[0].conditions[0],/Factory towbar configuration/i);
assert.equal(model.visual.snapshotSource,'resolved-share.revision.snapshot.render');
assert.equal(model.visual.counts.available,1);
assert.equal(model.visual.counts.missing,1);
assert.equal(model.visual.counts.blocked,1);
assert.equal(model.visual.layers[0].assetId,'Y62-F34-V1-PROD');
assert.equal(model.visual.layers[1].reason,'reference-only-not-production');
assert.match(model.visual.layers[1].detail,/Reference evidence exists/i);
assert.equal(model.visual.layers[1].assetId,null,'reference-only asset identity must not leak into shared production state');
assert.equal(model.visual.layers[1].checksumSha256,null);
assert.equal(model.visual.layers[2].assetId,null,'blocked asset identity must not leak into shared production state');
assert.equal(model.customerVisualRule,'REFERENCE_BACKED_APPROVED_VISUALS_ONLY');
assert.equal(model.visual.fallbackPolicy,'none');
assert.equal(model.visual.exactMatchRequired,true);

snapshot.gates[0].note='MUTATED LIVE GATE';
snapshot.render.layers[1].reason='MUTATED LIVE VISUAL';
snapshot.selections[0].fitment.conditions[0]='MUTATED LIVE CONDITION';
assert.match(model.gates.rows[0].note,/requires one verified towbar path/i,'shared gate model must remain detached from later mutable state');
assert.equal(model.visual.layers[1].reason,'reference-only-not-production','shared visual model must remain detached from later mutable state');
assert.match(model.setupChecks[0].conditions[0],/Factory towbar configuration/i,'shared setup checks must remain detached from later mutable state');

const root=path.join(__dirname,'..');
const shareJs=fs.readFileSync(path.join(root,'share.js'),'utf8');
const shareHtml=fs.readFileSync(path.join(root,'share.html'),'utf8');
const moduleSource=fs.readFileSync(path.join(root,'customer-shared-build.js'),'utf8');
assert.match(shareJs,/sharedModel\.build\(x,\{projectId:project\.id,revisionId:revision\.id/,'share view must build only from resolved revision.snapshot');
assert.match(shareJs,/IMMUTABLE FITMENT STATE/);
assert.match(shareJs,/EXACT PRODUCTION VISUAL STATE/);
assert.match(shareJs,/This share view does not re-evaluate fitment against a newer catalogue or mutable configurator state/);
assert.match(shareJs,/REVISION LOCKED/);
assert.doesNotMatch(shareJs,/currentRevisionId|state\.selected|state\.renderResolution|buildPayload\(/,'shared build must not read mutable configurator state or current project revision');
assert.doesNotMatch(shareJs,/<img\b/i,'shared parity package must not invent product/render imagery');
assert.match(shareHtml,/customer-visual-state\.js/);
assert.match(shareHtml,/customer-shared-build\.js/);
assert.ok(shareHtml.indexOf('customer-visual-state.js')<shareHtml.indexOf('customer-shared-build.js'));
assert.ok(shareHtml.indexOf('customer-shared-build.js')<shareHtml.indexOf('share.js'));
assert.doesNotMatch(moduleSource,/state\.renderResolution|currentRevisionId|buildPayload\(|fetch\(|saveProject|createProject|catalogue-store|asset-registry/i,'shared view model must stay read-only and revision-scoped');
assert.doesNotMatch(moduleSource,/fallbackPolicy\s*:\s*['"](?!none)/i,'shared view model must not introduce visual fallback');
console.log('WF1 Alpha 26 revision-locked shared-build parity: PASS');
