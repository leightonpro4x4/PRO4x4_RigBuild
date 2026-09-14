'use strict';
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const crypto=require('node:crypto');
const {RigDatabase}=require('../server/database');
const contract=require('../merged-project-contract');
const referencePack=require('../y62-reference-pack');
const canonicalBriefs=require('../y62-canonical-briefs');
const root=path.join(__dirname,'..');

function loadBrowser(file,ctx={}){ctx.window=ctx.window||ctx;ctx.globalThis=ctx;vm.runInNewContext(fs.readFileSync(path.join(root,file),'utf8'),ctx,{filename:file});return ctx}
const results=[];
function check(id,owner,description,fn){try{fn();results.push({id,owner,description,status:'pass'})}catch(error){results.push({id,owner,description,status:'fail',error:error?.message||String(error)})}}

check('WF1-BOM-ANYOF','WF1','Unsatisfied any-of fitment dependencies must survive into saved project/quote gates.',()=>{
  const c={};loadBrowser('data-ranger.js',c);const data=c.RANGER_DATA;
  const products=[
    data.accessories.find(x=>x.sku==='BP-FRA-NG-22-ASM0'),
    data.accessories.find(x=>x.sku==='ORA-ALO-S5D1-20')
  ];
  for(const p of products){
    if(!p)throw new Error('Ranger any-of dependency fixture missing');
    const snap=contract.buildSnapshot({data,selectedProducts:[p],lead:{name:'QA'},reference:`P4X4-WF5-ANYOF-${p.id}`});
    if(!snap.selections[0]?.fitment?.anyOfRequiredParts?.length)throw new Error(`${p.id}: anyOfRequiredParts metadata was lost from the saved BOM`);
    const anyOfGate=(snap.gates||[]).find(g=>String(g.id||'').includes(p.id)&&/depend|fitment|require/i.test(`${g.type||''} ${g.note||''}`));
    if(!anyOfGate)throw new Error(`${p.id}: saved BOM has an unsatisfied anyOfRequiredParts dependency but no project/quote gate; it can be queued as compatible after the supporting bar is removed.`);
  }
});


check('WF1-QUOTE-ANYOF','WF1','An orphaned any-of dependency must remain unresolved in the persisted sales/quote fitment review.',()=>{
  const c={};loadBrowser('data-ranger.js',c);const data=c.RANGER_DATA;
  const p=data.accessories.find(x=>x.sku==='BP-FRA-NG-22-ASM0');
  if(!p)throw new Error('Ranger lower-bash any-of fixture missing');
  const snap=contract.buildSnapshot({data,selectedProducts:[p],lead:{name:'QA'},reference:'P4X4-WF5-QUOTE-ANYOF'});
  const db=new RigDatabase(':memory:');
  try{
    const q=db.upsertQuote(snap,{actor:{actorId:'wf5-customer',displayName:'WF5 Customer',role:'customer'}});
    if(q.fitmentReview?.allApproved===true)throw new Error('Quote fitment review reports allApproved=true even though the selected product has no Predator/Toro support item.');
    const unresolved=(q.fitmentReview?.resolutions||[]).some(r=>r.status==='unresolved'&&/depend|fitment|require/i.test(`${r.type||''} ${r.sourceNote||''}`));
    if(!unresolved)throw new Error('Quote has no unresolved dependency/fitment resolution for the orphaned any-of requirement.');
  }finally{db.close()}
});

check('WF1-BOM-ANYOF-SATISFIED','WF1','A valid one-of support choice must satisfy the dependency without forcing every alternative.',()=>{
  const c={};loadBrowser('data-ranger.js',c);const data=c.RANGER_DATA;
  const p=data.accessories.find(x=>x.sku==='BP-FRA-NG-22-ASM0'),support=data.accessories.find(x=>x.id==='oa-predator');
  if(!p||!support)throw new Error('Ranger any-of positive-control fixtures missing');
  const snap=contract.buildSnapshot({data,selectedProducts:[support,p],lead:{name:'QA'},reference:'P4X4-WF5-ANYOF-SATISFIED'});
  const falseGate=(snap.gates||[]).find(g=>String(g.id||'').startsWith(`${p.id}:`)&&/toro/i.test(`${g.id||''} ${g.note||''}`));
  if(falseGate)throw new Error('A satisfied any-of dependency incorrectly requires the unselected Toro alternative as well.');
});

check('WF1-REMOVE-ANYOF','WF1','Removing the final supporting item must not strand an any-of dependent product as apparently compatible.',()=>{
  const app=fs.readFileSync(path.join(root,'merged-app.js'),'utf8');
  const helper=(app.match(/function productRequires\(p\)\{[^}]+\}/)||[])[0]||'';
  const removal=(app.match(/if\(state\.selected\.has\(id\)\)\{[\s\S]*?\}else\{/ )||[])[0]||'';
  if(/anyOfRequiredParts/.test(helper)) return;
  if(/anyOfRequiredParts|revalidate|selectionGate/.test(removal)) return;
  throw new Error('Removal cascade still only follows requires/requiredParts and does not revalidate fitment.anyOfRequiredParts; an orphaned dependent can remain selected.');
});

