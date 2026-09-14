const assert=require('assert'),fs=require('fs'),path=require('path'),vm=require('vm');
const root=path.join(__dirname,'..');
function loadBrowser(file,ctx={}){ctx.window=ctx.window||ctx;ctx.globalThis=ctx;vm.runInNewContext(fs.readFileSync(path.join(root,file),'utf8'),ctx,{filename:file});return ctx;}
(function(){
  // WF1 — selected-build summary now exposes dependencies/open fitment notes.
  const app=fs.readFileSync(path.join(root,'merged-app.js'),'utf8');
  assert.match(app,/build-dependency/);assert.match(app,/OPEN FITMENT NOTE/);assert.match(app,/selectionGate/);

  // WF2 — source-backed Ranger expansion moved from 20 to 24 records and exact OA SKUs/RRPs are explicit.
  let c={};loadBrowser('data-ranger.js',c);const d=c.RANGER_DATA;assert(d.accessories.length>=24,'Push 03 Ranger baseline must retain its 24 verified records');assert.ok(['0.26.2','0.26.3','0.26.4','0.26.6'].includes(d.schemaVersion));
  const pred=d.accessories.find(x=>x.id==='oa-predator');assert.equal(pred.sku,'FB-FRA-NG-22-PR-ASM0');assert.equal(pred.price,3100);assert.equal(pred.status,'confirmed');
  const toro=d.accessories.find(x=>x.id==='oa-toro-ranger');assert.equal(toro.sku,'FB-FRA-NG-22-TOR-ASM0');assert.equal(toro.price,3770);assert.equal(toro.fitment.reviewRequired,false);
  const rear=d.accessories.find(x=>x.id==='oa-rear-protection-ranger');assert.equal(rear.price,1940);assert.equal(rear.fitment.reviewRequired,true);assert.ok(rear.fitment.conditions.some(x=>/factory tow bar/i.test(x)));
  c={};loadBrowser('ranger-source-evidence.js',c);assert(c.RANGER_SOURCE_EVIDENCE.sources.length>=5,'Push 03 source-evidence baseline must be retained');assert.ok(c.RANGER_SOURCE_EVIDENCE.sources.every(x=>x.sourceType==='manufacturer'));

  // WF3 — first actual F34 preflight attempt was reviewed and explicitly rejected rather than promoted.
  c={};loadBrowser('y62-canonical-candidate-review.js',c);const review=c.Y62_CANONICAL_CANDIDATE_REVIEW;assert.equal(review.briefId,'Y62-F34-V1');assert.equal(review.status,'rejected-preflight');assert.ok(review.findings.some(x=>x.gate==='transparent isolation'&&x.result==='fail'));assert.ok(fs.existsSync(path.join(root,review.attemptFile)));

  // WF4 — server persistence normalizes and filters visual governance, and production status cannot bypass approval state.
  const {RigDatabase}=require('../server/database');const db=new RigDatabase(':memory:');
  const base={schemaVersion:'0.26.2',assetId:'A26-GOV-TEST',vehicleId:'nissan-y62-warrior-2025',viewId:'front34',layerId:'base',exactSku:null,status:'candidate',assetClass:'canonical-master',renderState:{paintId:'black-obsidian'},provenance:{licenceStatus:'owned'},file:{checksumSha256:null,mimeType:null,width:1672,height:615,hasAlpha:null},cameraGeometry:{profileId:'Y62-F34-V1',matched:false},approval:{state:'not-reviewed'}};
  const saved=db.upsertRenderAsset(base,{actor:{actorId:'qa',displayName:'QA',role:'admin'}});assert.equal(saved.governance.state,'master-draft');assert.equal(db.listRenderAssets({governanceState:'master-draft'}).some(x=>x.assetId==='A26-GOV-TEST'),true);
  const governed={...base,status:'production-ready',governance:{state:'master-draft'}};assert.ok(db.productionProblems(governed,null).some(x=>/visual governance state master-draft is not production eligible/.test(x)));let blocked=false;try{db.upsertRenderAsset(governed,{actor:{actorId:'qa',displayName:'QA',role:'admin'}})}catch(e){blocked=e.code==='asset_gate_blocked'}assert.equal(blocked,true);db.close();

  // WF5 — rejected preflight remains outside governed production registry and the server is the enforcement boundary.
  const store=fs.readFileSync(path.join(root,'asset-registry-store.js'),'utf8');assert.equal(store.includes('preflight-rejected'),false);
  console.log('Alpha 26 parallel push 03: PASS');
})();
