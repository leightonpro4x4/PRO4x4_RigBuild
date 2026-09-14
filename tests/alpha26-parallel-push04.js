const assert=require('assert'),fs=require('fs'),path=require('path'),vm=require('vm');
const root=path.join(__dirname,'..');
function loadBrowser(file,ctx={}){ctx.window=ctx.window||ctx;ctx.globalThis=ctx;vm.runInNewContext(fs.readFileSync(path.join(root,file),'utf8'),ctx,{filename:file});return ctx;}
(function(){
  // WF1 — selected build exposes visual readiness and protects immutable sharing.
  const app=fs.readFileSync(path.join(root,'merged-app.js'),'utf8');
  const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
  assert.match(app,/BUILD VISUALS/);assert.match(app,/visualCounts/);assert.match(html,/id="visualSummary"/);
  assert.match(app,/UNSAVED CHANGES/);assert.match(app,/Save your latest changes before sharing/);
  assert.match(app,/build-dependency/);assert.match(app,/OPEN FITMENT NOTE/);

  // WF2 — source-backed Ranger catalogue reaches 26 without converting conditional fitment into certainty.
  let c={};loadBrowser('data-ranger.js',c);const d=c.RANGER_DATA;
  assert.ok(['0.26.3','0.26.4'].includes(d.schemaVersion));assert.ok(d.accessories.length>=26);
  const ausb=d.accessories.find(x=>x.sku==='SB-COM-MED-ASM0');assert(ausb);assert.equal(ausb.price,2675);assert.equal(ausb.weightKg,28);assert.equal(ausb.status,'confirmed');assert.ok(ausb.fitment.conditions.some(x=>/T-slot/i.test(x)));
  const adv=d.accessories.find(x=>x.sku==='ADVR-DC-COM-ASM0');assert(adv);assert.equal(adv.price,1365);assert.equal(adv.weightKg,24);assert.equal(adv.status,'engineering');assert.equal(adv.fitment.reviewRequired,true);
  c={};loadBrowser('ranger-source-evidence.js',c);assert.ok(c.RANGER_SOURCE_EVIDENCE.sources.length>=7);assert.ok(c.RANGER_SOURCE_EVIDENCE.sources.every(x=>x.sourceType==='manufacturer'));

  // WF3 — canonical reconstruction is governed as a brief, not a production asset.
  const recon=require('../y62-f34-reconstruction-brief.js');assert.equal(recon.briefId,'Y62-F34-V1-RECON');assert.equal(recon.target.canvas.width,1672);assert.equal(recon.target.canvas.height,615);assert.equal(recon.target.background,'transparent');assert.equal(recon.candidatePolicy.initialState,'master-draft');assert.ok(recon.requiredGates.some(x=>x.id==='governance'));assert.match(recon.sideEffect,/no production binary/i);

  // WF4 — persisted gate rejects master-draft even if every technical field is made valid.
  const {RigDatabase}=require('../server/database');const db=new RigDatabase(':memory:');
  const x={schemaVersion:'0.26.3',assetId:'PUSH04-MASTER',assetClass:'canonical-master',vehicleId:'nissan-y62-warrior-2025',viewId:'front34',layerId:'base',exactSku:null,status:'production-ready',renderState:{paintId:'black-obsidian'},governance:{state:'master-draft'},provenance:{licenceStatus:'owned'},file:{checksumSha256:'a'.repeat(64),mimeType:'image/png',width:1672,height:615,hasAlpha:true},vault:{stored:true,objectKey:'test',checksumSha256:'a'.repeat(64),transparencyVerified:true},cameraGeometry:{profileId:'Y62-F34-V1',matched:true}};
  const problems=db.productionProblems(x,{checksumSha256:'a'.repeat(64),transparencyVerified:true,width:1672,height:615});
  assert.ok(problems.some(p=>/master-draft is not production eligible/.test(p)));
  x.governance.state='master-approved';const approvedProblems=db.productionProblems(x,{checksumSha256:'a'.repeat(64),transparencyVerified:true,width:1672,height:615});assert.equal(approvedProblems.some(p=>/visual governance state/.test(p)),false);db.close();

  // WF5 — no reference/draft manifest is injected into customer page.
  assert.equal(html.includes('y62-canonical-candidates.js'),false);assert.equal(html.includes('y62-f34-reconstruction-brief.js'),false);
  console.log('Alpha 26 parallel push 04: PASS');
})();