check('WF1-CONDITIONAL-FITMENT-GATE','WF1','Manufacturer fitment conditions shown to the customer must survive into the immutable project/quote gate until explicitly confirmed.',()=>{
  const c={};loadBrowser('data-ranger.js',c);const data=c.RANGER_DATA;
  const source=data.accessories.find(x=>x.id==='oa-ausb-sports-bar-ranger');
  if(!source||source.status!=='confirmed'||source.fitment?.reviewRequired||!source.fitment?.conditions?.length)throw new Error('Ranger confirmed conditional-fitment fixture missing');
  const product={...source,pricing:{parts:1,labour:1,paint:null,freight:null,engineering:null},pricingRequired:['parts','labour'],fitment:JSON.parse(JSON.stringify(source.fitment))};
  const snap=contract.buildSnapshot({data,selectedProducts:[product],lead:{name:'QA'},reference:'P4X4-WF5-CONDITIONAL-FITMENT'});
  const conditionGate=(snap.gates||[]).find(g=>String(g.id||'').includes(product.id)&&/condition|setup|fitment|confirm/i.test(`${g.type||''} ${g.note||''}`));
  if(conditionGate)return;
  const db=new RigDatabase(':memory:');
  try{
    const q=db.upsertQuote(snap,{actor:{actorId:'wf5-customer',displayName:'WF5 Customer',role:'customer'}});
    let finalised=false;
    try{finalised=db.finaliseQuote(q.reference,{actor:{actorId:'wf5-admin',displayName:'WF5 Admin',role:'admin'}})?.quoteFinalisation?.status==='finalised'}catch{}
    throw new Error(`Confirmed Ranger product ${product.id} carries manufacturer fitment.conditions but the immutable snapshot has no fitment/setup confirmation gate; quote fitmentReview.allApproved=${q.fitmentReview?.allApproved===true}${finalised?' and the formal quote can be finalised without confirming the vehicle setup':''}.`);
  }finally{db.close()}
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

check('WF4-DIRECT-PRODUCTION-EVIDENCE','WF4','If direct production upsert remains supported, it must create immutable review evidence equivalent to governed version promotion.',()=>{
  const db=new RigDatabase(':memory:');
  const actor={actorId:'wf5-admin',displayName:'WF5 Admin',role:'admin'};
  try{
    let a=db.listRenderAssets({vehicleId:'nissan-y62-warrior-2025'}).find(x=>x.viewId==='front34'&&x.layerId==='base');
    if(!a)throw new Error('Y62 front34 base fixture missing');
    const sha='e'.repeat(64);
    db.attachAssetObject(a.assetId,{checksumSha256:sha,objectKey:'sha256/ee/wf5-direct-reviewed.png',mimeType:'image/png',width:1672,height:615,hasAlpha:true,transparencyVerified:true,sizeBytes:1000},{actor});
    a=db.getRenderAsset(a.assetId);
    const reviewed={...a,status:'production-ready',assetClass:'canonical-master',governance:{...(a.governance||{}),state:'master-approved',reviewedBy:'wf5-reviewer',reviewedAt:'2026-09-13T22:00:00+09:30'},provenance:{...(a.provenance||{}),sourceType:'pro4x4-original',licenceStatus:'owned'},cameraGeometry:{...(a.cameraGeometry||{}),matched:true},approval:{...(a.approval||{}),state:'approved-production',approvedBy:'wf5-reviewer',approvedAt:'2026-09-13T22:01:00+09:30'}};
    let out=null,rejected=false,code=null;
    try{out=db.upsertRenderAsset(reviewed,{actor})}catch(e){rejected=true;code=e?.code||null}
    if(rejected){
      if(!['version_promotion_required','review_evidence_required','asset_gate_blocked'].includes(code))throw new Error(`Unexpected direct-production rejection code ${code}`);
      return;
    }
    const ev=out?.approval?.reviewEvidence;
    if(!ev||ev.reviewedBy!=='wf5-reviewer'||!ev.reviewedAt||ev.checksumSha256!==sha)throw new Error('Direct production upsert succeeded without checksum-pinned immutable approval.reviewEvidence.');
    const audit=db.listAudit({entityType:'render-asset',entityId:a.assetId,limit:20});
    const productionAudit=audit.find(e=>e.action==='render.asset.updated'&&e.metadata?.status==='production-ready');
    if(!productionAudit?.metadata?.reviewEvidence||productionAudit.metadata.reviewEvidence.reviewedBy!=='wf5-reviewer')throw new Error('Direct production upsert lacks immutable reviewer evidence in the production audit event.');
  }finally{db.close()}
});




check('WF4-REVIEWER-IDENTITY-AUTHENTICITY','WF4','Governed promotion must not trust a free-text reviewedBy value; reviewer identity must be bound to an authenticated/audited review transition for that exact candidate version.',()=>{
  const db=new RigDatabase(':memory:');
  const stager={actorId:'wf5-stager',displayName:'WF5 Stager',role:'admin'},editor={actorId:'wf5-editor',displayName:'WF5 Editor',role:'admin'},promoter={actorId:'wf5-promoter',displayName:'WF5 Promoter',role:'admin'};
  try{
    const assetId='WF5-FORGED-REVIEWER',exactSku='WF5-FORGED-REVIEWER-SKU',forgedReviewer='ghost-reviewer-never-authenticated';
    db.upsertRenderAsset({assetId,vehicleId:'nissan-y62-warrior-2025',viewId:'front34',layerId:'bullbar',exactSku,status:'asset-needed',assetClass:'product-layer',renderState:{},provenance:{sourceType:'pro4x4-original',licenceStatus:'owned'},file:{},vault:{},cameraGeometry:{profileId:'Y62-F34-V1',matched:false},approval:{state:'not-reviewed'},governance:{state:'layer-draft'}},{actor:stager});
    const staged=db.stageAssetVersion(assetId,{checksumSha256:'9'.repeat(64),objectKey:'sha256/99/wf5-forged-reviewer.png',mimeType:'image/png',width:1672,height:615,hasAlpha:true,transparencyVerified:true,sizeBytes:1260},{actor:stager});
    const claimedReviewed={...staged.payload,
      provenance:{...staged.payload.provenance,sourceType:'pro4x4-original',licenceStatus:'owned',licenceNote:'WF5 reviewer-authenticity negative fixture.'},
      cameraGeometry:{...staged.payload.cameraGeometry,matched:true,notes:'WF5 reviewer-authenticity negative fixture.'},
      governance:{...staged.payload.governance,state:'layer-approved',reviewedBy:forgedReviewer,reviewedAt:'2026-09-14T07:30:00+09:30'}
    };
    db.updateAssetVersion(assetId,staged.versionId,claimedReviewed,{actor:editor});
    let rejected=false,code=null,out=null;
    try{out=db.promoteAssetVersion(assetId,staged.versionId,{actor:promoter})}catch(e){rejected=true;code=e?.code||null}
    if(rejected){
      if(!['reviewer_identity_mismatch','review_evidence_required','review_audit_required','forbidden','asset_gate_blocked'].includes(code))throw new Error(`Unexpected forged-reviewer rejection code ${code}`);
      return;
    }
    const audit=db.listAudit({entityType:'render-asset',entityId:assetId,limit:50});
    const authenticatedReview=audit.find(e=>e.actor?.actorId===forgedReviewer&&e.metadata?.versionId===staged.versionId&&/review|approved/i.test(e.action||''));
    const ev=out?.asset?.approval?.reviewEvidence;
    if(ev?.reviewedBy===forgedReviewer&&!authenticatedReview){
      throw new Error(`Governed promotion accepted unauthenticated reviewer identity "${forgedReviewer}" from editable candidate metadata. The candidate was edited by ${editor.actorId} and promoted by ${promoter.actorId}, but no review audit exists for ${forgedReviewer}. Reviewer identity must be actor-bound/audited, not free text.`);
    }
  }finally{db.close()}
});

check('WF4-MASTER-REFERENCE-BACKING','WF4','A governed Y62 canonical master must not reach production without the locked owner/reference evidence set.',()=>{
  const db=new RigDatabase(':memory:');
  const actor={actorId:'wf5-reviewer',displayName:'WF5 Reviewer',role:'admin'};
  try{
    const a=db.listRenderAssets({vehicleId:'nissan-y62-warrior-2025'}).find(x=>x.viewId==='front34'&&x.layerId==='base');
    if(!a)throw new Error('Y62 front34 base fixture missing');
    const object={checksumSha256:'f'.repeat(64),objectKey:'sha256/ff/wf5-unbacked-master.png',mimeType:'image/png',width:1672,height:615,hasAlpha:true,transparencyVerified:true,sizeBytes:1001};
    const staged=db.stageAssetVersion(a.assetId,object,{actor});
    const reviewed={...staged.payload,
      provenance:{...staged.payload.provenance,sourceType:'pro4x4-original',licenceStatus:'owned',licenceNote:'WF5 negative fixture deliberately omits owner/reference IDs.',referenceIds:[]},
      cameraGeometry:{...staged.payload.cameraGeometry,matched:true,notes:'WF5 negative fixture marks camera matched to isolate the reference-backing gate.'},
      governance:{...staged.payload.governance,state:'master-approved',reviewedBy:'wf5-reviewer',reviewedAt:'2026-09-13T23:30:00+09:30'},
      approval:{...staged.payload.approval,notes:'Negative fixture: production must be refused without reference backing.'}
    };
    db.updateAssetVersion(a.assetId,staged.versionId,reviewed,{actor});
    let rejected=false,code=null,out=null;
    try{out=db.promoteAssetVersion(a.assetId,staged.versionId,{actor})}catch(e){rejected=true;code=e?.code||null}
    if(rejected){
      if(!['reference_evidence_required','asset_gate_blocked'].includes(code))throw new Error(`Unexpected missing-reference rejection code ${code}`);
      return;
    }
    const resolved=db.resolveProductionRenderStack({vehicleId:'nissan-y62-warrior-2025',viewId:'front34',requirements:[{layerId:'base',exactSku:null,state:{paintId:'black-obsidian'},stateKey:'paint:black-obsidian'}]});
    if(out?.asset?.status==='production-ready'&&resolved.layers?.[0]?.state==='available')throw new Error('Canonical master with no provenance.referenceIds was promoted and resolved as customer available, violating REFERENCE_BACKED_APPROVED_VISUALS_ONLY.');
  }finally{db.close()}
});

check('WF4-QUOTE-GATE-TRUST-BOUNDARY','WF4','Customer quote intake must not be able to remove fitment gates that are implied by the persisted BOM.',()=>{
  const c={};loadBrowser('data-ranger.js',c);const data=c.RANGER_DATA;
  const p=data.accessories.find(x=>x.id==='mcc-707-01');
  if(!p||p.status==='confirmed')throw new Error('Engineering-review Ranger fixture missing');
  const clean=contract.buildSnapshot({data,selectedProducts:[p],lead:{name:'QA'},reference:'P4X4-WF5-GATE-TRUST'});
  if(!(clean.gates||[]).some(g=>g.type==='fitment-review'))throw new Error('Control snapshot did not create a fitment-review gate');
  const tampered={...clean,gates:[],workflow:{...clean.workflow,status:'ready-to-quote'}};
  const db=new RigDatabase(':memory:');
  try{
    const q=db.upsertQuote(tampered,{actor:{actorId:'wf5-customer',displayName:'WF5 Customer',role:'customer'}});
    if(q.fitmentReview?.allApproved===true){
      let finalised=false;
      try{db.finaliseQuote(q.reference,{actor:{actorId:'wf5-admin',displayName:'WF5 Admin',role:'admin'}});finalised=true}catch(e){if(e?.code!=='quote_gate_blocked')throw e}
      if(finalised)throw new Error('Server trusted customer-supplied gates=[] and finalised a quote whose BOM still contains an engineering-review product. Fitment gates must be server-authoritative or recomputed from the immutable BOM.');
      throw new Error('Server trusted customer-supplied gates=[] and marked fitmentReview.allApproved=true; quote finalisation was only blocked by an unrelated condition.');
    }
  }finally{db.close()}
});


check('WF5-OWNER-REFERENCE-PACK-INTEGRITY','WF5','Locked owner Y62 reference records must resolve to the packaged files and retain exact SHA-256 provenance.',()=>{
  const refs=new Map(referencePack.references.map(r=>[r.id,r]));
  if(referencePack.vehicleId!=='nissan-y62-warrior-2025')throw new Error('Owner reference pack is bound to the wrong vehicle');
  for(const r of referencePack.references){
    if(r.rights!=='owner-project-approved')throw new Error(`${r.id}: owner reference rights drifted from owner-project-approved`);
    const file=path.join(root,r.file);
    if(!fs.existsSync(file))throw new Error(`${r.id}: packaged owner reference file is missing`);
    const sha=crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
    if(sha!==r.sha256)throw new Error(`${r.id}: packaged owner reference checksum does not match persisted provenance`);
  }
  for(const [view,brief] of Object.entries(canonicalBriefs.briefs||{})){
    if(brief.vehicleId!==referencePack.vehicleId)throw new Error(`${view}: canonical brief vehicle differs from owner reference pack`);
    if(!Array.isArray(brief.referenceIds)||!brief.referenceIds.length)throw new Error(`${view}: canonical brief has no governing references`);
    for(const id of brief.referenceIds){
      const r=refs.get(id);
      if(!r)throw new Error(`${view}: canonical brief references unknown evidence ${id}`);
      if(r.rights!=='owner-project-approved')throw new Error(`${view}: canonical brief reference ${id} lacks owner-project-approved rights`);
    }
  }
});

check('WF4-MASTER-REFERENCE-ID-VALIDITY','WF4','Canonical-master promotion must validate that every persisted provenance.referenceId resolves to approved reference evidence.',()=>{
  const db=new RigDatabase(':memory:');
  const actor={actorId:'wf5-reviewer',displayName:'WF5 Reviewer',role:'admin'};
  try{
    const a=db.listRenderAssets({vehicleId:'nissan-y62-warrior-2025'}).find(x=>x.viewId==='front34'&&x.layerId==='base');
    if(!a)throw new Error('Y62 front34 base fixture missing');
    const object={checksumSha256:'a'.repeat(64),objectKey:'sha256/aa/wf5-invalid-reference-id.png',mimeType:'image/png',width:1672,height:615,hasAlpha:true,transparencyVerified:true,sizeBytes:1002};
    const staged=db.stageAssetVersion(a.assetId,object,{actor});
    const reviewed={...staged.payload,
      provenance:{...staged.payload.provenance,sourceType:'reference-derived-canonical',licenceStatus:'owned',licenceNote:'WF5 negative fixture uses a non-existent persisted reference ID.',referenceIds:['OWNER-Y62-NOT-A-REAL-REFERENCE']},
      cameraGeometry:{...staged.payload.cameraGeometry,matched:true,notes:'WF5 negative fixture isolates reference-ID validation.'},
      governance:{...staged.payload.governance,state:'master-approved',reviewedBy:'wf5-reviewer',reviewedAt:'2026-09-14T00:30:00+09:30'},
      approval:{...staged.payload.approval,notes:'Negative fixture: invalid reference IDs must block promotion.'}
    };
    db.updateAssetVersion(a.assetId,staged.versionId,reviewed,{actor});
    let rejected=false,code=null,out=null;
    try{out=db.promoteAssetVersion(a.assetId,staged.versionId,{actor})}catch(e){rejected=true;code=e?.code||null}
    if(rejected){
      if(!['reference_evidence_required','reference_evidence_invalid','asset_gate_blocked'].includes(code))throw new Error(`Unexpected invalid-reference rejection code ${code}`);
      return;
    }
    const resolved=db.resolveProductionRenderStack({vehicleId:'nissan-y62-warrior-2025',viewId:'front34',requirements:[{layerId:'base',exactSku:null,state:{paintId:'black-obsidian'},stateKey:'paint:black-obsidian'}]});
    if(out?.asset?.status==='production-ready'&&resolved.layers?.[0]?.state==='available')throw new Error('Canonical master with a non-existent provenance.referenceId was promoted and resolved customer-available. Reference backing must be validated, not merely non-empty.');
  }finally{db.close()}
});

check('WF4-MASTER-BRIEF-REFERENCE-BINDING','WF4','A Y62 F34 canonical master must retain the governing F34 canonical-brief evidence, not unrelated valid owner references.',()=>{
  const db=new RigDatabase(':memory:');
  const actor={actorId:'wf5-reviewer',displayName:'WF5 Reviewer',role:'admin'};
  try{
    const a=db.listRenderAssets({vehicleId:'nissan-y62-warrior-2025'}).find(x=>x.viewId==='front34'&&x.layerId==='base');
    if(!a)throw new Error('Y62 front34 base fixture missing');
    const wrongRefs=['OWNER-Y62-REAR34-01','OWNER-Y62-REAR-01'];
    if(wrongRefs.some(id=>!referencePack.references.some(r=>r.id===id&&r.rights==='owner-project-approved')))throw new Error('Negative fixture owner references are not valid approved evidence');
    const object={checksumSha256:'b'.repeat(64),objectKey:'sha256/bb/wf5-wrong-brief-references.png',mimeType:'image/png',width:1672,height:615,hasAlpha:true,transparencyVerified:true,sizeBytes:1003};
    const staged=db.stageAssetVersion(a.assetId,object,{actor});
    const reviewed={...staged.payload,
      provenance:{...staged.payload.provenance,sourceType:'reference-derived-canonical',licenceStatus:'owned',licenceNote:'WF5 negative fixture deliberately substitutes rear-view evidence for the F34 governing brief.',referenceIds:wrongRefs},
      cameraGeometry:{...staged.payload.cameraGeometry,matched:true,notes:'WF5 negative fixture isolates canonical brief/reference binding.'},
      governance:{...staged.payload.governance,state:'master-approved',reviewedBy:'wf5-reviewer',reviewedAt:'2026-09-14T00:35:00+09:30'},
      approval:{...staged.payload.approval,notes:'Negative fixture: wrong-view evidence must not satisfy Y62-F34-V1.'}
    };
    db.updateAssetVersion(a.assetId,staged.versionId,reviewed,{actor});
    let rejected=false,code=null,out=null;
    try{out=db.promoteAssetVersion(a.assetId,staged.versionId,{actor})}catch(e){rejected=true;code=e?.code||null}
    if(rejected){
      if(!['canonical_brief_mismatch','reference_evidence_invalid','reference_evidence_required','asset_gate_blocked'].includes(code))throw new Error(`Unexpected canonical-brief rejection code ${code}`);
      return;
    }
    const required=new Set(canonicalBriefs.briefs.front34.referenceIds);
    const retained=out?.asset?.provenance?.referenceIds||[];
    const missing=[...required].filter(id=>!retained.includes(id));
    const resolved=db.resolveProductionRenderStack({vehicleId:'nissan-y62-warrior-2025',viewId:'front34',requirements:[{layerId:'base',exactSku:null,state:{paintId:'black-obsidian'},stateKey:'paint:black-obsidian'}]});
    if(missing.length&&resolved.layers?.[0]?.state==='available')throw new Error(`Y62-F34-V1 promoted with unrelated owner references and omitted governing F34 evidence: ${missing.join(', ')}`);
  }finally{db.close()}
});


check('WF4-PRODUCTION-BINARY-IMMUTABILITY','WF4','A promoted production asset binary must remain checksum-pinned to its reviewed immutable version; replacing the binary requires a new governed version/review.',()=>{
  const db=new RigDatabase(':memory:');
  const actor={actorId:'wf5-reviewer',displayName:'WF5 Reviewer',role:'admin'};
  try{
    const a=db.listRenderAssets({vehicleId:'nissan-y62-warrior-2025'}).find(x=>x.viewId==='front34'&&x.layerId==='base');
    if(!a)throw new Error('Y62 front34 base fixture missing');
    const approvedChecksum='a'.repeat(64),replacementChecksum='b'.repeat(64);
    const staged=db.stageAssetVersion(a.assetId,{checksumSha256:approvedChecksum,objectKey:'sha256/aa/wf5-approved-immutable.png',mimeType:'image/png',width:1672,height:615,hasAlpha:true,transparencyVerified:true,sizeBytes:1100},{actor});
    const reviewed={...staged.payload,
      provenance:{...staged.payload.provenance,sourceType:'reference-derived-canonical',licenceStatus:'owned',licenceNote:'WF5 immutable-binary positive control.',referenceIds:[...canonicalBriefs.briefs.front34.referenceIds]},
      cameraGeometry:{...staged.payload.cameraGeometry,matched:true,notes:'WF5 immutable-binary positive control.'},
      governance:{...staged.payload.governance,state:'master-approved',reviewedBy:'wf5-reviewer',reviewedAt:'2026-09-14T03:15:00+09:30'}
    };
    db.updateAssetVersion(a.assetId,staged.versionId,reviewed,{actor});
    const promoted=db.promoteAssetVersion(a.assetId,staged.versionId,{actor});
    if(promoted.asset?.approval?.reviewEvidence?.checksumSha256!==approvedChecksum)throw new Error('Positive-control promoted review evidence is not checksum-pinned');
    let rejected=false,code=null;
    try{
      db.attachAssetObject(a.assetId,{checksumSha256:replacementChecksum,objectKey:'sha256/bb/wf5-unreviewed-replacement.png',mimeType:'image/png',width:1672,height:615,hasAlpha:true,transparencyVerified:true,sizeBytes:1101},{actor});
    }catch(e){rejected=true;code=e?.code||null}
    if(rejected){
      if(!['production_asset_immutable','version_promotion_required','asset_version_required','conflict','asset_gate_blocked'].includes(code))throw new Error(`Unexpected production-binary replacement rejection code ${code}`);
      return;
    }
    const after=db.getRenderAsset(a.assetId),version=db.getAssetVersion(a.assetId,staged.versionId);
    const resolved=db.resolveProductionRenderStack({vehicleId:'nissan-y62-warrior-2025',viewId:'front34',requirements:[{layerId:'base',exactSku:null,state:{paintId:'black-obsidian'},stateKey:'paint:black-obsidian'}]});
    const layer=resolved.layers?.[0];
    if(layer?.state==='available'&&layer?.checksumSha256===replacementChecksum){
      const reviewChecksum=after?.approval?.reviewEvidence?.checksumSha256||null;
      const immutableVersionChecksum=version?.checksumSha256||null;
      throw new Error(`Unreviewed replacement binary became customer available under the existing production lineage. Active=${replacementChecksum.slice(0,12)}…, reviewEvidence=${String(reviewChecksum).slice(0,12)}…, version=${String(immutableVersionChecksum).slice(0,12)}…. Production binary changes must stage a new immutable version and pass review before resolver admission.`);
    }
    if(layer?.state==='available'&&layer?.checksumSha256!==approvedChecksum)throw new Error('Customer resolver serves a production checksum that is not the reviewed immutable checksum.');
  }finally{db.close()}
});

check('WF4-PRODUCTION-IDENTITY-IMMUTABILITY','WF4','A reviewed production version must remain bound to the exact vehicle/view/layer/SKU identity it was approved for; direct retargeting requires a new governed candidate/review.',()=>{
  const db=new RigDatabase(':memory:');
  const actor={actorId:'wf5-reviewer',displayName:'WF5 Reviewer',role:'admin'};
  try{
    const assetId='WF5-PRODUCTION-IDENTITY',originalSku='WF5-IDENTITY-SKU-A',retargetSku='WF5-IDENTITY-SKU-B';
    db.upsertRenderAsset({assetId,vehicleId:'nissan-y62-warrior-2025',viewId:'front34',layerId:'bullbar',exactSku:originalSku,status:'asset-needed',assetClass:'product-layer',renderState:{},provenance:{sourceType:'pro4x4-original',licenceStatus:'owned'},file:{},vault:{},cameraGeometry:{profileId:'Y62-F34-V1',matched:false},approval:{state:'not-reviewed'},governance:{state:'layer-draft'}},{actor});
    const staged=db.stageAssetVersion(assetId,{checksumSha256:'7'.repeat(64),objectKey:'sha256/77/wf5-production-identity.png',mimeType:'image/png',width:1672,height:615,hasAlpha:true,transparencyVerified:true,sizeBytes:1250},{actor});
    db.updateAssetVersion(assetId,staged.versionId,{...staged.payload,
      provenance:{...staged.payload.provenance,sourceType:'pro4x4-original',licenceStatus:'owned',licenceNote:'WF5 exact-SKU production identity positive control.'},
      cameraGeometry:{...staged.payload.cameraGeometry,matched:true,notes:'WF5 exact-SKU production identity positive control.'},
      governance:{...staged.payload.governance,state:'layer-approved',reviewedBy:'wf5-reviewer',reviewedAt:'2026-09-14T06:20:00+09:30'}
    },{actor});
    const promoted=db.promoteAssetVersion(assetId,staged.versionId,{actor});
    if(promoted.asset?.exactSku!==originalSku||promoted.version?.payload?.exactSku!==originalSku)throw new Error('Positive-control production version was not bound to the original exact SKU.');
    const before=db.resolveProductionRenderStack({vehicleId:'nissan-y62-warrior-2025',viewId:'front34',requirements:[{layerId:'bullbar',exactSku:originalSku,state:{}}]});
    if(before.layers?.[0]?.state!=='available')throw new Error('Positive-control production layer did not resolve available for its reviewed exact SKU.');

    let rejected=false,code=null;
    try{db.upsertRenderAsset({...promoted.asset,exactSku:retargetSku},{actor})}catch(e){rejected=true;code=e?.code||null}
    if(rejected){
      if(!['production_asset_immutable','version_promotion_required','asset_identity_immutable','asset_version_required','conflict','asset_gate_blocked'].includes(code))throw new Error(`Unexpected production-identity mutation rejection code ${code}`);
      return;
    }

    const active=db.getRenderAsset(assetId),version=db.getAssetVersion(assetId,staged.versionId);
    const oldResolution=db.resolveProductionRenderStack({vehicleId:'nissan-y62-warrior-2025',viewId:'front34',requirements:[{layerId:'bullbar',exactSku:originalSku,state:{}}]});
    const newResolution=db.resolveProductionRenderStack({vehicleId:'nissan-y62-warrior-2025',viewId:'front34',requirements:[{layerId:'bullbar',exactSku:retargetSku,state:{}}]});
    if(active?.exactSku!==originalSku||version?.payload?.exactSku!==originalSku||oldResolution.layers?.[0]?.state!=='available'||newResolution.layers?.[0]?.state==='available'){
      throw new Error(`Reviewed production identity was retargeted without a new governed version/review. Active SKU=${active?.exactSku||'none'}, immutable version SKU=${version?.payload?.exactSku||'none'}, old state=${oldResolution.layers?.[0]?.state||'none'}, new state=${newResolution.layers?.[0]?.state||'none'}. Exact-SKU approval lineage must be immutable.`);
    }
  }finally{db.close()}
});

check('WF4-CANDIDATE-EVIDENCE-RESET','WF4','A newly staged replacement binary must start with clean per-version provenance/review evidence rather than inheriting approval bindings from the active production binary.',()=>{
  const db=new RigDatabase(':memory:');
  const actor={actorId:'wf5-reviewer',displayName:'WF5 Reviewer',role:'admin'};
  try{
    const a=db.listRenderAssets({vehicleId:'nissan-y62-warrior-2025'}).find(x=>x.viewId==='front34'&&x.layerId==='base');
    if(!a)throw new Error('Y62 front34 base fixture missing');
    const firstChecksum='3'.repeat(64),secondChecksum='4'.repeat(64);
    const v1=db.stageAssetVersion(a.assetId,{checksumSha256:firstChecksum,objectKey:'sha256/33/wf5-evidence-reset-v1.png',mimeType:'image/png',width:1672,height:615,hasAlpha:true,transparencyVerified:true,sizeBytes:1200},{actor});
    const v1Reviewed={...v1.payload,
      provenance:{...v1.payload.provenance,sourceType:'reference-derived-canonical',licenceStatus:'owned',licenceNote:'WF5 evidence-reset positive control V1.',referenceIds:[...canonicalBriefs.briefs.front34.referenceIds]},
      cameraGeometry:{...v1.payload.cameraGeometry,matched:true,notes:'WF5 evidence-reset positive control V1.'},
      governance:{...v1.payload.governance,state:'master-approved',reviewedBy:'wf5-reviewer',reviewedAt:'2026-09-14T04:10:00+09:30'}
    };
    db.updateAssetVersion(a.assetId,v1.versionId,v1Reviewed,{actor});
    const promoted=db.promoteAssetVersion(a.assetId,v1.versionId,{actor});
    if(promoted.asset?.approval?.reviewEvidence?.checksumSha256!==firstChecksum)throw new Error('Positive-control V1 did not receive checksum-pinned review evidence');
    const v2=db.stageAssetVersion(a.assetId,{checksumSha256:secondChecksum,objectKey:'sha256/44/wf5-evidence-reset-v2.png',mimeType:'image/png',width:1672,height:615,hasAlpha:true,transparencyVerified:true,sizeBytes:1201},{actor});
    const resolved=db.resolveProductionRenderStack({vehicleId:'nissan-y62-warrior-2025',viewId:'front34',requirements:[{layerId:'base',exactSku:null,state:{paintId:'black-obsidian'},stateKey:'paint:black-obsidian'}]});
    if(resolved.layers?.[0]?.checksumSha256!==firstChecksum)throw new Error('Staging V2 changed active customer production output before promotion');
    const inheritedReview=v2.payload?.approval?.reviewEvidence||null;
    const inheritedRefs=Array.isArray(v2.payload?.provenance?.referenceIds)?v2.payload.provenance.referenceIds:[];
    if(inheritedReview||inheritedRefs.length){
      throw new Error(`New candidate V2 inherited stale V1 evidence (${inheritedReview?`review checksum ${String(inheritedReview.checksumSha256).slice(0,12)}…`: 'no review evidence'}; ${inheritedRefs.length} reference IDs). A replacement binary must begin with reviewEvidence cleared and referenceIds explicitly re-bound for that binary/version.`);
    }
  }finally{db.close()}
});

check('WF4-BLOCKED-FITMENT-PRECEDENCE','WF4','An exact active blocked-fitment declaration must override a previously approved production binary for the same vehicle/view/layer/SKU/state.',()=>{
  const db=new RigDatabase(':memory:');
  const actor={actorId:'wf5-admin',displayName:'WF5 Admin',role:'admin'};
  try{
    const assetId='WF5-BLOCK-PRECEDENCE-PROD',exactSku='WF5-BLOCK-PRECEDENCE-SKU',state={paintId:'black-obsidian'};
    db.upsertRenderAsset({assetId,vehicleId:'nissan-y62-warrior-2025',viewId:'front34',layerId:'bullbar',exactSku,status:'asset-needed',assetClass:'product-layer',renderState:state,provenance:{sourceType:'pro4x4-original',licenceStatus:'owned'},file:{},vault:{},cameraGeometry:{profileId:'Y62-F34-V1',matched:false},approval:{state:'not-reviewed'},governance:{state:'layer-draft'}},{actor});
    const staged=db.stageAssetVersion(assetId,{checksumSha256:'5'.repeat(64),objectKey:'sha256/55/wf5-block-precedence-prod.png',mimeType:'image/png',width:1672,height:615,hasAlpha:true,transparencyVerified:true,sizeBytes:1300},{actor});
    db.updateAssetVersion(assetId,staged.versionId,{...staged.payload,provenance:{...staged.payload.provenance,sourceType:'pro4x4-original',licenceStatus:'owned'},cameraGeometry:{...staged.payload.cameraGeometry,matched:true},governance:{...staged.payload.governance,state:'layer-approved',reviewedBy:'wf5-reviewer',reviewedAt:'2026-09-14T05:15:00+09:30'}},{actor});
    db.promoteAssetVersion(assetId,staged.versionId,{actor});
    const before=db.resolveProductionRenderStack({vehicleId:'nissan-y62-warrior-2025',viewId:'front34',requirements:[{layerId:'bullbar',exactSku,state}]});
    if(before.layers?.[0]?.state!=='available')throw new Error('Positive-control governed production layer did not resolve available before fitment block was registered.');
    db.upsertRenderAsset({assetId:'WF5-BLOCK-PRECEDENCE-HOLD',vehicleId:'nissan-y62-warrior-2025',viewId:'front34',layerId:'bullbar',exactSku,status:'blocked-fitment',assetClass:'product-layer',renderState:state,provenance:{sourceType:'unknown',licenceStatus:'unknown'},file:{},vault:{},cameraGeometry:{profileId:'Y62-F34-V1',matched:false},approval:{state:'not-reviewed'},governance:{state:'blocked'},fitmentScope:['nissan-y62-warrior-2025',exactSku],history:[{at:'2026-09-14T05:16:00+09:30',action:'fitment.blocked',note:'WF5 negative fixture: exact SKU/state is actively blocked pending engineering review.'}]},{actor});
    const after=db.resolveProductionRenderStack({vehicleId:'nissan-y62-warrior-2025',viewId:'front34',requirements:[{layerId:'bullbar',exactSku,state}]});
    const layer=after.layers?.[0];
    if(layer?.state==='available')throw new Error(`Resolver returned customer available from ${layer.assetId} even though an exact blocked-fitment declaration exists for the same vehicle/view/layer/SKU/state. Safety/fitment block must outrank stale production-ready visual availability.`);
    if(layer?.state!=='blocked')throw new Error(`Expected exact blocked-fitment state after block registration, got ${layer?.state||'none'} (${layer?.reason||'no reason'}).`);
  }finally{db.close()}
});

check('WF4-RENDER-STATE-EXACTNESS','WF4','Stateful production layers must require an explicit exact render state; omitting state must never select an arbitrary approved variant.',()=>{
  const db=new RigDatabase(':memory:');
  const actor={actorId:'wf5-state-admin',displayName:'WF5 State Admin',role:'admin'};
  try{
    const assetId='WF5-STATE-EXACT-WHEELS',exactSku='WF5-STATE-EXACT-SKU',wheelTyreId='wf5-bronze-state';
    db.upsertRenderAsset({assetId,vehicleId:'nissan-y62-warrior-2025',viewId:'front34',layerId:'wheels',exactSku,status:'asset-needed',assetClass:'product-layer',renderState:{wheelTyreId},provenance:{sourceType:'pro4x4-original',licenceStatus:'owned'},file:{},vault:{},cameraGeometry:{profileId:'Y62-F34-V1',matched:false},approval:{state:'not-reviewed'},governance:{state:'layer-draft'}},{actor});
    const staged=db.stageAssetVersion(assetId,{checksumSha256:'7'.repeat(64),objectKey:'sha256/77/wf5-state-exact.png',mimeType:'image/png',width:1672,height:615,hasAlpha:true,transparencyVerified:true,sizeBytes:1270},{actor});
    const reviewed={...staged.payload,
      provenance:{...staged.payload.provenance,sourceType:'pro4x4-original',licenceStatus:'owned',licenceNote:'WF5 exact-state negative fixture.'},
      cameraGeometry:{...staged.payload.cameraGeometry,matched:true,notes:'WF5 exact-state negative fixture.'},
      governance:{...staged.payload.governance,state:'layer-approved',reviewedBy:'WF5 State Reviewer',reviewedAt:'2026-09-14T09:20:00+09:30'}
    };
    db.updateAssetVersion(assetId,staged.versionId,reviewed,{actor});
    const promoted=db.promoteAssetVersion(assetId,staged.versionId,{actor});
    if(promoted.asset?.status!=='production-ready')throw new Error('Exact-state positive-control asset did not promote');
    const exact=db.resolveProductionRenderStack({vehicleId:'nissan-y62-warrior-2025',viewId:'front34',requirements:[{layerId:'wheels',exactSku,state:{wheelTyreId},stateKey:`wheelTyreId:${wheelTyreId}`}]});
    if(exact.layers?.[0]?.state!=='available')throw new Error('Exact-state positive-control did not resolve available');
    let omitted=null,rejected=false,code=null;
    try{omitted=db.resolveProductionRenderStack({vehicleId:'nissan-y62-warrior-2025',viewId:'front34',requirements:[{layerId:'wheels',exactSku,state:{},stateKey:null}]})}catch(e){rejected=true;code=e?.code||null}
    if(rejected){
      if(!['validation_error','render_state_required'].includes(code))throw new Error(`Unexpected missing-state rejection code ${code}`);
      return;
    }
    const layer=omitted?.layers?.[0];
    if(layer?.state==='available')throw new Error(`Resolver selected approved state ${promoted.asset?.renderState?.wheelTyreId||'(unknown)'} even though the request omitted wheelTyreId. Exact-state policy must reject or return missing when a stateful layer request is underspecified.`);
    if(layer?.state!=='missing')throw new Error(`Expected underspecified stateful layer to reject or resolve missing, got ${layer?.state||'none'}.`);
  }finally{db.close()}
});

check('WF4-PRODUCTION-TUPLE-UNIQUENESS','WF4','Only one production-ready asset may own an exact vehicle/view/layer/SKU/render-state tuple; duplicate governed masters/layers must be rejected, superseded, or resolved as ambiguous rather than arbitrarily selected.',()=>{
  const db=new RigDatabase(':memory:');
  const actor={actorId:'wf5-tuple-admin',displayName:'WF5 Tuple Admin',role:'admin'};
  try{
    const exactSku='WF5-DUPLICATE-TUPLE-SKU',vehicleId='nissan-y62-warrior-2025',viewId='front34',layerId='bullbar';
    const promote=(assetId,checksumChar,reviewedAt)=>{
      db.upsertRenderAsset({assetId,vehicleId,viewId,layerId,exactSku,status:'asset-needed',assetClass:'product-layer',renderState:{},provenance:{sourceType:'unknown',licenceStatus:'unknown'},file:{},vault:{},cameraGeometry:{profileId:'Y62-F34-V1',matched:false},approval:{state:'not-reviewed'},governance:{state:'layer-draft'}},{actor});
      const staged=db.stageAssetVersion(assetId,{checksumSha256:checksumChar.repeat(64),objectKey:`sha256/${checksumChar}${checksumChar}/${assetId}.png`,mimeType:'image/png',width:1672,height:615,hasAlpha:true,transparencyVerified:true,sizeBytes:1280},{actor});
      const reviewed={...staged.payload,
        provenance:{...staged.payload.provenance,sourceType:'pro4x4-original',licenceStatus:'owned',licenceNote:'WF5 exact production-tuple uniqueness fixture.'},
        cameraGeometry:{...staged.payload.cameraGeometry,matched:true,notes:'WF5 exact production-tuple uniqueness fixture.'},
        governance:{...staged.payload.governance,state:'layer-approved',reviewedBy:'WF5 Tuple Reviewer',reviewedAt}
      };
      db.updateAssetVersion(assetId,staged.versionId,reviewed,{actor});
      return db.promoteAssetVersion(assetId,staged.versionId,{actor});
    };
    const first=promote('WF5-DUPLICATE-TUPLE-A','8','2026-09-14T10:05:00+09:30');
    if(first.asset?.status!=='production-ready')throw new Error('Positive-control first tuple owner did not promote');
    let second=null,rejected=false,code=null;
    try{second=promote('WF5-DUPLICATE-TUPLE-B','9','2026-09-14T10:06:00+09:30')}catch(e){rejected=true;code=e?.code||null}
    if(rejected){
      if(!['production_tuple_conflict','asset_gate_blocked','duplicate_production_tuple'].includes(code))throw new Error(`Unexpected duplicate-tuple rejection code ${code}`);
      return;
    }
    const active=db.listRenderAssets({vehicleId,viewId}).filter(a=>a.layerId===layerId&&a.exactSku===exactSku&&a.status==='production-ready'&&Object.keys(a.renderState||{}).length===0);
    if(active.length<=1)return;
    const resolved=db.resolveProductionRenderStack({vehicleId,viewId,requirements:[{layerId,exactSku,state:{},stateKey:null}]});
    const layer=resolved.layers?.[0];
    if(layer?.state==='available')throw new Error(`Two independently reviewed production assets (${active.map(a=>a.assetId).join(', ')}) own the same exact tuple, and the resolver silently selected ${layer.assetId}. Exact production identity must be unique or ambiguity must block customer output.`);
  }finally{db.close()}
});

check('WF4-PROJECT-RENDER-TRUST-BOUNDARY','WF4','Project/share/quote snapshots must not trust customer-supplied production-ready render metadata that is not backed by the governed resolver.',()=>{
  const db=new RigDatabase(':memory:');
  const customer={actorId:'wf5-customer',displayName:'WF5 Customer',role:'customer'};
  try{
    const fakeSha='1'.repeat(64),fakeAsset='WF5-UNSUPPORTED-CUSTOMER-ASSET';
    const tampered={reference:'P4X4-WF5-RENDER-TRUST',vehicle:{id:'nissan-y62-warrior-2025',yearRange:'2025',make:'Nissan',model:'Patrol Y62',trim:'Warrior'},lead:{name:'WF5 QA'},selections:[],pricing:{currency:'AUD',components:{parts:0,labour:0,paint:0,freight:0,engineering:0},unpricedComponentCounts:{parts:0,labour:0,paint:0,freight:0,engineering:0},knownSubtotal:0,isComplete:true},gates:[],render:{view:'front34',fallbackPolicy:'none',productionReady:true,exactMatchRequired:true,stateVariant:{paintId:'black-obsidian',wheelTyreId:'factory-warrior'},resolverVersion:'customer-claimed',layers:[{layerId:'base',exactSku:null,state:'available',reason:null,assetId:fakeAsset,checksumSha256:fakeSha}]},workflow:{status:'ready-to-quote',owner:null,staffNotes:'',lastUpdatedAt:'2026-09-14T01:20:00+09:30'},catalogue:{revision:'WF5-QA'},contract:{version:'0.12.0'}};
    const saved=db.saveProjectRevision('P4X4-PROJ-WF5-RENDER-TRUST',tampered,{expectedVersion:0,source:'wf5-negative-fixture',actor:customer});
    const share=db.createShare(saved.project.id,{revisionId:saved.revision.id,role:'customer-view',expiresDays:1},{actor:customer});
    const resolvedShare=db.resolveShare(share.token);
    const quote=db.upsertQuote(saved.snapshot,{actor:customer,action:'quote.submitted'});
    const surfaces=[['project revision',saved.snapshot.render],['customer share',resolvedShare?.revision?.snapshot?.render],['quote',quote.render]];
    for(const [label,render] of surfaces){
      const fake=(render?.layers||[]).find(x=>x.assetId===fakeAsset&&x.checksumSha256===fakeSha&&x.state==='available');
      if(render?.productionReady===true&&fake)throw new Error(`${label} trusted unsupported customer-supplied available render ${fakeAsset}; production visual state must be server-resolved/governed before persistence.`);
    }
  }finally{db.close()}
});

check('WF4-QUOTE-PROJECT-REVISION-BINDING','WF4','A quote that claims project/revision lineage must be rejected or canonicalised if its commercial/render payload differs from that immutable project revision.',()=>{
  const db=new RigDatabase(':memory:');
  const customer={actorId:'wf5-customer',displayName:'WF5 Customer',role:'customer'},admin={actorId:'wf5-admin',displayName:'WF5 Admin',role:'admin'};
  try{
    const base={reference:'P4X4-WF5-REVISION-BIND',vehicle:{id:'nissan-y62-warrior-2025',yearRange:'2025',make:'Nissan',model:'Patrol Y62',trim:'Warrior'},lead:{name:'Original Revision Customer'},selections:[],pricing:{currency:'AUD',components:{parts:0,labour:0,paint:0,freight:0,engineering:0},unpricedComponentCounts:{parts:0,labour:0,paint:0,freight:0,engineering:0},knownSubtotal:0,isComplete:true},gates:[],render:{view:'front34',fallbackPolicy:'none',productionReady:false,exactMatchRequired:true,layers:[{layerId:'base',exactSku:null,state:'missing',reason:'reference-only-not-production',assetId:null,checksumSha256:null}]},workflow:{status:'ready-to-quote',owner:null,staffNotes:'',lastUpdatedAt:'2026-09-14T02:30:00+09:30'},catalogue:{revision:'WF5-QA'},contract:{version:'0.12.0'}};
    const saved=db.saveProjectRevision('P4X4-PROJ-WF5-REVISION-BIND',base,{expectedVersion:0,source:'wf5-lineage-fixture',actor:customer});
    const canonicalProject=db.getProject(saved.project.id,{actor:customer});
    const canonicalRevision=(canonicalProject.revisions||[]).find(r=>r.id===saved.revision.id);
    if(!canonicalRevision)throw new Error('Positive-control immutable project revision missing');
    const tampered={...saved.snapshot,
      lead:{...saved.snapshot.lead,name:'TAMPERED OUTSIDE R0001'},
      selections:[{id:'WF5-INJECTED-LINE',sku:'WF5-INJECTED-LINE',name:'Injected line never saved in R0001',pricing:{parts:0,labour:0,paint:0,freight:0,engineering:0},pricingRequired:[],fitment:{reviewRequired:false}}],
      gates:[],
      render:{...saved.snapshot.render,productionReady:true,layers:[{layerId:'base',exactSku:null,state:'available',reason:null,assetId:'WF5-UNSAVED-REVISION-ASSET',checksumSha256:'3'.repeat(64)}]}
    };
    let quote=null,rejected=false,code=null;
    try{quote=db.upsertQuote(tampered,{actor:customer,action:'quote.submitted'})}catch(e){rejected=true;code=e?.code||null}
    if(rejected){
      if(!['quote_revision_mismatch','project_revision_mismatch','conflict','validation_error'].includes(code))throw new Error(`Unexpected project/revision lineage rejection code ${code}`);
      return;
    }
    const canonical=canonicalRevision.snapshot;
    const canonicalised=quote?.lead?.name===canonical.lead?.name &&
      JSON.stringify(quote?.selections||[])===JSON.stringify(canonical.selections||[]) &&
      quote?.render?.productionReady===canonical.render?.productionReady &&
      JSON.stringify(quote?.render?.layers||[])===JSON.stringify(canonical.render?.layers||[]);
    if(canonicalised)return;
    let finalised=false;
    try{const issued=db.finaliseQuote(quote.reference,{actor:admin});finalised=issued?.quoteFinalisation?.status==='finalised'}catch{}
    throw new Error(`Quote accepted payload that differs from immutable ${saved.revision.id} while still claiming that project/revision lineage${finalised?' and it could be formally finalised':''}. Quote intake must bind to the stored revision snapshot or create an explicit new revision.`);
  }finally{db.close()}
});


check('WF4-QUOTE-LINEAGE-REQUIRED','WF4','A formal quote must be bound to an existing immutable project revision before staff finalisation; standalone/unbound customer quote snapshots must not be issuable.',()=>{
  const db=new RigDatabase(':memory:');
  const customer={actorId:'wf5-customer',displayName:'WF5 Customer',role:'customer'},admin={actorId:'wf5-admin',displayName:'WF5 Admin',role:'admin'};
  try{
    const unbound={
      reference:'P4X4-WF5-UNBOUND-FORMAL',
      vehicle:{id:'nissan-y62-warrior-2025',yearRange:'2025',make:'Nissan',model:'Patrol Y62',trim:'Warrior'},
      lead:{name:'Unbound Formal Quote Control'},
      selections:[],
      gates:[],
      render:{view:'front34',fallbackPolicy:'none',productionReady:false,exactMatchRequired:true,layers:[]},
      workflow:{status:'ready-to-quote',owner:null,staffNotes:'',lastUpdatedAt:'2026-09-14T14:40:00+09:30'},
      catalogue:{revision:'WF5-QA'},
      contract:{version:'0.12.0'}
    };
    let queued=null,rejectedAtIntake=false,intakeCode=null;
    try{queued=db.upsertQuote(unbound,{actor:customer,action:'quote.submitted'})}catch(e){rejectedAtIntake=true;intakeCode=e?.code||null}
    if(rejectedAtIntake){
      if(!['quote_lineage_required','project_revision_required','validation_error','quote_gate_blocked'].includes(intakeCode))throw new Error(`Unexpected unbound-quote intake rejection code ${intakeCode}`);
      return;
    }
    if(queued?.project?.id&&queued?.project?.revisionId){
      const p=db.getProject(queued.project.id,{actor:customer});
      const r=p?.revisions?.find(x=>x.id===queued.project.revisionId);
      if(p&&r)return;
    }
    let issued=null,rejected=false,code=null;
    try{issued=db.finaliseQuote(unbound.reference,{actor:admin})}catch(e){rejected=true;code=e?.code||null}
    if(rejected){
      if(!['quote_lineage_required','project_revision_required','validation_error','quote_gate_blocked','conflict'].includes(code))throw new Error(`Unexpected unbound-quote finalisation rejection code ${code}`);
      return;
    }
    if(issued?.quoteFinalisation?.status==='finalised'||issued?.workflow?.status==='quoted'){
      throw new Error(`Formal quote ${issued?.quoteFinalisation?.quoteNumber||unbound.reference} was issued without an existing immutable project/revision binding. Staff finalisation must verify a persisted project revision and bind the quote to that exact revision before issuance.`);
    }
  }finally{db.close()}
});

check('WF4-QUOTE-LINEAGE-EXISTENCE','WF4','A formal quote that supplies project/revision identifiers must prove that the exact immutable revision exists; fabricated or stale lineage identifiers must not be issuable.',()=>{
  const db=new RigDatabase(':memory:');
  const customer={actorId:'wf5-lineage-owner',displayName:'WF5 Lineage Owner',role:'customer'},admin={actorId:'wf5-admin',displayName:'WF5 Admin',role:'admin'};
  try{
    const projectId='P4X4-PROJ-WF5-LINEAGE-EXISTS',reference='P4X4-WF5-LINEAGE-EXISTS';
    const base={reference,vehicle:{id:'nissan-y62-warrior-2025',yearRange:'2025',make:'Nissan',model:'Patrol Y62',trim:'Warrior'},lead:{name:'Lineage Existence Control'},selections:[],gates:[],render:{view:'front34',fallbackPolicy:'none',productionReady:false,exactMatchRequired:true,layers:[]},workflow:{status:'ready-to-quote',owner:null,staffNotes:'',lastUpdatedAt:'2026-09-14T15:55:00+09:30'},catalogue:{revision:'WF5-QA'},contract:{version:'0.12.0'}};
    const saved=db.saveProjectRevision(projectId,base,{expectedVersion:0,source:'wf5-lineage-existence-fixture',actor:customer});
    if(saved.revision?.id!=='R0001')throw new Error('Positive-control immutable R0001 was not created');
    const forgedRevisionId='R9999';
    const forged={...saved.snapshot,project:{...saved.snapshot.project,id:projectId,revisionId:forgedRevisionId,revisionNumber:9999},lead:{...saved.snapshot.lead,name:'Forged stale lineage'},workflow:{...saved.snapshot.workflow,status:'ready-to-quote'}};
    let queued=null,rejectedAtIntake=false,intakeCode=null;
    try{queued=db.upsertQuote(forged,{actor:customer,action:'quote.submitted'})}catch(e){rejectedAtIntake=true;intakeCode=e?.code||null}
    if(rejectedAtIntake){
      if(!['quote_lineage_invalid','project_revision_not_found','not_found','validation_error','conflict'].includes(intakeCode))throw new Error(`Unexpected forged-lineage intake rejection code ${intakeCode}`);
      return;
    }
    const p=db.getProject(projectId,{actor:customer});
    if((p?.revisions||[]).some(r=>r.id===forgedRevisionId))throw new Error('Negative fixture accidentally created the forged revision');
    let issued=null,rejected=false,code=null;
    try{issued=db.finaliseQuote(reference,{actor:admin})}catch(e){rejected=true;code=e?.code||null}
    if(rejected){
      if(!['quote_lineage_invalid','project_revision_not_found','not_found','validation_error','quote_gate_blocked','conflict'].includes(code))throw new Error(`Unexpected forged-lineage finalisation rejection code ${code}`);
      return;
    }
    if(issued?.quoteFinalisation?.status==='finalised'||issued?.workflow?.status==='quoted'){
      throw new Error(`Formal quote ${issued?.quoteFinalisation?.quoteNumber||reference} was issued while claiming ${projectId}/${forgedRevisionId}, but that immutable revision does not exist (only ${saved.revision.id} exists). Project/revision IDs must be resolved server-side before formal issuance; supplied identifiers cannot be trusted as lineage evidence.`);
    }
  }finally{db.close()}
});

check('WF4-QUOTE-LINEAGE-OWNERSHIP','WF4','A customer must not be able to submit or formally issue a quote bound to an immutable project revision owned by another customer.',()=>{
  const db=new RigDatabase(':memory:');
  const owner={actorId:'wf5-lineage-owner-a',displayName:'WF5 Lineage Owner A',role:'customer'},intruder={actorId:'wf5-lineage-owner-b',displayName:'WF5 Lineage Owner B',role:'customer'},admin={actorId:'wf5-admin',displayName:'WF5 Admin',role:'admin'};
  try{
    const projectId='P4X4-PROJ-WF5-LINEAGE-OWNER',reference='P4X4-WF5-LINEAGE-OWNER';
    const base={reference,vehicle:{id:'nissan-y62-warrior-2025',yearRange:'2025',make:'Nissan',model:'Patrol Y62',trim:'Warrior'},lead:{name:'Owner A Private Build'},selections:[],gates:[],render:{view:'front34',fallbackPolicy:'none',productionReady:false,exactMatchRequired:true,layers:[]},workflow:{status:'ready-to-quote',owner:null,staffNotes:'',lastUpdatedAt:'2026-09-14T16:20:00+09:30'},catalogue:{revision:'WF5-QA'},contract:{version:'0.12.0'}};
    const saved=db.saveProjectRevision(projectId,base,{expectedVersion:0,source:'wf5-lineage-ownership-fixture',actor:owner});
    if(saved.revision?.id!=='R0001')throw new Error('Positive-control immutable R0001 was not created');
    let ownershipBoundary=false;
    try{db.getProject(projectId,{actor:intruder})}catch(e){ownershipBoundary=e?.code==='forbidden'}
    if(!ownershipBoundary)throw new Error('Project ownership positive-control did not deny Customer B access to Customer A project');
    let queued=null,rejectedAtIntake=false,intakeCode=null;
    try{queued=db.upsertQuote(saved.snapshot,{actor:intruder,action:'quote.submitted'})}catch(e){rejectedAtIntake=true;intakeCode=e?.code||null}
    if(rejectedAtIntake){
      if(!['forbidden','quote_lineage_forbidden','project_access_forbidden','validation_error','conflict'].includes(intakeCode))throw new Error(`Unexpected foreign-lineage intake rejection code ${intakeCode}`);
      return;
    }
    let issued=null,rejected=false,code=null;
    try{issued=db.finaliseQuote(reference,{actor:admin})}catch(e){rejected=true;code=e?.code||null}
    if(rejected){
      if(!['forbidden','quote_lineage_forbidden','project_access_forbidden','quote_lineage_invalid','validation_error','quote_gate_blocked','conflict'].includes(code))throw new Error(`Unexpected foreign-lineage finalisation rejection code ${code}`);
      return;
    }
    if(issued?.quoteFinalisation?.status==='finalised'||issued?.workflow?.status==='quoted'){
      throw new Error(`Customer ${intruder.actorId} submitted and obtained formal issuance for ${projectId}/${saved.revision.id}, which is owned by ${owner.actorId}. Quote lineage must be authorised against the submitting customer/lead context before intake and preserved through staff finalisation; a real revision is not sufficient if it belongs to another customer.`);
    }
  }finally{db.close()}
});

check('WF4-QUOTE-REFERENCE-OWNERSHIP','WF4','A customer must not be able to overwrite another customer\'s existing draft quote by reusing its client-supplied reference.',()=>{
  const db=new RigDatabase(':memory:');
  const owner={actorId:'wf5-quote-owner-a',displayName:'WF5 Quote Owner A',role:'customer'},intruder={actorId:'wf5-quote-owner-b',displayName:'WF5 Quote Owner B',role:'customer'};
  try{
    const reference='P4X4-WF5-QUOTE-REFERENCE-OWNER';
    const original={reference,vehicle:{id:'nissan-y62-warrior-2025',yearRange:'2025',make:'Nissan',model:'Patrol Y62',trim:'Warrior'},lead:{name:'Customer A Private Quote',phone:'0400000001'},selections:[],gates:[],render:{view:'front34',fallbackPolicy:'none',productionReady:false,exactMatchRequired:true,layers:[]},workflow:{status:'ready-to-quote',owner:null,staffNotes:'Customer A draft',lastUpdatedAt:'2026-09-14T17:10:00+09:30'},catalogue:{revision:'WF5-QA'},contract:{version:'0.12.0'}};
    const created=db.upsertQuote(original,{actor:owner,action:'quote.submitted'});
    if(created?.lead?.name!==original.lead.name)throw new Error('Quote ownership fixture failed to create Customer A draft');
    const hijack={...original,vehicle:{id:'ford-ranger-nextgen-2025',yearRange:'2025',make:'Ford',model:'Ranger',trim:'Wildtrak'},lead:{name:'Customer B Hijacked Quote',phone:'0400000002'},workflow:{...original.workflow,staffNotes:'Customer B replaced the record',lastUpdatedAt:'2026-09-14T17:11:00+09:30'}};
    let rejected=false,code=null;
    try{db.upsertQuote(hijack,{actor:intruder,action:'quote.submitted'})}catch(e){rejected=true;code=e?.code||null}
    if(rejected){
      if(!['forbidden','quote_owner_mismatch','quote_reference_conflict','conflict'].includes(code))throw new Error(`Unexpected foreign quote-reference rejection code ${code}`);
      return;
    }
    const after=db.getQuote(reference);
    if(after?.lead?.name!==original.lead.name||after?.lead?.phone!==original.lead.phone||after?.vehicle?.id!==original.vehicle.id||after?.workflow?.staffNotes!==original.workflow.staffNotes){
      throw new Error(`Customer ${intruder.actorId} overwrote ${owner.actorId}'s existing draft quote by reusing reference ${reference}. Quote references must be server-owned/unguessable or bound to the authenticated customer so a foreign customer cannot replace another customer's commercial record before staff review.`);
    }
  }finally{db.close()}
});

check('WF4-QUOTE-FINALISATION-AUTHORITY','WF4','Customer quote intake must not be able to forge formal quote issuance/finalisation state; only the governed staff finalisation transition may mint formal quote evidence.',()=>{
  const db=new RigDatabase(':memory:');
  const customer={actorId:'wf5-customer',displayName:'WF5 Customer',role:'customer'};
  try{
    const forged={
      reference:'P4X4-WF5-FORGED-FINAL',
      vehicle:{id:'nissan-y62-warrior-2025',yearRange:'2025',make:'Nissan',model:'Patrol Y62',trim:'Warrior'},
      lead:{name:'Forged Finalisation Control'},
      selections:[{id:'WF5-UNPRICED',sku:'WF5-UNPRICED',name:'Unpriced fitment item',pricing:{parts:null,labour:null,paint:null,freight:null,engineering:null},pricingRequired:['parts','labour'],fitment:{reviewRequired:true}}],
      gates:[{type:'fitment-review',id:'WF5-UNPRICED',note:'Explicit unresolved fitment review gate'}],
      render:{view:'front34',fallbackPolicy:'none',productionReady:false,exactMatchRequired:true,layers:[]},
      workflow:{status:'quoted',owner:null,staffNotes:'',lastUpdatedAt:'2026-09-14T13:20:00+09:30'},
      quoteFinalisation:{status:'finalised',quoteNumber:'Q-FORGED-BY-CUSTOMER',issuedAt:'2026-09-14T13:20:00+09:30',validUntil:'2099-12-31T23:59:59.000Z',customerTotal:1,labourRateUsed:1},
      catalogue:{revision:'WF5-QA'},contract:{version:'0.12.0'}
    };
    let out=null,rejected=false,code=null;
    try{out=db.upsertQuote(forged,{actor:customer,action:'quote.submitted'})}catch(e){rejected=true;code=e?.code||null}
    if(rejected){
      if(!['forbidden','quote_finalisation_forbidden','validation_error','quote_gate_blocked'].includes(code))throw new Error(`Unexpected forged-finalisation rejection code ${code}`);
      return;
    }
    const persisted=db.getQuote(forged.reference)||out;
    const formal=persisted?.quoteFinalisation||{};
    const workflowStatus=persisted?.workflow?.status;
    const forgedFormal=formal.status==='finalised'||formal.quoteNumber==='Q-FORGED-BY-CUSTOMER'||formal.issuedAt==='2026-09-14T13:20:00+09:30'||formal.validUntil==='2099-12-31T23:59:59.000Z';
    if(forgedFormal||workflowStatus==='quoted'||persisted?.fitmentReview?.allApproved===true||persisted?.pricing?.isComplete===true){
      throw new Error(`Customer quote intake accepted client-authored formal issuance state (workflow=${workflowStatus}, finalisation=${formal.status}, quoteNumber=${formal.quoteNumber}) despite unresolved fitment/pricing. Formal quote fields must be server-authoritative and created only by the staff finalisation transition.`);
    }
  }finally{db.close()}
});

check('WF4-QUOTE-REFINALISATION-IMMUTABILITY','WF4','Re-finalising an already issued formal quote must be rejected or idempotent; it must not silently reissue the same quote under new settings/timestamps.',()=>{
  const db=new RigDatabase(':memory:');
  const customer={actorId:'wf5-customer',displayName:'WF5 Customer',role:'customer'},admin={actorId:'wf5-admin',displayName:'WF5 Admin',role:'admin'};
  try{
    const base={reference:'P4X4-WF5-REFINALISE-IMMUTABLE',vehicle:{id:'nissan-y62-warrior-2025',yearRange:'2025',make:'Nissan',model:'Patrol Y62',trim:'Warrior'},lead:{name:'Re-finalisation Control'},selections:[],pricing:{currency:'AUD',components:{parts:0,labour:0,paint:0,freight:0,engineering:0},unpricedComponentCounts:{parts:0,labour:0,paint:0,freight:0,engineering:0},knownSubtotal:0,isComplete:true},gates:[],render:{view:'front34',fallbackPolicy:'none',productionReady:false,exactMatchRequired:true,layers:[]},workflow:{status:'ready-to-quote',owner:null,staffNotes:'',lastUpdatedAt:'2026-09-14T12:00:00+09:30'},catalogue:{revision:'WF5-QA'},contract:{version:'0.12.0'}};
    db.setSettings({labourRate:165,quoteValidityDays:14},{actor:admin});
    db.upsertQuote(base,{actor:customer,action:'quote.submitted'});
    const first=db.finaliseQuote(base.reference,{actor:admin});
    if(first?.quoteFinalisation?.status!=='finalised')throw new Error('Positive-control formal quote did not finalise');
    const issued=JSON.parse(JSON.stringify(first.quoteFinalisation));
    db.setSettings({labourRate:199,quoteValidityDays:30},{actor:admin});
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)),0,0,5);
    let second=null,rejected=false,code=null;
    try{second=db.finaliseQuote(base.reference,{actor:admin})}catch(e){rejected=true;code=e?.code||null}
    if(rejected){
      if(!['quote_finalised_immutable','already_finalised','conflict'].includes(code))throw new Error(`Unexpected quote re-finalisation rejection code ${code}`);
      return;
    }
    const after=second?.quoteFinalisation||{};
    const unchanged=after.status===issued.status &&
      after.quoteNumber===issued.quoteNumber &&
      after.issuedAt===issued.issuedAt &&
      after.validUntil===issued.validUntil &&
      after.customerTotal===issued.customerTotal &&
      after.labourRateUsed===issued.labourRateUsed;
    if(!unchanged)throw new Error(`Re-finalising an issued quote mutated issuance evidence in place (issuedAt ${issued.issuedAt} -> ${after.issuedAt}, validUntil ${issued.validUntil} -> ${after.validUntil}, labourRateUsed ${issued.labourRateUsed} -> ${after.labourRateUsed}). Issued formal quotes must be immutable/idempotent; commercial changes require an explicit new quote revision/reference.`);
  }finally{db.close()}
});

