const assert=require('assert'),fs=require('fs'),path=require('path'),vm=require('vm');
const root=path.join(__dirname,'..');
function load(file,ctx={}){ctx.window=ctx;ctx.globalThis=ctx;vm.runInNewContext(fs.readFileSync(path.join(root,file),'utf8'),ctx,{filename:file});return ctx}
(function(){
 let c={};load('data-ranger.js',c);const d=c.RANGER_DATA;assert.ok(['0.26.4','0.26.5','0.26.6'].includes(d.schemaVersion));assert(d.accessories.length>=28);
 const bash=d.accessories.find(x=>x.sku==='BP-FRA-NG-22-ASM0');assert(bash);assert.equal(bash.price,420);assert.equal(bash.weightKg,5);assert.deepEqual(Array.from(bash.fitment.anyOfRequiredParts),['oa-predator','oa-toro-ranger']);
 const cam=d.accessories.find(x=>x.sku==='FB-FRA-NG-22-PR-ASM5');assert(cam);assert.equal(cam.price,165);assert.equal(cam.visual.visualLayerRequired,false);
 c={};load('product-visual-contract.js',c);const gate=c.PRO4X4_PRODUCT_VISUALS.selectionGate(bash,d.accessories,new Set());assert.equal(gate.allowed,false);assert.equal(gate.resolutionActions.filter(x=>x.type==='add').length,2);const gate2=c.PRO4X4_PRODUCT_VISUALS.selectionGate(bash,d.accessories,new Set(['oa-predator']));assert.equal(gate2.allowed,true);
 const app=fs.readFileSync(path.join(root,'merged-app.js'),'utf8');assert.match(app,/mp-resolution/);assert.match(app,/data-resolution/);
 const overlay=require('../y62-f34-overlay-review-contract');assert.equal(overlay.targetCanvas.width,1672);assert.equal(overlay.targetCanvas.height,615);assert.equal(overlay.customerExposure,'never-before-production-ready');assert.equal(overlay.assess(overlay.checks.map(x=>({id:x.id,result:'pass'}))).passed,true);
 const dbsrc=fs.readFileSync(path.join(root,'server/database.js'),'utf8');assert.match(dbsrc,/review_evidence_required/);assert.match(dbsrc,/reviewEvidence/);assert.match(dbsrc,/reviewedBy/);
 console.log('Alpha 26 parallel push 05: PASS');
})();
