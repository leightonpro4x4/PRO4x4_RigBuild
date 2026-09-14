const assert=require('assert'),fs=require('fs'),path=require('path'),vm=require('vm');
const root=path.join(__dirname,'..');
function loadBrowser(file,ctx={}){ctx.window=ctx.window||ctx;ctx.globalThis=ctx;vm.runInNewContext(fs.readFileSync(path.join(root,file),'utf8'),ctx,{filename:file});return ctx;}
(function(){
  // WF2 contract: hard blockers, auto-add dependencies and coverage summary.
  let c=loadBrowser('product-visual-contract.js',{}),pv=c.PRO4X4_PRODUCT_VISUALS;
  const dep={id:'dep',name:'Required Bracket',status:'confirmed',fitment:{reviewRequired:false}};
  const conflicting={id:'old',name:'Existing Bar',status:'confirmed',fitment:{reviewRequired:false}};
  const item={id:'new',name:'New Bar',status:'confirmed',requires:['dep'],fitment:{reviewRequired:false,conflicts:['old']}};
  let gate=pv.selectionGate(item,[dep,conflicting,item],new Set(['old']));assert.equal(gate.allowed,false);assert.match(gate.blockers[0],/Conflicts with selected/);
  gate=pv.selectionGate(item,[dep,conflicting,item],new Set());assert.equal(gate.allowed,true);assert.deepEqual(gate.autoAdd,['dep']);
  const dataset={vehicle:{id:'v'},accessories:[dep,conflicting,item]};pv.applyDataset(dataset);assert.equal(dataset.visualContractVersion,'0.26.4');assert.equal(pv.coverageSummary(dataset).total,3);

  // WF3/WF4: owner references and governed canonical master slots are separated.
  c={};loadBrowser('visual-governance.js',c);loadBrowser('y62-reference-pack.js',c);loadBrowser('y62-canonical-briefs.js',c);
  c.PRO4X4_PERSISTENCE={local:{get(){return null},set(){}}};c.Y62_RENDER_MANIFEST={vehicleId:'nissan-y62-warrior-2025',sourceReview:{reviewedAt:'2026-09-13'},views:{front34:{layers:[]},side:{layers:[]},rear34:{layers:[]}}};
  loadBrowser('asset-registry-store.js',c);const reg=c.PRO4X4_ASSET_REGISTRY;
  const refs=reg.fromReferences(),slots=reg.canonicalSlots();assert.ok(refs.length>=8);assert.equal(slots.length,3);assert.ok(refs.every(x=>x.assetClass==='reference'&&x.governance.state==='reference-approved'));assert.ok(slots.every(x=>x.assetClass==='canonical-master'&&x.governance.state==='master-draft'&&x.source===null));assert.ok(slots.every(x=>c.PRO4X4_VISUAL_GOVERNANCE.productionEligible(x)===false));

  // WF1: UI honours selection gate rather than silently accepting invalid additions.
  const app=fs.readFileSync(path.join(root,'merged-app.js'),'utf8');assert.match(app,/selectionGate/);assert.match(app,/aria-disabled/);assert.match(app,/lastSelectionBlock/);

  // WF5: no fake completeness introduced by this push.
  assert.ok(slots.every(x=>!x.file.checksumSha256));assert.ok(slots.every(x=>x.approval.state==='not-reviewed'));
  console.log('Alpha 26 parallel push 02: PASS');
})();