check('WF4-FINALISED-QUOTE-IMMUTABILITY','WF4','A finalised formal quote must be immutable to subsequent customer upsert using the same reference.',()=>{
  const db=new RigDatabase(':memory:');
  const customer={actorId:'wf5-customer',displayName:'WF5 Customer',role:'customer'},admin={actorId:'wf5-admin',displayName:'WF5 Admin',role:'admin'};
  try{
    const base={reference:'P4X4-WF5-FINAL-IMMUTABLE',vehicle:{id:'nissan-y62-warrior-2025',yearRange:'2025',make:'Nissan',model:'Patrol Y62',trim:'Warrior'},lead:{name:'Original Customer'},selections:[],pricing:{currency:'AUD',components:{parts:0,labour:0,paint:0,freight:0,engineering:0},unpricedComponentCounts:{parts:0,labour:0,paint:0,freight:0,engineering:0},knownSubtotal:0,isComplete:true},gates:[],render:{view:'front34',fallbackPolicy:'none',productionReady:false,exactMatchRequired:true,layers:[{layerId:'base',exactSku:null,state:'missing',reason:'reference-only-not-production',assetId:null,checksumSha256:null}]},workflow:{status:'ready-to-quote',owner:null,staffNotes:'',lastUpdatedAt:'2026-09-14T01:25:00+09:30'},catalogue:{revision:'WF5-QA'},contract:{version:'0.12.0'}};
    db.upsertQuote(base,{actor:customer,action:'quote.submitted'});
    const finalised=db.finaliseQuote(base.reference,{actor:admin});
    if(finalised.quoteFinalisation?.status!=='finalised'||finalised.workflow?.status!=='quoted')throw new Error('Positive-control formal quote did not finalise');
    const originalNumber=finalised.quoteFinalisation.quoteNumber,originalIssued=finalised.quoteFinalisation.issuedAt;
    const tampered={...base,lead:{name:'MUTATED AFTER FINALISATION'},workflow:{...base.workflow,status:'ready-to-quote'},render:{...base.render,productionReady:true,layers:[{layerId:'base',exactSku:null,state:'available',reason:null,assetId:'WF5-FAKE-AFTER-FINAL',checksumSha256:'2'.repeat(64)}]}};
    let rejected=false,code=null;
    try{db.upsertQuote(tampered,{actor:customer,action:'quote.submitted'})}catch(e){rejected=true;code=e?.code||null}
    if(rejected){
      if(!['quote_finalised_immutable','forbidden','conflict'].includes(code))throw new Error(`Unexpected finalised-quote rejection code ${code}`);
      return;
    }
    const after=db.getQuote(base.reference);
    if(after?.lead?.name!=='Original Customer'||after?.workflow?.status!=='quoted'||after?.quoteFinalisation?.status!=='finalised'||after?.quoteFinalisation?.quoteNumber!==originalNumber||after?.quoteFinalisation?.issuedAt!==originalIssued||after?.render?.productionReady!==false){
      throw new Error('Customer upsert mutated a finalised formal quote in place. Finalised quote payload/lineage must be immutable; later changes require a new governed quote revision/reference.');
    }
  }finally{db.close()}
});

