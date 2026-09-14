'use strict';
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {RigDatabase}=require('../server/database');
const contract=require('../merged-project-contract');
const root=path.join(__dirname,'..');

function loadBrowser(file,ctx={}){ctx.window=ctx.window||ctx;ctx.globalThis=ctx;vm.runInNewContext(fs.readFileSync(path.join(root,file),'utf8'),ctx,{filename:file});return ctx}
const results=[];
function check(id,owner,description,fn){try{fn();results.push({id,owner,description,status:'pass'})}catch(error){results.push({id,owner,description,status:'fail',error:error?.message||String(error)})}}

check('WF1-BOM-ANYOF','WF1','Unsatisfied any-of fitment dependencies must survive into saved project/quote gates.',()=>{
  const c={};loadBrowser('data-ranger.js',c);const data=c.RANGER_DATA,bash=data.accessories.find(x=>x.sku==='BP-FRA-NG-22-ASM0');
  if(!bash)throw new Error('Ranger lower bash plate fixture missing');
  const snap=contract.buildSnapshot({data,selectedProducts:[bash],lead:{name:'QA'},reference:'P4X4-WF5-ANYOF'});
  if(!snap.selections[0]?.fitment?.anyOfRequiredParts?.length)throw new Error('anyOfRequiredParts metadata was lost from the saved BOM');
  const anyOfGate=(snap.gates||[]).find(g=>String(g.id||'').includes(bash.id)&&/depend|fitment|require/i.test(`${g.type||''} ${g.note||''}`));
  if(!anyOfGate)throw new Error('Saved BOM has an unsatisfied anyOfRequiredParts dependency but no project/quote gate; it can be queued as compatible after the supporting bar is removed.');
});

check('WF4-DIRECT-PRODUCTION-REVIEW','WF4','Every production path must require immutable reviewer identity + review timestamp, including direct production upsert.',()=>{
  const db=new RigDatabase(':memory:');
  try{
    let a=db.listRenderAssets({vehicleId:'nissan-y62-warrior-2025'}).find(x=>x.viewId==='front34'&&x.layerId==='base');
    if(!a)throw new Error('Y62 front34 base fixture missing');
    const sha='d'.repeat(64);
    db.attachAssetObject(a.assetId,{checksumSha256:sha,objectKey:'sha256/dd/wf5-direct-upsert.png',mimeType:'image/png',width:1672,height:615,hasAlpha:true,transparencyVerified:true,sizeBytes:999},{actor:{actorId:'wf5',displayName:'WF5',role:'admin'}});
    a=db.getRenderAsset(a.assetId);
    const unreviewed={...a,status:'production-ready',assetClass:'canonical-master',governance:{...(a.governance||{}),state:'master-approved',reviewedBy:null,reviewedAt:null},provenance:{...(a.provenance||{}),sourceType:'pro4x4-original',licenceStatus:'owned'},cameraGeometry:{...(a.cameraGeometry||{}),matched:true},approval:{...(a.approval||{}),state:'approved-production',approvedBy:null,approvedAt:null}};
    let rejected=false,code=null;
    try{db.upsertRenderAsset(unreviewed,{actor:{actorId:'wf5',displayName:'WF5',role:'admin'}})}catch(e){rejected=true;code=e?.code||null}
    if(!rejected)throw new Error('Direct production upsert accepted master-approved metadata with no governance.reviewedBy/reviewedAt, bypassing immutable review evidence.');
    if(code!=='review_evidence_required'&&code!=='asset_gate_blocked')throw new Error(`Unexpected rejection code ${code}`);
  }finally{db.close()}
});

check('WF5-CUSTOMER-DRAFT-ISOLATION','WF5','Customer entrypoint must not load reference-only/master-draft production candidates or fallback imagery.',()=>{
  const html=fs.readFileSync(path.join(root,'index.html'),'utf8'),contractSource=fs.readFileSync(path.join(root,'merged-project-contract.js'),'utf8');
  if(/y62-canonical-candidates\.js|y62-f34-reconstruction-brief\.js|y62-f34-overlay-review-contract\.js/.test(html))throw new Error('Customer entrypoint loads draft/reference visual-production tooling');
  if(!/fallbackPolicy:'none'/.test(contractSource))throw new Error('Customer snapshot no-fallback policy missing');
});

const failed=results.filter(x=>x.status==='fail');
console.log(JSON.stringify({gate:'wf5-alpha26-acceptance-gate',results,failed:failed.length,status:failed.length?'fail':'pass'},null,2));
if(failed.length)process.exitCode=1;
