const assert=require('assert'),fs=require('fs'),path=require('path'),vm=require('vm');
const root=path.join(__dirname,'..');
function loadBrowser(file,ctx={}){ctx.window=ctx.window||ctx;ctx.globalThis=ctx;vm.runInNewContext(fs.readFileSync(path.join(root,file),'utf8'),ctx,{filename:file});return ctx;}
(function(){
  // WF3 — owner reference pack + canonical briefs
  let c=loadBrowser('y62-reference-pack.js',{});const pack=c.Y62_REFERENCE_PACK;
  assert.equal(pack.vehicleId,'nissan-y62-warrior-2025');assert.equal(pack.status,'reference-approved');assert.ok(pack.references.length>=8);assert.ok(pack.references.every(r=>r.sourceType==='owner-supplied'));assert.ok(pack.references.every(r=>/^[a-f0-9]{64}$/.test(r.sha256)));assert.ok(pack.gaps.some(g=>g.view==='side'));
  c=loadBrowser('y62-canonical-briefs.js',{});const briefs=c.Y62_CANONICAL_BRIEFS.briefs;for(const k of ['front34','side','rear34']){assert.equal(briefs[k].vehicleId,'nissan-y62-warrior-2025');assert.equal(briefs[k].background,'transparent');assert.equal(briefs[k].customerProductionRequires,'master-approved')}
  assert.equal(briefs.front34.briefId,'Y62-F34-V1');assert.equal(briefs.side.briefId,'Y62-SIDE-V1');assert.equal(briefs.rear34.briefId,'Y62-R34-V1');

  // WF2 — product visual readiness contract preserves review uncertainty.
  c=loadBrowser('product-visual-contract.js',{});const pv=c.PRO4X4_PRODUCT_VISUALS;
  const confirmed={id:'a',status:'confirmed',layer:'front',fitment:{reviewRequired:false},visual:{referenceAvailable:true}};const review={id:'b',status:'engineering',fitment:{reviewRequired:true}};
  assert.equal(pv.derive(confirmed,'v').status,'priced-only');assert.equal(pv.derive(review,'v').status,'staff-review');const data={vehicle:{id:'v'},accessories:[confirmed,review]};pv.applyDataset(data);assert.equal(data.visualContractVersion,'0.26.4');assert.equal(data.accessories[1].visual.fitmentConfidence,'review-required');

  // WF4 — new governance never treats raw reference or draft assets as production eligible.
  c=loadBrowser('visual-governance.js',{});const vg=c.PRO4X4_VISUAL_GOVERNANCE;
  assert.equal(vg.productionEligible({assetClass:'reference',governance:{state:'reference-approved'}}),false);
  assert.equal(vg.productionEligible({assetClass:'canonical-master',governance:{state:'master-draft'}}),false);
  assert.equal(vg.productionEligible({assetClass:'canonical-master',governance:{state:'master-approved'}}),true);
  assert.equal(vg.productionEligible({assetClass:'product-layer',governance:{state:'layer-draft'}}),false);
  assert.equal(vg.productionEligible({assetClass:'product-layer',governance:{state:'layer-approved'}}),true);

  // WF1 — actual merged UI contains vendor accordion + compatibility + visual-state contract integration.
  const app=fs.readFileSync(path.join(root,'merged-app.js'),'utf8'),css=fs.readFileSync(path.join(root,'merged.css'),'utf8'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
  assert.match(app,/merge-vendor/);assert.match(app,/preAddMessages/);assert.match(app,/PRO4X4_PRODUCT_VISUALS/);assert.match(css,/merge-vendor-products/);assert.match(html,/product-visual-contract\.js/);

  // WF5 — package governance loaded into single backbone, not a second project/runtime.
  const boardCtx=loadBrowser('workflow-board-data.js',{}),board=boardCtx.PRO4X4_WORKSTREAMS;assert.equal(board.principles.renderRule,'REFERENCE_BACKED_APPROVED_VISUALS_ONLY');assert.equal(board.workstreams.length,5);
  console.log('Alpha 26 parallel visual governance: PASS');
})();