check('WF4-FINALISED-QUOTE-STAFF-MUTATION','WF4','A finalised formal quote must be immutable to later staff review/update writes; staff edits after issuance require a new governed quote revision/reference.',()=>{
  const db=new RigDatabase(':memory:');
  const customer={actorId:'wf5-customer',displayName:'WF5 Customer',role:'customer'},sales={actorId:'wf5-sales',displayName:'WF5 Sales',role:'sales'},admin={actorId:'wf5-admin',displayName:'WF5 Admin',role:'admin'};
  try{
    const base={reference:'P4X4-WF5-FINAL-STAFF-IMMUTABLE',vehicle:{id:'nissan-y62-warrior-2025',yearRange:'2025',make:'Nissan',model:'Patrol Y62',trim:'Warrior'},lead:{name:'Issued Customer'},selections:[],gates:[],render:{view:'front34',fallbackPolicy:'none',productionReady:false,exactMatchRequired:true,layers:[]},workflow:{status:'ready-to-quote',owner:null,staffNotes:'Pre-issue review',lastUpdatedAt:'2026-09-14T15:00:00+09:30'},catalogue:{revision:'WF5-QA'},contract:{version:'0.12.0'}};
    db.upsertQuote(base,{actor:customer,action:'quote.submitted'});
    const finalised=db.finaliseQuote(base.reference,{actor:admin});
    if(finalised?.quoteFinalisation?.status!=='finalised'||finalised?.workflow?.status!=='quoted')throw new Error('Positive-control formal quote did not finalise');
    const issuance=JSON.parse(JSON.stringify(finalised.quoteFinalisation));
    let out=null,rejected=false,code=null;
    try{out=db.updateQuote(base.reference,{lead:{...finalised.lead,name:'STAFF MUTATED AFTER ISSUE'},workflow:{...finalised.workflow,staffNotes:'Changed after issue'},render:{...finalised.render,productionReady:true,layers:[{layerId:'base',exactSku:null,state:'available',assetId:'WF5-FAKE-STAFF-MUTATION',checksumSha256:'9'.repeat(64)}]}},{actor:sales})}catch(e){rejected=true;code=e?.code||null}
    if(rejected){
      if(!['quote_finalised_immutable','forbidden','conflict'].includes(code))throw new Error(`Unexpected finalised-quote staff-update rejection code ${code}`);
      return;
    }
    const after=db.getQuote(base.reference)||out;
    const issuanceUnchanged=after?.quoteFinalisation?.status===issuance.status&&after?.quoteFinalisation?.quoteNumber===issuance.quoteNumber&&after?.quoteFinalisation?.issuedAt===issuance.issuedAt&&after?.quoteFinalisation?.validUntil===issuance.validUntil&&after?.quoteFinalisation?.customerTotal===issuance.customerTotal&&after?.quoteFinalisation?.labourRateUsed===issuance.labourRateUsed;
    const payloadUnchanged=after?.lead?.name==='Issued Customer'&&after?.workflow?.staffNotes==='Pre-issue review'&&after?.render?.productionReady===false;
    if(!issuanceUnchanged||!payloadUnchanged)throw new Error(`Staff update mutated an already-issued formal quote in place while retaining quote identity ${after?.quoteFinalisation?.quoteNumber||'unknown'}. Issued quote payload, BOM/render lineage and commercial evidence must be immutable to every update path; post-issue changes require a new governed quote revision/reference.`);
  }finally{db.close()}
});


check('WF4-QUOTE-FINALISER-IDENTITY','WF4','Formal quote issuance evidence must bind the authenticated staff finaliser identity to the issued quote, rather than leaving only the original customer snapshot actor.',()=>{
  const db=new RigDatabase(':memory:');
  const customer={actorId:'wf5-issuer-customer',displayName:'WF5 Issuer Customer',role:'customer'},admin={actorId:'wf5-issuer-admin',displayName:'WF5 Issuer Admin',role:'admin'};
  try{
    const base={reference:'P4X4-WF5-ISSUER-EVIDENCE',vehicle:{id:'nissan-y62-warrior-2025',yearRange:'2025',make:'Nissan',model:'Patrol Y62',trim:'Warrior'},lead:{name:'Issuer Evidence Customer'},selections:[],gates:[],render:{view:'front34',fallbackPolicy:'none',productionReady:false,exactMatchRequired:true,layers:[]},workflow:{status:'ready-to-quote',owner:null,staffNotes:'',lastUpdatedAt:'2026-09-14T19:10:00+09:30'},catalogue:{revision:'WF5-QA'},contract:{version:'0.12.0'}};
    const saved=db.saveProjectRevision('P4X4-PROJ-WF5-ISSUER-EVIDENCE',base,{expectedVersion:0,source:'wf5-qa',actor:customer});
    db.upsertQuote(saved.snapshot,{actor:customer,action:'quote.submitted'});
    const issued=db.finaliseQuote(base.reference,{actor:admin});
    if(issued?.quoteFinalisation?.status!=='finalised')throw new Error('Positive-control formal quote did not finalise');
    const evidence=issued.quoteFinalisation?.finalisedBy||issued.quoteFinalisation?.issuedBy||issued.quoteFinalisation?.actor||null;
    const actorId=evidence?.actorId||evidence?.id||null;
    if(actorId!==admin.actorId){
      throw new Error(`Formal quote ${issued.quoteFinalisation?.quoteNumber||base.reference} has no immutable finaliser identity bound to quoteFinalisation (expected ${admin.actorId}, got ${actorId||'none'}). The root snapshot actor remains ${issued.actor?.actorId||'none'}, so the issued document cannot prove which authenticated staff identity authorised issuance.`);
    }
  }finally{db.close()}
});

check('WF4-QUOTE-REVISION-CHECKSUM-BINDING','WF4','Formal quote issuance must pin the exact immutable project-revision checksum used for approval so the issued commercial record can be verified independently of mutable project metadata.',()=>{
  const db=new RigDatabase(':memory:');
  const customer={actorId:'wf5-checksum-customer',displayName:'WF5 Checksum Customer',role:'customer'},admin={actorId:'wf5-checksum-admin',displayName:'WF5 Checksum Admin',role:'admin'};
  try{
    const base={reference:'P4X4-WF5-REVISION-CHECKSUM',vehicle:{id:'nissan-y62-warrior-2025',yearRange:'2025',make:'Nissan',model:'Patrol Y62',trim:'Warrior'},lead:{name:'Revision Checksum Customer'},selections:[],gates:[],render:{view:'front34',fallbackPolicy:'none',productionReady:false,exactMatchRequired:true,layers:[]},workflow:{status:'ready-to-quote',owner:null,staffNotes:'',lastUpdatedAt:'2026-09-14T19:15:00+09:30'},catalogue:{revision:'WF5-QA'},contract:{version:'0.12.0'}};
    const saved=db.saveProjectRevision('P4X4-PROJ-WF5-REVISION-CHECKSUM',base,{expectedVersion:0,source:'wf5-qa',actor:customer});
    db.upsertQuote(saved.snapshot,{actor:customer,action:'quote.submitted'});
    const issued=db.finaliseQuote(base.reference,{actor:admin});
    if(issued?.quoteFinalisation?.status!=='finalised')throw new Error('Positive-control formal quote did not finalise');
    const bound=issued.quoteFinalisation?.projectRevisionChecksum||issued.quoteFinalisation?.revisionChecksum||issued.project?.revisionChecksum||issued.lineage?.projectRevisionChecksum||null;
    if(bound!==saved.revision.checksum){
      throw new Error(`Formal quote ${issued.quoteFinalisation?.quoteNumber||base.reference} identifies ${issued.project?.id||'no project'}/${issued.project?.revisionId||'no revision'} but does not bind immutable revision checksum ${saved.revision.checksum} into issuance evidence (found ${bound||'none'}). IDs alone are insufficient to prove the exact approved snapshot after issuance.`);
    }
  }finally{db.close()}
});

check('WF4-SHARE-REVISION-ISOLATION','WF4','A public share token pinned to one immutable revision must not expose later unshared project revisions or silently follow the project current revision.',()=>{
  const db=new RigDatabase(':memory:');
  const customer={actorId:'wf5-share-owner',displayName:'WF5 Share Owner',role:'customer'};
  try{
    const projectId='P4X4-PROJ-WF5-SHARE-ISOLATION',reference='P4X4-WF5-SHARE-ISOLATION';
    const base={reference,vehicle:{id:'nissan-y62-warrior-2025',yearRange:'2025',make:'Nissan',model:'Patrol Y62',trim:'Warrior'},lead:{name:'Shared R1',phone:'0400000000',email:'',postcode:'',preferredContact:'phone',notes:''},selections:[],pricing:{currency:'AUD',components:{parts:0,labour:0,paint:0,freight:0,engineering:0},unpricedComponentCounts:{parts:0,labour:0,paint:0,freight:0,engineering:0},knownSubtotal:0,isComplete:true},gates:[],render:{view:'front34',fallbackPolicy:'none',productionReady:false,exactMatchRequired:true,layers:[]},workflow:{status:'ready-to-quote',owner:null,staffNotes:'R1 only',lastUpdatedAt:'2026-09-14T08:00:00+09:30'},catalogue:{revision:'WF5-QA'},contract:{version:'0.12.0'}};
    const r1=db.saveProjectRevision(projectId,base,{expectedVersion:0,source:'wf5-qa',actor:customer});
    const share=db.createShare(projectId,{revisionId:r1.revision.id,role:'customer-view',expiresDays:1},{actor:customer});
    const r2=db.saveProjectRevision(projectId,{...base,lead:{...base.lead,name:'PRIVATE R2 — MUST NOT LEAK'},workflow:{...base.workflow,staffNotes:'PRIVATE FUTURE REVISION'}},{expectedVersion:2,source:'wf5-qa',actor:customer});
    if(r2.revision.id!=='R0002')throw new Error('Share-isolation fixture failed to create private R0002');
    const resolved=db.resolveShare(share.token);
    if(!resolved||resolved.revision?.id!=='R0001')throw new Error('Pinned share no longer resolves its intended R0001 revision');
    const leaked=(resolved.project?.revisions||[]).filter(r=>r.id!==resolved.revision.id);
    if(leaked.length){
      const leakedIds=leaked.map(r=>r.id).join(', '),privateName=leaked.some(r=>r.snapshot?.lead?.name==='PRIVATE R2 — MUST NOT LEAK');
      throw new Error(`Public R0001 share response exposes later unshared revision(s) ${leakedIds}${privateName?' including private R0002 snapshot data':''}. Share resolution must return only pinned/sanitised project metadata plus the shared immutable revision.`);
    }
    if(resolved.project?.currentRevisionId&&resolved.project.currentRevisionId!==resolved.revision.id)throw new Error(`Public share follows/leaks currentRevisionId=${resolved.project.currentRevisionId} instead of remaining pinned to ${resolved.revision.id}.`);
  }finally{db.close()}
});


check('WF4-SHARE-REGISTRY-ISOLATION','WF4','A public share token must not expose the project share registry, sibling token hashes/hints, or other share-management metadata.',()=>{
  const db=new RigDatabase(':memory:');
  const customer={actorId:'wf5-share-registry-owner',displayName:'WF5 Share Registry Owner',role:'customer'};
  try{
    const projectId='P4X4-PROJ-WF5-SHARE-REGISTRY',reference='P4X4-WF5-SHARE-REGISTRY';
    const base={reference,vehicle:{id:'nissan-y62-warrior-2025',yearRange:'2025',make:'Nissan',model:'Patrol Y62',trim:'Warrior'},lead:{name:'Share Registry Customer'},selections:[],pricing:{currency:'AUD',components:{parts:0,labour:0,paint:0,freight:0,engineering:0},unpricedComponentCounts:{parts:0,labour:0,paint:0,freight:0,engineering:0},knownSubtotal:0,isComplete:true},gates:[],render:{view:'front34',fallbackPolicy:'none',productionReady:false,exactMatchRequired:true,layers:[]},workflow:{status:'ready-to-quote',owner:null,staffNotes:'',lastUpdatedAt:'2026-09-14T20:30:00+09:30'},catalogue:{revision:'WF5-QA'},contract:{version:'0.12.0'}};
    const saved=db.saveProjectRevision(projectId,base,{expectedVersion:0,source:'wf5-qa',actor:customer});
    const shareA=db.createShare(projectId,{revisionId:saved.revision.id,role:'customer-view',expiresDays:1},{actor:customer});
    const shareB=db.createShare(projectId,{revisionId:saved.revision.id,role:'customer-view',expiresDays:7},{actor:customer});
    if(!shareA?.token||!shareB?.token||shareA.token===shareB.token)throw new Error('Share-registry positive-control fixture did not create two distinct share tokens');
    const resolved=db.resolveShare(shareA.token);
    if(!resolved||resolved.revision?.id!==saved.revision.id)throw new Error('Share-registry positive-control token did not resolve its pinned revision');
    const siblingHash=shareB.tokenHash,siblingHint=shareB.tokenHint;
    const publicProjectShares=Array.isArray(resolved.project?.shares)?resolved.project.shares:[];
    const siblingLeak=publicProjectShares.some(x=>x?.tokenHash===siblingHash||x?.tokenHint===siblingHint);
    const ownManagementLeak=publicProjectShares.some(x=>x?.tokenHash===shareA.tokenHash||x?.tokenHint===shareA.tokenHint);
    const resolvedShareCarriesSecretMaterial=!!resolved.share?.tokenHash;
    if(siblingLeak||ownManagementLeak||resolvedShareCarriesSecretMaterial){
      throw new Error(`Public share response exposes share-management metadata${siblingLeak?' including a sibling token hash/hint':''}${ownManagementLeak?' including the active share token hash/hint in project.shares':''}${resolvedShareCarriesSecretMaterial?' and the active tokenHash in resolved.share':''}. Public resolution must return only the minimum pinned share descriptor plus sanitised project/revision data; the private share registry must remain owner/staff-only.`);
    }
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
